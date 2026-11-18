//SkyglassAviation.jsx


import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Compass,
  Crown,
  DownloadCloud,
  FolderArchive,
  Gem,
  Layers,
  Lock,
  Maximize2,
  Pause,
  Plane,
  Play,
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020B09]/95 p-4 backdrop-blur-2xl"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-6 top-6 rounded-full border border-emerald-400/40 bg-black/80 p-3 text-emerald-200 transition hover:bg-emerald-400 hover:text-black cursor-pointer"
      >
        <X size={20} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Master Visual Inspection"
        className="max-h-[90vh] max-w-[94vw] rounded-2xl border border-emerald-400/40 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

// ============================================================================
// KIT_CONFIG — STRANICA 5 OD 5 (SKYGLASS • EMERALD & BORDEAUX EDITION)
// SVI FAJLOVI SU 100% TAČNI .WEBP I .PNG IZ TVOG PUBLIC/JETS FOLDERA
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1IRFykjqqczESjuzpyjo7hxrXHCVT_5aI/view?usp=sharing',

  prevPageRoute: '/aviation-midnight-kit',
  prevPageLabel: 'Prev Jet Page: Midnight (4/5)',
  nextLandingRoute: '/superyacht-charter-kit',
  nextLandingLabel: 'Next Niche: Yachts (1/5)',

  heroImage: '/jets/31.webp',
  heroVideoUrl:
    'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',

  // 6 ZONA U EMERALD, BORDEAUX & PLATINUM KOLEKCIJI
  bespokeCabins: [
    {
      id: 'emerald-01-flagship',
      step: '01 / 06',
      zone: 'Zone 01 • British Racing Emerald Tarmac Flagship',
      badge: 'Collector Livery Edition',
      title: 'Sovereign Emerald & Brushed Platinum.',
      subtitle:
        'Custom multi-coat British Racing Emerald fuselage with gold pinstriping and mirror-polished leading edges.',
      materials: 'Deep Emerald Metallic • 24K Gold Pinstripe • Brushed Titanium Winglets',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/31.webp'
    },
    {
      id: 'emerald-02-bordeaux',
      step: '02 / 06',
      zone: 'Zone 02 • Imperial Bordeaux & Silver Nose Profile',
      badge: 'Haute Couture Exterior',
      title: 'Sculpted aerodynamics in Imperial Crimson.',
      subtitle:
        'A bold crimson-bordeaux metallic finish paired with high-lustre chrome engine cowlings for unmistakable apron presence.',
      materials: 'Imperial Bordeaux Pearl • Platinum Silver Stripe • Heated Cockpit Glass',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/24.webp'
    },
    {
      id: 'emerald-03-green-salon',
      step: '03 / 06',
      zone: 'Zone 03 • Heritage Emerald Leather & Walnut Club',
      badge: '41 dB Acoustic Salon',
      title: 'Private members’ club atmosphere at FL510.',
      subtitle:
        'Deep forest green full-grain hides paired with bookmatched walnut bulkheads and full-moon panoramic windows.',
      materials: 'Heritage Green Calfskin • Dark American Walnut • Matte Obsidian Table',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/50.webp'
    },
    {
      id: 'emerald-04-dining',
      step: '04 / 06',
      zone: 'Zone 04 • Calacatta Gold & Ivory Gastronomy',
      badge: 'Six-Guest Formal Dining',
      title: 'Panoramic cloud-deck dining in natural stone.',
      subtitle:
        ' gather around a honeycomb-backed Calacatta marble table with oversized panoramic windows looking over the stratosphere.',
      materials: 'Honed Calacatta Marble • Loro Piana Cream Leather • Brushed Brass',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/41.webp'
    },
    {
      id: 'emerald-05-hangar-coupe',
      step: '05 / 06',
      zone: 'Zone 05 • Autumn Hangar & Grand Tourer Transfer',
      badge: '90-Second Boarding',
      title: 'Direct wing-side arrival from your private coupe.',
      subtitle:
        'Bypass every commercial terminal with direct tarmac access outside our architectural private hangar.',
      materials: 'Bordeaux & Gold Livery • Private Hangar Apron • Biometric Clearance',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/5.webp'
    },
    {
      id: 'emerald-06-stateroom',
      step: '06 / 06',
      zone: 'Zone 06 • Full-Beam Master Stateroom Sanctuary',
      badge: '16-Hour Non-Stop Rest',
      title: 'Arrive across oceans in a private king suite.',
      subtitle:
        'A dedicated aft master bedroom with hand-tufted cashmere linens, walnut wardrobes, and warm sunset illumination.',
      materials: 'Cashmere Linens • Bookmatched Walnut • Circadian 2700K Lighting',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit WEBP',
      image: '/jets/37.webp'
    }
  ]
};

