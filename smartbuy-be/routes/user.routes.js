import express from 'express';
import userController from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { isAdmin } from '../middlewares/roleCheck.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', verifyToken, isAdmin, (req, res) => userController.getAllUsers(req, res));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private
 */
router.get('/:id', verifyToken, (req, res) => userController.getUserById(req, res));

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', verifyToken, (req, res) => userController.updateUser(req, res));

/**
 * @route   PUT /api/users/password
 * @desc    Update password
 * @access  Private
 */
router.put('/password/update', verifyToken, (req, res) => userController.updatePassword(req, res));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', verifyToken, isAdmin, (req, res) => userController.deleteUser(req, res));

export default router;
