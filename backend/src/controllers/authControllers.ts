import {Request, Response, NextFunction} from 'express';
import {insertUser, isProviderConnected, registerByProvider, getUserPassword, getUserId, updatePassword, updateEmailandPassword} from '../models/authModels'
import {hashString, compareHash, generateCodeVerifier, generateCodeChallenge} from '../utils/encryption'
import { verifyToken, generateToken } from '../utils/jwt';
import crypto from 'crypto'
import { getToken, setToken } from '../utils/redis';
import { AuthSoundcloudToken, getSoundcloudUserInfo } from '../services/soundcloud';

export const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const authToken = req.cookies.authToken
        if (!authToken) {
            return res.status(401).json({ isAuthenticated: false, userHasPassword: false });
        }
        const user = verifyToken(authToken); // Decode and verify the JWT
        const userHasPassword = (await getUserPassword(user.userId) !== null)
        return res.status(200).json({ isAuthenticated: true, userHasPassword, userData: { userId: user.userId}});
    } catch (error) {
        return res.status(401).json({ isAuthenticated: false, userHasPassword: false});
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashString(password)
        const userId = await insertUser(email, hashed_password);
        const token = generateToken({userId});
        res.cookie('authToken', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000,});
        return res.status(201).json({msg:'Registration Successful', userData:{userId}, userHasPassword: true})
    } catch (error:any) {
        next(error);
    }
}

export const spotifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const provider = user.provider
        const providerUserId = user.id
        const {accessToken,refreshToken} = (req.authInfo as any)
        let userId = await isProviderConnected(provider, providerUserId)
        if (userId === null) { // Create an account if account does not exist
            userId = await registerByProvider(provider, providerUserId, refreshToken, accessToken);
        } 
        const token = generateToken({userId})
        res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/home`);
    } catch (error:any) {
        next(error);
    }
}

// Have to manually call to soundcloud since passport strategy for soundcloud is outdated O.o
export const soundcloudRedirect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const state = crypto.randomBytes(32).toString('hex');
        const codeVerifier = generateCodeVerifier();
        const codeChallenge = await generateCodeChallenge(codeVerifier);
        await setToken(`authState:${state}`,codeVerifier, 600);
        res.redirect(`https://secure.soundcloud.com/authorize?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}&redirect_uri=${process.env.SOUNDCLOUD_REDIRECT_URI}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`)
    } catch (error) {
        next(error)
    }
}

export const soundcloudAuth = async (req: Request, res: Response, next: NextFunction) => { 
    try {
        const {code, state} = req.query
        if (typeof code !== 'string' || typeof state !== 'string') {
            return res.status(400).json({ error: 'Invalid or missing parameters' });
        }
        const codeVerifier = await getToken(`authState:${state}`)
        if (!codeVerifier) {
            return res.status(400).json({ error: 'Invalid or expired state parameter' });
        }
        const {access_token, refresh_token, expires_in} = await AuthSoundcloudToken(code, codeVerifier);
        const userInfo = await getSoundcloudUserInfo(access_token);
        const provider = 'soundcloud'
        const providerUserId = userInfo.id
        let userId = await isProviderConnected(provider, providerUserId)
        if (userId === null) { // Create an account if account does not exist
            userId = await registerByProvider(provider, providerUserId, refresh_token, access_token);
        } 
        const token = generateToken({userId})
        res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/home`)
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
            const token =  generateToken({userId})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: 3600000,});
            res.status(200).json({msg:'Sign-In Successful.', userData:{userId}, userHasPassword: true})
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

export const setupAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email,password} = req.body;
        const token = req.cookies.authToken;
        const userId = verifyToken(token).userId;
        const hashed_password = await hashString(password);
        await updateEmailandPassword(userId,email,hashed_password);
        res.status(200).json({msg:'Account Successfully Updated.'});
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const password = req.body.password;
        const token = req.cookies.authToken;
        const userId = verifyToken(token).userId;
        const hashed_password = await hashString(password);
        await updatePassword(userId, hashed_password);
        res.status(200).json({msg:'Password Change Successful.'});
    } catch (error) {
        next(error)
    }
}




