// POČETAK FAJLA: V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from './v8Utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// 🔥 DODATA JE IKONICA Code U IMPORT 🔥
import { QrCode, Plus, Trash2, Save, Download, Utensils, Coffee, CheckCircle, Store, Palette, Coins, Star, Crown, Sparkles, Image as ImageIcon, Zap, ShieldCheck, Code } from 'lucide-react';

export default function V8PremiumTestMenu() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 DEMO PODACI SPREMNI ZA REKLAMU I PREZENTACIJU KLIJENTU 🔥
  const [restaurantName, setRestaurantName] = useState('AURA Fine Dining');
  const [currency, setCurrency] = useState('€');
  const [themeColor, setThemeColor] = useState('#FF8C00'); // Neon narandžasti V8 akcenat

  const [items, setItems] = useState([
    { 
      id: 1, 
      category: 'House Special', 
      name: 'Wagyu A5 Tomahawk', 
      desc: 'Pure Japanese Wagyu beef, 24k gold leaf flakes, black truffle mash, charred asparagus.', 
      price: '140.00' 
    },
    { 
      id: 2, 
      category: 'Food', 
      name: 'Beluga Caviar Risotto', 
      desc: 'Creamy arborio rice, wild mushrooms, topped with 15g of premium Beluga caviar.', 
      price: '85.00' 
    },
    { 
      id: 3, 
      category: 'Drinks', 
      name: 'Truffle Old Fashioned', 
      desc: 'Aged bourbon, black truffle honey, angostura bitters, served in a smoked oak glass.', 
      price: '24.00' 
    },
    { 
      id: 4, 
      category: 'Drinks', 
      name: 'Casa Dragones Blanco', 
      desc: 'Ultra-premium sipping tequila, crisp and smooth with hints of citrus and spice.', 
      price: '35.00' 
    },
    { 
      id: 5, 
      category: 'Desserts', 
      name: 'Dark Chocolate Sphere', 
      desc: 'Valrhona chocolate, raspberry coulis center, edible gold, vanilla bean ice cream.', 
      price: '22.00' 
    }
  ]);
  
  const [isSaving, setIsSaving] = useState(false);
  const [generatedMenuId, setGeneratedMenuId] = useState(null);

  // LOGIKA ZA DODAVANJE I BRISANJE STAVKI
  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), category: 'Food', name: '', desc: '', price: '' }]);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // ČUVANJE U BAZU I GENERISANJE QR KODA
  const handleGenerateQR = async () => {
    if (!restaurantName.trim() || items.length === 0) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Enter a restaurant name and at least one item!");
      return;
    }

    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, 'v8_qr_menus'), {
        restaurantName,
        currency,
        themeColor,
        items,
        createdAt: serverTimestamp(),
        status: 'active'
      });
      
      setGeneratedMenuId(docRef.id);
      if(typeof v8Toast !== 'undefined') v8Toast.success("Menu generated successfully! QR code is ready.");
    } catch (error) {
      console.error(error);
      if(typeof v8Toast !== 'undefined') v8Toast.error("Error saving menu to the database.");
    } finally {
      setIsSaving(false);
    }
  };

  const publicMenuUrl = `https://aitoolsprosmart.com/m/${generatedMenuId}`;
  
  const qrCodeImageUrl = generatedMenuId 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(publicMenuUrl)}&color=000000&bgcolor=ffffff` 
    : null;

  return (
    <div className="min-h-screen bg-[#050505] p-6 md:p-12 rounded-[2.5rem] border border-[#FF8C00]/30 shadow-[0_0_50px_rgba(255,140,0,0.1)] max-w-7xl mx-auto mt-28 relative font-sans selection:bg-[#FF8C00] selection:text-white z-10">
      
      {/* V8 Premium Header - Boja prilagođena izlogu */}
      <header className="p-6 border border-[#FF8C00]/20 bg-[#0f172a]/60 backdrop-blur-xl z-40 shadow-2xl rounded-2xl mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
            <Code className="text-[#FF8C00] w-8 h-8 drop-shadow-[0_0_15px_rgba(255,140,0,0.8)]" />
            QR <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF8C00] to-amber-600 drop-shadow-none">MENU BUILDER</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-xs md:text-sm tracking-widest uppercase font-bold">
            B2B SaaS Generator for Restaurants & Clubs (Live Demo)
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#FF8C00]/10 border border-[#FF8C00]/30 px-4 py-2 rounded-xl text-[#FF8C00]">
          <QrCode size={20} />
          <span className="font-black text-xs uppercase tracking-widest">SaaS Module</span>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEVA STRANA: FORMA ZA UNOS MENIJA */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col h-full">
            
            {/* RESTAURANT SETTINGS */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-4 mb-6">
              <Store size={18} className="text-[#FF8C00]" /> 
              <h2 className="text-lg font-black uppercase tracking-widest text-zinc-200">Restaurant Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
              <div className="md:col-span-6">
                <label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  Restaurant / Club Name
                </label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g., Casa Dragones Lounge"
                  className="w-full bg-black/50 border border-white/10 focus:border-[#FF8C00] text-white text-lg font-black px-4 py-3 rounded-xl outline-none transition-all"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <Coins size={12} /> Currency
                </label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-[#FF8C00] text-white text-lg font-black px-4 py-3 rounded-xl outline-none transition-all cursor-pointer"
                >
                  <option value="€">EUR (€)</option>
                  <option value="$">USD ($)</option>
                  <option value="RSD">RSD</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-zinc-400 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <Palette size={12} /> Theme Color
                </label>
                <select 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 focus:border-[#FF8C00] text-white text-sm font-bold px-4 py-3.5 rounded-xl outline-none transition-all cursor-pointer"
                >
                  <option value="#FF8C00">V8 Narandžasta</option>
                  <option value="#3b82f6">V8 Plava</option>
                  <option value="#10b981">V8 Zelena</option>
                  <option value="#eab308">V8 Zlatna</option>
                </select>
              </div>
            </div>

            {/* STAVKE MENIJA */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
              <h2 className="text-lg font-black uppercase tracking-widest text-zinc-200 flex items-center gap-2">
                <Utensils size={18} className="text-[#FF8C00]" /> Menu Items
              </h2>
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-black/40 hover:bg-[#FF8C00]/10 border border-white/10 hover:border-[#FF8C00]/50 text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-md"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-black/40 border border-white/5 rounded-2xl p-5 relative group transition-colors focus-within:border-[#FF8C00]/40 shadow-inner"
                  >
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                      <div>
                        <label className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mb-1.5 block">Category</label>
                        <select 
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#FF8C00]"
                        >
                          <option value="Drinks">🍹 Drinks</option>
                          <option value="Food">🍔 Food</option>
                          <option value="Desserts">🍰 Desserts</option>
                          <option value="House Special">🔥 House Special</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mb-1.5 block">Item Name</label>
                        <input 
                          type="text" 
                          value={item.name}
                          onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                          placeholder="e.g., Premium Burger"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#FF8C00]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div className="md:col-span-9">
                        <label className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mb-1.5 block">Short Description</label>
                        <textarea 
                          value={item.desc}
                          onChange={(e) => handleItemChange(item.id, 'desc', e.target.value)}
                          placeholder="Ingredients, preparation method..."
                          rows={2}
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none focus:border-[#FF8C00] resize-none"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mb-1.5 block">Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-black">{currency}</span>
                          <input 
                            type="text" 
                            value={item.price}
                            onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                            placeholder="e.g., 25.00"
                            className="w-full bg-black/60 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-[#FF8C00] font-black text-sm outline-none focus:border-[#FF8C00]"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* DESNA STRANA: PREVIEW STRANICA */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-[120px]">
          
          {/* AKCIJSKI PANEL */}
          <div 
            className="bg-[#0f172a]/60 backdrop-blur-md border rounded-[2rem] p-6 shadow-[0_0_50px_rgba(255,140,0,0.15)] relative overflow-hidden min-h-[280px] flex flex-col justify-center transition-all duration-500"
            style={{ borderColor: `${themeColor}40` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C00]/5 to-transparent pointer-events-none z-0"></div>

            {!generatedMenuId ? (
              <div className="flex flex-col items-center text-center relative z-10">
                <div 
                  className="p-4 rounded-full bg-black/80 border shadow-[0_0_20px_rgba(255,140,0,0.3)] mb-4"
                  style={{ borderColor: `${themeColor}40` }}
                >
                  <Crown size={28} style={{ color: themeColor }} className="drop-shadow-[0_0_10px_rgba(255,140,0,0.6)]" />
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] mb-1">Save Menu For Client</h3>
                <p className="text-zinc-400 text-[11px] mb-5 max-w-[260px] leading-relaxed font-medium">Once saved, you will receive a unique QR code ready for table printing.</p>
                
                <button 
                  onClick={handleGenerateQR}
                  disabled={isSaving}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(234,88,12,0.4)] transition-all flex items-center justify-center gap-3 text-xs border border-orange-400/30 cursor-pointer hover:scale-[1.02]"
                >
                  {isSaving ? 'Generating database...' : <><Save size={16} /> GENERATE QR CODE</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center relative z-10">
                <div className="bg-white p-4 rounded-2xl mb-4 shadow-[0_0_40px_rgba(255,140,0,0.3)] border border-zinc-200">
                  <img src={qrCodeImageUrl} alt="QR Code" className="w-44 h-44 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-emerald-400 mb-2 bg-emerald-950/40 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest">
                  <CheckCircle size={14} className="animate-pulse" />
                  <span>V8 LIVE MODULE READY</span>
                </div>
                <p className="text-zinc-400 text-[10px] mb-6 font-mono break-all px-4 bg-black/40 py-2 rounded-xl border border-white/5 w-full">{publicMenuUrl}</p>
                
                <a 
                  href={qrCodeImageUrl} 
                  download={`QR_Menu_${restaurantName.replace(/\s+/g, '_')}.png`}
                  target="_blank" rel="noreferrer"
                  className="w-full text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-3 text-[11px]"
                  style={{ backgroundColor: themeColor, shadow: `0 0 20px ${themeColor}40` }}
                >
                  <Download size={16} /> DOWNLOAD QR FOR PRINT
                </a>

                <button 
                  onClick={() => setGeneratedMenuId(null)}
                  className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.15em] underline transition-colors cursor-pointer"
                >
                  ← Back to editing
                </button>
              </motion.div>
            )}
          </div>

          {/* TELEFON PREVIEW */}
          <div className="bg-[#050505] border-[14px] border-[#0f172a] rounded-[2.75rem] overflow-hidden aspect-[9/19] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.9),_0_0_30px_rgba(255,140,0,0.05)] relative flex flex-col max-h-[580px] mx-auto w-full max-w-[310px] ring-2 ring-white/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0f172a] rounded-b-2xl z-50"></div>
            
            <div className="bg-black/90 flex-1 overflow-y-auto custom-scrollbar pt-10 pb-6 px-4 relative">
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[60px] opacity-20 pointer-events-none transform-gpu" 
                style={{ backgroundColor: themeColor }}
              ></div>

              <h2 
                className="text-center font-black uppercase tracking-[0.15em] text-base mb-6 border-b border-white/5 pb-4 transition-colors relative z-10"
                style={{ color: themeColor }}
              >
                {restaurantName || 'Your Restaurant'}
              </h2>

              <div className="flex flex-col gap-4 relative z-10">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-[#0f172a]/40 backdrop-blur-sm p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-1.5 gap-2">
                      <h4 className="text-white font-bold text-xs uppercase leading-tight truncate mr-1">
                        {item.category === 'House Special' && <Star size={12} style={{ color: themeColor }} fill={themeColor} />}
                        {item.name || 'Item Name'}
                      </h4>
                      <span className="font-black text-xs shrink-0 tracking-wider" style={{ color: themeColor }}>
                        {currency} {item.price ? `${item.price}` : '0.00'}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-[8px] uppercase tracking-widest font-black mb-1.5 block">{item.category}</span>
                    <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2 font-medium">{item.desc || 'Item description will appear here...'}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-[#0f172a]/80 backdrop-blur-md border-t border-white/5 p-3 flex justify-around relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
              <Utensils size={16} style={{ color: themeColor }} className="drop-shadow-[0_0_5px_rgba(255,140,0,0.5)]" />
              <Coffee size={16} className="text-zinc-500" />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
// KRAJ FAJLA: V8PremiumTestMenu.jsx