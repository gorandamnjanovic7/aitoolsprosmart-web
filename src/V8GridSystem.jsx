// POČETAK FAJLA: V8GridSystem.jsx
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { Helmet } from 'react-helmet-async'; // 🔥 DODATO ZA SEO 🔥
import { Copy, RefreshCw, Zap, Lock, ShieldCheck, FileText, Code, Trash2, LayoutGrid, ChevronDown, Timer, Crown, Diamond, ArrowUpCircle, Download, CheckCircle, Cpu, Archive, X, Eye, Upload, Database, AlertTriangle } from "lucide-react";
import { auth, db } from './firebase'; 
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, increment, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import { v8Toast } from './v8Utils'; 
import { motion, AnimatePresence } from 'framer-motion';
import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';
import V8SmartQuota from './V8SmartQuota';

import { DEFAULT_CATEGORIES, SUB_CATEGORIES_DB, DEFAULT_CATEGORIES_2, SUB_CATEGORIES_DB_2, DEFAULT_CATEGORIES_3, SUB_CATEGORIES_DB_3, DEFAULT_CATEGORIES_4, SUB_CATEGORIES_DB_4, STYLE_PRESETS, CAMERA_PRESETS, LIGHTING_PRESETS } from './V8_Database';

// --- HELPERS (ANTI-BLEED & STRICT GEOMETRY ENGINE) ---
const DYNAMIC_ANGLES = ["Eye-level perspective", "High-angle shot", "Low-angle dynamic shot", "Extreme macro close-up", "Wide environmental frame", "Overhead top-down view", "Dutch angle", "Isometric perspective", "Shallow focus depth", "Direct front profile"];
const DYNAMIC_MOODS = ["dramatic atmospheric", "clean studio isolated", "moody cinematic", "high-key bright", "vibrant color contrast", "golden hour natural", "harsh stark shadow", "soft ethereal diffused", "sharp rim-lit", "dark moody silhouette"];

// POČETAK FUNKCIJE: seededRandom
function seededRandom(seed) { 
  const x = Math.sin(seed * 12.9898) * 43758.5453;
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
    s = Math.sin(s * 12.9898) * 43758.5453;
    const r = Math.floor((s - Math.floor(s)) * (k + 1));
    [shuffled[k], shuffled[r]] = [shuffled[r], shuffled[k]];
  }
  return shuffled;
}
// KRAJ FUNKCIJE: seededShuffle

// POČETAK FUNKCIJE: autoDescription
function autoDescription(category, originalIndex, seed, promptIndex, dbType = 1) {
  const baseList = dbType === 1 ? DEFAULT_CATEGORIES : dbType === 2 ? DEFAULT_CATEGORIES_2 : dbType === 3 ? DEFAULT_CATEGORIES_3 : DEFAULT_CATEGORIES_4;
  const subDb = dbType === 1 ? SUB_CATEGORIES_DB : dbType === 2 ? SUB_CATEGORIES_DB_2 : dbType === 3 ? SUB_CATEGORIES_DB_3 : SUB_CATEGORIES_DB_4;
  
  const baseCat = baseList[originalIndex] ? baseList[originalIndex].toLowerCase() : category.toLowerCase();
  
  const uniqueSeed = seed + (promptIndex * 13377) + (originalIndex * 9973);
  
  const camera = pick(CAMERA_PRESETS, uniqueSeed);
  const lighting = pick(LIGHTING_PRESETS, uniqueSeed + 50);
  const angle = pick(DYNAMIC_ANGLES, uniqueSeed + 150);
  const mood = pick(DYNAMIC_MOODS, uniqueSeed + 250);

  let finalSubject = category;
  const matchedKey = Object.keys(subDb).find(k => k.toLowerCase() === category.toLowerCase());
  
  if (matchedKey && subDb[matchedKey] && subDb[matchedKey].length > 0) {
      finalSubject = pick(subDb[matchedKey], uniqueSeed + 333);
  }

  let prefix = `${angle}, ${mood} environment. `;
  let suffix = `ultra-detailed premium commercial image with ${lighting}, realistic materials, elegant composition, deep blacks, controlled highlights, subtle imperfections, anti-plastic realism, ${camera}.`;
  
  if (baseCat.includes("supercar") || baseCat.includes("car") || baseCat.includes("vehicle") || baseCat.includes("hoverbike") || baseCat.includes("submarine")) {
     suffix = `cinematic automotive/machinery shot, debadged unbranded, sharp mechanical details, glossy reflections, dynamic environment, ${lighting}, luxury campaign look, ${camera}.`;
  } else if (baseCat.includes("watch") || baseCat.includes("jewelry") || baseCat.includes("ring") || baseCat.includes("necklace") || baseCat.includes("product") || baseCat.includes("perfume") || baseCat.includes("tiara")) {
     suffix = `ultra-luxury macro product photography, unbranded product, premium materials, sharp details, dark elegant studio background, ${lighting}, refined product-advertising finish, ${camera}.`;
  } else if (baseCat.includes("villa") || baseCat.includes("jet") || baseCat.includes("fashion") || baseCat.includes("architecture") || baseCat.includes("resort") || baseCat.includes("library") || baseCat.includes("stadium") || baseCat.includes("pyramid") || baseCat.includes("laboratory")) {
     suffix = `cinematic wide environment, moody atmosphere, rich textures, ${lighting}, high-end commercial editorial aesthetic, ${camera}.`;
  } else if (baseCat.includes("salmon") || baseCat.includes("food") || baseCat.includes("dish") || baseCat.includes("cake") || baseCat.includes("splashing in espresso")) {
     suffix = `premium food photography, beautifully plated dish on a clean studio surface, no background clutter, ${lighting}, highly appetizing culinary finish, ${camera}.`;
  } else if (baseCat.includes("macro") || baseCat.includes("insect") || baseCat.includes("scale") || baseCat.includes("eye")) {
     suffix = `hyper-macro photography, extreme close-up, microscopic details, focus stacking, sharp center focus, beautifully blurred background, ${lighting}, ${camera}.`;
  }

  return `${prefix} ${finalSubject}, ${suffix}`;
}
// KRAJ FUNKCIJE: autoDescription

