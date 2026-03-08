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

// --- 1. CINEMATIC FORM (Holivudski filmovi) ---
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

// --- 2. PHOTOREALISTIC FORM (Sirova, surova realnost) ---
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

// --- 3. ABSTRACT FORM (Umetnost, vizije i nadrealno) ---
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

// --- 4. CCTV CAM FORM (Sirovi nadzor, found-footage, security feed) ---
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