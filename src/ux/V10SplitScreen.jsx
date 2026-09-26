// FAJL: src/ux/V10SplitScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, Layers, Plus, Save, X, Image as ImageIcon, Trash2, UploadCloud, Loader2, ChevronDown, Copy, CheckCircle2, Lock, Maximize, ShoppingCart, Folder, FileImage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet'; 
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';

import V10SecureCheckout from './V10SecureCheckout';

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

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "", description: "", phases: [], finalVideo: "", price: 1500, zipLink: "", driveLink: "", psdLink: "", category: "all", img: ""
  });
  
  // 🔥 MODAL STATE: INICIJALIZACIJA PROJEKTA 🔥
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

  // 🔥 MODAL STATE: DODAVANJE SLIKE/FAZE 🔥
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false);
  const [newPhase, setNewPhase] = useState({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' }); 
  const [isSavingPhase, setIsSavingPhase] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [isTitleCopied, setIsTitleCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  
  // 🔥 STATE ZA LINKOVE 🔥
  const [manualDriveLink, setManualDriveLink] = useState("");
  const [psdLink, setPsdLink] = useState("");

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
        setManualDriveLink(data.driveLink || "");
        setPsdLink(data.psdLink || "");
      } else {
        setProjectData(prev => ({...prev, title: "Project Not Found", description: "Ovaj projekat ne postoji u bazi."}));
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setIsProjectLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    let unsubDoc = null;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const email = user.email.toLowerCase();
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
          setIsAdmin(true);
          setSelectedUserPackage("ADMIN");
          setIsAuthLoading(false);
        } else {
          setIsAdmin(false);
          unsubDoc = onSnapshot(doc(db, "checkout_requests", email), (pkgSnap) => {
            if (pkgSnap.exists()) {
              const data = pkgSnap.data();
              setSelectedUserPackage(data.selectedPackage);
              setUserCheckoutData(data); 
            } else {
              setSelectedUserPackage(null);
              setUserCheckoutData(null);
            }
            setIsAuthLoading(false);
          });
        }
      } else {
        setIsAdmin(false);
        setSelectedUserPackage(null);
        setIsAuthLoading(false);
      }
    });

    fetchProject();
    
    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, [projectId, fetchProject]);

  useEffect(() => {
    if (isInitModalOpen || isAddImageModalOpen || fullscreenImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isInitModalOpen, isAddImageModalOpen, fullscreenImage]);

  const getPackageLimit = (pkgName) => {
    if (pkgName === 'B2B RETAINER') return 3;
    if (pkgName === 'CINEMATIC PITCH') return 10;
    if (pkgName === 'V10 MASTER VAULT') return 40;
    return 0;
  };

  const safeTitle = projectData?.title || "Project Not Found";
  const maxProjects = getPackageLimit(selectedUserPackage);
  const currentSelected = userCheckoutData?.selectedProjects || [];
  
  const isAlreadySelected = currentSelected.some(p => p.id === projectId);
  const canAddMore = currentSelected.length < maxProjects;

  const isProjectMissing = safeTitle === "Project Not Found";

  const handleAddProject = async () => {
    if (!currentUser) return;
    if (!canAddMore && !isAlreadySelected) return alert("Dostigli ste limit vašeg paketa!");
    
    try {
      const docRef = doc(db, "checkout_requests", currentUser.email.toLowerCase());
      const newProjectData = {
        id: projectId,
        title: safeTitle,
        driveLink: projectData.driveLink || projectData.zipLink || ""
      };
      
      const updatedProjects = [...currentSelected, newProjectData];
      await setDoc(docRef, { selectedProjects: updatedProjects }, { merge: true });
    } catch (error) {
      console.error("Greška pri dodavanju u paket:", error);
    }
  };

  const handleRemoveProject = async () => {
    if (!currentUser) return;
    try {
      const docRef = doc(db, "checkout_requests", currentUser.email.toLowerCase());
      const updatedProjects = currentSelected.filter(p => p.id !== projectId);
      await setDoc(docRef, { selectedProjects: updatedProjects }, { merge: true });
    } catch (error) {
      console.error("Greška pri uklanjanju:", error);
    }
  };

  const handleManualDriveSave = async () => {
    try {
      await setDoc(doc(db, "v10_projects", projectId), { driveLink: manualDriveLink }, { merge: true });
      setProjectData(prev => ({ ...prev, driveLink: manualDriveLink }));
      alert("Drive link uspješno spremljen!");
    } catch (error) {
      console.error(error);
      alert("Greška pri spremanju Drive linka.");
    }
  };

  const handleManualPsdSave = async () => {
    try {
      await setDoc(doc(db, "v10_projects", projectId), { psdLink: psdLink }, { merge: true });
      setProjectData(prev => ({ ...prev, psdLink: psdLink }));
      alert("PSD link uspješno spremljen!");
    } catch (error) {
      console.error(error);
      alert("Greška pri spremanju PSD linka.");
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
    if (!newProject.title) return alert("Naslov projekta je obavezan!");
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
        phases: projectData.phases || []
      });
      setIsInitModalOpen(false);
      fetchProject(); 
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      if (data.secure_url) {
        setNewPhase({ ...newPhase, imageUrl: data.secure_url });
      } else {
        alert("Upload Error: " + data.error?.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSavePhase = async () => {
    if (!newPhase.title || !newPhase.imageUrl) {
      alert("Naslov i slika su obavezni!");
      return;
    }
    setIsSavingPhase(true);
    try {
      const updatedPhases = [...(projectData.phases || []), newPhase];
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
      setIsAddImageModalOpen(false);
      setNewPhase({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' });
    } catch (error) {
      console.error("Error saving phase:", error);
    } finally {
      setIsSavingPhase(false);
    }
  };

  const handleDeletePhase = async (indexToDelete) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovu sliku?")) return;
    try {
      const updatedPhases = projectData.phases.filter((_, idx) => idx !== indexToDelete);
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
    } catch (error) {
      console.error("Error deleting phase:", error);
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

  if (!isAdmin && !selectedUserPackage) {
    return (
      <div className="bg-[#020202] min-h-screen flex items-center justify-center p-4 relative selection:bg-red-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,_rgba(239,68,68,0.05)_0%,_transparent_60%)]"></div>
        <div className="max-w-xl w-full bg-zinc-950 border border-red-500/30 p-10 md:p-14 rounded-[2.5rem] text-center shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-orange-500"></div>
          <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Lock className="w-10 h-10 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.2em] mb-4">Vault Locked</h2>
          <p className="text-zinc-400 text-xs font-bold leading-relaxed mb-10 uppercase tracking-[0.15em] max-w-sm mx-auto">
             You must log in and select an active B2B access tier to view master project files, isolated layers, and high-res images.
          </p>
          <Link to="/ui-ux/vault" className="block w-full bg-gradient-to-b from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 text-white font-black uppercase tracking-widest py-5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(239,68,68,0.3)] border border-red-400/50 hover:scale-[1.02]">
             View Pricing Packages
          </Link>
        </div>
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

      <div className="fixed top-24 left-4 md:left-8 z-[90] flex flex-col gap-3">
        <Link to="/ui-ux/vault" state={{ category: projectData.category }} className="flex w-max items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors bg-black/80 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-orange-500/50 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
        </Link>
      </div>

      {isProjectMissing ? (
        <div className="pt-40 pb-32 px-4 flex flex-col items-center justify-center relative z-10 min-h-[70vh]">
          {isAdmin ? (
            <button onClick={() => setIsInitModalOpen(true)} className="group relative w-full max-w-lg h-[300px] rounded-[2rem] overflow-hidden bg-[#050505] border-2 border-dashed border-[#ff6a00]/30 hover:border-[#ff6a00] transition-all duration-500 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_0_rgba(255,106,0,0)] hover:shadow-[0_0_60px_rgba(255,106,0,0.15)]">
              <div className="w-20 h-20 rounded-full bg-[#ff6a00]/10 group-hover:bg-[#ff6a00] flex items-center justify-center transition-colors duration-500 mb-6">
                <Plus className="w-10 h-10 text-[#ff6a00] group-hover:text-black transition-colors" />
              </div>
              <span className="text-[#ff6a00] font-black uppercase tracking-widest text-lg group-hover:scale-105 transition-transform">Initialize Project</span>
            </button>
          ) : (
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider text-white mb-4">Project Not Found</h1>
              <p className="text-zinc-500 uppercase tracking-widest">Ovaj projekt ne postoji u bazi.</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <section className="pt-40 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full mb-8">
               <Cpu className="w-4 h-4 text-orange-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">V10 Ultra-Print Engine</span>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider leading-none">
                {titleFirstWord} <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                  {titleRest}
                </span>
              </h1>
              {isAdmin && safeTitle !== "Project Not Found" && (
                <button 
                  onClick={() => { navigator.clipboard.writeText(safeTitle); setIsTitleCopied(true); setTimeout(() => setIsTitleCopied(false), 2000); }} 
                  className="bg-black/50 hover:bg-orange-500/20 p-4 rounded-full transition-all border border-white/10 hover:border-orange-500 cursor-pointer shadow-xl mt-4 md:mt-0" 
                  title="Kopiraj naziv projekta za ZIP"
                >
                  {isTitleCopied ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> : <Copy className="w-8 h-8 text-orange-500" />}
                </button>
              )}
            </motion.div>
            
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
              {projectData?.description || ""}
            </motion.p>
          </section>

          {/* 🔥 ADMIN PANEL ZA LINKOVE 🔥 */}
          {isAdmin && !isProjectMissing && (
            <section className="px-4 md:px-8 max-w-5xl mx-auto mb-16 relative z-10">
              <div className="bg-[#050505] border-2 border-dashed border-orange-500/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 shadow-[0_0_40px_rgba(249,115,22,0.05)]">
                <div className="flex-1 space-y-3">
                  <label className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Folder className="w-4 h-4" /> Google Drive / ZIP Link
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={manualDriveLink} 
                      onChange={(e) => setManualDriveLink(e.target.value)}
                      placeholder="Unesi Drive link..." 
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 shadow-inner"
                    />
                    <button 
                      onClick={handleManualDriveSave} 
                      className="bg-orange-600 hover:bg-orange-500 text-black px-5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <label className="text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <FileImage className="w-4 h-4" /> Master PSD Link
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={psdLink} 
                      onChange={(e) => setPsdLink(e.target.value)}
                      placeholder="Unesi PSD link..." 
                      className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-orange-500 shadow-inner"
                    />
                    <button 
                      onClick={handleManualPsdSave} 
                      className="bg-orange-600 hover:bg-orange-500 text-black px-5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

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

            {/* 🔥 PRAVOKUTNIK ZA DODAVANJE NOVE SLIKE U POSTOJEĆI PROJEKT 🔥 */}
            {isAdmin && !isProjectMissing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center mt-10">
                <button onClick={() => setIsAddImageModalOpen(true)} className="group relative w-full h-[300px] rounded-[2rem] overflow-hidden bg-[#050505] border-2 border-dashed border-orange-500/30 hover:border-orange-500 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_0_rgba(249,115,22,0)] hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 group-hover:bg-orange-500 flex items-center justify-center transition-colors duration-300 mb-4">
                    <Plus className="w-8 h-8 text-orange-500 group-hover:text-black transition-colors" />
                  </div>
                  <span className="text-orange-500 font-black uppercase tracking-widest text-sm group-hover:scale-105 transition-transform">Add Image to Project</span>
                </button>
              </motion.div>
            )}
          </section>
        </>
      )}

      {!isAdmin && selectedUserPackage && !isProjectMissing && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4"
        >
          <div className="bg-black/90 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
            <span className="text-zinc-400">Package</span>
            <span className="text-orange-500">{selectedUserPackage}</span> 
            <div className="h-4 w-px bg-white/20"></div>
            <span className={`${currentSelected.length === maxProjects ? 'text-emerald-400' : 'text-white'}`}>
              {currentSelected.length} / {maxProjects}
            </span>
          </div>

          {isAlreadySelected ? (
            <button 
              onClick={handleRemoveProject}
              className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 group cursor-pointer"
            >
              <Trash2 className="w-6 h-6" />
              <span className="absolute right-full mr-4 bg-black/90 text-red-500 border border-red-500/30 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Remove from Package
              </span>
            </button>
          ) : (
            <button 
              onClick={canAddMore ? handleAddProject : () => setIsCheckoutOpen(true)}
              className={`${canAddMore ? 'bg-orange-600 hover:bg-orange-500 text-black shadow-[0_0_30px_rgba(249,115,22,0.5)]' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-pulse'} p-5 rounded-full flex items-center justify-center gap-3 transition-all hover:scale-105 group cursor-pointer`}
            >
              {canAddMore ? <Plus className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
              
              <span className={`absolute right-full mr-4 bg-black/90 border px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none ${canAddMore ? 'text-orange-500 border-orange-500/30' : 'text-emerald-500 border-emerald-500/30'}`}>
                {canAddMore ? 'Add to Package' : 'Finalize Checkout'}
              </span>
            </button>
          )}
        </motion.div>
      )}

      <V10SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={selectedUserPackage} 
        price={userCheckoutData?.price || 0} 
        zipLink="" 
        projectImage={projectData.phases?.[0]?.imageUrl || "/v8-secure-blue.webp"} 
        selectedProjects={currentSelected} 
      />

      {/* 🔥 MODAL 1: INICIJALIZACIJA PROJEKTA 🔥 */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isInitModalOpen && isAdmin && (
            <motion.div key="modal-init" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020617] border border-slate-600 border-t-slate-400/80 border-l-slate-400/80 p-10 rounded-[2.5rem] w-full max-w-xl shadow-[0_40px_80px_rgba(0,0,0,0.9),_inset_0_2px_10px_rgba(255,255,255,0.15)] max-h-[95vh] overflow-y-auto custom-scrollbar">
                
                <button onClick={() => setIsInitModalOpen(false)} className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-b from-red-500 to-red-700 border border-red-400 text-white shadow-[0_8px_15px_rgba(220,38,38,0.5),_inset_0_2px_4px_rgba(255,255,255,0.6)] hover:scale-105 active:scale-95 cursor-pointer transition-transform">
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

                  <button onClick={handleCreateProject} disabled={isSavingProject || isUploadingThumbnail} className="relative w-full px-8 py-5 rounded-2xl bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black uppercase tracking-widest mt-8 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.6),_inset_0_2px_4px_rgba(255,255,255,0.5)] border-b-[5px] border-blue-900 hover:translate-y-[2px] hover:border-b-[3px] active:translate-y-[5px] active:border-b-0 flex items-center justify-center gap-3 cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSavingProject ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5 drop-shadow-sm" /> <span className="drop-shadow-sm">Save Project</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 🔥 MODAL 2: DODAVANJE SLIKE/FAZE 🔥 */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isAddImageModalOpen && isAdmin && (
            <motion.div key="modal-add-image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 w-screen h-screen z-[9999999] flex items-center justify-center p-4 bg-black/70">
              <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2rem] border border-orange-500/30 w-full max-w-xl shadow-[0_0_50px_rgba(249,115,22,0.15)] max-h-[95vh] overflow-y-auto custom-scrollbar">
                
                <button onClick={() => setIsAddImageModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white bg-black p-2 rounded-full border border-white/10 hover:border-orange-500 cursor-pointer transition-colors z-10">
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
                  <div className="p-2 bg-orange-500/10 rounded-lg"><ImageIcon className="w-6 h-6 text-orange-500" /></div>
                  <h3 className="text-xl font-black uppercase tracking-widest text-white">Add New Image</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">Image Title</label>
                      <input type="text" value={newPhase.title} onChange={(e) => setNewPhase({...newPhase, title: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors shadow-inner" placeholder="e.g. Master View" />
                    </div>
                    <div>
                      <label className="block text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">Image Subtitle</label>
                      <input type="text" value={newPhase.subtitle} onChange={(e) => setNewPhase({...newPhase, subtitle: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors shadow-inner" placeholder="e.g. 150MP Final Asset" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">Format (Ratio)</label>
                    <div className="relative">
                      <select value={newPhase.ratio} onChange={(e) => setNewPhase({...newPhase, ratio: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-500 transition-colors appearance-none cursor-pointer shadow-inner">
                        <option value="aspect-video">16:9 (Cinematic / Landscape)</option>
                        <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
                        <option value="aspect-[3/2]">3:2 (Classic Photo)</option>
                        <option value="aspect-[4/3]">4:3 (Standard Screen)</option>
                        <option value="aspect-square">1:1 (Square Product)</option>
                        <option value="aspect-[4/5]">4:5 (Portrait / IG)</option>
                        <option value="aspect-[2/3]">2:3 (Classic Photo Portrait)</option>
                        <option value="aspect-[9/16]">9:16 (Vertical / Reels)</option>
                        <option value="aspect-auto">Auto (Zadrži originalni format)</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2">Upload File</label>
                    <div className="relative group cursor-pointer h-40">
                      <input type="file" accept="image/*" onChange={handleCloudinaryUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center transition-all border-2 border-dashed ${newPhase.imageUrl ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 bg-black group-hover:border-orange-500'}`}>
                        {isUploadingImage ? (
                          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        ) : newPhase.imageUrl ? (
                          <div className="relative w-full h-full p-2">
                            <img src={newPhase.imageUrl} alt="Preview" className="w-full h-full object-contain rounded-lg opacity-80" />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-white text-xs font-bold uppercase tracking-widest bg-black/80 px-4 py-2 rounded-lg border border-white/20">Click to change</span>
                            </div>
                          </div>
                        ) : (
                          <><UploadCloud className="w-8 h-8 text-zinc-500 group-hover:text-orange-500 transition-colors mb-3" /><span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Select Image File</span></>
                        )}
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSavePhase} disabled={isSavingPhase || isUploadingImage || !newPhase.imageUrl || !newPhase.title} className="w-full px-8 py-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-black font-black uppercase tracking-widest mt-4 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer shadow-[0_0_30px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSavingPhase ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> <span>Upload & Save</span></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* FULLSCREEN IMAGE MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl">
              <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }} className="fixed top-6 right-6 md:top-10 md:right-10 text-red-500 hover:text-white bg-red-500/10 hover:bg-red-600 p-4 rounded-full border border-red-500/30 hover:border-red-500 transition-all shadow-[0_0_30px_rgba(239,68,68,0.4)] cursor-pointer z-[100000]">
                <X className="w-8 h-8" />
              </button>
              <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }} src={fullscreenImage} alt="Fullscreen Preview" onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(249,115,22,0.1)] border border-white/5 select-none pointer-events-auto" />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default V10SplitScreen;