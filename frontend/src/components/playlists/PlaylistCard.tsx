import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PlaylistCardProps {
  playlist: {
    playlist_id: number;
    name: string;
    image_url: string | null;
    track_count?: number;
    created_at?: string;
  };
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const navigate = useNavigate();
  
  // Default image if none provided
  const imageUrl = playlist.image_url || '/assets/default-playlist.jpg';
  
  const handleClick = () => {
    navigate(`/playlists/${playlist.playlist_id}`);
  };
  
  // Format date to a readable string if available
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div 
      className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:transform hover:scale-105 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative pb-[100%]">
        {/* Playlist image */}
        <img 
          src={imageUrl}
          alt={playlist.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a default placeholder if image fails to load
            (e.target as HTMLImageElement).src = 'https://noizu-dev-us-west-1-playlist-covers.s3.us-west-1.amazonaws.com/playlist-covers/cover-placeholder.png';
          }}
        />
        
        {/* Overlay with track count */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">
              {playlist.track_count !== undefined ? `${playlist.track_count} tracks` : ''}
            </span>
          </div>
        </div>
      </div>
      
      {/* Playlist name and creation date */}
      <div className="p-4">
        <h3 className="font-bold truncate">{playlist.name}</h3>
        {playlist.created_at && (
          <p className="text-xs text-gray-400 mt-1">Created {formatDate(playlist.created_at)}</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard;