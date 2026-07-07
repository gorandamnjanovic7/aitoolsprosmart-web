// POČETAK FAJLA: V8MasterBundles.jsx
import React, { useState, useEffect } from 'react';
import { ImageIcon, Video, Download, Zap, Pencil, Crown, ShieldCheck } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const V8MasterBundles = ({ paketi = [], isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl }) => {
  const [userEmail, setUserEmail] = useState(null);
  const [kupljeniPaketi, setKupljeniPaketi] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email.toLowerCase() : null);
    });
    return () => unsub();
  }, []);

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

    const qCrypto = query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", userEmail));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => {
      cryptoItems = snap.docs.filter(doc => doc.data().status === "PLAĆENO").map(doc => doc.data().productName?.toLowerCase().trim());
      azurirajSve();
    });

    const qPayPal = query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", userEmail));
    const unsubPayPal = onSnapshot(qPayPal, (snap) => {
      paypalItems = snap.docs.filter(doc => doc.data().status === "completed_verified").map(doc => doc.data().productName?.toLowerCase().trim());
      azurirajSve();
    });

    return () => { unsubCrypto(); unsubPayPal(); };
  }, [userEmail]);

  if (!paketi || paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 opacity-50 px-4">
          <Crown className="w-12 h-12 md:w-16 md:h-16 text-blue-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest">THE VAULT IS CURRENTLY SEALED</h3>
          <p className="text-[9px] md:text-[11px] text-zinc-400 font-black uppercase mt-2 tracking-widest">New Master Bundles dropping soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full text-center mb-10 md:mb-16 px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
          V8 EXTREME 45MP <span className="text-blue-500 block md:inline mt-1 md:mt-0">MASTER STOCK BUNDLES</span>
        </h2>
        <p className="text-blue-400/80 font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-[9px] md:text-[10px] mt-2 md:mt-3 break-words">
          ULTRA-PREMIUM ASSETS FOR VISIONARY CREATORS
        </p>
      </div>

      {paketi.map(paket => {
        const naziv = paket.nazivEn ? paket.nazivEn.trim() : "";
        const volume = paket.volume ? paket.volume.trim() : "";
        const tacanNaziv = volume ? `${naziv} - ${volume}` : naziv;
        const duplaGreska = volume ? `${naziv} - ${volume} - ${volume}` : naziv;
        
        const jeKupljen = kupljeniPaketi.some(k => {
          const kLow = k.toLowerCase();
          return kLow === tacanNaziv.toLowerCase() || kLow === naziv.toLowerCase() || kLow === duplaGreska.toLowerCase() || kLow === "full access";
        });

        return (
        <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_40px_rgba(37,99,235,0.2)] flex flex-col v8-bundle-card v8-premium-card border border-blue-500/20 max-w-full">
          <div className="v8-card-content p-4 md:p-6 flex flex-col h-full bg-[#030008] max-w-full overflow-hidden">
            <div className={`${getAspectClass(paket.format)} relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner shrink-0 cursor-pointer max-w-full`} onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
              {paket.volume && (<div className="absolute top-0 left-0 px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r bg-blue-600 text-white border-blue-400">{paket.volume}</div>)}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20 max-w-[80%]">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 backdrop-blur-md px-2 md:px-3 py-1 rounded-lg font-black text-[8px] md:text-[9px] uppercase tracking-wider shadow-lg text-white border border-white/10 break-words text-right">45MP EXTREME</div>
                  {(paket.kategorijaEn || paket.kategorija) && (<div className="bg-black/80 backdrop-blur-md px-2 md:px-3 py-1 rounded-lg font-black text-[8px] md:text-[9px] uppercase tracking-wider shadow-lg border border-purple-400/50 text-purple-400 break-words text-right">{paket.kategorijaEn || paket.kategorija}</div>)}
              </div>
              <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" alt={paket.nazivEn} />
            </div>

            {paket.primeri && paket.primeri.length > 0 && (
                <div className={`grid gap-2 md:gap-3 mb-4 shrink-0 max-w-full ${paket.primeri.length > 4 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {paket.primeri.map((imgUrl, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-blue-500/20 bg-zinc-900 shadow-xl relative cursor-pointer" onClick={() => setFullScreenImageUrl(imgUrl)}>
                            <img loading="lazy" src={imgUrl} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-all duration-300" alt="Preview" />
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex-1 flex flex-col max-w-full">
              <div className="flex items-center gap-2 md:gap-3 mb-2 shrink-0">
                <Crown className="w-4 h-4 md:w-5 md:h-5 text-blue-400 shrink-0" />
                <h3 className="text-[16px] md:text-[20px] font-black uppercase text-white tracking-widest leading-tight break-words">{paket.nazivEn || "EXTREME MASTER BUNDLE"}</h3>
              </div>
              
              <div className="mt-2 mb-4 space-y-2 max-w-full">
                <div className="flex items-start md:items-center gap-2 text-blue-400 font-black text-[8px] md:text-[9px] uppercase tracking-widest bg-blue-900/10 p-2.5 rounded-lg border border-blue-500/20 break-words">
                    <ShieldCheck size={12} className="shrink-0 mt-0.5 md:mt-0" /> 
                    <span>EXCLUSIVE COMMERCIAL RIGHTS</span>
                </div>
                <div className="flex items-start md:items-center gap-2 text-orange-400 font-black text-[8px] md:text-[9px] uppercase tracking-widest bg-orange-900/10 p-2.5 rounded-lg border border-orange-500/20 break-words">
                    <Zap size={12} className="shrink-0 mt-0.5 md:mt-0" /> 
                    <span>45MP ULTRA-DETAIL RAW MASTER</span>
                </div>
              </div>

              <p className="text-zinc-400 text-[10px] md:text-[11px] uppercase font-black mb-4 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap break-words">{paket.opisEn}</p>
            </div>
            
            <div className="mt-auto shrink-0 bg-[#050505] p-4 md:p-5 rounded-xl border border-white/5 relative overflow-hidden w-full">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-indigo-900/10 z-0 pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 gap-3 sm:gap-2">
                <div className="flex flex-col w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                  <span className="text-zinc-500 text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] mb-0.5 md:mb-1">One-Time License</span>
                  <span className="text-xl md:text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">${getGlobalCena(paket.cena)}</span>
                </div>
                
                <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                  {isAdmin || jeKupljen ? (
                    <a href={paket.zipLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl font-black text-[9px] md:text-[12px] uppercase tracking-wider md:tracking-widest flex items-center justify-center gap-1.5 md:gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
                      DOWNLOAD <Download className="w-3 h-3 md:w-5 md:h-5 hidden sm:block" />
                    </a>
                  ) : (
                      <button onClick={() => prijavaIKupovina({ ...paket, nazivEn: tacanNaziv })} className="w-full sm:w-auto hover:scale-105 text-white px-4 py-3 md:px-6 md:py-4 rounded-xl font-black text-[9px] md:text-[12px] uppercase tracking-wider md:tracking-widest flex items-center justify-center gap-1.5 md:gap-2 transition-all shadow-lg bg-gradient-to-r from-blue-600 to-indigo-500 shadow-[0_0_30px_rgba(59,130,246,0.6)] border border-blue-400/30">
                        SECURE RIGHTS <Zap className="w-3 h-3 md:w-5 md:h-5" />
                      </button>
                  )}
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-4 md:mt-5 pt-4 border-t border-red-900/30 flex items-center gap-2 md:gap-3 shrink-0 relative z-10 w-full">
                <button onClick={() => startEditPaket(paket)} className="w-full py-2.5 md:py-3 bg-zinc-800 text-zinc-300 rounded-xl text-[9px] md:text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">Edit <Pencil size={12} className="md:w-3.5 md:h-3.5" /></button>
                <button onClick={() => obrisiPaket(paket.id)} className="w-full py-2.5 md:py-3 bg-red-900/30 text-red-500 rounded-xl text-[9px] md:text-[10px] font-black uppercase hover:bg-red-600 transition-all">Remove</button>
              </div>
            )}
          </div>
        </div>
        );
      })}
    </>
  );
};
export default V8MasterBundles;
// KRAJ FAJLA: V8MasterBundles.jsx