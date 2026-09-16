// FAJL: UiUxHub.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Briefcase, ChevronRight, Lock, KeyRound, X, Sparkles, ShieldAlert } from 'lucide-react';

// POČETAK FUNKCIJE: UiUxHub
const UiUxHub = () => {
  const navigate = useNavigate();
  
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // POČETAK FUNKCIJE: handlePinSubmit
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === 'Goran1234') {
      navigate('/ui-ux/commercial');
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };
  // KRAJ FUNKCIJE: handlePinSubmit

  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* V8 AMBIJENTALNA SVETLA */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] bg-[#ff6a00]/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      {/* TECH GRID */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-50 pointer-events-none"></div>

      <div className="text-center mb-20 relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-[#ff6a00]" />
          <span className="text-[10px] font-black tracking-[0.3em] text-zinc-300 uppercase">V8 Core Engine</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[0.1em] mb-4 drop-shadow-2xl">
          UI/UX <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#ff6a00] to-[#ff9d00]">Database</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-base font-bold uppercase tracking-[0.4em]">
          Select Operational Sector
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 w-full max-w-6xl relative z-10">
        
        {/* KARTICA 1: VAULT */}
        <Link to="/ui-ux/vault" className="flex-1 group outline-none">
          <motion.div 
            whileHover={{ y: -10 }}
            whileTap={{ scale: 0.98 }}
            className="h-full min-h-[500px] bg-gradient-to-b from-[#0a0a0a]/90 to-[#020202]/90 backdrop-blur-2xl border border-white/5 group-hover:border-[#ff6a00]/40 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 shadow-[0_0_0_rgba(255,106,0,0)] group-hover:shadow-[0_20px_80px_rgba(255,106,0,0.15)] relative overflow-hidden flex flex-col"
          >
            {/* INNERSHADOW & GLOW */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#ff6a00]/10 rounded-full blur-[80px] group-hover:bg-[#ff6a00]/20 transition-colors duration-700 pointer-events-none"></div>
            
            <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-[#ff6a00]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute inset-0 border border-[#ff6a00]/30 rounded-3xl group-hover:rotate-12 transition-transform duration-500"></div>
              <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                <FlaskConical className="w-10 h-10 text-[#ff6a00] group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">V10 Vault</h2>
            <div className="w-12 h-1 bg-[#ff6a00] mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 font-medium">
              R&D Laboratory. Visual experiments, prompt engineering, and raw demonstration of the V10 engine's rendering power.
            </p>
            
            <div className="mt-auto inline-flex items-center gap-3 text-[#ff6a00] font-black uppercase tracking-[0.2em] text-xs">
              Access Vault 
              <span className="w-8 h-8 rounded-full bg-[#ff6a00]/10 flex items-center justify-center group-hover:bg-[#ff6a00] group-hover:text-black transition-colors duration-300">
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </motion.div>
        </Link>

        {/* KARTICA 2: COMMERCIAL OPS */}
        <div className="flex-1">
          <motion.div 
            whileHover={!showPin ? { y: -10 } : {}}
            className="h-full min-h-[500px] bg-gradient-to-b from-[#0a0a0a]/90 to-[#020202]/90 backdrop-blur-2xl border border-white/5 hover:border-blue-500/40 rounded-[2.5rem] p-10 md:p-14 transition-all duration-500 shadow-[0_0_0_rgba(59,130,246,0)] hover:shadow-[0_20px_80px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] hover:bg-blue-600/20 transition-colors duration-700 pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {!showPin ? (
                /* STANJE: KARTICA ZATVORENA */
                <motion.div 
                  key="card-info"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  onClick={() => setShowPin(true)}
                  className="w-full h-full flex flex-col cursor-pointer group outline-none"
                >
                  <div className="relative w-28 h-28 mb-10 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="absolute inset-0 border border-blue-500/30 rounded-3xl group-hover:-rotate-12 transition-transform duration-500"></div>
                    <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Briefcase className="w-10 h-10 text-blue-500 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                  </div>

                  <h2 className="text-3xl font-black text-white uppercase tracking-[0.2em] mb-4">Commercial Ops</h2>
                  <div className="w-12 h-1 bg-blue-500 mb-6 rounded-full group-hover:w-24 transition-all duration-500"></div>
                  <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-10 font-medium">
                    B2B Client Projects. Security checkouts, UI/UX billing systems, and high-end commercial integrations.
                  </p>
                  
                  <div className="mt-auto inline-flex items-center gap-3 text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">
                    <ShieldAlert className="w-4 h-4" /> Strictly Classified
                    <span className="ml-auto w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                      <Lock className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* STANJE: PIN FORMA */
                <motion.div 
                  key="card-pin"
                  initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center text-center relative z-20"
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowPin(false); setPin(''); setError(false); }} 
                    className="absolute -top-4 -right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:rotate-90 transition-all text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="w-20 h-20 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <Lock className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-2">Admin Clearance</h3>
                  <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-10">Enter authorization key</p>
                  
                  <form onSubmit={handlePinSubmit} className="w-full max-w-[260px]">
                    <div className="relative mb-6">
                      <input 
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full bg-black/50 border ${error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] text-red-500' : 'border-zinc-800 focus:border-blue-500 text-white'} rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.4em] font-black outline-none transition-all`}
                        autoFocus
                      />
                      {error && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          className="text-red-500 text-[10px] uppercase tracking-[0.2em] absolute -bottom-7 w-full font-black"
                        >
                          Access Denied
                        </motion.p>
                      )}
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black uppercase tracking-[0.2em] text-xs py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)]"
                    >
                      <KeyRound className="w-4 h-4" /> Authorize
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>
    </div>
  );
};
export default UiUxHub;
// KRAJ FUNKCIJE: UiUxHub