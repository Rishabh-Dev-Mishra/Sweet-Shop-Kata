const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // 1. Check if token exists in the header
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: "Access Denied" });

    try {
        // 2. Verify the token
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified; // Save the user info (id, role) for later usage
        next(); // PASS! Go to the next step (the route)
    } catch (err) {
        res.status(400).json({ message: "Invalid Token" });
    }
};

