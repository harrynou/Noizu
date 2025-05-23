import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import { usePlayerState } from "../../contexts/playerStateContext";
import { useQueue } from "../../contexts/queueContext";
import { useFavoriteContext } from "../../contexts/favoriteContext";
import { useAuth } from "../../contexts/authContext";
import formatDuration from "../../utils/formatDuration";
import { smartFormatDate } from "../../utils/formatTime";

import SpotifyIcon from "../../assets/spotify/Icon.svg";
import SoundcloudIcon from "../../assets/soundcloud/Icon.svg";
import RedHeartSVG from "../../assets/heart-red.svg";
import WhiteHeartSVG from "../../assets/heart-white.svg";
import AddToQueueSVG from "../../assets/AddToQueue.svg";

type TooltipType = "favorite" | "queue" | "playlist" | "remove";

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
interface LazyImageProps {
  src?: string | undefined;
  alt?: string;
  className?: string;
  onLoad?: () => void;
}

// Custom lazy image component using Intersection Observer
const LazyImage = ({ src, alt, className, onLoad }: LazyImageProps) => {
  const imgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px 0px", // Start loading images 200px before they enter viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div ref={imgRef} className={`${className} overflow-hidden bg-gray-800`}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
};

const TOOLTIP_HIDE_DELAY = 100; // ms
const QUEUE_ANIMATION_DURATION = 2000; // ms

