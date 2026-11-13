// ============================================================================
// src/pages/kits/yachts/SapphireVoyageYachts.jsx
// Sapphire Voyages (Page 4 of 5 — Private Yacht Charter Collection)
// Includes V10 Yacht Interiors + Always-Visible Sample Link + Prev/Next Nav
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle2, Compass, Crown,
  DownloadCloud, Lock, X
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

const BOARD = {
  prevPageRoute: '/yacht-page-3',
  prevPageLabel: 'Prev Yacht Page: Nautilus (3/5)',
  nextPageRoute: '/yacht-page-5',
  nextPageLabel: 'Next Yacht Page (5/5)',
  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',

  hero: '/yachts/4.jpeg',
  heroFallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2200&q=90',

  routes: [
    [
      'Monaco / Portofino',
      'Harbour mornings, symmetrical bouclé salons and a slow coastal afternoon',
      '/yachts/5.jpeg',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=85'
    ],
    [
      'Dubrovnik / Hvar',
      'Stone streets, sheltered bays and Nero Marquina island evenings',
      '/yachts/3.jpeg',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1000&q=85'
    ],
    [
      'Amalfi / Capri',
      'A classic blue-water passage with Calacatta sunset dining',
      '/yachts/1.jpeg',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=85'
    ]
  ],

  gallery: [
    {
      name: 'Symmetrical Bouclé Salon No. 01',
      group: 'interior',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1300&q=85'
    },
    {
      name: 'Moonlight Owner Stateroom',
      group: 'interior',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1300&q=85'
    },
    {
      name: 'Calacatta Sunset Dining Salon',
      group: 'interior',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1300&q=85'
    },
    {
      name: 'Carved Travertine Oceanfront Spa',
      group: 'interior',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1300&q=85'
    },
    {
      name: 'Nero Marquina Night Harbor Lounge',
      group: 'interior',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1300&q=85'
    },
    {
      name: 'Open Mediterranean Deck',
      group: 'exterior',
      image: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1300&q=85',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1300&q=85'
    }
  ],

  vessels: [
    {
      title: 'The Riviera 42',
      category: 'Day yacht',
      length: '42 m',
      guests: '8 guests',
      copy: 'An open-deck companion with Calacatta marble dining for swimming stops and long lunches.',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1100&q=85'
    },
    {
      title: 'The Saphir 58',
      category: 'Motor yacht',
      length: '58 m',
      guests: '12 guests',
      copy: 'A balanced, beautifully appointed choice featuring symmetrical bouclé salons for island-to-island travel.',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1100&q=85'
    },
    {
      title: 'The Azure 76',
      category: 'Superyacht',
      length: '76 m',
      guests: '16 guests',
      copy: 'A generous private retreat with an oceanfront travertine spa and full-beam moonlight master suite.',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1100&q=85'
    }
  ]
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.62, delay }}
    >
      {children}
    </motion.div>
  );
};

