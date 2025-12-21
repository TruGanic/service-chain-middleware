import { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response) => {
    console.log('✅ Health check requested');
    res.status(200).json({
        status: 'UP',
        message: 'Middleware is running correctly',
        timestamp: new Date().toISOString()
    });
};