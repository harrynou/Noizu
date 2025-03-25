import SearchBar from "../components/search/SearchBar"
import SearchResult from "../components/search/SearchResult"



const HomePage: React.FC = (): JSX.Element => {
    return (
        <div className="flex flex-col p-2 gap-2 flex-grow">
        <SearchBar/>
        <SearchResult/>
        </div>
    )
} 


export default HomePage