import { createContext, useContext, useState, useEffect } from "react";
import { getFavoriteTracks } from "../services/api";

interface FavoriteContextType {
    spotifyFavoriteTracks: Track[];
    soundcloudFavoriteTracks: Track[];
    addFavorite: (track:Track) => void;
    removeFavorite: (trackId: string, provider: string) => void;
    isFavorited: (trackId: string, provider: string) => boolean;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavoriteContext = () => {
    const context = useContext(FavoriteContext);
    if (!context){
        throw new Error('useMusicPlayer must be used within MusicPlayerProvider');
    };
    return context;
}

export const FavoriteProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [spotifyFavoriteTracks, setSpotifyFavoriteTracks] = useState<Track[]>([]);
    const [soundcloudFavoriteTracks, setSoundcloudFavoriteTracks] = useState<Track[]>([]);

    useEffect(() => {
        const tracks = async () => {
            const tracks = await getFavoriteTracks();
            setSpotifyFavoriteTracks(tracks.spotifyFavoriteTracks);
            setSoundcloudFavoriteTracks(tracks.soundcloudFavoriteTracks);
        };
        tracks();
    }, [])

    const addFavorite = (track:Track) => {
        if (track.provider === 'spotify'){
            setSpotifyFavoriteTracks((prevTracks) => [
                ...prevTracks,
                track
            ])
        } else if (track.provider === 'soundcloud'){
            setSoundcloudFavoriteTracks((prevTracks) => [
                ...prevTracks,
                track
            ])
        } else {console.error("Unknown Provider")};
    }

    const removeFavorite = (trackId: string, provider: string) => {
        if (provider === 'spotify'){
            setSpotifyFavoriteTracks((prevTrack) => prevTrack.filter(track => track.id !== trackId));
        } else if (provider === 'soundcloud'){
            setSoundcloudFavoriteTracks((prevTrack) => prevTrack.filter(track => track.id !== trackId));

        } else {console.error("Unknown Provider")};
    };

    const isFavorited = (trackId: string, provider: string) => {
        if (provider === 'spotify'){
            return spotifyFavoriteTracks.some(track => track.id === trackId);
        } else if (provider === 'soundcloud'){
            return soundcloudFavoriteTracks.some(track => track.id === trackId);
        } else {
            console.error("Unknown Provider")
            return false;
        };  
    };

    const contextValue = {
        spotifyFavoriteTracks,
        soundcloudFavoriteTracks,
        addFavorite,
        removeFavorite,
        isFavorited,
    }
    return (
        <FavoriteContext.Provider value={contextValue} children={children}></FavoriteContext.Provider>
    )
} 
