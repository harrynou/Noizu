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
    const trackFavorited = isFavorited(trackId, provider);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent parent click events
        if (!isAuthenticated) {
            return;
        }
        if (trackFavorited){
            removeFavorite(trackId, provider);
        } else {
            const track = getTrack(trackId, provider);
            if (!track) return;
            addFavorite(track);
        }
    }

    return (
        <button 
            onClick={handleClick}
            disabled={!isAuthenticated}
            className={`group  transition-transform ${isAuthenticated ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'}`}
            aria-label={trackFavorited ? "Remove from favorites" : "Add to favorites"}
            title={trackFavorited ? "Remove from favorites" : "Add to favorites"}
        >
            <img 
                src={trackFavorited ? RedHeartSVG : WhiteHeartSVG} 
                className="w-6 h-6 group-hover:opacity-80 transition-transform"
                alt={trackFavorited ? "Favorited" : "Not favorited"} 
            />
        </button>
    );
}

export default FavoriteAction;