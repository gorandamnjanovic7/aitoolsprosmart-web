import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// POCETAK FUNKCIJE: V8IdleProtocol
const V8IdleProtocol = () => {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const isIdleRef = useRef(false);

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false);
      isIdleRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      // Podesi vreme čekanja na 40 sekundi (40000 ms)
      timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        isIdleRef.current = true;
      }, 300000);
    };

    const handleActivity = () => {
      const now = Date.now();
      
      // Ako nismo u screensaveru (isIdleRef je false) i prečesto mrdamo miša, ignoriši.
      // Ako jesmo u screensaveru, momentalno ga gasi bez ignorisanja.
      if (!isIdleRef.current && now - lastActivityRef.current < 500) {
        return;
      }
      
      lastActivityRef.current = now;
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity, { passive: true });
    window.addEventListener('keydown', handleActivity, { passive: true });
    window.addEventListener('scroll', handleActivity, { passive: true });
    window.addEventListener('touchstart', handleActivity, { passive: true });

    // Pokreni tajmer odmah
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []); // OVDE JE BILA GREŠKA - Sada je prazan array kako se ne bi beskonačno restartovao

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999998] bg-black flex items-center justify-center pointer-events-none"
        >
          {/* U pozadini se pušta onaj tvoj cinematic render */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          >
            <source src="/v8-vault-bg.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/90" />
          
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-700 tracking-[0.2em] uppercase drop-shadow-[0_0_30px_rgba(234,88,12,0.4)]">
              V8 VAULT
            </h2>
            <p className="mt-8 text-zinc-400 font-mono text-[10px] md:text-xs uppercase tracking-[0.6em] animate-pulse">
              SYSTEM IDLE • MOTION DETECTORS ACTIVE
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// KRAJ FUNKCIJE: V8IdleProtocol

export default V8IdleProtocol;