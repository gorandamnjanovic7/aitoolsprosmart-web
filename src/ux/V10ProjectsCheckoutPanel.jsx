// FAJL: V10PricingDetails.jsx
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Zap, Sparkles, ArrowRight, Loader2 } from 'lucide-react'; 
import { motion } from 'framer-motion';

import { auth, db } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'; 
import LoginRequiredModal from '../LoginRequiredModal'; 

// POČETAK FUNKCIJE: V10PricingDetails
const V10PricingDetails = ({ onPackageLoaded, onPackageSelect }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [user, setUser] = useState(null);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", price: 0 });
  const [isLoading, setIsLoading] = useState(true); 
  const [hasPackage, setHasPackage] = useState(false); 

  // POČETAK FUNKCIJE: useEffect (Provera autentifikacije i slušanje baze)
  useEffect(() => {
    let unsubDoc = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const savedPackage = sessionStorage.getItem('pending_v10_package');
        if (savedPackage) {
          const parsedPackage = JSON.parse(savedPackage);
          await saveToFirebaseAndUnlock(currentUser, parsedPackage.name, parsedPackage.price);
          sessionStorage.removeItem('pending_v10_package');
          setIsLoading(false); 
          return;
        }

        const email = currentUser.email.toLowerCase();
        const docRef = doc(db, "checkout_requests", email);
        
        unsubDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSelectedPackage({ name: data.selectedPackage, price: data.price });
            setIsLocked(false);
            setHasPackage(true); 
            if (onPackageLoaded) onPackageLoaded(data.selectedPackage); 
          } else {
            setIsLocked(true);
            setHasPackage(false);
          }
          setIsLoading(false);
        }, (error) => {
          console.error("Greška pri proveri baze:", error);
          setIsLocked(true);
          setIsLoading(false);
        });

      } else {
        setIsLocked(true);
        setHasPackage(false);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubDoc) unsubDoc();
    };
  }, [onPackageLoaded]);
  // KRAJ FUNKCIJE: useEffect

  // POČETAK FUNKCIJE: saveToFirebaseAndUnlock
  const saveToFirebaseAndUnlock = async (currentUser, pkgName, pkgPrice) => {
    try {
      const email = currentUser.email.toLowerCase();
      
      await setDoc(doc(db, "checkout_requests", email), {
        email: email,
        selectedPackage: pkgName,
        price: pkgPrice,
        status: "pending_payment", 
        timestamp: serverTimestamp()
      }, { merge: true });

      setSelectedPackage({ name: pkgName, price: pkgPrice });
      setIsLocked(false);
      setHasPackage(true); 
      
      if (onPackageSelect) onPackageSelect(pkgName, pkgPrice);
      
    } catch (error) {
      console.error("Greška pri upisu u Firebase:", error);
      alert("Došlo je do greške pri odabiru paketa. Molimo pokušajte ponovo.");
    }
  };
  // KRAJ FUNKCIJE: saveToFirebaseAndUnlock

  // POČETAK FUNKCIJE: handlePackageSelect
  const handlePackageSelect = (packageName, packagePrice) => {
    setSelectedPackage({ name: packageName, price: packagePrice });
    
    if (user) {
      if (onPackageSelect) onPackageSelect(packageName, packagePrice); 
      saveToFirebaseAndUnlock(user, packageName, packagePrice); 
    } else {
      sessionStorage.setItem('pending_v10_package', JSON.stringify({ name: packageName, price: packagePrice }));
      setIsLoginModalOpen(true);
    }
  };
  // KRAJ FUNKCIJE: handlePackageSelect

  // POČETAK FUNKCIJE: handleLoginSuccess
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (selectedPackage.name) {
       saveToFirebaseAndUnlock(loggedInUser, selectedPackage.name, selectedPackage.price);
       sessionStorage.removeItem('pending_v10_package');
    }
  };
  // KRAJ FUNKCIJE: handleLoginSuccess

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (hasPackage) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15, ease: "easeOut" } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <>
      {isLocked && (
        <div className="fixed inset-0 z-[80000] bg-black/20 pointer-events-auto cursor-not-allowed" />
      )}

      <div className={`relative w-full max-w-7xl mx-auto mt-8 mb-16 px-4 z-[90000]`}>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md">
            V10 <span className="text-orange-500">Vault</span> Access
          </h2>
          <p className="text-neutral-400 text-xs font-bold tracking-[0.2em] uppercase">
            Choose your B2B production tier pre-checkout
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        >
          
          {/* TIER 1: B2B RETAINER */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }} 
            className="bg-[#0a0a0a] border border-cyan-500/30 rounded-2xl p-8 hover:border-cyan-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-all duration-500 flex flex-col relative group"
          >
            <div className="mb-6">
              <h3 className="text-cyan-500 text-sm font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> B2B Retainer
              </h3>
              <div className="text-white text-4xl font-black tracking-tight mb-2">
                $200 <span className="text-neutral-500 text-sm font-medium uppercase tracking-wider">/ month</span>
              </div>
              <p className="text-neutral-400 text-sm font-medium">3 custom projects of your choice every month.</p>
            </div>
            
            <div className="flex-grow mb-8">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.15em] mb-4">What you download:</p>
              <ul className="space-y-4 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span><strong className="text-white">150MP ready UI/UX design</strong> + all accompanying presentation images.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span><strong className="text-white">Master PSD file</strong> for immediate workflow.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                  <span><strong className="text-white">Standard 4K web-ready files & PSD</strong> organized in a dedicated workflow folder.</span>
                </li>
                <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
                  <svg className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm text-gray-200 font-bold tracking-wide">PERSONAL LICENSE</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-950/40 to-black border border-cyan-900/50 rounded-xl p-5 mb-8">
              <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Optional Add-on
              </p>
              <p className="text-sm text-white font-bold mb-1">Upscale Your Own Work</p>
              <p className="text-xs text-neutral-400 mb-3 leading-relaxed">We scale your personal finalized designs to massive resolutions for print.</p>
              <div className="flex justify-between items-center text-sm border-t border-cyan-900/50 pt-3">
                <span className="text-neutral-300">60MP Master</span>
                <span className="text-cyan-400 font-bold">+$49</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-neutral-300">150MP Ultra</span>
                <span className="text-cyan-400 font-bold">+$99</span>
              </div>
            </div>

            <div className="mb-6 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                Contact / Custom Requests
              </span>
              <div className="px-4 py-2 rounded-lg bg-black/50 border border-white/5 hover:border-white/20 transition-all duration-300 group/email">
                <span 
                  className="text-sm font-mono text-gray-400 select-all cursor-copy group-hover/email:text-white transition-colors"
                  title="Click to select all and copy"
                >
                  AITOOLSTPROSMART@GMAIL.COM
                </span>
              </div>
            </div>

            <button 
              onClick={() => handlePackageSelect('B2B RETAINER', 200)}
              className="mt-auto w-full bg-cyan-500 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-cyan-400 hover:scale-[1.02] active:scale-95 group/btn"
            >
              Select Retainer <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
            </button>
          </motion.div>

          {/* TIER 2: CINEMATIC PITCH */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            className="bg-[#0a0a0a] border-2 border-orange-500 rounded-2xl p-8 shadow-[0_0_40px_rgba(249,115,22,0.15)] hover:shadow-[0_0_60px_rgba(249,115,22,0.3)] transition-all duration-500 flex flex-col relative z-10 md:-mt-4 md:mb-4 group"
          >
            <motion.div 
              animate={{ boxShadow: ["0px 0px 10px rgba(249,115,22,0.4)", "0px 0px 25px rgba(249,115,22,0.8)", "0px 0px 10px rgba(249,115,22,0.4)"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-black text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full"
            >
              Most Popular Choice
            </motion.div>
            
            <div className="mb-6 mt-2">
              <h3 className="text-orange-500 text-sm font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Cinematic Pitch
              </h3>
              <div className="text-white text-4xl font-black tracking-tight mb-2">
                $1.500 <span className="text-neutral-500 text-sm font-medium uppercase tracking-wider">/ one-time</span>
              </div>
              {/* 🔥 Ovde sada piše 10 projekata 🔥 */}
              <p className="text-neutral-400 text-sm font-medium">10 production-ready projects for massive pitches.</p>
            </div>
            
            <div className="flex-grow mb-8">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.15em] mb-4">What you download:</p>
              <ul className="space-y-4 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span><strong className="text-white">150MP ready UI/UX design</strong> + all accompanying images (per project).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span><strong className="text-white">Master PSD file</strong> (per project).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span><strong className="text-white">Standard 4K web-ready files & PSD</strong> organized in a dedicated workflow folder (per project).</span>
                </li>
                <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
                  <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm text-gray-200 font-bold tracking-wide">COMMERCIAL AGENCY LICENSE</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-orange-950/40 to-black border border-orange-900/50 rounded-xl p-5 mb-8">
              <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Optional Add-on
              </p>
              <p className="text-sm text-white font-bold mb-1">Upscale Your Own Work</p>
              <p className="text-xs text-neutral-400 mb-3 leading-relaxed">We scale your personal finalized designs to massive resolutions for print.</p>
              <div className="flex justify-between items-center text-sm border-t border-orange-900/50 pt-3">
                <span className="text-neutral-300">60MP Master</span>
                <span className="text-orange-400 font-bold">+$49</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-neutral-300">150MP Ultra</span>
                <span className="text-orange-400 font-bold">+$99</span>
              </div>
            </div>

            <div className="mb-6 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                Contact / Custom Requests
              </span>
              <div className="px-4 py-2 rounded-lg bg-black/50 border border-white/5 hover:border-white/20 transition-all duration-300 group/email">
                <span 
                  className="text-sm font-mono text-gray-400 select-all cursor-copy group-hover/email:text-white transition-colors"
                  title="Click to select all and copy"
                >
                  AITOOLSTPROSMART@GMAIL.COM
                </span>
              </div>
            </div>

            <button 
              onClick={() => handlePackageSelect('CINEMATIC PITCH', 1500)}
              className="mt-auto w-full bg-orange-500 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-orange-400 hover:scale-[1.02] active:scale-95 group/btn"
            >
              Secure Access <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
            </button>
          </motion.div>

          {/* TIER 3: MASTER VAULT */}
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8, scale: 1.01 }}
            className="bg-[#0a0a0a] border border-amber-500/30 rounded-2xl p-8 hover:border-amber-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] transition-all duration-500 flex flex-col relative group"
          >
            <div className="mb-6">
              <h3 className="text-amber-500 text-sm font-black tracking-widest uppercase mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" /> V10 Master Vault
              </h3>
              <div className="text-white text-4xl font-black tracking-tight mb-2">
                $7.000 <span className="text-neutral-500 text-sm font-medium uppercase tracking-wider">/ one-time</span>
              </div>
              <p className="text-neutral-400 text-sm font-medium">40 projects (the ultimate agency archive).</p>
            </div>
            
            <div className="flex-grow mb-8">
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.15em] mb-4">What you download:</p>
              <ul className="space-y-4 text-sm text-neutral-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span><strong className="text-white">150MP ready UI/UX design</strong> + all images (for all 40 projects).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span><strong className="text-white">Master PSD file</strong> (for all 40 projects).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                  <span><strong className="text-white">Standard 4K web-ready files & PSD</strong> organized in dedicated workflow folders.</span>
                </li>
                <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
                  <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span className="text-sm text-gray-200 font-bold tracking-wide">ENTERPRISE - MASTER LICENSE</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-amber-950/40 to-black border border-amber-900/50 rounded-xl p-5 mb-8 mt-auto">
              <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Optional Add-on
              </p>
              <p className="text-sm text-white font-bold mb-1">Upscale Your Own Work</p>
              <p className="text-xs text-neutral-400 mb-3 leading-relaxed">We scale your personal finalized designs to massive resolutions for print.</p>
              <div className="flex justify-between items-center text-sm border-t border-amber-900/50 pt-3">
                <span className="text-neutral-300">60MP Master</span>
                <span className="text-amber-400 font-bold">+$49</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2">
                <span className="text-neutral-300">150MP Ultra</span>
                <span className="text-amber-400 font-bold">+$99</span>
              </div>
            </div>

            <div className="mb-6 text-center flex flex-col items-center justify-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
                Contact / Custom Requests
              </span>
              <div className="px-4 py-2 rounded-lg bg-black/50 border border-white/5 hover:border-white/20 transition-all duration-300 group/email">
                <span 
                  className="text-sm font-mono text-gray-400 select-all cursor-copy group-hover/email:text-white transition-colors"
                  title="Click to select all and copy"
                >
                  AITOOLSTPROSMART@GMAIL.COM
                </span>
              </div>
            </div>

            <button 
              onClick={() => handlePackageSelect('V10 MASTER VAULT', 7000)}
              className="mt-auto w-full bg-amber-500 text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:bg-amber-400 hover:scale-[1.02] active:scale-95 group/btn"
            >
              Unlock Vault <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
            </button>
          </motion.div>

        </motion.div>
      </div>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        packageName={selectedPackage.name}
        price={selectedPackage.price}
      />
    </>
  );
};
// KRAJ FUNKCIJE: V10PricingDetails

export default V10PricingDetails;
// KRAJ FAJLA: V10PricingDetails.jsx