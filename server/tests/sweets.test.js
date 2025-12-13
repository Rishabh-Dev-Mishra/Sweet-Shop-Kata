const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const sweetsRoute = require('../routes/sweets');
const Sweet = require('../models/Sweet'); // Import the model to clean up data

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

describe('GET /api/sweets', () => {
    it('should return all sweets', async () => {
        // Create a fake sweet so we have something to find
        const sweet = new Sweet({
            name: "Test Choco",
            category: "Chocolate",
            price: 5,
            quantity: 10
        });
        await sweet.save();

        const res = await request(app).get('/api/sweets');

        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBe(1); // We should find the one we just added
        expect(res.body[0].name).toBe("Test Choco");
    });
});