// UNIKATNA SEKCIJA ZA STRANICU 5: BESPOKE LIVERY & CABIN PAIRING COMPARATOR
const LIVERY_COLLECTIONS = [
  {
    id: 'livery-emerald',
    name: '01 / British Racing Emerald & Gold',
    swatch: '#10B981',
    exteriorImg: '/jets/30.webp',
    cabinImg: '/jets/50.webp',
    range: '7,800 NM Non-Stop',
    coatSpec: '7-Layer Pearlescent Emerald with 24K Gold Pinstripe',
    cabinSpec: 'Deep Forest Heritage Leather & Bookmatched Walnut'
  },
  {
    id: 'livery-bordeaux',
    name: '02 / Imperial Bordeaux & Platinum',
    swatch: '#E11D48',
    exteriorImg: '/jets/24.webp',
    cabinImg: '/jets/41.webp',
    range: '7,650 NM Non-Stop',
    coatSpec: 'Metallic Crimson Bordeaux with Mirror-Chrome Leading Edges',
    cabinSpec: 'Warm Alabaster Calfskin & Calacatta Gold Marble Table'
  },
  {
    id: 'livery-bronze',
    name: '03 / Champagne Bronze & Walnut',
    swatch: '#D97706',
    exteriorImg: '/jets/26.webp',
    cabinImg: '/jets/35.webp',
    range: '7,800 NM Non-Stop',
    coatSpec: 'Sunlit Espresso-Bronze Topcoat over Titanium Belly',
    cabinSpec: 'Ivory Executive Recliners & High-Gloss Walnut Consoles'
  },
  {
    id: 'livery-silver',
    name: '04 / Stratospheric Silver & Emerald Stripe',
    swatch: '#94A3B8',
    exteriorImg: '/jets/11.webp',
    cabinImg: '/jets/36.webp',
    range: '8,000 NM Ultra-Long-Range',
    coatSpec: 'Raw Polished Aluminum Finish with Racing Green Tail Fin',
    cabinSpec: 'Daylight Cream Club Seating with Direct Cockpit View'
  }
];

const VIDEO_CHAPTERS = [
  {
    id: 'reel-1',
    title: '01 / Emerald & Silver Stratospheric Cruise',
    duration: '01:45 • 4K 60FPS',
    poster: '/jets/11.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'High-altitude chase cinematography above the clouds in bespoke silver-emerald livery.'
  },
  {
    id: 'reel-2',
    title: '02 / Autumn Hangar & Grand Tourer Arrival',
    duration: '01:18 • 4K 60FPS',
    poster: '/jets/5.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Direct supercar apron arrival alongside the bordeaux-and-gold flagship.'
  },
  {
    id: 'reel-3',
    title: '03 / Emerald Club & Calacatta Dining Tour',
    duration: '02:10 • 4K 60FPS',
    poster: '/jets/50.webp',
    videoUrl: KIT_CONFIG.heroVideoUrl,
    caption: 'Interior walkthrough of the heritage green leather lounge and marble dining room.'
  }
];

