// POČETAK FAJLA: V8PromptEngine.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Copy, Download, RefreshCw, Zap, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
import { auth, db } from './firebase'; // PRILAGODI PUTANJU AKO TREBA
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { v8Toast } from './App'; // PRILAGODI PUTANJU AKO TREBA

const DEFAULT_CATEGORIES = [
  // --- ORIGINALNI V8 CORE ---
  "Luxury abstract sculpture",
  "Ancient Roman epic scene",
  "Michelin fine dining",
  "Chocolate dessert macro",
  "Blue cocktail splash reference",
  "Red liquid splash reference",
  "Supercar with drone",
  "Luxury Swiss watch",

  // --- MYTHOLOGY & HISTORY (Epic Scale) ---
  "Fierce Viking warrior in battle",
  "Ancient Aztec golden city aerial",
  "Spartan gladiator in arena dust",
  "Samurai commander cinematic portrait",

  // --- HIGH-PERFORMANCE AUTOMOTIVE ---
  "Hypercar drifting on neon street",
  "Luxury SUV in snowy mountain pass",
  "Matte black motorcycle studio shot",
  "Classic vintage race car macro detail",

  // --- DARK PREMIUM TECH & PRODUCT ---
  "Dark obsidian smartphone with glowing edges",
  "Premium dark cosmetics glass bottle",
  "Minimalist black leather designer bag",
  "Matte black luxury headphones",

  // --- MACRO ELEMENTS & FOOD ---
  "Golden coffee beans splashing in espresso",
  "Smoky whiskey glass with glowing ice cube",
  "Dark marble and liquid gold texture",
  "Gourmet sushi premium macro photography",

  // --- ARCHITECTURE & LIFESTYLE ---
  "Luxury modern villa with infinity pool",
  "High-fashion editorial neon lighting",
  "First-class private jet interior",
  "Cinematic cyberpunk street level"
];

