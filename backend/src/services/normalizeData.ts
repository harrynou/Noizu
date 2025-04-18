import { retrieveFavorites } from "../models/trackModels";
import { SearchItemType, FavoriteDataType } from '../utils/types'

// Assumes searchData will be in the format of spotify or soundcloud's array of track object
export const normalizeTrackData = async (provider:string, searchData: any, userId?: number): Promise<SearchItemType[]> => {
    let tracks: any[] = [];
    try {
        if (provider === 'spotify') {
            tracks = searchData.map((track: any) => ({
                id: track.id,
                title: track.name,
                artistInfo: track.artists.map((artist: any) => ({
                name: artist.name,
                profileUrl: artist.external_urls.spotify,
                id: artist.id,
            })),
                imageUrl: track.album.images[0]?.url,
                trackUrl: track.external_urls.spotify,
                previewUrl: track.preview_url,
                albumType: track.album.album_type,
                duration: track.duration_ms,
                uri: track.uri,
                provider: 'spotify',
            }));
        } else if (provider === 'soundcloud') {
            tracks = searchData.map((track: any) => ({
                id: String(track.id), // soundcloud IDs may be numeric
                title: track.title,
                artistInfo: [{
                    name: track.user.username,
                    id: track.user.id,
                    profileUrl: track.user.permalink_url,
                }],
                imageUrl: track.artwork_url || track.user.avatar_url,
                trackUrl: track.permalink_url,
                previewUrl: track.stream_url,
                albumType: null,
                duration: track.duration,
                uri: track.uri,
                provider: 'soundcloud',
            }));
        } else {
            throw Error("Unknown Provider");
        };
        const trackIds = tracks.map(track => track.id);
        let favoriteData: FavoriteDataType[] = [];
        if (userId){
            favoriteData = await retrieveFavorites(userId, provider, trackIds);
        }
        console.log(favoriteData)
        return tracks.map(track => {
            const favoriteInfo = favoriteData.find(item => item.trackId === track.id);
            return {
                ...track,
                isFavorited: favoriteInfo ? true : false,
                favoritedAt: favoriteInfo ? favoriteInfo.favoritedAt : null
              };
        });
    } catch (error){
        throw error
    }
}