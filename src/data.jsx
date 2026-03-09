import React from 'react';

// --- IMAGE IMPORTS ---
import zmajImg from './zmaj.jpg';
import novaSlikaImg from './nova-slika.png';
import slikaHubImg from './slika-hub.jpeg';
import slikaCopyImg from './slika-copy.jpeg';
import hollywoodImg from './hollywood.png';
import slikaVideoImg from './slika-video.jpeg';
import mojLogo from './logo.png';

// --- CLOUDINARY CONFIGURATION ---
export const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
export const CLOUDINARY_UPLOAD_PRESET = "uploads1"; 

// --- BRANDING ASSETS ---
export const logoUrl = mojLogo; 
export const bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

// --- BANNER / HERO SLIDER DATA ---
export const BANNER_DATA = [
  { url: slikaHubImg, badge: "CORE AI HUB", title: "Welcome to Our Hub", subtitle: "Command center for data control and generating complex AI architectures." },
  { url: zmajImg, badge: "DRAGON PROTOCOL", title: "ANCIENT EMPIRES REBORN", subtitle: "Generate epic, hyper-realistic scenes with dragons and mythical creatures in 8K resolution." },
  { url: novaSlikaImg, badge: "TIME TRAVELER", title: "UNIQUE PHOTO REALISTIC IMAGES", subtitle: "Merging incompatible historical eras using advanced AI Prompt engines." },
  { url: slikaCopyImg, badge: "CYBER STEALTH", title: "GHOST IN THE MACHINE", subtitle: "Professional prompts for digital art and high-detail cyberpunk visuals." },
  { url: slikaVideoImg, badge: "WARP SPEED", title: "TEMPORAL MOTION ENGINE", subtitle: "Optimized for ultra-fast generation of AI video content with fluid motion." },
  { url: hollywoodImg, badge: "WINTER PROTOCOL", title: "HOLLYWOOD VFX GRADE", subtitle: "Epic cinematic battles and CGI-level detail for your video and photo projects." }
];

// --- TUTORIALS & PRODUCTS ---
export const MY_VIDEOS = [{ id: "dQw4w9WgXcQ", title: "PROTOCOL: How to install React Source Code", fallbackDesc: "Guide for setting up the development environment and deployment to Netlify." }];
export const INITIAL_APPS = [{ id: "1", name: "Monument Architect", type: "AI PROMPT GENERATOR", price: "49", priceLifetime: "149", headline: "System protocol for massive digital sculptures and architecture.", description: "VALUE MULTIPLIER:\n* 880,000+ unique combinations\n* Optimized for Midjourney & Flux.1\n* Commercial license included", media: [{ url: zmajImg, type: 'image' }], whopLink: "https://whop.com/ai-tools-pro-smart[SPLIT]https://whop.com/checkout/react-source-code-monument", faq: [{ question: "V8 Architecture", answer: "Triple-injection protocol for high-fidelity output." }] }];
export const DEFAULT_FAQ = [{ question: "V8 Architecture", answer: "Triple-injection protocol for high-fidelity output." }, { question: "Value Multiplier", answer: "Algorithmic expansion for 880,000+ combinations." }, { question: "Google Veo 3.1", answer: "Optimized temporal consistency for motion engines." }];
export const TERMINAL_LINES = ["Establishing secure remote connection...", "Bypassing Matrix protocols...", "Decrypting AI Asset Registry...", "Loading high-fidelity resources...", "System integration complete.", "ACCESS GRANTED."];
export const STATUSES = ["MATRIX: ONLINE", "V8 ENGINE: OPTIMAL", "SECURE CONNECTION"];
export const SALES_NAMES = ["Michael T.", "David K.", "Sarah L.", "James W.", "Elena R.", "Alex M.", "Chris P.", "Tom H."];
export const SALES_COUNTRIES = ["USA", "UK", "Canada", "Germany", "Australia", "France", "Sweden", "Brazil"];
export const REVIEWS = ["Bro, these prompts are next level! - Alex M.", "The React source code saved me 3 weeks of dev. - Chris P.", "Absolutely insane detail in the Matrix generator. - Sarah L.", "Best AI asset investment I've made this year. - David K.", "10/10 quality. My clients are mind-blown. - Tom H.", "Finally, cinematic renders that actually look real. - Elena R."];

// ============================================================================
// 10X PROMPT ENHANCER MOTOR (V8 ARHITEKTURA) - KATEGORIZOVANI PODACI
// ============================================================================

