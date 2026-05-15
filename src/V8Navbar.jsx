// POČETAK FAJLA: V8Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ImageIcon, Zap, Lock, LogOut, User, LayoutDashboard, Database } from 'lucide-react';

// 🔥 FIREBASE MOZAK 🔥
import { auth, provider } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { v8Toast } from './App';
import * as data from './data';
import navBg from './navbar-bg.webp';

const V8Navbar = ({ handleHomeClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- V8 INSTANT RADAR ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- DIREKTNA PROVERA (BEZ ČEKANJA) ---
  const email = currentUser?.email?.toLowerCase() || "";
  const isGoran = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload(); 
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 SYSTEM ONLINE!");
    } catch (err) { console.error(err); }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[9999]">
      <nav className={`w-full transition-all duration-500 border-b-2 ${scrolled ? 'py-3 bg-black/95 backdrop-blur-xl border-orange-500/60 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : 'py-5 bg-transparent border-transparent'}`}
        style={{ backgroundImage: scrolled ? `linear-gradient(rgba(5, 5, 5, 0.9), rgba(5, 5, 5, 0.9)), url(${navBg})` : 'none', backgroundSize: 'cover' }}>
        
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8">
          
          {/* LOGO */}
          <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 shrink-0">
            <img src={data.logoUrl} className={`object-contain transition-all duration-500 ${scrolled ? 'h-8' : 'h-10'} animate-pulse`} alt="logo" />
            <div className="flex flex-col md:flex-row md:gap-1.5 font-black italic leading-none">
              <span className="text-blue-500 text-[10px] md:text-[14px] uppercase tracking-widest">AI TOOLS</span>
              <span className="text-orange-500 text-[10px] md:text-[14px] uppercase tracking-widest">PRO SMART</span>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-2 md:gap-4 font-black uppercase text-[10px] tracking-widest">
            
            <Link to="/" className="hidden sm:inline-block px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300">Home</Link>

            {/* V8 TOOLS DROPDOWN */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-red-600 to-orange-600 border border-orange-400 text-white shadow-lg cursor-pointer">
                <Zap className="w-3.5 h-3.5 text-yellow-300" /> <span className="hidden md:inline">V8 TOOLS</span><ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999]">
                <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 w-52 shadow-2xl flex flex-col gap-1">
                  <Link to="/enxance" className="px-4 py-3 rounded-xl hover:bg-orange-500/10 hover:text-orange-400 transition-all font-black text-[10px]">10X ENHANCER</Link>
                  <Link to="/optimizer" className="px-4 py-3 rounded-xl hover:bg-orange-500/10 hover:text-orange-400 transition-all font-black text-[10px]">V8 OPTIMIZER</Link>
                  <Link to="/#marketplace" className="px-4 py-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all font-black text-[10px]">AI STORE</Link>
                </div>
              </div>
            </div>

            {/* STOCK DROPDOWN */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-blue-900/30 border border-blue-500/50 text-blue-300 cursor-pointer hover:text-white transition-all">
                <ImageIcon className="w-3.5 h-3.5" /> <span className="hidden md:inline">STOCK</span><ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full right-0 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[9999]">
                <div className="bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 w-52 shadow-2xl flex flex-col gap-1">
                  <Link to="/stock" className="px-4 py-3 rounded-xl hover:bg-blue-500/10 hover:text-blue-400 transition-all font-black text-[10px]">BUNDLES</Link>
                  <Link to="/showroom" className="px-4 py-3 rounded-xl hover:bg-purple-500/10 hover:text-purple-400 transition-all font-black text-[10px]">SHOWROOM</Link>
                </div>
              </div>
            </div>

            {/* --- V8 AUTH LOGIC (NEPROBOJNO - SAMO ZA GORANA) --- */}
            <div className="flex items-center gap-2 border-l border-white/10 pl-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  {/* AKO SI TO TI, CRTAMO SVE BEZ PITANJA */}
                  {isGoran && (
                    <>
                      <Link to="/dashboard" className="bg-yellow-600/20 border border-yellow-500/50 text-yellow-400 px-3 py-2 rounded-full text-[9px] hover:bg-yellow-600 hover:text-white transition-all shadow-lg flex items-center gap-1.5">
                        <LayoutDashboard size={12} /> DASHBOARD
                      </Link>
                      <Link to="/admin" className="hidden lg:flex bg-red-600/20 border border-red-500/50 text-red-400 px-3 py-2 rounded-full text-[9px] items-center gap-1.5 hover:bg-red-600 hover:text-white transition-all">
                        <Database size={12} /> CMS
                      </Link>
                    </>
                  )}
                  
                  {/* VAULT ZA TEBE I VIP KORISNIKE */}
                  <Link to="/trezor" className="bg-orange-600/20 border border-orange-500/50 text-orange-400 px-3 py-2 rounded-full text-[9px] flex items-center gap-1.5 hover:bg-orange-600 hover:text-white transition-all shadow-lg">
                    <Lock className="w-3 h-3" /> VAULT
                  </Link>

                  <button onClick={handleLogout} className="text-zinc-500 hover:text-red-500 p-2 bg-white/5 rounded-full cursor-pointer transition-all">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLogin} className="bg-zinc-800 px-5 py-2 rounded-full text-zinc-400 border border-white/5 hover:bg-zinc-700 hover:text-white transition-all cursor-pointer font-black text-[10px]">
                   LOGIN
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>
    </div>
  );
};
export default V8Navbar;
// KRAJ FAJLA: V8Navbar.jsx