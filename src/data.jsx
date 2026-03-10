import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PlayCircle, ArrowRight, Check } from 'lucide-react';

// --- FIREBASE INTEGRACIJA ---
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// --- IMAGE IMPORTS (POPRAVLJENO) ---
import zmajImg from './zmaj.jpg';
import novaSlikaImg from './nova-slika.png';
import slikaHubImg from './slika-hub.jpeg';
import slikaCopyImg from './slika-copy.jpeg';
import hollywoodImg from './hollywood.png';
import slikaVideoImg from './slika-video.jpeg';
import mojLogo from './logo.png';

// --- KONFIGURACIJA ---
export const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
export const CLOUDINARY_UPLOAD_PRESET = "uploads1"; 
export const logoUrl = mojLogo; 
export const bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
export const ADMIN_DEFAULT_DESC = `[DESCRIPTION]\nEnter your main description here...\n\nKEY FEATURES\n* Feature 1\n* Feature 2\n* Feature 3\n\nVALUE MULTIPLIER\n* Benefit 1\n* Benefit 2`;
export const PAYMENT_METHODS = ["Stripe", "PayPal", "Crypto"];

// --- NIZOVI ZA ROLL DICE ---
const DICE_SUBJECTS = ["a futuristic cybernetic lion", "a chrome-plated vintage Shelby Cobra", "an ancient Aztec high priest", "a massive obsidian dragon", "a lone astronaut on a red planet", "a cyberpunk ronin with a glowing katana", "a Victorian clockwork owl", "a bioluminescent deep-sea jellyfish", "a marble statue of a digital goddess", "a high-tech tactical battle droid", "a mystical druid in emerald robes", "a sleek stealth interceptor jet", "a giant robotic praying mantis", "a nomadic desert warrior", "a ghostly pirate captain", "a microscopic crystalline castle", "a colossal floating island fortress", "a zen monk meditating in zero gravity", "a vaporwave style retro mainframe", "a steampunk airship explorer", "a hyper-realistic cybernetic wolf", "a majestic phoenix made of plasma", "a neo-gothic vampire lord", "a futuristic F1 race car", "a samurai in high-tech carbon fiber armor", "a mysterious oracle in a temple", "a genetically modified tiger with neon stripes", "a robotic geisha with transparent skin", "a world-ending meteor impact", "a portal to another dimension", "a dense biomechanical forest", "a gold-plated humanoid android", "a futuristic city street with flying cars", "an overgrown post-apocalyptic New York", "a massive black hole event horizon", "a divine celestial entity", "a hyper-detailed luxury wristwatch gear", "a majestic eagle with metallic wings", "a futuristic holographic dancer", "a dark knight in heavy plate armor"];
const DICE_ENVIRONMENTS = ["in a neon-drenched cyberpunk alley", "on a frozen lake under the aurora borealis", "inside a derelict space station corridor", "surrounded by a lush prehistoric jungle", "within a golden temple of light", "in a dark dystopian megacity rain", "at the bottom of a bioluminescent ocean", "on top of a crystalline mountain peak", "inside a smoky 1920s speakeasy", "floating in a nebula of purple gas", "in an ancient desert ruin with sandstorms", "within a high-tech minimalist white lab", "on a futuristic Mars colony", "in a deep cavern filled with glowing crystals", "overlooking a sprawling volcanic landscape", "in a Victorian library with floating books", "within a massive clockwork engine room", "on a quiet street in futuristic Tokyo", "inside an infinite mirror dimension", "in a dreamscape of floating geometric shapes"];
const DICE_CAMERAS = ["shot on ARRI Alexa 35, Master Prime 35mm", "captured with RED V-Raptor, anamorphic 50mm", "shot on Hasselblad H6D-100c, macro 120mm", "Leica M11, Noctilux-M 50mm f/0.95", "Sony Venice 2, 70mm IMAX format", "vintage 35mm Panavision C-Series", "Nikon Z9, 85mm f/1.2 S-line", "Phase One XF, 80mm medium format", "Canon EOS R3, ultra-wide 14mm", "shot on Kodak Portra 400 film aesthetic", "captured with a probe lens for extreme macro", "shot on 70mm IMAX film stock", "Fujifilm GFX 100S, 45-100mm lens", "shot on 16mm grainy vintage film", "captured with a cinematic drone, 8k aerial view"];
const DICE_LIGHTS = ["dramatic rim lighting with volumetric fog", "soft golden hour natural sunlight", "harsh magenta and cyan neon underglow", "cinematic chiaroscuro with deep shadows", "clinical high-key laboratory lighting", "ethereal moonlight filtering through clouds", "flickering firelight from a nearby forge", "underwater caustics and light refraction", "split lighting with warm and cool tones", "high-fashion strobe lighting setup", "moody noir lighting with long shadows", "bioluminescent glow from the subject", "intense overhead sun with sharp shadows", "soft-box studio lighting, professional", "volumetric god rays piercing the scene"];

