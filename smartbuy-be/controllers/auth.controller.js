import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/user.repository.js';
import Order from '../models/order.model.js';
import { OAuth2Client } from 'google-auth-library';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:9999/api/auth/google/callback';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);

class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ 
                    success: false,
                    message: 'User already exists' 
                });
            }

            // Hash password
            const hashedPassword = await bcryptjs.hash(password, 10);

            // Create new user
            const newUser = await userRepository.create({
                email,
                password: hashedPassword,
                name,
                authProvider: 'local'
            });

            // Link orders with same email to user account
            await Order.updateMany(
                { 
                    'customerInfo.email': newUser.email.toLowerCase(),
                    user: null // Only link orders without user
                },
                { user: newUser._id }
            );

            // Generate token
            const token = this._generateToken(newUser);

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    user: this._sanitizeUser(newUser),
                    token
                }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    // Login with email and password
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await userRepository.findByEmail(email);
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'User not found' 
                });
            }

            // Check if user registered with Google
            if (user.authProvider === 'google' && !user.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please login with Google'
                });
            }

            // Verify password
            const isPasswordValid = await bcryptjs.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ 
                    success: false,
                    message: 'Invalid password' 
                });
            }

            // Link orders with same email to user account
            await Order.updateMany(
                { 
                    'customerInfo.email': user.email.toLowerCase(),
                    user: null // Only link orders without user
                },
                { user: user._id }
            );

            // Generate token
            const token = this._generateToken(user);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: this._sanitizeUser(user),
                    token
                }
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }

    // Redirect to Google OAuth
    googleRedirect(req, res) {
        const authUrl = googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ],
            prompt: 'consent'
        });
        res.redirect(authUrl);
    }

    // Google OAuth callback
    async googleCallback(req, res) {
        try {
            const { code } = req.query;

            if (!code) {
                return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
            }

            // Exchange code for tokens
            const { tokens } = await googleClient.getToken(code);
            googleClient.setCredentials(tokens);

            // Get user info from Google
            const ticket = await googleClient.verifyIdToken({
                idToken: tokens.id_token,
                audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();

            // Find or create user
            const user = await userRepository.findOrCreateGoogleUser({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                avatar: payload.picture
            });

            // Link orders with same email to user account
            await Order.updateMany(
                { 
                    'customerInfo.email': user.email.toLowerCase(),
                    user: null // Only link orders without user
                },
                { user: user._id }
            );

            // Generate JWT token
            const token = this._generateToken(user);

            // Redirect to frontend with token
            res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(this._sanitizeUser(user)))}`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect(`${FRONTEND_URL}/login?error=google_auth_failed`);
        }
    }

    // Login with Google (for client-side flow - keeping for compatibility)
    async googleLogin(req, res) {
        try {
            const { credential } = req.body;

            if (!credential) {
                return res.status(400).json({
                    success: false,
                    message: 'Google credential is required'
                });
            }

            // Verify Google token
            const ticket = await googleClient.verifyIdToken({
                idToken: credential,
                audience: GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            
            // Find or create user
            const user = await userRepository.findOrCreateGoogleUser({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                avatar: payload.picture
            });

            // Link orders with same email to user account
            await Order.updateMany(
                { 
                    'customerInfo.email': user.email.toLowerCase(),
                    user: null // Only link orders without user
                },
                { user: user._id }
            );

            // Generate JWT token
            const token = this._generateToken(user);

            res.status(200).json({
                success: true,
                message: 'Google login successful',
                data: {
                    user: this._sanitizeUser(user),
                    token
                }
            });
        } catch (error) {
            console.error('Google login error:', error);
            res.status(500).json({
                success: false,
                message: 'Google authentication failed'
            });
        }
    }

    // Get current user profile
    async getProfile(req, res) {
        try {
            const user = await userRepository.findById(req.userId);
            
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    user: this._sanitizeUser(user)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Helper: Generate JWT token
    _generateToken(user) {
        return jwt.sign(
            { 
                userId: user._id, 
                role: user.role,
                email: user.email
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
        );
    }

    // Helper: Remove sensitive data from user object
    _sanitizeUser(user) {
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return userObj;
    }
}

export default new AuthController();
