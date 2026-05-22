// UgcAvatar.jsx
// Početak funkcije UgcAvatar
import React from 'react';

const UgcAvatar = () => {
  return (
    <div className="fixed bottom-6 right-6 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-orange-500 shadow-[0_0_20px_rgba(255,165,0,0.6)] z-50 cursor-pointer hover:scale-105 transition-transform duration-300">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover bg-black"
      >
        {/* Samo ovo promeni: */}
        <source src={window.location.origin + "/v8-adriana.mp4"} type="video/mp4" />
        Vaš pretraživač ne podržava video tag.
      </video>
    </div>
  );
};

export default UgcAvatar;
// Kraj funkcije UgcAvatar