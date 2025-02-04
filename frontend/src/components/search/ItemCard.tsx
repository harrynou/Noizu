import React from 'react';
import externalLink from '../../assets/external-link.svg'
import FullSpotifyLogoGreen from '../../assets/spotify/Full-Logo-Green.svg'
import FullSoundcloudLogo from '../../assets/soundcloud/Full-Logo.svg'
import { useMusicPlayer } from '../../contexts/musicPlayerContext';

interface Track {
    id: string;
    uri: string; 
    title: string;
    artist: string;
    imageUrl?: string;
    provider: string;
}

interface ItemCardProps {
    item: any,
    provider: string,
}

const ItemCard: React.FC<ItemCardProps> = ({item, provider}): JSX.Element => {
    const { addToQueue } = useMusicPlayer();
    const artistNames = item.artistInfo.map((artist:any) => artist.name).join(', ');
    const handleAddToQueue = () => {
        const track:Track = {
            id: item.id,
            title: item.title,
            artist: artistNames,
            imageUrl: item.imageUrl,
            provider: provider,
            uri: item.uri || item.trackUrl, 
        };
        addToQueue(track);
    };





    return (
    <div className="flex text-base justify-between bg-primary text-neutral p-2">
        {/* left side */}
        <div className='flex items-center gap-4'>
            <div>
                <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-sm"/>
            </div>
            <div className="flex flex-col items-start">
                <p>{item.title}</p>
                <a href={item.artistInfo[0].profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block whitespace-nowrap text-xs hover:underline hover:text-accent">{artistNames}</a>
            </div>
        </div>
        {/* Right Side */}
        <div>
            <div className='flex items-start'>
                <div className='flex gap-2'>
                    <img src={provider==='spotify' ? (FullSpotifyLogoGreen) : (FullSoundcloudLogo)} className={`object-contain ${provider === 'spotify' ? 'w-16' : 'w-24'}`}></img>
                    <a href={item.trackUrl} target="_blank" rel="noopener noreferrer">
                        <img src={externalLink} className='w-4 h-4 object-cover hover:opacity-75'/>
                    </a>
                </div>
            </div>
            <div>
                <div>
                <button onClick={handleAddToQueue} className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                    Add to Queue
                </button>
                </div>
            </div>
        </div>
    </div>)
}

export default ItemCard