const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const os = require('os');
require('dotenv').config();

const repairOrderRoutes = require('./routes/repairOrderRoutes');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Get local IP address
const getLocalIpAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

const LOCAL_IP = getLocalIpAddress();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware for debugging
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const path = req.path;
    const ip = req.ip || req.connection.remoteAddress;
    console.log(`[${timestamp}] ${method} ${path} - From: ${ip}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/repair-orders', repairOrderRoutes);

// Health check route
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ status: 'OK', message: 'Server is running', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Database connection failed', error: error.message });
    }
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`\n========================================`);
    console.log(`✅ Server is running!`);
    console.log(`========================================`);
    console.log(`Local Access:  http://localhost:${PORT}`);
    console.log(`Network Access: http://${LOCAL_IP}:${PORT}`);
    console.log(`========================================\n`);
    console.log('Environment:', {
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME
    });
});
