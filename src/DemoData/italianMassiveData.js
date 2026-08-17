// POČETAK FAJLA: src/DemoData/italianMassiveData.js

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

const RAW_ITEMS = [
  ...["Spaghetti Carbonara", "Cacio e Pepe", "Amatriciana", "Pasta alla Gricia", "Spaghetti Aglio e Olio", "Pasta al Pesto Genovese", "Tagliatelle al Ragù Bolognese", "Pappardelle al Cinghiale", "Lasagne alla Bolognese", "Lasagne al Pesto", "Penne all’Arrabbiata", "Pasta alla Norma", "Pasta Puttanesca", "Linguine alle Vongole", "Spaghetti ai Frutti di Mare", "Fettuccine al Tartufo", "Orecchiette con Cime di Rapa", "Trofie al Pesto", "Ravioli Ricotta e Spinaci", "Ravioli al Tartufo", "Tortellini in Brodo", "Tortellini alla Panna", "Cannelloni", "Gnocchi al Pomodoro", "Gnocchi al Gorgonzola", "Gnocchi alla Sorrentina"].map((name, idx) => ({ category: "Pasta", name, price: "18.00", desc: `Authentic Italian ${name} prepared with DOP ingredients, cold-pressed olive oil, and handmade pasta.`, img: pastaImgs[idx % pastaImgs.length], isSignature: false })),
  
  ...["Pizza Margherita", "Pizza Marinara", "Pizza Napoletana", "Pizza Diavola", "Pizza Capricciosa", "Pizza Quattro Formaggi", "Pizza Quattro Stagioni", "Pizza Prosciutto e Funghi", "Pizza Ortolana", "Pizza Bianca", "Pizza al Tartufo", "Calzone", "Focaccia Genovese", "Focaccia Barese", "Focaccia al Rosmarino"].map((name, idx) => ({ category: "Pizza & Focaccia", name, price: "15.00", desc: `Wood-fired ${name} baked to perfection at 400°C with a crisp, airy crust and premium toppings.`, img: pizzaImgs[idx % pizzaImgs.length], isSignature: false })),
  
  ...["Risotto alla Milanese", "Risotto ai Funghi Porcini", "Risotto al Tartufo", "Risotto ai Frutti di Mare", "Risotto al Limone", "Risotto alla Zucca", "Risotto al Radicchio", "Risotto al Gorgonzola", "Risi e Bisi", "Arancini Siciliani", "Supplì"].map((name, idx) => ({ category: "Risotto & Rice Dishes", name, price: "22.00", desc: `Creamy and rich ${name}, a comforting Italian classic slowly simmered in rich broth.`, img: risottoImgs[idx % risottoImgs.length], isSignature: false })),
  
  ...["Ossobuco alla Milanese", "Saltimbocca alla Romana", "Cotoletta alla Milanese", "Pollo alla Cacciatora", "Vitello Tonnato", "Brasato al Barolo", "Bistecca alla Fiorentina", "Porchetta", "Polpette al Sugo", "Involtini di Carne", "Spezzatino di Manzo", "Abbacchio alla Romana", "Salsiccia e Peperoni"].map((name, idx) => ({ category: "Meat Dishes", name, price: "32.00", desc: `Tender, slow-cooked ${name} with signature Italian herbs, garlic, and fine wine reduction.`, img: meatImgs[idx % meatImgs.length], isSignature: false })),
  
  ...["Branzino al Forno", "Orata al Forno", "Fritto Misto di Mare", "Calamari Fritti", "Polpo alla Griglia", "Polpo e Patate", "Seppie al Nero", "Baccalà alla Vicentina", "Baccalà Mantecato", "Zuppa di Pesce", "Cacciucco", "Impepata di Cozze", "Cozze alla Marinara", "Gamberi all’Aglio"].map((name, idx) => ({ category: "Fish & Seafood", name, price: "35.00", desc: `Fresh Mediterranean ${name}, bringing the pure taste of the Italian coast directly to your table.`, img: fishImgs[idx % fishImgs.length], isSignature: false })),
  
  ...["Minestrone", "Ribollita", "Pasta e Fagioli", "Pasta e Ceci", "Zuppa Toscana", "Acquacotta", "Stracciatella alla Romana", "Pappa al Pomodoro", "Brodo con Tortellini", "Zuppa di Lenticchie"].map((name, idx) => ({ category: "Soups & Traditional", name, price: "14.00", desc: `Warm, hearty, and authentic rustic ${name} made from generations-old family recipes.`, img: soupImgs[idx % soupImgs.length], isSignature: false })),
  
  ...["Bruschetta al Pomodoro", "Bruschetta ai Funghi", "Caprese", "Prosciutto e Melone", "Prosciutto di Parma con Burrata", "Burrata con Pomodorini", "Carpaccio di Manzo", "Carpaccio di Tonno", "Vitello Tonnato", "Crostini Toscani", "Olive Ascolane", "Mozzarella in Carrozza", "Fiori di Zucca Fritti", "Melanzane alla Parmigiana", "Arancini"].map((name, idx) => ({ category: "Appetizers & Antipasti", name, price: "16.00", desc: `The perfect Italian starter: ${name} served fresh with the absolute finest local ingredients.`, img: antiImgs[idx % antiImgs.length], isSignature: false })),
  
  ...["Parmigiana di Melanzane", "Caponata Siciliana", "Peperonata", "Carciofi alla Romana", "Carciofi alla Giudia", "Verdure Grigliate", "Patate al Rosmarino", "Zucchine alla Scapece", "Fagioli all’Uccelletto", "Insalata Panzanella"].map((name, idx) => ({ category: "Vegetables & Side Dishes", name, price: "12.00", desc: `Fresh, seasonal ${name}, carefully seasoned and roasted to be the perfect accompaniment.`, img: vegImgs[idx % vegImgs.length], isSignature: false })),
  
  ...["Panino con Porchetta", "Panino Caprese", "Panino Prosciutto e Mozzarella", "Piadina Romagnola", "Tramezzini", "Lampredotto", "Panzerotti", "Pizza al Taglio", "Sfincione Siciliano", "Focaccia Ripiena"].map((name, idx) => ({ category: "Sandwiches & Street Food", name, price: "10.00", desc: `Delicious, authentic Italian street food: ${name} prepared fast but with zero compromises on taste.`, img: sandImgs[idx % sandImgs.length], isSignature: false })),
  
  ...["Tiramisù", "Panna Cotta", "Cannoli Siciliani", "Cassata Siciliana", "Sfogliatella", "Babà Napoletano", "Zeppole", "Bomboloni", "Crostata", "Torta Caprese", "Torta della Nonna", "Zabaione", "Semifreddo", "Affogato", "Gelato", "Granita Siciliana", "Amaretti", "Cantucci", "Panettone", "Pandoro", "Torrone", "Ricciarelli"].map((name, idx) => ({ category: "Desserts", name, price: "12.00", desc: `Sweet, traditional Italian ${name} crafted to perfectly finish your dining experience.`, img: dessImgs[idx % dessImgs.length], isSignature: false }))
];

// Obeležavamo signature jela (zvezdice)
RAW_ITEMS[0].isSignature = true; // Carbonara
RAW_ITEMS[26].isSignature = true; // Margherita
RAW_ITEMS[124].isSignature = true; // Tiramisu

// Exportujemo spreman objekat koji ćemo uvoziti u React komponente
export const ITALIAN_MASSIVE_MENU = {
  restaurantName: "Ristorante L'Antica Ricetta",
  themeColor: "#eab308", // Zlatna boja
  currency: "€",
  items: RAW_ITEMS
};
// KRAJ FAJLA: src/DemoData/italianMassiveData.js