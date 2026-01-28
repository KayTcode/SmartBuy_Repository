/**
 * Seed script to create admin user
 * Run: npm run seed:admin
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';

dotenv.config();

const ADMIN_EMAIL = 'admin@smartbuy.com';
const ADMIN_PASSWORD = 'admin123456';
const ADMIN_NAME = 'SmartBuy Admin';

async function seedAdmin() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log(`   Email: ${ADMIN_EMAIL}`);
            console.log(`   Role: ${existingAdmin.role}`);
            
            // Update to admin role if not already
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log('✅ Updated user role to admin');
            }
        } else {
            // Create admin user
            const hashedPassword = await bcryptjs.hash(ADMIN_PASSWORD, 10);
            
            const admin = new User({
                email: ADMIN_EMAIL,
                password: hashedPassword,
                name: ADMIN_NAME,
                role: 'admin',
                authProvider: 'local',
                isActive: true
            });

            await admin.save();
            console.log('✅ Admin user created successfully');
            console.log(`   Email: ${ADMIN_EMAIL}`);
            console.log(`   Password: ${ADMIN_PASSWORD}`);
            console.log(`   Role: admin`);
            console.log('\n⚠️  Please change the password after first login!');
        }

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedAdmin();
