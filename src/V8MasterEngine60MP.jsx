// POČETAK FAJLA: V8MasterEngine60MP.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async'; // 🔥 DODATO ZA SEO 🔥
import {
  Upload,
  Layers,
  X,
  Diamond,
  DownloadCloud,
  Zap,
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Crown,
  ArrowUpCircle,
  FileText,
  Archive,
  RefreshCcw,
  Download,
  Trash2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

import { db, auth } from './firebase';
import {
  doc,
  onSnapshot,
  increment,
  serverTimestamp,
  collection,
  query,
  where,
  setDoc
} from 'firebase/firestore';
import {
  onAuthStateChanged
} from 'firebase/auth';

import V8SecureCheckout from './V8SecureCheckout';
import LoginRequiredModal from './LoginRequiredModal';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './data';

// 🔥 GA4 ANALITIKA 🔥
import { trackV8Action } from './utils/analytics';

const BASE_BACKEND_URL = window.location.hostname === 'localhost'
  ? "http://localhost:8000"
  : "https://aitoolsprosmart-becend-production.up.railway.app";

const MAX_FILES = 2;
const VALID_EXTENSIONS = ["image/jpeg", "image/png", "image/webp", "image/tiff"];

// POČETAK FUNKCIJE: FullScreenLightbox
const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    if (imageUrl) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [imageUrl]);

  if (!imageUrl) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999999] bg-[#0f172a]/95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-6 right-6 md:top-10 md:right-10 bg-red-600 text-white p-4 rounded-full font-black z-[1000000] shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:bg-red-500 transition-all"
      >
        <X size={32} strokeWidth={3} />
      </button>

      <img
        src={imageUrl}
        alt="Full Screen Preview"
        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(220,38,38,0.4)] border border-red-500/30 relative z-[999999]"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};
// KRAJ FUNKCIJE: FullScreenLightbox

