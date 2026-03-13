import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  PlayCircle, Sparkles, Youtube, X, ChevronLeft, ChevronRight, Award, 
  ArrowRight, Maximize, Edit, Loader2, ShieldAlert, Trash2, UploadCloud,
  Dices, Eye, MousePointerClick, Clock, Users, Zap, HelpCircle, ChevronDown,
  ChevronUp
} from 'lucide-react';

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

import * as data from './data';
// IMPORTUJEMO SVE IZ DATA.JS
import { 
  TypewriterText, UniversalVideoPlayer, FullScreenBoot, 
  MatrixRain, TutorialCard, FormattedDescription 
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
// DINAMIČKE BOJE RIBONA
// ============================================================================
const getRibbonStyle = (index) => {
  if (index === 0) return "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]";
  const colors = ["bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]", "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]", "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]", "bg-pink-600 shadow-[0_0_15px_rgba(219,39,119,0.5)]", "bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"];
  return colors[Math.max(0, index - 1) % colors.length];
};

// ============================================================================
// MARKETPLACE KARTICA
// ============================================================================
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
      videoRef.current.play().catch(err => console.log('Autoplay sprečen:', err));
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0.001; 
    }
  };

  return (
    <div className="group relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-orange-500 to-blue-600 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] transition-all duration-500 flex flex-col h-full">
      <div className="bg-[#0a0a0a] rounded-[2.4rem] p-5 flex flex-col h-full relative overflow-hidden">
        {app.type && (
          <div className="absolute top-8 -right-14 w-52 text-center rotate-45 z-30 pointer-events-none drop-shadow-2xl">
            <div className={`py-2 w-full text-white text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl ${ribbonClass}`}>
              {app.type}
            </div>
          </div>
        )}

        <div className="relative mb-6">
          <div className="aspect-video relative rounded-[2rem] overflow-hidden bg-black border-2 border-blue-500 shrink-0 block group-hover:border-blue-400 transition-colors">
            {isVideo ? (
               <>
                 <video ref={videoRef} src={displayUrl} className={`w-full h-full object-cover transition-all duration-700 ${!isPlaying ? 'opacity-80 group-hover:opacity-100 group-hover:scale-105' : 'opacity-100'}`} playsInline controls={isPlaying} controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} onEnded={handleEnded} preload="metadata" />
                 {!isPlaying && (<button onClick={handlePlay} className="absolute inset-0 w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/20 cursor-pointer"><PlayCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" /></button>)}
               </>
            ) : (
               <Link to={`/app/${app.id}`} className="block w-full h-full">
                 <img src={displayUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={app.name} />
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 bg-black/20"><PlayCircle className="w-14 h-14 text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" /></div>
               </Link>
            )}
          </div>
          <div className="absolute top-4 -left-[2px] bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-r-xl z-20 shadow-[0_0_15px_rgba(37,99,235,0.6)] pointer-events-none border border-blue-400 border-l-0">{app.category || 'AI ASSET'}</div>
        </div>

        <div className="flex-1 flex flex-col px-2 pb-2">
           <div className="flex justify-between items-start mb-2">
              <Link to={`/app/${app.id}`} className="flex-1 pr-4 hover:opacity-80"><h3 className="text-white font-black text-[18px] md:text-[20px] uppercase tracking-tighter line-clamp-2 leading-tight mb-2 group-hover:text-orange-500 transition-colors">{app.name}</h3></Link>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0 ml-2"><span className="text-white font-black text-[14px]">${app.price || '14.99'}</span></div>
           </div>
           {app.headline && <p className="text-zinc-400 text-[12px] font-medium leading-relaxed line-clamp-2 mb-6 mt-3">{app.headline}</p>}
           <Link to={`/app/${app.id}`} className="mt-auto w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[12px] uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] flex justify-center items-center gap-2">VIEW MORE DETAILS <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SMART BAR SCROLL
// ============================================================================
const SmartScrollButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { const checkScroll = () => setIsScrolled(window.scrollY > 400); window.addEventListener('scroll', checkScroll); return () => window.removeEventListener('scroll', checkScroll); }, []);
  const handleAction = () => { if (isScrolled) { window.scrollTo({ top: 0, behavior: 'smooth' }); } else { const target = document.getElementById('enhancer') || document.getElementById('marketplace'); if (target) target.scrollIntoView({ behavior: 'smooth' }); } };
  return (
    <button onClick={handleAction} className="fixed bottom-10 right-6 z-[5000] flex flex-col items-center group transition-all duration-500">
      <div className={`w-1.5 rounded-full transition-all duration-700 flex items-center justify-center ${isScrolled ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] h-16' : 'bg-white/20 h-10 hover:bg-white/40'}`}>
        <div className={`transition-transform duration-700 text-white ${isScrolled ? 'rotate-0' : 'rotate-180'}`}><ChevronUp size={14} strokeWidth={4} /></div>
      </div>
      <span className="mt-2 text-[7px] font-black text-orange-500 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">{isScrolled ? "TOP" : "V8"}</span>
    </button>
  );
};

const WelcomeBanner = ({ onClose }) => (
  <div className="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
    <div className="bg-[#0a0a0a] border border-orange-500/50 rounded-[2rem] max-w-2xl w-full overflow-hidden shadow-2xl relative text-zinc-100 text-center font-sans">
      <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:text-orange-500 transition-all z-10"><X size={20} /></button>
      <img src={mojBaner} alt="Welcome" className="w-full h-48 object-cover border-b border-orange-500/20" />
      <div className="p-8">
        <h2 className="text-xl md:text-3xl font-black uppercase tracking-widest mb-4">Welcome to <span className="text-orange-500">V8 PRO SMART</span></h2>
        <p className="text-zinc-400 text-xs md:text-sm mb-8 uppercase tracking-[0.2em] leading-relaxed">Centralized System for Premium AI Architecture is now ONLINE.</p>
        <button onClick={onClose} className="bg-orange-600 text-white px-10 py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-orange-500 transition-all shadow-lg">Enter System</button>
      </div>
    </div>
  </div>
);

const OptionButton = ({ label, selected, onClick, type }) => {
  const isQuality = type === 'quality';
  const activeClass = isQuality ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]";
  return <button onClick={onClick} className={`px-4 py-2 rounded-lg text-[9px] font-black border transition-all ${selected ? activeClass : "bg-black border-white/10 text-zinc-500 hover:border-white/20"}`}>{label}</button>;
};

