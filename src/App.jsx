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
  const sortedApps = [...apps].reverse();
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
      const result = data.generatePrompts ? data.generatePrompts(customerPrompt, demoInput, selectedQuality, selectedAR) : { single: "Error: Engine Offline" };
      setGeneratedPrompts(result);
      setPromptHistory(prev => [result.single || result.cinematic, ...prev].filter(Boolean).slice(0, 3)); 
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

      <div className="max-w-7xl mx-auto px-6 mt-12 mb-4 text-left">
        <div className="bg-[#0a0a0a] border border-orange-500/10 rounded-[2rem] py-2 px-10 flex justify-between items-center shadow-2xl relative overflow-hidden group hover:border-orange-500/20 transition-all">
           <div className="flex items-center gap-3 relative z-10"><div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 shadow-inner"><Database className="w-3.5 h-3.5 text-blue-400" /></div><span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Architect</span></div>
           <div className="flex items-center gap-3 relative z-10"><div className="bg-orange-500/10 p-2 rounded-xl border border-orange-500/20 shadow-inner"><Sparkles className="text-orange-400 w-3.5 h-3.5" /></div><span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Augment</span></div>
           <div className="flex items-center gap-3 relative z-10"><div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 shadow-inner"><Terminal className="w-3.5 h-3.5 text-blue-400" /></div><span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">Optimize</span></div>
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
               <div className="flex flex-wrap gap-3 mb-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]"><Zap className="w-3 h-3 text-orange-500 animate-pulse" /> <span className="text-[8px] font-black uppercase text-orange-500 tracking-widest">Free Demo • $100/Month Value</span></div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]"><Sparkles className="w-3 h-3 text-blue-500 animate-pulse" /> <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Optimized for all AI Image Generators</span></div>
               </div>
               <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-2">10x Prompt Enhancer</h2>
               <div className="text-[10px] md:text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Premium tool worth $100/month. Currently free to use.</div>
               <p className="text-zinc-400 text-[10px] md:text-xs max-w-2xl leading-relaxed">
                 Test the matrix architecture. Enter a simple concept, adjust the parameters, and let the engine inject cinematic fidelity instantly. <br/>
                 <span className="text-orange-500 font-black mt-2 inline-block">SYSTEM NOTE:</span> Due to the neural variance of AI engines, the exact same prompt will generate completely unique, high-end variations every time.
               </p>
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
                     {customerPrompt && (<button onClick={() => { setCustomerPrompt(''); setGeneratedPrompts({single:'', abstract:'', cinematic:'', photoreal:'', cctv:''}); setCopiedBox(''); }} className="absolute right-3 top-3 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"><X className="w-4 h-4 text-red-500 group-hover:text-white transition-all" /></button>)}
                   </div>

                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                     {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enhance"}
                   </button>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black/30 p-4 rounded-2xl border border-white/5 mt-auto">
                    <div>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-1">2. Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2">
                            {['1:1', '9:16', '16:9', '21:9'].map(ar => (<button key={ar} onClick={() => setSelectedAR(ar)} className={`px-3.5 py-2 rounded-lg text-[9px] font-black transition-all ${selectedAR === ar ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>{ar}</button>))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-1">3. Render Quality</label>
                        <div className="flex flex-wrap gap-2">
                            {['1x', '2x', '4x'].map(q => (<button key={q} onClick={() => setSelectedQuality(q)} className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${selectedQuality === q ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}>{q}</button>))}
                        </div>
                    </div>
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
                         <button onClick={() => handleCopy(generatedPrompts.single, 'single')} className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copiedBox === 'single' ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'}`}>
                           {copiedBox === 'single' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copiedBox === 'single' ? "Copied! ✓" : "Copy Prompt"}
                         </button>
                       )}
                     </div>
                 ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-purple-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Sparkles className="w-3.5 h-3.5" /> Abstract Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.abstract ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.abstract ? <TypewriterText text={generatedPrompts.abstract} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.abstract && (<button onClick={() => handleCopy(generatedPrompts.abstract, 'abstract')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'abstract' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{copiedBox === 'abstract' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'abstract' ? "Copied" : "Copy"}</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Video className="w-3.5 h-3.5" /> Cinematic Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cinematic ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.cinematic ? <TypewriterText text={generatedPrompts.cinematic} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.cinematic && (<button onClick={() => handleCopy(generatedPrompts.cinematic, 'cinematic')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'cinematic' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{copiedBox === 'cinematic' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'cinematic' ? "Copied" : "Copy"}</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Camera className="w-3.5 h-3.5" /> Photoreal Form</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.photoreal ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.photoreal ? <TypewriterText text={generatedPrompts.photoreal} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.photoreal && (<button onClick={() => handleCopy(generatedPrompts.photoreal, 'photoreal')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'photoreal' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{copiedBox === 'photoreal' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'photoreal' ? "Copied" : "Copy"}</button>)}
                        </div>
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2"><Cctv className="w-3.5 h-3.5" /> THE MOST UNIQUE PHOTOREALISTIC IMAGE EVER</label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cctv ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>{generatedPrompts.cctv ? <TypewriterText text={generatedPrompts.cctv} speed={10} /> : "AWAITING..."}</p>
                           {generatedPrompts.cctv && (<button onClick={() => handleCopy(generatedPrompts.cctv, 'cctv')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'cctv' ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>{copiedBox === 'cctv' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'cctv' ? "Copied" : "Copy"}</button>)}
                        </div>
                     </div>
                 )}
               </div>
             </div>

             {promptHistory.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-8 animate-fade-in">
                  <h4 className="text-[9px] font-black uppercase text-zinc-500 mb-4 tracking-widest flex items-center gap-2 ml-2"><Clock className="w-3.5 h-3.5" /> Session History (Last 3)</h4>
                  <div className="space-y-3">
                    {promptHistory.map((historyItem, idx) => (
                      <div key={idx} className="bg-black/50 border border-white/5 p-4 rounded-xl flex justify-between items-center group transition-all hover:border-white/10">
                        <p className="text-[9px] text-zinc-400 font-mono truncate max-w-[85%]">{historyItem}</p>
                        <button onClick={() => handleCopyHistory(historyItem, idx)} className={`p-2 rounded-lg transition-all ${copiedHistoryIndex === idx ? 'bg-green-600/20 text-green-500' : 'bg-white/5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10'}`}>
                          {copiedHistoryIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
             )}
          </div>
        </div>

        <div id="marketplace" className="flex items-center gap-4 mb-10 overflow-hidden text-left"><div className="flex items-center gap-2.5 shrink-0 text-left"><Sparkles className="text-blue-500 w-4 h-4" /><h3 className="text-white font-black uppercase text-[10px] tracking-widest italic text-left">Premium AI Asset Store</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-32 text-left">
          {sortedApps.map(app => (<AssetCard key={app.id} app={app} />))}
        </div>
      </div>

      <div className="overflow-hidden bg-[#050505] border-y border-white/5 py-5 mb-10 whitespace-nowrap relative flex">
         <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10"></div>
         <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10"></div>
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
  const [openFaq, setOpenFaq] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const mainVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-black uppercase text-[10px] tracking-widest text-left">Awaiting Matrix Sync...</div>;

  const currentMedia = (app.media && app.media[activeMedia]) ? app.media[activeMedia] : (app.media && app.media[0]) ? app.media[0] : { url: data.bannerUrl, type: 'image' };
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const { s: sysData } = data.extractSys(app.description);
  
  const dbWhopField = app.whopLink || "";
  const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, ""];
  const mainWhopLink = data.formatExternalLink(sysData.w || parts[0]);
  const sourceCodeWhopLink = data.formatExternalLink(sysData.g || parts[1]);
  const faqList = app.faq && app.faq.length > 0 ? app.faq : data.DEFAULT_FAQ;

  const handleNextMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev + 1) % (app.media.length)); };
  const handlePrevMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev - 1 + app.media.length) % app.media.length); };

  const handleLinkClick = (e, link, type) => {
    trackEvent("whop_conversion", { name: app.name, type: type });
    if(link === "#") { e.preventDefault(); alert("MATRIX ERROR: Link synchronization pending."); }
  };

  return (
    <div className="bg-[#050505] pt-10 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO SMART</title><meta name="description" content={app.headline} /></Helmet>
      {fullScreenImage && (
        <div className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
          <button className="absolute top-10 right-10 text-white"><X className="w-10 h-10" /></button>
          <img src={fullScreenImage} className="max-w-full max-h-full object-contain shadow-2xl" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
        </div>
      )}
      
      <div className="max-w-7xl mx-auto relative text-left">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all">
          <ChevronLeft className="w-4 h-4" strokeWidth={3} /> <span>System Registry</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-12 items-start text-left">
          <div className="w-full lg:w-[70%] animate-fade-in text-left">
            <div className="aspect-video rounded-[2.5rem] overflow-hidden border border-orange-500 bg-black mb-10 relative group shadow-2xl shadow-orange-500/5 text-left">
              {app.media?.length > 1 && <div className="absolute top-6 left-6 px-3 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white font-black text-[9px] tracking-widest z-20">{activeMedia + 1} / {app.media.length}</div>}
              {!isVideo ? (
                <>
                  <img src={currentMedia.url} className="w-full h-full object-cover" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
                  <button onClick={(e) => { e.stopPropagation(); setFullScreenImage(currentMedia.url); trackEvent("image_fullscreen", { name: app.name }); }} className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 border border-white/10 transition-all z-20"><Maximize2 className="w-4 h-4" /></button>
                </>
              ) : ( 
                <div className="w-full h-full relative">
                  <UniversalVideoPlayer videoRef={mainVideoRef} url={currentMedia.url} autoPlay={true} loop={true} muted={true} hideControls={false} />
                </div>
              )}
              {app.media?.length > 1 && (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20">
                  <button onClick={handlePrevMedia} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:text-orange-500"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
                  <button onClick={handleNextMedia} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 transition-all transform hover:scale-110 hover:text-orange-500"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 mb-12 custom-scrollbar text-left">
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
            
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-4 leading-none text-left">{app.name}</h1>
            <div className="flex text-left"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase mb-10 tracking-[0.2em] shadow-xl shadow-blue-600/10">{sysData.b && sysData.b !== "AI ASSET" ? sysData.b : ((app.type && app.type !== "AI ASSET") ? app.type : 'AI ASSET')}</div></div>
            {app.headline && <p className="text-sm md:text-md text-white font-black mb-10 leading-tight border-l-4 border-orange-500 pl-5 italic text-left">{app.headline}</p>}
            <div className="border-t border-white/5 pt-8 mb-12 text-left">{renderDescription(app.description)}</div>
            
            <div className="mt-10 mb-20 text-left">
              <button onClick={() => { setOpenFaq(!openFaq); if(!openFaq) trackEvent("faq_opened", { name: app.name }); }} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all group ${openFaq ? 'bg-orange-600 border-orange-500 shadow-xl' : 'bg-white/[0.03] border-white/10 hover:border-orange-500/50'}`}>
                <div className="flex items-center gap-4"><HelpCircle className={`w-4 h-4 ${openFaq ? 'text-white' : 'text-orange-500'}`} /><div><span className="block text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">System FAQ Protocols</span></div></div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${openFaq ? 'rotate-180 text-white' : 'text-zinc-500'}`} />
              </button>
              {openFaq && (
                <div className="mt-2 space-y-2 p-4 bg-white/[0.01] border border-white/5 rounded-3xl text-left">
                  {faqList.map((item, i) => (
                    <div key={i} className="border border-white/5 rounded-xl bg-black/40 overflow-hidden text-left">
                      <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left group">
                        <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-tight pr-4 ${activeFaq === i ? 'text-orange-500' : 'text-zinc-400 group-hover:text-zinc-200'}`}>[{String(i+1).padStart(2, '0')}] {item.question || item.q}</span>
                        <PlusCircle className={`w-3.5 h-3.5 shrink-0 transition-transform ${activeFaq === i ? 'rotate-45 text-orange-500' : 'text-zinc-600'}`} />
                      </button>
                      {activeFaq === i && <div className="px-8 pb-4 text-zinc-400 text-[10px] leading-relaxed border-t border-white/5 pt-3">{item.answer || item.a}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="w-full lg:w-[30%] lg:sticky lg:top-40 font-sans animate-fade-in text-left">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl text-left relative">
              <img src={mojBaner} className="w-full h-24 object-cover border-b border-white/5 opacity-90" alt="Banner" onContextMenu={(e) => e.preventDefault()} draggable="false" />
              <div className="p-6 text-center text-left">
                <div className="space-y-2.5 mb-6 text-left font-black text-left">
                  <div className="group p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-left">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest text-left">Monthly</div><div className="text-lg md:text-xl text-white tracking-tighter text-left">${app.price || '0'}</div>
                  </div>
                  <div className="relative group p-3 rounded-xl bg-orange-500/[0.03] border border-orange-500/20 flex items-center justify-between mt-4 text-left">
                    <div className="absolute -top-2 left-4 bg-orange-600 text-white text-[6px] font-black px-2 py-0.5 rounded-full uppercase text-left">Ultimate Deal</div>
                    <div className="text-[9px] text-orange-500/70 uppercase tracking-widest text-left">Lifetime</div><div className="text-lg md:text-xl text-white tracking-tighter text-left">${app.priceLifetime || 'TBD'}</div>
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-blue-500 rounded-xl blur opacity-30 animate-pulse pointer-events-none"></div>
                    <a href={mainWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, mainWhopLink, "MAIN")} className="relative w-full py-3.5 rounded-xl flex items-center justify-center bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-blue-500 shadow-xl transition-all hover:scale-[1.02]">Unlock Access Now</a>
                  </div>
                  <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4 text-center text-left">
                    <div className="flex flex-col items-center gap-3 text-left">
                      <div className="flex items-center gap-2 text-left"><Award className="w-3.5 h-3.5 text-orange-500" /><span className="text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em]">Developer Pack</span></div>
                      <a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, sourceCodeWhopLink, "SOURCE")} className="w-full py-3.5 rounded-xl flex items-center justify-center border-2 border-blue-500/30 bg-blue-500/5 text-blue-400 font-black text-[8px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all group shadow-xl">
                        <FileCode className="w-3.5 h-3.5 mr-2" /> Source Code <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 z-[150] lg:hidden flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col"><span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Total Access</span><span className="text-xl font-black text-white">${app.price}</span></div>
        <a href={mainWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, mainWhopLink, "MAIN")} className="px-8 py-3.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-[pulse_2s_infinite]">Unlock Now</a>
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
  if (loading) return <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Učitavanje statistike...</div>;
  return ( <div className="space-y-6 animate-fade-in text-left"> <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left"> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group text-left"> <div className="flex items-center gap-3 mb-3 text-left"><Eye className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Ukupno pregleda sajta</span></div><div className="text-2xl md:text-3xl font-black text-white text-left">{stats.totalViews}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-green-500/30 transition-all group text-left"> <div className="flex items-center gap-3 mb-3 text-left"><Users className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Jedinstvenih Posetilaca</span></div><div className="text-2xl md:text-3xl font-black text-white text-left">{stats.uniqueVisitors}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all group text-left"> <div className="flex items-center gap-3 mb-3 text-left"><Clock className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Prosečno Zadržavanje</span></div><div className="text-2xl md:text-3xl font-black text-white text-left">{stats.avgSessionTime}</div> </div> <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-orange-500/30 transition-all group shadow-[0_0_20px_rgba(249,115,22,0.02)] text-left"> <div className="flex items-center gap-3 mb-3 text-left"><MousePointerClick className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Klikovi na Kupovinu</span></div><div className="text-2xl md:text-3xl font-black text-orange-500 text-left">{stats.whopClicks}</div> </div> </div> <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 shadow-[0_0_30px_rgba(249,115,22,0.03)] text-left"> <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-left"><ShoppingCart className="w-4 h-4 text-orange-500" /><h3 className="text-[10px] font-black uppercase tracking-widest">Statistika Klikova po Proizvodima</h3></div> <div className="overflow-x-auto custom-scrollbar text-left"> <table className="w-full text-left"> <thead className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5"> <tr><th className="pb-3 pl-4 text-left">Naziv Proizvoda</th><th className="pb-3 text-center">Klik na Glavni Alat</th><th className="pb-3 text-center">Klik na Source Code</th><th className="pb-3 text-right pr-4">Ukupno Klikova</th></tr> </thead> <tbody className="divide-y divide-white/5 text-left"> {stats.whopBreakdown.map((item, i) => ( <tr key={i} className="hover:bg-white/[0.02] transition-colors"><td className="py-3 pl-4 text-[9px] font-bold text-white uppercase truncate max-w-[200px]">{item.name}</td><td className="py-3 text-center text-[10px] font-black text-blue-500">{item.main}</td><td className="py-3 text-center text-[10px] font-black text-orange-500">{item.source}</td><td className="py-3 text-right pr-4 text-[10px] font-black text-white">{item.main + item.source}</td></tr> ))} </tbody> </table> </div> </div> </div> ); }

function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoToHide, setVideoToHide] = useState('');
  const [tab, setTab] = useState('intelligence');
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [openAdminFaq, setOpenAdminFaq] = useState(null); 
  const initialForm = { name: '', headline: '', type: 'AI ASSET', price: '', priceLifetime: '', description: data.ADMIN_DEFAULT_DESC, media: [], whopLink: '', reactSourceCode: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 
  const sortedApps = [...apps].reverse();
  const handleLogin = async (e) => { e.preventDefault(); try { const response = await fetch(`${BASE_BACKEND_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password }) }); if (response.ok) { const resData = await response.json(); localStorage.setItem('admin_token', resData.access_token); setIsAuthenticated(true); } else { alert("ACCESS DENIED: Pogrešna lozinka."); } } catch (err) { alert("SERVER ERROR: Backend nije dostupan."); } }; 
  const handleEditClick = (app) => { let loadedFaq = (app.faq || []).map(item => ({ q: item.question || item.q || '', a: item.answer || item.a || '' })); if (loadedFaq.length < 7) loadedFaq = [...loadedFaq, ...Array.from({ length: 7 - loadedFaq.length }, () => ({ q: '', a: '' }))]; const dbWhopField = app.whopLink || ""; const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, ""]; setFormData({ name: app.name || '', headline: app.headline || '', type: app.type || 'AI ASSET', price: app.price || '', priceLifetime: app.priceLifetime || '', description: app.description || '', media: Array.isArray(app.media) ? [...app.media] : [], whopLink: parts[0], reactSourceCode: parts[1], faq: loadedFaq }); setEditingId(app.id); setOpenAdminFaq(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }; 
  const handleSubmit = async (e) => { e.preventDefault(); const token = localStorage.getItem('admin_token'); const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; const payload = { id: editingId || String(Date.now()), name: formData.name || "", type: formData.type || "AI ASSET", headline: formData.headline || "", description: formData.description || "", price: formData.price || "", priceLifetime: formData.priceLifetime || "", whopLink: combinedWhopField, media: formData.media || [], faq: formData.faq.filter(f => f.q && f.a).map(f => ({question: f.q, answer: f.a})) }; try { const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { method: editingId ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) }); if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } else { alert("Neuspelo!"); } } catch (err) { alert("Network Error"); } }; 
  const handleFileUpload = async (e) => { const file = e.target.files[0]; if (!file) return; setIsUploading(true); const upData = new FormData(); upData.append('file', file); upData.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); try { const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: upData }); const result = await res.json(); if (result.secure_url) { setFormData(prev => ({ ...prev, media: [...(prev.media || []), { url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image' }] })); } } catch (err) {} finally { setIsUploading(false); } }; 
  if (!isAuthenticated) return ( <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans px-6 text-white text-center relative overflow-hidden"> <Helmet><title>Admin Terminal | AI TOOLS PRO SMART</title></Helmet> <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div> <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-12 rounded-[3rem] text-center w-full max-w-md relative z-10 animate-fade-in group shadow-2xl" style={{ border: '0.1px solid #f97316' }}> <div className="relative inline-flex items-center justify-center mb-8"><div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div><div className="bg-black/50 p-5 rounded-full border border-white/5 relative z-10 shadow-inner"><Fingerprint className="w-12 h-12 text-orange-500" /></div></div> <h2 className="text-white font-black uppercase mb-2 tracking-[0.5em] text-xs">Admin Terminal</h2> <p className="text-red-500 text-[10px] uppercase tracking-[0.2em] mb-10 font-black">Identity Verification Required</p> <form onSubmit={handleLogin} className="space-y-6"> <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="ENTER CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500/40 text-center text-[11px] tracking-[0.6em] transition-all" /> <button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 transition-all hover:bg-orange-500 shadow-xl"><span className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Authorize Access</span></button> </form> </div> </div> );
  return ( <div className="pt-10 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white"> <div className="flex gap-4 mb-10 overflow-hidden"> <button onClick={() => setTab('intelligence')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'intelligence' ? 'bg-orange-600 text-white shadow-xl' : 'bg-white/5 text-zinc-500'}`}>Intelligence</button> <button onClick={() => setTab('system')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'system' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-zinc-500'}`}>System Registry</button> </div> {tab === 'intelligence' ? <IntelligenceDashboard /> : ( <div className="animate-fade-in space-y-8"> <div className="bg-[#0a0a0a] border border-orange-500/20 p-6 rounded-[2.5rem] mb-8 flex items-center gap-6 shadow-xl"> <Youtube className="w-5 h-5 text-orange-500 shrink-0" /> <form onSubmit={async (e) => { e.preventDefault(); const token = localStorage.getItem('admin_token'); await fetch(`${HIDDEN_VIDEOS_API_URL}/${videoToHide}`, {method:'POST', headers: { 'Authorization': `Bearer ${token}` }}); setVideoToHide(''); alert('Hidden'); }} className="flex-1 flex gap-3"> <input type="text" value={videoToHide} onChange={e => setVideoToHide(e.target.value)} placeholder="GHOST VIDEO ID..." className="bg-black border border-white/10 p-3.5 rounded-xl text-white text-[10px] flex-1 outline-none font-mono" /> <button className="bg-orange-600 px-6 py-3.5 rounded-xl text-white font-black text-[9px] uppercase shadow-lg">Kill Feed</button> </form> </div> <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl"> <form onSubmit={handleSubmit} className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" required /></div> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ribbon Text</label><input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Npr. HOT 🔥" className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" /></div> </div> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Headline</label><input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" /></div> <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Specs</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-white text-[11px] h-64 resize-none outline-none" /></div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-4"> <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Media Manifest</label> <label className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Loader2 className={`animate-spin text-blue-500 w-4 h-4 ${isUploading ? 'block' : 'hidden'}`} /><UploadCloud className={`w-4 h-4 ${isUploading ? 'hidden' : 'block'}`} /><span className="text-[10px] font-black uppercase">Upload PC File</span><input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} /></label> <div className="grid grid-cols-4 gap-2 mt-4"> {formData.media?.map((m, i) => ( <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-white/10"> {m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (<><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-4 h-4 text-orange-500" /></div></>) : <img src={m.url} className="w-full h-full object-cover" alt="" />} <button type="button" onClick={() => setFormData(p => ({...p, media: p.media.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3 text-white" /></button> </div> ))} </div> </div> <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3"> <div className="flex gap-2"><input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Monthly $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" /><input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" /></div> <input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Asset Whop Link" className="bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" /> <input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="React Source Link" className="bg-black border border-orange-500/30 p-2.5 rounded-xl text-white text-[10px] outline-none" /> </div> </div> <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-xl ${editingId ? 'bg-blue-600' : 'bg-orange-600'}`}>{editingId ? 'Save Changes' : 'Execute Deploy'}</button> {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} className="w-full py-2 text-[9px] font-black uppercase text-zinc-500">Cancel Edit</button>} </form> <div className="mt-12 space-y-3"> <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"> {sortedApps.map(app => ( <div key={app.id} className={`flex items-center justify-between p-3 border rounded-xl ${editingId === app.id ? 'bg-orange-600/10 border-orange-500/30' : 'bg-black border-white/5'}`}> <div className="flex items-center gap-3 truncate"> <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0"> {app.media?.[0]?.type === 'video' ? <video src={`${app.media[0].url}#t=0.001`} className="w-full h-full object-cover" /> : <img src={data.getMediaThumbnail(app.media?.[0]?.url)} className="w-full h-full object-cover" alt="" />} </div> <h4 className="text-white font-black uppercase text-[9px] truncate">{app.name}</h4> </div> <div className="flex gap-2"> <button onClick={() => handleEditClick(app)} className="p-2 bg-white/5 rounded-lg hover:bg-blue-600"><Edit className="w-3.5 h-3.5" /></button> <button onClick={async () => { if(window.confirm('Delete?')) { const token = localStorage.getItem('admin_token'); await fetch(`${API_URL}/${app.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }}); refreshData(); } }} className="p-2 bg-white/5 rounded-lg hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button> </div> </div> ))} </div> </div> </div> </div> )} </div> ); }

function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const [secretFound, setSecretFound] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [visitors, setVisitors] = useState(42);
  const location = useLocation();
  useEffect(() => { data.trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);
  useEffect(() => { let keystrokes = ''; const handleKeyDown = (e) => { if(e.key.length === 1) { keystrokes += e.key.toUpperCase(); if (keystrokes.length > 10) keystrokes = keystrokes.slice(-10); if (keystrokes.includes('MATRIX') || keystrokes.includes('NEO')) { setIsShaking(true); setTimeout(() => { setSecretFound(true); setIsShaking(false); }, 800); keystrokes = ''; } } }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, []);
  useEffect(() => { const handleMouseLeave = (e) => { if (e.clientY <= 10 && !sessionStorage.getItem('exitIntentShown')) { setShowExitIntent(true); sessionStorage.setItem('exitIntentShown', 'true'); } }; document.addEventListener('mouseleave', handleMouseLeave); return () => document.removeEventListener('mouseleave', handleMouseLeave); }, []);
  const [statusIdx, setStatusIdx] = useState(0);
  useEffect(() => { const t1 = setInterval(() => setStatusIdx(prev => (prev + 1) % data.STATUSES.length), 3500); const t2 = setInterval(() => { setVisitors(prev => { let newVal = prev + (Math.floor(Math.random() * 5) - 2); return newVal < 35 ? 35 : newVal > 85 ? 85 : newVal; }); }, 4500); return () => { clearInterval(t1); clearInterval(t2); }; }, []);
  return (
    <div className={`min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans text-left relative pb-20 lg:pb-0 ${isShaking ? 'animate-shake' : ''}`}>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } } .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; } @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 35s linear infinite; }`}</style>
      {isBooting && <FullScreenBoot onComplete={() => setIsBooting(false)} />}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <UrgencyBar />
        <nav className="w-full px-6 md:px-10 py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-4 md:gap-6 group">
                <img src={data.logoUrl} className="h-9 md:h-12 object-contain transition-transform group-hover:scale-105 animate-pulse" alt="logo" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
              </Link>
            </div>
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