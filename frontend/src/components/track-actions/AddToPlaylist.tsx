import { useState, useEffect, useRef } from 'react';
import { getPlaylists, addTrackToPlaylist } from '../../services/api';
import { useAuth } from '../../contexts/authContext';

interface AddToPlaylistProps {
  track: Track;
}

const AddToPlaylist = ({ track }: AddToPlaylistProps) => {
  const { isAuthenticated } = useAuth();
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingToPlaylist, setAddingToPlaylist] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ [key: number]: boolean }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch playlists when dropdown is opened
  useEffect(() => {
    if (showDropdown && isAuthenticated) {
      fetchPlaylists();
    }
  }, [showDropdown, isAuthenticated]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset success messages after a delay
  useEffect(() => {
    const successKeys = Object.keys(success).filter(key => success[parseInt(key)]);
    if (successKeys.length > 0) {
      const timer = setTimeout(() => {
        const newSuccess = { ...success };
        successKeys.forEach(key => {
          newSuccess[parseInt(key)] = false;
        });
        setSuccess(newSuccess);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const fetchedPlaylists = await getPlaylists();
      setPlaylists(fetchedPlaylists);
      setError(null);
    } catch (err) {
      console.error('Error fetching playlists:', err);
      setError('Failed to load playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      setAddingToPlaylist({ ...addingToPlaylist, [playlistId]: true });
      await addTrackToPlaylist(playlistId, track.id, track.provider);
      
      // Show success message
      setSuccess({ ...success, [playlistId]: true });
      
      // Hide error if any
      setError(null);
    } catch (err) {
      console.error('Error adding to playlist:', err);
      setError('Failed to add to playlist');
    } finally {
      setAddingToPlaylist({ ...addingToPlaylist, [playlistId]: false });
    }
  };

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-1 hover:bg-gray-700 rounded-full transition-colors"
        aria-label="Add to playlist"
        title="Add to playlist"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
      
      {showDropdown && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="font-medium">Add to playlist</h3>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="p-3 bg-red-900 bg-opacity-30 text-sm">
              {error}
            </div>
          )}
          
          {/* Playlists list */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-accentPrimary"></div>
              </div>
            ) : playlists.length > 0 ? (
              <ul>
                {playlists.map((playlist) => (
                  <li key={playlist.playlist_id} className="border-b border-gray-700 last:border-0">
                    <button
                      onClick={() => handleAddToPlaylist(playlist.playlist_id)}
                      disabled={addingToPlaylist[playlist.playlist_id] || success[playlist.playlist_id]}
                      className="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-gray-700 transition-colors"
                    >
                      <span className="truncate pr-2">{playlist.name}</span>
                      {addingToPlaylist[playlist.playlist_id] ? (
                        <span className="flex-shrink-0">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </span>
                      ) : success[playlist.playlist_id] ? (
                        <span className="text-green-500">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-400">
                You don't have any playlists yet.
              </div>
            )}
          </div>
          
          {/* Create new playlist link */}
          <div className="px-4 py-2 border-t border-gray-700">
            <a
              href="/playlists"
              className="flex items-center gap-2 text-accentPrimary hover:underline text-sm"
              onClick={() => setShowDropdown(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create new playlist
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToPlaylist;