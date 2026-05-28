// POČETAK FAJLA: V8MasterBundles.jsx
import React from 'react';
import { ImageIcon, Video, Download, Zap, Pencil, Crown, ShieldCheck } from 'lucide-react';

const V8MasterBundles = ({ paketi, isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl }) => {
  if (paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 opacity-50">
          <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-black text-white uppercase tracking-widest">THE VAULT IS CURRENTLY SEALED</h3>
          <p className="text-[11px] text-zinc-400 font-black uppercase mt-2 tracking-widest">New Master Bundles dropping soon.</p>
      </div>
    );
  }

  return (
    <>
      {/* NASLOV ZA MASTER BUNDLE SEKCIJU */}
      <div className="w-full text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
          V8 EXTREME 45MP <span className="text-blue-500">MASTER STOCK BUNDLES</span>
        </h2>
        <p className="text-blue-400/80 font-black uppercase tracking-[0.2em] text-[10px] mt-2">ULTRA-PREMIUM ASSETS FOR VISIONARY CREATORS</p>
      </div>

      {paketi.map(paket => (
        <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_40px_rgba(37,99,235,0.2)] flex flex-col v8-bundle-card v8-premium-card border border-blue-500/20">
          <div className="v8-card-content p-5 md:p-6 flex flex-col h-full">
            
            <div className={`${getAspectClass(paket.format)} relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner shrink-0`}>
              {paket.volume && (<div className="absolute top-0 left-0 px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r bg-blue-600 text-white border-blue-400">{paket.volume}</div>)}
              
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg text-white border border-white/10">45MP EXTREME</div>
                  {(paket.kategorijaEn || paket.kategorija) && (<div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg border border-purple-400/50 text-purple-400">{paket.kategorijaEn || paket.kategorija}</div>)}
              </div>

              <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" alt={paket.nazivEn} />
            </div>
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 shrink-0">
                <Crown className="w-5 h-5 text-blue-400" />
                <h3 className="text-[18px] md:text-[20px] font-black uppercase text-white tracking-widest leading-tight">{paket.nazivEn || "EXTREME MASTER BUNDLE"}</h3>
              </div>
              
              <div className="mt-2 mb-4 space-y-2">
                <div className="flex items-center gap-2 text-blue-400 font-black text-[9px] uppercase tracking-widest bg-blue-900/10 p-2 rounded-lg border border-blue-500/20">
                    <ShieldCheck size={12} /> EXCLUSIVE COMMERCIAL RIGHTS
                </div>
                <div className="flex items-center gap-2 text-orange-400 font-black text-[9px] uppercase tracking-widest bg-orange-900/10 p-2 rounded-lg border border-orange-500/20">
                    <Zap size={12} /> 45MP ULTRA-DETAIL RAW MASTER
                </div>
              </div>

              <p className="text-zinc-400 text-[11px] uppercase font-black mb-4 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap">{paket.opisEn}</p>
            </div>
            
            <div className="mt-auto shrink-0 bg-[#050505] p-4 -mx-2 -mb-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white drop-shadow-md">${getGlobalCena(paket.cena)}</span>
                {isAdmin ? (
                  <a href={paket.zipLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-lg">DOWNLOAD <Download className="w-4 h-4" /></a>
                ) : (
                    <button onClick={() => prijavaIKupovina(paket)} className="hover:scale-105 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.4)]">SECURE EXCLUSIVE RIGHTS <Zap className="w-4 h-4" /></button>
                )}
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-red-900/30 flex items-center gap-3 shrink-0">
                <button onClick={() => startEditPaket(paket)} className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">Edit <Pencil size={14} /></button>
                <button onClick={() => obrisiPaket(paket.id)} className="w-full py-3 bg-red-900/30 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all">Remove</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default V8MasterBundles;
// KRAJ FAJLA: V8MasterBundles.jsx