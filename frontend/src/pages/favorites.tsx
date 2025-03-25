import ItemCard from "../components/search/ItemCard"
import { useFavoriteContext } from "../contexts/favoriteContext"

const FavoritesPage: React.FC = () : JSX.Element => {
    const { spotifyFavoriteTracks, soundcloudFavoriteTracks } = useFavoriteContext();
    const Items = ({data, provider}: {data: any[], provider: string}) => {
        return (
        <ul className="flex flex-col">
            {data.map((item) => (
                <ItemCard key={item.id} item={item} provider={provider} ></ItemCard>
            ))}
        </ul>)
    }
    return (
        
        <div>
            <div className="border-2 border-black h-[70vh]">
            <Items data={spotifyFavoriteTracks} provider='spotify' />
            <Items data={soundcloudFavoriteTracks} provider='soundcloud' />
            </div>
        </div>

    )
}

export default FavoritesPage