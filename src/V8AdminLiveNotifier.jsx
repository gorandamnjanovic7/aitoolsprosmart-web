// POČETAK FAJLA: V8AdminLiveNotifier.jsx
// Ne zaboravi React source code link u repozitorijumu!

import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Proveri tačnu putanju do tvog firebase.js
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { X, Zap, Crown, AlertCircle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const V8AdminLiveNotifier = () => {
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mountTime] = useState(Timestamp.now()); // Beležimo trenutak kada si ušao na sajt

  // 1. Provera da li si ti (Admin) ulogovan
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  // 2. Radar koji sluša SAMO NOVE zahteve u bazi
  useEffect(() => {
    if (!isAdmin) return;

    // Slušamo kolekciju v8_payoneer_requests (gde idu oni iz SecureCheckout-a)
    // Tražimo samo one koji su kreirani NAKON što si ti otvorio sajt
    const q = query(
      collection(db, "v8_payoneer_requests"),
      where("timestamp", ">=", mountTime)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        // change.type === 'added' znači da je pao novi dokument u bazu
        if (change.type === 'added') {
          const data = change.doc.data();
          
          // Izbegavamo lokalne promene koje nemaju timestamp još uvek
          if (data.timestamp) {
              // Ubacujemo novu notifikaciju u state
              setNotifications(prev => [...prev, { id: change.doc.id, ...data }]);
              
              // OPCIONO: Pusti zvuk kad iskoči! (Ako imaš neki mp3 u public folderu)
              // const audio = new Audio('/v8-ping.mp3');
              // audio.play().catch(e => console.log(e));
          }
        }
      });
    });

    return () => unsubscribe();
  }, [isAdmin, mountTime]);

  // Funkcija za tvoje ručno gašenje obaveštenja
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Ako nisi admin ili nema novih akcija, ne renderuj ništa
  if (!isAdmin || notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[999999] flex flex-col gap-4 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className="bg-[#050505] border-l-4 border-[#FF8C00] p-5 rounded-xl shadow-[0_10px_40px_rgba(255,140,0,0.4)] w-80 relative flex flex-col pointer-events-auto transform transition-all duration-500 animate-slide-in-right"
        >
          {/* Dugme za gašenje - OSTAJE DOK GA NE STISNEŠ */}
          <button 
            onClick={() => dismissNotification(notif.id)} 
            className="absolute top-3 right-3 text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-red-500 p-1.5 rounded-lg transition-all"
          >
            <X size={16} strokeWidth={3} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-[#FF8C00] animate-pulse" />
            <span className="text-[#FF8C00] font-black text-[11px] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,140,0,0.8)]">
              LIVE ACTION ALERT
            </span>
          </div>
          
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3 mb-3">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Client</span>
            <span className="text-white font-bold text-sm">{notif.clientEmail || notif.firstName}</span>
          </div>
          
          <div className="flex flex-col gap-1">
             <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Targeted Asset</span>
             <span className="text-blue-400 font-black text-sm uppercase">{notif.productName}</span>
             <span className="text-white font-black text-2xl mt-1">${notif.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default V8AdminLiveNotifier;
// KRAJ FAJLA: V8AdminLiveNotifier.jsx