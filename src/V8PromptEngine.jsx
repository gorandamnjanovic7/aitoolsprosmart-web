// POČETAK FAJLA: V8PromptEngine.jsx
import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Zap, Lock, ShieldCheck, FileText, FileJson, Trash2, LayoutGrid } from "lucide-react";
import { auth, db } from './firebase'; 
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { v8Toast } from './App'; 

// 🎯 GLAVNI PREKIDAČ ZA ODRŽAVANJE 🎯
// Stavi na 'false' kada želiš da otključaš stranicu klijentima
const UNDER_CONSTRUCTION = true; 

const DEFAULT_CATEGORIES = [
  "Luxury abstract sculpture",
  "Ancient Roman epic scene",
  "Michelin fine dining",
  "Chocolate dessert macro",
  "Blue cocktail splash reference",
  "Red liquid splash reference",
  "Supercar with drone",
  "Luxury Swiss watch",
  "Fierce Viking warrior in battle",
  "Ancient Aztec golden city aerial",
  "Spartan gladiator in arena dust",
  "Samurai commander cinematic portrait",
  "Hypercar drifting on neon street",
  "Luxury SUV in snowy mountain pass",
  "Matte black motorcycle studio shot",
  "Classic vintage race car macro detail",
  "Dark obsidian smartphone with glowing edges",
  "Premium dark cosmetics glass bottle",
  "Minimalist black leather designer bag",
  "Matte black luxury headphones",
  "Golden coffee beans splashing in espresso",
  "Smoky whiskey glass with glowing ice cube",
  "Dark marble and liquid gold texture",
  "Gourmet sushi premium macro photography",
  "Luxury modern villa with infinity pool",
  "High-fashion editorial neon lighting",
  "First-class private jet interior",
  "Cinematic cyberpunk street level"
];

