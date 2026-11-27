// ============================================================================
// FAJL: C:/goranov-sajt/frontend/src/HomePage.jsx
// RUTA / NAMENA: / (Naslovna V10 B2B stranica — 70mm bioskopska traka sa redosledom sl7, sl6, sl1, sl2, sl3, sl4, sl5 s leva na desno)
// ============================================================================
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Film, ArrowUpRight, Layers, Sparkles } from 'lucide-react';

// AKTIVNI POSTOJEĆI V10 B2B BLOKOVI IZ ISTOG src/ FOLDERA
import HeroBanner from './HeroBanner';
import TechSlant from './TechSlant';
import VerticalCardsBox from './VerticalCardsBox';
import V10PipelineMatrix from './V10PipelineMatrix';
import B2BProtocols from './B2BProtocols';
import SaasPromo from './SaasPromo';
import UnlockTheBeast from './UnlockTheBeast';

// REDOSLED S LEVA NA DESNO: sl7 -> sl6 -> sl1 -> sl2 -> sl3 -> sl4 -> sl5
const CINEMA_REEL_FRAMES = [
  {
    code: '70MM // FRM 01',
    spec: '150MP + 4K',
    niche: '150MP AUTOMOTIVE MACRO',
    title: 'Studio Tail-Light Precision',
    subtitle: 'High-Gloss Metallic Bodywork & Optical LED Reflections',
    images: ['/7.webp', '/7.jpg', '/sl7.webp', '/sl7.jpg', '/7_webp.webp'],
    route: '/stock'
  },
  {
    code: '70MM // FRM 02',
    spec: '150MP + 4K',
    niche: 'AERIAL & HYPERCAR STOCK',
    title: 'Coastal Hypercar Pursuit',
    subtitle: 'Matte Carbon Aerodynamics & Cinema Drone Framing',
    images: ['/6.webp', '/6.jpg', '/sl6.webp', '/sl6.jpg', '/6_webp.webp'],
    route: '/stock'
  },
  {
    code: '70MM // FRM 03',
    spec: 'OOH MASTER',
    niche: 'OOH BILLBOARD MOCKUP',
    title: 'Zenith Stormfront Promenade',
    subtitle: 'Nocturnal Coastal OOH Display with Wet-Stone Reflections',
    images: ['/1.webp', '/1.jpg', '/sl1.webp', '/sl1.jpg', '/1_webp.webp'],
    route: '/standard-mocup'
  },
  {
    code: '70MM // FRM 04',
    spec: 'SPATIAL 150MP',
    niche: 'PANORAMIC ARCHITECTURAL DISPLAY',
    title: 'Skyline Sanctuary Monolith',
    subtitle: 'Ultra-Wide Curved Glass Showcase in Dark Concrete Suite',
    images: ['/2.webp', '/2.jpg', '/2webp', '/2webp.webp', '/sl2.webp', '/sl2.jpg', '/2_webp.webp'],
    route: '/standard-mocup'
  },
  {
    code: '70MM // FRM 05',
    spec: 'OOH MASTER',
    niche: 'ILLUMINATED STREET TOTEM',
    title: 'City Brews Waterfront Sign',
    subtitle: 'Edge-Lit Frosted Acrylic Frame in Sunlit Marina Plaza',
    images: ['/3.webp', '/3.jpg', '/sl3.webp', '/sl3.jpg', '/3_webp.webp'],
    route: '/standard-mocup'
  },
  {
    code: '70MM // FRM 06',
    spec: 'CRYSTAL 150MP',
    niche: 'EXECUTIVE GLASS PLAQUE',
    title: 'Vitality Optical Glass Stand',
    subtitle: 'Freestanding Beveled Crystal Display on Travertine Plinth',
    images: ['/4.webp', '/4.jpg', '/sl4.webp', '/sl4.jpg', '/4_webp.webp'],
    route: '/standard-mocup'
  },
  {
    code: '70MM // FRM 07',
    spec: 'LOBBY 150MP',
    niche: 'ARCHITECTURAL WALL MOCKUP',
    title: 'Aura Pure Corporate Lobby',
    subtitle: 'Recessed Brass-Framed Feature Wall in Luxury Reception',
    images: ['/5.webp', '/5.jpg', '/sl5.webp', '/sl5.jpg', '/5_webp.webp'],
    route: '/standard-mocup'
  }
];

const ReelFrameImage = ({ sources, alt }) => {
  const [idx, setIdx] = useState(0);

  return (
    <img
      src={sources[idx]}
      onError={() => {
        if (idx < sources.length - 1) setIdx((prev) => prev + 1);
      }}
      alt={alt}
      className="w-full h-full object-cover object-center group-hover/frame:scale-105 transition-transform duration-700"
    />
  );
};

const SprocketTrack = () => (
  <div className="w-full h-7 bg-[#090d14] border-y border-white/10 flex items-center justify-around px-2 overflow-hidden select-none">
    {Array.from({ length: 38 }).map((_, i) => (
      <span
        key={i}
        className="w-3.5 h-2.5 rounded-[3px] bg-[#05070b] border border-orange-500/25 shadow-[inset_0_1px_3px_rgba(0,0,0,0.95)] shrink-0 mx-1.5"
      />
    ))}
  </div>
);

