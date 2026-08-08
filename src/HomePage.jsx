// START OF FILE: HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 BLOCKS
import HeroBanner from './HeroBanner';
import B2BProtocols from './B2BProtocols';
import VerticalCardsBox from './VerticalCardsBox'; 
import IntelProtocols from './IntelProtocols';
import SaasPromo from './SaasPromo'; 
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
        <B2BProtocols />
        
        {/* 🔥 VERTICAL CARDS BOX MOUNTED HERE 🔥 */}
        <div className="my-16">
          <VerticalCardsBox />
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
}
// END OF FILE: HomePage.jsx