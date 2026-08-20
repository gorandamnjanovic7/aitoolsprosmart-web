// POČETAK FAJLA: src/DemoData/globalStreetFoodData.js
import { getImageForDish } from '../data/v8SmartImageHelper.js';

export const GLOBAL_STREET_MENU = { 
  restaurantName: "Supreme Street Food", 
  themeColor: "#ef4444", 
  currency: "$", 
  items: [
    { 
      category: "Asian Street Food", 
      name: "Vietnamese Bánh Mì", 
      price: "9.50", 
      desc: "The ultimate Vietnamese street sandwich. A shatteringly crisp, airy French baguette loaded with rich liver pâté, savory roasted pork belly, pickled daikon and carrots, fresh cucumbers, and sprigs of cilantro. A perfect fusion of French culinary influence and bold Southeast Asian flavors.", 
      img: getImageForDish("Vietnamese Bánh Mì"), 
      isSignature: true 
    },
    { 
      category: "Asian Street Food", 
      name: "Thai Pad Thai", 
      price: "11.50", 
      desc: "Thailand's national dish, wok-fried at blistering heat. Rice noodles are tossed with egg, firm tofu, dried shrimp, and a complex, sweet-sour-salty tamarind sauce. Garnished with crushed roasted peanuts, fresh bean sprouts, and a wedge of lime.", 
      img: getImageForDish("Thai Pad Thai"), 
      isSignature: true 
    },
    { 
      category: "Asian Street Food", 
      name: "Japanese Takoyaki", 
      price: "9.00", 
      desc: "Osaka's famous street snack. Piping hot, spherical savory pancakes filled with tender diced octopus (tako), tempura scraps, and green onions. Brushed with sweet takoyaki sauce, Japanese mayonnaise, and dancing dried bonito flakes.", 
      img: getImageForDish("Japanese Takoyaki"), 
      isSignature: false 
    },
    { 
      category: "Asian Street Food", 
      name: "Chinese Jianbing", 
      price: "8.00", 
      desc: "China's ultimate breakfast crepe. A thin, savory mung-bean batter is spread on a hot griddle, coated with a cracked egg, sweet hoisin sauce, spicy chili crisp, fresh scallions, and wrapped around a giant, deep-fried crunchy cracker.", 
      img: getImageForDish("Chinese Jianbing"), 
      isSignature: true 
    },
    { 
      category: "Asian Street Food", 
      name: "Singapore Hainanese Chicken Rice", 
      price: "12.50", 
      desc: "A deceptively simple masterpiece. Silky, gently poached chicken served over a mound of incredibly fragrant rice that has been cooked in rich chicken fat and pandan broth. Served with dark soy sauce and a fierce ginger-chili paste.", 
      img: getImageForDish("Singapore Hainanese Chicken Rice"), 
      isSignature: true 
    },
    { 
      category: "Indian Subcontinent", 
      name: "Samosa Chaat", 
      price: "8.50", 
      desc: "A flavor explosion from the streets of Mumbai. Two deeply golden, crispy potato and pea samosas are crushed and smothered in a hot, spiced chickpea curry. The dish is heavily drizzled with cooling yogurt, sweet tamarind chutney, and spicy green mint chutney.", 
      img: getImageForDish("Samosa Chaat"), 
      isSignature: true 
    },
    { 
      category: "Indian Subcontinent", 
      name: "Vada Pav", 
      price: "6.50", 
      desc: "The iconic vegetarian burger of Maharashtra. A deeply spiced, turmeric-infused mashed potato dumpling is dipped in chickpea batter and deep-fried, then squashed inside a soft bread bun (pav) smeared with fiery dry garlic and peanut chutney.", 
      img: getImageForDish("Vada Pav"), 
      isSignature: false 
    },
    { 
      category: "Indian Subcontinent", 
      name: "Chicken Kathi Roll", 
      price: "9.50", 
      desc: "A Kolkata street staple. Skewer-roasted, highly spiced chicken tikka pieces are wrapped tightly inside a flaky, buttery paratha flatbread that has been layered with a fried egg, raw red onions, and a squeeze of lime.", 
      img: getImageForDish("Chicken Kathi Roll"), 
      isSignature: true 
    },
    { 
      category: "Middle East & Africa", 
      name: "Classic Shawarma Pita", 
      price: "10.50", 
      desc: "Thinly shaved slices of heavily marinated, slow-roasted meat from a vertical spit, packed tightly into a warm, fluffy pita bread. Stuffed with crisp vegetables, pink pickled turnips, and drenched in a rich garlic toum and tahini sauce.", 
      img: getImageForDish("Classic Shawarma Pita"), 
      isSignature: true 
    },
    { 
      category: "Middle East & Africa", 
      name: "Falafel Wrap", 
      price: "9.00", 
      desc: "Crispy on the outside, vibrant green on the inside. Our freshly fried, herb-packed chickpea falafel balls are rolled in flatbread with creamy hummus, diced tomatoes, cucumbers, and a heavy drizzle of nutty sesame tahini.", 
      img: getImageForDish("Falafel Wrap"), 
      isSignature: false 
    },
    { 
      category: "Middle East & Africa", 
      name: "South African Bunny Chow", 
      price: "11.50", 
      desc: "A legendary fast-food dish from Durban. A quarter-loaf of thick, crusty white bread is completely hollowed out and filled to the brim with a molten, fiercely spicy, and aromatic lamb or chicken curry. Utensils are strictly optional.", 
      img: getImageForDish("South African Bunny Chow"), 
      isSignature: true 
    },
    { 
      category: "Latin America", 
      name: "Arepa Reina Pepiada", 
      price: "10.00", 
      desc: "The most famous Venezuelan street food. A thick, grilled cornmeal cake is sliced open and generously stuffed with a creamy, rich chicken salad heavily folded with ripe Hass avocados and a touch of mayonnaise.", 
      img: getImageForDish("Arepa Reina Pepiada"), 
      isSignature: true 
    },
    { 
      category: "Latin America", 
      name: "Argentinian Choripán", 
      price: "9.50", 
      desc: "A staple of South American soccer matches. A thick, juicy, butterflied pork and beef chorizo sausage is grilled over an open flame, shoved into a crusty bread roll, and slathered with a sharp, garlicky, and herbaceous chimichurri sauce.", 
      img: getImageForDish("Argentinian Choripán"), 
      isSignature: true 
    },
    { 
      category: "Latin America", 
      name: "Peruvian Ceviche Cup", 
      price: "12.00", 
      desc: "A portable cup of pure, acidic perfection. Raw, ultra-fresh white fish chunks are instantly cured in a bath of 'leche de tigre' (lime juice, chili, and fish broth), mixed with red onions, cilantro, and served with crunchy toasted corn (cancha).", 
      img: getImageForDish("Peruvian Ceviche Cup"), 
      isSignature: false 
    },
    { 
      category: "Latin America", 
      name: "Brazilian Pão de Queijo", 
      price: "6.50", 
      desc: "A bag of warm, naturally gluten-free Brazilian cheese breads. Made from cassava flour and Minas cheese, these small golden spheres are incredibly chewy, stretchy, and dangerously addictive.", 
      img: getImageForDish("Brazilian Pão de Queijo"), 
      isSignature: false 
    },
    { 
      category: "Europe & Balkans", 
      name: "German Currywurst", 
      price: "8.50", 
      desc: "Berlin’s most famous street snack. A steamed, then fried pork sausage is sliced into bite-sized pieces, drowned in a sweet, tangy, and heavily spiced tomato-curry ketchup, and dusted generously with yellow curry powder. Served with fries.", 
      img: getImageForDish("German Currywurst"), 
      isSignature: true 
    },
    { 
      category: "Europe & Balkans", 
      name: "Belgian Frites", 
      price: "7.00", 
      desc: "Authentic Belgian-style fries. Thickly cut potatoes, meticulously double-fried in beef tallow until the exterior is like glass and the interior is like fluffy mashed potato. Served in a paper cone with a massive dollop of tangy mayonnaise.", 
      img: getImageForDish("Belgian Frites"), 
      isSignature: false 
    },
    { 
      category: "Europe & Balkans", 
      name: "Balkan Ćevapi", 
      price: "11.50", 
      desc: "The undisputed king of Balkan street food. Ten skinless, grilled beef and lamb sausages, perfectly charred over wood coals. Served tucked inside a warm, fluffy, steam-softened somun bread, accompanied by freshly diced white onions and rich, creamy kajmak.", 
      img: getImageForDish("Balkan Ćevapi"), 
      isSignature: true 
    },
    { 
      category: "Europe & Balkans", 
      name: "Burek", 
      price: "8.50", 
      desc: "A massive, spiraled or layered phyllo pastry pie, baked until the thin dough shatters upon biting. Generously filled with savory, peppery minced beef and onions, leaving your hands delightfully greasy. The ultimate hangover cure.", 
      img: getImageForDish("Burek"), 
      isSignature: true 
    },
    { 
      category: "Europe & Balkans", 
      name: "Polish Zapiekanka", 
      price: "9.00", 
      desc: "Poland's beloved open-faced sandwich. A long half-baguette heavily loaded with sautéed white mushrooms and melting cheese, baked until crisp, and finished with a zig-zag drizzle of sweet Polish ketchup and chopped chives.", 
      img: getImageForDish("Polish Zapiekanka"), 
      isSignature: false 
    },
    { 
      category: "North America", 
      name: "Canadian Poutine", 
      price: "12.00", 
      desc: "Canada’s greatest comfort food. A massive portion of thick, double-fried potatoes buried under squeaky, fresh cheese curds, all smothered in a rich, deeply savory, piping-hot brown beef gravy that melts everything together.", 
      img: getImageForDish("Canadian Poutine"), 
      isSignature: true 
    },
    { 
      category: "North America", 
      name: "Philly Cheesesteak", 
      price: "14.50", 
      desc: "The pride of Philadelphia. An elongated hoagie roll stuffed aggressively with thinly shaved, griddle-chopped ribeye steak, caramelized sweet onions, and an authentic, heavy pour of melted Cheez Whiz or Provolone.", 
      img: getImageForDish("Philly Cheesesteak"), 
      isSignature: true 
    },
    { 
      category: "North America", 
      name: "New England Lobster Roll", 
      price: "24.00", 
      desc: "A luxurious coastal classic. Massive chunks of sweet, cold Maine lobster meat, barely dressed in a whisper of mayonnaise and celery, stuffed into a split-top hot dog bun that has been heavily buttered and toasted on a flat top.", 
      img: getImageForDish("New England Lobster Roll"), 
      isSignature: true 
    },
    { 
      category: "Global Sweets", 
      name: "Hong Kong Bubble Waffle", 
      price: "7.50", 
      desc: "A visually stunning street dessert. An egg-rich batter is poured into a special spherical iron, resulting in a waffle with crispy edges and soft, chewy, cake-like bubbles. Often folded into a cone and eaten on the go.", 
      img: getImageForDish("Hong Kong Bubble Waffle"), 
      isSignature: true 
    },
    { 
      category: "Global Sweets", 
      name: "Dutch Stroopwafel", 
      price: "6.00", 
      desc: "The ultimate Netherlands treat. Two impossibly thin, freshly pressed, cinnamon-scented waffles are glued together with a hot, gooey layer of rich caramel syrup. Best enjoyed resting over a cup of hot coffee to soften the caramel.", 
      img: getImageForDish("Dutch Stroopwafel"), 
      isSignature: false 
    },
    { 
      category: "Global Sweets", 
      name: "Japanese Taiyaki", 
      price: "6.50", 
      desc: "A charming, fish-shaped Japanese cake with a crisp, waffle-like exterior. It is traditionally stuffed end-to-end with sweet, slow-cooked red azuki bean paste or a rich vanilla custard, served piping hot.", 
      img: getImageForDish("Japanese Taiyaki"), 
      isSignature: false 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/globalStreetFoodData.js