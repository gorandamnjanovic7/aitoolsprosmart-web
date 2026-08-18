// POČETAK FAJLA: App.jsx
// Ne zaboravi React source code link u tvom repozitorijumu!

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Globe, Award, ChevronDown, Layers, Image as ImageIcon, Zap, Settings, ShieldAlert, Lock, LogOut, User, Video, MonitorPlay, CheckCircle, ChevronUp, Bitcoin, CreditCard, DollarSign, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ScanOverlay from './ScanOverlay'; 

import { db, auth, provider } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs, limit, onSnapshot } from 'firebase/firestore';

import * as data from './data';
import './App.css'; 

import HomePage from './HomePage';
import V8Enhancer10x from './V8Enhancer10x';
import V8Promo10xPage from './V8Promo10xPage'; 
import V8ContactWidget from './V8ContactWidget';
import V8StockBerza from './componentsStockBerza/V8StockBerza';
import V8Stock2 from './componentsStockBerza/V8Stock2'; 
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
import V8CinematicText from './v8-ui-components/V8CinematicText'; 
import CinematikPromptEngine from './CinematikPromptEngine';
import V8PayoneerDashboard from './V8PayoneerDashboard';
import V8JsonDeBrendingExtractorPage from './V8JsonDeBrendingExtractorPage';
import V8JsonDeExtractorPage from './V8JsonDeExtractorPage';
import V8MasterEngine33MP from './V8MasterEngine33MP';
import V8MasterEngine45MP from './V8MasterEngine45MP';
import V8MasterEngine60MP from './V8MasterEngine60MP';
import V8RadarCursor from './v8-ui-components/V8RadarCursor'; 
import V8Navbar from './V8Navbar';
import V8Footer from './V8Footer';
import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';
import V8UnlockModal from './V8UnlockModal'; 
import V8AdminLiveNotifier from './V8AdminLiveNotifier';
import V8PromptFactory from './V8PromptFactory';
import V8NeuralForge from './V8NeuralForge'; 
import V8RawRealityEngine from './V8RawRealityEngine';
import SaaSProtocolPage from './SaaSProtocolPage';
import StandardMocup from './StandardMocup';

import { NotificationListener, NotificationModal } from './NotificationSystem';

// 🔥 NOVI IMPORT: Portfolio 🔥
import Portfolio from './Portfolio';

// 🔥 AŽURIRANI IMPORTI ZA PREMIUM QR MENI IZ NOVOG FOLDERA 🔥
import V8PremiumTestMenu from './qrcode/V8PremiumTestMenu';
import PublicMenuTestQRMenu from './qrcode/PublicMenuTestQRMenu';

if (typeof window !== 'undefined') {
  if ('scrollRestoration' in window.history) { window.history.scrollRestoration = 'manual'; }
  if (window.location.hash) { window.history.replaceState(null, '', window.location.pathname); }
  window.scrollTo(0, 0);
}

let currentAudio = null; 

// POČETAK FUNKCIJE playV8Sound
export const playV8Sound = (type) => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    let audioUrl = '';
    if (type === 'success') audioUrl = '/v8-success.mp3';
    else if (type === 'error' || type === 'alarm') audioUrl = '/v8-alarm.mp3';
    else if (type === 'checkout') audioUrl = '/v8-checkout.mp3';

    if (audioUrl) {
      currentAudio = new Audio(audioUrl);
      currentAudio.volume = 0.5;
      currentAudio.play().catch(e => console.warn("Browser blokirao autoplay zvuka", e));
    }
  } catch (err) {}
};
// KRAJ FUNKCIJE playV8Sound

// POČETAK FUNKCIJE stopV8Sound
export const stopV8Sound = () => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  } catch (err) {}
};
// KRAJ FUNKCIJE stopV8Sound

