import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Zap } from 'lucide-react';

export default function B2BProtocols() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, delay: 0.2 }}
      // 🔥 DODATO mt-24 (margin-top) KAKO BI SE BOX SPUSTIO NANIŽE 🔥
      className="w-full max-w-7xl mx-auto mt-24 mb-24 z-10"
    >
      <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_rgba(255,140,0,0.05)] relative overflow-hidden">
        
        {/* Subtle orange glow at the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent"></div>

        <div className="text-center mb-12">
          <div className="inline-block bg-zinc-900 border border-zinc-700 px-4 py-1.5 rounded-full text-zinc-300 font-bold uppercase tracking-[0.2em] text-[10px] mb-4">
            V8 COMMERCIAL PROTOCOL
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest mb-3">
            BUILT FOR SOLO CREATORS & <span className="text-orange-500">ELITE AGENCIES</span>
          </h2>
          <p className="text-zinc-400 text-[13px] md:text-[15px] max-w-2xl mx-auto font-medium">
            Instant, frictionless access for independent professionals, with full VAT-compliant invoicing available for corporate production teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Delivery and Invoicing */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-orange-500/40 transition-all duration-500 group shadow-inner">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <FileText className="w-7 h-7 text-orange-500" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Instant Access & Invoicing
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Download your assets immediately after checkout. Generate a standard receipt for personal use, or a tax-compliant corporate invoice for your agency.
            </p>
          </div>

          {/* Card 2: Licensing */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-emerald-500/40 transition-all duration-500 group shadow-inner">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Lifetime Commercial License
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              100% IP-safe assets. Legally cleared for YouTube monetization, freelance projects, global marketing, and high-end digital ad campaigns.
            </p>
          </div>

          {/* Card 3: Payments (Crypto + IBAN) */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all duration-500 group shadow-inner">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Zap className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Flexible Payment Gateways
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Process transactions via our Security Checkout using crypto for instant delivery, or request direct IBAN wire transfers for bulk agency licensing.
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}