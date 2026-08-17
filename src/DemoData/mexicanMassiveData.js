// POČETAK FAJLA: src/DemoData/mexicanMassiveData.js

// 🔥 SLIKE PO KATEGORIJAMA 🔥
const tacoImgs = [
  "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1584345630026-b74e6c99c387?auto=format&fit=crop&w=600&q=80"
];
const mainImgs = [
  "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=600&q=80"
];
const soupImgs = [
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=600&q=80"
];
const dessertImgs = [
  "https://images.unsplash.com/photo-1624371414325-e2f4de60dc18?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80"
];
const breakfastImgs = [
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80"
];

// 🔥 AUTOMATSKO GENERISANJE MEKSIČKE BAZE 🔥
const RAW_MEXICAN_ITEMS = [
  
  // 1. TACOS & STREET FOOD
  ...["Tacos al Pastor", "Tacos de Carne Asada", "Tacos de Birria", "Tacos de Barbacoa", "Tacos de Carnitas", "Tacos de Pescado", "Tacos de Camarón", "Quesabirria", "Quesadillas", "Burritos", "Chimichangas", "Fajitas", "Nachos", "Tostadas", "Gorditas", "Sopes", "Huaraches", "Tlacoyos", "Tamales", "Tortas", "Cemitas", "Molletes", "Elote", "Esquites", "Pambazos", "Flautas", "Taquitos", "Empanadas Mexicanas", "Sincronizadas", "Gringas", "Chalupas", "Papadzules", "Panuchos", "Salbutes", "Tlayudas", "Memelas", "Tacos Dorados"].map((name, idx) => ({ 
    category: "Tacos & Street Food", name, price: "12.50", desc: `Auténtico ${name}, prepared with traditional spices, fresh cilantro, and handmade tortillas.`, img: tacoImgs[idx % tacoImgs.length], isSignature: false 
  })),

  // 2. PLATOS TRADICIONALES (MAIN DISHES)
  ...["Birria", "Enchiladas Rojas", "Enchiladas Verdes", "Enchiladas Suizas", "Chiles Rellenos", "Chiles en Nogada", "Mole Poblano", "Mole Negro", "Pollo con Mole", "Cochinita Pibil", "Poc Chuc", "Barbacoa", "Carnitas", "Carne Asada", "Alambre", "Discada", "Pollo Asado", "Pollo Adobado", "Camarones a la Diabla", "Camarones al Ajillo", "Pescado a la Veracruzana", "Aguachile", "Ceviche Mexicano", "Cóctel de Camarones", "Nopales Asados", "Albóndigas Mexicanas", "Picadillo Mexicano", "Carne Guisada", "Costillas en Salsa Verde", "Pollo en Salsa Verde", "Pollo Tinga", "Tinga de Res", "Enfrijoladas", "Entomatadas", "Enmoladas", "Pastel Azteca", "Tamales de Pollo", "Tamales de Cerdo", "Tamales de Elote", "Tamales Oaxaqueños", "Cabrito al Pastor", "Mixiotes", "Cecina", "Carne Adobada", "Puerco en Chile Verde", "Asado de Boda", "Chile Colorado"].map((name, idx) => ({ 
    category: "Platos Tradicionales", name, price: "24.00", desc: `Classic ${name}, slow-cooked to perfection honoring the heritage of Mexican cuisine.`, img: mainImgs[idx % mainImgs.length], isSignature: false 
  })),

  // 3. SOPAS Y CALDOS (SOUPS & STEWS)
  ...["Pozole Rojo", "Pozole Verde", "Menudo", "Caldo de Res", "Caldo de Pollo", "Sopa de Tortilla", "Sopa de Lima"].map((name, idx) => ({ 
    category: "Sopas y Caldos", name, price: "16.00", desc: `Hearty and comforting ${name}, served hot with fresh lime and tortillas.`, img: soupImgs[idx % soupImgs.length], isSignature: false 
  })),

  // 4. DESAYUNOS (BREAKFAST)
  ...["Chilaquiles", "Nopales con Huevo", "Huevos Rancheros", "Huevos a la Mexicana", "Machaca con Huevo", "Migas Mexicanas", "Chorizo con Huevo", "Chorizo con Papas"].map((name, idx) => ({ 
    category: "Desayunos", name, price: "14.50", desc: `Traditional Mexican morning start: ${name} to fuel your day with robust flavors.`, img: breakfastImgs[0], isSignature: false 
  })),

  // 5. SALSAS Y ACOMPAÑAMIENTOS (SIDES & DIPS)
  ...["Guacamole", "Pico de Gallo", "Salsa Roja", "Salsa Verde", "Chile con Queso", "Frijoles Refritos", "Frijoles Charros", "Arroz Mexicano", "Rajas con Crema", "Calabacitas a la Mexicana", "Frijoles Puercos", "Tortillas de Maíz", "Tortillas de Harina", "Totopos"].map((name, idx) => ({ 
    category: "Salsas & Sides", name, price: "6.00", desc: `Freshly made ${name}, the perfect authentic accompaniment to any main dish.`, img: mainImgs[2], isSignature: false 
  })),

  // 6. POSTRES (DESSERTS)
  ...["Buñuelos Mexicanos", "Churros", "Flan Mexicano", "Tres Leches Cake", "Pastel de Elote", "Arroz con Leche", "Jericalla", "Cajeta", "Conchas", "Pan de Muerto", "Rosca de Reyes", "Capirotada", "Alegrías", "Palanquetas", "Mazapán Mexicano", "Cocadas", "Empanadas Dulces"].map((name, idx) => ({ 
    category: "Postres", name, price: "9.00", desc: `Sweet and traditional ${name}, a perfect finish to your Mexican dining experience.`, img: dessertImgs[idx % dessertImgs.length], isSignature: false 
  }))
];

// Obeležavamo par jela kao Signature
RAW_MEXICAN_ITEMS[0].isSignature = true; // Tacos al Pastor
RAW_MEXICAN_ITEMS[40].isSignature = true; // Mole Poblano
RAW_MEXICAN_ITEMS[84].isSignature = true; // Pozole Rojo

export const MEXICAN_MASSIVE_MENU = {
  restaurantName: "La Cantina del Fuego",
  themeColor: "#22c55e", // V8 Green za Meksiko
  currency: "$",
  items: RAW_MEXICAN_ITEMS
};
// KRAJ FAJLA