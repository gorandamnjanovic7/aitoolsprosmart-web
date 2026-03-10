import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PlayCircle, ArrowRight, Check, Award, HelpCircle, PlusCircle, Database, Eye, Users, Clock, MousePointerClick, ShoppingCart, Shield, ChevronLeft, ChevronDown, Lock } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- IMAGE IMPORTS ---
import zmajImg from './zmaj.jpg';
import novaSlikaImg from './nova-slika.png';
import slikaHubImg from './slika-hub.jpeg';
import slikaCopyImg from './slika-copy.jpeg';
import hollywoodImg from './hollywood.png';
import slikaVideoImg from './slika-video.jpeg';
import mojLogo from './logo.png';

export const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
export const CLOUDINARY_UPLOAD_PRESET = "uploads1"; 
export const logoUrl = mojLogo; 
export const bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
export const ADMIN_DEFAULT_DESC = `[DESCRIPTION]\nEnter your main description here...\n\nKEY FEATURES\n* Feature 1\n* Feature 2\n* Feature 3\n\nVALUE MULTIPLIER\n* Benefit 1\n* Benefit 2`;
export const PAYMENT_METHODS = ["Stripe", "PayPal", "Crypto"];

// --- META TOKENS (UNIVERZALNI) ---
const CAMERA_TOKENS = ["ARRI_ALEXA_35", "RED_RAPTOR_V", "SONY_VENICE", "IMAX_FILM_CAMERA", "PANAVISION_DXL2", "ARRIFLEX_16SR", "BLACKMAGIC_6K_PRO", "PHASE_ONE_IQ4", "HASSELBLAD_X2D", "CANON_EOS_R5", "NIKON_Z9", "SONY_A1", "FUJIFILM_GFX100", "LEICA_M11", "DJI_MAVIC_3_PRO"];
const LENS_TOKENS = ["Zeiss_Ultra_Prime", "Leica_Summilux_35mm", "Canon_RF_50mm_f1.2", "Sigma_Art_85mm", "Panavision_C_Series", "Cooke_Anamorphic", "Zeiss_Master_Prime", "ARRI_Signature_Prime", "Laowa_24mm_Probe", "Nikkor_105mm_Macro", "UltraWide_14mm", "Classic_35mm", "Portrait_85mm", "Telephoto_200mm"];
const LIGHTING_TOKENS = ["Golden_Hour_Lighting", "Blue_Hour_Ambience", "Volumetric_Rays", "God_Rays", "Studio_Softbox_Lighting", "High_Key_Lighting", "Low_Key_Lighting", "Rim_Lighting", "Backlight_Silhouette", "Candlelight_Glow", "Moonlight_Illumination", "Dramatic_Contrast_Lighting", "Sunset_Warm_Light", "HDR_Light_Fusion"];
const ENV_TOKENS = ["Epic_Mountain_Landscape", "Dense_Tropical_Jungle", "Futuristic_Megacity", "Ancient_Temple_Ruins", "Underwater_Ocean_World", "Abandoned_Industrial_Zone", "Luxury_Penthouse_View", "Desert_Dunes_At_Sunset", "Frozen_Arctic_Landscape", "Deep_Space_Backdrop", "Volcanic_Lava_Field", "Mystical_Forest"];
const STYLE_TOKENS = ["Christopher_Nolan_Cinematic", "Ridley_Scott_Epic_Frame", "Denis_Villeneuve_Scale", "Alejandro_Inarritu_Realism", "Roger_Deakins_Lighting", "Zack_Snyder_Dramatic_Contrast", "James_Cameron_SciFi_Scope", "Quentin_Tarantino_Frame", "Stanley_Kubrick_Symmetry"];
const REALISM_TOKENS = ["UltraPhotorealistic", "HyperRealism", "ExtremeDetail", "NanoDetail_8K", "MicroTexture_Rendering", "UltraDepth_Field", "Global_Illumination", "RayTraced_Reflections", "Ambient_Occlusion", "Sensor_Noise_Realism", "Film_Grain_Texture", "Natural_Skin_Pores", "Subsurface_Scattering", "Optical_Lens_Distortion"];
const COLOR_TOKENS = ["ACES_Color_Science", "Kodak_Ektar_100", "Kodak_Portra_400", "Fuji_Velvia_Color", "ARRI_LogC_Profile", "Sony_SLog3_Profile", "TrueColor_Calibration", "HDR_Color_Fusion"];
const MOTION_TOKENS = ["Drone_Aerial_Tracking", "Slow_Cinematic_Dolly", "Handheld_Documentary_Shake", "Crane_Shot_Movement", "Smooth_Gimbal_Motion", "Orbiting_Camera_Move", "Push_In_Camera_Move", "Pull_Back_Reveal"];
const DETAIL_TOKENS = ["Skin_Micro_Pores", "Hair_Strand_Detail", "Fabric_Fiber_Texture", "Dust_Particles_In_Air", "Surface_Micro_Scratches", "Brushed_Metal_Texture", "Wet_Surface_Reflections", "Glass_Refraction", "Water_Ripple_Physics"];
const VISUAL_KEYWORDS = ["Epic_Scale", "Grand_Perspective", "Ultra_Luxury_Aesthetic", "Museum_Grade_Image", "Editorial_Fashion_Style", "National_Geographic_Look", "Street_Photography_Realism", "Architectural_Precision", "Luxury_Product_Photography", "Cinematic_Masterpiece"];

