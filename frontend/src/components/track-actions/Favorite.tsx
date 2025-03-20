import { useState } from 'react';
import RedHeartSVG from '../../assets/heart-red.svg';
import WhiteHeartSVG from '../../assets/heart-white.svg';
import { useAuth } from '../../contexts/authContext';
import { favoriteTrack } from '../../services/api';

interface FavoriteProps {
    trackId: string;
    provider: string;
    isFavorited: boolean;
    toggleFavorite: (trackId: string, provider: string) => void;
}

const FavoriteAction: React.FC<FavoriteProps> = ({trackId, provider, toggleFavorite}): JSX.Element => {
    const [isFavorited, setIsFavorited] = useState<boolean>(true);
    const { isAuthenticated } = useAuth()


    const handleClick = async () => {
        toggleFavorite(trackId, provider);
        const success = await favoriteTrack(trackId, provider);
        if (!success){
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
