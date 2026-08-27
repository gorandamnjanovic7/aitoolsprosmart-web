// --- POCETAK FUNKCIJE: UiUxHub ---
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FlaskConical, Briefcase, ChevronRight } from 'lucide-react';

const UiUxHub = () => {
  return (
    <div className="min-h-screen bg-[#020202] pt-24 pb-12 px-4 sm:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* V10 Background Fog */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-[0.2em] mb-4">
          UI/UX <span className="text-orange-500">Engineering</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base font-bold uppercase tracking-widest">
          Select Database Sector
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:gap-10 w-full max-w-5xl relative z-10">
        
        {/* VAULT CARD */}
        <Link to="/ui-ux/vault" className="flex-1 group">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-[#0a0a0a] border-2 border-zinc-800 hover:border-orange-500 rounded-3xl p-8 md:p-12 transition-colors duration-300 shadow-[0_0_0_rgba(249,115,22,0)] group-hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
              <FlaskConical className="w-8 h-8 text-orange-500" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">V10 Vault</h2>
            <p className="text-zinc-500 text-sm mb-8">R&D Laboratory. Visual experiments, prompt engineering, and raw demonstration of the V10 engine's power.</p>
            <div className="mt-auto flex items-center gap-2 text-orange-500 font-bold uppercase tracking-widest text-xs">
              Access Vault <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

        {/* COMMERCIAL CARD */}
        <Link to="/ui-ux/commercial" className="flex-1 group">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-[#0a0a0a] border-2 border-zinc-800 hover:border-blue-500 rounded-3xl p-8 md:p-12 transition-colors duration-300 shadow-[0_0_0_rgba(59,130,246,0)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-3">Commercial Ops</h2>
            <p className="text-zinc-500 text-sm mb-8">B2B Client Projects. Security checkouts, UI/UX billing systems, and high-end commercial integrations.</p>
            <div className="mt-auto flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-xs">
              Access Operations <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        </Link>

      </div>
    </div>
  );
};
export default UiUxHub;
// --- KRAJ FUNKCIJE: UiUxHub ---