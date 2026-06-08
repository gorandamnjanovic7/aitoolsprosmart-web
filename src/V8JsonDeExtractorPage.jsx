// POČETAK FAJLA: V8JsonExtractorPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Code, ShieldCheck, RefreshCcw, Diamond, Lock, Copy, CheckCircle, FileImage, Crown, Zap, DownloadCloud, X, ArrowUpCircle, Layers, Cpu, Eye, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, setDoc } from 'firebase/firestore';
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

const V8JsonExtractorPage = () => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [targetFormat, setTargetFormat] = useState('16:9');
  const [detectedAR, setDetectedAR] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [jsonResult, setJsonResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [userEmail, setUserEmail] = useState(null); 
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const inputRef = useRef(null);
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  // Showcase state (Sada su 16:9 i 9:16)
  const [showcase, setShowcase] = useState({ landscape: '', portrait: '' });
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  const [isUploadingShowcase, setIsUploadingShowcase] = useState({ landscape: false, portrait: false });
  const landscapeRef = useRef(null);
  const portraitRef = useRef(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login prekinut:", error);
    }
  };

  useEffect(() => {
    const unsubShowcase = onSnapshot(doc(db, "v8_settings", "showcase_extractor"), (docSnap) => {
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
            
            // Pazimo da ne zahvatimo DeBranding
            if (productName.includes("EXTRACTOR") && !productName.includes("DEBRENDING") && !productName.includes("DE-BRANDING")) {
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

  // Upload Showcase slika
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
      await setDoc(doc(db, "v8_settings", "showcase_extractor"), { [type]: resData.secure_url }, { merge: true });
    } catch (err) { 
      console.error("Greška pri uploadu showcase slike:", err);
      alert("Došlo je do greške pri uploadu. Proveri Cloudinary podešavanja.");
    } finally { 
      setIsUploadingShowcase(prev => ({ ...prev, [type]: false })); 
      e.target.value = null; 
    }
  };

  const deleteShowcaseImage = async (e, type) => {
    e.stopPropagation();
    if(window.confirm("Obrisati ovu sliku?")) {
        await setDoc(doc(db, "v8_settings", "showcase_extractor"), { [type]: '' }, { merge: true });
    }
  };

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

    const img = new Image();
    img.onload = () => {
        const ratio = img.width / img.height;
        let detected = '1:1';
        if (ratio >= 2.0) detected = '21:9';
        else if (ratio >= 1.2) detected = '16:9';
        else if (ratio <= 0.8) detected = '9:16';
        
        setDetectedAR(detected);
        setTargetFormat(detected); 
    };
    img.src = objectUrl;
  };

  const obrisiSliku = (e) => {
    if(e) e.stopPropagation();
    setFile(null); setPreviewUrl(null); setJsonResult(''); setDetectedAR(null);
    setTargetFormat('16:9');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const extractDNA = async () => {
    if (!file) return;
    if (credits <= 0 && isVIP) { alert("INSUFFICIENT CREDITS! Please wait for refill."); return; }

    setIsExtracting(true); setJsonResult('');
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('targetFormat', targetFormat);
    formData.append('email', auth.currentUser?.email || ''); 

    try {
        const response = await fetch(`${BASE_BACKEND_URL}/api/v8-extract-dna`, { method: 'POST', body: formData });
        const data = await response.json(); 
        if (!response.ok) throw new Error(data.error || "Greska na serveru");
        setJsonResult(JSON.stringify(data, null, 2));
    } catch (error) { 
        alert("Extraction failed. Check server logs."); console.error("V8 FRONTEND ERROR:", error);
    } finally { setIsExtracting(false); }
  };

  const pokreniKupovinu = async (paketName, fullPrice) => {
    if (!userEmail) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        return; 
      } catch (error) {
        console.error("Login prekinut:", error);
        return;
      }
    }

    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade ? `V8 Extractor - ${paketName.toUpperCase()} (UPGRADE)` : `V8 Extractor - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };

  const renderPricingPlans = () => {
    if (amountPaid >= 550) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-16 px-4">
           <div className="bg-gradient-to-r from-[#1a0b2e] to-[#050505] border border-cyan-500/40 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
              <Crown className="w-20 h-20 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
                ENTERPRISE TIER <span className="text-cyan-500">UNLOCKED</span>
              </h2>
              <p className="text-cyan-200/60 font-bold uppercase tracking-widest text-[11px] md:text-sm max-w-2xl mx-auto">
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
            {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."} <span className="text-cyan-500 block md:inline mt-2 md:mt-0">CHOOSE YOUR V8 PLAN.</span>
          </h2>
          
          <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className="text-cyan-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-cyan-500/20 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
             </h4>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-cyan-400 font-black">For free. Forever.</span></p>
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
                <button onClick={() => pokreniKupovinu('STARTER', 150)} className="w-full bg-zinc-800 text-white hover:bg-cyan-500 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md">
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 250 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 border-cyan-500/50 rounded-[2rem] p-8 flex flex-col relative hover:border-cyan-500/80 transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)] transform md:scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-t-[1.9rem]"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
                
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500/10 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-cyan-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className="text-4xl font-black text-cyan-500 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${250 - amountPaid}` : "$250"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 2,000 Credits Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 250)} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] transition-all ${amountPaid > 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}>
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
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-12 mb-10 bg-gradient-to-r from-[#0a192f]/90 to-[#020617]/90 border border-cyan-500/40 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-8 shadow-[0_0_40px_rgba(6,182,212,0.2)] relative overflow-hidden backdrop-blur-md">
             <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
             
             <div className="w-16 h-16 bg-cyan-950/50 rounded-full flex items-center justify-center border border-cyan-500/50 relative flex-shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                <ArrowUpCircle className="w-8 h-8 text-cyan-400" />
             </div>

             <div className="text-center md:text-left relative z-10">
                <div className="inline-block bg-cyan-900/30 border border-cyan-500/30 px-3 py-1 rounded-full text-cyan-300 font-bold uppercase tracking-widest text-[9px] mb-3">
                  SMART UPGRADE SYSTEM ACTIVE
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                  PRORATED UPGRADE POLICY
                </h3>
                <p className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                  System radar has detected an active V8 License valued at <strong className="text-cyan-400">${amountPaid}</strong> linked to your account. You will <strong className="text-white border-b border-cyan-500/50 pb-0.5">only pay the exact difference</strong> to upgrade to a higher tier.
                </p>
             </div>
           </motion.div>
         )}
      </div>
    );
  };

  const renderV8Manifest = () => {
    const specifikacije = [
        { t: "1. Visual DNA Extraction", d: "Converts visual info into structured JSON.", insight: "Reads the input image as binary data, sends it to a vision-capable OpenAI model, and extracts microscopic visual analysis." },
        { t: "2. Master AI Prompt Role", d: "Acts as a Master Prompt Engineer & Cinematographer.", insight: "Creates a higher-quality visual extraction than basic captioning, perfect for premium prompt creation." },
        { t: "3. Subject & Environment", d: "Extracts main subject structure and background.", insight: "Captures pose, action, architecture, and luxury setting critical for recreating premium scenes." },
        { t: "4. Lighting Extraction", d: "Describes key light, fill light, and cinematic contrast.", insight: "Lighting is the most expensive-looking part of an image; this ensures generated images look professional." },
        { t: "5. Camera Equipment", d: "Recommends exact cinematic gear and focal lengths.", insight: "Uses language like ARRI Alexa or Leica Summilux to help AI understand intended visual quality." },
        { t: "6. Color Grading", d: "Captures image palette and post-production look.", insight: "Extracts warm/cold tones, luxury gold palettes, and commercial grades for perfect stylistic matching." },
        { t: "7. Format Adaptation", d: "Intelligent aspect ratio detection.", insight: "Automatically calculates and suggests the most optimal aspect ratio based on original framing." },
        { t: "8. Backend-Ready Architecture", d: "Optimized for Node.js integrations.", insight: "Uses Base64 image encoding and direct HTTP API handling with flexible API key loading." }
      ];

      return (
        <div className="w-full max-w-5xl mx-auto mb-16 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">DNA EXTRACTOR ENGINE</h2>
            <p className="text-[12px] md:text-[14px] text-cyan-400 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications V1.0</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div key={i} onClick={() => setOtvorenOpis(isOpen ? null : i)} className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? 'text-cyan-400' : 'text-blue-400'}`}>
                        <span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-cyan-500' : 'text-blue-600/60'}`}>💎</span> {item.t}
                      </h4>
                      <p className={`text-[11px] md:text-[14px] font-bold leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p>
                    </div>
                    <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? 'rotate-180 text-cyan-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] group-hover:text-blue-400'}`}>▼</div>
                  </div>
                  <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-[11px] md:text-[13px] text-zinc-300 font-mono leading-relaxed border-l-2 border-cyan-500 pl-3">
                          <span className="text-cyan-400 font-bold">Tech Insight:</span> {item.insight}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
                </div>
              );
            })}
          </div>

          {/* DUGMIĆI ZA MANIFEST I LICENCU */}
          <div className="mt-12 pt-10 border-t border-white/10 grid md:grid-cols-2 gap-6">
            <a href="/V8_EXTRACTOR_MANIFEST.txt" download className="flex items-center gap-4 bg-black/40 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/50 p-6 rounded-2xl transition-all group shadow-inner">
              <FileText className="text-cyan-500 w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-white font-black uppercase tracking-widest text-[13px] group-hover:text-cyan-400 transition-colors">Extractor Manifest</span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">.TXT Document</span>
              </div>
              <DownloadCloud className="ml-auto text-zinc-600 group-hover:text-cyan-500 transition-colors w-5 h-5" />
            </a>

            <a href="/V8_Commercial_License.pdf" download className="flex items-center gap-4 bg-black/40 hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/50 p-6 rounded-2xl transition-all group shadow-inner">
              <ShieldCheck className="text-emerald-500 w-8 h-8 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-white font-black uppercase tracking-widest text-[13px] group-hover:text-emerald-400 transition-colors">Commercial License</span>
                <span className="text-zinc-500 text-[10px] uppercase tracking-wider font-bold">.PDF Agreement</span>
              </div>
              <DownloadCloud className="ml-auto text-zinc-600 group-hover:text-emerald-500 transition-colors w-5 h-5" />
            </a>
          </div>
        </div>
      );
  };
  // KRAJ FUNKCIJE: renderV8Manifest

  const arOptions = ['16:9', '9:16', '1:1', '21:9'];

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.1)] max-w-6xl mx-auto mt-28 relative">

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
           <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} 
              className="bg-black/80 backdrop-blur-xl border border-cyan-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center gap-4">
              <Zap className="w-4 h-4 text-cyan-500 animate-pulse" />
              <div className="flex flex-col items-center">
                 <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">ENGINE CREDITS</span>
                 <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${credits > 100 ? 'text-emerald-400' : 'text-red-500'}`}>
                    {credits}
                 </span>
              </div>
           </motion.div>
        </div>
      )}

      <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
      >
          <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50" style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
          
          <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
              <div className="inline-block bg-cyan-600/10 border border-cyan-500/30 px-5 py-2 rounded-full text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(6,182,212,0.2)] backdrop-blur-sm">
                  V8 CINEMATIC PROTOCOL // STRUCTURAL EXTRACTION
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
                  <Code className="text-cyan-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
                  JSON <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600 drop-shadow-none">VISUAL EXTRACTOR</span>
              </h1>
              
              <div className="bg-[#050505]/80 backdrop-blur-md border border-cyan-500/20 p-8 rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8">
                  <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">The Protocol Explained:</h4>
                  <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">
                      The V8 JSON Extractor acts as a <strong>visual DNA decoder</strong>. It deconstructs your master image—identifying lighting vectors, color temperature, material textures, and structural composition, converting this data into a <strong>pure JSON blueprint</strong>.
                  </p>
                  <p className="text-zinc-300 text-[13px] leading-relaxed">
                      Once extracted, this "DNA" becomes your master template. You can now force-apply this exact stylistic blueprint to any target AI generator. The result is <strong>perfect aesthetic continuity</strong> across every platform with zero structure loss.
                  </p>
              </div>

              {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
                 <div className="mt-12 relative z-20 w-full">
                    {renderPricingPlans()}
                 </div>
              )}
          </div>
      </motion.div>

      {renderV8Manifest()}

      <div className="w-full max-w-5xl mx-auto mb-16 relative z-10">
         <div className="text-center mb-8">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">VISUAL INTEGRITY PROOF</h2>
            <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Format Adaptability Matrix</p>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* 16:9 Showcase */}
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group">
               <span className="absolute top-4 left-4 bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">Cinematic Landscape (16:9)</span>
               
               {showcase.landscape ? (
                 <>
                   <img src={showcase.landscape} alt="Landscape Format" className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500" onClick={() => setFullScreenImageUrl(showcase.landscape)} />
                   {isAdmin && (
                     <button onClick={(e) => deleteShowcaseImage(e, 'landscape')} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                      <Eye className="w-12 h-12 text-white/50" />
                   </div>
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => landscapeRef.current.click()}>
                      <Upload className="w-10 h-10 text-zinc-500 mb-2" />
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-center">{isUploadingShowcase.landscape ? "UPLOADING..." : "UPLOAD 16:9\nLANDSCAPE IMAGE"}</span>
                      <input type="file" ref={landscapeRef} accept="image/*" className="hidden" onChange={(e) => handleShowcaseUpload(e, 'landscape')} />
                   </div>
                 ) : (
                   <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">Image Unavailable</span>
                 )
               )}
            </div>

            {/* 9:16 Showcase */}
            <div className="bg-black/50 border border-cyan-500/30 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.05)]">
               <span className="absolute top-4 left-4 bg-cyan-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">Editorial Portrait (9:16)</span>
               
               {showcase.portrait ? (
                 <>
                   {/* Ograničen max-w da 9:16 ne ode previše u širinu */}
                   <img src={showcase.portrait} alt="Portrait Format" className="max-w-[70%] h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500" onClick={() => setFullScreenImageUrl(showcase.portrait)} />
                   {isAdmin && (
                     <button onClick={(e) => deleteShowcaseImage(e, 'portrait')} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                     </button>
                   )}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                      <Eye className="w-12 h-12 text-white/50" />
                   </div>
                 </>
               ) : (
                 isAdmin ? (
                   <div className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={() => portraitRef.current.click()}>
                      <Upload className="w-10 h-10 text-cyan-500/50 mb-2" />
                      <span className="text-[11px] font-bold text-cyan-500/50 uppercase tracking-widest text-center">{isUploadingShowcase.portrait ? "UPLOADING..." : "UPLOAD 9:16\nPORTRAIT IMAGE"}</span>
                      <input type="file" ref={portraitRef} accept="image/*" className="hidden" onChange={(e) => handleShowcaseUpload(e, 'portrait')} />
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
             <label className="text-cyan-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
               <FileImage size={14} /> 1. SOURCE IMAGE
             </label>
             <div className={`relative border-2 border-dashed rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center transition-all min-h-[320px] ${dragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/20 bg-black/50 hover:border-cyan-500/50'} ${previewUrl ? 'border-solid border-cyan-500/50' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
               
               <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
               
               {previewUrl ? (
                 <div className="relative w-full h-full flex justify-center items-center bg-[#050505] group rounded-xl overflow-hidden p-2">
                   <img src={previewUrl} alt="Uploaded prep" className="w-full h-auto max-h-[300px] object-contain shadow-2xl" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm z-10">
                     <button onClick={obrisiSliku} className="bg-red-600/90 text-white p-3 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110"><X size={28} strokeWidth={3} /></button>
                   </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => inputRef.current.click()}>
                   <div className="bg-white/5 p-4 rounded-full"><Upload className="w-8 h-8 text-zinc-400" /></div>
                   <div><p className="text-white font-bold text-sm">Drag & Drop image to extract DNA</p><p className="text-zinc-500 text-xs mt-1">or click to browse files</p></div>
                 </div>
               )}
             </div>

             <div className="flex flex-col gap-4">
               <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center justify-between">
                 IMAGE ASPECT RATIO
                 {detectedAR && file && <span className="text-cyan-500 text-[9px] bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/30">LOCKED: {detectedAR}</span>}
               </label>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                 {arOptions.map((ar) => {
                   const isDetected = detectedAR === ar;
                   const isActive = detectedAR ? isDetected : (targetFormat === ar);
                   const isDisabled = detectedAR ? !isDetected : false; 
                   
                   return (
                     <button 
                       key={ar}
                       disabled={isDisabled}
                       onClick={() => !detectedAR && setTargetFormat(ar)} 
                       className={`py-3 rounded-xl font-black text-[12px] uppercase transition-all border 
                         ${isActive 
                           ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                           : isDisabled 
                              ? 'bg-[#050505] border-white/5 text-zinc-600 cursor-not-allowed opacity-40'
                              : 'bg-[#0a0a0a] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}
                       `}
                     >
                       {ar} {isDetected && "✓"}
                     </button>
                   );
                 })}
               </div>
               
               <div className="mt-2 text-center p-3 border border-cyan-500/20 rounded-xl bg-cyan-500/5">
                 <p className="text-cyan-400 font-bold uppercase tracking-widest text-[10px] md:text-[11px]">
                   Generate extracted image in your favorite generator (Freepik, Nano Banana 2). Format is set to <span className="text-white font-black">DEFAULT</span>.
                 </p>
               </div>
             </div>
          </div>

          <div className="flex flex-col gap-6 h-full">
             <div className="flex items-center justify-between">
                <label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
                  <Code size={14} /> 2. EXTRACTED JSON CODE
                </label>
             </div>
             
             <div className="font-mono text-emerald-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-1 min-h-[320px] text-[11px] md:text-[13px] overflow-y-auto shadow-inner whitespace-pre-wrap leading-relaxed relative flex flex-col">
               {jsonResult ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{jsonResult}</motion.div>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                   <Cpu className="w-16 h-16 mb-4 text-zinc-400" />
                   <span className="font-black text-[10px] tracking-widest uppercase text-zinc-400">AWAITING DNA SAMPLE</span>
                 </div>
               )}
             </div>

             <div className="mt-auto pt-2 flex flex-col gap-4">
               <button 
                 onClick={extractDNA} 
                 disabled={isExtracting || !file || credits <= 0} 
                 className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 ${credits <= 0 ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed' : 'bg-[#0a0a0a] border border-white/10 text-white hover:border-cyan-500/50 hover:text-cyan-400'} disabled:opacity-50 hover:scale-[1.02]`}
               >
                 {isExtracting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                 {isExtracting ? "EXTRACTING..." : credits <= 0 ? "INSUFFICIENT CREDITS" : "EXTRACT CLEAN JSON"}
               </button>

               <AnimatePresence>
                 {jsonResult && (
                   <motion.button 
                     initial={{ opacity: 0, height: 0, marginTop: 0 }}
                     animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                     exit={{ opacity: 0, height: 0, marginTop: 0 }}
                     onClick={handleCopy}
                     className="w-full bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 text-white font-black text-[18px] md:text-[20px] uppercase tracking-widest py-6 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                   >
                     {copied ? <CheckCircle className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                     {copied ? "JSON COPIED SUCCESS!" : "COPY JSON DNA CODE"}
                   </motion.button>
                 )}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default V8JsonExtractorPage;
// KRAJ FAJLA: V8JsonExtractorPage.jsx