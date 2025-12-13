const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sweetsRoute = require('./routes/sweets');
const authRoute = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sweets', sweetsRoute);
app.use('/api/auth', authRoute);

mongoose.connect('mongodb://localhost:27017/sweetshop')
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});