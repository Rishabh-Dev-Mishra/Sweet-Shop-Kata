const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const verify = require('./verifyToken');
const verifyAdmin = require('./verifyAdmin');
const Order = require('../models/Order');

router.get('/', async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', verify, async (req, res) => {
    try {
        const sweets = await Sweet.find();
        res.status(200).json(sweets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', verify, verifyAdmin, async (req, res) => {
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

router.post('/:id/purchase', verify, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        const buyQty = req.body.buyQuantity || 1;

        if (sweet.quantity < buyQty) {
            return res.status(400).json({ message: "Out of Stock" });
        }

        sweet.quantity -= buyQty;
        const updatedSweet = await sweet.save();

        const newOrder = new Order({
            userId: req.user._id,
            sweetName: sweet.name,
            quantity: buyQty,
            totalPrice: sweet.price * buyQty
        });
        await newOrder.save();

        res.json(updatedSweet);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', verify, verifyAdmin, async (req, res) => {
    try {
        const removedSweet = await Sweet.findByIdAndDelete(req.params.id);
        res.json(removedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/:id/restock', verify, verifyAdmin, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        sweet.quantity += 5;
        const updatedSweet = await sweet.save();

        res.json(updatedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/:id', verify, verifyAdmin, async (req, res) => {
    try {
        const updatedSweet = await Sweet.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    name: req.body.name,
                    category: req.body.category,
                    price: req.body.price,
                    quantity: req.body.quantity
                }
            },
            { new: true }
        );
        res.json(updatedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/my/orders', verify, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
