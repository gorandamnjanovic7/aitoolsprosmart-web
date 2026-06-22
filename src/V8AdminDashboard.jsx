// POČETAK FAJLA: V8AdminDashboard.jsx
// Ne zaboravi React source code link u repozitorijumu!

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, Users, Zap, Image as ImageIcon, CheckCircle, Activity, 
  PlayCircle, Loader2, UploadCloud, Trash2, DollarSign, Calendar, 
  Layers, Film, Sparkles, Flame, Crown, Rocket, 
  Star, Camera, Droplets, Hexagon, Globe, Bitcoin, FileText,
  PieChart, Eye, Clock, Filter 
} from 'lucide-react';
import { v8Toast } from './v8Utils';

import { db, auth } from './firebase';
import { collection, query, onSnapshot, orderBy, doc, serverTimestamp, getDoc, setDoc, addDoc, getDocs, deleteDoc, limit } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import * as data from './data'; 
import V8PayoneerDashboard from './V8PayoneerDashboard';

// POČETAK FUNKCIJE: V8AdminDashboard
const V8AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('payoneer_blagajna');
  const [sales, setSales] = useState([]);
  const [cryptoReqs, setCryptoReqs] = useState([]); 
  
  // 🔥 V8 ANALITIKA STATE 🔥
  const [analyticsData, setAnalyticsData] = useState([]);
  const [selectedAnalyticsFilter, setSelectedAnalyticsFilter] = useState('ALL'); 
  
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const email = user.email.toLowerCase();
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") {
          setIsAuthChecking(false); 
        } else {
          window.location.href = "/"; 
        }
      } else {
        window.location.href = "/"; 
      }
    });
    return () => unsubscribe();
  }, []);

  const [srTitle, setSrTitle] = useState('');
  const [srCategory, setSrCategory] = useState('UNDERWATER MARINE LIFE');
  const [srFormat, setSrFormat] = useState('16:9');
  const [srType, setSrType] = useState('video');
  const [isSrUploading, setIsSrUploading] = useState(false);

  const [catName, setCatName] = useState('');
  const [catColor, setCatColor] = useState('pink');
  const [catIcon, setCatIcon] = useState('Sparkles');
  const [img169, setImg169] = useState(0);
  const [img916, setImg916] = useState(0);
  const [vid169, setVid169] = useState(0);
  const [vid916, setVid916] = useState(0);
  const [isCatSaving, setIsCatSaving] = useState(false);

  const iconChoices = [
    { name: 'Sparkles', icon: <Sparkles size={20} /> },
    { name: 'Flame', icon: <Flame size={20} /> },
    { name: 'Zap', icon: <Zap size={20} /> },
    { name: 'Crown', icon: <Crown size={20} /> },
    { name: 'Rocket', icon: <Rocket size={20} /> },
    { name: 'Star', icon: <Star size={20} /> },
    { name: 'Camera', icon: <Camera size={20} /> },
    { name: 'Droplets', icon: <Droplets size={20} /> },
    { name: 'Hexagon', icon: <Hexagon size={20} /> },
    { name: 'Globe', icon: <Globe size={20} /> }
  ];

  const colorChoices = [
    { value: 'pink', label: 'Neon Pink', class: 'bg-pink-500' },
    { value: 'orange', label: 'V8 Orange', class: 'bg-orange-500' },
    { value: 'cyan', label: 'Ice Cyan', class: 'bg-cyan-500' },
    { value: 'emerald', label: 'Emerald Green', class: 'bg-emerald-500' },
    { value: 'fuchsia', label: 'Cyber Purple', class: 'bg-fuchsia-500' },
    { value: 'red', label: 'Blood Red', class: 'bg-red-600' },
    { value: 'yellow', label: 'Gold Amber', class: 'bg-yellow-400' }
  ];

  const handleGenerateInvoice = (saleData) => {
    const invoiceNum = `INV-2026-${Math.floor(Math.random() * 9000 + 1000)}`; 
    let dateObj = new Date();
    if (saleData.vreme?.toDate) dateObj = saleData.vreme.toDate();
    else if (saleData.requestDate?.toDate) dateObj = saleData.requestDate.toDate();
    const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const clientName = saleData.ime || saleData.klijent || saleData.firstName + ' ' + (saleData.lastName || '') || 'Valued Client';
    const clientEmail = saleData.email || saleData.clientEmail || 'N/A';
    const clientCountry = saleData.country || 'N/A';
    const productName = saleData.zeliPaket || saleData.film || saleData.productName || 'V8 Master License';
    
    let finalPrice = "0";
    if (saleData.cenaPaketa) {
       finalPrice = Math.ceil(saleData.cenaPaketa / 117); 
    } else if (saleData.price) {
       finalPrice = saleData.price;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice & Contract - ${invoiceNum}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; margin: 0; background: #fff; }
          .invoice-box { max-width: 800px; margin: auto; padding: 40px; border: 1px solid #ddd; box-shadow: 0 0 15px rgba(0, 0, 0, 0.05); font-size: 16px; line-height: 24px; color: #333; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header-left { display: flex; align-items: center; gap: 20px; }
          .logo-img { width: 80px; height: 80px; object-fit: contain; border-radius: 10px; }
          .header h1 { margin: 0; color: #ea580c; font-size: 42px; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
          .details-wrapper { display: flex; justify-content: space-between; margin-bottom: 50px; }
          .details-col { width: 48%; }
          .section-title { font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin-bottom: 10px; display: block; }
          table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; margin-bottom: 40px; }
          table th, table td { padding: 15px; border-bottom: 1px solid #eee; }
          table th { background: #f9f9f9; font-weight: bold; text-transform: uppercase; font-size: 13px; color: #555; }
          table td.bold-col { font-weight: bold; }
          .total-box { text-align: right; border-top: 2px solid #000; padding-top: 20px; margin-top: 20px; }
          .total-box .due { font-size: 24px; font-weight: 900; }
          .payment-status { margin-top: 40px; padding: 20px; background: #fdfdfd; border-left: 4px solid #16a34a; }
          .status-badge { color: #16a34a; font-weight: 900; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px; }
          .footer { margin-top: 60px; font-size: 11px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
          
          /* Contract Styles */
          .contract-box { page-break-before: always; max-width: 800px; margin: auto; padding: 40px; font-size: 13px; line-height: 1.6; color: #444; }
          .contract-title { color: #ea580c; text-transform: uppercase; font-size: 24px; margin-bottom: 10px; font-weight: 900; }
          .contract-meta { border-bottom: 1px solid #eee; padding-bottom: 20px; margin-bottom: 20px; font-size: 12px; color: #666; }
          .contract-section { margin-bottom: 20px; }
          .contract-section h3 { font-size: 14px; text-transform: uppercase; color: #111; margin-bottom: 8px; }
          .contract-section ul { margin-top: 5px; padding-left: 20px; }
          .contract-section li { margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div class="header-left">
               <img src="/logo.png" alt="V8 Vault Logo" class="logo-img" onerror="this.style.display='none'; document.getElementById('fallback-logo').style.display='flex';" />
               <div id="fallback-logo" style="display: none; background-color: #ea580c; color: #fff; width: 80px; height: 80px; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; border-radius: 12px; letter-spacing: 2px;">V8</div>
               <h1>INVOICE</h1>
            </div>
            <div style="text-align: right;">
              <strong>Invoice Number:</strong> ${invoiceNum}<br>
              <strong>Date of Issue:</strong> ${formattedDate}
            </div>
          </div>

          <div class="details-wrapper">
            <div class="details-col">
              <span class="section-title">FROM (Issuer):</span>
              <strong>Goran Damnjanovic</strong><br>
              Vucka Milicevica 117<br>
              11306 Grocka, Serbia<br>
              National ID (JMBG): 0911972710000
            </div>
            <div class="details-col" style="text-align: right;">
              <span class="section-title">BILL TO (Client):</span>
              <strong>${clientName}</strong><br>
              ${clientEmail}<br>
              ${clientCountry}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description of Services</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="bold-col">${productName} - Web Development & Digital Asset Engineering</td>
                <td style="text-align: center;">1</td>
                <td style="text-align: right; font-weight: bold;">$${finalPrice}</td>
              </tr>
            </tbody>
          </table>

          <div class="total-box">
            <div class="due">TOTAL DUE: $${finalPrice}</div>
          </div>

          <div class="payment-status">
            <span class="status-badge">PAID IN FULL</span>
            <small style="color: #666;">(Note: Payment settled via international secure gateway. Wire transfer to IBAN).</small>
          </div>

          <div class="footer">
            This document is generated electronically and is valid without a physical signature or stamp.
          </div>
        </div>

        <div class="contract-box">
          <h2 class="contract-title">V8 Masterwork License Agreement</h2>
          
          <div class="contract-meta">
            <strong>Version:</strong> 1.0 &nbsp;|&nbsp; 
            <strong>Date:</strong> June 10, 2026 &nbsp;|&nbsp; 
            <strong>Author/Seller:</strong> Goran Damnjanović (https://aitoolsprosmart.com)<br><br>
            This document is a legally binding agreement between you (User/Buyer) and the author (Goran Damnjanovic). By purchasing and downloading digital assets from the V8 Masterwork collection, you agree to the following terms:
          </div>

          <div class="contract-section">
            <h3>1. LICENSE SUBJECT</h3>
            <p>V8 Vault grants you a non-exclusive, lifetime, global right to use the purchased digital assets in accordance with the terms outlined in this document.</p>
          </div>

          <div class="contract-section">
            <h3>2. PERMITTED USE</h3>
            <p>As an authorized user, you are entitled to use the assets for:</p>
            <ul>
              <li><strong>Commercial Marketing Campaigns:</strong> Use in advertisements, social media, websites, and digital ads.</li>
              <li><strong>Content Production:</strong> Inclusion in video production, films, presentations, and edited materials.</li>
              <li><strong>Print Materials:</strong> Use in catalogs, brochures, billboards, and other marketing collateral.</li>
              <li><strong>Modifications:</strong> You have the right to modify, crop, color grade, or adapt the assets to your needs, provided the final product remains professional.</li>
            </ul>
          </div>

          <div class="contract-section">
            <h3>3. PROHIBITED USE</h3>
            <p>Strictly prohibited:</p>
            <ul>
              <li><strong>Resale and Distribution:</strong> Selling, licensing, sharing, or distributing original files (or slightly modified versions) as "stock" assets or separate digital products is prohibited.</li>
              <li><strong>AI Model Training:</strong> Using these assets to train other AI models or for machine learning is prohibited.</li>
              <li><strong>Unregistered Use:</strong> Any use outside the scope of this license without explicit written permission is a violation of copyright.</li>
            </ul>
          </div>

          <div class="contract-section">
            <h3>4. OWNERSHIP AND COPYRIGHT</h3>
            <p>All copyright, intellectual property, and ownership of the original digital assets remain exclusively with the author (Goran Damnjanovic). This purchase does not transfer ownership of copyright, only the right to use.</p>
          </div>

          <div class="contract-section">
            <h3>5. LIABILITY AND WARRANTY</h3>
            <p>Digital assets are provided "as is". V8 Vault makes no warranties regarding specific fitness for a particular purpose. The author is not liable for any direct or indirect damage resulting from the use of these assets.</p>
          </div>

          <div class="contract-section">
            <h3>6. VALIDITY</h3>
            <p>This license is perpetual (lifetime) for the buyer who has duly paid the license fee. In case of breach of any clause, the license is automatically terminated without refund.</p>
          </div>

          <div class="contract-section" style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
            <p><strong>Support:</strong> For additional questions or corporate inquiries, contact:<br>
            Email: aitoolsprosmart@gmail.com / info@aitoolsprosmart.com<br>
            Platform: aitoolsprosmart.com</p>
          </div>

        </div>

        <script>
          window.onload = function() {
             setTimeout(function() {
                window.print();
             }, 500);
             window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleNukePayoneer = async () => {
    if (!window.confirm("🚨 UPOZORENJE: Da li si siguran da želiš da izbrišeš apsolutno sve B2B (Payoneer) zahteve iz baze, osim jednog?")) return;
    try {
      const q = query(collection(db, "v8_payoneer_requests"));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length <= 1) {
        alert("Imaš samo 1 ili 0 zahteva u bazi. Nema šta da se briše.");
        return;
      }
      const docsToDelete = querySnapshot.docs.slice(1);
      for (let documentSnapshot of docsToDelete) {
        await deleteDoc(doc(db, "v8_payoneer_requests", documentSnapshot.id));
      }
      alert(`🔥 NUKE USPEŠAN: Obrisano tačno ${docsToDelete.length} starih test zahteva! Osveži stranicu (F5).`);
    } catch (error) {
      alert("Greška pri brisanju: " + error.message);
    }
  };

  // 🔥 RESETOVANJE ANALITIKE NA NULU 🔥
  const handleNukeAnalytics = async () => {
    if (!window.confirm("🚨 UPOZORENJE: Da li si siguran da želiš da izbrišeš CELOKUPNU ANALITIKU? Svi brojači se vraćaju na nulu! Ovo se ne može poništiti.")) return;
    try {
      const q = query(collection(db, "analytics"));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        if(typeof v8Toast !== 'undefined') v8Toast.error("Baza analitike je već prazna.");
        return;
      }

      for (let documentSnapshot of querySnapshot.docs) {
        await deleteDoc(doc(db, "analytics", documentSnapshot.id));
      }
      
      if(typeof v8Toast !== 'undefined') v8Toast.success(`🔥 RESET USPEŠAN: Obrisano ${querySnapshot.docs.length} zapisa. Brojači su na nuli.`);
    } catch (error) {
      alert("Greška pri brisanju analitike: " + error.message);
    }
  };

  const simulateDirectPurchase = async () => {
    try {
      await addDoc(collection(db, "v8_kupci"), {
        ime: "V8 VIP Client",
        email: "boss@visionary.com",
        zeliPaket: "V8 MASTERWORK",
        cenaPaketa: 199.99 * 117, 
        vreme: serverTimestamp(),
        isPaid: true
      });
      if(typeof v8Toast !== 'undefined') v8Toast.success("TEST SIGNAL: Purchase injected!");
    } catch (e) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Database injection failed!");
    }
  };

  const [promoVideo, setPromoVideo] = useState("");
  const [promoImagesArray, setPromoImagesArray] = useState([]);
  const [isUploadingPromo, setIsUploadingPromo] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "v8_kupci"), orderBy("vreme", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(list.filter(z => z.isPaid));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "v8_crypto_requests"), orderBy("requestDate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCryptoReqs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // 🔥 V8 ANALITIKA LISTENER (ZAKLJUČANO NA MAX 200 DA NE ZABODE BROWSER) 🔥
  useEffect(() => {
    const q = query(collection(db, "analytics"), orderBy("timestamp", "desc"), limit(200));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnalyticsData(list);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promoSnap = await getDoc(doc(db, "v8_settings", "promo10x"));
        if (promoSnap.exists()) {
          setPromoVideo(promoSnap.data().videoUrl || "");
          setPromoImagesArray(promoSnap.data().images || []);
        }
      } catch (err) {
        console.error("Database fetch error", err);
      }
    };
    fetchData();
  }, []);

  const handleUploadPromoImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploadingPromo(true);
    
    const fd = new FormData(); 
    fd.append('file', file); 
    fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET); 
    
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/upload`, { method: 'POST', body: fd });
      const resData = await res.json();
      
      const newImagesArray = [...promoImagesArray, resData.secure_url];
      setPromoImagesArray(newImagesArray);
      
      await setDoc(doc(db, "v8_settings", "promo10x"), { images: newImagesArray }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Image added to 10X Strip!");
    } catch (err) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Upload failed!");
    } finally {
      setIsUploadingPromo(false);
    }
  };

  const handleDeletePromoImage = async (urlToDelete) => {
    if (window.confirm("Delete this image?")) {
      const newImagesArray = promoImagesArray.filter(url => url !== urlToDelete);
      setPromoImagesArray(newImagesArray);
      await setDoc(doc(db, "v8_settings", "promo10x"), { images: newImagesArray }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Image removed.");
    }
  };

  const handleSavePromoConfig = async () => {
    try {
      await setDoc(doc(db, "v8_settings", "promo10x"), { 
        videoUrl: promoVideo,
        images: promoImagesArray 
      }, { merge: true });
      if(typeof v8Toast !== 'undefined') v8Toast.success("Ad Config Deployed!");
    } catch (e) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Database save error.");
    }
  };

  const handleShowroomUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('srFileInput');
    const file = fileInput.files[0];

    if(!file || !srTitle) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Unesi naslov i izaberi fajl!");
      return;
    }

    setIsSrUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', data.CLOUDINARY_UPLOAD_PRESET);

    try {
      const resourceType = srType === 'video' ? 'video' : 'image';
      const res = await fetch(`https://api.cloudinary.com/v1_1/${data.CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, { 
        method: 'POST', body: fd 
      });
      const resData = await res.json();
      if(resData.error) throw new Error(resData.error.message);

      const fileUrl = resData.secure_url;
      await addDoc(collection(db, "v8_showroom_baza"), {
        title: srTitle, category: srCategory, format: srFormat,
        type: srType, url: fileUrl, createdAt: serverTimestamp()
      });

      if(typeof v8Toast !== 'undefined') v8Toast.success("USPEŠNO DODATO U SHOWROOM!");
      setSrTitle('');
      fileInput.value = ''; 
    } catch(err) {
      console.error(err);
      if(typeof v8Toast !== 'undefined') v8Toast.error("Greška pri uploadu!");
    } finally {
      setIsSrUploading(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if(!catName.trim()) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("Moraš uneti naziv kategorije!");
      return;
    }
    setIsCatSaving(true);
    try {
      await addDoc(collection(db, "v8_showroom_kategorije"), {
        name: catName.toUpperCase(), color: catColor, icon: catIcon,
        placeholders: { image169: img169, image916: img916, video169: vid169, video916: vid916 },
        createdAt: serverTimestamp()
      });
      if(typeof v8Toast !== 'undefined') v8Toast.success("V8 DUGME KREIRANO!");
      setCatName('');
      setImg169(0); setImg916(0); setVid169(0); setVid916(0);
    } catch(err) {
      if(typeof v8Toast !== 'undefined') v8Toast.error("GREŠKA PRI ČUVANJU KATEGORIJE!");
    } finally {
      setIsCatSaving(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // 🔥 LOGIKA ZA FILTRIRANJE ANALITIKE (SAMO ULOGOVANI KLIJENTI) 🔥
  const uniqueRegisteredUsers = Array.from(new Set(analyticsData.filter(d => d.userEmail).map(d => d.userEmail)));
  
  const filteredAnalytics = analyticsData.filter(log => {
    if (!log.userEmail) return false; // Odmah sakrij sve preostale anonimne zapise iz stare baze
    if (selectedAnalyticsFilter === 'ALL') return true;
    return log.userEmail === selectedAnalyticsFilter;
  });

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-orange-500 animate-pulse" />
          <h2 className="text-orange-500 font-black uppercase tracking-[0.3em] text-sm">Securing V8 Connection...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex pt-20">
      
      {/* SIDEBAR (LEFT MENU) */}
      <div className="w-64 bg-[#0a0a0a] border-r border-orange-500/20 flex flex-col fixed h-full z-20 shadow-[10px_0_30px_rgba(234,88,12,0.05)]">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="font-black text-[14px] uppercase tracking-widest text-white">V8 MASTER</h2>
            <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Control Room</p>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          
          <button onClick={() => setActiveTab('payoneer_blagajna')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'payoneer_blagajna' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <DollarSign className="w-4 h-4" /> B2B Blagajna
          </button>

          <button onClick={() => setActiveTab('crypto_blagajna')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'crypto_blagajna' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Bitcoin className="w-4 h-4" /> Kripto Blagajna
            {cryptoReqs.length > 0 && <span className="ml-auto bg-orange-600 text-white text-[9px] px-2 py-0.5 rounded-full">{cryptoReqs.length}</span>}
          </button>

          <button onClick={() => setActiveTab('live_sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'live_sales' ? 'bg-blue-600/10 text-blue-500 border border-blue-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Activity className="w-4 h-4" /> Paid History
            {sales.length > 0 && <span className="ml-auto bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full">{sales.length}</span>}
          </button>

          <button onClick={() => setActiveTab('v8_analitika')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'v8_analitika' ? 'bg-fuchsia-600/10 text-fuchsia-500 border border-fuchsia-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <PieChart className="w-4 h-4" /> V8 Analitika
          </button>

          <button onClick={() => setActiveTab('showroom_cms')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'showroom_cms' ? 'bg-pink-600/10 text-pink-500 border border-pink-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Layers className="w-4 h-4" /> Showroom CMS
          </button>

          <button onClick={() => setActiveTab('promo_10x')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'promo_10x' ? 'bg-orange-600/10 text-orange-500 border border-orange-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Zap className="w-4 h-4" /> 10X Ad Config
          </button>

          <button onClick={() => setActiveTab('v8_alati')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'v8_alati' ? 'bg-emerald-600/10 text-emerald-500 border border-emerald-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Zap className="w-4 h-4" /> V8 Master Tools
          </button>

          <button onClick={() => setActiveTab('klijenti')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${activeTab === 'klijenti' ? 'bg-blue-600/10 text-blue-500 border border-blue-500/30' : 'text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent'}`}>
            <Users className="w-4 h-4" /> Client Database
          </button>
        </div>
      </div>

      {/* MAIN CONTENT (RIGHT) */}
      <div className="ml-64 flex-1 p-10 overflow-y-auto">
        
        {/* --- TAB: PAYONEER BLAGAJNA --- */}
        {activeTab === 'payoneer_blagajna' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-6 flex justify-end">
              <button onClick={handleNukePayoneer} className="bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                <Flame className="w-4 h-4" /> Očisti bazu (Ostavi 1 primer)
              </button>
            </div>
            <V8PayoneerDashboard />
          </div>
        )}

        {/* --- TAB: KRIPTO BLAGAJNA --- */}
        {activeTab === 'crypto_blagajna' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
             <div className="mb-8 flex items-center justify-between border-b border-orange-500/20 pb-6">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                  <Bitcoin className="w-8 h-8 text-orange-500" /> KRIPTO BLAGAJNA
                </h1>
                <p className="text-zinc-500 text-[12px] font-bold tracking-widest uppercase">Live NOWPayments Gateway Feed</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cryptoReqs.length === 0 ? (
                <div className="text-center py-20 opacity-50 bg-[#0a0a0a] rounded-3xl border border-white/5">
                  <Bitcoin className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-widest text-zinc-500">Nema kripto transakcija. Radar je čist.</p>
                </div>
              ) : (
                cryptoReqs.map(req => (
                  <div key={req.id} className="bg-[#050505] border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between hover:border-orange-500/50 shadow-[0_5px_30px_rgba(249,115,22,0.05)] transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-full bg-orange-600/10 flex items-center justify-center border border-orange-500/30">
                         <Bitcoin className="w-5 h-5 text-orange-500" />
                       </div>
                       <div>
                         <h3 className="text-[14px] font-black uppercase tracking-widest text-white">{req.firstName} {req.lastName}</h3>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{req.clientEmail}</p>
                         <div className="flex items-center gap-2 mt-2">
                           <span className="text-blue-400 text-[10px] font-black uppercase bg-blue-600/10 px-2 py-0.5 rounded-md border border-blue-500/20">{req.productName}</span>
                           <span className="text-zinc-400 text-[10px] font-black uppercase">{req.country}</span>
                         </div>
                       </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-3 mt-4 md:mt-0">
                       <div className="text-2xl font-black text-orange-500">${req.price}</div>
                       <div className="flex items-center gap-3">
                         <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${req.status === 'initiating_gateway' ? 'bg-zinc-800/50 text-zinc-400 border-zinc-700' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>
                           {req.status === 'initiating_gateway' ? 'GATEWAY PENDING' : req.status}
                         </span>
                         
                         <button onClick={() => handleGenerateInvoice(req)} className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all">
                            <FileText className="w-3 h-3" /> PDF INVOICE
                         </button>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}

        {/* --- TAB: V8 ANALITIKA --- */}
        {activeTab === 'v8_analitika' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between border-b border-fuchsia-500/20 pb-6 gap-4">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                  <PieChart className="w-8 h-8 text-fuchsia-500" /> V8 LIVE RADAR
                </h1>
                <p className="text-zinc-500 text-[12px] font-bold tracking-widest uppercase">Praćenje registrovanih klijenata u realnom vremenu</p>
              </div>
              
              {/* 🔥 DUGME ZA RESETOVANJE (NUKE) ANALITIKE 🔥 */}
              <button 
                onClick={handleNukeAnalytics} 
                className="bg-red-600/20 text-red-500 border border-red-500/50 hover:bg-red-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              >
                <Flame className="w-4 h-4" /> RESETUJ BAZU (NUKE)
              </button>
            </div>

            {/* 🔥 FILTER PO KORISNIKU 🔥 */}
            <div className="mb-6 flex justify-end">
              <div className="bg-[#050505] border border-white/10 rounded-xl p-2 flex items-center gap-3 w-full md:w-auto">
                <Filter className="w-4 h-4 text-fuchsia-500 ml-2" />
                <select 
                  value={selectedAnalyticsFilter} 
                  onChange={(e) => setSelectedAnalyticsFilter(e.target.value)} 
                  className="bg-transparent border-none text-white text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer pr-4 w-full md:w-auto"
                >
                  <option value="ALL">Prikaži sve ulogovane klijente</option>
                  {uniqueRegisteredUsers.map(email => (
                    <option key={email} value={email}>Prati klijenta: {email}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl shadow-inner flex flex-col gap-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Eye className="w-4 h-4 text-fuchsia-500" /> Prikazano Akcija</span>
                <span className="text-4xl font-black text-white">{filteredAnalytics.length}</span>
              </div>
              <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl shadow-inner flex flex-col gap-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Registrovani Klikovi</span>
                <span className="text-4xl font-black text-white">
                  {filteredAnalytics.filter(d => d.type === 'click').length}
                </span>
              </div>
              <div className="bg-[#050505] border border-white/5 p-6 rounded-3xl shadow-inner flex flex-col gap-2">
                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Clock className="w-4 h-4 text-orange-500" /> Pregledi Stranica</span>
                <span className="text-4xl font-black text-white">
                  {filteredAnalytics.filter(d => d.type === 'page_view').length}
                </span>
              </div>
            </div>

            <div className="bg-[#0a0a0a] border border-fuchsia-500/20 rounded-[2rem] p-6 overflow-hidden shadow-[0_0_40px_rgba(217,70,239,0.05)]">
              <h3 className="text-fuchsia-500 font-black text-[12px] uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4">Live Activity Feed</h3>
              
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-3">
                {filteredAnalytics.length === 0 ? (
                  <p className="text-zinc-500 text-center py-10 text-[12px] uppercase font-black tracking-widest">Nema zabeleženih aktivnosti za ovog klijenta.</p>
                ) : (
                  // 🔥 RENDERUJEMO SAMO POSLEDNJIH 50 DA MIŠ LETI 🔥
                  filteredAnalytics.slice(0, 50).map(log => (
                    <div key={log.id} className="flex items-center justify-between bg-[#050505] p-4 rounded-2xl border border-white/5 hover:border-fuchsia-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${log.type === 'page_view' ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-blue-500/10 border-blue-500/30 text-blue-500'}`}>
                          {log.type === 'page_view' ? <Eye className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-white text-[13px] font-black truncate max-w-[200px] md:max-w-xs">
                            {log.userEmail}
                          </span>
                          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-0.5 truncate max-w-[200px] md:max-w-xs">
                            {log.type === 'page_view' ? `Gleda stranicu: ${log.path}` : `Kliknuo na: ${log.elementText || log.path}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                          {formatTime(log.timestamp)}
                        </span>
                        {log.durationMS && (
                          <span className="bg-white/10 text-white text-[9px] px-2 py-0.5 rounded-md font-black">
                            Zadržavanje: {Math.round(log.durationMS / 1000)}s
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: SHOWROOM CMS --- */}
        {activeTab === 'showroom_cms' && (
          <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0a0a] border border-blue-500/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.1)]">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <Film className="w-10 h-10 text-blue-500" />
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-widest text-white">
                    ASSET <span className="text-blue-500">UPLOAD</span>
                  </h2>
                  <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Dodaj nove rendere i videe u galeriju</p>
                </div>
              </div>
              
              <form onSubmit={handleShowroomUpload} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-blue-400 text-[11px] uppercase tracking-[0.2em] font-black">Naslov Dela (Title)</label>
                  <input type="text" value={srTitle} onChange={(e) => setSrTitle(e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-blue-500 rounded-2xl p-4 text-[13px] text-white transition-all outline-none shadow-inner" placeholder="Npr: Deep Ocean Leviathan" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-400 text-[11px] uppercase tracking-[0.2em] font-black">Kategorija</label>
                    <input type="text" value={srCategory} onChange={(e) => setSrCategory(e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-blue-500 rounded-2xl p-4 text-[13px] text-white transition-all outline-none" placeholder="Upiši naziv kategorije" required />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-400 text-[11px] uppercase tracking-[0.2em] font-black">Format</label>
                    <select value={srFormat} onChange={(e) => setSrFormat(e.target.value)} className="w-full bg-black border border-white/10 focus:border-blue-500 rounded-2xl p-4 text-[13px] text-white transition-all outline-none cursor-pointer">
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Vertical)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-blue-400 text-[11px] uppercase tracking-[0.2em] font-black">Tip fajla</label>
                    <select value={srType} onChange={(e) => setSrType(e.target.value)} className="w-full bg-black border border-white/10 focus:border-blue-500 rounded-2xl p-4 text-[13px] text-white transition-all outline-none cursor-pointer">
                      <option value="video">CINEMATIC VIDEO (.mp4)</option>
                      <option value="image">33MP IMAGE (.webp, .jpg)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2 border-t border-white/10 pt-6 mt-2">
                  <label className="text-blue-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2"><UploadCloud className="w-4 h-4" /> Izaberi fajl</label>
                  <input type="file" id="srFileInput" accept={srType === 'video' ? "video/*" : "image/*"} className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-[13px] text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[11px] file:font-black file:uppercase file:tracking-widest file:bg-blue-600/20 file:text-blue-500 hover:file:bg-blue-600 hover:file:text-white cursor-pointer" required />
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isSrUploading} className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                    {isSrUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />} 
                    {isSrUploading ? 'UPLOADING...' : 'UPLOAD U SHOWROOM'}
                  </button>
                </div>
              </form>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#0a0a0a] border border-pink-500/30 p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(236,72,153,0.1)] mb-10">
              <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <Sparkles className="w-10 h-10 text-pink-500" />
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-widest text-white">
                    CATEGORY <span className="text-pink-500">BUILDER</span>
                  </h2>
                  <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-1">Dizajniraj nova dugmad i sekcije za Showroom</p>
                </div>
              </div>

              <form onSubmit={handleSaveCategory} className="flex flex-col gap-8">
                
                <div className="flex flex-col gap-2">
                  <label className="text-pink-400 text-[11px] uppercase tracking-[0.2em] font-black">Ime Kategorije (Dugmeta)</label>
                  <input type="text" value={catName} onChange={(e) => setCatName(e.target.value)} className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-2xl p-4 text-[13px] text-white font-black uppercase tracking-widest outline-none shadow-inner" placeholder="Npr: FRUIT EXPLOSION" required />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-pink-400 text-[11px] uppercase tracking-[0.2em] font-black">Boja (V8 Theme)</label>
                  <div className="flex flex-wrap gap-4">
                    {colorChoices.map(color => (
                      <div 
                        key={color.value} 
                        onClick={() => setCatColor(color.value)}
                        className={`cursor-pointer px-4 py-2 rounded-xl flex items-center gap-2 border-2 transition-all font-black text-[10px] uppercase tracking-widest ${catColor === color.value ? 'border-white bg-white/10' : 'border-transparent bg-black hover:bg-white/5'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${color.class} shadow-[0_0_10px_currentColor]`}></div>
                        {color.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-pink-400 text-[11px] uppercase tracking-[0.2em] font-black">Ikona</label>
                  <div className="flex flex-wrap gap-4">
                    {iconChoices.map(iconObj => (
                      <div 
                        key={iconObj.name} 
                        onClick={() => setCatIcon(iconObj.name)}
                        className={`cursor-pointer w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${catIcon === iconObj.name ? 'border-pink-500 bg-pink-500/20 text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'border-white/10 bg-black text-zinc-500 hover:text-white hover:border-white/30'}`}
                      >
                        {iconObj.icon}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/10 pt-8 mt-2">
                  <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                    <label className="text-zinc-300 text-[11px] uppercase tracking-[0.2em] font-black border-b border-white/10 pb-2">Image Placeholders</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">16:9 (Landscape)</label>
                        <input type="number" min="0" value={img169} onChange={(e) => setImg169(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-xl p-3 text-white outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">9:16 (Vertical)</label>
                        <input type="number" min="0" value={img916} onChange={(e) => setImg916(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-xl p-3 text-white outline-none" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 bg-white/5 p-6 rounded-2xl border border-white/10 shadow-inner">
                    <label className="text-zinc-300 text-[11px] uppercase tracking-[0.2em] font-black border-b border-white/10 pb-2">Video Placeholders</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">16:9 (Landscape)</label>
                        <input type="number" min="0" value={vid169} onChange={(e) => setVid169(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-xl p-3 text-white outline-none" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-zinc-500 text-[9px] uppercase font-black tracking-widest">9:16 (Vertical)</label>
                        <input type="number" min="0" value={vid916} onChange={(e) => setVid916(Number(e.target.value))} className="w-full bg-black/50 border border-white/10 focus:border-pink-500 rounded-xl p-3 text-white outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isCatSaving} className="bg-pink-600 hover:bg-pink-500 text-white px-10 py-4 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                    {isCatSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />} 
                    {isCatSaving ? 'ČUVANJE...' : 'KREIRAJ V8 DUGME'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* --- TAB: PROMO 10X --- */}
        {activeTab === 'promo_10x' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto bg-[#0a0a0a] border border-orange-500/30 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(234,88,12,0.1)] mb-8">
            <div className="flex items-center gap-3 mb-8 border-b border-orange-500/20 pb-4"><Zap className="w-8 h-8 text-orange-500" /><h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600">10X Ad Configuration</h2></div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2"><label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2"><PlayCircle className="w-4 h-4 text-orange-500" /> Hero Video Asset (URL)</label><input type="text" value={promoVideo} onChange={(e) => setPromoVideo(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-[13px] text-white outline-none" /></div>
              <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><label className="text-zinc-400 text-[11px] uppercase tracking-[0.2em] font-black flex items-center gap-2"><ImageIcon className="w-4 h-4 text-orange-500" /> Image Strip Gallery ({promoImagesArray.length})</label><label className="bg-orange-600/10 text-orange-500 px-5 py-3 rounded-xl cursor-pointer flex items-center gap-2 text-[10px] font-black uppercase">{isUploadingPromo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />} UPLOAD NEW IMAGE<input type="file" accept="image/*" onChange={handleUploadPromoImage} className="hidden" disabled={isUploadingPromo} /></label></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-black p-4 rounded-xl border border-white/5 min-h-[120px]">
                   {promoImagesArray.map((url, i) => (<div key={i} className="relative aspect-video rounded-lg overflow-hidden group"><img src={url} className="w-full h-full object-cover opacity-70 group-hover:opacity-100" alt="Promo" /><button onClick={() => handleDeletePromoImage(url)} className="absolute top-2 right-2 bg-red-600/90 p-2 rounded-lg opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4 text-white" /></button></div>))}
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 flex justify-end"><button onClick={handleSavePromoConfig} className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-xl font-black text-[12px] uppercase flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Commit Video Config</button></div>
            </div>
          </motion.div>
        )}

        {/* --- TAB: LIVE SALES --- */}
        {activeTab === 'live_sales' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between border-b border-orange-500/20 pb-6">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2 flex items-center gap-3">
                  <Activity className="w-8 h-8 text-orange-500" /> PAID CLIENTS HISTORY
                </h1>
                <p className="text-zinc-500 text-[12px] font-bold tracking-widest uppercase">Automated V8 transaction feed</p>
              </div>
              <button onClick={simulateDirectPurchase} className="bg-green-600/20 text-green-500 border border-green-500/50 hover:bg-green-600 hover:text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <Zap className="w-4 h-4" /> INJECT TEST PURCHASE
              </button>
            </div>
            <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2rem] p-2">
              {sales.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  <DollarSign className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
                  <p className="text-[12px] font-black uppercase tracking-widest text-zinc-500">Awaiting incoming signals. The radar is clear.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sales.map((sale) => (
                    <div key={sale.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 rounded-3xl bg-[#050505] border border-white/5 hover:border-green-500/30 transition-all group">
                      <div className="flex items-center gap-6 mb-4 md:mb-0">
                        <div className="w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center border border-green-500/30">
                          <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="text-[14px] font-black uppercase tracking-widest text-white group-hover:text-green-400">{sale.ime || sale.klijent || "Valued Client"}</h3>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{sale.email || "No email"}</p>
                          <div className="flex items-center gap-2 mt-2"><span className="text-orange-400 text-[10px] font-black uppercase bg-orange-600/10 px-2 py-0.5 rounded-md border border-orange-500/20">{sale.zeliPaket || sale.film || "V8 Digital Asset"}</span></div>
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end gap-3 border-t border-white/5 md:border-none pt-4 md:pt-0">
                        <div className="text-2xl font-black text-white">${sale.cenaPaketa ? Math.ceil(sale.cenaPaketa / 117) : "0"}</div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500"><Calendar className="w-3 h-3" /> {formatTime(sale.vreme)}</span>
                          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5"><CheckCircle className="w-3 h-3" /> PAID</div>
                          
                          <button onClick={() => handleGenerateInvoice(sale)} className="bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all">
                            <FileText className="w-3 h-3" /> PDF INVOICE
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default V8AdminDashboard;
// KRAJ FAJLA: V8AdminDashboard.jsx