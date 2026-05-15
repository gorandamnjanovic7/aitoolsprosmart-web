import React from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';
import V8Reveal from './V8Reveal';
import V8TiltCard from './V8TiltCard';
import V8CinematicText from './V8CinematicText';

const StockBundles = () => {
  return (
    <div id="stock-bundles" className="mb-24 flex flex-col items-center justify-center text-center pt-10 pb-20 relative overflow-hidden scroll-mt-32">
      <V8Reveal delay={0.2} direction="up">
        <div className="relative w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden py-16 px-6 mb-16 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.15)] group">
          <div className="absolute inset-0 z-0">
            <img src="/v8-stock/v8_stock.webp" alt="V8 Premium Stock Background" className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-blue-900/30 to-[#050505]"></div>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-blue-600/20 p-4 rounded-full mb-6 relative z-10 inline-block backdrop-blur-md border border-blue-500/30">
              <ImageIcon className="w-10 h-10 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" strokeWidth={1.5} />
            </div>
            <V8CinematicText text="PREMIUM STOCK BUNDLES" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-blue-400 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" delay={0.2} />
            <div className="text-[13px] md:text-[15px] font-black text-white uppercase tracking-[0.2em] mb-4 drop-shadow-md">Unmatched Optical Authority. For Visionary Brands.</div>
            <p className="text-zinc-200 text-[10px] md:text-[12px] max-w-3xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-6 mx-auto px-4 drop-shadow-lg">
              <span className="font-black text-white">SKIP THE STOCK SITES AND GET 100% ROYALTY-FREE PREMIUM AI ASSETS DIRECTLY FROM THE SOURCE.</span><br /><br />
              <span className="text-blue-300 font-black uppercase">LUXURY REAL ESTATE, GOURMET FOOD, AND TECH GADGET BUNDLES READY FOR YOUR COMMERCIAL CAMPAIGNS.</span>
            </p>
          </div>
        </div>
      </V8Reveal>

      <V8Reveal delay={0.5} direction="up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-6 relative z-10 max-w-6xl mx-auto">
          {/* Bundle 1 */}
          <V8TiltCard className="rounded-[2rem]">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-blue-500/50 transition-all shadow-2xl flex flex-col items-start text-left h-full">
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="Real Estate" className="w-full h-full object-cover opacity-70 transition-all duration-700" />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">50 ASSETS</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Luxury Real Estate</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Penthouses, Modern Villas, Interiors</p>
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-2xl font-black text-white">$49</span>
                <Link to="/stock" className="px-6 py-3 bg-white/5 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-blue-500">VIEW BUNDLE</Link>
              </div>
            </div>
          </V8TiltCard>

          {/* Bundle 2 */}
          <V8TiltCard className="rounded-[2rem] md:-translate-y-4">
            <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[2rem] p-5 hover:border-orange-500 transition-all shadow-[0_0_30px_rgba(234,88,12,0.1)] flex flex-col items-start text-left h-full relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl z-20 shadow-lg">BEST SELLER</div>
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5 mt-2">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" alt="Gourmet" className="w-full h-full object-cover opacity-70 transition-all duration-700" />
                <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">40 ASSETS</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Premium Gourmet</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Steaks, Luxury Desserts, Plating</p>
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-2xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]">$39</span>
                <Link to="/stock" className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)]">VIEW BUNDLE</Link>
              </div>
            </div>
          </V8TiltCard>

          {/* Bundle 3 */}
          <V8TiltCard className="rounded-[2rem]">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-blue-500/50 transition-all shadow-2xl flex flex-col items-start text-left h-full">
              <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" alt="Tech Gadgets" className="w-full h-full object-cover opacity-70 transition-all duration-700" />
                <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">50 ASSETS</div>
              </div>
              <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">V8 Tech & Gadgets</h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Microphones, VR, Smart Devices</p>
              <div className="mt-auto w-full flex items-center justify-between">
                <span className="text-2xl font-black text-white">$49</span>
                <Link to="/stock" className="px-6 py-3 bg-white/5 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-blue-500">VIEW BUNDLE</Link>
              </div>
            </div>
          </V8TiltCard>
        </div>
      </V8Reveal>

      <V8Reveal delay={0.6} direction="up">
        <div className="mt-14 relative z-10">
          <Link to="/stock" className="inline-flex items-center gap-3 text-zinc-400 hover:text-white text-[12px] font-black uppercase tracking-widest transition-all group">
            EXPLORE ALL STOCK BUNDLES <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform text-blue-500" />
          </Link>
        </div>
      </V8Reveal>
    </div>
  );
};
export default StockBundles;