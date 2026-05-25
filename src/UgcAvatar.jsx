// POČETAK FUNKCIJE: UgcAvatar
import React from 'react';

const UgcAvatar = () => {
  return (
    <div className="fixed bottom-6 right-6 z-[6000] w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
      
      {/* 🎯 KONTEJNER OKVIRA: Čist CSS oktagon sa neon sjajem 🎯 */}
      <div 
        className="absolute inset-0 z-10 border-[6px] border-zinc-800 shadow-[0_0_15px_rgba(234,88,12,0.5)] flex items-center justify-center"
        style={{ 
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" 
        }}
      >
        {/* Unutrašnji neon okvir */}
        <div className="absolute inset-1 border-2 border-orange-600/50" style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}></div>
      </div>

      {/* 🎯 VIDEO KONTEJNER: Sečemo video u isti oblik 🎯 */}
      <div 
        className="absolute w-[88%] h-[88%] overflow-hidden flex items-center justify-center z-0 bg-black"
        style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={window.location.origin + "/v8-adriana.mp4"} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default UgcAvatar;
// KRAJ FUNKCIJE: UgcAvatar