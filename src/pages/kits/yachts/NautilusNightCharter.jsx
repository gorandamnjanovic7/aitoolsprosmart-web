// ============================================================================
// src/pages/kits/yachts/NautilusNightCharter.jsx
// Nautilus Nocturne (Page 3 of 5 — Private Yacht Charter Collection)
// After-Dark Cinema Hero + V10 Night Yacht Interiors + Prev/Next Navigation
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Anchor, ArrowLeft, ArrowRight, ArrowUpRight, Clock3, Crown,
  DownloadCloud, Lock, MapPin, Menu, Moon, ShieldCheck, Sun, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

// Automatski proverava .jpeg -> .jpg -> .png -> Unsplash fallback
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

const MEDIA = {
  // Navigacija za Jahte (Stranica 3 od 5):
  prevPageRoute: '/yacht-page-2',
  prevPageLabel: 'Prev Yacht Page: Aegean (2/5)',
  nextPageRoute: '/yacht-page-4',
  nextPageLabel: 'Next Yacht Page (4/5)',
  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',

  night: '/yachts/3.jpeg',
  nightFallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=2000&q=90',
  day: '/yachts/5.jpeg',
  dayFallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=2000&q=90',
  video: 'https://assets.mixkit.co/videos/preview/mixkit-a-luxury-yacht-during-a-dusk-in-a-port-4446-large.mp4',

  rituals: [
    [
      '01 / Arrival',
      'A discreet marina welcome',
      'The route begins with a considered arrival and a warm welcome aboard.',
      '/yachts/3.jpeg',
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=85'
    ],
    [
      '02 / The salon',
      'Nero Marquina & harbor lights',
      'A private obsidian lounge made for conversation after sunset.',
      '/yachts/5.jpeg',
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1000&q=85'
    ],
    [
      '03 / The table',
      'Calacatta sunset gastronomy',
      'Ten-guest marble dining, a changing horizon and nowhere else to be.',
      '/yachts/1.jpeg',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=85'
    ],
    [
      '04 / The stateroom',
      'Sleep beneath the crescent moon',
      'Full-beam walnut stateroom overlooking calm midnight water.',
      '/yachts/2.jpeg',
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1000&q=85'
    ]
  ],

  gallery: [
    {
      label: 'Nero Marquina Night Harbor Salon',
      group: 'interior',
      image: '/yachts/3.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Moonlight Master Stateroom',
      group: 'interior',
      image: '/yachts/2.jpeg',
      fallback: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Calacatta Sunset Dining Deck',
      group: 'interior',
      image: '/yachts/1.jpeg',
      fallback: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Carved Travertine Oceanfront Spa',
      group: 'interior',
      image: '/yachts/4.jpeg',
      fallback: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Symmetrical Bouclé & Teak Salon',
      group: 'interior',
      image: '/yachts/5.jpeg',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    },
    {
      label: 'Mediterranean Marina Berth',
      group: 'deck',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85',
      fallback: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1400&q=85'
    }
  ]
};

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.65, delay }}
    >
      {children}
    </motion.div>
  );
};

