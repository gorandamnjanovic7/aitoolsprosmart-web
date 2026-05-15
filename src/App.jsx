import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ShieldAlert, CheckCircle, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 FIREBASE 🔥
import { db, auth } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, query, orderBy, getDocs } from 'firebase/firestore';

// 🔥 DATA & COMPONENTS 🔥
import * as data from './data';
import './App.css'; 

// PAGES
import HomePage from './HomePage';
import V8Enhancer10x from './V8Enhancer10x';
import V8Promo10xPage from './V8Promo10xPage'; 
import V8ContactWidget from './V8ContactWidget';
import V8StockBerza from './V8StockBerza';
import V8Showroom from './V8Showroom'; 
import VisitorCounter from './VisitorCounter';
import SingleProductPage from './SingleProductPage';
import V8MediaViewer from './V8MediaViewer';
import V8Terms from './V8Terms';
import V8Privacy from './V8Privacy';
import V8Refund from './V8Refund';
import TrezorPage from './TrezorPage'; 
import V8DatabaseAdmin from "./V8DatabaseAdmin";
import V8AdminDashboard from "./V8AdminDashboard";
import V8OptimizerPage from './V8OptimizerPage'; 

// UI
import V8RadarCursor from './V8RadarCursor';
import V8Navbar from './V8Navbar';
import V8Footer from './V8Footer';

// ANALYTICS & TOAST LOGIKA
export const logAnalyticsEvent = async (type, details) => {
    try { await addDoc(collection(db, "analytics"), { type, ...details, timestamp: Date.now() }); } catch (err) {}
};

export const v8Toast = {
  listeners: [],
  success: (msg) => v8Toast.listeners.forEach(l => l({ type: 'success', msg, id: Date.now() })),
  error: (msg) => v8Toast.listeners.forEach(l => l({ type: 'error', msg, id: Date.now() })),
  subscribe: (l) => { v8Toast.listeners.push(l); return () => v8Toast.listeners = v8Toast.listeners.filter(cb => cb !== l); }
};

const V8PageWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
    {children}
  </motion.div>
);

const V8ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => v8Toast.subscribe((t) => { 
    setToasts(p => [...p, t]); 
    setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500); 
  }), []);
  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div key={t.id} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className={`p-4 rounded-xl shadow-2xl border flex items-center gap-3 backdrop-blur-xl ${t.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : 'bg-red-900/40 border-red-500/50 text-red-100'}`}>
            {t.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest">{t.msg}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const FullScreenBoot = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => { 
    const interval = setInterval(() => { 
      setProgress(p => { 
        if (p >= 100) { clearInterval(interval); setTimeout(onComplete, 800); return 100; } 
        return p + 2; 
      }); 
    }, 30); 
    return () => clearInterval(interval); 
  }, [onComplete]);
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center flex-col">
      <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-orange-500 text-[10px] font-black mt-4 uppercase tracking-[0.3em]">V8 SYSTEM BOOTING... {progress}%</span>
    </div>
  );
};

// --- APP CONTENT: Mozak sajta koji upravlja stanjem logovanja ---
function AppContent({ appsData, refreshData }) {
  const [isBooting, setIsBooting] = useState(true);
  const location = useLocation();
  const [isVIPLoggedIn, setIsVIPLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authVersion, setAuthVersion] = useState(0); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
        if(user) {
          const email = user.email ? user.email.toLowerCase() : "";
          const isMe = email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com";
          
          if (isMe) {
            setIsAdmin(true);
            setIsVIPLoggedIn(true);
          } else {
            setIsAdmin(false); 
            try {
              const docSnap = await getDoc(doc(db, "vip_users", email));
              setIsVIPLoggedIn(docSnap.exists());
            } catch(e) { setIsVIPLoggedIn(false); }
          }
        } else {
          setIsVIPLoggedIn(false);
          setIsAdmin(false);
        }
        setAuthVersion(v => v + 1); // 🔥 FORCE-SYNC KLJUČ 🔥
    }); 
    return () => unsub();
  }, []);

  const handleHomeClick = (e) => { 
    if (location.pathname === '/') { 
      e.preventDefault(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
    } 
  };

  return (
    <div key={authVersion} className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col font-sans relative text-left">
      <V8RadarCursor />
      <V8ToastContainer />
      
      <AnimatePresence>
        {isBooting && <FullScreenBoot key="boot" onComplete={() => setIsBooting(false)} />}
      </AnimatePresence>
      
      <V8Navbar isVIPLoggedIn={isVIPLoggedIn} isAdmin={isAdmin} handleHomeClick={handleHomeClick} />
      
      <div className="flex-1 text-left pt-20">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<V8PageWrapper><HomePage apps={appsData} /></V8PageWrapper>} />
            <Route path="/optimizer" element={<V8PageWrapper><V8OptimizerPage /></V8PageWrapper>} />
            <Route path="/enxance" element={<V8PageWrapper><V8Enhancer10x /></V8PageWrapper>} />
            <Route path="/promo" element={<V8PageWrapper><V8Promo10xPage /></V8PageWrapper>} />
            <Route path="/app/:id" element={<V8PageWrapper><SingleProductPage apps={appsData} /></V8PageWrapper>} />
            <Route path="/trezor" element={<V8PageWrapper><TrezorPage apps={appsData} /></V8PageWrapper>} />
            <Route path="/admin" element={<V8PageWrapper><V8DatabaseAdmin apps={appsData} refreshData={refreshData} /></V8PageWrapper>} />
            <Route path="/dashboard" element={<V8PageWrapper><V8AdminDashboard /></V8PageWrapper>} />
            <Route path="/stock" element={<V8PageWrapper><V8StockBerza /></V8PageWrapper>} />
            <Route path="/showroom" element={<V8PageWrapper><V8Showroom /></V8PageWrapper>} />
            <Route path="/terms" element={<V8PageWrapper><V8Terms /></V8PageWrapper>} />
            <Route path="/privacy" element={<V8PageWrapper><V8Privacy /></V8PageWrapper>} />
            <Route path="/refund" element={<V8PageWrapper><V8Refund /></V8PageWrapper>} />
            <Route path="/media" element={<V8PageWrapper><V8MediaViewer /></V8PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </div>
      
      <V8ContactWidget />
      <V8Footer />
    </div>
  );
}

// --- GLAVNI EXPORT ---
export default function App() {
  const [appsData, setAppsData] = useState([]);

  const refreshData = useCallback(async () => {
    try {
      const q = query(collection(db, "v8_products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setAppsData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) { setAppsData([]); }
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