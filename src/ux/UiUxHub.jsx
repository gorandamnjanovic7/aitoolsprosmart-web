// FAJL: UiUxHub.jsx
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Briefcase, ChevronRight, Lock, Sparkles, ShieldAlert, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ADMIN_EMAILS = [
  "damnjanovicgoran7@gmail.com",
  "aitoolsprosmart@gmail.com",
  "info@aitoolsprosmart.com"
];

const UiUxHub = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking' | 'admin' | 'redirect'

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      const email = user?.email?.toLowerCase() || "";
      if (user && ADMIN_EMAILS.includes(email)) {
        setAuthState('admin');
      } else {
        setAuthState('redirect');
      }
    });
    return () => unsub();
  }, []);

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-[#121722] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
      </div>
    );
  }

  // Svi koji nisu Admin idu direktno na Vault / Pricing kartice
  if (authState === 'redirect') {
    return <Navigate to="/ui-ux/vault" replace />;
  }

  // Ovaj ekran vidiš isključivo ti kao ulogovan Admin
  return (
    <div className="min-h-screen bg-[#121722] pt-24 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* AMBIJENTALNA SVETLA PRILAGOĐENA #121722 PALETI */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-amber-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* DISKRETNA TAČKASTA MREŽA KAO NA STOCK STRANICI */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3N2Zz4=')] opacity-60 pointer-events-none"></div>

      <div className="text-center mb-20 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2232] border border-white/10 mb-6 backdrop-blur-md shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase">V10 Admin Command</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[0.1em] mb-4 drop-shadow-2xl">
          UI/UX <span className="text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-400 to-orange-500">Database</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-[0.4em]">
          Select Operational Sector
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl relative z-10">
        
        {/* KARTICA 1: V10 VAULT */}
        <Link to="/ui-ux/vault" className="flex-1 group outline-none">
          <motion.div 
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.98 }}
            className="h-full min-h-[500px] bg-gradient-to-b from-[#171e2c] to-[#0d121b] backdrop-blur-2xl border border-white/10 group-hover:border-amber-400/50 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_80px_rgba(245,158,11,0.15)] relative overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-colors duration-700 pointer-events-none"></div>
            
            <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute inset-0 border border-amber-400/30 rounded-3xl group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#1f293d] to-[#121722] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <FlaskConical className="w-10 h-10 text-amber-400 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">V10 Vault</h2>
            <div className="w-12 h-1 bg-amber-400 mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 font-medium">
              R&D Laboratory. Commercial UI/UX systems, Master PSD compositions, and 150MP production assets.
            </p>
            
            <div className="mt-auto inline-flex items-center gap-3 text-amber-400 font-black uppercase tracking-[0.2em] text-xs">
              Access Vault 
              <span className="w-8 h-8 rounded-full bg-amber-400/10 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-[#121722] transition-colors duration-300">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </motion.div>
        </Link>

        {/* KARTICA 2: COMMERCIAL OPS */}
        <Link to="/ui-ux/commercial" className="flex-1 group outline-none">
          <motion.div 
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.98 }}
            className="h-full min-h-[500px] bg-gradient-to-b from-[#171e2c] to-[#0d121b] backdrop-blur-2xl border border-white/10 group-hover:border-blue-400/50 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_80px_rgba(59,130,246,0.18)] relative overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-colors duration-700 pointer-events-none"></div>

            <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute inset-0 border border-blue-400/30 rounded-3xl group-hover:-rotate-12 transition-transform duration-500"></div>
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#1f293d] to-[#121722] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <Briefcase className="w-10 h-10 text-blue-400 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">Commercial Ops</h2>
            <div className="w-12 h-1 bg-blue-400 mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-10 font-medium">
              B2B Client Projects. Security checkouts, UI/UX billing systems, and high-end commercial integrations.
            </p>
            
            <div className="mt-auto inline-flex items-center gap-3 text-blue-400 font-black uppercase tracking-[0.2em] text-xs">
              <ShieldAlert className="w-4 h-4" /> Enter Command Center
              <span className="ml-auto w-8 h-8 rounded-full bg-blue-400/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                <Lock className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
};

export default UiUxHub;