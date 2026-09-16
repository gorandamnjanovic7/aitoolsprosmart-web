// FAJL: CommercialOps.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  ShieldCheck, Clock, CheckCircle, Trash2, Mail, 
  DollarSign, LayoutDashboard, PackageSearch, DownloadCloud, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// POČETAK FUNKCIJE: CommercialOps Komponenta
const CommercialOps = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // POČETAK FUNKCIJE: Učitavanje podataka (useEffect)
  useEffect(() => {
    const q = query(collection(db, "checkout_requests"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching Commercial Ops requests:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // KRAJ FUNKCIJE: Učitavanje podataka (useEffect)

  // POČETAK FUNKCIJE: Obeležavanje uplate
  const markAsPaid = async (id) => {
    if (window.confirm("Potvrđujete uplatu? Klijent će dobiti pristup fajlovima.")) {
      try {
        await updateDoc(doc(db, "checkout_requests", id), { status: 'paid' });
      } catch (error) {
        console.error("Update error:", error);
        alert("Greška pri ažuriranju statusa.");
      }
    }
  };
  // KRAJ FUNKCIJE: Obeležavanje uplate

  // POČETAK FUNKCIJE: Brisanje zahteva
  const deleteRequest = async (id) => {
    if (window.confirm("Da li ste sigurni da želite trajno da obrišete ovaj zahtev?")) {
      try {
        await deleteDoc(doc(db, "checkout_requests", id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("Greška pri brisanju.");
      }
    }
  };
  // KRAJ FUNKCIJE: Brisanje zahteva

  return (
    <div className="min-h-screen bg-[#020202] font-sans text-zinc-300 pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,106,0,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-[1600px] mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#ff6a00]/10 border border-[#ff6a00]/30 mb-4">
              <ShieldCheck className="w-4 h-4 text-[#ff6a00]" />
              <span className="text-[10px] font-black tracking-widest text-[#ff6a00] uppercase">Admin Sector</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider flex items-center gap-4 drop-shadow-md">
              <LayoutDashboard className="w-10 h-10 text-[#ff6a00]" /> Commercial Ops
            </h1>
            <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-3">
              Live monitor for V10 Vault checkouts and cart items.
            </p>
          </div>
          
          <div className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl flex items-center gap-6 shadow-2xl">
            <div className="text-center">
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black mb-1">Total Orders</p>
              <p className="text-2xl font-black text-white">{requests.length}</p>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[9px] text-[#ff6a00] uppercase tracking-widest font-black mb-1">Pending</p>
              <p className="text-2xl font-black text-orange-400">{requests.filter(r => r.status === 'pending_payment').length}</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <Loader2 className="w-12 h-12 text-[#ff6a00] animate-spin mb-4" />
              <p className="text-[#ff6a00] text-xs font-black uppercase tracking-widest animate-pulse">Syncing Database...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
              <PackageSearch className="w-20 h-20 text-zinc-800 mb-6" />
              <h3 className="text-xl font-black text-zinc-400 uppercase tracking-widest mb-2">Vault is Empty</h3>
              <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Waiting for client checkouts.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#0a0a0a] border-b border-white/10">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status & Date</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client Info</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Tier / Value</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-[#ff6a00]">Selected Products (Cart)</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {requests.map((req) => (
                      <motion.tr 
                        key={req.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* STATUS I DATUM */}
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
                            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
                              {req.timestamp?.toDate?.() ? new Date(req.timestamp.toDate()).toLocaleString('en-GB') : 'Unknown Date'}
                            </span>
                          </div>
                        </td>

                        {/* KLIJENT */}
                        <td className="p-5 align-top">
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm mb-1">{req.email}</span>
                            {req.company && <span className="text-zinc-500 text-xs font-medium">{req.company}</span>}
                          </div>
                        </td>

                        {/* PAKET I CENA */}
                        <td className="p-5 align-top">
                          <div className="flex flex-col">
                            <span className="text-[#ff6a00] font-black text-[10px] uppercase tracking-widest mb-1">{req.selectedPackage}</span>
                            <span className="flex items-center gap-1 text-white font-black text-lg">
                              <DollarSign className="w-4 h-4 text-emerald-500" />
                              {req.price || "0"}
                            </span>
                          </div>
                        </td>

                        {/* KUPLJENI PROIZVODI (KORPA) */}
                        <td className="p-5 align-top max-w-xs">
                          {req.selectedProjects && req.selectedProjects.length > 0 ? (
                            <div className="flex flex-col gap-2">
                              {req.selectedProjects.map((project, index) => (
                                <div key={index} className="bg-[#0a0a0a] border border-white/10 rounded-lg p-2 flex items-center justify-between group/link">
                                  <span className="text-zinc-300 text-[10px] font-bold uppercase tracking-widest truncate mr-2">
                                    {index + 1}. {project.title}
                                  </span>
                                  {project.driveLink ? (
                                    <a href={project.driveLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300" title="Open Google Drive ZIP">
                                      <DownloadCloud className="w-4 h-4" />
                                    </a>
                                  ) : (
                                    <span className="text-zinc-700 text-[9px] uppercase tracking-widest" title="No Drive link assigned">No Link</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-600 text-[10px] uppercase tracking-widest italic">No items in cart</span>
                          )}
                        </td>

                        {/* AKCIJE */}
                        <td className="p-5 align-top text-right">
                          <div className="flex items-center justify-end gap-3 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                            
                            {req.status !== 'paid' && (
                              <button 
                                onClick={() => markAsPaid(req.id)}
                                className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black flex items-center justify-center transition-all border border-emerald-500/20"
                                title="Mark as Paid"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <a 
                              href={`mailto:${req.email}?subject=Vault Access Authorized - AI TOOLS PRO SMART&body=Hi,%0D%0A%0D%0AYour payment for the ${req.selectedPackage} has been cleared.%0D%0A%0D%0ABest regards,%0D%0AGoran`}
                              className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all border border-blue-500/20"
                              title="Send Confirmation Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>

                            <button 
                              onClick={() => deleteRequest(req.id)}
                              className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-red-500/20"
                              title="Delete Checkout Request"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </motion.tr>
                    ))}
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
// KRAJ FUNKCIJE: CommercialOps Komponenta

export default CommercialOps;