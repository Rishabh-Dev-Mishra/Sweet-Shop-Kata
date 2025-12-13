const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Import bcrypt here
const Sweet = require('./models/Sweet');
const User = require('./models/User'); // Import User model

// Load environment variables
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
        // 1. Connect
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to MongoDB...");

        // 2. Clear existing Sweets
        await Sweet.deleteMany({});
        console.log("Old sweets cleared.");

        // 3. Insert new Sweets
        await Sweet.insertMany(sweets);
        console.log("🍬 Database seeded with fresh sweets!");

        // 4. Create Admin User
        // Check if admin already exists to prevent duplicate error
        const existingAdmin = await User.findOne({ username: "admin" });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("admin123", salt);

            const adminUser = new User({
                username: "admin123",
                password: hashedPassword,
                role: "admin"
            });

            await adminUser.save();
            console.log("👮 Admin user created: (username: admin, password: admin123)");
        } else {
            console.log("👮 Admin user already exists.");
        }

        // 5. Close Connection
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close(); // Close even if error
    }
};

// Execute
seedDB();