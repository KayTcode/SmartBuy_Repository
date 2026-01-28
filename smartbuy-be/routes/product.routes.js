import express from 'express';
const router = express.Router();
import productController from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/roleCheck.js';

// Public routes
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/best-sellers', productController.getBestSellers);
router.get('/sale', productController.getSaleProducts);
router.get('/stats', productController.getProductStats);
router.get('/bmi/:bmiCategory', productController.getProductsByBMI);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Admin routes (protected)
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);

export default router;
