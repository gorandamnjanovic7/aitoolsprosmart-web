import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Compass,
  Crown,
  DownloadCloud,
  FolderArchive,
  Gauge,
  Globe,
  Lock,
  Maximize2,
  Moon,
  Pause,
  Plane,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const WEBHOOK_URL = 'https://n8n-production-720dcf20.up.railway.app/webhook/AVIATION_Concierge_And_Calendar';

// Fullscreen Lightbox Inspector
const LightboxInspector = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-2xl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full border border-amber-400/40 bg-black/80 p-3 text-amber-200 transition hover:bg-amber-400 hover:text-black cursor-pointer"
      >
        <X size={20} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Nocturnal Master Visual"
        className="max-h-[90vh] max-w-[94vw] rounded-2xl border border-amber-400/40 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

// ============================================================================
// KIT_CONFIG — STRANICA 4 OD 5 (MIDNIGHT ALTITUDE • NOCTURNAL EDITION)
// SVI FAJLOVI SU 100% TAČNI .WEBP I .PNG IZ TVOG PUBLIC/JETS FOLDERA
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1IRFykjqqczESjuzpyjo7hxrXHCVT_5aI/view?usp=sharing',

  prevPageRoute: '/aviation-cloudline-kit',
  prevPageLabel: 'Prev Jet Page: Cloudline (3/5)',
  nextLandingRoute: '/aviation-skyglass-kit',
  nextLandingLabel: 'Next Jet Page: Skyglass (5/5)',

  heroImage: '/jets/60.webp',
  heroVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',

  // 6 NOĆNIH ZONA ZA SPLIT-SCREEN FLIGHT DECK HERO
  bespokeCabins: [
    {
      id: 'night-01-starlight',
      step: '01 / 06',
      zone: 'Zone 01 • Starlight Runway Symmetrical Departure',
      telemetry: { altitude: 'FL510 Cleared', acoustics: '41 dB Cabin', speed: 'Mach 0.925' },
      title: 'Own the night sky while the world sleeps.',
      subtitle:
        'Engineered for red-eye transoceanic crossings with zero jet-lag cabin pressurization and whisper-quiet twin turbofans.',
      materials: 'Obsidian Night Livery • High-Intensity LED Strobe Suite • Heated Wing Edges',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/60.webp'
    },
    {
      id: 'night-02-v10-evening',
      step: '02 / 06',
      zone: 'Zone 02 • V10 Evening Obsidian & Smoked Glass Club',
      telemetry: { altitude: '3,100 ft Cabin Alt', acoustics: '42 dB Salon', speed: 'Dual Starlink' },
      title: 'Sculpted cove lighting & twilight boardroom.',
      subtitle:
        'Flagship V10 nocturnal cabin study featuring charcoal Nappa hides, smoked bronze partitions, and crystal decanter service.',
      materials: 'Nero Marquina Marble • Smoked Bronze Glass • Charcoal Nappa Leather',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit PNG',
      image: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png'
    },
    {
      id: 'night-03-walnut-club',
      step: '03 / 06',
      zone: 'Zone 03 • Midnight Walnut & Anthracite Lounge',
      telemetry: { altitude: '51,000 ft Cruise', acoustics: '41 dB Isolation', speed: '7,800 NM Range' },
      title: 'Private nocturnal club for four executives.',
      subtitle:
        'Gather around a hand-rubbed walnut table under warm 2700K indirect LEDs while crossing the Atlantic overnight.',
      materials: 'Anthracite Full-Grain Leather • American Burl Walnut • Brass Reading Sconces',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/58.webp'
    },
    {
      id: 'night-04-moonlight-emerald',
      step: '04 / 06',
      zone: 'Zone 04 • Full-Moon Emerald & Walnut Sanctuary',
      telemetry: { altitude: '100% Fresh Air', acoustics: '41 dB Lounge', speed: 'Circadian LED' },
      title: 'Moonlit serenity at 51,000 feet.',
      subtitle:
        'Deep forest heritage leather seating paired with bookmatched walnut bulkheads and a direct view of the full moon above the cloud deck.',
      materials: 'British Racing Green Hide • Dark Walnut Cabinetry • Matte Obsidian Table',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/50.webp'
    },
    {
      id: 'night-05-alcantara-berth',
      step: '05 / 06',
      zone: 'Zone 05 • Alcantara VIP Window Berth Over City Lights',
      telemetry: { altitude: 'Zero-Gravity Seat', acoustics: '40 dB Suite', speed: 'Bespoke Trim' },
      title: 'Watch metropolitan skylines glide beneath you.',
      subtitle:
        'Individual quilted cream leather recliner cocooned inside dark charcoal Alcantara acoustic fuselage walls.',
      materials: 'Charcoal Alcantara Bulkhead • Quilted Cream Calfskin • Brushed Titanium Frame',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/54.webp'
    },
    {
      id: 'night-06-stealth-tarmac',
      step: '06 / 06',
      zone: 'Zone 06 • Matte-Obsidian FBO Night Terminal Ops',
      telemetry: { altitude: '90s Boarding', acoustics: 'Private Customs', speed: 'Direct SUV Apron' },
      title: 'Discreet midnight departures from private FBOs.',
      subtitle:
        'Transition directly from your armored SUV into our matte-black flagship with zero public terminal exposure.',
      materials: 'Matte-Obsidian Fuselage • Private FBO Apron • Biometric Night Clearance',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/71.webp'
    }
  ]
};

