import React, { useEffect, useCallback, useState } from 'react';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';
import pauseButton from '../../assets/pause-button.svg';
import playButton from '../../assets/play-button.svg';
import previousButton from '../../assets/previous-button.svg'; 
import nextButton from '../../assets/next-button.svg';
import queueSvg from '../../assets/queue-icon.svg';
import ProgressBar from './ProgressBar';
import VolumeMixer from './VolumeMixer';

const PlaybackControls = () => {
    const { 
        currentTrack, 
        isPlaying, 
        togglePlayPause, 
        playNextTrack, 
        playPreviousTrack,
        queue,
        toggleQueueManager,
        // showQueueManager
    } = useMusicPlayer();
    
    const [isPlaybackExpanded, setIsPlaybackExpanded] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const duration = currentTrack ? currentTrack.duration : null;
    useEffect(() => {
        const savedState = sessionStorage.getItem("playbackState");
        if (savedState) {
            try {
                const { isPlaybackExpanded } = JSON.parse(savedState);
                setIsPlaybackExpanded(isPlaybackExpanded);
            } catch (error) {
                console.error("Error parsing playback state: ", error);
            }
        }  
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isLoading){
            sessionStorage.setItem('playbackState', JSON.stringify({
                isPlaybackExpanded
            }));
        }
    }, [isPlaybackExpanded, isLoading]);

    const togglePlaybackExpand = () => {
        setIsPlaybackExpanded(prevState => !prevState);
    };
    
    // Handle keyboard shortcuts for playback controls
    const handleKeyboardControls = useCallback((event: KeyboardEvent) => {
        // Only process shortcuts if not in an input element
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        
        switch (event.code) {
            case 'Space':
                event.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowRight':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    playNextTrack();
                }
                break;
            case 'ArrowLeft':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    playPreviousTrack();
                }
                break;
            case 'KeyQ':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    toggleQueueManager();
                }
                break;
            default:
                break;
        }
    }, [togglePlayPause, playNextTrack, playPreviousTrack, toggleQueueManager]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardControls);
        return () => {
            window.removeEventListener('keydown', handleKeyboardControls);
        };
    }, [handleKeyboardControls]);

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-primary border-t border-gray-800 z-50 transition-all duration-300">
            {/* Collapse toggle button - always visible */}
            <button 
                onClick={togglePlaybackExpand}
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-textPrimary p-1 rounded-t-md border-t border-l border-r border-gray-800 hover:bg-gray-800 transition-colors"
                aria-label={isPlaybackExpanded ? "Collapse player" : "Expand player"}
                title={isPlaybackExpanded ? "Collapse player" : "Expand player"}
            >
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={`transition-transform ${isPlaybackExpanded ? '' : 'rotate-180'}`}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isPlaybackExpanded ? (
                // Full player view
                <div className="p-4 md:p-4 text-textPrimary">
                    <div className="max-w-7xl mx-auto relative flex items-center">
                        {/* Left Side Track Info */}
                        <div className="w-1/4 hidden md:block overflow-hidden">
                            {currentTrack && (
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={currentTrack.imageUrl}
                                            alt={currentTrack.title}
                                            className="w-14 h-14 object-cover rounded-md shadow-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-medium truncate">{currentTrack.title}</p>
                                        <div className="flex flex-wrap text-xs text-gray-400">
                                            {currentTrack.artistInfo.map((artist: any, index: number) => (
                                                <React.Fragment key={artist.name}>
                                                    {index > 0 && <span>, </span>}
                                                    <a
                                                        href={artist.profileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline hover:text-accentPrimary truncate"
                                                    >
                                                        {artist.name}
                                                    </a>
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Middle - Playback Controls */}
                        <div className="flex-1 flex flex-col items-center gap-2 px-4">
                            <div className="flex items-center gap-5 justify-center">
                                <button
                                    onClick={playPreviousTrack}
                                    className="w-7 hover:w-8 hover:opacity-75 transition-all duration-200 cursor-pointer"
                                    aria-label="Previous track"
                                    disabled={queue.length === 0}
                                >
                                    <img src={previousButton} alt="Previous" />
                                </button>
                                <button
                                    onClick={togglePlayPause}
                                    className="w-9 hover:w-10 hover:opacity-75 transition-all duration-200 cursor-pointer"
                                    aria-label={isPlaying ? 'Pause' : 'Play'}
                                >
                                    <img src={isPlaying ? pauseButton : playButton} alt={isPlaying ? 'Pause' : 'Play'} />
                                </button>
                                <button
                                    onClick={playNextTrack}
                                    className="w-7 hover:w-8 hover:opacity-75 transition-all duration-200 cursor-pointer"
                                    aria-label="Next track"
                                    disabled={queue.length === 0}
                                >
                                    <img src={nextButton} alt="Next" />
                                </button>
                            </div>
                
                            {/* Track Progress */}
                            <div className="w-full max-w-2xl">
                                <ProgressBar duration={duration} />
                            </div>
                        </div>
                        {/* Right Side Options */}
                        <div className="w-1/4 flex justify-end items-center gap-4">
                            <button
                                onClick={toggleQueueManager}
                                className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
                                aria-label="Toggle queue"
                                title="Toggle queue"
                            >
                                <img src={queueSvg} className="w-6 h-6" alt="Queue" />
                                {queue.length > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-accentPrimary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {queue.length}
                                    </span>
                                )}
                            </button>
                
                            <div className="w-32">
                                <VolumeMixer />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Mini player (collapsed view)
                <div className="h-12 px-4 flex items-center justify-between">
                    {/* Track info - left side */}
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <img 
                            src={currentTrack.imageUrl} 
                            alt={currentTrack.title}
                            className="w-8 h-8 object-cover rounded"
                        />
                        <div className="truncate">
                            <p className="text-sm font-medium truncate text-white">{currentTrack.title}</p>
                            <p className="text-xs text-gray-400 truncate">{currentTrack.artistInfo[0]?.name}</p>
                        </div>
                    </div>
                    
                    {/* Mini controls - right side */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={playPreviousTrack}
                            className="text-gray-300 hover:text-white"
                            aria-label="Previous track"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 20L9 12L19 4V20Z" fill="currentColor"/>
                                <rect x="5" y="4" width="2" height="16" fill="currentColor"/>
                            </svg>
                        </button>
                        
                        <button
                            onClick={togglePlayPause}
                            className="bg-accentPrimary rounded-full p-1 text-white"
                            aria-label={isPlaying ? "Pause" : "Play"}
                        >
                            {isPlaying ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                                    <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
                                </svg>
                            )}
                        </button>
                        
                        <button
                            onClick={playNextTrack}
                            className="text-gray-300 hover:text-white"
                            aria-label="Next track"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 4L15 12L5 20V4Z" fill="currentColor"/>
                                <rect x="17" y="4" width="2" height="16" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(PlaybackControls);