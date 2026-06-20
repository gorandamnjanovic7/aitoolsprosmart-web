// POČETAK FAJLA: V8MasterPromptLab.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Target, Layers, Watch, Camera, Coffee, Cpu, Palette, Crown, ShieldCheck, ArrowUpCircle } from 'lucide-react';
import { db, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

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

  // 1. Logic for Access Control (Identicna kao u ostalim V8 alatima)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      const email = user.email.toLowerCase();
      setIsAdmin(email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com");
      
      const qPay = query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email));
      onSnapshot(qPay, (snap) => {
        let maxPaid = 0;
        snap.docs.forEach(doc => {
            const data = doc.data();
            if (data.status === "paid" || data.status === "PAID") {
                if (data.productName?.toUpperCase().includes("PROMPT") || data.productName?.toUpperCase().includes("SECURITY CHECKOUT")) {
                    if (maxPaid < 550) maxPaid = 550; // Simple logic for tier check
                }
            }
        });
        setAmountPaid(maxPaid);
        setIsVIP(maxPaid > 0 || isAdmin);
      });
    });
    return () => unsubAuth();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] p-6 md:p-12 font-sans">
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
               <button className="mt-4 w-full bg-[#D4AF37] text-black font-black uppercase text-sm py-4 rounded-xl hover:bg-[#b8962f] transition-all">Generate Master Prompts</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ARCHETYPES.map(arch => (
                <button key={arch.id} onClick={() => setSelectedArchetype(arch.id)} className={`p-4 rounded-xl border transition-all bg-[#0A0A0A] text-[10px] uppercase font-black flex flex-col items-center gap-2 ${selectedArchetype === arch.id ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-white/5 text-zinc-400 hover:border-zinc-700'}`}>
                  {arch.icon} {arch.name}
                </button>
              ))}
            </div>
        </div>

        {/* Sidebar sa paketima i Upgrade Box-om */}
        <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-8 space-y-6 self-start">
           <h3 className="text-[#D4AF37] font-black uppercase text-sm border-b border-white/5 pb-4">Tier Access</h3>
           
           {/* Starter paket prikaz */}
           {amountPaid < 150 && (
             <div className="p-6 bg-black rounded-2xl border border-blue-900/30">
               <h4 className="text-white font-bold text-sm">Starter Tier</h4>
               <p className="text-zinc-500 text-xs mt-2 mb-4">500 Credits Included</p>
               <button className="w-full py-3 rounded-lg bg-blue-600 text-xs font-black uppercase">Select Starter</button>
             </div>
           )}

           {/* Upgrade Box (Samo ako ima uplate) */}
           {amountPaid > 0 && amountPaid < 550 && (
             <div className="bg-[#1a170e] border border-[#D4AF37]/30 p-6 rounded-2xl">
                <div className="text-[#D4AF37] font-black uppercase text-[10px] mb-2">Smart Upgrade Active</div>
                <p className="text-zinc-300 text-[12px]">Već imate plaćeno <strong className="text-white">${amountPaid}</strong>. Plaćate samo razliku.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: V8MasterPromptLab.jsx