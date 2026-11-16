// ============================================================================
// POČETAK FAJLA: src/pages/kits/watches/MeridianWatchHouse.jsx (STRANICA 3 OD 5)
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Calendar, CheckCircle2, ChevronDown,
  Clock3, Crown, Gem, Lock, Menu, Play, ShieldCheck, Sparkles,
  Video, Watch, X
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import V8SecureCheckout from '../../../V8SecureCheckout';
import LoginRequiredModal from '../../../LoginRequiredModal';
import { trackV8Action } from '../../../utils/analytics';

const KIT_CONFIG = {
  standardZipLink: 'https://drive.google.com/your-standard-349-watch-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-watch-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',
};

const SITE = {"brand": "Meridian Watch House", "descriptor": "Modern horology / volume 01", "analyticsLabel": "Meridian_Watch_House", "topline": "Volume 01 / A modern point of view on mechanical time", "kicker": "A new perspective on precision", "titleBefore": "Find your ", "titleEmphasis": "meridian.", "titleAfter": "", "description": "A contemporary watch house for people who appreciate considered engineering, crisp lines and a precise point of view.", "footer": "A modern classic, measured in moments.", "heroStyle": "showroom", "cardLayout": "wide", "formLayout": "split", "order": ["collection", "gallery", "appointment", "craft", "licensing", "faq"], "hero": "https://images.unsplash.com/photo-1792683422263-6e7ee83f3498?auto=format&fit=crop&w=2200&q=90", "palette": {"canvas": "#EEF4F7", "ink": "#17334B", "muted": "#668095", "accent": "#2B83B9", "accentContrast": "#FFFFFF", "panel": "#FFFFFF", "soft": "#DCEAF1", "line": "#C2D3DD", "inverse": "#173950", "inverseInk": "#FFFFFF"}};

const WATCH_VIDEO_URL = '';
const MERIDIAN_WATCH_HOUSE_FREE_SAMPLE_LINK = '';

