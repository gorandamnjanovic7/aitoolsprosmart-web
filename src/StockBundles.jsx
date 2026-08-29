// POČETAK FAJLA: StockBundles.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // ISPRAVLJENA LINIJA 🔥
import { Image as ImageIcon, ArrowRight, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import V8Reveal from './V8Reveal';
import V8CinematicText from './v8-ui-components/V8CinematicText';

const StockBundles = () => {
  const bundlesData = [
    {
      id: 1,
      title: "Luxury Real Estate",
      subtitle: "Penthouses, Modern Villas, Interiors",
      assets: "50 ASSETS",
      price: "$49",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      theme: "blue",
      accent: "text-blue-600",
      bgAccent: "bg-blue-50",
      borderAccent: "border-blue-200"
    },
    {
      id: 2,
      title: "Premium Gourmet",
      subtitle: "Steaks, Luxury Desserts, Plating",
      assets: "40 ASSETS",
      price: "$39",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80",
      badge: "BEST SELLER",
      theme: "orange",
      accent: "text-orange-600",
      bgAccent: "bg-orange-50",
      borderAccent: "border-orange-200"
    },
    {
      id: 3,
      title: "V8 Tech & Gadgets",
      subtitle: "Microphones, VR, Smart Devices",
      assets: "50 ASSETS",
      price: "$49",
      img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
      theme: "indigo",
      accent: "text-indigo-600",
      bgAccent: "bg-indigo-50",
      borderAccent: "border-indigo-200"
    }
  ];

  return (
    <div id="stock-bundles" className="mb-24 flex flex-col items-center justify-center text-center pt-10 pb-20 relative overflow-hidden scroll-mt-32">
      
      {/* PREMIUM LIGHT HEADER */}
      <V8Reveal delay={0.2} direction="up">
        <div className="relative w-full max-w-6xl mx-auto rounded-[3rem] overflow-hidden py-16 px-6 mb-20 border border-slate-200/80 shadow-[0_15px_50px_rgba(0,0,0,0.04)] group bg-white">
          <div className="absolute inset-0 z-0">
            <img src="/v8-stock/v8-master-bg.jpg" alt="V8 Premium Stock Background" className="w-full h-full object-cover opacity-10 group-hover:scale-105 transition-transform duration-1000 grayscale" />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-blue-50/40 to-white"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-blue-50 p-4 rounded-full mb-6 relative z-10 inline-block border border-blue-100 shadow-sm">
              <ImageIcon className="w-10 h-10 text-blue-500" strokeWidth={1.5} />
            </div>
            <V8CinematicText text="V8 45MP MASTER BUNDLES" className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4" delay={0.2} />
            <div className="text-[13px] md:text-[15px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
              The Vault of Optical Authority. Unmatched Clarity.
            </div>
            <p className="text-slate-600 text-[10px] md:text-[12px] max-w-3xl font-medium uppercase tracking-[0.2em] leading-relaxed mt-6 mx-auto px-4">
              <span className="font-black text-slate-900">EXPERIENCE PURE 45 MEGAPIXEL PRECISION ENGINEERED WITH LANCZOS ALGORITHM. ZERO COMPROMISE.</span><br /><br />
              <span className="text-blue-600 font-black uppercase">FLAWLESS SRGB COLOR GRADING. FOR HOLLYWOOD-TIER PRODUCTIONS AND ELITE BRANDING.</span>
            </p>
          </div>
        </div>
      </V8Reveal>

      {/* CASCADE STACK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full px-4 lg:px-8 relative z-10 max-w-7xl mx-auto py-4">
        
        {bundlesData.map((bundle, index) => (
          <motion.div
            key={bundle.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="relative h-full"
          >
            <motion.div
              initial="rest"
              whileHover="hover"
              animate="rest"
              className={`h-full bg-white/70 backdrop-blur-xl border ${bundle.badge ? 'border-orange-300 shadow-[0_20px_50px_rgba(249,115,22,0.1)]' : 'border-slate-200/80 shadow-[0_15px_40px_rgba(0,0,0,0.06)]'} rounded-[2.5rem] p-6 md:p-8 flex flex-col items-start text-left transition-colors duration-500 hover:bg-white relative`}
            >
              
              {bundle.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full z-30 shadow-md border border-orange-400">
                  {bundle.badge}
                </div>
              )}

              <div className="relative w-full h-56 mb-8 mt-4 flex items-center justify-center">
                
                {/* Slika Levo */}
                <motion.div 
                  variants={{
                    rest: { rotate: -6, x: -15, scale: 0.9, opacity: 0.5 },
                    hover: { rotate: -20, x: -45, scale: 0.95, opacity: 0.9 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-[80%] h-full rounded-2xl ${bundle.bgAccent} border ${bundle.borderAccent} shadow-sm overflow-hidden`}
                >
                  <img src={bundle.img} alt="Layer 3" className="w-full h-full object-cover opacity-30 grayscale" />
                </motion.div>

                {/* Slika Desno */}
                <motion.div 
                  variants={{
                    rest: { rotate: 6, x: 15, scale: 0.9, opacity: 0.5 },
                    hover: { rotate: 20, x: 45, scale: 0.95, opacity: 0.9 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-[80%] h-full rounded-2xl ${bundle.bgAccent} border ${bundle.borderAccent} shadow-sm overflow-hidden`}
                >
                  <img src={bundle.img} alt="Layer 2" className="w-full h-full object-cover opacity-50 grayscale" />
                </motion.div>

                {/* Glavna Slika */}
                <motion.div 
                  variants={{
                    rest: { y: 0, scale: 1 },
                    hover: { y: -15, scale: 1.05 }
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute z-10 w-[95%] h-full rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden bg-slate-100"
                >
                  <img src={bundle.img} alt={bundle.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-800 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Layers size={10} className={bundle.accent} /> {bundle.assets}
                  </div>
                </motion.div>

              </div>

              <h3 className="text-2xl font-black uppercase text-slate-900 tracking-tighter mb-1 relative z-20">{bundle.title}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-8 relative z-20">{bundle.subtitle}</p>
              
              <div className="mt-auto w-full flex items-center justify-between relative z-20 pt-4 border-t border-slate-100">
                <span className={`text-3xl font-black ${bundle.accent}`}>
                  {bundle.price}
                </span>
                <Link 
                  to="/stock" 
                  className={`px-6 py-3 bg-slate-50 text-slate-700 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-sm border border-slate-200 flex items-center gap-2
                  ${bundle.badge ? 'hover:bg-orange-500 hover:border-orange-500' : 'hover:bg-blue-600 hover:border-blue-600'}`}
                >
                  VIEW BUNDLE <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ))}

      </div>

      <V8Reveal delay={0.6} direction="up">
        <div className="mt-16 relative z-10">
          <Link to="/stock" className="inline-flex items-center gap-3 text-slate-500 hover:text-slate-900 text-[12px] font-black uppercase tracking-widest transition-all group">
            EXPLORE ALL MASTER BUNDLES <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform text-blue-500" />
          </Link>
        </div>
      </V8Reveal>

    </div>
  );
};

export default StockBundles;
// KRAJ FAJLA: StockBundles.jsx