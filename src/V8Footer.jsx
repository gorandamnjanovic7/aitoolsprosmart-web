import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Clock } from 'lucide-react';

// POCETAK FUNKCIJE: V8Footer
const V8Footer = () => {
  const [trenutnoVreme, setTrenutnoVreme] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTrenutnoVreme(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daniUSedmici = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const datumPrikaz = `${daniUSedmici[trenutnoVreme.getDay()]} , ${trenutnoVreme.getDate().toString().padStart(2, '0')}/${(trenutnoVreme.getMonth() + 1).toString().padStart(2, '0')}/${trenutnoVreme.getFullYear()}`;
  const vremePrikaz = `${trenutnoVreme.getHours().toString().padStart(2, '0')}:${trenutnoVreme.getMinutes().toString().padStart(2, '0')}:${trenutnoVreme.getSeconds().toString().padStart(2, '0')}`;

  return (
    <footer className="relative overflow-hidden bg-black py-8 mt-8 border-t border-orange-500/50">
      
      {/* V8 Supercomputer Video Pozadina */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 pointer-events-none z-0"
      >
        <source src="/v8-vault-bg.mp4" type="video/mp4" />
      </video>

      {/* Sadržaj Footera (Z-10 ga drži iznad videa) */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full text-center text-zinc-100 font-black italic uppercase text-[9px] tracking-[0.5em]">
        <div className="flex items-center gap-6">
          <a href="https://x.com/AiToolsProSmart" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"/></svg></a>
          <a href="https://www.youtube.com/@SmartAiToolsPro-Smart-AI" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><Youtube size={20} className="text-[#FF0000]" /></a>
          <a href="https://www.instagram.com/aitoolsprosmart/" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="h-4 w-4 object-contain" /></a>
          <a href="https://www.tiktok.com/@smartaitoolspro" target="_blank" rel="noopener noreferrer" className="opacity-80 hover:opacity-100 transition-opacity"><img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" className="h-4 w-4 object-contain" /></a>
        </div>
        
        <div className="w-full px-6 flex flex-col items-center gap-3">
           <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-zinc-400 font-mono font-black tracking-widest text-[11px] md:text-[13px]">{datumPrikaz}</div>
              <div className="text-[9px] md:text-[10px]">© 2026 <span className="text-blue-500 font-black">AI TOOLS PRO</span> <span className="text-orange-500 font-black">SMART</span> <span className="mx-1 text-white font-black">|</span> ALL RIGHTS RESERVED</div>
              <div className="text-orange-500 font-mono font-black tracking-widest flex items-center justify-center gap-2 text-[12px] md:text-[15px]"><Clock className="w-4 h-4 md:w-5 md:h-5" /> {vremePrikaz}</div>
           </div>
           
           <div className="text-orange-500/60 font-bold normal-case tracking-[0.2em] text-[11px] mt-6 border-t border-white/5 pt-6 w-full max-w-4xl">Premium Digital Assets & Software Solutions.</div>
           
           {/* Dodat blagi drop-shadow da bi se tekst lako citao preko videa */}
           <div className="text-zinc-400 font-medium text-[9px] mt-2 max-w-4xl text-center leading-relaxed px-4 drop-shadow-lg">
              <strong>COMPLIANCE NOTICE:</strong> AI TOOLS PRO SMART exclusively develops and sells ready-made digital products (software templates, AI prompt libraries, and premium stock assets). We do not offer custom client services, consulting, or agency work. All purchases are instant digital downloads.
           </div>

           <div className="flex flex-wrap justify-center items-center gap-4 text-zinc-600 font-black text-[9px] uppercase tracking-[0.3em] mt-4 mb-2">
              <Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link>
              <span className="text-white/10">|</span>
              <Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link>
              <span className="text-white/10">|</span>
              <Link to="/refund" className="hover:text-orange-500 transition-colors">Refund Policy</Link>
           </div>
        </div>
      </div>
    </footer>
  );
};
// KRAJ FUNKCIJE: V8Footer

export default V8Footer;