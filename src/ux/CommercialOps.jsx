// FAJL: CommercialOps.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ShieldCheck, Clock, CheckCircle, Trash2, Mail, 
  DollarSign, LayoutDashboard, PackageSearch, DownloadCloud, Loader2, Lock, ArrowLeft, RefreshCw, AlertTriangle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_EMAILS = [
  "damnjanovicgoran7@gmail.com",
  "aitoolsprosmart@gmail.com",
  "info@aitoolsprosmart.com"
];

const getMillis = (ts) => {
  if (!ts) return 0;
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (typeof ts.toDate === 'function') return ts.toDate().getTime();
  if (ts.seconds) return ts.seconds * 1000;
  const parsed = new Date(ts).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
};

const CommercialOps = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbError, setDbError] = useState(null);

  const sortDocs = (docsArray) => {
    return [...docsArray].sort((a, b) => {
      const timeA = getMillis(a.timestamp || a.paidAt || a.createdAt);
      const timeB = getMillis(b.timestamp || b.paidAt || b.createdAt);
      return timeB - timeA;
    });
  };

  const manualFetch = useCallback(async () => {
    setLoading(true);
    setDbError(null);
    try {
      const snap = await getDocs(collection(db, "checkout_requests"));
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setRequests(sortDocs(data));
    } catch (err) {
      console.error("Manual fetch error:", err);
      setDbError(err.message || "Firestore permission or network error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let unsubFirestore = null;
    let safetyTimer = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      const email = user?.email?.toLowerCase() || "";
      if (user && ADMIN_EMAILS.includes(email)) {
        setIsAdmin(true);
        setAuthChecking(false);
        setDbError(null);

        safetyTimer = setTimeout(() => {
          manualFetch();
        }, 5000);

        unsubFirestore = onSnapshot(
          collection(db, "checkout_requests"),
          (snapshot) => {
            if (safetyTimer) clearTimeout(safetyTimer);
            const data = snapshot.docs.map(d => ({
              id: d.id,
              ...d.data()
            }));
            setRequests(sortDocs(data));
            setDbError(null);
            setLoading(false);
          },
          (error) => {
            if (safetyTimer) clearTimeout(safetyTimer);
            console.error("Error fetching Commercial Ops requests:", error);
            setDbError(error.message || "Permission denied on checkout_requests.");
            setLoading(false);
          }
        );
      } else {
        setIsAdmin(false);
        setAuthChecking(false);
        setLoading(false);
      }
    });

    return () => {
      unsubAuth();
      if (unsubFirestore) unsubFirestore();
      if (safetyTimer) clearTimeout(safetyTimer);
    };
  }, [manualFetch]);

  const markAsPaid = async (req) => {
    if (window.confirm(`Potvrđujete uplatu za ${req.email || req.id}? Klijent odmah dobija pristup u svom Client Vault-u.`)) {
      try {
        await updateDoc(doc(db, "checkout_requests", req.id), {
          status: 'paid',
          paidAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Update error:", error);
        alert("Greška pri ažuriranju statusa: " + error.message);
      }
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Da li ste sigurni da želite trajno da obrišete ovaj zahtev?")) {
      try {
        await deleteDoc(doc(db, "checkout_requests", id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Greška pri brisanju: " + error.message);
      }
    }
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#121722] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#121722] flex flex-col items-center justify-center p-6 text-center font-sans">
        <Lock className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Restricted Admin Sector</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Sign in with an authorized administrator account to access Commercial Ops.</p>
        <Link to="/ui-ux" className="px-8 py-4 bg-amber-400 text-[#121722] font-black uppercase tracking-widest text-xs rounded-xl hover:bg-amber-300 transition-colors">
          Return to UI/UX Hub
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121722] font-sans text-slate-300 pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,158,11,0.08)_0%,_transparent_55%)] pointer-events-none"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">

        {/* GORNJA NAVIGACIJA NAZAD + REFRESH */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link 
            to="/ui-ux" 
            className="inline-flex items-center gap-2.5 text-slate-300 hover:text-amber-400 transition-colors bg-[#171e2c] px-4 py-2.5 rounded-full border border-white/10 hover:border-amber-400/50 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[11px] font-black uppercase tracking-widest">Back to UI/UX Hub</span>
          </Link>

          <button
            onClick={manualFetch}
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-[#171e2c] px-4 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-[11px] font-black uppercase tracking-widest cursor-pointer shadow-lg"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            Refresh Data
          </button>
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 mb-4">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase">Admin Sector</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider flex items-center gap-4 drop-shadow-md">
              <LayoutDashboard className="w-10 h-10 text-amber-400" /> Commercial Ops
            </h1>
            <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mt-3">
              Live monitor for V10 Vault checkouts and cart items.
            </p>
          </div>
          
          <div className="bg-[#171e2c] border border-white/10 p-4 rounded-2xl flex items-center gap-6 shadow-2xl">
            <div className="text-center">
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">Total Orders</p>
              <p className="text-2xl font-black text-white">{requests.length}</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[9px] text-amber-400 uppercase tracking-widest font-black mb-1">Pending</p>
              <p className="text-2xl font-black text-amber-400">{requests.filter(r => r.status !== 'paid').length}</p>
            </div>
          </div>
        </div>

        {/* TABELA ILI PORUKA */}
        <div className="bg-gradient-to-b from-[#171e2c] to-[#0d121b] border border-white/10 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
              <p className="text-amber-400 text-xs font-black uppercase tracking-widest animate-pulse">Syncing Database...</p>
            </div>
          ) : dbError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Firestore Access Blocked</h3>
              <p className="text-red-400 text-xs font-mono max-w-xl mb-6">{dbError}</p>
              <button onClick={manualFetch} className="px-6 py-3 bg-amber-400 text-[#121722] font-black uppercase tracking-widest text-xs rounded-xl cursor-pointer">
                Retry Connection
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
              <PackageSearch className="w-20 h-20 text-slate-700 mb-6" />
              <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest mb-2">Vault is Empty</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Waiting for client checkouts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0d121b]/80 border-b border-white/10">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status & Date</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Client Info</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Tier / Value</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-amber-400">Selected Products (Cart)</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {requests.map((req) => {
                      const ms = getMillis(req.timestamp || req.paidAt);
                      return (
                        <motion.tr 
                          key={req.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-colors group"
                        >
                          <td className="p-5 align-top">
                            <div className="flex flex-col gap-3 items-start">
                              {req.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                  <CheckCircle className="w-3 h-3" /> Cleared
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] font-black uppercase tracking-widest">
                                  <Clock className="w-3 h-3" /> Pending
                                </span>
                              )}
                              <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">
                                {ms ? new Date(ms).toLocaleString('en-GB') : 'No Timestamp'}
                              </span>
                            </div>
                          </td>

                          <td className="p-5 align-top">
                            <div className="flex flex-col">
                              <span className="text-white font-bold text-sm mb-1">{req.email || req.id}</span>
                              {req.company && <span className="text-slate-400 text-xs font-medium">{req.company}</span>}
                              {req.vatNumber && <span className="text-slate-500 text-[10px] font-mono mt-0.5">VAT: {req.vatNumber}</span>}
                              {req.country && <span className="text-slate-500 text-[10px] uppercase tracking-wider mt-0.5">{req.country}</span>}
                            </div>
                          </td>

                          <td className="p-5 align-top">
                            <div className="flex flex-col">
                              <span className="text-amber-400 font-black text-[10px] uppercase tracking-widest mb-1">{req.selectedPackage || "N/A"}</span>
                              <span className="flex items-center gap-1 text-white font-black text-lg">
                                <DollarSign className="w-4 h-4 text-emerald-400" />
                                {req.price || "0"}
                              </span>
                            </div>
                          </td>

                          <td className="p-5 align-top max-w-xs">
                            {req.selectedProjects && req.selectedProjects.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {req.selectedProjects.map((project, index) => (
                                  <div key={index} className="bg-[#121722] border border-white/10 rounded-lg p-2 flex items-center justify-between group/link">
                                    <span className="text-slate-200 text-[10px] font-bold uppercase tracking-widest truncate mr-2">
                                      {index + 1}. {project.title}
                                    </span>
                                    {project.driveLink ? (
                                      <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" title="Open Google Drive ZIP">
                                        <DownloadCloud className="w-4 h-4" />
                                      </a>
                                    ) : (
                                      <span className="text-slate-500 text-[9px] uppercase tracking-widest">Vault Linked</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500 text-[10px] uppercase tracking-widest italic">No items in cart yet</span>
                            )}
                          </td>

                          <td className="p-5 align-top text-right">
                            <div className="flex items-center justify-end gap-3 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                              {req.status !== 'paid' && (
                                <button 
                                  onClick={() => markAsPaid(req)}
                                  className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-[#121722] flex items-center justify-center transition-all border border-emerald-500/20 cursor-pointer"
                                  title="Mark as Paid"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              
                              <a 
                                href={`mailto:${req.email}?subject=Vault Access Authorized - AI TOOLS PRO SMART&body=Hi,%0D%0A%0D%0AYour payment for ${req.selectedPackage} has been cleared. Your master files and official EULA license are now unlocked in your Client Vault.%0D%0A%0D%0ABest regards,%0D%0AGoran Damnjanovic%0D%0AVisionary Factory V10`}
                                className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all border border-blue-500/20"
                                title="Send Confirmation Email"
                              >
                                <Mail className="w-4 h-4" />
                              </a>

                              <button 
                                onClick={() => deleteRequest(req.id)}
                                className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-500/20 cursor-pointer"
                                title="Delete Checkout Request"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommercialOps;