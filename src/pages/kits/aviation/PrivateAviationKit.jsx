// ============================================================================
// src/pages/kits/aviation/PrivateAviationKit.jsx
// Ultra-Luxury V10 Private Jet Kit (Page 1 of 5) — Fixed .png paths
// + Floating Prev/Next Navigation Buttons
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowLeft, ArrowRight, ArrowUpRight, Calendar, CheckCircle2, ChevronDown,
  Clock3, Compass, Crown, DownloadCloud, FileCode, FolderArchive, Layers,
  Lock, MapPin, Menu, Moon, Pause, Plane, Play, ShieldCheck, Sparkles, Sun,
  Volume2, VolumeX, Video, X
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

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/11RFyWjqgczESJuzpyje7hxrXHCvT_5o1/view?usp=sharing',

  // Navigacija (Stranica 1 od 5):
  prevPageRoute: '/',
  prevPageLabel: 'Home',
  nextLandingRoute: '/aviation-atelier-kit',
  nextLandingLabel: 'Next Jet Page: Atelier (2/5)',

  heroImage: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png',
  heroFallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=2200&q=90',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-white-clouds-in-the-sky-41645-large.mp4',

  bespokeCabins: [
    {
      id: 'v10-daylight-lounge',
      zone: 'Zone 01 • Main Architectural Salon',
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
      zone: 'Zone 02 • Night Altitude Club',
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
      zone: 'Zone 03 • Private Dining Suite',
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
      zone: 'Zone 04 • Executive Sky Boardroom',
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
      zone: 'Zone 05 • Private Stateroom',
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
      poster: '/jets/V10_Aero_Architectural_Render_Daylight_150MP.png'
    },
    {
      id: 'sunset-approach',
      badge: '02 • Golden-Hour Departure',
      title: 'Seamless private terminal transitions.',
      desc: 'Warm ambient lighting and cinematic depth engineered for luxury charter brokerages.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-view-of-the-sun-setting-above-the-clouds-from-an-airplane-41649-large.mp4',
      poster: '/jets/V10_Aero_Architectural_Render_Evening_150MP.png'
    }
  ],

  fleetAssets: [
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
    },
    {
      id: 'global-lounge',
      category: 'cabin',
      tag: 'Long-range cabin',
      title: 'A quiet, considered cabin',
      specs: 'Wide leather seating • Warm wood details • Soft indirect lighting',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'boardroom',
      category: 'dining',
      tag: 'Executive cabin',
      title: 'A boardroom above the clouds',
      specs: 'Private meeting space • Fine-grain finishes • Natural window light',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'tarmac-arrival',
      category: 'exterior',
      tag: 'Tarmac arrival',
      title: 'A clear runway to what comes next',
      specs: 'Private terminal approach • Refined aircraft profile • Golden-hour light',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'wing-detail',
      category: 'exterior',
      tag: 'In-flight perspective',
      title: 'The world, from the window seat',
      specs: 'Sculpted wing detail • High-altitude atmosphere • Natural daylight',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'private-jet',
      category: 'exterior',
      tag: 'Private aviation',
      title: 'A poised departure',
      specs: 'Clean aircraft silhouette • Open apron • Crisp editorial composition',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'cabin-window',
      category: 'cabin',
      tag: 'Window seat',
      title: 'A view with room to breathe',
      specs: 'Panoramic oval windows • Tailored leather • Layered morning light',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'jet-runway',
      category: 'exterior',
      tag: 'Ready when you are',
      title: 'Departure, on your schedule',
      specs: 'Private runway scene • Elegant proportions • Blue-hour atmosphere',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1400&q=85'
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
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#071A28]/95 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Private jet image preview"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#102B3F] shadow-xl transition hover:bg-[#E8E1D5]"
        aria-label="Close image preview"
      >
        <X size={22} />
      </button>
      <motion.img
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        src={optimizeWebP(imageUrl, 2400)}
        alt="Private jet visual preview"
        className="max-h-[90vh] max-w-full rounded-2xl border border-white/15 object-contain shadow-2xl"
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

  const [heroMediaMode, setHeroMediaMode] = useState('image');

  const [activeCabinIdx, setActiveCabinIdx] = useState(0);
  const [autoTourActive, setAutoTourActive] = useState(true);

  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const cinemaVideoRef = useRef(null);

  const [departure, setDeparture] = useState('Geneva (LSGG)');
  const [destination, setDestination] = useState('Nice Côte d’Azur (LFMN)');
  const [aircraftType, setAircraftType] = useState('Long-range private jet');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user || null));
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'Private_Jet_Kit' });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!autoTourActive) return undefined;
    const timer = setInterval(() => {
      setActiveCabinIdx((prev) => (prev + 1) % KIT_CONFIG.bespokeCabins.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [autoTourActive]);

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

  const scrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeCabin = KIT_CONFIG.bespokeCabins[activeCabinIdx];
  const activeCinemaClip = KIT_CONFIG.cinemaVideos[activeCinemaIdx];

  return (
    <div className="min-h-screen overflow-hidden bg-[#F5F3ED] pb-16 font-sans text-[#102B3F] selection:bg-[#C5A36A]/30">
      <Helmet>
        <title>Private Jets — Private Aviation Charter & 150MP Visual Kit | Aero Privé</title>
        <meta
          name="description"
          content="A refined private jet charter landing page with an interactive 150MP cabin tour, 4K motion reel, private aviation visual gallery, and agency licensing."
        />
        <meta name="theme-color" content="#102B3F" />
      </Helmet>

      <div className="bg-[#102B3F] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-[11px]">
        Private aviation, arranged around you
        <span className="mx-2 text-[#D5B77C]">•</span>
        150MP Bespoke Cabin Architecture
        <span className="mx-2 text-[#D5B77C]">•</span>
        24/7 Flight Desk
      </div>

      <header className="sticky top-0 z-40 border-b border-[#102B3F]/8 bg-[#F5F3ED]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-7 lg:px-10">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#102B3F] text-[#D5B77C]">
              <Plane size={20} />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em]">Aero Privé</span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#8E806A]">Private aviation</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#52616A] lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo('bespoke-cabins')} className="transition hover:text-[#B18B50]">150MP Cabins</button>
            <button type="button" onClick={() => scrollTo('fleet')} className="transition hover:text-[#B18B50]">The fleet</button>
            <button type="button" onClick={() => scrollTo('cinema-reel')} className="transition hover:text-[#B18B50]">In-Flight Film</button>
            <button type="button" onClick={() => scrollTo('gallery')} className="transition hover:text-[#B18B50]">Gallery</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="transition hover:text-[#B18B50]">Licensing</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => scrollTo('charter-request')} className="rounded-full border border-[#102B3F]/20 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#B18B50] hover:text-[#9B783F]">
              Flight desk
            </button>
            <button type="button" onClick={() => scrollTo('licensing')} className="flex items-center gap-2 rounded-full bg-[#102B3F] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#1D4358]">
              Explore the kit <ArrowRight size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#102B3F]/15 lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
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
              className="overflow-hidden border-t border-[#102B3F]/10 bg-[#F5F3ED] px-5 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="mx-auto flex max-w-[1440px] flex-col gap-1 py-3">
                {[
                  ['150MP Cabins', 'bespoke-cabins'],
                  ['The fleet', 'fleet'],
                  ['In-Flight Film', 'cinema-reel'],
                  ['Gallery', 'gallery'],
                  ['Licensing', 'licensing'],
                  ['Flight desk', 'charter-request']
                ].map(([label, id]) => (
                  <button key={id} type="button" onClick={() => scrollTo(id)} className="py-3 text-left text-xs font-extrabold uppercase tracking-[0.14em] text-[#52616A]">
                    {label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative mx-auto max-w-[1440px] px-4 pb-14 pt-8 sm:px-7 sm:pt-12 lg:px-10 lg:pb-20 lg:pt-16">
          <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-[#D5B77C]/15 blur-3xl" aria-hidden="true" />
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="relative z-10">
              <Reveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C5A36A]/35 bg-white/60 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9B783F]">
                  <Sparkles size={14} /> Your time. Your aircraft. Your way.
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="max-w-2xl text-[clamp(2.8rem,6.2vw,6rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#102B3F]">
                  The world is closer <span className="font-serif italic font-normal text-[#AD8953]">when you fly private.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-7 text-[#596872] sm:text-lg">
                  Thoughtful private jet journeys, tailored to your schedule, your route and the way you like to travel.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => scrollTo('bespoke-cabins')} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#102B3F] px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#102B3F]/15 transition hover:-translate-y-0.5 hover:bg-[#1D4358]">
                    Explore 150MP Cabins <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </button>
                  <button type="button" onClick={() => scrollTo('cinema-reel')} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#102B3F]/15 bg-white/60 px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#102B3F] transition hover:border-[#C5A36A]">
                    <Play size={14} className="text-[#9B783F]" /> Watch flight film
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-11 grid max-w-lg grid-cols-3 border-t border-[#102B3F]/12 pt-5">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight">150MP</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74818A]">Master interiors</p>
                  </div>
                  <div className="border-x border-[#102B3F]/12 px-4">
                    <p className="text-2xl font-semibold tracking-tight">Global</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74818A]">Route planning</p>
                  </div>
                  <div className="pl-4">
                    <p className="text-2xl font-semibold tracking-tight">Bespoke</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74818A]">Every itinerary</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.12} className="relative">
              <div className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#0B1F2E] shadow-2xl shadow-[#102B3F]/15 sm:min-h-[540px] lg:min-h-[640px]">
                {heroMediaMode === 'video' ? (
                  <video
                    key="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={KIT_CONFIG.heroImage}
                    className="absolute inset-0 h-full w-full object-cover transition duration-1000"
                  >
                    <source src="/videos/private-jet-reel.webm" type="video/webm" />
                    <source src={KIT_CONFIG.heroVideoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <motion.img
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'easeOut' }}
                    src={KIT_CONFIG.heroImage}
                    onError={(e) => { e.currentTarget.src = KIT_CONFIG.heroFallback; }}
                    alt="Bespoke private jet cabin interior"
                    onClick={() => setZoomImage(KIT_CONFIG.heroImage)}
                    className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                    fetchPriority="high"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071A28]/80 via-transparent to-[#071A28]/15" />

                <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2 sm:left-7 sm:right-7 sm:top-7">
                  <div className="rounded-full border border-white/40 bg-white/85 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#102B3F] backdrop-blur-md">
                    Private aviation, refined
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-white/30 bg-[#071A28]/70 p-1 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setHeroMediaMode('image')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                        heroMediaMode === 'image' ? 'bg-[#D5B77C] text-[#102B3F]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <Aperture size={12} /> 150MP Cabin
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroMediaMode('video')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                        heroMediaMode === 'video' ? 'bg-[#D5B77C] text-[#102B3F]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <Video size={12} /> 4K Motion
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-5 sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end">
                  <div className="max-w-sm text-white">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#E6D1A7]">A journey shaped around you</p>
                    <h2 className="mt-2 text-2xl font-medium leading-tight sm:text-3xl">A more considered way to travel.</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoomImage(KIT_CONFIG.heroImage)}
                    aria-label="Inspect full resolution hero visual"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#102B3F]"
                  >
                    <ArrowUpRight size={19} />
                  </button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="absolute -bottom-6 left-5 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl backdrop-blur sm:left-10 sm:p-5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7E3D7] text-[#9B783F]"><Clock3 size={19} /></span>
                <span><span className="block text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#8E806A]">Always in reach</span><span className="mt-1 block text-sm font-bold">A dedicated flight desk</span></span>
              </motion.div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[#102B3F]/8 bg-white/55">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-7 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [Plane, 'Aircraft, selected for your route'],
              [Compass, 'Flexible global itineraries'],
              [ShieldCheck, 'Discreet by design'],
              [Sparkles, '150MP bespoke cabin architecture']
            ].map(([Icon, label], index) => (
              <Reveal key={label} delay={index * 0.06}>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#53636D]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7E3D7] text-[#9B783F]"><Icon size={16} /></span>
                  <span>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="bespoke-cabins" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pt-20 sm:px-7 sm:pt-28 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A36A]/40 bg-[#EEE9DE] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#9B783F]">
                <Sparkles size={13} /> V10 Architectural Cabin Tour • 150MP Print Masters
              </span>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Step inside a private residence at 45,000 feet.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#65737B] sm:text-base">
                Explore five custom-appointed cabin zones—from Calacatta marble lounges and Roman travertine dining suites to whisper-quiet master staterooms.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoTourActive(false);
                  setActiveCabinIdx(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  activeCabin.mode === 'day'
                    ? 'border-[#102B3F] bg-[#102B3F] text-white'
                    : 'border-[#102B3F]/15 bg-white text-[#52616A] hover:border-[#B18B50]'
                }`}
              >
                <Sun size={13} className="text-[#D5B77C]" /> Daylight Atmosphere
              </button>
              <button
                type="button"
                onClick={() => {
                  setAutoTourActive(false);
                  setActiveCabinIdx(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  activeCabin.mode === 'night'
                    ? 'border-[#102B3F] bg-[#102B3F] text-white'
                    : 'border-[#102B3F]/15 bg-white text-[#52616A] hover:border-[#B18B50]'
                }`}
              >
                <Moon size={13} className="text-[#D5B77C]" /> Night Flight Mode
              </button>
              <button
                type="button"
                onClick={() => setAutoTourActive((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  autoTourActive
                    ? 'border-[#C5A36A] bg-[#EEE9DE] text-[#9B783F]'
                    : 'border-[#102B3F]/15 bg-white/70 text-[#52616A]'
                }`}
              >
                {autoTourActive ? <Pause size={12} /> : <Play size={12} />}
                {autoTourActive ? 'Auto-Tour On' : 'Auto-Tour Paused'}
              </button>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#102B3F]/12 bg-[#071A28] shadow-2xl sm:min-h-[540px] lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCabin.id}
                  initial={{ opacity: 0, scale: 1.09 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-zoom-in"
                  onClick={() => setZoomImage(activeCabin.image)}
                >
                  <motion.img
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.06 }}
                    transition={{ duration: 6.5, ease: 'linear' }}
                    src={activeCabin.image}
                    onError={(e) => { e.currentTarget.src = activeCabin.fallback; }}
                    alt={activeCabin.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071A28]/90 via-[#071A28]/15 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2 sm:left-7 sm:right-7 sm:top-7">
                <span className="rounded-full border border-white/30 bg-[#071A28]/75 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#E6D1A7] backdrop-blur-md">
                  {activeCabin.zone}
                </span>
                <span className="rounded-full border border-white/25 bg-white/85 px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#102B3F] backdrop-blur-md">
                  {activeCabin.resolution}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end">
                <motion.div
                  key={activeCabin.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="max-w-xl text-white"
                >
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D5B77C]">
                    {activeCabin.materials}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-semibold leading-tight sm:text-3xl">
                    {activeCabin.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/75 sm:text-sm">
                    {activeCabin.subtitle}
                  </p>
                </motion.div>

                <button
                  type="button"
                  onClick={() => setZoomImage(activeCabin.image)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/40 bg-white/15 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur-md transition hover:bg-white hover:text-[#102B3F]"
                >
                  Inspect 150MP <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 lg:col-span-4">
              {KIT_CONFIG.bespokeCabins.map((cabin, idx) => {
                const isSelected = activeCabinIdx === idx;
                return (
                  <motion.button
                    key={cabin.id}
                    type="button"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setAutoTourActive(false);
                      setActiveCabinIdx(idx);
                    }}
                    className={`group flex items-center gap-3.5 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#102B3F] bg-[#102B3F] text-white shadow-lg shadow-[#102B3F]/15'
                        : 'border-[#102B3F]/10 bg-white text-[#102B3F] hover:border-[#C5A36A]'
                    }`}
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#D9E1E1]">
                      <img
                        src={cabin.image}
                        onError={(e) => { e.currentTarget.src = cabin.fallback; }}
                        alt={cabin.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`block text-[8px] font-extrabold uppercase tracking-[0.16em] ${isSelected ? 'text-[#D5B77C]' : 'text-[#9B783F]'}`}>
                        {cabin.zone}
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-bold sm:text-sm">
                        {cabin.title}
                      </span>
                      <span className={`mt-0.5 block truncate text-[10px] ${isSelected ? 'text-white/70' : 'text-[#65737B]'}`}>
                        {cabin.subtitle}
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>

        <section id="fleet" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9B783F]">A cabin for every kind of journey</span>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">The right aircraft makes all the difference.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#65737B] sm:text-base">From short regional hops to long-range journeys, explore a private fleet presented with clarity and care.</p>
            </div>
            <button type="button" onClick={() => scrollTo('charter-request')} className="inline-flex w-fit items-center gap-2 border-b border-[#C5A36A] pb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#102B3F] transition hover:text-[#9B783F]">
              Discuss your route <ArrowRight size={14} />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: 'Executive Dining & Culinary',
                detail: 'Roman travertine dining tables and bespoke galley service for six guests in complete privacy.',
                range: 'Bespoke Culinary Zone',
                image: '/jets/magnific_ultrapremium-unbranded-pr_iA4bcS83uK.png',
                fallback: 'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1200&q=85'
              },
              {
                name: 'Sky Boardroom Class',
                detail: 'Nero Marquina marble conference suite engineered for uninterrupted C-suite negotiations.',
                range: 'Cross-Continental Office',
                image: '/jets/magnific_ultrapremium-unbranded-pr_l7xINVXgv9.png',
                fallback: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1200&q=85'
              },
              {
                name: 'Ultra-Long-Range Stateroom',
                detail: 'A dedicated private bedroom with king cashmere bedding for overnight intercontinental flights.',
                range: '16-Hour Nonstop Range',
                image: '/jets/magnific_ultrapremium-unbranded-pr_XtD4EIHBfo.png',
                fallback: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1200&q=85'
              }
            ].map((aircraft, index) => (
              <Reveal key={aircraft.name} delay={index * 0.09}>
                <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group overflow-hidden rounded-[1.6rem] border border-[#102B3F]/8 bg-white shadow-sm transition hover:shadow-xl hover:shadow-[#102B3F]/10">
                  <div
                    onClick={() => setZoomImage(aircraft.image)}
                    className="relative h-64 cursor-zoom-in overflow-hidden bg-[#D9E1E1]"
                  >
                    <img
                      src={aircraft.image}
                      onError={(e) => { e.currentTarget.src = aircraft.fallback; }}
                      alt={aircraft.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#102B3F] backdrop-blur">{aircraft.range}</span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold tracking-tight">{aircraft.name}</h3>
                      <ArrowUpRight size={17} className="text-[#A88753] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#66747B]">{aircraft.detail}</p>
                    <button type="button" onClick={() => scrollTo('charter-request')} className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#9B783F]">Enquire about this cabin</button>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="cinema-reel" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pb-20 sm:px-7 sm:pb-28 lg:px-10">
          <Reveal className="overflow-hidden rounded-[2.2rem] border border-[#102B3F]/12 bg-[#0B1F2E] text-white shadow-2xl shadow-[#102B3F]/15">
            <div className="grid lg:grid-cols-12">
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#D5B77C]/35 bg-[#D5B77C]/10 px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#E6D1A7]">
                    <Video size={13} /> In-Flight Motion Showcase
                  </span>
                  <h2 className="mt-5 text-2xl font-medium leading-tight tracking-[-0.03em] sm:text-4xl">
                    {activeCinemaClip.title}
                  </h2>
                  <p className="mt-4 text-xs leading-6 text-white/70 sm:text-sm">
                    {activeCinemaClip.desc}
                  </p>

                  <div className="mt-7 space-y-2.5">
                    {KIT_CONFIG.cinemaVideos.map((clip, idx) => (
                      <button
                        key={clip.id}
                        type="button"
                        onClick={() => {
                          setActiveCinemaIdx(idx);
                          setIsCinemaPlaying(true);
                        }}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          activeCinemaIdx === idx
                            ? 'border-[#D5B77C] bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#D5B77C]">
                            {clip.badge}
                          </span>
                          <span className="mt-1 block text-xs font-semibold sm:text-sm">
                            {clip.title}
                          </span>
                        </div>
                        <Play size={15} className={activeCinemaIdx === idx ? 'text-[#D5B77C]' : 'text-white/40'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                  <span>WebM / MP4 Ready • Loop Optimized</span>
                  <button
                    type="button"
                    onClick={() => scrollTo('licensing')}
                    className="text-[#D5B77C] underline decoration-[#D5B77C]/50 underline-offset-4 hover:text-white"
                  >
                    Included in Kit →
                  </button>
                </div>
              </div>

              <div className="relative min-h-[340px] bg-[#071A28] sm:min-h-[440px] lg:col-span-7">
                <video
                  ref={cinemaVideoRef}
                  key={activeCinemaClip.videoUrl}
                  autoPlay
                  loop
                  muted={isCinemaMuted}
                  playsInline
                  poster={activeCinemaClip.poster}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={activeCinemaClip.videoUrl} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071A28]/70 via-transparent to-[#071A28]/20" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/20 bg-[#071A28]/75 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#E6D1A7] backdrop-blur-md">
                    {activeCinemaClip.badge}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleCinemaPlay}
                      aria-label={isCinemaPlaying ? 'Pause video' : 'Play video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#071A28]/75 text-white backdrop-blur-md transition hover:bg-white hover:text-[#102B3F]"
                    >
                      {isCinemaPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleCinemaMute}
                      aria-label={isCinemaMuted ? 'Unmute video' : 'Mute video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#071A28]/75 text-white backdrop-blur-md transition hover:bg-white hover:text-[#102B3F]"
                    >
                      {isCinemaMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="experience" className="relative overflow-hidden bg-[#102B3F] text-white">
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#C5A36A]/12 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-7 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
            <Reveal>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#D5B77C]">Beyond the flight</span>
              <h2 className="mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-5xl">Everything considered, from departure to arrival.</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">A smooth private aviation experience depends on the details around the flight. Tell us what matters, and we can shape the itinerary around it.</p>

              <div className="mt-9 space-y-5">
                {[
                  ['01', 'A simple departure', 'Private terminal access and timing planned around your day.'],
                  ['02', 'A cabin that feels right', 'Choose the aircraft class, cabin atmosphere and onboard details.'],
                  ['03', 'A seamless arrival', 'Coordinate the onward journey and ground transfers in advance.']
                ].map(([number, title, copy]) => (
                  <div key={number} className="flex gap-4 border-t border-white/15 pt-4">
                    <span className="pt-0.5 text-[10px] font-bold tracking-[0.15em] text-[#D5B77C]">{number}</span>
                    <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/55">{copy}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12} className="relative">
              <div className="grid grid-cols-5 grid-rows-2 gap-3">
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeCabins[0].image)} className="group relative col-span-3 row-span-2 min-h-[420px] overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeCabins[0].image}
                    onError={(e) => { e.currentTarget.src = KIT_CONFIG.bespokeCabins[0].fallback; }}
                    alt="Refined private jet cabin with leather seating"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#071A28]/60 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 text-left"><span className="block text-[9px] font-bold uppercase tracking-[0.17em] text-[#E6D1A7]">The architectural salon</span><span className="mt-1 block text-lg font-semibold text-white">Make the hours yours.</span></span>
                </button>
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeCabins[1].image)} className="group relative col-span-2 overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeCabins[1].image}
                    onError={(e) => { e.currentTarget.src = KIT_CONFIG.bespokeCabins[1].fallback; }}
                    alt="Evening cocktail cabin"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#071A28]/65 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white">Night club lounge</span>
                </button>
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeCabins[4].image)} className="group relative col-span-2 overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeCabins[4].image}
                    onError={(e) => { e.currentTarget.src = KIT_CONFIG.bespokeCabins[4].fallback; }}
                    alt="Master stateroom suite"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#071A28]/65 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white">Private stateroom</span>
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="charter-request" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9B783F]"><Compass size={14} /> Start with your itinerary</span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Where would you like to go?</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#65737B] sm:text-base">Share a few details and a flight desk can help shape the right aircraft and route for your plans.</p>
              <div className="mt-7 flex items-center gap-3 text-xs font-semibold text-[#53636D]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9B783F] shadow-sm"><Clock3 size={17} /></span>
                Personal assistance, around the clock
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <form onSubmit={(event) => { event.preventDefault(); setDemoSubmitted(true); }} className="rounded-[1.8rem] border border-[#102B3F]/10 bg-white p-5 shadow-xl shadow-[#102B3F]/5 sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div><p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#9B783F]">Private flight enquiry</p><h3 className="mt-1 text-lg font-semibold">Build your route</h3></div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F0EBDD] text-[#9B783F]"><Plane size={18} /></span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-xl border border-[#102B3F]/10 bg-[#FAF9F6] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><MapPin size={12} /> Departure</span>
                    <input type="text" value={departure} onChange={(event) => setDeparture(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="City or airport" />
                  </label>
                  <label className="rounded-xl border border-[#102B3F]/10 bg-[#FAF9F6] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><MapPin size={12} /> Destination</span>
                    <input type="text" value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="City or airport" />
                  </label>
                  <label className="rounded-xl border border-[#102B3F]/10 bg-[#FAF9F6] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><Plane size={12} /> Aircraft preference</span>
                    <select value={aircraftType} onChange={(event) => setAircraftType(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none">
                      <option>Light private jet</option>
                      <option>Super-midsize private jet</option>
                      <option>Long-range private jet</option>
                      <option>Bespoke V10 VIP airliner</option>
                    </select>
                  </label>
                  <label className="rounded-xl border border-[#102B3F]/10 bg-[#FAF9F6] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><Calendar size={12} /> Travel date</span>
                    <input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" />
                  </label>
                </div>
                <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-[#102B3F]/8 pt-5 sm:flex-row sm:items-center">
                  <p className="max-w-sm text-[11px] leading-5 text-[#7B858A]">
                    {demoSubmitted
                      ? 'Enquiry preview: ' + departure + ' to ' + destination + ' • ' + aircraftType
                      : 'Share your preferred route and aircraft class to start a conversation.'}
                  </p>
                  <button type="submit" className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#102B3F] px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#1D4358] sm:w-auto">
                    Request an itinerary <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 bg-[#ECE9E1]">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#9B783F]">Visual library • 150MP Ultra-Print</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">A closer look at private aviation.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#65737B]">Explore bespoke V10 cabin salons, marble boardrooms, staterooms, and aircraft profiles. Select any image to inspect in full resolution.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All scenes (12)', icon: Layers },
                  { id: 'cabin', label: 'Salons & Suites', icon: Aperture },
                  { id: 'dining', label: 'Dining & Boardrooms', icon: Sparkles },
                  { id: 'exterior', label: 'Aircraft Exteriors', icon: Plane }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = fleetFilter === tab.id;
                  return (
                    <button key={tab.id} type="button" onClick={() => setFleetFilter(tab.id)} className={'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] transition ' + (active ? 'border-[#102B3F] bg-[#102B3F] text-white' : 'border-[#102B3F]/15 bg-white/70 text-[#52616A] hover:border-[#B18B50]')}>
                      <Icon size={13} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <motion.div layout className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    className="group overflow-hidden rounded-[1.4rem] border border-[#102B3F]/8 bg-white shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <button type="button" onClick={() => setZoomImage(item.image)} className="relative block aspect-[1.38] w-full cursor-zoom-in overflow-hidden bg-[#D9E1E1] text-left">
                      <img
                        src={optimizeWebP(item.image, 1200)}
                        onError={(e) => { if (item.fallback) e.currentTarget.src = item.fallback; }}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#102B3F] backdrop-blur">{item.tag}</span>
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#102B3F]/85 text-white transition group-hover:bg-[#C5A36A]"><ArrowUpRight size={16} /></span>
                    </button>
                    <div className="p-5 sm:p-6">
                      <h3 className="text-base font-semibold tracking-tight sm:text-lg">{item.title}</h3>
                      <p className="mt-2 min-h-10 text-xs leading-5 text-[#758087]">{item.specs}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#102B3F]/8 pt-4 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#9B783F]">
                        <span>{item.resolution}</span>
                        <button type="button" onClick={() => setZoomImage(item.image)} className="flex items-center gap-1 text-[#102B3F] hover:text-[#9B783F]">Inspect <ArrowUpRight size={12} /></button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section id="licensing" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <Reveal className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A36A]/35 bg-[#EEE9DE] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#9B783F]"><Crown size={13} /> Turnkey private aviation kit</span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">A complete private jet brand, ready to take off.</h2>
            <p className="mt-4 text-sm leading-7 text-[#65737B] sm:text-base">Launch faster with the React page, a private-jet visual library and commercial-ready assets built for aviation agencies and charter teams.</p>
          </Reveal>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              [FileCode, 'React + Tailwind source', 'A customizable JSX landing page with interactive cabin tour, 4K video showcase, and smooth animations.'],
              [Aperture, '60 production image files', '20 original scenes supplied as WebP previews, 4K UHD campaign images and 150MP print masters.'],
              [FolderArchive, 'Three editable PSD mockups', 'Airport and city advertising layouts with smart objects for quick client presentations.']
            ].map(([Icon, title, description], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <div className="h-full rounded-[1.3rem] border border-[#102B3F]/8 bg-white p-6 shadow-sm sm:p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEE9DE] text-[#9B783F]"><Icon size={19} /></span>
                  <h3 className="mt-5 text-sm font-extrabold uppercase tracking-[0.06em]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#6C787E]">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col justify-between rounded-[1.7rem] border border-[#102B3F]/12 bg-white p-7 shadow-lg shadow-[#102B3F]/5 sm:p-9">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#66747B]">Multi-client agency license</span>
                    <span className="rounded-full bg-[#EEE9DE] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#9B783F]">Instant ZIP</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold tracking-[-0.06em]">$349</p>
                  <p className="mt-3 text-xs leading-6 text-[#758087]">For agencies, developers and private aviation teams building a polished digital presence.</p>
                  <ul className="mt-7 space-y-3 text-xs text-[#52616A]">
                    {[
                      'Complete Aero Privé React + Tailwind JSX source',
                      '60 production files: 20 WebP, 20 4K UHD and 20 150MP masters',
                      'Three editable PSD advertising mockups',
                      'Commercial license for client websites, campaigns and print'
                    ].map((item) => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#7E9A81]" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <button type="button" onClick={() => handlePurchaseTier('standard')} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#102B3F] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#1D4358]">
                  <DownloadCloud size={15} className="text-[#D5B77C]" /> License agency kit — $349
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.7rem] bg-[#102B3F] p-7 text-white shadow-2xl shadow-[#102B3F]/20 sm:p-9">
                <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full bg-[#C5A36A]/15 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#D5B77C]">1-of-1 exclusive buyout</span>
                    <span className="rounded-full bg-[#D5B77C] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#102B3F]">Single buyer</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold tracking-[-0.06em]">$1,490</p>
                  <p className="mt-3 text-xs leading-6 text-white/60">Exclusive ownership for a brand that wants its own private aviation visual world.</p>
                  <ul className="mt-7 space-y-3 text-xs text-white/80">
                    {[
                      'All 60 WebP, 4K UHD and 150MP files',
                      '10 custom 150MP renders in your brand palette',
                      'Private Jet Prompt Engine ruleset for internal expansion',
                      'Signed enterprise IP transfer certificate'
                    ].map((item) => <li key={item} className="flex items-start gap-2.5"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#D5B77C]" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <button type="button" onClick={() => handlePurchaseTier('buyout')} className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#D5B77C] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#102B3F] transition hover:bg-[#E5CA97]">
                  <Lock size={14} /> Acquire exclusive rights — $1,490
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-7 text-center">
            <a href={KIT_CONFIG.freeSampleLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#9B783F] underline decoration-[#C5A36A]/50 underline-offset-4 transition hover:text-[#102B3F]">
              Download the 150MP ICC spec sheet and sample <ArrowUpRight size={13} />
            </a>
          </Reveal>
        </section>

        <section className="border-y border-[#102B3F]/8 bg-white/50">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-14 sm:px-7 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-16">
            <Reveal>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9B783F]">A few helpful details</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Good to know.</h2>
            </Reveal>
            <div className="divide-y divide-[#102B3F]/10">
              {FAQS.map((item, index) => (
                <div key={item.question} className="py-4">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 text-left">
                    <span className="text-sm font-bold">{item.question}</span>
                    <ChevronDown size={17} className={'shrink-0 text-[#9B783F] transition ' + (openFaq === index ? 'rotate-180' : '')} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pr-8 pt-3 text-xs leading-6 text-[#68767D]">
                        {item.answer}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-4 py-16 sm:px-7 sm:py-20 lg:px-10">
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#DCD7C9]">
            <div className="absolute inset-0">
              <img
                src="/jets/V10_Aero_Architectural_Render_Evening_150MP.png"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=2000&q=85'; }}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-40 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#102B3F]/95 via-[#102B3F]/80 to-[#102B3F]/20" />
            </div>
            <div className="relative max-w-3xl px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#E6D1A7]">Your next journey starts here</span>
              <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">Take the long way out of the ordinary.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Plan a private jet journey or explore the complete aviation brand kit.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => scrollTo('charter-request')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D5B77C] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#102B3F] transition hover:bg-[#E5CA97]">Plan your flight <ArrowRight size={14} /></button>
                <button type="button" onClick={() => scrollTo('licensing')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-white/20">View the kit <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#102B3F]/10 px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#102B3F] text-[#D5B77C]"><Plane size={15} /></span>
            <span><span className="block text-xs font-black uppercase tracking-[0.2em]">Aero Privé</span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.15em] text-[#879197]">Private aviation</span></span>
          </div>
          <p className="text-[10px] text-[#7B858A]">Designed for considered journeys, wherever the world takes you.</p>
          <button type="button" onClick={() => navigate('/stock')} className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#52616A] transition hover:text-[#9B783F]">Back to stock vaults <ArrowRight size={12} className="ml-1 inline" /></button>
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
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#102B3F] shadow-xl border border-[#102B3F]/15 backdrop-blur-md transition hover:bg-[#102B3F] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E7E3D7] text-[#102B3F] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#102B3F] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/40 border border-[#D5B77C]/40 transition hover:bg-[#1D4358] hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D5B77C] text-[#102B3F] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default PrivateAviationKit;