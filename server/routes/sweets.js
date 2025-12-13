const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const verify = require('./verifyToken');

router.get('/', async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET All Sweets (Protected)
router.get('/', verify, async (req, res) => {  // <--- Added 'verify' here
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new Sweet (Protected)
router.post('/', verify, async (req, res) => {
    const sweet = new Sweet({
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity
    });

    try {
        const savedSweet = await sweet.save();
        res.status(201).json(savedSweet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;