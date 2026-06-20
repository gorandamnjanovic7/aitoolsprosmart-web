// POČETAK FAJLA: UnlockTheBeast.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ChevronRight } from 'lucide-react';

// FIREBASE IMPORTS
import { auth, provider, db } from './firebase';
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { v8Toast } from './v8Utils';

export default function UnlockTheBeast() {
  // POČETAK FUNKCIJE: UnlockTheBeast

  const handleClaimCredits = async () => {
    try {
      // 1. Pozivamo Google Login prozor
      const result = await signInWithPopup(auth, provider);
      const loggedUser = result.user;
      
      const userRef = doc(db, "v8_users", loggedUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // 2A. POTPUNO NOV KORISNIK - Kreiramo profil i ODMAH dajemo 11 kredita
        const newUserProfile = {
          email: loggedUser.email,
          displayName: loggedUser.displayName,
          photoURL: loggedUser.photoURL,
          credits_16mp: 5, 
          credits_33mp: 3, 
          credits_45mp: 3, 
          trialClaimed: true, 
          role: "free_trial",
          joinedAt: serverTimestamp()
        };
        await setDoc(userRef, newUserProfile);
        console.log("[V8 SYSTEM] Novi klijent preuzeo Trial paket.");
        if(typeof v8Toast !== 'undefined') v8Toast.success("TRIAL UNLOCKED: 11 Premium Credits Added!");
        
      } else {
        // 2B. POSTOJEĆI KORISNIK - Proveravamo da li je već uzeo trial
        const userData = userSnap.data();
        
        if (userData.trialClaimed === false) {
           // Nije preuzeo trial ranije, dajemo mu sada
           await updateDoc(userRef, {
             credits_16mp: 5,
             credits_33mp: 3,
             credits_45mp: 3,
             trialClaimed: true
           });
           console.log("[V8 SYSTEM] Postojeći klijent naknadno preuzeo Trial.");
           if(typeof v8Toast !== 'undefined') v8Toast.success("TRIAL UNLOCKED: 11 Premium Credits Added!");
        } else {
           // Već je preuzeo trial ranije
           console.log("[V8 SYSTEM] Klijent se ulogovao, ali je već iskoristio Trial.");
           if(typeof v8Toast !== 'undefined') v8Toast.info("Welcome back! Your trial was already claimed.");
        }
      }
    } catch (err) {
      console.error("[V8 CLAIM ERROR]:", err);
      // Ako korisnik zatvori prozor za login pre nego što završi
      if(typeof v8Toast !== 'undefined') v8Toast.error("Login canceled or failed.");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full my-12"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-orange-500/30 p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(234,88,12,0.15)] group">
          
          {/* Gornja svetleća linija */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-amber-500 to-transparent"></div>
          
          {/* Suptilni neonski odsjaj u pozadini */}
          <div className="absolute top-1/2 left-10 w-32 h-32 bg-orange-600/10 rounded-full blur-[60px] pointer-events-none transition-all duration-700 group-hover:bg-orange-500/20 group-hover:scale-150"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-6 relative z-10 w-full text-center md:text-left">
            
            {/* Ikonica sa leve strane */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
              <Zap size={32} className="animate-pulse" />
            </div>

            {/* Tekstualni deo */}
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-black uppercase text-white tracking-widest mb-2 drop-shadow-md">
                CLAIM YOUR V8 MASTER PASS.
              </h2>
              <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed max-w-3xl">
                Sign in to instantly load your account with premium processing power: <strong className="text-orange-400 font-black">5</strong> credits for 16MP, <strong className="text-orange-400 font-black">3</strong> credits for 33.2MP, and <strong className="text-orange-400 font-black">3</strong> credits for 45MP upscaling. No credit card required.
              </p>
            </div>
          </div>

          {/* Pulsirajuće Dugme */}
          <div className="flex-shrink-0 w-full lg:w-auto relative z-10">
            {/* Prsten koji se širi (ping efekat) za dodatnu privlačnost */}
            <div className="absolute inset-0 bg-orange-500 rounded-xl blur animate-ping opacity-20"></div>
            
            <button 
              onClick={handleClaimCredits}
              className="relative w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black uppercase tracking-widest text-[13px] rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-3 hover:scale-[1.03] active:scale-95"
            >
              CLAIM 11 CREDITS NOW
              <ChevronRight size={18} className="text-orange-100" />
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
  // KRAJ FUNKCIJE: UnlockTheBeast
}
// KRAJ FAJLA: UnlockTheBeast.jsx