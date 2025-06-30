import React, { useState, useCallback, memo, useMemo, useRef, useEffect } from "react";
import { usePlayerState } from "../../contexts/playerStateContext";
import { useQueue } from "../../contexts/queueContext";
import { useFavoriteContext } from "../../contexts/favoriteContext";
import { useAuth } from "../../contexts/authContext";
import { usePlaylistContext } from "../../contexts/playlistContext";
import formatDuration from "../../utils/formatDuration";
import { smartFormatDate } from "../../utils/formatTime";

import SpotifyIcon from "../../assets/spotify/Icon.svg";
import SoundcloudIcon from "../../assets/soundcloud/Icon.svg";
import RedHeartSVG from "../../assets/heart-red.svg";
import WhiteHeartSVG from "../../assets/heart-white.svg";
import AddToQueueSVG from "../../assets/AddToQueue.svg";

// Shared UI components
const PlayIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const PauseIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const MoreIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

// lazy image component
const LazyImage = memo(({ src, alt, className }: { src?: string; alt?: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`${className} overflow-hidden bg-gray-800`}>
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
});

LazyImage.displayName = "LazyImage";

// Tooltip component
const Tooltip = memo(
  ({
    show,
    text,
    position,
  }: {
    show: boolean;
    text: string;
    position: { x: number; y: number; showAbove?: boolean };
  }) => {
    if (!show) return null;

    const style = {
      left: `${position.x}px`,
      [position.showAbove ? "bottom" : "top"]: `${
        position.showAbove ? window.innerHeight - position.y + 8 : position.y + 8
      }px`,
    };

    return (
      <div
        className="fixed bg-black bg-opacity-80 text-white text-xs py-1 px-2 rounded pointer-events-none transform -translate-x-1/2 whitespace-nowrap z-50"
        style={style}
        role="tooltip">
        {text}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

// Custom hook for tooltip management
const useTooltip = () => {
  const [tooltip, setTooltip] = useState<{ show: boolean; text: string; position: any }>({
    show: false,
    text: "",
    position: { x: 0, y: 0 },
  });

  const showTooltip = useCallback((text: string, event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const showAbove = rect.top > window.innerHeight / 2;

    setTooltip({
      show: true,
      text,
      position: {
        x: rect.left + rect.width / 2,
        y: showAbove ? rect.top : rect.bottom,
        showAbove,
      },
    });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip((prev) => ({ ...prev, show: false }));
  }, []);

  return { tooltip, showTooltip, hideTooltip };
};

// Custom hook for outside click detection
const useOutsideClick = (ref: React.RefObject<HTMLElement>, callback: () => void, isActive: boolean) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback, isActive]);
};

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
    const { queue, addToQueue, currentTrackIndex } = useQueue();
    const { isAuthenticated } = useAuth();
    const { isFavorited, addFavorite, removeFavorite } = useFavoriteContext();
    const { playlists, addToPlaylist } = usePlaylistContext();

    const [isHovered, setIsHovered] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const [isAddedToQueue, setIsAddedToQueue] = useState(false);
    const [optionsPosition, setOptionsPosition] = useState({ top: 0, right: 0 });
    const [playlistMenuPosition, setPlaylistMenuPosition] = useState({ top: 0, left: 0 });

    const optionsMenuRef = useRef<HTMLDivElement>(null);
    const playlistMenuRef = useRef<HTMLDivElement>(null);
    const optionsButtonRef = useRef<HTMLButtonElement>(null);
    const { tooltip, showTooltip, hideTooltip } = useTooltip();

    // Computed values
    const currentTrack = currentTrackIndex !== null ? queue[currentTrackIndex] : null;
    const isCurrentTrack = currentTrack?.id === item.id && currentTrack?.provider === provider;
    const isInQueue = queue.some((track) => track.id === item.id && track.provider === provider);
    const trackFavorited = isFavorited(item.id, provider);

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

    const providerDetails = useMemo(
      () => ({
        icon: provider === "spotify" ? SpotifyIcon : SoundcloudIcon,
        textColor: isCurrentTrack ? (provider === "spotify" ? "text-green-500" : "text-orange-500") : "text-white",
      }),
      [provider, isCurrentTrack]
    );

    // Close options menu when clicking outside
    useOutsideClick(
      optionsMenuRef,
      () => {
        setShowOptions(false);
      },
      showOptions
    );

    // Close playlist menu when clicking outside
    useOutsideClick(
      playlistMenuRef,
      () => {
        setShowPlaylistMenu(false);
      },
      showPlaylistMenu
    );

    // Calculate options menu position when showing
    useEffect(() => {
      if (showOptions && optionsButtonRef.current) {
        const rect = optionsButtonRef.current.getBoundingClientRect();
        const menuWidth = 192; // 48 * 4 (w-48)
        const menuHeight = 200; // Approximate height

        let top = rect.bottom + 4;
        let right = window.innerWidth - rect.right;

        // Adjust if menu would go off screen
        if (top + menuHeight > window.innerHeight) {
          top = rect.top - menuHeight - 4;
        }

        if (rect.right - menuWidth < 0) {
          right = window.innerWidth - rect.left - menuWidth;
        }

        setOptionsPosition({ top, right });
      }
    }, [showOptions]);

    // Calculate playlist menu position when showing
    useEffect(() => {
      if (showPlaylistMenu && optionsMenuRef.current) {
        const rect = optionsMenuRef.current.getBoundingClientRect();
        const menuWidth = 192; // w-48
        const menuHeight = Math.min(playlists.length * 40 + 16, 300); // Max height 300px

        let top = rect.top;
        let left = rect.left - menuWidth - 4;

        // Adjust if menu would go off screen
        if (left < 0) {
          left = rect.right + 4;
        }

        if (top + menuHeight > window.innerHeight) {
          top = window.innerHeight - menuHeight - 8;
        }

        setPlaylistMenuPosition({ top, left });
      }
    }, [showPlaylistMenu, playlists.length]);

    // Event handlers
    const handlePlayClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (isCurrentTrack) {
          togglePlayPause();
        } else {
          playTrackState(trackData);
          onTrackSelect?.(trackData);
        }
      },
      [isCurrentTrack, togglePlayPause, playTrackState, trackData, onTrackSelect]
    );

    const handleAddToQueue = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (isInQueue) return;

        addToQueue(trackData);
        setIsAddedToQueue(true);
        setTimeout(() => setIsAddedToQueue(false), 2000);
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
          addFavorite({ ...trackData, favoritedAt: new Date().toISOString() });
        }
      },
      [trackFavorited, isAuthenticated, removeFavorite, addFavorite, item.id, provider, trackData]
    );

    const handleItemClick = useCallback(() => {
      if (isCurrentTrack) {
        togglePlayPause();
      } else {
        playTrackState(trackData);
        onTrackSelect?.(trackData);
      }
    }, [isCurrentTrack, togglePlayPause, playTrackState, trackData, onTrackSelect]);

    const handleOptionsToggle = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowOptions((prev) => !prev);
      setShowPlaylistMenu(false);
    }, []);

    const handleAddToPlaylistClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setShowPlaylistMenu((prev) => !prev);
    }, []);

    const handlePlaylistSelect = (e: React.MouseEvent<HTMLButtonElement>, playlistId: number) => {
      e.stopPropagation();
      try {
        addToPlaylist(playlistId, item.id, provider);
        setShowOptions(false);
        setShowPlaylistMenu(false);
      } catch (error) {
        console.error("Failed to add track to playlist:", error);
      }
    };

    // Shared button component
    const ActionButton = ({
      onClick,
      onMouseEnter,
      onMouseLeave,
      disabled,
      ariaLabel,
      className = "",
      children,
      buttonRef,
    }: {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
      onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
      onMouseLeave?: () => void;
      disabled?: boolean;
      ariaLabel: string;
      className?: string;
      children: React.ReactNode;
      buttonRef?: React.RefObject<HTMLButtonElement>;
    }) => (
      <button
        ref={buttonRef}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white ${className}`}
        aria-label={ariaLabel}
        type="button">
        {children}
      </button>
    );

    const baseClasses = `
    p-2 rounded-md items-center group transition-colors duration-150 cursor-pointer relative
    ${isCurrentTrack ? "bg-gray-700/60" : "hover:bg-gray-700/30"}
  `;

    if (isCompact) {
      return (
        <div
          className={`flex ${baseClasses}`}
          onClick={handleItemClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          role="button"
          aria-label={`${item.title} by ${item.artistInfo.map((a) => a.name).join(", ")}`}
          tabIndex={0}>
          {/* Play button */}
          <div className="w-8 mr-3 flex justify-center">
            {showIndex && !isHovered ? (
              <span className="text-gray-400 text-sm">{index}</span>
            ) : (
              <ActionButton
                onClick={handlePlayClick}
                ariaLabel={isPlaying && isCurrentTrack ? "Pause" : "Play"}
                className={isCurrentTrack ? "bg-green-500 text-black" : "text-white"}>
                {isPlaying && isCurrentTrack ? <PauseIcon size={12} /> : <PlayIcon size={12} />}
              </ActionButton>
            )}
          </div>

          {/* Track info */}
          <div className="flex-1 min-w-0">
            <div className={`text-sm font-medium truncate ${providerDetails.textColor}`}>{item.title}</div>
            <div className="text-xs text-gray-400 truncate">
              {item.artistInfo.map((artist) => artist.name).join(", ")}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center">
            <span className="text-xs text-gray-400 mr-3">{formatDuration(item.duration)}</span>
            {isHovered && (
              <div className="flex">
                <ActionButton
                  onClick={handleFavoriteToggle}
                  onMouseEnter={(e) => showTooltip(trackFavorited ? "Remove from favorites" : "Add to favorites", e)}
                  onMouseLeave={hideTooltip}
                  ariaLabel={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                  className="opacity-70 hover:opacity-100">
                  <img src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} alt="" className="w-4 h-4" />
                </ActionButton>

                <ActionButton
                  onClick={handleOptionsToggle}
                  buttonRef={optionsButtonRef}
                  ariaLabel="More options"
                  className="opacity-70 hover:opacity-100 ml-1">
                  <MoreIcon />
                </ActionButton>
              </div>
            )}
          </div>

          {/* Options menu - rendered conditionally */}
          {showOptions && (
            <div
              ref={optionsMenuRef}
              className="fixed z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden w-48"
              style={{ top: `${optionsPosition.top}px`, right: `${optionsPosition.right}px` }}
              role="menu">
              <div className="py-1">
                {showAddToPlaylist && (
                  <button
                    onClick={handleAddToPlaylistClick}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                    role="menuitem">
                    <span>+</span> Add to playlist
                    <span className="ml-auto">▶</span>
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                  role="menuitem">
                  <span>👤</span> Go to artist
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(item.uri || "");
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                  role="menuitem">
                  <span>🔗</span> Copy link
                </button>
                {item.uri && (
                  <a
                    href={item.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                    role="menuitem">
                    <img src={providerDetails.icon} alt="" className="w-4 h-4" />
                    Open in {provider === "spotify" ? "Spotify" : "SoundCloud"}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Playlist submenu - rendered conditionally */}
          {showPlaylistMenu && (
            <div
              ref={playlistMenuRef}
              className="fixed z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden w-48"
              style={{
                top: `${playlistMenuPosition.top}px`,
                left: `${playlistMenuPosition.left}px`,
                maxHeight: "300px",
                overflowY: "auto",
              }}
              role="menu">
              <div className="py-1">
                {playlists.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-400">No playlists found</div>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      key={playlist.playlistId}
                      onClick={(e) => handlePlaylistSelect(e, playlist.playlistId)}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors truncate"
                      role="menuitem">
                      {playlist.name}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
          <Tooltip {...tooltip} />
        </div>
      );
    }

    // Standard layout
    return (
      <div
        className={`grid grid-cols-[16px_4fr_1fr_auto] gap-4 pr-4 ${baseClasses}`}
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        aria-label={`${item.title} by ${item.artistInfo.map((a) => a.name).join(", ")}`}
        tabIndex={0}>
        {/* Track number/play button */}
        <div className="w-4 text-right">
          {showIndex && !isHovered && !isCurrentTrack ? (
            <span className="text-gray-400 text-sm">{index}</span>
          ) : (
            <ActionButton
              onClick={handlePlayClick}
              ariaLabel={isPlaying && isCurrentTrack ? "Pause" : "Play"}
              className="text-gray-400 hover:text-white">
              {isPlaying && isCurrentTrack ? <PauseIcon /> : <PlayIcon />}
            </ActionButton>
          )}
        </div>

        {/* Track info */}
        <div className="flex items-center min-w-0 gap-3">
          <LazyImage
            src={item.imageUrl}
            alt={`${item.title} artwork`}
            className="w-10 h-10 flex-shrink-0 rounded shadow"
          />
          <div className="flex flex-col min-w-0">
            <div className={`text-sm font-medium truncate ${providerDetails.textColor}`}>{item.title}</div>
            <div className="text-xs text-gray-400 truncate">
              {item.artistInfo.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>

        {/* Provider icon */}
        <div className="flex justify-center items-center opacity-60 group-hover:opacity-100">
          <img src={providerDetails.icon} alt={provider} className="w-4 h-4" loading="lazy" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {!isHovered ? (
            <div className="flex items-center gap-2">
              {trackFavorited && item.favoritedAt && (
                <span className="text-xs text-gray-400 mr-2">{smartFormatDate(item.favoritedAt)}</span>
              )}
              <span className="text-xs text-gray-400">{formatDuration(item.duration)}</span>
            </div>
          ) : (
            <div className="flex items-center">
              <ActionButton
                onClick={handleFavoriteToggle}
                onMouseEnter={(e) => showTooltip(trackFavorited ? "Remove from favorites" : "Add to favorites", e)}
                onMouseLeave={hideTooltip}
                disabled={!isAuthenticated}
                ariaLabel={trackFavorited ? "Remove from favorites" : "Add to favorites"}
                className={isAuthenticated ? "hover:bg-gray-600" : "opacity-50 cursor-not-allowed"}>
                <img src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} alt="" className="w-4 h-4" />
              </ActionButton>

              <ActionButton
                onClick={handleAddToQueue}
                onMouseEnter={(e) => showTooltip(isInQueue ? "Already in queue" : "Add to queue", e)}
                onMouseLeave={hideTooltip}
                disabled={isInQueue}
                ariaLabel={isInQueue ? "Already in queue" : "Add to queue"}
                className={isInQueue ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-600"}>
                <img src={AddToQueueSVG} alt="" className={`w-4 h-4 ${isAddedToQueue ? "animate-pulse" : ""}`} />
              </ActionButton>

              <span className="text-xs text-gray-400 mx-2">{formatDuration(item.duration)}</span>

              <ActionButton
                onClick={handleOptionsToggle}
                buttonRef={optionsButtonRef}
                ariaLabel="More options"
                className="hover:bg-gray-600">
                <MoreIcon />
              </ActionButton>

              {isInPlaylist && (
                <ActionButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromPlaylist?.(item.id, provider);
                  }}
                  onMouseEnter={(e) => showTooltip("Remove from playlist", e)}
                  onMouseLeave={hideTooltip}
                  ariaLabel="Remove from playlist"
                  className="hover:bg-red-600 ml-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </ActionButton>
              )}
            </div>
          )}
        </div>

        {/* Options menu - rendered conditionally */}
        {showOptions && (
          <div
            ref={optionsMenuRef}
            className="fixed z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden w-48"
            style={{ top: `${optionsPosition.top}px`, right: `${optionsPosition.right}px` }}
            role="menu">
            <div className="py-1">
              {showAddToPlaylist && (
                <button
                  onClick={handleAddToPlaylistClick}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                  role="menuitem">
                  <span>+</span> Add to playlist
                  <span className="ml-auto">▶</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                role="menuitem">
                <span>👤</span> Go to artist
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(item.uri || "");
                  setShowOptions(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                role="menuitem">
                <span>🔗</span> Copy link
              </button>
              {item.uri && (
                <a
                  href={item.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                  role="menuitem">
                  <img src={providerDetails.icon} alt="" className="w-4 h-4" />
                  Open in {provider === "spotify" ? "Spotify" : "SoundCloud"}
                </a>
              )}
            </div>
          </div>
        )}

        {/* Playlist submenu - rendered conditionally */}
        {showPlaylistMenu && (
          <div
            ref={playlistMenuRef}
            className="fixed z-50 bg-gray-800 rounded-md shadow-lg overflow-hidden w-48"
            style={{
              top: `${playlistMenuPosition.top}px`,
              left: `${playlistMenuPosition.left}px`,
              maxHeight: "300px",
              overflowY: "auto",
            }}
            role="menu">
            <div className="py-1">
              {playlists.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-400">No playlists found</div>
              ) : (
                playlists.map((playlist) => (
                  <button
                    key={playlist.playlistId}
                    onClick={(e) => handlePlaylistSelect(e, playlist.playlistId)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors truncate"
                    role="menuitem">
                    {playlist.name}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
        <Tooltip {...tooltip} />
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";

export default ItemCard;
