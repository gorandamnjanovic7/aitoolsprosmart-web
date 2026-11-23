// ============================================================================
// src/pages/kits/restaurants/IgnisGoldRestaurant.jsx
// L'ATELIER IGNIS — Three Michelin Stars • Mayfair, London
// Cursive Great Vibes + Jost • Rounded Couture UI • Antigravity 3D
// 9 Interiors + 12 Food/Cocktail/Dessert Gallery + Grand Cru Wine Gallery
// 16:9 Cinema Placeholder + Visible Pricing + Free Sample Cloud
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Phone, ChevronRight, ChevronLeft, Star, Wine, Check, X,
  ArrowUpRight, ArrowLeft, ArrowRight, Crown, DownloadCloud, Lock,
  Play, Pause, Volume2, VolumeX, Link2, Eye, Flame, Award, Video, Film
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const WEBHOOK_URL = 'https://n8n-production-720dcf20.up.railway.app/webhook/v10-concierge-webhook';

// ============================================================================
// 16:9 VIDEO PLACEHOLDER SLOTS (PASTE YOUR .MP4 / .WEBM PATHS HERE)
// ============================================================================
const VIDEO_REEL_1_URL = ''; // e.g. '/restaurants/ignis-reel-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/restaurants/ignis-reel-02.mp4'

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-ignisgold-restaurant-349-link',
  buyoutZipLink: 'https://drive.google.com/your-ignisgold-restaurant-1490-link',
  freeSampleLink: 'https://drive.google.com/your-ignisgold-restaurant-sample-link',
  prevPageRoute: '/monarch-timepieces',
  prevPageLabel: 'Prev: Monarch Timepieces (5/5)',
  nextLandingRoute: '/villa-solis',
  nextLandingLabel: 'Next: Villa Solis Amalfi (2/3)'
};

const HERO_SLIDES = [
  {
    id: 'm-slide-1',
    accolade: 'Three Michelin Stars • Mayfair, London',
    titleLine1: 'Candlelight, Velvet',
    titleLine2: '& Live White Oak',
    subtitle:
      'An intimate twenty-eight seat dining room shaped by smoked walnut, Murano amber glass, Miyazaki A5 Wagyu over glowing embers, and 420 Grand Cru vintages.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2200&q=90'
  },
  {
    id: 'm-slide-2',
    accolade: 'The Sommelier Lounge & Subterranean Vault',
    titleLine1: 'Shadow, Crystal',
    titleLine2: '& Rare Vintages',
    subtitle:
      'Begin the evening at our Nero Marquina marble counter before descending into the 1945 Bordeaux and Burgundy cellar.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=2200&q=90'
  },
  {
    id: 'm-slide-3',
    accolade: 'The Hearth Counter • £295 Degustation',
    titleLine1: 'Architecture of',
    titleLine2: 'Elemental Fire',
    subtitle:
      'Twelve front-row seats facing the live hearth, where Executive Chef Julian Vance composes a nightly five-act tasting menu.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2200&q=90'
  }
];

const CINEMA_VIDEOS = [
  {
    id: 'reel-1',
    chapter: 'Chapter I • 16:9 UHD Hearth Film',
    title: 'Inside the Candlelit Salon & Hearth',
    desc: 'A quiet study of warm architectural shadows, hand-blown crystal, and live-fire gastronomy at 900°C.',
    poster: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1920&q=90'
  },
  {
    id: 'reel-2',
    chapter: 'Chapter II • 16:9 UHD Cellar Film',
    title: 'The Subterranean Cellar & Lounge',
    desc: 'Descending beneath Mayfair through velvet alcoves into our climate-sealed 1945 Grand Cru vault.',
    poster: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1920&q=90'
  }
];

const INTERIOR_SPACES = [
  {
    id: 'space-1',
    zone: 'Dining Rooms',
    tag: 'Main Salon • 28 Seats',
    title: 'The Obsidian Dining Room',
    specs: 'Smoked European oak, custom brass pendants, acoustic velvet ceiling',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-2',
    zone: 'Bar & Cellar',
    tag: 'Cocktail Sanctuary',
    title: 'Nero Marquina Marble Bar',
    specs: 'Backlit amber onyx, hand-carved Japanese ice, rare spirits library',
    url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-3',
    zone: 'Dining Rooms',
    tag: 'Chef’s Counter • 12 Seats',
    title: 'Open White-Oak Hearth Pass',
    specs: 'Front-row leather seating, 900°C Binchotan grill, hammered brass hood',
    url: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-4',
    zone: 'Private Suites',
    tag: 'Private Salon • 14 Guests',
    title: 'The Regent Banquet Room',
    specs: 'Bespoke walnut long-table, Riedel crystal, dedicated sommelier',
    url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-5',
    zone: 'Dining Rooms',
    tag: 'Intimate Alcoves',
    title: 'Amber & Cognac Banquettes',
    specs: 'Curved saddle-leather booths with pinpoint warm table lighting',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-6',
    zone: 'Bar & Cellar',
    tag: 'Subterranean Vault',
    title: 'The 1945 Grand Cru Cellar',
    specs: '420 Bordeaux & Burgundy allocations behind smoked bronze glass',
    url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-7',
    zone: 'Private Suites',
    tag: 'Evening Conservatory',
    title: 'Botanical Glasshouse Terrace',
    specs: 'Heated limestone floor, nocturnal greenery, candlelit tables',
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-8',
    zone: 'Dining Rooms',
    tag: 'Architectural Perspective',
    title: 'The Chandelier Gallery',
    specs: 'Double-height dark timber framing and hand-blown Murano globes',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'space-9',
    zone: 'Bar & Cellar',
    tag: 'Digestif Library',
    title: 'Smoked Oak & Cognac Salon',
    specs: 'Vintage Armagnac trolley, deep velvet club chairs, analog vinyl acoustics',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1500&q=85'
  }
];

const INTERIOR_FILTERS = ['All Spaces', 'Dining Rooms', 'Private Suites', 'Bar & Cellar'];

const TASTING_ACTS = [
  {
    roman: 'I',
    act: 'Prelude',
    name: 'Imperial Oscietra Caviar & Smoked Bone-Marrow Tartlet',
    pairing: 'Krug Grande Cuvée 171ème Édition',
    notes: 'Crisp charcoal pastry, warm beef tendon glaze, chilled caviar, delicate gold leaf.'
  },
  {
    roman: 'II',
    act: 'Raw & Pure',
    name: 'Hand-Dived Orkney Scallop & Shaved White Alba Truffle',
    pairing: '2019 Domaine Leflaive Puligny-Montrachet',
    notes: 'Cultured hazelnut cream, finger lime pearls, tableside Tuber magnatum.'
  },
  {
    roman: 'III',
    act: 'Coastal Ember',
    name: 'Binchotan-Roasted Native Blue Lobster & Saffron Velouté',
    pairing: '2018 Château Haut-Brion Blanc',
    notes: 'Reduced lobster coral emulsion, sea aster, smoked Normandy butter.'
  },
  {
    roman: 'IV',
    act: 'The White-Oak Hearth',
    name: 'Miyazaki A5 Wagyu Striploin Over 24-Month Aged Oak',
    pairing: '2010 Château Margaux Premier Grand Cru Classé',
    notes: 'Confit black garlic, charred wild Maitake, 48-hour Périgord truffle jus.'
  },
  {
    roman: 'V',
    act: 'Finale',
    name: 'Warm 75% Criollo Chocolate Sphere & 1976 Pedro Ximénez',
    pairing: 'Toro Albalá Don PX Convento Selección',
    notes: 'Roasted Piedmont hazelnut praline, Tahitian vanilla bean ice cream.'
  }
];

