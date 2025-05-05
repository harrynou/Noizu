import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './authContext';
import { usePlaybackDevices } from './playbackDevicesContext';
import { setUserVolume } from '../services/api';

interface PlaybackSettingsContextProps {
  currentVolume: number;
  currentVolumeRef: React.MutableRefObject<number>; // Added to share with other contexts
  setNewVolume: (volume: number) => void;
}

const PlaybackSettingsContext = createContext<PlaybackSettingsContextProps | undefined>(undefined);

export const usePlaybackSettings = () => {
  const context = useContext(PlaybackSettingsContext);
  if (!context) {
    throw new Error('usePlaybackSettings must be used within PlaybackSettingsProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const PlaybackSettingsProvider = ({ children }: ProviderProps) => {
  const { user, isAuthenticated } = useAuth();
  const { spotifyPlayerRef, soundCloudPlayerRef, isPlayerInitialized } = usePlaybackDevices();
  const [currentVolume, setCurrentVolume] = useState<number>(user?.volume ?? 0.5);
  const currentVolumeRef = useRef<number>(currentVolume);

  // Keep ref in sync with state
  useEffect(() => {
    currentVolumeRef.current = currentVolume;
  }, [currentVolume]);

  // Sets volume on page load
  useEffect(() => {
    if (user?.volume && isPlayerInitialized) {
      setNewVolume(user.volume);
    }
  }, [user, isPlayerInitialized]);

  const setNewVolume = useCallback(async (volume: number) => { // Volume input from 0 to 1.0
    setCurrentVolume(volume);
    
    // Update player volumes
    if (spotifyPlayerRef.current) {
      spotifyPlayerRef.current.setVolume(volume);
    }
    
    if (soundCloudPlayerRef.current) {
      soundCloudPlayerRef.current.setVolume(volume * 100);
    }
    
    // Save to server if authenticated
    if (isAuthenticated) {
      try {
        await setUserVolume(volume);
      } catch (error) {
        console.error('Error saving volume setting:', error);
      }
    }
  }, [spotifyPlayerRef, soundCloudPlayerRef, isAuthenticated]);

  return (
    <PlaybackSettingsContext.Provider
      value={{
        currentVolume,
        currentVolumeRef, // Expose the ref for other contexts to use
        setNewVolume,
      }}
    >
      {children}
    </PlaybackSettingsContext.Provider>
  );
};