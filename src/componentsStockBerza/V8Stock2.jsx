// POČETAK FAJLA: V8Stock2.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Zap, X, Aperture, Type, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon, Image as ImageIcon, Images, ArrowLeft } from 'lucide-react';

import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, where, onSnapshot } from 'firebase/firestore';
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
      <div className="fixed inset-0 z-[999999] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
          <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-white hover:bg-orange-500 text-slate-900 hover:text-white drop-shadow-lg p-4 rounded-full font-black z-[1000000] transition-all hover:scale-110"><X size={32} strokeWidth={4} /></button>
          <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-[2rem] shadow-2xl relative z-[999999] border border-white/10" onClick={(e) => e.stopPropagation()} />
      </div>, document.body
  );
};

const V8Stock2 = () => {
  const navigate = useNavigate();
  const [paketi, setPaketi] = useState([]);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  
  // 🔥 FIX: DODAT zipLink U KASU 🔥
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: 0, zipLink: '' });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, paket: null, name: '', price: 0 });
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]); 
  const [editingPaketId, setEditingPaketId] = useState(null); 
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('150MP ULTRA MYSTIC BUNDLE');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('49.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [isFree, setIsFree] = useState(false);
  
  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('v8_active_extra_tab') || 'ultra150_2';
  }); 

  useEffect(() => {
    localStorage.setItem('v8_active_extra_tab', activeTab);
    
    if (!editingPaketId) {
      if (activeTab === 'ultra150_2') setNoviFormat('150MP ULTRA MYSTIC BUNDLE');
      else if (activeTab === 'ultra150_3') setNoviFormat('150MP ANCIENT CIVILIZATIONS');
    }
  }, [activeTab, editingPaketId]);

  useEffect(() => {
    if (editingPaketId) return; 
    
    if (noviFormat === '150MP ULTRA MYSTIC BUNDLE') { 
        setNoviOpisEn("V10 ULTRA MYSTIC BUNDLE: MASSIVE 150MP RESOLUTION FOR EPIC FANTASY REALMS & CINEMATIC WORLD-BUILDING. INCLUDES A CURATED 15-FILE COLLECTION: 16:9 ( 5 Images ), 9:16 ( 5 Images ), AND 21:9 ( 5 Images ) ASPECT RATIOS. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for highlight rolloff and shadow depth, and organic anti-plastic grain. Strict sRGB ICC profile embedding. Perfect for high-visibility billboards, museum-grade fine-art printing, and extreme macro cropping. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready."); 
    }
    else if (noviFormat === '150MP ANCIENT CIVILIZATIONS') { 
        setNoviOpisEn("V10 ANCIENT CIVILIZATIONS: MASSIVE 150MP RESOLUTION FOR HISTORICAL RECONSTRUCTION & CINEMATIC ART DIRECTION. INCLUDES A CURATED 15-FILE COLLECTION: 16:9 ( 5 Images ), 9:16 ( 5 Images ), AND 21:9 ( 5 Images ) ASPECT RATIOS. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for highlight rolloff and shadow depth, and organic anti-plastic grain. Strict sRGB ICC profile embedding. Perfect for high-visibility billboards, museum-grade fine-art printing, and extreme macro cropping. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready."); 
    }
  }, [noviFormat, editingPaketId]);

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
      } else { 
          setCurrentUser(null); 
          setIsAdmin(false);
          setKupljeniPaketiIds([]); 
      }
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

  const handleUploadPreview = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      setPreviewUrl(resData.secure_url);
    } catch (err) { v8Toast.error("Upload error!"); } finally { setIsUploading(false); e.target.value = null; }
  };

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    const maxThumbnails = 8;
    const slobodnaMesta = maxThumbnails - primeriUrls.length;
    if (slobodnaMesta <= 0) return;
    setIsUploadingPrimer(true);
    const noveSlike = [];
    try {
      for (const file of files.slice(0, slobodnaMesta)) {
        const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
        const resData = await res.json();
        noveSlike.push(resData.secure_url);
      }
      setPrimeriUrls(prev => [...prev, ...noveSlike]);
    } catch (err) {} finally { setIsUploadingPrimer(false); e.target.value = null; }
  };

  const removeMainImage = () => setPreviewUrl('');
  const removeThumbnail = (indexToRemove) => setPrimeriUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));

  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Image & ZIP needed!"); return; }
    
    const paketData = { 
      nazivEn: noviNazivEn.trim(), 
      volume: noviVolume, 
      format: noviFormat,
      kategorijaEn: novaKategorijaEn.trim(), 
      cena: isFree ? "0.00" : novaCena, 
      tip: noviTip, 
      opisEn: noviOpisEn, 
      previewUrl, 
      zipLink, 
      isFree: isFree, 
      primeri: primeriUrls, 
      updatedAt: serverTimestamp() 
    };

    try {
        if (editingPaketId) { await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData); v8Toast.success("Updated!"); } 
        else { await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() }); v8Toast.success("Added!"); }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };

  const startEditPaket = (paket) => { setEditingPaketId(paket.id); setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || ''); setNoviFormat(paket.format || '150MP ULTRA MYSTIC BUNDLE'); setNovaKategorijaEn(paket.kategorijaEn || ''); setNovaCena(paket.cena || '49.99'); setNoviOpisEn(paket.opisEn || ''); setPreviewUrl(paket.previewUrl || ''); setZipLink(paket.zipLink || ''); setIsFree(paket.isFree || false); setPrimeriUrls(paket.primeri || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const stoziEdit = () => { setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); setNoviFormat('150MP ULTRA MYSTIC BUNDLE'); setNovaKategorijaEn(''); setNovaCena('49.99'); setPreviewUrl(''); setZipLink(''); setIsFree(false); setPrimeriUrls([]); };
  const obrisiPaket = async (id) => { if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); } };

  const prijavaIKupovina = async (paket) => {
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
        trackV8Action('free_asset_download', { asset_name: paket.nazivEn });
        window.open(paket.zipLink, '_blank');
        return;
    }
    if (kupljeniPaketiIds.includes(paket.id)) {
        trackV8Action('owned_asset_download', { asset_name: paket.nazivEn });
        window.open(paket.zipLink, '_blank');
        return;
    }
    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    const userNow = currentUser || auth.currentUser;
    trackV8Action('checkout_initiated', { event_category: 'B2B_Sales', item_name: fullName, value: Number(finalPrice), currency: 'USD' });
    if (userNow) {
      await snimiKupcaUPayoneerBazu(userNow, paket);
      if (paket.paddleLink && paket.paddleLink.trim() !== "") { window.location.href = paket.paddleLink; return; }
      // 🔥 FIX: DODAT zipLink U KASU 🔥
      setCheckoutData({ isOpen: true, name: fullName, price: finalPrice, zipLink: paket.zipLink });
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
    const kat = (p.kategorijaEn || "").toUpperCase();
    const naziv = (p.nazivEn || "").toUpperCase();
    return fmt.includes('150MP ULTRA MYSTIC BUNDLE') || 
           fmt.includes('150MP ULTRA 2 BUNDLE') || 
           kat.includes('MYSTIC') || 
           kat.includes('FANTASY') ||
           naziv.includes('MYSTIC') || 
           naziv.includes('FANTASY');
  });

  const ultra150_3Paketi = paketi.filter(p => {
    const fmt = (p.format || "").toUpperCase();
    const kat = (p.kategorijaEn || "").toUpperCase();
    const naziv = (p.nazivEn || "").toUpperCase();
    return fmt.includes('150MP ANCIENT CIVILIZATIONS') || 
           fmt.includes('150MP ANCIENT CIVILIZATION') || 
           fmt.includes('150MP ANCIENT') ||
           kat.includes('ANCIENT') || 
           naziv.includes('ANCIENT');
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
      <div className={`w-full max-w-[1200px] mx-auto mb-12 bg-white/40 backdrop-blur-3xl border rounded-[3rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] ${rezolucija.includes('ANCIENT') ? 'border-amber-200/50' : 'border-purple-200/50'}`}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-slate-900">V10 ULTRA ENGINE</h2>
          <p className={`text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mt-3 italic ${rezolucija.includes('ANCIENT') ? 'text-amber-600' : 'text-purple-500'}`}>Technical Specifications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {specifikacije.map((item, i) => {
            const isOpen = otvoreniOpisi.includes(i);
            return (
              <div key={i} onClick={() => setOtvoreniOpisi(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                className={`bg-white/60 backdrop-blur-md border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? (rezolucija.includes('ANCIENT') ? 'border-amber-400 shadow-[0_10px_20px_rgba(245,158,11,0.1)]' : 'border-purple-300 shadow-[0_10px_20px_rgba(168,85,247,0.1)]') : 'border-white hover:border-slate-300 hover:shadow-md'}`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? (rezolucija.includes('ANCIENT') ? 'text-amber-600' : 'text-pink-600') : 'text-slate-800'}`}>
                      <span className={`text-lg transition-colors duration-300 ${isOpen ? (rezolucija.includes('ANCIENT') ? 'text-amber-500' : 'text-pink-500') : 'text-slate-400'}`}>💎</span> {item.t}
                    </h4>
                    <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>{item.d}</p>
                  </div>
                  <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? `rotate-180 ${rezolucija.includes('ANCIENT') ? 'text-amber-500' : 'text-pink-500'}` : 'text-slate-300'}`}>▼</div>
                </div>
                <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100 filter-none' : 'grid-rows-[0fr] opacity-0 blur-sm'}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 border-t border-slate-200">
                      <p className={`text-[11px] md:text-[12px] text-slate-600 font-mono leading-relaxed border-l-2 pl-3 ${rezolucija.includes('ANCIENT') ? 'border-amber-500' : 'border-pink-500'}`}>
                        <span className={`font-bold ${rezolucija.includes('ANCIENT') ? 'text-amber-600' : 'text-pink-600'}`}>Tech Insight:</span> {item.insight}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 font-sans text-slate-900 relative pt-32 pb-24 px-6 transition-all duration-1000 ease-in-out">
      <style>{`
        /* 🔥 TVOJA NOVA ROTIRAJUĆA ANIMACIJA IVICE 🔥 */
        @keyframes border-glow-spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
        }
        
        .animated-border-box {
            position: relative;
            background: #ffffff;
            border-radius: 3rem;
            z-index: 1;
            overflow: hidden;
        }

        .animated-border-box::before {
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
                #4285F4, 
                #EA4335, 
                #34A853, 
                transparent
            );
            animation: border-glow-spin 4s linear infinite;
            z-index: -1;
        }

        .animated-border-box::after {
            content: '';
            position: absolute;
            inset: 2px; /* Debljina svetleće linije */
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(24px);
            border-radius: calc(3rem - 2px);
            z-index: -1;
        }
        
        /* Za telefone blago manji radijus */
        @media (max-width: 768px) {
            .animated-border-box { border-radius: 2rem; }
            .animated-border-box::after { border-radius: calc(2rem - 2px); }
        }
      `}</style>
      <Helmet>
        <title>V10 Extra Ultra Protocols | Mystic & Ancient Worlds</title>
      </Helmet>

      {/* POZADINSKI VIDEI */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        {activeTab === 'ultra150_2' && (<video autoPlay loop muted playsInline className="w-full h-full object-cover transition-opacity duration-1000" src="/v10_mystic_bg_9_16.mp4" />)}
        {activeTab === 'ultra150_3' && (<video autoPlay loop muted playsInline className="w-full h-full object-cover transition-opacity duration-1000" src="/v10_ancient_bg_9_16.mp4" />)}
      </div>

      <div className="relative z-10 max-w-[1800px] mx-auto w-full">
        
        {/* BACK TO MARKETPLACE BUTTON */}
        <div className="w-full flex justify-start mb-6 relative z-[99999] pointer-events-auto">
          <button 
            onClick={() => window.location.href = '/stock'} 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-xl hover:bg-orange-500 text-slate-800 hover:text-white border border-slate-300 hover:border-orange-500 px-6 py-3 rounded-full transition-all shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:shadow-lg font-black uppercase text-[12px] tracking-widest cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={3} /> RETURN TO MARKETPLACE
          </button>
        </div>

        {/* GLAVNI HERO BANER SA NOVIM ANIMIRANIM OKVIROM */}
        <div className="relative w-full mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] animated-border-box">
          {/* Sadržaj Hero Banera ide unutra i on stoji PREKO animacije koja klizi oko ivice */}
          <div className="relative z-10 w-full h-full rounded-[calc(3rem-2px)] overflow-hidden">
              {activeTab === 'ultra150_2' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none" src="/v10_mystic_box_16_9.mp4" />)}
              {activeTab === 'ultra150_3' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none" src="/v10_ancient_box_16_9.mp4" />)}
              
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/30 via-white/70 to-slate-50 pointer-events-none"></div>

              <div className="relative z-10 text-center py-20 px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-slate-900 drop-shadow-sm">
                  {activeTab === 'ultra150_2' ? (<>V10 150MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">ULTRA FANTASY WORLD & MYSTIC</span></>) : (<>V10 150MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">ANCIENT CIVILIZATIONS</span></>)}
                </h1>
                <p className="text-slate-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[12px] max-w-4xl mx-auto leading-relaxed mb-10 shadow-sm bg-white/60 p-4 rounded-xl backdrop-blur-md border border-white">
                  {activeTab === 'ultra150_2' ? "THE ABSOLUTE PINNACLE OF RESOLUTION. 150 MEGAPIXELS ENGINEERED SPECIFICALLY FOR EPIC FANTASY REALMS, MYSTICAL LANDSCAPES, AND CINEMATIC WORLD-BUILDING." : "THE ABSOLUTE PINNACLE OF RESOLUTION. 150 MEGAPIXELS ENGINEERED SPECIFICALLY FOR ANCIENT ARCHITECTURE, HISTORICAL MONUMENTS, AND CINEMATIC MYTHOLOGY."}
                </p>

                <div className="w-full flex flex-wrap justify-center gap-6 px-4">
                  <button 
                    onClick={() => setActiveTab('ultra150_2')}
                    className={`relative group p-[2px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(168,85,247,0.3)] active:scale-95 ${activeTab === 'ultra150_2' ? 'scale-105 pointer-events-none shadow-lg' : 'bg-transparent hover:bg-white'}`}
                  >
                    {activeTab === 'ultra150_2' && (<div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#A855F7_70%,#EC4899_85%,#A855F7_100%)] animate-ai-spin pointer-events-none opacity-20"></div>)}
                    <div className={`relative z-10 px-8 py-4 rounded-[10px] font-black text-xs md:text-sm uppercase tracking-widest transition-colors flex items-center gap-3 ${activeTab === 'ultra150_2' ? 'bg-slate-900 text-white border-none' : 'bg-white/80 backdrop-blur-md text-slate-500 border border-slate-300 hover:text-slate-900'}`}>
                      <Aperture size={16} /> Fantasy & Mystic
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('ultra150_3')}
                    className={`relative group p-[2px] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,158,11,0.3)] active:scale-95 ${activeTab === 'ultra150_3' ? 'scale-105 pointer-events-none shadow-lg' : 'bg-transparent hover:bg-white'}`}
                  >
                    {activeTab === 'ultra150_3' && (<div className="absolute top-1/2 left-1/2 w-[250%] h-[250%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_50%,#F59E0B_70%,#EF4444_85%,#F59E0B_100%)] animate-ai-spin pointer-events-none opacity-20"></div>)}
                    <div className={`relative z-10 px-8 py-4 rounded-[10px] font-black text-xs md:text-sm uppercase tracking-widest transition-colors flex items-center gap-3 ${activeTab === 'ultra150_3' ? 'bg-slate-900 text-white border-none' : 'bg-white/80 backdrop-blur-md text-slate-500 border border-slate-300 hover:text-slate-900'}`}>
                      <Aperture size={16} /> Ancient Civilizations
                    </div>
                  </button>
                </div>
              </div>
          </div>
        </div>

        {/* ADMIN FORMA */}
        {isAdmin && (
            <form onSubmit={dodajPaket} className="bg-white border-2 border-[#FF8C00] rounded-[2.5rem] p-6 md:p-8 mb-16 shadow-[0_10px_30px_rgba(0,0,0,0.1)] max-w-4xl mx-auto relative z-50">
              <h2 className="text-xl md:text-2xl font-black text-[#FF8C00] uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-2 border-b border-[#FF8C00]/20 pb-4">
                <Zap className="w-6 h-6 md:w-8 md:h-8" /> {editingPaketId ? 'EDIT PACKAGE' : 'ADD NEW ZIP PACKAGE (V10 EXTRA)'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <Type size={14} /> PACKAGE TITLE
                      </label>
                      <input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Roman History" className="bg-white border border-slate-300 p-4 rounded-xl text-[14px] font-black text-slate-900 w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <Layers size={14} /> CATEGORY
                      </label>
                      <input type="text" value={novaKategorijaEn} onChange={(e)=>setNovaKategorijaEn(e.target.value)} placeholder="E.g. Architecture" className="bg-white border border-slate-300 p-4 rounded-xl text-[14px] font-black text-slate-900 w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <FolderArchive size={14} /> COLLECTION (VOLUME)
                      </label>
                      <input type="text" placeholder="E.g. VOL 1" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-white text-slate-900 border border-slate-300 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                        <FileText size={14} /> DESCRIPTION
                    </label>
                    <textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={4} className="bg-white border border-slate-300 p-4 rounded-xl text-[12px] font-bold text-slate-700 w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full min-h-[120px]" required />
                </div>

                <div className="flex flex-col gap-6 md:col-span-2">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                            <Wallet size={14} /> PRICE (USD)
                        </label>
                        <input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} disabled={isFree} placeholder="E.g. 49.99" className={`bg-white border p-4 rounded-xl text-[13px] font-bold outline-none transition-all ${isFree ? 'text-slate-400 border-slate-200' : 'text-slate-900 border-slate-300 focus:border-[#FF8C00]'}`} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                            <MonitorPlay size={14} /> FORMAT
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {['150MP ULTRA MYSTIC BUNDLE', '150MP ANCIENT CIVILIZATIONS'].map((fmt) => (
                                <label key={fmt} className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase flex items-center justify-center ${noviFormat === fmt ? (fmt.includes('ANCIENT') ? 'bg-gradient-to-r from-red-600 to-rose-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(225,29,72,0.5)]' : 'bg-gradient-to-r from-purple-600 to-pink-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]') : 'bg-white border-slate-200 text-slate-500 hover:border-[#FF8C00]/50'}`}>
                                    <input type="radio" name="format" value={fmt} checked={noviFormat === fmt} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                    {fmt}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-blue-400 font-black text-[11px] tracking-widest uppercase">
                              <LinkIcon size={14} /> GOOGLE DRIVE (DELIVERY)
                          </label>
                          <input type="url" value={zipLink} onChange={(e)=>setZipLink(e.target.value)} placeholder="https://drive.google.com/..." className="bg-white border border-blue-500/50 p-4 rounded-xl text-[13px] text-slate-900 w-full outline-none font-bold focus:border-blue-400 transition-all" required />
                      </div>

                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-emerald-400 font-black text-[11px] tracking-widest uppercase">
                              <Zap size={14} /> SECURITY PROTOCOL TYPE
                          </label>
                          <button 
                            type="button" 
                            onClick={() => {
                              const nextFreeStatus = !isFree;
                              setIsFree(nextFreeStatus);
                              if (nextFreeStatus) setNovaCena("0.00");
                              else setNovaCena("49.99");
                            }} 
                            className={`w-full p-4 md:p-5 rounded-xl font-black text-[13px] md:text-[15px] tracking-widest uppercase border-2 transition-all text-center flex items-center justify-center gap-2 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${
                              isFree 
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 hover:border-emerald-500/50'
                            }`}
                          >
                            {isFree ? "⚡ FREE PROTOCOL: ACTIVE DOWNLOAD" : "SET AS FREE PACKAGE"}
                          </button>
                      </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {(previewUrl || primeriUrls.length > 0) && (
                      <div className="flex flex-wrap gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        {previewUrl && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.4)] group">
                            <span className="absolute top-0 left-0 bg-[#FF8C00] text-white text-[9px] font-black px-2 py-0.5 z-10">MAIN</span>
                            <button type="button" onClick={removeMainImage} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md drop-shadow-md">
                              <X size={12} strokeWidth={4} />
                            </button>
                            <img src={previewUrl} alt="Main" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {primeriUrls.map((url, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-white/20 relative group">
                            <span className="absolute bottom-0 right-0 bg-slate-900/80 text-white text-[8px] font-black px-1.5 py-0.5 z-10">PREVIEW</span>
                            <button type="button" onClick={() => removeThumbnail(idx)} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md drop-shadow-md">
                              <X size={12} strokeWidth={4} />
                            </button>
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row flex-wrap gap-4 items-end justify-between">
                      
                      <div className="flex flex-col w-full md:w-auto gap-2">
                          <label className="flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest uppercase">
                              <ImageIcon size={12} /> MAIN IMAGE
                          </label>
                          <button type="button" onClick={() => mainImageRef.current.click()} className="bg-slate-100 hover:bg-[#FF8C00] text-slate-800 hover:text-white border-2 border-slate-300 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[13px] uppercase transition-all flex items-center justify-center gap-2 shadow-sm w-full md:w-auto"> 
                            <ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'} 
                          </button>
                          <input type="file" ref={mainImageRef} onChange={handleUploadPreview} className="hidden" /> 
                      </div>

                      <div className="flex flex-col w-full md:w-auto gap-2">
                          <label className="flex items-center gap-2 text-slate-400 font-black text-[10px] tracking-widest uppercase">
                              <Images size={12} /> GALLERY IMAGES
                          </label>
                          <button type="button" onClick={() => galleryImagesRef.current.click()} className="bg-slate-100 hover:bg-[#FF8C00] text-slate-800 hover:text-white border-2 border-slate-300 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[13px] uppercase transition-all flex items-center justify-center gap-2 shadow-sm w-full md:w-auto"> 
                            <Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/8)`} 
                          </button>
                          <input type="file" multiple ref={galleryImagesRef} onChange={handleUploadPrimeri} className="hidden" /> 
                      </div>

                      <button type="submit" className="w-full md:w-auto px-10 py-5 rounded-xl font-black text-[15px] md:text-[17px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-white transition-all shadow-[0_0_30px_rgba(255,140,0,0.8)] flex items-center justify-center gap-2 mt-4 md:mt-0"> 
                        <Zap size={20} strokeWidth={3} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'} 
                      </button>
                    </div>
                  </div>
              </div>
            </form>
          )}

        <div className="flex flex-col lg:flex-row lg:flex-wrap justify-center gap-6 lg:gap-12 w-full mx-auto px-2 sm:px-4 lg:px-8 relative z-10">
          {activeTab === 'ultra150_2' && (<> {renderV8Manifest("150MP (FANTASY)")} <V10UltraMysticAssets paketi={ultra150_2Paketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} /> </>)}
          {activeTab === 'ultra150_3' && (<> {renderV8Manifest("150MP (ANCIENT)")} <V10UltraAncientAssets paketi={ultra150_3Paketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} /> </>)}
        </div>
      </div>
      
      <LoginRequiredModal isOpen={loginRequiredData.isOpen} onClose={() => setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 })} packageName={loginRequiredData.name} price={loginRequiredData.price} onLoginSuccess={async (user) => { if (loginRequiredData.paket) await otvoriCheckoutIliPaddle(user, loginRequiredData.paket); setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 }); }} />
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
      <AnimatePresence>
        {/* 🔥 FIX: DODAT zipLink U KASU 🔥 */}
        {checkoutData.isOpen && (<V8SecureCheckout isOpen={checkoutData.isOpen} productName={checkoutData.name} price={checkoutData.price} zipLink={checkoutData.zipLink} onClose={() => setCheckoutData({ isOpen: false, name: '', price: 0, zipLink: '' })} />)}
      </AnimatePresence>
    </div>
  );
};

export default V8Stock2;
// KRAJ FAJLA: V8Stock2.jsx