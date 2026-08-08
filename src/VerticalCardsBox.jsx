// START OF FILE: VerticalCardsBox.jsx
import React from 'react';
import { ArrowRight, MonitorPlay, Sparkles, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; 

export default function VerticalCardsBox() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col w-full relative overflow-hidden rounded-[3rem] bg-[#1a1a1a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] py-16 md:py-24 group"
    >
      
      {/* Massive background ambient glow inside the solid box */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Section Title */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 relative z-10 text-center px-4"
      >
        <div className="inline-flex items-center gap-2 border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-orange-500 mb-6 uppercase shadow-[0_0_20px_rgba(249,115,22,0.2)]">
          <Sparkles className="w-4 h-4" /> V8 Master Integrations
        </div>
        <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 drop-shadow-xl">
          Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Solutions</span>
        </h2>
        <p className="text-zinc-400 text-sm md:text-base font-bold uppercase tracking-widest max-w-2xl mx-auto">
          Deploy the ultimate visual infrastructure for your agency.
        </p>
      </motion.div>

      {/* Container for vertical cards */}
      <div className="flex flex-col gap-10 relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8">
        
        {/* FIRST CARD - PREMIUM STOCK PHOTOS (Orange Theme) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative bg-black border border-white/5 hover:border-orange-500/50 transition-all duration-500 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-start gap-6 md:gap-10 shadow-2xl hover:shadow-[0_0_50px_rgba(249,115,22,0.2)] overflow-hidden group/card"
        >
          {/* Card Inner Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[60px] pointer-events-none group-hover/card:bg-orange-500/20 transition-colors duration-700"></div>

          {/* Top Right Badge */}
          <div className="absolute top-8 right-8 border border-orange-500/30 bg-orange-500/10 text-orange-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)] z-20">
            V8 Exclusive
          </div>

          {/* Icon */}
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/5 p-5 rounded-[1.5rem] border border-orange-500/30 shrink-0 shadow-[inset_0_0_20px_rgba(249,115,22,0.2)] relative z-10 mt-2">
            <Layers className="text-orange-500 w-10 h-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          </div>
          
          {/* Content */}
          <div className="flex flex-col w-full relative z-10">
            <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-4 drop-shadow-md pr-24">
              Premium Stock Photos
            </h3>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
              <strong className="text-white">UNLEASH ABSOLUTE VISUAL DOMINANCE.</strong> Elevate your corporate identity with our exclusive, ultra-resolution master stock collection. Commercially cleared and mathematically engineered for elite brands.
            </p>
            
            {/* 🔥 16:9 IMAGE GRID (STOCK) 🔥 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-orange-500/20 shadow-lg group-hover/card:border-orange-500/50 transition-colors duration-500">
                <img src="/vertikal_1.webp" alt="Premium Stock Example 1 - Macro Gears" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-orange-500/20 shadow-lg group-hover/card:border-orange-500/50 transition-colors duration-500">
                <img src="/vertical_2.webp" alt="Premium Stock Example 2 - Jewelry" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            <div className="w-full flex flex-col items-center mt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/stock')}
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.4)] flex items-center justify-center gap-3"
              >
                Explore Stock Market <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* SECOND CARD - PREMIUM SAAS MOCKUPS (Emerald Theme) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="relative bg-black border border-white/5 hover:border-emerald-500/50 transition-all duration-500 rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-start gap-6 md:gap-10 shadow-2xl hover:shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden group/card"
        >
          {/* Card Inner Glow */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover/card:bg-emerald-500/20 transition-colors duration-700"></div>

          {/* Top Right Badge */}
          <div className="absolute top-8 right-8 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)] z-20">
            High Converting
          </div>

          {/* Icon */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 p-5 rounded-[1.5rem] border border-emerald-500/30 shrink-0 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)] relative z-10 mt-2">
            <MonitorPlay className="text-emerald-500 w-10 h-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
          
          {/* Content */}
          <div className="flex flex-col w-full relative z-10">
            <h3 className="text-white text-3xl font-black uppercase tracking-tight mb-4 drop-shadow-md pr-24">
              Premium SaaS Mockups
            </h3>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6 max-w-3xl">
              <strong className="text-white">TRANSFORM YOUR UI INTO PURE REALITY.</strong> Inject your software into jaw-dropping, 150MP cinematic environments. High-converting B2B showrooms built to close enterprise clients instantly.
            </p>
            
            {/* 🔥 16:9 IMAGE GRID (SAAS MOCKUPS) 🔥 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-500/20 shadow-lg group-hover/card:border-emerald-500/50 transition-colors duration-500">
                <img src="/vertical_3.webp" alt="SaaS Mockup Example 1 - Screen Mockup" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-emerald-500/20 shadow-lg group-hover/card:border-emerald-500/50 transition-colors duration-500">
                <img src="/vertical_4.webp" alt="SaaS Mockup Example 2 - Plaque Award" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>

            <div className="w-full flex flex-col items-center mt-2">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  localStorage.setItem('v8_active_mocup_tab', 'ultra2');
                  navigate('/standard-mocup');
                }}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-black text-sm uppercase tracking-widest px-10 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3"
              >
                Enter Showroom <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
// END OF FILE: VerticalCardsBox.jsx