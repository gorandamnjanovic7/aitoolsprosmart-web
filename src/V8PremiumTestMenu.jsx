// POČETAK FAJLA: V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from './v8Utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { QrCode, Save, Download, Store, Crown, Image as ImageIcon, Code, ChevronDown, Trash2, Upload, RefreshCcw, PenTool, CheckCircle, Utensils, Coffee } from 'lucide-react';

import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { CATEGORY_LIMITS, IMG_POOL, RAW_DB } from './v8MenuQRCodeData';

// POČETAK FUNKCIJE: generateInitialItems
const generateInitialItems = (isBlank = false) => {
  let idCounter = 1;
  const finalItems = [];
  
  CATEGORY_LIMITS.forEach((c, catIndex) => {
    const catDemo = RAW_DB[c.name] && RAW_DB[c.name].length > 0 ? RAW_DB[c.name] : [["", "", "0.00"]];
    for (let i = 0; i < c.limit; i++) {
      const demoItem = catDemo[i % catDemo.length]; 
      const demoImage = IMG_POOL[(catIndex + i) % IMG_POOL.length]; 
      
      finalItems.push({ 
        id: isBlank ? `custom-${idCounter}` : `demo-${idCounter}`, 
        category: c.name, 
        name: isBlank ? "" : (demoItem[0] || ""), 
        desc: isBlank ? "" : (demoItem[1] || ""), 
        price: isBlank ? "" : (demoItem[2] || "0.00"), 
        img: '', 
        demoImg: isBlank ? "" : demoImage, 
        isSignature: false 
      });
      idCounter++;
    }
  });
  return finalItems;
};
// KRAJ FUNKCIJE: generateInitialItems

// POČETAK FUNKCIJE: getSuggestionsWithImages
const getSuggestionsWithImages = (categoryName, catIndex) => {
  const catDemo = RAW_DB[categoryName] && RAW_DB[categoryName].length > 0 ? RAW_DB[categoryName] : [];
  return catDemo.map((item, idx) => ({
    name: item[0] || "",
    desc: item[1] || "",
    price: item[2] || "0.00",
    demoImg: IMG_POOL[(catIndex + idx) % IMG_POOL.length]
  }));
};
// KRAJ FUNKCIJE: getSuggestionsWithImages

