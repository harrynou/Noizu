import {Request, Response, NextFunction} from 'express';
import {insertUser, isProviderConnected, registerByProvider, getUserPassword, getUserId, updatePassword} from '../models/authModels'
import {hashString, compareHash} from '../utils/encryption'
import { verifyToken, generateToken } from '../utils/jwt';
import { url } from 'inspector';

// TODO: soundcloudRegister function

export const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authToken = req.cookies.authToken
        if (!authToken) {
            return res.status(401).json({ isAuthenticated: false, hasPassword: false });
        }
        const user = verifyToken(authToken); // Decode and verify the JWT
        const hasPassword = (await getUserPassword(user.email) !== null)
        return res.status(200).json({ isAuthenticated: true,hasPassword});
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false, hasPassword: false});
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashString(password)
        const userId = await insertUser(email, hashed_password);
        const token = generateToken({ userId, email });
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

export const spotifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const provider = user.provider
        const provider_email = user._json.email
        const {accessToken,refreshToken} = (req.authInfo as any)
        const email = await isProviderConnected(provider, provider_email)
        if (email !== null) { // Check if spotify is already connected, if so log in, else, create account
            const userId = await getUserId(email)
            const token =  generateToken({userId, email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.status(200).json({msg:'Signed into Existing Account'})
        } else {
            const userId = await registerByProvider(provider,provider_email,refreshToken, accessToken);
            const token =  generateToken({userId, email:provider_email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.status(201).json({msg:'Registration Successful.'})
        }
    } catch (error:any) {
        next(error);
    }
}

export const soundcloudAuth = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const user: any = req.user
        console.log(user)
        res.status(200)
    } catch (error) {
        next(error)
    }
}

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await getUserPassword(email)
        if (await compareHash(password, hashed_password || '')) { // Create JWT, log-in user
            const userId = await getUserId(email)
            const token =  generateToken({userId, email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000});
            res.status(200).json({msg:'Sign-In Successful.'})
        } else {
            res.status(401).json("Incorrect Password.")
        }
    } catch (error){
        next(error)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const password = req.body.password;
        const token = req.cookies.authToken
        const userId = verifyToken(token).userId;
        const hashed_password = await hashString(password);
        await updatePassword(hashed_password,userId);
        res.status(200).json({msg:'Password Change Successful.'})
    } catch (error) {
        next(error)
    }
}




