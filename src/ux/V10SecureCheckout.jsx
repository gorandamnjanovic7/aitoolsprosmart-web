// FAJL: src/ux/V10SecureCheckout.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShieldCheck, X, CheckCircle, Bitcoin, Zap, CreditCard, Link as LinkIcon, Download, Radar, Crown, Briefcase, Rocket, Package, ChevronDown, Box, Lock, Clock, Loader2, Building2, UserCircle, Folder, AlertTriangle, Check, Palette } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; 

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Guatemala", "Guinea", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Mauritania", "Mauritius", "Mexico", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Somalia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sudan", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];

const getBackendUrl = () => "https://aitoolsprosmart-becend-production.up.railway.app";
const TIER_ICONS = [Rocket, Briefcase, Crown, Package];

const V10SecureCheckout = ({ 
  isOpen, onClose, productName, packageName, price, zipLink, 
  availableTiers = [], projectImage = "/v8-secure-blue.webp", 
  selectedProjects = [], userEmail, onSuccess,
  isUIUX = false 
}) => {
  const [user, setUser] = useState(null);
  
  let displayPrice = price || 0;
  let displayName = productName || packageName || "V10 License";

  if (!displayPrice && packageName) {
    if (packageName === 'B2B RETAINER') displayPrice = 200;
    else if (packageName === 'CINEMATIC PITCH') displayPrice = 1500;
    else if (packageName === 'V10 MASTER VAULT') displayPrice = 7000;
  }

  const hasMultipleTiers = availableTiers && availableTiers.length > 0;
  const defaultTierId = hasMultipleTiers ? availableTiers[0].id : 'default';
  
  const [selectedTier, setSelectedTier] = useState(defaultTierId);
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  
  const [clientType, setClientType] = useState(isUIUX ? 'agency' : 'individual');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(''); 
  
  const [companyName, setCompanyName] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [cryptoOrderId, setCryptoOrderId] = useState(null);
  
  // 🔥 NOVI STATE ZA BEZBEDNOST (SPREČAVA PREUZIMANJE PRE UPLATE) 🔥
  const [isCryptoPaid, setIsCryptoPaid] = useState(false);

  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isCardProcessing, setIsCardProcessing] = useState(false);

  const activeTierObj = hasMultipleTiers ? availableTiers.find(t => t.id === selectedTier) : null;
  const activePrice = hasMultipleTiers ? activeTierObj?.price : displayPrice;
  const activeName = hasMultipleTiers ? activeTierObj?.name : displayName;
  const activeIsMonthly = hasMultipleTiers ? activeTierObj?.isMonthly : false;
  const activePlanId = hasMultipleTiers ? activeTierObj?.planId : null;

  const safePrice = activePrice || 0;
  const safeName = activeName || "V10 Asset";

  const cleanProjects = (selectedProjects || []).map(p => ({
    id: p?.id || "unknown",
    title: p?.title || "Unknown Asset",
    driveLink: p?.driveLink || p?.zipLink || "",
    zipLink: p?.zipLink || p?.driveLink || "" 
  }));

  const initialOptions = { "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD", vault: true };

  const triggerGoogleAnalyticsPurchase = (transactionId, finalPrice) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
            transaction_id: transactionId, value: Number(finalPrice), currency: "USD",
            items: [{ item_id: selectedTier, item_name: safeName, price: Number(finalPrice), quantity: 1 }]
        });
    }
  };

  useEffect(() => { 
    if (isOpen) document.body.style.overflow = 'hidden'; 
    else document.body.style.overflow = ''; 
    return () => { document.body.style.overflow = ''; }; 
  }, [isOpen]);

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { 
      setUser(currentUser); 
      setEmail(currentUser?.email || userEmail || ''); 
    }); 
    return () => unsubscribe(); 
  }, [userEmail]);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false); setSuccess(false); setShowPaymentModal(false); 
      setDownloadUrl(null); setCryptoOrderId(null); setIsCryptoPaid(false);
      setCompanyName(''); setFirstName(''); setLastName(''); 
      setVatNumber(''); setAddress(''); setCity(''); setZipCode('');
      setCardNumber(''); setCardExp(''); setCardCvc('');
      if (hasMultipleTiers) setSelectedTier(defaultTierId);
    }
  }, [isOpen, defaultTierId, hasMultipleTiers]);

  useEffect(() => {
    if (cryptoOrderId && paymentMethod === 'crypto') {
      const unsub = onSnapshot(doc(db, "v8_crypto_requests", cryptoOrderId), (docSnap) => {
        // RADAR OSLUŠKUJE BAZU - Otključava fajlove tek kad stigne potvrda!
        if (docSnap.exists() && docSnap.data().status === 'PLAĆENO') {
          const finalUrl = docSnap.data().zipLink;
          setDownloadUrl(finalUrl); 
          setIsCryptoPaid(true); 
          triggerGoogleAnalyticsPurchase(cryptoOrderId, safePrice);
        }
      });
      return () => unsub();
    }
  }, [cryptoOrderId, paymentMethod, safePrice]);

  const getCheckoutPayload = () => {
    return {
      email: email || "guest@example.com",
      clientType: clientType,
      firstName: clientType === 'individual' ? firstName : "",
      lastName: clientType === 'individual' ? lastName : "",
      company: clientType === 'agency' ? companyName : "Individual",
      country: country,
      address: clientType === 'agency' ? address : "",
      city: clientType === 'agency' ? city : "",
      zipCode: clientType === 'agency' ? zipCode : "",
      vatNumber: clientType === 'agency' ? vatNumber : "",
      selectedPackage: safeName,
      price: safePrice,
      status: "pending_payment",
      zipLink: zipLink || "", 
      selectedProjects: cleanProjects,
      timestamp: serverTimestamp()
    };
  };

  const isFormValid = () => {
    if (!country || !user) return false;
    if (clientType === 'agency') {
      return companyName && vatNumber && address && city && zipCode;
    } else {
      return firstName && lastName;
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user || !country || !email) return alert("Please complete all required fields.");
    
    if (clientType === 'agency') {
      if (!companyName || !vatNumber || !address || !city || !zipCode) {
        return alert("For Agency transactions, Company Legal Name, VAT/Tax ID, and full address details are required.");
      }
    } else {
      if (!firstName || !lastName) return alert("Please enter your First and Last Name.");
    }
    
    setLoading(true);
    const finalProductName = hasMultipleTiers ? `${productName || packageName} - ${safeName}` : safeName;
    const payload = getCheckoutPayload();

    try {
      if (paymentMethod === 'payoneer' || paymentMethod === 'b2b') {
        const docRef = await addDoc(collection(db, "v8_payoneer_requests"), {
          ...payload,
          productName: finalProductName,
          method: "payoneer", 
          handledBy: "info@aitoolsprosmart.com", 
          status: "pending", 
          requestDate: serverTimestamp()
        });
        
        await setDoc(doc(db, "checkout_requests", docRef.id), payload);

        setSuccess(true); setLoading(false); 
        triggerGoogleAnalyticsPurchase(docRef.id, safePrice); 

      } else if (paymentMethod === 'crypto') {
        const docRef = await addDoc(collection(db, "v8_crypto_requests"), {
          ...payload,
          productName: finalProductName,
          method: "crypto", 
          status: "initiating_gateway", 
          requestDate: serverTimestamp()
        });
        const response = await fetch(`${getBackendUrl()}/api/crypto-checkout`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ orderId: docRef.id, clientEmail: email, productName: finalProductName, price: safePrice, ...payload }) 
        });
        const data = await response.json();
        if (response.ok && data.paymentUrl) { window.open(data.paymentUrl, '_blank'); setCryptoOrderId(docRef.id); setSuccess(true); setLoading(false); } 
        else { alert("Gateway connection failed."); setLoading(false); }
      }
    } catch (error) { console.error("Error:", error); alert("An error occurred."); setLoading(false); }
  };

  const handleTestCardPayment = async () => {
    if (!cardNumber.includes("4242")) {
      alert("Please enter the test card: 4242 4242 4242 4242");
      return;
    }
    setIsCardProcessing(true);
    try {
      const checkoutId = `${user?.email || 'guest'}_${Date.now()}`;
      
      await setDoc(doc(db, "checkout_requests", checkoutId), {
        ...getCheckoutPayload(),
        status: "paid",
        paymentMethod: "test_card"
      });

      setIsCardProcessing(false);
      setShowPaymentModal(false); 
      setSuccess(true); 
      const url = zipLink || "https://link-do-arhiva.zip";
      setDownloadUrl(url);

    } catch (e) {
      console.error(e);
      alert("Error processing card: " + e.message);
      setIsCardProcessing(false);
    }
  };

  const paypalCreateSubscription = (data, actions) => { return actions.subscription.create({ plan_id: activePlanId }); };
  const paypalOnApproveSubscription = async (data, actions) => { 
    try { 
      await setDoc(doc(db, "v8_paypal_subscriptions", data.subscriptionID), { ...getCheckoutPayload(), subscriptionId: data.subscriptionID, status: "ACTIVE", createdAt: serverTimestamp() }); 
      setShowPaymentModal(false); setSuccess(true); 
      const url = zipLink || "https://link-do-arhiva.zip";
      setDownloadUrl(url); triggerGoogleAnalyticsPurchase(data.subscriptionID, safePrice); 
    } catch (error) { console.error("Error:", error); alert("Subscription successful, but verification delayed."); } 
  };

  const paypalCreateOrder = (data, actions) => { return actions.order.create({ purchase_units: [{ description: safeName, amount: { value: safePrice.toString() } }] }); };
  const paypalOnApproveOrder = async (data, actions) => { 
    try { 
      const details = await actions.order.capture(); 
      const backendUrl = getBackendUrl(); 
      const response = await fetch(`${backendUrl}/api/paypal-verify`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ orderId: details.id, ...getCheckoutPayload() }) 
      }); 
      const resData = await response.json(); 
      if(resData.success) { 
        setShowPaymentModal(false); setSuccess(true); 
        const url = resData.downloadUrl || zipLink;
        setDownloadUrl(url); triggerGoogleAnalyticsPurchase(details.id, safePrice); 
      } else { alert("Payment verification failed. Contact support."); } 
    } catch (error) { console.error("Error:", error); alert("Payment received, but verification delayed."); } 
  };

  if (!isOpen) return null;

  return createPortal(
    <PayPalScriptProvider options={initialOptions}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 sm:p-6 font-sans">
            
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="w-full max-w-6xl p-[3px] rounded-[2.6rem] bg-gradient-to-br from-blue-500 via-indigo-400 to-orange-500 shadow-[0_20px_80px_rgba(59,130,246,0.25)]"
            >
              
              <div className="bg-white w-full rounded-[2.4rem] flex flex-col lg:flex-row relative overflow-hidden h-auto max-h-[90vh] overflow-y-auto custom-scrollbar">
                
                {/* 🔥 LEVA KOLONA: CLEAN FINTECH WHITE 🔥 */}
                <div className="w-full lg:w-2/3 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10 bg-white">
                  
                  <div className="flex flex-col w-full min-w-0">
                    <div className="flex items-center gap-2 mb-5 h-6 shrink-0">
                      <Box className="w-4 h-4 text-blue-500 shrink-0" />
                      <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
                        {hasMultipleTiers ? 'Select License Tier' : 'Selected Asset Portfolio'}
                      </h2>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full">
                      {hasMultipleTiers ? (
                        availableTiers.map((tier, idx) => {
                          const IconComponent = TIER_ICONS[idx % TIER_ICONS.length]; 
                          return (
                          <button 
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                              selectedTier === tier.id 
                                ? 'bg-orange-50/80 border-orange-500 shadow-[0_10px_20px_rgba(234,88,12,0.1)]' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {selectedTier === tier.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-orange-500"></div>}
                            <div className="flex items-center gap-3 mb-2">
                              <IconComponent className={`w-5 h-5 ${selectedTier === tier.id ? 'text-orange-500' : 'text-slate-400'}`} />
                              <h3 className={`font-black uppercase tracking-widest text-sm ${selectedTier === tier.id ? 'text-slate-900' : 'text-slate-600'}`}>{tier.name}</h3>
                            </div>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-3 ml-8 leading-relaxed">{tier.desc}</p>
                            <div className="text-slate-900 font-black text-2xl ml-8 flex items-baseline gap-1">
                              ${tier.price} {tier.isMonthly && <span className="text-xs text-slate-400 font-bold uppercase">/ mo</span>}
                            </div>
                          </button>
                        )})
                      ) : (
                        <div className="text-left p-6 rounded-2xl border-2 bg-blue-50/50 border-blue-300 relative overflow-hidden shadow-sm">
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                          <div className="flex items-center gap-3 mb-3">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                            <h3 className="text-slate-900 font-black uppercase tracking-wider text-sm leading-snug">{safeName}</h3>
                          </div>
                          <p className="text-blue-800 text-[10px] font-black uppercase tracking-widest mb-3 ml-9">Commercial Master License</p>
                          <div className="text-slate-900 font-black text-3xl ml-9">${safePrice}</div>
                        </div>
                      )}

                      {selectedProjects && selectedProjects.length > 0 && (
                        <div className="mt-1 p-4 rounded-2xl border-2 border-slate-200 bg-slate-50">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3 border-b border-slate-200 pb-2 flex items-center gap-2">
                            <Folder className="w-4 h-4 text-slate-500" /> Included Master Assets ({selectedProjects.length})
                          </h4>
                          <ul className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedProjects.map((p, idx) => (
                              <li key={p.id || idx} className="text-[11px] text-slate-800 font-bold flex items-center gap-2 bg-white p-3 rounded-lg border-2 border-slate-100 shadow-sm">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                <span className="truncate">{p.title}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <AnimatePresence>
                        {paymentMethod === 'payoneer' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <div className="p-5 rounded-2xl bg-orange-50 border-2 border-orange-300 flex gap-4 items-start mt-2 shadow-sm">
                              <Clock className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5 animate-pulse" />
                              <div className="flex flex-col gap-1.5">
                                <h4 className="text-orange-800 text-[11px] font-black uppercase tracking-widest">Payoneer Clearance Protocol</h4>
                                <p className="text-slate-800 text-[11px] font-bold leading-relaxed">
                                  Due to strict international B2B banking regulations, Payoneer transaction verification strictly requires <span className="text-orange-700 font-black bg-orange-200/50 px-1 rounded border border-orange-300">6 to 12 hours</span> to clear.
                                </p>
                                <p className="text-slate-600 text-[10px] font-bold leading-relaxed mt-0.5">
                                  Your encrypted master assets will be securely dispatched to your verified corporate email exactly upon node confirmation. We appreciate your professional patience.
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>

                  <div className="flex flex-col w-full min-w-0">
                    <div className="flex items-center gap-2 mb-5 h-6 shrink-0">
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 block shrink-0"></span>
                      </div>
                      <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mt-0.5">
                        Billing & Legal Information
                      </h2>
                    </div>
                    
                    {/* B2B / Kripto / Card Toggles */}
                    <div className="flex gap-3 mb-6 bg-blue-50/40 p-2 rounded-2xl border-2 border-blue-100 w-full shadow-inner">
                      <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-3.5 flex flex-col items-center justify-center gap-2 rounded-xl transition-all ${paymentMethod === 'card' ? 'bg-white border-2 border-blue-400 text-blue-700 shadow-md' : 'text-blue-500 hover:text-blue-700 hover:bg-white/50 border-2 border-transparent'}`}>
                        <CreditCard className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                      </button>
                      <button onClick={() => setPaymentMethod('payoneer')} className={`flex-1 py-3.5 flex flex-col items-center justify-center gap-2 rounded-xl transition-all ${paymentMethod === 'payoneer' ? 'bg-white border-2 border-orange-400 text-orange-600 shadow-md' : 'text-blue-500 hover:text-orange-600 hover:bg-white/50 border-2 border-transparent'}`}>
                        <LinkIcon className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">B2B Link</span>
                      </button>
                      <button onClick={() => setPaymentMethod('crypto')} className={`flex-1 py-3.5 flex flex-col items-center justify-center gap-2 rounded-xl transition-all ${paymentMethod === 'crypto' ? 'bg-white border-2 border-blue-400 text-blue-700 shadow-md' : 'text-blue-500 hover:text-blue-700 hover:bg-white/50 border-2 border-transparent'}`}>
                        <Bitcoin className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
                      </button>
                    </div>

                    {success ? (
                      <div className="flex flex-col items-center justify-center flex-grow w-full">
                        
                        {/* 🔥 BLINDIRANA LOGIKA ZA PRIKAZ DOWNLOAD LINKOVA 🔥 */}
                        {paymentMethod === 'payoneer' ? (
                          
                          // PAYONEER SUCCESS (NEMA LINKOVA DOK SE NE ODOBRI RUČNO)
                          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-sm w-full">
                            <Clock className="w-16 h-16 text-orange-500 mb-5" />
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-3">Request Secured</h2>
                            <p className="text-slate-600 text-[11px] uppercase font-bold tracking-widest leading-relaxed">
                              Identity Verified: {firstName || companyName}.<br/>
                              B2B Invoice has been dispatched to your secure email.<br/>
                              Assets will be delivered immediately upon payment clearance.
                            </p>
                            <button onClick={() => { if (onSuccess) onSuccess(); else onClose(); }} className="mt-8 w-full px-4 py-5 min-h-[60px] bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md">
                              CLOSE TERMINAL
                            </button>
                          </div>

                        ) : paymentMethod === 'crypto' && !isCryptoPaid ? (
                          
                          // CRYPTO PENDING (RADAR SE VRTI, NEMA LINKOVA)
                          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-sm w-full">
                            <Radar className="w-16 h-16 text-blue-600 animate-pulse mb-5" />
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-3">RADAR ACTIVE</h2>
                            <p className="text-slate-600 text-[11px] uppercase font-bold tracking-widest leading-relaxed">Complete transaction in new tab.<br/>Delivery protocol starts upon blockchain confirmation.</p>
                            <button onClick={() => { if (onSuccess) onSuccess(); else onClose(); }} className="mt-8 w-full px-4 py-5 min-h-[60px] bg-white border-2 border-slate-300 text-slate-800 hover:bg-slate-100 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all">
                              DISCONNECT & CLOSE
                            </button>
                          </div>

                        ) : (downloadUrl || (cleanProjects && cleanProjects.length > 0)) ? (
                          
                          // CARD / PAYPAL / CONFIRMED CRYPTO SUCCESS (PRIKAZUJE LINKOVE!)
                          <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} className="flex flex-col items-center w-full">
                            
                            <div className="w-full bg-white border-2 border-slate-200 rounded-3xl shadow-lg overflow-hidden relative mb-2">
                              <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500"></div>
                              
                              <div className="p-5 flex flex-col items-center bg-emerald-50 border-b border-slate-200">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-emerald-300 mb-3 shadow-sm">
                                  <Check className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h2 className="text-base font-black text-slate-900 uppercase tracking-widest mb-1 text-center">TRANSACTION VERIFIED</h2>
                                <p className="text-emerald-700 text-[10px] font-black text-center uppercase tracking-widest">Encrypted Asset Delivery Hub</p>
                              </div>

                              <div className="p-5 bg-slate-50">
                                <p className="text-slate-600 text-[11px] font-black mb-4 flex items-center gap-2 uppercase tracking-widest">
                                  <Download className="w-5 h-5 text-blue-600" />
                                  Extract Master Archives:
                                </p>

                                {cleanProjects && cleanProjects.length > 0 ? (
                                  <div className="w-full flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cleanProjects.map((p, idx) => (
                                      <a 
                                        key={idx} 
                                        href={p.zipLink || p.driveLink || "#"} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="w-full px-4 py-3.5 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl flex items-center justify-between group transition-all cursor-pointer shadow-sm"
                                      >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                          <Folder className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                          <span className="text-[12px] font-black text-slate-800 group-hover:text-blue-800 uppercase tracking-widest truncate">{p.title}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shrink-0">
                                          <Download className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                      </a>
                                    ))}
                                  </div>
                                ) : (
                                  <a 
                                    href={downloadUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full px-5 py-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-400 rounded-xl flex items-center justify-between group transition-all cursor-pointer shadow-sm"
                                  >
                                    <div className="flex items-center gap-4 overflow-hidden">
                                      <Package className="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                      <span className="text-[13px] font-black text-slate-800 group-hover:text-blue-800 uppercase tracking-widest truncate">{safeName} Master Archive</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-50 border-2 border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shrink-0">
                                      <Download className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors animate-bounce" />
                                    </div>
                                  </a>
                                )}
                              </div>
                            </div>

                            <button 
                              onClick={() => {
                                if (onSuccess) onSuccess();
                                else onClose();
                              }}
                              className="mt-2 w-full px-4 py-5 min-h-[60px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[12px] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md"
                            >
                              CLOSE SECURE TERMINAL
                            </button>
                            
                          </motion.div>
                        ) : (
                          
                          // OPŠTI FALLBACK SUCCESS (BEZ LINKOVA)
                          <div className="flex flex-col items-center text-center p-8 bg-slate-50 rounded-3xl border-2 border-slate-200 shadow-sm w-full">
                            <CheckCircle className="w-16 h-16 text-emerald-500 mb-5" />
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-3">Transaction Verified</h2>
                            <p className="text-slate-600 text-[11px] uppercase font-bold tracking-widest leading-relaxed">Payment successful.<br/>Check your email for further instructions and invoice.</p>
                            <button onClick={() => { if (onSuccess) onSuccess(); else onClose(); }} className="mt-8 w-full px-4 py-5 min-h-[60px] bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-black uppercase tracking-widest text-[12px] transition-all shadow-md">
                              CLOSE TERMINAL
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="flex flex-col flex-1 w-full">
                        
                        {/* Individual / Agency Toggles */}
                        <div className="flex gap-2 mb-6 bg-blue-50/50 p-1.5 rounded-xl border-2 border-blue-100 w-full shadow-inner">
                          <button 
                            type="button"
                            onClick={() => setClientType('individual')}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${clientType === 'individual' ? 'bg-white text-blue-700 border-2 border-blue-400 shadow-md' : 'text-blue-500 hover:text-blue-700 hover:bg-white/50 border-2 border-transparent'}`}
                          >
                            <UserCircle className="w-5 h-5" /> Individual
                          </button>
                          <button 
                            type="button"
                            onClick={() => setClientType('agency')}
                            className={`flex-1 py-3 flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all ${clientType === 'agency' ? 'bg-white text-blue-700 border-2 border-blue-400 shadow-md' : 'text-blue-500 hover:text-blue-700 hover:bg-white/50 border-2 border-transparent'}`}
                          >
                            <Building2 className="w-5 h-5" /> Agency
                          </button>
                        </div>

                        <AnimatePresence mode="wait">
                          {clientType === 'agency' ? (
                            <motion.div 
                              key="agency"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col w-full"
                            >
                              <div className="flex items-center justify-between mb-5 border-b-2 border-blue-50 pb-3">
                                <h4 className="text-[11px] text-blue-800 font-black uppercase tracking-widest flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" /> Corporate Entity Details
                                </h4>
                                <span className="bg-orange-100 border border-orange-300 text-orange-700 px-2.5 py-1 rounded text-[9px] font-black shadow-sm">REVERSE CHARGE</span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-5 mb-5 w-full">
                                <div className="flex flex-col gap-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Legal Company Name *</label>
                                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required placeholder="Agency Name" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 text-[12px] font-black uppercase tracking-widest transition-all w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                                </div>
                                <div className="flex flex-col gap-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">VAT / Tax ID *</label>
                                  <input type="text" value={vatNumber} onChange={e => setVatNumber(e.target.value)} required placeholder="Required" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 text-[12px] font-black uppercase tracking-widest transition-all w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                                </div>
                              </div>

                              <div className="flex flex-col gap-2 mb-5 w-full">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Headquarters Address *</label>
                                <input type="text" value={address} onChange={e => setAddress(e.target.value)} required placeholder="Street name and number" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 text-[12px] font-black uppercase tracking-widest transition-all w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                              </div>

                              <div className="grid grid-cols-3 gap-5 mb-5 w-full">
                                <div className="flex flex-col gap-2 col-span-1">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">ZIP *</label>
                                  <input type="text" value={zipCode} onChange={e => setZipCode(e.target.value)} required placeholder="e.g. 10001" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 text-[12px] font-black uppercase tracking-widest transition-all w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                                </div>
                                <div className="flex flex-col gap-2 col-span-2">
                                  <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">City *</label>
                                  <input type="text" value={city} onChange={e => setCity(e.target.value)} required placeholder="e.g. New York" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 text-[12px] font-black uppercase tracking-widest transition-all w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="individual"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                              className="grid grid-cols-2 gap-5 mb-5 w-full pt-2"
                            >
                              <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">First Name *</label>
                                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="John" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all font-black uppercase tracking-widest text-[12px] w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                              </div>
                              <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Last Name *</label>
                                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required placeholder="Doe" className="bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all font-black uppercase tracking-widest text-[12px] w-full placeholder:text-blue-800/40 shadow-sm hover:border-blue-400 hover:bg-blue-50" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex flex-col gap-2 mb-5 w-full">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between ml-1">
                            <span>Verified Encrypted Email</span>
                            <Lock size={12} className="text-emerald-500 mr-1" />
                          </label>
                          <input type="email" value={email} readOnly className="bg-slate-100 border-2 border-slate-200 text-slate-500 p-3.5 rounded-xl focus:outline-none cursor-not-allowed font-black uppercase tracking-widest text-[12px] shadow-inner w-full" />
                        </div>

                        <div className="flex flex-col gap-2 mb-8 w-full">
                          <label className="text-[10px] font-black uppercase tracking-widest text-blue-900 ml-1">Jurisdiction / Country *</label>
                          <div className="relative w-full">
                            <select required value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-blue-50/30 border-2 border-blue-200 text-blue-950 p-3.5 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all appearance-none cursor-pointer font-black uppercase tracking-widest text-[12px] shadow-sm hover:border-blue-400 hover:bg-blue-50">
                              <option value="" className="text-slate-400">Select jurisdiction...</option>
                              {countryList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ChevronDown className="w-5 h-5 text-blue-500" />
                            </div>
                          </div>
                        </div>

                        {/* 🔥 GLAVNO DUGME - POVEĆANA VISINA 🔥 */}
                        <button 
                          type={paymentMethod === 'card' ? 'button' : 'submit'} 
                          onClick={() => { 
                            if (paymentMethod === 'card' && isFormValid()) {
                              setShowPaymentModal(true); 
                            } 
                          }} 
                          disabled={loading || !isFormValid()} 
                          className="mt-auto w-full disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:shadow-none bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-black py-5 min-h-[60px] rounded-xl text-[13px] tracking-widest uppercase transition-all shadow-lg active:scale-95 cursor-pointer"
                        >
                          {loading ? 'PROCESSING SECURE UPLINK...' : paymentMethod === 'card' ? 'AUTHORIZE SECURE PAYMENT' : 'REQUEST B2B SECURE LINK'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                {/* 🔥 DESNA KOLONA: V10 VAULT VISUAL - ČISTA PLAVA BOJA 🔥 */}
                <div className="relative hidden lg:block w-1/3 bg-slate-900 overflow-hidden shrink-0">
                  <button onClick={() => { if(success && onSuccess) onSuccess(); else onClose(); }} className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md cursor-pointer shadow-lg">
                    <X className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute inset-0 z-0">
                    <img src={projectImage} alt="Order Preview" className="w-full h-full object-cover opacity-90 transition-all duration-1000" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent"></div>
                  </div>

                  <div className="absolute bottom-10 right-10 z-10 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/30 border border-blue-400/50 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                      <ShieldCheck className="w-4 h-4 text-white" /> 
                      <span className="text-[10px] font-black tracking-widest text-white uppercase">Vault Secured</span>
                    </div>
                    <h2 className="text-white font-black text-3xl uppercase tracking-wider leading-none drop-shadow-2xl text-right">
                      Secure<br /><span className="text-orange-400">Protocol</span>
                    </h2>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔥 PAYMENT MODAL (CARD & PAYPAL) 🔥 */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative flex flex-col md:flex-row w-full max-w-4xl p-[3px] rounded-[2.6rem] bg-gradient-to-br from-blue-500 via-indigo-400 to-orange-500 shadow-[0_20px_80px_rgba(59,130,246,0.4)]"
            >
              <div className="bg-white w-full h-full rounded-[2.4rem] flex flex-col md:flex-row relative overflow-hidden">
                <button onClick={() => setShowPaymentModal(false)} className="absolute top-5 right-5 z-[100] w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full border-2 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors shadow-sm cursor-pointer"><X size={18} /></button>

                <div className="hidden md:flex md:w-[45%] relative bg-slate-900 border-r border-slate-200 overflow-hidden">
                  <img src={projectImage} alt="Payment Screen" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-10 left-8 z-10 pr-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/80 border border-orange-400 backdrop-blur-md mb-3 shadow-[0_0_15px_rgba(234,88,12,0.5)]">
                      <Lock className="w-4 h-4 text-white" /> 
                      <span className="text-[10px] font-black tracking-widest text-white uppercase">Gateway Encrypted</span>
                    </div>
                    <h2 className="text-white font-black text-3xl uppercase tracking-wider leading-tight drop-shadow-2xl">Finalize<br /><span className="text-orange-400">Transaction</span></h2>
                  </div>
                </div>

                <div className="w-full md:w-[55%] p-8 md:p-10 flex flex-col justify-center bg-white min-h-[450px]">
                  <div className="mb-8 border-b-2 border-slate-100 pb-6">
                    <h3 className="text-slate-900 font-black text-xl uppercase tracking-widest mb-1">{safeName}</h3>
                    <p className="text-blue-600 text-sm font-black tracking-widest">${safePrice}{activeIsMonthly ? '/mo' : ''}</p>
                  </div>

                  <div className="relative z-10 w-full">
                    {paymentMethod === 'card' ? (
                      <div className="flex flex-col gap-6">
                        <div className="p-6 bg-blue-50/30 border-2 border-blue-200 rounded-3xl flex flex-col gap-4 shadow-sm">
                          <input type="text" placeholder="Card Number (Test: 4242)" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3.5 text-blue-950 text-[13px] font-black uppercase tracking-widest placeholder:text-blue-900/40 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all shadow-sm" />
                          <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="MM/YY" value={cardExp} onChange={e => setCardExp(e.target.value)} className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3.5 text-blue-950 text-[13px] font-black uppercase tracking-widest placeholder:text-blue-900/40 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all shadow-sm" />
                            <input type="text" placeholder="CVC" value={cardCvc} onChange={e => setCardCvc(e.target.value)} className="w-full bg-white border-2 border-blue-200 rounded-xl px-4 py-3.5 text-blue-950 text-[13px] font-black uppercase tracking-widest placeholder:text-blue-900/40 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20 transition-all shadow-sm" />
                          </div>
                        </div>
                        {/* 🔥 DUGME U CARD MODALU - POVEĆANA VISINA 🔥 */}
                        <button onClick={handleTestCardPayment} disabled={isCardProcessing} className="w-full bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white font-black uppercase tracking-widest py-5 min-h-[60px] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-[13px] cursor-pointer">
                          {isCardProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <>AUTHORIZE ${safePrice}</>}
                        </button>
                      </div>
                    ) : activeIsMonthly ? (
                      <PayPalButtons style={{ layout: "vertical", color: "blue", shape: "rect", label: "subscribe" }} createSubscription={paypalCreateSubscription} onApprove={paypalOnApproveSubscription} />
                    ) : (
                      <PayPalButtons style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }} createOrder={paypalCreateOrder} onApprove={paypalOnApproveOrder} />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PayPalScriptProvider>,
    document.body
  );
};

export default V10SecureCheckout;
// KRAJ FAJLA: V10SecureCheckout.jsx