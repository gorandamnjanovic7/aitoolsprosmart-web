// ============================================================================
// src/pages/kits/restaurants/VillaSolisAmalfi.jsx
// VILLA SOLIS — Amalfi Coast Cliffside Fine Dining • Two Michelin Stars
// Sunlit Travertine, Terracotta & Olive • 16:9 Video + Visible Pricing + Free Sample Cloud
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Phone, Wine, Check, X, ArrowUpRight, ArrowLeft, ArrowRight,
  Crown, DownloadCloud, Lock, Sun, Eye, Play, Pause, Volume2, VolumeX,
  Link2, Video, Film
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
const VIDEO_REEL_1_URL = ''; // e.g. '/restaurants/villasolis-amalfi-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/restaurants/villasolis-terrace-02.mp4'

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-villasolis-amalfi-349-link',
  buyoutZipLink: 'https://drive.google.com/your-villasolis-amalfi-1490-link',
  freeSampleLink: 'https://drive.google.com/your-villasolis-amalfi-sample-link',
  prevPageRoute: '/ignis-gold-restaurant',
  prevPageLabel: "Prev: L'Atelier Ignis (1/3)",
  nextLandingRoute: '/kurokawa-kaiseki',
  nextLandingLabel: 'Next: Kurokawa Tokyo (3/3)'
};

const AMALFI_REELS = [
  {
    id: 'a-reel-1',
    chapter: 'Reel 01 • Cliffside Sunset (16:9 UHD)',
    title: 'Golden Hour Above the Tyrrhenian Sea',
    desc: 'Widescreen 16:9 gastronomy film showcasing sunlit limestone terraces, chilled Franciacorta pours, and day-boat crudo.',
    poster: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1920&q=90'
  },
  {
    id: 'a-reel-2',
    chapter: 'Reel 02 • Lemon Grove & Cantina (16:9 UHD)',
    title: 'Hand-Cut Tagliolini & 1968 Italian Cellar',
    desc: 'Secondary 16:9 motion slot ready for Seedance 2.5 or Kling 4.0 Mediterranean coastal loops.',
    poster: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=90'
  }
];

const VILLA_SPACES = [
  {
    id: 'vs-1',
    tag: 'Main Cliffside Terrace • 24 Seats',
    title: 'La Terrazza del Sole',
    specs: 'Hand-carved travertine, lemon pergola, unobstructed Tyrrhenian horizon',
    url: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'vs-2',
    tag: 'Aperitivo Deck',
    title: 'The Belvedere Spritz Bar',
    specs: 'Limestone counter, sunset sea breeze, vintage Amalfi ceramics',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'vs-3',
    tag: 'Private Dining • 10 Guests',
    title: 'Il Giardino dei Limoni',
    specs: 'Beneath century-old Sfusato lemon trees with candlelit linen tables',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1500&q=85'
  },
  {
    id: 'vs-4',
    tag: 'Indoor Conservatory',
    title: 'Salone Bianco',
    specs: 'Arched coastal windows, Venetian plaster, hand-woven silk drapery',
    url: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1500&q=85'
  }
];

const COASTAL_FILTERS = ['All', 'Crudo & Sea', 'Artisan Pasta', 'Amalfi Cocktails', 'Dolci'];

