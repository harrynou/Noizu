import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import uploadImageToS3 from "../services/awsS3";
import {
  insertPlaylist,
  deletePlaylist,
  retrievePlaylists,
  insertPlaylistTrack,
  deletePlaylistTrack,
  retrievePlaylistTracks,
} from "../models/playlistModels";
import { grabTrackIds } from "../utils/helper";
import { getSpotifyTracks } from "../services/spotify";
import { getAccessToken } from "../models/tokenModels";
import { normalizeTrackData } from "../services/normalizeData";
import { getSoundcloudTracks } from "../services/soundcloud";
import CacheService from "../services/cacheService";

export const createPlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { name } = req.body;
    let imageUrl = null;
    if (req.file) {
      try {
        imageUrl = await uploadImageToS3(req.file);
      } catch (error) {
        // Handle S3 upload errors but continue creating playlist without image
        console.error("Failed to upload image:", error);
      }
    }
    const playlistId = await insertPlaylist(userId, name, imageUrl);
    
    // Invalidate user's playlist cache since they now have a new playlist
    await CacheService.invalidateUserPlaylists(userId.toString());
    
    return res.status(201).json({ playlistId, imageUrl, message: "Playlist successfully created." });
  } catch (error) {
    next(error);
  }
};

export const removePlaylist = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId } = req.body;

    await deletePlaylist(userId, playlistId);
    
    // Invalidate both user's playlist cache and the specific playlist tracks cache
    await Promise.all([
      CacheService.invalidateUserPlaylists(userId.toString()),
      CacheService.invalidatePlaylistTracks(playlistId.toString())
    ]);
    
    return res.status(200).json({ message: "Playlist successfully removed." });
  } catch (error) {
    next(error);
  }
};

export const getPlaylists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const userIdStr = userId.toString();

    // Check cache first
    let playlists = await CacheService.getCachedPlaylistData(userIdStr);
    
    if (!playlists) {
      // If not cached, fetch from database
      playlists = await retrievePlaylists(userId);
      
      // Cache the results
      await CacheService.cachePlaylistData(userIdStr, playlists);
    }

    return res.status(200).json({ playlists, message: "Playlist successfully retrieved." });
  } catch (error) {
    next(error);
  }
};

export const addTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId, trackId, provider } = req.body;

    const playlistTrackId = await insertPlaylistTrack(userId, playlistId, trackId, provider);
    
    // Invalidate the playlist tracks cache since we added a track
    await CacheService.invalidatePlaylistTracks(playlistId.toString());
    
    return res.status(201).json({ message: "Track successfully added." });
  } catch (error) {
    next(error);
  }
};

export const removeTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId, trackId, provider } = req.body;
    
    await deletePlaylistTrack(userId, playlistId, trackId, provider);
    
    // Invalidate the playlist tracks cache since we removed a track
    await CacheService.invalidatePlaylistTracks(playlistId.toString());
    
    return res.status(200).json({ message: "Track successfully removed." });
  } catch (error) {
    next(error);
  }
};

export const getPlaylistTracks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { playlistId } = req.params;

    // Check cache first
    let cachedTracks = await CacheService.getCachedPlaylistTracks(playlistId);
    
    if (cachedTracks) {
      // If we have cached tracks, we still need to normalize them for the specific user
      // to get their favorite status
      const spotifyPlaylistTracks = cachedTracks.spotifyPlaylistTracks ? 
        await normalizeTrackData("spotify", cachedTracks.spotifyPlaylistTracks, userId) : [];
      const soundcloudPlaylistTracks = cachedTracks.soundcloudPlaylistTracks ? 
        await normalizeTrackData("soundcloud", cachedTracks.soundcloudPlaylistTracks, userId) : [];

      return res.status(200).json({
        playlistTracks: { spotifyPlaylistTracks, soundcloudPlaylistTracks },
        message: "Playlist tracks successfully retrieved.",
      });
    }

    // If not cached, fetch from database and APIs
    let trackIds;
    let accessToken;
    let trackData;
    let spotifyPlaylistTracks: any[] = [];
    let soundcloudPlaylistTracks: any[] = [];
    let rawSpotifyTracks: any[] = [];
    let rawSoundcloudTracks: any[] = [];
    
    const playlistData = await retrievePlaylistTracks(Number(playlistId));

    // Fetch Spotify tracks
    trackIds = grabTrackIds(playlistData, "spotify");
    if (trackIds.length > 0) {
      accessToken = await getAccessToken(userId, "spotify");
      trackData = (await getSpotifyTracks(trackIds, accessToken)).tracks;
      rawSpotifyTracks = trackData;
      spotifyPlaylistTracks = await normalizeTrackData("spotify", trackData, userId);
    }

    // Fetch SoundCloud tracks
    trackIds = grabTrackIds(playlistData, "soundcloud");
    if (trackIds.length > 0) {
      trackData = await getSoundcloudTracks(trackIds);
      rawSoundcloudTracks = trackData;
      soundcloudPlaylistTracks = await normalizeTrackData("soundcloud", trackData, userId);
    }

    // Cache the raw track data (before normalization to avoid user-specific data in cache)
    await CacheService.cachePlaylistTracks(playlistId, {
      spotifyPlaylistTracks: rawSpotifyTracks,
      soundcloudPlaylistTracks: rawSoundcloudTracks
    });

    return res.status(200).json({
      playlistTracks: { spotifyPlaylistTracks, soundcloudPlaylistTracks },
      message: "Playlist tracks successfully retrieved.",
    });
  } catch (error) {
    console.error('Get playlist tracks error:', error);
    next(error);
  }
};
