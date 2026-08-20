// POČETAK FAJLA: src/data/v8SmartImageHelper.js
import { V8_IMAGE_BANK } from './v8ImageBank.js';

// Masivni rezervni pool vrhunskih slika
const FALLBACK_POOL = [
  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484723091791-0fee59ca0b26?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1496116218417-1a781b0c400c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1626200419188-f80e556e8284?auto=format&fit=crop&w=800&q=80"
];

// OVO JE BILO KLJUČNO: `export const`
export const getImageForDish = (dishName) => {
  if (V8_IMAGE_BANK && V8_IMAGE_BANK[dishName]) {
    return V8_IMAGE_BANK[dishName];
  }
  
  let hash = 0;
  for (let i = 0; i < dishName.length; i++) {
    hash = dishName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % FALLBACK_POOL.length;
  
  return FALLBACK_POOL[index];
};
// KRAJ FAJLA: src/data/v8SmartImageHelper.js