const DEFAULT_DETAILS = [
  // --- ORIGINALNI V8 CORE ---
  "An impossible luxury abstract sculpture made of black obsidian, smoked glass, liquid chrome and polished gold ribbons, floating in a dark premium studio with dramatic spotlighting, realistic reflections, micro-scratches and gallery-grade composition, unbranded, no text.",
  "A breathtaking ancient Roman epic scene with a heroic commander in ornate bronze and gold armor, red cape, plumed helmet, elite legionaries behind him, imperial architecture, cinematic sunlight, Hollywood-scale historical realism, clean, no logos.",
  "A Michelin-star luxury gourmet plate on matte black ceramic, premium seafood, delicate sauce dots, microgreens, edible flowers, edible gold accents, shallow depth of field, restaurant-grade macro photography, clean, no text.",
  "A decadent layered chocolate cake with rich dark sponge, thick glossy ganache slowly dripping over the edges, moist texture, chocolate shavings, warm moody dessert lighting, premium bakery macro detail, unbranded.",
  "A premium blue cocktail in a crystal martini glass with sparkling bubbles, frozen splash above the rim, orange wedge garnish, frosty tabletop, dark blue-and-amber bar lighting, hyper-realistic beverage photography, clean.",
  "A dramatic crimson-red liquid splash explosion frozen mid-air, glossy translucent droplets, suspended liquid sheets, black moody background, sharp high-speed macro photography, luxury commercial splash-art energy, unbranded.",
  "An unbranded futuristic supercar racing on a dramatic mountain highway, a professional drone flying above it, aggressive aerodynamic body, glossy carbon reflections, dust particles, golden-hour light, premium automotive advertising look.",
  "A luxury Swiss-style wristwatch inspired by ultra-premium dress-watch design, rose-gold case, dark elegant dial, polished sapphire crystal, leather strap, macro product photography, dark black-and-gold studio background, zero text/logos.",

  // --- MYTHOLOGY & HISTORY ---
  "Fierce Viking warrior in battle, rugged armor, cinematic fur and leather textures, dramatic lighting, epic frozen landscape, ultra-realistic action, clean, no text, no branding.",
  "Aerial view of ancient Aztec golden city, monumental pyramids, lush jungle environment, sunlight streaming through clouds, epic historical scale, hyper-realistic, unbranded, no logos.",
  "Spartan gladiator in arena dust, bronze helmet, intense cinematic lighting, high-contrast, historical grit, ultra-detailed skin textures, clean commercial composition, no text.",
  "Samurai commander cinematic portrait, intricate traditional armor, soft studio rim light, moody atmosphere, cinematic color grade, hyper-realistic details, zero logos, no text.",

  // --- HIGH-PERFORMANCE AUTOMOTIVE ---
  "Hypercar drifting on neon street, wet asphalt reflections, motion blur, glowing lights, unbranded automotive design, high-end commercial aesthetic, zero branding, clean.",
  "Luxury SUV in snowy mountain pass, dramatic wide-angle shot, cinematic cold lighting, pristine nature, unbranded modern vehicle, premium advertising finish, zero text, clean.",
  "Matte black motorcycle studio shot, dramatic rim lighting, sharp metallic details, dark background, unbranded custom build, premium product photography, zero text/logos.",
  "Classic vintage race car macro detail, polished chrome and worn leather textures, vintage cinematic vibe, shallow depth of field, clean composition, unbranded, no text.",

  // --- DARK PREMIUM TECH & PRODUCT ---
  "Dark obsidian smartphone with glowing edges, bezel-less screen, sleek glass finish, premium dark environment, macro product lighting, futuristic tech aesthetic, clean, no logos.",
  "Premium dark cosmetics glass bottle, elegant fluid texture, dark gold accents, luxury studio lighting, high-end skincare aesthetic, clean commercial shot, zero text/branding.",
  "Minimalist black leather designer bag, premium texture, dark elegant studio light, sharp details, luxury fashion photography, unbranded, no logos, clean composition.",
  "Matte black luxury headphones, premium metal and leather finish, moody studio light, sharp macro details, high-end audio tech vibe, clean composition, unbranded, no logos.",

  // --- MACRO ELEMENTS & FOOD ---
  "Golden coffee beans splashing in espresso, rich liquid swirls, cinematic warm light, dark moody background, premium culinary photography, macro detail, clean, no text.",
  "Smoky whiskey glass with glowing ice cube, premium crystal clarity, moody atmospheric light, macro detail, sophisticated bar aesthetic, unbranded, no watermarks, clean.",
  "Dark marble and liquid gold texture, elegant fluid abstract art, dramatic shadows, premium luxury material aesthetic, macro photography, unbranded, zero logos.",
  "Gourmet sushi premium macro photography, artistic arrangement, delicate textures, dark slate background, professional culinary lighting, clean aesthetic, no text.",

  // --- ARCHITECTURE & LIFESTYLE ---
  "Luxury modern villa with infinity pool, twilight sky, architectural perfection, warm interior glow, cinematic framing, elite property photography, clean, no text.",
  "High-fashion editorial neon lighting, moody dark atmosphere, clean composition, professional aesthetic, zero branding, zero logos, cinematic lighting.",
  "First-class private jet interior, leather textures, warm ambient lighting, premium luxury travel lifestyle, clean wide-angle shot, unbranded, zero logos.",
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
  "shot on ARRI Alexa 65 with Panavision anamorphic optics, cinematic highlight rolloff",
  "RED V-RAPTOR 8K look with Zeiss Supreme Prime lens character, crisp commercial sharpness",
  "Sony Venice 2 color science with Leica Summilux rendering, natural micro-contrast",
  "IMAX-inspired framing with premium optical depth, soft halation and controlled reflections",
  "Hasselblad medium-format commercial photography look, rich tonal depth, fine material texture",
  "Phase One studio advertising look, ultra-clean detail, premium product-lighting precision"
];

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick(arr, seed) {
  return arr[Math.floor(seededRandom(seed) * arr.length) % arr.length];
}

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

