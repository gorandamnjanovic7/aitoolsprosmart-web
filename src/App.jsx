import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Zap, ShieldAlert, Mail, LogOut, User, CheckCircle, Clock, Layers, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// FIREBASE
import { auth, provider } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";

// V8 GLOBAL COMPONENTS
import V8Enhancer10x from './V8Enhancer10x';
import V8StockMarket from './V8StockBerza';
import V8AdminDashboard from './V8AdminDashboard';
import V8Promo10xPage from './V8Promo10xPage'; 
import { VisitorCounter } from './VisitorCounter';
import V8ContactWidget from './V8ContactWidget';

// V8 TOAST SYSTEM
export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};

const V8ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return v8Toast.subscribe((t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${t.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : 'bg-red-900/40 border-red-500/50 text-red-100'}`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

function AppContent() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVIPLoggedIn, setIsVIPLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
       if(user) {
          setIsVIPLoggedIn(true);
          setIsAdmin(user.email === "damnjanovicgoran7@gmail.com");
       } else { 
         setIsVIPLoggedIn(false); 
         setIsAdmin(false); 
       }
    }); 
    return () => unsub();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      v8Toast.success("Login successful!");
    } catch (err) {
      v8Toast.error("Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative text-left">
      <V8ToastContainer />
      
      {/* HEADER NAV */}
      <div className="fixed top-0 left-0 w-full z-[8000]">
        <nav className="w-full px-4 md:px-8 py-4 bg-[#050505]/90 backdrop-blur-xl border-b border-orange-500/20 shadow-[0_10px_30px_rgba(255,140,0,0.05)] relative z-[9000]">
          <div className="max-w-7xl mx-auto flex justify-between items-center px-2">
            
            <Link to="/" className="flex items-center gap-3 group shrink-0 mr-4">
              <Zap className="h-8 w-8 text-orange-500 fill-orange-500 group-hover:scale-105 transition-transform" />
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.1em] text-blue-500 italic">AI TOOLS</span>
                <span className="text-[14px] md:text-[16px] font-black uppercase tracking-[0.1em] text-orange-500 italic">PRO SMART</span>
              </div>
            </Link>

            <div className="flex-1 flex items-center justify-end gap-3 font-black uppercase text-[9px] md:text-[10px] tracking-widest whitespace-nowrap">
              
              {/* LINK: 10X ENHANCER */}
              <Link to="/" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${location.pathname === '/' ? 'bg-orange-600 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'border border-orange-600/50 text-orange-500 hover:bg-orange-600 hover:text-white'}`}>
                <Zap className="w-3.5 h-3.5" /> 10X ENHANCER
              </Link>

              {/* LINK: STOCK MARKET */}
              <Link to="/stock" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${location.pathname === '/stock' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'border border-blue-600/50 text-blue-500 hover:bg-blue-600 hover:text-white'}`}>
                <Layers className="w-3.5 h-3.5" /> STOCK MARKET
              </Link>

              {/* LINK: PROMO PAGE */}
              <Link to="/promo" className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${location.pathname === '/promo' ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]' : 'border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black'}`}>
                <TrendingUp className="w-3.5 h-3.5" /> WATCH PREMIERE
              </Link>

              {isVIPLoggedIn ? (
                 <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-2">
                    {isAdmin && (
                      <Link to="/admin" className="bg-red-600/20 border border-red-500/50 text-red-400 px-3 py-1.5 rounded-full flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all text-[9px]">
                        <ShieldAlert className="w-3.5 h-3.5" /> ADMIN
                      </Link>
                    )}
                    <button onClick={() => { signOut(auth); v8Toast.success("Logged out."); }} className="text-zinc-500 hover:text-red-500 transition-colors p-2 bg-white/5 rounded-full">
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                 </div>
              ) : (
                <button onClick={handleLogin} className="bg-zinc-800 px-4 py-2 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all border border-white/5">
                  <User className="w-3.5 h-3.5 inline mr-1" /> LOGIN
                </button>
              )}
            </div>
          </div>
        </nav>
      </div>
      
      {/* MAIN ROUTES */}
      <div className="flex-1 text-left w-full">
        <Routes>
          <Route path="/" element={<V8Enhancer10x />} />
          <Route path="/stock" element={<V8StockMarket />} />
          <Route path="/admin" element={<V8AdminDashboard />} />
          <Route path="/promo" element={<V8Promo10xPage />} />
        </Routes>
      </div>

      {/* GLOBAL WIDGETS */}
      <VisitorCounter /> 
      <V8ContactWidget /> 

      {/* FOOTER */}
      <footer className="flex flex-col items-center gap-6 py-8 mt-12 bg-black border-t border-orange-500/30">
        <div className="w-full px-6 flex flex-col items-center gap-3">
           <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 text-[12px] text-zinc-400 hover:text-orange-500 transition-all mb-2">
             <Mail className="w-4 h-4" /> aitoolsprosmart@gmail.com
           </a>
           <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6 font-black uppercase italic text-[9px] tracking-[0.3em]">
              <div>© 2026 <span className="text-blue-500">AI TOOLS</span> <span className="text-orange-500">PRO SMART</span> | ALL RIGHTS RESERVED</div>
              <div className="text-orange-500 font-mono tracking-widest flex items-center gap-2 text-[13px] not-italic">
                <Clock className="w-4 h-4" /> {timeString}
              </div>
           </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() { 
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  ); 
}