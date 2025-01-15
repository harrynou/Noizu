import {Request, Response, NextFunction} from 'express';
import {insertUser} from '../config/db'


export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        await insertUser(email, password);
        return res.status(201).json({msg:'Success'})
    } catch (error:any) {
        next(error);
    }
}



