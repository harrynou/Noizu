import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { usePlaybackDevices } from './playbackDevicesContext';
import { usePlaybackSettings } from './playbackSettingsContext';
import { useQueue } from './queueContext';
import { useAuth } from './authContext';
import { startSpotifyPlayback } from '../services/api';

interface PlayerStateContextProps {
  isPlaying: boolean;
  currentPosition: number;
  currentProvider: string | null;
  loadingTrack: boolean;
  isSeeking: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  seek: (position: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
}

const PlayerStateContext = createContext<PlayerStateContextProps | undefined>(undefined);

export const usePlayerState = () => {
  const context = useContext(PlayerStateContext);
  if (!context) {
    throw new Error('usePlayerState must be used within PlayerStateProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const PlayerStateProvider = ({ children }: ProviderProps) => {
  const { spotifyPlayerRef, soundCloudPlayerRef, deviceId, isPlayerInitialized } = usePlaybackDevices();
  const { currentVolumeRef } = usePlaybackSettings();
  const { queue, currentTrackIndex, setCurrentTrackIndex } = useQueue();
  const { getSpotifyToken } = useAuth();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [currentProvider, setCurrentProvider] = useState<string | null>(null);
  const currentProviderRef = useRef<string | null>(null);
  const [loadingTrack, setLoadingTrack] = useState<boolean>(false);
  const isTrackLoadingRef = useRef<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const isSeekingRef = useRef<boolean>(false);

  // Keep refs in sync with state
  useEffect(() => {
    currentProviderRef.current = currentProvider;
    isSeekingRef.current = isSeeking;
    isPlayingRef.current = isPlaying;
  }, [currentProvider, isSeeking, isPlaying]);

  // Used to signal the changing of tracks
  useEffect(() => {
    if (loadingTrack) {
      playNextTrack();
      isTrackLoadingRef.current = false;
      setLoadingTrack(false);
    }
  }, [loadingTrack]);

  // Initialize provider based on current track
  useEffect(() => {
    if (currentTrackIndex !== null && queue.length > 0) {
      setCurrentProvider(queue[currentTrackIndex].provider);
    }
  }, [currentTrackIndex, queue]);

  // On load of a page or when currentTrackIndex changes
  useEffect(() => {
    if (!isPlayerInitialized || currentTrackIndex === null || !currentProvider || !deviceId) return;
    
    // Pause any current playback first
    togglePause();
    
    // Then start playing the current track
    playCurrentTrack(currentTrackIndex);
  }, [currentTrackIndex, isPlayerInitialized, deviceId, currentProvider]);
  
  // Used to update spotify's track position
  useEffect(() => {
    if (!isPlaying || currentTrackIndex === null) return;

    let animationFrameId: number;
    const updatePosition = async () => {
      if (!spotifyPlayerRef.current || currentProviderRef.current !== 'spotify') {
        cancelAnimationFrame(animationFrameId); // Stop the loop if it's not Spotify
        return;
      }
      const state = await spotifyPlayerRef.current.getCurrentState();
      if (state && !isSeekingRef.current) {
        setCurrentPosition(state.position);
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    
    animationFrameId = requestAnimationFrame(updatePosition);
    
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, currentTrackIndex, currentProvider]);

  // Set up Spotify player state change listeners
  useEffect(() => {
    if (!spotifyPlayerRef.current) return;
    
    const handlePlayerStateChanged = (state: Spotify.PlaybackState | null) => {
      if (!state) return;
      
      setIsPlaying(!state.paused);
      setCurrentPosition(state.position);

      // Track end detection - when position resets to 0 and there are previous tracks
      if (state.position === 0 && state.track_window.previous_tracks.length > 0) {
        if (!isTrackLoadingRef.current) {
          isTrackLoadingRef.current = true;
          setLoadingTrack(true);
        }
      }
    };
    
    spotifyPlayerRef.current.addListener('player_state_changed', handlePlayerStateChanged);
    
    return () => {
      if (spotifyPlayerRef.current) {
        spotifyPlayerRef.current.removeListener('player_state_changed', handlePlayerStateChanged);
      }
    };
  }, [spotifyPlayerRef]);

  // Set up SoundCloud player event listeners
  useEffect(() => {
    if (!soundCloudPlayerRef.current) return;
    
    const scPlayer = soundCloudPlayerRef.current;
    
    const handlePlay = () => {
      console.log('SoundCloud track started playing');
      // Use the volume from settings
      if (currentVolumeRef.current) {
        scPlayer.setVolume(currentVolumeRef.current * 100);
      } else {
        scPlayer.setVolume(50); // Default to 50%
      }
      isPlayingRef.current = true;
      setIsPlaying(true);
      if (isSeekingRef.current) seek(currentPosition);
    };
    
    const handlePause = () => {
      console.log("Soundcloud Track Paused!");
      isPlayingRef.current = false;
      setIsPlaying(false);
    };
    
    const handleFinish = () => {
      console.log("SoundCloud track finished");
      playNextTrack();
    };
    
    const handlePlayProgress = (progress: any) => {
      if (!isPlayingRef.current) return;
      setCurrentPosition(progress.currentPosition);
      scPlayer.isPaused((isPaused: boolean) => {
        setIsPlaying(!isPaused);
      });
    };
    
    // Bind all event handlers
    scPlayer.bind('play', handlePlay);
    scPlayer.bind('pause', handlePause);
    scPlayer.bind('finish', handleFinish);
    scPlayer.bind('playProgress', handlePlayProgress);
    
    return () => {
      // Clean up listeners when the component unmounts
      scPlayer.unbind('play');
      scPlayer.unbind('pause');
      scPlayer.unbind('finish');
      scPlayer.unbind('playProgress');
    };
  }, [soundCloudPlayerRef, currentPosition]);

  const playTrack = useCallback((track: Track) => {
    // Find if track already exists in queue
    const existingIndex = queue.findIndex(t => t.id === track.id && t.provider === track.provider);
    
    if (existingIndex >= 0) {
      // Track exists, just play it
      setCurrentTrackIndex(existingIndex);
    } else {
      // Add to beginning of queue and play
      setCurrentTrackIndex(0);
      useQueue().addToQueue(track);
    }
  }, [queue, setCurrentTrackIndex]);

  const playCurrentTrack = async (index: number | null = currentTrackIndex) => {
    if (index === null || index < 0 || index >= queue.length) {
      console.warn('Invalid current track index');
      return;
    }
    
    const currentTrack = queue[index];
    
    if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
      setCurrentProvider('spotify');
      await spotifyPlayerRef.current.activateElement();
      const token = await getSpotifyToken();
      let options = {
        token, 
        device_id: deviceId, 
        uris: [currentTrack.uri], 
        position: currentPosition
      };
      await startSpotifyPlayback(options);
    } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
      setCurrentProvider('soundcloud');
      soundCloudPlayerRef.current.load(currentTrack.uri, {auto_play: true});
      if (currentPosition !== 0) {
        setTimeout(() => {
          seek(currentPosition); 
        }, 1000);
      }
    }
  };

  const playNextTrack = () => {
    if (currentTrackIndex !== null && currentTrackIndex < queue.length - 1) {
      setCurrentPosition(0);
      togglePause();
      setCurrentTrackIndex(currentTrackIndex + 1);
    } else {
      console.log("No more tracks in the queue.");
    }
  };

  const playPreviousTrack = () => {
    if (currentTrackIndex === null) return;
    
    if (currentTrackIndex > 0) {
      setCurrentPosition(0);
      togglePause();
      setCurrentTrackIndex(currentTrackIndex - 1);
    } else {
      seek(0); // If it's the first track, just restart it
    }
  };

  // Pauses all players
  const togglePause = useCallback(() => {
    if (spotifyPlayerRef.current) spotifyPlayerRef.current.pause();
    if (soundCloudPlayerRef.current) soundCloudPlayerRef.current.pause();
  }, [spotifyPlayerRef, soundCloudPlayerRef]);

  // Toggles play pause on current song
  const togglePlayPause = useCallback(() => {
    if (currentTrackIndex === null || queue.length === 0) return;
    
    const currentTrack = queue[currentTrackIndex];
    
    if (currentTrack.provider === 'spotify' && spotifyPlayerRef.current) {
      isPlaying ? spotifyPlayerRef.current.pause() : spotifyPlayerRef.current.resume();
    } else if (currentTrack.provider === 'soundcloud' && soundCloudPlayerRef.current) {
      isPlaying ? soundCloudPlayerRef.current.pause() : soundCloudPlayerRef.current.play();
    }
  }, [isPlaying, currentTrackIndex, queue, spotifyPlayerRef, soundCloudPlayerRef]);

  const seek = (position: number) => {
    setIsSeeking(true);
    isSeekingRef.current = true;
    
    if (currentProvider === 'spotify' && spotifyPlayerRef.current) {
      spotifyPlayerRef.current.seek(position);
    } else if (currentProvider === 'soundcloud' && soundCloudPlayerRef.current) {
      setCurrentPosition(position);
      soundCloudPlayerRef.current.seekTo(position);
    }
    
    setIsSeeking(false);
    isSeekingRef.current = false;
  };

  return (
    <PlayerStateContext.Provider
      value={{
        isPlaying,
        currentPosition,
        currentProvider,
        loadingTrack,
        isSeeking,
        playTrack,
        togglePlayPause,
        seek,
        playNextTrack,
        playPreviousTrack,
      }}
    >
      {children}
    </PlayerStateContext.Provider>
  );
};