export const CINEMATIC_ENVS = [
  "in a sprawling cyberpunk metropolis with neon reflections on wet asphalt", "standing on the edge of an ancient, crumbling ruin swallowed by a dense jungle", "inside a dimly lit, smoky 1920s speakeasy", "surrounded by the vast, empty dunes of an alien desert under twin moons", "in a hyper-futuristic pristine laboratory with massive glass walls", "deep inside a glowing bioluminescent underwater cavern", "on a rain-slicked helipad overlooking a dystopian megacity", "in the center of an epic medieval battlefield covered in fog and ash"
];
export const CINEMATIC_LIGHTS = [
  "volumetric god rays piercing through dense fog", "dramatic cinematic chiaroscuro with deep, consuming shadows", "harsh neon rim lighting isolating the subject", "cinematic backlighting creating a striking silhouette", "warm golden hour sunlight casting long shadows", "moody, practical low-key lighting", "dynamic flare and specular highlights from anamorphic lenses", "pulsing cyberpunk neon glow from off-camera"
];
export const CINEMATIC_CAMS = [
  "shot on ARRI Alexa 65, 35mm wide lens, f/1.8", "captured with Panavision 70mm, IMAX aspect ratio", "shot on RED Monstro 8K VV, classic 50mm cinematic lens", "Sony Venice 2, anamorphic anamorphic lenses with subtle blue flares", "Cooke Anamorphic /i lenses, soft cinematic bokeh", "shot on 35mm Kodak celluloid film, cinematic motion blur", "drone sweeping aerial shot, ultra-wide angle", "low angle tracking shot, Steadicam stabilization"
];
export const CINEMATIC_COLORS = [
  "classic Hollywood blockbuster teal and orange color grade", "muted, gritty, and desaturated dystopian color palette", "vibrant cyberpunk neon color grading", "rich, warm melancholic sepia tones", "high-contrast dramatic HDR colors", "vintage 1970s film stock aesthetic with fine grain", "monochromatic noir with a single piercing accent color"
];

export const PHOTOREAL_ENVS = [
  "in a modern, minimalist living room with raw concrete textures", "on a busy intersection in Tokyo crossing during rush hour", "in a sterile, white, brightly lit medical facility", "standing in a lush, overgrown botanical greenhouse", "against a clean, seamless photography studio backdrop", "in a messy, detail-rich artist's workshop", "on a rocky, moss-covered cliff face near a roaring ocean", "inside an abandoned, rust-covered industrial warehouse"
];
export const PHOTOREAL_LIGHTS = [
  "perfectly balanced natural window light", "Rembrandt studio lighting setup with a softbox", "harsh direct midday sunlight creating razor-sharp shadows", "clinical overhead fluorescent lighting", "soft, diffused overcast sky lighting", "professional ring light reflection in the eyes", "bounced fill light revealing micro-details", "subtle ambient glow from nearby practical lamps"
];
export const PHOTOREAL_CAMS = [
  "shot on Hasselblad H6D-100c, 100MP medium format", "captured with Canon EOS R5, 85mm f/1.2 L lens, sharp focus", "photographed with Sony A7R IV, 90mm macro lens, extreme detail", "shot on Leica M11, 35mm Summilux lens", "Phase One XF IQ4 camera system, absolute optical perfection", "Nikon Z9, 50mm f/1.8, razor-thin depth of field", "unfiltered RAW photo, 8k resolution, macro-level clarity", "iPhone 15 Pro Max, Apple ProRAW, computational photography"
];
export const PHOTOREAL_COLORS = [
  "true-to-life hyper-accurate color reproduction", "Kodak Portra 400 film simulation, pleasing skin tones", "Fujifilm Superia 400 aesthetic", "perfectly neutral white balance", "rich, naturally saturated earthy tones", "unfiltered, raw, zero-post-processing aesthetic", "clinical, high-fidelity color depth"
];

