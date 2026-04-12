const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = "mongodb://localhost:27017/auth_db"; 

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);

        const userSchema = new mongoose.Schema({
            email: String,
            password: String,
            role: String
        });
        const User = mongoose.model('User', userSchema);

        const adminExists = await User.findOne({ email: 'admin@elite.com' });
        if (adminExists) {
            console.log("✔️ Admin already exists.");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.create({
            email: 'admin@elite.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log("🚀 Admin User Seeded: admin@elite.com / admin123");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedAdmin();