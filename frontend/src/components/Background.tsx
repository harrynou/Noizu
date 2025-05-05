import React, { memo, useEffect } from 'react';

interface BackgroundProps {
  children: React.ReactNode;
}

const Background = memo(({ children }: BackgroundProps) => {
  useEffect(() => {
    // Set overscroll background to match your theme
    document.body.style.backgroundColor = '#0f172a';
    document.documentElement.style.backgroundColor = '#0f172a';
    return () => {
      document.body.style.backgroundColor = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, []);
  return (
    <div className="relative flex-1 overflow-hidden bg-slate-900">
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ contain: 'strict' }}
        >
        {/* Original Blobs */}
        <div 
          className="absolute top-0 left-0 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 bg-blue"
          style={{ 
            filter: 'blur(7rem)',
          }}
        ></div>
        <div 
          className="absolute top-0 right-0 w-[35rem] h-[35rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-20 bg-purple"
          style={{ 
            filter: 'blur(7rem)',
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 w-[30rem] h-[30rem] -translate-x-1/2 translate-y-1/4 rounded-full opacity-20 bg-pink"
          style={{ 
            filter: 'blur(7rem)',
          }}
        ></div>
        <div 
          className="absolute bottom-0 right-0 w-[45rem] h-[45rem] translate-x-1/3 translate-y-1/3 rounded-full opacity-20 bg-indigo"
          style={{ 
            filter: 'blur(7rem)',
          }}
        ></div>
        <div 
          className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] rounded-full opacity-15 bg-cyan"
          style={{ 
            filter: 'blur(6rem)',
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/4 w-[32rem] h-[32rem] rounded-full opacity-15 bg-emerald"
          style={{ 
            filter: 'blur(6.5rem)',
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 left-1/5 w-[36rem] h-[36rem] rounded-full opacity-15 bg-amber"
          style={{ 
            filter: 'blur(7.5rem)',
          }}
        ></div>
        <div 
          className="absolute top-2/3 right-1/2 w-[25rem] h-[25rem] rounded-full opacity-15 bg-rose"
          style={{ 
            filter: 'blur(5.5rem)',
          }}
        ></div>
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});


export default Background;