// ============================================================================
// src/pages/kits/restaurants/KurokawaKaiseki.jsx
// KUROKAWA — Three Michelin Stars • Ginza, Tokyo Kaiseki & Omakase
// Sumi-Ink Indigo, Celadon & Vermilion • Shippori Mincho + Space Grotesk
// 16:9 Cinema Placeholder + Antigravity 3D + Visible Pricing + Free Sample Cloud
// ============================================================================
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  MapPin, Phone, Wine, Check, X, ArrowUpRight, ArrowLeft, ArrowRight,
  Crown, DownloadCloud, Lock, Play, Pause, Volume2, VolumeX, Link2,
  Video, Film
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

const VIDEO_REEL_1_URL = ''; // e.g. '/restaurants/kurokawa-omakase-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/restaurants/kurokawa-hinoki-02.mp4'

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-kurokawa-kaiseki-349-link',
  buyoutZipLink: 'https://drive.google.com/your-kurokawa-kaiseki-1490-link',
  freeSampleLink: 'https://drive.google.com/your-kurokawa-kaiseki-sample-link',
  prevPageRoute: '/villa-solis',
  prevPageLabel: 'Prev: Villa Solis Amalfi (2/4)',
  nextLandingRoute: '/maison-lumiere',
  nextLandingLabel: 'Next: Maison Lumière Paris (4/4)'
};

const CINEMA_REELS = [
  {
    id: 'k-reel-1',
    chapter: 'Film I • The Hinoki Counter (16:9 UHD)',
    title: 'Precision of the Blade & 200-Year Cypress',
    desc: 'An intimate 16:9 study of Master Kenji Kurokawa slicing Oma Bluefin Otoro over an unvarnished Kiso Hinoki counter.',
    poster: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1920&q=90'
  },
  {
    id: 'k-reel-2',
    chapter: 'Film II • Nocturnal Tea & Whisky (16:9 UHD)',
    title: 'Hand-Carved Ice, Matcha & Rare Single Malt',
    desc: 'Slow architectural tracking across our quiet stone garden, charcoal hearth, and 1980s Karuizawa whisky vault.',
    poster: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1920&q=90'
  }
];

const KAISEKI_FILTERS = ['All Courses', 'Omakase & Sushi', 'Robata & Wagyu', 'Yuzu Cocktails', 'Wagashi Desserts'];

const KAISEKI_ITEMS = [
  {
    id: 1,
    name: 'Oma Bluefin Otoro & Gold Leaf',
    category: 'Omakase & Sushi',
    price: '¥14,500',
    tag: 'Winter Catch',
    prep: '14-Day Dry Aged',
    description: 'Melt-in-the-mouth Aomori Bluefin belly brushed with 5-year aged nikiri soy, fresh Shizuoka wasabi, and Akazu red-vinegar shari.',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 2,
    name: 'Hokkaido Bafun Uni & Caviar',
    category: 'Omakase & Sushi',
    price: '¥16,000',
    tag: 'Signature',
    prep: 'Ariake Nori Crisp',
    description: 'Sweet sea urchin from Rishiri Island layered over warm Koshihikari rice, crowned with Oscietra caviar.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 3,
    name: 'Kobe A5 Chateaubriand Robata',
    category: 'Robata & Wagyu',
    price: '¥28,000',
    tag: 'Kishu Binchotan',
    prep: 'Charcoal Seared',
    description: 'Hyogo Prefecture A5 tenderloin kissed by white oak charcoal, served with black garlic ponzu and crispy lotus root.',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 4,
    name: 'Miso-Glazed Black Cod & Sansho',
    category: 'Robata & Wagyu',
    price: '¥12,800',
    tag: 'Kyoto Classic',
    prep: '72-Hour Saikyo Miso',
    description: 'Wild Alaskan black cod marinated in sweet Kyoto white miso, caramelized over embers with fragrant green sansho pepper.',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 5,
    name: 'Hinoki & Smoked Yuzu Highball',
    category: 'Yuzu Cocktails',
    price: '¥4,200',
    tag: 'Bar Craft',
    prep: 'Hand-Carved Diamond Ice',
    description: 'Aged Japanese single malt, Kochi yuzu distillation, Hinoki cypress mist, and ultra-crisp mountain soda.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 6,
    name: 'Sakura & Sencha Martini',
    category: 'Yuzu Cocktails',
    price: '¥4,600',
    tag: 'Seasonal',
    prep: 'Uji Green Tea',
    description: 'Craft Kyoto gin infused with first-harvest Uji sencha, salted cherry blossom vermouth, and chilled crystal glass.',
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 7,
    name: 'Uji Matcha & Black Sesame Mille-Crêpe',
    category: 'Wagashi Desserts',
    price: '¥3,800',
    tag: 'Ceremonial Grade',
    prep: '20 Paper-Thin Layers',
    description: 'Stone-ground Uji ceremonial matcha cream folded between delicate crêpes with roasted Kurogoma sesame tuile.',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 8,
    name: 'Yuzu, White Peach & Sake Kasu Parfait',
    category: 'Wagashi Desserts',
    price: '¥3,600',
    tag: 'Pâtisserie',
    prep: 'Junmai Daiginjo Foam',
    description: 'Chilled Yamanashi white peach compote, citrus sorbet, and airy sake-lees mousse dusted with silver leaf.',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: 9,
    name: 'Hojicha Roasted Tea Tiramisu',
    category: 'Wagashi Desserts',
    price: '¥3,400',
    tag: 'Kyoto Finale',
    prep: 'Served in Cedar Box',
    description: 'Mascarpone cream infused with slow-roasted Kyoto hojicha tea, Okinawa kokuto black sugar syrup, and cocoa.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=85'
  }
];

