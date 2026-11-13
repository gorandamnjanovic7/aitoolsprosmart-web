// ============================================================================
// src/pages/kits/aviation/AeroPriveAtelier.jsx
// Aero Privé Atelier (Page 2 of 5 — Private Aviation Collection)
// Includes all new V10 Cabin & Exterior renders + Prev/Next Page Navigation
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Calendar,
  CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Compass,
  Crown, DownloadCloud, FileCode, FolderArchive, Layers, Lock, MapPin,
  Menu, Pause, Plane, Play, ShieldCheck, Sparkles, Volume2,
  VolumeX, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const SITE = {
  brand: 'Aero Privé Atelier',
  descriptor: 'Private aviation / maison collection',
  analyticsLabel: 'Aero_Prive_Atelier',
  topline: 'Private aviation, arranged with quiet precision • 150MP cabin & fleet architecture',
  kicker: 'An invitation to rise above',
  titleBefore: 'Make room for ',
  titleEmphasis: 'wonder.',
  titleAfter: '',
  description: 'A considered private flight experience, from tarmac chauffeur arrivals and champagne salons to the final view above the clouds.',
  footer: 'A quieter way to cross the world.',
  heroStyle: 'split',
  cabinLayout: 'classic',
  galleryLayout: 'balanced',
  requestLayout: 'split',
  order: ['cabins', 'fleet', 'cinema', 'charter', 'licensing', 'faq'],
  palette: {
    canvas: '#F5F0E7',
    ink: '#1B3040',
    muted: '#6A777C',
    accent: '#B58B4C',
    accentContrast: '#FFFFFF',
    panel: '#FFFDF9',
    soft: '#EAE2D5',
    line: '#D8CCB9',
    inverse: '#142B3A',
    inverseInk: '#FFFFFF'
  }
};

// Automatski prepoznaje .png / .jpg / .jpeg ekstenziju u public/jets/ folderu
const handleSmartJetImageError = (e, fallbackUrl) => {
  const currentSrc = e.currentTarget.getAttribute('src') || '';
  if (currentSrc.endsWith('.png')) {
    e.currentTarget.setAttribute('src', currentSrc.replace('.png', '.jpg'));
  } else if (currentSrc.endsWith('.jpg') && !currentSrc.includes('unsplash.com')) {
    e.currentTarget.setAttribute('src', currentSrc.replace('.jpg', '.jpeg'));
  } else if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
    e.currentTarget.src = fallbackUrl;
  }
};

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/11RFyWjqgczESJuzpyje7hxrXHCvT_5o1/view?usp=sharing',

  // Navigacija između stranica aviona (Stranica 2 od 5):
  prevPageRoute: '/aviation-charter-kit',
  prevPageLabel: 'Prev Jet Page (1/5)',
  nextPageRoute: '/aviation-cloudline-kit', // Ovdje možeš staviti '/aviation-page-3' čim napravimo 3. stranicu
  nextPageLabel: 'Next Kit: Superyachts',
