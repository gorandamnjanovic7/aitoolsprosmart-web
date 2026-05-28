import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MatrixRain, BANNER_DATA } from './data';

const HeroBanner = ({ setIsBannerHovered }) => {
  const [activeSlide, setActiveSlide] = useState(0); 
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setActiveSlide(s => (s + 1) % (BANNER_DATA?.length || 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide(s => (s - 1 + (BANNER_DATA?.length || 1)) % (BANNER_DATA?.length || 1));
  }, []);
  
  // Glavna kontrola tajmera - sada je bulletproof
  useEffect(() => { 
    // Uvek prvo ubijamo stari tajmer da nema dupliranja
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Ako miš NIJE na baneru, tek onda vrti slike
    if (!isHovered) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 7000); 
    }

    // Cleanup kad se komponenta osveži
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovered, nextSlide]);

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
      className="relative w-full h-[85vh] flex items-end overflow-hidden bg-black text-white border-b-2 border-orange-500/60 shadow-[0_20px_50px_rgba(234,88,12,0.15)]"
      // Koristimo i Mouse i Pointer evente da garantovano uhvati hover
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onPointerEnter={handleMouseEnter}
      onPointerLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 z-0 bg-black">
        {(BANNER_DATA || []).map((item, idx) => (
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx === activeSlide ? 'opacity-100' : 'opacity-0'} z-0`}>
            <img src={item.image} loading={idx === 0 ? "eager" : "lazy"} className="w-full h-full object-cover opacity-80" alt="banner" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050505] to-transparent z-10" />
      <div className="absolute inset-0 z-20 w-full h-full pointer-events-none opacity-40"><MatrixRain /></div>
      <button type="button" onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronLeft className="w-8 h-8" strokeWidth={3} /></button>
      <button type="button" onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-40 text-white hover:text-orange-500 transition-all"><ChevronRight className="w-8 h-8" strokeWidth={3} /></button>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-40">
        {(BANNER_DATA || []).map((_, i) => (
          <button key={i} type="button" onClick={() => setActiveSlide(i)} className={`h-[1px] transition-all duration-500 rounded-full ${i === activeSlide ? 'w-6 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`} />
        ))}
      </div>
      <div className="relative z-40 max-w-7xl mx-auto px-6 pb-20 w-full text-left">
        <div className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-[6px] font-black uppercase mb-4 tracking-widest shadow-lg">{BANNER_DATA?.[activeSlide]?.badge}</div>
        <h1 className="text-xl md:text-4xl font-black uppercase mb-1.5 tracking-tighter drop-shadow-2xl">{BANNER_DATA?.[activeSlide]?.title}</h1>
        <p className="text-zinc-300 text-[12px] md:text-sm max-w-lg font-medium opacity-90">{BANNER_DATA?.[activeSlide]?.subtitle}</p>
      </div>
    </div>
  );
};

export default HeroBanner;