import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import { hashString } from "../utils/encryption";
import { updateEmailandPassword, updatePassword, removeProvider } from "../models/settingsModels";
import { soundcloudRedirectHelperForSettings } from "../utils/helper";
import { handleOAuth } from "../models/authModels";
import { AuthSoundcloudToken, getSoundcloudUserInfo } from "../services/soundcloud";
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

// Store user context before Spotify OAuth redirect
export const connectSpotifyInit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const state = crypto.randomBytes(32).toString("hex");

    // Store user ID in Redis with state as key for 10 minutes
    await setToken(`oauth_state:${state}`, { userId: user.userId, provider: "spotify" }, 600);

    // Pass state to next middleware (Passport)
    (req as any).oauthState = state;
    next();
  } catch (error) {
    next(error);
  }
};

// Spotify callback for settings connection
export const spotifyConnect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const spotifyUser: any = req.user;
    const { accessToken, refreshToken } = req.authInfo as any;
    const { state } = req.query;

    if (!state) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=missing_state`);
    }

    // Retrieve user context from Redis using state
    const storedData = await getToken(`oauth_state:${state}`);
    if (!storedData || storedData.provider !== "spotify") {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=invalid_state`);
    }

    const userId = storedData.userId;
    const provider = "spotify";
    const providerUserId = spotifyUser.id;
    const premium = spotifyUser.product === "premium";

    // Connect the provider to the existing user account
    const result = await handleOAuth(provider, providerUserId, premium, refreshToken, accessToken, userId);

    // Clean up state from Redis
    await setToken(`oauth_state:${state}`, null, 1);

    if (result === null) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=account_already_linked`);
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?success=spotify_connected`);
  } catch (error) {
    console.error("Spotify connect error:", error);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=connection_failed`);
  }
};

// SoundCloud connection initiation
export const connectSoundcloud = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const state = crypto.randomBytes(32).toString("hex");

    // Store user context in Redis
    await setToken(`oauth_state:${state}`, { userId: user.userId, provider: "soundcloud" }, 600);
    // Use the updated helper function with state
    const url = await soundcloudRedirectHelperForSettings(process.env.SOUNDCLOUD_SETTINGS_REDIRECT_URI, state);
    return res.redirect(url);
  } catch (error) {
    next(error);
  }
};

// SoundCloud callback for settings connection
export const soundcloudConnect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=oauth_denied`);
    }

    if (!code || !state) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=missing_params`);
    }

    // Retrieve user context and code verifier from Redis
    const storedData = await getToken(`oauth_state:${state}`);
    if (!storedData || storedData.provider !== "soundcloud") {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=invalid_state`);
    }

    const userId = storedData.userId;
    const codeVerifier = storedData.codeVerifier;

    // Exchange code for tokens
    const { access_token, refresh_token } = await AuthSoundcloudToken(code as string, codeVerifier);

    // Get user info to extract SoundCloud user ID
    const userInfo = await getSoundcloudUserInfo(access_token);
    const providerUserId = userInfo.urn.split(":")[2];
    const premium = false;

    // Connect the provider to the existing user account
    const result = await handleOAuth("soundcloud", providerUserId, premium, refresh_token, access_token, userId);

    // Clean up state from Redis
    await setToken(`oauth_state:${state}`, null, 1);

    if (result === null) {
      return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=account_already_linked`);
    }

    return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?success=soundcloud_connected`);
  } catch (error) {
    console.error("SoundCloud connect error:", error);
    return res.redirect(`${process.env.FRONTEND_BASE_URL}/settings?error=connection_failed`);
  }
};

// Disconnect provider
export const disconnectProvider = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { provider } = req.body;
    await removeProvider(provider, userId);
    return res.status(200).json({ message: "Provider disconnected successfully." });
  } catch (error) {
    next(error);
  }
};
