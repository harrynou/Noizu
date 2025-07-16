import { useContext, createContext, useState, useMemo, useCallback } from "react";
import { searchQuery } from "../services/api";
import { SearchCache, FrontendCache } from "../utils/cache";

interface SearchResultContextType {
  spotifyTracks: any[];
  soundcloudTracks: any[];
  isLoadingSpotify: boolean;
  isLoadingSoundcloud: boolean;
  spotifyHasMore: boolean;
  soundcloudHasMore: boolean;
  limit: number;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  setSpotifyHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setSoundcloudHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setSpotifyOffset: React.Dispatch<React.SetStateAction<number>>;
  setSoundcloudOffset: React.Dispatch<React.SetStateAction<number>>;
  setTrackResults: (results: any[], provider: string) => void;
  toggleFavorite: (trackId: string, provider: string) => void;
  getTrack: (trackId: string, provider: string) => Track | null;
  loadMoreTracks: (provider: string) => void;
  clearCache: () => void;
  getCacheStats: () => { memory: number; local: number };
}

interface ContextProvider {
  children: React.ReactNode;
}

const SearchResultContext = createContext<SearchResultContextType | undefined>(undefined);

export const useSearchResult = () => {
  const context = useContext(SearchResultContext);
  if (!context) {
    throw new Error("useSearchResult must be used within SearchResultProvider");
  }
  return context;
};

