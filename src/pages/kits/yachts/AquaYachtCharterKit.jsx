// ============================================================================
// src/pages/kits/yachts/AquaYachtCharterKit.jsx
// Aqua Privé V10 Luxury Yacht Charter Landing Page (Page 1 of 5 — Yachts)
// Includes 5 Bespoke V10 .jpeg/.jpg Interiors, Interactive Route Selector,
// Ken Burns Auto-Tour, 4K Motion Showcase & Prev/Next Yacht Page Navigation.
// ============================================================================
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Aperture, ArrowLeft, ArrowRight, ArrowUpRight, Calendar, CheckCircle2, ChevronDown,
  Clock3, Compass, Crown, DownloadCloud, FileCode, FolderArchive, Layers,
  Lock, MapPin, Menu, Moon, Pause, Anchor, Play, ShieldCheck, Sparkles, Sun,
  Volume2, VolumeX, Video, Waves, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

// START OF FUNCTION: optimizeWebP
const optimizeWebP = (url, width = 1600) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_webp')) {
    return url.replace('/upload/', '/upload/f_webp,q_auto,w_' + width + '/');
  }
  return url;
};
// END OF FUNCTION: optimizeWebP

// START OF FUNCTION: handleSmartImageError
// Automatski proverava .jpeg -> .jpg -> .png -> Unsplash fallback da slike uvek rade!
const handleSmartImageError = (e, fallbackUrl) => {
  const currentSrc = e.currentTarget.getAttribute('src') || '';
  if (currentSrc.endsWith('.jpeg')) {
    e.currentTarget.setAttribute('src', currentSrc.replace('.jpeg', '.jpg'));
  } else if (currentSrc.endsWith('.jpg') && !currentSrc.includes('unsplash.com')) {
    e.currentTarget.setAttribute('src', currentSrc.replace('.jpg', '.png'));
  } else if (fallbackUrl && e.currentTarget.src !== fallbackUrl) {
    e.currentTarget.src = fallbackUrl;
  }
};
// END OF FUNCTION: handleSmartImageError

const KIT_CONFIG = {
  // Google Drive linkovi za ZIP pakete:
  standardZipLink: 'https://drive.google.com/your-standard-349-yacht-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-yacht-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',

  // ISPRAVLJENO: Navigacija za Jahte (Stranica 1 od 5) -> Vodi na 2. stranicu za jahte!
  prevLandingRoute: '/aviation-skyglass-kit',
  prevLandingLabel: 'Prev Kit: Private Jets (6/6)',
  nextLandingRoute: '/yacht-page-2',
  nextLandingLabel: 'Next Yacht Page (2/5)',

  // Hero slika (Slika 5 - Panoramski glavni salon jahte) i video:
  heroImage: '/yachts/5.jpeg',
  heroFallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2200&q=90',
  heroVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-luxury-yacht-during-a-dusk-in-a-port-4446-large.mp4',

  // ==========================================================================
  // 5 TVOJIH ULTRA-PREMIUM V10 ENTERIJERA JAHTE (public/yachts/1.jpeg do 5.jpeg)
  // ==========================================================================
  bespokeInteriors: [
    {
      id: 'v10-main-deck-salon',
      zone: 'Zone 01 • Main Deck Architectural Salon',
      mode: 'day',
      title: 'Symmetrical Bouclé & Teak Horizon Salon',
      subtitle: 'Twin curved ivory sofas, under-lit credenzas & floor-to-ceiling ocean glass',
      materials: 'Honed Travertine Floor • Architectural Teak Pillars • Ivory Bouclé',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-evening-salon',
      zone: 'Zone 02 • Night Harbor Obsidian Lounge',
      mode: 'night',
      title: 'Nero Marquina & Marina Lights Salon',
      subtitle: 'Backlit black marble feature wall, curved lounge sofa & city harbor reflections',
      materials: 'Nero Marquina Marble • Fluted Walnut Ceiling • Brushed Bronze Vitrine',
      resolution: '150MP Master (14,200 × 10,600 px) • 16-Bit TIFF/PNG',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-ocean-dining',
      zone: 'Zone 03 • Sunset Culinary Dining Deck',
      mode: 'day',
      title: 'Calacatta Marble & Fluted Teak Dining Room',
      subtitle: 'Ten-guest sculptural marble dining table framed by a golden sunset horizon',
      materials: 'Calacatta Oro Marble • Vertical Tambour Teak • Reeded Glass Partitions',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-ocean-spa-bath',
      zone: 'Zone 04 • Owner’s Oceanfront Spa Sanctuary',
      mode: 'day',
      title: 'Carved Travertine Monolith Bath & Spa',
      subtitle: 'Hand-chiselled stone soaking tub overlooking the open sea with teak deck flooring',
      materials: 'Carved Roman Travertine • Nero Marble Vanity • Yacht Teak Slats',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1800&q=85'
    },
    {
      id: 'v10-master-suite',
      zone: 'Zone 05 • Owner’s Moonlight Master Suite',
      mode: 'night',
      title: 'Full-Beam Moonlight Master Stateroom',
      subtitle: 'King cashmere bed, walnut headboard & crescent moon reflections on calm water',
      materials: 'American Walnut Paneling • Loro Piana Linen • Marble Dressing Vanity',
      resolution: '150MP Master • Commercial Print & WebP Ready',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1800&q=85'
    }
  ],

  // 3 Poznata Mediteranska Itinerera za brzi izbor
  signatureRoutes: [
    {
      id: 'riviera',
      title: 'Monaco → Cap-Ferrat → St. Tropez',
      distance: '48 NM • French Riviera',
      duration: '3–7 Days Charter',
      vessel: '65m+ Superyacht',
      dep: 'Port Hercule, Monaco',
      dest: 'Saint-Tropez, France'
    },
    {
      id: 'amalfi',
      title: 'Naples → Positano → Capri',
      distance: '36 NM • Tyrrhenian Sea',
      duration: '4–7 Days Charter',
      vessel: '50m Mediterranean Motor Yacht',
      dep: 'Marina Molo Luise, Naples',
      dest: 'Marina Grande, Capri'
    },
    {
      id: 'cyclades',
      title: 'Mykonos → Paros → Santorini',
      distance: '64 NM • Aegean Cyclades',
      duration: '7–10 Days Charter',
      vessel: '75m+ Explorer Superyacht',
      dep: 'Tourlos Marina, Mykonos',
      dest: 'Vlychada Bay, Santorini'
    }
  ],

  cinemaVideos: [
    {
      id: 'blue-water-passage',
      badge: '01 • Blue-Water Passage',
      title: 'A slower rhythm, beyond the shoreline.',
      desc: 'A cinematic yacht and harbor reel for landing-page headers, social campaigns and client presentations.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-ships-sailing-through-the-sea-around-an-archipelago-40078-large.mp4',
      poster: '/yachts/5.jpeg'
    },
    {
      id: 'marina-at-dusk',
      badge: '02 • Marina at Dusk',
      title: 'An arrival framed by blue hour.',
      desc: 'A calm marina passage with a refined coastal atmosphere for yacht charter brands.',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-touring-a-touristy-and-sunny-port-with-boats-and-sailboats-40097-large.mp4',
      poster: '/yachts/3.jpeg'
    }
  ],

  fleetAssets: [
    {
      id: 'yacht-main-salon',
      category: 'interior',
      tag: 'V10 Main Deck Salon',
      title: 'Symmetrical Bouclé & Teak Salon',
      specs: 'Twin curved ivory sofas • Travertine floor • Panoramic ocean glass',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-evening-lounge',
      category: 'interior',
      tag: 'V10 Night Harbor Lounge',
      title: 'Nero Marquina & Marina Lights Salon',
      specs: 'Backlit black marble wall • Curved bouclé sofa • Harbor reflections',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-dining',
      category: 'dining',
      tag: 'V10 Sunset Dining',
      title: 'Calacatta Marble & Fluted Teak Dining',
      specs: 'Ten-guest marble dining table • Reeded glass doors • Sunset sea view',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-owner-spa',
      category: 'dining',
      tag: 'V10 Oceanfront Spa',
      title: 'Carved Travertine Monolith Bath',
      specs: 'Hand-carved stone tub • Teak deck flooring • Uninterrupted horizon',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-master-suite',
      category: 'interior',
      tag: 'V10 Master Stateroom',
      title: 'Full-Beam Moonlight Master Suite',
      specs: 'King cashmere bed • Walnut bulkhead • Moonlight sea reflections',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-sundeck',
      category: 'exterior',
      tag: 'Sun Deck',
      title: 'Days Measured in Sea and Sun',
      specs: 'Open deck • Soft furnishings • Easy access to the water',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1400&q=85',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-aerial',
      category: 'exterior',
      tag: 'Coastal Passage',
      title: 'The Coastline, From the Water',
      specs: 'Blue-water passage • Quiet wake • Wide coastal vistas',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=85',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-open-water',
      category: 'exterior',
      tag: 'Open Water',
      title: 'Room to Find Your Own Pace',
      specs: 'Open-water setting • Elegant profile • Sunlit sea spray',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-private-berth',
      category: 'exterior',
      tag: 'Private Berth',
      title: 'Arrive, Unhurried',
      specs: 'Discreet marina setting • Polished exterior • Soft coastal light',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1400&q=85'
    }
  ]
};

