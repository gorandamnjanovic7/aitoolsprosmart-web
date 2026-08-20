// POČETAK FAJLA: src/qrcode/PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Utensils, AlertTriangle, Crown, Coffee, Cake, Fish, Pizza, Leaf, Droplets, Wine, Flame, ChefHat } from 'lucide-react';

import { ITALIAN_MASSIVE_MENU } from '../DemoData/italianMassiveData.js';
import { GLOBAL_STREET_MENU } from '../DemoData/globalStreetFoodData.js';
import { MEXICAN_MASSIVE_MENU } from '../DemoData/mexicanMassiveData.js';
import { GREEK_MASSIVE_MENU } from '../DemoData/greekMassiveData.js';
import { FRENCH_MASSIVE_MENU } from '../DemoData/frenchMassiveData.js';
import { TURKISH_MASSIVE_MENU } from '../DemoData/turkishMassiveData.js'; 
import { RUSSIAN_MASSIVE_MENU } from '../DemoData/russianMassiveData.js';

import { getImageForDish } from '../data/v8SmartImageHelper.js';

const getCategoryIcon = (catName) => {
  const lower = catName.toLowerCase();
  if (lower.includes('signature') || lower.includes('specialty') || lower.includes('house') || lower.includes('kebab')) return Flame; 
  if (lower.includes('breakfast') || lower.includes('morning') || lower.includes('porridges') || lower.includes('grains')) return Coffee;
  if (lower.includes('dessert') || lower.includes('sweet') || lower.includes('pastry') || lower.includes('cake') || lower.includes('bakery')) return Cake;
  if (lower.includes('sea') || lower.includes('fish') || lower.includes('catch') || lower.includes('caviar')) return Fish;
  if (lower.includes('pizza') || lower.includes('pide') || lower.includes('pies') || lower.includes('blini')) return Pizza;
  if (lower.includes('salad') || lower.includes('green') || lower.includes('side') || lower.includes('meze') || lower.includes('zakuski') || lower.includes('potato')) return Leaf;
  if (lower.includes('soup') || lower.includes('stew') || lower.includes('broth')) return Droplets;
  if (lower.includes('drink') || lower.includes('wine') || lower.includes('beverage') || lower.includes('cocktail')) return Wine;
  if (lower.includes('döner') || lower.includes('street') || lower.includes('dumplings') || lower.includes('tacos') || lower.includes('burgers')) return Utensils;
  return ChefHat; 
};

