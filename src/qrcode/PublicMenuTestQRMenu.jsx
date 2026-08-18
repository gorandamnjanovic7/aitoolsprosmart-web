// POČETAK FAJLA: src/qrcode/PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Utensils, AlertTriangle, Crown, Coffee, Cake, Fish, Pizza, Leaf, Droplets, Wine, Flame, ChefHat, Moon } from 'lucide-react';

import { ITALIAN_MASSIVE_MENU } from '../DemoData/italianMassiveData.js';
import { GLOBAL_STREET_MENU } from '../DemoData/globalStreetFoodData.js';
import { MEXICAN_MASSIVE_MENU } from '../DemoData/mexicanMassiveData.js';
import { GREEK_MASSIVE_MENU } from '../DemoData/greekMassiveData.js';
import { FRENCH_MASSIVE_MENU } from '../DemoData/frenchMassiveData.js';
import { TURKISH_MASSIVE_MENU } from '../DemoData/turkishMassiveData.js'; 

const getCategoryIcon = (catName) => {
  const lower = catName.toLowerCase();
  
  if (lower.includes('signature') || lower.includes('specijalitet') || lower.includes('kuće') || lower.includes('house') || lower.includes('kebab')) return Flame; 
  if (lower.includes('breakfast') || lower.includes('doručak')) return Utensils;
  if (lower.includes('dessert') || lower.includes('dezert') || lower.includes('slatko') || lower.includes('poslastica') || lower.includes('kolač') || lower.includes('baklava')) return Cake;
  if (lower.includes('sea') || lower.includes('fish') || lower.includes('riba') || lower.includes('plodovi')) return Fish;
  if (lower.includes('pizza') || lower.includes('pica') || lower.includes('pide') || lower.includes('lahmacun')) return Pizza;
  if (lower.includes('salad') || lower.includes('salata') || lower.includes('prilog') || lower.includes('side') || lower.includes('meze') || lower.includes('appetizers')) return Leaf;
  if (lower.includes('soup') || lower.includes('supa') || lower.includes('čorba') || lower.includes('potaž')) return Droplets;
  if (lower.includes('drink') || lower.includes('wine') || lower.includes('piće') || lower.includes('karta pića') || lower.includes('vino') || lower.includes('beverages')) return Wine;
  if (lower.includes('döner') || lower.includes('street')) return Utensils;
  if (lower.includes('stew') || lower.includes('traditional')) return ChefHat;

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
            restaurantName: "AURA Fine Dining", 
            themeColor: "#ea580c", 
            currency: "€", 
            items: [ 
              { category: "Doručak", name: "Kraljevska Jaja Benedikt", price: "24.00", desc: "Savršeno poširana jaja na prepečenom brioš hlebu sa holandez sosom i norveškim lososom.", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80", isSignature: false },
              { category: "Glavna Jela", name: "Wagyu Tomahawk Odrezak", price: "150.00", desc: "Ekskluzivni A5 Wagyu odrezak, suvo zrenje 45 dana, pečen na otvorenoj vatri za nezaboravno iskustvo.", img: "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=800&q=80", isSignature: true },
              { category: "Dezerti", name: "Čokoladni Tart sa Zlatom", price: "35.00", desc: "Dekadentni tart od crne čokolade sa jestivim 24k zlatnim listićima i hrskavom morskom solju.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80", isSignature: false }
            ] 
          });
          return;
        }

        if (activeId === "TEST-QR-ITALIAN") { setMenuData(ITALIAN_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-GLOBAL") { setMenuData(GLOBAL_STREET_MENU); return; }
        if (activeId === "TEST-QR-MEXICAN") { setMenuData(MEXICAN_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-GREEK") { setMenuData(GREEK_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-FRENCH") { setMenuData(FRENCH_MASSIVE_MENU); return; }
        if (activeId === "TEST-QR-TURKISH") { setMenuData(TURKISH_MASSIVE_MENU); return; }
        
        if (activeId === "TEST-QR-CUSTOM") { setMenuData({ restaurantName: "TVOJ RESTORAN", themeColor: "#22c55e", currency: "RSD", items: [{ category: "Tvoje jelo", name: "Specijalitet Šefa Kuhinje", price: "0.00", desc: "Pažljivo osmišljeno kulinarsko remek-delo sačinjeno od najsvežijih sezonskih sastojaka." }] }); return; }

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
        <h1 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Meni Nije Pronađen</h1>
        <p className="text-zinc-500 text-sm mb-8">QR kod koji ste skenirali je nevažeći ili meni više nije aktivan.</p>
      </div>
    );
  }

  if (!menuData) {
    return <div className="min-h-[100dvh] bg-[#050505] relative z-50" />;
  }

  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);
  const themeColor = menuData.themeColor || '#ea580c';
  const currency = menuData.currency || '€';
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="min-h-[100dvh] bg-[#050505] font-sans pb-16 relative z-50">
      <style>{`::selection { background-color: ${themeColor}40; color: white; }`}</style>
      
      <div className="relative pt-12 pb-8 px-6 text-center overflow-hidden bg-[#0a0a0a] shadow-2xl mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <Utensils size={32} style={{ color: themeColor }} className="mb-4 drop-shadow-md" />
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.15em] text-white mb-2" style={{ textShadow: `0 0 20px ${themeColor}40` }}>{menuData.restaurantName}</h1>
          <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Zvanični Digitalni Meni</p>
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col">
        {categories.map((category) => {
          
          const CatIcon = getCategoryIcon(category);
          
          return (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1"></div>
                <h2 className="text-white font-black text-[15px] md:text-lg uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2" style={{ color: themeColor }}>
                  <CatIcon size={20} />
                  {category}
                </h2>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="flex flex-col gap-6">
                {groupedItems[category].map((item, idx) => (
                  <div key={idx} className="bg-[#0a0e17] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {item.img && (
                      <div className="w-full h-56 relative bg-zinc-900">
                        <img src={item.img} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-opacity duration-700 ease-in-out" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/20 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-5 flex flex-col gap-2 relative z-10">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-white font-black text-[15px] md:text-base uppercase leading-tight flex items-start gap-1.5">
                          {item.isSignature && <span className="text-[10px] mt-0.5" style={{ color: themeColor }}>★</span>}
                          {item.name}
                        </h3>
                        <span className="font-black text-[15px] md:text-base shrink-0" style={{ color: themeColor }}>{currency} {item.price}</span>
                      </div>
                      {item.desc && <p className="text-zinc-400 text-xs leading-relaxed mt-1">{item.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 w-full flex flex-col items-center justify-center opacity-40">
        <Crown size={16} className="text-zinc-500 mb-2" />
        <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Pokreće Smart Engine</span>
      </div>
    </div>
  );
}
// KRAJ FAJLA: src/qrcode/PublicMenuTestQRMenu.jsx