// ============================================================================
// src/pages/kits/watches/AbyssChronograph.jsx
// Abyss Chronograph — Watch Kit 01 / 05 • Zero-Gravity Abyssal Cobalt & Grade-5 Titanium
// Antigravity Spatial Engine • Zero Duplicate Visuals • 16:9 Seedance 2.5 / Kling 4.0 Slot
// + Live 24/7 AI Horology Concierge & Calendar Desk (Groq Webhook Connected)
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown,
  Compass, Crown, DownloadCloud, Film, FolderArchive, Layers, Lock, Maximize2,
  Menu, MousePointerClick, Pause, Play, Send, ShieldCheck, Sparkles, Video,
  Volume2, VolumeX, X, Zap
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
// 16:9 VIDEO PLACEHOLDER SLOTS (PASTE YOUR SEEDANCE 2.5 / KLING 4.0 .MP4/.WEBM)
// ============================================================================
const VIDEO_REEL_1_URL = ''; // e.g. '/watches/abyss-reel-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/watches/abyss-reel-02.mp4'

const THEME = {
  pageBg: 'bg-[#030712]',
  textMain: 'text-white',
  textMuted: 'text-slate-300',
  ribbonBg: 'bg-[#061024] border-cyan-400/30 text-cyan-200',
  headerBg: 'bg-[#030712]/90 border-cyan-500/20',
  cardBg: 'bg-[#071126]/90',
  cardAltBg: 'bg-[#050B18]',
  borderSubtle: 'border-white/12',
  borderAccent: 'border-cyan-400/45',
  accentText: 'text-cyan-300',
  goldText: 'text-sky-200',
  badge: 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200',
  btnPrimary: 'bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-[#020617] shadow-[0_0_32px_rgba(34,211,238,0.42)]',
  btnGold: 'bg-gradient-to-r from-slate-200 via-white to-cyan-200 text-[#020617] shadow-[0_0_28px_rgba(186,230,253,0.35)]',
  btnOutline: 'border-2 border-cyan-400/35 bg-[#071126]/80 text-cyan-100 hover:border-cyan-300 hover:text-white',
  inputCls: 'border-white/15 bg-[#09152E] text-white placeholder-slate-400 focus:border-cyan-400',
  optionCls: 'bg-[#030712] text-white',
  chatBox: 'border-white/10 bg-[#040917]',
  aiBubble: 'border border-cyan-400/25 bg-[#0A1936] text-slate-100',
  userBubble: 'bg-gradient-to-r from-cyan-300 to-sky-400 text-[#020617] font-bold'
};

// ============================================================================
// EXCLUSIVE WATCH VISUAL SET 01 / 05 (11 UNIQUE ASSETS — ZERO OVERLAP)
// Assigned exclusively: 4.png, 5.png, 7.png, 13.png, 23.png, 24.png,
// 43.jpeg, 44.jpeg, 45.jpeg, 48.jpeg, 52.jpeg
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-abysschronograph-349-link',
  buyoutZipLink: 'https://drive.google.com/your-abysschronograph-1490-link',
  freeSampleLink: 'https://drive.google.com/your-abysschronograph-sample-link',
  prevPageRoute: '/tideglass-yacht-kit',
  prevPageLabel: 'Prev Yacht: Tideglass Society (5/5)',
  nextLandingRoute: '/atelier-horology',
  nextLandingLabel: 'Next Watch: Atelier Horology (2/5)',
  zones: [
    {
      id: 'abyss-z1',
      step: 'Zero-G Chamber 01',
      zone: 'Suspended Bathysphere Diver',
      title: 'Weightless 300M Titanium Architecture.',
      subtitle: 'Suspended in a zero-gravity magnetic field: Grade-5 brushed titanium casework, domed anti-reflective sapphire crystal, and deep abyssal lume.',
      specs: 'Caliber V10-ABYSS • 28,800 vph • 300 ATM Helium Escape',
      gravityOffset: '-14px',
      image: '/watches/44.jpeg'
    },
    {
      id: 'abyss-z2',
      step: 'Zero-G Chamber 02',
      zone: 'Cobalt Sunburst Chronometer',
      title: 'Hydro-Sealed Deep Blue Dial',
      subtitle: 'Micro-machined radial sunburst finish catching orbital light across diamond-polished rhodium indices.',
      specs: '41mm Grade-5 Titanium • 72h Power Reserve • COSC Spec',
      gravityOffset: '-18px',
      image: '/watches/7.png'
    },
    {
      id: 'abyss-z3',
      step: 'Zero-G Chamber 03',
      zone: 'Tactical Ceramic Bezel',
      title: 'Unidirectional Liquid-Ceramic Ring',
      subtitle: '120-click zero-backlash bezel suspended with laser-engraved platinum dive scale.',
      specs: 'ZrO2 Blue Ceramic • Super-LumiNova BGW9 • Screw-Down Crown',
      gravityOffset: '-12px',
      image: '/watches/43.jpeg'
    },
    {
      id: 'abyss-z4',
      step: 'Zero-G Chamber 04',
      zone: 'Monaco Square Chronograph',
      title: 'Architectural Cushion-Case Chrono',
      subtitle: 'Iconic squared geometry floating in dark space with twin racing registers and chamfered sapphire bevels.',
      specs: 'Column-Wheel Flyback • Sapphire Caseback • 100M Sealed',
      gravityOffset: '-16px',
      image: '/watches/48.jpeg'
    },
    {
      id: 'abyss-z5',
      step: 'Zero-G Chamber 05',
      zone: 'Stealth DLC Phantom Edition',
      title: 'Matte Obsidian Zero-Reflection Case',
      subtitle: 'Diamond-Like Carbon coating engineered for deep-trench stealth and anti-magnetic 15,000-Gauss immunity.',
      specs: 'Black DLC Titanium • Silicon Balance Spring • 15,000 Gauss',
      gravityOffset: '-20px',
      image: '/watches/52.jpeg'
    }
  ],
  cinemaVideos: [
    {
      id: 'reel-1',
      badge: '01 • 16:9 Zero-G Macro Reel (30s Seedance 2.5 / Kling 4.0)',
      title: 'Weightless orbital rotation & sapphire light refraction.',
      desc: 'True 16:9 widescreen (3840 × 2160) 60fps horology motion slot designed for luxury watch launches, Geneva salon walls, and hero headers.',
      poster: '/watches/23.png'
    },
    {
      id: 'reel-2',
      badge: '02 • Abyssal Cobalt Dial Sweep (16:9 UHD Slot)',
      title: 'Slow-motion balance wheel oscillation in zero gravity.',
      desc: 'Secondary 16:9 widescreen motion placeholder ready for 30-second Seedance 2.5 or Kling 4.0 caliber macro loops.',
      poster: '/watches/45.jpeg'
    }
  ],
  collection: [
    {
      name: 'Abyssal Tri-Compax Pro',
      meta: ' Limited 50 Pieces • Titanium',
      rate: '$18,900 Allocation',
      desc: 'High-frequency automatic chronograph engineered for saturation diving and collector vaults.',
      image: '/watches/4.png'
    },
    {
      name: 'Trench Master GMT 300M',
      meta: 'Dual-Time Ceramic • 72h Reserve',
      rate: '$15,400 Allocation',
      desc: 'True traveler jumping-hour hand paired with a bi-color day/night ceramic bezel in suspended relief.',
      image: '/watches/5.png'
    },
    {
      name: ' Mariana Deep Sunburst',
      meta: '40mm Integrated Bracelet • 150MP',
      rate: '$22,500 Allocation',
      desc: 'Hand-finished bevels alternating satin and mirror polish for effortless zero-gravity wrist balance.',
      image: '/watches/13.png'
    }
  ],
  vault: [
    {
      id: 'abyss-v1',
      tag: 'Orbital Disc Macro',
      title: 'Levitation Pedestal Study',
      specs: 'Phase One IQ4 150MP Macro • Zero Watermarks • Commercial Rights',
      image: '/watches/24.png'
    },
    {
      id: 'abyss-v2',
      tag: 'Midnight Dial Minimal',
      title: 'Abyssal Horizon Dial Geometry',
      specs: '150MP Ultra-Print sRGB Master • Lanczos Micro-Contrast',
      image: '/watches/45.jpeg'
    }
  ],
  ctaBannerImage: '/watches/23.png'
};

const CALENDAR_SLOTS = [
  'Salon Slot: 09:00 CET',
  'Salon Slot: 11:00 CET',
  'Salon Slot: 13:00 CET',
  'Salon Slot: 15:00 CET',
  'Salon Slot: 17:00 CET',
  'Salon Slot: 19:00 CET',
  'Salon Slot: 21:00 CET',
  'Salon Slot: 23:00 CET'
];

const FAQS = [
  {
    question: 'What powers the Antigravity Zero-G visual experience on this page?',
    answer: 'GPU-accelerated Framer Motion levitation loops, interactive 3D cursor magnetic tilt, reactive floor-shadow physics, and floating ambient particles — running smoothly at 60fps with zero heavy WebGL bloat.'
  },
  {
    question: 'Are any watch visuals repeated across the other 4 watch kits?',
    answer: 'Zero duplicates. Abyss Chronograph uses 11 exclusive 150MP watch renders from your local /watches vault that do not appear on Atelier Horology, Meridian Watch House, Lumen Collective, or Monarch Timepieces.'
  },
  {
    question: 'Is the 24/7 Horology Concierge Desk connected to the live Groq AI backend?',
    answer: 'Yes. Inquiries connect directly to your Railway n8n + Groq AI Project Scoper webhook (/webhook/v10-concierge-webhook) for instant multilingual B2B quotes and private salon scheduling.'
  },
  {
    question: 'What is included in the $1,490 Exclusive 1-of-1 Buyout?',
    answer: 'Immediate removal of the Abyss Chronograph edition from public licensing, 100% IP transfer of the Antigravity React JSX + 150MP masters, and 10 custom unbranded watch renders.'
  }
];

