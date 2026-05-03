import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  PlayCircle, Sparkles, Youtube, ChevronLeft, Award, ArrowRight, Maximize, Edit, Loader2, ShieldAlert, Trash2, UploadCloud,
  MousePointerClick, Briefcase, X, ChevronRight, Clock, Users, Zap, Image as ImageIcon, HelpCircle, ChevronDown, ChevronUp, BarChart, Layers, Settings, Lock, LogOut, User, Timer, CheckCircle, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FIREBASE
import { db, auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment, collection, addDoc, serverTimestamp, query, orderBy, getDocs, deleteDoc } from 'firebase/firestore';

// DATA & COMPONENTS
import * as data from './data';
import { MatrixRain, TutorialCard, FormattedDescription } from './data';
import mojBaner from './moj-baner.png'; 
import './App.css'; 

// EXTERNAL PAGES
import V8Enhancer10x from './V8Enhancer10x';
import V8Promo10xPage from './V8Promo10xPage'; 
import V8ContactWidget from './V8ContactWidget';
import V8StockBerza from './V8StockBerza';
import V8Showroom from './V8Showroom'; 

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
  if (window.location.hash) { window.history.replaceState(null, '', window.location.pathname); }
  window.scrollTo(0, 0);
}

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:5000" 
  : "https://goranov-sajt-engleski-backend-production.up.railway.app"; 

const YOUTUBE_API_KEY = "AIzaSyCwy46TsBPW7LxKTjExhQbHhYhq8lyc2YM"; 
const MOJA_IP = "213.196.99.10"; 

let globalUserIp = "";
const currentSessionId = Math.random().toString(36).substring(2, 15);

const fetchUserIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const d = await res.json(); globalUserIp = d.ip;
  } catch (err) {}
};
fetchUserIp();

export const logAnalyticsEvent = async (type, details) => {
  if (globalUserIp === MOJA_IP || globalUserIp === "") return; 
  try { await addDoc(collection(db, "analytics"), { type, ...details, timestamp: Date.now(), sessionId: currentSessionId }); } catch (err) {}
};

export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};

// POČETAK: V8 Radar Kursor
const V8RadarCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      // Ako pređe preko dugmeta, linka, ili slike koja može da se klikne
      if (e.target.closest('button, a, summary, .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border-2 border-[#FF8C00] rounded-full pointer-events-none z-[100000] flex items-center justify-center shadow-[0_0_15px_rgba(255,140,0,0.5)]"
      animate={{
        x: mousePosition.x - 16, // Centriranje (pola od 32px)
        y: mousePosition.y - 16,
        scale: isHovering ? 1.8 : 1,
        backgroundColor: isHovering ? 'rgba(255, 140, 0, 0.15)' : 'transparent',
      }}
      transition={{ type: 'tween', ease: 'backOut', duration: 0.1 }}
    >
      {/* Mala tačkica u sredini radara */}
      <div className={`w-1 h-1 bg-[#FF8C00] rounded-full transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`} />
    </motion.div>
  );
};
// KRAJ: V8 Radar Kursor

