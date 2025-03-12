import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error: ', error);
    if (error instanceof AppError) {
        
        return res.status(error.statusCode).json({ error: error.message });
    }
    if (error?.code === '23505') {
        return res.status(409).json({error: "Email Already in Use."});
    } else {
        return res.status(500).json({ error: error.message || "An unexpected error occurred." });
    }
}

export default errorHandle