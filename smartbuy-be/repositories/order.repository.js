import Order from '../models/order.model.js';

class OrderRepository {
    async findAll(filter = {}, options = {}) {
        const { sort = '-createdAt', skip = 0, limit = 20 } = options;
        return await Order.find(filter)
            .populate('user', 'name email')
            .populate('items.product', 'name image')
            .sort(sort)
            .skip(skip)
            .limit(limit);
    }

    async findById(id) {
        return await Order.findById(id)
            .populate('user', 'name email phone')
            .populate('items.product', 'name image category');
    }

    async findByOrderNumber(orderNumber) {
        return await Order.findOne({ orderNumber })
            .populate('items.product', 'name image category');
    }

    async findByUser(userId, options = {}) {
        const { skip = 0, limit = 10 } = options;
        return await Order.find({ user: userId })
            .populate('items.product', 'name image')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);
    }

    async findByEmail(email, orderNumber) {
        return await Order.findOne({
            orderNumber,
            'customerInfo.email': email
        }).populate('items.product', 'name image');
    }

    async create(orderData) {
        const order = new Order(orderData);
        return await order.save();
    }

    async update(id, updateData) {
        return await Order.findByIdAndUpdate(id, updateData, { 
            new: true,
            runValidators: true 
        });
    }

    async updateStatus(id, status, note, updatedBy) {
        const order = await Order.findById(id);
        if (!order) return null;

        order.statusHistory.push({
            status,
            note,
            updatedBy,
            updatedAt: new Date()
        });
        order.status = status;
        
        return await order.save();
    }

    async updatePaymentStatus(id, paymentStatus) {
        return await Order.findByIdAndUpdate(
            id,
            { paymentStatus },
            { new: true }
        );
    }

    async delete(id) {
        return await Order.findByIdAndDelete(id);
    }

    async count(filter = {}) {
        return await Order.countDocuments(filter);
    }

    async countByUser(userId) {
        return await Order.countDocuments({ user: userId });
    }

    async getStatsByStatus() {
        return await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRevenue: { $sum: '$total' }
                }
            }
        ]);
    }

    async getTotalRevenue() {
        const result = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$total' } } }
        ]);
        return result[0]?.total || 0;
    }

    async getTodayOrders() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        return await Order.countDocuments({
            createdAt: { $gte: todayStart }
        });
    }

    async getRevenueByDateRange(startDate, endDate) {
        return await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$total' },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
            }
        ]);
    }
}

export default new OrderRepository();
