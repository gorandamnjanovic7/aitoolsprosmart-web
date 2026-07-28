// POČETAK FAJLA: PromptFactoryPromo.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, ChevronRight, Cpu, Sparkles, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PromptFactoryPromo() {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 60 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-[1400px] mx-auto my-24 px-6 relative z-20"
    >
      <motion.div 
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative rounded-[3rem] overflow-hidden border border-blue-500/30 bg-[#030914] shadow-[0_0_80px_rgba(37,99,235,0.15)] group"
      >
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none"></div>
        
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none"
        />

        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-10 lg:p-16 gap-12">
          
          <div className="flex-1 relative z-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 border border-cyan-500/40 bg-cyan-500/10 px-5 py-2 rounded-full text-[11px] font-black text-cyan-400 tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Terminal size={14} /> Algorithmic Blueprints
            </motion.div>

            {/* 🔥 VRAĆEN STARI NASLOV KOJI KIDA 🔥 */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight mb-6 leading-none"
            >
              Synthesize The Future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                Visual DNA
              </span>
            </motion.h2>

            <div className="flex flex-col gap-4 mb-10">
              {/* 🔥 PRVI PASUS (ORIGINALNI) 🔥 */}
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-blue-100/70 text-sm md:text-base max-w-xl font-medium leading-relaxed"
              >
                Stop searching. Start synthesizing. Use the new <strong className="text-cyan-400">Neural Forge</strong> to mathematically engineer custom 3D UI/UX elements. Select your base material, spatial geometry, and cinematic lighting to unlock the exact Google Nano Banana 2 blueprint.
              </motion.p>

              {/* 🔥 DRUGI PASUS (DODATAK ZA MOCKUPE) 🔥 */}
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-blue-100/70 text-sm md:text-base max-w-xl font-medium leading-relaxed"
              >
                <strong className="text-white">V10 Neural Forge:</strong> Engineer hyper-realistic Dark Mode mockups and abstract UI/UX structures. Select your parameters below and the V10 Engine will mathematically forge a master Google Nano Banana 2 blueprint. 150MP premium assets on demand.
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={() => navigate('/neural-forge')}
              className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.4)] group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Enter The Forge <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

          <div className="w-full lg:w-1/3 aspect-square relative flex items-center justify-center">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#06b6d4_70%,transparent_100%)] rounded-full opacity-40 blur-xl"
             />
             <motion.div 
               animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-4 border border-cyan-500/50 rounded-full"
             />
             <motion.div 
               animate={{ y: [-15, 15, -15] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="relative w-3/4 h-3/4 bg-gradient-to-br from-[#050f24] to-[#020510] border-2 border-blue-500/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(37,99,235,0.6)] backdrop-blur-md overflow-hidden group-hover:border-cyan-400 transition-colors duration-500"
             >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-blue-600/20 to-indigo-600/20 blur-md"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px] border border-dashed border-cyan-400/40 rounded-full"
                  />
                  <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-amber-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] animate-pulse" />
                  <Layers className="absolute -bottom-4 -left-4 w-10 h-10 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
                  <Cpu className="w-24 h-24 text-cyan-300 drop-shadow-[0_0_25px_rgba(34,211,238,1)]" />
                </div>
             </motion.div>
          </div>
        </div>
      </motion.div>
      <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
    </motion.div>
  );
}
// KRAJ FAJLA: PromptFactoryPromo.jsx