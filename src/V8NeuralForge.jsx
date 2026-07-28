// POČETAK FAJLA: V8NeuralForge.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Droplet, Sun, Lock, Unlock, Zap, ChevronRight, CheckCircle2, ShieldCheck, Terminal, Layers, Copy } from 'lucide-react';
import { playV8Sound } from './App'; 
import { auth } from './firebase'; // 🔥 FIREBASE AUTH ZA ADMINA 🔥
import { onAuthStateChanged } from "firebase/auth";

// 🔥 NAPREDNI REČNICI ZA GENERISANJE PROMPTOVA 🔥
const PROMPT_DNA = {
  materials: {
    frosted_glass: "hyper-realistic dark frosted glass, translucent sub-surface scattering, micro-roughness, dark mode UI aesthetic",
    matte_obsidian: "pitch black matte obsidian, light-absorbing surface, sleek stealth aesthetic, ultra-premium dark texture",
    dark_titanium: "anodized dark gunmetal titanium, brushed industrial metal, subtle edge wear, physically based rendering (PBR)",
    liquid_gold: "dark liquid gold accents, high-end luxury tech aesthetic, subtle anisotropic reflections, 8k specular maps"
  },
  geometries: {
    dark_laptop: "floating sleek premium laptop mockup, blank black screen, dark studio desk environment, shallow depth of field",
    dark_billboard: "massive urban advertising billboard mockup, midnight city street environment, illuminated empty dark canvas, cinematic night photography",
    dark_wall: "blank dark concrete gallery wall mockup, industrial modern architecture, dramatic dark shadows, architectural display template",
    dark_mobile: "floating flagship smartphone mockup, dark matte glass finish, edge-to-edge blank screen, pitch void presentation space",
    abstract_torus: "mathematically perfect floating dark torus, topological 3d structure, smooth organic curves, pure black background",
    monolith: "imposing monolithic rectangular prism mockup, brutalist dark architecture, sharp 90-degree bevels, minimal dark mood"
  },
  lighting: {
    cinematic_amber: "volumetric amber studio lighting, dramatic chiaroscuro, warm rim light, softbox diffusion, cinematic dark grading",
    cyberpunk_neon: "subtle neon pink and cyan rim lights, high contrast dark environment, wet surface reflections, futuristic night lighting",
    harsh_spotlight: "single dramatic harsh spotlight, heavy stark shadows, low-key lighting, moody dark aesthetic, absolute black background",
    deep_ocean: "bioluminescent deep ocean blue highlights, atmospheric dark fog, cold tech color palette, mysterious shadows"
  },
  cameras: [
    "Shot on Hasselblad H6D-100c, 100mm f/2.8 macro lens",
    "Shot on ARRI Alexa 65, IMAX 70mm lens",
    "Sony A7R IV, 90mm macro G OSS, sharp center focus",
    "RED Monstro 8K VV, Leica Thalia 120mm lens"
  ],
  engines: [
    "Octane Render, path tracing, insanely detailed",
    "Unreal Engine 5.3, Lumen global illumination, Nanite geometry",
    "Maxon Cinema 4D, Redshift render, multi-pass compositing",
    "Blender V-Ray, realistic light bounces, 32-bit EXR workflow"
  ]
};

// 🔥 LOKALNE SLIKE 🔥
const PREVIEW_MAP = {
  dark_laptop: "/dark_laptop.jpg", 
  dark_mobile: "/dark_mobile.jpg", 
  dark_wall: "/dark_wall.jpg", 
  dark_billboard: "/dark_billboard.jpg", 
  monolith: "/monolith.jpg", 
  abstract_torus: "/abstract_torus.jpg" 
};

const OPTIONS = {
  materials: [
    { id: 'matte_obsidian', name: 'Matte Obsidian', desc: 'Pitch black & sleek' },
    { id: 'dark_titanium', name: 'Dark Titanium', desc: 'Industrial metal' },
    { id: 'frosted_glass', name: 'Frosted Glass', desc: 'Dark UI translucent' },
    { id: 'liquid_gold', name: 'Gold Accents', desc: 'Premium luxury details' }
  ],
  geometries: [
    { id: 'dark_laptop', name: 'Laptop Mockup', desc: 'Dark Studio Desk' },
    { id: 'dark_billboard', name: 'Billboard Mockup', desc: 'Midnight Urban City' },
    { id: 'dark_wall', name: 'Concrete Wall', desc: 'Industrial Gallery' },
    { id: 'dark_mobile', name: 'Mobile Mockup', desc: 'Pitch Void Device' },
    { id: 'monolith', name: 'Brutalist Monolith', desc: 'Heavy Dark Architecture' },
    { id: 'abstract_torus', name: 'Abstract Torus', desc: 'Floating 3D Element' }
  ],
  lighting: [
    { id: 'harsh_spotlight', name: 'Harsh Spotlight', desc: 'Heavy dark mode shadows' },
    { id: 'cinematic_amber', name: 'Cinematic Amber', desc: 'Warm luxury low-key' },
    { id: 'cyberpunk_neon', name: 'Cyberpunk Neon', desc: 'Subtle neon contrasts' },
    { id: 'deep_ocean', name: 'Deep Ocean Blue', desc: 'Dark tech & security vibe' }
  ]
};

