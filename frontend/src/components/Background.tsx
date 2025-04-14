import React, { memo, useEffect } from 'react';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = memo(({ children }) => {
  useEffect(() => {
    // Set overscroll background to match your theme
    document.body.style.backgroundColor = '#0f172a';
    document.documentElement.style.backgroundColor = '#0f172a';
  }, []);
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 overflow-hidden will-change-transform"
        style={{ contain: 'strict' }}
        >
        {/* Original Blobs */}
        <div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 bg-blue will-change-transform"
          style={{ 
            filter: 'blur(7rem)',
            transform: 'translate3d(-50%, -50%, 0)'
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-[35rem] h-[35rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-20 bg-purple will-change-transform"
          style={{ 
            filter: 'blur(7rem)',
            animationDelay: '-2s',
            transform: 'translate3d(33%, -33%, 0)'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] -translate-x-1/2 translate-y-1/4 rounded-full opacity-20 bg-pink animate-blob-shift will-change-transform"
          style={{ 
            filter: 'blur(7rem)',
            animationDelay: '-5s',
            transform: 'translate3d(-50%, 25%, 0)'
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-[45rem] h-[45rem] translate-x-1/3 translate-y-1/3 rounded-full opacity-20 bg-indigo will-change-transform"
          style={{ 
            filter: 'blur(7rem)',
            animationDelay: '-7s',
            transform: 'translate3d(33%, 33%, 0)'
          }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full opacity-15 bg-cyan will-change-transform"
          style={{ 
            filter: 'blur(6rem)',
            animationDelay: '-3s',
            transform: 'translate3d(-25%, -25%, 0)'
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/4 w-[32rem] h-[32rem] rounded-full opacity-15 bg-emerald will-change-transform"
          style={{ 
            filter: 'blur(6.5rem)',
            animationDelay: '-1s',
            transform: 'translate3d(15%, -30%, 0)'
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/5 w-[36rem] h-[36rem] rounded-full opacity-15 bg-amber will-change-transform"
          style={{ 
            filter: 'blur(7.5rem)',
            animationDelay: '-4s',
            transform: 'translate3d(-15%, 20%, 0)'
          }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/2 w-[25rem] h-[25rem] rounded-full opacity-15 bg-rose will-change-transform"
          style={{ 
            filter: 'blur(5.5rem)',
            animationDelay: '-6s',
            transform: 'translate3d(45%, -15%, 0)'
          }}
        ></div>
      </div>
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </div>
  );
});


export default Background;