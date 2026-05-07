import { motion } from 'framer-motion';

export default function V8Reveal({ children, delay = 0, direction = "up" }) {
  // Određujemo odakle element "dolazi"
  const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-15%" }} // Aktivira se tek kad element uđe 15% u ekran
      transition={{ 
        duration: 0.7, 
        delay: delay, 
        ease: [0.25, 0.46, 0.45, 0.94] // Specijalni "smooth" premium V8 prelaz
      }}
    >
      {children}
    </motion.div>
  );
}