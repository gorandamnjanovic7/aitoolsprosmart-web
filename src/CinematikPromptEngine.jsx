// POČETAK FAJLA: CinematikPromptEngine.jsx
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { Upload, FileImage, Clock, Wand2, MonitorPlay, Smartphone, Settings2, X, Diamond, Lock, DownloadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagneticButton from './MagneticButton'; 

import { db, auth } from './firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const V8EngineCheckoutModal = ({ isOpen, onClose, currentEngine }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden m-auto">
        <button onClick={onClose} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
        
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
             <DownloadCloud className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
          <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center text-balance px-4">{`V8 PRO LICENSE: ${currentEngine}`}</p>
          
          <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Provider:</span><span className="font-bold text-white text-right">V8 Vault</span></div>
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
            <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-white text-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">$149.00</span></div>
          </div>
          
          <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
            <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
            <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-orange-500 hover:text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                Request Checkout Link
            </a>
            <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your generator automatically after checkout! 🚀</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const CinematikPromptEngine = ({ initialEngine = "SEEDANCE 2.0" }) => {
  // 🔥 PAMETNI SWITCHER STATE 🔥
  const [currentEngine, setCurrentEngine] = useState(initialEngine);

  // Ako korisnik klikne na meni gore, a već je na stranici, ovo automatski menja tab
  useEffect(() => {
    setCurrentEngine(initialEngine);
  }, [initialEngine]);

  const [promptText, setPromptText] = useState('');
  const [duration, setDuration] = useState('5s');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [arLocked, setArLocked] = useState(false); 
  
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDescription, setImageDescription] = useState(''); 
  
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const isImageModeActive = !!imageFile || imageDescription.length > 0;
  const isTextModeActive = promptText.length > 0;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) { setCurrentUser(user); } else { setCurrentUser(null); }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const checkPendingPurchase = async () => {
      const pendingEngine = localStorage.getItem('v8_pending_engine_checkout');

      if (auth.currentUser && pendingEngine === currentEngine) {
        localStorage.removeItem('v8_pending_engine_checkout'); 
        try {
            const imePaketa = `V8 PRO LICENSE: ${currentEngine}`;
            const cenaPaketa = "149.00"; 
            await addDoc(collection(db, "v8_kupci"), {
                ime: auth.currentUser.displayName || "Client", email: auth.currentUser.email, uid: auth.currentUser.uid,
                zeliPaket: imePaketa, cenaPaketa: cenaPaketa, vreme: serverTimestamp(), isPaid: false
            });
            await setDoc(doc(db, "posetioci", auth.currentUser.uid), { 
                ime: auth.currentUser.displayName || "Client", email: auth.currentUser.email, 
                vremePrijave: serverTimestamp(), zainteresovanZa: imePaketa, identitet: "V8-Engine-Client" 
            }, { merge: true });
            setShowPaymentModal(true); 
        } catch (err) {
            console.error("V8 PENDING ERROR", err);
        }
      }
    };
    const timer = setTimeout(() => { checkPendingPurchase(); }, 1000);
    return () => clearTimeout(timer);
  }, [currentEngine]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!isTextModeActive && e.dataTransfer.files && e.dataTransfer.files[0]) {
      ucitajSliku(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (!isTextModeActive && e.target.files && e.target.files[0]) {
      ucitajSliku(e.target.files[0]);
    }
  };

  const ucitajSliku = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      const img = new Image();
      img.onload = () => {
        if (img.width >= img.height) { setAspectRatio('16:9'); } else { setAspectRatio('9:16'); }
        setArLocked(true); 
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const obrisiSliku = () => {
    setImageFile(null); setImagePreview(null); setImageDescription(''); setArLocked(false); 
  };

  const generisiMasterPrompt = async () => {
    setIsGenerating(true);
    const formData = new FormData();
    formData.append('engine', currentEngine); 
    formData.append('text', isImageModeActive ? imageDescription : promptText);
    formData.append('duration', duration);
    formData.append('aspectRatio', aspectRatio);
    
    if (imageFile) { formData.append('image', imageFile); }

    try {
      const response = await fetch('https://aitoolsprosmart-becend-production.up.railway.app/api/v8-generate', {
        method: 'POST', body: formData,
      });
      if (!response.ok) throw new Error("V8 Server Error");
      const data = await response.json();
      console.log("V8 MASTER PROMPT REZULTAT:", data);
      alert("Prompts generated successfully! Check Console."); 
    } catch (error) {
      console.error("V8 Engine failure:", error);
      alert("Greška na serveru, proveri konekciju.");
    } finally {
      setIsGenerating(false);
    }
  };

  const pokreniKupovinu = async () => {
    const imePaketa = `V8 PRO LICENSE: ${currentEngine}`;
    const cenaPaketa = "149.00"; 

    try {
      let user = currentUser || auth.currentUser;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      if (!user) {
          localStorage.setItem('v8_pending_engine_checkout', currentEngine);
          const v8Provider = new GoogleAuthProvider();
          v8Provider.setCustomParameters({ prompt: 'select_account' });
          await signInWithPopup(auth, v8Provider);
          return;
      }

      if (user) {
          await addDoc(collection(db, "v8_kupci"), {
              ime: user.displayName || "Client", email: user.email, uid: user.uid,
              zeliPaket: imePaketa, cenaPaketa: cenaPaketa, vreme: serverTimestamp(), isPaid: false
          });
          await setDoc(doc(db, "posetioci", user.uid), { 
              ime: user.displayName || "Client", email: user.email, 
              vremePrijave: serverTimestamp(), zainteresovanZa: imePaketa, identitet: "V8-Engine-Client" 
          }, { merge: true });
          setShowPaymentModal(true);
      }
    } catch (err) {
        localStorage.removeItem('v8_pending_engine_checkout');
        console.error("V8 PAYMENT ERROR:", err);
    }
  };

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-5xl mx-auto mt-28 relative overflow-hidden">
      
      {/* 🔥 V8 ENGINE SWITCHER 🔥 */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-20">
          <button 
              onClick={() => setCurrentEngine("SEEDANCE 2.0")}
              className={`px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${currentEngine === "SEEDANCE 2.0" ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-[#0a0a0a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'}`}
          >
              <MonitorPlay size={16} /> SEEDANCE 2.0
          </button>
          <button 
              onClick={() => setCurrentEngine("KLING 3.0")}
              className={`px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${currentEngine === "KLING 3.0" ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-[#0a0a0a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'}`}
          >
              <Settings2 size={16} /> KLING 3.0
          </button>
      </div>

      <motion.div 
          key={currentEngine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.15)]"
      >
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                V8 CORE // CINEMATIC GENERATOR
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
                {currentEngine === "KLING 3.0" ? <Settings2 className="text-red-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" /> : <MonitorPlay className="text-green-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />}
                {currentEngine} <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">ENGINE</span>
              </h1>
              
              {currentEngine === "KLING 3.0" ? (
                <p className="text-zinc-200 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/60 p-5 rounded-2xl backdrop-blur-md border-l-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.15)]">
                  Command hyper-realistic physics and flawless kinetic motion. Inject secret meta-tokens to generate CGI-rivaling masterpieces. 
                  <span className="text-white font-black italic block mt-2 tracking-widest text-[11px] md:text-[12px]">$100,000 PRODUCTION VALUE IN A SINGLE CLICK.</span>
                </p>
              ) : (
                <p className="text-zinc-200 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/60 p-5 rounded-2xl backdrop-blur-md border-l-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  Engineer Hollywood-grade cinematography. Harness ARRI Alexa lighting, Leica Summilux optics, and Vogue-level editorial aesthetics. 
                  <span className="text-white font-black italic block mt-2 tracking-widest text-[11px] md:text-[12px]">THE ULTIMATE DIRECTOR'S TOOLKIT FOR CINEMATIC PERFECTION.</span>
                </p>
              )}
          </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
        <div className="flex flex-col gap-8">
          
          <div className={`flex flex-col gap-3 transition-all ${isTextModeActive ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
            <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
              <FileImage size={14} /> 1. IMAGE-TO-VIDEO MODE
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${imagePreview ? 'border-solid border-[#FF8C00]/50 p-2' : 'h-48'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={isTextModeActive} />
              {imagePreview ? (
                <div className="relative w-full h-48 group rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Uploaded prep" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={obrisiSliku} className="bg-red-600/90 text-white p-3 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110"><X size={28} strokeWidth={3} /></button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => !isTextModeActive && inputRef.current.click()}>
                  <div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div>
                  <div>
                    <p className="text-white font-bold text-sm">{isTextModeActive ? 'LOCKED (Text Mode)' : 'Drag & Drop your reference image here'}</p>
                    {!isTextModeActive && <p className="text-zinc-500 text-xs mt-1">or click to browse files</p>}
                  </div>
                </div>
              )}
            </div>
            <div className="relative mt-1">
              <input type="text" value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} disabled={isTextModeActive} placeholder="Briefly describe what happens to this image..." className="bg-black/50 border border-white/10 p-4 pr-12 rounded-xl text-[13px] text-white outline-none focus:border-[#FF8C00] transition-all w-full shadow-inner disabled:bg-black/80" />
              {imageDescription && !isTextModeActive && (
                <button onClick={() => setImageDescription('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-all"><X size={16} strokeWidth={3} /></button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className={`font-black text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors ${isImageModeActive ? 'text-zinc-600' : 'text-[#FF8C00]'}`}>
              <Wand2 size={14} /> 2. TEXT-TO-VIDEO VISION
            </label>
            <div className="relative">
              <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} disabled={isImageModeActive} placeholder={isImageModeActive ? "LOCKED: You are using Image-to-Video mode." : "Describe the action..."} className={`bg-black/50 border p-5 pr-12 rounded-2xl text-[14px] text-white outline-none resize-none h-32 transition-all w-full shadow-inner ${isImageModeActive ? 'border-red-900/30 opacity-40 cursor-not-allowed bg-black/80' : 'border-white/10 focus:border-[#FF8C00]'}`} />
              {promptText && !isImageModeActive && (
                <button onClick={() => setPromptText('')} className="absolute right-3 top-4 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-all"><X size={16} strokeWidth={3} /></button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><Clock size={14} /> 3. VIDEO DURATION</label>
            <div className="grid grid-cols-4 gap-2">
              {['3s', '5s', '10s', '15s'].map((sec) => (
                <button key={sec} onClick={() => setDuration(sec)} className={`py-3 rounded-xl font-black text-[12px] transition-all border ${duration === sec ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.2)]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'}`}>{sec}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><MonitorPlay size={14} /> 4. ASPECT RATIO {arLocked && <Lock size={12} className="text-red-500 inline ml-1" title="Locked by Image Dimensions" />}</label>
             <div className="flex gap-2">
                <button onClick={() => !arLocked && setAspectRatio('16:9')} disabled={arLocked && aspectRatio !== '16:9'} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '16:9' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '16:9' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}><MonitorPlay size={16} /> 16:9</button>
                <button onClick={() => !arLocked && setAspectRatio('9:16')} disabled={arLocked && aspectRatio !== '9:16'} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '9:16' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '9:16' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}><Smartphone size={16} /> 9:16</button>
             </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <button onClick={generisiMasterPrompt} disabled={isGenerating || (!promptText && !imageFile)} className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[16px] uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]">
              {isGenerating ? 'COMPILING META-TOKENS...' : 'GENERATE 5 MASTER PROMPTS'} <Settings2 size={20} className={isGenerating ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-16 relative z-10">
          <div className="flex flex-col justify-center">
              <h3 className="text-4xl font-black italic uppercase text-white mb-4">LIFETIME <span className="text-orange-500 font-black">ACCESS</span></h3>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Single purchase. Endless generations. Own the {currentEngine}.</p>
          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border border-blue-500/50 p-10 rounded-[3rem] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 bg-blue-500/20 rounded-3xl border border-blue-400/30"><Diamond className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-bounce" /></div>
                 <div>
                     <span className="text-orange-500 font-black uppercase text-[11px] tracking-[0.3em]">ONE-TIME PURCHASE</span>
                     <h4 className="text-white font-black uppercase text-3xl tracking-tighter">V8 <span className="text-blue-400">PRO</span> LICENSE</h4>
                 </div>
              </div>
              <div className="flex flex-col items-center md:items-end relative z-10">
                  <div className="flex items-end gap-2"><span className="text-white font-black font-mono text-6xl">$149</span></div>
                  <MagneticButton>
                      <button onClick={pokreniKupovinu} className="mt-6 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-yellow-400 hover:text-black transition-all shadow-xl flex items-center gap-2">
                          SECURE CHECKOUT 🍋
                      </button>
                  </MagneticButton>
              </div>
          </div>
      </div>
      <V8EngineCheckoutModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} currentEngine={currentEngine} />
    </div>
  );
};
export default CinematikPromptEngine;