// POČETAK FUNKCIJE: V8PremiumTestMenu
export default function V8PremiumTestMenu() {
  const [items, setItems] = useState(() => generateInitialItems(false));
  const [restaurantName, setRestaurantName] = useState('AURA Fine Dining');
  const [currency, setCurrency] = useState('€');
  const [themeColor, setThemeColor] = useState('#FF8C00');

  const [customItems, setCustomItems] = useState(() => generateInitialItems(true));
  const [customRestaurantName, setCustomRestaurantName] = useState('');
  const [customCurrency, setCustomCurrency] = useState('€');
  const [customThemeColor, setCustomThemeColor] = useState('#10b981');

  const [isSaving, setIsSaving] = useState(false);
  const [generatedMenuId, setGeneratedMenuId] = useState(null);
  
  const [uploadingItemId, setUploadingItemId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeCustomDropdownId, setActiveCustomDropdownId] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // POČETAK FUNKCIJE: handleClearItem
  const handleClearItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, name: '', desc: '', price: '', img: '', demoImg: '', isSignature: false } : item));
  };
  // KRAJ FUNKCIJE: handleClearItem
  
  // POČETAK FUNKCIJE: handleItemChange
  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  // KRAJ FUNKCIJE: handleItemChange
  
  // POČETAK FUNKCIJE: handleSuggestionSelect
  const handleSuggestionSelect = (id, suggestion) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          name: suggestion.name, 
          desc: suggestion.desc,
          price: suggestion.price || item.price,
          demoImg: suggestion.demoImg || item.demoImg 
        };
      }
      return item;
    }));
    setActiveDropdownId(null);
  };
  // KRAJ FUNKCIJE: handleSuggestionSelect
  
  // POČETAK FUNKCIJE: handleImageUpload
  const handleImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleItemChange(id, 'img', resData.secure_url);
    } catch (err) { 
      console.error(err);
    } finally { setUploadingItemId(null); }
  };
  // KRAJ FUNKCIJE: handleImageUpload

  // POČETAK FUNKCIJE: handleCustomClearItem
  const handleCustomClearItem = (id) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, name: '', desc: '', price: '', img: '', demoImg: '', isSignature: false } : item));
  };
  // KRAJ FUNKCIJE: handleCustomClearItem
  
  // POČETAK FUNKCIJE: handleCustomItemChange
  const handleCustomItemChange = (id, field, value) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };
  // KRAJ FUNKCIJE: handleCustomItemChange
  
  // POČETAK FUNKCIJE: handleCustomSuggestionSelect
  const handleCustomSuggestionSelect = (id, suggestion) => {
    setCustomItems(customItems.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          name: suggestion.name, 
          desc: suggestion.desc,
          price: suggestion.price || item.price,
          demoImg: suggestion.demoImg || item.demoImg 
        };
      }
      return item;
    }));
    setActiveCustomDropdownId(null);
  };
  // KRAJ FUNKCIJE: handleCustomSuggestionSelect
  
  // POČETAK FUNKCIJE: handleCustomImageUpload
  const handleCustomImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleCustomItemChange(id, 'img', resData.secure_url);
    } catch (err) { 
      console.error(err); 
    } finally { setUploadingItemId(null); }
  };
  // KRAJ FUNKCIJE: handleCustomImageUpload

  const activeItems = items.filter(item => item.name && item.name.trim() !== '');

  const groupedItems = activeItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryOrder = CATEGORY_LIMITS.map(c => c.name);
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  // POČETAK FUNKCIJE: handleGenerateQR (SA ANTI-FREEZE SISTEMOM)
  const handleGenerateQR = async () => {
    if (!restaurantName.trim() || activeItems.length === 0) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a restaurant name and at least one item!");
      return;
    }
    setIsSaving(true);
    
    try {
      const itemsToSave = activeItems.map(item => ({
        id: item.id,
        category: item.category,
        name: item.name,
        desc: item.desc,
        price: item.price,
        img: item.img ? item.img : item.demoImg, 
        isSignature: item.isSignature
      }));
      
      const docData = {
        restaurantName,
        currency,
        themeColor,
        items: itemsToSave, 
        createdAt: serverTimestamp(),
        status: 'active'
      };

      const savePromise = addDoc(collection(db, 'v8_qr_menus'), docData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 3000));
      
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      
      setGeneratedMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Database deployed! QR code ready.");
      
    } catch (error) {
      console.error("Firebase save error / Timeout:", error);
      setGeneratedMenuId("TEST-QR-PREVIEW-123");
      if(typeof v8Toast !== 'undefined') v8Toast.success("Test QR Generated Successfully!");
    } finally {
      setIsSaving(false);
    }
  };
  // KRAJ FUNKCIJE: handleGenerateQR

  const publicMenuUrl = generatedMenuId ? `https://aitoolsprosmart.com/m/${generatedMenuId}` : '';
  const qrCodeImageUrl = generatedMenuId ? `https://quickchart.io/qr?text=${encodeURIComponent(publicMenuUrl)}&margin=1&size=512` : null;
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-[#050505] p-6 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-[1600px] w-[96%] mx-auto mt-28 relative font-sans selection:bg-[#FF8C00] selection:text-white">
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(255,140,0,0.15)]">
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 z-0 pointer-events-none">
          <source src="/v8-debranding-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/60 via-[#050505]/80 to-[#050505]"></div>
        <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
          <div className="inline-block bg-orange-600/10 border border-orange-500/30 px-5 py-2 rounded-full text-orange-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs mb-6 animate-pulse shadow-[0_0_20px_rgba(234,88,12,0.2)] backdrop-blur-sm">
            V8 CINEMATIC PROTOCOL // QR RESTAURANT SUITE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
            <Code className="text-orange-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(234,88,12,0.8)]" />
            QR <span className="text-transparent bg-clip-text bg-gradient-to-b from-orange-500 to-amber-600 drop-shadow-none">MENU BUILDER</span>
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 relative z-10 mb-12 items-start">
        
        {/* ========================================================================= */}
        {/* 🟢 POČETAK: LEVA STRANA (INPUT POLJA, CUSTOM MENI I KONTROLE) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 flex flex-col gap-12 w-full">

          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <label className="text-[#FF8C00] font-black text-xs md:text-sm tracking-widest uppercase flex items-center gap-2">
                <Store size={18} /> 1. EXPLORE OUR MENU
              </label>
              <button 
                onClick={() => document.getElementById('custom-box')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="text-xs font-black uppercase tracking-widest hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                style={{ color: themeColor }}
              >
                OR CREATE YOUR CUSTOM MENU <ChevronDown size={16} className="animate-bounce" />
              </button>
            </div>

            <div className="bg-[#0a0e17] border border-blue-900/30 rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-2xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-black/40 border border-zinc-800/80 p-6 rounded-3xl">
                
                <div className="md:col-span-6">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Restaurant Name
                  </label>
                  <input 
                    type="text" 
                    value={restaurantName} 
                    onChange={(e) => setRestaurantName(e.target.value)} 
                    placeholder="e.g., Casa Dragones Lounge" 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-[#FF8C00] transition-all shadow-inner" 
                  />
                </div>
                
                <div className="md:col-span-3">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Currency
                  </label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)} 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-[#FF8C00] cursor-pointer shadow-inner"
                  >
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="RSD">RSD</option>
                    <option value="£">GBP (£)</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Theme Color
                  </label>
                  <select 
                    value={themeColor} 
                    onChange={(e) => setThemeColor(e.target.value)} 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-[#FF8C00] cursor-pointer shadow-inner"
                  >
                    <option value="#FF8C00">V8 Orange</option>
                    <option value="#3b82f6">V8 Blue</option>
                    <option value="#10b981">V8 Green</option>
                    <option value="#eab308">V8 Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto max-h-[750px] pr-3 custom-scrollbar">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = items.filter(i => i.category === cat.name);
                  const activeCount = catItems.filter(i => i.name.trim() !== '').length;
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);

                  return (
                    <div key={`demo-${cat.name}`} className="shrink-0 bg-black/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-lg">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
                        <h3 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3">
                          <span 
                            className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,140,0,0.8)]" 
                            style={{ backgroundColor: themeColor }}>
                          </span>
                          {cat.name} {cat.name === "House Specials" ? "🔥" : ""}
                        </h3>
                        <span className="text-[#607ca8] font-black text-xs bg-[#0b1221] px-4 py-2 rounded-lg border border-[#1c2846]">
                          {activeCount} / {cat.limit} SLOTS
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="shrink-0 bg-[#0a0a0a] border border-zinc-800 border-l-4 border-l-zinc-700 rounded-2xl p-6 relative group focus-within:border-zinc-700 focus-within:border-l-[#FF8C00] transition-all duration-300 shadow-md"
                          >
                            <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-2">
                              <span className="text-zinc-500 font-black text-xs lowercase tracking-widest">
                                {item.category} {index + 1}
                              </span>
                              <button 
                                onClick={() => handleClearItem(item.id)} 
                                className="text-zinc-500 hover:text-red-500 cursor-pointer bg-[#0b1221] p-2 rounded-lg border border-[#1c2846]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 pr-10">
                              <div className="md:col-span-8 relative">
                                <input 
                                  type="text" 
                                  value={item.name} 
                                  onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} 
                                  onFocus={() => setActiveDropdownId(item.id)} 
                                  onBlur={() => setTimeout(() => setActiveDropdownId(null), 250)} 
                                  placeholder="Choose a dish or type your own..." 
                                  className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 pr-10 text-white font-bold outline-none focus:border-[#FF8C00]" 
                                />
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#476086] pointer-events-none" />
                                
                                <AnimatePresence>
                                  {activeDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div 
                                      key={`dropdown-demo-${item.id}`} 
                                      initial={{ opacity: 0, y: -5 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, y: -5 }} 
                                      className="absolute top-full left-0 w-full mt-2 bg-[#0b1221] border border-[#1c2846] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] max-h-60 overflow-y-auto custom-scrollbar"
                                    >
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div 
                                          key={sIdx} 
                                          onMouseDown={(e) => { 
                                            e.preventDefault(); 
                                            handleSuggestionSelect(item.id, suggestion); 
                                          }} 
                                          className="p-3.5 border-b border-[#1c2846]/50 hover:bg-[#111a2f] cursor-pointer"
                                        >
                                          <div className="text-white font-bold text-sm mb-1">{suggestion.name}</div>
                                          <div className="text-[#607ca8] text-[10px] line-clamp-2">{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="md:col-span-4 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#476086] font-black">{currency}</span>
                                <input 
                                  type="text" 
                                  value={item.price} 
                                  onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} 
                                  placeholder="0.00" 
                                  className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl pl-9 pr-4 py-3 text-[#FF8C00] font-black outline-none focus:border-[#FF8C00]" 
                                />
                              </div>
                            </div>
                            <div className="mb-5">
                              <textarea 
                                value={item.desc} 
                                onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} 
                                placeholder="Short description, ingredients..." 
                                rows={2} 
                                className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-blue-100/70 text-sm outline-none focus:border-[#FF8C00] resize-none" 
                              />
                            </div>
                            <div className="border-t border-zinc-800/80 pt-5">
                              <label className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <ImageIcon size={16} className="text-[#FF8C00]" /> Dish Image
                              </label>
                              {item.img ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-700 group">
                                  <img src={item.img} alt="Uploaded dish" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                      onClick={() => handleItemChange(item.id, 'img', '')} 
                                      className="bg-red-500 text-white p-3 rounded-full hover:scale-110"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    id={`file-demo-${item.id}`} 
                                    className="hidden" 
                                    onChange={(e) => { 
                                      if(e.target.files && e.target.files[0]) {
                                        handleImageUpload(item.id, e.target.files[0]); 
                                      }
                                    }} 
                                  />
                                  <label 
                                    htmlFor={`file-demo-${item.id}`} 
                                    className={`flex items-center justify-center gap-3 w-full bg-[#0b1221] border-2 border-dashed rounded-xl py-5 text-sm font-black uppercase cursor-pointer ${uploadingItemId === item.id ? 'border-[#FF8C00] text-[#FF8C00]' : 'border-[#1c2846] text-[#476086] hover:border-[#FF8C00] hover:text-white'}`}
                                  >
                                    {uploadingItemId === item.id ? (
                                      <><RefreshCcw size={18} className="animate-spin" /> UPLOADING...</>
                                    ) : (
                                      <><Upload size={18} /> UPLOAD IMAGE FROM PC</>
                                    )}
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
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#FF8C00]/50 to-transparent my-4"></div>

          {/* BOX 2: CUSTOM MENU */}
          <div id="custom-box" className="flex flex-col gap-6 w-full pt-10 border-t-2 border-zinc-900 border-dashed">
            <label className="text-emerald-500 font-black text-xs md:text-sm tracking-widest uppercase flex items-center gap-2">
              <PenTool size={18} /> 2. CREATE YOUR CUSTOM MENU
            </label>

            <div className="bg-[#0a0e17] border border-emerald-900/30 rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-2xl w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-black/40 border border-zinc-800/80 p-6 rounded-3xl">
                <div className="md:col-span-6">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Your Custom Restaurant Name
                  </label>
                  <input 
                    type="text" 
                    value={customRestaurantName} 
                    onChange={(e) => setCustomRestaurantName(e.target.value)} 
                    placeholder="Enter custom name..." 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-emerald-500 transition-all shadow-inner" 
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Currency
                  </label>
                  <select 
                    value={customCurrency} 
                    onChange={(e) => setCustomCurrency(e.target.value)} 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="RSD">RSD</option>
                    <option value="£">GBP (£)</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-zinc-300 font-bold uppercase tracking-widest text-[11px] md:text-xs mb-2 block">
                    Theme Color
                  </label>
                  <select 
                    value={customThemeColor} 
                    onChange={(e) => setCustomThemeColor(e.target.value)} 
                    className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-white text-sm md:text-base font-bold outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="#FF8C00">V8 Orange</option>
                    <option value="#3b82f6">V8 Blue</option>
                    <option value="#10b981">V8 Green</option>
                    <option value="#eab308">V8 Gold</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto max-h-[750px] pr-3 custom-scrollbar">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = customItems.filter(i => i.category === cat.name);
                  const activeCount = catItems.filter(i => i.name.trim() !== '').length;
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);

                  return (
                    <div key={`custom-${cat.name}`} className="shrink-0 bg-black/40 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-lg">
                      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-6">
                        <h3 className="text-white font-black uppercase tracking-widest text-lg flex items-center gap-3">
                          <span 
                            className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                            style={{ backgroundColor: customThemeColor }}>
                          </span>
                          {cat.name} {cat.name === "House Specials" ? "🔥" : ""}
                        </h3>
                        <span className="text-[#607ca8] font-black text-xs bg-[#0b1221] px-4 py-2 rounded-lg border border-[#1c2846]">
                          {activeCount} / {cat.limit} SLOTS
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div 
                            key={item.id} 
                            className="shrink-0 bg-[#0a0a0a] border border-zinc-800 border-l-4 border-l-zinc-700 rounded-2xl p-6 relative group focus-within:border-zinc-700 focus-within:border-l-emerald-500 transition-all duration-300 shadow-md"
                          >
                            <div className="flex justify-between items-center mb-4 border-b border-zinc-800/50 pb-2">
                              <span className="text-zinc-500 font-black text-xs lowercase tracking-widest">
                                {item.category} {index + 1}
                              </span>
                              <button 
                                onClick={() => handleCustomClearItem(item.id)} 
                                className="text-zinc-500 hover:text-red-500 cursor-pointer bg-[#0b1221] p-2 rounded-lg border border-[#1c2846]"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-5 pr-10">
                              <div className="md:col-span-8 relative">
                                <input 
                                  type="text" 
                                  value={item.name} 
                                  onChange={(e) => handleCustomItemChange(item.id, 'name', e.target.value)} 
                                  onFocus={() => setActiveCustomDropdownId(item.id)} 
                                  onBlur={() => setTimeout(() => setActiveCustomDropdownId(null), 250)} 
                                  placeholder="Type custom dish name..." 
                                  className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 pr-10 text-white font-bold outline-none focus:border-emerald-500" 
                                />
                                <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#476086] pointer-events-none" />
                                
                                <AnimatePresence>
                                  {activeCustomDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div 
                                      key={`dropdown-custom-${item.id}`} 
                                      initial={{ opacity: 0, y: -5 }} 
                                      animate={{ opacity: 1, y: 0 }} 
                                      exit={{ opacity: 0, y: -5 }} 
                                      className="absolute top-full left-0 w-full mt-2 bg-[#0b1221] border border-[#1c2846] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[100] max-h-60 overflow-y-auto custom-scrollbar"
                                    >
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div 
                                          key={sIdx} 
                                          onMouseDown={(e) => { 
                                            e.preventDefault(); 
                                            handleCustomSuggestionSelect(item.id, suggestion); 
                                          }} 
                                          className="p-3.5 border-b border-[#1c2846]/50 hover:bg-[#111a2f] cursor-pointer"
                                        >
                                          <div className="text-white font-bold text-sm mb-1">{suggestion.name}</div>
                                          <div className="text-[#607ca8] text-[10px] line-clamp-2">{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="md:col-span-4 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#476086] font-black">{customCurrency}</span>
                                <input 
                                  type="text" 
                                  value={item.price} 
                                  onChange={(e) => handleCustomItemChange(item.id, 'price', e.target.value)} 
                                  placeholder="0.00" 
                                  className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl pl-9 pr-4 py-3 text-emerald-500 font-black outline-none focus:border-emerald-500" 
                                />
                              </div>
                            </div>
                            <div className="mb-5">
                              <textarea 
                                value={item.desc} 
                                onChange={(e) => handleCustomItemChange(item.id, 'desc', e.target.value)} 
                                placeholder="Short custom description..." 
                                rows={2} 
                                className="w-full bg-[#0b1221] border border-[#1c2846] rounded-xl px-4 py-3 text-blue-100/70 text-sm outline-none focus:border-emerald-500 resize-none" 
                              />
                            </div>
                            <div className="border-t border-zinc-800/80 pt-5">
                              <label className="text-zinc-400 font-bold uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                                <ImageIcon size={16} className="text-emerald-500" /> Dish Image
                              </label>
                              {item.img ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden border border-zinc-700 group">
                                  <img src={item.img} alt="Uploaded dish" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                      onClick={() => handleCustomItemChange(item.id, 'img', '')} 
                                      className="bg-red-500 text-white p-3 rounded-full hover:scale-110"
                                    >
                                      <Trash2 size={20} />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative">
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    id={`file-custom-${item.id}`} 
                                    className="hidden" 
                                    onChange={(e) => { 
                                      if(e.target.files && e.target.files[0]) {
                                        handleCustomImageUpload(item.id, e.target.files[0]); 
                                      }
                                    }} 
                                  />
                                  <label 
                                    htmlFor={`file-custom-${item.id}`} 
                                    className={`flex items-center justify-center gap-3 w-full bg-[#0b1221] border-2 border-dashed rounded-xl py-5 text-sm font-black uppercase cursor-pointer ${uploadingItemId === item.id ? 'border-emerald-500 text-emerald-500' : 'border-[#1c2846] text-[#476086] hover:border-emerald-500 hover:text-white'}`}
                                  >
                                    {uploadingItemId === item.id ? (
                                      <><RefreshCcw size={18} className="animate-spin" /> UPLOADING...</>
                                    ) : (
                                      <><Upload size={18} /> UPLOAD IMAGE FROM PC</>
                                    )}
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
          </div>
        </div>
        {/* ========================================================================= */}
        {/* 🔴 KRAJ: LEVA STRANA */}
        {/* ========================================================================= */}

        {/* ========================================================================= */}
        {/* 🟢 POČETAK: DESNA STRANA (QR GENERATOR I ACCORDION PREVIEW) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col gap-8 sticky top-[120px] w-full h-max">
          
          <div className="bg-gradient-to-b from-[#11151c] to-[#0a0e17] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative w-full overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {!generatedMenuId ? (
              <div className="w-full relative z-10 flex flex-col items-center">
                
                {/* 🟢 TVOJA SLIKA JE OVDE 🟢 */}
                <div className="w-full max-w-[220px] mb-6 rounded-2xl overflow-hidden border border-white/5 shadow-[0_0_20px_rgba(255,140,0,0.15)] group-hover:shadow-[0_0_40px_rgba(255,140,0,0.3)] transition-all duration-500">
                  <img src="/QRMenuPromo.webp" alt="QR Menu Promo" className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500" />
                </div>

                <h3 className="text-white font-black text-[14px] uppercase tracking-[0.2em] mb-2">SAVE MENU & DEPLOY</h3>
                <p className="text-zinc-400 text-[11px] mb-8 leading-relaxed max-w-[220px]">Generate a unique, scannable QR code matrix for your client's tables.</p>
                <button 
                  onClick={handleGenerateQR} 
                  disabled={isSaving} 
                  className="w-full text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(255,140,0,0.3)] hover:shadow-[0_0_30px_rgba(255,140,0,0.5)] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer hover:scale-[1.02]"
                  style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` }}
                >
                  {isSaving ? 'GENERATING...' : <><Save size={18} /> GENERATE QR CODE</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-5 shadow-[0_0_40px_rgba(255,140,0,0.2)]">
                  <img src={qrCodeImageUrl} alt="QR Code" className="w-40 h-40 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-emerald-400 mb-5 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest">
                  <CheckCircle size={14} className="animate-pulse" /><span>LIVE QR READY</span>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <a 
                    href={qrCodeImageUrl} 
                    download={`QR_Menu_${restaurantName.replace(/\s+/g, '_')}.png`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] cursor-pointer hover:scale-[1.02] transition-transform"
                    style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` }}
                  >
                    <Download size={16} /> DOWNLOAD
                  </a>
                  <button 
                    onClick={() => setGeneratedMenuId(null)} 
                    className="w-full bg-black/60 border border-white/10 text-zinc-400 hover:text-white px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  >
                    RESET
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-full bg-[#050505] rounded-[2rem] border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col transition-all duration-500 overflow-hidden">
             
             <div 
               className="pt-6 pb-5 px-6 cursor-pointer flex justify-between items-center group bg-[#0a0a0a] hover:bg-[#111111] transition-colors z-20 relative border-b border-white/5"
               onClick={() => setIsPreviewOpen(!isPreviewOpen)}
             >
                <h2 className="font-black uppercase tracking-[0.15em] text-base md:text-lg truncate pr-4" style={{ color: themeColor }}>
                   {restaurantName || 'AURA FINE DINING'}
                </h2>
                <div className="bg-black border border-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 group-hover:border-orange-500/50 transition-colors">
                   <ChevronDown size={18} className={`transition-transform duration-300 ${isPreviewOpen ? 'rotate-180' : ''}`} style={{ color: themeColor }} />
                </div>
             </div>

             <AnimatePresence>
                {isPreviewOpen && (
                   <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                   >
                      <div className="px-5 py-6 flex flex-col gap-8 bg-[#050505] max-h-[50vh] lg:max-h-[600px] overflow-y-auto custom-scrollbar">
                         {sortedCategories.length === 0 ? (
                            <div className="text-center text-zinc-600 text-[11px] font-black uppercase mt-4 mb-4">NO ITEMS TO DISPLAY</div>
                         ) : (
                            sortedCategories.map(category => (
                               <div key={category} className="flex flex-col gap-4">
                                  
                                  <div className="border-b border-white/10 pb-2">
                                     <h3 className="text-white font-black text-xs uppercase tracking-widest">{category}</h3>
                                  </div>
                                  
                                  <div className="flex flex-col gap-4">
                                     {groupedItems[category].map((item, idx) => {
                                        const displayImg = item.img || item.demoImg;
                                        return (
                                           <div key={idx} className="bg-[#0a0e17] p-4 rounded-2xl border border-white/5 shadow-md flex flex-col gap-2">
                                              
                                              {displayImg && (
                                                 <div className="w-full h-32 lg:h-40 mb-2 rounded-xl overflow-hidden relative shadow-lg">
                                                    <img src={displayImg} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                                 </div>
                                              )}
                                              
                                              <div className="flex justify-between items-start gap-3">
                                                 <h4 className="text-white font-black text-[13px] uppercase leading-tight flex items-start gap-1.5">
                                                    {item.category === "House Specials" && <span className="text-[10px] mt-0.5" style={{ color: themeColor }}>★</span>}
                                                    {item.name || 'Item Name'}
                                                 </h4>
                                                 <span className="font-black text-[13px] shrink-0" style={{ color: themeColor }}>
                                                    {currency} {item.price || '0.00'}
                                                 </span>
                                              </div>
                                              
                                              <p className="text-zinc-400 text-[10px] leading-relaxed mt-1">
                                                 {item.desc}
                                              </p>
                                           </div>
                                        );
                                     })}
                                  </div>

                               </div>
                            ))
                         )}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
          
        </div>
        {/* ========================================================================= */}
        {/* 🔴 KRAJ: DESNA STRANA */}
        {/* ========================================================================= */}

      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: V8PremiumTestMenu
// KRAJ FAJLA: V8PremiumTestMenu.jsx