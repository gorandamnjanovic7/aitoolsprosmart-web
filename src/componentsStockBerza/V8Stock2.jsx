// ============================================================================
// POČETAK FAJLA: src/componentsStockBerza/V8Stock2.jsx (10 CAMERA METADATA GROUPS + PRIVATE VAULT + DUAL LICENSE)
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import {
  Zap, X, UploadCloud, DownloadCloud, Crown, AlertCircle,
  Type, Hash, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon,
  Diamond, RefreshCcw, Aperture, ShieldCheck, Edit, Trash2, Sparkles,
  Compass, Utensils, Car, Mail, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  Cpu, Home, Sun, Snowflake, Gem, Flame, Lock, ArrowLeft
} from 'lucide-react';
import { db, auth } from '../firebase';
import {
  collection, addDoc, deleteDoc, deleteField, doc, updateDoc, serverTimestamp,
  query, getDoc, setDoc, where, onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';
import { trackV8Action } from '../utils/analytics';

// Zasebna Firebase kolekcija kako se paketi ne bi gomilali u glavnoj V8StockBerza (/stock)
const STOCK2_COLLECTION = 'v8_stock2_paketi';

const toFastWebp = (url, width = 800) => {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  if (url.includes('/upload/f_webp')) return url;
  return url.replace('/upload/', `/upload/f_webp,q_auto:good,w_${width}/`);
};

class V8ErrorGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 [V8 ŠTIT UHVATIO GREŠKU EKSTENZIJE]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 text-center z-[999999] relative text-[#EAE6DF]">
          <AlertCircle size={56} className="text-[#C5A059] mb-6" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-4">Sistemska Blokada</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
            Vaš preglednik ili aktivno proširenje blokira učitavanje modula. Pauzirajte ad-blocker ili osvježite stranicu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg mx-auto cursor-pointer"
          >
            <RefreshCcw size={18} /> Osvježi Sustav
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const FullScreenLightbox = ({ images = [], currentIndex = 0, title = '', onClose, onSelectIndex }) => {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const total = images.length;
  const safeIndex = total > 0 ? ((currentIndex % total) + total) % total : 0;
  const currentUrl = total > 0 ? images[safeIndex] : null;

  useEffect(() => {
    setHighResLoaded(false);
  }, [currentUrl]);

  useEffect(() => {
    if (currentUrl) {
      document.body.style.overflow = 'hidden';
      trackV8Action('image_zoom', { event_category: 'Engagement_Vault2', slide_index: safeIndex + 1 });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [currentUrl, safeIndex]);

  useEffect(() => {
    if (total <= 1) return;
    const nextUrl = images[(safeIndex + 1) % total];
    const prevUrl = images[(safeIndex - 1 + total) % total];
    [nextUrl, prevUrl].forEach((u) => {
      if (u) {
        const pre = new window.Image();
        pre.src = toFastWebp(u, 2400);
      }
    });
  }, [images, safeIndex, total]);

  useEffect(() => {
    if (!currentUrl) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight' && total > 1) {
        e.preventDefault();
        onSelectIndex((safeIndex + 1) % total);
      } else if (e.key === 'ArrowLeft' && total > 1) {
        e.preventDefault();
        onSelectIndex((safeIndex - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentUrl, total, safeIndex, onClose, onSelectIndex]);

  if (!currentUrl) return null;

  const goPrev = (e) => {
    e.stopPropagation();
    if (total > 1) onSelectIndex((safeIndex - 1 + total) % total);
  };

  const goNext = (e) => {
    e.stopPropagation();
    if (total > 1) onSelectIndex((safeIndex + 1) % total);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-[#06080C]/95 backdrop-blur-xl flex flex-col items-center justify-center p-3 sm:p-6 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl flex items-center justify-between gap-4 mb-3 z-[1000000] px-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="bg-[#C5A059] text-[#0B0E14] text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
            {safeIndex + 1} / {total}
          </span>
          {title && (
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#F3E5AB] truncate max-w-[220px] sm:max-w-lg">
              {title}
            </span>
          )}
          <span className="hidden md:inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-2">
            Use ← / → keys or arrows to browse
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] p-3 rounded-full font-black transition-all hover:scale-105 cursor-pointer shadow-2xl"
          title="Close (Esc)"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div className="relative w-full max-w-6xl flex-1 flex items-center justify-center min-h-0">
        {total > 1 && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-1 sm:left-3 z-[1000000] bg-[#0B0E14]/90 hover:bg-[#C5A059] text-[#F3E5AB] hover:text-[#0B0E14] border-2 border-[#C5A059]/70 p-3 sm:p-4 rounded-full transition-all hover:scale-110 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            <ChevronLeft size={28} strokeWidth={2.5} />
          </button>
        )}

        <div
          className="relative flex items-center justify-center max-w-full max-h-[76vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {!highResLoaded && (
            <img
              src={toFastWebp(currentUrl, 320)}
              alt={`Preview ${safeIndex + 1}`}
              className="max-w-full max-h-[76vh] object-contain rounded-2xl border border-[#C5A059]/40 blur-[2px] opacity-90"
            />
          )}
          <img
            key={currentUrl}
            src={toFastWebp(currentUrl, 2400)}
            onLoad={() => setHighResLoaded(true)}
            alt={`150MP Full Screen Inspection ${safeIndex + 1}`}
            className={`max-w-full max-h-[76vh] object-contain rounded-2xl shadow-2xl border border-[#C5A059]/40 transition-opacity duration-200 ${
              highResLoaded ? 'opacity-100 relative' : 'opacity-0 absolute inset-0 m-auto'
            }`}
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-1 sm:right-3 z-[1000000] bg-[#0B0E14]/90 hover:bg-[#C5A059] text-[#F3E5AB] hover:text-[#0B0E14] border-2 border-[#C5A059]/70 p-3 sm:p-4 rounded-full transition-all hover:scale-110 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
          >
            <ChevronRight size={28} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {total > 1 && (
        <div
          className="w-full max-w-5xl mt-3 pt-2 z-[1000000] overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-start sm:justify-center gap-2 px-2 pb-1">
            {images.map((thumbUrl, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectIndex(idx)}
                  className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#F3E5AB] ring-2 ring-[#C5A059] scale-105 opacity-100'
                      : 'border-white/15 opacity-55 hover:opacity-100 hover:border-[#C5A059]/70'
                  }`}
                >
                  <img
                    src={toFastWebp(thumbUrl, 320)}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0.5 text-[8px] font-black text-[#F3E5AB] bg-black/80 px-1 rounded">
                    #{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

// ============================================================================
// TOČNIH 10 GRUPA IZ TVOG METADATA SUSTAVA + POSTOJEĆI MYSTIC/ANCIENT ARHIV
// ============================================================================
const VAULT2_TABS = [
  {
    id: 'all',
    label: 'ALL VAULTS II',
    shortLabel: 'ALL VAULTS II',
    formatCode: 'G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)',
    icon: Layers,
    headline: 'OPTICAL CAMERA ARCHIVE II — 150MP + 4K + WEBP',
    subheadline: '10 CURATED COMMERCIAL PHOTOGRAPHY & CINEMA DIVISIONS ENGINEERED WITH AUTHENTIC OPTICAL PHYSICS. TRIPLE DELIVERY IN EVERY ZIP: 150MP MASTER PRINT JPG + 4K UHD JPG + WEB-READY WEBP.'
  },
  {
    id: 'g1_products',
    label: '1. PRODUCTS & LUXURY LIGHTING',
    shortLabel: 'PRODUCTS & STUDIO',
    formatCode: 'G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)',
    icon: Diamond,
    headline: 'COMMERCIAL PRODUCT PHOTOGRAPHY & LUXURY STUDIO LIGHTING',
    subheadline: 'UNBRANDED GLASS PERFUMES, METAL TIMEPIECES, MACRO JEWELRY, LEATHER HANDBAGS, COSMETICS, DARK-SLATE TECH HARDWARE, CONDENSATION BOTTLES & BESPOKE PACKAGING.'
  },
  {
    id: 'g2_food_drink',
    label: '2. FOOD & BEVERAGE',
    shortLabel: 'FOOD & BEVERAGE',
    formatCode: 'G02 FOOD & BEVERAGE OPTICS (20x 150MP + 4K + WEBP)',
    icon: Utensils,
    headline: 'CULINARY PLATING, HIGH-SPEED SPLASHES & ARTISANAL DRINKS',
    subheadline: '45° GOURMET PLATING, LAYERED BURGERS, OVERHEAD FLAT-LAYS, STEAMING ESPRESSO, SCULPTED ICE COCKTAILS, GLAZED CHOCOLATE DESSERTS, ARTISAN BREAD & FROZEN LIQUID SPLASHES.'
  },
  {
    id: 'g3_portraits_beauty',
    label: '3. PORTRAITS & BEAUTY',
    shortLabel: 'PORTRAITS & BEAUTY',
    formatCode: 'G03 PORTRAITS & BEAUTY STUDIO (20x 150MP + 4K + WEBP)',
    icon: Sparkles,
    headline: 'EDITORIAL PORTRAITURE & UNRETOUCHED BEAUTY CLOSE-UPS',
    subheadline: 'PURE TEXTLESS NATURAL & CORPORATE STUDIO PORTRAITS, WINDOW-LIGHT INTIMACY, STRICT PROFILES, AUTHENTIC SKIN-PORE BEAUTY MACROS, DRAMATIC LOW-KEY & BRIGHT HIGH-KEY STUDIES.'
  },
  {
    id: 'g4_fashion_lifestyle',
    label: '4. FASHION & LIFESTYLE',
    shortLabel: 'FASHION & LIFESTYLE',
    formatCode: 'G04 FASHION & LIFESTYLE EDITORIAL (20x 150MP + 4K + WEBP)',
    icon: Crown,
    headline: 'FULL-LENGTH STUDIO FASHION, STREET MOTION & LIFESTYLE',
    subheadline: 'CLEAN UNBRANDED EDITORIAL SILHOUETTES, FLOWING COUTURE FABRICS IN MOTION, SUNLIT LIFESTYLE PORTRAITS, EVENING CITY FASHION, ACCESSORY FOCUS & INTERIOR LIFESTYLE SCENES.'
  },
  {
    id: 'g5_architecture_interiors',
    label: '5. ARCHITECTURE, INTERIORS & REAL ESTATE',
    shortLabel: 'ARCHITECTURE & SPACES',
    formatCode: 'G05 ARCHITECTURE & INTERIORS (20x 150MP + 4K + WEBP)',
    icon: Home,
    headline: 'TILT-SHIFT ARCHITECTURE, LUXURY INTERIORS & REAL ESTATE',
    subheadline: 'RECTILINEAR CONTEMPORARY FACADES AT DUSK, LUXURY LIVING SUITES, HOTEL LOBBIES, MINIMALIST KITCHENS, SPA BATHROOMS, EXECUTIVE OFFICES & MONUMENTAL STAIRCASE GEOMETRY.'
  },
  {
    id: 'g6_landscapes_travel',
    label: '6. LANDSCAPES & TRAVEL',
    shortLabel: 'LANDSCAPES & TRAVEL',
    formatCode: 'G06 LANDSCAPES & TRAVEL (20x 150MP + 4K + WEBP)',
    icon: Compass,
    headline: 'EPIC MOUNTAIN VISTAS, MISTY VALLEYS & COASTAL HORIZONS',
    subheadline: 'FOCUS-STACKED ALPINE PEAKS, GOLDEN-HOUR VALLEYS, LONG-EXPOSURE WATERFALLS, DESERT DUNES, FOGGY FORESTS, MIRROR-STILL LAKES & DRAMATIC SEA CLIFFS.'
  },
  {
    id: 'g7_macro_textures',
    label: '7. MACRO, TEXTURES & MATERIALS',
    shortLabel: 'MACRO & TEXTURES',
    formatCode: 'G07 MACRO TEXTURES & MATERIALS (20x 150MP + 4K + WEBP)',
    icon: Gem,
    headline: '1:1 EXTREME MACRO, SURFACE TEXTURES & TACTILE MATERIALS',
    subheadline: 'LEAF DEWDROPS, RAW MINERAL STONE, ANISOTROPIC BRUSHED METAL, TIMBER RINGS, WOVEN TEXTILE FIBERS, TRANSLUCENT CRYSTALS, EXPOSED WATCH GEARS & GLASS REFRACTION.'
  },
  {
    id: 'g8_action_sport_auto',
    label: '8. ACTION, SPORT & AUTOMOTIVE',
    shortLabel: 'ACTION, SPORT & AUTO',
    formatCode: 'G08 ACTION SPORT & AUTOMOTIVE (20x 150MP + 4K + WEBP)',
    icon: Car,
    headline: 'HIGH-SPEED SPORTS ACTION, PANNING MOTION & SUPERCAR CAMPAIGNS',
    subheadline: '100% BADGE-FREE TRACKING PANNING AUTOMOBILES, TWILIGHT SUPERCARS, LEANING MOTORCYCLES, ATHLETES IN MOTION, FROZEN WATER BURSTS, NIGHT RUNNERS & OFF-ROAD DUST.'
  },
  {
    id: 'g9_night_lowlight',
    label: '9. NIGHT, LOW LIGHT & LONG EXPOSURE',
    shortLabel: 'NIGHT & LOW LIGHT',
    formatCode: 'G09 NIGHT & LONG EXPOSURE (20x 150MP + 4K + WEBP)',
    icon: Snowflake,
    headline: 'NOCTURNAL RAIN STREETS, LIGHT TRAILS & BLUE-HOUR CITIES',
    subheadline: 'RAIN-SLICKED URBAN ASPHALT REFLECTIONS, TRAFFIC LIGHT STREAKS, MILKY WAY ASTRO-LANDSCAPES, NEON PORTRAITS, STARLIT CAMPFIRES & ILLUMINATED NIGHT BRIDGES.'
  },
  {
    id: 'g10_cinema_frames',
    label: '10. CINEMA FRAMES & STORYTELLING',
    shortLabel: 'CINEMA & STORYTELLING',
    formatCode: 'G10 CINEMA & STORYTELLING (20x 150MP + 4K + WEBP)',
    icon: Flame,
    headline: 'ANAMORPHIC & LARGE-FORMAT CINEMA FRAMES IN MOTION',
    subheadline: 'TRUE 180-DEGREE SHUTTER CINEMA AESTHETICS: ANAMORPHIC NIGHT SCENES, WIDE MASTER ESTABLISHING SHOTS, THRILLER INTERIORS, WARM 35MM NOSTALGIA, SILHOUETTES & SCI-FI CORRIDORS.'
  },
  {
    id: 'legacy_mystic_ancient',
    label: 'MYSTIC & ANCIENT ARCHIVE',
    shortLabel: 'MYSTIC & ANCIENT',
    formatCode: '150MP ULTRA MYSTIC BUNDLE',
    icon: Cpu,
    headline: 'V10 150MP FANTASY REALMS & ANCIENT CIVILIZATIONS',
    subheadline: 'MONUMENTAL MULTI-RATIO 150MP PRODUCTION ARCHIVES FOR FANTASY WORLD-BUILDING, HISTORICAL RECONSTRUCTION & KEY ART.'
  }
];

const buildVault2Description = (formatCode, isAgency45 = false) => {
  const count = isAgency45 ? 45 : 20;
  const totalFiles = count * 3;
  const code = (formatCode || '').toUpperCase();

  const groupMap = {
    G01: {
      title: 'COMMERCIAL PRODUCTS & LUXURY STUDIO LIGHTING',
      bullets: 'Catalog three-quarter studio shots, backlit crystal perfume flacons, reflection-controlled metal watches, focus-stacked macro jewelry, grazed-leather handbags, matte-black tech devices & condensation bottles.'
    },
    G02: {
      title: 'GOURMET FOOD, ESPRESSO & HIGH-SPEED BEVERAGES',
      bullets: '45° natural-side-lit warm dishes, crisp layered burgers, overhead culinary flat-lays, backlit espresso steam, crystal ice cocktails, glazed chocolate textures & 1/4000s frozen liquid splashes.'
    },
    G03: {
      title: 'EDITORIAL PORTRAITURE & AUTHENTIC SKIN BEAUTY',
      bullets: 'Pure textless natural & corporate studio portraits, diffused window-light studies, rim-lit profiles, 100mm macro unretouched skin-pore beauty frames, dramatic low-key & golden-hour backlit portraits.'
    },
    G04: {
      title: 'STUDIO FASHION, STREET MOTION & LIFESTYLE',
      bullets: 'Full-length studio silhouettes, candid street fashion in motion, flowing textile dynamics, evening city editorials, macro luxury accessories & sunlit interior lifestyle moments.'
    },
    G05: {
      title: 'TILT-SHIFT ARCHITECTURE, LUXURY INTERIORS & REAL ESTATE',
      bullets: 'Rectilinear 24mm tilt-shift facades, twilight exterior-interior balance, designer living rooms, luxury hotel lobbies, minimalist marble kitchens, spa bathrooms & executive workspaces.'
    },
    G06: {
      title: 'LANDSCAPES, MISTY VALLEYS & TRAVEL EXPEDITIONS',
      bullets: 'Focus-stacked mountain ranges, misty layered valleys, golden-hour landscapes, silky long-exposure waterfalls, desert dune shadows, mirror-reflection alpine lakes & dramatic coastal cliffs.'
    },
    G07: {
      title: '1:1 EXTREME MACRO, SURFACE TEXTURES & MATERIALS',
      bullets: '100mm 1:1 macro water droplets, raw stone micro-relief, anisotropic brushed metal, timber grain, textile weave fibers, backlit mineral crystals, exposed mechanical watch gears & glass caustics.'
    },
    G08: {
      title: 'HIGH-SPEED SPORTS ACTION & UNBRANDED AUTOMOTIVE',
      bullets: '100% badge-free tracking panning vehicles, polarised twilight supercars, leaning motorcycles, frozen 1/3200s athletic motion, water-burst sports action & off-road dust trails.'
    },
    G09: {
      title: 'NIGHT URBANISM, LOW LIGHT & LONG EXPOSURES',
      bullets: 'Wet nocturnal street reflections, tripod vehicle light trails, clean astrophotography skies, controlled neon portraits, blue-hour skylines, backlit rain & illuminated night bridges.'
    },
    G10: {
      title: 'LARGE-FORMAT & ANAMORPHIC CINEMA FRAMES',
      bullets: 'Authentic cinema-prime depth & 180-degree shutter aesthetics: anamorphic nocturnal frames, wide master spaces, moody thriller interiors, warm 35mm film grain, backlit mist silhouettes & sci-fi corridors.'
    }
  };

  const prefix = code.slice(0, 3);
  if (groupMap[prefix]) {
    return `V10 ${groupMap[prefix].title} DELIVERY: ${count} UNIQUE SCENES (${totalFiles} PRODUCTION FILES: ${count}x 150MP MASTER PRINT JPG + ${count}x 4K UHD JPG + ${count}x WEB-READY WEBP).
- ${groupMap[prefix].bullets}
- 100% IP-Safe, Unbranded & Textless Commercial Assets (Zero logos, zero trademarks, zero watermarks).
- Processed through the V10 150MP Master Engine (LANCZOS interpolation, UnsharpMask micro-contrast, embedded sRGB ICC profile, and stripped EXIF metadata).`;
  }

  return `V10 150MP MASTER ARCHIVE DELIVERY: MULTI-RATIO 150MP ULTRA PRINT + 4K UHD + WEBP PRODUCTION COLLECTION.
- Processed through the V10 Master Engine utilizing precision LANCZOS interpolation, highlight rolloff protection, organic anti-plastic grain, embedded sRGB ICC profile, and 100% IP-safe metadata cleanup.`;
};

const detectVault2Industry = (paket) => {
  const fmt = (paket.format || '').toUpperCase();
  const text = `${paket.format || ''} ${paket.kategorijaEn || ''} ${paket.nazivEn || ''} ${paket.opisEn || ''}`.toUpperCase();

  if (fmt.startsWith('G01') || text.includes('PERFUME') || text.includes('PACKAGING') || text.includes('PRODUCT')) return 'g1_products';
  if (fmt.startsWith('G02') || text.includes('FOOD') || text.includes('BEVERAGE') || text.includes('BURGER') || text.includes('COCKTAIL') || text.includes('ESPRESSO')) return 'g2_food_drink';
  if (fmt.startsWith('G03') || text.includes('PORTRAIT') || text.includes('BEAUTY')) return 'g3_portraits_beauty';
  if (fmt.startsWith('G04') || text.includes('FASHION') || text.includes('LIFESTYLE') || text.includes('STREET')) return 'g4_fashion_lifestyle';
  if (fmt.startsWith('G05') || text.includes('ARCHITECT') || text.includes('INTERIOR') || text.includes('REAL ESTATE') || text.includes('LOBBY') || text.includes('KITCHEN')) return 'g5_architecture_interiors';
  if (fmt.startsWith('G06') || text.includes('LANDSCAPE') || text.includes('TRAVEL') || text.includes('MOUNTAIN') || text.includes('DUNE') || text.includes('COAST')) return 'g6_landscapes_travel';
  if (fmt.startsWith('G07') || text.includes('MACRO') || text.includes('TEXTURE') || text.includes('CRYSTAL') || text.includes('MATERIAL')) return 'g7_macro_textures';
  if (fmt.startsWith('G08') || text.includes('SPORT') || text.includes('ACTION') || text.includes('SUPERCAR') || text.includes('MOTORCYCLE') || text.includes('PANNING')) return 'g8_action_sport_auto';
  if (fmt.startsWith('G09') || text.includes('NIGHT') || text.includes('LOW LIGHT') || text.includes('NEON') || text.includes('MILKY WAY') || text.includes('LONG EXPOSURE')) return 'g9_night_lowlight';
  if (fmt.startsWith('G10') || text.includes('CINEMA') || text.includes('ANAMORPHIC') || text.includes('STORYTELLING') || text.includes('SCI-FI')) return 'g10_cinema_frames';
  if (fmt.includes('MYSTIC') || fmt.includes('ANCIENT') || text.includes('MYSTIC') || text.includes('ANCIENT')) return 'legacy_mystic_ancient';
  return 'g10_cinema_frames';
};

const isLegacyMysticOrAncient = (paket) => {
  const fmt = (paket.format || '').toUpperCase();
  return (
    fmt.includes('150MP ULTRA MYSTIC') ||
    fmt.includes('150MP ULTRA 2') ||
    fmt.includes('150MP ANCIENT')
  );
};

const getPaketPreviewSlotCount = (paket) => {
  if (paket?.previewSlotCount === 20) return 20;
  if ((paket?.primeri?.length || 0) > 10) return 20;
  const priceNum = parseFloat(paket?.cena || '0');
  const volText = `${paket?.volume || ''} ${paket?.nazivEn || ''} ${paket?.volTitle || ''}`.toUpperCase();
  if (priceNum >= 349 || volText.includes('45X') || volText.includes('AGENCY BUNDLE') || volText.includes('MASTER PACK')) {
    return 20;
  }
  return 10;
};

const computeDefaultEnterprisePrice = (standardCena) => {
  const base = parseFloat(standardCena);
  if (isNaN(base) || base <= 0) return '0.00';
  if (Math.round(base) === 149) return '299.00';
  if (Math.round(base) === 399) return '690.00';
  if (Math.round(base) === 499) return '890.00';
  if (Math.round(base) === 99) return '199.00';
  return Math.round(base * 1.95).toFixed(2);
};

const resolveStockLicenseMeta = (licenseTier = 'standard') => {
  const isEnt = licenseTier === 'enterprise';
  const licenseTitle = isEnt ? 'GLOBAL ENTERPRISE LICENSE' : 'STANDARD COMMERCIAL LICENSE';
  const licensePdf = isEnt ? '/PREMIUM ENTERPRISE LICENSE.pdf' : '/V8_COMMERCIAL_LICENSE.pdf';
  return { isEnt, licenseTitle, licensePdf };
};

const V8Stock2Base = () => {
  const navigate = useNavigate();
  const [vault2Paketi, setVault2Paketi] = useState([]);
  const [legacyPaketi, setLegacyPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isMigratingLinks, setIsMigratingLinks] = useState(false);

  const [selectedLicenses, setSelectedLicenses] = useState({});

  const [checkoutData, setCheckoutData] = useState({
    isOpen: false,
    paketId: null,
    name: '',
    price: 0,
    licenseTier: 'standard',
    previewUrl: ''
  });
  const [loginRequiredData, setLoginRequiredData] = useState({
    isOpen: false,
    paket: null,
    licenseTier: 'standard',
    name: '',
    price: 0,
    customPriceOverride: null
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]);
  const [editingPaketId, setEditingPaketId] = useState(null);
  const [editingSourceCol, setEditingSourceCol] = useState(STOCK2_COLLECTION);

  const [lightboxState, setLightboxState] = useState({
    isOpen: false,
    images: [],
    currentIndex: 0,
    title: ''
  });

  const openGalleryLightbox = (imagesArray, startIndex = 0, title = '') => {
    const validImages = (imagesArray || []).filter(Boolean);
    if (validImages.length === 0) return;
    const safeIdx = Math.max(0, Math.min(startIndex, validImages.length - 1));
    setLightboxState({
      isOpen: true,
      images: validImages,
      currentIndex: safeIdx,
      title
    });
  };

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('v10_vault2_10groups_tab');
    return VAULT2_TABS.some(t => t.id === saved) ? saved : 'all';
  });

  useEffect(() => {
    localStorage.setItem('v10_vault2_10groups_tab', activeTab);
    trackV8Action('tab_view', { event_category: 'Luxury_Store_Vault2', event_label: activeTab });
  }, [activeTab]);

  const [sampleEmail, setSampleEmail] = useState('');
  const [sampleUnlocked, setSampleUnlocked] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [customSampleUrl, setCustomSampleUrl] = useState('');
  const [adminSampleInput, setAdminSampleInput] = useState('');

  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  const [kupljeneLicencePoPaketu, setKupljeneLicencePoPaketu] = useState({});
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  const [paketTier, setPaketTier] = useState('standard');
  const [adminSlotLimit, setAdminSlotLimit] = useState(10);
  const [noviVolNaslov, setNoviVolNaslov] = useState('VOL. 01');
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('20x 150MP + 20x 4K + 20x WEBP');
  const [noviFormat, setNoviFormat] = useState('G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('149.00');
  const [novaEnterpriseCena, setNovaEnterpriseCena] = useState('299.00');
  const [noviTip] = useState('Image');
  const [noviOpisEn, setNoviOpisEn] = useState(() => buildVault2Description('G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)', false));
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [isFree, setIsFree] = useState(false);

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.email === 'damnjanovicgoran7@gmail.com' || user.email === 'aitoolsprosmart@gmail.com');
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setKupljeniPaketiIds([]);
        setKupljeneLicencePoPaketu({});
      }
    });

    const sortByDateDesc = (arr) => {
      const getMs = (dateObj) => {
        if (!dateObj) return 0;
        if (dateObj.toMillis) return dateObj.toMillis();
        if (dateObj.seconds) return dateObj.seconds * 1000;
        return new Date(dateObj).getTime() || 0;
      };
      return [...arr].sort((a, b) => (getMs(b.createdAt) || getMs(b.updatedAt)) - (getMs(a.createdAt) || getMs(a.updatedAt)));
    };

    const qVault2 = query(collection(db, STOCK2_COLLECTION));
    const unsubVault2 = onSnapshot(qVault2, (snap) => {
      const ucitani = snap.docs.map(d => ({ id: d.id, _sourceCol: STOCK2_COLLECTION, ...d.data() }));
      setVault2Paketi(sortByDateDesc(ucitani));
    }, (error) => {
      console.error('🚨 [V8 VAULT II] Firestore onSnapshot Error:', error);
    });

    const qLegacy = query(collection(db, 'v8_stock_paketi'));
    const unsubLegacy = onSnapshot(qLegacy, (snap) => {
      const stari = snap.docs
        .map(d => ({ id: d.id, _sourceCol: 'v8_stock_paketi', ...d.data() }))
        .filter(isLegacyMysticOrAncient);
      setLegacyPaketi(sortByDateDesc(stari));
    }, () => {});

    getDoc(doc(db, 'v8_settings', 'free_sample_config')).then((snap) => {
      if (snap.exists() && snap.data().sampleZipUrl) {
        setCustomSampleUrl(snap.data().sampleZipUrl);
        setAdminSampleInput(snap.data().sampleZipUrl);
      }
    }).catch(() => {});

    return () => {
      unsubAuth();
      unsubVault2();
      unsubLegacy();
    };
  }, []);

  const paketi = [...vault2Paketi, ...legacyPaketi.filter(lp => !vault2Paketi.some(vp => vp.id === lp.id))];

  useEffect(() => {
    if (!currentUser) {
      setPaidPayoneer([]);
      setPaidCrypto([]);
      setPaidPaypal([]);
      return;
    }

    const extractPaidItems = (snap) => {
      const list = [];
      snap.forEach(d => {
        const data = d.data();
        if (data.paketId && data.isPaid === true) {
          const tier = /ENTERPRISE/i.test(String(data.licenseType || data.productName || data.zeliPaket || '')) ? 'enterprise' : 'standard';
          list.push({ paketId: data.paketId, tier });
        }
      });
      return list;
    };

    const qPayoneer = query(collection(db, 'v8_payoneer_requests'), where('uid', '==', currentUser.uid), where('isPaid', '==', true));
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => setPaidPayoneer(extractPaidItems(snap)));

    const qCrypto = query(collection(db, 'v8_crypto_requests'), where('uid', '==', currentUser.uid), where('isPaid', '==', true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => setPaidCrypto(extractPaidItems(snap)));

    const qPaypal = query(collection(db, 'v8_paypal_requests'), where('uid', '==', currentUser.uid), where('isPaid', '==', true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => setPaidPaypal(extractPaidItems(snap)));

    return () => {
      unsubPayoneer();
      unsubCrypto();
      unsubPaypal();
    };
  }, [currentUser]);

  useEffect(() => {
    const merged = [...paidPayoneer, ...paidCrypto, ...paidPaypal];
    const ids = Array.from(new Set(merged.map(x => x.paketId)));
    const licMap = {};
    merged.forEach(x => {
      if (!licMap[x.paketId]) {
        licMap[x.paketId] = { standard: false, enterprise: false };
      }
      if (x.tier === 'enterprise') {
        licMap[x.paketId].enterprise = true;
        licMap[x.paketId].standard = true;
      } else {
        licMap[x.paketId].standard = true;
      }
    });
    setKupljeniPaketiIds(ids);
    setKupljeneLicencePoPaketu(licMap);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  useEffect(() => {
    if (editingPaketId) return;
    const foundTab = VAULT2_TABS.find(t => t.id === activeTab);
    if (foundTab && activeTab !== 'all') {
      const isAgency45 = paketTier === 'master';
      setNoviFormat(foundTab.formatCode);
      setNoviVolume(isAgency45 ? '45x 150MP + 45x 4K + 45x WEBP' : '20x 150MP + 20x 4K + 20x WEBP');
      setNoviOpisEn(buildVault2Description(foundTab.formatCode, isAgency45));
    }
  }, [activeTab, editingPaketId, paketTier]);

  const dohvatiSiguranZipLink = async (paket) => {
    if (!paket) return null;
    try {
      const vaultSnap = await getDoc(doc(db, 'v8_stock_vault_links', paket.id));
      if (vaultSnap.exists() && vaultSnap.data().zipLink) {
        return vaultSnap.data().zipLink;
      }
    } catch (err) {
      console.error('Greška pri čitanju iz sefa:', err);
    }
    return paket.zipLink || null;
  };

  const otvoriSiguranDownload = async (paket) => {
    const url = await dohvatiSiguranZipLink(paket);
    if (url) {
      window.open(url, '_blank');
    } else {
      v8Toast.error('Download link nije pronađen u sefu!');
    }
  };

  const nezasticeniPaketi = paketi.filter(p => p.zipLink && String(p.zipLink).trim() !== '');

  const migrirajJavneLinkoveUSef = async () => {
    if (nezasticeniPaketi.length === 0) return;
    setIsMigratingLinks(true);
    try {
      for (const p of nezasticeniPaketi) {
        const colName = p._sourceCol || STOCK2_COLLECTION;
        await setDoc(doc(db, 'v8_stock_vault_links', p.id), {
          zipLink: p.zipLink.trim(),
          paketId: p.id,
          nazivEn: p.nazivEn || '',
          migratedAt: serverTimestamp()
        }, { merge: true });

        await updateDoc(doc(db, colName, p.id), {
          zipLink: deleteField()
        });
      }
      v8Toast.success(`🔒 Zaštićeno ${nezasticeniPaketi.length} paketa u tajni sef!`);
    } catch (err) {
      alert('Greška pri migraciji u sef: ' + err.message);
    } finally {
      setIsMigratingLinks(false);
    }
  };

  const handleSelectTierPreset = (tier) => {
    setPaketTier(tier);
    setIsFree(false);
    if (tier === 'master') {
      setNovaCena('499.00');
      setNovaEnterpriseCena('890.00');
      setAdminSlotLimit(20);
      setNoviVolNaslov('AGENCY BUNDLE');
      setNoviVolume('45x 150MP + 45x 4K + 45x WEBP');
      setNoviOpisEn(buildVault2Description(noviFormat, true));
    } else if (tier === 'bundle399') {
      setNovaCena('399.00');
      setNovaEnterpriseCena('690.00');
      setAdminSlotLimit(20);
      setNoviVolNaslov('MASTER PACK');
      setNoviVolume('20x 150MP + 20x 4K + 20x WEBP');
      setNoviOpisEn(buildVault2Description(noviFormat, false));
    } else {
      setNovaCena('149.00');
      setNovaEnterpriseCena('299.00');
      setAdminSlotLimit(10);
      if (noviVolNaslov === 'AGENCY BUNDLE' || noviVolNaslov === 'MASTER PACK') setNoviVolNaslov('VOL. 01');
      setNoviVolume('20x 150MP + 20x 4K + 20x WEBP');
      setNoviOpisEn(buildVault2Description(noviFormat, false));
    }
  };

  const handleFormatRadioChange = (fmt) => {
    setNoviFormat(fmt);
    if (!editingPaketId) {
      const isAgency45 = paketTier === 'master';
      setNoviVolume(isAgency45 ? '45x 150MP + 45x 4K + 45x WEBP' : '20x 150MP + 20x 4K + 20x WEBP');
      setNoviOpisEn(buildVault2Description(fmt, isAgency45));
    }
  };

  const getStandardCena = (paket) => {
    const numCena = parseFloat(paket?.cena);
    return isNaN(numCena) ? '0.00' : numCena.toFixed(2);
  };

  const getEnterpriseCena = (paket) => {
    if (paket?.isFree || parseFloat(paket?.cena) === 0) return '0.00';
    const explicitEnt = parseFloat(paket?.cenaEnterprise);
    if (!isNaN(explicitEnt) && explicitEnt > 0) return explicitEnt.toFixed(2);
    return computeDefaultEnterprisePrice(paket?.cena);
  };

  const getActiveCardLicense = (paketId) => selectedLicenses[paketId] || 'standard';

  const setCardLicense = (paketId, tier) => {
    setSelectedLicenses(prev => ({ ...prev, [paketId]: tier }));
    trackV8Action('license_tier_switched', { paketId, license_tier: tier });
  };

  const formatPaketDisplayTitle = (paket) => {
    const baseTitle = paket.nazivEn || 'Optical Campaign Vault';
    const vol = (paket.volTitle || '').trim();
    if (!vol) return baseTitle;
    if (baseTitle.toUpperCase().includes(vol.toUpperCase())) return baseTitle;
    return `${vol} — ${baseTitle}`;
  };

  const handleSaveSampleConfig = async () => {
    try {
      await setDoc(doc(db, 'v8_settings', 'free_sample_config'), {
        sampleZipUrl: adminSampleInput.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setCustomSampleUrl(adminSampleInput.trim());
      v8Toast.success('✅ Free 150MP Sample Link Saved!');
    } catch (err) {
      alert('Error saving sample link: ' + err.message);
    }
  };

  const handleUnlockFreeSample = async (e) => {
    e.preventDefault();
    if (!sampleEmail.trim()) return;
    setIsSubmittingLead(true);

    try {
      await addDoc(collection(db, 'v8_b2b_sample_leads'), {
        email: sampleEmail.trim().toLowerCase(),
        activeIndustry: `vault2_${activeTab}`,
        createdAt: serverTimestamp()
      });
      trackV8Action('b2b_sample_lead_captured', { industry: `vault2_${activeTab}` });
      setSampleUnlocked(true);
      v8Toast.success('🔓 150MP + WebP Master Sample Unlocked!');

      const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
      const fallbackVaultUrl = fallbackFreePkg ? await dohvatiSiguranZipLink(fallbackFreePkg) : null;
      const targetDownload = customSampleUrl || fallbackVaultUrl || '/VISIONARY_V10_ZIP_VALIDATION.txt';
      window.open(targetDownload, '_blank');
    } catch (err) {
      console.error(err);
      setSampleUnlocked(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const otvoriCheckoutIliPaddle = async (user, paket, licenseTier = 'standard', customPriceOverride = null) => {
    if (!user || !paket) return;
    const { isEnt, licenseTitle } = resolveStockLicenseMeta(licenseTier);
    const displayTitle = formatPaketDisplayTitle(paket);
    const baseFull = paket.volume ? `${displayTitle} (${paket.volume})` : displayTitle;
    const isUpgradeOrder = customPriceOverride !== null;
    const fullName = isUpgradeOrder
      ? `${baseFull} — [UPGRADE TO ${licenseTitle}]`
      : `${baseFull} — [${licenseTitle}]`;
    const finalPrice = customPriceOverride !== null
      ? customPriceOverride
      : (isEnt ? getEnterpriseCena(paket) : getStandardCena(paket));

    if (!isUpgradeOrder && paket.paddleLink && paket.paddleLink.trim() !== '') {
      window.location.href = paket.paddleLink;
      return;
    }

    setCheckoutData({
      isOpen: true,
      paketId: paket.id,
      name: fullName,
      price: finalPrice,
      licenseTier,
      previewUrl: paket.previewUrl || '/v8-secure-blue.webp'
    });
  };

  const prijavaIKupovina = async (paket, licenseTier = 'standard', customPriceOverride = null) => {
    const displayTitle = formatPaketDisplayTitle(paket);

    if (paket.isFree || paket.cena === '0.00' || parseFloat(paket.cena) === 0) {
      trackV8Action('free_asset_download', { asset_name: displayTitle });
      v8Toast.success('🚀 ACCESS GRANTED: Downloading Free 150MP Sample...');
      await otvoriSiguranDownload(paket);
      return;
    }

    const { isEnt, licenseTitle } = resolveStockLicenseMeta(licenseTier);
    const baseFull = paket.volume ? `${displayTitle} (${paket.volume})` : displayTitle;
    const isUpgradeOrder = customPriceOverride !== null;
    const fullName = isUpgradeOrder
      ? `${baseFull} — [UPGRADE TO ${licenseTitle}]`
      : `${baseFull} — [${licenseTitle}]`;
    const finalPrice = customPriceOverride !== null
      ? customPriceOverride
      : (isEnt ? getEnterpriseCena(paket) : getStandardCena(paket));
    const userNow = currentUser || auth.currentUser;

    trackV8Action('checkout_initiated', {
      event_category: 'B2B_Sales_Vault2',
      item_name: fullName,
      license_tier: licenseTitle,
      value: Number(finalPrice),
      currency: 'USD'
    });

    if (userNow) {
      await otvoriCheckoutIliPaddle(userNow, paket, licenseTier, customPriceOverride);
      return;
    }
    setLoginRequiredData({
      isOpen: true,
      paket,
      licenseTier,
      name: fullName,
      price: finalPrice,
      customPriceOverride
    });
  };

  const handleUploadPreview = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      setPreviewUrl(resData.secure_url);
    } catch {
      v8Toast.error('Upload error!');
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const slobodnaMesta = adminSlotLimit - primeriUrls.length;
    if (slobodnaMesta <= 0) return;
    setIsUploadingPrimer(true);
    const noveSlike = [];
    try {
      for (const file of files.slice(0, slobodnaMesta)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
        const resData = await res.json();
        noveSlike.push(resData.secure_url);
      }
      setPrimeriUrls(prev => [...prev, ...noveSlike]);
    } catch {
      // ignore
    } finally {
      setIsUploadingPrimer(false);
      e.target.value = null;
    }
  };

  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) {
      v8Toast.error('Main Cover Image & Google Drive ZIP link are required!');
      return;
    }

    const paketData = {
      volTitle: noviVolNaslov.trim(),
      nazivEn: noviNazivEn.trim(),
      volume: noviVolume.trim() || '20x 150MP + 20x 4K + 20x WEBP',
      format: noviFormat,
      kategorijaEn: novaKategorijaEn.trim(),
      cena: isFree ? '0.00' : novaCena,
      cenaEnterprise: isFree ? '0.00' : (novaEnterpriseCena || computeDefaultEnterprisePrice(novaCena)),
      tip: noviTip,
      opisEn: noviOpisEn,
      previewUrl,
      isFree,
      previewSlotCount: adminSlotLimit,
      primeri: primeriUrls.slice(0, adminSlotLimit),
      updatedAt: serverTimestamp()
    };

    try {
      let targetId = editingPaketId;
      const targetCol = editingPaketId ? editingSourceCol : STOCK2_COLLECTION;

      if (editingPaketId) {
        await updateDoc(doc(db, targetCol, editingPaketId), {
          ...paketData,
          zipLink: deleteField()
        });
      } else {
        const createdRef = await addDoc(collection(db, STOCK2_COLLECTION), {
          ...paketData,
          createdAt: serverTimestamp()
        });
        targetId = createdRef.id;
      }

      await setDoc(doc(db, 'v8_stock_vault_links', targetId), {
        zipLink: zipLink.trim(),
        paketId: targetId,
        nazivEn: paketData.nazivEn,
        updatedAt: serverTimestamp()
      }, { merge: true });

      v8Toast.success(editingPaketId ? 'Vault II Package Updated!' : 'New Package Published to Stock Vault II!');
      stoziEdit();
    } catch (error) {
      v8Toast.error(error.message);
    }
  };

  const startEditPaket = async (paket) => {
    const detectedSlots = getPaketPreviewSlotCount(paket);
    const stdNum = Math.round(parseFloat(paket.cena || '149'));
    setEditingPaketId(paket.id);
    setEditingSourceCol(paket._sourceCol || STOCK2_COLLECTION);
    setAdminSlotLimit(detectedSlots);
    setPaketTier(stdNum >= 450 ? 'master' : stdNum >= 350 ? 'bundle399' : 'standard');
    setNoviVolNaslov(paket.volTitle || 'VOL. 01');
    setNoviNazivEn(paket.nazivEn || '');
    setNoviVolume(paket.volume || '20x 150MP + 20x 4K + 20x WEBP');
    setNoviFormat(paket.format || 'G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)');
    setNovaKategorijaEn(paket.kategorijaEn || '');
    setNovaCena(paket.cena || '149.00');
    setNovaEnterpriseCena(paket.cenaEnterprise || computeDefaultEnterprisePrice(paket.cena || '149.00'));
    setNoviOpisEn(paket.opisEn || buildVault2Description(paket.format || '', detectedSlots === 20));
    setPreviewUrl(paket.previewUrl || '');
    setIsFree(paket.isFree || false);
    setPrimeriUrls(paket.primeri || []);
    setZipLink(paket.zipLink || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const vaultUrl = await dohvatiSiguranZipLink(paket);
    if (vaultUrl) setZipLink(vaultUrl);
  };

  const stoziEdit = () => {
    setEditingPaketId(null);
    setEditingSourceCol(STOCK2_COLLECTION);
    setPaketTier('standard');
    setAdminSlotLimit(10);
    setNoviVolNaslov('VOL. 01');
    setNoviNazivEn('');
    setNoviVolume('20x 150MP + 20x 4K + 20x WEBP');
    setNoviFormat('G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)');
    setNovaKategorijaEn('');
    setNovaCena('149.00');
    setNovaEnterpriseCena('299.00');
    setNoviOpisEn(buildVault2Description('G01 PRODUCTS & LUXURY LIGHTING (20x 150MP + 4K + WEBP)', false));
    setPreviewUrl('');
    setZipLink('');
    setIsFree(false);
    setPrimeriUrls([]);
  };

  const obrisiPaket = async (paket) => {
    if (window.confirm('Remove this package permanently?')) {
      const targetCol = paket._sourceCol || STOCK2_COLLECTION;
      await deleteDoc(doc(db, targetCol, paket.id));
      await deleteDoc(doc(db, 'v8_stock_vault_links', paket.id)).catch(() => {});
    }
  };

  const currentTabInfo = VAULT2_TABS.find(t => t.id === activeTab) || VAULT2_TABS[0];
  const filtriraniPaketi = activeTab === 'all'
    ? paketi
    : paketi.filter(p => detectVault2Industry(p) === activeTab);

  const getCountForTab = (tabId) => {
    if (tabId === 'all') return paketi.length;
    return paketi.filter(p => detectVault2Industry(p) === tabId).length;
  };

  const hasMasterInActiveTab = filtriraniPaketi.some(p => getPaketPreviewSlotCount(p) === 20);
  const topStripSlotCount = hasMasterInActiveTab ? 20 : 10;
  const activeTabPreviewThumbs = filtriraniPaketi
    .flatMap(p => (p.primeri && p.primeri.length > 0 ? p.primeri : p.previewUrl ? [p.previewUrl] : []))
    .slice(0, topStripSlotCount);

  const seoBaseOrigin = 'https://aitoolsprosmart.com';
  const seoCanonicalUrl =
    typeof window !== 'undefined'
      ? `${seoBaseOrigin}${window.location.pathname}`
      : `${seoBaseOrigin}/stock-2`;

  const isAllTab = activeTab === 'all';
  const cleanTabName = currentTabInfo.shortLabel
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const seoTitle = isAllTab
    ? 'Optical Camera Archive II — 150MP & 4K Commercial Stock Vaults | Visionary Factory V10'
    : `${cleanTabName} — 150MP & 4K IP-Safe Commercial Vault II | AI Tools Pro Smart`;

  const seoDescription = isAllTab
    ? 'License 100% IP-safe, unbranded 150MP Master Print JPG, 4K UHD & WebP commercial photography bundles across 10 optical divisions: Products, Food, Portraits, Fashion, Architecture, Landscapes, Macro, Action, Night & Cinema.'
    : `Download IP-safe, unbranded ${cleanTabName} commercial photography bundles in 150MP print JPG, 4K UHD & WebP with Standard Commercial or Global Enterprise licensing.`;

  const rawHeroImg = filtriraniPaketi[0]?.previewUrl || paketi[0]?.previewUrl || '';
  const seoOgImage =
    rawHeroImg && rawHeroImg.includes('res.cloudinary.com') && rawHeroImg.includes('/upload/')
      ? rawHeroImg.replace('/upload/', '/upload/f_jpg,q_auto:good,w_1200,h_630,c_fill/')
      : `${seoBaseOrigin}/v8-secure-blue.webp`;

  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${seoCanonicalUrl}#collection`,
        url: seoCanonicalUrl,
        name: seoTitle,
        description: seoDescription,
        inLanguage: 'en',
        isPartOf: {
          '@type': 'WebSite',
          name: 'Visionary Factory V10 — AI Tools Pro Smart',
          url: seoBaseOrigin
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090C12] via-[#0E131D] to-[#090C12] text-[#EAE6DF] font-sans relative pb-28">
      <Helmet>
        <html lang="en" />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="canonical" href={seoCanonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Visionary Factory V10 | AI Tools Pro Smart" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:url" content={seoCanonicalUrl} />
        <meta property="og:image" content={seoOgImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(seoJsonLd)}</script>
      </Helmet>

      <div className="relative z-10 pt-28 px-4 sm:px-6 max-w-[1600px] mx-auto">

        {/* NAVIGACIJA NATRAG NA GLAVNI STOCK VAULT I */}
        <div className="w-full flex flex-wrap justify-between items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => navigate('/stock')}
            className="flex items-center gap-2.5 bg-[#121722] hover:bg-[#C5A059] text-[#F3E5AB] hover:text-[#0B0E14] border border-[#C5A059]/40 px-5 py-2.5 rounded-full transition-all font-black uppercase text-[11px] tracking-widest cursor-pointer shadow-lg"
          >
            <ArrowLeft size={15} strokeWidth={2.5} /> Back to Stock Vault I
          </button>
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#C5A059]">
            STOCK VAULT II • 10 OPTICAL &amp; CINEMA DIVISIONS
          </span>
        </div>

        {/* 1. HERO SEKCIJA */}
        <div className="rounded-[2.25rem] bg-[#121722] border border-[#C5A059]/30 shadow-[0_25px_70px_rgba(0,0,0,0.65)] p-8 md:p-14 mb-8 text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent" />

          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#1A2130] border border-[#C5A059]/40 text-[#F3E5AB] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.22em] mb-6">
            <span>100% IP-Safe Unbranded Commercial Archive</span>
            <span className="text-[#C5A059]">•</span>
            <span>Standard Commercial &amp; Global Enterprise Licensing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[50px] font-black uppercase tracking-tight text-[#F7F4EE] max-w-5xl mx-auto leading-[1.08] mb-5">
            {currentTabInfo.headline}
          </h1>

          <p className="text-slate-400 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] max-w-4xl mx-auto leading-relaxed mb-9">
            {currentTabInfo.subheadline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-6xl mx-auto">
            {VAULT2_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = getCountForTab(tab.id);

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-3 sm:px-4 sm:py-3 rounded-xl font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] text-[#0B0E14] border-[#F3E5AB] shadow-[0_10px_28px_rgba(197,160,89,0.28)] scale-[1.02]'
                      : 'bg-[#171E2C] text-slate-300 border-white/10 hover:bg-[#1E2738] hover:border-[#C5A059]/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B0E14]' : 'text-[#C5A059]'}`} />
                  <span>{tab.shortLabel}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-[#0B0E14] text-[#F3E5AB]' : 'bg-[#0B0E14]/70 text-[#C5A059]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {activeTabPreviewThumbs.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/10 max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                  {currentTabInfo.shortLabel} — {activeTabPreviewThumbs.length}-IMAGE INSTANT WEBP PREVIEW STRIP
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Click any thumbnail to inspect 150MP detail
                </span>
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {activeTabPreviewThumbs.map((thumbUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => openGalleryLightbox(activeTabPreviewThumbs, idx, `${currentTabInfo.shortLabel} — PREVIEW`)}
                    className="aspect-square rounded-xl overflow-hidden border border-[#C5A059]/40 hover:border-[#F3E5AB] bg-[#0B0E14] cursor-zoom-in group relative"
                  >
                    <img
                      src={toFastWebp(thumbUrl, 320)}
                      loading="lazy"
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-[#F3E5AB] bg-black/75 px-1 rounded">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. B2B LEAD MAGNET BAR */}
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-[#111927] via-[#162235] to-[#111927] border border-[#C5A059]/40 p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-[#0B0E14] bg-gradient-to-r from-[#F3E5AB] to-[#C5A059] px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" /> Agency Quality Verification • Zero Risk
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F7F4EE]">
                Inspect True 150MP + 4K + WebP Files Before Licensing
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                Creative directors &amp; designers: enter your work email to instantly unlock a complimentary <strong className="text-[#F3E5AB]">150MP Master Print + 4K UHD + WebP Sample</strong> with embedded sRGB ICC profile and zero watermarks.
              </p>
            </div>

            {!sampleUnlocked ? (
              <form onSubmit={handleUnlockFreeSample} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 shrink-0">
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#C5A059] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={sampleEmail}
                    onChange={(e) => setSampleEmail(e.target.value)}
                    placeholder="Enter agency or work email..."
                    className="w-full sm:w-72 bg-[#0B0E14] border border-[#C5A059]/50 focus:border-[#F3E5AB] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#F7F4EE] placeholder:text-slate-500 font-semibold outline-none shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] hover:brightness-110 text-[#0B0E14] font-black text-xs uppercase tracking-widest rounded-xl shadow-lg transition cursor-pointer whitespace-nowrap"
                >
                  {isSubmittingLead ? 'Unlocking...' : 'Download 150MP Sample'}
                </button>
              </form>
            ) : (
              <div className="bg-[#0B0E14] border border-emerald-500/50 rounded-2xl px-6 py-4 text-center shadow-md">
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
                  ✓ Master Sample Unlocked! Check Your New Tab
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
                    const fallbackVaultUrl = fallbackFreePkg ? await dohvatiSiguranZipLink(fallbackFreePkg) : null;
                    window.open(customSampleUrl || fallbackVaultUrl || '/VISIONARY_V10_ZIP_VALIDATION.txt', '_blank');
                  }}
                  className="mt-1.5 text-[11px] underline text-[#F3E5AB] font-bold cursor-pointer"
                >
                  Click here if download didn't start automatically
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F3E5AB] shrink-0">
                🔧 ADMIN — Free 150MP Sample Google Drive Link:
              </span>
              <input
                type="url"
                value={adminSampleInput}
                onChange={(e) => setAdminSampleInput(e.target.value)}
                placeholder="Paste Google Drive link to your 1-image Free 150MP + 4K + WebP Sample ZIP..."
                className="flex-1 w-full bg-[#0B0E14] border border-[#C5A059]/40 rounded-lg px-3 py-2 text-xs text-[#F7F4EE] font-semibold outline-none"
              />
              <button
                type="button"
                onClick={handleSaveSampleConfig}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] font-black text-[11px] uppercase tracking-wider rounded-lg cursor-pointer shrink-0"
              >
                Save Sample Link
              </button>
            </div>
          )}
        </div>

        {/* 3. ADMIN FORMA + 1-KLIK ZAŠTITA LINKOVA */}
        {isAdmin && (
          <form onSubmit={dodajPaket} className="bg-[#121722] border-2 border-[#C5A059]/40 rounded-[2rem] p-6 md:p-8 mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.65)] max-w-5xl mx-auto">

            {nezasticeniPaketi.length > 0 && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-[#C5A059] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#F3E5AB] font-bold">
                  🔒 Detektirano {nezasticeniPaketi.length} paketa s javnim Google Drive linkom. Klikni desno za prijenos u zaključani sef (v8_stock_vault_links)!
                </div>
                <button
                  type="button"
                  disabled={isMigratingLinks}
                  onClick={migrirajJavneLinkoveUSef}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E2C383] text-[#0B0E14] font-black text-[11px] uppercase tracking-wider cursor-pointer shrink-0 shadow-lg"
                >
                  {isMigratingLinks ? 'Zaključavam...' : 'Zaključaj postojeće linkove u Sef'}
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg md:text-xl font-black text-[#F7F4EE] uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C5A059]" /> {editingPaketId ? 'EDIT VAULT II PACKAGE' : 'PUBLISH PACKAGE TO STOCK VAULT II (10 GROUPS)'}
              </h2>
              {editingPaketId && (
                <button type="button" onClick={stoziEdit} className="text-xs font-bold uppercase px-4 py-2 bg-[#1B2232] hover:bg-[#252F45] rounded-lg text-[#F3E5AB] cursor-pointer">
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-3.5 bg-[#0B0E14] rounded-2xl border border-[#C5A059]/30">
              <button
                type="button"
                onClick={() => handleSelectTierPreset('standard')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  paketTier === 'standard'
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E2C383] text-[#0B0E14] border-[#F3E5AB] shadow-md'
                    : 'bg-[#121722] text-slate-300 border-white/10 hover:border-[#C5A059]/50'
                }`}
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">1. Standard Pack (20 Scenes)</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${paketTier === 'standard' ? 'text-[#0B0E14]/80' : 'text-slate-400'}`}>
                    Std: $149 • Ent: $299 • 10 Slots
                  </div>
                </div>
                <span className="text-xs font-black">$149</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTierPreset('bundle399')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  paketTier === 'bundle399'
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E2C383] text-[#0B0E14] border-[#F3E5AB] shadow-md'
                    : 'bg-[#121722] text-slate-300 border-white/10 hover:border-[#C5A059]/50'
                }`}
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">2. Master Pack ($399)</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${paketTier === 'bundle399' ? 'text-[#0B0E14]/80' : 'text-slate-400'}`}>
                    Std: $399 • Ent: $690 • 20 Slots
                  </div>
                </div>
                <span className="text-xs font-black">$399</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTierPreset('master')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  paketTier === 'master'
                    ? 'bg-gradient-to-r from-[#C5A059] to-[#E2C383] text-[#0B0E14] border-[#F3E5AB] shadow-md'
                    : 'bg-[#121722] text-slate-300 border-white/10 hover:border-[#C5A059]/50'
                }`}
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">3. Agency Bundle (45 Scenes)</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${paketTier === 'master' ? 'text-[#0B0E14]/80' : 'text-slate-400'}`}>
                    Std: $499 • Ent: $890 • 20 Slots
                  </div>
                </div>
                <span className="text-xs font-black">$499</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[#F3E5AB] font-extrabold text-[11px] tracking-widest uppercase">
                  <Hash size={14} className="text-[#C5A059]" /> VOL. / EDITION TITLE
                </label>
                <input
                  type="text"
                  value={noviVolNaslov}
                  onChange={(e) => setNoviVolNaslov(e.target.value)}
                  placeholder="E.g. VOL. 01 or MASTER PACK"
                  className="bg-[#0B0E14] border border-[#C5A059]/50 p-3.5 rounded-xl text-sm font-black uppercase tracking-wider text-[#F3E5AB] placeholder:text-slate-500 outline-none focus:border-[#F3E5AB]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                  <Type size={14} className="text-[#C5A059]" /> CAMPAIGN PACKAGE TITLE
                </label>
                <input
                  type="text"
                  value={noviNazivEn}
                  onChange={(e) => setNoviNazivEn(e.target.value)}
                  placeholder="E.g. Luxury Glass Perfume & Studio Pack"
                  className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-sm font-bold text-[#F7F4EE] placeholder:text-slate-500 outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                  <Layers size={14} className="text-[#C5A059]" /> SUB-NICHE TAG
                </label>
                <input
                  type="text"
                  value={novaKategorijaEn}
                  onChange={(e) => setNovaKategorijaEn(e.target.value)}
                  placeholder="E.g. Studio Products / Cinema Frames"
                  className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-sm font-bold text-[#F7F4EE] placeholder:text-slate-500 outline-none focus:border-[#C5A059]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                  <FolderArchive size={14} className="text-[#C5A059]" /> DELIVERY BADGE (SPECS)
                </label>
                <input
                  type="text"
                  value={noviVolume}
                  onChange={(e) => setNoviVolume(e.target.value)}
                  placeholder="20x 150MP + 20x 4K + 20x WEBP"
                  className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-sm font-bold text-[#F7F4EE] placeholder:text-slate-500 outline-none focus:border-[#C5A059]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                  <FileText size={14} className="text-[#C5A059]" /> COMMERCIAL DESCRIPTION
                </label>
                <textarea
                  value={noviOpisEn}
                  onChange={(e) => setNoviOpisEn(e.target.value)}
                  rows={9}
                  className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-xs font-medium text-slate-200 outline-none focus:border-[#C5A059] resize-none h-full leading-relaxed"
                  required
                />
              </div>

              <div className="flex flex-col gap-5 md:col-span-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 text-slate-300 font-extrabold text-[10px] tracking-widest uppercase">
                      <Wallet size={13} className="text-[#C5A059]" /> STANDARD COMMERCIAL ($)
                    </label>
                    <input
                      type="text"
                      value={novaCena}
                      onChange={(e) => setNovaCena(e.target.value)}
                      disabled={isFree}
                      placeholder="149.00"
                      className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-sm font-black text-[#F7F4EE] outline-none focus:border-[#C5A059]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 text-[#F3E5AB] font-extrabold text-[10px] tracking-widest uppercase">
                      <Crown size={13} className="text-[#C5A059]" /> GLOBAL ENTERPRISE ($)
                    </label>
                    <input
                      type="text"
                      value={novaEnterpriseCena}
                      onChange={(e) => setNovaEnterpriseCena(e.target.value)}
                      disabled={isFree}
                      placeholder="299.00"
                      className="bg-[#0B0E14] border border-[#C5A059]/50 p-3.5 rounded-xl text-sm font-black text-[#F3E5AB] outline-none focus:border-[#F3E5AB]"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-1.5 text-slate-300 font-extrabold text-[10px] tracking-widest uppercase">
                      <Layers size={13} className="text-[#C5A059]" /> PREVIEW SLOTS
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setAdminSlotLimit(10)}
                        className={`p-3.5 rounded-xl text-[11px] font-black uppercase border cursor-pointer transition ${
                          adminSlotLimit === 10
                            ? 'bg-[#C5A059] text-[#0B0E14] border-[#F3E5AB]'
                            : 'bg-[#0B0E14] text-slate-300 border-white/15 hover:border-[#C5A059]'
                        }`}
                      >
                        10 Slots
                      </button>
                      <button
                        type="button"
                        onClick={() => setAdminSlotLimit(20)}
                        className={`p-3.5 rounded-xl text-[11px] font-black uppercase border cursor-pointer transition ${
                          adminSlotLimit === 20
                            ? 'bg-[#C5A059] text-[#0B0E14] border-[#F3E5AB]'
                            : 'bg-[#0B0E14] text-slate-300 border-white/15 hover:border-[#C5A059]'
                        }`}
                      >
                        20 Slots
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                    <MonitorPlay size={14} className="text-[#C5A059]" /> SELECT TARGET GROUP (1–10)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {VAULT2_TABS.filter(t => t.id !== 'all').map((t) => (
                      <label
                        key={t.formatCode}
                        className={`cursor-pointer p-3 rounded-xl border text-center font-extrabold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center ${
                          noviFormat === t.formatCode
                            ? 'bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0B0E14] border-[#F3E5AB] shadow-md'
                            : 'bg-[#0B0E14] border-white/15 text-slate-300 hover:border-[#C5A059]/60 hover:text-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={t.formatCode}
                          checked={noviFormat === t.formatCode}
                          onChange={() => handleFormatRadioChange(t.formatCode)}
                          className="hidden"
                        />
                        {t.shortLabel}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                    <LinkIcon size={14} className="text-[#C5A059]" /> GOOGLE DRIVE ZIP LINK (SAVED IN PRIVATE VAULT)
                  </label>
                  <input
                    type="url"
                    value={zipLink}
                    onChange={(e) => setZipLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="bg-[#0B0E14] border border-white/15 p-3.5 rounded-xl text-xs font-bold text-[#F7F4EE] placeholder:text-slate-500 outline-none focus:border-[#C5A059]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-slate-300 font-extrabold text-[11px] tracking-widest uppercase">
                    <Zap size={14} className="text-[#C5A059]" /> PACKAGE ACCESS TYPE
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isFree;
                      setIsFree(next);
                      setNovaCena(next ? '0.00' : (paketTier === 'master' ? '499.00' : paketTier === 'bundle399' ? '399.00' : '149.00'));
                      setNovaEnterpriseCena(next ? '0.00' : (paketTier === 'master' ? '890.00' : paketTier === 'bundle399' ? '690.00' : '299.00'));
                    }}
                    className={`w-full p-3.5 rounded-xl font-extrabold text-xs tracking-widest uppercase border transition-all cursor-pointer ${
                      isFree
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-[#0B0E14] border-white/15 text-slate-300 hover:border-[#C5A059]'
                    }`}
                  >
                    {isFree ? '⚡ FREE LEAD-MAGNET PACKAGE ($0.00)' : 'PAID DUAL-LICENSE PACKAGE'}
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-[#0B0E14] rounded-2xl border border-white/10 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-black uppercase tracking-widest text-[#F3E5AB] flex items-center gap-2">
                    <UploadCloud size={16} className="text-[#C5A059]" />
                    PACKAGE VISUAL SLOTS: 1 MAIN COVER + {adminSlotLimit} SMALL PREVIEW THUMBNAILS ({Math.min(primeriUrls.length, adminSlotLimit)}/{adminSlotLimit})
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    Tip: Upload from your 03_Web_Ready_WEBP folder for instant loading
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-11 gap-2.5">
                  <div
                    onClick={() => !previewUrl && mainImageRef.current.click()}
                    className={`aspect-square rounded-xl overflow-hidden relative flex flex-col items-center justify-center border-2 transition ${
                      previewUrl
                        ? 'border-[#C5A059] bg-[#121722]'
                        : 'border-dashed border-[#C5A059]/60 bg-[#121722]/70 hover:bg-[#192030] cursor-pointer'
                    }`}
                  >
                    <span className="absolute top-1 left-1 bg-[#C5A059] text-[#0B0E14] text-[8px] font-black px-1.5 py-0.5 rounded z-10">
                      COVER
                    </span>
                    {previewUrl ? (
                      <>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 z-20 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                        <img src={toFastWebp(previewUrl, 300)} alt="Main Cover" className="w-full h-full object-cover" />
                      </>
                    ) : (
                      <div className="flex flex-col items-center text-center p-1">
                        <UploadCloud size={18} className="text-[#C5A059] mb-1" />
                        <span className="text-[8px] font-bold uppercase text-slate-300">Upload Cover</span>
                      </div>
                    )}
                  </div>

                  {Array.from({ length: adminSlotLimit }).map((_, idx) => {
                    const url = primeriUrls[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => !url && galleryImagesRef.current.click()}
                        className={`aspect-square rounded-xl overflow-hidden relative flex flex-col items-center justify-center border transition ${
                          url
                            ? 'border-[#C5A059]/60 bg-[#121722]'
                            : 'border-dashed border-white/15 bg-[#121722]/40 hover:border-[#C5A059]/60 hover:bg-[#192030] cursor-pointer'
                        }`}
                      >
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[#F3E5AB] text-[8px] font-black px-1.5 py-0.5 rounded z-10">
                          #{idx + 1}
                        </span>
                        {url ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPrimeriUrls(prev => prev.filter((_, i) => i !== idx));
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 z-20 cursor-pointer"
                            >
                              <X size={10} />
                            </button>
                            <img src={toFastWebp(url, 300)} alt={`Slot ${idx + 1}`} className="w-full h-full object-cover" />
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-center p-1 opacity-75">
                            <UploadCloud size={15} className="text-slate-400 mb-0.5" />
                            <span className="text-[8px] font-bold uppercase text-slate-400">Slot {idx + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => mainImageRef.current.click()}
                    className="bg-[#182030] hover:bg-[#222D42] text-[#F7F4EE] border border-[#C5A059]/40 px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <UploadCloud size={17} className="text-[#C5A059]" />
                    {isUploading ? 'Uploading Cover...' : 'Upload Cover from Computer'}
                  </button>
                  <input type="file" accept="image/*" ref={mainImageRef} onChange={handleUploadPreview} className="hidden" />

                  <button
                    type="button"
                    onClick={() => galleryImagesRef.current.click()}
                    className="bg-[#182030] hover:bg-[#222D42] text-[#F7F4EE] border border-[#C5A059]/40 px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2.5 cursor-pointer"
                  >
                    <UploadCloud size={17} className="text-[#C5A059]" />
                    {isUploadingPrimer ? 'Uploading...' : `Upload ${adminSlotLimit} Thumbnails from Computer (${Math.min(primeriUrls.length, adminSlotLimit)}/${adminSlotLimit})`}
                  </button>
                  <input type="file" accept="image/*" multiple ref={galleryImagesRef} onChange={handleUploadPrimeri} className="hidden" />
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] hover:brightness-110 text-[#0B0E14] shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={16} /> {editingPaketId ? 'SAVE UPDATES' : 'PUBLISH TO VAULT II'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4. PRODUCT CARDS SA PAMETNOM DOPLATOM ZA ENTERPRISE */}
        {filtriraniPaketi.length === 0 ? (
          <div className="text-center py-20 bg-[#121722] border border-white/10 rounded-3xl mb-16 shadow-xl">
            <Aperture className="w-11 h-11 text-[#C5A059] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase tracking-widest text-[#F7F4EE]">
              New 150MP + 4K + WebP Vaults Arriving in {currentTabInfo.shortLabel}
            </h3>
            <p className="text-xs text-slate-400 mt-2 mb-6">
              Switch to &quot;ALL VAULTS II&quot; to browse all published Vault II packages, or publish a new ZIP in {currentTabInfo.shortLabel} above.
            </p>
            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer"
              >
                Show All Vault II Packages ({paketi.length})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {filtriraniPaketi.map((paket) => {
              const isFreePkg = paket.isFree || parseFloat(paket.cena) === 0;
              const ownedTiers = kupljeneLicencePoPaketu[paket.id] || { standard: false, enterprise: false };
              const hasStandardPaid = Boolean(ownedTiers.standard);
              const hasEnterprisePaid = Boolean(ownedTiers.enterprise);

              const detectedId = detectVault2Industry(paket);
              const matchedTab = VAULT2_TABS.find(t => t.id === detectedId) || VAULT2_TABS[10];
              const cardSlotCount = getPaketPreviewSlotCount(paket);

              const activeLic = getActiveCardLicense(paket.id);
              const { isEnt: isCardEnt, licensePdf: activeLicensePdf } = resolveStockLicenseMeta(activeLic);
              const stdPrice = getStandardCena(paket);
              const entPrice = getEnterpriseCena(paket);

              const isCurrentTierOwned = isFreePkg || (isCardEnt ? hasEnterprisePaid : (hasStandardPaid || hasEnterprisePaid));
              const isUpgradeEligible = !isFreePkg && isCardEnt && hasStandardPaid && !hasEnterprisePaid;
              const upgradeDiff = Math.max(0, parseFloat(entPrice) - parseFloat(stdPrice)).toFixed(2);

              const displayedPrice = isFreePkg
                ? '0.00'
                : isUpgradeEligible
                ? upgradeDiff
                : (isCardEnt ? entPrice : stdPrice);

              const canSeeSelectedPdf = !isFreePkg && (isAdmin || (isCardEnt ? hasEnterprisePaid : (hasStandardPaid || hasEnterprisePaid)));

              return (
                <div
                  key={paket.id}
                  className={`bg-[#121722] border ${
                    isCardEnt || cardSlotCount === 20 ? 'border-[#C5A059]/60' : 'border-white/10'
                  } hover:border-[#C5A059]/90 rounded-[2rem] overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.55)] transition-all duration-300 flex flex-col`}
                >
                  <div className="p-4 sm:p-5 relative bg-[#0D111A] border-b border-white/10">
                    <div className="absolute top-7 left-7 z-20 flex flex-wrap gap-2">
                      {paket.volTitle && (
                        <span className="bg-gradient-to-r from-[#C5A059] to-[#E2C383] text-[#0B0E14] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          {paket.volTitle}
                        </span>
                      )}
                      <span className="bg-[#0B0E14]/90 backdrop-blur-md border border-white/15 text-[#F7F4EE] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {paket.volume || '20x 150MP + 20x 4K + 20x WEBP'}
                      </span>
                      <span className="bg-[#182030]/90 backdrop-blur-md border border-[#C5A059]/50 text-[#F3E5AB] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        {paket.kategorijaEn || matchedTab.shortLabel}
                      </span>
                    </div>

                    <div className="absolute top-7 right-7 z-20">
                      <span className="bg-[#0B0E14]/90 backdrop-blur-md border border-[#C5A059]/60 text-[#F3E5AB] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        150MP + 4K + WEBP
                      </span>
                    </div>

                    <div
                      onClick={() => {
                        const validPrimeri = (paket.primeri || []).slice(0, cardSlotCount).filter(Boolean);
                        const fullCardGallery = [paket.previewUrl, ...validPrimeri.filter(u => u !== paket.previewUrl)].filter(Boolean);
                        openGalleryLightbox(fullCardGallery, 0, formatPaketDisplayTitle(paket));
                      }}
                      className="w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in relative group border border-white/10 bg-[#080A0F]"
                    >
                      <img
                        src={toFastWebp(paket.previewUrl, 1200)}
                        loading="lazy"
                        alt={formatPaketDisplayTitle(paket)}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-[#F3E5AB]">
                          Click to Inspect Full-Screen 150MP Detail
                        </span>
                      </div>
                    </div>

                    <div className={`grid ${cardSlotCount === 20 ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-5'} gap-2 mt-3`}>
                      {Array.from({ length: cardSlotCount }).map((_, idx) => {
                        const thumb = paket.primeri && paket.primeri[idx];
                        return thumb ? (
                          <div
                            key={idx}
                            onClick={() => {
                              const validPrimeri = (paket.primeri || []).slice(0, cardSlotCount).filter(Boolean);
                              const clickedPos = validPrimeri.indexOf(thumb);
                              openGalleryLightbox(
                                validPrimeri,
                                clickedPos >= 0 ? clickedPos : 0,
                                `${formatPaketDisplayTitle(paket)} — THUMBNAILS`
                              );
                            }}
                            className="aspect-square rounded-xl overflow-hidden cursor-zoom-in border border-white/15 hover:border-[#C5A059] transition bg-[#080A0F] relative group"
                          >
                            <img
                              src={toFastWebp(thumb, 320)}
                              loading="lazy"
                              alt={`Asset ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-[#F3E5AB] bg-black/70 px-1 rounded">
                              #{idx + 1}
                            </span>
                          </div>
                        ) : (
                          <div
                            key={idx}
                            onClick={() => isAdmin && startEditPaket(paket)}
                            className="aspect-square rounded-xl border border-dashed border-white/10 bg-[#080A0F]/60 flex flex-col items-center justify-center text-slate-600"
                          >
                            <span className="text-[8px] font-bold">#{idx + 1}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col flex-grow bg-[#121722]">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A059]">
                        {paket.volTitle ? `${paket.volTitle} • ` : ''}{matchedTab.shortLabel} VAULT
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                        ● Verified ZIP + License Delivery
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F7F4EE] mb-4 flex flex-wrap items-center gap-2.5">
                      {paket.volTitle && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#1C2436] border border-[#C5A059]/50 text-[#F3E5AB] text-sm sm:text-base font-black tracking-widest">
                          {paket.volTitle}
                        </span>
                      )}
                      <span>{paket.nazivEn}</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                      <div className="bg-[#0B0E14] border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                        <Aperture className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-200">
                          150MP Print + 4K + WebP
                        </span>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          Zero Text • Zero Logos • IP-Safe
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6 flex-grow font-medium">
                      {paket.opisEn || buildVault2Description(paket.format || '', cardSlotCount === 20)}
                    </p>

                    {!isFreePkg && (
                      <div className="mb-5 p-3 rounded-2xl bg-[#0B0E14] border border-[#C5A059]/30">
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F3E5AB]">
                            SELECT COMMERCIAL LICENSE TIER:
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lock size={11} className="text-[#C5A059]" /> PDF Unlocks After Payment
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setCardLicense(paket.id, 'standard')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              !isCardEnt
                                ? 'bg-[#182235] border-[#C5A059] shadow-[0_0_20px_rgba(197,160,89,0.18)]'
                                : 'bg-[#111622] border-white/10 opacity-75 hover:opacity-100 hover:border-white/25'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#F7F4EE]">
                                Standard Commercial
                              </span>
                              <span className="text-sm font-black text-[#F3E5AB]">${stdPrice}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold mt-1 leading-snug">
                              1 Project / 1 Client • Web, Social &amp; Print ≤5K • No TV / OOH
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCardLicense(paket.id, 'enterprise')}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isCardEnt
                                ? 'bg-gradient-to-br from-[#231E15] to-[#171E2E] border-[#F3E5AB] shadow-[0_0_24px_rgba(197,160,89,0.28)]'
                                : 'bg-[#111622] border-white/10 opacity-75 hover:opacity-100 hover:border-[#C5A059]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-[#F3E5AB] flex items-center gap-1">
                                <Crown size={12} className="text-[#C5A059]" /> Global Enterprise
                              </span>
                              <span className="text-sm font-black text-[#F3E5AB]">${entPrice}</span>
                            </div>
                            <div className="text-[10px] text-slate-300 font-semibold mt-1 leading-snug">
                              Unlimited Clients • TV Broadcast, OOH Billboards &amp; Packaging
                            </div>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-0.5">
                          {isFreePkg
                            ? 'Free Complimentary Sample'
                            : isUpgradeEligible
                            ? `Enterprise Upgrade Credit Applied (-$${stdPrice})`
                            : isCardEnt
                            ? 'Global Enterprise • Unlimited Multi-Client, TV & OOH'
                            : 'Standard Commercial • Single-Project Rights'}
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-[#F3E5AB]">
                          ${displayedPrice}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (isAdmin || isCurrentTierOwned) {
                              trackV8Action('owned_asset_download', { asset_name: formatPaketDisplayTitle(paket) });
                              otvoriSiguranDownload(paket);
                            } else if (isUpgradeEligible) {
                              prijavaIKupovina(paket, 'enterprise', upgradeDiff);
                            } else {
                              prijavaIKupovina(paket, activeLic, null);
                            }
                          }}
                          className={`flex-1 sm:flex-initial px-7 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                            !isAdmin && isCurrentTierOwned
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] hover:brightness-110 text-[#0B0E14]'
                          }`}
                        >
                          {(isAdmin || isCurrentTierOwned) ? (
                            <><DownloadCloud size={16} /> Download ZIP</>
                          ) : isUpgradeEligible ? (
                            <><Crown size={15} /> Upgrade to Enterprise (+${upgradeDiff})</>
                          ) : isCardEnt ? (
                            <><Crown size={15} /> Buy Enterprise License</>
                          ) : (
                            <><Diamond size={15} /> Buy Standard License</>
                          )}
                        </button>

                        {canSeeSelectedPdf && (
                          <a
                            href={activeLicensePdf}
                            download
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest bg-[#1A2232] hover:bg-[#243047] text-[#F3E5AB] border border-[#C5A059]/50 transition flex items-center justify-center gap-1.5"
                          >
                            <FileText size={14} /> License PDF
                          </a>
                        )}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5 pt-4 border-t border-white/10 flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditPaket(paket)}
                          className="flex-1 bg-[#1A2232] hover:bg-[#C5A059] text-slate-200 hover:text-[#0B0E14] border border-white/10 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit size={13} /> Edit Package
                        </button>
                        <button
                          type="button"
                          onClick={() => obrisiPaket(paket)}
                          className="flex-1 bg-red-950/50 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. SKLOPLJEN TEHNIČKI SERTIFIKAT NA DNU */}
        <div className="max-w-5xl mx-auto border border-[#C5A059]/30 bg-[#121722] rounded-3xl overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={() => setShowTechSpecs(!showTechSpecs)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#171E2C] transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block">
                V10 Master Engine • 10 Optical Divisions &amp; Dual B2B Licensing
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#F7F4EE] mt-0.5">
                View Triple Delivery (150MP + 4K + WebP), Color Science &amp; Licensing Scope
              </h3>
            </div>
            <ChevronDown className={`w-6 h-6 text-[#C5A059] transition-transform ${showTechSpecs ? 'rotate-180' : ''}`} />
          </button>

          {showTechSpecs && (
            <div className="p-6 pt-2 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10">
                <strong className="text-[#F3E5AB] uppercase block mb-1">1. Unified Triple Commercial Delivery</strong>
                Every ZIP bundle is structured into 3 clean folders: <code className="text-[#F3E5AB]">01_Master_Resolution_JPG</code> (150MP print), <code className="text-[#F3E5AB]">02_4K_UHD_JPG</code>, and <code className="text-[#F3E5AB]">03_Web_Ready_WEBP</code>.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10">
                <strong className="text-[#F3E5AB] uppercase block mb-1">2. 100% IP-Safe, Textless &amp; Unbranded</strong>
                Zero third-party logos, zero readable packaging text, zero watermarks, and stripped EXIF metadata—ready for corporate legal approval.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10">
                <strong className="text-[#F3E5AB] uppercase block mb-1">3. Full-Frame, Medium-Format &amp; Cinema Optics</strong>
                Engineered with 24mm Tilt-Shift, 85mm Portrait, 100mm 1:1 Macro, and Anamorphic Cinema optical physics scaled via V10 150MP LANCZOS Master Engine.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <strong className="text-[#F3E5AB] uppercase block mb-1">4. Stock Vault I</strong>
                  Browse Obsidian Dark-Mode Web Heroes, Luxury Tech Hardware, Watches &amp; Vault I collections anytime.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => navigate('/stock')} className="text-[10px] font-extrabold uppercase px-3 py-2 bg-[#182030] border border-white/15 text-slate-300 hover:border-[#C5A059] rounded-lg transition cursor-pointer">
                    ← Back to Stock Vault I
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData({ isOpen: false, paket: null, licenseTier: 'standard', name: '', price: 0, customPriceOverride: null })}
        packageName={loginRequiredData.name}
        price={loginRequiredData.price}
        onLoginSuccess={async (user) => {
          if (loginRequiredData.paket) {
            await otvoriCheckoutIliPaddle(user, loginRequiredData.paket, loginRequiredData.licenseTier, loginRequiredData.customPriceOverride);
          }
          setLoginRequiredData({ isOpen: false, paket: null, licenseTier: 'standard', name: '', price: 0, customPriceOverride: null });
        }}
      />
      {lightboxState.isOpen && (
        <FullScreenLightbox
          images={lightboxState.images}
          currentIndex={lightboxState.currentIndex}
          title={lightboxState.title}
          onSelectIndex={(newIdx) => setLightboxState((prev) => ({ ...prev, currentIndex: newIdx }))}
          onClose={() => setLightboxState({ isOpen: false, images: [], currentIndex: 0, title: '' })}
        />
      )}
      <AnimatePresence>
        {checkoutData.isOpen && (
          <V8SecureCheckout
            isOpen={checkoutData.isOpen}
            paketId={checkoutData.paketId}
            productName={checkoutData.name}
            price={checkoutData.price}
            licenseTier={checkoutData.licenseTier}
            projectImage={checkoutData.previewUrl || '/v8-secure-blue.webp'}
            onClose={() => setCheckoutData({ isOpen: false, paketId: null, name: '', price: 0, licenseTier: 'standard', previewUrl: '' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const V8Stock2 = () => (
  <V8ErrorGuard>
    <V8Stock2Base />
  </V8ErrorGuard>
);

export default V8Stock2;
// KRAJ FAJLA: src/componentsStockBerza/V8Stock2.jsx