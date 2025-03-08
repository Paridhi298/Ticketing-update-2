const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer'

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to request
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
    console.log("Authenticated User ID:", req.user.id);
};


const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission.' });
        }
        next();
    };
};



module.exports = { authenticateUser, authorizeRoles };