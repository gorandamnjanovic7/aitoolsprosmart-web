// POČETAK FAJLA: V8PromptEngine.jsx
import React, { useState, useRef } from 'react';
import { Upload, FileImage, Clock, Wand2, MonitorPlay, Smartphone, Settings2, X, Diamond, Lock } from 'lucide-react';
import MagneticButton from './MagneticButton'; 

const V8PromptEngine = ({ engineName = "SEEDANCE 2.0" }) => {
  // POČETAK FUNKCIJE: V8PromptEngine
  const [promptText, setPromptText] = useState('');
  const [duration, setDuration] = useState('5s');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [arLocked, setArLocked] = useState(false); 
  
  // Drag & Drop state
  const [dragActive, setDragActive] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageDescription, setImageDescription] = useState(''); 
  
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef(null);

  // Logika za međusobno isključivanje polja
  const isImageModeActive = !!imageFile || imageDescription.length > 0;
  const isTextModeActive = promptText.length > 0;

  const handleDrag = (e) => {
    // POČETAK FUNKCIJE: handleDrag
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
    // KRAJ FUNKCIJE: handleDrag
  };

  const handleDrop = (e) => {
    // POČETAK FUNKCIJE: handleDrop
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (!isTextModeActive && e.dataTransfer.files && e.dataTransfer.files[0]) {
      ucitajSliku(e.dataTransfer.files[0]);
    }
    // KRAJ FUNKCIJE: handleDrop
  };

  const handleChange = (e) => {
    // POČETAK FUNKCIJE: handleChange
    e.preventDefault();
    if (!isTextModeActive && e.target.files && e.target.files[0]) {
      ucitajSliku(e.target.files[0]);
    }
    // KRAJ FUNKCIJE: handleChange
  };

  const ucitajSliku = (file) => {
    // POČETAK FUNKCIJE: ucitajSliku
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      
      const img = new Image();
      img.onload = () => {
        if (img.width >= img.height) {
          setAspectRatio('16:9');
        } else {
          setAspectRatio('9:16');
        }
        setArLocked(true); 
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    // KRAJ FUNKCIJE: ucitajSliku
  };

  const obrisiSliku = () => {
    // POČETAK FUNKCIJE: obrisiSliku
    setImageFile(null);
    setImagePreview(null);
    setImageDescription('');
    setArLocked(false); 
    // KRAJ FUNKCIJE: obrisiSliku
  };

  // POČETAK FUNKCIJE: generisiMasterPrompt
  const generisiMasterPrompt = async () => {
    setIsGenerating(true);
    
    // Pakujemo sve parametre iz UI-ja (tekst, sliku, trajanje, format i Koji motor palimo)
    const formData = new FormData();
    formData.append('engine', engineName); // "SEEDANCE 2.0" ili "KLING 3.0"
    formData.append('text', isImageModeActive ? imageDescription : promptText);
    formData.append('duration', duration);
    formData.append('aspectRatio', aspectRatio);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      // PRAVI UDARAC: Palimo produkcioni Railway server!
      const response = await fetch('https://aitoolsprosmart-becend-production.up.railway.app/api/v8-generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error("V8 Server Error");

      // Dobijamo 5 kilometarskih promptova u JSON formatu nazad
      const data = await response.json();
      
      // PROVERI KONZOLU - Ovde stižu rezultati od Pythona
      console.log("V8 MASTER PROMPT REZULTAT:", data);
      alert("Prompts generated successfully! Check Console."); // Privremeni alert dok ne odradimo modal za prikaz
      
    } catch (error) {
      console.error("V8 Engine failure:", error);
      alert("Greška na serveru, proveri konekciju.");
    } finally {
      setIsGenerating(false);
    }
  };
  // KRAJ FUNKCIJE: generisiMasterPrompt

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-5xl mx-auto mt-10 relative overflow-hidden">
      
      {/* Pozadinski sjaj */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-10 relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 flex items-center justify-center gap-3">
          {engineName === "KLING 3.0" ? <Settings2 className="text-red-500 w-10 h-10" /> : <MonitorPlay className="text-green-500 w-10 h-10" />}
          {engineName} <span className="text-[#FF8C00]">ENGINE</span>
        </h2>
        <p className="text-zinc-400 font-bold tracking-widest text-[11px] uppercase">
          Generate Kilometric, Ready-To-Use Blockbuster Prompts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16">
        
        {/* LEVA KOLONA: Tekst i Slika */}
        <div className="flex flex-col gap-8">
          
          {/* 1. DRAG & DROP ZONA + OPIS */}
          <div className={`flex flex-col gap-3 transition-all ${isTextModeActive ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
            <label className="text-[#FF8C00] font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
              <FileImage size={14} /> 1. IMAGE-TO-VIDEO MODE
            </label>
            
            <div 
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${dragActive ? 'border-[#FF8C00] bg-[#FF8C00]/10' : 'border-white/20 bg-black/50 hover:border-[#FF8C00]/50'} ${imagePreview ? 'border-solid border-[#FF8C00]/50 p-2' : 'h-48'}`}
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
            >
              <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={isTextModeActive} />
              
              {imagePreview ? (
                <div className="relative w-full h-48 group rounded-xl overflow-hidden">
                  <img src={imagePreview} alt="Uploaded prep" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    {/* CRVENI X ZA BRISANJE SLIKE */}
                    <button onClick={obrisiSliku} className="bg-red-600/90 text-white p-3 rounded-full hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.6)] hover:scale-110">
                      <X size={28} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 cursor-pointer" onClick={() => !isTextModeActive && inputRef.current.click()}>
                  <div className="bg-white/5 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {isTextModeActive ? 'LOCKED (Text Mode Active)' : 'Drag & Drop your reference image here'}
                    </p>
                    {!isTextModeActive && <p className="text-zinc-500 text-xs mt-1">or click to browse files</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Kratak opis slike + CRVENI X */}
            <div className="relative mt-1">
              <input 
                type="text"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                disabled={isTextModeActive}
                placeholder="Briefly describe what happens to this image..."
                className="bg-black/50 border border-white/10 p-4 pr-12 rounded-xl text-[13px] text-white outline-none focus:border-[#FF8C00] transition-all w-full shadow-inner disabled:bg-black/80"
              />
              {imageDescription && !isTextModeActive && (
                <button 
                  onClick={() => setImageDescription('')} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-all"
                  title="Clear description"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

          {/* 2. TEXT INPUT ZONA + CRVENI X */}
          <div className="flex flex-col gap-3">
            <label className={`font-black text-[11px] tracking-widest uppercase flex items-center gap-2 transition-colors ${isImageModeActive ? 'text-zinc-600' : 'text-[#FF8C00]'}`}>
              <Wand2 size={14} /> 2. TEXT-TO-VIDEO VISION
            </label>
            <div className="relative">
              <textarea 
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                disabled={isImageModeActive}
                placeholder={isImageModeActive ? "LOCKED: You are using Image-to-Video mode. Please clear the image above to use pure text mode." : "Describe the action... (e.g. A hyper-realistic Roman legion marching through heavy rain...)"}
                className={`bg-black/50 border p-5 pr-12 rounded-2xl text-[14px] text-white outline-none resize-none h-32 transition-all w-full shadow-inner ${isImageModeActive ? 'border-red-900/30 opacity-40 cursor-not-allowed bg-black/80' : 'border-white/10 focus:border-[#FF8C00]'}`}
              />
              {promptText && !isImageModeActive && (
                <button 
                  onClick={() => setPromptText('')} 
                  className="absolute right-3 top-4 text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-1.5 rounded-full transition-all"
                  title="Clear text"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* DESNA KOLONA: Parametri i Dugme */}
        <div className="flex flex-col gap-8">
          
          {/* TRAJANJE VIDEA */}
          <div className="flex flex-col gap-3">
            <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
              <Clock size={14} /> 3. VIDEO DURATION
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['3s', '5s', '10s', '15s'].map((sec) => (
                <button 
                  key={sec} onClick={() => setDuration(sec)}
                  className={`py-3 rounded-xl font-black text-[12px] transition-all border ${duration === sec ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00] shadow-[0_0_15px_rgba(255,140,0,0.2)]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'}`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* FORMAT SLIKE */}
          <div className="flex flex-col gap-3">
             <label className="text-zinc-400 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
               <MonitorPlay size={14} /> 4. ASPECT RATIO {arLocked && <Lock size={12} className="text-red-500 inline ml-1" title="Locked by Image Dimensions" />}
             </label>
             <div className="flex gap-2">
                <button 
                  onClick={() => !arLocked && setAspectRatio('16:9')} 
                  disabled={arLocked && aspectRatio !== '16:9'}
                  className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '16:9' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '16:9' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}
                >
                  <MonitorPlay size={16} /> 16:9 CINEMATIC
                </button>
                <button 
                  onClick={() => !arLocked && setAspectRatio('9:16')} 
                  disabled={arLocked && aspectRatio !== '9:16'}
                  className={`flex-1 py-4 rounded-xl font-black text-[11px] uppercase flex items-center justify-center gap-2 transition-all border ${aspectRatio === '9:16' ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00]' : 'bg-black border-white/10 text-zinc-500 hover:border-white/30'} ${arLocked && aspectRatio !== '9:16' ? 'opacity-20 cursor-not-allowed bg-black border-transparent' : ''}`}
                >
                  <Smartphone size={16} /> 9:16 VERTICAL
                </button>
             </div>
             {arLocked && <p className="text-red-500 text-[10px] uppercase font-bold tracking-wider mt-1 text-right">🔒 AR Locked by source image</p>}
          </div>

          {/* GENERATE DUGME */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <button 
              onClick={generisiMasterPrompt}
              disabled={isGenerating || (!promptText && !imageFile)}
              className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-[16px] uppercase tracking-widest py-5 rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              {isGenerating ? 'COMPILING META-TOKENS...' : 'GENERATE 5 MASTER PROMPTS'} <Settings2 size={20} className={isGenerating ? "animate-spin" : ""} />
            </button>
          </div>

        </div>
      </div>

      {/* LIFETIME LICENSE SECTION */}
      <div className="grid md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-16 relative z-10">
          <div className="flex flex-col justify-center">
              <h3 className="text-4xl font-black italic uppercase text-white mb-4">LIFETIME <span className="text-orange-500 font-black">ACCESS</span></h3>
              <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px]">Single purchase. Endless generations. Own the {engineName}.</p>
          </div>
          <div className="md:col-span-2 bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-blue-950/40 border border-blue-500/50 p-10 rounded-[3rem] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-[0_20px_50px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-6 relative z-10">
                 <div className="p-4 bg-blue-500/20 rounded-3xl border border-blue-400/30">
                    <Diamond className="w-14 h-14 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-bounce" />
                 </div>
                 <div>
                     <span className="text-orange-500 font-black uppercase text-[11px] tracking-[0.3em]">ONE-TIME PURCHASE</span>
                     <h4 className="text-white font-black uppercase text-3xl tracking-tighter">V8 <span className="text-blue-400">PRO</span> LICENSE</h4>
                 </div>
              </div>
              <div className="flex flex-col items-center md:items-end relative z-10">
                  <div className="flex items-end gap-2">
                      <span className="text-white font-black font-mono text-6xl">$149</span>
                  </div>
                  <MagneticButton>
                      <button className="mt-6 bg-white text-black px-10 py-4 rounded-full font-black uppercase tracking-[0.2em] text-[11px] hover:bg-yellow-400 hover:text-black transition-all shadow-xl flex items-center gap-2">
                          SECURE CHECKOUT 🍋
                      </button>
                  </MagneticButton>
              </div>
          </div>
      </div>

    </div>
  );
  // KRAJ FUNKCIJE: V8PromptEngine
};

export default V8PromptEngine;
// KRAJ FAJLA: V8PromptEngine.jsx