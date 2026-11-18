// ============================================================================
// src/pages/kits/aviation/PrivateAviationKit.jsx
// Complete Ultra-Luxury V10 Private Jet Landing Page (Page 1 of 5)
// Fixed: Zero Empty Space on Top + Interactive 6-Zone Wheel/Click Fly-Through
// + Dedicated 16:9 Video Placeholder (Seedance 2.5 & Kling 4.0 Ready)
// + 24/7 Sovereign AI Flight Desk & Google Calendar Slot Coordinator (Zero-Block)
// + Free 150MP Sample Vault (.TXT Spec Sheet + Sample Images Link)
// + Zero Duplicate Images Across All Sections + Full V8 Checkout
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowLeft, ArrowRight, ArrowUpRight, Calendar, CheckCircle2, ChevronDown,
  Clock3, Compass, Crown, DownloadCloud, FolderArchive, Layers,
  Lock, Maximize2, Menu, MousePointerClick, Pause, Plane, Play, Send, ShieldCheck, Sparkles,
  Video, Volume2, VolumeX, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const optimizeWebP = (url, width = 1600) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_webp')) {
    return url.replace('/upload/', '/upload/f_webp,q_auto,w_' + width + '/');
  }
  return url;
};

const N8N_PRIMARY_WEBHOOK = 'https://n8n-production-720dcf20.up.railway.app/webhook/AVIATION_Concierge_And_Calendar';
const N8N_FALLBACK_WEBHOOK = 'https://n8n-production-720dcf20.up.railway.app/webhook/v10-aviation-flight-desk';

// ============================================================================
// SVE SLIKE SU 100% UNIKATNE PO SEKCIJAMA (BEZ PONAVLJANJA NA STRANICI)
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/11RFyWjqgczESJuzpyje7hxrXHCvT_5o1/view?usp=sharing',

  prevPageRoute: '/aviation-skyglass-kit',
  prevPageLabel: 'Prev Jet Page: Skyglass (5/5)',
  nextLandingRoute: '/aviation-atelier-kit',
  nextLandingLabel: 'Next Jet Page: Atelier (2/5)',

  // 1. HERO FLY-THROUGH SEKVENCE (6 UNIKATNIH ZONA: OD PISTE DO SPAVAĆE SOBE)
  flyThroughZones: [
    {
      id: 'zone-00-exterior',
      step: '01 / 06',
      zone: 'Zone 00 • Tarmac Departure & Sovereign Exterior',
      title: 'The world feels closer when you fly private.',
      subtitle: 'Step aboard and glide through five bespoke 150MP architectural cabin zones crafted for transcontinental range.',
      materials: 'Direct Maybach-to-Steps Boarding • 8,000 NM Nonstop Range • Mach 0.94',
      resolution: '150MP Master (14,200 × 10,600 px) • sRGB & CMYK Ready',
      image: '/jets/hf_20261111_021355_0157ad98-9c44-474e-bac7-ea41cec7c4ab.png',
      fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=2200&q=90'
    },
    {
      id: 'zone-01-daylight-salon',
      step: '02 / 06',
      zone: 'Zone 01 • Main Architectural Salon',
      title: 'Daylight Calacatta & Walnut Lounge',
      subtitle: 'Curved bouclé sofa, brushed champagne ribs & twenty panoramic daylight windows.',
      materials: 'Calacatta Viola Marble • Fluted American Walnut • Full-Grain Cream Leather',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=2000&q=85'
    },
    {
      id: 'zone-02-night-club',
      step: '03 / 06',
      zone: 'Zone 02 • Night Altitude Club',
      title: 'Evening Obsidian & Smoked Glass Club',
      subtitle: 'Sculpted cove lighting, crystal decanter bar & twilight stratosphere horizon.',
      materials: 'Nero Marquina Marble • Smoked Bronze Glass Partitions • Charcoal Nappa',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=2000&q=85'
    },
    {
      id: 'zone-03-dining',
      step: '04 / 06',
      zone: 'Zone 03 • Private Culinary Suite',
      title: 'Travertine & Fluted Teak Dining Room',
      subtitle: 'Six-seat private culinary table with Michelin sommelier service at 45,000 feet.',
      materials: 'Raw Roman Travertine • Vertical Tambour Wood Bulkhead • Fine Porcelain',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_iA4bcS83uK.png',
      fallback: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2000&q=85'
    },
    {
      id: 'zone-04-boardroom',
      step: '05 / 06',
      zone: 'Zone 04 • Executive Sky Boardroom',
      title: 'Executive Nero Marble Conference Suite',
      subtitle: 'Six high-back leather chairs with dual Ka-band satellite connectivity for C-suite briefings.',
      materials: 'Polished Black Veined Marble • Brushed Brass Inlays • Espresso Leather',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_l7xINVXgv9.png',
      fallback: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=2000&q=85'
    },
    {
      id: 'zone-05-bedroom',
      step: '06 / 06',
      zone: 'Zone 05 • Private Master Stateroom',
      title: 'Whisper-Quiet Master Bedroom Suite',
      subtitle: 'King-size cashmere bedding, acoustic padded walls & en-suite marble shower.',
      materials: 'Loro Piana Cashmere • Acoustic Alcantara Panels • Warm Reading Sconces',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_XtD4EIHBfo.png',
      fallback: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85'
    }
  ],

  // 2. THE FLEET SEKCIJA (3 UNIKATNE SLIKE #7, #8, #9)
  fleetClasses: [
    {
      name: 'Gulfstream G700 Flagship',
      detail: 'Twenty panoramic oval windows, circadian lighting and five distinct living spaces for transoceanic range.',
      range: '7,750 NM • 19 Guests',
      rate: '$16,500 / hr',
      image: 'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      name: 'Bombardier Global 8000',
      detail: 'The fastest civilian aircraft since Concorde with the industry’s lowest cabin altitude and four luxury suites.',
      range: '8,000 NM • Mach 0.94',
      rate: '$17,200 / hr',
      image: 'https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=1400&q=85'
    },
    {
      name: 'Dassault Falcon 10X Residence',
      detail: 'Widebody penthouse proportions featuring a modular private stateroom, cinema lounge and marble shower.',
      range: '7,500 NM • Widebody',
      rate: '$15,900 / hr',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1400&q=85'
    }
  ],

  // 3. DEDICATED 16:9 VIDEO PLACEHOLDER SEKCIJA (Seedance 2.5 & Kling 4.0 30s Ready)
  cinemaVideos: [
    {
      id: 'altitude-reel',
      badge: '01 • 16:9 Master Video Placeholder (30s Seedance 2.5 / Kling 4.0)',
      title: 'Above the weather, on your own timeline.',
      desc: 'True 16:9 widescreen (3840 × 2160) 4K 60fps aerial cinematography slot ready for hero headers, digital billboards, and investor decks.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-white-clouds-in-the-sky-41645-large.mp4',
      poster: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=90'
    },
    {
      id: 'sunset-approach',
      badge: '02 • Golden-Hour Stratosphere Loop (16:9 UHD)',
      title: 'Seamless private terminal transitions.',
      desc: 'Warm ambient lighting and cinematic 30-second motion engineered for luxury charter brokerages.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',
      poster: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1920&q=90'
    }
  ],

  // 4. EXPERIENCE KOLAŽ (3 UNIKATNE SLIKE #10, #11, #12)
  experienceCollage: [
    {
      label: 'The Culinary Atelier',
      title: 'Michelin-curated dining at 45,000 feet.',
      image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Tarmac Chauffeur',
      title: 'Direct Maybach-to-aircraft boarding',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85'
    },
    {
      label: 'Sommelier Reserve',
      title: 'Vintage champagne & crystal service',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85'
    }
  ],

  // 5. VIZUELNA GALERIJA (6 UNIKATNIH SLIKA #13 DO #18 — NIJEDNA SE NE PONAVLJA GORE)
  fleetAssets: [
    {
      id: 'asset-cockpit-avionics',
      category: 'exterior',
      tag: 'Next-Gen Flight Deck',
      title: 'Panoramic Synthetic-Vision Cockpit',
      specs: 'Dual head-up displays • Autothrottle precision • Satellite weather radar',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'asset-wing-sunrise',
      category: 'exterior',
      tag: 'Stratosphere Winglet',
      title: 'Sculpted Aerodynamics at Dawn',
      specs: 'Supercritical swept wing • FL510 ceiling • Golden horizon light',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'asset-apron-departure',
      category: 'exterior',
      tag: 'Private FBO Apron',
      title: 'Poised for Transcontinental Departure',
      specs: 'Zero-queue private terminal • Dedicated ground crew • Discreet boarding',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'asset-blue-hour-runway',
      category: 'exterior',
      tag: 'Blue-Hour Runway',
      title: 'Twilight Clearance in Geneva',
      specs: 'High-intensity runway lighting • Wet tarmac reflections • 150MP sharpness',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'asset-bespoke-leather',
      category: 'cabin',
      tag: 'Artisanal Craftsmanship',
      title: 'Hand-Stitched Beluga Leather Club',
      specs: 'Ergonomically contoured recliners • Whisper-quiet acoustic insulation',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'asset-executive-table',
      category: 'dining',
      tag: 'In-Flight Connectivity',
      title: 'Ka-Band Satellite Office Suite',
      specs: 'Uninterrupted 4K video conferencing • Bespoke wood veneer desk',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1400&q=85'
    }
  ],

  // 6. FOOTER CTA BANER (UNIKATNA SLIKA #19)
  ctaBannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85'
};

const CALENDAR_SLOTS = [
  'Calendar Slot: 10:00 CET',
  'Calendar Slot: 12:00 CET',
  'Calendar Slot: 14:00 CET',
  'Calendar Slot: 16:00 CET',
  'Calendar Slot: 18:00 CET'
];

const FAQS = [
  {
    question: 'How does the 6-Zone Cabin Fly-Through Hero work on this landing page?',
    answer: 'You can glide through all 6 bespoke aviation zones (from tarmac exterior into the daylight salon, night club, dining room, boardroom, and master bedroom) using your mouse wheel inside the hero showcase, clicking the Next/Prev Zone arrows, or enabling Auto-Fly Mode.'
  },
  {
    question: 'What is included in the $349 Agency License?',
    answer: 'The agency package includes the complete React and Tailwind JSX source code, 60 private-jet visual files (20 scenes in WebP, 4K UHD, and 150MP Ultra-Print formats), 3 layered PSD mockups, sRGB/CMYK ICC Color Profiles, and an unlimited multi-client commercial license.'
  },
  {
    question: 'How does the 16:9 Video Placeholder work with Seedance 2.5 and Kling 4.0?',
    answer: 'The dedicated 16:9 Widescreen Cinema section supports native 30-second 4K/60fps WebM and MP4 loops. You can paste any local or cloud video URL directly into the live preview bar to test your motion assets instantaneously.'
  },
  {
    question: 'What does the $1,490 Exclusive Single-Buyer Buyout include?',
    answer: 'The 1-of-1 buyout permanently removes this kit from our public store, transfers 100% intellectual property rights to your organization, and includes 10 bespoke 150MP architectural renders tailored to your brand palette.'
  }
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const LightboxInspector = ({ imageUrl, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = imageUrl ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Private jet 150MP image preview"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute right-6 top-6 rounded-full bg-[#D4AF37] p-3 text-black shadow-2xl transition hover:bg-[#F3E5AB] cursor-pointer"
        aria-label="Close image preview"
      >
        <X size={24} />
      </button>
      <motion.img
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        src={optimizeWebP(imageUrl, 2400)}
        alt="Private jet 150MP visual preview"
        className="max-h-[90vh] max-w-full rounded-2xl border-2 border-[#D4AF37]/50 object-contain shadow-[0_0_80px_rgba(212,175,55,0.25)]"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body
  );
};

const PrivateAviationKit = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [fleetFilter, setFleetFilter] = useState('all');
  const [zoomImage, setZoomImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // ==========================================================================
  // INTERACTIVE 6-ZONE CABIN FLY-THROUGH STATE
  // ==========================================================================
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [autoFlyActive, setAutoFlyActive] = useState(false);
  const wheelCooldownRef = useRef(0);

  // 16:9 Cinema Video State (Seedance 2.5 / Kling 4.0 Ready)
  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const cinemaVideoRef = useRef(null);

  // Order Bump (+ $199 for 30s 4K Seedance 2.5 / Kling 4.0 Motion Pack)
  const [includeMotionBump, setIncludeMotionBump] = useState(false);

  // ==========================================================================
  // 24/7 SOVEREIGN AI FLIGHT DESK + CALENDAR COORDINATOR STATE
  // ==========================================================================
  const [aircraftType, setAircraftType] = useState('Gulfstream G700 Flagship');
  const [vipName, setVipName] = useState('');
  const [vipEmail, setVipEmail] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-11-20');
  const [bookingSlot, setBookingSlot] = useState('Calendar Slot: 14:00 CET');
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to Aero Privé Sovereign (Page 1/5 • Imperial 6-Zone Fly-Through Edition). Ask me about Gulfstream G700 & Global 8000 charter rates, 150MP cabin zones, Google Calendar flight briefings, or licensing this complete Turnkey Web + 150MP Asset Kit.'
    }
  ]);
  const chatScrollRef = useRef(null);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (user?.displayName) setVipName((prev) => prev || user.displayName);
      if (user?.email) setVipEmail((prev) => prev || user.email);
    });
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'Private_Jet_Kit' });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiThinking]);

  // Optional Auto-Fly timer
  useEffect(() => {
    if (!autoFlyActive) return undefined;
    const timer = setInterval(() => {
      setActiveZoneIdx((prev) => (prev + 1) % KIT_CONFIG.flyThroughZones.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [autoFlyActive]);

  // Smooth Wheel Fly-Through Handler inside Hero Section
  const handleHeroWheel = (e) => {
    const now = Date.now();
    if (now - wheelCooldownRef.current < 550) return;

    const totalZones = KIT_CONFIG.flyThroughZones.length;
    if (e.deltaY > 25 && activeZoneIdx < totalZones - 1) {
      wheelCooldownRef.current = now;
      setActiveZoneIdx((prev) => Math.min(totalZones - 1, prev + 1));
    } else if (e.deltaY < -25 && activeZoneIdx > 0 && window.scrollY < 180) {
      wheelCooldownRef.current = now;
      setActiveZoneIdx((prev) => Math.max(0, prev - 1));
    }
  };

  const filteredAssets = fleetFilter === 'all'
    ? KIT_CONFIG.fleetAssets
    : KIT_CONFIG.fleetAssets.filter((item) => item.category === fleetFilter);

  const toggleCinemaPlay = () => {
    if (!cinemaVideoRef.current) return;
    if (cinemaVideoRef.current.paused) {
      cinemaVideoRef.current.play();
      setIsCinemaPlaying(true);
    } else {
      cinemaVideoRef.current.pause();
      setIsCinemaPlaying(false);
    }
  };

  const toggleCinemaMute = () => {
    if (!cinemaVideoRef.current) return;
    cinemaVideoRef.current.muted = !cinemaVideoRef.current.muted;
    setIsCinemaMuted(cinemaVideoRef.current.muted);
  };

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Agency Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'private_jet_buyout_1490' : 'private_jet_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (error) {
      console.error(error);
    }
  };

  const agencyPriceNum = includeMotionBump ? 548 : 349;
  const buyoutPriceNum = includeMotionBump ? 1689 : 1490;

  const handlePurchaseTier = async (tier) => {
    const isBuyout = tier === 'buyout';
    const baseNum = isBuyout ? buyoutPriceNum : agencyPriceNum;
    const price = `${baseNum}.00`;
    const motionSuffix = includeMotionBump ? ' + 30s 4K Seedance 2.5/Kling 4.0 Video Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Private Jet Brand + React Kit (60 Files + 3 PSD)${motionSuffix}`
      : `Agency License: Private Jet React Kit + 20 Scenes (WebP/4K/150MP) + 3 PSD${motionSuffix}`;
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;

    trackV8Action('high_ticket_checkout_click', {
      item_name: productName,
      value: baseNum,
      currency: 'USD'
    });

    const activeUser = currentUser || auth.currentUser;
    if (activeUser) {
      await recordOrderIntent(activeUser, productName, price);
      setCheckoutData({ isOpen: true, name: productName, price, zipLink });
    } else {
      setLoginModal({ isOpen: true, tierName: productName, price, zipLink });
    }
  };

  // ==========================================================================
  // ZERO-BLOCK EXECUTIVE FALLBACK (Ako n8n ikada štucne ili se osvežava)
  // ==========================================================================
  const buildExecutiveFallbackReply = (userText, currentZoneTitle) => {
    const lower = userText.toLowerCase();
    const isSerbian = /[čćžšđ]|zdravo|ćao|cao|cena|koliko|zakaz|termin|avion|let|kalendar|kupov/i.test(lower);
    const slotClean = bookingSlot.replace('Calendar Slot: ', '');
    const clientLabel = vipName.trim() || (isSerbian ? 'VIP Klijent' : 'Executive Guest');

    if (isSerbian) {
      return `Dobrodošli u Aero Privé Sovereign Flight Desk, ${clientLabel}. Vaš upit za flotnu klasu (${aircraftType}, aktivna zona: ${currentZoneTitle}) je evidentiran. Predloženi VIP brifing termin (${bookingDate} u ${slotClean}) je spreman za potvrdu${vipEmail ? ` na ${vipEmail}` : ''}. Čarter tarife počinju od $15,900/h (Falcon 10X) do $17,200/h (Global 8000), dok kompletan Turnkey React + 150MP Kit možete preuzeti za $${agencyPriceNum} (Agency) ili $${buyoutPriceNum} (1-of-1 Exclusive Buyout).`;
    }

    return `Welcome to Aero Privé Sovereign Flight Desk, ${clientLabel}. We have logged your inquiry regarding ${aircraftType} (Active Cabin: ${currentZoneTitle}). Your requested executive briefing slot (${bookingDate} at ${slotClean}) is queued${vipEmail ? ` for ${vipEmail}` : ''}. Transcontinental charter rates range from $15,900/hr (Falcon 10X) to $17,200/hr (Global 8000), and this complete Turnkey React + 150MP Visual Kit is available immediately at $${agencyPriceNum} (Multi-Client Agency) or $${buyoutPriceNum} (1-of-1 Exclusive Buyout).`;
  };

  const handleFlightDeskSend = async (event) => {
    event.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isAiThinking) return;

    const activeZoneObj = KIT_CONFIG.flyThroughZones[activeZoneIdx];
    const slotTimeClean = bookingSlot.replace('Calendar Slot: ', '');

    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setIsAiThinking(true);

    const payload = {
      sessionId: vipEmail.trim() || `sovereign-jet-${Date.now()}`,
      clientName: vipName.trim() || currentUser?.displayName || 'VIP Family Office',
      clientEmail: vipEmail.trim() || currentUser?.email || 'vip@aeroprive.com',
      bookingDate,
      bookingSlot: slotTimeClean,
      page: 'Aero Privé Sovereign (Page 1/5)',
      activeZone: activeZoneObj.zone,
      aircraft: aircraftType,
      message: trimmed,
      chatInput: `[Page 1/5 Sovereign | Aircraft: ${aircraftType} | Active Zone: ${activeZoneObj.zone} | Client: ${vipName || 'VIP Guest'} (${vipEmail || 'no-email'}) | Preferred Calendar Slot: ${bookingDate} ${slotTimeClean}] Client Inquiry: ${trimmed}`
    };

    try {
      let res = await fetch(N8N_PRIMARY_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.status === 404) {
        res = await fetch(N8N_FALLBACK_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json().catch(() => null);
      const rawReply =
        data?.reply ||
        data?.output ||
        data?.agent_reply ||
        data?.text ||
        (Array.isArray(data) ? data[0]?.output || data[0]?.reply || data[0]?.text : '');

      if (res.ok && rawReply && !String(rawReply).toLowerCase().includes('error in workflow')) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: String(rawReply) }]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: 'assistant', text: buildExecutiveFallbackReply(trimmed, activeZoneObj.title) }
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: buildExecutiveFallbackReply(trimmed, activeZoneObj.title) }
      ]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const scrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeFlyZone = KIT_CONFIG.flyThroughZones[activeZoneIdx];
  const activeCinemaClip = KIT_CONFIG.cinemaVideos[activeCinemaIdx];
  const effectiveCinemaVideoUrl = customVideoUrl.trim() || activeCinemaClip.videoUrl;
  const progressPercent = ((activeZoneIdx + 1) / KIT_CONFIG.flyThroughZones.length) * 100;

  return (
    <div className="min-h-screen bg-[#050811] pb-24 font-sans text-white selection:bg-[#D4AF37] selection:text-black">
      <Helmet>
        <title>Private Jets — Sovereign Scroll Fly-Through & 150MP Visual Kit | Aero Privé</title>
        <meta
          name="description"
          content="Ultra-luxury private jet charter landing page featuring an interactive 6-zone 150MP cabin fly-through, 16:9 4K motion reel, 24/7 AI Flight Desk with Google Calendar slots, and B2B agency licensing."
        />
        <meta name="theme-color" content="#050811" />
      </Helmet>

      {/* TOP IMPERIAL GOLD RIBBON */}
      <div className="border-b border-[#D4AF37]/30 bg-[#090D18] px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
        SOVEREIGN PRIVATE AVIATION
        <span className="mx-2.5 text-[#D4AF37]">✦</span>
        INTERACTIVE 6-ZONE 150MP CABIN FLY-THROUGH
        <span className="mx-2.5 text-[#D4AF37]">✦</span>
        SEEDANCE 2.5 & KLING 4.0 16:9 VIDEO READY
      </div>

      {/* SUB-HEADER FOR AERO PRIVÉ NAVIGATION */}
      <header className="border-b border-[#D4AF37]/25 bg-[#050811]/95 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3.5 sm:px-7 lg:px-10">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 text-left cursor-pointer"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11] text-black shadow-[0_0_20px_rgba(212,175,55,0.45)]">
              <Plane size={19} className="stroke-[2.5]" />
            </span>
            <span>
              <span className="block text-sm sm:text-base font-black uppercase tracking-[0.24em] text-white">
                Aero Privé
              </span>
              <span className="block text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37]">
                Kit 01 / 05 • Imperial Fly-Through Edition
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.16em] text-slate-100 lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo('bespoke-cabins')} className="transition hover:text-[#F3E5AB] cursor-pointer">
              6-Zone Fly-Through
            </button>
            <button type="button" onClick={() => scrollTo('cinema-reel')} className="transition hover:text-[#F3E5AB] cursor-pointer">
              16:9 Flight Film
            </button>
            <button type="button" onClick={() => scrollTo('fleet')} className="transition hover:text-[#F3E5AB] cursor-pointer">
              The Fleet
            </button>
            <button type="button" onClick={() => scrollTo('gallery')} className="transition hover:text-[#F3E5AB] cursor-pointer">
              Visual Vault
            </button>
            <button type="button" onClick={() => scrollTo('licensing')} className="transition hover:text-[#F3E5AB] cursor-pointer">
              B2B Licensing
            </button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => scrollTo('charter-request')}
              className="rounded-full border-2 border-[#D4AF37]/50 bg-white/5 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-[#F3E5AB] transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
            >
              24/7 AI Flight Desk
            </button>
            <button
              type="button"
              onClick={() => scrollTo('licensing')}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-black shadow-[0_0_25px_rgba(212,175,55,0.4)] transition hover:scale-105 cursor-pointer"
            >
              Acquire Kit (${agencyPriceNum}) <ArrowRight size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#F3E5AB] lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-[#D4AF37]/20 bg-[#090D18] px-5 lg:hidden"
            >
              <div className="mx-auto flex max-w-[1440px] flex-col gap-1 py-4">
                {[
                  ['6-Zone Fly-Through', 'bespoke-cabins'],
                  ['16:9 Flight Film', 'cinema-reel'],
                  ['The Fleet', 'fleet'],
                  ['Beyond the Flight', 'experience'],
                  ['24/7 AI Flight Desk', 'charter-request'],
                  ['Visual Vault', 'gallery'],
                  ['B2B Licensing', 'licensing']
                ].map(([label, id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="py-3 text-left text-xs font-black uppercase tracking-[0.16em] text-white hover:text-[#F3E5AB]"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* ================================================================= */}
        {/* 1. IMMEDIATE FULL-SCREEN 6-ZONE CABIN FLY-THROUGH SHOWCASE        */}
        {/* ================================================================= */}
        <section
          id="bespoke-cabins"
          onWheel={handleHeroWheel}
          className="relative min-h-[86vh] w-full overflow-hidden border-b border-[#D4AF37]/30 bg-[#050811] flex flex-col justify-between"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFlyZone.id}
              initial={{ opacity: 0, scale: 1.12 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-0"
            >
              <img
                src={activeFlyZone.image}
                onError={(e) => { e.currentTarget.src = activeFlyZone.fallback; }}
                alt={activeFlyZone.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050811]/95 via-[#050811]/65 to-black/25" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-[#050811]/40" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-20 h-1.5 w-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-between px-4 py-8 sm:px-7 lg:px-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#D4AF37]/60 bg-black/85 px-4 py-2 backdrop-blur-xl">
                <span className="h-2.5 w-2.5 rounded-full bg-[#D4AF37] animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                  CABIN FLY-THROUGH • {activeFlyZone.step} (SCROLL WHEEL OR CLICK ZONES)
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAutoFlyActive((prev) => !prev)}
                  className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] backdrop-blur-md transition cursor-pointer flex items-center gap-1.5 ${
                    autoFlyActive
                      ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                      : 'border-white/30 bg-black/80 text-white hover:border-[#D4AF37]'
                  }`}
                >
                  {autoFlyActive ? <Pause size={12} /> : <Play size={12} />}
                  {autoFlyActive ? 'Auto-Fly Active' : 'Start Auto-Fly'}
                </button>

                <button
                  type="button"
                  onClick={() => setZoomImage(activeFlyZone.image)}
                  className="rounded-full border border-white/30 bg-black/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer flex items-center gap-1.5"
                >
                  <Aperture size={13} className="text-[#D4AF37]" /> Inspect 150MP Master
                </button>
              </div>
            </div>

            <div className="my-10 grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <motion.div
                  key={`text-${activeFlyZone.id}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-black/80 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                    <Sparkles size={13} /> {activeFlyZone.zone}
                  </span>

                  <h1 className="mt-4 text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.04] tracking-tight text-white drop-shadow-2xl">
                    {activeFlyZone.title}
                  </h1>

                  <p className="mt-4 text-base sm:text-lg font-medium leading-relaxed text-slate-100 max-w-2xl drop-shadow">
                    {activeFlyZone.subtitle}
                  </p>

                  <div className="mt-5 inline-block rounded-2xl border border-[#D4AF37]/40 bg-black/85 px-5 py-3.5 backdrop-blur-xl">
                    <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-[#F3E5AB]">
                      {activeFlyZone.materials}
                    </span>
                    <span className="mt-1 block text-xs font-bold text-emerald-400">
                      ✓ {activeFlyZone.resolution}
                    </span>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveZoneIdx((prev) => (prev + 1) % KIT_CONFIG.flyThroughZones.length)
                      }
                      className="rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-black shadow-[0_0_30px_rgba(212,175,55,0.45)] transition hover:scale-105 cursor-pointer flex items-center gap-2"
                    >
                      Fly Into Next Cabin Zone ({activeZoneIdx + 1}/6) <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => scrollTo('cinema-reel')}
                      className="rounded-full border-2 border-white/35 bg-black/80 px-7 py-4 text-xs font-black uppercase tracking-[0.16em] text-white backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer flex items-center gap-2"
                    >
                      <Play size={14} className="fill-[#F3E5AB] text-[#F3E5AB]" /> Watch 16:9 Video
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center">
                <div className="w-full max-w-sm rounded-3xl border-2 border-[#D4AF37]/50 bg-black/85 p-5 backdrop-blur-2xl shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                      Aircraft Deck Navigator
                    </span>
                    <span className="text-xs font-black text-[#D4AF37]">
                      Zone {activeZoneIdx + 1} of 6
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed mb-4">
                    Use the buttons below or scroll your mouse wheel to step from the tarmac straight through all 5 interior rooms.
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveZoneIdx((prev) =>
                          prev === 0 ? KIT_CONFIG.flyThroughZones.length - 1 : prev - 1
                        )
                      }
                      className="py-3 rounded-xl border border-white/25 bg-white/5 hover:border-[#D4AF37] text-xs font-black uppercase tracking-wider text-white transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowLeft size={14} /> Prev Room
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveZoneIdx((prev) => (prev + 1) % KIT_CONFIG.flyThroughZones.length)
                      }
                      className="py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-xs font-black uppercase tracking-wider text-black transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Next Room <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
              {KIT_CONFIG.flyThroughZones.map((item, idx) => {
                const isActive = activeZoneIdx === idx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveZoneIdx(idx)}
                    className={`group flex items-center gap-2.5 rounded-2xl border-2 p-2.5 text-left backdrop-blur-xl transition cursor-pointer ${
                      isActive
                        ? 'border-[#D4AF37] bg-black/95 text-white shadow-[0_0_25px_rgba(212,175,55,0.45)] scale-[1.02]'
                        : 'border-white/15 bg-black/70 text-slate-300 hover:border-[#D4AF37]/50 hover:text-white'
                    }`}
                  >
                    <img
                      src={item.image}
                      onError={(e) => { e.currentTarget.src = item.fallback; }}
                      alt={item.title}
                      className="h-11 w-14 shrink-0 rounded-lg object-cover border border-white/15"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-[#D4AF37]">
                        Zone 0{idx}
                      </span>
                      <span className="block truncate text-[11px] font-extrabold text-white">
                        {item.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* HIGH-CONTRAST FEATURE BAR */}
        <section className="border-b border-white/15 bg-[#090E1A]">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-7 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [MousePointerClick, '6-Zone Cabin Fly-Through'],
              [Video, '16:9 Seedance 2.5 & Kling 4.0 Ready'],
              [ShieldCheck, 'Zero Duplicate Visuals'],
              [Sparkles, '150MP Bespoke Cabin Architecture']
            ].map(([Icon, label], index) => (
              <Reveal key={label} delay={index * 0.06}>
                <div className="flex items-center gap-3.5 text-xs font-extrabold uppercase tracking-wider text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#F3E5AB]">
                    <Icon size={17} />
                  </span>
                  <span>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 2. DEDICATED 16:9 VIDEO PLACEHOLDER (SEEDANCE 2.5 / KLING 4.0)    */}
        {/* ================================================================= */}
        <section id="cinema-reel" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pt-20 pb-12 sm:px-7 sm:pt-28 lg:px-10">
          <Reveal className="overflow-hidden rounded-[2.2rem] border-2 border-[#D4AF37]/50 bg-[#080C17] text-white shadow-[0_0_70px_rgba(212,175,55,0.15)] p-6 sm:p-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                  <Video size={14} /> 16:9 Widescreen Cinema Placeholder • Seedance 2.5 & Kling 4.0 (30s)
                </span>
                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                  {activeCinemaClip.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-medium text-slate-200">
                  {activeCinemaClip.desc}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 shrink-0">
                {KIT_CONFIG.cinemaVideos.map((clip, idx) => (
                  <button
                    key={clip.id}
                    type="button"
                    onClick={() => {
                      setCustomVideoUrl('');
                      setActiveCinemaIdx(idx);
                      setIsCinemaPlaying(true);
                    }}
                    className={`px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                      activeCinemaIdx === idx && !customVideoUrl
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-lg'
                        : 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37]'
                    }`}
                  >
                    Reel 0{idx + 1} (16:9)
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-3xl border-2 border-[#D4AF37]/60 bg-black shadow-2xl">
              <video
                ref={cinemaVideoRef}
                key={effectiveCinemaVideoUrl}
                autoPlay
                loop
                muted={isCinemaMuted}
                playsInline
                poster={activeCinemaClip.poster}
                className="h-full w-full object-cover"
              >
                <source src={effectiveCinemaVideoUrl} type="video/mp4" />
                <source src={effectiveCinemaVideoUrl} type="video/webm" />
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-[#D4AF37]/50 bg-black/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#F3E5AB] backdrop-blur-md">
                  {activeCinemaClip.badge}
                </span>
                <span className="rounded-full bg-emerald-500 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-black">
                  16:9 ASPECT RATIO LOCKED
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggleCinemaPlay}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-black/85 text-[#F3E5AB] backdrop-blur-md transition hover:bg-[#D4AF37] hover:text-black cursor-pointer"
                  >
                    {isCinemaPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCinemaMute}
                    className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/85 text-white backdrop-blur-md transition hover:border-[#D4AF37] cursor-pointer"
                  >
                    {isCinemaMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div className="flex flex-1 max-w-xl items-center gap-2 rounded-2xl border border-white/25 bg-black/90 px-4 py-2 backdrop-blur-xl">
                  <Maximize2 size={15} className="text-[#D4AF37] shrink-0" />
                  <input
                    type="text"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    placeholder="Paste any .webm or .mp4 URL here to preview live in 16:9..."
                    className="w-full bg-transparent text-xs font-semibold text-white placeholder-slate-400 outline-none"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================= */}
        {/* 3. THE FLEET (3 UNIQUE EXTERIOR/CABIN IMAGES — NO DUPLICATES)     */}
        {/* ================================================================= */}
        <section id="fleet" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                Sovereign Transcontinental Fleet
              </span>
              <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                The right aircraft makes all the difference.
              </h2>
              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-200 sm:text-base">
                From intercontinental flagship jets to widebody flying residences, each aircraft class is presented with crystal-clear specifications.
              </p>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('charter-request')}
              className="inline-flex w-fit items-center gap-2 border-b-2 border-[#D4AF37] pb-2 text-xs font-black uppercase tracking-[0.16em] text-[#F3E5AB] transition hover:text-white cursor-pointer"
            >
              Open 24/7 AI Flight Desk <ArrowRight size={14} />
            </button>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {KIT_CONFIG.fleetClasses.map((aircraft, index) => (
              <Reveal key={aircraft.name} delay={index * 0.09}>
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="group overflow-hidden rounded-[1.6rem] border-2 border-white/15 hover:border-[#D4AF37] bg-[#0B101E] shadow-2xl transition"
                >
                  <div
                    onClick={() => setZoomImage(aircraft.image)}
                    className="relative h-64 cursor-zoom-in overflow-hidden bg-black"
                  >
                    <img
                      src={aircraft.image}
                      alt={aircraft.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-black/85 border border-[#D4AF37]/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#F3E5AB] backdrop-blur">
                      {aircraft.range}
                    </span>
                    <span className="absolute bottom-4 right-4 rounded-xl bg-[#D4AF37] px-3 py-1 text-xs font-black uppercase text-black shadow-lg">
                      {aircraft.rate}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-black tracking-tight text-white">{aircraft.name}</h3>
                      <ArrowUpRight size={18} className="text-[#D4AF37] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm font-medium leading-6 text-slate-200">{aircraft.detail}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setAircraftType(aircraft.name);
                        setChatInput(`Requesting charter availability & cabin specs for ${aircraft.name}`);
                        scrollTo('charter-request');
                      }}
                      className="mt-6 text-[11px] font-black uppercase tracking-[0.16em] text-[#F3E5AB] hover:text-white cursor-pointer"
                    >
                      Select {aircraft.name} →
                    </button>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4. BEYOND THE FLIGHT — 3 UNIQUE LIFESTYLE IMAGES                  */}
        {/* ================================================================= */}
        <section id="experience" className="relative overflow-hidden border-y border-white/15 bg-[#090E1A] text-white">
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-7 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                Beyond the Flight
              </span>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Everything considered, from departure to arrival.
              </h2>
              <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-slate-200 sm:text-base">
                A smooth private aviation experience depends on the details around the flight. Tell us what matters, and we shape the entire itinerary around you.
              </p>

              <div className="mt-9 space-y-5">
                {[
                  ['01', 'Zero-Queue FBO Departure', 'Private terminal access and Maybach tarmac transfers planned around your day.'],
                  ['02', 'Bespoke Cabin Atmosphere', 'Choose the aircraft class, lighting mood, and Michelin-curated dining menu.'],
                  ['03', 'Seamless Onward Arrival', 'Coordinate helicopter connections and diplomatic ground transfers in advance.']
                ].map(([number, title, copy]) => (
                  <div key={number} className="flex gap-4 border-t border-white/15 pt-4">
                    <span className="pt-0.5 text-xs font-black tracking-[0.15em] text-[#D4AF37]">{number}</span>
                    <div>
                      <h3 className="text-base font-black text-white">{title}</h3>
                      <p className="mt-1 text-xs font-medium leading-6 text-slate-300">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12} className="relative">
              <div className="grid grid-cols-5 grid-rows-2 gap-4">
                <button
                  type="button"
                  onClick={() => setZoomImage(KIT_CONFIG.experienceCollage[0].image)}
                  className="group relative col-span-3 row-span-2 min-h-[420px] overflow-hidden rounded-[1.5rem] border border-[#D4AF37]/40 text-left cursor-zoom-in"
                >
                  <img
                    src={KIT_CONFIG.experienceCollage[0].image}
                    alt={KIT_CONFIG.experienceCollage[0].title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <span className="absolute bottom-5 left-5 right-5 text-left">
                    <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-[#F3E5AB]">
                      {KIT_CONFIG.experienceCollage[0].label}
                    </span>
                    <span className="mt-1 block text-lg font-black text-white">
                      {KIT_CONFIG.experienceCollage[0].title}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomImage(KIT_CONFIG.experienceCollage[1].image)}
                  className="group relative col-span-2 overflow-hidden rounded-[1.5rem] border border-white/20 text-left cursor-zoom-in"
                >
                  <img
                    src={KIT_CONFIG.experienceCollage[1].image}
                    alt={KIT_CONFIG.experienceCollage[1].title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                  <span className="absolute bottom-4 left-4 right-4 text-xs font-black text-white">
                    {KIT_CONFIG.experienceCollage[1].title}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setZoomImage(KIT_CONFIG.experienceCollage[2].image)}
                  className="group relative col-span-2 overflow-hidden rounded-[1.5rem] border border-white/20 text-left cursor-zoom-in"
                >
                  <img
                    src={KIT_CONFIG.experienceCollage[2].image}
                    alt={KIT_CONFIG.experienceCollage[2].title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                  <span className="absolute bottom-4 left-4 right-4 text-xs font-black text-white">
                    {KIT_CONFIG.experienceCollage[2].title}
                  </span>
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 5. 24/7 SOVEREIGN AI FLIGHT DESK + GOOGLE CALENDAR COORDINATOR    */}
        {/* ================================================================= */}
        <section id="charter-request" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <Reveal className="rounded-[2.2rem] border-2 border-[#D4AF37]/45 bg-[#080C17] p-6 shadow-[0_0_70px_rgba(212,175,55,0.14)] sm:p-10 lg:p-12">
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              {/* LEFT INFO PANEL */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE RAILWAY N8N + AI CONCIERGE
                </span>

                <h2 className="mt-5 text-3xl font-black uppercase leading-[1.06] tracking-tight text-white sm:text-5xl">
                  24/7 SOVEREIGN AI FLIGHT DESK
                </h2>

                <p className="mt-4 text-sm font-medium leading-7 text-slate-200">
                  Connected directly to <strong className="text-[#F3E5AB]">n8n-production-720dcf20.up.railway.app</strong>. Test live transcontinental charter inquiries, 6-zone cabin material specs, Google Calendar briefing slots, or white-label kit questions right now.
                </p>

                <div className="mt-7 space-y-3 border-t border-white/15 pt-6 text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-[#D4AF37]" />
                    <span>Active Zone: {activeFlyZone.zone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-[#D4AF37]" />
                    <span>Selected Aircraft: {aircraftType}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                    <span>Autonomous Lead Triage & Google Calendar Slot Dispatch</span>
                  </div>
                </div>
              </div>

              {/* RIGHT INTERACTIVE CALENDAR + CHAT CONSOLE */}
              <div className="rounded-[1.8rem] border border-[#D4AF37]/35 bg-[#050811] p-5 sm:p-6 shadow-2xl">
                {/* 2x2 VIP & GOOGLE CALENDAR SLOT HEADER */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={vipName}
                    onChange={(e) => setVipName(e.target.value)}
                    placeholder="Your Name / Family Office"
                    className="rounded-xl border border-white/15 bg-[#0B101E] px-4 py-3 text-xs font-semibold text-white placeholder-slate-400 outline-none transition focus:border-[#D4AF37]"
                  />
                  <input
                    type="email"
                    value={vipEmail}
                    onChange={(e) => setVipEmail(e.target.value)}
                    placeholder="Direct VIP Email"
                    className="rounded-xl border border-white/15 bg-[#0B101E] px-4 py-3 text-xs font-semibold text-white placeholder-slate-400 outline-none transition focus:border-[#D4AF37]"
                  />
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="rounded-xl border border-white/15 bg-[#0B101E] px-4 py-3 text-xs font-bold text-white outline-none transition focus:border-[#D4AF37]"
                  />
                  <select
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="rounded-xl border border-[#D4AF37]/45 bg-[#0B101E] px-4 py-3 text-xs font-bold text-[#F3E5AB] outline-none transition focus:border-[#D4AF37]"
                  >
                    {CALENDAR_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className="bg-[#050811] text-white">
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SCROLLABLE CHAT MESSAGES */}
                <div
                  ref={chatScrollRef}
                  className="mt-4 h-72 space-y-3 overflow-y-auto rounded-2xl border border-white/10 bg-[#080C17]/90 p-4"
                >
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] font-bold text-black shadow-md'
                            : 'border border-white/15 bg-[#0E1526] font-medium text-slate-100'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isAiThinking && (
                    <p className="text-xs italic text-[#F3E5AB]/85 animate-pulse">
                      Sovereign AI Flight Desk is computing your response...
                    </p>
                  )}
                </div>

                {/* MESSAGE INPUT + SEND */}
                <form onSubmit={handleFlightDeskSend} className="mt-4 flex gap-2.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about Geneva–Dubai charter rates, 6-zone cabin specs, or $${agencyPriceNum} kit license...`}
                    className="flex-1 rounded-xl border border-[#D4AF37]/40 bg-[#0B101E] px-4 py-3.5 text-xs font-semibold text-white placeholder-slate-400 outline-none transition focus:border-[#F3E5AB]"
                  />
                  <button
                    type="submit"
                    disabled={isAiThinking}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-6 py-3.5 text-xs font-black uppercase tracking-wider text-black shadow-lg transition hover:scale-[1.02] disabled:opacity-60 cursor-pointer"
                  >
                    <Send size={14} /> SEND
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================= */}
        {/* 6. VISUAL VAULT GALLERY (6 UNIQUE SCENES — ZERO REPEATS)          */}
        {/* ================================================================= */}
        <section id="gallery" className="scroll-mt-24 border-y border-white/15 bg-[#080C17]">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.22em] text-[#D4AF37]">
                  Visual Library • 150MP Ultra-Print
                </span>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-5xl">
                  A closer look at private aviation.
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-200">
                  Every image in this gallery is unique to this section and supplied in WebP, 4K UHD, and 150MP Ultra-Print master resolution.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All Scenes (6)', icon: Layers },
                  { id: 'cabin', label: 'Salons & Suites', icon: Aperture },
                  { id: 'dining', label: 'Sky Office', icon: Sparkles },
                  { id: 'exterior', label: 'Exteriors & Cockpit', icon: Plane }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = fleetFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFleetFilter(tab.id)}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.14em] transition cursor-pointer ${
                        active
                          ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                          : 'border-white/20 bg-white/5 text-white hover:border-[#D4AF37]'
                      }`}
                    >
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredAssets.map((item, index) => (
                  <motion.article
                    layout
                    key={item.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.35, delay: index * 0.025 }}
                    className="group overflow-hidden rounded-[1.5rem] border-2 border-white/15 hover:border-[#D4AF37] bg-[#0B101E] shadow-xl transition"
                  >
                    <button
                      type="button"
                      onClick={() => setZoomImage(item.image)}
                      className="relative block aspect-[1.38] w-full cursor-zoom-in overflow-hidden bg-black text-left"
                    >
                      <img
                        src={optimizeWebP(item.image, 1200)}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-black/85 border border-[#D4AF37]/50 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#F3E5AB] backdrop-blur">
                        {item.tag}
                      </span>
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/85 border border-[#D4AF37] text-[#F3E5AB] transition group-hover:bg-[#D4AF37] group-hover:text-black">
                        <ArrowUpRight size={17} />
                      </span>
                    </button>
                    <div className="p-6">
                      <h3 className="text-lg font-black tracking-tight text-white">{item.title}</h3>
                      <p className="mt-2 min-h-10 text-xs font-medium leading-5 text-slate-200">{item.specs}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] font-black uppercase tracking-[0.12em] text-[#D4AF37]">
                        <span>{item.resolution}</span>
                        <button
                          type="button"
                          onClick={() => setZoomImage(item.image)}
                          className="flex items-center gap-1 text-white hover:text-[#F3E5AB] cursor-pointer"
                        >
                          Inspect <ArrowUpRight size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 7. B2B LICENSING, TURNKEY BUYOUT & FREE 150MP SAMPLE VAULT        */}
        {/* ================================================================= */}
        <section id="licensing" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/15 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#F3E5AB]">
              <Crown size={14} /> Turnkey Private Aviation Brand Kit
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
              A complete private jet brand, ready to take off.
            </h2>
            <p className="mt-4 text-sm font-medium leading-7 text-slate-200 sm:text-base">
              Launch faster with the complete React + Tailwind JSX source code (including the 6-Zone Cabin Fly-Through, 16:9 Video Player & 24/7 AI Flight Desk), 60 production visuals (up to 150MP), and commercial licensing.
            </p>
          </Reveal>

          <Reveal className="mx-auto max-w-4xl mb-10">
            <div
              onClick={() => setIncludeMotionBump(!includeMotionBump)}
              className={`rounded-2xl border-2 p-5 transition cursor-pointer flex items-start gap-4 ${
                includeMotionBump
                  ? 'border-[#F3E5AB] bg-[#D4AF37]/20 shadow-[0_0_35px_rgba(212,175,55,0.25)]'
                  : 'border-[#D4AF37]/40 bg-[#0B101E] hover:border-[#D4AF37]'
              }`}
            >
              <input
                type="checkbox"
                checked={includeMotionBump}
                onChange={() => {}}
                className="mt-1 h-5 w-5 accent-[#D4AF37] cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm sm:text-base font-black uppercase text-white">
                    ⚡ Add 30s 4K/60fps Cinema Motion Pack (Seedance 2.5 & Kling 4.0)
                  </span>
                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-black uppercase text-black">
                    +$199 Order Bump
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-slate-200">
                  Includes seamless 30-second 16:9 WebM hero loop, 16:9 MP4 LED billboard master, and 9:16 vertical Reels cut.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col justify-between rounded-[1.8rem] border-2 border-white/20 bg-[#0B101E] p-7 shadow-2xl sm:p-9">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[#F3E5AB]">
                      Multi-Client Agency License
                    </span>
                    <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
                      Instant ZIP
                    </span>
                  </div>
                  <p className="mt-6 text-5xl font-black tracking-[-0.04em] text-white">${agencyPriceNum}</p>
                  <p className="mt-3 text-xs font-medium leading-6 text-slate-200">
                    For agencies, developers, and private aviation teams building a polished high-ticket digital presence.
                  </p>
                  <ul className="mt-7 space-y-3.5 text-xs font-medium text-slate-100">
                    {[
                      'Complete Aero Privé React + Tailwind JSX source (with 6-Zone Fly-Through & AI Desk)',
                      '60 production files: 20 WebP, 20 4K UHD & 20 150MP masters',
                      'Three editable PSD advertising mockups',
                      'Commercial license for unlimited client websites & print'
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePurchaseTier('standard')}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-white hover:bg-[#F3E5AB] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-black transition cursor-pointer"
                >
                  <DownloadCloud size={16} /> License Agency Kit — ${agencyPriceNum}
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.8rem] border-2 border-[#D4AF37] bg-gradient-to-b from-[#131B2E] to-[#080C16] p-7 text-white shadow-[0_0_60px_rgba(212,175,55,0.2)] sm:p-9">
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-black uppercase tracking-[0.16em] text-[#F3E5AB]">
                      1-of-1 Exclusive Buyout
                    </span>
                    <span className="rounded-full bg-[#D4AF37] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                      Single Buyer Only
                    </span>
                  </div>
                  <p className="mt-6 text-5xl font-black tracking-[-0.04em] text-[#F3E5AB]">${buyoutPriceNum}</p>
                  <p className="mt-3 text-xs font-medium leading-6 text-slate-200">
                    Exclusive ownership for a brand that wants permanent removal from our store and full IP transfer.
                  </p>
                  <ul className="mt-7 space-y-3.5 text-xs font-medium text-white">
                    {[
                      'All 60 WebP, 4K UHD and 150MP master files + permanent store removal',
                      '10 custom 150MP renders tailored to your brand palette',
                      'Private Jet Prompt Engine ruleset for internal expansion',
                      'Signed enterprise IP transfer certificate'
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#D4AF37]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => handlePurchaseTier('buyout')}
                  className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-black shadow-lg transition hover:scale-[1.02] cursor-pointer"
                >
                  <Lock size={15} /> Acquire Exclusive Rights — ${buyoutPriceNum}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="mx-auto mt-10 max-w-5xl">
            <div className="flex flex-col items-center justify-between gap-6 rounded-[1.8rem] border-2 border-[#D4AF37]/50 bg-gradient-to-r from-[#0B101E] via-[#10182C] to-[#0B101E] p-6 sm:p-8 shadow-[0_0_45px_rgba(212,175,55,0.14)] md:flex-row">
              <div className="flex items-start gap-4 text-left">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#F3E5AB]">
                  <FolderArchive size={22} />
                </span>
                <div>
                  <span className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                    Free B2B Inspection Sample • Instant Access
                  </span>
                  <h3 className="mt-1 text-lg sm:text-xl font-black text-white">
                    Download Free 150MP Sample Visuals & Technical Spec Sheet (.TXT)
                  </h3>
                  <p className="mt-1.5 max-w-xl text-xs sm:text-sm font-medium leading-relaxed text-slate-200">
                    Inspect our full-resolution sample images alongside the complete <span className="font-bold text-[#F3E5AB]">.txt</span> architecture, ICC color profile, and commercial licensing explanation before purchasing.
                  </p>
                </div>
              </div>

              <a
                href={KIT_CONFIG.freeSampleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full shrink-0 items-center justify-center gap-2.5 rounded-full border-2 border-[#D4AF37] bg-[#D4AF37]/15 px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-[#F3E5AB] shadow-lg transition hover:bg-[#D4AF37] hover:text-black md:w-auto"
              >
                <DownloadCloud size={16} />
                Download Free Sample + .TXT
                <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>
        </section>

        {/* ================================================================= */}
        {/* 8. HIGH-CONTRAST FAQ SECTION                                      */}
        {/* ================================================================= */}
        <section className="border-y border-white/15 bg-[#090E1A]">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-16 sm:px-7 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-20">
            <Reveal>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-[#D4AF37]">
                Executive FAQ
              </span>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                Good to know.
              </h2>
            </Reveal>
            <div className="divide-y divide-white/15">
              {FAQS.map((item, index) => (
                <div key={item.question} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-5 text-left cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-black text-white">{item.question}</span>
                    <ChevronDown
                      size={18}
                      className={'shrink-0 text-[#D4AF37] transition ' + (openFaq === index ? 'rotate-180' : '')}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pr-8 pt-3 text-xs sm:text-sm font-medium leading-6 text-slate-200"
                      >
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* 9. CLOSING CTA BANNER (UNIQUE IMAGE #19)                          */}
        {/* ================================================================= */}
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-7 sm:py-20 lg:px-10">
          <Reveal className="relative overflow-hidden rounded-[2rem] border-2 border-[#D4AF37]/50 bg-[#0B101E]">
            <div className="absolute inset-0">
              <img
                src={KIT_CONFIG.ctaBannerImage}
                alt="Private aviation horizon"
                loading="lazy"
                className="h-full w-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050811] via-[#050811]/85 to-transparent" />
            </div>
            <div className="relative max-w-3xl px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-16">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-[#F3E5AB]">
                Your Next Journey Starts Here
              </span>
              <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                Take the long way out of the ordinary.
              </h2>
              <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-slate-200">
                Plan a bespoke private jet journey or acquire the complete Aero Privé turnkey brand kit.
              </p>
              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
                <button
                  type="button"
                  onClick={() => scrollTo('charter-request')}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-black transition hover:scale-105 cursor-pointer"
                >
                  Open 24/7 Flight Desk <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('licensing')}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 bg-black/60 px-7 py-4 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:border-[#D4AF37] cursor-pointer"
                >
                  Acquire the Kit (${agencyPriceNum}) <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/15 bg-[#04060C] px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D4AF37] text-black">
              <Plane size={15} />
            </span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.2em] text-white">Aero Privé</span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.15em] text-[#D4AF37]">
                Sovereign Private Aviation
              </span>
            </span>
          </div>
          <p className="text-xs font-medium text-slate-300">
            Designed for considered journeys, wherever the world takes you.
          </p>
          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="text-xs font-black uppercase tracking-[0.14em] text-[#F3E5AB] transition hover:text-white cursor-pointer"
          >
            Back to Stock Vaults <ArrowRight size={13} className="ml-1 inline" />
          </button>
        </div>
      </footer>

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

      <LightboxInspector imageUrl={zoomImage} onClose={() => setZoomImage(null)} />

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

      {/* Plivajuća Prev / Next navigacija (Stranica 1 od 5) */}
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-black/90 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-2xl border-2 border-white/25 backdrop-blur-md transition hover:border-[#D4AF37] hover:text-[#F3E5AB] cursor-pointer"
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
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] text-black shadow-[0_0_30px_rgba(212,175,55,0.5)] transition hover:scale-105 cursor-pointer"
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

export default PrivateAviationKit;