const PromptResultBox = ({ type, text, copiedBox, onCopy }) => {
  const title = type === 'cctv' ? 'THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER' : type.toUpperCase();
  let colorClass = "text-zinc-500 border-white/5"; 
  if (type === 'abstract') colorClass = "text-purple-500 border-purple-500/20";
  if (type === 'cinematic') colorClass = "text-blue-500 border-blue-500/20";
  if (type === 'photoreal') colorClass = "text-emerald-500 border-emerald-500/20";
  if (type === 'cctv') colorClass = "text-red-500 border-red-500/20";
  return (
    <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative shadow-inner flex flex-col min-h-[300px]">
      <label className={`text-[10px] font-black uppercase tracking-widest mb-4 border-b pb-3 ${colorClass}`}>{title}</label>
      <p className={`w-full font-mono text-[10px] leading-relaxed text-left flex-1 ${text ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{text ? <TypewriterText text={text} speed={10} /> : "AWAITING..."}</p>
      {text && <button onClick={() => onCopy(text, type)} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all bg-white/10 text-white hover:bg-white/20">{copiedBox === type ? "Copied" : "Copy"}</button>}
    </div>
  );
};

const FAQAccordion = ({ faqList }) => {
  const [openIdx, setOpenIdx] = useState(null);
  if (!faqList || faqList.length === 0 || !faqList.some(f => f.q && f.a)) return null;
  return (
    <div className="mt-14 border-t border-white/5 pt-12">
      <h3 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-widest mb-10 border-l-[5px] border-orange-500 pl-5 italic flex items-center gap-4 text-left"><HelpCircle className="w-6 h-6 text-orange-500" /> FREQUENTLY ASKED QUESTIONS</h3>
      <div className="space-y-4 mt-8">
        {faqList.filter(f => f.q && f.a).map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner text-left transition-all">
            <button onClick={() => setOpenIdx(openIdx === idx ? null : idx)} className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.04] transition-colors">
              <h4 className={`font-bold text-[15px] md:text-[18px] uppercase tracking-wider flex items-center gap-3 transition-colors duration-300 ${openIdx === idx ? 'text-orange-500' : 'text-zinc-300'}`}><span className="text-white/30 text-[12px]">Q:</span> {item.q}</h4>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 shrink-0 ${openIdx === idx ? 'rotate-180 text-orange-500' : 'text-zinc-500'}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${openIdx === idx ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><div className="p-6 pt-0 text-white font-bold text-[15px] md:text-[18px] leading-relaxed border-t border-white/5 mt-2 pt-5 tracking-wide"><span className="text-white/30 font-black mr-2 text-[12px] uppercase">A:</span>{item.a}</div></div></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCER PAGE
// ============================================================================
function EnhancerPage() {
  const [demoInput, setDemoInput] = useState(''); const [customerPrompt, setCustomerPrompt] = useState(''); const [generatedPrompts, setGeneratedPrompts] = useState({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); const [isEnhancing, setIsEnhancing] = useState(false); const [selectedAR, setSelectedAR] = useState('16:9'); const [selectedQuality, setSelectedQuality] = useState('4x'); const [copiedBox, setCopiedBox] = useState(''); 
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const handleRollDice = useCallback(() => { setDemoInput(data.getRandomDicePrompt()); setCustomerPrompt(''); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); }, []);
  const handleEnhance = useCallback(() => {
    const subject = (customerPrompt || demoInput || "").trim(); if(!subject) return; setIsEnhancing(true); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setTimeout(() => { try { const std = data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR); const customPhotoreal = `ULTIMATE PHOTOREALISM CORE: ${subject}. Zero-noise crystalline clarity, absolute photographic truth.`; setGeneratedPrompts({ ...std, cctv: customPhotoreal.replace(/neon/gi, "vivid glowing").replace(/cyberpunk/gi, "high-tech futuristic") }); } catch (err) { console.error(err); } finally { setIsEnhancing(false); } }, 1200);
  }, [demoInput, customerPrompt, selectedQuality, selectedAR]);
  const handleCopy = useCallback((text, boxName) => { navigator.clipboard.writeText(text); setCopiedBox(boxName); setTimeout(() => setCopiedBox(''), 2000); }, []);
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white min-h-screen">
      <Helmet><title>10X ENHANCER | AI TOOLS PRO SMART</title></Helmet>
      <div className="mb-10"><Link to="/" className="text-zinc-400 hover:text-white flex items-center gap-2 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> System Registry</Link></div>
      <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all">
         <div className="mb-12 text-left w-full"><h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-orange-500 mb-4">10x Prompt Enhancer</h2><div className="text-[13px] md:text-[15px] font-black text-green-500 uppercase tracking-[0.2em]">Premium tool worth $100/month. Currently free.</div></div>
         <div className="flex flex-col lg:flex-row gap-12 w-full items-stretch">
           <div className="flex-1 w-full lg:max-w-md flex flex-col justify-start space-y-8 text-left">
             <div className="w-full">
               <label className="text-[12px] font-black uppercase text-orange-500 tracking-widest block mb-4 ml-2">1. Target Concept / Subject</label>
               <div className="relative mb-6">
                 <textarea value={demoInput} onChange={e => {setDemoInput(e.target.value); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} placeholder="e.g. 'a golden watch'" disabled={customerPrompt.length > 0} className="w-full bg-black border border-white/10 rounded-xl pl-4 pr-12 py-6 text-white text-[16px] md:text-[18px] font-medium leading-relaxed outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none min-h-[150px]" />
                 {!demoInput && customerPrompt.length === 0 && <button onClick={handleRollDice} className="absolute right-3 top-4 bg-blue-600/10 p-1.5 rounded-lg group hover:bg-blue-600 transition-all"><Dices className="w-4 h-4 text-blue-500 group-hover:text-white" /></button>}
                 {demoInput && <button onClick={() => setDemoInput('')} className="absolute right-3 top-4 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"><X className="w-4 h-4 text-red-500 group-hover:text-white" /></button>}
               </div>
               <label className="text-[12px] font-black uppercase text-orange-500 tracking-widest block mb-4 ml-2">2. Or Paste Your Customer Prompt</label>
               <div className="relative mb-8"><textarea value={customerPrompt} onChange={e => {setCustomerPrompt(e.target.value); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} placeholder="WE'RE WORKING ON SOMETHING AMAZING" disabled={demoInput.length > 0} className="w-full bg-black border border-white/10 rounded-xl p-5 text-white text-[11px] outline-none focus:border-blue-500/50 transition-all shadow-inner resize-none min-h-[160px]" /></div>
               <div className="flex justify-between items-center my-10 px-1">
                  <div className="flex flex-col gap-3"><span className="text-[12px] font-black uppercase text-zinc-100 tracking-widest"><b>ASPECT RATIO</b></span><div className="flex gap-2">{['1:1', '9:16', '16:9', '21:9'].map(ar => <OptionButton key={ar} label={ar} selected={selectedAR === ar} onClick={() => setSelectedAR(ar)} type="ar" />)}</div></div>
                  <div className="flex flex-col gap-3 items-end"><span className="text-[12px] font-black uppercase text-zinc-100 tracking-widest"><b>QUALITY</b></span><div className="flex gap-2">{['1x', '2x', '4x'].map(q => <OptionButton key={q} label={q} selected={selectedQuality === q} onClick={() => setSelectedQuality(q)} type="quality" />)}</div></div>
               </div>
               <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-xl">{isEnhancing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enhance"}</button>
             </div>
           </div>
           <div className="flex-1 w-full flex flex-col h-full relative">
             <label className="text-[12px] font-black uppercase text-blue-500 tracking-widest block mb-4 ml-2">4. V8 Engine Output</label>
             {customerPrompt.length > 0 || (!demoInput && !customerPrompt) ? (
                 <div className="w-full bg-black border border-white/5 rounded-2xl p-8 pb-20 relative flex flex-col items-start shadow-inner h-full min-h-[600px]">
                   {generatedPrompts.single && <div className="text-green-500 font-black text-[11px] uppercase tracking-[0.2em] mb-6 border-b border-green-500/20 pb-4 w-full text-left">Premium Matrix Output</div>}
                   <p className="w-full font-mono text-[11px] md:text-[13px] leading-relaxed text-left flex-1 flex items-center justify-center text-zinc-200">{generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} speed={10} /> : "AWAITING CORE INPUT..."}</p>
                   {generatedPrompts.single && <button onClick={() => handleCopy(generatedPrompts.single, 'single')} className="absolute bottom-6 right-6 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-white/10 text-white hover:bg-white/20">{copiedBox === 'single' ? "Copied! ✓" : "Copy Prompt"}</button>}
                 </div>
             ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full text-left">{['abstract', 'cinematic', 'photoreal', 'cctv'].map((type) => <PromptResultBox key={type} type={type} text={generatedPrompts[type]} copiedBox={copiedBox} onCopy={handleCopy} />)}</div>
             )}
           </div>
         </div>
      </div>
    </div>
  );
}

// ============================================================================
// HOME PAGE (ZLATNA SREDINA - MATRIX KIŠA BLJEŠTI, SLIKE SE VIDE)
// ============================================================================
function HomePage({ apps = [] }) {
  const [activeSlide, setActiveSlide] = useState(0); 
  const [liveVideos, setLiveVideos] = useState([]); 
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); 
  const location = useLocation();
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));

  useEffect(() => { 
    let isMounted = true; 
    const fetchVideos = async () => {
      setIsLoadingVideos(true); 
      const CACHE_KEY = 'v8_yt_cache_v2'; const CACHE_EXPIRY = 24 * 60 * 60 * 1000; const RSS_URL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=UC6ilBUks_oFMSD8CE9qD6lQ`);
      try { const cached = localStorage.getItem(CACHE_KEY); if (cached) { const { data, timestamp } = JSON.parse(cached); if (Date.now() - timestamp < CACHE_EXPIRY) { if (isMounted) { setLiveVideos(data); setIsLoadingVideos(false); } return; } }
        const endpoints = [`https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`, `https://api.allorigins.win/raw?url=${RSS_URL}`, `https://corsproxy.io/?${RSS_URL}`];
        let fetchedData = null;
        for (let url of endpoints) { try { const res = await fetch(url); if (!res.ok) continue; if (url.includes('rss2json')) { const result = await res.json(); if (result?.items?.length > 0) { fetchedData = result.items.slice(0, 8).map(item => ({ title: item.title, url: item.link })); break; } } else { const text = await res.text(); const xmlDoc = new DOMParser().parseFromString(text, "text/xml"); const entries = xmlDoc.querySelectorAll("entry"); if (entries.length > 0) { fetchedData = Array.from(entries).slice(0, 8).map(e => ({ title: e.querySelector("title")?.textContent, url: e.querySelector("link")?.getAttribute("href") })); break; } } } catch (e) {} }
        if (fetchedData && fetchedData.length > 0) { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: fetchedData, timestamp: Date.now() })); if (isMounted) { setLiveVideos(fetchedData); setIsLoadingVideos(false); } } else { throw new Error("API Limit"); }
      } catch (err) { const oldCache = localStorage.getItem(CACHE_KEY); if (oldCache) { if (isMounted) { setLiveVideos(JSON.parse(oldCache).data); setIsLoadingVideos(false); } } else { const hardFallback = [{ title: "V8 PRO SMART ARCHITECTURE", url: "https://www.youtube.com/@SmartAiToolsPro-Smart-AI" }, { title: "LATEST AI INTEL", url: "https://www.youtube.com/@SmartAiToolsPro-Smart-AI" }]; if (isMounted) { setLiveVideos(hardFallback); setIsLoadingVideos(false); } } }
    }; fetchVideos(); return () => { isMounted = false; };
  }, []);

  useEffect(() => { if (location.hash === '#marketplace') { const el = document.getElementById('marketplace'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, [location]);
  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);
  
  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | PROMPT GENERATOR</title></Helmet>
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white">
        
        {/* 1. SLIKE: Ostavljeno veoma blago zatamnjenje (bg-black/20) kako bi slike bile jako svetle */}
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'} z-0`}>
            {item.image && <img src={item.image} className="w-full h-full object-cover" alt="banner" />}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        ))}

        {/* 2. MATRIX KISA: Dodati moćni filteri brightness-150 i saturate-150. Ona sada svetli kao prava neon sijalica preko slika! */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-100 mix-blend-screen brightness-150 saturate-150">
          <MatrixRain />
        </div>

        {/* 3. Donji gradient samo za čitljivost teksta */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full z-20 pointer-events-none" style={{ borderTop: '0.1px solid #f97316' }} />

        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">{(data.BANNER_DATA || []).map((_, i) => <button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />)}</div>
        
        <div className="relative z-30 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.5)]">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-4xl font-black uppercase mb-1.5 tracking-tighter transition-all duration-500 drop-shadow-2xl">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[12px] md:text-sm max-w-lg font-medium opacity-90 drop-shadow-xl">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div id="protocols" className="flex items-center gap-4 mb-10 text-left"><div className="flex items-center gap-2.5 shrink-0"><Youtube className="text-red-600 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">Latest Intel Protocols</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div></div>
        {isLoadingVideos ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">{[...Array(4)].map((_, i) => <div key={i} className="p-[1px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2.5rem] flex flex-col h-full shadow-xl animate-pulse"><div className="bg-[#0a0a0a] rounded-[2.4rem] p-6 flex flex-col h-full"><div className="aspect-video relative overflow-hidden rounded-3xl mb-6 bg-zinc-800/50 border-2 border-zinc-800/50" /><div className="h-4 bg-zinc-800/50 rounded w-3/4 mb-2" /><div className="h-4 bg-zinc-800/50 rounded w-1/2 mb-4" /><div className="h-3 bg-zinc-800/50 rounded w-1/3 mt-auto" /></div></div>)}</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">{liveVideos.map((vid, i) => <data.TutorialCard key={i} vid={vid} />)}</div>}
        <div id="enhancer" className="mb-24 flex flex-col items-center justify-center text-center py-20 border-y border-orange-500/30 scroll-mt-32">
          <div className="bg-orange-600/10 p-4 rounded-full mb-6"><Zap className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" strokeWidth={1.5} /></div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">10X PROMPT ENHANCER</h2>
          <div className="text-[13px] md:text-[15px] font-black text-green-500 uppercase tracking-[0.2em] mb-8">Premium tool worth $100/month. Currently free.</div>
          <p className="text-zinc-400 text-[10px] md:text-[12px] max-w-2xl font-medium uppercase tracking-[0.2em] leading-relaxed mb-10 mx-auto">ACCESS THE PREMIUM AI PROMPT ENGINEERING ENGINE. CONVERT SIMPLE IDEAS INTO MASTERPIECES.<br /><br /><span className="text-orange-500 font-black uppercase">ENTER YOUR PROMPT; WE WILL ANALYZE IT IN DETAIL AND ENHANCE IT TO BE 10X BETTER.</span></p>
          <Link to="/enxance" className="bg-[#ea580c] hover:bg-orange-500 text-white px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all">LAUNCH ENGINE</Link>
        </div>
        <div id="marketplace" className="flex items-center gap-4 mb-10 text-left"><div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">Premium AI Asset Store</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-32">
          {sortedApps.map((app, index) => <MarketplaceCard key={app.id} app={app} index={index} />)}
        </div>
      </div>
    </>
  );
}

// ============================================================================
// SINGLE PRODUCT PAGE
// ============================================================================
function SingleProductPage({ apps = [] }) {
  const { id } = useParams(); const app = apps.find(a => a.id === id); const [activeMedia, setActiveMedia] = useState(0); const [fullScreenImage, setFullScreenImage] = useState(null); const mainVideoRef = useRef(null); const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase text-[10px] tracking-widest">Syncing...</div>;
  
  const currentMedia = app.media?.[activeMedia] || { url: data.bannerUrl, type: 'image' }; 
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i); 
  const { s: sysData } = data.extractSys(app.description); 
  const parts = (app.whopLink || "").split("[SPLIT]");

  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  const appIndex = sortedApps.findIndex(a => a.id === id);
  const ribbonClass = getRibbonStyle(appIndex !== -1 ? appIndex : 0);

  return (
    <div className="bg-[#050505] pt-32 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO SMART</title></Helmet>
      
      {/* FULLSCREEN IMAGE OVERLAY */}
      {fullScreenImage && (
        <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
          <button className="absolute top-6 right-6 text-white bg-black/50 hover:bg-red-600 rounded-full p-3 transition-all cursor-pointer z-[6010] border border-white/20" onClick={() => setFullScreenImage(null)}>
            <X className="w-8 h-8" />
          </button>
          <img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="Enlarged" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> System Registry</button>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[65%]">
            
            {/* BEDŽ IZNAD VIDEA KOJI PRATI BOJU RIBONA */}
            {app.type && (
              <div className="mb-6 flex">
                <div className={`px-6 py-2.5 rounded-full text-white text-[13px] md:text-[15px] font-black uppercase tracking-[0.2em] shadow-xl border border-white/10 ${ribbonClass}`}>
                  {app.type}
                </div>
              </div>
            )}

            <div className="relative mb-6">
              <div className="aspect-video rounded-[2.5rem] overflow-hidden border-2 border-blue-500 bg-black relative group shadow-2xl">
                {!isVideo ? (
                  <>
                    <img src={currentMedia.url} onClick={() => setFullScreenImage(currentMedia.url)} className="w-full h-full object-cover cursor-pointer" alt="" />
                    <button onClick={(e) => { e.stopPropagation(); setFullScreenImage(currentMedia.url); }} className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600">
                      <Maximize className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <video 
                     ref={mainVideoRef} 
                     src={currentMedia.url} 
                     className="w-full h-full object-cover" 
                     controls 
                     controlsList="nodownload" 
                     onContextMenu={(e) => e.preventDefault()} 
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                  />
                )}
                {app.media?.length > 1 && (<div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20"><button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia - 1 + app.media.length) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" /></button><button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia + 1) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" /></button></div>)}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scroll-smooth">{app.media?.map((m, idx) => <button key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-28 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeMedia === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-50 hover:opacity-100'}`}>{(m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i)) ? <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-6 h-6 text-white" /></div></> : <img src={m.url} className="w-full h-full object-cover" />}</button>)}</div>
            <h1 className="text-[24px] md:text-[28px] font-black uppercase tracking-tighter mt-8 mb-4 border-l-[5px] border-orange-500 pl-5 italic leading-tight">{app.name}</h1>
            <div className="flex mb-6"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">{app.category || 'AI ASSET'}</div></div>
            
            {app.headline && <p className="text-[18px] md:text-[22px] text-white font-black mb-10 border-l-[5px] border-orange-500 pl-5 italic leading-relaxed">{app.headline}</p>}
            
            <div className="border-t border-white/5 pt-10 mb-12">
               <FormattedDescription text={app.description} />
               
               {/* NOVI FAQ ACCORDION */}
               {app.faq && app.faq.length > 0 && app.faq.some(f => f.q && f.a) && (
                 <div className="mt-14 border-t border-white/5 pt-12">
                   <details className="group">
                     <summary className="w-full flex items-center justify-between text-left cursor-pointer outline-none list-none [&::-webkit-details-marker]:hidden">
                       <h3 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-widest border-l-[5px] border-orange-500 pl-5 italic flex items-center gap-4 transition-colors group-hover:text-orange-500 m-0">
                         <HelpCircle className="w-6 h-6 text-orange-500" /> 
                         FREQUENTLY ASKED QUESTIONS
                       </h3>
                       <ChevronDown className="w-8 h-8 text-zinc-500 group-hover:text-orange-500 transition-transform duration-300 group-open:rotate-180" />
                     </summary>
                     
                     <div className="mt-10 space-y-4">
                       {app.faq.filter(f => f.q && f.a).map((item, idx) => (
                         <details key={idx} className="group/faq bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner text-left transition-all">
                           <summary className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.04] transition-colors outline-none cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                             <h4 className="font-bold text-[15px] md:text-[18px] uppercase tracking-wider flex items-center gap-3 transition-colors duration-300 text-zinc-300 group-open/faq:text-orange-500 group-hover/faq:text-orange-500">
                               <span className="text-white/30 text-[12px]">Q:</span> {item.q}
                             </h4>
                             <ChevronDown className="w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-300 group-open/faq:rotate-180" />
                           </summary>
                           <div className="p-6 pt-0 text-white font-bold text-[15px] md:text-[18px] leading-relaxed border-t border-white/5 mt-2 pt-5 tracking-wide">
                             <span className="text-white/30 font-black mr-2 text-[12px] uppercase">A:</span>{item.a}
                           </div>
                         </details>
                       ))}
                     </div>
                   </details>
                 </div>
               )}
            </div>

          </div>
          
          <div className="w-full lg:w-[35%] lg:sticky lg:top-40">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8">
              <img src={mojBaner} alt="" className="w-full h-40 object-cover rounded-2xl mb-8" />
              <div className="space-y-6 mb-8">
                <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 py-3.5 flex items-center justify-center"><div className="absolute -top-3 px-4 py-1 rounded-full bg-blue-600 text-[8px] font-black uppercase tracking-widest shadow-lg">Monthly</div><span className="text-2xl font-black">${app.price || '14.99'}</span></div>
                <div className="relative rounded-2xl bg-orange-500/[0.03] border border-orange-500/30 py-3.5 flex items-center justify-center mt-6"><div className="absolute -top-3 px-4 py-1 rounded-full bg-orange-600 text-[8px] font-black uppercase tracking-widest shadow-lg">Lifetime</div><span className="text-2xl font-black">${app.priceLifetime || '88.99'}</span></div>
              </div>
              <a href={data.formatExternalLink(sysData.w || parts[0])} target="_blank" rel="noreferrer" className="w-full py-5 rounded-2xl flex items-center justify-center bg-blue-600 text-white font-black text-[13px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl">Unlock On Whop</a>
              
              <div className="pt-6 border-t border-white/5 mt-6">
                <div className="flex items-center justify-center gap-2 mb-4 text-orange-500">
                  <Award className="w-5 h-5" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Dev Pack</span>
                </div>
                <div className="flex flex-col gap-3">
                  <a href={data.formatExternalLink(sysData.g || parts[1])} target="_blank" rel="noreferrer" className="w-full py-4 rounded-xl flex items-center justify-center gap-2 border border-blue-900 bg-[#0f172a] text-blue-300 font-black text-[11px] uppercase tracking-[0.15em] hover:bg-blue-900 hover:text-white transition-all shadow-lg text-center px-2">
                    UNLOCK REACT SOURCE CODE ON WHOP <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
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
// ADMIN PANEL
// ============================================================================
function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState(''); const [isAuthenticated, setIsAuthenticated] = useState(false); const [editingId, setEditingId] = useState(null); const [isUploading, setIsUploading] = useState(false); 
  const initialForm = { name: '', category: 'AI ASSET', type: '', headline: '', price: '', priceLifetime: '', description: '', media: [], whopLink: '', reactSourceCode: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 
  const sortedAppsAdmin = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  const handleLogin = (e) => { e.preventDefault(); if (password === "v8pro") setIsAuthenticated(true); else alert("DENIED"); };
  
  const handleEditClick = (app) => { 
    const parts = (app.whopLink || "").split("[SPLIT]"); 
    const loadedFaq = app.faq || [];
    const paddedFaq = Array.from({ length: 7 }, (_, i) => loadedFaq[i] || { q: '', a: '' });
    setFormData({ ...app, whopLink: parts[0] || '', reactSourceCode: parts[1] || '', faq: paddedFaq }); 
    setEditingId(app.id); 
    window.scrollTo(0, 0); 
  };
  
  const handleSubmit = async (e) => { e.preventDefault(); const payload = { ...formData, id: editingId || String(Date.now()), whopLink: `${formData.whopLink}[SPLIT]${formData.reactSourceCode}`, faq: formData.faq.filter(f => f.q && f.a) }; try { const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } } catch (err) {} }; 
  const handleImageUpload = async (e) => { const files = Array.from(e.target.files); setIsUploading(true); for (const file of files) { const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); try { const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd }); const resData = await res.json(); setFormData(prev => ({ ...prev, media: [...prev.media, { url: resData.secure_url, type: file.type.startsWith('video/') ? 'video' : 'image' }] })); } catch (err) {} } setIsUploading(false); };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-center">
      <div className="bg-[#0a0a0a] p-12 rounded-[2rem] border-2 border-red-900 shadow-[0_0_30px_rgba(185,28,28,0.2)] max-w-md w-full relative group">
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-700 rounded-tr-xl"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-700 rounded-tl-xl"></div>
        <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-10 shadow-[0_0_15px_rgba(185,28,28,0.3)] animate-pulse" />
        <div className="space-y-4 mb-12">
            <h1 className="text-xl font-black text-red-500 uppercase tracking-[0.3em] font-sans">CLASSIFIED // ADMIN</h1>
            <div className="text-[10px] text-red-700 uppercase font-bold tracking-[0.4em] mb-12">RED ALERT // UNAUTHORIZED LOGINS ARE LOGGED</div>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="CORE KEY" className="w-full bg-black/40 border-2 border-red-900 p-4 rounded-xl text-red-100 outline-none text-center text-[11px] tracking-[0.6em] focus:border-red-600 transition-all" />
            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-red-900 to-red-600 px-6 py-4 font-black uppercase text-[10px] tracking-widest text-white shadow-xl hover:shadow-[0_0_20px_rgba(185,28,28,0.3)] transition-all">Authorize</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white">
      <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" required /><input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Category" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /><input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Ribbon" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Standard Price" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /><input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime Price" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /></div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Headline" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] md:col-span-3" /></div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Whop Link" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /><input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="React Code" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /></div>
           <div className="bg-black border border-white/10 p-4 rounded-xl"><label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">Media</label><div className="flex flex-wrap gap-4">{formData.media.map((m, i) => (<div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group">{m.type === 'video' ? <video src={m.url} className="w-full h-full object-cover" /> : <img src={m.url} className="w-full h-full object-cover" />}<button type="button" onClick={() => setFormData({...formData, media: formData.media.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button></div>))}<label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 text-zinc-500">{isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><UploadCloud className="w-6 h-6 mb-2" /><span className="text-[8px] uppercase font-black">Upload</span></>}<input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" /></label></div></div>
           <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" className="bg-black border border-white/10 p-4 rounded-xl text-[11px] h-96 w-full outline-none font-mono leading-relaxed" />
           <div className="bg-black border border-white/10 p-4 rounded-xl"><label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">FAQ</label><div className="space-y-3">{formData.faq.map((f, i) => (<div key={i} className="flex gap-2"><input type="text" value={f.q} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].q = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Question" className="flex-1 bg-black border border-white/5 p-2 rounded-lg text-[10px]" /><input type="text" value={f.a} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].a = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Answer" className="flex-[2] bg-black border border-white/5 p-2 rounded-lg text-[10px]" /></div>))}</div></div>
           <div className="flex gap-4"><button type="submit" disabled={isUploading} className="flex-1 py-5 rounded-2xl font-black uppercase text-[12px] bg-orange-600 hover:bg-orange-500 transition-all">Execute Deploy</button>{editingId && <button type="button" onClick={() => {setFormData(initialForm); setEditingId(null);}} className="px-8 py-5 rounded-2xl bg-zinc-800 uppercase font-black text-[12px]">Cancel</button>}</div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">{sortedAppsAdmin.map(app => (<div key={app.id} className="p-5 bg-black border border-white/10 rounded-[1.5rem] flex flex-col gap-4 shadow-xl"><div className="aspect-video relative overflow-hidden rounded-2xl bg-zinc-900">{app.media?.[0]?.type === 'video' ? <video src={`${app.media[0].url}#t=0.001`} className="w-full h-full object-cover" muted /> : <img src={data.getMediaThumbnail(app.media?.[0]?.url)} className="w-full h-full object-cover" alt="" />}</div><div className="flex justify-between items-start gap-4"><div><span className="text-[13px] font-black uppercase text-white line-clamp-2">{app.name}</span><span className="text-[9px] text-zinc-500 block mt-1">ID: {app.id}</span></div><div className="flex gap-2"><button type="button" onClick={() => handleEditClick(app)} className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 transition-all"><Edit className="w-4 h-4" /></button><button type="button" onClick={async () => { if(window.confirm("Delete?")) { await fetch(`${API_URL}/${app.id}`, { method: 'DELETE' }); refreshData(); } }} className="p-2.5 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600 transition-all"><Trash2 className="w-4 h-4" /></button></div></div></div>))}</div>
        </form>
    </div>
  );
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true); const [showBanner, setShowBanner] = useState(false); const location = useLocation();
  useEffect(() => { const timer = setTimeout(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, 50); return () => clearTimeout(timer); }, []);
  const handleHomeClick = (e) => { if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.replaceState(null, '', '/'); } };
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative pb-20 lg:pb-0 text-left">
      {isBooting && <FullScreenBoot onComplete={() => { setIsBooting(false); setShowBanner(true); window.scrollTo(0,0); }} />}
      {!isBooting && showBanner && <WelcomeBanner onClose={() => setShowBanner(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]"><nav className="w-full px-4 md:px-8 py-3 md:py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg"><div className="max-w-7xl mx-auto flex justify-between items-center px-2"><Link to="/" onClick={handleHomeClick} className="flex items-center gap-4 group"><img src={data.logoUrl} className="h-8 md:h-10 object-contain animate-pulse" alt="logo" /><span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span></Link><div className="flex items-center gap-3 md:gap-4 font-black uppercase text-[10px] md:text-[11px] tracking-widest"><Link to="/#marketplace" className="bg-blue-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>{location.pathname !== '/enxance' && (<Link to="/enxance" className="bg-transparent border-2 border-orange-600 text-orange-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full shadow-xl hover:bg-orange-600/10 transition-all flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 10X ENHANCER</Link>)}<Link to="/" onClick={handleHomeClick} className="bg-emerald-900/60 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-emerald-400 border border-emerald-800 shadow-xl">Home</Link><Link to="/admin" className="bg-orange-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-white shadow-xl">Admin</Link></div></div></nav></div>
      <div className="flex-1 text-left pt-20"><Routes><Route path="/" element={<HomePage apps={appsData} />} /><Route path="/enxance" element={<EnhancerPage />} /><Route path="/app/:id" element={<SingleProductPage apps={appsData} />} /><Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} /></Routes></div>
      <SmartScrollButton />
      <footer className="flex flex-col items-center gap-4 text-center text-zinc-100 font-black italic uppercase text-[9px] tracking-[0.5em] py-6 mt-8" style={{ borderTop: '0.5px solid #f97316' }}><div className="flex items-center gap-6"><a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a><a href="https://www.youtube.com/@SmartAiToolsPro-Smart-AI" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><Youtube size={20} className="text-[#FF0000]" /></a><a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-4 w-4 object-contain" /></a><a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" className="h-4 w-4 object-contain" /></a></div><div>© 2026 <span className="text-blue-500 font-black">AI TOOLS</span> <span className="text-orange-500 font-black">PRO SMART</span> <span className="mx-1 text-white font-black">|</span> ALL RIGHTS RESERVED</div></footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]); const refreshData = useCallback(() => { fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []); useEffect(() => { refreshData(); }, [refreshData]);
  return (<HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><data.LiveSalesNotification apps={appsData} /></Router></HelmetProvider>); 
}