// POČETAK FAJLA: V8OptimizerPage.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Download, ShieldCheck, RefreshCcw, Diamond, AlertTriangle, Clock, Image as ImageIcon } from 'lucide-react';
import { v8Toast } from './App';
import MagneticButton from './MagneticButton';
import navBg from './navbar-bg.webp'; 

// POČETAK FUNKCIJE: V8OptimizerPage
const V8OptimizerPage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLog, setActiveLog] = useState(0);

  // V8 TERMINAL LOGS
  const v8Logs = [
    "🚀 VISIONARY FACTORY V8 | IGNITING ENGINE...",
    "🔷 1. Contributor quality cleanup (artifact reduction)",
    "🔷 2. Premium sharpness (natural detail, no oversharp)",
    "🔷 3. Color grading (commercial balance & contrast)",
    "🔷 4. Highlight rolloff (softer highlights)",
    "🔷 5. Shadow depth (rich & deep shadows)",
    "🔷 6. sRGB Marketplace Export (ready for upload)",
    "🔷 7. PRODUCT AD POLISH (premium visual finish)",
    "🔷 8. Anti-plastic realism (film grain & natural textures)",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 10) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("V8 PRO LIMIT: MAX 10 IMAGES!");
      setFiles(selectedFiles.slice(0, 10));
    } else {
      setFiles(selectedFiles);
    }
    setResult(null);
    setActiveLog(0);
  };

  const processImage = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);
    setActiveLog(0);

    for (let i = 0; i < v8Logs.length; i++) {
      await new Promise(r => setTimeout(r, 450));
      setActiveLog(i + 1);
    }

    setTimeout(() => {
      setIsProcessing(false);
      setResult("V8_ENTERPRISE_BATCH.zip"); 
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 CINEMATIC BATCH READY!");
    }, 500);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 flex flex-col items-center bg-[#050505]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl w-full text-center">
        
        {/* --- POČETAK: HERO BOX --- */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]"
        >
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-60"
                style={{ backgroundImage: "url('/v8_py/v8_py_pozadina.webp')" }} 
            ></div>
            
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/30 via-[#050505]/70 to-[#050505]"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>

            <div className="relative z-10 py-24 px-6 text-center">
                <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] mb-8 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
                  V8 AUTOMATION // ENTERPRISE OPTIMIZER MODE
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                  V8 <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">PRO OPTIMIZER</span>
                </h1>
                
                <p className="text-zinc-200 font-bold uppercase tracking-[0.4em] text-[11px] md:text-[13px] max-w-3xl mx-auto leading-relaxed drop-shadow-lg bg-black/40 p-6 rounded-2xl backdrop-blur-sm border-l-2 border-orange-500">
                  Stop wasting hours in Photoshop. Your core transforms AI generations into commercial beasts ready for Adobe Stock, Freepik, and Shutterstock. 
                  <span className="text-white block mt-3 italic font-black">100% Marketplace Compliance.</span>
                </p>
            </div>
        </motion.div>
        {/* --- KRAJ: HERO BOX --- */}


        {/* --- POČETAK: SREDIŠNJA LISTA SA PULSIRAJUĆIM DIJAMANTIMA --- */}
        <div className="flex flex-col items-center justify-center mb-20 relative z-10">
          <div className="bg-black/50 border border-white/10 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-left inline-block hover:border-orange-500/30 transition-colors duration-500">
            <div className="flex flex-col gap-4 text-[11px] md:text-[12px] font-black uppercase tracking-widest text-zinc-400">
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">1. Contributor quality cleanup</span> <span className="text-zinc-500 lowercase tracking-normal">(artifact reduction)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">2. Premium sharpness</span> <span className="text-zinc-500 lowercase tracking-normal">(natural detail, no oversharp)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">3. Color grading</span> <span className="text-zinc-500 lowercase tracking-normal">(commercial balance & contrast)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">4. Highlight rolloff</span> <span className="text-zinc-500 lowercase tracking-normal">(softer highlights)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">5. Shadow depth</span> <span className="text-zinc-500 lowercase tracking-normal">(rich & deep shadows)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">6. sRGB Marketplace Export</span> <span className="text-zinc-500 lowercase tracking-normal">(ready for upload)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">7. PRODUCT AD POLISH</span> <span className="text-zinc-500 lowercase tracking-normal">(premium visual finish)</span></div>
              <div className="flex items-center gap-4"><span className="text-blue-400 text-xl animate-pulse drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">🔷</span> <span className="text-white">8. Anti-plastic realism</span> <span className="text-zinc-500 lowercase tracking-normal">(film grain & natural textures)</span></div>
              <div className="flex items-center gap-4 mt-4 border-t border-white/10 pt-6"><span className="text-emerald-400 text-xl drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]">✅</span> <span className="text-emerald-400 tracking-[0.2em] text-[13px]">SYSTEM STATUS: 100% | BATCH READY</span></div>
            </div>
          </div>
        </div>
        {/* --- KRAJ: SREDIŠNJA LISTA --- */}


        <div className="grid md:grid-cols-2 gap-10 text-left mb-20">
          
          {/* INPUT BOX */}
          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border-2 border-orange-500/40 relative overflow-hidden group shadow-2xl"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.88), rgba(0,0,0,0.88)), url(${navBg})`, backgroundSize: 'cover'}}>
            
            <div className="flex items-center gap-4 mb-10">
              <Upload className="text-orange-500 w-8 h-8" />
              <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">RAW BATCH INPUT</h2>
            </div>
            
            <label className="group relative flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-white/10 rounded-3xl hover:border-orange-500 transition-all cursor-pointer bg-black/40 overflow-hidden">
              {files.length > 0 ? (
                <div className="flex flex-col items-center text-center px-4">
                  <ShieldCheck className="w-20 h-20 text-emerald-500 mb-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                  <span className="text-white font-black text-lg uppercase tracking-widest">{files.length} FILES LOADED</span>
                </div>
              ) : (
                <>
                  <Zap className="w-16 h-16 text-zinc-800 group-hover:text-orange-500 transition-colors mb-6 animate-pulse" />
                  <span className="text-zinc-500 font-black uppercase tracking-[0.2em] text-[11px] group-hover:text-white transition-colors">DRAG & DROP RAW BATCH</span>
                </>
              )}
              <input type="file" className="hidden" onChange={handleUpload} accept="image/*" multiple />
            </label>

            <button onClick={processImage} disabled={files.length === 0 || isProcessing}
              className={`w-full mt-10 py-6 rounded-2xl font-black uppercase tracking-[0.5em] text-[13px] transition-all flex items-center justify-center gap-3 ${
                files.length === 0 || isProcessing ? 'bg-zinc-900 text-zinc-700 border border-white/5' : 'bg-orange-600 text-white shadow-[0_15px_40px_rgba(234,88,12,0.4)] border border-orange-400 hover:scale-[1.02] cursor-pointer'
              }`}>
              {isProcessing ? <RefreshCcw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
              {isProcessing ? "IGNITING V8 CORE..." : "START BATCH OPTIMIZATION"}
            </button>
          </div>

          {/* OUTPUT / TERMINAL BOX WITH DIAMONDS */}
          <div className="p-10 rounded-[2.5rem] backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-2xl"
               style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.94), rgba(0,0,0,0.94)), url(${navBg})`, backgroundSize: 'cover'}}>
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <Download className={`w-8 h-8 ${result ? 'text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'text-zinc-700'}`} />
                  <h2 className={`text-2xl font-black uppercase italic tracking-widest ${result ? 'text-emerald-400' : 'text-zinc-600'}`}>OPTIMIZED OUTPUT</h2>
                </div>
            </div>

            {/* THE TERMINAL LOG */}
            <div className="font-mono text-zinc-400 bg-black/60 border border-white/5 rounded-3xl p-8 h-80 text-[10px] md:text-[11px] tracking-widest uppercase overflow-y-auto shadow-inner leading-relaxed">
              <AnimatePresence>
                {v8Logs.slice(0, activeLog).map((log, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="mb-2.5 flex items-center gap-2">
                    {log.includes('🚀') ? <span className="text-orange-500 font-black">{log}</span> : 
                     log.includes('🔷') ? <span className="text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">{log}</span> : 
                     log.includes('✅') ? <span className="text-emerald-400 font-black">{log}</span> : 
                     <span>{log}</span>}
                  </motion.div>
                ))}
              </AnimatePresence>
              {!result && !isProcessing && (
                <div className="h-full flex flex-col items-center justify-center opacity-10">
                  <ImageIcon className="w-16 h-16 mb-4" />
                  <span className="font-black text-[10px]">AWAITING ENGINE START</span>
                </div>
              )}
            </div>

            {result && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10">
                <button className="w-full bg-white text-black py-6 rounded-full font-black uppercase tracking-[0.5em] text-[13px] hover:bg-orange-500 hover:text-white transition-all shadow-2xl">
                  DOWNLOAD V8 BATCH (.ZIP)
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* LIFETIME LICENSE SECTION - LEMON SQUEEZY EDITION */}
        <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-20">
            <div className="flex flex-col justify-center">
                <h3 className="text-4xl font-black italic uppercase text-white mb-4">LIFETIME <span className="text-orange-500 font-black">ACCESS</span></h3>
                <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Single purchase. Endless optimization. Own the V8 Core.</p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border border-blue-500/50 p-10 rounded-[3rem] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
                <div className="flex items-center gap-6 relative z-10">
                   <div className="p-4 bg-blue-500/20 rounded-3xl border border-blue-400/30">
                      <Diamond className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-bounce" />
                   </div>
                   <div>
                       <span className="text-orange-500 font-black uppercase text-[11px] tracking-[0.3em]">ONE-TIME PURCHASE</span>
                       <h4 className="text-white font-black uppercase text-3xl tracking-tighter">V8 <span className="text-blue-400">PRO</span> LICENSE</h4>
                   </div>
                </div>
                <div className="flex flex-col items-center md:items-end relative z-10">
                    <div className="flex items-end gap-2">
                        <span className="text-white font-black font-mono text-6xl">$130</span>
                        {/* SKLONJEN /month */}
                    </div>
                    <MagneticButton>
                        <button className="mt-6 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-yellow-400 hover:text-black transition-all shadow-xl flex items-center gap-2">
                            SECURE CHECKOUT 🍋
                        </button>
                    </MagneticButton>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};
// KRAJ FUNKCIJE: V8OptimizerPage

export default V8OptimizerPage;
// KRAJ FAJLA: V8OptimizerPage.jsx