// ============================================================================
// POČETAK FAJLA: src/pages/PrivateAviationKit.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import {
  Compass, ShieldCheck, Aperture, ArrowUpRight, CheckCircle2,
  Crown, Layers, Sparkles, X, Plane, Anchor, Calendar, MapPin,
  DownloadCloud, Lock, FileCode, FolderArchive
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';
import { trackV8Action } from '../utils/analytics';

// Automatski pretvara svaki Cloudinary link u brzi WebP za prikaz na sajtu
const optimizeWebP = (url, width = 1600) => {
  if (!url) return '';
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('f_webp')) {
    return url.replace('/upload/', `/upload/f_webp,q_auto,w_${width}/`);
  }
  return url;
};

// ============================================================================
// 🔧 TVOJA KONFIGURACIJA (SAMO OVDE ZAMENI SVOJE CLOUDINARY I GOOGLE DRIVE LINKOVE)
// ============================================================================
const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: '/VISIONARY_V10_ZIP_VALIDATION.txt',

  heroImage: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1800&q=85',

  fleetAssets: [
    {
      id: 'jet-lounge',
      category: 'aviation',
      tag: 'Ultra-Long-Range Cabin',
      title: 'Cream Leather & Walnut Executive Lounge',
      specs: '14,000 km Range • Panoramic Oval Windows • Zero Tail Markings',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'jet-dining',
      category: 'aviation',
      tag: 'Airborne Boardroom & Dining',
      title: 'Bespoke Walnut Veneer Conference Suite',
      specs: '4-Seat Sovereign Table • Indirect Cove Lighting • 100% IP-Safe',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'jet-bedroom',
      category: 'aviation',
      tag: 'Private Sky Stateroom',
      title: 'Transcontinental Quiet Sleep Sanctuary',
      specs: 'Cashmere Textile Finish • Warm Brass Accents • Cloud Horizon',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-salon',
      category: 'maritime',
      tag: '72m Superyacht Main Deck',
      title: 'Panoramic Teak & Travertine Ocean Salon',
      specs: '270° Horizon Glass • Unbranded Custom Furniture • Sunset Glow',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-owner',
      category: 'maritime',
      tag: 'Owner’s Master Deck',
      title: 'Honed Marble & Ivory Leather Marine Suite',
      specs: 'Private Sea Terrace • Calm Morning Caustics • Zero Signage',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1400&q=85'
    },
    {
      id: 'yacht-spa',
      category: 'maritime',
      tag: 'Onboard Wellness Sanctuary',
      title: 'Bookmatched Stone & Brushed Brass Spa Bath',
      specs: 'Ocean-Level View • Architectural Precision • Print Ready',
      resolution: 'WebP + 4K UHD + 150MP Master',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85'
    }
  ]
};

