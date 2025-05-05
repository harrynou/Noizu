import { PlaybackDevicesProvider } from './playbackDevicesContext';
import { PlaybackSettingsProvider, usePlaybackSettings } from './playbackSettingsContext';
import { QueueProvider, useQueue } from './queueContext';
import { PlayerStateProvider, usePlayerState } from './playerStateContext';

// This is a wrapper hook that provides access to all music player contexts
export const useMusicPlayer = () => {
  const queue = useQueue();
  const playerState = usePlayerState();
  const playbackSettings = usePlaybackSettings();
  
  // Combine the contexts into a unified API
  return {
    // From QueueContext
    queue: queue.queue,
    currentTrackIndex: queue.currentTrackIndex,
    showQueueManager: queue.showQueueManager,
    addToQueue: queue.addToQueue,
    removeFromQueue: queue.removeFromQueue,
    clearQueue: queue.clearQueue,
    reorderQueue: queue.reorderQueue,
    selectTrackToPlay: queue.selectTrackToPlay,
    toggleQueueManager: queue.toggleQueueManager,
    
    // From PlayerStateContext
    isPlaying: playerState.isPlaying,
    currentPosition: playerState.currentPosition,
    currentProvider: playerState.currentProvider,
    playTrack: playerState.playTrack,
    togglePlayPause: playerState.togglePlayPause,
    seek: playerState.seek,
    playNextTrack: playerState.playNextTrack,
    playPreviousTrack: playerState.playPreviousTrack,
    
    // From PlaybackSettingsContext
    currentVolume: playbackSettings.currentVolume,
    setNewVolume: playbackSettings.setNewVolume,
    
    // Computed properties
    currentTrack: queue.currentTrackIndex !== null ? queue.queue[queue.currentTrackIndex] : null,
  };
};

interface ProviderProps {
  children: React.ReactNode;
}

// Main provider that composes all the context providers
export const MusicPlayerProvider = ({ children }: ProviderProps) => {
  return (
    <PlaybackDevicesProvider>
      <PlaybackSettingsProvider>
        <QueueProvider>
          <PlayerStateProvider>
            {children}
          </PlayerStateProvider>
        </QueueProvider>
      </PlaybackSettingsProvider>
    </PlaybackDevicesProvider>
  );
};