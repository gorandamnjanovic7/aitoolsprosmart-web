// POČETAK FAJLA: V8Decks.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
// 🔥 DODATA ANALITIKA 🔥
import { trackV8Action } from '../utils/analytics';

// TAČAN SPISAK TVOJIH PDF DOKUMENATA
const pdfDocuments = [
  { path: "/V10_Master_Engine_Pitch_Deck.pdf", title: "V10 Master Engine Overview" },
  { path: "/V10_Master_Engine_Architecture_Pitch_Deck.pdf", title: "Architecture Pitch Deck" },
  { path: "/10_Cinematic_Motion_Dynamics.pdf", title: "Cinematic Motion Dynamics" },
  { path: "/V10_Infinite_Configurator_Enterprise.pdf", title: "Infinite Configurator Enterprise" },
  { path: "/V10 Master Engine - Fine Jewelry.pdf", title: "Fine Jewelry Visuals" },
  { path: "/V10_Master_Engine_Gastronomy_Pitch_Deck.pdf.pdf", title: "Gastronomy Pitch Deck" },
  { path: "/V10_ZeroStage_IP_Safe_Protocol.pdf", title: "Zero-Stage IP Protocol" }
];

// -------------------------------------------------------------
// 1. KOMPONENTA ZA MALE KARTICE (NA GRIDU)
// -------------------------------------------------------------
// POČETAK FUNKCIJE: V8PdfViewerCard
const V8PdfViewerCard = ({ doc, onOpenFullScreen }) => {
  const [zoom, setZoom] = useState(1); 
  const safePath = encodeURI(doc.path);

  // POČETAK FUNKCIJE: handleZoomOut
  const handleZoomOut = () => {
    setZoom(z => Math.max(z - 0.25, 0.5));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: doc.title, zoom_action: 'out', view_mode: 'card' });
  };
  // KRAJ FUNKCIJE: handleZoomOut

  // POČETAK FUNKCIJE: handleZoomIn
  const handleZoomIn = () => {
    setZoom(z => Math.min(z + 0.25, 3));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: doc.title, zoom_action: 'in', view_mode: 'card' });
  };
  // KRAJ FUNKCIJE: handleZoomIn

  // POČETAK FUNKCIJE: handleDirectLinkClick
  const handleDirectLinkClick = () => {
    trackV8Action('deck_direct_link_clicked', { event_category: 'Engagement', deck_title: doc.title });
  };
  // KRAJ FUNKCIJE: handleDirectLinkClick

  return (
    <div className="bg-[#0a0a0a] p-4 md:p-5 rounded-[2rem] border border-orange-500/30 shadow-[0_0_30px_rgba(234,88,12,0.15)] flex flex-col w-full hover:border-orange-500/60 transition-all duration-500 group">
      
      {/* HEADER KARTICE */}
      <div className="flex justify-between items-center border-b border-orange-500/30 pb-3 md:pb-4 mb-4 gap-3 flex-wrap shrink-0">
        <h3 className="text-white m-0 font-black uppercase tracking-widest text-[12px] md:text-[15px] group-hover:text-orange-400 transition-colors flex-1 min-w-[120px]">
          {doc.title}
        </h3>
        
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          {/* LUPA (ZOOM) ZA KARTICU */}
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

          {/* DUGME ZA OTVARANJE U FULL SCREEN-U */}
          <button 
            onClick={() => onOpenFullScreen(doc.title)}
            className="flex items-center justify-center p-2 md:p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)] cursor-pointer"
            title="Otvori u punom ekranu"
          >
            <Maximize size={18} strokeWidth={3} />
          </button>
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

      {/* IFRAME KONTEJNER ZA KARTICU */}
      <div className="w-full h-[60vh] min-h-[400px] md:min-h-[500px] rounded-xl overflow-auto bg-[#0a0a0a] relative border border-white/5 shadow-inner flex flex-col">
        <div style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%`, transition: 'width 0.3s ease, height 0.3s ease' }} className="min-w-full min-h-full relative flex items-center justify-center">
          <iframe 
            src={`${safePath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} 
            title={doc.title}
            className="w-full h-full border-none block absolute inset-0 z-10 bg-white shadow-2xl"
          />
          <div className="text-zinc-600 text-xs font-black uppercase tracking-widest text-center px-4 z-0 absolute">
            Učitavanje...<br/><br/>
            <a href={safePath} onClick={handleDirectLinkClick} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">Kliknite ovde za direktan link</a>
          </div>
        </div>
      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: V8PdfViewerCard


// -------------------------------------------------------------
// 2. GLAVNA KOMPONENTA SA GLOBALNIM FULL-SCREEN SISTEMOM
// -------------------------------------------------------------
// POČETAK FUNKCIJE: V8Decks
const V8Decks = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [fsZoom, setFsZoom] = useState(1);

  // Beleženje posete stranici
  useEffect(() => {
    trackV8Action('page_view', { event_category: 'Navigation', page_name: 'V8_Decks_Architecture' });
  }, []);

  // ZAKLJUČAVANJE SKROLA NA CELOM SAJTU KADA JE OTVOREN FULL SCREEN
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [activeIndex]);

  // RESETOVANJE ZOOMA KAD SE PREĐE NA SLEDEĆI PDF
  useEffect(() => {
    setFsZoom(1);
  }, [activeIndex]);

  // POČETAK FUNKCIJE: handleOpenFullScreen
  const handleOpenFullScreen = (index, title) => {
    setActiveIndex(index);
    trackV8Action('deck_fullscreen_opened', { event_category: 'Engagement', deck_title: title });
  };
  // KRAJ FUNKCIJE: handleOpenFullScreen

  // POČETAK FUNKCIJE: handleCloseFullScreen
  const handleCloseFullScreen = () => {
    trackV8Action('deck_fullscreen_closed', { event_category: 'Engagement', deck_title: pdfDocuments[activeIndex].title });
    setActiveIndex(null);
  };
  // KRAJ FUNKCIJE: handleCloseFullScreen

  // POČETAK FUNKCIJE: handlePrev
  const handlePrev = () => {
    setActiveIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : pdfDocuments.length - 1;
      trackV8Action('deck_fullscreen_nav', { event_category: 'Engagement', direction: 'prev', deck_title: pdfDocuments[newIndex].title });
      return newIndex;
    });
  };
  // KRAJ FUNKCIJE: handlePrev
  
  // POČETAK FUNKCIJE: handleNext
  const handleNext = () => {
    setActiveIndex(prev => {
      const newIndex = prev < pdfDocuments.length - 1 ? prev + 1 : 0;
      trackV8Action('deck_fullscreen_nav', { event_category: 'Engagement', direction: 'next', deck_title: pdfDocuments[newIndex].title });
      return newIndex;
    });
  };
  // KRAJ FUNKCIJE: handleNext

  // POČETAK FUNKCIJE: handleFsZoomOut
  const handleFsZoomOut = () => {
    setFsZoom(z => Math.max(z - 0.25, 0.5));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: pdfDocuments[activeIndex].title, zoom_action: 'out', view_mode: 'fullscreen' });
  };
  // KRAJ FUNKCIJE: handleFsZoomOut

  // POČETAK FUNKCIJE: handleFsZoomIn
  const handleFsZoomIn = () => {
    setFsZoom(z => Math.min(z + 0.25, 4));
    trackV8Action('deck_zoom', { event_category: 'Engagement', deck_title: pdfDocuments[activeIndex].title, zoom_action: 'in', view_mode: 'fullscreen' });
  };
  // KRAJ FUNKCIJE: handleFsZoomIn

  return (
    <section className="w-full py-12 md:py-16 relative z-10">
      
      {/* NASLOV SEKCIJE */}
      <div className="text-center mb-10 md:mb-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.2em] text-white">
          Spatial Engineering <span className="text-orange-500 block md:inline mt-2 md:mt-0">Architecture</span>
        </h2>
        <p className="text-[10px] md:text-[12px] text-zinc-400 font-bold uppercase tracking-[0.3em] mt-3">
          V10 Master Engine Documentation
        </p>
      </div>
      
      {/* MALE KARTICE (GRID) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 w-full max-w-full">
        {pdfDocuments.map((doc, index) => (
          <V8PdfViewerCard 
            key={index}
            doc={doc} 
            onOpenFullScreen={(title) => handleOpenFullScreen(index, title)} 
          />
        ))}
      </div>

      {/* 🔥 GLOBALNI FULL SCREEN MODAL 🔥 */}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[999999] bg-[#050505] p-2 sm:p-4 md:p-6 lg:p-8 flex flex-col w-full h-[100dvh]"
          >
            {/* GORNJA KONTROLNA TRAKA (FULL SCREEN) */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-3 md:p-4 mb-4 gap-4 shadow-2xl shrink-0 lg:mt-2">
              
              {/* Leva Strana: Ime PDF-a i Navigacija */}
              <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto overflow-hidden">
                <button onClick={handlePrev} className="p-2.5 md:p-3 bg-zinc-800 hover:bg-orange-500 text-white rounded-xl transition-all shrink-0 cursor-pointer">
                  <ChevronLeft size={20} strokeWidth={3} />
                </button>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <span className="text-[8px] md:text-[10px] text-orange-500 font-black uppercase tracking-widest block mb-1">DOKUMENT {activeIndex + 1} OD {pdfDocuments.length}</span>
                  <h3 className="text-white m-0 font-black uppercase tracking-widest text-[11px] md:text-[14px] lg:text-[16px] truncate">
                    {pdfDocuments[activeIndex].title}
                  </h3>
                </div>
                <button onClick={handleNext} className="p-2.5 md:p-3 bg-zinc-800 hover:bg-orange-500 text-white rounded-xl transition-all shrink-0 cursor-pointer">
                  <ChevronRight size={20} strokeWidth={3} />
                </button>
              </div>

              {/* Desna Strana: Zoom i VELIKO X (Zatvori) */}
              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                
                {/* LUPA U FULL SCREENU */}
                <div className="flex items-center bg-black border border-blue-500/30 rounded-xl p-1 shadow-inner shrink-0">
                  <button onClick={handleFsZoomOut} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                    <ZoomOut size={18} strokeWidth={2.5} />
                  </button>
                  <span className="text-[10px] md:text-[12px] font-black text-white w-10 md:w-12 text-center tracking-widest select-none">
                    {Math.round(fsZoom * 100)}%
                  </span>
                  <button onClick={handleFsZoomIn} className="p-2 text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all cursor-pointer">
                    <ZoomIn size={18} strokeWidth={2.5} />
                  </button>
                </div>

                {/* 🔥 EKSTREMNO VIDLJIVO CRVENO X DUGME 🔥 */}
                <button 
                  onClick={handleCloseFullScreen}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 md:py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] md:text-[13px] transition-all shadow-[0_0_30px_rgba(220,38,38,0.8)] border-2 border-red-500 shrink-0 cursor-pointer lg:translate-y-1.5"
                  title="Zatvori Full Screen"
                >
                  <X size={22} strokeWidth={4} className="drop-shadow-lg" />
                  <span className="drop-shadow-md">ZATVORI</span>
                </button>

              </div>

            </div>

            {/* IFRAME U FULL SCREENU SA ZUMIRANJEM */}
            <div className="flex-1 w-full rounded-2xl overflow-auto bg-[#0a0a0a] relative border border-white/5 shadow-inner flex flex-col items-center justify-center">
              <div style={{ width: `${fsZoom * 100}%`, height: `${fsZoom * 100}%`, transition: 'width 0.3s ease, height 0.3s ease' }} className="min-w-full min-h-full relative flex items-center justify-center">
                <iframe 
                  key={activeIndex} // Forsira pretraživač da učita novi PDF kad menjaš strelicama
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