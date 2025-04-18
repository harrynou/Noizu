import pool from "../config/db";
import { FavoriteDataType } from "../utils/types"

export const addFavorite = async (userId: number, trackId: string, provider: string): Promise<void> => {
    try {
        const insertion = await pool.query('INSERT INTO favorites(user_id, provider, track_id) VALUES ($1,$2,$3)', [userId, provider, trackId]);
    } catch (error) {
        throw error;
    }
}

export const deleteFavorite = async (userId: number, trackId: string, provider: string): Promise<void> => {
    try {
        const deletion = await pool.query('DELETE FROM favorites WHERE user_id = $1 AND provider = $2 AND track_id = $3', [userId, provider, trackId]);
    } catch (error) {
        throw error;
    }
} 

export const retrieveFavorites = async (userId: number, provider?: string, trackIds?: string[]): Promise<FavoriteDataType[]> => {
    try {
        let query = 'SELECT track_id, favorited_at FROM favorites WHERE user_id = $1';
        const params: any[] = [userId];
        if (provider) {
            query += ' AND provider = $2';
            params.push(provider);
        }
        if (trackIds && trackIds.length > 0) {
            query += ' AND track_id = ANY($3::text[])';
            params.push(trackIds);
        }
        query += ' ORDER BY favorited_at DESC';
        const results = await pool.query(query, params);
        const favoriteTrackData = results.rows.map(row => {
            const track: FavoriteDataType = {trackId: row.track_id, favoritedAt: row.favorited_at};
            return track
        });
        return favoriteTrackData
    } catch (error) {
        throw error;
    }
}