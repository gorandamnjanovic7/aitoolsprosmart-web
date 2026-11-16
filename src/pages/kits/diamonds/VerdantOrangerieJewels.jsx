// ============================================================================
// POČETAK FAJLA: VerdantOrangerieJewels.jsx
// ============================================================================
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, ArrowLeft, ArrowUpRight, Calendar, CheckCircle2, ChevronDown,
  Crown, Gem, Lock, Menu, Play, ShieldCheck, Sparkles, Video, X, Watch
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
  standardZipLink: 'https://drive.google.com/your-standard-349-kit-link',
  buyoutZipLink: 'https://drive.google.com/your-exclusive-1490-buyout-link',
  freeSampleLink: 'https://drive.google.com/file/d/1B9b3BI5nfkbSDriZUm0dqjYxbZf2GEmp/view?usp=sharing',
};

const SITE = {"brand": "Verdant Orangerie", "descriptor": "High jewelry / nature in precious form", "analyticsLabel": "Verdant_Orangerie_Jewels", "topline": "Living forms • Precious detail • Crafted to endure", "kicker": "The garden, rendered in light", "titleBefore": "Nature, made ", "titleEmphasis": "precious.", "titleAfter": "", "description": "A botanical high jewelry collection of green tones, luminous diamonds and organic silhouettes, imagined as keepsakes from a private garden.", "footer": "A lasting study of the natural world.", "heroStyle": "minimal", "cardLayout": "compact", "formLayout": "wide", "order": ["appointment", "collection", "craft", "gallery", "faq", "licensing"], "palette": {"canvas": "#F0F3E9", "ink": "#233A30", "muted": "#728073", "accent": "#AD9259", "accentContrast": "#1F2C24", "panel": "#FBFCF7", "soft": "#DEE7DA", "line": "#C7D4C7", "inverse": "#173027", "inverseInk": "#F8FAF5"}, "heroImage": "https://images.unsplash.com/photo-1689775702852-382de6f07fc3?auto=format&fit=crop&w=2200&q=90"};

const JEWELRY_VIDEO_URL = '';
const VERDANT_ORANGERIE_FREE_SAMPLE_LINK = '';

const PIECES = [
  { id: "hero-01", category: "earrings", reference: "01 / VO-01", name: "Fernlight Studs", detail: "Rose gold • diamonds on deep green", image: "https://images.unsplash.com/photo-1769078595478-5f756986b818?auto=format&fit=crop&w=1500&q=88" },
  { id: "ring-02", category: "rings", reference: "02 / VO-07", name: "Wildflower Pair", detail: "Natural crystal • botanical composition", image: "https://images.unsplash.com/photo-1654422958642-6b4ca03a8796?auto=format&fit=crop&w=1500&q=88" },
  { id: "ring-03", category: "rings", reference: "03 / VO-12", name: "Golden Seed Ring", detail: "Faceted yellow stone • sculptural gold", image: "https://images.unsplash.com/photo-1786839832597-3d0052d17bad?auto=format&fit=crop&w=1500&q=88" },
  { id: "necklace-04", category: "necklaces", reference: "04 / VO-19", name: "Pearl Canopy", detail: "Pearl and diamond necklace • graceful line", image: "https://images.unsplash.com/photo-1719862057229-4dd650b5ccee?auto=format&fit=crop&w=1500&q=88" },
  { id: "ring-05", category: "rings", reference: "05 / VO-24", name: "Orangerie Collection", detail: "Hand-finished gold rings • display edit", image: "https://images.unsplash.com/photo-1758995116142-c626a962a682?auto=format&fit=crop&w=1500&q=88" }
];

const GALLERY_PIECES = [
  { id: "journal-01", reference: "Journal / 01", name: "Journal frame 01", image: "https://images.unsplash.com/photo-1769857879388-df93b4c96bca?auto=format&fit=crop&w=1400&q=90" },
  { id: "journal-02", reference: "Journal / 02", name: "Journal frame 02", image: "https://images.unsplash.com/photo-1789205463827-8c4ab060083b?auto=format&fit=crop&w=1400&q=90" },
  { id: "journal-03", reference: "Journal / 03", name: "Journal frame 03", image: "https://images.unsplash.com/photo-1778000000868-3cdfcb1511f6?auto=format&fit=crop&w=1400&q=90" }
];

const FAQS = [
  ['What is included in the agency license?', 'The agency edition includes the React and Tailwind landing-page source, a fine-jewelry visual library, editable mockups and a commercial client license.'],
  ['Can I replace the images and campaign video?', 'Yes. Update the piece imagery and set JEWELRY_VIDEO_URL to your MP4 URL or public path. The page includes a visible campaign-film placeholder.'],
  ['What does the exclusive buyout include?', 'The single-buyer package includes the complete JSX kit, custom campaign visuals and exclusive brand-transfer details listed in the licensing section.'],
  ['Does the appointment form confirm an order?', 'No. It is a front-end enquiry preview. Connect it to your CRM, email webhook or boutique team to receive real requests.']
];

