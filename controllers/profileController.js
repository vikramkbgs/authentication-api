// controllers/profileController.js
const User = require('../models/User');

// Get normal user profile (only public profile)
const getUserNormalProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-privateField');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            phone: user.phone,
            profilePictureUrl: user.profilePictureUrl,
            isPublic: user.isPublic,

        };

        res.json(userProfile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get admin user profile (public and private profile)
const getUserAdminProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.phone = req.body.phone || user.phone;
        user.profilePictureUrl = req.body.profilePictureUrl || user.profilePictureUrl;
        user.isPublic = req.body.isPublic !== undefined ? req.body.isPublic : user.isPublic;

        await user.save();
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getAllUserProfiles = async (req, res) => {
    try {
        let query = {};
        // If user is not admin, only return public profiles
        if (req.user.role !== 'admin') {
            query.isPublic = true;

        }
        const projection = { password: 0 }; 
        const users = await User.find(query, projection);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getUserNormalProfile, getUserAdminProfile, updateUserProfile, getAllUserProfiles };