const NautilusNightCharter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const [mood, setMood] = useState('night');
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [from, setFrom] = useState('Port Hercule, Monaco');
  const [to, setTo] = useState('Portofino, Italy');
  const [yacht, setYacht] = useState('Sapphire motor yacht');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'Yacht_Landing', event_label: 'Nautilus_Night_Charter' });
    return () => unsubscribe();
  }, []);

  const visibleGallery = filter === 'all' ? MEDIA.gallery : MEDIA.gallery.filter((item) => item.group === filter);
  const goTo = (id) => {
    setMenu(false);
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
      ? 'Nautilus Nocturne Exclusive Yacht Buyout + React Kit'
      : 'Nautilus Nocturne Agency License: Yacht Charter JSX + Scenes';
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
    <div className="min-h-screen overflow-hidden bg-[#061525] pb-16 font-sans text-white">
      <Helmet>
        <title>Nautilus Nocturne | Yacht Charter After Dark & 150MP Kit</title>
        <meta name="description" content="A cinematic midnight-blue yacht charter experience with a motion-led hero, 150MP gallery, route enquiry and agency kit." />
        <meta name="theme-color" content="#061525" />
      </Helmet>

      <div className="bg-[#020A12] px-4 py-2 text-center text-[9px] font-bold uppercase tracking-[0.22em] text-[#8DE7F0]">
        Nautilus Nocturne <span className="mx-2 text-white/40">•</span> Superyacht Passages After Dark <span className="mx-2 text-white/40">•</span> Page 3 of 5
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061525]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-4 sm:px-8">
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#59D4E4]/50 bg-[#0D2A42] text-[#75DDEC]"><Anchor size={18} /></span>
            <span>
              <span className="block text-xs font-black uppercase tracking-[0.25em]">Nautilus</span>
              <span className="mt-1 block text-[8px] uppercase tracking-[0.22em] text-[#8CA5B9]">Nocturne collection</span>
            </span>
          </button>
          <nav className="hidden gap-8 text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/70 lg:flex" aria-label="Main navigation">
            <button type="button" onClick={() => goTo('ritual')}>The ritual</button>
            <button type="button" onClick={() => goTo('fleet')}>Yachts</button>
            <button type="button" onClick={() => goTo('gallery')}>150MP Night gallery</button>
            <button type="button" onClick={() => goTo('license')}>The kit</button>
          </nav>
          <button type="button" onClick={() => goTo('request')} className="hidden rounded-full bg-[#68D4E3] px-5 py-3 text-[8px] font-black uppercase tracking-[0.15em] text-[#061525] transition hover:bg-[#A2EBF1] lg:block">Contact concierge</button>
          <button type="button" onClick={() => setMenu((v) => !v)} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 lg:hidden" aria-label="Open navigation">{menu ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
        <AnimatePresence>
          {menu && (
            <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10 bg-[#061525] px-5 lg:hidden">
              <div className="mx-auto flex max-w-[1500px] flex-col py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                {[['The ritual', 'ritual'], ['Yachts', 'fleet'], ['150MP Night gallery', 'gallery'], ['The kit', 'license'], ['Concierge', 'request']].map(([label, id]) => (
                  <button key={id} type="button" onClick={() => goTo(id)} className="py-3 text-left">{label}</button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section className="relative flex min-h-[720px] items-end overflow-hidden px-4 pb-16 pt-20 sm:px-8 sm:pb-20 lg:min-h-[840px]">
          <img
            src={mood === 'night' ? MEDIA.night : MEDIA.day}
            onError={(e) => handleSmartImageError(e, mood === 'night' ? MEDIA.nightFallback : MEDIA.dayFallback)}
            alt="Luxury superyacht salon at night"
            className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-1000"
          />
          <video
            key={mood}
            autoPlay
            loop
            muted
            playsInline
            poster={MEDIA.nightFallback}
            className="absolute inset-0 h-full w-full object-cover opacity-65 mix-blend-lighten"
          >
            <source src={mood === 'night' ? MEDIA.video : 'https://assets.mixkit.co/videos/preview/mixkit-ships-sailing-through-the-sea-around-an-archipelago-40078-large.mp4'} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#061525] via-[#061525]/45 to-[#061525]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#061525]/80 via-transparent to-transparent" />
          <div className="absolute right-[7%] top-[18%] hidden h-64 w-64 rounded-full border border-[#65D4E4]/15 lg:block" />
          <div className="absolute right-[10%] top-[22%] hidden h-48 w-48 rounded-full border border-[#65D4E4]/20 lg:block" />

          <div className="relative z-10 mx-auto grid w-full max-w-[1500px] gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div className="max-w-3xl">
              <Reveal><span className="inline-flex items-center gap-2 rounded-full border border-[#6DD5E4]/35 bg-[#061525]/50 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.23em] text-[#8DE7F0]"><Moon size={12} /> A private world after dark</span></Reveal>
              <Reveal delay={0.08}><h1 className="mt-6 text-5xl font-light leading-[0.95] tracking-[-0.06em] sm:text-7xl lg:text-[6.5rem]">Stay out<br /><span className="font-serif italic text-[#72D8E7]">a little longer.</span></h1></Reveal>
              <Reveal delay={0.16}><p className="mt-6 max-w-xl text-sm leading-7 text-white/75 sm:text-base">A night on the water can change the shape of a journey. Step aboard for quiet decks, warm light and the coastline after sunset.</p></Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button type="button" onClick={() => goTo('request')} className="rounded-full bg-[#68D4E3] px-7 py-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-[#061525] transition hover:bg-[#9BE9F2]">Arrange a private charter <ArrowRight size={14} className="ml-2 inline" /></button>
                  <button type="button" onClick={() => goTo('ritual')} className="rounded-full border border-white/35 bg-white/10 px-7 py-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-white backdrop-blur">Explore nocturne <ArrowUpRight size={14} className="ml-2 inline" /></button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.18}>
              <div className="rounded-[1.5rem] border border-white/15 bg-[#071B2B]/80 p-5 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between"><span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#8DE7F0]">Choose your light</span><span className="text-[8px] text-white/55">PAGE 03 / 05</span></div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setMood('night')} className={'rounded-xl px-3 py-3 text-left text-[9px] font-bold transition ' + (mood === 'night' ? 'bg-[#69D5E4] text-[#061525]' : 'bg-white/5 text-white/65 hover:bg-white/10')}><Moon size={14} className="mb-2" />Nocturne</button>
                  <button type="button" onClick={() => setMood('day')} className={'rounded-xl px-3 py-3 text-left text-[9px] font-bold transition ' + (mood === 'day' ? 'bg-[#69D5E4] text-[#061525]' : 'bg-white/5 text-white/65 hover:bg-white/10')}><Sun size={14} className="mb-2" />Day passage</button>
                </div>
                <p className="mt-4 text-[10px] leading-5 text-white/60">Switch the atmosphere to preview two distinct moods for the yacht story.</p>
              </div>
            </Reveal>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#67D4E4]/70 to-transparent" />
        </section>

        <section className="border-b border-white/10 bg-[#081B2B]">
          <div className="mx-auto grid max-w-[1500px] grid-cols-2 gap-4 px-4 py-6 sm:px-8 md:grid-cols-4">
            {[['01', 'Private arrival'], ['02', 'Quiet-water route'], ['03', 'After-dark dining'], ['04', '150MP sanctuary']].map(([n, label]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="font-serif text-lg italic text-[#5FD0E2]">{n}</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="ritual" className="scroll-mt-24 mx-auto grid max-w-[1500px] gap-12 px-4 py-20 sm:px-8 sm:py-28 lg:grid-cols-[0.75fr_1.25fr]">
          <Reveal>
            <span className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-[#6ED9E7]">The nocturne ritual</span>
            <h2 className="mt-4 max-w-lg text-4xl font-light leading-tight tracking-[-0.04em] sm:text-6xl">A slower kind of luxury.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/55">Let the shore lights recede. Settle into a private salon, linger over dinner, and wake somewhere new.</p>
            <button type="button" onClick={() => goTo('request')} className="mt-7 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#7FE1EC]">Design a private passage <ArrowRight size={13} /></button>
          </Reveal>
          <div className="grid gap-3 sm:grid-cols-2">
            {MEDIA.rituals.map(([tag, title, copy, image, fallback], index) => (
              <Reveal key={tag} delay={index * 0.05}>
                <article onClick={() => setPreview(image)} className="group relative min-h-[250px] cursor-pointer overflow-hidden rounded-[1.3rem] border border-white/10 bg-[#0B2639]">
                  <img
                    src={image}
                    onError={(e) => handleSmartImageError(e, fallback)}
                    alt={title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover opacity-65 transition duration-700 group-hover:scale-105 group-hover:opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061525] via-[#061525]/25 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#74DBE8]">{tag}</span>
                    <h3 className="mt-2 text-xl font-semibold">{title}</h3>
                    <p className="mt-1 text-[10px] leading-5 text-white/65">{copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="fleet" className="scroll-mt-24 bg-[#081B2B] py-20 sm:py-24">
          <div className="mx-auto max-w-[1500px] px-4 sm:px-8">
            <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#6ED9E7]">The collection</span><h2 className="mt-3 text-3xl font-light sm:text-5xl">Three ways to leave the shore.</h2></div>
              <p className="max-w-sm text-xs leading-6 text-white/50">Choose an atmosphere and scale for the voyage you have in mind.</p>
            </Reveal>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[['Moonwake', 'A composed motor yacht for evening passages and private dining.', 'Private coastal route'], ['Blue Hour', 'An open-deck escape for swimming, sunset and a late return.', 'Day into night'], ['Deepwater', 'A generous superyacht setting for longer stays and more room to unwind.', 'Multi-day charter']].map(([name, desc, tag], i) => (
                <Reveal key={name} delay={i * 0.06}>
                  <div className="rounded-[1.3rem] border border-white/10 bg-[#0A2336] p-6">
                    <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#6ED9E7]">{tag}</span>
                    <h3 className="mt-5 text-2xl font-medium">{name}</h3>
                    <p className="mt-3 text-xs leading-6 text-white/55">{desc}</p>
                    <button type="button" onClick={() => goTo('request')} className="mt-6 text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#8BE5EE]">Enquire <ArrowRight size={12} className="ml-1 inline" /></button>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="scroll-mt-24 mx-auto max-w-[1500px] px-4 py-20 sm:px-8 sm:py-24">
          <Reveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#6ED9E7]">Night gallery • 150MP Ultra-Print</span><h2 className="mt-3 text-3xl font-light sm:text-5xl">A study in water and light.</h2></div>
            <div className="flex gap-2">
              {[['all', 'All (6)'], ['interior', 'V10 Interiors'], ['deck', 'Decks']].map(([id, label]) => (
                <button key={id} type="button" onClick={() => setFilter(id)} className={'rounded-full border px-4 py-2 text-[8px] font-bold uppercase tracking-[0.13em] ' + (filter === id ? 'border-[#6ED9E7] bg-[#6ED9E7] text-[#061525]' : 'border-white/15 text-white/65')}>{label}</button>
              ))}
            </div>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleGallery.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.04}>
                <button type="button" onClick={() => setPreview(item.image)} className="group relative h-72 w-full overflow-hidden rounded-[1.2rem] bg-[#0A2336] text-left">
                  <img
                    src={item.image}
                    onError={(e) => handleSmartImageError(e, item.fallback)}
                    alt={item.label}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#061525]/80 to-transparent" />
                  <span className="absolute bottom-5 left-5 text-xs font-bold">{item.label}</span>
                  <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-[#061525]/50"><ArrowUpRight size={14} /></span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="request" className="scroll-mt-24 border-y border-white/10 bg-[#081B2B] py-20 sm:py-24">
          <div className="mx-auto grid max-w-[1500px] gap-10 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.2em] text-[#6ED9E7]">Private concierge</span>
              <h2 className="mt-4 text-4xl font-light leading-tight sm:text-6xl">Let the evening begin.</h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-white/55">Share a starting point, destination and yacht style. This front-end enquiry preview is ready to connect to your own concierge workflow.</p>
              <p className="mt-6 text-[8px] font-bold uppercase tracking-[0.15em] text-white/40">Around-the-clock assistance</p>
            </Reveal>
            <Reveal delay={0.1}>
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="rounded-[1.5rem] border border-white/10 bg-[#061525] p-5 sm:p-8">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#83A0B3]"><MapPin size={11} /> Departure marina</span><input value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full bg-transparent text-sm outline-none" /></label>
                  <label className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#83A0B3]"><MapPin size={11} /> Destination</span><input value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full bg-transparent text-sm outline-none" /></label>
                  <label className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#83A0B3]"><Anchor size={11} /> Yacht style</span><select value={yacht} onChange={(e) => setYacht(e.target.value)} className="mt-2 w-full bg-[#061525] text-sm outline-none"><option className="text-white">Sapphire motor yacht</option><option className="text-white">Open-deck yacht</option><option className="text-white">Luxury superyacht</option></select></label>
                  <label className="rounded-xl border border-white/10 bg-white/[0.04] p-3"><span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#83A0B3]"><Clock3 size={11} /> Charter date</span><input type="date" className="mt-2 w-full bg-transparent text-sm outline-none" /></label>
                </div>
                <div className="mt-5 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center">
                  <p className="text-[9px] leading-5 text-white/50">{submitted ? 'Preview: ' + from + ' to ' + to + ' • ' + yacht : 'Demo enquiry only. Connect the form to receive real requests.'}</p>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#68D4E3] px-6 py-3.5 text-[8px] font-black uppercase tracking-[0.15em] text-[#061525]">Send charter request <ArrowRight size={13} /></button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        <section id="license" className="scroll-mt-24 mx-auto max-w-[1500px] px-4 py-20 sm:px-8 sm:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6ED9E7]/30 bg-[#0C2A40] px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#80DDE9]"><Crown size={12} /> Nautilus Nocturne brand kit</span>
            <h2 className="mt-5 text-3xl font-light sm:text-5xl">A complete after-dark charter identity.</h2>
            <p className="mt-4 text-sm leading-6 text-white/55">A responsive yacht JSX, 20 yacht scenes in WebP, 4K UHD and 150MP formats, and editable mockups.</p>
          </Reveal>
          <div className="mx-auto mt-9 grid max-w-5xl gap-4 lg:grid-cols-2">
            {[{ tier: 'standard', name: 'Agency license', price: '$349', features: ['React + Tailwind JSX', '60 production image files', 'ICC Color Profile & Print Spec Sheet', 'Commercial client license'] }, { tier: 'buyout', name: 'Exclusive buyout', price: '$1,490', features: ['All 60 image files', '10 custom 150MP renders', 'Yacht prompt ruleset', 'Enterprise IP transfer certificate'] }].map((plan, index) => (
              <Reveal key={plan.tier} delay={index * 0.08}>
                <div className={'rounded-[1.4rem] border p-7 sm:p-9 ' + (index === 0 ? 'border-white/10 bg-[#0B2236]' : 'border-[#6ED9E7]/30 bg-gradient-to-br from-[#0C324B] to-[#0B5371]')}>
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-[#83E0EA]">{plan.name}</p>
                  <p className="mt-4 text-5xl font-light">{plan.price}</p>
                  <ul className="mt-6 space-y-3 text-xs text-white/70">
                    {plan.features.map((item) => <li key={item} className="flex gap-2"><ShieldCheck size={14} className="shrink-0 text-[#72D8E7]" />{item}</li>)}
                  </ul>
                  <button type="button" onClick={() => purchase(plan.tier)} className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-[#68D4E3] px-5 py-4 text-[8px] font-black uppercase tracking-[0.14em] text-[#061525]">
                    {index === 0 ? <DownloadCloud size={14} /> : <Lock size={13} />} Select {plan.price}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-4 py-8 text-[8px] uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:px-8">
          <span>Nautilus Nocturne • Yacht charter after dark</span>
          <button type="button" onClick={() => navigate('/stock')}>Back to stock vaults <ArrowRight size={11} className="ml-1 inline" /></button>
        </section>
      </main>

      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#020A12]/95 p-4" onClick={() => setPreview(null)}>
            <button type="button" onClick={() => setPreview(null)} className="absolute right-5 top-5 rounded-full bg-white p-3 text-[#061525]"><X size={19} /></button>
            <img src={preview} onError={(e) => handleSmartImageError(e, MEDIA.nightFallback)} alt="Yacht detail" className="max-h-[90vh] max-w-full rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
      <LoginRequiredModal isOpen={login.isOpen} onClose={() => setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' })} packageName={login.tierName} price={login.price} onLoginSuccess={async (account) => { await recordIntent(account, login.tierName, login.price); setCheckout({ isOpen: true, name: login.tierName, price: login.price, zipLink: login.zipLink }); setLogin({ isOpen: false, tierName: '', price: '0.00', zipLink: '' }); }} />
      <AnimatePresence>{checkout.isOpen && <V8SecureCheckout isOpen={checkout.isOpen} productName={checkout.name} price={checkout.price} zipLink={checkout.zipLink} onClose={() => setCheckout({ isOpen: false, name: '', price: '0.00', zipLink: '' })} />}</AnimatePresence>

      {/* Plivajuća Prev / Next navigacija za jahte (Stranica 3 od 5) */}
      <div className="fixed bottom-24 left-6 z-50 hidden sm:block">
        <button
          type="button"
          onClick={() => navigate(MEDIA.prevPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#0B2236]/95 px-4 py-3 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white shadow-xl border border-[#68D4E3]/30 backdrop-blur-md transition hover:bg-[#68D4E3] hover:text-[#061525] cursor-pointer"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0D2A42] text-[#68D4E3] transition group-hover:bg-[#061525] group-hover:-translate-x-0.5">
            <ArrowLeft size={14} />
          </span>
          <span>{MEDIA.prevPageLabel}</span>
        </button>
      </div>

      <div className="fixed bottom-24 right-6 z-50">
        <button
          type="button"
          onClick={() => navigate(MEDIA.nextPageRoute)}
          className="group flex items-center gap-3 rounded-full bg-[#020A12] px-5 py-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white shadow-2xl shadow-black/60 border border-[#68D4E3]/50 transition hover:bg-[#0B2236] hover:scale-105 cursor-pointer"
        >
          <span>{MEDIA.nextPageLabel}</span>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#68D4E3] text-[#061525] transition group-hover:translate-x-0.5">
            <ArrowRight size={14} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default NautilusNightCharter;