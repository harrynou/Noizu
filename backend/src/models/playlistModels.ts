import pool from "../config/db";

// Inserts new playlist, returns playlist_id
export const insertPlaylist = async (userId: number, name: string, imageUrl: string | null): Promise<number> => {
  try {
    let query = "INSERT INTO playlists (user_id, name) VALUES ($1,$2) RETURNING playlist_id";
    let params = [userId, name];
    if (imageUrl) {
      query = "INSERT INTO playlists (user_id, name, image_url) VALUES ($1,$2,$3) RETURNING playlist_id";
      params.push(imageUrl);
    }
    const result = await pool.query(query, params);
    if (!result.rows || result.rows.length === 0) {
      throw new Error("Failed to create playlist: No data returned from query");
    }
    return result.rows[0].playlist_id;
  } catch (error) {
    throw error;
  }
};

// Deletes Playlist, returns success boolean
export const deletePlaylist = async (userId: number, playlistId: number): Promise<boolean> => {
  try {
    const result = await pool.query("DELETE FROM playlists WHERE user_id = $1 AND playlist_id = $2", [
      userId,
      playlistId,
    ]);
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

// Retrieves all playlists by a user, returns array of playlists
export const retrievePlaylists = async (userId: number) => {
  try {
    const result = await pool.query("SELECT playlist_id, name, image_url, track_count, created_at AT TIME ZONE 'UTC' as created_at, updated_at AT TIME ZONE 'UTC' as updated_at, last_played_at AT TIME ZONE 'UTC' as last_played_at FROM playlists WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    const playlists = result.rows.map((playlist) => {
      return {
        playlistId: playlist.playlist_id,
        name: playlist.name,
        imageUrl: playlist.image_url,
        trackCount: playlist.track_count,
        createdAt: playlist.created_at,
        updatedAt: playlist.updated_at,
        lastPlayedAt: playlist.last_played_at,
      };
    });
    return playlists;
  } catch (error) {
    throw error;
  }
};

// Inserts a track into a playlist, returns playlist_track_id
export const insertPlaylistTrack = async (userId: number, playlistId: number, trackId: number, provider: string) => {
  try {
    const exists = await pool.query(
      "SELECT 1 FROM playlist_tracks WHERE user_id = $1 AND playlist_id = $2 AND track_id = $3 AND provider = $4",
      [userId, playlistId, trackId, provider]
    );
    if (exists.rows.length === 1) {
      return 1;
    }
    const result = await pool.query(
      "INSERT INTO playlist_tracks (user_id, playlist_id, track_id, provider) VALUES($1,$2,$3,$4) RETURNING playlist_track_id",
      [userId, playlistId, trackId, provider]
    );
    return 1;
  } catch (error) {
    throw error;
  }
};

// Deletes playlist track, returns success boolean
export const deletePlaylistTrack = async (userId: number, playlistId: number, trackId: number, provider: string) => {
  try {
    const result = await pool.query(
      "DELETE FROM playlist_tracks WHERE user_id = $1 AND playlist_id = $2 AND track_id = $3 AND provider = $4",
      [userId, playlistId, trackId, provider]
    );
    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    throw error;
  }
};

// Retrieves all tracks within a playlist, returns array of track from most recently added
export const retrievePlaylistTracks = async (playlistId: number) => {
  try {
    const results = await pool.query("SELECT playlist_track_id, playlist_id, track_id, user_id, provider, added_at AT TIME ZONE 'UTC' as added_at FROM playlist_tracks WHERE playlist_id = $1 ORDER BY added_at DESC", [
      playlistId,
    ]);
    return results.rows;
  } catch (error) {
    throw error;
  }
};
