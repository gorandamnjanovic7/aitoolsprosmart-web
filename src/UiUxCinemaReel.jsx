// ============================================================================
// FAJL: src/UiUxCinemaReel.jsx
// RUTA / NAMENA: Bioskopska 70mm filmska traka u punoj širini ekrana na dnu HomePage.jsx (UI/UX & Storytelling izlog -> /ui-ux i /ui-ux/vault)
// ============================================================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, ArrowUpRight, Layers, Sparkles } from 'lucide-react';

// 👉 OVDE MOŽEŠ U SVAKOM TRENUTKU STAVITI SKRINŠOTOVE SVOJIH UI/UX STRANICA IZ "public/" FOLDERA:
const CINEMA_REEL_FRAMES = [
  {
    code: '70MM // FRM 01',
    niche: 'HOROLOGY UI SYSTEM',
    title: 'Monarch Timepieces',
    subtitle: 'Swiss Haute Horlogerie React Architecture',
    images: ['/ui-monarch.webp', '/vertikal_1.webp', '/wall.webp'],
    route: '/ui-ux'
  },
  {
    code: '70MM // FRM 02',
    niche: 'PRIVATE AVIATION UI',
    title: 'Skyglass Aviation',
    subtitle: 'Bespoke Jet Charter & Fleet Booking System',
    images: ['/ui-skyglass.webp', '/bilboard.webp', '/pague.webp'],
    route: '/ui-ux'
  },
  {
    code: '70MM // FRM 03',
    niche: 'LUXURY HOSPITALITY UI',
    title: 'Villa Solis Amalfi',
    subtitle: 'Cliffside Resort & Architectural Sanctuary Kit',
    images: [
      '/ui-villasolis.webp',
      '/Sunlit%20Colonnade%20and%20Stone%20Statues%20Above%20a%20Rainwashed%20Plaza_webp.webp',
      '/37_webp.webp'
    ],
    route: '/ui-ux'
  },
  {
    code: '70MM // FRM 04',
    niche: 'MICHELIN GASTRONOMY UI',
    title: 'Kurokawa Kaiseki',
    subtitle: 'Fine-Dining Tasting Menu & Sommelier Experience',
    images: ['/ui-kurokawa.webp', '/wall.webp', '/vertikal_1.webp'],
    route: '/ui-ux'
  },
  {
    code: '70MM // FRM 05',
    niche: 'DIAMONDS & ATELIER UI',
    title: 'Maison Lumière Diamonds',
    subtitle: '150MP Macro Gemstone & High-Jewelry Storefront',
    images: ['/ui-diamonds.webp', '/vertical_2.webp', '/pague.webp'],
    route: '/ui-ux'
  },
  {
    code: '70MM // FRM 06',
    niche: 'COLLECTOR WATCH VAULT',
    title: 'Lumen Watch Collective',
    subtitle: 'Dark-Mode Editorial Horology & Vault Showcase',
    images: ['/ui-lumen.webp', '/37_webp.webp', '/vertikal_1.webp'],
    route: '/ui-ux/vault'
  },
  {
    code: '70MM // FRM 07',
    niche: 'OOH & SPATIAL SHOWROOM',
    title: 'Executive Plaque & OOH',
    subtitle: '150MP Billboard, Marble Wall & Crystal Mockups',
    images: ['/pague.webp', '/bilboard.webp', '/wall.webp'],
    route: '/standard-mocup'
  },
  {
    code: '70MM // FRM 08',
    niche: 'ENTERPRISE SOURCE VAULT',
    title: 'Turnkey React + PSD Vault',
    subtitle: 'Instant Commercial EULA & Multi-Page Kits',
    images: ['/bilboard.webp', '/wall.webp', '/vertical_2.webp'],
    route: '/ui-ux/vault'
  }
];

// Pametni učitavač slike unutar filmskog frejma
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

// Traka sa perforacijama (rupicama) prave 70mm bioskopske trake
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

