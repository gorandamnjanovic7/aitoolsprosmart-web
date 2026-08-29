// Fajl: V8PayoneerDashboard.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ShieldCheck, Clock, CheckCircle, Trash2, Mail, Globe, DollarSign, Link as LinkIcon, CreditCard, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const V8PayoneerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "v8_payoneer_requests"), orderBy("requestDate", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching B2B requests:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsPaid = async (id) => {
    if (window.confirm("Are you sure you want to mark this request as PAID?")) {
      try {
        await updateDoc(doc(db, "v8_payoneer_requests", id), { status: 'paid' });
      } catch (error) {
        console.error("Update error:", error);
        alert("An error occurred while updating.");
      }
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm("Are you sure you want to PERMANENTLY DELETE this request?")) {
      try {
        await deleteDoc(doc(db, "v8_payoneer_requests", id));
      } catch (error) {
        console.error("Delete error:", error);
        alert("An error occurred while deleting.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] font-sans text-slate-300 pt-28 pb-20 px-4 sm:px-8 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.05)_0%,_transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-blue-900/30 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/30 border border-blue-500/30 mb-4">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase">Level 5 Access</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-wider flex items-center gap-4 drop-shadow-md">
              <LayoutDashboard className="w-10 h-10 text-blue-500" /> B2B Command Center
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest mt-3">
              Manage corporate requests, invoices, and Payoneer links.
            </p>
          </div>
          
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center gap-6 shadow-inner">
            <div className="text-center">
              <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black mb-1">Total Requests</p>
              <p className="text-2xl font-black text-white">{requests.length}</p>
            </div>
            <div className="w-px h-10 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-[9px] text-orange-500 uppercase tracking-widest font-black mb-1">Pending</p>
              <p className="text-2xl font-black text-orange-400">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-[#050814] border border-blue-900/30 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-16 h-16 border-4 border-blue-900 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-blue-500 text-xs font-black uppercase tracking-widest animate-pulse">Loading Database...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center px-4">
              <ShieldCheck className="w-20 h-20 text-slate-800 mb-6" />
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest mb-2">No B2B Requests</h3>
              <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">System is clear. Waiting for new clients.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-blue-900/30">
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Client</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Location</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Package / Service</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount</th>
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
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
                        className="border-b border-slate-800/50 hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex flex-col gap-2 items-start">
                            {req.status === 'paid' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                                <CheckCircle className="w-3 h-3" /> Paid
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-widest">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                            )}
                            
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                              {req.method === 'payoneer' || req.method === 'b2b' ? <LinkIcon className="w-3 h-3 text-blue-400" /> : <CreditCard className="w-3 h-3 text-purple-400" />}
                              {req.method === 'payoneer' || req.method === 'b2b' ? 'B2B Link' : 'CARD'}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{req.firstName} {req.lastName}</span>
                            <span className="flex items-center gap-1.5 text-slate-500 text-xs mt-1">
                              <Mail className="w-3 h-3" /> {req.clientEmail}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <Globe className="w-4 h-4 text-slate-600" /> {req.country}
                          </span>
                        </td>

                        <td className="p-5">
                          <div className="flex flex-col">
                            <span className="text-blue-100 font-bold text-xs uppercase tracking-wider">{req.productName}</span>
                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest mt-1">
                              {new Date(req.requestDate?.toDate()).toLocaleString('en-US')}
                            </span>
                          </div>
                        </td>

                        <td className="p-5">
                          <span className="flex items-center gap-1 text-white font-black text-lg">
                            <DollarSign className="w-4 h-4 text-emerald-500" />
                            {req.price} {req.isMonthly && <span className="text-[10px] text-slate-500">/MO</span>}
                          </span>
                        </td>

                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            
                            {req.status !== 'paid' && (
                              <button 
                                onClick={() => markAsPaid(req.id)}
                                className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors border border-emerald-500/20"
                                title="Mark as Paid"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            
                            <a 
                              href={`mailto:${req.clientEmail}?subject=Invoice for${req.productName} - AI TOOLS PRO SMART&body=Hi ${req.firstName},\%0D\%0A\%0D\%0AThank you for requesting${req.productName}.%0D%0APlease find your payment link/details below:%0D%0A%0D%0A[INSERT LINK HERE]%0D%0A%0D%0ABest regards,%0D%0AGoran`}
                              className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-colors border border-blue-500/20"
                              title="Send Email Invoice"
                            >
                              <Mail className="w-4 h-4" />
                            </a>

                            <button 
                              onClick={() => deleteRequest(req.id)}
                              className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors border border-red-500/20"
                              title="Delete Request"
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

export default V8PayoneerDashboard;