const V8ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return v8Toast.subscribe((t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${t.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : 'bg-red-900/40 border-red-500/50 text-red-100'}`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 43);
  useEffect(() => {
    const interval = setInterval(() => { setTimeLeft(prev => (prev > 0 ? prev - 1 : 24 * 3600)); }, 1000);
    return () => clearInterval(interval);
  }, []);
  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="inline-flex items-center justify-center gap-3 bg-orange-600/10 border border-orange-500/30 px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.2)] mt-4">
      <Timer className="w-5 h-5 text-orange-500 animate-pulse" />
      <div className="flex flex-col text-left">
        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">OFFER EXPIRES IN:</span>
        <span className="text-[16px] font-mono font-black text-white tracking-widest">{h}:{m}:{s}</span>
      </div>
    </div>
  );
};

const FullScreenBoot = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 800); return 100; }
        return p + Math.floor(Math.random() * 5) + 1; 
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  const radius = 60; const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center mb-8">
        <svg className="w-56 h-56 transform -rotate-90 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <circle cx="70" cy="70" r={radius} fill="transparent" stroke="#ea580c" strokeWidth="3" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-300 ease-out" />
        </svg>
        <img src={data.logoUrl} alt="Logo" className={`absolute w-16 h-16 object-contain transition-all duration-1000 ${progress >= 100 ? 'scale-125 drop-shadow-[0_0_30px_rgba(234,88,12,1)]' : 'animate-pulse'}`} />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="text-orange-600 font-black uppercase tracking-[0.6em] text-[13px] drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]">V8 System Booting</div>
        <div className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" /><span>ESTABLISHING CONNECTION</span>
          <span className="text-orange-500 font-black min-w-[30px]">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

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
  const handlePlay = (e) => { e.preventDefault(); e.stopPropagation(); setIsPlaying(true); if (videoRef.current) { videoRef.current.muted = false; videoRef.current.currentTime = 0; videoRef.current.play(); } };
  
  return (
    <motion.div onMouseMove={(e) => {}} onMouseLeave={() => {}} className="group relative rounded-[2.5rem] p-[2px] bg-gradient-to-br from-orange-500 to-blue-600 hover:shadow-[0_0_25px_rgba(249,115,22,0.5)] flex flex-col h-full z-10 hover:z-20 transition-transform duration-300 hover:scale-[1.02]">
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

const SmartScrollButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => { 
    const checkScroll = () => setIsScrolled(window.scrollY > 400); 
    window.addEventListener('scroll', checkScroll); 
    return () => window.removeEventListener('scroll', checkScroll); 
  }, []);
  const handleAction = () => { window.scrollTo({ top: isScrolled ? 0 : document.body.scrollHeight, behavior: 'smooth' }); };
  return (
    <button onClick={handleAction} className="fixed bottom-10 right-6 z-[5000] flex flex-col items-center group transition-all duration-500">
      <div className={`w-1.5 rounded-full transition-all duration-700 flex items-center justify-center ${isScrolled ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] h-16' : 'bg-white/20 h-10 hover:bg-white/40'}`}>
        <div className={`transition-transform duration-700 text-white ${isScrolled ? 'rotate-0' : 'rotate-180'}`}><ChevronUp size={14} strokeWidth={4} /></div>
      </div>
    </button>
  );
};

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
  const trackVisitor = async () => {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") return; 
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        const docRef = doc(db, 'v8_stats', 'visitors');
        const docSnap = await getDoc(docRef);
        let currentCount = 0;

        if (docSnap.exists()) { currentCount = docSnap.data().count; } 
        else { await setDoc(docRef, { count: 0 }); }

        const hasCounted = sessionStorage.getItem('v8_counted');

        if (userIP !== MOJA_IP && !hasCounted) {
            await updateDoc(docRef, { count: increment(1) });
            setVisitorCount(currentCount + 1);
            sessionStorage.setItem('v8_counted', 'true');
        } else {
            setVisitorCount(currentCount);
        }
      } catch (error) {}
  };
    trackVisitor();
  }, []);

  if (visitorCount === 0) return null; 

  return (
    <div className="fixed bottom-6 right-20 md:right-28 z-[4900] bg-[#0a0a0a]/90 backdrop-blur-md border border-orange-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.2)] flex items-center gap-2 font-sans transition-all hover:border-orange-500">
      <Users className="w-4 h-4 text-orange-500" />
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
        VISITS: <span className="text-white text-[11px]">{visitorCount.toLocaleString('en-US')}</span>
      </span>
    </div>
  );
};
// --- SINGLE PRODUCT PAGE ---
function SingleProductPage({ apps = [] }) {
  const { id } = useParams(); 
  const app = apps.find(a => a.id === id); 
  const [activeMedia, setActiveMedia] = useState(0); 
  const [fullScreenImage, setFullScreenImage] = useState(null); 
  const [wireModalData, setWireModalData] = useState(null); 
  const [hasAccess, setHasAccess] = useState(false); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const navigate = useNavigate(); 
  const mainVideoRef = useRef(null);
  
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  useEffect(() => {
    if (!app) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "damnjanovicgoran7@gmail.com") { setHasAccess(true); } 
        else {
          try {
            const docRef = doc(db, "vip_users", user.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps) {
              const unlocked = docSnap.data().unlockedApps;
              setHasAccess(unlocked.includes(app.id) || unlocked.includes('FULL_ACCESS'));
            } else { setHasAccess(false); }
          } catch(e) { setHasAccess(false); }
        }
      } else { setHasAccess(false); }
      setIsCheckingAccess(false);
    });
    return () => unsubscribe();
  }, [app]);
  
  if (!app) return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 uppercase text-[10px] tracking-widest">Loading...</div>;
  
  const currentMedia = app.media?.[activeMedia] || { url: data.bannerUrl, type: 'image' }; 
  const isVideo = currentMedia?.type === 'video' || currentMedia?.url?.match(/\.(mp4|webm|ogg|mov)$/i); 
  const parts = (app.whopLink || "").split("[SPLIT]");
  const mainLink = parts[0] || ""; 
  const ribbonClass = getRibbonStyle([...apps].sort((a, b) => Number(b.id) - Number(a.id)).findIndex(a => a.id === id));

  const cenaMesecno = app.price ? parseFloat(app.price) : 15;
  const cenaLifetime = app.priceLifetime ? parseFloat(app.priceLifetime) : 89;
  
  const handlePaymentGlobal = async (tip, cena) => {
    if (auth.currentUser) {
      try { await setDoc(doc(db, "posetioci", auth.currentUser.uid), { poslednjiKlik: serverTimestamp(), zainteresovanZa: tip }, { merge: true }); } catch (err) {}
      setWireModalData({ tip, cena });
    } else {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        await setDoc(doc(db, "posetioci", user.uid), { ime: user.displayName, email: user.email, vremePrijave: serverTimestamp(), zainteresovanZa: tip, identitet: "V8-Client-Global" }, { merge: true });
        
        const docRef = doc(db, "vip_users", user.email.toLowerCase());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes(app.id) || docSnap.data().unlockedApps.includes('FULL_ACCESS'))) {
            setHasAccess(true); v8Toast.success("Welcome back! Access is already unlocked.");
        } else { setWireModalData({ tip, cena }); }
      } catch (error) { v8Toast.error("Login error!"); }
    }
  };
  
  return (
    <div className="bg-[#050505] pt-32 pb-32 px-6 font-sans text-white text-left relative">
      <Helmet><title>{app.name} | AI TOOLS PRO SMART</title></Helmet>
      <AnimatePresence>
        {fullScreenImage && (
          <div className="fixed inset-0 z-[6000] bg-black/95 flex items-center justify-center p-4" onClick={() => setFullScreenImage(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}>
              <button className="absolute top-6 right-6 text-white bg-black/50 hover:bg-red-600 rounded-full p-3 transition-all z-[6010]"><X className="w-8 h-8" /></button>
              <img src={fullScreenImage} className="max-w-full max-h-full object-contain" alt="Enlarged" onClick={(e) => e.stopPropagation()} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate('/')} className="text-zinc-400 hover:text-white flex items-center gap-2 mb-10 uppercase text-[10px] font-black tracking-widest transition-all"><ChevronLeft className="w-4 h-4" /> Go Back</button>
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="w-full lg:w-[65%]">
            {app.type && <div className={`mb-6 px-6 py-2.5 rounded-full inline-block text-white text-[13px] font-black uppercase tracking-[0.2em] shadow-xl ${ribbonClass}`}>{app.type}</div>}
            <div className="relative mb-6 aspect-video rounded-[2.5rem] overflow-hidden border-2 border-blue-500 bg-black shadow-2xl group">
              {!isVideo ? <><img src={currentMedia.url} onClick={() => setFullScreenImage(currentMedia.url)} className="w-full h-full object-cover cursor-pointer" alt="" /><button onClick={(e) => { e.stopPropagation(); setFullScreenImage(currentMedia.url); }} className="absolute top-6 right-6 p-3 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 hover:bg-blue-600"><Maximize className="w-5 h-5 text-white" /></button></> : <video ref={mainVideoRef} src={currentMedia.url} className="w-full h-full object-cover" controls controlsList="nodownload" autoPlay muted loop playsInline />}
              {app.media?.length > 1 && <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-20"><button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia - 1 + app.media.length) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" /></button><button onClick={(e) => {e.stopPropagation(); setActiveMedia((activeMedia + 1) % app.media.length);}} className="p-3 text-white pointer-events-auto opacity-0 group-hover:opacity-100 hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" /></button></div>}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar scroll-smooth">{app.media?.map((m, idx) => <button type="button" key={idx} onClick={() => setActiveMedia(idx)} className={`relative w-28 h-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeMedia === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-50 hover:opacity-100'}`}>{(m.type === 'video' || m.url?.match(/\.(mp4|webm|ogg|mov)$/i)) ? <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" controlsList="nodownload" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-6 h-6 text-white" /></div></> : <img src={m.url} className="w-full h-full object-cover" />}</button>)}</div>
            <h1 className="text-[24px] md:text-[28px] font-black uppercase tracking-tighter mt-8 mb-4 border-l-[5px] border-orange-500 pl-5 italic leading-tight">{app.name}</h1>
            <div className="flex mb-6"><div className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-xl">{app.category || 'AI ASSET'}</div></div>
            {app.headline && <p className="text-[18px] md:text-[22px] text-white font-black mb-10 border-l-[5px] border-orange-500 pl-5 italic leading-relaxed">{app.headline}</p>}
            <div className="border-t border-white/5 pt-10 mb-12">
               <FormattedDescription text={app.description} />
               <div className="mt-14 border-t border-white/5 pt-12">
                 <details className="group">
                   <summary className="w-full flex items-center justify-between text-left cursor-pointer outline-none list-none [&::-webkit-details-marker]:hidden"><h3 className="text-[20px] md:text-[24px] font-black text-white uppercase tracking-widest border-l-[5px] border-orange-500 pl-5 italic flex items-center gap-4 transition-colors group-hover:text-orange-500 m-0"><HelpCircle className="w-6 h-6 text-orange-500" /> FREQUENTLY ASKED QUESTIONS</h3><ChevronDown className="w-8 h-8 text-zinc-500 group-hover:text-orange-500 transition-transform duration-300 group-open:rotate-180" /></summary>
                   {app.faq && app.faq.length > 0 && app.faq.some(f => f.q && f.a) && <div className="mt-10 space-y-4">{app.faq.filter(f => f.q && f.a).map((item, idx) => (<details key={idx} className="group/faq bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-inner text-left transition-all"><summary className="w-full p-6 flex justify-between items-center text-left hover:bg-white/[0.04] outline-none cursor-pointer list-none [&::-webkit-details-marker]:hidden"><h4 className="font-bold text-[15px] md:text-[18px] uppercase tracking-wider flex items-center gap-3 transition-colors duration-300 text-zinc-300 group-open/faq:text-orange-500">Q: {item.q}</h4><ChevronDown className="w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-300 group-open/faq:rotate-180" /></summary><div className="p-6 pt-0 text-white font-bold text-[15px] md:text-[18px] leading-relaxed border-t border-white/5 mt-2 pt-5 tracking-wide">A: {item.a}</div></details>))}</div>}
                 </details>
               </div>
            </div>
          </div>

          <div className="w-full lg:w-[35%] lg:sticky lg:top-40">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <img src={mojBaner} alt="Banner" className="w-full h-40 object-cover rounded-2xl mb-8 border border-white/5" />
              
              {isCheckingAccess ? (
                 <div className="py-10 flex justify-center"><Loader2 className="w-8 h-8 text-orange-500 animate-spin" /></div>
              ) : hasAccess ? (
                <div className="bg-[#050505] border border-green-500/50 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.15)] text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10 shadow-lg">PREMIUM ACCOUNT</div>
                  <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4 animate-bounce" />
                  <h3 className="text-xl font-black uppercase tracking-widest text-white mb-1">Access Granted</h3>
                  <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-8">Welcome to your VIP Vault</p>
                  <div className="flex flex-col gap-4">
                    {mainLink ? (
                      <a href={data.formatExternalLink(mainLink)} target="_blank" rel="noreferrer" className="w-full py-5 rounded-xl flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-black text-[13px] uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        🚀 OPEN APPLICATION
                      </a>
                    ) : (<div className="text-zinc-500 text-[10px] uppercase font-bold p-3 border border-white/5 rounded-xl">App link is not configured</div>)}
                  </div>
                </div>
              ) : (
                <div className="bg-[#050505] border border-orange-500/40 p-5 rounded-2xl shadow-[0_0_20px_rgba(234,88,12,0.1)] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10 shadow-lg">GLOBAL 🌐</div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 mt-2 flex items-center justify-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span> Secure Payment</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handlePaymentGlobal('Monthly', cenaMesecno)} className="w-full py-4 rounded-xl flex items-center justify-between px-5 bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white font-black text-[12px] uppercase tracking-widest transition-all"><span className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> Monthly</span><span className="text-orange-400">${cenaMesecno}</span></button>
                    <button onClick={() => handlePaymentGlobal('Lifetime', cenaLifetime)} className="w-full py-4 rounded-xl flex items-center justify-between px-5 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/40 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[12px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)]"><span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Lifetime</span><span className="text-white drop-shadow-md">${cenaLifetime}</span></button>
                  </div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-6 text-center leading-relaxed font-bold px-2">After wire payment, the system will automatically unlock your access button here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

     <AnimatePresence>
        {wireModalData && (
          <div className="fixed inset-0 z-[7000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden">
              <button onClick={() => setWireModalData(null)} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
              <div className="p-10 flex flex-col items-center">
                <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-orange-500 flex items-center gap-3"><Zap className="w-5 h-5" /> Wire Instructions</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6">Package: {wireModalData.tip}</p>
                
                <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
                  <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Recipient:</span><span className="font-bold text-white text-right">Goran Damnjanović</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Email Contact:</span><span className="font-bold text-white text-[11px] md:text-[13px]">aitoolsprosmart@gmail.com</span></div>
                  <div className="flex justify-between pt-2"><span className="text-zinc-500 uppercase">Amount:</span><span className="font-black text-orange-500 text-[18px] drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]">${wireModalData.cena}</span></div>
                </div>
                
                <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-5 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)]">
                  <p className="text-[11px] md:text-[12px] text-zinc-400 font-black uppercase tracking-widest mb-4">Please contact us to arrange payment:</p>
                  <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400 py-3 rounded-xl font-black text-[12px] md:text-[14px] tracking-widest transition-all cursor-pointer shadow-inner">
                    📧 aitoolsprosmart@gmail.com
                  </a>
                  <span className="block mt-5 text-[10px] text-zinc-500 uppercase font-black tracking-widest">System unlocks access immediately upon verification! 🚀</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- TREZOR PAGE ---
function TrezorPage({ apps = [] }) {
  const [unlockedApps, setUnlockedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "damnjanovicgoran7@gmail.com") { setUnlockedApps(['FULL_ACCESS']); } 
        else {
          try {
            const docRef = doc(db, "vip_users", user.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps) { setUnlockedApps(docSnap.data().unlockedApps); } 
            else { setUnlockedApps([]); }
          } catch(e) { setUnlockedApps([]); }
        }
      } else { navigate('/'); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  const hasFullAccess = unlockedApps.includes('FULL_ACCESS');
  const myApps = hasFullAccess ? apps : apps.filter(app => unlockedApps.includes(app.id));

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white min-h-screen">
      <Helmet><title>MY VAULT | AI TOOLS PRO SMART</title></Helmet>
      <div className="flex items-center gap-4 mb-10 border-b border-orange-500/20 pb-6"><Lock className="w-8 h-8 text-orange-500" /><h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white">VIP VAULT</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myApps.map((app) => {
             const isVideo = app.media?.[0]?.type === 'video' || app.media?.[0]?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
             const displayUrl = app.media?.[0]?.url || data.bannerUrl;
             const parts = (app.whopLink || "").split("[SPLIT]");
             const mainLink = parts[0] || "";
             return (
               <div key={app.id} className="bg-[#0a0a0a] border border-orange-500/30 rounded-[2rem] p-5 flex flex-col hover:border-orange-500/60 transition-all group shadow-xl">
                 <Link to={`/app/${app.id}`} className="aspect-video relative rounded-xl overflow-hidden mb-4 bg-black block border border-white/5">
                    {isVideo ? <video src={`${displayUrl}#t=0.001`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" muted playsInline controlsList="nodownload" /> : <img src={displayUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={app.name} />}
                 </Link>
                 <h3 className="text-[16px] font-black uppercase text-white mb-2 line-clamp-1">{app.name}</h3>
                 <p className="text-zinc-500 text-[10px] uppercase font-bold mb-6 flex-1 line-clamp-2">{app.headline}</p>
                 {mainLink ? <a href={data.formatExternalLink(mainLink)} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-center font-black text-[11px] uppercase tracking-widest hover:scale-105 block shadow-[0_0_15px_rgba(34,197,94,0.3)]">🚀 OPEN APPLICATION</a> : <Link to={`/app/${app.id}`} className="w-full py-3.5 bg-zinc-800 text-white rounded-xl text-center font-black text-[11px] uppercase tracking-widest hover:scale-105 block">VIEW DETAILS</Link>}
               </div>
             );
          })}
      </div>
    </div>
  );
}

// --- HOME PAGE (ENGLISH VERSION) ---
function HomePage({ apps = [] }) {
  const [activeSlide, setActiveSlide] = useState(0); 
  const [liveVideos, setLiveVideos] = useState([]); 
  const [isLoadingVideos, setIsLoadingVideos] = useState(true); 
  const location = useLocation();
  const sortedApps = [...apps].sort((a, b) => Number(b.id) - Number(a.id));
  
  const [hasEnhancerAccess, setHasEnhancerAccess] = useState(false);

  useEffect(() => {
    const fetchYouTubeVideos = async () => {
      try {
        const channelId = "UC6ilBUks_oFMSD8CE9qD6lQ"; 
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=8&order=date&type=video&key=${YOUTUBE_API_KEY}`;
        const response = await fetch(url);
        const ytData = await response.json();
        
        if (ytData.items && ytData.items.length > 0) {
          const praviVidei = ytData.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url
          }));
          setLiveVideos(praviVidei);
        } else { throw new Error("Empty YouTube Response"); }
      } catch (error) {
        setLiveVideos([
          { id: "v8-1", title: "V8 Premium Education 1", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-2", title: "V8 Intel Protocol 2", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-3", title: "V8 Trade Secrets 3", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" },
          { id: "v8-4", title: "V8 Masterclass 4", url: "https://www.youtube.com/watch?v=M7lc1UVf-VE", thumbnail: "https://img.youtube.com/vi/M7lc1UVf-VE/maxresdefault.jpg" }
        ]);
      } finally { setIsLoadingVideos(false); }
    };
    fetchYouTubeVideos();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === "damnjanovicgoran7@gmail.com") { setHasEnhancerAccess(true); } 
        else {
          try {
            const docRef = doc(db, "vip_users", user.email.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes('FULL_ACCESS') || docSnap.data().unlockedApps.includes('10X_ENHANCER'))) { setHasEnhancerAccess(true); } 
            else { setHasEnhancerAccess(false); }
          } catch(e) { setHasEnhancerAccess(false); }
        }
      } else { setHasEnhancerAccess(false); }
    });
    return () => unsubscribe();
  }, []);

  const handlePaymentV8 = async () => { v8Toast.error("Please log in first or contact us to proceed with payment."); };
  
  useEffect(() => { if (location.hash === '#marketplace') { const el = document.getElementById('marketplace'); if (el) el.scrollIntoView({ behavior: 'smooth' }); } }, [location]);
  const nextSlide = useCallback(() => setActiveSlide(s => (s + 1) % (data.BANNER_DATA?.length || 1)), []);
  const prevSlide = () => setActiveSlide(s => (s - 1 + (data.BANNER_DATA?.length || 1)) % (data.BANNER_DATA?.length || 1));
  useEffect(() => { const t = setInterval(nextSlide, 7000); return () => clearInterval(t); }, [nextSlide]);
  
  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | GLOBAL</title></Helmet>
      
      <div id="home-banner" className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white border-b border-orange-500/20">
        <div className="absolute inset-0 z-0 bg-black">{(data.BANNER_DATA || []).map((item, idx) => (<div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'} z-0`}><img src={item.image} loading={idx === 0 ? "eager" : "lazy"} className="w-full h-full object-cover opacity-80" alt="banner" /></div>))}</div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        <div className="absolute inset-0 z-20 w-full h-full pointer-events-none opacity-40"><MatrixRain /></div>
        <button type="button" onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
        <button type="button" onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">{(data.BANNER_DATA || []).map((_, i) => <button key={i} type="button" onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />)}</div>
        <div className="relative z-40 max-w-7xl mx-auto px-6 pb-20 w-full text-left">
          <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest shadow-lg">{data.BANNER_DATA?.[activeSlide]?.badge}</div>
          <h1 className="text-xl md:text-4xl font-black uppercase mb-1.5 tracking-tighter drop-shadow-2xl">{data.BANNER_DATA?.[activeSlide]?.title}</h1>
          <p className="text-zinc-300 text-[12px] md:text-sm max-w-lg font-medium opacity-90">{data.BANNER_DATA?.[activeSlide]?.subtitle}</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 text-left">
        <div id="protocols" className="flex items-center gap-4 mb-10"><div className="flex items-center gap-2.5 shrink-0"><Youtube className="text-red-600 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic">LATEST INTEL PROTOCOLS</h3></div><div className="h-[1px] w-32 bg-gradient-to-r from-red-600/80 to-transparent"></div></div>
        {isLoadingVideos ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">{[...Array(4)].map((_, i) => <div className="animate-pulse bg-[#0a0a0a] rounded-[2.4rem] p-6 h-48" key={i} />)}</div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">{liveVideos.map((vid, i) => <TutorialCard key={i} vid={vid} />)}</div>}
        
        {/* --- 10X ENHANCER --- */}
        <div id="enhancer" className="mb-24 flex flex-col items-center justify-center text-center py-20 border-t border-orange-500/30 scroll-mt-32">
          <div className="bg-orange-600/10 p-4 rounded-full mb-6"><Zap className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" strokeWidth={1.5} /></div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-orange-600 mb-4 drop-shadow-[0_0_15px_rgba(234,88,12,0.4)]">10X PROMPT ENHANCER</h2>
          <div className="text-[13px] md:text-[15px] font-black text-green-500 uppercase tracking-[0.2em] mb-4">Premium 3-in-1 tool worth $200/month. ONLY $199.99 LIFETIME.</div>
          <CountdownTimer />
          <p className="text-zinc-400 text-[10px] md:text-[12px] max-w-2xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-10 mb-10 mx-auto px-4">
            <span className="font-black text-white">ACCESS THE PREMIUM AI PROMPT ENGINEERING SYSTEM. CONVERT SIMPLE IDEAS OR AN IMAGE INTO MASTERPIECES.</span><br /><br />
            <span className="text-orange-500 font-black uppercase">ENTER YOUR PROMPT; WE WILL ANALYZE IT IN DETAIL AND ENHANCE IT TO BE 10X BETTER.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full px-6 relative z-10">
            {hasEnhancerAccess ? (
              <Link to="/enxance" className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-12 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer">🚀 LAUNCH ENGINE</Link>
            ) : (
              <>
                <button type="button" onClick={() => handlePaymentV8()} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"><Zap className="w-5 h-5 fill-white" /> BUY NOW ($199.99)</button>
                <Link to="/promo" className="bg-transparent border border-orange-500/50 text-orange-500 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"><PlayCircle className="w-5 h-5" /> SEE DEMO</Link>
              </>
            )}
          </div>
        </div>

        {/* --- NOVA SEKCIJA: V8 STOCK BUNDLES --- */}
        <div id="stock-bundles" className="mb-24 flex flex-col items-center justify-center text-center py-20 border-t border-blue-500/30 relative overflow-hidden scroll-mt-32">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none"></div>
            <div className="bg-blue-600/10 p-4 rounded-full mb-6 relative z-10"><ImageIcon className="w-12 h-12 text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]" strokeWidth={1.5} /></div>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-blue-500 mb-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.4)] relative z-10">PREMIUM STOCK BUNDLES</h2>
            <div className="text-[13px] md:text-[15px] font-black text-white uppercase tracking-[0.2em] mb-4 relative z-10">Unmatched Optical Authority. For Visionary Brands.</div>
            <p className="text-zinc-400 text-[10px] md:text-[12px] max-w-2xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-6 mb-12 mx-auto px-4 relative z-10">
              <span className="font-black text-white">SKIP THE STOCK SITES AND GET 100% ROYALTY-FREE PREMIUM AI ASSETS DIRECTLY FROM THE SOURCE.</span><br /><br />
              <span className="text-blue-400 font-black uppercase">LUXURY REAL ESTATE, GOURMET FOOD, AND TECH GADGET BUNDLES READY FOR YOUR COMMERCIAL CAMPAIGNS.</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-6 relative z-10 max-w-6xl mx-auto">
                {/* Bundle 1: Real Estate */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-blue-500/50 transition-all group shadow-2xl flex flex-col items-start text-left">
                    <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                        <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" alt="Real Estate" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">50 ASSETS</div>
                    </div>
                    <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Luxury Real Estate</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Penthouses, Modern Villas, Interiors</p>
                    <div className="mt-auto w-full flex items-center justify-between">
                        <span className="text-2xl font-black text-white">$49</span>
                        <Link to="/stock" className="px-6 py-3 bg-white/5 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-blue-500">VIEW BUNDLE</Link>
                    </div>
                </div>

                {/* Bundle 2: Gourmet Food */}
                <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-[2rem] p-5 hover:border-orange-500 transition-all group shadow-[0_0_30px_rgba(234,88,12,0.1)] flex flex-col items-start text-left relative transform md:-translate-y-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl z-20 shadow-lg">BEST SELLER</div>
                    <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5 mt-2">
                        <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80" alt="Gourmet" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">40 ASSETS</div>
                    </div>
                    <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">Premium Gourmet</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Steaks, Luxury Desserts, Plating</p>
                    <div className="mt-auto w-full flex items-center justify-between">
                        <span className="text-2xl font-black text-orange-400 drop-shadow-[0_0_10px_rgba(234,88,12,0.5)]">$39</span>
                        <Link to="/stock" className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_15px_rgba(234,88,12,0.4)] hover:scale-105">VIEW BUNDLE</Link>
                    </div>
                </div>

                {/* Bundle 3: Tech Gadgets */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-5 hover:border-blue-500/50 transition-all group shadow-2xl flex flex-col items-start text-left">
                    <div className="w-full aspect-video rounded-xl bg-black mb-4 overflow-hidden relative border border-white/5">
                        <img src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80" alt="Tech Gadgets" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">50 ASSETS</div>
                    </div>
                    <h3 className="text-[16px] font-black uppercase text-white tracking-widest mb-2">V8 Tech & Gadgets</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-6">Microphones, VR, Smart Devices</p>
                    <div className="mt-auto w-full flex items-center justify-between">
                        <span className="text-2xl font-black text-white">$49</span>
                        <Link to="/stock" className="px-6 py-3 bg-white/5 hover:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10 hover:border-blue-500">VIEW BUNDLE</Link>
                    </div>
                </div>
            </div>

            <div className="mt-14 relative z-10">
                <Link to="/stock" className="inline-flex items-center gap-3 text-zinc-400 hover:text-white text-[12px] font-black uppercase tracking-widest transition-all group">
                    EXPLORE ALL STOCK BUNDLES <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform text-blue-500" />
                </Link>
            </div>
        </div>

        {/* --- PREMIUM AI ASSETS STORE (Marketplace) --- */}
        <div id="marketplace" className="flex items-center gap-4 mb-6 text-left border-t border-orange-500/30 pt-20">
          <div className="flex items-center gap-2.5 shrink-0"><Sparkles className="text-blue-500 w-6 h-6" /><h3 className="text-white font-black uppercase text-[20px] tracking-widest italic text-left">PREMIUM AI ASSETS STORE</h3></div>
          <div className="h-[1px] w-32 bg-gradient-to-r from-blue-500/80 to-transparent"></div>
        </div>
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-blue-900/10 border border-blue-500/30 rounded-2xl p-5 mb-10 shadow-[0_0_15px_rgba(37,99,235,0.1)] flex items-start gap-4">
          <HelpCircle className="w-6 h-6 text-blue-500 shrink-0 mt-1 animate-pulse" />
          <p className="text-[11px] md:text-[13px] text-zinc-300 font-medium uppercase tracking-[0.1em] leading-relaxed text-left"><span className="text-blue-400 font-black">IMPORTANT NOTE:</span> All products in the Premium AI Assets Store are designed to generate prompts <span className="text-white font-bold">exclusively in English</span> for the best possible results.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-10"> 
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
      </div> 
    </>
  );
}
// --- ADMIN PAGE ---
const AdminPage = ({ apps = [], refreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [authChecking, setAuthChecking] = useState(true); 
  const [adminTab, setAdminTab] = useState('assets'); 
  const [isUploading, setIsUploading] = useState(false); 

  const [editingId, setEditingId] = useState(null); 
  const initialForm = { id: '', name: '', category: 'AI ASSET', type: '', headline: '', price: '', priceLifetime: '', description: '', media: [], whopLink: '', reactSourceCode: '', gumroadLink: '', faq: Array.from({ length: 7 }, () => ({ q: '', a: '' })) }; 
  const [formData, setFormData] = useState(initialForm); 
  const sortedAppsAdmin = [...apps].sort((a, b) => Number(b.id) - Number(a.id));

  const [vipEmail, setVipEmail] = useState('');
  const [vipList, setVipList] = useState([]);
  const [selectedApps, setSelectedApps] = useState([]); 

  const [gallery, setGallery] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "damnjanovicgoran7@gmail.com") { setIsAuthenticated(true); } 
      else { setIsAuthenticated(false); }
      setAuthChecking(false); 
    });
    return () => unsub();
  }, []);

  const fetchAllFirebaseData = async () => {
    try {
      const vipSnap = await getDocs(collection(db, "vip_users"));
      setVipList(vipSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.addedAt - a.addedAt));
      const galSnap = await getDocs(collection(db, "enhancer_gallery"));
      setGallery(galSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt));
      const anSnap = await getDocs(collection(db, "analytics"));
      setAnalyticsData(anSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.timestamp - a.timestamp));
    } catch(e) {}
  };

  useEffect(() => { if (isAuthenticated) fetchAllFirebaseData(); }, [isAuthenticated]);

  const handleGoogleLogin = async (e) => { 
    e.preventDefault(); 
    try { 
      // OVO ZAKUCAVA TVOJU SESIJU DOK SE SAM NE ODJAVIŠ
      await setPersistence(auth, browserLocalPersistence); 
      
      const result = await signInWithPopup(auth, provider); 
      if (result.user.email === "damnjanovicgoran7@gmail.com") { 
        setIsAuthenticated(true); 
        v8Toast.success("Admin login successful!"); 
      } else { 
        v8Toast.error("Unauthorized access!"); 
        await signOut(auth); 
      } 
    } catch (err) { 
      v8Toast.error("Error: " + err.message); 
    } 
  };

  const handleEditClick = (app) => { 
    const parts = (app.whopLink || "").split("[SPLIT]"); 
    const loadedFaq = app.faq || []; 
    const paddedFaq = Array.from({ length: 7 }, (_, i) => loadedFaq[i] || { q: '', a: '' }); 
  setFormData({ ...app, whopLink: parts[0] || '', reactSourceCode: parts[1] || '', gumroadLink: app.gumroadLink || '', faq: paddedFaq }); 
  setEditingId(app.id); setAdminTab('assets'); window.scrollTo(0, 0); 
};