const DICE_SUBJECTS = ["a chrome plated vintage Shelby Cobra", "a majestic obsidian dragon", "a lone astronaut on a space station", "a futuristic cybernetic lion", "an ancient high priest", "a Ronin warrior with a carbon fiber katana", "a bioluminescent deep-sea creature", "a marble statue of a goddess", "a tactical droid in camo", "a stealth interceptor jet on a rainy runway", "a colossal floating fortress", "a nomadic warrior in a sandstorm", "a Victorian clockwork entity", "a phoenix made of liquid plasma", "a neo-gothic palace", "a futuristic F1 race car", "a genetically modified tiger", "a robotic geisha", "a black hole event horizon", "a luxury wristwatch with gears"];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const sanitize = (text) => text.trim().replace(/cyberpunk/gi, '').replace(/cyberpank/gi, '').replace(/neon/gi, '').replace(/\s\s+/g, ' ');

const getMetaCombo = () => `${pick(CAMERA_TOKENS)} • ${pick(LENS_TOKENS)} • ${pick(LIGHTING_TOKENS)} • ${pick(REALISM_TOKENS)} • ${pick(STYLE_TOKENS)} • ${pick(COLOR_TOKENS)} • ${pick(VISUAL_KEYWORDS)} • ${pick(DETAIL_TOKENS)}`;

export const getRandomDicePrompt = () => sanitize(`${pick(DICE_SUBJECTS)}, set in ${pick(ENV_TOKENS).replace(/_/g, ' ')}. ${getMetaCombo()}`);

