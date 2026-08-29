// POČETAK FAJLA: SaasPromo.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, ChevronRight, Rocket, Crown, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';

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
      y: e.clientY - rect.top,
    });
  };

  const pricingData = [
    {
      id: 0,
      title: "STARTUP LAUNCH",
      subtitle: "Standard 150MP Environments",
      renders: "3-5 RENDERS",
      price: "$400",
      icon: <Rocket size={24} />,
      color: "from-amber-400 to-amber-500",
      textColor: "text-amber-600",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      bgImg: "/mocup_1.webp",
      link: "/saas-protocol"
    },
    {
      id: 1,
      title: "ENTERPRISE SUITE",
      subtitle: "Custom Cinematic Environments",
      renders: "10-15 RENDERS",
      price: "$1,500",
      badge: "GOLD STANDARD",
      icon: <Crown size={24} />,
      color: "from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      buttonColor: "bg-orange-500 hover:bg-orange-600",
      bgImg: "/mocup_2.webp",
      link: "/saas-protocol",
      isPremium: true
    },
    {
      id: 2,
      title: "AGENCY RETAINER",
      subtitle: "Dedicated Monthly Architect",
      renders: "10 / MONTH",
      price: "$1,000",
      icon: <Building2 size={24} />,
      color: "from-amber-400 to-amber-500",
      textColor: "text-amber-600",
      buttonColor: "bg-amber-500 hover:bg-amber-600",
      bgImg: "/mocup_3.webp",
      link: "/saas-protocol"
    }
  ];

  return (
    <div id="saas-promo" className="mb-24 flex flex-col items-center justify-center text-center pt-10 pb-20 relative overflow-hidden scroll-mt-32">
      
      {/* 🌟 INTERAKTIVNI MAGIČNI HEADER BOX 🌟 */}
      <V8Reveal delay={0.2} direction="up">
        <div 
          ref={headerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHoveringHeader(true)}
          onMouseLeave={() => setIsHoveringHeader(false)}
          className="relative w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden py-20 px-6 mb-16 border border-slate-200/80 shadow-[0_20px_60px_rgba(0,0,0,0.04)] bg-white group"
        >
          {/* Spotlight Glow koji prati miša */}
          <div 
            className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
            style={{
              opacity: isHoveringHeader ? 1 : 0,
              background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(249,115,22,0.06), transparent 40%)`
            }}
          />

          {/* Ambijentalna pozadina */}
          <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-50 via-white to-white pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('/v8-stock/v8-master-bg.jpg')] bg-cover bg-center opacity-[0.02] mix-blend-multiply pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* 3D Lebdeća Ikonica */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-[1.5rem] mb-8 border border-orange-200 shadow-sm relative"
            >
              <div className="absolute inset-0 bg-orange-400 blur-xl opacity-20 rounded-[1.5rem]"></div>
              <Layers className="w-12 h-12 text-orange-500 relative z-10" strokeWidth={1.5} />
            </motion.div>

            {/* Očišćen Naslov */}
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
              V10 150MP <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">Protocol</span>
            </h2>
            
            {/* Elegantna značka sa pulsirajućom tačkom */}
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-50 border border-slate-200 mb-12 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em]">The Ultimate B2B Visual Expansion</span>
            </div>
            
            {/* Bento Grid za tekst (Umesto jednog teškog paragrafa) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full">
              
              <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 md:p-8 rounded-2xl shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all duration-300 group/card">
                <h4 className="text-[10px] md:text-xs font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ArrowRight size={14} className="group-hover/card:translate-x-1 transition-transform" /> Physical Reality
                </h4>
                <p className="text-slate-600 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed">
                  Wrap your software in 150MP physical reality engineered with V10 Algorithms.
                </p>
              </div>
              
              <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 p-6 md:p-8 rounded-2xl shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all duration-300 group/card">
                <h4 className="text-[10px] md:text-xs font-black text-orange-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ArrowRight size={14} className="group-hover/card:translate-x-1 transition-transform" /> Stop Losing Deals
                </h4>
                <p className="text-slate-600 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] leading-relaxed">
                  We mathematically map your Figma UI screens onto hyper-realistic hardware environments. 
                </p>
              </div>

            </div>

          </div>
        </div>
      </V8Reveal>

      {/* DEPTH-OF-FIELD PRICING GRID (Cinematic Magija) */}
      <div 
        className="w-full max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10"
        onMouseLeave={() => setHoveredCard(null)} 
      >
        {pricingData.map((pkg, index) => {
          const isHovered = hoveredCard === index;
          const isAnotherHovered = hoveredCard !== null && hoveredCard !== index;

          return (
            <motion.div
              key={pkg.id}
              onMouseEnter={() => setHoveredCard(index)}
              animate={{ 
                scale: isHovered ? 1.05 : isAnotherHovered ? 0.92 : 1,
                opacity: isAnotherHovered ? 0.4 : 1,
                filter: isAnotherHovered ? "blur(8px)" : "blur(0px)",
                y: isHovered ? -15 : 0 
              }}
              transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
              className={`relative overflow-hidden rounded-[2.5rem] flex flex-col bg-white border ${
                pkg.isPremium ? 'border-orange-300 shadow-[0_20px_60px_rgba(249,115,22,0.15)]' : 'border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'
              }`}
            >
              {pkg.badge && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-b-2xl z-30 shadow-md">
                  {pkg.badge}
                </div>
              )}

              <div className="w-full h-56 relative overflow-hidden bg-slate-100">
                <motion.img 
                  src={pkg.bgImg} 
                  alt={pkg.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: isHovered ? 1.1 : 1 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              </div>

              <div className="flex flex-col flex-1 p-8 text-left bg-white relative z-10 -mt-8 rounded-t-[2rem]">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/20 bg-gradient-to-br ${pkg.color} mb-6`}>
                  {pkg.icon}
                </div>

                <div className="mb-auto">
                  <div className={`inline-block bg-slate-50 border border-slate-200 ${pkg.textColor} text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-4`}>
                    {pkg.renders}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-1">
                    {pkg.title}
                  </h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                    {pkg.subtitle}
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col gap-6">
                  <span className={`text-5xl font-black ${pkg.textColor} drop-shadow-sm`}>
                    {pkg.price}
                  </span>
                  <button 
                    onClick={() => navigate(pkg.link)}
                    className={`w-full py-4 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 ${pkg.buttonColor}`}
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