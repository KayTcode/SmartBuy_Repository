import jwt from 'jsonwebtoken';
import httpErrors from 'http-errors';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token) return res.status(403).json({
            message: "No token provided!",
            status: 403
        });

        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Unauthorized!",
                    status: 401
                });
            }
            req.userId = decoded.userId;
            req.role = decoded.role;
            req.user = { _id: decoded.userId, role: decoded.role };
            
            next();
        })
    } catch (error) {
        next(httpErrors.Unauthorized());
    }
};

// Optional authentication - không bắt buộc phải có token
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (!token) {
            // Không có token, tiếp tục như guest
            return next();
        }

        const bearer = token.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Token không hợp lệ, tiếp tục như guest
                return next();
            }
            // Token hợp lệ, gán user info
            req.userId = decoded.userId;
            req.role = decoded.role;
            req.user = { _id: decoded.userId, role: decoded.role };
            
            next();
        });
    } catch (error) {
        // Có lỗi, tiếp tục như guest
        next();
    }
};

export default verifyToken;