const handleSubmit = async (e) => { 
  e.preventDefault(); 
  const finalId = formData.id ? String(formData.id).trim() : (editingId || null);
  const payload = { ...formData, whopLink: `${formData.whopLink}[SPLIT]${formData.reactSourceCode}`, faq: formData.faq.filter(f => f.q && f.a), updatedAt: serverTimestamp() }; 
  if (!editingId) payload.createdAt = serverTimestamp();
  delete payload.id;

  try { 
    if (editingId) { await setDoc(doc(db, "v8_products", editingId), payload, { merge: true }); v8Toast.success("Product updated in V8 Database!"); } 
    else if (finalId) { await setDoc(doc(db, "v8_products", finalId), payload); v8Toast.success("Product added to V8 Database!"); } 
    else { await addDoc(collection(db, "v8_products"), payload); v8Toast.success("Product added to V8 Database!"); }
    setFormData(initialForm); setEditingId(null); refreshData(); 
  } catch (err) { v8Toast.error("Database Save Error!"); } 
}; 

const handleImageUpload = async (e) => { 
  const files = Array.from(e.target.files); setIsUploading(true); 
  for (const file of files) { 
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); 
    try { 
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd }); 
      const resData = await res.json(); 
      setFormData(prev => ({ ...prev, media: [...prev.media, { url: resData.secure_url, type: file.type.startsWith('video/') ? 'video' : 'image' }] })); 
    } catch (err) {} 
  } setIsUploading(false); 
};

