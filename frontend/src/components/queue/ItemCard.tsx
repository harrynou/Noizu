import React, { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import { useFavoriteContext } from "../../contexts/favoriteContext";
import { useAuth } from "../../contexts/authContext";

import AddToPlaylist from "../track-actions/AddToPlaylist";

import SpotifyIcon from "../../assets/spotify/Icon.svg";
import SoundCloudIcon from "../../assets/soundcloud/Icon.svg";
import RedHeartSVG from "../../assets/heart-red.svg";
import WhiteHeartSVG from "../../assets/heart-white.svg";
import formatDuration from "../../utils/formatDuration";

interface ItemCardProps {
  track: Track;
  id: number; // index for drag and drop
}

const ItemCard = ({ track, id }: ItemCardProps) => {
  const { removeFromQueue, selectTrackToPlay, currentTrackIndex } = useMusicPlayer();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } =
    useSortable({
      id: id, // index as the sortable ID
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { isAuthenticated } = useAuth();
  const { isFavorited, addFavorite, removeFavorite } = useFavoriteContext();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown menu for a track
  const toggleDropdown = (trackId: string) => {
    setActiveDropdownId(activeDropdownId === trackId ? null : trackId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    };

    if (activeDropdownId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdownId]);

  // Handle favoriting/unfavoriting a track
  const handleFavoriteToggle = (track: Track) => {
    if (!isAuthenticated) return;

    if (isFavorited(track.id, track.provider)) {
      removeFavorite(track.id, track.provider);
    } else {
      const trackWithDate = {
        ...track,
        favoritedAt: new Date().toISOString(),
      };
      addFavorite(trackWithDate);
    }

    setActiveDropdownId(null);
  };

  // Handle opening track URL in original provider
  const openInProvider = (track: Track) => {
    if (track.uri) {
      window.open(track.uri, "_blank");
    }
    setActiveDropdownId(null);
  };

  // Handle opening artist URL in original provider
  const openArtistProfile = (artist: Artist) => {
    if (artist.profileUrl) {
      window.open(artist.profileUrl, "_blank");
    }
    setActiveDropdownId(null);
  };

  const handleRemoveFromQueue = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag when clicking remove button
    removeFromQueue(track.id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`flex items-center py-2 px-1 rounded-lg cursor-grab active:cursor-grabbing touch-manipulation transition-all duration-150 ${
        currentTrackIndex === id
          ? "bg-gray-700 ring-1 ring-accentPrimary/30"
          : "bg-gray-800 hover:bg-gray-700"
      } ${isDragging ? "shadow-2xl ring-2 ring-accentPrimary cursor-grabbing scale-105" : ""} ${
        isOver ? "ring-2 ring-blue-400/50 bg-gray-700" : ""
      }`}
      style={{
        ...style,
        touchAction: "none",
      }}>
      {/* Drag handle icon */}
      {/* Track source icon */}
      <div className="flex items-center mx-1">
        <img
          src={track.provider === "spotify" ? SpotifyIcon : SoundCloudIcon}
          alt={track.provider}
          className="w-4 h-4"
        />
      </div>

      {/* Track info - clickable area */}
      <div
        className="flex items-center flex-1 ml-1 overflow-hidden"
        onClick={(e) => {
          // Prevent drag when clicking on track info
          e.stopPropagation();
          selectTrackToPlay(id);
        }}>
        {/* Album art */}
        <div className="w-12 h-12 flex-shrink-0 bg-gray-900 rounded mr-3 overflow-hidden">
          {track.imageUrl && (
            <img
              src={track.imageUrl}
              alt={`${track.title} cover`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>

        {/* Track title and artist */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium truncate ${
              currentTrackIndex === id ? "text-accentPrimary" : "text-white"
            }`}>
            {track.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {track.artistInfo.map((artist, idx) => (
              <React.Fragment key={artist.id || idx}>
                {idx > 0 && ", "}
                <span>{artist.name}</span>
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>

      {/* Track duration */}
      <div className="text-xs text-gray-400 w-12 text-right mr-1">
        {formatDuration(track.duration)}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {/* More actions button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(`${track.id}-${track.provider}`);
          }}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-600 cursor-pointer"
          aria-label="More options">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
          </svg>
        </button>

        {/* Dropdown menu */}
        {activeDropdownId === `${track.id}-${track.provider}` && (
          <div
            ref={dropdownRef}
            className="absolute right-10 top-12 z-50 w-56 bg-gray-900 rounded-md shadow-lg overflow-hidden border border-gray-700"
            onClick={(e) => e.stopPropagation()}>
            <div className="py-1">
              {/* Favorite/Unfavorite option */}
              {isAuthenticated && (
                <button
                  onClick={() => handleFavoriteToggle(track)}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                  <img
                    src={isFavorited(track.id, track.provider) ? RedHeartSVG : WhiteHeartSVG}
                    alt=""
                    className="w-4 h-4"
                  />
                  {isFavorited(track.id, track.provider)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </button>
              )}
              {/* Remove from queue button */}
              <button
                onClick={(e) => {
                  handleRemoveFromQueue(e);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2"
                aria-label="Remove from queue"
                title="Remove from queue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                Remove from queue
              </button>
              {/* Add to playlist option */}
              {isAuthenticated && (
                <div className="px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
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
                    className="text-gray-400">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  <AddToPlaylist track={track} />
                </div>
              )}

              {/* Open in provider option */}
              <button
                onClick={() => openInProvider(track)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
                <img
                  src={track.provider === "spotify" ? SpotifyIcon : SoundCloudIcon}
                  alt=""
                  className="w-4 h-4"
                />
                Open in {track.provider === "spotify" ? "Spotify" : "SoundCloud"}
              </button>

              {/* Artist profile option - first artist only */}
              {track.artistInfo[0]?.profileUrl && (
                <button
                  onClick={() => openArtistProfile(track.artistInfo[0])}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors flex items-center gap-2">
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
                    className="text-gray-400">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  View artist profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemCard;
