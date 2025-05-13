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
            tracks = searchData.filter((track: any) => track.policy !== 'SNIP').map((track: any) => ({ // Removes tracks with only preview
                id: track.urn, // soundcloud IDs may be numeric
                title: track.title,
                artistInfo: [{
                    name: track.user.username,
                    id: track.user.urn,
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
        const favoriteMap = new Map();
        favoriteData.forEach(item => {
            favoriteMap.set(item.trackId, item.favoritedAt);
        });
        
        return tracks.map(track => ({
            ...track,
            isFavorited: favoriteMap.has(track.id),
            favoritedAt: favoriteMap.get(track.id) || null
        }));
    } catch (error){
        throw error
    }
}