export default function V8NeuralForge({ openCheckout }) {
  const [config, setConfig] = useState({
    material: 'matte_obsidian',
    geometry: 'dark_laptop',
    lighting: 'harsh_spotlight'
  });

  const [status, setStatus] = useState('idle'); 
  const [progress, setProgress] = useState(0);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [currentImage, setCurrentImage] = useState("/dark_laptop.jpg"); 
  const [copied, setCopied] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 PROVERA DA LI JE ULOGOVAN GORAN 🔥
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && (user.email.toLowerCase() === "damnjanovicgoran7@gmail.com" || user.email.toLowerCase() === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSelect = (category, id) => {
    if (status === 'generating') return;
    setConfig(prev => ({ ...prev, [category]: id }));
    setStatus('idle'); 
  };

  const buildComplexPrompt = () => {
    const mat = PROMPT_DNA.materials[config.material];
    const geo = PROMPT_DNA.geometries[config.geometry];
    const light = PROMPT_DNA.lighting[config.lighting];
    
    const randomCamera = PROMPT_DNA.cameras[Math.floor(Math.random() * PROMPT_DNA.cameras.length)];
    const randomEngine = PROMPT_DNA.engines[Math.floor(Math.random() * PROMPT_DNA.engines.length)];
    const randomSeed = Math.floor(Math.random() * 999999999);

    return `/imagine prompt: Cinematic commercial photography of a ${geo}. The subject features fine elements of ${mat}. Immersed in a predominantly dark environment, low-key lighting, absolute dark aesthetic. Front-facing straight-on camera angle, perfectly centered composition, flat perspective looking directly at the lens. ${light}. ${randomCamera}, highly detailed, sharp center focus. Rendered in ${randomEngine}, 8k resolution, photorealistic premium design asset --ar 16:9 --style raw --seed ${randomSeed} --v Google Nano Banana 2`;
  };

  const handleGenerate = () => {
    setStatus('generating');
    setProgress(0);
    setCopied(false);
    playV8Sound('checkout'); 

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 5; 
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setGeneratedPrompt(buildComplexPrompt());
          setCurrentImage(`/${config.geometry}.jpg`); 
          setStatus('done');
          playV8Sound('success');
        }, 400);
      }
      setProgress(currentProgress);
    }, 150);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const OptionGrid = ({ category, icon: Icon, title, options }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
        <Icon className="w-4 h-4 text-cyan-500" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map(opt => {
          const isSelected = config[category] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(category, opt.id)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                isSelected 
                  ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                  : 'bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/5'
              }`}
            >
              {isSelected && <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>}
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-cyan-400' : 'text-zinc-300'}`}>
                  {opt.name}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
              </div>
              <span className="text-[10px] text-zinc-500">{opt.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-16 border-l-4 border-cyan-500 pl-6">
          <div className="inline-block border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 rounded-full text-[10px] font-black text-cyan-400 tracking-widest uppercase mb-4 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            Algorithmic Blueprints
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 leading-none">
            V10 Neural <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Forge</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl font-light">
            Engineer hyper-realistic Dark Mode mockups and abstract UI/UX structures. Select your parameters below and the V10 Engine will mathematically forge a master Google Nano Banana 2 blueprint. 150MP premium assets on demand.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* KONTROLE */}
          <div className="lg:col-span-7 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            
            <OptionGrid category="material" icon={Droplet} title="1. Base Material Finish" options={OPTIONS.materials} />
            <OptionGrid category="geometry" icon={Layers} title="2. Target Canvas (Mockup / 3D)" options={OPTIONS.geometries} />
            <OptionGrid category="lighting" icon={Sun} title="3. Dark Lighting Protocol" options={OPTIONS.lighting} />

            <div className="pt-4 border-t border-white/10 mt-8 relative z-10">
              <button 
                onClick={handleGenerate}
                disabled={status === 'generating'}
                className="w-full bg-gradient-to-r from-zinc-200 to-white text-black font-black uppercase tracking-widest text-sm py-5 rounded-xl hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Terminal className="w-5 h-5" />
                {status === 'generating' ? 'Synthesizing Blueprint...' : 'Generate Neural Blueprint'}
              </button>
            </div>
          </div>

          {/* REZULTAT */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Zap className={`w-4 h-4 ${status === 'done' ? 'text-cyan-400' : 'text-zinc-600'}`} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white">Output Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${status === 'idle' ? 'bg-zinc-600' : status === 'generating' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">
                    {status === 'idle' ? 'AWAITING' : status === 'generating' ? 'PROCESSING' : 'SECURE'}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center items-center relative">
                
                <AnimatePresence mode="wait">
                  {status === 'idle' && (
                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                      <Monitor className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                      <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Select mockup parameters.</p>
                    </motion.div>
                  )}

                  {status === 'generating' && (
                    <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full max-w-xs mx-auto text-center">
                      <div className="flex justify-between text-[10px] font-mono text-cyan-400 mb-2 uppercase tracking-widest">
                        <span>Compiling Mockup Data</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_15px_rgba(6,182,212,0.6)] transition-all duration-200" style={{ width: `${progress}%` }}></div>
                      </div>
                    </motion.div>
                  )}

                  {status === 'done' && (
                    <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full flex flex-col items-center">
                      
                      <div className="w-full aspect-video bg-zinc-900 rounded-xl mb-6 relative overflow-hidden border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)] flex items-center justify-center">
                        <img 
                          src={currentImage} 
                          onError={(e) => { e.target.src = '/magnific_a-sharp-geometric-arrange_2994487710.png' }} 
                          alt="Preview" 
                          className="w-full h-full object-cover filter brightness-90 contrast-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 flex items-center gap-2">
                           <ShieldCheck className="w-4 h-4 text-cyan-400" />
                           <span className="text-[9px] font-black uppercase tracking-widest text-cyan-400">150MP Mockup Architecture</span>
                        </div>
                      </div>

                      <div className="w-full bg-[#050505] border border-cyan-500/30 rounded-xl p-5 relative shadow-inner">
                        <div className="absolute -top-3 left-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.5)]">
                          Google Nano Banana 2 Protocol
                        </div>
                        
                        {/* 🔥 ADMIN VIDI ČISTO, KLIJENT VIDI ZAMUĆENO 🔥 */}
                        <p className={`font-mono text-[11px] leading-relaxed mt-2 text-justify select-all ${isAdmin ? 'text-cyan-100 blur-none opacity-100' : 'text-zinc-300 blur-[4px] opacity-60'}`}>
                          {generatedPrompt}
                        </p>

                        {/* 🔥 KATANAC SE PRIKAZUJE SAMO KLIJENTU 🔥 */}
                        {!isAdmin && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl border border-cyan-500/10">
                            <Lock className="w-8 h-8 text-cyan-400 mb-3 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            <span className="text-white font-black text-sm uppercase tracking-widest">Protocol Encrypted</span>
                            <span className="text-zinc-400 font-medium text-[10px] mt-1 uppercase tracking-wider">Purchase to reveal dark architecture</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 🔥 DUGMAD ISPOD REZULTATA 🔥 */}
              <div className="mt-8">
                {status === 'idle' || status === 'generating' ? (
                  <div className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center bg-white/5 text-zinc-600 border border-white/5 cursor-not-allowed">
                    Awaiting Generation
                  </div>
                ) : isAdmin ? (
                  // 🔥 ADMIN DUGME ZA KOPIRANJE 🔥
                  <button
                    onClick={handleCopyPrompt}
                    className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-transform duration-300 bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02] cursor-pointer"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'PROMPT COPIED TO CLIPBOARD!' : 'COPY MASTER PROMPT'}
                  </button>
                ) : (
                  // 🔥 KLIJENT DUGME ZA NAPLATU ($7) 🔥
                  <button 
                    onClick={() => openCheckout && openCheckout(`Neural Forge: Dark Mockup Protocol`, 7)}
                    className="w-full py-4 rounded-xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-transform duration-300 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-[1.02] cursor-pointer"
                  >
                    <Unlock className="w-4 h-4" /> Unlock Master Blueprint - $7
                  </button>
                )}
              </div>

            </div>

            <div className="flex items-start gap-3 p-4 bg-cyan-900/10 border border-cyan-500/20 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.05)]">
              <ShieldCheck className="w-6 h-6 text-cyan-500 shrink-0" />
              <p className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider leading-relaxed">
                Purchasing unlocks the exact, highly-detailed dark mode engineering prompt including front-facing camera angles, render engine parameters, and material indices used by the V10 architecture.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: V8NeuralForge.jsx