// POČETAK FAJLA: src/data/v8SmartImageHelper.js
import { V8_IMAGE_BANK } from './v8ImageBank.js';

// Tematski razdvojene slike kako se meso i dezerti više nikad ne bi pomešali
const FALLBACK_CATEGORIES = {
  meat: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1559742811-822873691fc8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80"
  ],
  dessert: [
    "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80"
  ],
  pasta: [
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1516685018646-549198525c1b?auto=format&fit=crop&w=800&q=80"
  ],
  salad: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80"
  ]
};

// Pomoćna funkcija koja prepoznaje o kakvoj se hrani radi na osnovu imena
const detectCategory = (dishName) => {
  const lowerName = dishName.toLowerCase();
  
  if (lowerName.includes('beef') || lowerName.includes('steak') || lowerName.includes('pork') || lowerName.includes('lamb') || lowerName.includes('meat') || lowerName.includes('kebab') || lowerName.includes('chicken') || lowerName.includes('duck')) {
    return 'meat';
  }
  if (lowerName.includes('cake') || lowerName.includes('sweet') || lowerName.includes('dessert') || lowerName.includes('chocolate') || lowerName.includes('cream') || lowerName.includes('tart') || lowerName.includes('blini')) {
    return 'dessert';
  }
  if (lowerName.includes('pasta') || lowerName.includes('spaghetti') || lowerName.includes('ravioli') || lowerName.includes('macaroni') || lowerName.includes('noodles')) {
    return 'pasta';
  }
  if (lowerName.includes('salad') || lowerName.includes('greens')) {
    return 'salad';
  }
  
  return 'general';
};

export const getImageForDish = (dishName) => {
  // 1. Ako slika postoji tačno za to jelo u Image Banci, vrati je.
  if (V8_IMAGE_BANK && V8_IMAGE_BANK[dishName]) {
    return V8_IMAGE_BANK[dishName];
  }
  
  // 2. Ako ne postoji, otkrij kategoriju na osnovu imena (da ne meša meso i kolače)
  const category = detectCategory(dishName);
  const pool = FALLBACK_CATEGORIES[category] || FALLBACK_CATEGORIES.general;
  
  // 3. Dosledno izvuci sliku iz tačnog bazena
  let hash = 0;
  for (let i = 0; i < dishName.length; i++) {
    hash = dishName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % pool.length;
  
  return pool[index];
};
// KRAJ FAJLA: src/data/v8SmartImageHelper.jss