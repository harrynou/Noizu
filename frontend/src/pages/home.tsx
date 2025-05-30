import { useState, useEffect } from "react";
import SearchBar from "../components/search/SearchBar";
import { useSearchResult } from "../contexts/searchResultContext";
import { useAuth } from "../contexts/authContext";
import { useInView } from "react-intersection-observer";

// Logo imports
import SpotifyIcon from "../assets/spotify/Icon.svg";
import SoundcloudIcon from "../assets/soundcloud/Icon.svg";
import ItemCard from "../components/search/ItemCard";

const HomePage = (): JSX.Element => {
  const { spotifyTracks, soundcloudTracks, loadMoreTracks } = useSearchResult();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "spotify" | "soundcloud">("all");
  const [searchPerformed, setSearchPerformed] = useState<boolean>(false);

  // Spotify Intersection-Observer
  const { ref: spotifyRef, inView: spotifyInView } = useInView({
    threshold: 0,
  });

  // Soundcloud Intersection-Observer
  const { ref: soundcloudRef, inView: soundcloudInView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (spotifyInView) {
      loadMoreTracks("spotify");
    }
  }, [spotifyInView]);

  useEffect(() => {
    if (soundcloudInView) {
      loadMoreTracks("soundcloud");
    }
  }, [soundcloudInView]);

  // Set search performed flag based on tracks
  useEffect(() => {
    if (spotifyTracks.length > 0 || soundcloudTracks.length > 0) {
      setSearchPerformed(true);
    }
  }, [spotifyTracks, soundcloudTracks]);

  // Render welcome or no results message
  const renderEmptyState = () => {
    if (!searchPerformed) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-textPrimary py-20">
          <h2 className="text-2xl font-bold mb-4">Welcome to Noizu</h2>
          <p className="text-gray-300 max-w-md mb-6">
            Search for your favorite songs across Spotify and SoundCloud in one place.
            {!isAuthenticated && " Sign in to save favorites and create playlists."}
          </p>
          <div className="flex gap-4 mb-8">
            <img src={SpotifyIcon} alt="Spotify" className="w-12 h-12" />
            <img src={SoundcloudIcon} alt="SoundCloud" className="w-12 h-12" />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Try searching for an artist, song, or album</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-textPrimary flex flex-col items-center justify-center py-20">
          <h3 className="text-xl font-medium mb-3">No results found</h3>
          <p className="text-gray-400">Try a different search term</p>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col p-2 md:p-3 flex-grow text-textPrimary">
      {/* Hero section with search bar */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold mb-3 text-center">Find Your Perfect Song</h1>
        <SearchBar onSearch={() => setSearchPerformed(true)} />
      </div>

      {/* Main content section */}
      <div className="flex-1">
        {/* Tabs */}
        {(spotifyTracks.length > 0 || soundcloudTracks.length > 0) && (
          <div className="mb-2 border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-4 ${
                  activeTab === "all"
                    ? "border-b-2 border-accentPrimary text-white"
                    : "text-gray-400"
                }`}>
                All Results
              </button>
              <button
                onClick={() => setActiveTab("spotify")}
                className={`py-2 px-4 flex items-center gap-2 ${
                  activeTab === "spotify"
                    ? "border-b-2 border-accentPrimary text-white"
                    : "text-gray-400"
                }`}>
                <img src={SpotifyIcon} alt="Spotify" className="w-4 h-4" />
                Spotify {spotifyTracks.length > 0 && `(${spotifyTracks.length})`}
              </button>
              <button
                onClick={() => setActiveTab("soundcloud")}
                className={`py-2 px-4 flex items-center gap-2 ${
                  activeTab === "soundcloud"
                    ? "border-b-2 border-accentPrimary text-white"
                    : "text-gray-400"
                }`}>
                <img src={SoundcloudIcon} alt="SoundCloud" className="w-4 h-4" />
                SoundCloud {soundcloudTracks.length > 0 && `(${soundcloudTracks.length})`}
              </button>
            </div>
          </div>
        )}

        {/* Results area */}
        <div className="overflow-y-auto">
          {spotifyTracks.length === 0 && soundcloudTracks.length === 0 ? (
            renderEmptyState()
          ) : (
            <div>
              {activeTab === "all" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spotify column */}
                  {spotifyTracks.length > 0 && (
                    <div className="mb-6 lg:mb-0">
                      <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                        <img src={SpotifyIcon} alt="Spotify" className="w-5 h-5" />
                        Spotify Results
                      </h2>
                      <div className="space-y-2 bg-gray-800 bg-opacity-30 p-4 rounded-lg max-h-96 overflow-scroll">
                        {spotifyTracks.map((track) => (
                          <ItemCard
                            key={track.id}
                            item={track}
                            provider={track.provider}
                            isCompact={false}
                          />
                        ))}
                        <div ref={spotifyRef}></div>
                      </div>
                    </div>
                  )}

                  {/* SoundCloud column */}
                  {soundcloudTracks.length > 0 && (
                    <div>
                      <h2 className="text-xl font-medium mb-3 flex items-center gap-2">
                        <img src={SoundcloudIcon} alt="SoundCloud" className="w-5 h-5" />
                        SoundCloud Results
                      </h2>
                      <div className="space-y-2 bg-gray-800 bg-opacity-30 p-4 rounded-lg max-h-96 overflow-scroll">
                        {soundcloudTracks.map((track) => (
                          <ItemCard key={track.id} item={track} provider={track.provider} />
                        ))}
                        <div ref={soundcloudRef}></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "spotify" && (
                <div className="space-y-2">
                  {spotifyTracks.map((track) => (
                    <ItemCard key={track.id} item={track} provider={track.provider} />
                  ))}
                </div>
              )}

              {activeTab === "soundcloud" && (
                <div className="space-y-2">
                  {soundcloudTracks.map((track) => (
                    <ItemCard key={track.id} item={track} provider={track.provider} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
