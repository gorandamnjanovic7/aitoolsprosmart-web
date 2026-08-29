// POČETAK FAJLA: HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 BLOCKS
import HeroBanner from './HeroBanner';
import B2BProtocols from './B2BProtocols';
import VerticalCardsBox from './VerticalCardsBox'; 
import QRMenuPromo from './QRMenuPromo'; 
import V10PipelineMatrix from './V10PipelineMatrix'; // 🔥 UBAČEN NOVI MATRIKS
import IntelProtocols from './IntelProtocols';
import SaasPromo from './SaasPromo'; 
import UnlockTheBeast from './UnlockTheBeast'; 
import EnhancerPromo from './EnhancerPromo';
import StockBundles from './StockBundles';
import Marketplace from './Marketplace';

export default function HomePage({ apps = [] }) {
  // POČETAK FUNKCIJE: HomePage
  const location = useLocation();

  useEffect(() => { 
    // POČETAK FUNKCIJE: useEffect callback
    if (location.hash === '#marketplace') { 
      const el = document.getElementById('marketplace'); 
      if (el) el.scrollIntoView({ behavior: 'smooth' }); 
    } 
    // KRAJ FUNKCIJE: useEffect callback
  }, [location]);

  return (
    // Premium Studio Light krovna pozadina
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 text-slate-800">
      <Helmet><title>AI TOOLS PRO SMART | GLOBAL</title></Helmet>
      
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-6 py-12 text-left relative">
        
        {/* Ambijentalni V8 odsjaj */}
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 mb-24"> 
          <B2BProtocols />
        </div>
        
        <div className="relative z-10 mb-24">
          <VerticalCardsBox />
        </div>
        
        <div className="relative z-10 mb-24">
          <QRMenuPromo />
        </div>
        
        {/* 🔥 NOVI PIPELINE MATRIKS UBAČEN OVDE 🔥 */}
        <div className="relative z-10 mb-24">
          <V10PipelineMatrix />
        </div>
        
        <div className="relative z-10 space-y-24">
          <IntelProtocols />
          <SaasPromo />
          
          {/* Tvoj novi interaktivni Bento Guest Pass sistem */}
          <UnlockTheBeast /> 
          
          <EnhancerPromo />
          <StockBundles />
          <Marketplace apps={apps} />
        </div>
      </div>
    </div>
  );
  // KRAJ FUNKCIJE: HomePage
}
// KRAJ FAJLA: HomePage.jsx