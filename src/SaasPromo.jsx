// ============================================================================
// FAJL: src/SaasPromo.jsx (POČETAK FAJLA: SaasPromo.jsx)
// RUTA / NAMENA: Sekcija "V10 150MP Protocol" na HomePage.jsx — #121822 tema + /wall.webp, /bilboard.webp, /pague.webp sa auto-fallbackom
// ============================================================================
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, ChevronRight, Rocket, Crown, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';

// Pametni učitavač slike: prvo traži tačan .webp, a ako fajl ima .jpg ili drugo slovo, automatski ga pronalazi
const SmartMockupImage = ({ sources, alt, isHovered }) => {
  const [srcIndex, setSrcIndex] = useState(0);

  const handleImageError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  return (
    <motion.img
      src={sources[srcIndex]}
      onError={handleImageError}
      alt={alt}
      className="w-full h-full object-cover object-center"
      animate={{ scale: isHovered ? 1.07 : 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    />
  );
};

const SaasPromo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  // MAGIC SPOTLIGHT STATE ZA HEADER BOX
  const headerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringHeader, setIsHoveringHeader] = useState(false);

  const handleMouseMove = (e) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const pricingData = [
    {
      id: 0,
      title: 'STARTUP LAUNCH',
      subtitle: 'Architectural Wall Environments',
      tag: 'WALL MOCKUPS',
      renders: '3-5 RENDERS • 150MP',
      price: '$400',
      icon: <Rocket size={24} />,
      iconStyle: 'from-amber-400 to-amber-500 text-slate-950',
      priceColor: 'text-amber-400',
      badgeStyle: 'border-amber-400/40 text-amber-300 bg-amber-500/10',
      buttonStyle:
        'bg-[#1a2332] hover:bg-amber-400 text-white hover:text-slate-950 border border-amber-400/45',
      imgSources: ['/wall.webp', '/wall.jpg', '/Wall.webp', '/Wall.jpg', '/mocup_1.webp'],
      link: '/saas-protocol'
    },
    {
      id: 1,
      title: 'ENTERPRISE SUITE',
      subtitle: 'Custom OOH Billboard Environments',
      tag: 'BILLBOARD MOCKUPS',
      renders: '10-15 RENDERS • 150MP',
      price: '$1,500',
      badge: 'GOLD STANDARD',
      icon: <Crown size={24} />,
      iconStyle: 'from-orange-500 to-amber-500 text-slate-950',
      priceColor: 'text-orange-400',
      badgeStyle: 'border-orange-400/50 text-orange-300 bg-orange-500/15',
      buttonStyle:
        'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-[0_10px_30px_rgba(249,115,22,0.35)]',
      imgSources: [
        '/bilboard.webp',
        '/billboard.webp',
        '/bilboard.jpg',
        '/billboard.jpg',
        '/Bilboard.webp',
        '/mocup_2.webp'
      ],
      link: '/saas-protocol',
      isPremium: true
    },
    {
      id: 2,
      title: 'AGENCY RETAINER',
      subtitle: 'Executive Glass Plaque & Bespoke',
      tag: 'PLAQUE MOCKUPS',
      renders: '10 / MONTH • 150MP',
      price: '$1,000',
      icon: <Building2 size={24} />,
      iconStyle: 'from-emerald-400 to-teal-500 text-slate-950',
      priceColor: 'text-emerald-400',
      badgeStyle: 'border-emerald-400/40 text-emerald-300 bg-emerald-500/10',
      buttonStyle:
        'bg-[#1a2332] hover:bg-emerald-400 text-white hover:text-slate-950 border border-emerald-400/45',
      imgSources: [
        '/pague.webp',
        '/plaque.webp',
        '/pgue.webp',
        '/pague.jpg',
        '/plaque.jpg',
        '/Pague.webp',
        '/mocup_3.webp'
      ],
      link: '/saas-protocol'
    }
  ];

  return (
    <div
      id="saas-promo"
      className="mb-20 flex flex-col items-center justify-center text-center pt-6 pb-12 relative overflow-hidden scroll-mt-32"
    >
      {/* INTERAKTIVNI HEADER BOX U #121822 TEMI */}
      <V8Reveal delay={0.2} direction="up">
        <div
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringHeader(true)}
          onMouseLeave={() => setIsHoveringHeader(false)}
          className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] overflow-hidden py-16 md:py-20 px-6 sm:px-10 mb-14 border border-orange-500/35 shadow-[0_25px_80px_rgba(0,0,0,0.75)] bg-[#121822] group"
        >
          {/* Spotlight Glow koji prati miša na tamnoj podlozi */}
          <div
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              opacity: isHoveringHeader ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.14), transparent 45%)`
            }}
          />

          {/* Gornja svetlosna linija i ambijentalni odsjaj */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
          <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 w-[520px] h-[260px] bg-orange-500/10 rounded-full blur-[120px]" />

          <div className="relative z-10 flex flex-col items-center">
            {/* 3D Lebdeća Ikonica */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-[#0c1018] p-5 rounded-2xl mb-7 border border-orange-500/40 shadow-[0_0_30px_rgba(249,115,22,0.2)] relative"
            >
              <Layers className="w-11 h-11 text-orange-400 relative z-10" strokeWidth={1.7} />
            </motion.div>

            {/* Glavni Naslov */}
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-5">
              V10 150MP{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600">
                Protocol
              </span>
            </h2>

            {/* Značka sa pulsirajućom tačkom */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#0b0f17] border border-orange-500/35 mb-12 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-[0.2em]">
                The Ultimate B2B Spatial &amp; Mockup Expansion
              </span>
            </div>

            {/* Bento Grid za tekst */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
              <div className="bg-[#0c1018]/95 border border-slate-800/90 p-6 md:p-8 rounded-2xl text-left hover:border-orange-500/50 transition-all duration-300 group/card">
                <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ArrowRight
                    size={15}
                    className="group-hover/card:translate-x-1 transition-transform"
                  />{' '}
                  150MP Spatial Reality
                </h4>
                <p className="text-slate-300 text-xs font-medium leading-relaxed">
                  Showcase client identities across bespoke architectural walls, outdoor hotel &amp;
                  urban billboards, and optical crystal plaques engineered at 150MP print scale.
                </p>
              </div>

              <div className="bg-[#0c1018]/95 border border-slate-800/90 p-6 md:p-8 rounded-2xl text-left hover:border-emerald-400/50 transition-all duration-300 group/card">
                <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ArrowRight
                    size={15}
                    className="group-hover/card:translate-x-1 transition-transform"
                  />{' '}
                  Stop Losing Agency Pitches
                </h4>
                <p className="text-slate-300 text-xs font-medium leading-relaxed">
                  We map brand visuals, signage, and key-art onto unmarked, hyper-realistic physical
                  environments with true glass refraction and natural lighting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </V8Reveal>

      {/* PRICING GRID SA .WEBP SLIKAMA I AUTO-FALLBACKOM (BEZ ZAMUĆIVANJA) */}
      <div
        className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 items-stretch"
        onMouseLeave={() => setHoveredCard(null)}
      >
        {pricingData.map((pkg, index) => {
          const isHovered = hoveredCard === index;

          return (
            <motion.div
              key={pkg.id}
              onMouseEnter={() => setHoveredCard(index)}
              animate={{
                scale: isHovered ? 1.02 : 1,
                y: isHovered ? -10 : 0
              }}
              transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              className={`relative overflow-hidden rounded-[2.3rem] flex flex-col bg-[#121822] border transition-colors duration-300 ${
                pkg.isPremium
                  ? 'border-2 border-orange-500/80 shadow-[0_25px_70px_rgba(249,115,22,0.22)]'
                  : 'border-slate-800/90 hover:border-orange-500/50 shadow-[0_20px_60px_rgba(0,0,0,0.7)]'
              }`}
            >
              {pkg.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-b-xl z-30 shadow-lg">
                  {pkg.badge}
                </div>
              )}

              {/* Slika iz public foldera: /wall.webp, /bilboard.webp, /pague.webp */}
              <div className="w-full h-64 relative overflow-hidden bg-[#0b0f17]">
                <SmartMockupImage
                  sources={pkg.imgSources}
                  alt={pkg.title}
                  isHovered={isHovered}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121822] via-[#121822]/20 to-transparent pointer-events-none" />

                <span className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-[#0b0f17]/85 backdrop-blur-md border border-white/15 text-slate-200 font-mono text-[10px] font-extrabold uppercase tracking-wider">
                  {pkg.tag}
                </span>
              </div>

              {/* Donji deo kartice u #121822 boji */}
              <div className="flex flex-col flex-1 p-8 text-left bg-[#121822] relative z-10 -mt-6 rounded-t-[2rem] border-t border-white/10">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 bg-gradient-to-br ${pkg.iconStyle} mb-6`}
                >
                  {pkg.icon}
                </div>

                <div className="mb-auto">
                  <div
                    className={`inline-block border ${pkg.badgeStyle} text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full mb-4 font-mono`}
                  >
                    {pkg.renders}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1.5">
                    {pkg.title}
                  </h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-5">
                  <div className="flex items-baseline justify-between">
                    <span className={`text-4xl sm:text-5xl font-black ${pkg.priceColor}`}>
                      {pkg.price}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      B2B PROTOCOL
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(pkg.link)}
                    className={`w-full py-4 font-black uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${pkg.buttonStyle}`}
                  >
                    DEPLOY PROTOCOL <ChevronRight size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SaasPromo;
// KRAJ FAJLA: SaasPromo.jsx