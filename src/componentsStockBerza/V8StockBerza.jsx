// ============================================================================
// POČETAK FAJLA: src/componentsStockBerza/V8StockBerza.jsx (STRICT FIREBASE PAID GATE + DUAL LICENSE)
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import {
  Zap, X, UploadCloud, DownloadCloud, Crown, AlertCircle,
  Type, Hash, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon,
  Diamond, RefreshCcw, Aperture, ShieldCheck, Edit, Trash2, Sparkles,
  Compass, Utensils, Wine, Car, Mail, CheckCircle2, ChevronDown, Cpu, Watch, Home, Sun, Snowflake, Gem, Flame, Lock
} from 'lucide-react';
import { db, auth } from '../firebase';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
  query, getDoc, setDoc, where, onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';
import { trackV8Action } from '../utils/analytics';

// Automatska WebP konverzija i kompresija za Cloudinary linkove radi munjevitog učitavanja sajta
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
    console.error("🚨 [V8 ŠTIT UHVATIO GREŠKU EKSTENZIJE]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-6 text-center z-[999999] relative text-[#EAE6DF]">
          <AlertCircle size={56} className="text-[#C5A059] mb-6" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-4">Sistemska Blokada</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium leading-relaxed">
            Vaš pretraživač ili aktivna ekstenzija blokira učitavanje modula. Pauzirajte ad-blocker ili osvežite stranicu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] px-8 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg mx-auto cursor-pointer"
          >
            <RefreshCcw size={18} /> Osveži Sistem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
      trackV8Action('image_zoom', { event_category: 'Engagement' });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-[#06080C]/95 backdrop-blur-xl flex items-center justify-center p-4" onClick={onClose}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 md:top-10 md:right-10 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] p-3.5 rounded-full font-black z-[1000000] transition-all hover:scale-105 cursor-pointer shadow-2xl"
      >
        <X size={26} strokeWidth={2.5} />
      </button>
      <img
        src={toFastWebp(imageUrl, 2400)}
        alt="150MP Full Screen Inspection"
        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl relative z-[999999] border border-[#C5A059]/40"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

// ============================================================================
// SVE KOMERCIJALNE B2B KATEGORIJE
// ============================================================================
const INDUSTRY_TABS = [
  {
    id: 'all',
    label: 'ALL VAULTS',
    shortLabel: 'ALL VAULTS',
    formatCode: 'V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)',
    icon: Layers,
    headline: 'COMMERCIAL 150MP + 4K + WEBP CAMPAIGN ARCHIVE',
    subheadline: '100% IP-SAFE, UNBRANDED COMMERCIAL VISUAL PACKAGES FOR LUXURY BRANDS, SAAS FOUNDERS & AGENCIES. TRIPLE DELIVERY IN EVERY ZIP: 150MP MASTER PRINT JPG + 4K UHD JPG + WEB-READY WEBP.'
  },
  {
    id: 'luxury_interiors',
    label: 'LUXURY INTERIORS',
    shortLabel: 'LUXURY INTERIORS',
    formatCode: 'V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)',
    icon: Home,
    headline: 'LUXURY INTERIOR DESIGN & ARCHITECTURAL SPACES',
    subheadline: 'MARBLE LIVING ROOMS, DESIGNER KITCHENS, DINING SUITES, PRIVATE LIBRARIES, WALK-IN WARDROBES, EXECUTIVE OFFICES & PRIVATE CINEMAS IN 150MP PRINT + 4K UHD + WEBP.'
  },
  {
    id: 'luxury_tech',
    label: 'LUXURY TECH & AI',
    shortLabel: 'LUXURY TECH & AI',
    formatCode: 'V10 LUXURY TECH & AI (20x 150MP + 4K + WEBP)',
    icon: Cpu,
    headline: 'LUXURY TECH PRODUCTS, AI CORES & SAAS HARDWARE',
    subheadline: 'UNBRANDED BLACK-TITANIUM AI HARDWARE MODULES, CYBERSECURITY VAULTS, SMART-HOME HUBS, OPTICAL SENSORS & LEVITATING LAUNCH OBJECTS WITH CLEAN HERO NEGATIVE SPACE.'
  },
  {
    id: 'watches_horology',
    label: 'WATCHES & HOROLOGY',
    shortLabel: 'WATCHES & HOROLOGY',
    formatCode: 'V10 WATCHES & HOROLOGY (20x 150MP + 4K + WEBP)',
    icon: Watch,
    headline: 'LUXURY WATCHES, SKELETON CALIBRES & HAUTE HORLOGERIE',
    subheadline: '100% IP-SAFE UNBRANDED MECHANICAL TIMEPIECES, TOURBILLON-INSPIRED CAGES, SAPPHIRE CRYSTAL MACROS & COLLECTOR DISPLAYS SHOT ON 120MM MEDIUM-FORMAT OPTICS.'
  },
  {
    id: 'exotic_auto',
    label: 'EXOTIC AUTO & CARBON',
    shortLabel: 'EXOTIC AUTO & CARBON',
    formatCode: 'V10 EXOTIC AUTO & CARBON (20x 150MP + 4K + WEBP)',
    icon: Car,
    headline: 'EXOTIC AUTOMOTIVE DETAILS, FORGED CARBON & CERAMIC BRAKES',
    subheadline: '100% IP-SAFE UNBRANDED AUTOMOTIVE BODY CURVES, FORGED CARBON WEAVES, FLUSH ALLOY RIMS, CERAMIC BRAKES, SMOKED HEADLIGHT OPTICS & STITCHED LEATHER INTERIORS.'
  },
  {
    id: 'beverage_cocktail',
    label: 'BEVERAGE / ENERGY DRINK / COCKTAIL BAR',
    shortLabel: 'BEVERAGE, ENERGY & COCKTAIL',
    formatCode: 'V10 BEVERAGE ENERGY & COCKTAIL (20x 150MP + 4K + WEBP)',
    icon: Wine,
    headline: 'BEVERAGE, ENERGY DRINK & COCKTAIL BAR CAMPAIGNS',
    subheadline: 'HIGH-SPEED LIQUID SPLASHES, SLICED EXOTIC FRUITS, CRYSTAL GLASSWARE, SCULPTED ICE CUBES & DARK-STUDIO HERO BACKGROUNDS WITH CLEAN NEGATIVE SPACE FOR CANS & BOTTLES.'
  },
  {
    id: 'obsidian_aurum',
    label: 'OBSIDIAN AURUM (GOLD)',
    shortLabel: 'OBSIDIAN AURUM',
    formatCode: 'V10 OBSIDIAN AURUM GOLD (21:9 + 16:9 + WEBP)',
    icon: Sun,
    headline: 'OBSIDIAN AURUM — 24K GOLD & AMBER WEB HERO BACKGROUNDS',
    subheadline: 'DARK-MODE LIQUID-OBSIDIAN WAVES & GOLD-COATED OPTICAL GLASS FINS WITH CLEAN LEFT THIRD FOR WEALTH MANAGEMENT, REAL ESTATE, AVIATION & LUXURY HEADLINES (21:9 & 16:9).'
  },
  {
    id: 'obsidian_cryo',
    label: 'OBSIDIAN CRYO (CYAN)',
    shortLabel: 'OBSIDIAN CRYO',
    formatCode: 'V10 OBSIDIAN CRYO CYAN (21:9 + 16:9 + WEBP)',
    icon: Snowflake,
    headline: 'OBSIDIAN CRYO — CRYO-CYAN & PLATINUM SAAS HERO BACKGROUNDS',
    subheadline: 'ENTERPRISE SAAS, AI PLATFORM, CLOUD & CYBERSECURITY DARK-MODE HERO BACKGROUNDS WITH DIELECTRIC CRYO-CYAN & PLATINUM-SILVER CAUSTICS AND CLEAN LEFT THIRD.'
  },
  {
    id: 'obsidian_emerald',
    label: 'OBSIDIAN EMERALD',
    shortLabel: 'OBSIDIAN EMERALD',
    formatCode: 'V10 OBSIDIAN EMERALD TEAL (21:9 + 16:9 + WEBP)',
    icon: Gem,
    headline: 'OBSIDIAN OPTICS — EMERALD, TEAL & VIOLET WEB HEROES',
    subheadline: 'FLAGSHIP FINTECH, WEB3 & LUXURY TECH DARK-MODE HERO BACKGROUNDS WITH DICHROIC EMERALD, TEAL & DEEP VIOLET SPECTRAL REFLECTIONS AND CLEAN LEFT THIRD.'
  },
  {
    id: 'obsidian_ruby',
    label: 'OBSIDIAN RUBY',
    shortLabel: 'OBSIDIAN RUBY',
    formatCode: 'V10 OBSIDIAN RUBY COPPER (21:9 + 16:9 + WEBP)',
    icon: Flame,
    headline: 'OBSIDIAN RUBY — CRIMSON RUBY & ROSE-COPPER WEB HEROES',
    subheadline: 'HIGH-TICKET SUPERCAR, SOVEREIGN HOROLOGY & HAUTE PERFUMERY DARK-MODE HERO BACKGROUNDS WITH RUBY-DICHROIC & ROSE-COPPER REFLECTIONS AND CLEAN LEFT THIRD.'
  },
  {
    id: 'luxury_goods',
    label: 'LUXURY GOODS & JEWELRY',
    shortLabel: 'LUXURY GOODS',
    formatCode: 'V10 LUXURY GOODS (20x 150MP + 4K + WEBP)',
    icon: Diamond,
    headline: 'LUXURY GOODS, FINE JEWELRY, DIAMONDS & PERFUMES',
    subheadline: 'BLANK-LABEL HIGH-JEWELRY DIAMONDS, FRAGRANCE FLACONS, LEATHER HANDBAGS & EYEWEAR. ZERO LOGOS—READY FOR INSTANT BRAND COMPOSITING & BILLBOARD PRINT.'
  },
  {
    id: 'beauty',
    label: 'BEAUTY & SKINCARE',
    shortLabel: 'BEAUTY & SKINCARE',
    formatCode: 'V10 BEAUTY & SKINCARE (20x 150MP + 4K + WEBP)',
    icon: Sparkles,
    headline: 'BEAUTY, SKINCARE & COSMETIC CAMPAIGN PHOTOGRAPHY',
    subheadline: '100% IP-SAFE UNBRANDED SERUM BOTTLES, CREAM JARS, SPA VANITY SETUPS & WATER-DEW SKINCARE CAMPAIGNS WITH ZERO LABELS, ZERO LOGOS & ZERO MEDICAL CLAIMS.'
  },
  {
    id: 'aviation_yachts',
    label: 'JETS & YACHTS',
    shortLabel: 'JETS & YACHTS',
    formatCode: 'V10 JETS & YACHTS (20x 150MP + 4K + WEBP)',
    icon: Compass,
    headline: 'PRIVATE JETS, SUPERYACHTS & CHARTER AVIATION',
    subheadline: 'BESPOKE PRIVATE JET CABINS, SUPERYACHT DECKS & ULTRA-LUXURY CHARTER EXTERIORS ENGINEERED FOR AVIATION & MARITIME BROKERS.'
  },
  {
    id: 'gastronomy',
    label: 'MICHELIN FOOD',
    shortLabel: 'MICHELIN FOOD',
    formatCode: 'V10 MICHELIN GASTRONOMY (20x 150MP + 4K + WEBP)',
    icon: Utensils,
    headline: 'MICHELIN FOOD, DECORATED PLATING & FINE DINING',
    subheadline: 'DECORATED FINE-DINING PLATING, COMPLEMENTARY SIDES, LINEN-NAPKIN CUTLERY & LABEL-FREE BEVERAGE PAIRINGS IN 150MP MASTER PRINT, 4K UHD & WEBP FORMATS.'
  },
  {
    id: 'cinematic',
    label: 'CINEMATIC & LEGACY',
    shortLabel: 'CINEMATIC & LEGACY',
    formatCode: 'V10 CINEMATIC & WORLD (20x 150MP + 4K + WEBP)',
    icon: Crown,
    headline: 'CINEMATIC & LEGACY REALMS, ARCHITECTURE & KEY ART',
    subheadline: 'HIGH-IMPACT KEY ART, HISTORICAL MONUMENTS & MULTI-RATIO PRODUCTION BUNDLES FOR FILM STUDIOS, PUBLISHERS & GAME DEVELOPERS.'
  }
];

// ============================================================================
// STANDARDIZOVANI OPISI ZA STANDARD CAMPAIGN PACK (20 SCENA) I EXECUTIVE AGENCY BUNDLE (45 SCENA)
// ============================================================================
const buildUnifiedDescription = (formatCode, isAgency45 = false) => {
  const count = isAgency45 ? 45 : 20;
  const totalFiles = count * 3;
  const code = (formatCode || '').toUpperCase();

  if (code.includes('OBSIDIAN AURUM')) {
    return `OBSIDIAN AURUM (24K GOLD & AMBER) WEB HERO DELIVERY: ${count} UNIQUE DARK-MODE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER JPG + ${count}× 21:9/16:9 4K UHD JPG + ${count}× OPTIMIZED WEBP).
- Calm, low-contrast dark Left Third engineered specifically for Wealth Management, Real Estate, Private Aviation & Haute Gastronomie website headlines and CTA buttons.
- Glossy liquid-obsidian waves intersected by 24k gold-coated optical glass fins (ARRI Alexa 65 × Panavision Primo 70 50mm physics, Snell's law caustics, cleaned EXIF, zero text, zero watermarks).`;
  }

  if (code.includes('OBSIDIAN CRYO')) {
    return `OBSIDIAN CRYO (CRYO-CYAN & PLATINUM) SAAS HERO DELIVERY: ${count} UNIQUE DARK-MODE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER JPG + ${count}× 21:9/16:9 4K UHD JPG + ${count}× OPTIMIZED WEBP).
- Calm, low-contrast dark Left Third engineered specifically for AI Platforms, Modern SaaS, Cloud Infrastructure & Cybersecurity website headlines and CTA buttons.
- Glossy liquid-obsidian waves intersected by dielectric optical glass fins with cryo-cyan, glacial cobalt & platinum-silver reflections (ARRI Alexa 65 × Primo 70 50mm, cleaned EXIF, zero watermarks).`;
  }

  if (code.includes('OBSIDIAN EMERALD')) {
    return `OBSIDIAN OPTICS (EMERALD, TEAL & DEEP VIOLET) WEB HERO DELIVERY: ${count} UNIQUE DARK-MODE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER JPG + ${count}× 21:9/16:9 4K UHD JPG + ${count}× OPTIMIZED WEBP).
- Calm, low-contrast dark Left Third engineered specifically for Fintech, Web3, AI Systems & Luxury Tech flagship hero sections.
- Glossy liquid-obsidian waves intersected by dichroic optical glass fins with muted emerald, teal & deep violet spectral traces (ARRI Alexa 65 × Primo 70 50mm, cleaned EXIF, zero text).`;
  }

  if (code.includes('OBSIDIAN RUBY')) {
    return `OBSIDIAN RUBY (CRIMSON RUBY & ROSE-COPPER) WEB HERO DELIVERY: ${count} UNIQUE DARK-MODE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER JPG + ${count}× 21:9/16:9 4K UHD JPG + ${count}× OPTIMIZED WEBP).
- Calm, low-contrast dark Left Third engineered specifically for Exotic Supercars, Sovereign Horology, Haute Perfumery & Executive Landing Pages.
- Glossy liquid-obsidian waves intersected by ruby-dichroic optical glass fins with cardinal crimson, deep garnet & warm rose-copper reflections (ARRI Alexa 65 × Primo 70 50mm, cleaned EXIF).`;
  }

  if (code.includes('EXOTIC AUTO')) {
    return `V10 EXOTIC AUTO & CARBON DELIVERY: ${count} UNIQUE AUTOMOTIVE DETAIL SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- 100% IP-Safe, Unbranded Luxury Automotive Photography: Forged Carbon Weaves, Ceramic Brakes, Flush Unembossed Alloy Rims, Smoked Headlight Optics & Stitched Leather Interiors (Zero logos, zero badges, zero license plates, zero watermarks).
- Phase One XF IQ4 150MP Macro optical physics with polarizer-controlled paint reflections, sRGB ICC color profile, and stripped EXIF metadata.`;
  }

  if (code.includes('BEVERAGE')) {
    return `V10 BEVERAGE, ENERGY DRINK & COCKTAIL BAR DELIVERY: ${count} UNIQUE HIGH-SPEED SPLASH & GLASSWARE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- High-speed frozen liquid splashes, fresh fruit dynamics, crystal glassware & sculpted ice cubes with clean negative space for bottle/can compositing and bar menus.
- 100% IP-Safe, Unbranded Commercial Assets (Zero logos, zero labels, zero watermarks, stripped EXIF, sRGB ICC color profile).`;
  }

  if (code.includes('LUXURY INTERIORS')) {
    return `V10 LUXURY INTERIOR DESIGN DELIVERY: ${count} UNIQUE ARCHITECTURAL SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- 100% IP-Safe, Unbranded Designer Living Rooms, Marble Kitchens, Dining Suites, Private Libraries, Master Bedrooms, Dressing Rooms & Executive Offices (Zero humans, zero text, zero logos).
- Phase One XF IQ4 150MP & Hasselblad X2D Tilt-Shift architectural optics with ARRI LogC4 window highlight rolloff, sRGB ICC profile, and stripped EXIF metadata.`;
  }

  if (code.includes('LUXURY TECH')) {
    return `V10 LUXURY TECH & AI HARDWARE DELIVERY: ${count} UNIQUE PRODUCT SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- 100% IP-Safe, Unbranded Black-Titanium AI Core Modules, Smart-Home Hubs, Cybersecurity Hardware Vaults, Optical Sensors & Levitating Launch Objects (Zero clones, zero UI text, zero logos).
- Phase One IQ4 150MP 120mm Macro optics with anisotropic brushed-metal reflections, sapphire caustics, clean SaaS hero negative space, and stripped EXIF metadata.`;
  }

  if (code.includes('WATCHES & HOROLOGY')) {
    return `V10 LUXURY WATCH & HAUTE HORLOGERIE DELIVERY: ${count} UNIQUE HOROLOGY SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- 100% IP-Safe, Fictional Unbranded Mechanical Timepieces, Exposed Skeleton Calibres, Tourbillon-Inspired Cages, Sapphire Dials & Collector Displays (Zero dial text, zero numbers, zero brand shapes).
- Shot-matched Phase One IQ4 150MP × Schneider Kreuznach 120mm Macro LS optics with ruby jewel-bearing caustics, sRGB ICC color profile, and stripped EXIF metadata.`;
  }

  const labelMap = {
    'V10 LUXURY GOODS (20x 150MP + 4K + WEBP)': 'LUXURY GOODS, JEWELRY & PERFUMES',
    'V10 BEAUTY & SKINCARE (20x 150MP + 4K + WEBP)': 'BEAUTY & SKINCARE',
    'V10 JETS & YACHTS (20x 150MP + 4K + WEBP)': 'PRIVATE JETS & SUPERYACHTS',
    'V10 MICHELIN GASTRONOMY (20x 150MP + 4K + WEBP)': 'MICHELIN FOOD & FINE DINING',
    'V10 CINEMATIC & WORLD (20x 150MP + 4K + WEBP)': 'CINEMATIC & LEGACY'
  };

  const nicheTitle = labelMap[formatCode] || 'COMMERCIAL CAMPAIGN';

  return `UNIFIED ${nicheTitle} DELIVERY: ${count} UNIQUE SCENES (${totalFiles} PRODUCTION FILES: ${count}× 150MP MASTER PRINT JPG + ${count}× 4K UHD JPG + ${count}× WEB-READY WEBP).
- 100% IP-Safe, Unbranded & Blank-Label Commercial Photography (Zero logos, zero readable text, zero trademarks, zero watermarks).
- Phase One XF IQ4 150MP & Leica medium-format optical aesthetics with natural highlight rolloff, sRGB ICC color profile, and stripped EXIF metadata.
- Organized into 3 clean ZIP folders (01_Master_Resolution_JPG, 02_4K_UHD_JPG, 03_Web_Ready_WEBP) + Commercial License included.`;
};

const detectIndustry = (paket) => {
  const fmt = (paket.format || '').toUpperCase();
  const text = `${paket.format || ''} ${paket.kategorijaEn || ''} ${paket.nazivEn || ''} ${paket.opisEn || ''}`.toUpperCase();

  if (fmt.includes('OBSIDIAN AURUM') || text.includes('AURUM') || (text.includes('OBSIDIAN') && text.includes('24K GOLD'))) return 'obsidian_aurum';
  if (fmt.includes('OBSIDIAN CRYO') || text.includes('CRYO') || text.includes('CRYO-CYAN')) return 'obsidian_cryo';
  if (fmt.includes('OBSIDIAN EMERALD') || (text.includes('OBSIDIAN') && (text.includes('EMERALD') || text.includes('DICHROIC') || text.includes('OPTICS')))) return 'obsidian_emerald';
  if (fmt.includes('OBSIDIAN RUBY') || (text.includes('OBSIDIAN') && (text.includes('RUBY') || text.includes('ROSE-COPPER') || text.includes('CRIMSON')))) return 'obsidian_ruby';
  if (fmt.includes('EXOTIC AUTO') || text.includes('EXOTIC AUTO') || text.includes('AUTOMOTIVE') || text.includes('CARBON') || text.includes('BRAKE') || text.includes('HEADLIGHT')) return 'exotic_auto';
  if (fmt.includes('BEVERAGE') || text.includes('BEVERAGE') || text.includes('ENERGY DRINK') || text.includes('COCKTAIL') || text.includes('SPLASH') || text.includes('GLASSWARE') || text.includes('MOCKTAIL') || text.includes('PINEAPPLE')) return 'beverage_cocktail';
  if (fmt.includes('LUXURY INTERIORS') || text.includes('INTERIOR') || text.includes('LIVING ROOM') || text.includes('PENTHOUSE') || text.includes('KITCHEN') || text.includes('WARDROBE') || text.includes('LIBRARY')) return 'luxury_interiors';
  if (fmt.includes('LUXURY TECH') || text.includes('TECH PRODUCT') || text.includes('AI HARDWARE') || text.includes('AI CORE') || text.includes('CYBERSECURITY') || text.includes('SMART-HOME')) return 'luxury_tech';
  if (fmt.includes('WATCHES & HOROLOGY') || text.includes('WATCH') || text.includes('HOROLOG') || text.includes('TOURBILLON') || text.includes('CALIBRE') || text.includes('TIMEPIECE') || text.includes('SAT')) return 'watches_horology';
  if (text.includes('LUXURY GOODS') || text.includes('JEWEL') || text.includes('DIAMOND') || text.includes('PERFUME') || text.includes('PARFEM') || text.includes('FRAGRANCE') || text.includes('BAG') || text.includes('TORB') || text.includes('EYEWEAR') || text.includes('RING') || text.includes('NECKLACE')) return 'luxury_goods';
  if (text.includes('BEAUTY') || text.includes('SKINCARE') || text.includes('MAKEUP') || text.includes('SERUM') || text.includes('COSMETIC') || text.includes('SPA') || text.includes('SKIN') || text.includes('LIP')) return 'beauty';
  if (text.includes('JET') || text.includes('YACHT') || text.includes('AVIATION') || text.includes('CABIN') || text.includes('SUPERCAR')) return 'aviation_yachts';
  if (text.includes('MICHELIN') || text.includes('GASTRONOM') || text.includes('FOOD') || text.includes('CULINARY') || text.includes('RESTAURANT') || text.includes('CHEF') || text.includes('DISH')) return 'gastronomy';
  return 'cinematic';
};

// Određuje da li kartica prikazuje 20 preview sličica (45-scena Agency Bundle) ili 10 (20-scena Standard Pack)
const getPaketPreviewSlotCount = (paket) => {
  if (paket?.previewSlotCount === 20) return 20;
  if ((paket?.primeri?.length || 0) > 10) return 20;
  const priceNum = parseFloat(paket?.cena || '0');
  const volText = `${paket?.volume || ''} ${paket?.nazivEn || ''} ${paket?.volTitle || ''}`.toUpperCase();
  if (priceNum >= 349 || volText.includes('45X') || volText.includes('45 ') || volText.includes('80X') || volText.includes('AGENCY BUNDLE') || volText.includes('MASTER BUNDLE')) {
    return 20;
  }
  return 10;
};

const isObsidianFormat = (fmtOrId = '') => {
  const s = fmtOrId.toUpperCase();
  return s.includes('OBSIDIAN') || s.includes('21:9');
};

// Automatski proračun veće (Global Enterprise) cene i za nove i za već objavljene pakete u bazi
const computeDefaultEnterprisePrice = (standardCena) => {
  const base = parseFloat(standardCena);
  if (isNaN(base) || base <= 0) return '0.00';
  if (Math.round(base) === 149) return '299.00';
  if (Math.round(base) === 499) return '890.00';
  if (Math.round(base) === 99) return '199.00';
  if (Math.round(base) === 399) return '690.00';
  return Math.round(base * 1.95).toFixed(2);
};

// ============================================================================
// 📜 CENTRALNA FUNKCIJA (3 LINIJE LOGIKE) ZA ODREĐIVANJE STOCK PHOTOS LICENCE
// ============================================================================
const resolveStockLicenseMeta = (licenseTier = 'standard') => {
  const isEnt = licenseTier === 'enterprise';
  const licenseTitle = isEnt ? 'GLOBAL ENTERPRISE LICENSE' : 'STANDARD COMMERCIAL LICENSE';
  const licensePdf = isEnt ? '/PREMIUM ENTERPRISE LICENSE.pdf' : '/V8_COMMERCIAL_LICENSE.pdf';
  return { isEnt, licenseTitle, licensePdf };
};

const V8StockBerzaBase = () => {
  const navigate = useNavigate();
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Čuva izabranu licencu po svakoj kartici ('standard' = manja cena | 'enterprise' = veća cena)
  const [selectedLicenses, setSelectedLicenses] = useState({});

  // 🔒 NE DRŽIMO zipLink U CHECKOUT STATE-u KAKO KLIJENT NE BI MOGAO DA DOĐE DO NJEGA PRE FIREBASE POTVRDE!
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
    price: 0
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]);
  const [editingPaketId, setEditingPaketId] = useState(null);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('v10_luxury_industry_tab');
    return INDUSTRY_TABS.some(t => t.id === saved) ? saved : 'all';
  });

  useEffect(() => {
    localStorage.setItem('v10_luxury_industry_tab', activeTab);
    trackV8Action('tab_view', { event_category: 'Luxury_Store_Dark', event_label: activeTab });
  }, [activeTab]);

  // Lead Magnet State
  const [sampleEmail, setSampleEmail] = useState('');
  const [sampleUnlocked, setSampleUnlocked] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [customSampleUrl, setCustomSampleUrl] = useState('');
  const [adminSampleInput, setAdminSampleInput] = useState('');

  const [showTechSpecs, setShowTechSpecs] = useState(false);

  // 🔒 Čuva isključivo pakete i licence za koje je Firebase vratio isPaid === true!
  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  const [kupljeneLicencePoPaketu, setKupljeneLicencePoPaketu] = useState({});
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  // Admin Forma State:
  // 1. Standard Campaign Pack -> 20 scena (Standard Commercial: $149.00 | Global Enterprise: $299.00)
  // 2. Executive Agency Bundle -> 45 scena (Standard Commercial: $499.00 | Global Enterprise: $890.00)
  const [paketTier, setPaketTier] = useState('standard');
  const [adminSlotLimit, setAdminSlotLimit] = useState(10);
  const [noviVolNaslov, setNoviVolNaslov] = useState('VOL. 01');
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('20x 150MP + 20x 4K + 20x WEBP');
  const [noviFormat, setNoviFormat] = useState('V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('149.00');
  const [novaEnterpriseCena, setNovaEnterpriseCena] = useState('299.00');
  const [noviTip] = useState('Image');
  const [noviOpisEn, setNoviOpisEn] = useState(() => buildUnifiedDescription('V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)', false));
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [isFree, setIsFree] = useState(false);

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com");
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setKupljeniPaketiIds([]);
        setKupljeneLicencePoPaketu({});
      }
    });

    const q = query(collection(db, "v8_stock_paketi"));
    const unsubPaketi = onSnapshot(q, (snap) => {
      let ucitani = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      ucitani.sort((a, b) => {
        const getMs = (dateObj) => {
          if (!dateObj) return 0;
          if (dateObj.toMillis) return dateObj.toMillis();
          if (dateObj.seconds) return dateObj.seconds * 1000;
          return new Date(dateObj).getTime() || 0;
        };
        const timeA = getMs(a.createdAt) || getMs(a.updatedAt) || 0;
        const timeB = getMs(b.createdAt) || getMs(b.updatedAt) || 0;
        return timeB - timeA;
      });
      setPaketi(ucitani);
    }, (error) => {
      console.error("🚨 [V8 SYSTEM] Firestore onSnapshot Error:", error);
    });

    getDoc(doc(db, "v8_settings", "free_sample_config")).then((snap) => {
      if (snap.exists() && snap.data().sampleZipUrl) {
        setCustomSampleUrl(snap.data().sampleZipUrl);
        setAdminSampleInput(snap.data().sampleZipUrl);
      }
    }).catch(() => {});

    return () => {
      unsubAuth();
      unsubPaketi();
    };
  }, []);

  // ============================================================================
  // 🔒 FIREBASE REAL-TIME PROVERA PLAĆENIH PAKETA (SAMO GDE JE isPaid === true)
  // ============================================================================
  useEffect(() => {
    if (!currentUser) {
      setPaidPayoneer([]); setPaidCrypto([]); setPaidPaypal([]); return;
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

    const qPayoneer = query(collection(db, "v8_payoneer_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => setPaidPayoneer(extractPaidItems(snap)));

    const qCrypto = query(collection(db, "v8_crypto_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => setPaidCrypto(extractPaidItems(snap)));

    const qPaypal = query(collection(db, "v8_paypal_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => setPaidPaypal(extractPaidItems(snap)));

    return () => { unsubPayoneer(); unsubCrypto(); unsubPaypal(); };
  }, [currentUser]);

  useEffect(() => {
    const merged = [...paidPayoneer, ...paidCrypto, ...paidPaypal];
    const ids = Array.from(new Set(merged.map(x => x.paketId)));
    const licMap = {};
    merged.forEach(x => {
      if (x.tier === 'enterprise' || !licMap[x.paketId]) {
        licMap[x.paketId] = x.tier;
      }
    });
    setKupljeniPaketiIds(ids);
    setKupljeneLicencePoPaketu(licMap);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  useEffect(() => {
    if (editingPaketId) return;
    const foundTab = INDUSTRY_TABS.find(t => t.id === activeTab);
    if (foundTab && activeTab !== 'all') {
      const isAgency45 = paketTier === 'master';
      setNoviFormat(foundTab.formatCode);
      setNoviVolume(
        isObsidianFormat(foundTab.formatCode)
          ? (isAgency45 ? '45x 21:9 + 45x 16:9 + 45x WEBP' : '20x 21:9 + 20x 16:9 + 20x WEBP')
          : (isAgency45 ? '45x 150MP + 45x 4K + 45x WEBP' : '20x 150MP + 20x 4K + 20x WEBP')
      );
      setNoviOpisEn(buildUnifiedDescription(foundTab.formatCode, isAgency45));
    }
  }, [activeTab, editingPaketId, paketTier]);

  const handleSelectTierPreset = (tier) => {
    setPaketTier(tier);
    setIsFree(false);
    if (tier === 'master') {
      setNovaCena('499.00');
      setNovaEnterpriseCena('890.00');
      setAdminSlotLimit(20);
      setNoviVolNaslov('AGENCY BUNDLE');
      setNoviVolume(
        isObsidianFormat(noviFormat)
          ? '45x 21:9 + 45x 16:9 + 45x WEBP'
          : '45x 150MP + 45x 4K + 45x WEBP'
      );
      setNoviOpisEn(buildUnifiedDescription(noviFormat, true));
    } else {
      setNovaCena('149.00');
      setNovaEnterpriseCena('299.00');
      setAdminSlotLimit(10);
      if (noviVolNaslov === 'AGENCY BUNDLE' || noviVolNaslov === 'MASTER BUNDLE') setNoviVolNaslov('VOL. 01');
      setNoviVolume(
        isObsidianFormat(noviFormat)
          ? '20x 21:9 + 20x 16:9 + 20x WEBP'
          : '20x 150MP + 20x 4K + 20x WEBP'
      );
      setNoviOpisEn(buildUnifiedDescription(noviFormat, false));
    }
  };

  const handleFormatRadioChange = (fmt) => {
    setNoviFormat(fmt);
    if (!editingPaketId) {
      const isAgency45 = paketTier === 'master';
      setNoviVolume(
        isObsidianFormat(fmt)
          ? (isAgency45 ? '45x 21:9 + 45x 16:9 + 45x WEBP' : '20x 21:9 + 20x 16:9 + 20x WEBP')
          : (isAgency45 ? '45x 150MP + 45x 4K + 45x WEBP' : '20x 150MP + 20x 4K + 20x WEBP')
      );
      setNoviOpisEn(buildUnifiedDescription(fmt, isAgency45));
    }
  };

  const getStandardCena = (paket) => {
    const numCena = parseFloat(paket?.cena);
    return isNaN(numCena) ? "0.00" : numCena.toFixed(2);
  };

  const getEnterpriseCena = (paket) => {
    if (paket?.isFree || parseFloat(paket?.cena) === 0) return "0.00";
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
    const baseTitle = paket.nazivEn || 'Luxury Campaign Vault';
    const vol = (paket.volTitle || '').trim();
    if (!vol) return baseTitle;
    if (baseTitle.toUpperCase().includes(vol.toUpperCase())) return baseTitle;
    return `${vol} — ${baseTitle}`;
  };

  const handleSaveSampleConfig = async () => {
    try {
      await setDoc(doc(db, "v8_settings", "free_sample_config"), {
        sampleZipUrl: adminSampleInput.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setCustomSampleUrl(adminSampleInput.trim());
      if (typeof v8Toast !== 'undefined') v8Toast.success("✅ Free 150MP Sample Link Saved!");
    } catch (err) {
      alert("Error saving sample link: " + err.message);
    }
  };

  const handleUnlockFreeSample = async (e) => {
    e.preventDefault();
    if (!sampleEmail.trim()) return;
    setIsSubmittingLead(true);

    try {
      await addDoc(collection(db, "v8_b2b_sample_leads"), {
        email: sampleEmail.trim().toLowerCase(),
        activeIndustry: activeTab,
        createdAt: serverTimestamp()
      });
      trackV8Action('b2b_sample_lead_captured', { industry: activeTab });
      setSampleUnlocked(true);
      if (typeof v8Toast !== 'undefined') v8Toast.success("🔓 150MP + WebP Master Sample Unlocked!");

      const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
      const targetDownload = customSampleUrl || fallbackFreePkg?.zipLink || '/VISIONARY_V10_ZIP_VALIDATION.txt';
      window.open(targetDownload, '_blank');
    } catch (err) {
      console.error(err);
      setSampleUnlocked(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  // Otvara Checkout BEZ prosleđivanja zipLink-a klijentu!
  const otvoriCheckoutIliPaddle = async (user, paket, licenseTier = 'standard') => {
    if (!user || !paket) return;
    const { isEnt, licenseTitle } = resolveStockLicenseMeta(licenseTier);
    const displayTitle = formatPaketDisplayTitle(paket);
    const baseFull = paket.volume ? `${displayTitle} (${paket.volume})` : displayTitle;
    const fullName = `${baseFull} — [${licenseTitle}]`;
    const finalPrice = isEnt ? getEnterpriseCena(paket) : getStandardCena(paket);

    if (paket.paddleLink && paket.paddleLink.trim() !== "") {
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

  const prijavaIKupovina = async (paket, licenseTier = 'standard') => {
    const displayTitle = formatPaketDisplayTitle(paket);

    // Besplatan paket ($0.00)
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
      trackV8Action('free_asset_download', { asset_name: displayTitle });
      if (typeof v8Toast !== 'undefined') v8Toast.success("🚀 ACCESS GRANTED: Downloading Free 150MP Sample...");
      window.open(paket.zipLink, '_blank');
      return;
    }

    // Paket za koji je Firebase VEĆ potvrdio isPaid === true
    if (kupljeniPaketiIds.includes(paket.id)) {
      trackV8Action('owned_asset_download', { asset_name: displayTitle });
      window.open(paket.zipLink, '_blank');
      return;
    }

    const { isEnt, licenseTitle } = resolveStockLicenseMeta(licenseTier);
    const baseFull = paket.volume ? `${displayTitle} (${paket.volume})` : displayTitle;
    const fullName = `${baseFull} — [${licenseTitle}]`;
    const finalPrice = isEnt ? getEnterpriseCena(paket) : getStandardCena(paket);
    const userNow = currentUser || auth.currentUser;

    trackV8Action('checkout_initiated', {
      event_category: 'B2B_Sales',
      item_name: fullName,
      license_tier: licenseTitle,
      value: Number(finalPrice),
      currency: 'USD'
    });

    if (userNow) {
      await otvoriCheckoutIliPaddle(userNow, paket, licenseTier);
      return;
    }
    setLoginRequiredData({ isOpen: true, paket, licenseTier, name: fullName, price: finalPrice });
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
      v8Toast.error("Upload error!");
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
      v8Toast.error("Main Cover Image & Google Drive ZIP link are required!");
      return;
    }

    const paketData = {
      volTitle: noviVolNaslov.trim(),
      nazivEn: noviNazivEn.trim(),
      volume: noviVolume.trim() || '20x 150MP + 20x 4K + 20x WEBP',
      format: noviFormat,
      kategorijaEn: novaKategorijaEn.trim(),
      cena: isFree ? "0.00" : novaCena,
      cenaEnterprise: isFree ? "0.00" : (novaEnterpriseCena || computeDefaultEnterprisePrice(novaCena)),
      tip: noviTip,
      opisEn: noviOpisEn,
      previewUrl,
      zipLink,
      isFree,
      previewSlotCount: adminSlotLimit,
      primeri: primeriUrls.slice(0, adminSlotLimit),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingPaketId) {
        await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData);
        v8Toast.success("Campaign Package Updated!");
      } else {
        await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() });
        v8Toast.success("New Campaign Package Published!");
      }
      stoziEdit();
    } catch (error) {
      v8Toast.error(error.message);
    }
  };

  const startEditPaket = (paket) => {
    const detectedSlots = getPaketPreviewSlotCount(paket);
    setEditingPaketId(paket.id);
    setAdminSlotLimit(detectedSlots);
    setPaketTier(detectedSlots === 20 ? 'master' : 'standard');
    setNoviVolNaslov(paket.volTitle || 'VOL. 01');
    setNoviNazivEn(paket.nazivEn || '');
    setNoviVolume(paket.volume || '20x 150MP + 20x 4K + 20x WEBP');
    setNoviFormat(paket.format || 'V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)');
    setNovaKategorijaEn(paket.kategorijaEn || '');
    setNovaCena(paket.cena || '149.00');
    setNovaEnterpriseCena(paket.cenaEnterprise || computeDefaultEnterprisePrice(paket.cena || '149.00'));
    setNoviOpisEn(paket.opisEn || buildUnifiedDescription(paket.format || 'V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)', detectedSlots === 20));
    setPreviewUrl(paket.previewUrl || '');
    setZipLink(paket.zipLink || '');
    setIsFree(paket.isFree || false);
    setPrimeriUrls(paket.primeri || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stoziEdit = () => {
    setEditingPaketId(null);
    setPaketTier('standard');
    setAdminSlotLimit(10);
    setNoviVolNaslov('VOL. 01');
    setNoviNazivEn('');
    setNoviVolume('20x 150MP + 20x 4K + 20x WEBP');
    setNoviFormat('V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)');
    setNovaKategorijaEn('');
    setNovaCena('149.00');
    setNovaEnterpriseCena('299.00');
    setNoviOpisEn(buildUnifiedDescription('V10 LUXURY INTERIORS (20x 150MP + 4K + WEBP)', false));
    setPreviewUrl('');
    setZipLink('');
    setIsFree(false);
    setPrimeriUrls([]);
  };

  const obrisiPaket = async (id) => {
    if (window.confirm("Remove this package permanently?")) {
      await deleteDoc(doc(db, "v8_stock_paketi", id));
    }
  };

  const currentTabInfo = INDUSTRY_TABS.find(t => t.id === activeTab) || INDUSTRY_TABS[0];
  const filtriraniPaketi = activeTab === 'all'
    ? paketi
    : paketi.filter(p => detectIndustry(p) === activeTab);

  const getCountForTab = (tabId) => {
    if (tabId === 'all') return paketi.length;
    return paketi.filter(p => detectIndustry(p) === tabId).length;
  };

  const hasMasterInActiveTab = filtriraniPaketi.some(p => getPaketPreviewSlotCount(p) === 20);
  const topStripSlotCount = hasMasterInActiveTab ? 20 : 10;
  const activeTabPreviewThumbs = filtriraniPaketi
    .flatMap(p => (p.primeri && p.primeri.length > 0 ? p.primeri : p.previewUrl ? [p.previewUrl] : []))
    .slice(0, topStripSlotCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#090C12] via-[#0E131D] to-[#090C12] text-[#EAE6DF] font-sans relative pb-28">
      <Helmet>
        <title>Luxury Commercial 150MP + 4K + WebP Campaign Archive | AI Tools Pro Smart</title>
        <meta
          name="description"
          content="100% IP-safe commercial 150MP print, 4K UHD & WebP visual packages with Standard Commercial & Global Enterprise licensing options."
        />
      </Helmet>

      <div className="relative z-10 pt-28 px-4 sm:px-6 max-w-[1600px] mx-auto">

        {/* =================================================================== */}
        {/* 1. HERO SEKCIJA SA SVIM V10 I OBSIDIAN DUGMIĆIMA                    */}
        {/* =================================================================== */}
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
            {INDUSTRY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = getCountForTab(tab.id);
              const isObsidianBtn = tab.id.startsWith('obsidian_');

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-3 sm:px-4 sm:py-3 rounded-xl font-extrabold text-[10px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] text-[#0B0E14] border-[#F3E5AB] shadow-[0_10px_28px_rgba(197,160,89,0.28)] scale-[1.02]'
                      : isObsidianBtn
                      ? 'bg-[#0F1522] text-[#F3E5AB] border-[#C5A059]/35 hover:bg-[#182235] hover:border-[#F3E5AB]'
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
                    onClick={() => setFullScreenImageUrl(thumbUrl)}
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

        {/* =================================================================== */}
        {/* 2. B2B LEAD MAGNET BAR                                              */}
        {/* =================================================================== */}
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
                  onClick={() => {
                    const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
                    window.open(customSampleUrl || fallbackFreePkg?.zipLink || '/VISIONARY_V10_ZIP_VALIDATION.txt', '_blank');
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

        {/* =================================================================== */}
        {/* 3. ADMIN FORMA SA OBE CENE LICENCI (STANDARD COMMERCIAL + ENTERPRISE) */}
        {/* =================================================================== */}
        {isAdmin && (
          <form onSubmit={dodajPaket} className="bg-[#121722] border-2 border-[#C5A059]/40 rounded-[2rem] p-6 md:p-8 mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.65)] max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <h2 className="text-lg md:text-xl font-black text-[#F7F4EE] uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#C5A059]" /> {editingPaketId ? 'EDIT B2B CAMPAIGN PACKAGE' : 'PUBLISH UNIFIED V10 PACKAGE (DUAL LICENSE TIERS)'}
              </h2>
              {editingPaketId && (
                <button type="button" onClick={stoziEdit} className="text-xs font-bold uppercase px-4 py-2 bg-[#1B2232] hover:bg-[#252F45] rounded-lg text-[#F3E5AB] cursor-pointer">
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 p-3.5 bg-[#0B0E14] rounded-2xl border border-[#C5A059]/30">
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
                  <div className="text-xs font-black uppercase tracking-wider">1. Standard Campaign Pack (20 Scenes)</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${paketTier === 'standard' ? 'text-[#0B0E14]/80' : 'text-slate-400'}`}>
                    Standard Commercial: $149 • Global Enterprise: $299 • 10 Slots
                  </div>
                </div>
                <span className="text-xs font-black">$149 / $299</span>
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
                  <div className="text-xs font-black uppercase tracking-wider">2. Executive Agency Bundle (45 Scenes)</div>
                  <div className={`text-[10px] font-bold mt-0.5 ${paketTier === 'master' ? 'text-[#0B0E14]/80' : 'text-slate-400'}`}>
                    Standard Commercial: $499 • Global Enterprise: $890 • 20 Slots
                  </div>
                </div>
                <span className="text-xs font-black">$499 / $890</span>
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
                  placeholder="E.g. VOL. 01 or AGENCY BUNDLE"
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
                  placeholder="E.g. Forged Carbon & Ceramic Brakes"
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
                  placeholder="E.g. Exotic Auto / Beverage Splash"
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
                    <MonitorPlay size={14} className="text-[#C5A059]" /> SELECT TARGET B2B INDUSTRY TAB
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {INDUSTRY_TABS.filter(t => t.id !== 'all').map((t) => (
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
                    <LinkIcon size={14} className="text-[#C5A059]" /> GOOGLE DRIVE ZIP LINK (150MP JPG + 4K JPG + WEBP)
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
                      setNovaCena(next ? "0.00" : (paketTier === 'master' ? "499.00" : "149.00"));
                      setNovaEnterpriseCena(next ? "0.00" : (paketTier === 'master' ? "890.00" : "299.00"));
                    }}
                    className={`w-full p-3.5 rounded-xl font-extrabold text-xs tracking-widest uppercase border transition-all cursor-pointer ${
                      isFree
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-[#0B0E14] border-white/15 text-slate-300 hover:border-[#C5A059]'
                    }`}
                  >
                    {isFree ? "⚡ FREE LEAD-MAGNET PACKAGE ($0.00)" : "PAID DUAL-LICENSE PACKAGE"}
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
                  <Zap size={16} /> {editingPaketId ? 'SAVE UPDATES' : 'PUBLISH TO STORE'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =================================================================== */}
        {/* 4. PRODUCT CARDS (OTKLJUČAVAJU SE ISKLJUČIVO KADA FIREBASE ZABELEŽI isPaid === true) */}
        {/* =================================================================== */}
        {filtriraniPaketi.length === 0 ? (
          <div className="text-center py-20 bg-[#121722] border border-white/10 rounded-3xl mb-16 shadow-xl">
            <Aperture className="w-11 h-11 text-[#C5A059] mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase tracking-widest text-[#F7F4EE]">
              New 150MP + 4K + WebP Vaults Arriving in {currentTabInfo.shortLabel}
            </h3>
            <p className="text-xs text-slate-400 mt-2 mb-6">
              Switch to "ALL VAULTS" to browse all currently published commercial packages, or publish a new ZIP in {currentTabInfo.shortLabel} above.
            </p>
            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0E14] font-black text-xs uppercase tracking-widest rounded-xl cursor-pointer"
              >
                Show All Published Packages ({paketi.length})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {filtriraniPaketi.map((paket) => {
              const isFreePkg = paket.isFree || parseFloat(paket.cena) === 0;
              const isPaidInFirebase = kupljeniPaketiIds?.includes(paket.id);
              const isOwned = isPaidInFirebase || isFreePkg;

              const detectedId = detectIndustry(paket);
              const matchedTab = INDUSTRY_TABS.find(t => t.id === detectedId) || INDUSTRY_TABS[10];
              const cardSlotCount = getPaketPreviewSlotCount(paket);
              const isObsidianHero = detectedId.startsWith('obsidian_');

              // Ako je kupac već platio u Firebase-u, dajemo mu PDF licencu koju je zaista platio!
              const activeLic = isPaidInFirebase ? (kupljeneLicencePoPaketu[paket.id] || getActiveCardLicense(paket.id)) : getActiveCardLicense(paket.id);
              const { isEnt: isCardEnt, licensePdf: activeLicensePdf } = resolveStockLicenseMeta(activeLic);
              const stdPrice = getStandardCena(paket);
              const entPrice = getEnterpriseCena(paket);
              const displayedPrice = isFreePkg ? '0.00' : (isCardEnt ? entPrice : stdPrice);

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
                        {paket.volume || '20× 150MP + 20× 4K + 20× WEBP'}
                      </span>
                      <span className="bg-[#182030]/90 backdrop-blur-md border border-[#C5A059]/50 text-[#F3E5AB] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                        {paket.kategorijaEn || matchedTab.shortLabel}
                      </span>
                    </div>

                    <div className="absolute top-7 right-7 z-20">
                      <span className="bg-[#0B0E14]/90 backdrop-blur-md border border-[#C5A059]/60 text-[#F3E5AB] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {isObsidianHero ? '21:9 + 16:9 + WEBP' : '150MP + 4K + WEBP'}
                      </span>
                    </div>

                    <div
                      onClick={() => setFullScreenImageUrl(paket.previewUrl)}
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
                            onClick={() => setFullScreenImageUrl(thumb)}
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
                          {isObsidianHero ? '21:9 + 16:9 + WebP Ready' : '150MP Print + 4K + WebP'}
                        </span>
                      </div>
                      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                          Zero Logos • 100% IP-Safe
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line mb-6 flex-grow font-medium">
                      {paket.opisEn || buildUnifiedDescription(paket.format || '', cardSlotCount === 20)}
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
                            if (isAdmin || isOwned) {
                              window.open(paket.zipLink, '_blank');
                            } else {
                              prijavaIKupovina(paket, activeLic);
                            }
                          }}
                          className={`flex-1 sm:flex-initial px-7 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                            !isAdmin && isOwned
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-gradient-to-r from-[#C5A059] via-[#E2C383] to-[#C5A059] hover:brightness-110 text-[#0B0E14]'
                          }`}
                        >
                          {(isAdmin || isOwned) ? (
                            <><DownloadCloud size={16} /> Download ZIP</>
                          ) : isCardEnt ? (
                            <><Crown size={15} /> Buy Enterprise License</>
                          ) : (
                            <><Diamond size={15} /> Buy Standard License</>
                          )}
                        </button>

                        {/* 🔒 DUGME ZA PREUZIMANJE PDF LICENCE VIDI SAMO ADMIN ILI KUPAC ČIJA JE UPLATA POTVRĐENA U FIREBASE-U! */}
                        {!isFreePkg && (isAdmin || isPaidInFirebase) && (
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
                          onClick={() => obrisiPaket(paket.id)}
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

        {/* =================================================================== */}
        {/* 5. SKLOPLJEN TEHNIČKI SERTIFIKAT NA DNU                             */}
        {/* =================================================================== */}
        <div className="max-w-5xl mx-auto border border-[#C5A059]/30 bg-[#121722] rounded-3xl overflow-hidden shadow-xl">
          <button
            type="button"
            onClick={() => setShowTechSpecs(!showTechSpecs)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#171E2C] transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C5A059] block">
                V10 Master Engine • Unified Packaging &amp; Dual B2B Licensing
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
                Every ZIP bundle (20-Scene Standard Pack or 45-Scene Executive Agency Bundle) is structured into 3 production folders: <code className="text-[#F3E5AB]">01_Master_Resolution_JPG</code> (150MP print), <code className="text-[#F3E5AB]">02_4K_UHD_JPG</code>, and <code className="text-[#F3E5AB]">03_Web_Ready_WEBP</code>.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10">
                <strong className="text-[#F3E5AB] uppercase block mb-1">2. 100% IP-Safe &amp; Unbranded Cleanliness</strong>
                Zero third-party logos, zero readable text, zero identifiable celebrity likenesses, and stripped EXIF metadata—ready for corporate legal approval.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10">
                <strong className="text-[#F3E5AB] uppercase block mb-1">3. Phase One 150MP + ARRI Alexa 65 Optics</strong>
                Engineered with medium-format Tilt-Shift &amp; Macro optical physics, LANCZOS scaling, and ARRI LogC4 highlight rolloff protection.
              </div>
              <div className="p-4 bg-[#0B0E14] rounded-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <strong className="text-[#F3E5AB] uppercase block mb-1">4. Verified Ledger Delivery</strong>
                  Official PDF License Certificates (Standard Commercial or Global Enterprise) and Master ZIP archives unlock automatically once payment is recorded and verified in our Firebase ledger.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => navigate('/stock-2')} className="text-[10px] font-extrabold uppercase px-3 py-2 bg-[#182030] border border-white/15 text-slate-300 hover:border-[#C5A059] rounded-lg transition cursor-pointer">
                    Legacy Vault →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData({ isOpen: false, paket: null, licenseTier: 'standard', name: '', price: 0 })}
        packageName={loginRequiredData.name}
        price={loginRequiredData.price}
        onLoginSuccess={async (user) => {
          if (loginRequiredData.paket) await otvoriCheckoutIliPaddle(user, loginRequiredData.paket, loginRequiredData.licenseTier);
          setLoginRequiredData({ isOpen: false, paket: null, licenseTier: 'standard', name: '', price: 0 });
        }}
      />
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
      <AnimatePresence>
        {checkoutData.isOpen && (
          <V8SecureCheckout
            isOpen={checkoutData.isOpen}
            paketId={checkoutData.paketId}
            productName={checkoutData.name}
            price={checkoutData.price}
            licenseTier={checkoutData.licenseTier}
            projectImage={checkoutData.previewUrl || "/v8-secure-blue.webp"}
            onClose={() => setCheckoutData({ isOpen: false, paketId: null, name: '', price: 0, licenseTier: 'standard', previewUrl: '' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const V8StockBerza = () => (
  <V8ErrorGuard>
    <V8StockBerzaBase />
  </V8ErrorGuard>
);

export default V8StockBerza;
// KRAJ FAJLA: src/componentsStockBerza/V8StockBerza.jsx