import {Request, Response, NextFunction} from 'express'
import {User} from '../utils/types'
import { retrieveFavorites, toggleFavorite } from '../models/trackModels';
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
        toggleFavorite(userId,trackId,provider);
        res.status(200).json("Favorite Added/Deleted.");
    } catch (error) {
        next(error);
    }
}

export const getFavorites = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const user = req.user as User;
        const userId = user.userId;

        // Spotify
        let trackIds = await retrieveFavorites(userId, 'spotify');
        let accessToken = await getAccessToken(userId, 'spotify');
        let tracksData = (await getSpotifyTracks(trackIds, accessToken)).tracks;
        let spotifyFavoriteTracks = await normalizeTrackData('spotify', tracksData);

        // Soundcloud
        trackIds = await retrieveFavorites(userId, 'soundcloud');
        tracksData = await getSoundcloudTracks(trackIds);
        let soundcloudFavoriteTracks = await normalizeTrackData('soundcloud', tracksData);
        res.status(200).json({spotifyFavoriteTracks, soundcloudFavoriteTracks});
    } catch (error) {
        next(error);
    }
}