nextPageLabel: 'Next Jet Page: Cloudline (3/5)',
  // Hero slika postavljena na novu zlatnu kabinu sa prošivenim sjedištima:
  heroImage: '/jets/hf_20261111_021355_0157ad98-9c44-474e-bac7-ea41cec7c4ab.png',
  heroFallback: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-white-clouds-in-the-sky-41645-large.mp4',

  // ==========================================================================
  // 7 ULTRA-PREMIUM V10 ENTERIJERA (2 NOVA + 5 POSTOJEĆIH U public/jets/)
  // ==========================================================================
  bespokeCabins: [
    {
      id: 'v10-golden-quilted-salon',
      zone: 'Zone 01 • Golden-Hour Presidential Club',
      mode: 'day',
      title: 'Diamond-Quilted Ivory & Onyx Salon',
      subtitle: 'Hand-stitched diamond leather recliners, backlit honey onyx table & crystal bar',
      materials: 'Backlit Honey Onyx • Diamond-Quilted Nappa Leather • Burl Walnut Galley',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/hf_20261111_021355_0157ad98-9c44-474e-bac7-ea41cec7c4ab.png',
      fallback: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-champagne-marble-club',
      zone: 'Zone 02 • Stratosphere Champagne Suite',
      mode: 'day',
      title: 'Calacatta Marble Floor & Sunset Club',
      subtitle: 'Four executive club seats, silver champagne cooler & panoramic sunset windows',
      materials: 'Polished Calacatta Marble Floor • Cream Full-Grain Leather • Brushed Gold',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/hf_20261111_021355_38e16faa-abea-40bd-9f6c-3016017aee0f.png',
      fallback: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-daylight-lounge',
      zone: 'Zone 03 • Main Architectural Salon',
      mode: 'day',
      title: 'Daylight Calacatta & Walnut Lounge',
      subtitle: 'Curved bouclé sofa, brushed champagne ribs & panoramic daylight windows',
      materials: 'Calacatta Viola Marble • Fluted American Walnut • Full-Grain Cream Leather',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-evening-lounge',
      zone: 'Zone 04 • Night Altitude Club',
      mode: 'night',
      title: 'Evening Obsidian & Smoked Glass Club',
      subtitle: 'Sculpted cove lighting, crystal decanter table & twilight horizon',
      materials: 'Nero Marquina Marble • Smoked Bronze Glass Partitions • Charcoal Nappa',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-travertine-dining',
      zone: 'Zone 05 • Private Dining Suite',
      mode: 'day',
      title: 'Travertine & Fluted Teak Dining Room',
      subtitle: 'Six-seat private culinary table with sunset cloudline views',
      materials: 'Raw Roman Travertine • Vertical Tambour Wood Bulkhead • Fine Porcelain',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_iA4bcS83uK.png',
      fallback: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-marble-boardroom',
      zone: 'Zone 06 • Executive Sky Boardroom',
      mode: 'day',
      title: 'Executive Nero Marble Conference Suite',
      subtitle: 'Six-executive high-back leather chairs for confidential C-suite briefings',
      materials: 'Polished Black Veined Marble • Brushed Brass Inlays • Espresso Leather',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_l7xINVXgv9.png',
      fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-master-bedroom',
      zone: 'Zone 07 • Private Stateroom',
      mode: 'night',
      title: 'Whisper-Quiet Master Bedroom Suite',
      subtitle: 'King-size cashmere bedding, acoustic padded walls & twin stratosphere windows',
      materials: 'Loro Piana Cashmere • Acoustic Alcantara Panels • Warm Reading Sconces',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/jets/magnific_ultrapremium-unbranded-pr_XtD4EIHBfo.png',
      fallback: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85'
    }
  ],

  cinemaVideos: [
    {
      id: 'altitude-reel',
      badge: '01 • High-Altitude Motion Reel',
      title: 'Above the weather, on your own timeline.',
      desc: '4K 60fps aerial cinematography ready for hero headers, social campaigns, and investor decks.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-white-clouds-in-the-sky-41645-large.mp4',
      poster: '/jets/hf_20261110_233304_5a6972f3-2ba3-44d1-8ee2-abfa02059f60.png'
    },
    {
      id: 'sunset-approach',
      badge: '02 • Golden-Hour Departure',
      title: 'Seamless private terminal transitions.',
      desc: 'Warm ambient lighting and cinematic depth engineered for luxury charter brokerages.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',
      poster: '/jets/hf_20261111_021153_17d19e4d-bed4-47e8-8a45-0d45fbadab20.png'
    }
  ],

  // KOMPLETNA V10 GALERIJA SA SVIH 11 TVOJIH SLIKA (7 KABINA + 4 NOVA EKSTERIJERA AVIONA)
  fleetAssets: [
    {
      id: 'v10-golden-quilted-card',
      category: 'cabin',
      tag: 'V10 Presidential Salon',
      title: 'Diamond-Quilted Ivory & Onyx Lounge',
      specs: 'Hand-quilted leather recliners • Backlit onyx table • Crystal decanter bar',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261111_021355_0157ad98-9c44-474e-bac7-ea41cec7c4ab.png',
      fallback: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-champagne-club-card',
      category: 'cabin',
      tag: 'V10 Champagne Suite',
      title: 'Calacatta Marble Floor & Sunset Club',
      specs: 'Marble cabin floor • Silver champagne chiller • Golden cloudline views',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261111_021355_38e16faa-abea-40bd-9f6c-3016017aee0f.png',
      fallback: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-tarmac-chauffeur-card',
      category: 'exterior',
      tag: 'V10 Tarmac Arrival',
      title: 'Direct Ramp Chauffeur Transfer',
      specs: 'Bentley & Aston Martin tarmac escort • Airstair boarding • Golden-hour apron',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261111_021153_17d19e4d-bed4-47e8-8a45-0d45fbadab20.png',
      fallback: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-cloud-cruising-card',
      category: 'exterior',
      tag: 'V10 Stratosphere Cruise',
      title: 'Above the Cloud Deck at Mach 0.92',
      specs: 'Ultra-long-range flagship profile • Sunlit cloud sea • Sculpted winglets',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261110_233304_5a6972f3-2ba3-44d1-8ee2-abfa02059f60.png',
      fallback: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-dawn-takeoff-card',
      category: 'exterior',
      tag: 'V10 Runway Rotation',
      title: 'Dawn Runway Rotation & Climb',
      specs: 'Dynamic nose-gear lift • Morning mist runway • Rose-gold horizon',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261111_021500_b585630c-a8cd-4afb-bae2-8bd1427c77d8.png',
      fallback: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-midnight-livery-card',
      category: 'exterior',
      tag: 'V10 Midnight Flagship',
      title: 'Obsidian Blue VIP Airliner in Flight',
      specs: 'Bespoke deep-navy metallic livery • High-altitude daylight • Executive fleet',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/hf_20261110_233346_69ea1260-5439-49ae-863d-cb5189438464.png',
      fallback: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-sunset-runway-card',
      category: 'exterior',
      tag: 'V10 Golden Departure',
      title: 'Sunset Runway Jet Wash & Glow',
      specs: 'Dramatic golden-hour backlight • Wet runway reflections • Poised for takeoff',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/magnific_capture-profile-img9854_fH2jpHOCDY.jpg',
      fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-arch-daylight',
      category: 'cabin',
      tag: 'V10 Bespoke Salon',
      title: 'Daylight Architectural Lounge',
      specs: 'Curved bouclé sofa • Calacatta marble table • Brushed steel ceiling ribs',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-arch-evening',
      category: 'cabin',
      tag: 'V10 Night Lounge',
      title: 'Evening Obsidian Cocktail Suite',
      specs: 'Smoked glass partitions • Crystal decanter bar • Organic LED ceiling coves',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png',
      fallback: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-travertine-dining-card',
      category: 'dining',
      tag: 'V10 Culinary Suite',
      title: 'Travertine & Fluted Walnut Dining',
      specs: 'Six-guest stone dining table • Fine crystal stemware • Golden-hour windows',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/magnific_ultrapremium-unbranded-pr_iA4bcS83uK.png',
      fallback: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-nero-boardroom-card',
      category: 'dining',
      tag: 'V10 Sky Boardroom',
      title: 'Nero Marquina Executive Conference',
      specs: 'Six executive leather seats • Black veined marble table • Brass trim',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/magnific_ultrapremium-unbranded-pr_l7xINVXgv9.png',
      fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'v10-master-bedroom-card',
      category: 'cabin',
      tag: 'V10 Master Stateroom',
      title: 'Private King Stateroom at 45,000 ft',
      specs: 'Cashmere king bed • Acoustic channel-tufted walls • Dual night tables',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/jets/magnific_ultrapremium-unbranded-pr_XtD4EIHBfo.png',
      fallback: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85'
    }
  ]
};

