import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Maximize, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function V10PipelineMatrix() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  // Integrisani tvoji stvarni V10 parametri i procesi
  const pipelineSteps = [
    {
      id: 0,
      title: "Core Generation",
      subtitle: "Nano Banana 2 Architecture",
      description: "Enforcing strict parameters for consistent facial identity, fixed proportions, and preserved natural asymmetry. The foundation of every V10 commercial asset.",
      icon: <Cpu size={24} />,
      image: "/pipeline-core.webp", // Tvoj prvi render
      accent: "text-orange-500",
      bgAccent: "bg-orange-50",
      borderAccent: "border-orange-200"
    },
    {
      id: 1,
      title: "The Master Engine",
      subtitle: "150MP LANCZOS Upscaling",
      description: "Raw outputs are processed through custom NumPy matrices. We apply LANCZOS interpolation, UnsharpMask contrast enhancement, and embed sRGB ICC profiles for ultra-print readiness.",
      icon: <Maximize size={24} />,
      image: "/pipeline-upscale.webp", // Tvoj drugi render
      accent: "text-emerald-500",
      bgAccent: "bg-emerald-50",
      borderAccent: "border-emerald-200"
    },
    {
      id: 2,
      title: "Commercial Prep",
      subtitle: "Perspective & Mesh Warps",
      description: "Final assets undergo rigorous perspective adjustments and layer masking to fit seamlessly into any UI or hardware mockup. 100% IP-safe and legally cleared for global campaigns.",
      icon: <ShieldCheck size={24} />,
      image: "/pipeline-prep.webp", // Tvoj treći render
      accent: "text-blue-500",
      bgAccent: "bg-blue-50",
      borderAccent: "border-blue-200"
    }
  ];

  return (
    <div className="w-full my-32 relative z-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 tracking-tighter drop-shadow-sm mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">V10 Pipeline</span>
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs md:text-sm">
            How we engineer billboard-quality commercial assets.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEVA STRANA: Interaktivna Lista */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            {pipelineSteps.map((step, index) => {
              const isActive = activeStep === index;
              return (
                <motion.div
                  key={step.id}
                  onMouseEnter={() => setActiveStep(index)}
                  layout
                  className={`relative cursor-pointer rounded-3xl p-6 md:p-8 transition-all duration-500 border ${
                    isActive 
                      ? `bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] ${step.borderAccent}` 
                      : 'bg-white/40 border-slate-200/50 hover:bg-white/70 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                      isActive ? `${step.bgAccent} ${step.accent} shadow-sm border ${step.borderAccent}` : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-black uppercase tracking-tight transition-colors duration-500 ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${isActive ? step.accent : 'text-slate-400'}`}>
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-600 text-sm leading-relaxed font-medium pl-20 pr-4">
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
            
            <button 
              onClick={() => navigate('/stock')}
              className="mt-4 self-start md:ml-20 px-8 py-4 bg-slate-900 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-[11px] rounded-xl shadow-lg transition-colors duration-300 flex items-center gap-2"
            >
              Access Master Files <ArrowRight size={14} />
            </button>
          </div>

          {/* DESNA STRANA: Sticky Visualizer */}
          <div className="w-full lg:w-1/2 sticky top-32 h-[450px] md:h-[600px] rounded-[2.5rem] bg-white/50 backdrop-blur-2xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden p-3">
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200/50">
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={pipelineSteps[activeStep].image}
                  alt={pipelineSteps[activeStep].title}
                  initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Stakleni preliv preko slike za premium izgled */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none"></div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/20">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Step 0{activeStep + 1} // Active
                  </span>
                </div>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Cpu size={20} className="text-white" />
                  </motion.div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}