export default function UiUxCinemaReel() {
  const navigate = useNavigate();

  // Dupliramo niz za savršeno glatku beskonačnu petlju bez trzaja
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
          animation: v10CinemaScroll 52s linear infinite;
        }
        .v10-cinema-wrapper:hover .v10-cinema-track {
          animation-play-state: paused;
        }
      `}</style>

      {/* Ambijentalni sjaj projektora iza trake */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[780px] h-[280px] bg-orange-500/12 rounded-full blur-[130px]" />

      {/* Gornje zaglavlje iznad bioskopske trake */}
      <div className="max-w-7xl mx-auto px-6 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121822] border border-orange-500/40 text-orange-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3 shadow-inner">
            <Film size={13} className="text-orange-400" />
            70MM STORYTELLING &amp; UI/UX REEL
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            Turnkey{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">
              UI/UX Cinema Vault
            </span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/ui-ux')}
            className="px-6 py-3.5 rounded-xl bg-[#121822] hover:bg-orange-500 text-white hover:text-slate-950 border border-orange-500/45 font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Layers size={14} /> Explore 9 Niches
          </button>

          <button
            type="button"
            onClick={() => navigate('/ui-ux/vault')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 cursor-pointer shadow-[0_10px_28px_rgba(249,115,22,0.32)]"
          >
            <Sparkles size={14} /> Open UI/UX Vault <ArrowUpRight size={15} strokeWidth={2.8} />
          </button>
        </div>
      </div>

      {/* GLAVNO KUĆIŠTE BIOSKOPSKE TRAKE OD IVICE DO IVICE EKRANA */}
      <div className="v10-cinema-wrapper relative w-full bg-[#121822] border-y-2 border-orange-500/45 shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
        {/* Bočne bioskopske vinjete (levo i desno zatamnjenje kao na platnu) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#050505] via-[#050505]/70 to-transparent z-20" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#050505] via-[#050505]/70 to-transparent z-20" />

        {/* Gornja perforacija filmske trake */}
        <SprocketTrack />

        {/* Pokretni niz filmskih frejmova */}
        <div className="py-5 bg-[#0d121b] overflow-hidden">
          <div className="v10-cinema-track gap-6 px-3">
            {infiniteFrames.map((frame, index) => (
              <div
                key={`${frame.code}-${index}`}
                onClick={() => navigate(frame.route)}
                className="group/frame relative w-[320px] sm:w-[410px] h-[250px] sm:h-[275px] shrink-0 rounded-2xl bg-[#121822] border border-slate-700/80 hover:border-orange-400 transition-all duration-300 overflow-hidden cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.75)] hover:shadow-[0_0_35px_rgba(249,115,22,0.28)] flex flex-col"
              >
                {/* Mini Browser / Cinema Timecode traka na vrhu svakog kadra */}
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
                    REACT + PSD
                  </span>
                </div>

                {/* Slika unutar filmskog frejma */}
                <div className="relative flex-1 w-full overflow-hidden bg-[#0b0f17]">
                  <ReelFrameImage sources={frame.images} alt={frame.title} />

                  {/* Tamni donji preliv za čitljivost UI/UX naslova */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090d14] via-[#090d14]/45 to-transparent pointer-events-none" />

                  {/* Bedž niše u gornjem levom uglu slike */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#121822]/90 backdrop-blur-md border border-orange-500/35 text-orange-300 font-mono text-[9px] font-extrabold uppercase tracking-widest">
                    {frame.niche}
                  </span>

                  {/* Dugme u gornjem desnom uglu pri prelasku mišem */}
                  <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-orange-500 text-slate-950 flex items-center justify-center opacity-0 group-hover/frame:opacity-100 translate-y-1 group-hover/frame:translate-y-0 transition-all duration-200 shadow-lg">
                    <ArrowUpRight size={16} strokeWidth={2.8} />
                  </span>

                  {/* Donji potpis UI/UX projekta */}
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

        {/* Donja perforacija filmske trake */}
        <SprocketTrack />
      </div>
    </section>
  );
}