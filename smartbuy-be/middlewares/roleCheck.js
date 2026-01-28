/**
 * Role-based access control middleware
 */

export const isAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
    next();
};

export const isUser = (req, res, next) => {
    if (!['user', 'admin'].includes(req.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. User role required.'
        });
    }
    next();
};

export default {
    isAdmin,
    isUser
};
