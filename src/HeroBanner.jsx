// ============================================================================
// POČETAK FAJLA: HeroBanner.jsx
// ============================================================================
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { MatrixRain } from './data';

// ============================================================================
// POČETAK: BANNER_DATA NIZ
// ============================================================================
export const BANNER_DATA = [
  { 
    video: "/videos/v10-glass-plaque.webm", 
    badge: "V10 KINETIC PROTOCOL", 
    title: "PREMIUM GLASS PLAQUE MOCKUPS", 
    subtitle: "Experience flawless 3D UI motion tracking and absolute material realism. Engineered exclusively for elite corporate branding and architectural presentations.",
    duration: 30000, 
  },
  { 
    video: "/videos/v10-food-ui.webm", 
    badge: "MICHELIN STAR DIGITAL ASSETS", 
    title: "GOURMET UI/UX INTEGRATION", 
    subtitle: "Micro-macro cinematography meets holographic UI design. Flawless digital menu integrations for luxury high-end Food & Beverage commercial assets.",
    duration: 30000, 
  },
  { 
    video: "/videos/v10-billboard-ui.webm", 
    badge: "GLOBAL CAMPAIGN ARCHITECTURE", 
    title: "NEXT-GEN DIGITAL BILLBOARDS", 
    subtitle: "Uncompromising outdoor and indoor display aesthetics. Fluid dynamic rendering with realistic environmental reflections for luxury brand positioning.",
    duration: 30000,
  }
];

const HeroBanner = ({ setIsBannerHovered }) => {
  const [activeSlide, setActiveSlide] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // START MUTED TO ALLOW AUTOPLAY
  const videoRefs = useRef([]);
  const timeoutRef = useRef(null);

  const nextSlide = useCallback(() => {
    setActiveSlide(s => (s + 1) % (BANNER_DATA?.length || 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide(s => (s - 1 + (BANNER_DATA?.length || 1)) % (BANNER_DATA?.length || 1));
  }, []);

  // Handle Autoplay timer
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    if (!isHovered) {
      const currentDuration = BANNER_DATA[activeSlide]?.duration || 30000;
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, currentDuration);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeSlide, isHovered, nextSlide]);

  // Sinhronizacija videa
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (vid) {
        if (idx === activeSlide) {
          vid.currentTime = 0;
          const playPromise = vid.play();
          if (playPromise !== undefined) {
             playPromise.catch(error => {
                console.log("Autoplay is waiting for user interaction.", error);
                setIsMuted(true); // Force mute if browser blocks unmuted autoplay
             });
          }
        } else {
          vid.pause();
        }
      }
    });
  }, [activeSlide, isMuted]);

  const handleMouseEnter = () => { 
    setIsHovered(true); 
    if(setIsBannerHovered) setIsBannerHovered(true); 
  };
  
  const handleMouseLeave = () => { 
    setIsHovered(false); 
    if(setIsBannerHovered) setIsBannerHovered(false); 
  };

  return (
    <div 
      id="home-banner" 
      className="relative w-full h-[70vh] md:h-[88vh] lg:h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white border-b border-orange-500/40 shadow-[0_20px_50px_rgba(234,88,12,0.15)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Pozadina */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        {(BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'} z-0 flex items-center justify-center`}>
            {item.video && (
              <video 
                ref={el => videoRefs.current[idx] = el}
                src={item.video} 
                autoPlay 
                playsInline
                muted={isMuted}
                onEnded={nextSlide}
                className="w-full h-full object-contain object-center"
              />
            )}
          </div>
        ))}
      </div>

      {/* Gradijent na dnu za tekst */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
      
      {/* Matrix kiša sa slabim opacitetom */}
      <div className="absolute inset-0 z-20 w-full h-full pointer-events-none opacity-10"><MatrixRain /></div>
      
      {/* Dugme za zvuk (Mute / Unmute) */}
      <button 
        type="button" 
        onClick={() => setIsMuted(!isMuted)} 
        className="absolute top-6 right-6 z-50 bg-black/60 hover:bg-orange-500 text-white p-3 rounded-full transition-all border border-white/20 backdrop-blur-md"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-orange-400" />}
      </button>

      {/* Navigacione strelice */}
      <button type="button" onClick={prevSlide} className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-orange-500 transition-all p-3 bg-black/40 rounded-full backdrop-blur-sm">
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </button>
      <button type="button" onClick={nextSlide} className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-white transition-all p-3 bg-black/40 rounded-full backdrop-blur-sm">
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </button>
      
      {/* Indikatori (tačkice) dole */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {(BANNER_DATA || []).map((_, i) => (
          <button 
            key={i} 
            type="button" 
            onClick={() => setActiveSlide(i)} 
            className={`h-[3px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'}`} 
          />
        ))}
      </div>
      
      {/* Glavni tekst i badge */}
      <div className="relative z-40 max-w-7xl mx-auto px-6 w-full text-left mt-auto pb-16 md:pb-24">
        <div className="inline-block px-3.5 py-1.5 rounded-full bg-orange-600/90 text-[7px] md:text-[9px] font-black uppercase mb-3 tracking-widest shadow-lg">
          {BANNER_DATA?.[activeSlide]?.badge}
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase mb-2 tracking-tighter drop-shadow-2xl">
          {BANNER_DATA?.[activeSlide]?.title}
        </h1>
        <p className="text-zinc-300 text-xs md:text-sm max-w-2xl font-medium opacity-95 leading-relaxed">
          {BANNER_DATA?.[activeSlide]?.subtitle}
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
// ============================================================================
// KRAJ FAJLA: HeroBanner.jsx
// ============================================================================