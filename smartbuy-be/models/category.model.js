import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        vi: String,
        en: String
    },
    icon: String,
    image: String,
    order: {
        type: Number,
        default: 0
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Category', categorySchema);
