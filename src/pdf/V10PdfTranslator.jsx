// ============================================================================
// POČETAK FAJLA: src/pdf/V10PdfTranslator.jsx
// ============================================================================
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, FileText, ArrowRight, Loader2, ShieldCheck, 
  CheckCircle, Image as ImageIcon, Layers, Lock, Zap, Crown, LayoutGrid, ChevronDown
} from 'lucide-react';

const LANGUAGES = [
  { code: 'auto', name: 'Auto-Detect Language' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
  { code: 'sr-Latn', name: 'Serbian (Latin)' },
  { code: 'sr-Cyrl', name: 'Serbian (Cyrillic)' },
  { code: 'hr', name: 'Croatian' }
];

// 🔥 CUSTOM V10 DROPDOWN KOMPONENTA 🔥
const V10Dropdown = ({ value, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.code === value);

  return (
    <div className="relative w-full z-[100]">
      <div 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full bg-black/50 border ${isOpen ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]' : 'border-zinc-800'} text-white px-5 py-4 rounded-xl text-sm font-semibold flex items-center justify-between transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-orange-500'}`}
      >
        <span>{selectedOption ? selectedOption.name : 'Select Language'}</span>
        <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Nevidljivi overlay koji zatvara meni na klik van njega */}
            <div className="fixed inset-0 z-[90]" onClick={() => setIsOpen(false)}></div>
            
            {/* Padajuća lista (Sada savršeno preklapa sve ispod) */}
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] bg-[#0a0a0a] border border-zinc-700 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[100] max-h-64 overflow-y-auto overflow-x-hidden"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#3f3f46 transparent' }}
            >
              <div className="flex flex-col p-1.5">
                {options.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      onChange(lang.code);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${value === lang.code ? 'bg-orange-500/10 text-orange-500' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    {value === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,1)]"></div>}
                    <span className={value === lang.code ? 'ml-0' : 'ml-3'}>{lang.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function V10PdfTranslator() {
  const [file, setFile] = useState(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  
  const [preserveLayout, setPreserveLayout] = useState(true);
  const [preserveImages, setPreserveImages] = useState(true);
  const [preserveVectors, setPreserveVectors] = useState(true);

  const [isTranslating, setIsTranslating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setIsCompleted(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setIsCompleted(false);
    }
  };

  const startTranslation = async () => {
    if (!file) return;
    setIsTranslating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) { clearInterval(interval); return 95; }
        return prev + 1.2;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => { setIsTranslating(false); setIsCompleted(true); }, 1000);
    }, 12000);
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-8 relative flex flex-col items-center justify-start font-sans bg-[#050505] text-zinc-300 overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto z-10 relative">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-12 border-b border-white/5 pb-8 relative z-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <Crown size={14} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em]">V10 Enterprise PDF Engine</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4 uppercase">
            Massive Document <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Neural Translation</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-2xl leading-relaxed uppercase tracking-widest font-bold">
            Designed for corporate systems, publishers, and engineers. Our engine translates up to 1000 pages simultaneously without disrupting original DTP layouts, technical vectors, or graphics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: CONFIGURATION */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            
            {/* Language Settings - Z-INDEX HIERARHIJA DODATA OVDE (z-30) */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-7 shadow-2xl relative z-30">
              <h3 className="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <ArrowRight size={16} className="text-orange-500"/> Language Configuration
              </h3>
              
              <div className="flex flex-col gap-6">
                <div className="relative z-[60]">
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Source Language</label>
                  <V10Dropdown 
                    value={sourceLang} 
                    onChange={setSourceLang} 
                    options={LANGUAGES} 
                    disabled={isTranslating} 
                  />
                </div>

                <div className="relative z-[50]">
                  <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Target Language</label>
                  <V10Dropdown 
                    value={targetLang} 
                    onChange={setTargetLang} 
                    options={LANGUAGES.filter(l => l.code !== 'auto')} 
                    disabled={isTranslating} 
                  />
                </div>
              </div>
            </div>

            {/* Document Architecture - (z-20) da bi padajući meni išao PREKO ove sekcije */}
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 rounded-2xl p-7 shadow-2xl relative z-20">
              <h3 className="text-white text-xs font-black uppercase tracking-widest mb-4">Document Architecture</h3>
              <p className="text-[11px] text-zinc-500 mb-6 leading-relaxed font-medium">
                V10 semantic chunking isolates text from graphical assets, ensuring flawless output formats even for highly technical literature.
              </p>

              <div className="space-y-4">
                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-300 ${preserveLayout ? 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-black/50 border-zinc-700 group-hover:border-zinc-500'}`} onClick={() => !isTranslating && setPreserveLayout(!preserveLayout)}>
                    {preserveLayout && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wider">
                    <Layers size={14} className="text-zinc-500" /> Preserve DTP Layout
                  </span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-300 ${preserveImages ? 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-black/50 border-zinc-700 group-hover:border-zinc-500'}`} onClick={() => !isTranslating && setPreserveImages(!preserveImages)}>
                    {preserveImages && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wider">
                    <ImageIcon size={14} className="text-zinc-500" /> Retain Images & Covers
                  </span>
                </label>

                <label className="flex items-center gap-4 cursor-pointer group">
                  <div className={`w-5 h-5 flex items-center justify-center rounded-md border transition-all duration-300 ${preserveVectors ? 'bg-orange-500 border-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-black/50 border-zinc-700 group-hover:border-zinc-500'}`} onClick={() => !isTranslating && setPreserveVectors(!preserveVectors)}>
                    {preserveVectors && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors flex items-center gap-2 uppercase tracking-wider">
                    <LayoutGrid size={14} className="text-zinc-500" /> Protect CAD / Vectors
                  </span>
                </label>
              </div>
            </div>

            {/* Security Notice - Najniži z-index na panelu (z-10) */}
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/30 backdrop-blur-md relative z-10">
              <Lock size={20} className="text-emerald-500 flex-shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <div>
                <p className="text-xs text-emerald-400 font-black uppercase tracking-widest mb-1.5">End-to-End Encryption</p>
                <p className="text-[10px] text-zinc-500 font-medium leading-relaxed uppercase tracking-wider">
                  Files are routed through a secure SSL tunnel. Upon completion, the entire document is instantly wiped from V10 servers without backups.
                </p>
              </div>
            </div>

          </motion.div>

          {/* RIGHT SIDE: UPLOAD & PROCESSING */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-7 h-full min-h-[550px] relative z-20"
          >
            <AnimatePresence mode="wait">
              
              {/* STAGE 1: UPLOAD */}
              {!file && (
                <motion.div 
                  key="upload" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className={`w-full h-full min-h-[550px] border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group p-10 text-center relative overflow-hidden ${isDragging ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/[0.01] hover:border-orange-500/50 hover:bg-white/[0.03]'}`}
                >
                  <div className="w-20 h-20 rounded-full bg-black/50 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-all duration-500 shadow-xl">
                    <UploadCloud size={32} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <h3 className="text-white text-lg font-black uppercase tracking-widest mb-3">Drag & Drop PDF Here</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Maximum Supported Length: 1000 Pages</p>
                  
                  <div className="px-8 py-3.5 bg-white text-black text-xs font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Browse Local Files
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                </motion.div>
              )}

              {/* STAGE 2: READY FOR PROCESSING */}
              {file && !isTranslating && !isCompleted && (
                <motion.div 
                  key="ready" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full h-full min-h-[550px] border border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center p-10 text-center relative shadow-2xl"
                >
                  <button onClick={() => setFile(null)} className="absolute top-8 right-8 text-zinc-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer z-50">
                    Cancel Session
                  </button>
                  
                  <FileText size={64} className="text-orange-500 mb-8 drop-shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
                  <h3 className="text-white text-xl font-black tracking-wider break-all max-w-[80%] mb-3">{file.name}</h3>
                  <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 flex items-center gap-2">
                    <ShieldCheck size={14} /> Document loaded & verified
                  </p>
                  
                  <div className="w-full max-w-sm flex flex-col gap-6">
                    <div className="flex justify-between items-end pb-4 border-b border-white/5">
                      <div className="flex flex-col text-left">
                        <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Processing Fee</span>
                        <span className="text-zinc-400 text-xs font-bold">Enterprise API Protocol</span>
                      </div>
                      <span className="text-white font-black text-2xl drop-shadow-md">$399.00</span>
                    </div>
                    
                    <button 
                      onClick={startTranslation}
                      className="w-full py-5 rounded-xl font-black text-xs text-white uppercase tracking-[0.2em] bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 transition-all cursor-pointer shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_10px_40px_rgba(249,115,22,0.5)] hover:-translate-y-1 flex items-center justify-center gap-3 z-50"
                    >
                      <Zap size={16} /> Initialize Translation
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STAGE 3: PROCESSING / SCANNER EFFECT */}
              {file && isTranslating && (
                <motion.div 
                  key="translating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="w-full h-full min-h-[550px] border border-cyan-500/20 bg-cyan-950/10 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden"
                >
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] z-0"
                  />
                  
                  <Loader2 size={56} className="text-cyan-400 animate-spin mb-8 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] relative z-10" />
                  
                  <h3 className="text-white text-xl font-black uppercase tracking-[0.1em] mb-3 relative z-10">Neural Processing</h3>
                  <p className="text-cyan-500/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-12 relative z-10">
                    Executing Contextual Analysis & Chunking
                  </p>
                  
                  <div className="w-full max-w-md relative z-10">
                    <div className="flex justify-between text-[10px] text-zinc-400 mb-3 font-black uppercase tracking-widest">
                      <span>{progress < 30 ? 'EXTRACTING METADATA...' : progress < 70 ? 'TRANSLATING VECTORS...' : 'RECONSTRUCTING DOCUMENT...'}</span>
                      <span className="text-cyan-400">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-black/50 border border-white/5 rounded-full h-2 overflow-hidden shadow-inner">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 h-full rounded-full" 
                        style={{ width: `${progress}%` }}
                        layout
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STAGE 4: COMPLETED */}
              {file && isCompleted && (
                <motion.div 
                  key="completed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full min-h-[550px] border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-xl rounded-[2rem] flex flex-col items-center justify-center p-10 text-center shadow-[0_0_50px_rgba(16,185,129,0.1)]"
                >
                  <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ping opacity-20"></div>
                    <ShieldCheck size={48} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                  </div>
                  
                  <h3 className="text-white text-2xl font-black uppercase tracking-[0.1em] mb-3">Translation Successful</h3>
                  <p className="text-emerald-400/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-12">
                    Document structure preserved. File ready for output.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-5 w-full max-w-md">
                    <motion.button 
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest bg-emerald-500 text-black shadow-[0_10px_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer z-50"
                    >
                      Download PDF
                    </motion.button>
                    
                    <motion.button 
                      onClick={() => { setFile(null); setIsCompleted(false); }}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className="flex-1 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest border border-white/10 text-zinc-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer z-50"
                    >
                      New Translation
                    </motion.button>
                  </div>
                </motion.div>
              )}
              
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
// ============================================================================
// KRAJ FAJLA: src/pdf/V10PdfTranslator.jsx
// ============================================================================