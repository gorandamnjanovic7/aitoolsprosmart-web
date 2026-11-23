// ============================================================================
// src/pages/kits/watches/LumenWatchCollective.jsx
// Lumen Watch Collective — Watch Kit 04 / 05 • Monumental Full-Viewport Antigravity Hero
// Cryo-Platinum, Sapphire Prism & Violet-Ice Zero-Gravity Horology Vault
// Zero Duplicate Visuals • 16:9 Seedance 2.5 / Kling 4.0 Slot + Live Groq Webhook
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown,
  Crown, DownloadCloud, Film, FolderArchive, Layers, Lock, Maximize2,
  Menu, Pause, Play, Send, ShieldCheck, Sparkles, Sun, Video,
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
const VIDEO_REEL_1_URL = ''; // e.g. '/watches/lumen-reel-01.mp4'
const VIDEO_REEL_2_URL = ''; // e.g. '/watches/lumen-reel-02.mp4'

const THEME = {
  pageBg: 'bg-[#05040D]',
  textMain: 'text-white',
  textMuted: 'text-indigo-100/75',
  ribbonBg: 'bg-[#0C0920] border-violet-400/35 text-violet-200',
  headerBg: 'bg-[#05040D]/92 border-violet-500/20',
  cardBg: 'bg-[#0B091B]/92',
  cardAltBg: 'bg-[#070612]',
  borderSubtle: 'border-white/12',
  borderAccent: 'border-violet-400/45',
  accentText: 'text-violet-300',
  goldText: 'text-indigo-200',
  badge: 'border-violet-400/40 bg-violet-500/10 text-violet-200',
  btnPrimary: 'bg-gradient-to-r from-violet-400 via-fuchsia-300 to-indigo-400 text-[#05040D] shadow-[0_0_34px_rgba(167,139,250,0.45)]',
  btnGold: 'bg-gradient-to-r from-slate-100 via-white to-violet-200 text-[#05040D] shadow-[0_0_28px_rgba(221,214,254,0.38)]',
  btnOutline: 'border-2 border-violet-400/35 bg-[#0B091B]/85 text-violet-100 hover:border-violet-300 hover:text-white',
  inputCls: 'border-white/15 bg-[#110E26] text-white placeholder-slate-400 focus:border-violet-400',
  optionCls: 'bg-[#05040D] text-white',
  chatBox: 'border-white/10 bg-[#070513]',
  aiBubble: 'border border-violet-400/25 bg-[#120E2B] text-slate-100',
  userBubble: 'bg-gradient-to-r from-violet-300 to-indigo-300 text-[#05040D] font-bold'
};