function makeSinglePrompt({ categories, details, seed, aspectRatio, presetName, strictNoBrand, includeNegative }) {
  const preset = STYLE_PRESETS[presetName] || STYLE_PRESETS["Nano Banana 2 / Pro"];
  const descriptions = categories.map((cat, i) => {
    const manual = (details[i] || "").trim();
    return manual.length > 0 ? manual : autoDescription(cat, i, seed);
  });
  const brandLock = strictNoBrand
    ? "All panels must be clean commercial-safe visuals: no visible logos, no readable brand names, no trademark marks, no readable license plates, no text, no captions."
    : "Avoid random text, captions, watermarks and messy symbols.";
  const negative = includeNegative
    ? `\n\nNEGATIVE PROMPT:\nno duplicate panels, no repeated subjects, no repeated compositions, no near-duplicates, no extra panels, no missing panels, no broken grid, no distorted layout, no UI, no browser interface, no app screenshot elements, no captions, no typography, no random letters, no watermark, no signature, no visible logos, no readable brand names, no low resolution, no blurry details, no plastic CGI look.`
    : "";

  return `Create a single premium cinematic collage image in a strict 2-row by 4-column grid, exactly 8 panels total, equal-size panels, clean thin separators, ${aspectRatio} aspect ratio. The final image must look like a luxury commercial advertising board, not an app screenshot.\n\nCRITICAL CONTROL LOCK:\nAll 8 panels must be visually different. No duplicated panels. No near-duplicates. No repeated subjects. No repeated compositions. Each panel must have a unique subject, unique framing, unique lighting mood and unique visual identity. ${brandLock}\n\nROW 1, PANEL 1 — ${categories[0]}:\n${descriptions[0]}\n\nROW 1, PANEL 2 — ${categories[1]}:\n${descriptions[1]}\n\nROW 1, PANEL 3 — ${categories[2]}:\n${descriptions[2]}\n\nROW 1, PANEL 4 — ${categories[3]}:\n${descriptions[3]}\n\nROW 2, PANEL 1 — ${categories[4]}:\n${descriptions[4]}\n\nROW 2, PANEL 2 — ${categories[5]}:\n${descriptions[5]}\n\nROW 2, PANEL 3 — ${categories[6]}:\n${descriptions[6]}\n\nROW 2, PANEL 4 — ${categories[7]}:\n${descriptions[7]}\n\nGLOBAL STYLE:\n${preset.suffix}, cohesive premium collage, cinematic realism, realistic reflections, subtle film grain, deep blacks, controlled highlights, luxury black-and-gold color grade, sharp but not oversharpened, expensive editorial finish.${negative}`;
}

function makeVariations(options) {
  return Array.from({ length: options.count }, (_, i) => {
    const prompt = makeSinglePrompt({ ...options, seed: options.seed + i * 101 });
    return `PROMPT ${i + 1}\n${prompt}`;
  }).join("\n\n------------------------------------------------------------\n\n");
}

