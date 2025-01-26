import {Request, Response, NextFunction} from 'express';
import {insertUser, isProviderConnected, registerByProvider, getUserPassword, getUserId, updatePassword} from '../models/authModels'
import {hashString, compareHash} from '../utils/encryption'
import { verifyToken, generateToken } from '../utils/jwt';

// TODO: soundcloudRegister function

export const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authToken = req.cookies.authToken
        if (!authToken) {
            return res.status(401).json({ isAuthenticated: false, userHasPassword: false });
        }
        const user = verifyToken(authToken); // Decode and verify the JWT
        const userHasPassword = (await getUserPassword(user.email) !== null)
        return res.status(200).json({ isAuthenticated: true, userHasPassword, userData: { userId: user.userId, email:user.email }});
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false, userHasPassword: false});
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashString(password)
        const userId = await insertUser(email, hashed_password);
        const token = generateToken({ userId, email });
        res.cookie('authToken', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000,});
        return res.status(201).json({msg:'Registration Successful', userData:{userId, email}, userHasPassword: true})
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
            const userHasPassword = (await getUserPassword(email) !== null)
            const token =  generateToken({userId, email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/home`);
        } else {
            const userId = await registerByProvider(provider,provider_email,refreshToken, accessToken);
            const token =  generateToken({userId, email:provider_email})
            const userHasPassword = (await getUserPassword(provider_email) !== null)
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            return res.redirect(`${process.env.FRONTEND_BASE_URL}/home`);
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
        if (!hashed_password) {
            return res.status(401).json({ error: "Email does not exist or password may not be set for a Spotify/SoundCloud Account." });
        }
        if (await compareHash(password, hashed_password)) { // Create JWT, log-in user
            const userId = await getUserId(email)
            const token =  generateToken({userId, email})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.status(200).json({msg:'Sign-In Successful.', userData:{userId, email}, userHasPassword: true})
        } else {
            res.status(401).json({error:"Incorrect password."})
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