const CULINARY_FILTERS = ['All Creations', 'Haute Cuisine', 'Alchemy Cocktails', 'Pâtisserie & Desserts'];

const CULINARY_ITEMS = [
  {
    id: 1,
    name: 'Miyazaki A5 Wagyu Striploin',
    category: 'Haute Cuisine',
    price: '£165',
    prepTime: 'White-Oak Seared',
    tag: 'Signature',
    description: 'Japanese A5 striploin seared over glowing Binchotan charcoal, glazed in 48-hour Périgord black truffle jus with charred Maitake.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 2,
    name: '60-Day Salt-Aged Chateaubriand',
    category: 'Haute Cuisine',
    price: '£140',
    prepTime: 'Carved Tableside',
    tag: 'For Two',
    description: 'Himalayan salt-chamber aged tenderloin, roasted bone-marrow sabayon, confit black shallots, and smoked rosemary butter.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 3,
    name: 'Native Blue Lobster & Black Ink',
    category: 'Haute Cuisine',
    price: '£94',
    prepTime: 'Acquerello Risotto',
    tag: 'House Icon',
    description: 'Butter-poached Scottish blue lobster medallions over aged Acquerello risotto, cuttlefish ink reduction, and saffron.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 4,
    name: 'Wild Cornish Turbot & Oscietra',
    category: 'Haute Cuisine',
    price: '£88',
    prepTime: 'Hearth Roasted',
    tag: 'Royal Caviar',
    description: 'Turbot roasted on the bone over white-oak embers, Champagne beurre blanc crowned with Royal Oscietra caviar.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 5,
    name: 'Smoked Amber Negroni Reserve',
    category: 'Alchemy Cocktails',
    price: '£32',
    prepTime: 'White-Oak Cloche',
    tag: 'Bar Signature',
    description: 'Oak-aged botanical gin, vintage 1970s Italian bitter, and sweet vermouth infused with toasted orange zest over hand-carved crystal ice.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 6,
    name: 'Black Truffle & Cognac Old Fashioned',
    category: 'Alchemy Cocktails',
    price: '£38',
    prepTime: 'Fat-Washed XO',
    tag: 'Rare Spirits',
    description: 'XO Grande Champagne Cognac infused with Périgord black truffle, demerara ember syrup, and aromatic walnut bitters.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 7,
    name: 'Velvet Rose & Yuzu Martini',
    category: 'Alchemy Cocktails',
    price: '£29',
    prepTime: 'Chilled to -12°C',
    tag: 'Floral Alchemy',
    description: 'Japanese craft vodka, fresh Kochi yuzu distillation, Damask rose mist, and dry vermouth served in hand-blown crystal.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 8,
    name: 'Saffron & Champagne Royale',
    category: 'Alchemy Cocktails',
    price: '£42',
    prepTime: 'Poured Tableside',
    tag: 'Aperitif',
    description: 'Kashmiri saffron cordial, aged pear eau-de-vie, and vintage Blanc de Blancs Champagne finished with gold blossom.',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 9,
    name: 'Valrhona 75% & Alba Truffle Sphere',
    category: 'Pâtisserie & Desserts',
    price: '£34',
    prepTime: 'Warm Ganache',
    tag: 'Pastry Icon',
    description: 'Hand-tempered Criollo chocolate sphere melted tableside with warm cognac ganache, Piedmont hazelnut praline, and black truffle.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 10,
    name: 'Caramelized Tahitian Vanilla Mille-Feuille',
    category: 'Pâtisserie & Desserts',
    price: '£28',
    prepTime: 'Baked to Order',
    tag: 'Haute Pâtisserie',
    description: 'Paper-thin inverted puff pastry layered with Madagascar & Tahitian vanilla bean diplomat cream and salted Normandy butter caramel.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 11,
    name: 'Roasted Fig, Honey & Tonka Tart',
    category: 'Pâtisserie & Desserts',
    price: '£26',
    prepTime: 'Hearth Glazed',
    tag: 'Seasonal',
    description: 'Black Mission figs glazed in wild heather honey over almond frangipane, paired with smoked tonka bean crème glacée.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=85'
  },
  {
    id: 12,
    name: 'Gold-Leaf Espresso Tiramisu Soufflé',
    category: 'Pâtisserie & Desserts',
    price: '£31',
    prepTime: '18 Min Rise',
    tag: 'Warm Soufflé',
    description: 'Airy dark-roast espresso soufflé accompanied by aged Marsala sabayon and mascarpone quenelle dusted with 24k gold.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1100&q=85'
  }
];

const WINE_REGIONS = ['All Vintages', 'Bordeaux', 'Burgundy', 'Champagne'];

const WINE_GALLERY = [
  {
    id: 'w-1',
    region: 'Bordeaux',
    vintage: '2010',
    appellation: 'Margaux • Premier Grand Cru Classé',
    name: 'Château Margaux',
    bottlePrice: '£1,290',
    glassPrice: '£215 (Coravin)',
    notes: 'Crushed violets, blackcurrant liqueur, graphite, and effortless velvet tannins.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'w-2',
    region: 'Burgundy',
    vintage: '2018',
    appellation: 'Vosne-Romanée • Grand Cru',
    name: 'Domaine de la Romanée-Conti Échézeaux',
    bottlePrice: '£2,450',
    glassPrice: 'Bottle Only',
    notes: 'Wild red cherry, exotic spice, forest floor, and ethereal silky persistence.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'w-3',
    region: 'Champagne',
    vintage: '171ème Édition',
    appellation: 'Reims • Prestige Cuvée',
    name: 'Krug Grande Cuvée',
    bottlePrice: '£480',
    glassPrice: '£82',
    notes: 'Toasted brioche, candied citrus, roasted hazelnut, and razor-fine effervescence.',
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'w-4',
    region: 'Burgundy',
    vintage: '2019',
    appellation: 'Puligny-Montrachet • Premier Cru',
    name: 'Domaine Leflaive Les Pucelles',
    bottlePrice: '£690',
    glassPrice: '£118 (Coravin)',
    notes: 'White orchard blossom, crushed flint, lemon curd, and crystalline mineral tension.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'w-5',
    region: 'Bordeaux',
    vintage: '2009',
    appellation: 'Pauillac • Premier Grand Cru Classé',
    name: 'Château Lafite Rothschild',
    bottlePrice: '£1,850',
    glassPrice: '£295 (Coravin)',
    notes: 'Cedarwood, cassis, warm tobacco leaf, and monumental cellar longevity.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 'w-6',
    region: 'Champagne',
    vintage: '2013',
    appellation: 'Épernay • Vintage Brut',
    name: 'Dom Pérignon Vintage',
    bottlePrice: '£420',
    glassPrice: '£74',
    notes: 'Apricot, orange blossom, toasted almond, and smoky chalk-cellar finish.',
    image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?auto=format&fit=crop&w=1000&q=85'
  }
];

