// ============================================================================
// FAJL: src/VerticalCardsBox.jsx (START OF FILE: VerticalCardsBox.jsx)
// RUTA / NAMENA: Sekcija "Enterprise Solutions" na HomePage.jsx — #121822 tema (Box 1: /stock | Box 2: Stock Berza 2 -> /stock-2)
// ============================================================================
import React, { useState } from 'react';
import { ArrowRight, Sparkles, Layers, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Pametni učitavač slika (automatski rešava _webp.webp / .webp ekstenzije i razmake u nazivu fajla u public/ folderu)
const SmartStockImage = ({ sources, alt }) => {
  const [srcIndex, setSrcIndex] = useState(0);

  const handleError = () => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex((prev) => prev + 1);
    }
  };

  return (
    <img
      src={sources[srcIndex]}
      onError={handleError}
      alt={alt}
      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
    />
  );
};

export default function VerticalCardsBox() {
  const navigate = useNavigate();

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="flex flex-col w-full relative overflow-hidden rounded-[2.8rem] bg-[#121822] border border-orange-500/35 shadow-[0_25px_85px_rgba(0,0,0,0.78)] py-16 md:py-22 group"
    >
      {/* Gornja svetlosna linija i ambijentalni odsjaji unutar #121822 panela */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
      <div className="absolute -top-32 -left-32 w-[520px] h-[520px] bg-orange-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Zaglavlje sekcije */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mb-14 relative z-10 text-center px-4"
      >
        <div className="inline-flex items-center gap-2 border border-orange-500/40 bg-[#0b0f17] px-4 py-1.5 rounded-full text-[11px] font-extrabold tracking-[0.2em] text-orange-400 mb-5 uppercase shadow-inner">
          <Sparkles className="w-3.5 h-3.5" /> V10 MASTER INTEGRATIONS
        </div>

        <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tight mb-3">
          Enterprise{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600">
            Solutions
          </span>
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm md:text-base font-bold uppercase tracking-[0.18em] max-w-2xl mx-auto">
          Deploy the ultimate 150MP visual infrastructure for your agency.
        </p>
      </motion.div>

      {/* Kontejner za dve vertikalne B2B Stock kartice */}
      <div className="flex flex-col gap-10 relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8">
        {/* PRVI BOKS — PREMIUM STOCK PHOTOS (/stock) */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative bg-[#0c1018]/95 border border-slate-800/90 hover:border-orange-500/65 transition-all duration-300 rounded-[2.2rem] p-7 sm:p-9 md:p-12 flex flex-col md:flex-row items-start gap-6 md:gap-10 shadow-[0_20px_55px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_60px_rgba(249,115,22,0.16)] overflow-hidden group/card"
        >
          <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-orange-500/8 rounded-full blur-[70px] pointer-events-none group-hover/card:bg-orange-500/16 transition-colors duration-500" />

          {/* Gornji desni bedž */}
          <div className="md:absolute md:top-8 md:right-8 border border-orange-500/40 bg-orange-500/15 text-orange-300 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full z-20">
            V10 Exclusive • Vault I
          </div>

          {/* Ikonica */}
          <div className="bg-[#121822] p-5 rounded-2xl border border-orange-500/35 shrink-0 shadow-inner relative z-10 md:mt-1">
            <Layers className="text-orange-400 w-9 h-9" />
          </div>

          {/* Sadržaj prvog boksa */}
          <div className="flex flex-col w-full relative z-10">
            <h3 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3 md:pr-44">
              Premium Stock Photos
            </h3>

            <p className="text-slate-300 text-sm md:text-[15px] leading-relaxed mb-7 max-w-3xl">
              <strong className="text-white font-extrabold">
                UNLEASH ABSOLUTE VISUAL DOMINANCE.
              </strong>{' '}
              Elevate your corporate identity with our flagship ultra-resolution master stock
              collection—100% unmarked, IP-safe, and engineered for luxury horology, jewelry, and
              commercial print.
            </p>

            {/* 16:9 Grid slika za Vault 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-[#121822] group-hover/card:border-orange-500/50 transition-colors duration-300">
                <SmartStockImage
                  sources={['/vertikal_1.webp', '/vertical_1.webp']}
                  alt="Premium Stock Example 1 - Horology Macro"
                />
              </div>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-[#121822] group-hover/card:border-orange-500/50 transition-colors duration-300">
                <SmartStockImage
                  sources={['/vertical_2.webp', '/vertikal_2.webp']}
                  alt="Premium Stock Example 2 - High Jewelry"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-center md:items-start mt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/stock')}
                className="w-full md:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest px-9 py-4.5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(249,115,22,0.32)] flex items-center justify-center gap-3 cursor-pointer"
              >
                Explore Stock Market <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* DRUGI BOKS — STOCK EXCHANGE II / STOCK BERZA 2 (/stock-2) */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="relative bg-[#0c1018]/95 border border-slate-800/90 hover:border-emerald-400/65 transition-all duration-300 rounded-[2.2rem] p-7 sm:p-9 md:p-12 flex flex-col md:flex-row items-start gap-6 md:gap-10 shadow-[0_20px_55px_rgba(0,0,0,0.65)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.16)] overflow-hidden group/card"
        >
          <div className="absolute top-0 right-0 w-[280px] h-[280px] bg-emerald-500/8 rounded-full blur-[70px] pointer-events-none group-hover/card:bg-emerald-500/16 transition-colors duration-500" />

          {/* Gornji desni bedž */}
          <div className="md:absolute md:top-8 md:right-8 border border-emerald-400/40 bg-emerald-500/15 text-emerald-300 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full z-20">
            150MP Archive • Vault II
          </div>

          {/* Ikonica */}
          <div className="bg-[#121822] p-5 rounded-2xl border border-emerald-400/35 shrink-0 shadow-inner relative z-10 md:mt-1">
            <Landmark className="text-emerald-400 w-9 h-9" />
          </div>

          {/* Sadržaj drugog boksa (Stock Berza 2 -> /stock-2) */}
          <div className="flex flex-col w-full relative z-10">
            <h3 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3 md:pr-44">
              Stock Exchange II — Master Vault
            </h3>

            <p className="text-slate-300 text-sm md:text-[15px] leading-relaxed mb-7 max-w-3xl">
              <strong className="text-white font-extrabold">
                ARCHITECTURAL GRANDEUR &amp; EDITORIAL SPACES.
              </strong>{' '}
              Access our expanded 150MP &amp; 4K UHD commercial exchange featuring sunlit stone
              colonnades, classical plazas, luxury hospitality interiors, and monumental campaign
              plates.
            </p>

            {/* 16:9 Grid sa tvoje 2 nove slike iz public/ foldera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-8">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-[#121822] group-hover/card:border-emerald-400/50 transition-colors duration-300">
                <SmartStockImage
                  sources={[
                    '/37_webp.webp',
                    '/37.webp',
                    '/stock-2/37_webp.webp',
                    '/stock-2/37.webp',
                    '/vertical_3.webp'
                  ]}
                  alt="Stock Exchange II - Master Plate 37"
                />
              </div>

              <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-[#121822] group-hover/card:border-emerald-400/50 transition-colors duration-300">
                <SmartStockImage
                  sources={[
                    '/Sunlit%20Colonnade%20and%20Stone%20Statues%20Above%20a%20Rainwashed%20Plaza_webp.webp',
                    '/Sunlit Colonnade and Stone Statues Above a Rainwashed Plaza_webp.webp',
                    '/Sunlit%20Colonnade%20and%20Stone%20Statues%20Above%20a%20Rainwashed%20Plaza.webp',
                    '/Sunlit Colonnade and Stone Statues Above a Rainwashed Plaza.webp',
                    '/stock-2/Sunlit%20Colonnade%20and%20Stone%20Statues%20Above%20a%20Rainwashed%20Plaza_webp.webp',
                    '/vertical_4.webp'
                  ]}
                  alt="Sunlit Colonnade and Stone Statues Above a Rainwashed Plaza"
                />
              </div>
            </div>

            <div className="w-full flex flex-col items-center md:items-start mt-1">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/stock-2')}
                className="w-full md:w-auto bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest px-9 py-4.5 rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.32)] flex items-center justify-center gap-3 cursor-pointer"
              >
                Explore Stock Exchange II <ArrowRight size={18} strokeWidth={3} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
// END OF FILE: VerticalCardsBox.jsx