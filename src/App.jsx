import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  Sparkles, PlayCircle, CheckCircle2, Youtube, X, 
  ChevronDown, Zap, ChevronLeft, ChevronRight, FileCode, Award, 
  ShieldCheck, ArrowRight, Maximize2, PlusCircle, LayoutList, Edit, Trash2,
  UploadCloud, Loader2, Activity, Database, Fingerprint, Terminal, HardDrive,
  Video, Image as Imagelcon, Check, Play, HelpCircle, Eye, MousePointerClick, Smartphone, Clock, Users, BarChart3,
  ShoppingCart, Copy, Lock, Shield, Camera, Cctv, Dices
} from 'lucide-react';

// FIREBASE INTEGRATION
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from "firebase/firestore";

import * as data from './data';
import mojBaner from './moj-baner.png'; 

// --- KONFIGURACIJA LINKOVA ---
const BASE_BACKEND_URL = "https://aitoolsprosmart-becend-production.up.railway.app"; 
const API_URL = `${BASE_BACKEND_URL}/api/products`;
const VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/youtube`; 
const HIDDEN_VIDEOS_API_URL = `${BASE_BACKEND_URL}/api/hidden-videos`;

// --- ADVANCED ANALYTICS ENGINE ---
const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const trackEvent = async (action, details = {}) => {
  try {
    await addDoc(collection(db, "site_stats"), {
      action, ...details, sessionId: SESSION_ID, localTime: Date.now(), timestamp: serverTimestamp(), userAgent: navigator.userAgent, path: window.location.pathname
    });
  } catch (e) { console.error("Stats Error", e); }
};

// --- TYPEWRITER COMPONENT ---
function TypewriterText({ text, speed = 15 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    if (!text) return;

    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <>{displayedText}</>;
}

function UniversalVideoPlayer({ url, autoPlay = true, loop = false, muted = false, hideControls = false, onEnded, videoRef }) {
  const ytId = data.getYouTubeId(url);
  const baseClasses = hideControls ? "w-full h-full object-cover pointer-events-none" : "w-full h-full object-cover";
  const iframeClasses = hideControls ? "w-full h-full pointer-events-none" : "w-full h-full";
  if (ytId) {
    let src = `https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&rel=0&controls=${hideControls ? 0 : 1}`;
    if (muted) src += `&mute=1`;
    if (loop) src += `&loop=1&playlist=${ytId}`; 
    return <iframe className={iframeClasses} src={src} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen onContextMenu={(e) => e.preventDefault()}></iframe>;
  }
  return <video ref={videoRef} src={url} className={baseClasses} autoPlay={autoPlay} loop={loop} muted={muted} controls={!hideControls} playsInline preload="metadata" onEnded={onEnded} controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} />;
}

const renderDescription = (text) => {
  const { d: cleanDesc } = data.extractSys(text);
  if (!cleanDesc) return <p className="text-zinc-500 italic text-[10px]">Data ready.</p>;
  return cleanDesc.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2"></div>;
    const upperTrimmed = trimmed.toUpperCase();
    if (upperTrimmed.includes('KEY FEATURES') || upperTrimmed.includes('WHO IS THIS FOR') || upperTrimmed.includes('[DESCRIPTION]') || upperTrimmed.includes('VALUE MULTIPLIER')) {
        return <h3 key={idx} className="text-[12px] font-black text-white mt-10 mb-4 uppercase tracking-widest border-l-4 border-orange-500 pl-4 italic text-left">{trimmed}</h3>;
    }
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      return (
        <div key={idx} className="flex gap-3 items-start my-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5 text-left">
          <CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <p className="text-white text-[11px] font-bold">{trimmed.replace(/^[*-]\s*/, '')}</p>
        </div>
      );
    }
    return <p key={idx} className="text-white text-[11px] font-bold leading-relaxed my-3 text-left">{trimmed}</p>;
  });
};

// --- FULL SCREEN TERMINAL BOOT ---
function FullScreenBoot({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const hexChars = '0123456789ABCDEF';
    const protocols = [
      "Decrypting V8 Engine modules...", 
      "Bypassing mainframe firewalls...", 
      "Injecting hyper-realistic datasets...", 
      "Allocating 128GB VRAM...", 
      "Compiling Abstract nodes...", 
      "Establishing neural handshake...", 
      "Syncing with global matrix..."
    ];

    const generateLine = () => {
      if (Math.random() > 0.8) return `> [OK] ${protocols[Math.floor(Math.random() * protocols.length)]}`;
      let line = '0x';
      for(let i=0; i<8; i++) line += hexChars[Math.floor(Math.random() * hexChars.length)];
      line += ' ';
      const length = Math.floor(Math.random() * 50) + 30;
      for(let i=0; i<length; i++) line += hexChars[Math.floor(Math.random() * hexChars.length)];
      return line;
    };

    const interval = setInterval(() => {
      setLines(prev => {
         const newLines = [...prev, generateLine()];
         return newLines.length > 70 ? newLines.slice(newLines.length - 70) : newLines; 
      });
    }, 30); 

    const t1 = setTimeout(() => {
      clearInterval(interval);
      setLines(prev => [...prev, "", "> SYSTEM INTEGRATION COMPLETE.", "> ACCESS GRANTED."]);
    }, 2200);

    const t2 = setTimeout(() => setFading(true), 2600);
    const t3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#050505] text-green-500 font-mono text-[9px] sm:text-[11px] overflow-hidden transition-opacity duration-[400ms] pointer-events-none ${fading ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute bottom-0 left-0 w-full px-4 py-6 sm:px-8 sm:py-8 flex flex-col justify-end space-y-0.5 opacity-90">
        {lines.map((l, i) => (
           <div key={i} className={l.includes('ACCESS GRANTED') ? 'text-green-400 font-black text-sm sm:text-base mt-4 animate-pulse' : 'break-all'}>
              {l}
           </div>
        ))}
      </div>
    </div>
  );
}

function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => { canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; };
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14; let columns = canvas.width / fontSize;
    let drops = Array(Math.floor(columns)).fill(1);
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0F0'; ctx.font = fontSize + 'px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 35); return () => clearInterval(interval);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-[15] opacity-[0.15] pointer-events-none" />;
}

function UrgencyBar() {
  const [timeLeft, setTimeLeft] = useState("02:45:12");
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft(`${String(23-now.getHours()).padStart(2,'0')}:${String(59-now.getMinutes()).padStart(2,'0')}:${String(59-now.getSeconds()).padStart(2,'0')}`);
    }, 1000); return () => clearInterval(timer);
  }, []);
  return (
    <div className="w-full bg-black border-b border-orange-500/20 py-1.5 overflow-hidden flex items-center justify-center gap-3 md:gap-6 px-4 relative z-[200]">
      <span className="text-[7px] md:text-[8px] font-black text-orange-500 uppercase tracking-[0.3em] animate-pulse">System Alert: Flash License Deal</span>
      <div className="flex items-center gap-2 bg-orange-600/10 px-3 py-0.5 rounded-full border border-orange-500/30">
         <span className="text-[8px] font-black text-white font-mono">{timeLeft}</span>
      </div>
      <span className="hidden sm:inline text-[7px] md:text-[8px] font-black text-zinc-500 uppercase tracking-widest">Price Increase Imminent</span>
    </div>
  );
}

function TutorialCard({ vid }) {
  const videoId = data.getYouTubeId(vid.url);
  const [imgSrc, setImgSrc] = useState(videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : data.bannerUrl);

  const handleTutorialClick = () => {
    if (videoId) {
      window.open(vid.url, '_blank');
      trackEvent("tutorial_external_open", { title: vid.title, video_id: videoId });
    }
  };

  return (
    <div className="p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 shadow-xl rounded-[2rem] flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group">
      <div className="bg-[#0a0a0a] rounded-[1.9rem] p-4 flex flex-col h-full relative">
        <div className="aspect-video relative overflow-hidden rounded-2xl mb-4 bg-zinc-900 border-2 border-blue-500/60 group-hover:border-blue-400 cursor-pointer transition-all duration-500" onClick={handleTutorialClick}>
              <img src={imgSrc} onError={() => setImgSrc(videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : data.bannerUrl)} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" alt="" />
              {videoId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-transparent transition-all">
                  <PlayCircle className="w-12 h-12 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] opacity-90 group-hover:scale-110 transition-all" />
                </div>
              )}
              <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] font-black uppercase text-white border border-white/10 flex items-center gap-1.5 shadow-xl">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.8)]"></div> Live
              </div>
        </div>
        <h4 className="text-zinc-300 group-hover:text-white font-bold text-[10px] uppercase tracking-tight line-clamp-2 transition-colors leading-relaxed text-left">{vid.title}</h4>
      </div>
    </div>
  );
}

function AssetCard({ app }) {
  const mediaItem = app?.media?.[0];
  const isVideo = mediaItem?.type === 'video' || mediaItem?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${mediaItem.url}#t=0.001` : data.getMediaThumbnail(mediaItem?.url, mediaItem?.type);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  const { s: sysData } = data.extractSys(app.description);

  const handlePlayClick = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (videoRef.current && !isPlaying) { 
      videoRef.current.play(); 
      setIsPlaying(true); 
      trackEvent("asset_preview_start", { name: app.name, asset_id: app.id }); 
    }
  };

  const ribbonText = sysData.t && sysData.t !== "LATEST ⚡" ? sysData.t : ((app.type && app.type !== "AI ASSET") ? app.type : "LATEST ⚡");
  let ribbonColor = "from-blue-700 via-blue-500 to-blue-700 shadow-[0_5px_15px_rgba(59,130,246,0.6)] border-blue-400/50";
  const upperText = ribbonText.toUpperCase();
  
  if (upperText.includes("HOT")) {
    ribbonColor = "from-red-700 via-red-500 to-red-700 shadow-[0_5px_15px_rgba(220,38,38,0.6)] border-red-400/50";
  } else if (upperText.includes("POPULAR") || upperText.includes("BEST")) {
    ribbonColor = "from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_5px_15px_rgba(234,179,8,0.6)] border-yellow-400/50";
  } else if (upperText.includes("NEW") || upperText.includes("UPDATE")) {
    ribbonColor = "from-green-600 via-green-400 to-green-600 shadow-[0_5px_15px_rgba(34,197,94,0.6)] border-green-400/50";
  }

  return (
    <div className="relative overflow-hidden p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 shadow-2xl rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] flex flex-col group h-full text-white hover:shadow-[4px_0px_0px_rgba(239,68,68,0.4),-4px_0px_0px_rgba(59,130,246,0.4)]">
      <div className={`absolute top-7 -right-10 z-50 w-40 bg-gradient-to-r ${ribbonColor} text-white text-center py-1.5 font-black text-[9px] uppercase tracking-[0.2em] border-y transform rotate-45 pointer-events-none`}>{ribbonText}</div>
      <div className="bg-[#0a0a0a] rounded-[2.4rem] flex flex-col h-full p-8 relative">
        <div 
          className="aspect-video relative overflow-hidden rounded-[1.5rem] mb-6 border-2 border-blue-500/60 group-hover:border-blue-400 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-all duration-500 bg-zinc-900 cursor-pointer" 
          onClick={(!isPlaying && isVideo) ? handlePlayClick : undefined}
        >
          {isVideo ? (
            <>
              <video 
                ref={videoRef} src={displayUrl} preload="metadata" muted playsInline controls={isPlaying} controlsList="nodownload" onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-full object-cover transition-all ${isPlaying ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                onPlay={() => { setIsPlaying(true); trackEvent("asset_preview_start", { name: app.name }); }}
                onPause={() => setIsPlaying(false)}
                onEnded={() => { setIsPlaying(false); if(videoRef.current) videoRef.current.currentTime = 0.001; }}
              />
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <PlayCircle className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] group-hover:scale-110 transition-transform" />
                </div>
              )}
            </>
          ) : (
            <img src={displayUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
          )}
        </div>
        <div className="flex justify-between items-start mb-3 gap-4">
          <h2 className="text-sm md:text-base font-black uppercase group-hover:text-orange-500 transition-all duration-300 leading-none text-left group-hover:translate-x-1">{app.name}</h2>
          <div className="px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 shadow-lg">${app.price}</div>
        </div>
        <p className="text-zinc-400 text-[10px] md:text-xs mb-4 line-clamp-2 text-left">{app.headline}</p>
        
        <div className="flex gap-4 mb-8 border-t border-white/5 pt-4">
           <div className="flex flex-col"><span className="text-[6px] text-zinc-500 font-black uppercase tracking-widest">V8 Speed</span><span className="text-[9px] font-bold text-white">0.{Math.floor(Math.random() * 9)}ms</span></div>
           <div className="flex flex-col"><span className="text-[6px] text-zinc-500 font-black uppercase tracking-widest">Logic</span><span className="text-[9px] font-bold text-white">{95 + Math.floor(Math.random() * 4)}%</span></div>
           <div className="flex flex-col"><span className="text-[6px] text-zinc-500 font-black uppercase tracking-widest">Engine</span><span className="text-[9px] font-bold text-blue-500">MAX</span></div>
        </div>

        <div className="mt-auto pt-4 text-left">
          <Link to={`/app/${app.id}`} onClick={() => trackEvent("asset_click", { name: app.name, asset_id: app.id })} className="w-full py-3.5 bg-blue-600 border border-blue-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 group-hover:bg-blue-500 shadow-xl transition-all">
            MORE DETAILS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LiveSalesNotification({ apps }) {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if(!apps || apps.length === 0) return;
    const interval = setInterval(() => {
       const names = data.SALES_NAMES || ["Michael T.", "David K.", "Sarah L."];
       const countries = data.SALES_COUNTRIES || ["USA", "UK", "Canada"];
       const randomName = names[Math.floor(Math.random() * names.length)];
       const randomCountry = countries[Math.floor(Math.random() * countries.length)];
       const randomApp = apps[Math.floor(Math.random() * apps.length)].name;
       
       setNotification({ name: randomName, country: randomCountry, product: randomApp });
       setIsVisible(true);
       setTimeout(() => { setIsVisible(false); }, 5000); 
    }, 28000); 
    return () => clearInterval(interval);
  }, [apps]);

  return (
    <div className={`fixed bottom-6 left-6 z-[200] bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="bg-green-500/20 p-2.5 rounded-full border border-green-500/30">
        <Check className="text-green-500 w-4 h-4"/>
      </div>
      <div>
        <p className="text-[9px] text-zinc-400 font-bold mb-0.5">{notification?.name} from {notification?.country} just bought</p>
        <p className="text-[11px] font-black text-white">{notification?.product}</p>
      </div>
    </div>
  );
}

function StarIcon() {
  return <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>;
}

// --- GLAVNE STRANICE ---

function HomePage({ apps = [] }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [liveVideos, setLiveVideos] = useState([]);
  
  // STATE ZA ENHANCER ALAT
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

  useEffect(() => { fetch(VIDEOS_API_URL).then(res => res.json()).then(db => { if (Array.isArray(db)) { setLiveVideos(db); } }); }, []);
  useEffect(() => { if (location.hash === '#marketplace') { setTimeout(() => { const el = document.getElementById('marketplace'); if (el) { window.scrollTo({top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth'}); } }, 100); } else if (!location.hash) { window.scrollTo(0, 0); } }, [location]);

  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % data.BANNER_DATA.length), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + data.BANNER_DATA.length) % data.BANNER_DATA.length);
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);

  const handleRollDice = () => {
    const randomIdeas = [
      "a neon cyberpunk samurai in the rain",
      "a giant bioluminescent mushroom forest",
      "a futuristic sports car drifting in Tokyo",
      "an ancient dragon guarding a mountain of gold",
      "a hyper-realistic cybernetic wolf howling",
      "a monumental floating island with a magical castle",
      "a lone astronaut exploring a ruined alien city"
    ];
    const random = randomIdeas[Math.floor(Math.random() * randomIdeas.length)];
    setDemoInput(random);
    setCustomerPrompt(''); 
  };

  const handleEnhance = () => {
    if(!demoInput && !customerPrompt) return;
    setIsEnhancing(true);
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' });
    setCopiedBox('');
    
    setTimeout(() => {
      if (customerPrompt.trim().length > 0) {
          const envs = data.CINEMATIC_ENVS || ["in a bustling cyberpunk metropolis"];
          const lights = data.CINEMATIC_LIGHTS || ["volumetric god rays piercing through thick atmospheric mist"];
          const cams = data.CINEMATIC_CAMS || ["shot on ARRI Alexa 65, 35mm lens, f/1.8"];
          const colors = data.CINEMATIC_COLORS || ["vivid cinematic color grading"];

          const env = envs[Math.floor(Math.random() * envs.length)];
          const light = lights[Math.floor(Math.random() * lights.length)];
          const cam = cams[Math.floor(Math.random() * cams.length)];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          const cleanInput = customerPrompt.trim();
          let finalPrompt = "";

          if (selectedQuality === '1x') finalPrompt = `A high-quality cinematic image of ${cleanInput}, located ${env}. The scene features ${light}. ${cam}, ${color}. Aspect ratio: ${selectedAR}.`;
          else if (selectedQuality === '2x') finalPrompt = `A breathtaking photorealistic render of ${cleanInput}, displaying monumental scale and precise details. Set ${env}. The environment is beautifully illuminated by ${light}. ${cam}, ${color}. Unreal Engine 5 render, 8k resolution, cinematic VFX. Aspect ratio: ${selectedAR}.`;
          else finalPrompt = `A hyper-realistic, award-winning cinematic masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${env}. The dramatic atmosphere is defined by ${light}. ${cam}, ${color}. Octane render, full ray tracing, global illumination, subsurface scattering, trending on CGSociety, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

          setGeneratedPrompts(prev => ({ ...prev, single: finalPrompt }));
          setPromptHistory(prev => [finalPrompt, ...prev].slice(0, 3)); 
      } 
      else if (demoInput.trim().length > 0) {
          const cleanInput = demoInput.trim().toUpperCase();

          const aEnv = (data.ABSTRACT_ENVS || ["in a void"])[Math.floor(Math.random() * (data.ABSTRACT_ENVS?.length || 1))];
          const aLight = (data.ABSTRACT_LIGHTS || ["ethereal glow"])[Math.floor(Math.random() * (data.ABSTRACT_LIGHTS?.length || 1))];
          const aCam = (data.ABSTRACT_CAMS || ["kaleidoscopic lens"])[Math.floor(Math.random() * (data.ABSTRACT_CAMS?.length || 1))];
          const aColor = (data.ABSTRACT_COLORS || ["iridescent hues"])[Math.floor(Math.random() * (data.ABSTRACT_COLORS?.length || 1))];

          let pAbs = "";
          if (selectedQuality === '1x') pAbs = `A high-quality abstract representation of ${cleanInput}, located ${aEnv}. The scene features ${aLight}. ${aCam}, ${aColor}. Aspect ratio: ${selectedAR}.`;
          else if (selectedQuality === '2x') pAbs = `A breathtaking surreal render of ${cleanInput}, displaying monumental scale and mind-bending details. Set ${aEnv}. The environment is beautifully illuminated by ${aLight}. ${aCam}, ${aColor}. Octane render, 8k resolution, conceptual art. Aspect ratio: ${selectedAR}.`;
          else pAbs = `A hyper-detailed, award-winning abstract masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly constructed. The subject is perfectly placed ${aEnv}. The surreal atmosphere is defined by ${aLight}. ${aCam}, ${aColor}. Fluid simulation, full ray tracing, global illumination, subsurface scattering, trending on ArtStation, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

          const cEnv = (data.CINEMATIC_ENVS || ["in a cyberpunk city"])[Math.floor(Math.random() * (data.CINEMATIC_ENVS?.length || 1))];
          const cLight = (data.CINEMATIC_LIGHTS || ["dramatic chiaroscuro"])[Math.floor(Math.random() * (data.CINEMATIC_LIGHTS?.length || 1))];
          const cCam = (data.CINEMATIC_CAMS || ["ARRI Alexa 65"])[Math.floor(Math.random() * (data.CINEMATIC_CAMS?.length || 1))];
          const cColor = (data.CINEMATIC_COLORS || ["teal and orange"])[Math.floor(Math.random() * (data.CINEMATIC_COLORS?.length || 1))];

          let pCin = "";
          if (selectedQuality === '1x') pCin = `A high-quality cinematic movie still of ${cleanInput}, located ${cEnv}. The scene features ${cLight}. ${cCam}, ${cColor}. Aspect ratio: ${selectedAR}.`;
          else if (selectedQuality === '2x') pCin = `A breathtaking cinematic blockbuster shot of ${cleanInput}, displaying monumental scale and precise details. Set ${cEnv}. The environment is beautifully illuminated by ${cLight}. ${cCam}, ${cColor}. Unreal Engine 5 render, 8k resolution, cinematic VFX. Aspect ratio: ${selectedAR}.`;
          else pCin = `A hyper-realistic, award-winning cinematic masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${cEnv}. The dramatic atmosphere is defined by ${cLight}. ${cCam}, ${cColor}. Octane render, full ray tracing, global illumination, subsurface scattering, IMDb top rated aesthetic, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

          const pEnv = (data.PHOTOREAL_ENVS || ["in a minimalist room"])[Math.floor(Math.random() * (data.PHOTOREAL_ENVS?.length || 1))];
          const pLight = (data.PHOTOREAL_LIGHTS || ["natural window light"])[Math.floor(Math.random() * (data.PHOTOREAL_LIGHTS?.length || 1))];
          const pCam = (data.PHOTOREAL_CAMS || ["Hasselblad H6D"])[Math.floor(Math.random() * (data.PHOTOREAL_CAMS?.length || 1))];
          const pColor = (data.PHOTOREAL_COLORS || ["true-to-life colors"])[Math.floor(Math.random() * (data.PHOTOREAL_COLORS?.length || 1))];

          let pPho = "";
          if (selectedQuality === '1x') pPho = `A high-quality raw photograph of ${cleanInput}, located ${pEnv}. The scene features ${pLight}. ${pCam}, ${pColor}. Aspect ratio: ${selectedAR}.`;
          else if (selectedQuality === '2x') pPho = `A breathtaking hyper-realistic photography of ${cleanInput}, displaying precise details and sharp focus. Set ${pEnv}. The environment is beautifully illuminated by ${pLight}. ${pCam}, ${pColor}. 8k resolution, professional studio quality. Aspect ratio: ${selectedAR}.`;
          else pPho = `An ultra-photorealistic, award-winning macro photography masterpiece of ${cleanInput}, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${pEnv}. The natural atmosphere is defined by ${pLight}. ${pCam}, ${pColor}. Unfiltered RAW photo, extreme micro-details, global illumination, National Geographic aesthetic, true-to-life color depth, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

          const ccEnv = (data.CCTV_ENVS || ["in a dark alley"])[Math.floor(Math.random() * (data.CCTV_ENVS?.length || 1))];
          const ccLight = (data.CCTV_LIGHTS || ["harsh infrared night vision"])[Math.floor(Math.random() * (data.CCTV_LIGHTS?.length || 1))];
          const ccCam = (data.CCTV_CAMS || ["wide-angle security camera"])[Math.floor(Math.random() * (data.CCTV_CAMS?.length || 1))];
          const ccColor = (data.CCTV_COLORS || ["monochromatic grainy colors"])[Math.floor(Math.random() * (data.CCTV_COLORS?.length || 1))];

          let pCctv = "";
          if (selectedQuality === '1x') pCctv = `A realistic CCTV security camera footage of ${cleanInput}, located ${ccEnv}. The scene features ${ccLight}. ${ccCam}, ${ccColor}. Aspect ratio: ${selectedAR}.`;
          else if (selectedQuality === '2x') pCctv = `A highly realistic surveillance camera still of ${cleanInput}, caught on tape ${ccEnv}. The environment is illuminated by ${ccLight}. ${ccCam}, ${ccColor}. Raw unedited CCTV footage, real security feed. Aspect ratio: ${selectedAR}.`;
          else pCctv = `A hyper-realistic, authentic found-footage security camera still capturing ${cleanInput}, perfectly placed ${ccEnv}. The gritty atmosphere is defined by ${ccLight}. ${ccCam}, ${ccColor}. Extreme realism, timestamp overlay in the corner, low dynamic range, actual security video leak, unedited raw documentation. Aspect ratio: ${selectedAR}.`;

          setGeneratedPrompts({ single: '', abstract: pAbs, cinematic: pCin, photoreal: pPho, cctv: pCctv });
          setPromptHistory(prev => [pCin, ...prev].slice(0, 3)); 
      }

      setIsEnhancing(false);
    }, 800);
  };

  const handleCopy = (text, boxName) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    setCopiedBox(boxName);
    setTimeout(() => setCopiedBox(''), 2500);
  };

  const handleCopyHistory = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedHistoryIndex(index);
    setTimeout(() => setCopiedHistoryIndex(null), 2000);
  };

  return (
    <>
      <Helmet>
        <title>AI TOOLS PRO SMART | PROMPT GENERATOR</title>
        <meta name="description" content="Command center for data control and generating complex AI architectures." />
      </Helmet>

      <div className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black pt-24 text-white text-left">
        <MatrixRain />
        {data.BANNER_DATA.map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={item.url} className="w-full h-full object-cover mt-12" alt="" onContextMenu={(e) => e.preventDefault()} draggable="false" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] via-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-full z-20" style={{ borderTop: '0.1px solid #f97316' }}></div>
          </div>
        ))}
        <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all duration-300">
          <ChevronLeft className="w-6 h-6" strokeWidth={3} />
        </button>
        <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all duration-300">
          <ChevronRight className="w-6 h-6" strokeWidth={3} />
        </button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-30">
          {data.BANNER_DATA.map((_, i) => (
            <button key={i} onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <div className="relative z-20 max-w-7xl mx-auto px-6 pb-20 w-full text-left font-sans">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest">{data.BANNER_DATA[activeSlide]?.badge || "Featured"}</div>
          <h1 className="text-xl md:text-3xl font-black uppercase mb-1.5 tracking-tighter drop-shadow-lg hover:tracking-widest transition-all duration-500">{data.BANNER_DATA[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[10px] md:text-xs max-w-lg font-medium opacity-90">{data.BANNER_DATA[activeSlide]?.subtitle}</p>
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
          {liveVideos.map((vid, i) => (<TutorialCard key={i} vid={vid} />))}
        </div>

        {/* 10x PROMPT ENHANCER (LEAD MAGNET) */}
        <div id="enhancer" className="mb-24 scroll-mt-32">
          <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_30px_rgba(249,115,22,0.05)] relative overflow-hidden flex flex-col group hover:border-orange-500/40 transition-all">
             
             <div className="mb-8 text-left w-full">
               <div className="flex flex-wrap gap-3 mb-4">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                     <Zap className="w-3 h-3 text-orange-500 animate-pulse" /> 
                     <span className="text-[8px] font-black uppercase text-orange-500 tracking-widest">Free Demo • $100/Month Value</span>
                   </div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                     <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" /> 
                     <span className="text-[8px] font-black uppercase text-blue-500 tracking-widest">Optimized for all AI Image Generators</span>
                   </div>
               </div>
               <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-2">10x Prompt Enhancer</h2>
               <div className="text-[10px] md:text-[11px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">
                 Premium tool worth $100/month. Currently free to use.
               </div>
               <p className="text-zinc-400 text-[10px] md:text-xs max-w-2xl leading-relaxed">
                 Test the matrix architecture. Enter a simple concept, adjust the parameters, and let the engine inject cinematic fidelity instantly. <br/>
                 <span className="text-orange-500 font-black mt-2 inline-block">SYSTEM NOTE:</span> Due to the neural variance of AI engines, the exact same prompt will generate completely unique, high-end variations every time.
               </p>
             </div>

             <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch">
               
               {/* KOLONA 1: UNOS I OPCIJE */}
               <div className="flex-1 w-full lg:max-w-md flex flex-col justify-start space-y-6">
                 
                 <div className="w-full">
                   {/* KORAK 1: CONCEPT */}
                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">1. Target Concept / Subject</label>
                   <div className="relative mb-4">
                     <input 
                        type="text" 
                        value={demoInput} 
                        onChange={e => setDemoInput(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleEnhance()} 
                        placeholder="e.g. 'a red sports car' or 'a medieval warrior'" 
                        disabled={customerPrompt.length > 0}
                        className={`w-full bg-black border rounded-xl pl-4 pr-12 py-4 text-white text-[11px] outline-none transition-all shadow-inner ${customerPrompt.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} 
                     />
                     
                     {/* KOCKICE SE VIDE DOK JE POLJE PRAZNO */}
                     {!demoInput && customerPrompt.length === 0 && (
                        <button 
                          onClick={handleRollDice} 
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600/10 p-1.5 rounded-lg group hover:bg-blue-600 transition-all"
                          title="Roll for a random idea"
                        >
                          <Dices className="w-4 h-4 text-blue-500 group-hover:text-white transition-all" />
                        </button>
                     )}

                     {/* X SE POJAVLJUJE KAD SE NESTO UKUCA */}
                     {demoInput && (
                       <button 
                         onClick={() => { setDemoInput(''); setGeneratedPrompts({single:'', abstract:'', cinematic:'', photoreal:'', cctv:''}); setCopiedBox(''); }} 
                         className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"
                         title="Clear input"
                       >
                         <X className="w-4 h-4 text-red-500 group-hover:text-white transition-all" />
                       </button>
                     )}
                   </div>

                   {/* NOVO POLJE: CUSTOMER PROMPT */}
                   <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-2">Or Paste Your Customer Prompt</label>
                   <div className="relative mb-4">
                     <textarea 
                        value={customerPrompt} 
                        onChange={e => setCustomerPrompt(e.target.value)} 
                        placeholder="Paste your existing detailed prompt here..." 
                        disabled={demoInput.length > 0}
                        className={`w-full bg-black border rounded-xl p-4 pr-12 text-white text-[11px] outline-none transition-all shadow-inner resize-none min-h-[100px] ${demoInput.length > 0 ? 'border-white/5 opacity-30 cursor-not-allowed' : 'border-white/10 focus:border-blue-500/50'}`} 
                     />
                     {customerPrompt && (
                       <button 
                         onClick={() => { setCustomerPrompt(''); setGeneratedPrompts({single:'', abstract:'', cinematic:'', photoreal:'', cctv:''}); setCopiedBox(''); }} 
                         className="absolute right-3 top-3 bg-red-600/10 p-1.5 rounded-lg group hover:bg-red-600 transition-all"
                         title="Clear input"
                       >
                         <X className="w-4 h-4 text-red-500 group-hover:text-white transition-all" />
                       </button>
                     )}
                   </div>

                   {/* ENHANCE DUGME */}
                   <button onClick={handleEnhance} disabled={isEnhancing || (!demoInput && !customerPrompt)} className="w-full bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
                     {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enhance"}
                   </button>
                 </div>
                 
                 {/* KORACI 2 I 3 */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-black/30 p-4 rounded-2xl border border-white/5 mt-auto">
                    <div>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-1">2. Aspect Ratio</label>
                        <div className="flex flex-wrap gap-2">
                            {['1:1', '9:16', '16:9', '21:9'].map(ar => (
                                <button 
                                  key={ar} 
                                  onClick={() => setSelectedAR(ar)} 
                                  className={`px-3.5 py-2 rounded-lg text-[9px] font-black transition-all ${selectedAR === ar ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                >
                                  {ar}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[8px] font-black uppercase text-zinc-500 tracking-widest block mb-2.5 ml-1">3. Render Quality</label>
                        <div className="flex flex-wrap gap-2">
                            {['1x', '2x', '4x'].map(q => (
                                <button 
                                  key={q} 
                                  onClick={() => setSelectedQuality(q)} 
                                  className={`px-4 py-2 rounded-lg text-[9px] font-black transition-all ${selectedQuality === q ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'}`}
                                >
                                  {q}
                                </button>
                            ))}
                        </div>
                    </div>
                 </div>
               </div>
               
               {/* KOLONA 2: OUTPUT (DINAMIČKI 1 VELIKI ILI 4 MANJA BOKSA) */}
               <div className="flex-1 w-full flex flex-col h-full relative">
                 <label className="text-[8px] font-black uppercase text-blue-500 tracking-widest block mb-2.5 ml-2">4. V8 Engine Output</label>
                 
                 {/* SCENARIO 1: CUSTOMER PROMPT (JEDAN VELIKI BOX) */}
                 {customerPrompt.length > 0 || (!demoInput && !customerPrompt) ? (
                     <div className="w-full bg-black border border-white/5 rounded-2xl p-6 pb-16 relative flex flex-col items-start shadow-inner h-full min-h-[250px]">
                       {generatedPrompts.single && (
                           <div className="text-green-500 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-4 border-b border-green-500/20 pb-3 w-full text-left flex items-center gap-2">
                               <Sparkles className="w-4 h-4 animate-pulse" /> Premium Matrix Output
                           </div>
                       )}
                       <p className={`w-full transition-all duration-500 font-mono text-[10px] md:text-[11px] leading-relaxed text-left ${generatedPrompts.single ? 'text-zinc-200 opacity-100' : 'text-zinc-600 opacity-50 flex-1 flex items-center justify-center italic tracking-widest'}`}>
                         {generatedPrompts.single ? <TypewriterText text={generatedPrompts.single} speed={10} /> : "AWAITING CORE INPUT..."}
                       </p>
                       
                       {generatedPrompts.single && (
                         <button 
                            onClick={() => handleCopy(generatedPrompts.single, 'single')} 
                            className={`absolute bottom-4 right-4 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${copiedBox === 'single' ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.4)]' : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'}`}
                         >
                           {copiedBox === 'single' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                           {copiedBox === 'single' ? "Copied! ✓" : "Copy Prompt"}
                         </button>
                       )}
                     </div>
                 ) : (
                     /* SCENARIO 2: CONCEPT INPUT (4 MANJA BOXA U 2x2 GRID-u) */
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
                        
                        {/* BOX 1: ABSTRACT */}
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-purple-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                             <Sparkles className="w-3.5 h-3.5" /> Abstract Form
                           </label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.abstract ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
                             {generatedPrompts.abstract ? <TypewriterText text={generatedPrompts.abstract} speed={10} /> : "AWAITING..."}
                           </p>
                           {generatedPrompts.abstract && (
                             <button onClick={() => handleCopy(generatedPrompts.abstract, 'abstract')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'abstract' ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                               {copiedBox === 'abstract' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'abstract' ? "Copied" : "Copy"}
                             </button>
                           )}
                        </div>

                        {/* BOX 2: CINEMATIC */}
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-orange-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                             <Video className="w-3.5 h-3.5" /> Cinematic Form
                           </label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cinematic ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
                             {generatedPrompts.cinematic ? <TypewriterText text={generatedPrompts.cinematic} speed={10} /> : "AWAITING..."}
                           </p>
                           {generatedPrompts.cinematic && (
                             <button onClick={() => handleCopy(generatedPrompts.cinematic, 'cinematic')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'cinematic' ? 'bg-orange-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                               {copiedBox === 'cinematic' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'cinematic' ? "Copied" : "Copy"}
                             </button>
                           )}
                        </div>

                        {/* BOX 3: PHOTOREALISTIC */}
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                             <Camera className="w-3.5 h-3.5" /> Photoreal Form
                           </label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.photoreal ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
                             {generatedPrompts.photoreal ? <TypewriterText text={generatedPrompts.photoreal} speed={10} /> : "AWAITING..."}
                           </p>
                           {generatedPrompts.photoreal && (
                             <button onClick={() => handleCopy(generatedPrompts.photoreal, 'photoreal')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'photoreal' ? 'bg-blue-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                               {copiedBox === 'photoreal' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'photoreal' ? "Copied" : "Copy"}
                             </button>
                           )}
                        </div>

                        {/* BOX 4: CCTV CAM */}
                        <div className="w-full bg-black border border-white/5 rounded-2xl p-5 pb-14 relative shadow-inner flex flex-col min-h-[160px]">
                           <label className="text-[9px] font-black uppercase text-red-500 tracking-widest mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                             <Cctv className="w-3.5 h-3.5" /> CCTV Cam Form
                           </label>
                           <p className={`w-full font-mono text-[9px] leading-relaxed text-left flex-1 ${generatedPrompts.cctv ? 'text-zinc-200' : 'text-zinc-600 italic flex items-center justify-center'}`}>
                             {generatedPrompts.cctv ? <TypewriterText text={generatedPrompts.cctv} speed={10} /> : "AWAITING..."}
                           </p>
                           {generatedPrompts.cctv && (
                             <button onClick={() => handleCopy(generatedPrompts.cctv, 'cctv')} className={`absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all ${copiedBox === 'cctv' ? 'bg-red-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
                               {copiedBox === 'cctv' ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />} {copiedBox === 'cctv' ? "Copied" : "Copy"}
                             </button>
                           )}
                        </div>

                     </div>
                 )}
               </div>

             </div>

             {/* SESIJA ISTORIJE */}
             {promptHistory.length > 0 && (
                <div className="mt-10 border-t border-white/10 pt-8 animate-fade-in">
                  <h4 className="text-[9px] font-black uppercase text-zinc-500 mb-4 tracking-widest flex items-center gap-2 ml-2">
                     <Clock className="w-3.5 h-3.5" /> Session History (Last 3)
                  </h4>
                  <div className="space-y-3">
                    {promptHistory.map((historyItem, idx) => (
                      <div key={idx} className="bg-black/50 border border-white/5 p-4 rounded-xl flex justify-between items-center group transition-all hover:border-white/10">
                        <p className="text-[9px] text-zinc-400 font-mono truncate max-w-[85%]">{historyItem}</p>
                        <button 
                          onClick={() => handleCopyHistory(historyItem, idx)} 
                          className={`p-2 rounded-lg transition-all ${copiedHistoryIndex === idx ? 'bg-green-600/20 text-green-500' : 'bg-white/5 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-white/10'}`}
                        >
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
                  <span className="text-orange-500 flex gap-0.5">
                    <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
                  </span> 
                  "{r}"
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
  const faqList = app.faq && app.faq.length > 0 ? app.faq : (data.DEFAULT_FAQ || DEFAULT_FAQ);

  const handleNextMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev + 1) % (app.media.length)); };
  const handlePrevMedia = (e) => { e.stopPropagation(); setActiveMedia((prev) => (prev - 1 + app.media.length) % app.media.length); };

  const handleLinkClick = (e, link, type) => {
    trackEvent("whop_conversion", { name: app.name, type: type });
    if(link === "#") { e.preventDefault(); alert("MATRIX ERROR: Link synchronization pending."); }
  };

  return (
    <div className="bg-[#050505] pt-10 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet>
        <title>{app.name} | AI TOOLS PRO SMART</title>
        <meta name="description" content={app.headline} />
      </Helmet>

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
                    <>
                      <video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <PlayCircle className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </>
                  ) : (
                    <img src={m.url} className="w-full h-full object-cover" onContextMenu={(e) => e.preventDefault()} draggable="false" />
                  )}
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
                
                <div className="mb-6 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5"><Zap className="w-3 h-3 animate-pulse" /> High Demand</span>
                     <span className="text-[9px] font-black text-red-400 uppercase">Only 3 left</span>
                   </div>
                   <div className="w-full bg-black rounded-full h-1.5">
                     <div className="bg-gradient-to-r from-red-600 to-orange-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                   </div>
                </div>

                <div className="space-y-2.5 mb-6 text-left font-black text-left">
                  <div className="group p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-left">
                    <div className="text-[9px] text-zinc-500 uppercase tracking-widest text-left">Monthly</div>
                    <div className="text-lg md:text-xl text-white tracking-tighter text-left">${app.price || '0'}</div>
                  </div>
                  <div className="relative group p-3 rounded-xl bg-orange-500/[0.03] border border-orange-500/20 flex items-center justify-between mt-4 text-left">
                    <div className="absolute -top-2 left-4 bg-orange-600 text-white text-[6px] font-black px-2 py-0.5 rounded-full uppercase text-left">Ultimate Deal</div>
                    <div className="text-[9px] text-orange-500/70 uppercase tracking-widest text-left">Lifetime</div>
                    <div className="text-lg md:text-xl text-white tracking-tighter text-left">${app.priceLifetime || 'TBD'}</div>
                  </div>
                </div>
                <div className="space-y-4 text-left">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-blue-500 rounded-xl blur opacity-30 animate-pulse pointer-events-none"></div>
                    <a href={mainWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, mainWhopLink, "MAIN")} className="relative w-full py-3.5 rounded-xl flex items-center justify-center bg-blue-600 text-white font-black text-[9px] uppercase tracking-[0.3em] hover:bg-blue-500 shadow-xl transition-all hover:scale-[1.02]">
                      Unlock Access Now
                    </a>
                  </div>
                  
                  <div className="mt-4 flex flex-col items-center gap-2 border-t border-white/5 pt-5 pb-2">
                     <div className="flex items-center gap-1.5 text-zinc-500">
                       <Lock className="w-3 h-3" />
                       <span className="text-[8px] font-black uppercase tracking-widest">256-bit Secure Checkout</span>
                     </div>
                     <div className="flex gap-2 opacity-50 grayscale mt-1">
                       <span className="bg-white/10 px-2 py-1 rounded text-[7px] font-black uppercase">Stripe</span>
                       <span className="bg-white/10 px-2 py-1 rounded text-[7px] font-black uppercase">PayPal</span>
                       <span className="bg-white/10 px-2 py-1 rounded text-[7px] font-black uppercase">Crypto</span>
                     </div>
                  </div>

                  <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-4 text-center text-left">
                    <div className="flex flex-col items-center gap-3 text-left">
                      <div className="flex items-center gap-2 text-left"><Award className="w-3.5 h-3.5 text-orange-500" /><span className="text-white font-black text-[8px] md:text-[9px] uppercase tracking-[0.4em]">Developer Pack</span></div>
                      <a href={sourceCodeWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, sourceCodeWhopLink, "SOURCE")} className="w-full py-3.5 rounded-xl flex items-center justify-center border-2 border-blue-500/30 bg-blue-500/5 text-blue-400 font-black text-[8px] uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all group shadow-xl">
                        <FileCode className="w-3.5 h-3.5" /> Source Code <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-black">Total Access</span>
          <span className="text-xl font-black text-white">${app.price}</span>
        </div>
        <a href={mainWhopLink} target="_blank" rel="noreferrer" onClick={(e) => handleLinkClick(e, mainWhopLink, "MAIN")} className="px-8 py-3.5 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-[pulse_2s_infinite]">
          Unlock Now
        </a>
      </div>
    </div>
  );
}

function IntelligenceDashboard() {
  const [stats, setStats] = useState({ 
    totalViews: 0, uniqueVisitors: 0, whopClicks: 0, videoInteractions: 0, 
    avgSessionTime: "0m", topAssets: [], topVideos: [], events: [], whopBreakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const q = query(collection(db, "site_stats"), orderBy("timestamp", "desc"), limit(400));
        const snapshot = await getDocs(q);
        const allEvents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const sessions = {};
        allEvents.forEach(e => {
            if(!e.sessionId || !e.localTime) return;
            if(!sessions[e.sessionId]) sessions[e.sessionId] = { start: e.localTime, end: e.localTime, actions: 1 };
            else {
                if(e.localTime < sessions[e.sessionId].start) sessions[e.sessionId].start = e.localTime;
                if(e.localTime > sessions[e.sessionId].end) sessions[e.sessionId].end = e.localTime;
                sessions[e.sessionId].actions += 1;
            }
        });

        let totalTime = 0; let validSessions = 0;
        Object.values(sessions).forEach(s => {
            const duration = s.end - s.start;
            if(duration > 0 && duration < 3600000) { totalTime += duration; validSessions++; }
        });
        const avgMs = validSessions > 0 ? (totalTime / validSessions) : 0;
        const avgMins = Math.floor(avgMs / 60000);
        const avgSecs = Math.floor((avgMs % 60000) / 1000);

        const assetCounts = {}; const videoCounts = {};
        allEvents.forEach(e => {
            if(e.action === "asset_click" || e.action === "asset_view") {
                assetCounts[e.name] = (assetCounts[e.name] || 0) + 1;
            }
            if(e.action === "tutorial_external_open" || e.action === "tutorial_play" || e.action === "product_video_watch") {
                const vName = e.title || e.name || "Main Matrix Feed";
                videoCounts[vName] = (videoCounts[vName] || 0) + 1;
            }
        });

        const sortedAssets = Object.entries(assetCounts).sort((a,b) => b[1] - a[1]).slice(0, 3);
        const sortedVideos = Object.entries(videoCounts).sort((a,b) => b[1] - a[1]).slice(0, 3);

        const whopMap = {};
        allEvents.forEach(e => {
           if (e.action === "whop_click" || e.action === "whop_conversion") {
              const productName = e.name || "Unknown Asset";
              const clickType = e.type || "MAIN"; 
              if (!whopMap[productName]) whopMap[productName] = { name: productName, main: 0, source: 0 };
              if (clickType === "SOURCE") whopMap[productName].source += 1;
              else whopMap[productName].main += 1;
           }
        });
        const sortedWhopBreakdown = Object.values(whopMap).sort((a,b) => (b.main + b.source) - (a.main + a.source));

        setStats({ 
            totalViews: allEvents.filter(e => e.action === "page_view").length, 
            uniqueVisitors: Object.keys(sessions).length,
            whopClicks: allEvents.filter(e => e.action === "whop_click" || e.action === "whop_conversion").length, 
            videoInteractions: allEvents.filter(e => e.action.includes("video") || e.action.includes("tutorial") || e.action.includes("preview")).length,
            avgSessionTime: `${avgMins}m ${avgSecs}s`,
            topAssets: sortedAssets,
            topVideos: sortedVideos,
            whopBreakdown: sortedWhopBreakdown,
            events: allEvents.slice(0, 50) 
        });
        setLoading(false);
      } catch (e) { console.error(e); }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">Učitavanje statistike...</div>;

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/30 transition-all group text-left">
          <div className="flex items-center gap-3 mb-3 text-left"><Eye className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Ukupno pregleda sajta</span></div>
          <div className="text-2xl md:text-3xl font-black text-white text-left">{stats.totalViews}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-green-500/30 transition-all group text-left">
          <div className="flex items-center gap-3 mb-3 text-left"><Users className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Jedinstvenih Posetilaca</span></div>
          <div className="text-2xl md:text-3xl font-black text-white text-left">{stats.uniqueVisitors}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-purple-500/30 transition-all group text-left">
          <div className="flex items-center gap-3 mb-3 text-left"><Clock className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Prosečno Zadržavanje</span></div>
          <div className="text-2xl md:text-3xl font-black text-white text-left">{stats.avgSessionTime}</div>
        </div>
        <div className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] hover:border-orange-500/30 transition-all group shadow-[0_0_20px_rgba(249,115,22,0.02)] text-left">
          <div className="flex items-center gap-3 mb-3 text-left"><MousePointerClick className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" /><span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Klikovi na Kupovinu</span></div>
          <div className="text-2xl md:text-3xl font-black text-orange-500 text-left">{stats.whopClicks}</div>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-6 shadow-[0_0_30px_rgba(249,115,22,0.03)] text-left">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4 text-left">
          <ShoppingCart className="w-4 h-4 text-orange-500" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Statistika Klikova po Proizvodima</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar text-left">
          <table className="w-full text-left">
            <thead className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="pb-3 pl-4 text-left">Naziv Proizvoda</th>
                <th className="pb-3 text-center">Klik na Glavni Alat</th>
                <th className="pb-3 text-center">Klik na Source Code</th>
                <th className="pb-3 text-right pr-4">Ukupno Klikova</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-left">
              {stats.whopBreakdown.map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-4 text-[9px] font-bold text-white uppercase truncate max-w-[200px]">{item.name}</td>
                  <td className="py-3 text-center text-[10px] font-black text-blue-500">{item.main}</td>
                  <td className="py-3 text-center text-[10px] font-black text-orange-500">{item.source}</td>
                  <td className="py-3 text-right pr-4 text-[10px] font-black text-white">{item.main + item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminPage({ apps = [], refreshData }) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [videoToHide, setVideoToHide] = useState('');
  const [tab, setTab] = useState('intelligence');
  const [editingId, setEditingId] = useState(null);
  const [isUploading, setIsUploading] = useState(false); 
  const [openAdminFaq, setOpenAdminFaq] = useState(null); 
  
  const defaultDescriptionTemplate = `[DESCRIPTION]\nEnter your main description here...\n\nKEY FEATURES\n* Feature 1\n* Feature 2\n* Feature 3\n\nVALUE MULTIPLIER\n* Benefit 1\n* Benefit 2`;

  const initialForm = { name: '', headline: '', type: 'AI ASSET', price: '', priceLifetime: '', description: defaultDescriptionTemplate, media: [], whopLink: '', reactSourceCode: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 

  const sortedApps = [...apps].reverse();

  const handleLogin = async (e) => { 
    e.preventDefault(); 
    if(password === "Goran123") {
        setIsAuthenticated(true); 
    } else {
        alert("ACCESS DENIED"); 
    }
  }; 

  const handleEditClick = (app) => { 
    let loadedFaq = (app.faq || []).map(item => ({ q: item.question || item.q || '', a: item.answer || item.a || '' })); 
    if (loadedFaq.length < 7) loadedFaq = [...loadedFaq, ...Array.from({ length: 7 - loadedFaq.length }, () => ({ q: '', a: '' }))]; 
    const dbWhopField = app.whopLink || ""; 
    const parts = dbWhopField.includes("[SPLIT]") ? dbWhopField.split("[SPLIT]") : [dbWhopField, ""];
    setFormData({ name: app.name || '', headline: app.headline || '', type: app.type || 'AI ASSET', price: app.price || '', priceLifetime: app.priceLifetime || '', description: app.description || '', media: Array.isArray(app.media) ? [...app.media] : [], whopLink: parts[0], reactSourceCode: parts[1], faq: loadedFaq }); 
    setEditingId(app.id); setOpenAdminFaq(null); window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); 
    const combinedWhopField = `${formData.whopLink || ''}[SPLIT]${formData.reactSourceCode || ''}`; 
    const payload = { id: editingId || String(Date.now()), name: formData.name || "", type: formData.type || "AI ASSET", headline: formData.headline || "", description: formData.description || "", price: formData.price || "", priceLifetime: formData.priceLifetime || "", whopLink: combinedWhopField, media: formData.media || [], faq: formData.faq.filter(f => f.q && f.a).map(f => ({question: f.q, answer: f.a})) }; 
    try { 
      const res = await fetch(editingId ? `${API_URL}/${editingId}` : API_URL, { 
        method: editingId ? 'PUT' : 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      }); 
      if (res.ok) { setFormData(initialForm); setEditingId(null); refreshData(); alert('PROTOCOL SAVED.'); } 
      else { alert("Neuspelo! Proveri vezu."); }
    } catch (err) { alert("Network Error"); } 
  }; 

  const handleFileUpload = async (e) => { 
    const file = e.target.files[0]; if (!file) return; setIsUploading(true); 
    const upData = new FormData(); upData.append('file', file); upData.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET || 'uploads1'); 
    try { 
      const res = await fetch(`https://api.cloudinary.com/v1_1/drllxycnh/auto/upload`, { method: 'POST', body: upData }); 
      const result = await res.json(); 
      if (result.secure_url) { 
        setFormData(prev => ({ ...prev, media: [...(prev.media || []), { url: result.secure_url, type: result.resource_type === 'video' ? 'video' : 'image' }] })); 
      } else alert("Error: " + (result.error?.message || "Check preset settings"));
    } catch (err) { alert("Upload error."); } finally { setIsUploading(false); } 
  }; 

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-sans px-6 text-white text-center relative overflow-hidden"> 
      <Helmet><title>Admin Terminal | AI TOOLS PRO SMART</title></Helmet>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div> 
      <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-12 rounded-[3rem] text-center w-full max-w-md relative z-10 animate-fade-in group shadow-2xl" style={{ border: '0.1px solid #f97316' }}> 
        <div className="relative inline-flex items-center justify-center mb-8"> 
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-pulse"></div> 
          <div className="bg-black/50 p-5 rounded-full border border-white/5 relative z-10 shadow-inner"><Fingerprint className="w-12 h-12 text-orange-500" /></div> 
        </div> 
        <h2 className="text-white font-black uppercase mb-2 tracking-[0.5em] text-xs">Admin Terminal</h2> 
        <p className="text-red-500 text-[10px] uppercase tracking-[0.2em] mb-10 font-black">Identity Verification Required</p> 
        <form onSubmit={handleLogin} className="space-y-6"> 
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="ENTER CORE KEY" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-orange-500/40 text-center text-[11px] tracking-[0.6em] transition-all" /> 
          <button type="submit" className="w-full rounded-2xl bg-orange-600 px-6 py-4 transition-all hover:bg-orange-500 shadow-xl"><span className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Authorize Access</span></button> 
        </form> 
      </div> 
    </div> 
  );

  return (
    <div className="pt-10 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white">
      <div className="flex gap-4 mb-10 overflow-hidden">
        <button onClick={() => setTab('intelligence')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'intelligence' ? 'bg-orange-600 text-white shadow-xl' : 'bg-white/5 text-zinc-500'}`}>Intelligence</button>
        <button onClick={() => setTab('system')} className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase transition-all ${tab === 'system' ? 'bg-blue-600 text-white shadow-xl' : 'bg-white/5 text-zinc-500'}`}>System Registry</button>
      </div>

      {tab === 'intelligence' ? <IntelligenceDashboard /> : (
        <div className="animate-fade-in space-y-8">
           <div className="bg-[#0a0a0a] border border-orange-500/20 p-6 rounded-[2.5rem] mb-8 flex items-center gap-6 shadow-xl">
             <Youtube className="w-5 h-5 text-orange-500 shrink-0" />
             <form onSubmit={async (e) => { e.preventDefault(); await fetch(`${HIDDEN_VIDEOS_API_URL}/${videoToHide}`, {method:'POST'}); setVideoToHide(''); alert('Hidden'); }} className="flex-1 flex gap-3">
               <input type="text" value={videoToHide} onChange={e => setVideoToHide(e.target.value)} placeholder="GHOST VIDEO ID..." className="bg-black border border-white/10 p-3.5 rounded-xl text-white text-[10px] flex-1 outline-none font-mono" />
               <button className="bg-orange-600 px-6 py-3.5 rounded-xl text-white font-black text-[9px] uppercase shadow-lg">Kill Feed</button>
             </form>
           </div>

           <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Asset Name</label><input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" required /></div>
                  <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ribbon Text (Type)</label><input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Npr. HOT 🔥 ili 50% OFF" className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" /></div>
                </div>
                <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Headline Protocol</label><input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} className="bg-black border border-white/10 p-3 rounded-xl text-white text-[11px] outline-none" /></div>
                <div className="flex flex-col gap-1.5"><label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Technical Specs</label><textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-black border border-white/10 p-4 rounded-xl text-white text-[11px] h-64 resize-none outline-none" /></div>
                
                <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4">
                  <label className="text-[10px] font-black text-white uppercase tracking-widest mb-4 block">System FAQ Protocols</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.faq.map((item, index) => (
                      <div key={index} className="border border-white/5 rounded-xl bg-black overflow-hidden">
                        <button type="button" onClick={() => setOpenAdminFaq(openAdminFaq === index ? null : index)} className="w-full flex items-center justify-between p-3 text-left"><span className={`text-[9px] font-black uppercase ${item.q ? 'text-white' : 'text-zinc-600'}`}>Slot {index + 1}</span><ChevronDown className="w-4 h-4" /></button>
                        {openAdminFaq === index && (
                          <div className="p-4 bg-[#0a0a0a] border-t border-white/5 space-y-3">
                            <input value={item.q} onChange={e => { const f = [...formData.faq]; f[index].q = e.target.value; setFormData({...formData, faq: f}); }} placeholder="Question" className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[10px] outline-none" />
                            <textarea value={item.a} onChange={e => { const f = [...formData.faq]; f[index].a = e.target.value; setFormData({...formData, faq: f}); }} placeholder="Answer" className="w-full bg-black border border-white/10 p-2 rounded-lg text-white text-[10px] h-16 outline-none" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-4">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Media Manifest</label>
                    <label className="w-full bg-blue-600/10 border border-blue-500/20 py-4 rounded-xl cursor-pointer flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"><Loader2 className={`animate-spin text-blue-500 w-4 h-4 ${isUploading ? 'block' : 'hidden'}`} /><UploadCloud className={`w-4 h-4 ${isUploading ? 'hidden' : 'block'}`} /><span className="text-[10px] font-black uppercase">Upload PC File</span><input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} /></label>
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {formData.media?.map((m, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden aspect-video border border-white/10">
                          {m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i) ? (<><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-4 h-4 text-orange-500" /></div></>) : <img src={m.url} className="w-full h-full object-cover" alt="" />}
                          <button type="button" onClick={() => setFormData(p => ({...p, media: p.media.filter((_, idx) => idx !== i)}))} className="absolute top-1 right-1 bg-red-600 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all"><X className="w-3 h-3 text-white" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl space-y-3">
                    <div className="flex gap-2"><input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Monthly $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" /><input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime $" className="w-full bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" /></div>
                    <input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="Asset Whop Link" className="bg-black border border-white/10 p-2.5 rounded-xl text-white text-[10px] outline-none" />
                    <input type="text" value={formData.reactSourceCode} onChange={e => setFormData({...formData, reactSourceCode: e.target.value})} placeholder="React Source Link" className="bg-black border border-orange-500/30 p-2.5 rounded-xl text-white text-[10px] outline-none" />
                  </div>
                </div>
                <button type="submit" className={`w-full py-5 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-xl ${editingId ? 'bg-blue-600' : 'bg-orange-600'}`}>{editingId ? 'Save Changes' : 'Execute Deploy'}</button>
                {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }} className="w-full py-2 text-[9px] font-black uppercase text-zinc-500">Cancel Edit</button>}
             </form>

             <div className="mt-12 space-y-3">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/5"><Database className="w-4 h-4 text-zinc-500" /><h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Core Registry</h3></div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedApps.map(app => (
                    <div key={app.id} className={`flex items-center justify-between p-3 border rounded-xl ${editingId === app.id ? 'bg-orange-600/10 border-orange-500/30' : 'bg-black border-white/5'}`}>
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                          {app.media?.[0]?.type === 'video' ? <video src={`${app.media[0].url}#t=0.001`} className="w-full h-full object-cover" /> : <img src={data.getMediaThumbnail(app.media?.[0]?.url)} className="w-full h-full object-cover" alt="" />}
                        </div>
                        <h4 className="text-white font-black uppercase text-[9px] truncate">{app.name}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(app)} className="p-2 bg-white/5 rounded-lg hover:bg-blue-600"><Edit className="w-3.5 h-3.5" /></button>
                        <button onClick={async () => { if(window.confirm('Delete?')) { await fetch(`${API_URL}/${app.id}`, {method: 'DELETE'}); refreshData(); } }} className="p-2 bg-white/5 rounded-lg hover:bg-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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

// --- MAIN WRAPPER COMPONENT ---
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const [secretFound, setSecretFound] = useState(false);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [visitors, setVisitors] = useState(42);
  const location = useLocation();

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  useEffect(() => { trackEvent("page_view", { path: location.pathname + location.hash }); }, [location]);

  useEffect(() => {
    let keystrokes = '';
    const handleKeyDown = (e) => {
      if(e.key.length === 1) { 
          keystrokes += e.key.toUpperCase();
          if (keystrokes.length > 10) keystrokes = keystrokes.slice(-10);
          if (keystrokes.includes('MATRIX') || keystrokes.includes('NEO')) {
            setIsShaking(true);
            setTimeout(() => {
                setSecretFound(true);
                setIsShaking(false);
            }, 800);
            keystrokes = '';
          }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 10 && !sessionStorage.getItem('exitIntentShown')) {
        setShowExitIntent(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const [statusIdx, setStatusIdx] = useState(0);

  useEffect(() => {
    const STATUSES = data.STATUSES || ["MATRIX: ONLINE", "V8 ENGINE: OPTIMAL", "SECURE CONNECTION"];
    const t1 = setInterval(() => setStatusIdx(prev => (prev + 1) % STATUSES.length), 3500);
    const t2 = setInterval(() => {
      setVisitors(prev => {
        let newVal = prev + (Math.floor(Math.random() * 5) - 2);
        if (newVal < 35) newVal = 35;
        if (newVal > 85) newVal = 85;
        return newVal;
      });
    }, 4500);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className={`min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans text-left relative pb-20 lg:pb-0 ${isShaking ? 'animate-shake' : ''}`}>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll { animation: scroll 35s linear infinite; }
      `}</style>

      {isBooting && <FullScreenBoot onComplete={handleBootComplete} />}

      {/* FIKSNI HEADER */}
      <div className="fixed top-0 left-0 w-full z-[1000]">
        <UrgencyBar />
        <nav className="w-full px-6 md:px-10 py-3 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-4 md:gap-6 group">
                <img src={data.logoUrl} className="h-9 md:h-12 object-contain transition-transform group-hover:scale-105 animate-pulse" alt="logo" />
                <span className="text-[9px] font-black uppercase tracking-[0.4em] hidden sm:block"><span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span></span>
              </Link>
              
              <div className="hidden lg:flex items-center gap-4 border border-white/5 bg-white/[0.02] px-4 py-1.5 rounded-full ml-4">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                   <span className="text-[7px] text-green-500 font-black uppercase tracking-widest w-24 text-left">{data.STATUSES?.[statusIdx] || "ONLINE"}</span>
                </div>
                <div className="flex items-center gap-2">
                   <Users className="w-3 h-3 text-blue-500" />
                   <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">{visitors} Agents Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-10 font-black uppercase text-[9px] md:text-[10px] tracking-widest">
              <a href="#enhancer" className="text-zinc-400 hover:text-white transition-all hidden sm:block">10x Enhancer</a>
              <Link to="/#marketplace" className="bg-blue-600 px-4 md:px-6 py-2 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">Marketplace</Link>
              <Link to="/admin" className="bg-orange-600 px-4 md:px-6 py-2 rounded-full text-white shadow-xl hover:bg-orange-500 transition-all">Admin</Link>
            </div>
          </div>
        </nav>
      </div>

      {secretFound && (
          <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-[#050505] border border-green-500 p-8 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.2)] max-w-md w-full text-center relative overflow-hidden">
                <button onClick={() => setSecretFound(false)} className="absolute top-4 right-4 text-green-500 hover:text-white z-10"><X className="w-5 h-5"/></button>
                <Sparkles className="w-12 h-12 text-green-500 mx-auto mb-4 animate-pulse relative z-10" />
                <h2 className="text-2xl font-black text-green-500 uppercase tracking-tighter mb-2 relative z-10">Anomaly Detected</h2>
                <p className="text-[11px] text-zinc-300 mb-6 leading-relaxed relative z-10">You have found the hidden protocol. The Architect rewards your curiosity.</p>
                
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl mb-6 relative z-10">
                   <span className="block text-[8px] text-green-400 uppercase tracking-widest mb-1">Your Secret Discount Code:</span>
                   <span className="text-xl font-black text-white tracking-[0.2em] font-mono select-all">GLITCH20</span>
                </div>

                <button onClick={() => setSecretFound(false)} className="relative z-10 w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">Acknowledge</button>
             </div>
          </div>
      )}

      {showExitIntent && (
          <div className="fixed inset-0 z-[6000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
             <div className="bg-[#0a0a0a] border border-red-500/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.2)] max-w-md w-full text-center relative">
                <button onClick={() => setShowExitIntent(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="w-5 h-5"/></button>
                <div className="mx-auto w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6">
                   <span className="text-red-500 font-black text-2xl animate-pulse">!</span>
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Wait. Don't Disconnect.</h2>
                <p className="text-[11px] text-zinc-400 mb-8 leading-relaxed">The Matrix is vast. If you leave now, you might never find this node again. Secure your Developer Pack before the anomaly closes.</p>
                <div className="space-y-3">
                   <button onClick={() => setShowExitIntent(false)} className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl">Stay in the Matrix</button>
                   <button onClick={() => setShowExitIntent(false)} className="w-full bg-transparent text-zinc-600 hover:text-white py-3 font-black text-[8px] uppercase tracking-widest transition-all">Disconnect</button>
                </div>
             </div>
          </div>
      )}

      {/* MATRIX SECURITY BADGE */}
      <div className="fixed bottom-6 right-6 z-[200] group">
         <div className="bg-blue-600/20 backdrop-blur-md p-3 rounded-full border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse cursor-help">
            <Shield className="text-blue-500 w-5 h-5" />
         </div>
         <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-all pointer-events-none w-48">
            <div className="bg-[#0a0a0a] border border-blue-500/30 p-3 rounded-xl shadow-2xl">
               <p className="text-[8px] font-black text-white uppercase tracking-widest mb-1">Matrix Secure Hub</p>
               <p className="text-[7px] text-zinc-400 leading-tight uppercase">Encrypted Data Transfer Active. Secure Stripe Gateway Connection.</p>
            </div>
         </div>
      </div>
      
      {/* PADDING TOP ZBOG FIKSNOG HEADERA */}
      <div className="flex-1 pt-28">
        <Routes>
          <Route path="/" element={<HomePage apps={appsData} />} />
          <Route path="/app/:id" element={<SingleProductPage apps={appsData} />} />
          <Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} />
        </Routes>
      </div>

      {/* NOVI OPTIMIZOVANI FOOTER SA DRUSTVENIM MREZAMA */}
      <div className="w-full bg-[#050505] border-t border-white/5 pt-10 pb-6 flex flex-col items-center justify-center relative z-20">
        
        <div className="flex items-center gap-6 mb-6">
          <a href="#" className="text-white hover:scale-110 hover:opacity-80 transition-all">
            <data.TwitterIcon />
          </a>
          <a href="#" className="text-[#FF0000] hover:scale-110 hover:opacity-80 transition-all">
            <data.YouTubeIcon />
          </a>
          <a href="#" className="hover:scale-110 hover:opacity-80 transition-all">
            <data.InstagramIcon />
          </a>
          <a href="#" className="text-white hover:scale-110 hover:opacity-80 transition-all" style={{ filter: "drop-shadow(1.5px 1.5px 0px #fe0979) drop-shadow(-1.5px -1.5px 0px #00f2fe)" }}>
            <data.TikTokIcon />
          </a>
        </div>

      </div>

      <footer className="text-center text-zinc-600 font-bold italic uppercase text-[9px] tracking-[0.5em]">
        © 2026 <span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span> - ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

export default function App() { 
  const [appsData, setAppsData] = useState([]);
  
  const refreshData = useCallback(() => { 
      fetch(API_URL).then(res => res.json()).then(db => setAppsData(db)).catch(() => setAppsData([])); 
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  return ( 
    <HelmetProvider><Router><AppContent appsData={appsData} refreshData={refreshData} /><LiveSalesNotification apps={appsData} /></Router></HelmetProvider>
  ); 
}