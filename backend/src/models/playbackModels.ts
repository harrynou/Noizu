import pool from '../config/db'
import { NotFoundError } from '../utils/errors';

export const updateUserVolume = async (userId: number, volume: number) => {
    try {
        const results = await pool.query("UPDATE users SET volume = $1 WHERE user_id = $2", [volume, userId]);
        if (results.rowCount === 0) {
            throw new NotFoundError(`User with ID ${userId} not found`);
        };
    } catch (error) {
        throw error;
    };
};
