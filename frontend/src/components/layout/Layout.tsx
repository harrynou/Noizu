import React from "react";
import QueueManager from "../queue/QueueManager";
import PlaybackControls from "../playback/PlaybackControls";
import Navbar from "../navbar/Navbar";
import Background from "../Background";
import { useMusicPlayer } from "../../contexts/musicPlayerContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { showQueueManager } = useMusicPlayer();

  return (
    <div id="layout" className="flex flex-col min-h-screen">
      <Navbar />
      <Background>
        <div id="Content" className="flex flex-row overflow-hidden relative flex-grow">
          <div
            className={`flex-grow overflow-y-auto transition-all duration-300 ${
              showQueueManager ? "pr-80 md:pr-96" : ""
            }`}>
            {children}
          </div>

          <div
            className={`fixed top-16 right-0 bottom-0 z-10 h-[calc(100vh-80px)] md:h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out transform ${
              showQueueManager ? "translate-x-0" : "translate-x-full"
            }`}>
            <QueueManager />
          </div>
        </div>
      </Background>
      <PlaybackControls />
    </div>
  );
};

export default Layout;
