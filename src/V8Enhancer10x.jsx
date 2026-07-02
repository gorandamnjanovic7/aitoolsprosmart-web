// POČETAK FAJLA: V8Enhancer10x.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // 🔥 DODATO: Za zakucavanje modala na centar ekrana
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async'; // 🔥 DODATO ZA SEO 🔥
import { Zap, Loader2, Eye, Trash2, UploadCloud, Dices, History, Lock, X, PlayCircle, ShieldAlert, ChevronLeft, DownloadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// FIREBASE
import { db, auth } from './firebase';
import { signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider } from "firebase/auth";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, onSnapshot, addDoc } from "firebase/firestore";

// DATA & TOAST
import * as data from './data';
import { v8Toast } from './v8Utils';
import LoginRequiredModal from './LoginRequiredModal';

// --- V8 SENZOR ZA AUTOMATSKU DETEKCIJU SERVERA ---
const BASE_BACKEND_URL = window.location.hostname === 'localhost' 
  ? "http://localhost:8000" 
  : "https://aitoolsprosmart-becend-production.up.railway.app";

/// POČETAK POMOĆNIH KOMPONENTI ZA ENHANCER ///
const ScrambleText = ({ text }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!text) { setDisplayed(''); return; }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#';
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayed(text.split('').map((char, index) => {
        if(index < iteration) return char;
        if(char === ' ' || char === '\n') return char;
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (iteration >= text.length) clearInterval(interval);
      iteration += text.length > 500 ? 6 : text.length > 100 ? 3 : 1;
    }, 25);
    return () => clearInterval(interval);
  }, [text]);
  return <span>{displayed || "WAITING FOR CORE INPUT..."}<span className="animate-pulse opacity-50 text-orange-500">_</span></span>;
};

const RippleButton = ({ children, onClick, disabled, className }) => {
  const [ripples, setRipples] = useState([]);
  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setRipples([...ripples, { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    if (onClick) onClick(e);
  };
  return (
    <button type="button" onClick={handleClick} disabled={disabled} className={`relative overflow-hidden ${className}`}>
      <span className="relative z-10 flex items-center justify-center">{children}</span>
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span key={r.id} initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 4, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="absolute bg-white/40 rounded-full pointer-events-none z-0" style={{ left: r.x, top: r.y, width: 100, height: 100, marginTop: -50, marginLeft: -50 }} onAnimationComplete={() => setRipples(prev => prev.filter(rip => rip.id !== r.id))} />
        ))}
      </AnimatePresence>
    </button>
  );
};

