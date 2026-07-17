// POČETAK FAJLA: V8Decks.jsx
// Ne zaboravi React source code link u glavnom repozitorijumu!

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
// 🔥 DODATA ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

// 🔥 KONAČNO PRAVA IMENA U SLOVO (Vraćen onaj razmak u Hardware fajlu!) 🔥
const pdfDocuments = [
  { path: "/V10_Commercial_Production_Protocol.pdf", title: "Commercial Production Protocol" }, // <-- HERO DOKUMENT
  { path: "/V10_150MP_ BLUEPRINTS_THE_HARDWARE_LAUNCH_ENGINE.pdf", title: "Hardware Launch Engine" }, // <-- TU JE BIO PROBLEM (Razmak posle 150MP_)
  { path: "/V10_150MP_BLUEPRINTS_THE_DTC_VISUAL_ENGINE.pdf", title: "DTC Visual Engine" }, 
  { path: "/V10_150MP_BLUEPRINTS_THE_LIQUID_DYNAMICS_PROTOCOL.pdf", title: "Liquid Dynamics Protocol" }, 
  { path: "/10_Cinematic_Motion_Dynamics.pdf", title: "Cinematic Motion" },
  { path: "/V10_Infinite_Configurator_Enterprise.pdf", title: "Infinite Configurator" },
  { path: "/V10 Master Engine - Fine Jewelry.pdf", title: "Fine Jewelry Visuals" },
  { path: "/V10_Master_Engine_Gastronomy_Pitch_Deck.pdf", title: "Gastronomy Pitch Deck" },
  { path: "/V10_Zero-Day.pdf", title: "The Zero-Day Protocol" },
  { path: "/V10 MASTER ENGINE Micro-Texture Plating System.pdf", title: "Micro-Texture Plating" },
  { path: "/V10 Global Consistency Matrix.pdf", title: "Global Consistency Matrix" },
  { path: "/V10 MASTER ENGINE THE ARSENAL.pdf", title: "V10 Arsenal" },
  { path: "/V10_ZeroStage_IP_Safe_Protocol.pdf", title: "Zero-Stage IP Protocol" }
];

