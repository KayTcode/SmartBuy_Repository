import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import httpErrors from 'http-errors';

class OrderController {
    // Create new order
    async createOrder(req, res, next) {
        try {
            const {
                customerInfo,
                items,
                paymentMethod,
                note,
                nearestMarket
            } = req.body;

            // Validate items
            if (!items || items.length === 0) {
                throw httpErrors.BadRequest('Order must have at least one item');
            }

            // Verify products and calculate totals
            let subtotal = 0;
            const orderItems = [];

            for (const item of items) {
                const product = await Product.findById(item.product || item.id);
                
                if (!product) {
                    throw httpErrors.NotFound(`Product ${item.product || item.id} not found`);
                }

                if (product.status === 'out-of-stock') {
                    throw httpErrors.BadRequest(`Product ${product.name} is out of stock`);
                }

                if (product.stock < item.quantity) {
                    throw httpErrors.BadRequest(
                        `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    );
                }

                const itemSubtotal = product.price * item.quantity;
                subtotal += itemSubtotal;

                orderItems.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    image: product.image,
                    subtotal: itemSubtotal
                });
            }

            // Calculate shipping fee (simple logic)
            const shippingFee = subtotal >= 200000 ? 0 : 30000; // Free ship if > 200k

            // Calculate total
            const total = subtotal + shippingFee;

            // Create order
            const order = await Order.create({
                user: req.user?._id, // If user is logged in
                customerInfo,
                items: orderItems,
                subtotal,
                shippingFee,
                total,
                paymentMethod: paymentMethod || 'cod',
                note,
                nearestMarket,
                statusHistory: [{
                    status: 'pending',
                    note: 'Order created',
                    updatedAt: new Date()
                }]
            });

            // Update product stock
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: -item.quantity } }
                );
            }

            // Populate product details
            await order.populate('items.product', 'name image category');

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all orders (Admin)
    async getAllOrders(req, res, next) {
        try {
            const {
                status,
                paymentStatus,
                page = 1,
                limit = 20,
                sort = '-createdAt'
            } = req.query;

            const filter = {};
            if (status) filter.status = status;
            if (paymentStatus) filter.paymentStatus = paymentStatus;

            const skip = (page - 1) * limit;
            const orders = await Order.find(filter)
                .populate('user', 'name email')
                .populate('items.product', 'name image')
                .sort(sort)
                .skip(skip)
                .limit(Number(limit));

            const total = await Order.countDocuments(filter);

            res.status(200).json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Get order by ID
    async getOrderById(req, res, next) {
        try {
            const order = await Order.findById(req.params.id)
                .populate('user', 'name email phone')
                .populate('items.product', 'name image category');

            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Get order by order number
    async getOrderByNumber(req, res, next) {
        try {
            const { orderNumber } = req.params;
            
            const order = await Order.findOne({ orderNumber })
                .populate('items.product', 'name image category');

            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user orders
    async getUserOrders(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const userId = req.user._id;

            const skip = (page - 1) * limit;
            const orders = await Order.find({ user: userId })
                .populate('items.product', 'name image')
                .sort('-createdAt')
                .skip(skip)
                .limit(Number(limit));

            const total = await Order.countDocuments({ user: userId });

            res.status(200).json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Track order by email and order number
    async trackOrder(req, res, next) {
        try {
            const { orderNumber, email } = req.query;

            if (!orderNumber || !email) {
                throw httpErrors.BadRequest('Order number and email are required');
            }

            const order = await Order.findOne({
                orderNumber,
                'customerInfo.email': email
            }).populate('items.product', 'name image');

            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            res.status(200).json({
                success: true,
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Update order status (Admin)
    async updateOrderStatus(req, res, next) {
        try {
            const { status, note } = req.body;
            const orderId = req.params.id;

            const order = await Order.findById(orderId);
            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            // Add to status history
            order.statusHistory.push({
                status,
                note,
                updatedBy: req.user._id,
                updatedAt: new Date()
            });

            order.status = status;
            await order.save();

            res.status(200).json({
                success: true,
                message: 'Order status updated',
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Update payment status (Admin)
    async updatePaymentStatus(req, res, next) {
        try {
            const { paymentStatus } = req.body;
            const orderId = req.params.id;

            const order = await Order.findByIdAndUpdate(
                orderId,
                { paymentStatus },
                { new: true }
            );

            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            res.status(200).json({
                success: true,
                message: 'Payment status updated',
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Cancel order
    async cancelOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const { reason } = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            // Check if order can be cancelled
            if (['delivered', 'cancelled'].includes(order.status)) {
                throw httpErrors.BadRequest(`Cannot cancel order with status: ${order.status}`);
            }

            // Restore product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(
                    item.product,
                    { $inc: { stock: item.quantity } }
                );
            }

            // Update order
            order.status = 'cancelled';
            order.statusHistory.push({
                status: 'cancelled',
                note: reason || 'Order cancelled by customer',
                updatedBy: req.user?._id,
                updatedAt: new Date()
            });
            await order.save();

            res.status(200).json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    // Get order statistics (Admin)
    async getOrderStats(req, res, next) {
        try {
            const stats = await Order.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        totalRevenue: { $sum: '$total' }
                    }
                }
            ]);

            const totalOrders = await Order.countDocuments();
            const totalRevenue = await Order.aggregate([
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]);

            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const todayOrders = await Order.countDocuments({
                createdAt: { $gte: todayStart }
            });

            res.status(200).json({
                success: true,
                data: {
                    byStatus: stats,
                    total: totalOrders,
                    totalRevenue: totalRevenue[0]?.total || 0,
                    todayOrders
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete order (Admin only - soft delete)
    async deleteOrder(req, res, next) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);

            if (!order) {
                throw httpErrors.NotFound('Order not found');
            }

            res.status(200).json({
                success: true,
                message: 'Order deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new OrderController();