export default function V8PromptEngine() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [details, setDetails] = useState(DEFAULT_DETAILS);
  const [seed, setSeed] = useState(2026);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [presetName, setPresetName] = useState("Nano Banana 2 / Pro");
  const [count, setCount] = useState(5);
  const [strictNoBrand, setStrictNoBrand] = useState(true);
  const [includeNegative, setIncludeNegative] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // V8 FIREBASE STATE
  const [user, setUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [isLocked, setIsLocked] = useState(true); // Locked until verified
  const PROMPT_LIMIT = 3000;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const email = currentUser.email.toLowerCase();
        
        // ADMIN CHECK
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
           setIsVIP(true);
           setIsLocked(false);
           return;
        }

        // VIP CHECK
        try {
          const docRef = doc(db, "vip_users", email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().unlockedApps) {
            const unlocked = docSnap.data().unlockedApps;
            // OTVARA AKO IMA PROMPT ENGINE ILI FULL ACCESS
            if (unlocked.includes('V8_PROMPT_ENGINE') || unlocked.includes('FULL_ACCESS')) {
               setIsVIP(true);
               // Očitaj potrošnju
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

  const output = useMemo(() => {
    return makeVariations({ categories, details, seed, aspectRatio, presetName, count, strictNoBrand, includeNegative });
  }, [categories, details, seed, aspectRatio, presetName, count, strictNoBrand, includeNegative]);

  const updateCategory = (index, value) => setCategories(prev => { const next = [...prev]; next[index] = value; return next; });
  const updateDetail = (index, value) => setDetails(prev => { const next = [...prev]; next[index] = value; return next; });

  const recordUsage = async () => {
      if (user && isVIP && user.email !== "damnjanovicgoran7@gmail.com" && user.email !== "aitoolsprosmart@gmail.com") {
          const newUsage = promptsUsed + count;
          setPromptsUsed(newUsage);
          try {
              await setDoc(doc(db, "vip_users", user.email.toLowerCase()), { promptsUsed: newUsage }, { merge: true });
              if (newUsage >= PROMPT_LIMIT) setIsLocked(true);
          } catch(e) { console.error("Failed to update limit", e); }
      }
  };

  const copyOutput = async () => {
    if (isLocked) { v8Toast.error("Engine Locked or Quota Exceeded."); return; }
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
    recordUsage();
  };

  const downloadTxt = () => {
    if (isLocked) { v8Toast.error("Engine Locked or Quota Exceeded."); return; }
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `V8-grid-pack-${count}-prompts-seed-${seed}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    recordUsage();
  };

  const reset = () => { setCategories(DEFAULT_CATEGORIES); setDetails(DEFAULT_DETAILS); setSeed(2026); setAspectRatio("16:9"); setPresetName("Nano Banana 2 / Pro"); setCount(5); setStrictNoBrand(true); setIncludeNegative(true); };
  const clearDetails = () => setDetails(new Array(8).fill(""));
  const randomSeed = () => setSeed(Math.floor(Math.random() * 999999));

  // PAYWALL RENDER
  if (!user || (!isVIP && !isLocked)) {
      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-32 pb-20 px-6 font-sans">
            <div className="max-w-md w-full bg-[#0a0a0a] border border-orange-500/40 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(234,88,12,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 to-amber-500"></div>
                <Lock className="w-16 h-16 text-orange-500 mx-auto mb-6 opacity-80" />
                <h2 className="text-2xl font-black uppercase text-white tracking-widest mb-2">V8 PROMPT ENGINE</h2>
                <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest mb-8">Access restricted to Premium Lifetime Members.</p>
                <div className="bg-black/50 border border-white/10 p-5 rounded-2xl mb-8 text-left">
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4">The ultimate mass-production text engine for cinematic grids. Value: <strong className="text-white">$250</strong>.</p>
                    <p className="text-orange-400 text-xs font-bold bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">Unlocked FREE when you purchase any V8 Masterwork Bundle from the Stock Market.</p>
                </div>
                {!user ? (
                   <button onClick={() => signInWithPopup(auth, provider)} className="w-full py-4 bg-zinc-800 hover:bg-orange-600 text-white font-black uppercase tracking-widest rounded-xl transition-all text-xs">Verify Account</button>
                ) : (
                   <a href="/stock" className="block w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest rounded-xl transition-all text-xs shadow-[0_0_20px_rgba(234,88,12,0.4)]">Browse Master Bundles</a>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-4 md:px-8 text-white font-sans">
      <div className="mx-auto max-w-7xl space-y-8">
        
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
                The ultimate text-generation algorithm for cinematic advertising panels. Generates perfect prompt variations ready for deployment.
              </p>
            </div>
            <div className="flex flex-col items-end gap-4">
              {/* V8 LIMIT COUNTER */}
              <div className="flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 rounded-xl">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 <div className="flex flex-col items-end">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Monthly Quota</span>
                    <span className="text-xs font-mono font-bold text-white"><span className={promptsUsed > 2500 ? "text-red-500" : "text-green-400"}>{promptsUsed}</span> / {PROMPT_LIMIT}</span>
                 </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={copyOutput} disabled={isLocked} className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-black text-[11px] uppercase tracking-widest transition-all ${isLocked ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)] hover:shadow-[0_0_30px_rgba(234,88,12,0.6)]'}`}>
                  <Copy size={16} /> {copied ? "COPIED TO CLIPBOARD!" : "COPY PROMPTS"}
                </button>
                <button onClick={downloadTxt} disabled={isLocked} className={`flex items-center gap-2 rounded-xl px-6 py-3.5 font-black text-[11px] uppercase tracking-widest transition-all ${isLocked ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed border border-white/5' : 'bg-white text-black hover:bg-zinc-200 shadow-xl'}`}>
                  <Download size={16} /> DOWNLOAD TXT
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLocked && promptsUsed >= PROMPT_LIMIT && (
            <div className="w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-6 flex items-center justify-center gap-4 text-red-500">
                <AlertTriangle className="w-8 h-8 animate-pulse" />
                <span className="font-black uppercase tracking-widest text-sm">V8 QUOTA EXCEEDED. ENGINE LOCKED UNTIL NEXT MONTH.</span>
            </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* LEVI PANEL: CONTROLS */}
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
              <h2 className="mb-6 text-lg font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Engine Parameters</h2>

              <div className="grid gap-5">
                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">BATCH COUNT (VARIATIONS)</span>
                  <input type="number" min="1" max="50" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value || 1))))} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-mono outline-none focus:border-orange-500 transition-colors" />
                </label>

                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">ALGORITHM SEED</span>
                  <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value || 0))} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-mono outline-none focus:border-orange-500 transition-colors" />
                </label>

                <label className="space-y-2">
                  <span className="block text-[10px] font-black uppercase tracking-widest text-orange-500">ASPECT RATIO</span>
                  <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black px-4 py-3.5 text-white font-bold uppercase outline-none focus:border-orange-500 transition-colors cursor-pointer">
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="21:9">21:9 (Cinematic)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                  </select>
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

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={randomSeed} className="rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"><RefreshCw size={12} /> SEED</button>
                  <button onClick={clearDetails} className="rounded-xl bg-zinc-900 border border-white/5 px-4 py-3 font-black text-[10px] uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">CLEAR DESC</button>
                  <button onClick={reset} className="col-span-2 rounded-xl bg-zinc-800 border border-white/10 px-4 py-3 font-black text-[10px] uppercase tracking-widest text-white hover:bg-orange-600 transition-all shadow-lg">SYSTEM RESET</button>
                </div>
              </div>
            </div>
            
            <div className="rounded-[2rem] border border-blue-500/30 bg-blue-900/10 p-6 text-xs text-blue-200 font-medium leading-relaxed">
              <span className="font-black text-blue-400 uppercase tracking-widest block mb-2 text-[10px]">V8 AUTOMATION</span>
              Leave panel descriptions empty to trigger the V8 Auto-Algorithm. It will detect your category and inject premium cinematic lighting and camera metadata automatically.
            </div>
          </div>

          {/* SREDNJI PANEL: INPUT */}
          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl">
            <h2 className="mb-6 text-lg font-black uppercase tracking-widest text-white border-b border-white/10 pb-4">Grid Layout (8 Panels)</h2>
            <div className="grid gap-6">
              {categories.map((category, index) => (
                <div key={index} className="rounded-2xl border border-white/5 bg-[#050505] p-5 relative group hover:border-orange-500/30 transition-colors">
                  <div className="absolute top-0 right-0 bg-white/5 text-zinc-500 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">
                    PANEL {index + 1} • ROW {index < 4 ? "1" : "2"}
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
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-widest text-white">Engine Output</h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Ready for deployment.</p>
            </div>
            <div className="text-[10px] bg-orange-600 text-white px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">{count} BATCHES GENERATED</div>
          </div>
          <textarea value={output} readOnly className="min-h-[600px] w-full rounded-2xl border border-white/10 bg-[#050505] p-6 font-mono text-xs leading-relaxed text-orange-100 outline-none custom-scrollbar shadow-inner" />
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: V8PromptEngine.jsx