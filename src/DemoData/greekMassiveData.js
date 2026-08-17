// POČETAK FAJLA: src/DemoData/greekMassiveData.js

// 🔥 GRČKE SLIKE (Unsplash Premium) 🔥
const gyrosImgs = [
  "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
];
const traditionalImgs = [
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80"
];
const mezeImgs = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1548943487-a2e4b43b485f?auto=format&fit=crop&w=600&q=80"
];
const seafoodImgs = [
  "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"
];
const saladImgs = [
  "https://images.unsplash.com/photo-1512621843614-b4a1bfa238c3?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1599557456721-e73082531a7b?auto=format&fit=crop&w=600&q=80"
];
const dessertImgs = [
  "https://images.unsplash.com/photo-1519671282429-b4b66002f232?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80"
];

// 🔥 BAZE JELA PO KATEGORIJAMA (Grčka kuhinja) 🔥
const GYROS_SOUVLAKI = ["Gyros", "Chicken Gyros", "Pork Gyros", "Lamb Gyros", "Gyros Pita", "Souvlaki", "Chicken Souvlaki", "Pork Souvlaki", "Lamb Souvlaki", "Beef Souvlaki", "Souvlaki Pita", "Kalamaki", "Kontosouvli", "Pita Gyros", "Gyros Wrap", "Souvlaki Wrap", "Greek Chicken Wrap", "Greek Lamb Wrap", "Greek Pork Wrap", "Gyros Plate", "Souvlaki Plate", "Mixed Grill", "Greek Mixed Grill", "Meat Platter", "Loukaniko Sandwich", "Greek Sausage Pita", "Keftedes Pita", "Bifteki Pita", "Halloumi Pita", "Falafel Pita Greek Style", "Veggie Pita", "Greek Loaded Fries", "Gyros Loaded Fries", "Souvlaki Loaded Fries", "Feta Loaded Fries", "Gyros Sandwich", "Souvlaki Sandwich"];

const TRADITIONAL_MAINS = ["Moussaka", "Pastitsio", "Papoutsakia", "Gemista", "Lahanodolmades", "Giouvetsi", "Stifado", "Beef Stifado", "Rabbit Stifado", "Kleftiko", "Lamb Kleftiko", "Lamb Fricassée", "Arni Lemonato", "Arni Sto Fourno", "Lamb with Potatoes", "Kokkinisto", "Moschari Kokkinisto", "Sofrito", "Pastitsada", "Bekri Meze", "Tigania", "Pork Tigania", "Chicken Tigania", "Soutzoukaki", "Kokoretsi", "Gardoumba", "Exohiko", "Apaki", "Syglino", "Bifteki", "Bifteki Gemisto", "Keftedes", "Soutzoukakia", "Loukaniko", "Spetsofai", "Greek Meatballs", "Keftedakia", "Fried Keftedes", "Grilled Bifteki", "Feta-Stuffed Bifteki", "Lamb Chops", "Paidakia", "Grilled Pork Chops", "Grilled Chicken", "Lemon Chicken", "Chicken with Potatoes", "Kotopoulo Lemonato", "Kotopoulo Sto Fourno", "Roast Lamb", "Roast Goat", "Katsiki Sto Fourno", "Pork with Celery", "Pork Lemonato", "Pork with Leeks", "Makaronia me Kima", "Greek Spaghetti with Meat Sauce", "Gamopilafo", "Antikristo", "Cretan Lamb"];

const MEZE_STARTERS = ["Saganaki", "Cheese Saganaki", "Feta Saganaki", "Halloumi", "Grilled Halloumi", "Feta Cheese", "Baked Feta", "Feta Psiti", "Bouyiourdi", "Tirokafteri", "Tzatziki", "Taramosalata", "Melitzanosalata", "Skordalia", "Fava", "Hummus Greek Style", "Kopanisti", "Tyrosalata", "Htipiti", "Olive Tapenade", "Greek Olives", "Kalamata Olives", "Marinated Olives", "Dolmades", "Dolmadakia", "Fried Cheese", "Graviera Saganaki", "Kefalotyri Saganaki", "Manouri Cheese", "Graviera Cheese", "Kefalograviera", "Kasseri", "Mizithra", "Anthotyro", "Metsovone", "Greek Meze", "Feta Meze", "Mezze Platter", "Cheese Croquettes", "Tirokroketes", "Potato Croquettes", "Patatokeftedes", "Kolokithokeftedes", "Tomatokeftedes", "Revithokeftedes", "Fava Fritters", "Pita Bread", "Greek Pita", "Pita with Tzatziki", "Pita with Feta", "Greek Nachos", "Pita Chips with Tzatziki", "Fried Pita Chips"];

const SEAFOOD = ["Shrimp Saganaki", "Mussels Saganaki", "Fried Calamari", "Grilled Calamari", "Stuffed Calamari", "Octopus", "Grilled Octopus", "Octopus in Vinegar", "Octopus Stifado", "Fried Sardines", "Grilled Sardines", "Marinated Anchovies", "Gavros Marinatos", "Fried Anchovies", "Grilled Sea Bream", "Grilled Sea Bass", "Lavraki", "Tsipoura", "Swordfish Souvlaki", "Grilled Swordfish", "Fried Cod", "Bakaliaros Skordalia", "Fried Red Mullet", "Barbouni", "Grilled Shrimp", "Fried Shrimp", "Shrimp with Feta", "Garides Saganaki", "Grilled Prawns", "Mussels", "Steamed Mussels", "Fried Mussels", "Midia Saganaki", "Seafood Giouvetsi", "Seafood Orzo", "Seafood Pasta", "Lobster Pasta", "Astakomakaronada", "Shrimp Kritharoto", "Seafood Meze"];

