// POČETAK FAJLA: V8PageTransition.jsx
import React from 'react';
import { motion } from 'framer-motion';

const V8PageTransition = ({ children }) => {
  return (
    <>
      {/* 1. SADRŽAJ STRANICE (Ovde ide tvoj Showroom, Dashboard itd.) */}
      {/* Dodali smo blagi fade-in za samu stranicu dok skener prelazi */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
      </motion.div>

      {/* 2. V8 SUPERCOMPUTER SKENER (Zavesa koja pada) */}
      <motion.div
    className="fixed left-0 w-full h-[120vh] bg-[#050505] z-[9999] pointer-events-none"
    initial={{ top: "-10vh" }} 
    animate={{ top: "110vh" }} 
    transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
    // DODAJ OVO ISPOD:
    onAnimationComplete={() => {
        const el = document.querySelector('.z-\\[9999\\]');
        if (el) el.style.display = 'none';
    }}
>
        {/* 🔥 TANKA NARANDŽASTA LASERSKA LINIJA NA VRHU ZAVESE 🔥 */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-[#FF8C00] shadow-[0_0_20px_#FF8C00,0_0_40px_#FF8C00,0_0_60px_#FF8C00]"></div>
        
        {/* STAKLENI MRAČNI ODSJAJ ISPOD LASERA (kao da baca svetlost na tamu) */}
        <div className="absolute top-[2px] left-0 w-full h-40 bg-gradient-to-b from-[#FF8C00]/20 via-[#FF8C00]/5 to-transparent"></div>

        {/* HARDVERSKI TEKST KOJI PUTUJE NA DOLE SA SKENEROM */}
        <div className="absolute top-12 w-full text-center text-[#FF8C00] font-black text-[10px] tracking-[0.5em] uppercase opacity-40 animate-pulse">
          [ V8 SYSTEM OVERRIDE • RENDERING INTERFACE ]
        </div>
      </motion.div>
    </>
  );
};

export default V8PageTransition;
// KRAJ FAJLA: V8PageTransition.jsx