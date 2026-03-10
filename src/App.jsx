import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  PlayCircle, Sparkles, Youtube, X, ChevronDown, Zap, ChevronLeft, ChevronRight, FileCode, Award, 
  ArrowRight, Maximize2, PlusCircle, Edit, Trash2, UploadCloud, Loader2, Database, Fingerprint, Terminal,
  Video, Camera, Cctv, Dices, HelpCircle, Eye, MousePointerClick, Clock, Users, ShoppingCart, Copy, Lock, Shield, CheckCircle2
} from 'lucide-react';

import { db } from './firebase';
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

import * as data from './data';
import { 
  TypewriterText, UniversalVideoPlayer, renderDescription, FullScreenBoot, 
  MatrixRain, UrgencyBar, TutorialCard, AssetCard, LiveSalesNotification, 
  StarIcon, trackEvent 
} from './data';
import mojBaner from './moj-baner.png'; 

const BASE_BACKEND_URL = "https://aitoolsprosmart-becend-production.up.railway.app"; 
const API_URL = `${BASE_BACKEND_URL}/api/products`;
const VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/youtube`; 
const HIDDEN_VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/hidden-videos`;

// ============================================================================
// HOME PAGE
// ============================================================================
function HomePage({ apps = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveVideos, setLiveVideos] = useState([]);
  const [demoInput, setDemoInput] = useState('');
  const [customerPrompt, setCustomerPrompt] = useState(''); 
  const [generatedPrompts, setGeneratedPrompts] = useState({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [selectedAR, setSelectedAR] = useState('16:9');
  const [selectedQuality, setSelectedQuality] = useState('4x');
  const [copiedBox, setCopiedBox] = useState(''); 
  
  const location = useLocation();

  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  const sortedVideos = [...liveVideos].reverse();

  useEffect(() => { 
    if(VIDEOS_API_URL) {
      fetch(VIDEOS_API_URL).then(res => res.json()).then(db => { 
        if (Array.isArray(db) && db.length > 0) setLiveVideos(db); else setLiveVideos(data.MY_VIDEOS || []);
      }).catch(() => setLiveVideos(data.MY_VIDEOS || [])); 
    }
  }, []);

  useEffect(() => { 
    if (location.hash === '#marketplace') { 
      setTimeout(() => { const el = document.getElementById('marketplace'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); 
    } else if (location.hash === '#enhancer') {
      setTimeout(() => { const el = document.getElementById('enhancer'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 100); 
    } else if (location.hash === '#top') {
      setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, 100);
    }
  }, [location]);

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  const handleRollDice = () => { setDemoInput(data.getRandomDicePrompt()); setCustomerPrompt(''); };
  const handleEnhance = () => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setTimeout(() => {
      setGeneratedPrompts(data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR));
      setIsEnhancing(false);
    }, 800);
  };
  const handleCopy = (text, boxName) => { navigator.clipboard.writeText(text); setCopiedBox(boxName); setTimeout(() => setCopiedBox(''), 2000); };

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | PROMPT GENERATOR</title></Helmet>
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black pt-24 text-white text-left">
        <MatrixRain />
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
            {item.url && <img src={item.url} className="w-full h-full object-cover mt-12" alt="banner" />}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full z-20" style={{ borderTop: '0.1px solid #f97316' }}></div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft className="w-6 h-6" strokeWidth={3} /></button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight className="w-6 h-6" strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {(data.BANNER_DATA || []).map((_, i) => (<button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-3xl font-black uppercase mb-1.5 tracking-tighter transition-all duration-500">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[10px] md:text-xs max-w-lg font-medium opacity-90">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div id="protocols" className="flex items-center gap-4 mb-10 text-left"><div className="flex items-center gap-2.5 shrink-0"><Youtube className="text-red-600 w-4 h-4" /><h3 className="text-white font-black uppercase text-[10px] tracking-widest italic text-left">Latest Intel Protocols</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 text-left">
          {sortedVideos.map((vid, i) => (<TutorialCard key={i} vid={vid} />))}
        </div>

        <div id="enhancer" className="mb-24 scroll-mt-32">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all">
             <div className="mb-8 text-left w-full"><h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-2">10x Prompt Enhancer</h2><div className="text-[10px] md:text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Premium tool worth $100/month. Currently free.</div></div>
             <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
               <div className="flex-1 w-full lg:max-w-md flex flex-col justify-start space-y-6 text-left">
                 <div className="w-full">
                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">1. Target Concept / Subject</label>
                   <div className="relative mb-4">
                     <input type="text" value={demoInput} onChange={e => setDemoInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEnhance()} placeholder="e.g. 'a golden watch'" disabled={customerPrompt.length > 0} className={`w-full bg-black border rounded-xl pl-4 pr-12 py-4 text-white text-[11px] outline-none transition-all shadow-inner ${customerPrompt.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} />
                     {!demoInput && customerPrompt.length === 0 && (<button onClick={handleRollDice} className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600/10 p-1.5 rounded-lg group hover:bg-blue-600 transition-all"><Dices className="w-4 h-4 text-blue-500 group-hover:text-white" /></button>)}
                     {demoInput && (<button onClick={() => setDemoInput('')} className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"><X className="w-4 h-4 text-red-500 group-hover:text-white" /></button>)}
                   </div>
                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">Or Paste Your Customer Prompt</label>
                   <div className="relative mb-4"><textarea value={customerPrompt} onChange={e => setCustomerPrompt(e.target.value)} placeholder="WE'RE WORKING ON SOMETHING AMAZING — COMING SOON" disabled={demoInput.length > 0} className={`w-full bg-black border rounded-xl p-4 pr-12 text-white text-[11px] outline-none transition-all shadow-inner resize-none min-h-[100px] ${demoInput.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} /></div>
                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-xl">{isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enhance"}</button>
                 </div>
               </div>
               <div className="flex-1 w-full flex flex-col h-full relative">
                 <label className="text-[8px] font-black uppercase text-blue-500 tracking-widest block mb-2.5 ml-2">4. V8 Engine Output</label>
                 {customerPrompt.length > 0 || (!demoInput && !customerPrompt) ? (
                     <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative flex flex-col items-start shadow-inner h-full min-h-[250px]">
                       {generatedPrompts.single && (<div className="text-green-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4 border-b border-green-500/20 pb-3 w-full text-left">Premium Matrix Output</div>)}
                       <p className={`w-full transition-all duration-500 font-mono text-[10px] md:text-[11px] leading-relaxed text-left ${generatedPrompts.single ? 'text-zinc-200' : 'text-zinc-600 italic tracking-widest flex-1 flex items-center justify-center'}`}>{generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} speed={10} /> : "AWAITING CORE INPUT..."}</p>
                       {generatedPrompts.single && (<button onClick={() => handleCopy(generatedPrompts.single, 'single')} className="absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all bg-white/10 text-white hover:bg-white/20 hover:scale-105">{copiedBox === 'single' ? "Copied! ✓" : "Copy Prompt"}</button>)}
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full text-left">
                        {['abstract', 'cinematic', 'photoreal', 'cctv'].map((type) => (
                           <div key={type} className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                              <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-3 border-b border-white/5 pb-2">
                                 {type === 'cctv' ? 'THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER' : type.toUpperCase()}
                              </label>
                              <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts[type] ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts[type] ? <TypewriterText text={generatedPrompts[type]} speed={10} /> : "AWAITING..."}</p>
                              {generatedPrompts[type] && (<button onClick={() => handleCopy(generatedPrompts[type], type)} className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all bg-white/10 text-white hover:bg-white/20">{copiedBox === type ? "Copied" : "Copy"}</button>)}
                           </div>
                        ))}
                     </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        <div id="marketplace" className="flex items-center gap-4 mb-10 text-left"><div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500 w-4 h-4" /><h3 className="text-white font-black uppercase text-[10px] tracking-widest italic text-left">Premium AI Asset Store</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 text-left">
          {sortedApps.map(app => (<AssetCard key={app.id} app={app} />))}
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
  const [openFaq, setOpenFaq] = useState(null);
  
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const mainVideoRef = useRef(null);
  const navigate = useNavigate();
  const thumbScrollRef = useRef(null);
  
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  
  const checkScroll = useCallback(() => {
    const el = thumbScrollRef.current;
    if (!el) return;
    const canScroll = el.scrollWidth > el.clientWidth;
    if (canScroll) {
      setShowLeftArrow(el.scrollLeft > 20);
      setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 20);
    } else {
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  }, []);
  
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [app, checkScroll]);
  
  const scrollGalery = (direction) => {
    const el = thumbScrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };
  
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase text-[10px] tracking-widest text-left">Syncing...</div>;
  
  const currentMedia = app.media?.[activeMedia] || { url: data.bannerUrl, type: 'image' };
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const { s: sysData } = data.extractSys(app.description);
  
  const dbWhopField = app.whopLink || "";
  const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, "", ""];
  const mainWhopLink = data.formatExternalLink(sysData.w || parts[0]);
  const sourceCodeWhopLink = data.formatExternalLink(sysData.g || parts[1]);
  const gumroadLink = data.formatExternalLink(parts[2]);

  const handleNextMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev + 1) % (app.media.length)); };
  const handlePrevMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev - 1 + app.media.length) % app.media.length); };

  return (
    <div className="bg-[#050505] pt-10 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO SMART</title></Helmet>
      
      {fullScreenImage && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
          <button className="absolute top-10 right-10 text-white"><X className="w-10 h-10" /></button>
          <img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
        </div>
      )}

      <div className="max-w-7xl mx-auto relative text-left">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all">
          <ChevronLeft className="w-4 h-4" /> <span>System Registry</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-12 items-start text-left">
          <div className="w-full lg:w-[70%] text-left">
            
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-orange-500 bg-black mb-6 relative group shadow-2xl text-left cursor-pointer">
              {app.media?.length > 1 && <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white font-black text-[9px] tracking-widest z-20">{activeMedia + 1} / {app.media.length}</div>}
              {!isVideo ? (
                <>
                  <img src={currentMedia.url} onClick={(e) => { e.stopPropagation(); setFullScreenImage(currentMedia.url); }} className="w-full h-full object-cover" alt="product" />
                  <button onClick={(e) => { e.stopPropagation(); setFullScreenImage(currentMedia.url); }} className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 border border-white/10 transition-all z-20"><Maximize2 className="w-4 h-4" /></button>
                </>
              ) : (<data.UniversalVideoPlayer videoRef={mainVideoRef} url={currentMedia.url} autoPlay={true} loop={true} muted={true} />)}
              
              {app.media?.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20">
                  <button onClick={handlePrevMedia} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:text-orange-500"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
                  <button onClick={handleNextMedia} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:text-orange-500"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
                </div>
              )}
            </div>

            <div className="relative mb-12 group/galery">
              {showLeftArrow && (
                <button onClick={() => scrollGalery('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 border border-orange-500/50 text-orange-500 shadow-xl hover:bg-orange-600 hover:text-white transition-all transform hover:scale-110"><ChevronLeft className="w-5 h-5" strokeWidth={3} /></button>
              )}
              {showRightArrow && (
                <button onClick={() => scrollGalery('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/70 border border-orange-500/50 text-orange-500 shadow-xl hover:bg-orange-600 hover:text-white transition-all transform hover:scale-110"><ChevronRight className="w-5 h-5" strokeWidth={3} /></button>
              )}

              <div ref={thumbScrollRef} onScroll={checkScroll} className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar text-left scroll-smooth relative z-20">
                {app.media?.map((m, idx) => {
                  const isThumbVideo = m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i);
                  return (
                  <button key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-28 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all group ${activeMedia === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-50 hover:opacity-100'}`}>
                    {isThumbVideo ? (
                      <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all"><PlayCircle className="w-6 h-6 text-white drop-shadow-md" /></div></>
                    ) : (<img src={m.url} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} draggable="false" />)}
                  </button>
                )})}
              </div>
            </div>

            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 text-left">{app.name}</h1>
            
            <div className="flex text-left mb-6">
              <div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">{app.category || sysData.b || 'AI ASSET'}</div>
            </div>
            
            {app.headline && (
              <p className="text-sm md:text-base text-white font-black mb-10 leading-tight border-l-4 border-orange-500 pl-5 italic text-left">
                {app.headline}
              </p>
            )}

            <div className="border-t border-white/5 pt-8 mb-12 text-left">
              {data.renderDescription(app.description)}
            </div>
            
            {app.faq && app.faq.length > 0 && (
              <div className="mt-10 bg-white/[0.02] border border-white/5 p-6 rounded-3xl text-left">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-6 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> System FAQ Registry</h3>
                <div className="space-y-3">
                  {app.faq.map((item, i) => (
                    <div key={i} className="border border-white/5 rounded-xl bg-black overflow-hidden transition-all duration-300">
                      <button 
                        onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <p className="text-[11px] font-black text-white uppercase tracking-tight pr-4">
                          <span className="text-orange-500 mr-2">[{String(i+1).padStart(2,'0')}]</span> 
                          {item.question || item.q}
                        </p>
                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 shrink-0 ${openFaq === i ? 'rotate-180' : ''}`} />
                      </button>
                      <div className={`transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="p-4 pt-0 border-t border-white/5 text-[11px] font-bold text-zinc-300 leading-relaxed bg-[#0a0a0a]">
                          {item.answer || item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-[30%] lg:sticky lg:top-40 text-left">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl text-left">
                <img src={mojBaner} alt="Registry Banner" className="w-full h-32 object-cover border-b border-white/5" />
                
                <div className="p-6 lg:p-8 pt-8">
                  <div className="space-y-6 mb-8">
                    <div className="relative rounded-2xl bg-white/[0.02] border border-white/10 py-3.5 flex items-center justify-center shadow-inner mt-2">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                        <span className="text-[8px] text-white uppercase font-black tracking-[0.2em] whitespace-nowrap">Monthly Registry</span>
                      </div>
                      <span className="text-2xl font-black text-white tracking-tighter mt-1">${app.price || '14.99'}</span>
                    </div>

                    <div className="relative rounded-2xl bg-orange-500/[0.03] border border-orange-500/30 py-3.5 flex items-center justify-center shadow-inner mt-6">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]">
                        <span className="text-[8px] text-white uppercase font-black tracking-[0.2em] whitespace-nowrap">Lifetime Registry</span>
                      </div>
                      <span className="text-2xl font-black text-white tracking-tighter mt-1">${app.priceLifetime || '88.99'}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <a href={mainWhopLink} target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-[1rem] flex items-center justify-center bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-xl">
                      Unlock Access Now On Whop
                    </a>
                    
                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-orange-500">
                          <Award className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Developer Registry Pack</span>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                          <a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border border-blue-900 bg-[#0f172a] text-blue-300 font-black text-[8px] uppercase tracking-[0.15em] hover:bg-blue-900 hover:text-white transition-all shadow-lg">
                            React Source Code On Whop <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                          
                          {parts[2] && (
                             <a href={gumroadLink} target="_blank" rel="noreferrer" className="w-full py-3 rounded-xl flex items-center justify-center gap-2 border border-purple-900/50 bg-[#2e1065] text-purple-300 font-black text-[8px] uppercase tracking-[0.15em] hover:bg-purple-900 hover:text-white transition-all shadow-lg">
                               Gumroad Source Code <ArrowRight className="w-3.5 h-3.5" />
                             </a>
                          )}
                        </div>
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
// INTELLIGENCE DASHBOARD
// ============================================================================
function IntelligenceDashboard() {
  const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, whopClicks: 0, session: "0m 0s" });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "site_stats"), orderBy("timestamp", "desc"), limit(400));
        const snapshot = await getDocs(q);
        const allEvents = snapshot.docs.map(doc => doc.data());
        setStats({ totalViews: allEvents.length, uniqueVisitors: new Set(allEvents.map(e => e.sessionId)).size, whopClicks: allEvents.filter(e => e.action === "whop_click" || e.action === "whop_conversion").length, session: "4m 21s" });
        setLoading(false);
      } catch (e) { setLoading(false); }
    };
    fetchStats();
  }, []);
  if (loading) return <div className="py-20 text-center animate-pulse text-zinc-600 font-black uppercase text-[10px]">Syncing Stats...</div>;
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

// ============================================================================
// ADMIN PAGE
// ============================================================================
function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [tab, setTab] = useState('system');
  const [isUploading, setIsUploading] = useState(false); 
  const [openAdminFaq, setOpenAdminFaq] = useState(null); 
  
  const initialForm = { name: '', category: 'AI ASSET', type: '', headline: '', price: '', priceLifetime: '', description: data.ADMIN_DEFAULT_DESC, media: [], whopLink: '', reactSourceCode: '', gumroadLink: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));

  const handleLogin = async (e) => { e.preventDefault(); try { const response = await fetch(`${BASE_BACKEND_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); if (response.ok) { const resData = await response.json(); localStorage.setItem('admin_token', resData.access_token); setIsAuthenticated(true); } else { alert("DENIED"); } } catch (err) { alert("ERROR"); } }; 
  
  const handleEditClick = (app) => { 
    let loadedFaq = (app.faq || []).map(item => ({ q: item.question || item.q || '', a: item.answer || item.a || '' })); 
    if (loadedFaq.length < 7) loadedFaq = [...loadedFaq, ...Array.from({ length: 7 - loadedFaq.length }, () => ({ q: '', a: '' }))]; 
    const dbWhopField = app.whopLink || ""; const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, "", ""];
    setFormData({ 
      name: app.name || '', 
      category: app.category || 'AI ASSET',
      type: app.type === 'AI ASSET' ? '' : (app.type || ''),
      headline: app.headline || '', 
      price: app.price || '', 
      priceLifetime: app.priceLifetime || '', 
      description: app.description || '', 
      media: Array.isArray(app.media) ? [...app.media] : [], 
      whopLink: parts[0], 
      reactSourceCode: parts[1] || '', 
      gumroadLink: parts[2] || '',
      faq: loadedFaq 
    }); 
    setEditingId(app.id); setOpenAdminFaq(null); window.scrollTo(0, 0); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    const token = localStorage.getItem('admin_token'); 
    const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}[SPLIT]${formData.gumroadLink || ''}`; 
    const payload = { 
      id: editingId || String(Date.now()), 
      name: formData.name, 
      category: formData.category,
      type: formData.type, 
      headline: formData.headline, 
      description: formData.description, 
      price: formData.price, 
      priceLifetime: formData.priceLifetime, 
      whopLink: combinedWhopField, 
      media: formData.media, 
      faq: formData.faq.filter(f => f.q && f.a).map(f => ({question: f.q, answer: f.a})) 
    }; 
    try { 
      const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) }); 
      if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } 
    } catch (err) {} 
  }; 

  const handleFileUpload = async (e) => { const file = e.target.files[0]; if (!file) return; setIsUploading(true); const upData = new FormData(); upData.append('file', file); upData.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); try { const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: upData }); const result = await res.json(); if (result.secure_url) { setFormData(prev => ({ ...prev, media: [...(prev.media || []), { url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image' }] })); } } catch (err) {} finally { setIsUploading(false); } }; 

  if (!isAuthenticated) return ( <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-white text-center"><div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-orange-500/20 max-w-md w-full shadow-2xl"><div className="inline-flex p-5 rounded-full border border-white/5 mb-8 shadow-inner"><Fingerprint className="w-12 h-12 text-orange-500" /></div><h2 className="text-white font-black uppercase mb-8 tracking-[0.5em] text-xs">Admin Terminal</h2><form onSubmit={handleLogin} className="space-y-6"><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none text-center text-[11px] tracking-[0.6em]" /><button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 font-black uppercase text-[10px] tracking-widest shadow-xl">Authorize Access</button></form></div></div> );
  
  return ( 
    <div className="pt-10 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white text-left"> 
      <div className="flex gap-4 mb-10 overflow-hidden"> 
        <button onClick={() => setTab('intelligence')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'intelligence' ? 'bg-orange-600 text-white' : 'bg-white/5 text-zinc-500'}`}>Intelligence</button> 
        <button onClick={() => setTab('system')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'system' ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500'}`}>System Registry</button> 
      </div> 

      {tab === 'intelligence' ? <IntelligenceDashboard /> : ( 
        <div className="animate-fade-in space-y-8"> 
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl text-left"> 
            <form onSubmit={handleSubmit} className="space-y-6"> 
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> 
                <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Asset Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" required /></div> 
                <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Category</label><input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="AI ASSET" className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" /></div> 
                <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Ribbon</label><input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="HOT 🔥" className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" /></div> 
              </div> 

              <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Headline</label><input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Main catchy phrase..." className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" /></div> 
              
              <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Specs</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-white text-[11px] h-64 resize-none outline-none" /></div> 
              
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4"> 
                <label className="text-[10px] font-black text-white uppercase tracking-widest mb-4 block">System FAQ Protocols</label> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2"> 
                  {formData.faq.map((item, index) => ( 
                    <div key={index} className="border border-white/5 rounded-xl bg-black overflow-hidden"> 
                      <button type="button" onClick={() => setOpenAdminFaq(openAdminFaq === index ? null : index)} className="w-full flex items-center justify-between p-3 text-left"><span className={`text-[9px] font-black uppercase ${item.q ? 'text-white' : 'text-zinc-600'}`}>Slot {index + 1}</span><ChevronDown className="w-4 h-4" /></button> 
                      {openAdminFaq === index && ( 
                        <div className="p-4 bg-[#0a0a0a] border-t border-white/5 space-y-3"> 
                          <input value={item.q} onChange={e => { const f = [...formData.faq]; f[index].q = e.target.value; setFormData({...formData, faq: f}); }} placeholder="Question" className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[10px]" /> 
                          <textarea value={item.a} onChange={e => { const f = [...formData.faq]; f[index].a = e.target.value; setFormData({...formData, faq: f}); }} placeholder="Answer" className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[10px] h-16" /> 
                        </div> 
                      )} 
                    </div> 
                  ))} 
                </div> 
              </div> 
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-4 text-left"> 
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Media Manifest</label> 
                  <label className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><UploadCloud className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Upload File</span><input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} /></label> 
                  <div className="grid grid-cols-4 gap-2 mt-4 text-left"> 
                    {formData.media?.map((m, i) => ( 
                      <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-white/10"> 
                        {m.type === 'video' ? (<video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" />) : <img src={m.url} className="w-full h-full object-cover" alt="media" />} 
                        <button type="button" onClick={() => setFormData(p => ({...p, media: p.media.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3 text-white" /></button> 
                      </div> 
                    ))} 
                  </div> 
                </div> 
                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3"> 
                  <div className="flex gap-2">
                    <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Monthly $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" />
                    <input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" />
                  </div> 
                  <input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Asset Whop Link" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" /> 
                  
                  <div className="flex gap-2">
                    <input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="Whop Source Code Link" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" /> 
                    <input type="text" value={formData.gumroadLink} onChange={e => setFormData({...formData, gumroadLink: e.target.value})} placeholder="Gumroad Source Code Link" className="w-full bg-black border border-purple-500/50 p-2.5 rounded-xl text-white text-[10px]" /> 
                  </div>
                </div> 
              </div> 
              
              <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest ${editingId ? 'bg-blue-600' : 'bg-orange-600'}`}>Execute Deploy</button> 
            </form> 
            
            <div className="mt-12 space-y-3 text-left"> 
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5"><Database className="w-4 h-4 text-zinc-500" /><h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Core Registry</h3></div> 
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> 
                {sortedApps.map(app => ( 
                  <div key={app.id} className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-xl"> 
                    <div className="flex items-center gap-3 truncate"><h4 className="text-white font-black uppercase text-[9px] truncate">{app.name}</h4></div> 
                    <div className="flex gap-2"> 
                      <button onClick={() => handleEditClick(app)} className="p-2 bg-white/5 rounded-lg hover:bg-blue-600"><Edit className="w-3.5 h-3.5" /></button> 
                      <button onClick={async () => { if(window.confirm('Delete?')) { const token = localStorage.getItem('admin_token'); await fetch(`${API_URL}/${app.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }}); refreshData(); } }} className="p-2 bg-white/5 rounded-lg hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button> 
                    </div> 
                  </div> 
                ))} 
              </div> 
            </div> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  
  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => { data.trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);
  
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans text-left relative pb-20 lg:pb-0">
      {isBooting && <FullScreenBoot onComplete={() => setIsBooting(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <UrgencyBar />
        <nav className="w-full px-4 md:px-8 py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-4 group">
              <img src={data.logoUrl} className="h-8 md:h-10 object-contain animate-pulse" alt="logo" />
              <span className="text-[8px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
            </Link>
            
            {/* SMANJENI DUGMIĆI (px-3 md:px-4 py-1.5 text-[8px] md:text-[9px]) */}
            <div className="flex items-center gap-3 font-black uppercase text-[8px] md:text-[9px] tracking-widest">
              <Link to="/#marketplace" className="bg-blue-600 px-3 md:px-4 py-1.5 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              
              <Link to="/#enhancer" className="bg-orange-600 px-3 md:px-4 py-1.5 rounded-full text-white shadow-xl hover:bg-orange-500 transition-all flex items-center gap-1">
                <Zap className="w-3 h-3" /> 10X ENHANCER
              </Link>
              
              <Link to="/" onClick={handleHomeClick} className="bg-emerald-900/60 px-3 md:px-4 py-1.5 rounded-full text-emerald-400 border border-emerald-800 shadow-xl hover:bg-emerald-800 hover:text-white transition-all">Home</Link>
              
              {/* ADMIN DUGME VRAĆENO U NARANDŽASTU BOJU */}
              <Link to="/admin" className="bg-orange-600 px-3 md:px-4 py-1.5 rounded-full text-white shadow-xl hover:bg-orange-500 transition-all">Admin</Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1 pt-28">
        <Routes>
          <Route path="/" element={<HomePage apps={appsData} />} />
          <Route path="/app/:id" element={<SingleProductPage apps={appsData} />} />
          <Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} />
        </Routes>
      </div>
      <footer className="text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em] pb-10 border-t border-white/5 pt-10">© 2026 AI TOOLS PRO SMART</footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  const refreshData = useCallback(() => { if(API_URL) fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []);
  useEffect(() => { refreshData(); }, [refreshData]);
  return ( <HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><data.LiveSalesNotification apps={appsData} /></Router></HelmetProvider> ); 
}