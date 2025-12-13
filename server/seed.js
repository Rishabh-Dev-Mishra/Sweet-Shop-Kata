const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Sweet = require('./models/Sweet');
const User = require('./models/User');

dotenv.config();

const sweets = [
    {
        name: "Gulab Jamun",
        category: "Milk-Based Sweet",
        price: 350,
        quantity: 10
    },
    {
        name: "Rasgulla",
        category: "Chhena Sweet",
        price: 300,
        quantity: 12
    },
    {
        name: "Kaju Katli",
        category: "Dry Fruit Sweet",
        price: 900,
        quantity: 5
    },
    {
        name: "Motichoor Ladoo",
        category: "Ladoo",
        price: 420,
        quantity: 8
    },
    {
        name: "Soan Papdi",
        category: "Flaky Sweet",
        price: 280,
        quantity: 15
    },
    {
        name: "Mysore Pak",
        category: "Ghee-Based Sweet",
        price: 600,
        quantity: 6
    },
    {
        name: "Peda",
        category: "Milk-Based Sweet",
        price: 480,
        quantity: 7
    },
    {
        name: "Besan Barfi",
        category: "Barfi",
        price: 520,
        quantity: 9
    },
    {
        name: "Jalebi",
        category: "Fried Sweet",
        price: 250,
        quantity: 20
    },
    {
        name: "Kalakand",
        category: "Milk Cake",
        price: 550,
        quantity: 4
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to MongoDB...");

        await Sweet.deleteMany({});
        console.log("Old sweets cleared.");

        await Sweet.insertMany(sweets);
        console.log("🍬 Database seeded with fresh sweets!");

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

        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
};

seedDB();
