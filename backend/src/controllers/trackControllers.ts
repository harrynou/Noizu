import {Request, Response, NextFunction} from 'express'
import {User} from '../utils/types'
import { addFavorite, retrieveFavorites, deleteFavorite } from '../models/trackModels';
import { getSpotifyTracks } from '../services/spotify';
import { getAccessToken } from '../models/tokenModels';
import { normalizeTrackData } from '../services/normalizeData';
import { getSoundcloudTracks } from '../services/soundcloud';

interface trackIdsType {
    spotifyTrackIds: string[];
    soundcloudTrackIds: string[];
}


export const favoriteTrack = async (req:Request, res: Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;
        const {trackId, provider} = req.body;
        addFavorite(userId,trackId,provider);
        res.status(200).json("Favorite Added.");
    } catch (error) {
        next(error);
    }
}

export const unfavoriteTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;
        const {trackId, provider} = req.body;
        deleteFavorite(userId, trackId, provider);
        res.status(200).json("Favorite Removed.");
    } catch (error) {
        next(error);
    }
}



export const getFavorites = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;

        // Spotify
        let FavoriteData = await retrieveFavorites(userId, 'spotify');
        let trackIds = FavoriteData.map(item => item.trackId);
        let accessToken = await getAccessToken(userId, 'spotify');
        let tracksData =  (await getSpotifyTracks(trackIds, accessToken)).tracks;
        let spotifyFavoriteTracks = await normalizeTrackData('spotify', tracksData, userId);

        // Soundcloud
        FavoriteData = await retrieveFavorites(userId, 'soundcloud');
        trackIds = FavoriteData.map(item => item.trackId);
        tracksData = await getSoundcloudTracks(trackIds);
        let soundcloudFavoriteTracks = await normalizeTrackData('soundcloud', tracksData, userId);
        res.status(200).json({spotifyFavoriteTracks, soundcloudFavoriteTracks});
    } catch (error) {
        next(error);
    }
}