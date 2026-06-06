// POČETAK FAJLA: V8Standard16MPWorkspace.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Download, ShieldCheck, RefreshCcw, Diamond, AlertTriangle, Clock, FileImage, X, DownloadCloud, Lock, CheckCircle, Info, Maximize, Archive, Layers } from 'lucide-react';
import { v8Toast } from './v8Utils';
import MagneticButton from './MagneticButton';
import navBg from './navbar-bg.webp'; 

import { db, auth } from './firebase';
import { doc, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

// --- POČETAK FUNKCIJE: RippleButton ---
const RippleButton = ({ children, onClick, disabled, className }) => {
  const [ripples, setRipples] = useState([]);
  
  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples([...ripples, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    if (onClick) onClick(e);
  };
  
  return (
    <button type="button" onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`}>
      <span className="relative z-10 flex items-center justify-center w-full h-full">{children}</span>
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute bg-white/40 rounded-full pointer-events-none z-0" style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }} onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))} />
        ))}
      </AnimatePresence>
    </button>
  );
};
// --- KRAJ FUNKCIJE: RippleButton ---

// --- POČETAK FUNKCIJE: V8Standard16MPWorkspace ---
const V8Standard16MPWorkspace = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLog, setActiveLog] = useState(0);

  const [isVIP, setIsVIP] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  const inputRef = useRef(null);

  const v8Logs = [
    "🚀 VISIONARY FACTORY V9 | IGNITING 16MP ENGINE...",
    "💎 1. 16MP upscale initiated",
    "💎 2. Blocks mixed aspect-ratio batches",
    "💎 3. Mild color + contrast enhancement",
    "💎 4. Applying highlight rolloff",
    "💎 5. PRODUCT AD POLISH active",
    "💎 6. Anti-plastic subtle film grain",
    "💎 7. 30MB–40MB JPG targeting",
    "💎 8. JPG export in progress",
    "💎 9. Compiling ZIP package with TXT report",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  // Auth & Access Provera
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email ? user.email.toLowerCase() : "";
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
          setIsVIP(true);
          setCredits(9999);
          setIsCheckingAccess(false);
        } else {
          const docRef = doc(db, "vip_users", email);
          const unsubUser = onSnapshot(docRef, (docSnap) => {
             if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes('V8_OPTIMIZER') || docSnap.data().unlockedApps.includes('FULL_ACCESS'))) { 
                setIsVIP(true); 
                setCredits(docSnap.data().optimizerCredits ?? 0); 
             } else { 
                setIsVIP(false); 
                setCredits(0);
             }
             setIsCheckingAccess(false);
          });
          return () => { unsubUser(); } 
        }
      } else { 
        setIsVIP(false); 
        setCredits(0);
        setIsCheckingAccess(false);
      }
    });

    return () => { unsubscribe(); };
  }, []);

  const clearWorkspace = (e) => {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    setFiles([]);
    setResult(null);
    setActiveLog(0);
    if(typeof v8Toast !== 'undefined') v8Toast.success("Workspace cleared. Ready for next batch.");
  };

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (credits === 0 && isVIP) {
       if(typeof v8Toast !== 'undefined') v8Toast.error("ENGINE COOLING: You have 0 credits.");
       return;
    }

    if (selectedFiles.length > credits) {
       if(typeof v8Toast !== 'undefined') v8Toast.error(`V8 QUOTA: Loading only ${credits} image(s).`);
       setFiles(selectedFiles.slice(0, credits)); 
    } else if (selectedFiles.length > 10) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("V8 PRO LIMIT: MAX 10 IMAGES PER BATCH!");
      setFiles(selectedFiles.slice(0, 10));
    } else {
      setFiles(selectedFiles);
    }
    setResult(null);
    setActiveLog(0);
  };

  const processBatch = async () => {
    if (files.length === 0) return;
    
    if (credits < files.length) {
        if(typeof v8Toast !== 'undefined') v8Toast.error(`INSUFFICIENT CREDITS! Need ${files.length}.`);
        return;
    }

    setIsProcessing(true);
    setResult(null);
    setActiveLog(0);

    const formData = new FormData();
    files.forEach((file) => {
        formData.append('images', file);
    });

    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

    try {
        const progressInterval = setInterval(() => {
            setActiveLog(prev => prev < v8Logs.length - 1 ? prev + 1 : prev);
        }, 800);

        const response = await fetch(`${BASE_BACKEND_URL}/api/v8-optimize`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
            let errorMsg = "V8 Server Error";
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorData.details || errorMsg;
            } catch (jsonErr) {
                errorMsg = "Server failed to process the request.";
            }
            throw new Error(errorMsg);
        }

        const blob = await response.blob();
        
        if (blob.type.includes('application/json')) {
            const text = await blob.text();
            const json = JSON.parse(text);
            throw new Error(json.error || "Expected ZIP format, got JSON.");
        }

        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `V8_16MP_Batch_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        setResult(url); 
        setActiveLog(v8Logs.length); 
        
        if (auth.currentUser) {
            const email = auth.currentUser.email ? auth.currentUser.email.toLowerCase() : "";
            if (email !== "damnjanovicgoran7@gmail.com" && email !== "aitoolsprosmart@gmail.com") {
                const docRef = doc(db, "vip_users", email);
                await updateDoc(docRef, {
                    optimizerCredits: increment(-files.length) 
                });
            }
        }

        if(typeof v8Toast !== 'undefined') v8Toast.success(`SUCCESS! Deducted ${files.length} credits.`);
    } catch (error) {
        console.error("Batch failure:", error);
        if(typeof v8Toast !== 'undefined') v8Toast.error(`Optimization failed: ${error.message}`);
        setActiveLog(0);
    } finally {
        setIsProcessing(false);
    }
  };

  const renderCinematicBackground = () => {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#050505]/75 z-10 mix-blend-multiply transition-opacity duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505] z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] z-10"></div>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-[1.02]">
          <source src="/v8-core.webm" type="video/webm" />
        </video>
      </div>
    );
  };

  // 🔥 INTERAKTIVNA ACCORDION LISTA (UMESTO OBIČNIH DIJAMANATA) 🔥
  const renderV8Manifest = () => {
      const specifikacije = [
        { t: "1. 16MP UPSCALE", d: "Industrial-grade precision for upscaling.", insight: "Utilizes precision LANCZOS interpolation, scaling images to a native 16MP resolution while eliminating blurriness." },
        { t: "2. BLOCKS MIXED BATCHES", d: "Format validation safety.", insight: "Scans all files instantly. If mixed aspect ratios (e.g. 16:9 and 9:16) are detected in one batch, it halts to prevent resolution errors." },
        { t: "3. MILD COLOR + CONTRAST", d: "Color enhancement matrices.", insight: "Gently boosts Luminance and Chrominance so colors pop naturally, optimized specifically for high-end advertising." },
        { t: "4. HIGHLIGHT ROLLOFF", d: "NumPy processing for details.", insight: "Applies a smooth rolloff to prevent blown-out whites, retaining intricate highlight textures (like reflections on metal or skin)." },
        { t: "5. PRODUCT AD POLISH", d: "Final high-conversion refinement.", insight: "Localized contrast adjustments ensure the viewer's eye is drawn immediately to the primary subject." },
        { t: "6. ANTI-PLASTIC REALISM", d: "Organic film grain integration.", insight: "Adds a highly controlled Gaussian Noise distribution that breaks artificial AI smoothness, creating an authentic photographic look." },
        { t: "7. 30MB–40MB JPG TARGETING", d: "Intelligent file size optimization.", insight: "Iteratively compresses the file up to 4 times to find the perfect quality-to-size ratio between 30 and 40 Megabytes." },
        { t: "8. JPG EXPORT ONLY", d: "Universal format compatibility.", insight: "Outputs only industry-standard .JPG files, ensuring immediate compatibility with all major stock platforms without re-saving." },
        { t: "9. ZIP PACKAGE WITH TXT REPORT", d: "Unified archive output.", insight: "Returns a single master ZIP file containing all processed images plus a detailed forensic text report of the applied transformations." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-16 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">BATCH PROCESSOR ENGINE</h2>
            <p className="text-[12px] md:text-[14px] text-orange-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications V9.0</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setOtvorenOpis(isOpen ? null : i)} 
                  className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                    isOpen ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? 'text-orange-400' : 'text-blue-400'}`}>
                        <span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-orange-500' : 'text-blue-600/60'}`}>💎</span> 
                        {item.t}
                      </h4>
                      <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>
                        {item.d}
                      </p>
                    </div>
                    <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? 'rotate-180 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover:text-blue-400'}`}>
                      ▼
                    </div>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 border-orange-500 pl-3">
                          <span className="text-orange-400 font-bold">Tech Insight:</span> {item.insight}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  const renderPricingPlans = () => (
    <div className="w-full max-w-5xl mx-auto mt-16 px-4">
      <div className="text-center mb-12">
        <Lock className="w-12 h-12 text-orange-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]" />
        <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">LIFETIME ACCESS. <span className="text-orange-500">CHOOSE YOUR V8 PLAN.</span></h2>
        
        <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto">
           <h4 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-orange-500/20 pb-3 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
           </h4>
           <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
           <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
           <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {/* STARTER TIER */}
        <div className="bg-[#0a0a0a] border border-blue-500/40 rounded-[2.5rem] p-10 flex flex-col items-center hover:border-blue-500 transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
           <div className="w-16 h-16 rounded-full border border-blue-500/30 flex justify-center items-center mb-6 bg-blue-500/10">
              <Diamond className="text-blue-500 w-8 h-8"/>
           </div>
           <h3 className="text-white font-black text-2xl uppercase tracking-widest">STARTER</h3>
           <div className="text-blue-400 font-black text-6xl my-6">$50</div>
           
           <ul className="text-zinc-300 text-[13px] space-y-4 mb-10 text-left w-full font-bold">
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500 w-5 h-5"/> 200 CREDITS INCLUDED</li>
              <li className="flex items-center gap-3"><Clock className="text-blue-400 w-5 h-5"/> USE IN 24H OR STRETCH OVER 365 DAYS</li>
              <li className="flex items-center gap-3"><RefreshCcw className="text-blue-400 w-5 h-5"/> ROLLING QUOTA (NO MONTHLY EXPIRY)</li>
           </ul>
           
           <MagneticButton>
             <RippleButton 
               onClick={() => { if(typeof v8Toast !== 'undefined') v8Toast.info("Checkout currently disabled."); }} 
               className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] hover:bg-blue-500 hover:text-white transition-all shadow-lg"
             >
               SELECT STARTER
             </RippleButton>
           </MagneticButton>
        </div>

        {/* PRO TIER */}
        <div className="bg-[#0a0a0a] border-2 border-orange-500 rounded-[2.5rem] p-10 flex flex-col items-center shadow-[0_0_40px_rgba(234,88,12,0.2)] transform md:scale-105 relative">
           <div className="absolute -top-4 bg-orange-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
           <div className="w-16 h-16 rounded-full border border-orange-500/30 flex justify-center items-center mb-6 bg-orange-500/10">
              <Zap className="text-orange-500 w-8 h-8"/>
           </div>
           <h3 className="text-white font-black text-2xl uppercase tracking-widest">PRO</h3>
           <div className="text-orange-500 font-black text-6xl my-6">$150</div>
           
           <ul className="text-zinc-300 text-[13px] space-y-4 mb-10 text-left w-full font-bold">
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500 w-5 h-5"/> 1.000 CREDITS INCLUDED</li>
              <li className="flex items-center gap-3"><Clock className="text-orange-400 w-5 h-5"/> USE IN 24H OR STRETCH OVER 365 DAYS</li>
              <li className="flex items-center gap-3"><RefreshCcw className="text-orange-400 w-5 h-5"/> ROLLING QUOTA (NO MONTHLY EXPIRY)</li>
           </ul>
           
           <MagneticButton>
             <RippleButton 
               onClick={() => { if(typeof v8Toast !== 'undefined') v8Toast.info("Checkout currently disabled."); }} 
               className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]"
             >
               SELECT PRO
             </RippleButton>
           </MagneticButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center bg-[#050505] relative text-white">
      
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/90 backdrop-blur-xl"
          >
            <div className="flex flex-col items-center bg-black/50 p-12 rounded-[3rem] border border-orange-500/30 shadow-[0_0_80px_rgba(234,88,12,0.15)] text-center max-w-lg w-full mx-4">
              <RefreshCcw className="w-20 h-20 text-orange-500 animate-spin mb-8 drop-shadow-[0_0_20px_rgba(234,88,12,0.8)]" />
              <h2 className="text-3xl font-black text-white uppercase tracking-[0.3em] mb-4">V8 CORE ACTIVE</h2>
              <p className="text-orange-400 font-bold uppercase tracking-[0.2em] text-sm animate-pulse mb-8">
                Optimizing {files.length} Image(s)...
              </p>
              
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6 relative">
                 <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(activeLog / v8Logs.length) * 100}%` }}
                    className="h-full bg-gradient-to-r from-orange-600 to-amber-400 shadow-[0_0_10px_rgba(234,88,12,0.8)]"
                 />
              </div>

              <div className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest bg-black/60 w-full p-4 rounded-xl border border-white/5 h-16 flex items-center justify-center">
                 {v8Logs[activeLog] || "PROCESSING BATCH..."}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isVIP && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
           <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="bg-black/80 backdrop-blur-xl border border-orange-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-4"
           >
              <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">16MP ASSET CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {credits} AVAIL.
                 </span>
              </div>
           </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl w-full text-center mt-10">
        
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]"
        >
            {renderCinematicBackground()}

            <div className="relative z-10 py-24 px-6 text-center">
                <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                  V8 AUTOMATION // 16MP STANDARD WORKSPACE
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                  V8 <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">STANDARD 16MP</span>
                </h1>
                
                <p className="text-zinc-200 font-bold uppercase tracking-[0.4em] text-[11px] md:text-[13px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/40 p-6 rounded-2xl backdrop-blur-sm border-l-2 border-orange-500">
                  Stop wasting hours in Photoshop. Your core transforms AI generations into commercial beasts ready for Adobe Stock, Freepik, and Shutterstock. 
                  <span className="text-white block mt-3 italic font-black">100% Marketplace Compliance.</span>
                </p>

                {!isVIP && !isCheckingAccess && (
                  <div className="mt-12 relative z-20">
                     {renderPricingPlans()}
                  </div>
                )}
            </div>
        </motion.div>

        {/* 🔥 OVDE JE SADA NOVA ACCORDION LISTA (MENJA OBIČNE DIJAMANTE) 🔥 */}
        <div className={`transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
           {renderV8Manifest()}
        </div>

        <div className={`grid md:grid-cols-2 gap-10 text-left mb-20 transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          
          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border-2 border-orange-500/40 relative overflow-hidden group shadow-2xl flex flex-col"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url(${navBg})`, backgroundSize: 'cover'}}>
            
            <div className="flex items-center gap-4 mb-8">
              <Upload className="text-orange-500 w-8 h-8" />
              <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">RAW BATCH INPUT</h2>
            </div>
            
            <div className="bg-red-950/60 border-2 border-red-500 rounded-2xl p-6 mb-8 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
               <h4 className="text-red-400 text-[12px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> V8 ENGINE FORMAT PROTOCOL</h4>
               <ul className="text-zinc-200 text-[12px] leading-relaxed space-y-3 list-disc pl-5 font-bold">
                  <li>Accepted aspect ratios: <span className="text-white">16:9, 9:16, 21:9 or 1:1</span>.</li>
                  <li className="text-orange-400 bg-orange-950/50 p-2 rounded-lg border border-orange-500/30">
                     <span className="font-black">STRICT RULE: NO MIXED BATCHES!</span><br/>
                     You CANNOT mix formats (e.g., placing 16:9 and 21:9 together in the same upload). All images in a single batch must be the exact same aspect ratio!
                  </li>
                  <li>Max <span className="text-white font-black">10 images</span> per processing cycle.</li>
               </ul>
            </div>

            <label className="group relative flex flex-col items-center justify-center w-full flex-grow min-h-[220px] border-4 border-dashed border-white/10 rounded-3xl hover:border-orange-500 transition-all cursor-pointer bg-black/40 overflow-hidden">
              
              {files.length > 0 && (
                <MagneticButton className="absolute top-4 right-4 z-20">
                  <button
                    onClick={clearWorkspace}
                    className="bg-red-950/80 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] cursor-pointer"
                    title="Clear Workspace"
                  >
                    <X className="w-6 h-6 stroke-[3]" />
                  </button>
                </MagneticButton>
              )}

              {files.length > 0 ? (
                <div className="flex flex-col items-center text-center px-4">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mb-3 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                  
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-white font-black text-4xl">{files.length}</span>
                     <span className="text-zinc-500 font-black text-2xl">/</span>
                     <span className="text-zinc-400 font-black text-2xl">{Math.min(10, credits)}</span>
                  </div>
                  
                  <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">IMAGES READY FOR ENGINE</span>
                  
                  <span className="bg-orange-500/20 border border-orange-500/50 text-orange-400 font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                     COST: {files.length} CREDITS
                  </span>
                </div>
              ) : (
                <>
                  <Zap className="w-16 h-16 text-zinc-800 group-hover:text-orange-500 transition-colors mb-6 animate-pulse" />
                  <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[11px] group-hover:text-white transition-colors text-center px-4">DRAG & DROP UP TO 10 IMAGES</span>
                  <span className="text-orange-500/60 font-bold uppercase tracking-[0.2em] text-[9px] mt-4">Takes 1 credit per image</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" multiple disabled={!isVIP || credits <= 0} />
            </label>

            <MagneticButton className="mt-8">
              <RippleButton onClick={processBatch} disabled={files.length === 0 || isProcessing || credits < files.length}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.5em] text-[13px] transition-all flex items-center justify-center gap-3 shrink-0 ${
                  files.length === 0 || isProcessing ? 'bg-zinc-900 text-zinc-700 border border-white/5' : 
                  credits < files.length ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' :
                  'bg-orange-600 text-white shadow-[0_15px_40px_rgba(234,88,12,0.4)] border border-orange-400 hover:scale-[1.02] cursor-pointer'
                }`}>
                
                {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : credits < files.length ? <AlertTriangle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                {isProcessing ? "IGNITING V8 CORE..." : credits < files.length ? "INSUFFICIENT CREDITS" : "START BATCH OPTIMIZATION"}
              </RippleButton>
            </MagneticButton>
          </div>

          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-2xl"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.94), rgba(0,0,0,0.94)), url(${navBg})`, backgroundSize: 'cover'}}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Download className={`w-8 h-8 ${result ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'text-zinc-700'}`} />
                  <h2 className={`text-2xl font-black uppercase italic tracking-widest ${result ? 'text-emerald-400' : 'text-zinc-600'}`}>OPTIMIZED OUTPUT</h2>
                </div>
            </div>

            <div className="font-mono text-zinc-400 bg-black/60 border border-white/5 rounded-3xl p-8 h-80 text-[10px] md:text-[11px] tracking-widest uppercase overflow-y-auto shadow-inner leading-relaxed">
              <AnimatePresence>
                {v8Logs.slice(0, activeLog).map((log, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-2.5 flex items-center gap-2">
                    {log.includes('🚀') ? <span className="text-orange-500 font-black">{log}</span> : 
                     log.includes('💎') ? <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{log}</span> : 
                     log.includes('✅') ? <span className="text-emerald-400 font-black">{log}</span> : 
                     <span>{log}</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!result && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <FileImage className="w-16 h-16 mb-4" />
                  <span className="font-black text-[10px]">AWAITING ENGINE START</span>
                </div>
              )}
            </div>

            {result && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 flex justify-center w-full">
                <MagneticButton className="w-full">
                  <a 
                    href={result} 
                    download={`V8_16MP_Batch_${Date.now()}.zip`}
                    className="w-full bg-white text-black py-6 px-8 rounded-full font-black uppercase tracking-[0.5em] text-[13px] hover:bg-orange-500 hover:text-white transition-all shadow-2xl flex justify-center items-center gap-3 cursor-pointer"
                  >
                    <DownloadCloud className="w-6 h-6" /> DOWNLOAD V8 BATCH (.ZIP)
                  </a>
                </MagneticButton>
              </motion.div>
            )}
          </div>
        </div>

        {isVIP && (
           <div className="border-t border-white/10 pt-20">
              {renderPricingPlans()}
           </div>
        )}
        
      </motion.div>
    </div>
  );
};

export default V8Standard16MPWorkspace;
// KRAJ FAJLA: V8Standard16MPWorkspace.jsx