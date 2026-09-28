// FAJL: src/ux/V10SplitScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, Layers, Plus, Save, X, Image as ImageIcon, Trash2, UploadCloud, Loader2, ChevronDown, Copy, CheckCircle2, Lock, Maximize, ShoppingCart, Link as LinkIcon, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet'; 
import { auth, db } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

import V10SecureCheckout from './V10SecureCheckout';
import V10PricingDetails from './V10PricingDetails'; 

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

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
    title: "", description: "", phases: [], finalVideo: "", price: 1500, zipLink: "", driveLink: "", psdLink: "", category: "all", img: ""
  });
  
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ 
    title: projectId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '), 
    engine: 'PREMIUM COLLECTION', 
    img: '', 
    ratio: 'aspect-video', 
    category: location.state?.category || 'perfumes' 
  });
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);

  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [newPhase, setNewPhase] = useState({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' });
  const [isUploadingPhaseImg, setIsUploadingPhaseImg] = useState(false);
  const [isSavingPhase, setIsSavingPhase] = useState(false);

  const [isEditLinksModalOpen, setIsEditLinksModalOpen] = useState(false);
  const [editLinks, setEditLinks] = useState({ driveLink: '', psdLink: '' });
  const [isSavingLinks, setIsSavingLinks] = useState(false);
  const [isUploadingPsd, setIsUploadingPsd] = useState(false);

  const [isTitleCopied, setIsTitleCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);

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

  const fetchProject = useCallback(async () => {
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
          zipLink: data.zipLink || "",
          driveLink: data.driveLink || "",
          psdLink: data.psdLink || "",
          category: data.category || "all",
          img: data.img || ""
        });
        setEditLinks({
          driveLink: data.driveLink || "",
          psdLink: data.psdLink || ""
        });
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
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com" || email === "info@aitoolsprosmart.com") {
          setIsAdmin(true);
          setupPackageLimits("ADMIN", null);
          setIsAuthLoading(false);
          setIsAuthLoaded(true); 
        } else {
          setIsAdmin(false);
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
      }
    });

    fetchProject();
    
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
  const isVIPTest = currentUser?.email === 'historical.stories7972@gmail.com';
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

  const handleSavePhase = async () => {
    if (!newPhase.title || !newPhase.imageUrl) return alert("Title and image are required!");
    setIsSavingPhase(true);
    try {
      const updatedPhases = [...(projectData.phases || []), newPhase];
      await setDoc(doc(db, "v10_projects", projectId), { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
      setIsAddPhaseModalOpen(false);
      setNewPhase({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' });
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
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { phases: updatedPhases }, { merge: true });
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
      // Koristimo auto upload endpoint za fajlove poput PSD
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setEditLinks({ ...editLinks, psdLink: data.secure_url });
      } else {
        alert("Upload Error: " + (data.error?.message || "Došlo je do greške"));
      }
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
      await setDoc(doc(db, "v10_projects", projectId), {
        driveLink: editLinks.driveLink,
        psdLink: editLinks.psdLink
      }, { merge: true });
      setProjectData(prev => ({ ...prev, ...editLinks }));
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
      fetchProject(); 
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving: " + error.message);
    } finally {
      setIsSavingProject(false);
    }
  };

  if (isAuthLoading || isProjectLoading) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-[#ff6a00] animate-spin" />
        <span className="text-[#ff6a00] font-black uppercase tracking-widest text-xs">Authenticating Vault Access...</span>
      </div>
    );
  }

  const titleFirstWord = safeTitle.split(' ')[0] || "";
  const titleRest = safeTitle.indexOf(' ') !== -1 ? safeTitle.substring(safeTitle.indexOf(' ') + 1) : "";

  return (
    <div className="bg-[#020202] min-h-screen text-white relative selection:bg-orange-500 selection:text-black">
      
      <Helmet>
        <title>{safeTitle} | V10 Premium Asset</title>
        <meta name="description" content={projectData?.description || "Explore this premium 150MP UI/UX commercial asset within the V10 Vault."} />
        <meta name="theme-color" content="#ff6a00" />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12)_0%,_transparent_50%)]"></div>

      {/* DUGME ZA POVRATAK (GORE LEVO) */}
      <div className="fixed top-24 left-4 md:left-8 z-[90] pointer-events-none">
        <Link to="/ui-ux/vault" state={{ category: projectData.category }} className="flex w-max items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors bg-black/80 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-orange-500/50 shadow-lg cursor-pointer pointer-events-auto">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
        </Link>
      </div>

      {isUninitialized ? (
        <div className="pt-40 pb-32 px-4 flex flex-col items-center justify-center relative z-10 min-h-[70vh] pointer-events-none">
          {isAdmin ? (
            <button onClick={() => setIsInitModalOpen(true)} className="pointer-events-auto group relative w-full max-w-lg h-[300px] rounded-[2rem] overflow-hidden bg-[#050505] border-2 border-dashed border-[#ff6a00]/30 hover:border-[#ff6a00] transition-all duration-500 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_0_rgba(255,106,0,0)] hover:shadow-[0_0_60px_rgba(255,106,0,0.15)]">
              <div className="w-20 h-20 rounded-full bg-[#ff6a00]/10 group-hover:bg-[#ff6a00] flex items-center justify-center transition-colors duration-500 mb-6">
                <Plus className="w-10 h-10 text-[#ff6a00] group-hover:text-black transition-colors" />
              </div>
              <span className="text-[#ff6a00] font-black uppercase tracking-widest text-lg group-hover:scale-105 transition-transform">Initialize Project</span>
            </button>
          ) : (
            <div className="text-center pointer-events-auto">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-4">Project Not Found</h1>
              <p className="text-zinc-500 uppercase tracking-widest">This project does not exist in the database.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <section className="pt-40 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10 pointer-events-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full mb-8 pointer-events-auto">
               <Cpu className="w-4 h-4 text-orange-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">V10 Ultra-Print Engine</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 pointer-events-auto">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider leading-none">
                {titleFirstWord} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  {titleRest}
                </span>
              </h1>
              {isAdmin && safeTitle !== "Project Not Found" && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(safeTitle); setIsTitleCopied(true); setTimeout(() => setIsTitleCopied(false), 2000); }} 
                  className="bg-black/50 hover:bg-orange-500/20 p-4 rounded-full transition-all border border-white/10 hover:border-orange-500 cursor-pointer shadow-xl mt-4 md:mt-0 pointer-events-auto" 
                  title="Copy Title"
                >
                  {isTitleCopied ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Copy className="w-8 h-8 text-orange-500" />}
                </button>
              )}
            </motion.div>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium pointer-events-auto">
              {projectData?.description || ""}
            </motion.p>

            {/* ZASTIĆENI PRIKAZ LINKOVA I ADMIN DUGMADI */}
            {isAdmin && (
              <>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 pointer-events-auto">
                  {projectData.driveLink && (
                    <a href={projectData.driveLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-500/10 text-blue-500 border border-blue-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 hover:text-black transition-all">
                      <UploadCloud className="w-4 h-4" /> Google Drive Asset
                    </a>
                  )}
                  {projectData.psdLink && (
                    <a href={projectData.psdLink} target="_blank" rel="noreferrer" className="px-6 py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-cyan-500 hover:text-black transition-all">
                      <Layers className="w-4 h-4" /> Master PSD File
                    </a>
                  )}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 rounded-2xl border border-white/5 bg-white/5 pointer-events-auto">
                  <button 
                    onClick={() => setIsAddPhaseModalOpen(true)} 
                    className="w-12 h-12 rounded-full border-2 border-orange-500 flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(249,115,22,0.3)]"
                    title="Add new phase image"
                  >
                    <Plus className="w-6 h-6" />
                  </button>

                  <button 
                    onClick={() => setIsEditLinksModalOpen(true)} 
                    className="px-6 py-3 bg-zinc-900 border border-zinc-700 hover:border-orange-500 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" /> Edit Links
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-16 md:gap-24 pb-32 relative z-10">
            {(projectData?.phases || []).map((phase, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="flex flex-col gap-6 group">
                <div className="flex justify-between items-start md:items-center">
                  <div className="flex items-center gap-4 border-l-2 border-orange-500 pl-4">
                    <Layers className="w-6 h-6 text-orange-500" />
                    <div>
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white">{phase.title}</h3>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{phase.subtitle}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button onClick={() => handleDeletePhase(index)} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 md:p-3 rounded-xl transition-all border border-red-500/30 opacity-0 group-hover:opacity-100 mt-2 md:mt-0 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                      <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  )}
                </div>
                
                <div className={`w-full ${phase.ratio || 'aspect-video'} bg-zinc-950 rounded-2xl md:rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative group/image`}>
                   {phase.imageUrl && (
                     <>
                       <img 
                         src={phase.imageUrl} alt={phase.title} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()}
                         className="w-full h-full object-cover select-none pointer-events-auto transition-opacity duration-300 opacity-90 group-hover/image:opacity-100" 
                       />
                       <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(phase.imageUrl); }} className="absolute bottom-4 right-4 bg-black/80 hover:bg-orange-500 text-white p-3.5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-orange-500 transition-all z-40 shadow-xl opacity-0 group-hover/image:opacity-100 cursor-pointer">
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

      {/* MALA KORPA ZA KORISNIKA U DNU EKRANA */}
      {!isAdmin && currentUser && (
        <div className="fixed bottom-8 right-8 z-[80] w-80 bg-[#0a0a0a]/90 border border-[#ff6a00]/40 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-auto">
          <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-[#ff6a00]" />
              <span className="text-white font-black uppercase tracking-widest text-sm">Vault Cart</span>
            </div>
            <span className="text-xs font-black px-3 py-1.5 rounded-full bg-zinc-900 text-[#ff6a00] border border-[#ff6a00]/30 shadow-[0_0_15px_rgba(255,106,0,0.2)]">
              {cart.length} / {isVIPTest ? "∞" : (selectedUserPackage ? packageLimit : 0)}
            </span>
          </div>
          
          {cart.length > 0 && (
            <div className="flex flex-col gap-3 mb-6 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 border border-white/10 hover:border-[#ff6a00]/50 rounded-xl p-3 transition-colors group/item">
                  <span className="text-white text-[10px] font-bold uppercase tracking-widest truncate pr-2">{item.title}</span>
                  <button onClick={() => handleRemoveFromCart(item.id)} className="text-zinc-600 hover:text-red-500 transition-colors cursor-pointer pointer-events-auto">
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
              <button onClick={() => setIsCheckoutOpen(true)} className="w-full bg-gradient-to-r from-[#ff6a00] to-[#e65c00] text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,106,0,0.4)] cursor-pointer pointer-events-auto">
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

      <V10SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={selectedUserPackage} 
        price={userCheckoutData?.price || 0} 
        zipLink="" 
        projectImage={projectData.phases?.[0]?.imageUrl || "/v8-secure-blue.webp"} 
        selectedProjects={cart} 
      />

      {/* MODAL ZA DODAVANJE NOVE SLIKE (FAZE) - SAMO ZA ADMINA */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAddPhaseModalOpen && isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 p-10 rounded-[2.5rem] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.15)]">
                
                <button onClick={() => setIsAddPhaseModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform">
                  <X className="w-5 h-5 drop-shadow-md" />
                </button>
                
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-md"><span className="text-cyan-400">Add</span> Asset Image</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Image Title</label>
                    <input type="text" value={newPhase.title} onChange={(e) => setNewPhase({ ...newPhase, title: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="e.g. THE ALCHEMY PROTOCOL" />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Subtitle</label>
                    <input type="text" value={newPhase.subtitle} onChange={(e) => setNewPhase({ ...newPhase, subtitle: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="e.g. PRIME BEEF SPECIAL DISPLAY" />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Format (Ratio)</label>
                    <div className="relative">
                      <select value={newPhase.ratio} onChange={(e) => setNewPhase({ ...newPhase, ratio: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors appearance-none cursor-pointer shadow-inner">
                        <option value="aspect-video">16:9 (Cinematic / Landscape)</option>
                        <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
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
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Image (Upload)</label>
                    <div className="relative group cursor-pointer h-32">
                      <input type="file" accept="image/*" onChange={handlePhaseImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${newPhase.imageUrl ? 'bg-gradient-to-br from-cyan-400 to-blue-600 p-[3px] shadow-[0_0_40px_rgba(6,182,212,0.4)]' : 'border-2 border-dashed border-slate-600 bg-[#020617] group-hover:border-cyan-400 shadow-inner'}`}>
                        {isUploadingPhaseImg ? (
                          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        ) : newPhase.imageUrl ? (
                          <div className="w-full h-full bg-black rounded-xl p-[4px]"><img src={newPhase.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-lg brightness-110" /></div>
                        ) : (
                          <><UploadCloud className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 mb-2 transition-colors" /><span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Click to upload</span></>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSavePhase} disabled={isSavingPhase || isUploadingPhaseImg} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-widest mt-8 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-b-[5px] border-blue-900 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[5px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10 disabled:opacity-50 pointer-events-auto">
                    {isSavingPhase ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 drop-shadow-sm" /> <span className="drop-shadow-sm">Save Image</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* MODAL ZA UNOS LINKOVA - SAMO ZA ADMINA */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isEditLinksModalOpen && isAdmin && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 p-10 rounded-[2.5rem] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.15)]">
                
                <button onClick={() => setIsEditLinksModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform">
                  <X className="w-5 h-5 drop-shadow-md" />
                </button>
                
                <h2 className="text-3xl font-black text-white uppercase tracking-widest mb-8 drop-shadow-md"><span className="text-cyan-400">Edit</span> Project Links</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-blue-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><UploadCloud className="w-3 h-3"/> Google Drive Link</label>
                    <input type="text" value={editLinks.driveLink} onChange={(e) => setEditLinks({ ...editLinks, driveLink: e.target.value })} className="w-full bg-[#020617] border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-cyan-400 transition-colors shadow-inner" placeholder="https://drive.google.com/..." />
                  </div>
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><Layers className="w-3 h-3"/> Master PSD File</label>
                    <div className="relative group cursor-pointer h-20">
                      <input type="file" accept=".psd, image/vnd.adobe.photoshop" onChange={handlePsdUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all ${editLinks.psdLink ? 'bg-gradient-to-br from-cyan-400 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'border-2 border-dashed border-slate-600 bg-[#020617] group-hover:border-cyan-400 shadow-inner'}`}>
                        {isUploadingPsd ? (
                          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                        ) : editLinks.psdLink ? (
                          <div className="flex items-center gap-2 bg-black w-full h-full rounded-xl justify-center text-xs font-bold text-cyan-400">
                            <CheckCircle2 className="w-4 h-4"/> PSD UPLOADED
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 mb-1 transition-colors" />
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Click to upload .PSD</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={handleSaveLinks} disabled={isSavingLinks || isUploadingPsd} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-widest mt-8 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-b-[5px] border-blue-900 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[5px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10 disabled:opacity-50 pointer-events-auto">
                    {isSavingLinks ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 drop-shadow-sm" /> <span className="drop-shadow-sm">Save Links</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Modal za inicijalizaciju projekta (samo za admina) */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isInitModalOpen && isAdmin && (
            <motion.div key="modal-init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70 pointer-events-auto">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 p-10 rounded-[2.5rem] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.15)] max-h-[95vh] overflow-y-auto custom-scrollbar relative z-50">
                
                <button onClick={() => setIsInitModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform pointer-events-auto">
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
                        <option value="aspect-auto">Auto (Keep Original)</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Category (ID)</label>
                      <input type="text" value={newProject.category} onChange={(e) => setNewProject({...newProject, category: e.target.value})} className="w-full bg-[#020617]/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-2">Engine</label>
                      <input type="text" value={newProject.engine} onChange={(e) => setNewProject({...newProject, engine: e.target.value})} className="w-full bg-[#020617]/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-cyan-400 transition-colors" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-cyan-400 text-[10px] font-black uppercase tracking-widest mb-2">Cover Image</label>
                    <div className="relative group cursor-pointer h-40">
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

                  <button 
                    onClick={handleCreateProject} 
                    disabled={isSavingProject || isUploadingThumbnail} 
                    className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-widest mt-8 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-b-[5px] border-blue-900 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[5px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                  >
                    {isSavingProject ? (
                      <><Loader2 className="w-5 h-5 animate-spin drop-shadow-sm" /> <span className="drop-shadow-sm">SAVING...</span></>
                    ) : isUploadingThumbnail ? (
                      <><Loader2 className="w-5 h-5 animate-spin drop-shadow-sm" /> <span className="drop-shadow-sm">UPLOADING IMAGE...</span></>
                    ) : (
                      <><Save className="w-5 h-5 drop-shadow-sm" /> <span className="drop-shadow-sm">SAVE PROJECT</span></>
                    )}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Fullscreen Image Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl pointer-events-auto">
              <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }} className="fixed top-6 right-6 md:top-10 md:right-10 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-600 p-4 rounded-full border border-red-500/30 hover:border-red-500 transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] cursor-pointer z-[100000]">
                <X className="w-8 h-8" />
              </button>
              <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }} src={fullscreenImage} alt="Fullscreen Preview" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(249,115,22,0.1)] border border-white/5 select-none pointer-events-auto" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Prikaz paketa ako korisnik nije izabrao plan */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isPricingModalOpen && (
            <motion.div 
              key="pricing-modal-overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 w-screen h-screen z-[9999999] bg-[#020202] overflow-y-auto pointer-events-auto"
            >
              {/* Dugme za povratak */}
              <button 
                onClick={() => { 
                  setIsPricingModalOpen(false); 
                  setPendingProject(null); 
                  sessionStorage.removeItem('v10_pending_project_split'); 
                }} 
                className="absolute top-8 left-4 md:left-8 z-[100000] flex w-max items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors bg-black/80 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-orange-500/50 shadow-lg cursor-pointer group pointer-events-auto"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors"><ArrowLeft className="w-4 h-4 text-white" /></div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Project</span>
              </button>
              
              <div className="pt-24 pb-24 min-h-screen flex items-center justify-center">
                <V10PricingDetails 
                  onPackageLoaded={(pkg) => {
                    if (pkg) setIsPricingModalOpen(false);
                  }}
                  onPackageSelect={(pkgName, price) => {
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
    </div>
  );
};

export default V10SplitScreen;
// KRAJ FAJLA: src/ux/V10SplitScreen.jsx