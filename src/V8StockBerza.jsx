// POČETAK FAJLA: V8StockBerza.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { Sparkles, Download, Zap, ShieldCheck, X, Image as ImageIcon, Video, FolderArchive, Layers, Pencil, Users, CheckCircle, Globe, Type, FileText, Wallet, MonitorPlay, Link as LinkIcon, Images, DownloadCloud } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { v8Toast } from './App';
import { motion, AnimatePresence } from 'framer-motion';

// V8 SLEEP PROTOCOL LIGHTBOX
const FullScreenLightbox = ({ imageUrl, onClose }) => {
    useEffect(() => {
        if (imageUrl) {
            document.body.style.overflow = 'hidden';
            const style = document.createElement('style');
            style.id = 'v8-sleep-protocol';
            style.innerHTML = `
                div[class*="border-[#FF8C00]"][class*="pointer-events-none"] { display: none !important; opacity: 0 !important; }
                body, .fixed, img, div { cursor: default !important; }
                button, button *, .cursor-pointer { cursor: pointer !important; }
            `;
            document.head.appendChild(style);
        } else {
            document.body.style.overflow = '';
            document.getElementById('v8-sleep-protocol')?.remove();
        }
        return () => { document.body.style.overflow = ''; document.getElementById('v8-sleep-protocol')?.remove(); };
    }, [imageUrl]);

    if (!imageUrl) return null;
    return createPortal(
        <div className="fixed inset-0 z-[999999] bg-[#0f172a]/95 flex items-center justify-center p-4" onClick={onClose}>
            <button type="button" onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#FF8C00] text-white p-4 rounded-full hover:bg-[#e67e00] transition-all z-[1000000] shadow-[0_0_20px_rgba(255,140,0,0.5)] border-none"><X size={32} strokeWidth={3} /></button>
            <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.4)] border border-[#FF8C00]/30 relative z-[999999]" onClick={(e) => e.stopPropagation()} />
        </div>, document.body
    );
};

const V8StockBerza = () => {
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  // ZADRŽAVAMO PAYMENT MODAL KAO FALLBACK (ALI 100% CLEAN DIZAJN, BEZ WIRE PODATAKA)
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]); 
  const [editingPaketId, setEditingPaketId] = useState(null); 
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);
  const [showPremium, setShowPremium] = useState(true);

  // V8 KONTROLE
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('16:9, 9:16 & 21:9 (BUNDLE)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('49.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [lemonLink, setLemonLink] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
          setCurrentUser(user);
          if (user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com") setIsAdmin(true);
          else setIsAdmin(false);
      } else { setCurrentUser(null); setIsAdmin(false); }
    });
    fetchPaketi();
    return () => unsub();
  }, []);

  // V8 AUTOMATIC DESCRIPTION
  useEffect(() => {
    if (noviFormat === '16:9 ONLY (SINGLE)') { setNoviOpisEn("PACKAGE CONTENTS: PREMIUM AI VISUALS IN ULTRA-WIDE 16:9 ONLY. PERFECT FOR WEBSITES, DESKTOP BACKGROUNDS AND CINEMATIC B-ROLL. COMMERCIAL VALUE OVER $1,500."); } 
    else if (noviFormat === '16:9, 9:16 & 21:9 (BUNDLE)') { setNoviOpisEn("PACKAGE CONTENTS: PREMIUM AI VISUALS IN 3 FORMATS: 16:9 (LANDSCAPE), 9:16 (PORTRAIT) AND 21:9 (ULTRA-WIDE). PERFECT FOR DESKTOP, TIKTOK, INSTAGRAM REELS, AND CINEMATIC DISPLAYS. COMMERCIAL VALUE OVER $2,000."); } 
    else if (noviFormat === 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)') { setNoviOpisEn("PACKAGE CONTENTS: 80 PREMIUM AI VISUALS IN 4 RESOLUTIONS (16:9, 9:16, 21:9, AND 1:1 SQUARE). COMPLETE PACKAGE FOR ALL PLATFORMS. THE ULTIMATE V8 COLLECTION. COMMERCIAL VALUE OVER $3,000."); } 
    else if (noviFormat === '16:9 & 9:16 (33.2MP MASTERWORK)') { setNoviOpisEn("V8 MASTERWORK BUNDLE: COMPLETE COLLECTION OF 20 PREMIUM VISUALS IN 33.2 MEGAPIXELS (8K UHD) RESOLUTION, sRGB COLORS, POLISHED AD PRODUCT, FILM GRAIN, CONTRIBUTOR QUALITY CLEANUP, PREMIUM SHARPNESS WITHOUT AI PLASTIC, COLOR GRADING, HIGHLIGHT ROLLOFF, SHADOW DEPTH, JPG HIGH QUALITY. INCLUDES BOTH 16:9 (LANDSCAPE) AND 9:16 (PORTRAIT) ASPECT RATIOS. FLAWLESS TEXTURES, ZERO BRANDING, IP-SAFE. DESIGNED EXCLUSIVELY FOR LUXURY BRANDS AND HIGH-END COMMERCIAL CAMPAIGNS. COMMERCIAL VALUE OVER $2,500."); }
  }, [noviFormat]);

  const fetchPaketi = async () => {
    try {
      const q = query(collection(db, "v8_stock_paketi"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
  };

  // V8 CHECKOUT REDIRECT / MODAL
  const prijavaIKupovina = async (paket) => {
    if (currentUser) {
        snimiKupcaUBazu(currentUser, paket);
        if (paket.lemonLink) {
            window.location.href = paket.lemonLink; // OTVARA LEMON
        } else {
            setShowPaymentModal(paket); // FALLBACK MODAL CLEAN
        }
    } else {
        try {
            await signOut(auth);
            const v8Provider = new GoogleAuthProvider();
            v8Provider.setCustomParameters({ prompt: 'select_account', login_hint: '' });
            const result = await signInWithPopup(auth, v8Provider);
            await snimiKupcaUBazu(result.user, paket);
            
            if (paket.lemonLink) {
                window.location.href = paket.lemonLink;
            } else {
                setShowPaymentModal(paket); 
            }
        } catch (error) { v8Toast.error("Login canceled."); }
    }
  };

  const snimiKupcaUBazu = async (user, paket) => {
      try {
          const imePaketa = paket.nazivEn || "Premium Package";
          await addDoc(collection(db, "v8_kupci"), {
              ime: user.displayName || "Client", email: user.email, uid: user.uid,
              zeliPaket: imePaketa, cenaPaketa: paket.cena, vreme: serverTimestamp(), isPaid: false
          });
      } catch (error) { console.error(error); }
  };

  // UPLOAD FUNKCIJE
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

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    const slobodnaMesta = 4 - primeriUrls.length;
    if (slobodnaMesta <= 0) { v8Toast.error("Max 4 previews!"); return; }
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
    } catch (err) { v8Toast.error("Error uploading previews!"); } finally { setIsUploadingPrimer(false); e.target.value = null; }
  };

  const removeMainImage = () => setPreviewUrl('');
  const removeThumbnail = (indexToRemove) => setPrimeriUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));

  // CRUD FUNKCIJE
  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Image & ZIP needed!"); return; }
    if (!noviNazivEn.trim() || !novaKategorijaEn.trim()) { v8Toast.error("Title & Category needed!"); return; }
    
    const paketData = {
        nazivEn: noviNazivEn.trim(), volume: noviVolume, format: noviFormat, kategorijaEn: novaKategorijaEn.trim(), 
        cena: novaCena, tip: noviTip, opisEn: noviOpisEn, previewUrl, zipLink, lemonLink, primeri: primeriUrls, updatedAt: serverTimestamp() 
    };
    try {
        if (editingPaketId) { await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData); v8Toast.success("Updated!"); } 
        else { await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() }); v8Toast.success("Added!"); }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };

  const startEditPaket = (paket) => {
    setEditingPaketId(paket.id); setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || '');
    setNoviFormat(paket.format || '16:9, 9:16 & 21:9 (BUNDLE)'); setNovaKategorijaEn(paket.kategorijaEn || ''); 
    setNovaCena(paket.cena || '49.99'); setNoviTip(paket.tip || 'Image'); setNoviOpisEn(paket.opisEn || ''); 
    setPreviewUrl(paket.previewUrl || ''); setZipLink(paket.zipLink || ''); setLemonLink(paket.lemonLink || ''); setPrimeriUrls(paket.primeri || []); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stoziEdit = () => {
    setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); setNoviFormat('16:9, 9:16 & 21:9 (BUNDLE)'); 
    setNovaKategorijaEn(''); setNovaCena('49.99'); setPreviewUrl(''); setZipLink(''); setLemonLink(''); setPrimeriUrls([]);
  };

  const obrisiPaket = async (id) => { if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); } };

  const getGlobalCena = (cena) => {
      const numCena = parseFloat(cena);
      if (numCena > 500) { return (Math.ceil((numCena / 110) * 1.2) + 0.99).toFixed(2); }
      return numCena.toFixed(2);
  };

  const getAspectClass = (format) => {
      if (!format) return 'aspect-video';
      if (format.includes('16:9 ONLY')) return 'aspect-video'; 
      return 'aspect-square'; 
  };

  return (
    <motion.div initial={{ y: "-100vh", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 60, damping: 15 }} className="min-h-screen bg-[#050505] font-sans text-white pt-32 pb-24 px-6">
      <style>{`
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .v8-premium-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; }
        .v8-premium-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #ea580c 70%, #3b82f6 85%, #ea580c 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
        .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; }
      `}</style>

      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]">
            <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70" style={{ backgroundImage: "url('/v8-stok/v8-stock-hero.jpg.webp')" }}></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/70 to-[#050505]"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>

            <div className="relative z-10 text-center py-20 px-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] transition-all">
                    {showPremium ? (<>V8 33MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 drop-shadow-none">MASTERWORK ASSETS</span></>) : (<>V8 PREMIUM <span className="text-[#FF8C00]">STOCK MARKET</span></>)}
                </h1>
                
                <p className="text-zinc-200 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[12px] max-w-3xl mx-auto leading-relaxed mb-10 drop-shadow-lg bg-black/30 p-3 rounded-lg backdrop-blur-sm transition-all">
                    {showPremium ? "PURE UNADULTERATED PIXELS. 33.2 MEGAPIXELS OF MASTERWORK RESOLUTION. ZERO COMPROMISE FOR LUXURY BRANDS." : "THE ULTIMATE ARSENAL OF ROYALTY-FREE AI ASSETS FOR HIGH-END PRODUCTION AND VISIONARY CREATORS."}
                </p>
                
                <div className="flex justify-center relative z-10">
                    <div className="bg-[#050505]/80 backdrop-blur-md border border-white/10 p-1.5 rounded-full inline-flex items-center shadow-xl">
                        <button onClick={() => setShowPremium(false)} className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${!showPremium ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}>Standard Assets</button>
                        <button onClick={() => setShowPremium(true)} className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${showPremium ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-400 hover:text-orange-500'}`}><Zap className="w-4 h-4" /> V8 Premium</button>
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
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Type size={14} /> PACKAGE TITLE</label><input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Roman History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required /></div>
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Layers size={14} /> CATEGORY</label><input type="text" value={novaKategorijaEn} onChange={(e)=>setNovaKategorijaEn(e.target.value)} placeholder="E.g. History" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required /></div>
                <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FolderArchive size={14} /> COLLECTION (VOLUME)</label><input type="text" placeholder="E.g. VOL 1" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-black text-white border border-white/10 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2 md:col-span-1"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><FileText size={14} /> DESCRIPTION</label><textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={4} className="bg-black border border-white/10 p-4 rounded-xl text-[12px] font-bold text-white w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full" required /></div>
              <div className="flex flex-col gap-6 md:col-span-2">
                  <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><Wallet size={14} /> PRICE (USD)</label><input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} placeholder="E.g. 49.99" className="bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold text-white outline-none focus:border-[#FF8C00] transition-all" /></div>
                  <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase"><MonitorPlay size={14} /> FORMAT</label>
                      <div className="grid grid-cols-2 gap-2">
                          <label className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === '16:9, 9:16 & 21:9 (BUNDLE)' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'}`}><input type="radio" name="format" value="16:9, 9:16 & 21:9 (BUNDLE)" checked={noviFormat === '16:9, 9:16 & 21:9 (BUNDLE)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />16:9, 9:16 & 21:9</label>
                          <label className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === '16:9 ONLY (SINGLE)' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'}`}><input type="radio" name="format" value="16:9 ONLY (SINGLE)" checked={noviFormat === '16:9 ONLY (SINGLE)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />16:9 ONLY</label>
                          <label className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'}`}><input type="radio" name="format" value="ALL FORMATS (16:9, 9:16, 21:9, 1:1)" checked={noviFormat === 'ALL FORMATS (16:9, 9:16, 21:9, 1:1)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />ALL (INC. 21:9)</label>
                          <label className={`cursor-pointer p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase flex items-center justify-center gap-1 ${noviFormat === '16:9 & 9:16 (33.2MP MASTERWORK)' ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-black border-white/10 text-zinc-500 hover:border-orange-500/50'}`}><input type="radio" name="format" value="16:9 & 9:16 (33.2MP MASTERWORK)" checked={noviFormat === '16:9 & 9:16 (33.2MP MASTERWORK)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" /><Zap size={10} /> 33.2MP MASTERWORK</label>
                      </div>
                  </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-blue-400 font-black text-[11px] tracking-widest uppercase"><LinkIcon size={14} /> GOOGLE DRIVE (DELIVERY)</label><input type="url" value={zipLink} onChange={(e)=>setZipLink(e.target.value)} placeholder="https://drive.google.com/..." className="bg-black border border-blue-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-blue-400 transition-all" required /></div>
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-yellow-400 font-black text-[11px] tracking-widest uppercase"><Zap size={14} /> LEMON SQUEEZY LINK</label><input type="url" value={lemonLink} onChange={(e)=>setLemonLink(e.target.value)} placeholder="https://store.lemonsqueezy.com/..." className="bg-black border border-yellow-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-yellow-400 transition-all" /></div>
                </div>

                <div className="flex flex-col gap-4">
                  {(previewUrl || primeriUrls.length > 0) && (
                    <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                      {previewUrl && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.4)] group"><span className="absolute top-0 left-0 bg-[#FF8C00] text-black text-[9px] font-black px-2 py-0.5 z-10">MAIN</span><button type="button" onClick={removeMainImage} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md"><X size={12} strokeWidth={3} /></button><img src={previewUrl} alt="Main" className="w-full h-full object-cover" /></div>
                      )}
                      {primeriUrls.map((url, idx) => (
                        <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-white/20 relative group"><span className="absolute bottom-0 right-0 bg-black/80 text-white text-[8px] font-black px-1.5 py-0.5 z-10">PREVIEW</span><button type="button" onClick={() => removeThumbnail(idx)} className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-500 text-white rounded-full p-1 z-20 transition-all opacity-0 group-hover:opacity-100 shadow-md"><X size={12} strokeWidth={3} /></button><img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" /></div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><ImageIcon size={12} /> MAIN IMAGE</label><label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase cursor-pointer transition-all flex items-center gap-2"><ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'}<input type="file" onChange={handleUploadPreview} className="hidden" /></label></div>
                    <div className="flex flex-col gap-2"><label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase"><Images size={12} /> GALLERY</label><label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase cursor-pointer transition-all flex items-center gap-2"><Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/4)`}<input type="file" multiple onChange={handleUploadPrimeri} className="hidden" /></label></div>
                    <button type="submit" className="ml-auto px-8 py-4 rounded-xl font-black text-[13px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-black transition-all shadow-[0_0_20px_rgba(255,140,0,0.5)] flex items-center gap-2 hover:scale-105"><Zap size={18} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'}</button>
                  </div>
                </div>
            </div>
          </form>
        )}

        <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
          {paketi
            .filter(paket => {
              const formatString = paket.format || "";
              const isPremium = formatString.includes('MASTERWORK');
              return showPremium ? isPremium : !isPremium;
            })
            .map(paket => (
            <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] v8-premium-card group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,140,0,0.15)] flex flex-col">
              <div className="v8-card-content p-5 md:p-6">
                
                <div className={`${getAspectClass(paket.format)} relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner`}>
                  {paket.volume && (<div className="absolute top-0 left-0 bg-[#FF8C00] text-black px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r border-[#FF8C00]/50">{paket.volume}</div>)}
                  
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                      {paket.format && (<div className="bg-black/80 backdrop-blur-md border border-[#FF8C00]/50 text-[#FF8C00] px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg">{paket.format.split('(')[0].trim()}</div>)}
                      {(paket.kategorijaEn || paket.kategorija) && (<div className="bg-blue-800/90 backdrop-blur-md border border-blue-400/50 text-[#FF8C00] px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg">{paket.kategorijaEn || paket.kategorija}</div>)}
                  </div>

                  {paket.previewUrl && paket.previewUrl.match(/\.(mp4|webm|mov)$/i) ? (
                    <video preload="none" src={`${paket.previewUrl}#t=0.001`} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" muted loop playsInline onMouseOver={e => e.target.play()} onMouseOut={e => e.target.pause()} />
                  ) : (
                    <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" alt={paket.nazivEn} />
                  )}
                </div>
                
                {paket.primeri && paket.primeri.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-6">
                        {paket.primeri.map((imgUrl, idx) => (
                            <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-zinc-900 shadow-xl relative cursor-pointer" onClick={() => setFullScreenImageUrl(imgUrl)}>
                                <img loading="lazy" src={imgUrl} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-all duration-300" alt="V8 Preview" />
                            </div>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center gap-3 mb-3">
                  {paket.tip === 'Video' ? <Video className="w-5 h-5 text-[#FF8C00]" /> : <ImageIcon className="w-5 h-5 text-[#FF8C00]" />}
                  <h3 className="text-[18px] md:text-[20px] font-black uppercase text-white tracking-widest">{paket.nazivEn || "PREMIUM ASSETS"}</h3>
                </div>
                
                <p className="text-zinc-400 text-[11px] uppercase font-black mb-6 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap">{paket.opisEn}</p>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#FF8C00]/30">
                  <span className="text-2xl font-black text-white">${getGlobalCena(paket.cena)}</span>
                  {isAdmin ? (
                    <a href={paket.zipLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">DOWNLOAD <Download className="w-4 h-4" /></a>
                  ) : (
                      <button onClick={() => prijavaIKupovina(paket)} className="bg-gradient-to-r from-orange-600 to-amber-500 hover:scale-105 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(234,88,12,0.4)] transition-all">GET LICENSE <Zap className="w-4 h-4" /></button>
                  )}
                </div>
                
                {isAdmin && (
                  <div className="mt-5 pt-4 border-t border-red-900/30 flex items-center gap-3">
                    <button onClick={() => startEditPaket(paket)} className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2">Edit <Pencil size={14} /></button>
                    <button onClick={() => obrisiPaket(paket.id)} className="w-full py-3 bg-red-900/30 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all">Remove</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* V8 FIX: POTPUNO NOVI, ČISTI DIGITAL CHECKOUT MODAL (BEZ WIRE TRANSFERA I IBANA) */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[9000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden">
              <button onClick={() => setShowPaymentModal(null)} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
              
              <div className="p-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                   <DownloadCloud className="w-8 h-8 text-orange-500" />
                </div>
                
                <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
                <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center">{showPaymentModal.nazivEn}</p>
                
                <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
                  <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Provider:</span><span className="font-bold text-white text-right">V8 Vault</span></div>
                  <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
                  <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-white text-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${getGlobalCena(showPaymentModal.cena)}</span></div>
                </div>
                
                <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
                  <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-orange-500 hover:text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                     Request Checkout Link
                  </a>
                  <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your download automatically after checkout! 🚀</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default V8StockBerza;
// KRAJ FAJLA: V8StockBerza.jsx