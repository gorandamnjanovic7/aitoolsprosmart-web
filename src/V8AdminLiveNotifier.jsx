// POČETAK FAJLA: V8AdminLiveNotifier.jsx
// Ne zaboravi React source code link u tvom repozitorijumu!
import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from './firebase'; 
import { collection, query, onSnapshot, where, Timestamp } from 'firebase/firestore';
import { X, Zap, Landmark, Bitcoin } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion';

const V8AdminLiveNotifier = () => {
  const [notifications, setNotifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mountTime] = useState(Timestamp.now()); 
  
  // 🔥 REFERENCA ZA ZVUK 🔥
  const audioRef = useRef(null);

  useEffect(() => {
    // Inicijalizacija audio objekta samo na klijentu
    audioRef.current = new Audio('/v8-alarm.mp3');
    audioRef.current.loop = true; // Zvuk se vrti u krug!

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => {
        unsub();
        // Gasi zvuk ako se komponenta "ubije" (unmount)
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    };
  }, []);

  // 🔥 PALJENJE I GAŠENJE ZVUKA 🔥
  useEffect(() => {
      if (notifications.length > 0 && audioRef.current) {
          audioRef.current.play().catch(e => console.log("Greska pri pustanju zvuka:", e));
      } else if (notifications.length === 0 && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
      }
  }, [notifications.length]);

  // 🔥 RADAR SLUŠA UPLATE 🔥
  useEffect(() => {
    if (!isAdmin) return;

    const qPayoneer = query(collection(db, "v8_payoneer_requests"), where("requestDate", ">=", mountTime));
    const qCrypto = query(collection(db, "v8_crypto_requests"), where("requestDate", ">=", mountTime));

    const handleSnapshot = (snapshot, type) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (data.requestDate) {
              setNotifications(prev => [...prev, { id: change.doc.id, typeOfRequest: type, ...data }]);
          }
        }
      });
    };

    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => handleSnapshot(snap, 'b2b'));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => handleSnapshot(snap, 'crypto'));

    return () => { unsubPayoneer(); unsubCrypto(); };
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
          /* 🔥 V8 CSS ALARM - Ubačen animate-pulse na ceo modal i pojačan sjaj 🔥 */
          className={`bg-[#050505] border-l-[6px] p-5 rounded-xl w-[380px] relative flex items-center pointer-events-auto transform transition-all duration-500 animate-slide-in-right ring-1 ring-offset-4 ring-offset-[#050505] animate-[pulse_1s_ease-in-out_infinite] ${
            notif.typeOfRequest === 'crypto' 
            ? 'border-[#F97316] ring-[#F97316]/50 shadow-[0_0_40px_rgba(249,115,22,0.6)]' 
            : 'border-[#3B82F6] ring-[#3B82F6]/50 shadow-[0_0_40px_rgba(59,130,246,0.6)]'
          }`}
        >
          {/* 🔥 "X" DUGME (Prekidač alarma) - Istaknuto crvenom bojom 🔥 */}
          <button 
            onClick={() => dismissNotification(notif.id)} 
            title="Ugasi alarm"
            className="absolute top-3 right-3 text-red-100 bg-red-600/40 border border-red-500/50 hover:bg-red-600 hover:text-white p-1.5 rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] z-20"
          >
            <X size={16} strokeWidth={3} />
          </button>
          
          {/* Dinamička ikona i puls (Banka ili Bitcoin) */}
          <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border shrink-0 mr-5 ${
              notif.typeOfRequest === 'b2b'
              ? 'bg-blue-950/40 border-blue-500/30 text-blue-400'
              : 'bg-orange-950/40 border-orange-500/30 text-[#F97316]'
          }`}>
              <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }} 
                  transition={{ duration: 1.5, repeat: Infinity }} 
                  className={`absolute inset-0 rounded-full blur-md ${
                      notif.typeOfRequest === 'b2b' ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
              ></motion.div>
              
              {notif.typeOfRequest === 'b2b' ? <Landmark className="relative z-10 w-7 h-7" /> : <Bitcoin className="relative z-10 w-7 h-7" />}
          </div>

          {/* Podaci o uplati */}
          <div className="flex flex-col w-full pr-8">
            <div className="flex items-center gap-1 mb-2">
              <Zap className={`w-3 h-3 ${notif.typeOfRequest === 'crypto' ? 'text-[#F97316]' : 'text-[#3B82F6]'}`} />
              <span className={`font-black text-[10px] uppercase tracking-widest ${notif.typeOfRequest === 'crypto' ? 'text-[#F97316] drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' : 'text-[#3B82F6] drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`}>
                {notif.typeOfRequest === 'crypto' ? 'NEW CRYPTO CHECKOUT' : 'NEW B2B CHECKOUT'}
              </span>
            </div>
            
            <div className="flex flex-col gap-0.5 mb-2">
              <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Client</span>
              <span className="text-white font-bold text-sm truncate">{notif.clientEmail || notif.firstName}</span>
            </div>
            
            <div className="flex flex-col gap-0.5">
               <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider">Asset</span>
               <span className={`${notif.typeOfRequest === 'crypto' ? 'text-[#F97316]' : 'text-[#3B82F6]'} font-black text-xs uppercase truncate`}>{notif.productName}</span>
               <span className="text-white font-black text-xl mt-1 font-mono">${notif.price || notif.iznosDolari}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

export default V8AdminLiveNotifier;
// KRAJ FAJLA: V8AdminLiveNotifier.jsx