export const v8AlertModal = {
  listeners: [],
  show: (data) => {
    if (data.type === 'success') playV8Sound('success');
    else if (data.type === 'error' || data.type === 'alarm') playV8Sound('alarm');
    else playV8Sound('success'); 
    v8AlertModal.listeners.forEach(l => l(data));
  },
  subscribe: (l) => {
    v8AlertModal.listeners.push(l);
    return () => v8AlertModal.listeners = v8AlertModal.listeners.filter(cb => cb !== l);
  }
};

const MOJA_IP = "213.196.99.2"; 
let globalUserIp = "";
const currentSessionId = Math.random().toString(36).substring(2, 15);

// POČETAK FUNKCIJE fetchUserIp
const fetchUserIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const d = await res.json(); globalUserIp = d.ip;
  } catch (err) {}
};
fetchUserIp();
// KRAJ FUNKCIJE fetchUserIp

// POČETAK FUNKCIJE logAnalyticsEvent
export const logAnalyticsEvent = async (type, details) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return; 

  const isAdmin = currentUser.email === "damnjanovicgoran7@gmail.com" || currentUser.email === "aitoolsprosmart@gmail.com";
  if (globalUserIp === MOJA_IP || isAdmin || globalUserIp === "") return; 

  try { 
    await addDoc(collection(db, "analytics"), { 
      type, 
      ...details, 
      userEmail: currentUser.email, 
      timestamp: Date.now(), 
      sessionId: currentSessionId 
    }); 
  } catch (err) {}
};
// KRAJ FUNKCIJE logAnalyticsEvent

export const v8Toast = {
  listeners: [],
  success: (msg) => {
    playV8Sound('success');
    v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() }));
  },
  error: (msg) => {
    playV8Sound('error');
    v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() }));
  },
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};

