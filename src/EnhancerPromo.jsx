// POČETAK FAJLA: EnhancerPromo.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { Link } from 'react-router-dom';
import { Zap, PlayCircle, Timer, DownloadCloud, X, CheckCircle } from 'lucide-react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { v8Toast } from './App';
import V8Reveal from './V8Reveal';
import V8CinematicText from './V8CinematicText';
import { motion, AnimatePresence } from 'framer-motion';

// POČETAK FUNKCIJE: RippleButton
const RippleButton = ({ children, onClick, disabled, className }) => {
  const [ripples, setRipples] = useState([]);
  
  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples([...ripples, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    if (onClick) onClick(e);
  };
  
  return (
    <button type="button" onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`}>
      <span className="relative z-10 flex items-center justify-center">{children}</span>
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute bg-white/40 rounded-full pointer-events-none z-0" style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }} onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))} />
        ))}
      </AnimatePresence>
    </button>
  );
};
// KRAJ FUNKCIJE: RippleButton


// POČETAK FUNKCIJE: CountdownTimer
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 15 * 60 + 43);
  
  useEffect(() => {
    const interval = setInterval(() => { setTimeLeft(prev => (prev > 0 ? prev - 1 : 24 * 3600)); }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="inline-flex items-center justify-center gap-3 bg-orange-600/10 border border-orange-500/30 px-6 py-3 rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.2)] mt-4">
      <Timer className="w-5 h-5 text-orange-500 animate-pulse" />
      <div className="flex flex-col text-left">
        <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest">OFFER EXPIRES IN:</span>
        <span className="text-[16px] font-mono font-black text-white tracking-widest">{h}:{m}:{s}</span>
      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: CountdownTimer

// 🔥 NEUNIŠTIVI MODAL BEZ ANIMACIJE KOJA GA OBARA 🔥
const V8CheckoutModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden">
        <button onClick={onClose} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
        
        <div className="p-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
             <DownloadCloud className="w-8 h-8 text-orange-500" />
          </div>
          
          <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
          <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center">10X ENHANCER LIFETIME</p>
          
          <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Provider:</span><span className="font-bold text-white text-right">V8 Vault</span></div>
            <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
            <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-white text-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">$199.99</span></div>
          </div>
          
          <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
            <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-orange-500 hover:text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                Request Checkout Link
            </a>
            <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your download automatically after checkout! 🚀</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
// KRAJ FUNKCIJE: V8CheckoutModal


// POČETAK FUNKCIJE: EnhancerPromo
const EnhancerPromo = () => {
  const [hasEnhancerAccess, setHasEnhancerAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [lemonLink, setLemonLink] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email ? user.email.toLowerCase() : "";
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") { 
          setHasEnhancerAccess(true); 
        } else {
          try {
            const docRef = doc(db, "vip_users", email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes('FULL_ACCESS') || docSnap.data().unlockedApps.includes('10X_ENHANCER'))) { 
              setHasEnhancerAccess(true); 
            } else { setHasEnhancerAccess(false); }
          } catch(e) { setHasEnhancerAccess(false); }
        }
      } else { setHasEnhancerAccess(false); }
    });

    const unsubLemon = onSnapshot(doc(db, "v8_settings", "lemon"), (docSnap) => {
      if (docSnap.exists()) {
          setLemonLink(docSnap.data().checkoutUrl || "");
      }
    });

    return () => { unsubscribe(); unsubLemon(); };
  }, []);

  // 🔥 V8 MEMORY TOKEN EFEKAT 🔥
  // Ako se stranica osveži, proveravamo da li je klijent ostavio "zastavicu" za kupovinu!
  useEffect(() => {
    if (currentUser && localStorage.getItem('v8_pending_enhancer_checkout') === 'true') {
        localStorage.removeItem('v8_pending_enhancer_checkout'); // Odmah brišemo da ne iskače zauvek
        snimiKupcaUBazu(currentUser);
        if (lemonLink && lemonLink.includes("http")) {
            window.location.href = lemonLink;
        } else {
            setShowPaymentModal(true); // OTVARAMO MU MODAL AUTOMATSKI!
        }
    }
  }, [currentUser, lemonLink]);

  // POČETAK FUNKCIJE: snimiKupcaUBazu
  const snimiKupcaUBazu = async (user) => {
      try {
          await addDoc(collection(db, "v8_kupci"), {
              ime: user.displayName || "Client", email: user.email, uid: user.uid,
              zeliPaket: "10X ENHANCER LIFETIME", cenaPaketa: 199.99, vreme: serverTimestamp(), isPaid: false
          });
      } catch (error) { console.error("Database error:", error); }
  };
  // KRAJ FUNKCIJE: snimiKupcaUBazu

  // POČETAK FUNKCIJE: handlePaymentV8
  const handlePaymentV8 = async () => {
    try {
      if (currentUser) {
          // Ako je VEĆ ulogovan, sve ide glatko i odmah iskače
          await snimiKupcaUBazu(currentUser);
          if (lemonLink && lemonLink.includes("http")) {
              window.location.href = lemonLink; 
          } else {
              setShowPaymentModal(true); 
          }
      } else {
          // Ako NIJE ulogovan, ostavljamo V8 Zastavicu pre logina!
          localStorage.setItem('v8_pending_enhancer_checkout', 'true');
          
          const v8Provider = new GoogleAuthProvider();
          v8Provider.setCustomParameters({ prompt: 'select_account' });
          await signInWithPopup(auth, v8Provider);
          // Ostatak posla preuzima onaj novi useEffect gore!
      }
    } catch (error) { 
      // Ako klijent zatvori prozor za login, brišemo zastavicu
      localStorage.removeItem('v8_pending_enhancer_checkout');
      console.error("V8 Login Error:", error);
    }
  };
  // KRAJ FUNKCIJE: handlePaymentV8

  return (
    <div id="enhancer" className="relative mb-24 flex flex-col items-center justify-center text-center py-24 scroll-mt-32 overflow-hidden rounded-[3rem] mx-4 lg:mx-0 border border-orange-500/20 shadow-[0_0_40px_rgba(234,88,12,0.15)] group">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&q=80" alt="10x Background" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-orange-950/40 to-[#050505]"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <V8Reveal delay={0.1} direction="down">
        <div className="bg-orange-600/10 p-4 rounded-full mb-6 relative z-10 inline-block backdrop-blur-sm"><Zap className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" strokeWidth={1.5} /></div>
      </V8Reveal>
      <V8Reveal delay={0.2} direction="up">
        <V8CinematicText text="10X PROMPT ENHANCER" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-orange-500 mb-4 drop-shadow-[0_0_20px_rgba(234,88,12,0.8)] relative z-10" delay={0.2} />
      </V8Reveal>
      <V8Reveal delay={0.3} direction="up">
        <div className="text-[13px] md:text-[15px] font-black text-green-400 uppercase tracking-[0.2em] mb-4 relative z-10 drop-shadow-md">Premium 3-in-1 tool. ONLY $199.99 LIFETIME.</div>
      </V8Reveal>
      <V8Reveal delay={0.4} direction="up">
        <div className="relative z-10"><CountdownTimer /></div>
      </V8Reveal>
      <V8Reveal delay={0.5} direction="up">
        <p className="text-zinc-200 text-[10px] md:text-[12px] max-w-2xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-10 mb-10 mx-auto px-4 relative z-10 drop-shadow-lg">
          <span className="font-black text-white">ACCESS THE PREMIUM AI PROMPT ENGINEERING SYSTEM. CONVERT SIMPLE IDEAS OR AN IMAGE INTO MASTERPIECES.</span><br /><br />
          <span className="text-orange-400 font-black uppercase">ENTER YOUR PROMPT; WE WILL ANALYZE IT IN DETAIL AND ENHANCE IT TO BE 10X BETTER.</span>
        </p>
      </V8Reveal>
      <V8Reveal delay={0.6} direction="up">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2 w-full px-6 relative z-10">
          {hasEnhancerAccess ? (
            <Link to="/enxance" className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-12 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer backdrop-blur-md">🚀 LAUNCH ENGINE</Link>
          ) : (
            <>
              <RippleButton onClick={handlePaymentV8} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer backdrop-blur-md"><Zap className="w-5 h-5 fill-white" /> GET LIFETIME LICENSE ($199.99)</RippleButton>
              <Link to="/promo" className="bg-black/50 backdrop-blur-md border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"><PlayCircle className="w-5 h-5" /> SEE DEMO</Link>
            </>
          )}
        </div>
      </V8Reveal>

      {/* V8 DIGITAL CHECKOUT MODAL (POZIV NEZAVISNE FUNKCIJE) */}
      <V8CheckoutModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} />

    </div>
  );
};
// KRAJ FUNKCIJE: EnhancerPromo

export default EnhancerPromo;
// KRAJ FAJLA: EnhancerPromo.jsx