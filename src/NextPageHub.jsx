// START OF FILE: NextPageHub.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Maximize, Zap, ScanLine, Sparkles, Award, Terminal, Aperture, Clapperboard, Code, ShieldCheck, MonitorPlay, Video, Cpu, Image as ImageIcon, LayoutGrid, Bot, Briefcase } from 'lucide-react';

// 3 Separate AI Agents for the Sales Dashboard
const aiAgents = [
  { path: '/ai-agents', name: 'VISUAL CONCIERGE', desc: 'Mockups & UI/UX Routing', icon: Bot, color: 'text-cyan-400', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/40' },
  { path: '/ai-agents', name: 'B2B SALES SCOPER', desc: 'Automated Project Quotes', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-500/20', hover: 'group-hover:bg-emerald-500/40', border: 'border-emerald-500/40' },
  { path: '/ai-agents', name: 'TECH 24/7 ENGINEER', desc: 'Dev & Infrastructure Support', icon: Cpu, color: 'text-indigo-400', bg: 'bg-indigo-500/20', hover: 'group-hover:bg-indigo-500/40', border: 'border-indigo-500/40' }
];

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

export default function NextPageHub() {
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
    <div className="min-h-screen pt-32 pb-24 px-6 relative z-10 font-sans text-white">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/20 blur-[100px] pointer-events-none z-0"></div>
          <h1 className="relative z-10 text-4xl md:text-6xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 drop-shadow-[0_0_20px_rgba(234,88,12,0.5)]">
            NEXT PAGE HUB
          </h1>
          <p className="relative z-10 text-zinc-400 mt-4 text-xs md:text-sm font-bold tracking-[0.3em] uppercase">
            Centralized Access to Master Tools
          </p>
        </div>

        {/* AI AGENTS SECTION */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400"/> AI SALES & SUPPORT AGENTS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiAgents.map(renderCard)}
          </div>
        </div>

        {/* V8 MASTER TOOLS SECTION */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2"><LayoutGrid className="w-5 h-5"/> V8 MASTER TOOLS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {masterTools.map(renderCard)}
          </div>
        </div>

        {/* MASTER UPSCALERS SECTION */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2"><Maximize className="w-5 h-5"/> MASTER UPSCALERS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upscalers.map(renderCard)}
          </div>
        </div>

        {/* B2B SYSTEMS SECTION */}
        <div className="mb-16">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2"><ScanLine className="w-5 h-5"/> B2B SYSTEMS</h2>
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

      </div>
    </div>
  );
}
// END OF FILE: NextPageHub.jsx