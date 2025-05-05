import {useEffect, useState, useCallback} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {
  getPlaylistTracks,
  getPlaylists,
  removeTrackFromPlaylist,
  Playlist,
  PlaylistTrack,
} from "../../services/api";
import ItemCard from "../../components/search/ItemCard";
import SearchFilter from "../../components/search/SearchFilter";
import {useMusicPlayer} from "../../contexts/musicPlayerContext";
import SpotifyIcon from "../../assets/spotify/Icon.svg";
import SoundcloudIcon from "../../assets/soundcloud/Icon.svg";

const PlaylistDetailPage = () => {
  const {id} = useParams<{id: string}>();
  const navigate = useNavigate();
  const {playTrack, addToQueue} = useMusicPlayer();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [spotifyTracks, setSpotifyTracks] = useState<PlaylistTrack[]>([]);
  const [soundcloudTracks, setSoundcloudTracks] = useState<PlaylistTrack[]>([]);
  const [filteredSpotifyTracks, setFilteredSpotifyTracks] = useState<PlaylistTrack[]>([]);
  const [filteredSoundcloudTracks, setFilteredSoundcloudTracks] = useState<PlaylistTrack[]>([]);
  const [activeProvider, setActiveProvider] = useState<"all" | "spotify" | "soundcloud">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchPlaylistData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // etch playlist info
        const playlists = await getPlaylists();
        const currentPlaylist = playlists.find((p) => p.playlist_id === parseInt(id));

        if (!currentPlaylist) {
          setError("Playlist not found");
          setLoading(false);
          return;
        }

        setPlaylist(currentPlaylist);

        // Fetch playlist tracks
        const playlistTracksData = await getPlaylistTracks(parseInt(id));

        setSpotifyTracks(playlistTracksData.spotifyPlaylistTracks || []);
        setSoundcloudTracks(playlistTracksData.soundcloudPlaylistTracks || []);

        // Initialize filtered tracks
        setFilteredSpotifyTracks(playlistTracksData.spotifyPlaylistTracks || []);
        setFilteredSoundcloudTracks(playlistTracksData.soundcloudPlaylistTracks || []);
      } catch (err) {
        console.error("Error fetching playlist data:", err);
        setError("Failed to load playlist. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistData();
  }, [id]);

  // Get all tracks (for counting purposes)
  const allTracks = [...spotifyTracks, ...soundcloudTracks];

  // Get all filtered tracks based on current view
  const allFilteredTracks = [...filteredSpotifyTracks, ...filteredSoundcloudTracks];

  // Handle filter changes from the SearchFilter component
  const handleFilterChange = useCallback(
    (newFilteredSpotifyTracks: Track[], newFilteredSoundcloudTracks: Track[]) => {
      setFilteredSpotifyTracks(newFilteredSpotifyTracks);
      setFilteredSoundcloudTracks(newFilteredSoundcloudTracks);
    },
    [spotifyTracks, soundcloudTracks]
  );

  const handleRemoveTrack = async (trackId: string, provider: string) => {
    if (!id) return;

    try {
      setIsRemoving({...isRemoving, [trackId]: true});
      await removeTrackFromPlaylist(parseInt(id), trackId, provider);

      // Update tracks list after removal based on provider
      if (provider === "spotify") {
        setSpotifyTracks((prev) => prev.filter((track) => track.id !== trackId));
        setFilteredSpotifyTracks((prev) => prev.filter((track) => track.id !== trackId));
      } else {
        setSoundcloudTracks((prev) => prev.filter((track) => track.id !== trackId));
        setFilteredSoundcloudTracks((prev) => prev.filter((track) => track.id !== trackId));
      }
    } catch (err) {
      console.error("Error removing track:", err);
      setError("Failed to remove track. Please try again.");
    } finally {
      setIsRemoving({...isRemoving, [trackId]: false});
    }
  };

  const handlePlayAll = (provider?: "spotify" | "soundcloud") => {
    let tracksToPlay: PlaylistTrack[] = [];

    // Determine which tracks to play based on provider or active tab
    if (provider === "spotify" || (provider === undefined && activeProvider === "spotify")) {
      tracksToPlay = filteredSpotifyTracks;
    } else if (
      provider === "soundcloud" ||
      (provider === undefined && activeProvider === "soundcloud")
    ) {
      tracksToPlay = filteredSoundcloudTracks;
    } else {
      // When "all" is selected, play spotify tracks first, then soundcloud
      tracksToPlay = [...filteredSpotifyTracks, ...filteredSoundcloudTracks];
    }

    if (tracksToPlay.length === 0) return;

    // Play the first track immediately
    playTrack(tracksToPlay[0]);

    // Add the rest to the queue
    if (tracksToPlay.length > 1) {
      tracksToPlay.slice(1).forEach((track) => {
        addToQueue(track);
      });
    }
  };

  const playlistImage = playlist?.image_url || "https://via.placeholder.com/300?text=Playlist";

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accentPrimary"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
        <div className="bg-red-800 bg-opacity-30 border border-red-700 text-white px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate("/playlists")}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
          Back to Playlists
        </button>
      </div>
    );
  }

  // Count tracks by provider
  const spotifyTrackCount = spotifyTracks.length;
  const soundcloudTrackCount = soundcloudTracks.length;
  const totalTrackCount = spotifyTrackCount + soundcloudTrackCount;

  return (
    <div className="container mx-auto p-4 md:p-6 pb-24 text-textPrimary">
      {/* Back button */}
      <button
        onClick={() => navigate("/playlists")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to playlists
      </button>

      {/* Playlist header */}
      <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
        {/* Playlist image */}
        <div className="w-full md:w-48 aspect-square bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={playlistImage}
            alt={playlist?.name || "Playlist"}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Playlist";
            }}
          />
        </div>

        {/* Playlist info */}
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{playlist?.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span>
              {totalTrackCount} {totalTrackCount === 1 ? "track" : "tracks"}
            </span>
            {playlist?.created_at && (
              <span>Created {new Date(playlist.created_at).toLocaleDateString()}</span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => handlePlayAll()}
              disabled={allFilteredTracks.length === 0}
              className={`px-6 py-2 rounded-full flex items-center gap-2 ${
                allFilteredTracks.length > 0
                  ? "bg-accentPrimary text-white hover:bg-opacity-90"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play All
            </button>
          </div>
        </div>
      </div>

      {/* Provider tabs */}
      <div className="mb-6 border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveProvider("all")}
            className={`py-2 px-4 ${
              activeProvider === "all"
                ? "border-b-2 border-accentPrimary text-white"
                : "text-gray-400"
            }`}>
            All Sources
          </button>

          {spotifyTrackCount > 0 && (
            <button
              onClick={() => setActiveProvider("spotify")}
              className={`py-2 px-4 flex items-center gap-2 ${
                activeProvider === "spotify"
                  ? "border-b-2 border-accentPrimary text-white"
                  : "text-gray-400"
              }`}>
              <img src={SpotifyIcon} alt="Spotify" className="w-4 h-4" />
              Spotify ({spotifyTrackCount})
            </button>
          )}

          {soundcloudTrackCount > 0 && (
            <button
              onClick={() => setActiveProvider("soundcloud")}
              className={`py-2 px-4 flex items-center gap-2 ${
                activeProvider === "soundcloud"
                  ? "border-b-2 border-accentPrimary text-white"
                  : "text-gray-400"
              }`}>
              <img src={SoundcloudIcon} alt="SoundCloud" className="w-4 h-4" />
              SoundCloud ({soundcloudTrackCount})
            </button>
          )}

          {/* Spotify-specific filter */}
          <div className="w-1/3">
            <SearchFilter
              spotifyTracks={spotifyTracks}
              soundcloudTracks={soundcloudTracks}
              onFilterChange={handleFilterChange}
              activeTab="spotify"
            />
          </div>
        </div>
      </div>

      {/* Spotify section */}
      {(activeProvider === "all" || activeProvider === "spotify") && spotifyTracks.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <img src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />
              <h2 className="text-xl font-medium">Spotify Tracks</h2>
            </div>

            {/* Spotify-specific play button */}
            <button
              onClick={() => handlePlayAll("spotify")}
              disabled={filteredSpotifyTracks.length === 0}
              className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                filteredSpotifyTracks.length > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}>
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
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Play Spotify
            </button>
          </div>

          {/* Spotify tracks list */}
          <div className="space-y-2 mb-6">
            {filteredSpotifyTracks.length > 0 ? (
              filteredSpotifyTracks.map((track) => (
                <div key={`spotify-${track.id}`} className="relative group">
                  <ItemCard item={track} provider="spotify" />

                  {/* Remove track button */}
                  <button
                    onClick={() => handleRemoveTrack(track.id, "spotify")}
                    disabled={isRemoving[track.id]}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove from playlist">
                    {isRemoving[track.id] ? (
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
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
                    )}
                  </button>
                </div>
              ))
            ) : spotifyTracks.length > 0 ? (
              <div className="text-center py-8 bg-gray-800 rounded-lg">
                <p className="text-gray-400">
                  No matching Spotify tracks. Try adjusting your filter.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* SoundCloud section */}
      {(activeProvider === "all" || activeProvider === "soundcloud") &&
        soundcloudTracks.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <img src={SoundcloudIcon} alt="SoundCloud" className="w-5 h-5" />
                <h2 className="text-xl font-medium">SoundCloud Tracks</h2>
              </div>

              {/* SoundCloud-specific play button */}
              <button
                onClick={() => handlePlayAll("soundcloud")}
                disabled={filteredSoundcloudTracks.length === 0}
                className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-1 ${
                  filteredSoundcloudTracks.length > 0
                    ? "bg-orange-600 text-white hover:bg-orange-700"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}>
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
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Play SoundCloud
              </button>
            </div>

            {/* SoundCloud tracks list */}
            <div className="space-y-2">
              {filteredSoundcloudTracks.length > 0 ? (
                filteredSoundcloudTracks.map((track) => (
                  <div key={`soundcloud-${track.id}`} className="relative group">
                    <ItemCard item={track} provider="soundcloud" />

                    {/* Remove track button */}
                    <button
                      onClick={() => handleRemoveTrack(track.id, "soundcloud")}
                      disabled={isRemoving[track.id]}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-800 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove from playlist">
                      {isRemoving[track.id] ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
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
                      )}
                    </button>
                  </div>
                ))
              ) : soundcloudTracks.length > 0 ? (
                <div className="text-center py-8 bg-gray-800 rounded-lg">
                  <p className="text-gray-400">
                    No matching SoundCloud tracks. Try adjusting your filter.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        )}

      {/* Empty state - when no tracks at all or filtered to none */}
      {(allTracks.length === 0 || (activeProvider === "all" && allFilteredTracks.length === 0)) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">This playlist is empty</h2>
          <p className="text-gray-400 max-w-md mb-6">
            {allTracks.length > 0
              ? "No tracks match your search. Try adjusting your filter or switching to a different provider tab."
              : 'Add tracks to this playlist by clicking the "Add to Playlist" button from any track.'}
          </p>
          {allTracks.length > 0 && (
            <button
              onClick={() => {
                setFilteredSpotifyTracks(spotifyTracks);
                setFilteredSoundcloudTracks(soundcloudTracks);
                setActiveProvider("all");
              }}
              className="px-6 py-2 bg-accentPrimary text-white rounded-full">
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Provider-specific empty states */}
      {activeProvider === "spotify" && spotifyTrackCount === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">No Spotify tracks in this playlist yet.</p>
        </div>
      )}

      {activeProvider === "soundcloud" && soundcloudTrackCount === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-400">No SoundCloud tracks in this playlist yet.</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistDetailPage;
