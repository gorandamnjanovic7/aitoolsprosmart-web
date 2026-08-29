// Fajl: V10SplitScreen.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Cpu, MonitorPlay, Zap, ShieldCheck, Layers, Plus, Save, X, Image as ImageIcon, Trash2, UploadCloud, Loader2, ChevronDown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// IMPORTI ZA NAPLATU I LOGIN
import V8SecureCheckout from '../V8SecureCheckout'; 
import LoginRequiredModal from '../LoginRequiredModal';

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

// POCETAK FUNKCIJE: V10SplitScreen
const V10SplitScreen = () => {
  const { projectId } = useParams();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [projectData, setProjectData] = useState({
    title: "Loading...",
    description: "Loading...",
    phases: [], 
    finalVideo: "",
    price: 1500, 
    zipLink: "" 
  });
  
  // State za forme novih faza
  const [isAddingPhase, setIsAddingPhase] = useState(false);
  const [newPhase, setNewPhase] = useState({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' }); // Dodat ratio
  const [isSavingPhase, setIsSavingPhase] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingPhaseIndex, setUploadingPhaseIndex] = useState(null);

  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [isSavingVideo, setIsSavingVideo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  
  // State za komercijalna podesavanja
  const [adminPrice, setAdminPrice] = useState(1500);
  const [adminZipLink, setAdminZipLink] = useState("");
  const [isSavingCommercials, setIsSavingCommercials] = useState(false);

  // State za Modale
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // POCETAK FUNKCIJE: useEffect (Inicijalizacija)
  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && (user.email.toLowerCase() === "damnjanovicgoran7@gmail.com" || user.email.toLowerCase() === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
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
            zipLink: data.zipLink || ""
          });
          setAdminPrice(data.price || 1500);
          setAdminZipLink(data.zipLink || "");
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
    return () => unsubAuth();
  }, [projectId]);
  // KRAJ FUNKCIJE: useEffect (Inicijalizacija)

  // POCETAK FUNKCIJE: handleCloudinaryUpload
  const handleCloudinaryUpload = async (e, type = 'image') => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) return alert("File exceeds 100MB limit.");

    if (type === 'image') setIsUploadingImage(true);
    else setIsUploadingVideo(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const resourceType = type === 'video' ? 'video' : 'image';

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.secure_url) {
        if (type === 'image') setNewPhase({ ...newPhase, imageUrl: data.secure_url });
        else setNewVideoUrl(data.secure_url);
      }
    } catch (error) { console.error("Upload error", error); } 
    finally {
      if (type === 'image') setIsUploadingImage(false);
      else setIsUploadingVideo(false);
    }
  };
  // KRAJ FUNKCIJE: handleCloudinaryUpload

  // POCETAK FUNKCIJE: handlePhaseImageUpdate
  const handlePhaseImageUpdate = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhaseIndex(index);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await response.json();
      if (data.secure_url) {
        const updatedPhases = [...projectData.phases];
        updatedPhases[index].imageUrl = data.secure_url;
        const docRef = doc(db, "v10_projects", projectId);
        await setDoc(docRef, { phases: updatedPhases }, { merge: true });
        setProjectData(prev => ({ ...prev, phases: updatedPhases }));
      }
    } catch (error) { console.error("Upload error", error); } 
    finally { setUploadingPhaseIndex(null); }
  };
  // KRAJ FUNKCIJE: handlePhaseImageUpdate

  // POCETAK FUNKCIJE: handleSavePhase
  const handleSavePhase = async () => {
    if (!newPhase.title || !newPhase.imageUrl) return alert("Title and Image URL are required!");
    setIsSavingPhase(true);
    try {
      const docRef = doc(db, "v10_projects", projectId);
      // AR (ratio) se upisuje ovde u bazu
      const updatedPhases = [...(projectData.phases || []), { ...newPhase, createdAt: new Date().toISOString() }];
      await setDoc(docRef, { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
      setNewPhase({ title: '', subtitle: '', imageUrl: '', ratio: 'aspect-video' }); 
      setIsAddingPhase(false);
    } catch (error) { console.error("Error", error); } 
    finally { setIsSavingPhase(false); }
  };
  // KRAJ FUNKCIJE: handleSavePhase

  // POCETAK FUNKCIJE: handleDeletePhase
  const handleDeletePhase = async (indexToDelete) => {
    if(!window.confirm("Da li ste sigurni da želite obrisati ovu fazu?")) return;
    try {
      const updatedPhases = projectData.phases.filter((_, index) => index !== indexToDelete);
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { phases: updatedPhases }, { merge: true });
      setProjectData(prev => ({ ...prev, phases: updatedPhases }));
    } catch (error) { console.error("Error", error); }
  };
  // KRAJ FUNKCIJE: handleDeletePhase

  // POCETAK FUNKCIJE: handleSaveVideo
  const handleSaveVideo = async () => {
    if (!newVideoUrl) return alert("Please enter URL");
    setIsSavingVideo(true);
    try {
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { finalVideo: newVideoUrl }, { merge: true });
      setProjectData(prev => ({ ...prev, finalVideo: newVideoUrl }));
      setNewVideoUrl('');
      setIsAddingVideo(false);
    } catch (error) { console.error("Error", error); } 
    finally { setIsSavingVideo(false); }
  };
  // KRAJ FUNKCIJE: handleSaveVideo

  // POCETAK FUNKCIJE: handleDeleteVideo
  const handleDeleteVideo = async () => {
    if(!window.confirm("Obrisati video?")) return;
    try {
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { finalVideo: "" }, { merge: true });
      setProjectData(prev => ({ ...prev, finalVideo: "" }));
    } catch (error) { console.error("Error", error); }
  };
  // KRAJ FUNKCIJE: handleDeleteVideo

  // POCETAK FUNKCIJE: handleSaveCommercials
  const handleSaveCommercials = async () => {
    setIsSavingCommercials(true);
    try {
      const docRef = doc(db, "v10_projects", projectId);
      await setDoc(docRef, { 
        price: Number(adminPrice), 
        zipLink: adminZipLink 
      }, { merge: true });
      setProjectData(prev => ({ ...prev, price: Number(adminPrice), zipLink: adminZipLink }));
      alert("V10 Commercial settings updated successfully!");
    } catch (error) {
      console.error("Error saving commercials:", error);
      alert("Failed to save settings.");
    } finally {
      setIsSavingCommercials(false);
    }
  };
  // KRAJ FUNKCIJE: handleSaveCommercials

  // POCETAK FUNKCIJE: handleInitiateCheckout
  const handleInitiateCheckout = () => {
    if (currentUser) setIsCheckoutOpen(true);
    else setIsLoginModalOpen(true);
  };
  // KRAJ FUNKCIJE: handleInitiateCheckout

  const safeTitle = projectData?.title || "Untitled Project";
  const titleFirstWord = safeTitle.split(' ')[0] || "";
  const titleRest = safeTitle.indexOf(' ') !== -1 ? safeTitle.substring(safeTitle.indexOf(' ') + 1) : "";

  return (
    <div className="bg-[#020202] min-h-screen text-white relative selection:bg-orange-500 selection:text-black">
      
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12)_0%,_transparent_50%)]"></div>

      <div className="fixed top-24 left-4 md:left-8 z-[100]">
        <Link to="/ui-ux/vault" className="flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors bg-black/80 p-2 pr-4 rounded-full backdrop-blur-md border border-white/10 hover:border-orange-500/50 shadow-lg">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-white" /></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Back to Vault</span>
        </Link>
      </div>

      <div className="fixed top-24 right-4 md:right-8 z-[100]">
        <button 
          onClick={handleInitiateCheckout}
          className="flex items-center gap-2 text-white bg-orange-600/90 hover:bg-orange-500 p-2 md:py-2 md:px-5 rounded-full backdrop-blur-md border border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"><ShieldCheck className="w-4 h-4 text-white" /></div>
          <span className="hidden md:inline text-[10px] md:text-xs font-black uppercase tracking-widest pr-2">Settle Invoice & DL Master</span>
          <span className="md:hidden text-[10px] font-black uppercase tracking-widest pr-2">Settle & DL</span>
        </button>
      </div>

      <section className="pt-40 pb-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full mb-8">
           <Cpu className="w-4 h-4 text-orange-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">V10 Ultra-Print Engine</span>
        </motion.div>
        
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-wider mb-8 leading-none">
          {titleFirstWord} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-600 drop-shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            {titleRest}
          </span>
        </motion.h1>
        
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-zinc-400 text-sm md:text-base max-w-2xl leading-relaxed font-medium">
          {projectData?.description || ""}
        </motion.p>
      </section>

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
              {isAdmin && (
                <button onClick={() => handleDeletePhase(index)} className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white p-2.5 rounded-xl transition-all duration-300 border border-red-500/20 hover:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)] opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* PRILAGOĐENI FORMAT (AR) KROZ KLASE */}
            <div className={`w-full ${phase.ratio || 'aspect-video'} bg-zinc-950 rounded-2xl md:rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl relative`}>
               {phase.imageUrl ? (
                 <>
                   <img src={phase.imageUrl} alt={phase.title} className="w-full h-full object-cover select-none pointer-events-auto cursor-zoom-in hover:opacity-80 transition-opacity duration-300" onClick={() => setFullscreenImage(phase.imageUrl)} onContextMenu={(e) => e.preventDefault()} onDragStart={(e) => e.preventDefault()} />
                   {isAdmin && (
                     <label className="absolute top-4 right-4 bg-black/80 backdrop-blur hover:bg-orange-600 text-white p-3 rounded-xl shadow-2xl opacity-0 hover:opacity-100 transition-all z-50 cursor-pointer flex items-center gap-2 border border-white/10 hover:border-orange-500">
                        {uploadingPhaseIndex === index ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <UploadCloud className="w-4 h-4 text-orange-500" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{uploadingPhaseIndex === index ? 'Uploading...' : 'Replace Image'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhaseImageUpdate(e, index)} disabled={uploadingPhaseIndex === index} />
                     </label>
                   )}
                 </>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                   {uploadingPhaseIndex === index ? <Loader2 className="w-12 h-12 text-orange-500 animate-spin" /> : <ImageIcon className="w-12 h-12 text-zinc-800" />}
                   <span className="text-zinc-700 font-black uppercase tracking-[0.3em] text-sm md:text-xl">{uploadingPhaseIndex === index ? 'UPLOADING...' : 'IMAGE PLACEHOLDER'}</span>
                   {isAdmin && uploadingPhaseIndex !== index && (
                     <label className="mt-6 flex items-center gap-2 bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-black px-6 py-3 rounded-full cursor-pointer transition-colors border border-orange-500/30 hover:border-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                       <Plus className="w-5 h-5" /> <span className="text-xs font-black uppercase tracking-widest">Dodaj Sliku</span>
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhaseImageUpdate(e, index)} />
                     </label>
                   )}
                 </div>
               )}
            </div>
          </motion.div>
        ))}

        {isAdmin && safeTitle !== "Project Not Found" && (
          <div className="w-full border border-dashed border-orange-500/50 rounded-[2rem] p-8 md:p-12 relative overflow-hidden bg-black/50 backdrop-blur-sm">
            <div className="absolute top-4 right-4 bg-orange-600 text-black text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase">Admin Mode</div>
            
            {!isAddingPhase ? (
              <button onClick={() => setIsAddingPhase(true)} className="w-full py-8 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:bg-orange-500/5 transition-colors rounded-xl">
                <div className="w-16 h-16 rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 group-hover:bg-orange-500 text-orange-500 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(249,115,22,0.1)] group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                  <Plus className="w-8 h-8" />
                </div>
                <span className="font-black uppercase tracking-widest text-orange-500 group-hover:text-orange-400 transition-colors">Add Next Phase</span>
              </button>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-6">
                  
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <h3 className="text-xl font-black uppercase tracking-widest text-orange-500 flex items-center gap-2"><Zap className="w-5 h-5" /> Initialize New Phase</h3>
                    <button onClick={() => setIsAddingPhase(false)} className="text-zinc-500 hover:text-white p-2 bg-white/5 rounded-full"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Phase Title</label>
                      <input type="text" value={newPhase.title} onChange={e => setNewPhase({...newPhase, title: e.target.value})} className="bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" placeholder="e.g. Phase 4: Integration" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subtitle</label>
                      <input type="text" value={newPhase.subtitle} onChange={e => setNewPhase({...newPhase, subtitle: e.target.value})} className="bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" placeholder="Enter description..." />
                    </div>
                  </div>

                  {/* AR SELEKTOR U ADD NEXT PHASE */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Image Format (Ratio)</label>
                      <div className="relative">
                        <select 
                          value={newPhase.ratio} 
                          onChange={e => setNewPhase({...newPhase, ratio: e.target.value})} 
                          className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="aspect-video">16:9 (Cinematic / Landscape)</option>
                          <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
                          <option value="aspect-[3/2]">3:2 (Classic Photo)</option>
                          <option value="aspect-square">1:1 (Square Product)</option>
                          <option value="aspect-[4/5]">4:5 (Portrait / IG)</option>
                          <option value="aspect-[2/3]">2:3 (Classic Photo Portrait)</option>
                          <option value="aspect-[9/16]">9:16 (Vertical / Reels)</option>
                          <option value="aspect-auto">Auto (Zadrži originalni format)</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                        <span>Image URL</span>
                        <span className="text-orange-500">Auto Upload Active</span>
                      </label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input type="text" value={newPhase.imageUrl} onChange={e => setNewPhase({...newPhase, imageUrl: e.target.value})} className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" placeholder="https://..." />
                        <label className="shrink-0 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">
                          {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <UploadCloud className="w-4 h-4" />}
                          {isUploadingImage ? 'Uploading...' : 'Upload File'}
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleCloudinaryUpload(e, 'image')} />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleSavePhase} disabled={isSavingPhase || isUploadingImage} className="mt-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-widest p-5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                    {isSavingPhase ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save className="w-5 h-5" /> Commit Phase to Database</>}
                  </button>

                </motion.div>
              </AnimatePresence>
            )}
          </div>
        )}
      </section>

      {/* ADMIN SEKCIJA ZA KOMERCIJALNA PODESAVANJA */}
      {isAdmin && safeTitle !== "Project Not Found" && (
        <section className="px-4 md:px-8 max-w-5xl mx-auto pb-20 relative z-10">
          <div className="w-full border border-blue-500/30 rounded-[2rem] p-8 md:p-12 relative overflow-hidden bg-[#020510] shadow-[0_0_50px_rgba(37,99,235,0.1)]">
            <div className="absolute top-4 right-4 bg-blue-600 text-white text-[9px] font-black tracking-widest px-2 py-1 rounded uppercase">Commercial Ops</div>
            
            <div className="flex items-center gap-3 mb-6 border-b border-blue-900/50 pb-4">
              <Lock className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-black uppercase tracking-widest text-white">B2B Checkout Settings</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">Master Asset Price ($)</label>
                <input 
                  type="number" 
                  value={adminPrice} 
                  onChange={e => setAdminPrice(e.target.value)} 
                  className="bg-[#010208] border border-blue-900/50 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors text-xl font-bold" 
                  placeholder="e.g. 1500" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-blue-400">150MP Master Delivery URL (Wirelink/Cloudinary)</label>
                <input 
                  type="text" 
                  value={adminZipLink} 
                  onChange={e => setAdminZipLink(e.target.value)} 
                  className="bg-[#010208] border border-blue-900/50 rounded-xl p-4 text-white focus:border-blue-500 outline-none transition-colors" 
                  placeholder="https://wire.link/vas-fajl.zip" 
                />
              </div>
            </div>

            <button 
              onClick={handleSaveCommercials} 
              disabled={isSavingCommercials} 
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-widest p-4 rounded-xl flex justify-center items-center gap-2 transition-colors shadow-[0_0_20px_rgba(37,99,235,0.4)]"
            >
              {isSavingCommercials ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Update Commercial Database</>}
            </button>
          </div>
        </section>
      )}

      {safeTitle !== "Project Not Found" && (
        <section className="w-full bg-black/50 border-t border-white/5 relative z-20 pb-24 backdrop-blur-sm">
          <div className="max-w-[1920px] mx-auto px-4 md:px-8">
            <div className="text-center py-16">
              <MonitorPlay className="w-12 h-12 text-orange-500 mx-auto mb-6" />
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-white mb-4">Video Presentation</h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs md:text-sm">V10 Cinematic Matrix</p>
            </div>
            {projectData?.finalVideo ? (
              <div className="w-full max-w-5xl mx-auto aspect-video bg-[#050505] relative overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-2xl md:rounded-[2rem] group">
                <video src={projectData.finalVideo} controls autoPlay muted loop controlsList="nodownload" onContextMenu={(e) => e.preventDefault()} className="w-full h-full object-cover" />
                {isAdmin && (
                  <button onClick={handleDeleteVideo} className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                    <Trash2 className="w-5 h-5" /> <span className="text-[10px] font-black uppercase tracking-widest">Remove Video</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="w-full max-w-5xl mx-auto aspect-video bg-zinc-950/50 rounded-2xl md:rounded-[2rem] border border-white/5 relative flex items-center justify-center">
                {!isAdmin ? (
                  <div className="text-center">
                    <ShieldCheck className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                    <span className="text-zinc-700 font-black uppercase tracking-[0.5em] text-sm md:text-xl">Awaiting Signal</span>
                  </div>
                ) : (
                  <div className="w-full h-full p-4 md:p-8 flex items-center justify-center border-2 border-dashed border-orange-500/30 rounded-[2rem] hover:border-orange-500/50 transition-colors">
                    {!isAddingVideo ? (
                      <button onClick={() => setIsAddingVideo(true)} className="flex flex-col items-center gap-4 cursor-pointer group">
                        <div className="w-16 h-16 rounded-full border-2 border-orange-500/30 group-hover:border-orange-500 group-hover:bg-orange-500 text-orange-500 group-hover:text-black flex items-center justify-center transition-all duration-300"><Plus className="w-8 h-8" /></div>
                        <span className="font-black uppercase tracking-widest text-orange-500 group-hover:text-orange-400">Add Video Engine</span>
                      </button>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-black p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-black uppercase tracking-widest text-orange-500">Initialize Video Source</h3>
                          <button onClick={() => setIsAddingVideo(false)} className="text-zinc-500 hover:text-white"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-col gap-3 mb-4">
                          <input type="text" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none" placeholder="Paste direct URL here..." />
                          <div className="flex items-center gap-4 w-full"><div className="h-px bg-white/10 flex-1"></div><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">OR</span><div className="h-px bg-white/10 flex-1"></div></div>
                          <label className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors border border-white/5 shadow-inner">
                            {isUploadingVideo ? <Loader2 className="w-5 h-5 animate-spin text-orange-500" /> : <UploadCloud className="w-5 h-5 text-zinc-400" />}{isUploadingVideo ? 'Uploading Media...' : 'Upload Video File (.mp4)'}<input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => handleCloudinaryUpload(e, 'video')} />
                          </label>
                        </div>
                        <button onClick={handleSaveVideo} disabled={isSavingVideo || isUploadingVideo} className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black uppercase tracking-widest p-4 rounded-xl flex justify-center items-center gap-2">
                          {isSavingVideo ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save className="w-4 h-4" /> Save Configuration</>}
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* V8 FULLSCREEN MODAL */}
      <AnimatePresence>
        {fullscreenImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullscreenImage(null)} className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl cursor-zoom-out">
            <button onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors bg-black/50 p-2 rounded-full border border-white/10 hover:border-orange-500"><X className="w-6 h-6" /></button>
            <motion.img initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ duration: 0.3 }} src={fullscreenImage} alt="Fullscreen Preview" className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(249,115,22,0.1)] border border-white/5" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* LOGIN MODAL */}
      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => {
          setIsLoginModalOpen(false); 
          setIsCheckoutOpen(true);    
        }}
        packageName={`${safeTitle} - B2B Master License`}
        price={projectData.price}
      />

     {/* V8 SECURE CHECKOUT MODAL */}
      <V8SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={safeTitle} 
        zipLink={projectData.zipLink || "https://wire.link/vas-fajl.zip"} 
        availableTiers={[
          { 
            id: 'poc',
            name: 'PROOF OF CONCEPT', 
            desc: '1x 150MP UI/Mockup Fusion (Test Run)', 
            price: 450, 
            isMonthly: false 
          },
          { 
            id: 'pitch', 
            name: 'FULL CINEMATIC PITCH', 
            desc: 'Complete Vault Suite & Raw Master', 
            price: projectData.price || 1500, 
            isMonthly: false 
          },
          { 
            id: 'retainer', 
            name: 'B2B ENGINEERING RETAINER', 
            desc: 'Monthly R&D Partner & Priority Rendering', 
            price: 200, 
            isMonthly: true, 
            planId: "P-76W83552DF326472UNKFQ4KQ" 
          }
        ]}
      />

    </div>
  );
};
// KRAJ FUNKCIJE: V10SplitScreen

export default V10SplitScreen;