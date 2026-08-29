// POČETAK FAJLA: QRMenuPromo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ScanLine, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import phoneImg from './QRMenuPromo_tel.webp';
import qrCardImg from './QRMenuPromo_QR.webp';

export default function QRMenuPromo() {
  return (
    <div className="w-full relative rounded-[2.5rem] bg-white/70 backdrop-blur-xl border border-slate-200/80 overflow-hidden mb-16 shadow-[0_15px_60px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 group">
      
      <div className="absolute inset-0 bg-white/40 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">
        
        <div className="p-8 sm:p-12 lg:p-16 relative z-10">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full text-orange-600 mb-6 shadow-sm">
            <ScanLine size={16} />
            <span className="font-black text-[10px] uppercase tracking-widest">B2B SaaS Module</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black uppercase text-slate-900 mb-4 tracking-tighter leading-tight drop-shadow-sm">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-700">Hospitality</span>
          </h2>
          
          <p className="text-slate-600 text-sm md:text-[15px] leading-relaxed mb-8 max-w-md font-medium tracking-wide">
            Generate a premium digital menu for cafes and restaurants. Enter your items, choose a theme, and instantly download a scannable QR code. 100% app-free.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link 
              to="/premium-menu" 
              onClick={() => window.scrollTo(0,0)}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black uppercase tracking-widest text-[11px] rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:scale-105"
            >
              Launch Generator <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="relative h-96 lg:h-full min-h-[450px] flex items-center justify-center overflow-visible bg-slate-50/50 border-t lg:border-t-0 lg:border-l border-slate-200/50 pb-12 pt-8 lg:py-0 perspective-1000">
          
          <div className="relative w-full max-w-[500px] flex justify-center items-center h-full transform group-hover:scale-105 transition-transform duration-700 ease-out">
            
            <motion.img 
              src={phoneImg} 
              alt="Premium QR Menu Phone"
              className="w-56 sm:w-64 md:w-72 lg:w-80 object-contain relative z-10 drop-shadow-[0_30px_40px_rgba(0,0,0,0.2)]"
              animate={{ 
                y: [0, -15, 0],
                rotateZ: [0, 2, 0]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* 🔥 Izmenjene Tailwind klase za pozicioniranje na sredinu telefona 🔥 */}
            <motion.img
              src={qrCardImg} 
              alt="QR Code Premium Card"
              className="absolute top-[40%] -translate-y-1/2 right-0 sm:right-0 md:right-8 lg:-right-4 z-20 w-36 sm:w-44 md:w-48 object-contain drop-shadow-[0_20px_30px_rgba(249,115,22,0.3)]"
              animate={{ 
                y: [0, 10, 0],
                rotateZ: [0, -3, 0]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-orange-400/20 blur-[60px] rounded-full z-0 pointer-events-none"></div>

          </div>
        </div>
      </div>
    </div>
  );
}
// KRAJ FAJLA: QRMenuPromo.jsx