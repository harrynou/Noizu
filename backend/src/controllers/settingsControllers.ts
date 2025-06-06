import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import { hashString } from "../utils/encryption";
import { updateEmailandPassword, updatePassword, removeProvider, insertProvider } from "../models/settingsModels";
import { soundcloudRedirectHelper } from "../utils/helper";
import { handleOAuth } from "../models/authModels";
import crypto from "crypto";
import { getToken, setToken } from "../utils/redis";

const cookieExpiration = parseInt(process.env.COOKIE_EXPIRATION_MS ?? "86400000");

export const setupAccount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { email, password } = req.body;
    const userId = user.userId;
    const hashed_password = await hashString(password);
    await updateEmailandPassword(userId, email, hashed_password);
    return res.status(200).json({ message: "Account Successfully Updated." });
  } catch (error) {
    next(error);
  }
};

// Changes password in settings page
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const password = req.body.password;
    const hashed_password = await hashString(password);
    await updatePassword(userId, hashed_password);
    return res.status(200).json({ message: "Password Changed Successful." });
  } catch (error) {
    next(error);
  }
};

// Connects provider from the settings page
export const connectProvider = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;
  const userId = user.userId;
};

// Disconnects provider from the settings page
export const disconnectProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { provider } = req.body;
    await removeProvider(provider, userId);
  } catch (error) {
    throw error;
  }
};

export const connectSpotifyInit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const state = crypto.randomBytes(32).toString("hex");

    // Store user ID in Redis with state as key for 10 minutes
    await setToken(`oauth_state:${state}`, { userId: user.userId, provider: "spotify" }, 600);

    // Pass state to next middleware (Passport)
    (req as any).oauthState = state;
    next(); // Continue to Passport authentication
  } catch (error) {
    next(error);
  }
};

// Callback after spotify auth in settings page
export const spotifyConnect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spotifyUser: any = req.user;
    const provider = spotifyUser.provider;
    const providerUserId = spotifyUser.id;
    const premium = spotifyUser.product === "premium";
    const { accessToken, refreshToken } = req.authInfo as any;
    const { state } = req.query;
    if (!state) {
      console.log("State does not exist");
    }
    const { userId } = await getToken(`oauth_state:${state}`);
    const token = await handleOAuth(provider, providerUserId, premium, refreshToken, accessToken, userId);
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: cookieExpiration,
    });
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings`);
  } catch (error: any) {
    next(error);
  }
};

export const soundcloudConnect = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {}
};

export const soundcloudSettingsRedirect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const url = await soundcloudRedirectHelper(process.env.SOUNDCLOUD_SETTINGS_REDIRECT_URI, userId);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
};
