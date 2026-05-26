// POČETAK FAJLA: V8StockBerza.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import { Zap, X, Image as ImageIcon, Images, DownloadCloud, Crown, AlertCircle, Type, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { motion } from 'framer-motion';

// IMPORTUJEMO TVOJA TRI NOVA FAJLA
import V8StandardAssets from './V8StandardAssets';
import V8PremiumAssets from './V8PremiumAssets';
import V8MasterBundles from './V8MasterBundles';

// POČETAK FUNKCIJE: FullScreenLightbox
const FullScreenLightbox = ({ imageUrl, onClose }) => {
    useEffect(() => {
        if (imageUrl) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
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

// POČETAK FUNKCIJE: V8PaymentModal
const V8PaymentModal = ({ paket, onClose, getGlobalCena }) => {
    useEffect(() => {
        if (paket) document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, [paket]);

    if (!paket) return null;
    return createPortal(
        <div className="fixed inset-0 z-[9999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans m-auto">
                <button onClick={onClose} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 font-black"><X size={20} strokeWidth={3} /></button>
                <div className="p-10 flex flex-col items-center">
                    <DownloadCloud className="w-16 h-16 text-orange-500 mb-4" />
                    <h3 className="text-[18px] font-black uppercase tracking-widest text-white text-center">Digital Asset Checkout</h3>
                    <p className="text-[10px] text-orange-400 font-black uppercase mb-8 text-center">{paket.nazivEn}</p>
                    <a href="mailto:aitoolsprosmart@gmail.com" className="bg-white text-black font-black py-3 px-6 rounded-xl w-full text-center uppercase">Request Checkout Link</a>
                </div>
            </div>
        </div>, document.body
    );
};
// KRAJ FUNKCIJE: V8PaymentModal

// Glavna Komponenta
const V8StockBerza = () => {
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]); 
  const [editingPaketId, setEditingPaketId] = useState(null); 
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  
  const [activeTab, setActiveTab] = useState('premium');

  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('16:9, 9:16 & 21:9 (BUNDLE)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('49.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [paddleLink, setPaddleLink] = useState('');

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
          setCurrentUser(user);
          setIsAdmin(user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com");
      } else { setCurrentUser(null); setIsAdmin(false); }
    });
    fetchPaketi();
    return () => unsub();
  }, []);
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  useEffect(() => {
    const checkPendingPurchase = async () => {
      const pendingPaketId = localStorage.getItem('v8_pending_stock_paket_id');
      if (auth.currentUser && pendingPaketId && paketi.length > 0) {
        const trazeniPaket = paketi.find(p => p.id === pendingPaketId);
        localStorage.removeItem('v8_pending_stock_paket_id'); 
        if(trazeniPaket) {
            try {
                await snimiKupcaUBazu(auth.currentUser, trazeniPaket);
                if (trazeniPaket.paddleLink && trazeniPaket.paddleLink.trim() !== "") {
                    window.location.href = trazeniPaket.paddleLink;
                } else setShowPaymentModal(trazeniPaket);
            } catch (err) { console.error(err); }
        }
      }
    };
    const timer = setTimeout(() => { checkPendingPurchase(); }, 1000);
    return () => clearTimeout(timer);
  }, [paketi]);
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  useEffect(() => {
    if (activeTab === 'bundles') setNoviFormat('33.2MP MASTERWORK BUNDLE');
    else setNoviFormat('16:9, 9:16 & 21:9 (BUNDLE)');
  }, [activeTab]);
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  useEffect(() => {
    if (noviFormat === '16:9 ONLY (SINGLE)') { setNoviOpisEn("PACKAGE CONTENTS: PREMIUM AI VISUALS IN ULTRA-WIDE 16:9 ONLY..."); } 
    else if (noviFormat === '16:9, 9:16 & 21:9 (BUNDLE)') { setNoviOpisEn("PACKAGE CONTENTS: PREMIUM AI VISUALS IN 3 FORMATS..."); } 
    else if (noviFormat === 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)') { setNoviOpisEn("PACKAGE CONTENTS: 80 PREMIUM AI VISUALS..."); } 
    else if (noviFormat === '16:9 & 9:16 (33.2MP MASTERWORK)') { setNoviOpisEn("V8 MASTERWORK BUNDLE: COMPLETE COLLECTION OF 20 PREMIUM VISUALS..."); }
    else if (noviFormat === '33.2MP MASTERWORK BUNDLE') { setNoviOpisEn("V8 MASTERWORK BUNDLE: COMPLETE COLLECTION OF 60 PREMIUM VISUALS..."); }
  }, [noviFormat]);
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const fetchPaketi = async () => {
    const q = query(collection(db, "v8_stock_paketi"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const prijavaIKupovina = async (paket) => {
    if (currentUser) {
        snimiKupcaUBazu(currentUser, paket);
        if (paket.paddleLink && paket.paddleLink.trim() !== "") window.location.href = paket.paddleLink;
        else setShowPaymentModal(paket);
    } else {
        try {
            localStorage.setItem('v8_pending_stock_paket_id', paket.id);
            await signOut(auth);
            const v8Provider = new GoogleAuthProvider();
            v8Provider.setCustomParameters({ prompt: 'select_account', login_hint: '' });
            await signInWithPopup(auth, v8Provider);
        } catch (error) { v8Toast.error("Login canceled."); localStorage.removeItem('v8_pending_stock_paket_id'); }
    }
  };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const snimiKupcaUBazu = async (user, paket) => {
      try {
          await addDoc(collection(db, "v8_kupci"), { ime: user.displayName || "Client", email: user.email, uid: user.uid, zeliPaket: paket.nazivEn || "Premium", cenaPaketa: paket.cena, vreme: serverTimestamp(), isPaid: false });
          if (paket.format && paket.format.toUpperCase().includes('MASTERWORK BUNDLE')) {
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
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Image & ZIP needed!"); return; }
    const paketData = { nazivEn: noviNazivEn.trim(), volume: noviVolume, format: noviFormat, kategorijaEn: novaKategorijaEn.trim(), cena: novaCena, tip: noviTip, opisEn: noviOpisEn, previewUrl, zipLink, paddleLink, primeri: primeriUrls, updatedAt: serverTimestamp() };
    try {
        if (editingPaketId) { await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData); v8Toast.success("Updated!"); } 
        else { await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() }); v8Toast.success("Added!"); }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const handleUploadPreview = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      setPreviewUrl(resData.secure_url);
    } catch (err) { v8Toast.error("Upload error!"); } finally { setIsUploading(false); }
  };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    const slobodnaMesta = (activeTab === 'bundles' ? 6 : 4) - primeriUrls.length;
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
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const startEditPaket = (paket) => { setEditingPaketId(paket.id); setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || ''); setNoviFormat(paket.format || '16:9, 9:16 & 21:9 (BUNDLE)'); setNovaKategorijaEn(paket.kategorijaEn || ''); setNovaCena(paket.cena || '49.99'); setNoviOpisEn(paket.opisEn || ''); setPreviewUrl(paket.previewUrl || ''); setZipLink(paket.zipLink || ''); setPaddleLink(paket.paddleLink || ''); setPrimeriUrls(paket.primeri || []); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const stoziEdit = () => { setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); setNoviFormat('16:9, 9:16 & 21:9 (BUNDLE)'); setNovaKategorijaEn(''); setNovaCena('49.99'); setPreviewUrl(''); setZipLink(''); setPaddleLink(''); setPrimeriUrls([]); };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const obrisiPaket = async (id) => { if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); } };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije
  
  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const getGlobalCena = (cena) => { const numCena = parseFloat(cena); return numCena > 500 ? (Math.ceil((numCena / 110) * 1.2) + 0.99).toFixed(2) : numCena.toFixed(2); };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // POČETAK FUNKCIJE: Komentarišem uvek početak funkcije
  const getAspectClass = (format) => { return (!format || format.includes('16:9 ONLY')) ? 'aspect-video' : 'aspect-square'; };
  // KRAJ FUNKCIJE: Komentarišem uvek kraj funkcije

  // FILTRIRANJE PRE NEGO ŠTO POŠALJEMO CHILD KOMPONENTAMA
  const standardPaketi = paketi.filter(p => !(p.format || "").toUpperCase().includes('MASTERWORK'));
  const premiumPaketi = paketi.filter(p => { const formatString = (p.format || "").toUpperCase(); return formatString.includes('MASTERWORK') && !formatString.includes('MASTERWORK BUNDLE'); });
  const bundlePaketi = paketi.filter(p => (p.format || "").toUpperCase().includes('MASTERWORK BUNDLE'));

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pt-32 pb-24 px-6 relative">
      <style>{`
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .v8-premium-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; }
        .v8-premium-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #ea580c 70%, #3b82f6 85%, #ea580c 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
        .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; }
        .v8-bundle-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #3b82f6 70%, #8b5cf6 85%, #3b82f6 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
      `}</style>

      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
      <V8PaymentModal paket={showPaymentModal} onClose={() => setShowPaymentModal(null)} getGlobalCena={getGlobalCena} />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]">
            <div className="absolute inset-0 z-0 bg-cover bg-no-repeat transition-all duration-700" style={{ backgroundImage: activeTab === 'bundles' ? "url('/v8-stock/v8-master-bg.jpg')" : "url('/v8-stock/v8-stock-hero.webp')", backgroundPosition: activeTab === 'bundles' ? "center 25%" : "center", opacity: activeTab === 'bundles' ? 0.95 : 0.7 }}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/70 to-[#050505]"></div>
            <div className="relative z-10 text-center py-20 px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all">
                    {activeTab === 'premium' && (<>V8 33MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-none">MASTERWORK ASSETS</span></>)}
                    {activeTab === 'bundles' && (<>V8 33MP MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-none">STOCK BUNDLES</span></>)}
                    {activeTab === 'standard' && (<>V8 PREMIUM <span className="text-[#FF8C00]">STOCK MARKET</span></>)}
                </h1>
                
                <div className="flex justify-center relative z-10 mt-10">
                    <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-full inline-flex flex-wrap items-center justify-center shadow-xl gap-1">
                        <button onClick={() => setActiveTab('standard')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${activeTab === 'standard' ? 'bg-zinc-800 text-white shadow-md border border-white/10' : 'text-zinc-400 hover:text-white'}`}>Standard Assets</button>
                        <button onClick={() => setActiveTab('premium')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'premium' ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-400 hover:text-orange-500'}`}><Zap className="w-4 h-4" /> V8 Premium</button>
                        <button onClick={() => setActiveTab('bundles')} className={`px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${activeTab === 'bundles' ? 'bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'text-zinc-400 hover:text-blue-400'}`}><Crown className="w-4 h-4" /> V8 Master Bundles</button>
                    </div>
                </div>
            </div>
        </motion.div>

        {isAdmin && (
          <form onSubmit={dodajPaket} className="bg-[#0a0a0a] border-2 border-[#FF8C00]/50 rounded-[2.5rem] p-8 mb-16 shadow-[0_0_30px_rgba(255,140,0,0.1)] max-w-4xl mx-auto">
            <h2 className="text-xl font-black text-[#FF8C00] uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-[#FF8C00]/20 pb-4"><Zap className="w-6 h-6" /> {editingPaketId ? 'EDIT PACKAGE' : 'ADD NEW ZIP PACKAGE'}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Type size={14} /> PACKAGE TITLE</label><input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Roman History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required /></div>
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Layers size={14} /> CATEGORY</label><input type="text" value={novaKategorijaEn} onChange={(e)=>setNovaKategorijaEn(e.target.value)} placeholder="E.g. History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required /></div>
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FolderArchive size={14} /> COLLECTION (VOLUME)</label><input type="text" placeholder="E.g. VOL 1" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-black text-white border border-white/10 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FileText size={14} /> DESCRIPTION</label><textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={4} className="bg-black border border-white/10 p-4 rounded-xl text-[12px] font-bold text-white w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full" required /></div>
              <div className="flex flex-col gap-6 md:col-span-2">
                  <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Wallet size={14} /> PRICE (USD)</label><input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} placeholder="E.g. 49.99" className="bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold text-white outline-none focus:border-[#FF8C00] transition-all" /></div>
                  <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><MonitorPlay size={14} /> FORMAT</label>
                      <select value={noviFormat} onChange={(e) => setNoviFormat(e.target.value)} className="bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold text-white w-full outline-none focus:border-[#FF8C00]">
                          <option value="16:9, 9:16 & 21:9 (BUNDLE)">16:9, 9:16 & 21:9</option>
                          <option value="16:9 ONLY (SINGLE)">16:9 ONLY</option>
                          <option value="ALL FORMATS (16:9, 9:16, 21:9, 1:1)">ALL FORMATS</option>
                          <option value="16:9 & 9:16 (33.2MP MASTERWORK)">33.2MP MASTERWORK SINGLE</option>
                          <option value="33.2MP MASTERWORK BUNDLE">33.2MP MASTERWORK BUNDLE</option>
                      </select>
                  </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-blue-400 font-black text-[11px] tracking-widest uppercase"><LinkIcon size={14} /> GOOGLE DRIVE</label><input type="url" value={zipLink} onChange={(e)=>setZipLink(e.target.value)} placeholder="https://drive.google.com/..." className="bg-black border border-blue-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-blue-400 transition-all" required /></div>
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-yellow-400 font-black text-[11px] tracking-widest uppercase"><Zap size={14} /> PADDLE LINK</label><input type="url" value={paddleLink} onChange={(e)=>setPaddleLink(e.target.value)} placeholder="https://buy.paddle.com/..." className="bg-black border border-yellow-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-yellow-400 transition-all" /></div>
                </div>

                <div className="flex flex-wrap gap-4 items-end mt-4">
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><ImageIcon size={12} /> MAIN IMAGE</label><label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black font-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl text-[11px] uppercase cursor-pointer flex items-center gap-2"><ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'}<input type="file" onChange={handleUploadPreview} className="hidden" /></label></div>
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><Images size={12} /> GALLERY</label><label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black font-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl text-[11px] uppercase cursor-pointer flex items-center gap-2"><Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/6)`}<input type="file" multiple onChange={handleUploadPrimeri} className="hidden" /></label></div>
                    <button type="submit" className="ml-auto px-8 py-4 rounded-xl font-black text-[13px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-black flex items-center gap-2"><Zap size={18} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'}</button>
                </div>
            </div>
          </form>
        )}

        {/* OVDE SE RENDERUJU KOMPONENTE NA OSNOVU TABA */}
        <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
          {activeTab === 'standard' && (
              <V8StandardAssets paketi={standardPaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} />
          )}
          {activeTab === 'premium' && (
              <V8PremiumAssets paketi={premiumPaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} />
          )}
          {activeTab === 'bundles' && (
              <V8MasterBundles paketi={bundlePaketi} isAdmin={isAdmin} getGlobalCena={getGlobalCena} getAspectClass={getAspectClass} prijavaIKupovina={prijavaIKupovina} startEditPaket={startEditPaket} obrisiPaket={obrisiPaket} setFullScreenImageUrl={setFullScreenImageUrl} />
          )}
        </div>
      </div>
    </div>
  );
};

export default V8StockBerza;
// KRAJ FAJLA: V8StockBerza.jsx