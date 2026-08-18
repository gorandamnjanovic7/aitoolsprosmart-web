// POČETAK FAJLA: src/DemoData/turkishMassiveData.js
import { generateAiImage } from '../v8AiVision.js';

const RAW_TURKISH_ITEMS = [
  ...["Adana Kebab", "Urfa Kebab", "İskender Kebab", "Şiş Kebab", "Patlıcan Kebabı", "Beyti Kebab", "Testi Kebabı", "Cağ Kebabı", "Çöp Şiş", "Tavuk Şiş", "Kuzu Şiş", "Ali Nazik Kebabı", "Orman Kebabı", "Tas Kebabı", "Tepsi Kebabı", "Kağıt Kebabı"].map((name, idx) => ({ 
      category: "Kebab Specijaliteti", name, price: "280.00", 
      desc: `A premium and authentic serving of ${name}, expertly seasoned and fire-roasted over traditional charcoal.`, 
      img: generateAiImage(name, "authentic premium Turkish food, fine dining presentation"), 
      isSignature: idx === 0 || idx === 2 
  })),

  ...["Döner Kebab", "Et Döner", "Tavuk Döner", "Tantuni", "Kokoreç", "Midye Dolma", "Balık Ekmek", "İçli Köfte", "Simit", "Kumpir"].map((name, idx) => ({ 
      category: "Döner & Street Food", name, price: "180.00", 
      desc: `The quintessential taste of Istanbul streets. Our ${name} is crafted with the highest quality ingredients for a gourmet street food experience.`, 
      img: generateAiImage(name, "authentic premium Turkish street food, gourmet presentation"), 
      isSignature: idx === 0 || idx === 3 
  })),

  ...["Köfte", "İnegöl Köfte", "İzmir Köfte", "Tekirdağ Köftesi", "Akçaabat Köftesi", "Kasap Köfte", "Çiğ Köfte", "Kadınbudu Köfte", "Hasanpaşa Köfte", "Sulu Köfte", "Mercimek Köftesi"].map((name, idx) => ({ 
      category: "Köfte (Turske Ćufte)", name, price: "200.00", 
      desc: `Traditional ${name}, kneaded with heirloom spices and cooked to perfection for a deeply savory, melt-in-your-mouth bite.`, 
      img: generateAiImage(name, "authentic premium Turkish kofte, fine dining presentation"), 
      isSignature: false 
  })),

  ...["Pide", "Kıymalı Pide", "Kuşbaşılı Pide", "Kaşarlı Pide", "Sucuklu Pide", "Karışık Pide", "Lahmacun", "Etli Ekmek", "Gözleme", "Börek", "Su Böreği", "Sigara Böreği", "Paçanga Böreği", "Kol Böreği", "Çi Börek", "Talaş Böreği", "Tepsi Böreği"].map((name, idx) => ({ 
      category: "Pide, Lahmacun & Börek", name, price: "150.00", 
      desc: `Hand-rolled dough baked in a wood-fired stone oven. This exquisite ${name} is crispy, golden, and packed with rich flavors.`, 
      img: generateAiImage(name, "authentic premium Turkish pide pastry, gourmet presentation"), 
      isSignature: name === "Lahmacun" 
  })),

  ...["Menemen", "Sucuklu Yumurta", "Kavurmalı Yumurta", "Çılbır", "Kaygana", "Kuymak", "Muhlama", "Katmer", "Bazlama", "Ramazan Pidesi", "Yufka", "Lavaş", "Açma", "Poğaça", "Boyoz", "Gözleme sa sirom", "Gözleme sa spanaćem", "Gözleme sa krompirom"].map((name, idx) => ({ 
      category: "Kahvaltı (Turski Doručak)", name, price: "120.00", 
      desc: `Start the day like a Sultan. A fresh and hearty ${name} made with farm-to-table organic ingredients.`, 
      img: generateAiImage(name, "authentic premium Turkish breakfast food, gourmet presentation"), 
      isSignature: name === "Menemen" || name === "Çılbır" 
  })),

  ...["Mercimek Çorbası", "Ezogelin Çorbası", "Tarhana Çorbası", "Yayla Çorbası", "İşkembe Çorbası", "Kelle Paça Çorbası", "Düğün Çorbası", "Tavuk Çorbası", "Domates Çorbası", "Sebze Çorbası", "Bamya Çorbası", "Ayran Aşı Çorbası"].map((name, idx) => ({ 
      category: "Çorbalar (Supe i Čorbe)", name, price: "90.00", 
      desc: `A comforting and deeply flavorful bowl of traditional ${name}, simmered slowly for hours to release maximum taste.`, 
      img: generateAiImage(name, "authentic premium Turkish soup, fine dining presentation"), 
      isSignature: false 
  })),

  ...["İmam Bayıldı", "Karnıyarık", "Hünkar Beğendi", "Patlıcan Musakka", "Patlıcan Oturtma", "Zeytinyağlı Fasulye", "Kuru Fasulye", "Barbunya Pilaki", "Nohut Yemeği", "Türlü", "Güveç", "Etli Güveç", "Sebzeli Güveç", "Kuzu Tandır", "Kuzu İncik", "Kavurma", "Sac Kavurma", "Et Sote", "Tavuk Sote", "Etli Nohut", "Etli Kuru Fasulye", "Etli Bamya", "Etli Patlıcan", "Etli Bezelye", "Kapama", "Ankara Tava", "Elbasan Tava", "Kilis Tava", "Arnavut Ciğeri", "Edirne Tava Ciğeri", "Ciğer Şiş", "Mumbar Dolması", "Şırdan", "İşkembe Dolması", "Kuzu Dolması"].map((name, idx) => ({ 
      category: "Tradicionalna Glavna Jela", name, price: "260.00", 
      desc: `The crown jewel of Ottoman cuisine. Our ${name} is slow-cooked to absolute tenderness with the finest regional spices.`, 
      img: generateAiImage(name, "authentic premium Turkish main dish, fine dining presentation"), 
      isSignature: name === "Kuzu Tandır" || name === "Hünkar Beğendi" 
  })),

  ...["Perde Pilavı", "İç Pilav", "Pilav", "Bulgur Pilavı", "Şehriyeli Pilav", "Domatesli Bulgur Pilavı", "Meyhane Pilavı", "Keşkek", "Mantı", "Kayseri Mantısı", "Sinop Mantısı", "Hingel", "Erişte", "Makarna"].map((name, idx) => ({ 
      category: "Pilav i Testenine", name, price: "180.00", 
      desc: `A masterclass in texture and flavor, this authentic ${name} is prepared with the finest grains and rich local butter.`, 
      img: generateAiImage(name, "authentic premium Turkish pilaf manti, fine dining presentation"), 
      isSignature: name === "Kayseri Mantısı" || name === "Perde Pilavı" 
  })),

  ...["Yaprak Sarma", "Etli Yaprak Sarma", "Zeytinyağlı Yaprak Sarma", "Biber Dolması", "Patlıcan Dolması", "Kabak Dolması", "Soğan Dolması", "Domates Dolması", "Lahana Sarması", "Pazı Sarması", "Kuru Patlıcan Dolması", "Kuru Biber Dolması"].map((name, idx) => ({ 
      category: "Dolma & Sarma", name, price: "160.00", 
      desc: `Exquisitely crafted ${name}, carefully stuffed and simmered slowly in rich sauces to ensure a burst of Mediterranean flavors.`, 
      img: generateAiImage(name, "authentic premium Turkish dolma sarma, fine dining presentation"), 
      isSignature: false 
  })),

  ...["Midye Tava", "Hamsi Tava", "Hamsili Pilav", "Palamut Tava", "Levrek Izgara", "Çipura Izgara", "Kalamar Tava", "Karides Güveç", "Ahtapot Salatası"].map((name, idx) => ({ 
      category: "Morski Specijaliteti", name, price: "300.00", 
      desc: `Freshly caught from the Bosphorus and Mediterranean seas. The ${name} is expertly grilled or fried to preserve its delicate, natural taste.`, 
      img: generateAiImage(name, "authentic premium Turkish seafood, fine dining presentation"), 
      isSignature: false 
  })),

  ...["Zeytinyağlı Enginar", "Zeytinyağlı Pırasa", "Zeytinyağlı Kereviz", "Zeytinyağlı Taze Fasulye", "Zeytinyağlı Barbunya", "Şakşuka", "Mücver", "Patlıcan Salatası", "Acılı Ezme", "Haydari", "Cacık", "Humus", "Babagannuş", "Atom", "Muhammara", "Piyaz", "Gavurdağı Salatası", "Çoban Salatası", "Kısır", "Patates Salatası", "Semizotu Salatası", "Yoğurtlu Patlıcan", "Yoğurtlu Havuç", "Tarator", "Fava", "Topik", "Lakerda", "Turşu"].map((name, idx) => ({ 
      category: "Meze, Salate i Hladna Jela", name, price: "110.00", 
      desc: `Vibrant and refreshing ${name}, an essential cold meze made with premium olive oil, fresh vegetables, and regional herbs.`, 
      img: generateAiImage(name, "authentic premium Turkish meze salad, fine dining presentation"), 
      isSignature: false 
  })),

  ...["Beyaz Peynir", "Tulum Peyniri", "Ezine Peyniri", "Kaşar Peyniri", "Lor Peyniri", "Kaymak", "Pastırma", "Sucuk", "Kavurma", "Bal Kaymak", "Tahin Pekmez", "Reçel"].map((name, idx) => ({ 
      category: "Peynir & Šarkuteri (Sirevi i Delikates)", name, price: "140.00", 
      desc: `An exclusive selection of artisanal ${name}, sourced from the finest traditional Turkish producers.`, 
      img: generateAiImage(name, "authentic premium Turkish cheese deli, fine dining presentation"), 
      isSignature: false 
  })),

  ...["Baklava", "Fıstıklı Baklava", "Cevizli Baklava", "Şöbiyet", "Bülbül Yuvası", "Saray Sarması", "Burma Kadayıf", "Tel Kadayıf", "Künefe", "Lokma", "Tulumba Tatlısı", "Revani", "Şekerpare", "Kalburabastı", "Kemalpaşa Tatlısı", "Hanım Göbeği", "Dilber Dudağı", "Vezir Parmağı", "Halka Tatlısı", "Güllaç", "Sütlaç", "Kazandibi", "Tavuk Göğsü", "Keşkül", "Muhallebi", "Supangle", "Aşure", "Zerde", "İrmik Helvası", "Un Helvası", "Tahin Helvası", "Pişmaniye", "Lokum", "Akide Şekeri", "Cezerye", "Pestil", "Köme", "Maraş Dondurması", "Ayva Tatlısı", "Kabak Tatlısı", "İncir Tatlısı", "Ekmek Kadayıfı", "Höşmerim", "Nevzine Tatlısı", "Laz Böreği", "Trileçe"].map((name, idx) => ({ 
      category: "Tatlılar (Turski Dezerti)", name, price: "150.00", 
      desc: `A masterful sweet ending. This ${name} blends traditional techniques with rich, indulgent flavors, dripping in premium syrup or milk.`, 
      img: generateAiImage(name, "authentic premium Turkish dessert baklava, gourmet presentation"), 
      isSignature: name === "Baklava" || name === "Künefe" 
  })),

  ...["Türk Kahvesi", "Çay", "Ayran", "Şalgam Suyu", "Salep", "Boza", "Limonata", "Komposto", "Hoşaf"].map((name, idx) => ({ 
      category: "İçecekler (Pića i Napici)", name, price: "60.00", 
      desc: `The authentic Turkish experience. A perfectly prepared, refreshing or warming cup of ${name}.`, 
      img: generateAiImage(name, "authentic premium Turkish drink coffee tea, fine dining presentation"), 
      isSignature: name === "Türk Kahvesi" 
  }))
];

export const TURKISH_MASSIVE_MENU = { 
    restaurantName: "Topkapı Sarayı Sofrası", 
    themeColor: "#b91c1c", // Turska crvena
    currency: "₺", 
    items: RAW_TURKISH_ITEMS 
};
// KRAJ FAJLA: src/DemoData/turkishMassiveData.js