export const generatePrompts = (customerPrompt, demoInput, selectedQuality, selectedAR) => {
    let result = { single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' };
    const tokens = getMetaCombo();
    if (customerPrompt.trim().length > 0) {
        const cleanInput = sanitize(customerPrompt);
        result.single = `[FIDELITY_INJECTION] ${cleanInput.toUpperCase()}. ${pick(MOTION_TOKENS)} • ${tokens} • Aspect ratio: ${selectedAR}`;
    } else if (demoInput.trim().length > 0) {
        const cleanInput = sanitize(demoInput).toUpperCase();
        result.abstract = `[META_TOKEN: ABSTRACT] Surreal representation of ${cleanInput}. ${pick(STYLE_TOKENS)} • ${pick(REALISM_TOKENS)} • ${pick(COLOR_TOKENS)} • ${pick(DETAIL_TOKENS)} • Aspect ratio: ${selectedAR}`;
        result.cinematic = `[META_TOKEN: CINEMA] A breathtaking IMAX movie still of ${cleanInput}. ${pick(STYLE_TOKENS)} • ${pick(CAMERA_TOKENS)} • ${pick(LIGHTING_TOKENS)} • ${pick(MOTION_TOKENS)} • Aspect ratio: ${selectedAR}`;
        result.photoreal = `[META_TOKEN: PHOTOREAL] RAW documentary capture of ${cleanInput}. ${pick(CAMERA_TOKENS)} • ${pick(LENS_TOKENS)} • ${pick(DETAIL_TOKENS)} • ${pick(REALISM_TOKENS)} • Aspect ratio: ${selectedAR}`;
        result.cctv = `[ULTIMATE_UNIQUE_FIDELITY] The most unique photorealistic image ever of ${cleanInput}. ${pick(STYLE_TOKENS)} • ${pick(CAMERA_TOKENS)} • ${pick(LENS_TOKENS)} • ${pick(LIGHTING_TOKENS)} • ${pick(DETAIL_TOKENS)} • ${pick(REALISM_TOKENS)} • ${pick(COLOR_TOKENS)} • Aspect ratio: ${selectedAR}`;
    }
    return result;
};

// --- POMOĆNE FUNKCIJE ---
export const getYouTubeId = (url) => { if (!url || url === "#") return null; const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/); return (match && match[2].length === 11) ? match[2] : null; };
export const getMediaThumbnail = (url) => { const ytId = getYouTubeId(url); return ytId ? `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg` : (url || bannerUrl); };
export const formatExternalLink = (url) => { if (!url || url === "#") return "#"; return url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`; };
export const extractSys = (desc) => { let d = desc || ""; let s = { w: '', g: '', b: 'AI ASSET', t: 'LATEST ⚡' }; if (d.includes("|||SYS|||")) { const parts = d.split("|||SYS|||"); d = parts[0].trim(); try { s = { ...s, ...JSON.parse(parts[1]) }; } catch(e) {} } return { d: d, s }; };
export const SESSION_ID = Math.random().toString(36).substring(2, 15);
export const trackEvent = async (action, details = {}) => { try { await addDoc(collection(db, "site_stats"), { action, ...details, sessionId: SESSION_ID, timestamp: serverTimestamp() }); } catch (e) {} };

// --- UI KOMPONENTE ---
export function TypewriterText({ text, speed = 15 }) { const [displayedText, setDisplayedText] = useState(''); useEffect(() => { setDisplayedText(''); if (!text) return; let i = 0; const intv = setInterval(() => { setDisplayedText(text.slice(0, i + 1)); i++; if (i >= text.length) clearInterval(intv); }, speed); return () => clearInterval(intv); }, [text, speed]); return <>{displayedText}</>; }
export function UniversalVideoPlayer({ url, autoPlay = true, loop = false, muted = false, hideControls = false, videoRef }) { const ytId = getYouTubeId(url); if (ytId) { let src = `https://www.youtube.com/embed/${ytId}?autoplay=${autoPlay ? 1 : 0}&rel=0&controls=${hideControls ? 0 : 1}`; if (muted) src += `&mute=1`; if (loop) src += `&loop=1&playlist=${ytId}`; return <iframe className="w-full h-full" src={src} frameBorder="0" allowFullScreen title="video"></iframe>; } return <video ref={videoRef} src={url} className="w-full h-full object-cover" autoPlay={autoPlay} loop={loop} muted={muted} controls={!hideControls} playsInline />; }

// --- FUNKCIJA GDE SE ISCRTAVA TEKST (SA NOVIM NASLOVIMA) ---
export const renderDescription = (text) => {
  const { d: cleanDesc } = extractSys(text);
  if (!cleanDesc) return null;
  return cleanDesc.split('\n').map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-2"></div>;
    const upper = trimmed.toUpperCase();
    
    // OVO JE DEO KOJI PREPOZNAJE NASLOVE I DAJE IM STIL
    if (
      upper.includes('[DESCRIPTION]') || 
      upper.includes('VALUE MULTIPLIER') || 
      upper.includes('KEY FEATURES') ||
      upper.includes('THE ARSENAL') ||
      upper.includes('THE 5 PILLARS') ||
      upper.includes('THE ROI FINALE')
    ) {
        // border-l-4 znaci linija sa LEVE strane
        return <h3 key={idx} className="text-[12px] font-black text-white mt-10 mb-4 uppercase tracking-widest border-l-4 border-orange-500 pl-4 italic text-left">{trimmed}</h3>;
    }
    
    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
      return <div key={idx} className="flex gap-3 items-start my-2 bg-white/[0.02] p-3 rounded-2xl border border-white/5"><CheckCircle2 className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" /><p className="text-white text-[11px] font-bold text-left">{trimmed.replace(/^[*-]\s*/, '')}</p></div>;
    }
    return <p key={idx} className="text-white text-[11px] font-bold leading-relaxed my-3 text-left">{trimmed}</p>;
  });
};