const LightboxInspector = ({ imageUrl, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = imageUrl ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 bg-white hover:bg-stone-200 text-[#111111] p-3.5 rounded-full shadow-xl cursor-pointer transition"
      >
        <X size={24} />
      </button>
      <img
        src={optimizeWebP(imageUrl, 2400)}
        alt="150MP Master Preview"
        className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-white/15 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

const PrivateAviationKit = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [fleetFilter, setFleetFilter] = useState('all');
  const [zoomImage, setZoomImage] = useState(null);

  const [departure, setDeparture] = useState('Geneva (LSGG)');
  const [destination, setDestination] = useState('Monaco Heliport / Port Hercule');
  const [charterType, setCharterType] = useState('Dual Jet + Superyacht Transfer');
  const [demoSubmitted, setDemoSubmitted] = useState(false);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [loginModal, setLoginModal] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setCurrentUser(u || null));
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: 'Private_Aviation_Kit' });
    return () => unsub();
  }, []);

  const filteredAssets = fleetFilter === 'all'
    ? KIT_CONFIG.fleetAssets
    : KIT_CONFIG.fleetAssets.filter((item) => item.category === fleetFilter);

  const recordOrderIntent = async (user, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: user.displayName || 'B2B Agency Client',
        email: user.email,
        uid: user.uid,
        zeliPaket: productName,
        paketId: price === '1490.00' ? 'aviation_buyout_1490' : 'aviation_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurchaseTier = async (tier) => {
    const isBuyout = tier === 'buyout';
    const productName = isBuyout
      ? '1-of-1 Exclusive Buyout: Private Aviation & Superyacht Brand + React Kit (60 Files + 3 PSD)'
      : 'Agency License: Private Aviation & Superyacht React + 20 Scenes (WebP/4K/150MP) + 3 PSD';
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

  const scrollToLicensing = () => {
    const el = document.getElementById('b2b-licensing-vault');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141413] font-sans pb-28">
      <Helmet>
        <title>Private Jet & Superyacht Charter — Turnkey React + 150MP Brand Kit | AI Tools Pro Smart</title>
        <meta
          name="description"
          content="Turnkey React + Tailwind luxury charter website template bundled with 20 IP-safe scenes in WebP, 4K UHD, and 150MP Master Print formats plus 3 billboard PSD mockups."
        />
      </Helmet>

      {/* GORNJA B2B TRAKA ISPOD TVOG NAVBARA */}
      <div className="pt-28 px-4 sm:px-6 max-w-[1600px] mx-auto">
        <div className="bg-[#111111] text-white rounded-2xl px-5 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs">
            <span className="bg-[#D4AF37] text-[#111111] font-black uppercase tracking-widest px-2.5 py-1 rounded-md text-[10px]">
              LIVE TURNKEY DEMO
            </span>
            <span className="font-semibold text-stone-200">
              Previewing <strong>Aero & Mare Charter</strong> React Template + 20 Scenes (60 Files: WebP + 4K UHD + 150MP) + 3 PSD Mockups.
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/stock')}
              className="text-[11px] font-bold uppercase tracking-wider text-stone-300 hover:text-white cursor-pointer"
            >
              ← All Stock Vaults
            </button>
            <button
              type="button"
              onClick={scrollToLicensing}
              className="bg-white hover:bg-stone-200 text-[#111111] font-extrabold text-[11px] uppercase tracking-widest px-4 py-2 rounded-lg transition cursor-pointer"
            >
              License Kit ($349 / $1,490)
            </button>
          </div>
        </div>
      </div>

      {/* DEO 1: ŽIVA LUKSUZNA ČARTER PREZENTACIJA */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 mt-6">
        <section className="bg-white border border-stone-200/90 rounded-[2.5rem] p-6 sm:p-12 lg:p-16 shadow-[0_20px_60px_rgba(20,20,19,0.04)]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-10 border-b border-stone-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#111111] text-[#D4AF37] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black tracking-[0.25em] text-sm uppercase block text-[#111111]">
                  AERO & MARE
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6239] font-bold block">
                  Sovereign Aviation & Yachting
                </span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
              <span>Private Fleet</span>
              <span>Superyachts</span>
              <span>Empty Legs</span>
              <span>Bespoke Concierge</span>
            </div>

            <button
              type="button"
              onClick={scrollToLicensing}
              className="px-5 py-2.5 rounded-full border border-stone-300 hover:border-[#111111] text-[11px] font-extrabold uppercase tracking-widest text-[#111111] transition cursor-pointer"
            >
              24/7 Flight Desk
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E5D7C3] text-[#8C6239] text-[10px] font-extrabold uppercase tracking-[0.22em]">
                <Sparkles className="w-3.5 h-3.5" /> Zero-Wait Global Discretion
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black uppercase tracking-tight text-[#111111] leading-[1.05]">
                Seamless Horizons From Private Tarmac To Open Sea.
              </h1>

              <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-xl">
                On-demand transcontinental cabin sanctuaries and Mediterranean superyacht charters curated for principals, family offices, and executive delegations within 4 hours of notice.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDemoSubmitted(true);
                }}
                className="bg-[#F8F7F4] border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-3"
              >
                <div className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#8C6239]">
                  Instant Charter Manifest Estimator (Interactive React Component)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> Departure
                    </label>
                    <input
                      type="text"
                      value={departure}
                      onChange={(e) => setDeparture(e.target.value)}
                      className="w-full text-xs font-bold text-[#111111] outline-none mt-0.5 bg-transparent"
                    />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <Anchor className="w-3 h-3" /> Arrival / Marina
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full text-xs font-bold text-[#111111] outline-none mt-0.5 bg-transparent"
                    />
                  </div>
                  <div className="bg-white border border-stone-200 rounded-xl px-3.5 py-2.5">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Vessel Tier
                    </label>
                    <select
                      value={charterType}
                      onChange={(e) => setCharterType(e.target.value)}
                      className="w-full text-xs font-bold text-[#111111] outline-none mt-0.5 bg-transparent"
                    >
                      <option>Dual Jet + Superyacht Transfer</option>
                      <option>Heavy Long-Range Cabin (14 Pax)</option>
                      <option>70m+ Mediterranean Superyacht</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <span className="text-[11px] text-stone-500 font-medium">
                    {demoSubmitted
                      ? `✓ Demo Inquiry Logged: ${departure} → ${destination}`
                      : 'Ready to connect to any CRM, email webhook, or WhatsApp VIP desk.'}
                  </span>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-[#111111] hover:bg-stone-800 text-white text-xs font-extrabold uppercase tracking-widest rounded-xl transition cursor-pointer shrink-0"
                  >
                    Request Tail & Berth
                  </button>
                </div>
              </form>
            </div>

            <div className="lg:col-span-6">
              <div
                onClick={() => setZoomImage(KIT_CONFIG.heroImage)}
                className="relative aspect-[16/11] rounded-[2rem] overflow-hidden border border-stone-200 cursor-zoom-in group bg-stone-100 shadow-lg"
              >
                <img
                  src={optimizeWebP(KIT_CONFIG.heroImage, 1600)}
                  alt="Unbranded Private Jet & Yacht Interior"
                  loading="eager"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-stone-200 text-[10px] font-extrabold uppercase tracking-widest text-[#111111]">
                  Fast WebP Preview • 150MP Master Included
                </div>
                <div className="absolute bottom-4 right-4 bg-[#111111]/90 text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  🔍 Click to Inspect Detail
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DEO 2: INTERAKTIVNA GALERIJA KABINA I JAHTI */}
        <section className="mt-16">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#8C6239] block mb-1">
                20 Unbranded Scenes Included (60 Total Files in .ZIP)
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#111111]">
                Curated Cabin & Salon Environments
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Previews', icon: Layers },
                { id: 'aviation', label: 'Private Aviation', icon: Plane },
                { id: 'maritime', label: 'Superyachts', icon: Anchor }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = fleetFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFleetFilter(tab.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 border transition cursor-pointer ${
                      active
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredAssets.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-stone-200/90 hover:border-stone-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div
                  onClick={() => setZoomImage(item.image)}
                  className="aspect-[16/10] bg-stone-100 relative overflow-hidden cursor-zoom-in group"
                >
                  <img
                    src={optimizeWebP(item.image, 1000)}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <span className="absolute top-3.5 left-3.5 bg-white/95 text-[#111111] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border border-stone-200">
                    {item.tag}
                  </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#111111] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium mb-4 flex-grow">
                    {item.specs}
                  </p>
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-[#8C6239]">
                    <span>{item.resolution}</span>
                    <button
                      type="button"
                      onClick={() => setZoomImage(item.image)}
                      className="text-[#111111] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      Inspect <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* DEO 3: B2B PRODAJNA SEKCIJA ($349 vs $1,490 BUYOUT) */}
        <section
          id="b2b-licensing-vault"
          className="mt-24 bg-white border-2 border-stone-300 rounded-[2.5rem] p-8 sm:p-12 lg:p-16 shadow-[0_25px_70px_rgba(20,20,19,0.07)]"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E5D7C3] text-[#8C6239] text-[10px] font-extrabold uppercase tracking-[0.22em] mb-4">
              <Crown className="w-3.5 h-3.5" /> Turnkey B2B Brand & Web Acquisition
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] mb-4">
              Deploy This Complete Charter Brand Today
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Engineered for instant PageSpeed performance and large-format billboard printing. Receive the complete React + Tailwind codebase alongside 20 IP-safe aviation & superyacht interiors delivered in 3 dedicated production resolutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <div className="bg-[#F8F7F4] border border-stone-200 rounded-2xl p-6">
              <FileCode className="w-6 h-6 text-[#8C6239] mb-3" />
              <h3 className="font-black uppercase text-sm tracking-wider text-[#111111] mb-1.5">
                1. Clean React + Tailwind Code
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Standalone production-ready `.JSX` template in Editorial Light aesthetic, pre-wired for sub-second `.webp` loading, route estimator, and fleet filtering.
              </p>
            </div>

            <div className="bg-[#F8F7F4] border border-stone-200 rounded-2xl p-6">
              <Aperture className="w-6 h-6 text-[#8C6239] mb-3" />
              <h3 className="font-black uppercase text-sm tracking-wider text-[#111111] mb-1.5">
                2. Triple-Format Visuals (60 Files)
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                20 unbranded scenes organized into 3 folders: <strong>20× Fast WebP</strong> (web speed) + <strong>20× 4K UHD</strong> (digital campaigns) + <strong>20× 150MP Masters</strong> (print/billboards).
              </p>
            </div>

            <div className="bg-[#F8F7F4] border border-stone-200 rounded-2xl p-6">
              <FolderArchive className="w-6 h-6 text-[#8C6239] mb-3" />
              <h3 className="font-black uppercase text-sm tracking-wider text-[#111111] mb-1.5">
                3. 3× Smart-Object PSD Mockups
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Includes 3 commercial street/terminal billboard `.PSD` mockups with <em>"Insert Your Image Here"</em> Smart Objects for instant client pitch presentations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* $349 STANDARD AGENCY KIT */}
            <div className="rounded-3xl border border-stone-300 bg-[#FBFAF8] p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
                    Multi-Client Agency License
                  </span>
                  <span className="px-3 py-1 rounded-full bg-stone-200/80 text-[#111111] text-[10px] font-black uppercase tracking-wider">
                    Instant .ZIP
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-[#111111] mb-2">
                  $349
                </div>
                <p className="text-xs text-stone-500 mb-6">
                  Ideal for web agencies, developers, and charter brokers launching a fast, luxury digital presence.
                </p>

                <ul className="space-y-3 text-xs text-stone-700 font-medium mb-8">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Complete standalone <strong>Aero & Mare</strong> React + Tailwind `.JSX` source file</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>60 Production Image Files:</strong> 20× WebP + 20× 4K UHD + 20× 150MP Print Masters</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong>3× Editable .PSD Billboard Mockups</strong> (Smart Object ready)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <span>Full commercial license for client websites, ads & print catalogs</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handlePurchaseTier('standard')}
                className="w-full py-4 rounded-xl bg-[#111111] hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-widest transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <DownloadCloud className="w-4 h-4 text-[#D4AF37]" /> License Agency Kit — $349
              </button>
            </div>

            {/* $1,490 EXCLUSIVE 1-OF-1 BUYOUT */}
            <div className="rounded-3xl border-2 border-[#111111] bg-[#111111] text-white p-8 flex flex-col justify-between relative shadow-2xl">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#D4AF37]">
                    1-of-1 Exclusive Brand Buyout
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#D4AF37] text-[#111111] text-[10px] font-black uppercase tracking-wider">
                    Single Buyer Only
                  </span>
                </div>

                <div className="text-4xl sm:text-5xl font-black text-white mb-2">
                  $1,490
                </div>
                <p className="text-xs text-stone-300 mb-6">
                  Full exclusive ownership—upon purchase, these 20 interiors are permanently retired from public sale.
                </p>

                <ul className="space-y-3 text-xs text-stone-200 font-medium mb-8">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Permanent Store Removal:</strong> Zero competitors can ever license this 20-scene visual fleet</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>All 60 files (WebP/4K/150MP) + <strong>10 Custom Bonus 150MP Renders</strong> tailored to your brand palette in 24h</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Includes the <strong>V1 Pro Aviation & Yacht Prompt Engine</strong> ruleset for internal team expansion</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>Signed Exclusive Enterprise IP Transfer PDF Certificate</span>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => handlePurchaseTier('buyout')}
                className="w-full py-4 rounded-xl bg-[#D4AF37] hover:bg-[#e0bc46] text-[#111111] font-black text-xs uppercase tracking-widest transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" /> Acquire 1-of-1 Exclusive Rights — $1,490
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <a
              href={KIT_CONFIG.freeSampleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-extrabold uppercase tracking-wider text-[#8C6239] hover:text-[#111111] underline"
            >
              Need technical verification first? Download 150MP ICC Spec Sheet & Sample →
            </a>
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
            productName={checkoutData.name}
            price={checkoutData.price}
            zipLink={checkoutData.zipLink}
            onClose={() => setCheckoutData({ isOpen: false, name: '', price: '0.00', zipLink: '' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrivateAviationKit;
// KRAJ FAJLA: src/pages/PrivateAviationKit.jsx