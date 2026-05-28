import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// POCETAK FUNKCIJE: VaultTransition
const VaultTransition = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Kada klijent promeni stranicu, zalupimo "vrata sefa"
    setIsVisible(true);
    // Posle 800ms (dovoljno da React učita novu stranicu u pozadini), otvaramo ih
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [location.pathname]); // Okidač je svaka promena URL-a

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[9999999] pointer-events-none flex flex-col">
          {/* Gornja vrata sefa */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-1/2 w-full bg-[#050505] border-b-[4px] border-orange-500 shadow-[0_30px_60px_rgba(234,88,12,0.2)] flex items-end justify-center pb-8"
          >
             <span className="text-orange-500/70 font-black tracking-[1.5em] text-[10px] uppercase drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]">V8 SECURE</span>
          </motion.div>
          
          {/* Donja vrata sefa */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-1/2 w-full bg-[#050505] border-t-[4px] border-orange-500 shadow-[0_-30px_60px_rgba(234,88,12,0.2)] flex items-start justify-center pt-8"
          >
             <span className="text-orange-500/70 font-black tracking-[1.5em] text-[10px] uppercase drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]">CONNECTION</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
// KRAJ FUNKCIJE: VaultTransition

export default VaultTransition;