const LUX_EMBERS = [
  { left: '12%', top: '82%', size: 2.5, dur: 13, delay: 0 },
  { left: '28%', top: '76%', size: 3, dur: 16, delay: 1.8 },
  { left: '47%', top: '85%', size: 2, dur: 12, delay: 0.9 },
  { left: '66%', top: '79%', size: 3.5, dur: 15, delay: 2.4 },
  { left: '84%', top: '74%', size: 2.5, dur: 14, delay: 1.1 }
];

const AntigravityFloat = ({
  children,
  className = '',
  floatDelay = 0,
  floatRange = 8,
  tiltStrength = 5,
  invertFloat = false
}) => {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * tiltStrength, ry: px * tiltStrength });
  };

  const yKeyframes = invertFloat ? [0, floatRange, 0] : [0, -floatRange, 0];

  return (
    <motion.div
      animate={reduceMotion ? {} : { y: yKeyframes }}
      transition={{ duration: 7.5 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{
        transform: `perspective(1400px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function IgnisGoldRestaurant() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const [fullscreenNavOpen, setFullscreenNavOpen] = useState(false);
  const heroRef = useRef(null);

  const [interiorFilter, setInteriorFilter] = useState('All Spaces');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [culinaryFilter, setCulinaryFilter] = useState('All Creations');
  const [selectedDish, setSelectedDish] = useState(null);
  const [wineRegion, setWineRegion] = useState('All Vintages');

  // 16:9 Cinema State
  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Order Bump (+$199 Motion Pack) & Checkout
  const [includeMotionBump, setIncludeMotionBump] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  // Reservation State
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '2026-11-28',
    time: '20:00 — Prime Seating',
    guests: '2 Guests',
    experience: 'The Obsidian Dining Room',
    notes: ''
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (user?.displayName) {
        setBooking((prev) => ({ ...prev, name: prev.name || user.displayName }));
      }
    });
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'IgnisGoldRestaurant' });
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8500);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  useEffect(() => {
    setVideoError(false);
  }, [activeCinemaIdx, customVideoUrl]);

  const agencyPriceNum = includeMotionBump ? 548 : 349;
  const buyoutPriceNum = includeMotionBump ? 1689 : 1490;

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current || reduceMotion) return;
    const rect = heroRef.current.getBoundingClientRect();
    setHeroParallax({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10
    });
  };

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Michelin Hospitality Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'ignisgold_buyout_1490' : 'ignisgold_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchaseTier = async (tier) => {
    const isBuyout = tier === 'buyout';
    const baseNum = isBuyout ? buyoutPriceNum : agencyPriceNum;
    const price = `${baseNum}.00`;
    const suffix = includeMotionBump ? ' + 30s 4K Michelin Hearth Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: L'Atelier Ignis 3-Michelin-Star Restaurant Kit${suffix}`
      : `Agency License: L'Atelier Ignis 3-Michelin-Star React + 150MP Kit${suffix}`;
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;

    const activeUser = currentUser || auth.currentUser;
    if (activeUser) {
      await recordOrderIntent(activeUser, productName, price);
      setCheckoutData({ isOpen: true, name: productName, price, zipLink });
    } else {
      setLoginModal({ isOpen: true, tierName: productName, price, zipLink });
    }
  };

  const configuredReelUrl = activeCinemaIdx === 0 ? VIDEO_REEL_1_URL : VIDEO_REEL_2_URL;
  const effectiveVideoUrl = customVideoUrl.trim() || configuredReelUrl.trim();
  const hasLiveVideoFile = Boolean(effectiveVideoUrl) && !videoError;

  const toggleCinemaPlay = () => {
    if (hasLiveVideoFile && cinemaVideoRef.current) {
      if (cinemaVideoRef.current.paused) {
        cinemaVideoRef.current.play();
        setIsCinemaPlaying(true);
      } else {
        cinemaVideoRef.current.pause();
        setIsCinemaPlaying(false);
      }
    } else {
      setIsCinemaPlaying((prev) => !prev);
    }
  };

  const toggleCinemaMute = () => {
    if (hasLiveVideoFile && cinemaVideoRef.current) {
      cinemaVideoRef.current.muted = !cinemaVideoRef.current.muted;
      setIsCinemaMuted(cinemaVideoRef.current.muted);
    } else {
      setIsCinemaMuted((prev) => !prev);
    }
  };

  const submitTableBooking = async (e) => {
    e.preventDefault();
    if (isSubmittingBooking) return;
    if (!booking.name || !booking.phone) {
      scrollToSection('reservation');
      return;
    }

    setIsSubmittingBooking(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.name,
          email: booking.phone,
          category: "L'Atelier Ignis ★★★ — Michelin Table Allocation",
          item: `${booking.guests} • ${booking.experience}`,
          date: `${booking.date} (${booking.time})`,
          message: `Michelin table reservation for ${booking.guests} in ${booking.experience} on ${booking.date} at ${booking.time}. Notes: ${booking.notes || 'Sommelier pairing inquiry'}.`
        })
      });
    } catch {
      // silent fallback
    } finally {
      setIsSubmittingBooking(false);
      setBookingSubmitted(true);
      scrollToSection('reservation');
    }
  };

  const scrollToSection = (id) => {
    setFullscreenNavOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredInteriors =
    interiorFilter === 'All Spaces'
      ? INTERIOR_SPACES
      : INTERIOR_SPACES.filter((sp) => sp.zone === interiorFilter);

  const filteredCulinary =
    culinaryFilter === 'All Creations'
      ? CULINARY_ITEMS
      : CULINARY_ITEMS.filter((item) => item.category === culinaryFilter);

  const filteredWines =
    wineRegion === 'All Vintages'
      ? WINE_GALLERY
      : WINE_GALLERY.filter((w) => w.region === wineRegion);

  const activeSlide = HERO_SLIDES[heroSlideIdx];
  const activeCinema = CINEMA_VIDEOS[activeCinemaIdx] || CINEMA_VIDEOS[0];

  return (
    <div className="ignis-lux-root relative z-20 min-h-screen w-full bg-[#080706] text-[#F2EAE0] overflow-x-hidden selection:bg-[#C5A46D] selection:text-[#080706]">
      <Helmet>
        <title>L&apos;Atelier Ignis — Three Michelin Stars | Mayfair, London</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap');

        .ignis-lux-root {
          background-color: #080706 !important;
          color: #F2EAE0 !important;
          font-family: 'Jost', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .ignis-cursive {
          font-family: 'Great Vibes', cursive !important;
          font-weight: 400 !important;
          letter-spacing: 0.02em;
        }
        .ignis-eyebrow {
          font-family: 'Jost', sans-serif !important;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .ignis-lux-root input:not([type="checkbox"]),
        .ignis-lux-root select,
        .ignis-lux-root textarea {
          background-color: transparent !important;
          color: #F2EAE0 !important;
          color-scheme: dark !important;
          box-shadow: none !important;
          font-family: 'Jost', sans-serif !important;
        }
        .ignis-lux-root input::placeholder,
        .ignis-lux-root textarea::placeholder {
          color: rgba(242, 234, 224, 0.38) !important;
        }
        .ignis-lux-root input:focus,
        .ignis-lux-root select:focus,
        .ignis-lux-root textarea:focus {
          outline: none !important;
        }
        .ignis-lux-root select option {
          background-color: #12100D !important;
          color: #F2EAE0 !important;
        }
        .ignis-grain {
          background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0);
          background-size: 24px 24px;
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 sm:px-12 ${
          scrolled
            ? 'bg-[#080706]/92 backdrop-blur-xl border-b border-[#C5A46D]/15 py-3.5'
            : 'bg-gradient-to-b from-[#080706]/85 via-[#080706]/35 to-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollToSection('hero')} className="text-left group cursor-pointer">
            <span className="ignis-cursive block text-3xl sm:text-4xl text-[#FAF6F0] leading-none">
              L&apos;Atelier <span className="text-[#C5A46D]">Ignis</span>
            </span>
            <span className="ignis-eyebrow block text-[8px] text-[#C5A46D]/80 mt-1">
              Mayfair • London
            </span>
          </button>

          <nav className="hidden xl:flex items-center gap-8 text-[10.5px] font-medium tracking-[0.24em] uppercase text-[#E3DACD]/85">
            <button type="button" onClick={() => scrollToSection('culinary-gallery')} className="hover:text-[#C5A46D] transition-colors cursor-pointer">Cuisine &amp; Cocktails</button>
            <button type="button" onClick={() => scrollToSection('wine-gallery')} className="hover:text-[#C5A46D] transition-colors cursor-pointer">Wine Cellar</button>
            <button type="button" onClick={() => scrollToSection('interiors')} className="hover:text-[#C5A46D] transition-colors cursor-pointer">Spaces (9)</button>
            <button type="button" onClick={() => scrollToSection('culinary-cinema')} className="hover:text-[#C5A46D] transition-colors cursor-pointer">16:9 Film</button>
            <button type="button" onClick={() => scrollToSection('licensing')} className="text-[#C5A46D] font-semibold hover:text-white transition-colors cursor-pointer">License Kit</button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('reservation')}
              className="hidden sm:inline-flex items-center gap-2 px-7 py-2.5 rounded-full border border-[#C5A46D]/60 text-[#FAF6F0] text-[10px] font-medium tracking-[0.24em] uppercase hover:bg-[#C5A46D] hover:text-[#080706] transition-all duration-300 cursor-pointer"
            >
              <span>Reserve Table</span>
            </button>

            <button
              type="button"
              onClick={() => setFullscreenNavOpen(true)}
              aria-label="Open Navigation"
              className="w-11 h-11 rounded-full border border-[#C5A46D]/35 bg-[#080706]/50 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 text-[#FAF6F0] hover:border-[#C5A46D] hover:text-[#C5A46D] transition-colors cursor-pointer"
            >
              <span className="w-4 h-[1px] bg-current block" />
              <span className="w-4 h-[1px] bg-current block" />
            </button>
          </div>
        </div>
      </header>

      {/* FULLSCREEN OVERLAY NAV */}
      <AnimatePresence>
        {fullscreenNavOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[99999] bg-[#080706]/98 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
            <button
              type="button"
              onClick={() => setFullscreenNavOpen(false)}
              className="absolute top-8 right-8 w-12 h-12 rounded-full border border-[#C5A46D]/40 text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#080706] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
            <span className="ignis-eyebrow text-[10px] text-[#C5A46D] mb-8">
              Three Michelin Stars • 42 Regent Street
            </span>
            <nav className="flex flex-col items-center gap-4 text-center">
              {[
                ['The Dining Room', 'hero'],
                ['Cuisine, Cocktails & Desserts', 'culinary-gallery'],
                ['1945 Grand Cru Wine Cellar', 'wine-gallery'],
                ['Nine Spaces', 'interiors'],
                ['Five-Act Degustation', 'menu'],
                ['16:9 Atmospheric Film', 'culinary-cinema'],
                ['Reservations', 'reservation'],
                ['License This Kit', 'licensing']
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="ignis-cursive text-4xl sm:text-5xl text-[#FAF6F0] hover:text-[#C5A46D] transition-colors cursor-pointer"
                >
                  {label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO */}
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroParallax({ x: 0, y: 0 })}
        className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#060504]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1.03, x: -heroParallax.x, y: -heroParallax.y }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.2 }, scale: { duration: 1.5 }, x: { duration: 0.35 }, y: { duration: 0.35 } }}
            className="absolute inset-0"
          >
            <img src={activeSlide.image} alt={activeSlide.titleLine1} className="w-full h-full object-cover object-center" />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080706]/70 via-[#080706]/45 to-[#080706]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_25%,rgba(8,7,6,0.78)_100%)]" />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {LUX_EMBERS.map((p, idx) => (
            <motion.span
              key={idx}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={reduceMotion ? {} : { y: [0, -140, 0], opacity: [0.1, 0.7, 0.1] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              className="absolute rounded-full bg-[#C5A46D] shadow-[0_0_12px_rgba(197,164,109,0.8)]"
            />
          ))}
        </div>

        <div className="h-24" />

        <div
          style={{ transform: `translate3d(${heroParallax.x * 0.45}px, ${heroParallax.y * 0.45}px, 0)`, transition: 'transform 260ms ease-out' }}
          className="relative z-20 max-w-4xl mx-auto px-6 text-center my-auto py-10"
        >
          <div className="inline-flex items-center gap-3 px-5 py-1.5 rounded-full border border-[#C5A46D]/35 bg-[#080706]/55 backdrop-blur-md mb-6">
            <span className="ignis-eyebrow text-[9.5px] text-[#C5A46D]">{activeSlide.accolade}</span>
          </div>

          <h1 className="ignis-cursive text-6xl sm:text-8xl md:text-[7.2rem] leading-[0.95] text-[#FAF6F0] drop-shadow-[0_12px_35px_rgba(0,0,0,0.85)]">
            {activeSlide.titleLine1}
            <span className="block text-[#C5A46D] mt-1">{activeSlide.titleLine2}</span>
          </h1>

          <p className="mt-6 max-w-xl mx-auto text-sm sm:text-[15px] text-[#DFD6C8]/90 font-light leading-relaxed">
            {activeSlide.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('culinary-gallery')}
              className="px-7 py-3 rounded-full bg-[#C5A46D] text-[#080706] text-[10.5px] font-semibold uppercase tracking-[0.22em] hover:bg-[#D7BA86] transition-colors cursor-pointer"
            >
              Cuisine, Cocktails &amp; Desserts
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('culinary-cinema')}
              className="px-7 py-3 rounded-full border border-[#C5A46D]/55 bg-[#080706]/60 backdrop-blur-md text-[#FAF6F0] text-[10.5px] font-medium uppercase tracking-[0.22em] hover:border-[#C5A46D] hover:text-[#C5A46D] transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Play size={12} className="fill-current" /> Watch 16:9 Film
            </button>
          </div>
        </div>

        {/* Rounded Pill Concierge Bar */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-10">
          <form
            onSubmit={submitTableBooking}
            className="bg-[#0C0A08]/88 backdrop-blur-2xl border border-[#C5A46D]/30 rounded-3xl lg:rounded-full p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-center gap-2 shadow-[0_25px_75px_rgba(0,0,0,0.85)]"
          >
            <div className="px-5 py-2.5 flex flex-col justify-center">
              <label className="ignis-eyebrow text-[8.5px] text-[#C5A46D]/90">Date</label>
              <input type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="mt-1 text-xs font-light cursor-pointer" />
            </div>
            <div className="px-5 py-2.5 flex flex-col justify-center lg:border-l lg:border-[#C5A46D]/15">
              <label className="ignis-eyebrow text-[8.5px] text-[#C5A46D]/90">Seating</label>
              <select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} className="mt-1 text-xs font-light cursor-pointer">
                <option value="18:30 — First Seating">18:30 — First Seating</option>
                <option value="20:00 — Prime Seating">20:00 — Prime Seating</option>
                <option value="21:30 — Late Hearth">21:30 — Late Hearth</option>
              </select>
            </div>
            <div className="px-5 py-2.5 flex flex-col justify-center lg:border-l lg:border-[#C5A46D]/15">
              <label className="ignis-eyebrow text-[8.5px] text-[#C5A46D]/90">Party</label>
              <select value={booking.guests} onChange={(e) => setBooking({ ...booking, guests: e.target.value })} className="mt-1 text-xs font-light cursor-pointer">
                <option>2 Guests</option>
                <option>3 Guests</option>
                <option>4 Guests</option>
                <option>6 Guests</option>
                <option>8–14 Private Salon</option>
              </select>
            </div>
            <div className="px-5 py-2.5 flex flex-col justify-center lg:border-l lg:border-[#C5A46D]/15">
              <label className="ignis-eyebrow text-[8.5px] text-[#C5A46D]/90">Guest Name</label>
              <input
                type="text"
                placeholder="Your Name"
                value={booking.name}
                onChange={(e) => setBooking({ ...booking, name: e.target.value, phone: booking.phone || e.target.value })}
                className="mt-1 text-xs font-light"
              />
            </div>
            <button type="submit" className="rounded-full bg-[#C5A46D] text-[#080706] text-[10px] font-semibold uppercase tracking-[0.24em] py-4 px-6 hover:bg-[#D7BA86] transition-colors cursor-pointer flex items-center justify-center gap-2">
              <span>Request Table</span>
              <ArrowUpRight size={14} strokeWidth={1.75} />
            </button>
          </form>
        </div>
      </section>

      {/* 12-ITEM GALLERY: HAUTE CUISINE, COCKTAILS & DESSERTS */}
      <section id="culinary-gallery" className="py-28 px-6 bg-[#0B0A08] border-t border-[#C5A46D]/12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="ignis-eyebrow text-[10px] text-[#C5A46D] block mb-3">Kitchen, Bar &amp; Pâtisserie</span>
              <h2 className="ignis-cursive text-5xl sm:text-7xl text-[#FAF6F0] leading-none">
                Cuisine, Cocktails <span className="text-[#C5A46D]">&amp; Desserts</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {CULINARY_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCulinaryFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-[10.5px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    culinaryFilter === tab
                      ? 'bg-[#C5A46D] border-[#C5A46D] text-[#080706] font-semibold'
                      : 'bg-[#12100D] border-[#C5A46D]/25 text-[#D8CFC0] hover:border-[#C5A46D]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCulinary.map((item, idx) => (
              <AntigravityFloat key={item.id} floatDelay={(idx % 3) * 0.45} floatRange={6} tiltStrength={4.5} invertFloat={idx % 2 === 1}>
                <article
                  onClick={() => setSelectedDish(item)}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-[#100E0C] border border-[#C5A46D]/20 hover:border-[#C5A46D]/55 transition-all shadow-[0_25px_65px_rgba(0,0,0,0.75)] flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden bg-[#080706]">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100E0C] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#080706]/80 backdrop-blur-md border border-[#C5A46D]/35 text-[9.5px] uppercase tracking-[0.18em] text-[#C5A46D]">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 px-4 py-1 rounded-full bg-[#C5A46D] text-[#080706] text-xs font-semibold">
                      {item.price}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="ignis-eyebrow text-[9px] text-[#8E8579] block">{item.category} · {item.prepTime}</span>
                      <h3 className="ignis-cursive text-3xl sm:text-[2.1rem] text-[#FAF6F0] group-hover:text-[#C5A46D] transition-colors mt-1.5 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#A9A093] font-light leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#C5A46D]/12 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-[#C5A46D]">Tasting Notes</span>
                      <span className="w-8 h-8 rounded-full border border-[#C5A46D]/35 flex items-center justify-center text-[#C5A46D] group-hover:bg-[#C5A46D] group-hover:text-[#080706] transition-colors">
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* 1945 GRAND CRU WINE GALLERY */}
      <section id="wine-gallery" className="py-28 px-6 bg-[#080706] border-t border-[#C5A46D]/12 ignis-grain">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="ignis-eyebrow inline-flex items-center gap-2 text-[10px] text-[#C5A46D] mb-3">
                <Wine size={13} /> Subterranean Vault • 420 Allocations
              </span>
              <h2 className="ignis-cursive text-5xl sm:text-7xl text-[#FAF6F0] leading-none">
                The 1945 Grand Cru <span className="text-[#C5A46D]">Wine Gallery</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {WINE_REGIONS.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => setWineRegion(region)}
                  className={`px-5 py-2.5 rounded-full text-[10.5px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    wineRegion === region
                      ? 'bg-[#C5A46D] border-[#C5A46D] text-[#080706] font-semibold'
                      : 'bg-[#12100D] border-[#C5A46D]/25 text-[#D8CFC0] hover:border-[#C5A46D]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWines.map((wine, idx) => (
              <AntigravityFloat key={wine.id} floatDelay={(idx % 3) * 0.5} floatRange={7} tiltStrength={4.5} invertFloat={idx % 2 === 0}>
                <article className="group rounded-3xl overflow-hidden bg-[#0E0C0A] border border-[#C5A46D]/25 hover:border-[#C5A46D]/60 transition-all shadow-[0_28px_70px_rgba(0,0,0,0.8)] flex flex-col h-full">
                  <div className="relative h-60 overflow-hidden bg-black">
                    <img src={wine.image} alt={wine.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C0A] via-[#0E0C0A]/20 to-transparent" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#080706]/85 backdrop-blur-md border border-[#C5A46D]/40 text-[9.5px] uppercase tracking-[0.2em] text-[#C5A46D]">
                      {wine.region} · {wine.vintage}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="ignis-eyebrow text-[9px] text-[#8E8579] block">{wine.appellation}</span>
                      <h3 className="ignis-cursive text-3xl text-[#FAF6F0] group-hover:text-[#C5A46D] transition-colors mt-1.5 leading-snug">
                        {wine.name}
                      </h3>
                      <p className="text-xs text-[#A9A093] font-light leading-relaxed mt-2.5">{wine.notes}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[#C5A46D]/15 flex items-center justify-between gap-3">
                      <div>
                        <span className="block text-sm font-medium text-[#FAF6F0]">{wine.bottlePrice}</span>
                        <span className="block text-[10px] text-[#C5A46D] font-light">{wine.glassPrice}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, notes: `Sommelier cellar allocation: ${wine.name} (${wine.vintage})` }));
                          scrollToSection('reservation');
                        }}
                        className="px-4 py-2 rounded-full border border-[#C5A46D]/50 text-[10px] tracking-[0.18em] uppercase text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#080706] transition-colors cursor-pointer"
                      >
                        Reserve Bottle
                      </button>
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* NINE ARCHITECTURAL SPACES */}
      <section id="interiors" className="py-28 px-6 bg-[#0B0A08] border-t border-[#C5A46D]/12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="ignis-eyebrow text-[10px] text-[#C5A46D] block mb-3">Architecture &amp; Atmosphere</span>
              <h2 className="ignis-cursive text-5xl sm:text-7xl text-[#FAF6F0] leading-none">
                Nine Intimate <span className="text-[#C5A46D]">Spaces</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {INTERIOR_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setInteriorFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-[10.5px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    interiorFilter === tab
                      ? 'bg-[#C5A46D] border-[#C5A46D] text-[#080706] font-semibold'
                      : 'bg-[#12100D] border-[#C5A46D]/25 text-[#D8CFC0] hover:border-[#C5A46D]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9">
            {filteredInteriors.map((room, idx) => {
              const masterIdx = INTERIOR_SPACES.findIndex((s) => s.id === room.id);
              const isHeroSpan = idx === 0 && interiorFilter === 'All Spaces';

              return (
                <AntigravityFloat key={room.id} floatDelay={(idx % 3) * 0.55} floatRange={6} tiltStrength={5} invertFloat={idx % 2 === 1} className={isHeroSpan ? 'md:col-span-2' : ''}>
                  <article onClick={() => setLightboxIndex(masterIdx)} className="group cursor-pointer flex flex-col">
                    <div className={`relative overflow-hidden rounded-3xl bg-[#12100D] border border-[#C5A46D]/15 group-hover:border-[#C5A46D]/50 transition-colors shadow-[0_25px_65px_rgba(0,0,0,0.75)] ${isHeroSpan ? 'h-[420px]' : 'h-[350px]'}`}>
                      <img src={room.url} alt={room.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080706]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#080706]/65 backdrop-blur-md border border-white/15 flex items-center justify-center text-[#FAF6F0] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Eye size={15} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="pt-5 px-1 flex items-start justify-between gap-4">
                      <div>
                        <span className="ignis-eyebrow text-[9px] text-[#C5A46D]/90 block">{room.tag}</span>
                        <h3 className="ignis-cursive text-3xl text-[#FAF6F0] group-hover:text-[#C5A46D] transition-colors mt-1">{room.title}</h3>
                        <p className="text-xs text-[#9A9083] mt-1 font-light leading-relaxed">{room.specs}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBooking((prev) => ({ ...prev, experience: room.title }));
                          scrollToSection('reservation');
                        }}
                        className="shrink-0 mt-1 px-4 py-1.5 rounded-full border border-[#C5A46D]/45 text-[9.5px] tracking-[0.2em] uppercase text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#080706] transition-colors cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </article>
                </AntigravityFloat>
              );
            })}
          </div>
        </div>
      </section>

      {/* FIVE-ACT DEGUSTATION MONOLITH */}
      <section id="menu" className="py-28 px-6 bg-[#080706] border-t border-[#C5A46D]/12 ignis-grain">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="ignis-eyebrow text-[10px] text-[#C5A46D] block mb-3">Autumn — Winter Season</span>
            <h2 className="ignis-cursive text-5xl sm:text-7xl text-[#FAF6F0]">
              Grand <span className="text-[#C5A46D]">Degustation</span>
            </h2>
          </div>

          <AntigravityFloat floatDelay={0.2} floatRange={7} tiltStrength={3} className="max-w-3xl mx-auto rounded-[2rem] bg-[#0C0A08] border border-[#C5A46D]/25 p-8 sm:p-16 shadow-[0_40px_110px_rgba(0,0,0,0.85)]">
            <div className="text-center pb-10 mb-12 border-b border-[#C5A46D]/15">
              <p className="ignis-eyebrow text-[9.5px] text-[#C5A46D]">Chef Julian Vance</p>
              <h3 className="ignis-cursive text-4xl sm:text-6xl text-[#FAF6F0] mt-2">Five Acts of Live Fire</h3>
              <p className="text-xs tracking-[0.18em] uppercase text-[#9A9083] mt-4 font-light">
                £295 Per Guest &nbsp;·&nbsp; Grand Cru Wine Pairing £210
              </p>
            </div>
            <div className="space-y-11">
              {TASTING_ACTS.map((course) => (
                <div key={course.roman} className="text-center max-w-xl mx-auto">
                  <span className="ignis-eyebrow text-[9.5px] text-[#C5A46D]">{course.roman} · {course.act}</span>
                  <h4 className="ignis-cursive text-3xl sm:text-4xl text-[#FAF6F0] mt-1.5 leading-snug">{course.name}</h4>
                  <p className="text-xs sm:text-[13px] text-[#A39A8D] mt-2 font-light leading-relaxed">{course.notes}</p>
                  <p className="text-xs italic text-[#C5A46D]/90 mt-2 font-light">Paired with {course.pairing}</p>
                </div>
              ))}
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* 16:9 ATMOSPHERIC FILM PLACEHOLDER */}
      <section id="culinary-cinema" className="py-28 px-6 bg-[#0B0A08] border-t border-[#C5A46D]/12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="ignis-eyebrow inline-flex items-center gap-2 text-[10px] text-[#C5A46D] mb-3">
                <Video size={14} /> {activeCinema.chapter}
              </span>
              <h2 className="ignis-cursive text-5xl sm:text-6xl text-[#FAF6F0]">{activeCinema.title}</h2>
              <p className="text-sm text-[#9A9083] font-light mt-2 max-w-xl">{activeCinema.desc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {CINEMA_VIDEOS.map((clip, idx) => (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => {
                    setCustomVideoUrl('');
                    setActiveCinemaIdx(idx);
                    setIsCinemaPlaying(true);
                  }}
                  className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase border transition-colors cursor-pointer ${
                    activeCinemaIdx === idx && !customVideoUrl
                      ? 'bg-[#C5A46D] border-[#C5A46D] text-[#080706] font-semibold'
                      : 'border-[#C5A46D]/30 text-[#D8CFC0] hover:border-[#C5A46D]'
                  }`}
                >
                  Reel 0{idx + 1} (16:9)
                </button>
              ))}
            </div>
          </div>

          <AntigravityFloat floatDelay={0.3} floatRange={7} tiltStrength={3.5} className="relative w-full aspect-video overflow-hidden rounded-3xl bg-black border border-[#C5A46D]/25 shadow-[0_40px_110px_rgba(0,0,0,0.9)]">
            {hasLiveVideoFile ? (
              <video ref={cinemaVideoRef} key={effectiveVideoUrl} autoPlay loop muted={isCinemaMuted} playsInline poster={activeCinema.poster} onError={() => setVideoError(true)} className="h-full w-full object-cover">
                <source src={effectiveVideoUrl} type="video/mp4" />
                <source src={effectiveVideoUrl} type="video/webm" />
              </video>
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <motion.img
                  key={activeCinema.poster}
                  src={activeCinema.poster}
                  alt={activeCinema.title}
                  animate={isCinemaPlaying && !reduceMotion ? { scale: [1.02, 1.09, 1.02] } : { scale: 1.02 }}
                  transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="rounded-3xl bg-[#080706]/85 backdrop-blur-xl border border-[#C5A46D]/40 px-7 py-5 text-center shadow-2xl max-w-md">
                    <span className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#C5A46D] text-[#080706]">
                      <Film size={18} />
                    </span>
                    <span className="ignis-cursive block text-3xl text-[#FAF6F0]">16:9 Michelin Cinema Slot</span>
                    <span className="block text-[11px] text-[#B8AFA2] mt-1">
                      3840 × 2160 UHD Ready • Paste any .mp4 / .webm URL below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080706]/85 via-transparent to-[#080706]/30" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={toggleCinemaPlay} aria-label="Play or Pause" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#080706]/70 backdrop-blur-md text-[#FAF6F0] hover:border-[#C5A46D] hover:text-[#C5A46D] transition cursor-pointer">
                  {isCinemaPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button type="button" onClick={toggleCinemaMute} aria-label="Mute or Unmute" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[#080706]/70 backdrop-blur-md text-[#FAF6F0] hover:border-[#C5A46D] hover:text-[#C5A46D] transition cursor-pointer">
                  {isCinemaMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-[#080706]/90 border border-[#C5A46D]/35 px-4 py-2 backdrop-blur-xl">
                <Link2 size={14} className="text-[#C5A46D] shrink-0" />
                <input type="text" value={customVideoUrl} onChange={(e) => setCustomVideoUrl(e.target.value)} placeholder="Paste 16:9 .mp4 or .webm URL to preview..." className="w-full text-xs" />
                {customVideoUrl && (
                  <button type="button" onClick={() => setCustomVideoUrl('')} className="text-[10px] uppercase tracking-widest text-[#C5A46D] cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* RESERVATION SALON */}
      <section id="reservation" className="py-28 px-6 bg-[#080706] border-t border-[#C5A46D]/12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="ignis-eyebrow text-[10px] text-[#C5A46D] block mb-3">Maître D&apos; Concierge</span>
            <h2 className="ignis-cursive text-5xl sm:text-7xl text-[#FAF6F0]">
              Reserve Your <span className="text-[#C5A46D]">Evening</span>
            </h2>
          </div>

          {bookingSubmitted ? (
            <div className="p-12 rounded-3xl border border-[#C5A46D]/35 bg-[#0C0A08] text-center space-y-5">
              <div className="w-12 h-12 rounded-full border border-[#C5A46D] text-[#C5A46D] flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <h3 className="ignis-cursive text-4xl sm:text-5xl text-[#FAF6F0]">We Await Your Arrival, {booking.name}</h3>
              <p className="text-sm text-[#B8AFA2] font-light max-w-md mx-auto leading-relaxed">
                Our Maître D&apos; has noted <span className="text-[#FAF6F0]">{booking.guests}</span> in{' '}
                <span className="text-[#C5A46D]">{booking.experience}</span> on <span className="text-[#FAF6F0]">{booking.date}</span> ({booking.time}).
              </p>
              <button type="button" onClick={() => setBookingSubmitted(false)} className="mt-4 px-8 py-3 rounded-full border border-[#C5A46D]/50 text-[10px] tracking-[0.24em] uppercase text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#080706] transition-colors cursor-pointer">
                Modify Details
              </button>
            </div>
          ) : (
            <form onSubmit={submitTableBooking} className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-9">
              <div className="border-b border-[#C5A46D]/25 focus-within:border-[#C5A46D] pb-2.5">
                <label className="ignis-eyebrow block text-[9px] text-[#C5A46D]/90 mb-2">Guest Full Name *</label>
                <input type="text" required placeholder="Mr. / Ms. Full Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#C5A46D]/25 focus-within:border-[#C5A46D] pb-2.5">
                <label className="ignis-eyebrow block text-[9px] text-[#C5A46D]/90 mb-2">Telephone or Email *</label>
                <input type="text" required placeholder="+44 20 7946 0821" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#C5A46D]/25 focus-within:border-[#C5A46D] pb-2.5">
                <label className="ignis-eyebrow block text-[9px] text-[#C5A46D]/90 mb-2">Evening Date *</label>
                <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="w-full text-sm font-light cursor-pointer" />
              </div>
              <div className="border-b border-[#C5A46D]/25 focus-within:border-[#C5A46D] pb-2.5">
                <label className="ignis-eyebrow block text-[9px] text-[#C5A46D]/90 mb-2">Preferred Space</label>
                <select value={booking.experience} onChange={(e) => setBooking({ ...booking, experience: e.target.value })} className="w-full text-sm font-light cursor-pointer">
                  <option>The Obsidian Dining Room</option>
                  <option>Open White-Oak Hearth Pass</option>
                  <option>Amber &amp; Cognac Banquettes</option>
                  <option>The Regent Banquet Room (Up to 14)</option>
                  <option>The 1945 Grand Cru Cellar</option>
                  <option>Botanical Glasshouse Terrace</option>
                </select>
              </div>
              <div className="sm:col-span-2 border-b border-[#C5A46D]/25 focus-within:border-[#C5A46D] pb-2.5">
                <label className="ignis-eyebrow block text-[9px] text-[#C5A46D]/90 mb-2">Dietary &amp; Sommelier Notes</label>
                <input type="text" placeholder="Anniversary, allergies, vintage request..." value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="sm:col-span-2 pt-6 text-center">
                <button type="submit" disabled={isSubmittingBooking} className="w-full sm:w-auto px-14 py-4 rounded-full bg-[#C5A46D] text-[#080706] text-[10.5px] font-semibold uppercase tracking-[0.28em] hover:bg-[#D7BA86] transition-colors cursor-pointer disabled:opacity-60">
                  {isSubmittingBooking ? 'Confirming with Maître D’...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* VISIBLE COMMERCIAL PRICING + ORDER BUMP + FREE SAMPLE CLOUD         */}
      {/* =================================================================== */}
      <section id="licensing" className="py-24 px-6 bg-[#0B0A08] border-t border-[#C5A46D]/15">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="ignis-eyebrow inline-flex items-center gap-2 text-[10px] text-[#C5A46D] mb-2">
              <Crown size={14} /> Commercial React + 150MP Michelin Kit
            </span>
            <h2 className="ignis-cursive text-5xl sm:text-6xl text-[#FAF6F0]">
              Acquire <span className="text-[#C5A46D]">L&apos;Atelier Ignis</span>
            </h2>
          </div>

          <div
            onClick={() => setIncludeMotionBump(!includeMotionBump)}
            className="mb-8 rounded-3xl border border-[#C5A46D]/35 bg-[#100E0C] p-5 flex items-center gap-4 cursor-pointer hover:border-[#C5A46D] transition-colors"
          >
            <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="h-5 w-5 cursor-pointer accent-[#C5A46D]" />
            <div className="flex-1">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#FAF6F0]">
                Add 30s 4K Michelin Hearth Motion Pack for the 16:9 Video Slot (+$199)
              </span>
              <span className="block text-xs text-[#9A9083] mt-0.5">
                Seamless 60fps UHD video loops ready to drop into Reel 01 &amp; Reel 02.
              </span>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-[#100E0C] border border-[#C5A46D]/25 flex flex-col justify-between shadow-xl">
              <div>
                <span className="ignis-eyebrow text-[10px] text-[#C5A46D]">Agency License</span>
                <p className="ignis-cursive text-6xl text-[#FAF6F0] mt-2">${agencyPriceNum}</p>
                <p className="text-xs text-[#9A9083] mt-3 leading-relaxed">
                  Complete 3-Michelin-Star React JSX + 9-Room, Wine &amp; Culinary Galleries + 16:9 Cinema Slot + Full Commercial Rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="mt-8 w-full py-4 rounded-full bg-[#C5A46D] text-[#080706] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#D7BA86] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <DownloadCloud size={15} /> License Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#FAF6F0] text-[#080706] flex flex-col justify-between shadow-xl">
              <div>
                <span className="ignis-eyebrow text-[10px] text-[#8E6F3A]">1-of-1 Exclusive Buyout</span>
                <p className="ignis-cursive text-6xl mt-2">${buyoutPriceNum}</p>
                <p className="text-xs text-[#4B443C] mt-3 leading-relaxed">
                  Permanent store removal + 100% IP transfer + 10 custom 150MP Ultra Print Michelin renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="mt-8 w-full py-4 rounded-full bg-[#080706] text-[#FAF6F0] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#C5A46D] hover:text-[#080706] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Buyout 1-of-1 — ${buyoutPriceNum}
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={KIT_CONFIG.freeSampleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#100E0C] border border-[#C5A46D]/45 text-[#FAF6F0] hover:bg-[#C5A46D] hover:text-[#080706] transition-all shadow-lg text-xs font-medium uppercase tracking-[0.18em]"
            >
              <DownloadCloud size={18} className="text-[#C5A46D]" />
              <span>Download Free 4K Preview Sample</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-[#060504] border-t border-[#C5A46D]/15 pt-16 pb-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="ignis-cursive text-4xl text-[#FAF6F0]">
              L&apos;Atelier <span className="text-[#C5A46D]">Ignis</span>
            </span>
            <p className="text-xs text-[#8E8579] font-light mt-1">42 Regent Street, Mayfair, London W1B 5AH</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#BFB6A8] font-light">
            <span className="flex items-center gap-2"><Phone size={13} className="text-[#C5A46D]" /> +44 20 7946 0821</span>
            <span className="flex items-center gap-2"><MapPin size={13} className="text-[#C5A46D]" /> Mayfair, London</span>
          </div>
        </div>
      </footer>

      {/* FLOATING FREE SAMPLE CLOUD BUBBLE ("Oblačić") */}
      <a
        href={KIT_CONFIG.freeSampleLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Download Free 4K Sample"
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#0C0A08]/95 border border-[#C5A46D]/45 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FAF6F0] shadow-2xl backdrop-blur-md hover:bg-[#C5A46D] hover:text-[#080706] transition-all"
      >
        <DownloadCloud size={16} className="text-[#C5A46D]" />
        <span className="hidden sm:inline">Free Sample</span>
      </a>

      {/* DISH MODAL */}
      {selectedDish &&
        createPortal(
          <div onClick={() => setSelectedDish(null)} className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#0C0A08] border border-[#C5A46D]/35 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl text-[#FAF6F0]">
              <div className="relative h-64">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#080706]/80 text-[#C5A46D] flex items-center justify-center border border-[#C5A46D]/40 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.22em] uppercase text-[#C5A46D]">{selectedDish.category} · {selectedDish.tag}</span>
                  <span className="text-lg font-medium text-[#C5A46D]">{selectedDish.price}</span>
                </div>
                <h3 className="text-4xl text-[#FAF6F0]" style={{ fontFamily: "'Great Vibes', cursive" }}>{selectedDish.name}</h3>
                <p className="text-sm text-[#BFB6A8] font-light leading-relaxed">{selectedDish.description}</p>
                <div className="pt-5 border-t border-[#C5A46D]/15 flex items-center justify-between">
                  <span className="text-xs text-[#8E8579] font-light">{selectedDish.prepTime}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const dishName = selectedDish.name;
                      setSelectedDish(null);
                      setBooking((prev) => ({ ...prev, notes: `Pre-requested creation: ${dishName}` }));
                      scrollToSection('reservation');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#C5A46D] text-[#080706] text-[10px] font-semibold uppercase tracking-[0.22em] cursor-pointer"
                  >
                    Request at Table
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* FULLSCREEN 9-ROOM LIGHTBOX */}
      {lightboxIndex !== null &&
        createPortal(
          <div onClick={() => setLightboxIndex(null)} className="fixed inset-0 z-[999999] bg-[#060504]/95 backdrop-blur-2xl flex items-center justify-center p-4">
            <button type="button" onClick={() => setLightboxIndex(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full border border-[#C5A46D]/40 text-[#C5A46D] hover:bg-[#C5A46D] hover:text-[#080706] flex items-center justify-center cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + INTERIOR_SPACES.length) % INTERIOR_SPACES.length); }} className="absolute left-4 sm:left-8 w-11 h-11 rounded-full border border-[#C5A46D]/35 bg-[#080706]/80 text-[#C5A46D] flex items-center justify-center cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div onClick={(e) => e.stopPropagation()} className="max-w-5xl w-full text-center space-y-5">
              <img src={INTERIOR_SPACES[lightboxIndex].url} alt={INTERIOR_SPACES[lightboxIndex].title} className="max-h-[76vh] max-w-full mx-auto object-contain rounded-3xl border border-[#C5A46D]/25" />
              <div>
                <span className="text-[10px] tracking-[0.26em] uppercase text-[#C5A46D]">{INTERIOR_SPACES[lightboxIndex].tag} ({lightboxIndex + 1} / {INTERIOR_SPACES.length})</span>
                <h4 className="text-4xl text-[#FAF6F0] mt-1.5" style={{ fontFamily: "'Great Vibes', cursive" }}>{INTERIOR_SPACES[lightboxIndex].title}</h4>
              </div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % INTERIOR_SPACES.length); }} className="absolute right-4 sm:right-8 w-11 h-11 rounded-full border border-[#C5A46D]/35 bg-[#080706]/80 text-[#C5A46D] flex items-center justify-center cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>,
          document.body
        )}

      <LoginRequiredModal
        isOpen={loginModal.isOpen}
        onClose={() => setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })}
        packageName={loginModal.tierName}
        price={loginModal.price}
        onLoginSuccess={async (user) => {
          await recordOrderIntent(user, loginModal.tierName, loginModal.price);
          setCheckoutData({ isOpen: true, name: loginModal.tierName, price: loginModal.price, zipLink: loginModal.zipLink });
          setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });
        }}
      />

      <AnimatePresence>
        {checkoutData.isOpen && (
          <V8SecureCheckout
            isOpen={checkoutData.isOpen}
            productName={checkoutData.name}
            price={checkoutData.price}
            zipLink={checkoutData.zipLink}
            onClose={() => setCheckoutData({ isOpen: false, name: '', price: '0.00', zipLink: '' })}
          />
        )}
      </AnimatePresence>

      {/* FLOATING PREV / NEXT NAVIGATION */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#080706]/90 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#FAF6F0] shadow-2xl border border-[#C5A46D]/35 backdrop-blur-md transition hover:border-[#C5A46D] cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C5A46D] text-[#080706]">
            <ArrowLeft size={13} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#C5A46D] px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#080706] shadow-2xl transition hover:bg-[#D7BA86] cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#080706] text-[#C5A46D]">
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
}