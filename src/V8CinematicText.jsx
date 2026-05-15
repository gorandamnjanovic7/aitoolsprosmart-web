import React from 'react';
import { motion } from 'framer-motion';

const V8CinematicText = ({ text, className = "", delay = 0 }) => {
  const letters = Array.from(text);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: delay } },
  };
  const letterVariants = {
    hidden: { opacity: 0, x: -20, filter: "blur(10px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", damping: 12, stiffness: 200 } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className={`inline-block ${className}`}>
      {letters.map((letter, index) => (
        <motion.span key={index} variants={letterVariants} className="inline-block" style={{ whiteSpace: letter === " " ? "pre" : "normal" }}>
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
export default V8CinematicText;