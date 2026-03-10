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

// --- IMPORT PODATAKA IZ DATA.JSX ---
import * as data from './data';
import { 
  TypewriterText, UniversalVideoPlayer, renderDescription, FullScreenBoot, 
  MatrixRain, UrgencyBar, TutorialCard, AssetCard, LiveSalesNotification, 
  StarIcon, trackEvent 
} from './data';
import mojBaner from './moj-baner.png'; 

// --- KONFIGURACIJA LINKOVA ---
const BASE_BACKEND_URL = "https://aitoolsprosmart-becend-production.up.railway.app"; 
const API_URL = `${BASE_BACKEND_URL}/api/products`;
const VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/youtube`; 
const HIDDEN_VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/hidden-videos`;

// ============================================================================
// STRANICE
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
  const [promptHistory, setPromptHistory] = useState([]);
  const [copiedHistoryIndex, setCopiedHistoryIndex] = useState(null);
  
  const location = useLocation();

  // Najnoviji proizvodi na vrh
  const sortedApps = [...apps].reverse();
  // Najnoviji videi na vrh
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
    } else if (!location.hash) { window.scrollTo(0, 0); } 
  }, [location]);

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  const handleRollDice = () => { 
    const newPrompt = data.getRandomDicePrompt();
    setDemoInput(newPrompt); 
    setCustomerPrompt(''); 
  };

  const handleEnhance = () => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true); setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' }); setCopiedBox('');
    setTimeout(() => {
      const result = data.generatePrompts ? data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR) : { single: "Error" };
      setGeneratedPrompts(result);
      setPromptHistory(prev => [result.single || result.cctv, ...prev].filter(Boolean).slice(0, 3)); 
      setIsEnhancing(false);
    }, 800);
  };

  const handleCopy = (text, boxName) => { navigator.clipboard.writeText(text); setCopiedBox(boxName); setTimeout(() => setCopiedBox(''), 2000); };
  const handleCopyHistory = (text, index) => { navigator.clipboard.writeText(text); setCopiedHistoryIndex(index); setTimeout(() => setCopiedHistoryIndex(null), 2000); };

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | PROMPT GENERATOR</title></Helmet>
      
      <div className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black pt-24 text-white text-left">
        <MatrixRain />
        {(data.BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
            {item.url && <img src={item.url} className="w-full h-full object-cover mt-12" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full z-20" style={{ borderTop: '0.1px solid #f97316' }}></div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all duration-300"><ChevronLeft className="w-6 h-6" strokeWidth={3} /></button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all duration-300"><ChevronRight className="w-6 h-6" strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {(data.BANNER_DATA || []).map((_, i) => (<button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-3xl font-black uppercase mb-1.5 tracking-tighter drop-shadow-lg hover:tracking-widest transition-all duration-500">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[10px] md:text-xs max-w-lg font-medium opacity-90">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        
        <div id="protocols" className="flex items-center gap-4 mb-10 overflow-hidden text-left"><div className="flex items-center gap-2.5 shrink-0 text-left"><Youtube className="text-red-600 w-4 h-4" /><h3 className="text-white font-black uppercase text-[10px] tracking-widest italic text-left">Latest Intel Protocols</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 text-left">
          {sortedVideos.map((vid, i) => (<TutorialCard key={i} vid={vid} />))}
        </div>

        <div id="enhancer" className="mb-24 scroll-mt-32">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all">
             
             <div className="mb-8 text-left w-full">
               <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-2">10x Prompt Enhancer</h2>
               <div className="text-[10px] md:text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Premium tool worth $100/month. Currently free to use.</div>
             </div>

             <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
               <div className="flex-1 w-full lg:max-w-md flex flex-col justify-start space-y-6">
                 <div className="w-full">
                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">1. Target Concept / Subject</label>
                   <div className="relative mb-4">
                     <input type="text" value={demoInput} onChange={e => setDemoInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEnhance()} placeholder="e.g. 'a red sports car'" disabled={customerPrompt.length > 0} className={`w-full bg-black border rounded-xl pl-4 pr-12 py-4 text-white text-[11px] outline-none transition-all shadow-inner ${customerPrompt.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} />
                     {!demoInput && customerPrompt.length === 0 && (<button onClick={handleRollDice} className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600/10 p-1.5 rounded-lg group hover:bg-blue-600 transition-all"><Dices className="w-4 h-4 text-blue-500 group-hover:text-white transition-all" /></button>)}
                     {demoInput && (<button onClick={() => { setDemoInput(''); setGeneratedPrompts({single:'', abstract:'', cinematic:'', photoreal:'', cctv:''}); setCopiedBox(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"><X className="w-4 h-4 text-red-500 group-hover:text-white transition-all" /></button>)}
                   </div>

                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">Or Paste Your Customer Prompt</label>
                   <div className="relative mb-4">
                     <textarea value={customerPrompt} onChange={e => setCustomerPrompt(e.target.value)} placeholder="WE'RE WORKING ON SOMETHING AMAZING — COMING SOON" disabled={demoInput.length > 0} className={`w-full bg-black border rounded-xl p-4 pr-12 text-white text-[11px] outline-none transition-all shadow-inner resize-none min-h-[100px] ${demoInput.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} />
                   </div>

                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                     {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enhance"}
                   </button>
                 </div>
               </div>
               
               <div className="flex-1 w-full flex flex-col h-full relative">
                 <label className="text-[8px] font-black uppercase text-blue-500 tracking-widest block mb-2.5 ml-2">4. V8 Engine Output</label>
                 
                 {customerPrompt.length > 0 || (!demoInput && !customerPrompt) ? (
                     <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative flex flex-col items-start shadow-inner h-full min-h-[250px]">
                       {generatedPrompts.single && (<div className="text-green-500 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-4 border-b border-green-500/20 pb-3 w-full text-left flex items-center gap-2"><Sparkles className="w-4 h-4 animate-pulse" /> Premium Matrix Output</div>)}
                       <p className={`w-full transition-all duration-500 font-mono text-[10px] md:text-[11px] leading-relaxed text-left ${generatedPrompts.single ? 'text-zinc-200 opacity-100' : 'text-zinc-600 opacity-50 flex-1 flex items-center justify-center italic tracking-widest'}`}>
                         {generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} speed={10} /> : "AWAITING CORE INPUT..."}
                       </p>
                       {generatedPrompts.single && (
                         <button onClick={() => handleCopy(generatedPrompts.single, 'single')} className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copiedBox === 'single' ? 'bg-green-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                           {copiedBox === 'single' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copiedBox === 'single' ? "Copied!" : "Copy"}
                         </button>
                       )}
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-purple-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Sparkles className="w-3.5 h-3.5" /> Abstract Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.abstract ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.abstract ? <TypewriterText text={generatedPrompts.abstract} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.abstract && (<button onClick={() => handleCopy(generatedPrompts.abstract, 'abstract')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${copiedBox === 'abstract' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Copy</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Video className="w-3.5 h-3.5" /> Cinematic Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cinematic ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.cinematic ? <TypewriterText text={generatedPrompts.cinematic} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.cinematic && (<button onClick={() => handleCopy(generatedPrompts.cinematic, 'cinematic')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${copiedBox === 'cinematic' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Copy</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Camera className="w-3.5 h-3.5" /> Photoreal Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.photoreal ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.photoreal ? <TypewriterText text={generatedPrompts.photoreal} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.photoreal && (<button onClick={() => handleCopy(generatedPrompts.photoreal, 'photoreal')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${copiedBox === 'photoreal' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Copy</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Cctv className="w-3.5 h-3.5" /> THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cctv ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.cctv ? <TypewriterText text={generatedPrompts.cctv} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.cctv && (<button onClick={() => handleCopy(generatedPrompts.cctv, 'cctv')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${copiedBox === 'cctv' ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>Copy</button>)}
                        </div>
                     </div>
                 )}
               </div>
             </div>
          </div>
        </div>

        <div id="marketplace" className="flex items-center gap-4 mb-10 overflow-hidden text-left"><div className="flex items-center gap-2.5 shrink-0 text-left"><Sparkles className="text-blue-500 w-4 h-4" /><h3 className="text-white font-black uppercase text-[10px] tracking-widest italic text-left">Premium AI Asset Store</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 text-left">
          {sortedApps.map(app => (<AssetCard key={app.id} app={app} />))}
        </div>
      </div>

      <div className="overflow-hidden bg-[#050505] border-y border-white/5 py-5 mb-10 whitespace-nowrap relative flex">
         <div className="flex animate-scroll gap-16 w-max px-6">
            {[...(data.REVIEWS || []), ...(data.REVIEWS || [])].map((r, i) => (
               <div key={i} className="flex items-center gap-3 text-zinc-500 font-black uppercase text-[9px] tracking-widest">
                  <span className="text-orange-500 flex gap-0.5"><StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon /></span> "{r}"
               </div>
            ))}
         </div>
      </div>
    </>
  );
}

function SingleProductPage({ apps = [] }) {
  const { id } = useParams();
  const app = apps.find(a => a.id === id);
  const [activeMedia, setActiveMedia] = useState(0);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const mainVideoRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-black uppercase text-[10px] tracking-widest text-left">Syncing...</div>;
  const currentMedia = (app.media && app.media[activeMedia]) ? app.media[activeMedia] : (app.media && app.media[0]) ? app.media[0] : { url: data.bannerUrl, type: 'image' };
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const { s: sysData } = data.extractSys(app.description);
  const dbWhopField = app.whopLink || "";
  const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, ""];
  const mainWhopLink = data.formatExternalLink(sysData.w || parts[0]);
  const sourceCodeWhopLink = data.formatExternalLink(sysData.g || parts[1]);
  return (
    <div className="bg-[#050505] pt-10 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name}</title></Helmet>
      {fullScreenImage && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
          <img src={fullScreenImage} className="max-w-full max-h-full object-contain" alt="" />
        </div>
      )}
      <div className="max-w-7xl mx-auto relative text-left">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all">
          <ChevronLeft className="w-4 h-4" /> <span>System Registry</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-12 items-start text-left">
          <div className="w-full lg:w-[70%] text-left">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-orange-500 bg-black mb-10 relative group shadow-2xl text-left">
              {!isVideo ? (<img src={currentMedia.url} className="w-full h-full object-cover" alt="" />) : (<UniversalVideoPlayer videoRef={mainVideoRef} url={currentMedia.url} autoPlay={true} loop={true} muted={true} />)}
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 leading-none text-left">{app.name}</h1>
            <div className="flex text-left"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase mb-10 tracking-[0.2em]">{sysData.b || 'AI ASSET'}</div></div>
            <div className="border-t border-white/5 pt-8 mb-12 text-left">{renderDescription(app.description)}</div>
          </div>
          <div className="w-full lg:w-[30%] lg:sticky lg:top-40 text-left">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-6 text-left">
                <div className="space-y-2.5 mb-6 text-left font-black">
                  <div className="group p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between"><div className="text-[9px] text-zinc-500 uppercase tracking-widest">Monthly</div><div className="text-lg md:text-xl text-white tracking-tighter">${app.price || '0'}</div></div>
                  <div className="group p-3 rounded-xl bg-orange-500/[0.03] border border-orange-500/20 flex items-center justify-between mt-4"><div className="text-[9px] text-orange-500/70 uppercase tracking-widest">Lifetime</div><div className="text-lg md:text-xl text-white tracking-tighter">${app.priceLifetime || 'TBD'}</div></div>
                </div>
                <div className="space-y-4 text-left">
                  <a href={mainWhopLink} target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-xl flex items-center justify-center bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-blue-500 transition-all">Unlock Access Now</a>
                  <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4 text-left">
                      <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-orange-500" /><span className="text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em]">Developer Pack</span></div>
                      <a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" className="w-full py-3.5 rounded-xl flex items-center justify-center border-2 border-blue-500/30 bg-blue-500/5 text-blue-400 font-black text-[8px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all">Source Code</a>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntelligenceDashboard() {
  const [stats, setStats] = useState({ totalViews: 0, uniqueVisitors: 0, whopClicks: 0, videoInteractions: 0, avgSessionTime: "0m", topAssets: [], topVideos: [], events: [], whopBreakdown: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "site_stats"), orderBy("timestamp", "desc"), limit(400));
        const snapshot = await getDocs(q);
        const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sessions = {};
        allEvents.forEach(e => { if(!e.sessionId || !e.localTime) return; if(!sessions[e.sessionId]) sessions[e.sessionId] = { start: e.localTime, end: e.localTime, actions: 1 }; else { if(e.localTime < sessions[e.sessionId].start) sessions[e.sessionId].start = e.localTime; if(e.localTime > sessions[e.sessionId].end) sessions[e.sessionId].end = e.localTime; sessions[e.sessionId].actions += 1; } });
        let totalTime = 0; let validSessions = 0; Object.values(sessions).forEach(s => { const duration = s.end - s.start; if(duration > 0 && duration < 3600000) { totalTime += duration; validSessions++; } });
        const avgMs = validSessions > 0 ? (totalTime / validSessions) : 0; const avgMins = Math.floor(avgMs / 60000); const avgSecs = Math.floor((avgMs % 60000) / 1000);
        const assetCounts = {}; const videoCounts = {};
        allEvents.forEach(e => { if(e.action === "asset_click" || e.action === "asset_view") assetCounts[e.name] = (assetCounts[e.name] || 0) + 1; if(e.action === "tutorial_external_open" || e.action === "tutorial_play" || e.action === "product_video_watch") videoCounts[e.title || e.name || "Main Feed"] = (videoCounts[e.title || e.name || "Main Feed"] || 0) + 1; });
        const whopMap = {}; allEvents.forEach(e => { if (e.action === "whop_click" || e.action === "whop_conversion") { const productName = e.name || "Unknown Asset"; const clickType = e.type || "MAIN"; if (!whopMap[productName]) whopMap[productName] = { name: productName, main: 0, source: 0 }; if (clickType === "SOURCE") whopMap[productName].source += 1; else whopMap[productName].main += 1; } });
        setStats({ totalViews: allEvents.filter(e => e.action === "page_view").length, uniqueVisitors: Object.keys(sessions).length, whopClicks: allEvents.filter(e => e.action === "whop_click" || e.action === "whop_conversion").length, videoInteractions: allEvents.filter(e => e.action.includes("video") || e.action.includes("tutorial") || e.action.includes("preview")).length, avgSessionTime: `${avgMins}m ${avgSecs}s`, topAssets: Object.entries(assetCounts).sort((a,b) => b[1] - a[1]).slice(0, 3), topVideos: Object.entries(videoCounts).sort((a,b) => b[1] - a[1]).slice(0, 3), whopBreakdown: Object.values(whopMap).sort((a,b) => (b.main + b.source) - (a.main + a.source)), events: allEvents.slice(0, 50) });
        setLoading(false);
      } catch (e) { console.error(e); setLoading(false); }
    };
    fetchStats();
  }, []);
  if (loading) return <div className="py-20 text-center animate-pulse text-zinc-600 font-black uppercase text-[10px]">Loading Intelligence...</div>;
  return ( <div className="space-y-6 animate-fade-in text-left"> <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left"> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] text-left"> <div className="flex items-center gap-3 mb-3"><Eye className="w-4 h-4 text-blue-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Views</span></div><div className="text-2xl font-black text-white">{stats.totalViews}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] text-left"> <div className="flex items-center gap-3 mb-3"><Users className="w-4 h-4 text-green-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Unique</span></div><div className="text-2xl font-black text-white">{stats.uniqueVisitors}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] text-left"> <div className="flex items-center gap-3 mb-3"><Clock className="w-4 h-4 text-purple-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Session</span></div><div className="text-2xl font-black text-white">{stats.avgSessionTime}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] text-left"> <div className="flex items-center gap-3 mb-3"><MousePointerClick className="w-4 h-4 text-orange-500" /><span className="text-[9px] font-black uppercase text-zinc-500">Clicks</span></div><div className="text-2xl font-black text-orange-500">{stats.whopClicks}</div> </div> </div> <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 text-left"> <div className="overflow-x-auto text-left"> <table className="w-full text-left"> <thead className="text-[8px] font-black text-zinc-600 uppercase border-b border-white/5"> <tr><th className="pb-3 text-left">Asset</th><th className="pb-3 text-center">Main</th><th className="pb-3 text-center">Source</th><th className="pb-3 text-right">Total</th></tr> </thead> <tbody className="divide-y divide-white/5 text-left"> {stats.whopBreakdown.map((item, i) => ( <tr key={i} className="hover:bg-white/[0.02] transition-colors"><td className="py-3 text-[9px] font-bold text-white uppercase">{item.name}</td><td className="py-3 text-center text-[10px] font-black text-blue-500">{item.main}</td><td className="py-3 text-center text-[10px] font-black text-orange-500">{item.source}</td><td className="py-3 text-right text-[10px] font-black text-white">{item.main + item.source}</td></tr> ))} </tbody> </table> </div> </div> </div> ); }

function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const initialForm = { name: '', headline: '', type: 'AI ASSET', price: '', priceLifetime: '', description: data.ADMIN_DEFAULT_DESC, media: [], whopLink: '', reactSourceCode: '', faq: [] }; 
  const [formData, setFormData] = useState(initialForm); 
  const sortedApps = [...apps].reverse();
  const handleLogin = async (e) => { e.preventDefault(); try { const response = await fetch(`${BASE_BACKEND_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) }); if (response.ok) { const resData = await response.json(); localStorage.setItem('admin_token', resData.access_token); setIsAuthenticated(true); } else { alert("DENIED"); } } catch (err) { alert("ERROR"); } }; 
  const handleEditClick = (app) => { const dbWhopField = app.whopLink || ""; const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, ""]; setFormData({ name: app.name || '', headline: app.headline || '', type: app.type || 'AI ASSET', price: app.price || '', priceLifetime: app.priceLifetime || '', description: app.description || '', media: Array.isArray(app.media) ? [...app.media] : [], whopLink: parts[0], reactSourceCode: parts[1], faq: app.faq || [] }); setEditingId(app.id); window.scrollTo(0, 0); }; 
  const handleSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('admin_token'); const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; const payload = { ...formData, id: editingId || String(Date.now()), whopLink: combinedWhopField }; try { const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) }); if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('SAVED'); } } catch (err) {} }; 
  const handleFileUpload = async (e) => { const file = e.target.files[0]; if (!file) return; setIsUploading(true); const upData = new FormData(); upData.append('file', file); upData.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); try { const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: upData }); const result = await res.json(); if (result.secure_url) { setFormData(prev => ({ ...prev, media: [...(prev.media || []), { url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image' }] })); } } catch (err) {} finally { setIsUploading(false); } }; 
  if (!isAuthenticated) return ( <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-white text-center"> <div className="bg-[#0a0a0a] p-12 rounded-[3rem] border border-orange-500/20 max-w-md w-full shadow-2xl"> <div className="inline-flex p-5 rounded-full border border-white/5 mb-8 shadow-inner"><Fingerprint className="w-12 h-12 text-orange-500" /></div> <h2 className="text-white font-black uppercase mb-8 tracking-[0.5em] text-xs">Admin Terminal</h2> <form onSubmit={handleLogin} className="space-y-6"> <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none text-center text-[11px] tracking-[0.6em]" /> <button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 font-black uppercase text-[10px] tracking-widest shadow-xl">Authorize Access</button> </form> </div> </div> );
  return ( <div className="pt-10 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white"> <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl"> <form onSubmit={handleSubmit} className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase">Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" required /></div> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase">Ribbon</label><input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px]" /></div> </div> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase">Specs</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-white text-[11px] h-64 resize-none outline-none" /></div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-4"> <label className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><UploadCloud className="w-4 h-4" /><span className="text-[10px] font-black uppercase">Upload File</span><input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} /></label> <div className="grid grid-cols-4 gap-2 mt-4"> {formData.media?.map((m, i) => ( <div key={i} className="relative rounded-xl overflow-hidden aspect-video border border-white/10"> {m.type === 'video' ? (<video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" />) : <img src={m.url} className="w-full h-full object-cover" />} <button type="button" onClick={() => setFormData(p => ({...p, media: p.media.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-600 p-1 rounded-lg"><X className="w-3 h-3 text-white" /></button> </div> ))} </div> </div> <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3"> <div className="flex gap-2"><input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Monthly" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" /><input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" /></div> <input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Whop Link" className="bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px]" /> <input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="Source Code" className="bg-black border border-orange-500/30 p-2.5 rounded-xl text-white text-[10px]" /> </div> </div> <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase text-[12px] shadow-xl ${editingId ? 'bg-blue-600' : 'bg-orange-600'}`}>Execute Deploy</button> </form> <div className="mt-12 space-y-3"> {sortedApps.map(app => ( <div key={app.id} className="flex items-center justify-between p-3 border border-white/5 bg-black rounded-xl"> <div className="flex items-center gap-3 truncate"><h4 className="text-white font-black uppercase text-[9px] truncate">{app.name}</h4></div> <div className="flex gap-2"> <button onClick={() => handleEditClick(app)} className="p-2 bg-white/5 rounded-lg hover:bg-blue-600"><Edit className="w-3.5 h-3.5" /></button> <button onClick={async () => { if(window.confirm('Delete?')) { const token = localStorage.getItem('admin_token'); await fetch(`${API_URL}/${app.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }}); refreshData(); } }} className="p-2 bg-white/5 rounded-lg hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button> </div> </div> ))} </div> </div> </div> ); }

function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  useEffect(() => { data.trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans text-left relative pb-20 lg:pb-0">
      {isBooting && <FullScreenBoot onComplete={() => setIsBooting(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <UrgencyBar />
        <nav className="w-full px-6 md:px-10 py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="flex items-center gap-4 group">
              <img src={data.logoUrl} className="h-9 md:h-12 object-contain animate-pulse" alt="logo" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
            </Link>
            <div className="flex items-center gap-4 md:gap-10 font-black uppercase text-[9px] md:text-[10px] tracking-widest">
              <Link to="/#marketplace" className="bg-blue-600 px-4 md:px-6 py-2 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              <Link to="/admin" className="bg-orange-600 px-4 md:px-6 py-2 rounded-full text-white shadow-xl hover:bg-orange-500 transition-all">Admin</Link>
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
      <footer className="text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em] pb-10 lg:pb-4 border-t border-white/5 pt-10">
        © 2026 <span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span> - ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  const refreshData = useCallback(() => { if(API_URL) fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); }, []);
  useEffect(() => { refreshData(); }, [refreshData]);
  return ( <HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><LiveSalesNotification apps={appsData} /></Router></HelmetProvider> ); 
}