const DEFAULT_DETAILS = [
  "An impossible luxury abstract sculpture made of black obsidian, smoked glass, liquid chrome and polished gold ribbons, floating in a dark premium studio with dramatic spotlighting, realistic reflections, micro-scratches and gallery-grade composition, unbranded, no text.",
  "A breathtaking ancient Roman epic scene with a heroic commander in ornate bronze and gold armor, red cape, plumed helmet, elite legionaries behind him, imperial architecture, cinematic sunlight, Hollywood-scale historical realism, clean, no logos.",
  "A Michelin-star luxury gourmet plate on matte black ceramic, premium seafood, delicate sauce dots, microgreens, edible flowers, edible gold accents, shallow depth of field, restaurant-grade macro photography, clean, no text.",
  "A decadent layered chocolate cake with rich dark sponge, thick glossy ganache slowly dripping over the edges, moist texture, chocolate shavings, warm moody dessert lighting, premium bakery macro detail, unbranded.",
  "A premium blue cocktail in a crystal martini glass with sparkling bubbles, frozen splash above the rim, orange wedge garnish, frosty tabletop, dark blue-and-amber bar lighting, hyper-realistic beverage photography, clean.",
  "A dramatic crimson-red liquid splash explosion frozen mid-air, glossy translucent droplets, suspended liquid sheets, black moody background, sharp high-speed macro photography, luxury commercial splash-art energy, unbranded.",
  "An unbranded futuristic supercar racing on a dramatic mountain highway, a professional drone flying above it, aggressive aerodynamic body, glossy carbon reflections, dust particles, golden-hour light, premium automotive advertising look.",
  "A luxury Swiss-style wristwatch inspired by ultra-premium dress-watch design, rose-gold case, dark elegant dial, polished sapphire crystal, leather strap, macro product photography, dark black-and-gold studio background, zero text/logos.",
  "Fierce Viking warrior in battle, rugged armor, cinematic fur and leather textures, dramatic lighting, epic frozen landscape, ultra-realistic action, clean, no text, no branding.",
  "Aerial view of ancient Aztec golden city, monumental pyramids, lush jungle environment, sunlight streaming through clouds, epic historical scale, hyper-realistic, unbranded, no logos.",
  "Spartan gladiator in arena dust, bronze helmet, intense cinematic lighting, high-contrast, historical grit, ultra-detailed skin textures, clean commercial composition, no text.",
  "Samurai commander cinematic portrait, intricate traditional armor, soft studio rim light, moody atmosphere, cinematic color grade, hyper-realistic details, zero logos, no text.",
  "Hypercar drifting on neon street, wet asphalt reflections, motion blur, glowing lights, unbranded automotive design, high-end commercial aesthetic, zero branding, clean.",
  "Luxury SUV in snowy mountain pass, dramatic vertical shot, cinematic cold lighting, pristine nature, unbranded modern vehicle, premium advertising finish, zero text, clean.",
  "Matte black motorcycle studio shot, dramatic rim lighting, sharp metallic details, dark background, unbranded custom build, premium product photography, zero text/logos.",
  "Classic vintage race car macro detail, polished chrome and worn leather textures, vintage cinematic vibe, shallow depth of field, clean composition, unbranded, no text.",
  "Dark obsidian smartphone with glowing edges, bezel-less screen, sleek glass finish, premium dark environment, macro product lighting, futuristic tech aesthetic, clean, no logos.",
  "Premium dark cosmetics glass bottle, elegant fluid texture, dark gold accents, luxury studio lighting, high-end skincare aesthetic, clean commercial shot, zero text/branding.",
  "Minimalist black leather designer bag, premium texture, dark elegant studio light, sharp details, luxury fashion photography, unbranded, no logos, clean composition.",
  "Matte black luxury headphones, premium metal and leather finish, moody studio light, sharp macro details, high-end audio tech vibe, clean composition, unbranded, no logos.",
  "Golden coffee beans splashing in espresso, rich liquid swirls, cinematic warm light, dark moody background, premium culinary photography, macro detail, clean, no text.",
  "Smoky whiskey glass with glowing ice cube, premium crystal clarity, moody atmospheric light, macro detail, sophisticated bar aesthetic, unbranded, no watermarks, clean.",
  "Dark marble and liquid gold texture, elegant fluid abstract art, dramatic shadows, premium luxury material aesthetic, macro photography, unbranded, zero logos.",
  "Gourmet sushi premium macro photography, artistic arrangement, delicate textures, dark slate background, professional culinary lighting, clean aesthetic, no text.",
  "Luxury modern villa with infinity pool, twilight sky, architectural perfection, warm interior glow, cinematic vertical framing, elite property photography, clean, no text.",
  "High-fashion editorial neon lighting, moody dark atmosphere, clean composition, professional aesthetic, zero branding, zero logos, cinematic lighting.",
  "First-class private jet interior, leather textures, warm ambient lighting, premium luxury travel lifestyle, portrait framing, unbranded, zero logos.",
  "Cinematic cyberpunk street level, dark futuristic urban vibe, wet reflective surfaces, neon rim lighting, high-end motion picture aesthetic, clean, no text."
];

const STYLE_PRESETS = {
  "Nano Banana 2 / Pro": {
    label: "Nano Banana 2 / Pro",
    suffix: "ultra-detailed, premium commercial realism, clean prompt structure, strong subject separation, high-end cinematic lighting, anti-plastic realism"
  },
  "Universal Image Generator": {
    label: "Universal Image Generator",
    suffix: "photorealistic, high-resolution, clean composition, premium advertising polish, realistic materials, sharp details"
  },
  "Stock Contributor Safe": {
    label: "Stock Contributor Safe",
    suffix: "stock-ready, no brands, no logos, no text, no copyrighted marks, no watermark, commercially clean composition, realistic premium finish"
  }
};

const CAMERA_PRESETS = [
  "shot on ARRI Alexa 65 with Panavision anamorphic optics",
  "RED V-RAPTOR 8K look with Zeiss Supreme Prime lens character",
  "Sony Venice 2 color science with Leica Summilux rendering",
  "IMAX-inspired framing with premium optical depth",
  "Hasselblad medium-format commercial photography look",
  "Phase One studio advertising look, ultra-clean detail"
];

// POČETAK FUNKCIJE: seededRandom
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
// KRAJ FUNKCIJE: seededRandom

