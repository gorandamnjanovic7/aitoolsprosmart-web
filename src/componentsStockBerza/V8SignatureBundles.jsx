// POČETAK FAJLA: V8SignatureBundles.jsx
import React from 'react';
import { Zap, DownloadCloud, Edit, Trash2, ShieldCheck, Diamond } from 'lucide-react';
import { motion } from 'framer-motion';

const V8SignatureBundles = ({ paketi, isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl, kupljeniPaketiIds }) => {
  if (!paketi || paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 text-slate-400 font-black uppercase tracking-widest">
        Awaiting Signature Bundles. Radar is clear.
      </div>
    );
  }

  return (
    <>
      <style>{`
        /* 🔥 TVOJA NOVA ROTIRAJUĆA ANIMACIJA IVICE 🔥 */
        @keyframes border-glow-spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        
        .animated-card-box {
            position: relative;
            background: #ffffff;
            border-radius: 3rem;
            z-index: 1;
            overflow: hidden;
        }

        .animated-card-box::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
                transparent, 
                transparent, 
                transparent, 
                #fbbf24, 
                #fcd34d, 
                #f59e0b, 
                transparent
            );
            animation: border-glow-spin 4s linear infinite;
            z-index: -1;
        }

        .animated-card-box::after {
            content: '';
            position: absolute;
            inset: 2px; /* Debljina svetleće linije */
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(24px);
            border-radius: calc(3rem - 2px);
            z-index: -1;
        }
        
        @media (max-width: 768px) {
            .animated-card-box { border-radius: 2rem; }
            .animated-card-box::after { border-radius: calc(2rem - 2px); }
        }
      `}</style>

      {paketi.map((paket) => {
        const isOwned = kupljeniPaketiIds?.includes(paket.id) || paket.isFree || parseFloat(paket.cena) === 0;

        return (
          <div key={paket.id} className="w-full lg:w-[calc(50%-1.5rem)] animated-card-box group/wrap transition-all duration-500 hover:shadow-[0_20px_50px_rgba(245,158,11,0.15)] flex flex-col mb-8 lg:mb-0">
            
            {/* UNUTRAŠNJA STAKLENA KARTICA */}
            <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-[calc(2rem-2px)] md:rounded-[calc(3rem-2px)] overflow-hidden h-full flex flex-col border border-white/50">
              
              {/* SLIKA I ZNAČKE (BADGES) - Prilagođeno za mobilne */}
              <div className="p-3 md:p-5 relative bg-slate-50/50">
                 {paket.volume && (
                   <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 bg-white text-slate-800 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md border border-slate-200">
                     {paket.volume}
                   </div>
                 )}
                 <div className="absolute top-5 right-5 md:top-8 md:right-8 z-10 flex flex-col items-end gap-1.5 md:gap-2 max-w-[60%] md:max-w-[50%]">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md text-center border border-yellow-400">
                      60MP SIGNATURE
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
                      className="w-full h-full transform-gpu v8-glass-image" 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Hover Munja */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                       <Zap className="text-yellow-500 w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />
                    </div>

                    {/* Tajming Munja */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      animate={{ opacity: [0, 0, 0.9, 0, 1, 0, 0], scale: [0.8, 0.8, 1.2, 0.9, 1.5, 1, 1] }}
                      transition={{ duration: 7, repeat: Infinity, times: [0, 0.85, 0.87, 0.9, 0.92, 0.98, 1], ease: "easeInOut" }}
                    >
                       <Zap className="text-yellow-400 w-10 h-10 md:w-16 md:h-16 drop-shadow-lg" fill="rgba(250,204,21,0.3)" strokeWidth={1.5} />
                    </motion.div>
                 </div>

                 {/* MALE SLIKE (THUMBNAILS) - 10 slika, 5 u redu (naslagane) */}
                 {paket.primeri && paket.primeri.length > 0 && (
                    <div className="grid grid-cols-5 gap-1.5 md:gap-2 mt-2 md:mt-3">
                       {paket.primeri.slice(0, 10).map((thumb, idx) => (
                          <div key={idx} className="aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200 v8-glass-container bg-slate-50" onClick={() => setFullScreenImageUrl(thumb)}>
                             <motion.img 
                               src={thumb} alt={`Preview ${idx}`} className="w-full h-full transform-gpu v8-glass-image" 
                               animate={{ scale: [1, 1.15, 1] }}
                               transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
                             />
                             <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {/* TEKST I KONTROLE */}
              <div className="p-5 md:p-8 pt-4 flex flex-col flex-grow bg-white/50">
                 
                 <h3 className="text-[16px] md:text-[22px] leading-tight font-black uppercase text-slate-900 mb-3 md:mb-4 tracking-tighter flex items-start gap-2 md:gap-3 drop-shadow-sm">
                    <Diamond className="text-yellow-500 shrink-0 mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6" />
                    <span>{paket.nazivEn}</span>
                 </h3>

                 <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-2.5 md:mb-3 flex items-center gap-2 shadow-sm">
                    <Diamond size={12} className="text-yellow-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-yellow-700 font-black uppercase tracking-widest">60 MEGAPIXELS OMNI-CHANNEL</span>
                 </div>

                 <div className="bg-slate-50/50 border border-slate-200 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-4 md:mb-5 flex flex-row items-center gap-2 shadow-sm">
                    <ShieldCheck size={12} className="text-emerald-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.1em] md:tracking-[0.15em] leading-tight md:leading-relaxed">COMMERCIAL RIGHTS & IP-SAFE CLEANUP</span>
                 </div>

                 <p className="text-[10px] md:text-[12px] text-slate-500 font-medium uppercase tracking-[0.05em] md:tracking-[0.1em] mb-6 md:mb-8 leading-relaxed flex-grow">
                   {paket.opisEn}
                 </p>

                 {/* DUGME I CENA - Flex col za mobilne */}
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
                          : 'bg-gradient-to-r from-yellow-500 to-amber-400 text-white hover:shadow-[0_10px_20px_rgba(245,158,11,0.3)]'
                      }`}
                    >
                       {(isAdmin || isOwned) ? <><DownloadCloud size={14} className="md:w-4 md:h-4" /> DOWNLOAD</> : <><Diamond size={14} className="md:w-4 md:h-4" /> GET ACCESS</>}
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

export default V8SignatureBundles;
// KRAJ FAJLA: V8SignatureBundles.jsx