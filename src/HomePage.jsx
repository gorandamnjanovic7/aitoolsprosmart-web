// POČETAK FAJLA: HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 BLOCKS
import HeroBanner from './HeroBanner';
import B2BProtocols from './B2BProtocols';
import VerticalCardsBox from './VerticalCardsBox'; 
import QRMenuPromo from './QRMenuPromo'; // 🔥 Import za reklamu QR Menija
import IntelProtocols from './IntelProtocols';
import SaasPromo from './SaasPromo'; 
import UnlockTheBeast from './UnlockTheBeast'; 
import EnhancerPromo from './EnhancerPromo';
import StockBundles from './StockBundles';
import Marketplace from './Marketplace';

export default function HomePage({ apps = [] }) { // POČETAK FUNKCIJE: HomePage
  const location = useLocation();

  useEffect(() => { 
    if (location.hash === '#marketplace') { 
      const el = document.getElementById('marketplace'); 
      if (el) el.scrollIntoView({ behavior: 'smooth' }); 
    } 
  }, [location]);

  return (
    <>
      <Helmet><title>AI TOOLS PRO SMART | GLOBAL</title></Helmet>
      
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-6 text-left">
        
        {/* ENTERPRISE SOLUTIONS SEKCIJA */}
        <B2BProtocols />
        
        <div className="my-16">
          <VerticalCardsBox />
        </div>
        
        {/* 🔥 REKLAMA ZA QR MENI (Spuštena tačno ispod Enterprise Solutions) 🔥 */}
        <div className="mb-16">
          <QRMenuPromo />
        </div>
        
        <IntelProtocols />
        <SaasPromo />
        <UnlockTheBeast />
        <EnhancerPromo />
        <StockBundles />
        <Marketplace apps={apps} />
      </div>
    </>
  );
} // KRAJ FUNKCIJE: HomePage
// KRAJ FAJLA: HomePage.jsx