// POČETAK FUNKCIJE: pick
function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}
// KRAJ FUNKCIJE: pick

// POČETAK FUNKCIJE: seededShuffle
function seededShuffle(array, seed) {
  let s = seed;
  const shuffled = [...array];
  for (let k = shuffled.length - 1; k > 0; k--) {
    s = Math.sin(s) * 10000;
    const r = Math.floor((s - Math.floor(s)) * (k + 1));
    [shuffled[k], shuffled[r]] = [shuffled[r], shuffled[k]];
  }
  return shuffled;
}
// KRAJ FUNKCIJE: seededShuffle

// POČETAK FUNKCIJE: autoDescription
function autoDescription(category, index, seed) {
  const c = category.toLowerCase();
  const camera = pick(CAMERA_PRESETS, seed + index * 31);
  if (c.includes("abstract") || c.includes("sculpture") || c.includes("art")) return `${category}, a unique luxury abstract object made from black glass, smoky crystal, brushed titanium, liquid chrome and polished gold accents, dramatic dark studio lighting, elegant reflections, gallery-grade composition, realistic surface imperfections, ${camera}.`;
  if (c.includes("roman") || c.includes("rim") || c.includes("empire") || c.includes("warrior")) return `${category}, a cinematic ancient imperial scene with elite Roman characters, ornate armor, red fabric accents, plumed helmets, monumental stone architecture, warm sunlight, dust atmosphere, historically inspired epic realism, ${camera}.`;
  if (c.includes("michelin") || c.includes("fine dining") || c.includes("gourmet") || c.includes("food")) return `${category}, ultra-premium gourmet plating on a matte black ceramic dish, delicate sauce work, microgreens, edible flowers, refined culinary textures, shallow depth of field, luxury restaurant macro photography, ${camera}.`;
  if (c.includes("chocolate") || c.includes("dessert") || c.includes("cake")) return `${category}, decadent luxury dessert with rich layers, glossy dripping glaze, realistic moist texture, elegant crumbs, warm cinematic highlights, premium bakery close-up, shallow depth of field, ${camera}.`;
  if (c.includes("cocktail") || c.includes("drink") || c.includes("beverage") || c.includes("blue")) return `${category}, premium beverage photograph with crystal glass clarity, dynamic frozen splash, floating droplets, citrus garnish, glossy reflections, dark luxury bar background, high-speed commercial drink photography, ${camera}.`;
  if (c.includes("liquid") || c.includes("splash") || c.includes("red")) return `${category}, dramatic macro fluid artwork with glossy suspended droplets, translucent liquid sheets, explosive motion frozen in time, deep black background, high-speed photography feel, ultra-realistic fluid physics, ${camera}.`;
  if (c.includes("supercar") || c.includes("hypercar") || c.includes("car") || c.includes("auto")) return `${category}, an unbranded futuristic performance car in a cinematic road scene, visible drone flying above, aggressive aerodynamic body, glossy reflections, dust atmosphere, golden-hour lighting, luxury automotive campaign look, ${camera}.`;
  if (c.includes("watch") || c.includes("swiss") || c.includes("timepiece")) return `${category}, ultra-luxury wristwatch macro photography, polished premium case, dark elegant dial, visible mechanical complications, sapphire reflections, leather strap, black-and-gold studio lighting, refined product-advertising finish, ${camera}.`;
  return `${category}, ultra-detailed premium commercial image with cinematic lighting, realistic materials, elegant composition, deep blacks, controlled highlights, subtle imperfections, anti-plastic realism, ${camera}.`;
}
// KRAJ FUNKCIJE: autoDescription

