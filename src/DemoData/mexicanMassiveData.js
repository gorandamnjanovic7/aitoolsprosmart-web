// POČETAK FAJLA: src/DemoData/mexicanMassiveData.js
import { getImageForDish } from '../qrcode/v8ImageBank.js';

export const MEXICAN_MASSIVE_MENU = { 
  restaurantName: "La Cantina del Fuego", 
  themeColor: "#22c55e", 
  currency: "$", 
  items: [
    // --- TACOS AUTÉNTICOS ---
    { 
      category: "Tacos Auténticos", 
      name: "Tacos al Pastor", 
      price: "12.50", 
      desc: "The absolute pinnacle of Mexican street food. We marinate premium pork shoulder in an ancestral blend of dried chilies, achiote, and spices, then slow-roast it on a vertical spit (trompo). Served on warm, hand-pressed corn tortillas with a sliver of roasted pineapple, finely diced white onions, and fresh cilantro.", 
      img: getImageForDish("Tacos al Pastor"), 
      isSignature: true 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Asada", 
      price: "14.00", 
      desc: "Premium flank steak, citrus-marinated and char-grilled to a smoky perfection. Sliced thick and served on toasted tortillas with a vibrant, acidic squeeze of lime, robust red salsa, and a generous handful of fresh cilantro.", 
      img: getImageForDish("Tacos de Asada"), 
      isSignature: true 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Birria", 
      price: "15.00", 
      desc: "The legendary Jalisco-style tacos. Melt-in-your-mouth beef braised for hours in a dark, complex chili broth. We pan-fry the tortillas in the rich beef fat until crispy, stuffing them with meat and Oaxaca cheese. Served with a rich consommé for dipping.", 
      img: getImageForDish("Tacos de Birria"), 
      isSignature: true 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Carnitas", 
      price: "13.00", 
      desc: "Slow-cooked pork shoulder, rendered in its own fat until impossibly tender, then flash-crisped on a hot griddle. Served traditionally with raw white onions, vibrant green tomatillo salsa, and a wedge of fresh lime.", 
      img: getImageForDish("Tacos de Carnitas"), 
      isSignature: false 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Pollo", 
      price: "11.00", 
      desc: "Fire-roasted chicken thighs bathed in a citrus and garlic adobo marinade. Chopped and served in warm corn tortillas, generously topped with a cooling avocado crema and crumbled cotija cheese.", 
      img: getImageForDish("Tacos de Pollo"), 
      isSignature: false 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Pescado", 
      price: "13.50", 
      desc: "Baja California's finest. Market-fresh white fish coated in a light, airy beer batter and fried until golden. Served on flour tortillas with crunchy shredded cabbage and our signature smoky chipotle mayonnaise.", 
      img: getImageForDish("Tacos de Pescado"), 
      isSignature: false 
    },
    { 
      category: "Tacos Auténticos", 
      name: "Tacos de Camarón", 
      price: "15.50", 
      desc: "Plump, juicy shrimp sautéed vigorously with garlic, butter, and a hint of smoky paprika. Served over a bed of fresh cabbage slaw and topped with a vibrant, sweet mango-habanero salsa.", 
      img: getImageForDish("Tacos de Camarón"), 
      isSignature: true 
    },

    // --- QUESADILLAS & BURRITOS ---
    { 
      category: "Quesadillas y Burritos", 
      name: "Quesabirria", 
      price: "16.00", 
      desc: "An extravagant fusion of a taco and a quesadilla. We take a large flour tortilla, load it with our slow-braised birria beef and a mountain of shredded mozzarella, fold it, and grill it until the cheese oozes and the edges crisp.", 
      img: getImageForDish("Quesabirria"), 
      isSignature: true 
    },
    { 
      category: "Quesadillas y Burritos", 
      name: "Quesadillas Clásicas", 
      price: "11.00", 
      desc: "A massive, handmade flour tortilla folded over a thick layer of melting Oaxaca and Chihuahua cheeses, toasted on a dry comal until the exterior is golden and the inside is beautifully stretchy.", 
      img: getImageForDish("Quesadillas Clásicas"), 
      isSignature: false 
    },
    { 
      category: "Quesadillas y Burritos", 
      name: "Burrito de Carne Asada", 
      price: "16.00", 
      desc: "A colossal flour tortilla tightly packed with flame-grilled steak, authentic Mexican red rice, creamy refried beans, fresh pico de gallo, and a heavy dollop of cooling sour cream and guacamole.", 
      img: getImageForDish("Burrito de Carne Asada"), 
      isSignature: true 
    },
    { 
      category: "Quesadillas y Burritos", 
      name: "Burrito de Pollo", 
      price: "13.50", 
      desc: "Our signature chicken burrito featuring tender, marinated grilled chicken breast, black beans, vibrant cilantro-lime rice, roasted corn salsa, and a blend of melted Mexican cheeses.", 
      img: getImageForDish("Burrito de Pollo"), 
      isSignature: false 
    },
    { 
      category: "Quesadillas y Burritos", 
      name: "Chimichangas Doradas", 
      price: "15.50", 
      desc: "The ultimate indulgence. We take a premium meat and cheese burrito, drop it into a deep fryer until it turns a spectacular golden brown, and smother it in warm queso sauce, guacamole, and fresh crema.", 
      img: getImageForDish("Chimichangas Doradas"), 
      isSignature: true 
    },

    // --- ESPECIALIDADES TRADICIONALES ---
    { 
      category: "Especialidades Tradicionales", 
      name: "Enchiladas Rojas", 
      price: "16.00", 
      desc: "Three soft corn tortillas rolled around seasoned shredded chicken, completely submerged in a traditional, earthy red guajillo chili sauce. Baked with cheese and finished with rings of raw onion and sour cream.", 
      img: getImageForDish("Enchiladas Rojas"), 
      isSignature: true 
    },
    { 
      category: "Especialidades Tradicionales", 
      name: "Enchiladas Suizas Verdes", 
      price: "17.50", 
      desc: "A creamy, tangy masterpiece. Chicken-filled tortillas bathed in a bright green tomatillo sauce enriched with heavy cream, then baked under a thick blanket of bubbling Swiss and mozzarella cheese.", 
      img: getImageForDish("Enchiladas Suizas Verdes"), 
      isSignature: true 
    },
    { 
      category: "Especialidades Tradicionales", 
      name: "Chilaquiles Rojos", 
      price: "14.50", 
      desc: "The definitive Mexican breakfast. Crispy, house-made tortilla chips tossed in a blistering red chili sauce until just softened, crowned with a fried egg, crumbled queso fresco, and a drizzle of crema.", 
      img: getImageForDish("Chilaquiles Rojos"), 
      isSignature: false 
    },
    { 
      category: "Especialidades Tradicionales", 
      name: "Chilaquiles Verdes", 
      price: "14.50", 
      desc: "Fresh tortilla triangles simmered in a tart and spicy green tomatillo salsa, layered with pulled chicken breast, sliced red onions, fresh cilantro, and a sunny-side-up egg.", 
      img: getImageForDish("Chilaquiles Verdes"), 
      isSignature: true 
    },
    { 
      category: "Especialidades Tradicionales", 
      name: "Huevos Rancheros", 
      price: "13.00", 
      desc: "Two farm-fresh eggs fried perfectly sunny-side up, resting on lightly crisped corn tortillas, and drowned in a rustic, fiery tomato and jalapeño ranchero sauce. Served with a side of black beans.", 
      img: getImageForDish("Huevos Rancheros"), 
      isSignature: false 
    },
    { 
      category: "Especialidades Tradicionales", 
      name: "Tamales Tradicionales", 
      price: "8.00", 
      desc: "A labor of love. Fluffy, savory corn masa dough encasing a rich filling of slow-cooked pork in red chili sauce, meticulously wrapped in corn husks and steamed for hours until tender.", 
      img: getImageForDish("Tamales Tradicionales"), 
      isSignature: false 
    },

    // --- ANTOJITOS Y BOTANAS ---
    { 
      category: "Antojitos y Botanas", 
      name: "Gorditas Rellenas", 
      price: "11.00", 
      desc: "Thick, handmade cornmeal pockets, sliced open and stuffed to the brim with savory fillings like chicharrón in green salsa, refried beans, and melting cheese. Grilled until the exterior is beautifully crisp.", 
      img: getImageForDish("Gorditas Rellenas"), 
      isSignature: false 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Sopes de Pollo", 
      price: "10.00", 
      desc: "Small, thick discs of fried masa dough with pinched edges, acting as savory boats. Filled with a smear of refried beans, tender pulled chicken, crisp lettuce, salsa, and a heavy shower of cotija cheese.", 
      img: getImageForDish("Sopes de Pollo"), 
      isSignature: false 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Tostadas de Tinga", 
      price: "11.00", 
      desc: "Flat, shatteringly crisp fried tortillas loaded with 'Tinga'—shredded chicken breast slow-stewed in a sweet and smoky chipotle-tomato sauce. Topped with shredded lettuce and Mexican crema.", 
      img: getImageForDish("Tostadas de Tinga"), 
      isSignature: true 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Nachos Supremos", 
      price: "12.00", 
      desc: "A mountain of thick, crunchy tortilla chips buried under a cascade of molten cheddar and jack cheeses, black beans, jalapeños, pico de gallo, sour cream, and a generous scoop of fresh guacamole.", 
      img: getImageForDish("Nachos Supremos"), 
      isSignature: false 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Guacamole Casero", 
      price: "8.00", 
      desc: "Prepared fresh to order. We mash perfectly ripe, buttery Hass avocados with finely diced red onions, fresh cilantro leaves, serrano peppers, and a sharp squeeze of lime juice. Served with warm chips.", 
      img: getImageForDish("Guacamole Casero"), 
      isSignature: true 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Pico de Gallo Fresco", 
      price: "5.00", 
      desc: "The ultimate fresh condiment. A vibrant, raw salsa combining diced Roma tomatoes, crisp white onions, jalapeños, and cilantro, marinated in lime juice to awaken your palate.", 
      img: getImageForDish("Pico de Gallo Fresco"), 
      isSignature: false 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Salsa Roja y Totopos", 
      price: "4.00", 
      desc: "Our house-roasted red salsa, featuring blistered tomatoes, charred garlic, and toasted dried chilies, blended into a smoky, fiery dip. Served with a bottomless basket of fresh tortilla chips.", 
      img: getImageForDish("Salsa Roja y Totopos"), 
      isSignature: false 
    },
    { 
      category: "Antojitos y Botanas", 
      name: "Frijoles Refritos", 
      price: "5.50", 
      desc: "Classic refried beans, slowly simmered and mashed with traditional pork lard for an impossibly rich and creamy texture, then topped with melted cheese and served piping hot.", 
      img: getImageForDish("Frijoles Refritos"), 
      isSignature: false 
    },

    // --- PLATOS FUERTES ---
    { 
      category: "Platos Fuertes", 
      name: "Carne Asada al Carbón", 
      price: "24.00", 
      desc: "A magnificent platter featuring a large, premium skirt steak marinated in citrus and grilled over real mesquite charcoal. Served with grilled scallions, blistered jalapeños, rice, and fresh tortillas.", 
      img: getImageForDish("Carne Asada al Carbón"), 
      isSignature: true 
    },
    { 
      category: "Platos Fuertes", 
      name: "Carnitas Michoacanas", 
      price: "23.50", 
      desc: "A generous portion of our legendary slow-cooked pork, presented on a platter with traditional sides: fresh salsa verde, pickled red onions, limes, and a stack of hot corn tortillas.", 
      img: getImageForDish("Carnitas Michoacanas"), 
      isSignature: true 
    },
    { 
      category: "Platos Fuertes", 
      name: "Barbacoa de Res", 
      price: "26.00", 
      desc: "A traditional Sunday feast. Premium beef slowly steamed in an underground pit lined with agave leaves until it reaches a melt-in-your-mouth consistency. Served with its own rich consommé broth.", 
      img: getImageForDish("Barbacoa de Res"), 
      isSignature: true 
    },
    { 
      category: "Platos Fuertes", 
      name: "Birria de Chivo", 
      price: "27.00", 
      desc: "The authentic, intensely flavorful goat meat stew from Jalisco. Braised in a heavy, aromatic broth of ancho and guajillo chilies, cloves, and cumin. A true, deeply traditional Mexican experience.", 
      img: getImageForDish("Birria de Chivo"), 
      isSignature: true 
    },
    { 
      category: "Platos Fuertes", 
      name: "Pozole Rojo", 
      price: "18.00", 
      desc: "A robust and restorative hominy corn stew in a fiery red chili broth, packed with tender chunks of pork. Garnished at the table with shredded cabbage, sliced radishes, oregano, and lime.", 
      img: getImageForDish("Pozole Rojo"), 
      isSignature: false 
    },
    { 
      category: "Platos Fuertes", 
      name: "Ceviche de Camarón", 
      price: "23.00", 
      desc: "A refreshing coastal classic. Raw, premium shrimp cured in freshly squeezed lime juice, mixed with diced cucumber, tomatoes, red onion, and cilantro. Served chilled on crispy tostadas.", 
      img: getImageForDish("Ceviche de Camarón"), 
      isSignature: false 
    },

    // --- POSTRES Y BEBIDAS ---
    { 
      category: "Postres y Bebidas", 
      name: "Churros con Chocolate", 
      price: "9.00", 
      desc: "Hot, crispy wands of star-shaped dough, freshly fried and generously rolled in cinnamon sugar. Served alongside a cup of thick, dark, spiced Mexican chocolate for dipping.", 
      img: getImageForDish("Churros con Chocolate"), 
      isSignature: true 
    },
    { 
      category: "Postres y Bebidas", 
      name: "Flan Napolitano", 
      price: "12.00", 
      desc: "A phenomenally rich, dense, and creamy vanilla custard baked slowly in a water bath, then inverted to reveal a glossy, dark caramel syrup cascading down its sides.", 
      img: getImageForDish("Flan Napolitano"), 
      isSignature: false 
    },
    { 
      category: "Postres y Bebidas", 
      name: "Pastel de Tres Leches", 
      price: "14.00", 
      desc: "The ultimate celebration cake. A light, airy vanilla sponge cake soaked entirely in a sweet, decadent mixture of three milks (evaporated, condensed, and heavy cream), topped with whipped icing.", 
      img: getImageForDish("Pastel de Tres Leches"), 
      isSignature: true 
    },
    { 
      category: "Postres y Bebidas", 
      name: "Margarita Clásica", 
      price: "10.00", 
      desc: "Our signature cocktail. A perfect, icy blend of 100% blue agave Tequila Blanco, premium orange liqueur, and freshly squeezed lime juice, served in a glass with a salted rim.", 
      img: getImageForDish("Margarita Clásica"), 
      isSignature: true 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/mexicanMassiveData.js