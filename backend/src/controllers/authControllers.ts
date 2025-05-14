import {Request, Response, NextFunction} from 'express';
import {insertUser, getUserInfo, updatePassword, updateEmailandPassword, hasSpotifyPremium, handleOAuth} from '../models/authModels'
import {hashString, compareHash, generateCodeVerifier, generateCodeChallenge} from '../utils/encryption'
import { generateToken } from '../utils/jwt';
import crypto from 'crypto'
import { getToken, setToken } from '../utils/redis';
import { AuthSoundcloudToken, getSoundcloudUserInfo } from '../services/soundcloud';
import { getAccessToken } from '../models/tokenModels';
import { User } from '../utils/types';

const cookieExpiration = parseInt(process.env.COOKIE_EXPIRATION_MS ?? '86400000');

export const checkAuth = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userInfo = await getUserInfo(user.userId);
        const userHasPassword = userInfo.hashed_password !== null;
        const userHasSpotifyPremium = (await hasSpotifyPremium(user.userId)); // TODO: Test this using non-premium account
        return res.status(200).json({ isAuthenticated: true, userHasPassword, userHasSpotifyPremium, userInfo: {volume: userInfo.volume}});
    } catch (error) {
        next(error);
    }
}

export const token = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const {provider} = req.body;
        const token =  await getAccessToken(user.userId,provider);
        return res.status(200).json({token})
    } catch (error) {
        next(error);
    }
}

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const hashed_password = await hashString(password)
        const userId = await insertUser(email, hashed_password);
        const token = generateToken({userId});
        res.cookie('authToken', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: cookieExpiration,});
        return res.status(201).json({message:'Registration Successful', userInfo:{volume:0.5}, userHasPassword: true})
    } catch (error:any) {
        next(error);
    }
}

export const spotifyAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: any = req.user;
        const provider = user.provider;
        const providerUserId = user.id;
        const premium = (user.product === 'premium');
        const {accessToken,refreshToken} = (req.authInfo as any);
        const token = await handleOAuth(provider,providerUserId,premium,refreshToken,accessToken);
        res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: cookieExpiration,});
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
        return res.redirect(`https://secure.soundcloud.com/authorize?client_id=${process.env.SOUNDCLOUD_CLIENT_ID}&redirect_uri=${process.env.SOUNDCLOUD_REDIRECT_URI}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`)
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
        const provider = 'soundcloud';
        const providerUserId = userInfo.urn
        const premium = false;
        const token = await handleOAuth(provider,providerUserId,premium,refresh_token, access_token);
        res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: cookieExpiration,});
        return res.redirect(`${process.env.FRONTEND_BASE_URL}/home`)
    } catch (error) {
        next(error)
    }
}

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email, password} = req.body
        const userInfo = await getUserInfo(email);
        if (!userInfo || !userInfo.hashed_password) {
            return res.status(401).json({ error: "Email does not exist or account may not be properly setup with Spotify/SoundCloud account." });
        }
        const hashed_password = userInfo.hashed_password;
        if (await compareHash(password, hashed_password)) { // Create JWT, log-in user
            const userId = userInfo.user_id;
            const token =  generateToken({userId})
            res.cookie('authToken', token, {httpOnly: true,secure: process.env.NODE_ENV === 'production',maxAge: cookieExpiration,});
            return res.status(200).json({messageg:'Sign-In Successful.', userHasPassword: true,})
        } else {
            return res.status(401).json({error:"Incorrect password."})
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
        const user = req.user as User;
        const {email,password} = req.body;
        const userId = user.userId;
        const hashed_password = await hashString(password);
        await updateEmailandPassword(userId,email,hashed_password);
        return res.status(200).json({message:'Account Successfully Updated.'});
    } catch (error) {
        next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;
        const password = req.body.password;
        const hashed_password = await hashString(password);
        await updatePassword(userId, hashed_password);
        return res.status(200).json({message:'Password Change Successful.'});
    } catch (error) {
        next(error)
    }
}





