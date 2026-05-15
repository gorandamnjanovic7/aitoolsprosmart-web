import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const V8TiltCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ ...tilt, x: 0, y: 0, isHovered: false });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: tilt.isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.5 }}
      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
      className={`relative ${className}`}
    >
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
         {children}
      </div>
      
      <AnimatePresence>
        {tilt.isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none rounded-[inherit]"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default V8TiltCard;