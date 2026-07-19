// POČETAK FAJLA: SaasPromo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';
import V8TiltCard from './V8TiltCard';
import V8CinematicText from './v8-ui-components/V8CinematicText';

const SaasPromo = () => {
  return (
    <div id="saas-promo" className="mb-24 flex flex-col items-center justify-center text-center pt-10 pb-20 relative overflow-hidden scroll-mt-32">
      
      {/* HEADER SEKCIJA */}
      <V8Reveal delay={0.2} direction="up">
        <div className="relative w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden py-16 px-6 mb-16 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.15)] group">
          <div className="absolute inset-0 z-0">
            <img src="/v8-stock/v8-master-bg.jpg" alt="V10 SaaS Background" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000 grayscale-[30%]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-amber-900/20 to-[#050505]"></div>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-amber-600/20 p-4 rounded-full mb-6 relative z-10 inline-block backdrop-blur-md border border-amber-500/30">
              <Layers className="w-10 h-10 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" strokeWidth={1.5} />
            </div>

            <V8CinematicText text="V10 150MP SAAS PROTOCOL" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(245,158,11,0.6)]" delay={0.2} />
            
            <div className="text-[13px] md:text-[15px] font-black text-white uppercase tracking-[0.2em] mb-4 drop-shadow-md">The Ultimate B2B Visual Expansion.</div>
            
            <p className="text-zinc-200 text-[10px] md:text-[12px] max-w-3xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-6 mx-auto px-4 drop-shadow-lg">
              <span className="font-black text-white">WRAP YOUR SOFTWARE IN 150MP PHYSICAL REALITY ENGINEERED WITH V10 ALGORITHMS.</span><br /><br />
              <span className="text-amber-300 font-black uppercase">WE MATHEMATICALLY MAP YOUR FIGMA UI SCREENS ONTO HYPER-REALISTIC HARDWARE ENVIRONMENTS. STOP LOSING ENTERPRISE DEALS BECAUSE YOUR MOCKUPS LOOK GENERIC.</span>
            </p>
          </div>
        </div>
      </V8Reveal>

      {/* GRID SA KARTICAMA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-6 relative z-10 max-w-6xl mx-auto overflow-hidden md:overflow-visible py-4">
        
        {/* Paket 1 */}
        <motion.div className="relative group">
          <motion.div className="absolute -inset-4 rounded-[3rem] bg-amber-600/30 blur-2xl pointer-events-none z-0" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4, repeat: Infinity }} />
          <V8TiltCard className="rounded-[2rem] h-full relative z-10">
            <motion.div 
              className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-amber-500/50 transition-all shadow-2xl flex flex-col items-start text-left h-full"
              animate={{ boxShadow: ["0 0 0px rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.2)", "0 0 0px rgba(245,158,11,0)"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                {/* 🔥 ZOOM ANIMACIJA SLIKE 🔥 */}
                <motion.img 
                  src="/mocup_1.webp" 
                  alt="Startup" 
                  className="w-full h-full object-cover" 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute top-3 right-3 bg-amber-600 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">3-5 RENDERS</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Startup Launch</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Standard 150MP Environments</p>
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-2xl font-black text-white">$400</span>
                <Link to="/saas-protocol" className="px-6 py-3 bg-white/5 hover:bg-amber-500 text-white hover:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-amber-500">VIEW PROTOCOL</Link>
              </div>
            </motion.div>
          </V8TiltCard>
        </motion.div>

        {/* Paket 2 */}
        <motion.div className="md:-translate-y-4 relative group">
          <motion.div className="absolute -inset-4 rounded-[3rem] bg-orange-600/40 blur-2xl pointer-events-none z-0" animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 3.5, repeat: Infinity }} />
          <V8TiltCard className="rounded-[2rem] h-full relative z-10">
            <motion.div 
              className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2rem] p-5 hover:border-orange-500 transition-all shadow-[0_0_30px_rgba(234,88,12,0.15)] flex flex-col items-start text-left h-full relative overflow-hidden group"
              animate={{ boxShadow: ["0 0 15px rgba(234,88,12,0.15)", "0 0 35px rgba(234,88,12,0.3)", "0 0 15px rgba(234,88,12,0.15)"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl z-20 shadow-[0_5px_15px_rgba(234,88,12,0.5)]">GOLD STANDARD</div>
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5 mt-2">
                {/* 🔥 ZOOM ANIMACIJA SLIKE (Obrnut redosled da ne idu isto) 🔥 */}
                <motion.img 
                  src="/mocup_2.webp" 
                  alt="Enterprise" 
                  className="w-full h-full object-cover" 
                  animate={{ scale: [1.05, 1, 1.05] }}
                  transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">10-15 RENDERS</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2 relative z-10">Enterprise Suite</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6 relative z-10">Custom Cinematic Environments</p>
              <div className="mt-auto w-full flex items-center justify-between relative z-10">
                <span className="text-2xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]">$1,500</span>
                <Link to="/saas-protocol" className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)]">DEPLOY PROTOCOL</Link>
              </div>
            </motion.div>
          </V8TiltCard>
        </motion.div>

        {/* Paket 3 */}
        <motion.div className="relative group">
          <motion.div className="absolute -inset-4 rounded-[3rem] bg-amber-600/30 blur-2xl pointer-events-none z-0" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4.5, repeat: Infinity }} />
          <V8TiltCard className="rounded-[2rem] h-full relative z-10">
            <motion.div 
              className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-amber-500/50 transition-all shadow-2xl flex flex-col items-start text-left h-full"
              animate={{ boxShadow: ["0 0 0px rgba(245,158,11,0)", "0 0 20px rgba(245,158,11,0.2)", "0 0 0px rgba(245,158,11,0)"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                {/* 🔥 ZOOM ANIMACIJA SLIKE 🔥 */}
                <motion.img 
                  src="/mocup_3.webp" 
                  alt="Agency" 
                  className="w-full h-full object-cover" 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />
                <div className="absolute top-3 right-3 bg-amber-600 text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">10 / MONTH</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Agency Retainer</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Dedicated Monthly Architect</p>
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-2xl font-black text-white">$1,000</span>
                <Link to="/saas-protocol" className="px-6 py-3 bg-white/5 hover:bg-amber-500 text-white hover:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-amber-500">PARTNER UP</Link>
              </div>
            </motion.div>
          </V8TiltCard>
        </motion.div>
      </div>

      <V8Reveal delay={0.6} direction="up">
        <div className="mt-14 relative z-10">
          <Link to="/saas-protocol" className="inline-flex items-center gap-3 text-zinc-400 hover:text-white text-[12px] font-black uppercase tracking-widest transition-all group">
            EXPLORE SAAS PROTOCOL <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform text-amber-500" />
          </Link>
        </div>
      </V8Reveal>
    </div>
  );
};
export default SaasPromo;
// KRAJ FAJLA: SaasPromo.jsx