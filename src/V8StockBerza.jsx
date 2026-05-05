import React, { useState, useEffect } from 'react';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { Sparkles, Download, Zap, ShieldCheck, X, Image as ImageIcon, Video, FolderArchive, Layers, Pencil, Users, CheckCircle, Globe, Type, FileText, Wallet, MonitorPlay, Link as LinkIcon, Images } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { v8Toast } from './App';
import { motion } from 'framer-motion';

const FullScreenLightbox = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4" onClick={onClose}>
            <button className="absolute top-10 right-10 bg-white/10 hover:bg-[#FF8C00]/20 p-3 rounded-full text-white hover:text-[#FF8C00] transition-all z-10">
                <X size={28} strokeWidth={3} />
            </button>
            <img src={imageUrl} alt="Full Screen Preview" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.25)] border-2 border-white/5" onClick={(e) => e.stopPropagation()} />
        </div>
    );
};

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
  const [showPremium, setShowPremium] = useState(false);

  // V8 GLOBAL ADMIN FIELDS
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('');
  const [noviFormat, setNoviFormat] = useState('16:9 (20 IMAGES)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('19.99'); 
  const [noviTip, setNoviTip] = useState('Image'); 
  const [noviOpisEn, setNoviOpisEn] = useState(''); 
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [lemonLink, setLemonLink] = useState('');

  const [showKlijentiPanel, setShowKlijentiPanel] = useState(false);
  const [klijenti, setKlijenti] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
          setCurrentUser(user);
          if (user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com") setIsAdmin(true);
      } else {
          setCurrentUser(null);
          setIsAdmin(false);
      }
    });
    fetchPaketi();
    return () => unsub();
  }, []);

  // AUTO-GENERATOR ZA PREMIUM OPIS
  useEffect(() => {
    if (noviFormat === '16:9 (20 IMAGES)') {
      setNoviOpisEn("PACKAGE CONTENTS: 20 PREMIUM AI ASSETS IN ULTRA-WIDE 16:9. INSTANT DIGITAL DOWNLOAD. ROYALTY-FREE FOR COMMERCIAL USE.");
    } else if (noviFormat === 'ALL FORMATS (80 IMAGES)') {
      setNoviOpisEn("PACKAGE CONTENTS: 80 PREMIUM AI ASSETS IN 4 RESOLUTIONS (16:9, 9:16, 1:1, 21:9). FULL MULTI-PLATFORM LICENSE INCLUDED.");
    } else if (noviFormat === '16:9 & 9:16 (33MP MASTERWORK)') {
      setNoviOpisEn("V8 MASTERWORK LICENSE: 20 PREMIUM ASSETS IN 33.2 MEGAPIXELS (8K UHD). ULTRA-HIGH RESOLUTION FOR LUXURY BRANDS. IP-SAFE & ROYALTY-FREE.");
    }
  }, [noviFormat]);

  const fetchPaketi = async () => {
    try {
      const q = query(collection(db, "v8_stock_paketi"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPaketi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error(err); }
  };

  const fetchKlijenti = async () => {
      try {
          const q = query(collection(db, "v8_kupci"), orderBy("vreme", "desc"));
          const snap = await getDocs(q);
          setKlijenti(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
  };

  const otkljucajPaketDirektno = async (id) => {
      try {
          await updateDoc(doc(db, "v8_kupci", id), { isPaid: true, vremeOdobrenja: serverTimestamp() });
          v8Toast.success("License Activated Successfully!");
          fetchKlijenti(); 
      } catch (err) { console.error(err); }
  };

  const prijavaIKupovina = async (paket) => {
    if (currentUser) {
        snimiKupcaUBazu(currentUser, paket);
        if (paket.lemonLink) { window.location.href = paket.lemonLink; } 
        else { setShowPaymentModal(paket); }
    } else {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const result = await signInWithPopup(auth, provider);
            await snimiKupcaUBazu(result.user, paket);
            if (paket.lemonLink) { window.location.href = paket.lemonLink; } 
            else { setShowPaymentModal(paket); }
        } catch (error) { v8Toast.error("Secure login required to obtain license."); }
    }
  };

  const snimiKupcaUBazu = async (user, paket) => {
      try {
          const imePaketa = paket.nazivEn || "Premium Asset Bundle";
          await addDoc(collection(db, "v8_kupci"), {
              ime: user.displayName || "Global Client", email: user.email, uid: user.uid,
              zeliPaket: imePaketa, cenaPaketa: paket.cena, vreme: serverTimestamp(), isPaid: false
          });
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
    } catch (err) { v8Toast.error("Upload failed!"); } finally { setIsUploading(false); }
  };

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    const slobodnaMesta = 4 - primeriUrls.length;
    if (slobodnaMesta <= 0) { v8Toast.error("Limit: 4 previews!"); return; }
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
    } catch (err) { v8Toast.error("Cloudinary Error!"); } finally { setIsUploadingPrimer(false); e.target.value = null; }
  };

  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Missing Digital Assets!"); return; }
    const paketData = {
        nazivEn: noviNazivEn.trim(), volume: noviVolume, format: noviFormat, 
        kategorijaEn: novaKategorijaEn.trim(), cena: novaCena, tip: noviTip, 
        opisEn: noviOpisEn, previewUrl, zipLink, lemonLink, primeri: primeriUrls, 
        updatedAt: serverTimestamp() 
    };
    try {
        if (editingPaketId) {
            await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData);
            v8Toast.success("Digital License Updated!");
        } else {
            await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() });
            v8Toast.success("Package Published to Global Market!");
        }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };

  const startEditPaket = (paket) => {
    setEditingPaketId(paket.id); setShowKlijentiPanel(false); 
    setNoviNazivEn(paket.nazivEn || ''); setNoviVolume(paket.volume || '');
    setNoviFormat(paket.format || '16:9 (20 IMAGES)'); setNovaKategorijaEn(paket.kategorijaEn || ''); 
    setNovaCena(paket.cena || '19.99'); setNoviTip(paket.tip || 'Image');
    setNoviOpisEn(paket.opisEn || ''); setPreviewUrl(paket.previewUrl || ''); 
    setZipLink(paket.zipLink || ''); setLemonLink(paket.lemonLink || '');
    setPrimeriUrls(paket.primeri || []); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stoziEdit = () => {
    setEditingPaketId(null); setNoviNazivEn(''); setNoviVolume(''); 
    setNoviFormat('16:9 (20 IMAGES)'); setNovaKategorijaEn(''); 
    setNovaCena('19.99'); setPreviewUrl(''); setZipLink(''); 
    setLemonLink(''); setPrimeriUrls([]);
  };

  const obrisiPaket = async (id) => {
    if (window.confirm("Delete this asset permanently?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); }
  };

  return (
    <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-screen bg-[#050505] font-sans text-white pt-32 pb-24 px-6"
    >
      <style>{`
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .v8-premium-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; }
        .v8-premium-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #ea580c 70%, #3b82f6 85%, #ea580c 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
        .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; }
      `}</style>

      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            {showPremium ? "V8 33MP MASTERWORK ASSETS" : "V8 PREMIUM STOCK MARKET"}
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[12px] max-w-3xl mx-auto leading-relaxed">
            {showPremium 
              ? "ULTRA-HIGH FIDELITY ASSETS. 33.2 MEGAPIXELS OF RAW OPTICAL AUTHORITY. DESIGNED FOR GLOBAL LUXURY CAMPAIGNS." 
              : "THE ULTIMATE ARSENAL OF ROYALTY-FREE AI ASSETS FOR VISIONARY CREATORS AND HIGH-END PRODUCTION."}
          </p>
        </div>

        {/* PREKIDAČ ZA LICENCE */}
        <div className="flex justify-center mb-16 relative z-10">
          <div className="bg-[#050505] border border-white/10 p-1.5 rounded-full inline-flex items-center shadow-xl">
            <button onClick={() => setShowPremium(false)} className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${!showPremium ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-white'}`}>Standard Assets</button>
            <button onClick={() => setShowPremium(true)} className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 ${showPremium ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-500 hover:text-orange-500'}`}><Zap className="w-4 h-4" /> V8 Masterwork</button>
          </div>
        </div>

        {isAdmin && (
            <div className="flex justify-center gap-4 mb-8">
                <button onClick={() => { setShowKlijentiPanel(!showKlijentiPanel); if (!showKlijentiPanel) fetchKlijenti(); }} className="bg-zinc-900 border border-[#FF8C00]/50 hover:bg-[#FF8C00] text-[#FF8C00] hover:text-black transition-all px-8 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(255,140,0,0.2)]"><Users size={18} /> {showKlijentiPanel ? "BACK TO EDITOR" : "LICENSE APPROVALS"}</button>
            </div>
        )}

        {/* GRID KARTICA */}
        <div className="flex flex-wrap justify-center gap-12 max-w-6xl mx-auto">
          {paketi.filter(p => { const isP = p.format === '16:9 & 9:16 (33MP MASTERWORK)'; return showPremium ? isP : !isP; }).map(paket => (
            <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] v8-premium-card group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,140,0,0.15)] flex flex-col">
              <div className="v8-card-content p-6">
                <div className="aspect-video relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5">
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                      <div className="bg-black/80 backdrop-blur-md border border-[#FF8C00]/50 text-[#FF8C00] px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider">{paket.format}</div>
                      <div className="bg-blue-800/90 backdrop-blur-md border border-blue-400/50 text-white px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider">ROYALTY-FREE</div>
                  </div>
                  <img loading="lazy" src={paket.previewUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-500" alt="V8 Asset" />
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="w-5 h-5 text-[#FF8C00]" />
                  <h3 className="text-[18px] md:text-[22px] font-black uppercase text-white tracking-widest">{paket.nazivEn || "PREMIUM BUNDLE"}</h3>
                </div>
                <p className="text-zinc-400 text-[11px] uppercase font-black mb-6 flex-1 leading-relaxed tracking-wider">{paket.opisEn}</p>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#FF8C00]/30">
                  <span className="text-2xl font-black text-white">${parseFloat(paket.cena).toFixed(2)}</span>
                  <button onClick={() => prijavaIKupovina(paket)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">GET LICENSE <Zap className="w-4 h-4" /></button>
                </div>

                {isAdmin && (
                  <div className="mt-5 pt-4 border-t border-red-900/30 flex items-center gap-3">
                    <button onClick={() => startEditPaket(paket)} className="w-full py-3 bg-zinc-800 text-zinc-300 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Edit <Pencil size={14} /></button>
                    <button onClick={() => obrisiPaket(paket.id)} className="w-full py-3 bg-red-900/30 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 transition-all">Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PAYMENT MODAL (Global Version) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowPaymentModal(null)}>
          <div className="bg-[#050505] rounded-3xl max-w-[420px] w-full relative pt-12 pb-10 px-8 border-2 border-[#FF8C00] shadow-[0_0_50px_rgba(255,140,0,0.2)]" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-[#FF8C00] text-center">SECURE WIRE TRANSFER</h2>
            <div className="w-full mb-6 p-4 bg-[#FF8C00]/10 border border-[#FF8C00]/50 rounded-xl text-center">
                <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest mb-1">SUPPORT CONTACT</p>
                <p className="text-[14px] text-white font-black">aitoolsprosmart@gmail.com</p>
            </div>
            <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-[#0a0a0a] font-mono text-[11px] uppercase leading-loose">
                <span className="text-zinc-600 block text-[9px] font-black">BENEFICIARY</span>
                <strong className="text-white text-[13px]">GORAN DAMNJANOVIĆ</strong><br/>
                <span className="text-zinc-600 block text-[9px] font-black mt-4">IBAN / ACCOUNT</span>
                <strong className="text-[#FF8C00] select-all tracking-widest text-[14px]">RS35205903102884947363</strong><br/>
                <span className="text-zinc-600 block text-[9px] font-black mt-4">SWIFT / BIC</span>
                <strong className="text-[#FF8C00] text-[14px]">KOBBRSBG</strong>
            </div>
            <p className="text-[10px] text-zinc-500 text-center font-black uppercase">Access to digital assets is unlocked immediately after verification. 🚀</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default V8StockBerza;