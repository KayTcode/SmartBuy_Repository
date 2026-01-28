import express from 'express';
import categoryController from '../controllers/category.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/roleCheck.js';

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', (req, res) => categoryController.getAllCategories(req, res));

/**
 * @route   GET /api/categories/:id
 * @desc    Get category by ID
 * @access  Public
 */
router.get('/:id', (req, res) => categoryController.getCategoryById(req, res));

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private (Admin only)
 */
router.post('/', verifyToken, isAdmin, (req, res) => categoryController.createCategory(req, res));

/**
 * @route   PUT /api/categories/:id
 * @desc    Update category
 * @access  Private (Admin only)
 */
router.put('/:id', verifyToken, isAdmin, (req, res) => categoryController.updateCategory(req, res));

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, isAdmin, (req, res) => categoryController.deleteCategory(req, res));

export default router;
