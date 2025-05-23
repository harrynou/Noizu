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
  key: string;
  id: number;
}

const ItemCard = ({ track, key, id }: ItemCardProps) => {
  const { removeFromQueue, selectTrackToPlay, currentTrackIndex } = useMusicPlayer();
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const { isAuthenticated } = useAuth();
  const { isFavorited, addFavorite, removeFavorite } = useFavoriteContext();
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown menu for a track
  const toggleDropdown = (id: string) => {
    setActiveDropdownId(activeDropdownId === id ? null : id);
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

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div
        className={`flex items-center p-2 ${
          currentTrackIndex === id ? "bg-gray-700" : "bg-gray-800 hover:bg-gray-700"
        }`}>
        {/* Drag handle */}
        <div className="px-2 cursor-move flex-shrink-0 text-gray-500 group-hover:text-gray-400">
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
            <circle cx="8" cy="8" r="1"></circle>
            <circle cx="8" cy="16" r="1"></circle>
            <circle cx="16" cy="8" r="1"></circle>
            <circle cx="16" cy="16" r="1"></circle>
          </svg>
        </div>

        {/* Track info */}
        <div
          className="flex items-center flex-1 ml-2 cursor-pointer overflow-hidden"
          onClick={() => selectTrackToPlay(id)}>
          {/* Album art */}
          <div className="w-10 h-10 flex-shrink-0 bg-gray-900 mr-3">
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

        {/* Track source icon */}
        <div className="flex items-center mx-2 opacity-60">
          <img
            src={track.provider === "spotify" ? SpotifyIcon : SoundCloudIcon}
            alt={track.provider}
            className="w-4 h-4"
          />
        </div>

        {/* Track duration */}
        <div className="text-xs text-gray-400 w-10 text-right mr-2">
          {formatDuration(track.duration)}
        </div>

        {/* Actions */}
        <div className="flex items-center">
          {/* More actions button */}
          <button
            onClick={() => toggleDropdown(`${track.id}-${track.provider}`)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
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

          {/* Remove from queue button */}
          <button
            onClick={() => removeFromQueue(track.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
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
          </button>
          {/* Dropdown menu */}
          {activeDropdownId === `${track.id}-${track.provider}` && (
            <div
              ref={dropdownRef}
              className="absolute right-10 top-12 z-1 w-56 bg-gray-900 rounded-md shadow-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to parent
            >
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

                {/* Add to playlist option */}
                {isAuthenticated && (
                  <button
                    onClick={(e) => e.stopPropagation()}
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
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <AddToPlaylist track={track} />
                  </button>
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
    </div>
  );
};

export default ItemCard;
