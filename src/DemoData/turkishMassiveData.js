// POČETAK FAJLA: src/DemoData/turkishMassiveData.js
import { getImageForDish } from '../qrcode/v8ImageBank.js';

export const TURKISH_MASSIVE_MENU = { 
  restaurantName: "Topkapı Sarayı Sofrası", 
  themeColor: "#b91c1c", 
  currency: "₺", 
  items: [
    { 
      category: "Kebab Specialties", 
      name: "Adana Kebab", 
      price: "320.00", 
      desc: "The fiery pride of southern Turkey. Hand-minced, highly spiced lamb kneaded with tail fat and red bell peppers, molded onto a wide iron skewer, and char-grilled over white-hot coals. Served over fire-roasted flatbread with sumac-dusted onions and charred tomatoes.", 
      img: getImageForDish("Adana Kebab"), 
      isSignature: true 
    },
    { 
      category: "Kebab Specialties", 
      name: "İskender Kebab", 
      price: "380.00", 
      desc: "A decadent masterpiece from Bursa. Paper-thin, crispy shavings of roasted döner meat layered heavily over cubed, toasted pita bread. It is violently drenched in a boiling, rich tomato sauce and bubbling browned sheep's butter, served alongside a thick dollop of strained yogurt.", 
      img: getImageForDish("İskender Kebab"), 
      isSignature: true 
    },
    { 
      category: "Kebab Specialties", 
      name: "Testi Kebabı", 
      price: "450.00", 
      desc: "A spectacular Cappadocian clay pot kebab. Tender cubes of beef and lamb, tomatoes, garlic, and green peppers are sealed shut inside an authentic terracotta jug and slow-baked for hours in embers. The pot is dramatically cracked open with a sword directly at your table.", 
      img: getImageForDish("Testi Kebabı"), 
      isSignature: true 
    },
    { 
      category: "Kebab Specialties", 
      name: "Şiş Kebab", 
      price: "290.00", 
      desc: "Prime cuts of incredibly tender, milk-fed lamb, marinated overnight in an emulsion of olive oil, yogurt, garlic, and wild thyme. Threaded onto skewers and grilled to a perfect medium-rare pink center, locking in the smoky juices.", 
      img: getImageForDish("Şiş Kebab"), 
      isSignature: false 
    },
    { 
      category: "Kebab Specialties", 
      name: "Ali Nazik Kebabı", 
      price: "340.00", 
      desc: "An elegant, smoky Ottoman palace dish. Succulent, spiced chunks of pan-seared lamb rest on a bed of silky, fire-roasted eggplant puree that has been heavily folded with garlic-infused strained yogurt.", 
      img: getImageForDish("Ali Nazik Kebabı"), 
      isSignature: true 
    },
    { 
      category: "Döner & Street Food", 
      name: "Et Döner", 
      price: "220.00", 
      desc: "Premium, 100% beef and lamb leaf-thin cuts, stacked and slow-roasted on a vertical rotisserie until the edges are dark and crispy. Shaved to order and served plain on a plate with buttery rice, grilled peppers, and blistered tomatoes.", 
      img: getImageForDish("Et Döner"), 
      isSignature: false 
    },
    { 
      category: "Döner & Street Food", 
      name: "Kokoreç", 
      price: "240.00", 
      desc: "The ultimate late-night Istanbul street food. Heavily spiced, herb-marinated sheep's intestines, wrapped around sweetbreads and horizontally spit-roasted over charcoal. Chopped violently on a wooden block and served inside a crusty, fat-soaked bread roll.", 
      img: getImageForDish("Kokoreç"), 
      isSignature: true 
    },
    { 
      category: "Döner & Street Food", 
      name: "Balık Ekmek", 
      price: "170.00", 
      desc: "The iconic fish sandwich from the shores of the Bosphorus. A thick fillet of fresh mackerel, perfectly grilled and stuffed into a fluffy white loaf with crisp lettuce, raw white onions, and a generous squeeze of fresh lemon juice.", 
      img: getImageForDish("Balık Ekmek"), 
      isSignature: false 
    },
    { 
      category: "Döner & Street Food", 
      name: "Midye Dolma", 
      price: "120.00", 
      desc: "A street food delicacy: half a dozen plump, coastal mussels meticulously stuffed with a sweet and heavily spiced mixture of aromatic rice, pine nuts, cinnamon, and black currants. Eaten cold with a heavy squeeze of lemon.", 
      img: getImageForDish("Midye Dolma"), 
      isSignature: true 
    },
    { 
      category: "Pide & Börek", 
      name: "Lahmacun", 
      price: "110.00", 
      desc: "Often called Turkish Pizza. An impossibly thin, round flatbread smeared with a highly seasoned, spicy paste of minced lamb, tomatoes, red pepper, and parsley. Baked rapidly in a wood-fired oven. Eaten rolled up with fresh parsley and lemon.", 
      img: getImageForDish("Lahmacun"), 
      isSignature: true 
    },
    { 
      category: "Pide & Börek", 
      name: "Karışık Pide", 
      price: "240.00", 
      desc: "A massive, boat-shaped flatbread with exceptionally crispy edges. Generously loaded with a mixed filling of spicy Turkish sucuk (sausage), tender beef cubes (kuşbaşı), and a thick, bubbling layer of melting kaşar cheese.", 
      img: getImageForDish("Karışık Pide"), 
      isSignature: false 
    },
    { 
      category: "Pide & Börek", 
      name: "Su Böreği", 
      price: "160.00", 
      desc: "The 'water börek', a notoriously difficult pastry to master. Sheets of handmade dough are boiled like pasta before being layered with bubbling butter, fresh parsley, and crumbly white cheese. Baked until the top is golden while the inside remains soft and incredibly moist.", 
      img: getImageForDish("Su Böreği"), 
      isSignature: true 
    },
    { 
      category: "Traditional Mains", 
      name: "Mantı", 
      price: "220.00", 
      desc: "Exquisite, handmade miniature Turkish dumplings. Dozens of tiny pasta bundles are stuffed with spiced ground meat, boiled, and served drowning in a sauce of garlic-infused yogurt, drizzled heavily with a fiery, mint-and-chili infused brown butter.", 
      img: getImageForDish("Mantı"), 
      isSignature: true 
    },
    { 
      category: "Traditional Mains", 
      name: "Kuzu Tandır", 
      price: "390.00", 
      desc: "An ancient Anatolian cooking method. Whole pieces of lamb are suspended over a pit oven (tandır) and slow-roasted for hours until the meat becomes so tender it shreds under the fork. Served with buttery rice pilaf and rich pan drippings.", 
      img: getImageForDish("Kuzu Tandır"), 
      isSignature: true 
    },
    { 
      category: "Traditional Mains", 
      name: "Karnıyarık", 
      price: "260.00", 
      desc: "A rich, hearty, homestyle classic. Whole eggplants are fried, split open down the middle, and generously stuffed with a heavily seasoned filling of ground beef, onions, garlic, and fresh tomatoes. Baked slowly in a savory tomato sauce.", 
      img: getImageForDish("Karnıyarık"), 
      isSignature: false 
    },
    { 
      category: "Traditional Mains", 
      name: "İmam Bayıldı", 
      price: "170.00", 
      desc: "Translating to 'The Imam Fainted'—presumably from its incredible taste. A vegan variation of Karnıyarık where the eggplant is stuffed to the brim with sweet caramelized onions, garlic, and tomatoes, drowned in high-quality olive oil, and served at room temperature.", 
      img: getImageForDish("İmam Bayıldı"), 
      isSignature: true 
    },
    { 
      category: "Breakfast & Soups", 
      name: "Mercimek Çorbası", 
      price: "85.00", 
      desc: "The soul of Turkish soup culture. A velvety, golden-yellow puree of red lentils, onions, and carrots, deeply flavored with a subtle hint of cumin. Served piping hot with a drizzle of chili-infused melted butter and a wedge of fresh lemon.", 
      img: getImageForDish("Mercimek Çorbası"), 
      isSignature: false 
    },
    { 
      category: "Breakfast & Soups", 
      name: "Menemen", 
      price: "130.00", 
      desc: "The ultimate Turkish breakfast skillet. Farm-fresh eggs are softly scrambled directly into a vigorously simmering, juicy base of sweet tomatoes, green peppers, and onions. Cooked in butter until just set, perfect for dipping crusty bread.", 
      img: getImageForDish("Menemen"), 
      isSignature: true 
    },
    { 
      category: "Breakfast & Soups", 
      name: "Simit & Kahvaltı Plate", 
      price: "190.00", 
      desc: "A rich morning spread featuring freshly baked Simit (a circular bread heavily encrusted with sesame seeds and molasses). Accompanied by feta cheese, olives, sliced tomatoes, cucumbers, honey, clotted cream (kaymak), and a boiled egg.", 
      img: getImageForDish("Simit & Kahvaltı Plate"), 
      isSignature: false 
    },
    { 
      category: "Breakfast & Soups", 
      name: "Haydari Meze", 
      price: "100.00", 
      desc: "A powerful, thick, and refreshing cold appetizer. Incredibly dense strained yogurt vigorously whisked with pungent raw garlic, fresh dill, mint, and a touch of olive oil. Served as the perfect cooling dip for warm pita bread.", 
      img: getImageForDish("Haydari Meze"), 
      isSignature: false 
    },
    { 
      category: "Desserts", 
      name: "Gaziantep Baklava", 
      price: "190.00", 
      desc: "The absolute pinnacle of Turkish sweets. 40 transparent, microscopic layers of hand-rolled phyllo dough, aggressively stuffed with the finest, vibrant green pistachios from Gaziantep. Baked in clarified butter until shattering and soaked in a warm sugar syrup.", 
      img: getImageForDish("Gaziantep Baklava"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Künefe", 
      price: "250.00", 
      desc: "The king of hot desserts. A disc of shredded, wiry kadayıf pastry encapsulating a thick layer of unsalted, incredibly stretchy melting cheese. Baked in a copper dish until deeply golden, drenched in hot syrup, and topped with crushed pistachios.", 
      img: getImageForDish("Künefe"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Sütlaç (Oven-Baked Rice Pudding)", 
      price: "110.00", 
      desc: "A comforting, creamy milk and rice pudding, lightly sweetened and flavored with vanilla. It is baked in individual clay bowls in a scorching hot oven until the top forms a dark, blistered, caramelized skin.", 
      img: getImageForDish("Sütlaç (Oven-Baked Rice Pudding)"), 
      isSignature: false 
    },
    { 
      category: "Desserts", 
      name: "Lokum (Turkish Delight)", 
      price: "105.00", 
      desc: "A premium selection of authentic, chewy gelatinous cubes. Flavored naturally with pure rosewater, mastic, and pomegranate, packed heavily with roasted pistachios, and dusted generously in powdered sugar.", 
      img: getImageForDish("Lokum (Turkish Delight)"), 
      isSignature: false 
    },
    { 
      category: "Beverages", 
      name: "Türk Kahvesi (Turkish Coffee)", 
      price: "70.00", 
      desc: "The most powerful coffee tradition in the world. Extremely fine, unfiltered coffee grounds are slowly boiled with sugar in a copper cezve over hot embers until a thick, dark foam forms. Served in an espresso-sized cup with a glass of water.", 
      img: getImageForDish("Türk Kahvesi (Turkish Coffee)"), 
      isSignature: true 
    },
    { 
      category: "Beverages", 
      name: "Turkish Çay", 
      price: "40.00", 
      desc: "The heartbeat of Turkish hospitality. Robust, dark, and highly steeped black tea from the Rize region, served boiling hot in a delicate, traditional tulip-shaped glass on a small saucer, with sugar cubes on the side.", 
      img: getImageForDish("Turkish Çay"), 
      isSignature: true 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/turkishMassiveData.js