import { createContext, useContext, useState, useEffect } from 'react';

interface QueueContextProps {
  queue: Track[];
  currentTrackIndex: number | null;
  showQueueManager: boolean;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  selectTrackToPlay: (trackIndex: number) => void;
  setCurrentTrackIndex: (index: number | null) => void;
  toggleQueueManager: () => void;
}

const QueueContext = createContext<QueueContextProps | undefined>(undefined);

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};

interface ProviderProps {
  children: React.ReactNode;
}

export const QueueProvider = ({ children }: ProviderProps) => {
  const [queue, setQueue] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [showQueueManager, setShowQueueManager] = useState<boolean>(false);
  const [loadingSessionState, setLoadingSessionState] = useState<boolean>(true);

  // Load previous states from session storage
  useEffect(() => {
    const savedState = sessionStorage.getItem("musicPlayerState");
    if (savedState) {
      try {
        const { queue, currentTrackIndex, showQueueManager } = JSON.parse(savedState);
        setQueue(queue || []);
        setCurrentTrackIndex(currentTrackIndex ?? null);
        setShowQueueManager(showQueueManager || false);
      } catch (error) {
        console.error("Error parsing music player state:", error);
      }
    }
    setLoadingSessionState(false);
  }, []);

  // Saves track state upon changes
  useEffect(() => {
    if (!loadingSessionState) {
      sessionStorage.setItem("musicPlayerState", JSON.stringify({
        queue,
        currentTrackIndex,
        showQueueManager
      }));
    }
  }, [queue, currentTrackIndex, showQueueManager, loadingSessionState]);

  const addToQueue = (track: Track) => {
    setQueue((prevQueue) => {
      const updatedQueue = [...prevQueue, track];
      // Start playback if no track is currently playing
      if (currentTrackIndex === null) {
        setCurrentTrackIndex(0);
      }
      return updatedQueue;
    });
  };

  const removeFromQueue = (trackId: string) => {
    setQueue((prevQueue) => {
      const updatedQueue = prevQueue.filter((track) => track.id !== trackId);
  
      // Handle the case where the removed track is currently playing
      if (currentTrackIndex !== null && queue[currentTrackIndex]?.id === trackId) {
        setCurrentTrackIndex((prevIndex) => {
          if (prevIndex === null) return null;
  
          // If the removed track was the only song in queue, reset to null
          if (updatedQueue.length === 0) return null;
  
          // If there's a next track, keep the index the same (next track will slide into position)
          return prevIndex >= updatedQueue.length ? 0 : prevIndex;
        });
      } else if (currentTrackIndex !== null) {
        // Adjust currentTrackIndex if a track before the current one is removed
        const removedIndex = prevQueue.findIndex(track => track.id === trackId);
        if (removedIndex !== -1 && removedIndex < currentTrackIndex) {
          setCurrentTrackIndex(currentTrackIndex - 1);
        }
      }
      
      return updatedQueue;
    });
  };
  
  const clearQueue = () => {
    setQueue([]);
    setCurrentTrackIndex(null);
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue((prevQueue) => {
      const updatedQueue = [...prevQueue];
      const [movedTrack] = updatedQueue.splice(startIndex, 1);
      updatedQueue.splice(endIndex, 0, movedTrack);
      
      // Adjust currentTrackIndex if the current track was moved
      if (currentTrackIndex === startIndex) {
        setCurrentTrackIndex(endIndex);
      } 
      // Adjust currentTrackIndex if tracks were moved around it
      else if (currentTrackIndex !== null) {
        if (startIndex < currentTrackIndex && endIndex >= currentTrackIndex) {
          setCurrentTrackIndex(currentTrackIndex - 1);
        } else if (startIndex > currentTrackIndex && endIndex <= currentTrackIndex) {
          setCurrentTrackIndex(currentTrackIndex + 1);
        }
      }
      
      return updatedQueue;
    });
  };

  const selectTrackToPlay = (trackIndex: number) => {
    if (trackIndex >= 0 && trackIndex < queue.length) {
      setCurrentTrackIndex(trackIndex);
    }
  };

  const toggleQueueManager = () => {
    setShowQueueManager(!showQueueManager);
  };

  return (
    <QueueContext.Provider
      value={{
        queue,
        currentTrackIndex,
        showQueueManager,
        addToQueue,
        removeFromQueue,
        clearQueue,
        reorderQueue,
        selectTrackToPlay,
        setCurrentTrackIndex,
        toggleQueueManager,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};