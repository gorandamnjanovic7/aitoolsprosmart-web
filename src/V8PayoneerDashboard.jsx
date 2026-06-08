// POČETAK FAJLA: V8PayoneerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Prilagodi putanju do firebase.js ako treba
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Zap, Clock, CheckCircle, Send, DollarSign, User, ShieldAlert, Mail } from 'lucide-react';

const V8PayoneerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // POČETAK FUNKCIJE: Učitavanje podataka u realnom vremenu
  useEffect(() => {
    const q = query(collection(db, "v8_payoneer_requests"), orderBy("timestamp", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // KRAJ FUNKCIJE: Učitavanje podataka

  // POČETAK FUNKCIJE: Promena statusa
  const updateStatus = async (id, newStatus) => {
    try {
      const requestRef = doc(db, "v8_payoneer_requests", id);
      await updateDoc(requestRef, {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Greška pri ažuriranju statusa!");
    }
  };
  // KRAJ FUNKCIJE: Promena statusa

  // Pomoćne funkcije za formatiranje
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Just now'; // Dok server ne potvrdi vreme, pisaće ovo
    
    // Pametna provera: ako ima toDate, koristi ga, inače probaj običan Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Ako iz nekog razloga i dalje nije validan datum
    if (isNaN(date)) return 'N/A';

    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const getStatusStyle = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'invoice_sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'paid': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SEKCIJA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
              <ShieldAlert className="text-orange-500 w-8 h-8" />
              Payoneer <span className="text-orange-500">Command Center</span>
            </h1>
            <p className="text-gray-400 text-sm mt-2 font-bold uppercase tracking-widest">
              Secure Manual Invoicing & License Management
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg px-6 py-3 text-center">
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Requests</div>
              <div className="text-2xl font-black text-white">{requests.length}</div>
            </div>
            <div className="bg-[#0a0a0a] border border-orange-500/30 rounded-lg px-6 py-3 text-center shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              <div className="text-xs text-orange-500 font-bold uppercase tracking-widest mb-1">Pending</div>
              <div className="text-2xl font-black text-white">
                {requests.filter(r => r.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>

        {/* TABELA / LISTA ZAHTEVA */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="p-10 text-center text-orange-500 font-black uppercase tracking-widest animate-pulse">
              Loading Secure Data...
            </div>
          ) : requests.length === 0 ? (
            <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">
              No Payoneer requests found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs text-gray-400 font-black uppercase tracking-widest">
                    <th className="p-5">Client details</th>
                    <th className="p-5">Package / Price</th>
                    <th className="p-5">Time requested</th>
                    <th className="p-5">Current Status</th>
                    <th className="p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors group">
                      
                      {/* CLIENT INFO */}
                      <td className="p-5">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mt-1">
                            <User size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{req.firstName} {req.lastName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Mail size={12} /> {req.clientEmail}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* PACKAGE INFO */}
                      <td className="p-5">
                        <div className="font-black text-sm text-gray-200 uppercase tracking-wide">
                          {req.productName}
                        </div>
                        <div className="text-orange-500 font-black flex items-center gap-1 mt-1">
                          <DollarSign size={14} /> {req.price}
                        </div>
                      </td>

                      {/* TIMESTAMP */}
                      <td className="p-5 text-sm text-gray-400 font-medium">
                        {formatDate(req.timestamp)}
                      </td>

                      {/* STATUS BADGE */}
                      <td className="p-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)}`}>
                          {req.status === 'pending' && <Clock size={12} />}
                          {req.status === 'invoice_sent' && <Send size={12} />}
                          {req.status === 'paid' && <CheckCircle size={12} />}
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>

                      {/* ACTION BUTTONS */}
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {req.status === 'pending' && (
                            <button 
                              onClick={() => updateStatus(req.id, 'invoice_sent')}
                              className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                              title="Mark as Invoice Sent"
                            >
                              Mark Sent
                            </button>
                          )}
                          {(req.status === 'pending' || req.status === 'invoice_sent') && (
                            <button 
                              onClick={() => updateStatus(req.id, 'paid')}
                              className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-600/50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1"
                              title="Mark as Paid & Approve"
                            >
                              <Zap size={12} /> Mark Paid
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
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
// KRAJ FAJLA: V8PayoneerDashboard.jsx