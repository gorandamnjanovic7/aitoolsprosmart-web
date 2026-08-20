// POČETAK FAJLA: src/data/v8SmartImageHelper.js
import { V8_IMAGE_BANK } from './v8ImageBank.js';

// V10: Značajno proširen i kategorizovan bazen HD rezervnih slika
const FALLBACK_CATEGORIES = {
  meat: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559742811-822873691fc8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80"
  ],
  seafood: [
    "https://images.unsplash.com/photo-1615141982883-c7da0e698b00?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=800&q=80"
  ],
  pizza: [
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80"
  ],
  pasta: [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80"
  ],
  soup: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604152135912-04a022e23696?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554502078-ef0df4aca141?auto=format&fit=crop&w=800&q=80"
  ],
  salad: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  ],
  fastfood: [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", 
    "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
  ],
  drink: [
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80"
  ],
  dessert: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
  ]
};

// V10 Smart Engine: Pametna pretraga ključnih reči na više jezika
const detectCategory = (dishName) => {
  if (!dishName) return 'general';
  const name = dishName.toLowerCase();

  const keywords = {
    seafood: ['fish', 'salmon', 'shrimp', 'squid', 'octopus', 'calamari', 'seafood', 'pesce', 'vongole', 'cozze', 'camarón', 'ceviche', 'crab', 'lobster', 'caviar'],
    meat: ['beef', 'steak', 'pork', 'lamb', 'meat', 'kebab', 'chicken', 'duck', 'veal', 'prosciutto', 'salsiccia', 'asada', 'carnitas', 'pollo', 'sausage', 'gyros', 'souvlaki'],
    pizza: ['pizza', 'calzone', 'focaccia', 'pide', 'lahmacun', 'stromboli'],
    pasta: ['pasta', 'spaghetti', 'ravioli', 'macaroni', 'noodles', 'penne', 'gnocchi', 'lasagne', 'fettuccine', 'linguine', 'pad thai'],
    soup: ['soup', 'stew', 'broth', 'chowder', 'zuppa', 'potage', 'borscht', 'minestrone', 'čorba', 'pozole', 'ramen'],
    salad: ['salad', 'greens', 'caprese', 'insalata', 'ensalada', 'meze'],
    fastfood: ['burger', 'sandwich', 'wrap', 'taco', 'burrito', 'quesadilla', 'shawarma', 'fries', 'nachos', 'bánh mì'],
    drink: ['coffee', 'tea', 'wine', 'cocktail', 'beverage', 'espresso', 'caffè', 'latte', 'cappuccino', 'frappé', 'margarita'],
    dessert: ['cake', 'sweet', 'dessert', 'chocolate', 'cream', 'tart', 'blini', 'tiramisu', 'cannoli', 'gelato', 'baklava', 'churros', 'pudding', 'ice cream', 'pie', 'macaron', 'waffle']
  };

  // Algoritam pronalazi prvu kategoriju čija se reč poklapa sa imenom jela
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => name.includes(word))) {
      return category;
    }
  }

  return 'general'; // Ako ništa ne pronađe, vraća opštu sliku hrane
};

export const getImageForDish = (dishName) => {
  // 1. Provera tačne slike u banci (glavni prioritet)
  if (V8_IMAGE_BANK && V8_IMAGE_BANK[dishName]) {
    return V8_IMAGE_BANK[dishName];
  }
  
  // 2. Pronalaženje tačne kategorije za Fallback (Smart Engine)
  const category = detectCategory(dishName);
  const pool = FALLBACK_CATEGORIES[category] || FALLBACK_CATEGORIES.general;
  
  // 3. Dosledno dodeljivanje jedne slike iz bazena pomoću hash-a
  let hash = 0;
  for (let i = 0; i < dishName.length; i++) {
    hash = dishName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % pool.length;
  
  return pool[index];
};
// KRAJ FAJLA: src/data/v8SmartImageHelper.js