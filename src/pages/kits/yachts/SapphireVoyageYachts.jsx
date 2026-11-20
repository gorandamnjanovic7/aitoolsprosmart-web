// ============================================================================
// src/pages/kits/yachts/SapphireVoyageYachts.jsx
// Sapphire Voyage — Yacht Kit 04 / 05 • Royal Atlantic Sapphire & Rose-Champagne
// Zero Duplicate Visuals • Dedicated 16:9 Video Placeholder (Seedance 2.5 & Kling 4.0 Ready)
// + 24/7 AI Yacht Charter Desk & Google Calendar (08:00–00:00 CET)
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Anchor, Aperture, ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, ChevronDown,
  Compass, Crown, DownloadCloud, Film, FolderArchive, Lock, Maximize2, Menu, Moon,
  MousePointerClick, Pause, Play, Send, ShieldCheck, Sparkles, Sun, Video, Volume2, VolumeX, Waves, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const WEBHOOK_URL = 'https://n8n-production-720dcf20.up.railway.app/webhook/YACHT_Concierge_And_Calendar';
const FALLBACK_WEBHOOK_URL = 'https://n8n-production-720dcf20.up.railway.app/webhook/AVIATION_Concierge_And_Calendar';

// ============================================================================
// 16:9 VIDEO PLACEHOLDER SLOTS (PASTE YOUR SEEDANCE 2.5 / KLING 4.0 .MP4/.WEBM)
// ============================================================================
const VIDEO_REEL_1_URL = ''; // e.g. '/yachts/reel-01.mp4' or cloud .mp4/.webm link
const VIDEO_REEL_2_URL = ''; // e.g. '/yachts/reel-02.mp4' or cloud .mp4/.webm link

const THEME = {
  "isLight": false,
  "pageBg": "bg-[#06102A]",
  "textMain": "text-white",
  "textMuted": "text-slate-200",
  "ribbonBg": "bg-[#0A1940] border-[#60A5FA]/35 text-[#DBEAFE]",
  "headerBg": "bg-[#06102A]/95 border-[#60A5FA]/25",
  "cardBg": "bg-[#0C1C44]",
  "cardAltBg": "bg-[#081433]",
  "borderSubtle": "border-white/15",
  "borderAccent": "border-[#60A5FA]/50",
  "accentText": "text-[#93C5FD]",
  "goldText": "text-[#E5B887]",
  "badge": "border-[#E5B887]/50 bg-[#E5B887]/15 text-[#FDE8D0]",
  "btnPrimary": "bg-gradient-to-r from-[#2563EB] via-[#60A5FA] to-[#3B82F6] text-white shadow-[0_0_30px_rgba(59,130,246,0.45)]",
  "btnGold": "bg-gradient-to-r from-[#E5B887] via-[#F7DFC2] to-[#C89662] text-[#06102A] shadow-[0_0_25px_rgba(229,184,135,0.35)]",
  "btnOutline": "border-2 border-[#E5B887]/50 bg-[#0C1C44] text-[#FDE8D0] hover:bg-[#E5B887] hover:text-[#06102A]",
  "inputCls": "border-white/15 bg-[#0E2252] text-white placeholder-slate-300 focus:border-[#60A5FA]",
  "optionCls": "bg-[#06102A] text-white",
  "chatBox": "border-white/10 bg-[#081536]",
  "aiBubble": "border border-[#60A5FA]/25 bg-[#10265C] text-slate-100",
  "userBubble": "bg-gradient-to-r from-[#E5B887] to-[#F7DFC2] text-[#06102A] font-bold"
};

