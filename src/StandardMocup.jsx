// POČETAK FAJLA: StandardMocup.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async'; 
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { Zap, X, Image as ImageIcon, Images, DownloadCloud, Crown, AlertCircle, Type, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon, Diamond, RefreshCcw, Aperture, Trash2, Upload, Briefcase, Monitor, LayoutGrid, ShieldCheck, Edit, Award, CheckCircle2, Smartphone, Maximize, ArrowLeft } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc, setDoc, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { v8Toast } from './v8Utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; 

import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

// POČETAK FUNKCIJE: FullScreenLightbox
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
// KRAJ FUNKCIJE: FullScreenLightbox

// POČETAK FUNKCIJE: StandardMocup
export default function StandardMocup() {
  const navigate = useNavigate();

  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  
  // 🔥 DODATI ID, LINK I DESC DA BI KASA IMALA SVE PODATKE 🔥
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, id: '', name: '', price: 0, link: '', desc: '' });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, paket: null, name: '', price: 0 });
  
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]); 
  const [editingPaketId, setEditingPaketId] = useState(null); 
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('v8_active_mocup_tab') || 'ultra1';
  }); 

  const [otvoreniOpisi, setOtvoreniOpisi] = useState([]);
  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('150MP STANDARD DEVICE MOCKUPS');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('49.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [isFree, setIsFree] = useState(false);

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('v8_active_mocup_tab', activeTab);
  }, [activeTab]);

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
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => { const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); }); setPaidPayoneer(items); });
    
    const qCrypto = query(collection(db, "v8_crypto_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => { const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); }); setPaidCrypto(items); });
    
    const qPaypal = query(collection(db, "v8_paypal_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => { const items = []; snap.forEach(doc => { if(doc.data().paketId) items.push(doc.data().paketId); }); setPaidPaypal(items); });
    
    return () => { unsubPayoneer(); unsubCrypto(); unsubPaypal(); };
  }, [currentUser]);

  useEffect(() => {
    const allPaid = Array.from(new Set([...paidPayoneer, ...paidCrypto, ...paidPaypal]));
    setKupljeniPaketiIds(allPaid);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  useEffect(() => {
    trackV8Action('tab_view', { event_category: 'Navigation', event_label: activeTab });
  }, [activeTab]);

  useEffect(() => {
    setIsFree(false);
    if (activeTab === 'ultra1') setNoviFormat('150MP STANDARD DEVICE MOCKUPS');
    else if (activeTab === 'ultra2') setNoviFormat('150MP PREMIUM DEVICE MOCKUPS');
    else if (activeTab === 'ultra3') setNoviFormat('150MP BILLBOARD MOCKUPS');
    else if (activeTab === 'ultra4') setNoviFormat('150MP WALL MOCKUPS');
    else if (activeTab === 'ultra5') setNoviFormat('150MP EXECUTIVE PLAQUES');
  }, [activeTab]);

  useEffect(() => {
    if (noviFormat === '150MP STANDARD DEVICE MOCKUPS') { 
      setNoviOpisEn("V10 ULTRA MOCKUPS BUNDLE: MASSIVE 150MP RESOLUTION FOR ELITE PRESENTATION & COMMERCIAL WORK. INCLUDES A CURATED 10-FILE COLLECTION: 16:9 ASPECT RATIO. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for highlight rolloff and shadow depth, and organic anti-plastic grain. Strict sRGB ICC profile embedding. Perfect for high-visibility billboards, museum-grade fine-art printing, and extreme macro cropping. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.\n\n■ 10 hyper-realistic 150MP renders\n■ Custom Cinematic Environments engineered for your brand\n■ Full marketing toolkit (Web, Investor Decks)"); 
    }
    else if (noviFormat === '150MP PREMIUM DEVICE MOCKUPS') { 
      setNoviOpisEn("V10 LUXURY MOCKUPS BUNDLE: THE PINNACLE OF 150MP RESOLUTION FOR HIGH-END PRESENTATION & ENTERPRISE COMMERCIAL WORK. INCLUDES A CURATED 5-FILE COLLECTION OF ULTRA-PREMIUM DEVICES: 16:9 ASPECT RATIO. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for flawless glass/metal reflections, and deep shadow profiling. Strict sRGB ICC profile embedding. Perfect for high-visibility luxury campaigns, elegant enterprise showcases, and extreme macro cropping. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.\n\n■ 5 ultra-luxury 150MP renders\n■ Executive Cinematic Environments engineered for top-tier brands\n■ Full premium marketing toolkit (Web, Investor Decks)"); 
    }
    else if (noviFormat === '150MP BILLBOARD MOCKUPS') { 
      setNoviOpisEn("V10 BILLBOARD MOCKUPS BUNDLE: THE PINNACLE OF 150MP RESOLUTION FOR HIGH-END OUT-OF-HOME PRESENTATION. INCLUDES A CURATED 5-FILE COLLECTION OF MEGA-SCALE OUTDOOR DISPLAYS: 16:9 ASPECT RATIO. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for flawless environmental integration, and deep shadow profiling. Strict sRGB ICC profile embedding. Perfect for high-visibility luxury ad campaigns, epic city-scale showcases, and extreme macro cropping. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.\n\n■ 5 ultra-realistic 150MP outdoor billboard renders\n■ Epic City & Urban Environments engineered for mega-scale brands\n■ Full premium advertising toolkit (Campaigns, Investor Decks)"); 
    }
    else if (noviFormat === '150MP WALL MOCKUPS') { 
      setNoviOpisEn("V10 WALL MOCKUPS BUNDLE: THE PINNACLE OF 150MP RESOLUTION FOR HIGH-END ARCHITECTURAL SHOWCASES. INCLUDES A CURATED 5-FILE COLLECTION OF EXTERIOR & INTERIOR WALL DISPLAYS: 16:9 ASPECT RATIO. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for flawless indoor/outdoor lighting reflection, and deep shadow profiling. Strict sRGB ICC profile embedding. Perfect for luxury retail exhibitions, boutique showcases, and premium waterfront branding. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.\n\n■ 5 premium architectural 150MP wall renders\n■ Luxury Retail & Boutique Environments engineered for prestige\n■ Full premium design toolkit (Web, Portfolios, Investor Decks)"); 
    }
    else if (noviFormat === '150MP EXECUTIVE PLAQUES') { 
      setNoviOpisEn("V10 EXECUTIVE PLAQUES BUNDLE: THE PINNACLE OF 150MP RESOLUTION FOR HIGH-END CORPORATE SHOWCASES. INCLUDES A CURATED 5-FILE COLLECTION IN 16:9 OF PRESTIGIOUS AWARDS & PLAQUES. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for flawless glass/metal reflections, and deep shadow profiling. Strict sRGB ICC profile embedding. Perfect for enterprise achievements, premium certifications, and executive portfolio showcases. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.\n\n■ 5 premium 150MP executive plaque renders\n■ Corporate & Executive Environments engineered for prestige\n■ Full premium design toolkit (Web, Portfolios, Investor Decks)"); 
    }
  }, [noviFormat, editingPaketId]); 

  const fetchPaketi = async () => {
    const q = query(collection(db, "v8_standard_mockups"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const otvoriCheckoutIliPaddle = async (user, paket) => {
    if (!user || !paket) return;
    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    
    // Zadržavamo tvoju Payoneer bazu zbog istorije, ali odmah otvaramo novu Kasu
    await snimiKupcaUPayoneerBazu(user, paket);
    
    if (paket.paddleLink && paket.paddleLink.trim() !== "") { window.location.href = paket.paddleLink; return; }
    
    // 🔥 SMEŠTAMO SVE PODATKE U STATE KAKO BI IH KASA PREUZELA 🔥
    setCheckoutData({ 
        isOpen: true, 
        id: paket.id,
        name: fullName, 
        price: finalPrice,
        link: paket.zipLink || "",
        desc: "Full Commercial License & IP-Safe Cleanup"
    });
  };

  const prijavaIKupovina = async (paket) => {
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
        trackV8Action('free_asset_download', { asset_name: paket.nazivEn });
        if(typeof v8Toast !== 'undefined') v8Toast.success("🚀 ACCESS GRANTED: Downloading Free V8 Asset...");
        window.open(paket.zipLink, '_blank');
        return;
    }
    if (kupljeniPaketiIds.includes(paket.id)) {
        trackV8Action('owned_asset_download', { asset_name: paket.nazivEn });
        if(typeof v8Toast !== 'undefined') v8Toast.success("🚀 DOWNLOADING PURCHASED ASSET...");
        window.open(paket.zipLink, '_blank');
        return;
    }
    const fullName = paket.volume ? `${paket.nazivEn} - ${paket.volume}` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    const userNow = currentUser || auth.currentUser;
    trackV8Action('checkout_initiated', { event_category: 'B2B_Sales', item_name: fullName, value: Number(finalPrice), currency: 'USD' });
    if (userNow) { await otvoriCheckoutIliPaddle(userNow, paket); return; }
    setLoginRequiredData({ isOpen: true, paket, name: fullName, price: finalPrice });
  };

  const snimiKupcaUPayoneerBazu = async (user, paket) => {
      try {
          await addDoc(collection(db, "v8_payoneer_requests"), { ime: user.displayName || "Client", email: user.email, uid: user.uid, zeliPaket: paket.nazivEn || "Premium Mockup", paketId: paket.id, cenaPaketa: paket.cena, vreme: serverTimestamp(), isPaid: false });
      } catch (error) { console.error(error); }
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
    const slobodnaMesta = 10 - primeriUrls.length; // Max 10 slika
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
    
    let formatToSave = noviFormat;

    const paketData = { 
      nazivEn: noviNazivEn.trim(), 
      volume: noviVolume, 
      format: formatToSave, 
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
        if (editingPaketId) { await updateDoc(doc(db, "v8_standard_mockups", editingPaketId), paketData); v8Toast.success("Updated!"); } 
        else { await addDoc(collection(db, "v8_standard_mockups"), { ...paketData, createdAt: serverTimestamp() }); v8Toast.success("Added!"); }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };

  const startEditPaket = (paket) => { setEditingPaketId(paket.id); setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || ''); setNoviFormat(paket.format || '150MP STANDARD DEVICE MOCKUPS'); setNovaKategorijaEn(paket.kategorijaEn || ''); setNovaCena(paket.cena || '49.99'); setNoviOpisEn(paket.opisEn || ''); setPreviewUrl(paket.previewUrl || ''); setZipLink(paket.zipLink || ''); setIsFree(paket.isFree || false); setPrimeriUrls(paket.primeri || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const stoziEdit = () => { setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); setNoviFormat('150MP STANDARD DEVICE MOCKUPS'); setNovaKategorijaEn(''); setNovaCena('49.99'); setPreviewUrl(''); setZipLink(''); setIsFree(false); setPrimeriUrls([]); };
  const obrisiPaket = async (id) => { if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_standard_mockups", id)); fetchPaketi(); } };
  const getGlobalCena = (cena) => { const numCena = parseFloat(cena); return isNaN(numCena) ? "0.00" : numCena.toFixed(2); };

  // 🔥 FILTERI ZA SVIH 5 TABA 🔥
  const ultra150Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP STANDARD DEVICE MOCKUPS'));
  const ultra150_2Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP PREMIUM DEVICE MOCKUPS'));
  const ultra150_3Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP BILLBOARD MOCKUPS'));
  const ultra150_4Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP WALL MOCKUPS'));
  const ultra150_5Paketi = paketi.filter(p => (p.format || "").toUpperCase().includes('150MP EXECUTIVE PLAQUES'));

  const renderV8Manifest = () => {
    let title = "V10 MOCKUP ENGINE";
    let subtitleClass = "text-amber-500";
    let borderClass = "border-amber-500/20";
    let glowClass = "shadow-[0_0_15px_rgba(245,158,11,0.1)] border-amber-500/50";
    let primaryText = "text-amber-400";
    let secondaryText = "text-amber-500";
    let dropShadow = "drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]";

    if (activeTab === 'ultra2') {
        title = "V10 LUXURY ENGINE"; subtitleClass = "text-red-500"; borderClass = "border-red-500/20";
        glowClass = "shadow-[0_0_15px_rgba(239,68,68,0.1)] border-red-500/50"; primaryText = "text-orange-400";
        secondaryText = "text-red-500"; dropShadow = "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    } else if (activeTab === 'ultra3') {
        title = "V10 BILLBOARD ENGINE"; subtitleClass = "text-emerald-500"; borderClass = "border-emerald-500/20";
        glowClass = "shadow-[0_0_15px_rgba(16,185,129,0.1)] border-emerald-500/50"; primaryText = "text-green-400";
        secondaryText = "text-emerald-500"; dropShadow = "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]";
    } else if (activeTab === 'ultra4') {
        title = "V10 ARCHITECTURAL ENGINE"; subtitleClass = "text-blue-500"; borderClass = "border-blue-500/20";
        glowClass = "shadow-[0_0_15px_rgba(59,130,246,0.1)] border-blue-500/50"; primaryText = "text-cyan-400";
        secondaryText = "text-blue-500"; dropShadow = "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]";
    } else if (activeTab === 'ultra5') {
        title = "V10 EXECUTIVE ENGINE"; subtitleClass = "text-violet-500"; borderClass = "border-violet-500/20";
        glowClass = "shadow-[0_0_15px_rgba(139,92,246,0.1)] border-violet-500/50"; primaryText = "text-fuchsia-400";
        secondaryText = "text-violet-500"; dropShadow = "drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]";
    }

    const rezolucija = "150MP";
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
      <div className={`w-full max-w-[1200px] mx-auto mb-12 bg-black/40 border rounded-[2rem] p-8 md:p-10 transition-colors duration-500 ${borderClass}`}>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">{title}</h2>
          <p className={`text-[12px] md:text-[14px] font-bold uppercase tracking-[0.3em] mt-3 italic transition-colors duration-500 ${subtitleClass}`}>Technical Specifications</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {specifikacije.map((item, i) => {
            const isOpen = otvoreniOpisi.includes(i);
            return (
              <div key={i} onClick={() => {
                  setOtvoreniOpisi(prev => {
                      const isNowOpen = !prev.includes(i);
                      if (isNowOpen) { trackV8Action('manifest_read', { event_category: 'Engagement', event_label: item.t }); }
                      return isNowOpen ? [...prev, i] : prev.filter(x => x !== i);
                  });
                }}
                className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${isOpen ? glowClass : 'border-white/5 hover:border-white/20'}`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? primaryText : secondaryText}`}>
                      <span className={`text-lg transition-colors duration-300 ${isOpen ? primaryText : secondaryText}`}>💎</span> {item.t}
                    </h4>
                    <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-400'}`}>{item.d}</p>
                  </div>
                  <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? `rotate-180 ${primaryText} ${dropShadow}` : `${secondaryText} ${dropShadow}`}`}>▼</div>
                </div>
                <div className={`grid transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100 filter-none' : 'grid-rows-[0fr] opacity-0 blur-sm'}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 border-t border-white/10">
                      <p className={`text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 pl-3 transition-colors duration-500 ${secondaryText.replace('text-', 'border-')}`}>
                        <span className={`font-bold transition-colors duration-500 ${primaryText}`}>Tech Insight:</span> {item.insight}
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

  // 🔥 NOVO: KARTICA ZA OPIS EXECUTIVE BUNDLE-A (SAMO ZA ULTRA 5) 🔥
  const renderV10ExecutiveBundle = () => {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1200px] mx-auto mb-12 bg-[#050914] border border-blue-900/40 rounded-[2rem] shadow-[0_0_60px_rgba(29,78,216,0.15)] overflow-hidden font-sans flex flex-col md:flex-row"
      >
        {/* LEVA KOLONA: Vizuelni prikaz i Formati */}
        <div className="w-full md:w-[35%] bg-[#080d1a] border-b md:border-b-0 md:border-r border-blue-900/40 p-6 md:p-8 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.4)] mb-6 border border-violet-400/50">
              <Diamond className="text-white w-7 h-7" strokeWidth={2} />
            </div>
            
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest leading-tight mb-2">
              V10 Executive Plaques Bundle
            </h2>
            <p className="text-fuchsia-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-8">
              The Pinnacle of 150MP Resolution
            </p>

            <div className="space-y-3">
              <p className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-3">Format Collection</p>
              
              <div className="flex items-center gap-3 bg-[#050914] border border-blue-900/30 p-3 rounded-xl shadow-inner">
                <Monitor className="text-blue-500 w-5 h-5" />
                <div>
                  <p className="text-white text-xs font-bold tracking-wider">5 FILES IN 16:9</p>
                  <p className="text-zinc-500 text-[10px]">Premium Horizontal Displays</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DESNA KOLONA: Glavni tekst i Specifikacije */}
        <div className="w-full md:w-[65%] p-6 md:p-8 flex flex-col justify-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/20 border border-blue-500/30 w-fit mb-6">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase">High-End Corporate Showcase</span>
          </div>

          <p className="text-zinc-300 text-[13px] md:text-sm leading-relaxed mb-6 font-medium text-justify">
            <strong className="text-white">V10 EXECUTIVE PLAQUES BUNDLE: THE PINNACLE OF 150MP RESOLUTION FOR HIGH-END CORPORATE SHOWCASES.</strong> INCLUDES A CURATED 5-FILE COLLECTION IN 16:9 OF PRESTIGIOUS AWARDS & PLAQUES. Processed through the V10 Master Engine utilizing precision LANCZOS interpolation. Includes advanced UnsharpMask micro-contrast, custom NumPy matrix processing for flawless glass/metal reflections, and deep shadow profiling. Strict sRGB ICC profile embedding. Perfect for enterprise achievements, premium certifications, and executive portfolio showcases. Zero text, watermarks, or logos. INCLUDES FULL COMMERCIAL RIGHTS LICENSE AND 100% IP-SAFE METADATA CLEANUP. Fully production-ready.
          </p>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/50 to-transparent my-6"></div>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-white text-xs md:text-sm font-bold tracking-wide">
                5 premium 150MP executive plaque renders
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-white text-xs md:text-sm font-bold tracking-wide">
                Corporate & Executive Environments engineered for prestige
              </span>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3 h-3 text-blue-400" />
              </div>
              <span className="text-white text-xs md:text-sm font-bold tracking-wide">
                Full premium design toolkit (Web, Portfolios, Investor Decks)
              </span>
            </li>
          </ul>
        </div>
      </motion.div>
    );
  };

  // 🔥 JEDINA I PRAVA FUNKCIJA KOJA DIREKTNO CRTA KARTICE ZA SVIH 5 TABA 🔥
  const renderV10Cards = (paketiZaRender, tabId) => {
    if (!paketiZaRender || paketiZaRender.length === 0) {
      return <div className="w-full text-center py-20 text-zinc-500 font-black uppercase tracking-widest">Awaiting Assets. Radar is clear.</div>;
    }

    let mainColorClass = "text-amber-500";
    let borderClass = "border-amber-500/20";
    let hoverShadow = "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]";
    let cardShadow = "shadow-[0_0_30px_rgba(245,158,11,0.05)]";
    let gradientBg = "bg-gradient-to-r from-amber-600 to-orange-500";
    let btnBg = "bg-gradient-to-r from-amber-600 to-orange-500 text-black";
    let badgeText = "150MP ULTRA";
    let hoverBorder = "hover:border-amber-500/50";
    
    if (tabId === 'ultra1') {
        mainColorClass = "text-purple-400";
        borderClass = "border-purple-500/20";
        hoverShadow = "hover:shadow-[0_0_40px_rgba(168,85,247,0.15)]";
        cardShadow = "shadow-[0_0_30px_rgba(168,85,247,0.05)]";
        gradientBg = "bg-gradient-to-r from-purple-600 to-pink-500";
        btnBg = "bg-gradient-to-r from-purple-600 to-pink-500 text-white";
        badgeText = "150MP ULTRA PRINT";
        hoverBorder = "hover:border-purple-500/50";
    } else if (tabId === 'ultra2') {
        mainColorClass = "text-red-400";
        borderClass = "border-red-500/20";
        hoverShadow = "hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]";
        cardShadow = "shadow-[0_0_30px_rgba(239,68,68,0.05)]";
        gradientBg = "bg-gradient-to-r from-red-600 to-orange-600";
        btnBg = "bg-gradient-to-r from-red-600 to-orange-600 text-white";
        badgeText = "150MP LUXURY";
        hoverBorder = "hover:border-red-500/50";
    } else if (tabId === 'ultra3') {
        mainColorClass = "text-emerald-400";
        borderClass = "border-emerald-500/20";
        hoverShadow = "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]";
        cardShadow = "shadow-[0_0_30px_rgba(16,185,129,0.05)]";
        gradientBg = "bg-gradient-to-r from-emerald-500 to-teal-400";
        btnBg = "bg-gradient-to-r from-emerald-500 to-teal-400 text-white";
        badgeText = "150MP BILLBOARD";
        hoverBorder = "hover:border-emerald-500/50";
    } else if (tabId === 'ultra4') {
        mainColorClass = "text-blue-400";
        borderClass = "border-blue-500/20";
        hoverShadow = "hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]";
        cardShadow = "shadow-[0_0_30px_rgba(59,130,246,0.05)]";
        gradientBg = "bg-gradient-to-r from-blue-600 to-cyan-500";
        btnBg = "bg-gradient-to-r from-blue-600 to-cyan-500 text-white";
        badgeText = "150MP ARCHITECTURE";
        hoverBorder = "hover:border-blue-500/50";
    } else if (tabId === 'ultra5') {
        mainColorClass = "text-violet-400";
        borderClass = "border-violet-500/20";
        hoverShadow = "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]";
        cardShadow = "shadow-[0_0_30px_rgba(139,92,246,0.05)]";
        gradientBg = "bg-gradient-to-r from-violet-600 to-fuchsia-500";
        btnBg = "bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white";
        badgeText = "150MP EXECUTIVE";
        hoverBorder = "hover:border-violet-500/50";
    }

    return (
      <>
        {paketiZaRender.map((paket) => {
          const isOwned = kupljeniPaketiIds?.includes(paket.id) || paket.isFree || parseFloat(paket.cena) === 0;

          return (
            <div key={paket.id} className={`bg-[#0a0a0a] rounded-[2.5rem] border ${borderClass} overflow-hidden ${cardShadow} ${hoverShadow} transition-all flex flex-col relative w-full lg:w-[calc(50%-1.5rem)]`}>
              
              <div className="p-4 md:p-5 relative">
                {paket.volume && (
                  <div className={`absolute top-8 left-8 z-10 ${gradientBg} ${tabId === 'ultra1' ? 'text-white' : 'text-black'} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg`}>
                    {paket.volume}
                  </div>
                )}
                <div className="absolute top-8 right-8 z-10 flex flex-col items-end gap-2">
                    <div className={`${gradientBg} ${tabId === 'ultra1' ? 'text-white' : 'text-black'} text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg`}>
                      {badgeText}
                    </div>
                    {paket.kategorijaEn && (
                      <div className={`bg-black/80 backdrop-blur-md border ${borderClass} ${mainColorClass} text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full`}>
                        {paket.kategorijaEn}
                      </div>
                    )}
                </div>

                {/* 🔥 GLAVNA SLIKA SA TAJMING NARANDŽASTOM MUNJOM 🔥 */}
                <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer relative group border border-white/5" onClick={() => setFullScreenImageUrl(paket.previewUrl)}>
                    <motion.img 
                      src={paket.previewUrl} 
                      alt={paket.nazivEn} 
                      className="w-full h-full object-cover transform-gpu" 
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Hover munja */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                      <Zap className="text-[#FF8C00] w-12 h-12 drop-shadow-[0_0_15px_rgba(255,140,0,0.8)]" />
                    </div>

                    {/* Vremenska narandžasta munja (pulsira i treperi povremeno) */}
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
                       <Zap className="text-[#FF8C00] w-20 h-20 drop-shadow-[0_0_50px_rgba(255,140,0,1)]" fill="rgba(255,140,0,0.3)" strokeWidth={1} />
                    </motion.div>
                </div>

                {/* 🔥 GALERIJA MALIH SLIKA (10 KOMADA - SVETLIJE, RAZMAK I PULSIRANJE NA SLICI) 🔥 */}
                {paket.primeri && paket.primeri.length > 0 && (
                  <div className="grid grid-cols-5 gap-4 md:gap-6 mt-6">
                    {paket.primeri.slice(0, 10).map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        onClick={(e) => { e.stopPropagation(); setFullScreenImageUrl(imgUrl); }}
                        className={`relative cursor-zoom-in group rounded-xl overflow-hidden border border-white/10 ${hoverBorder} transition-all duration-300 aspect-video bg-[#050505] shadow-lg`}
                      >
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                        <motion.img 
                          src={imgUrl} 
                          alt={`Preview ${idx + 1}`} 
                          className="w-full h-full object-cover transform-gpu" 
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 4 + (idx * 0.5), repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 pt-2 flex flex-col flex-grow">
                <h3 className="text-xl md:text-[22px] leading-tight font-black uppercase text-white mb-5 tracking-widest flex items-start gap-3">
                    <Aperture className={`${mainColorClass} shrink-0 mt-0.5`} size={24} />
                    <span>{paket.nazivEn}</span>
                </h3>

                <div className={`bg-white/5 border ${borderClass} rounded-xl p-3 mb-3 flex items-center gap-2`}>
                    <Aperture size={14} className={`${mainColorClass} shrink-0`} />
                    <span className={`text-[9px] md:text-[10px] ${mainColorClass} font-black uppercase tracking-widest`}>150 MEGAPIXELS (V10 ENGINE)</span>
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
                      <p className={`text-3xl md:text-4xl font-black ${mainColorClass} drop-shadow-md`}>${getGlobalCena(paket.cena)}</p>
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
                          : btnBg
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
          );
        })}
      </>
    );
  };

  // 🔥 DINAMIČKI HELMET (SEO) 🔥
  let seoTitle = "Standard Mockups | V8 UI Visuals";
  let seoDesc = "Browse the elite AI standard mockups marketplace.";

  if (activeTab === 'ultra1') {
    seoTitle = "Standard Device Mockups | V10 Engine";
    seoDesc = "150MP Standard Device Mockups for elite B2B presentations and SaaS marketing.";
  } else if (activeTab === 'ultra2') {
    seoTitle = "Premium Luxury Mockups | V10 Engine";
    seoDesc = "150MP Luxury Mockups for high-end enterprise showcases and visionary design studios.";
  } else if (activeTab === 'ultra3') {
    seoTitle = "Billboard Mockups | V10 Engine";
    seoDesc = "150MP Billboard Mockups for mega-scale out-of-home advertising campaigns.";
  } else if (activeTab === 'ultra4') {
    seoTitle = "Architectural Wall Mockups | V10 Engine";
    seoDesc = "150MP Architectural Wall Mockups for gallery displays and premium indoor branding.";
  } else if (activeTab === 'ultra5') {
    seoTitle = "Executive Plaques | V10 Engine";
    seoDesc = "150MP Executive Plaques for corporate achievements and prestigious portfolio showcases.";
  }

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative transition-all duration-1000 ease-in-out">
      <style>{`
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .v10-ultra-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; width: 100% !important; max-width: 800px !important; height: auto !important; display: flex; flex-direction: column; }
        @media (min-width: 1024px) { .v10-ultra-card { flex: 0 0 calc(50% - 1.5rem) !important; } }
        .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; flex-grow: 1; }
        .v8-card-content > div:first-child { height: 480px !important; background: #050505; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 1.9rem 1.9rem 0 0; }
        .v8-card-content > div:first-child img { height: 100% !important; max-height: 480px !important; width: 100% !important; object-fit: cover !important; }
        .v8-card-content div.grid { align-items: stretch; }
        .v8-card-content div.grid > div { height: 100%; }
        .v8-card-content div.grid img { height: 100% !important; min-height: 160px !important; width: 100% !important; object-fit: cover !important; background-color: transparent !important; border-radius: 0.75rem !important; border: 1px solid rgba(255,255,255,0.1); padding: 0 !important; display: block; }
        .v10-ultra-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #f59e0b 70%, #fbbf24 85%, #f59e0b 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
      `}</style>

      {/* 🔥 DINAMIČKI HELMET 🔥 */}
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
      </Helmet>

      {/* 🌟 POZADINE DINAMIČKE (5 TABA) 🌟 */}
      {activeTab === 'ultra1' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/vertical_prvo_dugme..mp4" />)}
      {activeTab === 'ultra2' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/vertical_drugo_dugme.mp4" />)}
      {activeTab === 'ultra3' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/vertical_trece_dugme.mp4" />)}
      {activeTab === 'ultra4' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/vertical_cetvrto_dugme.mp4" />)}
      {activeTab === 'ultra5' && (<video autoPlay loop muted playsInline className="fixed inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 opacity-40" src="/VERTIKAL_GLASS.mp4" />)}

      <div className="fixed inset-0 bg-[#050505]/60 z-0 pointer-events-none"></div>

      <div className="relative z-10 pt-32 pb-24 px-6">
        <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
        <LoginRequiredModal isOpen={loginRequiredData.isOpen} onClose={() => setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 })} packageName={loginRequiredData.name} price={loginRequiredData.price} onLoginSuccess={async (user) => { if (loginRequiredData.paket) await otvoriCheckoutIliPaddle(user, loginRequiredData.paket); setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 }); }} />
        
        {/* 🔥 KASA SA DINAMIČKIM PAKETOM 🔥 */}
        <AnimatePresence>
           {checkoutData.isOpen && (
             <V8SecureCheckout 
               isOpen={checkoutData.isOpen} 
               onClose={() => setCheckoutData({ isOpen: false, id: '', name: '', price: 0, link: '', desc: '' })} 
               productName={checkoutData.name} 
               zipLink={checkoutData.link}
               availableTiers={[
                 {
                   id: checkoutData.id || 'single_mockup',
                   name: checkoutData.name,
                   desc: checkoutData.desc || 'Full Commercial License & IP-Safe Cleanup',
                   price: checkoutData.price,
                   isMonthly: false
                 }
               ]}
             />
           )}
        </AnimatePresence>

        <div className="max-w-[1800px] mx-auto w-full">
          
          {/* 🔥 STRELICA ZA POVRATAK NAZAD 🔥 */}
          <div className="w-full flex justify-start mb-6 px-2">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center justify-center bg-[#0a0a0a]/80 hover:bg-[#FF8C00] text-zinc-400 hover:text-black border border-white/10 hover:border-[#FF8C00] p-3 rounded-full transition-all shadow-lg hover:scale-105"
              title="Go Back"
            >
              <ArrowLeft size={20} strokeWidth={3} />
            </button>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative w-full mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]">
              
              {/* 🔥 HORIZONTALNI VIDEI ZA 5 TABA 🔥 */}
              {activeTab === 'ultra1' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000" src="/horizontal_prvi_box.mp4" />)}
              {activeTab === 'ultra2' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000" src="/horizontal_drugi_box.mp4" />)}
              {activeTab === 'ultra3' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000" src="/horizontal_treci_box.mp4" />)}
              {activeTab === 'ultra4' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000" src="/horizontal_cetvrti_box.mp4" />)}
              {activeTab === 'ultra5' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 transition-opacity duration-1000" src="/HORIZONTAL_GLASS.mp4" />)}

              <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>
              
              <div className="relative z-10 text-center py-20 px-6">
                  {/* 🔥 NASLOVI ZA 5 TABA 🔥 */}
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all">
                      {activeTab === 'ultra1' && (<>V10 150MP ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 drop-shadow-none">COLLECTION OF PREMIUM MOCKUPS</span></>)}
                      {activeTab === 'ultra2' && (<>V10 150MP ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600 drop-shadow-none">COLLECTION OF LUXURY MOCKUPS</span></>)}
                      {activeTab === 'ultra3' && (<>V10 150MP ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500 drop-shadow-none">COLLECTION OF BILLBOARD MOCKUPS</span></>)}
                      {activeTab === 'ultra4' && (<>V10 150MP ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 drop-shadow-none">COLLECTION OF WALL MOCKUPS</span></>)}
                      {activeTab === 'ultra5' && (<>V10 150MP ULTRA <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 drop-shadow-none">COLLECTION OF EXECUTIVE PLAQUES</span></>)}
                  </h1>
                 <p className="text-zinc-200 font-bold uppercase tracking-[0.2em] text-[10px] md:text-[12px] max-w-4xl mx-auto leading-relaxed mb-10 drop-shadow-lg bg-black/30 p-4 rounded-lg backdrop-blur-sm transition-all">
                  {activeTab === 'ultra1' && "THE ABSOLUTE PINNACLE OF VISUAL ENGINEERING. 150 MEGAPIXELS OF FLAWLESS, CINEMATIC REALITY—CRAFTED STRICTLY FOR ELITE B2B PRESENTATIONS, HIGH-TICKET SAAS MARKETING, AND PIXEL-PERFECT EXTREME CROPPING."}
                  {activeTab === 'ultra2' && "THE APEX OF DIGITAL PRESTIGE. 150 MEGAPIXELS OF UNCOMPROMISING, PHOTOREALISTIC LUXURY—METICULOUSLY CRAFTED FOR HIGH-END BRANDING, ENTERPRISE SHOWCASES, AND VISIONARY DESIGN STUDIOS DEMANDING ABSOLUTE PERFECTION."}
                  {activeTab === 'ultra3' && "THE ULTIMATE OUT-OF-HOME PRESTIGE. 150 MEGAPIXELS OF FLAWLESS OUTDOOR REALITY—ENGINEERED FOR MEGA-SCALE CAMPAIGNS, URBAN BILLBOARDS, AND ELITE ADVERTISING AGENCIES."}
                  {activeTab === 'ultra4' && "THE APEX OF INTERIOR SHOWCASING. 150 MEGAPIXELS OF ARCHITECTURAL PERFECTION—CRAFTED FOR GALLERY DISPLAYS, MUSEUM EXHIBITIONS, AND PREMIUM INDOOR BRANDING."}
                  {activeTab === 'ultra5' && "THE PINNACLE OF CORPORATE PRESTIGE. 150 MEGAPIXELS OF LUXURY AWARD SHOWCASES—CRAFTED STRICTLY FOR EXECUTIVE PORTFOLIOS, ENTERPRISE ACHIEVEMENTS, AND ELITE BRAND RECOGNITION."}
                 </p>
                  
                  {/* 🔥 DUGMIĆI ZA 5 TABA 🔥 */}
                  <div className="flex justify-center relative z-10 mt-10">
                      <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 p-3 rounded-[2rem] inline-flex flex-wrap items-center justify-center shadow-xl gap-4 md:gap-6 max-w-6xl mx-auto">
                          
                          <button onClick={() => setActiveTab('ultra1')} className={`px-5 py-4 md:px-6 md:py-4 rounded-full font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 drop-shadow-[0_3px_5px_rgba(0,0,0,1)] ${activeTab === 'ultra1' ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.5)] border-2 border-amber-300 scale-105' : 'text-zinc-400 bg-black/60 hover:bg-[#1a0d00] hover:text-amber-500 border border-white/20 hover:border-amber-500/50'}`}>
                            <Briefcase className="w-4 h-4 md:w-5 md:h-5" /> STANDARD DEVICE
                          </button>
                          
                          <button onClick={() => setActiveTab('ultra2')} className={`px-5 py-4 md:px-6 md:py-4 rounded-full font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 drop-shadow-[0_3px_5px_rgba(0,0,0,1)] ${activeTab === 'ultra2' ? 'bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.8)] border-2 border-red-400 scale-105' : 'text-zinc-400 bg-black/60 hover:bg-red-900/30 hover:text-white border border-white/20 hover:border-red-500/50'}`}>
                            <Crown className="w-4 h-4 md:w-5 md:h-5" /> PREMIUM DEVICE
                          </button>

                          <button onClick={() => setActiveTab('ultra3')} className={`px-5 py-4 md:px-6 md:py-4 rounded-full font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 drop-shadow-[0_3px_5px_rgba(0,0,0,1)] ${activeTab === 'ultra3' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-emerald-400 scale-105' : 'text-zinc-400 bg-black/60 hover:bg-emerald-900/30 hover:text-white border border-white/20 hover:border-emerald-500/50'}`}>
                            <Monitor className="w-4 h-4 md:w-5 md:h-5" /> BILLBOARD MOCKUP
                          </button>

                          <button onClick={() => setActiveTab('ultra4')} className={`px-5 py-4 md:px-6 md:py-4 rounded-full font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 drop-shadow-[0_3px_5px_rgba(0,0,0,1)] ${activeTab === 'ultra4' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_25px_rgba(59,130,246,0.8)] border-2 border-blue-400 scale-105' : 'text-zinc-400 bg-black/60 hover:bg-blue-900/30 hover:text-white border border-white/20 hover:border-blue-500/50'}`}>
                            <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" /> WALL MOCKUP
                          </button>

                          {/* 🔥 NOVO: EXECUTIVE PLAQUES DUGME 🔥 */}
                          <button onClick={() => setActiveTab('ultra5')} className={`px-5 py-4 md:px-6 md:py-4 rounded-full font-black text-[11px] md:text-[13px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 drop-shadow-[0_3px_5px_rgba(0,0,0,1)] ${activeTab === 'ultra5' ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white shadow-[0_0_25px_rgba(139,92,246,0.8)] border-2 border-violet-400 scale-105' : 'text-zinc-400 bg-black/60 hover:bg-violet-900/30 hover:text-white border border-white/20 hover:border-violet-500/50'}`}>
                            <Award className="w-4 h-4 md:w-5 md:h-5" /> EXECUTIVE PLAQUES
                          </button>
                      
                      </div>
                  </div>
              </div>
          </motion.div>

          {/* 🔥 3 SLIKE (MOCKUP GRID) - VIDLJIVO SAMO NA ULTRA 1 TABU 🔥 */}
          {activeTab === 'ultra1' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 lg:px-0">
              {[
                { src: "/mocup_11.webp", alt: "Mockup 1", badge: "MULTI-DEVICE ECOSYSTEM", colorClass: "border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]" },
                { src: "/mocup_22.webp", alt: "Mockup 2", badge: "CINEMATIC ENVIRONMENT", colorClass: "border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" },
                { src: "/mocup_33.webp", alt: "Mockup 3", badge: "150MP MACRO DETAIL", colorClass: "border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" }
              ].map((img, idx) => (
                <div key={idx} onClick={() => setFullScreenImageUrl(img.src)} className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-amber-500/50 transition-all duration-500 cursor-zoom-in group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] bg-[#111]">
                  <div className={`absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border px-3 py-1.5 rounded-lg ${img.colorClass} group-hover:scale-105 transition-transform duration-300`}><span className="text-[9px] font-black uppercase tracking-widest drop-shadow-md">{img.badge}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[16/9] object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 🔥 3 SLIKE (PREMIUM GRID) - VIDLJIVO SAMO NA ULTRA 2 TABU 🔥 */}
          {activeTab === 'ultra2' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 lg:px-0">
              {[
                { src: "/premium_1.webp", alt: "Premium 1", badge: "EXECUTIVE RETAIL", colorClass: "border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]" },
                { src: "/premium_2.webp", alt: "Premium 2", badge: "ENTERPRISE SHOWCASE", colorClass: "border-orange-500/40 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]" },
                { src: "/premium_3.webp", alt: "Premium 3", badge: "PREMIUM CLOSE-UP", colorClass: "border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]" }
              ].map((img, idx) => (
                <div key={idx} onClick={() => setFullScreenImageUrl(img.src)} className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-500 cursor-zoom-in group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] bg-[#111]">
                  <div className={`absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border px-3 py-1.5 rounded-lg ${img.colorClass} group-hover:scale-105 transition-transform duration-300`}><span className="text-[9px] font-black uppercase tracking-widest drop-shadow-md">{img.badge}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[16/9] object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 🔥 3 SLIKE (BILLBOARD GRID) - VIDLJIVO SAMO NA ULTRA 3 TABU 🔥 */}
          {activeTab === 'ultra3' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 lg:px-0">
              {[
                { src: "/bil_1.webp", alt: "Billboard 1", badge: "URBAN STREET", colorClass: "border-emerald-500/40 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]" },
                { src: "/bil_2.webp", alt: "Billboard 2", badge: "CORPORATE PLAZA", colorClass: "border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]" },
                { src: "/bil_3.webp", alt: "Billboard 3", badge: "PREMIUM LOBBY", colorClass: "border-teal-500/40 text-teal-400 shadow-[0_0_15px_rgba(20,184,166,0.2)]" }
              ].map((img, idx) => (
                <div key={idx} onClick={() => setFullScreenImageUrl(img.src)} className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all duration-500 cursor-zoom-in group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-[#111]">
                  <div className={`absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border px-3 py-1.5 rounded-lg ${img.colorClass} group-hover:scale-105 transition-transform duration-300`}><span className="text-[9px] font-black uppercase tracking-widest drop-shadow-md">{img.badge}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[16/9] object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 🔥 3 SLIKE (WALL GRID) - VIDLJIVO SAMO NA ULTRA 4 TABU 🔥 */}
          {activeTab === 'ultra4' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 lg:px-0">
              {[
                { src: "/wall_1.webp", alt: "Wall 1", badge: "LUXURY RETAIL", colorClass: "border-blue-500/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
                { src: "/wall_2.webp", alt: "Wall 2", badge: "BOUTIQUE EXTERIOR", colorClass: "border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]" },
                { src: "/wall_3.webp", alt: "Wall 3", badge: "WATERFRONT PLAZA", colorClass: "border-indigo-500/40 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]" }
              ].map((img, idx) => (
                <div key={idx} onClick={() => setFullScreenImageUrl(img.src)} className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all duration-500 cursor-zoom-in group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-[#111]">
                  <div className={`absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border px-3 py-1.5 rounded-lg ${img.colorClass} group-hover:scale-105 transition-transform duration-300`}><span className="text-[9px] font-black uppercase tracking-widest drop-shadow-md">{img.badge}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[16/9] object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 🔥 3 SLIKE (EXECUTIVE GRID) - VIDLJIVO SAMO NA ULTRA 5 TABU 🔥 */}
          {activeTab === 'ultra5' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 px-4 lg:px-0">
              {[
                { src: "/glass_1.webp", alt: "Plaque 1", badge: "CORPORATE AWARD", colorClass: "border-violet-500/40 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.2)]" },
                { src: "/glass_2.png", alt: "Plaque 2", badge: "EXECUTIVE DESK", colorClass: "border-fuchsia-500/40 text-fuchsia-400 shadow-[0_0_15px_rgba(217,70,239,0.2)]" },
                { src: "/glass_3 (1).webp", alt: "Plaque 3", badge: "PREMIUM RECOGNITION", colorClass: "border-purple-500/40 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]" }
              ].map((img, idx) => (
                <div key={idx} onClick={() => setFullScreenImageUrl(img.src)} className="relative rounded-3xl overflow-hidden border border-white/10 hover:border-violet-500/50 transition-all duration-500 cursor-zoom-in group shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] bg-[#111]">
                  <div className={`absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md border px-3 py-1.5 rounded-lg ${img.colorClass} group-hover:scale-105 transition-transform duration-300`}><span className="text-[9px] font-black uppercase tracking-widest drop-shadow-md">{img.badge}</span></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                  <img src={img.src} alt={img.alt} className="w-full aspect-[16/9] object-cover transform-gpu group-hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </motion.div>
          )}

          {/* 🔥 ADMIN FORMA ZA DODAVANJE MOCKUPOVA 🔥 */}
          {isAdmin && (
            <form onSubmit={dodajPaket} className="bg-[#0a0a0a] border-2 border-[#FF8C00]/50 rounded-[2.5rem] p-8 mb-16 shadow-[0_0_30px_rgba(255,140,0,0.1)] max-w-5xl mx-auto">
              <h2 className="text-xl font-black text-[#FF8C00] uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-[#FF8C00]/20 pb-4">
                <Zap className="w-6 h-6" /> {editingPaketId ? 'EDIT PACKAGE' : 'ADD NEW ZIP PACKAGE'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Type size={14} /> PACKAGE TITLE</label>
                      <input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Roman History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Layers size={14} /> CATEGORY</label>
                      <input type="text" value={novaKategorijaEn} onChange={(e)=>setNovaKategorijaEn(e.target.value)} placeholder="E.g. Abstract" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FolderArchive size={14} /> COLLECTION (VOLUME)</label>
                      <input type="text" placeholder="E.g. VOL 1" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-black text-white border border-white/10 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" />
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FileText size={14} /> DESCRIPTION</label>
                    <textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={8} className="bg-black border border-white/10 p-4 rounded-xl text-[12px] font-bold text-white w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full whitespace-pre-wrap" required />
                </div>

                <div className="flex flex-col gap-6 md:col-span-2">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Wallet size={14} /> PRICE (USD)</label>
                        <input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} disabled={isFree} placeholder="E.g. 49.99" className={`bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold outline-none focus:border-[#FF8C00] transition-all ${isFree ? 'text-zinc-500 border-zinc-800' : 'text-white'}`} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><MonitorPlay size={14} /> FORMAT</label>
                        {/* 🔥 SVIH 5 OPCIJA U ADMIN PANELU ZA FORMAT 🔥 */}
                        <div className="flex flex-wrap gap-2">
                            {['150MP STANDARD DEVICE MOCKUPS', '150MP PREMIUM DEVICE MOCKUPS', '150MP BILLBOARD MOCKUPS', '150MP WALL MOCKUPS', '150MP EXECUTIVE PLAQUES'].map((fmt) => {
                                let styleClass = 'bg-black border-white/10 text-zinc-500 hover:border-[#FF8C00]/50';
                                if (noviFormat === fmt) {
                                    if (fmt.includes('STANDARD')) styleClass = 'bg-gradient-to-r from-orange-600 to-amber-500 border-[#FF8C00] text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]';
                                    else if (fmt.includes('PREMIUM')) styleClass = 'bg-gradient-to-r from-red-600 to-orange-600 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]';
                                    else if (fmt.includes('BILLBOARD')) styleClass = 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]';
                                    else if (fmt.includes('WALL')) styleClass = 'bg-gradient-to-r from-blue-600 to-cyan-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]';
                                    else if (fmt.includes('EXECUTIVE')) styleClass = 'bg-gradient-to-r from-violet-600 to-fuchsia-500 border-violet-400 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]';
                                }
                                return (
                                <label key={fmt} className={`cursor-pointer p-2 rounded-xl border-2 transition-all text-center font-black text-[8px] md:text-[9px] uppercase flex items-center justify-center flex-1 min-w-[120px] ${styleClass}`}>
                                    <input type="radio" name="format" value={fmt} checked={noviFormat === fmt} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                    {fmt.replace('150MP ', '')}
                                </label>
                            )})}
                        </div>
                    </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-blue-400 font-black text-[11px] tracking-widest uppercase"><LinkIcon size={14} /> GOOGLE DRIVE (DELIVERY)</label>
                          <input type="url" value={zipLink} onChange={(e)=>setZipLink(e.target.value)} placeholder="https://drive.google.com/..." className="bg-black border border-blue-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-blue-400 transition-all" required />
                      </div>

                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-emerald-400 font-black text-[11px] tracking-widest uppercase"><Zap size={14} /> SECURITY PROTOCOL TYPE</label>
                          <button type="button" onClick={() => { const nextFreeStatus = !isFree; setIsFree(nextFreeStatus); if (nextFreeStatus) setNovaCena("0.00"); else setNovaCena("49.99"); }} className={`w-full p-4 md:p-5 rounded-xl font-black text-[13px] md:text-[15px] tracking-widest uppercase border-2 transition-all text-center flex items-center justify-center gap-2 cursor-pointer drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${isFree ? 'bg-gradient-to-r from-emerald-600 to-green-500 border-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-black border-white/10 text-zinc-400 hover:text-white hover:border-emerald-500/50'}`}>
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
                            <button type="button" onClick={removeMainImage} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md drop-shadow-md"><X size={12} strokeWidth={4} /></button>
                            <img src={previewUrl} alt="Main" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {primeriUrls.map((url, idx) => (
                          <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-white/20 relative group">
                            <span className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 z-10">PREVIEW</span>
                            <button type="button" onClick={() => removeThumbnail(idx)} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md drop-shadow-md"><X size={12} strokeWidth={4} /></button>
                            <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><ImageIcon size={12} /> MAIN IMAGE</label>
                          <button type="button" onClick={() => mainImageRef.current.click()} className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border-2 border-white/20 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[13px] uppercase transition-all flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"> <ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'} </button>
                          <input type="file" ref={mainImageRef} onChange={handleUploadPreview} className="hidden" /> 
                      </div>

                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><Images size={12} /> GALLERY IMAGES</label>
                          <button type="button" onClick={() => galleryImagesRef.current.click()} className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border-2 border-white/20 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[13px] uppercase transition-all flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"> <Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/10)`} </button>
                          <input type="file" multiple ref={galleryImagesRef} onChange={handleUploadPrimeri} className="hidden" /> 
                      </div>

                      <button type="submit" className="ml-auto px-10 py-5 rounded-xl font-black text-[15px] md:text-[17px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-black transition-all shadow-[0_0_30px_rgba(255,140,0,0.8)] flex items-center gap-2 hover:scale-105 drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]"> 
                        <Zap size={20} strokeWidth={3} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'} 
                      </button>
                    </div>
                  </div>
              </div>
            </form>
          )}

          <div className="flex flex-wrap justify-center gap-6 lg:gap-12 w-full mx-auto px-4 lg:px-8">
            {/* 🔥 RENDER ZA SVIH 5 TABA DIREKTNO IZ OVOG FAJLA 🔥 */}
            {activeTab === 'ultra1' && (<> {renderV8Manifest()} {renderV10Cards(ultra150Paketi, 'ultra1')} </>)}
            {activeTab === 'ultra2' && (<> {renderV8Manifest()} {renderV10Cards(ultra150_2Paketi, 'ultra2')} </>)}
            {activeTab === 'ultra3' && (<> {renderV8Manifest()} {renderV10Cards(ultra150_3Paketi, 'ultra3')} </>)}
            {activeTab === 'ultra4' && (<> {renderV8Manifest()} {renderV10Cards(ultra150_4Paketi, 'ultra4')} </>)}
            
            {/* 🔥 BUNDLE INFO KARTICA + PROIZVODI SAMO ZA ULTRA 5 🔥 */}
            {activeTab === 'ultra5' && (<> {renderV8Manifest()} {renderV10ExecutiveBundle()} {renderV10Cards(ultra150_5Paketi, 'ultra5')} </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: StandardMocup