// POČETAK FUNKCIJE: makeSinglePrompt
function makeSinglePrompt({ categories, seed, presetName, strictNoBrand, includeNegative, promptIndex, aspectRatio, selectedIndices, gridFormat }) {
  const preset = STYLE_PRESETS[presetName] || STYLE_PRESETS["Nano Banana 2 / Pro"];
  const descriptions = categories.map((cat, i) => autoDescription(cat, selectedIndices[i], seed, promptIndex, DEFAULT_CATEGORIES_4.includes(cat) ? 4 : DEFAULT_CATEGORIES_3.includes(cat) ? 3 : DEFAULT_CATEGORIES_2.includes(cat) ? 2 : 1));
  
  let rows, cols;
  if (aspectRatio === "9:16") {
      // Dinamična rotacija za vertikalne ekrane
      if (gridFormat === "2x6") { rows = 6; cols = 2; }
      else if (gridFormat === "2x4") { rows = 4; cols = 2; }
      else if (gridFormat === "2x3") { rows = 3; cols = 2; }
      else { rows = 2; cols = 2; }
  } else {
      // Standardni položeni ekrani
      if (gridFormat === "2x6") { rows = 2; cols = 6; }
      else if (gridFormat === "2x4") { rows = 2; cols = 4; }
      else if (gridFormat === "2x3") { rows = 2; cols = 3; }
      else { rows = 2; cols = 2; }
  }

  const totalPanels = rows * cols;
  
  // 🔥 ZADRŽANA TVOJA STRIKTNA LOGIKA ZA GRID (NETAKNUTA) 🔥
  const gridHeader = `Strict split-screen composition: A perfect ${cols}x${rows} grid layout containing EXACTLY ${totalPanels} distinct images. Arranged specifically in ${cols} vertical columns and ${rows} horizontal rows. Seamless transitions, no borders.`;
  
  const panelText = descriptions.slice(0, totalPanels).map((d,i) => `[Panel ${i+1}]: ${d}`).join(" | ");
  const positiveStyle = `GLOBAL STYLE: ${preset.suffix}, pure cinematic realism, high-end commercial ad aesthetic, debadged, unbranded.`;

  let negativeArr = ["collage", "moodboard", "varying sizes", "mixed sizes", "asymmetric layout", "merged sections", "overlapping", "white lines", "black lines", "borders", "margins", "frames", "picture within picture"];
  
  const wrongGrids = [
      { p: 4, name: "2x2" },
      { p: 6, name: "3x2" },
      { p: 6, name: "2x3" },
      { p: 8, name: "4x2" },
      { p: 8, name: "2x4" },
      { p: 9, name: "3x3" },
      { p: 10, name: "5x2" },
      { p: 12, name: "4x3" },
      { p: 12, name: "3x4" },
      { p: 16, name: "4x4" }
  ];
  
  wrongGrids.forEach(g => {
      if (g.p !== totalPanels) {
          negativeArr.push(`${g.p} panels`, `${g.p} sections`, `${g.p} images`, `${g.name} grid layout`);
      }
  });

  // Dodatna zaštita za 12 panela: da bi ugasili 4x3 halucinaciju!
  if (totalPanels === 12) {
      negativeArr.push("4x3 grid layout", "3x4 grid layout", "3 columns and 4 rows", "4 columns and 3 rows");
  }
  
  if (strictNoBrand) {
      negativeArr.push("text", "watermark", "logo", "brand", "typography", "letters", "signature", "badge", "emblem", "words");
  }
  
  if (includeNegative) {
      negativeArr.push("hybrid objects", "surrealism", "plastic", "blurry", "cropped", "out of frame", "split objects");
  }

  const finalNegative = ` NEGATIVE PROMPT: ${negativeArr.join(", ")}.`;
  const hashSeed = seed + (promptIndex * 888);
  const hash = Math.abs(Math.sin(hashSeed * 12.9898) * 10000000).toString(16).substring(0, 8).toUpperCase();
  
  return `${gridHeader} Contents: ${panelText}. ${positiveStyle}${finalNegative} --ar ${aspectRatio} --style raw --v 6.0 --seed ${hashSeed} [V8-HASH: ${hash}]`;
}
// KRAJ FUNKCIJE: makeSinglePrompt

// POČETAK FUNKCIJE: makeVariations
function makeVariations(options) {
  // 🔥 Ubačen 2x6 panel kalkulator (12 slika) 🔥
  const panelsPerPrompt = options.gridFormat === "2x6" ? 12 : options.gridFormat === "2x4" ? 8 : options.gridFormat === "2x3" ? 6 : 4;
  return Array.from({ length: 100 }, (_, promptIndex) => {
    const currentSeed = options.seed + promptIndex * 101;
    const selectedIndices = seededShuffle(Array.from({ length: panelsPerPrompt }, (_, idx) => idx), currentSeed);
    return makeSinglePrompt({ ...options, categories: selectedIndices.map(idx => options.categories[idx]), seed: currentSeed, promptIndex, selectedIndices, gridFormat: options.gridFormat });
  });
}
// KRAJ FUNKCIJE: makeVariations

