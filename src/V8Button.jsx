import React from 'react';
import { motion } from 'framer-motion';

const V8Button = ({ label, onClick, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-white/10 ${className}`}
    >
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
      >
        <source src="/v8_btn_carbon_glow_v01.webm" type="video/webm" />
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 px-6 py-3 font-black uppercase tracking-widest text-[14px] text-white flex items-center justify-center">
        {label}
      </div>

      {/* Orange Glow/Border Highlight na hover */}
      <div className="absolute inset-0 border border-[#FF8C00]/0 hover:border-[#FF8C00]/50 transition-colors duration-300 rounded-xl"></div>
    </motion.button>
  );
};

export default V8Button;