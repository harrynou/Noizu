import React from 'react';
import externalLink from '../../assets/external-link.svg'
import FullSpotifyLogoGreen from '../../assets/spotify/Full-Logo-Green.svg'
import FullSoundcloudLogo from '../../assets/soundcloud/Full-Logo.svg'
import { useMusicPlayer } from '../../contexts/musicPlayerContext';
import { useAuth } from '../../contexts/authContext';
import AddToQueueSVG from '../../assets/AddToQueue.svg'
import heartWhiteSVG from '../../assets/heart-white.svg'
import heartRedSVG from '../../assets/heart-red.svg'

interface Track {
    id: string;
    uri: string; 
    title: string;
    artists: any;
    imageUrl?: string;
    provider: string;
    duration: number;
    isLiked: boolean;
}

interface ItemCardProps {
    item: any,
    provider: string,
}

const ItemCard: React.FC<ItemCardProps> = ({item, provider}): JSX.Element => {
    const { hasSpotifyPremium, isAuthenticated } = useAuth();
    const { addToQueue } = useMusicPlayer();
    const handleAddToQueue = () => {
        const track:Track = {
            id: item.id,
            title: item.title,
            artists: item.artistInfo,
            imageUrl: item.imageUrl,
            provider: provider,
            uri: item.uri || item.trackUrl, 
            duration: item.duration,
            isLiked: item.liked
        };
        addToQueue(track);
    };

const handleLike = () => {

}



    return (
    <div className="flex text-sm justify-between bg-primary text-white p-2 hover:bg-gray-800">
        {/* left side */}
        <div className='flex items-center gap-4'>
            <div>
                <img src={item.imageUrl} className="w-12 h-12 object-cover rounded-sm"/>
            </div>
            <div className="flex flex-col items-start">
                <p className=''>{item.title}</p>
                <div className="flex flex-wrap text-xs">
                {item.artistInfo.map((artist:any) => (
                    <a key={artist.name} href={artist.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block whitespace-nowrap hover:underline hover:text-accent opacity-75">{artist.name}</a> 
                )).reduce((prev:any, curr:any, index:number) => [prev, <span key={`comma-${index}`} className='opacity-75'>, </span>, curr])}
                </div>
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
            <div className='flex items-center gap-4'>
                <div>
                    {isAuthenticated ? <img onClick={handleLike} src={item.isLiked ? heartRedSVG : heartWhiteSVG} className='w-4'/> : null}
                </div>
                <div>
                {(hasSpotifyPremium || provider === 'soundcloud') ? (<img src={AddToQueueSVG} className='w-6 h-6 hover:cursor-pointer hover:opacity-75' onClick={handleAddToQueue}/>) : (<button>Must have a spotify premium account</button>)}
                </div>
            </div>
        </div>
    </div>)
}

export default ItemCard