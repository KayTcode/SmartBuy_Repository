import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    image: String,
    subtotal: {
        type: Number,
        required: true
    }
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Thông tin khách hàng (cho guest checkout)
    customerInfo: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            street: String,
            city: String,
            district: String,
            ward: String,
            note: String
        }
    },
    // Danh sách sản phẩm
    items: [orderItemSchema],
    // Tổng tiền
    subtotal: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    // Phương thức thanh toán
    paymentMethod: {
        type: String,
        enum: ['cod', 'bank_transfer', 'momo', 'vnpay'],
        default: 'cod'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending'
    },
    // Trạng thái đơn hàng
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
        default: 'pending'
    },
    // Ghi chú
    note: String,
    // Lịch sử trạng thái
    statusHistory: [{
        status: String,
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    // Thông tin giao hàng
    deliveryInfo: {
        estimatedDate: Date,
        actualDate: Date,
        trackingNumber: String,
        carrier: String
    },
    // Siêu thị gần nhất (từ EatClean feature)
    nearestMarket: {
        id: String,
        name: String,
        address: String
    }
}, {
    timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
    if (this.isNew && !this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        
        // Count orders today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const count = await this.constructor.countDocuments({
            createdAt: { $gte: startOfDay }
        });
        
        const orderNum = (count + 1).toString().padStart(4, '0');
        this.orderNumber = `SB${year}${month}${day}${orderNum}`;
    }
    next();
});

export default mongoose.model('Order', orderSchema);
