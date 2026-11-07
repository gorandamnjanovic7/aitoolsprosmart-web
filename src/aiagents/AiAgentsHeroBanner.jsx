// POČETAK FAJLA: AiAgentsHeroBanner.jsx
import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Bot, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AiAgentsHeroBanner() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8 bg-[#02040a] border-y border-slate-800 overflow-hidden font-sans">
      {/* Pozadinski svetleći efekti (Glow efekat) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 blur-[110px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Levi deo: Tekst i poziv na akciju */}
        <div className="text-center lg:text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-black uppercase tracking-widest shadow-lg">
            <Sparkles size={14} /> Visionary Factory V10 Ecosystem
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Deploy Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">AI Agents</span> to Your Business
          </h1>
          
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Automate multi-channel marketing, B2B lead generation, and 24/7 client communication. Scale your agency output effortlessly with next-gen AI workforce solutions.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <Link 
              to="/ai-agents" 
              className="bg-gradient-to-r from-cyan-600 to-indigo-600 hover:scale-105 transition-transform text-white font-bold px-8 py-4 rounded-2xl shadow-[0_0_25px_rgba(8,145,178,0.5)] border border-cyan-400/30 text-sm flex items-center gap-2"
            >
              Explore AI Agents <ArrowRight size={18} />
            </Link>
            <a 
              href="mailto:aitoolsprosmat@gmail.com?subject=Custom%20B2B%20AI%20Agent%20Project%20Inquiry" 
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold px-7 py-4 rounded-2xl border border-slate-700 transition text-sm shadow-md flex items-center gap-2"
            >
              Request Custom Build 💼
            </a>
          </div>
        </div>

        {/* Desni deo: Interaktivna/Vizuelna kartica sa pogodnostima */}
        <div className="w-full lg:w-auto">
          <div className="bg-[#050914]/90 border border-slate-800 p-7 rounded-3xl shadow-2xl backdrop-blur-md max-w-sm space-y-5 relative">
            <div className="absolute -top-3 -right-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active 24/7
            </div>
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="text-white text-sm font-black uppercase tracking-wider">Autonomous Suite</h3>
                <p className="text-xs text-slate-400">12+ Specialized Corporate Agents</p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-800/80 pt-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> Instant CRM & Inbox Triage
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> Multi-Language Localization (30+ langs)
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" /> High-Ticket Pipeline Generation
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full bg-slate-900/90 rounded-2xl p-3 text-center text-xs font-mono text-cyan-300 border border-slate-800 flex items-center justify-center gap-2 shadow-inner">
                <ShieldCheck size={16} className="text-cyan-400" /> Ready for Enterprise Integration
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
// KRAJ FAJLA: AiAgentsHeroBanner.jsx