//V8EcosystemBar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MAIN_CATEGORIES = [
  { name: '🏛️ V10 Hub', path: '/' },
  { name: '✈️ Private Aviation (6)', path: '/aviation-charter-kit', match: ['aviation'] },
  { name: '🛥️ Superyachts (5)', path: '/yacht-page-1', match: ['yacht'] },
  { name: '⌚ Fine Watchmaking (4)', path: '/watch-page-1', match: ['watch', 'abyss', 'atelier-horology', 'meridian', 'lumen'] },
  { name: '🎨 UI/UX Vault', path: '/ui-ux/vault', match: ['/ui-ux'] },
  { name: '🖼️ 150MP Mockups & Stock', path: '/standard-mocup', match: ['/standard-mocup', '/stock'] },
  { name: '📄 PDF Translator', path: '/pdf-translator', match: ['/pdf-translator'] },
  { name: '🤖 AI Agents (30+)', path: '/ai-agents', match: ['/ai-agents'] },
  { name: '🔐 B2B Client Portal ($1.9k)', path: '/client-portal', match: ['/client-portal'] },
];

const SUB_KITS = {
  aviation: [
    { label: '01 • Private Aviation', path: '/aviation-charter-kit' },
    { label: '02 • AeroPrivé Atelier', path: '/aviation-atelier-kit' },
    { label: '03 • Cloudline Prestige', path: '/aviation-cloudline-kit' },
    { label: '04 • Midnight Altitude', path: '/aviation-midnight-kit' },
    { label: '05 • Runway Reserve', path: '/aviation-runway-kit' },
    { label: '06 • Skyglass Aviation', path: '/aviation-skyglass-kit' },
  ],
  yachts: [
    { label: '01 • Aqua Yacht Charter', path: '/yacht-page-1' },
    { label: '02 • Aegean Yacht Escape', path: '/yacht-page-2' },
    { label: '03 • Nautilus Night Charter', path: '/yacht-page-3' },
    { label: '04 • Sapphire Voyage', path: '/yacht-page-4' },
    { label: '05 • Tideglass Society', path: '/yacht-page-5' },
  ],
  watches: [
    { label: '01 • Abyss Chronograph', path: '/watch-page-1' },
    { label: '02 • Atelier Horology', path: '/watch-page-2' },
    { label: '03 • Meridian Watch House', path: '/watch-page-3' },
    { label: '04 • Lumen Watch Collective', path: '/watch-page-4' },
  ],
};

export default function V8EcosystemBar() {
  const location = useLocation();
  const p = location.pathname.toLowerCase();

  let activeSubGroup = null;
  if (p.includes('aviation')) activeSubGroup = SUB_KITS.aviation;
  else if (p.includes('yacht')) activeSubGroup = SUB_KITS.yachts;
  else if (
    p.includes('watch') ||
    p.includes('abyss') ||
    p.includes('atelier-horology') ||
    p.includes('meridian') ||
    p.includes('lumen')
  ) {
    activeSubGroup = SUB_KITS.watches;
  }

  return (
    <div className="w-full bg-[#050507]/95 backdrop-blur-xl border-b border-[#d4af37]/30 z-[9990] relative">
      {/* Glavna traka ekosistema */}
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="uppercase tracking-[0.2em] text-[#d4af37] font-black text-[10px] sm:text-xs">
            V10 B2B Ecosystem
          </span>
        </div>

        <nav className="flex flex-wrap items-center gap-1.5">
          {MAIN_CATEGORIES.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.match && item.match.some((m) => p.includes(m)));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-2.5 py-1 rounded-full transition-all duration-200 text-[11px] font-semibold ${
                  isActive
                    ? 'bg-[#d4af37] text-black font-black shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                    : 'bg-white/5 text-zinc-300 hover:bg-[#d4af37]/20 hover:text-white border border-white/10'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <a
          href="https://wa.me/381648201496"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-400 hover:text-emerald-300 font-black"
        >
          <span>● Turnkey License ($349 / $1,490)</span>
        </a>
      </div>

      {/* Podmeni (automatski se pojavljuje kada si u Avionima, Jahtama ili Satovima da menjaš kitove 1-6 u jednom kliku) */}
      {activeSubGroup && (
        <div className="w-full bg-black/90 border-t border-white/10 px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mr-1">
              Switch Kit:
            </span>
            {activeSubGroup.map((sub) => {
              const isSubActive = location.pathname === sub.path;
              return (
                <Link
                  key={sub.path}
                  to={sub.path}
                  className={`px-2.5 py-0.5 rounded text-[11px] transition-all ${
                    isSubActive
                      ? 'bg-orange-500 text-black font-black'
                      : 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}