const COASTAL_MENU = [
  {
    id: 1,
    name: 'Red Mazara Prawns & Amalfi Lemon',
    category: 'Crudo & Sea',
    price: '€48',
    tag: 'Raw Bar',
    prep: 'Cold-Pressed Olive Oil',
    description: 'Sweet Sicilian Gambero Rosso crudo dressed in Sfusato lemon zest, sea salt flakes, and wild fennel pollen.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 2,
    name: 'Charred Mediterranean Sea Bass',
    category: 'Crudo & Sea',
    price: '€64',
    tag: 'Day Boat Catch',
    prep: 'Olive Wood Grilled',
    description: 'Line-caught Branzino roasted with Pantelleria capers, heirloom Datterini tomatoes, and basil emulsion.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 3,
    name: 'Bluefin Tuna Tartare & Pistachio',
    category: 'Crudo & Sea',
    price: '€44',
    tag: 'Signature',
    prep: 'Bronte Pistachio',
    description: 'Hand-cut Mediterranean Bluefin belly with toasted Sicilian pistachio cream, blood orange, and crisp focaccia.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 4,
    name: 'Tagliolini al Tartufo Bianco',
    category: 'Artisan Pasta',
    price: '€78',
    tag: 'House Icon',
    prep: '40-Yolk Hand-Cut',
    description: 'Silky hand-rolled egg tagliolini tossed in aged Parmigiano butter and shaved white Alba truffle.',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 5,
    name: 'Lobster & Saffron Paccheri',
    category: 'Artisan Pasta',
    price: '€68',
    tag: 'Coastal Classic',
    prep: 'Gragnano Bronze-Die',
    description: 'Artisanal Paccheri glazed in sweet Tyrrhenian lobster bisque, cherry tomatoes, and fresh marjoram.',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 6,
    name: 'Burrata & Lemon Ravioli',
    category: 'Artisan Pasta',
    price: '€46',
    tag: 'Chef’s Favorite',
    prep: 'Pugliese Burrata',
    description: 'Delicate pasta parcels filled with creamy burrata, brown sage butter, and candied Amalfi lemon peel.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 7,
    name: 'Amalfi Bergamot Spritz',
    category: 'Amalfi Cocktails',
    price: '€26',
    tag: 'Sunset Ritual',
    prep: 'Franciacorta Brut',
    description: 'Calabrian bergamot liqueur, artisanal bitter aperitivo, vintage Franciacorta, and fresh rosemary.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 8,
    name: 'Capri Limoncello Bellini',
    category: 'Amalfi Cocktails',
    price: '€28',
    tag: 'House Infusion',
    prep: 'White Peach Purée',
    description: 'Estate-made organic limoncello, crushed Vesuvio white peach, and chilled Prosecco Superiore.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 9,
    name: 'Mediterranean Olive Martini',
    category: 'Amalfi Cocktails',
    price: '€29',
    tag: 'Botanical',
    prep: 'Coastal Gin',
    description: 'Small-batch Italian gin distilled with wild thyme and lemon leaf, dry vermouth, and Castelvetrano olive.',
    image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 10,
    name: 'Delizia al Limone di Amalfi',
    category: 'Dolci',
    price: '€24',
    tag: 'Amalfi Icon',
    prep: 'Sfusato Lemon Cream',
    description: 'Airy sponge dome filled with silky lemon custard, glazed in limoncello cream and white chocolate.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 11,
    name: 'Pistachio & Fig Millefoglie',
    category: 'Dolci',
    price: '€26',
    tag: 'Pasticceria',
    prep: 'Caramelized Pastry',
    description: 'Crisp layered pastry with roasted Bronte pistachio cream, warm honeyed figs, and vanilla bean gelato.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 12,
    name: 'Classic Espresso Tiramisù',
    category: 'Dolci',
    price: '€22',
    tag: 'Tableside',
    prep: 'Aged Marsala',
    description: 'Whipped mascarpone sabayon, savoiardi soaked in Naples espresso, and bitter Valrhona cocoa.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=85'
  }
];

