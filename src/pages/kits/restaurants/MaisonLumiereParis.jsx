// ============================================================================
// src/pages/kits/restaurants/MaisonLumiereParis.jsx
// MAISON LUMIÈRE — Three Michelin Stars • Place Vendôme, Paris
// Royal Emerald, Champagne Brass & Bordeaux Velvet • Italiana + Pinyon Script
// 16:9 Cinema Placeholder + Antigravity 3D + Visible Pricing + Free Sample Cloud
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Phone, Wine, Check, X, ArrowUpRight, ArrowLeft, ArrowRight,
  Crown, DownloadCloud, Lock, Play, Pause, Volume2, VolumeX, Link2,
  Video, Film, Sparkles, Star
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
const VIDEO_REEL_1_URL = ''; // e.g. '/restaurants/maison-lumiere-paris-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/restaurants/maison-lumiere-champagne-02.mp4'

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-maisonlumiere-paris-349-link',
  buyoutZipLink: 'https://drive.google.com/your-maisonlumiere-paris-1490-link',
  freeSampleLink: 'https://drive.google.com/your-maisonlumiere-paris-sample-link',
  prevPageRoute: '/kurokawa-kaiseki',
  prevPageLabel: 'Prev: Kurokawa Tokyo (3/4)',
 nextLandingRoute: '/sol-y-obsidiana',
nextLandingLabel: 'Next: Sol y Obsidiana Nikkei (5/5)'
};

const PARIS_REELS = [
  {
    id: 'p-reel-1',
    chapter: 'Film I • Le Grand Salon (16:9 UHD)',
    title: 'Crystal Chandeliers, Velvet & Duck à la Presse',
    desc: 'A 16:9 widescreen film capturing tableside silver-press service, flambéed Cognac sauces, and Parisian evening glow.',
    poster: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1920&q=90'
  },
  {
    id: 'p-reel-2',
    chapter: 'Film II • La Cave de Champagne (16:9 UHD)',
    title: 'Sabrage & Vintage Salon Blanc de Blancs',
    desc: 'Secondary 16:9 UHD cinema slot ready for Seedance 2.5 or Kling 4.0 Parisian cellar and pâtisserie loops.',
    poster: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=90'
  }
];

const FRENCH_FILTERS = ['All', 'Haute Cuisine', 'Parisian Cocktails', 'Haute Pâtisserie'];

const FRENCH_MENU = [
  {
    id: 1,
    name: 'Canard à la Presse & Black Fig',
    category: 'Haute Cuisine',
    price: '€145',
    tag: 'Tableside Silver Press',
    prep: 'Challans Duck',
    description: 'Roasted Challans duck finished tableside in our numbered 1924 Christofle silver press with aged Armagnac and black fig reduction.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 2,
    name: 'Homard Bleu & Sauce Américaine',
    category: 'Haute Cuisine',
    price: '€118',
    tag: 'Brittany Coast',
    prep: 'Cognac Flambé',
    description: 'Poached Brittany blue lobster medallions glazed in tarragon-infused coral butter, chanterelles, and toasted brioche.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 3,
    name: 'Filet de Boeuf Rossini & Périgord',
    category: 'Haute Cuisine',
    price: '€132',
    tag: 'Classic Icon',
    prep: 'Seared Foie Gras',
    description: 'Charolais tenderloin crowned with pan-seared Landes foie gras, shaved Périgord black truffle, and Madeira jus.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 4,
    name: 'Sole Meunière & Brown Butter',
    category: 'Haute Cuisine',
    price: '€96',
    tag: 'Filleted Tableside',
    prep: 'Normandy Beurre Noisette',
    description: 'Whole wild Dover sole gently browned in cultured Normandy butter with preserved Menton lemon and parsley.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 5,
    name: 'Vendôme French 75 Reserve',
    category: 'Parisian Cocktails',
    price: '€34',
    tag: 'Bar Signature',
    prep: 'Dom Pérignon Top',
    description: 'Botanical French gin, organic Menton lemon cordial, elderflower mist, and vintage Champagne in Baccarat crystal.',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 6,
    name: 'Emerald Chartreuse & Pear Elixir',
    category: 'Parisian Cocktails',
    price: '€32',
    tag: 'Monastic Reserve',
    prep: 'Aged Green Chartreuse',
    description: 'Rare V.E.P. Green Chartreuse, Poire Williams eau-de-vie, fresh thyme, and chilled coupe glass.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 7,
    name: 'Smoked Cognac & Cherry Boulevardier',
    category: 'Parisian Cocktails',
    price: '€38',
    tag: 'Nocturnal',
    prep: 'Grande Champagne XO',
    description: '25-year Grande Champagne Cognac, griotte cherry liqueur, aged sweet vermouth, and bitter orange peel.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 8,
    name: 'Soufflé au Grand Marnier Cuvée',
    category: 'Haute Pâtisserie',
    price: '€32',
    tag: 'Baked to Order',
    prep: '20 Min Rise',
    description: 'Cloud-light warm soufflé infused with Grand Marnier Quintessence, poured tableside with Tahitian vanilla crème anglaise.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 9,
    name: 'Tarte au Chocolat Guanaja & Gold',
    category: 'Haute Pâtisserie',
    price: '€29',
    tag: 'Valrhona 70%',
    prep: 'Salted Butter Sable',
    description: 'Warm dark chocolate ganache tart on crisp Brittany sablé with smoked sea salt and gilded hazelnut ice cream.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1000&q=85'
  }
];

