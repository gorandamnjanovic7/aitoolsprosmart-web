import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Crown, Zap, Play, Rocket, TrendingUp, Cpu, Crosshair } from 'lucide-react';

const V8Promo10xPage = () => {
  const [promoData, setPromoData] = useState({ images: [], promoText: "" });
  const videoUrl = "/v8-reklama.mp4";
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "v8_settings", "promo10x"), (doc) => {
      if (doc.exists()) {
        setPromoData(doc.data());
      }
    });
    return () => unsub();
  }, []);

  const images = promoData?.images?.length > 0 ? promoData.images : ['/v8-poster.jpg']; 

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) videoRef.current.play();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      
      <div className="max-w-5xl mx-auto px-6 text-center mb-16 mt-10">
        <div className="inline-flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/30 px-5 py-2.5 rounded-full text-orange-500 text-[11px] font-black uppercase tracking-[0.2em] mb-8">
          <Crown className="w-4 h-4" /> Exclusive V8 Premiere
        </div>

        <h1 className="text-3xl md:text-5xl font-serif italic tracking-wide leading-[1.2] mb-6 text-zinc-100">
          Turn average ideas into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-black not-italic drop-shadow-md tracking-tighter uppercase">
            Masterpieces in 3 Seconds.
          </span>
        </h1>

        <div className="max-w-4xl mx-auto font-light leading-relaxed mb-12 flex flex-col gap-6 text-center px-4">
          <p className="text-zinc-300 text-[16px] md:text-[19px] leading-relaxed">
            Forget amateur mistakes and overpaid designers. Your time is your most expensive resource. The 
            <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black drop-shadow-[0_0_12px_rgba(255,69,0,0.4)] text-[18px] md:text-[22px] mx-2 tracking-wide uppercase inline-block">
              V8 Master Engine
            </strong> 
            shifts into the highest gear to generate mesmerizing 4K visuals that dominate the market.
          </p>
          <p className="text-zinc-500 text-[14px] md:text-[16px] font-medium tracking-wide">
            No compromises. Just pure, raw power for only €199.99 Lifetime.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] md:text-[13px] font-black tracking-[0.15em] uppercase mb-20">
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 px-5 py-3 rounded-xl transition-all">
            <Crosshair className="w-5 h-5 text-green-500" /> 
            <span className="text-zinc-400">99.8% Precision</span>
          </div>
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 px-5 py-3 rounded-xl transition-all">
            <Cpu className="w-5 h-5 text-orange-500" /> 
            <span className="text-zinc-400">V8 Architecture</span>
          </div>
          <div className="flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 px-5 py-3 rounded-xl transition-all">
            <Rocket className="w-5 h-5 text-blue-500" /> 
            <span className="text-zinc-400">0.3s Response</span>
          </div>
        </div>
      </div>

      {/* SMART VIDEO PLAYER */}
      <div className="max-w-4xl mx-auto px-6 mb-24 relative group">
        <div className="w-full aspect-video relative p-[2px] rounded-[2rem] overflow-hidden bg-black shadow-[0_0_50px_rgba(234,88,12,0.15)]">
          {!isPlaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer" onClick={handlePlayVideo}>
              <img src="/v8-poster.jpg" alt="V8 Poster" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="relative z-30 bg-orange-500/90 p-4 rounded-full border border-orange-400 shadow-[0_0_20px_rgba(255,69,0,0.6)]">
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              </div>
            </div>
          )}
          <video ref={videoRef} controls={isPlaying} muted playsInline onEnded={() => setIsPlaying(false)} className="w-full h-full object-cover" poster="/v8-poster.jpg">
            <source src={videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>

      {/* INFINITE SLIDER */}
      <div className="w-full mb-20 overflow-hidden bg-black/50 py-10 border-y border-white/5">
        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 text-center">Live V8 Visual Stream</h3>
        <div className="v8-slider-container-small flex overflow-hidden">
          <div className="v8-track-fast flex w-max" style={{ animationDuration: '150s' }}>
            {[...images, ...images].map((imgUrl, idx) => (
              <div key={idx} className="relative p-[2px] rounded-2xl overflow-hidden shrink-0 w-[200px] md:w-[280px] aspect-video mx-3 bg-[#0a0a0a] border border-white/5">
                <img src={imgUrl} alt="V8 Render" className="w-full h-full object-cover opacity-80" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default V8Promo10xPage;