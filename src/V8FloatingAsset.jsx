import React from 'react';
import { motion } from 'framer-motion';

const V8FloatingAsset = ({ videoSrc, title, price, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative group w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-4 cursor-pointer overflow-hidden shadow-2xl"
      onClick={onClick}
    >
      {/* Glow effect na hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]"></div>
      
      {/* Video Container */}
      <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-4 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        >
          <source src={videoSrc} type="video/webm" />
        </video>
        
        {/* Overlay gradient za tekst */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-2">
        <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-1 group-hover:text-[#FF8C00] transition-colors">
          {title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-blue-400 font-bold text-[12px] uppercase">Premium Asset</span>
          <span className="text-[#FF8C00] font-black text-[16px]">${price}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default V8FloatingAsset;