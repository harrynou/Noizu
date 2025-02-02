import { useEffect } from "react";
import ItemCard from "./ItemCard";


interface SearchResultsProps {
    spotifySearchResults: SearchResultsData | null;
    soundcloudSearchResults: SearchResultsData | null;
}

interface SearchResultsData {
    queryData: any[];
}

const SearchResults: React.FC<SearchResultsProps> = ({spotifySearchResults, soundcloudSearchResults}): JSX.Element => {
    
    const Items = ({data, provider}: {data: any[], provider: string}) => {
        return (
        <ul className="flex flex-col gap-2">
            {data.map((item) => (
                <ItemCard key={item.id} item={item} provider={provider}></ItemCard>
            ))}
        </ul>)
    }
    return (
    <div>
        {spotifySearchResults ? (
            <Items data={spotifySearchResults.queryData} provider="spotify" />
        ) : (
            <p>No Spotify results found.</p>
        )}

        {soundcloudSearchResults ? (
            <Items data={soundcloudSearchResults.queryData} provider="soundcloud"/>
        ) : (
            <p>No SoundCloud results found.</p>
        )}
    </div>
    )

}

export default SearchResults