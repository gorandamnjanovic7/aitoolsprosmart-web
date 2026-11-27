// ============================================================================
// FAJL: src/B2BProtocols.jsx
// RUTA / NAMENA: Sekcija "V10 Commercial Protocol" (Licenciranje, Fakture i B2B Plaćanja) u #121822 temi
// ============================================================================
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Zap, Bitcoin } from 'lucide-react';

export default function B2BProtocols() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="w-full max-w-7xl mx-auto my-16 relative z-10"
    >
      {/* Glavni kontejner u tačnoj #121822 boji sa narandžastim V10 okvirom */}
      <div className="bg-[#121822] border border-orange-500/35 rounded-[2.5rem] p-8 sm:p-10 md:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.75)] relative overflow-hidden">
        {/* Gornja narandžasta svetlosna linija i ambijentalni odsjaji */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent" />
        <div className="pointer-events-none absolute -top-28 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px]" />

        {/* Zaglavlje sekcije */}
        <div className="text-center mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#0b0f17] border border-orange-500/40 px-4 py-1.5 rounded-full text-orange-400 font-extrabold uppercase tracking-[0.2em] text-[11px] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            V10 COMMERCIAL PROTOCOL
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-3">
            BUILT FOR CREATIVE STUDIOS &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600">
              ELITE AGENCIES
            </span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm md:text-[15px] max-w-2xl mx-auto font-medium leading-relaxed">
            Instant electronic delivery for fast-moving design teams, backed by full corporate
            invoicing and perpetual worldwide commercial rights.
          </p>
        </div>

        {/* Mreža od 6 B2B kartica */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {/* Card 1: Instant Access & Corporate Invoicing */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-orange-500/60 hover:shadow-[0_15px_40px_rgba(249,115,22,0.14)] transition-all duration-300 group">
            <div className="w-16 h-16 bg-[#121822] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-orange-500/30 shadow-inner">
              <FileText className="w-7 h-7 text-orange-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Instant Access &amp; Invoicing
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Download your 150MP &amp; 4K master vaults immediately after checkout, with
              accounting-ready corporate invoices issued for studio and agency procurement.
            </p>
          </div>

          {/* Card 2: Perpetual Commercial License */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-emerald-400/60 hover:shadow-[0_15px_40px_rgba(16,185,129,0.14)] transition-all duration-300 group">
            <div className="w-16 h-16 bg-[#121822] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-emerald-400/30 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Lifetime Commercial License
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-5">
              Includes perpetual worldwide commercial rights and 100% IP-safe unmarked masters.
              Cleared for OOH billboards, luxury print, architectural pitches, client websites, and
              global ad campaigns.
            </p>
            <a
              href="/v8-license.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-300 border border-emerald-400/40 bg-emerald-500/15 px-4 py-2.5 rounded-xl hover:bg-emerald-400 hover:text-slate-950 transition-all"
            >
              <FileText size={13} /> View Full License Agreement
            </a>
          </div>

          {/* Card 3: Flexible B2B Gateways */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-sky-400/60 hover:shadow-[0_15px_40px_rgba(56,189,248,0.14)] transition-all duration-300 group">
            <div className="w-16 h-16 bg-[#121822] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-sky-400/30 shadow-inner">
              <Zap className="w-7 h-7 text-sky-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Flexible B2B Gateways
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Complete single-bundle checkouts instantly online, or request a custom B2B payment
              link for multi-seat agency vaults and bespoke 150MP production orders.
            </p>
          </div>

          {/* Card 4: Cards & PayPal */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-blue-400/60 hover:shadow-[0_15px_40px_rgba(59,130,246,0.14)] transition-all duration-300 group">
            <div className="flex gap-3 items-center justify-center mb-6 h-16 group-hover:scale-105 transition-transform duration-300">
              {/* CSS Visa Corporate Card */}
              <div className="w-16 h-11 bg-gradient-to-br from-[#1f2687] to-[#0f1547] rounded-md shadow-lg relative overflow-hidden border border-white/25 flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
                <div className="absolute top-2 left-1.5 w-3 h-2.5 bg-gradient-to-br from-[#ffd700] to-[#daa520] rounded-[2px] border border-yellow-500/60 flex flex-col justify-between overflow-hidden">
                  <div className="w-full h-[1px] bg-yellow-900/40" />
                  <div className="w-full h-[1px] bg-yellow-900/40" />
                </div>
                <div className="absolute bottom-1 right-1.5 text-white font-black italic text-[8px] tracking-tighter">
                  VISA
                </div>
                <div className="absolute bottom-1.5 left-1.5 text-white/70 text-[5px] tracking-widest font-mono">
                  •••• 4242
                </div>
              </div>

              {/* CSS PayPal Badge */}
              <div className="w-16 h-11 bg-gradient-to-b from-[#FFC439] to-[#F5B622] rounded-md shadow-lg flex items-center justify-center border border-yellow-300/60 flex-shrink-0">
                <div className="flex text-[11px] drop-shadow-sm">
                  <span className="text-[#003087] italic font-black">Pay</span>
                  <span className="text-[#009cde] italic font-black">Pal</span>
                </div>
              </div>
            </div>

            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Corporate Cards &amp; PayPal
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Settle purchases seamlessly via PayPal&apos;s global checkout network using any major
              corporate debit or credit card. Guest card checkout supported without an account.
            </p>
          </div>

          {/* Card 5: Payoneer B2B */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-[#FF4800]/60 hover:shadow-[0_15px_40px_rgba(255,72,0,0.14)] transition-all duration-300 group">
            <div className="flex items-center justify-center mb-6 h-16 group-hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#121822] rounded-2xl flex items-center justify-center border border-white/15 shadow-inner relative overflow-hidden">
                <div
                  className="w-9 h-9 rounded-full p-[3px] flex items-center justify-center shadow-sm"
                  style={{
                    background:
                      'conic-gradient(from 90deg, #FF3366, #FF9933, #33CC33, #00CCFF, #9933FF, #FF3366)'
                  }}
                >
                  <div className="w-full h-full bg-[#121822] rounded-full" />
                </div>
              </div>
            </div>

            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Payoneer B2B Settlement
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Frictionless international B2B transfers tailored for overseas agencies, architectural
              practices, and enterprise studios settling cross-border invoices.
            </p>
          </div>

          {/* Card 6: Cryptocurrency */}
          <div className="flex flex-col items-center text-center p-8 bg-[#0c1018]/95 hover:bg-[#161e2c] rounded-3xl border border-slate-800/90 hover:border-[#F7931A]/60 hover:shadow-[0_15px_40px_rgba(247,147,26,0.14)] transition-all duration-300 group">
            <div className="flex items-center justify-center mb-6 h-16 group-hover:scale-110 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#121822] rounded-2xl flex items-center justify-center border border-[#F7931A]/35 shadow-inner">
                <Bitcoin className="w-8 h-8 text-[#F7931A]" />
              </div>
            </div>

            <h3 className="text-white font-black uppercase tracking-wider text-sm mb-3">
              Digital Currency (USDT / BTC)
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Fast, borderless settlement via USDT, USDC, Ethereum, or Bitcoin with instant vault
              provisioning upon network confirmation.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}