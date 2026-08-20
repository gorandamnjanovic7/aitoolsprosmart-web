// POČETAK FAJLA: src/qrcode/V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from '../v8Utils';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Settings, Home, Layout, Zap, Image as ImageIcon, Box, Lock, ChevronDown, Store, FileText, PenTool, Crown, Upload, RefreshCcw, CheckCircle, Globe, Pizza, Save, Download, Flame, Anchor, Wine, Coffee, Utensils, Cake, Fish, Leaf, Droplets, ChefHat, Moon } from 'lucide-react';

import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import { CATEGORY_LIMITS, IMG_POOL, RAW_DB } from '../v8MenuQRCodeData.js';

import { ITALIAN_MASSIVE_MENU } from '../DemoData/italianMassiveData.js';
import { GLOBAL_STREET_MENU } from '../DemoData/globalStreetFoodData.js';
import { MEXICAN_MASSIVE_MENU } from '../DemoData/mexicanMassiveData.js';
import { GREEK_MASSIVE_MENU } from '../DemoData/greekMassiveData.js';
import { FRENCH_MASSIVE_MENU } from '../DemoData/frenchMassiveData.js';
import { TURKISH_MASSIVE_MENU } from '../DemoData/turkishMassiveData.js';

const themeStyles = {
  'V8 Orange': { hex: '#ea580c', text: 'text-orange-500', bg: 'bg-orange-500', border: 'border-orange-500/50', ring: 'focus:border-orange-500/50 focus:ring-orange-500/50', btnText: 'text-black' },
  'V8 Blue': { hex: '#3b82f6', text: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-500/50', ring: 'focus:border-blue-500/50 focus:ring-blue-500/50', btnText: 'text-white' },
  'V8 Green': { hex: '#22c55e', text: 'text-green-500', bg: 'bg-green-500', border: 'border-green-500/50', ring: 'focus:border-green-500/50 focus:ring-green-500/50', btnText: 'text-black' },
  'V8 Red': { hex: '#ef4444', text: 'text-red-500', bg: 'bg-red-500', border: 'border-red-500/50', ring: 'focus:border-red-500/50 focus:ring-red-500/50', btnText: 'text-white' },
  'V8 Purple': { hex: '#a855f7', text: 'text-purple-500', bg: 'bg-purple-500', border: 'border-purple-500/50', ring: 'focus:border-purple-500/50 focus:ring-purple-500/50', btnText: 'text-white' },
  'V8 Gold': { hex: '#eab308', text: 'text-yellow-500', bg: 'bg-yellow-500', border: 'border-yellow-500/50', ring: 'focus:border-yellow-500/50 focus:ring-yellow-500/50', btnText: 'text-black' }
};

const getCategoryIcon = (catName) => {
  const lower = catName.toLowerCase();
  if (lower.includes('signature') || lower.includes('house') || lower.includes('special')) return Flame; 
  if (lower.includes('breakfast')) return Coffee; 
  if (lower.includes('dessert') || lower.includes('sweet') || lower.includes('bakery')) return Cake;
  if (lower.includes('sea') || lower.includes('fish')) return Fish;
  if (lower.includes('pizza') || lower.includes('focaccia')) return Pizza;
  if (lower.includes('salad') || lower.includes('veg') || lower.includes('side')) return Leaf;
  if (lower.includes('soup')) return Droplets;
  if (lower.includes('drink') || lower.includes('wine') || lower.includes('beverage')) return Wine;
  return ChefHat; 
};

const generateInitialItems = (isBlank = false) => {
  let idCounter = 1;
  const finalItems = [];
  CATEGORY_LIMITS.forEach((c, catIndex) => {
    const catDemo = RAW_DB[c.name] && RAW_DB[c.name].length > 0 ? RAW_DB[c.name] : [["", "", "0.00"]];
    for (let i = 0; i < c.limit; i++) {
      const demoItem = catDemo[i % catDemo.length]; 
      const demoImage = IMG_POOL[(catIndex + i) % IMG_POOL.length]; 
      finalItems.push({ id: isBlank ? `custom-${idCounter}` : `demo-${idCounter}`, category: c.name, name: isBlank ? "" : (demoItem[0] || ""), desc: isBlank ? "" : (demoItem[1] || ""), price: isBlank ? "" : (demoItem[2] || "0.00"), img: '', demoImg: isBlank ? "" : demoImage, isSignature: false });
      idCounter++;
    }
  });
  return finalItems;
};

const getSuggestionsWithImages = (categoryName, catIndex) => {
  const catDemo = RAW_DB[categoryName] && RAW_DB[categoryName].length > 0 ? RAW_DB[categoryName] : [];
  return catDemo.map((item, idx) => ({ name: item[0] || "", desc: item[1] || "", price: item[2] || "0.00", demoImg: IMG_POOL[(catIndex + idx) % IMG_POOL.length] }));
};

export default function PremiumMenu() {
  const [items, setItems] = useState(() => generateInitialItems(false));
  const [restaurantName, setRestaurantName] = useState('AURA Fine Dining');
  const [currency, setCurrency] = useState('€');
  const [theme, setTheme] = useState('V8 Orange');

  const [customItems, setCustomItems] = useState(() => generateInitialItems(true));
  const [customRestaurantName, setCustomRestaurantName] = useState('');
  const [customCurrency, setCustomCurrency] = useState('USD');
  const [customTheme, setCustomTheme] = useState('V8 Green');

  const [isSaving, setIsSaving] = useState(false);
  const [generatedMenuId, setGeneratedMenuId] = useState(null);
  
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [generatedCustomMenuId, setGeneratedCustomMenuId] = useState(null);

  const [demoSaveStates, setDemoSaveStates] = useState({});
  const [demoGeneratedIds, setDemoGeneratedIds] = useState({});

  const [uploadingItemId, setUploadingItemId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeCustomDropdownId, setActiveCustomDropdownId] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const currentTheme = themeStyles[theme] || themeStyles['V8 Orange'];
  const currentCustomTheme = themeStyles[customTheme] || themeStyles['V8 Green'];

  const handleItemChange = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const handleCustomItemChange = (id, field, value) => setCustomItems(customItems.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleSuggestionSelect = (id, suggestion) => { setItems(items.map(item => item.id === id ? { ...item, name: suggestion.name, desc: suggestion.desc, price: suggestion.price || item.price, demoImg: suggestion.demoImg || item.demoImg } : item)); setActiveDropdownId(null); };
  const handleCustomSuggestionSelect = (id, suggestion) => { setCustomItems(customItems.map(item => item.id === id ? { ...item, name: suggestion.name, desc: suggestion.desc, price: suggestion.price || item.price, demoImg: suggestion.demoImg || item.demoImg } : item)); setActiveCustomDropdownId(null); };

  const handleImageUpload = async (id, file, isCustom = false) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) { isCustom ? handleCustomItemChange(id, 'img', resData.secure_url) : handleItemChange(id, 'img', resData.secure_url); }
    } catch (err) { console.error(err); } finally { setUploadingItemId(null); }
  };

  const handleGenerateQR = async () => {
    const activeItems = items.filter(item => item.name && item.name.trim() !== '');
    if (!restaurantName.trim() || activeItems.length === 0) { if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a name and at least one item!"); return; }
    setIsSaving(true);
    try {
      const itemsToSave = activeItems.map(item => ({ id: item.id, category: item.category, name: item.name, desc: item.desc, price: item.price, img: item.img || item.demoImg, isSignature: item.isSignature }));
      const docData = { restaurantName, currency, themeColor: currentTheme.hex, items: itemsToSave, createdAt: serverTimestamp(), status: 'active' };
      const docRef = await Promise.race([addDoc(collection(db, 'v8_qr_menus'), docData), new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))]);
      setGeneratedMenuId(docRef.id); if(typeof v8Toast !== 'undefined') v8Toast.success("Layout deployed!");
    } catch (error) { setGeneratedMenuId("TEST-QR-PREVIEW"); if(typeof v8Toast !== 'undefined') v8Toast.success("Test QR deployed!"); } finally { setIsSaving(false); }
  };

  const handleGenerateCustomQR = async () => {
    const activeCustomItems = customItems.filter(item => item.name && item.name.trim() !== '');
    if (!customRestaurantName.trim() || activeCustomItems.length === 0) { if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a restaurant name and at least one item!"); return; }
    setIsSavingCustom(true);
    try {
      const itemsToSave = activeCustomItems.map(item => ({ id: item.id, category: item.category, name: item.name, desc: item.desc, price: item.price, img: item.img || item.demoImg, isSignature: item.isSignature }));
      const docData = { restaurantName: customRestaurantName, currency: customCurrency, themeColor: currentCustomTheme.hex, items: itemsToSave, createdAt: serverTimestamp(), status: 'active' };
      const docRef = await Promise.race([addDoc(collection(db, 'v8_qr_menus'), docData), new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))]);
      setGeneratedCustomMenuId(docRef.id); if(typeof v8Toast !== 'undefined') v8Toast.success("Custom Menu deployed!");
    } catch (error) { setGeneratedCustomMenuId("TEST-QR-CUSTOM"); if(typeof v8Toast !== 'undefined') v8Toast.success("Custom Test QR deployed!"); } finally { setIsSavingCustom(false); }
  };

  const deployStaticDemo = async (demoKey, staticData) => {
    setDemoSaveStates(prev => ({ ...prev, [demoKey]: true }));
    try {
      const docData = { ...staticData, createdAt: serverTimestamp(), status: 'active' };
      const docRef = await Promise.race([addDoc(collection(db, 'v8_qr_menus'), docData), new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))]);
      setDemoGeneratedIds(prev => ({ ...prev, [demoKey]: docRef.id }));
      if(typeof v8Toast !== 'undefined') v8Toast.success(`${demoKey} deployed!`);
    } catch (error) { 
      setDemoGeneratedIds(prev => ({ ...prev, [demoKey]: `TEST-QR-${demoKey.toUpperCase()}` }));
      if(typeof v8Toast !== 'undefined') v8Toast.success(`${demoKey} Test QR deployed!`);
    } finally { 
      setDemoSaveStates(prev => ({ ...prev, [demoKey]: false })); 
    }
  };

  const resetStaticDemo = (demoKey) => {
    setDemoGeneratedIds(prev => { const next = { ...prev }; delete next[demoKey]; return next; });
  };

  const getChartUrl = (id, themeHex = '#ea580c') => {
    const darkColor = themeHex.replace('#', '');
    return `https://quickchart.io/qr?text=${encodeURIComponent(`https://aitoolsprosmart.com/m/${id}`)}&margin=2&size=180&dark=${darkColor}&light=ffffff`;
  };

  const forceDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Greška pri preuzimanju:", error);
      window.open(url, '_blank');
    }
  };

  const STATIC_CARDS = [
    { key: 'aura', title: restaurantName || 'AURA Fine Dining', sub: 'PRE-FILLED DEMO', icon: Crown, theme: currentTheme, isDynamic: true },
    { key: 'italian', title: 'Bella Napoli', sub: 'ITALIAN SHOWCASE (330+)', icon: Pizza, theme: themeStyles['V8 Gold'], data: ITALIAN_MASSIVE_MENU },
    { key: 'greek', title: 'Η Χρυσή Ελιά', sub: 'GREEK TAVERNA (300+)', icon: Anchor, theme: themeStyles['V8 Blue'], data: GREEK_MASSIVE_MENU },
    { key: 'global', title: 'Supreme Fast Food', sub: 'GLOBAL STREET FOOD (360+)', icon: Globe, theme: themeStyles['V8 Red'], data: GLOBAL_STREET_MENU },
    { key: 'turkish', title: 'Topkapı Sarayı', sub: 'TURKISH SOFRA (240+)', icon: Moon, theme: themeStyles['V8 Red'], data: TURKISH_MASSIVE_MENU },
    { key: 'mexican', title: 'La Cantina', sub: 'MEXICAN KITCHEN (230+)', icon: Flame, theme: themeStyles['V8 Green'], data: MEXICAN_MASSIVE_MENU },
    { key: 'french', title: 'La Maison', sub: 'FRENCH CUISINE (360+)', icon: Wine, theme: themeStyles['V8 Purple'], data: FRENCH_MASSIVE_MENU }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      
      {/* --- GLAVNI VIDEO BACKGROUND SLOJ (Iza svega) --- */}
      <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-100"
        >
          <source src="/video_bg_menu.mp4" type="video/mp4" />
        </video>
        {/* Veoma blag gradient samo da ne ometa tekst kad se skroluje skroz dole */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 via-black/40 to-[#0d0d11]/90"></div>
      </div>
      {/* ----------------------------- */}

      <style>{`
        .v8-beautiful-scroll::-webkit-scrollbar { width: 8px; }
        .v8-beautiful-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; margin-block: 10px; }
        .v8-beautiful-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #ea580c, #ca8a04); border-radius: 10px; border: 2px solid #1c1c22; }
        .v8-beautiful-scroll::-webkit-scrollbar-thumb:hover { background: #f97316; }
      `}</style>

      <main className="relative z-10 max-w-[1600px] mx-auto px-4 md:px-12 py-10 space-y-12">
        
        {/* --- HORIZONTALNI HEADER BOX (SA NOVIM VIDEOM) --- */}
        <div className="relative w-full rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-center gap-16 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Novi video pozadina SAMO za ovaj box */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
          >
            <source src="/video_bg_box1.mp4" type="video/mp4" />
          </video>
          {/* Obezbeđujemo da tekst ostane čitljiv preko svetlih delova videa */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-0"></div>

          {/* Sadržaj headera */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-orange-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
          
          <div className="relative w-48 md:w-56 shrink-0 z-10 flex items-center justify-center">
            <img src="/tel_box_ico.webp" alt="V10 Mockup" className="w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(234,88,12,0.6)]" />
          </div>
          
          <div className="flex flex-col items-center md:items-start justify-center z-10 relative">
            <div className="mb-6 transform origin-left">
              <div className="px-4 py-1.5 border border-[#ea580c] text-[#ea580c] text-[10px] md:text-xs font-bold tracking-[0.25em] rounded-full uppercase bg-black/60 backdrop-blur-md shadow-[0_0_15px_rgba(234,88,12,0.15)]">
                Cinematic Protocol // QR Restaurant Suite
              </div>
            </div>
            <h1 className="text-4xl md:text-[4.5rem] font-black italic tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex flex-wrap gap-4 justify-center md:justify-start leading-none">
              QR <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">MENU BUILDER</span>
            </h1>
          </div>
        </div>
        {/* -------------------------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 w-full mb-6">
          <div className="lg:col-span-8 flex flex-col items-center justify-center w-full gap-4">
            <label className={`font-black text-2xl md:text-3xl tracking-[0.15em] uppercase flex items-center gap-4 text-center ${currentTheme.text} drop-shadow-md transition-colors duration-300`}><Store size={36} /> 1. EXPLORE OUR MENU</label>
            <button onClick={() => document.getElementById('custom-builder-section').scrollIntoView({ behavior: 'smooth' })} className={`${currentTheme.text} flex items-center gap-2 text-sm md:text-base font-bold uppercase tracking-[0.2em] transition-opacity duration-300 hover:opacity-70`}>OR BUILD YOUR OWN MENU <ChevronDown size={22} className={`${currentTheme.text} animate-bounce`} /></button>
          </div>
          <div className="lg:col-span-4 hidden lg:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 items-start">
          
          <div className="lg:col-span-8 flex flex-col gap-8 w-full max-w-full">
            
            <div className="bg-[#1c1c22]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-full h-[880px]">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-[#16161a]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-inner shrink-0">
                <div className="md:col-span-6">
                  <label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentTheme.text}`}>Restaurant Name</label>
                  <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 text-base font-bold outline-none ${currentTheme.text} ${currentTheme.ring}`} />
                </div>
                <div className="md:col-span-3">
                  <label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentTheme.text}`}>Currency</label>
                  <div className="relative">
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-10 text-base font-bold outline-none cursor-pointer appearance-none ${currentTheme.text} ${currentTheme.ring}`}>
                      <option value="€">EUR (€)</option><option value="$">USD ($)</option><option value="RSD">RSD</option>
                    </select>
                    <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none ${currentTheme.text}`} />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentTheme.text}`}>Theme Color</label>
                  <div className="relative">
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-10 text-base font-bold outline-none cursor-pointer appearance-none ${currentTheme.text} ${currentTheme.ring}`}>
                      {Object.keys(themeStyles).map(color => <option key={color} value={color}>{color}</option>)}
                    </select>
                    <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none ${currentTheme.text}`} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-10 overflow-y-auto overflow-x-visible mt-8 flex-1 pl-2 pr-4 pb-4 v8-beautiful-scroll">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = items.filter(i => i.category === cat.name);
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);
                  const CatIcon = getCategoryIcon(cat.name); 

                  return (
                    <div key={`demo-${cat.name}`} className="shrink-0 bg-[#24242a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                      <div className="flex items-center justify-between bg-[#16161a]/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 mb-8">
                        <h3 className={`${currentTheme.text} font-black uppercase tracking-[0.2em] text-lg md:text-xl flex items-center gap-3`}>
                          <CatIcon size={24} className="drop-shadow-md" />
                          {cat.name}
                        </h3>
                        <span className={`${currentTheme.text} font-bold text-xs bg-[#0d0d11]/80 border border-white/5 px-4 py-2 rounded-lg`}>{catItems.filter(i => i.name.trim() !== '').length} / {cat.limit} SLOTS</span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div key={item.id} className={`shrink-0 bg-[#1c1c22]/90 backdrop-blur-sm border border-white/5 border-l-4 rounded-2xl p-6 md:p-8 relative group ${currentTheme.border}`}>
                            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                              <span className={`${currentTheme.text} font-black text-xs uppercase tracking-widest opacity-80`}>{item.category} / Slot {index + 1}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pr-10">
                              <div className="md:col-span-8 relative">
                                <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentTheme.text}`}>Dish Name</label>
                                
                                <div className="relative">
                                  <input 
                                    type="text" 
                                    value={item.name} 
                                    onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} 
                                    onFocus={() => setActiveDropdownId(item.id)} 
                                    onBlur={() => setTimeout(() => setActiveDropdownId(null), 250)} 
                                    placeholder={`Choose ${item.category}...`} 
                                    className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-12 text-base md:text-lg font-bold outline-none cursor-pointer ${currentTheme.text} ${currentTheme.ring}`} 
                                  />
                                  <ChevronDown 
                                    size={22} 
                                    className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none transition-transform duration-300 ${activeDropdownId === item.id ? 'rotate-180' : ''} ${currentTheme.text}`} 
                                  />
                                </div>

                                <AnimatePresence>
                                  {activeDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 w-full mt-2 bg-[#24242a] border border-white/10 rounded-xl shadow-2xl z-[100] max-h-60 overflow-y-auto v8-beautiful-scroll">
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div key={sIdx} onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(item.id, suggestion); }} className="p-4 border-b border-white/5 hover:bg-[#2b2e34] cursor-pointer">
                                          <div className={`${currentTheme.text} font-bold text-base mb-1`}>{suggestion.name}</div>
                                          <div className={`${currentTheme.text} opacity-60 text-xs`}>{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              
                              <div className="md:col-span-4 relative">
                                <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentTheme.text}`}>Price</label>
                                <div className="relative">
                                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-base font-black opacity-70 ${currentTheme.text}`}>{currency}</span>
                                  <input type="text" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} placeholder="0.00" className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl pl-10 pr-5 py-4 text-base md:text-lg font-black outline-none ${currentTheme.text} ${currentTheme.ring}`} />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentTheme.text}`}>Description</label>
                              <textarea value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} placeholder="Short description..." rows={2} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 text-base outline-none resize-none ${currentTheme.text} ${currentTheme.ring}`} />
                            </div>
                            
                            <div className="border-t border-white/5 pt-6">
                              <label className={`${currentTheme.text} font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2`}><ImageIcon size={18} /> Dish Image</label>
                              {item.img ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#0d0d11] shadow-inner">
                                  <img src={item.img} alt="Dish" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="relative">
                                  <input type="file" accept="image/*" id={`file-demo-${item.id}`} className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleImageUpload(item.id, e.target.files[0], false); }} />
                                  <label htmlFor={`file-demo-${item.id}`} className={`flex items-center justify-center gap-3 w-full bg-[#16161a]/80 backdrop-blur-md border-2 border-dashed border-white/10 rounded-xl py-6 text-base font-black uppercase cursor-pointer opacity-70 hover:opacity-100 ${currentTheme.text}`}>
                                    {uploadingItemId === item.id ? <><RefreshCcw size={20} className="animate-spin" /> UPLOADING...</> : <><Upload size={20} /> UPLOAD IMAGE</>}
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* DEPLOY SEKCIJA 1 */}
            <div className={`p-8 md:p-10 border border-white/10 rounded-[2rem] flex flex-col items-center justify-between gap-8 transition-all bg-[#1c1c22]/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] ${currentTheme.border}`}>
              {!generatedMenuId ? (
                <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                  <div className="flex flex-col text-center md:text-left">
                    <h4 className={`font-black text-xl md:text-2xl uppercase tracking-[0.15em] ${currentTheme.text}`}>Deploy Customized Layout</h4>
                    <p className="text-zinc-400 text-sm mt-2 max-w-md">Creates a master QR code holding all filled slots. Empty slots are automatically filtered out for a pristine menu view.</p>
                  </div>
                  <button onClick={handleGenerateQR} disabled={isSaving} className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-opacity hover:opacity-80 shadow-[0_0_20px_rgba(0,0,0,0.5)] shrink-0 ${currentTheme.bg} ${currentTheme.btnText}`}>
                    {isSaving ? 'GENERATING...' : <><Save size={20} /> DEPLOY ALL CUSTOMIZED DATA</>}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full gap-8">
                  <div className="flex items-center gap-3 text-green-400 bg-green-500/10 border border-green-500/20 px-8 py-3 rounded-full text-sm font-black tracking-widest">
                    <CheckCircle size={20} className="animate-pulse" />
                    <span>CUSTOM MENU SUCCESSFULLY DEPLOYED</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                    <div className="bg-black/50 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(0,0,0,0.8)] border shrink-0" style={{ borderColor: currentTheme.hex }}>
                      <img src={getChartUrl(generatedMenuId, currentTheme.hex)} alt="Customized QR" className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-screen" />
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-64">
                      <button 
                        onClick={() => forceDownload(getChartUrl(generatedMenuId, currentTheme.hex), "Master_QR_Menu.png")}
                        className={`w-full py-4 text-center rounded-xl font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-80 shadow-lg ${currentTheme.bg} ${currentTheme.btnText}`}
                      >
                        <Download size={16} className="inline mb-0.5 mr-2" /> DOWNLOAD HIGH-RES
                      </button>
                      <button onClick={() => setGeneratedMenuId(null)} className="w-full py-3.5 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-400 rounded-xl text-xs font-black uppercase hover:text-white transition-colors">
                        RESET LAYOUT
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BLOK 2: BUILD YOUR OWN MENU */}
            <div id="custom-builder-section" className="flex flex-col gap-6 w-full pt-8">
              <div className="flex flex-col items-center justify-center w-full gap-3 mb-2"><label className={`font-black text-2xl md:text-3xl tracking-[0.15em] uppercase flex items-center gap-4 text-center ${currentCustomTheme.text} drop-shadow-md`}><PenTool size={36} /> 2. BUILD YOUR OWN MENU</label></div>
              <div className="bg-[#1c1c22]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-full h-[880px]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-[#16161a]/60 backdrop-blur-md border border-white/5 p-6 rounded-3xl shadow-inner shrink-0">
                  <div className="md:col-span-6"><label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentCustomTheme.text}`}>Your Restaurant Name</label><input type="text" value={customRestaurantName} onChange={(e) => setCustomRestaurantName(e.target.value)} placeholder="Type name here..." className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 text-base font-bold outline-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`} /></div>
                  
                  <div className="md:col-span-3">
                    <label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentCustomTheme.text}`}>Currency</label>
                    <div className="relative">
                      <select value={customCurrency} onChange={(e) => setCustomCurrency(e.target.value)} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-10 text-base font-bold outline-none cursor-pointer appearance-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`}>
                        <option value="€">EUR (€)</option><option value="$">USD ($)</option><option value="RSD">RSD</option>
                      </select>
                      <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none ${currentCustomTheme.text}`} />
                    </div>
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className={`text-[10px] font-bold tracking-widest uppercase mb-3 block ${currentCustomTheme.text}`}>Theme Color</label>
                    <div className="relative">
                      <select value={customTheme} onChange={(e) => setCustomTheme(e.target.value)} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-10 text-base font-bold outline-none cursor-pointer appearance-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`}>
                        {Object.keys(themeStyles).map(color => <option key={color} value={color}>{color}</option>)}
                      </select>
                      <ChevronDown size={18} className={`absolute right-4 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none ${currentCustomTheme.text}`} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-10 overflow-y-auto overflow-x-visible mt-8 flex-1 pl-2 pr-4 pb-4 v8-beautiful-scroll">
                  {CATEGORY_LIMITS.map((cat, catIndex) => {
                    const catItems = customItems.filter(i => i.category === cat.name);
                    const CatIcon = getCategoryIcon(cat.name);

                    return (
                      <div key={`custom-${cat.name}`} className="shrink-0 bg-[#24242a]/80 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center justify-between bg-[#16161a]/80 backdrop-blur-md p-5 rounded-2xl border border-white/5 mb-8">
                          <h3 className={`${currentCustomTheme.text} font-black uppercase tracking-[0.2em] text-lg md:text-xl flex items-center gap-3`}>
                            <CatIcon size={24} className="drop-shadow-md" />
                            {cat.name}
                          </h3>
                        </div>
                        
                        <div className="flex flex-col gap-6">
                          {catItems.map((item, index) => (
                            <div key={item.id} className={`shrink-0 bg-[#1c1c22]/90 backdrop-blur-sm border border-white/5 border-l-4 rounded-2xl p-6 md:p-8 relative group ${currentCustomTheme.border}`}>
                              <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                                <span className={`${currentCustomTheme.text} font-black text-xs uppercase tracking-widest opacity-80`}>
                                  {item.category} / Custom Slot {index + 1}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pr-10">
                                <div className="md:col-span-8 relative">
                                  <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentCustomTheme.text}`}>Dish Name</label>
                                  <input 
                                    type="text" 
                                    value={item.name} 
                                    onChange={(e) => handleCustomItemChange(item.id, 'name', e.target.value)} 
                                    placeholder={`Type ${item.category} name...`} 
                                    className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 pr-12 text-base md:text-lg font-bold outline-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`} 
                                  />
                                </div>
                                <div className="md:col-span-4 relative">
                                  <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentCustomTheme.text}`}>Price</label>
                                  <div className="relative">
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-base font-black opacity-70 ${currentCustomTheme.text}`}>{customCurrency}</span>
                                    <input type="text" value={item.price} onChange={(e) => handleCustomItemChange(item.id, 'price', e.target.value)} placeholder="0.00" className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl pl-10 pr-5 py-4 text-base md:text-lg font-black outline-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`} />
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mb-6">
                                <label className={`text-[10px] font-bold tracking-widest uppercase mb-2 block opacity-70 ${currentCustomTheme.text}`}>Description</label>
                                <textarea value={item.desc} onChange={(e) => handleCustomItemChange(item.id, 'desc', e.target.value)} placeholder="Type custom description..." rows={2} className={`w-full bg-[#0d0d11]/80 border border-white/10 rounded-xl px-5 py-4 text-base outline-none resize-none ${currentCustomTheme.text} ${currentCustomTheme.ring}`} />
                              </div>
                              
                              <div className="border-t border-white/5 pt-6">
                                <label className={`${currentCustomTheme.text} font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2`}><ImageIcon size={18} /> Dish Image</label>
                                {item.img ? (
                                  <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#0d0d11] shadow-inner">
                                    <img src={item.img} alt="Dish" className="w-full h-full object-cover" />
                                  </div>
                                ) : (
                                  <div className="relative">
                                    <input type="file" accept="image/*" id={`file-custom-${item.id}`} className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleImageUpload(item.id, e.target.files[0], true); }} />
                                    <label htmlFor={`file-custom-${item.id}`} className={`flex items-center justify-center gap-3 w-full bg-[#16161a]/80 backdrop-blur-md border-2 border-dashed border-white/10 rounded-xl py-6 text-base font-black uppercase cursor-pointer opacity-70 hover:opacity-100 ${currentCustomTheme.text}`}>
                                      {uploadingItemId === item.id ? <><RefreshCcw size={20} className="animate-spin" /> UPLOADING...</> : <><Upload size={20} /> UPLOAD IMAGE</>}
                                    </label>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className={`mt-6 p-8 md:p-10 border border-white/10 rounded-[2rem] flex flex-col items-center justify-between gap-8 transition-all bg-[#1c1c22]/80 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] shrink-0 ${currentCustomTheme.border}`}>
                  {!generatedCustomMenuId ? (
                    <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8">
                      <div className="flex flex-col text-center md:text-left">
                        <h4 className={`font-black text-xl md:text-2xl uppercase tracking-[0.15em] ${currentCustomTheme.text}`}>Deploy Custom Menu</h4>
                        <p className="text-zinc-400 text-sm mt-2 max-w-md">Creates a clean master QR code for your fully manually written dishes. All empty inputs are hidden automatically.</p>
                      </div>
                      <button onClick={handleGenerateCustomQR} disabled={isSavingCustom} className={`px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] shrink-0 ${currentCustomTheme.bg} ${currentCustomTheme.btnText}`}>
                        {isSavingCustom ? 'GENERATING...' : <><Save size={20} /> DEPLOY CUSTOM QR CODE</>}
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full gap-8">
                      <div className="flex items-center gap-3 text-green-400 bg-green-500/10 border border-green-500/20 px-8 py-3 rounded-full text-sm font-black tracking-widest">
                        <CheckCircle size={20} className="animate-pulse" />
                        <span>CUSTOM QR CODE SUCCESSFULLY GENERATED</span>
                      </div>
                      <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
                        <div className="bg-black/50 p-4 rounded-[1.5rem] shadow-[0_0_30px_rgba(0,0,0,0.8)] border shrink-0" style={{ borderColor: currentCustomTheme.hex }}>
                          <img src={getChartUrl(generatedCustomMenuId, currentCustomTheme.hex)} alt="Custom QR Code" className="w-32 h-32 md:w-40 md:h-40 object-contain mix-blend-screen" />
                        </div>
                        <div className="flex flex-col gap-3 w-full md:w-64">
                          <button 
                            onClick={() => forceDownload(getChartUrl(generatedCustomMenuId, currentCustomTheme.hex), "Custom_QR_Menu.png")}
                            className={`w-full py-4 text-center rounded-xl font-black text-xs uppercase tracking-widest transition-opacity hover:opacity-80 shadow-lg ${currentCustomTheme.bg} ${currentCustomTheme.btnText}`}
                          >
                            <Download size={16} className="inline mb-0.5 mr-2" /> DOWNLOAD HIGH-RES
                          </button>
                          <button onClick={() => setGeneratedCustomMenuId(null)} className="w-full py-3.5 bg-zinc-900/80 backdrop-blur-md border border-white/10 text-zinc-400 rounded-xl text-xs font-black uppercase hover:text-white transition-colors">
                            RESET LAYOUT
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* DESNA STRANA - QR KODOVI */}
          <div className="lg:col-span-4 relative w-full">
            <div className="flex flex-col gap-12 sticky top-[100px] w-full max-h-[calc(100vh-120px)] overflow-y-auto overflow-x-visible pl-4 pr-12 py-10 v8-beautiful-scroll">
              
              {STATIC_CARDS.map((card) => {
                const generatedId = card.isDynamic ? generatedMenuId : demoGeneratedIds[card.key];
                const isCardSaving = card.isDynamic ? isSaving : demoSaveStates[card.key];
                const handleGen = card.isDynamic ? handleGenerateQR : () => deployStaticDemo(card.key, card.data);
                const handleRes = card.isDynamic ? () => setGeneratedMenuId(null) : () => resetStaticDemo(card.key);

                return (
                  <div key={card.key} className={`w-full max-w-[280px] mx-auto bg-[#1c1c22]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 flex flex-col items-center text-center shadow-[0_0_40px_rgba(0,0,0,0.6)] transition-all ${card.theme.border}`}>
                    {!generatedId ? (
                      <div className="w-full flex flex-col items-center">
                        <div className="w-full mb-6 rounded-2xl overflow-hidden shadow-lg border border-white/5">
                          <img src="/QRMenuPromo.webp" alt="Promo" className="w-full h-auto object-cover" />
                        </div>
                        <card.icon size={28} className={`mb-3 drop-shadow-md ${card.theme.text}`} />
                        <h2 className={`font-black text-xl uppercase tracking-widest mb-1 ${card.theme.text}`}>{card.title}</h2>
                        <h3 className={`font-bold text-[11px] uppercase tracking-[0.2em] mb-6 ${card.theme.text}`}>{card.sub}</h3>
                        <button onClick={handleGen} disabled={isCardSaving} className={`w-full font-black text-[13px] uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center gap-3 transition-opacity hover:opacity-80 ${card.theme.bg} ${card.theme.btnText}`}>
                          {isCardSaving ? 'GENERATING...' : <><Save size={18} /> DEPLOY QR</>}
                        </button>
                      </div>
                    ) : (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full">
                        <div className="bg-black/50 p-3.5 rounded-2xl mb-4 shadow-[0_0_20px_rgba(0,0,0,0.8)] border" style={{ borderColor: card.theme.hex }}>
                          <img src={getChartUrl(generatedId, card.theme.hex)} alt="QR Code" className="w-28 h-28 object-contain mix-blend-screen" />
                        </div>
                        <button 
                          onClick={() => forceDownload(getChartUrl(generatedId, card.theme.hex), `${card.key}_QR_Menu.png`)}
                          className={`w-full font-black uppercase tracking-widest py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] mb-2.5 ${card.theme.bg} ${card.theme.btnText}`}
                        >
                          <Download size={15} /> DOWNLOAD
                        </button>
                        <button onClick={handleRes} className="w-full bg-[#16161a]/80 backdrop-blur-md border border-white/10 text-zinc-400 px-4 py-3 rounded-xl text-[11px] font-black uppercase hover:text-white transition-colors">RESET</button>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
// KRAJ FUNKCIJE: PremiumMenu
// KRAJ FAJLA: src/qrcode/V8PremiumTestMenu.jsx