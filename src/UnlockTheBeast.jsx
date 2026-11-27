// ============================================================================
// FAJL: src/UnlockTheBeast.jsx (POČETAK FAJLA: UnlockTheBeast.jsx)
// RUTA / NAMENA: Sekcija "The V10 Ecosystem — Absolute Dominance" na HomePage.jsx (#121822 tema, uklonjen Guest Pass baner)
// ============================================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, Image as ImageIcon, MonitorPlay, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UnlockTheBeast() {
  const [activeCard, setActiveCard] = useState(1);
  const navigate = useNavigate();

  // PODACI ZA 3 V10 B2B EKOSISTEMA
  const showcaseData = [
    {
      id: 0,
      badge: 'VAULT 01 // 150MP MASTER',
      title: '150MP ULTRA STOCK',
      subtitle: 'Cinematic IP-Safe Commercial Visuals',
      icon: <ImageIcon size={26} />,
      color: 'from-orange-500 to-amber-500 text-slate-950',
      borderActive: 'border-orange-500/75 shadow-[0_20px_60px_rgba(249,115,22,0.22)]',
      bgImg: '/promo-stock.webp',
      fallbackImg: '/vertikal_1.webp',
      link: '/stock'
    },
    {
      id: 1,
      badge: 'VAULT 02 // OOH & SPATIAL',
      title: 'EXECUTIVE MOCKUP VAULTS',
      subtitle: 'Billboards, Architectural Walls & Plaques',
      icon: <MonitorPlay size={26} />,
      color: 'from-emerald-400 to-teal-500 text-slate-950',
      borderActive: 'border-emerald-400/75 shadow-[0_20px_60px_rgba(16,185,129,0.22)]',
      bgImg: '/promo-mockup.webp',
      fallbackImg: '/bilboard.webp',
      link: '/standard-mocup'
    },
    {
      id: 2,
      badge: 'VAULT 03 // ENTERPRISE UI',
      title: 'MASTER UI/UX PROTOCOLS',
      subtitle: 'Turnkey React & Luxury Brand Interfaces',
      icon: <Layers size={26} />,
      color: 'from-sky-400 to-indigo-500 text-slate-950',
      borderActive: 'border-sky-400/75 shadow-[0_20px_60px_rgba(56,189,248,0.22)]',
      bgImg: '/promo-uiux.webp',
      fallbackImg: '/pague.webp',
      link: '/saas-protocol'
    }
  ];

  return (
    <section className="w-full my-16 relative z-10">
      {/* Glavni kontejner u #121822 boji sa narandžastim B2B okvirom */}
      <div className="max-w-7xl mx-auto rounded-[2.8rem] bg-[#121822] border border-orange-500/35 shadow-[0_25px_85px_rgba(0,0,0,0.78)] px-5 sm:px-8 md:px-12 py-14 md:py-20 relative overflow-hidden">
        {/* Gornja narandžasta svetlosna linija i ambijentalni odsjaj */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/3 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-28 right-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px]" />

        {/* SEKCIONI NASLOV — Dark B2B */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-center mb-14 px-4 relative z-10"
        >
          <div className="inline-flex items-center gap-2 bg-[#0b0f17] border border-orange-500/40 text-orange-400 px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4 shadow-inner">
            <Zap size={13} className="text-orange-400 animate-pulse" /> The V10 Ecosystem
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight">
            Absolute{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600">
              Dominance.
            </span>
          </h2>
        </motion.div>

        {/* DYNAMIC EXPANSION SHOWCASE (Bento harmonika bez Guest Pass trake ispod) */}
        <div className="w-full h-[540px] lg:h-[580px] flex flex-col lg:flex-row gap-5 relative z-10">
          {showcaseData.map((item, index) => {
            const isActive = activeCard === index;
            return (
              <motion.div
                key={item.id}
                layout
                onMouseEnter={() => setActiveCard(index)}
                onClick={() => setActiveCard(index)}
                className={`relative overflow-hidden rounded-[2.2rem] cursor-pointer group bg-[#0b0f17] border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                  isActive
                    ? `lg:flex-[3] flex-1 ${item.borderActive}`
                    : 'lg:flex-1 flex-[0.35] border-slate-800/90 hover:border-slate-600'
                }`}
              >
                {/* Pozadinska slika sa auto-fallbackom ako neka promo slika fali */}
                <motion.img
                  src={item.bgImg}
                  onError={(e) => {
                    if (e.currentTarget.src !== window.location.origin + item.fallbackImg) {
                      e.currentTarget.src = item.fallbackImg;
                    }
                  }}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                  animate={{ scale: isActive ? 1.04 : 1.16 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />

                {/* Tamni filmski preliv za čitljivost belog B2B teksta */}
                <div
                  className={`absolute inset-0 z-10 transition-colors duration-500 ${
                    isActive ? 'bg-[#0b0f17]/25' : 'bg-[#0b0f17]/70'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/65 to-transparent z-10 pointer-events-none" />

                {/* Gornji bedž na aktivnoj kartici */}
                {isActive && (
                  <div className="absolute top-6 left-6 z-20 px-3.5 py-1.5 rounded-xl bg-[#121822]/90 backdrop-blur-md border border-white/15 text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-200">
                    {item.badge}
                  </div>
                )}

                {/* Sadržaj kartice */}
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-10">
                  <motion.div
                    layout
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/25 bg-gradient-to-br ${item.color} mb-5 shrink-0`}
                  >
                    {item.icon}
                  </motion.div>

                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.35, delay: 0.05 }}
                        className="flex flex-col"
                      >
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-2 leading-none">
                          {item.title}
                        </h3>
                        <p className="text-slate-300 font-bold uppercase tracking-widest text-[11px] mb-6">
                          {item.subtitle}
                        </p>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(item.link);
                          }}
                          className={`self-start px-8 py-3.5 bg-gradient-to-r ${item.color} font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer`}
                        >
                          Explore Module <ChevronRight size={15} strokeWidth={3} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
// KRAJ FAJLA: UnlockTheBeast.jsx