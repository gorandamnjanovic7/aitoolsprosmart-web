// POČETAK FAJLA: V8UnlockModal.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { ShieldCheck, Zap, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const V8UnlockModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Čekamo da se klijent uloguje preko Google-a
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email.toLowerCase());
        
        // Slušamo njegov VIP dokument u realnom vremenu
        const unsubDoc = onSnapshot(doc(db, "vip_users", user.email.toLowerCase()), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Ako si ti kliknuo "MARK PAID", ovo će biti true
            if (data.newlyUnlocked) {
              setProduct(data.lastUnlockedProduct || "V8 Premium Package");
              setShowModal(true);
            }
          }
        });
        return () => unsubDoc();
      } else {
        setShowModal(false);
        setUserEmail("");
      }
    });
    return () => unsubAuth();
  }, []);

  // Funkcija kada klijent klikne dugme da zatvori modal
  const handleAcknowledge = async () => {
    setShowModal(false);
    if (userEmail) {
      try {
        // Gasimo okidač da mu ne iskače ponovo sutra
        await updateDoc(doc(db, "vip_users", userEmail), {
          newlyUnlocked: false
        });
      } catch (e) {
        console.error("Greška pri gašenju okidača", e);
      }
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-[#050505] border-2 border-emerald-500/50 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-8 md:p-10 text-center relative overflow-hidden"
          >
            {/* Pozadinski sjaj */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-emerald-500/20 blur-[50px] pointer-events-none"></div>

            <div className="w-20 h-20 mx-auto bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2">
              Payment <span className="text-emerald-500">Verified</span>
            </h2>
            
            <p className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-6">
              Secure V8 License Activated
            </p>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-6 mb-8 text-left relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Key className="w-24 h-24 text-emerald-500" />
              </div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Unlocked Asset</p>
              <p className="text-xl font-black text-white uppercase tracking-wide flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" /> {product}
              </p>
            </div>

            <button 
              onClick={handleAcknowledge}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all duration-300"
            >
              Access My Tools
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default V8UnlockModal;
// KRAJ FAJLA: V8UnlockModal.jsx