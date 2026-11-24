// FAJL: src/ux/VaultGrid.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ShieldCheck, Plus, X, Save, 
  Image as ImageIcon, UploadCloud, Loader2, Trash2,
  ShoppingCart, Lock, Clock, CheckCircle2, AlertTriangle, Copy, ChevronDown, ArrowLeft
} from 'lucide-react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot, deleteField } from 'firebase/firestore'; 

import V10SecureCheckout from './V10SecureCheckout'; 
import V10PricingDetails from './V10PricingDetails'; 

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

const ADMIN_EMAILS = [
  "damnjanovicgoran7@gmail.com",
  "aitoolsprosmart@gmail.com",
  "info@aitoolsprosmart.com"
];

const PRICING_PACKAGES = [
  { id: 'B2B RETAINER', priceNum: 200, price: '$200', type: '/ MONTH', desc: '3 custom projects of your choice every month.' },
  { id: 'CINEMATIC PITCH', priceNum: 1500, price: '$1,500', type: 'ONE-TIME', desc: '10 production-ready projects for massive pitches.' },
  { id: 'V10 MASTER VAULT', priceNum: 7000, price: '$7,000', type: 'ONE-TIME', desc: '40 custom projects of your choice (ultimate agency archive).' }
];

const VaultGrid = () => {
  const location = useLocation(); 

  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isMigratingLinks, setIsMigratingLinks] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false); 
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false); 
  
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedFilter = sessionStorage.getItem('v10_active_filter');
      if (savedFilter) return savedFilter;
    }
    return location.state?.category || 'all';
  });

  const [pendingProject, setPendingProject] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedProject = sessionStorage.getItem('v10_pending_project');
        if (savedProject && savedProject !== 'undefined' && savedProject !== 'null') {
          return JSON.parse(savedProject);
        }
      } catch (e) { console.error(e); }
    }
    return null;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('v10_active_filter', activeFilter);
    }
  }, [activeFilter]);
  
  const [copiedId, setCopiedId] = useState(null);

  const [customAlert, setCustomAlert] = useState({
    isOpen: false, title: '', message: '', onConfirm: null, isDestructive: false
  });

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('v10_vault_cart');
        if (savedCart && savedCart !== 'undefined' && savedCart !== 'null') {
          const parsed = JSON.parse(savedCart);
          return Array.isArray(parsed) ? parsed : [];
        }
      } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('v10_vault_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const [activePackage, setActivePackage] = useState(null);
  const [packagePrice, setPackagePrice] = useState(0);
  const [packageLimit, setPackageLimit] = useState(0);
  const [isMonthly, setIsMonthly] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  
  const [showCheckout, setShowCheckout] = useState(false);

  const [newProject, setNewProject] = useState({ 
    title: '', engine: 'V10 ULTRA-PRINT', img: '', ratio: 'aspect-[21/9]', category: '' 
  });

  const tabs = [{ id: 'all', label: 'Vault Folders' }];

  const vaultCategories = [
    { id: 'food_ui', title: 'V10 Michelin UI', subtitle: 'Premium Culinary Assets', coverImage: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80' },
    { id: 'women_bags', title: 'Luxury Women Bags', subtitle: 'High-End Product UI', coverImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80' },
    { id: 'perfumes', title: 'V10 Executive Glass Plaques', subtitle: 'Executive Displays', coverImage: '/orange.webp' },
    { id: 'storytelling', title: 'V10 Storytelling', subtitle: 'Cinematic Narratives', coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', badge: 'EXCLUSIVE' }
  ];

  const isVIPTest = userEmail === 'historical.stories7972@gmail.com';
  const limitReached = packageLimit > 0 && cart.length >= packageLimit;
  const canCheckout = limitReached || (isVIPTest && cart.length > 0);

  const exposedProjects = projects.filter(p => Boolean(p.driveLink || p.psdLink || p.zipLink || (p.phases || []).some(ph => ph.psdLink)));

  const showAlert = (title, message) => setCustomAlert({ isOpen: true, title, message, onConfirm: null, isDestructive: false });
  const showConfirm = (title, message, onConfirm, isDestructive = false) => setCustomAlert({ isOpen: true, title, message, onConfirm, isDestructive });
  const closeAlert = () => setCustomAlert({ ...customAlert, isOpen: false });

  useEffect(() => {
    let unsubDoc = null;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        setUserEmail(email); 
        if (ADMIN_EMAILS.includes(email)) {
          setIsAdmin(true); 
          setActivePackage("ADMIN"); 
          setIsAuthLoaded(true);
        } else {
          setIsAdmin(false);
          unsubDoc = onSnapshot(doc(db, "checkout_requests", email), (pkgSnap) => {
            if (pkgSnap.exists()) {
              const data = pkgSnap.data();
              setPackagePrice(data.price || 0);
              setupPackageLimits(data.selectedPackage, data.timestamp);
            } else {
              setActivePackage(null); 
              setIsPricingModalOpen(true);
            }
            setIsAuthLoaded(true);
          });
        }
      } else {
        setIsAdmin(false); 
        setUserEmail(null); 
        setActivePackage(null); 
        setIsAuthLoaded(true);
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

  const migrateExposedLinksToVault = async () => {
    if (exposedProjects.length === 0) return;
    setIsMigratingLinks(true);
    try {
      for (const p of exposedProjects) {
        const phasePsds = (p.phases || [])
          .filter(ph => ph.psdLink)
          .map(ph => ({ title: ph.title || "Scene PSD", psdLink: ph.psdLink }));

        await setDoc(doc(db, "v10_project_vault_links", p.id), {
          projectId: p.id,
          title: p.title || p.id,
          driveLink: p.driveLink || p.zipLink || "",
          psdLink: p.psdLink || "",
          ...(phasePsds.length > 0 ? { phasePsds } : {}),
          migratedAt: serverTimestamp()
        }, { merge: true });

        const cleanedPhases = (p.phases || []).map(({ psdLink, ...rest }) => rest);

        await setDoc(doc(db, "v10_projects", p.id), {
          driveLink: deleteField(),
          psdLink: deleteField(),
          zipLink: deleteField(),
          phases: cleanedPhases
        }, { merge: true });
      }
      await fetchProjects();
      showAlert("Vault Secured", `Uspešno zaključano ${exposedProjects.length} projekata u privatni sef (v10_project_vault_links)!`);
    } catch (err) {
      console.error("Migration error:", err);
      showAlert("Migration Error", err.message);
    } finally {
      setIsMigratingLinks(false);
    }
  };

  const handleCancelPackage = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    showConfirm("Cancel Plan", "Da li ste sigurni da želite da promenite ili otkažete izabrani paket?", async () => {
      try { 
        await deleteDoc(doc(db, "checkout_requests", userEmail)); 
        setCart([]); 
        setActivePackage(null); 
        closeAlert(); 
      } 
      catch (error) { 
        showAlert("System Error", "Došlo je do greške prilikom brisanja."); 
      }
    }, true);
  };

  const sanitizeForCart = (project) => ({
    id: project.id,
    title: project.title,
    engine: project.engine || "V10 ULTRA-PRINT",
    img: project.img || "",
    category: project.category || "all"
  });

  const performAddToCart = (project) => {
    if (!isVIPTest && limitReached) {
      setIsLimitModalOpen(true);
      return;
    }
    if (!cart.find(item => item.id === project.id)) {
      const newCart = [...cart, sanitizeForCart(project)];
      setCart(newCart);
      if (!isVIPTest && packageLimit > 0 && newCart.length === packageLimit) {
        setTimeout(() => { setIsLimitModalOpen(true); }, 300);
      }
    }
  };

  useEffect(() => {
    if (isAuthLoaded && userEmail && !isAdmin) {
      if (pendingProject) {
        if (activePackage) {
          performAddToCart(pendingProject);
          setPendingProject(null);
          sessionStorage.removeItem('v10_pending_project');
          setIsPricingModalOpen(false);
        } else {
          setIsPricingModalOpen(true); 
        }
      } else if (!activePackage) {
        setIsPricingModalOpen(true); 
      }
    }
  }, [isAuthLoaded, userEmail, activePackage, pendingProject, isAdmin]);

  const fetchProjects = async () => {
    try {
      const snap = await getDocs(query(collection(db, "v10_projects"), orderBy("createdAt", "desc")));
      if (!snap.empty) {
        let fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        const targetOrder = ["esmerald-project", "obsidian-emerald", "tom-foord-oud-wood", "creed-adventus"];
        fetched.sort((a, b) => {
          const iA = targetOrder.indexOf(a.id); const iB = targetOrder.indexOf(b.id);
          if (iA !== -1 && iB !== -1) return iA - iB; if (iA !== -1) return -1; if (iB !== -1) return 1; return 0; 
        });
        setProjects(fetched); 
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  const handleAddToCart = async (e, project) => {
    e.preventDefault(); 
    e.stopPropagation();
    const cleanProj = sanitizeForCart(project);
    
    if (!userEmail) {
      sessionStorage.setItem('v10_pending_project', JSON.stringify(cleanProj));
      setPendingProject(cleanProj);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Login failed", error);
        sessionStorage.removeItem('v10_pending_project');
        setPendingProject(null);
      }
      return;
    }
    
    if (!isAdmin && !activePackage) {
      sessionStorage.setItem('v10_pending_project', JSON.stringify(cleanProj));
      setPendingProject(cleanProj);
      setIsPricingModalOpen(true);
      return;
    }
    
    performAddToCart(cleanProj);
  };

  const handleRemoveFromCart = (projectId) => {
    setCart(cart.filter(item => item.id !== projectId));
  };

  const createSlug = (text) => text.toLowerCase().trim().replace(/[\s\W-]+/g, '-');

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingThumbnail(true);
    const formData = new FormData(); 
    formData.append('file', file); 
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewProject({ ...newProject, img: data.secure_url });
      else showAlert("Upload Error", data.error?.message || "Upload failed.");
    } catch (error) {
      showAlert("Upload Error", error.message);
    } finally { 
      setIsUploadingThumbnail(false); 
      e.target.value = null; 
    }
  };

  const handleCreateProject = async (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!newProject.title || !newProject.title.trim()) {
      return showAlert("Input Required", "Unesi naslov projekta (Project Title) da bi sačuvao!");
    }
    if (isSaving || isUploadingThumbnail) return;
    setIsSaving(true);
    
    try {
      const safeTitle = newProject.title.trim();
      const projectId = createSlug(safeTitle);
      const safeCategory = (newProject.category || '').toLowerCase().trim(); 
      
      const newProjData = {
        title: safeTitle, 
        engine: newProject.engine || 'V10 ULTRA-PRINT', 
        img: newProject.img || '',
        ratio: newProject.ratio || 'aspect-[21/9]', 
        category: safeCategory, 
        createdAt: new Date(), 
        description: "Premium V10 Master Asset.", 
        phases: [] 
      };
      
      setIsModalOpen(false);
      setProjects(prev => {
        if (prev.find(p => p.id === projectId)) return prev;
        return [{ id: projectId, ...newProjData }, ...prev];
      });
      
      setNewProject({ title: '', engine: 'V10 ULTRA-PRINT', img: '', ratio: 'aspect-[21/9]', category: '' });

      const dbData = { ...newProjData, createdAt: serverTimestamp() };
      await setDoc(doc(db, "v10_projects", projectId), dbData);
    } catch (error) {
      console.error("Greška pri kreiranju:", error);
      showAlert("Sistemska greška", error.message);
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleDeleteProject = (projectId, e) => {
    e.preventDefault(); e.stopPropagation();
    showConfirm("Delete Project", "Irreversible structural action. Proceed?", async () => {
      try {
        await deleteDoc(doc(db, "v10_projects", projectId));
        await deleteDoc(doc(db, "v10_project_vault_links", projectId));
        setProjects(prev => prev.filter(p => p.id !== projectId));
        closeAlert();
      } catch (error) { closeAlert(); }
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
    const currentCategory = activeFilter === 'all' ? '' : activeFilter;
    setNewProject({ 
      title: '', img: '', ratio: 'aspect-[3/1]', category: currentCategory, engine: 'V10 ULTRA-PRINT' 
    });
    setIsModalOpen(true);
  };

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || isLimitModalOpen || isPricingModalOpen || customAlert.isOpen) ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isModalOpen, isLimitModalOpen, isPricingModalOpen, customAlert.isOpen]);

  const displayProjects = projects?.filter((project) => project.category === activeFilter) || [];

  if (showCheckout) {
    return (
      <V10SecureCheckout 
        isOpen={true}
        onClose={() => setShowCheckout(false)} 
        packageName={activePackage} 
        price={packagePrice}
        selectedProjects={cart} 
        userEmail={userEmail} 
        isUIUX={true}
        onSuccess={() => {
          setCart([]);
          localStorage.removeItem('v10_vault_cart');
          setShowCheckout(false);
          showAlert("Request Logged", "Your transaction status is updated. Open your Client Vault to access unlocked files and EULA.");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#121722] pt-24 pb-12 px-4 sm:px-8 relative selection:bg-amber-400 selection:text-[#121722] font-sans">
      <Helmet>
        <title>V10 Master Vault | Premium B2B UI/UX Assets</title>
        <meta name="description" content="Exclusive B2B repository for 150MP UI/UX designs, Master PSDs, and cinematic commercial pitches." />
        <meta name="theme-color" content="#121722" />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.09)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(255,106,0,0.08)_0%,_transparent_50%)]"></div>
      
      <div className="max-w-[1800px] mx-auto relative z-10">

        {/* ADMIN SEF TRAKA */}
        {isAdmin && exposedProjects.length > 0 && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="text-amber-300 text-xs font-black uppercase tracking-widest">
                  Otkriveno {exposedProjects.length} UI/UX projekata sa javnim Drive/PSD linkovima
                </p>
                <p className="text-slate-300 text-[11px]">
                  Klikni desno da ih jednim potezom preseliš u zaključani sef (v10_project_vault_links).
                </p>
              </div>
            </div>
            <button
              onClick={migrateExposedLinksToVault}
              disabled={isMigratingLinks}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#121722] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shrink-0 flex items-center gap-2"
            >
              {isMigratingLinks ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              Zaključaj UI/UX linkove u Sef
            </button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">V10 <span className="text-amber-400">Vault</span></h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /> Experimental R&D Sector</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            {userEmail && !isAdmin && (
              <Link to="/ui-ux/my-vault" className="px-5 py-2.5 rounded-xl bg-amber-400/10 border border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-[#121722] font-black text-[10px] uppercase tracking-widest transition-all">
                Open Client Vault
              </Link>
            )}
            <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
              {isAdmin ? 'ADMIN ACCESS GRANTED' : (activeFilter === 'all' ? 'SELECT CATEGORY' : `Showing: ${displayProjects.length} Projects`)}
            </span>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-12 items-start">
          
          {userEmail && !isAdmin && activePackage && (
            <div className="w-full xl:w-[320px] flex-shrink-0 sticky top-24 z-20 pointer-events-auto">
              <h2 className="text-amber-400 font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Your Access Tier</h2>
              <div className="flex flex-col gap-4">
                {PRICING_PACKAGES.filter(pkg => pkg.id === activePackage).map(pkg => (
                  <div key={pkg.id} className="p-6 rounded-3xl border transition-all duration-500 relative z-30 border-blue-400/50 bg-gradient-to-b from-[#1a2233] to-[#0d121b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
                    <h3 className="text-white font-black uppercase tracking-widest text-sm mb-1">{pkg.id}</h3>
                    <div className="text-amber-400 font-bold mb-3">{pkg.price} <span className="text-xs text-slate-400">{pkg.type}</span></div>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-6 leading-relaxed">{pkg.desc}</p>
                    <button onClick={handleCancelPackage} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors cursor-pointer relative z-50 pointer-events-auto">Change / Cancel Tier</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 w-full relative">
            <div className="flex flex-wrap gap-2 justify-center w-full max-w-fit mx-auto mb-12 p-2 bg-[#171e2c]/90 backdrop-blur-lg border border-blue-500/30 rounded-full shadow-2xl relative z-20">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveFilter(tab.id)} className={`relative px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-colors duration-300 outline-none z-10 cursor-pointer ${activeFilter === tab.id ? 'text-[#121722]' : 'text-slate-400 hover:text-white'}`}>
                  {activeFilter === tab.id && <motion.div layoutId="v8ActiveFilterPill" className="absolute inset-0 bg-amber-400 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.4)] -z-10" transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                  <span className="relative z-20">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="relative transition-all duration-500">
              {activeFilter === 'all' ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {vaultCategories.map((cat) => (
                    <motion.div 
                      layout
                      key={cat.id}
                      onClick={() => setActiveFilter(cat.id)} 
                      /* VELIKI SPOLJAŠNJI BORDER KARTICE — PLAVI GRADIJENT */
                      className="group relative w-full rounded-3xl cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.55)] hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)] transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-500/80 via-cyan-400/60 to-indigo-600/80 hover:from-blue-400 hover:via-cyan-300 hover:to-blue-600 p-[2px] overflow-hidden"
                    >
                      <div className="relative w-full h-full bg-gradient-to-b from-[#171e2c] to-[#0d121b] rounded-[22px] flex flex-col overflow-hidden">
                        {cat.badge && (
                          <div className="absolute top-6 right-6 z-40 flex items-center gap-1.5 px-3 py-1 bg-[#121722]/90 backdrop-blur-md border border-[#ff6a00]/60 rounded-full shadow-[0_0_20px_rgba(255,106,0,0.35)] pointer-events-none">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6a00] animate-pulse"></span>
                            <span className="text-[#ff6a00] font-black text-[9px] uppercase tracking-[0.2em]">{cat.badge}</span>
                          </div>
                        )}
                        <div className="flex flex-row items-center p-8 gap-10 h-[280px]">
                          {/* UNUTRAŠNJI OKVIR OKO SAME SLIKE — NARANDŽASTO (#ff6a00) */}
                          <div className="h-full w-[50%] bg-[#0d121b] relative flex-shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-inner">
                            <img src={cat.coverImage} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100" draggable="false" />
                            <div className="absolute inset-0 border-[2.5px] border-[#ff6a00]/75 shadow-[inset_0_0_22px_rgba(255,106,0,0.35)] pointer-events-none transition-all duration-500 group-hover:border-[#ff6a00] group-hover:shadow-[inset_0_0_45px_rgba(255,106,0,0.65)] rounded-2xl"></div>
                          </div>
                          <div className="w-[50%] flex flex-col justify-center transform group-hover:translate-x-2 transition-transform duration-500 z-30 pointer-events-auto select-text cursor-text">
                            <span className="text-[#ff6a00] text-[10px] font-black uppercase tracking-[0.4em] mb-3 block drop-shadow-md">{cat.subtitle}</span>
                            <h3 className="text-white text-3xl leading-tight font-black tracking-widest drop-shadow-lg">{cat.title}</h3>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-16 items-start">
                  <AnimatePresence mode="popLayout">
                    {displayProjects.map((project) => (
                      <motion.div 
                        key={project.id} 
                        layout 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                        animate={{ opacity: 1, scale: 1, y: 0 }} 
                        exit={{ opacity: 0, scale: 0.9, y: -20 }} 
                        transition={{ duration: 0.4, ease: "easeOut" }} 
                        /* POJEDINAČNA SLIKA PROJEKTA — NARANDŽASTI OKVIR */
                        className="group relative h-[300px] w-full rounded-2xl overflow-hidden border-2 border-[#ff6a00]/55 hover:border-[#ff6a00] bg-[#171e2c] transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.45)] hover:shadow-[0_15px_45px_rgba(255,106,0,0.25)] flex flex-col"
                      >
                        <Link to={`/ui-ux/project/${project.id}`} className="absolute inset-0 z-10 cursor-pointer"></Link>
                        
                        {project.img ? ( 
                          <img src={project.img} alt={project.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" draggable="false" /> 
                        ) : ( 
                          <div className="absolute inset-0 bg-[#171e2c] flex items-center justify-center"><ImageIcon className="w-10 h-10 text-[#ff6a00]/50" /></div> 
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d121b] via-[#121722]/45 to-transparent z-10 pointer-events-none"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-6 z-20 pointer-events-none flex flex-col items-start">
                          <span className="text-[#ff6a00] text-[9px] font-black uppercase tracking-widest block mb-1 drop-shadow-md pointer-events-auto cursor-text select-text">
                            {project.engine}
                          </span>
                          <h3 className="text-white text-lg lg:text-xl font-black uppercase tracking-widest leading-snug drop-shadow-lg pr-12 pointer-events-auto cursor-text select-text">
                            {project.title}
                          </h3>
                        </div>
                        
                        {isAdmin && (
                          <button onClick={(e) => handleCopyProjectTitle(e, project.title, project.id)} className="absolute top-4 left-4 bg-[#121722]/90 hover:bg-[#ff6a00] text-[#ff6a00] hover:text-[#121722] p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 shadow-lg border border-white/10 cursor-pointer" title="Copy Title">
                            {copiedId === project.id ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        )}

                        {(!isAdmin && !project.id?.toLowerCase().includes('bundle') && !project.title?.toLowerCase().includes('bundle')) && (
                          <button onClick={(e) => handleAddToCart(e, project)} disabled={!isVIPTest && limitReached && Boolean(cart.find(i => i.id === project.id))} className="absolute bottom-5 right-5 z-30 bg-[#121722]/90 backdrop-blur-md hover:bg-[#ff6a00] text-[#ff6a00] hover:text-[#121722] border border-[#ff6a00]/40 hover:border-[#ff6a00] p-3 rounded-2xl transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group/btn cursor-pointer">
                            {cart.find(i => i.id === project.id) ? ( <CheckCircle2 className="w-5 h-5 text-emerald-400" /> ) : ( <Plus className="w-5 h-5" /> )}
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
                        <button type="button" onClick={(e) => { e.preventDefault(); handleOpenModal(); }} className="group relative w-full h-full rounded-2xl overflow-hidden bg-[#171e2c]/60 border-2 border-dashed border-[#ff6a00]/45 hover:border-[#ff6a00] transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:shadow-[0_0_40px_rgba(255,106,0,0.18)] pointer-events-auto z-40">
                          <div className="w-16 h-16 rounded-full bg-[#ff6a00]/10 group-hover:bg-[#ff6a00] flex items-center justify-center transition-colors duration-300 mb-4"><Plus className="w-8 h-8 text-[#ff6a00] group-hover:text-[#121722] transition-colors" /></div>
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

        {/* PLUTAJUĆA KORPA U DNU EKRANA */}
        {!isAdmin && userEmail && activeFilter !== 'all' && (
          <div className="fixed bottom-8 right-8 z-[80] w-80 p-[2px] rounded-3xl bg-gradient-to-br from-blue-500/70 via-cyan-400/50 to-indigo-600/70 shadow-[0_20px_60px_rgba(0,0,0,0.75)] pointer-events-auto">
            <div className="w-full h-full bg-[#171e2c]/95 rounded-[22px] p-6 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
                  <span className="text-white font-black uppercase tracking-widest text-sm">Vault Cart</span>
                </div>
                <span className="text-xs font-black px-3 py-1.5 rounded-full bg-[#121722] text-[#ff6a00] border border-[#ff6a00]/40 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
                  {cart.length} / {isVIPTest ? "∞" : (activePackage ? packageLimit : 0)}
                </span>
              </div>
              
              {cart.length > 0 && (
                <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-[#121722] border border-white/10 hover:border-[#ff6a00]/50 rounded-xl p-3 transition-colors group/item">
                      <span className="text-white text-[10px] font-bold uppercase tracking-widest truncate pr-2">{item.title}</span>
                      <button onClick={() => handleRemoveFromCart(item.id)} className="text-slate-400 hover:text-red-400 transition-colors cursor-pointer pointer-events-auto">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isMonthly && limitReached && !isVIPTest && daysLeft > 0 && (
                <div className="mb-5 flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-400/10 p-3 rounded-xl border border-amber-400/30">
                  <Clock className="w-4 h-4" /><span>Reset in {daysLeft} days</span>
                </div>
              )}
              
              {canCheckout ? (
                <div className="flex flex-col gap-4">
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
                    {isVIPTest && !limitReached ? (
                      <span className="text-emerald-400 block mb-2">VIP Access: Unlimited Cart</span>
                    ) : (
                      <span className="block mb-2">Tier limit reached.</span>
                    )}
                    Proceed to checkout to unlock master files.
                  </div>
                  <button onClick={() => setShowCheckout(true)} className="w-full bg-gradient-to-r from-[#ff6a00] to-amber-500 text-[#121722] font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,106,0,0.35)] cursor-pointer pointer-events-auto">
                    <Lock className="w-4 h-4" /> Security Checkout
                  </button>
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic border-t border-white/10 pt-5 mt-2 text-center">
                  {cart.length === 0 ? "Select items to begin." : "Add more items to fulfill tier."}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PRICING MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isPricingModalOpen && (
            <motion.div key="pricing-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] bg-[#121722] overflow-y-auto">
              <button 
                onClick={() => { 
                  setIsPricingModalOpen(false); 
                  setPendingProject(null); 
                  sessionStorage.removeItem('v10_pending_project'); 
                }} 
                className="absolute top-8 left-4 md:left-8 z-[100000] flex w-max items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors bg-[#171e2c] p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-amber-400/50 shadow-lg cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-full bg-[#121722] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
              </button>
              
              <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
                <V10PricingDetails 
                  onPackageLoaded={(pkg) => { if (pkg) setIsPricingModalOpen(false); }}
                  onPackageSelect={(pkgName, price) => {
                    setPackagePrice(price || 0);
                    setupPackageLimits(pkgName, new Date());
                    setIsPricingModalOpen(false);
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* LIMIT MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isLimitModalOpen && (
            <motion.div key="limit-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-md pointer-events-auto">
              <motion.div initial={{ scale: 0.8, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-2xl p-12 md:p-16 rounded-[2.5rem] flex flex-col items-center text-center bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-blue-500/40 shadow-2xl overflow-hidden">
                <button onClick={() => setIsLimitModalOpen(false)} className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
                <div className="relative w-32 h-32 mb-10 mt-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[#ff6a00] rounded-full blur-[40px] opacity-30 animate-pulse"></div>
                  <div className="relative z-10 w-24 h-24 bg-[#121722] rounded-[2rem] border border-[#ff6a00]/50 flex items-center justify-center shadow-2xl">
                    <Lock className="w-12 h-12 text-[#ff6a00]" />
                  </div>
                </div>
                <h2 className="text-4xl font-black uppercase tracking-[0.2em] mb-6 text-white z-10">Vault Capacity Full</h2>
                <p className="text-slate-300 text-sm font-bold leading-relaxed uppercase tracking-widest max-w-md mb-12 z-10">All <span className="text-[#ff6a00] font-black">{packageLimit}</span> master assets for your <span className="text-emerald-400 font-black">{activePackage}</span> tier are selected.</p>
                <button onClick={() => { setIsLimitModalOpen(false); setShowCheckout(true); }} className="relative w-full max-w-md px-8 py-6 rounded-2xl bg-gradient-to-r from-[#ff6a00] to-amber-500 text-[#121722] font-black uppercase tracking-[0.15em] text-base flex items-center justify-center gap-3 cursor-pointer z-10 shadow-xl">
                  <ShieldCheck className="w-6 h-6" /> <span>Proceed to Checkout</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* CUSTOM ALERT MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {customAlert.isOpen && (
            <motion.div key="custom-alert-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[100000000] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-md pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 15 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 15 }} className="relative w-full max-w-md pointer-events-auto z-50">
                <div className="relative bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-blue-500/35 rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center overflow-hidden">
                  <div className={`w-20 h-20 rounded-full mb-8 flex items-center justify-center border relative z-10 ${customAlert.isDestructive ? 'bg-[#121722] border-red-500/40 text-red-500' : 'bg-[#121722] border-[#ff6a00]/40 text-[#ff6a00]'}`}>
                    {customAlert.isDestructive ? <AlertTriangle className="w-10 h-10" /> : <ShieldCheck className="w-10 h-10" />}
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-[0.2em] mb-4 relative z-10">{customAlert.title}</h2>
                  <p className="text-slate-300 text-sm font-medium leading-relaxed mb-10 max-w-sm relative z-10">{customAlert.message}</p>
                  <div className="flex w-full gap-4 relative z-10">
                    {customAlert.onConfirm ? (
                      <>
                        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeAlert(); }} className="flex-1 py-4 rounded-xl border border-white/15 bg-[#121722] text-white font-black uppercase tracking-widest text-[10px] cursor-pointer">Cancel</button>
                        <button onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await customAlert.onConfirm(); }} className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] cursor-pointer ${customAlert.isDestructive ? 'bg-red-600 text-white' : 'bg-[#ff6a00] text-[#121722]'}`}>Confirm</button>
                      </>
                    ) : (
                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); closeAlert(); }} className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] text-[#121722] bg-[#ff6a00] cursor-pointer">Acknowledge</button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ADMIN INIT PROJECT MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && isAdmin && (
            <motion.div key="init-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-md pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-blue-500/40 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar z-50">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8">Init New Project</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[#ff6a00] text-[10px] font-black uppercase tracking-widest mb-2">Project Title</label>
                    <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#ff6a00]" placeholder="Enter project title..." />
                  </div>
                  <div>
                    <label className="block text-[#ff6a00] text-[10px] font-black uppercase tracking-widest mb-2">Image Format (Ratio)</label>
                    <div className="relative">
                      <select value={newProject.ratio} onChange={(e) => setNewProject({ ...newProject, ratio: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white appearance-none cursor-pointer">
                        <option value="aspect-[3/1]">3:1 (Panoramic / Storytelling)</option>
                        <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
                        <option value="aspect-video">16:9 (Cinematic / Landscape)</option>
                        <option value="aspect-[3/2]">3:2 (Classic Photo)</option>
                        <option value="aspect-square">1:1 (Square Product)</option>
                        <option value="aspect-[4/5]">4:5 (Portrait / IG)</option>
                        <option value="aspect-[2/3]">2:3 (Classic Photo Portrait)</option>
                        <option value="aspect-[9/16]">9:16 (Vertical / Reels)</option>
                        <option value="aspect-auto">Auto (Keep Original)</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2">Category (ID)</label>
                      <input type="text" value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} className="w-full bg-[#121722] border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-xs font-black uppercase tracking-widest" />
                    </div>
                    <div>
                      <label className="block text-slate-400 text-[9px] font-black uppercase tracking-widest mb-2">Engine</label>
                      <input type="text" value={newProject.engine} onChange={(e) => setNewProject({...newProject, engine: e.target.value})} className="w-full bg-[#121722] border border-white/10 rounded-xl px-4 py-3 text-slate-300 text-xs font-black uppercase tracking-widest" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#ff6a00] text-[10px] font-black uppercase tracking-widest mb-2">Cover Image</label>
                    <div className="relative group cursor-pointer h-40">
                      <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-40 rounded-2xl flex flex-col items-center justify-center transition-all ${newProject.img ? 'bg-gradient-to-br from-[#ff6a00] to-amber-500 p-[3px]' : 'border-2 border-dashed border-[#ff6a00]/45 bg-[#121722]'}`}>
                        {isUploadingThumbnail ? (
                          <Loader2 className="w-8 h-8 text-[#ff6a00] animate-spin" />
                        ) : newProject.img ? (
                          <div className="w-full h-full bg-[#121722] rounded-xl p-[4px]"><img src={newProject.img} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>
                        ) : (
                          <><UploadCloud className="w-8 h-8 text-slate-400 mb-3" /><span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Click to upload cover</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCreateProject} disabled={isSaving || isUploadingThumbnail} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-[#ff6a00] to-amber-500 text-[#121722] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>SAVE PROJECT</span></>}
                  </button>
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

export default VaultGrid;