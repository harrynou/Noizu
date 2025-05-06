import {createContext, useContext, useState, useEffect, useRef, useCallback} from "react";
import {useAuth} from "./authContext";
import {usePlaybackDevices} from "./playbackDevicesContext";
import {setUserVolume} from "../services/api";

interface PlaybackSettingsContextProps {
  currentVolume: number;
  currentVolumeRef: React.MutableRefObject<number>; // Added to share with other contexts
  setNewVolume: (volume: number) => void;
}

const PlaybackSettingsContext = createContext<PlaybackSettingsContextProps | undefined>(undefined);

export const usePlaybackSettings = () => {
  const context = useContext(PlaybackSettingsContext);
  if (!context) {
    throw new Error("usePlaybackSettings must be used within PlaybackSettingsProvider");
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const PlaybackSettingsProvider = ({children}: ProviderProps) => {
  const {user, isAuthenticated} = useAuth();
  const {spotifyPlayerRef, soundCloudPlayerRef, isPlayerInitialized} = usePlaybackDevices();
  const [currentVolume, setCurrentVolume] = useState<number>(user?.volume ?? 0.5);
  const currentVolumeRef = useRef<number>(currentVolume);

  // Keep ref in sync with state
  useEffect(() => {
    currentVolumeRef.current = currentVolume;
  }, [currentVolume]);

  // Sets volume on page load
  useEffect(() => {
    if (user?.volume !== undefined && isPlayerInitialized) {
      // Convert from the fractional (0-1) value to percentage for SoundCloud
      setNewVolume(user.volume);
    } else if (isPlayerInitialized) {
      // If no user volume is set but players are ready, initialize with default
      setNewVolume(0.5);
    }
  }, [user, isPlayerInitialized]);

  const setNewVolume = async (volume: number) => {
    // Volume input from 0 to 1.0
    setCurrentVolume(volume);
    // Update player volumes with error handling
    if (spotifyPlayerRef.current) {
      try {
        spotifyPlayerRef.current.setVolume(volume);
        console.log("Spotify volume set to:", volume);
      } catch (error) {
        console.error("Error setting Spotify volume:", error);
      }
    }

    if (soundCloudPlayerRef.current) {
      try {
        soundCloudPlayerRef.current.setVolume(volume * 100);
        console.log("SoundCloud volume set to:", volume * 100);
      } catch (error) {
        console.error("Error setting SoundCloud volume:", error);
      }
    }

    // Save to server if authenticated
    if (isAuthenticated) {
      try {
        await setUserVolume(volume);
      } catch (error) {
        console.error("Error saving volume setting:", error);
      }
    }
  };

  return (
    <PlaybackSettingsContext.Provider
      value={{
        currentVolume,
        currentVolumeRef,
        setNewVolume,
      }}>
      {children}
    </PlaybackSettingsContext.Provider>
  );
};
