import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from '../models/product.model.js';
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

const products = [
    // Fresh Fruits
    {
        name: "Táo Fuji Nhật Bản",
        price: 45.00,
        oldPrice: 55.00,
        category: "fresh-fruit",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500",
        gallery: [
            "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=500",
            "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500"
        ],
        rating: 4.8,
        reviews: 156,
        status: "discount",
        featured: true,
        tags: ["Healthy", "Fruit", "Vitamins"],
        description: "Táo Fuji nhập khẩu từ Nhật Bản, giòn ngọt tự nhiên",
        stock: 50,
        unit: "kg",
        origin: "Nhật Bản",
        weight: "500g",
        delivery: "Giao trong 24h nội thành",
        nutrition: {
            calories: 52,
            protein: 0.3,
            carb: 14,
            fat: 0.2
        }
    },
    {
        name: "Cam Sành Cao Phong",
        price: 35.00,
        category: "fresh-fruit",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=500",
        rating: 4.5,
        reviews: 89,
        status: "in-stock",
        featured: true,
        tags: ["Healthy", "Fruit", "Vitamins"],
        description: "Cam sành Cao Phong, ngọt thanh, nhiều nước",
        stock: 100,
        unit: "kg",
        origin: "Cao Phong, Hòa Bình",
        nutrition: {
            calories: 47,
            protein: 0.9,
            carb: 12,
            fat: 0.1
        }
    },
    {
        name: "Chuối Già Lùn",
        price: 25.00,
        category: "fresh-fruit",
        image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=500",
        rating: 4.6,
        reviews: 124,
        status: "in-stock",
        tags: ["Healthy", "Fruit", "Breakfast"],
        description: "Chuối già lùn, thơm ngon, giàu kali",
        stock: 80,
        unit: "kg",
        origin: "Đồng bằng sông Cửu Long",
        nutrition: {
            calories: 89,
            protein: 1.1,
            carb: 23,
            fat: 0.3
        },
        bmiCategory: "gầy"
    },

    // Vegetables
    {
        name: "Rau Cải Bó Xôi Hữu Cơ",
        price: 15.00,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500",
        rating: 4.9,
        reviews: 203,
        status: "in-stock",
        featured: true,
        tags: ["Healthy", "Vegetarian", "Low Fat"],
        description: "Rau cải bó xôi hữu cơ, giàu sắt và vitamin",
        stock: 30,
        unit: "kg",
        origin: "Đà Lạt",
        nutrition: {
            calories: 23,
            protein: 2.9,
            carb: 3.6,
            fat: 0.4
        },
        bmiCategory: "béo phì"
    },
    {
        name: "Cà Chua Bi",
        price: 28.00,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500",
        rating: 4.7,
        reviews: 167,
        status: "in-stock",
        tags: ["Healthy", "Vegetarian", "Vitamins"],
        description: "Cà chua bi tươi, ngọt tự nhiên",
        stock: 45,
        unit: "kg",
        origin: "Đà Lạt",
        nutrition: {
            calories: 18,
            protein: 0.9,
            carb: 3.9,
            fat: 0.2
        },
        bmiCategory: "thừa cân"
    },
    {
        name: "Bông Cải Xanh",
        price: 32.00,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=500",
        rating: 4.8,
        reviews: 145,
        status: "in-stock",
        featured: true,
        tags: ["Healthy", "Vegetarian", "Low Fat"],
        description: "Bông cải xanh tươi, giàu chất xơ",
        stock: 40,
        unit: "kg",
        origin: "Đà Lạt",
        nutrition: {
            calories: 34,
            protein: 2.8,
            carb: 7,
            fat: 0.4
        },
        bmiCategory: "béo phì"
    },
    {
        name: "Cà Rốt Đà Lạt",
        price: 22.00,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500",
        rating: 4.6,
        reviews: 98,
        status: "in-stock",
        tags: ["Healthy", "Vegetarian", "Vitamins"],
        description: "Cà rốt Đà Lạt, giàu vitamin A",
        stock: 60,
        unit: "kg",
        origin: "Đà Lạt",
        nutrition: {
            calories: 41,
            protein: 0.9,
            carb: 10,
            fat: 0.2
        }
    },

    // Cooking
    {
        name: "Gạo ST25",
        price: 38.00,
        category: "cooking",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500",
        rating: 5.0,
        reviews: 312,
        status: "in-stock",
        featured: true,
        tags: ["Breakfast", "Lunch", "Dinner"],
        description: "Gạo ST25 thơm ngon, hạt dài",
        stock: 200,
        unit: "kg",
        origin: "Sóc Trăng",
        nutrition: {
            calories: 130,
            protein: 2.7,
            carb: 28,
            fat: 0.3
        }
    },
    {
        name: "Dầu Ăn Simply",
        price: 42.00,
        category: "cooking",
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500",
        rating: 4.4,
        reviews: 76,
        status: "in-stock",
        tags: ["Cooking"],
        description: "Dầu ăn cao cấp từ hạt hướng dương",
        stock: 150,
        unit: "lít",
        origin: "Việt Nam"
    },

    // Snacks
    {
        name: "Hạt Điều Rang Muối",
        price: 85.00,
        oldPrice: 95.00,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500",
        rating: 4.7,
        reviews: 189,
        status: "discount",
        tags: ["Snack", "Healthy"],
        description: "Hạt điều rang muối thơm ngon",
        stock: 70,
        unit: "kg",
        origin: "Bình Phước",
        nutrition: {
            calories: 553,
            protein: 18,
            carb: 30,
            fat: 44
        }
    },
    {
        name: "Khoai Tây Chiên",
        price: 35.00,
        category: "snacks",
        image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500",
        rating: 4.3,
        reviews: 134,
        status: "in-stock",
        tags: ["Snack", "Kid foods"],
        description: "Khoai tây chiên giòn rụm",
        stock: 90,
        unit: "gói",
        origin: "Đà Lạt"
    },

    // Beverages
    {
        name: "Nước Ép Cam Tươi",
        price: 28.00,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500",
        rating: 4.8,
        reviews: 201,
        status: "in-stock",
        featured: true,
        tags: ["Healthy", "Vitamins", "Breakfast"],
        description: "Nước ép cam tươi 100%, không đường",
        stock: 120,
        unit: "chai",
        origin: "Việt Nam",
        nutrition: {
            calories: 45,
            protein: 0.7,
            carb: 11,
            fat: 0.1
        }
    },
    {
        name: "Sữa Tươi Vinamilk",
        price: 32.00,
        category: "beverages",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500",
        rating: 4.6,
        reviews: 178,
        status: "in-stock",
        tags: ["Healthy", "Breakfast"],
        description: "Sữa tươi tiệt trùng không đường",
        stock: 200,
        unit: "hộp",
        origin: "Việt Nam",
        nutrition: {
            calories: 42,
            protein: 3.4,
            carb: 5,
            fat: 1
        },
        bmiCategory: "gầy"
    },

    // Beauty & Health
    {
        name: "Yến Mạch Úc",
        price: 55.00,
        category: "beauty-health",
        image: "https://images.unsplash.com/photo-1574856344991-aaa31b6f4ce3?w=500",
        rating: 4.9,
        reviews: 267,
        status: "in-stock",
        featured: true,
        tags: ["Healthy", "Breakfast", "Low Fat"],
        description: "Yến mạch nguyên hạt nhập khẩu từ Úc",
        stock: 100,
        unit: "kg",
        origin: "Úc",
        nutrition: {
            calories: 389,
            protein: 17,
            carb: 66,
            fat: 7
        },
        bmiCategory: "gầy"
    },
    {
        name: "Hạt Chia",
        price: 65.00,
        category: "beauty-health",
        image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500",
        rating: 4.7,
        reviews: 143,
        status: "in-stock",
        tags: ["Healthy", "Vitamins"],
        description: "Hạt chia hữu cơ, giàu omega-3",
        stock: 80,
        unit: "kg",
        origin: "Mexico",
        nutrition: {
            calories: 486,
            protein: 17,
            carb: 42,
            fat: 31
        }
    },

    // Bread & Bakery
    {
        name: "Bánh Mì Nguyên Cám",
        price: 25.00,
        category: "bread-bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",
        rating: 4.5,
        reviews: 112,
        status: "in-stock",
        tags: ["Bread", "Breakfast", "Healthy"],
        description: "Bánh mì nguyên cám, ít đường",
        stock: 50,
        unit: "ổ",
        origin: "Việt Nam",
        nutrition: {
            calories: 247,
            protein: 13,
            carb: 41,
            fat: 4
        }
    },
    {
        name: "Bánh Croissant Bơ",
        price: 35.00,
        category: "bread-bakery",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500",
        rating: 4.8,
        reviews: 198,
        status: "in-stock",
        featured: true,
        tags: ["Bread", "Breakfast", "Snack"],
        description: "Bánh croissant bơ thơm ngon",
        stock: 40,
        unit: "cái",
        origin: "Việt Nam",
        nutrition: {
            calories: 406,
            protein: 8,
            carb: 46,
            fat: 21
        }
    },

    // More products for variety
    {
        name: "Ức Gà Tươi",
        price: 68.00,
        category: "cooking",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500",
        rating: 4.9,
        reviews: 234,
        status: "in-stock",
        featured: true,
        tags: ["Meat", "Healthy", "Dinner"],
        description: "Ức gà tươi sạch, giàu protein",
        stock: 60,
        unit: "kg",
        origin: "Việt Nam",
        nutrition: {
            calories: 165,
            protein: 31,
            carb: 0,
            fat: 3.6
        },
        bmiCategory: "béo phì"
    },
    {
        name: "Cá Hồi Na Uy",
        price: 185.00,
        oldPrice: 210.00,
        category: "cooking",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500",
        rating: 5.0,
        reviews: 156,
        status: "discount",
        featured: true,
        tags: ["Healthy", "Dinner", "Vitamins"],
        description: "Cá hồi Na Uy tươi, giàu omega-3",
        stock: 30,
        unit: "kg",
        origin: "Na Uy",
        nutrition: {
            calories: 208,
            protein: 20,
            carb: 0,
            fat: 13
        },
        bmiCategory: "bình thường"
    },
    {
        name: "Trứng Gà Sạch",
        price: 45.00,
        category: "cooking",
        image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500",
        rating: 4.7,
        reviews: 289,
        status: "in-stock",
        tags: ["Breakfast", "Healthy"],
        description: "Trứng gà sạch từ trang trại",
        stock: 150,
        unit: "vỉ 10 quả",
        origin: "Việt Nam",
        nutrition: {
            calories: 155,
            protein: 13,
            carb: 1.1,
            fat: 11
        },
        bmiCategory: "bình thường"
    },
    {
        name: "Khoai Lang Tím",
        price: 18.00,
        category: "vegetables",
        image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=500",
        rating: 4.6,
        reviews: 134,
        status: "in-stock",
        tags: ["Healthy", "Vegetarian"],
        description: "Khoai lang tím Đà Lạt, giàu chất xơ",
        stock: 80,
        unit: "kg",
        origin: "Đà Lạt",
        nutrition: {
            calories: 86,
            protein: 1.6,
            carb: 20,
            fat: 0.1
        },
        bmiCategory: "bình thường"
    },
    {
        name: "Xoài Cát Hòa Lộc",
        price: 55.00,
        category: "fresh-fruit",
        image: "https://images.unsplash.com/photo-1605027990121-cbae9d3ce6ae?w=500",
        rating: 4.9,
        reviews: 278,
        status: "in-stock",
        featured: true,
        tags: ["Fruit", "Healthy", "Vitamins"],
        description: "Xoài cát Hòa Lộc ngọt thơm",
        stock: 70,
        unit: "kg",
        origin: "Tiền Giang",
        nutrition: {
            calories: 60,
            protein: 0.8,
            carb: 15,
            fat: 0.4
        }
    }
];

const seedProducts = async () => {
    try {
        await connectDB();

        // Seed categories first
        console.log('📂 Seeding categories...');
        await Category.deleteMany({});
        const categoryResult = await Category.insertMany(categories);
        console.log(`✅ Successfully seeded ${categoryResult.length} categories`);

        // Clear existing products
        console.log('\n🛍️  Seeding products...');
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const result = await Product.insertMany(products);
        console.log(`✅ Successfully seeded ${result.length} products`);

        // Show statistics
        const stats = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        console.log('\n📊 Products by category:');
        stats.forEach(stat => {
            console.log(`  - ${stat._id}: ${stat.count} products`);
        });

        const featuredCount = await Product.countDocuments({ featured: true });
        console.log(`\n⭐ Featured products: ${featuredCount}`);

        console.log('\n✨ Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
