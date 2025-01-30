import pool from '../config/db'
import { setAccessToken } from './tokenModels';


export const insertUser = async (email?:string, password_encrypted?:string): Promise<number> => {
    try {
        const results = await pool.query("INSERT INTO users (email,password_hash) VALUES ($1, $2) RETURNING user_id", [email || null,password_encrypted || null])
        return results.rows[0].user_id;
    } catch(error) {
        throw error;
    }
}

export const isProviderConnected = async (provider: string, providerUserId: string): Promise<number|null> => {
    try {
        const results = await pool.query("SELECT users.user_id FROM linked_accounts, users WHERE linked_accounts.user_id = users.user_id AND provider = $1 AND provider_user_id = $2", [provider,providerUserId])
        if (results?.rowCount && results.rowCount > 0) {
            return results.rows[0].user_id;
        }
        return null; 
    } catch (error) {
        throw error
    }
}

export const registerByProvider = async (provider:string, providerUserId:string, refresh_token:string, access_token: string): Promise<number> => {
    try {
        const user_id = await insertUser();
        await connectProvider(user_id, provider, providerUserId,refresh_token);
        await setAccessToken(user_id, provider, access_token, 3600);
        return user_id
    } catch (error) {
        throw error
    }
}


export const connectProvider = async (user_id:number, provider:string, providerUserId:string, refresh_token:string): Promise<void> => {
    try { 
        let provider_column: string;
        if (provider === 'spotify') {
            provider_column = 'spotify_account_id';
        } else if (provider === 'soundcloud') {
            provider_column = 'soundcloud_account_id';
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        const results = await pool.query("INSERT INTO linked_accounts (user_id,provider,provider_user_id,refresh_token) VALUES ($1,$2,$3,$4) RETURNING account_id",[user_id,provider,providerUserId,refresh_token])
        const provider_account_id = results.rows[0].account_id
        await pool.query(`UPDATE users SET ${provider_column} = $1 WHERE user_id = $2`, [provider_account_id, user_id])
    } catch(error){
        throw error
    }
}

export const getUserPassword = async (userId:string): Promise<string|null> => { // Password returned is hashed
    try {
        const results = await pool.query("SELECT password_hash FROM users WHERE user_id = $1", [userId])
        if (results && results.rowCount && results.rowCount > 0) {
            return results.rows[0].password_hash; // Return the hashed password
        }
        return null;
    } catch (error){
        throw error
    } 
}

export const getUserId = async (email:string): Promise<number> => {
    try {
        const results = await pool.query("SELECT user_id FROM users WHERE email = $1", [email])
        return results.rows[0].user_id
    } catch (error){
        throw error
    } 
}

export const updatePassword = async (hashed_password:string, userId: number): Promise<void> => {
    try {
        await pool.query("UPDATE users SET password_hash = $1 WHERE user_id = $2",[hashed_password,userId])
    } catch (error) {
        throw error
    }
}