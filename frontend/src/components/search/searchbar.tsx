import { useState } from "react";
import magnifyingGlass from "../../assets/magnifying-glass.svg";
import { searchQuery } from "../../services/api";

const SearchBar: React.FC = (): JSX.Element => {
    const [query, setQuery] = useState<string>('');

    const handleSubmit = async (e:React.FormEvent):Promise<void> => {
        e.preventDefault()
        if (!query.trim()){
            return
        }
        try {
            const response = await searchQuery(query)
            console.log(response)
        } catch (error) {
            console.log(error)
            console.error("Error occured trying to query.")
        }

    }
    


    return (
        <form onSubmit={handleSubmit} className=" flex px-2 py-2 gap-2 border border-primary rounded-full text-lg">
            <label htmlFor="query" className="sr-only">Search for a song</label>
            <img src={magnifyingGlass} alt="SVG Icon" width="24" height="24" />
            <input name="query" type='search' className="outline-none" placeholder="Search for a song" onChange={(e) => {setQuery(e.target.value)}}/>
        </form>
    )   
}

export default SearchBar;