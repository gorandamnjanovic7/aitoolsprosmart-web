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
    video: "/videos/v10-ai-agents.webm",
    badge: "24/7 AUTONOMOUS AGENCY",
    title: "AI WORKFORCE ECOSYSTEM",
    subtitle: "Deploy an elite executive core that never sleeps. Automate visual asset routing, B2B deal scoping, and technical infrastructure 24/7.",
    duration: 30000,
  },
  {
    video: "/videos/ai_agenti_2.webm",
    badge: "25 SPECIALIZED AI AGENTS",
    title: "OMNICHANNEL AI AUTOMATION",
    subtitle: "Synchronize e-commerce sales, WhatsApp & social DMs, legal contracts, brand inspection, and CRM billing in milliseconds. Ready for turnkey embedding or cloud deployment.",
    duration: 30000,
  },
  {
    video: "/videos/v10-glass-plaque.webm",
    badge: "V10 KINETIC PROTOCOL",
    title: "PREMIUM GLASS PLAQUE MOCKUPS",
    subtitle: "Experience flawless 3D UI motion tracking and absolute material realism. Engineered exclusively for elite corporate branding and architectural presentations.",
    duration: 30000,
  },
  {
    video: "/videos/coffe.webm",
    badge: "3D BEVERAGE & PRODUCT CINEMATOGRAPHY",
    title: "OBSIDIAN BREW — LUXURY PACKAGING",
    subtitle: "Hyper-realistic liquid splash dynamics, crystal ice refraction, and dark marble studio aesthetics engineered for high-converting commercial beverage campaigns.",
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
// ============================================================================
// KRAJ: BANNER_DATA NIZ
// ============================================================================

const HeroBanner = ({ setIsBannerHovered }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Zvuk je podrazumevano ISKLJUČEN (true) da pretraživač nikad ne blokira trenutni autoplay na početnoj strani
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef([]);

  const nextSlide = useCallback(() => {
    setActiveSlide((s) => (s + 1) % (BANNER_DATA?.length || 1));
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((s) => (s - 1 + (BANNER_DATA?.length || 1)) % (BANNER_DATA?.length || 1));
  }, []);

  // Pouzdana sinhronizacija mute stanja na svim <video> elementima (React poznati bug sa muted atributom)
  useEffect(() => {
    videoRefs.current.forEach((vid) => {
      if (vid) {
        vid.defaultMuted = isMuted;
        vid.muted = isMuted;
      }
    });
  }, [isMuted]);

  // Trenutno pokretanje aktivnog slajda (prvi video kreće u milisekundi otvaranja stranice)
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;

      vid.defaultMuted = isMuted;
      vid.muted = isMuted;

      if (idx === activeSlide) {
        try {
          vid.currentTime = 0;
        } catch {
          // Ako metadata jos nije spremna, kreće od 0 svakako
        }

        const attemptPlay = () => {
          const playPromise = vid.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // Sigurnosni fallback: forsiraj mute i pusti odmah
              vid.defaultMuted = true;
              vid.muted = true;
              vid.play().catch(() => {});
            });
          }
        };

        if (vid.readyState >= 2) {
          attemptPlay();
        } else {
          vid.load();
          attemptPlay();
        }
      } else {
        vid.pause();
      }
    });
  }, [activeSlide]);

  // Sigurnosni tajmer ako video traje duže ili se onEnded ne okine
  useEffect(() => {
    const slideDuration = BANNER_DATA?.[activeSlide]?.duration || 30000;
    const timer = setTimeout(() => {
      nextSlide();
    }, slideDuration);

    return () => clearTimeout(timer);
  }, [activeSlide, nextSlide]);

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      const currentVid = videoRefs.current[activeSlide];
      if (currentVid) {
        currentVid.defaultMuted = next;
        currentVid.muted = next;
        if (currentVid.paused) {
          currentVid.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (setIsBannerHovered) setIsBannerHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (setIsBannerHovered) setIsBannerHovered(false);
  };

  return (
    <div
      id="home-banner"
      data-hovered={isHovered ? "true" : "false"}
      className="relative w-full h-[70vh] md:h-[88vh] lg:h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white border-b border-orange-500/40 shadow-[0_20px_50px_rgba(234,88,12,0.15)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Video Pozadina */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center">
        {(BANNER_DATA || []).map((item, idx) => {
          const isCurrent = idx === activeSlide;
          const isNext = idx === (activeSlide + 1) % BANNER_DATA.length;

          return (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                isCurrent ? 'opacity-100 z-[2]' : 'opacity-0 z-[1] pointer-events-none'
              } flex items-center justify-center`}
            >
              {item.video && (
                <video
                  ref={(el) => {
                    videoRefs.current[idx] = el;
                    if (el) {
                      el.defaultMuted = isMuted;
                      el.muted = isMuted;
                    }
                  }}
                  src={item.video}
                  autoPlay={isCurrent}
                  playsInline
                  muted={isMuted}
                  preload={isCurrent || isNext ? "auto" : "metadata"}
                  onCanPlay={(e) => {
                    if (isCurrent && e.currentTarget.paused) {
                      e.currentTarget.muted = isMuted;
                      e.currentTarget.play().catch(() => {});
                    }
                  }}
                  onEnded={() => {
                    if (isCurrent) nextSlide();
                  }}
                  className="w-full h-full object-contain object-center"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Gradijent na dnu za tekst */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />

      {/* Matrix kiša sa slabim opacitetom */}
      <div className="absolute inset-0 z-20 w-full h-full pointer-events-none opacity-10">
        <MatrixRain />
      </div>

      {/* Dugme za zvuk (Mute / Unmute) — korisnik može ručno da uključi zvuk ako želi */}
      <button
        type="button"
        onClick={handleToggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute top-6 right-6 z-50 bg-black/60 hover:bg-orange-500 text-white p-3 rounded-full transition-all border border-white/20 backdrop-blur-md cursor-pointer"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-orange-400" />}
      </button>

      {/* Navigacione strelice */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-orange-500 transition-all p-3 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 text-white/80 hover:text-orange-500 transition-all p-3 bg-black/40 rounded-full backdrop-blur-sm cursor-pointer"
      >
        <ChevronRight className="w-6 h-6 md:w-8 md:h-8" strokeWidth={3} />
      </button>

      {/* Indikatori (tačkice) dole */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
        {(BANNER_DATA || []).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[3px] transition-all duration-500 rounded-full cursor-pointer ${
              i === activeSlide
                ? 'w-8 bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                : 'w-2 bg-white/30 hover:bg-white/60'
            }`}
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
