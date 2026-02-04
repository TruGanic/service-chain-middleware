"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealth = void 0;
const getHealth = (req, res) => {
    console.log('✅ Health check requested');
    res.status(200).json({
        status: 'UP',
        message: 'Middleware is running correctly',
        timestamp: new Date().toISOString()
    });
};
exports.getHealth = getHealth;
