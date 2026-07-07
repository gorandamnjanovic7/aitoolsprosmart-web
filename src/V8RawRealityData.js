// POČETAK FAJLA: V8RawRealityData.js

// --- V8 FORENSIC ACQUISITION COMPONENTS (PREMIUM GEAR) ---
export const CAMERAS = [
  "RED V-RAPTOR 8K", "ARRI ALEXA 65", "SONY VENICE 2", 
  "IMAX 70mm", "Hasselblad H6D-100c", "Phase One XF IQ4"
];

export const LENSES = [
  "ARRI Signature Prime", "Zeiss Master Anamorphic", "Cooke S4/i", 
  "Panavision Primo", "Leica Summilux-C", "Canon K35"
];

export const FOCAL_LENGTHS = ["14mm ultra-wide", "24mm cinematic", "35mm", "50mm", "85mm macro"];

const CINEMATIC_ATMOSPHERES = [ 
  "bathed in volumetric god-rays and cinematic heavy fog", 
  "illuminated by striking, warm cinematic tungsten rim-lighting", 
  "surrounded by floating glowing embers in deep darkness", 
  "reflecting a hyper-detailed, unseen futuristic light source", 
  "lit by a single, dramatic cinematic spotlight in absolute pitch black", 
  "submerged in a glowing, ethereal bioluminescent atmosphere",
  "drenched in moody, high-contrast anamorphic lens flares",
  "perfectly illuminated by luxury studio softbox lighting"
];

const PREMIUM_ENHANCEMENTS = [
  "hyper-detailed 8k micro-contrast", 
  "subtle anamorphic horizontal light leaks",
  "perfect cinematic color grading with deep crushed shadows",
  "ultra-realistic optical depth of field with creamy bokeh",
  "shimmering iridescent reflections on the sharp edges",
  "breathtaking global illumination and ray-traced reflections",
  "flawless, commercial-grade luxury photography rendering"
];

// --- SEED GENERATOR ---
function seededRandom(seed) { 
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x); 
}

function pick(arr, seed) { 
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length]; 
}

// --- PROCEDURAL IDEA GENERATOR (EPIC, PREMIUM, NO BRANDS, NO PEOPLE) ---
const SUBJECTS = [
  "An unbranded, futuristic matte-black hypercar aerodynamic spoiler",
  "Intricate, unmarked gold mechanical watch tourbillon gears locking together",
  "A floating, ancient glowing crystal monolith humming with energy",
  "A massive, abandoned brutalist architectural marvel with flooded mirror-like marble floors",
  "Macro shot of bioluminescent alien flora glowing in the deep abyss",
  "A sleek, unbranded aerodynamic carbon-fiber motorcycle helmet visor",
  "Abstract, fluid motion of liquid gold and chrome freezing in mid-air",
  "A massive, unmarked starship thruster glowing with intense blue plasma",
  "Macro detail of a high-tech robotic iris lens mechanically adjusting",
  "A perfect, unbranded clear crystal luxury perfume bottle catching light",
  "A futuristic, glowing quantum energy core hovering in a magnetic field",
  "Ancient, glowing magical runes carved into dark, polished volcanic obsidian",
  "A close-up of a flawlessly forged damascus steel ceremonial blade glowing with internal heat",
  "Shattering geometric glass shapes frozen in mid-explosion",
  "A mysterious, glowing high-tech vault door slowly unlocking",
  "Macro view of an alien artifact made of shifting liquid metal",
  "An unbranded, high-performance futuristic drone engine glowing red-hot",
  "A levitating, unbranded luxury architectural concept model made of solid glass and platinum",
  "A macro shot of flawless, faceted diamonds suspended in a zero-gravity environment"
];

const ENVIRONMENTS = [
  "inside a pristine, ultra-luxury high-tech gallery.",
  "in the middle of a massive, dark futuristic architectural chasm.",
  "floating in the infinite, star-filled void of deep space.",
  "resting on a grand pedestal of dark, polished basalt.",
  "inside an ancient, forgotten subterranean temple ruin.",
  "in a futuristic, sterile white high-security laboratory.",
  "surrounded by a hyper-realistic, dark alien landscape.",
  "inside an atmospheric, pristine high-tech aerospace hangar."
];

// Generišemo tačno 500 premium ideja u bazu
const masterVault = [];
let seedCounter = 2026;

for (let i = 0; i < 500; i++) {
  const sub = pick(SUBJECTS, seedCounter++);
  const atmos = pick(CINEMATIC_ATMOSPHERES, seedCounter++);
  const env = pick(ENVIRONMENTS, seedCounter++);
  masterVault.push(`${sub} ${atmos} ${env}`);
}

// 🔥 EKSPLICITNA PODELA NA 3 NIVOA IDEJA (STARTER, PRO, ENTERPRISE) 🔥
export const starterVault = masterVault.slice(0, 50);
export const proVault = masterVault.slice(0, 200);
export const enterpriseVault = masterVault.slice(0, 500);

// --- MASTER PROMPT GENERATOR ENGINE ---
// Prima korisničku ideju i izbacuje tačan broj varijacija (50, 200, 500 promptova)
export function generateRawMatrix(baseIdea, count, baseSeed) {
  const prompts = [];
  
  for (let i = 0; i < count; i++) {
    const currentSeed = baseSeed + i * 777;
    const camera = pick(CAMERAS, currentSeed);
    const lens = pick(LENSES, currentSeed + 10);
    const focal = pick(FOCAL_LENGTHS, currentSeed + 20);
    const atmos = pick(CINEMATIC_ATMOSPHERES, currentSeed + 30);
    const enhancement = pick(PREMIUM_ENHANCEMENTS, currentSeed + 40);

    const hash = Math.abs(Math.sin(currentSeed) * 10000000).toString(16).substring(0, 8).toUpperCase();

    // The Master Formula - Striktno nula ljudi, teksta i brendova, ali EPIC rezultati
    const prompt = `${baseIdea}, ${atmos}, ${enhancement}. Shot on ${camera} with ${lens}, ${focal}. Commercial luxury photography, hyper-maximalist, breathtaking epic scale. Zero human presence, absolutely no text, no watermarks, no logos, unbranded. Masterpiece cinematic render. --ar 16:9 --style raw --v 6.0 [RAW-ID: ${hash}]`;
    
    prompts.push(prompt);
  }
  
  return prompts;
}
// KRAJ FAJLA: V8RawRealityData.js