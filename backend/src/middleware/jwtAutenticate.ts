import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../utils/types';
import { UnauthorizedError } from '../utils/errors';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.authToken;
        if (!token) throw new UnauthorizedError("Missing Token.");

        req.user = verifyToken(token);
        next();
    } catch (error) {
        next(error);
    }
};