// POČETAK FUNKCIJE V8ToastContainer
const V8ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    return v8Toast.subscribe((t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    });
  }, []);
  return (
    <div className="fixed top-24 right-6 z-[99999999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 20, scale: 0.9 }} className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl transform-gpu ${t.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : 'bg-red-900/40 border-red-500/50 text-red-100'}`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
// KRAJ FUNKCIJE V8ToastContainer

// POČETAK FUNKCIJE V8AlertModalContainer
const V8AlertModalContainer = () => {
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    return v8AlertModal.subscribe((data) => setModalData(data));
  }, []);

  if (!modalData) return null;

  const handleClose = () => {
    stopV8Sound();
    setModalData(null);
  };

  let themeBg = 'bg-zinc-800';
  
  if (modalData.icon === 'b2b') {
    themeBg = 'bg-gradient-to-br from-blue-600 to-blue-900 shadow-blue-500/50';
  } else if (modalData.icon === 'paypal') {
    themeBg = 'bg-gradient-to-br from-[#003087] to-[#009cde] shadow-[#009cde]/50';
  } else if (modalData.icon === 'card') {
    themeBg = 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/50';
  } else if (modalData.icon === 'crypto') {
    themeBg = 'bg-gradient-to-br from-[#F7931A] to-[#D97B16] shadow-[#F7931A]/50';
  } else if (modalData.type === 'error' || modalData.type === 'alarm') {
    themeBg = 'bg-gradient-to-br from-red-600 to-red-900 shadow-red-500/50';
  }

  return (
    <AnimatePresence>
      {modalData && (
        <motion.div 
          initial={{ opacity: 0, x: 100, scale: 0.9 }} 
          animate={{ opacity: 1, x: 0, scale: 1 }} 
          exit={{ opacity: 0, x: 100, scale: 0.9 }} 
          className={`fixed top-6 right-6 z-[99999999] w-80 md:w-96 rounded-2xl p-5 text-white shadow-2xl border border-white/20 backdrop-blur-xl transform-gpu ${themeBg}`}
        >
          <button onClick={handleClose} className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors cursor-pointer z-50">
            <X size={24} strokeWidth={3} />
          </button>

          <div className="mb-4 pr-6">
            <h3 className="font-black text-lg leading-tight uppercase">{modalData.customerName}</h3>
            <p className="text-white/80 text-[12px] font-medium tracking-wider">{modalData.email}</p>
          </div>

          <div className="flex justify-center items-center py-6 bg-black/20 rounded-xl mb-4 border border-white/10 shadow-inner">
            {modalData.icon === 'b2b' && (
              <svg viewBox="0 0 250 60" className="w-48 h-auto drop-shadow-xl" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="payoneerGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff5a00"/>
                    <stop offset="35%" stopColor="#ff004a"/>
                    <stop offset="70%" stopColor="#9000ff"/>
                    <stop offset="100%" stopColor="#00b4ff"/>
                  </linearGradient>
                </defs>
                <circle cx="30" cy="30" r="16" fill="none" stroke="url(#payoneerGradient)" strokeWidth="8" />
                <text x="58" y="40" fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fontWeight="700" fontSize="32" fill="white" letterSpacing="-0.5">Payoneer</text>
              </svg>
            )}
            {modalData.icon === 'crypto' && <Bitcoin className="w-16 h-16 text-white drop-shadow-md" />}
            {modalData.icon === 'paypal' && (
              <svg viewBox="0 0 24 24" fill="white" className="w-16 h-16 drop-shadow-md">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.815 1.01 1.15 1.304 2.815.871 4.715a9.151 9.151 0 0 1-1.876 3.943c-1.336 1.76-3.485 2.65-6.28 2.65H9.658c-.628 0-1.159.458-1.258 1.078L7.076 21.337z"/>
              </svg>
            )}
            {modalData.icon === 'card' && (
              <div className="flex flex-col items-center gap-1 drop-shadow-md">
                <span className="text-3xl font-black italic tracking-tighter">VISA</span>
                <CreditCard className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          <div className="flex justify-between items-end mt-2">
            <div>
              <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Datum i Vreme</p>
              <p className="text-xs font-semibold">{modalData.timestamp}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/60 uppercase font-black tracking-widest mb-1">Iznos</p>
              <p className="text-2xl font-black">${modalData.amount}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// KRAJ FUNKCIJE V8AlertModalContainer

// POČETAK FUNKCIJE AdminLiveSalesTracker
const AdminLiveSalesTracker = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && (user.email.toLowerCase() === "damnjanovicgoran7@gmail.com" || user.email.toLowerCase() === "aitoolsprosmart@gmail.com")) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    let isFirstKupci = true;
    let isFirstCrypto = true;
    let isFirstPaypal = true;

    const unsubKupci = onSnapshot(query(collection(db, "v8_kupci"), orderBy("vreme", "desc"), limit(1)), (snap) => {
      if (isFirstKupci) { isFirstKupci = false; return; }
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const d = change.doc.data();
          if (d.isPaid) {
             v8AlertModal.show({ 
               customerName: d.ime || d.klijent || 'B2B Klijent',
               email: d.email || 'Bez emaila',
               timestamp: new Date().toLocaleString('sr-RS'),
               amount: d.cenaPaketa ? Math.ceil(d.cenaPaketa/117) : (d.price || 0), 
               type: 'success',
               icon: 'b2b'
             });
          }
        }
      });
    });

    const unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), orderBy("requestDate", "desc"), limit(1)), (snap) => {
      if (isFirstCrypto) { isFirstCrypto = false; return; }
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const d = change.doc.data();
          v8AlertModal.show({ 
            customerName: `${d.firstName} ${d.lastName}`,
            email: d.clientEmail || 'Bez emaila',
            timestamp: new Date().toLocaleString('sr-RS'),
            amount: d.price || 0, 
            type: 'success',
            icon: 'crypto'
          });
        }
      });
    });

    const unsubPaypal = onSnapshot(query(collection(db, "v8_paypal_requests"), orderBy("requestDate", "desc"), limit(1)), (snap) => {
      if (isFirstPaypal) { isFirstPaypal = false; return; }
      snap.docChanges().forEach(change => {
        if (change.type === 'added') {
          const d = change.doc.data();
          const isCard = d.paymentSource && d.paymentSource.toLowerCase() !== 'paypal';
          v8AlertModal.show({ 
            customerName: `${d.firstName} ${d.lastName}`,
            email: d.clientEmail || 'Bez emaila',
            timestamp: new Date().toLocaleString('sr-RS'),
            amount: d.price || 0, 
            type: 'success',
            icon: isCard ? 'card' : 'paypal'
          });
        }
      });
    });

    return () => { unsubKupci(); unsubCrypto(); unsubPaypal(); };
  }, [isAdmin]);

  return null;
};
// KRAJ FUNKCIJE AdminLiveSalesTracker