const FAQS = [
  {
    question: 'What is included in the agency license?',
    answer: 'The agency package includes the React and Tailwind landing-page source, 20 private-jet visual scenes in WebP, 4K UHD and 150MP formats, ICC Color Profile & Print Spec Sheet, and a commercial license for client projects.'
  },
  {
    question: 'Can I change the images, videos, colors and copy?',
    answer: 'Yes. The JSX is organized so your team can swap the video reels, brand palette, imagery, copy, route form and pricing content to fit any private aviation operator or charter broker.'
  },
  {
    question: 'What does the exclusive buyout include?',
    answer: 'The one-buyer option includes all 60 image files, 10 custom 150MP renders, the private-jet prompt ruleset and an enterprise IP transfer certificate, as described in the license section.'
  },
  {
    question: 'Does the route request form book a flight?',
    answer: 'This page includes a working front-end inquiry demonstration. Connect the form to your own CRM, email webhook or concierge desk to receive and manage real booking requests.'
  }
];

const optimizeWebP = (url, width = 1600) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_webp')) {
    return url.replace('/upload/', '/upload/f_webp,q_auto,w_' + width + '/');
  }
  return url;
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const cabinLayouts = {
  classic: 'lg:grid-cols-[1.05fr_0.95fr]',
  reversed: 'lg:grid-cols-[0.82fr_1.18fr]',
  wide: 'lg:grid-cols-[1.25fr_0.75fr]',
  stacked: 'lg:grid-cols-1',
  editorial: 'lg:grid-cols-[0.92fr_1.08fr]'
};

const galleryLayouts = {
  balanced: 'sm:grid-cols-2 xl:grid-cols-3',
  mosaic: 'sm:grid-cols-2 xl:grid-cols-4',
  editorial: 'sm:grid-cols-2 xl:grid-cols-3',
  wide: 'sm:grid-cols-2 xl:grid-cols-2',
  grid: 'sm:grid-cols-2 xl:grid-cols-3'
};

const requestLayouts = {
  split: 'lg:grid-cols-[0.8fr_1.2fr]',
  compact: 'lg:grid-cols-[0.65fr_1.35fr]',
  editorial: 'lg:grid-cols-[1fr_1fr]',
  wide: 'lg:grid-cols-1',
  portal: 'lg:grid-cols-[0.72fr_1.28fr]'
};

const STYLES = '.av-page{background:var(--av-canvas);color:var(--av-ink)}' +
  '.av-panel{background:var(--av-panel);border-color:var(--av-line)}' +
  '.av-soft{background:var(--av-soft)}' +
  '.av-muted{color:var(--av-muted)}' +
  '.av-accent{color:var(--av-accent)}' +
  '.av-accent-bg{background:var(--av-accent);color:var(--av-accent-contrast)}' +
  '.av-inverse{background:var(--av-inverse);color:var(--av-inverse-ink)}' +
  '.av-line{border-color:var(--av-line)}' +
  '.av-button{transition:transform .25s ease,filter .25s ease,box-shadow .25s ease}' +
  '.av-button:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 12px 28px rgba(0,0,0,.12)}' +
  '.av-page ::selection{background:var(--av-accent);color:var(--av-accent-contrast)}' +
  '@media(prefers-reduced-motion:reduce){.av-button{transition:none}}';

