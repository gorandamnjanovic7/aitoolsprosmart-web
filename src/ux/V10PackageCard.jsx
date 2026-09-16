// FAJL: V10PackageCard.jsx
import React from 'react';
import { CheckCircle2, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// POČETAK FUNKCIJE: V10PackageCard
const V10PackageCard = ({ data, cardVariants, onSelect }) => {
  const { theme, title, price, period, desc, features, isPopular, btnText } = data;

  const styles = {
    cyan: {
      wrapper: "border border-cyan-500/30 hover:border-cyan-500 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)] bg-[#0a0a0a]",
      primaryText: "text-cyan-500",
      secondaryText: "text-cyan-400",
      upsellBg: "from-cyan-950/40 to-black border border-cyan-900/50",
      upsellDivider: "border-cyan-900/50",
      btn: "bg-cyan-500 hover:bg-cyan-400 group-hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.8)]"
    },
    orange: {
      wrapper: "border-2 border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.15)] hover:shadow-[0_0_60px_rgba(249,115,22,0.3)] z-10 md:-mt-4 md:mb-4 bg-[#0a0a0a]",
      primaryText: "text-orange-500",
      secondaryText: "text-orange-400",
      upsellBg: "from-orange-950/40 to-black border border-orange-900/50",
      upsellDivider: "border-orange-900/50",
      btn: "bg-orange-500 hover:bg-orange-400 group-hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.8)]"
    },
    amber: {
      wrapper: "border border-amber-500/30 hover:border-amber-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] bg-[#0a0a0a]",
      primaryText: "text-amber-500",
      secondaryText: "text-amber-400",
      upsellBg: "from-amber-950/40 to-black border border-amber-900/50",
      upsellDivider: "border-amber-900/50",
      btn: "bg-amber-500 hover:bg-amber-400 group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.8)]"
    }
  };

  const s = styles[theme];

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`rounded-2xl p-8 transition-all duration-500 flex flex-col relative group ${s.wrapper}`}
    >
      {isPopular && (
        <motion.div
          animate={{ boxShadow: ["0px 0px 10px rgba(249,115,22,0.4)", "0px 0px 25px rgba(249,115,22,0.8)", "0px 0px 10px rgba(249,115,22,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-600 to-amber-500 text-black text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full"
        >
          Most Popular Choice
        </motion.div>
      )}

      <div className={`mb-6 ${isPopular ? 'mt-2' : ''}`}>
        <h3 className={`${s.primaryText} text-sm font-black tracking-widest uppercase mb-2 flex items-center gap-2`}>
          <Zap className="w-4 h-4" /> {title}
        </h3>
        <div className="text-white text-4xl font-black tracking-tight mb-2">
          ${price} <span className="text-neutral-500 text-sm font-medium uppercase tracking-wider">/ {period}</span>
        </div>
        <p className="text-neutral-400 text-sm font-medium">{desc}</p>
      </div>

      <div className="flex-grow mb-8">
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.15em] mb-4">What you download:</p>
        <ul className="space-y-4 text-sm text-neutral-300">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 ${s.primaryText} shrink-0`} />
              <span>{feature}</span>
            </li>
          ))}
          
          {/* NOVA SEKCIJA: Dinamička licenca na kraju liste */}
          <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
            <svg className={`w-5 h-5 ${s.primaryText} shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm text-gray-200 font-bold tracking-wide">
              {theme === 'cyan' && "PERSONAL LICENSE"}
              {theme === 'orange' && "COMMERCIAL AGENCY LICENSE"}
              {theme === 'amber' && "ENTERPRISE - MASTER LICENSE"}
            </span>
          </li>
        </ul>
      </div>

      <div className={`bg-gradient-to-br ${s.upsellBg} rounded-xl p-5 mb-8 ${theme === 'amber' ? 'mt-auto' : ''}`}>
        <p className={`text-[10px] ${s.secondaryText} font-black uppercase tracking-widest mb-2 flex items-center gap-2`}>
          <Sparkles className="w-3 h-3" /> Optional Add-on
        </p>
        <p className="text-sm text-white font-bold mb-1">Upscale Your Own Work</p>
        <p className="text-xs text-neutral-400 mb-3 leading-relaxed">We scale your personal finalized designs to massive resolutions for print.</p>
        <div className={`flex justify-between items-center text-sm border-t ${s.upsellDivider} pt-3`}>
          <span className="text-neutral-300">60MP Master</span>
          <span className={`${s.secondaryText} font-bold`}>+$49</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-neutral-300">150MP Ultra</span>
          <span className={`${s.secondaryText} font-bold`}>+$99</span>
        </div>
      </div>

      <div className="mb-6 text-center flex flex-col items-center justify-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mb-2">
          Contact / Custom Requests
        </span>
        <div className="px-4 py-2 rounded-lg bg-black/50 border border-white/5 hover:border-white/20 transition-all duration-300 group/email">
          <span 
            className="text-sm font-mono text-gray-400 select-all cursor-copy group-hover/email:text-white transition-colors"
            title="Click to select all and copy"
          >
            AITOOLSTPROSMART@GMAIL.COM
          </span>
        </div>
      </div>

      {/* 🔥 mt-auto dodato ovde da bi dugme uvek bilo savršeno poravnato na dnu kartice 🔥 */}
      <button 
        onClick={() => onSelect(title, price)}
        className={`mt-auto w-full ${s.btn} text-black font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:-translate-y-2 active:scale-95 group/btn`}
      >
        {btnText} <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
      </button>
    </motion.div>
  );
};
// KRAJ FUNKCIJE: V10PackageCard

export default V10PackageCard;