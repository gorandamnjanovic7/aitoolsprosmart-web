// POČETAK FAJLA: V8PremiumAssets.jsx
import React, { useState, useEffect } from 'react';
import { ImageIcon, Video, Download, Zap, Pencil, X } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { createPortal } from 'react-dom';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from '../utils/analytics';

// POČETAK FUNKCIJE: FullScreenLightbox
// Napomena: Ako se FullScreenLightbox nalazi samo u roditeljskoj komponenti (V8StockBerza), 
// ovu definiciju i njen import (createPortal, X) možeš obrisati odavde.
const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
      if (imageUrl) {
          document.body.style.overflow = 'hidden';
          // 🔥 GA4 ANALITIKA 🔥
          trackV8Action('image_zoom', { event_category: 'Engagement' });
      }
      else {
          document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
      <div className="fixed inset-0 z-[999999] bg-[#0f172a]/95 flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FF8C00] text-white p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(255,140,0,0.5)]"><X size={32} strokeWidth={3} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.4)] border border-[#FF8C00]/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox

const V8PremiumAssets = ({ paketi = [], isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [kupljeniPaketi, setKupljeniPaketi] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email.toLowerCase() : null);
    });
    return () => unsub();
  }, []);

  // 🔥 DVOZONSKI FIREBASE RADAR - SLUŠA KRIPTO I PAYPAL/KARTICE 🔥
  useEffect(() => {
    if (!userEmail) {
      setKupljeniPaketi([]);
      return;
    }

    let cryptoItems = [];
    let paypalItems = [];

    const azurirajSve = () => {
      const sviKupljeni = [...cryptoItems, ...paypalItems].filter(Boolean);
      setKupljeniPaketi([...new Set(sviKupljeni)]);
    };

    // 1. Sluša KRIPTO (NOWPayments)
    const qCrypto = query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", userEmail));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => {
      cryptoItems = snap.docs.filter(doc => doc.data().status === "PLAĆENO").map(doc => doc.data().productName?.toLowerCase().trim());
      azurirajSve();
    });

    // 2. Sluša PAYPAL (PayPal i Kreditne Kartice)
    const qPayPal = query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", userEmail));
    const unsubPayPal = onSnapshot(qPayPal, (snap) => {
      paypalItems = snap.docs.filter(doc => doc.data().status === "completed_verified").map(doc => doc.data().productName?.toLowerCase().trim());
      azurirajSve();
    });

    return () => { unsubCrypto(); unsubPayPal(); };
  }, [userEmail]);

  if (!paketi || paketi.length === 0) return <div className="text-zinc-500 font-bold uppercase w-full text-center py-10">No premium assets found.</div>;

  return (
    <>
      {paketi.map(paket => {
        const naziv = paket.nazivEn ? paket.nazivEn.toLowerCase().trim() : "";
        const volume = paket.volume ? paket.volume.toLowerCase().trim() : "";
        const tacanNaziv = volume ? `${naziv} - ${volume}` : naziv;
        
        // Opuštenija provera (ako baza sadrži deo imena, prolazi)
        const jeKupljen = kupljeniPaketi.some(k => 
           k === tacanNaziv || 
           k.includes(tacanNaziv) || 
           k === naziv || 
           k === "full access"
        );

        return (
        <div key={paket.id} className="relative w-full md:w-[calc(50%-1.5rem)] p-[2px] rounded-[2.5rem] overflow-hidden group/wrap transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,140,0,0.3)] flex flex-col v8-premium-card">
          
          {/* 🔥 GEMINI AI ROTIRAJUĆI EFEKAT 🔥 */}
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#4285F4_70%,#EA4335_80%,#FBBC05_90%,#34A853_100%)] animate-ai-spin z-0 pointer-events-none"></div>

          <div className="relative z-10 bg-[#0a0a0a] rounded-[calc(2.5rem-2px)] border border-orange-500/20 shadow-[0_0_30px_rgba(255,140,0,0.05)] v8-card-content p-5 md:p-6 flex flex-col h-full">
            <div className={`${getAspectClass(paket.format)} relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner shrink-0 cursor-pointer`} onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
              {paket.volume && (<div className="absolute top-0 left-0 px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r bg-[#FF8C00] text-black border-[#FF8C00]/50">{paket.volume}</div>)}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                  {paket.format && (<div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg border border-[#FF8C00]/50 text-[#FF8C00]">{paket.format.split('(')[0].trim()}</div>)}
                  {(paket.kategorijaEn || paket.kategorija) && (<div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg border border-blue-400/50 text-blue-400">{paket.kategorijaEn || paket.kategorija}</div>)}
              </div>
              <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover/wrap:opacity-100 transition-all duration-500" alt={paket.nazivEn} />
            </div>
            
            {paket.primeri && paket.primeri.length > 0 && (
                <div className={`grid gap-3 mb-4 shrink-0 ${paket.primeri.length > 4 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {paket.primeri.map((imgUrl, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl relative cursor-pointer group" onClick={() => setFullScreenImageUrl(imgUrl)}>
                            <img loading="lazy" src={imgUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-300 transform-gpu group-hover:scale-110" alt="Preview" />
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 shrink-0">
                {paket.tip === 'Video' ? <Video className="w-5 h-5 text-[#FF8C00]" /> : <ImageIcon className="w-5 h-5 text-[#FF8C00]" />}
                <h3 className="text-[18px] md:text-[20px] font-black uppercase text-white tracking-widest leading-tight">{paket.nazivEn || "PREMIUM ASSETS"}</h3>
              </div>
              <p className="text-zinc-400 text-[11px] uppercase font-black mb-4 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap">{paket.opisEn}</p>
            </div>
            
            <div className="mt-auto shrink-0 bg-[#050505] p-4 -mx-2 -mb-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white drop-shadow-md">${getGlobalCena(paket.cena)}</span>
                {isAdmin || jeKupljen ? (
                  <a 
                     href={paket.zipLink} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     onClick={() => trackV8Action("download_premium_asset", { asset_name: tacanNaziv })}
                     className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
                  >
                    DOWNLOAD <Download className="w-4 h-4" />
                  </a>
                ) : (
                    <button onClick={() => prijavaIKupovina(paket)} className="hover:scale-105 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg bg-gradient-to-r from-orange-600 to-amber-500 shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                      GET LICENSE <Zap className="w-4 h-4" />
                    </button>
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
        );
      })}
    </>
  );
};
export default V8PremiumAssets;
// KRAJ FAJLA: V8PremiumAssets.jsx