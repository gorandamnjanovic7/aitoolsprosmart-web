// POČETAK FAJLA: V8AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Zap, Image as ImageIcon, CheckCircle, Power, Activity, PlayCircle, Loader2, UploadCloud, Trash2, DollarSign, Calendar, Link as LinkIcon } from 'lucide-react';
import { v8Toast } from './App';

// 🔥 FIREBASE IMPORTS 🔥
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp, getDoc, setDoc, addDoc } from 'firebase/firestore';

// 🔧 IMPORT TOOLS
import * as data from './data'; 

// POČETAK FUNKCIJE: V8AdminDashboard
const V8AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('live_sales');
  const [sales, setSales] = useState([]);

  // --- LEMON SQUEEZY STATE ---
  const [lemonLink, setLemonLink] = useState("");

  const simulateLemonWebhook = async () => {
    try {
      await addDoc(collection(db, "v8_kupci"), {
        ime: "V8 VIP Client",
        email: "boss@visionary.com",
        zeliPaket: "10X ENHANCER LIFETIME",
        cenaPaketa: 199.99 * 117, 
        vreme: serverTimestamp(),
        isPaid: true
      });
      if(typeof v8Toast !== 'undefined') v8Toast.success("INCOMING SIGNAL: Webhook Received!");
    } catch (e) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Radar error!");
    }
  };

  const [promoVideo, setPromoVideo] = useState("");
  const [promoImagesArray, setPromoImagesArray] = useState([]);
  const [isUploadingPromo, setIsUploadingPromo] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "v8_kupci"), orderBy("vreme", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(list.filter(z => z.isPaid));
    });
    return () => unsubscribe();
  }, []);

  // UCITAVANJE SVIH PODATAKA IZ BAZE (Promo i Lemon)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Promo config
        const promoSnap = await getDoc(doc(db, "v8_settings", "promo10x"));
        if (promoSnap.exists()) {
          setPromoVideo(promoSnap.data().videoUrl || "");
          setPromoImagesArray(promoSnap.data().images || []);
        }

        // Lemon config
        const lemonSnap = await getDoc(doc(db, "v8_settings", "lemon"));
        if (lemonSnap.exists()) {
          setLemonLink(lemonSnap.data().checkoutUrl || "");
        }
      } catch (err) {
        console.error("Database fetch error", err);
      }
    };
    fetchData();
  }, []);

  const handleUploadPromoImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPromo(true);
    
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); 
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      
      const newImagesArray = [...promoImagesArray, resData.secure_url];
      setPromoImagesArray(newImagesArray);
      
      await setDoc(doc(db, "v8_settings", "promo10x"), { images: newImagesArray }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Image added to 10X Strip!");
    } catch (err) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Upload failed!");
    } finally {
      setIsUploadingPromo(false);
    }
  };

  const handleDeletePromoImage = async (urlToDelete) => {
    if (window.confirm("Delete this image?")) {
      const newImagesArray = promoImagesArray.filter(url => url !== urlToDelete);
      setPromoImagesArray(newImagesArray);
      await setDoc(doc(db, "v8_settings", "promo10x"), { images: newImagesArray }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Image removed.");
    }
  };

  const handleSavePromoConfig = async () => {
    try {
      await setDoc(doc(db, "v8_settings", "promo10x"), { 
        videoUrl: promoVideo,
        images: promoImagesArray 
      }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Ad Config Deployed!");
    } catch (e) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Database save error.");
    }
  };

  // --- SAVE LEMON LINK ---
  const handleSaveLemonLink = async () => {
    try {
      await setDoc(doc(db, "v8_settings", "lemon"), { checkoutUrl: lemonLink }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Lemon Squeezy link saved! 🍋");
    } catch (e) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Error saving Lemon link.");
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex pt-20">
      
      {/* SIDEBAR (LEFT MENU) */}
      <div className="w-64 bg-[#0a0a0a] border-r border-orange-500/20 flex flex-col fixed h-full z-20 shadow-[10px_0_30px_rgba(234,88,12,0.05)]">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="font-black text-[14px] uppercase tracking-widest text-white">V8 MASTER</h2>
            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Control Room</p>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('live_sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'live_sales' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Activity className="w-4 h-4" /> Live Sales Radar
            {sales.length > 0 && <span className="ml-auto bg-green-600 text-white text-[9px] px-2 py-0.5 rounded-full">{sales.length}</span>}
          </button>

          {/* NOVI LEMON SQUEEZY TAB */}
          <button onClick={() => setActiveTab('lemon_blagajna')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'lemon_blagajna' ? 'bg-yellow-400/10 text-yellow-500 border border-yellow-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <span className="text-[14px]">🍋</span> Limun Blagajna
          </button>

          <button onClick={() => setActiveTab('promo_10x')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'promo_10x' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Zap className="w-4 h-4" /> 10X Ad Config
          </button>

          <button onClick={() => setActiveTab('v8_alati')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'v8_alati' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Zap className="w-4 h-4" /> V8 Master Tools
          </button>

          <button onClick={() => setActiveTab('klijenti')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'klijenti' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Users className="w-4 h-4" /> Client Database
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (RIGHT) */}
      <div className="ml-64 flex-1 p-10">
        
        {/* --- TAB: LIVE SALES --- */}
        {activeTab === 'live_sales' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between border-b border-orange-500/20 pb-6">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-orange-500" /> LIVE SALES RADAR
                </h1>
                <p className="text-zinc-500 text-[12px] font-bold tracking-widest uppercase">Automated V8 transaction feed via Lemon Squeezy</p>
              </div>

              <button onClick={simulateLemonWebhook} className="bg-green-600/20 text-green-500 border border-green-500/50 hover:bg-green-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Zap className="w-4 h-4" /> FIRE TEST WEBHOOK
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2rem] p-2">
              {sales.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <DollarSign className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-widest text-zinc-500">Awaiting incoming signals. The radar is clear.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[#050505] border border-white/5 hover:border-green-500/30 transition-all group">
                      
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center border border-green-500/30">
                          <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        
                        <div>
                          <h3 className="text-[14px] font-black uppercase tracking-widest text-white group-hover:text-green-400">
                            {sale.ime || sale.klijent || "Valued Client"}
                          </h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            {sale.email || "No email"}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-orange-400 text-[10px] font-black uppercase bg-orange-600/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                              {sale.zeliPaket || sale.film || "V8 Digital Asset"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 border-t border-white/5 md:border-none pt-4 md:pt-0">
                        <div className="text-2xl font-black text-white">
                          ${sale.cenaPaketa ? Math.ceil(sale.cenaPaketa / 117) : "0"}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                            <Calendar className="w-3 h-3" /> {formatTime(sale.vreme)}
                          </span>
                          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3" /> PAID
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* --- TAB: LEMON BLAGAJNA --- */}
        {activeTab === 'lemon_blagajna' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-yellow-500/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(234,179,8,0.1)] mb-8">
            <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
              <span className="text-5xl drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">🍋</span>
              <div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-white">
                  Limun <span className="text-yellow-400">Blagajna</span>
                </h2>
                <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Global Merchant of Record Integration</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-zinc-400 text-[12px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-yellow-400" /> Lemon Squeezy Checkout URL (Optimizer V8)
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={lemonLink} 
                    onChange={(e) => setLemonLink(e.target.value)} 
                    className="w-full bg-black/50 border border-yellow-500/20 hover:border-yellow-400/50 focus:border-yellow-400 focus:bg-black rounded-2xl p-5 text-[13px] text-white transition-all outline-none font-mono tracking-wider shadow-inner"
                    placeholder="https://your-store.lemonsqueezy.com/checkout/buy/..." 
                  />
                  {!lemonLink && (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-yellow-500/50 text-[10px] font-black uppercase tracking-widest animate-pulse pointer-events-none">
                      PASTE LINK HERE
                    </div>
                  )}
                </div>
                <p className="text-zinc-500 text-[10px] font-bold tracking-wider mt-1 ml-1 border-l-2 border-yellow-500/50 pl-2">Ovaj link će se automatski pojaviti na "Secure Checkout" dugmetu na V8 Optimizer stranici.</p>
              </div>

              <div className="border-t border-white/10 pt-8 flex justify-end">
                <button 
                  onClick={handleSaveLemonLink}
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Sačuvaj Limun Link
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: PROMO 10X --- */}
        {activeTab === 'promo_10x' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-[#0a0a0a] border border-orange-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(234,88,12,0.1)] mb-8">
            <div className="flex items-center gap-3 mb-8 border-b border-orange-500/20 pb-4">
              <Zap className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                10X Ad Configuration
              </h2>
            </div>
            
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-orange-500" /> Hero Video Asset (URL)
                </label>
                <input type="text" value={promoVideo} onChange={(e) => setPromoVideo(e.target.value)} className="w-full bg-black border border-white/10 hover:border-orange-500/50 focus:border-orange-500 rounded-xl p-4 text-[13px] text-white transition-all outline-none" placeholder="Enter direct MP4 link" />
              </div>

              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-500" /> Image Strip Gallery ({promoImagesArray.length})
                  </label>
                  
                  <label className="bg-orange-600/10 border border-orange-500/30 text-orange-500 hover:bg-orange-600 hover:text-white px-5 py-3 rounded-xl cursor-pointer transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    {isUploadingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} UPLOAD NEW IMAGE
                    <input type="file" accept="image/*" onChange={handleUploadPromoImage} className="hidden" disabled={isUploadingPromo} />
                  </label>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black p-4 rounded-xl border border-white/5 min-h-[120px]">
                   {promoImagesArray.length === 0 && (
                     <div className="col-span-full flex items-center justify-center text-zinc-600 text-[10px] uppercase font-black tracking-widest py-8">No images uploaded yet.</div>
                   )}
                   {promoImagesArray.map((url, i) => (
                       <div key={i} className="relative aspect-video rounded-lg overflow-hidden group border border-white/10 shadow-lg">
                          <img src={url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-300" alt={`Promo strip ${i}`} />
                          <button onClick={() => handleDeletePromoImage(url)} className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-[0_0_15px_rgba(220,38,38,0.6)]"><Trash2 className="w-4 h-4 text-white" /></button>
                       </div>
                   ))}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 flex justify-end">
                <button onClick={handleSavePromoConfig} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-2 w-full md:w-auto">
                  <CheckCircle className="w-5 h-5" /> Commit Video Config
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: OVERRIDE TOOLS --- */}
        {activeTab === 'v8_alati' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-black uppercase tracking-widest text-orange-500 mb-2">MASTER OVERRIDE ACTIVE</h1>
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Global paywalls are currently bypassed for admin preview.</p>
            </div>
            <p className="text-center text-zinc-500 mt-10">Tools currently offline.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: V8AdminDashboard

export default V8AdminDashboard;
// KRAJ FAJLA: V8AdminDashboard.jsx