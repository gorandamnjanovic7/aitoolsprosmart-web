// POČETAK FAJLA: V8PromptFactory.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { createPortal } from 'react-dom';
import { 
  Terminal, Zap, Cpu, Settings2, CheckCircle, Copy, Database, Sparkles, 
  ChevronDown, MonitorPlay, FileText, FileJson, Trash2, ShieldCheck, 
  Diamond, Crown, ArrowUpCircle, Lock, Download, X, Eye, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { db, auth } from './firebase';
import { doc, onSnapshot, collection, query, where, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { vaultIdeas } from './V8PromptData'; 

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
      <div className="fixed inset-0 z-[999999] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-blue-600 text-white p-3 md:p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:bg-blue-500 transition-all hover:scale-110"><X size={24} md:size={32} strokeWidth={3} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(59,130,246,0.4)] border border-blue-500/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox

const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

const V8PromptFactory = () => {
  const [customIdea, setCustomIdea] = useState('');
  const [selectedVaultIdea, setSelectedVaultIdea] = useState('');
  const [selectedEngine, setSelectedEngine] = useState('STARTER');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedStates, setCopiedStates] = useState({});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Stanja za paginaciju i skrol
  const [currentPage, setCurrentPage] = useState(1);
  const resultsRef = useRef(null);
  const promptsPerPage = 20;

  const [otvorenOpis, setOtvorenOpis] = useState(null);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  // 🔥 SISTEM NAPLATE I KVOTA 🔥
  const [userEmail, setUserEmail] = useState(null); 
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0); 
  const [totalInitialCredits, setTotalInitialCredits] = useState(0); 
  const [amountPaid, setAmountPaid] = useState(0); 
  const [currentPlan, setCurrentPlan] = useState('NONE'); 
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);

  const getAvailableIdeas = () => {
    if (selectedEngine === 'STARTER') return vaultIdeas.slice(0, 51); 
    if (selectedEngine === 'PRO') return vaultIdeas.slice(0, 151);    
    return vaultIdeas;                                                
  };

  const getPromptCount = () => {
    if (selectedEngine === 'STARTER') return 50;
    if (selectedEngine === 'PRO') return 150;
    return 500;
  };

  const pokreniKupovinu = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade
      ? `V8 Prompt Factory - ${paketName.toUpperCase()} (UPGRADE)`
      : `V8 Prompt Factory - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("prompt_factory_checkout_initiated", { 
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: isUpgrade ? "upgrade" : "new" 
    });

    if (!auth.currentUser && !userEmail) {
      setIsLoginRequiredOpen(true);
      return;
    }

    setIsCheckoutOpen(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserEmail(null);
        setIsVIP(false);
        setIsAdmin(false);
        setCredits(0);
        setTotalInitialCredits(0);
        setAmountPaid(0);
        setCurrentPlan('NONE');
        setIsCheckingAccess(false);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);

      const adminCheck = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";
      setIsAdmin(adminCheck);

      if (adminCheck) {
        setIsVIP(true); 
        setCredits(9999);
        setTotalInitialCredits(9999);
        setAmountPaid(299); 
        setCurrentPlan('ENTERPRISE');
        setIsCheckingAccess(false);
        return;
      }

      let payoneerDocs = [];
      let cryptoDocs = [];
      let paypalDocs = [];

      const calculateAccess = () => {
        let hasAccess = false;
        let totalCredits = 0;
        let maxPaid = 0;
        let highestPlan = 'NONE';

        const allDocs = [...payoneerDocs, ...cryptoDocs, ...paypalDocs];

        allDocs.forEach(data => {
          if (data.status === "paid" || data.status === "PAID" || data.status === "PLAĆENO" || data.status === "completed_verified") {
            const productName = data.productName ? data.productName.toUpperCase() : "";
            
            if (productName.includes("PROMPT") || productName.includes("FACTORY") || productName.includes("MATRIX") || productName.includes("SECURITY CHECKOUT")) {
              hasAccess = true;
              
              if (productName.includes("ENTERPRISE")) {
                if (maxPaid < 299) { maxPaid = 299; highestPlan = 'ENTERPRISE'; }
                totalCredits = Math.max(totalCredits, 10000); 
              } else if (productName.includes("PRO")) {
                if (maxPaid < 149) { maxPaid = 149; highestPlan = 'PRO'; }
                totalCredits = Math.max(totalCredits, 2000);
              } else {
                if (maxPaid < 79) { maxPaid = 79; highestPlan = 'STARTER'; }
                totalCredits = Math.max(totalCredits, 500); 
              }
            }
          }
        });

        if (hasAccess) {
          setIsVIP(true);
          setCredits(totalCredits); 
          setTotalInitialCredits(totalCredits); 
          setAmountPaid(maxPaid);
          setCurrentPlan(highestPlan);
        } else {
          setIsVIP(false);
          setCredits(0);
          setTotalInitialCredits(0);
          setAmountPaid(0);
          setCurrentPlan('NONE');
        }
        setIsCheckingAccess(false);
      };

      const unsubPayoneer = onSnapshot(query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email)), snap => {
        payoneerDocs = snap.docs.map(d => d.data());
        calculateAccess();
      });
      const unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
        cryptoDocs = snap.docs.map(d => d.data());
        calculateAccess();
      });
      const unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
        paypalDocs = snap.docs.map(d => d.data());
        calculateAccess();
      });

      return () => { unsubPayoneer(); unsubCrypto(); unsubPayPal(); };
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FUNKCIJE ZA KOPIRANJE
  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("factory_copied_all", { plan: currentPlan });
  };

  const copySingle = async (index, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [index]: true }));
    setTimeout(() => {
       setCopiedStates(prev => ({ ...prev, [index]: false }));
    }, 2000);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("factory_copied_single", { plan: currentPlan });
  };

  const generisiPromptove = async () => {
    if (credits <= 0 && isVIP && !isAdmin) {
        alert("INSUFFICIENT CREDITS! Please wait for refill or upgrade your plan.");
        return;
    }

    const finalIdea = customIdea || selectedVaultIdea;
    if (!finalIdea) {
      alert("Please enter your idea or select one from the V8 Vault.");
      return;
    }
    
    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("factory_generation_started", { 
        engine: selectedEngine,
        is_custom_idea: customIdea !== '',
        expected_count: getPromptCount()
    });

    setIsGenerating(true);
    setGeneratedResult(null);
    setCurrentPage(1);
    setCopiedStates({});

    try {
      const response = await fetch(`${BASE_BACKEND_URL}/api/generate-prompt-matrix`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: finalIdea,
          tier: selectedEngine
        })
      });

      if (!response.ok) {
        throw new Error("V8 Server Error");
      }

      const data = await response.json();
      setGeneratedResult(data.result);

      // 🔥 GA4 ANALITIKA 🔥
      trackV8Action("factory_generation_success", { engine: selectedEngine });

    } catch (error) {
      console.error("V8 Engine failure:", error);
      alert("Došlo je do greške u komunikaciji sa serverom. Proveri terminal gde ti radi server.js.");
      setGeneratedResult("⚠️ ERROR: V8 Engine connection failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const parsedPrompts = React.useMemo(() => {
    if (!generatedResult) return [];
    const promptRegex = /\d+\.\s+([\s\S]*?)(?=\n+\d+\.\s+|\n+=+|\n+✅|$)/g;
    const matches = [...generatedResult.matchAll(promptRegex)];
    return matches.map(m => m[1].trim());
  }, [generatedResult]);

  const totalPages = Math.ceil(parsedPrompts.length / promptsPerPage);
  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = parsedPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      if (resultsRef.current) {
        const yOffset = -50; 
        const y = resultsRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 50);
  };

  const downloadTxt = () => {
    if (!generatedResult) return;
    const element = document.createElement("a");
    const file = new Blob([generatedResult], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "V8_Prompt_Matrix.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("factory_download_txt", { count: parsedPrompts.length });
  };

  const downloadJson = () => {
    if (parsedPrompts.length === 0) return;
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify({ prompts: parsedPrompts }, null, 2)], {type: 'application/json'});
    element.href = URL.createObjectURL(file);
    element.download = "V8_Prompt_Matrix.json";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("factory_download_json", { count: parsedPrompts.length });
  };

  const clearResults = () => {
    setGeneratedResult(null);
    setCurrentPage(1);
    setCopiedStates({});
  };

  const renderPricingPlans = () => {
    if (amountPaid >= 299) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4">
           <div className="bg-gradient-to-r from-[#020617]/80 to-[#0f172a]/80 backdrop-blur-md border border-blue-500/40 rounded-3xl md:rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden">
              <Crown className="w-16 h-16 md:w-20 md:h-20 text-blue-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
                ENTERPRISE TIER <span className="text-blue-500 block md:inline mt-2 md:mt-0">UNLOCKED</span>
              </h2>
              <p className="text-blue-200/60 font-bold uppercase tracking-widest text-[10px] md:text-sm max-w-2xl mx-auto">
                You possess the highest level V8 License. All Prompt Matrix protocols are fully operational at maximum capacity.
              </p>
           </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-12 md:mt-16 px-4 relative z-10">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."} <span className="text-blue-500 block lg:inline mt-2 lg:mt-0">CHOOSE YOUR PLAN.</span>
          </h2>
          
          <div className="mt-6 md:mt-8 bg-[#0a0a0a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className="text-blue-500 font-black uppercase tracking-[0.2em] text-[11px] md:text-[13px] border-b border-blue-500/20 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
             </h4>
             <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.</p>
             <p className="text-[12px] md:text-[14px] text-zinc-300 leading-relaxed"><strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Factory Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
          </div>
        </div>

        {/* PRILAGOĐEN GRID ZA MOBILNE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-sm lg:max-w-none mx-auto z-10 relative">
          
          {amountPaid < 79 && (
            <div className="w-full bg-[#050505]/60 backdrop-blur-md border border-blue-500/30 rounded-3xl p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto"><Diamond className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                <span className="text-4xl font-black text-blue-400 my-4 text-center">$79</span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] md:text-[12px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 500 Credits Included</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 50 Prompts per generation</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">⏳</span> Use in 24h or stretch over 365 days</p>
                </div>
                <button onClick={() => pokreniKupovinu('STARTER', 79)} className="w-full bg-blue-600/20 border border-blue-500/50 text-white hover:bg-blue-500 hover:border-transparent py-4 rounded-xl font-black uppercase tracking-widest text-[12px] md:text-[13px] transition-all shadow-md">
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 149 && (
            <div className="w-full bg-[#050505]/80 backdrop-blur-xl border-2 border-indigo-500/50 rounded-3xl p-8 flex flex-col relative hover:border-indigo-500/80 transition-all shadow-[0_0_30px_rgba(99,102,241,0.2)] transform lg:scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-t-[1.4rem]"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg whitespace-nowrap">Bestseller</div>
                
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/20 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-indigo-400" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className="text-4xl font-black text-indigo-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${149 - amountPaid}` : "$149"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] md:text-[12px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 2,000 Credits Included</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 150 Prompts per gen</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">⏳</span> Use in 24h or stretch over 365 days</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 149)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] md:text-[13px] transition-all ${amountPaid > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'}`}>
                   {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
                </button>
            </div>
          )}

          {amountPaid < 299 && (
            <div className="w-full bg-[#050505]/60 backdrop-blur-md border border-purple-500/30 rounded-3xl p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto"><Crown className="w-6 h-6 text-purple-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
                <span className="text-4xl font-black text-purple-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${299 - amountPaid}` : "$299"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] md:text-[12px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 10,000 Credits Included</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">✅</span> 500 Prompts per gen</p>
                   <p className="flex items-start gap-2"><span className="shrink-0">🔄</span> Lifetime Rolling Quota</p>
                </div>
                <button onClick={() => pokreniKupovinu('ENTERPRISE', 299)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] md:text-[13px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-purple-600/20 border border-purple-500/50 text-white hover:bg-purple-500 hover:border-transparent'}`}>
                   {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
                </button>
            </div>
          )}
        </div>

        {amountPaid > 0 && amountPaid < 299 && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-12 mb-10 bg-gradient-to-r from-blue-950/60 to-blue-900/20 border border-blue-500/40 p-6 md:p-8 rounded-3xl md:rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 shadow-[0_0_40px_rgba(59,130,246,0.25)] relative overflow-hidden backdrop-blur-md">
             <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             
             <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-900/40 rounded-full flex items-center justify-center border border-blue-500/50 relative flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin"></div>
                <ArrowUpCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-400" />
             </div>

             <div className="text-center md:text-left relative z-10">
                <div className="inline-block bg-blue-900/50 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 font-bold uppercase tracking-widest text-[9px] mb-3">
                  SMART UPGRADE SYSTEM ACTIVE
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                  PRORATED UPGRADE POLICY
                </h3>
                <p className="text-zinc-300 text-[12px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                  System radar has detected your active V8 License valued at <strong className="text-blue-400">${amountPaid}</strong>. 
                  You can upgrade to a higher tier by paying <strong className="text-white border-b border-blue-500/50 pb-0.5">ONLY THE PRICE DIFFERENCE</strong>. The package prices displayed above have already been automatically reduced!
                </p>
             </div>
           </motion.div>
        )}
      </div>
    );
  };

  const renderPromptSecrets = () => {
    const secrets = [
        { t: "1. The Rule of Extremes", d: "High-end cinematic visuals", insight: "V8 Factory automatically injects extreme angles (like 'low-angle drone shot') and dramatic lighting ('high-contrast chiaroscuro') to ensure images look highly produced, not basic." },
        { t: "2. The 'Raw/Unedited' Token", d: "Hyper-realistic rendering", insight: "By appending 'raw unedited photography' to prompts, the AI disables its internal 'painting/plastic' filters, forcing a photographic output style." },
        { t: "3. Format Directives", d: "Midjourney parameters", insight: "The Factory inherently adds aspect ratios (--ar 16:9) and styling parameters (--style raw) that most beginners forget, locking in the cinematic frame." },
        { t: "4. Explicit Light Placement", d: "Studio-level lighting setups", insight: "Instead of saying 'bright', the Factory uses terms like 'rim lit from behind, soft key light'. This controls the actual 3D rendering of the light within the AI." },
        { t: "5. Negative Guardrails", d: "Preventing AI hallucinations", insight: "The matrix adds negative constraints (e.g. '--no text, watermark, plastic, blurry') to physically block the AI from generating unwanted artifacts." },
        { t: "6. Semantic Weighting", d: "Controlling subject focus", insight: "The system organizes words so the primary subject is always first. AI models lose focus on words placed at the end of long prompts." },
        { t: "7. Hardware Emulation", d: "Camera and Lens specific", insight: "Using tags like 'shot on 35mm lens, f/1.4, Sony A7R IV' forces the AI to emulate depth of field and bokeh characteristics of real equipment." },
        { t: "8. The Concept of 'Chaos'", d: "Controlled variations", insight: "When generating 500 prompts, V8 uses a seed algorithm to introduce 'controlled chaos', ensuring every prompt is genuinely unique while staying on-topic." },
        { t: "9. Atmosphere & Weather", d: "Adding narrative depth", insight: "A car is just a car, but a car 'in pouring rain with neon reflections on wet asphalt' tells a story. The Factory always adds environmental context." },
        { t: "10. De-Branding Locks", d: "Commercial safety", insight: "The system uses specific terminology ('unbranded', 'debadged') to ensure the generated assets are legally safe for commercial use and resale." }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mb-10 bg-black/40 border border-white/5 rounded-3xl md:rounded-[2rem] p-6 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          
          <div className="absolute inset-0 bg-blue-900/10 z-0 pointer-events-none"></div>

          <div className="text-center mb-8 md:mb-10 relative z-10">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.2em] text-white">TOP 10 HIDDEN SECRETS</h2>
            <p className="text-[10px] md:text-[12px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-3 italic">Cheat Sheet of Hidden Tokens</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 items-start relative z-10">
            {secrets.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setOtvorenOpis(isOpen ? null : i)}
                  className={`bg-white/5 border p-5 md:p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isOpen ? 'border-blue-500/50 bg-black/40 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div className="pr-4">
                      <h4 className="text-blue-400 font-black uppercase text-[12px] md:text-[14px] leading-tight">{item.t}</h4>
                      <p className="text-[10px] md:text-[12px] text-zinc-400 mt-1.5">{item.d}</p>
                    </div>
                    <ChevronDown 
                      size={18} 
                      className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'text-zinc-600 group-hover:text-zinc-400'}`} 
                    />
                  </div>
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 border-blue-500 pl-3">
                        <span className="text-blue-500 font-bold">Effect Triggered:</span> {item.insight}
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

  const availableIdeas = getAvailableIdeas();
  const currentPromptCount = getPromptCount();

  const isProLocked = !isAdmin && amountPaid < 149;
  const isEnterpriseLocked = !isAdmin && amountPaid < 299;

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-x-hidden">
      
      {/* 🔥 SEO HELMET OTIMIZOVAN ZA MOBILNE 🔥 */}
      <Helmet>
        <title>V8 Prompt Factory | Epic Prompt Matrix Generator</title>
        <meta name="description" content="Multiply a single idea into a massive matrix of IP-Safe, professional Midjourney prompts. Ultimate tool for epic, evidence-grade AI cinematography." />
        <meta name="keywords" content="V8 engine, prompt factory, midjourney prompts, ip-safe prompts, ai cinematography, stable diffusion, premium ai art" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>

      {/* FULL SCREEN LIGHTBOX */}
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      {/* 🔥 GLOBALNA VIDEO POZADINA ZA CELU STRANICU (FIXED) 🔥 */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-[#020617]">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover scale-105 opacity-60">
          <source src="/v8-factory-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[#020617]/85 backdrop-blur-sm"></div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 pt-24 md:pt-28 pb-20 relative z-10">
        
        {/* 🔥 HEADER BOX 🔥 */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-full mx-auto mb-10 md:mb-12 rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] bg-[#020617]"
        >
            <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30 z-0 pointer-events-none mix-blend-screen">
               <source src="/v8-header-bg.mp4" type="video/mp4" />
            </video>
            
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#020617]/40 via-[#020617]/70 to-[#020617]/95"></div>
            
            <div className="relative z-10 py-12 px-5 md:py-16 md:px-6 text-center flex flex-col items-center">
                <div className="inline-block bg-blue-600/20 border border-blue-500/40 px-4 py-2 md:px-5 md:py-2 rounded-full text-blue-400 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.3)] backdrop-blur-sm">
                    V8 SAAS // PROMPT MATRIX GENERATOR
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-3 md:gap-4 flex-wrap">
                    <Terminal className="text-blue-500 w-10 h-10 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    PROMPT <span className="text-transparent bg-clip-text bg-gradient-to-b from-blue-400 to-indigo-600 drop-shadow-none">FACTORY</span>
                </h1>
                
                <div className="bg-[#050505]/70 backdrop-blur-lg border border-blue-500/30 p-6 md:p-8 rounded-3xl md:rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8 relative overflow-hidden">
                    <h4 className="text-white font-black uppercase tracking-widest text-[12px] md:text-sm mb-4 border-b border-white/10 pb-4 relative z-10">The Matrix Engine Explained:</h4>
                    <p className="text-zinc-300 text-[12px] md:text-[13px] leading-relaxed mb-4 relative z-10">
                        The V8 Prompt Factory eliminates the "blank page syndrome". Input your basic idea, or select one of our pre-engineered Elite Concepts. 
                    </p>
                    <p className="text-zinc-300 text-[12px] md:text-[13px] leading-relaxed relative z-10">
                        Our backend will instantly multiply that single idea into a massive matrix of professional prompts, injecting secret camera tokens, lighting setups, and format variations automatically.
                    </p>
                </div>

                {/* 🔥 PRAVI KORISNIČKI BROJAČI KREDITA 🔥 */}
                {(isVIP || isAdmin) && (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12 relative z-20 w-full max-w-3xl mx-auto">
                    
                    <div className="bg-[#020617]/80 backdrop-blur-xl border border-blue-500/30 px-5 md:px-6 py-4 rounded-2xl flex items-center justify-center sm:justify-start gap-4 md:gap-5 shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full sm:w-1/2 group">
                       <div className="bg-blue-900/40 p-2.5 md:p-3 rounded-xl border border-blue-500/20 shrink-0">
                          <Database className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
                       </div>
                       <div className="flex flex-col text-left">
                          <span className="text-[8px] md:text-[9px] text-blue-300 font-black uppercase tracking-[0.2em] mb-1">AVAILABLE CREDITS</span>
                          <span className="text-xl md:text-2xl font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                              {credits}
                          </span>
                       </div>
                    </div>
                    
                    <div className="bg-[#020617]/80 backdrop-blur-xl border border-indigo-500/30 px-5 md:px-6 py-4 rounded-2xl flex items-center justify-center sm:justify-start gap-4 md:gap-5 shadow-[0_0_30px_rgba(99,102,241,0.15)] w-full sm:w-1/2 group">
                       <div className="bg-indigo-900/40 p-2.5 md:p-3 rounded-xl border border-indigo-500/20 shrink-0">
                          <Zap className="text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
                       </div>
                       <div className="flex flex-col text-left">
                          <span className="text-[8px] md:text-[9px] text-indigo-300 font-black uppercase tracking-[0.2em] mb-1">CREDITS SPENT</span>
                          <span className="text-xl md:text-2xl font-black text-white tracking-widest flex items-center gap-3">
                              {totalInitialCredits - credits}
                          </span>
                       </div>
                    </div>
                  </div>
                )}
            </div>
        </motion.div>

        {/* 🔥 NOVI ACCORDION: 10 SECRET PROMPTS 🔥 */}
        {renderPromptSecrets()}

        {/* 🔥 DOWNLOAD DUGME (SAMO LICENCA) 🔥 */}
        <div className="flex justify-center max-w-md mx-auto mb-16 relative z-10 w-full px-4 md:px-0">
          <a href="/v8-license.pdf" download onClick={() => trackV8Action("download_factory_license")} className="w-full bg-black/40 border border-indigo-500/30 hover:border-indigo-400 p-5 md:p-6 rounded-2xl flex items-center gap-4 md:gap-5 transition-all duration-300 hover:bg-indigo-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)]">
              <div className="bg-indigo-500/10 p-3 md:p-4 rounded-full border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all shrink-0"><FileText className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" /></div>
              <div className="text-left">
                  <h4 className="text-white font-black uppercase tracking-widest text-[12px] md:text-[13px] mb-1">Commercial License</h4>
                  <p className="text-zinc-400 text-[10px] md:text-[11px] font-bold">Download Legal Terms (PDF)</p>
              </div>
          </a>
        </div>

        {/* 🔥 NOVI 2x2 SHOWCASE GRID 🔥 */}
        <div className="w-full max-w-5xl mx-auto mt-10 md:mt-12 mb-16 md:mb-20 relative z-10 px-4">
           <div className="text-center mb-8 md:mb-10">
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.2em] text-white">VISUAL PROOF</h2>
             <p className="text-[10px] md:text-[12px] lg:text-[14px] text-blue-500 font-bold uppercase tracking-[0.3em] mt-2 italic">Prompt Factory Outputs</p>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
             <div className="bg-black/50 border border-blue-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/60 transition-all duration-500 aspect-video relative">
                <img src="/factory-1.webp" alt="Factory Output 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/factory-1.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /><span className="text-blue-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase">Matrix Render #001</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/factory-1.webp')} className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-blue-500/30 text-blue-400 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={14} md:size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-blue-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/60 transition-all duration-500 aspect-video relative">
                <img src="/factory-2.webp" alt="Factory Output 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/factory-2.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /><span className="text-blue-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase">Matrix Render #002</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/factory-2.webp')} className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-blue-500/30 text-blue-400 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={14} md:size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-blue-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/60 transition-all duration-500 aspect-video relative">
                <img src="/factory-3.webp" alt="Factory Output 3" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/factory-3.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /><span className="text-blue-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase">Matrix Render #003</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/factory-3.webp')} className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-blue-500/30 text-blue-400 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={14} md:size={16} />
                </button>
             </div>
             
             <div className="bg-black/50 border border-blue-500/30 rounded-2xl overflow-hidden group shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:border-blue-500/60 transition-all duration-500 aspect-video relative">
                <img src="/factory-4.webp" alt="Factory Output 4" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setFullScreenImageUrl('/factory-4.webp')} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-6 pointer-events-none">
                   <div className="flex items-center gap-2"><Eye className="w-3 h-3 md:w-4 md:h-4 text-blue-400" /><span className="text-blue-400 font-black text-[9px] md:text-[10px] tracking-widest uppercase">Matrix Render #004</span></div>
                </div>
                <button onClick={() => setFullScreenImageUrl('/factory-4.webp')} className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-blue-500/30 text-blue-400 opacity-0 group-hover:opacity-100 hover:bg-blue-500 hover:text-black transition-all z-20 shadow-lg">
                   <Maximize size={14} md:size={16} />
                </button>
             </div>
           </div>
        </div>

        {/* PRICING PLANS SEKCIJA */}
        {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
           <div className="relative z-20 w-full">{renderPricingPlans()}</div>
        )}

        {/* GLAVNI ALAT */}
        <div className={`transition-all duration-500 ${!isVIP && !isAdmin ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          
          <div className="bg-[#020617]/40 backdrop-blur-xl p-6 md:p-12 rounded-3xl md:rounded-[2.5rem] border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 relative z-10 mb-10 md:mb-16 items-stretch">
              
              {/* POLJE 1: IDEJA KORISNIKA */}
              <div className="flex flex-col gap-6 md:gap-8 h-full">
                <div className="flex flex-col gap-3 relative">
                  <label className="font-black text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 text-blue-500">
                    <Sparkles size={14} /> 1. INPUT YOUR CUSTOM IDEA
                  </label>
                  
                  <div className="relative w-full">
                    <textarea 
                      value={customIdea} 
                      onChange={(e) => { 
                        setCustomIdea(e.target.value); 
                        setSelectedVaultIdea(''); 
                      }} 
                      disabled={selectedVaultIdea !== ''}
                      placeholder="e.g. A futuristic car driving through a misty alpine pass..." 
                      className={`bg-black/50 border border-white/10 focus:border-blue-500 p-4 md:p-5 pr-12 md:pr-14 rounded-2xl text-[13px] md:text-[14px] text-white outline-none resize-none h-28 md:h-32 transition-all w-full shadow-inner ${selectedVaultIdea !== '' ? 'opacity-30 grayscale cursor-not-allowed' : ''}`} 
                    />
                    
                    <AnimatePresence>
                      {customIdea && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setCustomIdea('')}
                          title="Clear text"
                          className="absolute top-2 right-2 md:top-3 md:right-3 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white p-1.5 md:p-2 rounded-xl transition-all shadow-lg"
                        >
                          <X size={14} md:size={16} strokeWidth={3} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:gap-4">
                  <div className="h-px bg-white/10 flex-1"></div>
                  <span className="text-zinc-600 font-black text-[9px] md:text-[10px] uppercase tracking-widest">OR</span>
                  <div className="h-px bg-white/10 flex-1"></div>
                </div>

                {/* POLJE 2: TREZOR (VAULT) */}
                <div className="flex flex-col gap-3">
                  <label className="font-black text-[10px] md:text-[11px] tracking-widest uppercase flex items-center justify-between text-indigo-400">
                    <div className="flex items-center gap-2">
                      <Database size={14} /> 2. SELECT FROM MASTER VAULT
                    </div>
                    <span className="text-[8px] md:text-[9px] text-zinc-500 bg-white/5 px-2 py-1 rounded">
                      {availableIdeas.length - 1} IDEAS
                    </span>
                  </label>
                  
                  <div className={`relative ${customIdea ? 'opacity-30 grayscale pointer-events-none' : ''}`} ref={dropdownRef}>
                    <div 
                      onClick={() => !customIdea && setIsDropdownOpen(!isDropdownOpen)}
                      className={`bg-black/50 border ${isDropdownOpen || selectedVaultIdea ? 'border-indigo-400' : 'border-indigo-500/30'} text-white text-[12px] md:text-[13px] font-bold p-4 md:p-5 rounded-2xl w-full flex justify-between items-center transition-all shadow-inner ${customIdea ? 'cursor-not-allowed' : 'cursor-pointer hover:border-indigo-400'}`}
                    >
                      <span className="truncate pr-3 md:pr-4 text-zinc-300">
                        {selectedVaultIdea || "Browse Elite Concepts..."}
                      </span>
                      
                      {selectedVaultIdea ? (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedVaultIdea(''); 
                          }} 
                          className="bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white p-1 md:p-1.5 rounded-lg transition-all z-10 shrink-0 shadow-md"
                          title="Clear Selection"
                        >
                          <X size={14} md:size={16} strokeWidth={3}/>
                        </button>
                      ) : (
                        <ChevronDown className={`text-indigo-400 transition-transform duration-300 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} size={16} md:size={18} />
                      )}
                    </div>

                    <AnimatePresence>
                      {isDropdownOpen && !customIdea && !selectedVaultIdea && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#0a0a0a] border border-indigo-500/30 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                          <div className="max-h-56 md:max-h-64 overflow-y-auto custom-scrollbar">
                            {availableIdeas.map((idea, idx) => {
                              if (idea === "") return null;
                              return (
                                <div 
                                  key={idx} 
                                  onClick={() => {
                                    setSelectedVaultIdea(idea);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="p-3 md:p-4 hover:bg-indigo-600/20 text-zinc-300 hover:text-white text-[12px] md:text-[13px] border-b border-white/5 last:border-b-0 cursor-pointer transition-colors"
                                >
                                  {idea}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* POLJE 3: ENGINE I GENERISANJE */}
              <div className="flex flex-col gap-6 md:gap-8 h-full bg-[#050505]/50 border border-blue-500/20 p-6 md:p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none"></div>
                
                <div className="flex flex-col gap-3 relative z-10">
                  <label className="font-black text-[10px] md:text-[11px] tracking-widest uppercase flex items-center gap-2 text-indigo-400">
                    <Settings2 size={14} /> 3. MATRIX CORE SELECTOR
                  </label>
                  <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {['STARTER', 'PRO', 'ENTERPRISE'].map((tier) => {
                      const isLocked = (tier === 'PRO' && isProLocked) || (tier === 'ENTERPRISE' && isEnterpriseLocked);
                      
                      let activeStyle = "";
                      if (tier === 'STARTER') activeStyle = "bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]";
                      if (tier === 'PRO') activeStyle = "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]";
                      if (tier === 'ENTERPRISE') activeStyle = "bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]";

                      return (
                        <button
                          key={tier}
                          onClick={() => setSelectedEngine(tier)}
                          disabled={isLocked}
                          className={`relative p-3 md:p-4 rounded-2xl font-black text-[9px] md:text-[11px] uppercase tracking-widest transition-all border flex flex-col items-center justify-center gap-1 md:gap-2 ${
                            selectedEngine === tier
                              ? activeStyle
                              : isLocked
                                ? 'bg-[#050505] border-white/5 text-zinc-600 cursor-not-allowed opacity-50'
                                : 'bg-[#0a0a0a] border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {isLocked && <Lock size={12} className="absolute top-2 right-2 md:top-3 md:right-3 opacity-50" />}
                          {tier === 'STARTER' && <MonitorPlay size={16} md:size={20} className={selectedEngine === tier ? 'text-white' : 'text-blue-500/50'}/>}
                          {tier === 'PRO' && <Zap size={16} md:size={20} className={selectedEngine === tier ? 'text-white' : 'text-indigo-500/50'}/>}
                          {tier === 'ENTERPRISE' && <Cpu size={16} md:size={20} className={selectedEngine === tier ? 'text-white' : 'text-purple-500/50'}/>}
                          <span>{tier}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-auto pt-6 md:pt-8 border-t border-white/10">
                  <button 
                    onClick={generisiPromptove} 
                    disabled={isGenerating || (!customIdea && !selectedVaultIdea) || (credits <= 0 && !isAdmin)} 
                    className={`w-full font-black text-[14px] md:text-[16px] uppercase tracking-widest py-4 md:py-5 rounded-2xl transition-all flex items-center justify-center gap-2 md:gap-3 ${
                      (!customIdea && !selectedVaultIdea) || (credits <= 0 && !isAdmin)
                        ? 'bg-zinc-900/80 text-zinc-600 cursor-not-allowed border border-white/5' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02]'
                    } disabled:opacity-50`}
                  >
                    {isGenerating ? 'BUILDING MATRIX...' : (credits <= 0 && !isAdmin && isVIP) ? 'INSUFFICIENT CREDITS' : `GENERATE ${currentPromptCount} PROMPTS`} 
                    {isGenerating && <Settings2 size={18} md:size={20} className="animate-spin" />}
                  </button>
                </div>

              </div>
            </div>

            <AnimatePresence>
              {generatedResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  className="mt-8 md:mt-10 border-t border-white/10 pt-10 md:pt-16"
                >
                  <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 justify-center">
                      <Terminal className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
                      <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white text-center">GENERATED MATRIX</h2>
                  </div>
                  
                  <div className="bg-black/60 backdrop-blur-md border border-blue-500/30 rounded-2xl md:rounded-3xl p-5 md:p-8 relative overflow-hidden group shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
                    
                    {/* AKCIJSKI DUGMIĆI ZA REZULTATE - PRILAGOĐENO ZA MOBILNE */}
                    <div ref={resultsRef} className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b border-white/10 pb-4 gap-4">
                        <span className="text-blue-400 font-black text-[11px] md:text-[12px] uppercase tracking-widest flex items-center gap-2">
                          <MonitorPlay size={14} md:size={16}/> READY TO DEPLOY ({parsedPrompts.length} PROMPTS):
                        </span>
                        
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-center">
                          <button 
                            onClick={downloadTxt} 
                            className="hover:text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl transition-all shadow-inner text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30"
                          >
                             <FileText size={12} md:size={14}/> TXT
                          </button>
                          <button 
                            onClick={downloadJson} 
                            className="hover:text-white text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl transition-all shadow-inner text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30"
                          >
                             <FileJson size={12} md:size={14}/> JSON
                          </button>
                          
                          <button 
                            onClick={handleCopy} 
                            className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 md:py-2 rounded-xl transition-all shadow-inner border ${
                              copied 
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                                : 'text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white border-blue-500/30'
                            }`}
                          >
                             {copied ? <CheckCircle size={12} md:size={14} className="text-black"/> : <Copy size={12} md:size={14}/>} 
                             {copied ? 'COPIED!' : 'COPY ALL'}
                          </button>

                          <button 
                            onClick={clearResults} 
                            title="Clear Prompts"
                            className="text-red-500 hover:text-white animate-pulse p-1.5 md:p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          >
                             <Trash2 size={14} md:size={16}/>
                          </button>
                        </div>
                    </div>
                    
                    {parsedPrompts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {currentPrompts.map((prompt, index) => {
                          const absoluteIndex = indexOfFirstPrompt + index;
                          return (
                            <div key={absoluteIndex} className="bg-black/50 border border-blue-500/20 p-3 md:p-4 rounded-xl shadow-inner hover:border-blue-500/60 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] transition-all relative group flex flex-col">
                              <div className="flex justify-between items-start mb-2 pb-2 border-b border-white/5">
                                <span className="text-blue-500 font-bold text-[9px] md:text-[10px]">PROMPT #{absoluteIndex + 1}</span>
                                
                                <button 
                                  onClick={() => copySingle(absoluteIndex, prompt)} 
                                  className={`transition-all px-1.5 py-1 md:px-2 rounded flex items-center gap-1.5 text-[8px] md:text-[9px] font-black uppercase ${
                                    copiedStates[absoluteIndex] 
                                      ? 'bg-emerald-500 text-black opacity-100 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                      : 'md:opacity-0 group-hover:opacity-100 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white'
                                  }`}
                                  title="Copy this prompt"
                                >
                                  {copiedStates[absoluteIndex] ? <><CheckCircle size={10} /> Copied</> : <Copy size={10} md:size={12} />}
                                </button>
                              </div>
                              <p className="text-zinc-300 text-[11px] md:text-[12px] leading-relaxed break-words font-mono">
                                {prompt}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-zinc-300 text-[12px] md:text-[13px] leading-relaxed bg-white/5 p-4 md:p-5 rounded-2xl font-mono shadow-inner whitespace-pre-wrap">
                        {generatedResult}
                      </div>
                    )}

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-white/10 flex-wrap">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl text-[11px] md:text-[13px] font-black transition-all ${
                              currentPage === page 
                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-110' 
                                : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-blue-400 border border-transparent hover:border-blue-500/30'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
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

export default V8PromptFactory;
// KRAJ FAJLA: V8PromptFactory.jsx