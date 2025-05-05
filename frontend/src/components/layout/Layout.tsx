import QueueManager from "../playback/QueueManager";
import PlaybackControls from "../playback/PlaybackControls";
import Navbar from "../navbar/Navbar";
import Background from "../Background";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({children}:LayoutProps): JSX.Element => {
const {showQueueManager} = useMusicPlayer();

  return (
    <div id='layout' className="flex flex-col min-h-screen">
      <Navbar/>
      <Background>
          <div id="Content" className="flex flex-row overflow-y-auto">
            <div className="flex-grow">
            {children}
            </div>
            {showQueueManager && <QueueManager/>}
          </div>
      </Background>
      {<PlaybackControls/>}
      
    </div>
  )
}

export default Layout;