import userRepository from '../repositories/user.repository.js';
import bcryptjs from 'bcryptjs';

class UserController {
    // Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const users = await userRepository.findAll();
            
            res.status(200).json({
                success: true,
                data: {
                    users: users.map(user => this._sanitizeUser(user))
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Get user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await userRepository.findById(id);

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

    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, phone, address } = req.body;

            // Check if user is updating their own profile or is admin
            if (req.userId !== id && req.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this user'
                });
            }

            const updatedUser = await userRepository.update(id, {
                name,
                phone,
                address
            });

            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User updated successfully',
                data: {
                    user: this._sanitizeUser(updatedUser)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Update password
    async updatePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            
            const user = await userRepository.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user has a password (not Google-only account)
            if (user.authProvider === 'google' && !user.password) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot update password for Google-only accounts'
                });
            }

            // Verify current password
            const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            // Hash new password
            const hashedPassword = await bcryptjs.hash(newPassword, 10);

            await userRepository.update(req.userId, { password: hashedPassword });

            res.status(200).json({
                success: true,
                message: 'Password updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Delete user (admin only)
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const deletedUser = await userRepository.delete(id);

            if (!deletedUser) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'User deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    // Helper: Remove sensitive data from user object
    _sanitizeUser(user) {
        const userObj = user.toObject ? user.toObject() : user;
        delete userObj.password;
        return userObj;
    }
}

export default new UserController();