// POČETAK FUNKCIJE: makeSinglePrompt
function makeSinglePrompt({ categories, details, seed, presetName, strictNoBrand, includeNegative }) {
  const preset = STYLE_PRESETS[presetName] || STYLE_PRESETS["Nano Banana 2 / Pro"];
  const descriptions = categories.map((cat, i) => {
    const manual = (details[i] || "").trim();
    return manual.length > 0 ? manual : autoDescription(cat, i, seed);
  });
  
  const brandLock = strictNoBrand
    ? "All panels must be clean commercial-safe visuals: no visible logos, no readable brand names, no trademark marks, no text, no captions."
    : "Avoid random text, captions, watermarks and messy symbols.";
  
  const gridLock = "CRITICAL GRID FORMAT: Every single panel must be one solid, unbroken image. Do NOT split, divide, or stack multiple images inside a single panel. No horizontal strips, no letterboxing, no borders within panels. Each panel fills its entire cell completely.";
  
  const negative = includeNegative
    ? " NEGATIVE PROMPT: split panels, divided panels, stacked images in one slot, horizontal strips, letterboxing, inner borders, multiple sub-images per panel, duplicate panels, repeated subjects, repeated compositions, extra panels, missing panels, broken grid, distorted layout, UI, browser interface, app screenshot elements, captions, typography, random letters, watermark, signature, visible logos, readable brand names, low resolution, blurry details, plastic CGI look."
    : "";

  return `Create a single premium cinematic collage image in a strict 2-row by 4-column grid (exactly 8 equal-size panels), with a strict 16:9 aspect ratio. Optimized exclusively for Google Nano Banana 2 engine. CRITICAL CONTROL LOCK: All 8 panels MUST be 100% visually different and unique. No duplicated images, no repeated subjects, no repeated camera angles or compositions anywhere in the grid. Each panel must represent a completely distinct visual identity. ${gridLock} ${brandLock} Panel descriptions: 1) ${descriptions[0]}. 2) ${descriptions[1]}. 3) ${descriptions[2]}. 4) ${descriptions[3]}. 5) ${descriptions[4]}. 6) ${descriptions[5]}. 7) ${descriptions[6]}. 8) ${descriptions[7]}. GLOBAL STYLE: ${preset.suffix}, cohesive premium collage, cinematic realism, realistic reflections, subtle film grain, deep blacks, controlled highlights, luxury black-and-gold color grade, sharp but not oversharpened, expensive editorial finish.${negative}`;
}
// KRAJ FUNKCIJE: makeSinglePrompt

// POČETAK FUNKCIJE: makeVariations
function makeVariations(options) {
  let pool = [];
  let shuffleCounter = 0;
  
  return Array.from({ length: 100 }, (_, i) => {
    const currentSeed = options.seed + i * 101;
    
    while(pool.length < 8) {
       const allIndices = Array.from({ length: options.categories.length }, (_, idx) => idx);
       const shuffled = seededShuffle(allIndices, options.seed + shuffleCounter * 999);
       pool = pool.concat(shuffled);
       shuffleCounter++;
    }
    
    const selectedIndices = pool.splice(0, 8);
    const selectedCategories = selectedIndices.map(idx => options.categories[idx]);
    const selectedDetails = selectedIndices.map(idx => options.details[idx]);

    return makeSinglePrompt({ 
        ...options, 
        categories: selectedCategories,
        details: selectedDetails,
        seed: currentSeed 
    });
  });
}
// KRAJ FUNKCIJE: makeVariations