export default function PublicMenuTestQRMenu() {
  const params = useParams();
  const activeId = params.menuId || params.id; 

  const [menuData, setMenuData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      if (!activeId) { setError(true); return; }

      try {
        if (activeId === "TEST-QR-PREVIEW") {
          setMenuData({ 
            restaurantName: "AURA Fine Dining", themeColor: "#ea580c", currency: "$", 
            items: [ 
              { category: "Breakfast", name: "Royal Eggs Benedict", price: "24.00", desc: "Perfectly poached farm eggs on toasted brioche bread with hollandaise.", img: "", isSignature: false },
              { category: "Main Courses", name: "Wagyu Tomahawk Steak", price: "150.00", desc: "Exclusive A5 Wagyu steak roasted over an open fire. Carved tableside.", img: "", isSignature: true }
            ] 
          }); return;
        }

        if (activeId === "TEST-QR-ITALIAN") { setMenuData(ITALIAN_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-GLOBAL") { setMenuData(GLOBAL_STREET_MENU); return; }
        if (activeId === "TEST-QR-MEXICAN") { setMenuData(MEXICAN_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-GREEK") { setMenuData(GREEK_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-FRENCH") { setMenuData(FRENCH_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-TURKISH") { setMenuData(TURKISH_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-RUSSIAN") { setMenuData(RUSSIAN_MASSIVE_MENU); return; }
        
        const docRef = doc(db, 'v8_qr_menus', activeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) { setMenuData(docSnap.data()); } else { setError(true); }
      } catch (err) { setError(true); }
    };
    fetchMenu();
  }, [activeId]);

  if (error) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative z-50">
        <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Menu Not Found</h1>
        <p className="text-zinc-500 text-sm mb-8">The scanned QR code is invalid or the menu is no longer active.</p>
      </div>
    );
  }

  if (!menuData) {
    return <div className="min-h-[100dvh] bg-[#050505] relative z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin"></div>
    </div>;
  }

  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);
  const themeColor = menuData.themeColor || '#ea580c';
  const currency = menuData.currency || '$';
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="min-h-[100dvh] bg-[#050505] font-sans pb-16 relative z-50 selection:bg-white/20">
      <style>{`
        ::selection { background-color: ${themeColor}40; color: white; }
        .v8-elegant-italic { font-family: 'Playfair Display', 'Georgia', serif; font-style: italic; letter-spacing: 0.05em; }
      `}</style>
      
      {/* GLAVNI HEADER MENIJA */}
      <div className="relative pt-12 pb-8 px-6 text-center overflow-hidden bg-[#0a0a0a] shadow-[0_15px_40px_rgba(0,0,0,0.8)] mb-10 border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-40 blur-[100px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <Utensils size={36} style={{ color: themeColor }} className="mb-4 drop-shadow-lg" />
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-[0.15em] text-white mb-2" style={{ textShadow: `0 0 25px ${themeColor}50` }}>{menuData.restaurantName}</h1>
          <p className="text-zinc-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.25em]">Official Digital Menu</p>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col">
        {categories.map((category) => {
          const CatIcon = getCategoryIcon(category);
          
          return (
            <div key={category} className="mb-14">
              {/* ZAGLAVLJE KATEGORIJE */}
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent to-white/20 flex-1"></div>
                <h2 className="text-white font-black text-[16px] md:text-xl uppercase tracking-[0.2em] text-center flex items-center justify-center gap-3" style={{ color: themeColor }}>
                  <CatIcon size={24} className="drop-shadow-md" />
                  {category}
                </h2>
                <div className="h-px bg-gradient-to-l from-transparent to-white/20 flex-1"></div>
              </div>

              {/* LISTA JELA - NOVI STROGI LAYOUT (SLIKA LEVO, TEKST DESNO U 3 REDA) */}
              <div className="flex flex-col gap-5 md:gap-6">
                {groupedItems[category].map((item, idx) => {
                  
                  const isUploadedCustom = item.img && !item.img.includes('unsplash');
                  const finalImage = isUploadedCustom ? item.img : getImageForDish(item.name);

                  return (
                    <div key={idx} className="bg-[#0d1117] rounded-[1.5rem] border border-white/5 overflow-hidden p-4 md:p-5 flex flex-row items-stretch justify-start gap-4 md:gap-5 shadow-[0_15px_35px_rgba(0,0,0,0.6)] h-[140px] md:h-[160px]">
                      
                      {/* LEVA STRANA - SAMO SLIKA (FIKSNA, STROGI KVADRAT) */}
                      <div className="w-[108px] h-[108px] md:w-[120px] md:h-[120px] shrink-0 rounded-xl overflow-hidden bg-[#0a0a0a] shadow-inner border border-white/5 self-center">
                        <img 
                            src={finalImage} 
                            alt={item.name} 
                            loading="lazy" 
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} 
                        />
                      </div>

                      {/* DESNA STRANA - TAČNO 3 REDA */}
                      <div className="flex flex-col flex-1 justify-between py-0.5 overflow-hidden">
                        
                        {/* RED 1: IME HRANE (NA VRHU) */}
                        <div className="mb-1">
                          <h3 className="text-white font-bold text-[16px] md:text-lg leading-tight flex items-start gap-2 v8-elegant-italic truncate w-full">
                            {item.isSignature && <span className="text-[12px] mt-1 animate-pulse" style={{ color: themeColor }}>★</span>}
                            {item.name}
                          </h3>
                        </div>

                        {/* RED 2: OPIS HRANE (U SREDINI) */}
                        <div className="flex-1 overflow-hidden">
                          {item.desc && (
                            <p className="text-zinc-400 text-[12px] md:text-[13px] leading-snug v8-elegant-italic line-clamp-3">
                              {item.desc}
                            </p>
                          )}
                        </div>
                        
                        {/* RED 3: CENA (ZAKUCANA ZA DNO) */}
                        <div className="mt-auto">
                          <span className="font-black text-[15px] md:text-[17px] v8-elegant-italic" style={{ color: themeColor }}>
                            {currency} {item.price}
                          </span>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* FOOTER */}
      <div className="mt-12 w-full flex flex-col items-center justify-center opacity-40">
        <Crown size={18} className="text-zinc-500 mb-3" />
        <span className="text-[10px] font-black tracking-[0.25em] text-zinc-500 uppercase">Powered by Smart Engine</span>
      </div>
    </div>
  );
}
// KRAJ FAJLA: src/qrcode/PublicMenuTestQRMenu.jsx