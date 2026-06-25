// POČETAK FAJLA: V8ContactWidget.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Mail, X, Zap } from 'lucide-react'; 

const V8ContactWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 🔥 KLJUČNA PROMENA: bottom-4 left-4 za mobilni, bottom-6 left-6 za desktop 🔥
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[9999] flex flex-col items-start font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, originX: 0, originY: 1 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            // Smanjeni padingzi i širina na telefonu
            className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-orange-500/30 p-4 md:p-6 rounded-3xl shadow-[0_0_40px_rgba(234,88,12,0.2)] mb-3 md:mb-4 w-[250px] sm:w-[280px] md:w-80 flex flex-col gap-3 md:gap-4"
          >
            <div className="flex justify-between items-center border-b border-orange-500/20 pb-2 md:pb-3">
              <span className="text-white font-black uppercase tracking-widest text-[10px] md:text-[12px] flex items-center gap-2">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-500" /> V8 DIRECT CONTACT
              </span>
              <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors bg-white/5 p-1 rounded-full">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* EMAIL DUGME */}
            <a 
              href="mailto:aitoolsprosmart@gmail.com?subject=V8 Premium Inquiry" 
              className="bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600 text-white p-3 md:p-4 rounded-xl flex items-center gap-3 md:gap-4 transition-all group"
            >
              <div className="bg-blue-600 p-2 md:p-3 rounded-lg group-hover:bg-white transition-colors shadow-lg">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-blue-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] md:text-[13px] font-black uppercase tracking-widest">Email Support</span>
                <span className="text-[9px] md:text-[10px] text-zinc-400 group-hover:text-white/90 truncate max-w-[130px] md:max-w-[160px]">aitoolsprosmart@gmail.com</span>
              </div>
            </a>

            {/* VIP PREPORUKA ZA EMAIL */}
            <div className="mt-1 md:mt-2 border-t border-orange-500/20 pt-3 md:pt-4 text-center bg-orange-500/5 rounded-xl p-3 md:p-4 border border-dashed border-orange-500/30">
              <span className="block text-[9px] md:text-[10px] text-zinc-400 font-bold uppercase tracking-widest mb-1">
                For the fastest response
              </span>
              <span className="block text-[12px] md:text-[14px] font-black text-orange-500 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]">
                Send an Email
              </span>
              <span className="block text-[9px] md:text-[11px] text-white mt-2 font-mono bg-black/50 py-1.5 rounded-lg border border-white/5 truncate px-2">
                aitoolsprosmart@gmail.com
              </span>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* GLAVNO PLIVAJUĆE DUGME - Smanjeno na telefonu (p-3 i w-6 umesto w-8) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-orange-600 to-red-600 p-3 md:p-4 rounded-full text-white shadow-[0_0_25px_rgba(234,88,12,0.6)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center group"
      >
        {isOpen ? <X className="w-6 h-6 md:w-8 md:h-8" /> : <MessageCircle className="w-6 h-6 md:w-8 md:h-8 group-hover:animate-pulse" />}
      </button>
    </div>
  );
};

export default V8ContactWidget;
// KRAJ FAJLA: V8ContactWidget.jsx