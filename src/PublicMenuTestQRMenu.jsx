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

  // 🔥 GIGANTSKI, MAKSIMALNO NABUDŽENI MENI SA SVIM MOGUĆIM KATEGORIJAMA 🔥
  const FALLBACK_DEMO_MENU = {
    restaurantName: "AURA Fine Dining & Lounge",
    currency: "€",
    themeColor: "#eab308",
    items: [
      // --- HOUSE SPECIALS (NAJSKUPLJE) ---
      { category: "House Special", name: "Golden Wagyu Tomahawk (1.2kg)", desc: "Pure Japanese A5 Wagyu, wrapped in 24k edible gold leaf, smoked tableside.", price: "450.00" },
      { category: "House Special", name: "Royal Beluga Caviar (50g)", desc: "Served on ice with mother-of-pearl spoon, warm blinis, and quail egg yolks.", price: "320.00" },
      { category: "House Special", name: "Emperor's Seafood Tower", desc: "Alaskan king crab legs, Maine lobster, Hokkaido scallops, and fresh oysters.", price: "280.00" },

      // --- SOUPS & BROTHS (SUPE I ČORBE) ---
      { category: "Soups & Broths", name: "Traditional Veal Ragout (Teleća Čorba)", desc: "Slow-cooked creamy veal broth with root vegetables and artisan sour cream.", price: "14.00" },
      { category: "Soups & Broths", name: "Premium Fisherman's Stew (Riblja Čorba)", desc: "Rich and spicy river fish stew, cooked in a traditional copper cauldron.", price: "16.00" },
      { category: "Soups & Broths", name: "Cognac Lobster Bisque", desc: "Velvety smooth Maine lobster soup infused with aged cognac and fresh tarragon.", price: "28.00" },
      { category: "Soups & Broths", name: "French Onion Soup", desc: "Caramelized onions in rich beef broth, topped with melted Gruyère cheese crostini.", price: "18.00" },
      { category: "Soups & Broths", name: "Truffle Consommé", desc: "Clear, rich beef broth infused with shaved black truffles and gold dust.", price: "24.00" },

      // --- SALADS (SALATE) ---
      { category: "Salads", name: "Burrata & Heirloom Tomato", desc: "Fresh Italian burrata, organic heirloom tomatoes, basil pesto, 15-year balsamic glaze.", price: "22.00" },
      { category: "Salads", name: "Caesar Royal with Prawns", desc: "Crisp romaine, grilled tiger prawns, quail eggs, pancetta crisps, parmesan shavings.", price: "26.00" },
      { category: "Salads", name: "Mediterranean Octopus Salad", desc: "Slow-cooked octopus, cherry tomatoes, capers, kalamata olives, lemon vinaigrette.", price: "29.00" },
      { category: "Salads", name: "Wagyu Beef Salad", desc: "Seared Wagyu beef slices, mixed greens, sesame dressing, crispy garlic.", price: "34.00" },

      // --- STARTERS (PREDJELA) ---
      { category: "Starters", name: "Hand-Cut Beef Tartare", desc: "Premium beef tenderloin, quail egg, capers, Dijon mustard, white truffle oil.", price: "45.00" },
      { category: "Starters", name: "Roasted Bone Marrow", desc: "Oven-roasted beef bone marrow with parsley salad and toasted sourdough.", price: "32.00" },
      { category: "Starters", name: "Beef Carpaccio", desc: "Thinly sliced aged beef, wild rocket, shaved truffles, parmesan.", price: "38.00" },
      { category: "Starters", name: "Foie Gras Terrine", desc: "Duck liver terrine, fig jam, toasted artisanal brioche.", price: "42.00" },

      // --- PREMIUM STEAKS & MEAT (BIFTECI I MESO) ---
      { category: "Premium Steaks & Meat", name: "Filet Mignon (250g)", desc: "Center cut, incredibly tender grass-fed beef, served with peppercorn sauce.", price: "75.00" },
      { category: "Premium Steaks & Meat", name: "Black Angus Ribeye (400g)", desc: "Dry-aged for 45 days, rich marbling, served with bone marrow and chimichurri.", price: "85.00" },
      { category: "Premium Steaks & Meat", name: "T-Bone Steak Fiorentina (800g)", desc: "Classic Tuscan cut, grilled over wood fire with olive oil and sea salt.", price: "110.00" },
      { category: "Premium Steaks & Meat", name: "Kobe Beef Striploin (200g)", desc: "Authentic A5 Kobe beef, melt-in-your-mouth texture, soy-wasabi glaze.", price: "190.00" },
      { category: "Premium Steaks & Meat", name: "Herb-Crusted Rack of Lamb", desc: "New Zealand lamb chops, mint pesto, roasted garlic puree.", price: "72.00" },
      { category: "Premium Steaks & Meat", name: "Duck Breast à l'Orange", desc: "Pan-seared duck breast, sweet potato purée, Grand Marnier orange reduction.", price: "65.00" },
      { category: "Premium Steaks & Meat", name: "Iberico Pork Pluma", desc: "Acorn-fed Spanish Iberico pork, grilled medium, apple-cider glaze.", price: "68.00" },

      // --- SEAFOOD & FISH (RIBA I PLODOVI MORA) ---
      { category: "Seafood & Fish", name: "Chilean Sea Bass", desc: "Miso-glazed sea bass filet served on a bed of squid ink risotto.", price: "95.00" },
      { category: "Seafood & Fish", name: "Grilled Branzino (Sea Bass)", desc: "Whole Mediterranean sea bass, grilled with lemon, herbs, and garlic oil.", price: "65.00" },
      { category: "Seafood & Fish", name: "Wild Caught Salmon Teriyaki", desc: "Grilled salmon fillet, homemade teriyaki glaze, wok-tossed bok choy.", price: "45.00" },
      { category: "Seafood & Fish", name: "Hokkaido Scallops", desc: "Pan-seared giant sea scallops with saffron puree and crispy pancetta dust.", price: "55.00" },
      { category: "Seafood & Fish", name: "Bluefin Tuna Steak", desc: "Sesame-crusted sashimi-grade tuna, seared rare, served with ponzu sauce.", price: "78.00" },
      { category: "Seafood & Fish", name: "Grilled Lobster Tail", desc: "Caribbean lobster tail baked with garlic herb butter and fresh lemon.", price: "115.00" },

      // --- PASTA & RISOTTO ---
      { category: "Pasta & Risotto", name: "Lobster Linguine", desc: "Fresh handmade linguine, cherry tomatoes, chili, half-tail of Atlantic lobster.", price: "48.00" },
      { category: "Pasta & Risotto", name: "Truffle Gnocchi", desc: "Handmade potato gnocchi, rich parmesan cream sauce, fresh black truffles.", price: "36.00" },
      { category: "Pasta & Risotto", name: "Wagyu Beef Bolognese", desc: "Slow-cooked Wagyu ragout, handmade pappardelle, aged Parmigiano Reggiano.", price: "42.00" },
      { category: "Pasta & Risotto", name: "Seafood Saffron Risotto", desc: "Carnaroli rice, tiger prawns, mussels, calamari, infused with Spanish saffron.", price: "39.00" },

      // --- PIZZA ---
      { category: "Pizza", name: "Truffle Mushroom Pizza", desc: "White base, fior di latte, wild forest mushrooms, fresh black truffle shavings.", price: "32.00" },
      { category: "Pizza", name: "Diavola Premium", desc: "San Marzano tomato sauce, spicy Calabrian salami, fresh basil, buffalo mozzarella.", price: "25.00" },
      { category: "Pizza", name: "Prosciutto e Rucola", desc: "Tomato sauce, mozzarella, 24-month aged prosciutto di Parma, fresh arugula, parmesan.", price: "27.00" },

      // --- SIDE DISHES (PRILOZI) ---
      { category: "Side Dishes", name: "Truffle Mashed Potatoes", desc: "Creamy Yukon gold potatoes heavily infused with white truffle butter.", price: "12.00" },
      { category: "Side Dishes", name: "Grilled Asparagus", desc: "Jumbo asparagus spears, lemon zest, shaved parmesan, olive oil.", price: "14.00" },
      { category: "Side Dishes", name: "Lobster Mac & Cheese", desc: "Four-cheese blend with chunks of fresh Maine lobster meat and a crispy crust.", price: "22.00" },
      { category: "Side Dishes", name: "Sautéed Wild Mushrooms", desc: "Porcini, shiitake, and chanterelle mushrooms sautéed in garlic butter and thyme.", price: "16.00" },
      { category: "Side Dishes", name: "Sweet Potato Fries", desc: "Crispy sweet potato, rosemary salt, served with garlic aioli dip.", price: "9.00" },
      { category: "Side Dishes", name: "Creamed Spinach", desc: "Baby spinach, nutmeg, rich cream sauce, parmesan crust.", price: "11.00" },

      // --- DESSERTS (DEZERTI) ---
      { category: "Desserts", name: "24k Gold Chocolate Sphere", desc: "Dark Belgian chocolate filled with hazelnut mousse, melted tableside with hot caramel.", price: "35.00" },
      { category: "Desserts", name: "Tiramisu Authentico", desc: "Mascarpone cream, espresso-soaked ladyfingers, premium cocoa dusting.", price: "18.00" },
      { category: "Desserts", name: "Pistachio Soufflé", desc: "Warm Sicilian pistachio soufflé, served with Madagascar vanilla bean ice cream.", price: "24.00" },

      // --- DRINKS (PIĆA) ---
      { category: "Drinks", name: "Dom Pérignon Vintage 2013", desc: "Luminous and elegant champagne with notes of citrus and toasted brioche.", price: "450.00" },
      { category: "Drinks", name: "Louis XIII Cognac (50ml)", desc: "The ultimate luxury cognac, aged up to 100 years in tierçons.", price: "350.00" },
      { category: "Drinks", name: "Macallan 18 Year Old", desc: "Single malt scotch whisky, sherry oak cask (50ml).", price: "65.00" },
      { category: "Drinks", name: "Signature Roku Cocktail", desc: "Roku Gin, yuzu extract, smoked rosemary, and a touch of gold dust.", price: "25.00" },
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
          // Ako baza ne nađe konkretan meni, učitavamo našu gigantsku test listu
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

  // Grupisanje stavki po kategorijama da bi se lepo odvojile na ekranu
  const groupedItems = menuData.items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  // Redosled kategorija (da House Special uvek bude prvi, prilozi pri kraju)
  const categoryOrder = [
    "House Special", 
    "Soups & Broths", 
    "Starters", 
    "Salads", 
    "Premium Steaks & Meat", 
    "Seafood & Fish", 
    "Pizza", 
    "Pasta & Risotto", 
    "Side Dishes", 
    "Desserts", 
    "Drinks"
  ];

  // Sortiramo ključeve prema redosledu
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    let indexA = categoryOrder.indexOf(a);
    let indexB = categoryOrder.indexOf(b);
    if (indexA === -1) indexA = 99; // Ako kategorija nije na listi, ide na kraj
    if (indexB === -1) indexB = 99;
    return indexA - indexB;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex justify-center selection:bg-[#ff6b00] selection:text-white relative z-50">
      
      {/* MOBILNI KONTEJNER (Širina ograničena da izgleda kao aplikacija) */}
      <div className="w-full max-w-[480px] bg-[#0a0a0a] min-h-screen relative shadow-2xl pb-24 border-x border-[#111]">
        
        {/* POZADINSKI GLOW */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 blur-[80px] opacity-10 pointer-events-none" 
          style={{ backgroundColor: menuData.themeColor }}
        ></div>

        {/* HEADER RESTORANA */}
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
          {sortedCategories.map((category, idx) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              {/* NASLOV KATEGORIJE - Zalepljen na vrh dok skroluješ */}
              <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-3 sticky top-0 bg-[#0a0a0a]/90 backdrop-blur-md py-3 z-20 shadow-sm">
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
          <button className="flex flex-col items-center gap-1 opacity-100 transition-colors hover:scale-110" style={{ color: menuData.themeColor }}>
            <Utensils size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors hover:scale-110">
            <Coffee size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Call Staff</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors hover:scale-110">
            <Info size={20} />
            <span className="text-[9px] font-black uppercase tracking-widest">Info</span>
          </button>
        </div>

      </div>
    </div>
  );
}
// KRAJ FAJLA: PublicMenuTestQRMenu.jsx