const FAQS = [
  {
    question: 'What is included in the agency license?',
    answer: 'The agency package includes the React and Tailwind landing-page source, 20 yacht visual scenes in WebP, 4K UHD and 150MP formats, ICC Color Profile & Print Spec Sheet, and a commercial license for client projects.'
  },
  {
    question: 'Can I change the images, colors, videos and copy?',
    answer: 'Yes. The JSX is organized so your team can update the video reels, blue color palette, imagery, copy, charter enquiry form and licensing content for a yacht charter brand.'
  },
  {
    question: 'What does the exclusive buyout include?',
    answer: 'The one-buyer option includes all 60 image files, 10 custom 150MP renders, the yacht prompt ruleset and an enterprise IP transfer certificate, as described in the license section.'
  },
  {
    question: 'Does the charter request form confirm a booking?',
    answer: 'This page includes an interactive front-end enquiry demonstration. Connect the form to your own CRM, email webhook or yacht concierge desk to receive and manage real charter requests.'
  }
];

// START OF FUNCTION: Reveal
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
// END OF FUNCTION: Reveal

// START OF FUNCTION: LightboxInspector
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
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-[#041B32]/95 p-4 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Luxury yacht image preview"
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#073B66] shadow-xl transition hover:bg-[#DDECF1]"
        aria-label="Close image preview"
      >
        <X size={22} />
      </button>
      <motion.img
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        src={optimizeWebP(imageUrl, 2400)}
        onError={(e) => handleSmartImageError(e, KIT_CONFIG.heroFallback)}
        alt="Luxury yacht visual preview"
        className="max-h-[90vh] max-w-full rounded-2xl border border-white/15 object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </motion.div>,
    document.body
  );
};
// END OF FUNCTION: LightboxInspector

