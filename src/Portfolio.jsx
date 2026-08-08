// START OF FILE: Portfolio.jsx
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Briefcase, Linkedin, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Portfolio() {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen font-sans text-white relative pt-28 pb-24 px-6 overflow-hidden bg-black">
      <Helmet>
        <title>Corporate Portfolio & Documents | V8 Smart</title>
      </Helmet>

      {/* 🔥 GLOBALNA VERTIKALNA VIDEO POZADINA (SADA U BOJI) 🔥 */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden bg-black">
        {/* UKLONJEN 'grayscale' */}
        <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
          <source src="/vertical_por_1.mp4" type="video/mp4" />
        </video>
        {/* Čista, neutralna transparentna crna maska */}
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none"></div>
      </div>
      
      <div className="max-w-[1200px] mx-auto w-full relative z-10">
        
        {/* Top Bar with Back Button */}
        <div className="w-full flex justify-between items-center mb-6 px-4">
          <motion.button 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate(-1)} 
            className="flex items-center gap-3 bg-black/40 backdrop-blur-md hover:bg-orange-500 text-zinc-400 hover:text-black border border-white/10 hover:border-orange-500 px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] font-black uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft size={16} strokeWidth={3} /> Return to Engine
          </motion.button>
        </div>

        {/* MASSIVE HEADER BANNER BOX WITH HORIZONTAL VIDEO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full relative overflow-hidden border border-white/10 rounded-[3rem] py-24 px-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-12 flex flex-col items-center justify-center text-center group"
        >
          {/* 🔥 VIDEO BACKGROUND ZA HEADER BOX (TAKOĐE U BOJI) 🔥 */}
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-80">
             <source src="/horizontal_por_2.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none backdrop-blur-[2px]"></div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-orange-500/40 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-orange-400 mb-6 uppercase shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <ShieldCheck className="w-4 h-4" /> V8 Verified Documentation
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] text-white">
              ENTERPRISE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500">PORTFOLIO</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-zinc-300 text-[11px] md:text-xs font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
              ACCESS OUR MASTER COMMERCIAL DOCUMENTS, TECHNICAL SPECS, AND B2B INTEGRATION MATERIALS.
            </p>
          </div>
        </motion.div>

        {/* MY EXPERIENCE SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full relative overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] py-16 px-8 md:px-16 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group flex flex-col items-center text-center"
        >
            <div className="relative z-10 w-full max-w-4xl flex flex-col items-center">
                {/* Icon */}
                <div className="bg-black/50 p-5 rounded-[1.5rem] border border-orange-500/30 mb-8 shadow-lg hover:scale-110 transition-transform duration-500">
                    <Briefcase className="text-orange-500 w-10 h-10 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-10 drop-shadow-xl text-white">
                    MY <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">EXPERIENCE</span>
                </h2>

                {/* Text Area */}
                <div className="w-full bg-black/60 border border-white/5 rounded-3xl p-8 md:p-12 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] hover:border-orange-500/20 transition-colors duration-500 text-left flex flex-col gap-6 relative backdrop-blur-sm">
                    
                    {/* Content */}
                    <div className="text-zinc-300 font-light text-[15px] leading-[1.8] italic space-y-5">
                      <p className="text-white font-medium text-lg">
                        The biggest lie in AI design is that standard tools are ready for premium commercial production.
                      </p>
                      
                      <p>
                        Everyone is hyping AI image generation. But when a high-end client demands that their product (a luxury perfume, a premium beverage, or an automotive asset) remains 100% untouched—no altered geometry, no hallucinated labels, and no plastic textures—that is where most designers and standard "prompt engineers" hit a brick wall.
                      </p>
                      
                      <p>
                        The result? Clients are handed cheap collages, visible stitch lines, and products that only vaguely resemble the original. Premium brands do not buy that.
                      </p>
                      
                      <p className="text-orange-400 font-medium">
                        That is exactly why I stopped relying on standard AI tools and engineered my own closed-loop software architecture for commercial production.
                      </p>
                      
                      <p>
                        The standard of my system guarantees one uncompromising metric: <strong className="text-white">0% variation on the original product.</strong>
                      </p>
                      
                      <p>
                        My architecture can take 5 or more completely different, raw product references and mathematically fuse them into a single, organic, photorealistic 8K composite. Unified lighting, flawless reflections, zero intersecting lines. The client's product remains surgically precise, while the environment around it is pure luxury magic.
                      </p>
                      
                      <p>
                        To push this beyond standard rendering, we mathematically simulated the sensor physics and software of the world’s top-tier cameras—Hasselblad H6D-100c, Phase One XF IQ4, ARRI Alexa 65, Leica S3, and RED V-Raptor—fusing them with their exact native lenses. This ensures our visual engine operates on real-world optical physics, calculating the precise focal depth and lens distortion for any given commercial shot.
                      </p>
                      
                      <p>
                        We engineered the output architecture to deliver final assets natively in 33.2MP, 45MP, 60MP, and an extreme ultra-high print resolution of 150MP.
                      </p>
                      
                      <p>
                        Achieving this requires a brutal technical pipeline. Under the hood, the engine executes direct premium LANCZOS interpolation and clean sRGB conversion with embedded ICC profiles. It applies texture-safe MedianFilter cleanup to reduce compression dirt without destroying detail, alongside gentle UnsharpMask micro-contrast sharpening calibrated specifically for 150MP output. We programmed controlled color, contrast, and brightness tuning for commercial impact, smooth compression of extreme highlights to protect reflective surfaces (like metal and glass), and controlled dark-value treatment for richer blacks with tactile shadow detail.
                      </p>
                      
                      <p>
                        To ensure absolute photorealism, the system integrates organic micro-grain to break artificial smoothness, extra anti-halo protection around high-contrast edges, fine dithering to prevent banding in dark gradients, and a texture-preserving finish for complex materials like leather, liquid, and jewelry. Every final asset passes through a strict quality gate: restrained commercial ad polish, complete IP-safe metadata cleanup (zero EXIF traces), and strict validation of 150MP structural integrity.
                      </p>
                      
                      <p>
                        This architecture completely eliminates the need for $50,000 camera rentals, grueling multi-day studio shoots, or waiting for perfect weather conditions. You get absolute, uncompromised perfection—delivered at a far better price, in a fraction of the time.
                      </p>
                      
                      <p className="text-white font-medium">
                        But a brutal design is worth nothing without a stable engine under the hood.
                      </p>
                      
                      <p>
                        I don’t just generate visuals—I package them directly into custom React/Vite architecture, integrated with a top-tier Security Checkout infrastructure.
                      </p>
                      
                      <p>
                        No bugs, no crashes, strictly built for premium conversions.
                      </p>
                      
                      <p>
                        I don't sell courses. I don't share my source code. I am the architect who builds the solutions standard tools cannot provide. I exclusively deliver the final, flawless system.
                      </p>
                      
                      <p>
                        If you are an Art Director, a Senior UI/UX Designer, or an agency tired of compromising with AI hallucinations, and you need an engineer who can carry your project from 150MP visuals to rock-solid code—my DMs are open for serious projects.
                      </p>
                      
                      <p className="text-orange-500 font-bold text-lg not-italic mt-4">
                        Let's build premium stuff. 🏴🟧
                      </p>
                    </div>

                    {/* Socials & Hashtags */}
                    <div className="mt-6 pt-8 border-t border-white/10 flex flex-col gap-6 relative z-10">
                      
                      <div className="flex flex-col sm:flex-row gap-6">
                        <a 
                          href="https://www.linkedin.com/in/goran-damnjanovic/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 text-zinc-300 hover:text-[#0A66C2] transition-colors w-max group"
                        >
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#0A66C2]/50 group-hover:bg-[#0A66C2]/10 transition-colors">
                            <Linkedin size={20} />
                          </div>
                          <span className="font-bold text-xs tracking-[0.2em] uppercase">LinkedIn Profile</span>
                        </a>

                        <a 
                          href="https://www.behance.net/gorandamnjanovic" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-3 text-zinc-300 hover:text-[#1769ff] transition-colors w-max group"
                        >
                          <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-[#1769ff]/50 group-hover:bg-[#1769ff]/10 transition-colors">
                            <Palette size={20} />
                          </div>
                          <span className="font-bold text-xs tracking-[0.2em] uppercase">Behance Portfolio</span>
                        </a>
                      </div>

                      <p className="text-zinc-600 text-[10px] md:text-xs font-mono tracking-widest leading-relaxed uppercase">
                        #AIArchitecture #ReactJS #WebDevelopment #PremiumDesign #V8Standard #CreativeEngineering #SoftwareArchitecture #CommercialPhotograph
                      </p>
                    </div>

                </div>
            </div>
        </motion.div>

      </div>
    </div>
  );
}
// END OF FILE: Portfolio.jsx