// POČETAK FUNKCIJE: V8PromptEngine
export default function V8PromptEngine() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [seed, setSeed] = useState(2026);
  const [presetName, setPresetName] = useState("Nano Banana 2 / Pro");
  const [strictNoBrand, setStrictNoBrand] = useState(true);
  const [includeNegative, setIncludeNegative] = useState(true);
  
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [isLocked, setIsLocked] = useState(true);
  const PROMPT_LIMIT = 3000;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const email = currentUser.email.toLowerCase();
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
           setIsVIP(true); setIsLocked(false); return;
        }
        try {
          const docRef = doc(db, "vip_users", email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().unlockedApps) {
            const unlocked = docSnap.data().unlockedApps;
            if (unlocked.includes('V8_PROMPT_ENGINE') || unlocked.includes('FULL_ACCESS')) {
               setIsVIP(true);
               const used = docSnap.data().promptsUsed || 0;
               setPromptsUsed(used);
               if (used >= PROMPT_LIMIT) setIsLocked(true); else setIsLocked(false);
            }
          }
        } catch (e) { console.error("VIP check failed", e); }
      } else {
        setUser(null); setIsVIP(false); setIsLocked(true);
      }
    });
    return () => unsub();
  }, []);

  const updateCategory = (index, value) => setCategories(prev => { const next = [...prev]; next[index] = value; return next; });
  const updateDetail = (index, value) => setDetails(prev => { const next = [...prev]; next[index] = value; return next; });

  const recordUsage = async () => {
      if (user && isVIP && user.email !== "damnjanovicgoran7@gmail.com" && user.email !== "aitoolsprosmart@gmail.com") {
          const newUsage = promptsUsed + 100;
          setPromptsUsed(newUsage);
          try {
              await setDoc(doc(db, "vip_users", user.email.toLowerCase()), { promptsUsed: newUsage }, { merge: true });
              if (newUsage >= PROMPT_LIMIT) setIsLocked(true);
          } catch(e) { console.error("Failed to update limit", e); }
      }
  };

  const handleGenerate100 = () => {
      if (isLocked) { v8Toast.error("Engine Locked or Quota Exceeded."); return; }
      const newPrompts = makeVariations({ categories, details, seed, presetName, strictNoBrand, includeNegative });
      setGeneratedPrompts(newPrompts);
      setCopiedStates({});
      recordUsage();
      v8Toast.success("100 Unique Prompts Generated!");
  };

  const handleRegenerate100 = () => {
      if (isLocked) { v8Toast.error("Engine Locked or Quota Exceeded."); return; }
      const newSeed = Math.floor(Math.random() * 999999);
      setSeed(newSeed);
      const newPrompts = makeVariations({ categories, details, seed: newSeed, presetName, strictNoBrand, includeNegative });
      setGeneratedPrompts(newPrompts);
      setCopiedStates({});
      recordUsage();
      v8Toast.success("Regenerated 100 New Prompts!");
  };

  const clearPrompts = () => {
      setGeneratedPrompts([]);
      setCopiedStates({});
  };

  const outputTextAll = generatedPrompts.map((p, i) => `PROMPT ${i + 1}\n${p}`).join("\n\n------------------------------------------------------------\n\n");

  const downloadTxt = () => {
    if (isLocked || generatedPrompts.length === 0) return;
    const blob = new Blob([outputTextAll], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `V8-grid-pack-100-prompts-seed-${seed}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const downloadJson = () => {
    if (isLocked || generatedPrompts.length === 0) return;
    const jsonObj = generatedPrompts.map((p, i) => ({ id: i+1, prompt: p }));
    const blob = new Blob([JSON.stringify(jsonObj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `V8-grid-pack-100-prompts-seed-${seed}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copySingle = async (index, text) => {
    if (isLocked) { v8Toast.error("Engine Locked or Quota Exceeded."); return; }
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [index]: true }));
    v8Toast.success(`Prompt ${index + 1} copied!`);
  };

  const clearDetails = () => setDetails(new Array(28).fill(""));


  // 🎯 AKO JE AKTIVNO ODRŽAVANJE, PRIKAZUJEMO SAMO OVAJ EKRAN BEZ OSTATKA FORME 🎯
  if (UNDER_CONSTRUCTION) {
    return (
      <div className="min-h-[75vh] w-full flex items-center justify-center px-4 font-sans py-20">
        <div className="bg-gradient-to-br from-[#0a1930] to-[#040b16] border border-blue-500/50 rounded-[2.5rem] p-10 md:p-14 max-w-2xl w-full text-center shadow-[0_0_80px_rgba(59,130,246,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="mx-auto w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-400/30 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <Lock className="w-10 h-10 text-blue-400" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-widest mb-4 drop-shadow-md">
                SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">UPDATING</span>
            </h2>
            
            <p className="text-blue-200 text-sm md:text-base font-medium leading-relaxed mb-8 max-w-lg mx-auto">
                This module is currently in the final stages of development and will be deployed shortly. 
                The engine is exclusively engineered for mass prompt generation in the premium <strong>2x4 Grid format</strong> (8 panels), perfectly optimized for Google Nano Banana 2.
            </p>

            <div className="mx-auto bg-black/60 p-5 rounded-2xl border border-blue-500/30 w-fit shadow-inner mb-8">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-4 text-center">2x4 Layout Format</p>
                <div className="grid grid-cols-4 grid-rows-2 gap-2">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-12 h-8 bg-blue-500/20 border border-blue-500/40 rounded-md flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            <span className="text-[10px] font-black text-blue-300 opacity-60">{i+1}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="inline-block bg-blue-500/10 border border-blue-500/30 px-6 py-2.5 rounded-full text-blue-300 font-black uppercase tracking-[0.2em] text-[11px] animate-pulse">
                DEPLOYMENT PENDING...
            </div>
        </div>
      </div>
    );
  }
  // 🎯 KRAJ ODRŽAVANJA 🎯


  if (!user || (!isVIP && !isLocked)) {
      return (
        <div className="min-h-[75vh] flex items-center justify-center px-6 font-sans">
            <div className="max-w-md w-full bg-[#0a0a0a] border border-orange-500/40 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(234,88,12,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <Lock className="w-16 h-16 text-orange-500 mx-auto mb-6 opacity-80" />
                <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">V8 PROMPT ENGINE</h2>
                <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-8">Access restricted to Premium Lifetime Members.</p>
                <div className="bg-black/50 border border-white/10 p-5 rounded-2xl mb-8 text-left">
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4">The ultimate mass-production text engine for cinematic grids. Value: <strong className="text-white">$250</strong>.</p>
                    <p className="text-orange-400 text-xs font-bold bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">Unlocked FREE when you purchase any V8 Masterwork Bundle from the Stock Market.</p>
                </div>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen pt-10 pb-20 px-4 md:px-8 text-white font-sans relative">
      
      <div className="mx-auto max-w-7xl space-y-8 relative z-10">
        
        {/* V8 HEADER */}
        <div className="rounded-[2.5rem] border border-orange-500/30 bg-[#0a0a0a] p-8 shadow-[0_0_40px_rgba(234,88,12,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between relative z-10">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-400 shadow-inner">
                <Zap size={12} className="animate-pulse" /> V8 PROMPT ENGINE
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                GRID COLLAGE <span className="text-orange-500">FACTORY</span>
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-400 text-sm md:text-base font-medium">
                The ultimate text-generation algorithm strictly optimized for Google Nano Banana 2. Fixed at 16:9 cinematic aspect ratio.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-xl">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Monthly Quota</span>
                    <span className="text-xs font-mono font-bold text-white"><span className={promptsUsed > 2500 ? "text-red-500" : "text-green-400"}>{promptsUsed}</span> / {PROMPT_LIMIT}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
              <h2 className="mb-6 text-lg font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Engine Parameters</h2>

              <div className="grid gap-5">
                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">ALGORITHM SEED</span>
                  <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value || 0))} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-mono outline-none focus:border-orange-500 transition-colors" />
                </label>

                <label className="space-y-2 opacity-50 cursor-not-allowed">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">ASPECT RATIO (LOCKED)</span>
                  <input type="text" value="16:9 (Cinematic)" disabled className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-bold uppercase outline-none" />
                </label>

                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">PRESET STYLE</span>
                  <select value={presetName} onChange={(e) => setPresetName(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-bold uppercase outline-none focus:border-orange-500 transition-colors cursor-pointer">
                    {Object.keys(STYLE_PRESETS).map((name) => (<option key={name} value={name}>{name.toUpperCase()}</option>))}
                  </select>
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-4 text-[11px] font-black uppercase tracking-widest text-zinc-300 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input type="checkbox" checked={strictNoBrand} onChange={(e) => setStrictNoBrand(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  NO BRAND / TEXT LOCK
                </label>

                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-4 text-[11px] font-black uppercase tracking-widest text-zinc-300 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <input type="checkbox" checked={includeNegative} onChange={(e) => setIncludeNegative(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                  NEGATIVE PROMPT
                </label>

                <div className="grid grid-cols-1 mt-4">
                  <button onClick={clearDetails} className="rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">CLEAR ALL DESCRIPTIONS</button>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] border border-blue-500/30 bg-blue-900/10 p-6 text-xs text-blue-200 font-medium leading-relaxed">
              <span className="font-black text-blue-400 uppercase tracking-widest block mb-2 text-[10px]">V8 AUTOMATION</span>
              Leave panel descriptions empty to trigger the V8 Auto-Algorithm. It will detect your category and inject premium cinematic lighting and camera metadata automatically.
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <h2 className="mb-6 text-lg font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Grid Layout (Pool of 28 Panels)</h2>
            <div className="grid gap-6">
              {categories.map((category, index) => (
                <div key={index} className="rounded-2xl border border-white/5 bg-[#050505] p-5 relative group hover:border-orange-500/30 transition-colors">
                  <div className="absolute top-0 right-0 bg-white/5 text-zinc-500 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                    PANEL ID: {index + 1}
                  </div>
                  
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-orange-500">SUBJECT CATEGORY</label>
                  <input value={category} onChange={(e) => updateCategory(index, e.target.value)} className="mb-4 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white font-bold outline-none focus:border-orange-500 transition-colors" placeholder={`Subject for panel ${index + 1}`} />
                  
                  <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-orange-500">MANUAL DESCRIPTION (OPTIONAL)</label>
                  <textarea value={details[index]} onChange={(e) => updateDetail(index, e.target.value)} className="min-h-[100px] w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-zinc-300 leading-relaxed outline-none focus:border-orange-500 transition-colors resize-none custom-scrollbar" placeholder="V8 Auto-Algorithm is ready..." />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DONJI PANEL: OUTPUT */}
        <div className="rounded-[2.5rem] border border-orange-500/40 bg-[#0a0a0a] p-8 shadow-[0_0_40px_rgba(234,88,12,0.15)] relative mt-10">
          
          {generatedPrompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Zap className="w-16 h-16 text-zinc-700 mb-6" />
              <h2 className="text-2xl font-black text-zinc-500 uppercase tracking-widest mb-8">SYSTEM STANDBY</h2>
              <button 
                onClick={handleGenerate100} 
                disabled={isLocked} 
                className="bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black uppercase tracking-widest py-5 px-12 rounded-2xl shadow-[0_0_30px_rgba(234,88,12,0.3)] transition-all flex items-center justify-center gap-3 hover:scale-[1.02]"
              >
                 GENERATE 100 PROMPTS
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                    <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-xs font-black">100</span>
                    PROMPTS DEPLOYED
                  </h2>
                </div>
                
                {/* TOOLBAR ZA EXPORT I KONTROLU */}
                <div className="flex flex-wrap items-center gap-3">
                  <button onClick={handleRegenerate100} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                     <RefreshCw size={14} /> REGENERATE 100 PROMPTS
                  </button>
                  <div className="w-px h-8 bg-white/10 mx-2"></div>
                  <button onClick={downloadTxt} title="Export as TXT" className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-white/5">
                     <FileText size={18} />
                  </button>
                  <button onClick={downloadJson} title="Export as JSON" className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-white/5">
                     <FileJson size={18} />
                  </button>
                  <button onClick={clearPrompts} title="Clear All" className="p-3 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/30">
                     <Trash2 size={18} className="animate-pulse" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar pr-2">
                {generatedPrompts.map((promptText, i) => (
                   <div key={i} className="bg-[#050505] border border-white/5 rounded-2xl p-4 hover:border-orange-500/30 transition-colors relative group">
                      <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                         <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">PROMPT #{i + 1}</span>
                         <button 
                            onClick={() => copySingle(i, promptText)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all shadow-lg ${copiedStates[i] ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-orange-600 text-white hover:bg-orange-500'}`}
                         >
                            <Copy size={12} /> {copiedStates[i] ? 'COPIED!' : 'COPY PROMPT'}
                         </button>
                      </div>
                      <textarea 
                         readOnly 
                         value={promptText} 
                         className="w-full bg-transparent font-mono text-[11px] text-zinc-300 resize-none outline-none custom-scrollbar min-h-[140px]" 
                      />
                   </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: V8PromptEngine
// KRAJ FAJLA: V8PromptEngine.jsx