import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

const V8RadarCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // V8 zaštita
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.closest('button, a, summary, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-2 border-[#FF8C00] rounded-full pointer-events-none flex items-center justify-center shadow-[0_0_15px_rgba(255,140,0,0.5)]"
      style={{ zIndex: 99999999 }}
      animate={{
        x: mousePosition.x - 16,
        y: mousePosition.y - 16,
        scale: isHovering ? 1.8 : 1,
        backgroundColor: isHovering ? 'rgba(255, 140, 0, 0.15)' : 'transparent',
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
    >
      <div className={`w-1 h-1 bg-[#FF8C00] rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
    </motion.div>,
    document.body
  );
};

export default V8RadarCursor;
