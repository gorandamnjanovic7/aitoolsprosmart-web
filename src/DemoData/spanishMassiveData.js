// POČETAK FAJLA: src/DemoData/spanishMassiveData.js
import { getImageForDish } from '../data/v8SmartImageHelper.js';

export const SPANISH_MASSIVE_MENU = { 
  restaurantName: "Casa Real - Tapas & Paella", 
  themeColor: "#b91c1c", 
  currency: "€", 
  items: [
    // --- TAPAS & STARTERS ---
    { 
      category: "Tapas & Starters", 
      name: "Jamón Ibérico de Bellota", 
      price: "28.00", 
      desc: "The crown jewel of Spanish gastronomy. Acorn-fed, purebred Iberian pork leg, dry-cured for over 36 months and masterfully hand-carved into translucent, ruby-red slices that literally melt on the palate.", 
      img: getImageForDish("Jamón Ibérico de Bellota"), 
      isSignature: true 
    },
    { 
      category: "Tapas & Starters", 
      name: "Patatas Bravas", 
      price: "8.50", 
      desc: "The undisputed king of Spanish tapas. Crispy, golden-fried potato cubes generously smothered in a fierce, smoky paprika tomato sauce (salsa brava) and a rich, garlicky aioli.", 
      img: getImageForDish("Patatas Bravas"), 
      isSignature: true 
    },
    { 
      category: "Tapas & Starters", 
      name: "Gambas al Ajillo", 
      price: "16.00", 
      desc: "Sizzling Mediterranean prawns cooked in a traditional terracotta cazuela with violently bubbling extra virgin olive oil, toasted garlic slices, and fiery dried chili peppers.", 
      img: getImageForDish("Gambas al Ajillo"), 
      isSignature: true 
    },
    { 
      category: "Tapas & Starters", 
      name: "Tortilla Española", 
      price: "9.00", 
      desc: "The classic Spanish omelette. A thick, comforting wedge of slow-poached potatoes and caramelized sweet onions bound together with farm-fresh eggs. Served slightly runny in the center.", 
      img: getImageForDish("Tortilla Española"), 
      isSignature: false 
    },
    { 
      category: "Tapas & Starters", 
      name: "Croquetas de Jamón", 
      price: "10.50", 
      desc: "Impossibly creamy on the inside, shatteringly crisp on the outside. These golden croquettes are filled with a rich béchamel sauce densely studded with savory bits of Serrano ham.", 
      img: getImageForDish("Croquetas de Jamón"), 
      isSignature: false 
    },
    { 
      category: "Tapas & Starters", 
      name: "Pulpo a la Gallega", 
      price: "19.00", 
      desc: "Galician-style octopus, boiled in copper pots until exceptionally tender, sliced into thick medallions, and served over warm potatoes with a heavy dusting of smoked pimentón and coarse sea salt.", 
      img: getImageForDish("Pulpo a la Gallega"), 
      isSignature: true 
    },
    { 
      category: "Tapas & Starters", 
      name: "Pimientos de Padrón", 
      price: "8.00", 
      desc: "A culinary roulette from Galicia. Small green peppers blistered quickly in hot olive oil and sprinkled with flaky sea salt. Most are mild and sweet, but occasionally, one packs a fiery punch.", 
      img: getImageForDish("Pimientos de Padrón"), 
      isSignature: false 
    },
    { 
      category: "Tapas & Starters", 
      name: "Pan con Tomate", 
      price: "5.50", 
      desc: "Catalonia's greatest gift to bread. Crusty, toasted rustic bread rubbed aggressively with raw garlic, smeared with fresh grated tomatoes, and drizzled heavily with premium olive oil.", 
      img: getImageForDish("Pan con Tomate"), 
      isSignature: false 
    },
    { 
      category: "Tapas & Starters", 
      name: "Calamares a la Romana", 
      price: "14.00", 
      desc: "Thick rings of tender squid coated in a light, airy batter and deep-fried until golden. Served piping hot with a wedge of fresh lemon and house-made garlic mayonnaise.", 
      img: getImageForDish("Calamares a la Romana"), 
      isSignature: false 
    },

    // --- SOUPS & SALADS ---
    { 
      category: "Soups & Salads", 
      name: "Gazpacho Andaluz", 
      price: "9.00", 
      desc: "The ultimate Andalusian summer refresher. A velvety, chilled soup blended from ripe, sun-drenched tomatoes, cucumbers, bell peppers, garlic, and high-quality olive oil.", 
      img: getImageForDish("Gazpacho Andaluz"), 
      isSignature: true 
    },
    { 
      category: "Soups & Salads", 
      name: "Salmorejo Cordobés", 
      price: "10.50", 
      desc: "A thicker, richer, and creamier cousin to gazpacho originating from Córdoba. Garnished traditionally with chopped hard-boiled egg and crispy shards of Iberian ham.", 
      img: getImageForDish("Salmorejo Cordobés"), 
      isSignature: false 
    },
    { 
      category: "Soups & Salads", 
      name: "Ensaladilla Rusa", 
      price: "8.50", 
      desc: "Spain's favorite tapas salad. A comforting blend of diced boiled potatoes, carrots, peas, and premium tuna, heavily folded into a rich, creamy mayonnaise.", 
      img: getImageForDish("Ensaladilla Rusa"), 
      isSignature: false 
    },

    // --- PAELLA & RICE ---
    { 
      category: "Paella & Rice", 
      name: "Paella Valenciana", 
      price: "45.00", 
      desc: "The authentic Valencian masterpiece for two. Saffron-infused Bomba rice cooked over an open flame with tender rabbit, chicken, flat green beans, and butter beans, forming a perfect crispy 'socarrat' base.", 
      img: getImageForDish("Paella Valenciana"), 
      isSignature: true 
    },
    { 
      category: "Paella & Rice", 
      name: "Paella de Marisco", 
      price: "52.00", 
      desc: "A spectacular coastal feast. A wide steel pan of deeply flavorful rice simmered in a rich seafood broth, adorned with colossal prawns, mussels, clams, and tender squid rings.", 
      img: getImageForDish("Paella de Marisco"), 
      isSignature: true 
    },
    { 
      category: "Paella & Rice", 
      name: "Arroz Negro", 
      price: "42.00", 
      desc: "Striking black rice flavored heavily with fresh cuttlefish ink, offering a deep, oceanic intensity. Studded with tender squid and served with a side of pungent garlic alioli to stir in.", 
      img: getImageForDish("Arroz Negro"), 
      isSignature: false 
    },
    { 
      category: "Paella & Rice", 
      name: "Fideuà", 
      price: "46.00", 
      desc: "Catalonia's answer to paella. Prepared in the same wide pan, but substituting rice for short, toasted pasta noodles that soak up a phenomenally rich seafood and monkfish broth.", 
      img: getImageForDish("Fideuà"), 
      isSignature: true 
    },

    // --- SEAFOOD SPECIALTIES ---
    { 
      category: "Seafood Specialties", 
      name: "Bacalao al Pil-Pil", 
      price: "24.00", 
      desc: "A triumph of Basque technique. Thick fillets of salt cod are slowly cooked in olive oil, while the pan is continuously swirled to emulsify the fish's natural gelatin with the oil into a thick, glossy garlic sauce.", 
      img: getImageForDish("Bacalao al Pil-Pil"), 
      isSignature: true 
    },
    { 
      category: "Seafood Specialties", 
      name: "Merluza en Salsa Verde", 
      price: "26.00", 
      desc: "Prime center-cut hake gently poached in a beautiful, vibrant green sauce made from white wine, fish fumet, abundant fresh parsley, and clams.", 
      img: getImageForDish("Merluza en Salsa Verde"), 
      isSignature: false 
    },
    { 
      category: "Seafood Specialties", 
      name: "Lubina a la Sal", 
      price: "32.00", 
      desc: "A whole Mediterranean sea bass entirely entombed in coarse sea salt and baked. The crust is cracked open tableside, revealing impossibly moist, perfectly seasoned fish.", 
      img: getImageForDish("Lubina a la Sal"), 
      isSignature: true 
    },

    // --- MEAT SPECIALTIES ---
    { 
      category: "Meat Specialties", 
      name: "Cochinillo Asado", 
      price: "34.00", 
      desc: "The pride of Segovia. A traditional suckling pig, slowly roasted in a wood-fired oven until the meat is meltingly tender and the skin turns into a shattering, glass-like crackling.", 
      img: getImageForDish("Cochinillo Asado"), 
      isSignature: true 
    },
    { 
      category: "Meat Specialties", 
      name: "Rabo de Toro", 
      price: "25.00", 
      desc: "An Andalusian classic. Bull's tail sections, heavily dusted in flour and slow-braised for hours in rich red wine and vegetables until the gelatinous meat effortlessly falls away from the bone.", 
      img: getImageForDish("Rabo de Toro"), 
      isSignature: true 
    },
    { 
      category: "Meat Specialties", 
      name: "Cordero Lechal Asado", 
      price: "36.00", 
      desc: "Milk-fed baby lamb quarter, roasted in a clay dish with little more than water, salt, and garlic, allowing the incredibly delicate, sweet flavor of the premium meat to shine.", 
      img: getImageForDish("Cordero Lechal Asado"), 
      isSignature: false 
    },
    { 
      category: "Meat Specialties", 
      name: "Carrilleras de Ternera", 
      price: "22.00", 
      desc: "Beef cheeks slow-cooked to absolute perfection in a syrupy, dark Pedro Ximénez sherry reduction. Served over a velvety bed of creamy potato purée.", 
      img: getImageForDish("Carrilleras de Ternera"), 
      isSignature: false 
    },
    { 
      category: "Meat Specialties", 
      name: "Albóndigas en Salsa", 
      price: "16.00", 
      desc: "Traditional Spanish meatballs crafted from a blend of pork and beef, simmered in a rich, rustic tomato, almond, and saffron sauce. Served with crusty bread for dipping.", 
      img: getImageForDish("Albóndigas en Salsa"), 
      isSignature: false 
    },

    // --- DESSERTS ---
    { 
      category: "Desserts", 
      name: "Churros con Chocolate", 
      price: "8.50", 
      desc: "Spain's legendary sweet treat. Star-shaped wands of fried dough, dusted in sugar, served hot alongside a cup of impossibly thick, dark, pudding-like hot chocolate for dunking.", 
      img: getImageForDish("Churros con Chocolate"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Basque Burnt Cheesecake", 
      price: "9.50", 
      desc: "The world-famous Tarta de Queso from San Sebastián. Baked at intense heat to intentionally scorch the exterior, yielding a deeply caramelized, rustic crust that gives way to a molten, creamy center.", 
      img: getImageForDish("Basque Burnt Cheesecake"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Crema Catalana", 
      price: "8.00", 
      desc: "Catalonia’s signature dessert. A silken, citrus-and-cinnamon infused custard hidden beneath a brittle, glass-like layer of blowtorched caramelized sugar.", 
      img: getImageForDish("Crema Catalana"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Tarta de Santiago", 
      price: "7.50", 
      desc: "A naturally gluten-free, dense almond cake originating from Galicia. Flavored with lemon zest and dusted with powdered sugar featuring the iconic cross of St. James.", 
      img: getImageForDish("Tarta de Santiago"), 
      isSignature: false 
    },

    // --- BEVERAGES ---
    { 
      category: "Beverages", 
      name: "Sangría Tinta Premium", 
      price: "18.00", 
      desc: "A chilled, refreshing pitcher of robust Spanish red wine, steeped with freshly cut citrus fruits, apples, a splash of premium brandy, and a hint of cinnamon.", 
      img: getImageForDish("Sangría Tinta Premium"), 
      isSignature: true 
    },
    { 
      category: "Beverages", 
      name: "Tinto de Verano", 
      price: "6.00", 
      desc: "The local favorite summer drink. A crisp, bubbly mix of red wine and lemon soda, served in a tall glass overflowing with ice and a slice of fresh lemon.", 
      img: getImageForDish("Tinto de Verano"), 
      isSignature: false 
    },
    { 
      category: "Beverages", 
      name: "Café Cortado", 
      price: "3.50", 
      desc: "A potent shot of dark espresso 'cut' with a small amount of warm milk to reduce the acidity, maintaining a bold coffee flavor.", 
      img: getImageForDish("Café Cortado"), 
      isSignature: false 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/spanishMassiveData.js