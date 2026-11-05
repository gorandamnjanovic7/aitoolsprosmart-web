// POČETAK FAJLA: V8Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, ChevronDown, Layers, Image as ImageIcon, Zap, Settings, ShieldAlert, Lock, LogOut, User, Video, MonitorPlay, FileText, Code, ShieldCheck, LayoutGrid, Cpu, Maximize, Gift, Menu, X, Terminal, ScanLine, Briefcase, Sparkles, Aperture, Clapperboard, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { auth, provider, db } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { v8Toast } from './v8Utils';
import * as data from './data';
import navBg from './navbar-bg.webp';

import { trackV8Action } from './utils/analytics';

const V8Navbar = ({ handleHomeClick }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isVIPInDB, setIsVIPInDB] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userCredits, setUserCredits] = useState({ credits_16mp: 0, credits_33mp: 0, credits_45mp: 0, trialClaimed: true });

  const currentUserEmail = user?.email?.toLowerCase() || "";
  const isAdmin = currentUserEmail === "damnjanovicgoran7@gmail.com" || currentUserEmail === "aitoolsprosmart@gmail.com";
  const isVIP = isAdmin || isVIPInDB;

  useEffect(() => {
    let unsubTrial = null;
    const unsubAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (unsubTrial) { unsubTrial(); unsubTrial = null; }
      if (currentUser) {
        setUser(currentUser);
        if (!isAdmin) {
          try {
            const docSnap = await getDoc(doc(db, "vip_users", currentUser.email.toLowerCase()));
            setIsVIPInDB(docSnap.exists());
            unsubTrial = onSnapshot(doc(db, "v8_users", currentUser.uid), (userSnap) => {
              if (userSnap.exists()) setUserCredits(userSnap.data());
            });
          } catch (e) { setIsVIPInDB(false); }
        }
      } else {
        setUser(null); setIsVIPInDB(false); setUserCredits({ credits_16mp: 0, credits_33mp: 0, credits_45mp: 0, trialClaimed: true });
      }
    });
    return () => { unsubAuth(); if (unsubTrial) unsubTrial(); };
  }, [isAdmin]);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 50); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflowX = html.style.overflowX;
    const previousBodyOverflowX = body.style.overflowX;
    html.style.overflowX = 'hidden';
    body.style.overflowX = 'hidden';
    return () => { html.style.overflowX = previousHtmlOverflowX; body.style.overflowX = previousBodyOverflowX; };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    if (isMobileMenuOpen) { html.style.overflow = 'hidden'; body.style.overflow = 'hidden'; }
    return () => { html.style.overflow = previousHtmlOverflow; body.style.overflow = previousBodyOverflow; };
  }, [isMobileMenuOpen]);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname, location.hash]);
  useEffect(() => {
    if (!isMobileMenuOpen) return undefined;
    const handleKeyDown = (event) => { if (event.key === 'Escape') setIsMobileMenuOpen(false); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    trackV8Action("user_logout");
    await signOut(auth);
    if(typeof v8Toast !== 'undefined') v8Toast.success("V8 Disconnected.");
    setIsMobileMenuOpen(false); 
    window.location.reload(); 
  };

  const handleLogin = async () => {
    trackV8Action("login_initiated");
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      trackV8Action("login_success");
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 IGNITED!");
      setIsMobileMenuOpen(false); 

      const userRef = doc(db, "v8_users", loggedUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const newUserProfile = {
          email: loggedUser.email,
          displayName: loggedUser.displayName,
          photoURL: loggedUser.photoURL,
          credits_16mp: 0, 
          credits_33mp: 0, 
          credits_45mp: 0, 
          trialClaimed: false, 
          role: "free_trial",
          joinedAt: serverTimestamp()
        };
        await setDoc(userRef, newUserProfile);
        setUserCredits(newUserProfile);
      } else {
        setUserCredits(userSnap.data());
      }
    } catch (err) { console.error("[V8 AUTH ERROR]:", err); }
  };

  const handleClaimTrial = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "v8_users", user.uid);
      await updateDoc(userRef, { credits_16mp: 5, credits_33mp: 3, credits_45mp: 3, trialClaimed: true });
      trackV8Action("trial_claimed", { email: user.email });
      if(typeof v8Toast !== 'undefined') v8Toast.success("TRIAL UNLOCKED: 11 Premium Credits Added!");
    } catch (error) { console.error("Error claiming trial:", error); }
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-x-0 top-0 z-[1000] w-full max-w-[100vw]">
      <nav 
        className={`w-full max-w-[100vw] transition-all duration-500 border-b-2 ${
          scrolled 
          ? 'py-3 md:py-4 bg-black/60 backdrop-blur-xl border-orange-500/60 shadow-[0_10px_40px_rgba(234,88,12,0.3)]' 
          : 'py-4 md:py-7 bg-transparent border-transparent shadow-none'
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
        <div className="mx-auto flex w-full max-w-[1600px] min-w-0 items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4 md:px-8">
          
          {/* LOGO */}
          <Link to="/" onClick={() => { if (typeof handleHomeClick === 'function') handleHomeClick(); setIsMobileMenuOpen(false); }} className="group flex min-w-0 max-w-[calc(100%_-_3.25rem)] flex-1 items-center gap-2 overflow-hidden pr-1 sm:max-w-[calc(100%_-_3.75rem)] sm:gap-3 sm:pr-4 xl:max-w-none xl:flex-none">
            <img src={data.logoUrl} className={`object-contain transition-all duration-500 shrink-0 ${scrolled ? 'h-8 md:h-10' : 'h-9 md:h-12'} animate-pulse group-hover:scale-105`} alt="logo" />
            <div className="flex flex-col justify-center overflow-hidden min-w-0">
              <span className={`font-black uppercase tracking-[0.1em] text-blue-500 italic group-hover:text-orange-500 transition-all duration-500 truncate w-full leading-none ${scrolled ? 'text-[11px] md:text-[12px]' : 'text-[12px] md:text-[14px]'} mb-0.5`}>AI TOOLS</span>
              <span className={`font-black uppercase tracking-[0.1em] text-orange-500 italic group-hover:text-blue-500 transition-all duration-500 truncate w-full leading-none ${scrolled ? 'text-[11px] md:text-[12px]' : 'text-[12px] md:text-[14px]'}`}>PRO SMART</span>
            </div>
          </Link>

          {/* Desktop navigacija */}
          <div className="hidden xl:flex items-center justify-end gap-1.5 xl:gap-2 font-black uppercase tracking-widest shrink-0">
            
            {/* HOME DUGME */}
            <div className="relative group">
              <Link to="/" onClick={() => { if (typeof handleHomeClick === 'function') handleHomeClick(); }} className="flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/40 text-emerald-400 text-[9px] xl:text-[10px] hover:text-white hover:bg-emerald-800/50 hover:border-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.15)] cursor-pointer whitespace-nowrap">
                <Globe className="w-3.5 h-3.5 shrink-0" /> 
                <span>HOME</span>
                <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              </Link>
              <div className="absolute top-full left-0 pt-4 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-400 z-[9999]">
                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 border-t-emerald-500 border-b-emerald-500/30 rounded-2xl p-2 w-52 shadow-[0_30px_60px_rgba(0,0,0,0.9)] flex flex-col gap-1 relative overflow-hidden">
                  <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-600/20 rounded-full blur-[40px] pointer-events-none z-0"></div>
                  <Link to="/portfolio" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-300 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-emerald-500/30">
                    <div className="bg-emerald-500/20 p-2 rounded-lg group-hover/item:bg-emerald-500/40 transition-colors shadow-[0_0_10px_rgba(16,185,129,0.3)] shrink-0">
                      <Briefcase className="w-5 h-5 text-emerald-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:text-emerald-400 transition-all drop-shadow-md truncate">PORTFOLIO</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider truncate">V8 Master Gallery</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* 🔥 NOVO: AI AGENTS DUGME (zamijenjeno sa APPS) 🔥 */}
            <Link to="/ai-agents" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-2 rounded-full bg-cyan-600 border-2 border-cyan-400 text-white font-black hover:bg-cyan-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(8,145,178,0.6)] whitespace-nowrap cursor-pointer">
              <Bot className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <span className="text-[9px] xl:text-[10px] uppercase tracking-widest">AI AGENTS</span>
            </Link>

            {/* PREMIUM STOCK */}
            <div className="relative group">
              <button className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-2 rounded-full bg-blue-600 border-2 border-blue-400 text-white font-black text-[9px] xl:text-[10px] hover:bg-blue-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(37,99,235,0.6)] cursor-pointer whitespace-nowrap">
                <ImageIcon className="w-3.5 h-3.5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] shrink-0" /> 
                <span>PREMIUM STOCK</span>
                <ChevronDown className="w-3 h-3 text-white group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              </button>
              <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-400 z-[9999]">
                <div className="bg-black/80 backdrop-blur-2xl border border-white/10 border-t-blue-500/60 border-b-purple-500/30 rounded-2xl p-2 w-72 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col gap-1 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px] pointer-events-none z-0"></div>
                  
                  <Link to="/stock" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-blue-500/30">
                    <div className="bg-blue-500/10 p-2 rounded-lg group-hover/item:bg-blue-500/20 transition-colors shrink-0">
                      <Layers className="w-5 h-5 text-blue-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all truncate">MASTER STOCK BUNDLES</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider truncate">High-End Visuals</span>
                    </div>
                  </Link>
                  
                  <Link to="/showroom" className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-all group/item relative z-10 border border-transparent hover:border-purple-500/30 mt-1">
                    <div className="bg-purple-500/10 p-2 rounded-lg group-hover/item:bg-purple-500/20 transition-colors shrink-0">
                      <ImageIcon className="w-5 h-5 text-purple-400 transition-transform group-hover/item:scale-110" />
                    </div>
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[11px] font-black uppercase tracking-widest text-white group-hover/item:drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all truncate">Showroom</span>
                      <span className="text-[9px] font-bold text-zinc-500 tracking-wider truncate">Visual Gallery</span>
                    </div>
                  </Link>

                  <div className="mt-1 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 relative z-10 overflow-hidden w-full">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-emerald-400 leading-relaxed whitespace-normal break-words w-full">
                      INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🔥 B2B SERVISI 🔥 */}
          <div className="relative z-50 hidden xl:flex items-center gap-1.5 xl:gap-2 ml-1 border-l border-white/10 pl-2 xl:pl-3 shrink-0">
            <Link to="/standard-mocup" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-2 rounded-full bg-orange-500 border-2 border-orange-400 text-white font-black hover:bg-orange-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(249,115,22,0.6)] whitespace-nowrap cursor-pointer">
              <MonitorPlay className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" />
              <span className="text-[9px] xl:text-[10px] uppercase tracking-widest">SaaS MOCKUPS</span>
            </Link>

            <Link 
              to={isAdmin ? "/ui-ux" : "/ui-ux/vault"} 
              onClick={() => window.scrollTo(0,0)} 
              className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-2 rounded-full bg-black border-2 border-orange-500 text-orange-500 font-black hover:bg-orange-500 hover:text-black transition-colors duration-150 shadow-[0_0_15px_rgba(249,115,22,0.4)] hover:shadow-[0_0_25px_rgba(249,115,22,0.8)] whitespace-nowrap cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] xl:text-[10px] uppercase tracking-widest">UI/UX</span>
            </Link>

            <Link 
              to="/pdf-translator" 
              onClick={() => window.scrollTo(0,0)} 
              className="flex items-center gap-1 xl:gap-1.5 px-3 xl:px-4 py-2 rounded-full bg-emerald-950/50 border-2 border-emerald-500 text-emerald-400 font-black hover:bg-emerald-500 hover:text-white transition-colors duration-150 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] whitespace-nowrap cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[9px] xl:text-[10px] uppercase tracking-widest">PDF TRANS</span>
            </Link>
          </div>

          {/* AUTH SYSTEM */}
          {user ? (
             <div className="flex items-center gap-2 ml-1 lg:border-l lg:border-white/10 lg:pl-2 xl:pl-3 relative group shrink-0">
                 <button className="flex items-center gap-2 px-2.5 xl:px-3 py-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 text-white transition-all shadow-md cursor-pointer whitespace-nowrap">
                   {userCredits?.trialClaimed === false && !isAdmin ? (
                     <>
                        <Gift className="w-3.5 h-3.5 text-fuchsia-400 animate-pulse shrink-0" /> 
                        <span className="font-black text-[9px] xl:text-[10px] tracking-widest uppercase">CLAIM TRIAL</span>
                     </>
                   ) : (
                     <>
                        {user.photoURL ? (
                           <img src={user.photoURL} alt="User Avatar" className="w-4 h-4 xl:w-5 xl:h-5 rounded-full object-cover border border-white/20 shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                           <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                        )}
                        <span className="font-black text-[9px] xl:text-[10px] tracking-widest uppercase">{isAdmin ? 'ADMIN' : 'ACCOUNT'}</span>
                     </>
                   )}
                   <ChevronDown className="w-3 h-3 text-zinc-400 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
                 </button>

                 <div className="absolute top-full right-0 pt-4 opacity-0 translate-y-4 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-400 z-[9999]">
                   <div className="bg-black/95 backdrop-blur-2xl border border-white/10 border-t-emerald-500 rounded-2xl p-4 w-64 shadow-2xl flex flex-col gap-2 relative overflow-hidden">
                     
                     {userCredits?.trialClaimed === false && !isAdmin && (
                        <div className="mb-2 border-b border-white/10 pb-3">
                            <p className="text-zinc-400 text-[10px] font-bold mb-2">Unlock the Master Engines for free.</p>
                            <button type="button" onClick={handleClaimTrial} className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black uppercase text-[11px] py-3 rounded-xl hover:scale-[1.02] transition-all shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                              CLAIM 11 CREDITS NOW
                            </button>
                        </div>
                     )}

                     <div className="text-left border-b border-white/10 pb-2 mb-1">
                        <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Processing Power</h4>
                     </div>
                     
                     <Link to="/v8-standard-16mp" className="flex items-center justify-between bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl transition-all">
                        <span className="text-blue-400 font-black text-[10px] uppercase flex items-center gap-2"><ImageIcon className="w-3.5 h-3.5 shrink-0"/> 16MP Standard</span>
                        <span className="text-white font-black text-[11px] drop-shadow-md">{isAdmin ? '∞' : userCredits.credits_16mp}</span>
                     </Link>
                     
                     <Link to="/master-33mp" className="flex items-center justify-between bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 px-3 py-2 rounded-xl transition-all mt-1">
                        <span className="text-yellow-400 font-black text-[10px] uppercase flex items-center gap-2"><Cpu className="w-3.5 h-3.5 shrink-0"/> 33.2MP Master</span>
                        <span className="text-white font-black text-[11px] drop-shadow-md">{isAdmin ? '∞' : userCredits.credits_33mp}</span>
                     </Link>

                     <Link to="/master-45mp" className="flex items-center justify-between bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-2 rounded-xl transition-all mt-1">
                        <span className="text-amber-400 font-black text-[10px] uppercase flex items-center gap-2"><Zap className="w-3.5 h-3.5 shrink-0"/> 45.1MP Extreme</span>
                        <span className="text-white font-black text-[11px] drop-shadow-md">{isAdmin ? '∞' : userCredits.credits_45mp}</span>
                     </Link>
                     
                     <Link to="/master-60mp" className="flex items-center justify-between bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-2 rounded-xl transition-all mt-1">
                        <span className="text-rose-400 font-black text-[10px] uppercase flex items-center gap-2"><Cpu className="w-3.5 h-3.5 shrink-0"/> 60MP Extreme</span>
                        <span className="text-white font-black text-[11px] drop-shadow-md">{isAdmin ? '∞' : '0'}</span>
                     </Link>

                     {(isAdmin || isVIP) && (
                        <>
                            <div className="text-left border-b border-white/10 pb-2 mt-2 mb-1">
                                <h4 className="text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Portal Access</h4>
                            </div>
                            {isAdmin && (
                                <>
                                   <Link to="/admin" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-red-400 transition-all">
                                      <Settings className="w-3.5 h-3.5 shrink-0" /> <span className="font-black text-[10px] uppercase tracking-widest">CMS DB</span>
                                   </Link>
                                   <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-yellow-400 transition-all mt-1">
                                      <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> <span className="font-black text-[10px] uppercase tracking-widest">DASHBOARD</span>
                                   </Link>
                                </>
                            )}
                            {isVIP && (
                                <Link to="/trezor" className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-xl text-orange-400 transition-all mt-1">
                                   <Lock className="w-3.5 h-3.5 shrink-0" /> <span className="font-black text-[10px] uppercase tracking-widest">VAULT</span>
                                </Link>
                            )}
                        </>
                     )}

                     <div className="mt-2 pt-2 border-t border-white/10">
                        <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all cursor-pointer">
                           <LogOut className="w-3.5 h-3.5 shrink-0" />
                           <span className="font-black text-[10px] uppercase tracking-widest">Sign Out</span>
                        </button>
                     </div>

                   </div>
                 </div>
               </div>
          ) : (
             <div className="ml-1 border-l border-white/10 pl-2 xl:pl-3 shrink-0">
               <button type="button" onClick={handleLogin} className="bg-zinc-800 px-2.5 xl:px-3 py-2 rounded-full text-zinc-400 shadow-xl hover:bg-zinc-700 hover:text-white transition-all border border-white/5 cursor-pointer whitespace-nowrap text-[9px] xl:text-[10px] shrink-0">
                 <User className="w-3.5 h-3.5 inline mr-1 xl:mr-1.5 shrink-0" /> LOGIN
               </button>
             </div>
          )}

          {/* HAMBURGER DUGME */}
          <button
            type="button"
            onClick={() => { setIsMobileMenuOpen((previous) => !previous); if (!isMobileMenuOpen) trackV8Action("mobile_menu_opened"); }}
            className="relative z-[1002] ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-300/70 bg-orange-600 text-white shadow-[0_0_22px_rgba(249,115,22,0.55)] ring-1 ring-orange-500/30 transition-all hover:bg-orange-500 active:scale-95 sm:h-12 sm:w-12 xl:hidden"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

        </div>
      </nav>

      {/* 🔥 MOBILNI MENI 🔥 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="v8-mobile-navigation"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed inset-0 z-[99999] flex h-[100dvh] w-[100dvw] max-w-[100dvw] touch-pan-y flex-col overflow-y-auto overflow-x-hidden overscroll-contain bg-[#050505]/95 backdrop-blur-3xl"
          >
            {/* MOBILNI MENI HEADER */}
            <div className="sticky top-0 z-20 flex w-full max-w-full shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#050505]/95 px-3 py-4 backdrop-blur-3xl sm:p-5">
              <div className="flex items-center gap-3 min-w-0">
                <img src={data.logoUrl} className="h-8 object-contain shrink-0" alt="logo" />
                <span className="font-black uppercase tracking-[0.1em] text-orange-500 italic text-[12px] truncate w-full">V8 NAV SYSTEM</span>
              </div>
              <button type="button" onClick={() => setIsMobileMenuOpen(false)} className="ml-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 transition-all hover:bg-zinc-800 hover:text-white active:scale-95">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex w-full max-w-full min-w-0 flex-col gap-6 overflow-x-hidden px-3 py-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:p-6 sm:pb-24">
              
              {user ? (
                <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-5 flex flex-col gap-4 w-full max-w-full">
                  <div className="flex items-center gap-3 pb-4 border-b border-white/10 min-w-0">
                    {user.photoURL ? (
                       <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-emerald-500/30 object-cover shrink-0" referrerPolicy="no-referrer" />
                    ) : (
                       <User className="w-8 h-8 text-emerald-500 bg-emerald-500/10 p-1.5 rounded-full shrink-0" />
                    )}
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="font-black text-white text-[14px] uppercase tracking-widest truncate w-full">{user.displayName || "V8 KLIJENT"}</h3>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold truncate w-full">{user.email}</p>
                    </div>
                  </div>

                  {userCredits?.trialClaimed === false && !isAdmin && (
                    <button type="button" onClick={handleClaimTrial} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black uppercase text-[12px] py-4 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] whitespace-normal break-words px-2 text-center">
                      <Gift className="w-5 h-5 shrink-0" /> CLAIM 11 FREE CREDITS
                    </button>
                  )}

                  <div className="grid w-full min-w-0 grid-cols-2 gap-3">
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 truncate w-full text-center">16MP</span>
                      <span className="text-xl font-black text-blue-400 truncate w-full text-center">{isAdmin ? '∞' : userCredits.credits_16mp}</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 truncate w-full text-center">33MP</span>
                      <span className="text-xl font-black text-yellow-400 truncate w-full text-center">{isAdmin ? '∞' : userCredits.credits_33mp}</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 truncate w-full text-center">45MP</span>
                      <span className="text-xl font-black text-amber-500 truncate w-full text-center">{isAdmin ? '∞' : userCredits.credits_45mp}</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-0">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1 truncate w-full text-center">60MP</span>
                      <span className="text-xl font-black text-rose-500 truncate w-full text-center">{isAdmin ? '∞' : '0'}</span>
                    </div>
                  </div>

                  {(isAdmin || isVIP) && (
                    <div className="flex flex-col gap-2 mt-2 w-full">
                      {isAdmin && (
                        <>
                          <Link to="/admin" onClick={handleMobileLinkClick} className="w-full bg-red-950/30 text-red-500 border border-red-500/30 rounded-xl py-3 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest truncate px-2">
                            <Settings className="w-4 h-4 shrink-0" /> CMS Baza
                          </Link>
                          <Link to="/dashboard" onClick={handleMobileLinkClick} className="w-full bg-yellow-950/30 text-yellow-500 border border-yellow-500/30 rounded-xl py-3 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest truncate px-2">
                            <ShieldAlert className="w-4 h-4 shrink-0" /> Dashboard
                          </Link>
                        </>
                      )}
                      {isVIP && (
                        <Link to="/trezor" onClick={handleMobileLinkClick} className="w-full bg-orange-950/30 text-orange-500 border border-orange-500/30 rounded-xl py-3 flex items-center justify-center gap-2 font-black text-[11px] uppercase tracking-widest truncate px-2">
                          <Lock className="w-4 h-4 shrink-0" /> Vault Trezor
                        </Link>
                      )}
                    </div>
                  )}

                  <button type="button" onClick={handleLogout} className="mt-4 w-full bg-red-600 hover:bg-red-500 text-white font-black text-[12px] uppercase py-4 rounded-xl flex items-center justify-center gap-2 truncate px-2 cursor-pointer">
                    <LogOut className="w-5 h-5 shrink-0" /> Sign Out
                  </button>
                </div>
              ) : (
                <button type="button" onClick={handleLogin} className="w-full bg-zinc-800 text-white border border-zinc-600 rounded-3xl py-6 flex flex-col items-center justify-center gap-3 shadow-xl mx-auto px-4 cursor-pointer">
                  <User className="w-8 h-8 text-zinc-400 shrink-0" />
                  <span className="font-black text-[16px] uppercase tracking-widest text-center whitespace-normal break-words">LOGIN TO V8</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase text-center whitespace-normal break-words">Pristupi Premium Alatima</span>
                </button>
              )}

              <div className="flex flex-col gap-6 w-full min-w-0">
                
                {/* Glavni Meni */}
                <div className="flex flex-col gap-3 w-full">
                  <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] border-b border-white/5 pb-2 truncate w-full">Glavni Meni</h4>
                  
                  <Link to="/" onClick={handleMobileLinkClick} className="flex items-center gap-3 sm:gap-4 bg-black border border-white/5 p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0">
                    <div className="bg-emerald-500/10 p-3 rounded-xl shrink-0"><Globe className="w-6 h-6 text-emerald-500" /></div>
                    <span className="text-[13px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full">Početna Strana</span>
                  </Link>

                  <Link to="/portfolio" onClick={handleMobileLinkClick} className="flex items-center gap-3 sm:gap-4 bg-black border border-white/5 p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0">
                    <div className="bg-emerald-500/10 p-3 rounded-xl shrink-0"><Briefcase className="w-6 h-6 text-emerald-500" /></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full">Portfolio</span>
                      <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase truncate w-full">V8 Master Gallery</span>
                    </div>
                  </Link>

                  {/* 🔥 NOVO: AI AGENTS DUGME ZA MOBILNI 🔥 */}
                  <Link to="/ai-agents" onClick={handleMobileLinkClick} className="flex items-center gap-3 sm:gap-4 bg-cyan-600 border border-cyan-500 p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0 shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                    <div className="bg-white/20 p-3 rounded-xl shrink-0"><Bot className="w-6 h-6 text-white" /></div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full">AI AGENTS</span>
                      <span className="text-[9px] sm:text-[10px] text-cyan-200 font-bold uppercase truncate w-full">Sales & Support</span>
                    </div>
                  </Link>

                  <Link to="/standard-mocup" onClick={handleMobileLinkClick} className="flex items-center justify-between bg-black border border-white/5 p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      <div className="bg-orange-500/10 p-2.5 sm:p-3 rounded-xl shrink-0"><MonitorPlay className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full">SaaS Mockups</span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase truncate w-full">B2B Visual Protocol</span>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    to={isAdmin ? "/ui-ux" : "/ui-ux/vault"} 
                    onClick={handleMobileLinkClick} 
                    className="flex items-center justify-between bg-black border border-white/5 p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      <div className="bg-orange-500/10 p-2.5 sm:p-3 rounded-xl shrink-0"><LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" /></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full">UI/UX Inženjering</span>
                        <span className="text-[9px] sm:text-[10px] text-zinc-500 font-bold uppercase truncate w-full">Premium Web Systems</span>
                      </div>
                    </div>
                  </Link>

                  <Link 
                    to="/pdf-translator" 
                    onClick={handleMobileLinkClick} 
                    className="flex items-center justify-between bg-emerald-950/20 border border-emerald-500/30 p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      <div className="bg-emerald-500/10 p-2.5 sm:p-3 rounded-xl shrink-0"><FileText className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" /></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-widest text-emerald-400 truncate w-full">PDF Translator</span>
                        <span className="text-[9px] sm:text-[10px] text-emerald-500/60 font-bold uppercase truncate w-full">Enterprise AI Prevodi</span>
                      </div>
                    </div>
                  </Link>
                  
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] border-b border-white/5 pb-2 truncate w-full">Premium Visuals</h4>
                  
                  <Link to="/stock" onClick={handleMobileLinkClick} className="flex items-center justify-between bg-blue-600 border-2 border-blue-500 p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      <div className="bg-white/20 p-2.5 sm:p-3 rounded-xl shrink-0"><Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" /></div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] sm:text-[14px] font-black uppercase tracking-widest text-white truncate w-full drop-shadow-md">Premium Stock</span>
                        <span className="text-[9px] sm:text-[10px] text-blue-200 font-bold uppercase truncate w-full">Master Bundles</span>
                      </div>
                    </div>
                  </Link>
                  
                  <Link to="/showroom" onClick={handleMobileLinkClick} className="flex items-center justify-between bg-black border border-white/5 p-3 sm:p-4 rounded-2xl active:scale-95 transition-transform w-full min-w-0">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                      <div className="bg-purple-500/10 p-2.5 sm:p-3 rounded-xl shrink-0"><ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" /></div>
                      <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-widest text-white truncate w-full">V8 Showroom</span>
                    </div>
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default V8Navbar;
// KRAJ FAJLA: V8Navbar.jsx