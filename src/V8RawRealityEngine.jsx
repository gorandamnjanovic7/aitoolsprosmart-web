// POČETAK FAJLA: V8RawRealityEngine.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { createPortal } from 'react-dom';
import { 
  Camera, Zap, Cpu, Settings2, CheckCircle, Copy, Database, Sparkles, 
  ChevronDown, ScanLine, FileText, FileJson, Trash2, ShieldCheck, 
  Diamond, Crown, ArrowUpCircle, Lock, Download, AlertTriangle, Timer, Eye, Maximize, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 

import { starterVault, proVault, enterpriseVault, generateRawMatrix } from './V8RawRealityData'; 
import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

// POČETAK FUNKCIJE: FullScreenLightbox
const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
      if (imageUrl) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = '';
      return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
      <div className="fixed inset-0 z-[999999] bg-[#00050a]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-cyan-600 text-black p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:bg-cyan-500 transition-all hover:scale-110"><X size={32} strokeWidth={3} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.4)] border border-cyan-500/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox

const V8RawRealityEngine = () => {
  // 1. STATE VARIJABLE
  const [customIdea, setCustomIdea] = useState('');
  const [selectedVaultIdea, setSelectedVaultIdea] = useState('');
  const [selectedVaultTier, setSelectedVaultTier] = useState(null); 
  const [openVaultDropdown, setOpenVaultDropdown] = useState(null); 
  
  const dropdownRef = useRef(null);
  const resultsRef = useRef(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 20;
  const [otvorenOpis, setOtvorenOpis] = useState(null);
  
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  // SISTEM NAPLATE
  const [userEmail, setUserEmail] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [promptsUsed, setPromptsUsed] = useState(0); 
  const [promptLimit, setPromptLimit] = useState(0); 
  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  
  const [cooldownTime, setCooldownTime] = useState(null);
  const [cooldownDisplay, setCooldownDisplay] = useState("");
  const [isEngineCoolingDown, setIsEngineCoolingDown] = useState(false);

  const [payData, setPayData] = useState([]);
  const [vipData, setVipData] = useState({});

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  // 🔥 2. KALKULACIJE I LOGIKA NIVOJA 🔥
  const getMaxPromptsCount = () => {
    if (isAdmin || currentPlan === 'ENTERPRISE') return 500;
    if (currentPlan === 'PRO') return 200;
    if (currentPlan === 'STARTER') return 50;
    return 50; 
  };

  const maxOutput = getMaxPromptsCount();

  const canUseStarter = isAdmin || currentPlan === 'STARTER' || currentPlan === 'PRO' || currentPlan === 'ENTERPRISE';
  const canUsePro = isAdmin || currentPlan === 'PRO' || currentPlan === 'ENTERPRISE';
  const canUseEnterprise = isAdmin || currentPlan === 'ENTERPRISE';

  // 3. FUNKCIJE ZA CHECKOUT
  const openCheckoutForPackage = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade ? `V8 RAW REALITY - ${paketName.toUpperCase()} (UPGRADE)` : `V8 RAW REALITY - ${paketName.toUpperCase()}`;
    
    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };

  const pokreniKupovinu = (paketName, fullPrice) => {
    const userNow = currentUser || auth.currentUser;
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("raw_checkout_initiated", { 
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: isUpgrade ? "upgrade" : "new" 
    });

    if (userNow) {
      openCheckoutForPackage(paketName, fullPrice);
      return;
    }

    setCheckoutProduct(isUpgrade ? `V8 RAW REALITY - ${paketName.toUpperCase()} (UPGRADE)` : `V8 RAW REALITY - ${paketName.toUpperCase()}`);
    setCheckoutPrice(finalPrice);
    setIsLoginRequiredOpen(true);
  };

  // 4. USE EFFECTS (BAZA I AUTH)
  useEffect(() => {
    let unsubPayoneer = () => {};
    let unsubCrypto = () => {};
    let unsubPayPal = () => {};
    let unsubVip = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setPayData([]);
        setVipData({});
        setIsCheckingAccess(false);
        setAmountPaid(0);
        setCurrentPlan('NONE');
        setIsVIP(false);
        setIsAdmin(false);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);
      setIsAdmin(email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com");

      let payoneerDocs = [];
      let cryptoDocs = [];
      let paypalDocs = [];

      const updateAllPayData = () => {
         setPayData([...payoneerDocs, ...cryptoDocs, ...paypalDocs]);
      };

      unsubPayoneer = onSnapshot(query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email)), snap => {
         payoneerDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
         cryptoDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
         paypalDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubVip = onSnapshot(doc(db, "vip_users", email), (snap) => {
        setVipData(snap.exists() ? snap.data() : {});
      });
    });

    return () => { unsubAuth(); unsubPayoneer(); unsubCrypto(); unsubPayPal(); unsubVip(); };
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    if (isAdmin) {
      setIsVIP(true);
      setPromptsUsed(0);
      setPromptLimit(999999);
      setAmountPaid(95);
      setCurrentPlan('ENTERPRISE');
      setIsCheckingAccess(false);
      setCooldownTime(null);
      setIsEngineCoolingDown(false);
      return;
    }

    let hasAccess = false;
    let calculatedLimit = 0;
    let maxPaid = 0;
    let highestPlan = 'NONE';

    payData.forEach((data) => {
      if (data.status === "paid" || data.status === "PAID" || data.status === "PLAĆENO" || data.status === "completed_verified") {
        const productName = data.productName ? data.productName.toUpperCase() : "";
        const price = Number(data.price) || 0;

        if (productName.includes("PROMPT FACTORY") || productName.includes("GRID")) return; 

        if (productName.includes("RAW") || productName.includes("REALITY") || productName.includes("BUNDLE") || productName.includes("SECURITY CHECKOUT")) {
          hasAccess = true;
          if (productName.includes("ENTERPRISE") || price >= 95) {
            if (maxPaid < 95) { maxPaid = 95; highestPlan = 'ENTERPRISE'; }
            calculatedLimit = Math.max(calculatedLimit, 100000);
          } else if (productName.includes("PRO") || price >= 75) {
            if (maxPaid < 75) { maxPaid = 75; highestPlan = 'PRO'; }
            calculatedLimit = Math.max(calculatedLimit, 25000);
          } else if (productName.includes("STARTER") || price >= 20) {
            if (maxPaid < 20) { maxPaid = 20; highestPlan = 'STARTER'; }
            calculatedLimit = Math.max(calculatedLimit, 5000);
          } else {
            if (maxPaid < 20) { maxPaid = 20; highestPlan = 'STARTER'; }
            calculatedLimit = Math.max(calculatedLimit, 5000);
          }
        }
      }
    });

    if (hasAccess) {
      setIsVIP(true);
      setAmountPaid(maxPaid);
      setCurrentPlan(highestPlan);
      setPromptLimit(calculatedLimit);

      const used = vipData.promptsUsed || 0;
      setPromptsUsed(used);
      
      const exhaustedTimestamp = vipData.exhaustedAt ? new Date(vipData.exhaustedAt).getTime() : null;

      if (used >= calculatedLimit || exhaustedTimestamp) {
        const cooldownStart = exhaustedTimestamp || Date.now();
        const targetTime = cooldownStart + (30 * 24 * 60 * 60 * 1000); 
        if (Date.now() >= targetTime) resetQuota(currentUser.email.toLowerCase());
        else { setIsEngineCoolingDown(true); setCooldownTime(targetTime); }
      } else { setIsEngineCoolingDown(false); setCooldownTime(null); }
    } else {
      setIsVIP(false); setPromptsUsed(0); setPromptLimit(0); setAmountPaid(0); setCurrentPlan('NONE');
      setCooldownTime(null); setIsEngineCoolingDown(false);
    }
    setIsCheckingAccess(false);
  }, [payData, vipData, currentUser, isAdmin]);

  useEffect(() => {
    let interval;
    if (isEngineCoolingDown && cooldownTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = cooldownTime - now;
        if (diff <= 0) { clearInterval(interval); if (currentUser) resetQuota(currentUser.email.toLowerCase()); } 
        else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setCooldownDisplay(`${days}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEngineCoolingDown, cooldownTime, currentUser]);

  const resetQuota = async (emailToReset) => {
    try { await setDoc(doc(db, "vip_users", emailToReset), { promptsUsed: 0, exhaustedAt: null }, { merge: true });
    } catch(e) { console.error("Failed to reset limit", e); }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setOpenVaultDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5. EVENT HANDLERI I FUNKCIJE ALATA
  const recordUsage = async (promptsCount) => {
    if (currentUser && isVIP && !isAdmin) {
        try {
            const docRef = doc(db, "vip_users", currentUser.email.toLowerCase());
            const snap = await getDoc(docRef);
            let currentUsage = snap.exists() ? (snap.data().promptsUsed || 0) : 0;
            let newUsage = currentUsage + promptsCount;
            let updateData = { promptsUsed: newUsage };
            if (newUsage >= promptLimit) updateData.exhaustedAt = new Date().toISOString();
            await setDoc(docRef, updateData, { merge: true });
        } catch(e) { console.error("Failed to update limit", e); }
    }
  };

  const generisiPromptove = () => {
    if (isEngineCoolingDown && !isAdmin) { alert("INSUFFICIENT CREDITS! Please wait for refill."); return; }

    const finalIdea = customIdea || selectedVaultIdea;
    if (!finalIdea) { alert("Please enter your idea or select one from the Forensic Vault."); return; }
    
    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("raw_generation_started", { 
        is_custom_idea: customIdea !== '',
        expected_count: getMaxPromptsCount()
    });

    setIsGenerating(true);
    setCurrentPage(1);
    setCopiedStates({});

    setTimeout(() => {
      const promptCount = getMaxPromptsCount();
      const baseSeed = Math.floor(Math.random() * 999999);
      const newPrompts = generateRawMatrix(finalIdea, promptCount, baseSeed);
      
      setGeneratedPrompts(newPrompts);
      recordUsage(promptCount);
      setIsGenerating(false);
      
      setTimeout(() => {
        if (resultsRef.current) {
          const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 50;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }, 800);
  };

  const totalPages = Math.ceil(generatedPrompts.length / promptsPerPage);
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = generatedPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      if (resultsRef.current) {
        const y = resultsRef.current.getBoundingClientRect().top + window.scrollY - 50;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const downloadTxt = () => {
    if (generatedPrompts.length === 0) return;
    const output = generatedPrompts.map((p, i) => `PROMPT ${String(i + 1).padStart(3, '0')}\n${p}`).join("\n\n------------------------------------------------------------\n\n");
    const blob = new Blob([output], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "V8_Raw_Reality_Matrix.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("raw_download_txt", { count: generatedPrompts.length });
  };

  const clearResults = () => { setGeneratedPrompts([]); setCurrentPage(1); };

  const copySingle = async (index, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [index]: true }));

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("raw_copied_single", { plan: currentPlan });
  };

  // 6. RENDER FUNKCIJE ZA KOMPONENTE
  const renderVaultInput = (tier, icon, title, count, vaultData, isActive, colorClass, borderColorClass) => {
    const isOpen = openVaultDropdown === tier;
    const isSelected = selectedVaultTier === tier && selectedVaultIdea;

    return (
        <div className={`relative ${isActive ? '' : 'opacity-30 grayscale pointer-events-none'}`}>
          <div 
            onClick={() => { if (isActive && !isSelected) setOpenVaultDropdown(isOpen ? null : tier); }}
            className={`bg-black/80 border ${isOpen || isSelected ? borderColorClass : 'border-white/10'} text-white text-[12px] font-bold p-4 rounded-2xl w-full flex justify-between items-center transition-all ${isActive && !isSelected ? `cursor-pointer hover:${borderColorClass} shadow-inner` : isActive && isSelected ? 'shadow-inner' : 'cursor-not-allowed'}`}
          >
            <div className="flex items-center gap-3 truncate pr-4 w-full">
              {icon}
              <span className={`truncate ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                {isSelected ? selectedVaultIdea : `${title} (${count} IDEAS)`}
              </span>
            </div>
            
            {isSelected ? (
               <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setSelectedVaultIdea(''); 
                    setSelectedVaultTier(null); 
                  }} 
                  className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white p-1.5 rounded-lg transition-all z-10 shrink-0 shadow-md"
                  title="Clear Selection"
               >
                  <X size={16} strokeWidth={3}/>
               </button>
            ) : !isActive ? (
               <Lock size={16} className="text-zinc-600 shrink-0" />
            ) : (
               <ChevronDown size={16} className={`${colorClass} shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            )}
          </div>

          <AnimatePresence>
            {isOpen && !isSelected && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border ${borderColorClass} rounded-2xl shadow-2xl z-50 overflow-hidden`}
              >
                <div className="max-h-56 overflow-y-auto custom-scrollbar">
                  {vaultData.map((idea, index) => (
                    <div 
                      key={index} 
                      onClick={(e) => { 
                        e.stopPropagation();
                        setSelectedVaultIdea(idea); 
                        setSelectedVaultTier(tier); 
                        setCustomIdea(''); 
                        setOpenVaultDropdown(null); 
                        
                        // 🔥 GA4 ANALITIKA 🔥
                        trackV8Action("raw_vault_idea_selected", { vault_tier: tier });
                      }} 
                      className={`p-4 border-b border-white/5 text-[11px] text-zinc-400 hover:text-white cursor-pointer transition-colors leading-relaxed hover:bg-${colorClass.replace('text-', '')}/10`}
                    >
                      {idea}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    );
  };

  const renderPricingPlans = () => {
    if (amountPaid >= 299) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4">
           <div className="bg-gradient-to-r from-[#020617]/80 to-[#0f172a]/80 backdrop-blur-md border border-cyan-500/40 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden">
              <Crown className="w-16 h-16 md:w-20 md:h-20 text-cyan-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
                ENTERPRISE TIER <span className="text-cyan-500 block md:inline mt-2 md:mt-0">UNLOCKED</span>
              </h2>
              <p className="text-cyan-200/60 font-bold uppercase tracking-widest text-[10px] md:text-sm max-w-2xl mx-auto">
                You possess the highest level V8 License. All Raw Reality protocols are fully operational at maximum capacity.
              </p>
           </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4 relative z-10 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "UPGRADE YOUR ENGINE." : "LIFETIME ACCESS."} <span className="text-cyan-500 block md:inline mt-2 md:mt-0">CHOOSE YOUR V8 PLAN.</span>
          </h2>
          <div className="mt-8 bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className="text-cyan-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-cyan-500/20 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> V8 EPIC PROTOCOL
             </h4>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Engine enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full z-10 relative">
          {amountPaid < 20 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505]/60 backdrop-blur-md border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto"><Diamond className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                <span className="text-4xl font-black text-blue-400 my-4 text-center">$20</span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 50 Vault Ideas Unlocked</p>
                   <p className="flex items-center gap-2">✅ 2,500 Unique Prompts Matrix (50 Ideas x 50 Variations)</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                </div>
                <button onClick={() => pokreniKupovinu('STARTER', 20)} className="w-full bg-blue-600/20 border border-blue-500/50 text-white hover:bg-blue-500 hover:border-transparent py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md">
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 75 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505]/80 backdrop-blur-xl border-2 border-cyan-500/50 rounded-[2rem] p-8 flex flex-col relative hover:border-cyan-500/80 transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] transform md:scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-600 to-teal-500 rounded-t-[1.9rem]"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-cyan-500/20 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-cyan-400" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className="text-4xl font-black text-cyan-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${75 - amountPaid}` : "$75"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 200 Vault Ideas Unlocked</p>
                   <p className="flex items-center gap-2">✅ 40,000 Unique Prompts Matrix (200 Ideas x 200 Variations)</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 75)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all ${amountPaid > 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]'}`}>
                   {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
                </button>
            </div>
          )}

          {amountPaid < 95 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505]/60 backdrop-blur-md border border-purple-500/30 rounded-[2rem] p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto"><Crown className="w-6 h-6 text-purple-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
                <span className="text-4xl font-black text-purple-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${95 - amountPaid}` : "$95"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ ALL 500 Ideas Unlocked</p>
                   <p className="flex items-center gap-2">✅ 250,000 Unique Prompts Matrix (500 Ideas x 500 Variations)</p>
                   <p className="flex items-center gap-2">🔄 Lifetime Access (Rolling Quota)</p>
                </div>
                <button onClick={() => pokreniKupovinu('ENTERPRISE', 95)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-purple-600/20 border border-purple-500/50 text-white hover:bg-purple-500'}`}>
                   {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
                </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPromptSecrets = () => {
    const secrets = [
        { t: "1. Core Philosophy", d: "Evidence-grade realism over aesthetic beauty.", insight: "Realism comes from constraint, not excess. If an image feels 'cool', it is likely fake. If it feels awkward, it is real." },
        { t: "2. Acquisition Components", d: "Physically believable camera placement.", insight: "We strictly utilize real-world sensors like RED RAPTOR V, ARRI ALEXA 35, and SONY VENICE to ground the scene in physical reality." },
        { t: "3. Optical Fidelity", d: "Premium lens constraints.", insight: "Scenes are rendered through specific glass like Zeiss Ultra Prime or Cooke S4 to emulate true optical behavior, not AI smoothness." },
        { t: "4. Focal Length Physics", d: "Spatial immersion and distortion.", insight: "Focal lengths are locked to scene physics (e.g., 8mm for POV chaos, 50mm for emotional compression)." },
        { t: "5. Mode A: Direct Subject", d: "Simple input, complex extraction.", insight: "Provide a simple subject or object, and the Engine invents a precise, real-world situation where a camera would actually exist to capture it." },
        { t: "6. Mode B: Scene Invention", d: "Zero-input algorithmic concepts.", insight: "Generates highly unique, never-stock scenes focusing on overlooked moments, pauses, fatigue, and logistical reality." },
        { t: "7. Internal Reasoning", d: "Calculated observational timing.", insight: "Favors awkward timing over dramatic moments. Removes anything staged, symbolic, or performative from the visual output." },
        { t: "8. Output Requirements", d: "Neutral observational captures.", insight: "Each prompt is formulated as an accidental documentary capture or an internal production still without narrative closure." },
        { t: "9. Composition Rule", d: "Strict blueprint for final rendering.", insight: "Subject + unremarkable action + precise environment + awkward moment + physical constraints + camera/lens metadata." },
        { t: "10. Fatal Overrides", d: "Non-negotiable aesthetic bans.", insight: "FATAL ERROR triggered by: cinematic vibes, heroic framing, inspirational payoffs, fantasy lighting, or repeating visual clichés." }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mb-10 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          
          <div className="absolute inset-0 bg-[#000a0a]/60 z-0 pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">ENGINE MANIFESTO</h2>
            <p className="text-[12px] md:text-[14px] text-cyan-500 font-bold uppercase tracking-[0.3em] mt-3 italic">10 Laws of Epic Realism</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start relative z-10">
            {secrets.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setOtvorenOpis(isOpen ? null : i)}
                  className={`bg-white/5 border p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isOpen ? 'border-cyan-500/50 bg-black/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h4 className="text-cyan-400 font-black uppercase">{item.t}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{item.d}</p>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-zinc-600 group-hover:text-zinc-400'}`} 
                    />
                  </div>
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[11px] text-zinc-300 font-mono leading-relaxed border-l-2 border-cyan-500 pl-3">
                        <span className="text-cyan-500 font-bold">Protocol Logic:</span> {item.insight}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    );
  };

  // 7. GLAVNI RETURN
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden">
      <Helmet>
        <title>V8 Raw Reality Engine | Epic Premium Prompt Generator</title>
        <meta name="description" content="Generate evidence-grade, epic, unreleased photographic reality. V8 Forensic Intelligence." />
      </Helmet>

      {/* FULL SCREEN LIGHTBOX */}
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      {/* V8SmartQuota */}
      {(isVIP || isAdmin) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-black/80 backdrop-blur-xl border px-6 py-2 rounded-full flex items-center gap-4 shadow-lg w-max mx-auto ${
              isEngineCoolingDown ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
            }`}
          >
            {isEngineCoolingDown ? <Timer className="w-5 h-5 text-red-500 animate-pulse" /> : <ShieldCheck className="w-5 h-5 text-cyan-500 animate-pulse" />}
            <div className="flex flex-col items-center">
               <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">
                 {isEngineCoolingDown ? 'COOLING DOWN' : 'ROLLING QUOTA'}
               </span>
               {isEngineCoolingDown ? (
                  <span className="text-[14px] font-mono font-black tracking-widest leading-none mt-1 text-red-500">{cooldownDisplay}</span>
               ) : isAdmin ? (
                  <span className="text-[15px] font-black tracking-widest leading-none mt-1 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">MASTER ADMIN : ∞</span>
               ) : (
                  <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${promptsUsed >= promptLimit ? 'text-red-500' : 'text-emerald-400'}`}>
                     {promptsUsed} / {promptLimit}
                  </span>
               )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 🔥 GLOBALNA VIDEO POZADINA ZA CELU STRANICU (FIXED 9:16) 🔥 */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#00050a]">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-100">
          <source src="/v8-raw-bg-916.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#000000]/90 z-0"></div>
        <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
      </div>

      <LoginRequiredModal isOpen={isLoginRequiredOpen} onClose={() => setIsLoginRequiredOpen(false)} packageName={checkoutProduct} price={checkoutPrice} onLoginSuccess={(user) => { if (user?.email) setCurrentUser(user); setIsCheckoutOpen(true); }} />
      <AnimatePresence>
        {isCheckoutOpen && <V8SecureCheckout isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} productName={checkoutProduct} price={checkoutPrice} />}
      </AnimatePresence>

      <div className="w-full max-w-7xl mx-auto px-4 pt-28 pb-20 relative z-10">
        
        {/* HEADER BOX - CYAN SA VRAĆENIM VIDEOM ZA BOKS */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] bg-[#050505]/40 backdrop-blur-md">
            
            {/* VRAĆEN VIDEO SAMO ZA OVAJ BOKS */}
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60 z-0 pointer-events-none mix-blend-lighten">
               <source src="/v8-raw-header.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 z-0 bg-black/40"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-[#00050a]/90"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none z-0"></div>
            
            <div className="flex flex-col items-center text-center gap-6 relative z-10 py-16 px-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] backdrop-blur-md">
                  <Zap size={12} className="animate-pulse" /> V8 EPIC PROTOCOL
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase italic drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">
                  RAW REALITY <span className="text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-blue-600">ENGINE</span>
                </h1>
                
                <div className="bg-[#000a0a]/70 backdrop-blur-lg border border-cyan-500/30 p-8 rounded-[2rem] max-w-4xl mx-auto mt-6 text-left shadow-2xl relative overflow-hidden">
                    <h4 className="text-cyan-500 font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">The Premium Aesthetics Framework:</h4>
                    <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">
                        If an image feels "cool", it is likely fake. If it feels epic, precise, or too detailed, it is a V8 output.
                    </p>
                    <p className="text-zinc-400 text-[13px] leading-relaxed italic">
                        This engine forces the AI to abandon generic beauty. It invents physically precise, IP-Safe premium scenes using real-world focal lengths, constraints, and forensic metadata to generate evidence-grade, unreleased masterpieces.
                    </p>
                </div>
              </div>
            </div>

            {/* PRAVI KORISNIČKI BROJAČI PROMPTOVA SA ADMIN ∞ */}
            {(isVIP || isAdmin) && (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6 mb-12 relative z-20 w-full max-w-3xl mx-auto px-6">
                
                <div className="bg-[#000a0a]/80 backdrop-blur-xl border border-emerald-500/30 px-6 py-4 rounded-2xl flex items-center gap-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] w-full md:w-1/2 group">
                   <div className="bg-emerald-900/40 p-3 rounded-xl border border-emerald-500/20">
                      <Database className="text-emerald-400 w-6 h-6" />
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[9px] text-emerald-300 font-black uppercase tracking-[0.2em] mb-1">AVAILABLE PROMPTS</span>
                      <span className="text-2xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                         {isAdmin ? '∞' : promptLimit - promptsUsed}
                      </span>
                   </div>
                </div>
                
                <div className="bg-[#000a0a]/80 backdrop-blur-xl border border-cyan-500/30 px-6 py-4 rounded-2xl flex items-center gap-5 shadow-[0_0_30px_rgba(6,182,212,0.15)] w-full md:w-1/2 group">
                   <div className="bg-cyan-900/40 p-3 rounded-xl border border-cyan-500/20">
                      <Zap className="text-cyan-400 w-6 h-6" />
                   </div>
                   <div className="flex flex-col text-left">
                      <span className="text-[9px] text-cyan-300 font-black uppercase tracking-[0.2em] mb-1">PROMPTS GENERATED</span>
                      <span className="text-2xl font-black text-white tracking-widest flex items-center gap-3">
                         {isAdmin ? '∞' : promptsUsed}
                      </span>
                   </div>
                </div>
              </div>
            )}
        </motion.div>

        {/* ACCORDION: 10 SECRET PROMPTS */}
        {renderPromptSecrets()}

        {/* DOWNLOAD DUGME (SAMO LICENCA) */}
        <div className="flex justify-center max-w-md mx-auto mb-16 relative z-10 w-full">
          <a href="/v8-license.pdf" download onClick={() => trackV8Action("download_raw_license")} className="w-full bg-black/40 border border-cyan-500/30 hover:border-cyan-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-cyan-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(6,182,212,0.2)]">
              <div className="bg-cyan-500/10 p-4 rounded-full border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all"><FileText className="w-8 h-8 text-cyan-400" /></div>
              <div className="text-left">
                  <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Commercial License</h4>
                  <p className="text-zinc-400 text-[11px] font-bold">Download Legal Terms (PDF)</p>
              </div>
          </a>
        </div>

        {/* PRICING PLANS SEKCIJA */}
        {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
           <div className="relative z-20 w-full">{renderPricingPlans()}</div>
        )}

        {/* 🔥 NOVI 2x2 SHOWCASE GRID SA FULL SCREEN KVADRATOM 🔥 */}
        <div className="w-full max-w-5xl mx-auto mt-12 mb-20 relative z-10 px-4">
           <div className="text-center mb-10">
             <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">VISUAL PROOF</h2>
             <p className="text-[12px] md:text-[14px] text-cyan-500 font-bold uppercase tracking-[0.3em] mt-2 italic">Raw Reality Engine Outputs</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-black/50 border border-cyan-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/60 transition-all duration-500 aspect-video relative">
                <img src="/raw-1.webp" alt="V8 Engine Output 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/raw-1.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 font-black text-[10px] tracking-widest uppercase">Capture #001</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/raw-1.webp')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-cyan-500/30 text-cyan-400 opacity-0 group-hover:opacity-100 hover:bg-cyan-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-cyan-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/60 transition-all duration-500 aspect-video relative">
                <img src="/raw-2.webp" alt="V8 Engine Output 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/raw-2.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 font-black text-[10px] tracking-widest uppercase">Capture #002</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/raw-2.webp')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-cyan-500/30 text-cyan-400 opacity-0 group-hover:opacity-100 hover:bg-cyan-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-cyan-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/60 transition-all duration-500 aspect-video relative">
                <img src="/raw-3.webp" alt="V8 Engine Output 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/raw-3.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 font-black text-[10px] tracking-widest uppercase">Capture #003</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/raw-3.webp')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-cyan-500/30 text-cyan-400 opacity-0 group-hover:opacity-100 hover:bg-cyan-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-cyan-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.1)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] hover:border-cyan-500/60 transition-all duration-500 aspect-video relative">
                <img src="/raw-4.webp" alt="V8 Engine Output 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/raw-4.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 font-black text-[10px] tracking-widest uppercase">Capture #004</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/raw-4.webp')} className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-cyan-500/30 text-cyan-400 opacity-0 group-hover:opacity-100 hover:bg-cyan-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={16} />
                </button>
             </div>
           </div>
        </div>

        {/* ALAT */}
        <div className={`transition-all duration-500 ${!isVIP && !isAdmin ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          
          <div className="bg-[#050505]/60 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16 items-stretch">
              
              {/* KOLONA 1: UNOS IDEJE */}
              <div className="flex flex-col gap-8 h-full">
                <div className="flex flex-col gap-3 relative">
                  <label className="font-black text-[11px] tracking-widest uppercase flex items-center gap-2 text-cyan-500">
                    <Sparkles size={14} /> 1. INPUT YOUR SUBJECT OR IDEA
                  </label>
                  
                  <div className="relative w-full">
                    <textarea 
                      value={customIdea} 
                      onChange={(e) => { 
                        setCustomIdea(e.target.value); 
                        setSelectedVaultIdea(''); 
                        setSelectedVaultTier(null); 
                      }} 
                      disabled={selectedVaultIdea !== ''}
                      placeholder="e.g. A flawless damascus steel blade glowing with internal heat..." 
                      className={`bg-black/80 border border-white/10 focus:border-cyan-500 p-5 pr-14 rounded-2xl text-[14px] text-white outline-none resize-none h-32 transition-all w-full shadow-inner ${selectedVaultIdea !== '' ? 'opacity-30 grayscale cursor-not-allowed' : ''}`} 
                    />
                    
                    {/* CRVENO X ZA BRISANJE CUSTOM IDEJE */}
                    <AnimatePresence>
                      {customIdea && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setCustomIdea('')}
                          title="Clear text"
                          className="absolute top-3 right-3 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white p-2 rounded-xl transition-all shadow-lg"
                        >
                          <X size={16} strokeWidth={3} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-zinc-600 font-black text-[10px] uppercase tracking-widest">OR</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* 🔥 3 ODVOJENA TREZORA 🔥 */}
                <div className="flex flex-col gap-2">
                  <label className="font-black text-[11px] tracking-widest uppercase flex items-center gap-2 text-cyan-400 mb-2">
                    <Database size={14} /> 2. SELECT FORENSIC VAULT SCENE
                  </label>
                  
                  <div ref={dropdownRef} className="flex flex-col gap-3">
                    {renderVaultInput('starter', <Diamond className="w-4 h-4 text-blue-400 shrink-0"/>, 'STARTER VAULT', 50, starterVault, canUseStarter && !customIdea, 'text-blue-400', 'border-blue-500/50')}
                    {renderVaultInput('pro', <Zap className="w-4 h-4 text-cyan-400 shrink-0"/>, 'PRO VAULT', 200, proVault, canUsePro && !customIdea, 'text-cyan-400', 'border-cyan-500/50')}
                    {renderVaultInput('enterprise', <Crown className="w-4 h-4 text-purple-400 shrink-0"/>, 'ENTERPRISE VAULT', 500, enterpriseVault, canUseEnterprise && !customIdea, 'text-purple-400', 'border-purple-500/50')}
                  </div>
                </div>

              </div>

              {/* KOLONA 2: STATUS I GENERISANJE */}
              <div className="flex flex-col gap-8 h-full">
                <div className="bg-[#050505] border border-cyan-500/20 rounded-[1.5rem] p-6 text-left flex flex-col justify-center h-full shadow-inner">
                    <h4 className="text-cyan-500 font-black uppercase tracking-widest text-[11px] mb-3 flex items-center gap-2"><Cpu size={14}/> ENGINE STATUS: <span className="text-white">{currentPlan}</span></h4>
                    <p className="text-zinc-400 text-[12px] leading-relaxed mb-4">
                        Based on your clearance, the Engine will take your selected idea and automatically inject {maxOutput} unique combinations of Cameras, Lenses, Lighting, and Constraints.
                    </p>
                    <div className="flex items-center gap-3 text-white font-black text-3xl">
                        <ScanLine className="text-cyan-500 w-8 h-8" />
                        {maxOutput} <span className="text-[12px] text-zinc-500 uppercase tracking-widest">OUTPUTS READY</span>
                    </div>
                </div>

                <div className="mt-auto">
                  <button 
                    onClick={generisiPromptove} 
                    disabled={isGenerating || (!customIdea && !selectedVaultIdea) || (promptsUsed >= promptLimit && !isAdmin)} 
                    className={`w-full font-black text-[16px] uppercase tracking-widest py-6 rounded-2xl transition-all flex items-center justify-center gap-3 ${
                      (!customIdea && !selectedVaultIdea) || (promptsUsed >= promptLimit && !isAdmin)
                        ? 'bg-zinc-900/80 text-zinc-600 cursor-not-allowed border border-white/5' 
                        : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-[1.02]'
                    } disabled:opacity-50`}
                  >
                    {isGenerating ? 'ANALYZING SCENE PHYSICS...' : (promptsUsed >= promptLimit && !isAdmin && isVIP) ? 'INSUFFICIENT QUOTA' : `GENERATE ${maxOutput} RAW PROMPTS`} 
                    {isGenerating && <Settings2 size={20} className="animate-spin" />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {generatedPrompts.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-10 border-t border-white/10 pt-16">
                  <div className="flex items-center gap-4 mb-10 justify-center">
                      <Camera className="w-8 h-8 text-cyan-500" />
                      <h2 className="text-3xl font-black uppercase tracking-widest text-white text-center">ACQUISITION LOG</h2>
                  </div>
                  
                  <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]">
                    <div ref={resultsRef} className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <span className="text-cyan-400 font-black text-[12px] uppercase tracking-widest flex items-center gap-2">
                          <CheckCircle size={16}/> DEPLOYED ({generatedPrompts.length} FORENSIC PROMPTS):
                        </span>
                        
                        <div className="flex items-center gap-3 flex-wrap">
                          <button onClick={downloadTxt} className="hover:text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30"><FileText size={14}/> TXT</button>
                          <button onClick={clearResults} className="text-red-500 hover:text-white p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500 transition-all"><Trash2 size={16}/></button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentPrompts.map((prompt, index) => {
                        const absoluteIndex = indexOfFirstPrompt + index;
                        return (
                          <div key={absoluteIndex} className="bg-[#050505] border border-cyan-500/20 p-5 rounded-2xl shadow-inner hover:border-cyan-500/60 transition-all relative group flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                              <span className="text-cyan-500 font-bold text-[10px] tracking-widest">CAPTURE #{String(absoluteIndex + 1).padStart(3,'0')}</span>
                              <button onClick={() => copySingle(absoluteIndex, prompt)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${copiedStates[absoluteIndex] ? 'bg-green-500 text-black' : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-500 hover:text-white'}`}>
                                <Copy size={12} /> {copiedStates[absoluteIndex] ? 'COPIED!' : 'COPY'}
                              </button>
                            </div>
                            <p className="text-zinc-300 text-[12px] leading-relaxed font-mono mt-2 break-words">
                              {prompt}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-white/10 flex-wrap">
                        <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white/5 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30">PREV</button>
                        <div className="flex gap-2 overflow-x-auto max-w-[50vw] custom-scrollbar px-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-[10px] md:text-[11px] font-black transition-all ${
                                 currentPage === page 
                                    ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110' 
                                    : 'bg-zinc-900/50 text-zinc-400 border border-white/5 hover:border-cyan-500/30 hover:text-cyan-400'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>
                        <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white/5 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30">NEXT</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V8RawRealityEngine;
// KRAJ FAJLA: V8RawRealityEngine.jsx