const SOUPS_PIES_BAKERY = ["Tiropita", "Spanakopita", "Spanakotiropita", "Kotopita", "Kreatopita", "Prasopita", "Hortopita", "Manitaropita", "Bougatsa", "Bougatsa with Cheese", "Fasolada", "Avgolemono Soup", "Chicken Avgolemono", "Magiritsa", "Psarosoupa", "Kakavia", "Trahana Soup", "Revithosoupa", "Fakies", "Lentil Soup", "Bean Soup", "Chickpea Soup", "Giouvarlakia", "Youvarlakia Avgolemono", "Koulouri Thessalonikis", "Ladenia", "Eliopita", "Olive Bread", "Feta Bread", "Psomi", "Lagana", "Daktyla Bread", "Paximadi", "Barley Rusks", "Sfakianopita", "Kalitsounia", "Cheese Kalitsounia", "Mizithropita", "Cretan Cheese Pie", "Cretan Meat Pie"];

const SALADS_SIDES = ["Greek Salad", "Horiatiki", "Dakos", "Cretan Dakos", "Maroulosalata", "Horta", "Beetroot Salad", "Cabbage Salad", "Politiki Salata", "Potato Salad", "Fasolakia Salad", "Lentil Salad", "Chickpea Salad", "Fasolakia Ladera", "Bamies", "Briam", "Imam Bayildi Greek Style", "Gigantes Plaki", "Revithada", "Arakas Laderos", "Spanakorizo", "Lahanorizo", "Prasorizo", "Gemista with Rice", "Stuffed Tomatoes", "Stuffed Peppers", "Stuffed Zucchini", "Kolokithakia Gemista", "Eggplant Imam", "Melitzanes Papoutsakia", "Fried Eggplant", "Grilled Eggplant", "Fried Zucchini", "Fried Peppers", "Florina Peppers", "Stuffed Florina Peppers", "Grilled Peppers with Feta", "Patates Tiganites", "Greek Fries", "Feta Fries", "Oregano Fries", "Lemon Potatoes", "Patates Lemonates", "Roasted Greek Potatoes", "Potato Saganaki"];

const DESSERTS = ["Greek Yogurt", "Yogurt with Honey", "Yogurt with Honey and Walnuts", "Loukoumades", "Baklava", "Galaktoboureko", "Kataifi", "Portokalopita", "Karidopita", "Ravani", "Revani", "Samali", "Melomakarona", "Kourabiedes", "Diples", "Amygdalota", "Halva", "Semolina Halva", "Pasteli", "Spoon Sweets", "Glyko Koutaliou", "Rizogalo", "Greek Rice Pudding", "Ekmek Kataifi", "Karydopita", "Moustalevria", "Fanouropita", "Vasilopita", "Tsoureki", "Lazarakia", "Koulourakia", "Finikia", "Loukoumi", "Mandolato", "Sesame Bars", "Honey Puffs", "Greek Pancakes", "Tiganites", "Sweet Kalitsounia"];

const RAW_GREEK_ITEMS = [
  ...GYROS_SOUVLAKI.map((name, idx) => ({ category: "Gyros, Souvlaki & Pita", name, price: "6.50", desc: `Authentic street-style ${name}, wrapped in warm pita with fresh tzatziki.`, img: gyrosImgs[idx % gyrosImgs.length], isSignature: idx === 0 || idx === 5 })),
  ...TRADITIONAL_MAINS.map((name, idx) => ({ category: "Traditional Mains & Grill", name, price: "16.00", desc: `Classic slow-cooked ${name}, bringing the true taste of Greek heritage.`, img: traditionalImgs[idx % traditionalImgs.length], isSignature: name === "Moussaka" || name === "Pastitsio" })),
  ...MEZE_STARTERS.map((name, idx) => ({ category: "Meze, Dips & Starters", name, price: "8.00", desc: `Flavorful ${name}, perfect for sharing with fresh pita bread.`, img: mezeImgs[idx % mezeImgs.length], isSignature: false })),
  ...SEAFOOD.map((name, idx) => ({ category: "Aegean Seafood", name, price: "22.00", desc: `Freshly caught Mediterranean ${name}, grilled with lemon and olive oil.`, img: seafoodImgs[idx % seafoodImgs.length], isSignature: name === "Grilled Octopus" })),
  ...SOUPS_PIES_BAKERY.map((name, idx) => ({ category: "Pies, Soups & Bakery", name, price: "7.50", desc: `Handmade traditional ${name}, baked fresh every morning.`, img: saladImgs[0], isSignature: false })),
  ...SALADS_SIDES.map((name, idx) => ({ category: "Greek Salads & Sides", name, price: "9.00", desc: `Crisp, refreshing ${name} topped with extra virgin olive oil and oregano.`, img: saladImgs[idx % saladImgs.length], isSignature: name === "Greek Salad" })),
  ...DESSERTS.map((name, idx) => ({ category: "Greek Sweets & Yogurt", name, price: "6.00", desc: `Traditional sweet ${name}, soaked in rich honey syrup.`, img: dessertImgs[idx % dessertImgs.length], isSignature: name === "Baklava" || name === "Loukoumades" }))
];

// Eksprotujemo za ostatak sajta
export const GREEK_MASSIVE_MENU = {
  restaurantName: "Η Χρυσή Ελιά (The Golden Olive)",
  themeColor: "#3b82f6", // V8 Blue
  currency: "€",
  items: RAW_GREEK_ITEMS
};

// KRAJ FAJLA: src/DemoData/greekMassiveData.js