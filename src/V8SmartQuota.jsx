// POČETAK FAJLA: V8SmartQuota.jsx
import React, { useState, useEffect } from "react";
import { ShieldCheck, Timer } from "lucide-react";
import { auth, db } from './firebase'; 
import { doc, getDoc, setDoc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { motion } from 'framer-motion';

// POČETAK FUNKCIJE: V8SmartQuota
export default function V8SmartQuota() {
  const [userEmail, setUserEmail] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [promptLimit, setPromptLimit] = useState(5000); 
  const [exhaustedAt, setExhaustedAt] = useState(null);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserEmail(null); setIsVIP(false); setPromptsUsed(0); setPromptLimit(5000); setIsCoolingDown(false);
        return;
      }

      const email = user.email.toLowerCase();
      setUserEmail(email);

      // Admin check
      if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
        setIsVIP(true); setPromptLimit(999999); setIsCoolingDown(false);
        return;
      }

      const qPay = query(collection(db, "v8_payoneer_requests"), where("clientEmail", "==", email));
      onSnapshot(qPay, async (snap) => {
         let hasAccess = false; let totalLimit = 0; 
         
         snap.docs.forEach(docSnap => {
            const data = docSnap.data();
            if (data.status === "paid" || data.status === "PAID") {
               const productName = data.productName ? data.productName.toUpperCase() : "";
               if (productName.includes("PROMPT") || productName.includes("GRID") || productName.includes("BUNDLE") || productName.includes("MASTER")) {
                   hasAccess = true;
                   if (productName.includes("ENTERPRISE")) { totalLimit = Math.max(totalLimit, 100000); }
                   else if (productName.includes("PRO")) { totalLimit = Math.max(totalLimit, 25000); }
                   else { totalLimit = Math.max(totalLimit, 5000); }
               }
            }
         });

         try {
           const docRef = doc(db, "vip_users", email);
           const vipSnap = await getDoc(docRef);
           let used = 0;
           let exhaustedTimestamp = null;
           
           if (vipSnap.exists()) {
              used = vipSnap.data().promptsUsed || 0;
              exhaustedTimestamp = vipSnap.data().exhaustedAt || null;
           }
           
           if (hasAccess) {
              setIsVIP(true);
              setPromptLimit(totalLimit);
              setPromptsUsed(used);
              setExhaustedAt(exhaustedTimestamp);

              if (used >= totalLimit || exhaustedTimestamp) {
                 const exhaustedTime = new Date(exhaustedTimestamp || Date.now()).getTime();
                 const now = Date.now();
                 if (now - exhaustedTime >= 30 * 24 * 60 * 60 * 1000) {
                    resetQuota(email);
                 } else {
                    setIsCoolingDown(true);
                    if (!exhaustedTimestamp) {
                       const isoNow = new Date().toISOString();
                       setExhaustedAt(isoNow);
                       await setDoc(docRef, { exhaustedAt: isoNow }, { merge: true });
                    }
                 }
              } else {
                 setIsCoolingDown(false);
              }
           } else {
              setIsVIP(false); setPromptLimit(5000);
           }
         } catch (e) { console.error("Greška pri VIP čitanju:", e); }
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let interval;
    if (isCoolingDown && exhaustedAt) {
      interval = setInterval(() => {
        const exhaustedTime = new Date(exhaustedAt).getTime();
        const targetTime = exhaustedTime + 30 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const diff = targetTime - now;

        if (diff <= 0) {
          clearInterval(interval);
          if (userEmail) resetQuota(userEmail);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setCooldownTime(`${days}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCoolingDown, exhaustedAt, userEmail]);

  // POČETAK FUNKCIJE: resetQuota
  const resetQuota = async (emailToReset) => {
    setPromptsUsed(0);
    setExhaustedAt(null);
    setIsCoolingDown(false);
    try {
      await setDoc(doc(db, "vip_users", emailToReset), { 
         promptsUsed: 0, 
         exhaustedAt: null 
      }, { merge: true });
    } catch(e) { console.error("Failed to reset limit", e); }
  };
  // KRAJ FUNKCIJE: resetQuota

  // Ako korisnik nije VIP (nema plan), ne prikazujemo brojač
  if (!isVIP) return null;

  // Renderovanje statusa
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }} 
      animate={{ y: 0, opacity: 1 }} 
      className={`bg-black/80 backdrop-blur-xl border px-6 py-2 rounded-full flex items-center gap-4 shadow-lg w-max mx-auto ${
        isCoolingDown ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.3)]'
      }`}
    >
      {isCoolingDown ? (
        <Timer className="w-5 h-5 text-red-500 animate-pulse" />
      ) : (
        <ShieldCheck className="w-5 h-5 text-orange-500 animate-pulse" />
      )}
      
      <div className="flex flex-col items-center">
         <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">
           {isCoolingDown ? 'COOLING DOWN' : 'V8 ROLLING QUOTA'}
         </span>
         
         {isCoolingDown ? (
            <span className="text-[14px] font-mono font-black tracking-widest leading-none mt-1 text-red-500">
               {cooldownTime}
            </span>
         ) : (
            <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${promptsUsed >= promptLimit ? 'text-red-500' : 'text-emerald-400'}`}>
               {promptsUsed} / {promptLimit === 999999 ? 'UNLIMITED' : promptLimit}
            </span>
         )}
      </div>
    </motion.div>
  );
}
// KRAJ FUNKCIJE: V8SmartQuota
// KRAJ FAJLA: V8SmartQuota.jsx