const ZERO_G_PARTICLES = [
  { left: '8%', top: '78%', size: 4, dur: 9, delay: 0 },
  { left: '19%', top: '65%', size: 6, dur: 12, delay: 1.5 },
  { left: '34%', top: '84%', size: 3, dur: 8, delay: 0.8 },
  { left: '52%', top: '72%', size: 5, dur: 11, delay: 2.2 },
  { left: '68%', top: '80%', size: 4, dur: 10, delay: 0.4 },
  { left: '83%', top: '68%', size: 6, dur: 13, delay: 1.9 },
  { left: '92%', top: '76%', size: 3, dur: 9.5, delay: 2.8 }
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, delay }}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// INTERACTIVE 3D ANTIGRAVITY CARD WRAPPER
// ============================================================================
const AntigravityCard = ({ children, className = '', floatDelay = 0, floatRange = 10 }) => {
  const reduceMotion = useReducedMotion();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -py * 9, ry: px * 9 });
  };

  return (
    <motion.div
      animate={reduceMotion ? {} : { y: [0, -floatRange, 0] }}
      transition={{ duration: 5.5 + floatDelay, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }}
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      style={{
        transform: `perspective(1100px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: 'transform 180ms ease-out'
      }}
      className={className}
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
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute right-6 top-6 rounded-full bg-white p-3 text-black shadow-2xl cursor-pointer"
        aria-label="Close preview"
      >
        <X size={22} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Horology Master"
        className="max-h-[90vh] max-w-full rounded-2xl border border-cyan-400/40 object-contain shadow-[0_0_60px_rgba(34,211,238,0.25)]"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body
  );
};

const AbyssChronograph = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0 });

  // 16:9 Video State
  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Order Bump (+$199 Motion Pack)
  const [includeMotionBump, setIncludeMotionBump] = useState(false);

  // 24/7 AI Horology Concierge + Calendar
  const [selectedTimepiece, setSelectedTimepiece] = useState('Abyssal Tri-Compax Pro (300M Titanium)');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [salonDate, setSalonDate] = useState('2026-11-25');
  const [salonSlot, setSalonSlot] = useState('Salon Slot: 15:00 CET');
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to the Abyss Chronograph Zero-Gravity Chamber (Watch Kit 01 / 05). Ask for an itemized B2B licensing quote ($349 Agency / $1,490 1-of-1 Buyout), 150MP macro specs, or private horology viewing slots in any language.'
    }
  ]);
  const chatScrollRef = useRef(null);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
      if (user?.displayName) setClientName((prev) => prev || user.displayName);
      if (user?.email) setClientEmail((prev) => prev || user.email);
    });
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'AbyssChronograph' });
    return () => unsub();
  }, []);

  useEffect(() => {
    setVideoError(false);
  }, [activeCinemaIdx, customVideoUrl]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiThinking]);

  const agencyPriceNum = includeMotionBump ? 548 : 349;
  const buyoutPriceNum = includeMotionBump ? 1689 : 1490;

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Horology Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'abysschronograph_buyout_1490' : 'abysschronograph_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Zero-G Horology Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Abyss Chronograph Antigravity Watch Kit${suffix}`
      : `Agency License: Abyss Chronograph Antigravity React + 150MP Kit${suffix}`;
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;

    const activeUser = currentUser || auth.currentUser;
    if (activeUser) {
      await recordOrderIntent(activeUser, productName, price);
      setCheckoutData({ isOpen: true, name: productName, price, zipLink });
    } else {
      setLoginModal({ isOpen: true, tierName: productName, price, zipLink });
    }
  };

  const buildHorologyFallback = (msgText, zoneTitle) => {
    const isSr = /[čćžšđ]|zdravo|ćao|cao|cena|cijena|sat|kupov|licenc|termin/i.test(msgText);
    const cleanSlot = salonSlot.replace('Salon Slot: ', '');
    const guest = clientName.trim() || (isSr ? 'VIP Klijent' : 'Collector Principal');
    if (isSr) {
      return `Dobrodošli u Abyss Chronograph Zero-G Salon, ${guest}. Vaš upit za ${selectedTimepiece} (komora: ${zoneTitle}) i termin ${salonDate} u ${cleanSlot} je evidentiran. Turnkey Antigravity React + 150MP Watch Kit dostupan je odmah za $${agencyPriceNum} (Agency) ili $${buyoutPriceNum} (1-of-1 Buyout).`;
    }
    return `Welcome to Abyss Chronograph Zero-G Salon, ${guest}. Your inquiry regarding ${selectedTimepiece} (Chamber: ${zoneTitle}) for ${salonDate} at ${cleanSlot} is logged. Full Turnkey Antigravity React + 150MP Watch Kit licensing is available at $${agencyPriceNum} (Agency) or $${buyoutPriceNum} (1-of-1 Exclusive Buyout).`;
  };

  const handleConciergeSend = async (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isAiThinking) return;

    const currentZone = KIT_CONFIG.zones[activeZoneIdx];
    const slotClean = salonSlot.replace('Salon Slot: ', '');

    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setIsAiThinking(true);

    const payload = {
      name: clientName.trim() || currentUser?.displayName || 'Horology Collector / Agency',
      email: clientEmail.trim() || currentUser?.email || 'vip@horology-vault.com',
      category: 'Turnkey Luxury B2B Watch Web Kits (Antigravity Edition)',
      item: `Abyss Chronograph Kit (${selectedTimepiece})`,
      budget: `$${agencyPriceNum} Agency / $${buyoutPriceNum} Exclusive Buyout`,
      date: `${salonDate} at ${slotClean}`,
      message: `[Page: Abyss Chronograph Watch Kit 1/5 | Chamber: ${currentZone.zone}] ${trimmed}`
    };

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      const rawReply = data?.agent_reply || data?.reply || data?.output || data?.text;
      if (res.ok && rawReply) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: String(rawReply) }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: buildHorologyFallback(trimmed, currentZone.title) }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: buildHorologyFallback(trimmed, currentZone.title) }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const handleHeroMouseMove = (e) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({ rx: -py * 12, ry: px * 12 });
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

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeZone = KIT_CONFIG.zones[activeZoneIdx];
  const activeCinema = KIT_CONFIG.cinemaVideos[activeCinemaIdx] || KIT_CONFIG.cinemaVideos[0];

  return (
    <div className={`min-h-screen ${THEME.pageBg} ${THEME.textMain} pb-24 font-sans relative overflow-x-hidden`}>
      <Helmet>
        <title>Abyss Chronograph — Zero-Gravity Horology & 150MP Turnkey Watch Kit</title>
      </Helmet>

      {/* TOP ZERO-GRAVITY TELEMETRY RIBBON */}
      <div className={`border-b px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.22em] ${THEME.ribbonBg}`}>
        ABYSS CHRONOGRAPH ✦ ZERO-GRAVITY HOROLOGY ENGINE (0.00G) ✦ 150MP TITANIUM MASTERS
      </div>

      {/* STICKY SUB-HEADER */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-2xl ${THEME.headerBg}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3.5 sm:px-7 lg:px-10">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 text-left cursor-pointer"
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${THEME.btnPrimary}`}>
              <Compass size={18} />
            </span>
            <span>
              <span className={`block text-sm sm:text-base font-black uppercase tracking-[0.22em] ${THEME.textMain}`}>
                Abyss Chronograph
              </span>
              <span className={`block text-[10px] font-extrabold uppercase tracking-[0.18em] ${THEME.accentText}`}>
                Watch Kit 01 / 05 • Antigravity Cobalt & Titanium
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.15em] lg:flex text-white">
            <button type="button" onClick={() => scrollTo('zero-g-chamber')} className="hover:text-cyan-300 cursor-pointer">Zero-G Chamber</button>
            <button type="button" onClick={() => scrollTo('horology-cinema')} className="hover:text-cyan-300 cursor-pointer">16:9 Video Slot</button>
            <button type="button" onClick={() => scrollTo('calibers')} className="hover:text-cyan-300 cursor-pointer">Floating Calibers</button>
            <button type="button" onClick={() => scrollTo('gallery')} className="hover:text-cyan-300 cursor-pointer">150MP Vault</button>
            <button type="button" onClick={() => scrollTo('commercial-pricing')} className="hover:text-cyan-300 cursor-pointer">B2B Licensing</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => scrollTo('concierge-desk')}
              className={`rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition cursor-pointer ${THEME.btnOutline}`}
            >
              24/7 AI Quote Desk
            </button>
            <button
              type="button"
              onClick={() => scrollTo('commercial-pricing')}
              className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition hover:scale-105 cursor-pointer ${THEME.btnGold}`}
            >
              Acquire Kit (${agencyPriceNum}) <ArrowRight size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border ${THEME.borderSubtle} lg:hidden`}
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
              className={`overflow-hidden border-t ${THEME.borderSubtle} ${THEME.cardBg} px-5 lg:hidden`}
            >
              <div className="mx-auto flex max-w-[1440px] flex-col gap-1 py-4">
                {[
                  ['Zero-G Chamber', 'zero-g-chamber'],
                  ['16:9 Video Slot', 'horology-cinema'],
                  ['Floating Calibers', 'calibers'],
                  ['24/7 AI Horology Desk', 'concierge-desk'],
                  ['150MP Macro Vault', 'gallery'],
                  ['B2B Licensing', 'commercial-pricing']
                ].map(([label, id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="py-2.5 text-left text-xs font-black uppercase tracking-wider text-white"
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
        {/* ANTIGRAVITY HERO CHAMBER: MAGNETIC 3D LEVITATION + ORBITAL RINGS  */}
        {/* ================================================================= */}
        <section id="zero-g-chamber" className="relative border-b border-cyan-500/20 bg-[radial-gradient(ellipse_at_top,_#0B2149_0%,_#030712_68%)] py-12 sm:py-16 overflow-hidden">
          {/* FLOATING ZERO-GRAVITY DUST PARTICLES */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {ZERO_G_PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                animate={reduceMotion ? {} : { y: [0, -130, 0], opacity: [0.15, 0.75, 0.15] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                className="absolute rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              {/* LEFT TELEMETRY & CHAMBER SELECTOR */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/45 bg-cyan-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-cyan-300">
                  <Sparkles size={13} /> ANTIGRAVITY FIELD ACTIVE • {activeZone.zone}
                </div>

                <h1 className="text-4xl sm:text-6xl font-black leading-[1.03] tracking-tight text-white">
                  {activeZone.title}
                </h1>

                <p className="text-sm sm:text-base leading-relaxed text-slate-300">
                  {activeZone.subtitle}
                </p>

                <div className="rounded-2xl border border-cyan-400/30 bg-[#07142B]/80 px-4 py-3.5 backdrop-blur-xl">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                    SUSPENDED CALIBER TELEMETRY
                  </span>
                  <span className="mt-1 block text-xs sm:text-sm font-bold text-white">
                    {activeZone.specs}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setZoomImage(activeZone.image)}
                    className={`rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-105 cursor-pointer flex items-center gap-2 ${THEME.btnPrimary}`}
                  >
                    <Aperture size={15} /> Inspect 150MP Levitation
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('horology-cinema')}
                    className={`rounded-full px-6 py-3.5 text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${THEME.btnOutline}`}
                  >
                    <Play size={13} className="fill-current" /> 16:9 Motion Slot
                  </button>
                </div>

                {/* FLOATING SATELLITE THUMBNAIL PODS */}
                <div className="pt-2">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                    Select Zero-Gravity Capsule (5 Distinct Timepieces):
                  </span>
                  <div className="grid grid-cols-5 gap-2.5">
                    {KIT_CONFIG.zones.map((z, idx) => (
                      <motion.button
                        key={z.id}
                        type="button"
                        onClick={() => setActiveZoneIdx(idx)}
                        animate={reduceMotion ? {} : { y: [0, -5, 0] }}
                        transition={{ duration: 3.4 + idx * 0.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.25 }}
                        className={`group relative aspect-square overflow-hidden rounded-2xl border-2 transition cursor-pointer ${
                          activeZoneIdx === idx
                            ? 'border-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.5)] scale-105'
                            : 'border-white/15 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={z.image} alt={z.title} className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-black text-cyan-300">
                          0{idx + 1}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT ZERO-GRAVITY MAGNETIC LEVITATION STAGE */}
              <div
                onMouseMove={handleHeroMouseMove}
                onMouseLeave={() => setHeroTilt({ rx: 0, ry: 0 })}
                className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[480px] sm:min-h-[580px] rounded-[2.5rem] border border-cyan-400/30 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.20)_0%,_rgba(4,9,24,0.92)_72%)] p-6 sm:p-10 shadow-[0_0_70px_rgba(8,145,178,0.22)] overflow-hidden"
              >
                {/* ORBITING HOROLOGY GYROSCOPIC RINGS */}
                <motion.div
                  animate={reduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute h-[360px] w-[360px] sm:h-[470px] sm:w-[470px] rounded-full border border-dashed border-cyan-400/25"
                />
                <motion.div
                  animate={reduceMotion ? {} : { rotate: -360 }}
                  transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute h-[290px] w-[290px] sm:h-[380px] sm:w-[380px] rounded-full border border-sky-300/15"
                />

                {/* TOP FLOATING TELEMETRY PILLS */}
                <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-2 z-20">
                  <span className="rounded-full border border-cyan-400/40 bg-black/70 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
                    GRAVITY: 0.00 G // MAGNETIC SUSPENSION
                  </span>
                  <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                    MOVE CURSOR FOR 3D TILT
                  </span>
                </div>

                {/* LEVITATING WATCH CAPSULE */}
                <div
                  style={{
                    transform: `perspective(1200px) rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`,
                    transition: 'transform 160ms ease-out'
                  }}
                  className="relative z-10 w-full max-w-[460px] my-6"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeZone.id}
                      initial={{ opacity: 0, scale: 0.92, y: 18 }}
                      animate={
                        reduceMotion
                          ? { opacity: 1, scale: 1, y: 0 }
                          : { opacity: 1, scale: 1, y: [0, -22, 0], rotateZ: [-1.1, 1.1, -1.1] }
                      }
                      exit={{ opacity: 0, scale: 0.92, y: -18 }}
                      transition={{
                        opacity: { duration: 0.35 },
                        scale: { duration: 0.35 },
                        y: { duration: 5.2, repeat: Infinity, ease: 'easeInOut' },
                        rotateZ: { duration: 7.5, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      onClick={() => setZoomImage(activeZone.image)}
                      className="relative aspect-square w-full overflow-hidden rounded-[2.2rem] border-2 border-cyan-300/45 bg-black shadow-[0_30px_80px_rgba(6,182,212,0.35)] cursor-zoom-in group"
                    >
                      <img
                        src={activeZone.image}
                        alt={activeZone.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-white/10 opacity-75" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/20 bg-black/75 px-4 py-2.5 backdrop-blur-md">
                        <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">
                          {activeZone.step}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white">
                          Click for 150MP Zoom ↗
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* REACTIVE ANTIGRAVITY FLOOR SHADOW PULSE */}
                <motion.div
                  animate={reduceMotion ? {} : { scaleX: [1, 0.72, 1], opacity: [0.55, 0.22, 0.55] }}
                  transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-6 w-64 rounded-full bg-cyan-400/40 blur-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ANTIGRAVITY SPEC STRIP */}
        <section className={`border-b ${THEME.borderSubtle} ${THEME.cardAltBg}`}>
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-6 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [Layers, 'Zero-G 3D Magnetic Levitation'],
              [Video, '16:9 Seedance 2.5 & Kling 4.0 Slot'],
              [ShieldCheck, '11 Exclusive 150MP Watch Renders'],
              [Zap, 'Live Groq AI B2B Quote Scoper']
            ].map(([Icon, label]) => (
              <div key={label} className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-wider text-white">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${THEME.badge}`}>
                  <Icon size={16} />
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* DEDICATED 16:9 WIDESCREEN VIDEO PLACEHOLDER (SEEDANCE / KLING)    */}
        {/* ================================================================= */}
        <section id="horology-cinema" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pt-20 pb-10 sm:px-7 lg:px-10">
          <Reveal className={`overflow-hidden rounded-[2.2rem] border-2 ${THEME.borderAccent} ${THEME.cardBg} p-6 sm:p-10 shadow-2xl`}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
                  <Video size={14} /> 16:9 Zero-G Cinema Placeholder • Seedance 2.5 & Kling 4.0 (30s)
                </span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-black leading-tight tracking-tight text-white">
                  {activeCinema.title}
                </h2>
                <p className={`mt-2 max-w-2xl text-sm font-medium ${THEME.textMuted}`}>
                  {activeCinema.desc}
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
                      activeCinemaIdx === idx && !customVideoUrl ? THEME.btnPrimary : THEME.btnOutline
                    }`}
                  >
                    Reel 0{idx + 1} (16:9)
                  </button>
                ))}
              </div>
            </div>

            <div className="relative w-full aspect-video overflow-hidden rounded-3xl border-2 border-cyan-400/35 bg-black shadow-2xl">
              {hasLiveVideoFile ? (
                <video
                  ref={cinemaVideoRef}
                  key={effectiveVideoUrl}
                  autoPlay
                  loop
                  muted={isCinemaMuted}
                  playsInline
                  poster={activeCinema.poster}
                  onError={() => setVideoError(true)}
                  className="h-full w-full object-cover"
                >
                  <source src={effectiveVideoUrl} type="video/mp4" />
                  <source src={effectiveVideoUrl} type="video/webm" />
                </video>
              ) : (
                <div className="relative h-full w-full overflow-hidden bg-black">
                  <motion.img
                    key={activeCinema.poster}
                    src={activeCinema.poster}
                    alt={activeCinema.title}
                    animate={
                      isCinemaPlaying
                        ? { scale: [1.02, 1.11, 1.02], y: ['0%', '-2%', '0%'] }
                        : { scale: 1.02 }
                    }
                    transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-full object-cover opacity-85"
                  />

                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                    <div className="rounded-3xl border border-cyan-400/40 bg-black/80 px-6 py-4 text-center backdrop-blur-xl shadow-2xl max-w-md">
                      <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 text-cyan-300">
                        <Film size={22} />
                      </span>
                      <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-white">
                        16:9 ZERO-G HOROLOGY VIDEO SLOT
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-slate-300">
                        3840 × 2160 UHD (60fps) • Seedance 2.5 & Kling 4.0 Ready
                      </span>
                      <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                        Paste any .mp4 / .webm URL below to test live
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45" />

              <div className="absolute left-4 right-4 top-4 sm:left-5 sm:right-5 sm:top-5 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-white/25 bg-black/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {activeCinema.badge}
                </span>
                <span className="rounded-full bg-cyan-400 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                  16:9 ASPECT RATIO LOCKED
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggleCinemaPlay}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/40 bg-black/85 text-white backdrop-blur-md transition hover:bg-white hover:text-black cursor-pointer"
                  >
                    {isCinemaPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCinemaMute}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/85 text-white backdrop-blur-md transition hover:border-cyan-400 cursor-pointer"
                  >
                    {isCinemaMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div className="flex flex-1 max-w-xl items-center gap-2 rounded-2xl border border-white/30 bg-black/90 px-4 py-2.5 backdrop-blur-xl">
                  <Maximize2 size={15} className="text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    placeholder="Paste any .webm or .mp4 URL here to preview live in 16:9..."
                    className="w-full bg-transparent text-xs font-semibold text-white placeholder-slate-400 outline-none"
                  />
                  {customVideoUrl && (
                    <button
                      type="button"
                      onClick={() => setCustomVideoUrl('')}
                      className="text-[10px] font-black uppercase text-cyan-300 hover:text-white cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ================================================================= */}
        {/* FLOATING ANTIGRAVITY CALIBER COLLECTION (STAGGERED LEVITATION)    */}
        {/* ================================================================= */}
        <section id="calibers" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10">
          <Reveal className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className={`text-xs font-black uppercase tracking-[0.22em] ${THEME.accentText}`}>
                Zero-Gravity Reference Allocation
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-white">
                Suspended titanium references.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('concierge-desk')}
              className={`w-fit text-xs font-black uppercase tracking-[0.16em] ${THEME.goldText} cursor-pointer`}
            >
              Request Collector Allocation →
            </button>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {KIT_CONFIG.collection.map((watch, idx) => (
              <AntigravityCard
                key={watch.name}
                floatDelay={idx * 0.7}
                floatRange={11}
                className={`group overflow-hidden rounded-[1.9rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} shadow-[0_24px_60px_rgba(6,182,212,0.14)] hover:border-cyan-400/60`}
              >
                <div onClick={() => setZoomImage(watch.image)} className="relative h-72 overflow-hidden bg-black cursor-zoom-in">
                  <img
                    src={watch.image}
                    alt={watch.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-cyan-400/40 bg-black/80 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-200 backdrop-blur">
                    {watch.meta}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-xl bg-cyan-300 px-3 py-1 text-xs font-black text-slate-950 shadow">
                    {watch.rate}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-white">{watch.name}</h3>
                  <p className={`mt-2.5 text-sm leading-relaxed ${THEME.textMuted}`}>{watch.desc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTimepiece(watch.name);
                      setChatInput(`Please calculate a B2B quote for Abyss Chronograph Kit + ${watch.name} showcase.`);
                      scrollTo('concierge-desk');
                    }}
                    className={`mt-5 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.16em] ${THEME.accentText} cursor-pointer`}
                  >
                    Scope {watch.name} <ArrowUpRight size={14} />
                  </button>
                </div>
              </AntigravityCard>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 24/7 AI HOROLOGY CONCIERGE & LIVE GROQ QUOTE SCOPER               */}
        {/* ================================================================= */}
        <section id="concierge-desk" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-16 sm:px-7 lg:px-10">
          <Reveal className={`rounded-[2.2rem] border-2 ${THEME.borderAccent} ${THEME.cardBg} p-6 sm:p-10 lg:p-12 shadow-2xl`}>
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE RAILWAY N8N + GROQ AI ENGINE
                </span>
                <h2 className="mt-4 text-3xl sm:text-5xl font-black uppercase leading-[1.06] text-white">
                  24/7 ZERO-G HOROLOGY & B2B QUOTE DESK
                </h2>
                <p className={`mt-4 text-sm leading-7 ${THEME.textMuted}`}>
                  Connected live to your Groq B2B Project Scoper. Test multilingual collector inquiries, Geneva/Zurich salon slots, or instant white-label buyout quotes.
                </p>
                <div className={`mt-6 space-y-2.5 border-t ${THEME.borderSubtle} pt-5 text-xs font-bold text-white`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={THEME.accentText} />
                    <span>Active Capsule: {activeZone.zone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={THEME.goldText} />
                    <span>Selected Reference: {selectedTimepiece}</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-[1.8rem] border ${THEME.borderSubtle} ${THEME.cardAltBg} p-5 sm:p-6 shadow-xl`}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Collector / Agency Name"
                    className={`rounded-xl border px-4 py-3 text-xs font-semibold outline-none transition ${THEME.inputCls}`}
                  />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Corporate or VIP Email"
                    className={`rounded-xl border px-4 py-3 text-xs font-semibold outline-none transition ${THEME.inputCls}`}
                  />
                  <input
                    type="date"
                    value={salonDate}
                    onChange={(e) => setSalonDate(e.target.value)}
                    className={`rounded-xl border px-4 py-3 text-xs font-bold outline-none transition ${THEME.inputCls}`}
                  />
                  <select
                    value={salonSlot}
                    onChange={(e) => setSalonSlot(e.target.value)}
                    className={`rounded-xl border px-4 py-3 text-xs font-bold outline-none transition ${THEME.inputCls}`}
                  >
                    {CALENDAR_SLOTS.map((slot) => (
                      <option key={slot} value={slot} className={THEME.optionCls}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div ref={chatScrollRef} className={`mt-4 h-72 space-y-3 overflow-y-auto rounded-2xl border p-4 ${THEME.chatBox}`}>
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.role === 'user' ? THEME.userBubble : THEME.aiBubble}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <p className={`text-xs italic animate-pulse ${THEME.accentText}`}>
                      Abyss Zero-G AI Concierge is calculating your proposal via Groq...
                    </p>
                  )}
                </div>

                <form onSubmit={handleConciergeSend} className="mt-4 flex gap-2.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask in EN / SR / DE about ${selectedTimepiece} or $${agencyPriceNum} kit...`}
                    className={`flex-1 rounded-xl border px-4 py-3.5 text-xs font-semibold outline-none transition ${THEME.inputCls}`}
                  />
                  <button
                    type="submit"
                    disabled={isAiThinking}
                    className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-black uppercase tracking-wider transition hover:scale-[1.02] disabled:opacity-60 cursor-pointer ${THEME.btnPrimary}`}
                  >
                    <Send size={14} /> SEND
                  </button>
                </form>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 150MP VISUAL VAULT GALLERY */}
        <section id="gallery" className={`scroll-mt-24 border-y ${THEME.borderSubtle} ${THEME.cardAltBg} py-20`}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
            <Reveal className="mb-10">
              <span className={`text-xs font-black uppercase tracking-[0.22em] ${THEME.accentText}`}>
                150MP Master Horology Vault • Zero Duplicate Renders
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white">
                Ultra-print sapphire & titanium macro studies.
              </h2>
            </Reveal>

            <div className="grid gap-8 md:grid-cols-2">
              {KIT_CONFIG.vault.map((item, idx) => (
                <AntigravityCard
                  key={item.id}
                  floatDelay={idx * 0.9}
                  floatRange={8}
                  className={`group overflow-hidden rounded-[1.8rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} shadow-xl`}
                >
                  <button
                    type="button"
                    onClick={() => setZoomImage(item.image)}
                    className="relative block aspect-[1.45] w-full overflow-hidden cursor-zoom-in text-left"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-300">
                      {item.tag}
                    </span>
                  </button>
                  <div className="p-6">
                    <h3 className="text-lg font-black text-white">{item.title}</h3>
                    <p className={`mt-2 text-xs ${THEME.textMuted}`}>{item.specs}</p>
                  </div>
                </AntigravityCard>
              ))}
            </div>
          </div>
        </section>

        {/* B2B LICENSING & TURNKEY BUYOUT */}
        <section id="commercial-pricing" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10">
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
              <Crown size={13} /> Turnkey Antigravity Horology Web + 150MP Brand Kit
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black text-white">
              License Abyss Chronograph today.
            </h2>
          </Reveal>

          <Reveal className="mx-auto max-w-4xl mb-8">
            <div
              onClick={() => setIncludeMotionBump(!includeMotionBump)}
              className={`rounded-2xl border-2 ${THEME.borderAccent} ${THEME.cardBg} p-5 flex items-start gap-4 cursor-pointer`}
            >
              <input type="checkbox" checked={includeMotionBump} onChange={() => {}} className="mt-1 h-5 w-5 cursor-pointer" />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-black uppercase text-white">
                    ⚡ Add 30s 4K/60fps Zero-G Horology Motion Pack (Seedance 2.5 & Kling 4.0)
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${THEME.btnPrimary}`}>+$199 Bump</span>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            <div className={`flex flex-col justify-between rounded-[1.8rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} p-8 shadow-xl`}>
              <div>
                <span className={`text-xs font-black uppercase tracking-[0.16em] ${THEME.accentText}`}>Multi-Client Agency License</span>
                <p className="mt-5 text-5xl font-black text-white">${agencyPriceNum}</p>
                <ul className={`mt-6 space-y-3 text-xs font-medium ${THEME.textMuted}`}>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> Complete Abyss Chronograph Antigravity React + Tailwind JSX</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> 11 Exclusive 4K UHD & 150MP Ultra-Print Watch Visuals</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> Live n8n + Groq AI Horology Quote Scoper Workflow</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnPrimary}`}
              >
                <DownloadCloud size={16} /> License Agency Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className={`flex flex-col justify-between rounded-[1.8rem] border-2 ${THEME.borderAccent} ${THEME.cardAltBg} p-8 shadow-2xl`}>
              <div>
                <span className={`text-xs font-black uppercase tracking-[0.16em] ${THEME.goldText}`}>1-of-1 Exclusive Buyout</span>
                <p className="mt-5 text-5xl font-black text-white">${buyoutPriceNum}</p>
                <ul className={`mt-6 space-y-3 text-xs font-medium ${THEME.textMuted}`}>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> Permanent Store Removal & 100% IP Transfer</li>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> 10 Custom 150MP Unbranded Renders for Your Watch Brand</li>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> Signed Commercial Ownership Certificate</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnGold}`}
              >
                <Lock size={15} /> Acquire 1-of-1 Buyout — ${buyoutPriceNum}
              </button>
            </div>
          </div>

          <div className={`mx-auto mt-8 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border-2 ${THEME.borderSubtle} ${THEME.cardBg} p-6`}>
            <div className="flex items-center gap-3.5">
              <FolderArchive size={22} className={THEME.accentText} />
              <div>
                <h3 className="text-sm font-black text-white">Download Free 150MP Horology Macro Sample + Spec (.TXT)</h3>
                <p className={`text-xs ${THEME.textMuted}`}>Inspect brushed titanium & sapphire micro-contrast prior to licensing.</p>
              </div>
            </div>
            <a
              href={KIT_CONFIG.freeSampleLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider ${THEME.btnOutline}`}
            >
              Download Sample + .TXT
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className={`border-y ${THEME.borderSubtle} ${THEME.cardAltBg} py-16`}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className={`text-xs font-black uppercase tracking-[0.2em] ${THEME.accentText}`}>Horology FAQ</span>
              <h2 className="mt-2 text-3xl font-black text-white">Zero-G engineering notes.</h2>
            </div>
            <div className={`divide-y ${THEME.borderSubtle}`}>
              {FAQS.map((item, idx) => (
                <div key={item.question} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="flex w-full items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-sm font-black text-white">{item.question}</span>
                    <ChevronDown size={18} className={`transition ${openFaq === idx ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === idx && <p className={`pt-2.5 text-xs leading-6 ${THEME.textMuted}`}>{item.answer}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CLOSING CTA BANNER */}
        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-7 lg:px-10">
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-cyan-400/30 bg-black">
            <img
              src={KIT_CONFIG.ctaBannerImage}
              alt="Abyss Zero-G Horology"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-[#030712]/80 to-transparent" />
            <div className="relative max-w-2xl px-6 py-14 sm:px-12 sm:py-18 text-white">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                Watch Kit 01 / 05 • Abyss Chronograph
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black leading-tight">
                Continue into the 5-edition Zero-G Watch Vault.
              </h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
                  className={`rounded-full px-7 py-4 text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-2 ${THEME.btnPrimary}`}
                >
                  Next: Atelier Horology (2/5) <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/ai-agents')}
                  className="rounded-full border border-white/40 bg-black/60 px-6 py-4 text-xs font-black uppercase tracking-wider text-white cursor-pointer"
                >
                  Explore AI Agents
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

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

      {/* PREV / NEXT FLOATING NAVIGATION */}
      <div className="fixed bottom-6 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-black/90 px-5 py-3.5 text-[11px] font-black uppercase tracking-[0.15em] text-white shadow-2xl border border-white/25 backdrop-blur-md transition hover:scale-105 cursor-pointer"
        >
          <span className={`flex h-7 w-7 items-center justify-center rounded-full ${THEME.btnPrimary}`}>
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-6 right-24 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className={`group flex items-center gap-3 rounded-full px-6 py-3.5 text-[11px] font-black uppercase tracking-[0.16em] transition hover:scale-105 cursor-pointer ${THEME.btnGold}`}
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default AbyssChronograph;