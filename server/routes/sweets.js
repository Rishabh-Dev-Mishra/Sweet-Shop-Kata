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

// PURCHASE a Sweet (Protected)
router.post('/:id/purchase', verify, async (req, res) => {
    try {
        // 1. Find the sweet
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        // 2. Check stock
        if (sweet.quantity < 1) {
            return res.status(400).json({ message: "Out of Stock" });
        }

        // 3. Decrease quantity and save
        sweet.quantity -= 1;
        const updatedSweet = await sweet.save();

        res.json(updatedSweet);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;