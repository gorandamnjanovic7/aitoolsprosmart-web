// POČETAK FAJLA: V8JsonExtractorPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { Upload, Code, ShieldCheck, RefreshCcw, Diamond, Lock, Copy, CheckCircle, FileImage, Crown, Zap, AlertTriangle, DownloadCloud, X, Layers, Cpu, FastForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { db, auth } from './firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, setDoc, onSnapshot, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

// --- POČETAK FUNKCIJE: MODAL ZA CHECKOUT ---
const V8ExtractorCheckoutModal = ({ isOpen, onClose, paket }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !paket) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden m-auto">
        <button onClick={onClose} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
        
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
             <DownloadCloud className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
          <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center text-balance px-4">{`V8 EXTRACTOR LICENSE: ${paket.name}`}</p>
          
          <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Credits:</span><span className="font-bold text-white text-right">{paket.credits}</span></div>
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
            <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-orange-500 text-[22px] drop-shadow-[0_0_8px_rgba(234,88,12,0.5)]">${paket.price}</span></div>
          </div>
          
          <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
            <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
            <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-orange-400 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-inner">
                📧 Request Checkout Link
            </a>
            <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your Extractor automatically after checkout! 🚀</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
// --- KRAJ FUNKCIJE: MODAL ZA CHECKOUT ---

