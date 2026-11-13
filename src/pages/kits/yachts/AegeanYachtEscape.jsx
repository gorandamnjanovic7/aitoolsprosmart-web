// ============================================================================
// src/pages/kits/yachts/AegeanYachtEscape.jsx
// Aegean House (Page 2 of 5 — Private Yacht Charter Collection)
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Anchor, ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Compass, Crown,
  DownloadCloud, Lock, Menu, Sparkles, X
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
  prevPageRoute: '/superyacht-charter-kit',
  prevPageLabel: 'Prev Yacht Page: Aqua (1/5)',
  nextPageRoute: '/yacht-page-3',
  nextPageLabel: 'Next Yacht Page (3/5)',
 freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',

  hero: '/yachts/1.jpeg',
  heroFallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2200&q=90',

  destinations: [
    {
      title: 'The Cyclades',
      subtitle: 'White villages, Calacatta sunset dining and bright open water',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=85'
    },
    {
      title: 'Dalmatian Coast',
      subtitle: 'Quiet coves, carved travertine spas and island days',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=85'
    },
    {
      title: 'Amalfi to Capri',
      subtitle: 'A classic coastline seen from your private moonlight stateroom',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=85'
    }
  ],

  gallery: [
    {
      id: 'aegean-salon',
      type: 'interior',
      label: 'Symmetrical Bouclé & Teak Salon',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'blue-hour',
      type: 'interior',
      label: 'Nero Marquina Night Harbor Lounge',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'ocean-dining',
      type: 'interior',
      label: 'Calacatta Marble Sunset Dining',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'ocean-spa',
      type: 'interior',
      label: 'Carved Travertine Oceanfront Spa',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'moonlight-suite',
      type: 'interior',
      label: 'Moonlight Master Stateroom',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=85'
    },
    {
      id: 'open-water',
      type: 'deck',
      label: 'Open Mediterranean Passage',
      image: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=85',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=85'
    }
  ]
};

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

