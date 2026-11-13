// ============================================================================
// src/pages/kits/yachts/TideglassYachtSociety.jsx
// Tideglass Society (Page 5 of 5 — Private Yacht Charter Collection)
// Original Distinct Unsplash Visuals + Fixed Wake Image + Watches Floating Nav
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Anchor, ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Compass, Crown,
  DownloadCloud, Lock, Menu, Play, Sparkles, Video, Watch, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

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

const ASSETS = {
  // Levo dugme vraća na 4. stranicu jahti
  prevPageRoute: '/yacht-page-4',
  prevPageLabel: 'Prev Yacht Page: Sapphire (4/5)',

  // Desno plivajuće dugme vodi direktno na SATOVE (1. stranica satova)
  nextPageRoute: '/horology-watch-kit',
  nextPageLabel: 'Next Niche: Luxury Watches (1/5)',

  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',

  hero: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2400&q=90',
  heroFallback: '/yachts/2.jpeg',

  destinations: [
    {
      title: 'The Balearic Islands',
      subtitle: 'Soft mornings, hidden calas, long lunches at anchor',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1100&q=88',
      fallback: '/yachts/5.jpeg'
    },
    {
      title: 'The Aeolian Arc',
      subtitle: 'Volcanic silhouettes and the quiet of open water',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1100&q=88',
      fallback: '/yachts/3.jpeg'
    },
    {
      title: 'Corsica, by sea',
      subtitle: 'Granite coves, clear water, unhurried afternoons',
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1100&q=88',
      fallback: '/yachts/4.jpeg'
    }
  ],

  gallery: [
    {
      id: 'salon-at-dawn',
      type: 'interior',
      label: 'Symmetrical Bouclé & Teak Salon',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=88'
    },
    {
      id: 'quiet-suite',
      type: 'interior',
      label: 'Moonlight Master Stateroom',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=88'
    },
    {
      id: 'open-air-table',
      type: 'interior',
      label: 'Calacatta Marble Dining Deck',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=88'
    },
    {
      id: 'wake-line',
      type: 'deck',
      label: 'Open Mediterranean Wake',
      // POPRAVLJENA SLIKA (Aktivna Unsplash fotografija jahte i traga na vodi)
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=88',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=88'
    },
    {
      id: 'quiet-cala',
      type: 'deck',
      label: 'Nero Marquina Anchorage Lounge',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=88'
    },
    {
      id: 'last-light',
      type: 'deck',
      label: 'Carved Travertine Oceanfront Spa',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=88'
    }
  ]
};

const FLEET = [
  {
    name: 'The Dayline 38',
    type: 'Day charter · up to 8 guests',
    detail: 'Open deck, easy swim access and room for a long lunch at anchor.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1100&q=88',
    fallback: '/yachts/1.jpeg'
  },
  {
    name: 'The Meridian 52',
    type: 'Coastal escape · up to 10 guests',
    detail: 'Shaded lounging, generous sea terraces and quiet island passages.',
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1100&q=88',
    fallback: '/yachts/5.jpeg'
  },
  {
    name: 'The Bluehour 68',
    type: 'Multi-day charter · up to 12 guests',
    detail: 'Private suites, a considered salon and space to disappear for a while.',
    image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1100&q=88',
    fallback: '/yachts/2.jpeg'
  }
];

