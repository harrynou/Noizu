import { setToken, getToken, delToken } from "../utils/redis";
import pool from "../config/db";
import { refreshSpotifyClientCredentials, refreshSpotifyToken } from "../services/spotify";
import { refreshSoundcloudClientCredentials, refreshSoundcloudToken } from "../services/soundcloud";

// Functions to set, get, and remove User Access Tokens from redis

export const setAccessToken = async (userId: number, provider: string, accessToken: string, ttl: number): Promise<void> => {
  const key = `${userId}:${provider}`;
  await setToken(key, accessToken, ttl);
};

export const getAccessToken = async (userId: number, provider: string): Promise<string> => {
  const key = `${userId}:${provider}`;
  var accessToken = await getToken(key);
  if (!accessToken) {
    accessToken = await getNewAccessToken(userId, provider);
  }
  return accessToken;
};

export const removeAccessToken = async (userId: number, provider: string): Promise<void> => {
  const key = `${userId}:${provider}`;
  await delToken(key);
};

// set, get, and remove Client Credentials Access Tokens from redis

export const setClientCredenitals = async (provider: string, clientCredentials: string, ttl: number): Promise<void> => {
  const key = `ClientCredentials:${provider}`;
  await setToken(key, clientCredentials, ttl);
};

export const getClientCredentials = async (provider: string): Promise<string> => {
  const key = `ClientCredentials:${provider}`;
  var accessToken = await getToken(key);
  if (!accessToken) {
    accessToken = await getNewClientCredentials(provider);
  }
  return accessToken;
};

export const delClientCredentials = async (provider: string): Promise<void> => {
  const key = `ClientCredentials:${provider}`;
  await delToken(key);
};

// Retrieves refresh token from db

export const getRefreshToken = async (userId: number, provider: string): Promise<string> => {
  try {
    const response = await pool.query("SELECT refresh_token FROM linked_accounts WHERE user_id = $1 AND provider = $2", [userId, provider]);
    return response.rows[0].refresh_token;
  } catch (error) {
    throw error;
  }
};

// Gets a new user access token

export const getNewAccessToken = async (userId: number, provider: string): Promise<string> => {
  try {
    const refresh_token = await getRefreshToken(userId, provider);
    if (provider === "spotify") {
      return await refreshSpotifyToken(userId, refresh_token);
    } else if (provider === "soundcloud") {
      return await refreshSoundcloudToken(userId, refresh_token);
    } else {
      throw new Error("Unknown Provider");
    }
  } catch (error) {
    throw error;
  }
};

export const getNewClientCredentials = async (provider: string): Promise<string> => {
  try {
    if (provider === "spotify") {
      return await refreshSpotifyClientCredentials();
    } else if (provider === "soundcloud") {
      return await refreshSoundcloudClientCredentials();
    } else {
      throw new Error("Unknown Provider");
    }
  } catch (error) {
    throw error;
  }
};

export const getOldOrNewClientCredentials = async (provider: string): Promise<string> => {
  try {
    var accessToken = await getClientCredentials(provider);
    if (!accessToken) {
      accessToken = await getNewClientCredentials(provider);
    }
    return accessToken;
  } catch (error) {
    throw error;
  }
};
