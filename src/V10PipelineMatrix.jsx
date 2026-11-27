// ============================================================================
// FAJL: src/V10PipelineMatrix.jsx
// RUTA / NAMENA: Sekcija "The V10 Pipeline" na HomePage.jsx — uklopljena u #121822 (rgb 18, 24, 34) dark temu
// ============================================================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Maximize, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function V10PipelineMatrix() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const pipelineSteps = [
    {
      id: 0,
      title: 'Core Generation',
      subtitle: 'EXIF + ACEScg Optical Architecture',
      description:
        'Enforcing strict optical parameters for consistent identity, fixed proportions, and preserved natural micro-texture. Free of synthetic gloss, brand logos, or watermarks.',
      icon: <Cpu size={24} />,
      image: '/pipeline-core.webp',
      accent: 'text-orange-400',
      badgeBg: 'bg-orange-500/15',
      borderActive: 'border-orange-500/70 shadow-[0_0_35px_rgba(249,115,22,0.18)]',
      pillDot: 'bg-orange-400'
    },
    {
      id: 1,
      title: 'The Master Engine',
      subtitle: '150MP LANCZOS Upscaling',
      description:
        'Raw outputs are processed through custom NumPy matrices. We apply LANCZOS interpolation, UnsharpMask contrast enhancement, and embed sRGB ICC profiles for ultra-print readiness.',
      icon: <Maximize size={24} />,
      image: '/pipeline-upscale.webp',
      accent: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/15',
      borderActive: 'border-emerald-400/70 shadow-[0_0_35px_rgba(16,185,129,0.18)]',
      pillDot: 'bg-emerald-400'
    },
    {
      id: 2,
      title: 'Commercial Prep',
      subtitle: 'Perspective & Mesh Warps',
      description:
        'Final assets undergo rigorous perspective adjustments and layer masking to fit seamlessly into any OOH billboard, architectural wall, or UI mockup. 100% IP-safe and cleared for global campaigns.',
      icon: <ShieldCheck size={24} />,
      image: '/pipeline-prep.webp',
      accent: 'text-sky-400',
      badgeBg: 'bg-sky-500/15',
      borderActive: 'border-sky-400/70 shadow-[0_0_35px_rgba(56,189,248,0.18)]',
      pillDot: 'bg-sky-400'
    }
  ];

  return (
    <section className="w-full my-16 relative z-10">
      {/* Glavni kontejner u tačnoj #121822 boji sa narandžastim B2B okvirom */}
      <div className="max-w-7xl mx-auto rounded-[2.5rem] bg-[#121822] border border-orange-500/35 shadow-[0_25px_80px_rgba(0,0,0,0.75)] px-6 sm:px-10 md:px-12 py-14 md:py-16 relative overflow-hidden">
        {/* Diskretni ambijentalni odsjaj unutar #121822 boksa */}
        <div className="pointer-events-none absolute -top-28 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/4 w-96 h-96 rounded-full bg-emerald-500/8 blur-[120px]" />

        {/* Zaglavlje sekcije */}
        <div className="text-center mb-14 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0b0f17] border border-orange-500/40 text-orange-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            V10 PRODUCTION ARCHITECTURE
          </div>

          <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight mb-3">
            The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-600">
              V10 Pipeline
            </span>
          </h2>

          <p className="text-slate-300 font-bold uppercase tracking-[0.18em] text-xs md:text-sm">
            How we engineer billboard-quality 150MP commercial assets.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
          {/* LEVA STRANA: Interaktivna Lista Tabova */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-4">
              {pipelineSteps.map((step, index) => {
                const isActive = activeStep === index;
                return (
                  <motion.div
                    key={step.id}
                    onMouseEnter={() => setActiveStep(index)}
                    onClick={() => setActiveStep(index)}
                    layout
                    className={`relative cursor-pointer rounded-3xl p-6 md:p-7 transition-all duration-300 border ${
                      isActive
                        ? `bg-[#18202d] ${step.borderActive}`
                        : 'bg-[#0c1018]/90 border-slate-800/90 hover:bg-[#151c28] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-5">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-300 border ${
                            isActive
                              ? `${step.badgeBg} ${step.accent} border-white/15 shadow-inner`
                              : 'bg-[#121822] text-slate-400 border-slate-800'
                          }`}
                        >
                          {step.icon}
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono text-[11px] font-extrabold text-slate-400">
                              0{index + 1}
                            </span>
                            <h3
                              className={`text-lg md:text-xl font-black uppercase tracking-tight transition-colors duration-300 ${
                                isActive ? 'text-white' : 'text-slate-200'
                              }`}
                            >
                              {step.title}
                            </h3>
                          </div>

                          <p
                            className={`text-[11px] font-extrabold uppercase tracking-widest mt-1 transition-colors duration-300 ${
                              isActive ? step.accent : 'text-slate-400'
                            }`}
                          >
                            {step.subtitle}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${
                          isActive ? `${step.pillDot} scale-110` : 'bg-slate-700'
                        }`}
                      />
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.32, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          <p className="text-slate-200 text-sm leading-relaxed font-normal md:pl-[76px] pr-2 border-t border-white/10 pt-4">
                            {step.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <button
              onClick={() => navigate('/stock')}
              className="mt-6 self-start px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
            >
              Explore 150MP Master Vault <ArrowRight size={15} />
            </button>
          </div>

          {/* DESNA STRANA: Vizuelni prikaz koraka */}
          <div className="w-full lg:w-1/2 lg:sticky lg:top-28 h-[420px] md:h-[540px] rounded-[2.2rem] bg-[#0b0f17] border border-slate-700/70 shadow-[0_20px_55px_rgba(0,0,0,0.65)] overflow-hidden p-3">
            <div className="relative w-full h-full rounded-[1.7rem] overflow-hidden bg-[#121822] border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={pipelineSteps[activeStep].image}
                  alt={pipelineSteps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.97, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Tamni donji preliv za čitljivost status bedža */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17]/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center gap-3">
                <div className="bg-[#121822]/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg border border-orange-500/40 flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${pipelineSteps[activeStep].pillDot} animate-ping`}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white">
                    Step 0{activeStep + 1} // {pipelineSteps[activeStep].title}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-full bg-[#121822]/90 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                  >
                    <Cpu size={19} className="text-orange-400" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}