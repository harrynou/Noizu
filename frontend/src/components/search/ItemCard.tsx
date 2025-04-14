import React, { useState, memo } from 'react';
import externalLink from '../../assets/external-link.svg';
import FullSpotifyLogoGreen from '../../assets/spotify/Full-Logo-Green.svg';
import FullSoundcloudLogo from '../../assets/soundcloud/Full-Logo.svg';
import SpotifyIcon from '../../assets/spotify/Icon.svg';
import SoundcloudIcon from '../../assets/soundcloud/Icon.svg';

import AddToQueueAction from '../track-actions/AddToQueue';
import FavoriteAction from '../track-actions/Favorite';
import formatDuration from '../../utils/formatDuration';
import { useMusicPlayer } from '../../contexts/musicPlayerContext';

interface ItemCardProps {
    item: any;
    provider: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, provider }): JSX.Element => {
    const { currentTrack, playTrack, isPlaying, togglePlayPause } = useMusicPlayer();
    const [isHovered, setIsHovered] = useState(false);
    
    const isCurrentTrack = currentTrack?.id === item.id && currentTrack?.provider === provider;
    
    const track: Track = {
        id: item.id,
        title: item.title,
        artists: item.artistInfo,
        imageUrl: item.imageUrl,
        provider: provider,
        uri: item.uri || item.trackUrl, 
        duration: item.duration,
        isFavorited: item.isFavorited,
    };

    const handlePlayClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isCurrentTrack) {
            togglePlayPause();
        } else {
            playTrack(track);
        }
    };

    return (
        <div 
            className="flex justify-between text-white p-2 hover:bg-gray-700 rounded-md"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* left side with play button overlay */}
            <div className='flex items-center gap-4'>
                <div className="relative cursor-pointer" onClick={handlePlayClick}>
                    <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-12 w-min-12 h-12 object-cover rounded-sm"
                        loading="lazy"
                    />
                    <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-sm transition-opacity ${
                            isHovered || isCurrentTrack ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {isCurrentTrack && isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-start">
                    {/* Title */}
                    <p className='text-sm md:text-base font-medium'>{item.title}</p>
                    {/* Artists */}
                    <div className="flex flex-wrap text-xs">
                        {item.artistInfo.map((artist: any, index: number) => (
                            <React.Fragment key={artist.name}>
                                {index > 0 && <span className='opacity-75'>, </span>}
                                <a 
                                    key={artist.name} 
                                    href={artist.profileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-block whitespace-nowrap hover:underline hover:text-accentPrimary opacity-75"
                                >
                                    {artist.name}
                                </a>
                            </React.Fragment>
                        ))}
                    </div>
                    <p className='text-xs opacity-60'>{formatDuration(track.duration)}</p>
                </div>
            </div>
            {/* Right Side */}
            <div className='flex flex-col justify-between items-end'>
                <div className='flex'>
                    {/* Attribution and External Link */}
                    <div className='flex justify-center gap-2'>
                        <img 
                            src={provider === 'spotify' ? SpotifyIcon : SoundcloudIcon} 
                            className={`sm:hidden object-contain ${provider === 'spotify' ? 'w-4 w-min-4' : 'w-5'}`} 
                            alt={`${provider} logo`}
                        />
                        <img 
                            src={provider === 'spotify' ? FullSpotifyLogoGreen : FullSoundcloudLogo} 
                            className={`hidden sm:block object-contain ${provider === 'spotify' ? 'w-16' : 'w-24'}`} 
                            alt={`${provider} logo`}
                        />
                        <a 
                            href={item.trackUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label={`Open ${item.title} on ${provider}`}
                            className="hover:opacity-75 transition-opacity flex items-center"
                        >
                            <img src={externalLink} className='w-4 h-4 object-cover' alt="External link" />
                        </a>
                    </div>
                </div>
                {/* Track Actions */}
                <div className='flex items-center space-x-4'>
                    <FavoriteAction trackId={track.id} provider={track.provider}/>
                    <AddToQueueAction track={track}/>
                </div>
            </div>
        </div>
    );
};

// Memoize to prevent unnecessary re-renders in lists
export default memo(ItemCard);