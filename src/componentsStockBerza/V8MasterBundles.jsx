// POČETAK FAJLA: V8MasterBundles.jsx
import React from 'react';
import { Zap, DownloadCloud, Edit, Trash2, ShieldCheck, Diamond, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const V8MasterBundles = ({ paketi, isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl, kupljeniPaketiIds }) => {
  if (!paketi || paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 text-zinc-500 font-black uppercase tracking-widest">
        Awaiting Master Bundles. Radar is clear.
      </div>
    );
  }

  return (
    <>
      {paketi.map((paket) => {
        const isOwned = kupljeniPaketiIds?.includes(paket.id) || paket.isFree || parseFloat(paket.cena) === 0;

        return (
          <div key={paket.id} className="relative w-full lg:w-[calc(50%-1.5rem)] p-[2px] rounded-[2.5rem] overflow-hidden group/wrap transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
            
            {/* 🔥 GEMINI AI ROTIRAJUĆI EFEKAT 🔥 */}
            <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#4285F4_70%,#EA4335_80%,#FBBC05_90%,#34A853_100%)] animate-ai-spin z-0 pointer-events-none"></div>

            {/* UNUTRAŠNJA KARTICA */}
            <div className="relative z-10 bg-[#0a0a0a] rounded-[calc(2.5rem-2px)] border border-blue-500/20 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.05)] h-full flex flex-col">
              
              {/* SLIKA I ZNAČKE (BADGES) */}
              <div className="p-4 md:p-5 relative">
                 {paket.volume && (
                   <div className="absolute top-8 left-8 z-10 bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                     {paket.volume}
                   </div>
                 )}
                 <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      45MP MASTERWORK
                    </div>
                    {paket.kategorijaEn && (
                      <div className="bg-black/80 backdrop-blur-md border border-blue-500/50 text-blue-300 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {paket.kategorijaEn}
                      </div>
                    )}
                 </div>

                 {/* GLAVNA SLIKA SA PULSIRANJEM, TAJMING MUNJOM I KONTAKTNOM SENKOM */}
                 <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer relative group border border-white/5 v8-glass-container" onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
                    
                    <motion.img 
                      src={paket.previewUrl} 
                      alt={paket.nazivEn} 
                      className="w-full h-full transform-gpu v8-glass-image" 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                       <Zap className="text-white w-12 h-12 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                    </div>

                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      animate={{ 
                          opacity: [0, 0, 0.9, 0, 1, 0, 0],
                          scale: [0.8, 0.8, 1.2, 0.9, 1.5, 1, 1]
                      }}
                      transition={{ 
                          duration: 7, 
                          repeat: Infinity, 
                          times: [0, 0.85, 0.87, 0.9, 0.92, 0.98, 1],
                          ease: "easeInOut"
                      }}
                    >
                       <Zap className="text-blue-400 w-16 h-16 drop-shadow-[0_0_40px_rgba(59,130,246,1)]" fill="rgba(59,130,246,0.3)" strokeWidth={1.5} />
                    </motion.div>

                 </div>

                 {/* MALE SLIKE (THUMBNAILS) SA ASINHRONIM PULSIRANJEM I KONTAKTNOM SENKOM */}
                 {paket.primeri && paket.primeri.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mt-3">
                       {paket.primeri.slice(0, 4).map((thumb, idx) => (
                          <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group border border-white/5 v8-glass-container" onClick={() => setFullScreenImageUrl(thumb)}>
                             <motion.img 
                               src={thumb} 
                               alt={`Preview ${idx}`} 
                               className="w-full h-full transform-gpu v8-glass-image" 
                               animate={{ scale: [1, 1.15, 1] }}
                               transition={{ duration: 5 + idx, repeat: Infinity, ease: "easeInOut" }}
                             />
                             <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                          </div>
                       ))}
                    </div>
                 )}
              </div>

              {/* TEKST I KONTROLE */}
              <div className="p-6 md:p-8 pt-2 flex flex-col flex-grow">
                 
                 <h3 className="text-xl md:text-[22px] leading-tight font-black uppercase text-white mb-5 tracking-widest flex items-start gap-3">
                    <Crown className="text-blue-500 shrink-0 mt-0.5" size={24} />
                    <span>{paket.nazivEn}</span>
                 </h3>

                 <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-3 mb-3 flex items-center gap-2">
                    <Crown size={14} className="text-blue-400 shrink-0" />
                    <span className="text-[9px] md:text-[10px] text-blue-300 font-black uppercase tracking-widest">45 MEGAPIXELS MASTERWORK</span>
                 </div>

                 <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-3 mb-5 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                    <span className="text-[9px] md:text-[10px] text-emerald-400 font-black uppercase tracking-widest">INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP</span>
                 </div>

                 <p className="text-[10px] md:text-[11px] text-zinc-400 font-bold uppercase tracking-widest mb-8 leading-relaxed">
                   {paket.opisEn}
                 </p>

                 <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/5">
                    <div>
                       <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                         <ShieldCheck size={10} className="text-emerald-500"/> FULL COMMERCIAL RIGHTS
                       </p>
                       <p className="text-3xl md:text-4xl font-black text-blue-400 drop-shadow-md">${getGlobalCena(paket.cena)}</p>
                    </div>

                    <button 
                      onClick={() => {
                        if (isAdmin || isOwned) {
                          window.open(paket.zipLink, '_blank');
                        } else {
                          prijavaIKupovina(paket);
                        }
                      }} 
                      className={`px-6 py-4 rounded-xl font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all flex items-center gap-2 hover:scale-105 ${
                        (!isAdmin && isOwned) 
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                      }`}
                    >
                       {(isAdmin || isOwned) ? <><DownloadCloud size={16} /> DOWNLOAD</> : <><Diamond size={16} /> GET ACCESS</>}
                    </button>
                 </div>

                 {isAdmin && (
                    <div className="mt-6 pt-4 border-t border-red-500/20 flex justify-between gap-3">
                       <button onClick={() => startEditPaket(paket)} className="flex-1 bg-zinc-900 hover:bg-white text-zinc-400 hover:text-black py-3 rounded-xl transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                          EDIT <Edit size={14} />
                       </button>
                       <button onClick={() => obrisiPaket(paket.id)} className="flex-1 bg-red-900/30 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl transition-all border border-red-500/30 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
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