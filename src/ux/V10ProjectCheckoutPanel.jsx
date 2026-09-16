// FAJL: V10ProjectCheckoutPanel.jsx
import React from 'react';
import { ShoppingCart, Unlock, Video, Image as ImageIcon, FileImage, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

// POČETAK FUNKCIJE: V10ProjectCheckoutPanel
const V10ProjectCheckoutPanel = ({ 
  projectName = "This Project", 
  hasVideo = false, 
  hasPsd = true, 
  imageCount = 0, 
  singlePrice = 450 
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-16 mb-16 px-4 relative">
      
      {/* V8 Ambijentalni odsjaj iza panela */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(255,106,0,0.03)_0%,_transparent_70%)] pointer-events-none z-0"></div>

      <div className="text-center mb-10 relative z-10">
        <h3 className="text-zinc-500 text-[10px] font-black tracking-[0.3em] uppercase flex items-center justify-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-[#ff6a00]" /> Commercial Licensing
        </h3>
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest drop-shadow-md">
          Secure <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff6a00] to-orange-300">Asset</span> Access
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
        
        {/* LEVA KOLONA: Pojedinačna kupovina */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 bg-gradient-to-b from-[#0a0a0a]/90 to-[#020202]/90 backdrop-blur-xl border border-white/5 hover:border-zinc-500/30 rounded-[2rem] p-10 flex flex-col relative group transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_50px_rgba(255,255,255,0.02)]"
        >
          {/* Unutrašnji odsjaj stakla */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-t-[2rem]"></div>

          <div className="mb-8">
            <h4 className="text-zinc-400 text-xs font-black tracking-[0.2em] uppercase mb-3">Single License</h4>
            <div className="text-white text-5xl font-black tracking-tight mb-2 flex items-baseline gap-2">
              ${singlePrice} <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">/ one-time</span>
            </div>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">Lifetime commercial license exclusively for <strong className="text-zinc-300">{projectName}</strong>.</p>
          </div>
          
          <div className="flex-grow mb-10">
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mb-5">What you download:</p>
            <ul className="space-y-4 text-sm text-zinc-400">
              
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <ImageIcon className="w-4 h-4 text-zinc-300" />
                </div>
                <span className="pt-1 leading-relaxed">
                  <strong className="text-white">All {imageCount > 0 ? imageCount : ''} presented images</strong> in 150MP Ultra-Raw + Standard 4K web-ready formats.
                </span>
              </li>
              
              {hasPsd && (
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <FileImage className="w-4 h-4 text-zinc-300" />
                  </div>
                  <span className="pt-1 leading-relaxed"><strong className="text-white">4K Master PSD</strong> + finalized UI/UX design.</span>
                </li>
              )}
              
              {hasVideo && (
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <Video className="w-4 h-4 text-zinc-300" />
                  </div>
                  <span className="pt-1 leading-relaxed"><strong className="text-white">Original Cinematic Video</strong> (watermark-free).</span>
                </li>
              )}
            </ul>
          </div>

          <button className="w-full bg-[#111] hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 active:scale-95 group/btn">
            <ShoppingCart className="w-4 h-4 text-zinc-400 group-hover/btn:text-white transition-colors" /> Secure Single Asset
          </button>
        </motion.div>

        {/* DESNA KOLONA: B2B Retainer Upsell */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="flex-1 bg-gradient-to-b from-[#110500]/95 to-[#050100]/95 backdrop-blur-xl border border-[#ff6a00]/30 hover:border-[#ff6a00] rounded-[2rem] p-10 flex flex-col relative shadow-[0_20px_50px_rgba(255,106,0,0.1)] hover:shadow-[0_20px_60px_rgba(255,106,0,0.2)] group z-10 transition-all duration-500"
        >
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none rounded-t-[2rem]"></div>
          
          {/* Glowing Badge */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff6a00] to-[#ff9d00] text-black text-[10px] font-black px-5 py-1.5 uppercase tracking-[0.2em] rounded-full shadow-[0_0_20px_rgba(255,106,0,0.4)] whitespace-nowrap flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> V8 Smart Upgrade
          </div>
          
          <div className="mb-8 mt-2">
            <h4 className="text-[#ff6a00] text-xs font-black tracking-[0.2em] uppercase mb-3">B2B Retainer</h4>
            <div className="text-white text-5xl font-black tracking-tight mb-2 flex items-baseline gap-2">
              $200 <span className="text-[#ff6a00]/70 text-xs font-bold uppercase tracking-widest">/ month</span>
            </div>
            <p className="text-zinc-400 text-sm font-medium">Why pay ${singlePrice} for a single asset?</p>
          </div>
          
          <div className="flex-grow mb-10 flex items-center">
            <p className="text-lg text-zinc-300 font-medium leading-relaxed border-l-2 border-[#ff6a00]/50 pl-5">
              Unlock <strong className="text-white">{projectName}</strong> and download <strong className="text-[#ff6a00]">2 more V10 projects</strong> of your choice today, via our dedicated B2B engineering retainer.
            </p>
          </div>

          <button className="w-full bg-gradient-to-r from-[#ff6a00] to-[#e65c00] text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)] hover:scale-[1.02] active:scale-95 group/btn">
            <Unlock className="w-4 h-4" /> Unlock 3 Projects <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
          </button>
        </motion.div>

      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: V10ProjectCheckoutPanel

export default V10ProjectCheckoutPanel;