const V8MasterEngine60MP = () => {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);
  const [activeLog, setActiveLog] = useState(0);
  const [batchError, setBatchError] = useState(null);

  const [zipUrl, setZipUrl] = useState(null);

  const inputRef = useRef(null);
  const [otvorenOpis, setOtvorenOpis] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [credits, setCredits] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);
  const [currentPlan, setCurrentPlan] = useState('NONE');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [cooldownTime, setCooldownTime] = useState(null);

  const [payData, setPayData] = useState([]);
  const [vipData, setVipData] = useState({});

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginRequiredOpen, setIsLoginRequiredOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState('');
  const [checkoutPrice, setCheckoutPrice] = useState(0);

  const [showcase, setShowcase] = useState({
    before: '',
    after: '',
    before2: '',
    after2: ''
  });

  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  const [isUploadingShowcase, setIsUploadingShowcase] = useState({
    before: false,
    after: false,
    before2: false,
    after2: false
  });

  const beforeImgRef = useRef(null);
  const afterImgRef = useRef(null);
  const before2ImgRef = useRef(null);
  const after2ImgRef = useRef(null);

  const v8Logs = [
    "🚀 VISIONARY FACTORY V8 | IGNITING 60MP GOD TIER ENGINE...",
    "💎 1. Extreme 60MP Upscale (LANCZOS) initiated",
    "💎 2. Texture-safe Contributor Quality Cleanup",
    "💎 3. Premium Sharpness 60.2MP Tuned",
    "💎 4. Commercial Color Grading",
    "💎 5. Highlight Rolloff & Shadow Depth applied",
    "💎 6. Real sRGB ICC Marketplace Export",
    "💎 7. Product AD Polish active",
    "💎 8. Anti-plastic Realism (Film Grain)",
    "💎 9. 30MB–40MB JPG Targeting",
    "💎 10. Compiling ZIP package with TXT and CSV report",
    "✅ SYSTEM STATUS: 100% | BATCH READY"
  ];

  const openCheckoutForPackage = (paketName, fullPrice) => {
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;

    const naslovCheckouta = isUpgrade
      ? `GOD TIER 60MP - ${paketName.toUpperCase()} (UPGRADE)`
      : `GOD TIER 60MP - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsCheckoutOpen(true);
  };

  const pokreniKupovinu = (paketName, fullPrice) => {
    const userNow = currentUser || auth.currentUser;
    const razlika = fullPrice - amountPaid;
    const finalPrice = razlika > 0 ? razlika : fullPrice;
    const isUpgrade = amountPaid > 0;

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("60mp_checkout_initiated", { 
        paket: paketName, 
        cena: finalPrice, 
        tip_klijenta: isUpgrade ? "upgrade" : "new" 
    });

    if (userNow) {
      openCheckoutForPackage(paketName, fullPrice);
      return;
    }

    const naslovCheckouta = isUpgrade
      ? `GOD TIER 60MP - ${paketName.toUpperCase()} (UPGRADE)`
      : `GOD TIER 60MP - ${paketName.toUpperCase()}`;

    setCheckoutProduct(naslovCheckouta);
    setCheckoutPrice(finalPrice);
    setIsLoginRequiredOpen(true);
  };

  const handleLoginRequiredSuccess = (user) => {
    setCurrentUser(user);
    setIsLoginRequiredOpen(false);

    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 250);
  };

  useEffect(() => {
    const unsubShowcase = onSnapshot(doc(db, "v8_settings", "showcase_60mp"), (docSnap) => {
      if (docSnap.exists()) {
        setShowcase((prev) => ({
          ...prev,
          ...docSnap.data()
        }));
      }
    });

    let unsubCrypto = () => {};
    let unsubPayPal = () => {};
    let unsubVip = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (!user) {
        setPayData([]);
        setVipData({});
        setIsCheckingAccess(false);
        setAmountPaid(0);
        setCurrentPlan('NONE');
        setIsVIP(false);
        setIsAdmin(false);
        return;
      }

      const email = user.email.toLowerCase();

      setIsAdmin(
        email === "damnjanovicgoran7@gmail.com" ||
        email === "aitoolsprosmart@gmail.com"
      );

      let cryptoDocs = [];
      let paypalDocs = [];

      const updateAllPayData = () => {
         setPayData([...cryptoDocs, ...paypalDocs]);
      };

      unsubCrypto = onSnapshot(query(collection(db, "v8_crypto_requests"), where("clientEmail", "==", email)), snap => {
         cryptoDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubPayPal = onSnapshot(query(collection(db, "v8_paypal_requests"), where("clientEmail", "==", email)), snap => {
         paypalDocs = snap.docs.map(d => d.data());
         updateAllPayData();
      });

      unsubVip = onSnapshot(doc(db, "vip_users", email), (snap) => {
        setVipData(snap.exists() ? snap.data() : {});
      });

    });

    return () => {
      unsubAuth();
      unsubShowcase();
      unsubCrypto();
      unsubPayPal();
      unsubVip();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsVIP(false);
      setCredits(0);
      setAmountPaid(0);
      setCurrentPlan('NONE');
      return;
    }

    if (isAdmin) {
      setIsVIP(true);
      setCredits(9999);
      setAmountPaid(550);
      setCurrentPlan('ENTERPRISE');
      setIsCheckingAccess(false);
      return;
    }

    let hasAccess = false;
    let calculatedDefaultCredits = 0;
    let maxPaid = 0;
    let highestPlan = 'NONE';

    payData.forEach((data) => {
      if (data.status === "PLAĆENO" || data.status === "completed_verified") {
        const productName = data.productName ? data.productName.toUpperCase() : "";

        if (productName.includes("GOD TIER") || productName.includes("60MP") || productName.includes("SECURITY CHECKOUT")) {
          hasAccess = true;

          if (productName.includes("ENTERPRISE")) {
            if (maxPaid < 550) {
              maxPaid = 550;
              highestPlan = 'ENTERPRISE';
            }
            calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 10000);
          } else if (productName.includes("PRO")) {
            if (maxPaid < 250) {
              maxPaid = 250;
              highestPlan = 'PRO';
            }
            calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 2000);
          } else {
            if (maxPaid < 150) {
              maxPaid = 150;
              highestPlan = 'STARTER';
            }
            calculatedDefaultCredits = Math.max(calculatedDefaultCredits, 500);
          }
        }
      }
    });

    if (hasAccess) {
      setIsVIP(true);
      setAmountPaid(maxPaid);
      setCurrentPlan(highestPlan);

      const creditField = `MASTER60_credits`;
      let currentCredits = vipData[creditField] !== undefined
        ? vipData[creditField]
        : calculatedDefaultCredits;

      const cdField = `MASTER60_cooldown`;
      const cooldownStart = vipData[cdField] ? vipData[cdField].toMillis() : null;

      if (cooldownStart) {
        const now = Date.now();

        if ((now - cooldownStart) >= (24 * 60 * 60 * 1000)) {
          setDoc(
            doc(db, "vip_users", currentUser.email.toLowerCase()),
            {
              [creditField]: calculatedDefaultCredits,
              [cdField]: null
            },
            { merge: true }
          );

          currentCredits = calculatedDefaultCredits;
          setCooldownTime(null);
        } else {
          setCooldownTime(cooldownStart + (24 * 60 * 60 * 1000));
        }
      } else {
        setCooldownTime(null);
      }

      setCredits(currentCredits);
    } else {
      setIsVIP(false);
      setCredits(0);
      setAmountPaid(0);
      setCurrentPlan('NONE');
      setCooldownTime(null);
    }

    setIsCheckingAccess(false);
  }, [payData, vipData, currentUser, isAdmin]);

  const handleShowcaseUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingShowcase((prev) => ({
      ...prev,
      [type]: true
    }));

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
        {
          method: 'POST',
          body: fd
        }
      );

      const resData = await res.json();

      await setDoc(
        doc(db, "v8_settings", "showcase_60mp"),
        { [type]: resData.secure_url },
        { merge: true }
      );
    } catch (err) {
      console.error("Greška pri uploadu showcase slike:", err);
      alert("Došlo je do greške pri uploadu. Proveri Cloudinary podešavanja.");
    } finally {
      setIsUploadingShowcase((prev) => ({
        ...prev,
        [type]: false
      }));

      e.target.value = null;
    }
  };

  const deleteShowcaseImage = async (e, type) => {
    e.stopPropagation();

    if (window.confirm("Obrisati ovu sliku?")) {
      await setDoc(
        doc(db, "v8_settings", "showcase_60mp"),
        { [type]: '' },
        { merge: true }
      );
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      processSelectedFiles(Array.from(e.target.files));
    }
  };

  const getAspectCategory = (width, height) => {
    const ratio = width / height;

    if (Math.abs(ratio - (16 / 9)) < 0.08) return "16:9";
    if (Math.abs(ratio - (21 / 9)) < 0.08) return "21:9";
    if (Math.abs(ratio - (9 / 16)) < 0.08) return "9:16";
    if (Math.abs(ratio - 1.0) < 0.05) return "1:1";

    return "OTHER";
  };

  const readImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height
        });
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const processSelectedFiles = async (selectedFiles) => {
    const validFiles = Array.from(selectedFiles).filter((file) => {
      return VALID_EXTENSIONS.includes(file.type);
    });

    if (validFiles.length !== selectedFiles.length) {
      alert("Neki fajlovi su preskočeni. Podržani su samo JPG, PNG, WEBP i TIFF formati.");
    }

    if (validFiles.length === 0) return;

    let prvaSlikaZaPoredjenje;
    let referentniFormat = null;

    if (files.length > 0) {
      prvaSlikaZaPoredjenje = files[0];
    } else {
      prvaSlikaZaPoredjenje = validFiles[0];
    }

    try {
      const prvaDimenzije = await readImageDimensions(prvaSlikaZaPoredjenje);
      referentniFormat = getAspectCategory(prvaDimenzije.width, prvaDimenzije.height);

      if (referentniFormat === "OTHER") {
        alert("Prva slika ima nepodržan format (nije 16:9, 9:16, 21:9 ni 1:1). Molimo obrišite batch i krenite sa podržanim formatom.");

        if (inputRef.current) inputRef.current.value = "";

        return;
      }
    } catch (e) {
      console.error("Ne mogu da pročitam dimenzije prve slike", e);
      return;
    }

    const filtriraneSlike = [];
    let odbijenoZbogFormata = false;

    for (const file of validFiles) {
      try {
        const dim = await readImageDimensions(file);
        const fileFormat = getAspectCategory(dim.width, dim.height);

        if (fileFormat === referentniFormat) {
          filtriraneSlike.push(file);
        } else {
          odbijenoZbogFormata = true;
        }
      } catch (e) {
        console.error(`Greška pri čitanju fajla ${file.name}`, e);
      }
    }

    if (odbijenoZbogFormata) {
      alert(`Pokušali ste da ubacite slike različitog formata! U ovom batchu su dozvoljene samo slike u formatu ${referentniFormat}. Slike drugog formata su automatski ignorisane.`);
    }

    let combined = [...files, ...filtriraneSlike];

    if (combined.length > MAX_FILES) {
      alert(`Za God Tier (60MP) možete obraditi maksimalno ${MAX_FILES} slike po batch-u.`);
      combined = combined.slice(0, MAX_FILES);
    }

    setFiles(combined);
    setDownloadStatus('idle');
    setZipUrl(null);
    setActiveLog(0);
    setBatchError(null); 

    if (inputRef.current) inputRef.current.value = "";
  };

  const obrisiSlike = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setFiles([]);
    setDownloadStatus('idle');
    setZipUrl(null);
    setActiveLog(0);
    setBatchError(null); 

    if (inputRef.current) inputRef.current.value = "";
  };

  const downloadZipFile = () => {
    if (!zipUrl) return;

    const a = document.createElement('a');

    a.href = zipUrl;
    a.download = `V8_60MP_God_Tier_Batch_${Date.now()}.zip`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("60mp_zip_downloaded", { 
        broj_fajlova: files.length,
        plan: currentPlan
    });
  };

  const handleUpscaleAndDownload = async () => {
    if (!files || files.length === 0) return;

    if (credits < files.length && !isAdmin) {
      alert(`NEMATE DOVOLJNO KREDITA! Pokušavate da obradite ${files.length} slika, ali imate samo ${credits} kredita.`);
      return;
    }

    // 🔥 GA4 ANALITIKA 🔥
    trackV8Action("60mp_processing_started", { 
        broj_fajlova: files.length,
        tip_korisnika: isVIP ? "vip" : "trial"
    });

    setIsProcessing(true);
    setDownloadStatus('processing');
    setActiveLog(0);
    setZipUrl(null);
    setBatchError(null); 

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('images', file);
    });

    formData.append('email', currentUser?.email || '');

    try {
      const progressInterval = setInterval(() => {
        setActiveLog((prev) => {
          return prev < v8Logs.length - 1 ? prev + 1 : prev;
        });
      }, 1500);

      const backendRoute = isVIP
        ? '/api/v8-60mp-process'
        : '/api/v8-60mp-trial-process';

      const response = await fetch(`${BASE_BACKEND_URL}${backendRoute}`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Server Error during 60MP processing.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      setZipUrl(url);
      setActiveLog(v8Logs.length);
      setDownloadStatus('success');

      if (auth.currentUser && !isAdmin) {
        const email = auth.currentUser.email.toLowerCase();
        const docRef = doc(db, "vip_users", email);
        const novaKolicina = credits - files.length;

        if (novaKolicina <= 0) {
          await setDoc(
            docRef,
            {
              ['MASTER60_credits']: 0,
              ['MASTER60_cooldown']: serverTimestamp()
            },
            { merge: true }
          );
        } else {
          await setDoc(
            docRef,
            {
              ['MASTER60_credits']: increment(-files.length)
            },
            { merge: true }
          );
        }
      }
    } catch (error) {
      console.error("V8 Master Engine failure:", error);
      const message = error.message || "Greška na serveru. Da li je skripta povezana na backend?";
      setBatchError(message); 
      setDownloadStatus('error');
      setActiveLog(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPricingPlans = () => {
    if (amountPaid >= 550) {
      return (
        <div className="w-full max-w-5xl mx-auto mt-16 px-4">
          <div className="bg-gradient-to-r from-[#2a0808] to-[#050505] border border-red-500/40 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden">
            <Crown className="w-20 h-20 text-red-500 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]" />

            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-widest mb-4">
              ENTERPRISE TIER <span className="text-red-500">UNLOCKED</span>
            </h2>

            <p className="text-red-200/60 font-bold uppercase tracking-widest text-[11px] md:text-sm max-w-2xl mx-auto">
              You possess the highest level V8 License. The 60MP God Tier Engine is fully operational.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-5xl mx-auto mt-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-white uppercase tracking-widest mb-4">
            {amountPaid > 0 ? "UPGRADE YOUR ACCESS." : "LIFETIME ACCESS."}
            <span className="text-red-500 block md:inline mt-2 md:mt-0"> CHOOSE YOUR V8 PLAN.</span>
          </h2>

          <div className="mt-8 bg-[#0a0a0a]/90 border border-white/10 rounded-2xl p-8 text-left space-y-4 shadow-inner max-w-4xl mx-auto mb-8">
            <h4 className="text-red-500 font-black uppercase tracking-[0.2em] text-[13px] border-b border-red-500/20 pb-3 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> V8 LICENSE PROTOCOL
            </h4>

            <p className="text-[13px] md:text-[14px] text-zinc-300">
              <strong className="text-white">1. ONE-TIME PAYMENT:</strong> Pay once. Secure your Lifetime License. Zero monthly subscriptions.
            </p>

            <p className="text-[13px] md:text-[14px] text-zinc-300">
              <strong className="text-white">2. THE ROLLING QUOTA:</strong> You get a dedicated pool of credits based on your tier. Use them in 24 hours or stretch them across 365 days. Your cycle only ends when your credits hit zero.
            </p>

            <p className="text-[13px] md:text-[14px] text-zinc-300">
              <strong className="text-white">3. THE 24H AUTO-REFILL:</strong> Burned through your entire quota? The Extractor Core enters a mandatory 24-hour cooling phase. After exactly 24 hours, your credits auto-replenish to full capacity. <span className="text-emerald-400 font-black">For free. Forever.</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 w-full z-10 relative">
          {amountPaid < 150 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-zinc-700 rounded-[2rem] p-8 flex flex-col hover:border-zinc-500 transition-all shadow-xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-800 mb-6 mx-auto">
                <Diamond className="w-6 h-6 text-zinc-400" />
              </div>

              <h3 className="text-xl font-black text-white uppercase text-center">
                Starter
              </h3>

              <span className="text-4xl font-black text-zinc-300 my-4 text-center">
                $150
              </span>

              <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                <p className="flex items-center gap-2">✅ 500 Image Processes</p>
                <p className="flex items-center gap-2">⏳ Use in 24h or stretch over 365 days</p>
                <p className="flex items-center gap-2">🔄 Rolling Quota</p>
              </div>

              <button
                type="button"
                onClick={() => pokreniKupovinu('STARTER', 150)}
                className="w-full bg-zinc-800 text-white hover:bg-zinc-600 py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md"
              >
                SELECT STARTER
              </button>
            </div>
          )}

          {amountPaid < 250 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border-2 rounded-[2rem] p-8 flex flex-col relative transition-all transform md:scale-105 z-10 border-red-500/50 hover:border-red-500/80 shadow-[0_0_30px_rgba(220,38,38,0.15)]">
              <div className="absolute top-0 left-0 w-full h-2 rounded-t-[1.9rem] bg-gradient-to-r from-red-600 to-rose-400"></div>

              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg bg-red-600">
                Bestseller
              </div>

              <div className="w-12 h-12 flex items-center justify-center rounded-full mb-6 mx-auto mt-2 bg-red-500/10">
                <Crown className="w-6 h-6 text-red-500" />
              </div>

              <h3 className="text-xl font-black text-white uppercase text-center">
                Pro
              </h3>

              <span className="text-4xl font-black my-4 text-center flex items-center justify-center gap-3 text-red-500">
                {amountPaid > 0 ? `$${250 - amountPaid}` : "$250"}
              </span>

              <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-300 font-bold uppercase tracking-widest flex-grow">
                <p className="flex items-center gap-2">✅ 2,000 Image Processes</p>
                <p className="flex items-center gap-2">⏳ Batch Processing (Up to {MAX_FILES})</p>
                <p className="flex items-center gap-2">🔄 Rolling Quota</p>
              </div>

              <button
                type="button"
                onClick={() => pokreniKupovinu('PRO', 250)}
                className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[14px] transition-all text-white bg-gradient-to-r from-red-600 to-rose-500 hover:scale-[1.02] shadow-[0_0_20px_rgba(220,38,38,0.4)]"
              >
                {amountPaid > 0 ? "UPGRADE TO PRO" : "SELECT PRO"}
              </button>
            </div>
          )}

          {amountPaid < 550 && (
            <div className="w-full md:w-[calc(33.333%-1rem)] max-w-sm bg-[#050505] border border-blue-500/30 rounded-[2rem] p-8 flex flex-col hover:border-blue-500/60 transition-all shadow-xl">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500/10 mb-6 mx-auto">
                <Crown className="w-6 h-6 text-blue-500" />
              </div>

              <h3 className="text-xl font-black text-white uppercase text-center">
                Enterprise
              </h3>

              <span className="text-4xl font-black text-blue-400 my-4 text-center flex items-center justify-center gap-3">
                {amountPaid > 0 ? `$${550 - amountPaid}` : "$550"}
              </span>

              <div className="w-full text-left space-y-3 mb-8 text-[11px] text-zinc-400 font-bold uppercase tracking-widest flex-grow">
                <p className="flex items-center gap-2">✅ 10,000 Image Processes</p>
                <p className="flex items-center gap-2">⏳ High-Speed Priority Server</p>
                <p className="flex items-center gap-2">🔄 Lifetime Access</p>
              </div>

              <button
                type="button"
                onClick={() => pokreniKupovinu('ENTERPRISE', 550)}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md ${
                  amountPaid > 0
                    ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white'
                    : 'bg-zinc-800 text-white hover:bg-blue-500'
                }`}
              >
                {amountPaid > 0 ? "UPGRADE TO ENTERPRISE" : "SELECT ENTERPRISE"}
              </button>
            </div>
          )}
        </div>

        {amountPaid > 0 && amountPaid < 550 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mt-12 mb-10 bg-gradient-to-r from-[#2a0808]/90 to-[#020617]/90 border border-red-500/40 p-6 md:p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-center gap-8 shadow-[0_0_40px_rgba(220,38,38,0.2)] relative overflow-hidden backdrop-blur-md"
          >
            <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>

            <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center border border-red-500/50 relative flex-shrink-0 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              <div className="absolute inset-0 rounded-full border-t-2 border-red-400 animate-spin"></div>
              <ArrowUpCircle className="w-8 h-8 text-red-400" />
            </div>

            <div className="text-center md:text-left relative z-10">
              <div className="inline-block bg-red-900/30 border border-red-500/30 px-3 py-1 rounded-full text-red-300 font-bold uppercase tracking-widest text-[9px] mb-3">
                SMART UPGRADE SYSTEM ACTIVE
              </div>

              <h3 className="text-white text-lg md:text-xl font-black uppercase tracking-widest mb-2 drop-shadow-md">
                PRORATED UPGRADE POLICY
              </h3>

              <p className="text-zinc-300 text-[13px] md:text-[14px] leading-relaxed max-w-2xl font-medium">
                System radar has detected an active V8 License valued at <strong className="text-red-400">${amountPaid}</strong> linked to your account. You will <strong className="text-white border-b border-red-500/50 pb-0.5">only pay the exact difference</strong> to upgrade to a higher tier.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderV8Manifest = () => {
    const specifikacije = [
      {
        t: "1. 60MP Upscale",
        d: "Extreme Lanczos Interpolation.",
        insight: "Pushes native resolution exactly to absolute marketplace limits (e.g. 10240x5760) without distorting base structure."
      },
      {
        t: "2. Texture-Safe Cleanup",
        d: "Contributor Quality Noise Reduction.",
        insight: "Applies a controlled MedianFilter to reduce AI grit and compression debris while preserving skin, fabric, and micro-details."
      },
      {
        t: "3. Premium Sharpness",
        d: "UnsharpMask calibrated for 60MP.",
        insight: "Restores crisp edge clarity post-upscale, eliminating the soft 'upscaled' blur without creating amateur halos."
      },
      {
        t: "4. Color Grading",
        d: "Luminance matrices for impact.",
        insight: "Advanced Color Enhancement matrices adjust Luminance and Chrominance so colors pop naturally for high-end advertising."
      },
      {
        t: "5. Highlight Rolloff",
        d: "NumPy Matrix Processing.",
        insight: "Softens values above 230 via mathematical arrays to prevent blown-out white clipping in bright zones."
      },
      {
        t: "6. Shadow Depth",
        d: "3D richness and true blacks.",
        insight: "NumPy matrix processing compresses dark values to create 'true blacks' that retain tactile 3D dimension and subtle information."
      },
      {
        t: "7. Real sRGB Export",
        d: "Embedded ICC Color Profiles.",
        insight: "Guarantees cross-browser and multi-platform color consistency, preventing washed-out uploads on stock sites."
      },
      {
        t: "8. Product AD Polish",
        d: "Final high-conversion refinement.",
        insight: "Localized contrast adjustments ensure the viewer's eye is drawn immediately to the primary subject for commercial impact."
      },
      {
        t: "9. Anti-Plastic Realism",
        d: "Subtle Organic Film Grain.",
        insight: "Injects Gaussian noise into the image array to break up unnatural AI smoothness and emulate real camera sensors."
      },
      {
        t: "10. CSV Report Gen",
        d: "Advanced Metadata Logging.",
        insight: "Generates a detailed CSV file tracking exact source sizes, output sizes, quality factors, and compression ratios."
      }
    ];

    return (
      <div className="w-full max-w-5xl mx-auto mb-16 bg-black/40 border border-white/5 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[0.2em] text-white">
            V8 GOD TIER ENGINE
          </h2>

          <p className="text-[12px] md:text-[14px] text-red-500 font-bold uppercase tracking-[0.3em] mt-3 italic">
            Technical Specifications 60MP
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
          {specifikacije.map((item, i) => {
            const isOpen = otvorenOpis === i;

            return (
              <div
                key={i}
                onClick={() => setOtvorenOpis(isOpen ? null : i)}
                className={`bg-white/5 border p-6 rounded-2xl transition-all duration-500 cursor-pointer relative overflow-hidden group ${
                  isOpen
                    ? 'border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.1)]'
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <h4 className={`text-[13px] md:text-[15px] font-black uppercase transition-colors duration-300 flex items-center gap-3 mb-2 ${isOpen ? 'text-red-500' : 'text-zinc-400'}`}>
                      <span className={`text-lg transition-colors duration-300 ${isOpen ? 'text-red-500' : 'text-zinc-600'}`}>
                        💎
                      </span>
                      {item.t}
                    </h4>

                    <p className={`text-[11px] md:text-[13px] font-medium leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-zinc-500'}`}>
                      {item.d}
                    </p>
                  </div>

                  <div className={`ml-4 text-xs md:text-sm font-black transition-all duration-500 ${isOpen ? 'rotate-180 text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                    ▼
                  </div>
                </div>

                <div className={`grid transition-all duration-500 ease-in-out relative z-10 ${isOpen ? 'grid-rows-[1fr] mt-4 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-[11px] md:text-[12px] text-zinc-300 font-mono leading-relaxed border-l-2 border-red-500 pl-3">
                        <span className="text-red-500 font-bold">Tech Insight:</span> {item.insight}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#050505] p-8 md:p-12 rounded-[2.5rem] border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.1)] max-w-6xl mx-auto mt-28 relative overflow-hidden">
      
      {/* 🔥 SEO TAGOVI SAMO ZA OVU STRANICU 🔥 */}
      <Helmet>
        <title>60MP Cinematic AI Engine | God Tier Upscaler</title>
        <meta name="description" content="Access the 60MP God Tier Upscaler. Turn raw AI images into flawless commercial assets with precise LANCZOS interpolation and sRGB color profiles." />
        <meta name="keywords" content="60MP AI upscaler, cinematic AI assets, buy 60MP photos, commercial AI tools, high-resolution AI upscaling" />
      </Helmet>

      <FullScreenLightbox
        imageUrl={fullScreenImageUrl}
        onClose={() => setFullScreenImageUrl(null)}
      />

      <LoginRequiredModal
        isOpen={isLoginRequiredOpen}
        onClose={() => setIsLoginRequiredOpen(false)}
        onLoginSuccess={handleLoginRequiredSuccess}
        packageName={checkoutProduct || "Selected Package"}
        price={checkoutPrice || 0}
      />

      <AnimatePresence>
        {isCheckoutOpen && (
          <V8SecureCheckout
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            productName={checkoutProduct}
            price={checkoutPrice}
          />
        )}
      </AnimatePresence>

      {(isVIP || isAdmin) && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/80 backdrop-blur-xl border border-red-500/50 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center gap-4"
          >
            <Crown className="w-4 h-4 text-red-500 animate-pulse" />

            <div className="flex flex-col items-center">
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-zinc-400 leading-none">
                60MP {!isVIP ? 'TRIAL ' : ''}CREDITS
              </span>

              <span className={`text-[15px] font-black tracking-widest leading-none mt-1 ${(credits > 10 || isAdmin) ? 'text-emerald-400' : 'text-red-500'}`}>
                {isAdmin ? '∞ MAX' : `${credits} AVAIL.`}
              </span>
            </div>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full mx-auto mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.15)]"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50 z-0 pointer-events-none"
        >
          <source src="/v8_god_tier_916.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/80 to-[#050505]"></div>

        <div className="relative z-10 py-16 px-6 text-center flex flex-col items-center">
          <div className="inline-block bg-red-600/10 border border-red-500/30 px-5 py-2 rounded-full text-red-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-sm">
            V8 CORE // PYTHON PROCESSING
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white mb-6 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] flex items-center justify-center gap-4 flex-wrap">
            <Crown className="text-red-500 w-12 h-12 md:w-16 md:h-16 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
            GOD TIER ENGINE
            <span className="text-xl md:text-3xl font-black not-italic tracking-widest ml-2 px-4 py-1 rounded-full flex items-center border text-[#dc2626] drop-shadow-[0_0_15px_rgba(220,38,38,0.6)] border-[#dc2626]/30 bg-[#dc2626]/10">
              60MP
            </span>
          </h1>

          <div className="bg-[#050505]/80 backdrop-blur-md border border-red-500/20 p-8 rounded-[2rem] max-w-4xl mx-auto text-left shadow-2xl mb-8">
            <h4 className="text-white font-black uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-4">
              The God Tier Protocol:
            </h4>

            <p className="text-zinc-300 text-[13px] leading-relaxed mb-4">
              The 60MP God Tier Engine pushes your raw files to the absolute peak of visual fidelity. It strictly applies <strong>Lanczos Interpolation</strong>, followed by surgical noise reduction that targets AI compression debris while fully preserving high-frequency details.
            </p>

            <p className="text-zinc-300 text-[13px] leading-relaxed">
              It embeds a real <strong>sRGB ICC Profile</strong> into the final output and performs NumPy array-level highlight rolloff, ensuring absolute commercial safety and compliance across all major stock platforms.
            </p>
          </div>

          {!isCheckingAccess && currentPlan !== 'ENTERPRISE' && (
            <div className="mt-12 relative z-20 w-full">
              {renderPricingPlans()}
            </div>
          )}
        </div>
      </motion.div>

      {renderV8Manifest()}

      <div className="flex flex-col md:flex-row justify-center gap-6 max-w-4xl mx-auto mb-16 relative z-10">
        <a
          href="/V8_60MP_Technical_Manifest.txt"
          download
          onClick={() => trackV8Action("download_60mp_manifest")}
          className="flex-1 bg-black/40 border border-blue-500/30 hover:border-blue-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-blue-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)]"
        >
          <div className="bg-blue-500/10 p-4 rounded-full border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
            <Download className="w-8 h-8 text-blue-400" />
          </div>

          <div className="text-left">
            <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">
              Technical Manifest
            </h4>

            <p className="text-zinc-400 text-[11px] font-bold">
              Download 60MP Specs (TXT)
            </p>
          </div>
        </a>

        <a
          href="/v8-license.pdf"
          download
          onClick={() => trackV8Action("download_60mp_license")}
          className="flex-1 bg-black/40 border border-red-500/30 hover:border-red-400 p-6 rounded-2xl flex items-center gap-5 transition-all duration-300 hover:bg-red-900/20 group hover:-translate-y-1 shadow-lg hover:shadow-[0_10px_30px_rgba(220,38,38,0.2)]"
        >
          <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 group-hover:bg-red-500/20 transition-all">
            <FileText className="w-8 h-8 text-red-400" />
          </div>

          <div className="text-left">
            <h4 className="text-white font-black uppercase tracking-widest text-[13px] mb-1">
              Commercial License
            </h4>

            <p className="text-zinc-400 text-[11px] font-bold">
              Download Legal Terms (PDF)
            </p>
          </div>
        </a>
      </div>

      <div className="w-full max-w-5xl mx-auto mb-16 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-white">
            VISUAL INTEGRITY PROOF
          </h2>

          <p className="text-[12px] text-zinc-400 font-bold uppercase tracking-widest mt-2">
            Before & After 60MP God Tier Enhancements
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-red-500 text-[11px] font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Eye size={14} /> EXHIBIT 01: MACRO TEXTURE & SHARPNESS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <span className="absolute top-4 left-4 bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">
                Before (Raw)
              </span>

              {showcase.before ? (
                <>
                  <img
                    src={showcase.before}
                    alt="Before Upscale 1"
                    className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                    onClick={() => setFullScreenImageUrl(showcase.before)}
                  />

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => deleteShowcaseImage(e, 'before')}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                    <Eye className="w-12 h-12 text-white/50" />
                  </div>
                </>
              ) : (
                isAdmin ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => beforeImgRef.current.click()}
                  >
                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />

                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      {isUploadingShowcase.before ? "UPLOADING..." : "UPLOAD BEFORE IMAGE 1"}
                    </span>

                    <input
                      type="file"
                      ref={beforeImgRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleShowcaseUpload(e, 'before')}
                    />
                  </div>
                ) : (
                  <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
                    Image Unavailable
                  </span>
                )
              )}
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-[0_0_20px_rgba(220,38,38,0.05)]">
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">
                After (God Tier 60MP)
              </span>

              {showcase.after ? (
                <>
                  <img
                    src={showcase.after}
                    alt="After Upscale 1"
                    className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                    onClick={() => setFullScreenImageUrl(showcase.after)}
                  />

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => deleteShowcaseImage(e, 'after')}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                    <Eye className="w-12 h-12 text-white/50" />
                  </div>
                </>
              ) : (
                isAdmin ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => afterImgRef.current.click()}
                  >
                    <Upload className="w-10 h-10 text-red-500/50 mb-2" />

                    <span className="text-[11px] font-bold text-red-500/50 uppercase tracking-widest">
                      {isUploadingShowcase.after ? "UPLOADING..." : "UPLOAD AFTER IMAGE 1"}
                    </span>

                    <input
                      type="file"
                      ref={afterImgRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleShowcaseUpload(e, 'after')}
                    />
                  </div>
                ) : (
                  <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
                    Image Unavailable
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-red-500 text-[11px] font-black uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
            <Eye size={14} /> EXHIBIT 02: HIGHLIGHT ROLLOFF & SHADOW DEPTH
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
              <span className="absolute top-4 left-4 bg-zinc-800 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">
                Before (Raw)
              </span>

              {showcase.before2 ? (
                <>
                  <img
                    src={showcase.before2}
                    alt="Before Upscale 2"
                    className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                    onClick={() => setFullScreenImageUrl(showcase.before2)}
                  />

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => deleteShowcaseImage(e, 'before2')}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                    <Eye className="w-12 h-12 text-white/50" />
                  </div>
                </>
              ) : (
                isAdmin ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => before2ImgRef.current.click()}
                  >
                    <Upload className="w-10 h-10 text-zinc-500 mb-2" />

                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                      {isUploadingShowcase.before2 ? "UPLOADING..." : "UPLOAD BEFORE IMAGE 2"}
                    </span>

                    <input
                      type="file"
                      ref={before2ImgRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleShowcaseUpload(e, 'before2')}
                    />
                  </div>
                ) : (
                  <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
                    Image Unavailable
                  </span>
                )
              )}
            </div>

            <div className="bg-black/50 border border-red-500/30 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group shadow-[0_0_20px_rgba(220,38,38,0.05)]">
              <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-20 shadow-md">
                After (God Tier 60MP)
              </span>

              {showcase.after2 ? (
                <>
                  <img
                    src={showcase.after2}
                    alt="After Upscale 2"
                    className="w-full h-full object-contain relative z-10 cursor-pointer hover:scale-[1.02] transition-transform duration-500"
                    onClick={() => setFullScreenImageUrl(showcase.after2)}
                  />

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => deleteShowcaseImage(e, 'after2')}
                      className="absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white p-2 rounded-full z-30 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-20">
                    <Eye className="w-12 h-12 text-white/50" />
                  </div>
                </>
              ) : (
                isAdmin ? (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => after2ImgRef.current.click()}
                  >
                    <Upload className="w-10 h-10 text-red-500/50 mb-2" />

                    <span className="text-[11px] font-bold text-red-500/50 uppercase tracking-widest">
                      {isUploadingShowcase.after2 ? "UPLOADING..." : "UPLOAD AFTER IMAGE 2"}
                    </span>

                    <input
                      type="file"
                      ref={after2ImgRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleShowcaseUpload(e, 'after2')}
                    />
                  </div>
                ) : (
                  <span className="text-zinc-600 text-sm font-bold uppercase tracking-widest">
                    Image Unavailable
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`transition-all duration-500 ${(!isVIP && !isAdmin) ? 'opacity-30 grayscale-[70%] pointer-events-none' : ''}`}>
        {cooldownTime && !isAdmin && (
          <div className="mb-10 bg-red-950/40 border border-red-500/50 rounded-2xl p-6 text-center shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>

            <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3 relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />

            <h4 className="text-red-400 font-black uppercase text-[16px] tracking-widest relative z-10 mb-2">
              V8 ENGINE COOLING PROTOCOL ACTIVE
            </h4>

            <p className="text-zinc-300 text-[12px] font-bold tracking-widest relative z-10">
              You have exhausted your processing credits. System will auto-refill exactly 24 hours after your last batch.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10 mb-16 items-stretch">
          <div className="flex flex-col gap-6 h-full">
            <label className="text-red-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
              <Layers size={14} /> 1. BATCH UPLOAD (UP TO {MAX_FILES} IMAGES)
            </label>

            <div
              className={`relative border-2 border-dashed rounded-2xl p-6 flex-1 flex flex-col items-center justify-center text-center transition-all min-h-[320px] ${
                dragActive
                  ? 'border-red-500 bg-red-500/10'
                  : 'border-white/20 bg-black/50 hover:border-red-500/50'
              } ${files.length > 0 ? 'border-solid border-red-500/50' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="hidden"
              />

              {files.length > 0 ? (
                <div className="relative w-full h-full flex flex-col justify-center items-center bg-[#050505] group rounded-xl overflow-hidden p-6 border border-red-500/30">
                  <div className="text-center mb-6">
                    <Layers className="w-16 h-16 text-red-500 mb-4 mx-auto animate-pulse" />

                    <span className="text-2xl font-black text-white">
                      {files.length} / {MAX_FILES} IMAGES BATCHED
                    </span>
                  </div>

                  <div className="flex gap-4 relative z-20">
                    {files.length < MAX_FILES && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          inputRef.current.click();
                        }}
                        className="bg-zinc-800 text-white px-6 py-3 rounded-full text-xs font-black uppercase hover:bg-zinc-700 transition-all shadow-lg border border-zinc-600"
                      >
                        + ADD MORE
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={obrisiSlike}
                      className="bg-red-600/90 text-white px-6 py-3 rounded-full text-xs font-black uppercase hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                    >
                      CLEAR BATCH
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center gap-3 cursor-pointer relative z-10"
                  onClick={() => inputRef.current.click()}
                >
                  <div className="bg-white/5 p-4 rounded-full">
                    <Upload className="w-8 h-8 text-zinc-400" />
                  </div>

                  <div>
                    <p className="text-white font-bold text-sm">
                      Drag & Drop up to {MAX_FILES} images
                    </p>

                    <p className="text-zinc-500 text-xs mt-1">
                      or click to browse files
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 h-full">
            <div className="flex items-center justify-between">
              <label className="text-emerald-500 font-black text-[11px] tracking-widest uppercase flex items-center gap-2">
                <Archive size={14} /> 2. WORKFLOW MONITOR
              </label>
            </div>

            <div className="font-mono text-zinc-400 bg-black/50 border border-white/10 rounded-2xl p-6 flex-1 min-h-[320px] text-[11px] md:text-[13px] overflow-y-auto shadow-inner whitespace-pre-wrap leading-relaxed relative flex flex-col">
              {isProcessing || downloadStatus === 'success' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {v8Logs.slice(0, activeLog).map((log, index) => (
                    <div key={index} className="mb-2">
                      {log.includes('🚀') ? (
                        <span className="text-red-500 font-black">{log}</span>
                      ) : log.includes('💎') ? (
                        <span className="text-blue-400">{log}</span>
                      ) : log.includes('✅') ? (
                        <span className="text-emerald-400 font-black">{log}</span>
                      ) : (
                        <span>{log}</span>
                      )}
                    </div>
                  ))}
                </motion.div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-10">
                  <Cpu className="w-16 h-16 mb-4 text-zinc-400" />

                  <span className="font-black text-[10px] tracking-widest uppercase">
                    AWAITING BATCH INIT
                  </span>
                </div>
              )}
            </div>

            {batchError && (
              <div className="bg-red-950/50 border border-red-500/40 text-red-200 text-[11px] md:text-[12px] font-bold rounded-xl p-4 leading-relaxed">
                {batchError}
              </div>
            )}

            <div className="mt-auto pt-2 flex flex-col gap-4">
              <button
                type="button"
                onClick={() => {
                  if (downloadStatus === 'success') {
                    downloadZipFile();
                  } else {
                    handleUpscaleAndDownload();
                  }
                }}
                disabled={(isProcessing || files.length === 0 || (credits <= 0 && !isAdmin)) && downloadStatus !== 'success'}
                className={`w-full font-black text-[14px] uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${
                  downloadStatus === 'success'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02]'
                    : (credits <= 0 && !isAdmin)
                      ? 'bg-red-900/50 text-red-500 border border-red-500/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:scale-[1.02]'
                }`}
              >
                {isProcessing ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : downloadStatus === 'success' ? (
                  <DownloadCloud className="w-5 h-5" />
                ) : (
                  <Archive className="w-5 h-5" />
                )}

                {isProcessing
                  ? "PROCESSING GOD TIER ENGINE..."
                  : downloadStatus === 'success'
                    ? "DOWNLOAD 60MP BATCH (ZIP)"
                    : (credits <= 0 && !isAdmin)
                      ? "INSUFFICIENT CREDITS"
                      : `INITIATE 60MP BATCH UPSCALE${!isVIP ? ' (TRIAL)' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V8MasterEngine60MP;
// KRAJ FAJLA: V8MasterEngine60MP.jsx