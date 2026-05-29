import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// POCETAK FUNKCIJE: VaultTransition
const VaultTransition = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Okida se na svaku promenu stranice
    setIsVisible(true);
    
    // Tajmer drastično produžen na 2.8 sekundi za onaj spori, teški V8 efekat
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999999] pointer-events-none overflow-hidden">
          
          {/* 1. MRAČNA ZAVESA KOJA SE SPUŠTA (Otkriva ekran tačno iza lasera) */}
          <motion.div
            initial={{ height: "100%" }}
            animate={{ height: "0%" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute bottom-0 w-full bg-[#050505] backdrop-blur-2xl"
          />

          {/* 2. SPORI V8 SKENER LASER (Prati vrh zavese) */}
          <motion.div
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "linear" }}
            className="absolute left-0 w-full h-[3px] bg-orange-500 flex justify-center items-center"
            style={{
              boxShadow: '0 0 30px 10px rgba(249,115,22,0.9), 0 0 60px 20px rgba(249,115,22,0.4)'
            }}
          >
            {/* V8 tekst u centru lasera koji "učitava" stranicu */}
            <span className="text-orange-500 font-black tracking-[1.2em] text-[10px] uppercase drop-shadow-[0_0_12px_rgba(234,88,12,1)] bg-[#050505] px-6 py-1.5 rounded-full border border-orange-500/50">
              V8 SYSTEM RENDER
            </span>
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};
// KRAJ FUNKCIJE: VaultTransition

export default VaultTransition;