const PARIS_CELLAR = [
  {
    id: 'pc-1',
    region: 'Champagne',
    vintage: '2012',
    name: 'Salon Le Mesnil Blanc de Blancs',
    price: '€1,650',
    pour: 'Bottle Only',
    notes: 'Chalky minerality, white brioche, toasted almond, and eternal Parisian finesse.',
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'pc-2',
    region: 'Bordeaux',
    vintage: '2005',
    name: 'Château Cheval Blanc',
    price: '€1,920',
    pour: '€310 (Coravin)',
    notes: 'Saint-Émilion Premier Grand Cru Classé A. Velvet plum, violet, and truffle spice.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'pc-3',
    region: 'Burgundy',
    vintage: '2017',
    name: 'Domaine Coche-Dury Meursault',
    price: '€1,480',
    pour: '€240 (Coravin)',
    notes: 'Struck flint, hazelnut butter, white peach, and electric crystalline acidity.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'pc-4',
    region: 'Sauternes',
    vintage: '2001',
    name: 'Château d’Yquem Premier Cru',
    price: '€1,150',
    pour: '€145 (75ml)',
    notes: 'Liquid gold: saffron, caramelized apricot, orange marmalade, and endless finish.',
    image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=900&q=85'
  }
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

  return (
    <motion.div
      animate={reduceMotion ? {} : { y: invertFloat ? [0, floatRange, 0] : [0, -floatRange, 0] }}
      transition={{ duration: 7.2 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
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

export default function MaisonLumiereParis() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  // 16:9 Cinema State
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Filters & Modal
  const [menuFilter, setMenuFilter] = useState('All');
  const [selectedDish, setSelectedDish] = useState(null);

  // Order Bump (+$199 Motion Pack) & Checkout
  const [includeMotionBump, setIncludeMotionBump] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  // Reservation
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '2026-12-12',
    time: '20:00 — Dîner de Gala',
    guests: '2 Guests',
    salon: 'Le Grand Salon (Place Vendôme)',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 35);
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (user?.displayName) setBooking((prev) => ({ ...prev, name: prev.name || user.displayName }));
    });
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'MaisonLumiereParis' });
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  useEffect(() => {
    setVideoError(false);
  }, [activeReelIdx, customVideoUrl]);

  const handleHeroMouseMove = (e) => {
    if (!heroRef.current || reduceMotion) return;
    const rect = heroRef.current.getBoundingClientRect();
    setHeroParallax({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 16,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10
    });
  };

  const configuredReelUrl = activeReelIdx === 0 ? VIDEO_REEL_1_URL : VIDEO_REEL_2_URL;
  const effectiveVideoUrl = customVideoUrl.trim() || configuredReelUrl.trim();
  const hasLiveVideoFile = Boolean(effectiveVideoUrl) && !videoError;

  const togglePlay = () => {
    if (hasLiveVideoFile && cinemaVideoRef.current) {
      if (cinemaVideoRef.current.paused) {
        cinemaVideoRef.current.play();
        setIsPlaying(true);
      } else {
        cinemaVideoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const toggleMute = () => {
    if (hasLiveVideoFile && cinemaVideoRef.current) {
      cinemaVideoRef.current.muted = !cinemaVideoRef.current.muted;
      setIsMuted(cinemaVideoRef.current.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const agencyPriceNum = includeMotionBump ? 548 : 349;
  const buyoutPriceNum = includeMotionBump ? 1689 : 1490;

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Parisian Hospitality Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'maisonlumiere_buyout_1490' : 'maisonlumiere_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Parisian Salon Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Maison Lumière Paris Gastronomy Kit${suffix}`
      : `Agency License: Maison Lumière Paris Antigravity React + 150MP Kit${suffix}`;
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;

    const activeUser = currentUser || auth.currentUser;
    if (activeUser) {
      await recordOrderIntent(activeUser, productName, price);
      setCheckoutData({ isOpen: true, name: productName, price, zipLink });
    } else {
      setLoginModal({ isOpen: true, tierName: productName, price, zipLink });
    }
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: booking.name,
          email: booking.phone,
          category: 'Maison Lumière Paris ★★★ — Place Vendôme Table',
          item: `${booking.guests} • ${booking.salon}`,
          date: `${booking.date} (${booking.time})`,
          message: `Paris reservation for ${booking.guests} in ${booking.salon}. Notes: ${booking.notes || 'Champagne aperitif'}`
        })
      });
    } catch {
      // silent fallback
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredMenu =
    menuFilter === 'All'
      ? FRENCH_MENU
      : FRENCH_MENU.filter((i) => i.category === menuFilter);

  const activeReel = PARIS_REELS[activeReelIdx] || PARIS_REELS[0];

  return (
    <div className="lumiere-root relative z-20 min-h-screen w-full bg-[#081511] text-[#F6F1E7] overflow-x-hidden selection:bg-[#D9B978] selection:text-[#081511]">
      <Helmet>
        <title>Maison Lumière — Three Michelin Stars | Place Vendôme, Paris</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italiana&family=Montserrat:wght@300;400;500;600&family=Pinyon+Script&display=swap');

        .lumiere-root {
          background-color: #081511 !important;
          color: #F6F1E7 !important;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .lumiere-display {
          font-family: 'Italiana', Georgia, serif !important;
          letter-spacing: 0.03em;
        }
        .lumiere-script {
          font-family: 'Pinyon Script', cursive !important;
          font-weight: 400 !important;
        }
        .lumiere-kicker {
          font-family: 'Montserrat', sans-serif !important;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .lumiere-root input:not([type="checkbox"]),
        .lumiere-root select,
        .lumiere-root textarea {
          background-color: transparent !important;
          color: #F6F1E7 !important;
          color-scheme: dark !important;
          box-shadow: none !important;
          font-family: 'Montserrat', sans-serif !important;
        }
        .lumiere-root input::placeholder {
          color: rgba(246, 241, 231, 0.38) !important;
        }
        .lumiere-root input:focus,
        .lumiere-root select:focus {
          outline: none !important;
        }
        .lumiere-root select option {
          background-color: #0C1F19 !important;
          color: #F6F1E7 !important;
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 sm:px-12 ${
          scrolled
            ? 'bg-[#081511]/92 backdrop-blur-xl border-b border-[#D9B978]/20 py-4'
            : 'bg-gradient-to-b from-[#081511]/85 to-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollTo('hero')} className="text-left cursor-pointer">
            <span className="lumiere-display block text-2xl sm:text-3xl text-[#F6F1E7] leading-none">
              MAISON <span className="lumiere-script text-4xl text-[#D9B978] normal-case">Lumière</span>
            </span>
            <span className="lumiere-kicker block text-[8px] text-[#D9B978]/85 mt-1">
              Place Vendôme • Paris • ★★★
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[10.5px] font-medium tracking-[0.22em] uppercase text-[#DCE5DF]">
            <button type="button" onClick={() => scrollTo('paris-cinema')} className="hover:text-[#D9B978] transition-colors cursor-pointer">16:9 Film</button>
            <button type="button" onClick={() => scrollTo('haute-cuisine')} className="hover:text-[#D9B978] transition-colors cursor-pointer">Cuisine &amp; Pâtisserie</button>
            <button type="button" onClick={() => scrollTo('la-cave')} className="hover:text-[#D9B978] transition-colors cursor-pointer">La Cave</button>
            <button type="button" onClick={() => scrollTo('reserve')} className="hover:text-[#D9B978] transition-colors cursor-pointer">Reservations</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="text-[#D9B978] font-semibold hover:text-white transition-colors cursor-pointer">License Kit</button>
          </nav>

          <button
            type="button"
            onClick={() => scrollTo('reserve')}
            className="px-7 py-2.5 rounded-full bg-[#D9B978] text-[#081511] text-[10px] font-semibold tracking-[0.22em] uppercase hover:bg-[#EBD29D] transition-colors shadow-lg cursor-pointer"
          >
            Réserver
          </button>
        </div>
      </header>

      {/* HERO */}
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => setHeroParallax({ x: 0, y: 0 })}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20"
      >
        <motion.div animate={{ x: -heroParallax.x, y: -heroParallax.y, scale: 1.05 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2200&q=90"
            alt="Maison Lumière Paris"
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#081511]/85 via-[#081511]/55 to-[#081511]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,185,120,0.12)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D9B978]/40 bg-[#0C1F19]/80 backdrop-blur-md">
              <Sparkles size={13} className="text-[#D9B978]" />
              <span className="lumiere-kicker text-[9.5px] text-[#D9B978]">
                Three Michelin Stars • 14 Place Vendôme
              </span>
            </div>

            <h1 className="lumiere-display text-5xl sm:text-7xl md:text-[5.4rem] leading-[1.02] text-[#F6F1E7]">
              Haute Cuisine,
              <span className="lumiere-script block text-6xl sm:text-8xl text-[#D9B978] mt-1 leading-[0.88]">
                Emerald Velvet &amp; Champagne
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#CAD6CF] font-light leading-relaxed max-w-xl">
              Inside an eighteenth-century Parisian hôtel particulier, Chef Henri Delacroix honors
              timeless French gastronomy: Christofle silver-press duck, Brittany blue lobster, warm
              Grand Marnier soufflé, and rare Salon Champagnes.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('paris-cinema')}
                className="px-7 py-3.5 rounded-full bg-[#D9B978] text-[#081511] text-[10.5px] font-semibold uppercase tracking-[0.22em] hover:bg-[#EBD29D] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Play size={13} className="fill-current" /> Watch 16:9 Film
              </button>
              <button
                type="button"
                onClick={() => scrollTo('haute-cuisine')}
                className="px-7 py-3.5 rounded-full border border-[#D9B978]/45 text-[#F6F1E7] text-[10.5px] font-medium uppercase tracking-[0.22em] hover:border-[#D9B978] hover:text-[#D9B978] transition-colors cursor-pointer"
              >
                Explore La Carte
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <AntigravityFloat floatDelay={0.2} floatRange={10} tiltStrength={6} className="w-full max-w-sm rounded-[2rem] overflow-hidden bg-[#0C1F19]/92 backdrop-blur-xl border border-[#D9B978]/30 shadow-[0_35px_90px_rgba(0,0,0,0.85)]">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85" alt="Parisian Gastronomy" className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-[#6E1D2B] text-[#F6F1E7] text-[9.5px] uppercase tracking-[0.2em]">
                  Menu Prestige • €340
                </span>
              </div>
              <div className="p-6 space-y-3">
                <span className="lumiere-kicker text-[9px] text-[#D9B978] block">Dîner de Gala</span>
                <h3 className="lumiere-display text-3xl text-[#F6F1E7]">Seven-Course Vendôme</h3>
                <p className="text-xs text-[#AFC0B7] font-light leading-relaxed">
                  Tableside silver-press service paired with Salon Le Mesnil &amp; Château d’Yquem.
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo('reserve')}
                  className="w-full mt-2 py-3 rounded-full border border-[#D9B978]/45 text-[10px] uppercase tracking-[0.22em] text-[#D9B978] hover:bg-[#D9B978] hover:text-[#081511] transition-colors cursor-pointer"
                >
                  Reserve Salon Table
                </button>
              </div>
            </AntigravityFloat>
          </div>
        </div>
      </section>

      {/* 16:9 CINEMA VIDEO PLACEHOLDER */}
      <section id="paris-cinema" className="py-28 px-6 bg-[#0C1F19] border-t border-[#D9B978]/15">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="lumiere-kicker inline-flex items-center gap-2 text-[10px] text-[#D9B978] mb-2">
                <Video size={14} /> {activeReel.chapter}
              </span>
              <h2 className="lumiere-display text-4xl sm:text-5xl text-[#F6F1E7]">{activeReel.title}</h2>
              <p className="text-sm text-[#AFC0B7] font-light mt-2 max-w-xl">{activeReel.desc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {PARIS_REELS.map((reel, idx) => (
                <button
                  key={reel.id}
                  type="button"
                  onClick={() => {
                    setCustomVideoUrl('');
                    setActiveReelIdx(idx);
                    setIsPlaying(true);
                  }}
                  className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.2em] uppercase border transition-colors cursor-pointer ${
                    activeReelIdx === idx && !customVideoUrl
                      ? 'bg-[#D9B978] border-[#D9B978] text-[#081511] font-semibold'
                      : 'border-[#D9B978]/35 text-[#F6F1E7] hover:border-[#D9B978]'
                  }`}
                >
                  Reel 0{idx + 1} (16:9)
                </button>
              ))}
            </div>
          </div>

          <AntigravityFloat floatDelay={0.2} floatRange={7} tiltStrength={3.5} className="relative w-full aspect-video overflow-hidden rounded-[2rem] bg-black border border-[#D9B978]/30 shadow-[0_40px_110px_rgba(0,0,0,0.9)]">
            {hasLiveVideoFile ? (
              <video ref={cinemaVideoRef} key={effectiveVideoUrl} autoPlay loop muted={isMuted} playsInline poster={activeReel.poster} onError={() => setVideoError(true)} className="h-full w-full object-cover">
                <source src={effectiveVideoUrl} type="video/mp4" />
                <source src={effectiveVideoUrl} type="video/webm" />
              </video>
            ) : (
              <div className="relative h-full w-full overflow-hidden">
                <motion.img
                  key={activeReel.poster}
                  src={activeReel.poster}
                  alt={activeReel.title}
                  animate={isPlaying && !reduceMotion ? { scale: [1.02, 1.09, 1.02] } : { scale: 1.02 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full w-full object-cover opacity-80"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="rounded-3xl bg-[#081511]/85 backdrop-blur-xl border border-[#D9B978]/40 px-7 py-5 text-center shadow-2xl max-w-md">
                    <span className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#D9B978] text-[#081511]">
                      <Film size={18} />
                    </span>
                    <span className="lumiere-display block text-2xl text-[#F6F1E7]">16:9 Parisian Cinema Slot</span>
                    <span className="block text-[11px] text-[#AFC0B7] mt-1">
                      3840 × 2160 UHD Ready • Paste any .mp4 / .webm URL below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081511]/90 via-transparent to-[#081511]/30" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={togglePlay} className="w-11 h-11 rounded-full border border-white/25 bg-[#081511]/75 backdrop-blur-md text-[#F6F1E7] hover:border-[#D9B978] hover:text-[#D9B978] flex items-center justify-center transition cursor-pointer">
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button type="button" onClick={toggleMute} className="w-11 h-11 rounded-full border border-white/25 bg-[#081511]/75 backdrop-blur-md text-[#F6F1E7] hover:border-[#D9B978] hover:text-[#D9B978] flex items-center justify-center transition cursor-pointer">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-[#081511]/90 border border-[#D9B978]/40 px-4 py-2 backdrop-blur-xl">
                <Link2 size={14} className="text-[#D9B978] shrink-0" />
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="Paste 16:9 .mp4 or .webm URL to preview..."
                  className="w-full text-xs"
                />
                {customVideoUrl && (
                  <button type="button" onClick={() => setCustomVideoUrl('')} className="text-[10px] font-semibold uppercase tracking-widest text-[#D9B978] cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* HAUTE CUISINE, COCKTAILS & PÂTISSERIE GALLERY */}
      <section id="haute-cuisine" className="py-28 px-6 bg-[#081511] border-t border-[#D9B978]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="lumiere-kicker text-[10px] text-[#D9B978] block mb-2">La Carte de Paris</span>
              <h2 className="lumiere-display text-4xl sm:text-6xl text-[#F6F1E7]">
                Cuisine, Cocktails <span className="lumiere-script text-5xl sm:text-7xl text-[#D9B978]">&amp; Pâtisserie</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {FRENCH_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMenuFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    menuFilter === tab
                      ? 'bg-[#D9B978] border-[#D9B978] text-[#081511] font-semibold'
                      : 'bg-[#0C1F19] border-[#D9B978]/25 text-[#DCE5DF] hover:border-[#D9B978]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item, idx) => (
              <AntigravityFloat key={item.id} floatDelay={(idx % 3) * 0.45} floatRange={6} tiltStrength={4.5} invertFloat={idx % 2 === 1}>
                <article
                  onClick={() => setSelectedDish(item)}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-[#0C1F19] border border-[#D9B978]/20 hover:border-[#D9B978]/60 transition-all shadow-[0_25px_65px_rgba(0,0,0,0.75)] flex flex-col h-full"
                >
                  <div className="relative h-60 overflow-hidden bg-black">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#081511]/85 backdrop-blur-md border border-[#D9B978]/35 text-[9px] uppercase tracking-[0.2em] text-[#D9B978]">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 px-4 py-1 rounded-full bg-[#D9B978] text-[#081511] text-xs font-semibold">
                      {item.price}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="lumiere-kicker text-[9px] text-[#AFC0B7] block">{item.category} · {item.prep}</span>
                      <h3 className="lumiere-display text-2xl sm:text-[1.75rem] text-[#F6F1E7] group-hover:text-[#D9B978] transition-colors mt-1.5">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#AFC0B7] font-light leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#D9B978]/15 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#D9B978]">
                      <span>Tasting Notes</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* LA CAVE — CHAMPAGNE & BORDEAUX GALLERY */}
      <section id="la-cave" className="py-28 px-6 bg-[#0C1F19] border-t border-[#D9B978]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="lumiere-kicker inline-flex items-center gap-2 text-[10px] text-[#D9B978] mb-3">
              <Wine size={14} /> La Cave de Place Vendôme
            </span>
            <h2 className="lumiere-display text-4xl sm:text-6xl text-[#F6F1E7]">
              Champagne &amp; <span className="lumiere-script text-5xl sm:text-7xl text-[#D9B978]">Grands Crus</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {PARIS_CELLAR.map((wine, idx) => (
              <AntigravityFloat key={wine.id} floatDelay={idx * 0.35} floatRange={6} tiltStrength={4} invertFloat={idx % 2 === 0}>
                <article className="rounded-3xl overflow-hidden bg-[#081511] border border-[#D9B978]/25 hover:border-[#D9B978]/60 transition-all shadow-xl flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={wine.image} alt={wine.name} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#081511]/85 text-[9px] uppercase tracking-[0.18em] text-[#D9B978]">
                      {wine.region} · {wine.vintage}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="lumiere-display text-2xl text-[#F6F1E7] leading-snug">{wine.name}</h3>
                      <p className="text-xs text-[#AFC0B7] font-light mt-2 leading-relaxed">{wine.notes}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#D9B978]/15 flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-medium text-[#F6F1E7]">{wine.price}</span>
                        <span className="block text-[10px] text-[#D9B978]">{wine.pour}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, notes: `Sommelier allocation: ${wine.name} (${wine.vintage})` }));
                          scrollTo('reserve');
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#D9B978]/45 text-[9.5px] uppercase tracking-[0.18em] text-[#D9B978] hover:bg-[#D9B978] hover:text-[#081511] transition-colors cursor-pointer"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reserve" className="py-28 px-6 bg-[#081511] border-t border-[#D9B978]/15">
        <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-[#0C1F19] border border-[#D9B978]/25 p-8 sm:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <span className="lumiere-kicker text-[10px] text-[#D9B978] block mb-2">Maître d’Hôtel</span>
            <h2 className="lumiere-display text-4xl sm:text-5xl text-[#F6F1E7]">
              Réserver Votre <span className="lumiere-script text-5xl sm:text-6xl text-[#D9B978]">Table</span>
            </h2>
          </div>

          {submitted ? (
            <div className="p-10 rounded-3xl bg-[#081511] border border-[#D9B978]/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#D9B978] text-[#081511] flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h3 className="lumiere-display text-3xl text-[#F6F1E7]">Bienvenue, {booking.name}</h3>
              <p className="text-sm text-[#CAD6CF] font-light">
                We have noted your request for <strong>{booking.guests}</strong> in {booking.salon} on {booking.date}.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="px-7 py-2.5 rounded-full border border-[#D9B978]/45 text-[10px] uppercase tracking-[0.2em] cursor-pointer">
                Modify
              </button>
            </div>
          ) : (
            <form onSubmit={submitReservation} className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="border-b border-[#D9B978]/25 focus-within:border-[#D9B978] pb-2">
                <label className="lumiere-kicker block text-[9px] text-[#D9B978] mb-1.5">Guest Name *</label>
                <input type="text" required placeholder="M. / Mme Full Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#D9B978]/25 focus-within:border-[#D9B978] pb-2">
                <label className="lumiere-kicker block text-[9px] text-[#D9B978] mb-1.5">Phone or Email *</label>
                <input type="text" required placeholder="+33 1 42 68 55 10" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#D9B978]/25 focus-within:border-[#D9B978] pb-2">
                <label className="lumiere-kicker block text-[9px] text-[#D9B978] mb-1.5">Date *</label>
                <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="w-full text-sm font-light cursor-pointer" />
              </div>
              <div className="border-b border-[#D9B978]/25 focus-within:border-[#D9B978] pb-2">
                <label className="lumiere-kicker block text-[9px] text-[#D9B978] mb-1.5">Seating</label>
                <select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} className="w-full text-sm font-light cursor-pointer">
                  <option>12:30 — Déjeuner</option>
                  <option>20:00 — Dîner de Gala</option>
                  <option>21:30 — Soirée Privée</option>
                </select>
              </div>
              <div className="sm:col-span-2 border-b border-[#D9B978]/25 focus-within:border-[#D9B978] pb-2">
                <label className="lumiere-kicker block text-[9px] text-[#D9B978] mb-1.5">Dietary &amp; Sommelier Notes</label>
                <input type="text" placeholder="Champagne sabrage, allergies, celebration..." value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="sm:col-span-2 pt-4 text-center">
                <button type="submit" disabled={isSubmitting} className="px-14 py-4 rounded-full bg-[#D9B978] text-[#081511] text-[10.5px] font-semibold uppercase tracking-[0.26em] hover:bg-[#EBD29D] transition-colors shadow-lg cursor-pointer">
                  {isSubmitting ? 'Confirming...' : 'Confirm Parisian Table'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* VISIBLE COMMERCIAL PRICING + ORDER BUMP + FREE SAMPLE CLOUD */}
      <section id="licensing" className="py-24 px-6 bg-[#0C1F19] border-t border-[#D9B978]/15">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="lumiere-kicker inline-flex items-center gap-2 text-[10px] text-[#D9B978] mb-2">
              <Crown size={14} /> Commercial React + 150MP Parisian Kit
            </span>
            <h2 className="lumiere-display text-4xl sm:text-5xl text-[#F6F1E7]">
              Acquire <span className="lumiere-script text-5xl sm:text-6xl text-[#D9B978]">Maison Lumière</span>
            </h2>
          </div>

          <div
            onClick={() => setIncludeMotionBump(!includeMotionBump)}
            className="mb-8 rounded-3xl border border-[#D9B978]/35 bg-[#081511] p-5 flex items-center gap-4 cursor-pointer hover:border-[#D9B978] transition-colors"
          >
            <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="h-5 w-5 cursor-pointer accent-[#D9B978]" />
            <div className="flex-1">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F6F1E7]">
                Add 30s 4K Parisian Salon Motion Pack for the 16:9 Cinema Slot (+$199)
              </span>
              <span className="block text-xs text-[#AFC0B7] mt-0.5">
                Seamless 60fps UHD video loops ready to drop into Reel 01 &amp; Reel 02.
              </span>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-[#081511] border border-[#D9B978]/25 flex flex-col justify-between shadow-xl">
              <div>
                <span className="lumiere-kicker text-[10px] text-[#D9B978]">Agency License</span>
                <p className="lumiere-display text-5xl text-[#F6F1E7] mt-2">${agencyPriceNum}</p>
                <p className="text-xs text-[#AFC0B7] mt-3 leading-relaxed">
                  Complete Maison Lumière Paris React JSX + 16:9 Cinema Slot + Haute Cuisine &amp; Champagne Galleries + Commercial Rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="mt-8 w-full py-4 rounded-full bg-[#D9B978] text-[#081511] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#EBD29D] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <DownloadCloud size={15} /> License Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#F6F1E7] text-[#081511] flex flex-col justify-between shadow-xl">
              <div>
                <span className="lumiere-kicker text-[10px] text-[#6E1D2B]">1-of-1 Exclusive Buyout</span>
                <p className="lumiere-display text-5xl mt-2">${buyoutPriceNum}</p>
                <p className="text-xs text-[#43524A] mt-3 leading-relaxed">
                  Permanent store removal + 100% IP transfer + 10 custom 150MP Ultra Print Place Vendôme renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="mt-8 w-full py-4 rounded-full bg-[#081511] text-[#F6F1E7] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#6E1D2B] transition-colors cursor-pointer flex items-center justify-center gap-2"
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
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#081511] border border-[#D9B978]/45 text-[#F6F1E7] hover:bg-[#D9B978] hover:text-[#081511] transition-all shadow-lg text-xs font-medium uppercase tracking-[0.18em]"
            >
              <DownloadCloud size={18} className="text-[#D9B978]" />
              <span>Download Free 4K Preview Sample</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#050E0B] border-t border-[#D9B978]/15 pt-14 pb-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="lumiere-display text-2xl text-[#F6F1E7]">
              MAISON <span className="lumiere-script text-4xl text-[#D9B978]">Lumière</span>
            </span>
            <p className="text-xs text-[#8FA398] mt-1">14 Place Vendôme, 75001 Paris, France</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#CAD6CF]">
            <span className="flex items-center gap-2"><Phone size={13} className="text-[#D9B978]" /> +33 1 42 68 55 10</span>
            <span className="flex items-center gap-2"><MapPin size={13} className="text-[#D9B978]" /> Place Vendôme, Paris</span>
          </div>
        </div>
      </footer>

      {/* FLOATING FREE SAMPLE CLOUD BUBBLE ("Oblačić") */}
      <a
        href={KIT_CONFIG.freeSampleLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Download Free 4K Sample"
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#0C1F19]/95 border border-[#D9B978]/45 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F6F1E7] shadow-2xl backdrop-blur-md hover:bg-[#D9B978] hover:text-[#081511] transition-all"
      >
        <DownloadCloud size={16} className="text-[#D9B978]" />
        <span className="hidden sm:inline">Free Sample</span>
      </a>

      {/* DISH MODAL */}
      {selectedDish &&
        createPortal(
          <div onClick={() => setSelectedDish(null)} className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#0C1F19] border border-[#D9B978]/35 text-[#F6F1E7] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="relative h-64">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#081511]/85 text-[#D9B978] flex items-center justify-center cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="p-7 space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#D9B978]">
                  <span>{selectedDish.category} · {selectedDish.tag}</span>
                  <span className="text-base font-semibold text-[#F6F1E7]">{selectedDish.price}</span>
                </div>
                <h3 className="text-3xl text-[#F6F1E7]" style={{ fontFamily: "'Italiana', Georgia, serif" }}>
                  {selectedDish.name}
                </h3>
                <p className="text-sm text-[#CAD6CF] font-light leading-relaxed">{selectedDish.description}</p>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDish.name;
                      setSelectedDish(null);
                      setBooking((prev) => ({ ...prev, notes: `Pre-requested dish: ${name}` }));
                      scrollTo('reserve');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#D9B978] text-[#081511] text-[10px] font-semibold uppercase tracking-[0.2em] cursor-pointer"
                  >
                    Request at Table
                  </button>
                </div>
              </div>
            </div>
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
      <div className="fixed bottom-6 left-6 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#0C1F19]/95 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#F6F1E7] shadow-2xl border border-[#D9B978]/35 backdrop-blur-md transition hover:border-[#D9B978] cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D9B978] text-[#081511]">
            <ArrowLeft size={13} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#D9B978] px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#081511] shadow-2xl transition hover:bg-[#EBD29D] cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#081511] text-[#D9B978]">
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
}