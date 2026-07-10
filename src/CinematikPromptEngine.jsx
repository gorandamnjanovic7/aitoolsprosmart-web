// POČETAK FAJLA: CinematikPromptEngine.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // 🔥 DODATO ZA SEO 🔥
import { Upload, FileImage, Clock, Wand2, MonitorPlay, Smartphone, Video, Settings2, X, Diamond, Lock, DownloadCloud, Zap, ShieldCheck, AlertTriangle, Copy, CheckCircle, RefreshCcw, Crown, ArrowUpCircle, FileText, Trash2, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { db, auth } from './firebase';
import { doc, onSnapshot, increment, serverTimestamp, collection, query, where, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

// POČETAK FUNKCIJE: FullScreenVideoPlayer
const FullScreenVideoPlayer = ({ src, onClose }) => {
  const videoRef = useRef(null);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
      if (src) {
          document.body.style.overflow = 'hidden';
          // 🔥 GA4 ANALITIKA 🔥
          trackV8Action('video_fullscreen', { event_category: 'Engagement' });
      }
      else {
          document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
  }, [src]);

  if (!src) return null;

  const handlePlay = () => {
      if (videoRef.current) {
          videoRef.current.play();
          setIsEnded(false);
          // 🔥 GA4 ANALITIKA 🔥
          trackV8Action('video_replay', { event_category: 'Engagement' });
      }
  };

  return createPortal(
      <div className="fixed inset-0 z-[999999] bg-[#0f172a]/95 flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-red-600 hover:bg-red-500 text-white p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all hover:scale-110">
              <X size={32} strokeWidth={3} />
          </button>
          
          <div className="relative w-full max-w-5xl flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <video 
                  ref={videoRef}
                  src={src} 
                  autoPlay 
                  controls={!isEnded}
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  onEnded={() => setIsEnded(true)}
                  onPlay={() => setIsEnded(false)}
                  className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10" 
              />
              
              {isEnded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl pointer-events-none transition-all">
                      <button onClick={handlePlay} className="bg-white/20 text-white p-6 rounded-full backdrop-blur-md border border-white/50 hover:bg-white/30 transition-all pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:scale-110">
                          <Play size={48} strokeWidth={2} className="ml-2" fill="currentColor" />
                      </button>
                  </div>
              )}
          </div>
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenVideoPlayer

// POČETAK FUNKCIJE: CinematikPromptEngine
const CinematikPromptEngine = ({ initialEngine = "SEEDANCE 2.0", openCheckout }) => {
  const [currentEngine, setCurrentEngine] = useState(initialEngine);

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
  const [generatedPrompts, setGeneratedPrompts] = useState(null); 
  const [copiedIndex, setCopiedIndex] = useState(null);

  const inputRef = useRef(null);
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('NONE');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(null);

  const [payData, setPayData] = useState([]);
  const [vipData, setVipData] = useState({});

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  const [loginRequiredData, setLoginRequiredData] = useState({
    isOpen: false,
    paketName: '',
    fullPrice: 0,
    checkoutTitle: '',
    checkoutPrice: 0
  });

  const [showcase, setShowcase] = useState({ kling: '', seedance: '' });
  const [isUploadingShowcase, setIsUploadingShowcase] = useState({ kling: false, seedance: false });
  const [fullScreenVideo, setFullScreenVideo] = useState(null); 
  const klingRef = useRef(null);
  const seedanceRef = useRef(null);

  const isImageModeActive = !!imageFile || imageDescription.length > 0;
  const isTextModeActive = promptText.length > 0;

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login prekinut:", error);
    }
  };

  const openSecureCheckout = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const engineKeyword = currentEngine.split(" ")[0].toUpperCase();
    const naslovCheckouta = isUpgrade ? `${engineKeyword} - ${paketName.toUpperCase()} (UPGRADE)` : `${engineKeyword} - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);

    return { naslovCheckouta, finalPrice };
  };

  const pokreniKupovinu = async (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const engineKeyword = currentEngine.split(" ")[0].toUpperCase();
    const naslovCheckouta = isUpgrade ? `${engineKeyword} - ${paketName.toUpperCase()} (UPGRADE)` : `${engineKeyword} - ${paketName.toUpperCase()}`;

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("cinematik_checkout_initiated", { 
        engine: engineKeyword,
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: isUpgrade ? "upgrade" : "new" 
    });

    if (!currentUser && !auth.currentUser) {
      setLoginRequiredData({
        isOpen: true,
        paketName,
        fullPrice,
        checkoutTitle: naslovCheckouta,
        checkoutPrice: finalPrice
      });
      return;
    }

    openSecureCheckout(paketName, fullPrice);
  };

  // 🔥 DVOZONSKI RADAR: Sluša SAMO Crypto i PayPal/Card 🔥
  useEffect(() => {
    const unsubShowcase = onSnapshot(doc(db, "v8_settings", "showcase_cinematik"), (docSnap) => {
        if (docSnap.exists()) {
            setShowcase(docSnap.data());
        }
    });

    let unsubCrypto = () => {};
    let unsubPayPal = () => {};
    let unsubVip = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setPayData([]); setVipData({}); setIsCheckingAccess(false); setAmountPaid(0); setCurrentPlan('NONE'); setIsAdmin(false);
        return;
      }
      
      const email = user.email.toLowerCase();
      setIsAdmin(email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com");
      
      let cryptoDocs = [];
      let paypalDocs = [];

      const updateAllPayData = () => {
         setPayData([...cryptoDocs, ...paypalDocs]);
      };

      unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
         cryptoDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
         paypalDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubVip = onSnapshot(doc(db, "vip_users", email), snap => setVipData(snap.exists() ? snap.data() : {}));
    });

    return () => { 
        unsubAuth(); 
        unsubShowcase(); 
        unsubCrypto(); 
        unsubPayPal(); 
        unsubVip(); 
    };
  }, []);

  // PROVERA I PRORAČUN KREDITA SA NOVIM SKENEROM
  useEffect(() => {
    if (!currentUser) { setIsVIP(false); setCredits(0); setAmountPaid(0); setCurrentPlan('NONE'); return; }
    const email = currentUser.email.toLowerCase();
    
    if (isAdmin) {
      setIsVIP(true); setCredits(999999); setAmountPaid(550); setCurrentPlan('ENTERPRISE'); setIsCheckingAccess(false); return;
    }

    let hasAccess = false;
    let calculatedDefaultCredits = 0;
    let maxPaid = 0;
    let highestPlan = 'NONE';
    
    const engineKeyword = currentEngine.split(" ")[0].toUpperCase(); 

    payData.forEach(data => {
      // 🔥 Podržava PLAĆENO (Kripto) i completed_verified (PayPal) 🔥
      if (data.status === "PLAĆENO" || data.status === "completed_verified") {
        const productName = data.productName ? data.productName.toUpperCase() : "";
        
        // Hvata Security Checkout, Master, Bundle, Cinematik, itd.
        if (productName.includes(engineKeyword) || productName.includes("CINEMATIK") || productName.includes("SECURITY CHECKOUT") || productName.includes("BUNDLE") || productName.includes("MASTER")) {
          hasAccess = true;
          if (productName.includes("ENTERPRISE")) { if (maxPaid < 550) { maxPaid = 550; highestPlan = 'ENTERPRISE'; } calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 10000); } 
          else if (productName.includes("PRO")) { if (maxPaid < 250) { maxPaid = 250; highestPlan = 'PRO'; } calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 5000); }
          else { if (maxPaid < 100) { maxPaid = 100; highestPlan = 'STARTER'; } calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 1000); }
        }
      }
    });

    if (vipData[`${engineKeyword} - PRO`] === true) { hasAccess = true; calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 5000); if (maxPaid < 250) maxPaid = 250; highestPlan = 'PRO'; }
    if (vipData[`${engineKeyword} - STARTER`] === true) { hasAccess = true; calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 1000); if (maxPaid < 100) maxPaid = 100; highestPlan = 'STARTER'; }
    if (vipData.unlockedApps && vipData.unlockedApps.includes('FULL_ACCESS')) { hasAccess = true; calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 10000); if (maxPaid < 550) maxPaid = 550; highestPlan = 'ENTERPRISE'; }

    if (hasAccess) {
       setIsVIP(true);
       setAmountPaid(maxPaid);
       setCurrentPlan(highestPlan);
       
       const creditField = `${engineKeyword}_credits`;
       let currentCredits = vipData[creditField] !== undefined ? vipData[creditField] : calculatedDefaultCredits;
       
       const cdField = `${engineKeyword}_cooldown`;
       let cooldownStart = vipData[cdField] ? vipData[cdField].toMillis() : null;

       if (cooldownStart) {
          const now = Date.now();
          if ((now - cooldownStart) >= (24 * 60 * 60 * 1000)) {
             setDoc(doc(db, "vip_users", email), {
                 [creditField]: calculatedDefaultCredits,
                 [cdField]: null
             }, { merge: true });
             currentCredits = calculatedDefaultCredits;
             setCooldownTime(null);
          } else {
             setCooldownTime(cooldownStart + (24 * 60 * 60 * 1000));
          }
       } else {
          setCooldownTime(null);
       }
       setCredits(currentCredits);
    } else {
       setIsVIP(false);
       setCredits(0);
       setAmountPaid(0);
       setCurrentPlan('NONE');
       setCooldownTime(null);
    }
    setIsCheckingAccess(false);
  }, [currentEngine, payData, vipData, currentUser, isAdmin]);

  const handleShowcaseUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingShowcase(prev => ({ ...prev, [type]: true }));
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      await setDoc(doc(db, "v8_settings", "showcase_cinematik"), { [type]: resData.secure_url }, { merge: true });
    } catch (err) { 
      console.error("Greška pri uploadu videa:", err);
      alert("Došlo je do greške pri uploadu. Proveri Cloudinary podešavanja.");
    } finally { 
      setIsUploadingShowcase(prev => ({ ...prev, [type]: false })); 
      e.target.value = null; 
    }
  };

  const deleteShowcaseVideo = async (e, type) => {
    e.stopPropagation();
    if(window.confirm("Obrisati ovaj video?")) {
        await setDoc(doc(db, "v8_settings", "showcase_cinematik"), { [type]: '' }, { merge: true });
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (!isTextModeActive && e.dataTransfer.files && e.dataTransfer.files[0]) ucitajSliku(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (!isTextModeActive && e.target.files && e.target.files[0]) ucitajSliku(e.target.files[0]);
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

  const copyPrompt = (text, index, type) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(`${index}-${type}`);
    setTimeout(() => setCopiedIndex(null), 2000);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("cinematik_prompt_copied", { engine: currentEngine });
  };

  const generisiMasterPrompt = async () => {
    if (!isVIP && !isAdmin) {
        alert("SECURITY BREACH DETECTED: Unauthorized access blocked.");
        return;
    }

    if (credits <= 0 && !isAdmin) {
        alert("ENGINE COOLING: You have 0 prompts left. Please wait for the 24h reset cycle.");
        return;
    }

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("cinematik_generation_started", { 
        engine: currentEngine,
        is_image_mode: isImageModeActive
    });

    setIsGenerating(true);
    setGeneratedPrompts(null); 

    const formData = new FormData();
    formData.append('engine', currentEngine); 
    formData.append('text', isImageModeActive ? imageDescription : promptText);
    formData.append('duration', duration);
    formData.append('aspectRatio', aspectRatio);
    
    if (imageFile) { 
      formData.append('image', imageFile); 
    }

    try {
      const response = await fetch(`${BASE_BACKEND_URL}/api/v8-generate`, {
        method: 'POST', body: formData,
      });
      if (!response.ok) throw new Error("V8 Server Error");
      
      const data = await response.json();
      
      if(data) {
          setGeneratedPrompts(data);
          // 🔥 GA4 ANALITIKA 🔥
          trackV8Action("cinematik_generation_success", { engine: currentEngine });
      }
      
      if (auth.currentUser && !isAdmin) {
          const email = auth.currentUser.email.toLowerCase();
          const docRef = doc(db, "vip_users", email);
          const novaKolicina = credits - 1;
          const engineKeyword = currentEngine.split(" ")[0].toUpperCase();
          const creditField = `${engineKeyword}_credits`;
          const cdField = `${engineKeyword}_cooldown`;
          
          if (novaKolicina <= 0) {
              await setDoc(docRef, { 
                  [creditField]: 0,
                  [cdField]: serverTimestamp() 
              }, { merge: true });
          } else {
              await setDoc(docRef, { 
                  [creditField]: increment(-1) 
              }, { merge: true });
          }
      }
    } catch (error) {
      console.error("V8 Engine failure:", error);
      alert("Greška na serveru, proveri konekciju.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEngineChange = (newEngine) => {
    setCurrentEngine(newEngine);
    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("cinematik_engine_changed", { engine: newEngine });
  };

  const renderPricingPlans = () => {
    if (amountPaid >= 550) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-16 px-4">
           <div className="bg-gradient-to-r from-[#1a0b2e] to-[#050505] border border-purple-500/40 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <Crown className="w-20 h-20 text-purple-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
                ENTERPRISE TIER <span className="text-purple-500">UNLOCKED</span>
              </h2>
              <p className="text-purple-200/60 font-bold uppercase tracking-widest text-[11px] md:text-sm max-w-2xl mx-auto">
                You possess the highest level V8 License. All {currentEngine} protocols are fully operational at maximum capacity.
              </p>
           </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          {currentEngine === "SEEDANCE 2.0" ? (
             <MonitorPlay className="w-12 h-12 text-green-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
          ) : (
             <Video className="w-12 h-12 text-orange-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(234,88,12,0.6)]" />
          )}
          <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."} <span className={currentEngine === "SEEDANCE 2.0" ? "text-green-500 block md:inline mt-2 md:mt-0" : "text-orange-500 block md:inline mt-2 md:mt-0"}>CHOOSE YOUR V8 PLAN.</span>
          </h2>
          
          <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className={`${currentEngine === "SEEDANCE 2.0" ? "text-green-500 border-green-500/20" : "text-orange-500 border-orange-500/20"} font-black uppercase tracking-[0.2em] text-[13px] border-b pb-3 mb-4 flex items-center gap-2`}>
                <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
             </h4>

             {/* 🔥 OBAVEZNA IP-SAFE KLAUZULA DODATA OVDE 🔥 */}
             <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-emerald-400 leading-relaxed">
                   INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP
                </span>
             </div>

             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full z-10 relative">
          
          {amountPaid < 100 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto"><Diamond className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                <span className="text-4xl font-black text-blue-400 my-4 text-center">$100</span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 1,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('STARTER', 100)} className={`w-full bg-zinc-800 text-white ${currentEngine === "SEEDANCE 2.0" ? "hover:bg-green-500" : "hover:bg-orange-500"} py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md`}>
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 250 && (
            <div className={`w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 rounded-[2rem] p-8 flex flex-col relative transition-all transform md:scale-105 z-10 ${currentEngine === "SEEDANCE 2.0" ? "border-green-500/50 hover:border-green-500/80 shadow-[0_0_30px_rgba(34,197,94,0.15)]" : "border-orange-500/50 hover:border-orange-500/80 shadow-[0_0_30px_rgba(234,88,12,0.15)]"}`}>
                <div className={`absolute top-0 left-0 w-full h-2 rounded-t-[1.9rem] ${currentEngine === "SEEDANCE 2.0" ? "bg-gradient-to-r from-green-600 to-emerald-500" : "bg-gradient-to-r from-orange-600 to-amber-500"}`}></div>
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg ${currentEngine === "SEEDANCE 2.0" ? "bg-green-500" : "bg-orange-500"}`}>Bestseller</div>
                
                <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-6 mx-auto mt-2 ${currentEngine === "SEEDANCE 2.0" ? "bg-green-500/10" : "bg-orange-500/10"}`}>
                   <Zap className={`w-6 h-6 ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-orange-500"}`} />
                </div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className={`text-4xl font-black my-4 text-center flex items-center justify-center gap-3 ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-orange-500"}`}>
                   {amountPaid > 0 ? `$${250 - amountPaid}` : "$250"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 5,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 250)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all text-white ${currentEngine === "SEEDANCE 2.0" ? (amountPaid > 0 ? 'bg-gradient-to-r from-green-600 to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_rgba(34,197,94,0.4)]') : (amountPaid > 0 ? 'bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.4)]')}`}>
                   {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
                </button>
            </div>
          )}

          {amountPaid < 550 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-purple-500/30 rounded-[2rem] p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto"><Crown className="w-6 h-6 text-purple-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
                <span className="text-4xl font-black text-purple-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${550 - amountPaid}` : "$550"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 10,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ High-Speed Priority Server</p>
                   <p className="flex items-center gap-2">🔄 Lifetime Access</p>
                </div>
                <button onClick={() => pokreniKupovinu('ENTERPRISE', 550)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-800 text-white hover:bg-purple-500'}`}>
                   {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
                </button>
            </div>
          )}
        </div>

        {amountPaid > 0 && amountPaid < 550 && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-4xl mx-auto mt-12 mb-10 bg-gradient-to-r from-[#0a0a0a]/90 to-[#020617]/90 border ${currentEngine === "SEEDANCE 2.0" ? "border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.25)]" : "border-orange-500/40 shadow-[0_0_40px_rgba(234,88,12,0.25)]"} p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-8 relative overflow-hidden backdrop-blur-md`}>
             <div className={`absolute inset-0 mix-blend-overlay ${currentEngine === "SEEDANCE 2.0" ? "bg-green-500/5" : "bg-orange-500/5"}`}></div>
             <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent ${currentEngine === "SEEDANCE 2.0" ? "via-green-500" : "via-orange-500"} to-transparent opacity-50`}></div>
             
             <div className={`w-16 h-16 rounded-full flex items-center justify-center border relative flex-shrink-0 ${currentEngine === "SEEDANCE 2.0" ? "bg-green-900/40 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.4)]" : "bg-orange-900/40 border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.4)]"}`}>
                <div className={`absolute inset-0 rounded-full border-t-2 animate-spin ${currentEngine === "SEEDANCE 2.0" ? "border-green-400" : "border-orange-400"}`}></div>
                <ArrowUpCircle className={`w-8 h-8 ${currentEngine === "SEEDANCE 2.0" ? "text-green-400" : "text-orange-400"}`} />
             </div>

             <div className="text-center md:text-left relative z-10">
                <div className={`inline-block border px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[9px] mb-3 ${currentEngine === "SEEDANCE 2.0" ? "bg-green-900/50 border-green-500/30 text-green-300" : "bg-orange-900/50 border-orange-500/30 text-orange-300"}`}>
                  SMART UPGRADE SYSTEM ACTIVE
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                  PRORATED UPGRADE POLICY
                </h3>
                <p className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                  System radar has detected your active V8 License valued at <strong className={currentEngine === "SEEDANCE 2.0" ? "text-green-400" : "text-orange-400"}>${amountPaid}</strong>. 
                  You can upgrade to a higher tier by paying <strong className={`text-white border-b pb-0.5 ${currentEngine === "SEEDANCE 2.0" ? "border-green-500/50" : "border-orange-500/50"}`}>ONLY THE PRICE DIFFERENCE</strong>. The package prices displayed above have already been automatically reduced!
                </p>
             </div>
           </motion.div>
        )}
      </div>
    );
  };

  const renderV8Manifest = () => {
      const specifikacije = [
        { t: `1. Visual Prompt Engineering`, d: "Converts ideas into cinematic directives.", insight: `Forces models to focus on lighting, camera movement, and subject interaction rather than basic captioning.` },
        { t: "2. Kinetic Physics", d: "Commands hyper-realistic object physics.", insight: "Uses token weights to prevent floating aesthetics, anchoring generated subjects to environmental gravity." },
        { t: "3. Editorial Aesthetics", d: "Replicates high-end fashion and commercial looks.", insight: "Applies Vogue-level lighting ratios and color grading terms (e.g., split-toning, cinematic teal/orange)." },
        { t: "4. Camera Equipment", d: "Forces exact cinematic gear emulation.", insight: "Instructs AI with terms like 'ARRI Alexa 65' or 'Leica Summilux' to bypass generic digital smoothness." },
        { t: "5. Lighting Vectors", d: "Controls key, fill, and volumetric lighting.", insight: "Prevents flat lighting by enforcing specific light placement and rim-light extraction techniques." },
        { t: "6. Atmosphere & Composition", d: "Captures spatial design and cinematic mood.", insight: "Describes camera angles, weather, motion blur, and foreground/background relationships for perfect framing." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-10 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">PROMPT ENGINE ARCHITECTURE</h2>
            <p className="text-[12px] md:text-[14px] text-orange-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div key={i} onClick={() => {
                  setOtvorenOpis(isOpen ? null : i);
                  if (!isOpen) {
                    // 🔥 GA4 ANALITIKA 🔥
                    trackV8Action('manifest_read', { event_category: 'Engagement', event_label: item.t });
                  }
                }} className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? 'text-orange-400' : 'text-blue-400'}`}>
                        <span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-orange-500' : 'text-blue-600/60'}`}>💎</span> {item.t}
                      </h4>
                      <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p>
                    </div>
                    <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? 'rotate-180 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover:text-blue-400'}`}>▼</div>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 border-orange-500 pl-3"><span className="text-orange-400 font-bold">Tech Insight:</span> {item.insight}</p>
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

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-5xl mx-auto mt-28 relative overflow-hidden">
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>Cinematic Video Prompt Engine | V8 AI Tools</title>
        <meta name="description" content="Generate master-level cinematic video prompts optimized for Seedance and Kling AI models. Command hyper-realistic physics and flawless kinetic motion." />
        <meta name="keywords" content="cinematic video prompts, ai video generation, kling ai prompts, seedance ai prompts, text to video ai" />
      </Helmet>

      <FullScreenVideoPlayer src={fullScreenVideo} onClose={() => setFullScreenVideo(null)} />

      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData({
          isOpen: false,
          paketName: '',
          fullPrice: 0,
          checkoutTitle: '',
          checkoutPrice: 0
        })}
        packageName={loginRequiredData.checkoutTitle}
        price={loginRequiredData.checkoutPrice}
        onLoginSuccess={() => {
          if (loginRequiredData.paketName) {
            openSecureCheckout(loginRequiredData.paketName, loginRequiredData.fullPrice);
          }
          setLoginRequiredData({
            isOpen: false,
            paketName: '',
            fullPrice: 0,
            checkoutTitle: '',
            checkoutPrice: 0
          });
        }}
      />

      <AnimatePresence>
        {isCheckoutOpen && (
          <V8SecureCheckout 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            productName={checkoutProduct} 
            price={checkoutPrice} 
          />
        )}
      </AnimatePresence>

      {/* 🔥 ADMIN BROJAČ SA BOJAMA KOJE PRATE TAB (Zelena/Narandžasta) 🔥 */}
      {(isVIP || isAdmin) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
           <motion.div 
              initial={{ y: -20, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              className={`bg-black/80 backdrop-blur-xl border px-6 py-2 rounded-full shadow-lg flex items-center gap-4 ${currentEngine === "SEEDANCE 2.0" ? "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]" : "border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.3)]"}`}
           >
              <Zap className={`w-4 h-4 animate-pulse ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-orange-500"}`} />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 opacity-60 leading-none">V8 PROMPTS</span>
                 
                 {isAdmin ? (
                   <span className="text-[15px] font-black tracking-widest leading-none mt-1 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                      MASTER ADMIN : ∞
                   </span>
                 ) : (
                   <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>
                     {credits} AVAIL.
                   </span>
                 )}
              </div>
           </motion.div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8 relative z-20 mt-8">
          <button 
              onClick={() => handleEngineChange("SEEDANCE 2.0")}
              className={`px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${currentEngine === "SEEDANCE 2.0" ? 'bg-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-[#0a0a0a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'}`}
          >
              <MonitorPlay size={16} /> SEEDANCE 2.0
          </button>
          
          <button 
              onClick={() => handleEngineChange("KLING 3.0")}
              className={`px-8 py-3.5 rounded-full font-black text-[11px] tracking-widest uppercase transition-all flex items-center gap-2 ${currentEngine !== "SEEDANCE 2.0" ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-[#0a0a0a] border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'}`}
          >
              <Video size={16} /> KLING 3.0
          </button>
      </div>

      <motion.div 
          key={currentEngine}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 transition-shadow duration-500 ${currentEngine === "SEEDANCE 2.0" ? "shadow-[0_0_50px_rgba(34,197,94,0.15)]" : "shadow-[0_0_50px_rgba(255,140,0,0.15)]"}`}
      >
          <video 
              key={`bg-${currentEngine}`}
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none"
          >
              <source 
                src={currentEngine === "SEEDANCE 2.0" ? "/seedance.mp4" : "/kling.mp4"} 
                type="video/mp4" 
              />
          </video>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className={`inline-block border px-5 py-2 rounded-full font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse backdrop-blur-sm ${currentEngine === "SEEDANCE 2.0" ? "bg-green-600/10 border-green-500/30 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : "bg-orange-600/10 border-orange-500/30 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.2)]"}`}>
                V8 CORE // CINEMATIC GENERATOR
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
                {currentEngine !== "SEEDANCE 2.0" ? <Video className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" /> : <MonitorPlay className="text-green-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />}
                {currentEngine} 
                <span className={`text-xl md:text-3xl font-black not-italic tracking-widest ml-2 px-4 py-1 rounded-full flex items-center border ${currentEngine !== "SEEDANCE 2.0" ? "text-[#FF8C00] drop-shadow-[0_0_15px_rgba(255,140,0,0.6)] border-[#FF8C00]/30 bg-[#FF8C00]/10" : "text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)] border-green-500/30 bg-green-500/10"}`}>
                   // OPTIMIZED FOR FREEPIK
                </span>
              </h1>
              
              {currentEngine !== "SEEDANCE 2.0" ? (
                <p className="text-zinc-200 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/60 p-5 rounded-2xl backdrop-blur-md border-l-2 border-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.15)]">
                  Command hyper-realistic physics and flawless kinetic motion. Inject secret meta-tokens to generate CGI-rivaling masterpieces. 
                  <span className="text-white font-black italic block mt-3 tracking-widest text-[11px] md:text-[12px]">
                    $100,000 PRODUCTION VALUE IN A SINGLE CLICK. <br/>
                    <span className="text-orange-400 not-italic text-[13px] md:text-[15px] drop-shadow-[0_0_8px_rgba(234,88,12,0.8)] mt-1 block">OPTIMIZED FOR FREEPIK STOCK.</span>
                  </span>
                </p>
              ) : (
                <p className="text-zinc-200 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[11px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/60 p-5 rounded-2xl backdrop-blur-md border-l-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                  Engineer Hollywood-grade cinematography. Harness ARRI Alexa lighting, Leica Summilux optics, and Vogue-level editorial aesthetics. 
                  <span className="text-white font-black italic block mt-3 tracking-widest text-[11px] md:text-[12px]">
                    THE ULTIMATE DIRECTOR'S TOOLKIT FOR CINEMATIC PERFECTION. <br/>
                    <span className="text-green-400 not-italic text-[13px] md:text-[15px] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] mt-1 block">OPTIMIZED FOR FREEPIK STOCK.</span>
                  </span>
                </p>
              )}

              {!isVIP && !isCheckingAccess && (
                 <div className="mt-12 relative z-20 w-full">{renderPricingPlans()}</div>
              )}
          </div>
      </motion.div>

      {/* 🔥 CINEMATIC CAPABILITY PROOF BOKSOVI 🔥 */}
      <div className="w-full max-w-5xl mx-auto mb-16 relative z-10">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">CINEMATIC CAPABILITY PROOF</h2>
            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2">V8 Core Engine Outputs</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center mb-10">
            {/* SEEDANCE 9:16 (VERTIKALNI) */}
            <div className="bg-black/50 border border-green-500/30 rounded-2xl p-4 flex flex-col items-center justify-center aspect-[9/16] w-full max-w-[320px] mx-auto relative overflow-hidden group shadow-[0_0_20px_rgba(34,197,94,0.05)] cursor-pointer hover:border-green-400 transition-colors" onClick={() => setFullScreenVideo(showcase.seedance)}>
               <span className="absolute top-4 left-4 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">SEEDANCE (9:16)</span>
               
               {showcase.seedance ? (
                 <>
                   <video src={showcase.seedance} autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 rounded-xl border border-green-500/30 pointer-events-none" />
                   {isAdmin && (
                     <button onClick={(e) => { e.stopPropagation(); deleteShowcaseVideo(e, 'seedance'); }} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); seedanceRef.current.click(); }}>
                      <Upload className="w-10 h-10 text-green-500/50 mb-2" />
                      <span className="text-[11px] font-bold text-green-500/50 uppercase tracking-widest text-center">{isUploadingShowcase.seedance ? "UPLOADING..." : "UPLOAD SEEDANCE VIDEO\n(9:16)"}</span>
                      <input type="file" accept="video/*" ref={seedanceRef} className="hidden" onChange={(e) => handleShowcaseUpload(e, 'seedance')} />
                   </div>
                 ) : (
                   <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Video Unavailable</span>
                 )
               )}
            </div>

            {/* KLING 16:9 (HORIZONTALNI) */}
            <div className="bg-black/50 border border-orange-500/30 rounded-2xl p-4 flex flex-col items-center justify-center aspect-video w-full relative overflow-hidden group shadow-[0_0_20px_rgba(234,88,12,0.05)] cursor-pointer hover:border-orange-400 transition-colors" onClick={() => setFullScreenVideo(showcase.kling)}>
               <span className="absolute top-4 left-4 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">KLING (16:9)</span>
               
               {showcase.kling ? (
                 <>
                   <video src={showcase.kling} autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 rounded-xl border border-orange-500/30 pointer-events-none" />
                   {isAdmin && (
                     <button onClick={(e) => { e.stopPropagation(); deleteShowcaseVideo(e, 'kling'); }} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); klingRef.current.click(); }}>
                      <Upload className="w-10 h-10 text-orange-500/50 mb-2" />
                      <span className="text-[11px] font-bold text-orange-500/50 uppercase tracking-widest text-center">{isUploadingShowcase.kling ? "UPLOADING..." : "UPLOAD KLING VIDEO\n(16:9)"}</span>
                      <input type="file" accept="video/*" ref={klingRef} className="hidden" onChange={(e) => handleShowcaseUpload(e, 'kling')} />
                   </div>
                 ) : (
                   <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Video Unavailable</span>
                 )
               )}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center justify-center">
            
            {/* NOVI SEEDANCE VERTIKALNI */}
            <div className="bg-black/50 border border-green-500/30 rounded-2xl p-4 flex flex-col items-center justify-center aspect-[9/16] w-full max-w-[320px] mx-auto relative overflow-hidden group shadow-[0_0_20px_rgba(34,197,94,0.05)] cursor-pointer hover:border-green-400 transition-colors" onClick={() => setFullScreenVideo("/V8_AI_Cinematic_Transformation.mp4")}>
               <span className="absolute top-4 left-4 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">SEEDANCE (9:16)</span>
               <video src="/V8_AI_Cinematic_Transformation.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 rounded-xl border border-green-500/30 pointer-events-none" />
            </div>

            {/* NOVI KLING VERTIKALNI */}
            <div className="bg-black/50 border border-orange-500/30 rounded-2xl p-4 flex flex-col items-center justify-center aspect-[9/16] w-full max-w-[320px] mx-auto relative overflow-hidden group shadow-[0_0_20px_rgba(234,88,12,0.05)] cursor-pointer hover:border-orange-400 transition-colors" onClick={() => setFullScreenVideo("/v8_pretorian.mp4")}>
               <span className="absolute top-4 left-4 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">KLING (9:16)</span>
               <video src="/v8_pretorian.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover relative z-10 rounded-xl border border-orange-500/30 pointer-events-none" />
            </div>

         </div>
      </div>

      {renderV8Manifest()}

      <div className={`transition-all duration-500 ${!isVIP && !isAdmin ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        
        {/* 🔥 Prikazujemo COOLDOWN obaveštenje samo ako nema kredita i prošlo je manje od 24h 🔥 */}
        {cooldownTime && !isAdmin && (
          <div className="mb-10 bg-red-950/40 border border-red-500/50 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
             <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
             <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
             <h4 className="text-red-400 font-black uppercase text-[16px] tracking-widest relative z-10 mb-2">V8 ENGINE COOLING PROTOCOL ACTIVE</h4>
             <p className="text-zinc-300 text-[12px] font-bold tracking-widest relative z-10">
                You have exhausted your prompts. The system will auto-refill your quota exactly 24 hours after your last generation.
             </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
          <div className="flex flex-col gap-8">
            
            <div className={`flex flex-col gap-3 transition-all ${isTextModeActive ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
              <label className={`font-black text-[11px] tracking-widest uppercase flex items-center gap-2 ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-[#FF8C00]"}`}>
                <FileImage size={14} /> 1. IMAGE-TO-VIDEO MODE
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? (currentEngine === "SEEDANCE 2.0" ? 'border-green-500 bg-green-500/10' : 'border-[#FF8C00] bg-[#FF8C00]/10') : 'border-white/20 bg-black/50 hover:border-white/40'} ${imagePreview ? (currentEngine === "SEEDANCE 2.0" ? 'border-solid border-green-500/50 p-2' : 'border-solid border-[#FF8C00]/50 p-2') : 'h-48'}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              >
                <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={!isVIP || isTextModeActive} />
                {imagePreview ? (
                  <div className="relative w-full h-48 group rounded-xl overflow-hidden">
                    <img src={imagePreview} alt="Uploaded prep" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={obrisiSliku} className="bg-red-600/90 text-white p-3 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110"><X size={28} strokeWidth={3} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => (isVIP || isAdmin) && !isTextModeActive && inputRef.current.click()}>
                    <div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div>
                    <div><p className="text-white font-bold text-sm">{isTextModeActive ? 'LOCKED (Text Mode)' : 'Drag & Drop your reference image here'}</p><p className="text-zinc-500 text-xs mt-1">or click to browse files</p></div>
                  </div>
                )}
              </div>
              <div className="relative mt-1">
                <input type="text" value={imageDescription} onChange={(e) => setImageDescription(e.target.value)} disabled={(!isVIP && !isAdmin) || isTextModeActive} placeholder="Briefly describe what happens to this image..." className={`bg-black/50 border border-white/10 p-4 pr-12 rounded-xl text-[13px] text-white outline-none transition-all w-full shadow-inner disabled:bg-black/80 disabled:cursor-not-allowed ${currentEngine === "SEEDANCE 2.0" ? "focus:border-green-500" : "focus:border-[#FF8C00]"}`} />
                {imageDescription && !isTextModeActive && (
                  <button onClick={() => setImageDescription('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-all"><X size={16} strokeWidth={3} /></button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-zinc-600 font-black text-[10px] uppercase tracking-widest">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex flex-col gap-3">
              <label className={`font-black text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors ${isImageModeActive ? 'text-zinc-600' : (currentEngine === "SEEDANCE 2.0" ? 'text-green-500' : 'text-[#FF8C00]')}`}>
                <Wand2 size={14} /> 2. TEXT-TO-VIDEO VISION
              </label>
              <div className="relative">
                <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} disabled={(!isVIP && !isAdmin) || isImageModeActive} placeholder={isImageModeActive ? "LOCKED: You are using Image-to-Video mode." : "Describe the action..."} className={`bg-black/50 border p-5 pr-12 rounded-2xl text-[14px] text-white outline-none resize-none h-32 transition-all w-full shadow-inner ${(!isVIP && !isAdmin) || isImageModeActive ? 'border-red-900/30 opacity-40 cursor-not-allowed bg-black/80' : `border-white/10 ${currentEngine === "SEEDANCE 2.0" ? "focus:border-green-500" : "focus:border-[#FF8C00]"}`}`} />
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
                  <button key={sec} onClick={() => setDuration(sec)} disabled={!isVIP && !isAdmin} className={`py-3 rounded-xl font-black text-[12px] transition-all border ${duration === sec ? (currentEngine === "SEEDANCE 2.0" ? 'bg-green-500/20 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.2)]') : 'bg-black border-white/10 text-zinc-500 hover:border-white/30 hover:text-white disabled:cursor-not-allowed'}`}>{sec}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
               <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><MonitorPlay size={14} /> 4. ASPECT RATIO {arLocked && <Lock size={12} className="text-red-500 inline ml-1" title="Locked by Image Dimensions" />}</label>
               <div className="flex gap-2">
                  <button onClick={() => !arLocked && setAspectRatio('16:9')} disabled={(!isVIP && !isAdmin) || (arLocked && aspectRatio !== '16:9')} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '16:9' ? (currentEngine === "SEEDANCE 2.0" ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]') : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '16:9' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}><MonitorPlay size={16} /> 16:9</button>
                  <button onClick={() => !arLocked && setAspectRatio('9:16')} disabled={(!isVIP && !isAdmin) || (arLocked && aspectRatio !== '9:16')} className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '9:16' ? (currentEngine === "SEEDANCE 2.0" ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]') : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '9:16' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}><Smartphone size={16} /> 9:16</button>
               </div>
            </div>

            <div className="mt-auto pt-8 border-t border-white/10">
              <button 
                onClick={generisiMasterPrompt} 
                disabled={(!isVIP && !isAdmin) || isGenerating || (!promptText && !imageFile) || (!isAdmin && credits <= 0)} 
                className={`w-full font-black text-[16px] uppercase tracking-widest py-5 rounded-2xl transition-all flex items-center justify-center gap-3 ${(!isVIP && !isAdmin) || (!isAdmin && credits <= 0) ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' : (currentEngine === "SEEDANCE 2.0" ? 'bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 text-white shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(234,88,12,0.3)]')} hover:scale-[1.02] disabled:opacity-50`}
              >
                {isGenerating ? 'COMPILING META-TOKENS...' : (!isVIP && !isAdmin) || (!isAdmin && credits <= 0) ? 'ACCESS DENIED / COOLING' : 'GENERATE 5 MASTER PROMPTS'} <Settings2 size={20} className={isGenerating ? "animate-spin" : ""} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {generatedPrompts && generatedPrompts.prompts && generatedPrompts.prompts.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="mt-16 border-t border-white/10 pt-16"
            >
              <div className="flex items-center gap-4 mb-10 justify-center">
                  <Wand2 className={`w-8 h-8 ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-orange-500"}`} />
                  <h2 className="text-3xl font-black uppercase tracking-widest text-white text-center">GENERATED MASTER PROMPTS</h2>
              </div>
              
              <div className="space-y-8">
                {generatedPrompts.prompts.map((item, idx) => (
                  <div key={idx} className="bg-black/60 border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className={`absolute top-0 left-0 w-1 h-full ${currentEngine === "SEEDANCE 2.0" ? "bg-gradient-to-b from-green-500 to-emerald-400" : "bg-gradient-to-b from-orange-500 to-amber-400"}`}></div>
                    
                    <h4 className={`font-black tracking-widest text-sm mb-6 flex items-center gap-2 ${currentEngine === "SEEDANCE 2.0" ? "text-green-500" : "text-orange-500"}`}>
                        <Diamond className="w-4 h-4" /> VARIATION {item.number}
                    </h4>

                    <div>
                      <div className="flex justify-between items-center mb-3">
                          <span className="text-zinc-400 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2"><MonitorPlay size={14}/> MERGED CINEMATIC PROMPT:</span>
                          <button 
                            onClick={() => copyPrompt(item.prompt, idx, 'prompt')} 
                            className={`hover:text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-inner ${currentEngine === "SEEDANCE 2.0" ? "text-green-400 bg-green-500/10 hover:bg-green-500/20" : "text-orange-400 bg-orange-500/10 hover:bg-orange-500/20"}`}
                          >
                             {copiedIndex === `${idx}-prompt` ? <CheckCircle size={14} className="text-emerald-400"/> : <Copy size={14}/>} 
                             {copiedIndex === `${idx}-prompt` ? 'COPIED!' : 'COPY PROMPT'}
                          </button>
                      </div>
                      <div className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed bg-white/5 border border-white/5 p-5 md:p-6 rounded-2xl font-mono shadow-inner">
                        {item.prompt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default CinematikPromptEngine;
// KRAJ FAJLA: CinematikPromptEngine.jsx