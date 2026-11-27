// ============================================================================
// FAJL: src/V8Footer.jsx (POCETAK FUNKCIJE: V8Footer)
// RUTA / NAMENA: Globalni B2B futer sajta — usklađen Commercial Licensing & IP-Safe Compliance Notice
// ============================================================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Clock, Linkedin } from 'lucide-react';

const V8Footer = () => {
  const [trenutnoVreme, setTrenutnoVreme] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTrenutnoVreme(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const daniUSedmici = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  const datumPrikaz = `${daniUSedmici[trenutnoVreme.getDay()]} , ${trenutnoVreme
    .getDate()
    .toString()
    .padStart(2, '0')}/${(trenutnoVreme.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${trenutnoVreme.getFullYear()}`;
  const vremePrikaz = `${trenutnoVreme
    .getHours()
    .toString()
    .padStart(2, '0')}:${trenutnoVreme
    .getMinutes()
    .toString()
    .padStart(2, '0')}:${trenutnoVreme.getSeconds().toString().padStart(2, '0')}`;

  return (
    <footer className="relative overflow-hidden bg-black py-10 mt-12 border-t border-orange-500/40">
      {/* Diskretna video pozadina */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover opacity-15 pointer-events-none z-0"
      >
        <source src="/v8-vault-bg.mp4" type="video/mp4" />
      </video>

      {/* Glavni sadržaj futera */}
      <div className="relative z-10 flex flex-col items-center gap-6 w-full text-center text-zinc-100">
        {/* Društvene i B2B mreže (100% čisti SVG bez spoljnih PNG linkova) */}
        <div className="flex items-center gap-6">
          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/goran-damnjanovic/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="opacity-90 hover:opacity-100 transition-opacity"
          >
            <Linkedin
              size={20}
              className="text-[#0A66C2] drop-shadow-[0_0_10px_rgba(10,102,194,0.75)]"
            />
          </a>

          {/* Behance B2B Portfolio */}
          <a
            href="https://www.behance.net/gorandamnjan"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance Portfolio"
            className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/15 border border-white/15 text-[11px] font-black tracking-wider text-white transition"
          >
            Bē
          </a>

          {/* X / Twitter */}
          <a
            href="https://x.com/AiToolsProSmart"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
            </svg>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@SmartAiToolsPro-Smart-AI"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="opacity-80 hover:opacity-100 transition-opacity"
          >
            <Youtube size={20} className="text-[#FF0000]" />
          </a>

          {/* Instagram (Čist SVG umesto Wikimedia PNG-a) */}
          <a
            href="https://www.instagram.com/aitoolsprosmart/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="opacity-80 hover:opacity-100 transition-opacity text-zinc-200 hover:text-orange-400"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </a>
        </div>

        <div className="w-full px-6 flex flex-col items-center gap-4">
          {/* Gornji status bar sa datumom, brendom i satom */}
          <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-4 uppercase font-black italic">
            <div className="text-zinc-400 font-mono tracking-widest text-[11px] md:text-[13px] not-italic">
              {datumPrikaz}
            </div>

            <div className="text-[10px] md:text-[11px] tracking-[0.28em]">
              © 2026 <span className="text-amber-400">VISIONARY FACTORY V10</span>{' '}
              <span className="mx-1.5 text-white/40">•</span>{' '}
              <span className="text-blue-500">AI TOOLS PRO</span>{' '}
              <span className="text-orange-500">SMART</span>{' '}
              <span className="mx-1.5 text-white/40">|</span> ALL RIGHTS RESERVED
            </div>

            <div className="text-orange-500 font-mono tracking-widest flex items-center justify-center gap-2 text-[12px] md:text-[15px] not-italic">
              <Clock className="w-4 h-4 md:w-5 md:h-5" /> {vremePrikaz}
            </div>
          </div>

          <div className="text-orange-400/90 font-extrabold uppercase tracking-[0.22em] text-[11px] mt-4 border-t border-white/10 pt-6 w-full max-w-4xl">
            150MP Ultra-Print Visuals • Executive OOH &amp; Wall Mockups • Turnkey B2B UI/UX Systems
          </div>

          {/* Čitljiv B2B & PayPal-Safe Compliance Notice */}
          <div className="text-zinc-300 font-normal text-[11px] mt-1 max-w-4xl text-center leading-relaxed px-4 drop-shadow">
            <strong className="text-white font-bold uppercase tracking-wider">
              COMMERCIAL LICENSING &amp; IP COMPLIANCE:
            </strong>{' '}
            Visionary Factory V10 (operated by AI Tools Pro Smart) engineers and licenses
            proprietary 150MP &amp; 4K UHD commercial visual archives, unmarked architectural and
            out-of-home (OOH) mockup environments, turnkey React UI/UX design systems, and bespoke
            on-demand visual production for agencies and enterprises. All visual assets are 100%
            synthetically engineered in-house, free of third-party copyrighted photography, brand
            trademarks, logos, or likenesses, and cleared for perpetual worldwide commercial use.
            Digital vaults are delivered via instant electronic access.
          </div>

          {/* Pravni linkovi sa boljim kontrastom */}
          <div className="flex flex-wrap justify-center items-center gap-5 text-zinc-400 font-extrabold text-[10px] uppercase tracking-[0.22em] mt-3 mb-1">
            <Link to="/terms" className="hover:text-orange-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/privacy" className="hover:text-orange-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/refund" className="hover:text-orange-400 transition-colors">
              Refund &amp; Licensing Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default V8Footer;
// KRAJ FUNKCIJE: V8Footer