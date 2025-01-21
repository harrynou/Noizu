import pool from '../config/db'
import { getAccessToken, setAccessToken } from './tokenModels';


export const insertUser = async (email:string, password_encrypted?:string): Promise<number> => {
    try {
        const results = await pool.query("INSERT INTO users (email,password_hash) VALUES ($1, $2) RETURNING user_id", [email,password_encrypted || null])
        return results.rows[0].user_id;
    } catch(error) {
        throw error;
    }
}

export const isProviderConnected = async (provider: string, provider_email: string): Promise<string|null> => {
    try {
        const results = await pool.query("SELECT users.email FROM linked_accounts, users WHERE linked_accounts.user_id = users.user_id AND provider = $1 AND provider_email = $2", [provider,provider_email])
        if (results?.rowCount && results.rowCount > 0) {
            return results.rows[0].email;
        }
        return null; 
    } catch (error) {
        throw error
    }
}

export const registerByProvider = async (provider:string, provider_email:string, refresh_token:string, access_token: string): Promise<number> => {
    try {
        const user_id = await insertUser(provider_email);
        await connectProvider(user_id, provider, provider_email, refresh_token);
        await setAccessToken(user_id, provider, access_token, 3600);
        return user_id
    } catch (error) {
        throw error
    }
}


export const connectProvider = async (user_id:number, provider:string, provider_email:string, refresh_token:string): Promise<void> => {
    try { 
        let provider_column: string;
        if (provider === 'spotify') {
            provider_column = 'spotify_account_id';
        } else if (provider === 'soundcloud') {
            provider_column = 'soundcloud_account_id';
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        const results = await pool.query("INSERT INTO linked_accounts (user_id,provider,provider_email,refresh_token) VALUES ($1,$2,$3,$4) RETURNING account_id",[user_id,provider,provider_email,refresh_token])
        const provider_account_id = results.rows[0].account_id
        await pool.query(`UPDATE users SET ${provider_column} = $1 WHERE user_id = $2`, [provider_account_id, user_id])
    } catch(error){
        throw error
    }
}

export const getUserPassword = async (email:string): Promise<string|null> => { // Password returned is hashed
    try {
        const results = await pool.query("SELECT password_hash FROM users WHERE email = $1", [email])
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