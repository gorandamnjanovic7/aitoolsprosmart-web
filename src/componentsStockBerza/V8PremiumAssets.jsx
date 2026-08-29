// POČETAK FAJLA: V8PremiumAssets.jsx
import React, { useState, useEffect } from 'react';
import { Zap, DownloadCloud, Edit, Trash2, ShieldCheck, Diamond, ImageIcon, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from '../utils/analytics';

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

  if (!paketi || paketi.length === 0) return <div className="text-slate-400 font-black uppercase tracking-widest w-full text-center py-20">Awaiting Premium Assets. Radar is clear.</div>;

  return (
    <>
      <style>{`
        /* 🔥 ROTIRAJUĆA ANIMACIJA IVICE 🔥 */
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
                #f97316, 
                #f59e0b, 
                #fbbf24, 
                transparent
            );
            animation: border-glow-spin 4s linear infinite;
            z-index: -1;
        }

        .animated-card-box::after {
            content: '';
            position: absolute;
            inset: 2px;
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
      {paketi.map(paket => {
        const naziv = paket.nazivEn ? paket.nazivEn.toLowerCase().trim() : "";
        const volume = paket.volume ? paket.volume.toLowerCase().trim() : "";
        const tacanNaziv = volume ? `${naziv} - ${volume}` : naziv;
        
        // Opuštenija provera (ako baza sadrži deo imena, prolazi)
        const jeKupljen = paket.isFree || parseFloat(paket.cena) === 0 || kupljeniPaketi.some(k => 
           k === tacanNaziv || 
           k.includes(tacanNaziv) || 
           k === naziv || 
           k === "full access"
        );

        return (
          <div key={paket.id} className="w-full lg:w-[calc(50%-1.5rem)] animated-card-box group/wrap transition-all duration-500 hover:shadow-[0_20px_50px_rgba(234,88,12,0.15)] flex flex-col mb-8 lg:mb-0">
            
            {/* UNUTRAŠNJA STAKLENA KARTICA */}
            <div className="relative z-10 bg-white/70 backdrop-blur-md rounded-[calc(2rem-2px)] md:rounded-[calc(3rem-2px)] overflow-hidden h-full flex flex-col border border-white/50">
              
              {/* SLIKA I ZNAČKE (BADGES) - Optimizovano za mobilne */}
              <div className="p-3 md:p-5 relative bg-slate-50/50">
                 {paket.volume && (
                   <div className="absolute top-5 left-5 md:top-8 md:left-8 z-10 bg-white text-slate-800 text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md border border-slate-200">
                     {paket.volume}
                 </div>
                 )}
                 <div className="absolute top-5 right-5 md:top-8 md:right-8 z-10 flex flex-col items-end gap-1.5 md:gap-2 max-w-[60%] md:max-w-[50%]">
                    <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full shadow-md text-center border border-orange-400">
                      {paket.format ? paket.format.split('(')[0].trim() : "33.2MP PREMIUM"}
                    </div>
                    {(paket.kategorijaEn || paket.kategorija) && (
                      <div className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-500 text-[7px] md:text-[9px] font-black uppercase tracking-widest px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-center shadow-sm">
                        {paket.kategorijaEn || paket.kategorija}
                      </div>
                    )}
                 </div>

                 {/* GLAVNA SLIKA SA PULSIRANJEM I TAJMING MUNJOM */}
                 <div className={`${getAspectClass(paket.format)} w-full rounded-[1rem] md:rounded-2xl overflow-hidden cursor-pointer relative group border border-slate-200 v8-glass-container bg-slate-100 shadow-inner`} onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
                    
                    <motion.img 
                      src={paket.previewUrl} 
                      alt={paket.nazivEn} 
                      className="w-full h-full transform-gpu v8-glass-image object-cover" 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Hover Munja */}
                    <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                       {paket.tip === 'Video' ? <Video className="text-orange-500 w-8 h-8 md:w-12 md:h-12 drop-shadow-md" /> : <Zap className="text-orange-500 w-8 h-8 md:w-12 md:h-12 drop-shadow-md" />}
                    </div>

                    {/* Tajming Munja */}
                    <motion.div 
                      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                      animate={{ opacity: [0, 0, 0.9, 0, 1, 0, 0], scale: [0.8, 0.8, 1.2, 0.9, 1.5, 1, 1] }}
                      transition={{ duration: 7, repeat: Infinity, times: [0, 0.85, 0.87, 0.9, 0.92, 0.98, 1], ease: "easeInOut" }}
                    >
                       {paket.tip === 'Video' ? <Video className="text-orange-400 w-10 h-10 md:w-16 md:h-16 drop-shadow-lg" fill="rgba(249,115,22,0.3)" strokeWidth={1.5} /> : <Zap className="text-orange-400 w-10 h-10 md:w-16 md:h-16 drop-shadow-lg" fill="rgba(249,115,22,0.3)" strokeWidth={1.5} />}
                    </motion.div>
                 </div>

                 {/* MALE SLIKE (THUMBNAILS) - Naslagano 5 u red ili 4 zavisno od dužine niza */}
                 {paket.primeri && paket.primeri.length > 0 && (
                    <div className={`grid gap-1.5 md:gap-2 mt-2 md:mt-3 ${paket.primeri.length > 4 ? 'grid-cols-5' : 'grid-cols-4'}`}>
                       {paket.primeri.slice(0, 5).map((thumb, idx) => (
                          <div key={idx} className="aspect-square rounded-lg md:rounded-xl overflow-hidden cursor-pointer relative group border border-slate-200 v8-glass-container bg-slate-50" onClick={() => setFullScreenImageUrl(thumb)}>
                             <motion.img 
                               src={thumb} alt={`Preview ${idx}`} className="w-full h-full transform-gpu v8-glass-image object-cover" 
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
                    {paket.tip === 'Video' ? <Video className="text-orange-500 shrink-0 mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6" /> : <ImageIcon className="text-orange-500 shrink-0 mt-0.5 md:mt-1 w-5 h-5 md:w-6 md:h-6" />}
                    <span>{paket.nazivEn || "PREMIUM ASSETS"}</span>
                 </h3>

                 <div className="bg-orange-50/50 border border-orange-100 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-2.5 md:mb-3 flex items-center gap-2 shadow-sm">
                    <Zap size={12} className="text-orange-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-orange-700 font-black uppercase tracking-widest">33.2MP PRECISION UPSCALE</span>
                 </div>

                 <div className="bg-slate-50/50 border border-slate-200 rounded-lg md:rounded-xl p-2.5 md:p-3 mb-4 md:mb-5 flex flex-row items-center gap-2 shadow-sm">
                    <ShieldCheck size={12} className="text-emerald-500 shrink-0 md:w-[14px] md:h-[14px]" />
                    <span className="text-[7.5px] md:text-[10px] text-slate-600 font-black uppercase tracking-[0.1em] md:tracking-[0.15em] leading-tight md:leading-relaxed">COMMERCIAL RIGHTS & IP-SAFE CLEANUP</span>
                 </div>

                 <p className="text-[10px] md:text-[12px] text-slate-500 font-medium uppercase tracking-[0.05em] md:tracking-[0.1em] mb-6 md:mb-8 leading-relaxed flex-grow whitespace-pre-wrap">
                   {paket.opisEn}
                 </p>

                 {/* DUGME I CENA - Naslagano (flex-col) na telefonu */}
                 <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mt-auto pt-5 md:pt-6 border-t border-slate-200 gap-4 sm:gap-0 relative z-20">
                    <div className="text-center sm:text-left w-full sm:w-auto">
                       <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center justify-center sm:justify-start gap-1">
                         <ShieldCheck size={10} className="text-emerald-500"/> B2B READY
                       </p>
                       <p className="text-3xl md:text-4xl font-black text-slate-900 drop-shadow-sm">${getGlobalCena(paket.cena)}</p>
                    </div>

                    {isAdmin || jeKupljen ? (
                      <a 
                        href={paket.zipLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={() => trackV8Action("download_premium_asset", { asset_name: tacanNaziv })}
                        className="w-full sm:w-auto px-6 py-3.5 md:px-6 md:py-4 rounded-xl font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:scale-105 bg-slate-900 text-white hover:bg-emerald-500 hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)]"
                      >
                        <DownloadCloud size={14} className="md:w-4 md:h-4" /> DOWNLOAD
                      </a>
                    ) : (
                      <button 
                        onClick={() => prijavaIKupovina(paket)} 
                        className="w-full sm:w-auto px-6 py-3.5 md:px-6 md:py-4 rounded-xl font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md hover:scale-105 bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:shadow-[0_10px_20px_rgba(249,115,22,0.3)]"
                      >
                        <Diamond size={14} className="md:w-4 md:h-4" /> GET LICENSE
                      </button>
                    )}
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

export default V8PremiumAssets;
// KRAJ FAJLA: V8PremiumAssets.jsx