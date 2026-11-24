// POČETAK FAJLA: HomePage.jsx
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// V8 BLOCKS
import HeroBanner from './HeroBanner';
import TechSlant from './TechSlant';
import AiAgentsHeroBanner from "./aiagents/AiAgentsHeroBanner";
import B2BProtocols from './B2BProtocols';
import VerticalCardsBox from './VerticalCardsBox';
import QRMenuPromo from './QRMenuPromo';
import V10PipelineMatrix from './V10PipelineMatrix';
import IntelProtocols from './IntelProtocols';
import SaasPromo from './SaasPromo';
import UnlockTheBeast from './UnlockTheBeast';
import EnhancerPromo from './EnhancerPromo';
import StockBundles from './StockBundles';
import Marketplace from './Marketplace';

// POČETAK FUNKCIJE: HomePage
export default function HomePage({ apps = [] }) {
  const location = useLocation();

  // POČETAK FUNKCIJE: useEffect callback
  useEffect(() => {
    if (location.hash === '#marketplace') {
      const el = document.getElementById('marketplace');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);
  // KRAJ FUNKCIJE: useEffect callback

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Helmet>
        <title>AI Tools Pro Smart | White-Label AI Agents, 150MP Stock &amp; Mockup Vaults</title>
        <meta
          name="description"
          content="Acquire turnkey White-Label AI Systems (React + n8n workflows), 150MP IP-safe commercial stock photography, Ultra-Print SaaS mockups, and enterprise UI/UX design vaults."
        />
        <meta name="thumbnail" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <meta property="og:title" content="AI Tools Pro Smart | 150MP Commercial Stock, Mockups &amp; White-Label AI" />
        <meta
          property="og:description"
          content="100% IP-safe 150MP Master Print &amp; 4K commercial visual vaults, architectural mockups, B2B Landing Page Kits, and turnkey White-Label AI systems."
        />
        <meta property="og:image" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <meta property="og:url" content="https://aitoolsprosmart.com/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://aitoolsprosmart.com/og-cover-v10.jpg" />
        <link rel="canonical" href="https://aitoolsprosmart.com/" />
      </Helmet>
      
      <HeroBanner />
      
      {/* NOVI BANER ZA AI AGENTE */}
      <AiAgentsHeroBanner />
      
      <TechSlant />
      
      <div className="max-w-7xl mx-auto px-6 py-12 text-left relative">
        
        {/* Ambijentalni V8 odsjaj */}
        <div className="absolute top-32 left-1/4 w-[500px] h-[500px] bg-[#ff5500]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#ff5500]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 mb-24">
          <B2BProtocols />
        </div>
        
        <div className="relative z-10 mb-24">
          <VerticalCardsBox />
        </div>
        
        <div className="relative z-10 mb-24">
          <QRMenuPromo />
        </div>
        
        <div className="relative z-10 mb-24">
          <V10PipelineMatrix />
        </div>
        
        <div className="relative z-10 space-y-24">
          <IntelProtocols />
          <SaasPromo />
          <UnlockTheBeast />
          <EnhancerPromo />
          <StockBundles />
          <Marketplace apps={apps} />
        </div>
      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: HomePage
// KRAJ FAJLA: HomePage.jsx