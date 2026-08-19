// POČETAK FAJLA: src/DemoData/frenchMassiveData.js
import { getImageForDish } from '../qrcode/v8ImageBank.js';

export const FRENCH_MASSIVE_MENU = { 
  restaurantName: "La Maison", 
  themeColor: "#a855f7", 
  currency: "€", 
  items: [
    // --- PLATS PRINCIPAUX (Glavna Jela) ---
    { 
      category: "Plats Principaux", 
      name: "Coq au Vin", 
      price: "28.00", 
      desc: "A legendary rustic masterpiece of French gastronomy. A whole, farm-raised rooster is slowly braised for hours in a robust red Burgundy wine, along with earthy wild mushrooms, savory smoked pork lardons, and sweet pearl onions until the meat literally falls off the bone.", 
      img: getImageForDish("Coq au Vin"), 
      isSignature: true 
    },
    { 
      category: "Plats Principaux", 
      name: "Boeuf Bourguignon", 
      price: "32.00", 
      desc: "The ultimate French comfort food. Prime cuts of Charolais beef are marinated and slow-simmered in a rich, velvety Pinot Noir reduction, complemented by tender carrots, bouquet garni, and caramelized pearl onions. Served with buttery potato purée.", 
      img: getImageForDish("Boeuf Bourguignon"), 
      isSignature: true 
    },
    { 
      category: "Plats Principaux", 
      name: "Chateaubriand", 
      price: "85.00", 
      desc: "An extravagant cut from the center of the beef tenderloin, roasted to an absolute perfect medium-rare. Carved tableside and served with a classic, tarragon-infused sauce Béarnaise and crispy pommes soufflées. Designed to be shared.", 
      img: getImageForDish("Chateaubriand"), 
      isSignature: true 
    },
    { 
      category: "Plats Principaux", 
      name: "Confit de Canard", 
      price: "35.00", 
      desc: "A triumph of preservation and patience from Gascony. A plump duck leg is cured in coarse sea salt and herbs, then slowly poached in its own rendered fat until meltingly tender. Flash-roasted before serving for a shatteringly crisp skin. Accompanied by garlic-roasted potatoes.", 
      img: getImageForDish("Confit de Canard"), 
      isSignature: false 
    },
    { 
      category: "Plats Principaux", 
      name: "Steak au Poivre", 
      price: "42.00", 
      desc: "A thick, prime filet mignon heavily crusted with cracked black peppercorns, pan-seared to lock in the juices, and spectacularly flambéed in Cognac. Finished with a lush, heavy cream reduction that perfectly balances the peppery heat.", 
      img: getImageForDish("Steak au Poivre"), 
      isSignature: true 
    },
    { 
      category: "Plats Principaux", 
      name: "Navarin d’Agneau", 
      price: "33.00", 
      desc: "A delicate and vibrant spring lamb stew. Tender morsels of lamb shoulder are braised in a light, white wine and tomato broth, featuring sweet baby carrots, fresh spring peas, and young turnips. A celebration of seasonal French agriculture.", 
      img: getImageForDish("Navarin d’Agneau"), 
      isSignature: false 
    },

    // --- POISSONS ET FRUITS DE MER (Riba i Plodovi mora) ---
    { 
      category: "Poissons et Fruits de Mer", 
      name: "Bouillabaisse", 
      price: "45.00", 
      desc: "The legendary, aromatic fish stew originating from the port of Marseille. A complex saffron and fennel-infused broth overflowing with scorpion fish, monkfish, mussels, and clams. Served traditionally with toasted baguette slices and a spicy, garlic-heavy rouille.", 
      img: getImageForDish("Bouillabaisse"), 
      isSignature: true 
    },
    { 
      category: "Poissons et Fruits de Mer", 
      name: "Sole Meunière", 
      price: "42.00", 
      desc: "A classic of refined simplicity. A whole, fresh Dover sole is lightly dusted in seasoned flour and pan-fried in foaming butter until golden. Finished with a squeeze of fresh lemon, chopped parsley, and a drizzle of nutty brown butter (beurre noisette).", 
      img: getImageForDish("Sole Meunière"), 
      isSignature: true 
    },
    { 
      category: "Poissons et Fruits de Mer", 
      name: "Coquilles Saint-Jacques", 
      price: "36.00", 
      desc: "Giant, sweet sea scallops pan-seared to a perfect caramelization on the outside while remaining translucent inside. Served over a velvety puree of cauliflower and drizzled with a sophisticated white wine and shallot beurre blanc.", 
      img: getImageForDish("Coquilles Saint-Jacques"), 
      isSignature: false 
    },
    { 
      category: "Poissons et Fruits de Mer", 
      name: "Moules Marinières", 
      price: "24.00", 
      desc: "A colossal bowl of fresh, jet-black mussels steamed rapidly in a fragrant broth of dry white wine, melted butter, minced shallots, and fresh parsley. Served with endless slices of crusty baguette to soak up the oceanic juices.", 
      img: getImageForDish("Moules Marinières"), 
      isSignature: false 
    },

    // --- ENTRÉES CHAUDES ET FROIDES (Topla i hladna predjela) ---
    { 
      category: "Entrées (Predjela)", 
      name: "Soupe à l’Oignon Gratinée", 
      price: "14.00", 
      desc: "The world-famous French onion soup. Sweet onions are caramelized for hours until deeply mahogany in color, deglazed with cognac, and simmered in an intense beef broth. Crowned with a massive crouton and a bubbling, golden crust of melted Gruyère cheese.", 
      img: getImageForDish("Soupe à l’Oignon Gratinée"), 
      isSignature: true 
    },
    { 
      category: "Entrées (Predjela)", 
      name: "Escargots de Bourgogne", 
      price: "18.00", 
      desc: "A half-dozen plump, tender Burgundy snails served traditionally in their shells. They are baked in an outrageously flavorful, foaming butter heavily compounded with fresh garlic, shallots, and parsley. A true staple of Parisian bistros.", 
      img: getImageForDish("Escargots de Bourgogne"), 
      isSignature: true 
    },
    { 
      category: "Entrées (Predjela)", 
      name: "Foie Gras Poêlé", 
      price: "35.00", 
      desc: "A decadent, luxurious appetizer. Thick slices of the highest grade fresh duck liver are rapidly pan-seared in a dry, smoking-hot skillet to create a caramelized crust around a liquid, melting center. Served with a tart fig compote and toasted brioche.", 
      img: getImageForDish("Foie Gras Poêlé"), 
      isSignature: true 
    },
    { 
      category: "Entrées (Predjela)", 
      name: "Quiche Lorraine", 
      price: "15.00", 
      desc: "The quintessential French savory tart. A buttery, flaky shortcrust pastry shell is filled with a rich, quivering custard of heavy cream and fresh eggs, studded generously with smoked bacon lardons and a hint of nutmeg.", 
      img: getImageForDish("Quiche Lorraine"), 
      isSignature: false 
    },
    { 
      category: "Entrées (Predjela)", 
      name: "Croque Monsieur", 
      price: "14.00", 
      desc: "The ultimate Parisian café sandwich. High-quality artisanal ham and Gruyère cheese are layered between thick slices of pain de mie, smothered entirely in a rich, nutmeg-scented béchamel sauce, and baked until bubbling and browned.", 
      img: getImageForDish("Croque Monsieur"), 
      isSignature: false 
    },
    { 
      category: "Entrées (Predjela)", 
      name: "Salade Niçoise", 
      price: "17.00", 
      desc: "A vibrant, composed salad hailing from the French Riviera. Crisp mixed greens topped with oil-cured tuna, blanched haricots verts, boiled baby potatoes, hard-boiled eggs, Niçoise olives, and anchovies, dressed in a sharp Dijon vinaigrette.", 
      img: getImageForDish("Salade Niçoise"), 
      isSignature: false 
    },

    // --- GARNITURES ET LÉGUMES (Prilozi i povrće) ---
    { 
      category: "Garnitures (Prilozi)", 
      name: "Ratatouille", 
      price: "12.00", 
      desc: "A sun-drenched Provençal vegetable stew. Zucchini, eggplant, bell peppers, and tomatoes are slowly simmered together with garlic, thyme, and high-quality olive oil until they melt into a profoundly flavorful, silky medley.", 
      img: getImageForDish("Ratatouille"), 
      isSignature: false 
    },
    { 
      category: "Garnitures (Prilozi)", 
      name: "Gratin Dauphinois", 
      price: "14.00", 
      desc: "A luxurious and deeply comforting side dish from the Dauphiné region. Microscopically thin slices of potato are layered in a baking dish, submerged in rich, garlic-infused heavy cream, and baked slowly until the top forms a savory, golden-brown crust.", 
      img: getImageForDish("Gratin Dauphinois"), 
      isSignature: true 
    },

    // --- LES DESSERTS (Poslastice) ---
    { 
      category: "Desserts", 
      name: "Crème Brûlée", 
      price: "11.00", 
      desc: "A study in contrasting textures. A cool, impossibly rich and silky custard intensely flavored with real Madagascar vanilla beans, concealed beneath a brittle, glass-like layer of hard caramel that must be shattered with your spoon.", 
      img: getImageForDish("Crème Brûlée"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Tarte Tatin", 
      price: "12.00", 
      desc: "An accidental masterpiece of the French culinary repertoire. Apples are slowly cooked in a skillet with butter and sugar until deeply caramelized, then covered in puff pastry and baked. Inverted upon serving to reveal a glorious, sticky, glistening fruit tart.", 
      img: getImageForDish("Tarte Tatin"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Mille-Feuille", 
      price: "11.50", 
      desc: "The 'thousand leaves' pastry. Three layers of extraordinarily flaky, buttery puff pastry sandwiching two thick layers of smooth, vanilla-flecked crème pâtissière (pastry cream). Topped with a delicate fondant and chocolate chevron glaze.", 
      img: getImageForDish("Mille-Feuille"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Soufflé au Chocolat", 
      price: "16.00", 
      desc: "An ephemeral, towering testament to French technique. This incredibly airy, deeply intense dark chocolate dessert is baked to order, rising dramatically above its ramekin with a slight crust on the outside and a molten, cloud-like interior.", 
      img: getImageForDish("Soufflé au Chocolat"), 
      isSignature: true 
    },
    { 
      category: "Desserts", 
      name: "Macarons Assortis", 
      price: "14.00", 
      desc: "A jewelry box of Parisian elegance. Five delicate, almond-meringue cookies with a shattered crisp shell and a chewy interior, sandwiching an array of exquisite fillings including pistachio ganache, raspberry jam, and salted caramel buttercream.", 
      img: getImageForDish("Macarons Assortis"), 
      isSignature: false 
    },
    { 
      category: "Desserts", 
      name: "Croissant au Beurre", 
      price: "4.50", 
      desc: "The gold standard of French viennoiserie. A crescent of dough laminated with premium Normandy butter, resulting in a pastry that is simultaneously shatteringly crisp on the outside and wonderfully soft, elastic, and airy on the inside.", 
      img: getImageForDish("Croissant au Beurre"), 
      isSignature: false 
    },

    // --- CAFÉ ET BOISSONS (Kafa i Pića) ---
    { 
      category: "Café et Boissons", 
      name: "Espresso Noir", 
      price: "3.50", 
      desc: "A profoundly intense, short shot of darkly roasted Arabica beans, extracted under high pressure to produce a thick, hazelnut-colored crema. The quintessential conclusion to a rich French meal.", 
      img: getImageForDish("Espresso Noir"), 
      isSignature: false 
    },
    { 
      category: "Café et Boissons", 
      name: "Café au Lait", 
      price: "5.50", 
      desc: "A Parisian breakfast necessity. A double shot of strong espresso mixed generously with steaming hot milk, creating a comforting, creamy beverage.", 
      img: getImageForDish("Café au Lait"), 
      isSignature: false 
    }
  ]
};
// KRAJ FAJLA: src/DemoData/frenchMassiveData.js