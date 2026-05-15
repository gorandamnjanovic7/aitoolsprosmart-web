import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Sparkles, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';
import * as data from './data';

const getRibbonStyle = (index) => {
  if (index === 0) return "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]";
  const colors = ["bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]", "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]", "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]"];
  return colors[Math.max(0, index - 1) % colors.length];
};

const MarketplaceCard = ({ app, index }) => {
  const isVideo = app.media?.[0]?.type === 'video' || app.media?.[0]?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${app.media[0].url}#t=0.001` : (app.media?.[0]?.url || data.bannerUrl);
  const ribbonClass = getRibbonStyle(index);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const handlePlay = (e) => { 
    e.preventDefault(); 
    e.stopPropagation(); 
    setIsPlaying(true); 
    if (videoRef.current) { 
      videoRef.current.muted = false; 
      videoRef.current.currentTime = 0; 
      videoRef.current.play(); 
    } 
  };
  
  return (
    <motion.div className="group relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-orange-500 to-blue-600 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] flex flex-col h-full z-10 hover:z-20 transition-transform duration-300 hover:scale-[1.02]">
      <div className="bg-[#0a0a0a] rounded-[2.4rem] p-5 flex flex-col h-full relative overflow-hidden">
        {app.type && (
          <div className="absolute top-8 -right-14 w-52 text-center rotate-45 z-30 pointer-events-none drop-shadow-2xl">
            <div className={`py-2 w-full text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl ${ribbonClass}`}>{app.type}</div>
          </div>
        )}
        <div className="relative mb-6">
          <div className="aspect-video relative rounded-[2rem] overflow-hidden bg-black border-2 border-blue-500 shrink-0 block group-hover:border-blue-400 transition-colors">
            {isVideo ? (
              <>
                <video ref={videoRef} src={displayUrl} className={`w-full h-full object-cover transition-all duration-700 ${!isPlaying ? 'opacity-80 group-hover:opacity-100 group-hover:scale-105' : 'opacity-100'}`} playsInline controls={isPlaying} controlsList="nodownload" onEnded={() => setIsPlaying(false)} />
                {!isPlaying && (<button type="button" onClick={handlePlay} className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/20 cursor-pointer"><PlayCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" /></button>)}
              </>
            ) : (
              <Link to={`/app/${app.id}`} className="block w-full h-full">
                <img src={displayUrl} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={app.name || 'Asset'} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/20"><PlayCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" /></div>
              </Link>
            )}
          </div>
          <div className="absolute top-4 -left-[2px] bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-r-xl z-20 shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400 border-l-0">{app.category || 'AI ASSET'}</div>
        </div>
        <div className="flex-1 flex flex-col px-2 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Link to={`/app/${app.id}`} className="flex-1 pr-4 hover:opacity-80"><h3 className="text-white font-black text-[18px] md:text-[20px] uppercase tracking-tighter line-clamp-2 leading-tight mb-2 group-hover:text-orange-500 transition-colors">{app.name}</h3></Link>
            <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0 ml-2"><span className="text-white font-black text-[14px]">${app.price || '14.99'}</span></div>
          </div>
          {app.headline && <p className="text-zinc-400 text-[12px] font-medium leading-relaxed line-clamp-2 mb-6 mt-3">{app.headline}</p>}
          <Link to={`/app/${app.id}`} className="mt-auto w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2">VIEW DETAILS <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </motion.div>
  );
};

const Marketplace = ({ apps = [] }) => {
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  
  return (
    <div id="marketplace" className="pb-6">
      <V8Reveal delay={0.1} direction="left">
        <div className="flex items-center gap-4 mb-6 text-left border-t border-orange-500/30 pt-20">
          <div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">PREMIUM AI ASSETS STORE</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
      </V8Reveal>
      
      <V8Reveal delay={0.2} direction="up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-6"> 
          {sortedApps.map((app, index) => (
            <div key={app.id} className="relative p-[2px] rounded-[2.1rem] overflow-hidden group transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] v8-ai-aura opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-full w-full rounded-[2rem] overflow-hidden bg-[#050505] z-10 flex flex-col">
                <MarketplaceCard app={app} index={index} />
              </div>
              <div className="absolute -inset-4 animate-[spin_4s_linear_infinite] v8-ai-aura opacity-20 group-hover:opacity-50 blur-2xl transition-opacity duration-700 pointer-events-none z-0"></div>
            </div>
          ))}
        </div>
      </V8Reveal>

      <V8Reveal delay={0.4} direction="up">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-orange-500/30 p-10 md:p-14 text-center mt-6 mb-10 group hover:border-orange-500 transition-all duration-700 shadow-[0_0_30px_rgba(234,88,12,0.1)] hover:shadow-[0_0_50px_rgba(234,88,12,0.3)]">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/10 via-transparent to-blue-900/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="inline-flex items-center justify-center bg-gradient-to-br from-orange-500/20 to-orange-600/5 p-5 rounded-full mb-6 relative z-10 border border-orange-500/20 shadow-[0_0_15px_rgba(234,88,12,0.5)]">
            <Award className="w-12 h-12 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" strokeWidth={1.5} />
          </motion.div>
          
          <h3 className="text-xl md:text-3xl font-black text-white uppercase tracking-widest mb-4 relative z-10 drop-shadow-lg">
            CONSTANTLY <span className="text-orange-500">EXPANDING</span> ARSENAL
          </h3>
          
          <p className="text-zinc-400 text-[12px] md:text-[14px] font-medium uppercase tracking-[0.2em] leading-relaxed max-w-3xl mx-auto relative z-10">
            THE DATABASE OF GENERATORS AND APPLICATIONS IS CONSTANTLY BEING UPDATED. <br className="hidden md:block" />
            <span className="text-white font-black drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">BE READY FOR NEW SURPRISES.</span>
          </p>
          
          <div className="mt-8 pt-8 border-t border-white/5 relative z-10">
            <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-zinc-500">
              YOUR <span className="text-blue-500">AI TOOLS PRO</span> <span className="text-orange-500">SMART</span>
            </span>
          </div>
          
          <div className="absolute -inset-10 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-blue-500/0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-0 pointer-events-none animate-pulse"></div>
        </div>
      </V8Reveal>
    </div>
  );
};

export default Marketplace;