const KIT_CONFIG = {
  "standardZipLink": "https://drive.google.com/your-sapphirevoyageyachts-349-link",
  "buyoutZipLink": "https://drive.google.com/your-sapphirevoyageyachts-1490-link",
  "freeSampleLink": "https://drive.google.com/your-sapphirevoyageyachts-sample-link",
  "prevPageRoute": "/nautilus-yacht-kit",
  "prevPageLabel": "Prev Yacht: Nautilus Night (3/5)",
  "nextLandingRoute": "/tideglass-yacht-kit",
  "nextLandingLabel": "Next Yacht: Tideglass Society (5/5)",
  "zones": [
    {
      "id": "sap-z1",
      "step": "Passage 01 • Côte d’Azur to Sardinia",
      "zone": "Open Sapphire Sea • 24 Knots Full Wake",
      "title": "Built where deep ocean meets pure symmetry.",
      "subtitle": "High-speed naval architecture paired with rose-champagne grand salons for effortless crossings from Antibes to St. Barths.",
      "specs": "104M Fast Displacement Steel/Alu • Twin MTU Propulsion • 7,000 NM Range",
      "image": "/yachts/21.webp"
    },
    {
      "id": "sap-z2",
      "step": "Passage 02 • Amalfi & Capri Channel",
      "zone": "Cobalt Horizon • Bow Wave Precision",
      "title": "Razor-Sharp Plumb Bow Hydrodynamics",
      "subtitle": "Slice through open Mediterranean swells with 40% lower vertical acceleration and whisper-smooth deck comfort.",
      "specs": "Bulbous Wave-Piercing Bow • Quantum Fin Stabilizers • Ice-Class Certified",
      "image": "/yachts/14.webp"
    },
    {
      "id": "sap-z3",
      "step": "Passage 03 • Grand Champagne Atrium",
      "zone": "Main Deck • Symmetrical Gold Salon",
      "title": "Palatial Rose-Champagne Grand Salon",
      "subtitle": "Double-width symmetrical lounge crafted in bookmatched burl wood, brushed rose-brass, and cream silk carpets.",
      "specs": "3.1M Deck Headroom • Bespoke Chandelier Cove • Full-Height Sea Windows",
      "image": "/yachts/46.webp"
    },
    {
      "id": "sap-z4",
      "step": "Passage 04 • St. Barths Gustavia",
      "zone": "Sapphire Dusk • Illuminated Lounge",
      "title": "Cobalt-Hour Horizon Drawing Room",
      "subtitle": "Transition seamlessly from sun-drenched Caribbean crossings into refined evening cocktails overlooking Gustavia.",
      "specs": "Circadian Cove Lighting • Custom Marine Velvet • Sommelier Bar",
      "image": "/yachts/61.webp"
    },
    {
      "id": "sap-z5",
      "step": "Passage 05 • Private Study & VIP Suite",
      "zone": "Waterline Deck • Sunset Hull Window",
      "title": "Curved Hull-Glass Oceanfront Suite",
      "subtitle": "Watch golden swells glide past oversized elliptical hull glazing from a hand-stitched saddle-leather suite.",
      "specs": "Triple-Laminated Marine Glass • Teak Millwork • Private En-Suite",
      "image": "/yachts/38.webp"
    }
  ],
  "cinemaVideos": [
    {
      "id": "reel-1",
      "badge": "01 • 16:9 Master Video Placeholder (30s Seedance 2.5 / Kling 4.0)",
      "title": "High-speed cobalt wake across open Atlantic waters.",
      "desc": "True 16:9 widescreen (3840 × 2160) 4K 60fps aerial superyacht cinematography slot ready for hero headers, Monaco Yacht Show LED walls, and charter decks.",
      "poster": "/yachts/15.webp"
    },
    {
      "id": "reel-2",
      "badge": "02 • Golden-Hour Horizon Loop (16:9 UHD Slot)",
      "title": "Full-displacement flagship approaching Riviera bay.",
      "desc": "Secondary 16:9 widescreen motion placeholder engineered for 30-second Seedance 2.5 or Kling 4.0 coastal anchorage loops.",
      "poster": "/yachts/25.webp"
    }
  ],
  "fleet": [
    {
      "name": "Atlantic Blue-Water Hull Architecture",
      "meta": "01 • Naval Engineering",
      "rate": "€1,050,000 / wk",
      "desc": "Engineered for effortless transatlantic crossings with helicopter hangar, submarine garage, and 32-person crew.",
      "image": "/yachts/16.webp"
    },
    {
      "name": "Grand Promenade Teak & Cream Salon",
      "meta": "02 • Bespoke Interior Volume",
      "rate": "2,950 GT Volume",
      "desc": "Expansive beam proportions uniting warm architectural timber with unobstructed ocean sightlines.",
      "image": "/yachts/69.webp"
    },
    {
      "name": "Executive Captain’s Library & Office",
      "meta": "03 • Dual StarLink Maritime",
      "rate": "Global Ka-Band",
      "desc": "Conduct global family-office briefings mid-ocean with encrypted dual-dome satellite connectivity.",
      "image": "/yachts/40.webp"
    }
  ],
  "vault": [
    {
      "id": "sap-v1",
      "tag": "Sunset Anchorage",
      "title": "Rose-Gold Horizon Profile",
      "specs": "Warm bronze hull reflection • Calm twilight sea • 150MP Master",
      "image": "/yachts/6.webp"
    },
    {
      "id": "sap-v2",
      "tag": "Sport Flybridge",
      "title": "Mediterranean Coastal Cruiser",
      "specs": "Sleek aerodynamic superstructure • 28 knots • 150MP Master",
      "image": "/yachts/24.webp"
    }
  ],
  "ctaBannerImage": "/yachts/71.webp"
};