const ItemCard = memo(
  ({
    item,
    provider,
    showAddToPlaylist = true,
    onTrackSelect,
    isInPlaylist = false,
    onRemoveFromPlaylist,
    showIndex = false,
    index,
    isCompact = false,
  }: ItemCardProps) => {
    const { isPlaying, togglePlayPause, playTrack: playTrackState } = usePlayerState();
    const { queue, addToQueue } = useQueue();
    const queueState = useQueue();
    const { isAuthenticated } = useAuth();
    const { isFavorited, addFavorite, removeFavorite } = useFavoriteContext();

    // Computed property - derive currentTrack from queue context
    const currentTrack =
      queueState.currentTrackIndex !== null ? queueState.queue[queueState.currentTrackIndex] : null;

    const [isHovered, setIsHovered] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showTooltip, setShowTooltip] = useState<Record<TooltipType, boolean>>({
      favorite: false,
      queue: false,
      playlist: false,
      remove: false,
    });
    const [isAddedToQueue, setIsAddedToQueue] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<{
      x: number;
      y: number;
      showAbove?: boolean;
      showLeft?: boolean;
    }>({ x: 0, y: 0 });

    const itemCardRef = useRef<HTMLDivElement>(null);
    const optionsButtonRef = useRef<HTMLButtonElement>(null);
    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isCurrentTrack = useMemo(
      () => currentTrack?.id === item.id && currentTrack?.provider === provider,
      [currentTrack, item.id, provider]
    );

    const isInQueue = useMemo(
      () => queue.some((track) => track.id === item.id && track.provider === provider),
      [queue, item.id, provider]
    );

    const trackFavorited = useMemo(
      () => isFavorited(item.id, provider),
      [isFavorited, item.id, provider]
    );

    const formattedDuration = useMemo(() => formatDuration(item.duration), [item.duration]);

    const formattedAddedDate = useMemo(
      () => (item.favoritedAt ? smartFormatDate(item.favoritedAt) : null),
      [item.favoritedAt]
    );

    const trackData = useMemo(
      () => ({
        id: item.id,
        title: item.title,
        artistInfo: item.artistInfo,
        imageUrl: item?.imageUrl ?? "",
        provider,
        uri: item.uri,
        duration: item.duration,
        isFavorited: trackFavorited,
        favoritedAt: item.favoritedAt,
      }),
      [item, provider, trackFavorited]
    );

    const getProviderDetails = useMemo(() => {
      return {
        icon: provider === "spotify" ? SpotifyIcon : SoundcloudIcon,
        hoverBg: provider === "spotify" ? "bg-green-600" : "bg-orange-600",
        textColor: isCurrentTrack
          ? provider === "spotify"
            ? "text-green-500"
            : "text-orange-500"
          : "text-white",
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
          (optionsMenuRef.current && optionsMenuRef.current.contains(event.target as Node)) ||
          (optionsButtonRef.current && optionsButtonRef.current.contains(event.target as Node))
        ) {
          return;
        }
        setShowOptions(false);
      };

      // Only add listener when options menu is open
      if (showOptions) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }
    }, [showOptions]);

    // Enhanced tooltip handling with immediate hide when moving between buttons
    useEffect(() => {
      // Create a global mouse move handler to detect when cursor is outside all relevant elements
      const handleGlobalMouseMove = (e: MouseEvent) => {
        // If no tooltips are shown, do nothing
        if (!Object.values(showTooltip).some((shown) => shown)) return;

        // Check if mouse is over any tooltip trigger buttons or the card itself
        const isOverItemCard = itemCardRef.current?.contains(e.target as Node);

        // Handle the case when moving between buttons - we need to check if the specific button is hovered
        const hoveredElement = e.target as HTMLElement;

        // Get the button type from data attribute or other means - we'll assume if it's a button
        // and it's not the button that showed the current tooltip, we should hide the tooltip
        const isOverActiveButton =
          hoveredElement.tagName === "BUTTON" && hoveredElement.closest("[data-tooltip-type]");

        // If mouse is not over item card or is over a different button, hide tooltips
        if (!isOverItemCard || (isOverItemCard && !isOverActiveButton)) {
          setShowTooltip({
            favorite: false,
            queue: false,
            playlist: false,
            remove: false,
          });
        }
      };

      // Add global handlers
      document.addEventListener("mousemove", handleGlobalMouseMove);

      // Cleanup
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove);
      };
    }, [showTooltip]);

    // This is the playTrack function we'll use in the component
    // It wraps the playTrackState function from PlayerStateContext
    const playTrack = useCallback(
      (track: Track) => {
        playTrackState(track);
        if (onTrackSelect) {
          onTrackSelect(track);
        }
      },
      [playTrackState, onTrackSelect]
    );

    const handlePlayClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (isCurrentTrack) {
          togglePlayPause();
        } else {
          playTrack(trackData);
        }
      },
      [isCurrentTrack, togglePlayPause, playTrack, trackData]
    );

    const handleAddToQueue = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (isInQueue) return;

        addToQueue(trackData);
        setIsAddedToQueue(true);

        // Reset after animation duration
        setTimeout(() => {
          setIsAddedToQueue(false);
        }, QUEUE_ANIMATION_DURATION);
      },
      [isInQueue, addToQueue, trackData]
    );

    const handleFavoriteToggle = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();

        if (!isAuthenticated) return;

        if (trackFavorited) {
          removeFavorite(item.id, provider);
        } else {
          const updatedTrack = {
            ...trackData,
            favoritedAt: new Date().toISOString(),
          };
          addFavorite(updatedTrack);
        }
      },
      [trackFavorited, isAuthenticated, removeFavorite, addFavorite, item.id, provider, trackData]
    );

    const handleRemoveFromPlaylist = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (onRemoveFromPlaylist) {
          onRemoveFromPlaylist(item.id, provider);
        }
      },
      [onRemoveFromPlaylist, item.id, provider]
    );

    const handleItemClick = useCallback(() => {
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrack(trackData);
      }
    }, [isCurrentTrack, togglePlayPause, playTrack, trackData]);

    const handleTooltipShow = useCallback(
      (tooltipType: TooltipType, event: React.MouseEvent<HTMLElement>) => {
        // Clear any pending hide timeouts
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }

        // Get the position for the tooltip
        const rect = event.currentTarget.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const showAbove = rect.top > viewportHeight / 2;

        // Update tooltip position
        setTooltipPosition({
          x: rect.left + rect.width / 2,
          y: showAbove ? rect.top : rect.bottom,
          showAbove,
        });

        // Hide all tooltips first, then show only the current one
        setShowTooltip({
          favorite: false,
          queue: false,
          playlist: false,
          remove: false,
          [tooltipType]: true,
        });
      },
      []
    );

    const handleTooltipHide = useCallback((tooltipType: TooltipType) => {
      // Add a small delay to prevent flickering
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip((prev) => ({
          ...prev,
          [tooltipType]: false,
        }));
      }, TOOLTIP_HIDE_DELAY);
    }, []);

    const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      // Calculate viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Get the button position for the dropdown
      const rect = e.currentTarget.getBoundingClientRect();

      // Determine whether to show above or below based on available space
      // If clicked in the lower half of the viewport, show above
      const showAbove = rect.bottom > viewportHeight / 2;

      // Determine whether to show left or right based on available space
      // If clicked in the right half of the viewport, show to the left
      const showLeft = rect.left > viewportWidth / 2;

      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: showAbove ? rect.top : rect.bottom,
        showAbove,
        showLeft,
      });

      // Toggle the menu visibility
      setShowOptions(!showOptions);
    };

    const renderTooltips = () => {
      return Object.entries(showTooltip)
        .map(([type, isVisible]) => {
          if (!isVisible) return null;

          // Calculate vertical position based on available space
          const verticalPosition = tooltipPosition.showAbove
            ? { bottom: `${window.innerHeight - tooltipPosition.y + 8}px`, top: "auto" }
            : { top: `${tooltipPosition.y + 8}px`, bottom: "auto" };

          return (
            <div
              key={type}
              className="fixed bg-black bg-opacity-80 text-white text-xs py-1 px-2 rounded pointer-events-none transform -translate-x-1/2 whitespace-nowrap z-50"
              style={{
                left: `${tooltipPosition.x}px`,
                ...verticalPosition,
              }}
              role="tooltip">
              {type === "favorite" &&
                (trackFavorited ? "Remove from favorites" : "Add to favorites")}
              {type === "queue" && (isInQueue ? "Already in queue" : "Add to queue")}
              {type === "playlist" && "Add to playlist"}
              {type === "remove" && "Remove from playlist"}
            </div>
          );
        })
        .filter(Boolean);
    };

    const renderOptionsMenu = () => {
      if (!showOptions) return null;

      // Calculate dropdown positioning
      const menuWidth = 192; // w-48 = 12rem = 192px
      const menuHeight = 160; // Approximate height based on menu content

      // Determine horizontal position
      let leftPosition;
      if (tooltipPosition.showLeft) {
        // Position to the left of the button
        leftPosition = tooltipPosition.x - menuWidth - 10;
      } else {
        // Position to the right of the button
        leftPosition = tooltipPosition.x + 10;
      }

      // Ensure menu stays within viewport horizontally
      leftPosition = Math.max(10, Math.min(window.innerWidth - menuWidth - 10, leftPosition));

      // Determine vertical position
      let topPosition;
      if (tooltipPosition.showAbove) {
        // Position above the button
        topPosition = tooltipPosition.y - menuHeight - 5;
      } else {
        // Position below the button
        topPosition = tooltipPosition.y + 5;
      }

      // Ensure menu stays within viewport vertically
      topPosition = Math.max(10, Math.min(window.innerHeight - menuHeight - 10, topPosition));

      return (
        <div
          ref={optionsMenuRef}
          className="fixed z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden w-48"
          style={{
            top: `${topPosition}px`,
            left: `${leftPosition}px`,
          }}
          role="menu">
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
                role="menuitem">
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
                  aria-hidden="true">
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
              role="menuitem">
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
                aria-hidden="true">
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
                  navigator.clipboard
                    .writeText(item.uri)
                    .catch((err) => console.error("Failed to copy:", err));
                }
                setShowOptions(false);
              }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
              role="menuitem">
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
                aria-hidden="true">
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
                role="menuitem">
                <img src={getProviderDetails.icon} alt="" className="w-4 h-4" aria-hidden="true" />
                Open in {provider === "spotify" ? "Spotify" : "SoundCloud"}
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
        className={`grid grid-cols-[16px_4fr_1fr_auto] gap-4 p-2 pr-4 rounded-md items-center ${
          isCurrentTrack ? "bg-gray-700/60" : "hover:bg-gray-700/30"
        } group transition-colors duration-150 cursor-pointer relative`}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label={`${item.title} by ${item.artistInfo.map((a) => a.name).join(", ")}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleItemClick();
          }
        }}>
        {/* Track number or play button */}
        <div className="w-4 text-right">
          {showIndex && !isHovered && !isCurrentTrack ? (
            <span className="text-gray-400 text-sm">{index}</span>
          ) : (
            <button
              onClick={handlePlayClick}
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white rounded"
              aria-label={isPlaying && isCurrentTrack ? "Pause" : "Play"}
              type="button">
              {isPlaying && isCurrentTrack ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Track info - middle section */}
        <div className="flex items-center min-w-0 gap-3">
          {/* Album artwork with lazy loading */}
          <LazyImage
            src={item.imageUrl}
            alt={`${item.title} artwork`}
            className="w-10 h-10 flex-shrink-0 rounded overflow-hidden shadow"
          />

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
            width="16"
            height="16"
            loading="lazy"
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
                onMouseEnter={(e) => handleTooltipShow("favorite", e)}
                onMouseLeave={() => handleTooltipHide("favorite")}
                disabled={!isAuthenticated}
                data-tooltip-type="favorite"
                className={`p-2 rounded-full ${
                  isAuthenticated ? "hover:bg-gray-600" : "opacity-50 cursor-not-allowed"
                } transition-colors focus:outline-none focus:ring-2 focus:ring-white`}
                aria-label={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                type="button">
                <img
                  src={trackFavorited ? RedHeartSVG : WhiteHeartSVG}
                  alt=""
                  className="w-4 h-4"
                  width="16"
                  height="16"
                  loading="lazy"
                  aria-hidden="true"
                />
              </button>

              {/* Add to queue button */}
              <button
                onClick={handleAddToQueue}
                onMouseEnter={(e) => handleTooltipShow("queue", e)}
                onMouseLeave={() => handleTooltipHide("queue")}
                disabled={isInQueue}
                data-tooltip-type="queue"
                className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                  isInQueue ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"
                }`}
                aria-label={isInQueue ? "Already in queue" : "Add to queue"}
                type="button">
                <img
                  src={AddToQueueSVG}
                  alt=""
                  className={`w-4 h-4 ${isAddedToQueue ? "animate-pulse" : ""}`}
                  width="16"
                  height="16"
                  loading="lazy"
                  aria-hidden="true"
                />
              </button>

              {/* Duration */}
              <span className="text-xs text-gray-400 mx-2">{formattedDuration}</span>

              {/* More options button */}
              <button
                ref={optionsButtonRef}
                onClick={handleOptionClick}
                className="p-2 rounded-full hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-white relative"
                aria-label="More options"
                aria-expanded={showOptions}
                aria-haspopup="menu"
                type="button">
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
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>

              {/* Remove from playlist button (Only shown when in playlist view) */}
              {isInPlaylist && (
                <button
                  onClick={handleRemoveFromPlaylist}
                  onMouseEnter={(e) => handleTooltipShow("remove", e)}
                  onMouseLeave={() => handleTooltipHide("remove")}
                  data-tooltip-type="remove"
                  className="p-2 rounded-full hover:bg-red-600 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Remove from playlist"
                  type="button">
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
                    aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Render the options menu - Now moved to portal/fixed positioning */}
        {renderOptionsMenu()}

        {/* Tooltips - render at a fixed position */}
        {renderTooltips()}
      </div>
    );

    // Compact layout - less details, more condensed
    const renderCompactLayout = () => (
      <div
        ref={itemCardRef}
        className={`flex items-center p-2 rounded-md ${
          isCurrentTrack ? "bg-gray-700/60" : "hover:bg-gray-700/30"
        } group transition-colors duration-150 cursor-pointer relative`}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label={`${item.title} by ${item.artistInfo.map((a) => a.name).join(", ")}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleItemClick();
          }
        }}>
        {/* Play button or track number */}
        <div className="w-8 mr-3 flex justify-center">
          {showIndex && !isHovered ? (
            <span className="text-gray-400 text-sm">{index}</span>
          ) : (
            <button
              onClick={handlePlayClick}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${
                isCurrentTrack ? "bg-green-500 text-black" : "text-white"
              }`}
              aria-label={isPlaying && isCurrentTrack ? "Pause" : "Play"}
              type="button">
              {isPlaying && isCurrentTrack ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  aria-hidden="true">
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
                onMouseEnter={(e) => handleTooltipShow("favorite", e)}
                onMouseLeave={() => handleTooltipHide("favorite")}
                data-tooltip-type="favorite"
                className="p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                aria-label={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                type="button">
                <img
                  src={trackFavorited ? RedHeartSVG : WhiteHeartSVG}
                  alt=""
                  className="w-4 h-4"
                  aria-hidden="true"
                  width="16"
                  height="16"
                  loading="lazy"
                />
              </button>

              {/* More options button for compact layout */}
              <button
                ref={optionsButtonRef}
                onClick={handleOptionClick}
                className="p-1 opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white rounded-full ml-1"
                aria-label="More options"
                type="button">
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
                  aria-hidden="true">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Options menu and tooltips rendered at the document body level */}
        {renderOptionsMenu()}
        {renderTooltips()}
      </div>
    );

    // Return the appropriate layout based on isCompact prop
    return isCompact ? renderCompactLayout() : renderStandardLayout();
  }
);

// Ensure displayName is set for memoized component
ItemCard.displayName = "ItemCard";

export default ItemCard;
