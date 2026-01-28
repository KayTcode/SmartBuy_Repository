import express from 'express';
import authController from '../controllers/auth.controller.js';
import verifyToken  from '../middlewares/verifyToken.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', (req, res) => authController.register(req, res));

/**
 * @route   POST /api/auth/login
 * @desc    Login with email and password
 * @access  Public
 */
router.post('/login', (req, res) => authController.login(req, res));

/**
 * @route   GET /api/auth/google
 * @desc    Redirect to Google OAuth
 * @access  Public
 */
router.get('/google', (req, res) => authController.googleRedirect(req, res));

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get('/google/callback', (req, res) => authController.googleCallback(req, res));

/**
 * @route   GET /api/auth/callback/google
 * @desc    Google OAuth callback (alternative URL)
 * @access  Public
 */
router.get('/callback/google', (req, res) => authController.googleCallback(req, res));

/**
 * @route   POST /api/auth/google
 * @desc    Login with Google OAuth (client-side flow)
 * @access  Public
 */
router.post('/google', (req, res) => authController.googleLogin(req, res));

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', verifyToken, (req, res) => authController.getProfile(req, res));

export default router;
