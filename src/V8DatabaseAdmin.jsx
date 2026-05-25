// POČETAK FAJLA: V8OptimizerPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Download, ShieldCheck, RefreshCcw, Diamond, AlertTriangle, Clock } from 'lucide-react';
import { v8Toast } from './v8Utils';
import MagneticButton from './MagneticButton';
import navBg from './navbar-bg.webp'; // Koristimo istu pozadinu za konzistentnost

const V8OptimizerPage = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [activeLog, setActiveLog] = useState(0);
  const fileInputRef = useRef(null);

  // V8 Nabudženi Logovi iz terminala (Sa Plavim Dijamantima)
  const v8Logs = [
    "VISIONARY FACTORY V8 | IGNITING ENGINE...",
    "🔷 Contributor quality cleanup (ublaženi artefakti)",
    "🔷 Premium sharpness (prirodan detalj, no oversharp)",
    "🔷 Color grading (komercijalni balans i kontrast)",
    "🔷 Highlight rolloff (mekši svetli tonovi)",
    "🔷 Shadow depth (bogate i duboke senke)",
    "🔷 sRGB Marketplace Export (ready for upload)",
    "🔷 PRODUCT AD POLISH (premium visual finish)",
    "🔷 Anti-plastic realism (film grain & natural textures)",
    "SYSTEM STATUS: 100% | ALL SYSTEMS OPERATIONAL"
  ];

  const handleUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Limitiramo na 10 slika za V8 PRO plan
    if (selectedFiles.length > 10) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("V8 PRO plan is limited to 10 images per upload!");
      setFiles(selectedFiles.slice(0, 10));
    } else {
      setFiles(selectedFiles);
    }
    setResult(null);
  };

  const processImage = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setResult(null);
    setActiveLog(0);

    // Simulacija backend procesa dok ne blindiramo pravi Python server
    for (let i = 0; i < v8Logs.length; i++) {
      await new Promise(r => setTimeout(r, 600)); // Svaki log se pojavljuje nakon 600ms
      setActiveLog(i + 1);
    }

    setTimeout(() => {
      setIsProcessing(false);
      // Ovde ćemo kasnije dobiti pravi URL Zip fajla od tvog blindiranog servera
      setResult("V8_Enterprise_Batch.zip"); 
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 ENTERPRISE BATCH PROCESSED!");
    }, 500);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full text-center"
      >
        <div className="inline-block bg-orange-600/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-400 font-bold uppercase tracking-widest text-[9px] mb-6 shadow-[0_0_20px_rgba(234,88,12,0.1)] animate-pulse">V8 AUTOMATION // ENTERPRISE MODE</div>
        
        <h1 className="text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          V8 <span className="text-orange-500">PRO OPTIMIZER</span>
        </h1>
        <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[12px] mb-16 leading-relaxed max-w-3xl mx-auto border-l-2 border-orange-500 pl-6">
          Enterprise Cinematic Image Processing Engine for Stock Visuals, Advertising and Premium Agencies. Stop wasting hours on Photoshop, let the V8 core handle your batch. Compliance: Adobe Stock, Freepik, Shutterstock (sRGB).
        </p>

        <div className="grid md:grid-cols-2 gap-10 text-left mb-16 relative origin-center">
            <div className="absolute inset-0 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none scale-90"></div>

          {/* UPLOAD SEKCIJA */}
          <div className="p-8 rounded-3xl backdrop-blur-3xl border-2 border-orange-500/50 relative overflow-hidden group shadow-[0_20px_60px_rgba(234,88,12,0.1)] hover:shadow-[0_30px_90px_rgba(234,88,12,0.25)] transition-all duration-700"
               style={{backgroundImage: `linear-gradient(rgba(5, 5, 5, 0.9), rgba(5, 5, 5, 0.9)), url(${navBg})`, backgroundSize: 'cover'}}>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-600/20 rounded-2xl shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                <Upload className="text-orange-500 w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-widest text-white">RAW BATCH INPUT</h2>
            </div>
            
            <label className="group relative flex flex-col items-center justify-center w-full h-72 border-4 border-dashed border-white/10 rounded-2xl hover:border-orange-500 transition-all cursor-pointer bg-black/30 overflow-hidden shadow-inner group-hover:shadow-[0_0_25px_rgba(234,88,12,0.2)]">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black uppercase text-[12px] tracking-widest text-white">Click to select files</div>
              {files.length > 0 ? (
                <div className="flex flex-col items-center text-center px-4">
                  <ShieldCheck className="w-16 h-16 text-emerald-500 mb-3 drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                  <span className="text-zinc-100 font-black text-[13px] uppercase tracking-widest mb-1">{files.length} FILES LOADED</span>
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[9px]">V8 PRO Plan Limit: 10 images</span>
                </div>
              ) : (
                <>
                  <Zap className="w-14 h-14 text-zinc-800 group-hover:text-orange-500 transition-colors mb-6 animate-pulse" strokeWidth={1} />
                  <span className="text-zinc-600 font-bold uppercase tracking-[0.2em] text-[10px] group-hover:text-zinc-300 transition-colors">Drop or Click (Multiple Files)</span>
                </>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} accept="image/*" multiple />
            </label>

            <MagneticButton>
            <button 
              onClick={processImage}
              disabled={files.length === 0 || isProcessing}
              className={`w-full mt-8 py-5 rounded-xl font-black uppercase tracking-[0.4em] text-[12px] transition-all flex items-center justify-center gap-3 group-hover:scale-[1.02] ${
                files.length === 0 || isProcessing 
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/5' 
                : 'bg-orange-600 text-white shadow-[0_10px_30px_rgba(234,88,12,0.5)] hover:shadow-[0_15px_50px_rgba(234,88,12,0.8)] border border-orange-400 cursor-pointer'
              }`}
            >
              {isProcessing ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isProcessing ? "PROCESSING ENTERPRISE BATCH..." : "START V8 OPTIMIZATION"}
            </button>
            </MagneticButton>
          </div>

          {/* RESULT SEKCIJA */}
          <div className="p-8 rounded-3xl backdrop-blur-3xl border border-white/5 relative overflow-hidden group shadow-[0_20px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.1)] transition-all duration-700"
               style={{backgroundImage: `linear-gradient(rgba(5, 5, 5, 0.92), rgba(5, 5, 5, 0.92)), url(${navBg})`, backgroundSize: 'cover'}}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-800 rounded-2xl shadow-inner border border-white/5">
                    <Download className={`w-7 h-7 ${result ? 'text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'text-zinc-600'}`} />
                  </div>
                  <h2 className={`text-2xl font-black uppercase italic tracking-widest ${result ? 'text-emerald-400' : 'text-zinc-600'}`}>Optimized Output</h2>
                </div>
                {isProcessing && <div className="text-orange-500 font-black font-mono text-[10px] tracking-widest">{activeLog}/{v8Logs.length} PROCESSED</div>}
            </div>

            <div className="font-mono text-zinc-400 bg-black/40 border border-white/5 rounded-2xl p-6 h-72 text-[10px] tracking-widest uppercase overflow-y-auto leading-relaxed shadow-inner">
              <AnimatePresence>
                {v8Logs.slice(0, activeLog).map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-1.5 flex items-center gap-2"
                  >
                    {log === v8Logs[0] ? (
                       <span className="text-orange-500">{log}</span>
                    ) : log === v8Logs[v8Logs.length - 1] ? (
                       <span className="text-emerald-500 font-black">{log}</span>
                    ) : (
                       <span>{log}</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {!result && !isProcessing && files.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <Clock className="w-16 h-16 text-zinc-600 mb-4" strokeWidth={1} />
                  <span className="font-black uppercase tracking-widest text-[11px]">System Awaiting Input BATCH</span>
                </div>
              )}
            </div>

            <AnimatePresence>
            {result && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8">
                <button className="w-full bg-white text-black py-5 rounded-full font-black uppercase tracking-[0.4em] text-[12px] hover:bg-orange-500 hover:text-white transition-all shadow-[0_15px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_50px_rgba(234,88,12,0.6)] cursor-pointer">
                  Download Optimized V8 Batch
                </button>
              </motion.div>
            )}
            </AnimatePresence>
          </div>
        </div>

        {/* PRICING SEKCIJA (SaaS Model) */}
        <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-16">
            <div>
                <h3 className="text-3xl font-black italic uppercase text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">V8 BATCH <span className="text-orange-500">OPTIMIZATION</span> PLAN</h3>
                <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Premium tools requires premium fuel.</p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-blue-900/30 via-indigo-900/30 to-blue-900/30 border border-blue-500/50 p-8 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(59,130,246,0.1)] relative">
                <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-[80px] pointer-events-none scale-90"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8 relative z-10">
                    <div className="flex items-center gap-4">
                       <Diamond className="w-12 h-12 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" strokeWidth={1} />
                        <div>
                            <span className="text-orange-500 font-bold uppercase tracking-widest text-[10px]">SaaS MEMBERSHIP</span>
                            <h4 className="text-white font-black uppercase text-2xl tracking-widest">V8 <span className="text-blue-400">PRO</span> LICENSE</h4>
                        </div>
                    </div>
                    <div className="flex items-end gap-1.5">
                        <span className="text-white font-black font-mono text-5xl">$49</span>
                        <span className="text-zinc-400 font-bold uppercase tracking-widest text-[11px] mb-1.5">/month</span>
                    </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-4 font-black uppercase text-[11px] tracking-widest leading-relaxed relative z-10 mb-10">
                    <div className="text-blue-300">🔷 Full V8 Core Access 24/7</div>
                    <div className="text-blue-300">🔷 Batch Processing (Limit 10 images/batch)</div>
                    <div className="text-blue-300">🔷 Stock Market Compliance: 100% (sRGB)</div>
                    <div className="text-blue-300">🔷 Commercial Use License for all assets</div>
                    <div className="text-zinc-600">🔶 Increase image limit (Coming Soon)</div>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 border-t border-white/10 pt-8">
                     <AlertTriangle className="w-12 h-12 text-amber-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)] hidden md:block" />
                    <p className="text-zinc-500 font-bold normal-case text-[11px] flex-1 leading-relaxed text-center md:text-left"><strong>COMPLIANCE NOTICE:</strong> The V8 PRO Optimizer uses advanced cinematic algorithms. While highly effective, always review output files before commercial usage. Subscriptions are billed monthly via Whop. Cancel anytime.</p>
                    <MagneticButton>
                    <a href="https://whop.com/@your-whop-shop-url" target="_blank" rel="noopener noreferrer" className="bg-white text-black px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-[11px] hover:bg-orange-500 hover:text-white transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(234,88,12,0.4)] whitespace-nowrap">Subscribe on Whop // Open Vault</a>
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