// -------------------------------------------------------------
// 1. KOMPONENTA ZA MALE KARTICE (NA GRIDU)
// -------------------------------------------------------------
const V8PdfViewerCard = ({ doc, onOpenFullScreen, isHero }) => {
  const [zoom, setZoom] = useState(1); 
  // encodeURI osigurava da brauzer pravilno pročita onaj prazan razmak (%20)
  const safePath = encodeURI(doc.path);

  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.25, 0.5));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: doc.title, zoom_action: 'out', view_mode: 'card' });
  };

  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.25, 3));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: doc.title, zoom_action: 'in', view_mode: 'card' });
  };

  const handleDirectLinkClick = () => {
    trackV8Action('deck_direct_link_clicked', { event_category: 'Engagement', deck_title: doc.title });
  };

  return (
    <div className={`bg-[#0a0a0a] p-4 md:p-5 rounded-[2rem] border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.15)] flex flex-col w-full hover:border-orange-500/60 transition-all duration-500 group ${isHero ? 'lg:col-span-2' : ''}`}>
      
      {/* HEADER KARTICE */}
      <div className="flex justify-between items-center border-b border-orange-500/30 pb-3 md:pb-4 mb-4 gap-3 flex-wrap shrink-0">
        <h3 className="text-white m-0 font-black uppercase tracking-widest text-[12px] md:text-[15px] group-hover:text-orange-400 transition-colors flex-1 min-w-[120px]">
          {doc.title}
        </h3>
        
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="flex items-center bg-black/50 border border-blue-500/30 rounded-lg p-0.5 shadow-inner">
            <button onClick={handleZoomOut} className="p-1.5 md:p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all cursor-pointer">
              <ZoomOut size={16} strokeWidth={2.5} />
            </button>
            <span className="text-[9px] md:text-[11px] font-black text-white w-9 md:w-11 text-center tracking-widest select-none">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={handleZoomIn} className="p-1.5 md:p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-all cursor-pointer">
              <ZoomIn size={16} strokeWidth={2.5} />
            </button>
          </div>

          <span className="hidden sm:block bg-orange-500 text-black px-2 md:px-3 py-1.5 md:py-2 font-black rounded-lg text-[8px] md:text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(234,88,12,0.4)] whitespace-nowrap">
            V10 MASTER
          </span>

          <div className="flex items-center gap-1.5">
            <a 
              href={safePath}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleDirectLinkClick}
              className="flex items-center justify-center p-2 md:p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] cursor-pointer"
              title="Otvori direktno u novom tabu"
            >
              <ExternalLink size={18} strokeWidth={3} />
            </a>
            <button 
              onClick={() => onOpenFullScreen(doc.title)}
              className="flex items-center justify-center p-2 md:p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
              title="Otvori u punom ekranu"
            >
              <Maximize size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* PLAVI PULSIRAJUĆI BANER */}
      <motion.div 
        animate={{ boxShadow: ["0px 0px 10px rgba(59,130,246,0.1)", "0px 0px 25px rgba(59,130,246,0.5)", "0px 0px 10px rgba(59,130,246,0.1)"], borderColor: ["rgba(59,130,246,0.2)", "rgba(59,130,246,0.6)", "rgba(59,130,246,0.2)"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center justify-center gap-3 bg-blue-500/10 px-4 py-3 rounded-xl mb-5 w-full border"
      >
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500 shrink-0" />
        <p className="text-[9px] md:text-[11px] text-blue-400 font-black uppercase tracking-widest m-0 leading-tight text-center">
          PRO TIP: PAGE 3 CONTAINS A DIRECT LINK TO A RAW 150MP SAMPLE
        </p>
        <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-500 shrink-0 hidden md:block" />
      </motion.div>

      {/* IFRAME KONTEJNER */}
      <div className={`w-full ${isHero ? 'h-[70vh] min-h-[500px] md:min-h-[600px]' : 'h-[60vh] min-h-[400px] md:min-h-[500px]'} rounded-xl overflow-auto bg-[#0a0a0a] relative border border-white/5 shadow-inner flex flex-col transition-all duration-300`}>
        <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%`, transition: 'width 0.3s ease, height 0.3s ease' }} className="min-w-full min-h-full relative flex items-center justify-center">
          <iframe 
            src={`${safePath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
            title={doc.title}
            className="w-full h-full border-none block absolute inset-0 z-10 bg-white shadow-2xl"
          />
          <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center px-4 z-0 absolute pointer-events-none">
            Učitavanje...<br/><br/>
            Ako ne vidite dokument, proverite da li je fajl u public folderu
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. GLAVNA KOMPONENTA
// -------------------------------------------------------------
const V8Decks = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [fsZoom, setFsZoom] = useState(1);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    trackV8Action('page_view', { event_category: 'Navigation', page_name: 'V8_Decks_Architecture' });
  }, []);

  useEffect(() => {
    if (activeIndex !== null) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  useEffect(() => { setFsZoom(1); }, [activeIndex]);

  const handleOpenFullScreen = (index, title) => {
    setActiveIndex(index);
    trackV8Action('deck_fullscreen_opened', { event_category: 'Engagement', deck_title: title });
  };

  const handleCloseFullScreen = () => {
    trackV8Action('deck_fullscreen_closed', { event_category: 'Engagement', deck_title: pdfDocuments[activeIndex].title });
    setActiveIndex(null);
  };

  const handlePrev = () => {
    setActiveIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : pdfDocuments.length - 1;
      trackV8Action('deck_fullscreen_nav', { event_category: 'Engagement', direction: 'prev', deck_title: pdfDocuments[newIndex].title });
      return newIndex;
    });
  };
  
  const handleNext = () => {
    setActiveIndex(prev => {
      const newIndex = prev < pdfDocuments.length - 1 ? prev + 1 : 0;
      trackV8Action('deck_fullscreen_nav', { event_category: 'Engagement', direction: 'next', deck_title: pdfDocuments[newIndex].title });
      return newIndex;
    });
  };

  const handleFsZoomOut = () => {
    setFsZoom(z => Math.max(z - 0.25, 0.5));
  };

  const handleFsZoomIn = () => {
    setFsZoom(z => Math.min(z + 0.25, 4));
  };

  const handleToggleView = () => {
    if (visibleCount < pdfDocuments.length) setVisibleCount(prev => Math.min(prev + 2, pdfDocuments.length));
    else {
      setVisibleCount(3);
      document.getElementById('v8-decks-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="v8-decks-section" className="w-full py-12 md:py-16 relative z-10">
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.2em] text-white">
          Commercial <span className="text-orange-500 block md:inline mt-2 md:mt-0">Architecture</span>
        </h2>
        <p className="text-[10px] md:text-[12px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-3">
          V10 Master Engine Documentation
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-full">
        {pdfDocuments.slice(0, visibleCount).map((doc, index) => (
          <V8PdfViewerCard 
            key={index}
            doc={doc} 
            isHero={index === 0} 
            onOpenFullScreen={(title) => handleOpenFullScreen(index, title)} 
          />
        ))}
      </div>

      <div className="flex justify-center mt-12 w-full">
        <button 
          onClick={handleToggleView}
          className="group relative flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-black uppercase tracking-[0.2em] text-[12px] md:text-[14px] transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:shadow-[0_0_50px_rgba(234,88,12,0.6)] cursor-pointer"
        >
          {visibleCount < pdfDocuments.length ? (
            <><span>SEE MORE</span><ChevronDown size={20} strokeWidth={3} className="group-hover:translate-y-1 transition-transform" /></>
          ) : (
            <><span>CLOSE</span><ChevronUp size={20} strokeWidth={3} className="group-hover:-translate-y-1 transition-transform" /></>
          )}
        </button>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[999999] bg-[#050505] p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col w-full h-[100dvh]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 md:p-4 mb-4 gap-4 shadow-2xl shrink-0 lg:mt-2">
              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto overflow-hidden">
                <button onClick={handlePrev} className="p-2.5 md:p-3 bg-zinc-800 hover:bg-orange-500 text-white rounded-xl transition-all shrink-0 cursor-pointer">
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[8px] md:text-[10px] text-orange-500 font-black uppercase tracking-widest block mb-1">DOKUMENT {activeIndex + 1} OD {pdfDocuments.length}</span>
                  <h3 className="text-white m-0 font-black uppercase tracking-widest text-[11px] md:text-[14px] lg:text-[16px] truncate">{pdfDocuments[activeIndex].title}</h3>
                </div>
                <button onClick={handleNext} className="p-2.5 md:p-3 bg-zinc-800 hover:bg-orange-500 text-white rounded-xl transition-all shrink-0 cursor-pointer">
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                <div className="flex items-center bg-black border border-blue-500/30 rounded-xl p-1 shadow-inner shrink-0">
                  <button onClick={handleFsZoomOut} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"><ZoomOut size={18} strokeWidth={2.5} /></button>
                  <span className="text-[10px] md:text-[12px] font-black text-white w-10 md:w-12 text-center tracking-widest select-none">{Math.round(fsZoom * 100)}%</span>
                  <button onClick={handleFsZoomIn} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer"><ZoomIn size={18} strokeWidth={2.5} /></button>
                </div>
                <button 
                  onClick={handleCloseFullScreen}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] md:text-[13px] transition-all shadow-[0_0_30px_rgba(220,38,38,0.8)] border-2 border-red-500 shrink-0 cursor-pointer lg:translate-y-1.5"
                >
                  <X size={22} strokeWidth={4} />
                  <span>ZATVORI</span>
                </button>
              </div>
            </div>

            <div className="flex-1 w-full rounded-2xl overflow-auto bg-[#0a0a0a] relative border border-white/5 shadow-inner flex flex-col items-center justify-center">
              <div style={{ width: `${fsZoom * 100}%`, height: `${fsZoom * 100}%`, transition: 'width 0.3s ease, height 0.3s ease' }} className="min-w-full min-h-full relative flex items-center justify-center">
                <iframe 
                  key={activeIndex}
                  src={`${encodeURI(pdfDocuments[activeIndex].path)}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
                  title={pdfDocuments[activeIndex].title}
                  className="w-full h-full border-none block absolute inset-0 z-10 bg-white shadow-2xl"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default V8Decks;
// KRAJ FAJLA: V8Decks.jsx