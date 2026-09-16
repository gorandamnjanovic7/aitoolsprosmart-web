// FAJL: src/ux/V10MyVault.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Folder, Lock, Loader2, ArrowLeft, DownloadCloud, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import V10LicenseGenerator from './V10LicenseGenerator';

// POČETAK FUNKCIJE: V10MyVault
const V10MyVault = () => {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  
  // 🔥 NOVI STATE ZA BATCH DOWNLOAD 🔥
  const [isBatchActive, setIsBatchActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const email = user.email.toLowerCase();
          const docRef = doc(db, "checkout_requests", email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setClientData({ email, ...docSnap.data() });
          }
        } catch (error) {
          console.error("Greška pri učitavanju trezora:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);

  // 🔥 BATCH DOWNLOAD LOGIKA NA 10 SEKUNDI 🔥
  const startBatchDownload = async () => {
    const validProjects = (clientData?.selectedProjects || []).filter(p => p.driveLink);
    if (validProjects.length === 0) return;
    
    setIsBatchActive(true);
    
    for (let i = 0; i < validProjects.length; i++) {
      setBatchProgress(i + 1);
      
      // Programsko okidanje preuzimanja fajla
      const link = document.createElement('a');
      link.href = validProjects[i].driveLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Pauza od tačno 10 sekundi (osim za poslednji fajl)
      if (i < validProjects.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    }
    
    setTimeout(() => {
      setIsBatchActive(false);
      setBatchProgress(0);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#ff6a00] animate-spin" />
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-4">
        <Lock className="w-16 h-16 text-zinc-800 mb-6" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Vault Access Denied</h1>
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-8">No active licenses found for your account.</p>
        <Link to="/ui-ux/vault" className="bg-[#ff6a00] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,106,0,0.4)] transition-all hover:bg-orange-500">
          Return to Public Vault
        </Link>
      </div>
    );
  }

  const { company, selectedPackage, status, selectedProjects = [], email, price } = clientData;
  const isPaid = status === 'paid' || status === 'completed_verified' || status === 'ACTIVE';
  const hasMultipleFiles = selectedProjects.length > 1;

  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-20 px-4 sm:px-8 relative selection:bg-[#ff6a00] selection:text-black font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,106,0,0.08)_0%,_transparent_50%)]"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <Link to="/ui-ux/vault" className="inline-flex items-center gap-2 text-zinc-500 hover:text-[#ff6a00] transition-colors mb-10 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Main Site
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-2">
              Client <span className="text-[#ff6a00]">Vault</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ff6a00]" /> Encrypted Delivery Portal
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <span className="block text-zinc-400 text-[10px] uppercase tracking-widest mb-1">Authorized Entity</span>
            <span className="block text-white font-black uppercase tracking-widest text-lg">{company || email}</span>
          </div>
        </div>

        {!isPaid ? (
          <div className="bg-[#050505] border border-orange-500/30 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(255,106,0,0.1)]">
            <Lock className="w-16 h-16 text-[#ff6a00] mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,106,0,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Awaiting Payment Verification</h2>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto">
              Your request for <strong className="text-white">{selectedPackage}</strong> is securely logged. 
              Master assets and official EULA licensing will be unlocked immediately upon payment gateway clearance.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* SEKCIJA 1: LICENCA */}
            <div className="bg-gradient-to-br from-[#110500] to-[#050100] border border-[#ff6a00]/30 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(255,106,0,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2 relative z-10">
                <div>
                  <h2 className="text-xl font-black text-[#ff6a00] uppercase tracking-widest mb-1">Official EULA License</h2>
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Legally binds assets to your company</p>
                </div>
                <div className="w-full md:w-auto">
                  <V10LicenseGenerator 
                    clientEmail={email} 
                    companyName={company} 
                    packageName={selectedPackage} 
                    price={price || 0}
                    selectedProjects={selectedProjects}
                  />
                </div>
              </div>
            </div>

            {/* 🔥 SEKCIJA 2: BATCH DOWNLOAD PROTOCOL 🔥 */}
            {hasMultipleFiles && (
              <div className="bg-[#0a0a0a] border border-blue-500/30 rounded-3xl p-8 shadow-xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-widest mb-1">Sequential Download Protocol Active</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed max-w-2xl">
                      To prevent browser memory crashes and bandwidth overload from processing multiple massive 150MP Master files simultaneously, the system will deliver your ZIP archives sequentially. <strong className="text-blue-400">A new download will automatically initiate every 10 seconds.</strong> Please ensure pop-ups are allowed and keep this tab open until completion.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={startBatchDownload} 
                  disabled={isBatchActive}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-black uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer border border-blue-500/50"
                >
                  {isBatchActive ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      SYSTEM PROCESSING ({batchProgress} / {selectedProjects.length})
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> EXECUTE MASTER DOWNLOAD (ALL ASSETS)
                    </>
                  )}
                </button>
                
                {isBatchActive && (
                  <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-1.5 transition-all duration-500" 
                      style={{ width: `${(batchProgress / selectedProjects.length) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* SEKCIJA 3: MASTER FAJLOVI POJEDINAČNO */}
            <div>
              <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-white/10 pb-4 mt-4">
                <Folder className="w-5 h-5 text-zinc-500" /> Individual Source Files ({selectedProjects.length})
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {selectedProjects.map((project, index) => {
                  const isThisDownloading = isBatchActive && batchProgress === (index + 1);
                  const isDone = isBatchActive && batchProgress > (index + 1);
                  
                  return (
                    <div key={index} className={`bg-[#0a0a0a] border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all ${isThisDownloading ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/5 hover:border-white/20'}`}>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm md:text-lg mb-1">{project.title}</h4>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Master PSD / ZIP Archive</p>
                      </div>
                      
                      {project.driveLink ? (
                        <div className="flex items-center gap-3 w-full md:w-auto">
                          {isThisDownloading && <span className="text-blue-400 text-[10px] font-black uppercase animate-pulse">Requesting...</span>}
                          {isDone && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                          <a 
                            href={project.driveLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`w-full md:w-auto px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg border ${isThisDownloading ? 'bg-blue-600/20 text-blue-400 border-blue-500/50' : 'bg-zinc-900 hover:bg-[#ff6a00] text-white hover:text-black border-white/10 hover:border-[#ff6a00]'}`}
                          >
                            <DownloadCloud className="w-4 h-4" /> {isThisDownloading ? 'INITIATING' : 'Manual DL'}
                          </a>
                        </div>
                      ) : (
                        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-zinc-900 rounded-lg border border-white/5">
                          Link Pending
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
// KRAJ FUNKCIJE: V10MyVault

export default V10MyVault;