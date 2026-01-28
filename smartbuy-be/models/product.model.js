import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    oldPrice: {
        type: Number,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['fresh-fruit', 'vegetables', 'cooking', 'snacks', 'beverages', 'beauty-health', 'bread-bakery']
    },
    image: {
        type: String,
        required: true
    },
    gallery: [{
        type: String
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['in-stock', 'out-of-stock', 'discount'],
        default: 'in-stock'
    },
    featured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }],
    description: {
        type: String
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    unit: {
        type: String,
        default: 'kg'
    },
    origin: {
        type: String
    },
    weight: {
        type: String
    },
    delivery: {
        type: String
    },
    // Thông tin dinh dưỡng cho EatClean
    nutrition: {
        calories: Number,
        protein: Number,
        carb: Number,
        fat: Number
    },
    // Phân loại cho BMI
    bmiCategory: {
        type: String,
        enum: ['gầy', 'bình thường', 'thừa cân', 'béo phì', 'all']
    }
}, {
    timestamps: true
});

// Index cho tìm kiếm
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ rating: -1 });

export default mongoose.model('Product', productSchema);
