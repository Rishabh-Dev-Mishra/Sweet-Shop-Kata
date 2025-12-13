const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const sweetsRoute = require('../routes/sweets'); // We haven't created this yet!
const app = express();

app.use(express.json());
app.use('/api/sweets', sweetsRoute);

// Mock Database Connection for simplicity in this example
// In real life, you'd connect to a test database here.

describe('GET /api/sweets', () => {
    it('should return all sweets', async () => {
        const res = await request(app).get('/api/sweets');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});