// POČETAK FUNKCIJE V8PageWrapper
const V8PageWrapper = ({ children }) => {
  return (
    <>
      <ScanOverlay />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.8, duration: 0.4 }} className="w-full h-full origin-center relative z-10">
        {children}
      </motion.div>
    </>
  );
};
// KRAJ FUNKCIJE V8PageWrapper

// POČETAK FUNKCIJE FullScreenBoot
const FullScreenBoot = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isIgniting, setIsIgniting] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsIgniting(true); setTimeout(onComplete, 1200); return 100; }
        return p + Math.floor(Math.random() * 4) + 1; 
      });
    }, 40); 
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)" }} transition={{ duration: 0.8, ease: "easeInOut" }}>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div animate={{ scale: isIgniting ? 4 : [1, 1.2, 1], opacity: isIgniting ? 0 : [0.05, 0.15, 0.05] }} transition={{ duration: isIgniting ? 0.8 : 2, repeat: isIgniting ? 0 : Infinity }} className="w-96 h-96 bg-orange-600 rounded-full blur-[100px] transform-gpu" />
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
// KRAJ FUNKCIJE FullScreenBoot

// POČETAK FUNKCIJE SmartScrollButton
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
// KRAJ FUNKCIJE SmartScrollButton

// POČETAK FUNKCIJE AppContent
function AppContent({ appsData, refreshData }) {
  const IS_MAINTENANCE = false;

  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  const prevLocation = useRef(location.pathname);
  const entryTime = useRef(Date.now());
  const [authVersion, setAuthVersion] = useState(0); 

  const [notification, setNotification] = useState(null);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: '', zipLink: '' });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, name: '', price: '', zipLink: '' });

  const [isDesktop, setIsDesktop] = useState(true);

  // 🔥 LOGIKA ZA SKRIVANJE MENIJA KADA SE OTVORI PUBLIC QR MENI 🔥
  const isPublicMenuRoute = location.pathname.startsWith('/m/');

  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen(); 
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const openSecureCheckout = useCallback((productName, price, zipLink = '') => {
    playV8Sound('checkout'); 
    setCheckoutData({ isOpen: true, name: productName, price, zipLink });
  }, []);

  const handleOpenCheckout = useCallback((productName, price, zipLink = '') => {
    const userNow = auth.currentUser;
    if (!userNow) {
      setLoginRequiredData({ isOpen: true, name: productName, price, zipLink });
      return;
    }
    openSecureCheckout(productName, price, zipLink);
  }, [openSecureCheckout]);

  const handleCloseCheckout = useCallback(() => {
    setCheckoutData({ isOpen: false, name: '', price: '', zipLink: '' });
  }, []);

  const handleCloseLoginRequired = useCallback(() => {
    setLoginRequiredData({ isOpen: false, name: '', price: '', zipLink: '' });
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => { 
      setAuthVersion(v => v + 1); 
      if (user && typeof window !== 'undefined' && window.gtag) {
          window.gtag('config', 'G-86XYNNT6H8', { 'user_id': user.uid });
      }
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

       if (typeof window !== 'undefined' && window.gtag) {
           window.gtag('event', 'page_view', {
               page_path: location.pathname,
               page_location: window.location.href
           });
       }
    }
  }, [location.pathname]);

  useEffect(() => { 
      logAnalyticsEvent('page_view', { path: location.pathname }); 
      if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'page_view', {
              page_path: location.pathname,
              page_location: window.location.href
          });
      }
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e) => { 
        const target = e.target.closest('button, a'); 
        if (target) {
            logAnalyticsEvent('click', { 
                elementText: target.innerText || target.getAttribute('aria-label') || 'Icon', 
                path: window.location.pathname 
            }); 
        }
    };
    document.addEventListener('click', handleGlobalClick); return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleHomeClick = (e) => { if (location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.history.replaceState(null, '', '/'); } };

  if (IS_MAINTENANCE) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <Helmet>
          <title>System Maintenance | V8 Engine</title>
        </Helmet>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] transform-gpu" />
        </div>
        <div className="relative z-10 text-center px-6 flex flex-col items-center">
          <ShieldAlert className="w-24 h-24 text-amber-500 mb-8 animate-pulse drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 uppercase tracking-tighter mb-4 drop-shadow-sm">
            Server Maintenance
          </h1>
          <p className="text-lg md:text-2xl text-zinc-400 font-medium tracking-widest uppercase mb-10">
            We will be back today
          </p>
          <div className="inline-block border border-amber-500/30 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full shadow-[0_0_30px_rgba(245,158,11,0.15)]">
             <span className="text-amber-500 text-xs md:text-sm font-mono font-black uppercase tracking-widest flex items-center gap-3">
               <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
               Upgrading V8 Core Architecture
             </span>
          </div>
        </div>
      </div>
    );
  }

  // 🟢 HARDVERSKI OPTIMIZOVAN ROOT ELEMENT BEZ ZAKUCAVANJA SCROLLA 🟢
  return (
    <div key={authVersion} className="min-h-screen text-zinc-100 font-sans relative text-left">
      
      {/* ODVOJENA FIKSNA POZADINA ZA MAKSIMALAN FPS */}
      <div className="fixed inset-0 z-[-2] bg-[url('/v8-supercomputer-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none transform-gpu" />
      <div className="fixed inset-0 z-[-1] bg-[radial-gradient(circle_at_center,_rgba(5,5,5,0.95)_30%,_rgba(5,5,5,0.4)_100%)] pointer-events-none transform-gpu" />
      
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

      <div className="relative z-10 flex flex-col min-h-screen w-full pb-20 lg:pb-0">
        
        {isDesktop && <V8RadarCursor />}
        
        <V8ToastContainer />
        <V8AlertModalContainer />
        <AdminLiveSalesTracker />
        
        <NotificationListener setNotification={setNotification} />

        <AnimatePresence>
          {isBooting && <FullScreenBoot key="boot" onComplete={() => { setIsBooting(false); window.scrollTo(0,0); }} />}
        </AnimatePresence>
        
        {/* SAKRIVAMO GLAVNE KOMPONENTE SAJTA AKO SMO U QR MENIJU */}
        {!isPublicMenuRoute && <V8Navbar handleHomeClick={handleHomeClick} />}
        {!isPublicMenuRoute && <V8AdminLiveNotifier />}
        {!isPublicMenuRoute && <V8UnlockModal />}
        
        {/* SKIDAMO TOP PADDING KAKO BI MENI IŠAO DO KRAJA EKRANA GORE */}
        <div className={`flex-1 text-left ${isPublicMenuRoute ? '' : 'pt-20'}`}>
          <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
           <Routes location={location} key={location.pathname}>
              <Route path="/" element={<V8PageWrapper><HomePage apps={appsData} openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/v8-standard-16mp" element={<V8PageWrapper><V8Standard16MPWorkspace openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              
              <Route path="/master-33mp" element={<V8PageWrapper><V8MasterEngine33MP openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/master-45mp" element={<V8PageWrapper><V8MasterEngine45MP openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/master-60mp" element={<V8PageWrapper><V8MasterEngine60MP openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              
              <Route path="/extractor" element={<V8PageWrapper><V8JsonDeExtractorPage openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/v8-debranding-extractor" element={<V8PageWrapper><V8JsonDeBrendingExtractorPage openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/grid-system" element={<V8PageWrapper><V8GridSystem openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              
              <Route path="/prompt-factory" element={<V8PageWrapper><V8NeuralForge openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/neural-forge" element={<V8PageWrapper><V8NeuralForge openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/raw-reality" element={<V8PageWrapper><V8RawRealityEngine /></V8PageWrapper>} />

              <Route path="/saas-protocol" element={<V8PageWrapper><SaaSProtocolPage openCheckout={handleOpenCheckout} /></V8PageWrapper>} />
              <Route path="/standard-mocup" element={<V8PageWrapper><StandardMocup /></V8PageWrapper>} />
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
              <Route path="/stock-2" element={<V8PageWrapper><V8Stock2 /></V8PageWrapper>} /> 
              
              <Route path="/showroom" element={<V8PageWrapper><V8Showroom /></V8PageWrapper>} />
              <Route path="/terms" element={<V8PageWrapper><V8Terms /></V8PageWrapper>} />
              <Route path="/privacy" element={<V8PageWrapper><V8Privacy /></V8PageWrapper>} />
              <Route path="/refund" element={<V8PageWrapper><V8Refund /></V8PageWrapper>} />
              <Route path="/media" element={<V8PageWrapper><V8MediaViewer /></V8PageWrapper>} />

              <Route path="/portfolio" element={<V8PageWrapper><Portfolio /></V8PageWrapper>} />
              
              {/* 🔥 NOVE RUTE ZA QR MENI IZ FOLDERA qrcode 🔥 */}
              <Route path="/premium-menu" element={<V8PageWrapper><V8PremiumTestMenu /></V8PageWrapper>} />
              <Route path="/m/:menuId" element={<PublicMenuTestQRMenu />} />
            </Routes>
          </AnimatePresence>
        </div>
        
        {/* SAKRIVAMO DONJE KOMPONENTE SAJTA AKO SMO U QR MENIJU */}
        {!isPublicMenuRoute && <SmartScrollButton />}
        {!isPublicMenuRoute && <V8ContactWidget />}
        
        {!isPublicMenuRoute && isDesktop && (
          <div id="v8-counter-container">
            <VisitorCounter />
          </div>
        )}

        {!isPublicMenuRoute && <V8Footer />}

        <LoginRequiredModal
          isOpen={loginRequiredData.isOpen}
          onClose={handleCloseLoginRequired}
          packageName={loginRequiredData.name}
          price={loginRequiredData.price}
          onLoginSuccess={() => {
            openSecureCheckout(loginRequiredData.name, loginRequiredData.price, loginRequiredData.zipLink);
          }}
        />

        <AnimatePresence>
          {checkoutData.isOpen && (
            <V8SecureCheckout 
              isOpen={checkoutData.isOpen}
              productName={checkoutData.name} 
              price={checkoutData.price} 
              zipLink={checkoutData.zipLink}
              onClose={handleCloseCheckout} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {notification && (
            <NotificationModal data={notification} onClose={() => setNotification(null)} />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
// KRAJ FUNKCIJE AppContent

// POČETAK FUNKCIJE App
export default function App() {
  const [appsData, setAppsData] = useState([]);

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

  useEffect(() => { refreshData(); }, [refreshData]);

  return (
    <HelmetProvider>
      <Router>
        <AppContent appsData={appsData} refreshData={refreshData} />
      </Router>
    </HelmetProvider>
  );
}
// KRAJ FUNKCIJE App
// KRAJ FAJLA: App.jsx