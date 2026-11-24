// FAJL: src/ux/V10MyVault.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Folder, Lock, Loader2, ArrowLeft, DownloadCloud, Play, AlertTriangle, CheckCircle, Layers } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

import V10LicenseGenerator from './V10LicenseGenerator';

const V10MyVault = () => {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);
  const [resolvedProjects, setResolvedProjects] = useState([]);
  
  const [isBatchActive, setIsBatchActive] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  useEffect(() => {
    let unsubDoc = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        const docRef = doc(db, "checkout_requests", email);

        unsubDoc = onSnapshot(docRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const isPaidStatus = data.status === 'paid' || data.status === 'completed_verified' || data.status === 'ACTIVE';
            setClientData({ email, ...data });

            // Kada je uplata potvrđena, povlačimo prave linkove iz privatnog sefa
            if (isPaidStatus && Array.isArray(data.selectedProjects)) {
              const enriched = await Promise.all(
                data.selectedProjects.map(async (proj) => {
                  if (proj.driveLink) return proj;
                  try {
                    const vaultSnap = await getDoc(doc(db, "v10_project_vault_links", proj.id));
                    if (vaultSnap.exists()) {
                      const vData = vaultSnap.data();
                      return {
                        ...proj,
                        driveLink: vData.driveLink || proj.driveLink || "",
                        psdLink: vData.psdLink || ""
                      };
                    }
                  } catch (err) {
                    console.error("Vault link fetch error for", proj.id, err);
                  }
                  return proj;
                })
              );
              setResolvedProjects(enriched);
            } else {
              setResolvedProjects(data.selectedProjects || []);
            }
          } else {
            setClientData(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Greška pri učitavanju trezora:", error);
          setLoading(false);
        });
      } else {
        setClientData(null);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, []);

  const startBatchDownload = async () => {
    const validProjects = resolvedProjects.filter(p => p.driveLink);
    if (validProjects.length === 0) return;
    
    setIsBatchActive(true);
    
    for (let i = 0; i < validProjects.length; i++) {
      setBatchProgress(i + 1);
      const link = document.createElement('a');
      link.href = validProjects[i].driveLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
      <div className="min-h-screen bg-[#121722] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!clientData) {
    return (
      <div className="min-h-screen bg-[#121722] flex flex-col items-center justify-center p-4 font-sans">
        <Lock className="w-16 h-16 text-slate-700 mb-6" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Vault Access Denied</h1>
        <p className="text-slate-400 uppercase tracking-widest text-xs font-bold mb-8">No active licenses found for your account.</p>
        <Link to="/ui-ux/vault" className="bg-amber-400 text-[#121722] font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all hover:bg-amber-300">
          Return to Public Vault
        </Link>
      </div>
    );
  }

  const { company, selectedPackage, status, email, price } = clientData;
  const isPaid = status === 'paid' || status === 'completed_verified' || status === 'ACTIVE';
  const hasMultipleFiles = resolvedProjects.filter(p => p.driveLink).length > 1;

  return (
    <div className="min-h-screen bg-[#121722] pt-24 pb-20 px-4 sm:px-8 relative selection:bg-amber-400 selection:text-[#121722] font-sans">
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_top,_rgba(245,158,11,0.08)_0%,_transparent_55%)]"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/ui-ux/vault" className="inline-flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors bg-[#171e2c] px-4 py-2.5 rounded-full border border-white/10 hover:border-amber-400/50 shadow-lg mb-10 text-xs font-black uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back to Vault
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest mb-2">
              Client <span className="text-amber-400">Vault</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" /> Encrypted Delivery Portal
            </p>
          </div>
          <div className="mt-6 md:mt-0 text-right">
            <span className="block text-slate-400 text-[10px] uppercase tracking-widest mb-1">Authorized Entity</span>
            <span className="block text-white font-black uppercase tracking-widest text-lg">{company || email}</span>
          </div>
        </div>

        {!isPaid ? (
          <div className="bg-gradient-to-b from-[#171e2c] to-[#0d121b] border border-amber-400/30 rounded-3xl p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <Lock className="w-16 h-16 text-amber-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-4">Awaiting Payment Verification</h2>
            <p className="text-slate-300 font-medium leading-relaxed max-w-lg mx-auto">
              Your request for <strong className="text-amber-400">{selectedPackage}</strong> is securely logged. 
              Master assets and official EULA licensing will unlock automatically in real time as soon as payment clears.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* SEKCIJA 1: LICENCA */}
            <div className="bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-amber-400/35 rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.55)] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-400/[0.04] to-transparent pointer-events-none"></div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2 relative z-10">
                <div>
                  <h2 className="text-xl font-black text-amber-400 uppercase tracking-widest mb-1">Official EULA License</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Legally binds assets to your company</p>
                </div>
                <div className="w-full md:w-auto">
                  <V10LicenseGenerator 
                    clientEmail={email} 
                    companyName={company} 
                    packageName={selectedPackage} 
                    price={price || 0}
                    selectedProjects={resolvedProjects}
                  />
                </div>
              </div>
            </div>

            {/* SEKCIJA 2: BATCH DOWNLOAD */}
            {hasMultipleFiles && (
              <div className="bg-gradient-to-b from-[#171e2c] to-[#0d121b] border border-blue-400/30 rounded-3xl p-8 shadow-xl">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-400/30 shrink-0">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black uppercase tracking-widest mb-1">Sequential Download Protocol Active</h3>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-2xl">
                      To prevent browser memory crashes from processing multiple massive 150MP Master files simultaneously, archives initiate sequentially <strong className="text-blue-400">every 10 seconds.</strong> Allow pop-ups and keep this tab open.
                    </p>
                  </div>
                </div>

                <button 
                  onClick={startBatchDownload} 
                  disabled={isBatchActive}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-[#121722] disabled:text-slate-500 text-white font-black uppercase tracking-widest py-5 rounded-xl flex items-center justify-center gap-3 transition-all cursor-pointer border border-blue-400/50 shadow-lg"
                >
                  {isBatchActive ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-blue-300" />
                      SYSTEM PROCESSING ({batchProgress} / {resolvedProjects.length})
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" /> EXECUTE MASTER DOWNLOAD (ALL ASSETS)
                    </>
                  )}
                </button>
                
                {isBatchActive && (
                  <div className="w-full bg-[#121722] rounded-full h-1.5 mt-4 overflow-hidden">
                    <div 
                      className="bg-blue-400 h-1.5 transition-all duration-500" 
                      style={{ width: `${(batchProgress / resolvedProjects.length) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            {/* SEKCIJA 3: POJEDINAČNI FAJLOVI */}
            <div>
              <h3 className="text-white font-black uppercase tracking-widest mb-6 flex items-center gap-3 border-b border-white/10 pb-4 mt-4">
                <Folder className="w-5 h-5 text-amber-400" /> Individual Source Files ({resolvedProjects.length})
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {resolvedProjects.map((project, index) => {
                  const isThisDownloading = isBatchActive && batchProgress === (index + 1);
                  const isDone = isBatchActive && batchProgress > (index + 1);
                  
                  return (
                    <div key={index} className={`bg-gradient-to-b from-[#171e2c] to-[#0d121b] border rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-all shadow-lg ${isThisDownloading ? 'border-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.25)]' : 'border-white/10 hover:border-amber-400/40'}`}>
                      <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm md:text-lg mb-1">{project.title}</h4>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Master 150MP & PSD Archive</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        {isThisDownloading && <span className="text-blue-400 text-[10px] font-black uppercase animate-pulse">Requesting...</span>}
                        {isDone && <CheckCircle className="w-4 h-4 text-emerald-400" />}

                        {project.psdLink && (
                          <a 
                            href={project.psdLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className="px-5 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 border bg-cyan-500/10 text-cyan-400 border-cyan-400/30 hover:bg-cyan-400 hover:text-[#121722]"
                          >
                            <Layers className="w-4 h-4" /> Master PSD
                          </a>
                        )}

                        {project.driveLink ? (
                          <a 
                            href={project.driveLink} 
                            target="_blank" 
                            rel="noreferrer"
                            className={`px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 shadow-lg border ${isThisDownloading ? 'bg-blue-600/20 text-blue-300 border-blue-400/50' : 'bg-[#121722] hover:bg-amber-400 text-white hover:text-[#121722] border-white/15 hover:border-amber-400'}`}
                          >
                            <DownloadCloud className="w-4 h-4" /> {isThisDownloading ? 'INITIATING' : 'Download ZIP'}
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-[#121722] rounded-lg border border-white/10">
                            Link Pending
                          </span>
                        )}
                      </div>
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

export default V10MyVault;