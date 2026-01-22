const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Middleware untuk verifikasi token
exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token',
                    error: err.message
                });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};

// Middleware untuk check role
exports.authorizeRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (allowedRoles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
                requiredRole: allowedRoles,
                userRole: req.user.role
            });
        }
    };
};

// Middleware untuk check permission
exports.checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            // Admin memiliki semua permission
            if (req.user.role === 'admin') {
                return next();
            }

            // Check permission berdasarkan role
            const [role] = await db.query(
                'SELECT * FROM roles WHERE role_name = ?',
                [req.user.role]
            );

            if (role.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Role not found'
                });
            }

            if (role[0][permission]) {
                next();
            } else {
                res.status(403).json({
                    success: false,
                    message: `You don't have permission to ${permission}`,
                    userRole: req.user.role
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Authorization error',
                error: error.message
            });
        }
    };
};
