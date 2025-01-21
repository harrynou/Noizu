import {Request, Response, NextFunction} from 'express';
import {insertUser, isProviderConnected, registerByProvider, getUserPassword, getUserId} from '../models/authModels'
import {hashString, compareHash} from '../utils/encryption'
import { verifyToken, generateToken } from '../utils/jwt';
import { getNewAccessToken } from '../models/tokenModels';

// TODO: soundcloudRegister function

export const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authToken = req.cookies.authToken
        if (!authToken) {
            return res.status(401).json({ isAuthenticated: false });
        }
        const user = verifyToken(authToken); // Decode and verify the JWT
        return res.status(200).json({ isAuthenticated: true, user});
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false });

    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashString(password)
        const user_id = await insertUser(email, hashed_password);
        const token = generateToken({ user_id, email });
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });
        return res.status(201).json({msg:'Registration Successful'})
    } catch (error:any) {
        next(error);
    }
}

export const spotifyRegister = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const provider = user.provider
        const provider_email = user._json.email
        const {accessToken,refreshToken} = (req.authInfo as any)
        if (await isProviderConnected(provider, provider_email)) { // Check if spotify is already connect, if so log in, else, create account
            const userId = await getUserId(provider_email)
            const token =  generateToken({userId, provider_email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.redirect('http://localhost:5173/home')
        } else {
            const userId = await registerByProvider(provider,provider_email,refreshToken, accessToken);
            const token =  generateToken({userId, provider_email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.redirect('http://localhost:5173/home')
        }
    } catch (error:any) {
        next(error);
    }
}

export const soundcloudRegister = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const user: any = req.user
        console.log(user)
        res.status(200)
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await getUserPassword(email)
        if (await compareHash(password, hashed_password)) { // Create JWT, log-in user
            const user_id = await getUserId(email)
            const token =  generateToken({user_id, email})
            res.cookie('authToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000, // 1 hour
            });
            return res.status(200).json({msg:'Logged In'})
        } else {
            res.status(401).json("Incorrect Password.")
        }
    } catch (error){
        next(error)
    }
}




