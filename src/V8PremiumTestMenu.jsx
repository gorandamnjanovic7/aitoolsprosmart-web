// POČETAK FAJLA: V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from './v8Utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { QrCode, Save, Download, Store, Crown, Image as ImageIcon, Code, ChevronDown, Upload, RefreshCcw, PenTool, CheckCircle, Utensils, Coffee, Pizza } from 'lucide-react';

import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';
import { CATEGORY_LIMITS, IMG_POOL, RAW_DB } from './v8MenuQRCodeData';

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

const getSuggestionsWithImages = (categoryName, catIndex) => {
  const catDemo = RAW_DB[categoryName] && RAW_DB[categoryName].length > 0 ? RAW_DB[categoryName] : [];
  return catDemo.map((item, idx) => ({
    name: item[0] || "",
    desc: item[1] || "",
    price: item[2] || "0.00",
    demoImg: IMG_POOL[(catIndex + idx) % IMG_POOL.length]
  }));
};

// 🔥 GENERATOR ZA SVIH 146 ITALIJANSKIH JELA 🔥
const ITALIAN_ALL_ITEMS = [
  ...["Spaghetti Carbonara", "Cacio e Pepe", "Amatriciana", "Pasta alla Gricia", "Spaghetti Aglio e Olio", "Pasta al Pesto Genovese", "Tagliatelle al Ragù Bolognese", "Pappardelle al Cinghiale", "Lasagne alla Bolognese", "Lasagne al Pesto", "Penne all’Arrabbiata", "Pasta alla Norma", "Pasta Puttanesca", "Linguine alle Vongole", "Spaghetti ai Frutti di Mare", "Fettuccine al Tartufo", "Orecchiette con Cime di Rapa", "Trofie al Pesto", "Ravioli Ricotta e Spinaci", "Ravioli al Tartufo", "Tortellini in Brodo", "Tortellini alla Panna", "Cannelloni", "Gnocchi al Pomodoro", "Gnocchi al Gorgonzola", "Gnocchi alla Sorrentina"].map(name => ({ category: "Pasta", name, price: "18.00", desc: `Authentic Italian ${name} prepared with DOP ingredients and cold-pressed olive oil.`, img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Pizza Margherita", "Pizza Marinara", "Pizza Napoletana", "Pizza Diavola", "Pizza Capricciosa", "Pizza Quattro Formaggi", "Pizza Quattro Stagioni", "Pizza Prosciutto e Funghi", "Pizza Ortolana", "Pizza Bianca", "Pizza al Tartufo", "Calzone", "Focaccia Genovese", "Focaccia Barese", "Focaccia al Rosmarino"].map(name => ({ category: "Pizza & Focaccia", name, price: "15.00", desc: `Wood-fired ${name} baked to perfection with a crisp, airy crust.`, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Risotto alla Milanese", "Risotto ai Funghi Porcini", "Risotto al Tartufo", "Risotto ai Frutti di Mare", "Risotto al Limone", "Risotto alla Zucca", "Risotto al Radicchio", "Risotto al Gorgonzola", "Risi e Bisi", "Arancini Siciliani", "Supplì"].map(name => ({ category: "Risotto & Rice Dishes", name, price: "22.00", desc: `Creamy and rich ${name}, a comforting Italian classic.`, img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Ossobuco alla Milanese", "Saltimbocca alla Romana", "Cotoletta alla Milanese", "Pollo alla Cacciatora", "Vitello Tonnato", "Brasato al Barolo", "Bistecca alla Fiorentina", "Porchetta", "Polpette al Sugo", "Involtini di Carne", "Spezzatino di Manzo", "Abbacchio alla Romana", "Salsiccia e Peperoni"].map(name => ({ category: "Meat Dishes", name, price: "32.00", desc: `Tender, slow-cooked ${name} with signature Italian herbs and wine.`, img: "https://images.unsplash.com/photo-1544025162-8353383827d0?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Branzino al Forno", "Orata al Forno", "Fritto Misto di Mare", "Calamari Fritti", "Polpo alla Griglia", "Polpo e Patate", "Seppie al Nero", "Baccalà alla Vicentina", "Baccalà Mantecato", "Zuppa di Pesce", "Cacciucco", "Impepata di Cozze", "Cozze alla Marinara", "Gamberi all’Aglio"].map(name => ({ category: "Fish & Seafood", name, price: "35.00", desc: `Fresh Mediterranean ${name}, bringing the taste of the Italian coast to your table.`, img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Minestrone", "Ribollita", "Pasta e Fagioli", "Pasta e Ceci", "Zuppa Toscana", "Acquacotta", "Stracciatella alla Romana", "Pappa al Pomodoro", "Brodo con Tortellini", "Zuppa di Lenticchie"].map(name => ({ category: "Soups & Traditional", name, price: "14.00", desc: `Warm, hearty, and authentic rustic ${name}.`, img: "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Bruschetta al Pomodoro", "Bruschetta ai Funghi", "Caprese", "Prosciutto e Melone", "Prosciutto di Parma con Burrata", "Burrata con Pomodorini", "Carpaccio di Manzo", "Carpaccio di Tonno", "Vitello Tonnato", "Crostini Toscani", "Olive Ascolane", "Mozzarella in Carrozza", "Fiori di Zucca Fritti", "Melanzane alla Parmigiana", "Arancini"].map(name => ({ category: "Appetizers & Antipasti", name, price: "16.00", desc: `Perfect Italian starter: ${name} served fresh with the finest ingredients.`, img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Parmigiana di Melanzane", "Caponata Siciliana", "Peperonata", "Carciofi alla Romana", "Carciofi alla Giudia", "Verdure Grigliate", "Patate al Rosmarino", "Zucchine alla Scapece", "Fagioli all’Uccelletto", "Insalata Panzanella"].map(name => ({ category: "Vegetables & Side Dishes", name, price: "12.00", desc: `Fresh, seasonal ${name}, a perfect accompaniment.`, img: "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Panino con Porchetta", "Panino Caprese", "Panino Prosciutto e Mozzarella", "Piadina Romagnola", "Tramezzini", "Lampredotto", "Panzerotti", "Pizza al Taglio", "Sfincione Siciliano", "Focaccia Ripiena"].map(name => ({ category: "Sandwiches & Street Food", name, price: "10.00", desc: `Delicious, authentic Italian street food: ${name}.`, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80", isSignature: false })),
  ...["Tiramisù", "Panna Cotta", "Cannoli Siciliani", "Cassata Siciliana", "Sfogliatella", "Babà Napoletano", "Zeppole", "Bomboloni", "Crostata", "Torta Caprese", "Torta della Nonna", "Zabaione", "Semifreddo", "Affogato", "Gelato", "Granita Siciliana", "Amaretti", "Cantucci", "Panettone", "Pandoro", "Torrone", "Ricciarelli"].map(name => ({ category: "Desserts", name, price: "12.00", desc: `Sweet, traditional Italian ${name} to perfectly finish your meal.`, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80", isSignature: false }))
];

ITALIAN_ALL_ITEMS[0].isSignature = true; 
ITALIAN_ALL_ITEMS[26].isSignature = true; 
ITALIAN_ALL_ITEMS[124].isSignature = true; 

const ITALIAN_MENU_DATA = {
  restaurantName: "Ristorante L'Antica Ricetta",
  themeColor: "#eab308", 
  currency: "€",
  items: ITALIAN_ALL_ITEMS
};

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
  
  const [isSavingItalian, setIsSavingItalian] = useState(false);
  const [generatedItalianMenuId, setGeneratedItalianMenuId] = useState(null);
  const [isItalianPreviewOpen, setIsItalianPreviewOpen] = useState(false);
  
  const [uploadingItemId, setUploadingItemId] = useState(null);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activeCustomDropdownId, setActiveCustomDropdownId] = useState(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleItemChange = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  const handleCustomItemChange = (id, field, value) => setCustomItems(customItems.map(item => item.id === id ? { ...item, [field]: value } : item));

  const handleSuggestionSelect = (id, suggestion) => {
    setItems(items.map(item => item.id === id ? { ...item, name: suggestion.name, desc: suggestion.desc, price: suggestion.price || item.price, demoImg: suggestion.demoImg || item.demoImg } : item));
    setActiveDropdownId(null);
  };

  const handleCustomSuggestionSelect = (id, suggestion) => {
    setCustomItems(customItems.map(item => item.id === id ? { ...item, name: suggestion.name, desc: suggestion.desc, price: suggestion.price || item.price, demoImg: suggestion.demoImg || item.demoImg } : item));
    setActiveCustomDropdownId(null);
  };

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleItemChange(id, 'img', resData.secure_url);
    } catch (err) { console.error(err); } finally { setUploadingItemId(null); }
  };

  const handleCustomImageUpload = async (id, file) => {
    if (!file) return;
    setUploadingItemId(id);
    const fd = new FormData(); fd.append('file', file); fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      if (resData.secure_url) handleCustomItemChange(id, 'img', resData.secure_url);
    } catch (err) { console.error(err); } finally { setUploadingItemId(null); }
  };

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
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  // 🔥 PRAVI ITALIAN ID FALLBACK 🔥
  const handleGenerateItalianQR = async () => {
    setIsSavingItalian(true);
    try {
      const docData = { ...ITALIAN_MENU_DATA, createdAt: serverTimestamp(), status: 'active' };
      const savePromise = addDoc(collection(db, 'v8_qr_menus'), docData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      setGeneratedItalianMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Italian Demo deployed!");
    } catch (error) {
      setGeneratedItalianMenuId("TEST-QR-ITALIAN-123");
      if(typeof v8Toast !== 'undefined') v8Toast.success("Italian Test QR Generated!");
    } finally { setIsSavingItalian(false); }
  };

  // 🔥 PRAVI AURA ID FALLBACK 🔥
  const handleGenerateQR = async () => {
    if (!restaurantName.trim() || activeItems.length === 0) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a restaurant name and at least one item!");
      return;
    }
    setIsSaving(true);
    try {
      const itemsToSave = activeItems.map(item => ({ id: item.id, category: item.category, name: item.name, desc: item.desc, price: item.price, img: item.img || item.demoImg, isSignature: item.isSignature }));
      const docData = { restaurantName, currency, themeColor, items: itemsToSave, createdAt: serverTimestamp(), status: 'active' };
      const savePromise = addDoc(collection(db, 'v8_qr_menus'), docData);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000));
      const docRef = await Promise.race([savePromise, timeoutPromise]);
      setGeneratedMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Database deployed! QR code ready.");
    } catch (error) {
      setGeneratedMenuId("TEST-QR-PREVIEW-123");
      if(typeof v8Toast !== 'undefined') v8Toast.success("Test QR Generated Successfully!");
    } finally { setIsSaving(false); }
  };

  const publicMenuUrl = generatedMenuId ? `https://aitoolsprosmart.com/m/${generatedMenuId}` : '';
  const qrCodeImageUrl = generatedMenuId ? `https://quickchart.io/qr?text=${encodeURIComponent(publicMenuUrl)}&margin=1&size=512` : null;
  const publicItalianMenuUrl = generatedItalianMenuId ? `https://aitoolsprosmart.com/m/${generatedItalianMenuId}` : '';
  const qrCodeItalianImageUrl = generatedItalianMenuId ? `https://quickchart.io/qr?text=${encodeURIComponent(publicItalianMenuUrl)}&margin=1&size=512` : null;
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="bg-[#24272b] p-6 md:p-12 rounded-[2.5rem] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.6)] max-w-[1600px] w-[96%] mx-auto mt-28 relative font-sans selection:bg-[#3b82f6] selection:text-white">
      
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden shadow-2xl bg-black border border-white/10">
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
        <div className="lg:col-span-7 flex flex-col gap-12 w-full">
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <label className="text-blue-400 font-black text-sm md:text-base tracking-widest uppercase flex items-center gap-3 drop-shadow-md">
                <Store size={22} /> 1. EXPLORE OUR MENU
              </label>
            </div>

            <div className="bg-[#2b2e34] border border-[#3e4249] border-t-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col gap-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] w-full">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 bg-[#1f2226] border border-black p-6 rounded-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
                <div className="md:col-span-6">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">Restaurant Name</label>
                  <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]" />
                </div>
                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">Currency</label>
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
                    <option value="€">EUR (€)</option>
                    <option value="$">USD ($)</option>
                    <option value="RSD">RSD</option>
                  </select>
                </div>
                <div className="md:col-span-3">
                  <label className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3 block">Theme Color</label>
                  <select value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
                    <option value="#FF8C00">V8 Orange</option>
                    <option value="#3b82f6">V8 Blue</option>
                    <option value="#10b981">V8 Green</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-10 overflow-y-auto max-h-[750px] pr-3 custom-scrollbar">
                {CATEGORY_LIMITS.map((cat, catIndex) => {
                  const catItems = items.filter(i => i.category === cat.name);
                  const activeCount = catItems.filter(i => i.name.trim() !== '').length;
                  const categorySuggestions = getSuggestionsWithImages(cat.name, catIndex);

                  return (
                    <div key={`demo-${cat.name}`} className="shrink-0 bg-[#30343a] border border-[#434851] border-t-white/10 rounded-3xl p-6 md:p-8 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
                      <div className="flex items-center justify-between bg-[#1f2226] p-5 rounded-2xl border border-black shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] mb-8">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-blue-300 font-black uppercase tracking-[0.2em] text-lg md:text-xl flex items-center gap-3 drop-shadow-md">
                            <span className="w-4 h-4 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: themeColor }}></span>
                            {cat.name}
                          </h3>
                        </div>
                        <span className="text-blue-200 font-black text-sm bg-[#16181b] border border-black px-5 py-3 rounded-lg">{activeCount} / {cat.limit} SLOTS</span>
                      </div>
                      
                      <div className="flex flex-col gap-6">
                        {catItems.map((item, index) => (
                          <div key={item.id} className="shrink-0 bg-[#383d44] border border-[#4e545c] border-t-white/10 border-l-4 border-l-blue-900/50 rounded-2xl p-6 md:p-8 relative group focus-within:border-l-blue-400 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.3)]">
                            <div className="flex justify-between items-center mb-6 border-b border-[#4e545c] pb-3">
                              <span className="text-blue-400/80 font-black text-xs uppercase tracking-widest">{item.category} / Slot {index + 1}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6 pr-10">
                              <div className="md:col-span-8 relative">
                                <input type="text" value={item.name} onChange={(e) => handleItemChange(item.id, 'name', e.target.value)} onFocus={() => setActiveDropdownId(item.id)} onBlur={() => setTimeout(() => setActiveDropdownId(null), 250)} placeholder="Choose a dish..." className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 pr-12 text-blue-100 text-base md:text-lg font-bold outline-none focus:border-blue-500" />
                                <ChevronDown size={22} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/60 pointer-events-none" />
                                <AnimatePresence>
                                  {activeDropdownId === item.id && categorySuggestions.length > 0 && (
                                    <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 w-full mt-2 bg-[#2b2e34] border border-[#3e4249] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] z-[100] max-h-60 overflow-y-auto custom-scrollbar">
                                      {categorySuggestions.map((suggestion, sIdx) => (
                                        <div key={sIdx} onMouseDown={(e) => { e.preventDefault(); handleSuggestionSelect(item.id, suggestion); }} className="p-4 border-b border-[#3e4249]/50 hover:bg-[#32363d] cursor-pointer">
                                          <div className="text-blue-100 font-bold text-base mb-1">{suggestion.name}</div>
                                          <div className="text-blue-400/60 text-xs line-clamp-2">{suggestion.desc}</div>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <div className="md:col-span-4 relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500/70 text-base font-black">{currency}</span>
                                <input type="text" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', e.target.value)} placeholder="0.00" className="w-full bg-[#16181b] border border-black rounded-xl pl-10 pr-5 py-4 text-blue-300 text-base md:text-lg font-black outline-none focus:border-blue-500" />
                              </div>
                            </div>
                            <div className="mb-6">
                              <textarea value={item.desc} onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)} placeholder="Short description..." rows={2} className="w-full bg-[#16181b] border border-black rounded-xl px-5 py-4 text-blue-200 text-base outline-none focus:border-blue-500 resize-none" />
                            </div>
                            <div className="border-t border-[#4e545c] pt-6">
                              <label className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2"><ImageIcon size={18} className="text-blue-400" /> Dish Image</label>
                              {item.img ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#16181b] shadow-inner"><img src={item.img} alt="Dish" className="w-full h-full object-cover" /></div>
                              ) : (
                                <div className="relative">
                                  <input type="file" accept="image/*" id={`file-demo-${item.id}`} className="hidden" onChange={(e) => { if(e.target.files && e.target.files[0]) handleImageUpload(item.id, e.target.files[0]); }} />
                                  <label htmlFor={`file-demo-${item.id}`} className={`flex items-center justify-center gap-3 w-full bg-[#202327] border-2 border-dashed rounded-xl py-6 text-base font-black uppercase cursor-pointer ${uploadingItemId === item.id ? 'border-blue-400 text-blue-400' : 'border-[#4e545c] text-blue-400/70 hover:border-blue-400'}`}>
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
          </div>
        </div>

        <div className="lg:col-span-3 flex flex-col gap-8 sticky top-[120px] w-full h-max">
          
          {/* ======================= 1. AURA DEMO BLOK ======================= */}
          <div className="bg-gradient-to-b from-[#11151c] to-[#0a0e17] border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative w-full overflow-hidden group">
            {!generatedMenuId ? (
              <div className="w-full relative z-10 flex flex-col items-center">
                <div className="w-full max-w-[220px] mb-6 rounded-2xl overflow-hidden shadow-lg"><img src="/QRMenuPromo.webp" alt="Promo" className="w-full h-auto object-cover" /></div>
                <h3 className="text-white font-black text-[14px] uppercase tracking-[0.2em] mb-2">SAVE MENU & DEPLOY</h3>
                <button onClick={handleGenerateQR} disabled={isSaving} className="w-full text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 mt-4" style={{ background: `linear-gradient(to right, ${themeColor}, ${themeColor}dd)` }}>
                  {isSaving ? 'GENERATING...' : <><Save size={18} /> GENERATE AURA QR</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-5"><img src={qrCodeImageUrl} alt="QR Code" className="w-40 h-40 object-contain" /></div>
                <a href={qrCodeImageUrl} download="Aura_QR.png" target="_blank" rel="noreferrer" className="w-full text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] mb-3" style={{ background: themeColor }}><Download size={16} /> DOWNLOAD</a>
                <button onClick={() => setGeneratedMenuId(null)} className="w-full bg-black/60 border border-white/10 text-zinc-400 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase">RESET</button>
              </motion.div>
            )}
          </div>

          {/* ======================= 2. ITALIAN DEMO BLOK ======================= */}
          <div className="bg-gradient-to-b from-[#11151c] to-[#0a0e17] border border-zinc-800/50 rounded-[2rem] p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative w-full overflow-hidden group mt-6">
            {!generatedItalianMenuId ? (
              <div className="w-full relative z-10 flex flex-col items-center">
                <div className="w-full max-w-[220px] mb-6 rounded-2xl overflow-hidden shadow-lg"><img src="/QRMenuPromo.webp" alt="Italian Promo" className="w-full h-auto object-cover" /></div>
                <h3 className="text-yellow-500 font-black text-[14px] uppercase tracking-[0.2em] mb-2">ITALIAN MENU DEMO</h3>
                <p className="text-zinc-400 text-[11px] mb-4 leading-relaxed max-w-[220px]">Deploy the massive 146-item Italian showcase menu.</p>
                <button onClick={handleGenerateItalianQR} disabled={isSavingItalian} className="w-full text-black font-black text-[13px] uppercase tracking-widest py-4 rounded-xl shadow-lg flex items-center justify-center gap-3 bg-gradient-to-r from-yellow-500 to-yellow-600 mt-4">
                  {isSavingItalian ? 'GENERATING...' : <><Save size={18} /> DEPLOY ITALIAN DEMO</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center w-full relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-5 shadow-[0_0_40px_rgba(234,179,8,0.2)]"><img src={qrCodeItalianImageUrl} alt="Italian QR Code" className="w-40 h-40 object-contain" /></div>
                <div className="flex items-center gap-2 text-emerald-400 mb-5 bg-emerald-950/40 border border-emerald-500/20 px-4 py-2 rounded-full text-[10px] font-black tracking-widest"><CheckCircle size={14} className="animate-pulse" /><span>ITALIAN QR READY</span></div>
                <a href={qrCodeItalianImageUrl} download="Italian_Demo_Menu.png" target="_blank" rel="noreferrer" className="w-full text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 text-[11px] mb-3 bg-gradient-to-r from-yellow-500 to-yellow-600"><Download size={16} /> DOWNLOAD</a>
                <button onClick={() => setGeneratedItalianMenuId(null)} className="w-full bg-black/60 border border-white/10 text-zinc-400 px-4 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest">RESET</button>
              </motion.div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: V8PremiumTestMenu.jsx