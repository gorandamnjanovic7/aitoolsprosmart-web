// FAJL: src/ux/VaultGrid.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ShieldCheck, Plus, X, Save, 
  Image as ImageIcon, UploadCloud, Loader2, Trash2,
  ShoppingCart, Lock, Clock, CheckCircle2, AlertTriangle, Link as LinkIcon, Copy, PackageCheck, ChevronDown
} from 'lucide-react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore'; 

import V10PricingDetails from './V10PricingDetails';
import V10SecureCheckout from './V10SecureCheckout'; 

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

const PRICING_PACKAGES = [
  { id: 'B2B RETAINER', priceNum: 200, price: '$200', type: '/ MONTH', desc: '3 custom projects of your choice every month.' },
  { id: 'CINEMATIC PITCH', priceNum: 1500, price: '$1.500', type: 'ONE-TIME', desc: '10 production-ready projects for massive pitches.' },
  { id: 'V10 MASTER VAULT', priceNum: 7000, price: '$7.000', type: 'ONE-TIME', desc: '40 custom projects of your choice (ultimate agency archive).' }
];

const CATEGORY_ENGINE_MAP = {
  'food_ui': 'V8 Michelin UI',
  'women_bags': 'V10 Ultra-Print',
  'perfumes': 'V10 Ultra-Print'
};

