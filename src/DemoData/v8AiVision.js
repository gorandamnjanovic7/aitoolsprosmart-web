// POČETAK FAJLA: src/DemoData/v8AiVision.js

// 🔥 CENTRALNI V8 AI VISION ENGINE 🔥
// Ova funkcija prima ime jela i tip kuhinje, pa generiše savršenu prompt komandu za AI.
export const generateAiImage = (dishName, cuisineStyle) => {
  const prompt = `${dishName}, delicious ${cuisineStyle} food photography, professional plating, moody dark background, 8k resolution, cinematic lighting`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=400&nologo=true`;
};

// KRAJ FAJLA: src/DemoData/v8AiVision.js