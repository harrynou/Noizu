import { useState } from "react"
import SearchBar from "../components/search/SearchBar"
import SearchResults from "../components/search/SearchResults"



const HomePage: React.FC = (): JSX.Element => {
    const [spotifySearchResults, setSpotifySearchResults] = useState<any[]>([]);
    const [soundcloudSearchResults, setSoundcloudSearchResults] = useState<any[]>([]);
    

    const toggleFavorite = (trackId:string, provider: string) => {
        if (provider === 'spotify'){
            setSpotifySearchResults(prevState => (prevState || []).map(item => item.id === trackId ? { ...item, isFavorited: !item.isFavorited } : item))
        } else if (provider === 'soundcloud'){
            setSoundcloudSearchResults(prevState => (prevState || []).map(item => item.id === trackId ? { ...item, isFavorited: !item.isFavorited } : item))
        }
    }

    return (
        <div className="flex flex-col p-2 gap-2 flex-grow">
        <SearchBar setSpotifySearchResults={setSpotifySearchResults} setSoundcloudSearchResults={setSoundcloudSearchResults}/>
        <SearchResults spotifySearchResults={spotifySearchResults} soundcloudSearchResults={soundcloudSearchResults} toggleFavorite={toggleFavorite}/>
        </div>
    )
} 


export default HomePage