const WATCHES = [
  { id: 'meridian-01', category: 'dress', reference: '01 / M-38', name: 'Meridian No. 38', movement: 'Automatic calibre', case: '38 mm / polished steel', image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1400&q=85' },
  { id: 'deepblue-02', category: 'sport', reference: '02 / D-42', name: 'Deepblue Chronograph', movement: 'Automatic chronograph', case: '42 mm / brushed steel', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1400&q=85' },
  { id: 'atelier-03', category: 'skeleton', reference: '03 / A-40', name: 'Atelier Skeleton', movement: 'Open-worked automatic', case: '40 mm / rose gold finish', image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1400&q=85' },
  { id: 'heritage-04', category: 'dress', reference: '04 / H-36', name: 'Heritage Moonphase', movement: 'Moonphase automatic', case: '36 mm / champagne dial', image: 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1400&q=85' },
  { id: 'coastline-05', category: 'sport', reference: '05 / C-41', name: 'Coastline GMT', movement: 'Dual-time automatic', case: '41 mm / ceramic bezel', image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=1400&q=85' },
  { id: 'nocturne-06', category: 'skeleton', reference: '06 / N-39', name: 'Nocturne Open Heart', movement: 'Open-heart automatic', case: '39 mm / dark titanium', image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1400&q=85' }
];

const GALLERY_WATCHES = [
  { id: "journal-01", reference: "Journal / 01", name: "Journal frame 01", image: "https://images.unsplash.com/photo-1792332778495-f752666bbeb3?auto=format&fit=crop&w=1400&q=90" },
  { id: "journal-02", reference: "Journal / 02", name: "Journal frame 02", image: "https://images.unsplash.com/photo-1700649861115-7a3cd213ac77?auto=format&fit=crop&w=1400&q=90" },
  { id: "journal-03", reference: "Journal / 03", name: "Journal frame 03", image: "https://images.unsplash.com/photo-1784004120304-82157a4b2a2e?auto=format&fit=crop&w=1400&q=90" }
];

const FAQS = [
  ['What is included in the agency license?', 'The package includes the React and Tailwind landing-page source, watch visual scenes, editable mockups and a commercial license for client projects.'],
  ['Can I change the watch imagery and video?', 'Yes. Replace the gallery images and set WATCH_VIDEO_URL to your MP4 link or public video path. The video slot is visible in the hero.'],
  ['What does the exclusive buyout include?', 'The one-buyer option includes the complete watch landing-page kit, production visuals and exclusive brand adaptation rights as described in the license section.'],
  ['Does the appointment form confirm an order?', 'No. It is an interactive front-end preview. Connect it to your CRM, email webhook or boutique team to receive real requests.']
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: reducedMotion ? 0 : 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const STYLES = '.watch-page{background:var(--wp-canvas);color:var(--wp-ink)}' +
  '.watch-panel{background:var(--wp-panel);border-color:var(--wp-line)}' +
  '.watch-soft{background:var(--wp-soft)}' +
  '.watch-muted{color:var(--wp-muted)}' +
  '.watch-accent{color:var(--wp-accent)}' +
  '.watch-accent-bg{background:var(--wp-accent);color:var(--wp-accent-contrast)}' +
  '.watch-inverse{background:var(--wp-inverse);color:var(--wp-inverse-ink)}' +
  '.watch-line{border-color:var(--wp-line)}' +
  '.watch-button{transition:transform .25s ease,filter .25s ease,box-shadow .25s ease}' +
  '.watch-button:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 12px 28px rgba(0,0,0,.12)}' +
  '.watch-hero-stage>.watch-film-frame{height:100%;min-height:100%;border-radius:0}' +
  '.watch-page ::selection{background:var(--wp-accent);color:var(--wp-accent-contrast)}' +
  '@media(prefers-reduced-motion:reduce){.watch-button{transition:none}}';

const cardLayouts = {
  trio: 'sm:grid-cols-2 xl:grid-cols-3',
  editorial: 'sm:grid-cols-2 xl:grid-cols-3',
  wide: 'sm:grid-cols-2',
  mosaic: 'sm:grid-cols-2 xl:grid-cols-4',
  compact: 'sm:grid-cols-2 xl:grid-cols-4'
};

const MeridianWatchHouse = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedWatch, setSelectedWatch] = useState(WATCHES[0].name);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'Watch_Landing', event_label: SITE.analyticsLabel });
    return () => unsubscribe();
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const visibleWatches = filter === 'all' ? WATCHES : WATCHES.filter((watch) => watch.category === filter);

  const recordIntent = async (account, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: account.displayName || 'B2B Agency Client',
        email: account.email,
        uid: account.uid,
        zeliPaket: productName,
        paketId: price === '1490.00' ? 'luxury_watch_buyout_1490' : 'luxury_watch_kit_349',
        cenaPaketa: price,
        vreme: serverTimestamp(),
        isPaid: false
      });
    } catch (error) {
      console.error(error);
    }
  };

  const purchase = async (tier) => {
    const isBuyout = tier === 'buyout';
    const name = isBuyout
      ? SITE.brand + ' Exclusive Watch Brand Buyout + React Kit'
      : SITE.brand + ' Agency License: Watch Landing Page + Visual Scenes';
    const price = isBuyout ? '1490.00' : '349.00';
    const zipLink = isBuyout ? KIT_CONFIG.buyoutZipLink : KIT_CONFIG.standardZipLink;
    trackV8Action('high_ticket_checkout_click', { item_name: name, value: Number(price), currency: 'USD' });
    const account = user || auth.currentUser;
    if (account) {
      await recordIntent(account, name, price);
      setCheckout({ isOpen: true, name, price, zipLink });
    } else {
      setLogin({ isOpen: true, tierName: name, price, zipLink });
    }
  };

  const videoPlaceholder = (
    <div className="watch-film-frame group relative flex min-h-[250px] w-full items-center justify-center overflow-hidden rounded-[1.3rem] watch-inverse sm:min-h-[340px]">
      {WATCH_VIDEO_URL ? (
        <video controls playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src={WATCH_VIDEO_URL} type="video/mp4" />
        </video>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/15" />
          <button type="button" onClick={() => setVideoOpen(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/65 bg-white/15 backdrop-blur"><Play size={20} fill="currentColor" /></span>
            <span className="text-[8px] font-black uppercase tracking-[0.22em]">Watch film placeholder</span>
            <span className="max-w-sm text-xs leading-5 text-white/75">Add your product video in WATCH_VIDEO_URL</span>
          </button>
        </>
      )}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/25 bg-black/25 px-3 py-2 text-[7px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">Video slot / replace source</span>
    </div>
  );

  const hero = (
    <section className="mx-auto grid max-w-[1460px] gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
      <Reveal><span className="text-[8px] font-extrabold uppercase tracking-[0.24em] watch-accent">{SITE.kicker}</span><h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.93] tracking-[-0.055em] sm:text-7xl">{SITE.titleBefore}<span className="font-serif italic watch-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1><p className="mt-6 max-w-lg text-sm leading-7 watch-muted">{SITE.description}</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={() => goTo('collection')} className="watch-button watch-accent-bg rounded-full px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em]">Discover the watches <ArrowRight size={14} className="ml-2 inline" /></button><button type="button" onClick={() => setVideoOpen(true)} className="inline-flex items-center gap-2 rounded-full border watch-line watch-panel px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em]"><Play size={12} /> View film placeholder</button></div><div className="mt-10 flex gap-6 border-t watch-line pt-5"><div><strong className="text-2xl">06</strong><span className="ml-2 text-[7px] font-bold uppercase tracking-[0.12em] watch-muted">References</span></div><div><strong className="text-2xl">100%</strong><span className="ml-2 text-[7px] font-bold uppercase tracking-[0.12em] watch-muted">Automatic</span></div></div></Reveal>
      <Reveal delay={0.1} className="relative"><div className="absolute -right-3 -top-3 h-full w-full border watch-line" /><div className="relative min-h-[440px] overflow-hidden watch-inverse sm:min-h-[610px]"><img src={SITE.hero} alt="Luxury timepiece in the studio" className="h-full min-h-[440px] w-full object-cover sm:min-h-[610px]" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><span className="absolute bottom-5 left-5 text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/80">Reference / 03 — {WATCHES[0].reference}</span></div></Reveal>
    </section>
  );

  const collectionSection = (
    <section id="collection" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] watch-accent">The collection</span><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Made for the moments that matter.</h2></div><p className="max-w-md text-sm leading-6 watch-muted">Discover mechanical character, considered proportions and details that reward a closer look.</p></Reveal>
        <div className="mt-7 flex flex-wrap gap-2">{[['all','All pieces'],['dress','Dress'],['sport','Sport'],['skeleton','Open-worked']].map(([id,label])=><button key={id} type="button" onClick={()=>setFilter(id)} className={'rounded-full border px-4 py-2.5 text-[8px] font-extrabold uppercase tracking-[0.12em] transition ' + (filter===id ? 'watch-accent-bg border-transparent' : 'watch-panel watch-line')}>{label}</button>)}</div>
        <div className={'mt-7 grid gap-4 ' + cardLayouts[SITE.cardLayout]}>{visibleWatches.map((watch,index)=><motion.article key={watch.id} layout initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} whileHover={{y:-5}} transition={{delay:index*0.035}} className="group overflow-hidden rounded-[1.3rem] border watch-line watch-panel"><button type="button" onClick={()=>setPreview(watch.image)} className="relative block aspect-[1.15] w-full overflow-hidden watch-inverse text-left"><img src={watch.image} alt={watch.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur">{watch.reference}</span><span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 watch-accent"><ArrowUpRight size={14}/></span></button><div className="p-4 sm:p-5"><span className="text-[7px] font-extrabold uppercase tracking-[0.15em] watch-accent">{watch.category} collection</span><h3 className="mt-2 text-lg font-semibold">{watch.name}</h3><p className="mt-2 text-[10px] leading-5 watch-muted">{watch.movement} <span className="mx-1">•</span> {watch.case}</p><button type="button" onClick={()=>{setSelectedWatch(watch.name);goTo('appointment');}} className="mt-4 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.13em] watch-accent">Request details <ArrowRight size={12}/></button></div></motion.article>)}</div>
      </div>
    </section>
  );

  const craftSection = (
    <section id="craft" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 watch-soft">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-8 max-w-3xl"><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] watch-accent">Inside the atelier</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Precision you can feel.</h2><p className="mt-4 text-sm leading-6 watch-muted">A closer look at the materials and mechanical decisions behind each timepiece.</p></Reveal>
        <div className="grid gap-4 md:grid-cols-3">{[['01 / Calibre','A mechanical heartbeat','Automatic movements built for reliable, everyday precision.',Clock3],['02 / Materials','Light across every surface','Sapphire crystal, carefully finished cases and tactile dials.',Gem],['03 / Finishing','The details stay with you','Brushed, polished and hand-checked finishing at every angle.',Sparkles]].map(([number,title,copy,Icon],index)=><Reveal key={number} delay={index*0.07}><article className="h-full rounded-[1.2rem] border watch-line watch-panel p-6 sm:p-8"><span className="flex h-11 w-11 items-center justify-center rounded-full watch-soft watch-accent"><Icon size={18}/></span><p className="mt-6 text-[7px] font-extrabold uppercase tracking-[0.17em] watch-accent">{number}</p><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-3 text-xs leading-6 watch-muted">{copy}</p></article></Reveal>)}</div>
      </div>
    </section>
  );

  const gallerySection = (
    <section id="gallery" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 watch-inverse">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] watch-accent">The watch journal</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A study in form and time.</h2><p className="mt-3 max-w-xl text-xs leading-6 opacity-65">Product stills, dial details and campaign moments from the collection.</p></div><button type="button" onClick={()=>setVideoOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.14em]"><Video size={13}/> Open film slot</button></Reveal>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{GALLERY_WATCHES.map((watch,index)=><Reveal key={watch.id} delay={index*0.04}><button type="button" onClick={()=>setPreview(watch.image)} className={'group relative w-full overflow-hidden rounded-[1.2rem] text-left ' + (index===0?'h-[420px] sm:row-span-2':'h-[260px]')}><img src={watch.image} alt={watch.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><span className="absolute bottom-4 left-4"><span className="block text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/70">{watch.reference}</span><span className="mt-1 block text-sm font-semibold text-white">{watch.name}</span></span></button></Reveal>)}</div>
      </div>
    </section>
  );

  const appointmentSection = (
    <section id="appointment" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-9 lg:grid-cols-[0.75fr_1.25fr]">
        <Reveal><span className="inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.2em] watch-accent"><Calendar size={13}/> Private viewing</span><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Meet your next heirloom.</h2><p className="mt-4 max-w-md text-sm leading-6 watch-muted">Tell us which piece caught your eye and our boutique team can prepare a personal viewing.</p><div className="mt-6 flex items-center gap-3 text-[9px] font-semibold"><span className="flex h-10 w-10 items-center justify-center rounded-full watch-soft watch-accent"><Clock3 size={16}/></span> By appointment, at your pace</div></Reveal>
        <Reveal delay={0.1}><form onSubmit={(event)=>{event.preventDefault();setSubmitted(true);}} className="rounded-[1.4rem] border watch-line watch-panel p-5 shadow-xl sm:p-8"><div className="mb-5 flex items-center justify-between"><div><p className="text-[7px] font-extrabold uppercase tracking-[0.18em] watch-accent">Boutique enquiry</p><h3 className="mt-1 text-lg font-semibold">Arrange a private viewing</h3></div><Watch size={20} className="watch-accent"/></div><div className="grid gap-3 sm:grid-cols-2"><label className="rounded-xl border watch-line watch-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] watch-muted">Your name</span><input required value={clientName} onChange={(e)=>setClientName(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="Name"/></label><label className="rounded-xl border watch-line watch-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] watch-muted">Email</span><input required type="email" value={clientEmail} onChange={(e)=>setClientEmail(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="you@example.com"/></label><label className="rounded-xl border watch-line watch-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] watch-muted">Preferred timepiece</span><select value={selectedWatch} onChange={(e)=>setSelectedWatch(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none">{WATCHES.map((watch)=><option key={watch.id}>{watch.name}</option>)}</select></label><label className="rounded-xl border watch-line watch-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] watch-muted">Preferred date</span><input type="date" value={appointmentDate} onChange={(e)=>setAppointmentDate(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"/></label></div><div className="mt-5 flex flex-col justify-between gap-4 border-t watch-line pt-5 sm:flex-row sm:items-center"><p className="text-[9px] leading-5 watch-muted">{submitted?'Preview sent for '+selectedWatch+' • '+clientName+' • '+clientEmail:'Front-end demo form. Connect to your boutique inbox to receive real enquiries.'}</p><button type="submit" className="watch-button watch-accent-bg inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em]">Request appointment <ArrowRight size={13}/></button></div></form></Reveal>
      </div>
    </section>
  );

  const licenseSection = (
    <section id="licensing" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 watch-soft">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border watch-line watch-panel px-4 py-2 text-[7px] font-extrabold uppercase tracking-[0.16em] watch-accent"><Crown size={12}/> {SITE.brand} digital kit</span><h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">The watch experience, ready to launch.</h2><p className="mt-4 text-sm leading-6 watch-muted">A complete React landing page, campaign visuals, responsive gallery and commercial licensing options.</p><button type="button" onClick={()=>MERIDIAN_WATCH_HOUSE_FREE_SAMPLE_LINK ? window.open(MERIDIAN_WATCH_HOUSE_FREE_SAMPLE_LINK, '_blank', 'noopener,noreferrer') : goTo('licensing')} className="watch-button watch-accent-bg mt-5 rounded-full px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.13em]"><Play size={12} className="mr-2 inline"/>Watch free sample</button></Reveal>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-2">{[{tier:'standard',name:'Agency license',price:'$349',features:['React + Tailwind JSX','Watch scenes and product gallery','Three editable PSD mockups','Commercial client license']},{tier:'buyout',name:'Exclusive buyout',price:'$1,490',features:['Complete visual and JSX kit','10 custom campaign renders','Watch prompt ruleset','Exclusive brand transfer certificate']}].map((plan,index)=><Reveal key={plan.tier} delay={index*0.08}><article className={'h-full rounded-[1.4rem] border watch-line p-6 sm:p-8 '+(index===0?'watch-panel':'watch-inverse')}><div className="flex items-center justify-between gap-4"><span className="text-[8px] font-extrabold uppercase tracking-[0.15em] watch-accent">{plan.name}</span><span className="text-2xl font-semibold">{plan.price}</span></div><ul className="mt-6 space-y-3 text-[10px] leading-5">{plan.features.map((feature)=><li key={feature} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 watch-accent"/>{feature}</li>)}</ul><button type="button" onClick={()=>purchase(plan.tier)} className="watch-button watch-accent-bg mt-7 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.12em]">{index===0?<ShieldCheck size={14}/>:<Lock size={13}/>} Select {plan.price}</button></article></Reveal>)}</div>
      </div>
    </section>
  );

  const faqSection = (
    <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.7fr_1.3fr]"><Reveal><span className="text-[8px] font-extrabold uppercase tracking-[0.18em] watch-accent">Helpful details</span><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Good to know.</h2></Reveal><div className="divide-y watch-line">{FAQS.map(([question,answer],index)=><div key={question} className="border-b watch-line py-4"><button type="button" onClick={()=>setOpenFaq(openFaq===index?-1:index)} className="flex w-full items-center justify-between gap-4 text-left"><span className="text-xs font-semibold sm:text-sm">{question}</span><ChevronDown size={16} className={'shrink-0 watch-accent transition '+(openFaq===index?'rotate-180':'')}/></button><AnimatePresence initial={false}>{openFaq===index&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pr-8 pt-3 text-[10px] leading-6 watch-muted">{answer}</motion.p>}</AnimatePresence></div>)}</div></div>
    </section>
  );

  const sectionMap = {
    collection: collectionSection,
    craft: craftSection,
    gallery: gallerySection,
    appointment: appointmentSection,
    licensing: licenseSection,
    faq: faqSection
  };

  return (
    <div className="watch-page min-h-screen overflow-hidden font-sans relative" style={{'--wp-canvas':SITE.palette.canvas,'--wp-ink':SITE.palette.ink,'--wp-muted':SITE.palette.muted,'--wp-accent':SITE.palette.accent,'--wp-accent-contrast':SITE.palette.accentContrast,'--wp-panel':SITE.palette.panel,'--wp-soft':SITE.palette.soft,'--wp-line':SITE.palette.line,'--wp-inverse':SITE.palette.inverse,'--wp-inverse-ink':SITE.palette.inverseInk}}>
      <style>{STYLES}</style>
      <Helmet><title>{SITE.brand} | Modern Horology</title><meta name="description" content={SITE.description}/><meta name="theme-color" content={SITE.palette.inverse}/></Helmet>
      
      {/* PLIVAJUĆA DUGMAD: LEVO NA 2. STRANU SATOVA (Atelier Horology), DESNO NA 4. STRANU SATOVA (Lumen Watch Collective) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed inset-x-6 bottom-6 z-[9999] flex justify-between items-center pointer-events-none px-4"
      >
        <button
          type="button"
          onClick={() => navigate('/atelier-horology')}
          className="pointer-events-auto group flex items-center gap-3 rounded-full bg-[#172B31] text-white px-5 py-3.5 shadow-2xl border border-white/25 backdrop-blur-xl hover:bg-[#1E2D32] transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={14} className="text-white/70 group-hover:-translate-x-1 transition-transform" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B38B52] text-white group-hover:-rotate-12 transition-transform">
            <Watch size={16} />
          </span>
          <div className="text-left pr-1">
            <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-[#B38B52]">Prev Watch (2/5)</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-white">Atelier Horology</span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => navigate('/lumen-watch-collective')}
          className="pointer-events-auto group flex items-center gap-3 rounded-full bg-[#1A2C25] text-white px-5 py-3.5 shadow-2xl border border-white/25 backdrop-blur-xl hover:bg-[#233A31] transition-all duration-300 cursor-pointer"
        >
          <div className="text-right pl-1">
            <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-[#9E9366]">Next Watch (4/5)</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-white">Lumen Collective</span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#9E9366] text-white group-hover:rotate-12 transition-transform">
            <Watch size={16} />
          </span>
          <ArrowRight size={14} className="text-white/70 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <div className="watch-inverse px-4 py-2 text-center text-[7px] font-extrabold uppercase tracking-[0.2em] sm:text-[8px]">{SITE.topline}</div>
      <header className="sticky top-0 z-40 border-b watch-line watch-panel backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1460px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-3 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-full watch-inverse watch-accent"><Watch size={17}/></span><span><span className="block text-[10px] font-black uppercase tracking-[0.21em]">{SITE.brand}</span><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.16em] watch-muted">{SITE.descriptor}</span></span></button>
          <nav className="hidden items-center gap-6 text-[7px] font-extrabold uppercase tracking-[0.14em] watch-muted lg:flex" aria-label="Main navigation">
            <button type="button" onClick={()=>goTo('collection')}>Collection</button>
            <button type="button" onClick={()=>goTo('craft')}>Craft</button>
            <button type="button" onClick={()=>goTo('gallery')}>Journal</button>
            <button type="button" onClick={()=>goTo('licensing')}>The kit</button>
            <button type="button" onClick={()=>navigate('/atelier-horology')} className="text-[#B38B52] font-black flex items-center gap-1"><Watch size={12}/> Watch 2</button>
            <button type="button" onClick={()=>navigate('/lumen-watch-collective')} className="text-[#9E9366] font-black flex items-center gap-1"><Watch size={12}/> Watch 4</button>
          </nav>
          <button type="button" onClick={()=>goTo('appointment')} className="watch-button watch-accent-bg hidden rounded-full px-5 py-3 text-[7px] font-extrabold uppercase tracking-[0.13em] sm:inline-flex">Private viewing <ArrowRight size={12} className="ml-2"/></button>
          <button type="button" onClick={()=>setMenuOpen((value)=>!value)} aria-label="Toggle navigation" className="flex h-10 w-10 items-center justify-center rounded-full border watch-line lg:hidden">{menuOpen?<X size={17}/>:<Menu size={17}/>}</button>
        </div>
        <AnimatePresence>{menuOpen&&<motion.nav initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t watch-line lg:hidden"><div className="mx-auto flex max-w-[1460px] flex-col px-5 py-3 text-[8px] font-bold uppercase tracking-[0.12em] watch-muted">{[['Collection','collection'],['Craft','craft'],['Journal','gallery'],['Viewing','appointment'],['The kit','licensing']].map(([label,id])=><button key={id} type="button" onClick={()=>goTo(id)} className="py-3 text-left">{label}</button>)}<button type="button" onClick={()=>navigate('/atelier-horology')} className="py-3 text-left text-[#B38B52] font-black">Prev Watch (2/5)</button><button type="button" onClick={()=>navigate('/lumen-watch-collective')} className="py-3 text-left text-[#9E9366] font-black">Next Watch (4/5)</button></div></motion.nav>}</AnimatePresence>
      </header>
      <main>
        {hero}
        {SITE.order.map((section)=><React.Fragment key={section}>{sectionMap[section]}</React.Fragment>)}
        <section className="px-4 py-12 sm:px-8 sm:py-16"><Reveal className="mx-auto max-w-[1440px]"><div className="relative overflow-hidden rounded-[1.5rem] watch-inverse p-7 sm:p-12"><div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/20"/><div className="relative max-w-3xl"><span className="text-[7px] font-extrabold uppercase tracking-[0.2em] watch-accent">Time, made personal</span><h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">A closer look begins with a conversation.</h2><p className="mt-4 max-w-xl text-xs leading-6 text-white/70">Explore the watch collection or arrange a private viewing with the boutique team.</p><button type="button" onClick={()=>goTo('appointment')} className="watch-button watch-accent-bg mt-6 rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em]">Request a viewing <ArrowRight size={13} className="ml-2 inline"/></button></div></div></Reveal></section>
      </main>
      <footer className="border-t watch-line px-4 py-7 sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><div><span className="block text-[10px] font-black uppercase tracking-[0.2em]">{SITE.brand}</span><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.15em] watch-muted">Modern horology / {SITE.descriptor}</span></div><p className="text-[9px] watch-muted">{SITE.footer}</p><button type="button" onClick={()=>navigate('/stock')} className="text-[8px] font-extrabold uppercase tracking-[0.12em] watch-accent">Back to stock vaults <ArrowRight size={11} className="ml-1 inline"/></button></div></footer>
      <AnimatePresence>{preview&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={()=>setPreview(null)}><button type="button" onClick={()=>setPreview(null)} aria-label="Close image preview" className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X size={19}/></button><img src={preview} alt="Luxury watch detail" className="max-h-[90vh] max-w-full rounded-xl object-contain" onClick={(e)=>e.stopPropagation()}/></motion.div>}</AnimatePresence>
      <AnimatePresence>{videoOpen&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Watch campaign video" onClick={()=>setVideoOpen(false)}><button type="button" onClick={()=>setVideoOpen(false)} aria-label="Close video" className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X size={19}/></button>{WATCH_VIDEO_URL?<video controls autoPlay playsInline className="max-h-[85vh] max-w-full rounded-xl"><source src={WATCH_VIDEO_URL} type="video/mp4"/></video>:<div className="flex min-h-[340px] w-full max-w-2xl flex-col items-center justify-center rounded-[1.5rem] border border-white/20 bg-[#101a25] p-8 text-center text-white" onClick={(e)=>e.stopPropagation()}><Video size={38} className="watch-accent"/><p className="mt-5 text-[8px] font-extrabold uppercase tracking-[0.2em] watch-accent">Your campaign video goes here</p><h2 className="mt-3 text-2xl font-semibold">Video placeholder</h2><p className="mt-3 max-w-md text-xs leading-6 text-white/65">Set WATCH_VIDEO_URL near the top of this JSX file to your MP4 URL or public path.</p><code className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-[9px] text-white/85">const WATCH_VIDEO_URL = '';</code></div>}</motion.div>}</AnimatePresence>
      <LoginRequiredModal isOpen={login.isOpen} onClose={()=>setLogin({isOpen:false,tierName:'',price:'0.00',zipLink:''})} packageName={login.tierName} price={login.price} onLoginSuccess={async(account)=>{await recordIntent(account,login.tierName,login.price);setCheckout({isOpen:true,name:login.tierName,price:login.price,zipLink:login.zipLink});setLogin({isOpen:false,tierName:'',price:'0.00',zipLink:''});}}/>
      <AnimatePresence>{checkout.isOpen&&<V8SecureCheckout isOpen={checkout.isOpen} productName={checkout.name} price={checkout.price} zipLink={checkout.zipLink} onClose={()=>setCheckout({isOpen:false,name:'',price:'0.00',zipLink:''})}/>}</AnimatePresence>
    </div>
  );
};

export default MeridianWatchHouse;
// ============================================================================
// KRAJ FAJLA: MeridianWatchHouse.jsx
// ============================================================================