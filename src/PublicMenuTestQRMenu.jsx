// POČETAK FAJLA: src/PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Utensils, AlertTriangle, Loader2, Crown } from 'lucide-react';

// 🔥 ČISTI UVOZ NAŠIH BAZA 🔥
import { ITALIAN_MASSIVE_MENU } from './DemoData/italianMassiveData.js';
import { GLOBAL_STREET_MENU } from './DemoData/globalStreetFoodData.js';
import { MEXICAN_MASSIVE_MENU } from './DemoData/mexicanMassiveData.js';

export default function PublicMenuTestQRMenu() {
  // 🔥 BUG-FIX: Hvatamo i 'id' i 'menuId' šta god da si stavio u App.jsx ruteru
  const params = useParams();
  const activeId = params.menuId || params.id; 

  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      if (!activeId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        // 🔥 FALLBACK TESTOVI ZA ADMIN PANEL (Test QR kodovi) 🔥
        if (activeId === "TEST-QR-PREVIEW-123") {
          setTimeout(() => {
            setMenuData({
              restaurantName: "AURA Fine Dining",
              themeColor: "#ea580c", // V8 Orange Hex
              currency: "€",
              items: [
                { category: "Breakfast", name: "Royal Eggs Benedict", price: "24.00", desc: "Perfectly poached heritage eggs, Norwegian smoked salmon.", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Main Courses", name: "Wagyu Tomahawk", price: "150.00", desc: "Premium A5 Wagyu beef, grilled over open flame.", img: "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=800&q=80", isSignature: true }
              ]
            });
            setLoading(false);
          }, 800);
          return;
        }

        if (activeId === "TEST-QR-ITALIAN-123") { setTimeout(() => { setMenuData(ITALIAN_MASSIVE_MENU); setLoading(false); }, 800); return; }
        if (activeId === "TEST-QR-GLOBAL-123") { setTimeout(() => { setMenuData(GLOBAL_STREET_MENU); setLoading(false); }, 800); return; }
        if (activeId === "TEST-QR-MEXICAN-123") { setTimeout(() => { setMenuData(MEXICAN_MASSIVE_MENU); setLoading(false); }, 800); return; }

        if (activeId === "TEST-QR-CUSTOM-123") {
          setTimeout(() => {
            setMenuData({ 
              restaurantName: "YOUR CUSTOM RESTAURANT", 
              themeColor: "#22c55e", // V8 Green Hex
              currency: "$", 
              items: [{ category: "Custom Dish", name: "Example Dish", price: "0.00", desc: "This is a placeholder for your custom menu testing.", isSignature: false }] 
            });
            setLoading(false);
          }, 800);
          return;
        }

        // 🔥 PRAVO ČITANJE IZ FIREBASE BAZE ZA KLIJENTE (LIVE PRODUKCIJA) 🔥
        const docRef = doc(db, 'v8_qr_menus', activeId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuData(docSnap.data());
        } else {
          console.error("Dokument ne postoji u bazi v8_qr_menus za ID:", activeId);
          setError(true);
        }
      } catch (err) {
        console.error("Firebase greška pri čitanju menija:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [activeId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center text-white relative z-50">
        <Loader2 size={48} className="animate-spin mb-4 text-[#ea580c]" />
        <p className="font-black uppercase tracking-widest text-sm text-zinc-500">Loading Menu...</p>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative z-50">
        <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Menu Not Found</h1>
        <p className="text-zinc-500 text-sm mb-8">The QR code you scanned might be invalid or the menu is no longer active.</p>
        
        {/* 🔥 DEBUG INFO - Pomaže da odmah vidimo da li je link dobar 🔥 */}
        <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-500">
          DEBUG ID: {activeId || "UNDEFINED"}
        </div>
      </div>
    );
  }

  // Grupisanje ubačenih jela po kategorijama
  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);
  const themeColor = menuData.themeColor || '#ea580c'; // Default V8 Orange
  const currency = menuData.currency || '€';
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="min-h-[100dvh] bg-[#050505] font-sans pb-16 relative z-50">
      <style>{`::selection { background-color: ${themeColor}40; color: white; }`}</style>
      
      {/* HEADER RESTORANA */}
      <div className="relative pt-12 pb-8 px-6 text-center overflow-hidden bg-[#0a0a0a] shadow-2xl mb-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <Utensils size={32} style={{ color: themeColor }} className="mb-4 drop-shadow-md" />
          <h1 className="text-2xl md:text-4xl font-black uppercase tracking-[0.15em] text-white mb-2" style={{ textShadow: `0 0 20px ${themeColor}40` }}>
            {menuData.restaurantName}
          </h1>
          <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">Official Digital Menu</p>
        </div>
      </div>

      {/* GLAVNI MENI - KATEGORIJE I JELA */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <h2 className="text-white font-black text-[15px] md:text-lg uppercase tracking-[0.2em] text-center" style={{ color: themeColor }}>
                {category}
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="flex flex-col gap-6">
              {groupedItems[category].map((item, idx) => (
                <div key={idx} className="bg-[#0a0e17] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  {item.img && (
                    <div className="w-full h-56 relative bg-zinc-900">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/20 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-5 flex flex-col gap-2 relative z-10">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="text-white font-black text-[15px] md:text-base uppercase leading-tight flex items-start gap-1.5">
                        {item.isSignature && <span className="text-[10px] mt-0.5" style={{ color: themeColor }}>★</span>}
                        {item.name}
                      </h3>
                      <span className="font-black text-[15px] md:text-base shrink-0" style={{ color: themeColor }}>
                        {currency} {item.price}
                      </span>
                    </div>
                    {item.desc && <p className="text-zinc-400 text-xs leading-relaxed mt-1">{item.desc}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-8 w-full flex flex-col items-center justify-center opacity-40">
        <Crown size={16} className="text-zinc-500 mb-2" />
        <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Powered by V8 Engine</span>
      </div>
    </div>
  );
}
// KRAJ FAJLA: src/PublicMenuTestQRMenu.jsx