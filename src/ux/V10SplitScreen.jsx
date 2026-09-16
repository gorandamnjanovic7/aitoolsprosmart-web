// FAJL: src/ux/V10SplitScreen.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, MonitorPlay, Zap, ShieldCheck, Layers, Plus, Save, X, Image as ImageIcon, Trash2, UploadCloud, Loader2, ChevronDown, FileImage, Folder, Copy, CheckCircle2, Lock, Maximize, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet'; // 🔥 DODAT HELMET 🔥
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

// 🔥 OVO JE TVOJ CHECKOUT MODAL KOJI ČEKA DA SE KORPA NAPUNI 🔥
import V10SecureCheckout from './V10SecureCheckout';

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

const V10SplitScreen = () => {
  const { projectId } = useParams();
  const location = useLocation();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserPackage, setSelectedUserPackage] = useState(null);
  
  // 🔥 NOVO: ČUVAMO CELU FIREBASE KORPU KLIJENTA 🔥
  const [userCheckoutData, setUserCheckoutData] = useState(null);
  
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isProjectLoading, setIsProjectLoading] = useState(true);

  // Modal za naplatu na kraju
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [projectData, setProjectData] = useState({
    title: "", description: "", phases: [], finalVideo: "", price: 1500, zipLink: "", driveLink: "", psdLink: "", category: "all"
  });
  
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhase, setNewPhase] = useState({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' }); 
  const [isSavingPhase, setIsSavingPhase] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingPhaseIndex, setUploadingPhaseIndex] = useState(null);

  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  
  const [isUploadingPsd, setIsUploadingPsd] = useState(false);
  const [manualDriveLink, setManualDriveLink] = useState("");
  const [psdLink, setPsdLink] = useState("");
  const [isTitleCopied, setIsTitleCopied] = useState(false);

  const [fullscreenImage, setFullscreenImage] = useState(null);

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
          // 🔥 PRATIMO ŠTA KLIJENT STAVLJA U KORPU UŽIVO 🔥
          unsubDoc = onSnapshot(doc(db, "checkout_requests", email), (pkgSnap) => {
            if (pkgSnap.exists()) {
              const data = pkgSnap.data();
              setSelectedUserPackage(data.selectedPackage);
              setUserCheckoutData(data); // Ceo paket sa izabranim projektima
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

    const fetchProject = async () => {
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
            category: data.category || "all" 
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
    };
    fetchProject();
    
    return () => {
      unsubAuth();
      if (unsubDoc) unsubDoc();
    };
  }, [projectId]);

  // 🔥 LOGIKA ZA B2B KVOTE (KORPU) - ISPRAVLJENO NA 10 i 40 🔥
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

  const handleAddProject = async () => {
    if (!currentUser) return;
    if (!canAddMore && !isAlreadySelected) return alert("You have reached your package limit!");
    
    try {
      const docRef = doc(db, "checkout_requests", currentUser.email.toLowerCase());
      const newProject = {
        id: projectId,
        title: safeTitle,
        driveLink: projectData.driveLink || projectData.zipLink || ""
      };
      
      const updatedProjects = [...currentSelected, newProject];
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

  // Upload funkcije ostaju iste
  const handleCloudinaryUpload = async (e, type = 'image') => { /*...isti kod...*/ };
  const handlePhaseImageUpdate = async (e, index) => { /*...isti kod...*/ };
  const handleSavePhase = async () => { /*...isti kod...*/ };
  const handleDeletePhase = async (indexToDelete) => { /*...isti kod...*/ };
  const handleSaveVideo = async () => { /*...isti kod...*/ };
  const handleDeleteVideo = async () => { /*...isti kod...*/ };
  const handlePsdUpload = async (e) => { /*...isti kod...*/ };
  const handleManualDriveSave = async () => { /*...isti kod...*/ };


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
      
      {/* 🔥 DODAT DINAMIČKI HELMET ZA SEO I DELJENJE 🔥 */}
      <Helmet>
        <title>{safeTitle} | V10 Premium Asset</title>
        <meta name="description" content={projectData?.description || "Explore this premium 150MP UI/UX commercial asset within the V10 Vault."} />
        <meta name="theme-color" content="#ff6a00" />
        
        <meta property="og:title" content={`${safeTitle} | V10 Vault`} />
        <meta property="og:description" content={projectData?.description || "Explore this premium 150MP UI/UX commercial asset."} />
        <meta property="og:image" content={projectData.phases?.[0]?.imageUrl || "https://www.aitoolsprosmart.com/v8-secure-blue.webp"} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${safeTitle} | V10 Vault`} />
        <meta name="twitter:image" content={projectData.phases?.[0]?.imageUrl || "https://www.aitoolsprosmart.com/v8-secure-blue.webp"} />
      </Helmet>

      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12)_0%,_transparent_50%)]"></div>

      <div className="fixed top-24 left-4 md:left-8 z-[90]">
        <Link to="/ui-ux/vault" state={{ category: projectData.category }} className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors bg-black/80 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-orange-500/50 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
        </Link>
      </div>

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

      {/* FIREBASE RENDERI FAZA (OSTALI ISTI) */}
      <section className="px-4 md:px-8 max-w-5xl mx-auto flex flex-col gap-24 md:gap-32 pb-32 relative z-10">
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

      {/* 🔥 KLIJENTSKI "MALI PLUS" I KORPA BROJAČ (Pametni Widget) 🔥 */}
      {!isAdmin && selectedUserPackage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4"
        >
          {/* Status Kvote (Koliko je tašni izabrao) */}
          <div className="bg-black/90 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3">
            <span className="text-zinc-400">Package</span>
            <span className="text-orange-500">{selectedUserPackage}</span> 
            <div className="h-4 w-px bg-white/20"></div>
            <span className={`${currentSelected.length === maxProjects ? 'text-emerald-400' : 'text-white'}`}>
              {currentSelected.length} / {maxProjects}
            </span>
          </div>

          {/* Dugme (Plus / Remove / Checkout) */}
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

      {/* 🔥 MODAL ZA NAPLATU 🔥 */}
      <V10SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={selectedUserPackage} 
        price={userCheckoutData?.price || 0} 
        zipLink="" 
        projectImage={projectData.phases?.[0]?.imageUrl || "/v8-secure-blue.webp"} 
        selectedProjects={currentSelected} 
      />

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