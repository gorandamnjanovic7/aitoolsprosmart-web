import React, { useState } from 'react';
import V8SecureCheckout from './V8SecureCheckout'; 
// (Ne zaboravi onaj tvoj React source code link u tvom glavnom repozitorijumu!)

// POČETAK FUNKCIJE: V8ExtractorPricing
const V8ExtractorPricing = () => {
  // Stanja za kontrolu V8 Modala
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedPrice, setSelectedPrice] = useState(0);

  // POČETAK FUNKCIJE: handleOpenCheckout
  const handleOpenCheckout = (productName, price) => {
    setSelectedProduct(productName);
    setSelectedPrice(price);
    setIsCheckoutOpen(true);
  };
  // KRAJ FUNKCIJE: handleOpenCheckout

  return (
    <div className="w-full min-h-screen bg-[#050505] flex flex-col items-center justify-center py-20 px-4 font-sans">
      
      {/* Gornji tekstualni opis (Info blok) */}
      <div className="max-w-4xl w-full mb-12 p-6 bg-black border border-gray-800 rounded-xl text-gray-400 text-sm leading-relaxed shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <p className="mb-4">
          days. Your cycle only ends when your credits hit zero.
        </p>
        <p>
          <strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-500 font-bold">For free. Forever.</span>
        </p>
      </div>

      {/* Grid sa 3 Pricing kartice */}
      <div className="flex flex-col md:flex-row gap-8 max-w-5xl w-full justify-center items-end">
        
        {/* 1. STARTER KARTICA */}
        <div className="w-full md:w-1/3 bg-[#0a0a0a] border border-gray-800 hover:border-blue-500/50 rounded-2xl p-8 flex flex-col relative transition-all duration-300">
          <div className="flex justify-center mb-6">
            <div className="w-10 h-10 border-2 border-blue-500 rotate-45"></div>
          </div>
          <h3 className="text-white text-center font-black text-xl tracking-widest mb-4">STARTER</h3>
          <div className="text-blue-500 text-center font-black text-5xl mb-8">$150</div>
          
          <ul className="space-y-4 mb-10 flex-grow text-xs text-gray-400 font-bold tracking-wider">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              500 CREDITS INCLUDED
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600">⏳</span>
              USE IN 24H OR STRETCH OVER 365 DAYS
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">🔄</span>
              ROLLING QUOTA (NO MONTHLY EXPIRY)
            </li>
          </ul>

          <button 
            onClick={() => handleOpenCheckout('V8 Extractor - STARTER', 150)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-lg tracking-widest transition-colors shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
          >
            SELECT STARTER
          </button>
        </div>

        {/* 2. PRO KARTICA (Izdvojena/V8 Stil) */}
        <div className="w-full md:w-1/3 bg-[#0a0a0a] border border-orange-500 rounded-3xl p-10 flex flex-col relative transform md:-translate-y-4 shadow-[0_0_40px_rgba(249,115,22,0.15)] z-10 transition-all duration-300">
          <div className="flex justify-center mb-6 text-orange-500 text-3xl">
            ⚡
          </div>
          <h3 className="text-white text-center font-black text-xl tracking-widest mb-4">PRO</h3>
          <div className="text-orange-500 text-center font-black text-5xl mb-8">$250</div>
          
          <ul className="space-y-4 mb-10 flex-grow text-xs text-gray-400 font-bold tracking-wider">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              2,000 CREDITS INCLUDED
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600">⏳</span>
              USE IN 24H OR STRETCH OVER 365 DAYS
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">🔄</span>
              ROLLING QUOTA (NO MONTHLY EXPIRY)
            </li>
          </ul>

          <button 
            onClick={() => handleOpenCheckout('V8 Extractor - PRO', 250)}
            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-black font-black rounded-lg tracking-widest transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)]"
          >
            SELECT PRO
          </button>
        </div>

        {/* 3. ENTERPRISE KARTICA */}
        <div className="w-full md:w-1/3 bg-[#0a0a0a] border border-gray-800 hover:border-purple-500/50 rounded-2xl p-8 flex flex-col relative transition-all duration-300">
          <div className="flex justify-center mb-6 text-purple-500 text-3xl">
            👑
          </div>
          <h3 className="text-white text-center font-black text-xl tracking-widest mb-4">ENTERPRISE</h3>
          <div className="text-purple-500 text-center font-black text-5xl mb-8">$550</div>
          
          <ul className="space-y-4 mb-10 flex-grow text-xs text-gray-400 font-bold tracking-wider">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500">✓</span>
              5,000 CREDITS INCLUDED
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-600">⏳</span>
              USE IN 24H OR STRETCH OVER 365 DAYS
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">🔄</span>
              LIFETIME ACCESS (ROLLING QUOTA)
            </li>
          </ul>

          <button 
            onClick={() => handleOpenCheckout('V8 Extractor - ENTERPRISE', 550)}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-lg tracking-widest transition-colors shadow-[0_0_20px_rgba(147,51,234,0.2)] hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
          >
            SELECT ENTERPRISE
          </button>
        </div>

      </div>

      {/* Naš pametni V8 Super Computer Modal na dnu komponente */}
      <V8SecureCheckout 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        productName={selectedProduct} 
        price={selectedPrice} 
      />

    </div>
  );
};
export default V8ExtractorPricing;
// KRAJ FUNKCIJE: V8ExtractorPricing