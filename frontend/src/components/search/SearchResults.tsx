import ItemCard from "./ItemCard";


interface SearchResultsProps {
    spotifySearchResults: any[] | [];
    soundcloudSearchResults: any[] | [];
    toggleFavorite: (trackId: string, provider: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({spotifySearchResults, soundcloudSearchResults, toggleFavorite}): JSX.Element => {
    
    const Items = ({data, provider}: {data: any[], provider: string}) => {
        return (
        <ul className="flex flex-col">
            {data.map((item) => (
                <ItemCard key={item.id} item={item} provider={provider} toggleFavorite={toggleFavorite}></ItemCard>
            ))}
        </ul>)
    }
    return (
    <div id="Results Container" className="">
        <div className="border-2 border-black h-[70vh]">
            {/* Parent Results Containers */}
            <div className=" flex border-2 border-white h-full gap-4">
                {/* Tabs */}
                <div>

                </div>
                {/* Spotify Results Items */}
                <div className="flex-1 overflow-auto">
                {spotifySearchResults ? (
                    <Items data={spotifySearchResults} provider="spotify" />
                ) : (
                    <p>No Spotify results found.</p>
                )}
                </div>
                {/* Soundcloud Results Items */}
                <div className="flex-1 overflow-auto">
                    {soundcloudSearchResults ? (
                        <Items data={soundcloudSearchResults} provider="soundcloud"/>
                    ) : (
                        <p>No SoundCloud results found.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    )

}

export default SearchResults