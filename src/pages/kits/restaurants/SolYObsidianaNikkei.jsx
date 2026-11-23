// ============================================================================
// src/pages/kits/restaurants/SolYObsidianaNikkei.jsx
// SOL Y OBSIDIANA — Peruvian Nikkei & Mezcaleria • Miami Design District / Tulum
// Volcanic Basalt, Burnished Copper & Agave Jade • Full Antigravity 3D Edition
// 16:9 Cinema Placeholder + Zero-G Particles + Visible Pricing + Free Sample Cloud
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Phone, Wine, Check, X, ArrowUpRight, ArrowLeft, ArrowRight,
  Crown, DownloadCloud, Lock, Play, Pause, Volume2, VolumeX, Link2,
  Video, Film, Flame
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
const VIDEO_REEL_1_URL = ''; // e.g. '/restaurants/nikkei-miami-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/restaurants/nikkei-mezcal-02.mp4'

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-solyobsidiana-nikkei-349-link',
  buyoutZipLink: 'https://drive.google.com/your-solyobsidiana-nikkei-1490-link',
  freeSampleLink: 'https://drive.google.com/your-solyobsidiana-nikkei-sample-link',
  prevPageRoute: '/maison-lumiere',
  prevPageLabel: 'Prev: Maison Lumière Paris (4/5)',
  nextLandingRoute: '/diamonds-kit',
  nextLandingLabel: 'Next: High Jewelry (1/2)'
};

const VOLCANIC_PARTICLES = [
  { left: '8%', top: '85%', size: 4, dur: 9.2, delay: 0, jade: false },
  { left: '19%', top: '72%', size: 6, dur: 11.8, delay: 1.0, jade: true },
  { left: '32%', top: '88%', size: 3, dur: 8.5, delay: 0.4, jade: false },
  { left: '48%', top: '76%', size: 5, dur: 11.0, delay: 1.8, jade: true },
  { left: '63%', top: '84%', size: 4, dur: 9.8, delay: 0.6, jade: false },
  { left: '77%', top: '70%', size: 6, dur: 12.4, delay: 1.4, jade: true },
  { left: '89%', top: '82%', size: 4, dur: 9.5, delay: 2.1, jade: false }
];

const NIKKEI_REELS = [
  {
    id: 'n-reel-1',
    chapter: 'Reel 01 • The Volcanic Hearth (16:9 UHD)',
    title: 'Torched Yellowtail, Ají Amarillo & Live Embers',
    desc: 'A 16:9 widescreen film capturing Japanese knife precision meeting Peruvian citrus fire and smoked copal incense.',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=90'
  },
  {
    id: 'n-reel-2',
    chapter: 'Reel 02 • The Agave & Mezcal Bar (16:9 UHD)',
    title: 'Wild Oaxacan Agave, Copper Stills & Midnight Tulum',
    desc: 'Secondary 16:9 UHD motion slot ready for Seedance 2.5 or Kling 4.0 cocktail alchemy and jungle-courtyard loops.',
    poster: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1920&q=90'
  }
];

const NIKKEI_FILTERS = ['All', 'Tiradito & Ceviche', 'Robata & Anticuchos', 'Mezcal Alchemy', 'Postres'];

