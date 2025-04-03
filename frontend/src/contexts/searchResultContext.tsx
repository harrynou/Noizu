import {useContext, createContext, useState, useMemo} from 'react';

interface SearchResultContextType {
    spotifyTracks: any[],
    soundcloudTracks: any[],
    setTrackResults: (results: any[], provider: string) => void;
    toggleFavorite: (trackId: string,  provider: string) => void;
    getTrack: (trackId: string, provider: string) => Track | null;
}


const SearchResultContext = createContext<SearchResultContextType | undefined>(undefined);

export const useSearchResult = () => {
    const context = useContext(SearchResultContext);
    if (!context) {
        throw new Error('useSearchResult must be used within SearchResultProvider');
    }
    return context;
};

export const SearchResultProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [spotifyTracks, setSpotifyTracks] = useState<any[]>([]);
    const [soundcloudTracks, setSoundcloudTracks] = useState<any[]>([]);

    const setTrackResults = (results: any[], provider: string) => {
        if (provider === 'spotify') {
            setSpotifyTracks(results);
        } else if (provider === 'soundcloud'){
            setSoundcloudTracks(results);
        } else {
            console.error("Unknown Provider");
        }
    }

    // Updates track to be favorited in tracks object
    const toggleFavorite = (trackId: string, provider: string) => {
        const toggle = (track: any) =>
            track.id === trackId
            ? { ...track, isFavorited: !track.isFavorited } 
            : track;
            if (provider === 'spotify') {
                setSpotifyTracks(prevTracks => prevTracks.map(toggle));
            } else if (provider === 'soundcloud') {
                setSoundcloudTracks(prevTracks => prevTracks.map(toggle));
            } else {
                console.error("Unknown provider");
            }
    }

    const getTrack = (trackId: string, provider: string):Track | null => {
        if (provider === 'spotify'){
            return spotifyTracks.find((track) => (track.id === trackId) || null)
        } else if (provider === 'soundcloud'){
            return soundcloudTracks.find((track) => track.id === trackId) || null;
        } else {
            console.error("Unknown Provider");
            return null;
        }
    };

    const contextValue = useMemo(() => ({
        spotifyTracks,
        soundcloudTracks,
        setTrackResults,
        toggleFavorite,
        getTrack,
    }), [spotifyTracks, soundcloudTracks])

    return (
        <SearchResultContext.Provider value={contextValue} children={children}></SearchResultContext.Provider>
    )
}


