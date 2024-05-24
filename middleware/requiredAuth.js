const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = async (req, res, next) => {
    const token = req.headers.authorization;

    // Check if token exists
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Missing token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user based on decoded token
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Attach user object to request for further processing
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = requireAuth;