const NIKKEI_MENU = [
  {
    id: 1,
    name: 'Hamachi Tiradito & Truffle Leche de Tigre',
    category: 'Tiradito & Ceviche',
    price: '$38',
    tag: 'Signature Raw',
    prep: 'Ají Amarillo & Yuzu',
    description: 'Line-caught Japanese yellowtail sliced razor-thin, bathed in white truffle leche de tigre, crispy cancha corn, and micro cilantro.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 2,
    name: 'Bluefin Tuna & Smoked Rocoto Ceviche',
    category: 'Tiradito & Ceviche',
    price: '$42',
    tag: 'Lima Classic',
    prep: 'Charred Sweet Potato',
    description: 'Diced Bluefin akami cured to order in key lime, smoked Peruvian rocoto chili, avocado mousse, and nori crisps.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 3,
    name: 'Hokkaido Scallop & Passionfruit Aguachile',
    category: 'Tiradito & Ceviche',
    price: '$36',
    tag: 'Raw Bar',
    prep: 'Maracuyá & Jalapeño',
    description: 'Sweet raw scallops dressed in emerald jalapeño-passionfruit aguachile, finger lime pearls, and toasted sesame oil.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 4,
    name: 'A5 Wagyu Anticuchos & Black Garlic',
    category: 'Robata & Anticuchos',
    price: '$68',
    tag: 'Volcanic Grill',
    prep: 'Ají Panca Glaze',
    description: 'Miyazaki A5 striploin skewers seared over volcanic charcoal, brushed with smoky ají panca anticuchera sauce and crispy yuca.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 5,
    name: 'Charred Octopus & Peruvian Olive Emulsion',
    category: 'Robata & Anticuchos',
    price: '$44',
    tag: 'Binchotan Seared',
    prep: 'Botija Olive Purée',
    description: 'Tender Spanish octopus glazed in mirin-chili tare over velvety Botija olive crema and Andean purple potato.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 6,
    name: 'Smoked Copal & Mango Mezcalita',
    category: 'Mezcal Alchemy',
    price: '$26',
    tag: 'Bar Icon',
    prep: 'Tobalá Wild Agave',
    description: 'Artisanal Oaxacan Tobalá mezcal, charred Ataulfo mango, chili-salted volcanic rim, and sacred copal smoke.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 7,
    name: 'Obsidian Yuzu & Activated Charcoal Margarita',
    category: 'Mezcal Alchemy',
    price: '$28',
    tag: 'Nocturnal',
    prep: 'Reposado & Agave',
    description: 'Single-estate Jalisco reposado, fresh yuzu, black lava salt, and hibiscus-infused agave nectar.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 8,
    name: 'Chicha Morada & Hibiscus Pisco Sour',
    category: 'Mezcal Alchemy',
    price: '$24',
    tag: 'Lima Heritage',
    prep: 'Quebranta Pisco',
    description: 'Peruvian Quebranta pisco shaken with purple corn reduction, spiced hibiscus, lime, and silky foam.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 9,
    name: 'Lúcuma & Single-Origin Peruvian Cacao Tart',
    category: 'Postres',
    price: '$22',
    tag: 'Andean Finale',
    prep: '72% Piura Cacao',
    description: 'Warm Peruvian dark chocolate ganache layered with caramel-like lúcuma mousse and toasted quinoa praline.',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=1000&q=85'
  }
];

const AGAVE_VAULT = [
  {
    id: 'av-1',
    type: 'Wild Tepeztate Mezcal',
    origin: 'San Baltazar, Oaxaca',
    name: 'El Jolgorio Tepeztate',
    price: '$540',
    pour: '$48 (2oz)',
    notes: '25-year wild mountain agave. Roasted green pepper, wet slate, and lingering citrus smoke.',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'av-2',
    type: 'Extra Añejo Tequila',
    origin: 'Los Altos, Jalisco',
    name: 'Clase Azul Ultra Reserve',
    price: '$2,400',
    pour: '$195 (2oz)',
    notes: 'Aged 5 years in Spanish sherry casks. Dried plum, cinnamon, dark chocolate, and velvet oak.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'av-3',
    type: 'Ancestral Clay-Pot Mezcal',
    origin: 'Santa Catarina Minas',
    name: 'Lalocura Pechuga de Mole',
    price: '$480',
    pour: '$44 (2oz)',
    notes: 'Distilled in clay pots with Oaxacan mole spices, roasted cacao, and wild orchard fruit.',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'av-4',
    type: 'Junmai Daiginjo Sake',
    origin: 'Niigata, Japan',
    name: 'Kubota Manju Reserve',
    price: '$290',
    pour: '$36 (90ml)',
    notes: 'Crisp Nikkei pairing: white melon, delicate rice umami, and razor-clean mineral finish.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=85'
  }
];

