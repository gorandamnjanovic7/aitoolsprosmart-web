// POČETAK FAJLA: SaaSProtocolPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, X, Upload, Trash2, Download, Eye, Sparkles, Loader2, Monitor, Tablet, Smartphone, Layers, LayoutGrid, Minus, Maximize2, Zap, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; 
import { Helmet } from 'react-helmet-async';
import html2canvas from 'html2canvas'; 

// 🔥 VRAĆENE TVOJE ORIGINALNE KOORDINATE (VIŠE SE NE DIRAJU!) 🔥
const SCENE_PRESETS = {
  "magnific_a-moody-lowkey-tech-scene_2994482255.png": {
    laptop: { top: 28.5, left: 19.4, width: 27.1, height: 32.9, transX: 0, transY: 0, rotX: 1.5, rotY: 4, rotZ: 0, skewX: -0.5, skewY: 1, perspective: 1200, originX: 50, originY: 100, scaleX: 1, scaleY: 1, borderRadius: 2 },
    ipad: { top: 33.6, left: 51.9, width: 24.8, height: 33.2, transX: 0, transY: 0, rotX: 26.4, rotY: -22.1, rotZ: 0.4, skewX: -11.2, skewY: 13.3, perspective: 2930, originX: 100, originY: 0, scaleX: 1, scaleY: 1.08, borderRadius: 6 },
    phone: { top: 41.7, left: 80.2, width: 6.6, height: 28.4, transX: 21, transY: 1, rotX: 4.6, rotY: -18.6, rotZ: -0.7, skewX: -8.8, skewY: 14.3, perspective: 1250, originX: 0, originY: 0, scaleX: 1, scaleY: 1, borderRadius: 12 }
  }
};

const DEFAULT_CALIBS = {
  laptop: { top: 30, left: 20, width: 25, height: 30, transX: 0, transY: 0, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0, perspective: 2000, originX: 50, originY: 50, scaleX: 1, scaleY: 1, borderRadius: 2 },
  ipad: { top: 35, left: 50, width: 20, height: 25, transX: 0, transY: 0, rotX: 0, rotY: 0, rotZ: 0, skewX: 0, skewY: 0, perspective: 2000, originX: 50, originY: 50, scaleX: 1, scaleY: 1, borderRadius: 6 },
  phone: { top: 41.7, left: 80.2, width: 6.6, height: 28.4, transX: 21, transY: 1, rotX: 4.6, rotY: -18.6, rotZ: -0.7, skewX: -8.8, skewY: 14.3, perspective: 1250, originX: 0, originY: 0, scaleX: 1, scaleY: 1, borderRadius: 12 }
};

// Podaci za nove kartice sa tekstovima i bedževima
const MOCKUP_CARDS = [
  { 
    id: 1, 
    image: "/bilbord_1.webp", 
    alt: "Billboard Mockup",
    title: "Mega Billboard Environments",
    desc: "Showcase your brand on giant urban digital displays and high-traffic metropolitan setups. Perfect for massive outdoor advertising campaigns."
  },
  { 
    id: 2, 
    image: "/wall1_2.webp", 
    alt: "Wall Mockup",
    title: "Corporate Wall Presentations",
    desc: "Luxury office interiors and minimalist architectural textures for premium B2B branding. Elevate your logo on high-end reception walls."
  },
  { 
    id: 3, 
    image: "/glass_3.webp", 
    alt: "Executive Plaque Mockup",
    title: "Executive Glass Plaques",
    desc: "Ultra-realistic glass and metal signage mockups for enterprise lobbies and executive suites. Crafted for absolute corporate prestige.",
    isNew: true,
    isHot: true
  }
];

