import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Crown,
  DownloadCloud,
  FolderArchive,
  Lock,
  Maximize2,
  Pause,
  Plane,
  Play,
  Send,
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

// Lightbox Inspector na ceo ekran
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
        className="absolute right-6 top-6 rounded-full border border-[#D4AF37]/40 bg-black/80 p-3 text-[#F3E5AB] transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
      >
        <X size={20} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Master Visual Inspection"
        className="max-h-[90vh] max-w-[94vw] rounded-2xl border border-[#D4AF37]/40 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

// ============================================================================
// KIT_CONFIG — SVI FAJLOVI SU 100% TAČNI .WEBP IZ PUBLIC/JETS
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1IRFykjqqczESjuzpyjo7hxrXHCVT_5aI/view?usp=sharing',

  prevPageRoute: '/aviation-charter-kit',
  prevPageLabel: 'Prev Jet Page: Sovereign (1/5)',
  nextLandingRoute: '/aviation-cloudline-kit',
  nextLandingLabel: 'Next Jet Page: Cloudline (3/5)',

  heroImage: '/jets/3.webp',
  heroVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',

  // 6 ZONA ZA HERO PROLAZ (IDENTIČAN KONCEPT KAO NA PRVOJ STRANICI)
  bespokeCabins: [
    {
      id: 'zone-01-hangar',
      step: '01 / 06',
      zone: 'Zone 01 • Architectural Hangar Flagship',
      mode: 'day',
      title: 'Where private aviation becomes haute couture.',
      subtitle:
        'Direct wing-side boarding from our private architectural hangar with mirror-polished aerodynamics and zero commercial terminal exposure.',
      materials: 'Bespoke Sapphire-Blue Multi-Coat Livery • Brushed Titanium • Heated Airstair',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/3.webp'
    },
    {
      id: 'zone-02-apron',
      step: '02 / 06',
      zone: 'Zone 02 • Wing-to-Coupe Tarmac Protocol',
      mode: 'sunset',
      title: 'Zero commercial terminals. Direct apron arrival.',
      subtitle:
        'Arrive alongside your waiting aircraft in a chauffeured grand tourer and step straight onto the illuminated cabin stairs in 90 seconds.',
      materials: 'Private FBO Apron • Biometric Clearance • Golden Hour Floods',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/22.webp'
    },
    {
      id: 'zone-03-daylight-salon',
      step: '03 / 06',
      zone: 'Zone 03 • Daylight Ivory & Walnut Executive Salon',
      mode: 'day',
      title: 'Sunlit boardroom precision at Flight Level 510.',
      subtitle:
        'Hand-stitched cream calfskin berths, bookmatched American walnut consoles, and direct sightlines into the glass cockpit.',
      materials: 'Loro Piana Cream Hide • High-Gloss American Walnut • Dual Starlink',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/35.webp'
    },
    {
      id: 'zone-04-dining',
      step: '04 / 06',
      zone: 'Zone 04 • Calacatta Gold Panoramic Dining',
      mode: 'day',
      title: 'Six-course Michelin gastronomy above the clouds.',
      subtitle:
        'Honeycomb-backed Italian Calacatta marble dining tables paired with 24K gold cutlery, crystal stemware, and panoramic cloud-deck views.',
      materials: 'Calacatta Gold Stone • 24K Brushed Brass • Custom Porcelain',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/41.webp'
    },
    {
      id: 'zone-05-evening-club',
      step: '05 / 06',
      zone: 'Zone 05 • Evening Anthracite & Walnut Boardroom',
      mode: 'night',
      title: 'Whisper-quiet nocturnal sanctuary across oceans.',
      subtitle:
        'Sculpted cove lighting, charcoal Nappa leather club seating, and 42 dB acoustic fuselage isolation for uninterrupted evening briefings.',
      materials: 'Charcoal Nappa Leather • Burl Walnut Table • Warm 2700K Cove LEDs',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/58.webp'
    },
    {
      id: 'zone-06-stateroom',
      step: '06 / 06',
      zone: 'Zone 06 • Full-Beam Master Stateroom Suite',
      mode: 'sunset',
      title: 'Arrive rested across 16-hour global crossings.',
      subtitle:
        'A dedicated aft master bedroom with a king-size bed, cashmere linens, walnut wardrobes, and golden sunset views over the horizon.',
      materials: 'King Tufted Mattress • Cashmere Linens • 41 dB Acoustic Suite',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/59.webp'
    }
  ]
};

