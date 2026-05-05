import React, { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Crown, CheckCircle, Zap, Play, Rocket, TrendingUp, Cpu, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion'; // V8: Dodali smo Framer Motion za premium animacije!

// Početak funkcije: V8Promo10xPage
const V8Promo10xPage = () => {
  const [promoData, setPromoData] = useState({ images: [], promoText: "" });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "v8_settings", "promo10x"), (doc) => {
      if (doc.exists()) {
        setPromoData(doc.data());
      }
    });
    return () => unsub();
  }, []);

  const images = promoData?.images?.length > 0 
    ? promoData.images 
    : ['/thumbinal.png']; 

  const videoUrl = "/v8-reklama.mp4";
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false); 
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) { 
        document.webkitExitFullscreen();
      }
    }
  };

  const toggleFullScreen = () => {
    if (!videoRef.current) return;
    
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) { 
        videoRef.current.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { 
        document.webkitExitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* --- V8 PREMIUM HERO KARTICA --- */}
      <div className="relative w-full max-w-5xl mx-auto rounded-[2.5rem] border border-orange-500/20 shadow-[0_0_40px_rgba(234,88,12,0.1)] overflow-hidden flex flex-col items-center justify-center p-10 md:p-16 text-center mt-6 mb-16 group">

        {/* 1. ANIMIRANA POZADINA (Povećana vidljivost zlata) */}
        <div className="absolute inset-0 z-0 bg-[#050505]">
          <img
            src="/promo-bg.webp"
            alt="V8 Engine Power"
            className="w-full h-full object-cover opacity-90 scale-100 group-hover:scale-110 transition-transform duration-[15000ms] ease-out"
          />
          {/* Zatamnjenje: Ivice mračne, sredina propušta više zlata (via-30) */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-[#050505]/30 to-[#050505]/95"></div>
        </div>

        {/* 2. SADRŽAJ KARTICE SA FRAMER MOTION ANIMACIJOM */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center w-full px-2"
        >
          
          <div className="inline-flex items-center justify-center gap-2 bg-orange-500/10 border border-orange-500/30 px-5 py-2.5 rounded-full text-orange-500 text-[11px] font-black uppercase tracking-[0.2em] mb-8 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
            <Crown className="w-4 h-4" /> EXCLUSIVE V8 PREMIERE
          </div>

          <h1 className="text-3xl md:text-5xl font-serif italic tracking-wide leading-[1.2] mb-6 text-zinc-100">
            Turn average ideas into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-black not-italic drop-shadow-md tracking-tighter uppercase">
              Masterpieces in 3 Seconds.
            </span>
          </h1>

          <div className="max-w-4xl mx-auto font-light leading-relaxed flex flex-col gap-6 text-center">
            <p className="text-zinc-200 text-[15px] md:text-[17px] font-medium">
              Forget amateur mistakes and hours lost in trial and error. The <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black drop-shadow-sm text-[16px] md:text-[18px]">V8 Master Engine</strong> directly takes your raw vision and generates mesmerizing 4K visuals.
            </p>

            <p className="text-zinc-300 text-[15px] md:text-[17px] leading-relaxed">
              Forget amateur mistakes, overpaid designers, and hours lost in endless tweaking. Your time is your most expensive asset. The 
              <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 font-black drop-shadow-[0_0_12px_rgba(255,69,0,0.4)] text-[17px] md:text-[20px] mx-2 tracking-wide uppercase inline-block hover:scale-105 transition-transform cursor-default">
                V8 Master Engine
              </strong> 
              doesn't ask for explanations – it directly takes your raw vision, shifts into the highest gear, and generates mesmerizing 4K visuals in real-time that dominate the market.
            </p>

            <p className="text-zinc-400 text-[13px] md:text-[15px] font-bold tracking-wide mt-2">
              No compromises. No hidden fees. Just pure, raw power at your click.
            </p>
          </div>

        </motion.div>
      </div>
      {/* --- KRAJ V8 KARTICE --- */}

      {/* --- PREMIUM ANIMIRANI BEDŽEVI (Kaskadna animacija) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-5xl mx-auto px-6"
      >
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] md:text-[13px] font-black tracking-[0.15em] uppercase mb-20">
          
          <div className="group flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 hover:border-green-500/50 px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(34,197,94,0.15)] cursor-default">
            <Crosshair className="w-5 h-5 text-green-500 group-hover:rotate-90 transition-transform duration-500 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> 
            <span className="text-zinc-400 group-hover:text-white transition-colors">99.8% Precision</span>
          </div>

          <div className="group flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 hover:border-orange-500/50 px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(249,115,22,0.15)] cursor-default">
            <Cpu className="w-5 h-5 text-orange-500 group-hover:animate-pulse transition-transform duration-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]" /> 
            <span className="text-zinc-400 group-hover:text-white transition-colors">V8 Architecture</span>
          </div>

          <div className="group flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 hover:border-blue-500/50 px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)] cursor-default">
            <Rocket className="w-5 h-5 text-blue-500 group-hover:-translate-y-1.5 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> 
            <span className="text-zinc-400 group-hover:text-white transition-colors">0.3s Response</span>
          </div>

          <div className="group flex items-center gap-3 bg-[#0a0a0a] border border-zinc-800 hover:border-yellow-500/50 px-5 py-3 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(234,179,8,0.15)] cursor-default">
            <TrendingUp className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" /> 
            <span className="text-zinc-400 group-hover:text-white transition-colors">10X Conversion</span>
          </div>

        </div>
      </motion.div>

      {/* --- PAMETNI VIDEO PLEJER (Fade i Scale animacija) --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-4xl mx-auto px-6 mb-24 relative group"
      >
        <div className="w-full aspect-video relative p-[2px] rounded-[2rem] overflow-hidden bg-black">
          
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] v8-ai-aura opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          
          <div className="relative w-full h-full bg-black rounded-[calc(2rem-2px)] overflow-hidden z-10 flex items-center justify-center">
            
            {!isPlaying && (
              <div 
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group/play"
                onClick={handlePlayVideo}
              >
                <img src="/thumbinal.png" alt="V8 Poster" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/play:opacity-40 transition-opacity" />
                
                <div className="relative z-30 bg-orange-500/90 p-4 rounded-full border border-orange-400 shadow-[0_0_20px_rgba(255,69,0,0.6)] group-hover/play:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            )}

            <video 
              ref={videoRef}
              controls={isPlaying} 
              controlsList="nodownload" 
              muted 
              playsInline 
              onEnded={handleVideoEnded} 
              onDoubleClick={toggleFullScreen}
              className="w-full h-full object-cover cursor-pointer"
              poster="/v8-poster.jpg" 
              title="Double click for Fullscreen"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>

          <div className="absolute -inset-4 animate-[spin_4s_linear_infinite] v8-ai-aura opacity-20 group-hover:opacity-50 blur-2xl transition-opacity duration-700 pointer-events-none z-0"></div>
        </div>
        <p className="text-zinc-600 text-[10px] text-center mt-3 uppercase tracking-widest font-bold">Double-click video for full screen</p>
      </motion.div>

      {/* --- V8 BESKONAČNA TRAKA --- */}
      <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true }} 
        transition={{ duration: 1 }}
        className="w-full mb-20 overflow-hidden bg-black py-10 border-y border-white/5"
      >
        
        <h3 className="flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-8 text-center">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.9)]"></span>
          </span>
          Live V8 Visual Stream
        </h3>

        <div className="flex justify-center mb-10">
          <button 
            className="px-10 md:px-14 py-4 md:py-5 bg-gradient-to-r from-orange-600 to-[#FF4500] hover:from-orange-500 hover:to-red-600 text-black font-extrabold text-[15px] md:text-[18px] tracking-[0.2em] uppercase rounded-sm shadow-[0_0_30px_rgba(255,69,0,0.6)] hover:shadow-[0_0_50px_rgba(255,69,0,0.9)] transform hover:scale-105 transition-all duration-300 border border-orange-400/50 flex items-center gap-3"
            onClick={() => { 
              alert('Dugme radi! Ovde treba ubaciti logiku za otvaranje naplate.'); 
            }} 
          >
            <Crown className="w-5 h-5 text-black" />
            GET LIFETIME LICENSE ($199.99)
          </button>
        </div>
        
        <div className="v8-slider-container-small flex overflow-hidden">
          <div className="v8-track-fast flex w-max hover:[animation-play-state:paused] transition-all" style={{ animationDuration: '150s' }}>
            
            {images.map((imgUrl, idx) => (
              <div key={`v8-1-${idx}`} className="relative p-[2px] rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-105 shrink-0 w-[260px] md:w-[360px] aspect-video cursor-default mx-3">
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-orange-600 via-transparent to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-[#050505] z-10">
                  <img src={imgUrl} alt={`V8 Visual ${idx + 1}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="absolute -inset-4 animate-[spin_3s_linear_infinite] bg-gradient-to-r from-orange-600 to-blue-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 pointer-events-none z-0"></div>
              </div>
            ))}
            
            {images.map((imgUrl, idx) => (
              <div key={`v8-2-${idx}`} className="relative p-[2px] rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-105 shrink-0 w-[260px] md:w-[360px] aspect-video cursor-default mx-3">
                <div className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-gradient-to-r from-orange-600 via-transparent to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-[#050505] z-10">
                  <img src={imgUrl} alt={`V8 Visual ${idx + 1}`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" />
                </div>
                <div className="absolute -inset-4 animate-[spin_3s_linear_infinite] bg-gradient-to-r from-orange-600 to-blue-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700 pointer-events-none z-0"></div>
              </div>
            ))}
          </div>
        </div>

      </motion.div>

    </div>
  );
};

export default V8Promo10xPage;