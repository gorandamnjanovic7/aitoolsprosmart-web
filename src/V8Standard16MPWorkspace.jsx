// POČETAK FAJLA: V8Standard16MPWorkspace.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // 🔥 SEO ENGINE 🔥
import { Upload, Images, ShieldCheck, RefreshCcw, Diamond, Crown, Zap, DownloadCloud, X, ArrowUpCircle, Layers, Archive, Download, Trash2, Eye, FileText, Cpu, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, increment, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

const BACKEND_ROUTES = {
  PAID_16MP: '/api/v8-optimize',
  TRIAL_16MP: '/api/v8-16mp-trial-process'
};

// POČETAK FUNKCIJE: FullScreenLightbox
const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
      if (imageUrl) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
      return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
      <div className="fixed inset-0 z-[999999] bg-[#0f172a]/95 flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FF8C00] text-white p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(255,140,0,0.5)] hover:bg-[#FF8C00]/80 transition-all"><X size={32} strokeWidth={3} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.4)] border border-[#FF8C00]/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox

const V8Standard16MPWorkspace = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle'); 
  const [dragActive, setDragActive] = useState(false);
  const [batchError, setBatchError] = useState(null);
  const [activeLog, setActiveLog] = useState(0);
  
  const [zipUrl, setZipUrl] = useState(null);
  
  const [userEmail, setUserEmail] = useState(null); 
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [isTrial, setIsTrial] = useState(false);
  const [credits, setCredits] = useState(0); 

  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [showcase, setShowcase] = useState({ before: '', after: '' });
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  const [isUploadingShowcase, setIsUploadingShowcase] = useState({ before: false, after: false });
  const beforeImgRef = useRef(null);
  const afterImgRef = useRef(null);

  const inputRef = useRef(null);
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  const [payData, setPayData] = useState([]);
  const [vipData, setVipData] = useState({});
  const [trialData, setTrialData] = useState(null);

  useEffect(() => {
    return () => {
      if (zipUrl) window.URL.revokeObjectURL(zipUrl);
    };
  }, [zipUrl]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  const v8Logs = [
    "🚀 VISIONARY FACTORY V9 | IGNITING 16MP ENGINE...",
    "💎 1. 16MP upscale initiated",
    "💎 2. Blocking mixed aspect-ratio batches",
    "💎 3. Mild color + contrast enhancement",
    "💎 4. Applying highlight rolloff",
    "💎 5. PRODUCT AD POLISH active",
    "💎 6. Anti-plastic subtle film grain",
    "💎 7. 30MB–40MB JPG targeting",
    "💎 8. JPG export in progress",
    "💎 9. Compiling ZIP package",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  const openCheckoutForPackage = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade
      ? `16MP Upscale - ${paketName.toUpperCase()} (UPGRADE)`
      : `16MP Upscale - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };

  const prepareCheckoutPackage = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade
      ? `16MP Upscale - ${paketName.toUpperCase()} (UPGRADE)`
      : `16MP Upscale - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
  };

  const pokreniKupovinu = (paketName, fullPrice) => {
    const userNow = auth.currentUser;
    const finalPrice = (fullPrice - amountPaid) > 0 ? (fullPrice - amountPaid) : fullPrice;

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("16mp_checkout_initiated", { 
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: amountPaid > 0 ? "upgrade" : "new" 
    });

    if (!userEmail && !userNow) {
      prepareCheckoutPackage(paketName, fullPrice);
      setIsLoginRequiredOpen(true);
      return;
    }

    openCheckoutForPackage(paketName, fullPrice);
  };

  useEffect(() => {
    const unsubShowcase = onSnapshot(doc(db, "v8_settings", "showcase_16mp"), (docSnap) => {
        if (docSnap.exists()) setShowcase(docSnap.data());
    });

    let unsubCrypto = () => {};
    let unsubPayPal = () => {};
    let unsubTrial = () => {};
    let unsubVip = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserEmail(null); setIsVIP(false); setIsAdmin(false); setCredits(0); setAmountPaid(0); setCurrentPlan('NONE'); setIsCheckingAccess(false); setIsTrial(false);
        setPayData([]); setVipData({}); setTrialData(null);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);
      const adminCheck = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";
      setIsAdmin(adminCheck);

      unsubTrial = onSnapshot(doc(db, "v8_users", user.uid), snap => {
          setTrialData(snap.exists() ? snap.data() : null);
      });

      let cryptoDocs = [];
      let paypalDocs = [];
      const updateAllPayData = () => setPayData([...cryptoDocs, ...paypalDocs]);

      unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
         cryptoDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
         paypalDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubVip = onSnapshot(doc(db, "vip_users", email), snap => {
         setVipData(snap.exists() ? snap.data() : {});
      });
    });

    return () => {
        unsubscribeAuth(); unsubShowcase(); unsubCrypto(); unsubPayPal(); unsubTrial(); unsubVip();
    };
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    if (isAdmin) {
      setIsVIP(true); setCredits(999999); setAmountPaid(550); setCurrentPlan('ENTERPRISE'); setIsCheckingAccess(false); setIsTrial(false);
      return;
    }

    let hasAccess = false; let maxPaid = 0; let highestPlan = 'NONE';
    
    payData.forEach(data => {
      if (data.status === "PLAĆENO" || data.status === "completed_verified") {
        const productName = data.productName ? data.productName.toUpperCase() : "";
        if (productName.includes("V8") || productName.includes("16MP") || productName.includes("SECURITY CHECKOUT")) {
          hasAccess = true;
          if (productName.includes("ENTERPRISE")) { if (maxPaid < 550) { maxPaid = 550; highestPlan = 'ENTERPRISE'; } } 
          else if (productName.includes("PRO")) { if (maxPaid < 250) { maxPaid = 250; highestPlan = 'PRO'; } } 
          else { if (maxPaid < 150) { maxPaid = 150; highestPlan = 'STARTER'; } }
        }
      }
    });

    if (hasAccess) { 
       setIsVIP(true); setAmountPaid(maxPaid); setCurrentPlan(highestPlan); setIsTrial(false); 
       if(vipData.optimizerCredits !== undefined) setCredits(vipData.optimizerCredits);
    } else { 
       setIsVIP(false); setAmountPaid(0); setCurrentPlan('NONE'); 
       if (trialData && trialData.credits_16mp > 0) { setIsTrial(true); setCredits(trialData.credits_16mp); } 
       else { setIsTrial(false); setCredits(0); }
    }
    setIsCheckingAccess(false);
  }, [payData, vipData, trialData, userEmail, isAdmin]);

  const handleShowcaseUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingShowcase(prev => ({ ...prev, [type]: true }));
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      await setDoc(doc(db, "v8_settings", "showcase_16mp"), { [type]: resData.secure_url }, { merge: true });
    } catch (err) { alert("Došlo je do greške pri uploadu."); } 
    finally { setIsUploadingShowcase(prev => ({ ...prev, [type]: false })); e.target.value = null; }
  };

  const deleteShowcaseImage = async (e, type) => {
    e.stopPropagation();
    if(window.confirm("Obrisati ovu sliku?")) await setDoc(doc(db, "v8_settings", "showcase_16mp"), { [type]: '' }, { merge: true });
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) ucitajSlike(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) ucitajSlike(e.target.files);
  };

  const getAspectCategory = (width, height) => {
    const ratio = width / height;
    if (Math.abs(ratio - (16 / 9)) < 0.08) return "16:9";
    if (Math.abs(ratio - (21 / 9)) < 0.08) return "21:9";
    if (Math.abs(ratio - (9 / 16)) < 0.08) return "9:16";
    if (Math.abs(ratio - 1.0) < 0.05) return "1:1";
    return "OTHER";
  };

  const readImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const ucitajSlike = async (selectedFiles) => {
    const noveSlike = Array.from(selectedFiles);
    if (noveSlike.length === 0) return;
    let prvaSlikaZaPoredjenje = files.length > 0 ? files[0] : noveSlike[0];

    try {
      const prvaDimenzije = await readImageDimensions(prvaSlikaZaPoredjenje);
      const referentniFormat = getAspectCategory(prvaDimenzije.width, prvaDimenzije.height);
      if (referentniFormat === "OTHER") {
         alert(`Prva slika ima nepodržan format (nije 16:9, 9:16, 21:9 ni 1:1).`);
         if (inputRef.current) inputRef.current.value = "";
         return;
      }
      const filtriraneSlike = []; let odbijenoZbogFormata = false;
      for (let file of noveSlike) {
         try {
           const dim = await readImageDimensions(file);
           if (getAspectCategory(dim.width, dim.height) === referentniFormat) filtriraneSlike.push(file); 
           else odbijenoZbogFormata = true; 
         } catch (e) {}
      }
      if (odbijenoZbogFormata) alert(`Pokušali ste da ubacite slike različitog formata! Dozvoljen je samo ${referentniFormat}.`);
      let kombinovaneSlike = [...files, ...filtriraneSlike];
      if (kombinovaneSlike.length > 10) { alert("Maksimalno 10 slika po batch-u."); kombinovaneSlike = kombinovaneSlike.slice(0, 10); }
      setFiles(kombinovaneSlike);
      setDownloadStatus('idle'); setZipUrl(null); setBatchError(null); setActiveLog(0);
      if (inputRef.current) inputRef.current.value = "";
    } catch (e) { return; }
  };

  const obrisiSlike = (e) => {
    if(e) { e.preventDefault(); e.stopPropagation(); }
    setFiles([]); setDownloadStatus('idle'); setZipUrl(null); setBatchError(null); setActiveLog(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const downloadZipFile = () => {
    if (!zipUrl) return;
    const a = document.createElement('a'); a.href = zipUrl;
    a.download = `${(isVIP && !isAdmin) ? 'V8_16MP_PAID_BATCH' : 'V8_16MP_TRIAL_BATCH'}_${Date.now()}.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("16mp_zip_downloaded", { count: files.length });
  };

  const handleUpscaleAndDownload = async () => {
    if (!files || files.length === 0) return;
    if (credits < files.length && !isAdmin) { alert(`NEMATE DOVOLJNO KREDITA!`); return; }
    if (zipUrl) window.URL.revokeObjectURL(zipUrl);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("16mp_processing_started", { 
        count: files.length, 
        is_paid: isVIP && !isAdmin 
    });

    setIsProcessing(true); setDownloadStatus('processing'); setActiveLog(0); setZipUrl(null); setBatchError(null);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
    const backendRoute = (isVIP && !isAdmin) ? BACKEND_ROUTES.PAID_16MP : BACKEND_ROUTES.TRIAL_16MP;

    let progressInterval = setInterval(() => { setActiveLog(prev => prev < v8Logs.length - 1 ? prev + 1 : prev); }, 800);

    try {
      const response = await fetch(`${BASE_BACKEND_URL}${backendRoute}`, { 
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData 
      });
      if (!response.ok) throw new Error("Processing failed.");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setZipUrl(url); setActiveLog(v8Logs.length); setDownloadStatus('success');

      if (auth.currentUser && !isAdmin) {
        const novaKolicina = credits - files.length;
        const docRef = isVIP ? doc(db, "vip_users", userEmail) : doc(db, "v8_users", auth.currentUser.uid);
        const updateField = isVIP ? { optimizerCredits: novaKolicina < 0 ? 0 : increment(-files.length) } : { credits_16mp: novaKolicina < 0 ? 0 : increment(-files.length) };
        await updateDoc(docRef, updateField);
      }
    } catch (error) {
      setBatchError(error.message); setDownloadStatus('error'); setActiveLog(0);
    } finally {
      clearInterval(progressInterval); setIsProcessing(false);
    }
  };

  const renderV8Manifest = () => {
      const specifikacije = [
        { t: "1. 16MP Upscale Engine", d: "Upscales images to an exact 16MP threshold.", insight: "Utilizes advanced LANCZOS resampling to perfectly hit 16MP target while maintaining structural integrity." },
        { t: "2. Omni-Format Support", d: "Processes 16:9, 21:9, 9:16, and 1:1 formats.", insight: "The engine dynamically calculates perfect target dimensions for the 16MP output." },
        { t: "3. Format Validation Safety", d: "Blocks mixed aspect-ratio batches.", insight: "Scans batch for ratio consistency before processing." },
        { t: "4. Color & Contrast Boost", d: "Mild color and contrast enhancement.", insight: "Applies 1.05x color enhancement pass via ImageEnhance." },
        { t: "5. Highlight Rolloff", d: "Protects overexposed areas and blown-out whites.", insight: "Applies custom NumPy thresholding at 232 brightness levels." },
        { t: "6. Product AD Polish", d: "Final contrast pass for commercial impact.", insight: "Adds micro-contrast enhancement post-rolloff for richness." },
        { t: "7. Anti-Plastic Film Grain", d: "Subtle organic noise generation.", insight: "Direct pixel-array injection of Gaussian noise (sigma=1.8)." },
        { t: "8. Automated ZIP Compilation", d: "Generates archive with TXT log.", insight: "Bundles processed files with a full metric report." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-12 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10"><h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">BATCH PROCESSOR ENGINE</h2><p className="text-[12px] md:text-[14px] text-orange-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications V9.0</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div key={i} onClick={() => setOtvorenOpis(isOpen ? null : i)} className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <div><h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? 'text-orange-400' : 'text-blue-400'}`}><span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-orange-500' : 'text-blue-600/60'}`}>💎</span> {item.t}</h4><p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p></div>
                    <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? 'rotate-180 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover:text-blue-400'}`}>▼</div>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><div className="overflow-hidden"><div className="pt-4 border-t border-white/10"><p className="text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 border-orange-500 pl-3"><span className="text-orange-400 font-bold">Tech Insight:</span> {item.insight}</p></div></div></div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-6xl mx-auto mt-28 relative">
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>16MP AI Workspace | Standard Production Assets</title>
        <meta name="description" content="Upscale your AI generated images to 16MP Standard Production format. Enhance contrast, apply realistic film grain, and export perfect production-ready JPGs." />
        <meta name="keywords" content="16mp ai upscale, standard production ai, image enhancer, high-end ai upscaling, commercial ai assets" />
      </Helmet>

      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      <LoginRequiredModal isOpen={isLoginRequiredOpen} onClose={() => setIsLoginRequiredOpen(false)} packageName={checkoutProduct} price={checkoutPrice} onLoginSuccess={(user) => { if (user?.email) setUserEmail(user.email.toLowerCase()); setIsCheckoutOpen(true); }} />

      <AnimatePresence>{isCheckoutOpen && ( <V8SecureCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} productName={checkoutProduct} price={checkoutPrice} /> )}</AnimatePresence>

      {(isVIP || isTrial || isAdmin) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
           <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/80 backdrop-blur-xl border border-orange-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-4">
              <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">16MP {(!isVIP && !isAdmin) ? 'TRIAL ' : ''}CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${(credits > 10 || isAdmin) ? 'text-emerald-400' : 'text-red-500'}`}>{isAdmin ? '∞ MAX' : `${credits} AVAIL.`}</span>
              </div>
           </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.15)]">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none"><source src="/v8-supercompute-bg.mp4" type="video/mp4" /></video>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">V8 CINEMATIC PROTOCOL // 16MP ENGINE</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap"><Images className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" /> 16MP <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">STUDIO-GRADE UPSCALE</span></h1>
              <div className="bg-[#050505]/80 backdrop-blur-md border border-orange-500/20 p-8 rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8"><h4 className="text-white font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">The Protocol Explained:</h4><p className="text-zinc-300 text-[13px] leading-relaxed mb-4">Industrial-grade resolution multiplier using LANCZOS resampling to perfectly hit 16,000,000 pixels while maintaining structural integrity.</p><p className="text-zinc-300 text-[13px] leading-relaxed">Achieves perfect clarity for premium client presentations with zero AI plastic artifacts.</p></div>
              {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (<div className="mt-12 relative z-20 w-full">{renderPricingPlans()}</div>)}
          </div>
      </motion.div>

      {renderV8Manifest()}

      <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto mb-16 relative z-10">
        <a href="/V8_16MP_Technical_Manifest.pdf" download onClick={() => trackV8Action("download_16mp_manifest")} className="flex-1 bg-black/40 border border-blue-500/30 hover:border-blue-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-blue-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]">
            <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 transition-all"><Download className="w-8 h-8 text-blue-400" /></div>
            <div className="text-left"><h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Technical Manifest</h4><p className="text-zinc-400 text-[11px] font-bold">Download V9 Specs (PDF)</p></div>
        </a>
        <a href="/V8_Commercial_License.pdf" download onClick={() => trackV8Action("download_16mp_license")} className="flex-1 bg-black/40 border border-orange-500/30 hover:border-orange-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-orange-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
            <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-all"><FileText className="w-8 h-8 text-orange-400" /></div>
            <div className="text-left"><h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Commercial License</h4><p className="text-zinc-400 text-[11px] font-bold">Download Legal Terms (PDF)</p></div>
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-16 relative z-10">
         <div className="text-center mb-8"><h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">VISUAL INTEGRITY PROOF</h2><p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Before & After V9 Enhancement</p></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
               <span className="absolute top-4 left-4 bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">Before (Raw)</span>
               {showcase.before ? ( <><img src={showcase.before} alt="Before" className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02]" onClick={() => setFullScreenImageUrl(showcase.before)} />{isAdmin && (<button onClick={(e) => deleteShowcaseImage(e, 'before')} className="absolute top-4 right-4 bg-red-600 p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>)}<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20"><Eye className="w-12 h-12 text-white/50" /></div></> ) : ( isAdmin ? ( <div className="flex flex-col items-center cursor-pointer" onClick={() => beforeImgRef.current.click()}><Upload className="w-10 h-10 text-zinc-500 mb-2" /><span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">UPLOAD BEFORE</span><input type="file" ref={beforeImgRef} className="hidden" onChange={(e) => handleShowcaseUpload(e, 'before')} /></div> ) : ( <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Image Unavailable</span> ) )}
            </div>
            <div className="bg-black/50 border border-orange-500/30 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-[0_0_20px_rgba(255,140,0,0.05)]">
               <span className="absolute top-4 left-4 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">After (V9 16MP)</span>
               {showcase.after ? ( <><img src={showcase.after} alt="After" className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02]" onClick={() => setFullScreenImageUrl(showcase.after)} />{isAdmin && (<button onClick={(e) => deleteShowcaseImage(e, 'after')} className="absolute top-4 right-4 bg-red-600 p-2 rounded-full z-30 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>)}<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20"><Eye className="w-12 h-12 text-white/50" /></div></> ) : ( isAdmin ? ( <div className="flex flex-col items-center cursor-pointer" onClick={() => afterImgRef.current.click()}><Upload className="w-10 h-10 text-orange-500/50 mb-2" /><span className="text-[11px] font-bold text-orange-500/50 uppercase tracking-widest">UPLOAD AFTER</span><input type="file" ref={afterImgRef} className="hidden" onChange={(e) => handleShowcaseUpload(e, 'after')} /></div> ) : ( <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Image Unavailable</span> ) )}
            </div>
         </div>
      </div>

      <div className={`transition-all duration-500 ${(!isVIP && !isTrial && !isAdmin) ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16 items-stretch">
          <div className="flex flex-col gap-6 h-full">
             <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><Layers size={14} /> 1. BATCH UPLOAD (UP TO 10 IMAGES)</label>
             <div className={`relative border-2 border-dashed rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center transition-all min-h-[320px] ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${files.length > 0 ? 'border-solid border-[#FF8C00]/50' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
                {files.length > 0 ? ( <div className="relative w-full h-full flex flex-col justify-center items-center bg-[#050505] group rounded-xl overflow-hidden p-6 border border-orange-500/30"><div className="text-center mb-6"><Layers className="w-16 h-16 text-orange-500 mb-4 mx-auto animate-pulse" /><span className="text-2xl font-black text-white">{files.length} / 10 IMAGES BATCHED</span></div><div className="flex gap-4 relative z-20">{files.length < 10 && (<button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }} className="bg-zinc-800 text-white px-6 py-3 rounded-full text-xs font-black uppercase hover:bg-zinc-700">+ ADD MORE</button>)}<button type="button" onClick={obrisiSlike} className="bg-red-600/90 text-white px-6 py-3 rounded-full text-xs font-black uppercase hover:bg-red-500">CLEAR BATCH</button></div></div> ) : ( <div className="flex flex-col items-center cursor-pointer" onClick={() => inputRef.current.click()}><div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div><div><p className="text-white font-bold text-sm">Drag & Drop up to 10 images</p></div></div> )}
             </div>
          </div>
          <div className="flex flex-col gap-6 h-full">
             <div className="flex items-center justify-between"><label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><Archive size={14} /> 2. WORKFLOW MONITOR</label></div>
             <div className="font-mono text-zinc-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-1 min-h-[320px] text-[11px] md:text-[13px] overflow-y-auto relative">
               {isProcessing || downloadStatus === 'success' ? ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{v8Logs.slice(0, activeLog).map((log, index) => (<div key={index} className="mb-2">{log.includes('🚀') ? <span className="text-orange-500 font-black">{log}</span> : log.includes('✅') ? <span className="text-emerald-400 font-black">{log}</span> : <span>{log}</span>}</div>))}</motion.div> ) : ( <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10"><Cpu className="w-16 h-16 mb-4 text-zinc-400" /><span className="font-black text-[10px] uppercase">AWAITING BATCH INIT</span></div> )}
             </div>
             <div className="mt-auto pt-2 flex flex-col gap-4">
               <button onClick={() => downloadStatus === 'success' ? downloadZipFile() : handleUpscaleAndDownload()} disabled={(isProcessing || files.length === 0 || (credits <= 0 && !isAdmin)) && downloadStatus !== 'success'} className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${downloadStatus === 'success' ? 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]' : (credits <= 0 && !isAdmin) ? 'bg-red-900/50 text-red-500' : 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)]'}`}>{isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (downloadStatus === 'success' ? <DownloadCloud className="w-5 h-5" /> : <Archive className="w-5 h-5" />)}{isProcessing ? "PROCESSING V9 ENGINE..." : downloadStatus === 'success' ? "DOWNLOAD 16MP BATCH (ZIP)" : (credits <= 0 && !isAdmin) ? "INSUFFICIENT CREDITS" : `INITIATE 16MP BATCH UPSCALE`}</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default V8Standard16MPWorkspace;