export const getRandomDicePrompt = () => {
  const sub = DICE_SUBJECTS[Math.floor(Math.random() * DICE_SUBJECTS.length)];
  const env = DICE_ENVIRONMENTS[Math.floor(Math.random() * DICE_ENVIRONMENTS.length)];
  const cam = DICE_CAMERAS[Math.floor(Math.random() * DICE_CAMERAS.length)];
  const light = DICE_LIGHTS[Math.floor(Math.random() * DICE_LIGHTS.length)];
  return `${sub}, ${env}. ${cam}, ${light}.`;
};

// --- PODACI ---
export const BANNER_DATA = [{ url: slikaHubImg, badge: "CORE AI HUB", title: "Welcome to Our Hub", subtitle: "Command center for data control and generating complex AI architectures." }, { url: zmajImg, badge: "DRAGON PROTOCOL", title: "ANCIENT EMPIRES REBORN", subtitle: "Generate epic, hyper-realistic scenes with dragons and mythical creatures in 8K resolution." }, { url: novaSlikaImg, badge: "TIME TRAVELER", title: "UNIQUE PHOTO REALISTIC IMAGES", subtitle: "Merging incompatible historical eras using advanced AI Prompt engines." }, { url: slikaCopyImg, badge: "CYBER STEALTH", title: "GHOST IN THE MACHINE", subtitle: "Professional prompts for digital art and high-detail cyberpunk visuals." }, { url: slikaVideoImg, badge: "WARP SPEED", title: "TEMPORAL MOTION ENGINE", subtitle: "Optimized for ultra-fast generation of AI video content with fluid motion." }, { url: hollywoodImg, badge: "WINTER PROTOCOL", title: "HOLLYWOOD VFX GRADE", subtitle: "Epic cinematic battles and CGI-level detail for your video and photo projects." }];
export const MY_VIDEOS = [{ id: "dQw4w9WgXcQ", title: "PROTOCOL: How to install React Source Code", fallbackDesc: "Guide for setting up the development environment and deployment to Netlify." }];
export const DEFAULT_FAQ = [{ question: "V8 Architecture", answer: "Triple-injection protocol for high-fidelity output." }, { question: "Value Multiplier", answer: "Algorithmic expansion for 880,000+ combinations." }, { question: "Google Veo 3.1", answer: "Optimized temporal consistency for motion engines." }];
export const STATUSES = ["MATRIX: ONLINE", "V8 ENGINE: OPTIMAL", "SECURE CONNECTION"];
export const SALES_NAMES = ["Michael T.", "David K.", "Sarah L.", "James W.", "Elena R.", "Alex M.", "Chris P.", "Tom H."];
export const SALES_COUNTRIES = ["USA", "UK", "Canada", "Germany", "Australia", "France", "Sweden", "Brazil"];
export const REVIEWS = ["Bro, these prompts are next level! - Alex M.", "The React source code saved me 3 weeks of dev. - Chris P.", "Absolutely insane detail in the Matrix generator. - Sarah L.", "Best AI asset investment I've made this year. - David K.", "10/10 quality. My clients are mind-blown. - Tom H.", "Finally, cinematic renders that actually look real. - Elena R."];