const handleDeleteAsset = async (appId) => {
  if(window.confirm("Permanently delete this product?")) { 
    try { await deleteDoc(doc(db, "v8_products", appId)); refreshData(); v8Toast.success("Product deleted!"); } catch(e) { v8Toast.error("Delete Error!"); }
  }
};

const handleAddVip = async (e) => {
  e.preventDefault(); 
  if(!vipEmail) return v8Toast.error("Enter client email!");
  if(selectedApps.length === 0) return v8Toast.error("Select at least one product!");
  const emailLower = vipEmail.trim().toLowerCase();
  try { 
    await setDoc(doc(db, "vip_users", emailLower), { addedAt: Date.now(), unlockedApps: selectedApps }, { merge: true }); 
    setVipEmail(''); setSelectedApps([]); fetchAllFirebaseData(); v8Toast.success(`Access Granted!`); 
  } catch(e) { v8Toast.error("Database Error!"); }
};

const handleDeleteVip = async (id) => { if(window.confirm(`Delete ${id} and revoke access?`)) { await deleteDoc(doc(db, "vip_users", id)); fetchAllFirebaseData(); v8Toast.success("User removed."); } };

const handleUploadGallery = async (e) => {
  const file = e.target.files[0]; if (!file) return; setIsUploading(true);
  const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET);
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
    const resData = await res.json();
    await addDoc(collection(db, "enhancer_gallery"), { url: resData.secure_url, createdAt: Date.now() }); fetchAllFirebaseData();
  } catch (err) {} finally { setIsUploading(false); }
};

