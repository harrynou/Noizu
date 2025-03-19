import { useState } from "react"
import SearchBar from "../components/search/SearchBar"
import SearchResults from "../components/search/SearchResults"

const HomePage: React.FC = (): JSX.Element => {
    const [spotifySearchResults, setSpotifySearchResults] = useState<any>(null);
    const [soundcloudSearchResults, setSoundcloudSearchResults] = useState<any>(null);

    return (
        <div className="flex flex-col p-2 gap-2 flex-grow">
        <SearchBar setSpotifySearchResults={setSpotifySearchResults} setSoundcloudSearchResults={setSoundcloudSearchResults}/>
        <SearchResults spotifySearchResults={spotifySearchResults} soundcloudSearchResults={soundcloudSearchResults}/>
        </div>
    )
} 


export default HomePage