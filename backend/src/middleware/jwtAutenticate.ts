import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.authToken; 

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const decoded = verifyToken(token); 
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};