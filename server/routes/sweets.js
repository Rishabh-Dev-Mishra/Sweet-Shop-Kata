const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');

router.get('/', async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;