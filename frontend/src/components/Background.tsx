import React from 'react';
  
  interface BackgroundProps {
    children: React.ReactNode;
  }
  
  const Background: React.FC<BackgroundProps> = ({ children}) => {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute top-0 left-0 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 bg-tw-blue"
            style={{ filter: 'blur(7rem)' }}
          ></div>
          <div 
            className="absolute top-0 right-0 w-[35rem] h-[35rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-20 bg-tw-purple"
            style={{ filter: 'blur(7rem)', animationDelay: '-2s' }}
          ></div>
          <div 
            className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] -translate-x-1/2 translate-y-1/4 rounded-full opacity-20 bg-tw-pink animate-blob-shift"
            style={{ filter: 'blur(7rem)', animationDelay: '-5s' }}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-[45rem] h-[45rem] translate-x-1/3 translate-y-1/3 rounded-full opacity-20 bg-tw-indigo "
            style={{ filter: 'blur(7rem)', animationDelay: '-7s' }}
          ></div>
        </div>


        {/* Content container with a subtle backdrop blur */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </div>
    );
  };

export default Background