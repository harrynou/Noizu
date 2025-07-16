import {createContext, useContext, useState, useEffect} from "react";
import {getFavoriteTracks, unfavoriteTrack} from "../services/api";
import {favoriteTrack} from "../services/api";
import { useSnackbar } from "./snackbarContext";

interface FavoriteContextType {
  spotifyFavoriteTracks: Track[];
  soundcloudFavoriteTracks: Track[];
  addFavorite: (track: Track) => void;
  removeFavorite: (trackId: string, provider: string) => void;
  isFavorited: (trackId: string, provider: string) => boolean;
}

interface ContextProp {
  children: React.ReactNode;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return context;
};

export const FavoriteProvider = ({children}: ContextProp) => {
  const [spotifyFavoriteTracks, setSpotifyFavoriteTracks] = useState<Track[]>([]);
  const [soundcloudFavoriteTracks, setSoundcloudFavoriteTracks] = useState<Track[]>([]);
  const { showSuccess, showError } = useSnackbar();

  useEffect(() => {
    const tracks = async () => {
      const tracks = await getFavoriteTracks();
      setSpotifyFavoriteTracks(tracks.spotifyFavoriteTracks);
      setSoundcloudFavoriteTracks(tracks.soundcloudFavoriteTracks);
    };
    tracks();
  }, []);

  const addFavorite = async (track: Track) => {
    try {
      await favoriteTrack(track.id, track.provider);
      if (track.provider === "spotify") {
        setSpotifyFavoriteTracks((prevTracks) => [...prevTracks, track]);
      } else if (track.provider === "soundcloud") {
        setSoundcloudFavoriteTracks((prevTracks) => [...prevTracks, track]);
      } else {
        console.error("Unknown Provider");
        showError("Unknown provider");
        return;
      }
      showSuccess(`Added "${track.title}" to favorites`);
    } catch (error: any) {
      console.error(error);
      showError(error?.message || 'Failed to add track to favorites');
    }
  };

  const removeFavorite = async (trackId: string, provider: string) => {
    try {
      let trackTitle = "";
      if (provider === "spotify") {
        const track = spotifyFavoriteTracks.find(t => t.id === trackId);
        trackTitle = track?.title || "Track";
        setSpotifyFavoriteTracks((prevTrack) => prevTrack.filter((track) => track.id !== trackId));
      } else if (provider === "soundcloud") {
        const track = soundcloudFavoriteTracks.find(t => t.id === trackId);
        trackTitle = track?.title || "Track";
        setSoundcloudFavoriteTracks((prevTrack) =>
          prevTrack.filter((track) => track.id !== trackId)
        );
      } else {
        console.error("Unknown Provider");
        showError("Unknown provider");
        return;
      }
      await unfavoriteTrack(trackId, provider);
      showSuccess(`Removed "${trackTitle}" from favorites`);
    } catch (error: any) {
      console.error(error);
      showError(error?.message || 'Failed to remove track from favorites');
    }
  };

  const isFavorited = (trackId: string, provider: string) => {
    if (provider === "spotify") {
      return spotifyFavoriteTracks.some((track) => track.id === trackId);
    } else if (provider === "soundcloud") {
      return soundcloudFavoriteTracks.some((track) => track.id === trackId);
    } else {
      console.error("Unknown Provider");
      return false;
    }
  };

  const contextValue = {
    spotifyFavoriteTracks,
    soundcloudFavoriteTracks,
    addFavorite,
    removeFavorite,
    isFavorited,
  };
  return (
    <FavoriteContext.Provider value={contextValue} children={children}></FavoriteContext.Provider>
  );
};