const handleDeleteGallery = async (id) => { if(window.confirm("Delete image from Enhancer gallery?")) { await deleteDoc(doc(db, "enhancer_gallery", id)); fetchAllFirebaseData(); } };

if (authChecking) return (<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-12 h-12 text-orange-500 animate-spin" /></div>);
if (!isAuthenticated) return (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 text-center">
    <div className="bg-[#0a0a0a] p-12 rounded-[2rem] border-2 border-red-900 shadow-[0_0_30px_rgba(185,28,28,0.2)] max-w-md w-full relative group">
      <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-10 animate-pulse" />
      <button onClick={handleGoogleLogin} className="w-full rounded-2xl bg-gradient-to-r from-red-900 to-red-600 px-6 py-5 font-black uppercase text-[12px] tracking-widest text-white shadow-xl hover:shadow-[0_0_20px_rgba(185,28,28,0.3)] transition-all flex items-center justify-center gap-3"><Zap className="w-5 h-5" /> LOGIN AS ADMIN</button>
    </div>
  </div>
);

return (
  <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white relative">
    <div className="flex gap-4 mb-12 border-b border-white/5 pb-6 overflow-x-auto custom-scrollbar">
       <button type="button" onClick={() => setAdminTab('assets')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${adminTab === 'assets' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.5)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}><Award className="w-4 h-4 inline mr-2" /> Assets Manager</button>
       <button type="button" onClick={() => setAdminTab('enhancer')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${adminTab === 'enhancer' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}><Sparkles className="w-4 h-4 inline mr-2" /> Enhancer Gallery</button>
       <button type="button" onClick={() => setAdminTab('vip')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${adminTab === 'vip' ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}><Users className="w-4 h-4 inline mr-2" /> VIP Base</button>
       <button type="button" onClick={() => setAdminTab('analytics')} className={`shrink-0 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${adminTab === 'analytics' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-white/5 text-zinc-500 hover:bg-white/10 hover:text-white'}`}><BarChart className="w-4 h-4 inline mr-2" /> V8 Analytics</button>
    </div>

    {adminTab === 'assets' && (
      <div className="flex flex-col gap-12">
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
             <div className="flex items-center gap-3 mb-6"><Settings className="w-6 h-6 text-orange-500" /><h2 className="text-xl font-black text-orange-500 uppercase tracking-widest">{editingId ? 'Edit Product' : 'Add New Product'}</h2></div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input type="text" value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} placeholder="Custom ID (Optional)" className="bg-black border border-orange-500/50 p-3 rounded-xl text-[11px] text-orange-400 font-black outline-none" />
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Product Name" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] md:col-span-1" required />
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Category" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
                <input type="text" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Type" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="Standard Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /><input type="text" value={formData.priceLifetime} onChange={e => setFormData({...formData, priceLifetime: e.target.value})} placeholder="Lifetime Price ($)" className="bg-black border border-white/10 p-3 rounded-xl text-[11px]" /></div>
             <div className="grid grid-cols-1 gap-4"><input type="text" value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} placeholder="Headline" className="bg-black border border-white/10 p-3 rounded-xl text-[11px] w-full" /></div>
             <div className="grid grid-cols-1 gap-4"><input type="text" value={formData.whopLink} onChange={e => setFormData({...formData, whopLink: e.target.value})} placeholder="APP LINK" className="bg-black border border-green-500/50 p-3 rounded-xl text-[11px] outline-none" /></div>
             <div className="bg-black border border-white/10 p-4 rounded-xl">
               <label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">Media</label>
               <div className="flex flex-wrap gap-4">
                 {formData.media.map((m, i) => (
                   <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden group border border-white/10">
                     {m.type === 'video' ? ( <><video src={`${m.url}#t=0.001`} className="w-full h-full object-cover" /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-8 h-8 text-white opacity-80" /></div></>) : (<img src={m.url} className="w-full h-full object-cover" />)}
                     <button type="button" onClick={() => setFormData({...formData, media: formData.media.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110"><X className="w-3 h-3" /></button>
                   </div>
                 ))}
                 <label className="w-24 h-24 rounded-lg border-2 border-dashed border-white/20 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 text-zinc-500 bg-white/[0.02]">{isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><UploadCloud className="w-6 h-6 mb-2" /><span className="text-[8px] uppercase font-black">Upload</span></>}<input type="file" multiple accept="image/*,video/*" onChange={handleImageUpload} className="hidden" /></label>
               </div>
             </div>
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description" className="bg-black border border-white/10 p-4 rounded-xl text-[11px] h-96 w-full outline-none font-mono" />
             <div className="bg-black border border-white/10 p-4 rounded-xl"><label className="text-[10px] font-black uppercase text-zinc-500 block mb-3">FAQ</label><div className="space-y-3">{formData.faq.map((f, i) => (<div key={i} className="flex gap-2"><input type="text" value={f.q} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].q = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Question" className="flex-1 bg-black border border-white/5 p-3 rounded-lg text-[10px]" /><input type="text" value={f.a} onChange={e => { const newFaq = [...formData.faq]; newFaq[i].a = e.target.value; setFormData({...formData, faq: newFaq}); }} placeholder="Answer" className="flex-[2] bg-black border border-white/5 p-3 rounded-lg text-[10px]" /></div>))}</div></div>
             <div className="flex gap-4 pt-4 border-t border-white/10">
               <button type="submit" disabled={isUploading} className="flex-1 py-5 rounded-2xl font-black uppercase text-[12px] bg-orange-600 hover:bg-orange-500 transition-all flex justify-center items-center gap-2"><Zap className="w-4 h-4"/> {editingId ? "Update Product" : "Save New Product"}</button>
               {editingId && <button type="button" onClick={() => {setFormData(initialForm); setEditingId(null);}} className="px-8 py-5 rounded-2xl bg-zinc-800 uppercase font-black text-[12px] hover:bg-zinc-700">Cancel</button>}
             </div>
        </form>
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
           <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">V8 Database ({sortedAppsAdmin.length})</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {sortedAppsAdmin.map(app => (
                 <div key={app.id} className="p-5 bg-black border border-white/10 rounded-[1.5rem] flex flex-col gap-4 shadow-xl group hover:border-orange-500/50 transition-all">
                   <div className="aspect-video relative overflow-hidden rounded-2xl bg-zinc-900">
                     {app.media?.[0]?.type === 'video' ? ( <><video src={`${app.media[0].url}#t=0.001`} className="w-full h-full object-cover" muted /><div className="absolute inset-0 flex items-center justify-center bg-black/40"><PlayCircle className="w-10 h-10 text-white opacity-80" /></div></>) : (<img src={data.getMediaThumbnail(app.media?.[0]?.url)} className="w-full h-full object-cover" alt="" />)}
                   </div>
                   <div className="flex justify-between items-start gap-4">
                     <div><span className="text-[13px] font-black uppercase text-white line-clamp-2">{app.name}</span><span className="text-[9px] text-zinc-500 block mt-1">ID: {app.id}</span></div>
                     <div className="flex gap-2">
                       <button type="button" onClick={() => handleEditClick(app)} className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit className="w-4 h-4" /></button>
                       <button type="button" onClick={() => handleDeleteAsset(app.id)} className="p-2.5 bg-red-600/20 text-red-500 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>
                 </div>
               ))}
           </div>
        </div>
      </div>
    )}

    {adminTab === 'enhancer' && (
      <div className="bg-[#0a0a0a] border border-purple-500/30 rounded-[2.5rem] p-8 shadow-[0_0_30px_rgba(147,51,234,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div><h2 className="text-xl md:text-2xl font-black text-purple-500 uppercase tracking-widest flex items-center gap-3"><Sparkles className="w-6 h-6" /> 10X Enhancer Reference Gallery</h2></div>
          <label className="bg-gradient-to-r from-purple-700 to-indigo-600 text-white px-6 py-4 rounded-xl font-black text-[12px] cursor-pointer hover:scale-105"><UploadCloud className="w-5 h-5 inline mr-2" /> UPLOAD NEW IMAGE <input type="file" accept="image/*" onChange={handleUploadGallery} className="hidden" /></label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {gallery.map(img => (
            <div key={img.id} className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-square bg-[#050505]"><img src={img.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all group-hover:scale-105" alt="Ref" /><button type="button" onClick={() => handleDeleteGallery(img.id)} className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 hover:scale-110"><Trash2 className="w-4 h-4" /></button></div>
          ))}
        </div>
      </div>
    )}

    {adminTab === 'vip' && (
      <div className="bg-[#0a0a0a] border border-green-500/30 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
         <h2 className="text-xl font-black text-green-500 uppercase tracking-widest flex items-center gap-3"><Lock className="w-6 h-6" /> Premium VIP Base</h2>
         <form onSubmit={handleAddVip} className="space-y-6 mb-10 max-w-4xl">
           <div className="flex flex-col sm:flex-row gap-4">
             <input type="email" value={vipEmail} onChange={e => setVipEmail(e.target.value)} placeholder="Client Email" className="flex-1 bg-black border border-white/10 p-4 rounded-xl text-[13px] outline-none focus:border-green-500" required />
             <button type="submit" className="bg-green-600 text-white px-8 py-4 rounded-xl font-black text-[12px]"><Zap className="w-4 h-4 inline"/> UNLOCK ACCESS</button>
           </div>
           <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
             <label className="text-[11px] font-black text-blue-500 uppercase tracking-widest mb-3 block border-b border-white/10 pb-2">ZIP Packages / Assets:</label>
             <div className="flex flex-wrap gap-3 mb-6">
               {sortedAppsAdmin.map(app => (
                 <button type="button" key={app.id} onClick={() => setSelectedApps(prev => prev.includes(app.id) ? prev.filter(a => a !== app.id) : [...prev, app.id])} className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase transition-all border ${selectedApps.includes(app.id) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black border-white/10 text-zinc-500'}`}>{app.name}</button>
               ))}
               <button type="button" onClick={() => setSelectedApps(prev => prev.includes('FULL_ACCESS') ? prev.filter(a => a !== 'FULL_ACCESS') : [...prev, 'FULL_ACCESS'])} className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase border transition-all ${selectedApps.includes('FULL_ACCESS') ? 'bg-red-600 border-red-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-black border-white/10 text-zinc-500'}`}>FULL ACCESS (V8 MASTER KEY)</button>
             </div>
           </div>
         </form>

         <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar max-w-4xl">
           <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">Active Premium Users ({vipList.length})</h3>
           {vipList.map(vip => (
             <div key={vip.id} className="flex justify-between items-center bg-black border border-white/5 p-5 rounded-xl hover:border-green-500/30 transition-colors group">
               <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-3"><span className="text-zinc-200 font-mono text-[14px]">{vip.id}</span></div>
                 <div className="flex flex-wrap gap-2 mt-1">
                   {vip.unlockedApps && vip.unlockedApps.map(appId => {
                      if(appId === 'FULL_ACCESS') return <span key="full" className="text-[9px] bg-red-900/40 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-md uppercase font-black">V8 MASTER KEY</span>;
                      const foundApp = sortedAppsAdmin.find(a => a.id === appId);
                      const ime = foundApp ? foundApp.name : `ID: ${appId}`;
                      return <span key={appId} className="text-[9px] px-2 py-0.5 rounded-md uppercase font-black border bg-blue-900/40 text-blue-400 border-blue-500/30">{ime}</span>
                   })}
                 </div>
               </div>
               <button type="button" onClick={() => handleDeleteVip(vip.id)} className="bg-red-600/10 text-red-500 p-3 rounded-lg hover:bg-red-600 hover:text-white opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
             </div>
           ))}
         </div>
      </div>
    )}

    {adminTab === 'analytics' && (
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0a0a0a] border border-orange-500/20 p-6 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center"><Users className="w-8 h-8 text-orange-500 mb-3 opacity-80" /><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Visitors</span><span className="text-3xl font-black text-white">{new Set(analyticsData.map(s => s.sessionId)).size}</span></div>
          <div className="bg-[#0a0a0a] border border-blue-500/20 p-6 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center"><MousePointerClick className="w-8 h-8 text-blue-500 mb-3 opacity-80" /><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Clicks</span><span className="text-3xl font-black text-white">{analyticsData.filter(s => s.type === 'click').length}</span></div>
          <div className="bg-[#0a0a0a] border border-amber-500/20 p-6 rounded-[2rem] shadow-xl flex flex-col justify-center items-center text-center"><Zap className="w-8 h-8 text-amber-500 mb-3 opacity-80" /><span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Enhancer Actions</span><span className="text-3xl font-black text-white">{analyticsData.filter(s => s.type === 'enhancer_action').length}</span></div>
        </div>
      </div>
    )}
  </div>
);
};

// --- APP CONTENT COMPONENT ---
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const entryTime = useRef(Date.now());
  const [isVIPLoggedIn, setIsVIPLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [trenutnoVreme, setTrenutnoVreme] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTrenutnoVreme(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daniUSedmici = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const datumPrikaz = `${daniUSedmici[trenutnoVreme.getDay()]} , ${trenutnoVreme.getDate().toString().padStart(2, '0')}/${(trenutnoVreme.getMonth() + 1).toString().padStart(2, '0')}/${trenutnoVreme.getFullYear()}`;
  const vremePrikaz = `${trenutnoVreme.getHours().toString().padStart(2, '0')}:${trenutnoVreme.getMinutes().toString().padStart(2, '0')}:${trenutnoVreme.getSeconds().toString().padStart(2, '0')}`;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
       if(user) {
          if (user.email === "damnjanovicgoran7@gmail.com") { setIsAdmin(true); setIsVIPLoggedIn(true); }
          else { setIsAdmin(false); if((await getDoc(doc(db, "vip_users", user.email.toLowerCase()))).exists()) { setIsVIPLoggedIn(true); } else { setIsVIPLoggedIn(false); } }
       } else { setIsVIPLoggedIn(false); setIsAdmin(false); }
    }); return () => unsub();
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => { 
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') { 
        e.preventDefault(); 
      } 
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
       const timeSpent = Date.now() - entryTime.current;
       logAnalyticsEvent('time_spent', { path: prevLocation.current, durationMS: timeSpent });
       prevLocation.current = location.pathname; entryTime.current = Date.now();
       logAnalyticsEvent('page_view', { path: location.pathname });
    }
  }, [location.pathname]);

  useEffect(() => { logAnalyticsEvent('page_view', { path: location.pathname }); }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => { const target = e.target.closest('button, a'); if (target) logAnalyticsEvent('click', { elementText: target.innerText || target.getAttribute('aria-label') || 'Icon', path: window.location.pathname }); };
    document.addEventListener('click', handleGlobalClick); return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleHomeClick = (e) => { if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.replaceState(null, '', '/'); } };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative pb-20 lg:pb-0 text-left">
      <V8RadarCursor />
      <V8ToastContainer />
      <AnimatePresence>
        {isBooting && <FullScreenBoot key="boot" onComplete={() => { setIsBooting(false); window.scrollTo(0,0); }} />}
      </AnimatePresence>
      <div className="fixed top-0 left-0 w-full z-[1000]">
      <nav className="w-full px-4 md:px-8 py-4 md:py-6 bg-[#050505]/80 backdrop-blur-xl border-b border-orange-500/20 shadow-[0_10px_30px_rgba(255,140,0,0.05)] relative z-[9000]">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-2">

          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group shrink-0 mr-4">
            <img src={data.logoUrl} className="h-10 md:h-12 object-contain animate-pulse group-hover:scale-105 transition-transform" alt="logo" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-[11px] md:text-[14px] font-black uppercase tracking-[0.1em] text-blue-500 italic group-hover:text-orange-500 transition-colors">AI TOOLS</span>
              <span className="text-[11px] md:text-[14px] font-black uppercase tracking-[0.1em] text-orange-500 italic group-hover:text-blue-500 transition-colors">PRO SMART</span>
            </div>
          </Link>

          <div className="flex-1 flex items-center justify-end gap-3 font-black uppercase text-[10px] md:text-[11px] tracking-widest whitespace-nowrap">
            <Link to="/" onClick={handleHomeClick} className="hidden lg:flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-800/50 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] cursor-pointer"><Globe className="w-4 h-4 text-emerald-500" /> Home</Link>
            <Link to="/#marketplace" className="hidden lg:flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full bg-blue-900/20 border border-blue-500/30 text-blue-300 hover:text-white hover:bg-blue-800/40 hover:border-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] cursor-pointer"><Award className="w-4 h-4 text-blue-400" /> AI Store</Link>
            <Link to="/stock" className="hidden lg:flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full bg-purple-900/20 border border-purple-500/30 text-purple-300 hover:text-white hover:bg-purple-800/40 hover:border-purple-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer"><Layers className="w-4 h-4 text-purple-400" /> Stock</Link>
            <Link to="/showroom" className="hidden lg:flex items-center gap-2 px-5 py-2 md:py-2.5 rounded-full bg-amber-900/20 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-800/40 hover:border-amber-400 transition-all shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer">
   <ImageIcon className="w-4 h-4 text-amber-400" /> SHOWROOM
</Link>

            {location.pathname !== '/enxance' && (
              <Link to="/enxance" className="bg-transparent border-2 border-orange-600 text-orange-600 px-4 md:px-6 py-2 md:py-2.5 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:bg-orange-600 hover:text-white hover:shadow-[0_0_25px_rgba(234,88,12,0.6)] transition-all flex items-center gap-2 hidden sm:flex cursor-pointer"><Zap className="w-4 h-4" /> 10X ENHANCER</Link>
            )}

            {isVIPLoggedIn ? (
               <div className="flex items-center gap-2">
                  {isAdmin && (<Link to="/admin" className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] hidden md:flex"><Settings className="w-4 h-4" /> ADMIN</Link>)}
                  <Link to="/trezor" className="bg-orange-600/20 border border-orange-500/50 text-orange-400 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-[0_0_10px_rgba(234,88,12,0.2)]"><Lock className="w-4 h-4" /> VAULT</Link>
                  <button onClick={() => { signOut(auth); if(typeof v8Toast !== 'undefined') v8Toast.success("Successfully logged out."); }} className="text-zinc-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer" title="Log out"><LogOut className="w-4 h-4" /></button>
               </div>
            ) : (
<button onClick={async () => { 
  try { 
    await signInWithPopup(auth, provider); 
    v8Toast.success("Login successful!"); 
  } catch (err) { 
    console.error("Firebase Login Error:", err);
    v8Toast.error("Error: " + err.message); 
  } 
}} className="bg-zinc-800 px-5 py-2.5 rounded-full text-zinc-400 shadow-xl hover:bg-zinc-700 hover:text-white transition-all hidden sm:block border border-white/5 cursor-pointer">
  <User className="w-4 h-4 inline mr-2" /> LOGIN
</button>            )}
          </div>
        </div>
      </nav>
      </div>
      <div className="flex-1 text-left pt-20">
       <Routes>
          <Route path="/" element={<HomePage apps={appsData} />} />
          <Route path="/enxance" element={<V8Enhancer10x />} />
          <Route path="/promo" element={<V8Promo10xPage />} />
          <Route path="/app/:id" element={<SingleProductPage apps={appsData} />} />
          <Route path="/trezor" element={<TrezorPage apps={appsData} />} />
          <Route path="/admin" element={<AdminPage apps={appsData} refreshData={refreshData} />} />
          <Route path="/stock" element={<V8StockBerza />} />
          <Route path="/showroom" element={<V8Showroom />} />
        </Routes>
      </div>
      <SmartScrollButton />
      <VisitorCounter />
      <V8ContactWidget />

      <footer className="flex flex-col items-center gap-6 text-center text-zinc-100 font-black italic uppercase text-[9px] tracking-[0.5em] py-8 mt-8" style={{ borderTop: '0.5px solid #f97316' }}>
        <div className="flex items-center gap-6">
          <a href="https://x.com/AiToolsProSmart" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
          <a href="https://www.youtube.com/@SmartAiToolsPro-Smart-AI" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><Youtube size={20} className="text-[#FF0000]" /></a>
          <a href="https://www.instagram.com/aitoolsprosmart/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-4 w-4 object-contain" /></a>
          <a href="https://www.tiktok.com/@smartaitoolspro" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" className="h-4 w-4 object-contain" /></a>
        </div>
        <div className="w-full px-6 flex flex-col items-center gap-3">
           <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-zinc-400 font-mono font-black tracking-widest text-[11px] md:text-[13px]">{datumPrikaz}</div>
              <div className="text-[9px] md:text-[10px]">© 2026 <span className="text-blue-500 font-black">AI TOOLS</span> <span className="text-orange-500 font-black">PRO SMART</span> <span className="mx-1 text-white font-black">|</span> ALL RIGHTS RESERVED</div>
              <div className="text-orange-500 font-mono font-black tracking-widest flex items-center justify-center gap-2 text-[12px] md:text-[15px]"><Clock className="w-4 h-4 md:w-5 md:h-5" /> {vremePrikaz}</div>
           </div>
           <div className="text-orange-500/60 font-bold normal-case tracking-[0.2em] text-[11px] mt-2">Premium Solutions for Premium Clients.</div>
        </div>
      </footer>
    </div>
  );
}
// --- APP CONTENT COMPONENT KRAJ ---
// 🚀 V8 FIREBASE MAIN
export default function App() {
  const [appsData, setAppsData] = useState([]);

  const refreshData = useCallback(async () => {
    try {
      const q = query(collection(db, "v8_products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppsData(data);
    } catch (error) {
      setAppsData([]);
    }
  }, []);

  useEffect(() => { refreshData(); }, [refreshData]);

  return (
    <HelmetProvider>
      <Router>
        <AppContent appsData={appsData} refreshData={refreshData} />
      </Router>
    </HelmetProvider>
  );
}