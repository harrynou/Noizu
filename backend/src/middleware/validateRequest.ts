import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (Dto: any) => async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(Dto, req.body);

    const errors = await validate(dtoObject, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
        const errorMessages = errors.map(err => Object.values(err.constraints || {})).flat();
        return res.status(400).json({ errors: errorMessages });
    }
    req.body = dtoObject;

    next();
}