// POČETAK FAJLA: V8SignatureBundles.jsx
import React, { useState, useEffect } from 'react';
import { ImageIcon, Video, Download, Zap, Pencil, Diamond, ShieldCheck, Layers } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const V8SignatureBundles = ({ paketi = [], isAdmin, getGlobalCena, getAspectClass, prijavaIKupovina, startEditPaket, obrisiPaket, setFullScreenImageUrl }) => {
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

  if (!paketi || paketi.length === 0) {
    return (
      <div className="w-full text-center py-20 opacity-50">
          <Diamond className="w-16 h-16 text-yellow-500 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-black text-white uppercase tracking-widest">THE VAULT IS CURRENTLY SEALED</h3>
          <p className="text-[11px] text-zinc-400 font-black uppercase mt-2 tracking-widest">New 60MP Signature Campaigns dropping soon.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
          V8 OMNI-CHANNEL <span className="text-yellow-500">SIGNATURE BUNDLES</span>
        </h2>
        <p className="text-yellow-400/80 font-black uppercase tracking-[0.2em] text-[10px] mt-2">45-FILE CORPORATE CAMPAIGNS IN 60 MEGAPIXELS</p>
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
        <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col v8-signature-card v8-premium-card border border-yellow-500/30">
          <div className="v8-card-content p-5 md:p-6 flex flex-col h-full">
            <div className={`${getAspectClass(paket.format)} relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner shrink-0 cursor-pointer`} onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
              {paket.volume && (<div className="absolute top-0 left-0 px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r bg-gradient-to-r from-yellow-600 to-amber-500 text-white border-yellow-400">{paket.volume}</div>)}
              <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                  <div className="bg-gradient-to-r from-yellow-600 to-amber-600 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.5)] text-white border border-yellow-400/50">60MP SIGNATURE</div>
                  {(paket.kategorijaEn || paket.kategorija) && (<div className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg border border-yellow-400/50 text-yellow-400">{paket.kategorijaEn || paket.kategorija}</div>)}
              </div>
              <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" alt={paket.nazivEn} />
            </div>

            {paket.primeri && paket.primeri.length > 0 && (
                <div className={`grid gap-3 mb-4 shrink-0 ${paket.primeri.length > 4 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                    {paket.primeri.map((imgUrl, idx) => (
                        <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl relative cursor-pointer" onClick={() => setFullScreenImageUrl(imgUrl)}>
                            <img loading="lazy" src={imgUrl} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-all duration-300" alt="Preview" />
                        </div>
                    ))}
                </div>
            )}
            
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-2 shrink-0">
                <Diamond className="w-5 h-5 text-yellow-500" />
                <h3 className="text-[18px] md:text-[20px] font-black uppercase text-white tracking-widest leading-tight">{paket.nazivEn || "SIGNATURE MASTER BUNDLE"}</h3>
              </div>
              
              <div className="mt-2 mb-4 space-y-2">
                <div className="flex items-center gap-2 text-yellow-500 font-black text-[9px] uppercase tracking-widest bg-yellow-900/10 p-2 rounded-lg border border-yellow-500/20">
                    <Layers size={12} /> 45 FILES INCLUDED (16:9, 9:16, 21:9)
                </div>
                <div className="flex items-center gap-2 text-orange-400 font-black text-[9px] uppercase tracking-widest bg-orange-900/10 p-2 rounded-lg border border-orange-500/20">
                    <ShieldCheck size={12} /> ENTERPRISE COMMERCIAL RIGHTS
                </div>
              </div>

              <p className="text-zinc-400 text-[11px] uppercase font-black mb-4 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap">{paket.opisEn}</p>
            </div>
            
            <div className="mt-auto shrink-0 bg-[#050505] p-4 -mx-2 -mb-2 rounded-xl border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-white drop-shadow-md">${getGlobalCena(paket.cena)}</span>
                {isAdmin || jeKupljen ? (
                  <a href={paket.zipLink} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">DOWNLOAD V8 ASSETS <Download className="w-4 h-4" /></a>
                ) : (
                    <button onClick={() => prijavaIKupovina({ ...paket, nazivEn: tacanNaziv })} className="hover:scale-105 text-white px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg bg-gradient-to-r from-yellow-600 to-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                      ACQUIRE CAMPAIGN <Zap className="w-4 h-4" />
                    </button>
                )}
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-4 pt-4 border-t border-red-900/30 flex items-center gap-3 shrink-0">
                <button onClick={() => startEditPaket(paket)} className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase hover:bg-yellow-600 hover:text-white transition-all flex items-center justify-center gap-2">Edit <Pencil size={14} /></button>
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
export default V8SignatureBundles;
// KRAJ FAJLA: V8SignatureBundles.jsx