import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 KOCKICE
import HeroBanner from './HeroBanner';
// 🔥 UVOZ NOVE B2B KOMPONENTE 🔥
import B2BProtocols from './B2BProtocols';
import IntelProtocols from './IntelProtocols';
import UnlockTheBeast from './UnlockTheBeast'; // 🔥 TVOJ NOVI MAGNET UVEZEN OVDE
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