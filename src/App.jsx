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
  MatrixRain, TutorialCard, AssetCard 
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
  const baseClass = isQuality 
    ? "px-4 py-2 rounded-lg text-[9px] font-black border transition-all"
    : "px-3 py-2 rounded-lg text-[9px] font-black border transition-all";
  const activeClass = isQuality
    ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]"
    : "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]";
  const inactiveClass = "bg-black border-white/10 text-zinc-500 hover:border-white/20";
  
  return (
    <button onClick={onClick} className={`${baseClass} ${selected ? activeClass : inactiveClass}`}>
      {label}
    </button>
  );
};

const PromptResultBox = ({ type, text, copiedBox, onCopy }) => {
  const title = type === 'cctv' ? 'THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER' : type.toUpperCase();
  return (
    <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative shadow-inner flex flex-col min-h-[300px]">
      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 border-b border-white/5 pb-3">{title}</label>
      <p className={`w-full font-mono text-[10px] leading-relaxed text-left flex-1 ${text ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
        {text ? <TypewriterText text={text} speed={10} /> : "AWAITING..."}
      </p>
      {text && (
        <button onClick={() => onCopy(text, type)} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all bg-white/10 text-white hover:bg-white/20">
          {copiedBox === type ? "Copied" : "Copy"}
        </button>
      )}
    </div>
  );
};

const FAQAccordion = ({ faqList }) => {
  const [openIdx, setOpenIdx] = useState(null);
  
  if (!faqList || faqList.length === 0 || !faqList.some(f => f.q && f.a)) return null;

  return (
    <div className="mt-12 border-t border-white/5 pt-10">
      <h3 className="text-[12px] font-black text-white uppercase tracking-widest mb-6 border-l-4 border-orange-500 pl-4 italic flex items-center gap-3 text-left">
        <HelpCircle className="w-4 h-4 text-orange-500" /> FREQUENTLY ASKED QUESTIONS
      </h3>
      <div className="space-y-4 mt-8">
        {faqList.filter(f => f.q && f.a).map((item, idx) => (
          <div key={idx} className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner text-left transition-all">
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)} 
              className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.04] transition-colors"
            >
              <h4 className="text-orange-500 font-bold text-[13px] uppercase tracking-wider flex items-center gap-3">
                <span className="text-white/30 text-[10px]">Q:</span> {item.q}
              </h4>
              <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === idx && (
              <div className="p-6 pt-0 text-zinc-400 text-[12px] leading-relaxed border-t border-white/5 mt-2 pt-4">
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
// HOME PAGE
// ============================================================================
function HomePage({ apps = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveVideos, setLiveVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); 
  const [demoInput, setDemoInput] = useState('');
  const [customerPrompt, setCustomerPrompt] = useState(''); 
  const [generatedPrompts, setGeneratedPrompts] = useState({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedAR, setSelectedAR] = useState('16:9');
  const [selectedQuality, setSelectedQuality] = useState('4x');
  const [copiedBox, setCopiedBox] = useState(''); 
  
  const location = useLocation();

  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));

  useEffect(() => { 
    let isMounted = true;
    const fetchVideos = async () => {
      setIsLoadingVideos(true);
      const RSS_URL = encodeURIComponent(`https://www.youtube.com/feeds/videos.xml?channel_id=UC6ilBUks_oFMSD8CE9qD6lQ`);
      
      const endpoints = [
        `https://api.rss2json.com/v1/api.json?rss_url=${RSS_URL}`,
        `https://api.allorigins.win/raw?url=${RSS_URL}`,
        `https://api.codetabs.com/v1/proxy?quest=${RSS_URL}`
      ];

      for (let url of endpoints) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          
          if (url.includes('rss2json')) {
            const result = await res.json();
            if (result && result.items && result.items.length > 0) {
               if (isMounted) {
                 setLiveVideos(result.items.slice(0, 8).map(item => ({ title: item.title, url: item.link })));
                 setIsLoadingVideos(false);
               }
               return; 
            }
          } else {
            const text = await res.text();
            const xmlDoc = new DOMParser().parseFromString(text, "text/xml");
            const entries = xmlDoc.querySelectorAll("entry");
            if (entries && entries.length > 0) {
               if (isMounted) {
                 setLiveVideos(Array.from(entries).slice(0, 8).map(e => ({ 
                   title: e.querySelector("title")?.textContent, 
                   url: e.querySelector("link")?.getAttribute("href") 
                 })));
                 setIsLoadingVideos(false);
               }
               return; 
            }
          }
        } catch (e) {
          console.warn("Proxy switch...", url);
        }
      }
      
      if (isMounted) {
        setIsLoadingVideos(false);
      }
    };
    
    fetchVideos();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => { 
    if (location.hash === '#marketplace') { 
      setTimeout(() => { const el = document.getElementById('marketplace'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); 
    } else if (location.hash === '#enhancer') {
      setTimeout(() => { const el = document.getElementById('enhancer'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); 
    }
  }, [location]);

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  const handleRollDice = useCallback(() => { 
    setDemoInput(data.getRandomDicePrompt()); 
    setCustomerPrompt(''); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); 
  }, []);
  
  const handleEnhance = useCallback(() => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setTimeout(() => {
      setGeneratedPrompts(data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR));
      setIsEnhancing(false);
    }, 1200);
  }, [demoInput, customerPrompt, selectedQuality, selectedAR]);

  const handleCopy = useCallback((text, boxName) => { 
    navigator.clipboard.writeText(text); 
    setCopiedBox(boxName); 
    setTimeout(() => setCopiedBox(''), 2000); 
  }, []);

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | PROMPT GENERATOR</title></Helmet>
      
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white">
        <MatrixRain />
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
            {item.image && <img src={item.image} className="w-full h-full object-cover" alt="banner" />}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full z-20" style={{ borderTop: '0.1px solid #f97316' }}></div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {(data.BANNER_DATA || []).map((_, i) => (<button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-4xl font-black uppercase mb-1.5 tracking-tighter transition-all duration-500">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[12px] md:text-sm max-w-lg font-medium opacity-90">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div id="protocols" className="flex items-center gap-4 mb-10 text-left">
          <div className="flex items-center gap-2.5 shrink-0"><Youtube className="text-red-600 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">Latest Intel Protocols</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div>
        </div>
        
        {isLoadingVideos ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-[1px] bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2.5rem] flex flex-col h-full shadow-xl animate-pulse">
                <div className="bg-[#0a0a0a] rounded-[2.4rem] p-6 flex flex-col h-full">
                  <div className="aspect-video relative overflow-hidden rounded-3xl mb-6 bg-zinc-800/50 border-2 border-zinc-800/50"></div>
                  <div className="h-4 bg-zinc-800/50 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-zinc-800/50 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-zinc-800/50 rounded w-1/3 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {liveVideos.map((vid, i) => (<data.TutorialCard key={i} vid={vid} />))}
          </div>
        )}

        <div id="enhancer" className="mb-24 scroll-mt-32">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-12 md:p-20 shadow-2xl relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all">
             <div className="mb-12 text-left w-full">
                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-orange-500 mb-4">10x Prompt Enhancer</h2>
                <div className="text-[13px] md:text-[15px] font-black text-green-500 uppercase tracking-[0.2em]">Premium tool worth $100/month. Currently free.</div>
             </div>
             
             <div className="flex flex-col lg:flex-row gap-12 w-full items-stretch">
               <div className="flex-1 w-full lg:max-w-md flex flex-col justify-start space-y-8 text-left">
                 <div className="w-full">
                   <label className="text-[12px] font-black uppercase text-orange-500 tracking-widest block mb-4 ml-2">1. Target Concept / Subject</label>
                   <div className="relative mb-6">
                     <textarea value={demoInput} onChange={e => {setDemoInput(e.target.value); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} placeholder="e.g. 'a golden watch'" disabled={customerPrompt.length > 0} className={`w-full bg-black border rounded-xl pl-4 pr-12 py-5 text-white text-[11px] outline-none transition-all shadow-inner resize-none min-h-[150px] ${customerPrompt.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} />
                     {!demoInput && customerPrompt.length === 0 && (<button onClick={handleRollDice} className="absolute right-3 top-4 bg-blue-600/10 p-1.5 rounded-lg group hover:bg-blue-600 transition-all"><Dices className="w-4 h-4 text-blue-500 group-hover:text-white" /></button>)}
                     {demoInput && (<button onClick={() => {setDemoInput(''); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} className="absolute right-3 top-4 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"><X className="w-4 h-4 text-red-500 group-hover:text-white" /></button>)}
                   </div>
                   
                   <label className="text-[12px] font-black uppercase text-orange-500 tracking-widest block mb-4 ml-2">2. Or Paste Your Customer Prompt</label>
                   <div className="relative mb-8"><textarea value={customerPrompt} onChange={e => {setCustomerPrompt(e.target.value); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });}} placeholder="WE'RE WORKING ON SOMETHING AMAZING — COMING SOON" disabled={demoInput.length > 0} className={`w-full bg-black border rounded-xl p-5 pr-12 text-white text-[11px] outline-none transition-all shadow-inner resize-none min-h-[160px] ${demoInput.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} /></div>
                   
                   <div className="flex justify-between items-center my-10 px-1">
                      <div className="flex flex-col gap-3">
                        <span className="text-[12px] font-black uppercase text-zinc-600 tracking-widest">Aspect Ratio</span>
                        <div className="flex gap-2">
                          {['1:1', '9:16', '16:9', '21:9'].map(ar => (
                            <OptionButton key={ar} label={ar} selected={selectedAR === ar} onClick={() => setSelectedAR(ar)} type="ar" />
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 items-end">
                        <span className="text-[12px] font-black uppercase text-zinc-600 tracking-widest">Quality</span>
                        <div className="flex gap-2">
                          {['1x', '2x', '4x'].map(q => (
                            <OptionButton key={q} label={q} selected={selectedQuality === q} onClick={() => setSelectedQuality(q)} type="quality" />
                          ))}
                        </div>
                      </div>
                   </div>
                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-xl">
                     {isEnhancing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enhance"}
                   </button>
                 </div>
               </div>
               
               <div className="flex-1 w-full flex flex-col h-full relative">
                 <label className="text-[12px] font-black uppercase text-blue-500 tracking-widest block mb-4 ml-2">4. V8 Engine Output</label>
                 {customerPrompt.length > 0 || (!demoInput && !customerPrompt) ? (
                     <div className="w-full bg-black border border-white/5 rounded-2xl p-8 pb-20 relative flex flex-col items-start shadow-inner h-full min-h-[600px]">
                       {generatedPrompts.single && (<div className="text-green-500 font-black text-[11px] uppercase tracking-[0.2em] mb-6 border-b border-green-500/20 pb-4 w-full text-left">Premium Matrix Output</div>)}
                       <p className={`w-full transition-all duration-500 font-mono text-[11px] md:text-[13px] leading-relaxed text-left ${generatedPrompts.single ? 'text-zinc-200' : 'text-zinc-600 italic tracking-widest flex-1 flex items-center justify-center'}`}>{generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} speed={10} /> : "AWAITING CORE INPUT..."}</p>
                       {generatedPrompts.single && (<button onClick={() => handleCopy(generatedPrompts.single, 'single')} className="absolute bottom-6 right-6 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all bg-white/10 text-white hover:bg-white/20">{copiedBox === 'single' ? "Copied! ✓" : "Copy Prompt"}</button>)}
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 gap-6 w-full h-full text-left">
                        {['abstract', 'cinematic', 'photoreal', 'cctv'].map((type) => (
                           <PromptResultBox key={type} type={type} text={generatedPrompts[type]} copiedBox={copiedBox} onCopy={handleCopy} />
                        ))}
                     </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        <div id="marketplace" className="flex items-center gap-4 mb-10 text-left">
          <div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">Premium AI Asset Store</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-32">
          {sortedApps.map((app) => (<data.AssetCard key={app.id} app={app} />))}
        </div>
      </div>
    </>
  );
}

// ============================================================================
// SINGLE PRODUCT PAGE
// ============================================================================
function SingleProductPage({ apps = [] }) {
  const { id } = useParams();
  const app = apps.find(a => a.id === id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const mainVideoRef = useRef(null);
  const thumbScrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  const checkScroll = useCallback(() => {
    const el = thumbScrollRef.current; if (!el) return;
    setShowLeftArrow(el.scrollLeft > 20); setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
  }, []);

  useEffect(() => { checkScroll(); window.addEventListener('resize', checkScroll); return () => window.removeEventListener('resize', checkScroll); }, [app, checkScroll]);

  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase text-[10px] tracking-widest">Syncing...</div>;
  
  const currentMedia = app.media?.[activeMedia] || { url: data.bannerUrl, type: 'image' };
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const { s: sysData } = data.extractSys(app.description);
  const parts = (app.whopLink || "").includes("[SPLIT]") ? app.whopLink.split("[SPLIT]") : [app.whopLink, "", ""];
  const mainWhopLink = data.formatExternalLink(sysData.w || parts[0]);
  const sourceCodeWhopLink = data.formatExternalLink(sysData.g || parts[1]);

  return (
    <div className="bg-[#050505] pt-32 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO SMART</title></Helmet>
      {fullScreenImage && (<div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}><button className="absolute top-10 right-10 text-white"><X className="w-10 h-10" /></button><img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="" /></div>)}
      <div className="max-w-7xl mx-auto relative">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> System Registry</button>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[70%]">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-orange-500 bg-black mb-6 relative group shadow-2xl cursor-pointer">
              {!isVideo ? <><img src={currentMedia.url} onClick={() => setFullScreenImage(currentMedia.url)} className="w-full h-full object-cover" alt="" /><button className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 border border-white/10 transition-all z-20"><Maximize2 className="w-4 h-4" /></button></> : <UniversalVideoPlayer videoRef={mainVideoRef} url={currentMedia.url} />}
              {app.media?.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20">
                  <button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia - 1 + app.media.length) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:text-orange-500"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
                  <button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia + 1) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all hover:text-orange-500"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
                </div>
              )}
            </div>
            <div ref={thumbScrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scroll-smooth relative z-20">
              {app.media?.map((m, idx) => (<button key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-28 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeMedia === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-50 hover:opacity-100'}`}>{(m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i)) ? <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-6 h-6 text-white" /></div></> : <img src={m.url} className="w-full h-full object-cover" />}</button>))}
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4">{app.name}</h1>
            <div className="flex mb-6"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">{app.category || sysData.b || 'AI ASSET'}</div></div>
            {app.headline && <p className="text-sm md:text-base text-white font-black mb-10 leading-tight border-l-4 border-orange-500 pl-5 italic">{app.headline}</p>}
            
            <div className="border-t border-white/5 pt-8 mb-12">
              {renderDescription(app.description)}
              <FAQAccordion faqList={app.faq} />
            </div>

          </div>
          <div className="w-full lg:w-[30%] lg:sticky lg:top-40">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src={mojBaner} alt="Registry Banner" className="w-full h-32 object-cover border-b border-white/5" />
              <div className="p-6 lg:p-8 pt-8">
                <div className="space-y-6 mb-8">
                  <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 py-3.5 flex items-center justify-center mt-2"><div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 rounded-full"><span className="text-[8px] text-white uppercase font-black tracking-[0.2em] whitespace-nowrap">Monthly Registry</span></div><span className="text-2xl font-black text-white tracking-tighter mt-1">${app.price || '14.99'}</span></div>
                  <div className="relative rounded-2xl bg-orange-500/[0.03] border border-orange-500/30 py-3.5 flex items-center justify-center mt-6"><div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 rounded-full"><span className="text-[8px] text-white uppercase font-black tracking-[0.2em] whitespace-nowrap">Lifetime Registry</span></div><span className="text-2xl font-black text-white tracking-tighter mt-1">${app.priceLifetime || '88.99'}</span></div>
                </div>
                <div className="space-y-6">
                  <a href={mainWhopLink} target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-[1rem] flex items-center justify-center bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl">Unlock Access On Whop</a>
                  <div className="pt-6 border-t border-white/5"><div className="flex items-center gap-2 mb-4 text-orange-500"><Award className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Dev Pack</span></div><div className="flex flex-col gap-3"><a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border border-blue-900 bg-[#0f172a] text-blue-300 font-black text-[8px] uppercase tracking-[0.15em] hover:bg-blue-900 hover:text-white transition-all">React Source Code <ArrowRight className="w-3.5 h-3.5" /></a></div></div>
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
// INTELLIGENCE & ADMIN
// ============================================================================
function IntelligenceDashboard() {
  const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, whopClicks: 0, session: "4m 21s" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "site_stats"), orderBy("timestamp", "desc"), limit(400));
        const snapshot = await getDocs(q);
        const allEvents = snapshot.docs.map(doc => doc.data());
        setStats({ totalViews: allEvents.length, uniqueVisitors: new Set(allEvents.map(e => e.sessionId)).size, whopClicks: allEvents.filter(e => e.action === "whop_click").length, session: "4m 21s" });
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchStats();
  }, []);
  if (loading) return <div className="py-20 text-center text-zinc-600 font-black uppercase text-[10px]">Syncing Stats...</div>;
  return ( 
    <div className="space-y-6 animate-fade-in text-left"> 
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4"> 
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem]"> <div className="flex items-center gap-3 mb-3"><Eye className="w-4 h-4 text-blue-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Views</span></div><div className="text-2xl font-black text-white">{stats.totalViews}</div> </div> 
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem]"> <div className="flex items-center gap-3 mb-3"><Users className="w-4 h-4 text-green-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Unique</span></div><div className="text-2xl font-black text-white">{stats.uniqueVisitors}</div> </div> 
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem]"> <div className="flex items-center gap-3 mb-3"><Clock className="w-4 h-4 text-purple-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Session</span></div><div className="text-2xl font-black text-white">{stats.session}</div> </div> 
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem]"> <div className="flex items-center gap-3 mb-3"><MousePointerClick className="w-4 h-4 text-orange-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Clicks</span></div><div className="text-2xl font-black text-orange-500">{stats.whopClicks}</div> </div> 
      </div> 
    </div> 
  ); 
}

function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('system');
  const [isUploading, setIsUploading] = useState(false);
  
  const initialForm = { name: '', category: 'AI ASSET', type: '', headline: '', price: '', priceLifetime: '', description: data.ADMIN_DEFAULT_DESC, media: [], whopLink: '', reactSourceCode: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 

  const handleLogin = async (e) => { e.preventDefault(); if (password === "v8pro") setIsAuthenticated(true); else alert("DENIED"); };
  
  const handleEditClick = (app) => { 
    const dbWhopField = app.whopLink || ""; const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, "", ""];
    setFormData({ ...app, whopLink: parts[0], reactSourceCode: parts[1] || '', faq: (app.faq || []).length >= 7 ? app.faq : Array.from({ length: 7 }, (_, i) => app.faq?.[i] || { q: '', a: '' }) }); 
    setEditingId(app.id); window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; 
    const payload = { ...formData, id: editingId || String(Date.now()), whopLink: combinedWhopField, faq: formData.faq.filter(f => f.q && f.a) }; 
    try { const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } } catch (err) {} 
  }; 

  const handleDelete = async (id) => {
    if(!window.confirm("Delete protocol?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if(res.ok) { if(editingId === id) { setFormData(initialForm); setEditingId(null); } refreshData(); }
    } catch(e) {}
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setIsUploading(true);
    const uploadedMedia = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET);
      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
        const resData = await res.json();
        uploadedMedia.push({ url: resData.secure_url, type: file.type.startsWith('video/') ? 'video' : 'image' });
      } catch (err) { console.error("Upload error", err); }
    }
    setFormData(prev => ({ ...prev, media: [...(prev.media || []), ...uploadedMedia] }));
    setIsUploading(false);
  };

  if (!isAuthenticated) return ( <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-white text-center"><div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-orange-500/20 max-w-md w-full shadow-2xl"><Fingerprint className="w-12 h-12 text-orange-500 mx-auto mb-8" /><h2 className="text-white font-black uppercase mb-8 tracking-[0.5em] text-xs">Admin Terminal</h2><form onSubmit={handleLogin} className="space-y-6"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none text-center text-[11px] tracking-[0.6em]" /><button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 font-black uppercase text-[10px] tracking-widest shadow-xl">Authorize</button></form></div></div> );
  
  return ( 
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white"> 
      <div className="flex gap-4 mb-10 overflow-hidden"> 
        <button onClick={() => setTab('intelligence')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'intelligence' ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-500'}`}>Intelligence</button> 
        <button onClick={() => setTab('system')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'system' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500'}`}>System Registry</button> 
      </div> 
      {tab === 'system' && (
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" required />
             <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Category (e.g. AI ASSET)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
             <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Ribbon (HOT 🔥)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Headline" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] md:col-span-3" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Standard License Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
             <input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime Access Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Whop Main Link" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
             <input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="React Source Code Link" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
           </div>

           <div className="bg-black border border-white/10 p-4 rounded-xl">
             <label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">Media Upload (Images/Videos)</label>
             <div className="flex flex-wrap gap-4">
               {(formData.media || []).map((m, i) => (
                 <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-white/20 group">
                   {m.type === 'video' ? <video src={m.url} className="w-full h-full object-cover" /> : <img src={m.url} className="w-full h-full object-cover" />}
                   <button type="button" onClick={() => {
                     const newMedia = [...formData.media];
                     newMedia.splice(i, 1);
                     setFormData({...formData, media: newMedia});
                   }} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3" /></button>
                 </div>
               ))}
               <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:text-orange-500 transition-all text-zinc-500">
                 {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><UploadCloud className="w-6 h-6 mb-2" /><span className="text-[8px] uppercase font-black">Upload</span></>}
                 <input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
               </label>
             </div>
           </div>

           <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-[11px] h-64 w-full resize-none outline-none font-mono" />
           
           <div className="bg-black border border-white/10 p-4 rounded-xl">
             <label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">FAQ Section (7 Max)</label>
             <div className="space-y-3">
               {formData.faq.map((f, i) => (
                 <div key={i} className="flex gap-2">
                   <input type="text" value={f.q} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].q = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder={`Question ${i+1}`} className="flex-1 bg-[#0a0a0a] border border-white/5 p-2 rounded-lg text-[10px] text-white" />
                   <input type="text" value={f.a} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].a = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder={`Answer ${i+1}`} className="flex-[2] bg-[#0a0a0a] border border-white/5 p-2 rounded-lg text-[10px] text-white" />
                 </div>
               ))}
             </div>
           </div>

           <div className="flex gap-4">
             <button type="submit" disabled={isUploading} className="flex-1 py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest bg-orange-600 hover:bg-orange-500 transition-all disabled:opacity-50">Execute Deploy</button>
             {editingId && <button type="button" onClick={() => { setFormData(initialForm); setEditingId(null); }} className="px-8 py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest bg-zinc-800 hover:bg-zinc-700 transition-all">Cancel</button>}
           </div>

           {/* OVDJE JE NOVI, VEĆI PRIKAZ KARTICA U ADMIN PANELU */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 border-t border-white/10">
              {apps.map(app => {
                const mediaItem = app.media?.[0];
                const isVideo = mediaItem?.type === 'video' || mediaItem?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
                const displayUrl = isVideo ? `${mediaItem.url}#t=0.001` : data.getMediaThumbnail(mediaItem?.url);

                return (
                  <div key={app.id} className="p-5 bg-black border border-white/10 rounded-[1.5rem] flex flex-col gap-4 group hover:border-orange-500/30 transition-all shadow-xl">
                    <div className="aspect-video relative overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
                      {isVideo ? (
                        <video src={displayUrl} className="w-full h-full object-cover" muted playsInline />
                      ) : (
                        <img src={displayUrl} className="w-full h-full object-cover" alt={app.name} />
                      )}
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black uppercase text-white leading-tight line-clamp-2">{app.name}</span>
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1.5">{app.category || 'AI ASSET'}</span>
                      </div>
                      <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-all shrink-0">
                        <button type="button" onClick={() => handleEditClick(app)} className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDelete(app.id)} className="p-2.5 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
           </div>
        </form>
      )}
      {tab === 'intelligence' && <IntelligenceDashboard />}
    </div> 
  ); 
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleHomeClick = (e) => { 
    if (location.pathname === '/') { 
      e.preventDefault(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
      window.history.replaceState(null, '', '/'); 
    } 
  };
  
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative pb-20 lg:pb-0 text-left">
      
      {isBooting && <FullScreenBoot onComplete={() => { setIsBooting(false); setShowBanner(true); window.scrollTo(0,0); }} />}
      
      {!isBooting && showBanner && <WelcomeBanner onClose={() => setShowBanner(false)} />}

      <div className="fixed top-0 left-0 w-full z-[1000]">
        <nav className="w-full px-4 md:px-8 py-3 md:py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-4 group">
              <img src={data.logoUrl} className="h-8 md:h-10 object-contain animate-pulse" alt="logo" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4 font-black uppercase text-[10px] md:text-[11px] tracking-widest">
              <Link to="/#marketplace" className="bg-blue-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              <Link to="/#enhancer" className="bg-transparent border-2 border-orange-600 text-orange-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full shadow-xl hover:bg-orange-600/10 transition-all flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 10X ENHANCER</Link>
              <Link to="/" onClick={handleHomeClick} className="bg-emerald-900/60 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-emerald-400 border border-emerald-800 shadow-xl">Home</Link>
              <Link to="/admin" className="bg-orange-600 px-4 md:px-5 py-1.5 md:py-2 rounded-full text-white shadow-xl">Admin</Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1 text-left pt-20"><Routes><Route path="/" element={<HomePage apps={appsData} />} /><Route path="/app/:id" element={<SingleProductPage apps={appsData} />} /><Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} /></Routes></div>
      
      <footer 
        className="flex flex-col items-center gap-4 text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em] py-6 mt-8"
        style={{ borderTop: '0.5px solid #f97316' }}
      >
        <div className="flex items-center gap-6">
            <a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg>
            </a>
            <a href="https://www.youtube.com/@SmartAiToolsPro-Smart-AI" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
               <Youtube size={20} className="text-[#FF0000]" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
               <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-4 w-4 object-contain" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity">
               <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" className="h-4 w-4 object-contain" />
            </a>
        </div>
        <div>
          © 2026 <span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span> <span className="mx-1">|</span> ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  const refreshData = useCallback(() => { fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []);
  useEffect(() => { refreshData(); }, [refreshData]);
  return ( <HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><data.LiveSalesNotification apps={appsData} /></Router></HelmetProvider> ); 
}