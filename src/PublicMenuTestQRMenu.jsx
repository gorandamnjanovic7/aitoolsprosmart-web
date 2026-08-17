// POČETAK FAJLA: PublicMenuTestQRMenu.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Utensils, AlertTriangle, Loader2, Crown } from 'lucide-react';

// 🟢 PRELEPI OVAJ BLOK PREKO STAROG "const ITALIAN_ALL_ITEMS" U OBA FAJLA 🟢
// (U fajlovima V8PremiumTestMenu.jsx i PublicMenuTestQRMenu.jsx)

const pastaImgs = [
  "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80"
];
const pizzaImgs = [
  "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80"
];
const risottoImgs = [
  "https://images.unsplash.com/photo-1563245415-321ab9681bc0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80"
];
const meatImgs = [
  "https://images.unsplash.com/photo-1544025162-8353383827d0?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
];
const fishImgs = [
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1559742811-822873691fc8?auto=format&fit=crop&w=600&q=80"
];
const soupImgs = [
  "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1603105037880-880cd4ed214c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80"
];
const antiImgs = [
  "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1608897013039-887f214b985c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?auto=format&fit=crop&w=600&q=80"
];
const vegImgs = [
  "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512621843614-b4a1bfa238c3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80"
];
const sandImgs = [
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=600&q=80"
];
const dessImgs = [
  "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1590137876181-2a5a7e340308?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
];

const ITALIAN_ALL_ITEMS = [
  ...["Spaghetti Carbonara", "Cacio e Pepe", "Amatriciana", "Pasta alla Gricia", "Spaghetti Aglio e Olio", "Pasta al Pesto Genovese", "Tagliatelle al Ragù Bolognese", "Pappardelle al Cinghiale", "Lasagne alla Bolognese", "Lasagne al Pesto", "Penne all’Arrabbiata", "Pasta alla Norma", "Pasta Puttanesca", "Linguine alle Vongole", "Spaghetti ai Frutti di Mare", "Fettuccine al Tartufo", "Orecchiette con Cime di Rapa", "Trofie al Pesto", "Ravioli Ricotta e Spinaci", "Ravioli al Tartufo", "Tortellini in Brodo", "Tortellini alla Panna", "Cannelloni", "Gnocchi al Pomodoro", "Gnocchi al Gorgonzola", "Gnocchi alla Sorrentina"].map((name, idx) => ({ category: "Pasta", name, price: "18.00", desc: `Authentic Italian ${name} prepared with DOP ingredients and cold-pressed olive oil.`, img: pastaImgs[idx % pastaImgs.length], isSignature: false })),
  
  ...["Pizza Margherita", "Pizza Marinara", "Pizza Napoletana", "Pizza Diavola", "Pizza Capricciosa", "Pizza Quattro Formaggi", "Pizza Quattro Stagioni", "Pizza Prosciutto e Funghi", "Pizza Ortolana", "Pizza Bianca", "Pizza al Tartufo", "Calzone", "Focaccia Genovese", "Focaccia Barese", "Focaccia al Rosmarino"].map((name, idx) => ({ category: "Pizza & Focaccia", name, price: "15.00", desc: `Wood-fired ${name} baked to perfection with a crisp, airy crust.`, img: pizzaImgs[idx % pizzaImgs.length], isSignature: false })),
  
  ...["Risotto alla Milanese", "Risotto ai Funghi Porcini", "Risotto al Tartufo", "Risotto ai Frutti di Mare", "Risotto al Limone", "Risotto alla Zucca", "Risotto al Radicchio", "Risotto al Gorgonzola", "Risi e Bisi", "Arancini Siciliani", "Supplì"].map((name, idx) => ({ category: "Risotto & Rice Dishes", name, price: "22.00", desc: `Creamy and rich ${name}, a comforting Italian classic.`, img: risottoImgs[idx % risottoImgs.length], isSignature: false })),
  
  ...["Ossobuco alla Milanese", "Saltimbocca alla Romana", "Cotoletta alla Milanese", "Pollo alla Cacciatora", "Vitello Tonnato", "Brasato al Barolo", "Bistecca alla Fiorentina", "Porchetta", "Polpette al Sugo", "Involtini di Carne", "Spezzatino di Manzo", "Abbacchio alla Romana", "Salsiccia e Peperoni"].map((name, idx) => ({ category: "Meat Dishes", name, price: "32.00", desc: `Tender, slow-cooked ${name} with signature Italian herbs and wine.`, img: meatImgs[idx % meatImgs.length], isSignature: false })),
  
  ...["Branzino al Forno", "Orata al Forno", "Fritto Misto di Mare", "Calamari Fritti", "Polpo alla Griglia", "Polpo e Patate", "Seppie al Nero", "Baccalà alla Vicentina", "Baccalà Mantecato", "Zuppa di Pesce", "Cacciucco", "Impepata di Cozze", "Cozze alla Marinara", "Gamberi all’Aglio"].map((name, idx) => ({ category: "Fish & Seafood", name, price: "35.00", desc: `Fresh Mediterranean ${name}, bringing the taste of the Italian coast to your table.`, img: fishImgs[idx % fishImgs.length], isSignature: false })),
  
  ...["Minestrone", "Ribollita", "Pasta e Fagioli", "Pasta e Ceci", "Zuppa Toscana", "Acquacotta", "Stracciatella alla Romana", "Pappa al Pomodoro", "Brodo con Tortellini", "Zuppa di Lenticchie"].map((name, idx) => ({ category: "Soups & Traditional", name, price: "14.00", desc: `Warm, hearty, and authentic rustic ${name}.`, img: soupImgs[idx % soupImgs.length], isSignature: false })),
  
  ...["Bruschetta al Pomodoro", "Bruschetta ai Funghi", "Caprese", "Prosciutto e Melone", "Prosciutto di Parma con Burrata", "Burrata con Pomodorini", "Carpaccio di Manzo", "Carpaccio di Tonno", "Vitello Tonnato", "Crostini Toscani", "Olive Ascolane", "Mozzarella in Carrozza", "Fiori di Zucca Fritti", "Melanzane alla Parmigiana", "Arancini"].map((name, idx) => ({ category: "Appetizers & Antipasti", name, price: "16.00", desc: `Perfect Italian starter: ${name} served fresh with the finest ingredients.`, img: antiImgs[idx % antiImgs.length], isSignature: false })),
  
  ...["Parmigiana di Melanzane", "Caponata Siciliana", "Peperonata", "Carciofi alla Romana", "Carciofi alla Giudia", "Verdure Grigliate", "Patate al Rosmarino", "Zucchine alla Scapece", "Fagioli all’Uccelletto", "Insalata Panzanella"].map((name, idx) => ({ category: "Vegetables & Side Dishes", name, price: "12.00", desc: `Fresh, seasonal ${name}, a perfect accompaniment.`, img: vegImgs[idx % vegImgs.length], isSignature: false })),
  
  ...["Panino con Porchetta", "Panino Caprese", "Panino Prosciutto e Mozzarella", "Piadina Romagnola", "Tramezzini", "Lampredotto", "Panzerotti", "Pizza al Taglio", "Sfincione Siciliano", "Focaccia Ripiena"].map((name, idx) => ({ category: "Sandwiches & Street Food", name, price: "10.00", desc: `Delicious, authentic Italian street food: ${name}.`, img: sandImgs[idx % sandImgs.length], isSignature: false })),
  
  ...["Tiramisù", "Panna Cotta", "Cannoli Siciliani", "Cassata Siciliana", "Sfogliatella", "Babà Napoletano", "Zeppole", "Bomboloni", "Crostata", "Torta Caprese", "Torta della Nonna", "Zabaione", "Semifreddo", "Affogato", "Gelato", "Granita Siciliana", "Amaretti", "Cantucci", "Panettone", "Pandoro", "Torrone", "Ricciarelli"].map((name, idx) => ({ category: "Desserts", name, price: "12.00", desc: `Sweet, traditional Italian ${name} to perfectly finish your meal.`, img: dessImgs[idx % dessImgs.length], isSignature: false }))
];

