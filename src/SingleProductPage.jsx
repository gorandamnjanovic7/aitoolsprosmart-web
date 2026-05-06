import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ChevronLeft, Maximize, ChevronRight, HelpCircle, ChevronDown, 
  Loader2, CheckCircle, Zap, Award, X, PlayCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FIREBASE
import { db, auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// DATA & GLOBAL
import * as data from './data';
import { v8Toast } from './App'; 
import mojBaner from './moj-baner.png'; 

const getRibbonStyle = (index) => {
  if (index === 0) return "bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.7)]";
  const colors = ["bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]", "bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]", "bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.5)]"];
  return colors[Math.max(0, index - 1) % colors.length];
};

// V8 UNIVERZALNI SMART PARSER ZA SVE PROIZVODE
const renderV8Description = (text) => {
  if (!text) return <p className="text-zinc-500 italic">No description available.</p>;
  
  // V8 HACK: Forsiramo nove redove za ključne elemente, u slučaju da ih Gem zalepi!
  let formattedText = text
    .replace(/🔥/g, '\n🔥')
    .replace(/WHY CHOOSE THIS\?/g, '\nWHY CHOOSE THIS?')
    .replace(/\(THE ROI FINALE\)/g, '(THE ROI FINALE)\n')
    .replace(/THE ARSENAL:/g, '\nTHE ARSENAL:\n')
    .replace(/WEAPONIZED FEATURES FOR DOMINATION/g, '\nWEAPONIZED FEATURES FOR DOMINATION\n'); 
  
  const lines = formattedText.split('\n');
  
  let isWhiteBoldBlock = false;

  return lines.map((line, index) => {
    const trimmed = line.trim();
    
    // Prazan red resetuje blokove
    if (!trimmed) {
        isWhiteBoldBlock = false;
        return <div key={index} className="h-5"></div>; 
    }

    // 1. DETEKCIJA GLAVNIH NASLOVA (Sve velika slova, duže od 3 slova)
    const isHeading = trimmed === trimmed.toUpperCase() && trimmed.length > 3 && !trimmed.startsWith('🔥') && !trimmed.startsWith('[');
    
    if (isHeading || trimmed.includes('[DESCRIPTION]')) {
        isWhiteBoldBlock = false; 
        return (
          <h3 key={index} className="text-white font-black uppercase tracking-widest text-[18px] md:text-[22px] mt-10 mb-5 border-l-[4px] border-[#FF8C00] pl-4 bg-gradient-to-r from-[#FF8C00]/10 to-transparent py-2">
            {trimmed.replace('[DESCRIPTION]', 'DESCRIPTION').replace(':', '')}
          </h3>
        );
    }

    // 2. DETEKCIJA NARANDŽASTOG REDA (SAMO prva linija sa vatricom)
    if (trimmed.startsWith('🔥')) {
        isWhiteBoldBlock = true; // Sledeći redovi do praznog reda biće beli i boldirani
        return (
          <p key={index} className="text-[#FF8C00] font-black text-[15px] md:text-[18px] leading-relaxed mb-4 mt-8 drop-shadow-[0_0_10px_rgba(255,140,0,0.3)] uppercase tracking-wide">
            {trimmed}
          </p>
        );
    }

    // 3. PODEBLJAVANJE KLJUČNIH REČI SA DVOTAČKOM (npr. "Beginners:")
    if (trimmed.includes(':') && trimmed.split(':')[0].length < 40 && !trimmed.startsWith('http') && !isWhiteBoldBlock) {
        const parts = trimmed.split(':');
        const boldPart = parts[0];
        const rest = parts.slice(1).join(':');
        return (
            <p key={index} className="text-zinc-300 text-[14px] md:text-[16px] leading-relaxed mb-4">
                <strong className="text-white font-black tracking-wide">{boldPart}:</strong>{rest}
            </p>
        );
    }

    // 4. BELI BOLD BLOK (Tekst ispod vatrice)
    if (isWhiteBoldBlock) {
        return (
          <p key={index} className="text-white font-bold text-[14px] md:text-[16px] leading-relaxed mb-4">
            {trimmed}
          </p>
        );
    }

    // 5. STANDARDNI TEKST (Sve ostalo)
    return (
      <p key={index} className="text-zinc-300 text-[14px] md:text-[16px] leading-relaxed mb-4">
        {trimmed}
      </p>
    );
  });
};

export default function SingleProductPage({ apps = [] }) {
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
        const email = user.email ? user.email.toLowerCase() : "";
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") { 
          setHasAccess(true); 
        } else {
          try {
            const docRef = doc(db, "vip_users", email);
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
        const email = user.email ? user.email.toLowerCase() : "";
        await setDoc(doc(db, "posetioci", user.uid), { ime: user.displayName, email: user.email, vremePrijave: serverTimestamp(), zainteresovanZa: tip, identitet: "V8-Client-Global" }, { merge: true });
        
        const docRef = doc(db, "vip_users", email);
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
               <div className="v8-smart-description">
                  {renderV8Description(app.description)}
               </div>

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
                  <div className="absolute top-0 right-0 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl z-10 shadow-lg">DIGITAL PRODUCT 🌐</div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-6 mt-2 flex items-center justify-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span> Secure Digital Checkout</p>
                  <div className="flex flex-col gap-3">
                    <button onClick={() => handlePaymentGlobal('Standard License', cenaMesecno)} className="w-full py-4 rounded-xl flex items-center justify-between px-5 bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white font-black text-[12px] uppercase tracking-widest transition-all"><span className="flex items-center gap-2"><Zap className="w-4 h-4 text-orange-500" /> Standard License</span><span className="text-orange-400">${cenaMesecno}</span></button>
                    <button onClick={() => handlePaymentGlobal('Master License', cenaLifetime)} className="w-full py-4 rounded-xl flex items-center justify-between px-5 bg-gradient-to-r from-orange-600/20 to-amber-600/20 border border-orange-500/40 hover:from-orange-600 hover:to-amber-600 text-white font-black text-[12px] uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_25px_rgba(234,88,12,0.6)]"><span className="flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" /> Master License</span><span className="text-white drop-shadow-md">${cenaLifetime}</span></button>
                  </div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-widest mt-6 text-center leading-relaxed font-bold px-2">After payment verification, the system will automatically unlock your instant digital download access here.</p>
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