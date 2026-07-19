// POČETAK FAJLA: NotificationSystem.jsx
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellRing, X, Bitcoin, Link as LinkIcon, CreditCard } from 'lucide-react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebase'; 

// Početak funkcije: NotificationListener
export const NotificationListener = ({ setNotification }) => {
  useEffect(() => {
    // Flegovi koji sprečavaju da zvuk iskoči kada samo osvežiš stranicu
    let initB2B = true;
    let initCrypto = true;
    let initPayPal = true;

    // Zajednička funkcija za okidanje
    const fireNotification = (type, title, msg) => {
      // 🔥 Ažurirana putanja ka zvuku direktno u public folderu 🔥
      const audio = new Audio('/v8-alarm.mp3');
      audio.play().catch(e => console.log("Audio blokiran:", e));
      setNotification({ type, title, msg });
    };

    // 1. SLUŠAČ ZA PAYONEER (B2B)
    const qB2B = query(collection(db, "v8_payoneer_requests"), orderBy("requestDate", "desc"), limit(1));
    const unsubB2B = onSnapshot(qB2B, (snapshot) => {
      if (initB2B) { initB2B = false; return; } // Preskačemo prvo učitavanje
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          fireNotification('b2b', 'NOVA B2B UPLATA', 'Novi B2B Link zahtev je stigao!');
        }
      });
    });

    // 2. SLUŠAČ ZA KRIPTO
    const qCrypto = query(collection(db, "v8_crypto_requests"), orderBy("requestDate", "desc"), limit(1));
    const unsubCrypto = onSnapshot(qCrypto, (snapshot) => {
      if (initCrypto) { initCrypto = false; return; }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          fireNotification('crypto', 'NOVA KRIPTO UPLATA', 'Kripto transakcija je inicirana u bazi!');
        }
      });
    });

    // 3. SLUŠAČ ZA PAYPAL / KARTICE
    // Napomena: Proveri da li se kolekcija u bazi zove "v8_paypal_requests"
    const qPayPal = query(collection(db, "v8_paypal_requests"), orderBy("requestDate", "desc"), limit(1));
    const unsubPayPal = onSnapshot(qPayPal, (snapshot) => {
      if (initPayPal) { initPayPal = false; return; }
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          fireNotification('paypal', 'NOVA KARTICA / PAYPAL', 'Sistem je procesuirao novu PayPal uplatu!');
        }
      });
    });

    // Čišćenje slušača kada se komponenta ugasi
    return () => {
      unsubB2B();
      unsubCrypto();
      unsubPayPal();
    };
  }, [setNotification]);
  
  return null; 
};
// Kraj funkcije: NotificationListener


// Početak funkcije: NotificationModal
export const NotificationModal = ({ data, onClose }) => {
  // Dinamičko prepoznavanje stila na osnovu tipa uplate
  const styleConfig = {
    b2b: {
      color: "emerald",
      border: "border-emerald-500/50",
      shadow: "shadow-[0_0_50px_rgba(16,185,129,0.15)]",
      iconBg: "bg-emerald-600/20 border-emerald-500/30",
      iconText: "text-emerald-400",
      btn: "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]",
      IconElement: LinkIcon
    },
    crypto: {
      color: "orange",
      border: "border-orange-500/50",
      shadow: "shadow-[0_0_50px_rgba(249,115,22,0.15)]",
      iconBg: "bg-orange-600/20 border-orange-500/30",
      iconText: "text-orange-400",
      btn: "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]",
      IconElement: Bitcoin
    },
    paypal: {
      color: "blue",
      border: "border-blue-500/50",
      shadow: "shadow-[0_0_50px_rgba(37,99,235,0.15)]",
      iconBg: "bg-blue-600/20 border-blue-500/30",
      iconText: "text-blue-400",
      btn: "bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]",
      IconElement: CreditCard
    }
  };

  const config = styleConfig[data.type] || styleConfig.b2b;
  const Icon = config.IconElement;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.95 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9999999] w-full max-w-sm bg-[#080d1a] border ${config.border} rounded-2xl ${config.shadow} p-6`}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors outline-none"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
      
      <div className="flex items-center gap-4">
        <div className={`${config.iconBg} p-3 rounded-full border relative`}>
          <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full bg-${config.color}-500 animate-ping`}></div>
          <Icon className={`${config.iconText} animate-pulse`} size={24} />
        </div>
        <div>
          <h3 className="text-white font-black uppercase tracking-widest text-sm">{data.title}</h3>
          <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{data.msg}</p>
        </div>
      </div>
      
      <button 
        onClick={onClose} 
        className={`w-full mt-6 py-3.5 ${config.btn} rounded-xl text-white font-black text-[11px] tracking-widest uppercase transition-all outline-none`}
      >
        Skeniraj Bazu
      </button>
    </motion.div>
  );
};
// Kraj funkcije: NotificationModal
// KRAJ FAJLA: NotificationSystem.jsx