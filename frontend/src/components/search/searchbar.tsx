import { useState } from "react";
import magnifyingGlass from "../../assets/magnifying-glass.svg";
import { searchQuery } from "../../services/api";

interface SearchBarProps {
    setSpotifySearchResults: (data:any) => void;
    setSoundcloudSearchResults: (data:any) => void;
}


const SearchBar: React.FC<SearchBarProps> = ({setSpotifySearchResults, setSoundcloudSearchResults}): JSX.Element => {
    const [query, setQuery] = useState<string>('');

    const handleSubmit = async (e:React.FormEvent):Promise<void> => {
        e.preventDefault()
        if (!query.trim()){
            return
        }
        try {
        setSpotifySearchResults(await searchQuery(query, 'spotify'));
        setSoundcloudSearchResults(await searchQuery(query,'soundcloud'));
        } catch (error) {
            console.error("Error occured trying to query.")
        }

    }
    return (
        <div className="flex justify-center items-center">
            <form onSubmit={handleSubmit} className=" flex px-2 py-2 gap-2 sm:w-1/2 md:w-4/6 lg:w-1/2 border border-primary rounded-full text-lg">
                <label htmlFor="query" className="sr-only">Search for a song</label>
                <img src={magnifyingGlass} alt="SVG Icon" width="24" height="24" />
                <input name="query" type='search' className="flex-1 outline-none" placeholder="Search for a song" onChange={(e) => {setQuery(e.target.value)}}/>
            </form>
        </div>
    )   
}
export default SearchBar;