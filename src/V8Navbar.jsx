// POČETAK FAJLA: V8Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, Award, ChevronDown, Layers, Image as ImageIcon, Zap, Settings, ShieldAlert, Lock, LogOut, User, Video, MonitorPlay, FileText } from 'lucide-react'; // Dodat FileText
import { motion } from 'framer-motion';

// FIREBASE & TOOLS
import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import { v8Toast } from './v8Utils';
import * as data from './data';
import navBg from './navbar-bg.webp';
import MagneticButton from './MagneticButton';

const V8Navbar = ({ handleHomeClick }) => {
  // POČETAK FUNKCIJE: V8Navbar
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isVIPInDB, setIsVIPInDB] = useState(false);

  const currentUserEmail = user?.email?.toLowerCase() || "";
  const isAdmin = currentUserEmail === "damnjanovicgoran7@gmail.com" || currentUserEmail === "aitoolsprosmart@gmail.com";
  const isVIP = isAdmin || isVIPInDB;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser.email.toLowerCase() !== "damnjanovicgoran7@gmail.com" && 
            currentUser.email.toLowerCase() !== "aitoolsprosmart@gmail.com") {
          try {
            const docSnap = await getDoc(doc(db, "vip_users", currentUser.email.toLowerCase()));
            setIsVIPInDB(docSnap.exists());
          } catch (e) { setIsVIPInDB(false); }
        }
      } else {
        setUser(null); setIsVIPInDB(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    if(typeof v8Toast !== 'undefined') v8Toast.success("V8 Disconnected.");
    window.location.reload(); 
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 IGNITED!");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[1000]">
      <nav 
        className={`w-full transition-all duration-500 border-b-2 ${
          scrolled 
          ? 'py-3 md:py-4 bg-black/60 backdrop-blur-xl border-orange-500/60 shadow-[0_10px_40px_rgba(234,88,12,0.3)]' 
          : 'py-5 md:py-7 bg-transparent border-transparent shadow-none'
        }`}
        style={{
          backgroundImage: scrolled 
            ? `linear-gradient(rgba(5, 5, 5, 0.8), rgba(5, 5, 5, 0.8)), url(${navBg})`
            : `url(${navBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8">
          
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group shrink-0 mr-4">
            <img src={data.logoUrl} className={`object-contain transition-all duration-500 ${scrolled ? 'h-8 md:h-10' : 'h-10 md:h-12'} animate-pulse group-hover:scale-105`} alt="logo" />
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={`font-black uppercase tracking-[0.1em] text-blue-500 italic group-hover:text-orange-500 transition-all duration-500 ${scrolled ? 'text-[10px] md:text-[12px]' : 'text-[11px] md:text-[14px]'}`}>AI TOOLS</span>
              <span className={`font-black uppercase tracking-[0.1em] text-orange-500 italic group-hover:text-blue-500 transition-all duration-500 ${scrolled ? 'text-[10px] md:text-[12px]' : 'text-[11px] md:text-[14px]'}`}>PRO SMART</span>
            </div>
          </Link>

          <div className="flex-1 flex items-center justify-end gap-3 font-black uppercase text-[10px] md:text-[11px] tracking-widest whitespace-nowrap">
            
            <MagneticButton>
               <Link to="/" onClick={handleHomeClick} className="hidden lg:flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 hover:text-white hover:bg-emerald-800/50 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer">
                 <Globe className="w-4 h-4" /> Home
               </Link>
            </MagneticButton>

            {/* V8 MASTER TOOLS DROPDOWN */}
            <div className="relative group hidden lg:block">
              <MagneticButton>
                <button className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-red-600/90 via-orange-600/90 to-red-600/90 border border-orange-400 text-white transition-all shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] cursor-pointer relative overflow-hidden">
                  <Zap className="w-4 h-4 text-yellow-300 animate-pulse drop-shadow-[0_0_8px_rgba(253,224,71,1)]" strokeWidth={2.5} /> 
                  <span>V8 MASTER TOOLS</span>
                  <ChevronDown className="w-3 h-3 text-yellow-300 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </MagneticButton>
              
              <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-400 z-[9999]">
                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 border-t-orange-500 border-b-orange-500/30 rounded-2xl p-2 w-64 shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col gap-1 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-orange-600/30 rounded-full blur-[40px] pointer-events-none z-0"></div>
                  
                  <Link to="/enxance" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-orange-500/30">
                    <div className="bg-orange-500/20 p-2 rounded-lg group-hover/item:bg-orange-500/40 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                      <Zap className="w-5 h-5 text-orange-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-orange-400 transition-all drop-shadow-md">10X ENHANCER</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Premium AI Engine</span>
                    </div>
                  </Link>

                  <Link to="/#marketplace" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-blue-500/30 mt-1">
                    <div className="bg-blue-500/20 p-2 rounded-lg group-hover/item:bg-blue-500/40 transition-colors shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                      <Award className="w-5 h-5 text-blue-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-blue-400 transition-all drop-shadow-md">AI STORE</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Asset Marketplace</span>
                    </div>
                  </Link>

                  {/* NOVO: V8 PROMPT ENGINE */}
                  <Link to="/prompt-engine" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-yellow-500/30 mt-1">
                    <div className="bg-yellow-500/20 p-2 rounded-lg group-hover/item:bg-yellow-500/40 transition-colors shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                      <FileText className="w-5 h-5 text-yellow-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-yellow-400 transition-all drop-shadow-md">PROMPT ENGINE</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Grid Factory Text Gen</span>
                    </div>
                  </Link>
                  
                  <Link to="/optimizer" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-orange-500/30 mt-1">
                    <div className="bg-orange-500/20 p-2 rounded-lg group-hover/item:bg-orange-500/40 transition-colors shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                      <ImageIcon className="w-5 h-5 text-orange-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-orange-400 transition-all drop-shadow-md">V8 OPTIMIZER</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Cinematic Image Processor</span>
                    </div>
                  </Link>

                  <Link to="/seedance" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-green-500/30 mt-1">
                    <div className="bg-green-500/20 p-2 rounded-lg group-hover/item:bg-green-500/40 transition-colors shadow-[0_0_10px_rgba(34,197,94,0.3)]">
                      <MonitorPlay className="w-5 h-5 text-green-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-green-400 transition-all drop-shadow-md">SEEDANCE 2.0</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Cinematic Video Prompting</span>
                    </div>
                  </Link>

                  <Link to="/kling" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-red-500/30 mt-1">
                    <div className="bg-red-500/20 p-2 rounded-lg group-hover/item:bg-red-500/40 transition-colors shadow-[0_0_10px_rgba(239,68,68,0.3)]">
                      <Video className="w-5 h-5 text-red-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-red-400 transition-all drop-shadow-md">KLING 3.0</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Hyper-Real Motion Engine</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* PREMIUM STOCK DROPDOWN */}
            <div className="relative group hidden lg:block">
              <MagneticButton>
                <button className="flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/50 text-blue-300 hover:text-white hover:border-blue-400 transition-all shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer">
                  <ImageIcon className="w-4 h-4 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> 
                  <span>PREMIUM STOCK</span>
                  <ChevronDown className="w-3 h-3 text-blue-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>
              </MagneticButton>
              
              <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-400 z-[9999]">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 border-t-blue-500/60 border-b-purple-500/30 rounded-2xl p-2 w-64 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-1 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px] pointer-events-none z-0"></div>
                  
                  <Link to="/stock" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-blue-500/30">
                    <div className="bg-blue-500/10 p-2 rounded-lg group-hover/item:bg-blue-500/20 transition-colors">
                      <Layers className="w-5 h-5 text-blue-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">MASTER STOCK BUNDLES</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">High-End Visuals</span>
                    </div>
                  </Link>
                  
                  <Link to="/showroom" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-purple-500/30">
                    <div className="bg-purple-500/10 p-2 rounded-lg group-hover/item:bg-purple-500/20 transition-colors">
                      <ImageIcon className="w-5 h-5 text-purple-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all">Showroom</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider">Visual Gallery</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* AUTH LOGIKA */}
            {user ? (
               <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-4">
                 {isAdmin && (
                   <>
                     <MagneticButton>
                       <Link to="/admin" className="bg-red-600/20 border border-red-500/50 text-red-400 px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0.2)] hidden md:flex">
                         <Settings className="w-4 h-4" /> CMS DB
                       </Link>
                     </MagneticButton>
                     <MagneticButton>
                       <Link to="/dashboard" className="bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 hover:bg-yellow-600 hover:text-white transition-all shadow-[0_0_10px_rgba(234,179,8,0.2)] hidden md:flex">
                         <ShieldAlert className="w-4 h-4" /> DASHBOARD
                       </Link>
                     </MagneticButton>
                   </>
                 )}
                 {isVIP && (
                   <MagneticButton>
                     <Link to="/trezor" className="bg-orange-600/20 border border-orange-500/50 text-orange-400 px-4 md:px-5 py-2 md:py-2.5 rounded-full flex items-center gap-2 hover:bg-orange-600 hover:text-white transition-all shadow-[0_0_10px_rgba(234,88,12,0.2)]">
                       <Lock className="w-4 h-4" /> VAULT
                     </Link>
                   </MagneticButton>
                 )}
                 <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 cursor-pointer" title="Log out">
                   <LogOut className="w-4 h-4" />
                 </button>
               </div>
            ) : (
               <div className="ml-2 border-l border-white/10 pl-4">
                 <MagneticButton>
                   <button onClick={handleLogin} className="bg-zinc-800 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-zinc-400 shadow-xl hover:bg-zinc-700 hover:text-white transition-all hidden sm:block border border-white/5 cursor-pointer">
                     <User className="w-4 h-4 inline mr-2" /> LOGIN
                   </button>
                 </MagneticButton>
               </div>
            )}

          </div>
        </div>
      </nav>
    </div>
  );
};
export default V8Navbar;
// KRAJ FAJLA: V8Navbar.jsx