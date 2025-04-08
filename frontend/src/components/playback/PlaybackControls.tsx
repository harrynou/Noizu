import React, { useEffect, useCallback, useState } from 'react';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';
import pauseButton from '../../assets/pause-button.svg';
import playButton from '../../assets/play-button.svg';
import previousButton from '../../assets/previous-button.svg'; 
import nextButton from '../../assets/next-button.svg';
import queueSvg from '../../assets/queue-icon.svg';
import ProgressBar from './ProgressBar';
import VolumeMixer from './VolumeMixer';

const PlaybackControls: React.FC = () => {
    const { 
        currentTrack, 
        isPlaying, 
        togglePlayPause, 
        playNextTrack, 
        playPreviousTrack,
        queue
    } = useMusicPlayer();
    
    const [showQueue, setShowQueue] = useState(false);
    const duration = currentTrack ? currentTrack.duration : null;
    
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
                    setShowQueue(prev => !prev);
                }
                break;
            default:
                break;
        }
    }, [togglePlayPause, playNextTrack, playPreviousTrack]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardControls);
        return () => {
            window.removeEventListener('keydown', handleKeyboardControls);
        };
    }, [handleKeyboardControls]);

    const toggleQueueVisibility = () => {
        setShowQueue(prev => !prev);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 w-full bg-primary p-4 md:p-4 text-textPrimary border-t border-gray-800 z-50">
            <div className="max-w-7xl mx-auto relative flex items-center">
                {/* Left Side Track Info */}
                <div className="w-1/4 hidden md:block overflow-hidden">
                    {currentTrack ? (
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
                                    {currentTrack.artists.map((artist: any, index: number) => (
                                        <React.Fragment key={artist.name}>
                                            {index > 0 && <span>, </span>}
                                            <a 
                                                href={artist.profileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="hover:underline hover:text-accent truncate"
                                            >
                                                {artist.name}
                                            </a>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500">No track selected</div>
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
                            disabled={!currentTrack}
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
                        onClick={toggleQueueVisibility}
                        className="relative p-2 rounded-full hover:bg-gray-800 transition-colors"
                        aria-label="Toggle queue"
                        title="Toggle queue"
                    >
                        <img src={queueSvg} className="w-6 h-6" alt="Queue" />
                        {queue.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {queue.length}
                            </span>
                        )}
                    </button>
                    
                    <div className="w-32">
                        <VolumeMixer />
                    </div>
                </div>
            </div>
            
            {/* Queue panel (conditionally rendered) */}
            {showQueue && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 w-80 max-h-96 overflow-y-auto rounded-lg shadow-lg border border-gray-800">
                    <div className="flex justify-between items-center p-3 border-b border-gray-800">
                        <h3 className="font-medium">Queue ({queue.length})</h3>
                        <button 
                            onClick={toggleQueueVisibility}
                            className="text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    {queue.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                            Your queue is empty
                        </div>
                    ) : (
                        <ul className="py-2">
                            {queue.map((track, index) => (
                                <li 
                                    key={`${track.id}-${index}`} 
                                    className={`flex items-center p-2 hover:bg-gray-800 ${
                                        currentTrack?.id === track.id ? 'bg-gray-800' : ''
                                    }`}
                                >
                                    <img 
                                        src={track.imageUrl} 
                                        alt={track.title} 
                                        className="w-10 h-10 object-cover rounded mr-3" 
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{track.title}</p>
                                        <p className="text-xs text-gray-400 truncate">
                                            {track.artists[0]?.name}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default React.memo(PlaybackControls);