// --- V8 ENGINE DATA ---
export const CINEMATIC_ENVS = ["in a sprawling cyberpunk metropolis with neon reflections on wet asphalt", "standing on the edge of an ancient, crumbling ruin swallowed by a dense jungle", "inside a dimly lit, smoky 1920s speakeasy", "surrounded by the vast, empty dunes of an alien desert under twin moons"];
export const CINEMATIC_LIGHTS = ["volumetric god rays piercing through dense fog", "dramatic cinematic chiaroscuro with deep, consuming shadows", "harsh neon rim lighting isolating the subject", "cinematic backlighting creating a striking silhouette"];
export const CINEMATIC_CAMS = ["shot on ARRI Alexa 65, 35mm wide lens, f/1.8", "captured with Panavision 70mm, IMAX aspect ratio", "shot on RED Monstro 8K VV, classic 50mm cinematic lens", "Sony Venice 2, anamorphic anamorphic lenses with subtle blue flares"];
export const CINEMATIC_COLORS = ["classic Hollywood blockbuster teal and orange color grade", "muted, gritty, and desaturated dystopian color palette", "vibrant cyberpunk neon color grading", "rich, warm melancholic sepia tones"];
export const PHOTOREAL_ENVS = ["in a modern, minimalist living room with raw concrete textures", "on a busy intersection in Tokyo crossing during rush hour", "in a sterile, white, brightly lit medical facility", "standing in a lush, overgrown botanical greenhouse"];
export const PHOTOREAL_LIGHTS = ["perfectly balanced natural window light", "Rembrandt studio lighting setup with a softbox", "harsh direct midday sunlight creating razor-sharp shadows", "clinical overhead fluorescent lighting"];
export const PHOTOREAL_CAMS = ["shot on Hasselblad H6D-100c, 100MP medium format", "captured with Canon EOS R5, 85mm f/1.2 L lens, sharp focus", "photographed with Sony A7R IV, 90mm macro lens, extreme detail", "shot on Leica M11, 35mm Summilux lens"];
export const PHOTOREAL_COLORS = ["true-to-life hyper-accurate color reproduction", "Kodak Portra 400 film simulation, pleasing skin tones", "Fujifilm Superia 400 aesthetic", "perfectly neutral white balance"];
export const ABSTRACT_ENVS = ["floating freely within a void of non-Euclidean geometry", "inside a surreal, melting dreamscape defying the laws of physics", "in a quantum realm composed of vibrating energy strings", "surrounded by a multi-dimensional fractal structure of infinite mirrors"];
export const ABSTRACT_LIGHTS = ["ethereal, shifting bioluminescent aura", "psychedelic, rapidly changing strobe lighting", "iridescent light refraction acting like a prism", "intense chromatic aberration and neon light leaks"];
export const ABSTRACT_CAMS = ["viewed through a kaleidoscopic fractal lens filter", "tilt-shift macro photography distorting the scale completely", "simulated through an electron microscope 3D scan", "long exposure light painting capturing movement paths"];
export const ABSTRACT_COLORS = ["iridescent, pearlescent shifting hues", "vibrant synthwave vaporwave neon palette", "monochromatic void of absolute white and Vantablack", "chaotic, high-contrast optical illusion colors"];

// --- UNIQUE PHOTOREALISTIC PARAMETERS ---
const UNIQUE_DOP_STYLES = ["in the cinematographic style of Roger Deakins", "captured with the visual poeticism of Emmanuel Lubezki", "lighting designed by Robert Richardson", "shot with the atmospheric depth of Hoyte van Hoytema", "visual texture by Greig Fraser"];
const UNIQUE_LENSES = ["using Panavision C-Series Anamorphic glass", "shot with vintage Zeiss Super Speed T1.5 lenses", "captured on Cooke S4/i Optics", "using Leica Summilux-C prime lenses", "shot through Angénieux Optimo zoom for superior texture"];
const UNIQUE_LIGHTING = ["featuring a complex 3-point Rembrandt lighting setup", "illuminated by soft natural light with subtle negative fill", "dramatic high-contrast chiaroscuro lighting", "bathed in the ethereal glow of the blue hour", "using volumetric atmospheric scattering and god rays"];
const UNIQUE_TEXTURES = ["displaying ultra-fine skin pores and micro-surface details", "with realistic lens flares and organic film grain", "featuring perfect depth of field with creamy bokeh", "unfiltered RAW 100MP clarity", "hyper-accurate global illumination and Ray Tracing"];

