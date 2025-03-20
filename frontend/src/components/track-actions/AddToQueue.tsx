import { useAuth } from "../../contexts/authContext";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";
import { Track } from "../../contexts/musicPlayerContext";
import AddToQueueSVG from '../../assets/AddToQueue.svg';


interface AddToQueueProp {
    track:Track
}

const AddToQueueAction: React.FC<AddToQueueProp> = ({track}): JSX.Element => {
    const { isAuthenticated } = useAuth();
    const { addToQueue } = useMusicPlayer();


    const handleAddToQueue = () => {
        addToQueue(track);
    };




    return (
        <div>
            {(isAuthenticated || track.provider === 'soundcloud') ? <img className='w-6 h-6 hover:cursor-pointer hover:opacity-50' onClick={handleAddToQueue} src={AddToQueueSVG}/> : null}
        </div>
    )
}

export default AddToQueueAction