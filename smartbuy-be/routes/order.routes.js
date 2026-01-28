import express from 'express';
const router = express.Router();
import orderController from '../controllers/order.controller.js';
import { verifyToken, optionalAuth } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/roleCheck.js';

// Public routes
router.post('/', optionalAuth, orderController.createOrder); // Guest or logged-in checkout
router.get('/track', orderController.trackOrder); // Track by order number + email
router.get('/number/:orderNumber', orderController.getOrderByNumber);

// User routes (protected)
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.put('/:id/cancel', verifyToken, orderController.cancelOrder);

// Admin routes (protected)
router.get('/', verifyToken, isAdmin, orderController.getAllOrders);
router.get('/stats', verifyToken, isAdmin, orderController.getOrderStats);
router.get('/:id', verifyToken, orderController.getOrderById);
router.put('/:id/status', verifyToken, isAdmin, orderController.updateOrderStatus);
router.put('/:id/payment', verifyToken, isAdmin, orderController.updatePaymentStatus);
router.delete('/:id', verifyToken, isAdmin, orderController.deleteOrder);

export default router;
