import RedHeartSVG from '../../assets/heart-red.svg';
import WhiteHeartSVG from '../../assets/heart-white.svg';
import { useAuth } from '../../contexts/authContext';
import { useFavoriteContext } from '../../contexts/favoriteContext';
import { useSearchResult } from '../../contexts/searchResultContext';

interface FavoriteProps {
    trackId: string;
    provider: string;
    isFavorited: boolean;
}

const FavoriteAction: React.FC<FavoriteProps> = ({trackId, provider}): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const { addFavorite, removeFavorite, isFavorited} = useFavoriteContext();
    const { getTrack } = useSearchResult();

    const handleClick = async () => {
        if (isFavorited(trackId,provider)){
            removeFavorite(trackId,provider);
        } else {
            const track = getTrack(trackId, provider);
            if (!track) return;
            addFavorite(track);
        }
    }

    return (
        <div>
            {isAuthenticated ? (<img src={isFavorited(trackId,provider) ? RedHeartSVG : WhiteHeartSVG} onClick={handleClick} className='w-6 h-4 hover:cursor-pointer hover:opacity-50'/>) : null}
        </div>
    )
}

export default FavoriteAction
