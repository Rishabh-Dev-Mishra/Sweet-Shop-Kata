const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Sweet = require('./models/Sweet');

// Load environment variables (to get the DB Password/URL)
dotenv.config();

// Sample Data
const sweets = [
    {
        name: "Dark Chocolate Truffle",
        category: "Chocolate",
        price: 5,
        quantity: 10
    },
    {
        name: "Gummy Bears",
        category: "Candy",
        price: 3,
        quantity: 20
    },
    {
        name: "Sour Patch Kids",
        category: "Candy",
        price: 4,
        quantity: 15
    },
    {
        name: "Hazelnut Bar",
        category: "Chocolate",
        price: 6,
        quantity: 8
    },
    {
        name: "Peppermint Lolly",
        category: "Hard Candy",
        price: 2,
        quantity: 50
    },
    {
        name: "Caramel Fudge",
        category: "Fudge",
        price: 8,
        quantity: 5
    }
];

// The Seeding Logic
const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to MongoDB...");

        // Clear existing data to avoid duplicates
        await Sweet.deleteMany({});
        console.log("Old sweets cleared.");

        // Insert new data
        await Sweet.insertMany(sweets);
        console.log("🍬 Database seeded with fresh sweets!");

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
    }
};

seedDB();