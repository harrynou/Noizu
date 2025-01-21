import { setToken, getToken, delToken } from "../utils/redis";
import pool from '../config/db'
import {refreshSpotifyToken} from '../services/spotify'

// Functions to set, get, and remove Access Tokens from redis cache 

export const setAccessToken = async (userId: number, provider:string, accessToken: string, ttl: number): Promise<void> => {
    const key = `${userId}:${provider}`
    await setToken(key, {accessToken}, ttl)
}

export const getAccessToken = async (userId: number, provider:string): Promise<{accessToken:string}> => {
    const key = `${userId}:${provider}`
    return await getToken(key)
}

export const removeAccessToken = async (userId: number, provider:string): Promise<void> => {
    const key = `${userId}:${provider}`
    await delToken(key)
} 

// Retrieves refresh token from db

export const getRefreshToken = async (userId: number, provider:string): Promise<string> => {
    try {
        const response = await pool.query("SELECT refresh_token FROM linked_accounts WHERE user_id = $1 AND provider = $2",[userId,provider])
    return response.rows[0].refresh_token
    } catch (error){
        throw error
    }
}

// Gets a new access token from spotify

export const getNewAccessToken = async (userId: number, provider:string): Promise<string> => {
    try{
        const refresh_token = await getRefreshToken(userId, provider)
        return await refreshSpotifyToken(refresh_token);
    }catch (error){
        throw error
    }
}






