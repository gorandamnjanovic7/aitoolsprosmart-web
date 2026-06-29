import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, Zap, Bitcoin } from 'lucide-react';

export default function B2BProtocols() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, delay: 0.2 }}
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
          
          {/* --- RED 1 --- */}

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

          {/* Card 3: Payments Setup */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all duration-500 group shadow-inner">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-zinc-700 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <Zap className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Flexible Gateways
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Process transactions via our Security Checkout using crypto for instant delivery, or request direct B2B payment links for bulk agency licensing.
            </p>
          </div>

          {/* --- RED 2 --- */}

          {/* Card 4: PayPal & Visa */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-blue-600/40 transition-all duration-500 group shadow-inner">
            <div className="flex gap-3 items-center justify-center mb-6 h-16 group-hover:scale-105 transition-transform duration-500">
              
              {/* CSS Visa Card Mockup */}
              <div className="w-16 h-11 bg-gradient-to-br from-[#1a1f71] to-[#0d113a] rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.6)] relative overflow-hidden border border-white/10 flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
                <div className="absolute top-2 left-1.5 w-3 h-2.5 bg-gradient-to-br from-[#ffd700] to-[#daa520] rounded-[2px] border border-yellow-600/50 flex flex-col justify-between overflow-hidden">
                  <div className="w-full h-[1px] bg-yellow-800/40"></div>
                  <div className="w-full h-[1px] bg-yellow-800/40"></div>
                </div>
                <div className="absolute bottom-1 right-1.5 text-white font-black italic text-[8px] tracking-tighter">VISA</div>
                <div className="absolute bottom-1.5 left-1.5 text-white/50 text-[5px] tracking-widest font-mono">•••• 4242</div>
              </div>

              {/* CSS PayPal Button Mockup */}
              <div className="w-16 h-11 bg-gradient-to-b from-[#FFC439] to-[#F5B622] rounded-md shadow-[0_4px_15px_rgba(0,0,0,0.6)] flex items-center justify-center border border-yellow-400/50 flex-shrink-0">
                <div className="flex text-[11px] drop-shadow-sm">
                  <span className="text-[#003087] italic font-black">Pay</span>
                  <span className="text-[#009cde] italic font-black">Pal</span>
                </div>
              </div>
            </div>

            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Cards & PayPal
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Process your payments flawlessly via PayPal's global network. Use any major debit or credit card directly. Guest checkout available—no account required.
            </p>
          </div>

          {/* Card 5: Payoneer B2B */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-[#FF4800]/40 transition-all duration-500 group shadow-inner">
            <div className="flex items-center justify-center mb-6 h-16 group-hover:scale-105 transition-transform duration-500">
              
              {/* CSS Payoneer Logo Badge */}
              <div className="px-5 h-11 bg-[#111] rounded-md shadow-[0_4px_15px_rgba(255,72,0,0.15)] flex items-center justify-center border border-white/5 flex-shrink-0">
                <span className="text-[17px] tracking-tight font-medium">
                  <span className="text-white">pay</span><span className="text-[#FF4800]">oneer</span>
                </span>
              </div>

            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Payoneer B2B
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Execute frictionless B2B payments globally. Ideal for international agencies and corporate teams requiring swift, secure cross-border transactions via secure links.
            </p>
          </div>

          {/* Card 6: Cryptocurrency */}
          <div className="flex flex-col items-center text-center p-8 bg-black/40 rounded-3xl border border-white/5 hover:border-[#F7931A]/40 transition-all duration-500 group shadow-inner">
            <div className="flex items-center justify-center mb-6 h-16 group-hover:scale-110 transition-transform duration-500">
              <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center border border-[#F7931A]/20 shadow-[0_0_20px_rgba(247,147,26,0.1)]">
                <Bitcoin className="w-8 h-8 text-[#F7931A]" />
              </div>
            </div>
            <h3 className="text-white font-black uppercase tracking-widest text-[14px] mb-3">
              Cryptocurrency
            </h3>
            <p className="text-zinc-400 text-[12px] leading-relaxed">
              Embrace the future of decentralized finance. Securely process your transactions using Bitcoin, Ethereum, USDT, and other major coins through our verified Web3 node.
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}