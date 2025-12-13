const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const sweetsRoute = require('../routes/sweets');
const Sweet = require('../models/Sweet'); // Import the model to clean up data

require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/api/sweets', sweetsRoute);

// 1. Connect to Test Database before tests start
beforeAll(async () => {
    const url = 'mongodb://127.0.0.1:27017/sweetshop_test';
    await mongoose.connect(url);
});

// 2. Clean up database after each test (optional but good practice)
afterEach(async () => {
    await Sweet.deleteMany();
});

// 3. Close connection after tests finish (Prevents "Open Handles" error)
afterAll(async () => {
    await mongoose.connection.close();
});

// ... imports ...
// ... beforeAll / afterEach ...

describe('GET /api/sweets', () => {
    it('should return all sweets (if authorized)', async () => {
        // 1. Create a dummy user and get a token
        // We can cheat here and generate a token directly since we own the Secret Key
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ _id: 'dummyId', role: 'user' }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

        // 2. Create a dummy sweet
        const sweet = new Sweet({
            name: "Test Choco",
            category: "Chocolate",
            price: 5,
            quantity: 10
        });
        await sweet.save();

        // 3. Request with the Token header
        const res = await request(app)
            .get('/api/sweets')
            .set('auth-token', token); // <--- ATTACH THE TOKEN HERE

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1);
    });

    // ... previous tests ...

    it('should purchase a sweet and decrease quantity', async () => {
        // 1. Create a sweet with 5 items in stock
        const sweet = new Sweet({
            name: "KitKat",
            category: "Chocolate",
            price: 2,
            quantity: 5
        });
        const savedSweet = await sweet.save();

        // 2. Generate a fake user token (to pass security)
        const jwt = require('jsonwebtoken');
        const token = jwt.sign({ _id: 'dummyId', role: 'user' }, process.env.TOKEN_SECRET);

        // 3. Make the Purchase Request
        const res = await request(app)
            .post(`/api/sweets/${savedSweet._id}/purchase`)
            .set('auth-token', token);

        // 4. Expect success and quantity to be 4
        expect(res.statusCode).toEqual(200);
        expect(res.body.quantity).toEqual(4);
    });
});