// START OF FUNCTION: AquaYachtCharterKit
const AquaYachtCharterKit = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [fleetFilter, setFleetFilter] = useState('all');
  const [zoomImage, setZoomImage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const [heroMediaMode, setHeroMediaMode] = useState('image');

  const [activeInteriorIdx, setActiveInteriorIdx] = useState(0);
  const [autoTourActive, setAutoTourActive] = useState(true);

  const [activeCinemaIdx, setActiveCinemaIdx] = useState(0);
  const [isCinemaPlaying, setIsCinemaPlaying] = useState(true);
  const [isCinemaMuted, setIsCinemaMuted] = useState(true);
  const cinemaVideoRef = useRef(null);

  const [departure, setDeparture] = useState('Port Hercule, Monaco');
  const [destination, setDestination] = useState('Saint-Tropez, France');
  const [yachtType, setYachtType] = useState('65m+ superyacht');
  const [selectedRouteId, setSelectedRouteId] = useState('riviera');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user || null));
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'Private_Yacht_Kit' });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!autoTourActive) return undefined;
    const timer = setInterval(() => {
      setActiveInteriorIdx((prev) => (prev + 1) % KIT_CONFIG.bespokeInteriors.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [autoTourActive]);

  const filteredAssets = fleetFilter === 'all'
    ? KIT_CONFIG.fleetAssets
    : KIT_CONFIG.fleetAssets.filter((item) => item.category === fleetFilter);

  // START OF FUNCTION: toggleCinemaPlay
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
  // END OF FUNCTION: toggleCinemaPlay

  // START OF FUNCTION: toggleCinemaMute
  const toggleCinemaMute = () => {
    if (!cinemaVideoRef.current) return;
    cinemaVideoRef.current.muted = !cinemaVideoRef.current.muted;
    setIsCinemaMuted(cinemaVideoRef.current.muted);
  };
  // END OF FUNCTION: toggleCinemaMute

  // START OF FUNCTION: applySignatureRoute
  const applySignatureRoute = (route) => {
    setSelectedRouteId(route.id);
    setDeparture(route.dep);
    setDestination(route.dest);
    setYachtType(route.vessel);
  };
  // END OF FUNCTION: applySignatureRoute

  // START OF FUNCTION: recordOrderIntent
  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Agency Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: price === '1490.00' ? 'private_yacht_buyout_1490' : 'private_yacht_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (error) {
      console.error(error);
    }
  };
  // END OF FUNCTION: recordOrderIntent

  // START OF FUNCTION: handlePurchaseTier
  const handlePurchaseTier = async (tier) => {
    const isBuyout = tier === 'buyout';
    const productName = isBuyout
      ? '1-of-1 Exclusive Buyout: Luxury Yacht Brand + React Kit (60 Files + 3 PSD)'
      : 'Agency License: Luxury Yacht React Kit + 20 Scenes (WebP/4K/150MP) + 3 PSD';
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
  // END OF FUNCTION: handlePurchaseTier

  // START OF FUNCTION: scrollTo
  const scrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  // END OF FUNCTION: scrollTo

  const activeInterior = KIT_CONFIG.bespokeInteriors[activeInteriorIdx];
  const activeCinemaClip = KIT_CONFIG.cinemaVideos[activeCinemaIdx];

  return (
    <div className="min-h-screen overflow-hidden bg-[#F4F9FB] pb-16 font-sans text-[#073B66] selection:bg-[#55B6CD]/30">
      <Helmet>
        <title>Luxury Yacht Charters & 150MP Marine Visual Kit | Aqua Privé</title>
        <meta
          name="description"
          content="A refined private yacht charter landing page with an interactive 150MP interior tour, 4K motion reel, yacht charter visual gallery, and agency licensing."
        />
        <meta name="theme-color" content="#073B66" />
      </Helmet>

      <div className="bg-[#073B66] px-4 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-white/80 sm:text-[11px]">
        Private yacht charters, shaped around you
        <span className="mx-2 text-[#55BBD1]">•</span>
        150MP Bespoke Superyacht Architecture
        <span className="mx-2 text-[#55BBD1]">•</span>
        24/7 Yacht Concierge
      </div>

      <header className="sticky top-0 z-40 border-b border-[#073B66]/8 bg-[#F4F9FB]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-4 sm:px-7 lg:px-10">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#073B66] text-[#55BBD1]">
              <Anchor size={20} />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.24em]">Aqua Privé</span>
              <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.2em] text-[#648492]">Private Yacht Charter</span>
            </span>
          </button>

          <nav className="hidden items-center gap-7 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#52616A] lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => scrollTo('bespoke-interiors')} className="transition hover:text-[#55B6CD]">150MP Yacht Interiors</button>
            <button type="button" onClick={() => scrollTo('fleet')} className="transition hover:text-[#55B6CD]">The fleet</button>
            <button type="button" onClick={() => scrollTo('cinema-reel')} className="transition hover:text-[#55B6CD]">At-Sea Film</button>
            <button type="button" onClick={() => scrollTo('gallery')} className="transition hover:text-[#55B6CD]">Gallery</button>
            <button type="button" onClick={() => scrollTo('licensing')} className="transition hover:text-[#55B6CD]">Licensing</button>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button type="button" onClick={() => scrollTo('charter-request')} className="rounded-full border border-[#073B66]/20 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#55B6CD] hover:text-[#287F9F]">
              Yacht concierge
            </button>
            <button type="button" onClick={() => scrollTo('licensing')} className="flex items-center gap-2 rounded-full bg-[#073B66] px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#0B5F91]">
              Explore the kit <ArrowRight size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#073B66]/15 lg:hidden"
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
              className="overflow-hidden border-t border-[#073B66]/10 bg-[#F4F9FB] px-5 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="mx-auto flex max-w-[1440px] flex-col gap-1 py-3">
                {[
                  ['150MP Yacht Interiors', 'bespoke-interiors'],
                  ['The fleet', 'fleet'],
                  ['At-Sea Film', 'cinema-reel'],
                  ['Gallery', 'gallery'],
                  ['Licensing', 'licensing'],
                  ['Yacht concierge', 'charter-request']
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
          <div className="absolute -right-32 top-8 h-80 w-80 rounded-full bg-[#55BBD1]/15 blur-3xl" aria-hidden="true" />
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            <div className="relative z-10">
              <Reveal>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#55B6CD]/35 bg-white/60 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#287F9F]">
                  <Sparkles size={14} /> Your time. Your yacht. Your own horizon.
                </span>
              </Reveal>
              <Reveal delay={0.08}>
                <h1 className="max-w-2xl text-[clamp(2.8rem,6.2vw,6rem)] font-semibold leading-[0.96] tracking-[-0.055em] text-[#073B66]">
                  A new horizon begins <span className="font-serif italic font-normal text-[#238CAB]">when you set sail.</span>
                </h1>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-base leading-7 text-[#596872] sm:text-lg">
                  Private yacht charters shaped around your pace, your guests and the places you want to discover.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button type="button" onClick={() => scrollTo('bespoke-interiors')} className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#073B66] px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-lg shadow-[#073B66]/15 transition hover:-translate-y-0.5 hover:bg-[#0B5F91]">
                    Explore 150MP Yacht Interiors <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </button>
                  <button type="button" onClick={() => scrollTo('cinema-reel')} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#073B66]/15 bg-white/60 px-7 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#073B66] transition hover:border-[#55B6CD]">
                    <Play size={14} className="text-[#287F9F]" /> Watch Yacht Film
                  </button>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-11 grid max-w-lg grid-cols-3 border-t border-[#073B66]/12 pt-5">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight">150MP</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.13em] text-[#74818A]">Master interiors</p>
                  </div>
                  <div className="border-x border-[#073B66]/12 px-4">
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
              <div className="group relative min-h-[440px] overflow-hidden rounded-[2rem] bg-[#062F50] shadow-2xl shadow-[#073B66]/15 sm:min-h-[540px] lg:min-h-[640px]">
                {heroMediaMode === 'video' ? (
                  <video
                    key="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={KIT_CONFIG.heroFallback}
                    className="absolute inset-0 h-full w-full object-cover transition duration-1000"
                  >
                    <source src="/videos/private-yacht-reel.webm" type="video/webm" />
                    <source src={KIT_CONFIG.heroVideoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <motion.img
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 8, ease: 'easeOut' }}
                    src={KIT_CONFIG.heroImage}
                    onError={(e) => handleSmartImageError(e, KIT_CONFIG.heroFallback)}
                    alt="Bespoke private yacht interior"
                    onClick={() => setZoomImage(KIT_CONFIG.heroImage)}
                    className="absolute inset-0 h-full w-full cursor-zoom-in object-cover"
                    fetchPriority="high"
                  />
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041B32]/80 via-transparent to-[#041B32]/15" />

                <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2 sm:left-7 sm:right-7 sm:top-7">
                  <div className="rounded-full border border-white/40 bg-white/85 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#073B66] backdrop-blur-md">
                    Private Yacht Charter, refined
                  </div>

                  <div className="flex items-center gap-1 rounded-full border border-white/30 bg-[#041B32]/70 p-1 backdrop-blur-md">
                    <button
                      type="button"
                      onClick={() => setHeroMediaMode('image')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                        heroMediaMode === 'image' ? 'bg-[#55BBD1] text-[#073B66]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <Aperture size={12} /> 150MP Interior
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroMediaMode('video')}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                        heroMediaMode === 'video' ? 'bg-[#55BBD1] text-[#073B66]' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <Video size={12} /> 4K Motion
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-5 sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end">
                  <div className="max-w-sm text-white">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#B7E8F1]">A journey shaped around you</p>
                    <h2 className="mt-2 text-2xl font-medium leading-tight sm:text-3xl">A more considered way to explore.</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoomImage(KIT_CONFIG.heroImage)}
                    aria-label="Inspect full resolution hero visual"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white backdrop-blur transition hover:bg-white hover:text-[#073B66]"
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
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#DDECF1] text-[#287F9F]"><Clock3 size={19} /></span>
                <span><span className="block text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#648492]">Always in reach</span><span className="mt-1 block text-sm font-bold">A dedicated yacht concierge</span></span>
              </motion.div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-[#073B66]/8 bg-white/55">
          <div className="mx-auto grid max-w-[1440px] grid-cols-2 gap-5 px-4 py-7 sm:px-7 md:grid-cols-4 lg:px-10">
            {[
              [Anchor, 'Yacht, selected for your route'],
              [Compass, 'Flexible coastal itineraries'],
              [ShieldCheck, 'Discreet by design'],
              [Sparkles, '150MP bespoke yacht interiors']
            ].map(([Icon, label], index) => (
              <Reveal key={label} delay={index * 0.06}>
                <div className="flex items-center gap-3 text-xs font-semibold text-[#53636D]">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DDECF1] text-[#287F9F]"><Icon size={16} /></span>
                  <span>{label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* =============================================================== */}
        {/* ANIMATED SECTION: 5 BESPOKE V10 YACHT INTERIORS (.JPEG/.JPG)    */}
        {/* =============================================================== */}
        <section id="bespoke-interiors" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pt-20 sm:px-7 sm:pt-28 lg:px-10">
          <Reveal className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#55B6CD]/40 bg-[#E6F3F7] px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#287F9F]">
                <Sparkles size={13} /> V10 Yacht Interior Tour • 150MP Print Masters
              </span>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                Step inside a private sanctuary at sea.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#65737B] sm:text-base">
                Explore five custom-appointed superyacht zones—from symmetrical bouclé salons and Calacatta sunset dining to carved travertine oceanfront spas.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAutoTourActive(false);
                  setActiveInteriorIdx(0);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  activeInterior.mode === 'day'
                    ? 'border-[#073B66] bg-[#073B66] text-white'
                    : 'border-[#073B66]/15 bg-white text-[#52616A] hover:border-[#55B6CD]'
                }`}
              >
                <Sun size={13} className="text-[#55BBD1]" /> Daylight at Sea
              </button>
              <button
                type="button"
                onClick={() => {
                  setAutoTourActive(false);
                  setActiveInteriorIdx(1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  activeInterior.mode === 'night'
                    ? 'border-[#073B66] bg-[#073B66] text-white'
                    : 'border-[#073B66]/15 bg-white text-[#52616A] hover:border-[#55B6CD]'
                }`}
              >
                <Moon size={13} className="text-[#55BBD1]" /> Evening Ambience
              </button>
              <button
                type="button"
                onClick={() => setAutoTourActive((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.14em] transition ${
                  autoTourActive
                    ? 'border-[#55B6CD] bg-[#E6F3F7] text-[#287F9F]'
                    : 'border-[#073B66]/15 bg-white/70 text-[#52616A]'
                }`}
              >
                {autoTourActive ? <Pause size={12} /> : <Play size={12} />}
                {autoTourActive ? 'Auto-Tour On' : 'Auto-Tour Paused'}
              </button>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-12">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-[#073B66]/12 bg-[#041B32] shadow-2xl sm:min-h-[540px] lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeInterior.id}
                  initial={{ opacity: 0, scale: 1.09 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 cursor-zoom-in"
                  onClick={() => setZoomImage(activeInterior.image)}
                >
                  <motion.img
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.06 }}
                    transition={{ duration: 6.5, ease: 'linear' }}
                    src={activeInterior.image}
                    onError={(e) => handleSmartImageError(e, activeInterior.fallback)}
                    alt={activeInterior.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041B32]/90 via-[#041B32]/15 to-transparent" />
                </motion.div>
              </AnimatePresence>

              <div className="pointer-events-none absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-2 sm:left-7 sm:right-7 sm:top-7">
                <span className="rounded-full border border-white/30 bg-[#041B32]/75 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#B7E8F1] backdrop-blur-md">
                  {activeInterior.zone}
                </span>
                <span className="rounded-full border border-white/25 bg-white/85 px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#073B66] backdrop-blur-md">
                  {activeInterior.resolution}
                </span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 sm:bottom-8 sm:left-8 sm:right-8 sm:flex-row sm:items-end">
                <motion.div
                  key={activeInterior.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="max-w-xl text-white"
                >
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#55BBD1]">
                    {activeInterior.materials}
                  </p>
                  <h3 className="mt-1.5 text-2xl font-semibold leading-tight sm:text-3xl">
                    {activeInterior.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-white/75 sm:text-sm">
                    {activeInterior.subtitle}
                  </p>
                </motion.div>

                <button
                  type="button"
                  onClick={() => setZoomImage(activeInterior.image)}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/40 bg-white/15 px-5 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur-md transition hover:bg-white hover:text-[#073B66]"
                >
                  Inspect 150MP <ArrowUpRight size={15} />
                </button>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-3 lg:col-span-4">
              {KIT_CONFIG.bespokeInteriors.map((interior, idx) => {
                const isSelected = activeInteriorIdx === idx;
                return (
                  <motion.button
                    key={interior.id}
                    type="button"
                    whileHover={{ x: 4 }}
                    onClick={() => {
                      setAutoTourActive(false);
                      setActiveInteriorIdx(idx);
                    }}
                    className={`group flex items-center gap-3.5 rounded-2xl border p-3 text-left transition-all ${
                      isSelected
                        ? 'border-[#073B66] bg-[#073B66] text-white shadow-lg shadow-[#073B66]/15'
                        : 'border-[#073B66]/10 bg-white text-[#073B66] hover:border-[#55B6CD]'
                    }`}
                  >
                    <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-[#D5EAF0]">
                      <img
                        src={interior.image}
                        onError={(e) => handleSmartImageError(e, interior.fallback)}
                        alt={interior.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className={`block text-[8px] font-extrabold uppercase tracking-[0.16em] ${isSelected ? 'text-[#55BBD1]' : 'text-[#287F9F]'}`}>
                        {interior.zone}
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-bold sm:text-sm">
                        {interior.title}
                      </span>
                      <span className={`mt-0.5 block truncate text-[10px] ${isSelected ? 'text-white/70' : 'text-[#65737B]'}`}>
                        {interior.subtitle}
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
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#287F9F]">The yacht collection</span>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Find your own pace at sea.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[#65737B] sm:text-base">From sunset Calacatta dining decks to oceanfront travertine spa sanctuaries, explore bespoke superyacht architecture.</p>
            </div>
            <button type="button" onClick={() => scrollTo('charter-request')} className="inline-flex w-fit items-center gap-2 border-b border-[#55B6CD] pb-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#073B66] transition hover:text-[#287F9F]">
              Discuss your route <ArrowRight size={14} />
            </button>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: 'Sunset Culinary Dining Deck',
                detail: 'A ten-seat Calacatta marble dining room with fluted teak bulkheads and open-horizon sunset views.',
                range: 'Bespoke Gastronomy',
                image: '/yachts/1.jpeg',
                fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85'
              },
              {
                name: 'Oceanfront Travertine Spa',
                detail: 'A private wellness sanctuary featuring a carved stone soaking tub overlooking the open sea.',
                range: 'Wellness Sanctuary',
                image: '/yachts/4.jpeg',
                fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1200&q=85'
              },
              {
                name: 'Moonlight Master Stateroom',
                detail: 'Full-beam owner’s suite with walnut paneling, cashmere bedding and panoramic night-sea views.',
                range: 'Owner’s Deck Suite',
                image: '/yachts/2.jpeg',
                fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=85'
              }
            ].map((yacht, index) => (
              <Reveal key={yacht.name} delay={index * 0.09}>
                <motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group overflow-hidden rounded-[1.6rem] border border-[#073B66]/8 bg-white shadow-sm transition hover:shadow-xl hover:shadow-[#073B66]/10">
                  <div
                    onClick={() => setZoomImage(yacht.image)}
                    className="relative h-64 cursor-zoom-in overflow-hidden bg-[#D5EAF0]"
                  >
                    <img
                      src={yacht.image}
                      onError={(e) => handleSmartImageError(e, yacht.fallback)}
                      alt={yacht.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#073B66] backdrop-blur">{yacht.range}</span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold tracking-tight">{yacht.name}</h3>
                      <ArrowUpRight size={17} className="text-[#238CAB] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#66747B]">{yacht.detail}</p>
                    <button type="button" onClick={() => scrollTo('charter-request')} className="mt-6 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#287F9F]">Explore this yacht zone</button>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="cinema-reel" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 pb-20 sm:px-7 sm:pb-28 lg:px-10">
          <Reveal className="overflow-hidden rounded-[2.2rem] border border-[#073B66]/12 bg-[#062F50] text-white shadow-2xl shadow-[#073B66]/15">
            <div className="grid lg:grid-cols-12">
              <div className="flex flex-col justify-between p-7 sm:p-10 lg:col-span-5 lg:p-12">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#55BBD1]/35 bg-[#55BBD1]/10 px-3.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#B7E8F1]">
                    <Video size={13} /> At-Sea Motion Showcase
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
                            ? 'border-[#55BBD1] bg-white/10 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/25 hover:text-white'
                        }`}
                      >
                        <div>
                          <span className="block text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#55BBD1]">
                            {clip.badge}
                          </span>
                          <span className="mt-1 block text-xs font-semibold sm:text-sm">
                            {clip.title}
                          </span>
                        </div>
                        <Play size={15} className={activeCinemaIdx === idx ? 'text-[#55BBD1]' : 'text-white/40'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/60">
                  <span>WebM / MP4 Ready • Loop Optimized</span>
                  <button
                    type="button"
                    onClick={() => scrollTo('licensing')}
                    className="text-[#55BBD1] underline decoration-[#55BBD1]/50 underline-offset-4 hover:text-white"
                  >
                    Included in Kit →
                  </button>
                </div>
              </div>

              <div className="relative min-h-[340px] bg-[#041B32] sm:min-h-[440px] lg:col-span-7">
                <video
                  ref={cinemaVideoRef}
                  key={activeCinemaClip.videoUrl}
                  autoPlay
                  loop
                  muted={isCinemaMuted}
                  playsInline
                  poster={KIT_CONFIG.heroFallback}
                  className="absolute inset-0 h-full w-full object-cover"
                >
                  <source src={activeCinemaClip.videoUrl} type="video/mp4" />
                </video>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#041B32]/70 via-transparent to-[#041B32]/20" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3">
                  <span className="rounded-full border border-white/20 bg-[#041B32]/75 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-[#B7E8F1] backdrop-blur-md">
                    {activeCinemaClip.badge}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={toggleCinemaPlay}
                      aria-label={isCinemaPlaying ? 'Pause video' : 'Play video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#041B32]/75 text-white backdrop-blur-md transition hover:bg-white hover:text-[#073B66]"
                    >
                      {isCinemaPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={toggleCinemaMute}
                      aria-label={isCinemaMuted ? 'Unmute video' : 'Mute video'}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#041B32]/75 text-white backdrop-blur-md transition hover:bg-white hover:text-[#073B66]"
                    >
                      {isCinemaMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="experience" className="relative overflow-hidden bg-[#073B66] text-white">
          <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[#55B6CD]/12 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-12 px-4 py-20 sm:px-7 sm:py-24 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28">
            <Reveal>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#55BBD1]">Beyond the voyage</span>
              <h2 className="mt-4 max-w-xl text-3xl font-medium leading-tight tracking-[-0.035em] sm:text-5xl">Everything considered, from departure to arrival.</h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">A memorable yacht charter is shaped by the details around the voyage. Tell us what matters, and we can plan the journey around it.</p>

              <div className="mt-9 space-y-5">
                {[
                  ['01', 'An effortless embarkation', 'A private marina arrival and timing planned around your day.'],
                  ['02', 'Spaces that feel like you', 'Choose your yacht, interior atmosphere and onboard details.'],
                  ['03', 'Every stop, thoughtfully planned', 'Coordinate the route, marina berths and tender transfers in advance.']
                ].map(([number, title, copy]) => (
                  <div key={number} className="flex gap-4 border-t border-white/15 pt-4">
                    <span className="pt-0.5 text-[10px] font-bold tracking-[0.15em] text-[#55BBD1]">{number}</span>
                    <div><h3 className="text-sm font-bold">{title}</h3><p className="mt-1 text-xs leading-5 text-white/55">{copy}</p></div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12} className="relative">
              <div className="grid grid-cols-5 grid-rows-2 gap-3">
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeInteriors[0].image)} className="group relative col-span-3 row-span-2 min-h-[420px] overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeInteriors[0].image}
                    onError={(e) => handleSmartImageError(e, KIT_CONFIG.bespokeInteriors[0].fallback)}
                    alt="Refined yacht salon with ocean views"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#041B32]/60 via-transparent to-transparent" />
                  <span className="absolute bottom-5 left-5 text-left"><span className="block text-[9px] font-bold uppercase tracking-[0.17em] text-[#B7E8F1]">The architectural salon</span><span className="mt-1 block text-lg font-semibold text-white">Make the hours yours.</span></span>
                </button>
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeInteriors[1].image)} className="group relative col-span-2 overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeInteriors[1].image}
                    onError={(e) => handleSmartImageError(e, KIT_CONFIG.bespokeInteriors[1].fallback)}
                    alt="Evening cocktail interior"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#041B32]/65 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white">Night harbor salon</span>
                </button>
                <button type="button" onClick={() => setZoomImage(KIT_CONFIG.bespokeInteriors[3].image)} className="group relative col-span-2 overflow-hidden rounded-[1.5rem] text-left">
                  <img
                    src={KIT_CONFIG.bespokeInteriors[3].image}
                    onError={(e) => handleSmartImageError(e, KIT_CONFIG.bespokeInteriors[3].fallback)}
                    alt="Oceanfront travertine spa"
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#041B32]/65 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-[10px] font-bold text-white">Oceanfront stone spa</span>
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="charter-request" className="scroll-mt-24 mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-28 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#287F9F]"><Compass size={14} /> Start with your itinerary</span>
              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">Where would you like to sail?</h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#65737B] sm:text-base">Select a signature Mediterranean passage below or customize your embarkation port and superyacht class.</p>

              {/* Signature Mediterranean Route Presets */}
              <div className="mt-6 space-y-2.5">
                {KIT_CONFIG.signatureRoutes.map((route) => {
                  const active = selectedRouteId === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => applySignatureRoute(route)}
                      className={`flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition ${
                        active
                          ? 'border-[#073B66] bg-[#073B66] text-white shadow-md'
                          : 'border-[#073B66]/10 bg-white text-[#073B66] hover:border-[#55B6CD]'
                      }`}
                    >
                      <div>
                        <span className={`block text-[8px] font-extrabold uppercase tracking-[0.16em] ${active ? 'text-[#55BBD1]' : 'text-[#287F9F]'}`}>
                          {route.distance} • {route.duration}
                        </span>
                        <span className="mt-0.5 block text-xs font-bold sm:text-sm">{route.title}</span>
                      </div>
                      <Waves size={16} className={active ? 'text-[#55BBD1]' : 'text-[#287F9F]'} />
                    </button>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <form onSubmit={(event) => { event.preventDefault(); setDemoSubmitted(true); }} className="rounded-[1.8rem] border border-[#073B66]/10 bg-white p-5 shadow-xl shadow-[#073B66]/5 sm:p-8">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div><p className="text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#287F9F]">Private yacht charter enquiry</p><h3 className="mt-1 text-lg font-semibold">Plan your charter</h3></div>
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF5F8] text-[#287F9F]"><Anchor size={18} /></span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-xl border border-[#073B66]/10 bg-[#F7FBFC] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><MapPin size={12} /> Embarkation marina</span>
                    <input type="text" value={departure} onChange={(event) => setDeparture(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="Port or marina" />
                  </label>
                  <label className="rounded-xl border border-[#073B66]/10 bg-[#F7FBFC] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><MapPin size={12} /> Destination marina</span>
                    <input type="text" value={destination} onChange={(event) => setDestination(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="Port or marina" />
                  </label>
                  <label className="rounded-xl border border-[#073B66]/10 bg-[#F7FBFC] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><Anchor size={12} /> Yacht style</span>
                    <select value={yachtType} onChange={(event) => setYachtType(event.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none">
                      <option>50m Mediterranean Motor Yacht</option>
                      <option>65m+ superyacht</option>
                      <option>75m+ Explorer Superyacht</option>
                      <option>Help me choose</option>
                    </select>
                  </label>
                  <label className="rounded-xl border border-[#073B66]/10 bg-[#F7FBFC] px-4 py-3">
                    <span className="flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#7C878D]"><Calendar size={12} /> Charter date</span>
                    <input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" />
                  </label>
                </div>
                <div className="mt-5 flex flex-col items-start justify-between gap-4 border-t border-[#073B66]/8 pt-5 sm:flex-row sm:items-center">
                  <p className="max-w-sm text-[11px] leading-5 text-[#7B858A]">
                    {demoSubmitted
                      ? 'Enquiry preview: ' + departure + ' to ' + destination + ' • ' + yachtType
                      : 'Share your preferred ports and yacht style to start a conversation.'}
                  </p>
                  <button type="submit" className="flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#073B66] px-6 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#0B5F91] sm:w-auto">
                    Request a charter plan <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 bg-[#EAF5F8]">
          <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-7 sm:py-24 lg:px-10">
            <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#287F9F]">Visual library • 150MP Ultra-Print</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] sm:text-5xl">A closer look at the yachting experience.</h2>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-[#65737B]">Explore V10 yacht salons, Calacatta dining suites, oceanfront stone spas and exterior profiles. Select any image to inspect in full resolution.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All scenes (9)', icon: Layers },
                  { id: 'interior', label: 'Salons & Suites', icon: Aperture },
                  { id: 'dining', label: 'Dining & Spa', icon: Sparkles },
                  { id: 'exterior', label: 'Yacht Exteriors', icon: Anchor }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = fleetFilter === tab.id;
                  return (
                    <button key={tab.id} type="button" onClick={() => setFleetFilter(tab.id)} className={'inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[9px] font-extrabold uppercase tracking-[0.12em] transition ' + (active ? 'border-[#073B66] bg-[#073B66] text-white' : 'border-[#073B66]/15 bg-white/70 text-[#52616A] hover:border-[#55B6CD]')}>
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
                    className="group overflow-hidden rounded-[1.4rem] border border-[#073B66]/8 bg-white shadow-sm transition-shadow hover:shadow-xl"
                  >
                    <button type="button" onClick={() => setZoomImage(item.image)} className="relative block aspect-[1.38] w-full cursor-zoom-in overflow-hidden bg-[#D5EAF0] text-left">
                      <img
                        src={optimizeWebP(item.image, 1200)}
                        onError={(e) => handleSmartImageError(e, item.fallback)}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#073B66] backdrop-blur">{item.tag}</span>
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#073B66]/85 text-white transition group-hover:bg-[#55B6CD]"><ArrowUpRight size={16} /></span>
                    </button>
                    <div className="p-5 sm:p-6">
                      <h3 className="text-base font-semibold tracking-tight sm:text-lg">{item.title}</h3>
                      <p className="mt-2 min-h-10 text-xs leading-5 text-[#758087]">{item.specs}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#073B66]/8 pt-4 text-[8px] font-extrabold uppercase tracking-[0.1em] text-[#287F9F]">
                        <span>{item.resolution}</span>
                        <button type="button" onClick={() => setZoomImage(item.image)} className="flex items-center gap-1 text-[#073B66] hover:text-[#287F9F]">Inspect <ArrowUpRight size={12} /></button>
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
            <span className="inline-flex items-center gap-2 rounded-full border border-[#55B6CD]/35 bg-[#E6F3F7] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#287F9F]"><Crown size={13} /> Turnkey yacht charter kit</span>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">A complete yacht charter brand, ready to set sail.</h2>
            <p className="mt-4 text-sm leading-7 text-[#65737B] sm:text-base">Launch faster with the React page, a luxury yacht visual library and commercial-ready assets built for charter agencies, brokers and operators.</p>
          </Reveal>

          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {[
              [FileCode, 'React + Tailwind source', 'A customizable JSX landing page with interactive yacht interiors, 4K motion showcase and smooth animations.'],
              [Aperture, '60 production image files', '20 original scenes supplied as WebP previews, 4K UHD campaign images and 150MP print masters.'],
              [FolderArchive, 'Three editable PSD mockups', 'Marina and waterfront advertising layouts with smart objects for client presentations.']
            ].map(([Icon, title, description], index) => (
              <Reveal key={title} delay={index * 0.07}>
                <div className="h-full rounded-[1.3rem] border border-[#073B66]/8 bg-white p-6 shadow-sm sm:p-7">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6F3F7] text-[#287F9F]"><Icon size={19} /></span>
                  <h3 className="mt-5 text-sm font-extrabold uppercase tracking-[0.06em]">{title}</h3>
                  <p className="mt-2 text-xs leading-6 text-[#6C787E]">{description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col justify-between rounded-[1.7rem] border border-[#073B66]/12 bg-white p-7 shadow-lg shadow-[#073B66]/5 sm:p-9">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#66747B]">Multi-client agency license</span>
                    <span className="rounded-full bg-[#E6F3F7] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#287F9F]">Instant ZIP</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold tracking-[-0.06em]">$349</p>
                  <p className="mt-3 text-xs leading-6 text-[#758087]">For agencies, developers and yacht charter teams building a polished digital presence.</p>
                  <ul className="mt-7 space-y-3 text-xs text-[#52616A]">
                    {[
                      'Complete Aqua Privé React + Tailwind JSX source',
                      '60 production files: 20 WebP, 20 4K UHD and 20 150MP masters',
                      'Three editable PSD advertising mockups',
                      'Commercial license for client websites, campaigns and print'
                    ].map((item) => <li key={item} className="flex items-start gap-2.5"><CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#4C9EB3]" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <button type="button" onClick={() => handlePurchaseTier('standard')} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#073B66] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-white transition hover:bg-[#0B5F91]">
                  <DownloadCloud size={15} className="text-[#55BBD1]" /> License agency kit — $349
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[1.7rem] bg-[#073B66] p-7 text-white shadow-2xl shadow-[#073B66]/20 sm:p-9">
                <div className="absolute -right-14 -top-20 h-60 w-60 rounded-full bg-[#55B6CD]/15 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#55BBD1]">1-of-1 exclusive buyout</span>
                    <span className="rounded-full bg-[#55BBD1] px-3 py-1.5 text-[8px] font-black uppercase tracking-[0.12em] text-[#073B66]">Single buyer</span>
                  </div>
                  <p className="mt-6 text-5xl font-semibold tracking-[-0.06em]">$1,490</p>
                  <p className="mt-3 text-xs leading-6 text-white/60">Exclusive ownership for a brand that wants its own private yacht visual world.</p>
                  <ul className="mt-7 space-y-3 text-xs text-white/80">
                    {[
                      'All 60 WebP, 4K UHD and 150MP files',
                      '10 custom 150MP renders in your brand palette',
                      'Luxury Yacht Prompt Engine ruleset for internal expansion',
                      'Signed enterprise IP transfer certificate'
                    ].map((item) => <li key={item} className="flex items-start gap-2.5"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#55BBD1]" /><span>{item}</span></li>)}
                  </ul>
                </div>
                <button type="button" onClick={() => handlePurchaseTier('buyout')} className="relative mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#55BBD1] px-5 py-4 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#073B66] transition hover:bg-[#98D8E6]">
                  <Lock size={14} /> Acquire exclusive rights — $1,490
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-7 text-center">
            <a href={KIT_CONFIG.freeSampleLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#287F9F] underline decoration-[#55B6CD]/50 underline-offset-4 transition hover:text-[#073B66]">
              Download the 150MP ICC spec sheet and sample <ArrowUpRight size={13} />
            </a>
          </Reveal>
        </section>

        <section className="border-y border-[#073B66]/8 bg-white/50">
          <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-14 sm:px-7 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-16">
            <Reveal>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#287F9F]">A few helpful details</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em]">Good to know.</h2>
            </Reveal>
            <div className="divide-y divide-[#073B66]/10">
              {FAQS.map((item, index) => (
                <div key={item.question} className="py-4">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-5 text-left">
                    <span className="text-sm font-bold">{item.question}</span>
                    <ChevronDown size={17} className={'shrink-0 text-[#287F9F] transition ' + (openFaq === index ? 'rotate-180' : '')} />
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
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-[#D3E8EF]">
            <div className="absolute inset-0">
              <img
                src={KIT_CONFIG.bespokeInteriors[1].image}
                onError={(e) => handleSmartImageError(e, KIT_CONFIG.bespokeInteriors[1].fallback)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover opacity-40 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#073B66]/95 via-[#073B66]/80 to-[#073B66]/20" />
            </div>
            <div className="relative max-w-3xl px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#B7E8F1]">Your next voyage starts here</span>
              <h2 className="mt-4 text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl">Let the horizon set the pace.</h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/70">Plan a private yacht charter or explore the complete yachting brand kit.</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => scrollTo('charter-request')} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#55BBD1] px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#073B66] transition hover:bg-[#98D8E6]">Plan your charter <ArrowRight size={14} /></button>
                <button type="button" onClick={() => scrollTo('licensing')} className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-white/10 px-6 py-4 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-white/20">View the kit <ArrowUpRight size={14} /></button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-[#073B66]/10 px-4 py-8 sm:px-7 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#073B66] text-[#55BBD1]"><Anchor size={15} /></span>
            <span><span className="block text-xs font-black uppercase tracking-[0.2em]">Aqua Privé</span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.15em] text-[#879197]">Private Yacht Charter</span></span>
          </div>
          <p className="text-[10px] text-[#7B858A]">Designed for considered journeys, wherever the world takes you.</p>
          <button type="button" onClick={() => navigate('/stock')} className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#52616A] transition hover:text-[#287F9F]">Back to stock vaults <ArrowRight size={12} className="ml-1 inline" /></button>
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

      {/* Plivajuća Prev / Next Yacht Page navigacija na dnu ekrana (Stranica 1 od 5) */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.prevLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#073B66] shadow-xl border border-[#073B66]/15 backdrop-blur-md transition hover:bg-[#073B66] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DDECF1] text-[#073B66] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{KIT_CONFIG.prevLandingLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(KIT_CONFIG.nextLandingRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#073B66] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/40 border border-[#55BBD1]/40 transition hover:bg-[#0B5F91] hover:scale-105 cursor-pointer"
        >
          <span>{KIT_CONFIG.nextLandingLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#55BBD1] text-[#073B66] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};
// END OF FUNCTION: AquaYachtCharterKit

export default AquaYachtCharterKit;