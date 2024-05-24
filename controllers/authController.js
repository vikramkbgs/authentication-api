const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const passport = require('passport');

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password, 
            name
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Set token as a cookie
        res.cookie('token', token, {
            httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
            secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
            expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour (1h * 60min * 60s * 1000ms)
            sameSite: 'strict' // Ensures the cookie is not sent along with cross-site requests
        });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token'); // Clear the JWT token cookie
    res.status(200).json({ message: 'Logged out successfully' });
};

const loginWithGoogle = passport.authenticate('google', { scope: ['profile', 'email'] });

const googleCallback = (req, res, next) => {
    passport.authenticate('google', async (err, user) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User data not found!' });
        }

        try {
            // Check if the user already exists in the database
            let existingUser = await User.findOne({ email: user._json.email });

            if (!existingUser) {
                // If the user does not exist, create a new user record
                existingUser = new User({
                    email: user._json.email,
                    password: user._json.email,
                    name:user.name
                });
                await existingUser.save();
            }

            // Generate JWT token
            const token = generateToken(existingUser);
            
            // Set token as a cookie
            res.cookie('token', token, {
                httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
                secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
                expires: new Date(Date.now() + 3600000), // Cookie expires in 1 hour (1h * 60min * 60s * 1000ms)
                sameSite: 'strict' // Ensures the cookie is not sent along with cross-site requests
            });

            res.status(201).json({ message: 'User logged in successfully' });
        } catch (error) {
            console.error('Error during Google OAuth callback:', error);
            return res.status(500).json({ message: 'Internal server error' }); // Redirect to login page on error
        }
    })(req, res, next);
};

const generateToken = (user) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = {
    register,
    login,
    loginWithGoogle,
    googleCallback,
    logout
};
