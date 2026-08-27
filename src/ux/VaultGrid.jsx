// --- POCETAK FUNKCIJE: VaultGrid ---
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronLeft, ChevronRight, Plus, X, Save, Image as ImageIcon, ChevronDown, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import { auth, db } from '../firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, setDoc, doc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore'; 

const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
const CLOUDINARY_UPLOAD_PRESET = "uploads"; 

const VaultGrid = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showObsidian, setShowObsidian] = useState(true); // OVO KONTROLISE PRVU KARTICU
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false); 
  
  const [newProject, setNewProject] = useState({ 
    title: '', 
    engine: 'V10 Ultra-Print', 
    img: '',
    ratio: 'aspect-video'
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && (user.email.toLowerCase() === "damnjanovicgoran7@gmail.com" || user.email.toLowerCase() === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    fetchProjects();
    return () => unsubAuth();
  }, []);

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "v10_projects"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      
      if (!snap.empty) {
        const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(fetched.filter(p => p.id !== "obsidian-emerald"));
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSlug = (text) => {
    return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingThumbnail(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();

      if (data.secure_url) {
        setNewProject({ ...newProject, img: data.secure_url });
      } else {
        alert(`Cloudinary odbijen pristup: ${data.error?.message || 'Nepoznata greška'}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Sistemska greška pri konekciji sa Cloudinary serverom.");
    } finally {
      setIsUploadingThumbnail(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProject.title) return alert("Project Title is required!");
    setIsSaving(true);

    try {
      const projectId = createSlug(newProject.title);
      const docRef = doc(db, "v10_projects", projectId);

      const projectData = {
        title: newProject.title,
        engine: newProject.engine,
        img: newProject.img,
        ratio: newProject.ratio,
        createdAt: serverTimestamp(),
        description: "New project initialized. Ready for engineering phases.",
        phases: [] 
      };

      await setDoc(docRef, projectData);
      setProjects(prev => [{ id: projectId, ...projectData }, ...prev]);
      setIsModalOpen(false);
      setNewProject({ title: '', engine: 'V10 Ultra-Print', img: '', ratio: 'aspect-video' });
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (projectId, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm("V10 Upozorenje: Da li ste sigurni da želite trajno obrisati ovaj projekat iz baze?")) {
      try {
        await deleteDoc(doc(db, "v10_projects", projectId));
        
        // Ako je kliknuo na brisanje "Obsidian Emerald", gasi tu specifičnu karticu
        if (projectId === "obsidian-emerald") {
          setShowObsidian(false);
        } else {
          // Za sve ostale, brise ih iz mapiranog stanja
          setProjects(prev => prev.filter(p => p.id !== projectId));
        }
      } catch (error) {
        console.error("Greška pri brisanju projekta:", error);
        alert("Sistemska greška: Nije moguće obrisati projekat.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-12 px-4 sm:px-8 relative selection:bg-orange-500 selection:text-black">
      
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.12)_0%,_transparent_50%),_radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.12)_0%,_transparent_50%)]"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-widest mb-2">V10 <span className="text-orange-500">Vault</span></h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-orange-500" /> Experimental R&D Sector
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-zinc-600 text-xs font-black uppercase tracking-widest">
            {isAdmin ? 'ADMIN ACCESS GRANTED' : `Showing: 1-${projects.length + (showObsidian ? 1 : 0)} Projects`}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 mb-16 items-start">
          
          

          {/* OSTALE KARTICE KOJE SE VUKU IZ BAZE */}
          {projects.map((project, index) => (
            <div key={index} className={`group relative rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/5 hover:border-orange-500/50 transition-all duration-300 block ${project.ratio || 'aspect-video'} shadow-xl`}>
              
              <Link to={`/ui-ux/project/${project.id}`} className="absolute inset-0 z-10 cursor-pointer">
                <div className="absolute inset-0 bg-zinc-900 group-hover:scale-105 transition-transform duration-700">
                  {project.img ? (
                    <img src={project.img} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <ImageIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent p-6 flex flex-col justify-end">
                  <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-1 drop-shadow-md">{project.engine}</span>
                  <h3 className="text-white text-xl font-black uppercase tracking-wider drop-shadow-lg">{project.title}</h3>
                </div>
              </Link>

              {isAdmin && (
                <button 
                  onClick={(e) => handleDeleteProject(project.id, e)}
                  className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-500 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-white/10 hover:scale-110 cursor-pointer"
                  title="Obriši projekat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

            </div>
          ))}

          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative rounded-2xl overflow-hidden bg-black/50 border-2 border-dashed border-orange-500/30 hover:border-orange-500 transition-all duration-300 aspect-video flex flex-col items-center justify-center cursor-pointer shadow-[0_0_0_rgba(249,115,22,0)] hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500/10 group-hover:bg-orange-500 flex items-center justify-center transition-colors duration-300 mb-4">
                <Plus className="w-8 h-8 text-orange-500 group-hover:text-black transition-colors" />
              </div>
              <span className="text-orange-500 font-black uppercase tracking-widest text-sm group-hover:scale-105 transition-transform">Initialize Project</span>
            </button>
          )}

        </div>

        <div className="flex justify-center items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-black border border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-orange-500 transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500 border border-orange-500 text-black font-black text-xs transition-colors">1</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-black border border-zinc-800 text-zinc-500 hover:border-orange-500 hover:text-orange-500 transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && isAdmin && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.95, y: 20 }} 
              className="bg-[#0a0a0a] border border-orange-500/30 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-[0_0_100px_rgba(249,115,22,0.15)] relative"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center"><Plus className="w-5 h-5 text-orange-500" /></div>
                <h2 className="text-xl font-black text-white uppercase tracking-widest">New Project</h2>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Project Title</label>
                  <input 
                    type="text" 
                    value={newProject.title} 
                    onChange={e => setNewProject({...newProject, title: e.target.value})} 
                    className="bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" 
                    placeholder="e.g. Tom Ford Oud Wood" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Engine / Technology Tag</label>
                  <input 
                    type="text" 
                    value={newProject.engine} 
                    onChange={e => setNewProject({...newProject, engine: e.target.value})} 
                    className="bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" 
                    placeholder="e.g. V10 Ultra-Print" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex justify-between">
                    <span>Thumbnail URL</span>
                    <span className="text-orange-500">Auto Upload Active</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      value={newProject.img} 
                      onChange={e => setNewProject({...newProject, img: e.target.value})} 
                      className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors" 
                      placeholder="https://..." 
                    />
                    <label className="shrink-0 flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer text-white px-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-colors">
                      {isUploadingThumbnail ? <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> : <UploadCloud className="w-4 h-4" />}
                      {isUploadingThumbnail ? 'Uploading...' : 'Upload File'}
                      <input type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Thumbnail Format (Ratio)</label>
                  <div className="relative">
                    <select 
                      value={newProject.ratio} 
                      onChange={e => setNewProject({...newProject, ratio: e.target.value})} 
                      className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="aspect-video">16:9 (Cinematic / Landscape) - Standard</option>
                      <option value="aspect-[21/9]">21:9 (Ultrawide / Hero)</option>
                      <option value="aspect-[3/2]">3:2 (Classic Photo Landscape)</option>
                      <option value="aspect-square">1:1 (Square) - Za proizvode (npr. Creed)</option>
                      <option value="aspect-[4/5]">4:5 (Portrait) - Instagram stil (npr. Tom Ford)</option>
                      <option value="aspect-[2/3]">2:3 (Classic Photo Portrait)</option>
                      <option value="aspect-[9/16]">9:16 (Vertical / Reels / TikTok)</option>
                      <option value="aspect-auto">Auto (Zadrži originalni format slike)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCreateProject} 
                  disabled={isSaving || isUploadingThumbnail} 
                  className="mt-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white font-black uppercase tracking-widest p-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save className="w-5 h-5" /> Initialize Project</>}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VaultGrid;
// --- KRAJ FUNKCIJE: VaultGrid ---