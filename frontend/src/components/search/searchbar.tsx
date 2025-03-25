import { useState } from "react";
import magnifyingGlass from "../../assets/magnifying-glass.svg";
import { searchQuery } from "../../services/api";
import { useSearchResult } from "../../contexts/searchResultContext";


const SearchBar: React.FC = (): JSX.Element => {
    const [query, setQuery] = useState<string>('');
    const { setTrackResults } = useSearchResult();

    const handleSubmit = async (e:React.FormEvent):Promise<void> => {
        e.preventDefault()
        if (!query.trim()){
            return
        }
        try {
            searchQuery(query, "soundcloud")
            .then(res => setTrackResults(res.queryData, "soundcloud"))
            .catch(err => console.error("SoundCloud error:", err));

            searchQuery(query, "spotify")
            .then(res => setTrackResults(res.queryData, "spotify"))
            .catch(err => console.error("Spotify error:", err));
        } catch (error) {
            console.error("Error occured trying to query.")
        }

    }
    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className=" flex px-2 py-2 gap-2 sm:w-1/2 md:w-4/6 lg:w-1/2 border border-primary bg-secondary rounded-full text-lg">
                <label htmlFor="query" className="sr-only">Search for a song</label>
                <img src={magnifyingGlass} alt="SVG Icon" width="24" height="24" />
                <input name="query" type='search' className="flex-1 outline-none bg-secondary text-textSecondary" placeholder="Search for a song" onChange={(e) => {setQuery(e.target.value)}}/>
            </form>
        </div>
    )   
}
export default SearchBar;