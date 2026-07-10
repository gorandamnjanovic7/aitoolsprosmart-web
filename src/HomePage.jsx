// POČETAK FAJLA: HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 KOCKICE
import HeroBanner from './HeroBanner';
import B2BProtocols from './B2BProtocols';
// 🔥 UVOZ NOVE V8 DECKS KOMPONENTE SA PDF-OVIMA 🔥
import V8Decks from './V8Decks'; 
import IntelProtocols from './IntelProtocols';
import UnlockTheBeast from './UnlockTheBeast'; 
import EnhancerPromo from './EnhancerPromo';
import StockBundles from './StockBundles';
import Marketplace from './Marketplace';

export default function HomePage({ apps = [] }) {
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
        {/* 🔥 UBACENA B2B SEKCIJA TAČNO IZNAD YOUTUBE VIDEA 🔥 */}
        <B2BProtocols />
        
        {/* 🔥 V8 PDF GALERIJA - ODMAH ISPOD B2B PROTOKOLA 🔥 */}
        <V8Decks />
        
        <IntelProtocols />
        
        {/* 🔥 NOVI MAGNET POSTAVLJEN TAČNO IZMEĐU PROTOKOLA I ENHANCER-A 🔥 */}
        <UnlockTheBeast />
        
        <EnhancerPromo />
        <StockBundles />
        <Marketplace apps={apps} />
      </div>
    </>
  );
}
// KRAJ FAJLA: HomePage.jsx