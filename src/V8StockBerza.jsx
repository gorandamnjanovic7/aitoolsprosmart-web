import React, { useState, useEffect } from 'react';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { Sparkles, Download, Zap, ShieldCheck, X, Image as ImageIcon, Video, FolderArchive, Layers, Pencil, Users, CheckCircle, Globe, Type, FileText, Wallet, MonitorPlay, Link as LinkIcon, Images } from 'lucide-react';
import { db, auth } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { v8Toast } from './App';

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

  // V8 PURE ENGLISH ADMIN FORM FIELDS
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
          else setIsAdmin(false);
      } else {
          setCurrentUser(null);
          setIsAdmin(false);
      }
    });
    fetchPaketi();
    return () => unsub();
  }, []);

  // AUTOMATIC DESCRIPTION ($)
  useEffect(() => {
    if (noviFormat === '16:9 (20 IMAGES)') {
      setNoviOpisEn("PACKAGE CONTENTS: 20 PREMIUM AI VISUALS IN ULTRA-WIDE 16:9. PERFECT FOR WEBSITES AND YT. VALUE OVER $250.");
    } else if (noviFormat === 'ALL FORMATS (80 IMAGES)') {
      setNoviOpisEn("PACKAGE CONTENTS: 80 PREMIUM AI VISUALS IN 4 RESOLUTIONS (16:9, 9:16, 1:1, 21:9). COMPLETE PACKAGE FOR ALL PLATFORMS. THE ULTIMATE V8 COLLECTION.");
    } else if (noviFormat === '16:9 & 9:16 (33MP MASTERWORK)') {
      setNoviOpisEn("V8 MASTERWORK BUNDLE: COMPLETE COLLECTION OF 20 PREMIUM VISUALS IN 33.2 MEGAPIXEL (8K UHD) RESOLUTION. INCLUDES BOTH 16:9 (LANDSCAPE) AND 9:16 (PORTRAIT) ASPECT RATIOS. FLAWLESS TEXTURES, ZERO BRANDING, IP-SAFE. DESIGNED EXCLUSIVELY FOR LUXURY BRANDS AND HIGH-END COMMERCIAL CAMPAIGNS.");
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
          v8Toast.success("V8 Turbo: Package successfully unlocked!");
          fetchKlijenti(); 
      } catch (err) { console.error(err); }
  };

  const prijavaIKupovina = async (paket) => {
    if (currentUser) {
        snimiKupcaUBazu(currentUser, paket);
        if (paket.lemonLink) {
            window.location.href = paket.lemonLink; 
        } else {
            setShowPaymentModal(paket); 
        }
    } else {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await snimiKupcaUBazu(result.user, paket);
            
            if (paket.lemonLink) {
                window.location.href = paket.lemonLink;
            } else {
                setShowPaymentModal(paket); 
            }
        } catch (error) { 
            v8Toast.error("Login via Google is required to proceed with the purchase."); 
        }
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

  // V8 TURBO CLEAN DB
  const v8TurboCleanDB = async () => {
      if (!window.confirm("V8 WARNING: This will automatically clean the database to English formats and calculate USD prices. Proceed?")) return;
      
      try {
          const snap = await getDocs(query(collection(db, "v8_stock_paketi")));
          let count = 0;

          for (const docSnap of snap.docs) {
              const data = docSnap.data();
              const updates = {};
              let needsUpdate = false;

              if (data.naziv && !data.nazivEn) { updates.nazivEn = data.naziv; needsUpdate = true; }
              if (data.kategorija && !data.kategorijaEn) { updates.kategorijaEn = data.kategorija; needsUpdate = true; }

              if (data.cena && parseFloat(data.cena) > 500) {
                  const osnova = parseFloat(data.cena) / 110;
                  updates.cena = (Math.ceil(osnova * 1.2) + 0.99).toFixed(2).toString();
                  needsUpdate = true;
              }

              let newFormat = data.format;
              if (data.format === "16:9 (20 SLIKA)") {
                  newFormat = "16:9 (20 IMAGES)";
                  updates.format = newFormat;
                  needsUpdate = true;
              } else if (data.format === "SVI FORMATI (80 SLIKA)") { 
                  newFormat = "ALL FORMATS (80 IMAGES)";
                  updates.format = newFormat;
                  needsUpdate = true;
              }

              if (!data.opisEn || data.opisEn.trim() === "") {
                  if (newFormat === '16:9 (20 IMAGES)') {
                      updates.opisEn = "PACKAGE CONTENTS: 20 PREMIUM AI VISUALS IN ULTRA-WIDE 16:9. PERFECT FOR WEBSITES AND YT. VALUE OVER $250.";
                      needsUpdate = true;
                  } else if (newFormat === 'ALL FORMATS (80 IMAGES)') {
                      updates.opisEn = "PACKAGE CONTENTS: 80 PREMIUM AI VISUALS IN 4 RESOLUTIONS (16:9, 9:16, 1:1, 21:9). COMPLETE PACKAGE FOR ALL PLATFORMS. THE ULTIMATE V8 COLLECTION.";
                      needsUpdate = true;
                  }
              }

              if (needsUpdate) {
                  await updateDoc(doc(db, "v8_stock_paketi", docSnap.id), updates);
                  count++;
              }
          }
          
          v8Toast.success(`V8 Turbo Clean complete! ${count} packages updated.`);
          fetchPaketi(); 
      } catch (error) {
          console.error("Clean error: ", error);
          v8Toast.error("Error during DB clean: " + error.message);
      }
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
    } catch (err) { v8Toast.error("Upload error!"); } finally { setIsUploading(false); }
  };

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files); 
    if (files.length === 0) return;
    const slobodnaMesta = 4 - primeriUrls.length;
    if (slobodnaMesta <= 0) { v8Toast.error("Maximum 4 preview images!"); return; }
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

  // POČETAK: removeMainImage
  const removeMainImage = () => {
    setPreviewUrl('');
  };
  // KRAJ: removeMainImage

  // POČETAK: removeThumbnail
  const removeThumbnail = (indexToRemove) => {
    setPrimeriUrls(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };
  // KRAJ: removeThumbnail

  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) { v8Toast.error("Preview image and ZIP link are required!"); return; }
    if (!noviNazivEn.trim() || !novaKategorijaEn.trim()) { v8Toast.error("Package Title and Category are required!"); return; }
    
    const paketData = {
        nazivEn: noviNazivEn.trim(), 
        volume: noviVolume, 
        format: noviFormat, 
        kategorijaEn: novaKategorijaEn.trim(), 
        cena: novaCena, 
        tip: noviTip, 
        opisEn: noviOpisEn, 
        previewUrl, 
        zipLink, 
        lemonLink,
        primeri: primeriUrls, 
        updatedAt: serverTimestamp() 
    };
    
    try {
        if (editingPaketId) {
            await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData);
            v8Toast.success("Package successfully updated!");
        } else {
            await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() });
            v8Toast.success("New package added to the V8 Global Market!");
        }
        stoziEdit(); fetchPaketi();
    } catch (error) { v8Toast.error(error.message); }
  };

  const startEditPaket = (paket) => {
    setEditingPaketId(paket.id); 
    setShowKlijentiPanel(false); 
    setNoviNazivEn(paket.nazivEn || ''); 
    setNoviVolume(paket.volume || '');
    setNoviFormat(paket.format || '16:9 (20 IMAGES)'); 
    setNovaKategorijaEn(paket.kategorijaEn || ''); 
    setNovaCena(paket.cena || '19.99'); 
    setNoviTip(paket.tip || 'Image');
    setNoviOpisEn(paket.opisEn || ''); 
    setPreviewUrl(paket.previewUrl || ''); 
    setZipLink(paket.zipLink || '');
    setLemonLink(paket.lemonLink || '');
    setPrimeriUrls(paket.primeri || []); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stoziEdit = () => {
    setEditingPaketId(null); 
    setNoviNazivEn(''); 
    setNoviVolume(''); 
    setNoviFormat('16:9 (20 IMAGES)'); 
    setNovaKategorijaEn(''); 
    setNovaCena('19.99');
    setPreviewUrl(''); 
    setZipLink(''); 
    setLemonLink(''); 
    setPrimeriUrls([]);
  };

  const obrisiPaket = async (id) => {
    if (window.confirm("Are you sure?")) { await deleteDoc(doc(db, "v8_stock_paketi", id)); fetchPaketi(); }
  };

  const getGlobalCena = (cena) => {
      const numCena = parseFloat(cena);
      if (numCena > 500) { 
          const osnova = numCena / 110;
          return (Math.ceil(osnova * 1.2) + 0.99).toFixed(2);
      }
      return numCena.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 font-sans text-white text-left">
      <style>{`
        @keyframes spin-gradient { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .v8-premium-card { position: relative; border-radius: 2rem; padding: 2px; overflow: hidden; background: #0a0a0a; }
        .v8-premium-card::before { content: ""; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: conic-gradient(from 0deg, transparent 0%, transparent 50%, #ea580c 70%, #3b82f6 85%, #ea580c 100%); animation: spin-gradient 3.5s linear infinite; z-index: 0; }
        .v8-card-content { position: relative; background: #0a0a0a; border-radius: 1.9rem; z-index: 1; height: 100%; display: flex; flex-direction: column; }
      `}</style>

      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />

      <div className="max-w-7xl mx-auto">
        
        {/* --- DYNAMIC HEADINGS --- */}
        <div className="text-center mb-16 mt-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 transition-all">
            {showPremium ? "V8 33MP MASTERWORK ASSETS" : "V8 PREMIUM STOCK MARKET"}
          </h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-[12px] transition-all max-w-3xl mx-auto leading-relaxed">
            {showPremium 
              ? "PURE UNADULTERATED PIXELS. 33.2 MEGAPIXELS OF MASTERWORK RESOLUTION. ZERO COMPROMISE FOR LUXURY BRANDS." 
              : "THE ULTIMATE ARSENAL OF ROYALTY-FREE AI ASSETS FOR HIGH-END PRODUCTION AND VISIONARY CREATORS."}
          </p>
        </div>

        {/* --- V8 PREMIUM PREKIDAČ --- */}
        <div className="flex justify-center mb-16 relative z-10">
          <div className="bg-[#050505] border border-white/10 p-1.5 rounded-full inline-flex items-center shadow-xl">
            <button 
              onClick={() => setShowPremium(false)}
              className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 ${!showPremium ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
            >
              Standard Assets
            </button>
            <button 
              onClick={() => setShowPremium(true)}
              className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${showPremium ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'text-zinc-500 hover:text-orange-500'}`}
            >
              <Zap className="w-4 h-4" /> V8 Premium
            </button>
          </div>
        </div>

        {/* --- ADMIN CONTROL DASHBOARD --- */}
        {isAdmin && (
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <button
                    onClick={() => {
                        setShowKlijentiPanel(!showKlijentiPanel);
                        if (!showKlijentiPanel) fetchKlijenti();
                    }}
                    className="bg-zinc-900 border border-[#FF8C00]/50 hover:bg-[#FF8C00] text-[#FF8C00] hover:text-black transition-all px-8 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(255,140,0,0.2)]"
                >
                    <Users size={18} />
                    {showKlijentiPanel ? "CLOSE APPROVALS (BACK TO FORM)" : "CLIENTS & APPROVALS"}
                </button>
                
                {/* V8 TURBO BUTTON ZA BAZU */}
                <button
                    onClick={v8TurboCleanDB}
                    className="bg-red-900/20 border border-red-500/50 hover:bg-red-600 text-red-500 hover:text-white transition-all px-6 py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                >
                    <Zap size={18} /> V8 TURBO CLEAN DB
                </button>
            </div>
        )}

        {isAdmin && showKlijentiPanel && (
            <div className="bg-[#0a0a0a] border-2 border-[#FF8C00] rounded-[2.5rem] p-8 mb-16 shadow-[0_0_40px_rgba(255,140,0,0.15)] max-w-4xl mx-auto">
                <h2 className="text-xl font-black text-[#FF8C00] uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6" /> PAYMENT CONTROL ROOM
                </h2>
                
                <div className="flex flex-col gap-3">
                    {klijenti.length === 0 ? (
                        <div className="text-center py-10 bg-black rounded-2xl border border-white/5">
                            <p className="text-zinc-500 font-bold uppercase text-sm tracking-widest">No orders currently in queue.</p>
                        </div>
                    ) : (
                        klijenti.map(klijent => (
                            <div key={klijent.id} className="bg-black border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:border-[#FF8C00]/50 hover:shadow-[0_0_15px_rgba(255,140,0,0.2)]">
                                <div>
                                    <p className="text-white font-black text-[15px]">{klijent.email}</p>
                                    <p className="text-zinc-400 text-[11px] uppercase font-bold tracking-wider mt-1">
                                        Package: <span className="text-[#FF8C00] ml-1">{klijent.zeliPaket}</span>
                                    </p>
                                    <p className="text-zinc-600 text-[10px] font-mono mt-2 font-bold uppercase tracking-widest">
                                        Date: {klijent.vreme?.toDate().toLocaleString("en-US")}
                                    </p>
                                </div>
                                <div>
                                    {klijent.isPaid ? (
                                        <div className="bg-green-900/20 border border-green-500/30 text-green-500 px-6 py-3 rounded-xl font-black text-[11px] uppercase flex items-center gap-2">
                                            <CheckCircle size={16} /> APPROVED
                                        </div>
                                    ) : (
                                        <button onClick={() => otkljucajPaketDirektno(klijent.id)} className="bg-[#FF8C00] hover:bg-orange-500 text-black px-8 py-3 rounded-xl font-black text-[11px] uppercase shadow-[0_0_20px_rgba(255,140,0,0.4)] transition-all flex items-center gap-2 hover:scale-105">
                                            <Zap size={16} /> CLICK TO APPROVE
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}

        {isAdmin && !showKlijentiPanel && (
          <form onSubmit={dodajPaket} className="bg-[#0a0a0a] border-2 border-[#FF8C00]/50 rounded-[2.5rem] p-8 mb-16 shadow-[0_0_30px_rgba(255,140,0,0.1)] max-w-4xl mx-auto">
            <h2 className="text-xl font-black text-[#FF8C00] uppercase tracking-widest mb-8 flex items-center gap-2 border-b border-[#FF8C00]/20 pb-4">
              <Zap className="w-6 h-6" /> {editingPaketId ? 'EDIT PACKAGE' : 'ADD NEW ZIP PACKAGE'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex flex-col gap-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                        <Type size={14} /> PACKAGE TITLE
                    </label>
                    <input type="text" value={noviNazivEn} onChange={(e)=>setNoviNazivEn(e.target.value)} placeholder="E.g. Nature & Landscapes" className="bg-black border border-[#FF8C00]/50 p-4 rounded-xl text-[14px] font-black text-white w-full outline-none focus:border-[#FF8C00] transition-all" required />
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
                    <input type="text" placeholder="E.g. VOL 1 (Optional)" value={noviVolume} onChange={(e) => setNoviVolume(e.target.value)} className="bg-black text-white border border-white/10 p-4 rounded-xl text-[13px] font-black outline-none focus:border-[#FF8C00] transition-all" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="flex flex-col gap-2 md:col-span-1">
                  <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                      <FileText size={14} /> DESCRIPTION
                  </label>
                  <textarea value={noviOpisEn} onChange={(e)=>setNoviOpisEn(e.target.value)} placeholder="Package contents..." rows={3} className="bg-black border border-white/10 p-4 rounded-xl text-[12px] font-bold text-white w-full outline-none resize-none focus:border-[#FF8C00] transition-all h-full" required />
              </div>

              <div className="flex flex-col gap-6 md:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                              <Wallet size={14} /> PRICE (USD)
                          </label>
                          <input type="text" value={novaCena} onChange={(e)=>setNovaCena(e.target.value)} placeholder="E.g. 19.99" className="bg-black border border-white/10 p-4 rounded-xl text-[13px] font-bold text-white outline-none focus:border-[#FF8C00] transition-all" />
                      </div>

                      <div className="flex flex-col gap-2">
                          <label className="flex items-center gap-2 text-[#FF8C00] font-black text-[11px] tracking-widest uppercase">
                              <MonitorPlay size={14} /> FORMAT
                          </label>
                          <div className="flex flex-col sm:flex-row gap-2">
                              <label className={`cursor-pointer flex-1 p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === '16:9 (20 IMAGES)' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500'}`}>
                                  <input type="radio" name="format" value="16:9 (20 IMAGES)" checked={noviFormat === '16:9 (20 IMAGES)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                  16:9 (20 IMAGES)
                              </label>
                              <label className={`cursor-pointer flex-1 p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === 'ALL FORMATS (80 IMAGES)' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500'}`}>
                                  <input type="radio" name="format" value="ALL FORMATS (80 IMAGES)" checked={noviFormat === 'ALL FORMATS (80 IMAGES)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                  ALL FORMATS
                              </label>
                              <label className={`cursor-pointer flex-1 p-3 rounded-xl border-2 transition-all text-center font-black text-[9px] uppercase ${noviFormat === '16:9 & 9:16 (33MP MASTERWORK)' ? 'bg-gradient-to-r from-orange-600 to-amber-500 border-[#FF8C00] text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]' : 'bg-black border-white/10 text-zinc-500 hover:border-orange-500/50'}`}>
                                  <input type="radio" name="format" value="16:9 & 9:16 (33MP MASTERWORK)" checked={noviFormat === '16:9 & 9:16 (33MP MASTERWORK)'} onChange={(e) => setNoviFormat(e.target.value)} className="hidden" />
                                  33MP MASTERWORK
                              </label>
                          </div>
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
                        <label className="flex items-center gap-2 text-yellow-400 font-black text-[11px] tracking-widest uppercase">
                            <Zap size={14} /> LEMON SQUEEZY CHECKOUT LINK
                        </label>
                        <input type="url" value={lemonLink} onChange={(e)=>setLemonLink(e.target.value)} placeholder="https://store.lemonsqueezy.com/checkout/..." className="bg-black border border-yellow-500/50 p-4 rounded-xl text-[13px] text-white w-full outline-none font-bold focus:border-yellow-400 transition-all" />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                  {(previewUrl || primeriUrls.length > 0) && (
                    <div className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
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
                        <label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase cursor-pointer transition-all flex items-center gap-2"> 
                          <ImageIcon size={16} /> {isUploading ? 'UPLOADING...' : 'ADD PREVIEW'} 
                          <input type="file" onChange={handleUploadPreview} className="hidden" /> 
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="flex items-center gap-2 text-zinc-400 font-black text-[10px] tracking-widest uppercase">
                            <Images size={12} /> GALLERY IMAGES
                        </label>
                        <label className="bg-zinc-900 hover:bg-[#FF8C00] text-white hover:text-black border border-white/10 hover:border-[#FF8C00] px-6 py-4 rounded-xl font-black text-[11px] uppercase cursor-pointer transition-all flex items-center gap-2"> 
                          <Images size={16} /> {isUploadingPrimer ? 'UPLOADING...' : `ADD THUMBNAILS (${primeriUrls.length}/4)`} 
                          <input type="file" multiple onChange={handleUploadPrimeri} className="hidden" /> 
                        </label>
                    </div>

                    <button type="submit" className="ml-auto px-8 py-4 rounded-xl font-black text-[13px] tracking-widest uppercase bg-[#FF8C00] hover:bg-orange-500 text-black transition-all shadow-[0_0_20px_rgba(255,140,0,0.5)] flex items-center gap-2 hover:scale-105"> 
                      <Zap size={18} /> {editingPaketId ? 'SAVE CHANGES' : 'SAVE PACKAGE'} 
                    </button>
                  </div>
                </div>
            </div>
          </form>
        )}

        {/* --- PACKAGE CARDS DISPLAY --- */}
        <div className="flex flex-wrap justify-center gap-12 max-w-5xl mx-auto">
          {paketi
            .filter(paket => {
              const isPremium = paket.format === '16:9 & 9:16 (33MP MASTERWORK)';
              return showPremium ? isPremium : !isPremium;
            })
            .map(paket => (
            <div key={paket.id} className="w-full md:w-[calc(50%-1.5rem)] v8-premium-card group transition-all duration-500 hover:scale-[1.02] shadow-[0_0_30px_rgba(255,140,0,0.15)] flex flex-col">
              <div className="v8-card-content p-5 md:p-6">
                
                <div className="aspect-video relative rounded-2xl overflow-hidden mb-4 bg-black border border-white/5 shadow-inner">
                  {/* VOLUME BEDZ (Gore levo) */}
                  {paket.volume && (
                      <div className="absolute top-0 left-0 bg-[#FF8C00] text-black px-3 py-1.5 rounded-br-xl rounded-tl-2xl font-black text-[10px] uppercase tracking-widest z-20 shadow-lg border-b border-r border-[#FF8C00]/50">
                          {paket.volume}
                      </div>
                  )}
                  
                  {/* NOVI DUPLI BEDZEVI (Gore desno - jedan ispod drugog) */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end z-20">
                      {paket.format && (
                          <div className="bg-black/80 backdrop-blur-md border border-[#FF8C00]/50 text-[#FF8C00] px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg">
                              {paket.format}
                          </div>
                      )}
                      {(paket.kategorijaEn || paket.kategorija) && (
                          <div className="bg-blue-800/90 backdrop-blur-md border border-blue-400/50 text-[#FF8C00] px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-wider shadow-lg">
                              {paket.kategorijaEn || paket.kategorija}
                          </div>
                      )}
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
                  <h3 className="text-[18px] md:text-[20px] font-black uppercase text-white tracking-widest">
                    {paket.nazivEn || "PREMIUM ASSETS"}
                  </h3>
                </div>
                
                <p className="text-zinc-400 text-[11px] uppercase font-black mb-6 flex-1 leading-relaxed tracking-wider whitespace-pre-wrap">
                    {paket.opisEn}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-5 border-t border-[#FF8C00]/30">
                  <span className="text-2xl font-black text-white">${getGlobalCena(paket.cena)}</span>
                  {isAdmin ? (
                    <a href={paket.zipLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                        DOWNLOAD <Download className="w-4 h-4" />
                    </a>
                  ) : (
                      <button onClick={() => prijavaIKupovina(paket)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center gap-2">BUY NOW <Zap className="w-4 h-4" /></button>
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

      {/* --- INTERNATIONAL PAYMENT MODAL --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[9000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#050505] rounded-3xl max-w-[420px] w-full relative pt-8 pb-10 px-8 border-2 border-[#FF8C00] shadow-[0_0_50px_rgba(255,140,0,0.2)] flex flex-col items-center">
            
            <h2 className="text-2xl font-black uppercase tracking-widest mb-2 text-[#FF8C00]">
              INTERNATIONAL WIRE
            </h2>
            
            <p className="text-[11px] text-zinc-400 font-black uppercase tracking-widest mb-6 text-center">
              {showPaymentModal.nazivEn} {showPaymentModal.volume ? showPaymentModal.volume : ''}
            </p>
            
            <div className="w-full mb-6 p-4 bg-[#FF8C00]/10 border border-[#FF8C00]/50 rounded-xl text-center">
                <p className="text-[10px] text-zinc-300 font-black uppercase tracking-widest mb-1">
                    ⚠️ IMPORTANT
                </p>
                <p className="text-[12px] text-white font-bold mb-1">
                    Send proof of payment to:
                </p>
                <p className="text-[16px] text-[#FF8C00] font-black uppercase tracking-wider">
                    aitoolsprosmart@gmail.com
                </p>
            </div>
            
            <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-[#0a0a0a] flex flex-col items-center shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF8C00] to-transparent opacity-50"></div>
              
                <div className="w-full text-left text-[11px] uppercase tracking-wider text-zinc-300 space-y-3 font-mono">
                    <div className="pb-2 border-b border-white/5">
                        <span className="text-zinc-600 block text-[9px] mb-1 font-sans font-black">BENEFICIARY</span>
                        <strong className="text-white text-[13px]">GORAN DAMNJANOVIĆ</strong><br/>
                        <span className="text-zinc-400 text-[10px]">VUČKA MILIĆEVIĆA 117, GROCKA, REPUBLIC OF SERBIA</span>
                    </div>
                    <div className="pb-2 border-b border-white/5">
                        <span className="text-zinc-600 block text-[9px] mb-1 font-sans font-black">BENEFICIARY'S BANK</span>
                        <strong className="text-zinc-300">KOMERCIJALNA BANKA AD BEOGRAD</strong><br/>
                        <span className="text-zinc-400 text-[10px]">SVETOG SAVE 14, 11000 BELGRADE, REPUBLIC OF SERBIA</span>
                    </div>
                    <div className="pb-2 border-b border-white/5 flex justify-between items-center">
                        <div>
                          <span className="text-zinc-600 block text-[9px] mb-1 font-sans font-black">SWIFT / BIC</span>
                          <strong className="text-[#FF8C00] text-[13px]">KOBBRSBG</strong>
                        </div>
                    </div>
                    <div className="pb-2 border-b border-white/5">
                        <span className="text-zinc-600 block text-[9px] mb-1 font-sans font-black">IBAN / ACCOUNT NUMBER</span>
                        <strong className="text-[#FF8C00] select-all tracking-widest text-[14px]">RS35205903102884947363</strong>
                    </div>
                    <div className="pb-3 border-b border-white/5">
                        <span className="text-zinc-600 block text-[9px] mb-1 font-sans font-black">INTERMEDIARY BANK</span>
                        <strong className="text-zinc-400">DEUTSCHE BANK AG, FRANKFURT AM MAIN, GERMANY</strong><br/>
                        <span className="text-zinc-500 text-[10px]">SWIFT: DEUTDEFF</span>
                    </div>
                    <div className="pt-2 flex justify-between items-end">
                        <span className="text-zinc-600 font-sans font-black text-[10px]">TOTAL TO PAY:</span>
                        <strong className="text-white text-[24px] leading-none">${getGlobalCena(showPaymentModal.cena)}</strong>
                    </div>
                </div>
            </div>
            
            <button onClick={() => setShowPaymentModal(null)} className="absolute top-4 right-4 bg-white/5 p-2 rounded-full text-zinc-500 hover:text-[#FF8C00] hover:bg-[#FF8C00]/10 transition-all">
              <X size={20} strokeWidth={3} />
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default V8StockBerza;