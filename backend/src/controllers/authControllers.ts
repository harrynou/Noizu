import {Request, Response, NextFunction} from 'express';
import {insertUser, isProviderConnected, registerByProvider} from '../config/db'
import {hashString as hashPassword, compareHash as verifyPassword} from '../utils/encryption'
import { Profile } from 'passport-spotify';


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

export const spotifyRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const provider = user.provider
        const provider_email = user._json.email
        const refresh_token = (req.authInfo as any).refreshToken
        if (await isProviderConnected(provider, provider_email)) { // Check if spotify is already connect, if so log in, else, create account
            
        } else {
            await registerByProvider(provider,provider_email,refresh_token) 
        }
        res.status(201).json({msg:"Account Successfully created"})
    } catch (error:any) {
        next(error);
    }
}




