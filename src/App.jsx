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
  MatrixRain, TutorialCard, AssetCard, trackEvent 
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
    }
  }, [location]);

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  const handleRollDice = () => { 
    setDemoInput(data.getRandomDicePrompt()); 
    setCustomerPrompt(''); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); 
  };
  
  const handleEnhance = () => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setTimeout(() => {
      setGeneratedPrompts(data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR));
      setIsEnhancing(false);
    }, 1200);
  };

  const handleCopy = (text, boxName) => { 
    navigator.clipboard.writeText(text); 
    setCopiedBox(boxName); 
    setTimeout(() => setCopiedBox(''), 2000); 
  };

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | PROMPT GENERATOR</title></Helmet>
      
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white">
        <MatrixRain />
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
            {item.url && <img src={item.url} className="w-full h-full object-cover" alt="banner" />}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {sortedVideos.slice(1).map((vid, i) => (<TutorialCard key={i} vid={vid} />))}
        </div>

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
                      <div className="flex flex-col gap-3"><span className="text-[12px] font-black uppercase text-zinc-600 tracking-widest">Aspect Ratio</span><div className="flex gap-2">{['1:1', '9:16', '16:9', '21:9'].map(ar => <button key={ar} onClick={() => setSelectedAR(ar)} className={`px-3 py-2 rounded-lg text-[9px] font-black border transition-all ${selectedAR === ar ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/20'}`}>{ar}</button>)}</div></div>
                      <div className="flex flex-col gap-3 items-end"><span className="text-[12px] font-black uppercase text-zinc-600 tracking-widest">Quality</span><div className="flex gap-2">{['1x', '2x', '4x'].map(q => <button key={q} onClick={() => setSelectedQuality(q)} className={`px-4 py-2 rounded-lg text-[9px] font-black border transition-all ${selectedQuality === q ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/20'}`}>{q}</button>)}</div></div>
                   </div>
                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-xl">{isEnhancing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enhance"}</button>
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
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full h-full text-left">
                        {['abstract', 'cinematic', 'photoreal', 'cctv'].map((type) => (
                           <div key={type} className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative shadow-inner flex flex-col min-h-[300px]">
                              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest mb-4 border-b border-white/5 pb-3">{type === 'cctv' ? 'THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER' : type.toUpperCase()}</label>
                              <p className={`w-full font-mono text-[10px] leading-relaxed text-left flex-1 ${generatedPrompts[type] ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts[type] ? <TypewriterText text={generatedPrompts[type]} speed={10} /> : "AWAITING..."}</p>
                              {generatedPrompts[type] && (<button onClick={() => handleCopy(generatedPrompts[type], type)} className="absolute bottom-4 right-4 px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all bg-white/10 text-white hover:bg-white/20">{copiedBox === type ? "Copied" : "Copy"}</button>)}
                           </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-32">
          {sortedVideos.length > 0 && <data.TutorialCard vid={sortedVideos[0]} />}
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
            <div className="border-t border-white/5 pt-8 mb-12">{renderDescription(app.description)}</div>
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
    setFormData({ ...app, whopLink: parts[0], reactSourceCode: parts[1] || '', faq: (app.faq || []).length >= 7 ? app.faq : Array.from({ length: 7 }, () => ({ q: '', a: '' })) }); 
    setEditingId(app.id); window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; 
    const payload = { ...formData, id: editingId || String(Date.now()), whopLink: combinedWhopField, faq: formData.faq.filter(f => f.q && f.a) }; 
    try { const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } } catch (err) {} 
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
             <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Category" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
             <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Ribbon (HOT 🔥)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
           </div>
           <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-[11px] h-64 w-full resize-none outline-none" />
           <button type="submit" className="w-full py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl tracking-widest bg-orange-600">Execute Deploy</button>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-10">
              {apps.map(app => (<div key={app.id} className="p-4 bg-black border border-white/5 rounded-xl flex justify-between items-center"><span className="text-[10px] font-black uppercase truncate">{app.name}</span><div className="flex gap-2"><button type="button" onClick={() => handleEditClick(app)} className="p-2 bg-blue-600/20 text-blue-400 rounded-lg"><Edit className="w-3.5 h-3.5" /></button></div></div>))}
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
  const location = useLocation();
  const handleHomeClick = (e) => { if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  useEffect(() => { data.trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);
  
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative pb-20 lg:pb-0 text-left">
      {isBooting && <FullScreenBoot onComplete={() => setIsBooting(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <nav className="w-full px-4 md:px-8 py-6 md:py-8 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-4 group">
              <img src={data.logoUrl} className="h-10 md:h-12 object-contain animate-pulse" alt="logo" />
              <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
            </Link>
            <div className="flex items-center gap-3 md:gap-4 font-black uppercase text-[10px] md:text-[11px] tracking-widest">
              <Link to="/#marketplace" className="bg-blue-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              <Link to="/#enhancer" className="bg-transparent border-2 border-orange-600 text-orange-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full shadow-xl hover:bg-orange-600/10 transition-all flex items-center gap-1.5"><Zap className="w-3.5 h-3.5" /> 10X ENHANCER</Link>
              <Link to="/" onClick={handleHomeClick} className="bg-emerald-900/60 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-emerald-400 border border-emerald-800 shadow-xl">Home</Link>
              <Link to="/admin" className="bg-orange-600 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-white shadow-xl">Admin</Link>
            </div>
          </div>
        </nav>
      </div>
      <div className="flex-1 text-left"><Routes><Route path="/" element={<HomePage apps={appsData} />} /><Route path="/app/:id" element={<SingleProductPage apps={appsData} />} /><Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} /></Routes></div>
      <footer className="text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em] pb-10 border-t border-white/5 pt-10">© 2026 AI TOOLS PRO SMART</footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  const refreshData = useCallback(() => { fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []);
  useEffect(() => { refreshData(); }, [refreshData]);
  return ( <HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><data.LiveSalesNotification apps={appsData} /></Router></HelmetProvider> ); 
}