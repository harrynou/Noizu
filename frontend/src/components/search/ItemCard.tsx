import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from 'react';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';
import { useFavoriteContext } from '../../contexts/favoriteContext';
import { useAuth } from '../../contexts/authContext';
import formatDuration from '../../utils/formatDuration';
import { smartFormatDate } from '../../utils/formatTime';

import SpotifyIcon from '../../assets/spotify/Icon.svg' 
import SoundcloudIcon from '../../assets/soundcloud/Icon.svg'
import RedHeartSVG from '../../assets/heart-red.svg';
import WhiteHeartSVG from '../../assets/heart-white.svg';
import AddToQueueSVG from '../../assets/AddToQueue.svg';

type TooltipType = 'favorite' | 'queue' | 'playlist' | 'remove';

interface ItemCardProps {
    item: Track;
    provider: string;
    showAddToPlaylist?: boolean;
    onTrackSelect?: (track: Track) => void;
    isInPlaylist?: boolean;
    onRemoveFromPlaylist?: (id: string, provider: string) => void;
    showIndex?: boolean;
    index?: number;
    isCompact?: boolean;
}

const TOOLTIP_HIDE_DELAY = 100; // ms
const QUEUE_ANIMATION_DURATION = 2000; // ms

const ItemCard = memo(({
    item,
    provider,
    showAddToPlaylist = true,
    onTrackSelect,
    isInPlaylist = false,
    onRemoveFromPlaylist,
    showIndex = false,
    index,
    isCompact = false
}: ItemCardProps) => {
    const { 
        currentTrack, 
        playTrack, 
        isPlaying, 
        togglePlayPause, 
        addToQueue, 
        queue 
    } = useMusicPlayer();
    
    const { isAuthenticated } = useAuth();
    const { isFavorited, addFavorite, removeFavorite } = useFavoriteContext();
    
    const [isHovered, setIsHovered] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showTooltip, setShowTooltip] = useState<Record<TooltipType, boolean>>({
        favorite: false,
        queue: false,
        playlist: false,
        remove: false
    });
    const [isAddedToQueue, setIsAddedToQueue] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    
    const itemCardRef = useRef<HTMLDivElement>(null);
    const optionsButtonRef = useRef<HTMLButtonElement>(null);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const isCurrentTrack = useMemo(() => 
        currentTrack?.id === item.id && currentTrack?.provider === provider,
        [currentTrack, item.id, provider]
    );
    
    const isInQueue = useMemo(() => 
        queue.some(track => track.id === item.id && track.provider === provider),
        [queue, item.id, provider]
    );
    
    const trackFavorited = useMemo(() => 
        isFavorited(item.id, provider),
        [isFavorited, item.id, provider]
    );

    const formattedDuration = useMemo(() => 
        formatDuration(item.duration),
        [item.duration]
    );
    
    const formattedAddedDate = useMemo(() => 
        item.favoritedAt ? smartFormatDate(item.favoritedAt) : null,
        [item.favoritedAt]
    );
    
    const trackData = useMemo(() => ({
        id: item.id,
        title: item.title,
        artistInfo: item.artistInfo,
        imageUrl: item.imageUrl,
        provider,
        uri: item.uri, 
        duration: item.duration,
        isFavorited: trackFavorited,
        favoritedAt: item.favoritedAt
    }), [item, provider, trackFavorited]);

    const getProviderDetails = useMemo(() => {
        return {
            icon: provider === 'spotify' ? SpotifyIcon : SoundcloudIcon,
            hoverBg: provider === 'spotify' ? 'bg-green-600' : 'bg-orange-600',
            textColor: isCurrentTrack ? 
                (provider === 'spotify' ? 'text-green-500' : 'text-orange-500') : 
                'text-white'
        };
    }, [provider, isCurrentTrack]);

    // Clear any pending tooltips on unmount
    useEffect(() => {
        return () => {
            if (tooltipTimeoutRef.current) {
                clearTimeout(tooltipTimeoutRef.current);
            }
        };
    }, []);

    // Handle outside click for options menu
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsMenuRef.current && 
                optionsButtonRef.current && 
                !optionsMenuRef.current.contains(event.target as Node) && 
                !optionsButtonRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        };

        // Only add listener when options menu is open
        if (showOptions) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showOptions]);

    // Event handlers with proper typing
    const handlePlayClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(trackData);
        }
        
        if (onTrackSelect) {
            onTrackSelect(trackData);
        }
    }, [isCurrentTrack, togglePlayPause, playTrack, trackData, onTrackSelect]);

    const handleAddToQueue = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        
        if (isInQueue) return;
        
        addToQueue(trackData);
        setIsAddedToQueue(true);
        
        // Reset after animation duration
        setTimeout(() => {
            setIsAddedToQueue(false);
        }, QUEUE_ANIMATION_DURATION);
    }, [isInQueue, addToQueue, trackData]);

    const handleFavoriteToggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        
        if (!isAuthenticated) return;
        
        if (trackFavorited) {
            removeFavorite(item.id, provider);
        } else {
            const updatedTrack = {
                ...trackData,
                favoritedAt: new Date().toISOString()
            };
            addFavorite(updatedTrack);
        }
    }, [trackFavorited, isAuthenticated, removeFavorite, addFavorite, item.id, provider, trackData]);

    const handleRemoveFromPlaylist = useCallback((e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (onRemoveFromPlaylist) {
            onRemoveFromPlaylist(item.id, provider);
        }
    }, [onRemoveFromPlaylist, item.id, provider]);

    const handleItemClick = useCallback(() => {
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(trackData);
        }
        
        if (onTrackSelect) {
            onTrackSelect(trackData);
        }
    }, [isCurrentTrack, togglePlayPause, playTrack, trackData, onTrackSelect]);

    const handleTooltipShow = useCallback((tooltipType: TooltipType, event: React.MouseEvent<HTMLElement>) => {
        // Clear any pending hide timeouts
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
            tooltipTimeoutRef.current = null;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        setTooltipPosition({ 
            x: rect.left + rect.width / 2, 
            y: rect.top 
        });
        
        setShowTooltip(prev => ({
            ...prev,
            [tooltipType]: true
        }));
    }, []);

    const handleTooltipHide = useCallback((tooltipType: TooltipType) => {
        // Add a small delay to prevent flickering
        tooltipTimeoutRef.current = setTimeout(() => {
            setShowTooltip(prev => ({
                ...prev,
                [tooltipType]: false
            }));
        }, TOOLTIP_HIDE_DELAY);
    }, []);

    // Extract components for better readability
    const renderTooltips = () => {
        return Object.entries(showTooltip).map(([type, isVisible]) => 
            isVisible && (
                <div 
                    key={type}
                    className="fixed z-50 bg-black bg-opacity-80 text-white text-xs py-1 px-2 rounded pointer-events-none transform -translate-x-1/2 -translate-y-8 whitespace-nowrap"
                    style={{
                        left: `${tooltipPosition.x}px`,
                        top: `${tooltipPosition.y}px`
                    }}
                    role="tooltip"
                >
                    {type === 'favorite' && (trackFavorited ? 'Remove from favorites' : 'Add to favorites')}
                    {type === 'queue' && (isInQueue ? 'Already in queue' : 'Add to queue')}
                    {type === 'playlist' && 'Add to playlist'}
                    {type === 'remove' && 'Remove from playlist'}
                </div>
            )
        );
    };

    const renderOptionsMenu = () => {
        if (!showOptions) return null;
        
        const menuPosition = {
            top: itemCardRef.current ? 
                itemCardRef.current.getBoundingClientRect().bottom + window.scrollY : 0
        };
        
        return (
            <div 
                ref={optionsMenuRef}
                className="absolute right-8 mt-2 z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden"
                style={menuPosition}
                role="menu"
            >
                <div className="py-1">
                    {/* Add to playlist option */}
                    {showAddToPlaylist && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                // Add to playlist functionality would go here
                                setShowOptions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                            role="menuitem"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="text-gray-400"
                                aria-hidden="true"
                            >
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add to playlist
                        </button>
                    )}
                    
                    {/* Go to artist */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Navigate to artist page functionality
                            setShowOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                        role="menuitem"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-gray-400"
                            aria-hidden="true"
                        >
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Go to artist
                    </button>
                    
                    {/* Share */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Share functionality
                            if (item.uri) {
                                navigator.clipboard.writeText(item.uri)
                                    .catch(err => console.error('Failed to copy:', err));
                            }
                            setShowOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                        role="menuitem"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="text-gray-400"
                            aria-hidden="true"
                        >
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                        Copy link
                    </button>
                    
                    {/* Open in original service */}
                    {item.uri && (
                        <a
                            href={item.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                            role="menuitem"
                        >
                            <img 
                                src={getProviderDetails.icon} 
                                alt="" 
                                className="w-4 h-4"
                                aria-hidden="true" 
                            />
                            Open in {provider === 'spotify' ? 'Spotify' : 'SoundCloud'}
                        </a>
                    )}
                </div>
            </div>
        );
    };

    // Standard layout - grid with all details
    const renderStandardLayout = () => (
        <div 
            ref={itemCardRef}
            className={`grid grid-cols-[16px_4fr_1fr_auto] gap-4 p-2 rounded-md items-center ${
                isCurrentTrack ? 'bg-gray-700/60' : 'hover:bg-gray-700/30'
            } group transition-colors duration-150 cursor-pointer`}
            onClick={handleItemClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={`${item.title} by ${item.artistInfo.map(a => a.name).join(', ')}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick();
                }
            }}
        >
            {/* Track number or play button */}
            <div className="w-4 text-right">
                {showIndex && !isHovered && !isCurrentTrack ? (
                    <span className="text-gray-400 text-sm">{index}</span>
                ) : (
                    <button
                        onClick={handlePlayClick}
                        className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded"
                        aria-label={isPlaying && isCurrentTrack ? "Pause" : "Play"}
                        type="button"
                    >
                        {isPlaying && isCurrentTrack ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Track info - middle section */}
            <div className="flex items-center min-w-0 gap-3">
                {/* Album artwork */}
                <div className="w-10 h-10 flex-shrink-0 rounded overflow-hidden shadow">
                    <img 
                        src={item.imageUrl} 
                        alt={`${item.title} artwork`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                
                {/* Title and artist */}
                <div className="flex flex-col min-w-0">
                    <div className={`text-sm font-medium truncate ${getProviderDetails.textColor}`}>
                        {item.title}
                    </div>
                    
                    <div className="text-xs text-gray-400 truncate">
                        {item.artistInfo.map((artist, idx) => (
                            <React.Fragment key={artist.id || `artist-${idx}`}>
                                {idx > 0 && ", "}
                                <span className="hover:text-white hover:underline cursor-pointer">
                                    {artist.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Provider icon */}
            <div className="flex justify-center items-center opacity-60 group-hover:opacity-100">
                <img 
                    src={getProviderDetails.icon} 
                    alt={provider} 
                    className="w-4 h-4"
                />
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1">
                {/* Only show when not hovered - duration or added date */}
                {!isHovered ? (
                    <div className="flex items-center gap-2">
                        {trackFavorited && formattedAddedDate && (
                            <span className="text-xs text-gray-400 mr-2">{formattedAddedDate}</span>
                        )}
                        <span className="text-xs text-gray-400">{formattedDuration}</span>
                    </div>
                ) : (
                    <div className="flex items-center">
                        {/* Favorite button */}
                        <button 
                            onClick={handleFavoriteToggle}
                            onMouseEnter={(e) => handleTooltipShow('favorite', e)}
                            onMouseLeave={() => handleTooltipHide('favorite')}
                            disabled={!isAuthenticated}
                            className={`p-2 rounded-full ${isAuthenticated ? 'hover:bg-gray-600' : 'opacity-50 cursor-not-allowed'} transition-colors focus:outline-none focus:ring-2 focus:ring-white`}
                            aria-label={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                            type="button"
                        >
                            <img 
                                src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} 
                                alt="" 
                                className="w-4 h-4"
                                aria-hidden="true"
                            />
                        </button>
                        
                        {/* Add to queue button */}
                        <button
                            onClick={handleAddToQueue}
                            onMouseEnter={(e) => handleTooltipShow('queue', e)}
                            onMouseLeave={() => handleTooltipHide('queue')}
                            disabled={isInQueue}
                            className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                                isInQueue ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
                            }`}
                            aria-label={isInQueue ? "Already in queue" : "Add to queue"}
                            type="button"
                        >
                            <img 
                                src={AddToQueueSVG} 
                                alt="" 
                                className={`w-4 h-4 ${isAddedToQueue ? 'animate-pulse' : ''}`}
                                aria-hidden="true"
                            />
                        </button>

                        {/* Duration */}
                        <span className="text-xs text-gray-400 mx-2">{formattedDuration}</span>

                        {/* More options button */}
                        <button
                            ref={optionsButtonRef}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowOptions(!showOptions);
                            }}
                            className="p-2 rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="More options"
                            aria-expanded={showOptions}
                            aria-haspopup="menu"
                            type="button"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <circle cx="12" cy="12" r="1"></circle>
                                <circle cx="12" cy="5" r="1"></circle>
                                <circle cx="12" cy="19" r="1"></circle>
                            </svg>
                        </button>
                        
                        {/* Remove from playlist button (Only shown when in playlist view) */}
                        {isInPlaylist && (
                            <button
                                onClick={handleRemoveFromPlaylist}
                                onMouseEnter={(e) => handleTooltipShow('remove', e)}
                                onMouseLeave={() => handleTooltipHide('remove')}
                                className="p-2 rounded-full hover:bg-red-600 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Remove from playlist"
                                type="button"
                            >
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    width="16" 
                                    height="16" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    stroke="currentColor" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            {/* Options menu - render conditionally */}
            {renderOptionsMenu()}
            
            {/* Tooltips - render conditionally */}
            {renderTooltips()}
        </div>
    );

    // Compact layout - less details, more condensed
    const renderCompactLayout = () => (
        <div 
            className={`flex items-center p-2 rounded-md ${
                isCurrentTrack ? 'bg-gray-700/60' : 'hover:bg-gray-700/30'
            } group transition-colors duration-150 cursor-pointer`}
            onClick={handleItemClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="button"
            aria-label={`${item.title} by ${item.artistInfo.map(a => a.name).join(', ')}`}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick();
                }
            }}
        >
            {/* Play button or track number */}
            <div className="w-8 mr-3 flex justify-center">
                {showIndex && !isHovered ? (
                    <span className="text-gray-400 text-sm">{index}</span>
                ) : (
                    <button
                        onClick={handlePlayClick}
                        className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                            isCurrentTrack ? 'bg-green-500 text-black' : 'text-white'
                        }`}
                        aria-label={isPlaying && isCurrentTrack ? "Pause" : "Play"}
                        type="button"
                    >
                        {isPlaying && isCurrentTrack ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </button>
                )}
            </div>

            {/* Title and artist */}
            <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium truncate ${getProviderDetails.textColor}`}>
                    {item.title}
                </div>
                <div className="text-xs text-gray-400 truncate">
                    {item.artistInfo.map((artist, idx) => (
                        <React.Fragment key={artist.id || `artist-${idx}`}>
                            {idx > 0 && ", "}
                            <span>{artist.name}</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Action buttons - only visible on hover */}
            <div className="flex items-center">
                <span className="text-xs text-gray-400 mr-3">{formattedDuration}</span>
                
                {isHovered && (
                    <div className="flex">
                        {/* Like button */}
                        <button 
                            onClick={handleFavoriteToggle}
                            className="p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                            aria-label={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                            type="button"
                        >
                            <img 
                                src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} 
                                alt="" 
                                className="w-4 h-4"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    // Return the appropriate layout based on isCompact prop
    return isCompact ? renderCompactLayout() : renderStandardLayout();
});

// Ensure displayName is set for memoized component
ItemCard.displayName = 'ItemCard';

export default ItemCard;