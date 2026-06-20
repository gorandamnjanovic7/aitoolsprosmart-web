// POČETAK FAJLA: V8AdminLiveNotifier.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { X, Zap, DollarSign, Bitcoin } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

const V8AdminLiveNotifier = () => {
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mountTime] = useState(Timestamp.now()); 

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

  // 🔥 ISPRAVLJEN RADAR DA SLUŠA requestDate UMESNO timestamp I DA SLUŠA I KRIPTO I PAYONEER 🔥
  useEffect(() => {
    if (!isAdmin) return;

    // Slušamo Payoneer
    const qPayoneer = query(
      collection(db, "v8_payoneer_requests"),
      where("requestDate", ">=", mountTime)
    );

    // Slušamo Kripto
    const qCrypto = query(
      collection(db, "v8_crypto_requests"),
      where("requestDate", ">=", mountTime)
    );

    const handleSnapshot = (snapshot, type) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.requestDate) {
              setNotifications(prev => [...prev, { id: change.doc.id, typeOfRequest: type, ...data }]);
              
              // OPCIONO: Pusti zvuk
              // const audio = new Audio('/v8-ping.mp3');
              // audio.play().catch(e => console.log(e));
          }
        }
      });
    };

    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => handleSnapshot(snap, 'b2b'));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => handleSnapshot(snap, 'crypto'));

    return () => {
      unsubPayoneer();
      unsubCrypto();
    };
  }, [isAdmin, mountTime]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isAdmin || notifications.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[999999] flex flex-col gap-4 pointer-events-none">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`bg-[#050505] border-l-4 p-5 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-80 relative flex flex-col pointer-events-auto transform transition-all duration-500 animate-slide-in-right ${notif.typeOfRequest === 'crypto' ? 'border-[#F97316] shadow-[0_10px_40px_rgba(249,115,22,0.3)]' : 'border-[#3B82F6] shadow-[0_10px_40px_rgba(59,130,246,0.3)]'}`}
        >
          <button 
            onClick={() => dismissNotification(notif.id)} 
            className="absolute top-3 right-3 text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-red-500 p-1.5 rounded-lg transition-all"
          >
            <X size={16} strokeWidth={3} />
          </button>
          
          <div className="flex items-center gap-2 mb-3">
            {notif.typeOfRequest === 'crypto' ? <Bitcoin className="w-5 h-5 text-[#F97316] animate-pulse" /> : <DollarSign className="w-5 h-5 text-[#3B82F6] animate-pulse" />}
            <span className={`font-black text-[11px] uppercase tracking-widest ${notif.typeOfRequest === 'crypto' ? 'text-[#F97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`}>
              {notif.typeOfRequest === 'crypto' ? 'NEW CRYPTO CHECKOUT' : 'NEW B2B CHECKOUT'}
            </span>
          </div>
          
          <div className="flex flex-col gap-1 border-b border-white/10 pb-3 mb-3">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Client</span>
            <span className="text-white font-bold text-sm">{notif.clientEmail || notif.firstName}</span>
          </div>
          
          <div className="flex flex-col gap-1">
             <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Targeted Asset</span>
             <span className={`${notif.typeOfRequest === 'crypto' ? 'text-[#F97316]' : 'text-[#3B82F6]'} font-black text-sm uppercase`}>{notif.productName}</span>
             <span className="text-white font-black text-2xl mt-1">${notif.price}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default V8AdminLiveNotifier;
// KRAJ FAJLA: V8AdminLiveNotifier.jsx