const Reveal = ({ children, className = '', delay = 0 }) => {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.13 }}
      transition={{ duration: reduceMotion ? 0 : 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

const STYLES = '.jewel-page{background:var(--jp-canvas);color:var(--jp-ink)}' +
  '.jewel-panel{background:var(--jp-panel);border-color:var(--jp-line)}' +
  '.jewel-soft{background:var(--jp-soft)}' +
  '.jewel-muted{color:var(--jp-muted)}' +
  '.jewel-accent{color:var(--jp-accent)}' +
  '.jewel-accent-bg{background:var(--jp-accent);color:var(--jp-accent-contrast)}' +
  '.jewel-inverse{background:var(--jp-inverse);color:var(--jp-inverse-ink)}' +
  '.jewel-line{border-color:var(--jp-line)}' +
  '.jewel-button{transition:transform .25s ease,filter .25s ease,box-shadow .25s ease}' +
  '.jewel-button:hover{transform:translateY(-2px);filter:brightness(1.04);box-shadow:0 12px 28px rgba(0,0,0,.12)}' +
  '.jewel-hero-film>.jewel-film-slot{height:100%;min-height:100%;border-radius:0}' +
  '.jewel-page ::selection{background:var(--jp-accent);color:var(--jp-accent-contrast)}' +
  '@media(prefers-reduced-motion:reduce){.jewel-button{transition:none}}';

const cardLayouts = {
  classic: 'sm:grid-cols-2 xl:grid-cols-3',
  editorial: 'sm:grid-cols-2 xl:grid-cols-3',
  wide: 'sm:grid-cols-2',
  mosaic: 'sm:grid-cols-2 xl:grid-cols-4',
  compact: 'sm:grid-cols-2 xl:grid-cols-4'
};

const VerdantOrangerieJewels = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [preview, setPreview] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState(PIECES[0].name);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [checkout, setCheckout] = useState({ isOpen: false, name: '', price: '0.00', zipLink: '' });
  const [login, setLogin] = useState({ isOpen: false, tierName: '', price: '0.00', zipLink: '' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (account) => setUser(account || null));
    trackV8Action('page_view', { event_category: 'High_Ticket_Kit', event_label: SITE.analyticsLabel });
    return () => unsubscribe();
  }, []);

  const goTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const visiblePieces = filter === 'all' ? PIECES : PIECES.filter((piece) => piece.category === filter);

  const recordIntent = async (account, productName, price) => {
    try {
      await addDoc(collection(db, 'v8_payoneer_requests'), {
        ime: account.displayName || 'B2B Agency Client',
        email: account.email,
        uid: account.uid,
        zeliPaket: productName,
        paketId: price === '1490.00' ? 'high_jewelry_buyout_1490' : 'high_jewelry_kit_349',
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
      ? SITE.brand + ' Exclusive High Jewelry Buyout + React Kit'
      : SITE.brand + ' Agency License: High Jewelry Landing Page + Visual Scenes';
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
    <div className="jewel-film-slot group relative flex min-h-[250px] w-full items-center justify-center overflow-hidden rounded-[1.35rem] jewel-inverse sm:min-h-[340px]">
      {JEWELRY_VIDEO_URL ? (
        <video controls playsInline className="absolute inset-0 h-full w-full object-cover">
          <source src={JEWELRY_VIDEO_URL} type="video/mp4" />
        </video>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <button type="button" onClick={() => setVideoOpen(true)} className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/65 bg-white/15 backdrop-blur"><Play size={19} fill="currentColor" /></span>
            <span className="text-[8px] font-black uppercase tracking-[0.22em]">Campaign film placeholder</span>
            <span className="max-w-sm text-xs leading-5 text-white/75">Add your jewelry video in JEWELRY_VIDEO_URL</span>
          </button>
        </>
      )}
      <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-white/25 bg-black/25 px-3 py-2 text-[7px] font-extrabold uppercase tracking-[0.16em] text-white backdrop-blur">Video slot / replace source</span>
    </div>
  );

  const videoCta = (
    <button type="button" onClick={() => setVideoOpen(true)} className="inline-flex items-center gap-2 rounded-full border jewel-line jewel-panel px-4 py-3 text-[8px] font-extrabold uppercase tracking-[0.13em]">
      <Play size={12} /> View campaign-film placeholder
    </button>
  );

  const heroImagePanel = (className) => (
    <div className={'group relative overflow-hidden jewel-inverse ' + className}>
      <img src={SITE.heroImage} alt={SITE.brand + ' diamond jewelry'} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <button type="button" onClick={() => setPreview(SITE.heroImage)} aria-label="Inspect featured jewelry" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/45 bg-black/20 text-white backdrop-blur"><ArrowUpRight size={16} /></button>
      <button type="button" onClick={() => setVideoOpen(true)} className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/45 px-4 py-2.5 text-[8px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur"><Play size={11} /> Film placeholder</button>
    </div>
  );

  const hero = SITE.heroStyle === 'cinema' ? (
    <section className="relative flex min-h-[720px] items-end overflow-hidden px-4 pb-12 pt-32 sm:px-8 sm:pb-16 lg:min-h-[880px]">
      <div className="jewel-hero-film absolute inset-0">{videoPlaceholder}</div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
      <div className="relative z-10 mx-auto grid w-full max-w-[1460px] gap-8 pb-5 lg:grid-cols-[1fr_350px] lg:items-end">
        <Reveal className="max-w-4xl"><span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/20 px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.2em] text-white"><Sparkles size={12}/>{SITE.kicker}</span><h1 className="mt-6 text-5xl font-light leading-[0.91] tracking-[-0.06em] text-white sm:text-7xl lg:text-[6.3rem]">{SITE.titleBefore}<span className="font-serif italic jewel-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1><p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">{SITE.description}</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={()=>goTo('appointment')} className="jewel-button jewel-accent-bg rounded-full px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.14em]">Arrange a private viewing <ArrowRight size={14} className="ml-2 inline"/></button><button type="button" onClick={()=>goTo('collection')} className="rounded-full border border-white/35 bg-white/10 px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.14em] text-white">Discover the collection <ArrowUpRight size={14} className="ml-2 inline"/></button></div></Reveal>
        <Reveal delay={0.12} className="rounded-[1.4rem] border border-white/20 bg-black/35 p-5 text-white backdrop-blur-xl"><span className="text-[8px] font-extrabold uppercase tracking-[0.17em] text-white/60">The high jewelry edit</span><h2 className="mt-3 text-xl font-semibold">{SITE.brand}</h2><p className="mt-2 text-xs leading-5 text-white/65">Exceptional stones, precise setting and pieces designed to live beyond a single moment.</p><div className="mt-5 grid grid-cols-3 border-t border-white/20 pt-4 text-center"><div><strong>06</strong><span className="mt-1 block text-[7px] uppercase tracking-[0.12em] text-white/55">Pieces</span></div><div><strong>04</strong><span className="mt-1 block text-[7px] uppercase tracking-[0.12em] text-white/55">Categories</span></div><div><strong>01</strong><span className="mt-1 block text-[7px] uppercase tracking-[0.12em] text-white/55">Atelier</span></div></div></Reveal>
      </div>
    </section>
  ) : SITE.heroStyle === 'showroom' ? (
    <section className="mx-auto grid max-w-[1460px] gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-20">
      <Reveal><span className="text-[8px] font-extrabold uppercase tracking-[0.23em] jewel-accent">{SITE.kicker}</span><h1 className="mt-5 max-w-xl text-5xl font-semibold leading-[0.93] tracking-[-0.055em] sm:text-7xl">{SITE.titleBefore}<span className="font-serif italic jewel-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1><p className="mt-6 max-w-lg text-sm leading-7 jewel-muted">{SITE.description}</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={()=>goTo('collection')} className="jewel-button jewel-accent-bg rounded-full px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em]">Discover the collection <ArrowRight size={14} className="ml-2 inline"/></button>{videoCta}</div><div className="mt-10 flex gap-6 border-t jewel-line pt-5"><div><strong className="text-2xl">06</strong><span className="ml-2 text-[7px] font-bold uppercase tracking-[0.12em] jewel-muted">Signature pieces</span></div><div><strong className="text-2xl">01</strong><span className="ml-2 text-[7px] font-bold uppercase tracking-[0.12em] jewel-muted">Atelier</span></div></div></Reveal>
      <Reveal delay={0.1} className="relative"><div className="absolute -right-3 -top-3 h-full w-full border jewel-line"/><div className="relative min-h-[440px] overflow-hidden jewel-inverse sm:min-h-[610px]"><img src={SITE.heroImage} alt="High jewelry piece in a studio setting" className="h-full min-h-[440px] w-full object-cover sm:min-h-[610px]"/><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/><span className="absolute bottom-5 left-5 text-[8px] font-extrabold uppercase tracking-[0.18em] text-white/80">Selected piece / {PIECES[0].reference}</span></div></Reveal>
    </section>
  ) : SITE.heroStyle === 'mosaic' ? (
    <section className="mx-auto max-w-[1460px] px-4 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-16">
      <Reveal className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><span className="text-[8px] font-extrabold uppercase tracking-[0.22em] jewel-accent">{SITE.kicker}</span><h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] sm:text-7xl">{SITE.titleBefore}<span className="font-serif italic jewel-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1></div><div className="max-w-sm"><p className="text-sm leading-7 jewel-muted">{SITE.description}</p><button type="button" onClick={()=>goTo('appointment')} className="jewel-button jewel-accent-bg mt-5 rounded-full px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em]">Arrange a viewing <ArrowRight size={13} className="ml-2 inline"/></button></div></Reveal>
      <div className="mt-8 grid gap-3 md:grid-cols-12"><Reveal className="relative min-h-[440px] overflow-hidden rounded-[1.5rem] md:col-span-7 md:row-span-2"><div className="h-full min-h-[440px]">{videoPlaceholder}</div></Reveal><Reveal delay={0.08} className="relative min-h-[210px] overflow-hidden rounded-[1.5rem] md:col-span-5"><img src={PIECES[1].image} alt={PIECES[1].name} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><p className="absolute bottom-4 left-4 text-sm font-semibold text-white">{PIECES[1].name}</p></Reveal><Reveal delay={0.13} className="relative min-h-[210px] overflow-hidden rounded-[1.5rem] md:col-span-5"><img src={PIECES[2].image} alt={PIECES[2].name} className="absolute inset-0 h-full w-full object-cover"/><div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent"/><p className="absolute bottom-4 left-4 text-sm font-semibold text-white">{PIECES[2].name}</p></Reveal></div>
    </section>
  ) : SITE.heroStyle === 'minimal' ? (
    <section className="mx-auto grid max-w-[1460px] gap-8 px-4 py-12 sm:px-8 sm:py-20 lg:grid-cols-[1fr_0.82fr] lg:items-center">
      <Reveal><span className="text-[8px] font-extrabold uppercase tracking-[0.24em] jewel-accent">{SITE.kicker}</span><h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[0.98] tracking-[-0.05em] sm:text-7xl">{SITE.titleBefore}<span className="italic jewel-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1><p className="mt-6 max-w-xl text-sm leading-7 jewel-muted">{SITE.description}</p><button type="button" onClick={()=>goTo('collection')} className="jewel-button jewel-accent-bg mt-8 rounded-full px-7 py-4 text-[8px] font-extrabold uppercase tracking-[0.14em]">Explore the pieces <ArrowRight size={14} className="ml-2 inline"/></button><p className="mt-7 text-[8px] font-bold uppercase tracking-[0.17em] jewel-muted">Made to be worn, remembered and passed on.</p></Reveal>
      <Reveal delay={0.12} className="relative mx-auto w-full max-w-xl"><div className="absolute -left-4 -top-4 h-full w-full rounded-full border jewel-line"/>{videoPlaceholder}<div className="absolute -bottom-4 right-4 rounded-xl jewel-panel px-4 py-3 shadow-xl"><span className="text-[7px] font-extrabold uppercase tracking-[0.15em] jewel-accent">The campaign film</span><p className="mt-1 text-xs font-semibold">A moving study of light and stone.</p></div></Reveal>
    </section>
  ) : (
    <section className="mx-auto grid max-w-[1460px] gap-8 px-4 py-10 sm:px-8 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-20">
      <Reveal><span className="inline-flex items-center gap-2 rounded-full border jewel-line jewel-panel px-4 py-2 text-[8px] font-extrabold uppercase tracking-[0.18em] jewel-accent"><Gem size={13}/>{SITE.kicker}</span><h1 className="mt-6 max-w-2xl text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-7xl">{SITE.titleBefore}<span className="font-serif italic jewel-accent">{SITE.titleEmphasis}</span>{SITE.titleAfter}</h1><p className="mt-6 max-w-xl text-sm leading-7 jewel-muted">{SITE.description}</p><div className="mt-8 flex flex-wrap gap-3"><button type="button" onClick={()=>goTo('appointment')} className="jewel-button jewel-accent-bg rounded-full px-6 py-4 text-[8px] font-extrabold uppercase tracking-[0.13em]">Book a private viewing <ArrowRight size={13} className="ml-2 inline"/></button>{videoCta}</div></Reveal>
      <Reveal delay={0.1} className="relative">{heroImagePanel('h-[440px] rounded-[1.8rem] sm:h-[610px]')}<div className="absolute -bottom-4 left-5 rounded-xl jewel-panel px-4 py-3 shadow-xl"><span className="text-[7px] font-extrabold uppercase tracking-[0.15em] jewel-accent">High jewelry / 01</span><p className="mt-1 text-xs font-semibold">{PIECES[0].name}</p></div></Reveal>
    </section>
  );

  const collectionSection = (
    <section id="collection" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] jewel-accent">The collection</span><h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Designed to hold a little light.</h2></div><p className="max-w-md text-sm leading-6 jewel-muted">Explore remarkable stones, refined settings and pieces composed to become part of your story.</p></Reveal>
        <div className="mt-7 flex flex-wrap gap-2">{[['all','All pieces'],['rings','Rings'],['necklaces','Necklaces'],['earrings','Earrings'],['bracelets','Bracelets']].map(([id,label])=><button key={id} type="button" onClick={()=>setFilter(id)} className={'rounded-full border px-4 py-2.5 text-[8px] font-extrabold uppercase tracking-[0.12em] transition '+(filter===id?'jewel-accent-bg border-transparent':'jewel-panel jewel-line')}>{label}</button>)}</div>
        <div className={'mt-7 grid gap-4 '+cardLayouts[SITE.cardLayout]}><AnimatePresence mode="popLayout">{visiblePieces.map((piece,index)=><motion.article key={piece.id} layout initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,scale:0.96}} whileHover={{y:-5}} transition={{delay:index*0.035}} className={'group overflow-hidden rounded-[1.3rem] border jewel-line jewel-panel '+(SITE.cardLayout==='mosaic'&&index===0?'xl:col-span-2 xl:row-span-2':'')}><button type="button" onClick={()=>setPreview(piece.image)} className="relative block aspect-[1.12] w-full overflow-hidden jewel-inverse text-left"><img src={piece.image} alt={piece.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-[7px] font-extrabold uppercase tracking-[0.13em] text-white backdrop-blur">{piece.reference}</span><span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 jewel-accent"><ArrowUpRight size={14}/></span></button><div className="p-4 sm:p-5"><span className="text-[7px] font-extrabold uppercase tracking-[0.15em] jewel-accent">{piece.category} collection</span><h3 className="mt-2 text-lg font-semibold">{piece.name}</h3><p className="mt-2 text-[10px] leading-5 jewel-muted">{piece.detail}</p><button type="button" onClick={()=>{setSelectedPiece(piece.name);goTo('appointment');}} className="mt-4 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.13em] jewel-accent">Enquire about this piece <ArrowRight size={12}/></button></div></motion.article>)}</AnimatePresence></div>
      </div>
    </section>
  );

  const craftSection = (
    <section id="craft" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 jewel-soft">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="mb-8 max-w-3xl"><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] jewel-accent">The atelier</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Brilliance, considered from every angle.</h2><p className="mt-4 text-sm leading-6 jewel-muted">The character of each piece begins with the stone and is finished by patient, precise hands.</p></Reveal>
        <div className="grid gap-4 md:grid-cols-3">{[['01 / Selection','Stones with presence','Each diamond is chosen for its character, cut, clarity and natural fire.',Gem],['02 / Setting','Light, held in place','A considered setting protects the stone while letting its brilliance travel.',Sparkles],['03 / Provenance','A story you can trust','Thoughtful sourcing and clear details accompany every private consultation.',ShieldCheck]].map(([number,title,copy,Icon],index)=><Reveal key={number} delay={index*0.07}><article className="h-full rounded-[1.2rem] border jewel-line jewel-panel p-6 sm:p-8"><span className="flex h-11 w-11 items-center justify-center rounded-full jewel-soft jewel-accent"><Icon size={18}/></span><p className="mt-6 text-[7px] font-extrabold uppercase tracking-[0.17em] jewel-accent">{number}</p><h3 className="mt-2 text-xl font-semibold">{title}</h3><p className="mt-3 text-xs leading-6 jewel-muted">{copy}</p></article></Reveal>)}</div>
      </div>
    </section>
  );

  const gallerySection = (
    <section id="gallery" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 jewel-inverse">
      <div className="mx-auto max-w-[1440px]">
        <Reveal className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="text-[8px] font-extrabold uppercase tracking-[0.2em] jewel-accent">The jewelry journal</span><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">A study in light, line and stone.</h2><p className="mt-3 max-w-xl text-xs leading-6 opacity-65">Campaign frames, details and signature pieces from the atelier.</p></div><button type="button" onClick={()=>setVideoOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.14em]"><Video size={13}/> Open film placeholder</button></Reveal>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{GALLERY_PIECES.map((piece,index)=><Reveal key={piece.id} delay={index*0.04}><button type="button" onClick={()=>setPreview(piece.image)} className={'group relative w-full overflow-hidden rounded-[1.2rem] text-left '+(index===0?'h-[420px] sm:row-span-2':'h-[260px]')}><img src={piece.image} alt={piece.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"/><span className="absolute bottom-4 left-4"><span className="block text-[7px] font-extrabold uppercase tracking-[0.15em] text-white/70">{piece.reference}</span><span className="mt-1 block text-sm font-semibold text-white">{piece.name}</span></span></button></Reveal>)}</div>
      </div>
    </section>
  );

  const appointmentSection = (
    <section id="appointment" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className={'mx-auto grid max-w-[1320px] items-center gap-9 '+(SITE.formLayout==='wide'?'lg:grid-cols-1':'lg:grid-cols-[0.75fr_1.25fr]')}>
        <Reveal><span className="inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.2em] jewel-accent"><Calendar size={13}/> A private consultation</span><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Find the piece that feels like yours.</h2><p className="mt-4 max-w-md text-sm leading-6 jewel-muted">Tell us what caught your eye and our jewelry team can prepare a personal appointment.</p></Reveal>
        <Reveal delay={0.1}><form onSubmit={(event)=>{event.preventDefault();setSubmitted(true);}} className="rounded-[1.4rem] border jewel-line jewel-panel p-5 shadow-xl sm:p-8"><div className="mb-5 flex items-center justify-between"><div><p className="text-[7px] font-extrabold uppercase tracking-[0.18em] jewel-accent">Atelier appointment</p><h3 className="mt-1 text-lg font-semibold">Arrange a private viewing</h3></div><Gem size={20} className="jewel-accent"/></div><div className="grid gap-3 sm:grid-cols-2"><label className="rounded-xl border jewel-line jewel-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] jewel-muted">Your name</span><input required value={clientName} onChange={(e)=>setClientName(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="Name"/></label><label className="rounded-xl border jewel-line jewel-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] jewel-muted">Email</span><input required type="email" value={clientEmail} onChange={(e)=>setClientEmail(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none" placeholder="you@example.com"/></label><label className="rounded-xl border jewel-line jewel-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] jewel-muted">Piece of interest</span><select value={selectedPiece} onChange={(e)=>setSelectedPiece(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none">{PIECES.map((piece)=><option key={piece.id}>{piece.name}</option>)}</select></label><label className="rounded-xl border jewel-line jewel-soft p-3"><span className="text-[7px] font-extrabold uppercase tracking-[0.12em] jewel-muted">Preferred date</span><input type="date" value={appointmentDate} onChange={(e)=>setAppointmentDate(e.target.value)} className="mt-2 w-full bg-transparent text-sm font-semibold outline-none"/></label></div><div className="mt-5 flex flex-col justify-between gap-4 border-t jewel-line pt-5 sm:flex-row sm:items-center"><p className="text-[9px] leading-5 jewel-muted">{submitted?'Preview: '+selectedPiece+' • '+clientName+' • '+clientEmail:'Front-end demo form. Connect it to your boutique inbox to receive real enquiries.'}</p><button type="submit" className="jewel-button jewel-accent-bg inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em]">Request appointment <ArrowRight size={13}/></button></div></form></Reveal>
      </div>
    </section>
  );

  const licenseSection = (
    <section id="licensing" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24 jewel-soft">
      <div className="mx-auto max-w-[1240px]">
        <Reveal className="mx-auto max-w-3xl text-center"><span className="inline-flex items-center gap-2 rounded-full border jewel-line jewel-panel px-4 py-2 text-[7px] font-extrabold uppercase tracking-[0.16em] jewel-accent"><Crown size={12}/>{SITE.brand} digital kit</span><h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">The high jewelry experience, ready to launch.</h2><p className="mt-4 text-sm leading-6 jewel-muted">A complete React landing page, campaign visuals, responsive collection and commercial licensing options.</p><button type="button" onClick={()=>window.open(KIT_CONFIG.freeSampleLink, '_blank', 'noopener,noreferrer')} className="jewel-button jewel-accent-bg mt-5 rounded-full px-5 py-3 text-[8px] font-extrabold uppercase tracking-[0.13em]"><Play size={12} className="mr-2 inline"/>Watch free sample</button></Reveal>
        <div className="mx-auto mt-8 grid max-w-5xl gap-4 lg:grid-cols-2">{[{tier:'standard',name:'Agency license',price:'$349',features:['React + Tailwind JSX','High jewelry scene gallery','Three editable PSD mockups','Commercial client license']},{tier:'buyout',name:'Exclusive buyout',price:'$1,490',features:['Complete visual and JSX kit','10 custom campaign renders','High jewelry prompt ruleset','Exclusive brand transfer certificate']}].map((plan,index)=><Reveal key={plan.tier} delay={index*0.08}><article className={'h-full rounded-[1.4rem] border jewel-line p-6 sm:p-8 '+(index===0?'jewel-panel':'jewel-inverse')}><div className="flex items-center justify-between gap-4"><span className="text-[8px] font-extrabold uppercase tracking-[0.15em] jewel-accent">{plan.name}</span><span className="text-2xl font-semibold">{plan.price}</span></div><ul className="mt-6 space-y-3 text-[10px] leading-5">{plan.features.map((feature)=><li key={feature} className="flex gap-2"><CheckCircle2 size={14} className="mt-0.5 shrink-0 jewel-accent"/>{feature}</li>)}</ul><button type="button" onClick={()=>purchase(plan.tier)} className="jewel-button jewel-accent-bg mt-7 flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-[8px] font-extrabold uppercase tracking-[0.12em]">{index===0?<ShieldCheck size={14}/>:<Lock size={13}/>} Select {plan.price}</button></article></Reveal>)}</div>
      </div>
    </section>
  );

  const faqSection = (
    <section id="faq" className="scroll-mt-24 px-4 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[0.7fr_1.3fr]"><Reveal><span className="text-[8px] font-extrabold uppercase tracking-[0.18em] jewel-accent">Helpful details</span><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Good to know.</h2></Reveal><div className="divide-y jewel-line">{FAQS.map(([question,answer],index)=><div key={question} className="border-b jewel-line py-4"><button type="button" onClick={()=>setOpenFaq(openFaq===index?-1:index)} className="flex w-full items-center justify-between gap-4 text-left"><span className="text-xs font-semibold sm:text-sm">{question}</span><ChevronDown size={16} className={'shrink-0 jewel-accent transition '+(openFaq===index?'rotate-180':'')}/></button><AnimatePresence initial={false}>{openFaq===index&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pr-8 pt-3 text-[10px] leading-6 jewel-muted">{answer}</motion.p>}</AnimatePresence></div>)}</div></div>
    </section>
  );

  const sectionMap = { collection: collectionSection, craft: craftSection, gallery: gallerySection, appointment: appointmentSection, licensing: licenseSection, faq: faqSection };

  return (
    <div className="jewel-page min-h-screen overflow-hidden font-sans relative" style={{'--jp-canvas':SITE.palette.canvas,'--jp-ink':SITE.palette.ink,'--jp-muted':SITE.palette.muted,'--jp-accent':SITE.palette.accent,'--jp-accent-contrast':SITE.palette.accentContrast,'--jp-panel':SITE.palette.panel,'--jp-soft':SITE.palette.soft,'--jp-line':SITE.palette.line,'--jp-inverse':SITE.palette.inverse,'--jp-inverse-ink':SITE.palette.inverseInk}}>
      <style>{STYLES}</style>
      <Helmet><title>{SITE.brand} | Diamonds & High Jewelry</title><meta name="description" content={SITE.description}/><meta name="theme-color" content={SITE.palette.inverse}/></Helmet>
      
      {/* PLIVAJUĆA DUGMAD: LEVO NA MONARCH TIMEPIECES (5. SAT), DESNO NA DIAMOND PAGE 2 */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed inset-x-6 bottom-6 z-[9999] flex justify-between items-center pointer-events-none px-4"
      >
        {/* LEVO DUGME: POVRATAK NA MONARCH TIMEPIECES */}
        <button
          type="button"
          onClick={() => navigate('/monarch-timepieces')}
          className="pointer-events-auto group flex items-center gap-3 rounded-full bg-[#341923] text-white px-5 py-3.5 shadow-2xl border border-white/25 backdrop-blur-xl hover:bg-[#472230] transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft size={14} className="text-white/70 group-hover:-translate-x-1 transition-transform" />
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B5576B] text-white group-hover:-rotate-12 transition-transform">
            <Watch size={16} />
          </span>
          <div className="text-left pr-1">
            <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-[#B5576B]">Previous Kit</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-white">Monarch Timepieces</span>
          </div>
        </button>

        {/* DESNO DUGME: PRELAZAK NA STRANICU 2 ZA DIJAMANTE */}
        <button
          type="button"
          onClick={() => navigate('/diamond-page-2')}
          className="pointer-events-auto group flex items-center gap-3 rounded-full bg-[#173027] text-white px-5 py-3.5 shadow-2xl border border-white/25 backdrop-blur-xl hover:bg-[#204237] transition-all duration-300 cursor-pointer"
        >
          <div className="text-right pl-1">
            <span className="block text-[7px] font-black uppercase tracking-[0.2em] text-[#AD9259]">Next Collection</span>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-white">Diamonds Page 2</span>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#AD9259] text-white group-hover:rotate-12 transition-transform">
            <Gem size={16} />
          </span>
          <ArrowRight size={14} className="text-white/70 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      <div className="jewel-inverse px-4 py-2 text-center text-[7px] font-extrabold uppercase tracking-[0.2em] sm:text-[8px]">{SITE.topline}</div>
      <header className="sticky top-0 z-40 border-b jewel-line jewel-panel backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1460px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <button type="button" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} className="flex items-center gap-3 text-left"><span className="flex h-10 w-10 items-center justify-center rounded-full jewel-inverse jewel-accent"><Gem size={17}/></span><span><span className="block text-[10px] font-black uppercase tracking-[0.21em]">{SITE.brand}</span><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.16em] jewel-muted">{SITE.descriptor}</span></span></button>
          <nav className="hidden items-center gap-6 text-[7px] font-extrabold uppercase tracking-[0.14em] jewel-muted lg:flex" aria-label="Main navigation">
            <button type="button" onClick={()=>goTo('collection')}>Collection</button>
            <button type="button" onClick={()=>goTo('craft')}>Craft</button>
            <button type="button" onClick={()=>goTo('gallery')}>Journal</button>
            <button type="button" onClick={()=>goTo('licensing')}>The kit</button>
            <button type="button" onClick={()=>navigate('/monarch-timepieces')} className="text-[#B5576B] font-black flex items-center gap-1"><Watch size={12}/> Monarch Timepieces</button>
            <button type="button" onClick={()=>navigate('/diamond-page-2')} className="jewel-accent font-black flex items-center gap-1"><Gem size={12}/> Diamonds Page 2</button>
          </nav>
          <button type="button" onClick={()=>goTo('appointment')} className="jewel-button jewel-accent-bg hidden rounded-full px-5 py-3 text-[7px] font-extrabold uppercase tracking-[0.13em] sm:inline-flex">Private viewing <ArrowRight size={12} className="ml-2"/></button>
          <button type="button" onClick={()=>setMenuOpen((value)=>!value)} aria-label="Toggle navigation" className="flex h-10 w-10 items-center justify-center rounded-full border jewel-line lg:hidden">{menuOpen?<X size={17}/>:<Menu size={17}/>}</button>
        </div>
        <AnimatePresence>{menuOpen&&<motion.nav initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden border-t jewel-line lg:hidden"><div className="mx-auto flex max-w-[1460px] flex-col px-5 py-3 text-[8px] font-bold uppercase tracking-[0.12em] jewel-muted">{[['Collection','collection'],['Craft','craft'],['Journal','gallery'],['Private viewing','appointment'],['The kit','licensing']].map(([label,id])=><button key={id} type="button" onClick={()=>goTo(id)} className="py-3 text-left">{label}</button>)}<button type="button" onClick={()=>navigate('/monarch-timepieces')} className="py-3 text-left text-[#B5576B] font-black">Monarch Timepieces</button><button type="button" onClick={()=>navigate('/diamond-page-2')} className="py-3 text-left jewel-accent font-black">Diamonds Page 2</button></div></motion.nav>}</AnimatePresence>
      </header>
      <main>
        {hero}
        {SITE.order.map((section)=><React.Fragment key={section}>{sectionMap[section]}</React.Fragment>)}
        <section className="px-4 py-12 sm:px-8 sm:py-16"><Reveal className="mx-auto max-w-[1440px]"><div className="relative overflow-hidden rounded-[1.5rem] jewel-inverse p-7 sm:p-12"><div className="absolute inset-0 bg-gradient-to-r from-black/75 to-black/20"/><div className="relative max-w-3xl"><span className="text-[7px] font-extrabold uppercase tracking-[0.2em] jewel-accent">A story in every stone</span><h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-5xl">A closer look begins with a conversation.</h2><p className="mt-4 max-w-xl text-xs leading-6 text-white/70">Explore the collection or arrange a private viewing with the atelier team.</p><button type="button" onClick={()=>goTo('appointment')} className="jewel-button jewel-accent-bg mt-6 rounded-full px-6 py-3.5 text-[8px] font-extrabold uppercase tracking-[0.13em]">Request a viewing <ArrowRight size={13} className="ml-2 inline"/></button></div></div></Reveal></section>
      </main>
      <footer className="border-t jewel-line px-4 py-7 sm:px-8"><div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left"><div><span className="block text-[10px] font-black uppercase tracking-[0.2em]">{SITE.brand}</span><span className="mt-1 block text-[7px] font-bold uppercase tracking-[0.15em] jewel-muted">Diamonds & high jewelry / {SITE.descriptor}</span></div><p className="text-[9px] jewel-muted">{SITE.footer}</p><button type="button" onClick={()=>navigate('/stock')} className="text-[8px] font-extrabold uppercase tracking-[0.12em] jewel-accent">Back to stock vaults <ArrowRight size={11} className="ml-1 inline"/></button></div></footer>
      <AnimatePresence>{preview&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={()=>setPreview(null)}><button type="button" onClick={()=>setPreview(null)} aria-label="Close image preview" className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X size={19}/></button><img src={preview} alt="High jewelry detail" className="max-h-[90vh] max-w-full rounded-xl object-contain" onClick={(e)=>e.stopPropagation()}/></motion.div>}</AnimatePresence>
      <AnimatePresence>{videoOpen&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99998] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="High jewelry campaign film" onClick={()=>setVideoOpen(false)}><button type="button" onClick={()=>setVideoOpen(false)} aria-label="Close video" className="absolute right-5 top-5 rounded-full bg-white p-3 text-slate-900"><X size={19}/></button>{JEWELRY_VIDEO_URL?<video controls autoPlay playsInline className="max-h-[85vh] max-w-full rounded-xl"><source src={JEWELRY_VIDEO_URL} type="video/mp4"/></video>:<div className="flex min-h-[340px] w-full max-w-2xl flex-col items-center justify-center rounded-[1.5rem] border border-white/20 bg-[#10131A] p-8 text-center text-white" onClick={(e)=>e.stopPropagation()}><Video size={38} className="jewel-accent"/><p className="mt-5 text-[8px] font-extrabold uppercase tracking-[0.2em] jewel-accent">Your campaign film goes here</p><h2 className="mt-3 text-2xl font-semibold">Video placeholder</h2><p className="mt-3 max-w-md text-xs leading-6 text-white/65">Set JEWELRY_VIDEO_URL near the top of this JSX file to your MP4 URL or public path.</p><code className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-[9px] text-white/85">const JEWELRY_VIDEO_URL = '';</code></div>}</motion.div>}</AnimatePresence>
      <LoginRequiredModal isOpen={login.isOpen} onClose={()=>setLogin({isOpen:false,tierName:'',price:'0.00',zipLink:''})} packageName={login.tierName} price={login.price} onLoginSuccess={async(account)=>{await recordIntent(account,login.tierName,login.price);setCheckout({isOpen:true,name:login.tierName,price:login.price,zipLink:login.zipLink});setLogin({isOpen:false,tierName:'',price:'0.00',zipLink:''});}}/>
      <AnimatePresence>{checkout.isOpen&&<V8SecureCheckout isOpen={checkout.isOpen} productName={checkout.name} price={checkout.price} zipLink={checkout.zipLink} onClose={()=>setCheckout({isOpen:false,name:'',price:'0.00',zipLink:''})}/>}</AnimatePresence>
    </div>
  );
};

export default VerdantOrangerieJewels;
// ============================================================================
// KRAJ FAJLA: VerdantOrangerieJewels.jsx
// ============================================================================