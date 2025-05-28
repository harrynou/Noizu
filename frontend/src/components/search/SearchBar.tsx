import React, { useState, useRef, useEffect, useCallback } from "react";
import { searchQuery } from "../../services/api";
import { useSearchResult } from "../../contexts/searchResultContext";
import { debounce } from "lodash";

interface SearchBarProps {
  onSearch?: () => void; // Optional callback for when search is performed
}

const SearchBar = ({ onSearch }: SearchBarProps): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const {
    setTrackResults,
    setSpotifyHasMore,
    setSoundcloudHasMore,
    setSoundcloudOffset,
    setSpotifyOffset,
    setSearchString,
    limit,
  } = useSearchResult();

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Error loading recent searches:", e);
      }
    }
  }, []);

  // Save recent searches to localStorage when updated
  useEffect(() => {
    if (recentSearches.length > 0) {
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowRecent(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Create debounced search function for auto-search
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.length >= 3) {
        performSearch(searchTerm);
      }
    }, 500),
    []
  );

  // Update debounced search when query changes
  useEffect(() => {
    setSearchString(query);
    debouncedSearch(query);
    return () => {
      debouncedSearch.cancel();
    };
  }, [query, debouncedSearch]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setShowRecent(false);

    try {
      // Add to recent searches (avoid duplicates)
      setRecentSearches((prev) => {
        const filtered = prev.filter((item) => item.toLowerCase() !== searchTerm.toLowerCase());
        return [searchTerm, ...filtered].slice(0, 5);
      });

      // Call the API for both providers
      const [soundcloudResponse, spotifyResponse] = await Promise.allSettled([
        searchQuery(searchTerm, "soundcloud", limit, 0),
        searchQuery(searchTerm, "spotify", limit, 0),
      ]);

      // Process SoundCloud results
      if (soundcloudResponse.status === "fulfilled") {
        setTrackResults(soundcloudResponse.value.queryData, "soundcloud");
        setSoundcloudHasMore(soundcloudResponse.value.hasMore);
        setSoundcloudOffset(limit);
      } else {
        console.error("SoundCloud search error:", soundcloudResponse.reason);
        setTrackResults([], "soundcloud");
      }

      // Process Spotify results
      if (spotifyResponse.status === "fulfilled") {
        setTrackResults(spotifyResponse.value.queryData, "spotify");
        setSpotifyHasMore(spotifyResponse.value.hasMore);
        setSpotifyOffset(limit);
      } else {
        console.error("Spotify search error:", spotifyResponse.reason);
        setTrackResults([], "spotify");
      }

      // Notify parent component if callback provided
      if (onSearch) onSearch();
    } catch (error) {
      console.error("Error occurred during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleRecentSearchClick = (term: string) => {
    setQuery(term);
    performSearch(term);
  };

  const handleFocus = () => {
    if (recentSearches.length > 0) {
      setShowRecent(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close dropdown on escape
    if (e.key === "Escape") {
      setShowRecent(false);
    }
  };

  const clearRecentSearches = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
    setShowRecent(false);
  };

  const clearSearch = () => {
    setQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  return (
    <div ref={searchContainerRef} className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white bg-opacity-10 border border-gray-700 rounded-full overflow-hidden hover:bg-opacity-15 transition-all duration-200">
          {/* Search icon */}
          <div className="pl-4">
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
              className="text-gray-400"
              aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          {/* Input field */}
          <input
            ref={searchInputRef}
            type="search"
            className="w-full py-3 px-3 bg-transparent outline-none text-white placeholder-gray-400"
            placeholder="Search songs, artists, or albums..."
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            aria-label="Search music"
            autoComplete="off"
          />

          {/* Loading indicator or clear button */}
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="pr-4 text-gray-400 hover:text-white"
              aria-label="Clear search">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
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

          {/* Search button */}
          <button
            type="submit"
            className="bg-accentPrimary px-6 py-3 text-white font-medium h-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSearching || !query.trim()}
            aria-label={isSearching ? "Searching..." : "Search"}>
            {isSearching ? (
              <svg
                className="animate-spin w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true">
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
              "Search"
            )}
          </button>
        </div>
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute z-10 mt-2 w-full bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-gray-300">Recent Searches</h3>
            <button
              onClick={clearRecentSearches}
              className="text-xs text-gray-400 hover:text-accentPrimary"
              aria-label="Clear all recent searches">
              Clear all
            </button>
          </div>
          <ul role="listbox">
            {recentSearches.map((term, index) => (
              <li key={index}>
                <button
                  className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  onClick={() => handleRecentSearchClick(term)}
                  role="option">
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
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
