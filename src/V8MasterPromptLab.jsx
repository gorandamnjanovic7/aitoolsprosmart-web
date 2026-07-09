// POČETAK FAJLA: V8MasterPromptLab.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // 🔥 DODATO ZA SEO 🔥
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Layers, Watch, Camera, Coffee, Cpu, Palette, Crown, ShieldCheck, Diamond } from 'lucide-react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

const ARCHETYPES = [
  { id: 'auto', name: 'Luxury Automotive', icon: <Zap size={18}/> },
  { id: 'arch', name: 'Architecture', icon: <Layers size={18}/> },
  { id: 'fashion', name: 'Fashion & Editorial', icon: <Target size={18}/> },
  { id: 'product', name: 'Premium Product', icon: <Watch size={18}/> },
  { id: 'cinematic', name: 'Cinematic Drama', icon: <Camera size={18}/> },
  { id: 'food', name: 'Culinary Art', icon: <Coffee size={18}/> },
  { id: 'tech', name: 'Innovation & Tech', icon: <Cpu size={18}/> },
  { id: 'abstract', name: 'Abstract Art', icon: <Palette size={18}/> }
];

export default function V8MasterPromptLab() {
  const [amountPaid, setAmountPaid] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState(null);
  const [promptInput, setPromptInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Checkout i Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  // 1. Logic for Access Control
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setIsVIP(false);
        setIsAdmin(false);
        setAmountPaid(0);
        return;
      }
      
      const email = user.email.toLowerCase();
      const adminCheck = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";
      setIsAdmin(adminCheck);

      if (adminCheck) {
        setIsVIP(true);
        setAmountPaid(550);
        return;
      }
      
      const qPay = query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email));
      onSnapshot(qPay, (snap) => {
        let maxPaid = 0;
        snap.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === "paid" || data.status === "PAID" || data.status === "completed_verified") {
                if (data.productName?.toUpperCase().includes("PROMPT") || data.productName?.toUpperCase().includes("SECURITY CHECKOUT")) {
                    if (data.productName?.toUpperCase().includes("ENTERPRISE")) {
                        if (maxPaid < 550) maxPaid = 550;
                    } else if (data.productName?.toUpperCase().includes("PRO")) {
                        if (maxPaid < 250) maxPaid = 250;
                    } else {
                        if (maxPaid < 150) maxPaid = 150;
                    }
                }
            }
        });
        setAmountPaid(maxPaid);
        setIsVIP(maxPaid > 0);
      });
    });
    return () => unsubAuth();
  }, []);

  const pokreniKupovinu = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;

    const naslovCheckouta = isUpgrade
      ? `PROMPT LAB - ${paketName.toUpperCase()} (UPGRADE)`
      : `PROMPT LAB - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("promptlab_checkout_initiated", { 
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: isUpgrade ? "upgrade" : "new" 
    });

    if (!currentUser && !auth.currentUser) {
      setIsLoginRequiredOpen(true);
      return;
    }

    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] p-6 md:p-12 font-sans relative">
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>Master Prompt Lab | V8 Commercial AI Prompts</title>
        <meta name="description" content="Generate master-level cinematic, luxury, and commercial AI prompts with the V8 Prompt Lab. Engineered for visual supremacy." />
        <meta name="keywords" content="ai prompt generator, midjourney prompts, cinematic prompts, luxury ai prompts, master prompt lab, commercial ai art" />
      </Helmet>

      {/* Modali za Checkout i Login */}
      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        packageName={checkoutProduct}
        price={checkoutPrice}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginRequiredOpen(false);
          setTimeout(() => setIsCheckoutOpen(true), 250);
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

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto text-center mb-16 mt-16">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-[#D4AF37] italic">V8 MASTER PROMPT LAB</h1>
        <p className="text-zinc-500 font-medium tracking-[0.3em] text-xs uppercase">Engineered for commercial precision & visual supremacy</p>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
               <textarea 
                 value={promptInput}
                 onChange={(e) => setPromptInput(e.target.value)}
                 className="w-full bg-transparent text-xl outline-none placeholder:text-zinc-700 font-light min-h-[160px]" 
                 placeholder="Paste your vision, or choose an archetype..." 
               />
               <button 
                 onClick={() => {
                   // 🔥 GA4 ANALITIKA 🔥
                   trackV8Action("master_prompts_generated", { 
                     archetype: selectedArchetype || "custom", 
                     has_input: promptInput.length > 0 
                   });
                 }}
                 className="mt-4 w-full bg-[#D4AF37] text-black font-black uppercase text-sm py-4 rounded-xl hover:bg-[#b8962f] transition-all"
               >
                 Generate Master Prompts
               </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ARCHETYPES.map(arch => (
                <button 
                  key={arch.id} 
                  onClick={() => {
                    setSelectedArchetype(arch.id);
                    // 🔥 GA4 ANALITIKA 🔥
                    trackV8Action("archetype_selected", { archetype: arch.name });
                  }} 
                  className={`p-4 rounded-xl border transition-all bg-[#0A0A0A] text-[10px] uppercase font-black flex flex-col items-center gap-2 ${selectedArchetype === arch.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/5 text-zinc-400 hover:border-zinc-700'}`}
                >
                  {arch.icon} {arch.name}
                </button>
              ))}
            </div>
        </div>

        {/* Sidebar sa paketima i Upgrade Box-om */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6 self-start">
           <h3 className="text-[#D4AF37] font-black uppercase text-sm border-b border-white/5 pb-4">Tier Access</h3>
           
           {/* Starter Paket */}
           {amountPaid < 150 && (
             <div className="p-5 bg-black rounded-2xl border border-blue-900/30 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 <Diamond className="text-blue-500 w-5 h-5" />
                 <div>
                   <h4 className="text-white font-bold text-sm uppercase">Starter</h4>
                   <p className="text-zinc-500 text-xs">500 Credits Included</p>
                 </div>
               </div>
               <button 
                 onClick={() => pokreniKupovinu('STARTER', 150)}
                 className="w-full py-3 rounded-lg bg-blue-600 text-white text-xs font-black uppercase hover:bg-blue-500 transition-colors"
               >
                 Select Starter - $150
               </button>
             </div>
           )}

           {/* Pro Paket */}
           {amountPaid < 250 && (
             <div className="p-5 bg-black rounded-2xl border border-orange-500/30 flex flex-col gap-3 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-orange-500 text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">POPULAR</div>
               <div className="flex items-center gap-3">
                 <Zap className="text-orange-500 w-5 h-5" />
                 <div>
                   <h4 className="text-white font-bold text-sm uppercase">Pro</h4>
                   <p className="text-zinc-500 text-xs">2,000 Credits Included</p>
                 </div>
               </div>
               <button 
                 onClick={() => pokreniKupovinu('PRO', 250)}
                 className="w-full py-3 rounded-lg bg-orange-600 text-white text-xs font-black uppercase hover:bg-orange-500 transition-colors"
               >
                 {amountPaid > 0 ? "Upgrade to Pro" : "Select Pro - $250"}
               </button>
             </div>
           )}

           {/* Enterprise Paket */}
           {amountPaid < 550 && (
             <div className="p-5 bg-black rounded-2xl border border-purple-500/30 flex flex-col gap-3">
               <div className="flex items-center gap-3">
                 <Crown className="text-purple-500 w-5 h-5" />
                 <div>
                   <h4 className="text-white font-bold text-sm uppercase">Enterprise</h4>
                   <p className="text-zinc-500 text-xs">10,000 Credits Included</p>
                 </div>
               </div>
               <button 
                 onClick={() => pokreniKupovinu('ENTERPRISE', 550)}
                 className="w-full py-3 rounded-lg bg-purple-600 text-white text-xs font-black uppercase hover:bg-purple-500 transition-colors"
               >
                 {amountPaid > 0 ? "Upgrade to Enterprise" : "Select Enterprise - $550"}
               </button>
             </div>
           )}

           {/* Upgrade Box (Samo ako ima uplate) */}
           {amountPaid > 0 && amountPaid < 550 && (
             <div className="bg-[#1a170e] border border-[#D4AF37]/30 p-5 rounded-2xl">
                <div className="text-[#D4AF37] font-black uppercase text-[10px] mb-2">Smart Upgrade Active</div>
                <p className="text-zinc-300 text-[12px]">Već imate plaćeno <strong className="text-white">${amountPaid}</strong>. Plaćate samo razliku.</p>
             </div>
           )}

           {/* Enterprise Unlocked Box */}
           {amountPaid >= 550 && (
             <div className="bg-purple-900/20 border border-purple-500/30 p-6 rounded-2xl text-center">
                <Crown className="text-purple-500 w-10 h-10 mx-auto mb-3" />
                <div className="text-purple-400 font-black uppercase text-sm mb-1">Enterprise Unlocked</div>
                <p className="text-zinc-500 text-[11px] font-bold">All protocols operational.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default V8MasterEngine60MP;
// KRAJ FAJLA: V8MasterEngine60MP.jsx