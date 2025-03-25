import RedHeartSVG from '../../assets/heart-red.svg';
import WhiteHeartSVG from '../../assets/heart-white.svg';
import { useAuth } from '../../contexts/authContext';
import { favoriteTrack } from '../../services/api';
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
            addFavorite();
        }
        try {
            await favoriteTrack(trackId, provider);   
        } catch (error) {
            toggleFavorite(trackId, provider);
        }
    }

    return (
        <div>
            {isAuthenticated ? (<img src={isFavorited ? RedHeartSVG : WhiteHeartSVG} onClick={handleClick} className='w-6 h-4 hover:cursor-pointer hover:opacity-50'/>) : null}
        </div>
    )
}

export default FavoriteAction