const AegeanYachtEscape = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [from, setFrom] = useState('Port Hercule, Monaco');
  const [to, setTo] = useState('Hydra, Greece');
  const [yachtClass, setYachtClass] = useState('Mediterranean motor yacht');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'Yacht_Landing', event_label: 'Aegean_Yacht_Escape' });
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
      ? 'Aegean House Exclusive Yacht Brand Buyout + React Kit'
      : 'Aegean House Agency License: Yacht Charter React Kit + Visual Scenes';
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
    <div className="min-h-screen bg-[#F2FBFE] pb-24 font-sans text-[#073B66]">
      <Helmet>
        <title>Aegean House | Private Yacht Charters & 150MP Visual Kit</title>
        <meta name="description" content="An airy Mediterranean yacht charter landing page with destination inspiration, 150MP yacht imagery and agency licensing." />
        <meta name="theme-color" content="#F2FBFE" />
      </Helmet>

      <div className="bg-[#073B66] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/85 sm:text-[10px]">
        Aegean House <span className="mx-2 text-[#72D3E5]">•</span> A new perspective on the Mediterranean <span className="mx-2 text-[#72D3E5]">•</span> 150MP Superyacht Architecture
      </div>

      <header className="sticky top-0 z-40 border-b border-[#073B66]/10 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 py-4 sm:px-7">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DFF5FA] text-[#147EA2]"><Anchor size={18} /></span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.22em]">Aegean House</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.18em] text-[#6890A1]">Yacht charters</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#567589] lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => goTo('destinations')}>Destinations</button>
            <button type="button" onClick={() => goTo('collection')}>Yacht collection</button>
            <button type="button" onClick={() => goTo('gallery')}>150MP Gallery</button>
            <button type="button" onClick={() => goTo('licenses')}>Licenses</button>
          </nav>
          <div className="hidden gap-3 lg:flex">
            <button type="button" onClick={() => goTo('enquiry')} className="rounded-full border border-[#073B66]/15 px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em]">Plan a voyage</button>
            <button type="button" onClick={() => goTo('licenses')} className="rounded-full bg-[#087AA3] px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">Explore the kit <ArrowRight size={13} className="ml-1 inline" /></button>
          </div>
          <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#073B66]/15 lg:hidden" aria-label="Toggle navigation">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#073B66]/10 bg-white px-5 lg:hidden">
              <div className="mx-auto flex max-w-[1380px] flex-col py-3 text-xs font-bold uppercase tracking-[0.13em] text-[#567589]">
                {[['Destinations', 'destinations'], ['Yacht collection', 'collection'], ['150MP Gallery', 'gallery'], ['Licenses', 'licenses'], ['Plan a voyage', 'enquiry']].map(([label, id]) => (
                  <button key={id} type="button" onClick={() => goTo(id)} className="py-3 text-left">{label}</button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1380px] items-center gap-10 px-4 py-10 sm:px-7 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:py-20">
          <div>
            <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-[#79CDE0]/50 bg-white px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#147EA2]"><Sparkles size={13} /> The Aegean, at your pace</span></Reveal>
            <Reveal delay={0.08}><h1 className="mt-6 max-w-2xl text-5xl font-medium leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">Follow the <span className="font-serif italic text-[#218FB5]">blue.</span></h1></Reveal>
            <Reveal delay={0.15}><p className="mt-6 max-w-xl text-base leading-7 text-[#5C7787]">Private yacht days for people who would rather discover the coast slowly. Find your favourite cove, stay for lunch, and let the afternoon unfold.</p></Reveal>
            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => goTo('enquiry')} className="inline-flex items-center justify-center gap-3 rounded-full bg-[#073B66] px-7 py-4 text-[10px] font-extrabold uppercase tracking-[0.14em] text-white transition hover:-translate-y-0.5 hover:bg-[#0A5D85]">Plan a charter <ArrowRight size={15} /></button>
                <button type="button" onClick={() => goTo('destinations')} className="inline-flex items-center justify-center gap-2 rounded-full border border-[#073B66]/15 bg-white px-7 py-4 text-[10px] font-extrabold uppercase tracking-[0.14em]">Find your coast <Compass size={14} /></button>
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-10 grid max-w-md grid-cols-3 border-t border-[#073B66]/12 pt-5">
                <div><strong className="text-xl">24/7</strong><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.13em] text-[#7290A0]">Concierge</span></div>
                <div className="border-x border-[#073B66]/12 px-4"><strong className="text-xl">150MP</strong><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.13em] text-[#7290A0]">Visual scenes</span></div>
                <div className="pl-4"><strong className="text-xl">Aegean</strong><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.13em] text-[#7290A0]">State of mind</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="relative">
            <div className="group relative h-[440px] overflow-hidden rounded-[2rem] bg-[#CDEAF1] shadow-2xl shadow-[#0B5072]/10 sm:h-[570px]">
              <img
                src={ASSETS.hero}
                onError={(e) => handleSmartImageError(e, ASSETS.heroFallback)}
                alt="Luxury yacht dining salon"
                className="h-full w-full cursor-zoom-in object-cover transition duration-1000 group-hover:scale-[1.035]"
                onClick={() => setPreview(ASSETS.hero)}
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#052E4C]/70 via-transparent to-transparent" />
              <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#073B66]">Aegean summer collection • Page 2/5</div>
              <button type="button" onClick={() => setPreview(ASSETS.hero)} className="absolute bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-[#073B66]"><ArrowUpRight size={19} /></button>
              <div className="absolute bottom-7 left-7 max-w-sm text-white">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#A9E9F2]">One coastline. Countless ways to wander.</p>
                <p className="mt-2 text-2xl font-medium">The sea sets the schedule.</p>
              </div>
            </div>
            <div className="absolute -bottom-5 left-6 rounded-2xl border border-white bg-white/95 px-5 py-4 shadow-xl">
              <span className="block text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#3289A7]">Your private sea day</span>
              <span className="mt-1 block text-sm font-bold">From first light to last swim</span>
            </div>
          </Reveal>
        </section>

        <section id="destinations" className="scroll-mt-24 bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <Reveal className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#218FB5]">Choose your coastline</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">The best places begin by sea.</h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[#65808E]">A few ideas for your next escape. Shape the route around the people, places and pace you love.</p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {ASSETS.destinations.map((place, index) => (
                <Reveal key={place.title} delay={index * 0.07}>
                  <motion.article whileHover={{ y: -5 }} className="group cursor-pointer overflow-hidden rounded-[1.4rem] bg-[#EAF7FA]" onClick={() => setPreview(place.image)}>
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
                      <p className="mt-2 text-xs text-[#66818F]">{place.subtitle}</p>
                    </div>
                  </motion.article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="collection" className="scroll-mt-24 mx-auto max-w-[1380px] px-4 py-16 sm:px-7 sm:py-24">
          <Reveal className="max-w-2xl">
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#218FB5]">Three ways to sail</span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Choose the feeling, then the yacht.</h2>
          </Reveal>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              ['The Day Escape', 'A relaxed open-deck yacht for swimming, sun and a long lunch in a quiet bay.', 'Day charters'],
              ['The Island Hopper', 'A comfortable motor yacht for easy coastal passages and a few favourite stops.', 'Coastal routes'],
              ['The Long Weekend', 'A spacious yacht for private suites, leisurely dining and time with your people.', 'Multi-day stays']
            ].map(([name, description, tag], index) => (
              <Reveal key={name} delay={index * 0.08}>
                <div className="h-full rounded-[1.5rem] border border-[#073B66]/10 bg-white p-6 shadow-sm sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#218FB5]">{tag}</span>
                    <span className="font-serif text-sm italic text-[#78C9DA]">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-semibold">{name}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#63808F]">{description}</p>
                  <button type="button" onClick={() => goTo('enquiry')} className="mt-7 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#087AA3]">Ask about this yacht <ArrowRight size={13} /></button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 bg-[#E7F5F8] py-16 sm:py-24">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#218FB5]">Aegean House visual library • 150MP Masters</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Inside, outside, out there.</h2>
              </div>
              <div className="flex gap-2">
                {[['all', 'All (6)'], ['interior', 'V10 Interiors'], ['deck', 'Deck & sea']].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setFilter(id)} className={'rounded-full border px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em] ' + (filter === id ? 'border-[#073B66] bg-[#073B66] text-white' : 'border-[#073B66]/15 bg-white text-[#507286]')}>{label}</button>
                ))}
              </div>
            </Reveal>
            <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.button layout key={item.id} type="button" onClick={() => setPreview(item.image)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: index * 0.03 }} className="group relative h-72 overflow-hidden rounded-[1.3rem] bg-[#CCEAF1] text-left">
                    <img
                      src={item.image}
                      onError={(e) => handleSmartImageError(e, item.fallback)}
                      alt={item.label}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-[#052E4C]/65 via-transparent to-transparent" />
                    <span className="absolute bottom-5 left-5 text-sm font-bold text-white">{item.label}</span>
                    <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#073B66]"><ArrowUpRight size={15} /></span>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        <section id="enquiry" className="scroll-mt-24 mx-auto grid max-w-[1380px] gap-10 px-4 py-20 sm:px-7 sm:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-[#218FB5]">Your route starts here</span>
            <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Where will the blue take you?</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#65808E]">Share a preferred route and yacht style. This interactive enquiry preview can be connected to your concierge workflow.</p>
            <div className="mt-6 flex items-center gap-3 text-xs font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#218FB5] shadow-sm"><Compass size={17} /></span> A personal charter conversation</div>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="rounded-[1.6rem] border border-[#073B66]/10 bg-white p-5 shadow-xl shadow-[#073B66]/5 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div><p className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#218FB5]">Charter enquiry</p><h3 className="mt-1 text-xl font-semibold">Build your sea day</h3></div>
                <Anchor size={21} className="text-[#218FB5]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="rounded-xl bg-[#F2FBFE] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#73909C]">Embarkation marina</span><input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="rounded-xl bg-[#F2FBFE] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#73909C]">Destination</span><input value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="rounded-xl bg-[#F2FBFE] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#73909C]">Yacht style</span><select value={yachtClass} onChange={(e) => setYachtClass(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"><option>Mediterranean motor yacht</option><option>Open-deck day yacht</option><option>Luxury superyacht</option><option>Help me choose</option></select></label>
                <label className="rounded-xl bg-[#F2FBFE] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#73909C]">Charter date</span><input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
              </div>
              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#073B66]/10 pt-5 sm:flex-row sm:items-center">
                <p className="text-[10px] leading-5 text-[#718895]">{submitted ? 'Preview: ' + from + ' to ' + to + ' • ' + yachtClass : 'Front-end demo form. Connect to your CRM or concierge inbox.'}</p>
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#087AA3] px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white">Request a charter <ArrowRight size={13} /></button>
              </div>
            </form>
          </Reveal>
        </section>

        {/* LICENSING SEKCIJA SA CENAMA */}
        <section id="licenses" className="scroll-mt-24 bg-[#073B66] pt-20 pb-10 text-white sm:pt-24 sm:pb-12">
          <div className="mx-auto max-w-[1380px] px-4 sm:px-7">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#98E5F0]"><Crown size={13} /> Aegean House digital kit</span>
              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">The charter experience, ready to launch.</h2>
              <p className="mt-4 text-sm leading-6 text-white/65">A responsive yacht charter JSX, 20 visual scenes in three production formats, and mockups for agency presentations.</p>
            </div>

            <div className="mx-auto mt-10 grid max-w-5xl gap-5 lg:grid-cols-2">
              {[
                {
                  tier: 'standard',
                  name: 'Agency license',
                  price: '$349',
                  copy: 'Use the Aegean House kit across client websites and campaigns.',
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
                <div
                  key={plan.tier}
                  className={'flex h-full flex-col justify-between rounded-[1.5rem] p-7 sm:p-9 ' + (index === 0 ? 'bg-white text-[#073B66]' : 'border border-[#8BDCE9]/40 bg-[#0A5377] text-white')}
                >
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] opacity-75">{plan.name}</p>
                    <p className="mt-4 text-5xl font-semibold tracking-tight">{plan.price}</p>
                    <p className="mt-3 text-xs leading-6 opacity-70">{plan.copy}</p>
                    <ul className="mt-6 space-y-3 text-xs">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#46B9CE]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-8 pt-4">
                    <button
                      type="button"
                      onClick={() => purchase(plan.tier)}
                      className={'flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[9px] font-extrabold uppercase tracking-[0.12em] transition hover:scale-[1.02] cursor-pointer shadow-xl ' + (index === 0 ? 'bg-[#073B66] text-white' : 'bg-[#78D8E5] text-[#061525]')}
                    >
                      {index === 0 ? <DownloadCloud size={14} /> : <Lock size={13} />} Select {plan.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* POSEBAN, UVEK VIDLJIV DOWNLOAD BAR DIREKTNO ISPOD CENA */}
        <section className="bg-[#05263F] border-t border-b border-[#0D4468] py-8 text-center">
          <div className="mx-auto max-w-[1380px] px-4">
            <a
              href={ASSETS.freeSampleLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#72D3E5] underline decoration-[#72D3E5] underline-offset-8 transition hover:text-white hover:scale-105 cursor-pointer"
            >
              <span>Download the 150MP sample & ICC sheet</span>
              <ArrowUpRight size={15} className="inline shrink-0" />
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-[1380px] px-4 py-16 sm:px-7">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em]">Aegean House</span>
              <p className="mt-1 text-[9px] text-[#78909E]">Private yacht charters, shaped by the sea.</p>
            </div>
            <button type="button" onClick={() => navigate('/stock')} className="text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#087AA3]">
              Back to stock vaults <ArrowRight size={12} className="ml-1 inline" />
            </button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#041B32]/95 p-4" onClick={() => setPreview(null)}>
            <button type="button" onClick={() => setPreview(null)} className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#073B66]"><X size={20} /></button>
            <img src={preview} onError={(e) => handleSmartImageError(e, ASSETS.heroFallback)} alt="Yacht image preview" className="max-h-[90vh] max-w-full rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
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

      {/* Plivajuća Prev / Next navigacija (Stranica 2 od 5) */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(ASSETS.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#073B66] shadow-xl border border-[#073B66]/15 backdrop-blur-md transition hover:bg-[#073B66] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DFF5FA] text-[#073B66] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{ASSETS.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(ASSETS.nextPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#073B66] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/40 border border-[#72D3E5]/40 transition hover:bg-[#087AA3] hover:scale-105 cursor-pointer"
        >
          <span>{ASSETS.nextPageLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#72D3E5] text-[#073B66] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default AegeanYachtEscape;