const SapphireVoyageYachts = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedVessel, setSelectedVessel] = useState(1);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [from, setFrom] = useState('Port Hercule, Monaco');
  const [to, setTo] = useState('Portofino, Italy');
  const [vesselType, setVesselType] = useState('The Saphir 58');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'Yacht_Landing', event_label: 'Sapphire_Voyage_Yachts' });
    return () => unsubscribe();
  }, []);

  const active = BOARD.vessels[selectedVessel];
  const visibleGallery = galleryFilter === 'all' ? BOARD.gallery : BOARD.gallery.filter((item) => item.group === galleryFilter);
  const goTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
      ? 'Sapphire Voyages Exclusive Yacht Buyout + React Kit'
      : 'Sapphire Voyages Agency License: Yacht Charter JSX + Visual Scenes';
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
    <div className="min-h-screen bg-[#F1F6FF] pb-24 font-sans text-[#102F6D]">
      <Helmet>
        <title>Sapphire Voyages | Yacht Charter Collection & 150MP Kit</title>
        <meta name="description" content="An editorial cobalt-blue yacht charter landing page with an interactive yacht selector, 150MP gallery, enquiry form and agency license." />
        <meta name="theme-color" content="#102F6D" />
      </Helmet>

      <div className="bg-[#102F6D] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.2em] text-white/85">
        Sapphire Voyages <span className="mx-2 text-[#72C9ED]">•</span> Private Yacht Society <span className="mx-2 text-[#72C9ED]">•</span> Page 4 of 5
      </div>

      <div className="sticky top-0 z-40 border-b border-[#102F6D]/15 bg-[#F1F6FF]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1460px] px-4 py-4 sm:px-8">
          <header className="flex items-center justify-between">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left">
              <span className="block text-[11px] font-black uppercase tracking-[0.28em]">Sapphire</span>
              <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-[#5482B5]">Voyages / private yacht society</span>
            </button>
            <nav className="hidden gap-7 text-[8px] font-extrabold uppercase tracking-[0.17em] text-[#547095] md:flex">
              <button type="button" onClick={() => goTo('fleet')}>The vessels</button>
              <button type="button" onClick={() => goTo('destinations')}>Routes</button>
              <button type="button" onClick={() => goTo('gallery')}>150MP Journal</button>
              <button type="button" onClick={() => goTo('licensing')}>Licensing</button>
            </nav>
            <button type="button" onClick={() => goTo('request')} className="rounded-full bg-[#163F89] px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white">
              Request a voyage <ArrowRight size={12} className="ml-1 inline" />
            </button>
          </header>
        </div>
      </div>

      <main>
        <section className="mx-auto grid max-w-[1460px] gap-8 px-4 py-10 sm:px-8 sm:py-14 lg:grid-cols-[1fr_0.94fr] lg:items-center lg:py-20">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="text-[8px] font-extrabold uppercase tracking-[0.24em] text-[#248BBF]">Issue 01 / The Mediterranean • Page 4/5</p>
              <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.045em] sm:text-7xl">
                A different shade of <span className="italic text-[#278BC4]">away.</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#5F7598] sm:text-base">
                A yacht is more than a way to travel. It is a private point of view: open water, considered interiors and the freedom to follow the coastline.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => goTo('fleet')} className="rounded-full bg-[#163F89] px-7 py-4 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white">
                  View the collection <ArrowRight size={13} className="ml-2 inline" />
                </button>
                <button type="button" onClick={() => goTo('destinations')} className="rounded-full border border-[#163F89]/20 bg-white px-7 py-4 text-[8px] font-extrabold uppercase tracking-[0.15em]">
                  Explore routes <Compass size={13} className="ml-2 inline" />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-11 flex max-w-lg items-center gap-5 border-t border-[#102F6D]/15 pt-5">
                <div><strong className="font-serif text-2xl">20</strong><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#6680A4]">Visual scenes</span></div>
                <div className="h-8 w-px bg-[#102F6D]/15" />
                <div><strong className="font-serif text-2xl">150MP</strong><span className="ml-2 text-[8px] font-bold uppercase tracking-[0.12em] text-[#6680A4]">Print masters</span></div>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.12} className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -right-3 -top-3 h-full w-full border border-[#5BAFDF]/35" />
              <div onClick={() => setPreview(BOARD.hero)} className="relative h-[420px] cursor-zoom-in overflow-hidden bg-[#C7E2F2] sm:h-[600px]">
                <img
                  src={BOARD.hero}
                  onError={(e) => handleSmartImageError(e, BOARD.heroFallback)}
                  alt="Sapphire-blue coastline with a private yacht spa"
                  className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute bottom-5 left-5 bg-[#F1F6FF] px-5 py-4 shadow-lg">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#278BC4]">Sapphire voyages / 01</span>
                <p className="mt-1 font-serif text-xl italic">The coast, reimagined.</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="fleet" className="scroll-mt-24 bg-[#DCEAFF] py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1460px] gap-9 px-4 sm:px-8 lg:grid-cols-[0.7fr_1.3fr]">
            <Reveal>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#278BC4]">The vessel edit</span>
              <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">Find the right scale for your escape.</h2>
              <p className="mt-4 text-sm leading-6 text-[#5F7598]">Select a yacht to explore a sample charter profile. Final vessel, route and availability are confirmed with your broker.</p>
              <div className="mt-7 space-y-2">
                {BOARD.vessels.map((vessel, index) => (
                  <button
                    key={vessel.title}
                    type="button"
                    onClick={() => { setSelectedVessel(index); setVesselType(vessel.title); }}
                    className={'flex w-full items-center justify-between border-b py-4 text-left ' + (selectedVessel === index ? 'border-[#163F89] text-[#102F6D]' : 'border-[#102F6D]/15 text-[#6D83A3]')}
                  >
                    <span>
                      <span className="block text-[8px] font-extrabold uppercase tracking-[0.14em]">{vessel.category} / {vessel.length}</span>
                      <span className="mt-1 block font-serif text-xl">{vessel.title}</span>
                    </span>
                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <AnimatePresence mode="wait">
                <motion.article
                  key={active.title}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.35 }}
                  className="grid overflow-hidden bg-white shadow-xl md:grid-cols-[1.1fr_0.9fr]"
                >
                  <div onClick={() => setPreview(active.image)} className="min-h-[350px] cursor-zoom-in overflow-hidden bg-[#C7E2F2]">
                    <img
                      src={active.image}
                      onError={(e) => handleSmartImageError(e, active.fallback)}
                      alt={active.title}
                      className="h-full w-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-9">
                    <div>
                      <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#278BC4]">Selected vessel</span>
                      <h3 className="mt-3 font-serif text-3xl">{active.title}</h3>
                      <p className="mt-4 text-xs leading-6 text-[#647C9E]">{active.copy}</p>
                    </div>
                    <div className="mt-8">
                      <div className="flex justify-between border-y border-[#102F6D]/10 py-3 text-[8px] font-bold uppercase tracking-[0.12em] text-[#60799C]">
                        <span>{active.guests}</span>
                        <span>{active.length}</span>
                      </div>
                      <button type="button" onClick={() => goTo('request')} className="mt-5 flex w-full items-center justify-center gap-2 bg-[#163F89] px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.15em] text-white">
                        Enquire about {active.category} <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </Reveal>
          </div>
        </section>

        <section id="destinations" className="scroll-mt-24 mx-auto max-w-[1460px] px-4 py-20 sm:px-8 sm:py-24">
          <Reveal className="flex flex-col justify-between gap-4 border-b border-[#102F6D]/15 pb-6 sm:flex-row sm:items-end">
            <div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#278BC4]">Route notes</span><h2 className="mt-3 font-serif text-4xl sm:text-5xl">A coastline in chapters.</h2></div>
            <p className="max-w-sm text-xs leading-6 text-[#647C9E]">Begin with an idea. Your private itinerary can connect the places that matter to you.</p>
          </Reveal>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {BOARD.routes.map(([place, copy, image, fallback], index) => (
              <Reveal key={place} delay={index * 0.06}>
                <article onClick={() => setPreview(image)} className="group grid cursor-pointer grid-rows-[260px_auto] border border-[#102F6D]/10 bg-white">
                  <div className="overflow-hidden">
                    <img
                      src={image}
                      onError={(e) => handleSmartImageError(e, fallback)}
                      alt={place}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.15em] text-[#278BC4]">Route note / 0{index + 1}</span>
                    <h3 className="mt-2 font-serif text-2xl">{place}</h3>
                    <p className="mt-2 text-xs leading-5 text-[#647C9E]">{copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 bg-[#102F6D] py-20 text-white sm:py-24">
          <div className="mx-auto max-w-[1460px] px-4 sm:px-8">
            <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#72C9ED]">Sapphire journal • 150MP Masters</span><h2 className="mt-3 font-serif text-4xl sm:text-5xl">A record of blue.</h2></div>
              <div className="flex gap-2">
                {[['all', 'All frames (6)'], ['interior', 'V10 Interiors'], ['exterior', 'On the water']].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setGalleryFilter(id)} className={'border px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.12em] ' + (galleryFilter === id ? 'border-[#72C9ED] bg-[#72C9ED] text-[#102F6D]' : 'border-white/25 text-white/70')}>{label}</button>
                ))}
              </div>
            </Reveal>
            <div className="mt-8 grid gap-3 md:grid-cols-6">
              {visibleGallery.map((item, index) => (
                <motion.button
                  layout
                  key={item.name}
                  type="button"
                  onClick={() => setPreview(item.image)}
                  className={'group relative overflow-hidden bg-[#163F89] ' + (index % 3 === 0 ? 'min-h-[360px] md:col-span-3 md:row-span-2' : 'min-h-[175px] md:col-span-3')}
                >
                  <img
                    src={item.image}
                    onError={(e) => handleSmartImageError(e, item.fallback)}
                    alt={item.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#071D48]/70 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-left text-xs font-semibold">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        <section id="request" className="scroll-mt-24 mx-auto grid max-w-[1460px] gap-10 px-4 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#278BC4]">Your itinerary, considered</span>
            <h2 className="mt-3 font-serif text-4xl leading-tight sm:text-6xl">Make a little room for the sea.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#647C9E]">Use this route preview to begin a conversation about your dates, preferred vessel and coastline.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="border border-[#102F6D]/12 bg-white p-5 sm:p-8">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="bg-[#F1F6FF] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#647C9E]">Embarkation</span><input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="bg-[#F1F6FF] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#647C9E]">Destination</span><input value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
                <label className="bg-[#F1F6FF] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#647C9E]">Vessel preference</span><select value={vesselType} onChange={(e) => setVesselType(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none">{BOARD.vessels.map((v) => <option key={v.title}>{v.title}</option>)}</select></label>
                <label className="bg-[#F1F6FF] p-3"><span className="text-[8px] font-bold uppercase tracking-[0.12em] text-[#647C9E]">Charter date</span><input type="date" className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" /></label>
              </div>
              <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[#102F6D]/10 pt-5 sm:flex-row sm:items-center">
                <p className="text-[9px] text-[#7185A0]">{submitted ? 'Preview: ' + from + ' to ' + to + ' • ' + vesselType : 'Front-end demo. Connect to your concierge or CRM for live enquiries.'}</p>
                <button className="inline-flex items-center justify-center gap-2 bg-[#163F89] px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.14em] text-white">Request a proposal <ArrowRight size={13} /></button>
              </div>
            </form>
          </Reveal>
        </section>

        {/* LICENSING SEKCIJA SA UVEK VIDLJIVIM DOWNLOAD SAMPLE LINKOM ISPOD CENA */}
        <section id="licensing" className="scroll-mt-24 bg-[#DCEAFF] py-20 sm:py-24">
          <div className="mx-auto max-w-[1460px] px-4 sm:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#6BBBE2]/40 bg-white px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#278BC4]"><Crown size={12} /> Sapphire Voyages / commercial kit</span>
              <h2 className="mt-5 font-serif text-4xl sm:text-5xl">A point of view your team can own.</h2>
              <p className="mt-4 text-sm leading-6 text-[#5F7598]">Keep the editorial design, yacht gallery and licensing system together in one responsive JSX page.</p>
            </div>
            <div className="mx-auto mt-9 grid max-w-5xl gap-4 lg:grid-cols-2">
              {[{ tier: 'standard', name: 'Agency edition', price: '$349', features: ['React + Tailwind JSX', '20 yacht scenes in 3 formats', 'ICC Color Profile & Print Spec Sheet', 'Commercial client license'] }, { tier: 'buyout', name: 'Exclusive edition', price: '$1,490', features: ['All 60 production image files', '10 custom 150MP renders', 'Yacht prompt ruleset', 'Enterprise IP transfer certificate'] }].map((plan, index) => (
                <div key={plan.tier} className={'flex h-full flex-col justify-between border p-7 sm:p-9 ' + (index === 0 ? 'border-white bg-white text-[#102F6D]' : 'border-[#163F89] bg-[#163F89] text-white')}>
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] opacity-70">{plan.name}</span>
                      <span className="font-serif text-3xl">{plan.price}</span>
                    </div>
                    <ul className="mt-7 space-y-3 text-xs opacity-80">
                      {plan.features.map((feature) => <li key={feature} className="flex gap-2"><CheckCircle2 size={14} className="shrink-0 text-[#48A8D8]" />{feature}</li>)}
                    </ul>
                  </div>
                  <div className="mt-8 pt-4">
                    <button type="button" onClick={() => purchase(plan.tier)} className={'flex w-full items-center justify-center gap-2 px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em] transition hover:scale-[1.02] cursor-pointer shadow-lg ' + (index === 0 ? 'bg-[#163F89] text-white' : 'bg-[#8BD6F1] text-[#102F6D]')}>
                      {index === 0 ? <DownloadCloud size={14} /> : <Lock size={13} />} Select {plan.price}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* UVEK VIDLJIV DOWNLOAD THE 150MP SAMPLE & ICC SHEET LINK ISPOD CENA */}
            <div className="relative z-20 mt-9 flex justify-center text-center">
              <a
                href={BOARD.freeSampleLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#163F89] underline decoration-[#163F89] underline-offset-4 transition hover:text-[#278BC4] cursor-pointer"
              >
                <span>Download the 150MP sample & ICC sheet</span>
                <ArrowUpRight size={14} className="inline shrink-0" />
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1460px] px-4 py-8 text-[8px] font-bold uppercase tracking-[0.14em] text-[#7185A0] sm:px-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <span>Sapphire Voyages / A private point of view</span>
            <button type="button" onClick={() => navigate('/stock')}>Back to stock vaults <ArrowRight size={11} className="ml-1 inline" /></button>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#071D48]/95 p-4" onClick={() => setPreview(null)}>
            <button type="button" onClick={() => setPreview(null)} className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#102F6D]"><X size={18} /></button>
            <img src={preview} onError={(e) => handleSmartImageError(e, BOARD.heroFallback)} alt="Yacht gallery preview" className="max-h-[90vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
      <LoginRequiredModal isOpen={login.isOpen} onClose={() => setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })} packageName={login.tierName} price={login.price} onLoginSuccess={async (account) => { await recordIntent(account, login.tierName, login.price); setCheckout({ isOpen: true, name: login.tierName, price: login.price, zipLink: login.zipLink }); setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' }); }} />
      <AnimatePresence>{checkout.isOpen && <V8SecureCheckout isOpen={checkout.isOpen} productName={checkout.name} price={checkout.price} zipLink={checkout.zipLink} onClose={() => setCheckout({ isOpen: false, name: '', price: '0.00', zipLink: '' })} />}</AnimatePresence>

      {/* Plivajuća Prev / Next navigacija (Stranica 4 od 5) */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(BOARD.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-white/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#102F6D] shadow-xl border border-[#102F6D]/15 backdrop-blur-md transition hover:bg-[#102F6D] hover:text-white cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCEAFF] text-[#102F6D] transition group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{BOARD.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(BOARD.nextPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#163F89] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/40 border border-[#72C9ED]/40 transition hover:bg-[#102F6D] hover:scale-105 cursor-pointer"
        >
          <span>{BOARD.nextPageLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#72C9ED] text-[#102F6D] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SapphireVoyageYachts;