// POČETAK FAJLA: V8RadarCursor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const V8RadarCursor = () => {
  // 1. REF umesto State-a ili MotionValue-a! 
  // Ovo nam omogućava da direktno gađamo element mimo React-a.
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const updateMousePosition = (e) => {
      if (cursorRef.current) {
        // 2. SIROVI JAVASCRIPT: Nema kalkulacija, nema redova čekanja.
        // translate3d forsira grafičku karticu da preuzme posao.
        cursorRef.current.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
      }
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, summary, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // passive: true je ključno za 0 kašnjenja
    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    // 3. SPOLJNI OMOTAČ (Samo za pomeranje, bez Framer Motiona)
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[99999999]"
      style={{ willChange: 'transform' }}
    >
      {/* 4. UNUTRAŠNJI OMOTAČ (Framer Motion zadužen isključivo za hover dizajn) */}
      <motion.div
        className="w-10 h-10 border-[3px] border-[#FF8C00] rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(255,140,0,0.8)]"
        animate={{
          scale: isHovering ? 1.6 : 1,
          backgroundColor: isHovering ? 'rgba(255, 140, 0, 0.25)' : 'transparent',
        }}
        transition={{ duration: 0.15 }} // Ovo sada utiče samo na boju, a ne na poziciju
      >
        <div className={`w-1.5 h-1.5 bg-[#FF8C00] rounded-full shadow-[0_0_8px_#FF8C00] transition-opacity duration-200 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
      </motion.div>
    </div>,
    document.body
  );
};

export default V8RadarCursor;
// KRAJ FAJLA: V8RadarCursor.jsx