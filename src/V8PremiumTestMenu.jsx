// POČETAK FAJLA: V8PremiumTestMenu.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v8Toast } from './v8Utils';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { QrCode, Plus, Trash2, Save, Download, Utensils, Coffee, CheckCircle, Store, Palette, Coins, Star } from 'lucide-react';

export default function V8PremiumTestMenu() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🔥 DEMO PODACI SPREMNI ZA REKLAMU I PREZENTACIJU KLIJENTU 🔥
  const [restaurantName, setRestaurantName] = useState('AURA Fine Dining');
  const [currency, setCurrency] = useState('€');
  const [themeColor, setThemeColor] = useState('#eab308'); // Zlatna boja za luksuz

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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-[#ff6b00] selection:text-white pb-12 pt-24 relative z-10">
      
      {/* V8 Premium Header */}
      <header className="p-6 border-b border-[#222222] bg-[#0a0a0a]/90 backdrop-blur-md z-40 shadow-xl max-w-[1600px] mx-auto rounded-2xl mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-[#ff6b00] block shadow-[0_0_15px_rgba(255,107,0,0.8)]"></span>
            QR MENU BUILDER
          </h1>
          <p className="text-zinc-400 mt-2 text-xs md:text-sm tracking-widest uppercase font-bold">
            B2B SaaS Generator for Restaurants & Clubs (Live Demo)
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-[#ff6b00]/10 border border-[#ff6b00]/30 px-4 py-2 rounded-xl text-[#ff6b00]">
          <QrCode size={20} />
          <span className="font-black text-xs uppercase tracking-widest">SaaS Module</span>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEVA STRANA: FORMA ZA UNOS MENIJA */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          
          <div className="bg-[#0a0a0a] border border-[#222] rounded-3xl p-6 md:p-8 shadow-2xl">
            
            {/* RESTAURANT SETTINGS */}
            <div className="flex items-center gap-2 border-b border-[#222] pb-4 mb-6">
              <Store size={18} className="text-[#ff6b00]" /> 
              <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300">Restaurant Settings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
              <div className="md:col-span-6">
                <label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  Restaurant / Club Name
                </label>
                <input 
                  type="text" 
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  placeholder="e.g., Casa Dragones Lounge"
                  className="w-full bg-[#111] border border-[#333] focus:border-[#ff6b00] text-white text-lg font-black px-4 py-3 rounded-xl outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <Coins size={12} /> Currency
                </label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] focus:border-[#ff6b00] text-white text-lg font-black px-4 py-3 rounded-xl outline-none transition-colors"
                >
                  <option value="€">EUR (€)</option>
                  <option value="$">USD ($)</option>
                  <option value="RSD">RSD</option>
                  <option value="£">GBP (£)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
                  <Palette size={12} /> Theme Color
                </label>
                <select 
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] focus:border-[#ff6b00] text-white text-sm font-bold px-4 py-3.5 rounded-xl outline-none transition-colors"
                >
                  <option value="#ff6b00">Orange</option>
                  <option value="#3b82f6">Blue</option>
                  <option value="#10b981">Emerald</option>
                  <option value="#a855f7">Purple</option>
                  <option value="#eab308">Gold</option>
                  <option value="#ef4444">Red</option>
                </select>
              </div>
            </div>

            {/* STAVKE MENIJA */}
            <div className="flex items-center justify-between border-b border-[#222] pb-4 mb-6">
              <h2 className="text-lg font-black uppercase tracking-widest text-zinc-300 flex items-center gap-2">
                <Utensils size={18} className="text-[#ff6b00]" /> Menu Items
              </h2>
              <button 
                onClick={handleAddItem}
                className="flex items-center gap-2 bg-[#111] hover:bg-[#ff6b00]/20 border border-[#333] hover:border-[#ff6b00] text-white px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    key={item.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#111] border border-[#222] rounded-2xl p-5 relative group transition-colors focus-within:border-[#ff6b00]/50 shadow-md"
                  >
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      className="absolute top-4 right-4 text-zinc-600 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                      <div>
                        <label className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] mb-1.5 block">Category</label>
                        <select 
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#ff6b00]"
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
                          className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#ff6b00]"
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
                          className="w-full bg-black border border-[#333] rounded-lg px-3 py-2 text-zinc-300 text-xs outline-none focus:border-[#ff6b00] resize-none"
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
                            className="w-full bg-black border border-[#333] rounded-lg pl-8 pr-3 py-2 text-[#ff6b00] font-black text-sm outline-none focus:border-[#ff6b00]"
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

        {/* DESNA STRANA: PREVIEW I QR KOD */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 sticky top-[120px]">
          
          {/* AKCIJSKI PANEL (GENERISANJE) */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-[#ff6b00]/30 rounded-3xl p-6 shadow-[0_0_30px_rgba(255,107,0,0.1)]">
            {!generatedMenuId ? (
              <div className="flex flex-col items-center text-center">
                <QrCode size={48} className="text-[#ff6b00] mb-4 opacity-50" />
                <h3 className="text-white font-black uppercase tracking-widest mb-2">Save Menu For Client</h3>
                <p className="text-zinc-400 text-xs mb-6">Once saved, you will receive a unique QR code ready for table printing.</p>
                <button 
                  onClick={handleGenerateQR}
                  disabled={isSaving}
                  className="w-full bg-[#ff6b00] hover:bg-orange-500 text-black font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? 'Generating database...' : <><Save size={18} /> GENERATE QR CODE</>}
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center">
                <div className="bg-white p-4 rounded-2xl mb-4 shadow-[0_0_40px_rgba(255,107,0,0.3)]">
                  <img src={qrCodeImageUrl} alt="QR Code" className="w-48 h-48 object-contain" />
                </div>
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle size={16} />
                  <span className="font-black uppercase tracking-widest text-[11px]">Database Created</span>
                </div>
                <p className="text-zinc-500 text-[10px] mb-6 font-mono break-all px-4">{publicMenuUrl}</p>
                
                <a 
                  href={qrCodeImageUrl} 
                  download={`QR_Menu_${restaurantName.replace(/\s+/g, '_')}.png`}
                  target="_blank" rel="noreferrer"
                  className="w-full bg-zinc-100 hover:bg-white text-black font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mb-3"
                >
                  <Download size={18} /> DOWNLOAD QR FOR PRINT
                </a>

                <button 
                  onClick={() => setGeneratedMenuId(null)}
                  className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest underline transition-colors"
                >
                  ← Back to editing
                </button>
              </motion.div>
            )}
          </div>

          {/* TELEFON PREVIEW (LIVE DEMO) */}
          <div className="bg-black border-[12px] border-zinc-900 rounded-[2.5rem] overflow-hidden aspect-[9/19] shadow-2xl relative flex flex-col max-h-[600px] mx-auto w-full max-w-[320px] ring-1 ring-white/10">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-b-2xl z-50"></div>
            
            <div className="bg-[#0a0a0a] flex-1 overflow-y-auto custom-scrollbar pt-10 pb-6 px-4 relative">
              {/* Pozadinski glow efekat zasnovan na boji teme */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[50px] opacity-20 pointer-events-none" 
                style={{ backgroundColor: themeColor }}
              ></div>

              {/* Ime Restorana - Menja boju prema temi */}
              <h2 
                className="text-center font-black uppercase tracking-widest text-lg mb-6 border-b border-[#222] pb-4 transition-colors relative z-10"
                style={{ color: themeColor }}
              >
                {restaurantName || 'Your Restaurant'}
              </h2>

              <div className="flex flex-col gap-4 relative z-10">
                {items.map((item, idx) => (
                  <div key={idx} className="bg-[#111] p-3 rounded-xl border border-[#222] hover:border-white/10 transition-colors shadow-lg">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className="text-white font-bold text-sm uppercase leading-tight truncate mr-2 flex items-center gap-1">
                        {item.category === 'House Special' && <Star size={12} style={{ color: themeColor }} fill={themeColor} />}
                        {item.name || 'Item Name'}
                      </h4>
                      
                      {/* Cena - Menja boju prema temi i prikazuje odabranu valutu */}
                      <span className="font-black text-sm shrink-0 drop-shadow-md" style={{ color: themeColor }}>
                        {currency} {item.price ? `${item.price}` : '0.00'}
                      </span>
                    </div>
                    <span className="text-zinc-600 text-[8px] uppercase tracking-widest font-black mb-1.5 block">{item.category}</span>
                    <p className="text-zinc-400 text-[10px] leading-relaxed line-clamp-2">{item.desc || 'Item description will appear here...'}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigacija na dnu telefona */}
            <div className="bg-[#111] border-t border-[#222] p-3 flex justify-around relative z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
              <Utensils size={18} style={{ color: themeColor }} className="drop-shadow-md" />
              <Coffee size={18} className="text-zinc-600" />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
// KRAJ FAJLA: V8PremiumTestMenu.jsx