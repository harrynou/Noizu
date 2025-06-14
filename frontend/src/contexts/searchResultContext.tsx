import { useContext, createContext, useState, useMemo } from "react";
import { searchQuery } from "../services/api";

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
  const setTrackResults = (results: any[], provider: string) => {
    if (provider === "spotify") {
      setSpotifyTracks(results);
    } else if (provider === "soundcloud") {
      setSoundcloudTracks(results);
    } else {
      console.error("Unknown Provider");
    }
  };

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

  const loadMoreTracks = async (provider: string) => {
    if (provider === "spotify") {
      if (isLoadingSpotify || !spotifyHasMore) return;
      setIsLoadingSpotify(true);
      let data = await searchQuery(searchString, provider, limit, spotifyOffset);
      setSpotifyHasMore(data.hasMore);
      setSpotifyOffset((prev) => prev + limit);
      setIsLoadingSpotify(false);
      setSpotifyTracks((prev) => [...prev, ...data.queryData]);
    } else if (provider === "soundcloud") {
      if (isLoadingSoundcloud || !soundcloudHasMore) return;
      setIsLoadingSoundcloud(true);
      let data = await searchQuery(searchString, provider, limit, soundcloudOffset);
      setSoundcloudHasMore(data.hasMore);
      setSoundcloudOffset((prev) => prev + limit);
      setIsLoadingSoundcloud(false);
      setSoundcloudTracks((prev) => [...prev, ...data.queryData]);
    } else {
      console.error("Unknown Provider");
    }
  };

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
      setTrackResults,
      toggleFavorite,
      getTrack,
      loadMoreTracks,
    }),
    [spotifyTracks, soundcloudTracks]
  );

  return <SearchResultContext.Provider value={contextValue} children={children}></SearchResultContext.Provider>;
};
