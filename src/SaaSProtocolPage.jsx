// POČETAK FAJLA: SaaSProtocolPage.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React from 'react';
import { Info, ChevronRight } from 'lucide-react';

// POČETAK FUNKCIJE: SaaSProtocolPage
export default function SaaSProtocolPage({ openCheckout }) {
  // Slike koje si generisao u Magnific-u
  const heroImage = "magnific_a-moody-lowkey-tech-scene_2994482255.png";
  
  const galleryImages = [
    "magnific_premium-tech-setup-on-a-p_2994483605.png",
    "magnific_a-highly-detailed-photore_2994474179.png",
    "magnific_an-isometric-topdown-view_2994477610.png",
    "magnific_a-rugged-yet-premium-tech_2994476068.png",
    "magnific_a-sharp-geometric-arrange_2994487710.png",
    "magnific_gritty-highcontrast-mocku_2994484971.png",
    "magnific_slightly-warmer-premium-t_2994486395.png"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-amber-500 selection:text-black pt-10">
      
      {/* HERO SEKCIJA */}
      <section className="relative pt-20 pb-20 px-6 lg:pt-32 lg:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        {/* Pozadinski sjaj */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        {/* 🔥 WORLD-CLASS PLAVI OBAVEŠTAJNI MODAL / BANNER 🔥 */}
        <div className="max-w-4xl mx-auto w-full mb-16 relative z-50">
          <div className="bg-[#020817]/80 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_50px_rgba(59,130,246,0.15)] relative overflow-hidden group">
            {/* Animirani plavi gornji highlight */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-80"></div>
            {/* Unutrašnji sjaj */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 to-transparent blur-2xl opacity-50 pointer-events-none"></div>
            
            {/* Ikonica */}
            <div className="shrink-0 w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.2)]">
              <Info className="w-8 h-8 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            </div>
            
            {/* Tekstualni sadržaj */}
            <div className="flex-1 text-center md:text-left relative z-10">
              <h3 className="text-blue-400 font-black uppercase tracking-[0.2em] text-[13px] md:text-[15px] mb-2 drop-shadow-md">
                Official Announcement
              </h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-medium">
                We are currently engineering the next-generation architecture for our proprietary SaaS visualization software. Our systems are undergoing core upgrades to deliver unprecedented 150MP UI environments. <strong className="text-white font-black tracking-wide block mt-2 text-blue-100">THIS DEDICATED PAGE WILL BE AVAILABLE SOON.</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center opacity-40 hover:opacity-100 transition-opacity duration-1000">
          <div className="inline-block border border-white/10 bg-white/5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-[0.2em] text-amber-500 mb-8 uppercase">
            Zero-Stage Assets for B2B Software
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-6 leading-tight">
            The SaaS Visual <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Protocol</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
            Wrap your software in 150MP physical reality. Mathematical cinematic environments engineered for your UI.
          </p>

          <button onClick={() => {
            const pricingSection = document.getElementById('pricing-tiers');
            if(pricingSection) pricingSection.scrollIntoView({ behavior: 'smooth' });
          }} className="bg-amber-500 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-not-allowed opacity-50">
            View Protocols
          </button>
        </div>

        {/* Hero Slika (Centralna Magnific Baza) - Smanjen Opacity zbog izrade */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-16 group opacity-40 grayscale-[50%] transition-all duration-1000">
          <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl opacity-50 transition duration-1000 group-hover:opacity-100"></div>
          <div className="relative border border-white/10 rounded-xl overflow-hidden bg-[#111] shadow-2xl">
            <img 
              src={heroImage} 
              alt="Cinematic Tech Mockup Setup" 
              className="w-full h-auto object-cover opacity-90 transition-opacity duration-700"
            />
            {/* UI Placeholder overlay za klijenta da vizualizuje svoj kod */}
            <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity duration-700 pointer-events-none bg-black/60 backdrop-blur-[4px]">
              <span className="text-blue-400 border border-blue-500/50 px-8 py-4 font-mono text-sm tracking-widest bg-black/80 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] font-black uppercase">
                [ SYSTEM UNDER CONSTRUCTION ]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Ostatak stranice zatamljen zbog izrade */}
      <div className="opacity-20 pointer-events-none select-none grayscale-[80%]">
        {/* THE FRICTION / PROBLEM */}
        <section className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-amber-500 mb-4 uppercase">The Bottleneck</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-tight">
                  The "Flat Screen" Paradox
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Your software is revolutionary, but your marketing relies on flat, generic device mockups that look like everyone else's. Vector iPhones on white backgrounds don't convey the premium value, security, or true user experience of your B2B platform.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-3 mt-1">■</span>
                    <span className="text-zinc-300">Investors judge the code by its packaging.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-500 mr-3 mt-1">■</span>
                    <span className="text-zinc-300">Standard mockups destroy brand authority.</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#111] p-10 rounded-xl border border-white/5 relative shadow-2xl">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-xl"></div>
                <h4 className="text-2xl text-white font-bold mb-4 uppercase tracking-widest">The V10 Solution</h4>
                <p className="text-zinc-400 leading-relaxed">
                  We don't just show your UI; we engineer the environment it lives in. Provide your Figma screens, and we mathematically map them onto hyper-realistic 150MP hardware—with flawless screen glare, ambient lighting, and cinematic depth of field.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 THE INVESTMENT / PRICING TIERS 🚀 */}
        <section id="pricing-tiers" className="py-24 px-6 bg-[#050505]">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-amber-500 mb-4 uppercase">The Protocols</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Initiate The Integration
            </h3>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              Choose the visual architecture package that aligns with your brand's growth stage. We engineer environments, not just images.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            
            {/* PAKET 1: Startup Launch */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col relative transition-all hover:border-amber-500/30 group">
              <h4 className="text-xl font-black text-white uppercase tracking-widest mb-2">Startup Launch</h4>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-amber-500">$400</span>
                <span className="text-sm text-zinc-500 font-bold mb-1 uppercase tracking-widest">Starting At</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                Perfect for early-stage startups needing premium visuals for their landing page to look expensive in front of investors.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">3 to 5 hyper-realistic 150MP renders</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Standard Environments (Concrete, Dark Wood)</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Devices: 2 Laptops, 1 Phone, 1 Tablet</span></li>
              </ul>
              <button 
                className="w-full bg-white/5 text-white font-bold uppercase text-xs tracking-widest py-4 rounded-xl border border-white/10 transition-all"
              >
                Select Package
              </button>
            </div>

            {/* PAKET 2: Enterprise Suite (Istaknuti) */}
            <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-amber-500/50 rounded-2xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(245,158,11,0.15)] z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                The Gold Standard
              </div>
              <h4 className="text-2xl font-black text-white uppercase tracking-widest mb-2 mt-2">Enterprise Suite</h4>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-5xl font-black text-amber-500">$1,500</span>
                <span className="text-sm text-zinc-500 font-bold mb-1.5 uppercase tracking-widest">Starting At</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                Complete visual identity overhaul. For SaaS companies executing a major rebranding, new site launch, or Series A pitch.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-white font-medium text-sm">10 to 15 hyper-realistic 150MP renders</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Custom Cinematic Environments engineered for your brand</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Full marketing toolkit (Web, Social, Investor Decks)</span></li>
              </ul>
              <button 
                className="w-full bg-amber-500 text-black font-black uppercase text-sm tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                Deploy Protocol
              </button>
            </div>

            {/* PAKET 3: Agency Retainer */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 flex flex-col relative transition-all hover:border-amber-500/30 group">
              <h4 className="text-xl font-black text-white uppercase tracking-widest mb-2">Agency Retainer</h4>
              <div className="flex items-end gap-2 mb-6">
                <span className="text-4xl font-black text-amber-500">$1,000</span>
                <span className="text-sm text-zinc-500 font-bold mb-1 uppercase tracking-widest">/ Month</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1">
                Exclusive visual architecture for UI/UX agencies. Upgrade your entire Dribbble/Behance portfolio to close high-ticket clients.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Up to 10 new 150MP mockups delivered monthly</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Priority rendering queue</span></li>
                <li className="flex items-start gap-3"><span className="text-amber-500 mt-0.5">■</span> <span className="text-zinc-300 text-sm">Dedicated V10 System Architect</span></li>
              </ul>
              <button 
                className="w-full bg-white/5 text-white font-bold uppercase text-xs tracking-widest py-4 rounded-xl border border-white/10 transition-all"
              >
                Partner Up
              </button>
            </div>

          </div>
        </section>

        {/* PORTFOLIO / THE ARSENAL (Magnific Slike) */}
        <section className="py-24 px-6 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-sm font-bold tracking-[0.2em] text-amber-500 mb-4 uppercase">The Arsenal</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tight">
              Base Environments
            </h3>
            <p className="text-zinc-500 mt-4 max-w-2xl mx-auto">
              These are raw, unedited base environments generated by the V10 Engine. Ready to host your software's interface.
            </p>
          </div>

          {/* Mreža slika */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((imgSrc, index) => (
              <div key={index} className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#111]">
                <img 
                  src={imgSrc} 
                  alt={`Cinematic SaaS Environment ${index + 1}`} 
                  className="w-full h-[400px] object-cover filter brightness-[0.8] contrast-125 transition-all duration-700"
                />
                {/* Dekompozicioni markeri */}
                <div className="absolute inset-0 border-[1px] border-white/0 transition-all duration-700 m-4"></div>
                <div className="absolute bottom-6 left-6 opacity-100 transition-opacity duration-500">
                  <span className="bg-black/80 text-amber-500 text-xs font-mono px-3 py-1 border border-amber-500/20 tracking-wider">
                    ENVIRONMENT_0{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SEKCIJA */}
        <section className="py-32 px-6 bg-[#050505] relative overflow-hidden border-t border-white/5 text-center">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[1000px] h-[500px] bg-amber-500/10 rounded-[100%] blur-[100px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight mb-8">
              Initiate The <br className="hidden md:block" />
              <span className="text-amber-500">Integration</span>
            </h2>
            <p className="text-xl text-zinc-400 mb-10 font-light">
              Stop losing enterprise deals because your software looks generic. Let's mathematically engineer your visual authority.
            </p>
            
            <button className="bg-amber-500 text-black font-bold text-lg uppercase tracking-widest px-10 py-5 rounded-xl transition-colors shadow-[0_0_30px_rgba(245,158,11,0.3)]">
              Upgrade Your UI
            </button>
            
            <div className="mt-12 text-sm font-mono text-zinc-600 uppercase tracking-widest">
              System Architect: Goran Damnjanovic
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
// KRAJ FUNKCIJE: SaaSProtocolPage