const AeroPriveAtelier = () => {
  const navigate = useNavigate();
  const cabinVideoRef = useRef(null);
  const cinemaVideoRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [fleetFilter, setFleetFilter] = useState('all');
  const [zoomImage, setZoomImage] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [heroMediaMode, setHeroMediaMode] = useState('still');
  const [activeCabinIdx, setActiveCabinIdx] = useState(0);
  const [autoTourActive, setAutoTourActive] = useState(true);
  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const [departure, setDeparture] = useState('Geneva (LSGG)');
  const [destination, setDestination] = useState('Nice Côte d’Azur (LFMN)');
  const [aircraftType, setAircraftType] = useState('Long-range private jet');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user || null));
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: SITE.analyticsLabel });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!autoTourActive) return undefined;
    const timer = window.setInterval(() => {
      setActiveCabinIdx((previous) => (previous + 1) % KIT_CONFIG.bespokeCabins.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [autoTourActive]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const filteredAssets = fleetFilter === 'all'
    ? KIT_CONFIG.fleetAssets
    : KIT_CONFIG.fleetAssets.filter((item) => item.category === fleetFilter);
  const activeCabin = KIT_CONFIG.bespokeCabins[activeCabinIdx];
  const activeCinemaClip = KIT_CONFIG.cinemaVideos[activeCinemaIdx];
  const paletteStyle = {
    '--av-canvas': SITE.palette.canvas,
    '--av-ink': SITE.palette.ink,
    '--av-muted': SITE.palette.muted,
    '--av-accent': SITE.palette.accent,
    '--av-accent-contrast': SITE.palette.accentContrast,
    '--av-panel': SITE.palette.panel,
    '--av-soft': SITE.palette.soft,
    '--av-line': SITE.palette.line,
    '--av-inverse': SITE.palette.inverse,
    '--av-inverse-ink': SITE.palette.inverseInk
  };

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Agency Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: price === '1490.00' ? 'private_jet_buyout_1490' : 'private_jet_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handlePurchaseTier = async (tier) => {
    const isBuyout = tier === 'buyout';
    const productName = isBuyout
      ? '1-of-1 Exclusive Buyout: Private Jet Brand + React Kit (60 Files + 3 PSD)'
      : 'Agency License: Private Jet React Kit + 20 Scenes (WebP/4K/150MP) + 3 PSD';
    const price = isBuyout ? '1490.00' : '349.00';
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;
    trackV8Action('high_ticket_checkout_click', {
      item_name: productName,
      value: Number(price),
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
  const moveCabin = (step) => {
    setActiveCabinIdx((previous) => (previous + step + KIT_CONFIG.bespokeCabins.length) % KIT_CONFIG.bespokeCabins.length);
  };
  const moveCinema = (step) => {
    setActiveCinemaIdx((previous) => (previous + step + KIT_CONFIG.cinemaVideos.length) % KIT_CONFIG.cinemaVideos.length);
    setIsCinemaPlaying(true);
  };
  const changeHeroMedia = (mode) => {
    setHeroMediaMode(mode);
    if (cabinVideoRef.current) {
      if (mode === 'video') cabinVideoRef.current.play().catch(() => {});
      else cabinVideoRef.current.pause();
    }
  };
  const heroVideoUrl = activeCinemaClip.videoUrl || KIT_CONFIG.heroVideoUrl;

  const mediaFrame = (className) => (
    <div className={'group relative overflow-hidden av-inverse ' + className}>
      {heroMediaMode === 'video' ? (
        <video
          ref={cabinVideoRef}
          autoPlay
          loop
          muted
          playsInline
          poster={KIT_CONFIG.heroFallback}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroVideoUrl} type="video/mp4" />
        </video>
      ) : (
        <img
          src={KIT_CONFIG.heroImage}
          onError={(event) => handleSmartJetImageError(event, KIT_CONFIG.heroFallback)}
          alt="Private jet cabin above the clouds"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
      <button
        type="button"
        onClick={() => setZoomImage(heroMediaMode === 'video' ? KIT_CONFIG.heroFallback : KIT_CONFIG.heroImage)}
        aria-label="Inspect hero visual"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur-md"
      >
        <ArrowUpRight size={16} />
      </button>
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => changeHeroMedia('still')} className={'rounded-full px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em] ' + (heroMediaMode === 'still' ? 'bg-white text-[#11283A]' : 'bg-black/35 text-white')}>
          <Aperture size={11} className="mr-1 inline" /> 150MP Still
        </button>
        <button type="button" onClick={() => changeHeroMedia('video')} className={'rounded-full px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em] ' + (heroMediaMode === 'video' ? 'bg-white text-[#11283A]' : 'bg-black/35 text-white')}>
          <Play size={11} className="mr-1 inline" /> 4K Motion
        </button>
      </div>
    </div>
  );

  const heroSection = (
    <section className="mx-auto grid max-w-[1480px] gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-20">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border av-line av-panel px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] av-accent"><Plane size={13} /> {SITE.kicker}</span>
        <h1 className="mt-6 max-w-2xl text-5xl font-medium leading-[0.96] tracking-[-0.055em] sm:text-7xl">{SITE.titleBefore}<span className="font-serif italic av-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1>
        <p className="mt-6 max-w-xl text-sm leading-7 av-muted sm:text-base">{SITE.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={() => scrollTo('charter-request')} className="av-button av-accent-bg rounded-full px-6 py-4 text-[9px] font-extrabold uppercase tracking-[0.14em]">Plan your itinerary <ArrowRight size={14} className="ml-2 inline" /></button>
          <button type="button" onClick={() => scrollTo('fleet')} className="av-button rounded-full border av-line av-panel px-6 py-4 text-[9px] font-extrabold uppercase tracking-[0.14em]">Explore the gallery <ArrowUpRight size={14} className="ml-2 inline" /></button>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-6 border-t av-line pt-5">
          <div><strong className="text-2xl">20</strong><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.13em] av-muted">Original scenes</span></div>
          <div><strong className="text-2xl">4K</strong><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.13em] av-muted">Motion</span></div>
          <div><strong className="text-2xl">150MP</strong><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.13em] av-muted">Masters</span></div>
        </div>
      </Reveal>
      <Reveal delay={0.12} className="relative">
        {mediaFrame('h-[440px] rounded-[2rem] sm:h-[590px]')}
        <div className="absolute -bottom-5 left-5 rounded-2xl av-panel p-4 shadow-xl"><span className="text-[8px] font-extrabold uppercase tracking-[0.15em] av-accent">A quiet advantage</span><p className="mt-1 text-sm font-semibold">Arrive ready for what matters.</p></div>
      </Reveal>
    </section>
  );

  const cabinSection = (
    <section id="cabins" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] av-accent">Interactive cabin tour</span>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A private space, designed around the journey.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 av-muted">Seven bespoke V10 cabin scenes. Select a suite or let the tour move through the collection.</p>
        </Reveal>
        <div className={'grid gap-5 ' + cabinLayouts[SITE.cabinLayout]}>
          <Reveal className="relative min-h-[360px] overflow-hidden rounded-[1.6rem] av-inverse sm:min-h-[560px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeCabin.id}
                src={activeCabin.image}
                onError={(e) => handleSmartJetImageError(e, activeCabin.fallback)}
                alt={activeCabin.title}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <button type="button" onClick={() => setZoomImage(activeCabin.image)} className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/25 text-white"><ArrowUpRight size={16} /></button>
            <div className="absolute bottom-5 left-5 right-5 text-white">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/70">{activeCabin.zone}</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{activeCabin.title}</h3>
              <p className="mt-2 max-w-xl text-xs leading-5 text-white/75">{activeCabin.subtitle}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col justify-between rounded-[1.6rem] border av-line av-panel p-5 sm:p-7">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.17em] av-accent"><Aperture size={13} /> Cabin details</span>
                <button type="button" onClick={() => setAutoTourActive((value) => !value)} className="rounded-full border av-line px-3 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em]">{autoTourActive ? 'Pause tour' : 'Auto tour'}</button>
              </div>
              <div className="mt-6">
                <p className="text-[8px] font-extrabold uppercase tracking-[0.15em] av-muted">Material palette</p>
                <p className="mt-2 text-sm leading-6">{activeCabin.materials}</p>
                <p className="mt-4 text-[8px] font-extrabold uppercase tracking-[0.15em] av-muted">Production master</p>
                <p className="mt-1 text-xs leading-5">{activeCabin.resolution}</p>
              </div>

              {/* Brza lista svih 7 kabina */}
              <div className="mt-6 grid grid-cols-1 gap-2">
                {KIT_CONFIG.bespokeCabins.slice(0, 5).map((cabin, idx) => (
                  <button
                    key={cabin.id}
                    type="button"
                    onClick={() => { setAutoTourActive(false); setActiveCabinIdx(idx); }}
                    className={'flex items-center gap-3 rounded-xl border p-2.5 text-left transition ' + (activeCabinIdx === idx ? 'av-accent-bg border-transparent' : 'av-soft av-line')}
                  >
                    <img src={cabin.image} onError={(e) => handleSmartJetImageError(e, cabin.fallback)} alt={cabin.title} className="h-11 w-16 rounded-lg object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[7px] font-extrabold uppercase tracking-[0.14em] opacity-75">{cabin.zone}</span>
                      <span className="block truncate text-xs font-bold">{cabin.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full av-soft">
                <div className="h-full rounded-full av-accent-bg transition-all" style={{ width: ((activeCabinIdx + 1) / KIT_CONFIG.bespokeCabins.length * 100) + '%' }} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button type="button" onClick={() => moveCabin(-1)} aria-label="Previous cabin" className="flex h-10 w-10 items-center justify-center rounded-full border av-line"><ChevronLeft size={16} /></button>
                <div className="flex gap-1.5">
                  {KIT_CONFIG.bespokeCabins.map((cabin, index) => (
                    <button key={cabin.id} type="button" aria-label={'Show ' + cabin.title} onClick={() => setActiveCabinIdx(index)} className={'h-2.5 rounded-full transition-all ' + (activeCabinIdx === index ? 'w-7 av-accent-bg' : 'w-2.5 av-soft')} />
                  ))}
                </div>
                <button type="button" onClick={() => moveCabin(1)} aria-label="Next cabin" className="flex h-10 w-10 items-center justify-center rounded-full border av-line"><ChevronRight size={16} /></button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );

  const fleetSection = (
    <section id="fleet" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 av-soft">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] av-accent">The V10 aviation library</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Scenes built for a premium first impression.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 av-muted">Filter the cabin, dining and aircraft exterior collection. Open any image for a full-resolution preview.</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-7 flex flex-wrap gap-2">
          {[{ id: 'all', label: 'All scenes (12)', icon: Layers }, { id: 'cabin', label: 'Cabins & suites', icon: Aperture }, { id: 'dining', label: 'Dining & boardrooms', icon: Sparkles }, { id: 'exterior', label: 'Aircraft exterior', icon: Plane }].map((tab) => {
            const Icon = tab.icon;
            const active = fleetFilter === tab.id;
            return (
              <button key={tab.id} type="button" onClick={() => setFleetFilter(tab.id)} className={'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[8px] font-extrabold uppercase tracking-[0.12em] transition ' + (active ? 'av-accent-bg border-transparent' : 'av-panel av-line')}>
                <Icon size={13} />{tab.label}
              </button>
            );
          })}
        </Reveal>
        <motion.div layout className={'mt-7 grid gap-4 ' + galleryLayouts[SITE.galleryLayout]}>
          <AnimatePresence mode="popLayout">
            {filteredAssets.map((item, index) => (
              <motion.article key={item.id} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.32, delay: index * 0.02 }} className={'group overflow-hidden rounded-[1.35rem] border av-line av-panel ' + (SITE.galleryLayout === 'mosaic' && index === 0 ? 'xl:col-span-2 xl:row-span-2' : '')}>
                <button type="button" onClick={() => setZoomImage(item.image)} className="relative block aspect-[1.35] w-full overflow-hidden av-inverse text-left">
                  <img src={optimizeWebP(item.image, 1300)} onError={(e) => handleSmartJetImageError(e, item.fallback)} alt={item.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white backdrop-blur">{item.tag}</span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 av-accent"><ArrowUpRight size={15} /></span>
                </button>
                <div className="p-4 sm:p-5">
                  <h3 className="text-sm font-semibold sm:text-base">{item.title}</h3>
                  <p className="mt-2 text-[10px] leading-5 av-muted">{item.specs}</p>
                  <div className="mt-3 flex items-center justify-between border-t av-line pt-3 text-[7px] font-extrabold uppercase tracking-[0.08em] av-accent">
                    <span>{item.resolution}</span>
                    <button type="button" onClick={() => setZoomImage(item.image)}>Inspect</button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );

  const cinemaSection = (
    <section id="cinema-reel" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.2em] av-accent"><Play size={13} /> 4K motion reels</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A moving portrait of private flight.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 av-muted">Two cinematic clips, ready for a landing hero, campaign film or presentation deck.</p>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Reveal className="relative min-h-[340px] overflow-hidden rounded-[1.6rem] av-inverse sm:min-h-[540px]">
            <video key={activeCinemaClip.id} ref={cinemaVideoRef} autoPlay loop muted={isCinemaMuted} playsInline poster={activeCinemaClip.poster} onPlay={() => setIsCinemaPlaying(true)} onPause={() => setIsCinemaPlaying(false)} className="absolute inset-0 h-full w-full object-cover"><source src={activeCinemaClip.videoUrl} type="video/mp4" /></video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/10" />
            <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-black/25 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur">{activeCinemaClip.badge}</div>
            <div className="absolute bottom-5 left-5 right-5 flex flex-col justify-between gap-4 text-white sm:flex-row sm:items-end">
              <div>
                <h3 className="text-2xl font-semibold sm:text-3xl">{activeCinemaClip.title}</h3>
                <p className="mt-2 max-w-xl text-xs leading-5 text-white/70">{activeCinemaClip.desc}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={toggleCinemaPlay} aria-label={isCinemaPlaying ? 'Pause reel' : 'Play reel'} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/25">{isCinemaPlaying ? <Pause size={15} /> : <Play size={15} />}</button>
                <button type="button" onClick={toggleCinemaMute} aria-label={isCinemaMuted ? 'Unmute reel' : 'Mute reel'} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/25">{isCinemaMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
              </div>
            </div>
          </Reveal>
          <div className="flex flex-col gap-3">
            {KIT_CONFIG.cinemaVideos.map((clip, index) => (
              <button key={clip.id} type="button" onClick={() => moveCinema(index - activeCinemaIdx)} className={'flex flex-1 items-center gap-4 rounded-[1.2rem] border p-4 text-left transition ' + (activeCinemaIdx === index ? 'av-accent-bg border-transparent' : 'av-panel av-line')}>
                <img src={clip.poster} onError={(e) => handleSmartJetImageError(e, KIT_CONFIG.heroFallback)} alt="" className="h-20 w-28 rounded-lg object-cover" />
                <span>
                  <span className="block text-[8px] font-extrabold uppercase tracking-[0.14em] opacity-70">{clip.badge}</span>
                  <span className="mt-1 block text-xs font-semibold">{clip.title}</span>
                </span>
                <ArrowRight size={14} className="ml-auto shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );

  const charterSection = (
    <section id="charter-request" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 av-soft">
      <div className={'mx-auto grid max-w-[1440px] gap-8 ' + requestLayouts[SITE.requestLayout]}>
        <Reveal className="flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.2em] av-accent"><Compass size={14} /> Private flight desk</span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Where should the next journey take you?</h2>
          <p className="mt-4 max-w-lg text-sm leading-7 av-muted">Share a few details and a flight desk can help shape the right aircraft and route for your plans.</p>
          <div className="mt-6 flex items-center gap-3 text-xs font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-full av-panel av-accent"><Clock3 size={17} /></span> Personal assistance, around the clock</div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={(event) => { event.preventDefault(); setDemoSubmitted(true); }} className="rounded-[1.5rem] border av-line av-panel p-5 shadow-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div><p className="text-[8px] font-extrabold uppercase tracking-[0.16em] av-accent">Private flight enquiry</p><h3 className="mt-1 text-xl font-semibold">Build your route</h3></div>
              <Plane size={20} className="av-accent" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="rounded-xl border av-line av-soft p-3"><span className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] av-muted"><MapPin size={11} /> Departure</span><input value={departure} onChange={(e) => setDeparture(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="City or airport" /></label>
              <label className="rounded-xl border av-line av-soft p-3"><span className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] av-muted"><MapPin size={11} /> Destination</span><input value={destination} onChange={(e) => setDestination(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="City or airport" /></label>
              <label className="rounded-xl border av-line av-soft p-3"><span className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] av-muted"><Plane size={11} /> Aircraft preference</span><select value={aircraftType} onChange={(e) => setAircraftType(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"><option>Light private jet</option><option>Super-midsize private jet</option><option>Long-range private jet</option><option>Bespoke V10 VIP airliner</option></select></label>
              <label className="rounded-xl border av-line av-soft p-3"><span className="flex items-center gap-1 text-[8px] font-extrabold uppercase tracking-[0.12em] av-muted"><Calendar size={11} /> Travel date</span><input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
            </div>
            <div className="mt-5 flex flex-col justify-between gap-4 border-t av-line pt-5 sm:flex-row sm:items-center">
              <p className="max-w-lg text-[9px] leading-5 av-muted">{demoSubmitted ? 'Preview: ' + departure + ' to ' + destination + ' • ' + aircraftType : 'Front-end enquiry preview. Connect this form to your CRM or flight desk to receive live requests.'}</p>
              <button type="submit" className="av-button av-accent-bg inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.14em] sm:w-auto">Request itinerary <ArrowRight size={13} /></button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );

  const licenseSection = (
    <section id="licensing" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1280px]">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border av-line av-panel px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.16em] av-accent"><Crown size={13} /> {SITE.brand} commercial kit</span>
          <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">A complete private aviation launch kit.</h2>
          <p className="mt-4 text-sm leading-6 av-muted">Keep the React page, motion reels, image library and commercial license together in one ready-to-adapt package.</p>
        </Reveal>
        <div className="mb-8 mt-8 grid gap-4 md:grid-cols-3">
          {[[FileCode, 'React + Tailwind source', 'Responsive JSX with the interactive cabin tour, 4K reel and enquiry preview.'], [Aperture, '60 production image files', '20 original scenes in WebP, 4K UHD and 150MP print master formats.'], [FolderArchive, 'ICC Color Profile & Print Spec Sheet', 'Airport and city advertising layouts with smart objects for presentations.']].map(([Icon, title, description], index) => (
            <Reveal key={title} delay={index * 0.06}>
              <article className="h-full rounded-[1.25rem] border av-line av-panel p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full av-soft av-accent"><Icon size={17} /></span>
                <h3 className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.08em]">{title}</h3>
                <p className="mt-2 text-[10px] leading-5 av-muted">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {[{ tier: 'standard', label: 'Multi-client agency license', price: '$349', description: 'For agencies, developers and private aviation teams building a polished digital presence.', features: ['Complete React + Tailwind JSX source', '60 files: 20 WebP, 20 4K UHD and 20 150MP masters', 'Three editable PSD advertising mockups', 'Commercial license for client websites, campaigns and print'] }, { tier: 'buyout', label: '1-of-1 exclusive buyout', price: '$1,490', description: 'Exclusive ownership for a brand that wants its own private aviation visual world.', features: ['All 60 WebP, 4K UHD and 150MP files', '10 custom 150MP renders in your brand palette', 'Private Jet Prompt Engine ruleset', 'Enterprise IP transfer certificate'] }].map((plan, index) => (
            <Reveal key={plan.tier} delay={index * 0.08}>
              <article className={'relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] border av-line p-6 sm:p-8 ' + (index === 0 ? 'av-panel' : 'av-inverse')}>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] av-accent">{plan.label}</span>
                    <span className="rounded-full av-soft px-3 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.1em]">{index === 0 ? 'Agency' : 'Single buyer'}</span>
                  </div>
                  <p className="mt-5 text-5xl font-semibold tracking-[-0.06em]">{plan.price}</p>
                  <p className="mt-3 text-[10px] leading-5 av-muted">{plan.description}</p>
                  <ul className="mt-5 space-y-3 text-[10px] leading-5">
                    {plan.features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 av-accent" />{feature}</li>)}
                  </ul>
                </div>
                <button type="button" onClick={() => handlePurchaseTier(plan.tier)} className="av-button av-accent-bg mt-7 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.12em]">
                  {index === 0 ? <DownloadCloud size={14} /> : <Lock size={13} />} Select {plan.price}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-6 text-center"><a href={KIT_CONFIG.freeSampleLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.13em] av-accent underline underline-offset-4">Download the 150MP ICC spec sheet and sample <ArrowUpRight size={12} /></a></Reveal>
      </div>
    </section>
  );

  const faqSection = (
    <section id="details" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 av-soft">
      <div className="mx-auto grid max-w-[1280px] gap-8 lg:grid-cols-[0.7fr_1.3fr]">
        <Reveal><span className="text-[9px] font-extrabold uppercase tracking-[0.2em] av-accent">A few helpful details</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Good to know.</h2></Reveal>
        <div className="divide-y av-line">
          {FAQS.map((item, index) => (
            <div key={item.question} className="border-b av-line py-4">
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 text-left">
                <span className="text-sm font-semibold">{item.question}</span>
                <ChevronDown size={17} className={'shrink-0 av-accent transition ' + (openFaq === index ? 'rotate-180' : '')} />
              </button>
              <AnimatePresence initial={false}>
                {openFaq === index && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pr-8 pt-3 text-xs leading-6 av-muted">{item.answer}</motion.p>}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const sections = {
    cabins: cabinSection,
    fleet: fleetSection,
    cinema: cinemaSection,
    charter: charterSection,
    licensing: licenseSection,
    faq: faqSection
  };

  return (
    <div className="av-page min-h-screen overflow-hidden pb-16 font-sans" style={paletteStyle}>
      <style>{STYLES}</style>
      <Helmet>
        <title>{SITE.brand} | Private Jet Charter</title>
        <meta name="description" content={SITE.description} />
        <meta name="theme-color" content={SITE.palette.inverse} />
      </Helmet>
      <div className="av-inverse px-4 py-2 text-center text-[8px] font-extrabold uppercase tracking-[0.2em] sm:text-[9px]">{SITE.topline}</div>
      <header className="sticky top-0 z-40 border-b av-line av-panel backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full av-inverse av-accent"><Plane size={17} /></span>
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.22em]">{SITE.brand}</span>
              <span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.16em] av-muted">{SITE.descriptor}</span>
            </span>
          </button>
          <nav className="hidden items-center gap-6 text-[8px] font-extrabold uppercase tracking-[0.13em] av-muted lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo('cabins')}>Cabins</button>
            <button type="button" onClick={() => scrollTo('fleet')}>Visual library</button>
            <button type="button" onClick={() => scrollTo('cinema-reel')}>Motion reel</button>
            <button type="button" onClick={() => scrollTo('licensing')}>Licensing</button>
          </nav>
          <button type="button" onClick={() => scrollTo('charter-request')} className="av-button av-accent-bg hidden rounded-full px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.13em] sm:inline-flex">Request an itinerary <ArrowRight size={12} className="ml-2" /></button>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" className="flex h-10 w-10 items-center justify-center rounded-full border av-line lg:hidden">{menuOpen ? <X size={17} /> : <Menu size={17} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t av-line lg:hidden">
              <div className="mx-auto flex max-w-[1480px] flex-col px-5 py-3 text-[9px] font-bold uppercase tracking-[0.12em] av-muted">
                {[['Cabin tour', 'cabins'], ['Visual library', 'fleet'], ['Motion reel', 'cinema-reel'], ['Charter request', 'charter-request'], ['Licensing', 'licensing']].map(([label, id]) => <button key={id} type="button" onClick={() => scrollTo(id)} className="py-3 text-left">{label}</button>)}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
      <main>
        {heroSection}
        {SITE.order.map((key) => <React.Fragment key={key}>{sections[key]}</React.Fragment>)}
        <section className="px-4 py-12 sm:px-8 sm:py-16">
          <Reveal className="mx-auto max-w-[1440px]">
            <div className="relative overflow-hidden rounded-[1.7rem] av-inverse p-7 sm:p-12">
              <img src="/jets/hf_20261111_021153_17d19e4d-bed4-47e8-8a45-0d45fbadab20.png" onError={(e) => handleSmartJetImageError(e, KIT_CONFIG.bespokeCabins[1].fallback)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20" />
              <div className="relative max-w-3xl">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] av-accent">Your next journey starts here</span>
                <h2 className="mt-4 text-3xl font-medium leading-tight sm:text-5xl">Take the long way out of the ordinary.</h2>
                <p className="mt-4 max-w-xl text-sm leading-6 opacity-75">Plan a private jet journey or explore the complete aviation brand kit.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button type="button" onClick={() => scrollTo('charter-request')} className="av-button av-accent-bg rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em]">Plan your flight <ArrowRight size={13} className="ml-2 inline" /></button>
                  <button type="button" onClick={() => scrollTo('licensing')} className="av-button rounded-full border border-white/40 bg-white/10 px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em] text-white">View the kit <ArrowUpRight size={13} className="ml-2 inline" /></button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <footer className="border-t av-line px-4 py-7 sm:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full av-inverse av-accent"><Plane size={15} /></span>
            <span>
              <span className="block text-[10px] font-black uppercase tracking-[0.18em]">{SITE.brand}</span>
              <span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.15em] av-muted">Private aviation</span>
            </span>
          </div>
          <p className="text-[9px] av-muted">{SITE.footer}</p>
          <button type="button" onClick={() => navigate('/stock')} className="text-[8px] font-extrabold uppercase tracking-[0.12em] av-accent">Back to stock vaults <ArrowRight size={11} className="ml-1 inline" /></button>
        </div>
      </footer>
      <AnimatePresence>
        {zoomImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={() => setZoomImage(null)}>
            <button type="button" onClick={() => setZoomImage(null)} aria-label="Close image preview" className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X size={20} /></button>
            <img src={zoomImage} onError={(e) => handleSmartJetImageError(e, KIT_CONFIG.heroFallback)} alt="Private aviation image preview" className="max-h-[90vh] max-w-full rounded-xl object-contain" onClick={(event) => event.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
      <LoginRequiredModal isOpen={loginModal.isOpen} onClose={() => setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })} packageName={loginModal.tierName} price={loginModal.price} onLoginSuccess={async (user) => { await recordOrderIntent(user, loginModal.tierName, loginModal.price); setCheckoutData({ isOpen: true, name: loginModal.tierName, price: loginModal.price, zipLink: loginModal.zipLink }); setLoginModal({ isOpen: false, tierName: '', price: '0.00', zipLink: '' }); }} />
      <AnimatePresence>{checkoutData.isOpen && <V8SecureCheckout isOpen={checkoutData.isOpen} productName={checkoutData.name} price={checkoutData.price} zipLink={checkoutData.zipLink} onClose={() => setCheckoutData({ isOpen: false, name: '', price: '0.00', zipLink: '' })} />}</AnimatePresence>

      {/* Plivajuća Prev / Next navigacija između stranica aviona */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#142B3A] shadow-xl border border-[#142B3A]/15 backdrop-blur-md transition hover:bg-[#142B3A] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAE2D5] text-[#142B3A] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#142B3A] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/40 border border-[#B58B4C]/40 transition hover:bg-[#1B3040] hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextPageLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B58B4C] text-white transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default AeroPriveAtelier;