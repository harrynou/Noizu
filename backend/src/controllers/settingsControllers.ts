import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import { hashString } from "../utils/encryption";
import { updateEmailandPassword, updatePassword, removeProvider, insertProvider } from "../models/settingsModels";
import { soundcloudRedirectHelper } from "../utils/helper";
import { handleOAuth } from "../models/authModels";

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

// Callback after spotify auth in settings page
export const spotifyConnect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user: any = req.user;
    const provider = user.provider;
    const providerUserId = user.id;
    const premium = user.product === "premium";
    const { accessToken, refreshToken } = req.authInfo as any;
    const token = await handleOAuth(provider, providerUserId, premium, refreshToken, accessToken);
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
    const url = await soundcloudRedirectHelper(process.env.SOUNDCLOUD_SETTINGS_REDIRECT_URI);
    res.redirect(url);
  } catch (error) {
    next(error);
  }
};