// NOVA SEKCIJA SAMO ZA STRANICU 4: INTERAKTIVNI PLANER NOĆNIH TRANSOKEANSKIH RUTA
const NOCTURNAL_ROUTES = [
  {
    id: 'gva-teb',
    code: 'GVA ➔ TEB',
    corridor: 'Geneva to New York Teterboro',
    duration: '07h 40m Non-Stop Overnight',
    departure: '22:30 CET • Wheels Up',
    arrival: '06:10 EST • Rested for Wall St. Open',
    distance: '3,380 NM • North Atlantic Track',
    exteriorImg: '/jets/62.webp',
    cabinImg: '/jets/58.webp',
    charterEstimate: '$64,500 All-Inclusive Night Dispatch'
  },
  {
    id: 'fab-dxb',
    code: 'FAB ➔ DXB',
    corridor: 'London Farnborough to Dubai VIP',
    duration: '06h 35m Non-Stop Overnight',
    departure: '23:00 GMT • Private FBO',
    arrival: '09:35 GST • Direct Chauffeur Apron',
    distance: '2,980 NM • Stratospheric Corridor',
    exteriorImg: '/jets/70.webp',
    cabinImg: '/jets/50.webp',
    charterEstimate: '$58,900 All-Inclusive Night Dispatch'
  },
  {
    id: 'hnd-vny',
    code: 'HND ➔ VNY',
    corridor: 'Tokyo Haneda to Los Angeles Van Nuys',
    duration: '09h 50m Pacific Crossing',
    departure: '00:15 JST • Midnight Slot',
    arrival: '17:05 PST • Same-Day Arrival',
    distance: '4,770 NM • Mach 0.925 High-Speed',
    exteriorImg: '/jets/61.webp',
    cabinImg: '/jets/54.webp',
    charterEstimate: '$86,000 All-Inclusive Night Dispatch'
  },
  {
    id: 'zrh-sin',
    code: 'ZRH ➔ SIN',
    corridor: 'Zurich to Singapore Seletar',
    duration: '11h 45m Ultra-Long-Range',
    departure: '21:45 CET • Stateroom Config',
    arrival: '16:30 SGT • Full-Beam Suite Rest',
    distance: '5,560 NM • Non-Stop Sovereign Range',
    exteriorImg: '/jets/69.webp',
    cabinImg: '/jets/59.webp',
    charterEstimate: '$104,000 All-Inclusive Night Dispatch'
  }
];

const VIDEO_CHAPTERS = [
  {
    id: 'reel-1',
    title: '01 / Twilight & Nocturnal Cloud-Deck Cruise',
    duration: '01:45 • 4K 60FPS',
    poster: '/jets/60.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Symmetrical night takeoff and stratospheric cruise above the twilight horizon.'
  },
  {
    id: 'reel-2',
    title: '02 / Wet Runway Strobe Reflections at Midnight',
    duration: '01:18 • 4K 60FPS',
    poster: '/jets/62.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'High-contrast crimson and gold runway light reflections during midnight departure.'
  },
  {
    id: 'reel-3',
    title: '03 / V10 Evening Obsidian Club & Stateroom Tour',
    duration: '02:10 • 4K 60FPS',
    poster: '/jets/58.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Walkthrough of the 41 dB whisper-quiet night cabin, emerald lounge, and master suite.'
  }
];