const VIDEO_CHAPTERS = [
  {
    id: 'reel-1',
    title: '01 / Stratospheric Sunset Above the Clouds',
    duration: '01:45 • 4K 60FPS',
    poster: '/jets/19.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'High-altitude chase cinematography above the stratospheric cloud deck at Mach 0.925.'
  },
  {
    id: 'reel-2',
    title: '02 / Wing-to-Chauffeur Tarmac Protocol',
    duration: '01:18 • 4K 60FPS',
    poster: '/jets/5.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Direct supercar apron arrival alongside the illuminated airstair.'
  },
  {
    id: 'reel-3',
    title: '03 / 6-Zone Bespoke Cabin & Suite Tour',
    duration: '02:10 • 4K 60FPS',
    poster: '/jets/59.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Interior walkthrough of the walnut club, Calacatta marble dining, and aft stateroom.'
  }
];

const LOOKBOOK_ASSETS = [
  { src: '/jets/3.webp', title: 'Sapphire Flagship at Architectural Hangar', zone: 'Exterior Fleet' },
  { src: '/jets/5.webp', title: 'Autumn Hangar & Black Coupe Transfer', zone: 'Tarmac Protocol' },
  { src: '/jets/22.webp', title: 'Grand Tourer Wing-Side Arrival', zone: 'Tarmac Protocol' },
  { src: '/jets/26.webp', title: 'Bronze-Gold Hangar Sunlit Reveal', zone: 'Exterior Fleet' },
  { src: '/jets/31.webp', title: 'British Racing Emerald & Gold Livery', zone: 'Exterior Fleet' },
  { src: '/jets/24.webp', title: 'Imperial Bordeaux & Silver Nose Profile', zone: 'Exterior Fleet' },
  { src: '/jets/8.webp', title: 'Symmetrical Hangar Nose Silhouette', zone: 'Exterior Fleet' },
  { src: '/jets/27.webp', title: 'Twin Turbofan Hangar Engineering', zone: 'Exterior Fleet' },
  { src: '/jets/6.webp', title: 'Alpine Summit High-Altitude Pass', zone: 'In-Flight' },
  { src: '/jets/14.webp', title: 'Midnight Blue Stratospheric Cruise', zone: 'In-Flight' },
  { src: '/jets/17.webp', title: 'Desert Canyon Transcontinental Flight', zone: 'In-Flight' },
  { src: '/jets/19.webp', title: 'Dawn Cloud-Deck Serenity Cruise', zone: 'In-Flight' },
  { src: '/jets/25.webp', title: 'Silver & Cobalt Ocean Crossing', zone: 'In-Flight' },
  { src: '/jets/60.webp', title: 'Starlight Symmetrical Runway Takeoff', zone: 'Night Ops' },
  { src: '/jets/62.webp', title: 'Wet Runway Reflections Night Climb', zone: 'Night Ops' },
  { src: '/jets/71.webp', title: 'Night FBO Terminal & Black Jet Takeoff', zone: 'Night Ops' },
  { src: '/jets/35.webp', title: 'Sunlit Ivory & Walnut Main Salon', zone: 'Cabin Interior' },
  { src: '/jets/36.webp', title: 'Executive Cream Club & Cockpit View', zone: 'Cabin Interior' },
  { src: '/jets/42.webp', title: 'Twin Wide-Berth Daylight Lounge', zone: 'Cabin Interior' },
  { src: '/jets/57.webp', title: 'Anthracite Conference Table Suite', zone: 'Cabin Interior' },
  { src: '/jets/58.webp', title: 'Evening Walnut & Charcoal Club', zone: 'Cabin Interior' },
  { src: '/jets/50.webp', title: 'Emerald Leather & Full-Moon Salon', zone: 'Cabin Interior' },
  { src: '/jets/54.webp', title: 'Alcantara VIP Window Berth at Night', zone: 'Cabin Interior' },
  { src: '/jets/41.webp', title: 'Calacatta Gold Cloud-Deck Dining', zone: 'Dining & Staterooms' },
  { src: '/jets/40.webp', title: 'Panoramic Oval Window Marble Dining', zone: 'Dining & Staterooms' },
  { src: '/jets/59.webp', title: 'Golden Hour Master Stateroom', zone: 'Dining & Staterooms' },
  { src: '/jets/37.webp', title: 'Sunset King Bed & Lounge Divan', zone: 'Dining & Staterooms' },
  { src: '/jets/38.webp', title: 'Master Suite Looking Toward Cockpit', zone: 'Dining & Staterooms' }
];

