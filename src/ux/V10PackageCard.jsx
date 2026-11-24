// FAJL: src/ux/V10PackageCard.jsx
import React from 'react';
import { CheckCircle2, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const V10PackageCard = ({ data, cardVariants, onSelect }) => {
  const { theme, title, pkgKey, price, priceDisplay, period, desc, features, isPopular, btnText } = data;

  const styles = {
    cyan: {
      wrapper: "border border-cyan-400/30 hover:border-cyan-400 hover:shadow-[0_20px_50px_rgba(6,182,212,0.18)] bg-gradient-to-b from-[#171e2c] to-[#0d121b]",
      primaryText: "text-cyan-400",
      secondaryText: "text-cyan-300",
      upsellBg: "from-[#121722] to-[#0a0e16] border border-cyan-500/30",
      upsellDivider: "border-cyan-500/20",
      btn: "bg-cyan-400 hover:bg-cyan-300 text-[#121722] group-hover:shadow-[0_10px_30px_-10px_rgba(34,211,238,0.8)]"
    },
    orange: {
      wrapper: "border-2 border-amber-400 shadow-[0_20px_60px_rgba(245,158,11,0.18)] hover:shadow-[0_25px_70px_rgba(245,158,11,0.32)] z-10 md:-mt-4 md:mb-4 bg-gradient-to-b from-[#1a2233] to-[#0d121b]",
      primaryText: "text-amber-400",
      secondaryText: "text-amber-300",
      upsellBg: "from-[#121722] to-[#0a0e16] border border-amber-500/30",
      upsellDivider: "border-amber-500/20",
      btn: "bg-amber-400 hover:bg-amber-300 text-[#121722] group-hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.8)]"
    },
    amber: {
      wrapper: "border border-orange-500/30 hover:border-orange-400 hover:shadow-[0_20px_50px_rgba(249,115,22,0.18)] bg-gradient-to-b from-[#171e2c] to-[#0d121b]",
      primaryText: "text-orange-400",
      secondaryText: "text-orange-300",
      upsellBg: "from-[#121722] to-[#0a0e16] border border-orange-500/30",
      upsellDivider: "border-orange-500/20",
      btn: "bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-[#121722] group-hover:shadow-[0_10px_30px_-10px_rgba(249,115,22,0.8)]"
    }
  };

  const s = styles[theme] || styles.orange;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.01 }}
      className={`rounded-2xl p-8 transition-all duration-500 flex flex-col relative group ${s.wrapper}`}
    >
      {isPopular && (
        <motion.div
          animate={{ boxShadow: ["0px 0px 10px rgba(245,158,11,0.4)", "0px 0px 25px rgba(245,158,11,0.85)", "0px 0px 10px rgba(245,158,11,0.4)"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-[#121722] text-[10px] font-black px-4 py-1.5 uppercase tracking-widest rounded-full whitespace-nowrap"
        >
          Most Popular Choice
        </motion.div>
      )}

      <div className={`mb-6 ${isPopular ? 'mt-2' : ''}`}>
        <h3 className={`${s.primaryText} text-sm font-black tracking-widest uppercase mb-2 flex items-center gap-2`}>
          <Zap className="w-4 h-4" /> {title}
        </h3>
        <div className="text-white text-4xl font-black tracking-tight mb-2">
          ${priceDisplay || price} <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">/ {period}</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">{desc}</p>
      </div>

      <div className="flex-grow mb-8">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.15em] mb-4">What you download:</p>
        <ul className="space-y-4 text-sm text-slate-300">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className={`w-5 h-5 ${s.primaryText} shrink-0`} />
              <span>{feature}</span>
            </li>
          ))}
          
          <li className="flex items-start gap-3 mt-4 pt-4 border-t border-white/10">
            <svg className={`w-5 h-5 ${s.primaryText} shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-sm text-white font-bold tracking-wide">
              {theme === 'cyan' && "COMMERCIAL RETAINER LICENSE"}
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
        <p className="text-xs text-slate-400 mb-3 leading-relaxed">We scale your personal finalized designs to massive resolutions for print.</p>
        <div className={`flex justify-between items-center text-sm border-t ${s.upsellDivider} pt-3`}>
          <span className="text-slate-300">60MP Master</span>
          <span className={`${s.secondaryText} font-bold`}>+$49</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-2">
          <span className="text-slate-300">150MP Ultra</span>
          <span className={`${s.secondaryText} font-bold`}>+$99</span>
        </div>
      </div>

      <div className="mb-6 text-center flex flex-col items-center justify-center">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-2">
          Contact / Custom Requests
        </span>
        <div className="px-4 py-2 rounded-lg bg-[#121722] border border-white/10 hover:border-amber-400/40 transition-all duration-300 group/email">
          <span 
            className="text-sm font-mono text-slate-300 select-all cursor-copy group-hover/email:text-amber-300 transition-colors"
            title="Click to select all and copy"
          >
            AITOOLSPROSMART@GMAIL.COM
          </span>
        </div>
      </div>

      <button 
        onClick={() => onSelect(pkgKey || title.toUpperCase(), price)}
        className={`mt-auto w-full ${s.btn} font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 group/btn cursor-pointer`}
      >
        {btnText} <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-2" />
      </button>
    </motion.div>
  );
};

export default V10PackageCard;