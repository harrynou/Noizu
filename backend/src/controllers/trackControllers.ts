import { Request, Response, NextFunction } from "express";
import { User } from "../utils/types";
import { addFavorite, retrieveFavorites, deleteFavorite } from "../models/trackModels";
import { getSpotifyTracks } from "../services/spotify";
import { getAccessToken } from "../models/tokenModels";
import { normalizeTrackData } from "../services/normalizeData";
import { getSoundcloudTracks } from "../services/soundcloud";
import CacheService from "../services/cacheService";

export const favoriteTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { trackId, provider } = req.body;
    
    // Add to database
    await addFavorite(userId, trackId, provider);
    
    // Invalidate user favorites cache to ensure fresh data on next fetch
    await CacheService.invalidateUserFavorites(userId.toString(), provider);
    
    res.status(200).json("Favorite Added.");
  } catch (error) {
    next(error);
  }
};

export const unfavoriteTrack = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const { trackId, provider } = req.body;
    
    // Remove from database
    await deleteFavorite(userId, trackId, provider);
    
    // Invalidate user favorites cache to ensure fresh data on next fetch
    await CacheService.invalidateUserFavorites(userId.toString(), provider);
    
    res.status(200).json("Favorite Removed.");
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const userId = user.userId;
    const userIdStr = userId.toString();

    // Check cache first for both providers
    let spotifyFavoriteTracks = await CacheService.getCachedUserFavorites(userIdStr, "spotify");
    let soundcloudFavoriteTracks = await CacheService.getCachedUserFavorites(userIdStr, "soundcloud");

    // Fetch Spotify favorites if not cached
    if (!spotifyFavoriteTracks) {
      let FavoriteData = await retrieveFavorites(userId, "spotify");
      let trackIds = FavoriteData.map((item) => item.trackId);
      let accessToken = await getAccessToken(userId, "spotify");
      
      if (accessToken && trackIds.length > 0) {
        let tracksData = (await getSpotifyTracks(trackIds, accessToken)).tracks;
        spotifyFavoriteTracks = await normalizeTrackData("spotify", tracksData, userId);
        
        // Cache the results
        await CacheService.cacheUserFavorites(userIdStr, "spotify", spotifyFavoriteTracks);
      } else {
        spotifyFavoriteTracks = [];
      }
    }

    // Fetch SoundCloud favorites if not cached
    if (!soundcloudFavoriteTracks) {
      let FavoriteData = await retrieveFavorites(userId, "soundcloud");
      let trackIds = FavoriteData.map((item) => item.trackId);
      
      if (trackIds.length > 0) {
        let tracksData = await getSoundcloudTracks(trackIds);
        soundcloudFavoriteTracks = await normalizeTrackData("soundcloud", tracksData, userId);
        
        // Cache the results
        await CacheService.cacheUserFavorites(userIdStr, "soundcloud", soundcloudFavoriteTracks);
      } else {
        soundcloudFavoriteTracks = [];
      }
    }

    res.status(200).json({ 
      spotifyFavoriteTracks: spotifyFavoriteTracks || [], 
      soundcloudFavoriteTracks: soundcloudFavoriteTracks || [] 
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    next(error);
  }
};