export const SearchResultProvider = ({ children }: ContextProvider) => {
  const [spotifyTracks, setSpotifyTracks] = useState<any[]>([]);
  const [soundcloudTracks, setSoundcloudTracks] = useState<any[]>([]);
  const [isLoadingSpotify, setIsLoadingSpotify] = useState<boolean>(false);
  const [isLoadingSoundcloud, setIsLoadingSoundcloud] = useState<boolean>(false);
  const [spotifyHasMore, setSpotifyHasMore] = useState<boolean>(false);
  const [soundcloudHasMore, setSoundcloudHasMore] = useState<boolean>(false);
  const [spotifyOffset, setSpotifyOffset] = useState<number>(0);
  const [soundcloudOffset, setSoundcloudOffset] = useState<number>(0);
  const [searchString, setSearchString] = useState<string>("");
  const limit: number = 20;
  // This function is replaced by setTrackResultsWithCache but kept for compatibility
  // const setTrackResults = (results: any[], provider: string) => {
  //   if (provider === "spotify") {
  //     setSpotifyTracks(results);
  //   } else if (provider === "soundcloud") {
  //     setSoundcloudTracks(results);
  //   } else {
  //     console.error("Unknown Provider");
  //   }
  // };

  // Updates track to be favorited in tracks object
  const toggleFavorite = (trackId: string, provider: string) => {
    const toggle = (track: any) => (track.id === trackId ? { ...track, isFavorited: !track.isFavorited } : track);
    if (provider === "spotify") {
      setSpotifyTracks((prevTracks) => prevTracks.map(toggle));
    } else if (provider === "soundcloud") {
      setSoundcloudTracks((prevTracks) => prevTracks.map(toggle));
    } else {
      console.error("Unknown provider");
    }
  };

  const getTrack = (trackId: string, provider: string): Track | null => {
    if (provider === "spotify") {
      return spotifyTracks.find((track) => track.id === trackId || null);
    } else if (provider === "soundcloud") {
      return soundcloudTracks.find((track) => track.id === trackId) || null;
    } else {
      console.error("Unknown Provider");
      return null;
    }
  };

  const loadMoreTracks = useCallback(async (provider: string) => {
    if (provider === "spotify") {
      if (isLoadingSpotify || !spotifyHasMore) return;
      
      // Check cache first for the next batch
      const cachedResults = SearchCache.get(searchString, provider, limit, spotifyOffset);
      if (cachedResults) {
        setSpotifyOffset((prev) => prev + limit);
        setSpotifyTracks((prev) => [...prev, ...cachedResults]);
        // Assume hasMore is true if we got a full batch from cache
        setSpotifyHasMore(cachedResults.length === limit);
        return;
      }

      setIsLoadingSpotify(true);
      try {
        let data = await searchQuery(searchString, provider, limit, spotifyOffset);
        
        // Cache the results
        SearchCache.set(searchString, provider, limit, spotifyOffset, data.queryData);
        
        setSpotifyHasMore(data.hasMore);
        setSpotifyOffset((prev) => prev + limit);
        setSpotifyTracks((prev) => [...prev, ...data.queryData]);
      } catch (error) {
        console.error('Error loading more Spotify tracks:', error);
      } finally {
        setIsLoadingSpotify(false);
      }
    } else if (provider === "soundcloud") {
      if (isLoadingSoundcloud || !soundcloudHasMore) return;
      
      // Check cache first for the next batch
      const cachedResults = SearchCache.get(searchString, provider, limit, soundcloudOffset);
      if (cachedResults) {
        setSoundcloudOffset((prev) => prev + limit);
        setSoundcloudTracks((prev) => [...prev, ...cachedResults]);
        // Assume hasMore is true if we got a full batch from cache
        setSoundcloudHasMore(cachedResults.length === limit);
        return;
      }

      setIsLoadingSoundcloud(true);
      try {
        let data = await searchQuery(searchString, provider, limit, soundcloudOffset);
        
        // Cache the results
        SearchCache.set(searchString, provider, limit, soundcloudOffset, data.queryData);
        
        setSoundcloudHasMore(data.hasMore);
        setSoundcloudOffset((prev) => prev + limit);
        setSoundcloudTracks((prev) => [...prev, ...data.queryData]);
      } catch (error) {
        console.error('Error loading more SoundCloud tracks:', error);
      } finally {
        setIsLoadingSoundcloud(false);
      }
    } else {
      console.error("Unknown Provider");
    }
  }, [searchString, limit, spotifyOffset, soundcloudOffset, isLoadingSpotify, isLoadingSoundcloud, spotifyHasMore, soundcloudHasMore]);

  // Cache management functions
  const clearCache = useCallback(() => {
    SearchCache.clear();
  }, []);

  const getCacheStats = useCallback(() => {
    return FrontendCache.getStats();
  }, []);

  // Enhanced setTrackResults to use caching
  const setTrackResultsWithCache = useCallback((results: any[], provider: string) => {
    if (provider === "spotify") {
      setSpotifyTracks(results);
      // Cache the initial search results (offset 0)
      if (searchString) {
        SearchCache.set(searchString, provider, limit, 0, results);
      }
    } else if (provider === "soundcloud") {
      setSoundcloudTracks(results);
      // Cache the initial search results (offset 0)
      if (searchString) {
        SearchCache.set(searchString, provider, limit, 0, results);
      }
    } else {
      console.error("Unknown Provider");
    }
  }, [searchString, limit]);

  const contextValue = useMemo(
    () => ({
      spotifyTracks,
      soundcloudTracks,
      isLoadingSoundcloud,
      isLoadingSpotify,
      spotifyHasMore,
      soundcloudHasMore,
      setSearchString,
      setSpotifyHasMore,
      setSoundcloudHasMore,
      setSoundcloudOffset,
      setSpotifyOffset,
      limit,
      setTrackResults: setTrackResultsWithCache,
      toggleFavorite,
      getTrack,
      loadMoreTracks,
      clearCache,
      getCacheStats,
    }),
    [
      spotifyTracks, 
      soundcloudTracks, 
      isLoadingSoundcloud, 
      isLoadingSpotify, 
      spotifyHasMore, 
      soundcloudHasMore,
      setTrackResultsWithCache,
      loadMoreTracks,
      clearCache,
      getCacheStats
    ]
  );

  return <SearchResultContext.Provider value={contextValue} children={children}></SearchResultContext.Provider>;
};
