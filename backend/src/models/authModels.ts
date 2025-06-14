import pool from "../config/db";
import { insertProvider } from "./settingsModels";
import { generateToken } from "../utils/jwt";
import { setAccessToken } from "./tokenModels";

export const insertUser = async (email?: string, password_encrypted?: string): Promise<number> => {
  try {
    const results = await pool.query("INSERT INTO users (email,hashed_password) VALUES ($1, $2) RETURNING user_id", [
      email || null,
      password_encrypted || null,
    ]);
    return results.rows[0].user_id;
  } catch (error) {
    throw error;
  }
};

export const isProviderConnected = async (
  provider: string,
  providerUserId: string,
  premium: boolean
): Promise<number | null> => {
  try {
    const results = await pool.query(
      "SELECT users.user_id, linked_accounts.premium FROM linked_accounts, users WHERE linked_accounts.user_id = users.user_id AND provider = $1 AND provider_user_id = $2",
      [provider, providerUserId]
    );
    if (results.rowCount && results.rowCount > 0) {
      const userId = results.rows[0].user_id;
      //   Updates premium status
      if (results.rows[0].premium !== premium) {
        await pool.query("UPDATE linked_accounts SET premium = $1 WHERE user_id = $2 AND provider = $3", [
          premium,
          userId,
          provider,
        ]);
      }
      return userId;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const registerByProvider = async (
  provider: string,
  providerUserId: string,
  providerUsername: string,
  refresh_token: string,
  access_token: string,
  premium: boolean
): Promise<number> => {
  try {
    const user_id = await insertUser();
    await insertProvider(user_id, provider, providerUserId, refresh_token, premium, providerUsername);
    await setAccessToken(user_id, provider, access_token, 3600);
    return user_id;
  } catch (error) {
    throw error;
  }
};

export const retrieveUserInfo = async (userKey: string | number): Promise<any | null> => {
  try {
    let column: string;
    // Search by email or ID key
    if (typeof userKey === "string") {
      column = "email";
    } else {
      column = "user_id";
    }
    const results = await pool.query(`SELECT user_id, email, hashed_password, volume FROM users WHERE ${column} = $1`, [
      userKey,
    ]);
    if (results.rowCount && results.rowCount > 0) {
      return results.rows[0]; // object with userInfo
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const hasSpotifyPremium = async (userId: number): Promise<boolean> => {
  try {
    const results = await pool.query(
      "SELECT linked_accounts.premium FROM users, linked_accounts WHERE users.user_id = linked_accounts.user_id AND linked_accounts.user_id = $1",
      [userId]
    );
    const { rows } = results;
    if (rows.length > 0) {
      return rows[0].premium === true;
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

export const handleOAuth = async (
  provider: string,
  providerUserId: string,
  providerUsername: string,
  premium: boolean,
  refreshToken: string,
  accessToken: string,
  loggedInUserId?: number
) => {
  let userId = await isProviderConnected(provider, providerUserId, premium);
  if (loggedInUserId) {
    // Settings Auth Logic
    if (userId === null) {
      // If provider is not connected, connect to app acct
      await insertProvider(loggedInUserId, provider, providerUserId, refreshToken, premium, providerUsername);
      return "True";
    } else {
      // Else when account is provider is already linked, return response back to frontend
      return null;
    }
  } else {
    // Login Auth Logic
    if (userId === null) {
      // Create an app acct if app acct does not exist
      userId = await registerByProvider(provider, providerUserId, providerUsername, refreshToken, accessToken, premium);
    }
  }
  const token = generateToken({ userId });
  return token;
};