const TIDEGLASS_FILM_URL = '';

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const TideglassYachtSociety = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(-1);
  const [from, setFrom] = useState('Port de Sóller, Mallorca');
  const [to, setTo] = useState('Bonifacio, Corsica');
  const [yachtClass, setYachtClass] = useState('Modern explorer yacht');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'Yacht_Landing', event_label: 'Tideglass_Yacht_Society' });
    return () => unsubscribe();
  }, []);

  const items = filter === 'all' ? ASSETS.gallery : ASSETS.gallery.filter((item) => item.type === filter);
  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const recordIntent = async (account, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: account.displayName || 'B2B Agency Client',
        email: account.email,
        uid: account.uid,
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

  const purchase = async (tier) => {
    const buyout = tier === 'buyout';
    const name = buyout
      ? 'Tideglass Society Exclusive Yacht Brand Buyout + React Kit'
      : 'Tideglass Society Agency License: Yacht Charter React Kit + Visual Scenes';
    const price = buyout ? '1490.00' : '349.00';
    const zipLink = buyout
      ? 'https://drive.google.com/your-exclusive-1490-buyout-link'
      : 'https://drive.google.com/your-standard-349-kit-link';
    trackV8Action('high_ticket_checkout_click', { item_name: name, value: Number(price), currency: 'USD' });
    const account = user || auth.currentUser;
    if (account) {
      await recordIntent(account, name, price);
      setCheckout({ isOpen: true, name, price, zipLink });
    } else {
      setLogin({ isOpen: true, tierName: name, price, zipLink });
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F8FA] pb-24 font-sans text-[#0B2438]">
      <Helmet>
        <title>Tideglass Society | Private Yacht Charters & 150MP Visual Kit</title>
        <meta name="description" content="An airy Mediterranean yacht charter landing page with destination inspiration, yacht imagery and agency licensing." />
        <meta name="theme-color" content="#F4F8FA" />
      </Helmet>

      <div className="bg-[#0B2438] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/85 sm:text-[10px]">
        Tideglass Society <span className="mx-2 text-[#A9D9DE]">•</span> A new perspective on the Mediterranean <span className="mx-2 text-[#A9D9DE]">•</span> Page 5 of 5
      </div>

      <header className="sticky top-0 z-40 border-b border-[#0B2438]/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-7">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCEEF0] text-[#286B83]"><Anchor size={18} /></span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.22em]">Tideglass Society</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.18em] text-[#728991]">Yacht charters</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#536D7D] lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => goTo('destinations')}>Destinations</button>
            <button type="button" onClick={() => goTo('collection')}>Yacht collection</button>
            <button type="button" onClick={() => goTo('gallery')}>150MP Gallery</button>
            <button type="button" onClick={() => goTo('licenses')}>Licenses</button>
          </nav>
          <div className="hidden gap-3 lg:flex">
            <button type="button" onClick={() => goTo('enquiry')} className="rounded-full border border-[#0B2438]/15 px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em]">Plan a voyage</button>
            <button type="button" onClick={() => goTo('licenses')} className="rounded-full bg-[#155E88] px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">Explore the kit <ArrowRight size={13} className="ml-1 inline" /></button>
          </div>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#0B2438]/15 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#0B2438]/10 bg-white px-5 lg:hidden">
              <div className="mx-auto flex max-w-[1380px] flex-col py-3 text-xs font-bold uppercase tracking-[0.13em] text-[#536D7D]">
                {[['Destinations', 'destinations'], ['Yacht collection', 'collection'], ['150MP Gallery', 'gallery'], ['Licenses', 'licenses'], ['Plan a voyage', 'enquiry']].map(([label, id]) => (
                  <button key={id} type="button" onClick={() => goTo(id)} className="py-3 text-left">{label}</button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative isolate min-h-[760px] overflow-hidden bg-[#0B2438] text-white sm:min-h-[860px]">
          <motion.img
            src={ASSETS.hero}
            onError={(e) => handleSmartImageError(e, ASSETS.heroFallback)}
            alt="A private yacht cruising through clear blue water"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071B2C]/90 via-[#071B2C]/48 to-[#071B2C]/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071B2C]/65 via-transparent to-[#071B2C]/10" />
          <div className="relative mx-auto flex min-h-[760px] max-w-[1500px] flex-col justify-between px-5 py-8 sm:min-h-[860px] sm:px-10 sm:py-10 lg:px-16">
            <div className="flex items-center justify-between gap-4 text-[8px] font-extrabold uppercase tracking-[0.2em] text-white/75 sm:text-[9px]">
              <span>Longitude 04° 37′ · Mediterranean</span>
              <span className="hidden sm:block">A private society for open water • Page 5/5</span>
            </div>
            <div className="grid items-end gap-12 lg:grid-cols-[1fr_260px]">
              <div className="max-w-4xl">
                <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#A6D9DD] backdrop-blur"><Sparkles size={13} /> The Tideglass Edit · 2026</span></Reveal>
                <Reveal delay={0.08}><h1 className="mt-7 text-5xl font-medium leading-[0.94] tracking-[-0.06em] sm:text-7xl lg:text-[6.8rem]">Go where the<br /><span className="font-serif italic text-[#B7E2E4]">water turns blue.</span></h1></Reveal>
                <Reveal delay={0.16}><p className="mt-6 max-w-xl text-sm leading-7 text-white/80 sm:text-base">A private yacht, a slower horizon and a route that belongs entirely to you. Let the coast unfold one quiet anchorage at a time.</p></Reveal>
                <Reveal delay={0.22}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <button type="button" onClick={() => goTo('enquiry')} className="inline-flex items-center gap-3 rounded-full bg-[#155E88] px-7 py-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 hover:bg-[#104D70]">Design your voyage <ArrowRight size={14} /></button>
                    <button type="button" onClick={() => setVideoOpen(true)} className="inline-flex items-center gap-3 rounded-full border border-white/40 bg-white/10 px-6 py-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur transition hover:bg-white/20"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#0B2438]"><Play size={12} fill="currentColor" /></span> Watch the film</button>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.24}>
                <aside className="hidden border-l border-white/35 pl-6 lg:block">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#A6D9DD]">A different pace</p>
                  <p className="mt-4 text-3xl font-medium leading-tight">Leave the itinerary<br />open.</p>
                  <p className="mt-4 text-[10px] leading-6 text-white/70">A hand-picked fleet, thoughtful hosts and the freedom to change course.</p>
                </aside>
              </Reveal>
            </div>
            <div className="grid grid-cols-3 border-t border-white/30 pt-5 text-white sm:max-w-2xl sm:pt-7">
              <div><strong className="text-xl sm:text-2xl">24/7</strong><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.14em] text-white/65 sm:text-[8px]">Concierge</span></div>
              <div className="border-x border-white/30 px-4"><strong className="text-xl sm:text-2xl">12</strong><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.14em] text-white/65 sm:text-[8px]">Guests aboard</span></div>
              <div className="pl-4"><strong className="text-xl sm:text-2xl">150MP</strong><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.14em] text-white/65 sm:text-[8px]">Ultra print masters</span></div>
            </div>
          </div>
        </section>

        <section id="destinations" className="scroll-mt-24 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#2D83A5]">Choose your coastline</span><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">The best places begin by sea.</h2></div>
              <p className="max-w-md text-sm leading-6 text-[#607983]">A few ideas for your next escape. Shape the route around the people, places and pace you love.</p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {ASSETS.destinations.map((place, index) => (
                <Reveal key={place.title} delay={index * 0.07}>
                  <motion.article whileHover={{ y: -5 }} className="group cursor-pointer overflow-hidden rounded-[1.4rem] bg-[#E9F0F2]" onClick={() => setPreview(place.image)}>
                    <div className="h-64 overflow-hidden">
                      <img
                        src={place.image}
                        onError={(e) => handleSmartImageError(e, place.fallback)}
                        alt={place.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold">{place.title}</h3>
                      <p className="mt-2 text-xs text-[#667F89]">{place.subtitle}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="collection" className="scroll-mt-24 mx-auto max-w-[1460px] px-4 py-20 sm:px-7 sm:py-28">
          <Reveal className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#2D83A5]">The Tideglass fleet</span><h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">Find the yacht that fits your kind of day.</h2></div>
            <p className="max-w-md text-sm leading-6 text-[#607983]">From a sunlit day on deck to a long weekend between islands, every detail is shaped around your own rhythm.</p>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {FLEET.map((yacht, index) => (
              <Reveal key={yacht.name} delay={index * 0.08}>
                <motion.article whileHover={{ y: -6 }} className="group overflow-hidden rounded-[1.6rem] border border-[#0B2438]/10 bg-white shadow-sm">
                  <button type="button" onClick={() => setPreview(yacht.image)} className="relative block h-64 w-full overflow-hidden text-left">
                    <img
                      src={yacht.image}
                      onError={(e) => handleSmartImageError(e, yacht.fallback)}
                      alt={yacht.name + ' private yacht'}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-2 text-[7px] font-extrabold uppercase tracking-[0.15em] text-[#0B2438]">{yacht.type}</span>
                    <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#155E88]"><ArrowUpRight size={14} /></span>
                  </button>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-2xl font-semibold tracking-tight">{yacht.name}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#607983]">{yacht.detail}</p>
                    <button type="button" onClick={() => goTo('enquiry')} className="mt-5 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.14em] text-[#155E88]">Enquire about this yacht <ArrowRight size={12} /></button>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 bg-[#E6EEF0] py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#2D83A5]">Tideglass visual journal • 150MP Masters</span><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Inside, outside, out there.</h2></div>
              <div className="flex gap-2">
                {[['all', 'All (6)'], ['interior', 'V10 Interiors'], ['deck', 'Deck & sea']].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setFilter(id)} className={'rounded-full border px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em] ' + (filter === id ? 'border-[#0B2438] bg-[#0B2438] text-white' : 'border-[#0B2438]/15 bg-white text-[#536D7D]')}>{label}</button>
                ))}
              </div>
            </Reveal>
            <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.button layout key={item.id} type="button" onClick={() => setPreview(item.image)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="group relative h-72 overflow-hidden rounded-[1.3rem] bg-[#D3E7EA] text-left">
                    <img
                      src={item.image}
                      onError={(e) => handleSmartImageError(e, item.fallback)}
                      alt={item.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#071B2C]/65 via-transparent to-transparent" />
                    <span className="absolute bottom-5 left-5 text-sm font-bold text-white">{item.label}</span>
                    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B2438]"><ArrowUpRight size={15} /></span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section id="enquiry" className="scroll-mt-24 mx-auto grid max-w-[1380px] gap-10 px-4 py-20 sm:px-7 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#2D83A5]">Your route starts here</span>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Where will the blue take you?</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#607983]">Share a preferred route and yacht style. This interactive enquiry preview can be connected to your concierge workflow.</p>
            <div className="mt-6 flex items-center gap-3 text-xs font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#2D83A5] shadow-sm"><Compass size={17} /></span> A personal charter conversation</div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="rounded-[1.6rem] border border-[#0B2438]/10 bg-white p-5 shadow-xl shadow-[#0B2438]/5 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div><p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#2D83A5]">Charter enquiry</p><h3 className="mt-1 text-xl font-semibold">Build your sea day</h3></div>
                <Anchor size={21} className="text-[#2D83A5]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl bg-[#F4F8FA] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#708791]">Embarkation marina</span><input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="rounded-xl bg-[#F4F8FA] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#708791]">Destination</span><input value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="rounded-xl bg-[#F4F8FA] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#708791]">Yacht style</span><select value={yachtClass} onChange={(e) => setYachtClass(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"><option>Modern explorer yacht</option><option>Open-deck day yacht</option><option>Luxury superyacht</option><option>Sailing yacht</option><option>Help me choose</option></select></label>
                <label className="rounded-xl bg-[#F4F8FA] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#708791]">Charter date</span><input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
              </div>
              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#0B2438]/10 pt-5 sm:flex-row sm:items-center">
                <p className="text-[10px] leading-5 text-[#738890]">{submitted ? 'Preview: ' + from + ' to ' + to + ' • ' + yachtClass : 'Front-end demo form. Connect to your CRM or concierge inbox.'}</p>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#155E88] px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">Request a charter <ArrowRight size={13} /></button>
              </div>
            </form>
          </Reveal>
        </section>

        {/* LICENSING SEKCIJA BEZ PSD-A I SA UVEK VIDLJIVIM DOWNLOAD LINKOM */}
        <section id="licenses" className="scroll-mt-24 bg-[#0B2438] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#A6D9DD]"><Crown size={13} /> Tideglass Society digital kit</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">The charter experience, ready to launch.</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">A responsive yacht charter JSX, 20 visual scenes in three production formats, and complete commercial licensing.</p>
            </div>
            <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
              {[
                {
                  tier: 'standard',
                  name: 'Agency license',
                  price: '$349',
                  copy: 'Use the Tideglass Society kit across client websites and campaigns.',
                  features: ['React + Tailwind JSX', '60 files: WebP, 4K UHD and 150MP', 'ICC Color Profile & Print Spec Sheet', 'Commercial client license']
                },
                {
                  tier: 'buyout',
                  name: 'Exclusive buyout',
                  price: '$1,490',
                  copy: 'A one-buyer visual identity, with custom 150MP yacht scenes.',
                  features: ['All 60 production files', '10 custom 150MP renders', 'Yacht prompt ruleset', 'Enterprise IP transfer certificate']
                }
              ].map((plan, index) => (
                <div key={plan.tier} className={'h-full rounded-[1.5rem] p-7 sm:p-9 ' + (index === 0 ? 'bg-white text-[#0B2438]' : 'border border-[#A6D9DD]/40 bg-[#155E88] text-white')}>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] opacity-75">{plan.name}</p>
                  <p className="mt-4 text-5xl font-semibold tracking-tight">{plan.price}</p>
                  <p className="mt-3 text-xs leading-6 opacity-70">{plan.copy}</p>
                  <ul className="mt-6 space-y-3 text-xs">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#2D83A5]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => purchase(plan.tier)} className={'mt-8 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[9px] font-extrabold uppercase tracking-[0.12em] transition hover:scale-[1.02] cursor-pointer shadow-lg ' + (index === 0 ? 'bg-[#0B2438] text-white' : 'bg-[#A6D9DD] text-[#0B2438]')}>
                    {index === 0 ? <DownloadCloud size={14} /> : <Lock size={13} />} Select {plan.price}
                  </button>
                </div>
              ))}
            </div>

            {/* UVEK VIDLJIV DOWNLOAD THE 150MP SAMPLE & ICC SHEET LINK ISPOD CENA */}
            <div className="relative z-20 mt-10 flex justify-center text-center">
              <a
                href={ASSETS.freeSampleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#A6D9DD] underline decoration-[#A6D9DD] underline-offset-4 transition hover:text-white cursor-pointer"
              >
                <span>Download the 150MP sample & ICC sheet</span>
                <ArrowUpRight size={14} className="inline shrink-0" />
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#E6EEF0] py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1380px] gap-10 px-4 sm:px-7 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#2D83A5]">A few details</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Good to know.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#607983]">A few practical notes before you leave the harbour.</p>
            </Reveal>
            <div className="divide-y divide-[#0B2438]/15">
              {[
                ['Can we change the route during the trip?', 'Yes. Your skipper and concierge can adapt the route around weather, sea conditions and the places you would like to explore.'],
                ['What is included in a charter?', 'The exact inclusions depend on the yacht and itinerary. Our concierge will outline crew, provisions, fuel and any optional experiences before confirmation.'],
                ['Can I request a particular yacht?', 'Choose a fleet style in the enquiry form and add your preferred dates. The concierge will follow up with availability and matching options.'],
                ['How do I add the campaign film?', 'Set TIDEGLASS_FILM_URL near the top of this JSX file to your MP4 URL or public path.']
              ].map(([question, answer], index) => (
                <div key={question} className="border-b border-[#0B2438]/15 py-4">
                  <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} className="flex w-full items-center justify-between gap-4 py-1 text-left">
                    <span className="text-sm font-semibold">{question}</span>
                    <span className={'text-xl font-light text-[#155E88] transition-transform ' + (openFaq === index ? 'rotate-45' : '')}>+</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pr-8 pt-2 text-xs leading-6 text-[#607983]">{answer}</motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-4 py-16 sm:px-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Tideglass Society</span>
              <p className="mt-1 text-[9px] text-[#748A92]">Private yacht charters, shaped by the sea.</p>
            </div>
            <button type="button" onClick={() => navigate('/stock')} className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#155E88]">
              Back to stock vaults <ArrowRight size={12} className="ml-1 inline" />
            </button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#071B2C]/95 p-4" onClick={() => setPreview(null)}>
            <button type="button" onClick={() => setPreview(null)} className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#0B2438]"><X size={20} /></button>
            <img src={preview} onError={(e) => handleSmartImageError(e, ASSETS.heroFallback)} alt="Yacht image preview" className="max-h-[90vh] max-w-full rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {videoOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99998] flex items-center justify-center bg-[#071B2C]/95 p-4" role="dialog" aria-modal="true" aria-label="Tideglass campaign film" onClick={() => setVideoOpen(false)}>
            <button type="button" onClick={() => setVideoOpen(false)} aria-label="Close video" className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#0B2438]"><X size={19} /></button>
            {TIDEGLASS_FILM_URL ? (
              <video controls autoPlay playsInline poster={ASSETS.hero} className="max-h-[85vh] max-w-full rounded-2xl"><source src={TIDEGLASS_FILM_URL} type="video/mp4" /></video>
            ) : (
              <div className="flex min-h-[360px] w-full max-w-3xl flex-col items-center justify-center rounded-[1.8rem] border border-white/20 bg-[#0B2438] p-8 text-center text-white sm:p-12" onClick={(e) => e.stopPropagation()}>
                <Video size={40} className="text-[#A6D9DD]" />
                <p className="mt-6 text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#A6D9DD]">Tideglass campaign film</p>
                <h2 className="mt-3 text-3xl font-medium">Video placeholder</h2>
                <p className="mt-3 max-w-md text-xs leading-6 text-white/65">Add your charter campaign video by setting TIDEGLASS_FILM_URL to an MP4 URL or public path.</p>
                <code className="mt-5 rounded-xl bg-white/10 px-4 py-3 text-[10px] text-white/80">const TIDEGLASS_FILM_URL = '';</code>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <LoginRequiredModal
        isOpen={login.isOpen}
        onClose={() => setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })}
        packageName={login.tierName}
        price={login.price}
        onLoginSuccess={async (account) => {
          await recordIntent(account, login.tierName, login.price);
          setCheckout({ isOpen: true, name: login.tierName, price: login.price, zipLink: login.zipLink });
          setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });
        }}
      />

      <AnimatePresence>
        {checkout.isOpen && (
          <V8SecureCheckout
            isOpen={checkout.isOpen}
            productName={checkout.name}
            price={checkout.price}
            zipLink={checkout.zipLink}
            onClose={() => setCheckout({ isOpen: false, name: '', price: '0.00', zipLink: '' })}
          />
        )}
      </AnimatePresence>

      {/* Plivajuće dugme LEVO: Vraća na 4. stranicu jahti */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(ASSETS.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#0B2438] shadow-xl border border-[#0B2438]/15 backdrop-blur-md transition hover:bg-[#0B2438] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCEEF0] text-[#0B2438] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{ASSETS.prevPageLabel}</span>
        </button>
      </div>

      {/* Plivajuće dugme DESNO: Vodi direktno na SATOVE (/horology-watch-kit) */}
      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(ASSETS.nextPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-gradient-to-r from-[#0B2438] via-[#133854] to-[#1D4E6B] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/50 border border-amber-400/50 transition hover:scale-105 hover:border-amber-300 cursor-pointer"
        >
          <Watch size={15} className="text-amber-400" />
          <span>{ASSETS.nextPageLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-[#0B2438] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default TideglassYachtSociety;