export function FullScreenBoot({ onComplete }) { const [lines, setLines] = useState([]); const [fading, setFading] = useState(false); useEffect(() => { const intv = setInterval(() => { setLines(prev => [...prev, `0x${Math.random().toString(16).slice(2, 10).toUpperCase()} SYNC`].slice(-40)); }, 30); setTimeout(() => { clearInterval(intv); setLines(prev => [...prev, "", "> ACCESS GRANTED."]); }, 1800); setTimeout(() => setFading(true), 2400); setTimeout(() => onComplete(), 2800); return () => clearInterval(intv); }, [onComplete]); return <div className={`fixed inset-0 z-[9999] bg-[#050505] text-green-500 font-mono text-[10px] overflow-hidden transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}><div className="absolute bottom-0 left-0 w-full px-8 py-8 flex flex-col justify-end space-y-0.5 opacity-90">{lines.map((l, i) => (<div key={i} className={l.includes('GRANTED') ? 'text-green-400 font-black text-lg mt-4 animate-pulse' : 'break-all'}>{l}</div>))}</div></div>; }
export function MatrixRain() { const canvasRef = useRef(null); useEffect(() => { const canvas = canvasRef.current; if(!canvas) return; const ctx = canvas.getContext('2d'); canvas.width = canvas.parentElement.offsetWidth; canvas.height = canvas.parentElement.offsetHeight; const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; const fontSize = 14; let drops = Array(Math.floor(canvas.width / fontSize)).fill(1); const draw = () => { ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#0F0'; ctx.font = fontSize + 'px monospace'; for (let i = 0; i < drops.length; i++) { ctx.fillText(letters[Math.floor(Math.random() * letters.length)], i * fontSize, drops[i] * fontSize); if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } }; const intv = setInterval(draw, 35); return () => clearInterval(intv); }, []); return <canvas ref={canvasRef} className="absolute inset-0 z-[15] opacity-[0.15] pointer-events-none" />; }
export function UrgencyBar() { const [timeLeft, setTimeLeft] = useState("02:45:12"); useEffect(() => { const timer = setInterval(() => { const now = new Date(); setTimeLeft(`${String(23-now.getHours()).padStart(2,'0')}:${String(59-now.getMinutes()).padStart(2,'0')}:${String(59-now.getSeconds()).padStart(2,'0')}`); }, 1000); return () => clearInterval(timer); }, []); return <div className="w-full bg-black border-b border-orange-500/20 py-1.5 flex items-center justify-center gap-6 px-4 relative z-[200]"><span className="text-[8px] font-black text-orange-500 uppercase tracking-[0.3em] animate-pulse">System Alert: Flash License Deal</span><div className="flex items-center gap-2 bg-orange-600/10 px-3 py-0.5 rounded-full border border-orange-500/30"><span className="text-[8px] font-black text-white font-mono">{timeLeft}</span></div></div>; }
export function TutorialCard({ vid }) { const videoId = getYouTubeId(vid.url); return <div className="p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 rounded-[2rem] flex flex-col h-full hover:-translate-y-1 transition-all group shadow-xl"><div className="bg-[#0a0a0a] rounded-[1.9rem] p-4 flex flex-col h-full"><div className="aspect-video relative overflow-hidden rounded-2xl mb-4 bg-zinc-900 border-2 border-blue-500/60 cursor-pointer" onClick={() => window.open(vid.url, '_blank')}><img src={`https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`} alt="thumb" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all" /><div className="absolute inset-0 flex items-center justify-center"><PlayCircle className="w-12 h-12 text-red-500 drop-shadow-lg" /></div></div><h4 className="text-zinc-300 font-bold text-[10px] uppercase line-clamp-2 text-left">{vid.title}</h4></div></div>; }

export function AssetCard({ app }) {
  const mediaItem = app?.media?.[0];
  const isVideo = mediaItem?.type === 'video' || mediaItem?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
  const displayUrl = isVideo ? `${mediaItem.url}#t=0.001` : getMediaThumbnail(mediaItem?.url);
  return (
    <div className="relative overflow-hidden p-[1px] bg-gradient-to-br from-orange-500 to-blue-500 rounded-[2.5rem] transition-all duration-500 hover:scale-[1.02] flex flex-col group h-full shadow-2xl">
      <div className="bg-[#0a0a0a] rounded-[2.4rem] flex flex-col h-full p-8 relative">
        <div className="aspect-video relative overflow-hidden rounded-[1.5rem] mb-6 border-2 border-blue-500/60 bg-zinc-900">
          {isVideo ? <video src={displayUrl} className="w-full h-full object-cover" muted playsInline /> : <img src={displayUrl} className="w-full h-full object-cover" alt="asset" />}
        </div>
        <div className="flex justify-between items-start mb-3 gap-4 text-left">
          <h2 className="text-sm font-black uppercase group-hover:text-orange-500 transition-all">{app.name}</h2>
          <div className="px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 shadow-lg">${app.price}</div>
        </div>
        <div className="mt-auto pt-4 text-left">
          <Link to={`/app/${app.id}`} className="w-full py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl">MORE DETAILS <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}

export function LiveSalesNotification({ apps }) {
  const [notification, setNotification] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if(!apps || apps.length === 0) return;
    const interval = setInterval(() => {
       const randomApp = apps[Math.floor(Math.random() * apps.length)].name;
       setNotification({ product: randomApp });
       setIsVisible(true); setTimeout(() => setIsVisible(false), 5000); 
    }, 28000); 
    return () => clearInterval(interval);
  }, [apps]);
  return <div className={`fixed bottom-6 left-6 z-[200] bg-[#0a0a0a]/95 border border-white/10 p-4 rounded-2xl transition-all duration-700 shadow-2xl text-left ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}><div className="flex items-center gap-4"><div className="bg-green-500/20 p-2 rounded-full"><Check className="text-green-500 w-4 h-4"/></div><div><p className="text-[9px] text-zinc-400 font-bold">New License Activated</p><p className="text-[11px] font-black text-white">{notification?.product}</p></div></div></div>;
}

export function StarIcon() { return <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>; }
export const BANNER_DATA = [{ url: slikaHubImg, badge: "CORE AI HUB", title: "Welcome to Our Hub", subtitle: "Command center for generating complex AI architectures." }, { url: zmajImg, badge: "DRAGON PROTOCOL", title: "ANCIENT EMPIRES REBORN", subtitle: "Generate epic scenes with dragons in 8K resolution." }, { url: novaSlikaImg, badge: "TIME TRAVELER", title: "UNIQUE PHOTO REALISTIC IMAGES", subtitle: "Merging historical eras using advanced AI engines." }, { url: slikaCopyImg, badge: "CYBER STEALTH", title: "GHOST IN THE MACHINE", subtitle: "Professional prompts for high-detail visuals." }, { url: slikaVideoImg, badge: "WARP SPEED", title: "TEMPORAL MOTION ENGINE", subtitle: "Optimized for fast generation of AI video content." }, { url: hollywoodImg, badge: "WINTER PROTOCOL", title: "HOLLYWOOD VFX GRADE", subtitle: "Epic cinematic battles and CGI-level detail." }];