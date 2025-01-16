import {Request, Response, NextFunction} from 'express';
import {insertUser} from '../config/db'
import {hashString as hashPassword, compareHash as verifyPassword} from '../utils/encryption'


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashPassword(password)
        await insertUser(email, hashed_password);
        return res.status(201).json({msg:'Success'})
    } catch (error:any) {
        next(error);
    }
}




