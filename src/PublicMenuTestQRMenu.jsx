// POČETAK FAJLA: PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Utensils, AlertTriangle, Loader2, Crown } from 'lucide-react';

export default function PublicMenuTestQRMenu() {
  const { menuId } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      try {
        // 🔥 FALLBACK ZA TESTIRANJE 🔥
        if (menuId === "TEST-QR-PREVIEW-123") {
          setTimeout(() => {
            setMenuData({
              restaurantName: "AURA Fine Dining (TEST)",
              themeColor: "#FF8C00",
              currency: "€",
              items: [
                { category: "Breakfast", name: "Royal Eggs Benedict", price: "24.00", desc: "Perfectly poached heritage eggs, Norwegian smoked salmon.", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80" },
                { category: "Breakfast", name: "Truffle Avocado Toast", price: "19.00", desc: "Smashed Hass avocado, shaved black summer truffle.", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80" },
                { category: "Main Courses", name: "Wagyu Tomahawk", price: "150.00", desc: "Premium A5 Wagyu beef, grilled over open flame.", img: "https://images.unsplash.com/photo-1547592165-e1d17f1a0655?auto=format&fit=crop&w=600&q=80" }
              ]
            });
            setLoading(false);
          }, 800);
          return;
        }

        // PRAVO POVLAČENJE IZ BAZE
        const docRef = doc(db, 'v8_qr_menus', menuId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuData(docSnap.data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Greška pri povlačenju menija:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center text-white relative z-50">
        <Loader2 size={48} className="animate-spin mb-4 text-[#FF8C00]" />
        <p className="font-black uppercase tracking-widest text-sm text-zinc-500">Loading Menu...</p>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative z-50">
        <AlertTriangle size={64} className="text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
        <h1 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Menu Not Found</h1>
        <p className="text-zinc-500 text-sm">The QR code you scanned might be invalid or the menu is no longer active.</p>
      </div>
    );
  }

  // Grupisanje jela po kategorijama
  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categories = Object.keys(groupedItems);
  const themeColor = menuData.themeColor || '#FF8C00';
  const currency = menuData.currency || '€';
  const FALLBACK_IMAGE_URL = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80";

  return (
    <div className="min-h-[100dvh] bg-[#050505] font-sans selection:bg-[#FF8C00] selection:text-white pb-16 relative z-50">
      
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

      {/* CONTINUOUS SCROLL LISTA (BEZ HARMONIKE) */}
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 flex flex-col">
        {categories.map((category) => (
          <div key={category} className="mb-12">
            
            {/* Naslov Kategorije (Odvajač) */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-white/10 flex-1"></div>
              <h2 className="text-white font-black text-[15px] md:text-lg uppercase tracking-[0.2em]" style={{ color: themeColor }}>
                {category}
              </h2>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            {/* Jela u Kategoriji */}
            <div className="flex flex-col gap-6">
              {groupedItems[category].map((item, idx) => (
                <div key={idx} className="bg-[#0a0e17] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  
                  {/* Slika jela */}
                  {item.img && (
                    <div className="w-full h-56 relative bg-zinc-900">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE_URL; }} 
                      />
                      {/* Tamni prelaz ka tekstu */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-[#0a0e17]/20 to-transparent"></div>
                    </div>
                  )}

                  {/* Info o jelu */}
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
                    
                    {item.desc && (
                      <p className="text-zinc-400 text-xs leading-relaxed mt-1">
                        {item.desc}
                      </p>
                    )}
                  </div>

                </div>
              ))}
            </div>
            
          </div>
        ))}
      </div>

      {/* V8 WATERMARK NA DNU */}
      <div className="mt-8 w-full flex flex-col items-center justify-center opacity-40">
        <Crown size={16} className="text-zinc-500 mb-2" />
        <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Powered by V8 Engine</span>
      </div>
      
    </div>
  );
}
// KRAJ FAJLA: PublicMenuTestQRMenu.jsx