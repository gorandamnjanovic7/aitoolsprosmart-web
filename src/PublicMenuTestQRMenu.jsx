// POČETAK FAJLA: PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Star, Info, Sparkles, Flame, ShieldCheck, Crown } from 'lucide-react';

export default function PublicMenuTestQRMenu() {
  const { menuId } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 GIGANTSKI MENI (BEZ BRAON BOJA, SAMO OLED CRNA I ČISTI LUKSUZ) 🔥
  const FALLBACK_DEMO_MENU = {
    restaurantName: "AURA Fine Dining & Lounge",
    currency: "€",
    themeColor: "#eab308",
    items: [
      // --- HOUSE SPECIALS ---
      { category: "House Special", name: "Golden Wagyu Tomahawk (1.2kg)", desc: "Melt-in-your-mouth Japanese A5 Wagyu beef, wrapped in 24k edible gold leaf flakes, slow-roasted with aromatic herbs and smoked with cherrywood tableside.", price: "450.00", img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80", tag: "Imperial Cut", isSignature: true },
      { category: "House Special", name: "Royal Beluga Caviar (50g)", desc: "Prestige wild Beluga caviar served chilled over crushed crystal ice with a traditional mother-of-pearl spoon, warm house blinis, and organic quail egg yolks.", price: "320.00", img: "https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=600&q=80", tag: "Rare Vintage", isSignature: true },
      { category: "House Special", name: "Emperor's Seafood Grand Tower", desc: "A multi-tier masterpiece loaded with Alaskan king crab legs, poached Maine lobster tails, fresh wild-caught oysters, and pan-seared jumbo Hokkaido scallops.", price: "280.00", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80", tag: "Ocean's Gold", isSignature: true },

      // --- STARTERS (PREDJELA) ---
      { category: "Starters", name: "Fresh Oysters Rockefeller", desc: "Half-dozen wild caught Atlantic oysters baked to perfection with organic creamed spinach, fine herbs, Pernod anise, and a golden Parmigiano-Reggiano crust.", price: "48.00", img: "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=600&q=80", tag: "Chef's Choice" },
      { category: "Starters", name: "Hand-Cut Royal Beef Tartare", desc: "Finest hand-chopped Black Angus tenderloin, seasoned with Dijon mustard, shallots, capers, topped with a cured quail egg yolk and a mist of white truffle oil.", price: "45.00", img: "https://images.unsplash.com/photo-1514517604298-cf80e0fb7f1e?auto=format&fit=crop&w=600&q=80", tag: "V8 Signature" },
      { category: "Starters", name: "Pan-Seared Foie Gras Terrine", desc: "Decadent, rich duck liver terrine lightly seared, paired beautifully with homemade caramelized fig jam and toasted artisanal butter brioche layers.", price: "42.00", img: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80", tag: "Delicacy" },
      { category: "Starters", name: "Citrus Amalfi Octopus Carpaccio", desc: "Paper-thin slices of tender Mediterranean octopus, drizzled with Amalfi lemon-infused extra virgin olive oil, wild capers, and crushed pink peppercorns.", price: "34.00", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80", tag: "Fresh Cut" },

      // --- SOUPS & BROTHS (SUPE I ČORBE) ---
      { category: "Soups & Broths", name: "Cognac Lobster Bisque", desc: "Velvety smooth crustacean cream soup slowly simmered with fresh Maine lobster meat, infused with aged French cognac and a touch of tarragon cream.", price: "28.00", img: "https://images.unsplash.com/photo-1547592165-e1d17f1a0655?auto=format&fit=crop&w=600&q=80", tag: "Warm Luxury" },
      { category: "Soups & Broths", name: "Traditional Veal Ragout Čorba", desc: "A rich, slow-simmered creamy veal broth cooked with selected organic root vegetables, light lemon zest, and a generous dollop of artisan sour cream.", price: "14.00", img: "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?auto=format&fit=crop&w=600&q=80", tag: "Local Heritage" },
      { category: "Soups & Broths", name: "Premium Adriatic Fisherman's Stew", desc: "Deeply flavorful, gently spiced Adriatic fish stew loaded with premium boneless chunks of wild caught river carp, catfish, and smoked red pepper essence.", price: "16.00", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80", tag: "Spicy & Rich" },

      // --- SALADS ---
      { category: "Salads", name: "Puglian Burrata & Heirloom Tomato", desc: "Creamy, buttery heart Italian burrata cheese paired with multi-colored heirloom tomatoes, micro basil pesto, and a sweet 15-year-old aged Modena balsamic glaze.", price: "22.00", img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80", tag: "Organic" },
      { category: "Salads", name: "Caesar Royal with Tiger Prawns", desc: "Crisp organic romaine lettuce leaves tossed with charcoal-grilled jumbo tiger prawns, crispy pancetta chips, parmigiano tuile, and gourmet truffle Caesar cream.", price: "26.00", img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=600&q=80", tag: "Classic Elite" },

      // --- PREMIUM STEAKS & MEAT (MESO) ---
      { category: "Premium Steaks & Meat", name: "Black Angus Ribeye (400g)", desc: "Premium wet and dry-aged cut for 45 days, featuring high-grade intramuscular marbling, wood-fired and served with garlic-roasted marrow bone.", price: "85.00", img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80", tag: "Dry Aged" },
      { category: "Premium Steaks & Meat", name: "Prime Cut Filet Mignon", desc: "The most delicate, exceptionally tender center-cut beef tenderloin medallion, grilled over red-hot oak charcoal, finished with a rich wild green pepper reduction.", price: "75.00", img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80", tag: "Tender Premium" },
      { category: "Premium Steaks & Meat", name: "Herb-Crusted New Zealand Rack of Lamb", desc: "Perfectly roasted rack of lamb with a vibrant, crunchy parsley-rosemary-garlic crust, served over a silky mint jus and roasted garlic clove purée.", price: "72.00", img: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=600&q=80", tag: "Farmed Tender" },
      { category: "Premium Steaks & Meat", name: "Melt-In-Your-Mouth Kobe Beef Striploin A5", desc: "Authentic, certified Japanese Kobe beef with a peerless BMS 12 marbling score, masterfully seared tableside, accompanied by a light sweet ginger-wasabi reduction.", price: "190.00", img: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=600&q=80", tag: "A5 Certified" },

      // --- SEAFOOD & FISH (RIBA) ---
      { category: "Seafood & Fish", name: "Buttery Saikyo Miso Black Cod", desc: "Indulgent, ultra-rich wild black cod fillet, marinated for 72 hours in traditional Japanese sweet mirin-miso glaze and baked to caramel perfection.", price: "85.00", img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80", tag: "Award Winning" },
      { category: "Seafood & Fish", name: "Mediterranean Branzino Sea Bass", desc: "Whole wild caught sea bass grilled over dry grapevine, expertly de-boned tableside, drizzled with virgin olive oil, wild rosemary, and sea salt flakes.", price: "65.00", img: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=600&q=80", tag: "Wild Caught" },
      { category: "Seafood & Fish", name: "Sesame Crust Bluefin Tuna Sashimi", desc: "Sashimi-grade wild bluefin tuna encrusted with black and white sesame seeds, flash-seared rare, plated with a sharp ponzu reduction and fresh wakame salad.", price: "78.00", img: "https://images.unsplash.com/photo-1501595091296-3aa970afb3ff?auto=format&fit=crop&w=600&q=80", tag: "Sashimi Grade" },

      // --- PIZZA & PASTA ---
      { category: "Pizza & Pasta", name: "Fresh Umbrian Black Truffle Gnocchi", desc: "Hand-rolled soft potato gnocchi sautéed in a rich Parmigiano cream sauce, piled high with generous, freshly shaved aromatic Umbrian black truffles.", price: "36.00", img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80", tag: "Handmade" },
      { category: "Pizza & Pasta", name: "Slow-Simmered Wagyu Pappardelle", desc: "Handmade ribbons of fresh egg pappardelle tossed in a rich 12-hour bolognese ragout made exclusively from A5 Wagyu beef beef, topped with aged cheese.", price: "42.00", img: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80", tag: "Rich Ragout" },

      // --- SIDE DISHES (PRILOZI) ---
      { category: "Side Dishes", name: "Gourmet White Truffle Mash", desc: "Silky Yukon gold potatoes whipped with Normandy butter, heavy cream, and authentic premium white truffle oil essence from Alba.", price: "12.00", img: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80", tag: "Elite Side" },
      { category: "Side Dishes", name: "Charred Asparagus with Parmesan", desc: "Jumbo fresh green asparagus stalks lightly grilled over fire, seasoned with lemon essence, extra virgin olive oil, and 36-month aged Parmigiano shavings.", price: "14.00", img: "https://images.unsplash.com/photo-1469307732324-4f8a03f4439c?auto=format&fit=crop&w=600&q=80", tag: "Wood Fired" },

      // --- DESSERTS (DEZERTI) ---
      { category: "Desserts", name: "Hot Caramel 24k Chocolate Sphere", desc: "A stunning glossy dark Belgian chocolate shell containing rich hazelnut praline mousse, melted directly at the table with a piping hot stream of salted caramel sauce.", price: "35.00", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80", tag: "Tableside Show" },
      { category: "Desserts", name: "Authentic Sicilian Pistachio Soufflé", desc: "Airy, perfectly baked lava soufflé featuring liquid center made from authentic Bronte pistachios, served with premium Madagascar vanilla bean ice cream.", price: "24.00", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80", tag: "Freshly Baked" },

      // --- DRINKS ---
      { category: "Drinks", name: "Dom Pérignon Brut Champagne", desc: "Vintage 2013 prestige cuvée champagne. Flawless structure, presenting an absolute balance of white stone fruit, brioche notes, toasted almonds, and deep mineral acidity.", price: "450.00", img: "https://images.unsplash.com/photo-1594488210352-ec09f30b6d90?auto=format&fit=crop&w=600&q=80", tag: "Prestige Cuvée" },
      { category: "Drinks", name: "Shimmering Gold Roku Gin & Tonic", desc: "Japanese Roku artisanal gin mixed with premium craft yuzu tonic water, botanical infusions, and finished with a shimmery swirl of beautiful edible gold dust particles.", price: "25.00", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80", tag: "Signature Mix" }
    ]
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (!menuId || menuId === 'TEST') {
          setMenuData(FALLBACK_DEMO_MENU);
          setLoading(false);
          return;
        }
        
        const docRef = doc(db, 'v8_qr_menus', menuId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuData(docSnap.data());
        } else {
          setMenuData(FALLBACK_DEMO_MENU);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
        setMenuData(FALLBACK_DEMO_MENU);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [menuId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
      </div>
    );
  }

  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryOrder = [
    "House Special", 
    "Starters", 
    "Soups & Broths", 
    "Salads", 
    "Premium Steaks & Meat", 
    "Seafood & Fish", 
    "Pizza & Pasta", 
    "Side Dishes", 
    "Desserts", 
    "Drinks"
  ];

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 99;
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#ff6b00] selection:text-white relative z-50 antialiased font-sans">
      
      {/* GLAVNI MOBILNI KONTEJNER SA ČISTOM OLED CRNOM BOJOM */}
      <div className="w-full max-w-[480px] bg-black min-h-screen relative shadow-[0_0_60px_rgba(0,0,0,1)] pb-28 border-x border-[#111]">
        
        {/* MAGIČNI ZLATNI ODJSJAJ (Sada diskretniji da ne pravi prljavu boju) */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-80 blur-[150px] opacity-[0.08] pointer-events-none transform-gpu" 
          style={{ backgroundColor: menuData.themeColor }}
        ></div>

        {/* LUKSUZNI HEADER SA ČISTIM CRNIM GRADIENTOM */}
        <header className="pt-16 pb-10 px-6 text-center relative z-10 border-b border-[#111] bg-gradient-to-b from-black via-black/95 to-transparent">
          <div className="flex justify-center mb-3">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="p-1 rounded-full border border-amber-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)] bg-black">
              <Crown size={22} className="text-amber-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
            </motion.div>
          </div>
          <h1 
            className="text-2xl font-black uppercase tracking-[0.15em] mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,1)] font-sans"
            style={{ color: menuData.themeColor, textShadow: '0 2px 20px rgba(234,179,8,0.3)' }}
          >
            {menuData.restaurantName}
          </h1>
          <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] ml-1">EXPERIENCE SUPREMACY</p>
        </header>

        {/* SKROL LISTA KATEGORIJA */}
        <main className="px-4 py-8 space-y-14 relative z-10">
          {sortedCategories.map((category, idx) => (
            <div key={category} className="relative">
              
              {/* NASLOV KATEGORIJE - STICKY LUKSUZNI EFEKAT NA OLED CRNOJ */}
              <h2 className="text-white font-black text-xs uppercase tracking-[0.25em] mb-6 flex items-center gap-3 sticky top-0 bg-black/90 backdrop-blur-xl py-4 z-20 border-b border-[#222] shadow-sm">
                <span className="w-1 h-4 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.8)]" style={{ backgroundColor: menuData.themeColor }}></span>
                {category}
              </h2>

              {/* KARTICE JELA - ČISTA TAMNO SIVA BEZ BRAON TONOVA */}
              <div className="flex flex-col gap-8">
                {groupedItems[category].map((item, itemIdx) => (
                  <motion.div 
                    key={itemIdx} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0a0a0a] rounded-3xl border border-[#222] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative group transition-all duration-500 hover:border-zinc-700"
                  >
                    
                    {/* EKSKLUZIVNA ZNAČKA (TAG) */}
                    {item.tag && (
                      <div className="absolute top-4 left-4 z-30 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-2xl">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-200 flex items-center gap-1.5">
                          {item.isSignature ? <Sparkles size={10} className="text-amber-400 animate-pulse" /> : <Flame size={10} className="text-orange-500" />}
                          {item.tag}
                        </span>
                      </div>
                    )}

                    {/* HD FOTOGRAFIJA SA OŠTRIM CRNIM GRADIENTOM */}
                    {item.img && (
                      <div className="w-full h-52 overflow-hidden relative shadow-inner">
                        <img 
                          src={item.img} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 transform-gpu"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent"></div>
                      </div>
                    )}

                    {/* DETALJI JELA UNUTAR KARTICE */}
                    <div className="p-5 pt-4">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h3 className="text-white font-black text-sm uppercase tracking-wide leading-snug drop-shadow-md flex items-center gap-2">
                          {item.isSignature && <Crown size={14} className="text-amber-500 shrink-0" />}
                          {item.name}
                        </h3>
                        <span className="font-black text-sm shrink-0 tracking-wider drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]" style={{ color: menuData.themeColor }}>
                          {menuData.currency}{item.price}
                        </span>
                      </div>
                      
                      {item.desc && (
                        <p className="text-zinc-400 text-[11px] leading-relaxed font-medium tracking-wide">
                          {item.desc}
                        </p>
                      )}
                    </div>

                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </main>

        {/* FIKSNA NAVIGACIONA TRAKA NA DNU EKRANA (Čista crna) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-black/95 backdrop-blur-2xl border-t border-[#222] p-4.5 flex justify-around items-center z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.95)]">
          <button className="flex flex-col items-center gap-1 transition-transform active:scale-90" style={{ color: menuData.themeColor }}>
            <Utensils size={18} className="drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" />
            <span className="text-[8px] font-black uppercase tracking-[0.15em]">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors active:scale-90">
            <Coffee size={18} />
            <span className="text-[8px] font-black uppercase tracking-[0.15em]">Call Staff</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors active:scale-90">
            <Info size={18} />
            <span className="text-[8px] font-black uppercase tracking-[0.15em]">Info</span>
          </button>
        </div>

      </div>
    </div>
  );
}
// KRAJ FAJLA: PublicMenuTestQRMenu.jsx