const ITALIAN_WINES = [
  {
    id: 'iw-1',
    region: 'Tuscany',
    vintage: '2016',
    name: 'Tenuta San Guido Sassicaia',
    price: '€640',
    glass: '€115 (Coravin)',
    notes: 'Wild blackberry, Mediterranean herbs, cedar, and sun-drenched Tuscan elegance.',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'iw-2',
    region: 'Piedmont',
    vintage: '2017',
    name: 'Gaja Barbaresco DOCG',
    price: '€580',
    glass: '€98 (Coravin)',
    notes: 'Dried rose petals, crushed cherry, truffle earthiness, and fine sculpted tannins.',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'iw-3',
    region: 'Lombardy',
    vintage: '2014',
    name: 'Ca’ del Bosco Cuvée Annamaria',
    price: '€340',
    glass: '€58',
    notes: 'Golden apple, toasted brioche, candied citrus, and ultra-fine Franciacorta perlage.',
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'iw-4',
    region: 'Campania',
    vintage: '2021',
    name: 'Marisa Cuomo Fiorduva',
    price: '€260',
    glass: '€46',
    notes: 'Grown on Amalfi cliffside terraces. Apricot, broom flower, and electric sea-salt minerality.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=85'
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
      transition={{ duration: 7 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
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

export default function VillaSolisAmalfi() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [coastalFilter, setCoastalFilter] = useState('All');
  const [selectedDish, setSelectedDish] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  // 16:9 Video Placeholder State
  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Order Bump (+$199 Motion Pack) & Checkout
  const [includeMotionBump, setIncludeMotionBump] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  // Reservation
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '2026-07-18',
    time: '19:30 — Sunset Seating',
    guests: '2 Guests',
    table: 'La Terrazza del Sole (Cliffside)',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (user?.displayName) setBooking((prev) => ({ ...prev, name: prev.name || user.displayName }));
    });
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'VillaSolisAmalfi' });
    return () => {
      window.removeEventListener('scroll', onScroll);
      unsub();
    };
  }, []);

  useEffect(() => {
    setVideoError(false);
  }, [activeReelIdx, customVideoUrl]);

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
        ime: user.displayName || 'B2B Hospitality Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'villasolis_buyout_1490' : 'villasolis_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Amalfi Coastal Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Villa Solis Amalfi Luxury Restaurant Kit${suffix}`
      : `Agency License: Villa Solis Amalfi Antigravity React + 150MP Kit${suffix}`;
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
          category: 'Villa Solis Amalfi — Cliffside Table Reservation',
          item: `${booking.guests} • ${booking.table}`,
          date: `${booking.date} (${booking.time})`,
          message: `Amalfi reservation for ${booking.guests} at ${booking.table}. Notes: ${booking.notes || 'Sunset seating'}`
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
    coastalFilter === 'All'
      ? COASTAL_MENU
      : COASTAL_MENU.filter((i) => i.category === coastalFilter);

  const activeReel = AMALFI_REELS[activeReelIdx] || AMALFI_REELS[0];

  return (
    <div className="solis-root relative z-20 min-h-screen w-full bg-[#FAF7F2] text-[#231F1B] overflow-x-hidden selection:bg-[#B55D3D] selection:text-[#FAF7F2]">
      <Helmet>
        <title>Villa Solis — Amalfi Coast Cliffside Dining | Two Michelin Stars</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');

        .solis-root {
          background-color: #FAF7F2 !important;
          color: #231F1B !important;
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .solis-serif {
          font-family: 'Cormorant Garamond', Georgia, serif !important;
          letter-spacing: -0.01em;
        }
        .solis-script {
          font-family: 'Alex Brush', cursive !important;
          font-weight: 400 !important;
        }
        .solis-kicker {
          font-family: 'DM Sans', sans-serif !important;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .solis-root input:not([type="checkbox"]),
        .solis-root select,
        .solis-root textarea {
          background-color: transparent !important;
          color: #231F1B !important;
          color-scheme: light !important;
          box-shadow: none !important;
          font-family: 'DM Sans', sans-serif !important;
        }
        .solis-root input::placeholder {
          color: rgba(35, 31, 27, 0.42) !important;
        }
        .solis-root input:focus,
        .solis-root select:focus {
          outline: none !important;
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 sm:px-12 ${
          scrolled
            ? 'bg-[#FAF7F2]/92 backdrop-blur-xl border-b border-[#231F1B]/10 py-3.5 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollTo('hero')} className="text-left cursor-pointer">
            <span className="solis-script block text-4xl text-[#231F1B] leading-none">
              Villa <span className="text-[#B55D3D]">Solis</span>
            </span>
            <span className="solis-kicker block text-[8.5px] text-[#5A6B5C] mt-1">
              Ravello • Amalfi Coast
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-medium tracking-[0.2em] uppercase text-[#4B443C]">
            <button type="button" onClick={() => scrollTo('amalfi-cinema')} className="hover:text-[#B55D3D] transition-colors cursor-pointer">16:9 Film</button>
            <button type="button" onClick={() => scrollTo('coastal-menu')} className="hover:text-[#B55D3D] transition-colors cursor-pointer">Cuisine &amp; Dolci</button>
            <button type="button" onClick={() => scrollTo('cantina')} className="hover:text-[#B55D3D] transition-colors cursor-pointer">Cantina</button>
            <button type="button" onClick={() => scrollTo('terraces')} className="hover:text-[#B55D3D] transition-colors cursor-pointer">Terraces</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="text-[#B55D3D] font-semibold hover:text-[#231F1B] transition-colors cursor-pointer">License Kit</button>
          </nav>

          <button
            type="button"
            onClick={() => scrollTo('reserve')}
            className="px-7 py-2.5 rounded-full bg-[#B55D3D] text-[#FAF7F2] text-[10.5px] font-medium tracking-[0.2em] uppercase hover:bg-[#9E4C2F] transition-colors shadow-md cursor-pointer"
          >
            Book Terrace
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 px-6 bg-[#FAF7F2] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-[#E8C5A5]/35 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-24 w-[420px] h-[420px] rounded-full bg-[#D2DDD0]/45 blur-3xl" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-14 items-center relative z-10">
          <div className="lg:col-span-6 space-y-7">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFE7DB] border border-[#B55D3D]/25 text-[#B55D3D]">
              <Sun size={13} />
              <span className="solis-kicker text-[9.5px]">Two Michelin Stars • Amalfi Coast</span>
            </div>

            <h1 className="solis-serif text-5xl sm:text-7xl lg:text-[5.2rem] font-normal leading-[1.02] text-[#231F1B]">
              Sunlit Limestone,
              <span className="solis-script block text-6xl sm:text-8xl text-[#B55D3D] mt-2 leading-[0.9]">
                Sea &amp; Lemon Groves
              </span>
            </h1>

            <p className="text-sm sm:text-base text-[#5C544B] font-light leading-relaxed max-w-lg">
              Perched three hundred meters above the Tyrrhenian Sea, Villa Solis celebrates coastal
              Italian gastronomy: day-boat crudo, hand-cut Gragnano pasta, chilled Franciacorta, and
              unhurried golden-hour dining.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('reserve')}
                className="px-8 py-4 rounded-full bg-[#231F1B] text-[#FAF7F2] text-[11px] font-medium tracking-[0.22em] uppercase hover:bg-[#B55D3D] transition-colors shadow-lg cursor-pointer inline-flex items-center gap-2"
              >
                <span>Reserve Sunset Table</span>
                <ArrowUpRight size={15} />
              </button>
              <button
                type="button"
                onClick={() => scrollTo('amalfi-cinema')}
                className="px-8 py-4 rounded-full border border-[#231F1B]/25 text-[#231F1B] text-[11px] font-medium tracking-[0.22em] uppercase hover:border-[#B55D3D] hover:text-[#B55D3D] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Play size={13} className="fill-current" /> Watch 16:9 Film
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative flex justify-center">
            <AntigravityFloat floatDelay={0} floatRange={10} tiltStrength={5} className="relative w-full max-w-[460px]">
              <div className="overflow-hidden rounded-t-[240px] rounded-b-[32px] border-[6px] border-[#FAF7F2] shadow-[0_35px_90px_rgba(35,31,27,0.18)] bg-[#EAE2D6]">
                <img
                  src="https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=1200&q=90"
                  alt="Amalfi Coast Cliffside Dining"
                  className="w-full h-[540px] object-cover"
                />
              </div>

              <AntigravityFloat
                floatDelay={1.1}
                floatRange={7}
                invertFloat
                className="hidden sm:flex items-center gap-3.5 absolute -bottom-6 -left-10 bg-[#FAF7F2]/95 backdrop-blur-xl border border-[#231F1B]/10 rounded-full p-2.5 pr-6 shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=300&q=85"
                  alt="Artisan Pasta"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <span className="solis-kicker block text-[8.5px] text-[#B55D3D]">Today’s Catch</span>
                  <span className="solis-serif text-lg text-[#231F1B]">Tagliolini &amp; Red Prawns</span>
                </div>
              </AntigravityFloat>
            </AntigravityFloat>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 16:9 WIDESCREEN VIDEO PLACEHOLDER (ANTIGRAVITY 3D)                  */}
      {/* =================================================================== */}
      <section id="amalfi-cinema" className="py-24 px-6 bg-[#F2ECE1] border-t border-[#231F1B]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="solis-kicker inline-flex items-center gap-2 text-[10px] text-[#B55D3D] mb-2">
                <Video size={14} /> {activeReel.chapter}
              </span>
              <h2 className="solis-serif text-4xl sm:text-5xl text-[#231F1B]">
                {activeReel.title}
              </h2>
              <p className="text-sm text-[#6B6258] font-light mt-2 max-w-xl">{activeReel.desc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {AMALFI_REELS.map((reel, idx) => (
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
                      ? 'bg-[#B55D3D] border-[#B55D3D] text-[#FAF7F2]'
                      : 'bg-[#FAF7F2] border-[#231F1B]/15 text-[#231F1B] hover:border-[#B55D3D]'
                  }`}
                >
                  Reel 0{idx + 1} (16:9)
                </button>
              ))}
            </div>
          </div>

          <AntigravityFloat
            floatDelay={0.2}
            floatRange={6}
            tiltStrength={3.5}
            className="relative w-full aspect-video overflow-hidden rounded-[2rem] bg-[#231F1B] border-[4px] border-[#FAF7F2] shadow-[0_35px_90px_rgba(35,31,27,0.2)]"
          >
            {hasLiveVideoFile ? (
              <video
                ref={cinemaVideoRef}
                key={effectiveVideoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                poster={activeReel.poster}
                onError={() => setVideoError(true)}
                className="h-full w-full object-cover"
              >
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
                  className="h-full w-full object-cover opacity-85"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                  <div className="rounded-3xl bg-[#FAF7F2]/85 backdrop-blur-xl border border-[#231F1B]/15 px-7 py-5 text-center shadow-2xl max-w-md">
                    <span className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#B55D3D] text-[#FAF7F2]">
                      <Film size={18} />
                    </span>
                    <span className="solis-serif block text-2xl text-[#231F1B]">16:9 Amalfi Cinema Slot</span>
                    <span className="block text-[11px] text-[#5C544B] mt-1">
                      3840 × 2160 UHD Ready • Paste any .mp4 / .webm URL below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#231F1B]/80 via-transparent to-transparent" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button type="button" onClick={togglePlay} className="w-11 h-11 rounded-full bg-[#FAF7F2]/90 text-[#231F1B] hover:bg-[#B55D3D] hover:text-[#FAF7F2] flex items-center justify-center transition cursor-pointer shadow">
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button type="button" onClick={toggleMute} className="w-11 h-11 rounded-full bg-[#FAF7F2]/90 text-[#231F1B] hover:bg-[#B55D3D] hover:text-[#FAF7F2] flex items-center justify-center transition cursor-pointer shadow">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-[#FAF7F2]/95 px-4 py-2 shadow-lg">
                <Link2 size={14} className="text-[#B55D3D] shrink-0" />
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="Paste .mp4 or .webm URL to preview in 16:9..."
                  className="w-full text-xs"
                />
                {customVideoUrl && (
                  <button type="button" onClick={() => setCustomVideoUrl('')} className="text-[10px] font-semibold uppercase text-[#B55D3D] cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* COASTAL MENU */}
      <section id="coastal-menu" className="py-28 px-6 bg-[#FAF7F2] border-t border-[#231F1B]/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="solis-kicker text-[10px] text-[#B55D3D] block mb-2">La Cucina &amp; Bar</span>
              <h2 className="solis-serif text-4xl sm:text-6xl text-[#231F1B] leading-none">
                Coastal Cuisine, <span className="solis-script text-5xl sm:text-7xl text-[#B55D3D]">Cocktails &amp; Dolci</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {COASTAL_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCoastalFilter(cat)}
                  className={`px-5 py-2.5 rounded-full text-[10.5px] tracking-[0.16em] uppercase transition-all cursor-pointer border ${
                    coastalFilter === cat
                      ? 'bg-[#231F1B] border-[#231F1B] text-[#FAF7F2]'
                      : 'bg-[#F2ECE1] border-[#231F1B]/15 text-[#4B443C] hover:border-[#B55D3D]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenu.map((item, idx) => (
              <AntigravityFloat key={item.id} floatDelay={(idx % 3) * 0.45} floatRange={6} tiltStrength={4} invertFloat={idx % 2 === 1}>
                <article
                  onClick={() => setSelectedDish(item)}
                  className="group cursor-pointer rounded-[2rem] overflow-hidden bg-[#F2ECE1] border border-[#231F1B]/10 hover:border-[#B55D3D]/50 transition-all shadow-[0_20px_50px_rgba(35,31,27,0.07)] flex flex-col h-full"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#FAF7F2]/90 backdrop-blur-md text-[9.5px] uppercase tracking-[0.18em] text-[#B55D3D] font-medium">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 px-4 py-1 rounded-full bg-[#231F1B] text-[#FAF7F2] text-xs font-medium">
                      {item.price}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="solis-kicker text-[9px] text-[#5A6B5C] block">{item.category} · {item.prep}</span>
                      <h3 className="solis-serif text-2xl sm:text-[1.7rem] text-[#231F1B] group-hover:text-[#B55D3D] transition-colors mt-1.5 leading-snug">
                        {item.name}
                      </h3>
                      <p className="text-xs text-[#6B6258] font-light leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#231F1B]/10 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#B55D3D] font-medium">
                      <span>View Tasting Notes</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* LA CANTINA */}
      <section id="cantina" className="py-28 px-6 bg-[#F2ECE1] border-t border-[#231F1B]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="solis-kicker inline-flex items-center gap-2 text-[10px] text-[#5A6B5C] mb-3">
              <Wine size={14} /> La Cantina Italiana
            </span>
            <h2 className="solis-serif text-4xl sm:text-6xl text-[#231F1B]">
              Sun-Kissed <span className="solis-script text-5xl sm:text-7xl text-[#B55D3D]">Vintages</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {ITALIAN_WINES.map((wine, idx) => (
              <AntigravityFloat key={wine.id} floatDelay={idx * 0.35} floatRange={6} tiltStrength={4} invertFloat={idx % 2 === 0}>
                <article className="group rounded-[2rem] overflow-hidden bg-[#FAF7F2] border border-[#231F1B]/10 hover:border-[#B55D3D]/50 transition-all shadow-md flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={wine.image} alt={wine.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#FAF7F2]/90 text-[9.5px] uppercase tracking-[0.18em] text-[#231F1B] font-medium">
                      {wine.region} · {wine.vintage}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="solis-serif text-2xl text-[#231F1B] leading-snug">{wine.name}</h3>
                      <p className="text-xs text-[#6B6258] font-light mt-2 leading-relaxed">{wine.notes}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#231F1B]/10 flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-semibold text-[#231F1B]">{wine.price}</span>
                        <span className="block text-[10px] text-[#B55D3D]">{wine.glass}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, notes: `Reserve bottle: ${wine.name} (${wine.vintage})` }));
                          scrollTo('reserve');
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#231F1B]/25 text-[9.5px] uppercase tracking-[0.18em] text-[#231F1B] hover:bg-[#B55D3D] hover:border-[#B55D3D] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* TERRACES */}
      <section id="terraces" className="py-28 px-6 bg-[#FAF7F2] border-t border-[#231F1B]/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="solis-kicker text-[10px] text-[#B55D3D] block mb-2">Ravello Architecture</span>
            <h2 className="solis-serif text-4xl sm:text-6xl text-[#231F1B]">
              The <span className="solis-script text-5xl sm:text-7xl text-[#B55D3D]">Terraces</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {VILLA_SPACES.map((sp, idx) => (
              <div key={sp.id} onClick={() => setLightboxIdx(idx)} className="group cursor-pointer rounded-[2rem] overflow-hidden bg-[#F2ECE1] border border-[#231F1B]/10 shadow-md">
                <div className="relative h-72 overflow-hidden">
                  <img src={sp.url} alt={sp.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF7F2]/85 flex items-center justify-center text-[#231F1B] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={15} />
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div>
                    <span className="solis-kicker text-[9px] text-[#B55D3D] block">{sp.tag}</span>
                    <h3 className="solis-serif text-2xl sm:text-3xl text-[#231F1B] mt-1">{sp.title}</h3>
                    <p className="text-xs text-[#6B6258] font-light mt-1">{sp.specs}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBooking((prev) => ({ ...prev, table: sp.title }));
                      scrollTo('reserve');
                    }}
                    className="shrink-0 px-5 py-2 rounded-full bg-[#231F1B] text-[#FAF7F2] text-[10px] uppercase tracking-[0.18em] hover:bg-[#B55D3D] transition-colors cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reserve" className="py-28 px-6 bg-[#F2ECE1] border-t border-[#231F1B]/10">
        <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-[#FAF7F2] border border-[#231F1B]/10 p-8 sm:p-14 shadow-[0_30px_80px_rgba(35,31,27,0.08)]">
          <div className="text-center mb-12">
            <span className="solis-kicker text-[10px] text-[#B55D3D] block mb-2">Concierge Desk</span>
            <h2 className="solis-serif text-4xl sm:text-6xl text-[#231F1B]">
              Reserve Your <span className="solis-script text-5xl sm:text-7xl text-[#B55D3D]">Sunset</span>
            </h2>
          </div>

          {submitted ? (
            <div className="p-10 rounded-3xl bg-[#F2ECE1] border border-[#B55D3D]/35 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#B55D3D] text-[#FAF7F2] flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h3 className="solis-serif text-3xl text-[#231F1B]">Benvenuti, {booking.name}</h3>
              <p className="text-sm text-[#5C544B] font-light">
                Your cliffside table for <strong>{booking.guests}</strong> at{' '}
                <strong className="text-[#B55D3D]">{booking.table}</strong> on {booking.date} is requested.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="px-7 py-2.5 rounded-full border border-[#231F1B]/25 text-[10px] uppercase tracking-[0.2em] cursor-pointer">
                Modify
              </button>
            </div>
          ) : (
            <form onSubmit={submitReservation} className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="border-b border-[#231F1B]/20 focus-within:border-[#B55D3D] pb-2">
                <label className="solis-kicker block text-[9px] text-[#5A6B5C] mb-1.5">Full Name *</label>
                <input type="text" required placeholder="Guest Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full text-sm" />
              </div>

              <div className="border-b border-[#231F1B]/20 focus-within:border-[#B55D3D] pb-2">
                <label className="solis-kicker block text-[9px] text-[#5A6B5C] mb-1.5">Phone or Email *</label>
                <input type="text" required placeholder="+39 089 857 120" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full text-sm" />
              </div>

              <div className="border-b border-[#231F1B]/20 focus-within:border-[#B55D3D] pb-2">
                <label className="solis-kicker block text-[9px] text-[#5A6B5C] mb-1.5">Date *</label>
                <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="w-full text-sm cursor-pointer" />
              </div>

              <div className="border-b border-[#231F1B]/20 focus-within:border-[#B55D3D] pb-2">
                <label className="solis-kicker block text-[9px] text-[#5A6B5C] mb-1.5">Seating</label>
                <select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} className="w-full text-sm cursor-pointer">
                  <option>13:00 — Coastal Lunch</option>
                  <option>19:30 — Sunset Seating</option>
                  <option>21:00 — Starlight Dinner</option>
                </select>
              </div>

              <div className="sm:col-span-2 border-b border-[#231F1B]/20 focus-within:border-[#B55D3D] pb-2">
                <label className="solis-kicker block text-[9px] text-[#5A6B5C] mb-1.5">Notes &amp; Wine Requests</label>
                <input type="text" placeholder="Anniversary, allergies, vintage bottle..." value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full text-sm" />
              </div>

              <div className="sm:col-span-2 pt-4 text-center">
                <button type="submit" disabled={isSubmitting} className="px-14 py-4 rounded-full bg-[#B55D3D] text-[#FAF7F2] text-[11px] font-medium uppercase tracking-[0.24em] hover:bg-[#231F1B] transition-colors shadow-lg cursor-pointer">
                  {isSubmitting ? 'Confirming...' : 'Confirm Terrace Table'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* VISIBLE COMMERCIAL PRICING + ORDER BUMP + FREE SAMPLE CLOUD         */}
      {/* =================================================================== */}
      <section id="licensing" className="py-24 px-6 bg-[#FAF7F2] border-t border-[#231F1B]/10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="solis-kicker inline-flex items-center gap-2 text-[10px] text-[#B55D3D] mb-2">
              <Crown size={14} /> Commercial React + 150MP Hospitality Kit
            </span>
            <h2 className="solis-serif text-4xl sm:text-5xl text-[#231F1B]">
              Acquire <span className="solis-script text-5xl sm:text-6xl text-[#B55D3D]">Villa Solis</span>
            </h2>
          </div>

          <div
            onClick={() => setIncludeMotionBump(!includeMotionBump)}
            className="mb-8 rounded-3xl border border-[#B55D3D]/35 bg-[#F2ECE1] p-5 flex items-center gap-4 cursor-pointer hover:border-[#B55D3D] transition-colors"
          >
            <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="h-5 w-5 cursor-pointer accent-[#B55D3D]" />
            <div className="flex-1">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#231F1B]">
                Add 30s 4K Amalfi Coastal Motion Pack for the 16:9 Video Slot (+$199)
              </span>
              <span className="block text-xs text-[#6B6258] mt-0.5">
                Seamless 60fps UHD video loops ready to drop into Reel 01 &amp; Reel 02.
              </span>
            </div>
          </div>

          <div className="grid gap-7 md:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-[#F2ECE1] border border-[#231F1B]/10 flex flex-col justify-between shadow-md">
              <div>
                <span className="solis-kicker text-[10px] text-[#B55D3D]">Agency License</span>
                <p className="solis-serif text-5xl text-[#231F1B] mt-2">${agencyPriceNum}</p>
                <p className="text-xs text-[#5C544B] mt-3 leading-relaxed">
                  Complete Villa Solis Amalfi React JSX + 16:9 Cinema Slot + Coastal &amp; Wine Galleries + Full Commercial Rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="mt-8 w-full py-4 rounded-full bg-[#B55D3D] text-[#FAF7F2] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#9E4C2F] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <DownloadCloud size={15} /> License Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#231F1B] text-[#FAF7F2] flex flex-col justify-between shadow-xl">
              <div>
                <span className="solis-kicker text-[10px] text-[#E8C5A5]">1-of-1 Exclusive Buyout</span>
                <p className="solis-serif text-5xl mt-2">${buyoutPriceNum}</p>
                <p className="text-xs text-[#CFC6B8] mt-3 leading-relaxed">
                  Permanent store removal + 100% IP transfer + 10 custom 150MP Ultra Print Amalfi renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="mt-8 w-full py-4 rounded-full bg-[#FAF7F2] text-[#231F1B] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#E8C5A5] transition-colors cursor-pointer flex items-center justify-center gap-2"
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
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#FAF7F2] border border-[#B55D3D]/45 text-[#231F1B] hover:bg-[#B55D3D] hover:text-[#FAF7F2] transition-all shadow-lg text-xs font-medium uppercase tracking-[0.18em]"
            >
              <DownloadCloud size={18} className="text-[#B55D3D]" />
              <span>Download Free 4K Preview Sample</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#EFE7DB] border-t border-[#231F1B]/10 pt-14 pb-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="solis-script text-4xl text-[#231F1B]">
              Villa <span className="text-[#B55D3D]">Solis</span>
            </span>
            <p className="text-xs text-[#6B6258] mt-1">Via San Giovanni del Toro, Ravello, Amalfi Coast, Italy</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#4B443C]">
            <span className="flex items-center gap-2"><Phone size={13} className="text-[#B55D3D]" /> +39 089 857 120</span>
            <span className="flex items-center gap-2"><MapPin size={13} className="text-[#B55D3D]" /> Amalfi Coast</span>
          </div>
        </div>
      </footer>

      {/* FLOATING FREE SAMPLE CLOUD BUBBLE ("Oblačić") */}
      <a
        href={KIT_CONFIG.freeSampleLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Download Free 4K Sample"
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#FAF7F2]/95 border border-[#B55D3D]/40 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#231F1B] shadow-2xl backdrop-blur-md hover:bg-[#B55D3D] hover:text-[#FAF7F2] transition-all"
      >
        <DownloadCloud size={16} className="text-[#B55D3D]" />
        <span className="hidden sm:inline">Free Sample</span>
      </a>

      {/* DISH MODAL */}
      {selectedDish &&
        createPortal(
          <div onClick={() => setSelectedDish(null)} className="fixed inset-0 z-[999999] bg-[#231F1B]/75 backdrop-blur-md flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#FAF7F2] text-[#231F1B] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="relative h-64">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#FAF7F2] text-[#231F1B] flex items-center justify-center cursor-pointer shadow">
                  <X size={16} />
                </button>
              </div>
              <div className="p-7 space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#B55D3D]">
                  <span>{selectedDish.category} · {selectedDish.tag}</span>
                  <span className="text-base font-semibold text-[#231F1B]">{selectedDish.price}</span>
                </div>
                <h3 className="solis-serif text-3xl text-[#231F1B]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                  {selectedDish.name}
                </h3>
                <p className="text-sm text-[#5C544B] font-light leading-relaxed">{selectedDish.description}</p>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDish.name;
                      setSelectedDish(null);
                      setBooking((prev) => ({ ...prev, notes: `Pre-requested dish: ${name}` }));
                      scrollTo('reserve');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#B55D3D] text-[#FAF7F2] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
                  >
                    Request at Table
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* TERRACE LIGHTBOX */}
      {lightboxIdx !== null &&
        createPortal(
          <div onClick={() => setLightboxIdx(null)} className="fixed inset-0 z-[999999] bg-[#231F1B]/90 backdrop-blur-xl flex items-center justify-center p-4">
            <button type="button" onClick={() => setLightboxIdx(null)} className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#FAF7F2] text-[#231F1B] flex items-center justify-center cursor-pointer">
              <X size={20} />
            </button>
            <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full text-center space-y-4">
              <img src={VILLA_SPACES[lightboxIdx].url} alt={VILLA_SPACES[lightboxIdx].title} className="max-h-[75vh] mx-auto rounded-3xl object-contain" />
              <h4 className="text-3xl text-[#FAF7F2]" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {VILLA_SPACES[lightboxIdx].title}
              </h4>
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
          className="group flex items-center gap-3 rounded-full bg-[#231F1B]/95 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#FAF7F2] shadow-2xl border border-[#FAF7F2]/15 backdrop-blur-md transition hover:bg-[#B55D3D] cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF7F2] text-[#231F1B]">
            <ArrowLeft size={13} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#B55D3D] px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#FAF7F2] shadow-2xl transition hover:bg-[#231F1B] cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FAF7F2] text-[#B55D3D]">
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
}