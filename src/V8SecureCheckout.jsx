// POČETAK FAJLA: src/V8SecureCheckout.jsx (STRICT FIREBASE PAYMENT VERIFICATION GATE)
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, X, CheckCircle, Bitcoin, CreditCard, Link as LinkIcon,
  Download, FileText, Radar, Crown, Briefcase, Rocket, Package, ChevronDown, Box, Lock, Clock
} from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const countryList = [
  "Australia", "Austria", "Belgium", "Canada", "Denmark", "Finland", "France", "Germany", "Ireland", "Italy", "Japan", "Luxembourg", "Netherlands", "New Zealand", "Norway", "Qatar", "Saudi Arabia", "Singapore", "Spain", "Sweden", "Switzerland", "United Arab Emirates", "United Kingdom", "United States", "Other", "Serbia"
];

const getBackendUrl = () => "https://aitoolsprosmart-becend-production.up.railway.app";
const N8N_WHATSAPP_WEBHOOK = "https://aitools-n8n.app.n8n.cloud/webhook/v10-sale-alert";
const TIER_ICONS = [Rocket, Briefcase, Crown, Package];

// Proverava da li je u Firebase dokumentu zaista potvrđeno da su pare legle
const isFirebasePaymentConfirmed = (data) => {
  if (!data) return false;
  const statusUpper = String(data.status || '').toUpperCase();
  return (
    data.isPaid === true ||
    statusUpper === 'PAID' ||
    statusUpper === 'PLAĆENO' ||
    statusUpper === 'PLACENO' ||
    statusUpper === 'COMPLETED' ||
    statusUpper === 'ACTIVE'
  );
};

