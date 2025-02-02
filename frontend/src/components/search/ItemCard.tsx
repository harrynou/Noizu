import externalLink from '../../assets/external-link.svg'
import FullSpotifyLogoGreen from '../../assets/spotify/Full-Logo-Green.svg'
import FullSoundcloudLogo from '../../assets/soundcloud/Full-Logo.svg'
interface ItemCardProps {
    item: any,
    provider: string,
}

const ItemCard: React.FC<ItemCardProps> = ({item, provider}): JSX.Element => {
    const artistNames = item.artistInfo.map((artist:any) => artist.name).join(', ');
    return (
    <div className="flex text-base justify-between bg-primary text-neutral p-2">
        <div className='flex items-center gap-4'>
            <div>
                <img src={item.imageUrl} className="w-16 h-16 object-cover rounded-sm"/>
            </div>
            <div className="flex flex-col items-start">
                <p>{item.title}</p>
                <a href={item.artistInfo[0].profileUrl} target="_blank" rel="noopener noreferrer" className="inline-block whitespace-nowrap text-xs hover:underline hover:text-accent">{artistNames}</a>
            </div>
        </div>
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
                    <a></a>    
                </div>
            </div>
        </div>
    </div>)
}

export default ItemCard