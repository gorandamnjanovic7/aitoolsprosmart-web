// POČETAK FAJLA: V8LiveMenuViewer.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase'; // Proveri da li je putanja tačna
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Utensils, AlertTriangle, Loader2 } from 'lucide-react';

export default function V8LiveMenuViewer() {
  const { id } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchMenu = async () => {
      try {
        // Ako je onaj naš fallback test ID, simuliramo učitavanje
        if (id === "TEST-QR-PREVIEW-123") {
            setTimeout(() => {
                setError(true);
                setLoading(false);
            }, 1000);
            return;
        }

        const docRef = doc(db, 'v8_qr_menus', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuData(docSnap.data());
          // Automatski otvori prvu kategoriju
          if (docSnap.data().items && docSnap.data().items.length > 0) {
             const firstCat = docSnap.data().items[0].category;
             setExpandedCategory(firstCat);
          }
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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#FF8C00]">
        <Loader2 size={48} className="animate-spin mb-4" />
        <p className="font-black uppercase tracking-widest text-sm">Loading Menu...</p>
      </div>
    );
  }

  if (error || !menuData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle size={64} className="text-red-500 mb-6" />
        <h1 className="text-white font-black text-2xl uppercase tracking-widest mb-2">Menu Not Found</h1>
        <p className="text-zinc-500 text-sm">The QR code you scanned might be invalid or the menu has been removed.</p>
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

  return (
    <div className="min-h-screen bg-[#050505] font-sans selection:bg-orange-500 selection:text-white pb-20">
      
      {/* HEADER RESTORANA */}
      <div className="relative pt-16 pb-10 px-6 text-center overflow-hidden border-b border-white/5 bg-[#0a0a0a]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 blur-[80px] opacity-20 pointer-events-none" style={{ backgroundColor: themeColor }}></div>
        <div className="relative z-10 flex flex-col items-center">
          <Utensils size={32} style={{ color: themeColor }} className="mb-4 drop-shadow-md" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-white mb-2" style={{ textShadow: `0 0 20px ${themeColor}40` }}>
            {menuData.restaurantName}
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Official Digital Menu</p>
        </div>
      </div>

      {/* LISTA KATEGORIJA (ACCORDION) */}
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 mt-8 flex flex-col gap-4">
        {categories.map((category) => {
          const isOpen = expandedCategory === category;
          return (
            <div key={category} className="flex flex-col bg-[#0a0a0a] rounded-[1.5rem] border border-white/5 overflow-hidden shadow-lg">
              
              {/* Dugme za otvaranje kategorije */}
              <button 
                onClick={() => setExpandedCategory(isOpen ? null : category)}
                className="w-full px-6 py-5 flex items-center justify-between bg-[#111111] hover:bg-[#151515] transition-colors"
              >
                <h2 className="text-white font-black text-sm md:text-base uppercase tracking-widest" style={{ color: isOpen ? themeColor : 'white' }}>
                  {category}
                </h2>
                <div className="bg-black border border-white/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ borderColor: isOpen ? themeColor : '' }}>
                  <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ color: isOpen ? themeColor : '#888' }} />
                </div>
              </button>

              {/* Sadržaj kategorije (Jela) */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-6 flex flex-col gap-6 bg-[#050505]">
                      {groupedItems[category].map((item, idx) => (
                        <div key={idx} className="bg-[#0a0e17] rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-md">
                          
                          {/* Slika jela */}
                          {item.img && (
                            <div className="w-full h-48 sm:h-56 relative bg-zinc-900">
                              <img 
                                src={item.img} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                                onError={(e) => { e.target.style.display = 'none'; }} 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e17] via-transparent to-transparent"></div>
                            </div>
                          )}

                          {/* Info o jelu */}
                          <div className="p-5 flex flex-col gap-2 relative">
                            <div className="flex justify-between items-start gap-4">
                              <h3 className="text-white font-black text-sm md:text-base uppercase leading-tight pr-4">
                                {item.name}
                              </h3>
                              <span className="font-black text-sm md:text-base shrink-0" style={{ color: themeColor }}>
                                {currency} {item.price}
                              </span>
                            </div>
                            
                            {item.desc && (
                              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed mt-1">
                                {item.desc}
                              </p>
                            )}
                          </div>

                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          );
        })}
      </div>
      
    </div>
  );
}
// KRAJ FAJLA: V8LiveMenuViewer.jsx