const OptionButton = ({ label, selected, onClick, type, disabled }) => {
  const isQuality = type === 'quality';
  const activeClass = isQuality ? "bg-orange-600 border-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]";
  return <button type="button" disabled={disabled} onClick={onClick} className={`px-4 py-2 rounded-lg text-[9px] font-black border transition-all ${selected ? activeClass : "bg-black border-white/10 text-zinc-500 hover:border-white/20 hover:text-white"} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{label}</button>;
};
/// KRAJ POMOĆNIH KOMPONENTI ZA ENHANCER ///

/// POČETAK FUNKCIJE: V8Enhancer10x ///
const V8Enhancer10x = () => {
  // --- STATE JEZGRO ---
  const [demoInput, setDemoInput] = useState(''); 
  const [customerPrompt, setCustomerPrompt] = useState(''); 
  const [prikaziPlaviPopUp, setPrikaziPlaviPopUp] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState({ single: '', abstract: '', cinematic: '', photoreal: '', uniquePhoto: '' }); 
  const [isEnhancing, setIsEnhancing] = useState(false); 
  const [isScanning, setIsScanning] = useState(false);
  const [selectedAR, setSelectedAR] = useState('16:9'); 
  const [selectedQuality, setSelectedQuality] = useState('4x'); 
  const [copiedBox, setCopiedBox] = useState(''); 
  const [isRolling, setIsRolling] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false); 
  const [gallery, setGallery] = useState([]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const containerRef = useRef();

  const [isVIP, setIsVIP] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [vipHistory, setVipHistory] = useState([]);
  const [lemonLink, setLemonLink] = useState("");

  const [loginRequiredData, setLoginRequiredData] = useState({
    isOpen: false,
    tip: '',
    cena: 0
  });

  // 🔥 DODATO: Zaključavanje ekrana da ne mrda kad se otvori modal 🔥
  useEffect(() => {
    if (showPaymentModal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPaymentModal]);

  // --- VIP AUTENTIFIKACIJA & LEMON SQUEEZY LINK ---
  useEffect(() => {
    const unsubLemon = onSnapshot(doc(db, "v8_settings", "lemon_checkout"), (docSnap) => {
        if (docSnap.exists()) {
            setLemonLink(docSnap.data().optimizer || "");
        }
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email ? user.email.toLowerCase() : "";
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
          setIsVIP(true); v8Toast.success("Welcome back, Master Goran!"); loadHistory(email);
        } else {
          try {
            const docRef = doc(db, "vip_users", email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes('FULL_ACCESS') || docSnap.data().unlockedApps.includes('10X_ENHANCER'))) { 
              setIsVIP(true); v8Toast.success("Premium Access Granted!"); loadHistory(email); 
            } else { setIsVIP(false); }
          } catch(e) { setIsVIP(false); }
        }
      } else { setIsVIP(false); setVipHistory([]); }
    });
    return () => { unsubscribe(); unsubLemon(); };
  }, []);

  const loadHistory = (email) => {
    const saved = localStorage.getItem(`v8_history_${email}`);
    if(saved) setVipHistory(JSON.parse(saved));
  };

  const saveToHistory = (promptText, typeLabel) => {
    if(!auth.currentUser) return;
    const email = auth.currentUser.email;
    const newItem = { id: Date.now(), text: promptText, type: typeLabel, date: new Date().toLocaleString() };
    const updated = [newItem, ...vipHistory].slice(0, 10); 
    setVipHistory(updated);
    localStorage.setItem(`v8_history_${email}`, JSON.stringify(updated));
  };

  const handleDeleteHistoryItem = (id) => {
    const updatedHistory = vipHistory.filter(item => item.id !== id);
    setVipHistory(updatedHistory);
    if (auth.currentUser) {
      localStorage.setItem(`v8_history_${auth.currentUser.email}`, JSON.stringify(updatedHistory));
    }
    v8Toast.success("Removed from V8 Vault!");
  };

  const handlePremiumLogin = async (e) => {
    if (e) e.preventDefault();
    try {
      const v8Provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, v8Provider);
      const user = result.user;
      const email = user.email ? user.email.toLowerCase() : "";
      
      if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
        setIsVIP(true);
      } else {
        const docRef = doc(db, "vip_users", email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().unlockedApps && (docSnap.data().unlockedApps.includes('FULL_ACCESS') || docSnap.data().unlockedApps.includes('10X_ENHANCER'))) { setIsVIP(true); } else {
           v8Toast.error("Email not found in the premium database.");
           await signOut(auth);
        }
      }
    } catch (err) { v8Toast.error("Login failed!"); }
  };

  // 🔥 V8 BLINDIRANA FUNKCIJA ZA PLAĆANJE (SA LOGIN MODALOM) 🔥
  const openPaymentFlow = async (currentUser, tip, cena) => {
    if (!currentUser) return;

    await addDoc(collection(db, "v8_kupci"), {
      ime: currentUser.displayName || "Client",
      email: currentUser.email,
      uid: currentUser.uid,
      zeliPaket: tip,
      cenaPaketa: cena,
      vreme: serverTimestamp(),
      isPaid: false
    });

    await setDoc(doc(db, "posetioci", currentUser.uid), {
      ime: currentUser.displayName || "Client",
      email: currentUser.email,
      vremePrijave: serverTimestamp(),
      zainteresovanZa: tip,
      identitet: "V8-Client"
    }, { merge: true });

    const email = currentUser.email ? currentUser.email.toLowerCase() : "";

    if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
      setIsVIP(true);
      v8Toast.success("Access already unlocked!");
      loadHistory(email);
      return;
    }

    const docRef = doc(db, "vip_users", email);
    const docSnap = await getDoc(docRef);

    if (
      docSnap.exists() &&
      docSnap.data().unlockedApps &&
      (
        docSnap.data().unlockedApps.includes('FULL_ACCESS') ||
        docSnap.data().unlockedApps.includes('10X_ENHANCER')
      )
    ) {
      setIsVIP(true);
      v8Toast.success("Access already unlocked!");
      loadHistory(email);
      return;
    }

    if (lemonLink && lemonLink.includes("http")) {
      window.location.href = lemonLink;
    } else {
      setShowPaymentModal({ tip, cena });
    }
  };

  const handlePaymentV8 = async (tip, cena) => {
    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoginRequiredData({
          isOpen: true,
          tip,
          cena: Number(cena)
        });
        return;
      }

      await openPaymentFlow(currentUser, tip, cena);
    } catch (err) {
      console.error("V8 PAYMENT ERROR:", err);
      v8Toast.error(err.message || "Greška na sistemu za naplatu.");
    }
  };

  useGSAP(() => { if (generatedPrompts.abstract) { gsap.from('.gsap-result-box', { y: 50, opacity: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.2)', clearProps: 'all' }); } }, { dependencies: [generatedPrompts.abstract], scope: containerRef });

  useEffect(() => {
    const fetchGallery = async () => {
      try { const snapshot = await getDocs(collection(db, "enhancer_gallery")); const items = []; snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() })); setGallery(items.sort((a, b) => b.createdAt - a.createdAt)); } catch (err) {}
    }; fetchGallery();
  }, []);

  useEffect(() => { if (gallery.length <= 1) return; const interval = setInterval(() => { setActiveGalleryIndex((prev) => (prev + 1) % gallery.length); }, 15000); return () => clearInterval(interval); }, [gallery.length]);

  // --- KONTROLE ---
  const handleRollDice = (e) => { 
    if (e) e.preventDefault();
    setIsRolling(true);
    const prompts = ["golden hour above New York", "futuristic Tokyo 2080", "luxury yacht on the Mediterranean"];
    const randomText = prompts[Math.floor(Math.random() * prompts.length)];
    setDemoInput(randomText); 
    setCustomerPrompt(''); 
    setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', uniquePhoto: '' }); 
    setTimeout(() => { setIsRolling(false); }, 300);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return; setIsImageUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json(); setUploadedImage(resData.secure_url); setDemoInput(prev => prev ? `${resData.secure_url} ${prev}` : resData.secure_url);
    } catch (err) {} finally { setIsImageUploading(false); }
  };

  const handleAnalyzeImage = async (e) => {
    if (e) e.preventDefault(); if (!uploadedImage) return; setIsAnalyzingImage(true);
    try {
        const visionPrompt = "Analyze this image technically in extreme detail. Describe the subject, composition, lighting, colors, camera angle, and overall atmosphere. Do not use conversational filler. Provide the entire response STRICTLY IN ENGLISH, formatted as a continuous descriptive text suitable for an image generation prompt.";
        
        const res = await fetch(`${BASE_BACKEND_URL}/api/read-image`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ imageUrl: uploadedImage, prompt: visionPrompt }) 
        });
        
        const apiData = await res.json();
        if (apiData.result) { setDemoInput(apiData.result); setCustomerPrompt(''); v8Toast.success("Vision Analysis Complete!"); }
    } catch (err) { v8Toast.error("Vision server unavailable."); } finally { setIsAnalyzingImage(false); }
  };

  // --- V8 PRIVATNA BAZA PROMPTOVA ---
  const V8_PRESETS = {
    abstract: {
      prompts: [
        "ARRI ALEXA 35 × Sigma 35mm f/1.2 Art, ultra-detailed abstract liquid energy waves, flowing metallic forms, smooth fluid motion frozen in time, reflective surfaces, deep contrast gradients, cinematic composition, dynamic curves, energy flow visualization, non-linear motion illusion, high-end digital art, ultra high detail, photorealistic rendering, global illumination, volumetric depth subtle, soft shadow diffusion, cinematic dynamic range, realistic materials, fine texture fidelity, film_grain_35mm, halation_glow, ACEScg_color_grade, highlight_bloom, lens_microcontrast, depth_precision, realistic lens optics, natural depth of field, subtle bokeh, exposure balance, organic noise, real-world imperfections, no artificial smoothing",
        "RED RAPTOR V × Canon RF 85mm f/1.2, hyper-detailed fractal structures, recursive geometry expanding infinitely, glowing neural patterns, complex symmetry, layered dimensional space, digital intelligence core, abstract consciousness visualization, intricate detail density, ultra high detail, sharp focus, global illumination, subsurface scattering light diffusion, volumetric depth, ACEScg_color_grade, cinematic_shadow_rolloff, highlight bloom controlled, depth precision ultra, realistic optics, compression perspective, microcontrast boost, micro details preserved, organic noise, no plastic surfaces"
      ],
      suffix: "stills archive, production still, RAW render pipeline, 16-bit color depth, high fidelity render engine"
    },
    cinematic: {
      prompts: [
        "ARRI ALEXA 65 × Panavision T-Series Anamorphic 40mm, ultra cinematic dramatic scene, epic composition, layered foreground midground background, strong subject isolation, natural actor blocking, subtle motion freeze, storytelling frame, emotional intensity, atmospheric depth, ultra high detail, cinematic lighting, global illumination, volumetric light beams, soft shadow diffusion, realistic materials, dynamic range extended, film_grain_35mm, halation_glow, ACEScg_color_grade, cinematic_shadow_rolloff, highlight_bloom, lens_microcontrast, depth_precision, anamorphic lens flares, horizontal streaks, subtle distortion, realistic optics, exposure balance, organic noise, no artificial smoothing",
        "RED V-RAPTOR XL × Cooke Anamorphic/i 50mm, cinematic portrait shot, shallow depth of field, strong character presence, emotional expression, natural skin texture, storytelling lighting, controlled highlights, soft background separation, ultra high detail, subsurface scattering skin, global illumination, soft bounce light, cinematic contrast, film_grain_35mm, halation glow, ACEScg grade, highlight bloom soft, shadow rolloff smooth, lens breathing subtle, microcontrast boost, realistic lens optics, natural imperfections, organic noise, no plastic skin"
      ],
      suffix: "cinematic lighting, ultra high detail, global illumination, volumetric light subtle, cinematic dynamic range, realistic materials, film_grain_35mm, halation_glow, ACEScg_color_grade, highlight_bloom, cinematic_shadow_rolloff, lens_microcontrast, depth_precision, anamorphic lens flares subtle, realistic optics, exposure balance, organic noise, real-world imperfections, no artificial smoothing, production still, RAW capture pipeline, 16-bit color depth"
    },
    photoreal: {
      prompts: [
        "Sony A1 × 85mm f/1.4 GM, ultra realistic portrait, natural skin texture, visible pores, micro imperfections, lifelike expression, soft natural daylight, shallow depth of field, background compression, high-end photography look, ultra high detail, true photorealism, global illumination, soft shadow diffusion, realistic materials, subsurface scattering skin, fine texture fidelity, sharp focus, realistic color science, lens microcontrast, optical precision, minimal chromatic aberration, exposure balance, organic noise, real-world imperfections, no artificial smoothing, no CGI look",
        "Canon EOS R5 × RF 50mm f/1.2, candid lifestyle photo, natural moment capture, authentic human interaction, soft window light, balanced exposure, realistic tones, environmental depth, documentary style realism, ultra high detail, true photorealism, global illumination, realistic reflections, subsurface scattering skin, fine texture fidelity, sharp focus, realistic depth of field, color accuracy high, lens microcontrast, subtle distortion realistic, organic noise, real-world imperfections, no smoothing, no CGI feel"
      ],
      suffix: "preserve original composition, maintain subject integrity, no new elements, no scene alteration"
    },
    uniquePhoto: {
      prompts: [
        "ARRI ALEXA 35 × Laowa 24mm Probe Lens, impossible macro perspective inside surreal biomechanical environment, hyper-detailed textures merging organic and metallic forms, extreme depth illusion, non-euclidean geometry, visual paradox composition, alien realism, ultra high detail, photorealistic rendering, global illumination, volumetric depth, soft shadow diffusion, cinematic dynamic range, film_grain_35mm, halation_glow, ACEScg_color_grade, lens_microcontrast, depth_precision, realistic optics, organic noise, real-world imperfections, no artificial smoothing",
        "RED V-RAPTOR XL × Canon RF 28-70mm f/2, ultra unique hybrid reality scene, multiple time layers in one frame, same subject appearing in different ages simultaneously, temporal distortion, motion frozen across timelines, reality bending composition, ultra high detail, true photorealism, global illumination, subsurface scattering, cinematic lighting, dynamic range extended, film grain subtle, halation glow, highlight bloom, realistic optics, exposure balance, organic noise, no CGI feel"
      ],
      suffix: ""
    }
  };

  const buildV8Prompt = (category, baseInput, aspectRatio, imageUrl) => {
    const categoryData = V8_PRESETS[category];
    const randomPrompt = categoryData.prompts[Math.floor(Math.random() * categoryData.prompts.length)];
    const cleanPrompt = randomPrompt.replace(/,\s*$/, "");
    const finalSuffix = categoryData.suffix ? `, ${categoryData.suffix}` : "";
    const imgPrefix = imageUrl ? `${imageUrl} ` : "";

    return `${imgPrefix}A breathtaking capture of: ${baseInput}. ${cleanPrompt}${finalSuffix} --ar ${aspectRatio}`;
  };
  
  const handleEnhance = async (e, boxType) => {
    if (e) e.preventDefault();
    const rawInput = boxType === 'concept' ? demoInput.trim() : customerPrompt.trim();
    if(!rawInput) return; 
    
    if (boxType === 'prompt') setIsScanning(true);
    setIsEnhancing(true); 
    
    try {
        if (boxType === 'concept') {
            const nextState = {
              single: '',
              abstract: buildV8Prompt('abstract', rawInput, selectedAR, uploadedImage),
              cinematic: buildV8Prompt('cinematic', rawInput, selectedAR, uploadedImage),
              photoreal: buildV8Prompt('photoreal', rawInput, selectedAR, uploadedImage),
              uniquePhoto: buildV8Prompt('uniquePhoto', rawInput, selectedAR, uploadedImage)
            };
            setGeneratedPrompts(nextState);
            saveToHistory(nextState.cinematic, "Cinematic Concept");
        } else {
            const res = await fetch(`${BASE_BACKEND_URL}/api/roast`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: rawInput })
            });
            const result = await res.json();
            
            const finalPrompt = `/// V8 AI EXPERT ANALYSIS ///\n\n🟢 PROS:\nVision is solid.\n\n🔴 CONS:\nLacks professional technical depth and cinematic precision.\n\n🚀 V8 10X FINAL PROMPT:\n\n${result.enhanced_prompt} --ar ${selectedAR}`;
            
            setGeneratedPrompts({ single: finalPrompt, abstract: '', cinematic: '', photoreal: '', uniquePhoto: '' });
            saveToHistory(result.enhanced_prompt, "10X Enhanced Reconstruction");
        }
        v8Toast.success("V8 Engine Cycle Complete!");
    } catch (err) {
        v8Toast.error("Engine failure. Please check the V8 server connection.");
    } finally {
        setIsEnhancing(false); 
        setIsScanning(false); 
    }
  };
  
  const handleCopy = (text, boxName) => { 
    let copyText = text.includes("🚀 V8 10X FINAL PROMPT:\n\n") ? text.split("🚀 V8 10X FINAL PROMPT:\n\n")[1] : text;
    navigator.clipboard.writeText(copyText); 
    setCopiedBox(boxName); 
    v8Toast.success("Copied to clipboard!"); 
    setTimeout(() => setCopiedBox(''), 3000); 
  };

  const v8Stilovi = [
    { id: 'abstract', naslov: 'ABSTRACT', bojaClass: 'border-purple-500/30', textClass: 'text-purple-400', bgHover: 'hover:bg-purple-600', shadowClass: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
    { id: 'cinematic', naslov: 'CINEMATIC', bojaClass: 'border-blue-500/30', textClass: 'text-blue-400', bgHover: 'hover:bg-blue-600', shadowClass: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
    { id: 'photoreal', naslov: 'PHOTOREAL', bojaClass: 'border-emerald-500/30', textClass: 'text-emerald-400', bgHover: 'hover:bg-emerald-600', shadowClass: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]' },
    { id: 'uniquePhoto', naslov: 'UNIQUE', bojaClass: 'border-amber-500/30', textClass: 'text-amber-400', bgHover: 'hover:bg-amber-600', shadowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' }
  ];

  return (
    <div ref={containerRef} className="pt-32 pb-24 px-6 max-w-[1600px] mx-auto font-sans text-left text-white min-h-screen relative flex flex-col xl:flex-row gap-8">
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>10X AI Image Enhancer | Premium Upscaling Tool</title>
        <meta name="description" content="Use the 10X AI Enhancer to transform raw prompts into ultra-detailed, photorealistic, and cinematic visions. Generate premium commercial concepts instantly." />
        <meta name="keywords" content="10x ai image enhancer, premium prompt builder, cinematic ai generator, photorealistic ai concepts, improve ai prompts" />
      </Helmet>

      <style>{`
        @keyframes scanLineAmber { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
        .animate-scan-amber { position: absolute; left: 0; width: 100%; height: 2px; background: #fbbf24; box-shadow: 0 0 25px 3px #fbbf24; z-index: 50; animation: scanLineAmber 2.5s infinite; }
        .ray-container { position: relative; overflow: hidden; border-radius: 2rem; padding: 2px; }
        .ray-beam { position: absolute; top: 50%; left: 50%; width: 150%; height: 150%; background: conic-gradient(from 0deg, transparent 75%, rgba(251,191,36,0.8) 90%, transparent 100%); animation: raySpin 3s linear infinite; transform-origin: 0 0; z-index: 0; }
        @keyframes raySpin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }
        .ray-inner { background: rgba(10,10,10,0.95); backdrop-filter: blur(20px); border-radius: calc(2rem - 2px); position: relative; z-index: 1; height: 100%; padding: 1.5rem; display: flex; flex-direction: column; }
      `}</style>

      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData({ isOpen: false, tip: '', cena: 0 })}
        packageName={loginRequiredData.tip || "10X ENHANCER LIFETIME"}
        price={loginRequiredData.cena || 199.99}
        onLoginSuccess={async (user) => {
          const pendingTip = loginRequiredData.tip || "10X ENHANCER LIFETIME";
          const pendingCena = loginRequiredData.cena || 199.99;

          setLoginRequiredData({ isOpen: false, tip: '', cena: 0 });
          await openPaymentFlow(user, pendingTip, pendingCena);
        }}
      />

      {/* --- SIDEBAR ISTORIJA --- */}
      {isVIP && (
        <div className="hidden xl:flex w-72 flex-col bg-[#0a0a0a]/50 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 h-[calc(100vh-160px)] sticky top-32 overflow-hidden shadow-2xl shrink-0 z-20">
           <h3 className="text-orange-500 font-black uppercase text-[12px] tracking-widest flex items-center gap-2 mb-6 border-b border-orange-500/20 pb-4"><History className="w-4 h-4" /> Vault History</h3>
           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {vipHistory.map((h) => (
                <div key={h.id} className="bg-black border border-white/5 p-4 rounded-xl flex flex-col gap-2 hover:border-orange-500/30 transition-all group relative">
                  <div className="flex justify-between items-start"><span className="text-orange-400 text-[9px] font-black uppercase">{h.type}</span></div>
                  <p className="text-zinc-300 text-[10px] line-clamp-3 font-mono leading-relaxed">{h.text}</p>
                  <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { navigator.clipboard.writeText(h.text); v8Toast.success("Copied!"); }} className="text-zinc-500 hover:text-white text-[9px] uppercase font-black tracking-widest">Copy</button>
                    <button onClick={() => handleDeleteHistoryItem(h.id)} className="text-red-500 hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}

     <div className="flex-1 flex flex-col w-full">
        <div className="mb-12 text-center w-full relative z-10 flex flex-col items-center mt-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">10X PROMPT ENHANCER</h1>
          <div className="text-[12px] md:text-[14px] font-black text-green-400 uppercase tracking-[0.2em] flex items-center gap-3">Premium 3-in-1 Tool. $199.99 LIFETIME LICENSE.</div>
          
          {/* 🔥 LOKOT I DUGME ZA PLAĆANJE SA ZAKLJUČAVANJEM EVENTA 🔥 */}
          {!isVIP && (
             <div className="mt-8 p-6 bg-[#050505] border border-red-500/30 rounded-3xl flex flex-col items-center max-w-4xl mx-auto z-20 shadow-2xl">
                <Lock className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">SYSTEM IS LOCKED</h3>
                <div className="flex gap-4 w-full justify-center mb-6">
                   <RippleButton 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePaymentV8('10X ENHANCER LIFETIME', '199.99');
                      }} 
                      className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-xl font-black text-[13px] uppercase tracking-widest shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                   >
                      GET LIFETIME LICENSE ($199.99)
                   </RippleButton>
                   <button onClick={handlePremiumLogin} className="text-[10px] uppercase font-black tracking-widest text-zinc-500 hover:text-white border-b border-zinc-700">ALREADY HAVE ACCESS - LOG IN</button>
                </div>
             </div>
          )}
        </div>

        <div className="flex flex-col gap-12 w-full relative z-10">
           
           {/* --- PLAVA SEKCIJA: KONCEPT MOTOR --- */}
           <div className={`bg-[#0a0a0a]/50 backdrop-blur-md border border-blue-500/30 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] ${!isVIP ? 'opacity-50 grayscale-[50%] pointer-events-none select-none' : 'hover:border-blue-500/60 group'}`}>
              <div className="w-full text-center border-b border-blue-500/20 pb-6 mb-2"><h2 className="text-[12px] font-black uppercase text-blue-400 tracking-wider">CINEMATIC CONCEPT GENERATOR</h2></div>
              <div className="w-full flex flex-col lg:flex-row gap-8 mt-6">
                 <div className="w-full lg:w-1/3 flex flex-col text-left">
                   <label className="text-[14px] md:text-[16px] font-black uppercase text-blue-500 tracking-widest flex items-center gap-2 mb-3"><PlayCircle className="w-5 h-5" /> Concept / Subject</label>
                   <p className="text-[10px] md:text-[11px] text-white font-black uppercase mb-6">Enter an idea, roll the dice, or upload an image.</p>
                 </div>
                 
                 <div className="w-full lg:w-2/3 relative flex flex-col">
                   <div className={`relative flex flex-col rounded-2xl border border-white/10 bg-[#050505]/50 ${isVIP ? 'focus-within:border-blue-500/50' : ''}`}>
                     
                     {uploadedImage && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-lg overflow-hidden border border-blue-500/50 z-20 group/img">
                           <img src={uploadedImage} alt="Ref" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => { setUploadedImage(null); setDemoInput(prev => prev.replace(uploadedImage, '').trim()); }} className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"><X className="w-4 h-4 text-white" /></button>
                        </div>
                     )}

                     <textarea 
                        disabled={!isVIP} 
                        value={demoInput} 
                        onChange={e => { 
                          setDemoInput(e.target.value); 
                          if (e.target.value.trim().length > 0) {
                            setCustomerPrompt(''); 
                            setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', uniquePhoto: '' }); 
                          }
                        }} 
                        placeholder="e.g. 'golden hour in New York' or Upload Image..." 
                        className={`w-full flex-1 bg-transparent py-6 text-white text-[16px] outline-none resize-none min-h-[120px] ${uploadedImage ? 'pl-20 pr-28' : 'pl-6 pr-28'} ${!isVIP ? 'cursor-not-allowed' : ''}`} 
                     />
                     
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        {!demoInput && (
                           <>
                              <label className="p-2 cursor-pointer hover:scale-110 transition-transform">
                                 {isImageUploading ? <Loader2 className="w-6 h-6 animate-spin text-blue-400" /> : <UploadCloud className="w-6 h-6 text-zinc-400 hover:text-white" />}
                                 <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={!isVIP} />
                              </label>
                              <button type="button" onClick={handleRollDice} disabled={isRolling} className="p-2 hover:scale-110 transition-transform">
                                 <Dices className={`w-6 h-6 text-zinc-400 hover:text-white ${isRolling ? 'animate-spin' : ''}`} />
                              </button>
                           </>
                        )}
                        {demoInput && (
                           <button type="button" onClick={() => { 
                              setDemoInput(''); 
                              setUploadedImage(null); 
                              setCustomerPrompt('');
                              setGeneratedPrompts({ single: '', abstract: '', cinematic: '', photoreal: '', uniquePhoto: '' });
                           }} className="p-2 hover:scale-110 transition-transform"><X className="w-6 h-6 text-red-500" /></button>
                        )}
                     </div>
                   </div>
                   
                   {uploadedImage && (
                     <button onClick={handleAnalyzeImage} disabled={isAnalyzingImage} className="mt-4 w-full bg-indigo-600/20 text-indigo-300 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border border-indigo-400/30 hover:bg-indigo-600 hover:text-white transition-all">
                       {isAnalyzingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                       DEEP ANALYZE IMAGE (V8 VISION)
                     </button>
                   )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">
                 {v8Stilovi.map((stil) => {
                   const isCopied = copiedBox === stil.id;
                   const currentBorder = isCopied ? 'border-green-500' : stil.bojaClass;
                   const currentShadow = isCopied ? 'shadow-[0_0_20px_rgba(34,197,94,0.4)]' : stil.shadowClass;
                   const currentTitleColor = isCopied ? 'text-green-400' : stil.textClass;
                   const currentDivider = isCopied ? 'border-green-500/50' : 'border-white/30';
                   const currentBtnBg = isCopied ? 'bg-green-600 hover:bg-green-500' : stil.bgHover;

                   return (
                     <div key={stil.id} className={`gsap-result-box border rounded-xl p-6 bg-[#0a0a0a] min-h-[280px] flex flex-col transition-all duration-500 transform ${!isCopied ? 'hover:-translate-y-3' : ''} ${currentBorder} ${currentShadow}`}>
                       <label className={`text-[11px] font-black uppercase mb-4 border-b pb-3 transition-colors duration-300 ${currentDivider} ${currentTitleColor}`}>{stil.naslov} V8 PROMPT</label>
                       
                       <div className="font-mono text-[13px] leading-relaxed text-zinc-300 flex-grow whitespace-pre-wrap break-all overflow-y-auto max-h-[400px] pr-2">
                         <ScrambleText text={generatedPrompts[stil.id]} />
                       </div>
                       
                       {generatedPrompts[stil.id] && <button onClick={() => handleCopy(generatedPrompts[stil.id], stil.id)} className={`mt-4 px-6 py-2.5 rounded-xl text-[10px] font-black transition-colors border border-white/10 ${isCopied ? 'bg-green-600 text-white' : `bg-white/5 text-white ${stil.bgHover}`}`}>{isCopied ? "COPIED! ✓" : "COPY PROMPT"}</button>}
                     </div>
                   );
                 })}
              </div>

              <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mt-12 pt-8 border-t border-blue-500/20">
                 <div className="flex flex-col sm:flex-row gap-8 w-full lg:w-auto text-left">
                    <div className="flex flex-col gap-4"><span className="text-[12px] font-black uppercase text-zinc-300">ASPECT RATIO</span><div className="flex flex-wrap gap-2">{['1:1', '9:16', '16:9', '21:9'].map(ar => <OptionButton key={`ar-${ar}`} label={ar} selected={selectedAR === ar} onClick={() => setSelectedAR(ar)} disabled={!isVIP} />)}</div></div>
                 </div>
                 <RippleButton onClick={(e) => handleEnhance(e, 'concept')} disabled={!isVIP || isEnhancing || !demoInput.trim()} className="w-full lg:w-[30%] bg-blue-600 text-white py-6 rounded-2xl font-black uppercase text-[14px] shadow-lg hover:bg-blue-500">Generate Cinematic Concepts</RippleButton>
              </div>
           </div>

           {/* --- NARANDŽASTA SEKCIJA: 10X MATRICA --- */}
           <div className={`bg-[#0a0a0a]/50 backdrop-blur-md border border-amber-400/30 rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 shadow-[0_0_30px_rgba(251,191,36,0.1)] hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] flex flex-col gap-10 ${!isVIP ? 'opacity-50 grayscale-[50%] pointer-events-none select-none' : 'hover:border-amber-400/60 group'}`}>
              <div className="w-full text-center border-b border-amber-400/20 pb-6 mb-2"><h2 className="text-[12px] font-black uppercase text-amber-400 tracking-wider">WE WILL MAKE YOUR PROMPT 10X BETTER</h2></div>
              
              <div className="w-full flex flex-col lg:flex-row gap-8 mt-6">
                 <div className="w-full lg:w-1/3 text-left">
                   <label className="text-[14px] md:text-[16px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2 mb-3"><Zap className="w-5 h-5" /> Paste Custom Prompt</label>
                   <p className="text-[10px] md:text-[11px] text-white font-black uppercase mb-6">Paste your raw prompt so we can dissect and reconstruct it.</p>
                 </div>
                 
                 <div className={`w-full lg:w-2/3 relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#050505]/50 ${isVIP && demoInput.trim().length === 0 ? 'focus-within:border-amber-400/50' : ''}`}>
                   
                   {demoInput.trim().length > 0 && (
                     <div 
                       className="absolute inset-0 z-10 cursor-not-allowed" 
                       onClick={() => { 
                         setPrikaziPlaviPopUp(true); 
                         setTimeout(() => setPrikaziPlaviPopUp(false), 3500); 
                       }} 
                     />
                   )}

                   {isScanning && customerPrompt.trim() !== "" && <div className="animate-scan-amber" />}
                   <textarea 
                     disabled={!isVIP || demoInput.trim().length > 0} 
                     value={customerPrompt} 
                     onChange={e => { setCustomerPrompt(e.target.value); setGeneratedPrompts(prev => ({ ...prev, single: '' })); }} 
                     placeholder="PASTE YOUR RAW PROMPT HERE" 
                     className={`w-full flex-1 bg-transparent p-6 text-white text-[12px] md:text-[14px] outline-none resize-none min-h-[160px] ${(!isVIP || demoInput.trim().length > 0) ? 'cursor-not-allowed opacity-30' : ''}`} 
                   />
                   
                   {customerPrompt && (
                     <button type="button" onClick={() => { setCustomerPrompt(''); setGeneratedPrompts(prev => ({ ...prev, single: '' })); setIsScanning(false); }} className="absolute right-4 top-4 bg-red-600/10 p-2 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all z-20"><Trash2 className="w-4 h-4" /></button>
                   )}

                   <AnimatePresence>
                     {prikaziPlaviPopUp && (
                       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-blue-900/95 backdrop-blur-md rounded-2xl border-2 border-blue-400 cursor-pointer shadow-2xl" onClick={() => setPrikaziPlaviPopUp(false)}>
                         <div className="text-center flex flex-col items-center">
                           <ShieldAlert className="w-12 h-12 text-blue-400 mb-4" />
                           <h3 className="text-white text-[13px] font-black uppercase tracking-widest mb-2">SYSTEM TEMPORARILY BLOCKED</h3>
                           <p className="text-blue-200 text-[11px] font-bold text-center leading-relaxed">You must clear the inputs from the <br/><span className="text-white">"Concept Generator"</span> first!</p>
                         </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>
              </div>
              
              <div className="w-full flex flex-col border-t border-amber-400/20 pt-8 mt-4">
                 <label className="text-[10px] md:text-[12px] font-black uppercase text-amber-400 tracking-widest flex items-center gap-2 mb-6 border-b border-amber-400/20 pb-4"><Eye className="w-4 h-4 mr-1" /> V8 Matrix Output</label>
                 <div className="w-full ray-container min-h-[300px]">
                   <div className="ray-beam" />
                   <div className="ray-inner pb-20">
                       <div className="text-amber-400 font-black text-[12px] uppercase mb-6 border-b border-amber-400/10 pb-4 flex items-center gap-3"><Zap className="w-4 h-4" /> Premium Unique Matrix Output</div>
                       
                       <div className="w-full font-mono text-[11px] md:text-[13px] leading-relaxed text-left text-zinc-200 whitespace-pre-wrap break-all overflow-y-auto max-h-[400px] pr-2">
                         <ScrambleText text={generatedPrompts.single} />
                       </div>
                       
                       {generatedPrompts.single && <button onClick={() => handleCopy(generatedPrompts.single, 'single')} className="absolute bottom-6 right-6 px-6 py-3 rounded-xl text-[11px] font-black bg-amber-400/10 border border-amber-400/20 text-amber-300 hover:bg-amber-400 hover:text-black transition-all z-20">Copy 10X Prompt</button>}
                   </div>
                 </div>
              </div>

              <div className="flex flex-col lg:flex-row justify-end items-center mt-4 border-t border-amber-400/20 pt-8">
                 <RippleButton onClick={(e) => handleEnhance(e, 'prompt')} disabled={!isVIP || isEnhancing || !customerPrompt.trim()} className="w-full lg:w-[30%] bg-amber-600 text-black py-6 rounded-2xl font-black uppercase text-[14px] shadow-lg hover:bg-amber-500">Reconstruct Unique Prompt</RippleButton>
              </div>
           </div>

           {/* --- V8 REFERENTNA GALERIJA --- */}
           {gallery.length > 0 && (
             <div className="bg-[#0a0a0a]/50 border border-orange-500/30 rounded-[2.5rem] p-8 md:p-12 relative flex flex-col gap-6 mt-12 items-center transition-all hover:border-orange-500/60 shadow-xl">
               <h2 className="text-xl md:text-2xl font-black text-orange-500 uppercase tracking-widest border-b border-orange-500/20 pb-4 mb-4 w-full text-center"><Zap className="inline w-6 h-6 mr-3" /> Premium V8 Gallery</h2>
        <div className="w-full max-w-4xl mx-auto aspect-video relative p-[2px] rounded-3xl overflow-hidden group bg-black">
          
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] v8-ai-aura opacity-70 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
          
          <div className="relative w-full h-full bg-black rounded-[calc(1.5rem-2px)] overflow-hidden z-10">
            <img src={gallery[activeGalleryIndex]?.url} className="w-full h-full object-cover transition-all" alt="Gallery" />
            <button onClick={() => { setUploadedImage(gallery[activeGalleryIndex]?.url); setDemoInput(gallery[activeGalleryIndex]?.url); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="absolute bottom-6 right-12 p-3.5 bg-blue-600 rounded-xl text-white hover:scale-110 transition-transform shadow-2xl z-20"><UploadCloud className="w-5 h-5" /></button>
          </div>

          <div className="absolute -inset-4 animate-[spin_4s_linear_infinite] v8-ai-aura opacity-20 group-hover:opacity-50 blur-2xl transition-opacity duration-700 pointer-events-none z-0"></div>
          
        </div>
               <div className="flex flex-wrap justify-center gap-4 mt-8 pb-4">
                  {gallery.map((img, idx) => (
                     <button key={img.id} onClick={() => setActiveGalleryIndex(idx)} className={`w-24 h-16 rounded-2xl overflow-hidden border-2 transition-all ${activeGalleryIndex === idx ? 'border-orange-500 scale-105 shadow-lg' : 'border-white/5 opacity-40 hover:opacity-100'}`}><img src={img.url} className="w-full h-full object-cover" alt="Thumb" /></button>
                  ))}
               </div>
             </div>
           )}
        </div>
      </div>

      {/* 🔥 V8 PAYMENT MODAL PORTAL (ZAKUCAN ZA CENTAR) 🔥 */}
      {createPortal(
        <AnimatePresence>
          {showPaymentModal && (
            <div className="fixed inset-0 z-[999999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-[#0a0a0a] border border-orange-500/40 rounded-[2.5rem] max-w-md w-full relative text-zinc-100 font-sans shadow-[0_0_60px_rgba(234,88,12,0.15)] overflow-hidden">
                <button onClick={() => setShowPaymentModal(null)} className="absolute top-5 right-5 bg-white/5 p-2 rounded-full text-zinc-400 hover:text-orange-500 hover:bg-orange-500/10 transition-all z-10"><X size={20} strokeWidth={3} /></button>
                
                <div className="p-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-orange-600/10 flex items-center justify-center mb-4 border border-orange-500/30 shadow-[0_0_20px_rgba(234,88,12,0.2)]">
                     <DownloadCloud className="w-8 h-8 text-orange-500" />
                  </div>
                  
                  <h3 className="text-[18px] font-black uppercase tracking-widest mb-2 text-white text-center">Digital Asset Checkout</h3>
                  <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest mb-8 text-center">{showPaymentModal?.tip}</p>
                  
                  <div className="w-full bg-[#050505] border border-white/10 rounded-2xl p-6 space-y-4 text-[13px] font-mono shadow-inner mb-8">
                    <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Provider:</span><span className="font-bold text-white text-right">V8 Vault</span></div>
                    <div className="flex justify-between border-b border-white/5 pb-3"><span className="text-zinc-500 uppercase">Support:</span><span className="font-bold text-white text-[11px]">aitoolsprosmart@gmail.com</span></div>
                    <div className="flex justify-between pt-2 items-center"><span className="text-zinc-500 uppercase">Total (One-Time):</span><span className="font-black text-white text-[22px] drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">${showPaymentModal?.cena}</span></div>
                  </div>
                  
                  <div className="w-full bg-[#050505] border border-orange-500/30 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(234,88,12,0.15)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <p className="text-[11px] md:text-[12px] text-zinc-300 font-black uppercase tracking-widest mb-4">Please contact support to complete your one-time purchase:</p>
                    <a href="mailto:aitoolsprosmart@gmail.com" className="flex items-center justify-center gap-2 w-full bg-white text-black hover:bg-orange-500 hover:text-white py-3.5 rounded-xl font-black text-[12px] uppercase tracking-widest transition-all cursor-pointer shadow-lg">
                        Request Checkout Link
                    </a>
                    <span className="block mt-4 text-[9px] text-zinc-500 uppercase font-bold tracking-widest">System unlocks your access automatically! 🚀</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};

export default V8Enhancer10x;
// KRAJ FAJLA: V8Enhancer10x.jsx