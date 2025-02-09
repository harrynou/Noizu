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

export const isProviderConnected = async (provider: string, providerUserId: string, premium:boolean): Promise<number|null> => {
    try {
        const results = await pool.query("SELECT users.user_id, linked_accounts.premium FROM linked_accounts, users WHERE linked_accounts.user_id = users.user_id AND provider = $1 AND provider_user_id = $2", [provider,providerUserId])
        if (results?.rowCount && results.rowCount > 0) {
            const userId = results.rows[0].user_id;
            if (results.rows[0].premium !== premium){
                await pool.query("UPDATE linked_accounts SET premium = $1 WHERE user_id = $2 AND provider = $3", [premium, userId, provider]);
            }
            return userId
        }
        return null; 
    } catch (error) {
        throw error
    }
}

export const registerByProvider = async (provider:string, providerUserId:string, refresh_token:string, access_token: string, premium:boolean): Promise<number> => {
    try {
        const user_id = await insertUser();
        await connectProvider(user_id, provider, providerUserId,refresh_token, premium);
        await setAccessToken(user_id, provider, access_token, 3600);
        return user_id
    } catch (error) {
        throw error
    }
}


export const connectProvider = async (user_id:number, provider:string, providerUserId:string, refresh_token:string, premium:boolean): Promise<void> => {
    try { 
        let provider_column: string;
        if (provider === 'spotify') {
            provider_column = 'spotify_account_id';
        } else if (provider === 'soundcloud') {
            provider_column = 'soundcloud_account_id';
        } else {
            throw new Error(`Unsupported provider: ${provider}`);
        }
        const results = await pool.query("INSERT INTO linked_accounts (user_id,provider,provider_user_id,refresh_token, premium) VALUES ($1,$2,$3,$4,$5) RETURNING account_id",[user_id,provider,providerUserId,refresh_token, premium])
        const provider_account_id = results.rows[0].account_id
        await pool.query(`UPDATE users SET ${provider_column} = $1 WHERE user_id = $2`, [provider_account_id, user_id])
    } catch(error){
        throw error
    }
}

export const getUserPassword = async (userKey:string | number): Promise<string|null> => { // Password returned is hashed
    try {
        let column: string;
        if (typeof userKey === 'string' ) {
            column = 'email';
        } else {
            column = 'user_id';
        }
        const results = await pool.query(`SELECT password_hash FROM users WHERE ${column} = $1`, [userKey])
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

export const updateEmailandPassword = async (userId: number, email:string, hashed_password:string): Promise<void> => {
    try {
        await pool.query("UPDATE users SET email = $1, password_hash = $2 WHERE user_id = $3", [email,hashed_password,userId]);
    } catch (error) {
        throw error
    }
}


export const updatePassword = async (userId: number, hashed_password:string): Promise<void> => {
    try {
        await pool.query("UPDATE users SET password_hash = $1 WHERE user_id = $2",[hashed_password,userId])
    } catch (error) {
        throw error
    }
}

export const hasSpotifyPremium = async (userId: number): Promise<boolean> => {
    try {
        const results = await pool.query("SELECT linked_accounts.premium FROM users, linked_accounts WHERE users.user_id = linked_accounts.user_id AND linked_accounts.user_id = $1",[userId]);
        const {rows} = results;
        if (rows.length > 0){
            return (rows[0].premium === true);
        } else {
            return false;
        }
    } catch (error) {
        throw error;
    }
}