// POČETAK FUNKCIJE: MemoizedPanel
const MemoizedPanel = memo(({ index, category, autoDesc, subOptions, updateCategory, openDropdown, setOpenDropdown }) => (
  <div className="rounded-2xl border border-white/5 bg-[#050505]/90 p-5 relative group hover:border-orange-500/30 transition-colors flex flex-col">
    <div className="absolute top-0 right-0 bg-white/5 text-zinc-500 text-[8px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-widest">PANEL: {index + 1}</div>
    <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-blue-500 mt-2">SUBJECT CATEGORY</label>
    <div className="relative mb-4">
        <div className="v8-magic-border w-full">
            <div className="v8-magic-inner flex items-center justify-between px-4 py-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === index ? null : index); }}>
                <input value={category} onChange={(e) => updateCategory(index, e.target.value)} className="bg-transparent text-white font-bold text-xs outline-none w-full cursor-text" placeholder={`Subject for panel ${index + 1}`} onClick={(e) => e.stopPropagation()} />
                <ChevronDown size={14} className={`text-orange-500 transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
            </div>
        </div>
        {openDropdown === index && subOptions.length > 0 && (
          <div className="absolute z-[999] top-[105%] left-0 w-full bg-[#0a0a0a] border border-orange-500/50 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-h-[220px] overflow-y-auto v8-gradient-scrollbar py-2">
            {subOptions.map((sub, subIdx) => (
              <div 
                key={subIdx} 
                className="px-4 py-2 text-xs font-bold text-zinc-300 hover:bg-orange-500/20 hover:text-white cursor-pointer transition-colors border-b border-white/5 last:border-0"
                onClick={(e) => { e.stopPropagation(); updateCategory(index, sub); setOpenDropdown(null); }}
              >
                {sub}
              </div>
            ))}
          </div>
        )}
    </div>
    <label className="mb-2 block text-[9px] font-black uppercase tracking-widest text-emerald-500">V8 SMART BLUEPRINT</label>
    <div className="v8-magic-border flex-grow w-full">
        <textarea readOnly value={autoDesc} className="v8-magic-inner p-3 font-mono text-[11px] text-zinc-400 leading-relaxed outline-none resize-none v8-gradient-scrollbar h-full min-h-[120px] cursor-not-allowed opacity-80" />
    </div>
  </div>
));
// KRAJ FUNKCIJE: MemoizedPanel

// POČETAK FUNKCIJE: V8GridSystem
export default function V8GridSystem() {
  const [activeDB, setActiveDB] = useState(1);

  const [categories1, setCategories1] = useState(() => JSON.parse(localStorage.getItem('v8_categories1')) || DEFAULT_CATEGORIES);
  const [openDropdown1, setOpenDropdown1] = useState(null);
  
  const [categories2, setCategories2] = useState(() => JSON.parse(localStorage.getItem('v8_categories2')) || DEFAULT_CATEGORIES_2);
  const [openDropdown2, setOpenDropdown2] = useState(null);

  const [categories3, setCategories3] = useState(() => JSON.parse(localStorage.getItem('v8_categories3')) || DEFAULT_CATEGORIES_3);
  const [openDropdown3, setOpenDropdown3] = useState(null);

  const [categories4, setCategories4] = useState(() => JSON.parse(localStorage.getItem('v8_categories4')) || DEFAULT_CATEGORIES_4);
  const [openDropdown4, setOpenDropdown4] = useState(null);

  const [seed, setSeed] = useState(() => Number(localStorage.getItem('v8_seed')) || 2026);
  const [presetName, setPresetName] = useState(() => localStorage.getItem('v8_preset') || "Nano Banana 2 / Pro");
  // Default format promenjen na 2x6 kako si tražio da bude prvi
  const [aspectRatio, setAspectRatio] = useState(() => localStorage.getItem('v8_aspect') || "16:9");
  const [gridFormat, setGridFormat] = useState(() => localStorage.getItem('v8_gridFormat') || "2x6");
  const [strictNoBrand, setStrictNoBrand] = useState(() => JSON.parse(localStorage.getItem('v8_nobrand')) ?? true);
  const [includeNegative, setIncludeNegative] = useState(() => JSON.parse(localStorage.getItem('v8_negative')) ?? true);
  
  const [generatedPrompts, setGeneratedPrompts] = useState([]);
  const [copiedStates, setCopiedStates] = useState({});
  const [otvorenOpis, setOtvorenOpis] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const promptsPerPage = 12; 
  const promptsTopRef = useRef(null); 

  const [fullscreenImage, setFullscreenImage] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [promptLimit, setPromptLimit] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('NONE');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(null);
  const [cooldownDisplay, setCooldownDisplay] = useState("");
  const [isEngineCoolingDown, setIsEngineCoolingDown] = useState(false);

  const [payData, setPayData] = useState([]);
  const [vipData, setVipData] = useState({});

  const dropdownRef1 = useRef(null);
  const dropdownRef2 = useRef(null);
  const dropdownRef3 = useRef(null);
  const dropdownRef4 = useRef(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  const ASPECT_OPTIONS = [
    { value: "1:1", ratio: "1 / 1", badge: "1:1 SQUARE" },
    { value: "9:16", ratio: "9 / 16", badge: "9:16 VERTICAL" },
    { value: "16:9", ratio: "16 / 9", badge: "16:9 CINEMATIC" },
    { value: "21:9", ratio: "21 / 9", badge: "21:9 ULTRAWIDE" }
  ];

  // 🔥 2x6 JE SADA NA PRVOM MESTU 🔥
  const GRID_TIERS = [
    { format: "2x6", title: "PREMIUM 2x6 GRID TIER DELIVERABLES" },
    { format: "2x4", title: "PREMIUM 2x4 GRID TIER DELIVERABLES" },
    { format: "2x3", title: "PREMIUM 2x3 GRID TIER DELIVERABLES" },
    { format: "2x2", title: "PREMIUM 2x2 GRID TIER DELIVERABLES" }
  ];

  useEffect(() => {
    if (fullscreenImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => document.body.style.overflow = "auto";
  }, [fullscreenImage]);

  useEffect(() => {
      localStorage.setItem('v8_categories1', JSON.stringify(categories1));
      localStorage.setItem('v8_categories2', JSON.stringify(categories2));
      localStorage.setItem('v8_categories3', JSON.stringify(categories3));
      localStorage.setItem('v8_categories4', JSON.stringify(categories4));
      localStorage.setItem('v8_seed', seed);
      localStorage.setItem('v8_preset', presetName);
      localStorage.setItem('v8_aspect', aspectRatio);
      localStorage.setItem('v8_gridFormat', gridFormat);
      localStorage.setItem('v8_nobrand', JSON.stringify(strictNoBrand));
      localStorage.setItem('v8_negative', JSON.stringify(includeNegative));
  }, [categories1, categories2, categories3, categories4, seed, presetName, aspectRatio, gridFormat, strictNoBrand, includeNegative]);

  // 🔥 DVOZONSKI RADAR (KRIPTO + PAYPAL) UMESTO PAYONEER-A 🔥
  useEffect(() => {
    let unsubCrypto = () => {};
    let unsubPayPal = () => {};
    let unsubVip = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (!user) {
        setPayData([]);
        setVipData({});
        setIsCheckingAccess(false);
        setAmountPaid(0);
        setCurrentPlan('NONE');
        setIsVIP(false);
        setIsAdmin(false);
        return;
      }

      const email = user.email.toLowerCase();
      setIsAdmin(
        email === "damnjanovicgoran7@gmail.com" ||
        email === "aitoolsprosmart@gmail.com"
      );

      let cryptoDocs = [];
      let paypalDocs = [];

      const updateAllPayData = () => {
         setPayData([...cryptoDocs, ...paypalDocs]);
      };

      unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
         cryptoDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
         paypalDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubVip = onSnapshot(doc(db, "vip_users", email), (snap) => {
        setVipData(snap.exists() ? snap.data() : {});
      });
    });

    return () => {
      unsubAuth();
      unsubCrypto();
      unsubPayPal();
      unsubVip();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsVIP(false);
      setPromptsUsed(0);
      setPromptLimit(0);
      setAmountPaid(0);
      setCurrentPlan('NONE');
      setCooldownTime(null);
      setIsEngineCoolingDown(false);
      return;
    }

    if (isAdmin) {
      setIsVIP(true);
      setPromptsUsed(0);
      setPromptLimit(999999);
      setAmountPaid(549);
      setCurrentPlan('ENTERPRISE');
      setIsCheckingAccess(false);
      setCooldownTime(null);
      setIsEngineCoolingDown(false);
      return;
    }

    let hasAccess = false;
    let calculatedLimit = 0;
    let maxPaid = 0;
    let highestPlan = 'NONE';

    payData.forEach((data) => {
      // Skeniramo status iz Kripto i PayPal baza
      if (data.status === "PLAĆENO" || data.status === "completed_verified") {
        const productName = data.productName ? data.productName.toUpperCase() : "";

        if (productName.includes("PROMPT") || productName.includes("GRID") || productName.includes("BUNDLE") || productName.includes("MASTER") || productName.includes("SECURITY CHECKOUT")) {
          hasAccess = true;

          if (productName.includes("ENTERPRISE")) {
            if (maxPaid < 549) { maxPaid = 549; highestPlan = 'ENTERPRISE'; }
            calculatedLimit = Math.max(calculatedLimit, 100000);
          } else if (productName.includes("PRO")) {
            if (maxPaid < 249) { maxPaid = 249; highestPlan = 'PRO'; }
            calculatedLimit = Math.max(calculatedLimit, 25000);
          } else {
            if (maxPaid < 149) { maxPaid = 149; highestPlan = 'STARTER'; }
            calculatedLimit = Math.max(calculatedLimit, 5000);
          }
        }
      }
    });

    if (hasAccess) {
      setIsVIP(true);
      setAmountPaid(maxPaid);
      setCurrentPlan(highestPlan);
      setPromptLimit(calculatedLimit);

      const used = vipData.promptsUsed || 0;
      setPromptsUsed(used);
      
      const exhaustedTimestamp = vipData.exhaustedAt ? new Date(vipData.exhaustedAt).getTime() : null;

      if (used >= calculatedLimit || exhaustedTimestamp) {
        const cooldownStart = exhaustedTimestamp || Date.now();
        const targetTime = cooldownStart + (30 * 24 * 60 * 60 * 1000); 
        
        if (Date.now() >= targetTime) {
          resetQuota(currentUser.email.toLowerCase());
        } else {
          setIsEngineCoolingDown(true);
          setCooldownTime(targetTime);
        }
      } else {
        setIsEngineCoolingDown(false);
        setCooldownTime(null);
      }
    } else {
      setIsVIP(false);
      setPromptsUsed(0);
      setPromptLimit(0);
      setAmountPaid(0);
      setCurrentPlan('NONE');
      setCooldownTime(null);
      setIsEngineCoolingDown(false);
    }

    setIsCheckingAccess(false);
  }, [payData, vipData, currentUser, isAdmin]);

  useEffect(() => {
    let interval;
    if (isEngineCoolingDown && cooldownTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = cooldownTime - now;

        if (diff <= 0) {
          clearInterval(interval);
          if (currentUser) resetQuota(currentUser.email.toLowerCase());
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          setCooldownDisplay(`${days}D ${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isEngineCoolingDown, cooldownTime, currentUser]);

  const resetQuota = async (emailToReset) => {
    try {
      await setDoc(doc(db, "vip_users", emailToReset), { 
         promptsUsed: 0, 
         exhaustedAt: null 
      }, { merge: true });
    } catch(e) { console.error("Failed to reset limit", e); }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef1.current && !dropdownRef1.current.contains(event.target)) setOpenDropdown1(null);
      if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) setOpenDropdown2(null);
      if (dropdownRef3.current && !dropdownRef3.current.contains(event.target)) setOpenDropdown3(null);
      if (dropdownRef4.current && !dropdownRef4.current.contains(event.target)) setOpenDropdown4(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCategory1 = useCallback((index, value) => setCategories1(prev => { const next = [...prev]; next[index] = value; return next; }), []);
  const updateCategory2 = useCallback((index, value) => setCategories2(prev => { const next = [...prev]; next[index] = value; return next; }), []);
  const updateCategory3 = useCallback((index, value) => setCategories3(prev => { const next = [...prev]; next[index] = value; return next; }), []);
  const updateCategory4 = useCallback((index, value) => setCategories4(prev => { const next = [...prev]; next[index] = value; return next; }), []);

  const recordUsage = async () => {
      if (currentUser && isVIP && !isAdmin) {
          try {
              const docRef = doc(db, "vip_users", currentUser.email.toLowerCase());
              const snap = await getDoc(docRef);
              let currentUsage = snap.exists() ? (snap.data().promptsUsed || 0) : 0;
              let newUsage = currentUsage + 100;
              
              let updateData = { promptsUsed: newUsage };
              if (newUsage >= promptLimit) {
                  updateData.exhaustedAt = new Date().toISOString();
              }
              await setDoc(docRef, updateData, { merge: true });
          } catch(e) { console.error("Failed to update limit", e); }
      }
  };

  const openCheckoutForPackage = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    const naslovCheckouta = isUpgrade ? `V8 GRID SYSTEM - ${paketName.toUpperCase()} (UPGRADE)` : `V8 GRID SYSTEM - ${paketName.toUpperCase()}`;
    
    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };

  const pokreniKupovinu = (paketName, fullPrice) => {
    const userNow = currentUser || auth.currentUser;
    if (userNow) {
      openCheckoutForPackage(paketName, fullPrice);
      return;
    }
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;
    setCheckoutProduct(isUpgrade ? `V8 GRID SYSTEM - ${paketName.toUpperCase()} (UPGRADE)` : `V8 GRID SYSTEM - ${paketName.toUpperCase()}`);
    setCheckoutPrice(finalPrice);
    setIsLoginRequiredOpen(true);
  };

  const handleLoginRequiredSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginRequiredOpen(false);
    setTimeout(() => { setIsCheckoutOpen(true); }, 250);
  };

  const handleGenerate100 = (dbType) => {
      if (isEngineCoolingDown) { v8Toast.error("Engine Cooling Down. Wait for refill."); return; }
      if (!isVIP) { v8Toast.error("Access Restricted. Select a Plan."); return; }
      
      setActiveDB(dbType); 
      const activeCategories = dbType === 1 ? categories1 : dbType === 2 ? categories2 : dbType === 3 ? categories3 : categories4;
      const newPrompts = makeVariations({ categories: activeCategories, seed, presetName, strictNoBrand, includeNegative, aspectRatio, gridFormat });
      
      setGeneratedPrompts(newPrompts);
      setCurrentPage(1); 
      setCopiedStates({});
      recordUsage();
      v8Toast.success(`100 Unique Prompts Generated from DB ${dbType}!`);
  };

  const handleRegenerate100 = (dbType) => {
      if (isEngineCoolingDown) { v8Toast.error("Engine Cooling Down. Wait for refill."); return; }
      if (!isVIP) { v8Toast.error("Access Restricted. Select a Plan."); return; }

      const newSeed = Math.floor(Math.random() * 999999);
      setSeed(newSeed);
      const activeCategories = dbType === 1 ? categories1 : dbType === 2 ? categories2 : dbType === 3 ? categories3 : categories4;
      const newPrompts = makeVariations({ categories: activeCategories, seed: newSeed, presetName, strictNoBrand, includeNegative, aspectRatio, gridFormat });
      
      setGeneratedPrompts(newPrompts);
      setCurrentPage(1); 
      setCopiedStates({});
      recordUsage();
      v8Toast.success(`Regenerated 100 New Prompts from DB ${dbType}!`);
  };

  const clearPrompts = () => {
      setGeneratedPrompts([]);
      setCurrentPage(1);
      setCopiedStates({});
  };

  const outputTextAll = generatedPrompts.map((p, i) => `PROMPT ${String(i + 1).padStart(3, '0')}\n${p}`).join("\n\n------------------------------------------------------------\n\n");

  const downloadTxt = () => {
    if (isEngineCoolingDown || !isVIP || generatedPrompts.length === 0) return;
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
    if (isEngineCoolingDown || !isVIP || generatedPrompts.length === 0) return;
    const jsonObj = generatedPrompts.map((p, i) => ({ id: String(i + 1).padStart(3, '0'), prompt: p }));
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
    if (isEngineCoolingDown || !isVIP) { v8Toast.error("Engine Cooling Down. Wait for refill."); return; }
    await navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [index]: true }));
    v8Toast.success(`Prompt copied!`);
  };

  // POČETAK FUNKCIJE: renderPricingPlans
  const renderPricingPlans = () => {
    if (amountPaid >= 549) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-16 px-4 mb-16">
           <div className="bg-gradient-to-r from-[#1a0b2e] to-[#050505] border border-purple-500/40 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden">
              <Crown className="w-20 h-20 text-purple-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]" />
              <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
                ENTERPRISE TIER <span className="text-purple-500">UNLOCKED</span>
              </h2>
              <p className="text-purple-200/60 font-bold uppercase tracking-widest text-[11px] md:text-sm max-w-2xl mx-auto">
                You possess the highest level V8 License. All protocols are fully operational at maximum capacity.
              </p>
           </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-16 px-4 mb-16 relative z-30">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "V8 UPGRADE PROTOCOL." : "LIFETIME ACCESS."} <span className={amountPaid > 0 ? "text-blue-500 block md:inline mt-2 md:mt-0" : "text-orange-500 block md:inline mt-2 md:mt-0"}>
              {amountPaid > 0 ? "UNLOCK HIGHER TIERS." : "CHOOSE YOUR V8 PLAN."}
            </span>
          </h2>
          
          <div className="mt-8 bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
             <h4 className="text-orange-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-orange-500/20 pb-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
             </h4>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of prompts based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your prompts hit zero.</p>
             <p className="text-[13px] md:text-[14px] text-zinc-300"><strong className="text-white">3. THE 30-DAY AUTO-REFILL:</strong> Burned through your entire quota? The Engine enters a mandatory 30-day cooling phase. After exactly 30 days, your prompts auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span></p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full z-10 relative">
          
          {amountPaid < 149 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto"><Diamond className="w-6 h-6 text-blue-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Starter</h3>
                <span className="text-4xl font-black text-blue-400 my-4 text-center">$149</span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 5,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('STARTER', 149)} className="w-full bg-zinc-800 text-white hover:bg-blue-500 py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md">
                   SELECT STARTER
                </button>
            </div>
          )}

          {amountPaid < 249 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 border-orange-500/50 rounded-[2rem] p-8 flex flex-col relative hover:border-orange-500/80 transition-all shadow-[0_0_30px_rgba(234,88,12,0.15)] transform md:scale-105 z-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-600 to-amber-500 rounded-t-[1.9rem]"></div>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Bestseller</div>
                
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500/10 mb-6 mx-auto mt-2"><Zap className="w-6 h-6 text-orange-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Pro</h3>
                <span className="text-4xl font-black text-orange-500 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${249 - amountPaid}` : "$249"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 25,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Rolling Quota (No expiry)</p>
                </div>
                <button onClick={() => pokreniKupovinu('PRO', 249)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all ${amountPaid > 0 ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.4)]'}`}>
                   {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
                </button>
            </div>
          )}

          {amountPaid < 549 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-purple-500/30 rounded-[2rem] p-8 flex flex-col hover:border-purple-500/60 transition-all shadow-xl">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-purple-500/10 mb-6 mx-auto"><Crown className="w-6 h-6 text-purple-500" /></div>
                <h3 className="text-xl font-black text-white uppercase text-center">Enterprise</h3>
                <span className="text-4xl font-black text-purple-400 my-4 text-center flex items-center justify-center gap-3">
                   {amountPaid > 0 ? `$${549 - amountPaid}` : "$549"}
                </span>
                <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                   <p className="flex items-center gap-2">✅ 100,000 Prompts Included</p>
                   <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                   <p className="flex items-center gap-2">🔄 Lifetime Access (Rolling Quota)</p>
                </div>
                <button onClick={() => pokreniKupovinu('ENTERPRISE', 549)} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[13px] transition-all shadow-md ${amountPaid > 0 ? 'bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'bg-zinc-800 text-white hover:bg-purple-500'}`}>
                   {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
                </button>
            </div>
          )}
        </div>

        {amountPaid > 0 && amountPaid < 549 && (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl mx-auto mt-12 bg-gradient-to-r from-blue-950/80 to-blue-900/30 border border-blue-500/40 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-8 shadow-[0_0_40px_rgba(59,130,246,0.25)] relative overflow-hidden backdrop-blur-md">
             <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
             
             <div className="w-16 h-16 bg-blue-900/40 rounded-full flex items-center justify-center border border-blue-500/50 relative flex-shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <div className="absolute inset-0 rounded-full border-t-2 border-blue-400 animate-spin"></div>
                <ArrowUpCircle className="w-8 h-8 text-blue-400" />
             </div>

             <div className="text-center md:text-left relative z-10">
                <div className="inline-block bg-blue-900/50 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 font-bold uppercase tracking-widest text-[9px] mb-3">
                  SMART UPGRADE SYSTEM ACTIVE
                </div>
                <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                  PRORATED UPGRADE POLICY
                </h3>
                <p className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                  System radar has detected your active V8 License valued at <strong className="text-blue-400">${amountPaid}</strong>. 
                  You can upgrade to a higher tier by paying <strong className="text-white border-b border-blue-500/50 pb-0.5">ONLY THE PRICE DIFFERENCE</strong>. The package prices displayed above have already been automatically reduced!
                </p>
             </div>
           </motion.div>
        )}
      </div>
    );
  };

  const renderV8Manifest = () => {
    const specifikacije = [
        { t: "1. 100-Prompt Batch Engine", d: "Instantly generates 100 unique cinematic grid prompts.", insight: "Automates massive prompt lists optimized for Google Nano Banana 2 / Pro architecture in a single click." },
        { t: "2. Dynamic Grid Geometry", d: "Intelligent format rotation.", insight: "Automatically switches 2x4 (wide) to 4x2 (vertical) for 9:16 ratios, preventing thin, broken, or stretched image slices." },
        { t: "3. Visual Prompt Protection", d: "FATAL OVERRIDE: No Text, No Logos.", insight: "Injects strict negative overrides to prevent AI from generating gibberish text, watermarks, or brand logos." },
        { t: "4. Framing Lock Integration", d: "Anti-cropping spatial controls.", insight: "Forces the AI to frame the main subject perfectly in the center with adequate negative space, avoiding cut-off edges." },
        { t: "5. Deterministic AI Seeding", d: "Mathematical shuffling algorithms.", insight: "Uses seededRandom() and seededShuffle() to guarantee 100% unique panel combinations without repeating subjects." },
        { t: "6. Cinematic Metadata Injection", d: "Real camera & lighting arrays.", insight: "Automatically injects premium camera gear (ARRI Alexa, RED V-RAPTOR) and high-end commercial lighting setups into each panel." },
        { t: "7. TXT & JSON Export", d: "Developer and studio-ready files.", insight: "Downloads the entire 100-prompt batch locally as a clean TXT file or a structured JSON file for API/bot integrations." },
        { t: "8. Sub-grid Prevention", d: "Strict panel isolation.", insight: "Explicitly forbids the AI from creating 'picture-in-picture' or stacked images inside a single panel slot." },
        { t: "9. Auto-Save Memory", d: "Local storage persistence.", insight: "All 28 panels, seeds, and settings are saved locally in the browser so no client work is lost upon refreshing." },
        { t: "10. 100% IP Safe", d: "Commercial-safe asset creation.", insight: "This engine ensures that resulting visuals are clean and ready for elite stock agencies and commercial ad campaigns." }
    ];

    return (
        <div className="w-full max-w-5xl mx-auto mb-10 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
          
          <div className="absolute inset-0 bg-[url('/v8-manifest-bg.webp')] bg-cover bg-center opacity-50 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[#050505]/60 z-0 pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">V8 GRID ENGINE</h2>
            <p className="text-[12px] md:text-[14px] text-orange-500 font-bold uppercase tracking-[0.3em] mt-3 italic">Technical Specifications</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start relative z-10">
            {specifikacije.map((item, i) => {
              const isOpen = otvorenOpis === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setOtvorenOpis(isOpen ? null : i)}
                  className={`bg-white/5 border p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isOpen ? 'border-orange-500/50 bg-black/40 shadow-[0_0_15px_rgba(234,88,12,0.15)]' : 'border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <h4 className="text-orange-500 font-black uppercase">{item.t}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{item.d}</p>
                    </div>
                    <ChevronDown 
                      size={20} 
                      className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500 drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]' : 'text-zinc-600 group-hover:text-zinc-400'}`} 
                    />
                  </div>
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <p className="text-[11px] text-zinc-300 font-mono leading-relaxed border-l-2 border-orange-500 pl-3">
                        <span className="text-orange-500 font-bold">Insight:</span> {item.insight}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
    );
  };

  // 🔥 PRILAGOĐEN BROJ PANELA ZA NOVI 2x6 FORMAT 🔥
  const visiblePanelsCount = gridFormat === "2x6" ? 12 : gridFormat === "2x4" ? 8 : gridFormat === "2x3" ? 6 : 4;

  const indexOfLastPrompt = currentPage * promptsPerPage;
  const indexOfFirstPrompt = indexOfLastPrompt - promptsPerPage;
  const currentPrompts = generatedPrompts.slice(indexOfFirstPrompt, indexOfLastPrompt);
  const totalPages = Math.ceil(generatedPrompts.length / promptsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (promptsTopRef.current) {
      const y = promptsTopRef.current.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen pt-10 pb-20 px-4 md:px-8 text-white font-sans overflow-hidden" onClick={() => { setOpenDropdown1(null); setOpenDropdown2(null); setOpenDropdown3(null); setOpenDropdown4(null); }}>
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>Cinematic Grid Prompts | V8 Grid System Generator</title>
        <meta name="description" content="Generate 100+ unique cinematic grid prompts instantly. The ultimate text-generation algorithm strictly optimized for Google Nano Banana 2 and commercial AI platforms." />
        <meta name="keywords" content="cinematic AI prompts, grid system prompt generator, nano banana 2 prompts, professional AI art prompts, commercial AI templates" />
      </Helmet>

      {/* V8SmartQuota - Embedovan Centralni Brojač */}
      {(isVIP || isAdmin) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`bg-black/80 backdrop-blur-xl border px-6 py-2 rounded-full flex items-center gap-4 shadow-lg w-max mx-auto ${
              isEngineCoolingDown ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.3)]'
            }`}
          >
            {isEngineCoolingDown ? (
              <Timer className="w-5 h-5 text-red-500 animate-pulse" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-orange-500 animate-pulse" />
            )}
            
            <div className="flex flex-col items-center">
               <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">
                 {isEngineCoolingDown ? 'COOLING DOWN' : 'MONTHLY QUOTA'}
               </span>
               
               {isEngineCoolingDown ? (
                  <span className="text-[14px] font-mono font-black tracking-widest leading-none mt-1 text-red-500">
                     {cooldownDisplay}
                  </span>
               ) : isAdmin ? (
                  <span className="text-[15px] font-black tracking-widest leading-none mt-1 text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                     MASTER ADMIN : ∞
                  </span>
               ) : (
                  <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${promptsUsed >= promptLimit ? 'text-red-500' : 'text-emerald-400'}`}>
                     {promptsUsed} / {promptLimit}
                  </span>
               )}
            </div>
          </motion.div>
        </div>
      )}

      <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-screen h-screen object-cover z-0 opacity-60 pointer-events-none">
        <source src="/v8-liquid-obsidian.mp4" type="video/mp4" />
      </video>
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#050505]/40 z-0 pointer-events-none"></div>

      <style>{`
        .v8-gradient-scrollbar::-webkit-scrollbar { width: 6px; }
        .v8-gradient-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .v8-gradient-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #3b82f6, #f97316); border-radius: 10px; }
        .v8-gradient-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to bottom, #2563eb, #ea580c); }
        .v8-gradient-scrollbar { scrollbar-width: thin; scrollbar-color: #f97316 rgba(255,255,255,0.02); }

        @keyframes v8-ai-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .v8-magic-border {
          position: relative;
          padding: 2px;
          border-radius: 0.75rem; 
          background: linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4);
          background-size: 200% auto;
          animation: v8-ai-flow 3s linear infinite;
        }
        .v8-magic-inner {
          background-color: #050505;
          border-radius: calc(0.75rem - 2px);
          width: 100%;
          height: 100%;
        }
      `}</style>

      <AnimatePresence>
        {fullscreenImage && (
           <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }} 
             style={{ zIndex: 2147483640 }}
             className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-[#050505]"
             onClick={() => setFullscreenImage(null)}
           >
              <button 
                onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                style={{ zIndex: 2147483647 }}
                className="fixed top-24 right-6 md:top-32 md:right-12 bg-red-600 hover:bg-red-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.8)] cursor-pointer border-2 border-white/20"
              >
                <X size={32} strokeWidth={3} />
              </button>
              <img 
                src={fullscreenImage} 
                className="max-w-[70vw] max-h-[70vh] object-contain"
                onClick={(e) => e.stopPropagation()} 
                alt="Fullscreen Preview"
              />
           </motion.div>
        )}
      </AnimatePresence>

      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        packageName={checkoutProduct}
        price={checkoutPrice}
        onLoginSuccess={(user) => {
          if (user?.email) {
            setCurrentUser(user);
          }
          setIsCheckoutOpen(true);
        }}
      />

      <AnimatePresence>
        {isCheckoutOpen && (
          <V8SecureCheckout 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            productName={checkoutProduct} 
            price={checkoutPrice} 
          />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-[1600px] space-y-8 relative z-10 mt-16">
        
        <div className="rounded-[2.5rem] border border-orange-500/30 px-8 py-24 md:py-36 shadow-[0_0_50px_rgba(234,88,12,0.15)] relative overflow-hidden max-w-7xl mx-auto bg-black/40 backdrop-blur-sm mb-12">
          <div className="absolute inset-0 bg-[url('/v8-hero-grid.webp')] bg-cover bg-center opacity-30 z-0 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[#050505]/65 z-0 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none z-0"></div>
          
          <div className="flex flex-col items-center text-center gap-6 relative z-10">
            <div className="flex flex-col items-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-orange-400 shadow-inner backdrop-blur-md">
                <Zap size={12} className="animate-pulse" /> V8 GRID SYSTEM
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white uppercase italic drop-shadow-lg">
                CINEMATIC GRID <span className="text-orange-500">SYSTEM</span>
              </h1>
              <p className="mt-4 max-w-2xl text-zinc-300 text-sm md:text-base font-medium mx-auto drop-shadow-md">
                The ultimate text-generation algorithm strictly optimized for Google Nano Banana 2. Selectable cinematic aspect ratios.
              </p>
            </div>
          </div>
        </div>

        {renderV8Manifest()}

        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto mb-16 relative z-10">
          <a href="/V8_Grid_Technical_Manifest.txt" download className="flex-1 bg-black/40 border border-blue-500/30 hover:border-blue-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-blue-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]">
              <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 transition-all"><Download className="w-8 h-8 text-blue-400" /></div>
              <div className="text-left">
                  <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Technical Manifest</h4>
                  <p className="text-zinc-400 text-[11px] font-bold">Download System Specs (TXT)</p>
              </div>
          </a>
          <a href="/v8-license.pdf" download className="flex-1 bg-black/40 border border-orange-500/30 hover:border-orange-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-orange-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(234,88,12,0.2)]">
              <div className="bg-orange-500/10 p-4 rounded-full border border-orange-500/20 group-hover:bg-orange-500/20 transition-all"><FileText className="w-8 h-8 text-orange-400" /></div>
              <div className="text-left">
                  <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">Commercial License</h4>
                  <p className="text-zinc-400 text-[11px] font-bold">Download Legal Terms (PDF)</p>
              </div>
          </a>
        </div>

        <div className="w-full max-w-6xl mx-auto mb-16 relative z-10 space-y-16">
          {GRID_TIERS.map(tier => (
            <div key={tier.format}>
               <div className="text-center mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">{tier.title}</h2>
               </div>
               
               <div className="flex flex-wrap justify-center gap-6 pt-2">
                  {ASPECT_OPTIONS.map(opt => {
                     const isSelected = aspectRatio === opt.value && gridFormat === tier.format;
                     const safeValue = opt.value.replace(':', '-');
                     const imageSrc = `/ratio-${safeValue}-${tier.format}.webp`;

                     return (
                         <div
                           key={opt.value}
                           onClick={() => { 
                              setAspectRatio(opt.value); 
                              setGridFormat(tier.format);
                              setGeneratedPrompts([]); 
                           }}
                           className="relative group cursor-pointer flex flex-col items-center"
                         >
                            <div
                              className={`relative rounded-[1.35rem] p-[3px] transition-all duration-500 ${
                                isSelected
                                  ? 'bg-orange-500 shadow-[0_0_35px_rgba(234,88,12,0.35)] scale-105'
                                  : 'bg-orange-500/45 hover:bg-orange-500 hover:shadow-[0_0_28px_rgba(234,88,12,0.25)]'
                              }`}
                              style={{ width: opt.value === '9:16' ? '150px' : opt.value === '21:9' ? '300px' : opt.value === '16:9' ? '270px' : '220px' }}
                            >
                              <div className="rounded-[1.18rem] bg-[#050505] p-[5px] border border-orange-500/30">
                                <div
                                  className={`relative rounded-2xl overflow-hidden bg-black border transition-all duration-500 ${
                                    isSelected
                                      ? 'border-orange-400 shadow-inner'
                                      : 'border-orange-500/40 group-hover:border-orange-400'
                                  }`}
                                  style={{ aspectRatio: opt.ratio }}
                                >
                                  <img
                                    src={imageSrc}
                                    alt={opt.badge}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  />

                                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors duration-300"></div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFullscreenImage(imageSrc);
                                    }}
                                    title="Pregled preko celog ekrana"
                                    className="absolute inset-0 z-20 flex items-center justify-center"
                                  >
                                    <span className={`flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 ${
                                      isSelected
                                        ? 'w-16 h-16 bg-orange-500 text-black border-orange-300 shadow-[0_0_24px_rgba(234,88,12,0.6)]'
                                        : 'w-14 h-14 bg-black/55 text-white border-orange-500/50 group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-300 group-hover:shadow-[0_0_22px_rgba(234,88,12,0.55)]'
                                    }`}>
                                      <Eye size={26} strokeWidth={2.4} />
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-4 text-center">
                              <div className={`text-[11px] font-black uppercase tracking-[0.22em] transition-colors ${isSelected ? 'text-orange-400' : 'text-zinc-400 group-hover:text-orange-300'}`}>
                                {opt.badge}
                              </div>
                              <div className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-600 mt-1">
                                {tier.format} Preview
                              </div>
                            </div>
                         </div>
                     );
                  })}
               </div>
            </div>
          ))}
        </div>

        {/* PRICING PLANS SEKCIJA (POKAZUJE SE SAMO AKO KORISNIK NEMA ENTERPRISE) */}
        {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
           <div className="relative z-20 w-full">
              {renderPricingPlans()}
           </div>
        )}

        <div className={`transition-all duration-500 w-full flex flex-col items-center ${!isVIP && !isAdmin ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
          
          {isEngineCoolingDown && !isAdmin && (
            <div className="mb-10 w-full max-w-7xl mx-auto bg-red-950/40 border border-red-500/50 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
              <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              <h4 className="text-red-400 font-black uppercase text-[16px] tracking-widest relative z-10 mb-2">
                V8 ENGINE COOLING PROTOCOL ACTIVE
              </h4>
              <p className="text-zinc-300 text-[12px] font-bold tracking-widest relative z-10">
                You have exhausted your processing credits. System will auto-refill exactly 30 days after your last batch.
              </p>
            </div>
          )}

          <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-6 shadow-2xl max-w-7xl mx-auto flex flex-col items-center w-full mb-12">
            <h2 className="mb-6 text-sm md:text-base font-black uppercase tracking-widest text-white border-b border-white/10 pb-4 w-full text-center">Engine Parameters</h2>

            <div className="flex flex-wrap items-end justify-center gap-4 w-full pt-4">
              
              <div className="space-y-2 flex-grow max-w-[180px]">
                <span className="block text-[9px] font-black uppercase tracking-widest text-orange-500 text-center">ALGORITHM SEED</span>
                <div className="v8-magic-border w-full">
                  <input type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value || 0))} className="v8-magic-inner px-4 py-3.5 text-white font-mono text-center outline-none" />
                </div>
              </div>

              <div className="space-y-2 flex-grow max-w-[200px]">
                <span className="block text-[9px] font-black uppercase tracking-widest text-orange-500 text-center">ASPECT RATIO</span>
                <div className="v8-magic-border w-full">
                  <select 
                    value={aspectRatio} 
                    onChange={(e) => { 
                      setAspectRatio(e.target.value); 
                      setGeneratedPrompts([]); 
                    }} 
                    className="v8-magic-inner px-4 py-3.5 text-white font-bold text-center uppercase outline-none cursor-pointer"
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="16:9">16:9 (Cinematic)</option>
                    <option value="21:9">21:9 (Ultrawide)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 flex-grow max-w-[200px]">
                <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-500 text-center">GRID SYSTEM</span>
                <div className="v8-magic-border w-full">
                  <select 
                    value={gridFormat} 
                    onChange={(e) => { 
                      setGridFormat(e.target.value); 
                      setGeneratedPrompts([]); 
                    }} 
                    className="v8-magic-inner px-4 py-3.5 text-white font-bold text-center uppercase outline-none cursor-pointer"
                  >
                    {/* 🔥 2x6 JE SADA PRVA OPCIJA U DROPDOWN-U 🔥 */}
                    <option value="2x6">2x6 (12 Panels)</option>
                    <option value="2x4">2x4 (8 Panels)</option>
                    <option value="2x3">2x3 (6 Panels)</option>
                    <option value="2x2">2x2 (4 Panels)</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 flex-grow max-w-[240px]">
                <span className="block text-[9px] font-black uppercase tracking-widest text-orange-500 text-center">PRESET STYLE</span>
                <div className="v8-magic-border w-full">
                  <select value={presetName} onChange={(e) => setPresetName(e.target.value)} className="v8-magic-inner px-4 py-3.5 text-white font-bold uppercase text-center outline-none cursor-pointer">
                    {Object.keys(STYLE_PRESETS).map((name) => (<option key={name} value={name}>{name.toUpperCase()}</option>))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 cursor-pointer hover:border-orange-500/50 transition-colors">
                <input type="checkbox" checked={strictNoBrand} onChange={(e) => setStrictNoBrand(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                NO BRAND LOCK
              </label>
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-black px-5 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-300 cursor-pointer hover:border-orange-500/50 transition-colors">
                <input type="checkbox" checked={includeNegative} onChange={(e) => setIncludeNegative(e.target.checked)} className="accent-orange-500 w-4 h-4" />
                NEGATIVE PROMPT
              </label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-emerald-500/30 bg-emerald-900/20 backdrop-blur-sm p-4 text-xs text-emerald-200 font-medium leading-relaxed max-w-4xl mx-auto text-center mb-8">
            <span className="font-black text-emerald-400 uppercase tracking-widest block mb-1 text-[10px]">V8 SMART BLUEPRINT ACTIVE</span>
            The V8 Engine is dynamically injecting premium cinematic metadata, lighting arrays, and specific camera equipment in real-time based on your selected subjects and seed.
          </div>

          {/* ===================================== */}
          {/* MASTER DATABASE CONTROL SWITCHER */}
          {/* ===================================== */}
          <div className="flex flex-col items-center w-full max-w-7xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#050505] border border-white/10 mb-6 shadow-inner">
              <Database size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Master Database Control</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 w-full">
               {[1, 2, 3, 4].map(num => {
                  const isActive = activeDB === num;
                  let activeColors = "";
                  if (num === 1) activeColors = "bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)] scale-105";
                  if (num === 2) activeColors = "bg-orange-600/20 border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.3)] scale-105";
                  if (num === 3) activeColors = "bg-purple-600/20 border-purple-500 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105";
                  if (num === 4) activeColors = "bg-red-600/20 border-red-500 text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.3)] scale-105";
                  
                  return (
                    <button 
                      key={`switch-${num}`}
                      onClick={() => setActiveDB(num)}
                      className={`w-[180px] h-[55px] rounded-2xl font-black uppercase tracking-widest transition-all duration-300 text-[10px] border flex items-center justify-center gap-2 ${
                        isActive 
                          ? activeColors 
                          : "bg-[#050505] border-white/5 text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                      }`}
                    >
                      {isActive ? <CheckCircle size={14} /> : <Lock size={12} className="opacity-40" />}
                      {isActive ? `ACTIVE: DB ${num}` : `SWITCH TO DB ${num}`}
                    </button>
                  )
               })}
            </div>
          </div>

          {/* ===================================== */}
          {/* GRID LAYOUT DATABASE 1 */}
          {/* ===================================== */}
          <div className={`transition-all duration-500 w-full ${activeDB !== 1 ? 'opacity-20 grayscale pointer-events-none scale-[0.98] hidden' : 'scale-100 z-10 relative block'}`}>
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-8 shadow-2xl w-full" ref={dropdownRef1}>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between pb-3">
                   <h2 className="text-lg font-black uppercase tracking-widest text-white">Grid Layout Database 1</h2>
                   <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-black tracking-widest">
                      {visiblePanelsCount} PANELS ACTIVE
                   </span>
                </div>
                <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9 }}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories1.slice(0, visiblePanelsCount).map((category, index) => {
                  const originalCategory = DEFAULT_CATEGORIES[index];
                  const subOptions = SUB_CATEGORIES_DB[originalCategory] || [];
                  const autoDesc = autoDescription(category, index, seed, 0, 1);

                  return (
                    <MemoizedPanel 
                      key={`db1-${index}`}
                      index={index}
                      category={category}
                      autoDesc={autoDesc}
                      subOptions={subOptions}
                      updateCategory={updateCategory1}
                      openDropdown={openDropdown1}
                      setOpenDropdown={setOpenDropdown1}
                    />
                  )
                })}
              </div>
            </div>
            <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9, marginTop: '24px', marginBottom: '24px' }}></div>
          </div>

          {/* ===================================== */}
          {/* GRID LAYOUT DATABASE 2 */}
          {/* ===================================== */}
          <div className={`transition-all duration-500 w-full ${activeDB !== 2 ? 'opacity-20 grayscale pointer-events-none scale-[0.98] hidden' : 'scale-100 z-10 relative block'}`}>
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-8 shadow-2xl w-full" ref={dropdownRef2}>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between pb-3">
                   <h2 className="text-lg font-black uppercase tracking-widest text-white">Grid Layout Database 2</h2>
                   <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-black tracking-widest">
                      {visiblePanelsCount} PANELS ACTIVE
                   </span>
                </div>
                <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9 }}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories2.slice(0, visiblePanelsCount).map((category, index) => {
                  const originalCategory = DEFAULT_CATEGORIES_2[index];
                  const subOptions = SUB_CATEGORIES_DB_2[originalCategory] || [];
                  const autoDesc = autoDescription(category, index, seed, 0, 2);

                  return (
                    <MemoizedPanel 
                      key={`db2-${index}`}
                      index={index}
                      category={category}
                      autoDesc={autoDesc}
                      subOptions={subOptions}
                      updateCategory={updateCategory2}
                      openDropdown={openDropdown2}
                      setOpenDropdown={setOpenDropdown2}
                    />
                  )
                })}
              </div>
            </div>
            <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9, marginTop: '24px', marginBottom: '24px' }}></div>
          </div>

          {/* ===================================== */}
          {/* GRID LAYOUT DATABASE 3 */}
          {/* ===================================== */}
          <div className={`transition-all duration-500 w-full ${activeDB !== 3 ? 'opacity-20 grayscale pointer-events-none scale-[0.98] hidden' : 'scale-100 z-10 relative block'}`}>
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-8 shadow-2xl w-full" ref={dropdownRef3}>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between pb-3">
                   <h2 className="text-lg font-black uppercase tracking-widest text-white">Grid Layout Database 3</h2>
                   <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-black tracking-widest">
                      {visiblePanelsCount} PANELS ACTIVE
                   </span>
                </div>
                <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9 }}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories3.slice(0, visiblePanelsCount).map((category, index) => {
                  const originalCategory = DEFAULT_CATEGORIES_3[index];
                  const subOptions = SUB_CATEGORIES_DB_3[originalCategory] || [];
                  const autoDesc = autoDescription(category, index, seed, 0, 3);

                  return (
                    <MemoizedPanel 
                      key={`db3-${index}`}
                      index={index}
                      category={category}
                      autoDesc={autoDesc}
                      subOptions={subOptions}
                      updateCategory={updateCategory3}
                      openDropdown={openDropdown3}
                      setOpenDropdown={setOpenDropdown3}
                    />
                  )
                })}
              </div>
            </div>
            <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9, marginTop: '24px', marginBottom: '24px' }}></div>
          </div>

          {/* ===================================== */}
          {/* GRID LAYOUT DATABASE 4 */}
          {/* ===================================== */}
          <div className={`transition-all duration-500 w-full ${activeDB !== 4 ? 'opacity-20 grayscale pointer-events-none scale-[0.98] hidden' : 'scale-100 z-10 relative block'}`}>
            <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md p-8 shadow-2xl w-full" ref={dropdownRef4}>
              <div className="flex flex-col mb-8">
                <div className="flex items-center justify-between pb-3">
                   <h2 className="text-lg font-black uppercase tracking-widest text-white">Grid Layout Database 4</h2>
                   <span className="text-[10px] bg-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-black tracking-widest">
                      {visiblePanelsCount} PANELS ACTIVE
                   </span>
                </div>
                <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9 }}></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {categories4.slice(0, visiblePanelsCount).map((category, index) => {
                  const originalCategory = DEFAULT_CATEGORIES_4[index];
                  const subOptions = SUB_CATEGORIES_DB_4[originalCategory] || [];
                  const autoDesc = autoDescription(category, index, seed, 0, 4);

                  return (
                    <MemoizedPanel 
                      key={`db4-${index}`}
                      index={index}
                      category={category}
                      autoDesc={autoDesc}
                      subOptions={subOptions}
                      updateCategory={updateCategory4}
                      openDropdown={openDropdown4}
                      setOpenDropdown={setOpenDropdown4}
                    />
                  )
                })}
              </div>
            </div>
            <div style={{ width: '100%', height: '0.5px', background: 'linear-gradient(90deg, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)', opacity: 0.9, marginTop: '24px', marginBottom: '24px' }}></div>
          </div>

          {/* GENERATE I REGENERATE SEKCIJA */}
          <div className="rounded-[2.5rem] border border-orange-500/40 bg-[#0a0a0a]/90 backdrop-blur-md p-8 shadow-[0_0_40px_rgba(234,88,12,0.15)] relative mt-10 max-w-7xl mx-auto w-full">
            
            {generatedPrompts.length === 0 ? (
              
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Zap className="w-16 h-16 text-zinc-700 mb-6" />
                <h2 className="text-2xl font-black text-zinc-500 uppercase tracking-widest mb-8">SYSTEM STANDBY</h2>
                
                <button 
                  onClick={() => handleGenerate100(activeDB)} 
                  disabled={isEngineCoolingDown && !isAdmin}
                  className={`w-full sm:w-[280px] h-[65px] bg-gradient-to-r text-white font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center text-[12px] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                     activeDB === 1 ? 'from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.3)]' :
                     activeDB === 2 ? 'from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 shadow-[0_0_30px_rgba(234,88,12,0.3)]' :
                     activeDB === 3 ? 'from-purple-700 to-purple-500 hover:from-purple-600 hover:to-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.3)]' :
                     'from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 shadow-[0_0_30px_rgba(220,38,38,0.3)]'
                  } ${!isEngineCoolingDown || isAdmin ? 'hover:scale-[1.05]' : ''}`}
                >
                   GENERATE 100 PROMPTS (DB {activeDB})
                </button>
              </div>

            ) : (

              <>
                <div ref={promptsTopRef} className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-white/10 pb-6">
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                      <span className="bg-green-500 text-black px-3 py-1 rounded-lg text-xs font-black">100</span>
                      PROMPTS DEPLOYED
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    
                    <button 
                      onClick={() => handleRegenerate100(activeDB)} 
                      disabled={isEngineCoolingDown && !isAdmin}
                      className={`flex items-center gap-2 text-white px-5 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                         activeDB === 1 ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' :
                         activeDB === 2 ? 'bg-orange-600 hover:bg-orange-500 shadow-[0_0_20px_rgba(234,88,12,0.4)]' :
                         activeDB === 3 ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]' :
                         'bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                      }`}
                    >
                       <RefreshCw size={14} /> REGENERATE (DB {activeDB})
                    </button>

                    <div className="w-px h-8 bg-white/10 mx-2"></div>
                    <button onClick={downloadTxt} title="Export as TXT" className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-white/5"><FileText size={18} /></button>
                    <button onClick={downloadJson} title="Export as JSON" className="p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all border border-white/5"><Code size={18} /></button>
                    <button onClick={clearPrompts} title="Clear All" className="p-3 bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/30"><Trash2 size={18} className="animate-pulse" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">
                  {currentPrompts.map((promptText, i) => {
                     const absoluteIndex = indexOfFirstPrompt + i; 
                     return (
                         <div key={absoluteIndex} className="bg-[#050505] border border-white/5 rounded-2xl p-4 hover:border-orange-500/30 transition-colors relative group flex flex-col h-full">
                            <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-3">
                               <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                                  PROMPT #{String(absoluteIndex + 1).padStart(3, '0')}
                               </span>
                               <button 
                                  onClick={() => copySingle(absoluteIndex, promptText)}
                                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all shadow-lg ${copiedStates[absoluteIndex] ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-orange-600 text-white hover:bg-orange-500'}`}
                               >
                                  <Copy size={12} /> {copiedStates[absoluteIndex] ? 'COPIED!' : 'COPY PROMPT'}
                               </button>
                            </div>
                            <div className="v8-magic-border w-full flex-grow">
                               <textarea 
                                  readOnly 
                                  value={promptText} 
                                  className="v8-magic-inner p-3 font-mono text-[11px] text-zinc-300 resize-none outline-none v8-gradient-scrollbar h-full min-h-[250px]" 
                               />
                            </div>
                         </div>
                     );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 pt-8 border-t border-white/10 w-full">
                     <button 
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-6 py-3 bg-[#050505] border border-white/10 rounded-xl text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest"
                     >
                        PREVIOUS
                     </button>
                     
                     <div className="flex gap-2 overflow-x-auto max-w-full sm:max-w-[50vw] v8-gradient-scrollbar px-2 py-1">
                        {[...Array(totalPages)].map((_, idx) => (
                           <button
                              key={idx + 1}
                              onClick={() => paginate(idx + 1)}
                              className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl text-[11px] font-black transition-all ${
                                 currentPage === idx + 1 
                                    ? 'bg-orange-500 text-black shadow-[0_0_15px_rgba(234,88,12,0.4)] scale-110' 
                                    : 'bg-zinc-900/50 text-zinc-400 border border-white/5 hover:border-orange-500/30 hover:text-orange-400'
                              }`}
                           >
                              {idx + 1}
                           </button>
                        ))}
                     </div>

                     <button 
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-6 py-3 bg-[#050505] border border-white/10 rounded-xl text-zinc-400 hover:text-orange-500 hover:border-orange-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-black text-[10px] uppercase tracking-widest"
                     >
                        NEXT
                     </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: V8GridSystem
// KRAJ FAJLA: V8GridSystem.jsx