const LOOKBOOK_ASSETS = [
  { src: '/jets/31.webp', title: 'British Racing Emerald Flagship on Apron', zone: 'Collector Liveries' },
  { src: '/jets/30.webp', title: 'Symmetrical Emerald Nose & Cockpit', zone: 'Collector Liveries' },
  { src: '/jets/24.webp', title: 'Imperial Bordeaux & Chrome Fuselage', zone: 'Collector Liveries' },
  { src: '/jets/5.webp', title: 'Bordeaux Jet & Black Coupe at Hangar', zone: 'Collector Liveries' },
  { src: '/jets/26.webp', title: 'Espresso-Bronze Hangar Reveal', zone: 'Collector Liveries' },
  { src: '/jets/28.webp', title: 'Bronze-Grey Aft Wing & Tail Fin', zone: 'Collector Liveries' },
  { src: '/jets/10.webp', title: 'Champagne Gold Desert Runway Taxi', zone: 'Collector Liveries' },
  { src: '/jets/13.webp', title: 'Teal-Striped White Flagship by the Sea', zone: 'Collector Liveries' },
  { src: '/jets/11.webp', title: 'Polished Silver & Emerald Cloud Cruise', zone: 'Aerial & Hangar' },
  { src: '/jets/12.webp', title: 'Steep Climb with Wingtip Condensation', zone: 'Aerial & Hangar' },
  { src: '/jets/27.webp', title: 'Twin Turbofan Engineering Inside Hangar', zone: 'Aerial & Hangar' },
  { src: '/jets/8.webp', title: 'Symmetrical Hangar Nose Silhouette', zone: 'Aerial & Hangar' },
  { src: '/jets/20.webp', title: 'Sculpted Metallic Winglet in Golden Light', zone: 'Aerial & Hangar' },
  { src: '/jets/17.webp', title: 'Cream Flagship Over Desert Canyon', zone: 'Aerial & Hangar' },
  { src: '/jets/15.webp', title: 'Mountain Valley Sunset Takeoff', zone: 'Aerial & Hangar' },
  { src: '/jets/29.webp', title: 'Golden Hour Runway Rotation', zone: 'Aerial & Hangar' },
  { src: '/jets/50.webp', title: 'Heritage Emerald Leather & Moonlit Salon', zone: 'Bespoke Interiors' },
  { src: '/jets/41.webp', title: 'Calacatta Gold Panoramic Marble Dining', zone: 'Bespoke Interiors' },
  { src: '/jets/40.webp', title: 'Circular Sky-Window Marble Dining', zone: 'Bespoke Interiors' },
  { src: '/jets/35.webp', title: 'Daylight Walnut & Cream Espresso Lounge', zone: 'Bespoke Interiors' },
  { src: '/jets/36.webp', title: 'Executive Worktable Looking to Cockpit', zone: 'Bespoke Interiors' },
  { src: '/jets/42.webp', title: 'Twin Cream Recliners & High-Gloss Consoles', zone: 'Bespoke Interiors' },
  { src: '/jets/57.webp', title: 'Anthracite Four-Place Conference Suite', zone: 'Bespoke Interiors' },
  { src: '/jets/58.webp', title: 'Evening Walnut Table & Crystal Glasses', zone: 'Bespoke Interiors' },
  { src: '/jets/37.webp', title: 'Sunset Master Suite & Side Divan', zone: 'Private Staterooms' },
  { src: '/jets/34.webp', title: 'Warm Cove-Lit King Bedroom Stateroom', zone: 'Private Staterooms' },
  { src: '/jets/38.webp', title: 'Aft Master Bed With Sunset Cockpit View', zone: 'Private Staterooms' },
  { src: '/jets/59.webp', title: 'Golden Hour Full-Beam Stateroom', zone: 'Private Staterooms' }
];

const FAQ_ITEMS = [
  {
    q: 'HOW DOES THE CENTERPIECE COCKPIT DECK & LIVERY COMPARATOR WORK ON PAGE 5?',
    a: 'Skyglass Aviation (Page 5 of 5) introduces a sovereign Emerald, Bordeaux & Brushed Platinum color architecture with a Centerpiece Showcase Deck and an interactive Livery & Cabin Comparator that pairs custom exterior paintwork directly with matching interior hides and stone.'
  },
  {
    q: 'WHAT IS INCLUDED IN THE $349 AGENCY LICENSE?',
    a: 'You receive the complete Skyglass Aviation React + Tailwind JSX source code (with 6-Zone Showcase Deck & Livery Comparator), 60 production files (20 WebP, 20 4K UHD & 20 150MP masters with embedded sRGB ICC profiles), the Railway n8n + Groq AI Flight Desk workflow, and a commercial license for unlimited client websites and print.'
  },
  {
    q: 'HOW DOES THE 16:9 VIDEO PLACEHOLDER WORK WITH SEEDANCE 2.5 AND KLING 4.0?',
    a: 'Both the Hero Showcase Deck and the 16:9 Cinema Reel player support native 4K/60FPS WebM and MP4 streams. When you add the +$199 30s 4K/60fps Cinema Motion Pack, you receive the seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut ready to drop straight into the player.'
  },
  {
    q: 'WHAT IS THE DIFFERENCE BETWEEN THE $349 LICENSE AND THE $1,490 EXCLUSIVE BUYOUT?',
    a: 'The $349 Multi-Client Agency License grants commercial deployment rights for your agency and client projects. The $1,490 1-of-1 Exclusive Buyout permanently removes this kit from our public Stock Store, includes 10 custom 150MP renders tailored to your brand palette, the Private Jet Prompt Engine ruleset, and a signed enterprise IP transfer certificate.'
  }
];

