const express = require('express');
const router = express.Router();
const Sweet = require('../models/Sweet');
const verify = require('./verifyToken');
const verifyAdmin = require('./verifyAdmin');
const Order = require('../models/Order'); // <--- Import this

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

// PURCHASE a Sweet (Protected)
// PURCHASE a Sweet
router.post('/:id/purchase', verify, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        const buyQty = req.body.buyQuantity || 1;

        if (sweet.quantity < buyQty) {
            return res.status(400).json({ message: "Out of Stock" });
        }

        // 1. Decrease Stock
        sweet.quantity -= buyQty;
        const updatedSweet = await sweet.save();

        // 2. SAVE THE ORDER (The Receipt)
        const newOrder = new Order({
            userId: req.user._id, // Got from the token
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

// DELETE a Sweet (Admin Only)
// Notice we use TWO middlewares: verify (check login) AND verifyAdmin (check role)
router.delete('/:id', verify, verifyAdmin, async (req, res) => {
    try {
        const removedSweet = await Sweet.findByIdAndDelete(req.params.id);
        res.json(removedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// RESTOCK a Sweet (Admin Only)
router.post('/:id/restock', verify, verifyAdmin, async (req, res) => {
    try {
        const sweet = await Sweet.findById(req.params.id);
        if (!sweet) return res.status(404).json({ message: "Sweet not found" });

        // Add 5 to the quantity (or whatever amount you choose)
        sweet.quantity += 5;
        const updatedSweet = await sweet.save();

        res.json(updatedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// UPDATE a Sweet (Admin Only)
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
            { new: true } // Return the updated document
        );
        res.json(updatedSweet);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// GET MY ORDERS
router.get('/my/orders', verify, async (req, res) => {
    try {
        // Find orders where userId matches the logged-in user
        const orders = await Order.find({ userId: req.user._id }).sort({ date: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;