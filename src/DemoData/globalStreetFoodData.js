// POČETAK FAJLA: src/DemoData/globalStreetFoodData.js

// 🔥 SLIKE PO KATEGORIJAMA (Rotiraju se automatski) 🔥
const burgerImgs = [
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1594212699503-b54134be1eb9?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"
];
const chickenImgs = [
  "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=600&q=80"
];
const asianImgs = [
  "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=600&q=80"
];
const tacoImgs = [
  "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80"
];
const wrapImgs = [
  "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80"
];
const sideImgs = [
  "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=80"
];
const dessertImgs = [
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80"
];
const generalImgs = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80"
];

// 🔥 AUTOMATSKO GENERISANJE MASIVNE BAZE 🔥
const RAW_GLOBAL_ITEMS = [
  
  // 1. BURGERS & SLIDERS
  ...["Hamburger", "Cheeseburger", "Double Cheeseburger", "Bacon Burger", "Chicken Burger", "Crispy Chicken Burger", "Grilled Chicken Burger", "Fish Burger", "Veggie Burger", "Mushroom Burger", "BBQ Burger", "Jalapeño Burger", "Smash Burger", "Slider", "Aloo Tikki Burger", "Chapli Kebab Burger", "Bun Kebab", "X-Burger", "X-Salada", "Halloumi Burger"].map((name, idx) => ({ 
    category: "Burgers & Sliders", name, price: "14.50", desc: `Premium street-style ${name}, crafted with fresh ingredients and our signature V8 sauce.`, img: burgerImgs[idx % burgerImgs.length], isSignature: false 
  })),

  // 2. WINGS & FRIED CHICKEN
  ...["Chicken Nuggets", "Chicken Tenders", "Fried Chicken", "Spicy Fried Chicken", "Chicken Wings", "Buffalo Wings", "BBQ Wings", "Popcorn Chicken", "Chicken Strips", "Chicken Bites", "Korean Fried Chicken", "Korean Spicy Chicken", "Karaage Chicken", "Chicken Katsu", "Ayam Goreng", "Peri-Peri Chicken"].map((name, idx) => ({ 
    category: "Fried Chicken & Wings", name, price: "12.00", desc: `Crispy, golden ${name}, perfectly seasoned and fried to absolute perfection.`, img: chickenImgs[idx % chickenImgs.length], isSignature: false 
  })),

  // 3. WRAPS, KEBABS & GYROS
  ...["Chicken Wrap", "Chicken Caesar Wrap", "Buffalo Chicken Wrap", "Shawarma Wrap", "Kebab Wrap", "Falafel Wrap", "Gyro Wrap", "Doner Kebab", "Chicken Doner", "Beef Doner", "Lamb Doner", "Döner Box", "Shawarma", "Chicken Shawarma", "Beef Shawarma", "Lamb Shawarma", "Gyro", "Souvlaki", "Kebab", "Shish Kebab", "Kofta Kebab", "Adana Kebab", "Iskender Kebab", "Falafel", "Falafel Sandwich", "Hummus Wrap", "Chicken Tikka Wrap", "Seekh Kebab Roll", "Butter Chicken Wrap", "Naan Wrap", "Kathi Roll", "Frankie Roll", "Suya Wrap", "Jerk Chicken Wrap"].map((name, idx) => ({ 
    category: "Wraps & Kebabs", name, price: "11.50", desc: `Authentic ${name} wrapped fresh, packed with robust flavors and premium meats/veggies.`, img: wrapImgs[idx % wrapImgs.length], isSignature: false 
  })),

  // 4. TACOS, BURRITOS & LATIN STREET FOOD
  ...["Tacos", "Beef Tacos", "Chicken Tacos", "Fish Tacos", "Shrimp Tacos", "Birria Tacos", "Carnitas Tacos", "Al Pastor Tacos", "Quesadilla", "Chicken Quesadilla", "Beef Quesadilla", "Cheese Quesadilla", "Burrito", "Beef Burrito", "Chicken Burrito", "Bean Burrito", "Breakfast Burrito", "Burrito Bowl", "Nachos", "Loaded Nachos", "Cheese Nachos", "Nachos Supreme", "Enchiladas", "Taquitos", "Flautas", "Tostadas", "Gorditas", "Chalupas", "Empanadas", "Beef Empanadas", "Chicken Empanadas", "Cheese Empanadas", "Arepas", "Stuffed Arepas", "Pupusas", "Tamales", "Ceviche Cup", "Jamaican Patty"].map((name, idx) => ({ 
    category: "Tacos, Burritos & Latin", name, price: "13.00", desc: `Traditional ${name} bringing the vibrant heat and taste of Latin American street food.`, img: tacoImgs[idx % tacoImgs.length], isSignature: false 
  })),

  // 5. HOT DOGS & SAUSAGES
  ...["Hot Dog", "Chili Dog", "Cheese Dog", "Corn Dog", "Sausage Sandwich", "Bratwurst Roll", "Currywurst", "Bratwurst", "Smoked Sausage Roll", "Choripán", "Completo Hot Dog", "Salchipapas", "Boerewors Roll", "Sausage Sizzle", "Kokoreç Sandwich", "Bockwurst"].map((name, idx) => ({ 
    category: "Hot Dogs & Sausages", name, price: "8.50", desc: `Classic ${name}, grilled over an open flame and served in a freshly baked roll.`, img: generalImgs[0], isSignature: false 
  })),

  // 6. ASIAN NOODLES, RICE & DIM SUM
  ...["Fried Rice", "Chicken Fried Rice", "Beef Fried Rice", "Shrimp Fried Rice", "Vegetable Fried Rice", "Egg Fried Rice", "Chow Mein", "Lo Mein", "Stir-Fried Noodles", "Singapore Noodles", "Dan Dan Noodles", "Beef Noodles", "Ramen", "Tonkotsu Ramen", "Shoyu Ramen", "Miso Ramen", "Spicy Ramen", "Udon", "Yakisoba", "Soba Noodles", "Pad Thai", "Pad See Ew", "Drunken Noodles", "Thai Fried Rice", "Green Curry with Rice", "Red Curry with Rice", "Nasi Goreng", "Mie Goreng", "Nasi Lemak", "Dumplings", "Potstickers", "Gyoza", "Bao Buns", "Xiaolongbao", "Dim Sum", "Takoyaki", "Okonomiyaki", "Tempura", "Bulgogi Bowl", "Bibimbap", "Kimchi Fried Rice", "Tteokbokki", "Kimbap"].map((name, idx) => ({ 
    category: "Asian Noodles, Rice & Dumplings", name, price: "16.00", desc: `Wok-fired ${name} delivering authentic Asian street market flavors.`, img: asianImgs[idx % asianImgs.length], isSignature: false 
  })),

  // 7. SANDWICHES & PANINIS
  ...["Panini", "Ham and Cheese Panini", "Chicken Panini", "Caprese Panini", "Grilled Cheese Sandwich", "Club Sandwich", "BLT Sandwich", "Tuna Sandwich", "Roast Beef Sandwich", "Pulled Pork Sandwich", "Philly Cheesesteak", "Steak Sandwich", "Meatball Sub", "Italian Sub", "Po’ Boy", "Lobster Roll", "Fish Sandwich", "Croque Monsieur", "Croque Madame", "Bocadillo de Jamón", "Bocadillo de Calamares", "Prego Sandwich", "Francesinha", "Milanesa Sandwich", "Chacarero", "Lomito Sandwich", "Gatsby Sandwich", "Bunny Chow", "Katsu Sandwich"].map((name, idx) => ({ 
    category: "Sandwiches & Subs", name, price: "12.50", desc: `Gourmet ${name}, stacked high with premium ingredients and melted cheeses.`, img: generalImgs[0], isSignature: false 
  })),

  // 8. FRIES, SIDES & SNACKS
  ...["French Fries", "Curly Fries", "Waffle Fries", "Loaded Fries", "Cheese Fries", "Chili Cheese Fries", "Sweet Potato Fries", "Potato Wedges", "Hash Browns", "Onion Rings", "Mozzarella Sticks", "Mac and Cheese", "Mac and Cheese Bites", "Fried Pickles", "Jalapeño Poppers", "Pretzel", "Soft Pretzel", "Poutine", "Loaded Potato Skins", "Baked Potato", "Belgian Fries", "Mitraillette", "Kroket", "Bitterballen", "Kaassoufflé", "Patatas Bravas", "Croquetas", "Coxinha", "Pão de Queijo", "Plantain Chips"].map((name, idx) => ({ 
    category: "Fries, Sides & Snacks", name, price: "6.50", desc: `Crispy and delicious ${name}, the ultimate side dish or quick street snack.`, img: sideImgs[idx % sideImgs.length], isSignature: false 
  })),

  // 9. INDIAN & MIDDLE EASTERN CHAAT
  ...["Meat Samosa", "Vegetable Samosa", "Pakora", "Onion Bhaji", "Aloo Tikki", "Vada Pav", "Pav Bhaji", "Dabeli", "Chole Bhature", "Pani Puri", "Bhel Puri", "Sev Puri", "Dahi Puri", "Papdi Chaat", "Samosa Chaat", "Masala Dosa", "Uttapam", "Idli", "Medu Vada", "Keema Pav", "Manakish", "Za’atar Manakish", "Lahmacun", "Pide", "Gözleme", "Börek", "Simit", "Kumpir", "Tantuni", "Fatayer", "Sabich"].map((name, idx) => ({ 
    category: "Indian & Mid-East Street Food", name, price: "9.00", desc: `Richly spiced ${name}, a fragrant and beloved staple of global street food culture.`, img: asianImgs[idx % asianImgs.length], isSignature: false 
  })),

  // 10. SUSHI & SEAFOOD
  ...["Sushi Rolls", "California Roll", "Spicy Tuna Roll", "Salmon Roll", "Shrimp Tempura Roll", "Sushi Burrito", "Sushi Bowl", "Poke Bowl", "Salmon Poke", "Tuna Poke", "Fish and Chips", "Fried Fish", "Fried Shrimp", "Popcorn Shrimp", "Calamari", "Crab Cakes", "Seafood Basket", "Balık Ekmek"].map((name, idx) => ({ 
    category: "Sushi & Seafood", name, price: "18.00", desc: `Freshly prepared ${name}, bringing ocean-fresh flavors straight to your hands.`, img: generalImgs[0], isSignature: false 
  })),

  // 11. SAVORY PIES, PASTRIES & BREAKFAST
  ...["Pizza", "Margherita Pizza", "Pepperoni Pizza", "Calzone", "Stromboli", "Pizza Slice", "Garlic Bread", "Bagel Sandwich", "Croissant Sandwich", "Breakfast Sandwich", "Pancakes", "Waffles", "French Toast", "Meat Pie", "Steak Pie", "Chicken Pie", "Scotch Egg", "Cornish Pasty", "Shepherd’s Pie", "Chicken Pot Pie", "Spring Rolls", "Egg Rolls", "Crêpes", "Savory Crêpes", "Galettes", "Tortilla Sandwich", "Spanakopita", "Tiropita", "Australian Meat Pie"].map((name, idx) => ({ 
    category: "Pies, Pizza & Breakfast", name, price: "10.00", desc: `Warm, hearty ${name} baked fresh daily for the perfect comfort bite.`, img: generalImgs[0], isSignature: false 
  })),

  // 12. DESSERTS & SWEETS
  ...["Churros", "Fried Dough", "Funnel Cake", "Donuts", "Glazed Donut", "Chocolate Donut", "Cinnamon Roll", "Cookies", "Brownies", "Cupcakes", "Cheesecake Slice", "Ice Cream Sundae", "Soft Serve Ice Cream", "Milkshake", "Frozen Yogurt", "Ice Cream Sandwich", "Loukoumades"].map((name, idx) => ({ 
    category: "Desserts & Sweets", name, price: "7.00", desc: `Indulgent ${name} to satisfy your sweet tooth, crafted with premium sugars and creams.`, img: dessertImgs[idx % dessertImgs.length], isSignature: false 
  }))
];

// Obeležavamo signature zvezdice nasumično na par mesta
RAW_GLOBAL_ITEMS[0].isSignature = true; // Hamburger
RAW_GLOBAL_ITEMS[100].isSignature = true; // Tacos
RAW_GLOBAL_ITEMS[200].isSignature = true; // Fries
RAW_GLOBAL_ITEMS[300].isSignature = true; // Sushi

export const GLOBAL_STREET_MENU = {
  restaurantName: "V8 Global Food Court",
  themeColor: "#ef4444", // V8 Racing Red boja
  currency: "$",
  items: RAW_GLOBAL_ITEMS
};
// KRAJ FAJLA