// BENTO ASYMMETRIC MASONRY GALERIJA (Sa flagom featured: true za široke kartice)
const LOOKBOOK_ASSETS = [
  { src: '/jets/60.webp', title: 'Starlight Symmetrical Runway Takeoff', zone: 'Night Runway Ops', featured: true },
  { src: '/jets/61.webp', title: 'Golden Centerline Night Taxi Silhouette', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/62.webp', title: 'Crimson & Amber Wet Runway Reflections', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/68.webp', title: 'Misty Blue Midnight Runway Rotation', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/69.webp', title: 'Two-Tone Flagship Night Climb Past FBO', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/71.webp', title: 'Matte-Black Flagship & Private FBO SUVs', zone: 'Stealth Fleet', featured: true },
  { src: '/jets/70.webp', title: 'White Tail Night Ascent Over Apron', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/74.webp', title: 'Obsidian Stealth Jet Twilight Taxi', zone: 'Stealth Fleet', featured: false },
  { src: '/jets/23.webp', title: 'Black & Gold Fuselage on Wet Night Apron', zone: 'Stealth Fleet', featured: false },
  { src: '/jets/1.webp', title: 'Night Control Tower & Runway Climb', zone: 'Night Runway Ops', featured: false },
  { src: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png', title: 'V10 Evening Obsidian & Smoked Glass Club', zone: 'Nocturnal Cabins', featured: true },
  { src: '/jets/58.webp', title: 'Evening Walnut & CharcoalFour-Place Club', zone: 'Nocturnal Cabins', featured: false },
  { src: '/jets/57.webp', title: 'Anthracite Conference Table & Gold Trim', zone: 'Nocturnal Cabins', featured: false },
  { src: '/jets/50.webp', title: 'Full-Moon Emerald Leather & Walnut Salon', zone: 'Nocturnal Cabins', featured: true },
  { src: '/jets/54.webp', title: 'Alcantara VIP Berth Over Night City Lights', zone: 'Nocturnal Cabins', featured: false },
  { src: '/jets/18.webp', title: 'Arctic Dusk Boarding with Warm Cabin Glow', zone: 'Stealth Fleet', featured: false },
  { src: '/jets/14.webp', title: 'Deep Midnight Blue Stratospheric Cruise', zone: 'Stealth Fleet', featured: false },
  { src: '/jets/32.webp', title: 'Sapphire Jet Above High-Altitude Cloud Sea', zone: 'Stealth Fleet', featured: false },
  { src: '/jets/59.webp', title: 'Golden Dusk Full-Beam Master Stateroom', zone: 'Night Staterooms', featured: true },
  { src: '/jets/37.webp', title: 'Twilight King Bed & Side Lounge Divan', zone: 'Night Staterooms', featured: false },
  { src: '/jets/34.webp', title: 'Warm Cove-Lit Master Bedroom Suite', zone: 'Night Staterooms', featured: false },
  { src: '/jets/38.webp', title: 'Aft Bedroom Looking Toward Sunset Cockpit', zone: 'Night Staterooms', featured: false }
];

const FAQ_ITEMS = [
  {
    q: 'HOW DOES THE SPLIT-SCREEN FLIGHT DECK HERO WORK ON THIS LANDING PAGE?',
    a: 'Unlike standard full-bleed headers, Midnight Altitude features an asymmetric Nocturnal Command Deck on the left and an interactive 6-Zone Vertical Switcher on the right—complete with live cabin telemetry (altitude, dB isolation, Mach speed) and 1-click 4K Video Hero switching.'
  },
  {
    q: 'WHAT IS INCLUDED IN THE $349 AGENCY LICENSE?',
    a: 'You receive the complete Midnight Altitude React + Tailwind JSX source code (with Split-Screen Flight Deck Hero, Interactive Transoceanic Night Route Matrix, and Bento Lookbook), 60 production files (20 WebP, 20 4K UHD & 20 150MP masters with embedded sRGB ICC profiles), the Railway n8n + Groq AI Flight Desk workflow, and a commercial license for unlimited client websites and print.'
  },
  {
    q: 'HOW DOES THE 16:9 VIDEO PLACEHOLDER WORK WITH SEEDANCE 2.5 AND KLING 4.0?',
    a: 'Both the Hero command deck and the 16:9 Cinema Reel player support native 4K/60FPS WebM and MP4 streams. When you add the +$199 30s 4K/60fps Cinema Motion Pack, you receive the seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut ready to drop straight into the player.'
  },
  {
    q: 'WHAT IS THE DIFFERENCE BETWEEN THE $349 LICENSE AND THE $1,490 EXCLUSIVE BUYOUT?',
    a: 'The $349 Multi-Client Agency License grants commercial deployment rights for your agency and client projects. The $1,490 1-of-1 Exclusive Buyout permanently removes this kit from our public Stock Store, includes 10 custom 150MP renders tailored to your brand palette, the Private Jet Prompt Engine ruleset, and a signed enterprise IP transfer certificate.'
  }
];

const MidnightAltitude = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // User Auth & Checkout Modals
  const [currentUser, setCurrentUser] = useState(null);
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    tierName: '',
    price: '0.00',
    zipLink: ''
  });
  const [checkoutData, setCheckoutData] = useState({
    isOpen: false,
    name: '',
    price: '0.00',
    zipLink: ''
  });

  // +$199 Order Bump State (Cinema Motion Pack)
  const [includeMotionPack, setIncludeMotionPack] = useState(false);

  // Hero & Interactive Zone States
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [heroVideoMode, setHeroVideoMode] = useState(false);

  // Interactive Nocturnal Route Planner State (Unique to Page 4)
  const [selectedRoute, setSelectedRoute] = useState(NOCTURNAL_ROUTES[0]);

  // Video Showcase State
  const [activeClip, setActiveClip] = useState(VIDEO_CHAPTERS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Lookbook & Lightbox State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [zoomImage, setZoomImage] = useState(null);

  // Executive FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // n8n + Groq AI Flight Desk State
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to Midnight Altitude (Page 4/5 • Nocturnal Obsidian & Amber Edition). Ask me about overnight transoceanic charters, matte-black stealth fleet availability, or licensing this complete Turnkey Web + 150MP Asset Kit.'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [flightDate, setFlightDate] = useState('2026-11-20');
  const [flightSlot, setFlightSlot] = useState('14:00 CET');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u));
    return () => unsub();
  }, []);

  const currentZone = KIT_CONFIG.bespokeCabins[activeZoneIndex];

  // Dinamički obračun cene sa +$199 Video Motion Pack Order Bump-om
  const agencyPrice = includeMotionPack ? 349 + 199 : 349;
  const buyoutPrice = includeMotionPack ? 1490 + 199 : 1490;

  const categories = [
    'All',
    'Night Runway Ops',
    'Stealth Fleet',
    'Nocturnal Cabins',
    'Night Staterooms'
  ];

  const filteredAssets =
    selectedCategory === 'All'
      ? LOOKBOOK_ASSETS
      : LOOKBOOK_ASSETS.filter((a) => a.zone === selectedCategory);

  const recordOrderIntent = async (user, tierName, price) => {
    try {
      await addDoc(collection(db, 'orders'), {
        userId: user?.uid || 'guest',
        userEmail: user?.email || 'guest@aitoolsprosmart.com',
        packageName: tierName,
        price,
        includeMotionPack,
        kitCategory: 'Aviation Turnkey Kit - Page 4 (Midnight Altitude)',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error('Order log error:', err);
    }
  };

  const handlePurchaseTier = async (baseTierName, numericPrice, zipLink) => {
    const finalTierName = includeMotionPack
      ? `${baseTierName} + 30s 4K/60fps Cinema Motion Pack`
      : baseTierName;
    const formattedPrice = Number(numericPrice).toFixed(2);

    try {
      if (typeof trackV8Action === 'function') {
        trackV8Action('initiate_checkout', { package: finalTierName, price: formattedPrice });
      }
    } catch (_) {}

    if (!currentUser) {
      setLoginModal({ isOpen: true, tierName: finalTierName, price: formattedPrice, zipLink });
      return;
    }

    await recordOrderIntent(currentUser, finalTierName, formattedPrice);
    setCheckoutData({ isOpen: true, name: finalTierName, price: formattedPrice, zipLink });
  };

  const handleDownloadSampleAndSpec = () => {
    const specContent = `===================================================================
VISIONARY FACTORY V10 — MIDNIGHT ALTITUDE (PAGE 4 OF 5)
150MP ULTRA PRINT & TURNKEY AVIATION KIT SPECIFICATION SHEET (.TXT)
===================================================================
Edition: Midnight Altitude • Nocturnal Obsidian & Amber Edition
Resolution: 150 Megapixels (14,200 x 10,600 px) & 4K UHD WebP/PNG
Upscaling & Filtering: LANCZOS-3 / NumPy Calibrated Glassmorphism
Color Profile: Embedded sRGB IEC61966-2.1 (Print & Web Ready)
Motion Pack Option: +$199 30s 4K/60fps Cinema Motion Pack (Seedance 2.5 & Kling 4.0)
AI Concierge Webhook: Production Railway n8n + Groq Llama-3.3-70B
Free Sample Vault Drive: ${KIT_CONFIG.freeSampleLink}
===================================================================`;
    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Midnight_Altitude_150MP_Spec_Sheet.txt';
    a.click();
    URL.revokeObjectURL(url);

    window.open(KIT_CONFIG.freeSampleLink, '_blank', 'noopener,noreferrer');
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleConciergeSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const msg = userInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }]);
    setUserInput('');
    setIsSending(true);

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: typeof clientName !== 'undefined' ? clientName : 'VIP Aviation Client',
          clientEmail: typeof clientEmail !== 'undefined' ? clientEmail : '',
          bookingDate: typeof flightDate !== 'undefined' ? flightDate : '2026-11-22',
          bookingSlot: typeof flightSlot !== 'undefined' ? flightSlot : '14:00 CET',
          message: msg,
          date: `${flightDate} at ${flightSlot}`,
          clientName: clientName || 'Midnight VIP Guest',
          clientEmail: clientEmail || 'vip@midnight-altitude.com',
          activeZone: currentZone.zone,
          selectedRoute: selectedRoute.corridor,
          source: 'MidnightAltitude.jsx (Page 4 of 5)'
        })
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        data?.output ||
        data?.text ||
        data?.message ||
        'Our 24/7 Nocturnal Flight Desk has registered your inquiry and prepared your bespoke aviation dossier.';
      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Direct Railway AI Flight Desk connection is active. Leave your VIP email above for immediate night charter & turnkey kit dispatch.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04050A] text-[#F5F5F7] selection:bg-amber-400 selection:text-black font-sans">
      <Helmet>
        <title>Midnight Altitude • Nocturnal Private Aviation Turnkey Kit (Page 4/5)</title>
      </Helmet>

      {/* TOP NOCTURNAL COMMAND NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-amber-500/20 bg-[#04050A]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 text-black shadow-lg shadow-amber-500/20">
              <Moon size={18} />
            </span>
            <div>
              <span className="block text-xs font-black uppercase tracking-[0.28em] text-white">
                Midnight • Altitude
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-amber-400">
                Nocturnal Stealth & Night Ops • Page 4 of 5
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.15em] text-zinc-300 xl:flex">
            <a href="#flight-deck-hero" className="transition hover:text-amber-300">
              Split-Deck Hero
            </a>
            <a href="#night-corridors" className="transition hover:text-amber-300">
              Night Corridors
            </a>
            <a href="#cinema-reel" className="transition hover:text-amber-300">
              4K Night Reel
            </a>
            <a href="#bento-lookbook" className="transition hover:text-amber-300">
              Bento Lookbook
            </a>
            <a href="#commercial-pricing" className="text-amber-300 transition hover:text-white">
              Pricing (${agencyPrice} / ${buyoutPrice})
            </a>
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="text-amber-400 transition hover:text-white cursor-pointer"
            >
              Stock Vaults ↗
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-200 transition hover:border-amber-400 hover:text-amber-300 cursor-pointer"
            >
              Stock Vaults <ArrowUpRight size={13} />
            </button>
            <button
              type="button"
              onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-black shadow-lg shadow-amber-500/25 transition hover:brightness-110 cursor-pointer"
            >
              Page 5 <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. NOVI ASIMETRIČNI SPLIT-SCREEN "NOCTURNAL FLIGHT DECK" HERO */}
        <section
          id="flight-deck-hero"
          className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-b from-[#070913] via-[#04050A] to-[#04050A] py-12 lg:py-16"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
              {/* LEVA STRANA: NOĆNI KOMANDNI PANEL I TELEMETRIJA (5 KOLONA) */}
              <div className="flex flex-col justify-between rounded-3xl border border-amber-500/25 bg-[#090B14] p-6 sm:p-9 lg:col-span-5 shadow-2xl">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                      <Radio size={12} className="animate-pulse text-amber-400" /> Night Ops Telemetry
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">
                      Zone {currentZone.step}
                    </span>
                  </div>

                  <h1 className="mt-6 text-3xl font-black uppercase leading-[1.06] tracking-tight text-white sm:text-5xl">
                    {currentZone.title}
                  </h1>

                  <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {currentZone.subtitle}
                  </p>

                  {/* TELEMETRIJSKE KARTICE */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5 border-y border-white/10 py-4">
                    <div className="rounded-xl bg-[#04050A] p-3 border border-white/5">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        Altitude
                      </span>
                      <span className="mt-1 block text-xs font-black text-amber-300">
                        {currentZone.telemetry.altitude}
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#04050A] p-3 border border-white/5">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        Acoustics
                      </span>
                      <span className="mt-1 block text-xs font-black text-amber-300">
                        {currentZone.telemetry.acoustics}
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#04050A] p-3 border border-white/5">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                        Velocity
                      </span>
                      <span className="mt-1 block text-xs font-black text-amber-300">
                        {currentZone.telemetry.speed}
                      </span>
                    </div>
                  </div>

                  {/* VERTIKALNA LISTA 6 NOĆNIH ZONA */}
                  <div className="mt-5 space-y-2">
                    {KIT_CONFIG.bespokeCabins.map((z, idx) => {
                      const active = idx === activeZoneIndex;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => {
                            setHeroVideoMode(false);
                            setActiveZoneIndex(idx);
                          }}
                          className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-left transition cursor-pointer ${
                            active
                              ? 'border-amber-400 bg-amber-500/15 text-white shadow-md'
                              : 'border-white/10 bg-[#05070E] text-zinc-400 hover:border-amber-400/40 hover:text-white'
                          }`}
                        >
                          <span className="text-xs font-bold truncate pr-2">{z.zone}</span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 shrink-0">
                            {z.step}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* HERO DUGMAD */}
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <a
                    href="#commercial-pricing"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 px-5 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl shadow-amber-500/20 transition hover:brightness-110"
                  >
                    <DownloadCloud size={15} /> License Kit — ${agencyPrice}
                  </a>
                  <button
                    type="button"
                    onClick={handleDownloadSampleAndSpec}
                    className="flex items-center justify-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-3.5 text-xs font-black uppercase tracking-[0.14em] text-amber-200 transition hover:bg-amber-400 hover:text-black cursor-pointer"
                  >
                    Free Sample + .TXT ↗
                  </button>
                </div>
              </div>

              {/* DESNA STRANA: VELIKI PANORAMSKI VIEWPORT SA SLIKOM ILI 4K VIDEOM (7 KOLONA) */}
              <div className="relative flex min-h-[520px] lg:min-h-[680px] flex-col justify-between overflow-hidden rounded-3xl border border-amber-500/35 bg-black lg:col-span-7 shadow-2xl">
                {heroVideoMode ? (
                  <video
                    src={KIT_CONFIG.heroVideoUrl}
                    poster={currentZone.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={currentZone.image}
                    alt={currentZone.title}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#04050A] via-transparent to-black/40" />

                {/* Gornje kontrole na slici */}
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-6">
                  <span className="rounded-full border border-white/20 bg-black/75 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 backdrop-blur-md">
                    {currentZone.resolution}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroVideoMode(!heroVideoMode)}
                      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition cursor-pointer ${
                        heroVideoMode
                          ? 'border-amber-300 bg-amber-400 text-black'
                          : 'border-amber-400/40 bg-black/80 text-amber-300 hover:bg-amber-400/20'
                      }`}
                    >
                      <Video size={14} /> {heroVideoMode ? '4K Video Active' : '4K Video Mode'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomImage(currentZone.image)}
                      className="flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:border-amber-400 cursor-pointer"
                    >
                      <Maximize2 size={13} /> 150MP Zoom
                    </button>
                  </div>
                </div>

                {/* Donji opis materijala na slici */}
                <div className="relative z-10 p-6 sm:p-8">
                  <div className="rounded-2xl border border-amber-400/30 bg-[#04050A]/85 p-5 backdrop-blur-xl">
                    <span className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
                      Bespoke Nocturnal Specification
                    </span>
                    <p className="mt-1 text-sm font-bold text-white">{currentZone.materials}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. POTPUNO NOVA SEKCIJA NA STRANICI 4: NOCTURNAL TRANSOCEANIC ROUTE & SLEEP MATRIX */}
        <section id="night-corridors" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 border-b border-white/10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-amber-400">
                Red-Eye Executive Corridors • Zero Jet-Lag Pressurization
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Nocturnal Flight & Sleep Matrix
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-zinc-400">
              Select a flagship midnight corridor below to inspect the assigned stealth aircraft, overnight stateroom configuration, and all-inclusive dispatch estimate.
            </p>
          </div>

          {/* 4 ROUTE SELECTOR BUTTONS */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NOCTURNAL_ROUTES.map((route) => {
              const active = selectedRoute.id === route.id;
              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRoute(route)}
                  className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition cursor-pointer ${
                    active
                      ? 'border-amber-400 bg-gradient-to-b from-amber-500/20 to-[#090B14] shadow-xl shadow-amber-500/10'
                      : 'border-white/10 bg-[#090B14] hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black tracking-wider text-white">{route.code}</span>
                    <Clock3 size={16} className="text-amber-400" />
                  </div>
                  <p className="mt-2 text-xs font-bold text-amber-200">{route.corridor}</p>
                  <span className="mt-3 block text-[11px] text-zinc-400">{route.duration}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE ROUTE DUAL-IMAGE & TELEMETRY DISPLAY */}
          <div className="mt-8 grid grid-cols-1 gap-6 rounded-3xl border border-amber-400/30 bg-[#090B14] p-6 sm:p-8 lg:grid-cols-12">
            <div className="flex flex-col justify-between lg:col-span-4">
              <div>
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-amber-300">
                  {selectedRoute.distance}
                </span>
                <h3 className="mt-4 text-2xl font-black uppercase text-white">
                  {selectedRoute.corridor}
                </h3>
                <div className="mt-5 space-y-3 border-t border-white/10 pt-5 text-xs">
                  <div>
                    <span className="text-zinc-500 uppercase font-bold block">Departure Slot</span>
                    <span className="text-white font-bold text-sm">{selectedRoute.departure}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase font-bold block">Arrival Protocol</span>
                    <span className="text-white font-bold text-sm">{selectedRoute.arrival}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 uppercase font-bold block">Estimated Night Charter</span>
                    <span className="text-amber-300 font-black text-base">{selectedRoute.charterEstimate}</span>
                  </div>
                </div>
              </div>

              <a
                href="#ai-concierge"
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-xs font-black uppercase tracking-wider text-black transition hover:brightness-110"
              >
                Request {selectedRoute.code} Night Dispatch <ArrowRight size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-8">
              <div
                onClick={() => setZoomImage(selectedRoute.exteriorImg)}
                className="group relative h-64 sm:h-72 overflow-hidden rounded-2xl border border-white/10 cursor-pointer"
              >
                <img
                  src={selectedRoute.exteriorImg}
                  alt={selectedRoute.corridor}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-black uppercase tracking-wider text-white">
                  Assigned Night Flagship Exterior
                </span>
              </div>

              <div
                onClick={() => setZoomImage(selectedRoute.cabinImg)}
                className="group relative h-64 sm:h-72 overflow-hidden rounded-2xl border border-white/10 cursor-pointer"
              >
                <img
                  src={selectedRoute.cabinImg}
                  alt="Overnight Cabin Configuration"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-4 left-4 text-xs font-black uppercase tracking-wider text-amber-300">
                  41 dB Nocturnal Cabin Configuration
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 16:9 4K CINEMA VIDEO SHOWCASE SECTION */}
        <section id="cinema-reel" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-amber-400">
                16:9 Video Placeholder • Seedance 2.5 & Kling 4.0 Ready
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Midnight Cinema Flight Reel
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-zinc-400">
              Connected to your 4K twilight video stream with instant 150MP `.webp` nocturnal poster frames from `/public/jets/`.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl border border-amber-500/35 bg-[#090B14] shadow-2xl">
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    key={activeClip.id}
                    src={activeClip.videoUrl}
                    poster={activeClip.poster}
                    muted={isMuted}
                    loop
                    playsInline
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-amber-400/45 bg-black/80 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200">
                      {activeClip.duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full border border-amber-300/60 bg-amber-400/20 text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:bg-amber-400 hover:text-black cursor-pointer"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1 fill-current" />}
                  </button>

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white sm:text-xl">
                        {activeClip.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-zinc-300">{activeClip.caption}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full border border-white/20 bg-black/70 p-2.5 text-white hover:border-amber-400 cursor-pointer"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomImage(activeClip.poster)}
                        className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-amber-300 hover:border-amber-400 cursor-pointer"
                      >
                        Inspect 150MP Frame
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 lg:col-span-4">
              <div className="space-y-4">
                {VIDEO_CHAPTERS.map((clip) => {
                  const isCurrent = activeClip.id === clip.id;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        setActiveClip(clip);
                        setIsPlaying(false);
                      }}
                      className={`group flex gap-4 rounded-2xl border p-3.5 transition cursor-pointer ${
                        isCurrent
                          ? 'border-amber-400 bg-amber-500/15 shadow-lg shadow-amber-500/10'
                          : 'border-white/10 bg-[#090B14] hover:border-amber-400/40'
                      }`}
                    >
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={clip.poster}
                          alt={clip.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play size={16} className="text-amber-300 fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
                          {clip.duration}
                        </span>
                        <h4 className="mt-1 text-xs font-black uppercase text-white group-hover:text-amber-200">
                          {clip.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-[11px] text-zinc-400">
                          {clip.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-amber-400/25 bg-[#090B14] p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                  100% Verified Nocturnal Assets
                </span>
                <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                  Every night runway, stealth fuselage, and evening cabin visual is loaded directly from <code className="text-amber-300">/public/jets/</code>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. NOVI BENTO ASYMMETRIC MASONRY LOOKBOOK (SA ŠIROKIM ISTAKNUTIM KARTICAMA) */}
        <section id="bento-lookbook" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-amber-400">
                150MP Editorial Bento Archive (22 Nocturnal Visuals)
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Midnight Fleet & Cabin Lookbook
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-black'
                      : 'border border-white/15 bg-[#090B14] text-zinc-300 hover:border-amber-400/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredAssets.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setZoomImage(item.src)}
                className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[#090B14] transition hover:border-amber-400/60 cursor-pointer ${
                  item.featured && selectedCategory === 'All' ? 'sm:col-span-2' : 'col-span-1'
                }`}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04050A]/90 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-amber-300 backdrop-blur-md">
                    150MP RAW
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-400">
                    {item.zone}
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-white group-hover:text-amber-200">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. COMMERCIAL PRICING + $199 VIDEO ORDER BUMP + FREE B2B SAMPLE BOX (BEZ PSD FAJLOVA) */}
        <section id="commercial-pricing" className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
              <Crown size={13} className="text-amber-400" /> TURNKEY PRIVATE AVIATION BRAND KIT
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
              A complete private jet brand, <br />
              ready to take off.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Launch faster with the complete React + Tailwind JSX source code (including the Split-Screen Flight Deck Hero & 16:9 Video Player), 60 production visuals (up to 150MP), and commercial licensing.
            </p>
          </div>

          {/* +$199 VIDEO MOTION PACK ORDER BUMP BOKS */}
          <div className="mx-auto mt-10 max-w-3xl">
            <label
              onClick={() => setIncludeMotionPack(!includeMotionPack)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition cursor-pointer select-none ${
                includeMotionPack
                  ? 'border-emerald-400 bg-emerald-950/25 shadow-lg shadow-emerald-500/10'
                  : 'border-amber-400/45 bg-[#090B14] hover:border-amber-400'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <input
                  type="checkbox"
                  checked={includeMotionPack}
                  onChange={(e) => setIncludeMotionPack(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 sm:mt-0 h-5 w-5 rounded border-zinc-500 accent-amber-400 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    <Zap size={14} className="text-amber-400 fill-current shrink-0" />
                    <span>ADD 30S 4K/60FPS CINEMA MOTION PACK (SEEDANCE 2.5 & KLING 4.0)</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-300">
                    Includes seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut.
                  </p>
                </div>
              </div>

              <span className="shrink-0 self-start sm:self-center rounded-full bg-emerald-400/20 border border-emerald-400/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                +$199 ORDER BUMP
              </span>
            </label>
          </div>

          {/* 2 PRICING KARTICE ($349 / $548 AGENCY LICENSE & $1490 / $1689 EXCLUSIVE BUYOUT) */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* LEFT CARD: MULTI-CLIENT AGENCY LICENSE */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#090B14] p-8 shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300">
                    MULTI-CLIENT AGENCY LICENSE
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-200">
                    INSTANT ZIP
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white">${agencyPrice}</span>
                  {includeMotionPack && (
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Includes +$199 Motion Pack
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                  For agencies, developers, and private aviation teams building a polished high-ticket digital presence.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Complete Midnight Altitude React + Tailwind JSX source (with Split-Deck Hero)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>60 production files: 20 WebP, 20 4K UHD & 20 150MP masters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Ready-to-import Railway n8n + Groq AI Flight Desk JSON workflow</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>sRGB IEC61966-2.1 color-calibrated large-format print & web deliverables</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Commercial license for unlimited client websites & print</span>
                  </li>
                  {includeMotionPack && (
                    <li className="flex items-start gap-3 text-emerald-300 font-bold">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>INCLUDED: 30s 4K/60fps Cinema Motion Pack (WebM + MP4 + 9:16 Reels)</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    handlePurchaseTier(
                      'Midnight Altitude — Agency Turnkey Kit',
                      agencyPrice,
                      KIT_CONFIG.standardZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl transition hover:bg-zinc-200 cursor-pointer"
                >
                  <DownloadCloud size={15} /> LICENSE AGENCY KIT — ${agencyPrice}
                </button>
              </div>
            </div>

            {/* RIGHT CARD: 1-OF-1 EXCLUSIVE BUYOUT */}
            <div className="flex flex-col justify-between rounded-3xl border border-amber-400/65 bg-[#090B14] p-8 shadow-2xl shadow-amber-500/10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    1-OF-1 EXCLUSIVE BUYOUT
                  </span>
                  <span className="rounded-full bg-amber-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-black">
                    SINGLE BUYER ONLY
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-amber-300">${buyoutPrice}</span>
                  {includeMotionPack && (
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Includes +$199 Motion Pack
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-zinc-300">
                  Exclusive ownership for a brand that wants permanent removal from our store and full IP transfer.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>All 60 WebP, 4K UHD and 150MP master files + permanent store removal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>10 custom 150MP renders tailored to your brand palette</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>Private Jet Prompt Engine ruleset for internal expansion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>Signed enterprise IP transfer certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-amber-400" />
                    <span>Custom Railway n8n AI Concierge & CRM deployment support</span>
                  </li>
                  {includeMotionPack && (
                    <li className="flex items-start gap-3 text-emerald-300 font-bold">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                      <span>INCLUDED: 30s 4K/60fps Cinema Motion Pack (WebM + MP4 + 9:16 Reels)</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    handlePurchaseTier(
                      'Midnight Altitude — Exclusive Buyout Rights',
                      buyoutPrice,
                      KIT_CONFIG.buyoutZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl shadow-amber-500/20 transition hover:brightness-110 cursor-pointer"
                >
                  <Lock size={14} /> ACQUIRE EXCLUSIVE RIGHTS — ${buyoutPrice}
                </button>
              </div>
            </div>
          </div>

          {/* HORIZONTALNI BOKS ISPOD KARTICA ("Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)") */}
          <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-amber-400/35 bg-[#090B14] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/35 bg-amber-500/10 text-amber-300">
                  <FolderArchive size={20} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-amber-400">
                    FREE B2B INSPECTION SAMPLE • INSTANT ACCESS
                  </span>
                  <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
                    Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-zinc-300">
                    Inspect our full-resolution sample images alongside the complete <code className="text-amber-300">.txt</code> architecture, ICC color profile, and commercial licensing explanation before purchasing.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSampleAndSpec}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-amber-400/50 bg-amber-500/10 px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-amber-200 transition hover:bg-amber-400 hover:text-black cursor-pointer"
              >
                <DownloadCloud size={15} /> DOWNLOAD FREE SAMPLE + .TXT <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* 6. 24/7 AI MIDNIGHT & CHARTER CONCIERGE (RAILWAY N8N WEBHOOK) */}
        <section id="ai-concierge" className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 rounded-3xl border border-amber-400/35 bg-[#090B14] p-6 sm:p-12 lg:grid-cols-12 shadow-2xl">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-amber-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Railway n8n + Groq AI
              </span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white sm:text-4xl">
                24/7 Nocturnal AI Flight Desk
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-zinc-300">
                Connected directly to <code className="text-amber-300">n8n-production-720dcf20.up.railway.app</code>. Test live red-eye charter inquiries, stealth fleet requests, or white-label kit questions right now.
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-zinc-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400" />
                  <span>Active Zone: {currentZone.zone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-400" />
                  <span>Selected Corridor: {selectedRoute.corridor}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#04050A] p-5 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 border-b border-white/10 pb-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name / Family Office"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#0B0E1A] px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Direct VIP Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#0B0E1A] px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
                <input
                  type="date"
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
                <select
                  value={flightSlot}
                  onChange={(e) => setFlightSlot(e.target.value)}
                  className="rounded-xl border border-white/15 bg-black/50 px-4 py-2.5 text-xs font-bold text-amber-200 focus:border-emerald-400 focus:outline-none"
                >
                  <option value="10:00 CET" className="bg-black text-white">Calendar Slot: 10:00 CET</option>
                  <option value="12:00 CET" className="bg-black text-white">Calendar Slot: 12:00 CET</option>
                  <option value="14:00 CET" className="bg-black text-white">Calendar Slot: 14:00 CET</option>
                  <option value="16:30 CET" className="bg-black text-white">Calendar Slot: 16:30 CET</option>
                  <option value="18:00 CET" className="bg-black text-white">Calendar Slot: 18:00 CET</option>
                </select>
              </div>

              <div className="my-4 h-64 space-y-3 overflow-y-auto pr-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-amber-400 font-bold text-black'
                          : 'border border-amber-400/25 bg-[#0B0E1A] text-zinc-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="text-xs italic text-amber-300">
                    Nocturnal AI Flight Desk is computing your response...
                  </div>
                )}
              </div>

              <form onSubmit={handleConciergeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about GVA-TEB night charter rates, matte-black livery, or $349 kit license..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-[#0B0E1A] px-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-amber-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:brightness-110 cursor-pointer"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 7. EXECUTIVE FAQ — "Good to know." (BEZ POMINJANJA PSD FAJLOVA) */}
        <section id="executive-faq" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 border-t border-white/10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-amber-400">
                EXECUTIVE FAQ
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Good to know.
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-zinc-400">
                Technical specifications, licensing terms, and AI workflow details for creative directors and aviation charter operators.
              </p>
              <button
                type="button"
                onClick={() => navigate('/stock')}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-amber-200 transition hover:bg-amber-400 hover:text-black cursor-pointer"
              >
                Explore All Stock Vaults <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="lg:col-span-8 divide-y divide-white/10 border-t border-b border-white/10">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div key={idx} className="py-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                    >
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-white sm:text-sm">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 text-amber-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                        {item.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER SA ISTAKNUTIM LINKOM KA STOCK VAULTS */}
      <footer className="border-t border-white/15 bg-[#030408] px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-black">
              <Moon size={15} />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-white">
                Midnight Altitude
              </span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-amber-400">
                Nocturnal Private Aviation • Page 4 of 5
              </span>
            </span>
          </div>
          <p className="text-xs font-medium text-zinc-300">
            Command the night sky with zero commercial terminal exposure.
          </p>
          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-amber-200 transition hover:bg-amber-400 hover:text-black cursor-pointer"
          >
            Back to Stock Vaults <ArrowRight size={13} />
          </button>
        </div>
      </footer>

      {/* MODALS */}
      <LoginRequiredModal
        isOpen={loginModal.isOpen}
        onClose={() => setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })}
        packageName={loginModal.tierName}
        price={loginModal.price}
        onLoginSuccess={async (user) => {
          await recordOrderIntent(user, loginModal.tierName, loginModal.price);
          setCheckoutData({
            isOpen: true,
            name: loginModal.tierName,
            price: loginModal.price,
            zipLink: loginModal.zipLink
          });
          setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });
        }}
      />

      <LightboxInspector imageUrl={zoomImage} onClose={() => setZoomImage(null)} />

      <AnimatePresence>
        {checkoutData.isOpen && (
          <V8SecureCheckout
            isOpen={checkoutData.isOpen}
            onClose={() =>
              setCheckoutData({ isOpen: false, name: '', price: '0.00', zipLink: '' })
            }
            packageName={checkoutData.name}
            price={checkoutData.price}
            zipLink={checkoutData.zipLink}
          />
        )}
      </AnimatePresence>

      {/* FLOATING NAVIGATION (STRANICA 4 OD 5) */}
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full border border-amber-400/40 bg-black/90 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur-md transition hover:border-amber-400 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-black transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-500 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-black shadow-2xl transition hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-amber-300 transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default MidnightAltitude;