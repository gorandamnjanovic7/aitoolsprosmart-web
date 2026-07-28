// POČETAK FAJLA: V8Stock2.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Aperture } from 'lucide-react';

import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { motion, AnimatePresence } from 'framer-motion';

import V10UltraMysticAssets from './V10UltraMysticAssets';
import V10UltraAncientAssets from './V10UltraAncientAssets';

import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';

import { trackV8Action } from '../utils/analytics';

const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
      if (imageUrl) {
          document.body.style.overflow = 'hidden';
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
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FF8C00] hover:bg-orange-500 text-black drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)] p-4 rounded-full font-black z-[1000000] shadow-[0_0_30px_rgba(255,140,0,0.8)] transition-all hover:scale-110"><X size={32} strokeWidth={4} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.4)] border border-[#FF8C00]/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};

const V8Stock2 = () => {
  const navigate = useNavigate();
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: 0 });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, paket: null, name: '', price: 0 });
  
  const [isFullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('v8_active_extra_tab') || 'ultra150_2';
  }); 

  useEffect(() => {
    localStorage.setItem('v8_active_extra_tab', activeTab);
  }, [activeTab]);

  const [otvoreniOpisi, setOtvoreniOpisi] = useState([]);
  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
          setCurrentUser(user);
          setIsAdmin(user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com");
      } else { setCurrentUser(null); setIsAdmin(false); setKupljeniPaketiIds([]); }
    });
    fetchPaketi();
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setPaidPayoneer([]); setPaidCrypto([]); setPaidPaypal([]); return;
    }
    const qPayoneer = query(collection(db, "v8_payoneer_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidPayoneer(items);
    });
    const qCrypto = query(collection(db, "v8_crypto_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidCrypto(items);
    });
    const qPaypal = query(collection(db, "v8_paypal_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidPaypal(items);
    });
    return () => { unsubPayoneer(); unsubCrypto(); unsubPaypal(); };
  }, [currentUser]);

  useEffect(() => {
    const allPaid = Array.from(new Set([...paidPayoneer, ...paidCrypto, ...paidPaypal]));
    setKupljeniPaketiIds(allPaid);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  const fetchPaketi = async () => {
    const q = query(collection(db, "v8_stock_paketi"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const prijavaIKupovina = async (paket) => {
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
        window.open(paket.zipLink, '_blank');
        return;
    }
    if (kupljeniPaketiIds.includes(paket.id)) {
        window.open(paket.zipLink, '_blank');
        return;
    }
    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    const userNow = currentUser || auth.currentUser;
    if (userNow) {
      await snimiKupcaUPayoneerBazu(userNow, paket);
      if (paket.paddleLink && paket.paddleLink.trim() !== "") { window.location.href = paket.paddleLink; return; }
      setCheckoutData({ isOpen: true, name: fullName, price: finalPrice });
      return;
    }
    setLoginRequiredData({ isOpen: true, paket, name: fullName, price: finalPrice });
  };

  const snimiKupcaUPayoneerBazu = async (user, paket) => {
    try {
        await addDoc(collection(db, "v8_payoneer_requests"), { ime: user.displayName || "Client", email: user.email, uid: user.uid, zeliPaket: paket.nazivEn || "Premium", paketId: paket.id, cenaPaketa: paket.cena, vreme: serverTimestamp(), isPaid: false });
    } catch (error) { console.error(error); }
  };

  const getGlobalCena = (cena) => { const numCena = parseFloat(cena); return isNaN(numCena) ? "0.00" : numCena.toFixed(2); };
  const getAspectClass = (format) => { return (!format || format.includes('16:9 ONLY')) ? 'aspect-video' : 'aspect-square'; };

  const ultra150_2Paketi = paketi.filter(p => {
    const fmt = (p.format || "").toUpperCase();
    return fmt.includes('150MP ULTRA MYSTIC BUNDLE') || fmt.includes('150MP ULTRA 2 BUNDLE');
  });

  const ultra150_3Paketi = paketi.filter(p => {
    const fmt = (p.format || "").toUpperCase();
    return fmt.includes('150MP ANCIENT CIVILIZATIONS') || fmt.includes('150MP ANCIENT CIVILIZATION');
  });

  const renderV8Manifest = (rezolucija) => {
    const specifikacije = [
      { t: `1. Lanczos Upscale`, d: "Direct premium interpolation.", insight: `Direct premium LANCZOS interpolation to approx. ${rezolucija} by aspect ratio.` },
      { t: "2. sRGB Conversion + ICC", d: "Color profile embedding.", insight: "Clean sRGB conversion with embedded sRGB ICC profile when available." },
      { t: "3. MedianFilter Cleanup", d: "Texture-safe dirt reduction.", insight: "Texture-safe MedianFilter cleanup to reduce compression dirt without destroying detail." },
      { t: "4. UnsharpMask Sharpness", d: "Micro-contrast sharpening.", insight: `Gentle UnsharpMask micro-contrast sharpening calibrated for ${rezolucija} output.` },
      { t: "5. Color Grading", d: "Commercial color & contrast tuning.", insight: "Controlled premium color, contrast, and brightness tuning for commercial impact." },
      { t: "6. Highlight Rolloff", d: "Compression of extreme highlights.", insight: "Smooth compression of extreme highlights to protect lava, fire, neon, metal, glass, and bright edges." },
      { t: "7. Shadow Depth", d: "Richer blacks and tactile detail.", insight: "Controlled dark-value treatment for richer blacks while retaining tactile shadow detail." },
      { t: "8. Product Ad Polish", d: "Final commercial refinement.", insight: "Final restrained commercial refinement for premium stock / print presentation." },
      { t: "9. Anti-Plastic Grain", d: "Organic micro-grain integration.", insight: "Subtle organic micro-grain to break artificial smoothness after heavy upscale." },
      { t: "10. IP-Safe Metadata", d: "Technical export cleanup.", insight: "Technical export cleanup: no EXIF, no hidden camera data, clean production-ready JPG export." }
    ];
    return (
      <div className={`w-full max-w-[1200px] mx-auto mb-12 bg-black/40 border rounded-[2rem] p-8 md:p-10 ${rezolucija.includes('ANCIENT') ? 'border-[#452A15]/40' : 'border-purple-500/20'}`}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">V10 ULTRA ENGINE</h2>
          <p className={`text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mt-3 italic ${rezolucija.includes('ANCIENT') ? 'text-[#8a5a33]' : 'text-purple-400'}`}>Technical Specifications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {specifikacije.map((item, i) => {
            const isOpen = otvoreniOpisi.includes(i);
            return (
              <div key={i} onClick={() => setOtvoreniOpisi(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? (rezolucija.includes('ANCIENT') ? 'border-[#6B4224]/50 shadow-[0_0_15px_rgba(69,42,21,0.2)]' : 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]') : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? (rezolucija.includes('ANCIENT') ? 'text-[#8a5a33]' : 'text-pink-400') : (rezolucija.includes('ANCIENT') ? 'text-[#6B4224]' : 'text-purple-400')}`}>
                      💎 {item.t}
                    </h4>
                    <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p>
                  </div>
                  <div className="text-xs">▼</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative pt-32 pb-24 px-6">
      <style>{`
        @keyframes ai-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        .animate-ai-spin { animation: ai-spin 4s linear infinite; }
      `}</style>
      <Helmet>
        <title>V10 Extra Ultra Protocols | Mystic & Ancient Worlds</title>
      </Helmet>

      {/* POZADINSKI VIDEI */}
      {activeTab === 'ultra150_2' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/v10_mystic_bg_9_16.mp4" />)}
      {activeTab === 'ultra150_3' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/v10_ancient_bg_9_16.mp4" />)}
      <div className="fixed inset-0 bg-[#050505]/60 z-0 pointer-events-none"></div>

      <div className="relative z-10 max-w-[1800px] mx-auto w-full">
        {/* BACK TO MARKETPLACE BUTTON */}
        <div className="w-full flex justify-start mb-6">
          <button onClick={() => navigate('/stock')} className="text-xs uppercase tracking-widest font-black bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            ← Back To Marketplace
          </button>
        </div>

        <div className="relative w-full mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          {activeTab === 'ultra150_2' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" src="/v10_mystic_box_16_9.mp4" />)}
          {activeTab === 'ultra150_3' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" src="/v10_ancient_box_16_9.mp4" />)}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>

          <div className="relative z-10 text-center py-20 px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
              {activeTab === 'ultra150_2' ? (<>V10 150MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">ULTRA FANTASY WORLD & MYSTIC</span></>) : (<>V10 150MP <span className="text-[#6B4224]">ANCIENT CIVILIZATIONS</span></>)}
            </h1>
            <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[12px] max-w-4xl mx-auto leading-relaxed mb-10 bg-black/30 p-4 rounded-lg backdrop-blur-sm">
              {activeTab === 'ultra150_2' ? "THE ABSOLUTE PINNACLE OF RESOLUTION. 150 MEGAPIXELS ENGINEERED SPECIFICALLY FOR EPIC FANTASY REALMS, MYSTICAL LANDSCAPES, AND CINEMATIC WORLD-BUILDING." : "THE ABSOLUTE PINNACLE OF RESOLUTION. 150 MEGAPIXELS ENGINEERED SPECIFICALLY FOR ANCIENT ARCHITECTURE, HISTORICAL MONUMENTS, AND CINEMATIC MYTHOLOGY."}
            </p>

            {/* 🔥 DUGMAD (TABOVI) NA JEDNOM MESTU 🔥 */}
            <div className="w-full flex flex-wrap justify-center gap-6 px-4">
              <button 
                onClick={() => setActiveTab('ultra150_2')}
                className={`relative group p-[2px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)] active:scale-95 ${activeTab === 'ultra150_2' ? 'scale-105 pointer-events-none shadow-[0_0_40px_rgba(168,85,247,0.6)]' : 'opacity-70 grayscale-[50%] hover:grayscale-0 hover:opacity-100'}`}
              >
                <div className={`absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#A855F7_70%,#EC4899_85%,#A855F7_100%)] ${activeTab === 'ultra150_2' ? 'animate-ai-spin' : ''} pointer-events-none`}></div>
                <div className={`relative z-10 px-8 py-4 bg-[#050505] rounded-[10px] font-black text-xs md:text-sm uppercase tracking-widest transition-colors flex items-center gap-3 ${activeTab === 'ultra150_2' ? 'text-white border-none' : 'text-purple-400 border border-purple-500/30'}`}>
                  <Aperture size={16} /> Fantasy & Mystic
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('ultra150_3')}
                className={`relative group p-[2px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] active:scale-95 ${activeTab === 'ultra150_3' ? 'scale-105 pointer-events-none shadow-[0_0_40px_rgba(245,158,11,0.6)]' : 'opacity-70 grayscale-[50%] hover:grayscale-0 hover:opacity-100'}`}
              >
                <div className={`absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#F59E0B_70%,#EF4444_85%,#F59E0B_100%)] ${activeTab === 'ultra150_3' ? 'animate-ai-spin' : ''} pointer-events-none`}></div>
                <div className={`relative z-10 px-8 py-4 bg-[#050505] rounded-[10px] font-black text-xs md:text-sm uppercase tracking-widest transition-colors flex items-center gap-3 ${activeTab === 'ultra150_3' ? 'text-white border-none' : 'text-amber-500 border border-amber-500/30'}`}>
                  <Aperture size={16} /> Ancient Civilizations
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-12 w-full mx-auto px-4 lg:px-8">
          {activeTab === 'ultra150_2' && (<> {renderV8Manifest("150MP (FANTASY)")} <V10UltraMysticAssets paketi={ultra150_2Paketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} /> </>)}
          {activeTab === 'ultra150_3' && (<> {renderV8Manifest("150MP (ANCIENT)")} <V10UltraAncientAssets paketi={ultra150_3Paketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} prijavaIKupovina={prijavaIKupovina} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} /> </>)}
        </div>
      </div>
      <FullScreenLightbox imageUrl={isFullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
      <AnimatePresence>
        {checkoutData.isOpen && (<V8SecureCheckout isOpen={checkoutData.isOpen} productName={checkoutData.name} price={checkoutData.price} onClose={() => setCheckoutData({ isOpen: false, name: '', price: 0 })} />)}
      </AnimatePresence>
    </div>
  );
};

export default V8Stock2;
// KRAJ FAJLA: V8Stock2.jsx