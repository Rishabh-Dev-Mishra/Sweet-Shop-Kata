const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

require('dotenv').config();

router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            role: 'user' 
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        res.header('auth-token', token).json({
            token: token,
            role: user.role  
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;