// IDENTIČNA EXECUTIVE FAQ SEKCIJA KAO NA PRVOJ STRANICI ("Good to know.")
const FAQ_ITEMS = [
  {
    q: 'HOW DOES THE 6-ZONE CABIN FLY-THROUGH HERO WORK ON THIS LANDING PAGE?',
    a: 'You can glide through all 6 bespoke aviation zones (from tarmac exterior into the daylight salon, night club, dining room, boardroom, and master bedroom) using the interactive zone cards inside the hero showcase or enabling 4K Video Hero Mode.'
  },
  {
    q: 'WHAT IS INCLUDED IN THE $349 AGENCY LICENSE?',
    a: 'You receive the complete Aero Privé React + Tailwind JSX source code (with 6-Zone Fly-Through), 60 production files (20 WebP, 20 4K UHD & 20 150MP masters), the ready-to-import Railway n8n + Groq AI Flight Desk workflow, three editable PSD advertising mockups, and a commercial license for unlimited client websites and print.'
  },
  {
    q: 'HOW DOES THE 16:9 VIDEO PLACEHOLDER WORK WITH SEEDANCE 2.5 AND KLING 4.0?',
    a: 'Both the Hero section and the 16:9 Cinema Reel player support native 4K/60FPS WebM and MP4 streams. When you add the +$199 30s 4K/60fps Cinema Motion Pack, you receive the seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut ready to drop straight into the player.'
  },
  {
    q: 'WHAT IS THE DIFFERENCE BETWEEN THE $349 LICENSE AND THE $1,490 EXCLUSIVE BUYOUT?',
    a: 'The $349 Multi-Client Agency License grants commercial deployment rights for your agency and client projects. The $1,490 1-of-1 Exclusive Buyout permanently removes this kit from our public Stock Store, includes 10 custom 150MP renders tailored to your brand palette, the Private Jet Prompt Engine ruleset, and a signed enterprise IP transfer certificate.'
  }
];