const SAKE_VAULT = [
  {
    id: 'sv-1',
    type: 'Junmai Daiginjo',
    origin: 'Yamagata Prefecture',
    name: 'Juyondai Ryusen',
    price: '¥185,000',
    pour: '¥24,000 (90ml)',
    notes: 'White melon, fresh pear blossom, crystalline mountain water finish.',
    image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'sv-2',
    type: 'Single Malt Whisky',
    origin: 'Kyoto Distillery',
    name: 'Yamazaki 25 Year Old',
    price: '¥420,000',
    pour: '¥48,000 (30ml)',
    notes: 'Mizunara oak incense, dried fig, dark cacao, and lingering sandalwood.',
    image: 'https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'sv-3',
    type: 'Blended Whisky',
    origin: 'Suntory Reserve',
    name: 'Hibiki 30 Year Old',
    price: '¥390,000',
    pour: '¥44,000 (30ml)',
    notes: 'Brown sugar, dried apricot, Japanese cypress, and velvet harmony.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=85'
  },
  {
    id: 'sv-4',
    type: 'Sparkling Sake',
    origin: 'Hyogo Prefecture',
    name: 'Aramasa No. 6 X-Type',
    price: '¥68,000',
    pour: '¥11,000 (90ml)',
    notes: 'Unpasteurized Nama-zake with bright acidity, white peach, and silky umami.',
    image: 'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?auto=format&fit=crop&w=900&q=85'
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

export default function KurokawaKaiseki() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const [activeReelIdx, setActiveReelIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const [courseFilter, setCourseFilter] = useState('All Courses');
  const [selectedDish, setSelectedDish] = useState(null);

  // Order Bump (+$199 Motion Pack) & Checkout
  const [includeMotionBump, setIncludeMotionBump] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    date: '2026-12-05',
    time: '18:00 — First Omakase',
    guests: '2 Seats',
    seating: 'Hinoki Counter (8 Seats)',
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
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'KurokawaKaiseki' });
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
    if (hasLiveVideoFile && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying((prev) => !prev);
    }
  };

  const toggleMute = () => {
    if (hasLiveVideoFile && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const agencyPriceNum = includeMotionBump ? 548 : 349;
  const buyoutPriceNum = includeMotionBump ? 1689 : 1490;

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Kaiseki Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'kurokawa_buyout_1490' : 'kurokawa_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Tokyo Omakase Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Kurokawa Tokyo Kaiseki Antigravity Kit${suffix}`
      : `Agency License: Kurokawa Tokyo Kaiseki Antigravity React + 150MP Kit${suffix}`;
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
          category: 'Kurokawa Ginza ★★★ — Omakase Seat Allocation',
          item: `${booking.guests} • ${booking.seating}`,
          date: `${booking.date} (${booking.time})`,
          message: `Omakase reservation for ${booking.guests} at ${booking.seating}. Notes: ${booking.notes || 'Seasonal Kaiseki'}`
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

  const filteredCourses =
    courseFilter === 'All Courses'
      ? KAISEKI_ITEMS
      : KAISEKI_ITEMS.filter((item) => item.category === courseFilter);

  const activeReel = CINEMA_REELS[activeReelIdx] || CINEMA_REELS[0];

  return (
    <div className="kurokawa-root relative z-20 min-h-screen w-full bg-[#070B10] text-[#F4F1EA] overflow-x-hidden selection:bg-[#C84B31] selection:text-[#F4F1EA]">
      <Helmet>
        <title>KUROKAWA — Three Michelin Stars | Ginza Kaiseki &amp; Omakase</title>
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap');

        .kurokawa-root {
          background-color: #070B10 !important;
          color: #F4F1EA !important;
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif !important;
          -webkit-font-smoothing: antialiased;
        }
        .kuro-mincho {
          font-family: 'Shippori Mincho', Georgia, serif !important;
          letter-spacing: 0.02em;
        }
        .kuro-kicker {
          font-family: 'Space Grotesk', sans-serif !important;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 500;
        }
        .kurokawa-root input:not([type="checkbox"]),
        .kurokawa-root select,
        .kurokawa-root textarea {
          background-color: transparent !important;
          color: #F4F1EA !important;
          color-scheme: dark !important;
          box-shadow: none !important;
          font-family: 'Space Grotesk', sans-serif !important;
        }
        .kurokawa-root input::placeholder {
          color: rgba(244, 241, 234, 0.35) !important;
        }
        .kurokawa-root input:focus,
        .kurokawa-root select:focus {
          outline: none !important;
        }
        .kurokawa-root select option {
          background-color: #0E151F !important;
          color: #F4F1EA !important;
        }
      `}</style>

      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 px-6 sm:px-12 ${
          scrolled
            ? 'bg-[#070B10]/92 backdrop-blur-xl border-b border-[#8FA89B]/20 py-4'
            : 'bg-gradient-to-b from-[#070B10]/85 to-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <button type="button" onClick={() => scrollTo('hero')} className="flex items-center gap-3.5 text-left cursor-pointer">
            <span className="w-9 h-9 rounded-full bg-[#C84B31] text-[#F4F1EA] kuro-mincho text-sm font-semibold flex items-center justify-center shadow-[0_0_20px_rgba(200,75,49,0.45)]">
              黒
            </span>
            <div>
              <span className="kuro-mincho block text-xl sm:text-2xl tracking-[0.16em] text-[#F4F1EA] leading-none">
                KUROKAWA
              </span>
              <span className="kuro-kicker block text-[8px] text-[#8FA89B] mt-1">
                Ginza • Tokyo • ★★★
              </span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[10.5px] font-medium tracking-[0.24em] uppercase text-[#C9D2CD]">
            <button type="button" onClick={() => scrollTo('cinema')} className="hover:text-[#C84B31] transition-colors cursor-pointer">16:9 Film</button>
            <button type="button" onClick={() => scrollTo('kaiseki')} className="hover:text-[#C84B31] transition-colors cursor-pointer">Kaiseki &amp; Omakase</button>
            <button type="button" onClick={() => scrollTo('sake-vault')} className="hover:text-[#C84B31] transition-colors cursor-pointer">Sake &amp; Whisky</button>
            <button type="button" onClick={() => scrollTo('reserve')} className="hover:text-[#C84B31] transition-colors cursor-pointer">Counter Seats</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="text-[#C84B31] font-semibold hover:text-[#F4F1EA] transition-colors cursor-pointer">License Kit</button>
          </nav>

          <button
            type="button"
            onClick={() => scrollTo('reserve')}
            className="px-6 py-2.5 rounded-full bg-[#C84B31] text-[#F4F1EA] text-[10px] font-medium tracking-[0.22em] uppercase hover:bg-[#DF5B3F] transition-colors shadow-lg cursor-pointer"
          >
            Reserve Seat
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
          <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=2200&q=90" alt="Kurokawa Omakase" className="w-full h-full object-cover opacity-45" />
        </motion.div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070B10]/85 via-[#070B10]/55 to-[#070B10]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(143,168,155,0.12)_0%,transparent_60%)]" />

        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#8FA89B]/35 bg-[#0C121A]/80 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#C84B31]" />
              <span className="kuro-kicker text-[9.5px] text-[#8FA89B]">Eight Seats Only • Ginza, Tokyo</span>
            </div>

            <h1 className="kuro-mincho text-5xl sm:text-7xl md:text-[5.2rem] font-normal leading-[1.06] text-[#F4F1EA]">
              Silence, Hinoki
              <span className="block text-[#8FA89B] mt-1">&amp; Winter Omakase.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#B8C2BD] font-light leading-relaxed max-w-xl">
              An eight-seat sanctuary carved from a single 200-year-old Kiso cypress beam. Master
              Kenji Kurokawa presents a sixteen-course seasonal Kaiseki journey paired with rare
              Yamagata sake and vintage Japanese single malts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => scrollTo('cinema')}
                className="px-7 py-3.5 rounded-full bg-[#F4F1EA] text-[#070B10] text-[10.5px] font-semibold uppercase tracking-[0.22em] hover:bg-[#C84B31] hover:text-[#F4F1EA] transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <Play size={13} className="fill-current" /> Watch 16:9 Film
              </button>
              <button
                type="button"
                onClick={() => scrollTo('kaiseki')}
                className="px-7 py-3.5 rounded-full border border-[#8FA89B]/45 text-[#F4F1EA] text-[10.5px] font-medium uppercase tracking-[0.22em] hover:border-[#C84B31] hover:text-[#C84B31] transition-colors cursor-pointer"
              >
                Explore 16 Courses
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <AntigravityFloat floatDelay={0.2} floatRange={10} tiltStrength={6} className="w-full max-w-sm rounded-[2rem] overflow-hidden bg-[#0D131C]/90 backdrop-blur-xl border border-[#8FA89B]/25 shadow-[0_35px_90px_rgba(0,0,0,0.85)]">
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=900&q=85" alt="Winter Omakase" className="w-full h-full object-cover" />
                <span className="absolute top-4 right-4 px-3.5 py-1 rounded-full bg-[#C84B31] text-[#F4F1EA] text-[9.5px] uppercase tracking-[0.2em]">
                  Tonight • 2 Seats Left
                </span>
              </div>
              <div className="p-6 space-y-3">
                <span className="kuro-kicker text-[9px] text-[#8FA89B] block">Winter Kaiseki Menu</span>
                <h3 className="kuro-mincho text-2xl text-[#F4F1EA]">16-Course Grand Omakase</h3>
                <p className="text-xs text-[#9AA6A0] font-light leading-relaxed">
                  ¥48,000 per guest · Optional Rare Sake &amp; Yamazaki Pairing ¥26,000
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo('reserve')}
                  className="w-full mt-2 py-3 rounded-full border border-[#8FA89B]/40 text-[10px] uppercase tracking-[0.22em] text-[#F4F1EA] hover:bg-[#C84B31] hover:border-[#C84B31] transition-colors cursor-pointer"
                >
                  Request Counter Seat
                </button>
              </div>
            </AntigravityFloat>
          </div>
        </div>
      </section>

      {/* 16:9 CINEMA VIDEO PLACEHOLDER */}
      <section id="cinema" className="py-28 px-6 bg-[#0A0F16] border-t border-[#8FA89B]/15">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="kuro-kicker inline-flex items-center gap-2 text-[10px] text-[#C84B31] mb-2">
                <Video size={14} /> {activeReel.chapter}
              </span>
              <h2 className="kuro-mincho text-4xl sm:text-5xl text-[#F4F1EA]">{activeReel.title}</h2>
              <p className="text-sm text-[#9AA6A0] font-light mt-2 max-w-xl">{activeReel.desc}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {CINEMA_REELS.map((reel, idx) => (
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
                      ? 'bg-[#C84B31] border-[#C84B31] text-[#F4F1EA]'
                      : 'border-[#8FA89B]/30 text-[#C9D2CD] hover:border-[#C84B31]'
                  }`}
                >
                  Reel 0{idx + 1} (16:9)
                </button>
              ))}
            </div>
          </div>

          <AntigravityFloat floatDelay={0.2} floatRange={7} tiltStrength={3.5} className="relative w-full aspect-video overflow-hidden rounded-[2rem] bg-black border border-[#8FA89B]/25 shadow-[0_40px_110px_rgba(0,0,0,0.9)]">
            {hasLiveVideoFile ? (
              <video ref={videoRef} key={effectiveVideoUrl} autoPlay loop muted={isMuted} playsInline poster={activeReel.poster} onError={() => setVideoError(true)} className="h-full w-full object-cover">
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
                  <div className="rounded-3xl bg-[#070B10]/85 backdrop-blur-xl border border-[#8FA89B]/35 px-7 py-5 text-center shadow-2xl max-w-md">
                    <span className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full bg-[#C84B31] text-[#F4F1EA]">
                      <Film size={18} />
                    </span>
                    <span className="kuro-mincho block text-2xl text-[#F4F1EA]">16:9 Tokyo Cinema Slot</span>
                    <span className="block text-[11px] text-[#9AA6A0] mt-1">
                      3840 × 2160 UHD Ready • Paste any .mp4 / .webm URL below
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070B10]/90 via-transparent to-[#070B10]/30" />

            <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={togglePlay} aria-label="Play or Pause" className="w-11 h-11 rounded-full border border-white/25 bg-[#070B10]/75 backdrop-blur-md text-[#F4F1EA] hover:border-[#C84B31] hover:text-[#C84B31] flex items-center justify-center transition cursor-pointer">
                  {isPlaying ? <Pause size={15} /> : <Play size={15} />}
                </button>
                <button type="button" onClick={toggleMute} aria-label="Mute or Unmute" className="w-11 h-11 rounded-full border border-white/25 bg-[#070B10]/75 backdrop-blur-md text-[#F4F1EA] hover:border-[#C84B31] hover:text-[#C84B31] flex items-center justify-center transition cursor-pointer">
                  {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                </button>
              </div>

              <div className="flex flex-1 max-w-md items-center gap-2 rounded-full bg-[#070B10]/90 border border-[#8FA89B]/40 px-4 py-2 backdrop-blur-xl">
                <Link2 size={14} className="text-[#C84B31] shrink-0" />
                <input
                  type="text"
                  value={customVideoUrl}
                  onChange={(e) => setCustomVideoUrl(e.target.value)}
                  placeholder="Paste 16:9 .mp4 or .webm URL to preview..."
                  className="w-full text-xs"
                />
                {customVideoUrl && (
                  <button type="button" onClick={() => setCustomVideoUrl('')} className="text-[10px] font-semibold uppercase tracking-widest text-[#C84B31] cursor-pointer">
                    Clear
                  </button>
                )}
              </div>
            </div>
          </AntigravityFloat>
        </div>
      </section>

      {/* KAISEKI GALLERY */}
      <section id="kaiseki" className="py-28 px-6 bg-[#070B10] border-t border-[#8FA89B]/15">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div>
              <span className="kuro-kicker text-[10px] text-[#8FA89B] block mb-2">Seasonal Gastronomy</span>
              <h2 className="kuro-mincho text-4xl sm:text-6xl text-[#F4F1EA]">
                Omakase, Robata <span className="text-[#C84B31]">&amp; Wagashi</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {KAISEKI_FILTERS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setCourseFilter(tab)}
                  className={`px-5 py-2.5 rounded-full text-[10px] tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                    courseFilter === tab
                      ? 'bg-[#C84B31] border-[#C84B31] text-[#F4F1EA]'
                      : 'bg-[#0D131C] border-[#8FA89B]/25 text-[#C9D2CD] hover:border-[#C84B31]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((item, idx) => (
              <AntigravityFloat key={item.id} floatDelay={(idx % 3) * 0.45} floatRange={6} tiltStrength={4.5} invertFloat={idx % 2 === 1}>
                <article
                  onClick={() => setSelectedDish(item)}
                  className="group cursor-pointer rounded-3xl overflow-hidden bg-[#0D131C] border border-[#8FA89B]/20 hover:border-[#C84B31]/60 transition-all shadow-[0_25px_65px_rgba(0,0,0,0.75)] flex flex-col h-full"
                >
                  <div className="relative h-60 overflow-hidden bg-black">
                    <img src={item.image} alt={item.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-[#070B10]/85 backdrop-blur-md border border-[#8FA89B]/35 text-[9px] uppercase tracking-[0.2em] text-[#8FA89B]">
                      {item.tag}
                    </span>
                    <span className="absolute bottom-4 right-4 px-4 py-1 rounded-full bg-[#F4F1EA] text-[#070B10] text-xs font-semibold">
                      {item.price}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="kuro-kicker text-[9px] text-[#8FA89B] block">{item.category} · {item.prep}</span>
                      <h3 className="kuro-mincho text-2xl text-[#F4F1EA] group-hover:text-[#C84B31] transition-colors mt-1.5">{item.name}</h3>
                      <p className="text-xs text-[#9AA6A0] font-light leading-relaxed mt-2 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#8FA89B]/15 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase text-[#C84B31]">
                      <span>Course Notes</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </article>
              </AntigravityFloat>
            ))}
          </div>
        </div>
      </section>

      {/* SAKE & WHISKY VAULT */}
      <section id="sake-vault" className="py-28 px-6 bg-[#0A0F16] border-t border-[#8FA89B]/15">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="kuro-kicker inline-flex items-center gap-2 text-[10px] text-[#8FA89B] mb-3">
              <Wine size={14} /> Sake &amp; Single Malt Vault
            </span>
            <h2 className="kuro-mincho text-4xl sm:text-6xl text-[#F4F1EA]">
              Rare Bottles &amp; <span className="text-[#C84B31]">Craft Pours</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {SAKE_VAULT.map((bottle, idx) => (
              <AntigravityFloat key={bottle.id} floatDelay={idx * 0.35} floatRange={6} tiltStrength={4} invertFloat={idx % 2 === 0}>
                <article className="rounded-3xl overflow-hidden bg-[#0D131C] border border-[#8FA89B]/20 hover:border-[#C84B31]/55 transition-all shadow-xl flex flex-col h-full">
                  <div className="relative h-52 overflow-hidden">
                    <img src={bottle.image} alt={bottle.name} loading="lazy" className="w-full h-full object-cover" />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-[#070B10]/85 text-[9px] uppercase tracking-[0.18em] text-[#8FA89B]">
                      {bottle.type}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="kuro-kicker text-[8.5px] text-[#8FA89B] block">{bottle.origin}</span>
                      <h3 className="kuro-mincho text-2xl text-[#F4F1EA] mt-1">{bottle.name}</h3>
                      <p className="text-xs text-[#9AA6A0] font-light mt-2 leading-relaxed">{bottle.notes}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-[#8FA89B]/15 flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-medium text-[#F4F1EA]">{bottle.price}</span>
                        <span className="block text-[10px] text-[#8FA89B]">{bottle.pour}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, notes: `Reserve bottle: ${bottle.name}` }));
                          scrollTo('reserve');
                        }}
                        className="px-4 py-1.5 rounded-full border border-[#8FA89B]/40 text-[9.5px] uppercase tracking-[0.18em] text-[#F4F1EA] hover:bg-[#C84B31] hover:border-[#C84B31] transition-colors cursor-pointer"
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
      <section id="reserve" className="py-28 px-6 bg-[#070B10] border-t border-[#8FA89B]/15">
        <div className="max-w-3xl mx-auto rounded-[2.5rem] bg-[#0D131C] border border-[#8FA89B]/25 p-8 sm:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <span className="kuro-kicker text-[10px] text-[#C84B31] block mb-2">Eight-Seat Sanctuary</span>
            <h2 className="kuro-mincho text-4xl sm:text-5xl text-[#F4F1EA]">Reserve the Hinoki Counter</h2>
          </div>

          {submitted ? (
            <div className="p-10 rounded-3xl bg-[#070B10] border border-[#C84B31]/50 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#C84B31] text-[#F4F1EA] flex items-center justify-center mx-auto">
                <Check size={20} />
              </div>
              <h3 className="kuro-mincho text-3xl text-[#F4F1EA]">Arigatōgozaimasu, {booking.name}</h3>
              <p className="text-sm text-[#B8C2BD] font-light">
                We have registered your request for <strong>{booking.guests}</strong> ({booking.seating}) on {booking.date}.
              </p>
              <button type="button" onClick={() => setSubmitted(false)} className="px-7 py-2.5 rounded-full border border-[#8FA89B]/40 text-[10px] uppercase tracking-[0.2em] cursor-pointer">
                Modify
              </button>
            </div>
          ) : (
            <form onSubmit={submitReservation} className="grid grid-cols-1 sm:grid-cols-2 gap-7">
              <div className="border-b border-[#8FA89B]/25 focus-within:border-[#C84B31] pb-2">
                <label className="kuro-kicker block text-[9px] text-[#8FA89B] mb-1.5">Guest Name *</label>
                <input type="text" required placeholder="Full Name" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} className="w-full text-sm font-light" />
              </div>

              <div className="border-b border-[#8FA89B]/25 focus-within:border-[#C84B31] pb-2">
                <label className="kuro-kicker block text-[9px] text-[#8FA89B] mb-1.5">Phone or Concierge Email *</label>
                <input type="text" required placeholder="+81 3-5555-0192" value={booking.phone} onChange={(e) => setBooking({ ...booking, phone: e.target.value })} className="w-full text-sm font-light" />
              </div>

              <div className="border-b border-[#8FA89B]/25 focus-within:border-[#C84B31] pb-2">
                <label className="kuro-kicker block text-[9px] text-[#8FA89B] mb-1.5">Date *</label>
                <input type="date" required value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} className="w-full text-sm font-light cursor-pointer" />
              </div>

              <div className="border-b border-[#8FA89B]/25 focus-within:border-[#C84B31] pb-2">
                <label className="kuro-kicker block text-[9px] text-[#8FA89B] mb-1.5">Seating</label>
                <select value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })} className="w-full text-sm font-light cursor-pointer">
                  <option>18:00 — First Omakase</option>
                  <option>20:45 — Second Omakase</option>
                </select>
              </div>

              <div className="sm:col-span-2 border-b border-[#8FA89B]/25 focus-within:border-[#C84B31] pb-2">
                <label className="kuro-kicker block text-[9px] text-[#8FA89B] mb-1.5">Dietary &amp; Sake Requests</label>
                <input type="text" placeholder="Allergies, Yamazaki pour, celebration..." value={booking.notes} onChange={(e) => setBooking({ ...booking, notes: e.target.value })} className="w-full text-sm font-light" />
              </div>

              <div className="sm:col-span-2 pt-4 text-center">
                <button type="submit" disabled={isSubmitting} className="px-14 py-4 rounded-full bg-[#C84B31] text-[#F4F1EA] text-[10.5px] font-medium uppercase tracking-[0.26em] hover:bg-[#DF5B3F] transition-colors shadow-lg cursor-pointer">
                  {isSubmitting ? 'Confirming...' : 'Confirm Counter Seat'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =================================================================== */}
      {/* VISIBLE COMMERCIAL PRICING + ORDER BUMP + FREE SAMPLE CLOUD         */}
      {/* =================================================================== */}
      <section id="licensing" className="py-24 px-6 bg-[#0A0F16] border-t border-[#8FA89B]/15">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="kuro-kicker inline-flex items-center gap-2 text-[10px] text-[#C84B31] mb-2">
              <Crown size={14} /> Commercial React + 150MP Kaiseki Kit
            </span>
            <h2 className="kuro-mincho text-4xl sm:text-5xl text-[#F4F1EA]">
              Acquire <span className="text-[#8FA89B]">Kurokawa Tokyo</span>
            </h2>
          </div>

          {/* Order Bump (+$199 Motion Pack) */}
          <div
            onClick={() => setIncludeMotionBump(!includeMotionBump)}
            className="mb-8 rounded-3xl border border-[#8FA89B]/35 bg-[#0D131C] p-5 flex items-center gap-4 cursor-pointer hover:border-[#C84B31] transition-colors"
          >
            <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="h-5 w-5 cursor-pointer accent-[#C84B31]" />
            <div className="flex-1">
              <span className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#F4F1EA]">
                Add 30s 4K Tokyo Omakase Motion Pack for the 16:9 Cinema Slot (+$199)
              </span>
              <span className="block text-xs text-[#9AA6A0] mt-0.5">
                Seamless 60fps UHD video loops ready to drop into Reel 01 &amp; Reel 02.
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid gap-7 md:grid-cols-2">
            <div className="p-8 rounded-[2rem] bg-[#0D131C] border border-[#8FA89B]/25 flex flex-col justify-between shadow-xl">
              <div>
                <span className="kuro-kicker text-[10px] text-[#8FA89B]">Agency License</span>
                <p className="kuro-mincho text-5xl text-[#F4F1EA] mt-2">${agencyPriceNum}</p>
                <p className="text-xs text-[#9AA6A0] mt-3 leading-relaxed">
                  Complete Kurokawa Tokyo Kaiseki React JSX + 16:9 Cinema Slot + Omakase &amp; Sake Vault Galleries + Full Commercial Rights.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="mt-8 w-full py-4 rounded-full bg-[#C84B31] text-[#F4F1EA] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#DF5B3F] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <DownloadCloud size={15} /> License Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className="p-8 rounded-[2rem] bg-[#F4F1EA] text-[#070B10] flex flex-col justify-between shadow-xl">
              <div>
                <span className="kuro-kicker text-[10px] text-[#C84B31]">1-of-1 Exclusive Buyout</span>
                <p className="kuro-mincho text-5xl mt-2">${buyoutPriceNum}</p>
                <p className="text-xs text-[#4B5550] mt-3 leading-relaxed">
                  Permanent store removal + 100% IP transfer + 10 custom 150MP Ultra Print Ginza Kaiseki renders.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="mt-8 w-full py-4 rounded-full bg-[#070B10] text-[#F4F1EA] text-[11px] font-semibold uppercase tracking-[0.22em] hover:bg-[#C84B31] transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock size={14} /> Buyout 1-of-1 — ${buyoutPriceNum}
              </button>
            </div>
          </div>

          {/* Free Sample Cloud Button */}
          <div className="mt-8 flex justify-center">
            <a
              href={KIT_CONFIG.freeSampleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-[#0D131C] border border-[#8FA89B]/45 text-[#F4F1EA] hover:bg-[#C84B31] hover:border-[#C84B31] transition-all shadow-lg text-xs font-medium uppercase tracking-[0.18em]"
            >
              <DownloadCloud size={18} className="text-[#8FA89B]" />
              <span>Download Free 4K Preview Sample</span>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#05080C] border-t border-[#8FA89B]/15 pt-14 pb-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="kuro-mincho text-2xl tracking-[0.16em] text-[#F4F1EA]">KUROKAWA</span>
            <p className="text-xs text-[#8FA89B] mt-1">6-Chome, Ginza, Chuo-ku, Tokyo 104-0061, Japan</p>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#B8C2BD]">
            <span className="flex items-center gap-2"><Phone size={13} className="text-[#C84B31]" /> +81 3-5555-0192</span>
            <span className="flex items-center gap-2"><MapPin size={13} className="text-[#C84B31]" /> Ginza, Tokyo</span>
          </div>
        </div>
      </footer>

      {/* FLOATING FREE SAMPLE CLOUD BUBBLE ("Oblačić") */}
      <a
        href={KIT_CONFIG.freeSampleLink}
        target="_blank"
        rel="noopener noreferrer"
        title="Download Free 4K Sample"
        className="fixed bottom-20 right-6 z-40 flex items-center gap-2.5 rounded-full bg-[#0D131C]/95 border border-[#8FA89B]/45 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#F4F1EA] shadow-2xl backdrop-blur-md hover:bg-[#C84B31] hover:border-[#C84B31] transition-all"
      >
        <DownloadCloud size={16} className="text-[#8FA89B]" />
        <span className="hidden sm:inline">Free Sample</span>
      </a>

      {/* COURSE MODAL */}
      {selectedDish &&
        createPortal(
          <div onClick={() => setSelectedDish(null)} className="fixed inset-0 z-[999999] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-[#0D131C] border border-[#8FA89B]/30 text-[#F4F1EA] rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl">
              <div className="relative h-64">
                <img src={selectedDish.image} alt={selectedDish.name} className="w-full h-full object-cover" />
                <button type="button" onClick={() => setSelectedDish(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#070B10]/85 text-[#F4F1EA] flex items-center justify-center cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <div className="p-7 space-y-3">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-[#8FA89B]">
                  <span>{selectedDish.category} · {selectedDish.tag}</span>
                  <span className="text-base font-semibold text-[#F4F1EA]">{selectedDish.price}</span>
                </div>
                <h3 className="text-3xl text-[#F4F1EA]" style={{ fontFamily: "'Shippori Mincho', Georgia, serif" }}>
                  {selectedDish.name}
                </h3>
                <p className="text-sm text-[#B8C2BD] font-light leading-relaxed">{selectedDish.description}</p>
                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      const name = selectedDish.name;
                      setSelectedDish(null);
                      setBooking((prev) => ({ ...prev, notes: `Pre-requested course: ${name}` }));
                      scrollTo('reserve');
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#C84B31] text-[#F4F1EA] text-[10px] uppercase tracking-[0.2em] cursor-pointer"
                  >
                    Request at Counter
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
          className="group flex items-center gap-3 rounded-full bg-[#0D131C]/95 px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#F4F1EA] shadow-2xl border border-[#8FA89B]/35 backdrop-blur-md transition hover:border-[#C84B31] cursor-pointer"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8FA89B] text-[#070B10]">
            <ArrowLeft size={13} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-40">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#C84B31] px-5 py-3 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#F4F1EA] shadow-2xl transition hover:bg-[#DF5B3F] cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#070B10] text-[#F4F1EA]">
            <ArrowRight size={13} />
          </span>
        </button>
      </div>
    </div>
  );
}