// ============================================================================
// EXCLUSIVE WATCH VISUAL SET 04 / 05 (10 UNIQUE ASSETS — ZERO OVERLAP)
// Assigned exclusively: 2.png, 6.png, 16.png, 17.png, 18.png, 19.png,
// 20.png, 36.jpeg, 37.jpeg, 46.jpeg
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-lumenwatchcollective-349-link',
  buyoutZipLink: 'https://drive.google.com/your-lumenwatchcollective-1490-link',
  freeSampleLink: 'https://drive.google.com/your-lumenwatchcollective-sample-link',
  prevPageRoute: '/meridian-watch-house',
  prevPageLabel: 'Prev Watch: Meridian House (3/5)',
  nextLandingRoute: '/monarch-timepieces',
  nextLandingLabel: 'Next Watch: Monarch Timepieces (5/5)',
  zones: [
    {
      id: 'lumen-z1',
      step: 'Prism Capsule 01',
      zone: 'Full-Sapphire Monobloc Case',
      title: 'Pure Light Suspended in Zero Gravity.',
      subtitle: 'Machined from a single 2,000-hour synthetic sapphire boule: 360-degree optical transparency, cryo-treated platinum bridges, and spectral Super-LumiNova.',
      specs: 'Caliber V10-LUMEN • Monobloc Sapphire • 9 Mohs Scratch Immunity',
      backdrop: '/watches/16.png',
      image: '/watches/2.png'
    },
    {
      id: 'lumen-z2',
      step: 'Prism Capsule 02',
      zone: 'Cryo-Silver Sunburst Chronometer',
      title: 'Glacial Rhodium & Ice-Polished Bezel',
      subtitle: 'Mirror-lapped Zaratsu facets catching ultraviolet and studio rim-light across an ultra-clean monochrome dial.',
      specs: '40.5mm 950 Platinum • High-Beat 36,000 vph • Zero-Distortion Dome',
      backdrop: '/watches/17.png',
      image: '/watches/6.png'
    },
    {
      id: 'lumen-z3',
      step: 'Prism Capsule 03',
      zone: 'Translucent Lume Architecture',
      title: 'Photonic Night-Emission Dial',
      subtitle: 'Solid grade-X1 luminous ceramic indices floating over a frosted sapphire mainplate for unmistakable nocturnal legibility.',
      specs: 'Solid Ceramic Lume Blocks • 80h Twin Barrel • Anti-Reflective AR6',
      backdrop: '/watches/20.png',
      image: '/watches/36.jpeg'
    },
    {
      id: 'lumen-z4',
      step: 'Prism Capsule 04',
      zone: 'Crystalline Dress Complication',
      title: 'Weightless Minimalist Profile',
      subtitle: 'Ultra-slender 6.8mm platinum silhouette suspended effortlessly with diamond-polished dauphine hands.',
      specs: '6.8mm Ultra-Thin • Platinum Micro-Rotor • 50M Hermetic Seal',
      backdrop: '/watches/18.png',
      image: '/watches/37.jpeg'
    },
    {
      id: 'lumen-z5',
      step: 'Prism Capsule 05',
      zone: 'Spectral Indigo Dress Study',
      title: 'Deep-Space Ultraviolet Refraction',
      subtitle: 'PVD-treatedmidnight sapphire dial shifting between cosmic indigo and electric violet as viewing angles change.',
      specs: 'Chromatic PVD Sapphire Dial • Silicon Escapement • 150MP Master',
      backdrop: '/watches/19.png',
      image: '/watches/46.jpeg'
    }
  ],
  cinemaVideos: [
    {
      id: 'reel-1',
      badge: '01 • 16:9 Sapphire Prism Levitation Reel (30s Seedance 2.5 / Kling 4.0)',
      title: 'Optical light dispersion through suspended sapphire casework.',
      desc: 'True 16:9 widescreen (3840 × 2160) 60fps cinema placeholder built for avant-garde horology collectives, Zurich concept galleries, and hero campaigns.',
      poster: '/watches/17.png'
    },
    {
      id: 'reel-2',
      badge: '02 • Cryo-Platinum Rim-Light Sweep (16:9 UHD Slot)',
      title: 'Zero-gravity silver dial reflections & nocturnal lume ignition.',
      desc: 'Secondary 16:9 widescreen motion placeholder engineered for 30-second Seedance 2.5 or Kling 4.0 sapphire refraction loops.',
      poster: '/watches/20.png'
    }
  ],
  collection: [
    {
      name: 'Lumen Spectral One Sapphire',
      meta: 'Monobloc Sapphire • Limited 12',
      rate: '$88,000 Allocation',
      desc: 'Complete 360-degree transparent sapphire housing exposing a suspended titanium-and-platinum skeleton caliber.',
      image: '/watches/16.png'
    },
    {
      name: 'Cryo-Blade Integrated 40',
      meta: 'Ice-Brushed Steel & Pt • High-Beat',
      rate: '$29,500 Allocation',
      desc: 'Razor-sharp architectural lug geometry with alternating frost-matte and mirror-polished surfaces.',
      image: '/watches/18.png'
    },
    {
      name: 'Photonic Horizon Chrono',
      meta: 'Luminous Sub-Dials • 150MP',
      rate: '$34,900 Allocation',
      desc: 'Engineered for contemporary collectors seeking futuristic light play, weightless ergonomics, and chronometric rigor.',
      image: '/watches/19.png'
    }
  ],
  vault: [
    {
      id: 'lumen-v1',
      tag: 'Sapphire Refraction I',
      title: 'Glacial Rim-Light Macro Profile',
      specs: 'Phase One IQ4 150MP Master • Zero Watermarks • Commercial License',
      image: '/watches/17.png'
    },
    {
      id: 'lumen-v2',
      tag: 'Sapphire Refraction II',
      title: 'Monochrome Studio Pedestal Study',
      specs: '150MP Ultra-Print sRGB Master • Lanczos Micro-Contrast',
      image: '/watches/20.png'
    }
  ],
  ctaBannerImage: '/watches/16.png'
};