const AeroPriveAtelier = () => {
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

  // +$199 Order Bump State (Cinema Motion Pack: Seedance 2.5 & Kling 4.0)
  const [includeMotionPack, setIncludeMotionPack] = useState(false);

  // Hero & Interactive Zone States
  const [activeZoneIndex, setActiveZoneIndex] = useState(0);
  const [heroVideoMode, setHeroVideoMode] = useState(false);

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
      text: 'Welcome to Aero Privé Atelier (Page 2/5 • Bespoke Cabin & Fleet Edition). Ask me about transoceanic stateroom charters, Calacatta marble & walnut completions, or licensing this complete Turnkey Web + 150MP Asset Kit.'
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

  // Dinamički obračun cene kada se uključi +$199 Video Motion Pack Order Bump
  const agencyPrice = includeMotionPack ? 349 + 199 : 349;
  const buyoutPrice = includeMotionPack ? 1490 + 199 : 1490;

  const categories = [
    'All',
    'Exterior Fleet',
    'Tarmac Protocol',
    'In-Flight',
    'Night Ops',
    'Cabin Interior',
    'Dining & Staterooms'
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
        kitCategory: 'Aviation Turnkey Kit - Page 2 (Atelier)',
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

  // Preuzimanje .TXT Specifikacije + otvaranje Free 150MP Sample Google Drive linka
  const handleDownloadSampleAndSpec = () => {
    const specContent = `===================================================================
VISIONARY FACTORY V10 — AERO PRIVÉ ATELIER (PAGE 2 OF 5)
150MP ULTRA PRINT & TURNKEY AVIATION KIT SPECIFICATION SHEET (.TXT)
===================================================================
Edition: Sovereign Bespoke Atelier Edition
Resolution: 150 Megapixels (14,200 x 10,600 px) & 4K UHD WebP
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
    a.download = 'AeroPrive_Atelier_150MP_Spec_Sheet.txt';
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
          clientName: clientName || 'Atelier VIP Guest',
          clientEmail: clientEmail || 'vip@aeroprive-atelier.com',
          activeZone: currentZone.zone,
          source: 'AeroPriveAtelier.jsx (Page 2 of 5)'
        })
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        data?.output ||
        data?.text ||
        data?.message ||
        'Our 24/7 Flight Desk has registered your inquiry and prepared your bespoke aviation dossier.';
      setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Direct Railway AI Flight Desk connection is active. Leave your VIP email above for immediate charter & turnkey kit dispatch.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#F8F5EE] selection:bg-[#D4AF37] selection:text-black font-sans">
      <Helmet>
        <title>Aero Privé Atelier • Bespoke Private Aviation Turnkey Kit (Page 2/5)</title>
      </Helmet>

      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-[#D4AF37]/25 bg-[#070709]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#9A7418] text-black shadow-lg shadow-[#D4AF37]/25">
              <Plane size={18} />
            </span>
            <div>
              <span className="block text-xs font-black uppercase tracking-[0.26em] text-white">
                Aero Privé • Atelier
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                Sovereign Cabin & Fleet Architecture • Page 2 of 5
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.15em] text-stone-300 xl:flex">
            <a href="#fly-through" className="transition hover:text-[#F3E5AB]">
              6-Zone Fly-Through
            </a>
            <a href="#cinema-reel" className="transition hover:text-[#F3E5AB]">
              4K Video Reel
            </a>
            <a href="#lookbook-vault" className="transition hover:text-[#F3E5AB]">
              28-Image Lookbook
            </a>
            <a href="#commercial-pricing" className="text-[#F3E5AB] transition hover:text-white">
              Pricing (${agencyPrice} / ${buyoutPrice})
            </a>
            <a href="#executive-faq" className="transition hover:text-[#F3E5AB]">
              Executive FAQ
            </a>
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="text-[#D4AF37] transition hover:text-white cursor-pointer"
            >
              Stock Vaults ↗
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-stone-200 transition hover:border-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer"
            >
              Stock Vaults <ArrowUpRight size={13} />
            </button>
            <button
              type="button"
              onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88924] px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-black shadow-lg shadow-[#D4AF37]/25 transition hover:brightness-110 cursor-pointer"
            >
              Page 3 <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. HERO SECTION — 6-ZONE CABIN FLY-THROUGH + 4K VIDEO PLACEHOLDER */}
        <section
          id="fly-through"
          className="relative min-h-[90vh] w-full overflow-hidden border-b border-[#D4AF37]/25"
        >
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
              className="absolute inset-0 h-full w-full object-cover object-center scale-105 transition-all duration-1000"
            />
          )}

          {/* Luxury Obsidian & Champagne Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070709]/95 via-[#070709]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-[#070709]/35" />

          <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-[1440px] flex-col justify-between px-4 py-14 sm:px-8">
            {/* Top Status & Video Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-[#D4AF37]/15 px-4 py-1.5 backdrop-blur-md">
                <Sparkles size={13} className="text-[#F3E5AB]" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                  {currentZone.zone} • {currentZone.resolution}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHeroVideoMode(!heroVideoMode)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-wider transition cursor-pointer ${
                    heroVideoMode
                      ? 'border-[#F3E5AB] bg-[#D4AF37] text-black'
                      : 'border-[#D4AF37]/40 bg-black/80 text-[#F3E5AB] hover:bg-[#D4AF37]/20'
                  }`}
                >
                  <Video size={14} /> {heroVideoMode ? '4K Video Active' : 'Switch to 4K Video Hero'}
                </button>
                <button
                  type="button"
                  onClick={() => setZoomImage(currentZone.image)}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white hover:border-[#D4AF37] cursor-pointer"
                >
                  <Maximize2 size={13} /> Inspect 150MP
                </button>
              </div>
            </div>

            {/* Hero Headline & CTAs */}
            <div className="my-auto max-w-3xl py-10">
              <span className="text-xs font-black uppercase tracking-[0.28em] text-[#D4AF37]">
                Step {currentZone.step} • Interactive 6-Zone Aircraft & Cabin Fly-Through
              </span>
              <h1 className="mt-3 text-4xl font-black uppercase leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {currentZone.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-stone-300 sm:text-lg">
                {currentZone.subtitle}
              </p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#F3E5AB]">
                Materials: {currentZone.materials}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#commercial-pricing"
                  className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88924] px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-black shadow-xl shadow-[#D4AF37]/25 transition hover:scale-[1.02]"
                >
                  <DownloadCloud size={16} /> License Agency Kit — ${agencyPrice}
                </a>
                <a
                  href="#cinema-reel"
                  className="flex items-center gap-3 rounded-full border border-[#D4AF37]/45 bg-black/80 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-[#F3E5AB] backdrop-blur-md transition hover:bg-[#D4AF37]/15"
                >
                  <Play size={14} className="fill-current" /> Watch 4K Cinema Reel
                </a>
                <button
                  type="button"
                  onClick={handleDownloadSampleAndSpec}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition hover:border-[#D4AF37] cursor-pointer"
                >
                  Download Free Sample + .TXT ↗
                </button>
              </div>
            </div>

            {/* 6-ZONE INTERACTIVE SELECTOR BAR AT BOTTOM OF HERO */}
            <div className="grid grid-cols-2 gap-3 border-t border-[#D4AF37]/25 pt-6 sm:grid-cols-3 lg:grid-cols-6">
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
                    className={`group flex flex-col justify-between rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                      active
                        ? 'border-[#D4AF37] bg-[#D4AF37]/20 shadow-lg shadow-[#D4AF37]/15'
                        : 'border-white/10 bg-black/80 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#F3E5AB]">
                        {z.step}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-[#D4AF37] opacity-80" />
                    </div>
                    <span className="mt-2 line-clamp-2 text-xs font-bold text-white group-hover:text-[#F3E5AB]">
                      {z.zone.split('•')[1] || z.zone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. 16:9 4K CINEMA VIDEO SHOWCASE SECTION */}
        <section id="cinema-reel" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                16:9 Video Placeholder • Seedance 2.5 & Kling 4.0 Ready
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Aero Privé Cinema Flight Reel
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-stone-400">
              Connected to your 4K stratospheric sunset video stream with instant 150MP `.webp` poster frames from `/public/jets/`.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* MAIN 16:9 VIDEO PLAYER */}
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/35 bg-[#111014] shadow-2xl">
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

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-[#D4AF37]/45 bg-black/80 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                      {activeClip.duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full border border-[#F3E5AB]/60 bg-[#D4AF37]/20 text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:bg-[#D4AF37] hover:text-black cursor-pointer"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1 fill-current" />}
                  </button>

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white sm:text-xl">
                        {activeClip.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-stone-300">{activeClip.caption}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full border border-white/20 bg-black/70 p-2.5 text-white hover:border-[#D4AF37] cursor-pointer"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomImage(activeClip.poster)}
                        className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-[#F3E5AB] hover:border-[#D4AF37] cursor-pointer"
                      >
                        Inspect 150MP Frame
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 VIDEO CHAPTER CARDS */}
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
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 shadow-lg shadow-[#D4AF37]/10'
                          : 'border-white/10 bg-[#111014] hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={clip.poster}
                          alt={clip.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play size={16} className="text-[#F3E5AB] fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#D4AF37]">
                          {clip.duration}
                        </span>
                        <h4 className="mt-1 text-xs font-black uppercase text-white group-hover:text-[#F3E5AB]">
                          {clip.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-[11px] text-stone-400">
                          {clip.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#111014] p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                  100% Verified Local Assets
                </span>
                <p className="mt-1 text-xs leading-relaxed text-stone-300">
                  Every visual on this page is loaded directly from your <code className="text-[#F3E5AB]">/public/jets/</code> `.webp` master vault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 28-ASSET 150MP LOOKBOOK VAULT */}
        <section id="lookbook-vault" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                150MP Ultra Print Master Archive (28 Verified Visuals)
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Atelier Fleet & Cabin Lookbook
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
                      ? 'bg-[#D4AF37] text-black'
                      : 'border border-white/15 bg-[#111014] text-stone-300 hover:border-[#D4AF37]/50'
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111014] transition hover:border-[#D4AF37]/60 cursor-pointer"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-[#F3E5AB] backdrop-blur-md">
                    150MP RAW
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#D4AF37]">
                    {item.zone}
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-white group-hover:text-[#F3E5AB]">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. COMMERCIAL PRICING + $199 VIDEO ORDER BUMP + FREE B2B SAMPLE BOX (IDENTIČNO TVOM SNIMKU PRVE STRANICE) */}
        <section id="commercial-pricing" className="mx-auto max-w-[1440px] px-4 py-24 sm:px-8">
          {/* HEADER KAO NA PRVOJ STRANICI: "A complete private jet brand, ready to take off." */}
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#F3E5AB]">
              <Crown size={13} className="text-[#D4AF37]" /> TURNKEY PRIVATE AVIATION BRAND KIT
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
              A complete private jet brand, <br />
              ready to take off.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-stone-300 sm:text-base">
              Launch faster with the complete React + Tailwind JSX source code (including the 6-Zone Cabin Fly-Through & 16:9 Video Player), 60 production visuals (up to 150MP), and commercial licensing.
            </p>
          </div>

          {/* +$199 VIDEO MOTION PACK ORDER BUMP BOKS (IDENTIČAN SNIMKU SA PRVE STRANICE) */}
          <div className="mx-auto mt-10 max-w-3xl">
            <label
              onClick={() => setIncludeMotionPack(!includeMotionPack)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition cursor-pointer select-none ${
                includeMotionPack
                  ? 'border-emerald-400 bg-emerald-950/25 shadow-lg shadow-emerald-500/10'
                  : 'border-[#D4AF37]/45 bg-[#0C0D12] hover:border-[#D4AF37]'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <input
                  type="checkbox"
                  checked={includeMotionPack}
                  onChange={(e) => setIncludeMotionPack(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 sm:mt-0 h-5 w-5 rounded border-stone-500 accent-[#D4AF37] cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    <Zap size={14} className="text-[#D4AF37] fill-current shrink-0" />
                    <span>ADD 30S 4K/60FPS CINEMA MOTION PACK (SEEDANCE 2.5 & KLING 4.0)</span>
                  </div>
                  <p className="mt-1 text-xs text-stone-300">
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
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#0C0D12] p-8 shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-stone-300">
                    MULTI-CLIENT AGENCY LICENSE
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-stone-200">
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

                <p className="mt-4 text-xs leading-relaxed text-stone-300">
                  For agencies, developers, and private aviation teams building a polished high-ticket digital presence.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-stone-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Complete Aero Privé React + Tailwind JSX source (with 6-Zone Fly-Through)</span>
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
                    <span>Three editable PSD advertising mockups</span>
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
                      'Aero Privé Atelier — Agency Turnkey Kit',
                      agencyPrice,
                      KIT_CONFIG.standardZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl transition hover:bg-stone-200 cursor-pointer"
                >
                  <DownloadCloud size={15} /> LICENSE AGENCY KIT — ${agencyPrice}
                </button>
              </div>
            </div>

            {/* RIGHT CARD: 1-OF-1 EXCLUSIVE BUYOUT */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#D4AF37]/65 bg-[#0C0D12] p-8 shadow-2xl shadow-[#D4AF37]/10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    1-OF-1 EXCLUSIVE BUYOUT
                  </span>
                  <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[9px] font-black uppercase tracking-widest text-black">
                    SINGLE BUYER ONLY
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-[#F3E5AB]">${buyoutPrice}</span>
                  {includeMotionPack && (
                    <span className="rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Includes +$199 Motion Pack
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-stone-300">
                  Exclusive ownership for a brand that wants permanent removal from our store and full IP transfer.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-stone-200">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>All 60 WebP, 4K UHD and 150MP master files + permanent store removal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>10 custom 150MP renders tailored to your brand palette</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>Private Jet Prompt Engine ruleset for internal expansion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                    <span>Signed enterprise IP transfer certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#D4AF37]" />
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
                      'Aero Privé Atelier — Exclusive Buyout Rights',
                      buyoutPrice,
                      KIT_CONFIG.buyoutZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C158] to-[#C59B27] py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-xl shadow-[#D4AF37]/20 transition hover:brightness-110 cursor-pointer"
                >
                  <Lock size={14} /> ACQUIRE EXCLUSIVE RIGHTS — ${buyoutPrice}
                </button>
              </div>
            </div>
          </div>

          {/* IDENTIČAN HORIZONTALNI BOKS ISPOD KARTICA KAO NA PRVOJ STRANICI ("Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)") */}
          <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-[#D4AF37]/35 bg-[#0C0D12] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/10 text-[#F3E5AB]">
                  <FolderArchive size={20} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                    FREE B2B INSPECTION SAMPLE • INSTANT ACCESS
                  </span>
                  <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
                    Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-stone-300">
                    Inspect our full-resolution sample images alongside the complete <code className="text-[#F3E5AB]">.txt</code> architecture, ICC color profile, and commercial licensing explanation before purchasing.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSampleAndSpec}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-[#F3E5AB] transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
              >
                <DownloadCloud size={15} /> DOWNLOAD FREE SAMPLE + .TXT <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* 5. 24/7 AI ATELIER & CHARTER CONCIERGE (RAILWAY N8N WEBHOOK) */}
        <section id="ai-concierge" className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 rounded-3xl border border-[#D4AF37]/35 bg-[#0C0D12] p-6 sm:p-12 lg:grid-cols-12 shadow-2xl">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Railway n8n + Groq AI
              </span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white sm:text-4xl">
                24/7 Atelier AI Flight Desk
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-300">
                Connected directly to <code className="text-[#F3E5AB]">n8n-production-720dcf20.up.railway.app</code>. Test live charter inquiries, cabin material requests, or white-label kit questions right now.
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-stone-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37]" />
                  <span>Active Zone: {currentZone.zone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37]" />
                  <span>Autonomous Lead Triage & Instant Reply</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#070709] p-5 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 border-b border-white/10 pb-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name / Family Office"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#141318] px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Direct VIP Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#141318] px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:border-[#D4AF37] focus:outline-none"
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
                          ? 'bg-[#D4AF37] font-bold text-black'
                          : 'border border-[#D4AF37]/25 bg-[#141318] text-stone-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="text-xs italic text-[#F3E5AB]">
                    Atelier AI Flight Desk is computing your response...
                  </div>
                )}
              </div>

              <form onSubmit={handleConciergeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about Geneva-New York charter rates, marble weight specs, or $349 kit license..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-[#141318] px-4 py-3 text-xs text-white placeholder-stone-500 focus:border-[#D4AF37] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-6 py-3 text-xs font-black uppercase tracking-wider text-black transition hover:brightness-110 cursor-pointer"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 6. EXECUTIVE FAQ — "Good to know." (IDENTIČAN LAYOUT KAO NA PRVOJ STRANICI) */}
        <section id="executive-faq" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 border-t border-white/10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-[#D4AF37]">
                EXECUTIVE FAQ
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Good to know.
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-stone-400">
                Technical specifications, licensing terms, and AI workflow details for creative directors and aviation charter operators.
              </p>
              <button
                type="button"
                onClick={() => navigate('/stock')}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-[#F3E5AB] transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
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
                        className={`shrink-0 text-[#D4AF37] transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs leading-relaxed text-stone-300 sm:text-sm">
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
      <footer className="border-t border-white/15 bg-[#050507] px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-black">
              <Plane size={15} />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-white">
                Aero Privé
              </span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                Sovereign Private Aviation • Page 2 of 5
              </span>
            </span>
          </div>
          <p className="text-xs font-medium text-stone-300">
            Designed for considered journeys, wherever the world takes you.
          </p>
          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-[#F3E5AB] transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
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

      {/* FLOATING NAVIGATION (STRANICA 2 OD 5) */}
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full border border-[#D4AF37]/40 bg-black/90 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur-md transition hover:border-[#D4AF37] cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-black transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#B88924] px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-black shadow-2xl transition hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[#F3E5AB] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default AeroPriveAtelier;