const CALENDAR_SLOTS = [
  'Calendar Slot: 08:00 CET',
  'Calendar Slot: 10:00 CET',
  'Calendar Slot: 12:00 CET',
  'Calendar Slot: 14:00 CET',
  'Calendar Slot: 16:00 CET',
  'Calendar Slot: 18:00 CET',
  'Calendar Slot: 20:00 CET',
  'Calendar Slot: 22:00 CET',
  'Calendar Slot: 23:00 CET',
  'Calendar Slot: 00:00 CET'
];

const FAQS = [
  {
    "question": "How does the 16:9 Video Placeholder work with Seedance 2.5 & Kling 4.0?",
    "answer": "Each page includes two dedicated 16:9 widescreen slots (Reel 01 & Reel 02). Set VIDEO_REEL_1_URL / VIDEO_REEL_2_URL at the top of the file or paste any .mp4 / .webm URL into the live preview bar."
  },
  {
    "question": "What makes the Sapphire Voyage superyacht page unique?",
    "answer": "This edition features its own bespoke maritime color palette (Yacht Kit 04 / 05 • Royal Atlantic Sapphire & Rose-Champagne), exclusive 150MP local visual masters with zero duplicates across any other page, and a live 24/7 AI Yacht Charter & Google Calendar Desk."
  },
  {
    "question": "How do the Google Calendar Charter Briefing slots work?",
    "answer": "Clients select any date and CET time slot from 08:00 CET right up to 00:00 CET and message the AI Charter Desk to log and confirm their briefing directly."
  },
  {
    "question": "What does the $1,490 1-of-1 Exclusive Buyout include?",
    "answer": "Permanent store removal of this specific superyacht kit, full intellectual property transfer, and 10 custom 150MP architectural yacht renders."
  }
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay }}
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
        alt="150MP Superyacht Master"
        className="max-h-[90vh] max-w-full rounded-2xl border border-white/30 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body
  );
};