ITALIAN_ALL_ITEMS[0].isSignature = true; 
ITALIAN_ALL_ITEMS[26].isSignature = true; 
ITALIAN_ALL_ITEMS[124].isSignature = true;
// 🟢 KRAJ BLOKA KOJI SE MENJA 🟢

ITALIAN_ALL_ITEMS[0].isSignature = true; 
ITALIAN_ALL_ITEMS[26].isSignature = true; 
ITALIAN_ALL_ITEMS[124].isSignature = true;

export default function PublicMenuTestQRMenu() {
  const { menuId } = useParams();
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchMenu = async () => {
      try {
        // 🔥 FALLBACK 1: AURA (Ako baci grešku pri generisanju glavnog)
        if (menuId === "TEST-QR-PREVIEW-123") {
          setTimeout(() => {
            setMenuData({
              restaurantName: "AURA Fine Dining",
              themeColor: "#FF8C00",
              currency: "€",
              items: [
                { category: "Breakfast", name: "Royal Eggs Benedict", price: "24.00", desc: "Perfectly poached heritage eggs, Norwegian smoked salmon.", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80" },
                { category: "Main Courses", name: "Wagyu Tomahawk", price: "150.00", desc: "Premium A5 Wagyu beef, grilled over open flame.", img: "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?auto=format&fit=crop&w=800&q=80" }
              ]
            });
            setLoading(false);
          }, 800);
          return;
        }

        // 🔥 FALLBACK 2: ITALIAN DEMO (146 JELA) 🔥
        if (menuId === "TEST-QR-ITALIAN-123") {
          setTimeout(() => {
            setMenuData({
              restaurantName: "Ristorante L'Antica Ricetta",
              themeColor: "#eab308", // Zlatna
              currency: "€",
              items: ITALIAN_ALL_ITEMS
            });
            setLoading(false);
          }, 800);
          return;
        }

        const docRef = doc(db, 'v8_qr_menus', menuId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setMenuData(docSnap.data());
        } else {
          setError(true);
        }
      } catch (err) {
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

      <div className="mt-8 w-full flex flex-col items-center justify-center opacity-40">
        <Crown size={16} className="text-zinc-500 mb-2" />
        <span className="text-[9px] font-black tracking-[0.2em] text-zinc-500 uppercase">Powered by V8 Engine</span>
      </div>
    </div>
  );
}
// KRAJ FAJLA: PublicMenuTestQRMenu.jsxs