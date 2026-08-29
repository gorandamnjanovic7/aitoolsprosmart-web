// POČETAK FAJLA: EnhancerPromo.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, PlayCircle, Timer, ScanLine } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import V8Reveal from './V8Reveal';
import V8CinematicText from './v8-ui-components/V8CinematicText';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';

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
            initial={{ scale: 0, opacity: 0.4 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bg-white/50 rounded-full pointer-events-none z-0"
            style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }}
            onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))}
          />
        ))}
      </AnimatePresence>
    </button>
  );
};
// KRAJ FUNKCIJE: RippleButton

// POČETAK FUNKCIJE: CountdownTimer (Svetla Studio Tema)
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
    <div className="inline-flex items-center justify-center gap-3 bg-white border border-orange-200 px-6 py-3 rounded-2xl shadow-sm mt-4">
      <Timer className="w-5 h-5 text-orange-500 animate-pulse" />
      <div className="flex flex-col text-left">
        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">OFFER EXPIRES IN:</span>
        <span className="text-[16px] font-mono font-black text-slate-900 tracking-widest">{h}:{m}:{s}</span>
      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: CountdownTimer

// POČETAK FUNKCIJE: EnhancerPromo
const EnhancerPromo = () => {
  const [hasEnhancerAccess, setHasEnhancerAccess] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [loginRequiredData, setLoginRequiredData] = useState({
    isOpen: false,
    name: '10X ENHANCER LIFETIME',
    price: 199.99
  });

  // 🔥 3D PARALLAX LOGIKA 🔥
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

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

  return (
    <div id="enhancer" className="relative mb-24 flex flex-col items-center justify-center py-24 scroll-mt-32 w-full px-4 lg:px-0">
      
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

      {/* 3D KARTICA KOJA PRATI MIŠA */}
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="w-full max-w-5xl relative rounded-[3rem] bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden group"
      >
        {/* Pozadinski mrežasti patern (Grid) da izgleda kao softverski interfejs */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        {/* 🟢 AI LASER SKENER KOJI IDE GORE DOLE 🟢 */}
        <motion.div 
          className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10 pointer-events-none"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
        />

        <div className="relative z-20 flex flex-col items-center justify-center text-center p-10 md:p-16" style={{ transform: "translateZ(30px)" }}>
          
          <V8Reveal delay={0.1} direction="down">
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl mb-6 inline-block shadow-sm">
              <ScanLine className="w-10 h-10 text-emerald-500" strokeWidth={2} />
            </div>
          </V8Reveal>

          <V8Reveal delay={0.2} direction="up">
            <V8CinematicText text="10X PROMPT ENHANCER" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4 drop-shadow-sm" delay={0.2} />
          </V8Reveal>

          <V8Reveal delay={0.3} direction="up">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-[11px] md:text-[13px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Premium 3-in-1 tool. Only $199.99 Lifetime.
            </div>
          </V8Reveal>

          <V8Reveal delay={0.4} direction="up">
            <CountdownTimer />
          </V8Reveal>

          <V8Reveal delay={0.5} direction="up">
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 mt-8 mb-10 max-w-2xl mx-auto shadow-inner">
              <p className="text-slate-600 text-[10px] md:text-[12px] font-medium uppercase tracking-[0.2em] leading-relaxed">
                <strong className="font-black text-slate-900">ACCESS THE PREMIUM AI PROMPT ENGINEERING SYSTEM. CONVERT SIMPLE IDEAS OR AN IMAGE INTO MASTERPIECES.</strong><br /><br />
                <span className="text-emerald-600 font-black">ENTER YOUR PROMPT; THE ENGINE WILL ANALYZE IT IN DETAIL AND ENHANCE IT TO BE 10X BETTER.</span>
              </p>
            </div>
          </V8Reveal>

          <V8Reveal delay={0.6} direction="up">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              {hasEnhancerAccess ? (
                <Link to="/enxance" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-12 py-4 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer">
                  🚀 LAUNCH ENGINE
                </Link>
              ) : (
                <>
                  <RippleButton onClick={handlePaymentV8} className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-[0_10px_20px_rgba(16,185,129,0.3)] hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer">
                    <Zap className="w-5 h-5 fill-white" /> GET LIFETIME LICENSE ($199.99)
                  </RippleButton>
                  <Link to="/promo" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-emerald-300 hover:text-emerald-600 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:shadow-md hover:scale-105 transition-all flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer">
                    <PlayCircle className="w-5 h-5" /> SEE DEMO
                  </Link>
                </>
              )}
            </div>
          </V8Reveal>

        </div>
      </motion.div>
    </div>
  );
};

export default EnhancerPromo;
// KRAJ FAJLA: EnhancerPromo.jsx