const SapphireVoyageYachts = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeZoneIdx, setActiveZoneIdx] = useState(0);
  const [zoomImage, setZoomImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  // ==========================================================================
  // DEDICATED 16:9 VIDEO PLACEHOLDER STATE (SEEDANCE 2.5 / KLING 4.0 READY)
  // ==========================================================================
  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const cinemaVideoRef = useRef(null);

  // Order Bump (+$199 Motion Pack)
  const [includeMotionBump, setIncludeMotionBump] = useState(false);

  // 24/7 AI Yacht Charter Desk + Calendar (08:00 - 00:00 CET)
  const [selectedVessel, setSelectedVessel] = useState("Sapphire 104M Transoceanic Flagship");
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [flightDate, setFlightDate] = useState('2026-11-24');
  const [flightSlot, setFlightSlot] = useState('Calendar Slot: 14:00 CET');
  const [chatInput, setChatInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: "Welcome aboard Sapphire Voyage (Yacht Kit 04 / 05 • Royal Atlantic Sapphire & Rose-Champagne). Ask about weekly Mediterranean & Caribbean charter rates, 150MP deck specs, Google Calendar briefing slots (08:00–00:00 CET), or licensing this Turnkey Superyacht Kit."
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
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: "SapphireVoyageYachts" });
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
        ime: user.displayName || 'B2B Yacht Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: Number(price) >= 1490 ? 'sapphirevoyageyachts_buyout_1490' : 'sapphirevoyageyachts_kit_349',
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
    const suffix = includeMotionBump ? ' + 30s 4K Ocean Motion Pack' : '';
    const productName = isBuyout
      ? `1-of-1 Exclusive Buyout: Sapphire Voyage Superyacht Kit${suffix}`
      : `Agency License: Sapphire Voyage Superyacht React + 150MP Kit${suffix}`;
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;

    const activeUser = currentUser || auth.currentUser;
    if (activeUser) {
      await recordOrderIntent(activeUser, productName, price);
      setCheckoutData({ isOpen: true, name: productName, price, zipLink });
    } else {
      setLoginModal({ isOpen: true, tierName: productName, price, zipLink });
    }
  };

  const buildYachtFallback = (msgText, zoneTitle) => {
    const isSr = /[čćžšđ]|zdravo|ćao|cao|cena|cijena|jahta|zakaz|termin|kalendar/i.test(msgText);
    const cleanSlot = flightSlot.replace('Calendar Slot: ', '');
    const guest = clientName.trim() || (isSr ? 'VIP Klijent' : 'Principal Guest');
    if (isSr) {
      return `Dobrodošli na Sapphire Voyage Charter Desk, ${guest}. Vaš upit za ${selectedVessel} (aktivna zona: ${zoneTitle}) i termin brifinga ${flightDate} u ${cleanSlot} je evidentiran${clientEmail ? ` (${clientEmail})` : ''}. Kompletan Turnkey Superyacht Web + 150MP Kit dostupan je odmah za $${agencyPriceNum} (Agency) ili $${buyoutPriceNum} (1-of-1 Buyout).`;
    }
    return `Welcome to Sapphire Voyage Charter Desk, ${guest}. We have logged your inquiry for ${selectedVessel} (Active Zone: ${zoneTitle}) and your requested Google Calendar briefing on ${flightDate} at ${cleanSlot}${clientEmail ? ` (${clientEmail})` : ''}. Full Turnkey Superyacht Web + 150MP Kit licensing is available at $${agencyPriceNum} (Agency) or $${buyoutPriceNum} (1-of-1 Exclusive Buyout).`;
  };

  const handleCharterDeskSend = async (e) => {
    e.preventDefault();
    const trimmed = chatInput.trim();
    if (!trimmed || isAiThinking) return;

    const currentZone = KIT_CONFIG.zones[activeZoneIdx];
    const slotClean = flightSlot.replace('Calendar Slot: ', '');

    setChatMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setChatInput('');
    setIsAiThinking(true);

    const payload = {
      sessionId: clientEmail.trim() || `sapphirevoyageyachts-${Date.now()}`,
      clientName: clientName.trim() || currentUser?.displayName || 'VIP Yacht Principal',
      clientEmail: clientEmail.trim() || currentUser?.email || 'vip@superyacht-desk.com',
      bookingDate: flightDate,
      bookingSlot: slotClean,
      date: `${flightDate} at ${slotClean}`,
      aircraft: selectedVessel,
      activeZone: currentZone.zone,
      page: "Sapphire Voyage (Yacht Kit 04 / 05 • Royal Atlantic Sapphire & Rose-Champagne)",
      message: `[Superyacht Charter Concierge Context: Sapphire Voyage | Vessel: ${selectedVessel}] ${trimmed}`,
      chatInput: `[Superyacht Charter Concierge Context: Sapphire Voyage | Vessel: ${selectedVessel} | Date: ${flightDate} at ${slotClean}] ${trimmed}`
    };

    try {
      let res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        res = await fetch(FALLBACK_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      const data = await res.json().catch(() => null);
      const rawReply = data?.reply || data?.output || data?.agent_reply || data?.text;
      if (res.ok && rawReply && !String(rawReply).toLowerCase().includes('error in workflow')) {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: String(rawReply) }]);
      } else {
        setChatMessages((prev) => [...prev, { role: 'assistant', text: buildYachtFallback(trimmed, currentZone.title) }]);
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: 'assistant', text: buildYachtFallback(trimmed, currentZone.title) }]);
    } finally {
      setIsAiThinking(false);
    }
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
    <div className={`min-h-screen ${THEME.pageBg} ${THEME.textMain} pb-24 font-sans`}>
      <Helmet>
        <title>Sapphire Voyage Yachts — Royal Ocean Crossing & 150MP Superyacht Kit</title>
      </Helmet>

      {/* TOP MARITIME RIBBON */}
      <div className={`border-b px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.2em] ${THEME.ribbonBg}`}>
        TRANSOCEANIC SAPPHIRE FLEET ✦ 7,000 NM BLUE-WATER ENGINEERING ✦ 16:9 VIDEO PLACEHOLDER READY
      </div>

      {/* SUB-HEADER */}
      <header className={`border-b backdrop-blur-2xl ${THEME.headerBg}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3.5 sm:px-7 lg:px-10">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left cursor-pointer">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${THEME.btnPrimary}`}>
              <Anchor size={18} />
            </span>
            <span>
              <span className={`block text-sm sm:text-base font-black uppercase tracking-[0.22em] ${THEME.textMain}`}>
                Sapphire Voyage
              </span>
              <span className={`block text-[10px] font-extrabold uppercase tracking-[0.18em] ${THEME.goldText}`}>
                Yacht Kit 04 / 05 • Royal Atlantic Sapphire & Rose-Champagne
              </span>
            </span>
          </button>

          <nav className={`hidden items-center gap-7 text-[11px] font-black uppercase tracking-[0.15em] lg:flex ${THEME.textMain}`}>
            <button type="button" onClick={() => scrollTo('hero-showcase')} className="hover:opacity-75 cursor-pointer">Deck Showcase</button>
            <button type="button" onClick={() => scrollTo('ocean-cinema')} className="hover:opacity-75 cursor-pointer">16:9 Video Slot</button>
            <button type="button" onClick={() => scrollTo('fleet')} className="hover:opacity-75 cursor-pointer">Fleet & Specs</button>
            <button type="button" onClick={() => scrollTo('gallery')} className="hover:opacity-75 cursor-pointer">150MP Vault</button>
            <button type="button" onClick={() => scrollTo('commercial-pricing')} className="hover:opacity-75 cursor-pointer">B2B Licensing</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => scrollTo('charter-request')} className={`rounded-full px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition cursor-pointer ${THEME.btnOutline}`}>
              24/7 Yacht Desk
            </button>
            <button type="button" onClick={() => scrollTo('commercial-pricing')} className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] transition hover:scale-105 cursor-pointer ${THEME.btnGold}`}>
              Acquire Kit (${agencyPriceNum}) <ArrowRight size={14} />
            </button>
          </div>

          <button type="button" onClick={() => setMenuOpen((v) => !v)} className={`flex h-10 w-10 items-center justify-center rounded-full border ${THEME.borderSubtle} lg:hidden`}>
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
                  ['Deck Showcase', 'hero-showcase'],
                  ['16:9 Video Placeholder', 'ocean-cinema'],
                  ['Fleet & Specs', 'fleet'],
                  ['24/7 Yacht Desk', 'charter-request'],
                  ['150MP Vault', 'gallery'],
                  ['B2B Licensing', 'commercial-pricing']
                ].map(([label, id]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollTo(id)}
                    className={`py-2.5 text-left text-xs font-black uppercase tracking-wider ${THEME.textMain}`}
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
        {/* HERO VARIANT 4: ROYAL SAPPHIRE CENTERED PANORAMIC REGATTA FRAME */}
        <section id="hero-showcase" className="border-b border-[#60A5FA]/25 bg-[#06102A] py-12 sm:py-16">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#E5B887]/50 bg-[#E5B887]/15 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-[#FDE8D0]">
                <Compass size={13} /> {activeZone.zone}
              </span>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] text-white">
                {activeZone.title}
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-200 leading-relaxed">
                {activeZone.subtitle}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {KIT_CONFIG.zones.map((z, idx) => (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setActiveZoneIdx(idx)}
                    className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] transition cursor-pointer ${
                      activeZoneIdx === idx
                        ? 'border-[#E5B887] bg-[#E5B887] text-[#06102A] shadow-lg'
                        : 'border-white/20 bg-[#0C1C44] text-white hover:border-[#60A5FA]'
                    }`}
                  >
                    {z.step}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative mt-9 overflow-hidden rounded-[2.2rem] border-2 border-[#60A5FA]/45 bg-black aspect-[16/8] min-h-[340px] shadow-[0_0_70px_rgba(37,99,235,0.25)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeZone.id}
                  src={activeZone.image}
                  alt={activeZone.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  onClick={() => setZoomImage(activeZone.image)}
                  className="h-full w-full object-cover cursor-zoom-in"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#06102A]/90 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-xl border border-[#60A5FA]/45 bg-[#06102A]/90 px-4 py-2.5 text-xs font-bold text-[#DBEAFE] backdrop-blur-md">
                  ✓ {activeZone.specs}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => scrollTo('ocean-cinema')}
                    className="rounded-full border border-[#60A5FA] bg-[#06102A]/90 px-5 py-2.5 text-[10px] font-black uppercase tracking-wider text-white cursor-pointer flex items-center gap-1.5"
                  >
                    <Play size={12} className="fill-current" /> Watch 16:9 Video
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo('charter-request')}
                    className={`rounded-full px-6 py-2.5 text-[10px] font-black uppercase tracking-wider cursor-pointer ${THEME.btnGold}`}
                  >
                    Voyage Briefing →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARITIME HIGHLIGHT & VIDEO SPEC BAR */}
        <section className={`border-b ${THEME.borderSubtle} ${THEME.cardAltBg}`}>
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-6 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [MousePointerClick, 'Interactive 5-Zone Deck Tour'],
              [Video, '16:9 Seedance 2.5 & Kling 4.0 Slot'],
              [ShieldCheck, 'Zero Duplicate 150MP Visuals'],
              [Sparkles, '24/7 AI Charter & Calendar Desk']
            ].map(([Icon, label], idx) => (
              <div key={label} className={`flex items-center gap-3 text-xs font-extrabold uppercase tracking-wider ${THEME.textMain}`}>
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
        <section id="ocean-cinema" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pt-20 pb-10 sm:px-7 lg:px-10">
          <Reveal className={`overflow-hidden rounded-[2.2rem] border-2 ${THEME.borderAccent} ${THEME.cardBg} p-6 sm:p-10 shadow-2xl`}>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
                  <Video size={14} /> 16:9 Widescreen Cinema Placeholder • Seedance 2.5 & Kling 4.0 (30s)
                </span>
                <h2 className={`mt-4 text-3xl sm:text-5xl font-black leading-tight tracking-tight ${THEME.textMain}`}>
                  {activeCinema.title}
                </h2>
                <p className={`mt-2 max-w-2xl text-sm font-medium ${THEME.textMuted}`}>
                  {activeCinema.desc}
                </p>
              </div>

              {/* REEL 01 / REEL 02 SELECTOR TABS ON ALL 5 YACHT PAGES */}
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
                        ? THEME.btnPrimary
                        : THEME.btnOutline
                    }`}
                  >
                    Reel 0{idx + 1} (16:9)
                  </button>
                ))}
              </div>
            </div>

            {/* TRUE 16:9 WIDESCREEN ASPECT-VIDEO CONTAINER */}
            <div className="relative w-full aspect-video overflow-hidden rounded-3xl border-2 border-white/25 bg-black shadow-2xl">
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
                /* CINEMATIC 16:9 MOTION PLACEHOLDER PREVIEW (WHEN NO .MP4 IS LOADED YET) */
                <div className="relative h-full w-full overflow-hidden bg-black">
                  <motion.img
                    key={activeCinema.poster}
                    src={activeCinema.poster}
                    alt={activeCinema.title}
                    animate={
                      isCinemaPlaying
                        ? { scale: [1.0, 1.09, 1.0], x: ['0%', '-1.5%', '0%'] }
                        : { scale: 1.02 }
                    }
                    transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-full object-cover opacity-90"
                  />

                  {/* CENTER 16:9 VIDEO PLACEHOLDER HUD */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                    <div className="rounded-3xl border border-white/25 bg-black/75 px-6 py-4 text-center backdrop-blur-xl shadow-2xl max-w-md">
                      <span className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-400/15 text-emerald-300">
                        <Film size={22} />
                      </span>
                      <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-white">
                        16:9 MASTER VIDEO PLACEHOLDER
                      </span>
                      <span className="mt-1 block text-[11px] font-semibold text-slate-300">
                        3840 × 2160 UHD (60fps) • Seedance 2.5 & Kling 4.0 Ready
                      </span>
                      <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Paste any .mp4 / .webm URL below or set VIDEO_REEL_1_URL
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/45" />

              {/* TOP 16:9 FRAME BADGES */}
              <div className="absolute left-4 right-4 top-4 sm:left-5 sm:right-5 sm:top-5 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full border border-white/25 bg-black/85 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                  {activeCinema.badge}
                </span>
                <span className="rounded-full bg-emerald-400 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-black shadow-lg">
                  16:9 ASPECT RATIO LOCKED
                </span>
              </div>

              {/* BOTTOM VIDEO CONTROLS + LIVE CUSTOM URL INPUT BAR */}
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={toggleCinemaPlay}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/40 bg-black/85 text-white backdrop-blur-md transition hover:bg-white hover:text-black cursor-pointer"
                    aria-label={isCinemaPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isCinemaPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCinemaMute}
                    className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white/30 bg-black/85 text-white backdrop-blur-md transition hover:border-emerald-400 cursor-pointer"
                    aria-label={isCinemaMuted ? 'Unmute video' : 'Mute video'}
                  >
                    {isCinemaMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>

                <div className="flex flex-1 max-w-xl items-center gap-2 rounded-2xl border border-white/30 bg-black/90 px-4 py-2.5 backdrop-blur-xl">
                  <Maximize2 size={15} className="text-emerald-400 shrink-0" />
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
                      className="text-[10px] font-black uppercase text-amber-300 hover:text-white cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* SIGNATURE VARIANT: ALTERNATING 50/50 ZIG-ZAG NAVAL ARCHITECTURE */}
        <section id="fleet" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10 space-y-12">
          {KIT_CONFIG.fleet.map((vessel, idx) => (
            <Reveal key={vessel.name}>
              <div className={`flex flex-col gap-8 rounded-[2rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} p-6 sm:p-8 lg:items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                <div onClick={() => setZoomImage(vessel.image)} className="lg:w-1/2 overflow-hidden rounded-2xl aspect-[16/10] cursor-zoom-in">
                  <img src={vessel.image} alt={vessel.name} loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
                </div>
                <div className="lg:w-1/2 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full border px-3.5 py-1 text-[10px] font-black uppercase tracking-widest ${THEME.badge}`}>{vessel.meta}</span>
                    <span className={`text-sm font-black ${THEME.goldText}`}>{vessel.rate}</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-black ${THEME.textMain}`}>{vessel.name}</h3>
                  <p className={`text-sm leading-relaxed ${THEME.textMuted}`}>{vessel.desc}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVessel(vessel.name);
                      setChatInput(`Requesting availability & full dossier for ${vessel.name}`);
                      scrollTo('charter-request');
                    }}
                    className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnGold}`}
                  >
                    Inquire About {vessel.name} →
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </section>

        {/* 24/7 AI YACHT CHARTER DESK & GOOGLE CALENDAR (08:00 - 00:00 CET) */}
        <section id="charter-request" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-16 sm:px-7 lg:px-10">
          <Reveal className={`rounded-[2.2rem] border-2 ${THEME.borderAccent} ${THEME.cardBg} p-6 sm:p-10 lg:p-12 shadow-2xl`}>
            <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
              <div>
                <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE RAILWAY N8N + GOOGLE CALENDAR
                </span>
                <h2 className={`mt-4 text-3xl sm:text-5xl font-black uppercase leading-[1.06] ${THEME.textMain}`}>
                  24/7 SAPPHIRE VOYAGE CHARTER DESK
                </h2>
                <p className={`mt-4 text-sm leading-7 ${THEME.textMuted}`}>
                  Test live superyacht charter inquiries, seasonal Mediterranean & Caribbean berth scoping, Google Calendar briefing slots (08:00 CET – 00:00 CET), or white-label kit licensing.
                </p>
                <div className={`mt-6 space-y-2.5 border-t ${THEME.borderSubtle} pt-5 text-xs font-bold ${THEME.textMain}`}>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={THEME.accentText} />
                    <span>Active Zone: {activeZone.zone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={THEME.goldText} />
                    <span>Selected Vessel: {selectedVessel}</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-[1.8rem] border ${THEME.borderSubtle} ${THEME.cardAltBg} p-5 sm:p-6 shadow-xl`}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Principal Name / Family Office"
                    className={`rounded-xl border px-4 py-3 text-xs font-semibold outline-none transition ${THEME.inputCls}`}
                  />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Direct VIP Email"
                    className={`rounded-xl border px-4 py-3 text-xs font-semibold outline-none transition ${THEME.inputCls}`}
                  />
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className={`rounded-xl border px-4 py-3 text-xs font-bold outline-none transition ${THEME.inputCls}`}
                  />
                  <select
                    value={flightSlot}
                    onChange={(e) => setFlightSlot(e.target.value)}
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
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.role === 'user' ? THEME.userBubble : THEME.aiBubble}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAiThinking && (
                    <p className={`text-xs italic animate-pulse ${THEME.accentText}`}>
                      Sapphire Voyage AI Concierge is coordinating your response & calendar slot...
                    </p>
                  )}
                </div>

                <form onSubmit={handleCharterDeskSend} className="mt-4 flex gap-2.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={`Ask about charter availability, book selected CET slot, or $${agencyPriceNum} kit...`}
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

        {/* 150MP VISUAL VAULT GALLERY (UNIQUE SCENES) */}
        <section id="gallery" className={`scroll-mt-24 border-y ${THEME.borderSubtle} ${THEME.cardAltBg} py-20`}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10">
            <Reveal className="mb-10">
              <span className={`text-xs font-black uppercase tracking-[0.22em] ${THEME.goldText}`}>
                150MP Master Visual Vault • Zero Duplicate Scenes
              </span>
              <h2 className={`mt-2 text-3xl sm:text-5xl font-black ${THEME.textMain}`}>
                Ultra-print maritime photography.
              </h2>
            </Reveal>

            <div className={`grid gap-6 ${KIT_CONFIG.vault.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
              {KIT_CONFIG.vault.map((item) => (
                <article key={item.id} className={`group overflow-hidden rounded-[1.6rem] border-2 ${THEME.borderSubtle} ${THEME.cardBg} shadow-xl`}>
                  <button type="button" onClick={() => setZoomImage(item.image)} className="relative block aspect-[1.45] w-full overflow-hidden cursor-zoom-in text-left">
                    <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 rounded-full bg-black/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white">
                      {item.tag}
                    </span>
                  </button>
                  <div className="p-6">
                    <h3 className={`text-lg font-black ${THEME.textMain}`}>{item.title}</h3>
                    <p className={`mt-2 text-xs ${THEME.textMuted}`}>{item.specs}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* B2B LICENSING & TURNKEY BUYOUT */}
        <section id="commercial-pricing" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 lg:px-10">
          <Reveal className="mx-auto mb-10 max-w-3xl text-center">
            <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] ${THEME.badge}`}>
              <Crown size={13} /> Turnkey Superyacht Web + 150MP Brand Kit
            </span>
            <h2 className={`mt-4 text-3xl sm:text-5xl font-black ${THEME.textMain}`}>
              Acquire Sapphire Voyage today.
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
                  <span className={`text-sm font-black uppercase ${THEME.textMain}`}>
                    ⚡ Add 30s 4K/60fps Ocean Aerial Motion Pack (Seedance 2.5 & Kling 4.0)
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
                <p className={`mt-5 text-5xl font-black ${THEME.textMain}`}>${agencyPriceNum}</p>
                <ul className={`mt-6 space-y-3 text-xs font-medium ${THEME.textMuted}`}>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> Complete Sapphire Voyage React + Tailwind JSX (with 16:9 Video Slot)</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> WebP, 4K UHD & 150MP Ultra-Print Master Visuals</li>
                  <li className="flex items-center gap-2.5"><CheckCircle2 size={15} className={THEME.accentText} /> n8n AI Yacht Concierge + Google Calendar Workflow</li>
                </ul>
              </div>
              <button type="button" onClick={() => handlePurchaseTier('standard')} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnPrimary}`}>
                <DownloadCloud size={16} /> License Agency Kit — ${agencyPriceNum}
              </button>
            </div>

            <div className={`flex flex-col justify-between rounded-[1.8rem] border-2 ${THEME.borderAccent} ${THEME.cardAltBg} p-8 shadow-2xl`}>
              <div>
                <span className={`text-xs font-black uppercase tracking-[0.16em] ${THEME.goldText}`}>1-of-1 Exclusive Buyout</span>
                <p className={`mt-5 text-5xl font-black ${THEME.textMain}`}>${buyoutPriceNum}</p>
                <ul className={`mt-6 space-y-3 text-xs font-medium ${THEME.textMuted}`}>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> Permanent Store Removal & Full IP Transfer</li>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> 10 Custom 150MP Renders Tailored to Your Fleet</li>
                  <li className="flex items-center gap-2.5"><ShieldCheck size={15} className={THEME.goldText} /> Signed Enterprise Ownership Certificate</li>
                </ul>
              </div>
              <button type="button" onClick={() => handlePurchaseTier('buyout')} className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnGold}`}>
                <Lock size={15} /> Acquire 1-of-1 Buyout — ${buyoutPriceNum}
              </button>
            </div>
          </div>

          <div className={`mx-auto mt-8 max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border-2 ${THEME.borderSubtle} ${THEME.cardBg} p-6`}>
            <div className="flex items-center gap-3.5">
              <FolderArchive size={22} className={THEME.accentText} />
              <div>
                <h3 className={`text-sm font-black ${THEME.textMain}`}>Download Free 150MP Yacht Sample + Technical Spec (.TXT)</h3>
                <p className={`text-xs ${THEME.textMuted}`}>Inspect full-resolution marine hull & teak details prior to licensing.</p>
              </div>
            </div>
            <a href={KIT_CONFIG.freeSampleLink} target="_blank" rel="noopener noreferrer" className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-wider ${THEME.btnOutline}`}>
              Download Sample + .TXT
            </a>
          </div>
        </section>

        {/* FAQ */}
        <section className={`border-y ${THEME.borderSubtle} ${THEME.cardAltBg} py-16`}>
          <div className="mx-auto max-w-[1440px] px-4 sm:px-7 lg:px-10 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <span className={`text-xs font-black uppercase tracking-[0.2em] ${THEME.accentText}`}>Maritime FAQ</span>
              <h2 className={`mt-2 text-3xl font-black ${THEME.textMain}`}>Before you cast off.</h2>
            </div>
            <div className={`divide-y ${THEME.borderSubtle}`}>
              {FAQS.map((item, idx) => (
                <div key={item.question} className="py-4">
                  <button type="button" onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)} className="flex w-full items-center justify-between gap-4 text-left cursor-pointer">
                    <span className={`text-sm font-black ${THEME.textMain}`}>{item.question}</span>
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
          <div className="relative overflow-hidden rounded-[2rem] border-2 border-white/20 bg-black">
            <img src={KIT_CONFIG.ctaBannerImage} alt="Superyacht Horizon" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
            <div className="relative max-w-2xl px-6 py-14 sm:px-12 sm:py-18 text-white">
              <span className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">Sapphire Voyage</span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-black leading-tight">Set your course beyond crowded harbors.</h2>
              <div className="mt-7 flex flex-wrap gap-3">
                <button type="button" onClick={() => scrollTo('charter-request')} className={`rounded-full px-7 py-4 text-xs font-black uppercase tracking-wider cursor-pointer ${THEME.btnPrimary}`}>
                  Open 24/7 Yacht Desk →
                </button>
                <button type="button" onClick={() => navigate('/stock')} className="rounded-full border border-white/40 bg-black/60 px-6 py-4 text-xs font-black uppercase tracking-wider text-white cursor-pointer">
                  Back to Stock Vaults
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

export default SapphireVoyageYachts;
