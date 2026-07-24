// POČETAK FAJLA: SaaSProtocolPage.jsx
// Podsetnik: Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, X, Upload, Trash2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; 

// POČETAK FUNKCIJE: SaaSProtocolPage
export default function SaaSProtocolPage({ openCheckout }) {
  const navigate = useNavigate(); 

  // State za Full-Screen slike
  const [selectedImage, setSelectedImage] = useState(null);
  
  // State-ovi za Figma UI Preview na Hero slici (Odvojeni za svaki uređaj)
  const [laptopPreview, setLaptopPreview] = useState(null);
  const [ipadPreview, setIpadPreview] = useState(null);
  const [phonePreview, setPhonePreview] = useState(null);
  
  // STATE ZA TABOVE UNUTAR "CUSTOM ARCHITECTURE" BOXA
  const [customTab, setCustomTab] = useState('bilbord');

  // Odvojeni tajmeri
  const laptopTimerRef = useRef(null);
  const ipadTimerRef = useRef(null);
  const phoneTimerRef = useRef(null);

  const handleUiUpload = (e, device) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      if (device === 'laptop') {
        if (laptopTimerRef.current) clearTimeout(laptopTimerRef.current);
        setLaptopPreview(imageUrl);
        laptopTimerRef.current = setTimeout(() => setLaptopPreview(null), 600000); // 10 min
      } 
      else if (device === 'ipad') {
        if (ipadTimerRef.current) clearTimeout(ipadTimerRef.current);
        setIpadPreview(imageUrl);
        ipadTimerRef.current = setTimeout(() => setIpadPreview(null), 600000); // 10 min
      } 
      else if (device === 'phone') {
        if (phoneTimerRef.current) clearTimeout(phoneTimerRef.current);
        setPhonePreview(imageUrl);
        phoneTimerRef.current = setTimeout(() => setPhonePreview(null), 600000); // 10 min
      }
    }
  };

  // Očisti sve tajmere ako korisnik napusti stranicu
  useEffect(() => {
    return () => {
      if (laptopTimerRef.current) clearTimeout(laptopTimerRef.current);
      if (ipadTimerRef.current) clearTimeout(ipadTimerRef.current);
      if (phoneTimerRef.current) clearTimeout(phoneTimerRef.current);
    };
  }, []);

  // Slike
  const heroImage = "magnific_a-moody-lowkey-tech-scene_2994482255.png";
  
  const galleryImages = [
    "magnific_premium-tech-setup-on-a-p_2994483605.png", // VIP 1
    "magnific_a-highly-detailed-photore_2994474179.png", // VIP 2
    "/red_2_mocup_1.jpeg",                               // VIP 3
    "magnific_a-rugged-yet-premium-tech_2994476068.png", // VIP 4
    "/red_3_mocup_1.jpeg",                               // VIP 5
    "/red_3_mocup_2.jpeg",                               // VIP 6
    "magnific_slightly-warmer-premium-t_2994486395.png", // VIP 7
    "/red_4_mocup_2.jpeg",                               // VIP 8
    "/red5_mocup_1.webp",                                // VIP 9 (Novi Red 5)
    "/red5_mocup_2.webp"                                 // VIP 10 (Novi Red 5)
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-amber-500 selection:text-black pt-10">
      
      {/* FULL SCREEN IMAGE MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="fixed top-10 right-6 md:top-20 md:right-20 text-amber-500 hover:text-black bg-black/60 backdrop-blur-md hover:bg-amber-500 border-2 border-amber-500/50 p-4 rounded-full transition-all z-[1000] cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="relative max-w-[1920px] w-full max-h-[95vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_80px_rgba(245,158,11,0.15)] cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* HERO SEKCIJA (SA LAPTOPOM) */}
      <section className="relative pt-20 pb-10 px-6 lg:pt-32 lg:pb-16 overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
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
          }} className="bg-amber-500 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]">
            View Protocols
          </button>
        </div>

        {/* GLAVNI MOCKUP SA LIVE PREVIEW FUNKCIJOM */}
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-20 group transition-all duration-1000">
          
          {/* OBAVEŠTENJE ZA KLIJENTE (LIVE LAB) */}
          <div className="w-full flex justify-center mb-6 z-30">
            <div className="bg-[#111] border border-amber-500/50 px-6 py-3 rounded-full flex items-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
              <span className="text-amber-500 text-xs md:text-sm font-black uppercase tracking-widest drop-shadow-md">
                Live Lab: Click on device screens to test your UI (PNG/JPG)
              </span>
            </div>
          </div>

          <div className="relative border border-white/10 rounded-xl overflow-hidden bg-[#111] shadow-2xl">
            <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/20 to-transparent blur-2xl opacity-50 transition duration-1000 group-hover:opacity-100 pointer-events-none"></div>
            
            <img 
              src={heroImage} 
              alt="Cinematic Tech Mockup Setup" 
              className="w-full h-auto object-cover relative z-10"
            />
            
            {/* 🔥 INTERAKTIVNI EKRAN 1: LAPTOP 🔥 */}
            <div 
              className="absolute z-20 overflow-hidden rounded-[2px] transition-all duration-300 flex items-center justify-center group/screen shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-black/20"
              style={{ 
                top: '30.5%', 
                left: '28.8%', 
                width: '18.5%', 
                height: '23.5%',
                transform: 'perspective(1000px) rotateY(3deg) rotateX(1deg)'
              }}
            >
              {laptopPreview ? (
                <>
                  <img src={laptopPreview} alt="Laptop UI Preview" className="absolute inset-0 w-full h-full object-fill opacity-90 mix-blend-screen" />
                  <button onClick={(e) => { e.stopPropagation(); setLaptopPreview(null); }} className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={16}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 border border-transparent hover:border-amber-500/50 transition-all text-transparent hover:text-amber-500 group/upload backdrop-blur-[1px]">
                  <Upload className="w-6 h-6 mb-2 opacity-0 group-hover/upload:opacity-100 transition-opacity transform group-hover/upload:-translate-y-1" />
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/upload:opacity-100 transition-opacity">Upload UI</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'laptop')} accept="image/*" />
                </label>
              )}
            </div>

            {/* 🔥 INTERAKTIVNI EKRAN 2: IPAD 🔥 */}
            <div 
              className="absolute z-20 overflow-hidden rounded-[4px] transition-all duration-300 flex items-center justify-center group/screen shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] bg-black/20"
              style={{ 
                top: '39%', 
                left: '49.8%', 
                width: '15.5%', 
                height: '20%',
                transform: 'perspective(1000px) rotateY(-12deg) rotateX(2deg) skewY(-2deg)'
              }}
            >
              {ipadPreview ? (
                <>
                  <img src={ipadPreview} alt="iPad UI Preview" className="absolute inset-0 w-full h-full object-fill opacity-90 mix-blend-screen" />
                  <button onClick={(e) => { e.stopPropagation(); setIpadPreview(null); }} className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={16}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 border border-transparent hover:border-amber-500/50 transition-all text-transparent hover:text-amber-500 group/upload backdrop-blur-[1px]">
                  <Upload className="w-5 h-5 mb-1 opacity-0 group-hover/upload:opacity-100 transition-opacity transform group-hover/upload:-translate-y-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/upload:opacity-100 transition-opacity text-center px-1">Upload UI</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'ipad')} accept="image/*" />
                </label>
              )}
            </div>

            {/* 🔥 INTERAKTIVNI EKRAN 3: TELEFON 🔥 */}
            <div 
              className="absolute z-20 overflow-hidden rounded-[8px] transition-all duration-300 flex items-center justify-center group/screen shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] bg-black/20"
              style={{ 
                top: '47%',      
                left: '68.5%',     
                width: '4.8%',   
                height: '16.5%',   
                transform: 'perspective(1000px) rotateY(-18deg) rotateX(3deg) skewY(-3deg)'
              }}
            >
              {phonePreview ? (
                <>
                  <img src={phonePreview} alt="Phone UI Preview" className="absolute inset-0 w-full h-full object-fill opacity-90 mix-blend-screen" />
                  <button onClick={(e) => { e.stopPropagation(); setPhonePreview(null); }} className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={12}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-black/50 border border-transparent hover:border-amber-500/50 transition-all text-transparent hover:text-amber-500 group/upload backdrop-blur-[1px]">
                  <Upload className="w-4 h-4 mb-1 opacity-0 group-hover/upload:opacity-100 transition-opacity transform group-hover/upload:-translate-y-1" />
                  <span className="text-[6px] font-black uppercase tracking-widest opacity-0 group-hover/upload:opacity-100 transition-opacity">UI</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'phone')} accept="image/*" />
                </label>
              )}
            </div>
            
            {/* Indikator tajmera */}
            {(laptopPreview || ipadPreview || phonePreview) && (
              <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md border border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)] z-30 pointer-events-none">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-amber-500 text-xs font-black uppercase tracking-widest">
                  Active (Auto-Deletes in 10m)
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA SEKCIJA PREMEŠTENA ODMAH ISPOD LAPTOPA (HERO MOCKUPA) */}
      <section className="py-16 px-6 bg-[#050505] relative overflow-hidden text-center z-10 border-b border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-amber-500/10 rounded-[100%] blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
            Initiate The <span className="text-amber-500">Integration</span>
          </h2>
          <p className="text-sm md:text-base text-zinc-400 mb-8 font-light leading-relaxed">
            Stop losing enterprise deals because your software looks generic. Let's mathematically engineer your visual authority.
          </p>
          
          <button onClick={() => navigate('/standard-mocup')} className="bg-amber-500 text-black font-black text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400">
            Upgrade Your UI
          </button>
          
          <div className="mt-8 text-[10px] md:text-xs font-mono text-zinc-600 uppercase tracking-widest">
            System Architect: Goran Damnjanovic
          </div>
        </div>
      </section>

      <div>
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
            
            {/* PAKET 1 */}
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
                onClick={openCheckout}
                className="w-full bg-white/5 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl border border-white/10 transition-all hover:bg-white/10"
              >
                Security Checkout
              </button>
            </div>

            {/* PAKET 2 (Istaknuti) */}
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
                onClick={openCheckout}
                className="w-full bg-amber-500 text-black font-black uppercase text-sm tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400"
              >
                Secure Protocol Checkout
              </button>
            </div>

            {/* PAKET 3 */}
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
                onClick={openCheckout}
                className="w-full bg-white/5 text-white font-black uppercase text-xs tracking-widest py-4 rounded-xl border border-white/10 transition-all hover:bg-white/10"
              >
                Partner Up (Secure)
              </button>
            </div>

          </div>
        </section>

        {/* PORTFOLIO / THE ARSENAL */}
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

          {/* 🔥 VIP KARTICE (PRVI RED MOCKUPA) 🔥 */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* VIP Kartica 1: Protocol Alpha */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[0])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[0]} alt="Protocol Alpha" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Alpha</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Warm Obsidian Setup</h4>
                <p className="text-zinc-400 text-base leading-relaxed">High-fidelity warm ambient lighting reflecting off dark walnut surfaces. Engineered perfectly for showcasing complex dashboard analytics and premium dark-mode SaaS interfaces.</p>
              </div>
            </div>

            {/* VIP Kartica 2: Protocol Beta */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[1])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[1]} alt="Protocol Beta" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '1s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Beta</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Raw Industrial Concrete</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Gritty industrial aesthetics with stark cinematic shadows and concrete textures. Built specifically for enterprise security platforms and high-tech infrastructure developer tools.</p>
              </div>
            </div>
          </div>

          {/* 🔥 VIP KARTICE (DRUGI RED MOCKUPA) 🔥 */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* VIP Kartica 3: Protocol Gamma */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[2])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[2]} alt="Protocol Gamma" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Gamma</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Stealth Hacker Environment</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Pure dark background with subtle cinematic lighting and sleek reflective surfaces. Ideal for cybersecurity tools, developer platforms, and deep-tech SaaS architectures.</p>
              </div>
            </div>

            {/* VIP Kartica 4: Protocol Delta */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[3])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[3]} alt="Protocol Delta" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Delta</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Rugged Premium Tech</h4>
                <p className="text-zinc-400 text-base leading-relaxed">High-contrast rugged aesthetics featuring robust hardware in dramatic natural lighting. Designed specifically for field-operations software and heavy-industry management tools.</p>
              </div>
            </div>
          </div>

          {/* 🔥 VIP KARTICE (TREĆI RED MOCKUPA) 🔥 */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            {/* VIP Kartica 5: Protocol Epsilon */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[4])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[4]} alt="Protocol Epsilon" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '0.2s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Epsilon</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Executive Wood Workspace</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Premium dark oak aesthetics with warm ambient lighting. Engineered to perfectly frame high-level executive dashboards and luxury B2B financial tools.</p>
              </div>
            </div>

            {/* VIP Kartica 6: Protocol Zeta */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[5])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[5]} alt="Protocol Zeta" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '1.2s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Zeta</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Cinematic Dark Station</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Atmospheric, low-key lighting with subtle smoke and premium hardware. Engineered for extreme tech sectors, AI architectures, and cutting-edge visual systems.</p>
              </div>
            </div>
          </div>

          {/* 🔥 VIP KARTICE (ČETVRTI RED MOCKUPA) 🔥 */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* VIP Kartica 7: Protocol Eta */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[6])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[6]} alt="Protocol Eta" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '0.8s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Eta</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Warm Ambient Base</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Rich, warm tones and soft lighting designed to highlight human-centric applications, CRM dashboards, and premium lifestyle SaaS platforms.</p>
              </div>
            </div>

            {/* VIP Kartica 8: Protocol Theta */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[7])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[7]} alt="Protocol Theta" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '0.4s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Theta</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Monolithic Concrete</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Heavy industrial concrete platform with dramatic shadows. Engineered specifically for robust architectural tools, enterprise logistics, and industrial tech software.</p>
              </div>
            </div>
          </div>

          {/* 🔥 VIP KARTICE (PETI RED MOCKUPA) 🔥 */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
            {/* VIP Kartica 9: Protocol Iota */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[8])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[8]} alt="Protocol Iota" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '0.6s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Iota</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Corporate Oak & Steel</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Rich oak wood textures merged with dark steel elements. Engineered for high-ticket corporate management systems and elite financial analytics dashboards.</p>
              </div>
            </div>

            {/* VIP Kartica 10: Protocol Kappa */}
            <div className="bg-[#111] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 group shadow-[0_0_30px_rgba(245,158,11,0.05)] cursor-zoom-in" onClick={() => setSelectedImage(galleryImages[9])}>
              <div className="relative h-[400px] bg-black overflow-hidden">
                <img src={galleryImages[9]} alt="Protocol Kappa" className="w-full h-full object-cover animate-pulse opacity-90 group-hover:scale-105 transition-transform duration-700" style={{ animationDelay: '1.4s' }} />
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10">Protocol Kappa</div>
              </div>
              <div className="p-8 border-t border-white/5 relative">
                <h4 className="text-2xl text-white font-black uppercase tracking-widest mb-4">Ultra-Wide Command Center</h4>
                <p className="text-zinc-400 text-base leading-relaxed">Curved ultra-wide display setup in a low-key luxury environment. Perfectly frames advanced trading platforms, complex timeline editors, and control center UI.</p>
              </div>
            </div>
          </div>

        </section>

        {/* 🔥 SMANJENA CTA SEKCIJA PREMEŠTENA ODMAH ISPOD "THE ARSENAL" MOCKUPA 🔥 */}
        <section className="py-20 px-6 bg-[#050505] relative overflow-hidden text-center z-10 border-b border-white/5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-amber-500/10 rounded-[100%] blur-[80px] pointer-events-none"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight mb-4">
              Initiate The <span className="text-amber-500">Integration</span>
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mb-8 font-light leading-relaxed">
              Stop losing enterprise deals because your software looks generic. Let's mathematically engineer your visual authority.
            </p>
            
            <button onClick={() => navigate('/standard-mocup')} className="bg-amber-500 text-black font-black text-xs md:text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:bg-amber-400">
              Upgrade Your UI
            </button>
            
            <div className="mt-8 text-[10px] md:text-xs font-mono text-zinc-600 uppercase tracking-widest">
              System Architect: Goran Damnjanovic
            </div>
          </div>
        </section>

        {/* 🔥 JOS MANJI BILBORD: NEW OFFER WITH EXAMPLES 🔥 */}
        <section className="py-20 px-6 relative flex justify-center bg-[#050505]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="relative z-10 w-full max-w-5xl bg-gradient-to-b from-[#111] to-[#050505] border-2 border-amber-500/50 rounded-[2rem] p-6 md:p-12 text-center shadow-[0_0_60px_rgba(245,158,11,0.15)] group hover:border-amber-500 transition-all duration-700">
            <div className="inline-block bg-amber-500 text-black text-[10px] md:text-xs font-black uppercase tracking-widest px-5 py-2 rounded-full mb-6 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              Exclusive V10 Offer
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">
              Custom <span className="text-amber-500">Architecture</span>
            </h3>
            
            <p className="text-base md:text-lg text-zinc-400 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              Don't just use our base environments. Provide your exact Figma UI bilbords with your design and we will mathematically render them into 3 custom, examples in 150MP physical realities tailored strictly to your brand's unique identity.
            </p>

            {/* 🔥 PREBAČENO U VIP KARTICE (SA TEKSTOVIMA ISPOD SLIKA) 🔥 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
              {/* Kartica 1 */}
              <div className="bg-[#0a0a0a] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 cursor-zoom-in group shadow-[0_0_30px_rgba(245,158,11,0.05)]" onClick={() => setSelectedImage("/mocup_1_bilbord.webp")}>
                <div className="relative h-[250px] bg-black overflow-hidden">
                  <img src="/mocup_1_bilbord.webp" alt="Custom Example 1" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">Urban</div>
                </div>
                <div className="p-6 border-t border-white/5 relative">
                  <h4 className="text-lg text-white font-black uppercase tracking-widest mb-2">Street-Level Billboard</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">High-contrast urban environment engineered for outdoor SAAS campaigns and maximum brand visibility.</p>
                </div>
              </div>
              
              {/* Kartica 2 */}
              <div className="bg-[#0a0a0a] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 cursor-zoom-in group shadow-[0_0_30px_rgba(245,158,11,0.05)]" onClick={() => setSelectedImage("/mocup_2_bilbord.webp")}>
                <div className="relative h-[250px] bg-black overflow-hidden">
                  <img src="/mocup_2_bilbord.webp" alt="Custom Example 2" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">Premium</div>
                </div>
                <div className="p-6 border-t border-white/5 relative">
                  <h4 className="text-lg text-white font-black uppercase tracking-widest mb-2">Luxury Mall Display</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">Luxurious indoor advertising space with cinematic lighting. Perfect for elite enterprise presentations.</p>
                </div>
              </div>
              
              {/* Kartica 3 */}
              <div className="bg-[#0a0a0a] border-2 border-amber-500/20 rounded-2xl overflow-hidden hover:border-amber-500 transition-colors duration-500 cursor-zoom-in group shadow-[0_0_30px_rgba(245,158,11,0.05)]" onClick={() => setSelectedImage("/mocup_3_bilbord.webp")}>
                <div className="relative h-[250px] bg-black overflow-hidden">
                  <img src="/mocup_3_bilbord.webp" alt="Custom Example 3" className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-10">Gallery</div>
                </div>
                <div className="p-6 border-t border-white/5 relative">
                  <h4 className="text-lg text-white font-black uppercase tracking-widest mb-2">Gallery Architecture</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">Minimalist museum-grade presentation area. Transforms generic UI into high-end physical art exhibitions.</p>
                </div>
              </div>
            </div>

            {/* Price & PREMEŠTENI PRAVI LINKOVI (Kao CTA) */}
            <div className="flex flex-col items-center gap-8 border-t border-white/5 pt-10">
              {/* Sada piše / 5 BILBORD fiksno kako si tražio na slici */}
              <div className="text-4xl md:text-5xl font-black text-white">$1,500 <span className="text-base text-zinc-500 font-bold uppercase tracking-widest">/ 5 BILBORD</span></div>
              
              {/* 🔥 PRAVI LINKOVI PREMA TVOJEM ZAHTEVU (Vode na rutu i otvaraju tačan tab) 🔥 */}
              <div className="flex flex-wrap justify-center gap-4">
                  <Link 
                      to="/standard-mocup"
                      onClick={() => localStorage.setItem('v8_active_mocup_tab', 'ultra3')}
                      className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all border-2 border-amber-500 bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:scale-105 flex items-center justify-center"
                  >
                      BILBORD MOCUP
                  </Link>
                  <Link 
                      to="/standard-mocup"
                      onClick={() => localStorage.setItem('v8_active_mocup_tab', 'ultra4')}
                      className="px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all border-2 border-white/10 bg-black/50 text-zinc-400 hover:border-amber-500/50 hover:text-white hover:scale-105 flex items-center justify-center"
                  >
                      WALL MOCUP
                  </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}
// KRAJ FUNKCIJE: SaaSProtocolPage