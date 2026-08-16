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
        // 🔥 FALLBACK ZA TESTIRANJE - FULL PREMIUM IZLOG 🔥
        if (menuId === "TEST-QR-PREVIEW-123") {
          setTimeout(() => {
            setMenuData({
              restaurantName: "AURA Fine Dining",
              themeColor: "#FF8C00",
              currency: "€",
              items: [
                // BREAKFAST & BRUNCH
                { category: "Breakfast & Brunch", name: "Royal Eggs Benedict", price: "24.00", desc: "Perfectly poached heritage eggs, Norwegian smoked salmon, hollandaise.", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Breakfast & Brunch", name: "Truffle Avocado Toast", price: "19.00", desc: "Smashed Hass avocado, shaved black summer truffle, artisanal sourdough.", img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Breakfast & Brunch", name: "Beluga Caviar Blini", price: "85.00", desc: "Traditional buckwheat blinis, crème fraîche, 30g premium Beluga caviar.", img: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Breakfast & Brunch", name: "Lobster Omelette", price: "32.00", desc: "Three-egg French folded omelette, butter-poached lobster tail, fine chives.", img: "https://images.unsplash.com/photo-1510693662589-51478fb4830b?auto=format&fit=crop&w=800&q=80", isSignature: false },

                // STARTERS & APPETIZERS
                { category: "Starters & Appetizers", name: "Beef Tartare", price: "28.00", desc: "Hand-cut prime beef tenderloin, quail egg, truffle emulsion, crostini.", img: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Starters & Appetizers", name: "Seared Foie Gras", price: "35.00", desc: "Pan-seared foie gras, fig compote, aged balsamic reduction, toasted brioche.", img: "https://images.unsplash.com/photo-1626804475157-19069d2f2d4e?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Starters & Appetizers", name: "Oysters Rockefeller", price: "26.00", desc: "Half-dozen freshly shucked oysters, spinach, Pernod, hollandaise glaze.", img: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Starters & Appetizers", name: "Carpaccio di Manzo", price: "24.00", desc: "Thinly sliced raw beef, wild arugula, 24-month Parmigiano-Reggiano, cold-pressed olive oil.", img: "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Starters & Appetizers", name: "Burrata & Heirloom Tomato", price: "22.00", desc: "Fresh Apulian burrata, organic heirloom tomatoes, basil oil, balsamic pearls.", img: "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=800&q=80", isSignature: false },

                // FISH & SEAFOOD
                { category: "Fish & Seafood", name: "Chilean Sea Bass", price: "55.00", desc: "Miso-glazed sea bass, bok choy, dashi broth, enoki mushrooms.", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Fish & Seafood", name: "Grilled Octopus", price: "34.00", desc: "Charred Mediterranean octopus, smoked paprika potato crema, chimichurri.", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Fish & Seafood", name: "Pan-Seared Scallops", price: "38.00", desc: "Hokkaido scallops, cauliflower purée, crispy pancetta, caper butter.", img: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Fish & Seafood", name: "Lobster Thermidor", price: "85.00", desc: "Whole Maine lobster, cognac cream sauce, Gruyère cheese crust.", img: "https://images.unsplash.com/photo-1553659971-f01207815844?auto=format&fit=crop&w=800&q=80", isSignature: true },

                // PASTA & RISOTTO
                { category: "Pasta & Risotto", name: "Truffle Risotto", price: "36.00", desc: "Acquerello rice, wild mushrooms, fresh black truffle shavings, Parmigiano.", img: "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Pasta & Risotto", name: "Lobster Linguine", price: "45.00", desc: "Artisanal linguine, half lobster, cherry tomatoes, white wine, bisque reduction.", img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Pasta & Risotto", name: "Saffron Seafood Risotto", price: "42.00", desc: "Carnaroli rice, Spanish saffron, wild-caught prawns, mussels, calamari.", img: "https://images.unsplash.com/photo-1601000676451-b0db313daef1?auto=format&fit=crop&w=800&q=80", isSignature: false },

                // MAIN COURSES (MEAT)
                { category: "Main Courses", name: "Wagyu Tomahawk", price: "150.00", desc: "Premium A5 Wagyu beef, grilled over open flame, smoked sea salt.", img: "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Main Courses", name: "Herb-Crusted Rack of Lamb", price: "48.00", desc: "New Zealand lamb rack, pistachio crust, mint pea purée, red wine jus.", img: "https://images.unsplash.com/photo-1514516871322-a9b05d15c7e0?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Main Courses", name: "Duck Magret", price: "42.00", desc: "Pan-roasted duck breast, wild berry reduction, celery root mousseline.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Main Courses", name: "Filet Mignon Rossini", price: "65.00", desc: "Prime center-cut filet, pan-seared foie gras, black truffle shavings, Madeira sauce.", img: "https://images.unsplash.com/photo-1544025162-8353383827d0?auto=format&fit=crop&w=800&q=80", isSignature: true },

                // DESSERTS
                { category: "Desserts", name: "Valrhona Chocolate Fondant", price: "18.00", desc: "Warm molten chocolate cake, Madagascar vanilla bean gelato, gold leaf.", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80", isSignature: true },
                { category: "Desserts", name: "Classic Crème Brûlée", price: "15.00", desc: "Tahitian vanilla custard, caramelized sugar crust, fresh seasonal berries.", img: "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Desserts", name: "Tiramisu al Limoncello", price: "16.00", desc: "Savoiardi biscuits, Amalfi lemon mascarpone cream, white chocolate shavings.", img: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80", isSignature: false },
                { category: "Desserts", name: "Artisanal Cheese Board", price: "28.00", desc: "Selection of aged European cheeses, honeycomb, candied walnuts, fig jam.", img: "https://images.unsplash.com/photo-1631379577038-518296ec519c?auto=format&fit=crop&w=800&q=80", isSignature: false }
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