// POČETAK FAJLA: src/DemoData/greekMassiveData.js
import { getImageForDish } from '../data/v8SmartImageHelper.js';

export const GREEK_MASSIVE_MENU = { 
  restaurantName: "Η Χρυσή Ελιά (The Golden Olive)", 
  themeColor: "#3b82f6", 
  currency: "€", 
  items: [
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Moussaka (Μουσακάς)", 
      price: "18.00", 
      desc: "The undisputed crown jewel of Greek comfort food. Layers of thinly sliced, lightly pan-fried eggplant and potatoes, submerged in a rich, slow-simmered beef and lamb ragù laced with cinnamon and cloves. All of this is blanketed by a towering, golden, nutmeg-scented crust of creamy béchamel sauce.", 
      img: getImageForDish("Moussaka (Μουσακάς)"), 
      isSignature: true 
    },
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Souvlaki Skewers (Σουβλάκι)", 
      price: "14.50", 
      desc: "Premium cuts of tender pork or chicken, marinated overnight in a highly aromatic emulsion of extra virgin olive oil, wild mountain oregano, and fresh lemon juice. Char-grilled on skewers to lock in the smoky flavor. Served with warm, grilled pita bread and a generous side of our house-made tzatziki.", 
      img: getImageForDish("Souvlaki Skewers (Σουβλάκι)"), 
      isSignature: true 
    },
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Gyros Portion (Γύρος Μερίδα)", 
      price: "16.00", 
      desc: "A true Athenian street food classic elevated to a restaurant experience. Thin, crispy shavings of slow spit-roasted meat piled high on a platter. Accompanied by fresh sliced tomatoes, red onions, golden fries, warm pita bread, and a massive dollop of cooling yogurt tzatziki.", 
      img: getImageForDish("Gyros Portion (Γύρος Μερίδα)"), 
      isSignature: false 
    },
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Lamb Kleftiko (Κλέφτικο)", 
      price: "24.00", 
      desc: "Translating to 'thief's lamb', this historic dish features a rustic, bone-in leg of lamb sealed in parchment paper with garlic, potatoes, tomatoes, and herbs. It is slow-roasted for hours until the meat is meltingly tender, falling off the bone, and heavily infused with its own rich, enclosed juices.", 
      img: getImageForDish("Lamb Kleftiko (Κλέφτικο)"), 
      isSignature: true 
    },
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Paidakia (Παιδάκια)", 
      price: "26.00", 
      desc: "A meat lover's dream. Beautifully trimmed, tender baby lamb chops, marinated heavily in olive oil, mustard, lemon, and crushed garlic. They are flash-grilled over a roaring open flame to achieve a perfect, smoky char on the outside while remaining incredibly juicy and pink on the inside.", 
      img: getImageForDish("Paidakia (Παιδάκια)"), 
      isSignature: true 
    },
    { 
      category: "Glavna Jela (Main Courses)", 
      name: "Pastitsio (Παστίτσιο)", 
      price: "17.00", 
      desc: "The Greek answer to lasagna. A hearty, baked pasta dish featuring long tubular noodles mixed with feta cheese, layered with an intensely savory, cinnamon-spiced ground beef and tomato sauce, and topped with an incredibly thick and fluffy layer of baked béchamel.", 
      img: getImageForDish("Pastitsio (Παστίτσιο)"), 
      isSignature: false 
    },
    { 
      category: "Plodovi Mora (Seafood)", 
      name: "Grilled Octopus (Χταπόδι στη Σχάρα)", 
      price: "22.00", 
      desc: "A thick, meaty octopus tentacle, sun-dried and slowly braised in wine to achieve a buttery tenderness, then charred violently over open wood flames. Dressed with the utmost simplicity: freshly squeezed lemon juice, robust olive oil, and a sprinkle of wild oregano.", 
      img: getImageForDish("Grilled Octopus (Χταπόδι στη Σχάρα)"), 
      isSignature: true 
    },
    { 
      category: "Plodovi Mora (Seafood)", 
      name: "Fried Calamari (Καλαμαράκια Τηγανητά)", 
      price: "16.50", 
      desc: "The ultimate seaside appetizer. Fresh, thick rings of squid, lightly dusted in seasoned semolina flour and flash-fried in pure oil to a perfect, golden, and shattering crunch. Served piping hot with a wedge of fresh lemon to cut through the richness.", 
      img: getImageForDish("Fried Calamari (Καλαμαράκια Τηγανητά)"), 
      isSignature: false 
    },
    { 
      category: "Plodovi Mora (Seafood)", 
      name: "Shrimp Saganaki (Γαρίδες Σαγανάκι)", 
      price: "19.00", 
      desc: "Plump, sweet Aegean shrimp simmered rapidly in a robust, garlicky, and slightly spicy tomato sauce with a splash of anise-flavored Ouzo. The dish is topped with large chunks of feta cheese that melt into the sauce, creating an irresistible, tangy, and rich seafood stew.", 
      img: getImageForDish("Shrimp Saganaki (Γαρίδες Σαγανάκι)"), 
      isSignature: true 
    },
    { 
      category: "Plodovi Mora (Seafood)", 
      name: "Grilled Sea Bream (Τσιπούρα Σχάρας)", 
      price: "25.00", 
      desc: "A whole, pristine Mediterranean Sea Bream (Tsipoura), prepared with total respect for the ingredient. Scaled, scored, and grilled whole over hot coals until the skin blisters. Served drizzled with 'latholemono'—a traditional whisked dressing of olive oil and lemon.", 
      img: getImageForDish("Grilled Sea Bream (Τσιπούρα Σχάρας)"), 
      isSignature: false 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Horiatiki - Greek Salad (Χωριάτικη Σαλάτα)", 
      price: "12.00", 
      desc: "The absolute essence of a Mediterranean summer. Plump, sun-ripened tomatoes, crisp cucumbers, sharp red onions, and briny Kalamata olives, crowned with a massive block of authentic barrel-aged feta cheese. Drizzled heavily with robust, grassy Peloponnesian olive oil.", 
      img: getImageForDish("Horiatiki - Greek Salad (Χωριάτικη Σαλάτα)"), 
      isSignature: true 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Tzatziki (Τζατζίκι)", 
      price: "7.00", 
      desc: "Our legendary house-made yogurt dip, astonishingly thick and creamy. Prepared exclusively with strained Greek yogurt, grated cucumber squeezed completely dry, pungent raw garlic, a splash of white vinegar, and a drizzle of fine olive oil. Served with warm pita.", 
      img: getImageForDish("Tzatziki (Τζατζίκι)"), 
      isSignature: false 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Spanakopita (Σπανακόπιτα)", 
      price: "10.00", 
      desc: "A beautifully flaky and buttery phyllo pastry pie, stuffed with a vibrant, savory mixture of fresh spinach, leeks, dill, and crumbly, salty feta cheese. Baked until shatteringly crisp on the outside, leaving the interior rich and herbaceous.", 
      img: getImageForDish("Spanakopita (Σπανακόπιτα)"), 
      isSignature: true 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Cheese Saganaki (Τυρί Σαγανάκι)", 
      price: "9.50", 
      desc: "A thick slab of Kefalotyri or Graviera cheese, dredged in flour and pan-fried in a small, heavy skillet until it forms a deeply browned, crispy crust while the inside becomes a molten, gooey delight. Flambéed with brandy and extinguished with fresh lemon juice.", 
      img: getImageForDish("Cheese Saganaki (Τυρί Σαγανάκι)"), 
      isSignature: true 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Dolmades (Ντολμαδάκια)", 
      price: "8.50", 
      desc: "Tender, young grapevine leaves meticulously hand-rolled around a fragrant, savory filling of short-grain rice, pine nuts, fresh dill, mint, and lemon juice. Served chilled or at room temperature with a side of creamy yogurt for dipping.", 
      img: getImageForDish("Dolmades (Ντολμαδάκια)"), 
      isSignature: false 
    },
    { 
      category: "Predjela i Salate (Starters)", 
      name: "Feta & Olives (Φέτα και Ελιές)", 
      price: "8.00", 
      desc: "A simple yet profoundly satisfying start to the meal. A generous slab of premium, crumbly sheep's milk Feta cheese accompanied by an assortment of marinated Kalamata and green olives, drenched in extra virgin olive oil and dusted with oregano.", 
      img: getImageForDish("Feta & Olives (Φέτα και Ελιές)"), 
      isSignature: false 
    },
    { 
      category: "Dezerti (Desserts)", 
      name: "Baklava (Μπακλαβάς)", 
      price: "9.00", 
      desc: "The ultimate Mediterranean pastry. Countless layers of paper-thin phyllo dough, separated by melted butter and a thick, spiced layer of crushed walnuts and pistachios. Baked until deeply golden and immediately drenched in a fragrant honey, cinnamon, and clove syrup.", 
      img: getImageForDish("Baklava (Μπακλαβάς)"), 
      isSignature: true 
    },
    { 
      category: "Dezerti (Desserts)", 
      name: "Loukoumades (Λουκουμάδες)", 
      price: "8.50", 
      desc: "Golden, bite-sized Greek doughnuts, deep-fried until incredibly crispy on the outside and airy inside. They are served piping hot, swimming in a generous pool of wild Greek thyme honey, and heavily dusted with cinnamon and crushed walnuts.", 
      img: getImageForDish("Loukoumades (Λουκουμάδες)"), 
      isSignature: true 
    },
    { 
      category: "Dezerti (Desserts)", 
      name: "Galaktoboureko (Γαλακτομπούρεκο)", 
      price: "9.50", 
      desc: "An absolutely decadent dessert. A thick, remarkably creamy, and rich semolina-based custard, flavored with a hint of lemon and vanilla, baked between layers of crispy, buttered phyllo pastry. Bathed in a sweet, citrusy syrup after baking.", 
      img: getImageForDish("Galaktoboureko (Γαλακτομπούρεκο)"), 
      isSignature: false 
    },
    { 
      category: "Kafa i Pića (Beverages)", 
      name: "Greek Coffee (Ελληνικός Καφές)", 
      price: "4.00", 
      desc: "A strong, unfiltered coffee brewed slowly in a traditional copper pot (briki) over hot sand. Served thick and muddy with a rich, velvety foam (kaimaki) on top. A potent and intensely aromatic conclusion to any Greek feast.", 
      img: getImageForDish("Greek Coffee (Ελληνικός Καφές)"), 
      isSignature: true 
    },
    { 
      category: "Kafa i Pića (Beverages)", 
      name: "Frappé (Φραπέ)", 
      price: "5.50", 
      desc: "The iconic, original Greek summer coffee. A vigorously shaken, intensely frothy iced coffee beverage made from instant coffee, water, and sugar. Served tall and ice-cold, providing an incredibly refreshing and highly caffeinated kick.", 
      img: getImageForDish("Frappé (Φραπέ)"), 
      isSignature: false 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/greekMassiveData.js