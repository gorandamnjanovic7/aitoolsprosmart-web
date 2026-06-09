// POČETAK FAJLA: App.jsx
// Ne zaboravi React source code link u tvom repozitorijumu!

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Globe, Award, ChevronDown, Layers, Image as ImageIcon, Zap, Settings, ShieldAlert, Lock, LogOut, User, Video, MonitorPlay, CheckCircle, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScanOverlay from './ScanOverlay'; 

// FIREBASE
import { db, auth, provider } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';

// DATA & COMPONENTS
import * as data from './data';
import './App.css'; 

// SVE TVOJE STRANICE
import HomePage from './HomePage';
import V8Enhancer10x from './V8Enhancer10x';
import V8Promo10xPage from './V8Promo10xPage'; 
import V8ContactWidget from './V8ContactWidget';
import V8StockBerza from './componentsStockBerza/V8StockBerza';
import V8Showroom from './V8Showroom'; 
import VisitorCounter from './VisitorCounter';
import SingleProductPage from './SingleProductPage';
import V8MediaViewer from './v8-ui-components/V8MediaViewer'; 
import V8Terms from './V8Terms';
import V8Privacy from './V8Privacy';
import V8Refund from './V8Refund';
import TrezorPage from './TrezorPage'; 
import V8DatabaseAdmin from "./V8DatabaseAdmin";
import V8AdminDashboard from "./V8AdminDashboard";
import V8Standard16MPWorkspace from "./V8Standard16MPWorkspace";
import V8GridSystem from './V8GridSystem';
import UgcAvatar from './UgcAvatar';
import VaultTransition from './v8-ui-components/VaultTransition'; 
import V8IdleProtocol from './v8-ui-components/V8IdleProtocol'; 
import V8CinematicText from './v8-ui-components/V8CinematicText'; 
import CinematikPromptEngine from './CinematikPromptEngine';
import V8PayoneerDashboard from './V8PayoneerDashboard';
import V8JsonDeBrendingExtractorPage from './V8JsonDeBrendingExtractorPage';

// 🔥 NOVO: Dodat import za DNA Extractor 🔥
import V8JsonDeExtractorPage from './V8JsonDeExtractorPage';

import V8RadarCursor from './v8-ui-components/V8RadarCursor'; 
import V8Navbar from './V8Navbar';
import V8Footer from './V8Footer';

// 🔥 NOVI IMPORTI 🔥
import V8SecureCheckout from './V8SecureCheckout';
import V8UnlockModal from './V8UnlockModal'; 
import V8AdminLiveNotifier from './V8AdminLiveNotifier'; // 🔥 TVOJ ADMIN RADAR 🔥

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
  if (window.location.hash) { window.history.replaceState(null, '', window.location.pathname); }
  window.scrollTo(0, 0);
}

const MOJA_IP = "213.196.99.10"; 
let globalUserIp = "";
const currentSessionId = Math.random().toString(36).substring(2, 15);

// POCETAK FUNKCIJE: fetchUserIp
const fetchUserIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const d = await res.json(); globalUserIp = d.ip;
  } catch (err) {}
};
// KRAJ FUNKCIJE: fetchUserIp

fetchUserIp();

// POCETAK FUNKCIJE: logAnalyticsEvent
export const logAnalyticsEvent = async (type, details) => {
  if (globalUserIp === MOJA_IP || globalUserIp === "") return; 
  try { await addDoc(collection(db, "analytics"), { type, ...details, timestamp: Date.now(), sessionId: currentSessionId }); } catch (err) {}
};
// KRAJ FUNKCIJE: logAnalyticsEvent

export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};

// POCETAK FUNKCIJE: V8PageWrapper
const V8PageWrapper = ({ children }) => {
  return (
    <>
      <ScanOverlay />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }} 
        className="w-full h-full origin-center relative z-10"
      >
        {children}
      </motion.div>
    </>
  );
};
// KRAJ FUNKCIJE: V8PageWrapper

