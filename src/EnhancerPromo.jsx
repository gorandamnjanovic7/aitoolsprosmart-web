// POČETAK FAJLA: EnhancerPromo.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, PlayCircle, Timer } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import V8Reveal from './V8Reveal';
import V8CinematicText from './v8-ui-components/V8CinematicText';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 IMPORT NOVOG, PROFESIONALNOG MODALA ZA KUPCE 🔥
import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';

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
          <motion.span
            key={r.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bg-white/40 rounded-full pointer-events-none z-0"
            style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }}
            onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))}
          />
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
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 24 * 3600));
    }, 1000);
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

// POČETAK FUNKCIJE: EnhancerPromo
const EnhancerPromo = () => {
  const [hasEnhancerAccess, setHasEnhancerAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // 🔥 STATE ZA MODALE 🔥
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loginRequiredData, setLoginRequiredData] = useState({
    isOpen: false,
    name: '10X ENHANCER LIFETIME',
    price: 199.99
  });

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
            if (
              docSnap.exists() &&
              docSnap.data().unlockedApps &&
              (docSnap.data().unlockedApps.includes('FULL_ACCESS') || docSnap.data().unlockedApps.includes('10X_ENHANCER'))
            ) { 
              setHasEnhancerAccess(true); 
            } else {
              setHasEnhancerAccess(false);
            }
          } catch (e) {
            setHasEnhancerAccess(false);
          }
        }
      } else {
        setHasEnhancerAccess(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  // POČETAK FUNKCIJE: handlePaymentV8
  const handlePaymentV8 = async () => {
    try {
      if (currentUser || auth.currentUser) {
        setIsCheckoutOpen(true);
        return;
      }

      setLoginRequiredData({
        isOpen: true,
        name: '10X ENHANCER LIFETIME',
        price: 199.99
      });
    } catch (error) { 
      console.error("V8 Login Error:", error);
    }
  };
  // KRAJ FUNKCIJE: handlePaymentV8

  return (
    <div id="enhancer" className="relative mb-24 flex flex-col items-center justify-center text-center py-24 scroll-mt-32 overflow-hidden rounded-[3rem] mx-4 lg:mx-0 border border-orange-500/20 shadow-[0_0_40px_rgba(234,88,12,0.15)] group">
      
      {/* V8 LOGIN REQUIRED MODAL */}
      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData(prev => ({ ...prev, isOpen: false }))}
        packageName={loginRequiredData.name}
        price={loginRequiredData.price}
        onLoginSuccess={() => {
          setLoginRequiredData(prev => ({ ...prev, isOpen: false }));
          setIsCheckoutOpen(true);
        }}
      />

      {/* V8 SECURE CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <V8SecureCheckout 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            productName="10X ENHANCER LIFETIME" 
            price={199.99} 
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1600&q=80" alt="10x Background" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-orange-950/40 to-[#050505]"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <V8Reveal delay={0.1} direction="down">
        <div className="bg-orange-600/10 p-4 rounded-full mb-6 relative z-10 inline-block backdrop-blur-sm">
          <Zap className="w-12 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]" strokeWidth={1.5} />
        </div>
      </V8Reveal>

      <V8Reveal delay={0.2} direction="up">
        <V8CinematicText text="10X PROMPT ENHANCER" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-orange-500 mb-4 drop-shadow-[0_0_20px_rgba(234,88,12,0.8)] relative z-10" delay={0.2} />
      </V8Reveal>

      <V8Reveal delay={0.3} direction="up">
        <div className="text-[13px] md:text-[15px] font-black text-green-400 uppercase tracking-[0.2em] mb-4 relative z-10 drop-shadow-md">
          Premium 3-in-1 tool. ONLY $199.99 LIFETIME.
        </div>
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
            <Link to="/enxance" className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-12 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer backdrop-blur-md">
              🚀 LAUNCH ENGINE
            </Link>
          ) : (
            <>
              <RippleButton onClick={handlePaymentV8} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer backdrop-blur-md">
                <Zap className="w-5 h-5 fill-white" /> GET LIFETIME LICENSE ($199.99)
              </RippleButton>
              <Link to="/promo" className="bg-black/50 backdrop-blur-md border border-orange-500/50 text-orange-400 hover:bg-orange-500 hover:text-white px-8 py-4 rounded-xl font-black text-[14px] uppercase tracking-widest shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer">
                <PlayCircle className="w-5 h-5" /> SEE DEMO
              </Link>
            </>
          )}
        </div>
      </V8Reveal>

    </div>
  );
};
// KRAJ FUNKCIJE: EnhancerPromo

export default EnhancerPromo;
// KRAJ FAJLA: EnhancerPromo.jsx
