// FAJL: src/ux/V10Story.jsx
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, Layers, FileImage, Box, Image as ImageIcon, Trash2, X, Maximize2 } from 'lucide-react';

// POČETAK FUNKCIJE: V10Story
const V10Story = ({ projectData, handleAddToCartClick, isAlreadySelected, isAdmin, handleDeletePhase }) => {
  const allPhases = projectData.phases || [];
  
  // State za Full Screen prikaz slike
  const [fullscreenImage, setFullscreenImage] = useState(null);

  // Ref za vodoravni scroll kontejner
  const galleryScrollRef = useRef(null);

  // Određivanje glavne Storytelling trake (slika s videa)
  const masterComposition = projectData.masterImage || projectData.storytellingImage || projectData.img || projectData.cover || allPhases[0]?.imageUrl;

  // Izdvajanje pojedinačnih scena za red ispod:
  // Ako je prva slika u fazama bila upravo cijeli vertikalni strip, u redu ispod prikazujemo ostale pojedinačne scene
  const sceneItems = (allPhases.length > 1 && allPhases[0]?.imageUrl === masterComposition && !projectData.img)
    ? allPhases.slice(1)
    : allPhases;

  // POČETAK FUNKCIJE: handleWheelScroll
  // Omogućuje prirodno vodoravno pomicanje kotačićem miša
  const handleWheelScroll = (e) => {
    if (galleryScrollRef.current) {
      if (e.deltaY !== 0) {
        galleryScrollRef.current.scrollLeft += e.deltaY;
      }
    }
  };
  // KRAJ FUNKCIJE: handleWheelScroll

  return (
    <div className="relative w-full h-[100dvh] bg-black overflow-hidden flex flex-col justify-end font-sans">
      
      {/* 🔥 BESKONAČNA FILMSKA TRAKA (LOOP) U POZADINI 🔥 */}
      {/* Stavljeno na opacity-100 za maksimalnu svetlinu */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-100">
        {masterComposition && (
          <motion.div
            className="flex flex-col w-full"
            animate={{ y: ["0%", "-50%"] }} 
            transition={{ 
              duration: 420, // 7 MINUTA - 420 sekundi za jedan krug
              ease: "linear", 
              repeat: Infinity 
            }}
          >
            <img src={masterComposition} alt="Master Composition 1" className="w-full h-auto block" />
            <img src={masterComposition} alt="Master Composition 2" className="w-full h-auto block" />
          </motion.div>
        )}
      </div>

      {/* V8 UI_Base_Gradient - Smanjeno zatamnjenje da bi slika bila svetlija */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020202] via-[#020202]/60 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020202]/50 to-transparent pointer-events-none" />

      {/* SADRŽAJ PRIČE I INFORMACIJE O PAKETU */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 md:px-8 pb-12 md:pb-16 flex flex-col lg:flex-row items-end justify-between gap-8">
        
        {/* LIJEVA STRANA - Tekst priče, Izdvojeni Master Strip i Male Slike u redu ispod */}
        <div className="w-full xl:w-2/3 flex flex-col justify-end overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full mb-3 pointer-events-auto">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">Cinematic Storytelling</span>
            </div>
            
            {/* GLAVNI NASLOV - ELEGANTAN SERIF FONT SMANJENE VELIČINE */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white uppercase tracking-[0.14em] mb-2 leading-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] pointer-events-auto">
              {projectData.title}
            </h1>
            
            {/* OPIS PROJEKTA */}
            <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-xl font-medium drop-shadow-md pointer-events-auto mb-4">
              {projectData.description}
            </p>

            {/* 🔥 IZDVOJENA SLIKA S VIDEA (MASTER VERTIKALNI STORYTELLING STRIP) 🔥 */}
            {masterComposition && (
              <div className="mb-4 pointer-events-auto bg-black/60 backdrop-blur-xl border border-orange-500/30 hover:border-orange-500/70 p-3 md:p-3.5 rounded-2xl flex items-center justify-between gap-4 max-w-2xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Minijaturni vertikalni thumbnail master stripa */}
                  <button 
                    type="button"
                    onClick={() => setFullscreenImage(masterComposition)}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border border-orange-500/40 hover:border-orange-500 shrink-0 cursor-zoom-in bg-zinc-950 group shadow-md"
                    title="Klikni za pregled cijelog Master Storytelling stripa (150MP)"
                  >
                    <img 
                      src={masterComposition} 
                      alt="Master Storytelling Strip" 
                      className="w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform duration-500" 
                      draggable="false"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                      <span className="text-[8px] font-black text-white bg-black/80 px-1 py-0.5 rounded uppercase tracking-wider border border-white/20">
                        150MP
                      </span>
                    </div>
                  </button>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                      <span className="text-[9px] font-black uppercase tracking-widest text-orange-400">
                        Master Storytelling Strip
                      </span>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white uppercase tracking-wider truncate">
                      {projectData.masterStripTitle || 'Full Vertical Joined Composition'}
                    </h4>
                    <p className="text-[10px] text-zinc-400 truncate">
                      Cjelokupna vizualna sekvenca u ultra visokoj rezoluciji
                    </p>
                  </div>
                </div>

                {/* Dugme za otvaranje Fullscreen stripa */}
                <button
                  type="button"
                  onClick={() => setFullscreenImage(masterComposition)}
                  className="shrink-0 px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-black border border-orange-500/40 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg flex items-center gap-1.5"
                >
                  <Maximize2 className="w-3 h-3" /> Expand Strip
                </button>
              </div>
            )}

            {/* 🔥 MALE SLIKE U REDU ISPOD SA TANKIM NARANČASTIM SCROLLBAROM 🔥 */}
            {sceneItems.length > 0 && (
              <div className="pointer-events-auto bg-black/40 backdrop-blur-md border border-white/10 p-4 md:p-5 rounded-[2rem] w-full overflow-hidden">
                <div className="flex items-center justify-between mb-3 px-2">
                  <h4 className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" /> Individual Scene Assets ({sceneItems.length})
                  </h4>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-orange-400/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
                    Scroll for all scenes &rarr;
                  </span>
                </div>
                
                {/* Horizontalni kontejner s tankim narančastim klizačem */}
                <div 
                  ref={galleryScrollRef}
                  onWheel={handleWheelScroll}
                  style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#f97316 rgba(255, 255, 255, 0.08)'
                  }}
                  className="w-full overflow-x-auto pb-4 scroll-smooth
                    [&::-webkit-scrollbar]:h-1.5
                    [&::-webkit-scrollbar-track]:bg-white/5
                    [&::-webkit-scrollbar-track]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-orange-500
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-orange-400
                    active:[&::-webkit-scrollbar-thumb]:bg-orange-300"
                >
                  <div className="flex flex-nowrap gap-4 md:gap-6 pr-8 min-w-max">
                    {sceneItems.map((scene, idx) => {
                      const ratioClass = scene.ratio && scene.ratio !== 'aspect-auto' ? scene.ratio : 'aspect-video';
                      
                      return (
                        <div key={idx} className="relative group shrink-0 flex-none flex flex-col w-[260px] md:w-[320px]">
                          <button 
                            onClick={() => setFullscreenImage(scene.imageUrl)}
                            className={`relative w-full ${ratioClass} rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 hover:scale-[1.02] transition-all cursor-zoom-in shadow-lg block`}
                            title="Prikaži preko cijelog ekrana"
                          >
                            <img 
                              src={scene.imageUrl} 
                              alt={scene.title || `Asset ${idx + 1}`} 
                              className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110" 
                              draggable="false" 
                            />
                            
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-4 pointer-events-none">
                               <div className="flex flex-col w-full">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 truncate drop-shadow-md mb-1 text-left">
                                   {scene.subtitle || 'V10 ASSET'}
                                 </span>
                                 <span className="text-sm font-black uppercase tracking-wider text-white truncate drop-shadow-md leading-tight text-left">
                                   {scene.title || `Asset ${idx + 1}`}
                                 </span>
                               </div>
                            </div>
                          </button>

                          {/* CRVENA KANTICA SAMO ZA ADMINA */}
                          {isAdmin && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeletePhase(idx); }}
                              className="absolute -top-3 -right-3 bg-red-600 border border-red-400 text-white rounded-full p-2 shadow-[0_0_15px_rgba(220,38,38,0.8)] opacity-0 group-hover:opacity-100 transition-all z-50 hover:scale-110 cursor-pointer pointer-events-auto"
                              title="Obriši sliku"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* DESNA STRANA - Deliverables Kartica i Dugme */}
        <div className="w-full xl:w-[420px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl shrink-0 pointer-events-auto">
          <h3 className="text-white text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
            <Box className="w-5 h-5 text-orange-500" /> Package Deliverables
          </h3>
          
          <ul className="space-y-4 mb-8">
            <li className="flex items-start gap-3 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <FileImage className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{sceneItems.length > 0 ? `${sceneItems.length} separate 4K scene images.` : 'Multi-scene 4K storytelling images.'}</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Individual Master .PSD files for every single scene.</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <Layers className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Massive vertically joined storytelling master composition.</span>
            </li>
            <li className="flex items-start gap-3 text-zinc-300 text-xs font-bold uppercase tracking-widest">
              <ImageIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Storytelling image in 4K and 150MP.</span>
            </li>
          </ul>

          <button 
            onClick={handleAddToCartClick}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
              isAlreadySelected 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                : 'bg-orange-500 text-black hover:bg-orange-400'
            }`}
          >
            {isAlreadySelected ? (
              <><CheckCircle2 className="w-4 h-4" /> SECURED (IN VAULT)</>
            ) : (
              <><Lock className="w-4 h-4" /> SELECT STORYTELLING BUNDLE</>
            )}
          </button>
        </div>
      </div>

      {/* 🔥 FULL SCREEN MODAL PORTALIRAN NA BODY KAKO BI PREKRIO NAVBAR 🔥 */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100000000] flex items-center justify-center bg-black/98 backdrop-blur-2xl p-4 md:p-8 cursor-zoom-out pointer-events-auto"
              onClick={() => setFullscreenImage(null)}
            >
              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-orange-500 text-white hover:text-black rounded-full transition-all border border-white/20 hover:border-orange-500 cursor-pointer shadow-2xl z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }} 
                src={fullscreenImage} 
                alt="Fullscreen Preview" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)]" 
                draggable="false" 
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};
// KRAJ FUNKCIJE: V10Story

export default V10Story;