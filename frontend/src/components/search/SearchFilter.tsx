import React, { useState, useEffect } from 'react';

interface SearchFilterProps {
    spotifyTracks: Track[];
    soundcloudTracks: Track[];
    onFilterChange: (filteredSpotifyTracks: Track[], filteredSoundcloudTracks: Track[]) => void;
    activeTab: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({spotifyTracks, soundcloudTracks, onFilterChange, activeTab }): JSX.Element => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredSpotifyTracks, setFilteredSpotifyTracks] = useState<Track[]>(spotifyTracks);
    const [filteredSoundcloudTracks, setFilteredSoundcloudTracks] = useState<Track[]>(soundcloudTracks);

    // Filter tracks whenever search query changes
    useEffect(() => {
        if (!searchQuery.trim()) {
        // If search is empty, reset to full lists
        setFilteredSpotifyTracks(spotifyTracks);
        setFilteredSoundcloudTracks(soundcloudTracks);
        onFilterChange(spotifyTracks, soundcloudTracks);
        } else {
        const query = searchQuery.toLowerCase().trim();
        
        // Filter Spotify tracks
        const filteredSpotify = spotifyTracks.filter(track => 
            track.title.toLowerCase().includes(query) ||
            track.artistInfo.some(artist => 
            artist.name.toLowerCase().includes(query)
            )
        );
        
        // Filter SoundCloud tracks
        const filteredSoundcloud = soundcloudTracks.filter(track => 
            track.title.toLowerCase().includes(query) ||
            track.artistInfo.some(artist => 
            artist.name.toLowerCase().includes(query)
            )
        );
        
        setFilteredSpotifyTracks(filteredSpotify);
        setFilteredSoundcloudTracks(filteredSoundcloud);
        
        // Pass the newly created filtered arrays directly
        onFilterChange(filteredSpotify, filteredSoundcloud);
        }
    }, [searchQuery, spotifyTracks, soundcloudTracks, onFilterChange]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    // Get total number of filtered tracks
    const totalFilteredTracks = filteredSpotifyTracks.length + filteredSoundcloudTracks.length;
    const totalTracks = spotifyTracks.length + soundcloudTracks.length;

    return (
        <div className="w-full max-w-md ml-auto">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            </div>
            <input 
            type="search" 
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-accentPrimary focus:border-accentPrimary focus:outline-none"
            placeholder="Filter by title or artist..." 
            value={searchQuery}
            onChange={handleSearchChange}
            />
            {searchQuery && (
            <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
            )}
        </div>
        
        {searchQuery && (
            <div className="mt-2 text-sm text-gray-400">
            {searchQuery ? (
                <span>
                Showing {totalFilteredTracks} of {totalTracks} tracks
                {activeTab !== 'all' && (
                    <span> ({activeTab === 'spotify' ? filteredSpotifyTracks.length : filteredSoundcloudTracks.length} in current tab)</span>
                )}
                </span>
            ) : null}
            </div>
        )}
        </div>
    );
};

export default SearchFilter;