// --- POČETAK FUNKCIJE: V8JsonExtractorPage ---
const V8JsonExtractorPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetFormat, setTargetFormat] = useState('16:9');
  const [detectedAR, setDetectedAR] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [jsonResult, setJsonResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [isVIP, setIsVIP] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const inputRef = useRef(null);

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
          onSnapshot(docRef, (docSnap) => {
             if (docSnap.exists() && docSnap.data().unlockedApps?.includes('V8_EXTRACTOR')) { 
               setIsVIP(true); 
               setCredits(docSnap.data().extractorCredits ?? 0); 
             } else { 
               setIsVIP(false); 
               setCredits(0); 
             }
             setIsCheckingAccess(false);
          });
        }
      } else {
        setIsVIP(false);
        setCredits(0);
        setIsCheckingAccess(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) ucitajSliku(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) ucitajSliku(e.target.files[0]);
  };

  const ucitajSliku = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setJsonResult('');

    // Automatska detekcija Aspect Ratio-a
    const img = new Image();
    img.onload = () => {
        const ratio = img.width / img.height;
        let detected = '1:1';
        if (ratio >= 2.0) detected = '21:9';
        else if (ratio >= 1.2) detected = '16:9';
        else if (ratio <= 0.8) detected = '9:16';
        
        setDetectedAR(detected);
        
        // Automatski selektuj prvi sledeći koji nije ovaj
        const allARs = ['16:9', '9:16', '1:1', '21:9'];
        const availableARs = allARs.filter(ar => ar !== detected);
        if (availableARs.length > 0) {
            setTargetFormat(availableARs[0]);
        }
    };
    img.src = objectUrl;
  };

  const obrisiSliku = () => {
    setFile(null); 
    setPreviewUrl(null); 
    setJsonResult('');
    setDetectedAR(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- POČETAK FUNKCIJE: extractDNA (ISPRAVLJENO) ---
  const extractDNA = async () => {
    if (!file) return;
    if (credits <= 0 && isVIP) {
        alert("INSUFFICIENT CREDITS! Please wait for refill.");
        return;
    }

    setIsExtracting(true);
    setJsonResult('');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('targetFormat', targetFormat);
    formData.append('email', auth.currentUser?.email || ''); 

    try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/v8-extract-dna`, { method: 'POST', body: formData });
        
        // data je sada čist JSON objekat direktno sa servera
        const data = await response.json(); 
        
        if (!response.ok) {
           throw new Error(data.error || "Greska na serveru");
        }
        
        // ISPRAVKA: Direktno stringujemo data objekat jer ga je server već parsirao
        setJsonResult(JSON.stringify(data, null, 2));
        
    } catch (error) { 
        alert("Extraction failed. Check server logs."); 
        console.error("V8 FRONTEND ERROR:", error);
    } finally { 
        setIsExtracting(false); 
    }
  };
  // --- KRAJ FUNKCIJE: extractDNA ---

  const pokreniKupovinu = async (paket) => {
    setSelectedPaket(paket);
    try {
      let user = auth.currentUser;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (!user) {
          const v8Provider = new GoogleAuthProvider();
          v8Provider.setCustomParameters({ prompt: 'select_account' });
          await signInWithPopup(auth, v8Provider);
          return;
      }

      if (user) {
          const imePaketa = `V8 EXTRACTOR LICENSE: ${paket.name}`;
          await addDoc(collection(db, "v8_kupci"), {
              ime: user.displayName || "Client", email: user.email, uid: user.uid,
              zeliPaket: imePaketa, cenaPaketa: paket.price.toString(), vreme: serverTimestamp(), isPaid: false
          });
          await setDoc(doc(db, "posetioci", user.uid), { 
              ime: user.displayName || "Client", email: user.email, 
              vremePrijave: serverTimestamp(), zainteresovanZa: imePaketa, identitet: "V8-Extractor-Client" 
          }, { merge: true });
          setShowPaymentModal(true);
      }
    } catch (err) {
        console.error("V8 PAYMENT ERROR:", err);
    }
  };

  const arOptions = ['16:9', '9:16', '1:1', '21:9'];

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-6xl mx-auto mt-28 relative">
      
      {/* 🔥 V8 CREDIT HUD 🔥 */}
      {isVIP && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
           <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
              className="bg-black/80 backdrop-blur-xl border border-orange-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-4">
              <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">EXTRACTOR CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {credits}
                 </span>
              </div>
           </motion.div>
        </div>
      )}

      {/* --- 🔥 HERO & PRICING 🔥 --- */}
      <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.15)]"
      >
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                  V8 CINEMATIC PROTOCOL // REVERSE ENGINEERING
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
                  <Code className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
                  JSON <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">EXTRACTOR</span>
              </h1>
              
              <div className="bg-[#050505]/80 backdrop-blur-md border border-orange-500/20 p-8 rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8">
                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">The Protocol Explained:</h4>
                  <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">
                      The V8 Cinematic Protocol acts as a <strong>forensic visual engine</strong>. It deconstructs your master image—analyzing lighting vectors, color temperature, lens optical properties, and structural composition—and converts this data into a <strong>pure JSON blueprint</strong>.
                  </p>
                  <p className="text-zinc-300 text-[13px] leading-relaxed">
                      Once extracted, this "DNA" becomes your master template. You can now force-apply this exact stylistic blueprint to any target format (16:9, 9:16, 1:1, 21:9) without the AI "guessing" the style. The result is <strong>perfect aesthetic continuity</strong> across every platform with zero structure loss.
                  </p>
              </div>

              {!isVIP && !isCheckingAccess && (
                <div className="mt-8 p-8 md:p-10 bg-[#050505]/95 backdrop-blur-2xl border border-orange-500/40 rounded-[2.5rem] flex flex-col items-center w-full shadow-[0_30px_80px_rgba(234,88,12,0.25)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none"></div>
                   <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                   <Lock className="w-12 h-12 text-orange-500 mb-6 drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]" />
                   <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-6 z-10 text-center">
                       LIFETIME ACCESS. <span className="text-orange-500 block md:inline mt-2 md:mt-0">CHOOSE YOUR V8 PLAN.</span>
                   </h3>
                   
                   <div className="mb-12 bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-8 text-left space-y-5 z-10 w-full max-w-4xl shadow-inner">
                      <h4 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-orange-500/20 pb-3 mb-2 flex items-center gap-2">
                         <ShieldCheck className="w-4 h-4" /> V8 LICENSE PROTOCOL
                      </h4>
                      <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
                      <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
                      <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
                   </div>

                   <div className="grid md:grid-cols-3 gap-6 w-full z-10 relative">
                      
                      {/* Starter */}
                      <div className="bg-[#050505] border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto">
                              <Diamond className="w-6 h-6 text-blue-500" />
                          </div>
                          <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                          <span className="text-4xl font-black text-blue-400 my-4 text-center">$150</span>
                          
                          <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                             <p className="flex items-center gap-2">✅ 500 Credits Included</p>
                             <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                             <p className="flex items-center gap-2">🔄 Rolling Quota (No monthly expiry)</p>
                          </div>
                          <button onClick={() => pokreniKupovinu({name: 'Starter', price: 150, credits: 500})} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[12px] hover:bg-blue-500 hover:text-white transition-all shadow-md hover:-translate-y-1">Select Starter</button>
                      </div>

                      {/* Pro */}
                      <div className="bg-[#050505] border border-orange-500/50 rounded-[2rem] p-8 flex flex-col relative overflow-hidden hover:border-orange-500/80 transition-all shadow-[0_0_30px_rgba(234,88,12,0.15)] transform scale-100 md:scale-105 z-10">
                          <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 mb-6 mx-auto">
                              <Zap className="w-6 h-6 text-orange-500" />
                          </div>
                          <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                          <span className="text-4xl font-black text-orange-500 my-4 text-center">$250</span>
                          
                          <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                             <p className="flex items-center gap-2">✅ 2,000 Credits Included</p>
                             <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                             <p className="flex items-center gap-2">🔄 Rolling Quota (No monthly expiry)</p>
                          </div>
                          <button onClick={() => pokreniKupovinu({name: 'Pro', price: 250, credits: 2000})} className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 rounded-xl font-black uppercase text-[12px] hover:from-orange-500 hover:to-amber-400 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:-translate-y-1">Select Pro</button>
                      </div>

                      {/* Enterprise */}
                      <div className="bg-[#050505] border border-purple-500/30 rounded-[2rem] p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto">
                              <Crown className="w-6 h-6 text-purple-500" />
                          </div>
                          <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
                          <span className="text-4xl font-black text-purple-400 my-4 text-center">$550</span>
                          
                          <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                             <p className="flex items-center gap-2">✅ 10,000 Credits Included</p>
                             <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                             <p className="flex items-center gap-2">🔄 Lifetime Access (Rolling Quota)</p>
                          </div>
                          <button onClick={() => pokreniKupovinu({name: 'Enterprise', price: 550, credits: 10000})} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase text-[12px] hover:bg-purple-500 hover:text-white transition-all shadow-md hover:-translate-y-1">Select Enterprise</button>
                      </div>

                   </div>
                </div>
              )}
          </div>
      </motion.div>

      {/* --- 🔥 RADNI PROSTOR 🔥 --- */}
      <div className={`transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
          
          {/* UPLOAD SEKCIJA */}
          <div className="flex flex-col gap-6">
             <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
               <FileImage size={14} /> 1. SOURCE IMAGE
             </label>
             <div 
               className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${previewUrl ? 'border-solid border-[#FF8C00]/50 p-2' : 'h-64'}`}
               onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
             >
               <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
               {previewUrl ? (
                 <div className="relative w-full h-64 group rounded-xl overflow-hidden">
                   <img src={previewUrl} alt="Uploaded prep" className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                     <button onClick={obrisiSliku} className="bg-red-600/90 text-white p-3 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110"><X size={28} strokeWidth={3} /></button>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => inputRef.current.click()}>
                   <div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div>
                   <div>
                     <p className="text-white font-bold text-sm">Drag & Drop image to extract DNA</p>
                     <p className="text-zinc-500 text-xs mt-1">or click to browse files</p>
                   </div>
                 </div>
               )}
             </div>

             {/* DUGMIĆI ZA TARGET ASPECT RATIO */}
             <div className="flex flex-col gap-4">
               <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center justify-between">
                 TARGET ASPECT RATIO
                 {detectedAR && <span className="text-red-500 text-[9px] bg-red-500/10 px-2 py-1 rounded">DETECTED: {detectedAR}</span>}
               </label>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {arOptions.map((ar) => {
                   const isDetected = detectedAR === ar;
                   const isSelected = targetFormat === ar && !isDetected;
                   
                   return (
                     <button 
                       key={ar}
                       onClick={() => !isDetected && setTargetFormat(ar)}
                       disabled={isDetected}
                       className={`py-3 rounded-xl font-black text-[12px] uppercase transition-all border 
                         ${isDetected ? 'bg-red-900/20 border-red-500/50 text-red-500/50 cursor-not-allowed opacity-50' 
                         : isSelected ? 'bg-orange-600 border-orange-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' 
                         : 'bg-[#0a0a0a] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}
                       `}
                     >
                       {ar}
                     </button>
                   );
                 })}
               </div>
               
               <div className="mt-2 text-center p-3 border border-orange-500/20 rounded-xl bg-orange-500/5">
                 <p className="text-orange-400 font-bold uppercase tracking-widest text-[10px] md:text-[11px]">
                   Generate image in your favorite generator. You must use <span className="text-white font-black">Google Nano Banana 2</span> in any of these ARs.
                 </p>
               </div>
             </div>
          </div>

          {/* OUTPUT SEKCIJA */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
                  <Code size={14} /> 2. EXTRACTED JSON CODE
                </label>
                {jsonResult && (
                  <button onClick={handleCopy} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-zinc-400 transition-colors">
                     {copied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
             </div>
             
             <div className="font-mono text-emerald-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-grow min-h-[300px] text-[11px] md:text-[13px] overflow-y-auto shadow-inner whitespace-pre-wrap leading-relaxed relative">
               {jsonResult ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{jsonResult}</motion.div>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                   <ShieldCheck className="w-16 h-16 mb-4" />
                   <span className="font-black text-[10px] tracking-widest uppercase">AWAITING DNA SAMPLE</span>
                 </div>
               )}
             </div>

             <div className="mt-auto pt-2 flex flex-col gap-4">
               <button 
                 onClick={extractDNA} 
                 disabled={isExtracting || !file || credits <= 0} 
                 className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${credits <= 0 ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' : 'bg-[#0a0a0a] border border-white/10 text-white hover:border-orange-500/50 hover:text-orange-400'} disabled:opacity-50`}
               >
                 {isExtracting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                 {isExtracting ? "ANALYZING DNA..." : credits <= 0 ? "INSUFFICIENT CREDITS" : "EXTRACT V8 JSON"}
               </button>

               <AnimatePresence>
                 {jsonResult && (
                   <motion.button 
                     initial={{ opacity: 0, height: 0, marginTop: 0 }}
                     animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                     exit={{ opacity: 0, height: 0, marginTop: 0 }}
                     onClick={handleCopy}
                     className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[18px] md:text-[20px] uppercase tracking-widest py-6 rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                   >
                     {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                     {copied ? "DNA COPIED SUCCESS!" : "COPY JSON DNA CODE"}
                   </motion.button>
                 )}
               </AnimatePresence>
             </div>
          </div>

        </div>
      </div>

      <V8ExtractorCheckoutModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} paket={selectedPaket} />
    </div>
  );
};

export default V8JsonExtractorPage;
// KRAJ FAJLA: V8JsonExtractorPage.jsx