// ============================================================================
// ENHANCED 3D ANTIGRAVITY FLOAT & TILT WRAPPER
// ============================================================================
const AntigravityFloat = ({
  children,
  className = '',
  floatDelay = 0,
  floatRange = 12,
  tiltStrength = 9,
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
      transition={{ duration: 5.2 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: 'transform'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function SolYObsidianaNikkei() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0 });
  const heroRef = useRef(null);

  // 16:9 Cinema State
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Menu & Modal
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
    date: '2026-12-19',
    time: '20:30 — Prime Courtyard',
    guests: '2 Guests',
    area: 'Volcanic Courtyard & Mezcal Bar',
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
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'SolYObsidianaNikkei' });
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
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroParallax({ x: px * 18, y: py * 12 });
    setHeroTilt({ rx: -py * 14, ry: px * 14 });
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
        ime: user.displayName || 'B2B Nikkei Hospitality Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'solyobsidiana_buyout_1490' : 'solyobsidiana_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Nikkei & Mezcal Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Sol y Obsidiana Nikkei & Mezcal Kit${suffix}`
      : `Agency License: Sol y Obsidiana Nikkei Antigravity React + 150MP Kit${suffix}`;
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
          category: 'Sol y Obsidiana — Miami / Tulum Nikkei Table',
          item: `${booking.guests} • ${booking.area}`,
          date: `${booking.date} (${booking.time})`,
          message: `Nikkei & Mezcal reservation for ${booking.guests} at ${booking.area}. Notes: ${booking.notes || 'Mezcal tasting'}`
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
      ? NIKKEI_MENU
      : NIKKEI_MENU.filter((i) => i.category === menuFilter);

  const activeReel = NIKKEI_REELS[activeReelIdx] || NIKKEI_REELS[0];

  return (
    <div className="nikkei-root relative z-20 min-h-screen w-full bg-[#0A0807] text-[#F3ECE1] overflow-x-hidden selection:bg-[#C87A4B] selection:text-[#0A0807]">
      <Helmet>
        <title>SOL Y OBSIDIANA — Peruvian Nikkei &amp; Mezcaleria | Miami &amp; Tulum</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

        .nikkei-root {
          background-color: #0A0807 !important;
          color: #F3ECE1 !important;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .nikkei-display {
          font-family: 'Cinzel', Georgia, serif !important;
          letter-spacing: 0.06em;
        }
        .nikkei-kicker {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .nikkei-root input:not([type="checkbox"]),
        .nikkei-root select,
        .nikkei-root textarea {
          background-color: transparent !important;
          color: #F3ECE1 !important;
          color-scheme: dark !important;
          box-shadow: none !important;
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
        .nikkei-root input::placeholder {
          color: rgba(243, 236, 225, 0.36) !important;
        }
        .nikkei-root input:focus,
        .nikkei-root select:focus {
          outline: none !important;
        }
        .nikkei-root select option {
          background-color: #14100E !important;
          color: #F3ECE1 !important;
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 sm:px-12 ${
          scrolled
            ? 'bg-[#0A0807]/92 backdrop-blur-xl border-b border-[#C87A4B]/20 py-4'
            : 'bg-gradient-to-b from-[#0A0807]/85 to-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollTo('hero')} className="text-left cursor-pointer">
            <span className="nikkei-display block text-xl sm:text-2xl text-[#F3ECE1] leading-none">
              SOL <span className="text-[#C87A4B]">Y</span> OBSIDIANA
            </span>
            <span className="nikkei-kicker block text-[8px] text-[#C87A4B]/85 mt-1">
              Miami Design District • Tulum
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[10.5px] font-medium tracking-[0.22em] uppercase text-[#D8CEC0]">
            <button type="button" onClick={() => scrollTo('nikkei-cinema')} className="hover:text-[#C87A4B] transition-colors cursor-pointer">16:9 Film</button>
            <button type="button" onClick={() => scrollTo('nikkei-menu')} className="hover:text-[#C87A4B] transition-colors cursor-pointer">Nikkei &amp; Mezcal</button>
            <button type="button" onClick={() => scrollTo('agave-vault')} className="hover:text-[#C87A4B] transition-colors cursor-pointer">Agave Vault</button>
            <button type="button" onClick={() => scrollTo('reserve')} className="hover:text-[#C87A4B] transition-colors cursor-pointer">Reservations</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="text-[#C87A4B] font-semibold hover:text-white transition-colors cursor-pointer">License Kit</button>
          </nav>

          <button
            type="button"
            onClick={() => scrollTo('reserve')}
            className="px-7 py-2.5 rounded-full bg-[#C87A4B] text-[#0A0807] text-[10px] font-semibold tracking-[0.22em] uppercase hover:bg-[#DC9264] transition-colors shadow-lg cursor-pointer"
          >
            Book Table
          </button>
        </div>
      </header>

      {/* FULL ANTIGRAVITY 3D HERO */}
      <section
        id="hero"
        ref={heroRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={() => {
          setHeroParallax({ x: 0, y: 0 });
          setHeroTilt({ rx: 0, ry: 0 });
        }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-28 pb-20"
      >
        <motion.div animate={{ x: -heroParallax.x, y: -heroParallax.y, scale: 1.06 }} transition={{ duration: 0.35, ease: 'easeOut' }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2200&q=90"
            alt="Sol y Obsidiana Nikkei Courtyard"
            className="w-full h-full object-cover opacity-38"
          />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0807]/85 via-[#0A0807]/55 to-[#0A0807]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,122,75,0.16)_0%,transparent_60%)]" />

        {/* ZERO-GRAVITY RISING COPPER & AGAVE JADE PARTICLES */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {VOLCANIC_PARTICLES.map((p, idx) => (
            <motion.span
              key={idx}
              style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
              animate={reduceMotion ? {} : { y: [0, -170, 0], opacity: [0.15, 0.9, 0.15] }}
              transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              className={`absolute rounded-full ${
                p.jade
                  ? 'bg-[#3C8D78] shadow-[0_0_16px_rgba(60,141,120,0.95)]'
                  : 'bg-[#C87A4B] shadow-[0_0_16px_rgba(200,122,75,0.95)]'
              }`}
            />
          ))}
        </div>

        {/* CONCENTRIC ANTIGRAVITY ORBITAL RINGS */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <motion.div
            animate={reduceMotion ? {} : { rotate: 360 }}
            transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
            className="h-[460px] w-[460px] sm:h-[680px] sm:w-[680px] rounded-full border border-dashed border-[#C87A4B]/20"
          />
          <motion.div
            animate={reduceMotion ? {} : { rotate: -360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
            className="absolute h-[340px] w-[340px] sm:h-[520px] sm:w-[520px] rounded-full border border-[#2E5B4F]/30"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#C87A4B]/40 bg-[#14100E]/80 backdrop-blur-md">
              <Flame size={13} className="text-[#C87A4B]" />
              <span className="nikkei-kicker text-[9.5px] text-[#C87A4B]">
                Peruvian Nikkei • Zero-Gravity Mezcaleria
              </span>
            </div>

            <h1 className="nikkei-display text-4xl sm:text-6xl md:text-[4.6rem] leading-[1.06] text-[#F3ECE1]">
              Volcanic Stone,
              <span className="block text-[#C87A4B] mt-1">Copper &amp; Nikkei Fire.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#C4B9AA] font-light leading-relaxed max-w-xl">
              Where Lima’s coastal citrus meets Tokyo’s robata precision inside a candlelit basalt
              courtyard. Featuring line-caught tiraditos, A5 Wagyu anticuchos, and 180 rare wild
              Oaxacan mezcals.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('nikkei-cinema')}
                className="px-7 py-3.5 rounded-full bg-[#C87A4B] text-[#0A0807] text-[10.5px] font-semibold uppercase tracking-[0.22em] hover:bg-[#DC9264] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Play size={13} className="fill-current" /> Watch 16:9 Film
              </button>
              <button
                type="button"
                onClick={() => scrollTo('nikkei-menu')}
                className="px-7 py-3.5 rounded-full border border-[#C87A4B]/45 text-[#F3ECE1] text-[10.5px] font-medium uppercase tracking-[0.22em] hover:border-[#C87A4B] hover:text-[#C87A4B] transition-colors cursor-pointer"
              >
                Explore Nikkei Menu
              </button>
            </div>
          </div>

          {/* FULL ZERO-GRAVITY LEVITATING HERO CARD + MAGNETIC HALO */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              style={{
                transform: `perspective(1300px) rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`,
                transition: 'transform 160ms ease-out'
              }}
              className="w-full max-w-sm"
            >
              <motion.div
                animate={
                  reduceMotion
                    ? {}
                    : { y: [0, -24, 0], rotateZ: [-1.1, 1.1, -1.1] }
                }
                transition={{
                  y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
                  rotateZ: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }
                }}
                className="rounded-[2.2rem] overflow-hidden bg-[#14100E]/92 backdrop-blur-xl border-2 border-[#C87A4B]/50 shadow-[0_35px_100px_rgba(200,122,75,0.35)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=85" alt="Nikkei Tiradito" className="w-full h-full object-cover" />
                  <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-[#2E5B4F] text-[#F3ECE1] text-[9.5px] uppercase tracking-[0.2em]">
                    Miami • Tulum
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <span className="nikkei-kicker text-[9px] text-[#C87A4B] block">Chef’s Tasting Experience</span>
                  <h3 className="nikkei-display text-2xl text-[#F3ECE1]">Omakase del Sol</h3>
                  <p className="text-xs text-[#B3A798] font-light leading-relaxed">
                    $195 per guest · Optional Wild Oaxacan Mezcal &amp; Sake Flight $95
                  </p>
                  <button
                    type="button"
                    onClick={() => scrollTo('reserve')}
                    className="w-full mt-2 py-3 rounded-full border border-[#C87A4B]/45 text-[10px] uppercase tracking-[0.22em] text-[#C87A4B] hover:bg-[#C87A4B] hover:text-[#0A0807] transition-colors cursor-pointer"
                  >
                    Reserve Courtyard Table
                  </button>
                </div>
              </motion.div>
            </div>

            {/* REACTIVE ANTIGRAVITY FLOOR MAGNETIC HALO */}
            <motion.div
              animate={reduceMotion ? {} : { scaleX: [1, 0.68, 1], opacity: [0.65, 0.22, 0.65] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 h-6 w-64 rounded-full bg-gradient-to-r from-[#C87A4B]/55 via-[#2E5B4F]/55 to-[#C87A4B]/55 blur-2xl"
            />
          </div>
        </div>
      </section>

      {/* 16:9 CINEMA VIDEO PLACEHOLDER */}
      <section id="nikkei-cinema" className="py-28 px-6 bg-[#110D0B] border-t border-[#C87A4B]/15">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="nikkei-kicker inline-flex items-center gap-2 text-[10px] text-[#C87A4B] mb-2">
                <Video size={14} /> {activeReel.chapter}
              </span>
              <h2 className="nikkei-display text-3xl sm:text-5xl text-[#F3ECE1]">{activeReel.title}</h2>
              <p className="text-sm text-[#B3A798] font-light mt-2 max-w-xl">{activeReel.desc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {NIKKEI_REELS.map((reel, idx) => (
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
                      ? 'bg-[#C87A4B] border-[#C87A4B] text-[#0A0807] font-semibold'
                      : 'border-[#C87A4B]/35 text-[#F3ECE1] hover:border-[#C87A4B]'
                  }`}
                >
                  Reel 0{idx + 1} (16:9)
                </button>
              ))}
            </div>
          </div>

          <AntigravityFloat floatDelay={0.2} floatRange={10} tiltStrength={5} className="relative w-full aspect-video overflow-hidden rounded-[2rem] bg-black border border-[#C87A4B]/30 shadow-[0_40px_110px_rgba(0,0,0,0.9)]">
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
                  <div className="rounded-3xl bg-[#0A0807]/85 backdrop-blur-xl border border-[#C87A4B]/40 px-7 py-5 text-center shadow-2xl max-w-md">
                    <span className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#C87A4B] text-[#0A0807]">
                      <Film size={18} />
                    </span>
                    <span className="nikkei-display block text-xl text-[#F3ECE1]">16:9 Nikkei Cinema Slot</span>
                    <span className="block text-[11px] text-[#B3A798] mt-1">
                      3840 × 2160 UHD Ready • Paste any .mp4 / .webm URL below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0807]/90 via-transparent to-[#0A0807]/30" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={togglePlay} className="w-11 h-11 rounded-full border border-white/25 bg-[#0A0807]/75 backdrop-blur-md text-[#F3ECE1] hover:border-[#C87A4B] hover:text-[#C87A4B] flex items-center justify-center transition cursor-pointer">
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button type="button" onClick={toggleMute} className="w-11 h-11 rounded-full border border-white/25 bg-[#0A0807]/75 backdrop-blur-md text-[#F3ECE1] hover:border-[#C87A4B] hover:text-[#C87A4B] flex items-center justify-center transition cursor-pointer">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-[#0A0807]/90 border border-[#C87A4B]/40 px-4 py-2 backdrop-blur-xl">
                <Link2 size={14} className="text-[#C87A4B] shrink-0" />
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="Paste 16:9 .mp4 or .webm URL to preview..."
                  className="w-full text-xs"
                />
                {customVideoUrl && (
                  <button type="button" onClick={() => setCustomVideoUrl('')} className="text-[10px] font-semibold uppercase tracking-widest text-[#C87A4B] cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* NIKKEI & MEZCAL GALLERY */}
      <section id="nikkei-menu" className="py-28 px-6 bg-[#0A0807] border-t border-[#C87A4B]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="nikkei-kicker text-[10px] text-[#C87A4B] block mb-2">Lima Meets Tokyo</span>
              <h2 className="nikkei-display text-3xl sm:text-5xl text-[#F3ECE1]">
                Tiradito, Robata <span className="text-[#C87A4B]">&amp; Mezcal</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {NIKKEI_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMenuFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    menuFilter === tab
                      ? 'bg-[#C87A4B] border-[#C87A4B] text-[#0A0807] font-semibold'
                      : 'bg-[#14100E] border-[#C87A4B]/25 text-[#D8CEC0] hover:border-[#C87A4B]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item, idx) => (
              <AntigravityFloat key={item.id} floatDelay={(idx % 3) * 0.45} floatRange={11} tiltStrength={8} invertFloat={idx % 2 === 1}>
                <article
                  onClick={() => setSelectedDish(item)}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-[#14100E] border border-[#C87A4B]/25 hover:border-[#C87A4B]/70 transition-all shadow-[0_25px_65px_rgba(200,122,75,0.16)] flex flex-col h-full"
                >
                  <div className="relative h-60 overflow-hidden bg-black">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#0A0807]/85 backdrop-blur-md border border-[#C87A4B]/35 text-[9px] uppercase tracking-[0.2em] text-[#C87A4B]">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 px-4 py-1 rounded-full bg-[#C87A4B] text-[#0A0807] text-xs font-semibold">
                      {item.price}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="nikkei-kicker text-[9px] text-[#9A8F82] block">{item.category} · {item.prep}</span>
                      <h3 className="nikkei-display text-xl sm:text-2xl text-[#F3ECE1] group-hover:text-[#C87A4B] transition-colors mt-1.5 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#B3A798] font-light leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#C87A4B]/15 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#C87A4B]">
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

      {/* WILD AGAVE & MEZCAL VAULT */}
      <section id="agave-vault" className="py-28 px-6 bg-[#110D0B] border-t border-[#C87A4B]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="nikkei-kicker inline-flex items-center gap-2 text-[10px] text-[#C87A4B] mb-3">
              <Wine size={14} /> 180 Wild Agave &amp; Sake Allocations
            </span>
            <h2 className="nikkei-display text-3xl sm:text-5xl text-[#F3ECE1]">
              The Mezcal <span className="text-[#C87A4B]">&amp; Sake Vault</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {AGAVE_VAULT.map((bottle, idx) => (
              <AntigravityFloat key={bottle.id} floatDelay={idx * 0.35} floatRange={10} tiltStrength={8} invertFloat={idx % 2 === 0}>
                <article className="rounded-3xl overflow-hidden bg-[#14100E] border border-[#C87A4B]/25 hover:border-[#C87A4B]/65 transition-all shadow-xl flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={bottle.image} alt={bottle.name} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#0A0807]/85 text-[9px] uppercase tracking-[0.18em] text-[#C87A4B]">
                      {bottle.type}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="nikkei-kicker text-[8.5px] text-[#9A8F82] block">{bottle.origin}</span>
                      <h3 className="nikkei-display text-xl text-[#F3ECE1] mt-1">{bottle.name}</h3>
                      <p className="text-xs text-[#B3A798] font-light mt-2 leading-relaxed">{bottle.notes}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#C87A4B]/15 flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-medium text-[#F3ECE1]">{bottle.price}</span>
                        <span className="block text-[10px] text-[#C87A4B]">{bottle.pour}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, notes: `Reserve bottle: ${bottle.name}` }));
                          scrollTo('reserve');
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#C87A4B]/45 text-[9.5px] uppercase tracking-[0.18em] text-[#C87A4B] hover:bg-[#C87A4B] hover:text-[#0A0807] transition-colors cursor-pointer"
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
      <section id="reserve" className="py-28 px-6 bg-[#0A0807] border-t border-[#C87A4B]/15">
        <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-[#14100E] border border-[#C87A4B]/25 p-8 sm:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <span className="nikkei-kicker text-[10px] text-[#C87A4B] block mb-2">Miami &amp; Tulum Concierge</span>
            <h2 className="nikkei-display text-3xl sm:text-5xl text-[#F3ECE1]">Reserve Your Evening</h2>
          </div>

          {submitted ? (
            <div className="p-10 rounded-3xl bg-[#0A0807] border border-[#C87A4B]/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#C87A4B] text-[#0A0807] flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h3 className="nikkei-display text-2xl text-[#F3ECE1]">Bienvenidos, {booking.name}</h3>
              <p className="text-sm text-[#C4B9AA] font-light">
                Your table for <strong>{booking.guests}</strong> in {booking.area} on {booking.date} is requested.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="px-7 py-2.5 rounded-full border border-[#C87A4B]/45 text-[10px] uppercase tracking-[0.2em] cursor-pointer">
                Modify
              </button>
            </div>
          ) : (
            <form onSubmit={submitReservation} className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="border-b border-[#C87A4B]/25 focus-within:border-[#C87A4B] pb-2">
                <label className="nikkei-kicker block text-[9px] text-[#C87A4B] mb-1.5">Guest Name *</label>
                <input type="text" required placeholder="Full Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#C87A4B]/25 focus-within:border-[#C87A4B] pb-2">
                <label className="nikkei-kicker block text-[9px] text-[#C87A4B] mb-1.5">Phone or Email *</label>
                <input type="text" required placeholder="+1 (305) 555-0198" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="border-b border-[#C87A4B]/25 focus-within:border-[#C87A4B] pb-2">
                <label className="nikkei-kicker block text-[9px] text-[#C87A4B] mb-1.5">Date *</label>
                <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="w-full text-sm font-light cursor-pointer" />
              </div>
              <div className="border-b border-[#C87A4B]/25 focus-within:border-[#C87A4B] pb-2">
                <label className="nikkei-kicker block text-[9px] text-[#C87A4B] mb-1.5">Seating</label>
                <select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} className="w-full text-sm font-light cursor-pointer">
                  <option>18:30 — Sunset Mezcal</option>
                  <option>20:30 — Prime Courtyard</option>
                  <option>22:00 — Midnight Lounge</option>
                </select>
              </div>
              <div className="sm:col-span-2 border-b border-[#C87A4B]/25 focus-within:border-[#C87A4B] pb-2">
                <label className="nikkei-kicker block text-[9px] text-[#C87A4B] mb-1.5">Notes &amp; Agave Requests</label>
                <input type="text" placeholder="Allergies, VIP cabana, mezcal flight..." value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full text-sm font-light" />
              </div>
              <div className="sm:col-span-2 pt-4 text-center">
                <button type="submit" disabled={isSubmitting} className="px-14 py-4 rounded-full bg-[#C87A4B] text-[#0A0807] text-[10.5px] font-semibold uppercase tracking-[0.26em] hover:bg-[#DC9264] transition-colors shadow-lg cursor-pointer">
                  {isSubmitting ? 'Confirming...' : 'Confirm Courtyard Table'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* VISIBLE COMMERCIAL PRICING + ORDER BUMP + FREE SAMPLE CLOUD */}
      <section id="licensing" className="py-24 px-6 bg-[#110D0B] border-t border-[#C87A4B]/15">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="nikkei-kicker inline-flex items-center gap-2 text-[10px] text-[#C87A4B] mb-2">
              <Crown size={14} /> Commercial React + 150MP Nikkei Kit (5/5 Finale)
            </span>
            <h2 className="nikkei-display text-3xl sm:text-5xl text-[#F3ECE1]">
              Acquire <span className="text-[#C87A4B]">Sol y Obsidiana</span>
            </h2>
          </div>

          <div
            onClick={() => setIncludeMotionBump(!includeMotionBump)}
            className="mb-8 rounded-3xl border border-[#C87A4B]/35 bg-[#14100E] p-5 flex items-center gap-4 cursor-pointer hover:border-[#C87A4B] transition-colors"
          >
            <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="h-5 w-5 cursor-pointer accent-[#C87A4B]" />
            <div className="flex-1">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F3ECE1]">
                Add 30s 4K Nikkei &amp; Mezcal Motion Pack for the 16:9 Cinema Slot (+$199)
              </span>
              <span className="block text-xs text-[#B3A798] mt-0.5">
                Seamless 60fps UHD video loops ready to drop into Reel 01 &amp; Reel 02.
              </span>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-[#14100E] border border-[#C87A4B]/25 flex flex-col justify-between shadow-xl">
              <div>
                <span className="nikkei-kicker text-[10px] text-[#C87A4B]">Agency License</span>
                <p className="nikkei-display text-5xl text-[#F3ECE1] mt-2">${agencyPriceNum}</p>
                <p className="text-xs text-[#B3A798] mt-3 leading-relaxed">
                  Complete Sol y Obsidiana Nikkei React JSX + 16:9 Cinema Slot + Tiradito &amp; Mezcal Vault Galleries + Commercial Rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="mt-8 w-full py-4 rounded-full bg-[#C87A4B] text-[#0A0807] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#DC9264] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <DownloadCloud size={15} /> License Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#F3ECE1] text-[#0A0807] flex flex-col justify-between shadow-xl">
              <div>
                <span className="nikkei-kicker text-[10px] text-[#2E5B4F]">1-of-1 Exclusive Buyout</span>
                <p className="nikkei-display text-5xl mt-2">${buyoutPriceNum}</p>
                <p className="text-xs text-[#4A413B] mt-3 leading-relaxed">
                  Permanent store removal + 100% IP transfer + 10 custom 150MP Ultra Print Miami/Tulum renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="mt-8 w-full py-4 rounded-full bg-[#0A0807] text-[#F3ECE1] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#2E5B4F] transition-colors cursor-pointer flex items-center justify-center gap-2"
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
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#14100E] border border-[#C87A4B]/45 text-[#F3ECE1] hover:bg-[#C87A4B] hover:text-[#0A0807] transition-all shadow-lg text-xs font-medium uppercase tracking-[0.18em]"
            >
              <DownloadCloud size={18} className="text-[#C87A4B]" />
              <span>Download Free 4K Preview Sample</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#070504] border-t border-[#C87A4B]/15 pt-14 pb-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="nikkei-display text-xl text-[#F3ECE1]">
              SOL <span className="text-[#C87A4B]">Y</span> OBSIDIANA
            </span>
            <p className="text-xs text-[#9A8F82] mt-1">140 NE 39th Street, Miami Design District, FL 33137</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#C4B9AA]">
            <span className="flex items-center gap-2"><Phone size={13} className="text-[#C87A4B]" /> +1 (305) 555-0198</span>
            <span className="flex items-center gap-2"><MapPin size={13} className="text-[#C87A4B]" /> Miami • Tulum</span>
          </div>
        </div>
      </footer>

      {/* FLOATING FREE SAMPLE CLOUD BUBBLE ("Oblačić") */}
      <a
        href={KIT_CONFIG.freeSampleLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Download Free 4K Sample"
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#14100E]/95 border border-[#C87A4B]/45 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F3ECE1] shadow-2xl backdrop-blur-md hover:bg-[#C87A4B] hover:text-[#0A0807] transition-all"
      >
        <DownloadCloud size={16} className="text-[#C87A4B]" />
        <span className="hidden sm:inline">Free Sample</span>
      </a>

      {/* DISH MODAL */}
      {selectedDish &&
        createPortal(
          <div onClick={() => setSelectedDish(null)} className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#14100E] border border-[#C87A4B]/35 text-[#F3ECE1] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="relative h-64">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#0A0807]/85 text-[#C87A4B] flex items-center justify-center cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="p-7 space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#C87A4B]">
                  <span>{selectedDish.category} · {selectedDish.tag}</span>
                  <span className="text-base font-semibold text-[#F3ECE1]">{selectedDish.price}</span>
                </div>
                <h3 className="text-2xl text-[#F3ECE1]" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  {selectedDish.name}
                </h3>
                <p className="text-sm text-[#C4B9AA] font-light leading-relaxed">{selectedDish.description}</p>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDish.name;
                      setSelectedDish(null);
                      setBooking((prev) => ({ ...prev, notes: `Pre-requested dish: ${name}` }));
                      scrollTo('reserve');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#C87A4B] text-[#0A0807] text-[10px] font-semibold uppercase tracking-[0.2em] cursor-pointer"
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
          className="group flex items-center gap-3 rounded-full bg-[#14100E]/95 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#F3ECE1] shadow-2xl border border-[#C87A4B]/35 backdrop-blur-md transition hover:border-[#C87A4B] cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C87A4B] text-[#0A0807]">
            <ArrowLeft size={13} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#C87A4B] px-5 py-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#0A0807] shadow-2xl transition hover:bg-[#DC9264] cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A0807] text-[#C87A4B]">
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
}