const V8SecureCheckout = ({
  isOpen,
  onClose,
  paketId = null,
  productName,
  price,
  zipLink = "", // Opcioni fallback za druge stranice; NIKADA se ne prikazuje klijentu dok Firebase ne potvrdi uplatu!
  licenseTier = null,
  availableTiers = [],
  projectImage = "/v8-secure-blue.webp",
  selectedProjects = []
}) => {
  const [user, setUser] = useState(null);

  const hasMultipleTiers = availableTiers && availableTiers.length > 0;
  const defaultTierId = hasMultipleTiers ? availableTiers[0].id : 'default';

  const [selectedTier, setSelectedTier] = useState(defaultTierId);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPayPalModal, setShowPayPalModal] = useState(false);

  // 🔒 STROGA ZAŠTITA: Fajl i licenca su NULL i FALSE sve dok Firebase ne vrati isPaid === true!
  const [firebaseVerifiedPaid, setFirebaseVerifiedPaid] = useState(false);
  const [verifiedDownloadUrl, setVerifiedDownloadUrl] = useState(null);
  const [pendingVerificationRef, setPendingVerificationRef] = useState(null); // { collectionName, docId }

  const activeTierObj = hasMultipleTiers ? availableTiers.find(t => t.id === selectedTier) : null;
  const activePrice = hasMultipleTiers ? activeTierObj?.price : price;
  const activeName = hasMultipleTiers ? activeTierObj?.name : productName;
  const activeIsMonthly = hasMultipleTiers ? activeTierObj?.isMonthly : false;
  const activePlanId = hasMultipleTiers ? activeTierObj?.planId : null;

  // ============================================================================
  // 📜 3 LINIJE KODA ZA AUTOMATSKO ODREĐIVANJE ODGOVARAJUĆE STOCK PHOTOS LICENCE
  // ============================================================================
  const isEnterpriseLicense = licenseTier ? licenseTier === 'enterprise' : (/ENTERPRISE/i.test(String(activeName || '')) || (!/STANDARD COMMERCIAL/i.test(String(activeName || '')) && parseFloat(activePrice) >= 299));
  const resolvedLicenseName = isEnterpriseLicense ? 'Global Enterprise License (Unlimited Clients, TV & OOH)' : 'Standard Commercial License (Single-Project Rights)';
  const resolvedLicensePdf = isEnterpriseLicense ? '/PREMIUM ENTERPRISE LICENSE.pdf' : '/V8_COMMERCIAL_LICENSE.pdf';

  const initialOptions = { "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD", vault: true };

  // Sigurno dohvatanje ZIP linka iz baze TEK NAKON ŠTO JE FIREBASE POTVRDIO UPLATU
  const fetchProtectedZipAfterPaid = async (docData) => {
    if (docData?.zipLink) return docData.zipLink;
    if (docData?.downloadUrl) return docData.downloadUrl;
    if (paketId) {
      try {
        const pkgSnap = await getDoc(doc(db, "v8_stock_paketi", paketId));
        if (pkgSnap.exists() && pkgSnap.data().zipLink) {
          return pkgSnap.data().zipLink;
        }
      } catch (err) {
        console.error("Greška pri čitanju paketa:", err);
      }
    }
    return zipLink || null;
  };

  // ============================================================================
  // 🔔 FUNKCIJA ZA AUTOMATSKI WHATSAPP ALARM NA TVOJ TELEFON
  // ============================================================================
  const sendWhatsAppSaleAlert = async (methodLabel, customProductName = null, customPrice = null) => {
    try {
      const fullBuyerName = `${firstName} ${lastName}`.trim() || 'B2B Client';
      const buyerWithCountry = country ? `${fullBuyerName} (${country})` : fullBuyerName;
      const finalProduct = customProductName || (hasMultipleTiers ? `${productName} - ${activeName}` : productName);
      const finalAmount = customPrice || activePrice;

      await fetch(N8N_WHATSAPP_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: 'WhatsApp',
          buyer: buyerWithCountry,
          email: email || user?.email || 'Nepoznat email',
          product: finalProduct,
          license: resolvedLicenseName,
          amount: String(finalAmount).startsWith('$') ? String(finalAmount) : `$${finalAmount}`,
          method: methodLabel
        })
      });
    } catch (err) {
      console.warn('WhatsApp webhook notification skipped:', err);
    }
  };

  const triggerGoogleAnalyticsPurchase = (transactionId, finalPrice) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transactionId,
        value: Number(finalPrice),
        currency: "USD",
        items: [{ item_id: paketId || selectedTier, item_name: activeName, item_variant: resolvedLicenseName, price: Number(finalPrice), quantity: 1 }]
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
      setEmail(currentUser?.email || '');
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false);
      setSuccess(false);
      setShowPayPalModal(false);
      setFirebaseVerifiedPaid(false);
      setVerifiedDownloadUrl(null);
      setPendingVerificationRef(null);
      if (hasMultipleTiers) setSelectedTier(defaultTierId);
    }
  }, [isOpen, defaultTierId, hasMultipleTiers]);

  // ============================================================================
  // 🔒 GLAVNI FIREBASE ČUVAR: SLUŠA DOKUMENT U BAZI I NE DAJE FAJL DOK PARE NE LEGNU!
  // ============================================================================
  useEffect(() => {
    if (!pendingVerificationRef?.collectionName || !pendingVerificationRef?.docId) return;

    const targetRef = doc(db, pendingVerificationRef.collectionName, pendingVerificationRef.docId);
    const unsub = onSnapshot(targetRef, async (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();

      // Tek kada u Firebase dokumentu stoji da je plaćeno (isPaid: true ili status: PLAĆENO / PAID / ACTIVE)
      if (isFirebasePaymentConfirmed(data)) {
        const safeUrl = await fetchProtectedZipAfterPaid(data);
        if (safeUrl) {
          setVerifiedDownloadUrl(safeUrl);
          setFirebaseVerifiedPaid(true);
          triggerGoogleAnalyticsPurchase(pendingVerificationRef.docId, activePrice);
        }
      }
    });

    return () => unsub();
  }, [pendingVerificationRef, activePrice]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user || !firstName || !lastName || !country || !email) return alert("Please complete all fields.");

    setLoading(true);
    const finalProductName = hasMultipleTiers ? `${productName} - ${activeName}` : productName;

    try {
      if (paymentMethod === 'payoneer' || paymentMethod === 'b2b') {
        const docRef = await addDoc(collection(db, "v8_payoneer_requests"), {
          uid: user.uid,
          paketId: paketId || null,
          ime: `${firstName} ${lastName}`.trim(),
          email: email,
          clientEmail: email,
          firstName,
          lastName,
          country,
          zeliPaket: finalProductName,
          productName: finalProductName,
          licenseType: resolvedLicenseName,
          licensePdf: resolvedLicensePdf,
          cenaPaketa: activePrice,
          price: activePrice,
          isMonthly: activeIsMonthly,
          method: "payoneer",
          handledBy: "info@aitoolsprosmart.com",
          status: "pending",
          isPaid: false, // 🔒 ZAKLJUČANO DOK TI U FIREBASE NE POTVRDIŠ DA SU PARE LEGLE!
          requestDate: serverTimestamp(),
          vreme: serverTimestamp(),
          selectedProjects: selectedProjects
        });
        await sendWhatsAppSaleAlert('Payoneer B2B Invoice Request (PENDING PAYMENT)', finalProductName, activePrice);
        setPendingVerificationRef({ collectionName: "v8_payoneer_requests", docId: docRef.id });
        setSuccess(true);
        setLoading(false);
      } else if (paymentMethod === 'crypto') {
        const docRef = await addDoc(collection(db, "v8_crypto_requests"), {
          uid: user.uid,
          paketId: paketId || null,
          clientEmail: email,
          email: email,
          firstName,
          lastName,
          country,
          productName: finalProductName,
          licenseType: resolvedLicenseName,
          licensePdf: resolvedLicensePdf,
          price: activePrice,
          isMonthly: activeIsMonthly,
          method: "crypto",
          status: "initiating_gateway",
          isPaid: false, // 🔒 ZAKLJUČANO DOK BACKEND WEBHOOK NE ZAPIŠE U FIREBASE DA JE PLAĆENO!
          requestDate: serverTimestamp(),
          selectedProjects: selectedProjects
        });
        await sendWhatsAppSaleAlert('Crypto Checkout Initiated (WAITING BLOCKCHAIN)', finalProductName, activePrice);
        const response = await fetch(`${getBackendUrl()}/api/crypto-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: docRef.id,
            uid: user.uid,
            paketId: paketId || null,
            clientEmail: email,
            productName: finalProductName,
            licenseType: resolvedLicenseName,
            price: activePrice
          })
        });
        const data = await response.json();
        if (response.ok && data.paymentUrl) {
          window.open(data.paymentUrl, '_blank');
          setPendingVerificationRef({ collectionName: "v8_crypto_requests", docId: docRef.id });
          setSuccess(true);
          setLoading(false);
        } else {
          alert("Gateway connection failed.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <PayPalScriptProvider options={initialOptions}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-8 font-sans">

            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-6xl rounded-[2.5rem] border border-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.1)] flex flex-col md:flex-row relative overflow-hidden h-auto min-h-[600px]"
            >

              <div className="w-full md:w-2/3 flex flex-col md:flex-row p-8 md:p-10 gap-10">

                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-600" /> {hasMultipleTiers ? 'Select License' : 'Selected Asset & License'}
                  </h2>

                  <div className="flex flex-col gap-4">
                    {hasMultipleTiers ? (
                      availableTiers.map((tier, idx) => {
                        const IconComponent = TIER_ICONS[idx % TIER_ICONS.length];
                        return (
                          <button
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            className={`text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                              selectedTier === tier.id
                                ? 'bg-blue-50/50 border-blue-500 shadow-[0_10px_20px_rgba(59,130,246,0.1)] ring-1 ring-blue-500'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {selectedTier === tier.id && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>}
                            <div className="flex items-center gap-3 mb-2">
                              <IconComponent className={`w-5 h-5 ${selectedTier === tier.id ? 'text-blue-600' : 'text-slate-400'}`} />
                              <h3 className={`font-black uppercase tracking-wider text-sm ${selectedTier === tier.id ? 'text-blue-900' : 'text-slate-700'}`}>{tier.name}</h3>
                            </div>
                            <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-4 ml-8">{tier.desc}</p>
                            <div className="text-slate-900 font-black text-2xl ml-8 flex items-baseline gap-1">
                              ${tier.price} {tier.isMonthly && <span className="text-xs text-slate-400 font-bold uppercase">/mo</span>}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className={`text-left p-6 rounded-2xl border shadow-[0_10px_20px_rgba(59,130,246,0.05)] relative overflow-hidden ${
                        isEnterpriseLicense ? 'bg-amber-50/60 border-amber-400' : 'bg-blue-50 border-blue-300'
                      }`}>
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isEnterpriseLicense ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        <div className="flex items-center gap-3 mb-3">
                          {isEnterpriseLicense ? (
                            <Crown className="w-6 h-6 text-amber-600 shrink-0" />
                          ) : (
                            <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
                          )}
                          <h3 className="text-slate-900 font-black uppercase tracking-wider text-sm leading-snug">{productName}</h3>
                        </div>

                        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ml-9 ${
                          isEnterpriseLicense ? 'text-amber-800' : 'text-blue-800'
                        }`}>
                          {resolvedLicenseName}
                        </p>

                        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-4 ml-9">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" /> ZIP &amp; Official License PDF unlock after Firebase payment confirmation
                        </p>

                        <div className="text-slate-900 font-black text-4xl ml-9">${price}</div>
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
                          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-500 flex gap-3.5 items-start shadow-md mt-2">
                            <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0 mt-0.5 shadow-sm">
                              <Clock className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <h4 className="text-slate-950 text-xs font-black uppercase tracking-wider">
                                Payoneer B2B Protocol
                              </h4>
                              <p className="text-slate-900 text-[13px] font-semibold leading-relaxed">
                                Access to package downloads unlocks <strong className="font-black text-amber-900 underline decoration-amber-500">strictly after balance settlement</strong> (6–12 hours). Once payment is confirmed in our ledger, your ZIP &amp; License PDF unlock automatically.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-slate-500 text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Billing Info
                  </h2>

                  <div className="flex gap-3 mb-8">
                    <button type="button" onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all cursor-pointer ${paymentMethod === 'card' ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <CreditCard className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('payoneer')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all cursor-pointer ${paymentMethod === 'payoneer' ? 'bg-amber-50 border-amber-500 text-slate-950 ring-2 ring-amber-500/40 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <LinkIcon className={`w-5 h-5 ${paymentMethod === 'payoneer' ? 'text-amber-600' : ''}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">B2B Link</span>
                    </button>
                    <button type="button" onClick={() => setPaymentMethod('crypto')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all cursor-pointer ${paymentMethod === 'crypto' ? 'bg-blue-50 border-blue-600 text-blue-800 ring-2 ring-blue-500/30' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <Bitcoin className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Crypto</span>
                    </button>
                  </div>

                  {success ? (
                    <div className="flex flex-col items-center justify-center py-10 flex-grow">
                      {/* 🔒 JEDINO AKO JE FIREBASE VRATIO isPaid === true PRIKAZUJEMO DUGMAD ZA PREUZIMANJE! */}
                      {firebaseVerifiedPaid && verifiedDownloadUrl ? (
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 mb-6 shadow-sm">
                            <Download className="w-10 h-10 text-emerald-500 animate-bounce" />
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest mb-2 text-center">PAYMENT VERIFIED</h2>
                          <p className="text-emerald-600 text-xs font-bold mb-6 text-center">Firebase Ledger Confirmed • Asset &amp; License Unlocked</p>
                          <div className="flex flex-col gap-3 w-full items-center">
                            <a href={verifiedDownloadUrl} target="_blank" rel="noopener noreferrer" className="w-full justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all hover:scale-105 flex items-center gap-3">
                              <Download size={16} /> DOWNLOAD MASTER ZIP
                            </a>
                            <a href={resolvedLicensePdf} download target="_blank" rel="noopener noreferrer" className="w-full justify-center px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-md transition-all flex items-center gap-2">
                              <FileText size={14} /> DOWNLOAD {isEnterpriseLicense ? 'ENTERPRISE' : 'STANDARD'} LICENSE PDF
                            </a>
                          </div>
                        </motion.div>
                      ) : paymentMethod === 'crypto' ? (
                        <div className="flex flex-col items-center text-center">
                          <Radar className="w-16 h-16 text-orange-500 animate-pulse mb-4" />
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">WAITING BLOCKCHAIN &amp; FIREBASE</h2>
                          <p className="text-slate-600 text-xs uppercase font-bold tracking-widest leading-relaxed">
                            Complete payment in the new tab.<br />Files remain locked until Firebase confirms settlement.
                          </p>
                        </div>
                      ) : paymentMethod === 'card' ? (
                        <div className="flex flex-col items-center text-center">
                          <Radar className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">VERIFYING FIREBASE LEDGER...</h2>
                          <p className="text-slate-600 text-xs uppercase font-bold tracking-widest leading-relaxed">
                            Confirming cleared funds in database.<br />Download unlocks automatically the moment payment is recorded.
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <CheckCircle className="w-16 h-16 text-blue-600 mb-4" />
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">Invoice Request Logged</h2>
                          <p className="text-slate-700 text-xs uppercase font-bold tracking-widest leading-relaxed">
                            Thank you, {firstName}.<br />Your files &amp; {isEnterpriseLicense ? 'Enterprise' : 'Standard'} License will unlock on your account as soon as payment clears.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">First Name</label>
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Last Name</label>
                          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all font-semibold" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-700 flex items-center justify-between">
                          <span>Verified Email</span>
                          <Lock size={12} className="text-emerald-600" />
                        </label>
                        <input type="email" value={email} readOnly className="bg-slate-100 border border-slate-300 text-slate-700 p-3 rounded-xl focus:outline-none cursor-not-allowed font-semibold" />
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-700">Country</label>
                        <div className="relative">
                          <select required value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-semibold">
                            <option value="">Select country</option>
                            {countryList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-slate-600" />
                          </div>
                        </div>
                      </div>

                      <button
                        type={paymentMethod === 'card' ? 'button' : 'submit'}
                        onClick={() => { if (paymentMethod === 'card' && firstName && lastName && country) setShowPayPalModal(true); }}
                        disabled={loading || !country || !firstName || !lastName || !user}
                        className="mt-auto w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 rounded-xl text-xs tracking-widest uppercase transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95 cursor-pointer"
                      >
                        {loading ? 'Processing...' : paymentMethod === 'card' ? 'PROCEED TO SECURE PAYMENT' : 'REQUEST B2B INVOICE'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              <div className="relative hidden md:block md:w-1/3 bg-slate-900 overflow-hidden">
                <button onClick={onClose} className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 z-0">
                  <img src={projectImage} alt="Order Preview" className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
                </div>
                <div className="absolute bottom-10 right-10 z-10 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 backdrop-blur-md mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-300" />
                    <span className="text-[9px] font-black tracking-widest text-blue-100 uppercase">Firebase Ledger Gate</span>
                  </div>
                  <h2 className="text-white font-black text-2xl uppercase tracking-wider leading-tight drop-shadow-lg">
                    Secure<br />Protocol
                  </h2>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPayPalModal && (
          <div className="fixed inset-0 z-[10000000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200"
            >
              <button onClick={() => setShowPayPalModal(false)} className="absolute top-4 right-4 z-[100] w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"><X size={16} /></button>

              <div className="hidden md:flex md:w-[45%] relative bg-slate-900 border-r border-slate-200 overflow-hidden">
                <img src={projectImage} alt="Payment Screen" className="w-full h-full object-cover opacity-60 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div className="absolute bottom-10 left-8 z-10 pr-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 backdrop-blur-md mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-300" />
                    <span className="text-[10px] font-bold tracking-widest text-blue-100 uppercase">Gateway Secured</span>
                  </div>
                  <h2 className="text-white font-black text-2xl uppercase tracking-wider leading-tight drop-shadow-md">Finalize<br />Transaction</h2>
                </div>
              </div>

              <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white min-h-[400px]">
                <div className="mb-8 border-b border-slate-100 pb-6">
                  <h3 className="text-slate-900 font-black text-xl uppercase tracking-widest mb-1">{activeName}</h3>
                  <p className="text-xs font-extrabold uppercase tracking-wider text-blue-700 mb-2">{resolvedLicenseName}</p>
                  <p className="text-slate-500 text-sm font-bold tracking-widest">${activePrice}{activeIsMonthly ? '/mo' : ''}</p>
                </div>

                <div className="relative z-10 w-full">
                  {activeIsMonthly ? (
                    <PayPalButtons
                      style={{ layout: "vertical", color: "blue", shape: "rect", label: "subscribe" }}
                      createSubscription={(data, actions) => { return actions.subscription.create({ plan_id: activePlanId }); }}
                      onApprove={async (data) => {
                        try {
                          // Upisujemo u Firebase i čekamo da onSnapshot potvrdi zapis pre otključavanja!
                          await setDoc(doc(db, "v8_paypal_subscriptions", data.subscriptionID), {
                            uid: user?.uid || null,
                            paketId: paketId || null,
                            clientEmail: email,
                            firstName,
                            lastName,
                            country,
                            productName: activeName,
                            licenseType: resolvedLicenseName,
                            licensePdf: resolvedLicensePdf,
                            subscriptionId: data.subscriptionID,
                            status: "ACTIVE",
                            isPaid: true,
                            createdAt: serverTimestamp(),
                            selectedProjects: selectedProjects
                          });
                          setPendingVerificationRef({ collectionName: "v8_paypal_subscriptions", docId: data.subscriptionID });
                          setShowPayPalModal(false);
                          setSuccess(true);
                          await sendWhatsAppSaleAlert('PayPal Monthly Subscription (FIREBASE RECORDED)', activeName, `${activePrice}/mo`);
                        } catch (error) {
                          console.error("Greška:", error);
                          alert("Subscription captured, awaiting database confirmation.");
                        }
                      }}
                    />
                  ) : (
                    <PayPalButtons
                      style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [{ description: `${activeName} (${resolvedLicenseName})`, amount: { value: activePrice.toString() } }]
                        });
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          const details = await actions.order.capture();
                          const captureCompleted = details?.status === 'COMPLETED';

                          // 1. Prvo kreiramo ZAKLJUČAN dokument u Firebase (isPaid: false) dok backend ne verifikuje uplatu!
                          const paypalDocRef = doc(db, "v8_paypal_requests", details.id);
                          await setDoc(paypalDocRef, {
                            uid: user?.uid || null,
                            paketId: paketId || null,
                            orderId: details.id,
                            clientEmail: email,
                            email: email,
                            firstName,
                            lastName,
                            country,
                            productName: activeName,
                            licenseType: resolvedLicenseName,
                            licensePdf: resolvedLicensePdf,
                            price: activePrice,
                            status: "verifying_backend",
                            isPaid: false, // 🔒 NE DAJE FAJL DOK SE NE POTVRDI!
                            createdAt: serverTimestamp(),
                            selectedProjects: selectedProjects
                          }, { merge: true });

                          // Uključujemo Firebase listener i prebacujemo modal na "VERIFYING FIREBASE LEDGER..."
                          setPendingVerificationRef({ collectionName: "v8_paypal_requests", docId: details.id });
                          setShowPayPalModal(false);
                          setSuccess(true);

                          // 2. Šaljemo na Railway backend verifikaciju
                          const backendUrl = getBackendUrl();
                          const response = await fetch(`${backendUrl}/api/paypal-verify`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              orderId: details.id,
                              uid: user?.uid || null,
                              paketId: paketId || null,
                              clientEmail: email,
                              firstName,
                              lastName,
                              country,
                              productName: activeName,
                              licenseType: resolvedLicenseName,
                              licensePdf: resolvedLicensePdf,
                              price: activePrice,
                              selectedProjects: selectedProjects
                            })
                          });
                          const resData = await response.json();

                          // 3. TEK KADA SU I PAYPAL CAPTURE I BACKEND POTVRDILI DA SU PARE LEGLE -> UPISUJEMO isPaid: true U FIREBASE!
                          if (captureCompleted && resData.success) {
                            await setDoc(paypalDocRef, {
                              isPaid: true,
                              status: "PAID",
                              paidAt: serverTimestamp(),
                              ...(resData.downloadUrl ? { downloadUrl: resData.downloadUrl } : {})
                            }, { merge: true });

                            // Istog trenutka gornji Firebase onSnapshot detektuje isPaid === true i tek tada otključava ZIP i PDF licencu!
                            await sendWhatsAppSaleAlert('PayPal / Card (FIREBASE VERIFIED & PAID)', activeName, activePrice);
                          } else {
                            alert("Payment verification pending. Files remain locked until confirmed in Firebase.");
                          }
                        } catch (error) {
                          console.error("Greška:", error);
                          alert("Payment captured, awaiting Firebase ledger confirmation before unlocking files.");
                        }
                      }}
                    />
                  )}
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

export default V8SecureCheckout;
// KRAJ FAJLA: src/V8SecureCheckout.jsx