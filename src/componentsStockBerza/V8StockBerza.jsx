// POČETAK FAJLA: V8StockBerza.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import { Zap, X, Image as ImageIcon, Images, DownloadCloud, Crown, AlertCircle, Type, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon, Diamond, RefreshCcw, Aperture } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc, setDoc, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { motion, AnimatePresence } from 'framer-motion';

import V8StandardAssets from './V8StandardAssets';
import V8PremiumAssets from './V8PremiumAssets';
import V8MasterBundles from './V8MasterBundles';
import V8SignatureBundles from './V8SignatureBundles';
import V10UltraPrintAssets from './V10UltraPrintAssets';

import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';

// POČETAK FUNKCIJE: FullScreenLightbox
const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
      if (imageUrl) {
          document.body.style.overflow = 'hidden';
          if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'image_zoom', { event_category: 'Engagement' });
          }
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

// POČETAK FUNKCIJE: V8StockBerza
const V8StockBerza = () => {
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: 0 });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, paket: null, name: '', price: 0 });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]); 
  const [editingPaketId, setEditingPaketId] = useState(null); 
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  
  // 🔥 ZAKUCAVANJE TABA U MEMORIJU BROWSERA 🔥
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('v8_active_stock_tab') || 'premium';
  }); 

  // Svaki put kad promeni tab, pamtimo ga zauvek (dok ga opet ne promeni)
  useEffect(() => {
    localStorage.setItem('v8_active_stock_tab', activeTab);
  }, [activeTab]);

  const [otvoreniOpisi, setOtvoreniOpisi] = useState([]);

  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  
  // Pojedinačni usisni nizovi za spajanje kupljenih licenci
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('60MP SIGNATURE BUNDLE');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('49.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [paddleLink, setPaddleLink] = useState('');
  const [isFree, setIsFree] = useState(false);

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

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

  // 🔥 RADARSKI SISTEM: SLUŠA SVE TRI POD-KASE ZA PROVERU REALNIH KUPACA 🔥
  useEffect(() => {
    if (!currentUser) {
      setPaidPayoneer([]);
      setPaidCrypto([]);
      setPaidPaypal([]);
      return;
    }

    // 1. Slušaj B2B / Payoneer uplate
    const qPayoneer = query(collection(db, "v8_payoneer_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidPayoneer(items);
    });

    // 2. Slušaj Kripto uplate
    const qCrypto = query(collection(db, "v8_crypto_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidCrypto(items);
    });

    // 3. Slušaj PayPal / Card Pay uplate
    const qPaypal = query(collection(db, "v8_paypal_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => {
      const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); });
      setPaidPaypal(items);
    });

    return () => { unsubPayoneer(); unsubCrypto(); unsubPaypal(); };
  }, [currentUser]);

  // Spajanje svih sigurnih uplata u jedan master niz za render dugmića
  useEffect(() => {
    const allPaid = Array.from(new Set([...paidPayoneer, ...paidCrypto, ...paidPaypal]));
    setKupljeniPaketiIds(allPaid);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'tab_view', {
        event_category: 'Navigation',
        event_label: activeTab 
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const checkPendingPurchase = async () => {
      const pendingPaketId = localStorage.getItem('v8_pending_stock_paket_id');
      if (auth.currentUser && pendingPaketId && paketi.length > 0) {
        const trazeniPaket = paketi.find(p => p.id === pendingPaketId);
        localStorage.removeItem('v8_pending_stock_paket_id'); 
        if(trazeniPaket) {
            try {
                await snimiKupcaUPayoneerBazu(auth.currentUser, trazeniPaket);
                if (typeof window !== 'undefined' && window.gtag) {
                    window.gtag('event', 'purchase', {
                        transaction_id: `V8_TX_${Date.now()}`,
                        value: Number(trazeniPaket.cena),
                        currency: 'USD',
                        items: [{ item_id: trazeniPaket.id, item_name: trazeniPaket.nazivEn, price: Number(trazeniPaket.cena) }]
                    });
                }
                if (trazeniPaket.paddleLink && trazeniPaket.paddleLink.trim() !== "") {
                    window.location.href = trazeniPaket.paddleLink;
                } else {
                   const fullName = trazeniPaket.volume ? `${trazeniPaket.nazivEn} - ${trazeniPaket.volume}` : trazeniPaket.nazivEn;
                   setCheckoutData({ isOpen: true, name: fullName, price: getGlobalCena(trazeniPaket.cena) });
                }
            } catch (err) { console.error(err); }
        }
      }
    };
    const timer = setTimeout(() => { checkPendingPurchase(); }, 1000);
    return () => clearTimeout(timer);
  }, [paketi]);

  useEffect(() => {
    if (activeTab === 'bundles' || activeTab === 'signature' || activeTab === 'ultra150') {
      setIsFree(false); 
    }
    if (activeTab === 'bundles') setNoviFormat('45MP MASTERWORK BUNDLE');
    else if (activeTab === 'signature') setNoviFormat('60MP SIGNATURE BUNDLE');
    else if (activeTab === 'ultra150') setNoviFormat('150MP ULTRA PRINT BUNDLE');
    else setNoviFormat('16:9 ONLY (SINGLE)');
  }, [activeTab]);

  useEffect(() => {
    if (noviFormat === '16:9 ONLY (SINGLE)') { 
        setNoviOpisEn("16:9 ONLY (SINGLE)."); 
    } 
    else if (noviFormat === 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)') { 
        setNoviOpisEn("ALL FORMATS (16:9, 9:16, 21:9, 1:1)."); 
    } 
    else if (noviFormat === '33.2MP MASTERWORK SINGLE') { 
        setNoviOpisEn("33.2MP Upscale - Industrial-grade precision for 8K. Supported formats: 16:9 (10 Images) aspect ratio, 9:16 aspect ratio (10 Images). Utilizing precision LANCZOS interpolation. An advanced MedianFilter systematically wipes out digital noise and compression artifacts. Custom NumPy matrix processing applies a smooth rolloff to prevent blown-out whites and retain intricate highlight textures. Strict conversion to the sRGB ICC profile ensures color accuracy across all digital devices and professional reference monitors. Signature Gaussian Noise distribution breaks artificial AI smoothness, creating an authentic, tangible photographic look. Zero text, watermarks, or logos. 100% IP Safe. Fully production-ready."); 
    }
    else if (noviFormat === '45MP MASTERWORK BUNDLE') { 
        setNoviOpisEn("V8 MASTERWORK BUNDLE: COMPLETE COLLECTION OF 60 PREMIUM VISUALS FOR 8K IN 45 MEGAPIXELS RESOLUTION. INCLUDES 16:9 ( 30 Images ) AND 9:16 ( 30 Images ) ASPECT RATIOS. Utilizing precision LANCZOS interpolation. An advanced MedianFilter systematically wipes out digital noise and compression artifacts. Custom NumPy matrix processing applies a smooth rolloff to prevent blown-out whites and retain intricate highlight textures. Strict conversion to the sRGB ICC profile ensures color accuracy across all digital devices and professional reference monitors. Signature Gaussian Noise distribution breaks artificial AI smoothness, creating an authentic, tangible photographic look. Zero text, watermarks, or logos. 100% IP Safe. Fully production-ready."); 
    }
    else if (noviFormat === '60MP SIGNATURE BUNDLE') { 
        setNoviOpisEn("V8 SIGNATURE BUNDLE: COMPLETE COLLECTION OF 45 PREMIUM VISUALS FOR 8K IN 60 MEGAPIXELS RESOLUTION. INCLUDES 16:9 ( 15 Images ), 9:16 ( 15 Images ) AND 21:9 ( 15 Images ) ASPECT RATIOS. Utilizing precision LANCZOS interpolation. An advanced MedianFilter systematically wipes out digital noise and compression artifacts. Custom NumPy matrix processing applies a smooth rolloff to prevent blown-out whites and retain intricate highlight textures. Strict conversion to the sRGB ICC profile ensures color accuracy across all digital devices and professional reference monitors. Signature Gaussian Noise distribution breaks artificial AI smoothness, creating an authentic, tangible photographic look. Zero text, watermarks, or logos. 100% IP Safe. Fully production-ready."); 
    }
    else if (noviFormat === '150MP ULTRA PRINT BUNDLE') { 
        setNoviOpisEn("V10 ULTRA PRINT BUNDLE: MASSIVE 150MP RESOLUTION FOR ELITE PRINT & COMMERCIAL WORK. INCLUDES A CURATED 15-FILE COLLECTION: 16:9 ( 5 Images ), 9:16 ( 5 Images ), AND 21:9 ( 5 Images ) ASPECT RATIOS. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for highlight rolloff and shadow depth, and organic anti-plastic grain. Strict sRGB ICC profile embedding. 100% IP-Safe metadata cleanup. Perfect for billboards, fine-art printing, and extreme cropping. Zero text, watermarks, or logos. Fully production-ready."); 
    }
  }, [noviFormat, editingPaketId]); 

  // POČETAK FUNKCIJE: fetchPaketi
  const fetchPaketi = async () => {
    const q = query(collection(db, "v8_stock_paketi"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  // KRAJ FUNKCIJE: fetchPaketi

  // POČETAK FUNKCIJE: otvoriCheckoutIliPaddle
  const otvoriCheckoutIliPaddle = async (user, paket) => {
    if (!user || !paket) return;
    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    await snimiKupcaUPayoneerBazu(user, paket);
    if (paket.paddleLink && paket.paddleLink.trim() !== "") {
      window.location.href = paket.paddleLink;
      return;
    }
    setCheckoutData({ isOpen: true, name: fullName, price: finalPrice });
  };
  // KRAJ FUNKCIJE: otvoriCheckoutIliPaddle

  // POČETAK FUNKCIJE: prijavaIKupovina
  const prijavaIKupovina = async (paket) => {
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
        if(typeof v8Toast !== 'undefined') v8Toast.success("🚀 ACCESS GRANTED: Downloading Free V8 Asset...");
        window.open(paket.zipLink, '_blank');
        return;
    }
    
    if (kupljeniPaketiIds.includes(paket.id)) {
        if(typeof v8Toast !== 'undefined') v8Toast.success("🚀 DOWNLOADING PURCHASED ASSET...");
        window.open(paket.zipLink, '_blank');
        return;
    }

    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    const userNow = currentUser || auth.currentUser;

    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', { event_category: 'B2B_Sales', event_label: fullName, value: Number(finalPrice), currency: 'USD', items: [{ item_name: fullName, price: Number(finalPrice) }] });
    }

    if (userNow) {
        await otvoriCheckoutIliPaddle(userNow, paket);
        return;
    }
    setLoginRequiredData({ isOpen: true, paket, name: fullName, price: finalPrice });
  };
  // KRAJ FUNKCIJE: prijavaIKupovina

  // POČETAK FUNKCIJE: snimiKupcaUPayoneerBazu
  const snimiKupcaUPayoneerBazu = async (user, paket) => {
      try {
          await addDoc(collection(db, "v8_payoneer_requests"), { 
            ime: user.displayName || "Client", 
            email: user.email, 
            uid: user.uid, 
            zeliPaket: paket.nazivEn || "Premium", 
            paketId: paket.id, 
            cenaPaketa: paket.cena, 
            vreme: serverTimestamp(), 
            isPaid: false 
          });

          if (paket.format && (paket.format.toUpperCase().includes('MASTERWORK') || paket.format.toUpperCase().includes('SIGNATURE') || paket.format.toUpperCase().includes('150MP'))) {
              const userRef = doc(db, "vip_users", user.email.toLowerCase());
              const userSnap = await getDoc(userRef);
              const unlockedApps = userSnap.exists() ? userSnap.data().unlockedApps || [] : [];
              if (!unlockedApps.includes('V8_PROMPT_ENGINE')) {
                  await setDoc(userRef, { unlockedApps: [...unlockedApps, 'V8_PROMPT_ENGINE'] }, { merge: true });
                  v8Toast.success("V8 PROMPT ENGINE UNLOCKED!");
              }
          }
      } catch (error) { console.error(error); }
  };
  // KRAJ FUNKCIJE: snimiKupcaUPayoneerBazu

  // POČETAK FUNKCIJE: handleUploadPreview
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
  // KRAJ FUNKCIJE: handleUploadPreview

  // POČETAK FUNKCIJE: handleUploadPrimeri
  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    
    let maxThumbnails = 4;
    if (activeTab === 'bundles') maxThumbnails = 10;
    else if (activeTab === 'signature' || activeTab === 'ultra150') maxThumbnails = 8;
    
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
  // KRAJ FUNKCIJE: handleUploadPrimeri

  // POČETAK FUNKCIJE: removeMainImage
  const removeMainImage = () => setPreviewUrl('');
  // KRAJ FUNKCIJE: removeMainImage
  
  // POČETAK FUNKCIJE: removeThumbnail
  const removeThumbnail = (indexToRemove) => setPrimeriUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  // KRAJ FUNKCIJE: removeThumbnail

  // POČETAK FUNKCIJE: dodajPaket
  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Image & ZIP needed!"); return; }
    const paketData = { nazivEn: noviNazivEn.trim(), volume: noviVolume, format: noviFormat, kategorijaEn: novaKategorijaEn.trim(), cena: isFree ? "0.00" : novaCena, tip: noviTip, opisEn: noviOpisEn, previewUrl, zipLink, isFree: isFree, primeri: primeriUrls, updatedAt: serverTimestamp() };
    try {
        if (editingPaketId) { await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData); v8Toast.success("Updated!"); } 
        else { await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() }); v8Toast.success("Added!"); }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };
  // KRAJ FUNKCIJE: dodajPaket

  // POČETAK FUNKCIJE: startEditPaket
  const startEditPaket = (paket) => { setEditingPaketId(paket.id); setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || ''); setNoviFormat(paket.format || '16:9 ONLY (SINGLE)'); setNovaKategorijaEn(paket.kategorijaEn || ''); setNovaCena(paket.cena || '49.99'); setNoviOpisEn(paket.opisEn || ''); setPreviewUrl(paket.previewUrl || ''); setZipLink(paket.zipLink || ''); setIsFree(paket.isFree || false); setPrimeriUrls(paket.primeri || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  // KRAJ FUNKCIJE: startEditPaket
  
  // POČETAK FUNKCIJE: stoziEdit
  const stoziEdit = () => { setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); setNoviFormat('16:9 ONLY (SINGLE)'); setNovaKategorijaEn(''); setNovaCena('49.99'); setPreviewUrl(''); setZipLink(''); setIsFree(false); setPrimeriUrls([]); };
  // KRAJ FUNKCIJE: stoziEdit

  // POČETAK FUNKCIJE: obrisiPaket
  const obrisiPaket = async (id) => { if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); } };
  // KRAJ FUNKCIJE: obrisiPaket
  
  // POČETAK FUNKCIJE: getGlobalCena
  const getGlobalCena = (cena) => { const numCena = parseFloat(cena); return numCena > 500 ? (Math.ceil((numCena / 110) * 1.2) + 0.99).toFixed(2) : numCena.toFixed(2); };
  // KRAJ FUNKCIJE: getGlobalCena
  
  // POČETAK FUNKCIJE: getAspectClass
  const getAspectClass = (format) => { return (!format || format.includes('16:9 ONLY')) ? 'aspect-video' : 'aspect-square'; };
  // KRAJ FUNKCIJE: getAspectClass

  const standardPaketi = paketi.filter(p => !(p.format || "").toUpperCase().includes('MASTERWORK') && !(p.format || "").toUpperCase().includes('SIGNATURE') && !(p.format || "").toUpperCase().includes('150MP') && !(p.nazivEn || "").toUpperCase().includes('WATCHES'));
  const premiumPaketi = paketi.filter(p => { const fmt = (p.format || "").toUpperCase(); return fmt.includes('MASTERWORK') && !fmt.includes('MASTERWORK BUNDLE'); });
  const bundlePaketi = paketi.filter(p => (p.format || "").toUpperCase().includes('MASTERWORK BUNDLE'));
  const signaturePaketi = paketi.filter(p => (p.format || "").toUpperCase().includes('60MP SIGNATURE BUNDLE'));
  const ultra150Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP ULTRA PRINT'));

  const pozadine = {
    standard: "url('/standard-bg.webp')",
    premium: "url('/premium-bg.webp')",
    bundles: "url('/bundles-bg.webp')",
    signature: "linear-gradient(to bottom, rgba(5,5,5,0.7), rgba(0,0,0,0.85)), url('/v8-stock/v8-master-bg.jpg')",
    ultra150: "none" 
  };

  // POČETAK FUNKCIJE: renderV8Manifest
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
      { t: "10. IP-Safe Metadata", d: "Technical export cleanup.", insight: "Technical export cleanup: no EXIF, no hidden camera data, clean production-ready JPG export." },
      { t: "11. Anti-Halo Protection", d: "High-contrast edge protection.", insight: "Extra protection around high-contrast bright edges to reduce ugly glow/outline artifacts." },
      { t: "12. Banding Protection", d: "Fine dithering in dark gradients.", insight: "Fine dithering in dark gradients, smoke, mist, and sky areas to reduce banding." },
      { t: "13. Texture Engine", d: "Detail-safe surface finish.", insight: "Texture-preserving finish for rocks, fabric, skin, water, leaves, metal, jewelry, and product surfaces." },
      { t: `14. Quality Gate`, d: "Final validation & reporting.", insight: `Final validation of ${rezolucija} dimensions, JPEG integrity, TXT report, CSV report, and ZIP validation report.` }
    ];

    return (
      <div className={`w-full max-w-5xl mx-auto mb-8 bg-black/40 border rounded-[2rem] p-8 md:p-10 ${rezolucija === '150MP' ? 'border-purple-500/20' : 'border-white/5'}`}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">{rezolucija === '150MP' ? 'V10 ULTRA ENGINE' : 'V8 MASTER ENGINE'}</h2>
          <p className={`text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mt-3 italic ${rezolucija === '150MP' ? 'text-purple-400' : 'text-blue-400'}`}>Technical Specifications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {specifikacije.map((item, i) => {
            const isOpen = otvoreniOpisi.includes(i);
            return (
              <div key={i} onClick={() => {
                  setOtvoreniOpisi(prev => {
                      const isNowOpen = !prev.includes(i);
                      if (isNowOpen && typeof window !== 'undefined' && window.gtag) {
                          window.gtag('event', 'manifest_read', { event_category: 'Engagement', event_label: item.t });
                      }
                      return isNowOpen ? [...prev, i] : prev.filter(x => x !== i);
                  });
                }}
                className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                  isOpen ? (rezolucija === '150MP' ? 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]' : 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.1)]') : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? (rezolucija === '150MP' ? 'text-pink-400' : 'text-orange-400') : (rezolucija === '150MP' ? 'text-purple-400' : 'text-blue-400')}`}>
                      <span className={`text-lg transition-colors duration-300 ${isOpen ? (rezolucija === '150MP' ? 'text-pink-500' : 'text-orange-500') : (rezolucija === '150MP' ? 'text-purple-600/60' : 'text-blue-600/60')}`}>💎</span> 
                      {item.t}
                    </h4>
                    <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p>
                  </div>
                  <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? `rotate-180 ${rezolucija === '150MP' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]' : 'text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'}` : (rezolucija === '150MP' ? 'text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]')}`}>▼</div>
                </div>
                <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 border-t border-white/10">
                      <p className={`text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 pl-3 ${rezolucija === '150MP' ? 'border-pink-500' : 'border-orange-500'}`}>
                        <span className={`font-bold ${rezolucija === '150MP' ? 'text-pink-400' : 'text-orange-400'}`}>Tech Insight:</span> {item.insight}
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
  // KRAJ FUNKCIJE: renderV8Manifest

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative transition-all duration-1000 ease-in-out">
      
      {/* 🌟 GLOBALNA POZADINA ZA CELU STRANICU 🌟 */}
      {activeTab !== 'ultra150' && (
        <div 
          className="fixed inset-0 z-0 transition-all duration-1000"
          style={{ 
            backgroundImage: pozadine[activeTab] || "none",
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* 🌟 GLOBALNI 9:16 VIDEO ZA V10 ULTRA PRINT TAB (Iz public foldera) 🌟 */}
      {activeTab === 'ultra150' && (
        <video 
          autoPlay loop muted playsInline 
          className="fixed inset-0 w-full h-full object-cover z-0 opacity-100 transition-opacity duration-1000" 
          src="/v10bg.mp4" 
        />
      )}

      {/* 🌟 GLOBALNI OVERLAY ZA ČITLJIVOST 🌟 */}
      <div className="fixed inset-0 bg-[#050505]/50 z-0 pointer-events-none"></div>

      {/* 🌟 GLAVNI SADRŽAJ (PLIVA IZNAD POZADINE) 🌟 */}
      <div className="relative z-10 pt-32 pb-24 px-6">
        <style>{`
          @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          .v8-premium-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; }
          .v8-premium-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #ea580c 70%, #3b82f6 85%, #ea580c 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
          .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; }
          .v8-bundle-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #3b82f6 70%, #8b5cf6 85%, #3b82f6 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
          .v8-signature-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #f59e0b 70%, #fbbf24 85%, #f59e0b 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
          .v10-ultra-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #a855f7 70%, #ec4899 85%, #a855f7 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
        `}</style>

        <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
        
        <LoginRequiredModal
          isOpen={loginRequiredData.isOpen}
          onClose={() => setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 })}
          packageName={loginRequiredData.name}
          price={loginRequiredData.price}
          onLoginSuccess={async (user) => {
            if (loginRequiredData.paket) {
              await otvoriCheckoutIliPaddle(user, loginRequiredData.paket);
            }
            setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 });
          }}
        />

        <AnimatePresence>
           {checkoutData.isOpen && (
             <V8SecureCheckout 
               isOpen={checkoutData.isOpen}
               productName={checkoutData.name} 
               price={checkoutData.price} 
               onClose={() => setCheckoutData({ isOpen: false, name: '', price: 0 })} 
             />
           )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className={`relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 ${activeTab === 'ultra150' ? 'shadow-[0_0_60px_rgba(168,85,247,0.15)]' : 'shadow-[0_0_60px_rgba(255,140,0,0.15)]'}`}>
              
              {/* 🌟 STATIČNA SLIKA ZA V8 TABOVE 🌟 */}
              {activeTab !== 'ultra150' && (
                <div className="absolute inset-0 z-0 bg-cover bg-no-repeat transition-all duration-700" style={{ backgroundImage: (activeTab === 'bundles' || activeTab === 'signature') ? "url('/v8-stock/v8-master-bg.jpg')" : "url('/v8-stock/v8-stock-hero.webp')", backgroundPosition: (activeTab === 'bundles' || activeTab === 'signature') ? "center 25%" : "center", opacity: activeTab === 'signature' ? 0.15 : (activeTab === 'bundles' ? 0.3 : 0.7) }}></div>
              )}

              {/* 🌟 NOVI 16:9 VIDEO ZA V10 ULTRA PRINT BOX (Iz public foldera) 🌟 */}
              {activeTab === 'ultra150' && (
                <video 
                  autoPlay loop muted playsInline 
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-70 transition-opacity duration-1000" 
                  src="/v10-box-bg.mp4" 
                />
              )}

              {/* 🌟 GRADIJENT OVERLAY ZA ČITLJIVOST TEKSTA U BOX-u 🌟 */}
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/70 to-[#050505]"></div>
              
              <div className="relative z-10 text-center py-20 px-6">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all">
                      {activeTab === 'premium' && (<>V8 33MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-none">PRODUCTION-READY ASSETS</span></>)}
                      {activeTab === 'bundles' && (<>V8 45MP EXTREME MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-none">STOCK BUNDLES</span></>)}
                      {activeTab === 'signature' && (<>V8 60MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 drop-shadow-none">SIGNATURE BUNDLES</span></>)}
                      {activeTab === 'ultra150' && (<>V10 150MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-none">ULTRA PRINT</span></>)}
                  </h1>

                 <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[12px] max-w-4xl mx-auto leading-relaxed mb-10 drop-shadow-lg bg-black/30 p-4 rounded-lg backdrop-blur-sm transition-all">
                  {activeTab === 'premium' && "33MP OF FLAWLESS DETAIL. HOLLYWOOD BLOCKBUSTER QUALITY MEETS 100% COMMERCIALLY SECURE VISUALS. THE ULTIMATE ARSENAL FOR HIGH-END CREATORS."}
                  {activeTab === 'bundles' && (<>THE DEFINITIVE <span className="text-[#FF8C00]">45MP</span> PRODUCTION-READY ARSENAL. BUILT FOR HIGH-END PRODUCTION. ENGINEERED FOR VISIONARY CREATORS AND SCALABLE, 100% IP-SAFE COMMERCIAL CAMPAIGNS.</>)}
                  {activeTab === 'signature' && (<>THE PINNACLE OF COMMERCIAL ASSETS. <span className="text-yellow-400">45-FILE OMNI-CHANNEL CAMPAIGNS</span> IN 60 MEGAPIXELS. BUILT FOR ELITE AGENCIES AND LUXURY BRANDS.</>)}
                  {activeTab === 'ultra150' && (<>THE ABSOLUTE PINNACLE OF RESOLUTION. <span className="text-purple-400">150 MEGAPIXELS</span> ENGINEERED SPECIFICALLY FOR BILLBOARDS, FINE-ART PRINTING, AND EXTREME CROPPING.</>)}
                 </p>

                  <div className="flex justify-center relative z-10 mt-10">
                      <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-full inline-flex flex-wrap items-center justify-center shadow-xl gap-1">
                          
                          {/* PRIVREMENO SAKRIVEN STANDARD TAB 
                          <button onClick={() => setActiveTab('standard')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'standard' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-400 hover:text-white'}`}>Standard</button>
                          */}

                          <button onClick={() => setActiveTab('premium')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'premium' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-400 hover:text-orange-500'}`}><Zap className="w-4 h-4" /> 33MP Premium</button>
                          <button onClick={() => setActiveTab('bundles')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'bundles' ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-zinc-400 hover:text-blue-400'}`}><Crown className="w-4 h-4" /> 45MP Bundles</button>
                          <button onClick={() => setActiveTab('signature')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'signature' ? 'bg-zinc-900 border border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'text-zinc-400 hover:text-yellow-400'}`}><Diamond className="w-4 h-4" /> 60MP Signature</button>
                          <button onClick={() => setActiveTab('ultra150')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'ultra150' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'text-zinc-400 hover:text-purple-400'}`}><Aperture className="w-4 h-4" /> 150MP Ultra</button>
                      </div>
                  </div>
              </div>
          </motion.div>

          {isAdmin && (
            <form onSubmit={dodajPaket} className="bg-[#0a0a0a] border-2 border-[#FF8C00]/50 rounded-[2.5rem] p-8 mb-16 shadow-[0_0_30px_rgba(255,140,0,0.1)] max-w-4xl mx-auto">
              <h2 className="text-xl font-black text-[#FF8C00] uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-[#FF8C00]/20 pb-4">
                <Zap className="w-6 h-6" /> {editingPaketId ? 'EDIT PACKAGE' : 'ADD NEW ZIP PACKAGE'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <Type size={14} /> PACKAGE TITLE
                      </label>
                      <input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Roman History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <Layers size={14} /> CATEGORY
                      </label>
                      <input type="text" value={novaKategorijaEn} onChange={(e)=>setNovaKategorijaEn(e.target.value)} placeholder="E.g. Abstract" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                          <FolderArchive size={14} /> COLLECTION (VOLUME)
                      </label>
                      <input type="text" placeholder="E.g. VOL 1" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-black text-white border border-white/10 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                        <FileText size={14} /> DESCRIPTION
                    </label>
                    <textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={4} className="bg-black border border-white/10 p-4 rounded-xl text-[12px] font-bold text-white w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full" required />
                </div>

                <div className="flex flex-col gap-6 md:col-span-2">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                            <Wallet size={14} /> PRICE (USD)
                        </label>
                        <input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} disabled={isFree} placeholder="E.g. 49.99" className={`bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-[#FF8C00] transition-all ${isFree ? 'text-zinc-500 border-zinc-800' : 'text-white'}`} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                            <MonitorPlay size={14} /> FORMAT
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {['16:9 ONLY (SINGLE)', 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)', '33.2MP MASTERWORK SINGLE', '45MP MASTERWORK BUNDLE', '60MP SIGNATURE BUNDLE', '150MP ULTRA PRINT BUNDLE'].map((fmt) => (
                                <label key={fmt} className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase flex items-center justify-center ${noviFormat === fmt ? (fmt.includes('150MP') ? 'bg-gradient-to-r from-purple-600 to-pink-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]' : fmt.includes('MASTERWORK') ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : fmt.includes('SIGNATURE') ? 'bg-gradient-to-r from-yellow-600 to-amber-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]') : 'bg-black border-white/10 text-zinc-500 hover:border-[#FF8C00]/50'}`}>
                                    <input type="radio" name="format" value={fmt} checked={noviFormat === fmt} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                    {fmt.replace(' (16:9, 9:16, 21:9, 1:1)', '')}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-blue-400 font-black text-[11px] tracking-widest uppercase">
                              <LinkIcon size={14} /> GOOGLE DRIVE (DELIVERY)
                          </label>
                          <input type="url" value={zipLink} onChange={(e)=>setZipLink(e.target.value)} placeholder="https://drive.google.com/..." className="bg-black border border-blue-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-blue-400 transition-all" required />
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
                            className={`w-full p-4 rounded-xl font-black text-[13px] tracking-widest uppercase border-2 transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                              isFree 
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                                : 'bg-black border-white/10 text-zinc-500 hover:border-emerald-500/50'
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
                            <span className="absolute top-0 left-0 bg-[#FF8C00] text-black text-[9px] font-black px-2 py-0.5 z-10">MAIN</span>
                            <button type="button" onClick={removeMainImage} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md">
                              <X size={12} strokeWidth={3} />
                            </button>
                            <img src={previewUrl} alt="Main" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {primeriUrls.map((url, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-white/20 relative group">
                            <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 z-10">PREVIEW</span>
                            <button type="button" onClick={() => removeThumbnail(idx)} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md">
                              <X size={12} strokeWidth={3} />
                            </button>
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 items-end">
                      
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
                              <ImageIcon size={12} /> MAIN IMAGE
                          </label>
                          <button type="button" onClick={() => mainImageRef.current.click()} className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase transition-all flex items-center gap-2"> 
                            <ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'} 
                          </button>
                          <input type="file" ref={mainImageRef} onChange={handleUploadPreview} className="hidden" /> 
                      </div>

                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
                              <Images size={12} /> GALLERY IMAGES
                          </label>
                          <button type="button" onClick={() => galleryImagesRef.current.click()} className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase transition-all flex items-center gap-2"> 
                            <Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/${activeTab === 'bundles' ? 10 : activeTab === 'signature' || activeTab === 'ultra150' ? 8 : 4})`} 
                          </button>
                          <input type="file" multiple ref={galleryImagesRef} onChange={handleUploadPrimeri} className="hidden" /> 
                      </div>

                      <button type="submit" className="ml-auto px-8 py-4 rounded-xl font-black text-[13px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-black transition-all shadow-[0_0_20px_rgba(255,140,0,0.5)] flex items-center gap-2 hover:scale-105"> 
                        <Zap size={18} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'} 
                      </button>
                    </div>
                  </div>
              </div>
            </form>
          )}

          <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
            
            {/* PRIVREMENO SAKRIVENA STANDARD SEKCIJA (SYSTEM COMPILATION) */}
            
            {activeTab === 'premium' && (
              <>
                {renderV8Manifest("33.2MP")}
                <V8PremiumAssets paketi={premiumPaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} />
              </>
            )}
            
            {activeTab === 'bundles' && (
              <>
                {renderV8Manifest("45MP")}
                <V8MasterBundles paketi={bundlePaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} />
              </>
            )}

            {activeTab === 'signature' && (
              <>
                {renderV8Manifest("60MP")}
                <V8SignatureBundles paketi={signaturePaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} />
              </>
            )}

            {activeTab === 'ultra150' && (
              <>
                {renderV8Manifest("150MP")}
                <V10UltraPrintAssets paketi={ultra150Paketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} kupljeniPaketiIds={kupljeniPaketiIds} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default V8StockBerza;
// KRAJ FAJLA: V8StockBerza.jsx