// POČETAK FAJLA: PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Utensils, Coffee, Star, Info } from 'lucide-react';

export default function PublicMenuTestQRMenu() {
  const { menuId } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 MAKSIMALNO NABUDŽEN TEST JELOVNIK (SVE KATEGORIJE, CENE I OPISI) 🔥
  const FALLBACK_DEMO_MENU = {
    restaurantName: "AURA Fine Dining & Lounge",
    currency: "€",
    themeColor: "#eab308",
    items: [
      // --- HOUSE SPECIAL (STEAK & CAVIAR) ---
      { category: "House Special", name: "Wagyu A5 Tomahawk (1kg)", desc: "Pure Japanese Wagyu beef, 24k gold leaf flakes, black truffle mash.", price: "240.00" },
      { category: "House Special", name: "Beluga Caviar & Blinis", desc: "50g premium Beluga caviar served with traditional blinis, quail egg and crème fraîche.", price: "280.00" },
      { category: "House Special", name: "Black Angus Ribeye (400g)", desc: "Dry-aged for 45 days, served with bone marrow and chimichurri sauce.", price: "85.00" },
      { category: "House Special", name: "Chateaubriand for Two", desc: "Center cut tenderloin, roasted vegetables, red wine reduction.", price: "120.00" },
      
      // --- SOUPS & BROTHS (SUPE I ČORBE) ---
      { category: "Soups & Broths", name: "Lobster Bisque", desc: "Creamy Maine lobster soup infused with cognac and fresh tarragon.", price: "28.00" },
      { category: "Soups & Broths", name: "Traditional Veal Ragout (Teleća Čorba)", desc: "Slow-cooked veal broth with root vegetables and a touch of sour cream.", price: "14.00" },
      { category: "Soups & Broths", name: "French Onion Soup", desc: "Caramelized onions, rich beef broth, topped with melted Gruyère cheese crostini.", price: "18.00" },
      { category: "Soups & Broths", name: "Cream of Forest Mushroom", desc: "Wild porcini and chanterelle mushrooms, finished with white truffle oil.", price: "16.00" },

      // --- SALADS (SALATE) ---
      { category: "Salads", name: "Burrata & Heirloom Tomato", desc: "Fresh Italian burrata, organic heirloom tomatoes, basil pesto, 15-year balsamic glaze.", price: "22.00" },
      { category: "Salads", name: "Caesar Royal", desc: "Crisp romaine, quail eggs, pancetta crisps, parmesan shavings, truffle dressing.", price: "24.00" },
      { category: "Salads", name: "Mediterranean Octopus Salad", desc: "Slow-cooked octopus, cherry tomatoes, capers, kalamata olives, lemon vinaigrette.", price: "29.00" },
      { category: "Salads", name: "Quinoa & Avocado Bowl", desc: "Organic quinoa, Hass avocado, pomegranate seeds, toasted almonds, citrus dressing.", price: "19.00" },

      // --- STARTERS (PREDJELA) ---
      { category: "Starters", name: "Royal Beef Tartare", desc: "Hand-cut premium beef tenderloin, quail egg, capers, white truffle oil.", price: "45.00" },
      { category: "Starters", name: "Hokkaido Scallops", desc: "Pan-seared sea scallops with saffron puree and crispy pancetta dust.", price: "38.00" },
      { category: "Starters", name: "Foie Gras Terrine", desc: "Duck liver terrine, fig jam, toasted artisanal brioche.", price: "42.00" },
      { category: "Starters", name: "Premium Cheese & Cured Meat Board", desc: "Selection of aged cheeses, San Daniele prosciutto, truffle honey.", price: "55.00" },

      // --- PIZZA ---
      { category: "Pizza", name: "Truffle Mushroom Pizza", desc: "White base, fior di latte, wild forest mushrooms, fresh black truffle shavings.", price: "32.00" },
      { category: "Pizza", name: "Diavola Premium", desc: "San Marzano tomato sauce, spicy Calabrian salami, fresh basil, buffalo mozzarella.", price: "25.00" },
      { category: "Pizza", name: "Margherita Extra", desc: "San Marzano D.O.P., mozzarella di bufala, fresh basil, extra virgin olive oil.", price: "19.00" },
      { category: "Pizza", name: "Prosciutto e Rucola", desc: "Tomato sauce, mozzarella, 24-month aged prosciutto di Parma, fresh arugula, parmesan.", price: "27.00" },

      // --- PASTA & RISOTTO ---
      { category: "Pasta", name: "Lobster Linguine", desc: "Fresh handmade linguine, cherry tomatoes, chili, half-tail of Atlantic lobster.", price: "48.00" },
      { category: "Pasta", name: "Truffle Gnocchi", desc: "Handmade potato gnocchi, rich parmesan cream sauce, topped with fresh black truffles.", price: "36.00" },
      { category: "Pasta", name: "Carbonara Originale", desc: "Spaghetti, crispy guanciale, pecorino romano, egg yolks, black pepper.", price: "24.00" },
      { category: "Pasta", name: "Seafood Saffron Risotto", desc: "Carnaroli rice, tiger prawns, mussels, calamari, infused with Spanish saffron.", price: "39.00" },

      // --- MAINS (GLAVNA JELA) ---
      { category: "Mains", name: "Chilean Sea Bass", desc: "Miso-glazed sea bass filet served on a bed of squid ink risotto.", price: "95.00" },
      { category: "Mains", name: "Duck Breast à l'Orange", desc: "Pan-seared duck breast, sweet potato purée, Grand Marnier orange reduction.", price: "65.00" },
      { category: "Mains", name: "Herb-Crusted Rack of Lamb", desc: "New Zealand lamb chops, mint pesto, roasted garlic puree.", price: "72.00" },
      { category: "Mains", name: "Wild Caught Salmon Teriyaki", desc: "Grilled salmon fillet, homemade teriyaki glaze, wok-tossed bok choy.", price: "45.00" },

      // --- SIDE DISHES (PRILOZI) ---
      { category: "Side Dishes", name: "Truffle Mashed Potatoes", desc: "Creamy Yukon gold potatoes infused with white truffle butter.", price: "12.00" },
      { category: "Side Dishes", name: "Grilled Asparagus", desc: "Jumbo asparagus spears, lemon zest, shaved parmesan.", price: "14.00" },
      { category: "Side Dishes", name: "Sweet Potato Fries", desc: "Crispy sweet potato, rosemary salt, garlic aioli dip.", price: "9.00" },
      { category: "Side Dishes", name: "Creamed Spinach", desc: "Baby spinach, nutmeg, rich cream sauce, parmesan crust.", price: "11.00" },

      // --- DESSERTS (DEZERTI) ---
      { category: "Desserts", name: "24k Gold Chocolate Sphere", desc: "Dark Belgian chocolate filled with hazelnut mousse, melted tableside.", price: "35.00" },
      { category: "Desserts", name: "Tiramisu Authentico", desc: "Mascarpone cream, espresso-soaked ladyfingers, premium cocoa dusting.", price: "18.00" },
      { category: "Desserts", name: "Pistachio Soufflé", desc: "Warm Sicilian pistachio soufflé, served with Madagascar vanilla bean ice cream.", price: "24.00" },
      { category: "Desserts", name: "Classic Crème Brûlée", desc: "Rich vanilla custard base topped with a layer of hardened caramelized sugar.", price: "16.00" },

      // --- DRINKS (PIĆA) ---
      { category: "Drinks", name: "Dom Pérignon Vintage 2013", desc: "Luminous and elegant champagne with notes of citrus and toasted brioche.", price: "450.00" },
      { category: "Drinks", name: "Macallan 18 Year Old", desc: "Single malt scotch whisky, sherry oak cask (50ml).", price: "65.00" },
      { category: "Drinks", name: "Signature Roku Cocktail", desc: "Roku Gin, yuzu extract, smoked rosemary, and a touch of gold dust.", price: "25.00" },
      { category: "Drinks", name: "Freshly Squeezed Orange Juice", desc: "100% organic oranges, cold-pressed.", price: "9.00" },
      { category: "Drinks", name: "Acqua Panna (750ml)", desc: "Natural still mineral water from Tuscany.", price: "8.00" },
      { category: "Drinks", name: "Premium Espresso", desc: "100% Arabica single-origin espresso shot.", price: "4.50" }
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
        <div className="w-12 h-12 border-4 border-[#ff6b00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Grupisanje stavki po kategorijama (da se lepo razdvoje na ekranu)
  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#ff6b00] selection:text-white relative z-50">
      
      {/* MOBILNI KONTEJNER */}
      <div className="w-full max-w-[480px] bg-[#0a0a0a] min-h-screen relative shadow-2xl pb-24 border-x border-[#111]">
        
        {/* POZADINSKI GLOW */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 blur-[80px] opacity-10 pointer-events-none" 
          style={{ backgroundColor: menuData.themeColor }}
        ></div>

        {/* HEADER */}
        <header className="pt-12 pb-8 px-6 text-center relative z-10 border-b border-[#222] bg-gradient-to-b from-black/80 to-transparent">
          <h1 
            className="text-2xl font-black uppercase tracking-widest mb-2 drop-shadow-md"
            style={{ color: menuData.themeColor }}
          >
            {menuData.restaurantName}
          </h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Premium Digital Menu</p>
        </header>

        {/* LISTA KATEGORIJA I STAVKI */}
        <main className="px-4 py-6 space-y-10 relative z-10">
          {Object.keys(groupedItems).map((category, idx) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* NASLOV KATEGORIJE */}
              <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-3 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md py-2 z-20">
                <span className="w-1.5 h-5 rounded-full" style={{ backgroundColor: menuData.themeColor }}></span>
                {category}
              </h2>

              {/* JELA U TOJ KATEGORIJI */}
              <div className="flex flex-col gap-4">
                {groupedItems[category].map((item, itemIdx) => (
                  <div key={itemIdx} className="bg-[#111] p-4 rounded-2xl border border-[#222] shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-zinc-100 font-bold text-sm uppercase leading-tight pr-4 flex items-center gap-1">
                        {category === 'House Special' && <Star size={14} style={{ color: menuData.themeColor }} fill={menuData.themeColor} />}
                        {item.name}
                      </h3>
                      <span className="font-black text-sm shrink-0 drop-shadow-md" style={{ color: menuData.themeColor }}>
                        {menuData.currency} {item.price}
                      </span>
                    </div>
                    {item.desc && (
                      <p className="text-zinc-400 text-xs leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </main>

        {/* BOTTOM NAVIGATION BARIĆ */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-[#222] p-4 flex justify-around items-center z-50">
          <button className="flex flex-col items-center gap-1 opacity-100" style={{ color: menuData.themeColor }}>
            <Utensils size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
            <Coffee size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Call Staff</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors">
            <Info size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Info</span>
          </button>
        </div>

      </div>
    </div>
  );
}
// KRAJ FAJLA: PublicMenuTestQRMenu.jsx