// POCETAK FUNKCIJE: VaultGrid
const VaultGrid = () => {
  const location = useLocation(); 

  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false); 
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false); 
  
  const [activeFilter, setActiveFilter] = useState(location.state?.category || 'all');
  
  // POCETAK FUNKCIJE: expandedCategory state
  // Prati koja je kategorija trenutno prosirena kako bi prikazala Bundles unutar iste kartice
  const [expandedCategory, setExpandedCategory] = useState(null);
  // KRAJ FUNKCIJE: expandedCategory state
  
  const [copiedId, setCopiedId] = useState(null);

  const [customAlert, setCustomAlert] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false
  });

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('v10_vault_cart');
      if (savedCart) return JSON.parse(savedCart);
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('v10_vault_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const [activePackage, setActivePackage] = useState(null);
  const [packageLimit, setPackageLimit] = useState(0);
  const [isMonthly, setIsMonthly] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  
  const [isVaultLocked, setIsVaultLocked] = useState(true); 
  const [showCheckout, setShowCheckout] = useState(false);

  const [newProject, setNewProject] = useState({ 
    title: '', engine: '', img: '', ratio: 'aspect-video', category: '' 
  });

  const tabs = [{ id: 'all', label: 'Vault Folders' }];

  const vaultCategories = [
    { id: 'food_ui', title: 'V10 Michelin UI', subtitle: 'Premium Culinary Assets', coverImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80' },
    { id: 'women_bags', title: 'Luxury Women Bags', subtitle: 'High-End Product UI', coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
    { id: 'perfumes', title: 'V10 Executive Glass Plaques', subtitle: 'Executive Displays', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80' }
  ];

  const isVIPTest = userEmail === 'historical.stories7972@gmail.com';
  const limitReached = packageLimit > 0 && cart.length >= packageLimit;
  const canCheckout = limitReached || (isVIPTest && cart.length > 0);

  // POCETAK FUNKCIJE: Alert helpers
  const showAlert = (title, message) => setCustomAlert({ isOpen: true, title, message, onConfirm: null, isDestructive: false });
  const showConfirm = (title, message, onConfirm, isDestructive = false) => setCustomAlert({ isOpen: true, title, message, onConfirm, isDestructive });
  const closeAlert = () => setCustomAlert({ ...customAlert, isOpen: false });
  // KRAJ FUNKCIJE: Alert helpers

  useEffect(() => {
    let unsubDoc = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        setUserEmail(email); 
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com" || email === "info@aitoolsprosmart.com") {
          setIsAdmin(true); setActivePackage("ADMIN"); setIsVaultLocked(false); 
        } else {
          setIsAdmin(false);
          unsubDoc = onSnapshot(doc(db, "checkout_requests", email), (pkgSnap) => {
            if (pkgSnap.exists()) {
              const data = pkgSnap.data();
              setupPackageLimits(data.selectedPackage, data.timestamp);
              setIsVaultLocked(false); 
            } else {
              setActivePackage(null); setIsVaultLocked(true); 
            }
          });
        }
      } else {
        setIsAdmin(false); setUserEmail(null); setActivePackage(null); setIsVaultLocked(true); 
        if (unsubDoc) unsubDoc();
      }
    });
    fetchProjects();
    return () => { unsubAuth(); if (unsubDoc) unsubDoc(); };
  }, []);

  const setupPackageLimits = (pkgName, timestamp) => {
    setActivePackage(pkgName); 
    let limit = 0; let monthly = false;
    if (pkgName === 'B2B RETAINER') { limit = 3; monthly = true; }
    else if (pkgName === 'CINEMATIC PITCH') { limit = 10; }
    else if (pkgName === 'V10 MASTER VAULT') { limit = 40; }
    
    setPackageLimit(limit); setIsMonthly(monthly);

    if (monthly && timestamp) {
      let boughtDate = typeof timestamp.toDate === 'function' ? timestamp.toDate() : (timestamp instanceof Date ? timestamp : new Date());
      const diffDays = Math.ceil(Math.abs(new Date() - boughtDate) / (1000 * 60 * 60 * 24));
      if (diffDays > 31) { setCart([]); setDaysLeft(0); } else { setDaysLeft(31 - diffDays); }
    }
  };

  const handleSelectPackage = (pkgName, pkgPrice) => {
    if (!userEmail) return showAlert("Access Denied", "You must be logged in to select a package.");
    if (activePackage && activePackage !== 'ADMIN') {
      showConfirm("Switch Access Tier", `Are you sure you want to switch to ${pkgName}? Your current cart will be cleared.`, async () => {
        try {
          await setDoc(doc(db, "checkout_requests", userEmail), { email: userEmail, selectedPackage: pkgName, price: pkgPrice, status: "pending_payment", timestamp: serverTimestamp() }, { merge: true });
          setCart([]); closeAlert();
        } catch (error) { showAlert("System Error", "An error occurred. Please try again."); }
      }, false);
    } else {
      setDoc(doc(db, "checkout_requests", userEmail), { email: userEmail, selectedPackage: pkgName, price: pkgPrice, status: "pending_payment", timestamp: serverTimestamp() }, { merge: true }).then(() => setCart([]));
    }
  };

  const handleCancelPackage = () => {
    showConfirm("Cancel Plan", "Are you sure you want to cancel your package? You will lose access to Vault files.", async () => {
      try { await deleteDoc(doc(db, "checkout_requests", userEmail)); setCart([]); setActivePackage(null); setIsVaultLocked(true); closeAlert(); } 
      catch (error) { showAlert("System Error", "An error occurred."); }
    }, true);
  };

  const fetchProjects = async () => {
    try {
      const snap = await getDocs(query(collection(db, "v10_projects"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        let fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const targetOrder = ["esmerald-project", "obsidian-emerald", "tom-foord-oud-wood", "creed-adventus"];
        fetched.sort((a, b) => {
          const iA = targetOrder.indexOf(a.id); const iB = targetOrder.indexOf(b.id);
          if (iA !== -1 && iB !== -1) return iA - iB; if (iA !== -1) return -1; if (iB !== -1) return 1; return 0; 
        });
        setProjects(fetched); 
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleAddToCart = (e, project) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!isVIPTest && limitReached) {
      setIsLimitModalOpen(true);
      return;
    }
    
    if (!cart.find(item => item.id === project.id)) {
      const newCart = [...cart, project];
      setCart(newCart);
      
      if (!isVIPTest && packageLimit > 0 && newCart.length === packageLimit) {
        setTimeout(() => {
          setIsLimitModalOpen(true);
        }, 300);
      }
    }
  };

  const handleRemoveFromCart = (projectId) => {
    setCart(cart.filter(item => item.id !== projectId));
  };

  const createSlug = (text) => text.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingThumbnail(true);
    const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewProject({ ...newProject, img: data.secure_url });
      else showAlert("Upload Error", data.error?.message);
    } catch (error) {} finally { setIsUploadingThumbnail(false); }
  };

  const handleCreateProject = async () => {
    if (!newProject.title) return showAlert("Validation Error", "Project Title is required!");
    setIsSaving(true);
    try {
      const projectId = createSlug(newProject.title);
      await setDoc(doc(db, "v10_projects", projectId), {
        title: newProject.title, engine: newProject.engine, img: newProject.img,
        ratio: newProject.ratio, category: newProject.category, 
        createdAt: serverTimestamp(), description: "New project initialized.", phases: [] 
      });
      fetchProjects(); setIsModalOpen(false);
      setNewProject({ title: '', engine: '', img: '', ratio: 'aspect-video', category: '' });
    } catch (error) {} finally { setIsSaving(false); }
  };

  const handleDeleteProject = (projectId, e) => {
    e.preventDefault(); e.stopPropagation();
    showConfirm("Delete Project", "Irreversible structural action. Proceed?", async () => {
      try { await deleteDoc(doc(db, "v10_projects", projectId)); setProjects(prev => prev.filter(p => p.id !== projectId)); closeAlert(); } 
      catch (error) { closeAlert(); }
    }, true);
  };

  const handleCopyProjectTitle = (e, title, id) => {
    e.preventDefault(); 
    e.stopPropagation();
    navigator.clipboard.writeText(title);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenModal = () => {
    if (activeFilter !== 'all') {
      setNewProject({
        ...newProject,
        category: activeFilter,
        engine: CATEGORY_ENGINE_MAP[activeFilter] || ''
      });
    } else {
       setNewProject({
        ...newProject,
        category: 'food_ui',
        engine: CATEGORY_ENGINE_MAP['food_ui']
      });
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || isLimitModalOpen || customAlert.isOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, isLimitModalOpen, customAlert.isOpen]);

  const filteredProjects = projects?.filter((project) => project.category === activeFilter) || [];

  if (showCheckout) {
    return (
      <V10SecureCheckout 
        isOpen={true}
        onClose={() => setShowCheckout(false)} 
        packageName={activePackage} 
        selectedProjects={cart} 
        userEmail={userEmail} 
        onSuccess={() => {
          setCart([]);
          localStorage.removeItem('v10_vault_cart');
          setShowCheckout(false);
          showAlert("Payment Verified", "Your transaction was successful. Files will be deployed directly.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-12 px-4 sm:px-8 relative selection:bg-[#ff6a00] selection:text-black font-sans">
      <Helmet>
        <title>V10 Master Vault | Premium B2B UI/UX Assets</title>
        <meta name="description" content="Exclusive B2B repository for 150MP UI/UX designs, Master PSDs, and cinematic commercial pitches. Reserved for premium agencies." />
        <meta name="theme-color" content="#ff6a00" />
        
        <meta property="og:type" content="website" />
        <meta property="og:title" content="V10 Master Vault | Premium B2B Assets" />
        <meta property="og:description" content="Exclusive B2B repository for 150MP UI/UX designs, Master PSDs, and cinematic pitches." />
        <meta property="og:image" content="https://www.aitoolsprosmart.com/v8-secure-blue.webp" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="V10 Master Vault | Premium B2B Assets" />
        <meta name="twitter:description" content="Exclusive B2B repository for 150MP UI/UX designs and cinematic pitches." />
        <meta name="twitter:image" content="https://www.aitoolsprosmart.com/v8-secure-blue.webp" />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,106,0,0.08)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(255,106,0,0.08)_0%,_transparent_50%)]"></div>
      <div className="max-w-[1800px] mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">V10 <span className="text-[#ff6a00]">Vault</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#ff6a00]" /> Experimental R&D Sector</p>
          </div>
          <div className="mt-4 md:mt-0 text-zinc-600 text-xs font-black uppercase tracking-widest">
            {isAdmin ? 'ADMIN ACCESS GRANTED' : (activeFilter === 'all' ? 'SELECT CATEGORY' : `Showing: ${filteredProjects.length} Projects`)}
          </div>
        </div>

        {!isAdmin && <div className="relative z-20 mb-8"><V10PricingDetails /></div>}

        <div className="flex flex-col xl:flex-row gap-12 items-start">
          
          {!isVaultLocked && !isAdmin && (
            <div className="w-full xl:w-[320px] flex-shrink-0 sticky top-24 z-20">
              <h2 className="text-[#ff6a00] font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Your Access Tier</h2>
              <div className="flex flex-col gap-4">
                {PRICING_PACKAGES.map(pkg => {
                  const isActive = activePackage === pkg.id;
                  return (
                    <div key={pkg.id} className={`p-6 rounded-3xl border transition-all duration-500 ${isActive ? 'border-[#ff6a00] bg-[#ff6a00]/10 shadow-[0_0_40px_rgba(255,106,0,0.2)] backdrop-blur-md' : 'border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md hover:border-white/30'}`}>
                      <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">{pkg.id}</h3>
                      <div className="text-zinc-400 font-bold mb-3">{pkg.price} <span className="text-xs">{pkg.type}</span></div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-6 leading-relaxed">{pkg.desc}</p>
                      {isActive ? (
                        <button onClick={handleCancelPackage} className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/30 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors cursor-pointer">Cancel Plan</button>
                      ) : (
                        <button onClick={() => handleSelectPackage(pkg.id, pkg.priceNum)} className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors bg-zinc-800 text-white hover:bg-[#ff6a00] hover:text-black cursor-pointer">Switch to this</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex-1 w-full relative">
            {!isVaultLocked && (
              <div className="flex flex-wrap gap-2 justify-center w-full max-w-fit mx-auto mb-12 p-2 bg-[#0a0a0a]/80 backdrop-blur-lg border border-white/10 rounded-full shadow-2xl relative z-20">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`relative px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-colors duration-300 outline-none z-10 cursor-pointer ${activeFilter === tab.id ? 'text-black' : 'text-zinc-500 hover:text-white'}`}>
                    {activeFilter === tab.id && <motion.div layoutId="v8ActiveFilterPill" className="absolute inset-0 bg-[#ff6a00] rounded-full shadow-[0_0_20px_rgba(255,106,0,0.4)] -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                    <span className="relative z-20">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}

            {isVaultLocked && !isAdmin && (
              <div className="absolute inset-0 z-[60] flex items-center justify-center pointer-events-auto p-4 bg-black/60 backdrop-blur-md rounded-[2rem]">
                <div className="bg-gradient-to-br from-[#020617]/95 to-black border border-blue-500/30 border-t-4 border-t-red-600 w-full max-w-5xl rounded-[2rem] shadow-[0_0_80px_rgba(59,130,246,0.2)] flex flex-col md:flex-row overflow-hidden">
                  
                  <div className="flex-1 p-10 md:p-12 border-b md:border-b-0 md:border-r border-blue-500/20 bg-blue-950/10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                      </div>
                      <h2 className="text-3xl font-black text-red-500 uppercase tracking-[0.2em] drop-shadow-md">Warning</h2>
                    </div>
                    
                    <p className="text-zinc-300 text-base font-medium leading-relaxed mb-6">
                      We have deployed an advanced cryptographic watermarking and Reverse Image Tracking software across all visual assets. Every file in this vault carries a permanent, integrated footprint detailing the <strong className="text-blue-400">exact license and the authorized buyer's identity</strong>.
                    </p>
                    
                    <div className="border-l-2 border-red-500/50 pl-5 bg-red-500/5 py-4 pr-4 rounded-r-xl mb-6">
                      <p className="text-zinc-400 text-sm leading-relaxed font-bold">
                        Any misuse, unauthorized distribution, or resale of these files beyond the scope of your purchased license will be immediately prosecuted under the <strong className="text-white">Digital Millennium Copyright Act (DMCA)</strong> and <strong className="text-white">Title 17 of the United States Code</strong>. Violations will result in immediate DMCA domain takedowns and statutory financial penalties of up to $150,000.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      <p className="text-blue-400 font-black text-xs uppercase tracking-widest">
                        Please log in and select an access tier to proceed.
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-2/5 p-10 md:p-12 flex flex-col items-center justify-center text-center bg-black/40 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1)_0%,_transparent_70%)] pointer-events-none"></div>
                    
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-30 animate-pulse"></div>
                      <Lock className="w-20 h-20 text-blue-500 relative z-10 drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
                    </div>
                    
                    <h3 className="text-4xl font-black text-white uppercase tracking-widest mb-3 relative z-10">Vault Locked</h3>
                    <p className="text-blue-400 font-black text-xs uppercase tracking-[0.3em] mb-8 relative z-10">
                      Secured V10 Environment
                    </p>
                    
                    <div className="bg-white/5 border border-white/10 rounded-xl p-5 w-full relative z-10">
                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
                        {userEmail 
                          ? "Please select an access tier (Package) above to unlock the assets." 
                          : "Please log in and select an access tier to unlock this vault."}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            <div className={`relative transition-all duration-500 ${isVaultLocked && !isAdmin ? 'pointer-events-none select-none' : ''}`}>
              {activeFilter === 'all' ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {/* POCETAK FUNKCIJE: Mapiranje Kategorija (Sa novim harmonika efektom za Bundles) */}
                  {vaultCategories.map((cat) => (
                    <motion.div 
                      layout
                      key={cat.id}
                      onClick={() => {
                        if (cat.id === 'perfumes') {
                          // OVO OTVARA KARTICU UMESTO DA PREBACUJE EKRAN
                          setExpandedCategory(expandedCategory === cat.id ? null : cat.id);
                        } else {
                          setActiveFilter(cat.id);
                        }
                      }} 
                      className="group relative w-full rounded-3xl cursor-pointer shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-[#111] via-[#1a1a1a] to-[#0a0a0a] p-[2px] border border-white/5 hover:border-[#ff6a00]/50 overflow-hidden"
                    >
                      {/* Unutrašnji kontejner koji se širi */}
                      <div className="relative w-full h-full bg-[#050505] rounded-[22px] flex flex-col overflow-hidden">
                        
                        {/* Glavni deo kartice (Uvek vidljiv, fiksna visina 280px) */}
                        <div className="flex flex-row items-center p-8 gap-10 h-[280px]">
                          <div className="h-full w-[50%] bg-black relative flex-shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner">
                            <img src={cat.coverImage} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100" />
                            <div className="absolute inset-0 border-[3px] border-[#ff6a00]/30 shadow-[inset_0_0_20px_rgba(255,106,0,0.3)] pointer-events-none transition-all duration-500 group-hover:border-[#ff6a00]/80 group-hover:shadow-[inset_0_0_40px_rgba(255,106,0,0.6)]"></div>
                          </div>
                          <div className="w-[50%] flex flex-col justify-center transform group-hover:translate-x-2 transition-transform duration-500 z-30 pointer-events-auto select-text cursor-text">
                            <span className="text-[#ff6a00] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block drop-shadow-md">{cat.subtitle}</span>
                            <h3 className="text-white text-3xl leading-tight font-black tracking-widest drop-shadow-lg">{cat.title}</h3>
                          </div>
                        </div>

                        {/* Prošireni deo sa Bundles (Pojavljuje se unutar kartice) */}
                        <AnimatePresence>
                          {expandedCategory === cat.id && cat.id === 'perfumes' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.4, ease: "easeInOut" }}
                              className="border-t border-white/10 bg-[#0a0a0a]"
                            >
                              <div className="p-8 pt-6">
                                <div 
                                  onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setActiveFilter(cat.id); 
                                  }}
                                  className="group/bundle relative h-[220px] w-full rounded-2xl cursor-pointer shadow-xl transition-all duration-300 bg-gradient-to-br from-[#111] to-[#050505] p-[1px] border border-[#ff6a00]/30 hover:border-[#ff6a00]"
                                >
                                  <div className="relative w-full h-full bg-[#050505] rounded-[20px] flex flex-row items-center p-6 gap-8 overflow-hidden">
                                    <div className="h-full w-[40%] bg-black relative flex-shrink-0 flex items-center justify-center rounded-xl overflow-hidden">
                                      <img src={cat.coverImage} alt="Bundles" className="w-full h-full object-cover group-hover/bundle:scale-110 transition-transform duration-700 opacity-70 group-hover/bundle:opacity-100" />
                                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/10 rounded px-2 py-1 flex items-center gap-1.5">
                                        <PackageCheck className="w-3 h-3 text-[#ff6a00]" />
                                        <span className="text-[10px] text-white font-bold tracking-wider">BUNDLES</span>
                                      </div>
                                    </div>
                                    <div className="w-[60%] flex flex-col justify-center z-30">
                                      <span className="text-[#ff6a00] text-[10px] font-black uppercase tracking-[0.4em] mb-2 block drop-shadow-md">PREMIUM COLLECTION</span>
                                      <h3 className="text-white text-2xl font-black tracking-widest leading-snug drop-shadow-lg">V10 Executive Glass Plaques Bundles</h3>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                      </div>
                    </motion.div>
                  ))}
                  {/* KRAJ FUNKCIJE: Mapiranje Kategorija */}
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16 items-start">
                  <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project) => (
                      <motion.div 
                        key={project.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: -20 }} 
                        transition={{ duration: 0.4, ease: "easeOut" }} 
                        className="group relative h-[300px] w-full rounded-2xl overflow-hidden border border-white/10 hover:border-[#ff6a00]/70 transition-all duration-500 shadow-2xl flex flex-col"
                      >
                        <Link to={`/ui-ux/project/${project.id}`} className="absolute inset-0 z-10 cursor-pointer"></Link>
                        
                        {project.img ? ( 
                          <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" /> 
                        ) : ( 
                          <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center"><ImageIcon className="w-10 h-10 text-orange-500/40" /></div> 
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-6 z-20 pointer-events-none flex flex-col items-start">
                          <span className={`text-[#ff6a00] text-[9px] font-black uppercase tracking-widest block mb-1 drop-shadow-md ${isAdmin ? 'pointer-events-auto cursor-text select-text' : ''}`}>
                            {project.engine}
                          </span>
                          <h3 className={`text-white text-lg lg:text-xl font-black uppercase tracking-widest leading-snug drop-shadow-lg pr-12 ${isAdmin ? 'pointer-events-auto cursor-text select-text' : ''}`}>
                            {project.title}
                          </h3>
                        </div>
                        
                        {isAdmin && (
                          <button onClick={(e) => handleCopyProjectTitle(e, project.title, project.id)} className="absolute top-4 left-4 bg-black/80 hover:bg-orange-500 text-orange-500 hover:text-black p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg border border-white/10 cursor-pointer" title="Kopiraj naziv za ZIP">
                            {copiedId === project.id ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}

                        {!isAdmin && (
                          <button onClick={(e) => handleAddToCart(e, project)} disabled={!isVIPTest && limitReached && cart.find(i => i.id === project.id)} className="absolute bottom-5 right-5 z-30 bg-black/80 backdrop-blur-md hover:bg-[#ff6a00] text-[#ff6a00] hover:text-black border border-white/20 hover:border-[#ff6a00] p-3 rounded-2xl transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn cursor-pointer">
                            {cart.find(i => i.id === project.id) ? ( <CheckCircle2 className="w-5 h-5 text-emerald-500" /> ) : ( <Plus className="w-5 h-5" /> )}
                          </button>
                        )}
                        
                        {isAdmin && (
                          <button onClick={(e) => handleDeleteProject(project.id, e)} className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-white/10 hover:scale-110 cursor-pointer" title="Obriši projekat">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))}
                    {isAdmin && (
                      <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.4 }} className="h-[300px] w-full">
                        <button onClick={handleOpenModal} className="group relative w-full h-full rounded-2xl overflow-hidden bg-[#050505] border-2 border-dashed border-[#ff6a00]/30 hover:border-[#ff6a00] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_0_rgba(255,106,0,0)] hover:shadow-[0_0_40px_rgba(255,106,0,0.15)]">
                          <div className="w-16 h-16 rounded-full bg-[#ff6a00]/10 group-hover:bg-[#ff6a00] flex items-center justify-center transition-colors duration-300 mb-4"><Plus className="w-8 h-8 text-[#ff6a00] group-hover:text-black transition-colors" /></div>
                          <span className="text-[#ff6a00] font-black uppercase tracking-widest text-sm group-hover:scale-105 transition-transform">Initialize Project</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {!isAdmin && !isVaultLocked && activeFilter !== 'all' && (
          <div className="fixed bottom-8 right-8 z-[80] w-80 bg-[#0a0a0a]/90 border border-[#ff6a00]/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
                <span className="text-white font-black uppercase tracking-widest text-sm">Vault Cart</span>
              </div>
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-zinc-900 text-[#ff6a00] border border-[#ff6a00]/30 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                {cart.length} / {isVIPTest ? "∞" : (packageLimit || "...")}
              </span>
            </div>
            
            {cart.length > 0 && (
              <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 border border-white/10 hover:border-[#ff6a00]/50 rounded-xl p-3 transition-colors group/item">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest truncate pr-2">{item.title}</span>
                    <button onClick={() => handleRemoveFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isMonthly && limitReached && !isVIPTest && daysLeft > 0 && (
              <div className="mb-5 flex items-center gap-2 text-xs font-bold text-amber-500 bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                <Clock className="w-4 h-4" /><span>Reset in {daysLeft} days</span>
              </div>
            )}
            
            {canCheckout ? (
              <div className="flex flex-col gap-4">
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
                  {isVIPTest && !limitReached ? (
                    <span className="text-emerald-400 block mb-2">VIP Access: Unlimited Cart</span>
                  ) : (
                    <span className="block mb-2">Tier limit reached.</span>
                  )}
                  Proceed to checkout to generate download links.
                </div>
                <button onClick={() => setShowCheckout(true)} className="w-full bg-gradient-to-r from-[#ff6a00] to-[#e65c00] text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,106,0,0.4)] cursor-pointer">
                  <Lock className="w-4 h-4" /> Security Checkout
                </button>
              </div>
            ) : (
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic border-t border-white/5 pt-5 mt-2 text-center">
                {cart.length === 0 ? "Select items to begin." : "Add more items to fulfill tier."}
              </div>
            )}
          </div>
        )}
      </div>

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isLimitModalOpen && (
            <motion.div 
              key="limit-modal-overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 30 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="relative w-full max-w-2xl p-12 md:p-16 rounded-[2.5rem] flex flex-col items-center text-center bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 shadow-[0_50px_100px_rgba(0,0,0,0.9),_inset_0_2px_15px_rgba(255,255,255,0.1)] overflow-hidden"
              >
                
                <button 
                  onClick={() => setIsLimitModalOpen(false)} 
                  className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform"
                >
                  <X className="w-6 h-6 drop-shadow-md" />
                </button>
                
                <div className="relative w-32 h-32 mb-10 mt-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-cyan-500 rounded-full blur-[40px] opacity-40 animate-pulse"></div>
                  
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-15px] rounded-full border-[2px] border-cyan-500/20 border-t-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></motion.div>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-30px] rounded-full border-[2px] border-dashed border-blue-500/30 border-b-cyan-400"></motion.div>
                  
                  <motion.div 
                    animate={{ y: [-8, 8, -8] }} 
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 w-24 h-24 bg-gradient-to-b from-slate-700 to-black rounded-[2rem] border border-slate-500 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(255,255,255,0.3),_0_20px_30px_rgba(0,0,0,0.8)] transform -rotate-3"
                  >
                    <Lock className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.9)]" />
                  </motion.div>
                </div>
                
                <h2 className="text-4xl font-black uppercase tracking-[0.2em] mb-6 text-white drop-shadow-md z-10">
                  Vault Locked
                </h2>
                
                <p className="text-slate-300 text-sm font-bold leading-relaxed uppercase tracking-widest max-w-md mb-12 z-10">
                  Capacity reached. All <span className="text-cyan-400 font-black">{packageLimit}</span> master assets for your <span className="text-emerald-400 font-black">{activePackage}</span> tier are secured.
                </p>
                
                <button 
                  onClick={() => {
                    setIsLimitModalOpen(false);
                    setShowCheckout(true);
                  }} 
                  className="relative w-full max-w-md px-8 py-6 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-[0.15em] text-base transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_6px_rgba(255,255,255,0.6)] border-b-[6px] border-blue-900 hover:translate-y-[2px] hover:border-b-[4px] active:translate-y-[6px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10"
                >
                  <ShieldCheck className="w-6 h-6 drop-shadow-sm" /> 
                  <span className="drop-shadow-sm">Deploy Assets</span>
                </button>
                
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && isAdmin && (
            <motion.div key="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 p-10 rounded-[2.5rem] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.15)] max-h-[95vh] overflow-y-auto custom-scrollbar">
                
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform">
                  <X className="w-5 h-5 drop-shadow-md" />
                </button>
                
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-md">Init New Project</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Project Title</label>
                    <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="e.g. Obsidian Emerald" />
                  </div>
                  
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Image Format (Ratio)</label>
                    <div className="relative">
                      <select value={newProject.ratio} onChange={(e) => setNewProject({ ...newProject, ratio: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer shadow-inner">
                        <option value="aspect-video">16:9 (Cinematic / Landscape)</option>
                        <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
                        <option value="aspect-[3/2]">3:2 (Classic Photo)</option>
                        <option value="aspect-square">1:1 (Square Product)</option>
                        <option value="aspect-[4/5]">4:5 (Portrait / IG)</option>
                        <option value="aspect-[2/3]">2:3 (Classic Photo Portrait)</option>
                        <option value="aspect-[9/16]">9:16 (Vertical / Reels)</option>
                        <option value="aspect-auto">Auto (Zadrži originalni format)</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Category</label>
                      <div className="bg-[#020617]/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                        {vaultCategories.find(c => c.id === newProject.category)?.title || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Engine</label>
                      <div className="bg-[#020617]/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs font-black uppercase tracking-widest">
                        {newProject.engine || 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Cover Image</label>
                    <div className="relative group cursor-pointer">
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center transition-all ${newProject.img ? 'bg-gradient-to-br from-cyan-400 to-blue-600 p-[3px] shadow-[0_0_40px_rgba(6,182,212,0.4)]' : 'border-2 border-dashed border-slate-600 bg-[#020617] group-hover:border-cyan-400 shadow-inner'}`}>
                        {isUploadingThumbnail ? (
                          <div className={`w-full h-full flex items-center justify-center ${newProject.img ? 'bg-black rounded-xl' : ''}`}><Loader2 className="w-8 h-8 text-cyan-400 animate-spin" /></div>
                        ) : newProject.img ? (
                          <div className="w-full h-full bg-black rounded-xl p-[4px]"><img src={newProject.img} alt="Preview" className="w-full h-full object-cover rounded-lg brightness-110" /></div>
                        ) : (
                          <><UploadCloud className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mb-3" /><span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Click to upload cover</span></>
                        )}
                      </div>
                    </div>
                  </div>

                  <button onClick={handleCreateProject} disabled={isSaving || isUploadingThumbnail} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-widest mt-8 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-b-[5px] border-blue-900 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[5px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 drop-shadow-sm" /> <span className="drop-shadow-sm">Save Project</span></>}
                  </button>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {customAlert.isOpen && (
            <motion.div key="custom-alert-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md">
                
                <div className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.2)] flex flex-col items-center text-center overflow-hidden">
                  
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-[60px] opacity-30 pointer-events-none ${customAlert.isDestructive ? 'bg-red-500' : 'bg-cyan-500'}`}></div>
                  
                  <div className={`w-20 h-20 rounded-full mb-8 flex items-center justify-center border relative z-10 shadow-[inset_0_2px_5px_rgba(255,255,255,0.15),_0_10px_20px_rgba(0,0,0,0.8)] ${customAlert.isDestructive ? 'bg-gradient-to-b from-slate-800 to-black border-slate-600 text-red-500' : 'bg-gradient-to-b from-slate-800 to-black border-slate-600 text-cyan-400'}`}>
                    {customAlert.isDestructive ? <AlertTriangle className="w-10 h-10 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" /> : <ShieldCheck className="w-10 h-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                  </div>
                  
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4 relative z-10 drop-shadow-md">{customAlert.title}</h2>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-10 max-w-sm relative z-10">{customAlert.message}</p>
                  
                  <div className="flex w-full gap-4 relative z-10">
                    {customAlert.onConfirm ? (
                      <>
                        <button onClick={closeAlert} className="flex-1 py-4 rounded-xl border border-slate-500 bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white font-black uppercase tracking-widest text-[10px] transition-all shadow-lg cursor-pointer">Cancel</button>
                        
                        <button onClick={customAlert.onConfirm} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5),_inset_0_2px_2px_rgba(255,255,255,0.4)] border-b-[4px] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 cursor-pointer ${customAlert.isDestructive ? 'bg-gradient-to-b from-red-500 to-red-700 border-red-900' : 'bg-gradient-to-b from-cyan-500 to-blue-700 border-blue-900'}`}>Confirm</button>
                      </>
                    ) : (
                      <button onClick={closeAlert} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-white bg-gradient-to-b from-cyan-400 to-blue-600 border-b-[4px] border-blue-900 shadow-[0_10px_20px_rgba(0,0,0,0.5),_inset_0_2px_2px_rgba(255,255,255,0.4)] hover:translate-y-[2px] hover:border-b-[2px] active:translate-y-[4px] active:border-b-0 transition-all cursor-pointer">Acknowledge</button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};
// KRAJ FUNKCIJE: VaultGrid

export default VaultGrid;