const CALENDAR_SLOTS = [
  'Lumen Lab Slot: 09:30 CET',
  'Lumen Lab Slot: 11:30 CET',
  'Lumen Lab Slot: 13:30 CET',
  'Lumen Lab Slot: 15:30 CET',
  'Lumen Lab Slot: 17:30 CET',
  'Lumen Lab Slot: 19:30 CET',
  'Lumen Lab Slot: 21:30 CET',
  'Lumen Lab Slot: 23:00 CET'
];

const FAQS = [
  {
    question: 'What defines the Lumen Watch Collective Antigravity aesthetic?',
    answer: 'Lumen Watch Collective focuses on avant-garde independent horology: full-viewport Zero-Gravity Sapphire Prism physics, cryo-platinum reflections, violet-ice photon particles, and 3D cursor-reactive tilt.'
  },
  {
    question: 'Are all 10 watch visuals on Lumen Watch Collective completely unique?',
    answer: 'Yes. Assets 2, 6, 16, 17, 18, 19, 20, 36, 37, and 46 from /public/watches are assigned exclusively to Lumen Watch Collective with zero repetition across any other page.'
  },
  {
    question: 'Is the 24/7 Lumen Concierge Desk connected to the live Groq AI Quote Scoper?',
    answer: 'Yes. Every inquiry is processed live by your Railway n8n + Groq AI workflow (/webhook/v10-concierge-webhook) for instant multilingual B2B licensing quotes and collector appointments.'
  },
  {
    question: 'What is included in the $1,490 Exclusive 1-of-1 Buyout?',
    answer: 'Immediate permanent removal of Lumen Watch Collective from the store, full React JSX & 150MP IP ownership, plus 10 custom unbranded sapphire/platinum watch renders.'
  }
];

const PHOTON_PARTICLES = [
  { left: '7%', top: '83%', size: 4, dur: 9.2, delay: 0 },
  { left: '18%', top: '69%', size: 6, dur: 11.8, delay: 1.2 },
  { left: '31%', top: '87%', size: 3, dur: 8.6, delay: 0.6 },
  { left: '46%', top: '75%', size: 5, dur: 11.4, delay: 2.1 },
  { left: '62%', top: '84%', size: 4, dur: 10.1, delay: 0.4 },
  { left: '76%', top: '71%', size: 6, dur: 12.8, delay: 1.5 },
  { left: '88%', top: '79%', size: 4, dur: 9.6, delay: 2.3 },
  { left: '95%', top: '67%', size: 3, dur: 10.8, delay: 0.8 }
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
        className="absolute right-6 top-6 rounded-full bg-violet-300 p-3 text-black shadow-2xl cursor-pointer"
        aria-label="Close preview"
      >
        <X size={22} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Lumen Horology Master"
        className="max-h-[90vh] max-w-full rounded-2xl border border-violet-400/45 object-contain shadow-[0_0_65px_rgba(167,139,250,0.32)]"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body
  );
};