// POČETAK FUNKCIJE: SaaSProtocolPage
export default function SaaSProtocolPage({ openCheckout, isAdmin }) {
  // POČETAK INICIJALIZACIJE STATE-A I REFOVA
  const navigate = useNavigate(); 
  const mockupRef = useRef(null); 
  
  // 🔥 PAMETNA DETEKCIJA ADMINA (Zamenjena striktna detekcija da bi radilo lokalno) 🔥
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return isAdmin === true || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || localStorage.getItem('v8_goran_mode') === 'true'));
  });

  useEffect(() => {
    if (isAdmin === true) {
      setIsAdminMode(true);
    }
  }, [isAdmin]);

  const toggleAdminMode = () => {
    const newState = !isAdminMode;
    setIsAdminMode(newState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('v8_goran_mode', newState);
    }
  };

  const [isCalibratorMinimized, setIsCalibratorMinimized] = useState(false);

  const [activeBg, setActiveBg] = useState("magnific_a-moody-lowkey-tech-scene_2994482255.png");
  const [calibs, setCalibs] = useState(SCENE_PRESETS["magnific_a-moody-lowkey-tech-scene_2994482255.png"]);
  const [activeDeviceTab, setActiveDeviceTab] = useState('phone'); 

  const [laptopPreview, setLaptopPreview] = useState(null);
  const [ipadPreview, setIpadPreview] = useState(null);
  const [phonePreview, setPhonePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 

  const [selectedImage, setSelectedImage] = useState(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragDevice, setDragDevice] = useState(null); 
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // KRAJ INICIJALIZACIJE STATE-A I REFOVA

  // POČETAK FUNKCIJE: handleDragStart
  const handleDragStart = (e, device) => {
    if (!isAdminMode) return; 
    if (e.target.closest('button') || e.target.closest('label')) return;
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragDevice(device);
    setActiveDeviceTab(device); 
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  // KRAJ FUNKCIJE: handleDragStart

  // POČETAK FUNKCIJE: handleDragMove
  const handleDragMove = (e) => {
    if (!isDragging || !isAdminMode || !dragDevice) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const speed = 0.08; 
    
    setCalibs(prev => ({ 
      ...prev, 
      [dragDevice]: {
        ...prev[dragDevice],
        top: prev[dragDevice].top + dy * speed, 
        left: prev[dragDevice].left + dx * speed 
      }
    }));
    
    setDragStart({ x: e.clientX, y: e.clientY });
  };
  // KRAJ FUNKCIJE: handleDragMove

  // POČETAK FUNKCIJE: handleDragEnd
  const handleDragEnd = (e) => {
    if (!isAdminMode) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    setDragDevice(null);
  };
  // KRAJ FUNKCIJE: handleDragEnd

  // POČETAK FUNKCIJE: handleUiUpload
  const handleUiUpload = (e, device) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (device === 'laptop') setLaptopPreview(imageUrl);
      if (device === 'ipad') setIpadPreview(imageUrl);
      if (device === 'phone') setPhonePreview(imageUrl);
    }
  };
  // KRAJ FUNKCIJE: handleUiUpload

  // POČETAK FUNKCIJE: changeScene
  const changeScene = (imageName) => {
    setActiveBg(imageName);
    if (SCENE_PRESETS[imageName]) {
      setCalibs(SCENE_PRESETS[imageName]);
    } else {
      setCalibs(DEFAULT_CALIBS);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  // KRAJ FUNKCIJE: changeScene

  // POČETAK FUNKCIJE: updateCalib
  const updateCalib = (key, value) => {
    setCalibs(prev => ({
      ...prev,
      [activeDeviceTab]: {
        ...prev[activeDeviceTab],
        [key]: value
      }
    }));
  };
  // KRAJ FUNKCIJE: updateCalib

  // POČETAK FUNKCIJE: handlePurchaseAndDownload
  // 🔥 SECURITY CHECKOUT LOGIKA 🔥
  const handlePurchaseAndDownload = async () => {
    setIsProcessing(true);
    let paymentSuccess = false;

    try {
      if (openCheckout) {
        const result = await openCheckout(20.00, `V10 Premium Mockup: ${activeBg}`);
        paymentSuccess = result !== false; 
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000)); 
        paymentSuccess = true;
      }

      if (!paymentSuccess) {
        throw new Error("Payment declined by processor");
      }

      if (mockupRef.current) {
        const canvas = await html2canvas(mockupRef.current, {
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#000000',
        });

        const image = canvas.toDataURL("image/png", 1.0);
        const downloadLink = document.createElement('a');
        downloadLink.href = image;
        downloadLink.download = `V10_Mockup_Export_${Date.now()}.png`; 
        downloadLink.click();
      }
      
    } catch (error) {
      console.error("Payment failure:", error);
      alert("Payment authorization failed. Your transaction did not pass. Please verify your payment details and try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  // KRAJ FUNKCIJE: handlePurchaseAndDownload

  const currentDev = calibs[activeDeviceTab] || DEFAULT_CALIBS[activeDeviceTab]; 

  // 🔥 DODATE TVOJE SLIKE U DRUGI RED 🔥
  const galleryImages = [
    "magnific_premium-tech-setup-on-a-p_2994483605.png",
    "magnific_a-highly-detailed-photore_2994474179.png", 
    "/red_2_mocup_1.jpeg",                               
    "/red_3_mocup_1.jpeg",
    "/14.jpeg",
    "/6.jpeg",
    "/12.jpeg",
    "/16.png"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-amber-500 selection:text-black">
      
      {/* INLINE STILOVI ZA ANIMACIJE (DODATE MUNJA I PULSIRANJE SLIKE) */}
      <style>{`
        @keyframes geminiGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gemini-border-animation {
          background: linear-gradient(90deg, #4285f4, #9b51e0, #e94235, #f4b400, #4285f4);
          background-size: 300% 300%;
          animation: geminiGlow 6s ease infinite;
        }

        /* Pulsiranje slika koje "bodu oči" */
        @keyframes imgPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.15); }
        }
        .animate-img-pulse {
          animation: imgPulse 4s ease-in-out infinite;
        }

        /* Žuta munja koja naglo blesne */
        @keyframes zapFlash {
          0%, 85%, 100% { opacity: 0; transform: scale(0.5); }
          88% { opacity: 1; transform: scale(1.3) rotate(15deg); filter: drop-shadow(0 0 20px #f59e0b); }
          91% { opacity: 0; transform: scale(1) rotate(0deg); }
          94% { opacity: 1; transform: scale(1.5) rotate(-10deg); filter: drop-shadow(0 0 30px #f59e0b); }
          97% { opacity: 0; transform: scale(0.8); }
        }
        .animate-zap-flash {
          animation: zapFlash 7s infinite;
        }
      `}</style>

      {/* 🔥 TAJNA AKTIVACIJA ADMINA (DODATA NAZAD DA BI MOGAO RUČNO DA PALIŠ/GASIŠ) 🔥 */}
      <div className="fixed bottom-4 left-4 z-[99999]">
        <button 
          onClick={toggleAdminMode} 
          className={`px-3 py-1.5 rounded-lg text-[10px] uppercase font-mono tracking-widest transition-all border transform-gpu ${isAdminMode ? 'bg-amber-500 text-black border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-zinc-900/80 hover:bg-amber-500 hover:text-black border-white/10 text-zinc-500'}`}
        >
          {isAdminMode ? "🔒 Zatvori V8 Panel" : "🛠️ Goran Mode"}
        </button>
      </div>

      {/* 🔥 OMNI KONTROLNI V8 PANEL (PRIKAZUJE SE SAMO KAD JE UPALJEN ADMIN MODE) 🔥 */}
      {isAdminMode && (
        <div className="fixed top-24 right-6 bg-[#0a0a0a]/95 backdrop-blur-xl border-2 border-amber-500 p-5 rounded-2xl z-[999999] text-xs text-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)] w-80 font-mono flex flex-col max-h-[80vh] transition-all duration-300">
          
          {/* HEADER PANELA SA DUGMETOM ZA MINIMIZACIJU */}
          <div className={`flex justify-between items-center ${isCalibratorMinimized ? '' : 'mb-4 border-b border-amber-500/20 pb-3'}`}>
            <h3 className="font-black text-white text-sm uppercase flex items-center gap-2 m-0">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              V8 Master Calibrator
            </h3>
            <button 
              onClick={() => setIsCalibratorMinimized(!isCalibratorMinimized)}
              className="text-zinc-500 hover:text-amber-500 bg-black/50 p-1.5 rounded-md border border-white/10 hover:border-amber-500/50 transition-all"
              title={isCalibratorMinimized ? "Maksimiziraj" : "Minimiziraj"}
            >
              {isCalibratorMinimized ? <Maximize2 size={14} /> : <Minus size={14} />}
            </button>
          </div>

          {/* SADRŽAJ PANELA (PRIKAZUJE SE SAMO KAD NIJE MINIMIZIRAN) */}
          {!isCalibratorMinimized && (
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
              <div className="flex gap-1 mb-4 bg-black/50 p-1 rounded-lg border border-white/10">
                <button onClick={() => setActiveDeviceTab('laptop')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold transition-all ${activeDeviceTab === 'laptop' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-amber-500'}`}>
                  <Monitor size={12}/> Laptop
                </button>
                <button onClick={() => setActiveDeviceTab('ipad')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold transition-all ${activeDeviceTab === 'ipad' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-amber-500'}`}>
                  <Tablet size={12}/> iPad
                </button>
                <button onClick={() => setActiveDeviceTab('phone')} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[9px] uppercase tracking-wider font-bold transition-all ${activeDeviceTab === 'phone' ? 'bg-amber-500 text-black' : 'text-zinc-500 hover:text-amber-500'}`}>
                  <Smartphone size={12}/> Phone
                </button>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block mb-1 text-[10px] text-white">Gornja Ivica (Top): {currentDev.top.toFixed(1)}%</label>
                  <input type="range" min="0" max="100" step="0.1" value={currentDev.top} onChange={(e) => updateCalib('top', parseFloat(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] text-white">Leva Ivica (Left): {currentDev.left.toFixed(1)}%</label>
                  <input type="range" min="0" max="100" step="0.1" value={currentDev.left} onChange={(e) => updateCalib('left', parseFloat(e.target.value))} className="w-full accent-amber-500" />
                </div>
                
                <div className="h-px w-full bg-amber-500/20 my-2"></div>

                <div>
                  <label className="block mb-1 text-[10px] text-green-400">Širina (Pomiče DESNU ivicu): {currentDev.width.toFixed(1)}%</label>
                  <input type="range" min="1" max="60" step="0.1" value={currentDev.width} onChange={(e) => updateCalib('width', parseFloat(e.target.value))} className="w-full accent-green-500" />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] text-green-400">Visina (Pomiče DONJU ivicu): {currentDev.height.toFixed(1)}%</label>
                  <input type="range" min="1" max="60" step="0.1" value={currentDev.height} onChange={(e) => updateCalib('height', parseFloat(e.target.value))} className="w-full accent-green-500" />
                </div>
                
                <div className="h-px w-full bg-amber-500/20 my-2"></div>

                <div><label className="block mb-1 text-[10px] text-purple-400">Rotate Z (Levo/Desno): {currentDev.rotZ}deg</label><input type="range" min="-45" max="45" step="0.1" value={currentDev.rotZ} onChange={(e) => updateCalib('rotZ', parseFloat(e.target.value))} className="w-full accent-purple-500" /></div>
                <div><label className="block mb-1 text-[10px] text-amber-300">Rotate Y (Perspektiva zida): {currentDev.rotY}deg</label><input type="range" min="-45" max="45" step="0.1" value={currentDev.rotY} onChange={(e) => updateCalib('rotY', parseFloat(e.target.value))} className="w-full accent-amber-400" /></div>
                <div><label className="block mb-1 text-[10px] text-amber-300">Rotate X (Naginjanje ekrana): {currentDev.rotX}deg</label><input type="range" min="-45" max="45" step="0.1" value={currentDev.rotX} onChange={(e) => updateCalib('rotX', parseFloat(e.target.value))} className="w-full accent-amber-400" /></div>
                
                <div className="bg-amber-500/10 p-2 rounded border border-amber-500/30">
                  <label className="block mb-1 text-[10px] text-amber-300 font-bold">Skew X (Uvlači gornju ivicu!): {currentDev.skewX}deg</label>
                  <input type="range" min="-30" max="30" step="0.1" value={currentDev.skewX} onChange={(e) => updateCalib('skewX', parseFloat(e.target.value))} className="w-full accent-amber-400" />
                </div>
                
                <div><label className="block mb-1 text-[10px] text-amber-300">Skew Y: {currentDev.skewY}deg</label><input type="range" min="-30" max="30" step="0.1" value={currentDev.skewY} onChange={(e) => updateCalib('skewY', parseFloat(e.target.value))} className="w-full accent-amber-400" /></div>
                
                <div className="h-px w-full bg-amber-500/20 my-2"></div>

                <div className="bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                  <label className="block mb-1 text-[10px] text-emerald-400 font-bold animate-pulse">Zaobljenje (Border Radius): {currentDev.borderRadius}px</label>
                  <input type="range" min="0" max="50" step="1" value={currentDev.borderRadius} onChange={(e) => updateCalib('borderRadius', parseFloat(e.target.value))} className="w-full accent-emerald-500" />
                </div>

                <div className="h-px w-full bg-amber-500/20 my-2"></div>

                <div><label className="block mb-1 text-[10px] text-cyan-400">Trans X: {currentDev.transX}px</label><input type="range" min="-100" max="100" step="1" value={currentDev.transX} onChange={(e) => updateCalib('transX', parseFloat(e.target.value))} className="w-full accent-cyan-500" /></div>
                <div><label className="block mb-1 text-[10px] text-cyan-400">Trans Y: {currentDev.transY}px</label><input type="range" min="-100" max="100" step="1" value={currentDev.transY} onChange={(e) => updateCalib('transY', parseFloat(e.target.value))} className="w-full accent-cyan-500" /></div>
                <div><label className="block mb-1 text-[10px] text-blue-400">Perspective: {currentDev.perspective}px</label><input type="range" min="100" max="4000" step="10" value={currentDev.perspective} onChange={(e) => updateCalib('perspective', parseFloat(e.target.value))} className="w-full accent-blue-500" /></div>
              </div>
              
              <div className="mt-4 p-3 bg-black rounded-lg border border-amber-500/30 text-[10px] break-all select-all custom-scrollbar overflow-x-hidden overflow-y-auto max-h-24">
                <div className="text-white font-bold mb-1">/* Copy into SCENE_PRESETS: */</div>
                "{activeBg}": {JSON.stringify(calibs)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FULL SCREEN IMAGE MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 transition-all duration-300 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="fixed top-10 right-6 md:top-20 md:right-20 text-amber-500 hover:text-black bg-black/60 backdrop-blur-md hover:bg-amber-500 border-2 border-amber-500/50 p-4 rounded-full transition-all z-[1000] cursor-pointer shadow-[0_0_30px_rgba(245,158,11,0.5)]"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>

          <div className="relative max-w-[1920px] w-full max-h-[95vh] flex items-center justify-center">
            <img 
              src={selectedImage} 
              alt="Fullscreen Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_80px_rgba(245,158,11,0.15)] cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <Helmet>
        <title>SaaS Visual Protocol | 150MP Enterprise Mockups</title>
        <meta name="description" content="Wrap your software in 150MP physical reality. Mathematical cinematic environments engineered for your UI and B2B SaaS platform." />
      </Helmet>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-12 px-6 text-center overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 rounded-full text-xs font-black tracking-widest text-amber-500 mb-6 uppercase shadow-[0_0_15px_rgba(245,158,11,0.1)]">
            <Sparkles className="w-3 h-3 animate-spin" /> Interactive UI Mockup Laboratory
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4">
            Test Your Design In <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">150MP Reality</span>
          </h1>
          
          {/* 🔥 ORIGINALNI TEKST NA SRPSKOM 🔥 */}
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-light">
            Dizajneri, ubacite vaš PNG/JPG skrinšot direktno na ekrane uređaja. Ako vam se svidi rezultat, aktivirajte Secure Checkout od 20$ i sistem će automatski generisati premium render visoke rezolucije za vaš portfolio.
          </p>

          <div className="mt-8 mb-4 flex justify-center">
            <Link 
              to="/standard-mocup"
              onClick={() => localStorage.setItem('v8_active_mocup_tab', 'ultra2')}
              className="inline-flex items-center justify-center bg-amber-500 text-black font-black uppercase tracking-widest text-xs px-8 py-3.5 rounded-xl hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              PREMIUM DEVICES <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* MOCKUP RADNI PROSTOR */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-6 border border-white/5 bg-[#0d0d0d] rounded-2xl overflow-hidden shadow-2xl group">
          
          {/* HUD PANEL */}
          <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap justify-between items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-lg">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-3 bg-amber-500 rounded-full animate-ping"></span>
              <span className="text-zinc-200 text-xs font-bold uppercase tracking-wider font-mono">
                Live Preview Model Active
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              {(laptopPreview && ipadPreview && phonePreview) && (
                <button 
                  onClick={handlePurchaseAndDownload}
                  disabled={isProcessing}
                  className={`bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center gap-2 ${isProcessing ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {isProcessing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Authorizing Payment...</>
                  ) : (
                    <><Download className="w-4 h-4" /> Download Commercial Asset ($20)</>
                  )}
                </button>
              )}
              <button 
                onClick={() => navigate('/standard-mocup')}
                className="bg-zinc-900 border border-white/10 hover:border-amber-500/50 hover:text-white text-zinc-400 font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all flex items-center gap-2"
              >
                <Eye className="w-4 h-4" /> Premium Cinematic Video
              </button>
            </div>
          </div>

          {/* 🔥 MOUNT RENDER MATRICA 🔥 */}
          <div ref={mockupRef} className="relative w-full h-auto bg-black">
            <img 
              src={activeBg} 
              alt="Active Premium Tech Environment" 
              className="w-full h-auto object-cover relative z-0 pointer-events-none select-none"
              crossOrigin="anonymous" 
            />
            
            {/* 🔥 LAPTOP LIVE SLOT 🔥 */}
            <div 
              className={`absolute z-10 overflow-hidden flex items-center justify-center group/screen ${laptopPreview ? 'shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] bg-black' : 'border border-transparent hover:border-dashed hover:border-amber-500/40 hover:bg-amber-500/10 hover:backdrop-blur-[2px] transition-all duration-300'} ${isDragging && dragDevice === 'laptop' ? '!transition-none' : ''}`}
              onPointerDown={(e) => handleDragStart(e, 'laptop')}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              style={{ 
                top: `${calibs.laptop.top}%`, 
                left: `${calibs.laptop.left}%`, 
                width: `${calibs.laptop.width}%`, 
                height: `${calibs.laptop.height}%`,
                borderRadius: `${calibs.laptop.borderRadius || 0}px`,
                transformOrigin: `${calibs.laptop.originX}% ${calibs.laptop.originY}%`,
                transform: `perspective(${calibs.laptop.perspective}px) translateX(${calibs.laptop.transX}px) translateY(${calibs.laptop.transY}px) rotateX(${calibs.laptop.rotX}deg) rotateY(${calibs.laptop.rotY}deg) rotateZ(${calibs.laptop.rotZ}deg) skewY(${calibs.laptop.skewY}deg) skewX(${calibs.laptop.skewX}deg) scaleX(${calibs.laptop.scaleX}) scaleY(${calibs.laptop.scaleY})`,
                cursor: isAdminMode ? (isDragging && dragDevice === 'laptop' ? 'grabbing' : 'grab') : (laptopPreview ? 'default' : 'pointer')
              }}
            >
              {laptopPreview ? (
                <>
                  <img src={laptopPreview} alt="Laptop UI" crossOrigin="anonymous" className="w-full h-full object-fill pointer-events-none select-none relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10 pointer-events-none z-20"></div>
                  <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setLaptopPreview(null); }} data-html2canvas-ignore="true" className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={14}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/screen:opacity-100 transition-all text-white hover:text-amber-500 p-2">
                  <span className="text-xl md:text-3xl font-black mb-1 opacity-50">1</span>
                  <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-center text-amber-500/80">TEST YOUR FIGMA DESIGN</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'laptop')} accept="image/*" />
                </label>
              )}
            </div>

            {/* 🔥 IPAD LIVE SLOT 🔥 */}
            <div 
              className={`absolute z-20 overflow-hidden flex items-center justify-center group/screen ${ipadPreview ? 'shadow-[inset_0_0_20px_rgba(0,0,0,0.9)] bg-black' : 'border border-transparent hover:border-dashed hover:border-amber-500/40 hover:bg-amber-500/10 hover:backdrop-blur-[2px] transition-all duration-300'} ${isDragging && dragDevice === 'ipad' ? '!transition-none' : ''}`}
              onPointerDown={(e) => handleDragStart(e, 'ipad')}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              style={{ 
                top: `${calibs.ipad.top}%`, 
                left: `${calibs.ipad.left}%`, 
                width: `${calibs.ipad.width}%`, 
                height: `${calibs.ipad.height}%`,
                borderRadius: `${calibs.ipad.borderRadius || 0}px`,
                transformOrigin: `${calibs.ipad.originX}% ${calibs.ipad.originY}%`,
                transform: `perspective(${calibs.ipad.perspective}px) translateX(${calibs.ipad.transX}px) translateY(${calibs.ipad.transY}px) rotateX(${calibs.ipad.rotX}deg) rotateY(${calibs.ipad.rotY}deg) rotateZ(${calibs.ipad.rotZ}deg) skewY(${calibs.ipad.skewY}deg) skewX(${calibs.ipad.skewX}deg) scaleX(${calibs.ipad.scaleX}) scaleY(${calibs.ipad.scaleY})`,
                cursor: isAdminMode ? (isDragging && dragDevice === 'ipad' ? 'grabbing' : 'grab') : (ipadPreview ? 'default' : 'pointer')
              }}
            >
              {ipadPreview ? (
                <>
                  <img src={ipadPreview} alt="iPad UI" crossOrigin="anonymous" className="w-full h-full object-fill pointer-events-none select-none relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none z-20"></div>
                  <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setIpadPreview(null); }} data-html2canvas-ignore="true" className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-2 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={14}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/screen:opacity-100 transition-all text-white hover:text-amber-500 p-2">
                  <span className="text-xl md:text-3xl font-black mb-1 opacity-50">2</span>
                  <span className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-center text-amber-500/80">TEST YOUR FIGMA DESIGN</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'ipad')} accept="image/*" />
                </label>
              )}
            </div>

            {/* 🔥 PHONE LIVE SLOT 🔥 */}
            <div 
              className={`absolute z-30 overflow-hidden flex items-center justify-center group/screen ${phonePreview ? 'shadow-[inset_0_0_10px_rgba(0,0,0,0.9)] bg-black' : 'border border-transparent hover:border-dashed hover:border-amber-500/40 hover:bg-amber-500/10 hover:backdrop-blur-[2px] transition-all duration-300'} ${isDragging && dragDevice === 'phone' ? '!transition-none' : ''}`}
              onPointerDown={(e) => handleDragStart(e, 'phone')}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              style={{ 
                top: `${calibs.phone.top}%`, 
                left: `${calibs.phone.left}%`, 
                width: `${calibs.phone.width}%`, 
                height: `${calibs.phone.height}%`,
                borderRadius: `${calibs.phone.borderRadius || 0}px`,
                transformOrigin: `${calibs.phone.originX}% ${calibs.phone.originY}%`,
                transform: `perspective(${calibs.phone.perspective}px) translateX(${calibs.phone.transX}px) translateY(${calibs.phone.transY}px) rotateX(${calibs.phone.rotX}deg) rotateY(${calibs.phone.rotY}deg) rotateZ(${calibs.phone.rotZ}deg) skewY(${calibs.phone.skewY}deg) skewX(${calibs.phone.skewX}deg) scaleX(${calibs.phone.scaleX}) scaleY(${calibs.phone.scaleY})`,
                cursor: isAdminMode ? (isDragging && dragDevice === 'phone' ? 'grabbing' : 'grab') : (phonePreview ? 'default' : 'pointer')
              }}
            >
              {phonePreview ? (
                <>
                  <img src={phonePreview} alt="Phone UI" crossOrigin="anonymous" className="w-full h-full object-fill pointer-events-none select-none relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none z-20"></div>
                  <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setPhonePreview(null); }} data-html2canvas-ignore="true" className="absolute z-30 bg-red-600/90 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover/screen:opacity-100 transition-opacity shadow-[0_0_15px_rgba(220,38,38,0.8)]"><Trash2 size={12}/></button>
                </>
              ) : (
                <label className="absolute inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/screen:opacity-100 transition-all text-white hover:text-amber-500 p-1">
                  <span className="text-xl md:text-2xl font-black mb-0.5 opacity-50">3</span>
                  <span className="text-[5px] md:text-[7px] font-black uppercase tracking-widest text-center leading-tight text-amber-500/80">TEST YOUR FIGMA DESIGN</span>
                  <input type="file" className="hidden" onChange={(e) => handleUiUpload(e, 'phone')} accept="image/*" />
                </label>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* GALERIJA POZADINA ZA PROMENU SCENE */}
      <section className="py-12 px-6 bg-[#0a0a0a] border-t border-white/5 relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">
              Select Another Presentation Base
            </h3>
            <p className="text-zinc-500 text-xs mt-2 mb-6">
              Svaka scena je pre-kalibrisana. Kliknite na bilo koju da promenite okruženje vašeg UI dizajna.
            </p>
          </div>

          {/* OBUHVAĆEN CELOKUPAN GRID SA ZAKLJUČANIM "IN PROGRESS" SLOJEM (OSIM AKO SI ADMIN) */}
          <div className="relative w-full rounded-2xl overflow-hidden mb-10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${!isAdminMode ? 'pointer-events-none opacity-20 grayscale blur-[4px]' : ''}`}>
              {galleryImages.map((img, idx) => (
                <div key={idx} onClick={() => changeScene(img)} className={`relative aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden border-2 transition-all duration-300 group cursor-pointer ${activeBg === img ? 'border-amber-500 scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : 'border-white/5 hover:border-white/20'}`}>
                  <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" alt={`Scene Setup ${idx}`} />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors flex items-center justify-center">
                    <span className="bg-black/80 backdrop-blur-sm text-[9px] text-zinc-300 font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                      Load Scene
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* APSOLUTNI OVERLAY PREKO CELOG GRIDA - PRIKAZUJE SE SAMO KORISNICIMA, GORAN GA NE VIDI */}
            {!isAdminMode && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10 cursor-not-allowed">
                <h2 className="text-amber-500 font-black uppercase tracking-[0.3em] text-4xl md:text-6xl drop-shadow-2xl">
                  IN PROGRESS
                </h2>
                <p className="text-zinc-400 text-[10px] md:text-xs uppercase tracking-widest font-mono text-center px-4 mt-6">
                  // SYSTEM ENVIRONMENT CALIBRATION UNDERWAY
                </p>
              </div>
            )}
          </div>

          {/* STANDARD DEVICE DUGME ISPOD GRIDA */}
          <div className="text-center flex justify-center mb-8">
            <Link 
              to="/standard-mocup"
              onClick={() => localStorage.setItem('v8_active_mocup_tab', 'ultra1')}
              className="inline-flex items-center justify-center bg-transparent border border-zinc-800 hover:border-amber-500 hover:text-white text-zinc-500 font-bold uppercase tracking-widest text-[10px] md:text-xs px-8 py-3.5 rounded-full transition-all"
            >
              STANDARD DEVICES <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>

        </div>

        {/* 🔥 TANKA HORIZONTALNA LINIJA DUŽ CELOG EKRANA/KONTEJNERA 🔥 */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>
      </section>

      {/* 🔥 BOX PROŠIREN PO DUŽINI, POVEĆAN PO VISINI, IZDVOJENA DONJA IVICA + DODATA GEMINI ANIMACIJA 🔥 */}
      <section className="py-16 px-4 md:px-8 flex flex-col items-center">
        
        {/* 🔥 STRELICA ZA POVRATAK NAZAD 🔥 */}
        <div className="w-full max-w-[1400px] flex justify-start mb-6 px-2">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center bg-[#0a0a0a]/80 hover:bg-amber-500 text-zinc-400 hover:text-black border border-white/10 hover:border-amber-500 p-3 rounded-full transition-all shadow-lg hover:scale-105"
            title="Go Back"
          >
            <ArrowLeft size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="max-w-[1400px] mx-auto w-full min-h-[600px] relative p-[2px] rounded-t-3xl overflow-hidden">
          {/* Animirani Gemini okvir iza providnog panela */}
          <div className="absolute inset-0 gemini-border-animation z-0"></div>
          
          {/* Unutrašnji providni deo sa odsečenom donjom ivicom */}
          <div className="w-full h-full min-h-[596px] bg-[#050505] rounded-t-[22px] border-l border-r border-t border-transparent z-10 relative flex flex-col items-center px-4 md:px-10 py-20">
            
            {/* NOVI NASLOV SA 150MP U NARANDŽASTOJ */}
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-20 text-center drop-shadow-xl">
              Latest <span className="text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]">150MP</span> Releases
            </h2>

            {/* KARTICE ZA SLIKE 16:9 SA GEMINI ANIMACIJOM OKVIRA I PULSIRAJUĆIM SLIKAMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full mb-20">
              {MOCKUP_CARDS.map((card, index) => (
                <div key={card.id} className="relative p-[2px] rounded-2xl overflow-hidden flex flex-col shadow-2xl group">
                  {/* GEMINI ANIMACIJA NA KARTICI */}
                  <div className="absolute inset-0 gemini-border-animation z-0"></div>
                  
                  {/* UNUTRAŠNJOST KARTICE (minimalan p-2 kako bi slika bila što veća) */}
                  <div className="bg-[#0a0a0a] rounded-[14px] p-2 flex flex-col flex-grow z-10 relative">
                    
                    {/* MAKSIMALNO PROŠIREN SLIKA PLACEHOLDER 16:9 SA TVOJIM SLIKAMA (DODAT ONCLICK ZA FULL SCREEN MODAL) */}
                    <div 
                      className="w-full aspect-video border border-amber-500/30 rounded-[10px] bg-[#050505] mb-4 flex items-center justify-center overflow-hidden relative cursor-pointer"
                      onClick={() => setSelectedImage(card.image)}
                    >
                      {/* ŽUTA MUNJA KOJA BLESNE */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <Zap 
                          className="text-amber-500 fill-amber-500 animate-zap-flash w-16 h-16 opacity-0"
                          style={{ animationDelay: `${index * 1.5}s` }} 
                        />
                      </div>

                      {/* Oznake NEW i HOT za treću sliku */}
                      <div className="absolute top-3 right-3 flex gap-2 z-20">
                        {card.isNew && (
                          <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest animate-pulse">
                            NEW
                          </span>
                        )}
                        {card.isHot && (
                          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-widest">
                            HOT
                          </span>
                        )}
                      </div>

                      {/* Slika koja suptilno pulsira */}
                      <img 
                        src={card.image} 
                        alt={card.alt} 
                        className="w-full h-full object-cover animate-img-pulse" 
                        style={{ animationDelay: `${index * 0.5}s` }}
                      />
                    </div>
                    
                    {/* TEKST KARTICE */}
                    <div className="flex-grow flex flex-col gap-2 px-2 pb-2">
                      <h3 className="text-white font-black text-lg uppercase tracking-wider">{card.title}</h3>
                      <p className="text-zinc-400 text-xs leading-relaxed font-light">{card.desc}</p>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* 🔥 AŽURIRANI DUGMIĆI ZA NAVIGACIJU 🔥 */}
            <div className="flex flex-wrap justify-center gap-4 mt-auto">
              <button 
                onClick={() => {
                  localStorage.setItem('v8_active_mocup_tab', 'ultra3');
                  navigate('/standard-mocup');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm uppercase tracking-widest py-4 px-8 rounded-2xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Billboard Mockups
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('v8_active_mocup_tab', 'ultra4');
                  navigate('/standard-mocup');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm uppercase tracking-widest py-4 px-8 rounded-2xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Wall Mockups
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('v8_active_mocup_tab', 'ultra5');
                  navigate('/standard-mocup');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm uppercase tracking-widest py-4 px-8 rounded-2xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)]"
              >
                Executive Plaque Mockups
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
// KRAJ FAJLA: SaaSProtocolPage