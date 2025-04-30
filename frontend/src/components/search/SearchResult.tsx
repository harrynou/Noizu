import ItemCard from "./ItemCard";
import { useSearchResult } from "../../contexts/searchResultContext";


const SearchResult = (): JSX.Element => {
    const { spotifyTracks, soundcloudTracks} =  useSearchResult();
    const Items = ({data, provider}: {data: any[], provider: string}) => {
        return (
        <ul className="flex flex-col">
            {data.map((item) => (
                <ItemCard key={item.id} item={item} provider={provider} ></ItemCard>
            ))}
        </ul>)
    }
    return (
    <div id="Results Container" className="">
        <div className="border-2 border-black h-[70vh]">
            {/* Parent Results Containers */}
            <div className="bg-slate-50 grid auto-cols-auto border-2 border-white h-full gap-4">
                {/* Spotify Results Items */}
                <div className="flex-1 overflow-auto">
                {spotifyTracks ? (
                    <Items data={spotifyTracks} provider="spotify" />
                ) : (
                    <p>No Spotify results found.</p>
                )}
                </div>
                {/* Soundcloud Results Items */}
                <div className="flex-1 overflow-auto">
                    {soundcloudTracks ? (
                        <Items data={soundcloudTracks} provider="soundcloud"/>
                    ) : (
                        <p>No SoundCloud results found.</p>
                    )}
                </div>
            </div>
        </div>
    </div>
    )

}

export default SearchResult