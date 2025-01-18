import jwt from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRATION || '1h', // Default to 1 hour if not specified
    });
};

export const verifyToken = (token: string): any => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};