const SkyglassAviation = () => {
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

  // Bespoke Livery Comparator State (Unique to Page 5)
  const [selectedLivery, setSelectedLivery] = useState(LIVERY_COLLECTIONS[0]);

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
      text: 'Welcome to Skyglass Reserve (Page 5/5 • British Racing Emerald & Bordeaux Edition). Ask me about custom collector liveries, heritage green leather cabins, or licensing this complete Turnkey Web + 150MP Asset Kit.'
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
    'Collector Liveries',
    'Aerial & Hangar',
    'Bespoke Interiors',
    'Private Staterooms'
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
        kitCategory: 'Aviation Turnkey Kit - Page 5 (Skyglass Reserve)',
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
VISIONARY FACTORY V10 — SKYGLASS RESERVE (PAGE 5 OF 5)
150MP ULTRA PRINT & TURNKEY AVIATION KIT SPECIFICATION SHEET (.TXT)
===================================================================
Edition: Skyglass Reserve • British Racing Emerald & Bordeaux Edition
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
    a.download = 'Skyglass_Reserve_150MP_Spec_Sheet.txt';
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
          clientName: clientName || 'Skyglass VIP Guest',
          clientEmail: clientEmail || 'vip@skyglass-aviation.com',
          activeZone: currentZone.zone,
          selectedLivery: selectedLivery.name,
          source: 'SkyglassAviation.jsx (Page 5 of 5)'
        })
      });
      const data = await res.json();
      const reply =
        data?.reply ||
        data?.output ||
        data?.text ||
        data?.message ||
        'Our 24/7 Skyglass Flight Desk has registered your inquiry and prepared your bespoke aviation dossier.';
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
    <div className="min-h-screen bg-[#03110D] text-[#F2F7F5] selection:bg-emerald-400 selection:text-[#03110D] font-sans">
      <Helmet>
        <title>Skyglass Reserve • Emerald & Bordeaux Private Aviation Kit (Page 5/5)</title>
      </Helmet>

      {/* TOP BRITISH RACING EMERALD & PLATINUM NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-emerald-400/20 bg-[#03110D]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 via-emerald-500 to-teal-700 text-[#03110D] shadow-lg shadow-emerald-500/25">
              <Gem size={18} />
            </span>
            <div>
              <span className="block text-xs font-black uppercase tracking-[0.28em] text-white">
                Skyglass • Reserve
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                Emerald & Bordeaux Collector Edition • Page 5 of 5
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.15em] text-emerald-100/80 xl:flex">
            <a href="#showcase-deck" className="transition hover:text-emerald-300">
              Showcase Deck
            </a>
            <a href="#livery-comparator" className="transition hover:text-emerald-300">
              Livery Comparator
            </a>
            <a href="#cinema-reel" className="transition hover:text-emerald-300">
              4K Video Reel
            </a>
            <a href="#lookbook-vault" className="transition hover:text-emerald-300">
              28-Image Lookbook
            </a>
            <a href="#commercial-pricing" className="text-emerald-300 transition hover:text-white">
              Pricing (${agencyPrice} / ${buyoutPrice})
            </a>
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="text-emerald-400 transition hover:text-white cursor-pointer"
            >
              Stock Vaults ↗
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/40 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-100 transition hover:border-emerald-400 hover:text-white cursor-pointer"
            >
              Stock Vaults <ArrowUpRight size={13} />
            </button>
            <button
              type="button"
              onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 px-5 py-2 text-[11px] font-black uppercase tracking-[0.15em] text-[#03110D] shadow-lg shadow-emerald-500/25 transition hover:brightness-110 cursor-pointer"
            >
              Yachts <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* 1. NOVI "CENTERPIECE SHOWCASE DECK" HERO (DRUGAČIJI RASPORED OD STRANICA 1-4) */}
        <section
          id="showcase-deck"
          className="relative overflow-hidden border-b border-emerald-400/20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A2E23] via-[#03110D] to-[#020A08] py-14 sm:py-20"
        >
          <div className="mx-auto max-w-[1440px] px-4 sm:px-8">
            {/* Gornji centrirani naslov */}
            <div className="mx-auto max-w-4xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-md">
                <Sparkles size={13} className="text-emerald-300" />
                <span className="text-[11px] font-black uppercase tracking-[0.22em] text-emerald-200">
                  {currentZone.badge} • Step {currentZone.step}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                {currentZone.title}
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-sm font-medium leading-relaxed text-emerald-100/80 sm:text-base">
                {currentZone.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#commercial-pricing"
                  className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 px-7 py-3.5 text-xs font-black uppercase tracking-[0.18em] text-[#03110D] shadow-xl shadow-emerald-500/25 transition hover:scale-105"
                >
                  <DownloadCloud size={15} /> License Agency Kit — ${agencyPrice}
                </a>
                <button
                  type="button"
                  onClick={() => setHeroVideoMode(!heroVideoMode)}
                  className={`flex items-center gap-2 rounded-full border px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] transition cursor-pointer ${
                    heroVideoMode
                      ? 'border-teal-200 bg-teal-300 text-[#03110D]'
                      : 'border-emerald-400/40 bg-[#061F18] text-emerald-200 hover:bg-emerald-400/20'
                  }`}
                >
                  <Video size={14} /> {heroVideoMode ? '4K Video Active' : 'Switch to 4K Video Deck'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSampleAndSpec}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:border-emerald-400 cursor-pointer"
                >
                  Free Sample + .TXT ↗
                </button>
              </div>
            </div>

            {/* SREDNJI PANORAMSKI COCKPIT PROZOR SA SLIKOM ILI VIDEOM */}
            <div className="relative mt-10 overflow-hidden rounded-[2rem] border-2 border-emerald-400/35 bg-black shadow-2xl shadow-emerald-950/60">
              <div className="relative h-[440px] sm:h-[580px] w-full overflow-hidden">
                {heroVideoMode ? (
                  <video
                    src={KIT_CONFIG.heroVideoUrl}
                    poster={currentZone.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <img
                    src={currentZone.image}
                    alt={currentZone.title}
                    className="h-full w-full object-cover object-center transition-all duration-700"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#03110D] via-transparent to-black/30" />

                {/* Gornji desni 150MP Zoom taster */}
                <button
                  type="button"
                  onClick={() => setZoomImage(currentZone.image)}
                  className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-emerald-400/40 bg-[#03110D]/85 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-md transition hover:bg-emerald-400 hover:text-black cursor-pointer"
                >
                  <Maximize2 size={13} /> Inspect 150MP Master
                </button>

                {/* Donji HUD info bar unutar okvira */}
                <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-between gap-4 rounded-2xl border border-emerald-400/30 bg-[#03110D]/85 p-4 backdrop-blur-xl sm:flex-row sm:items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      {currentZone.zone}
                    </span>
                    <p className="mt-0.5 text-xs font-bold text-white">{currentZone.materials}</p>
                  </div>
                  <span className="self-start sm:self-center rounded-full bg-emerald-400/15 border border-emerald-400/40 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                    {currentZone.resolution}
                  </span>
                </div>
              </div>
            </div>

            {/* 6 HORIZONTALNIH PILL TABOVA ISPOD PROZORA */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
                        ? 'border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/15'
                        : 'border-white/10 bg-[#061C16] hover:border-emerald-400/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
                        {z.step}
                      </span>
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="mt-2 line-clamp-2 text-xs font-bold text-white group-hover:text-emerald-200">
                      {z.zone.split('•')[1] || z.zone}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. UNIKATNA SEKCIJA NA STRANICI 5: BESPOKE LIVERY & CABIN PAIRING COMPARATOR */}
        <section
          id="livery-comparator"
          className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 border-b border-emerald-400/15"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
                Bespoke Paintwork & Interior Harmony
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Collector Livery & Cabin Comparator
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-emerald-100/70">
              Select one of our four signature exterior commissions below to inspect the fuselage paintwork alongside its matched interior cabin architecture.
            </p>
          </div>

          {/* 4 LIVERY SWATCH TABS */}
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LIVERY_COLLECTIONS.map((item) => {
              const active = selectedLivery.id === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedLivery(item)}
                  className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition cursor-pointer ${
                    active
                      ? 'border-emerald-400 bg-gradient-to-b from-emerald-500/20 to-[#061C16] shadow-xl'
                      : 'border-white/10 bg-[#061C16] hover:border-emerald-400/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                      {item.name}
                    </span>
                    <span
                      className="h-4 w-4 rounded-full border border-white/40 shrink-0"
                      style={{ backgroundColor: item.swatch }}
                    />
                  </div>
                  <span className="mt-3 block text-[11px] font-bold text-emerald-300">
                    {item.range}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SIDE-BY-SIDE EXTERIOR & CABIN COMPARISON */}
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div
              onClick={() => setZoomImage(selectedLivery.exteriorImg)}
              className="group relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#061C16] cursor-pointer"
            >
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src={selectedLivery.exteriorImg}
                  alt={selectedLivery.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03110D] via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-[#03110D]/80 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                  Exterior Livery Spec
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black uppercase text-white">{selectedLivery.name}</h3>
                <p className="mt-1 text-xs text-emerald-100/80">{selectedLivery.coatSpec}</p>
              </div>
            </div>

            <div
              onClick={() => setZoomImage(selectedLivery.cabinImg)}
              className="group relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-[#061C16] cursor-pointer"
            >
              <div className="relative h-80 sm:h-96 w-full overflow-hidden">
                <img
                  src={selectedLivery.cabinImg}
                  alt={selectedLivery.cabinSpec}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03110D] via-transparent to-transparent" />
                <span className="absolute left-5 top-5 rounded-full bg-[#03110D]/80 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-rose-300 backdrop-blur-md">
                  Matched Cabin Interior
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-black uppercase text-white">Bespoke Cabin Pairing</h3>
                <p className="mt-1 text-xs text-emerald-100/80">{selectedLivery.cabinSpec}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 16:9 4K CINEMA VIDEO SHOWCASE SECTION */}
        <section id="cinema-reel" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-emerald-400/15 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
                16:9 Video Placeholder • Seedance 2.5 & Kling 4.0 Ready
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Skyglass Cinema Flight Reel
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-emerald-100/70">
              Connected to your 4K stratospheric video stream with instant 150MP `.webp` poster frames from `/public/jets/`.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-400/35 bg-[#061C16] shadow-2xl">
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03110D]/90 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-emerald-400/45 bg-[#03110D]/80 px-4 py-1.5 backdrop-blur-md">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                      {activeClip.duration}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={toggleVideoPlay}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/60 bg-emerald-400/20 text-white shadow-2xl backdrop-blur-md transition hover:scale-110 hover:bg-emerald-400 hover:text-[#03110D] cursor-pointer"
                  >
                    {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1 fill-current" />}
                  </button>

                  <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black uppercase text-white sm:text-xl">
                        {activeClip.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-emerald-100/80">{activeClip.caption}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="rounded-full border border-white/20 bg-black/70 p-2.5 text-white hover:border-emerald-400 cursor-pointer"
                      >
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setZoomImage(activeClip.poster)}
                        className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-300 hover:border-emerald-400 cursor-pointer"
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
                          ? 'border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/10'
                          : 'border-white/10 bg-[#061C16] hover:border-emerald-400/40'
                      }`}
                    >
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={clip.poster}
                          alt={clip.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play size={16} className="text-emerald-300 fill-current" />
                        </div>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                          {clip.duration}
                        </span>
                        <h4 className="mt-1 text-xs font-black uppercase text-white group-hover:text-emerald-200">
                          {clip.title}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-[11px] text-emerald-100/60">
                          {clip.caption}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-emerald-400/25 bg-[#061C16] p-5">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                  100% Verified Local Assets
                </span>
                <p className="mt-1 text-xs leading-relaxed text-emerald-100/80">
                  Every collector livery and interior visual is loaded directly from your <code className="text-emerald-300">/public/jets/</code> `.webp` master vault.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 28-ASSET 150MP LOOKBOOK VAULT */}
        <section id="lookbook-vault" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 border-b border-emerald-400/15 pb-8 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.24em] text-emerald-400">
                150MP Ultra Print Master Archive (28 Verified Visuals)
              </span>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
                Skyglass Fleet & Cabin Lookbook
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
                      ? 'bg-emerald-400 text-[#03110D]'
                      : 'border border-white/15 bg-[#061C16] text-emerald-100/80 hover:border-emerald-400/50'
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
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#061C16] transition hover:border-emerald-400/60 cursor-pointer"
              >
                <div className="relative h-60 w-full overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#03110D]/90 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-[#03110D]/85 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-300 backdrop-blur-md">
                    150MP RAW
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-400">
                    {item.zone}
                  </span>
                  <h4 className="mt-1 text-sm font-bold text-white group-hover:text-emerald-200">
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
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-300">
              <Crown size={13} className="text-emerald-400" /> TURNKEY PRIVATE AVIATION BRAND KIT
            </span>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-6xl leading-[1.08]">
              A complete private jet brand, <br />
              ready to take off.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/80 sm:text-base">
              Launch faster with the complete React + Tailwind JSX source code (including the 6-Zone Showcase Deck, Livery Comparator & 16:9 Video Player), 60 production visuals (up to 150MP), and commercial licensing.
            </p>
          </div>

          {/* +$199 VIDEO MOTION PACK ORDER BUMP BOKS */}
          <div className="mx-auto mt-10 max-w-3xl">
            <label
              onClick={() => setIncludeMotionPack(!includeMotionPack)}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition cursor-pointer select-none ${
                includeMotionPack
                  ? 'border-emerald-300 bg-emerald-900/40 shadow-lg shadow-emerald-500/15'
                  : 'border-emerald-400/40 bg-[#061C16] hover:border-emerald-400'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <input
                  type="checkbox"
                  checked={includeMotionPack}
                  onChange={(e) => setIncludeMotionPack(e.target.checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1 sm:mt-0 h-5 w-5 rounded border-emerald-500 accent-emerald-400 cursor-pointer"
                />
                <div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                    <Zap size={14} className="text-emerald-400 fill-current shrink-0" />
                    <span>ADD 30S 4K/60FPS CINEMA MOTION PACK (SEEDANCE 2.5 & KLING 4.0)</span>
                  </div>
                  <p className="mt-1 text-xs text-emerald-100/80">
                    Includes seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut.
                  </p>
                </div>
              </div>

              <span className="shrink-0 self-start sm:self-center rounded-full bg-emerald-400/20 border border-emerald-400/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-200">
                +$199 ORDER BUMP
              </span>
            </label>
          </div>

          {/* 2 PRICING KARTICE ($349 / $548 AGENCY LICENSE & $1490 / $1689 EXCLUSIVE BUYOUT) */}
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* LEFT CARD: MULTI-CLIENT AGENCY LICENSE */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/15 bg-[#061C16] p-8 shadow-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-200">
                    MULTI-CLIENT AGENCY LICENSE
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                    INSTANT ZIP
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-white">${agencyPrice}</span>
                  {includeMotionPack && (
                    <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      Includes +$199 Motion Pack
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-emerald-100/80">
                  For agencies, developers, and private aviation teams building a polished high-ticket digital presence.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-emerald-50">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Complete Skyglass Reserve React + Tailwind JSX source (with Livery Comparator)</span>
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
                      'Skyglass Reserve — Agency Turnkey Kit',
                      agencyPrice,
                      KIT_CONFIG.standardZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-white py-4 text-xs font-black uppercase tracking-[0.16em] text-[#03110D] shadow-xl transition hover:bg-emerald-100 cursor-pointer"
                >
                  <DownloadCloud size={15} /> LICENSE AGENCY KIT — ${agencyPrice}
                </button>
              </div>
            </div>

            {/* RIGHT CARD: 1-OF-1 EXCLUSIVE BUYOUT */}
            <div className="flex flex-col justify-between rounded-3xl border border-emerald-400/65 bg-[#061C16] p-8 shadow-2xl shadow-emerald-500/10">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                    1-OF-1 EXCLUSIVE BUYOUT
                  </span>
                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#03110D]">
                    SINGLE BUYER ONLY
                  </span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-5xl font-black text-emerald-300">${buyoutPrice}</span>
                  {includeMotionPack && (
                    <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                      Includes +$199 Motion Pack
                    </span>
                  )}
                </div>

                <p className="mt-4 text-xs leading-relaxed text-emerald-100/80">
                  Exclusive ownership for a brand that wants permanent removal from our store and full IP transfer.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-emerald-50">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>All 60 WebP, 4K UHD and 150MP master files + permanent store removal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>10 custom 150MP renders tailored to your brand palette</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Private Jet Prompt Engine ruleset for internal expansion</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>Signed enterprise IP transfer certificate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
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
                      'Skyglass Reserve — Exclusive Buyout Rights',
                      buyoutPrice,
                      KIT_CONFIG.buyoutZipLink
                    )
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 py-4 text-xs font-black uppercase tracking-[0.16em] text-[#03110D] shadow-xl shadow-emerald-500/20 transition hover:brightness-110 cursor-pointer"
                >
                  <Lock size={14} /> ACQUIRE EXCLUSIVE RIGHTS — ${buyoutPrice}
                </button>
              </div>
            </div>
          </div>

          {/* HORIZONTALNI BOKS ISPOD KARTICA ("Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)") */}
          <div className="mx-auto mt-8 max-w-5xl rounded-3xl border border-emerald-400/35 bg-[#061C16] p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/35 bg-emerald-500/10 text-emerald-300">
                  <FolderArchive size={20} />
                </div>
                <div>
                  <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-emerald-400">
                    FREE B2B INSPECTION SAMPLE • INSTANT ACCESS
                  </span>
                  <h3 className="mt-1 text-lg font-black text-white sm:text-xl">
                    Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-emerald-100/80">
                    Inspect our full-resolution sample images alongside the complete <code className="text-emerald-300">.txt</code> architecture, ICC color profile, and commercial licensing explanation before purchasing.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadSampleAndSpec}
                className="flex shrink-0 items-center gap-2.5 rounded-full border border-emerald-400/50 bg-emerald-500/10 px-6 py-3.5 text-xs font-black uppercase tracking-[0.16em] text-emerald-200 transition hover:bg-emerald-400 hover:text-[#03110D] cursor-pointer"
              >
                <DownloadCloud size={15} /> DOWNLOAD FREE SAMPLE + .TXT <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* 6. 24/7 AI SKYGLASS & CHARTER CONCIERGE (RAILWAY N8N WEBHOOK) */}
        <section id="ai-concierge" className="mx-auto max-w-[1440px] px-4 pb-20 pt-4 sm:px-8">
          <div className="grid grid-cols-1 gap-10 rounded-3xl border border-emerald-400/35 bg-[#061C16] p-6 sm:p-12 lg:grid-cols-12 shadow-2xl">
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Railway n8n + Groq AI
              </span>
              <h2 className="mt-4 text-3xl font-black uppercase text-white sm:text-4xl">
                24/7 Skyglass AI Flight Desk
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-emerald-100/80">
                Connected directly to <code className="text-emerald-300">n8n-production-720dcf20.up.railway.app</code>. Test live collector livery inquiries, charter dispatch, or white-label kit questions right now.
              </p>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-6 text-xs text-emerald-100/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Active Zone: {currentZone.zone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span>Selected Livery: {selectedLivery.name}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#03110D] p-5 lg:col-span-7">
              <div className="grid grid-cols-1 gap-3 border-b border-white/10 pb-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name / Family Office"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#07221B] px-4 py-2.5 text-xs text-white placeholder-emerald-200/40 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Direct VIP Email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="rounded-xl border border-white/15 bg-[#07221B] px-4 py-2.5 text-xs text-white placeholder-emerald-200/40 focus:border-emerald-400 focus:outline-none"
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
                          ? 'bg-emerald-400 font-bold text-[#03110D]'
                          : 'border border-emerald-400/25 bg-[#07221B] text-emerald-50'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="text-xs italic text-emerald-300">
                    Skyglass AI Flight Desk is computing your response...
                  </div>
                )}
              </div>

              <form onSubmit={handleConciergeSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about British Racing Emerald livery, Bordeaux cabin specs, or $349 kit license..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="flex-1 rounded-xl border border-white/15 bg-[#07221B] px-4 py-3 text-xs text-white placeholder-emerald-200/40 focus:border-emerald-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 px-6 py-3 text-xs font-black uppercase tracking-wider text-[#03110D] transition hover:brightness-110 cursor-pointer"
                >
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 7. EXECUTIVE FAQ — "Good to know." (BEZ POMINJANJA PSD FAJLOVA) */}
        <section id="executive-faq" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-8 border-t border-emerald-400/15">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-[11px] font-black uppercase tracking-[0.24em] text-emerald-400">
                EXECUTIVE FAQ
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-5xl">
                Good to know.
              </h2>
              <p className="mt-4 text-xs leading-relaxed text-emerald-100/70">
                Technical specifications, licensing terms, and AI workflow details for creative directors and aviation charter operators.
              </p>
              <button
                type="button"
                onClick={() => navigate('/stock')}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-emerald-200 transition hover:bg-emerald-400 hover:text-[#03110D] cursor-pointer"
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
                        className={`shrink-0 text-emerald-400 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs leading-relaxed text-emerald-100/80 sm:text-sm">
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
      <footer className="border-t border-emerald-400/20 bg-[#020B08] px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400 text-[#03110D]">
              <Gem size={15} />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-white">
                Skyglass Reserve
              </span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-400">
                Collector Private Aviation • Page 5 of 5
              </span>
            </span>
          </div>
          <p className="text-xs font-medium text-emerald-100/70">
            Bespoke collector liveries and private staterooms for transoceanic flight.
          </p>
          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-emerald-200 transition hover:bg-emerald-400 hover:text-[#03110D] cursor-pointer"
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

      {/* FLOATING NAVIGATION (STRANICA 5 OD 5) */}
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full border border-emerald-400/40 bg-black/90 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-white shadow-2xl backdrop-blur-md transition hover:border-emerald-400 cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-[#03110D] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#03110D] shadow-2xl transition hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#03110D] text-emerald-300 transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SkyglassAviation;