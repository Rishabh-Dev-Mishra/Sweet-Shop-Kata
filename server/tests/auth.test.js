const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('../routes/auth'); // We haven't created this yet!
const User = require('../models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoute);

// Connect to a TEST database (so we don't mess up your real data)
beforeAll(async () => {
    const url = 'mongodb://127.0.0.1:27017/sweetshop_test';
    await mongoose.connect(url);
});

// Clear the database after each test
afterEach(async () => {
    await User.deleteMany();
});

// Close connection when done
afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.message).toEqual('User registered successfully');
    });
});

// ... existing register test ...

describe('POST /api/auth/login', () => {
    it('should login user and return token', async () => {
        // 1. First, we must register a user so they exist in the DB
        await request(app)
            .post('/api/auth/register')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        // 2. Now try to login with those same details
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'loginuser',
                password: 'password123'
            });

        // 3. Expect success and a token
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token'); // The badge!
    });
});