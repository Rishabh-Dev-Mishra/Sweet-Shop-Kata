const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// REGISTER ROUTE
router.post('/register', async (req, res) => {
    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // 2. Encrypt the password (Security Best Practice)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. Create the new user
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            role: 'user' // Default to normal user
        });

        // 4. Save to Database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
    try {
        // 1. Find the user
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // 2. Check the password
        // We compare the Plain Text (req.body.password) with the Hash (user.password)
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // 3. Generate Token (The Badge)
        // 'SecretKey' should be in a .env file in real production, but for this Kata we keep it simple.
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            'MySuperSecretKey',
            { expiresIn: '1h' }
        );

        res.header('auth-token', token).json({ token: token });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;