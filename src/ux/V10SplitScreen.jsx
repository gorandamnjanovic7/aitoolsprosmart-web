// FAJL: src/ux/V10SplitScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, Layers, Plus, Save, X, Trash2, UploadCloud, Loader2, ChevronDown, Copy, CheckCircle2, Lock, Maximize, ShoppingCart, Link as LinkIcon, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet'; 
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, deleteField } from 'firebase/firestore';

import V10SecureCheckout from './V10SecureCheckout';
import V10PricingDetails from './V10PricingDetails'; 
import V10Story from './V10Story'; 

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

const ADMIN_EMAILS = [
  "damnjanovicgoran7@gmail.com",
  "aitoolsprosmart@gmail.com",
  "info@aitoolsprosmart.com"
];

const V10SplitScreen = () => {
  const { projectId } = useParams();
  const location = useLocation();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserPackage, setSelectedUserPackage] = useState(null);
  const [userCheckoutData, setUserCheckoutData] = useState(null);
  
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false); 

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false); 
  const [isLimitModalOpen, setIsLimitModalOpen] = useState(false); 

  const [projectData, setProjectData] = useState({
    title: "", description: "", phases: [], finalVideo: "", price: 1500, category: "all", img: "", engine: "PREMIUM COLLECTION"
  });

  const [vaultLinks, setVaultLinks] = useState({ driveLink: "", psdLink: "" });
  
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ 
    title: projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), 
    engine: 'PREMIUM COLLECTION', 
    img: '', 
    ratio: 'aspect-[3/1]', 
    category: location.state?.category || 'perfumes' 
  });
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);

  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [newPhase, setNewPhase] = useState({ title: '', subtitle: '', imageUrl: '', psdLink: '', ratio: 'aspect-[3/1]' });
  const [isUploadingPhaseImg, setIsUploadingPhaseImg] = useState(false);
  const [isUploadingPhasePsd, setIsUploadingPhasePsd] = useState(false);
  const [isSavingPhase, setIsSavingPhase] = useState(false);

  const [isEditLinksModalOpen, setIsEditLinksModalOpen] = useState(false);
  const [editLinks, setEditLinks] = useState({ driveLink: '', psdLink: '' });
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isUploadingPsd, setIsUploadingPsd] = useState(false);

  const [isTitleCopied, setIsTitleCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedCart = localStorage.getItem('v10_vault_cart');
        if (savedCart) return JSON.parse(savedCart);
      } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('v10_vault_cart', JSON.stringify(cart));
    }
  }, [cart]);

  const [packageLimit, setPackageLimit] = useState(0);
  const [isMonthly, setIsMonthly] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  const setupPackageLimits = (pkgName, timestamp) => {
    setSelectedUserPackage(pkgName); 
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

  const fetchProject = useCallback(async (adminStatus = false) => {
    try {
      const docRef = doc(db, "v10_projects", projectId); 
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProjectData({
          title: data.title || "Untitled Project",
          description: data.description || "No description provided.",
          phases: data.phases || [],
          finalVideo: data.finalVideo || "",
          price: data.price || 1500,
          category: data.category || "all",
          img: data.img || "",
          engine: data.engine || "PREMIUM COLLECTION"
        });

        if (adminStatus) {
          try {
            const vaultSnap = await getDoc(doc(db, "v10_project_vault_links", projectId));
            const vData = vaultSnap.exists() ? vaultSnap.data() : {};
            const dLink = vData.driveLink || data.driveLink || data.zipLink || "";
            const pLink = vData.psdLink || data.psdLink || "";
            setVaultLinks({ driveLink: dLink, psdLink: pLink });
            setEditLinks({ driveLink: dLink, psdLink: pLink });
          } catch (vErr) {
            const dLink = data.driveLink || data.zipLink || "";
            const pLink = data.psdLink || "";
            setVaultLinks({ driveLink: dLink, psdLink: pLink });
            setEditLinks({ driveLink: dLink, psdLink: pLink });
          }
        }
      } else {
        setProjectData(prev => ({...prev, title: "Project Not Found", description: "This project does not exist in the database."}));
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsProjectLoading(false);
    }
  }, [projectId]);

  const [pendingProject, setPendingProject] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProject = sessionStorage.getItem('v10_pending_project_split');
      if (savedProject) return JSON.parse(savedProject);
    }
    return null;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    let unsubDoc = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email.toLowerCase();
        if (ADMIN_EMAILS.includes(email)) {
          setIsAdmin(true);
          setupPackageLimits("ADMIN", null);
          setIsAuthLoading(false);
          setIsAuthLoaded(true); 
          fetchProject(true);
        } else {
          setIsAdmin(false);
          fetchProject(false);
          unsubDoc = onSnapshot(doc(db, "checkout_requests", email), (pkgSnap) => {
            if (pkgSnap.exists()) {
              const data = pkgSnap.data();
              setUserCheckoutData(data); 
              setupPackageLimits(data.selectedPackage, data.timestamp);
            } else {
              setSelectedUserPackage(null);
              setUserCheckoutData(null);
            }
            setIsAuthLoading(false);
            setIsAuthLoaded(true); 
          });
        }
      } else {
        setIsAdmin(false);
        setSelectedUserPackage(null);
        setIsAuthLoading(false);
        setIsAuthLoaded(true); 
        fetchProject(false);
      }
    });
    
    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (isAddPhaseModalOpen || isEditLinksModalOpen || fullscreenImage || isPricingModalOpen || isLimitModalOpen || isInitModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isAddPhaseModalOpen, isEditLinksModalOpen, fullscreenImage, isPricingModalOpen, isLimitModalOpen, isInitModalOpen]);

  const safeTitle = projectData?.title || "Project Not Found";
  const isVIPTest = currentUser?.email?.toLowerCase() === 'historical.stories7972@gmail.com';
  const limitReached = packageLimit > 0 && cart.length >= packageLimit;
  const canCheckout = limitReached || (isVIPTest && cart.length > 0);
  
  const isAlreadySelected = cart.some(p => p.id === projectId);
  const isUninitialized = safeTitle === "Project Not Found";

  const currentProjectObj = {
    id: projectId,
    title: safeTitle,
    engine: projectData.engine || "PREMIUM COLLECTION",
    img: projectData.phases?.[0]?.imageUrl || projectData.img || "",
    category: projectData.category || "all"
  };

  const performAddToCart = (projectToAdd) => {
    if (!isVIPTest && limitReached) {
      setIsLimitModalOpen(true);
      return;
    }
    if (!cart.find(item => item.id === projectToAdd.id)) {
      const newCart = [...cart, projectToAdd];
      setCart(newCart);
      if (!isVIPTest && packageLimit > 0 && newCart.length === packageLimit) {
        setTimeout(() => { setIsLimitModalOpen(true); }, 300);
      }
    }
  };

  const handleAddToCartClick = async (e) => {
    e?.preventDefault(); 
    e?.stopPropagation();

    if (!currentUser) {
      sessionStorage.setItem('v10_pending_project_split', JSON.stringify(currentProjectObj));
      setPendingProject(currentProjectObj);
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Login failed", error);
        sessionStorage.removeItem('v10_pending_project_split');
        setPendingProject(null);
      }
      return;
    }

    if (!isAdmin && !selectedUserPackage) {
      sessionStorage.setItem('v10_pending_project_split', JSON.stringify(currentProjectObj));
      setPendingProject(currentProjectObj);
      setIsPricingModalOpen(true);
      return;
    }

    performAddToCart(currentProjectObj);
  };

  useEffect(() => {
    if (isAuthLoaded && currentUser && !isAdmin) {
      if (selectedUserPackage && pendingProject) {
        performAddToCart(pendingProject);
        setPendingProject(null);
        sessionStorage.removeItem('v10_pending_project_split');
        setIsPricingModalOpen(false);
      }
    }
  }, [isAuthLoaded, currentUser, selectedUserPackage, pendingProject, isAdmin]);

  const handleRemoveFromCart = (idToRemove) => {
    setCart(cart.filter(item => item.id !== idToRemove));
  };

  const handlePhaseImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingPhaseImg(true);
    const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewPhase({ ...newPhase, imageUrl: data.secure_url });
      else alert("Upload Error: " + data.error?.message);
    } catch (error) {} finally { setIsUploadingPhaseImg(false); }
  };

  const handlePhasePsdUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingPhasePsd(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewPhase({ ...newPhase, psdLink: data.secure_url });
      else alert("Upload Error: " + (data.error?.message || "Upload failed"));
    } catch (error) {
      alert("Upload Error: " + error.message);
    } finally {
      setIsUploadingPhasePsd(false);
      e.target.value = null;
    }
  };

  const handleSavePhase = async () => {
    if (!newPhase.title || !newPhase.imageUrl) return alert("Title and image are required!");
    setIsSavingPhase(true);
    try {
      const cleanPhase = {
        title: newPhase.title,
        subtitle: newPhase.subtitle,
        imageUrl: newPhase.imageUrl,
        ratio: newPhase.ratio
      };
      const updatedPhases = [...(projectData.phases || []), cleanPhase];
      await setDoc(doc(db, "v10_projects", projectId), { phases: updatedPhases }, { merge: true });

      if (newPhase.psdLink) {
        const vaultRef = doc(db, "v10_project_vault_links", projectId);
        const existingSnap = await getDoc(vaultRef);
        const existingPhasePsds = existingSnap.exists() ? (existingSnap.data().phasePsds || []) : [];
        await setDoc(vaultRef, {
          projectId,
          title: projectData.title,
          phasePsds: [...existingPhasePsds, { title: newPhase.title, psdLink: newPhase.psdLink }],
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
      setIsAddPhaseModalOpen(false);
      setNewPhase({ title: '', subtitle: '', imageUrl: '', psdLink: '', ratio: 'aspect-[3/1]' });
    } catch (error) {
      console.error("Error saving phase:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSavingPhase(false);
    }
  };

  const handleDeletePhase = async (indexToDelete) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      const updatedPhases = projectData.phases.filter((_, idx) => idx !== indexToDelete);
      await setDoc(doc(db, "v10_projects", projectId), { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
    } catch (error) {
      console.error("Error deleting phase:", error);
      alert("Error: " + error.message);
    }
  };

  const handlePsdUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingPsd(true);
    const formData = new FormData(); 
    formData.append('file', file); 
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setEditLinks({ ...editLinks, psdLink: data.secure_url });
      else alert("Upload Error: " + (data.error?.message || "Upload failed"));
    } catch (error) {
      alert("Upload Error: " + error.message);
    } finally { 
      setIsUploadingPsd(false); 
      e.target.value = null; 
    }
  };

  const handleSaveLinks = async () => {
    setIsSavingLinks(true);
    try {
      await setDoc(doc(db, "v10_project_vault_links", projectId), {
        projectId,
        title: projectData.title,
        driveLink: editLinks.driveLink.trim(),
        psdLink: editLinks.psdLink.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      await setDoc(doc(db, "v10_projects", projectId), {
        driveLink: deleteField(),
        psdLink: deleteField(),
        zipLink: deleteField()
      }, { merge: true });

      setVaultLinks({ driveLink: editLinks.driveLink.trim(), psdLink: editLinks.psdLink.trim() });
      setIsEditLinksModalOpen(false);
    } catch (error) {
      console.error("Error saving links:", error);
      alert("Error: " + error.message);
    } finally {
      setIsSavingLinks(false);
    }
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setIsUploadingThumbnail(true);
    const formData = new FormData(); formData.append('file', file); formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) setNewProject({ ...newProject, img: data.secure_url });
      else alert("Upload Error: " + data.error?.message);
    } catch (error) {} finally { setIsUploadingThumbnail(false); }
  };

  const handleCreateProject = async () => {
    if (!newProject.title) return alert("Project title is required!");
    setIsSavingProject(true);
    try {
      await setDoc(doc(db, "v10_projects", projectId), {
        title: newProject.title,
        engine: newProject.engine,
        img: newProject.img,
        ratio: newProject.ratio,
        category: newProject.category,
        createdAt: serverTimestamp(),
        description: "Premium V10 Master Asset.", 
        phases: [] 
      });
      setIsInitModalOpen(false);
      fetchProject(isAdmin); 
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving: " + error.message);
    } finally {
      setIsSavingProject(false);
    }
  };

  if (isAuthLoading || isProjectLoading) {
    return (
      <div className="min-h-screen bg-[#121722] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin" />
        <span className="text-amber-400 font-black uppercase tracking-widest text-xs">Authenticating Vault Access...</span>
      </div>
    );
  }

  const titleFirstWord = safeTitle.split(' ')[0] || "";
  const titleRest = safeTitle.indexOf(' ') !== -1 ? safeTitle.substring(safeTitle.indexOf(' ') + 1) : "";

  return (
    <div className="bg-[#121722] min-h-screen text-white relative selection:bg-amber-400 selection:text-[#121722] font-sans">
      <Helmet>
        <title>{safeTitle} | V10 Premium Asset</title>
        <meta name="description" content={projectData?.description || "Explore this premium 150MP UI/UX commercial asset within the V10 Vault."} />
        <meta name="theme-color" content="#121722" />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.09)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.09)_0%,_transparent_50%)]"></div>

      {/* DUGME ZA POVRATAK */}
      <div className="fixed top-24 left-4 md:left-8 z-[90] flex flex-col gap-4 pointer-events-none">
        <Link to="/ui-ux/vault" state={{ category: projectData.category }} className="flex w-max items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors bg-[#171e2c]/90 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-amber-400/50 shadow-lg cursor-pointer pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-[#121722] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
        </Link>
      </div>

      {isUninitialized ? (
        <div className="pt-40 pb-32 px-4 flex flex-col items-center justify-center relative z-10 min-h-[70vh] pointer-events-none">
          {isAdmin ? (
            <button onClick={() => setIsInitModalOpen(true)} className="pointer-events-auto group relative w-full max-w-lg h-[300px] rounded-[2rem] overflow-hidden bg-[#171e2c]/70 border-2 border-dashed border-amber-400/35 hover:border-amber-400 transition-all duration-500 flex flex-col items-center justify-center cursor-pointer shadow-2xl hover:shadow-[0_0_60px_rgba(245,158,11,0.15)]">
              <div className="w-20 h-20 rounded-full bg-amber-400/10 group-hover:bg-amber-400 flex items-center justify-center transition-colors duration-500 mb-6">
                <Plus className="w-10 h-10 text-amber-400 group-hover:text-[#121722] transition-colors" />
              </div>
              <span className="text-amber-400 font-black uppercase tracking-widest text-lg group-hover:scale-105 transition-transform">Initialize Project</span>
            </button>
          ) : (
            <div className="text-center pointer-events-auto">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-4">Project Not Found</h1>
              <p className="text-slate-400 uppercase tracking-widest">This project does not exist in the database.</p>
            </div>
          )}
        </div>
      ) : projectData?.category === 'storytelling' ? (
        <>
          <V10Story 
            projectData={projectData} 
            handleAddToCartClick={handleAddToCartClick} 
            isAlreadySelected={isAlreadySelected} 
            isAdmin={isAdmin} 
            handleDeletePhase={handleDeletePhase}
          />
          {isAdmin && (
            <div className="relative z-50 max-w-7xl mx-auto px-4 pb-20 flex flex-col items-center">
              <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
                {vaultLinks.driveLink && (
                  <a href={vaultLinks.driveLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all shadow-lg">
                    <ShieldCheck className="w-4 h-4" /> Vault Drive Link Active
                  </a>
                )}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl border border-white/10 bg-[#171e2c]/90 shadow-xl pointer-events-auto">
                <button 
                  onClick={() => setIsAddPhaseModalOpen(true)} 
                  className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-[#121722] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  title="Add new phase image"
                >
                  <Plus className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setIsEditLinksModalOpen(true)} 
                  className="px-6 py-3 bg-[#121722] border border-white/15 hover:border-amber-400 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <LinkIcon className="w-4 h-4" /> Edit Vault Links
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <section className="pt-40 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/30 rounded-full mb-8 pointer-events-auto">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-300">V10 Ultra-Print Engine</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 pointer-events-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider leading-none">
                {titleFirstWord} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  {titleRest}
                </span>
              </h1>
              {isAdmin && safeTitle !== "Project Not Found" && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(safeTitle); setIsTitleCopied(true); setTimeout(() => setIsTitleCopied(false), 2000); }} 
                  className="bg-[#171e2c] hover:bg-amber-400/20 p-4 rounded-full transition-all border border-white/10 hover:border-amber-400 cursor-pointer shadow-xl mt-4 md:mt-0 pointer-events-auto" 
                  title="Copy Title"
                >
                  {isTitleCopied ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <Copy className="w-8 h-8 text-amber-400" />}
                </button>
              )}
            </motion.div>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed font-medium pointer-events-auto mb-8">
              {projectData?.description || ""}
            </motion.p>

            {/* DUGME ZA KUPCA */}
            {!isAdmin && (
              <button
                type="button"
                onClick={handleAddToCartClick}
                className={`pointer-events-auto px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 shadow-2xl cursor-pointer ${
                  isAlreadySelected
                    ? 'bg-emerald-500 text-[#121722] hover:bg-emerald-400'
                    : 'bg-amber-400 text-[#121722] hover:bg-amber-300 shadow-[0_0_30px_rgba(245,158,11,0.35)]'
                }`}
              >
                {isAlreadySelected ? (
                  <><CheckCircle2 className="w-5 h-5" /> Selected in Vault Cart</>
                ) : (
                  <><Plus className="w-5 h-5" /> Add Project to Vault Cart</>
                )}
              </button>
            )}

            {isAdmin && (
              <>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
                  {vaultLinks.driveLink && (
                    <a href={vaultLinks.driveLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-500/10 text-blue-400 border border-blue-400/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 hover:text-white transition-all">
                      <ShieldCheck className="w-4 h-4" /> Vault Google Drive Asset
                    </a>
                  )}
                  {vaultLinks.psdLink && (
                    <a href={vaultLinks.psdLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-400 hover:text-[#121722] transition-all">
                      <Layers className="w-4 h-4" /> Vault Global Master PSD
                    </a>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl border border-white/10 bg-[#171e2c]/90 shadow-xl pointer-events-auto">
                  <button 
                    onClick={() => setIsAddPhaseModalOpen(true)} 
                    className="w-12 h-12 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-[#121722] transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    title="Add new phase image"
                  >
                    <Plus className="w-6 h-6" />
                  </button>

                  <button 
                    onClick={() => setIsEditLinksModalOpen(true)} 
                    className="px-6 py-3 bg-[#121722] border border-white/15 hover:border-amber-400 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:text-amber-400 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" /> Edit Private Vault Links
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-16 md:gap-24 pb-32 relative z-10">
            {(projectData?.phases || []).map((phase, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="flex flex-col gap-6 group">
                <div className="flex justify-between items-start md:items-center">
                  <div className="flex items-center gap-4 border-l-2 border-amber-400 pl-4">
                    <Layers className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">{phase.title}</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{phase.subtitle}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeletePhase(index)} className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 md:p-3 rounded-xl transition-all border border-red-500/30 opacity-0 group-hover:opacity-100 mt-2 md:mt-0 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] pointer-events-auto">
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
                
                <div className={`w-full ${phase.ratio || 'aspect-[21/9]'} bg-[#0d121b] rounded-2xl md:rounded-[2rem] border border-white/10 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative group/image`}>
                  {phase.imageUrl && (
                    <>
                      <img 
                        src={phase.imageUrl} alt={phase.title} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}
                        className="w-full h-full object-cover select-none pointer-events-auto transition-opacity duration-300 opacity-95 group-hover/image:opacity-100" 
                      />
                      <button type="button" onClick={(e) => { e.stopPropagation(); setFullscreenImage(phase.imageUrl); }} className="absolute bottom-4 right-4 bg-[#121722]/90 hover:bg-amber-400 text-white hover:text-[#121722] p-3.5 rounded-xl backdrop-blur-sm border border-white/15 hover:border-amber-400 transition-all z-40 shadow-xl opacity-0 group-hover/image:opacity-100 cursor-pointer pointer-events-auto" title="Fullscreen Preview">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </section>
        </>
      )}

      {/* FULLSCREEN MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 z-[100000000] flex items-center justify-center bg-[#0d121b]/95 backdrop-blur-2xl p-4 md:p-8 cursor-zoom-out pointer-events-auto"
              onClick={() => setFullscreenImage(null)}
            >
              <button 
                type="button"
                onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-amber-400 text-white hover:text-[#121722] rounded-full transition-all border border-white/20 hover:border-amber-400 cursor-pointer shadow-2xl z-50"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                exit={{ scale: 0.9, opacity: 0 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }} 
                src={fullscreenImage} 
                alt="Fullscreen Preview" 
                className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)] select-none" 
                onContextMenu={(e) => e.preventDefault()}
                draggable="false" 
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* PLUTAJUĆA KORPA U DNU EKRANA */}
      {!isAdmin && currentUser && (
        <div className="fixed bottom-8 right-8 z-[80] w-80 bg-[#171e2c]/95 border border-amber-400/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.75)] backdrop-blur-xl pointer-events-auto">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-amber-400" />
              <span className="text-white font-black uppercase tracking-widest text-sm">Vault Cart</span>
            </div>
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-[#121722] text-amber-400 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              {cart.length} / {isVIPTest ? "∞" : (selectedUserPackage ? packageLimit : 0)}
            </span>
          </div>
          
          {cart.length > 0 && (
            <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-[#121722] border border-white/10 hover:border-amber-400/50 rounded-xl p-3 transition-colors group/item">
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
              <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-[#121722] font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.35)] cursor-pointer pointer-events-auto">
                <Lock className="w-4 h-4" /> Security Checkout
              </button>
            </div>
          ) : (
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic border-t border-white/10 pt-5 mt-2 text-center">
              {cart.length === 0 ? "Select items to begin." : "Add more items to fulfill tier."}
            </div>
          )}
        </div>
      )}

      <V10SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        packageName={selectedUserPackage} 
        productName={selectedUserPackage} 
        price={userCheckoutData?.price || 0} 
        zipLink="" 
        projectImage={projectData.phases?.[0]?.imageUrl || "/v8-secure-blue.webp"} 
        selectedProjects={cart} 
        userEmail={currentUser?.email}
        isUIUX={true}
        onSuccess={() => {
          setCart([]);
          localStorage.removeItem('v10_vault_cart');
          setIsCheckoutOpen(false);
        }}
      />

      {/* ADMIN MODAL: DODAVANJE NOVE FAZE */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAddPhaseModalOpen && isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-white/15 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setIsAddPhaseModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white shadow-lg hover:scale-105 cursor-pointer transition-transform">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8"><span className="text-amber-400">Add</span> Asset Image</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Image Title</label>
                    <input type="text" value={newPhase.title} onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400 transition-colors" placeholder="e.g. THE ALCHEMY PROTOCOL" />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Subtitle</label>
                    <input type="text" value={newPhase.subtitle} onChange={(e) => setNewPhase({ ...newPhase, subtitle: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400 transition-colors" placeholder="e.g. PRIME BEEF SPECIAL DISPLAY" />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Format (Ratio)</label>
                    <div className="relative">
                      <select value={newPhase.ratio} onChange={(e) => setNewPhase({ ...newPhase, ratio: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none cursor-pointer">
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
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Image (Upload)</label>
                    <div className="relative group cursor-pointer h-32">
                      <input type="file" accept="image/*" onChange={handlePhaseImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${newPhase.imageUrl ? 'bg-gradient-to-br from-amber-400 to-orange-500 p-[3px]' : 'border-2 border-dashed border-white/20 bg-[#121722] group-hover:border-amber-400'}`}>
                        {isUploadingPhaseImg ? (
                          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        ) : newPhase.imageUrl ? (
                          <div className="w-full h-full bg-[#121722] rounded-xl p-[4px]"><img src={newPhase.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>
                        ) : (
                          <><UploadCloud className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-2" /><span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Click to upload image</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Phase PSD File (Saved in Private Vault)</label>
                    <div className="relative group cursor-pointer h-20">
                      <input type="file" accept=".psd, image/vnd.adobe.photoshop" onChange={handlePhasePsdUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${newPhase.psdLink ? 'bg-gradient-to-br from-amber-400 to-orange-500 p-[2px]' : 'border-2 border-dashed border-white/20 bg-[#121722] group-hover:border-amber-400'}`}>
                        {isUploadingPhasePsd ? (
                          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                        ) : newPhase.psdLink ? (
                          <div className="flex items-center gap-2 bg-[#121722] w-full h-full rounded-xl justify-center text-xs font-bold text-amber-400">
                            <CheckCircle2 className="w-4 h-4"/> PSD LINKED TO VAULT
                          </div>
                        ) : (
                          <>
                            <Layers className="w-5 h-5 text-slate-400 group-hover:text-amber-400 mb-1" />
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Click to upload .PSD</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSavePhase} disabled={isSavingPhase || isUploadingPhaseImg || isUploadingPhasePsd} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#121722] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                    {isSavingPhase ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Save Asset Data</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ADMIN MODAL: PRIVATNI VAULT LINKOVI */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isEditLinksModalOpen && isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-white/15 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl">
                <button onClick={() => setIsEditLinksModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-2"><span className="text-amber-400">Private</span> Vault Links</h2>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Stored strictly inside encrypted v10_project_vault_links</p>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><UploadCloud className="w-3 h-3"/> Google Drive ZIP Link (Saved in Private Vault)</label>
                    <input type="text" value={editLinks.driveLink} onChange={(e) => setEditLinks({ ...editLinks, driveLink: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400 transition-colors" placeholder="https://drive.google.com/..." />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Layers className="w-3 h-3"/> Global Master PSD File</label>
                    <div className="relative group cursor-pointer h-20">
                      <input type="file" accept=".psd, image/vnd.adobe.photoshop" onChange={handlePsdUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${editLinks.psdLink ? 'bg-gradient-to-br from-amber-400 to-orange-500 p-[2px]' : 'border-2 border-dashed border-white/20 bg-[#121722] group-hover:border-amber-400'}`}>
                        {isUploadingPsd ? (
                          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                        ) : editLinks.psdLink ? (
                          <div className="flex items-center gap-2 bg-[#121722] w-full h-full rounded-xl justify-center text-xs font-bold text-amber-400">
                            <CheckCircle2 className="w-4 h-4"/> PSD LINKED IN VAULT
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-slate-400 group-hover:text-amber-400 mb-1" />
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Click to upload .PSD</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSaveLinks} disabled={isSavingLinks || isUploadingPsd} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#121722] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                    {isSavingLinks ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Lock Links in Vault</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ADMIN MODAL: INICIJALIZACIJA PROJEKTA */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isInitModalOpen && isAdmin && (
            <motion.div key="modal-init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-[#0d121b]/80 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#1a2233] via-[#171e2c] to-[#0d121b] border border-white/15 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl max-h-[95vh] overflow-y-auto custom-scrollbar">
                <button onClick={() => setIsInitModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8">Init New Project</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Project Title</label>
                    <input type="text" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full bg-[#121722] border border-white/15 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-400" placeholder="Enter project title..." />
                  </div>
                  <div>
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Image Format (Ratio)</label>
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
                    <label className="block text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">Cover Image</label>
                    <div className="relative group cursor-pointer w-full h-40">
                      <div className={`relative w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all overflow-hidden ${newProject.img ? 'bg-gradient-to-br from-amber-400 to-orange-500 p-[3px]' : 'border-2 border-dashed border-white/20 bg-[#121722]'}`}>
                        <input type="file" accept="image/*" onChange={handleThumbnailUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-[100]" />
                        {isUploadingThumbnail ? (
                          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                        ) : newProject.img ? (
                          <div className="w-full h-full bg-[#121722] rounded-xl overflow-hidden p-[2px]"><img src={newProject.img} alt="Preview" className="w-full h-full object-cover rounded-lg" /></div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pointer-events-none"><UploadCloud className="w-8 h-8 text-slate-400 mb-3" /><span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Click to upload cover</span></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleCreateProject} disabled={isSavingProject || isUploadingThumbnail} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-[#121722] font-black uppercase tracking-widest mt-8 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50">
                    {isSavingProject ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>SAVE PROJECT</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* PRICING MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isPricingModalOpen && (
            <motion.div key="pricing-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] bg-[#121722] overflow-y-auto pointer-events-auto">
              <button 
                onClick={() => { 
                  setIsPricingModalOpen(false); 
                  setPendingProject(null); 
                  sessionStorage.removeItem('v10_pending_project_split'); 
                }} 
                className="absolute top-8 left-4 md:left-8 z-[100000] flex w-max items-center gap-2 text-slate-300 hover:text-amber-400 transition-colors bg-[#171e2c] p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-amber-400/50 shadow-lg cursor-pointer group pointer-events-auto"
              >
                <div className="w-8 h-8 rounded-full bg-[#121722] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Project</span>
              </button>
              <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
                <V10PricingDetails 
                  onPackageLoaded={(pkg) => { if (pkg) setIsPricingModalOpen(false); }}
                  onPackageSelect={(pkgName) => { setupPackageLimits(pkgName, new Date()); setIsPricingModalOpen(false); }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default V10SplitScreen;