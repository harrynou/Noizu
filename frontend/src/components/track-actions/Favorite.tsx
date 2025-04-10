import RedHeartSVG from '../../assets/heart-red.svg';
import WhiteHeartSVG from '../../assets/heart-white.svg';
import { useAuth } from '../../contexts/authContext';
import { useFavoriteContext } from '../../contexts/favoriteContext';
import { useSearchResult } from '../../contexts/searchResultContext';

interface FavoriteProps {
    trackId: string;
    provider: string;
}

const FavoriteAction: React.FC<FavoriteProps> = ({trackId, provider}): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const { addFavorite, removeFavorite, isFavorited} = useFavoriteContext();
    const { getTrack } = useSearchResult();
    const trackFavorited = isFavorited(trackId,provider);


    const handleClick = async () => {
        if (!isAuthenticated) {
            return;
        }
        if (trackFavorited){
            removeFavorite(trackId,provider);
        } else {
            const track = getTrack(trackId, provider);
            if (!track) return;
            addFavorite(track);
        }
    }

    return (
        <div>
<img 
                        src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} 
                        className="w-4 h-4 group-hover:opacity-80 transition-transform hover:scale-125"
                        alt={trackFavorited ? "Favorited" : "Not favorited"} 
                        onClick={handleClick}
                    />        </div>
    )
}

export default FavoriteAction