// POCETAK FUNKCIJE: V8ToastContainer
const V8ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return v8Toast.subscribe((t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${t.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : 'bg-red-900/40 border-red-500/50 text-red-100'}`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
// KRAJ FUNKCIJE: V8ToastContainer

// POCETAK FUNKCIJE: FullScreenBoot
const FullScreenBoot = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { 
          clearInterval(interval); 
          setIsIgniting(true); 
          setTimeout(onComplete, 1200); 
          return 100; 
        }
        return p + Math.floor(Math.random() * 4) + 1; 
      });
    }, 40); 
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }} transition={{ duration: 0.8, ease: "easeInOut" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div animate={{ scale: isIgniting ? 4 : [1, 1.2, 1], opacity: isIgniting ? 0 : [0.05, 0.15, 0.05] }} transition={{ duration: isIgniting ? 0.8 : 2, repeat: isIgniting ? 0 : Infinity }} className="w-96 h-96 bg-orange-600 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-48 h-48 flex items-center justify-center mb-12">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border-[1px] border-orange-500/20 rounded-full border-t-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)]" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-6 border-[1px] border-blue-500/20 rounded-full border-b-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]" />
          <motion.img src={data.logoUrl} alt="V8 Logo" animate={{ scale: isIgniting ? 1.5 : [0.95, 1.05, 0.95], filter: isIgniting ? "drop-shadow(0 0 40px rgba(234,88,12,1))" : "drop-shadow(0 0 10px rgba(234,88,12,0.5))" }} transition={{ duration: isIgniting ? 0.5 : 2, repeat: isIgniting ? 0 : Infinity }} className="w-20 h-20 object-contain relative z-10" />
        </div>
        <div className="w-64 md:w-80">
          <div className="flex justify-between items-end mb-3 font-mono">
            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-orange-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em]">
              {isIgniting ? "SYSTEM READY // V8 ONLINE" : "BOOTING V8 CORE..."}
            </motion.span>
            <span className="text-white text-[12px] md:text-[14px] font-black tracking-widest">{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative shadow-inner">
            <motion.div className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 via-orange-400 to-amber-300 shadow-[0_0_15px_rgba(234,88,12,0.8)]" style={{ width: `${progress}%` }} layout />
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isIgniting && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="absolute inset-0 bg-orange-500/20 z-50 pointer-events-none mix-blend-overlay" />}
      </AnimatePresence>
    </motion.div>
  );
};
// KRAJ FUNKCIJE: FullScreenBoot

// POCETAK FUNKCIJE: SmartScrollButton
const SmartScrollButton = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => { 
    const checkScroll = () => setIsScrolled(window.scrollY > 400); 
    window.addEventListener('scroll', checkScroll); 
    return () => window.removeEventListener('scroll', checkScroll); 
  }, []);
  
  const handleAction = () => { 
    const targetHeight = isScrolled ? 0 : Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    window.scrollTo({ top: targetHeight, behavior: 'smooth' }); 
  };
  
  return (
    <button onClick={handleAction} className="fixed bottom-[150px] right-6 z-[9999] flex flex-col items-center group transition-all duration-500">
      <div className={`w-1.5 rounded-full transition-all duration-700 flex items-center justify-center ${isScrolled ? 'bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.8)] h-16' : 'bg-white/20 h-10 hover:bg-white/40'}`}>
        <div className={`transition-transform duration-700 text-white ${isScrolled ? 'rotate-0' : 'rotate-180'}`}><ChevronUp size={14} strokeWidth={4} /></div>
      </div>
    </button>
  );
};
// KRAJ FUNKCIJE: SmartScrollButton

// POCETAK FUNKCIJE: AppContent
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const entryTime = useRef(Date.now());
  const [authVersion, setAuthVersion] = useState(0); 

  // 🔥 GLOBALNI STATE ZA CHECKOUT 🔥
  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '' });

  // POČETAK FUNKCIJE: handleOpenCheckout
  const handleOpenCheckout = useCallback((productName, price) => {
    setCheckoutData({ isOpen: true, name: productName, price });
  }, []);
  // KRAJ FUNKCIJE: handleOpenCheckout

  // POČETAK FUNKCIJE: handleCloseCheckout
  const handleCloseCheckout = useCallback(() => {
    setCheckoutData({ isOpen: false, name: '', price: '' });
  }, []);
  // KRAJ FUNKCIJE: handleCloseCheckout

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
        setAuthVersion(v => v + 1);
    }); 
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleContextMenu = (e) => { 
      if (e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') { e.preventDefault(); } 
    };
    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  useEffect(() => {
    if (prevLocation.current !== location.pathname) {
       const timeSpent = Date.now() - entryTime.current;
       logAnalyticsEvent('time_spent', { path: prevLocation.current, durationMS: timeSpent });
       prevLocation.current = location.pathname; entryTime.current = Date.now();
       logAnalyticsEvent('page_view', { path: location.pathname });
    }
  }, [location.pathname]);

  useEffect(() => { logAnalyticsEvent('page_view', { path: location.pathname }); }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => { const target = e.target.closest('button, a'); if (target) logAnalyticsEvent('click', { elementText: target.innerText || target.getAttribute('aria-label') || 'Icon', path: window.location.pathname }); };
    document.addEventListener('click', handleGlobalClick); return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleHomeClick = (e) => { if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.replaceState(null, '', '/'); } };

  return (
    <div key={authVersion} className="min-h-screen text-zinc-100 font-sans relative text-left bg-[url('/v8-supercomputer-bg.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
      
      {/* AGRESIVNI OVERRIDE ZA BROJAC POSETA - PODIGNUT DA NE PREKLAPA KONTAKT */}
      <style>{`
        #v8-counter-container {
          position: fixed !important;
          bottom: 120px !important;
          left: 1.5rem !important;
          z-index: 9999 !important;
          display: block !important;
        }
        #v8-counter-container > * {
          position: relative !important;
          right: auto !important;
          left: auto !important;
          bottom: auto !important;
          top: auto !important;
          margin: 0 !important;
        }
      `}</style>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(5,5,5,0.95)_30%,_rgba(5,5,5,0.3)_100%)] backdrop-blur-[1px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col min-h-screen w-full pb-20 lg:pb-0">
        <V8RadarCursor />
        <V8ToastContainer />
        
        <AnimatePresence>
          {isBooting && <FullScreenBoot key="boot" onComplete={() => { setIsBooting(false); window.scrollTo(0,0); }} />}
        </AnimatePresence>
        
        <V8Navbar handleHomeClick={handleHomeClick} />

        {/* 🔥 TVOJ ADMIN RADAR ZA OBAVEŠTENJA U ŽIVO 🔥 */}
        <V8AdminLiveNotifier />

        {/* 🔥 GLOBALNI MODAL ZA OTKLJUČAVANJE 🔥 */}
        <V8UnlockModal />
        
        <div className="flex-1 text-left pt-20">
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
            {/* 🔥 PROSLEDJIVANJE openCheckout FUNKCIJE KROZ RUTE 🔥 */}
           <Routes location={location} key={location.pathname}>
              <Route path="/" element={<V8PageWrapper><HomePage apps={appsData} openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/v8-standard-16mp" element={<V8PageWrapper><V8Standard16MPWorkspace openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              
              {/* 🔥 ISPRAVLJENE RUTE: SVAKA GAĐA SVOJ FAJL 🔥 */}
              <Route path="/extractor" element={
                <V8PageWrapper>
                  <V8JsonDeExtractorPage openCheckout={handleOpenCheckout} />
                </V8PageWrapper>
              } />
              
              <Route path="/v8-debranding-extractor" element={
                <V8PageWrapper>
                  <V8JsonDeBrendingExtractorPage openCheckout={handleOpenCheckout} />
                </V8PageWrapper>
              } />
              
              {/* 🔥 OVDE JE ZAMENJENO IME U V8GridSystem 🔥 */}
              <Route path="/grid-system" element={<V8PageWrapper><V8GridSystem openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              
              <Route path="/seedance" element={<V8PageWrapper><CinematikPromptEngine initialEngine="SEEDANCE 2.0" openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/kling" element={<V8PageWrapper><CinematikPromptEngine initialEngine="KLING 3.0" openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/enxance" element={<V8PageWrapper><V8Enhancer10x openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/promo" element={<V8PageWrapper><V8Promo10xPage openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/app/:id" element={<V8PageWrapper><SingleProductPage apps={appsData} openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/trezor" element={<V8PageWrapper><TrezorPage apps={appsData} /></V8PageWrapper>} />
              <Route path="/admin" element={<V8PageWrapper><V8DatabaseAdmin apps={appsData} refreshData={refreshData} /></V8PageWrapper>} />
              <Route path="/dashboard" element={<V8PageWrapper><V8AdminDashboard /></V8PageWrapper>} />
              <Route path="/admin-payoneer" element={<V8PageWrapper><V8PayoneerDashboard /></V8PageWrapper>} />
              <Route path="/stock" element={<V8PageWrapper><V8StockBerza /></V8PageWrapper>} />
              <Route path="/showroom" element={<V8PageWrapper><V8Showroom /></V8PageWrapper>} />
              <Route path="/terms" element={<V8PageWrapper><V8Terms /></V8PageWrapper>} />
              <Route path="/privacy" element={<V8PageWrapper><V8Privacy /></V8PageWrapper>} />
              <Route path="/refund" element={<V8PageWrapper><V8Refund /></V8PageWrapper>} />
              <Route path="/media" element={<V8PageWrapper><V8MediaViewer /></V8PageWrapper>} />
            </Routes>
          </AnimatePresence>
        </div>
        
        <SmartScrollButton />
        <V8ContactWidget />
        <UgcAvatar />

        {/* BROJAC POSETA STAVLJEN U NOVI KONTEJNER */}
        <div id="v8-counter-container">
          <VisitorCounter />
        </div>

        <V8Footer />

        {/* 🔥 RENDEROVANJE MODALA NA GLOBALNOM NIVOU 🔥 */}
        <AnimatePresence>
          {checkoutData.isOpen && (
            <V8SecureCheckout 
              productName={checkoutData.name} 
              price={checkoutData.price} 
              onClose={handleCloseCheckout} 
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
// KRAJ FUNKCIJE: AppContent

// POCETAK FUNKCIJE: App
export default function App() {
  const [appsData, setAppsData] = useState([]);

  // POCETAK FUNKCIJE: refreshData
  const refreshData = useCallback(async () => {
    try {
      const q = query(collection(db, "v8_products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAppsData(data);
    } catch (error) {
      setAppsData([]);
    }
  }, []);
  // KRAJ FUNKCIJE: refreshData

  useEffect(() => { refreshData(); }, [refreshData]);

  return (
    <HelmetProvider>
      <Router>
        {/* 🔥 DODATO 5 MINUTA (300000ms) ZA AKTIVACIJU SCREENSAVERA 🔥 */}
        <V8IdleProtocol timeout={600000} />
        <AppContent appsData={appsData} refreshData={refreshData} />
      </Router>
    </HelmetProvider>
  );
}
// KRAJ FUNKCIJE: App