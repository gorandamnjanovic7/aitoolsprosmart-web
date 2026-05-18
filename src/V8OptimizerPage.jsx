// POČETAK FAJLA: V8OptimizerPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Download, ShieldCheck, RefreshCcw, Diamond, AlertTriangle, Clock, FileImage, X, DownloadCloud, Lock, CheckCircle, Info } from 'lucide-react';
import { v8Toast } from './App';
import MagneticButton from './MagneticButton';
import navBg from './navbar-bg.webp'; 

// 🔥 FIREBASE IMPORTS 🔥
import { db, auth } from './firebase';
import { signInWithPopup, onAuthStateChanged, GoogleAuthProvider } from "firebase/auth";
import { collection, doc, getDoc, setDoc, serverTimestamp, onSnapshot, addDoc, updateDoc, increment } from "firebase/firestore";

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

// --- RIPPLE BUTTON KOMPONENTA ---
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
      <span className="relative z-10 flex items-center justify-center">{children}</span>
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute bg-white/40 rounded-full pointer-events-none z-0" style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }} onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))} />
        ))}
      </AnimatePresence>
    </button>
  );
};

// POČETAK FUNKCIJE: V8OptimizerPage
const V8OptimizerPage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLog, setActiveLog] = useState(0);

  // --- V8 KREDITI & AUTH STATE ---
  const [isVIP, setIsVIP] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [lemonLink, setLemonLink] = useState("");
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // --- V8 ZAKLJUČAVANJE EKRANA KADA SE OTVORI MODAL ---
  useEffect(() => {
    if (showPaymentModal) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [showPaymentModal]);

  // --- V8 FIREBASE AUTH & CREDIT LISTENER ---
  useEffect(() => {
    const unsubLemon = onSnapshot(doc(db, "v8_settings", "lemon_checkout"), (docSnap) => {
        if (docSnap.exists()) setLemonLink(docSnap.data().optimizer || "");
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email ? user.email.toLowerCase() : "";
        
        // Goran i AI Master nalozi imaju beskonačno kredita
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

    return () => { unsubscribe(); unsubLemon(); };
  }, []);

  // --- V8 BLINDIRANA FUNKCIJA ZA KUPITI KREDITE (PLAĆANJE) ---
  const handlePaymentV8 = async (e) => {
    if (e) e.preventDefault();
    try {
        let currentUser = auth.currentUser;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (!currentUser) {
            const v8Provider = new GoogleAuthProvider();
            v8Provider.setCustomParameters({ prompt: 'select_account' });
            const result = await signInWithPopup(auth, v8Provider);
            currentUser = result.user;
        }

        if (currentUser) {
            const tipPaketa = 'V8 OPTIMIZER (LIFETIME LICENSE)';
            const cenaPaketa = "200.00";

            await addDoc(collection(db, "v8_kupci"), {
                ime: currentUser.displayName || "Client", email: currentUser.email, uid: currentUser.uid,
                zeliPaket: tipPaketa, cenaPaketa: cenaPaketa, vreme: serverTimestamp(), isPaid: false
            });

            await setDoc(doc(db, "posetioci", currentUser.uid), { 
                ime: currentUser.displayName || "Client", email: currentUser.email, 
                vremePrijave: serverTimestamp(), zainteresovanZa: tipPaketa, identitet: "V8-Optimizer-Client" 
            }, { merge: true });

            const email = currentUser.email ? currentUser.email.toLowerCase() : "";
            
            if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
                v8Toast.success("Master Account: Credits maxed out.");
                return; 
            }

            if (lemonLink && lemonLink.includes("http")) {
                window.location.href = lemonLink;
            } else {
                setShowPaymentModal({ tip: tipPaketa, cena: cenaPaketa });
            }
        }
    } catch (err) {
        v8Toast.error(err.message || "Greška na sistemu za naplatu.");
    }
  };

  // V8 TERMINAL LOGS
  const v8Logs = [
    "🚀 VISIONARY FACTORY V8 | IGNITING ENGINE...",
    "🔷 1. Contributor quality cleanup (artifact reduction)",
    "🔷 2. Premium sharpness (natural detail, no oversharp)",
    "🔷 3. Color grading (commercial balance & contrast)",
    "🔷 4. Highlight rolloff (softer highlights)",
    "🔷 5. Shadow depth (rich & deep shadows)",
    "🔷 6. sRGB Marketplace Export (ready for upload)",
    "🔷 7. PRODUCT AD POLISH (premium visual finish)",
    "🔷 8. Anti-plastic realism (film grain & natural textures)",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (credits === 0 && isVIP) {
       v8Toast.error("ENGINE COOLING: You have 0 credits. Please wait for your cycle to reset.");
       return;
    }

    if (selectedFiles.length > credits) {
       v8Toast.error(`V8 QUOTA: You only have ${credits} optimization(s) left in this cycle. Loading only ${credits} image(s).`);
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

  // POČETAK FUNKCIJE: processImage
  const processImage = async () => {
    if (files.length === 0) return;
    
    if (credits < files.length) {
        v8Toast.error(`INSUFFICIENT CREDITS! Need ${files.length}, have ${credits}.`);
        return;
    }

    setIsProcessing(true);
    setResult(null);
    setActiveLog(0);

    const formData = new FormData();
    files.forEach((file) => {
        formData.append('images', file);
    });

    try {
        const progressInterval = setInterval(() => {
            setActiveLog(prev => prev < v8Logs.length - 1 ? prev + 1 : prev);
        }, 800);

        const response = await fetch(`${BASE_BACKEND_URL}/api/v8-optimize`, {
            method: 'POST',
            body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) throw new Error("V8 Server Error");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        setResult(url); 
        setActiveLog(v8Logs.length); 
        
        // 🔥 V8 TRANSAKCIJA KREDITA 🔥
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
        if(typeof v8Toast !== 'undefined') v8Toast.error("Optimization failed. Check server logs.");
        setActiveLog(0);
    } finally {
        setIsProcessing(false);
    }
  };
  // KRAJ FUNKCIJE: processImage

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center bg-[#050505] relative text-white">
      
      {/* --- 🔥 V8 CREDIT HUD (UI HEADER) 🔥 --- */}
      {isVIP && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
           <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className="bg-black/80 backdrop-blur-xl border border-orange-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-4"
           >
              <Zap className="w-5 h-5 text-orange-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">V8 ASSET CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {credits} / 1000
                 </span>
              </div>
           </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl w-full text-center mt-10">
        
        {/* --- POČETAK: HERO BOX --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]"
        >
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }} 
            ></div>
            
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/70 to-[#050505]"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>

            <div className="relative z-10 py-24 px-6 text-center">
                <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                  V8 AUTOMATION // ENTERPRISE OPTIMIZER MODE
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                  V8 <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">PRO OPTIMIZER</span>
                </h1>
                
                <p className="text-zinc-200 font-bold uppercase tracking-[0.4em] text-[11px] md:text-[13px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/40 p-6 rounded-2xl backdrop-blur-sm border-l-2 border-orange-500">
                  Stop wasting hours in Photoshop. Your core transforms AI generations into commercial beasts ready for Adobe Stock, Freepik, and Shutterstock. 
                  <span className="text-white block mt-3 italic font-black">100% Marketplace Compliance.</span>
                </p>

                {/* 🔥 V8 LOKOT SA PREMIUM COPYWRITINGOM 🔥 */}
                {!isVIP && !isCheckingAccess && (
                  <div className="mt-12 p-8 md:p-10 bg-[#050505]/95 backdrop-blur-2xl border border-red-500/40 rounded-[2.5rem] flex flex-col items-center max-w-4xl mx-auto shadow-[0_30px_80px_rgba(220,38,38,0.25)] relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                     <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                     <Lock className="w-12 h-12 text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                     <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-2 z-10">LIFETIME ACCESS. <span className="text-red-500">ROLLING QUOTA.</span></h3>
                     
                     <div className="mt-6 mb-10 bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 text-left space-y-5 z-10 w-full shadow-inner">
                        <h4 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-orange-500/20 pb-3 mb-2 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4" /> V8 LICENSE PROTOCOL EXPLAINED
                        </h4>
                        <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay $200 once. Secure your Lifetime License. Zero monthly subscriptions. Ever.</p>
                        <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get 1000 master-grade optimizations per cycle. Your 30-day clock <span className="text-orange-400">only starts the exact second your first optimized ZIP is delivered</span>. Not a second before.</p>
                        <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">3. NO EXPIRY ANXIETY:</strong> Burn 1000 images in 5 days? Let the engine cool until your 30-day mark. Take 8 months to use them? They stay active until the very last drop.</p>
                        <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">4. INFINITE FREE REFILLS:</strong> Hit your 1000th image? The V8 Engine enters a mandatory 24-hour cooldown protocol. After 24 hours, your 1000 credits auto-replenish. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
                     </div>

                     <div className="flex gap-4 w-full justify-center z-10">
                        <RippleButton 
                           onClick={handlePaymentV8} 
                           className="bg-red-600 hover:bg-red-500 text-white px-10 py-5 rounded-2xl font-black text-[14px] md:text-[16px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-all flex items-center gap-3"
                        >
                           <Zap className="w-5 h-5" /> SECURE LIFETIME LICENSE ($200)
                        </RippleButton>
                     </div>
                  </div>
                )}
            </div>
        </motion.div>
        {/* --- KRAJ: HERO BOX --- */}


        {/* --- POČETAK: SREDIŠNJA LISTA SA PULSIRAJUĆIM DIJAMANTIMA --- */}
        <div className={`flex flex-col items-center justify-center mb-20 relative z-10 transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          <div className="bg-black/50 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-left inline-block hover:border-orange-500/30 transition-colors duration-500">
            <div className="flex flex-col gap-4 text-[11px] md:text-[12px] font-black uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">1. Contributor quality cleanup</span> <span className="text-zinc-500 lowercase tracking-normal">(artifact reduction)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">2. Premium sharpness</span> <span className="text-zinc-500 lowercase tracking-normal">(natural detail, no oversharp)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">3. Color grading</span> <span className="text-zinc-500 lowercase tracking-normal">(commercial balance & contrast)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">4. Highlight rolloff</span> <span className="text-zinc-500 lowercase tracking-normal">(softer highlights)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">5. Shadow depth</span> <span className="text-zinc-500 lowercase tracking-normal">(rich & deep shadows)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">6. sRGB Marketplace Export</span> <span className="text-zinc-500 lowercase tracking-normal">(ready for upload)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">7. PRODUCT AD POLISH</span> <span className="text-zinc-500 lowercase tracking-normal">(premium visual finish)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">8. Anti-plastic realism</span> <span className="text-zinc-500 lowercase tracking-normal">(film grain & natural textures)</span></div>
              <div className="flex items-center gap-4 mt-4 border-t border-white/10 pt-6"><span className="text-emerald-400 text-xl drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">✅</span> <span className="text-emerald-400 tracking-[0.2em] text-[13px]">SYSTEM STATUS: 100% | BATCH READY</span></div>
            </div>
          </div>
        </div>
        {/* --- KRAJ: SREDIŠNJA LISTA --- */}


        <div className={`grid md:grid-cols-2 gap-10 text-left mb-20 transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          
          {/* INPUT BOX */}
          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border-2 border-orange-500/40 relative overflow-hidden group shadow-2xl flex flex-col"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url(${navBg})`, backgroundSize: 'cover'}}>
            
            <div className="flex items-center gap-4 mb-8">
              <Upload className="text-orange-500 w-8 h-8" />
              <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">RAW BATCH INPUT</h2>
            </div>
            
            {/* 🔥 V8 FORMAT PROTOCOL INFO BOX 🔥 */}
            <div className="bg-red-950/40 border border-red-500/30 rounded-2xl p-5 mb-8 shadow-inner">
               <h4 className="text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> V8 ENGINE FORMAT PROTOCOL</h4>
               <ul className="text-zinc-300 text-[11px] leading-relaxed space-y-2 list-disc pl-4 font-bold">
                  <li>Accepted aspect ratios: <span className="text-white">16:9, 9:16, or 1:1</span> only.</li>
                  <li><span className="text-orange-400 font-black">STRICT RULE: NO MIXED BATCHES.</span> All images in a single batch must share the exact same aspect ratio for core stability.</li>
                  <li>Max <span className="text-white font-black">10 images</span> per processing cycle.</li>
               </ul>
            </div>

            <label className="group relative flex flex-col items-center justify-center w-full flex-grow min-h-[220px] border-4 border-dashed border-white/10 rounded-3xl hover:border-orange-500 transition-all cursor-pointer bg-black/40 overflow-hidden">
              {files.length > 0 ? (
                <div className="flex flex-col items-center text-center px-4">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mb-3 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                  
                  {/* 🔥 V8 DIGITAL BROJAČ SLIKA 🔥 */}
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-white font-black text-4xl">{files.length}</span>
                     <span className="text-zinc-500 font-black text-2xl">/</span>
                     <span className="text-zinc-400 font-black text-2xl">{Math.min(10, credits)}</span>
                  </div>
                  
                  <span className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">IMAGES READY FOR ENGINE</span>
                  
                  {/* 🔥 V8 COST BADGE 🔥 */}
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

            <button onClick={processImage} disabled={files.length === 0 || isProcessing || credits < files.length}
              className={`w-full mt-8 py-6 rounded-2xl font-black uppercase tracking-[0.5em] text-[13px] transition-all flex items-center justify-center gap-3 shrink-0 ${
                files.length === 0 || isProcessing ? 'bg-zinc-900 text-zinc-700 border border-white/5' : 
                credits < files.length ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' :
                'bg-orange-600 text-white shadow-[0_15px_40px_rgba(234,88,12,0.4)] border border-orange-400 hover:scale-[1.02] cursor-pointer'
              }`}>
              
              {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : credits < files.length ? <AlertTriangle className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              {isProcessing ? "IGNITING V8 CORE..." : credits < files.length ? "INSUFFICIENT CREDITS" : "START BATCH OPTIMIZATION"}
            </button>
          </div>

          {/* OUTPUT / TERMINAL BOX WITH DIAMONDS */}
          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-2xl"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.94), rgba(0,0,0,0.94)), url(${navBg})`, backgroundSize: 'cover'}}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Download className={`w-8 h-8 ${result ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'text-zinc-700'}`} />
                  <h2 className={`text-2xl font-black uppercase italic tracking-widest ${result ? 'text-emerald-400' : 'text-zinc-600'}`}>OPTIMIZED OUTPUT</h2>
                </div>
            </div>

            {/* THE TERMINAL LOG */}
            <div className="font-mono text-zinc-400 bg-black/60 border border-white/5 rounded-3xl p-8 h-80 text-[10px] md:text-[11px] tracking-widest uppercase overflow-y-auto shadow-inner leading-relaxed">
              <AnimatePresence>
                {v8Logs.slice(0, activeLog).map((log, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-2.5 flex items-center gap-2">
                    {log.includes('🚀') ? <span className="text-orange-500 font-black">{log}</span> : 
                     log.includes('🔷') ? <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{log}</span> : 
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
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10">
                <a 
                  href={result} 
                  download="V8_ENTERPRISE_BATCH.zip" 
                  className="w-full bg-white text-black py-6 px-8 rounded-full font-black uppercase tracking-[0.5em] text-[13px] hover:bg-orange-500 hover:text-white transition-all shadow-2xl inline-block text-center cursor-pointer"
                >
                  DOWNLOAD V8 BATCH (.ZIP)
                </a>
              </motion.div>
            )}
          </div>
        </div>

        {/* LIFETIME LICENSE SECTION - ROLLING QUOTA */}
        <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-20">
            <div className="flex flex-col justify-center">
                <h3 className="text-4xl font-black italic uppercase text-white mb-4">V8 ROLLING <span className="text-red-500 font-black">QUOTA</span></h3>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Zero expiry anxiety. Auto-refill protocol activated.</p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-red-950/40 via-orange-950/40 to-red-950/40 border border-red-500/50 p-10 rounded-[3rem] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.1)]">
                <div className="flex items-center gap-6 relative z-10">
                   <div className="p-4 bg-red-500/20 rounded-3xl border border-red-400/30">
                      <Diamond className="w-14 h-14 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-bounce" />
                   </div>
                   <div>
                       <span className="text-orange-500 font-black uppercase text-[11px] tracking-[0.3em]">LIFETIME LICENSE</span>
                       <h4 className="text-white font-black uppercase text-3xl tracking-tighter">1000 <span className="text-red-400">CREDITS</span></h4>
                   </div>
                </div>
                <div className="flex flex-col items-center md:items-end relative z-10">
                    <div className="flex items-end gap-2">
                        <span className="text-white font-black font-mono text-6xl">$200</span>
                    </div>
                    <MagneticButton>
                        <button 
                          onClick={handlePaymentV8}
                          className="mt-6 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-yellow-400 hover:text-black transition-all shadow-xl flex items-center gap-2"
                        >
                            SECURE CHECKOUT 🍋
                        </button>
                    </MagneticButton>
                </div>
            </div>
        </div>
      </motion.div>

      {/* 🔥 V8 PAYMENT MODAL PORTAL (ZAKUCAN ZA CENTAR) 🔥 */}
      {createPortal(
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden">
                <button onClick={() => setShowPaymentModal(null)} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
                
                <div className="p-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                     <DownloadCloud className="w-8 h-8 text-orange-500" />
                  </div>
                  
                  <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
                  <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center">{showPaymentModal?.tip}</p>
                  
                  <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
                    <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Provider:</span><span className="font-bold text-white text-right">V8 Vault</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
                    <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-white text-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${showPaymentModal?.cena}</span></div>
                  </div>
                  
                  <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
                    <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-orange-500 hover:text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                        Request Checkout Link
                    </a>
                    <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your 1000 credits automatically! 🚀</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default V8OptimizerPage;
// KRAJ FAJLA: V8OptimizerPage.jsx