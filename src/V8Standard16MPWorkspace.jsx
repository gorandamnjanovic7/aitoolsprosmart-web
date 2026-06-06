// POČETAK FAJLA: V8Standard16MPWorkspace.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Code, Images, ShieldCheck, RefreshCcw, Diamond, Copy, CheckCircle, FileImage, Crown, Zap, DownloadCloud, X, ArrowUpCircle, Layers, Archive, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

import V8SecureCheckout from './V8SecureCheckout';

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

// POČETAK FUNKCIJE: V8Standard16MPWorkspace
const V8Standard16MPWorkspace = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle'); 
  const [dragActive, setDragActive] = useState(false);
  const [batchError, setBatchError] = useState(null);
  const [activeLog, setActiveLog] = useState(0);
  
  const [userEmail, setUserEmail] = useState(null); 
  const [isVIP, setIsVIP] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const inputRef = useRef(null);
  // Postavljamo na 0 da bi prva stavka accordion-a bila odmah vidljiva kupcu
  const [otvorenOpis, setOtvorenOpis] = useState(0);

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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserEmail(null); setIsVIP(false); setCredits(0); setAmountPaid(0); setCurrentPlan('NONE'); setIsCheckingAccess(false);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);

      if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
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

    return () => unsubscribe();
  }, []);
  // KRAJ FUNKCIJE: useEffect

  // POČETAK FUNKCIJE: handleDrag
  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };
  // KRAJ FUNKCIJE: handleDrag

  // POČETAK FUNKCIJE: handleDrop
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) ucitajSlike(e.dataTransfer.files);
  };
  // KRAJ FUNKCIJE: handleDrop

  // POČETAK FUNKCIJE: handleChange
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) ucitajSlike(e.target.files);
  };
  // KRAJ FUNKCIJE: handleChange

  // POČETAK FUNKCIJE: ucitajSlike
  const ucitajSlike = async (selectedFiles) => {
    const fileArray = Array.from(selectedFiles).slice(0, 10);
    if (fileArray.length === 0) return;
    
    if (credits < fileArray.length && isVIP) {
      alert(`INSUFFICIENT CREDITS! You are trying to upload ${fileArray.length} images but only have ${credits} credits left.`);
      return;
    }

    setFiles(fileArray);
    setDownloadStatus('idle');
    setBatchError(null);
    setActiveLog(0);
  };
  // KRAJ FUNKCIJE: ucitajSlike

  // POČETAK FUNKCIJE: obrisiSlike
  const obrisiSlike = (e) => {
    if(e) e.stopPropagation(); 
    setFiles([]); 
    setDownloadStatus('idle');
    setBatchError(null);
    setActiveLog(0);
  };
  // KRAJ FUNKCIJE: obrisiSlike

  // POČETAK FUNKCIJE: handleUpscaleAndDownload
  const handleUpscaleAndDownload = async () => {
    if (!files || files.length === 0) return;
    if (credits < files.length && isVIP) {
        alert("INSUFFICIENT CREDITS! Please wait for refill.");
        return;
    }

    setIsProcessing(true);
    setDownloadStatus('processing');
    setActiveLog(0);
    
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
        const a = document.createElement('a');
        a.href = url;
        a.download = `V8_16MP_Batch_${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
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
  // KRAJ FUNKCIJE: handleUpscaleAndDownload

  // POČETAK FUNKCIJE: renderPricingPlans
  const renderPricingPlans = () => (
    <div className="w-full max-w-5xl mx-auto mt-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
          {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."} <span className="text-orange-500 block md:inline mt-2 md:mt-0">CHOOSE YOUR V8 PLAN.</span>
        </h2>
        
        <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto">
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
              <button onClick={() => pokreniKupovinu('STARTER', 150)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-zinc-800 text-white hover:bg-blue-500'}`}>
                 {amountPaid > 0 ? "UPGRADE TO STARTER" : "SELECT STARTER"}
              </button>
          </div>
        )}

        {amountPaid < 250 && (
          <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 border-orange-500/50 rounded-[2rem] p-8 flex flex-col relative hover:border-orange-500/80 transition-all shadow-[0_0_30px_rgba(234,88,12,0.15)] transform md:scale-105 z-10">
              <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
              
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-orange-500" /></div>
              <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
              <span className="text-4xl font-black text-orange-500 my-4 text-center flex items-center justify-center gap-3">
                 $250
              </span>
              <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                 <p className="flex items-center gap-2">✅ 2,000 Credits Included</p>
                 <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                 <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
              </div>
              <button onClick={() => pokreniKupovinu('PRO', 250)} className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] hover:bg-orange-400 transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                 {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
              </button>
          </div>
        )}

        {amountPaid < 550 && (
          <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-purple-500/30 rounded-[2rem] p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto"><Crown className="w-6 h-6 text-purple-500" /></div>
              <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
              <span className="text-4xl font-black text-purple-400 my-4 text-center flex items-center justify-center gap-3">
                 $550
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

      {amountPaid > 0 && (
         <div className="w-full max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-900/20 to-blue-800/10 border border-blue-500/30 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-6 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden">
           <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
           <ArrowUpCircle className="w-10 h-10 text-blue-400 flex-shrink-0 relative z-10" />
           <div className="text-center md:text-left relative z-10">
              <p className="text-blue-100 text-[14px] md:text-[16px] font-black uppercase tracking-widest mb-1">
                UPGRADE POLICY: <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">PRORATED PRICING ACTIVE.</span>
              </p>
              <p className="text-blue-200/80 text-[12px] md:text-[13px] font-bold">
                System detected an active V8 License (${amountPaid}). You will only pay the exact difference to upgrade.
              </p>
           </div>
         </div>
       )}
    </div>
  );
  // KRAJ FUNKCIJE: renderPricingPlans

  // POČETAK FUNKCIJE: renderV8Manifest
  const renderV8Manifest = () => {
      const specifikacije = [
        { t: `1. Batch Processing Up to 10 Files`, d: "Process multiple images in a single run.", insight: `Allows for rapid upscaling and processing of entire campaigns simultaneously, saving hours of manual labor.` },
        { t: "2. Consistent Style Locking", d: "Maintains visual identity across the entire batch.", insight: "Ensures that if you upload 10 images from the same campaign, they all receive the exact same treatment and output format." },
        { t: "3. Format Validation Safety", d: "Prevents resolution errors before processing begins.", insight: "The system scans all files instantly. If you mix 16:9 with 9:16, it halts and warns you to ensure perfect batch results." },
        { t: "4. Unified Archive Output", d: "Outputs a single compiled ZIP archive.", insight: "Instead of managing 10 different files or code snippets, you get one master ZIP file containing the upscaled files." },
        { t: "5. Credit Protection", d: "Credits are only deducted for successful batch runs.", insight: "If the batch fails midway, the system protects your quota. You only pay for what actually gets processed." },
        { t: "6. Backend-Ready Architecture", d: "Optimized for Node.js integrations.", insight: "Uses direct HTTP API handling with flexible payload sizes to accommodate up to 10 high-resolution images." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-16 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">BATCH PROCESSOR ENGINE</h2>
            <p className="text-[12px] md:text-[14px] text-orange-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications V3.0</p>
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
                  16MP <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">BATCH UPSCALE</span>
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

      <div className={`transition-all duration-500 ${!isVIP ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
          <div className="flex flex-col gap-6">
             <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
               <Layers size={14} /> 1. BATCH UPLOAD (UP TO 10 IMAGES)
             </label>
             <div className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${files.length > 0 ? 'border-solid border-[#FF8C00]/50' : 'min-h-[250px]'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
               <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
               {files.length > 0 ? (
                 <div className="relative w-full flex justify-center items-center bg-[#050505] group rounded-xl overflow-hidden p-6 border border-orange-500/30">
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

          <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2"><Archive size={14} /> 2. WORKFLOW MONITOR</label>
             </div>
             
             <div className="font-mono text-zinc-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-grow min-h-[300px] text-[11px] md:text-[13px] overflow-y-auto shadow-inner whitespace-pre-wrap leading-relaxed relative">
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
                   <Archive className="w-16 h-16 mb-4" />
                   <span className="font-black text-[10px] tracking-widest uppercase">AWAITING BATCH INIT</span>
                 </div>
               )}
             </div>

             <div className="mt-auto pt-2 flex flex-col gap-4">
               <button onClick={handleUpscaleAndDownload} disabled={isProcessing || files.length === 0 || credits <= 0} className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${credits <= 0 ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-[1.02]'} disabled:opacity-50`}>
                 {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
                 {isProcessing ? "PROCESSING V9 ENGINE..." : credits <= 0 ? "INSUFFICIENT CREDITS" : "INITIATE 16MP BATCH UPSCALE"}
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