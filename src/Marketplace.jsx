// POČETAK FAJLA: Marketplace.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Sparkles, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';
import * as data from './data';

const getRibbonStyle = (index) => {
  // POČETAK FUNKCIJE: getRibbonStyle
  if (index === 0) return "bg-red-500 shadow-md";
  const colors = ["bg-blue-500 shadow-md", "bg-purple-500 shadow-md", "bg-emerald-500 shadow-md"];
  return colors[Math.max(0, index - 1) % colors.length];
  // KRAJ FUNKCIJE: getRibbonStyle
};

const MarketplaceCard = ({ app, index }) => {
  // POČETAK FUNKCIJE: MarketplaceCard
  const isVideo = app.media?.[0]?.type === 'video' || app.media?.[0]?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${app.media[0].url}#t=0.001` : (app.media?.[0]?.url || data.bannerUrl);
  const ribbonClass = getRibbonStyle(index);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const handlePlay = (e) => { 
    // POČETAK FUNKCIJE: handlePlay
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsPlaying(true); 
    if (videoRef.current) { 
      videoRef.current.muted = false; 
      videoRef.current.currentTime = 0; 
      videoRef.current.play(); 
    } 
    // KRAJ FUNKCIJE: handlePlay
  };
  
  return (
    <motion.div className="group relative rounded-[2.5rem] p-[1px] bg-gradient-to-br from-gray-200 to-gray-50 hover:shadow-2xl flex flex-col h-full z-10 hover:z-20 transition-all duration-500 hover:scale-[1.02]">
      {/* V10 Staklena Kartica */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2.4rem] p-5 flex flex-col h-full relative overflow-hidden border border-white">
        {app.type && (
          <div className="absolute top-8 -right-14 w-52 text-center rotate-45 z-30 pointer-events-none drop-shadow-lg">
            <div className={`py-2 w-full text-white text-[11px] font-black uppercase tracking-[0.2em] ${ribbonClass}`}>{app.type}</div>
          </div>
        )}
        <div className="relative mb-6 shadow-sm rounded-[2rem]">
          <div className="aspect-video relative rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 shrink-0 block group-hover:border-blue-300 transition-colors">
            {isVideo ? (
              <>
                <video ref={videoRef} src={displayUrl} className={`w-full h-full object-cover transition-all duration-700 ${!isPlaying ? 'opacity-90 group-hover:opacity-100 group-hover:scale-105' : 'opacity-100'}`} playsInline controls={isPlaying} controlsList="nodownload" onEnded={() => setIsPlaying(false)} />
                {!isPlaying && (<button type="button" onClick={handlePlay} className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-white/20 backdrop-blur-sm cursor-pointer"><PlayCircle className="w-16 h-16 text-blue-600 drop-shadow-md" /></button>)}
              </>
            ) : (
              <Link to={`/app/${app.id}`} className="block w-full h-full">
                <img src={displayUrl} loading="lazy" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={app.name || 'Asset'} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-white/20 backdrop-blur-sm"><PlayCircle className="w-16 h-16 text-blue-600 drop-shadow-md" /></div>
              </Link>
            )}
          </div>
          <div className="absolute top-4 -left-[1px] bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-r-xl z-20 shadow-md border border-blue-500 border-l-0">{app.category || 'AI ASSET'}</div>
        </div>
        <div className="flex-1 flex flex-col px-2 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/app/${app.id}`} className="flex-1 pr-4 hover:opacity-80">
              {/* Studio Light Tekst */}
              <h3 className="text-slate-900 font-black text-[18px] md:text-[20px] uppercase tracking-tighter line-clamp-2 leading-tight mb-2 group-hover:text-orange-500 transition-colors">{app.name}</h3>
            </Link>
            <div className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl shrink-0 ml-2 shadow-sm"><span className="text-slate-800 font-black text-[14px]">${app.price || '14.99'}</span></div>
          </div>
          <p className="text-slate-500 text-[12px] font-medium leading-relaxed line-clamp-2 mb-6 mt-3">{app.headline}</p>
          <Link to={`/app/${app.id}`} className="mt-auto w-full py-4 rounded-xl bg-slate-900 hover:bg-orange-500 text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-md flex justify-center items-center gap-2">VIEW DETAILS <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </motion.div>
  );
  // KRAJ FUNKCIJE: MarketplaceCard
};

const Marketplace = ({ apps = [] }) => {
  // POČETAK FUNKCIJE: Marketplace
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  
  return (
    <div id="marketplace" className="pb-6">
      <V8Reveal delay={0.1} direction="left">
        <div className="flex items-center gap-4 mb-6 text-left border-t border-slate-200 pt-20">
          <div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-orange-500 w-6 h-6" />
            <h3 className="text-slate-900 font-black uppercase text-[20px] tracking-widest italic text-left">PREMIUM AI ASSETS STORE</h3>
          </div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-orange-300 to-transparent"></div>
        </div>
      </V8Reveal>
      
      <V8Reveal delay={0.2} direction="up">
        {/* Uklonjen V8 mrak i neon efekti */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-6 relative z-10"> 
          {sortedApps.map((app, index) => (
            <MarketplaceCard key={app.id} app={app} index={index} />
          ))}
        </div>
      </V8Reveal>

      <V8Reveal delay={0.4} direction="up">
        {/* POČETAK BLOKA: V10 Liquid Glass Banner */}
        <div className="relative overflow-hidden rounded-[3rem] bg-white/40 backdrop-blur-3xl border border-white/60 p-10 md:p-14 text-center mt-12 mb-10 group transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(234,88,12,0.15)]">
          
          {/* V10 MAGIJA: Ambijentalne tečne sfere koje plivaju ispod stakla */}
          <div className="absolute top-[-50%] left-[-10%] w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[80px] group-hover:bg-orange-500/30 transition-all duration-1000 group-hover:translate-x-10 group-hover:translate-y-10 ease-out z-0 pointer-events-none"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-1000 group-hover:-translate-x-10 group-hover:-translate-y-10 ease-out z-0 pointer-events-none"></div>

          {/* Unutrašnji odsjaj */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent z-0 pointer-events-none"></div>
          
          <motion.div animate={{ y: [0, -12, 0], rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} className="inline-flex items-center justify-center bg-white/80 backdrop-blur-md p-6 rounded-[2rem] mb-8 relative z-10 border border-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] group-hover:border-orange-200 transition-colors duration-700">
            <Award className="w-14 h-14 text-orange-500 drop-shadow-md" strokeWidth={1.5} />
          </motion.div>
          
          {/* Gradient tekst za premium utisak */}
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 relative z-10">
            CONSTANTLY <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-400 drop-shadow-sm">EXPANDING</span> ARSENAL
          </h3>
          
          <p className="text-slate-500 text-[13px] md:text-[15px] font-semibold uppercase tracking-[0.25em] leading-relaxed max-w-3xl mx-auto relative z-10">
            THE DATABASE OF GENERATORS AND APPLICATIONS IS CONSTANTLY BEING UPDATED. <br className="hidden md:block" />
            <span className="text-slate-900 font-black">BE READY FOR NEW SURPRISES.</span>
          </p>
          
          <div className="mt-10 pt-8 border-t border-slate-200/50 relative z-10">
            <span className="text-[11px] md:text-[13px] font-black uppercase tracking-[0.4em] text-slate-400">
              YOUR <span className="text-slate-900">AI TOOLS PRO</span> <span className="text-orange-500">SMART</span>
            </span>
          </div>
        </div>
        {/* KRAJ BLOKA: V10 Liquid Glass Banner */}
      </V8Reveal>
    </div>
  );
  // KRAJ FUNKCIJE: Marketplace
};

export default Marketplace;
// KRAJ FAJLA: Marketplace.jsx