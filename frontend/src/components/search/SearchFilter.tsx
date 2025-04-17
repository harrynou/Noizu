import {useState} from 'react';
import { useFavoriteContext } from '../../contexts/favoriteContext';

interface SearchFilterProps {
    items:any;
}



const SearchFilter:React.FC<SearchFilterProps> = ({items}): JSX.Element => {
    const [filteredSpotifyTracks, setFilteredSpotifyTracks] = useState<Track[]>([]);
    const {spotifyFavoriteTracks, soundcloudFavoriteTracks} = useFavoriteContext();

    const handleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        setFilteredSpotifyTracks(spotifyFavoriteTracks.filter(track => track.title.toLowerCase().includes(searchValue)));
    };



    return (
        <div>
            <input type='search' onChange={handleChange} className='text-textSecondary'>
            </input>
        </div>
    )
}

export default SearchFilter;