const LumenWatchCollective = () => {
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
  const [selectedTimepiece, setSelectedTimepiece] = useState('Lumen Spectral One Sapphire');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [salonDate, setSalonDate] = useState('2026-11-28');
  const [salonSlot, setSalonSlot] = useState('Lumen Lab Slot: 15:30 CET');
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to Lumen Watch Collective (Watch Kit 04 / 05 • Zero-Gravity Sapphire Prism Edition). Request an itemized B2B licensing quote ($349 Agency / $1,490 1-of-1 Buyout), 150MP optical macro specs, or Zurich/Geneva lab appointments in any language.'
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
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'LumenWatchCollective' });
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
        ime: user.displayName || 'B2B Lumen Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'lumenwatchcollective_buyout_1490' : 'lumenwatchcollective_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Sapphire Prism Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Lumen Watch Collective Antigravity Kit${suffix}`
      : `Agency License: Lumen Watch Collective Antigravity React + 150MP Kit${suffix}`;
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
    const cleanSlot = salonSlot.replace('Lumen Lab Slot: ', '');
    const guest = clientName.trim() || (isSr ? 'VIP Klijent' : 'Collector Principal');
    if (isSr) {
      return `Dobrodošli u Lumen Watch Collective Zero-G Lab, ${guest}. Vaš upit za ${selectedTimepiece} (aktivna kapsula: ${zoneTitle}) i termin ${salonDate} u ${cleanSlot} je evidentiran. Turnkey Antigravity React + 150MP Watch Kit dostupan je odmah za $${agencyPriceNum} (Agency) ili $${buyoutPriceNum} (1-of-1 Buyout).`;
    }
    return `Welcome to Lumen Watch Collective Zero-G Lab, ${guest}. Your inquiry regarding ${selectedTimepiece} (Active Capsule: ${zoneTitle}) for ${salonDate} at ${cleanSlot} is logged. Full Turnkey Antigravity React + 150MP Watch Kit licensing is available at $${agencyPriceNum} (Agency) or $${buyoutPriceNum} (1-of-1 Exclusive Buyout).`;
  };

  const handleConciergeSend = async (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isAiThinking) return;

    const currentZone = KIT_CONFIG.zones[activeZoneIdx];
    const slotClean = salonSlot.replace('Lumen Lab Slot: ', '');

    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setIsAiThinking(true);

    const payload = {
      name: clientName.trim() || currentUser?.displayName || 'Lumen Collector / Agency',
      email: clientEmail.trim() || currentUser?.email || 'vip@lumen-collective.com',
      category: 'Turnkey Luxury B2B Watch Web Kits (Antigravity Edition)',
      item: `Lumen Watch Collective Kit (${selectedTimepiece})`,
      budget: `$${agencyPriceNum} Agency / $${buyoutPriceNum} Exclusive Buyout`,
      date: `${salonDate} at ${slotClean}`,
      message: `[Page: Lumen Watch Collective Kit 4/5 | Sapphire Prism Chamber: ${currentZone.zone}] ${trimmed}`
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
    setHeroTilt({ rx: -py * 14, ry: px * 14 });
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
        <title>Lumen Watch Collective — Zero-Gravity Sapphire Prism & 150MP Turnkey Watch Kit</title>
      </Helmet>

      {/* TOP ZERO-GRAVITY TELEMETRY RIBBON */}
      <div className={`border-b px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.22em] ${THEME.ribbonBg}`}>
        LUMEN WATCH COLLECTIVE ✦ MONUMENTAL SAPPHIRE PRISM (0.00G) ✦ CRYO-PLATINUM 150MP MASTERS
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
              <Sun size={18} />
            </span>
            <span>
              <span className={`block text-sm sm:text-base font-black uppercase tracking-[0.22em] ${THEME.textMain}`}>
                Lumen Collective
              </span>
              <span className={`block text-[10px] font-extrabold uppercase tracking-[0.18em] ${THEME.accentText}`}>
                Watch Kit 04 / 05 • Sapphire Prism & Cryo-Platinum
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.15em] lg:flex text-white">
            <button type="button" onClick={() => scrollTo('prism-hero')} className="hover:text-violet-300 cursor-pointer">Sapphire Dome</button>
            <button type="button" onClick={() => scrollTo('horology-cinema')} className="hover:text-violet-300 cursor-pointer">16:9 Video Slot</button>
            <button type="button" onClick={() => scrollTo('calibers')} className="hover:text-violet-300 cursor-pointer">Spectral Pieces</button>
            <button type="button" onClick={() => scrollTo('gallery')} className="hover:text-violet-300 cursor-pointer">150MP Lab</button>
            <button type="button" onClick={() => scrollTo('commercial-pricing')} className="hover:text-violet-300 cursor-pointer">B2B Licensing</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={() => scrollTo('concierge-desk')}
              className={`rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition cursor-pointer ${THEME.btnOutline}`}
            >
              24/7 Lumen Desk
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
                  ['Sapphire Dome', 'prism-hero'],
                  ['16:9 Video Slot', 'horology-cinema'],
                  ['Spectral Pieces', 'calibers'],
                  ['24/7 AI Lumen Desk', 'concierge-desk'],
                  ['150MP Optical Lab', 'gallery'],
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
        {/* MASSIVE FULL-WIDESCREEN ANTIGRAVITY SAPPHIRE PRISM HERO (88VH)    */}
        {/* ================================================================= */}
        <section
          id="prism-hero"
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={() => setHeroTilt({ rx: 0, ry: 0 })}
          className="relative min-h-[88vh] w-full border-b border-violet-400/25 flex flex-col justify-between py-10 sm:py-14 overflow-hidden bg-[#04030A]"
        >
          {/* FULL-BLEED AMBIENT SAPPHIRE LAB BACKDROP */}
          <div className="pointer-events-none absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeZone.backdrop}
                src={activeZone.backdrop}
                alt="Sapphire Prism Optical Chamber"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 0.25, scale: 1.02 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="h-full w-full object-cover blur-[2px]"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.24)_0%,_rgba(5,4,13,0.88)_58%,_#05040D_95%)]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#05040D]/75 via-transparent to-[#05040D]" />
          </div>

          {/* RISING ZERO-GRAVITY PHOTON PARTICLES */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {PHOTON_PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
                animate={reduceMotion ? {} : { y: [0, -165, 0], opacity: [0.18, 0.9, 0.18] }}
                transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                className="absolute rounded-full bg-violet-300 shadow-[0_0_16px_rgba(196,181,253,0.95)]"
              />
            ))}
          </div>

          {/* GIANT CONCENTRIC PRISMATIC GYRO RINGS */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              animate={reduceMotion ? {} : { rotate: 360 }}
              transition={{ duration: 58, repeat: Infinity, ease: 'linear' }}
              className="h-[460px] w-[460px] sm:h-[680px] sm:w-[680px] rounded-full border border-dashed border-violet-400/25"
            />
            <motion.div
              animate={reduceMotion ? {} : { rotate: -360 }}
              transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
              className="absolute h-[350px] w-[350px] sm:h-[540px] sm:w-[540px] rounded-full border border-fuchsia-300/15"
            />
            <div className="absolute h-[260px] w-[260px] sm:h-[400px] sm:w-[400px] rounded-full bg-violet-500/15 blur-3xl" />
          </div>

          {/* TOP MONUMENTAL HERO HEADLINE */}
          <div className="relative z-20 mx-auto w-full max-w-[1440px] px-4 sm:px-7 lg:px-10 text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-violet-400/45 bg-black/65 px-5 py-2 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.26em] text-violet-300 backdrop-blur-xl shadow-2xl">
              <Sparkles size={14} /> ZERO-GRAVITY SAPPHIRE PRISM • {activeZone.zone}
            </div>

            <h1 className="mx-auto mt-5 max-w-5xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.02] text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
              {activeZone.title}
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base font-medium leading-relaxed text-indigo-100/85">
              {activeZone.subtitle}
            </p>
          </div>

          {/* CENTER MASSIVE LEVITATING SAPPHIRE STAGE + FLOATING SIDE WINGS */}
          <div className="relative z-20 mx-auto my-8 w-full max-w-[1440px] px-4 sm:px-7 lg:px-10">
            <div className="grid items-center gap-6 lg:grid-cols-12">
              {/* LEFT FLOATING OPTICAL TELEMETRY WING */}
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 5.1, repeat: Infinity, ease: 'easeInOut' }}
                className="lg:col-span-3 rounded-3xl border border-violet-400/35 bg-black/70 p-5 backdrop-blur-2xl shadow-2xl text-left"
              >
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
                  PHOTONIC REFRACTION SPEC
                </span>
                <p className="mt-2 text-sm font-black text-white leading-snug">
                  {activeZone.specs}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-bold uppercase tracking-widest text-violet-200">
                  <span>CRYO SUSPENSION</span>
                  <span className="rounded bg-violet-400/20 px-2 py-0.5 text-violet-300">0.00 G LOCKED</span>
                </div>
              </motion.div>

              {/* CENTER COLOSSAL 3D LEVITATING TIMEPIECE */}
              <div className="lg:col-span-6 flex flex-col items-center justify-center">
                <div
                  style={{
                    transform: `perspective(1400px) rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`,
                    transition: 'transform 150ms ease-out'
                  }}
                  className="relative w-full max-w-[500px]"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeZone.id}
                      initial={{ opacity: 0, scale: 0.9, y: 24 }}
                      animate={
                        reduceMotion
                          ? { opacity: 1, scale: 1, y: 0 }
                          : { opacity: 1, scale: 1, y: [0, -28, 0], rotateZ: [1.3, -1.3, 1.3] }
                      }
                      exit={{ opacity: 0, scale: 0.9, y: -24 }}
                      transition={{
                        opacity: { duration: 0.38 },
                        scale: { duration: 0.38 },
                        y: { duration: 5.3, repeat: Infinity, ease: 'easeInOut' },
                        rotateZ: { duration: 7.8, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      onClick={() => setZoomImage(activeZone.image)}
                      className="group relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden rounded-[2.6rem] border-2 border-violet-300/60 bg-black shadow-[0_35px_110px_rgba(139,92,246,0.44)] cursor-zoom-in"
                    >
                      <img
                        src={activeZone.image}
                        alt={activeZone.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet-500/20 via-transparent to-white/15" />

                      <div className="absolute left-4 top-4 rounded-full border border-violet-300/45 bg-black/80 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-violet-300 backdrop-blur-md">
                        {activeZone.step}
                      </div>

                      <div className="absolute bottom-4 right-4 rounded-full bg-white/95 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-black shadow-lg">
                        150MP Prism Loupe ↗
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* REACTIVE ANTIGRAVITY FLOOR MAGNETIC HALO */}
                <motion.div
                  animate={reduceMotion ? {} : { scaleX: [1, 0.68, 1], opacity: [0.65, 0.24, 0.65] }}
                  transition={{ duration: 5.3, repeat: Infinity, ease: 'easeInOut' }}
                  className="mt-6 h-7 w-80 max-w-full rounded-full bg-violet-400/45 blur-2xl"
                />
              </div>

              {/* RIGHT FLOATING ACTION WING */}
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                className="lg:col-span-3 rounded-3xl border border-violet-400/35 bg-black/70 p-5 backdrop-blur-2xl shadow-2xl space-y-3"
              >
                <span className="block text-[10px] font-black uppercase tracking-[0.22em] text-indigo-200">
                  COLLECTIVE B2B BUYOUT
                </span>
                <p className="text-xs leading-relaxed text-slate-300">
                  Sweep your cursor across the sapphire dome for 3D prism tilt or switch between all 5 cryo-platinum capsules below.
                </p>
                <button
                  type="button"
                  onClick={() => setZoomImage(activeZone.image)}
                  className={`w-full rounded-full py-3 text-[11px] font-black uppercase tracking-wider transition hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 ${THEME.btnPrimary}`}
                >
                  <Aperture size={14} /> Full 150MP Zoom
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('horology-cinema')}
                  className={`w-full rounded-full py-3 text-[11px] font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 ${THEME.btnOutline}`}
                >
                  <Play size={13} className="fill-current" /> 16:9 Cinema Slot
                </button>
              </motion.div>
            </div>
          </div>

          {/* BOTTOM FLOATING 5-CAPSULE COMMAND DOCK */}
          <div className="relative z-20 mx-auto w-full max-w-4xl px-4">
            <div className="rounded-3xl border border-violet-400/35 bg-black/80 p-3 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {KIT_CONFIG.zones.map((z, idx) => (
                  <motion.button
                    key={z.id}
                    type="button"
                    onClick={() => setActiveZoneIdx(idx)}
                    animate={reduceMotion ? {} : { y: [0, -4, 0] }}
                    transition={{ duration: 3.4 + idx * 0.35, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                    className={`group flex items-center gap-2.5 rounded-2xl border p-2 text-left transition cursor-pointer ${
                      activeZoneIdx === idx
                        ? 'border-violet-300 bg-violet-500/20 shadow-[0_0_20px_rgba(167,139,250,0.40)]'
                        : 'border-white/10 bg-white/5 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={z.image} alt={z.title} className="h-11 w-11 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-violet-300">
                        Prism 0{idx + 1}
                      </span>
                      <span className="block truncate text-[11px] font-bold text-white">
                        {z.zone}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ANTIGRAVITY SPEC STRIP */}
        <section className={`border-b ${THEME.borderSubtle} ${THEME.cardAltBg}`}>
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-6 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [Layers, '88vh Sapphire Prism Antigravity Hero'],
              [Video, '16:9 Seedance 2.5 & Kling 4.0 Slot'],
              [ShieldCheck, '10 Exclusive Cryo-Platinum 150MP Masters'],
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
                  <Video size={14} /> 16:9 Sapphire Prism Cinema Slot • Seedance 2.5 & Kling 4.0 (30s)
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

            <div className="relative w-full aspect-video overflow-hidden rounded-3xl border-2 border-violet-400/35 bg-black shadow-2xl">
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
                    <div className="rounded-3xl border border-violet-400/40 bg-black/80 px-6 py-4 text-center backdrop-blur-xl shadow-2xl max-w-md">
                      <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-violet-400/50 bg-violet-400/15 text-violet-300">
                        <Film size={22} />
                      </span>
                      <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-white">
                        16:9 LUMEN SAPPHIRE VIDEO SLOT
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-slate-300">
                        3840 × 2160 UHD (60fps) • Seedance 2.5 & Kling 4.0 Ready
                      </span>
                      <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-wider text-violet-300">
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
                <span className="rounded-full bg-violet-400 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
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
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/85 text-white backdrop-blur-md transition hover:border-violet-400 cursor-pointer"
                  >
                    {isCinemaMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div className="flex flex-1 max-w-xl items-center gap-2 rounded-2xl border border-white/30 bg-black/90 px-4 py-2.5 backdrop-blur-xl">
                  <Maximize2 size={15} className="text-violet-400 shrink-0" />
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
                      className="text-[10px] font-black uppercase text-violet-300 hover:text-white cursor-pointer"
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
        {/* FLOATING ANTIGRAVITY CALIBER COLLECTION                           */}
        {/* ================================================================= */}
        <section id="calibers" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10">
          <Reveal className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className={`text-xs font-black uppercase tracking-[0.22em] ${THEME.accentText}`}>
                Avant-Garde Zurich Collective
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black tracking-tight text-white">
                Suspended sapphire & cryo-platinum pieces.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => scrollTo('concierge-desk')}
              className={`w-fit text-xs font-black uppercase tracking-[0.16em] ${THEME.goldText} cursor-pointer`}
            >
              Reserve Lab Allocation →
            </button>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {KIT_CONFIG.collection.map((watch, idx) => (
              <AntigravityCard
                key={watch.name}
                floatDelay={idx * 0.7}
                floatRange={11}
                className={`group overflow-hidden rounded-[1.9rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} shadow-[0_24px_60px_rgba(139,92,246,0.16)] hover:border-violet-400/60`}
              >
                <div onClick={() => setZoomImage(watch.image)} className="relative h-72 overflow-hidden bg-black cursor-zoom-in">
                  <img
                    src={watch.image}
                    alt={watch.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-violet-400/40 bg-black/80 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-violet-200 backdrop-blur">
                    {watch.meta}
                  </span>
                  <span className="absolute bottom-4 right-4 rounded-xl bg-violet-300 px-3 py-1 text-xs font-black text-slate-950 shadow">
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
                      setChatInput(`Please calculate a B2B quote for Lumen Watch Collective Kit + ${watch.name} showcase.`);
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
        {/* 24/7 AI LUMEN CONCIERGE & LIVE GROQ QUOTE SCOPER                  */}
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
                  24/7 LUMEN OPTICAL LAB & B2B QUOTE DESK
                </h2>
                <p className={`mt-4 text-sm leading-7 ${THEME.textMuted}`}>
                  Connected live to your Groq B2B Project Scoper. Test multilingual avant-garde collector inquiries, Zurich/Geneva viewing slots, or instant turnkey buyout quotes.
                </p>
                <div className={`mt-6 space-y-2.5 border-t ${THEME.borderSubtle} pt-5 text-xs font-bold text-white`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={THEME.accentText} />
                    <span>Active Prism Pod: {activeZone.zone}</span>
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
                      Lumen Collective AI Concierge is calculating your proposal via Groq...
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
                150MP Optical Sapphire Lab • Zero Duplicate Renders
              </span>
              <h2 className="mt-2 text-3xl sm:text-5xl font-black text-white">
                Ultra-print cryo-platinum & sapphire macro photography.
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
                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-violet-300">
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
              <Crown size={13} /> Turnkey Sapphire Prism Antigravity Web + 150MP Kit
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-black text-white">
              License Lumen Watch Collective today.
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
                    ⚡ Add 30s 4K/60fps Sapphire Prism Motion Pack (Seedance 2.5 & Kling 4.0)
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
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> Complete Lumen Collective 88vh Antigravity React + Tailwind JSX</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> 10 Exclusive 4K UHD & 150MP Sapphire / Cryo-Platinum Visuals</li>
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
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> 10 Custom 150MP Unbranded Renders for Your Collective</li>
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
                <h3 className="text-sm font-black text-white">Download Free 150MP Sapphire Prism Sample + Spec (.TXT)</h3>
                <p className={`text-xs ${THEME.textMuted}`}>Inspect sapphire crystal refraction & Zaratsu platinum surfaces at 100% scale.</p>
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
              <span className={`text-xs font-black uppercase tracking-[0.2em] ${THEME.accentText}`}>Lumen FAQ</span>
              <h2 className="mt-2 text-3xl font-black text-white">Optical horology notes.</h2>
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
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-violet-400/35 bg-black">
            <img
              src={KIT_CONFIG.ctaBannerImage}
              alt="Lumen Watch Collective"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05040D] via-[#05040D]/80 to-transparent" />
            <div className="relative max-w-2xl px-6 py-14 sm:px-12 sm:py-18 text-white">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-violet-300">
                Watch Kit 04 / 05 • Lumen Watch Collective
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black leading-tight">
                Enter the Final Sovereign Vault: Monarch Timepieces.
              </h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
                  className={`rounded-full px-7 py-4 text-xs font-black uppercase tracking-wider cursor-pointer flex items-center gap-2 ${THEME.btnPrimary}`}
                >
                  Next: Monarch Timepieces (5/5) <ArrowRight size={15} />
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

export default LumenWatchCollective;