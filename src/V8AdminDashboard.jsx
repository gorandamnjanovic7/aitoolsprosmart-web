import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Zap, Image as ImageIcon, CheckCircle, Power, QrCode, PlayCircle } from 'lucide-react';
import { v8Toast } from './App';

// 🔥 FIREBASE IMPORTS 🔥
import { db } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// 🔧 IMPORT TOOLS
import V8PixarSelfiePage from './V8PixarSelfiePage'; 

// POČETAK FUNKCIJE: V8AdminDashboard
const V8AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('payment_requests');
  const [promoVideo, setPromoVideo] = useState("");
  const [promoImages, setPromoImages] = useState("");

  // REAL DATABASE DATA
  const [requests, setRequests] = useState([]);

  // POČETAK FUNKCIJE: useEffect (Slušanje baze uživo)
  useEffect(() => {
    // Monitoring all customers who initiated payment but aren't verified yet
    const q = query(collection(db, "v8_kupci"), orderBy("vreme", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Filter only pending requests (isPaid is not true)
      setRequests(list.filter(z => !z.isPaid));
    });

    return () => unsubscribe();
  }, []);
  // KRAJ FUNKCIJE: useEffect

  // POČETAK FUNKCIJE: otkljucajKlijentu
  const otkljucajKlijentu = async (id) => {
    try {
      const clientRef = doc(db, "v8_kupci", id);
      
      // Update isPaid to true - this triggers the unlock for the client
      await updateDoc(clientRef, { 
        isPaid: true,
        approvalTime: serverTimestamp() 
      });

      if(typeof v8Toast !== 'undefined') v8Toast.success("Payment confirmed! Digital assets unlocked.");
    } catch (err) {
      console.error("Unlock error:", err);
      if(typeof v8Toast !== 'undefined') v8Toast.error("Engine Error: Could not update status.");
    }
  };
  // KRAJ FUNKCIJE: otkljucajKlijentu

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
          <button 
            onClick={() => setActiveTab('payment_requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'payment_requests' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <QrCode className="w-4 h-4" /> Payment Approvals
            {requests.length > 0 && (
              <span className="ml-auto bg-red-600 text-white text-[9px] px-2 py-0.5 rounded-full">{requests.length}</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('promo_10x')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'promo_10x' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30 shadow-[0_0_15px_rgba(234,88,12,0.1)]' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Zap className="w-4 h-4" /> 10X Ad Config
          </button>

          <button 
            onClick={() => setActiveTab('v8_alati')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'v8_alati' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Zap className="w-4 h-4" /> V8 Master Tools
          </button>

          <button 
            onClick={() => setActiveTab('klijenti')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'klijenti' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}
          >
            <Users className="w-4 h-4" /> Client Database
          </button>
        </div>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <Power className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (RIGHT) */}
      <div className="ml-64 flex-1 p-10">
        
        {/* TAB 1: PAYMENT APPROVALS */}
        {activeTab === 'payment_requests' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">PAYMENT APPROVALS</h1>
                <p className="text-zinc-500 text-[12px] font-bold tracking-widest uppercase">Clients awaiting digital asset activation</p>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2rem] p-2 shadow-[0_0_40px_rgba(234,88,12,0.05)]">
              {requests.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <CheckCircle className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-widest text-zinc-500">System clear. All requests processed.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-6 rounded-3xl bg-[#050505] border border-white/5 hover:border-orange-500/30 transition-all">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                          <ImageIcon className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-black uppercase tracking-widest text-white">{r.ime || r.klijent}</h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                            Request: <span className="text-orange-400">{r.zeliPaket || r.film}</span> • {r.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[9px] font-black uppercase tracking-widest">
                          Pending Verification (${Math.ceil(r.cenaPaketa / 117)})
                        </div>
                        <button 
                          onClick={() => otkljucajKlijentu(r.id)}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                        >
                          CONFIRM & UNLOCK
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 3: PROMO SETTINGS */}
        {activeTab === 'promo_10x' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-[#0a0a0a] border border-orange-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(234,88,12,0.1)] mb-8">
            <div className="flex items-center gap-3 mb-8 border-b border-orange-500/20 pb-4">
              <Zap className="w-8 h-8 text-orange-500" />
              <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">
                10X Ad Configuration
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-orange-500" /> Hero Video Asset (URL)
                </label>
                <input 
                  type="text" 
                  value={promoVideo} 
                  onChange={(e) => setPromoVideo(e.target.value)} 
                  className="w-full bg-black border border-white/10 hover:border-orange-500/50 focus:border-orange-500 rounded-xl p-4 text-[13px] text-white transition-all outline-none"
                  placeholder="Enter direct MP4 link" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-orange-500" /> Image Strip (Comma separated URLs)
                </label>
                <textarea 
                  value={promoImages} 
                  onChange={(e) => setPromoImages(e.target.value)} 
                  className="w-full bg-black border border-white/10 hover:border-orange-500/50 focus:border-orange-500 rounded-xl p-4 text-[13px] text-white transition-all outline-none resize-none font-mono leading-relaxed"
                  placeholder="link1.jpg, link2.jpg, link3.jpg"
                  rows="5"
                />
              </div>

              <button 
                onClick={() => v8Toast.success("Ad Config Deployed! V8 Power!")}
                className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-8 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-2 w-full md:w-auto self-end"
              >
                <CheckCircle className="w-5 h-5" /> Commit Changes
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB 2: OVERRIDE TOOLS */}
        {activeTab === 'v8_alati' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-black uppercase tracking-widest text-orange-500 mb-2">MASTER OVERRIDE ACTIVE</h1>
              <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">Global paywalls are currently bypassed for admin preview.</p>
            </div>
            <div className="scale-[0.9] origin-top -mt-10"> 
              <V8PixarSelfiePage isAdmin={true} />
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: V8AdminDashboard

export default V8AdminDashboard;