// --- HELPER FUNKCIJE ---
export const getYouTubeId = (url) => { if (!url || url === "#") return null; const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/; const match = url.match(regExp); return (match && match[2].length === 11) ? match[2] : null; };
export const getMediaThumbnail = (url, type) => { if (!url) return bannerUrl; const ytId = getYouTubeId(url); if (ytId) return `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`; return url; };
export const formatExternalLink = (url) => { if (!url || url === "#") return "#"; return url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`; };
export const extractSys = (desc) => { let d = desc || ""; let s = { w: '', g: '', b: 'AI ASSET', t: 'LATEST ⚡' }; if (d.includes("|||SYS|||")) { const parts = d.split("|||SYS|||"); d = parts[0].trim(); try { s = { ...s, ...JSON.parse(parts[1]) }; } catch(e) {} } return { d: d, s }; };
export const SESSION_ID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
export const trackEvent = async (action, details = {}) => { try { await addDoc(collection(db, "site_stats"), { action, ...details, sessionId: SESSION_ID, localTime: Date.now(), timestamp: serverTimestamp(), userAgent: navigator.userAgent, path: window.location.pathname }); } catch (e) {} };

// --- V8 PROMPT GENERATOR FUNKCIJA ---
export const generatePrompts = (customerPrompt, demoInput, selectedQuality, selectedAR) => {
    let result = { single: '', abstract: '', cinematic: '', photoreal: '', cctv: '' };
    if (customerPrompt.trim().length > 0) {
        const env = CINEMATIC_ENVS[Math.floor(Math.random() * CINEMATIC_ENVS.length)];
        const light = CINEMATIC_LIGHTS[Math.floor(Math.random() * CINEMATIC_LIGHTS.length)];
        const cam = CINEMATIC_CAMS[Math.floor(Math.random() * CINEMATIC_CAMS.length)];
        const color = CINEMATIC_COLORS[Math.floor(Math.random() * CINEMATIC_COLORS.length)];
        const cleanInput = customerPrompt.trim();
        let finalPrompt = "";
        if (selectedQuality === '1x') finalPrompt = `A high-quality cinematic image of ${cleanInput}, located ${env}. The scene features ${light}. ${cam}, ${color}. Aspect ratio: ${selectedAR}.`;
        else if (selectedQuality === '2x') finalPrompt = `A breathtaking photorealistic render of ${cleanInput}, displaying monumental scale and precise details. Set ${env}. The environment is beautifully illuminated by ${light}. ${cam}, ${color}. Unreal Engine 5 render, 8k resolution, cinematic VFX. Aspect ratio: ${selectedAR}.`;
        else finalPrompt = `A hyper-realistic, award-winning cinematic masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${env}. The dramatic atmosphere is defined by ${light}. ${cam}, ${color}. Octane render, full ray tracing, global illumination, subsurface scattering, trending on CGSociety, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;
        result.single = finalPrompt;
    } 
    else if (demoInput.trim().length > 0) {
        const cleanInput = demoInput.trim().toUpperCase();
        const aEnv = ABSTRACT_ENVS[Math.floor(Math.random() * ABSTRACT_ENVS.length)];
        const aLight = ABSTRACT_LIGHTS[Math.floor(Math.random() * ABSTRACT_LIGHTS.length)];
        const aCam = ABSTRACT_CAMS[Math.floor(Math.random() * ABSTRACT_CAMS.length)];
        const aColor = ABSTRACT_COLORS[Math.floor(Math.random() * ABSTRACT_COLORS.length)];
        let pAbs = "";
        if (selectedQuality === '1x') pAbs = `A high-quality abstract representation of ${cleanInput}, located ${aEnv}. The scene features ${aLight}. ${aCam}, ${aColor}. Aspect ratio: ${selectedAR}.`;
        else if (selectedQuality === '2x') pAbs = `A breathtaking surreal render of ${cleanInput}, displaying monumental scale and mind-bending details. Set ${aEnv}. The environment is beautifully illuminated by ${aLight}. ${aCam}, ${aColor}. Octane render, 8k resolution, conceptual art. Aspect ratio: ${selectedAR}.`;
        else pAbs = `A hyper-detailed, award-winning abstract masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly constructed. The subject is perfectly placed ${aEnv}. The surreal atmosphere is defined by ${aLight}. ${aCam}, ${aColor}. Fluid simulation, full ray tracing, global illumination, subsurface scattering, trending on ArtStation, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

        const cEnv = CINEMATIC_ENVS[Math.floor(Math.random() * CINEMATIC_ENVS.length)];
        const cLight = CINEMATIC_LIGHTS[Math.floor(Math.random() * CINEMATIC_LIGHTS.length)];
        const cCam = CINEMATIC_CAMS[Math.floor(Math.random() * CINEMATIC_CAMS.length)];
        const cColor = CINEMATIC_COLORS[Math.floor(Math.random() * CINEMATIC_COLORS.length)];
        let pCin = "";
        if (selectedQuality === '1x') pCin = `A high-quality cinematic movie still of ${cleanInput}, located ${cEnv}. The scene features ${cLight}. ${cCam}, ${cColor}. Aspect ratio: ${selectedAR}.`;
        else if (selectedQuality === '2x') pCin = `A breathtaking cinematic blockbuster shot of ${cleanInput}, displaying monumental scale and precise details. Set ${cEnv}. The environment is beautifully illuminated by ${cLight}. ${cCam}, ${cColor}. Unreal Engine 5 render, 8k resolution, cinematic VFX. Aspect ratio: ${selectedAR}.`;
        else pCin = `A hyper-realistic, award-winning cinematic masterpiece of ${cleanInput}, featuring an unfathomable monumental scale, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${cEnv}. The dramatic atmosphere is defined by ${cLight}. ${cCam}, ${cColor}. Octane render, full ray tracing, global illumination, subsurface scattering, IMDb top rated aesthetic, ultra-maximalist, extremely meticulous detailing, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

        const pEnv = PHOTOREAL_ENVS[Math.floor(Math.random() * PHOTOREAL_ENVS.length)];
        const pLight = PHOTOREAL_LIGHTS[Math.floor(Math.random() * PHOTOREAL_LIGHTS.length)];
        const pCam = PHOTOREAL_CAMS[Math.floor(Math.random() * PHOTOREAL_CAMS.length)];
        const pColor = PHOTOREAL_COLORS[Math.floor(Math.random() * PHOTOREAL_COLORS.length)];
        let pPho = "";
        if (selectedQuality === '1x') pPho = `A high-quality raw photograph of ${cleanInput}, located ${pEnv}. The scene features ${pLight}. ${pCam}, ${pColor}. Aspect ratio: ${selectedAR}.`;
        else if (selectedQuality === '2x') pPho = `A breathtaking hyper-realistic photography of ${cleanInput}, displaying precise details and sharp focus. Set ${pEnv}. The environment is beautifully illuminated by ${pLight}. ${pCam}, ${pColor}. 8k resolution, professional studio quality. Aspect ratio: ${selectedAR}.`;
        else pPho = `An ultra-photorealistic, award-winning macro photography masterpiece of ${cleanInput}, incredibly intricate and painstakingly detailed. The subject is perfectly placed ${pEnv}. The natural atmosphere is defined by ${pLight}. ${pCam}, ${pColor}. Unfiltered RAW photo, extreme micro-details, global illumination, National Geographic aesthetic, true-to-life color depth, 32k UHD, absolute visual perfection. Aspect ratio: ${selectedAR}.`;

        // --- UNIQUE PHOTOREAL LOGIKA (Popravljena cenzura) ---
        const uDop = UNIQUE_DOP_STYLES[Math.floor(Math.random() * UNIQUE_DOP_STYLES.length)];
        const uLen = UNIQUE_LENSES[Math.floor(Math.random() * UNIQUE_LENSES.length)];
        const uLig = UNIQUE_LIGHTING[Math.floor(Math.random() * UNIQUE_LIGHTING.length)];
        const uTex = UNIQUE_TEXTURES[Math.floor(Math.random() * UNIQUE_TEXTURES.length)];
        
        // Cenzura cyberpunka za četvrto polje
        const cleanUniqueInput = demoInput.trim().replace(/cyberpunk/gi, '').replace(/neon/gi, '').trim().toUpperCase();

        result.cctv = `The most unique photorealistic image ever of ${cleanUniqueInput}. ${uDop}, ${uLen}. ${uLig}. ${uTex}. Absolute visual authenticity, 8k resolution, masterwork quality. Aspect ratio: ${selectedAR}.`;

        result.abstract = pAbs; result.cinematic = pCin; result.photoreal = pPho;
    }
    return result;
};