function UiUxCinemaReel() {
  const navigate = useNavigate();
  const infiniteFrames = [...CINEMA_REEL_FRAMES, ...CINEMA_REEL_FRAMES];

  return (
    <section className="w-full pt-8 pb-16 relative z-10 overflow-hidden select-none">
      <style>{`
        @keyframes v10CinemaScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .v10-cinema-track {
          display: flex;
          width: max-content;
          animation: v10CinemaScroll 80s linear infinite;
        }
        .v10-cinema-wrapper:hover .v10-cinema-track {
          animation-play-state: paused;
        }
      `}</style>

      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[280px] bg-orange-500/12 rounded-full blur-[130px]" />

      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121822] border border-orange-500/40 text-orange-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3 shadow-inner">
            <Film size={13} className="text-orange-400" />
            70MM COMMERCIAL SHOWCASE REEL
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            V10{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              Master Cinema Vault
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/standard-mocup')}
            className="px-6 py-3.5 rounded-xl bg-[#121822] hover:bg-orange-500 text-white hover:text-slate-950 border border-orange-500/45 font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Layers size={14} /> OOH &amp; Plaque Mockups
          </button>

          <button
            type="button"
            onClick={() => navigate('/ui-ux/vault')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 cursor-pointer shadow-[0_10px_28px_rgba(249,115,22,0.32)]"
          >
            <Sparkles size={14} /> Open B2B Vault <ArrowUpRight size={15} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      <div className="v10-cinema-wrapper relative w-full bg-[#121822] border-y-2 border-orange-500/45 shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] via-[#050505]/70 to-transparent z-20" />

        <SprocketTrack />

        <div className="py-5 bg-[#0d121b] overflow-hidden">
          <div className="v10-cinema-track gap-6 px-3">
            {infiniteFrames.map((frame, index) => (
              <div
                key={`${frame.code}-${index}`}
                onClick={() => navigate(frame.route)}
                className="group/frame relative w-[320px] sm:w-[420px] h-[250px] sm:h-[280px] shrink-0 rounded-2xl bg-[#121822] border border-slate-700/80 hover:border-orange-400 transition-all duration-300 overflow-hidden cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.75)] hover:shadow-[0_0_35px_rgba(249,115,22,0.28)] flex flex-col"
              >
                <div className="h-8 px-3.5 bg-[#090d14] border-b border-white/10 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500/80" />
                    <span className="w-2 h-2 rounded-full bg-amber-400/70" />
                    <span className="w-2 h-2 rounded-full bg-emerald-400/70" />
                    <span className="ml-2 text-amber-300/90 font-bold tracking-wider">
                      {frame.code}
                    </span>
                  </div>
                  <span className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                    {frame.spec}
                  </span>
                </div>

                <div className="relative flex-1 w-full overflow-hidden bg-[#0b0f17]">
                  <ReelFrameImage sources={frame.images} alt={frame.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-[#090d14]/35 to-transparent pointer-events-none" />

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#121822]/90 backdrop-blur-md border border-orange-500/35 text-orange-300 font-mono text-[9px] font-extrabold uppercase tracking-widest">
                    {frame.niche}
                  </span>

                  <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-orange-500 text-slate-950 flex items-center justify-center opacity-0 group-hover/frame:opacity-100 translate-y-1 group-hover/frame:translate-y-0 transition-all duration-200 shadow-lg">
                    <ArrowUpRight size={16} strokeWidth={2.8} />
                  </span>

                  <div className="absolute bottom-3.5 left-4 right-4 text-left">
                    <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white group-hover/frame:text-amber-300 transition-colors leading-tight">
                      {frame.title}
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                      {frame.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SprocketTrack />
      </div>
    </section>
  );
}

// GLAVNA KOMPONENTA NASLOVNE STRANICE
export default function HomePage({ apps = [] }) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Helmet>
        <title>Visionary Factory V10 | 150MP Commercial Visuals, OOH Mockups &amp; Enterprise UI Systems</title>
        <meta
          name="description"
          content="100% IP-safe 150MP Ultra-Print commercial visual archives, executive billboard and architectural wall mockups, and bespoke React UI/UX design systems for agencies and studios."
        />
        <meta name="thumbnail" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <meta
          property="og:title"
          content="Visionary Factory V10 | 150MP Commercial Stock, OOH Mockups &amp; UI/UX Systems"
        />
        <meta
          property="og:description"
          content="Unmarked, 100% IP-safe 150MP Master Print &amp; 4K commercial visual vaults, architectural &amp; billboard mockups, and turnkey B2B digital interfaces."
        />
        <meta property="og:image" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <meta property="og:url" content="https://aitoolsprosmart.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <link rel="canonical" href="https://aitoolsprosmart.com/" />
      </Helmet>

      {/* 1. GLAVNI 150MP B2B HERO */}
      <HeroBanner />

      {/* 2. TEHNIČKA TRAKA */}
      <TechSlant />

      {/* 3. CENTRALNI B2B PANELI (#121822) */}
      <div className="max-w-7xl mx-auto px-6 py-16 text-left relative space-y-24">
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-[#ff5500]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#ff5500]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <VerticalCardsBox />
        </div>

        <div className="relative z-10">
          <V10PipelineMatrix />
        </div>

        <div className="relative z-10">
          <B2BProtocols />
        </div>

        <div className="relative z-10">
          <SaasPromo />
        </div>

        <div className="relative z-10">
          <UnlockTheBeast />
        </div>
      </div>

      {/* 4. BIOSKOPSKA 70MM FILMSKA TRAKA U PUNOJ ŠIRINI EKRANA */}
      <UiUxCinemaReel />
    </div>
  );
}
// KRAJ FAJLA: C:/goranov-sajt/frontend/src/HomePage.jsx