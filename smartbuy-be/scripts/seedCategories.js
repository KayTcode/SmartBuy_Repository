import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/category.model.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error("MongoDB connection failed: ", error);
        process.exit(1);
    }
};

const categories = [
    {
        key: "fresh-fruit",
        name: "Trái Cây Tươi",
        description: {
            vi: "Trái cây tươi ngon, giàu vitamin và khoáng chất",
            en: "Fresh fruits rich in vitamins and minerals"
        },
        image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500",
        icon: "🍎",
        order: 1,
        active: true
    },
    {
        key: "vegetables",
        name: "Rau Củ Quả",
        description: {
            vi: "Rau củ quả tươi sạch, an toàn cho sức khỏe",
            en: "Fresh and clean vegetables"
        },
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500",
        icon: "🥬",
        order: 2,
        active: true
    },
    {
        key: "cooking",
        name: "Thực Phẩm Nấu Ăn",
        description: {
            vi: "Nguyên liệu nấu ăn chất lượng cao",
            en: "High quality cooking ingredients"
        },
        image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500",
        icon: "🍳",
        order: 3,
        active: true
    },
    {
        key: "snacks",
        name: "Đồ Ăn Vặt",
        description: {
            vi: "Đồ ăn vặt ngon miệng, tiện lợi",
            en: "Delicious and convenient snacks"
        },
        image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500",
        icon: "🍿",
        order: 4,
        active: true
    },
    {
        key: "beverages",
        name: "Đồ Uống",
        description: {
            vi: "Nước giải khát, nước ép trái cây tươi",
            en: "Refreshing drinks and fresh juices"
        },
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500",
        icon: "🥤",
        order: 5,
        active: true
    },
    {
        key: "beauty-health",
        name: "Sức Khỏe & Làm Đẹp",
        description: {
            vi: "Thực phẩm chức năng, dinh dưỡng",
            en: "Health supplements and nutrition"
        },
        image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
        icon: "💊",
        order: 6,
        active: true
    },
    {
        key: "bread-bakery",
        name: "Bánh Mì & Bánh Ngọt",
        description: {
            vi: "Bánh mì, bánh ngọt tươi mỗi ngày",
            en: "Fresh bread and pastries daily"
        },
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        icon: "🥖",
        order: 7,
        active: true
    }
];

const seedCategories = async () => {
    try {
        await connectDB();

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Insert new categories
        const result = await Category.insertMany(categories);
        console.log(`✅ Successfully seeded ${result.length} categories`);

        console.log('\n📂 Categories created:');
        result.forEach(cat => {
            console.log(`  ${cat.icon} ${cat.name} (${cat.key})`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
