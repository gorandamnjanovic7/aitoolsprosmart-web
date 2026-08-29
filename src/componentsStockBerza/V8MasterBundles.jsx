// POČETAK FAJLA: V8MasterBundles.jsx
import React from 'react';
import { Zap, DownloadCloud, Edit, Trash2, ShieldCheck, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const V8MasterBundles = ({ paketi, isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl, kupljeniPaketiIds }) => {
  if (!paketi || paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 text-slate-400 font-black uppercase tracking-widest">
        Awaiting 45MP Bundles. Radar is clear.
      </div>
    );
  }

  return (
    <>
      {paketi.map((paket) => {
        const isOwned = kupljeniPaketiIds?.includes(paket.id) || paket.isFree || parseFloat(paket.cena) === 0;
        
        // Provera da li paket već ima tehnički tekst da ga ne bismo duplirali
        const currentOpis = paket.opisEn || "";
        const hasTechText = currentOpis.toUpperCase().includes("LANCZOS");

        return (
          <div key={paket.id} className="relative w-full lg:w-[calc(50%-1.5rem)] p-[3px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group/wrap transition-all duration-500 hover:shadow-[0_20px_50px_rgba(59,130,246,0.2)] flex flex-col bg-slate-100">
            
            {/* 🔥 TAČNA GEMINI ANIMACIJA IZ VIDEA (Uvek vidljiva 100%) 🔥 */}
            <div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#4285F4_70%,#EA4335_85%,#34A853_100%)] animate-ai-spin z-0 pointer-events-none opacity-100"></div>

            {/* UNUTRAŠNJA STAKLENA KARTICA */}
            <div className="relative z-10 bg-white/90 backdrop-blur-xl rounded-[calc(2rem-3px)] md:rounded-[calc(3rem-3px)] overflow-hidden h-full flex flex-col shadow-inner">
              
              {/* SLIKA I ZNAČKE (BADGES) - Optimizovano za mobilne */}
              <div className="p-3 md:p-5 relative bg-slate-50/50">
                 {paket.volume && (
                   <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 bg-gradient-to-r from-blue-500 to-indigo-400 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md border border-blue-300">
                     {paket.volume}
                   </div>
                 )}
                 <div className="absolute top-5 right-5 md:top-8 md:right-8 z-10 flex flex-col items-end gap-1.5 md:gap-2 max-w-[60%] md:max-w-[50%]">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md text-center border border-blue-400">
                      45MP MASTERWORK
                    </div>
                    {paket.kategorijaEn && (
                      <div className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-center shadow-sm">
                        {paket.kategorijaEn}
                      </div>
                    )}
                 </div>

                 {/* GLAVNA SLIKA SA PULSIRANJEM I TAJMING MUNJOM */}
                 <div className="w-full aspect-[16/9] rounded-[1rem] md:rounded-2xl overflow-hidden cursor-pointer relative group border border-slate-200 v8-glass-container bg-slate-100 shadow-inner" onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
                    
                    <motion.img 
                      src={paket.previewUrl} 
                      alt={paket.nazivEn} 
                      className="w-full h-full transform-gpu v8-glass-image object-cover" 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Hover Munja */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                       <Zap className="text-blue-500 w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>

                    {/* 🔥 PLAVA TAJMING MUNJA ZA 45MP BUNDLES (Seva svakih 7s) 🔥 */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      animate={{ opacity: [0, 0, 0.9, 0, 1, 0, 0], scale: [0.8, 0.8, 1.2, 0.9, 1.5, 1, 1] }}
                      transition={{ duration: 7, repeat: Infinity, times: [0, 0.85, 0.87, 0.9, 0.92, 0.98, 1], ease: "easeInOut" }}
                    >
                       <Zap className="text-blue-400 w-10 h-10 md:w-16 md:h-16 drop-shadow-lg" fill="rgba(96,165,250,0.3)" strokeWidth={1.5} />
                    </motion.div>
                 </div>

                 {/* MALE SLIKE (THUMBNAILS) - 10 komada naslagano, svaka diše za sebe */}
                 {paket.primeri && paket.primeri.length > 0 && (
                    <div className="grid grid-cols-5 gap-1.5 md:gap-2 mt-2 md:mt-3">
                       {paket.primeri.slice(0, 10).map((thumb, idx) => (
                          <div key={idx} className="aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200 v8-glass-container bg-slate-50" onClick={() => setFullScreenImageUrl(thumb)}>
                             <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[7px] md:text-[8px] font-black px-1.5 py-0.5 z-10 pointer-events-none">PREVIEW</span>
                             
                             <motion.img 
                               src={thumb} alt={`Preview ${idx}`} className="w-full h-full transform-gpu v8-glass-image object-cover" 
                               animate={{ scale: [1, 1.15, 1] }}
                               transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
                             />
                             <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {/* TEKST I KONTROLE */}
              <div className="p-5 md:p-8 pt-4 flex flex-col flex-grow bg-white/50">
                 
                 <h3 className="text-[16px] md:text-[22px] leading-tight font-black uppercase text-slate-900 mb-3 md:mb-4 tracking-tighter flex items-start gap-2 md:gap-3 drop-shadow-sm">
                    <Crown className="text-blue-500 shrink-0 mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6" />
                    <span>{paket.nazivEn}</span>
                 </h3>

                 <div className="bg-blue-50/50 border border-blue-100 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-2.5 md:mb-3 flex items-center gap-2 shadow-sm">
                    <Crown size={12} className="text-blue-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-blue-700 font-black uppercase tracking-widest">45 MEGAPIXELS MASTERWORK</span>
                 </div>

                 <div className="bg-slate-50/50 border border-slate-200 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-4 md:mb-5 flex flex-row items-center gap-2 shadow-sm">
                    <ShieldCheck size={12} className="text-emerald-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.1em] md:tracking-[0.15em] leading-tight md:leading-relaxed">COMMERCIAL RIGHTS & IP-SAFE CLEANUP</span>
                 </div>

                 {/* 🔥 AUTO-UBACIVANJE TEKSTA 🔥 */}
                 <p className="text-[10px] md:text-[12px] text-slate-500 font-medium uppercase tracking-[0.05em] md:tracking-[0.1em] mb-6 md:mb-8 leading-relaxed flex-grow">
                   {currentOpis}
                   {!hasTechText && (
                     <span className="block mt-4 text-slate-500">
                       UTILIZING PRECISION LANCZOS INTERPOLATION. AN ADVANCED MEDIANFILTER SYSTEMATICALLY WIPES OUT DIGITAL NOISE AND COMPRESSION ARTIFACTS. CUSTOM NUMPY MATRIX PROCESSING APPLIES A SMOOTH ROLLOFF TO PREVENT BLOWN-OUT WHITES AND RETAIN INTRICATE HIGHLIGHT TEXTURES. STRICT CONVERSION TO THE SRGB ICC PROFILE ENSURES COLOR ACCURACY ACROSS ALL DIGITAL DEVICES AND PROFESSIONAL REFERENCE MONITORS. SIGNATURE GAUSSIAN NOISE DISTRIBUTION BREAKS ARTIFICIAL AI SMOOTHNESS, CREATING AN AUTHENTIC, TANGIBLE PHOTOGRAPHIC LOOK. ZERO TEXT, WATERMARKS, OR LOGOS. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. FULLY PRODUCTION-READY.
                     </span>
                   )}
                 </p>

                 {/* DUGME I CENA - Naslagano za telefone */}
                 <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mt-auto pt-5 md:pt-6 border-t border-slate-200 gap-4 sm:gap-0 relative z-20">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                       <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center justify-center sm:justify-start gap-1">
                         <ShieldCheck size={10} className="text-emerald-500"/> B2B READY
                       </p>
                       <p className="text-3xl md:text-4xl font-black text-slate-900 drop-shadow-sm">${getGlobalCena(paket.cena)}</p>
                    </div>

                    <button 
                      onClick={() => {
                        if (isAdmin || isOwned) { window.open(paket.zipLink, '_blank'); } 
                        else { prijavaIKupovina(paket); }
                      }} 
                      className={`w-full sm:w-auto px-6 py-3.5 md:px-6 md:py-4 rounded-xl font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:scale-105 ${
                        (!isAdmin && isOwned) 
                          ? 'bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)]' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]'
                      }`}
                    >
                       {(isAdmin || isOwned) ? <><DownloadCloud size={14} className="md:w-4 md:h-4" /> DOWNLOAD</> : <><Crown size={14} className="md:w-4 md:h-4" /> GET ACCESS</>}
                    </button>
                 </div>

                 {isAdmin && (
                    <div className="mt-5 md:mt-6 pt-4 border-t border-red-200 flex flex-col sm:flex-row justify-between gap-2.5 md:gap-3 relative z-20">
                       <button onClick={() => startEditPaket(paket)} className="flex-1 w-full bg-white hover:bg-slate-900 text-slate-600 hover:text-white py-3 rounded-lg md:rounded-xl transition-all border border-slate-200 shadow-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          EDIT <Edit size={14} />
                       </button>
                       <button onClick={() => obrisiPaket(paket.id)} className="flex-1 w-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-lg md:rounded-xl transition-all border border-red-200 shadow-sm text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          REMOVE <Trash2 size={14} />
                       </button>
                    </div>
                 )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default V8MasterBundles;
// KRAJ FAJLA: V8MasterBundles.jsx