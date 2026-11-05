// START OF FILE: AIAgentsShowcase.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Briefcase, Cpu, Maximize, Zap, ScanLine, Sparkles, Award, 
  Terminal, Aperture, Clapperboard, Code, ShieldCheck, MonitorPlay, 
  Video, Image as ImageIcon, LayoutGrid 
} from 'lucide-react';

// Data from NextPageHub
const upscalers = [
  { path: '/v8-standard-16mp', name: '16MP Standard', desc: 'V8 Engine', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-500/20', hover: 'group-hover:bg-blue-500/40', border: 'border-blue-500/30' },
  { path: '/master-33mp', name: '33.2MP Master', desc: 'Premium Upscaler', icon: Cpu, color: 'text-yellow-500', bg: 'bg-yellow-500/20', hover: 'group-hover:bg-yellow-500/40', border: 'border-yellow-500/30' },
  { path: '/master-45mp', name: '45MP Extreme', desc: 'Pro Marketplace', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/20', hover: 'group-hover:bg-amber-500/40', border: 'border-amber-500/30' },
  { path: '/master-60mp', name: '60MP MAX', desc: 'God Tier Resolution', icon: Cpu, color: 'text-rose-500', bg: 'bg-rose-500/20', hover: 'group-hover:bg-rose-500/40', border: 'border-rose-500/30' }
];

const masterTools = [
  { path: '/enxance', name: '10X VIZION', desc: 'Premium AI Engine', icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-500/20', hover: 'group-hover:bg-orange-500/40', border: 'border-orange-500/30' },
  { path: '/#marketplace', name: 'AI STORE', desc: 'Asset Marketplace', icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/20', hover: 'group-hover:bg-blue-500/40', border: 'border-blue-500/30' },
  { path: '/neural-forge', name: 'NEURAL FORGE', desc: 'Visual Synthesizer', icon: Terminal, color: 'text-cyan-500', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/30' },
  { path: '/raw-reality', name: 'RAW REALITY', desc: 'Anti-Aesthetic Generator', icon: Aperture, color: 'text-orange-500', bg: 'bg-orange-500/20', hover: 'group-hover:bg-orange-500/40', border: 'border-orange-500/30' },
  { path: '/grid-system', name: 'V8 CINEMATIK', desc: 'Cinematic Matrix Gen', icon: Clapperboard, color: 'text-yellow-500', bg: 'bg-yellow-500/20', hover: 'group-hover:bg-yellow-500/40', border: 'border-yellow-500/30' },
  { path: '/extractor', name: 'JSON EXTRACTOR', desc: 'Visual DNA Engine', icon: Code, color: 'text-cyan-500', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/30' },
  { path: '/v8-debranding-extractor', name: 'DE-BRANDING DNA', desc: 'White-Label Engine', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/20', hover: 'group-hover:bg-emerald-500/40', border: 'border-emerald-500/30' },
  { path: '/seedance', name: 'SEEDANCE 2.0', desc: 'Video Engine', icon: MonitorPlay, color: 'text-green-500', bg: 'bg-green-500/20', hover: 'group-hover:bg-green-500/40', border: 'border-green-500/30' },
  { path: '/kling', name: 'KLING 3.0', desc: 'Motion Engine', icon: Video, color: 'text-red-500', bg: 'bg-red-500/20', hover: 'group-hover:bg-red-500/40', border: 'border-red-500/30' },
];

export default function AIAgentsShowcase() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderCard = (item, idx) => {
    const Icon = item.icon;
    return (
      <Link key={idx} to={item.path} className={`bg-[#0a0a0a] border ${item.border} p-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all flex items-center gap-4 group`}>
        <div className={`${item.bg} p-3 rounded-xl shrink-0 ${item.hover} transition-colors`}>
          <Icon className={`w-6 h-6 ${item.color}`} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-white truncate">{item.name}</span>
          <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{item.desc}</span>
        </div>
      </Link>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white py-24 px-4 sm:px-6 font-sans relative z-10">
      <div className="max-w-[1200px] mx-auto space-y-24">
        
        {/* ========================================= */}
        {/* TOP SECTION: AI AGENTS                    */}
        {/* ========================================= */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/20 blur-[100px] pointer-events-none z-0"></div>
            <h1 className="relative z-10 text-3xl sm:text-5xl font-black uppercase tracking-wider mb-4 drop-shadow-[0_0_20px_rgba(8,145,178,0.5)]">
              V10 AI Sales & Support Agents
            </h1>
            <p className="relative z-10 text-slate-400 text-sm sm:text-base font-bold">
              Test our agents live from the cloud or order a turnkey embedding for your own enterprise platform. Trained for full catalog routing and B2B scoping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Agent 1: Visual Concierge (Jednostavna kartica) */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#050914] border border-cyan-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(8,145,178,0.15)] h-full justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Bot size={32} />
                 </div>
                 <h3 className="text-white font-black text-lg uppercase mb-2">Visual Concierge</h3>
                 <p className="text-slate-400 text-sm font-bold">Mockups & UI/UX Routing</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold uppercase py-3 rounded-xl transition">
                  Use Cloud ($29/mo)
                </button>
                <button className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black uppercase py-3 rounded-xl transition shadow-lg shadow-cyan-600/30">
                  Buy & Embed ($990)
                </button>
              </div>
            </div>

            {/* Agent 2: B2B Scoper (Jednostavna kartica) */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#050914] border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] h-full justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-4">
                    <Briefcase size={32} />
                 </div>
                 <h3 className="text-white font-black text-lg uppercase mb-2">B2B Sales Scoper</h3>
                 <p className="text-slate-400 text-sm font-bold">Automated Project Quotes</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold uppercase py-3 rounded-xl transition">
                  Use Cloud ($79/mo)
                </button>
                <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase py-3 rounded-xl transition shadow-lg shadow-emerald-600/30">
                  Buy & Embed ($1,490)
                </button>
              </div>
            </div>

            {/* Agent 3: Tech Engineer (Jednostavna kartica) */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#050914] border border-indigo-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(79,70,229,0.15)] h-full justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4">
                    <Cpu size={32} />
                 </div>
                 <h3 className="text-white font-black text-lg uppercase mb-2">Tech 24/7 Engineer</h3>
                 <p className="text-slate-400 text-sm font-bold">Dev & Infrastructure Support</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-xs font-bold uppercase py-3 rounded-xl transition">
                  Use Cloud ($49/mo)
                </button>
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase py-3 rounded-xl transition shadow-lg shadow-indigo-600/30">
                  Buy & Embed ($1,200)
                </button>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* ========================================= */}
        {/* BOTTOM SECTION: V10 SOFTWARE ECOSYSTEM    */}
        {/* ========================================= */}
        <section className="space-y-16">
          <div className="text-center relative">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider mb-2 text-slate-200">
              V10 Software Ecosystem
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Centralized Access to Master Tools, Premium Upscalers, and B2B Systems.
            </p>
          </div>

          {/* V8 MASTER TOOLS SECTION */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5"/> V8 MASTER TOOLS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterTools.map(renderCard)}
            </div>
          </div>

          {/* MASTER UPSCALERS SECTION */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <Maximize className="w-5 h-5"/> MASTER UPSCALERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upscalers.map(renderCard)}
            </div>
          </div>

          {/* B2B SYSTEMS SECTION */}
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <ScanLine className="w-5 h-5"/> B2B SYSTEMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/premium-menu" className="bg-[#0a0a0a] border border-purple-500/40 p-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all flex items-center gap-4 group">
                <div className="bg-purple-500/20 p-3 rounded-xl shrink-0 group-hover:bg-purple-500/40 transition-colors">
                  <ScanLine className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-white truncate">QR BUILDER</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">Premium Menu System</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
// END OF FILE: AIAgentsShowcase.jsx