// POČETAK FAJLA: V8Standard16MPWorkspace.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Code, Images, ShieldCheck, RefreshCcw, Diamond, Copy, CheckCircle, FileImage, Crown, Zap, DownloadCloud, X, ArrowUpCircle, Layers, Archive, AlertTriangle, Download, Trash2, Eye, FileText, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, increment, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import V8SecureCheckout from './V8SecureCheckout';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

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
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FF8C00] text-white p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(255,140,0,0.5)]"><X size={32} strokeWidth={3} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.4)] border border-[#FF8C00]/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox


// POČETAK FUNKCIJE: V8Standard16MPWorkspace
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
  const [credits, setCredits] = useState(0); 
  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  // Before/After Showcase state
  const [showcase, setShowcase] = useState({ before: '', after: '' });
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  const [isUploadingShowcase, setIsUploadingShowcase] = useState({ before: false, after: false });
  const beforeImgRef = useRef(null);
  const afterImgRef = useRef(null);

  const inputRef = useRef(null);
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
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
    "💎 9. Compiling ZIP package with TXT report",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  // POČETAK FUNKCIJE: handleGoogleLogin
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login prekinut:", error);
    }
  };
  // KRAJ FUNKCIJE: handleGoogleLogin

  // POČETAK FUNKCIJE: pokreniKupovinu
  const pokreniKupovinu = async (paketName, fullPrice) => {
    if (!userEmail) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return; 
      } catch (error) {
        console.error("Login prekinut tokom pokušaja kupovine:", error);
        return;
      }
    }

    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade ? `16MP Upscale - ${paketName.toUpperCase()} (UPGRADE)` : `16MP Upscale - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };
  // KRAJ FUNKCIJE: pokreniKupovinu

  // POČETAK FUNKCIJE: useEffect
  useEffect(() => {
    const unsubShowcase = onSnapshot(doc(db, "v8_settings", "showcase_16mp"), (docSnap) => {
        if (docSnap.exists()) {
            setShowcase(docSnap.data());
        }
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserEmail(null); setIsVIP(false); setIsAdmin(false); setCredits(0); setAmountPaid(0); setCurrentPlan('NONE'); setIsCheckingAccess(false);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);

      const adminCheck = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";
      setIsAdmin(adminCheck);

      if (adminCheck) {
        setIsVIP(true); setCredits(9999); setAmountPaid(550); setCurrentPlan('ENTERPRISE'); setIsCheckingAccess(false);
        return;
      }

      const qPay = query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email));
      
      onSnapshot(qPay, (snap) => {
        let hasAccess = false; let totalCredits = 0; let maxPaid = 0; let highestPlan = 'NONE';

        snap.docs.forEach(docSnap => {
          const data = docSnap.data();
          if (data.status === "paid" || data.status === "PAID") {
            const productName = data.productName ? data.productName.toUpperCase() : "";
            
            if (productName.includes("V8") || productName.includes("16MP")) {
              hasAccess = true;
              if (productName.includes("ENTERPRISE")) { if (maxPaid < 550) { maxPaid = 550; highestPlan = 'ENTERPRISE'; } totalCredits = Math.max(totalCredits, 10000); } 
              else if (productName.includes("PRO")) { if (maxPaid < 250) { maxPaid = 250; highestPlan = 'PRO'; } totalCredits = Math.max(totalCredits, 2000); } 
              else { if (maxPaid < 150) { maxPaid = 150; highestPlan = 'STARTER'; } totalCredits = Math.max(totalCredits, 500); }
            }
          }
        });

        if (hasAccess) { setIsVIP(true); setCredits(totalCredits); setAmountPaid(maxPaid); setCurrentPlan(highestPlan); } 
        else { setIsVIP(false); setCredits(0); setAmountPaid(0); setCurrentPlan('NONE'); }
        setIsCheckingAccess(false);
      });
    });

    return () => {
        unsubscribe();
        unsubShowcase();
    };
  }, []);
  // KRAJ FUNKCIJE: useEffect

  // POČETAK FUNKCIJE: handleShowcaseUpload
  const handleShowcaseUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingShowcase(prev => ({ ...prev, [type]: true }));
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      await setDoc(doc(db, "v8_settings", "showcase_16mp"), { [type]: resData.secure_url }, { merge: true });
    } catch (err) { 
      console.error("Greška pri uploadu showcase slike:", err);
      alert("Došlo je do greške pri uploadu. Proveri Cloudinary podešavanja.");
    } finally { 
      setIsUploadingShowcase(prev => ({ ...prev, [type]: false })); 
      e.target.value = null; 
    }
  };
  // KRAJ FUNKCIJE: handleShowcaseUpload

  // POČETAK FUNKCIJE: deleteShowcaseImage
  const deleteShowcaseImage = async (e, type) => {
    e.stopPropagation();
    if(window.confirm("Obrisati ovu sliku?")) {
        await setDoc(doc(db, "v8_settings", "showcase_16mp"), { [type]: '' }, { merge: true });
    }
  };
  // KRAJ FUNKCIJE: deleteShowcaseImage

  // POČETAK FUNKCIJE: Ostali Handleri
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

  const ucitajSlike = async (selectedFiles) => {
    const fileArray = Array.from(selectedFiles).slice(0, 10);
    if (fileArray.length === 0) return;
    
    if (credits < fileArray.length && isVIP) {
      alert(`INSUFFICIENT CREDITS! You are trying to upload ${fileArray.length} images but only have ${credits} credits left.`);
      return;
    }

    setFiles(fileArray);
    setDownloadStatus('idle');
    setZipUrl(null); 
    setBatchError(null);
    setActiveLog(0);
  };

  const obrisiSlike = (e) => {
    if(e) e.stopPropagation(); 
    setFiles([]); 
    setDownloadStatus('idle');
    setZipUrl(null); 
    setBatchError(null);
    setActiveLog(0);
  };

  const downloadZipFile = () => {
    if (!zipUrl) return;
    const a = document.createElement('a');
    a.href = zipUrl;
    a.download = `V8_16MP_Batch_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpscaleAndDownload = async () => {
    if (!files || files.length === 0) return;
    if (credits < files.length && isVIP) {
        alert("INSUFFICIENT CREDITS! Please wait for refill.");
        return;
    }

    setIsProcessing(true);
    setDownloadStatus('processing');
    setActiveLog(0);
    setZipUrl(null);
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]); 
    }
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';

    try {
        const progressInterval = setInterval(() => {
            setActiveLog(prev => prev < v8Logs.length - 1 ? prev + 1 : prev);
        }, 800);

        const response = await fetch(`${BASE_BACKEND_URL}/api/v8-optimize`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData 
        });
        
        clearInterval(progressInterval);

        if (!response.ok) {
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.error || "Serverska greška prilikom generisanja ZIP-a.");
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        setZipUrl(url);
        setActiveLog(v8Logs.length);
        setDownloadStatus('success');

        if (auth.currentUser && !isVIP) {
            const email = auth.currentUser.email ? auth.currentUser.email.toLowerCase() : "";
            if (email !== "damnjanovicgoran7@gmail.com" && email !== "aitoolsprosmart@gmail.com") {
                const docRef = doc(db, "vip_users", email);
                await updateDoc(docRef, {
                    optimizerCredits: increment(-files.length) 
                });
            }
        }
        
    } catch (error) { 
        alert("Batch Upscale processing failed. Check server logs."); 
        console.error("V8 FRONTEND ERROR:", error);
        setDownloadStatus('error');
        setActiveLog(0);
    } finally { 
        setIsProcessing(false); 
    }
  };
  // KRAJ FUNKCIJE: Ostali Handleri

  // POČETAK FUNKCIJE: renderPricingPlans
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
                You possess the highest level V8 License. All protocols are fully operational at maximum capacity.
              </p>
           </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."} <span className="text-orange-500 block md:inline mt-2 md:mt-0">CHOOSE YOUR V8 PLAN.</span>
          </h2>
          
          <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-orange-500/20 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
             </h4>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full z-10 relative">
          
          {amountPaid < 150 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto"><Diamond className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                <span className="text-4xl font-black text-blue-400 my-4 text-center">$150</span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 500 Credits Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('STARTER', 150)} className="w-full bg-zinc-800 text-white hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md">
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 250 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 border-orange-500/50 rounded-[2rem] p-8 flex flex-col relative hover:border-orange-500/80 transition-all shadow-[0_0_30px_rgba(234,88,12,0.15)] transform md:scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500 rounded-t-[1.9rem]"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
                
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-orange-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className="text-4xl font-black text-orange-500 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${250 - amountPaid}` : "$250"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 2,000 Credits Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 250)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] transition-all ${amountPaid > 0 ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.4)]'}`}>
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
                   <p className="flex items-center gap-2">✅ 10,000 Credits Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Lifetime Access (Rolling Quota)</p>
                </div>
                <button onClick={() => pokreniKupovinu('ENTERPRISE', 550)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-800 text-white hover:bg-purple-500'}`}>
                   {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
                </button>
            </div>
          )}
        </div>

        {amountPaid > 0 && amountPaid < 550 && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-12 mb-10 bg-gradient-to-r from-[#0a192f]/90 to-[#020617]/90 border border-blue-500/40 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-8 shadow-[0_0_40px_rgba(59,130,246,0.2)] relative overflow-hidden backdrop-blur-md">
             <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             
             <div className="w-16 h-16 bg-blue-950/50 rounded-full flex items-center justify-center border border-blue-500/50 relative flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin"></div>
                <ArrowUpCircle className="w-8 h-8 text-blue-400" />
             </div>

             <div className="text-center md:text-left relative z-10">
                <div className="inline-block bg-blue-900/30 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 font-bold uppercase tracking-widest text-[9px] mb-3">
                  SMART UPGRADE SYSTEM ACTIVE
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                  PRORATED UPGRADE POLICY
                </h3>
                <p className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                  System radar has detected an active V8 License valued at <strong className="text-blue-400">${amountPaid}</strong> linked to your account. You will <strong className="text-white border-b border-blue-500/50 pb-0.5">only pay the exact difference</strong> to upgrade to a higher tier.
                </p>
             </div>
           </motion.div>
         )}
      </div>
    );
  };
  // KRAJ FUNKCIJE: renderPricingPlans

  // POČETAK FUNKCIJE: renderV8Manifest
  const renderV8Manifest = () => {
      const specifikacije = [
        { t: "1. 16MP Upscale Engine", d: "Upscales images to an exact 16MP threshold.", insight: "Utilizes advanced LANCZOS resampling to perfectly hit the 16,000,000 pixel target while maintaining absolute structural integrity." },
        { t: "2. Omni-Format Support", d: "Processes 16:9, 21:9, 9:16, and 1:1 formats.", insight: "The engine mathematically analyzes the input aspect ratio and dynamically calculates perfect target dimensions for the 16MP output." },
        { t: "3. Format Validation Safety", d: "Blocks mixed aspect-ratio batches.", insight: "Scans the input folder and immediately halts processing if different ratios are detected, ensuring pure batch consistency." },
        { t: "4. Color & Contrast Boost", d: "Mild color and contrast enhancement.", insight: "Applies a 1.05x color enhancement and 1.04x contrast boost via ImageEnhance to make raw generations visually pop." },
        { t: "5. Highlight Rolloff", d: "Protects overexposed areas and blown-out whites.", insight: "Applies a custom NumPy matrix threshold at 232 brightness, mathematically compressing extreme highlights by 68%." },
        { t: "6. Product AD Polish", d: "Final contrast pass for commercial impact.", insight: "Adds a secondary 1.02x micro-contrast enhancement post-rolloff to ensure deep, rich shadows and premium presentation." },
        { t: "7. Anti-Plastic Film Grain", d: "Subtle organic noise generation.", insight: "Injects normally distributed optical noise (mu=0, sigma=1.8) directly into the pixel array to break artificial 'AI smoothness'." },
        { t: "8. Automated ZIP Compilation", d: "Generates a complete ZIP archive with a TXT log.", insight: "Bundles all processed images into one master ZIP archive alongside a detailed metric report confirming resolutions." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-12 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">BATCH PROCESSOR ENGINE</h2>
            <p className="text-[12px] md:text-[14px] text-orange-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications V9.0</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div key={i} onClick={() => setOtvorenOpis(isOpen ? null : i)} className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
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
  // KRAJ FUNKCIJE: renderV8Manifest

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-6xl mx-auto mt-28 relative">
      
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

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

      {isVIP && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
           <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-black/80 backdrop-blur-xl border border-orange-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)] flex items-center gap-4">
              <Zap className="w-4 h-4 text-orange-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">EXTRACTOR CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>{credits}</span>
              </div>
           </motion.div>
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.15)]">
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                  V8 CINEMATIC PROTOCOL // 16MP UPSCALE ENGINE
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
                  <Images className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
                  16MP <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">STUDIO-GRADE UPSCALE</span>
              </h1>
              
              <div className="bg-[#050505]/80 backdrop-blur-md border border-orange-500/20 p-8 rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8">
                <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">The Protocol Explained:</h4>
                <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">The V8 16MP Upscale Engine acts as an <strong>industrial-grade resolution multiplier</strong>. It doesn't just enlarge pixels—it intelligently reconstructs your image by analyzing original lighting vectors, lens optical properties, and structural composition to generate a <strong>flawless high-resolution master file</strong>.</p>
                <p className="text-zinc-300 text-[13px] leading-relaxed">Once processed, your image achieves <strong>perfect aesthetic clarity</strong>. You can now use these hyper-realistic visuals for premium client presentations, high-end print, and commercial campaigns with zero structure loss or plastic AI artifacts.</p>
              </div>

              {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
                 <div className="mt-12 relative z-20 w-full">
                    {renderPricingPlans()}
                 </div>
              )}
          </div>
      </motion.div>

      {renderV8Manifest()}

      <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto mb-16 relative z-10">
        <a href="/V8_16MP_Technical_Manifest.pdf" download className="flex-1 bg-black/40 border border-blue-500/30 hover:border-blue-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-blue-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]">
            <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 transition-all"><Download className="w-8 h-8 text-blue-400" /></div>
            <div className="text-left">
                <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Technical Manifest</h4>
                <p className="text-zinc-400 text-[11px] font-bold">Download V9 Specs (PDF)</p>
            </div>
        </a>
        <a href="/V8_Commercial_License.pdf" download className="flex-1 bg-black/40 border border-orange-500/30 hover:border-orange-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-orange-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(249,115,22,0.2)]">
            <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-all"><FileText className="w-8 h-8 text-orange-400" /></div>
            <div className="text-left">
                <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Commercial License</h4>
                <p className="text-zinc-400 text-[11px] font-bold">Download Legal Terms (PDF)</p>
            </div>
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-16 relative z-10">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">VISUAL INTEGRITY PROOF</h2>
            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Before & After V9 Enhancement</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
               <span className="absolute top-4 left-4 bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">Before (Raw)</span>
               
               {showcase.before ? (
                 <>
                   <img src={showcase.before} alt="Before Upscale" className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500" onClick={() => setFullScreenImageUrl(showcase.before)} />
                   {isAdmin && (
                     <button onClick={(e) => deleteShowcaseImage(e, 'before')} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                      <Eye className="w-12 h-12 text-white/50" />
                   </div>
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => beforeImgRef.current.click()}>
                      <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{isUploadingShowcase.before ? "UPLOADING..." : "UPLOAD BEFORE IMAGE"}</span>
                      <input type="file" ref={beforeImgRef} accept="image/*" className="hidden" onChange={(e) => handleShowcaseUpload(e, 'before')} />
                   </div>
                 ) : (
                   <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Image Unavailable</span>
                 )
               )}
            </div>

            <div className="bg-black/50 border border-orange-500/30 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-[0_0_20px_rgba(255,140,0,0.05)]">
               <span className="absolute top-4 left-4 bg-orange-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">After (V9 16MP)</span>
               
               {showcase.after ? (
                 <>
                   <img src={showcase.after} alt="After Upscale" className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500" onClick={() => setFullScreenImageUrl(showcase.after)} />
                   {isAdmin && (
                     <button onClick={(e) => deleteShowcaseImage(e, 'after')} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                      <Eye className="w-12 h-12 text-white/50" />
                   </div>
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => afterImgRef.current.click()}>
                      <Upload className="w-10 h-10 text-orange-500/50 mb-2" />
                      <span className="text-[11px] font-bold text-orange-500/50 uppercase tracking-widest">{isUploadingShowcase.after ? "UPLOADING..." : "UPLOAD AFTER IMAGE"}</span>
                      <input type="file" ref={afterImgRef} accept="image/*" className="hidden" onChange={(e) => handleShowcaseUpload(e, 'after')} />
                   </div>
                 ) : (
                   <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Image Unavailable</span>
                 )
               )}
            </div>
         </div>
      </div>

      <div className={`transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16 items-stretch">
          
          <div className="flex flex-col gap-6 h-full">
             <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
               <Layers size={14} /> 1. BATCH UPLOAD (UP TO 10 IMAGES)
             </label>
             <div className={`relative border-2 border-dashed rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center transition-all min-h-[320px] ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${files.length > 0 ? 'border-solid border-[#FF8C00]/50' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
               <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
               {files.length > 0 ? (
                 <div className="relative w-full h-full flex justify-center items-center bg-[#050505] group rounded-xl overflow-hidden p-6 border border-orange-500/30">
                   <div className="text-center">
                      <Layers className="w-16 h-16 text-orange-500 mb-4 mx-auto animate-pulse" />
                      <span className="text-2xl font-black text-white">{files.length} / 10 IMAGES BATCHED</span>
                   </div>
                   <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                     <button onClick={obrisiSlike} className="bg-red-600/90 text-white p-4 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110 flex items-center gap-2">
                         <X size={20} strokeWidth={3} /> CLEAR BATCH
                     </button>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => inputRef.current.click()}>
                   <div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div>
                   <div><p className="text-white font-bold text-sm">Drag & Drop up to 10 images</p><p className="text-zinc-500 text-xs mt-1">or click to browse files</p></div>
                 </div>
               )}
             </div>
          </div>

          <div className="flex flex-col gap-6 h-full">
             <div className="flex items-center justify-between">
                <label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><Archive size={14} /> 2. WORKFLOW MONITOR</label>
             </div>
             
             <div className="font-mono text-zinc-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-1 min-h-[320px] text-[11px] md:text-[13px] overflow-y-auto shadow-inner whitespace-pre-wrap leading-relaxed relative flex flex-col">
               {isProcessing || downloadStatus === 'success' ? (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {v8Logs.slice(0, activeLog).map((log, index) => (
                       <div key={index} className="mb-2">
                          {log.includes('🚀') ? <span className="text-orange-500 font-black">{log}</span> : 
                           log.includes('💎') ? <span className="text-blue-400">{log}</span> : 
                           log.includes('✅') ? <span className="text-emerald-400 font-black">{log}</span> : 
                           <span>{log}</span>}
                       </div>
                    ))}
                 </motion.div>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                   <Cpu className="w-16 h-16 mb-4 text-zinc-400" />
                   <span className="font-black text-[10px] tracking-widest uppercase">AWAITING BATCH INIT</span>
                 </div>
               )}
             </div>

             <div className="mt-auto pt-2 flex flex-col gap-4">
               <button 
                  onClick={() => downloadStatus === 'success' ? downloadZipFile() : handleUpscaleAndDownload()} 
                  disabled={(isProcessing || files.length === 0 || credits <= 0) && downloadStatus !== 'success'} 
                  className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50
                    ${downloadStatus === 'success' 
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02]' 
                      : credits <= 0 
                      ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02]'
                    }`}
                >
                 {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : (downloadStatus === 'success' ? <DownloadCloud className="w-5 h-5" /> : <Archive className="w-5 h-5" />)}
                 {isProcessing ? "PROCESSING V9 ENGINE..." : downloadStatus === 'success' ? "DOWNLOAD 16MP BATCH (ZIP)" : credits <= 0 ? "INSUFFICIENT CREDITS" : "INITIATE 16MP BATCH UPSCALE"}
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default V8Standard16MPWorkspace;
// KRAJ FAJLA: V8Standard16MPWorkspace.jsx