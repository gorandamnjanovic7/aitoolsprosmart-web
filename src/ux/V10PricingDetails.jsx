// FAJL: src/ux/V10PricingDetails.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react'; 
import { motion } from 'framer-motion';

import { auth, db } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore'; 
import LoginRequiredModal from '../LoginRequiredModal'; 
import V10PackageCard from './V10PackageCard';

const TIER_CARDS = [
  {
    theme: 'cyan',
    title: 'B2B Retainer',
    pkgKey: 'B2B RETAINER',
    price: 200,
    priceDisplay: '200',
    period: 'month',
    desc: '3 custom projects of your choice every month.',
    isPopular: false,
    btnText: 'Select Retainer',
    features: [
      '150MP ready UI/UX design + all accompanying presentation images.',
      '1 UI/UX Design = 1 Vault Point (Deducted from your total limit).',
      'Master PSD file for immediate workflow.',
      'Standard 4K web-ready files & PSD organized in a dedicated workflow folder.'
    ]
  },
  {
    theme: 'orange',
    title: 'Cinematic Pitch',
    pkgKey: 'CINEMATIC PITCH',
    price: 1500,
    priceDisplay: '1,500',
    period: 'one-time',
    desc: '10 production-ready projects for massive pitches.',
    isPopular: true,
    btnText: 'Secure Access',
    features: [
      '150MP ready UI/UX design + all accompanying images (per project).',
      '1 UI/UX Design = 1 Vault Point (Deducted from your total limit).',
      'Master PSD file (per project).',
      'Standard 4K web-ready files & PSD organized in a dedicated workflow folder (per project).'
    ]
  },
  {
    theme: 'amber',
    title: 'V10 Master Vault',
    pkgKey: 'V10 MASTER VAULT',
    price: 7000,
    priceDisplay: '7,000',
    period: 'one-time',
    desc: '40 points (the ultimate agency archive).',
    isPopular: false,
    btnText: 'Unlock Vault',
    features: [
      '150MP ready UI/UX design + all images (for all 40 projects).',
      '1 UI/UX Design = 1 Vault Point (Deducted from your total limit).',
      'Master PSD file (for all 40 projects).',
      'Standard 4K web-ready files & PSD organized in dedicated workflow folders.'
    ]
  }
];

const V10PricingDetails = ({ onPackageLoaded, onPackageSelect }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [user, setUser] = useState(null);
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState({ name: "", price: 0 });
  const [isLoading, setIsLoading] = useState(true); 
  const [hasPackage, setHasPackage] = useState(false); 

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

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    if (selectedPackage.name) {
      saveToFirebaseAndUnlock(loggedInUser, selectedPackage.name, selectedPackage.price);
      sessionStorage.removeItem('pending_v10_package');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (hasPackage) return null;

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
        <div className="fixed inset-0 z-[80000] bg-[#121722]/40 pointer-events-auto cursor-not-allowed" />
      )}

      <div className="relative w-full max-w-7xl mx-auto mt-8 mb-16 px-4 z-[90000]">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-widest uppercase mb-2 drop-shadow-md">
            V10 <span className="text-amber-400">Vault</span> Access
          </h2>
          <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase">
            Choose your B2B production tier pre-checkout
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show" 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch mb-16"
        >
          {TIER_CARDS.map((card) => (
            <V10PackageCard
              key={card.pkgKey}
              data={card}
              cardVariants={cardVariants}
              onSelect={handlePackageSelect}
            />
          ))}
        </motion.div>

        {/* DMCA WARNING BOX PRILAGOĐEN #121722 PALETI */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center w-full max-w-5xl mx-auto"
        >
          <div className="bg-gradient-to-br from-[#171e2c] to-[#0d121b] border border-white/10 border-t-4 border-t-red-500 w-full rounded-[2rem] shadow-[0_25px_80px_rgba(0,0,0,0.65)] flex flex-col md:flex-row overflow-hidden">
            <div className="flex-1 p-10 md:p-12 border-b md:border-b-0 md:border-r border-white/10 bg-[#121722]/40 text-left">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  <AlertTriangle className="w-7 h-7 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-red-500 uppercase tracking-[0.2em] drop-shadow-md">Warning</h2>
              </div>
              
              <p className="text-slate-300 text-base font-medium leading-relaxed mb-6">
                We have deployed cryptographic watermarking and Reverse Image Tracking across all visual assets. Every file in this vault carries a permanent footprint detailing the <strong className="text-amber-400">exact license and the authorized buyer's identity</strong>.
              </p>
              
              <div className="border-l-2 border-red-500/50 pl-5 bg-red-500/5 py-4 pr-4 rounded-r-xl mb-6">
                <p className="text-slate-400 text-sm leading-relaxed font-bold">
                  Any misuse, unauthorized distribution, or resale of these files beyond the scope of your purchased license will be prosecuted under the <strong className="text-white">Digital Millennium Copyright Act (DMCA)</strong> and <strong className="text-white">Title 17 of the United States Code</strong>.
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <p className="text-amber-400 font-black text-xs uppercase tracking-widest">
                  Please log in and select an access tier to proceed.
                </p>
              </div>
            </div>

            <div className="w-full md:w-2/5 p-10 md:p-12 flex flex-col items-center justify-center text-center bg-[#0d121b]/80 relative">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(245,158,11,0.08)_0%,_transparent_70%)] pointer-events-none"></div>
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-400 blur-[40px] opacity-25 animate-pulse"></div>
                <Lock className="w-20 h-20 text-amber-400 relative z-10 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]" />
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-widest mb-3 relative z-10">Vault Locked</h3>
              <p className="text-amber-400 font-black text-xs uppercase tracking-[0.3em] mb-8 relative z-10">
                Secured V10 Environment
              </p>
              <div className="bg-[#121722] border border-white/10 rounded-xl p-5 w-full relative z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Please log in and select an access tier to unlock this vault.
                </p>
              </div>
            </div>
          </div>
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

export default V10PricingDetails;