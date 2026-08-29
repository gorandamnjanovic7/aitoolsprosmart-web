// POČETAK FAJLA: UnlockTheBeast.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Fingerprint, Image as ImageIcon, MonitorPlay, Layers } from 'lucide-react';

// FIREBASE IMPORTS (Tvoja originalna logika za dodelu kredita ostaje netaknuta)
import { auth, provider, db } from './firebase';
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { v8Toast } from './v8Utils';
import { useNavigate } from 'react-router-dom';

export default function UnlockTheBeast() {
  const [activeCard, setActiveCard] = useState(1);
  const navigate = useNavigate();

  // FIREBASE LOGIKA
  const handleClaimCredits = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      const userRef = doc(db, "v8_users", loggedUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: loggedUser.email, displayName: loggedUser.displayName, photoURL: loggedUser.photoURL,
          credits_16mp: 5, credits_33mp: 3, credits_45mp: 3, trialClaimed: true, role: "free_trial", joinedAt: serverTimestamp()
        });
        if(typeof v8Toast !== 'undefined') v8Toast.success("GUEST PASS ACTIVE: 11 Premium Credits Added!");
      } else {
        const userData = userSnap.data();
        if (userData.trialClaimed === false) {
           await updateDoc(userRef, { credits_16mp: 5, credits_33mp: 3, credits_45mp: 3, trialClaimed: true });
           if(typeof v8Toast !== 'undefined') v8Toast.success("GUEST PASS ACTIVE: 11 Premium Credits Added!");
        } else {
           if(typeof v8Toast !== 'undefined') v8Toast.info("Welcome back! Your secure session is active.");
        }
      }
    } catch (err) {
      console.error("[V8 CLAIM ERROR]:", err);
      if(typeof v8Toast !== 'undefined') v8Toast.error("Authentication canceled.");
    }
  };

  // PODACI ZA 3 EKOSISTEMA
  const showcaseData = [
    {
      id: 0,
      title: "150MP ULTRA STOCK",
      subtitle: "Cinematic Corporate Visuals",
      icon: <ImageIcon size={28} />,
      color: "from-orange-500 to-orange-600",
      bgImg: "/promo-stock.webp", // ZAMENI SVOJOM SLIKOM
      link: "/stock"
    },
    {
      id: 1,
      title: "SAAS ENVIRONMENTS",
      subtitle: "Hyper-Real 3D Screen Integrations",
      icon: <MonitorPlay size={28} />,
      color: "from-emerald-500 to-emerald-600",
      bgImg: "/promo-mockup.webp", // ZAMENI SVOJOM SLIKOM
      link: "/standard-mocup"
    },
    {
      id: 2,
      title: "MASTER UI/UX PROTOCOLS",
      subtitle: "Enterprise Figma Architectures",
      icon: <Layers size={28} />,
      color: "from-blue-600 to-indigo-600",
      bgImg: "/promo-uiux.webp", // ZAMENI SVOJOM SLIKOM
      link: "/saas-protocol"
    }
  ];

  return (
    <div className="w-full my-32 relative z-10 flex flex-col items-center overflow-hidden">
      
      {/* SEKCIONI NASLOV - Premium Light */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 px-4"
      >
        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 text-slate-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-sm">
          <Zap size={12} className="text-orange-500 animate-pulse" /> The V10 Ecosystem
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 tracking-tighter drop-shadow-sm">
          Absolute <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">Dominance.</span>
        </h2>
      </motion.div>

      {/* DYNAMIC EXPANSION SHOWCASE (Bento harmonika) */}
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 h-[500px] lg:h-[600px] flex flex-col lg:flex-row gap-4 mb-20">
        {showcaseData.map((item, index) => {
          const isActive = activeCard === index;
          return (
            <motion.div
              key={item.id}
              layout
              onMouseEnter={() => setActiveCard(index)}
              className={`relative overflow-hidden rounded-[2.5rem] cursor-pointer group shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-slate-200/50 ${
                isActive ? "lg:flex-[3] flex-1" : "lg:flex-1 flex-[0.3]"
              } transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]`}
            >
              {/* Pozadinska Slika sa Paralaksom */}
              <motion.img 
                src={item.bgImg} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
                animate={{ scale: isActive ? 1.05 : 1.2 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Svetli stakleni overlay */}
              <div className={`absolute inset-0 z-10 transition-colors duration-700 ${isActive ? 'bg-white/30' : 'bg-slate-900/60 lg:bg-slate-900/40'}`}></div>
              {isActive && <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent z-10"></div>}

              {/* Sadržaj Kartice */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
                
                {/* Ikonica (Uvek vidljiva, skače na gore kad je aktivna) */}
                <motion.div 
                  layout
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20 bg-gradient-to-br ${item.color} mb-6`}
                >
                  {item.icon}
                </motion.div>

                {/* Tekst - Vidljiv samo kad je aktivno (ili na mobilnom) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="flex flex-col"
                    >
                      <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-2 drop-shadow-sm leading-none">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 font-bold uppercase tracking-widest text-[11px] mb-6">
                        {item.subtitle}
                      </p>
                      
                      <button 
                        onClick={() => navigate(item.link)}
                        className={`self-start px-8 py-3 bg-gradient-to-r ${item.color} text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2`}
                      >
                        Explore Module <ChevronRight size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* FLOATING AUTHENTICATION BAR (B2B Login) */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-5xl mx-auto px-4"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-2xl border border-orange-200 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(249,115,22,0.15)] group">
          
          <div className="absolute top-0 left-0 w-1/3 h-1 bg-gradient-to-r from-orange-500 to-orange-300"></div>
          
          <div className="flex items-center gap-6 relative z-10 w-full">
            <div className="hidden sm:flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 border border-orange-100 group-hover:scale-110 transition-transform duration-500">
              <Fingerprint size={28} className="text-orange-500" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900 tracking-tight mb-1">
                Initialize Guest Pass
              </h3>
              <p className="text-slate-500 text-xs md:text-sm font-medium">
                Authenticate via Google OAuth to inject <strong className="text-orange-500">11 Premium Credits</strong> directly into your workspace.
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 w-full md:w-auto relative z-10">
            <button 
              onClick={handleClaimCredits}
              className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-orange-500 hover:to-orange-600 text-white font-black uppercase tracking-widest text-[12px] rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 active:scale-95"
            >
              Authenticate Now <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}
// KRAJ FAJLA: UnlockTheBeast.jsx