import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  PlayCircle, Sparkles, Youtube, X, ChevronLeft, ChevronRight, Award, 
  ArrowRight, Maximize2, Edit, Loader2, Fingerprint, Trash2, UploadCloud,
  Dices, Eye, MousePointerClick, Clock, Users, Zap, HelpCircle, ChevronDown
} from 'lucide-react';

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

import * as data from './data';
import { 
  TypewriterText, UniversalVideoPlayer, renderDescription, FullScreenBoot, 
  MatrixRain, TutorialCard 
} from './data';
import mojBaner from './moj-baner.png'; 

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
  window.scrollTo(0, 0);
}

const BASE_BACKEND_URL = "https://aitoolsprosmart-becend-production.up.railway.app"; 
const API_URL = `${BASE_BACKEND_URL}/api/products`;

// ============================================================================
// KOMPONENTA ZA FAQ HARMONIKU
// ============================================================================
const FAQAccordion = ({ faqs }) => {
  const [openIdx, setOpenIdx] = useState(null);
  if (!faqs || faqs.length === 0 || !faqs.some(f => f.q && f.a)) return null;

  return (
    <div className="mt-12 border-t border-white/5 pt-10">
      <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-6 border-l-4 border-orange-500 pl-4 italic text-left flex items-center gap-3">
        <HelpCircle className="w-4 h-4 text-orange-500" /> FREQUENTLY ASKED QUESTIONS
      </h3>
      <div className="space-y-3 mt-4 w-full">
        {faqs.filter(f => f.q && f.a).map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner text-left transition-all">
            <button
              type="button"
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 flex justify-between items-center text-left hover:bg-white/[0.04] transition-colors"
            >
              <h4 className="text-orange-500 font-bold text-[13px] uppercase tracking-wider flex items-center gap-3">
                <span className="text-white/30 text-[10px]">Q:</span> {item.q}
              </h4>
              <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="p-5 pt-0 text-zinc-400 text-[12px] leading-relaxed border-t border-white/5 mt-1 pt-4">
                <span className="text-white/30 font-bold mr-2 text-[10px] uppercase">A:</span>{item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// POMOĆNE KOMPONENTE ZA ENHANCER
// ============================================================================
const OptionButton = ({ label, selected, onClick, type }) => {
  const isQuality = type === 'quality';
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg text-[9px] font-black border transition-all ${
      selected 
      ? (isQuality ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]") 
      : "bg-black border-white/10 text-zinc-500 hover:border-white/20"
    }`}>
      {label}
    </button>
  );
};

const PromptResultBox = ({ type, text, copiedBox, onCopy }) => {
  const title = type === 'cctv' ? 'THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER' : type.toUpperCase();
  return (
    <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative shadow-inner flex flex-col min-h-[300px]">
      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 border-b border-white/5 pb-3 text-left block">{title}</label>
      <p className={`w-full font-mono text-[10px] leading-relaxed text-left flex-1 ${text ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
        {text ? <TypewriterText text={text} speed={10} /> : "AWAITING..."}
      </p>
      {text && (
        <button onClick={() => onCopy(text, type)} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all bg-white/10 text-white hover:bg-white/20">
          {copiedBox === type ? "COPIED" : "COPY"}
        </button>
      )}
    </div>
  );
};

// ============================================================================
// YOUTUBE VIDEO KARTICA (PLAVI OKVIR)
// ============================================================================
const YouTubeVideoCard = ({ vid, index }) => {
  const colors = ['bg-blue-600', 'bg-orange-600', 'bg-emerald-600', 'bg-purple-600', 'bg-red-600', 'bg-pink-600'];
  const rColor = colors[index % colors.length];

  return (
    <a href={vid.url} target="_blank" rel="noopener noreferrer" className="bg-[#0a0a0a] border-2 border-blue-600 rounded-[1.5rem] overflow-hidden shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all group block relative">
       <div className="relative aspect-video bg-black overflow-hidden border-b border-white/10">
          <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/10 transition-all z-10">
              <PlayCircle className="w-10 h-10 text-orange-500 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform" strokeWidth={1.5} />
          </div>
          
          <div className={`absolute top-5 -right-12 w-[180px] rotate-[40deg] ${rColor} text-white py-1.5 text-center text-[9px] font-black uppercase tracking-widest shadow-2xl z-20 pointer-events-none`}>
              NEW INTEL
          </div>
       </div>
       <div className="p-5">
          <h4 className="text-white font-black text-[12px] leading-tight uppercase tracking-wider line-clamp-2 group-hover:text-blue-400 transition-colors">{vid.title}</h4>
       </div>
    </a>
  );
};

// ============================================================================
// PREMIUM ASSET CARD (SVI PRODUKTI IMAJU NARANDŽASTO-PLAVI GRADIJENT)
// ============================================================================
const PremiumAssetCard = ({ app, index }) => {
  const isVideo = app.media?.[0]?.type === 'video' || app.media?.[0]?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const mediaUrl = app.media?.[0]?.url || data.bannerUrl;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const colors = ['bg-orange-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-red-600'];
  const rColor = colors[index % colors.length];

  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPlaying(true);
    if(videoRef.current) {
        videoRef.current.play();
    }
  };

  const handleVideoInteraction = (e) => {
     e.preventDefault();
     e.stopPropagation();
  };

  const handleVideoEnded = (e) => {
     e.preventDefault();
     e.stopPropagation();
     setIsPlaying(false);
     if(videoRef.current) {
         videoRef.current.currentTime = 0.001; // Vraca na prvi frejm
     }
  };

  const handleCardClick = (e) => {
     if(!isPlaying) {
         navigate(`/app/${app.id}`);
     }
  };

  const cardInnerContent = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-black border-b border-white/5">
         
         {isVideo ? (
            <>
              {/* VIDEO PLEJER UOKVIREN PLAVOM BOJOM */}
              <div className="w-full h-full relative z-10 border-2 border-blue-600 rounded-[calc(2rem-3px)] overflow-hidden" onClick={isPlaying ? handleVideoInteraction : undefined}>
                  <video 
                    ref={videoRef}
                    src={`${mediaUrl}#t=0.001`} 
                    className="w-full h-full object-cover" 
                    controls={isPlaying} 
                    playsInline
                    muted 
                    preload="auto" 
                    onPlay={handleVideoInteraction}
                    onPause={handleVideoInteraction}
                    onClick={handleVideoInteraction}
                    onEnded={handleVideoEnded}
                  />
              </div>
              {!isPlaying && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 hover:bg-black/20 transition-all group cursor-pointer" onClick={handlePlayClick}>
                     {/* POJAČANA IKONICA I POZICIJA */}
                     <PlayCircle className="w-10 h-10 text-orange-500 opacity-100 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] group-hover:scale-110 transition-all relative z-30" strokeWidth={1.5} />
                 </div>
              )}
            </>
         ) : (
            <img src={mediaUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={app.name} />
         )}

         {app.type && (
            <div className={`absolute top-8 -right-20 w-[320px] rotate-[40deg] ${rColor} text-white py-2 px-6 text-[10px] font-black uppercase tracking-[0.1em] text-center shadow-[0_0_20px_rgba(0,0,0,0.6)] z-30 pointer-events-none`}>
               {app.type}
            </div>
         )}

         {/* BOX ZA KATEGORIJU PRATI BOJU RIBONA */}
         <div className={`absolute top-4 left-4 ${rColor} text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl z-30 pointer-events-none`}>
            {app.category || 'AI ASSET'}
         </div>
      </div>
      
      <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
         <div className="flex-1 pointer-events-none">
             <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
                {app.name} <span className="text-orange-500 ml-2 block sm:inline mt-1 sm:mt-0">- ${app.price || '14.99'}/Monthly</span>
             </h3>
             <p className="text-white font-bold text-[11px] leading-relaxed line-clamp-2 mb-6">
                {app.headline || 'Access the premium AI architecture and source code.'}
             </p>
         </div>
         <div className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2 mt-auto pointer-events-none">
             More Details <ArrowRight size={14} className="text-orange-500" />
         </div>
      </div>
    </>
  );

  // SVI PRODUKTI UVEK IMAJU NARANDŽASTO-PLAVI GRADIJENT (KUTIJA PROIZVODA)
  return (
     <div className="rounded-[2rem] p-[3px] bg-gradient-to-br from-orange-500 to-blue-600 shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_35px_rgba(249,115,22,0.5)] transition-all group h-full block cursor-pointer" onClick={handleCardClick}>
        <div className="bg-[#0a0a0a] rounded-[calc(2rem-3px)] overflow-hidden flex flex-col h-full relative">
           {cardInnerContent}
        </div>
     </div>
  );
};


// ============================================================================
// 1. HOME PAGE
// ============================================================================
function HomePage({ apps = [], hiddenVideoIds = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveVideos, setLiveVideos] = useState([]); 
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); 
  const [videoError, setVideoError] = useState(false);
  
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  const YOUTUBE_CHANNEL_ID = "UC6ilBUks_oFMSD8CE9qD6lQ";

  useEffect(() => { 
    let isMounted = true;
    setIsLoadingVideos(true);
    setVideoError(false);

    const fetchVideos = async () => {
      try {
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
        
        const res = await fetch(proxyUrl);
        if (!res.ok) throw new Error("Network error");
        const text = await res.text();
        
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const entries = xmlDoc.querySelectorAll("entry");
        
        const vids = [];
        entries.forEach(entry => {
          const title = entry.querySelector("title")?.textContent;
          const link = entry.querySelector("link")?.getAttribute("href");
          
          if (title && link) {
            const videoIdMatch = link.match(/v=([^&]+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : '';
            
            if (hiddenVideoIds.includes(videoId)) return;

            if (vids.length >= 8) return; 

            const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
            let embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : link;

            vids.push({
               title: title,
               thumbnail: thumbnail,
               image: thumbnail,
               url: link,
               link: link,
               embedUrl: embedUrl
            });
          }
        });

        if (isMounted) {
            if (vids.length > 0) setLiveVideos(vids);
            else setVideoError(true);
        }
      } catch (err) {
        if (isMounted) setVideoError(true);
      } finally {
        if (isMounted) setIsLoadingVideos(false);
      }
    };

    fetchVideos();

    return () => { isMounted = false; };
  }, [hiddenVideoIds]); 

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | HOME</title></Helmet>
      
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white">
        <MatrixRain />
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
            <img src={item.url || item.image || data.bannerUrl} className="w-full h-full object-cover" alt="banner" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full z-20" style={{ borderTop: '0.1px solid #f97316' }}></div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft size={32} strokeWidth={3} /></button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight size={32} strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {(data.BANNER_DATA || []).map((_, i) => (<button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-4xl font-black uppercase mb-1.5 tracking-tighter">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[12px] md:text-sm max-w-lg font-medium opacity-90">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div id="protocols" className="flex items-center gap-4 mb-10 text-left">
          <div className="flex items-center gap-2.5 shrink-0"><Youtube className="text-red-600" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic">Latest Intel Protocols</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div>
        </div>
        
        {isLoadingVideos ? (
          <div className="w-full flex flex-col items-center justify-center py-20 text-zinc-500">
             <Loader2 size={40} className="animate-spin mb-4 text-orange-500" />
             <p className="text-[10px] font-black uppercase tracking-widest">Syncing your videos from YouTube...</p>
          </div>
        ) : videoError ? (
          <div className="w-full bg-black border border-white/5 p-8 rounded-2xl text-center mb-24">
             <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Unable to fetch YouTube videos currently. Check if an AdBlocker is enabled on your device.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {liveVideos.map((vid, i) => (<YouTubeVideoCard key={i} vid={vid} index={i} />))}
          </div>
        )}

        <div id="enhancer-cta" className="mb-24 scroll-mt-32">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center group hover:border-orange-500/40 transition-all">
             <Zap className="w-16 h-16 text-orange-500 mb-6 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">10x Prompt Enhancer</h2>
             <p className="text-zinc-400 text-sm md:text-base mb-8 uppercase tracking-widest max-w-2xl">Access the Premium AI Prompt Engineering Engine. Convert simple ideas into cinematic, photorealistic, and abstract masterpieces instantly.</p>
             <Link to="/enhancer" className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all">
                Launch Engine
             </Link>
          </div>
        </div>

        <div id="marketplace" className="flex items-center gap-4 mb-10 text-left">
          <div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">Premium AI Asset Store</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-32">
          {sortedApps.map((app, index) => (<PremiumAssetCard key={app.id} app={app} index={index} />))}
        </div>
        
      </div>
    </>
  );
}

// ============================================================================
// 1.5 ENHANCER PAGE
// ============================================================================
function EnhancerPage() {
  const [demoInput, setDemoInput] = useState('');
  const [customerPrompt, setCustomerPrompt] = useState(''); 
  const [generatedPrompts, setGeneratedPrompts] = useState({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedAR, setSelectedAR] = useState('16:9');
  const [selectedQuality, setSelectedQuality] = useState('4x');
  const [copiedBox, setCopiedBox] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleRollDice = () => { 
    setDemoInput(data.getRandomDicePrompt()); setCustomerPrompt(''); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); 
  };
  
  const handleEnhance = () => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setTimeout(() => {
      setGeneratedPrompts(data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR));
      setIsEnhancing(false);
    }, 1200);
  };

  const handleCopy = useCallback((text, boxName) => { 
    navigator.clipboard.writeText(text); 
    setCopiedBox(boxName);
    setTimeout(() => setCopiedBox(''), 2000);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-32 px-6 font-sans text-white text-left">
      <Helmet><title>10x Enhancer | AI TOOLS PRO</title></Helmet>
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> System Registry</button>
        
        <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all text-left">
             <div className="mb-12">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-orange-500 mb-4">10x Prompt Enhancer</h2>
                <div className="text-[13px] font-black text-green-500 uppercase tracking-[0.2em]">Premium AI Engine Active</div>
             </div>
             
             <div className="flex flex-col lg:flex-row gap-12 items-start">
               <div className="flex-1 w-full flex flex-col space-y-8 lg:sticky lg:top-32">
                 <div>
                   <label className="text-[11px] font-black uppercase text-orange-500 tracking-widest block mb-4">1. Target Concept</label>
                   <div className="relative">
                     <textarea value={demoInput} onChange={e => {setDemoInput(e.target.value); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} placeholder="e.g. 'a golden watch'" disabled={customerPrompt.length > 0} className={`w-full bg-black border rounded-xl p-5 text-white text-[11px] outline-none min-h-[150px] resize-none ${customerPrompt.length > 0 ? 'opacity-30 border-white/5' : 'border-white/10'}`} />
                     {!demoInput && customerPrompt.length === 0 && (<button onClick={handleRollDice} className="absolute right-3 top-4 bg-blue-600/10 p-2 rounded-lg text-blue-500 hover:bg-blue-600 hover:text-white transition-all"><Dices size={16} /></button>)}
                   </div>
                 </div>
                 
                 <div className="flex justify-between items-center">
                    <div className="flex gap-2">{['1:1', '9:16', '16:9'].map(ar => <OptionButton key={ar} label={ar} selected={selectedAR === ar} onClick={() => setSelectedAR(ar)} type="ar" />)}</div>
                    <div className="flex gap-2">{['1x', '2x', '4x'].map(q => <OptionButton key={q} label={q} selected={selectedQuality === q} onClick={() => setSelectedQuality(q)} type="quality" />)}</div>
                 </div>

                 <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl flex justify-center">{isEnhancing ? <Loader2 size={20} className="animate-spin" /> : "PROCESS PROMPT"}</button>
                 
                 <div className="w-full bg-black border border-white/5 rounded-2xl p-8 relative flex flex-col min-h-[250px] mt-8">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 border-b border-white/5 pb-3 text-left block">BASE PROMPT</label>
                    <p className="font-mono text-[11px] text-zinc-300 leading-relaxed text-left">{generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} /> : "READY FOR INPUT..."}</p>
                    {generatedPrompts.single && (<button onClick={() => handleCopy(generatedPrompts.single, 'single')} className="absolute bottom-6 right-6 bg-white/10 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-white/20 transition-all">{copiedBox === 'single' ? 'COPIED' : 'COPY'}</button>)}
                 </div>
               </div>
               
               <div className="flex-[1.5] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                 <PromptResultBox type="cinematic" text={generatedPrompts.cinematic} copiedBox={copiedBox} onCopy={handleCopy} />
                 <PromptResultBox type="photoreal" text={generatedPrompts.photoreal} copiedBox={copiedBox} onCopy={handleCopy} />
                 <PromptResultBox type="abstract" text={generatedPrompts.abstract} copiedBox={copiedBox} onCopy={handleCopy} />
                 <PromptResultBox type="cctv" text={generatedPrompts.cctv} copiedBox={copiedBox} onCopy={handleCopy} />
               </div>
             </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. SINGLE PRODUCT PAGE
// ============================================================================
function SingleProductPage({ apps = [] }) {
  const { id } = useParams();
  const app = apps.find(a => a.id === id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-600 uppercase text-[10px]">Syncing Data...</div>;
  
  const currentMedia = app.media?.[activeMedia] || { url: data.bannerUrl, type: 'image' };
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const parts = (app.whopLink || "").includes("[SPLIT]") ? app.whopLink.split("[SPLIT]") : [app.whopLink, "", ""];
  const mainWhopLink = data.formatExternalLink(parts[0]);
  const sourceCodeWhopLink = data.formatExternalLink(parts[1]);

  return (
    <div className="bg-[#050505] pt-32 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO</title></Helmet>
      {fullScreenImage && (<div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}><button className="absolute top-10 right-10 text-white"><X className="w-10 h-10" /></button><img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="" /></div>)}
      <div className="max-w-7xl mx-auto relative">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> System Registry</button>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[70%]">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-orange-500 bg-black mb-6 relative group shadow-2xl cursor-pointer">
              {!isVideo ? <><img src={currentMedia.url} onClick={() => setFullScreenImage(currentMedia.url)} className="w-full h-full object-cover" alt="" /><button className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 border border-white/10 transition-all z-20"><Maximize2 className="w-4 h-4" /></button></> : <UniversalVideoPlayer url={currentMedia.url} />}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {app.media?.map((m, idx) => (<button key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-28 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeMedia === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-50'}`}>{(m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i)) ? <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-6 h-6 text-white" /></div></> : <img src={m.url} className="w-full h-full object-cover" />}</button>))}
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 text-left">{app.name}</h1>
            <div className="flex mb-6 text-left"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">{app.category || 'AI ASSET'}</div></div>
            {app.headline && <p className="text-sm md:text-base text-white font-black mb-10 leading-tight border-l-4 border-orange-500 pl-5 italic text-left uppercase">{app.headline}</p>}
            
            <div className="border-t border-white/5 pt-8 mb-12">
                {renderDescription(app.description)}
                <FAQAccordion faqs={app.faq} />
            </div>
          </div>

          <div className="w-full lg:w-[30%] lg:sticky lg:top-40">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl text-center">
              <img src={mojBaner} alt="Registry Banner" className="w-full h-32 object-cover border-b border-orange-500/20" />
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 py-3.5 flex items-center justify-center">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 rounded-full"><span className="text-[8px] text-white uppercase font-black tracking-widest whitespace-nowrap">Monthly Registry</span></div>
                    <span className="text-2xl font-black text-white mt-1">${app.price || '14.99'}</span>
                  </div>
                  <div className="relative rounded-2xl bg-orange-500/[0.03] border border-orange-500/30 py-3.5 flex items-center justify-center mt-6">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 rounded-full"><span className="text-[8px] text-white uppercase font-black tracking-widest whitespace-nowrap">Lifetime Registry</span></div>
                    <span className="text-2xl font-black text-white mt-1">${app.priceLifetime || '88.99'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <a href={mainWhopLink} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest block hover:bg-blue-500 transition-all shadow-xl">Unlock Access On Whop</a>
                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 mb-4 text-orange-500 justify-center font-black uppercase text-[10px] tracking-widest"><Award className="w-4 h-4" /> Dev Pack</div>
                    {sourceCodeWhopLink && sourceCodeWhopLink !== '#' && (
                      <a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl border border-blue-900 bg-[#0f172a] text-blue-300 font-black text-[8px] uppercase tracking-widest block hover:bg-blue-900 hover:text-white transition-all">React Source Code <ArrowRight className="w-3.5 h-3.5 inline-block ml-2" /></a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. ADMIN PAGE
// ============================================================================
function AdminPage({ apps = [], refreshData, systemSettings }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false); 
  const [tab, setTab] = useState('system');
  
  const [hiddenVideoId, setHiddenVideoId] = useState('');
  const currentHiddenList = systemSettings?.hiddenVideoIds ? systemSettings.hiddenVideoIds.split(',').map(s=>s.trim()).filter(Boolean) : [];

  const initialForm = { 
      name: '', category: 'AI ASSET', type: '', headline: '', 
      price: '', priceLifetime: '', description: data.ADMIN_DEFAULT_DESC || '', 
      media: [], whopLink: '', reactSourceCode: '', 
      faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) 
  }; 
  const [formData, setFormData] = useState(initialForm); 

  const handleLogin = (e) => { e.preventDefault(); if (password === "v8pro") setIsAuthenticated(true); else alert("DENIED"); };
  
  const handleEditClick = (app) => { 
    const dbWhopField = app.whopLink || ""; const parts = dbWhopField.split("[SPLIT]");
    setFormData({ 
        name: app.name || '',
        category: app.category || 'AI ASSET',
        type: app.type || '',
        headline: app.headline || '',
        price: app.price || '',
        priceLifetime: app.priceLifetime || '',
        description: app.description || '',
        media: app.media || [],
        whopLink: parts[0] || '', 
        reactSourceCode: parts[1] || '', 
        faq: (app.faq && app.faq.length >= 7) ? app.faq : Array.from({ length: 7 }, (_, i) => app.faq?.[i] || { q: '', a: '' }) 
    }); 
    setEditingId(app.id); window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    if (isUploading) { alert("Please wait for images to upload..."); return; }
    
    const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; 
    const payload = { 
        ...formData, 
        id: editingId || String(Date.now()),
        whopLink: combinedWhopField, 
        faq: formData.faq.filter(f => f.q && f.a) 
    }; 
    
    try { 
      const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { 
        method: editingId ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      }); 
      
      if (res.ok) { 
        setFormData(initialForm); setEditingId(null); refreshData(); alert('SYSTEM UPDATED.'); 
      } else {
        const errorData = await res.json();
        alert('Error saving: ' + JSON.stringify(errorData));
      }
    } catch (err) { alert('Server connection error.'); } 
  }; 

  const updateBlacklist = async (newList) => {
    const payload = {
        id: 'SYSTEM_SETTINGS',
        name: 'SYSTEM_SETTINGS',
        category: 'SYSTEM',
        type: 'hidden',
        headline: '', price: '', priceLifetime: '', description: '', media: [], whopLink: '', reactSourceCode: '', faq: [],
        hiddenVideoIds: newList.join(',')
    };
    const exists = systemSettings && systemSettings.id;
    const method = exists ? 'PUT' : 'POST';
    const url = exists ? `${API_URL}/SYSTEM_SETTINGS` : API_URL;

    try {
        const res = await fetch(url, { method, headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)});
        if(res.ok) { refreshData(); }
        else { alert("Error updating blacklist."); }
    } catch(e) { alert("Error saving blacklist."); }
  };

  const handleHideVideo = () => {
      if (!hiddenVideoId) return;
      const id = hiddenVideoId.trim();
      if (currentHiddenList.includes(id)) { alert("Video is already hidden!"); return; }
      updateBlacklist([...currentHiddenList, id]);
      setHiddenVideoId('');
      alert(`Video ${id} is now hidden.`);
  };

  const handleRestoreVideo = () => {
      if (!hiddenVideoId) return;
      const id = hiddenVideoId.trim();
      if (!currentHiddenList.includes(id)) { alert("Video is not on the hidden list!"); return; }
      updateBlacklist(currentHiddenList.filter(v => v !== id));
      setHiddenVideoId('');
      alert(`Video ${id} is restored.`);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files); if (files.length === 0) return;
    setIsUploading(true);
    const uploadedMedia = [];
    for (const file of files) {
      const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
        const resData = await res.json();
        uploadedMedia.push({ url: resData.secure_url, type: file.type.startsWith('video/') ? 'video' : 'image' });
      } catch (err) {}
    }
    setFormData(prev => ({ ...prev, media: [...(prev.media || []), ...uploadedMedia] }));
    setIsUploading(false);
  };

  if (!isAuthenticated) return ( <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-white text-center"><div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-orange-500/20 max-w-md w-full shadow-2xl"><Fingerprint className="w-12 h-12 text-orange-500 mx-auto mb-8" /><h2 className="text-white font-black uppercase mb-8 tracking-[0.5em] text-xs text-center">Admin Terminal</h2><form onSubmit={handleLogin} className="space-y-6 text-center text-left"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none text-center text-[11px] tracking-[0.6em]" /><button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 font-black uppercase text-[10px] tracking-widest shadow-xl">Authorize</button></form></div></div> );
  
  return ( 
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white"> 
      <div className="flex gap-4 mb-10 overflow-hidden"> 
        <button onClick={() => setTab('system')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all bg-blue-600 text-white`}>System Registry</button> 
      </div> 
      {tab === 'system' && (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6 text-left">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" required />
             <input type="text" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="AI ASSET" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
             <input type="text" value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Ribbon Text (Hot 🔥)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
           </div>

           <div className="bg-black border border-white/10 p-4 rounded-xl text-left">
             <label className="text-[10px] font-black uppercase text-zinc-500 block mb-3 text-left">Media Upload (Images/Videos)</label>
             <div className="flex flex-wrap gap-4">
               {formData.media?.map((m, i) => (
                 <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 group">
                   {m.type === 'video' ? <video src={m.url} className="w-full h-full object-cover" /> : <img src={m.url} className="w-full h-full object-cover" />}
                   <button type="button" onClick={() => { const newMedia = [...formData.media]; newMedia.splice(i, 1); setFormData({...formData, media: newMedia}); }} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X size={12} /></button>
                 </div>
               ))}
               <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-all text-zinc-500">
                 {isUploading ? <Loader2 size={24} className="animate-spin" /> : <><UploadCloud size={24} className="mb-2" /><span className="text-[8px] uppercase font-black text-center">Upload</span></>}
                 <input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
               </label>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <input type="text" value={formData.headline || ''} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Headline" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white md:col-span-2" />
             <input type="text" value={formData.price || ''} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Monthly Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
             <input type="text" value={formData.priceLifetime || ''} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" value={formData.whopLink || ''} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Whop Main Link" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
             <input type="text" value={formData.reactSourceCode || ''} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="React Source Code Link" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white" />
           </div>

           <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-[11px] h-64 w-full resize-none outline-none font-mono text-white text-left" />
           
           <div className="bg-black border border-white/10 rounded-xl overflow-hidden text-left">
             <button type="button" onClick={() => setFaqOpen(!faqOpen)} className="w-full p-5 flex justify-between items-center bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer border-b border-transparent data-[open=true]:border-white/10" data-open={faqOpen}>
               <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest flex items-center gap-2"><HelpCircle size={14} className="text-orange-500" /> FAQ Section (7 Max)</span>
               <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${faqOpen ? 'rotate-180' : ''}`} />
             </button>
             <div className={`transition-all duration-500 ease-in-out origin-top ${faqOpen ? 'max-h-[1000px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 overflow-hidden'}`}>
               <div className="space-y-3 bg-black">
                 {formData.faq.map((f, i) => (
                   <div key={i} className="flex flex-col md:flex-row gap-3 bg-white/[0.01] p-3 rounded-xl border border-white/5">
                     <div className="flex-1 flex items-center gap-2">
                        <span className="text-orange-500 font-black text-[10px]">Q{i+1}:</span>
                        <input type="text" value={f.q || ''} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].q = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Enter question here..." className="w-full bg-black border border-white/10 p-3 rounded-lg text-[10px] text-white outline-none focus:border-orange-500/50 transition-all" />
                     </div>
                     <div className="flex-[2] flex items-start gap-2">
                        <span className="text-blue-500 font-black text-[10px] mt-3">A{i+1}:</span>
                        <textarea value={f.a || ''} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].a = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Enter answer here..." className="w-full bg-black border border-white/10 p-3 rounded-lg text-[10px] text-white outline-none resize-none h-10 focus:border-blue-500/50 transition-all" />
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>

           <div className="flex gap-4">
             <button type="submit" disabled={isUploading} className="flex-1 py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest bg-orange-600 hover:bg-orange-500 text-white transition-all">Execute Deploy</button>
             {editingId && <button type="button" onClick={() => { setFormData(initialForm); setEditingId(null); }} className="px-8 py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest bg-zinc-800 hover:bg-zinc-700 text-white transition-all">Cancel</button>}
           </div>

           <div className="bg-black border border-red-500/30 p-6 rounded-2xl mt-12 mb-6">
               <h3 className="text-red-500 font-black text-[12px] uppercase mb-2 flex items-center gap-2"><Youtube size={16}/> YouTube Blacklist Manager</h3>
               <p className="text-zinc-500 text-[10px] mb-4">Enter the YouTube Video ID (e.g. xhZ_hV28Lko) to hide or restore it on the site.</p>
               <div className="flex flex-col md:flex-row gap-4">
                  <input type="text" value={hiddenVideoId} onChange={e => setHiddenVideoId(e.target.value)} placeholder="Video ID (e.g. dQw4w9WgXcQ)" className="flex-1 bg-black border border-white/10 p-3 rounded-xl text-[11px] text-white outline-none focus:border-red-500/50" />
                  <div className="flex gap-2">
                     <button type="button" onClick={handleHideVideo} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">Hide Video</button>
                     <button type="button" onClick={handleRestoreVideo} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(5,150,105,0.4)]">Restore Video</button>
                  </div>
               </div>

               {currentHiddenList.length > 0 && (
                   <div className="mt-6 pt-4 border-t border-red-500/20">
                       <p className="text-zinc-500 text-[10px] uppercase font-black mb-3">Currently Hidden Videos (Click to quick-restore):</p>
                       <div className="flex flex-wrap gap-2">
                           {currentHiddenList.map(id => (
                               <button 
                                  key={id} 
                                  type="button" 
                                  onClick={() => {
                                      if(window.confirm(`Restore video ${id}?`)) {
                                          updateBlacklist(currentHiddenList.filter(v => v !== id));
                                      }
                                  }} 
                                  className="bg-red-500/10 hover:bg-red-500/30 text-red-400 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all flex items-center gap-2 cursor-pointer"
                                  title="Click to restore"
                               >
                                   {id} <X size={12} className="opacity-50" />
                               </button>
                           ))}
                       </div>
                   </div>
               )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-10 border-t border-white/10 text-left">
              {apps.map(app => (
                <div key={app.id} className="p-4 bg-black border border-white/5 rounded-xl flex justify-between items-center group">
                  <span className="text-[10px] font-black uppercase text-white truncate mr-4">{app.name}</span>
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-all">
                    <button type="button" onClick={() => handleEditClick(app)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-3.5 h-3.5" /></button>
                    <button type="button" onClick={async () => { if(window.confirm("Delete protocol?")) await fetch(`${API_URL}/${app.id}`, {method:'DELETE'}); refreshData(); }} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
           </div>
        </form>
      )}
    </div> 
  ); 
}

const WelcomeBanner = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in text-center text-left">
      <div className="bg-[#0a0a0a] border border-orange-500/50 rounded-[2rem] max-w-3xl w-full overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-orange-500 transition-all border border-white/10 z-10"><X size={24} /></button>
        <img src={mojBaner} alt="Welcome" className="w-full h-48 md:h-64 object-cover border-b border-orange-500/20" />
        <div className="p-10 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">Welcome to AI TOOLS <span className="text-orange-500">PRO</span></h2>
          <p className="text-zinc-400 text-sm md:text-base mb-8 uppercase tracking-[0.2em]">Central system for Premium AI Architecture is online.</p>
          <button onClick={onClose} className="bg-orange-600 text-white px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:bg-orange-500 transition-all">Access System</button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT & ROUTER
// ============================================================================
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = (e) => { 
    if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.replaceState(null, '', '/'); } 
  };
  
  useEffect(() => { data.trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);
  
  const storeApps = appsData.filter(a => a.id !== 'SYSTEM_SETTINGS');
  const systemSettings = appsData.find(a => a.id === 'SYSTEM_SETTINGS') || { hiddenVideoIds: '' };
  const hiddenVideoIds = systemSettings.hiddenVideoIds ? systemSettings.hiddenVideoIds.split(',').map(s => s.trim()) : [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative pb-20 lg:pb-0 text-left">
      {isBooting && <FullScreenBoot onComplete={() => { setIsBooting(false); setShowBanner(true); window.scrollTo(0,0); }} />}
      {!isBooting && showBanner && <WelcomeBanner onClose={() => setShowBanner(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <nav className="w-full px-4 md:px-8 py-6 md:py-8 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg text-left">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-4 group">
              <img src={data.logoUrl} className="h-10 md:h-12 object-contain animate-pulse" alt="logo" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4 font-black uppercase text-[10px] md:text-[11px] tracking-widest text-left">
              <Link to="/#marketplace" className="bg-blue-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              <Link to="/enhancer" className="bg-transparent border-2 border-orange-600 text-orange-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-xl hover:bg-orange-600/10 transition-all flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 10X ENHANCER</Link>
              <Link to="/" onClick={handleHomeClick} className="bg-emerald-900/60 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-emerald-400 border border-emerald-800 shadow-xl">Home</Link>
              <Link to="/admin" className="bg-orange-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-white shadow-xl">Admin</Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1 text-left">
        <Routes>
          <Route path="/" element={<HomePage apps={storeApps} hiddenVideoIds={hiddenVideoIds} />} />
          <Route path="/enhancer" element={<EnhancerPage />} />
          <Route path="/app/:id" element={<SingleProductPage apps={storeApps} />} />
          <Route path="/admin" element={<AdminPage apps={storeApps} refreshData={refreshData} systemSettings={systemSettings} />} />
        </Routes>
      </div>
      <footer className="text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em] pb-10 border-t border-white/5 pt-10">© 2026 AI TOOLS PRO SMART</footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  const refreshData = useCallback(() => { fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []);
  useEffect(() => { refreshData(); }, [refreshData]);
  
  const storeApps = appsData.filter(a => a.id !== 'SYSTEM_SETTINGS');

  return ( 
    <HelmetProvider>
      <Router>
        <AppContent appsData={appsData} refreshData={refreshData} />
        <data.LiveSalesNotification apps={storeApps} />
      </Router>
    </HelmetProvider> 
  ); 
}