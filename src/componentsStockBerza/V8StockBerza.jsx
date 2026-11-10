// ============================================================================
// POČETAK FAJLA: src/V8StockBerza.jsx (EDITORIAL GALLERY LIGHT MODE)
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from '../data';
import {
  Zap, X, Image as ImageIcon, Images, DownloadCloud, Crown, AlertCircle,
  Type, Layers, FolderArchive, FileText, Wallet, MonitorPlay, Link as LinkIcon,
  Diamond, RefreshCcw, Aperture, ShieldCheck, Edit, Trash2, Sparkles,
  Compass, Utensils, Mail, CheckCircle2, ChevronDown
} from 'lucide-react';
import { db, auth } from '../firebase';
import {
  collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp,
  query, getDoc, setDoc, where, onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { v8Toast } from '../v8Utils';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import V8SecureCheckout from '../V8SecureCheckout';
import LoginRequiredModal from '../LoginRequiredModal';
import { trackV8Action } from '../utils/analytics';

class V8ErrorGuard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 [V8 ŠTIT UHVATIO GREŠKU EKSTENZIJE]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F7F4] flex flex-col items-center justify-center p-6 text-center z-[999999] relative text-stone-900">
          <AlertCircle size={56} className="text-amber-700 mb-6" />
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest mb-4">Sistemska Blokada</h1>
          <p className="text-stone-600 max-w-md mx-auto mb-8 font-medium leading-relaxed">
            Vaš pretraživač ili aktivna ekstenzija blokira učitavanje modula. Pauzirajte ad-blocker ili osvežite stranicu.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-[#111111] hover:bg-stone-800 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-md mx-auto cursor-pointer"
          >
            <RefreshCcw size={18} /> Osveži Sistem
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const FullScreenLightbox = ({ imageUrl, onClose }) => {
  useEffect(() => {
    if (imageUrl) {
      document.body.style.overflow = 'hidden';
      trackV8Action('image_zoom', { event_category: 'Engagement' });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [imageUrl]);

  if (!imageUrl) return null;
  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-stone-950/95 backdrop-blur-md flex items-center justify-center p-4" onClick={onClose}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-6 right-6 md:top-10 md:right-10 bg-white hover:bg-stone-200 text-stone-900 p-3.5 rounded-full font-black z-[1000000] transition-all hover:scale-105 cursor-pointer shadow-xl"
      >
        <X size={26} strokeWidth={2.5} />
      </button>
      <img
        src={imageUrl}
        alt="150MP Full Screen Inspection"
        className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl relative z-[999999] border border-white/15"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body
  );
};

// ============================================================================
// KOMERCIJALNE B2B KATEGORIJE (EDITORIAL LIGHT GALERIJA)
// ============================================================================
const INDUSTRY_TABS = [
  {
    id: 'all',
    label: 'All Commercial Vaults',
    shortLabel: 'ALL VAULTS',
    formatCode: 'V10 LUXURY GOODS (10x 4K + 10x 150MP)',
    icon: Layers,
    headline: 'COMMERCIAL 150MP + 4K CAMPAIGN ARCHIVE',
    subheadline: '100% IP-SAFE, UNBRANDED COMMERCIAL VISUAL PACKAGES FOR LUXURY BRANDS, CREATIVE DIRECTORS & ADVERTISING AGENCIES. EVERY ZIP INCLUDES 10× 4K UHD DIGITAL FILES + 10× 150MP MASTER PRINT FILES.'
  },
  {
    id: 'luxury_goods',
    label: 'Watches, Jewelry & Perfumes',
    shortLabel: 'LUXURY GOODS',
    formatCode: 'V10 LUXURY GOODS (10x 4K + 10x 150MP)',
    icon: Diamond,
    headline: 'WATCHES, FINE JEWELRY, PERFUMES & COUTURE',
    subheadline: 'BLANK-LABEL HOROLOGY, HIGH-JEWELRY DIAMONDS, FRAGRANCE FLACONS, HANDBAGS & EYEWEAR. ZERO LOGOS—READY FOR INSTANT BRAND COMPOSITING & BILLBOARD PRINT.'
  },
  {
    id: 'beauty',
    label: 'Beauty, Skincare & Editorial',
    shortLabel: 'BEAUTY & SKINCARE',
    formatCode: 'V10 BEAUTY & SKINCARE (10x 4K + 10x 150MP)',
    icon: Sparkles,
    headline: 'ANONYMOUS BEAUTY, SKINCARE & COSMETIC TEXTURES',
    subheadline: '100% IP-SAFE BEAUTY ADVERTISING CROPS WITH NATURAL SKIN MICROTEXTURE, SERUM DROPLETS & GLOSSY EDITORIAL LIGHTING. NO IDENTIFIABLE FACES OR TRADEMARKS.'
  },
  {
    id: 'aviation_interior',
    label: 'Jets, Yachts & Architecture',
    shortLabel: 'JETS, YACHTS & INTERIORS',
    formatCode: 'V10 JETS YACHTS & INTERIORS (10x 4K + 10x 150MP)',
    icon: Compass,
    headline: 'PRIVATE AVIATION, SUPERYACHTS & ULTRA-PRIME REAL ESTATE',
    subheadline: 'BESPOKE PRIVATE JET CABINS, SUPERYACHT DECKS, PENTHOUSE INTERIORS & ARCHITECTURAL EXTERIORS ENGINEERED FOR CHARTER BROKERS, REAL ESTATE & WEALTH BRANDS.'
  },
  {
    id: 'gastronomy',
    label: 'Michelin Gastronomy',
    shortLabel: 'MICHELIN FOOD',
    formatCode: 'V10 MICHELIN GASTRONOMY (10x 4K + 10x 150MP)',
    icon: Utensils,
    headline: 'MICHELIN MOLECULAR GASTRONOMY & FINE DINING',
    subheadline: 'CULINARY PLATING, FINE SPIRITS & FIVE-STAR HOSPITALITY VISUALS IN RAZOR-SHARP 4K UHD & 150MP MASTER PRINT RESOLUTION.'
  },
  {
    id: 'cinematic',
    label: 'Cinematic & Legacy Collections',
    shortLabel: 'CINEMATIC & LEGACY',
    formatCode: 'V10 CINEMATIC & WORLD (10x 4K + 10x 150MP)',
    icon: Crown,
    headline: 'CINEMATIC REALMS, ANCIENT ARCHITECTURE & SIGNATURE PACKS',
    subheadline: 'HIGH-IMPACT KEY ART, HISTORICAL MONUMENTS & MULTI-RATIO PRODUCTION BUNDLES FOR FILM STUDIOS, PUBLISHERS & GAME DEVELOPERS.'
  }
];

const DEFAULT_DESCRIPTIONS = {
  'V10 LUXURY GOODS (10x 4K + 10x 150MP)':
    "COMMERCIAL CAMPAIGN DELIVERY: 20 PRODUCTION FILES (10× 4K UHD FOR WEB/SOCIAL + SAME 10× 150MP MASTER FILES FOR LARGE-FORMAT BILLBOARD & PRINT).\n• 100% Unbranded & Blank-Label Luxury Product Photography (Zero logos, zero trademarks, zero watermarks).\n• Shot-matched Phase One XF IQ4 150MP macro aesthetics with natural highlight rolloff, sRGB ICC color profile, and cleaned EXIF metadata.\n• Ready for luxury e-commerce hero banners, packaging mockups, jewelry/watch catalogs, and agency client campaigns.",
  'V10 BEAUTY & SKINCARE (10x 4K + 10x 150MP)':
    "COMMERCIAL BEAUTY CAMPAIGN DELIVERY: 20 PRODUCTION FILES (10× 4K UHD + SAME 10× 150MP MASTER PRINT FILES).\n• 100% IP-Safe Anonymous Beauty & Skincare Macro Photography—no identifiable faces, no celebrity likeness, no brand labels.\n• Natural skin pore microtexture, realistic serum hydration droplets, and high-end studio beauty-dish lighting.\n• Engineered for cosmetic brands, aesthetic clinics, spa resorts, and global beauty ad campaigns.",
  'V10 JETS YACHTS & INTERIORS (10x 4K + 10x 150MP)':
    "ULTRA-PRIME HOSPITALITY & AVIATION DELIVERY: 20 PRODUCTION FILES (10× 4K UHD + SAME 10× 150MP MASTER PRINT FILES).\n• Bespoke private jet interiors, superyacht lounges, architectural villas, and luxury penthouses.\n• Flawless interior/exterior dynamic range, sRGB ICC color accuracy, and 100% IP-safe commercial licensing.\n• Built for private charter brokers, luxury real estate agencies, architects, and wealth management firms.",
  'V10 MICHELIN GASTRONOMY (10x 4K + 10x 150MP)':
    "FINE-DINING & HOSPITALITY DELIVERY: 20 PRODUCTION FILES (10× 4K UHD + SAME 10× 150MP MASTER PRINT FILES).\n• Michelin-grade culinary plating, artisanal cocktails, and moody five-star restaurant aesthetics.\n• Crisp macro surface textures, natural steam/liquid highlights, and zero brand trademarks.\n• Ideal for luxury restaurants, digital QR menus, hotel groups, and gourmet packaging.",
  'V10 CINEMATIC & WORLD (10x 4K + 10x 150MP)':
    "CINEMATIC KEY-ART DELIVERY: 20 PRODUCTION FILES (10× 4K UHD + SAME 10× 150MP MASTER PRINT FILES).\n• Epic world-building environments, historical reconstructions, and atmospheric concept visuals.\n• Processed via V10 Master Engine with LANCZOS interpolation, anti-plastic organic micro-grain, and full commercial usage rights."
};

const detectIndustry = (paket) => {
  const text = `${paket.format || ''} ${paket.kategorijaEn || ''} ${paket.nazivEn || ''} ${paket.opisEn || ''}`.toUpperCase();

  if (
    text.includes('LUXURY GOODS') || text.includes('WATCH') || text.includes('SAT') ||
    text.includes('JEWEL') || text.includes('DIAMOND') || text.includes('PERFUME') ||
    text.includes('PARFEM') || text.includes('FRAGRANCE') || text.includes('BAG') ||
    text.includes('TORB') || text.includes('EYEWEAR') || text.includes('SUNGLASS') ||
    text.includes('RING') || text.includes('NECKLACE') || text.includes('GOLD')
  ) {
    return 'luxury_goods';
  }
  if (
    text.includes('BEAUTY') || text.includes('SKINCARE') || text.includes('MAKEUP') ||
    text.includes('SERUM') || text.includes('COSMETIC') || text.includes('SPA') ||
    text.includes('SKIN') || text.includes('LIP')
  ) {
    return 'beauty';
  }
  if (
    text.includes('JET') || text.includes('YACHT') || text.includes('AVIATION') ||
    text.includes('INTERIOR') || text.includes('EXTERIOR') || text.includes('ARCHITECT') ||
    text.includes('VILLA') || text.includes('REAL ESTATE') || text.includes('PENTHOUSE') ||
    text.includes('CABIN')
  ) {
    return 'aviation_interior';
  }
  if (
    text.includes('MICHELIN') || text.includes('GASTRONOM') || text.includes('FOOD') ||
    text.includes('CULINARY') || text.includes('RESTAURANT') || text.includes('DRINK') ||
    text.includes('CHEF') || text.includes('DISH')
  ) {
    return 'gastronomy';
  }
  return 'cinematic';
};

const V8StockBerzaBase = () => {
  const navigate = useNavigate();
  const [paketi, setPaketi] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [checkoutData, setCheckoutData] = useState({ isOpen: false, name: '', price: 0, zipLink: '' });
  const [loginRequiredData, setLoginRequiredData] = useState({ isOpen: false, paket: null, name: '', price: 0 });

  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPrimer, setIsUploadingPrimer] = useState(false);
  const [primeriUrls, setPrimeriUrls] = useState([]);
  const [editingPaketId, setEditingPaketId] = useState(null);
  const [fullScreenImageUrl, setFullScreenImageUrl] = useState(null);

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('v10_luxury_industry_tab');
    return INDUSTRY_TABS.some(t => t.id === saved) ? saved : 'all';
  });

  useEffect(() => {
    localStorage.setItem('v10_luxury_industry_tab', activeTab);
    trackV8Action('tab_view', { event_category: 'Luxury_Store_Light', event_label: activeTab });
  }, [activeTab]);

  // Lead Magnet State (1 Free 150MP + 4K Sample za email)
  const [sampleEmail, setSampleEmail] = useState('');
  const [sampleUnlocked, setSampleUnlocked] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [customSampleUrl, setCustomSampleUrl] = useState('');
  const [adminSampleInput, setAdminSampleInput] = useState('');

  const [showTechSpecs, setShowTechSpecs] = useState(false);

  const [kupljeniPaketiIds, setKupljeniPaketiIds] = useState([]);
  const [paidPayoneer, setPaidPayoneer] = useState([]);
  const [paidCrypto, setPaidCrypto] = useState([]);
  const [paidPaypal, setPaidPaypal] = useState([]);

  // Admin Forma State
  const [noviNazivEn, setNoviNazivEn] = useState('');
  const [noviVolume, setNoviVolume] = useState('10x 4K UHD + 10x 150MP');
  const [noviFormat, setNoviFormat] = useState('V10 LUXURY GOODS (10x 4K + 10x 150MP)');
  const [novaKategorijaEn, setNovaKategorijaEn] = useState('');
  const [novaCena, setNovaCena] = useState('79.00');
  const [noviTip] = useState('Image');
  const [noviOpisEn, setNoviOpisEn] = useState(DEFAULT_DESCRIPTIONS['V10 LUXURY GOODS (10x 4K + 10x 150MP)']);
  const [previewUrl, setPreviewUrl] = useState('');
  const [zipLink, setZipLink] = useState('');
  const [isFree, setIsFree] = useState(false);

  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.email === "damnjanovicgoran7@gmail.com" || user.email === "aitoolsprosmart@gmail.com");
      } else {
        setCurrentUser(null);
        setIsAdmin(false);
        setKupljeniPaketiIds([]);
      }
    });

    const q = query(collection(db, "v8_stock_paketi"));
    const unsubPaketi = onSnapshot(q, (snap) => {
      let ucitani = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      ucitani.sort((a, b) => {
        const getMs = (dateObj) => {
          if (!dateObj) return 0;
          if (dateObj.toMillis) return dateObj.toMillis();
          if (dateObj.seconds) return dateObj.seconds * 1000;
          return new Date(dateObj).getTime() || 0;
        };
        const timeA = getMs(a.createdAt) || getMs(a.updatedAt) || 0;
        const timeB = getMs(b.createdAt) || getMs(b.updatedAt) || 0;
        return timeB - timeA;
      });
      setPaketi(ucitani);
    }, (error) => {
      console.error("🚨 [V8 SYSTEM] Firestore onSnapshot Error:", error);
    });

    getDoc(doc(db, "v8_settings", "free_sample_config")).then((snap) => {
      if (snap.exists() && snap.data().sampleZipUrl) {
        setCustomSampleUrl(snap.data().sampleZipUrl);
        setAdminSampleInput(snap.data().sampleZipUrl);
      }
    }).catch(() => {});

    return () => {
      unsubAuth();
      unsubPaketi();
    };
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setPaidPayoneer([]); setPaidCrypto([]); setPaidPaypal([]); return;
    }
    const qPayoneer = query(collection(db, "v8_payoneer_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPayoneer = onSnapshot(qPayoneer, (snap) => {
      const items = []; snap.forEach(d => { if (d.data().paketId) items.push(d.data().paketId); });
      setPaidPayoneer(items);
    });

    const qCrypto = query(collection(db, "v8_crypto_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubCrypto = onSnapshot(qCrypto, (snap) => {
      const items = []; snap.forEach(d => { if (d.data().paketId) items.push(d.data().paketId); });
      setPaidCrypto(items);
    });

    const qPaypal = query(collection(db, "v8_paypal_requests"), where("uid", "==", currentUser.uid), where("isPaid", "==", true));
    const unsubPaypal = onSnapshot(qPaypal, (snap) => {
      const items = []; snap.forEach(d => { if (d.data().paketId) items.push(d.data().paketId); });
      setPaidPaypal(items);
    });

    return () => { unsubPayoneer(); unsubCrypto(); unsubPaypal(); };
  }, [currentUser]);

  useEffect(() => {
    const allPaid = Array.from(new Set([...paidPayoneer, ...paidCrypto, ...paidPaypal]));
    setKupljeniPaketiIds(allPaid);
  }, [paidPayoneer, paidCrypto, paidPaypal]);

  useEffect(() => {
    if (editingPaketId) return;
    const foundTab = INDUSTRY_TABS.find(t => t.id === activeTab);
    if (foundTab && activeTab !== 'all') {
      setNoviFormat(foundTab.formatCode);
      setNoviOpisEn(DEFAULT_DESCRIPTIONS[foundTab.formatCode] || DEFAULT_DESCRIPTIONS['V10 LUXURY GOODS (10x 4K + 10x 150MP)']);
    }
  }, [activeTab, editingPaketId]);

  const handleFormatRadioChange = (fmt) => {
    setNoviFormat(fmt);
    if (!editingPaketId && DEFAULT_DESCRIPTIONS[fmt]) {
      setNoviOpisEn(DEFAULT_DESCRIPTIONS[fmt]);
    }
  };

  const getGlobalCena = (cena) => {
    const numCena = parseFloat(cena);
    return isNaN(numCena) ? "0.00" : numCena.toFixed(2);
  };

  const handleSaveSampleConfig = async () => {
    try {
      await setDoc(doc(db, "v8_settings", "free_sample_config"), {
        sampleZipUrl: adminSampleInput.trim(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      setCustomSampleUrl(adminSampleInput.trim());
      if (typeof v8Toast !== 'undefined') v8Toast.success("✅ Free 150MP Sample Link Saved!");
    } catch (err) {
      alert("Error saving sample link: " + err.message);
    }
  };

  const handleUnlockFreeSample = async (e) => {
    e.preventDefault();
    if (!sampleEmail.trim()) return;
    setIsSubmittingLead(true);

    try {
      await addDoc(collection(db, "v8_b2b_sample_leads"), {
        email: sampleEmail.trim().toLowerCase(),
        activeIndustry: activeTab,
        createdAt: serverTimestamp()
      });
      trackV8Action('b2b_sample_lead_captured', { industry: activeTab });
      setSampleUnlocked(true);
      if (typeof v8Toast !== 'undefined') v8Toast.success("🔓 150MP Master Sample Unlocked!");

      const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
      const targetDownload = customSampleUrl || fallbackFreePkg?.zipLink || '/VISIONARY_V10_ZIP_VALIDATION.txt';
      window.open(targetDownload, '_blank');
    } catch (err) {
      console.error(err);
      setSampleUnlocked(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const snimiKupcaUPayoneerBazu = async (user, paket) => {
    try {
      await addDoc(collection(db, "v8_payoneer_requests"), {
        ime: user.displayName || "Client",
        email: user.email,
        uid: user.uid,
        zeliPaket: paket.nazivEn || "Luxury Campaign Vault",
        paketId: paket.id,
        cenaPaketa: paket.cena,
        vreme: serverTimestamp(),
        isPaid: false
      });
      const userRef = doc(db, "vip_users", user.email.toLowerCase());
      const userSnap = await getDoc(userRef);
      const unlockedApps = userSnap.exists() ? userSnap.data().unlockedApps || [] : [];
      if (!unlockedApps.includes('V8_PROMPT_ENGINE')) {
        await setDoc(userRef, { unlockedApps: [...unlockedApps, 'V8_PROMPT_ENGINE'] }, { merge: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const otvoriCheckoutIliPaddle = async (user, paket) => {
    if (!user || !paket) return;
    const fullName = paket.volume ? `${paket.nazivEn} (${paket.volume})` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    await snimiKupcaUPayoneerBazu(user, paket);
    if (paket.paddleLink && paket.paddleLink.trim() !== "") {
      window.location.href = paket.paddleLink;
      return;
    }
    setCheckoutData({ isOpen: true, name: fullName, price: finalPrice, zipLink: paket.zipLink });
  };

  const prijavaIKupovina = async (paket) => {
    if (paket.isFree || paket.cena === "0.00" || parseFloat(paket.cena) === 0) {
      trackV8Action('free_asset_download', { asset_name: paket.nazivEn });
      if (typeof v8Toast !== 'undefined') v8Toast.success("🚀 ACCESS GRANTED: Downloading Free 150MP Sample...");
      window.open(paket.zipLink, '_blank');
      return;
    }
    if (kupljeniPaketiIds.includes(paket.id)) {
      trackV8Action('owned_asset_download', { asset_name: paket.nazivEn });
      window.open(paket.zipLink, '_blank');
      return;
    }
    const fullName = paket.volume ? `${paket.nazivEn} (${paket.volume})` : paket.nazivEn;
    const finalPrice = getGlobalCena(paket.cena);
    const userNow = currentUser || auth.currentUser;
    trackV8Action('checkout_initiated', { event_category: 'B2B_Sales', item_name: fullName, value: Number(finalPrice), currency: 'USD' });
    if (userNow) {
      await otvoriCheckoutIliPaddle(userNow, paket);
      return;
    }
    setLoginRequiredData({ isOpen: true, paket, name: fullName, price: finalPrice });
  };

  const handleUploadPreview = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      setPreviewUrl(resData.secure_url);
    } catch {
      v8Toast.error("Upload error!");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  const handleUploadPrimeri = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const slobodnaMesta = 10 - primeriUrls.length;
    if (slobodnaMesta <= 0) return;
    setIsUploadingPrimer(true);
    const noveSlike = [];
    try {
      for (const file of files.slice(0, slobodnaMesta)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
        const resData = await res.json();
        noveSlike.push(resData.secure_url);
      }
      setPrimeriUrls(prev => [...prev, ...noveSlike]);
    } catch {
      // ignore
    } finally {
      setIsUploadingPrimer(false);
      e.target.value = null;
    }
  };

  const dodajPaket = async (e) => {
    e.preventDefault();
    if (!previewUrl || !zipLink) {
      v8Toast.error("Main Cover Image & Google Drive ZIP link are required!");
      return;
    }

    const paketData = {
      nazivEn: noviNazivEn.trim(),
      volume: noviVolume.trim() || '10x 4K UHD + 10x 150MP',
      format: noviFormat,
      kategorijaEn: novaKategorijaEn.trim(),
      cena: isFree ? "0.00" : novaCena,
      tip: noviTip,
      opisEn: noviOpisEn,
      previewUrl,
      zipLink,
      isFree,
      primeri: primeriUrls,
      updatedAt: serverTimestamp()
    };

    try {
      if (editingPaketId) {
        await updateDoc(doc(db, "v8_stock_paketi", editingPaketId), paketData);
        v8Toast.success("Campaign Package Updated!");
      } else {
        await addDoc(collection(db, "v8_stock_paketi"), { ...paketData, createdAt: serverTimestamp() });
        v8Toast.success("New Campaign Package Published!");
      }
      stoziEdit();
    } catch (error) {
      v8Toast.error(error.message);
    }
  };

  const startEditPaket = (paket) => {
    setEditingPaketId(paket.id);
    setNoviNazivEn(paket.nazivEn || '');
    setNoviVolume(paket.volume || '10x 4K UHD + 10x 150MP');
    setNoviFormat(paket.format || 'V10 LUXURY GOODS (10x 4K + 10x 150MP)');
    setNovaKategorijaEn(paket.kategorijaEn || '');
    setNovaCena(paket.cena || '79.00');
    setNoviOpisEn(paket.opisEn || '');
    setPreviewUrl(paket.previewUrl || '');
    setZipLink(paket.zipLink || '');
    setIsFree(paket.isFree || false);
    setPrimeriUrls(paket.primeri || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stoziEdit = () => {
    setEditingPaketId(null);
    setNoviNazivEn('');
    setNoviVolume('10x 4K UHD + 10x 150MP');
    setNoviFormat('V10 LUXURY GOODS (10x 4K + 10x 150MP)');
    setNovaKategorijaEn('');
    setNovaCena('79.00');
    setPreviewUrl('');
    setZipLink('');
    setIsFree(false);
    setPrimeriUrls([]);
  };

  const obrisiPaket = async (id) => {
    if (window.confirm("Remove this package permanently?")) {
      await deleteDoc(doc(db, "v8_stock_paketi", id));
    }
  };

  const currentTabInfo = INDUSTRY_TABS.find(t => t.id === activeTab) || INDUSTRY_TABS[0];
  const filtriraniPaketi = activeTab === 'all'
    ? paketi
    : paketi.filter(p => detectIndustry(p) === activeTab);

  const getCountForTab = (tabId) => {
    if (tabId === 'all') return paketi.length;
    return paketi.filter(p => detectIndustry(p) === tabId).length;
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#141413] font-sans relative pb-28">
      <Helmet>
        <title>Luxury Commercial 150MP + 4K Campaign Archive | AI Tools Pro Smart</title>
        <meta
          name="description"
          content="100% IP-safe commercial 150MP print & 4K UHD visual campaign packages for luxury watches, perfumes, skincare, private aviation, superyachts, and Michelin gastronomy."
        />
      </Helmet>

      <div className="relative z-10 pt-28 px-4 sm:px-6 max-w-[1600px] mx-auto">

        {/* =================================================================== */}
        {/* 1. EDITORIAL GALLERY HERO SECTION (WARM ALABASTER & ESPRESSO)       */}
        {/* =================================================================== */}
        <div className="rounded-[2.25rem] bg-white border border-stone-200/90 shadow-[0_20px_50px_rgba(20,20,19,0.04)] p-8 md:p-14 mb-8 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E5D7C3] text-[#8C6239] text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.22em] mb-6">
            <span>100% IP-Safe Unbranded Commercial Archive</span>
            <span className="opacity-40">•</span>
            <span>Dual Delivery: 10× 4K UHD + 10× 150MP Master Print</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black uppercase tracking-tight text-[#111111] max-w-5xl mx-auto leading-[1.08] mb-5">
            {currentTabInfo.headline}
          </h1>

          <p className="text-stone-500 text-xs sm:text-[13px] font-semibold uppercase tracking-[0.14em] max-w-4xl mx-auto leading-relaxed mb-10">
            {currentTabInfo.subheadline}
          </p>

          {/* ČISTI MUZEJSKI TABOVI BEZ ŠARENILA */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-6xl mx-auto">
            {INDUSTRY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const count = getCountForTab(tab.id);
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3.5 sm:px-5 sm:py-3.5 rounded-xl font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-all flex items-center gap-2.5 cursor-pointer border ${
                    isActive
                      ? 'bg-[#111111] text-white border-[#111111] shadow-[0_10px_24px_rgba(0,0,0,0.14)] scale-[1.02]'
                      : 'bg-[#F8F7F4] text-stone-600 border-stone-200/90 hover:bg-white hover:border-stone-400 hover:text-[#111111]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#D4AF37]' : 'text-stone-400'}`} />
                  <span>{tab.shortLabel}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/15 text-white' : 'bg-stone-200/70 text-stone-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. B2B LEAD MAGNET BAR (SVETLI ŠAMPANJ-PESAK STIL)                  */}
        {/* =================================================================== */}
        <div className="mb-14 rounded-3xl bg-[#F3EFE6] border border-[#E2D9C8] p-6 sm:p-8 shadow-[0_10px_30px_rgba(20,20,19,0.03)]">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.2em] mb-2.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Agency Quality Verification • Zero Risk
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111]">
                Inspect True 150MP + 4K Resolution Before Licensing
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
                Creative directors & designers: enter your work email to instantly unlock a complimentary <strong>150MP Master Print + 4K UHD Commercial Sample</strong> with embedded sRGB ICC profile and zero watermarks.
              </p>
            </div>

            {!sampleUnlocked ? (
              <form onSubmit={handleUnlockFreeSample} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2.5 shrink-0">
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={sampleEmail}
                    onChange={(e) => setSampleEmail(e.target.value)}
                    placeholder="Enter agency or work email..."
                    className="w-full sm:w-72 bg-white border border-stone-300 focus:border-[#111111] rounded-xl pl-11 pr-4 py-3.5 text-xs sm:text-sm text-[#111111] placeholder:text-stone-400 outline-none shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="px-6 py-3.5 bg-[#111111] hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md transition cursor-pointer whitespace-nowrap"
                >
                  {isSubmittingLead ? 'Unlocking...' : 'Download 150MP Sample'}
                </button>
              </form>
            ) : (
              <div className="bg-white border border-emerald-300 rounded-2xl px-6 py-4 text-center shadow-sm">
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800">
                  ✓ Master Sample Unlocked! Check Your New Tab
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const fallbackFreePkg = paketi.find(p => p.isFree || parseFloat(p.cena) === 0);
                    window.open(customSampleUrl || fallbackFreePkg?.zipLink || '/VISIONARY_V10_ZIP_VALIDATION.txt', '_blank');
                  }}
                  className="mt-1.5 text-[11px] underline text-[#111111] font-bold cursor-pointer"
                >
                  Click here if download didn't start automatically
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <div className="mt-5 pt-4 border-t border-stone-300/70 flex flex-col sm:flex-row items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#8C6239] shrink-0">
                🔧 ADMIN — Free 150MP Sample Google Drive Link:
              </span>
              <input
                type="url"
                value={adminSampleInput}
                onChange={(e) => setAdminSampleInput(e.target.value)}
                placeholder="Paste Google Drive link to your 1-image Free 150MP + 4K Sample ZIP..."
                className="flex-1 w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-[#111111] outline-none"
              />
              <button
                type="button"
                onClick={handleSaveSampleConfig}
                className="px-4 py-2 bg-[#111111] hover:bg-stone-800 text-white font-bold text-[11px] uppercase tracking-wider rounded-lg cursor-pointer shrink-0"
              >
                Save Sample Link
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 3. ADMIN FORMA ZA UBACIVANJE PAKETA (ČISTA BELA RADNA STANICA)      */}
        {/* =================================================================== */}
        {isAdmin && (
          <form onSubmit={dodajPaket} className="bg-white border-2 border-stone-300 rounded-[2rem] p-6 md:p-8 mb-16 shadow-[0_15px_40px_rgba(0,0,0,0.06)] max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4 mb-6">
              <h2 className="text-lg md:text-xl font-black text-[#111111] uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#8C6239]" /> {editingPaketId ? 'EDIT B2B CAMPAIGN PACKAGE' : 'PUBLISH NEW B2B PACKAGE (10x 4K + 10x 150MP)'}
              </h2>
              {editingPaketId && (
                <button type="button" onClick={stoziEdit} className="text-xs font-bold uppercase px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-800 cursor-pointer">
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                  <Type size={14} /> CAMPAIGN PACKAGE TITLE
                </label>
                <input
                  type="text"
                  value={noviNazivEn}
                  onChange={(e) => setNoviNazivEn(e.target.value)}
                  placeholder="E.g. Obsidian Watches & Diamonds Vol. 1"
                  className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-sm font-bold text-[#111111] outline-none focus:bg-white focus:border-[#111111]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                  <Layers size={14} /> SUB-NICHE TAG
                </label>
                <input
                  type="text"
                  value={novaKategorijaEn}
                  onChange={(e) => setNovaKategorijaEn(e.target.value)}
                  placeholder="E.g. Blank-Label Perfumes / Private Jets"
                  className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-sm font-bold text-[#111111] outline-none focus:bg-white focus:border-[#111111]"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                  <FolderArchive size={14} /> DELIVERY BADGE (VOLUME)
                </label>
                <input
                  type="text"
                  value={noviVolume}
                  onChange={(e) => setNoviVolume(e.target.value)}
                  placeholder="10x 4K UHD + 10x 150MP"
                  className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-sm font-bold text-[#111111] outline-none focus:bg-white focus:border-[#111111]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <div className="flex flex-col gap-2 md:col-span-1">
                <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                  <FileText size={14} /> COMMERCIAL DESCRIPTION
                </label>
                <textarea
                  value={noviOpisEn}
                  onChange={(e) => setNoviOpisEn(e.target.value)}
                  rows={6}
                  className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-xs font-medium text-stone-700 outline-none focus:bg-white focus:border-[#111111] resize-none h-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-5 md:col-span-2">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                    <Wallet size={14} /> COMMERCIAL LICENSE PRICE (USD)
                  </label>
                  <input
                    type="text"
                    value={novaCena}
                    onChange={(e) => setNovaCena(e.target.value)}
                    disabled={isFree}
                    placeholder="79.00"
                    className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-sm font-black text-[#111111] outline-none focus:bg-white focus:border-[#111111]"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-stone-600 font-extrabold text-[11px] tracking-widest uppercase">
                    <MonitorPlay size={14} /> SELECT TARGET B2B INDUSTRY TAB
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {INDUSTRY_TABS.filter(t => t.id !== 'all').map((t) => (
                      <label
                        key={t.formatCode}
                        className={`cursor-pointer p-3 rounded-xl border text-center font-extrabold text-[10px] uppercase tracking-wider transition-all ${
                          noviFormat === t.formatCode
                            ? 'bg-[#111111] text-white border-[#111111] shadow-sm'
                            : 'bg-[#F8F7F4] border-stone-200 text-stone-600 hover:border-stone-400 hover:text-[#111111]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={t.formatCode}
                          checked={noviFormat === t.formatCode}
                          onChange={() => handleFormatRadioChange(t.formatCode)}
                          className="hidden"
                        />
                        {t.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-stone-700 font-extrabold text-[11px] tracking-widest uppercase">
                    <LinkIcon size={14} /> GOOGLE DRIVE ZIP LINK (10x 4K + 10x 150MP)
                  </label>
                  <input
                    type="url"
                    value={zipLink}
                    onChange={(e) => setZipLink(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="bg-[#F8F7F4] border border-stone-300 p-3.5 rounded-xl text-xs font-bold text-[#111111] outline-none focus:bg-white focus:border-[#111111]"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-stone-700 font-extrabold text-[11px] tracking-widest uppercase">
                    <Zap size={14} /> PACKAGE ACCESS TYPE
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isFree;
                      setIsFree(next);
                      setNovaCena(next ? "0.00" : "79.00");
                    }}
                    className={`w-full p-3.5 rounded-xl font-extrabold text-xs tracking-widest uppercase border transition-all cursor-pointer ${
                      isFree
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-[#F8F7F4] border-stone-300 text-stone-600 hover:text-[#111111]'
                    }`}
                  >
                    {isFree ? "⚡ FREE LEAD-MAGNET PACKAGE ($0.00)" : "PAID COMMERCIAL LICENSE"}
                  </button>
                </div>
              </div>

              {(previewUrl || primeriUrls.length > 0) && (
                <div className="flex flex-wrap gap-3 p-4 bg-[#F8F7F4] rounded-xl border border-stone-200 mb-5">
                  {previewUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-[#111111] group">
                      <span className="absolute top-0 left-0 bg-[#111111] text-white text-[8px] font-black px-1.5 py-0.5 z-10">COVER</span>
                      <button type="button" onClick={() => setPreviewUrl('')} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 z-20 cursor-pointer">
                        <X size={10} />
                      </button>
                      <img src={previewUrl} alt="Main" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {primeriUrls.map((url, idx) => (
                    <div key={idx} className="w-20 h-20 rounded-lg overflow-hidden border border-stone-300 relative group">
                      <span className="absolute bottom-0 right-0 bg-[#111111]/85 text-white text-[8px] font-black px-1.5 py-0.5 z-10">#{idx + 1}</span>
                      <button type="button" onClick={() => setPrimeriUrls(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 z-20 cursor-pointer">
                        <X size={10} />
                      </button>
                      <img src={url} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => mainImageRef.current.click()}
                    className="bg-[#F8F7F4] hover:bg-stone-200 text-[#111111] border border-stone-300 px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                  >
                    <ImageIcon size={16} /> {isUploading ? 'Uploading...' : 'Upload Main Cover'}
                  </button>
                  <input type="file" ref={mainImageRef} onChange={handleUploadPreview} className="hidden" />

                  <button
                    type="button"
                    onClick={() => galleryImagesRef.current.click()}
                    className="bg-[#F8F7F4] hover:bg-stone-200 text-[#111111] border border-stone-300 px-5 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer"
                  >
                    <Images size={16} /> {isUploadingPrimer ? 'Uploading...' : `Upload 10 Previews (${primeriUrls.length}/10)`}
                  </button>
                  <input type="file" multiple ref={galleryImagesRef} onChange={handleUploadPrimeri} className="hidden" />
                </div>

                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase bg-[#111111] hover:bg-stone-800 text-white shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <Zap size={16} className="text-[#D4AF37]" /> {editingPaketId ? 'SAVE UPDATES' : 'PUBLISH TO STORE'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* =================================================================== */}
        {/* 4. EDITORIAL LIGHT PRODUCT CARDS (MUZEJSKA PREZENTACIJA)            */}
        {/* =================================================================== */}
        {filtriraniPaketi.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200 rounded-3xl mb-16 shadow-sm">
            <Aperture className="w-11 h-11 text-[#8C6239] mx-auto mb-3 opacity-80" />
            <h3 className="text-lg font-black uppercase tracking-widest text-[#111111]">
              New 150MP + 4K Campaign Vaults Arriving in This Category
            </h3>
            <p className="text-xs text-stone-500 mt-2 mb-6">
              Switch to "ALL VAULTS" to browse all currently published commercial packages, or upload a new ZIP above.
            </p>
            {activeTab !== 'all' && (
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="px-6 py-3.5 bg-[#111111] hover:bg-stone-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl cursor-pointer"
              >
                Show All Published Packages ({paketi.length})
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {filtriraniPaketi.map((paket) => {
              const isOwned = kupljeniPaketiIds?.includes(paket.id) || paket.isFree || parseFloat(paket.cena) === 0;
              return (
                <div
                  key={paket.id}
                  className="bg-white border border-stone-200/90 hover:border-stone-400 rounded-[2rem] overflow-hidden shadow-[0_12px_36px_rgba(20,20,19,0.05)] hover:shadow-[0_24px_60px_rgba(20,20,19,0.1)] transition-all duration-300 flex flex-col"
                >
                  {/* SLIKA U MIRNOM MUZEJSKOM PASPARTU OKVIRU */}
                  <div className="p-4 sm:p-5 relative bg-[#FBFAF8] border-b border-stone-100">
                    <div className="absolute top-7 left-7 z-20 flex flex-wrap gap-2">
                      <span className="bg-white/95 backdrop-blur-md border border-stone-200 text-[#111111] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {paket.volume || '10× 4K UHD + 10× 150MP'}
                      </span>
                      {paket.kategorijaEn && (
                        <span className="bg-[#FAF6F0]/95 backdrop-blur-md border border-[#E5D7C3] text-[#8C6239] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                          {paket.kategorijaEn}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-7 right-7 z-20">
                      <span className="bg-[#111111] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        IP-SAFE COMMERCIAL
                      </span>
                    </div>

                    <div
                      onClick={() => setFullScreenImageUrl(paket.previewUrl)}
                      className="w-full aspect-[16/9] rounded-2xl overflow-hidden cursor-zoom-in relative group border border-stone-200/80 bg-stone-100"
                    >
                      <img
                        src={paket.previewUrl}
                        alt={paket.nazivEn}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                        <span className="text-[11px] font-bold uppercase tracking-widest text-white">
                          Click to Inspect Full-Screen Detail
                        </span>
                      </div>
                    </div>

                    {/* 10 THUMBNAIL SLIKA BEZ TRZANJA I ROTACIJE */}
                    {paket.primeri && paket.primeri.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        {paket.primeri.slice(0, 10).map((thumb, idx) => (
                          <div
                            key={idx}
                            onClick={() => setFullScreenImageUrl(thumb)}
                            className="aspect-square rounded-xl overflow-hidden cursor-zoom-in border border-stone-200 hover:border-[#111111] transition bg-stone-100"
                          >
                            <img
                              src={thumb}
                              alt={`Asset ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* OPIS, SPECIFIKACIJE I KUPOVINA */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow bg-white">
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] mb-4">
                      {paket.nazivEn}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
                      <div className="bg-[#F8F7F4] border border-stone-200/90 rounded-xl p-3 flex items-center gap-2.5">
                        <Aperture className="w-4 h-4 text-[#8C6239] shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-800">
                          Dual Resolution: 4K Web + 150MP Print
                        </span>
                      </div>
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                          Zero Logos • Commercial License
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line mb-6 flex-grow">
                      {paket.opisEn}
                    </p>

                    <div className="pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                      <div className="text-center sm:text-left">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block mb-0.5">
                          Instant .ZIP Delivery • Full Commercial Rights
                        </span>
                        <span className="text-3xl sm:text-4xl font-black text-[#111111]">
                          ${getGlobalCena(paket.cena)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (isAdmin || isOwned) {
                              window.open(paket.zipLink, '_blank');
                            } else {
                              prijavaIKupovina(paket);
                            }
                          }}
                          className={`flex-1 sm:flex-initial px-7 py-4 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                            !isAdmin && isOwned
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-[#111111] hover:bg-stone-800 text-white'
                          }`}
                        >
                          {(isAdmin || isOwned) ? (
                            <><DownloadCloud size={16} /> Download ZIP</>
                          ) : (
                            <><Diamond size={15} className="text-[#D4AF37]" /> Buy Commercial Pack</>
                          )}
                        </button>
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="mt-5 pt-4 border-t border-stone-200 flex gap-3">
                        <button
                          type="button"
                          onClick={() => startEditPaket(paket)}
                          className="flex-1 bg-[#F8F7F4] hover:bg-[#111111] text-stone-700 hover:text-white border border-stone-200 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Edit size={13} /> Edit Package
                        </button>
                        <button
                          type="button"
                          onClick={() => obrisiPaket(paket.id)}
                          className="flex-1 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. SKLOPLJEN TEHNIČKI SERTIFIKAT NA DNU (SVETLA VERZIJA)            */}
        {/* =================================================================== */}
        <div className="max-w-5xl mx-auto border border-stone-200 bg-white rounded-3xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setShowTechSpecs(!showTechSpecs)}
            className="w-full p-6 flex items-center justify-between text-left hover:bg-[#F8F7F4] transition cursor-pointer"
          >
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8C6239] block">
                V10 Master Engine • Agency Quality Assurance
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111] mt-0.5">
                View 150MP Technical Pipeline, Color Science & IP-Safe Certification
              </h3>
            </div>
            <ChevronDown className={`w-6 h-6 text-stone-500 transition-transform ${showTechSpecs ? 'rotate-180' : ''}`} />
          </button>

          {showTechSpecs && (
            <div className="p-6 pt-2 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
              <div className="p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/70">
                <strong className="text-[#111111] uppercase block mb-1">1. Dual Commercial Delivery (4K + 150MP)</strong>
                Every campaign bundle includes 10× 4K UHD files optimized for websites, social ads, and pitch decks, plus the exact same 10 visuals upscaled to 150MP for billboards and luxury print.
              </div>
              <div className="p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/70">
                <strong className="text-[#111111] uppercase block mb-1">2. 100% IP-Safe & Unbranded Cleanliness</strong>
                Zero third-party logos, zero readable text, zero identifiable celebrity likenesses, and stripped EXIF metadata—ready for corporate legal approval.
              </div>
              <div className="p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/70">
                <strong className="text-[#111111] uppercase block mb-1">3. LANCZOS + Anti-Plastic Micro-Grain</strong>
                Processed with precision LANCZOS interpolation, MedianFilter noise cleanup, highlight rolloff protection, and subtle organic grain for authentic medium-format camera realism.
              </div>
              <div className="p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/70 flex flex-col justify-between">
                <div>
                  <strong className="text-[#111111] uppercase block mb-1">4. Embedded sRGB ICC & Enterprise License</strong>
                  Calibrated color accuracy across reference monitors and print RIP systems.
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="/PREMIUM ENTERPRISE LICENSE.pdf" target="_blank" rel="noopener noreferrer" download className="text-[10px] font-extrabold uppercase px-3 py-2 bg-[#111111] text-white hover:bg-stone-800 rounded-lg transition">
                    Download Enterprise License PDF
                  </a>
                  <button type="button" onClick={() => navigate('/stock-2')} className="text-[10px] font-extrabold uppercase px-3 py-2 bg-white border border-stone-300 text-stone-800 hover:border-[#111111] rounded-lg transition cursor-pointer">
                    Open Legacy Mystic/Ancient Vault →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      <LoginRequiredModal
        isOpen={loginRequiredData.isOpen}
        onClose={() => setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 })}
        packageName={loginRequiredData.name}
        price={loginRequiredData.price}
        onLoginSuccess={async (user) => {
          if (loginRequiredData.paket) await otvoriCheckoutIliPaddle(user, loginRequiredData.paket);
          setLoginRequiredData({ isOpen: false, paket: null, name: '', price: 0 });
        }}
      />
      <FullScreenLightbox imageUrl={fullScreenImageUrl} onClose={() => setFullScreenImageUrl(null)} />
      <AnimatePresence>
        {checkoutData.isOpen && (
          <V8SecureCheckout
            isOpen={checkoutData.isOpen}
            productName={checkoutData.name}
            price={checkoutData.price}
            zipLink={checkoutData.zipLink}
            onClose={() => setCheckoutData({ isOpen: false, name: '', price: 0, zipLink: '' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const V8StockBerza = () => (
  <V8ErrorGuard>
    <V8StockBerzaBase />
  </V8ErrorGuard>
);

export default V8StockBerza;
// KRAJ FAJLA: src/V8StockBerza.jsx