export const ABSTRACT_ENVS = [
  "floating freely within a void of non-Euclidean geometry", "inside a surreal, melting dreamscape defying the laws of physics", "in a quantum realm composed of vibrating energy strings", "surrounded by a multi-dimensional fractal structure of infinite mirrors", "in a liminal space consisting of endless, morphing corridors", "trapped inside the core of a crystalline tesseract hypercube", "within a fluid, constantly shifting nebula of pure energy", "in an avant-garde digital brutalist environment"
];
export const ABSTRACT_LIGHTS = [
  "ethereal, shifting bioluminescent aura", "psychedelic, rapidly changing strobe lighting", "iridescent light refraction acting like a prism", "intense chromatic aberration and neon light leaks", "UV blacklight reactive glow illuminating hidden patterns", "impossible omnidirectional lighting without a source", "holographic, glitching light projections", "pure energy emission glowing from within"
];
export const ABSTRACT_CAMS = [
  "viewed through a kaleidoscopic fractal lens filter", "tilt-shift macro photography distorting the scale completely", "simulated through an electron microscope 3D scan", "long exposure light painting capturing movement paths", "glitch art perspective with data moshing artifacts", "fluid dynamic simulation rendering engine", "rendered in Unreal Engine 5 with recursive ray tracing", "abstract geometric wide-angle fisheye lens"
];
export const ABSTRACT_COLORS = [
  "iridescent, pearlescent shifting hues", "vibrant synthwave vaporwave neon palette", "monochromatic void of absolute white and Vantablack", "chaotic, high-contrast optical illusion colors", "pastel, soft dreamcore aesthetic with surreal gradients", "acid-trip psychedelic spectrum", "vivid, bleeding color splashes on a dark canvas"
];

export const CCTV_ENVS = [
  "in a dimly lit underground parking garage", "at a deserted gas station at 3 AM", "inside a narrow, flickering apartment hallway", "overlooking a barbed-wire industrial compound fence", "in a messy, abandoned convenience store aisle", "at a desolate subway station platform late at night", "outside a suburban front porch with motion sensor lights", "in a high-security bank vault corridor"
];
export const CCTV_LIGHTS = [
  "harsh infrared night vision glow", "flickering fluorescent overhead lights", "washed-out low-light camera sensor artifacting", "stark motion-activated floodlight illumination", "sodium vapor streetlamp glow casting deep shadows", "blown-out highlight glare from passing car headlights", "uneven, grainy low-lux ambient lighting", "creepy green-tinted night vision lighting"
];
export const CCTV_CAMS = [
  "shot on an old VHS security feed, noticeable tracking lines", "captured with a cheap 480p wide-angle dome camera, extreme fisheye distortion", "Wyze or Ring doorbell cam aesthetic, heavily compressed mp4 artifacting", "commercial 1080p IP camera, timestamp overlay in the top right corner", "raw unedited found-footage, heavy sensor noise, low dynamic range", "black and white thermal security camera, low frame rate motion blur", "wide-angle focal length, severe lens vignetting and chromatic aberration", "dashcam dashboard camera perspective, dirty windshield glare"
];
export const CCTV_COLORS = [
  "monochromatic grayscale with heavy digital noise", "sickly green infrared night vision tint", "desaturated, muddy colors with poor white balance", "washed out contrast due to cheap lens coating", "over-saturated yellow from sodium streetlights", "glitchy color banding and heavy compression artifacts", "stark black and white thermal contrast"
];


// ============================================================================
// HELPER FUNKCIJE & SVG KOMPONENTE
// ============================================================================

export const getYouTubeId = (url) => {
  if (!url || url === "#") return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getMediaThumbnail = (url, type) => {
  if (!url) return bannerUrl;
  const ytId = getYouTubeId(url);
  if (ytId) return `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
  return url;
};

export const formatExternalLink = (url) => {
  if (!url || url === "#") return "#";
  return url.trim().startsWith("http") ? url.trim() : `https://${url.trim()}`;
};

export const extractSys = (desc) => {
  let d = desc || ""; let s = { w: '', g: '', b: 'AI ASSET', t: 'LATEST ⚡' };
  if (d.includes("|||SYS|||")) {
      const parts = d.split("|||SYS|||"); d = parts[0].trim();
      try { s = { ...s, ...JSON.parse(parts[1]) }; } catch(e) {}
  }
  return { d: d, s };
};

// --- SVG Icons ---
export const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <path fill="url(#ig-grad)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.2c0 1.95-.53 3.92-1.59 5.51-1.48 2.22-3.8 3.56-6.42 3.65-2.6.09-5.18-.9-6.99-2.75-1.68-1.71-2.58-4.08-2.45-6.48.11-2.14 1.05-4.18 2.62-5.63 1.54-1.43 3.63-2.17 5.74-2.15v4.01c-1.39-.01-2.8.46-3.84 1.39-1.07.95-1.63 2.4-1.53 3.86.11 1.46.9 2.8 2.09 3.64 1.34 1.01 3.19 1.25 4.8.72 1.5-.49 2.63-1.68 3.12-3.15.19-.57.26-1.17.26-1.77V.02h4.11z"/>
  </svg>
);