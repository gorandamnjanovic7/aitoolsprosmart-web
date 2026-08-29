// POČETAK FAJLA: V8SecureCheckout.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { db, auth } from './firebase'; 
import { collection, addDoc, serverTimestamp, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { ShieldCheck, X, CheckCircle, Bitcoin, Zap, CreditCard, Link as LinkIcon, Download, Radar, Crown, Briefcase, Rocket, Package, ChevronDown, Box, Lock } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; 

const countryList = [
  "Australia", "Austria", "Belgium", "Canada", "Denmark", "Finland", "France", "Germany", "Ireland", "Italy", "Japan", "Luxembourg", "Netherlands", "New Zealand", "Norway", "Qatar", "Saudi Arabia", "Singapore", "Spain", "Sweden", "Switzerland", "United Arab Emirates", "United Kingdom", "United States", "Other", "Serbia"
];

const getBackendUrl = () => "https://aitoolsprosmart-becend-production.up.railway.app";
const TIER_ICONS = [Rocket, Briefcase, Crown, Package];

const V8SecureCheckout = ({ isOpen, onClose, productName, price, zipLink, availableTiers = [], projectImage = "/v8-secure-blue.webp" }) => {
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
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [cryptoOrderId, setCryptoOrderId] = useState(null);

  const activeTierObj = hasMultipleTiers ? availableTiers.find(t => t.id === selectedTier) : null;
  const activePrice = hasMultipleTiers ? activeTierObj?.price : price;
  const activeName = hasMultipleTiers ? activeTierObj?.name : productName;
  const activeIsMonthly = hasMultipleTiers ? activeTierObj?.isMonthly : false;
  const activePlanId = hasMultipleTiers ? activeTierObj?.planId : null;

  const initialOptions = { "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID, currency: "USD", vault: true };

  const triggerGoogleAnalyticsPurchase = (transactionId, finalPrice) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
            transaction_id: transactionId, value: Number(finalPrice), currency: "USD",
            items: [{ item_id: selectedTier, item_name: activeName, price: Number(finalPrice), quantity: 1 }]
        });
    }
  };

  useEffect(() => { if (isOpen) document.body.style.overflow = 'hidden'; else document.body.style.overflow = ''; return () => { document.body.style.overflow = ''; }; }, [isOpen]);

  useEffect(() => { const unsubscribe = onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); setEmail(currentUser?.email || ''); }); return () => unsubscribe(); }, []);

  useEffect(() => {
    if (!isOpen) {
      setLoading(false); setSuccess(false); setShowPayPalModal(false); setDownloadUrl(null); setCryptoOrderId(null);
      if (hasMultipleTiers) setSelectedTier(defaultTierId);
    }
  }, [isOpen, defaultTierId, hasMultipleTiers]);

  useEffect(() => {
    if (cryptoOrderId && paymentMethod === 'crypto') {
      const unsub = onSnapshot(doc(db, "v8_crypto_requests", cryptoOrderId), (docSnap) => {
        if (docSnap.exists() && docSnap.data().status === 'PLAĆENO') {
          setDownloadUrl(docSnap.data().zipLink); triggerGoogleAnalyticsPurchase(cryptoOrderId, activePrice);
          setTimeout(() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 5000); 
        }
      });
      return () => unsub();
    }
  }, [cryptoOrderId, paymentMethod, activePrice, onClose]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user || !firstName || !lastName || !country || !email) return alert("Please complete all fields.");
    
    setLoading(true);
    const finalProductName = hasMultipleTiers ? `${productName} - ${activeName}` : productName;

    try {
      if (paymentMethod === 'payoneer' || paymentMethod === 'b2b') {
        const docRef = await addDoc(collection(db, "v8_payoneer_requests"), {
          clientEmail: email, firstName, lastName, country, productName: finalProductName, price: activePrice, isMonthly: activeIsMonthly, zipLink: zipLink || "", method: "payoneer", handledBy: "info@aitoolsprosmart.com", status: "pending", requestDate: serverTimestamp()
        });
        setSuccess(true); setLoading(false); triggerGoogleAnalyticsPurchase(docRef.id, activePrice); setTimeout(() => { onClose(); }, 3500); 
      } else if (paymentMethod === 'crypto') {
        const docRef = await addDoc(collection(db, "v8_crypto_requests"), {
          clientEmail: email, firstName, lastName, country, productName: finalProductName, price: activePrice, isMonthly: activeIsMonthly, zipLink: zipLink || "", method: "crypto", status: "initiating_gateway", requestDate: serverTimestamp()
        });
        const response = await fetch(`${getBackendUrl()}/api/crypto-checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: docRef.id, clientEmail: email, productName: finalProductName, price: activePrice, zipLink }) });
        const data = await response.json();
        if (response.ok && data.paymentUrl) { window.open(data.paymentUrl, '_blank'); setCryptoOrderId(docRef.id); setSuccess(true); setLoading(false); } 
        else { alert("Gateway connection failed."); setLoading(false); }
      }
    } catch (error) { console.error("Error:", error); alert("An error occurred."); setLoading(false); }
  };

  if (!isOpen) return null;

  return createPortal(
    <PayPalScriptProvider options={initialOptions}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 sm:p-8 font-sans">
            
            {/* 🌟 PREMIUM STUDIO LIGHT MODAL 🌟 */}
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }} 
              animate={{ scale: 1, y: 0, opacity: 1 }} 
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white w-full max-w-6xl rounded-[2.5rem] border border-slate-200 shadow-[0_20px_80px_rgba(0,0,0,0.1)] flex flex-col md:flex-row relative overflow-hidden h-auto min-h-[600px]"
            >
              
              {/* LEVA I SREDNJA KOLONA */}
              <div className="w-full md:w-2/3 flex flex-col md:flex-row p-8 md:p-10 gap-10">
                
                {/* KOLONA 1: SELECT LICENSE */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Box className="w-4 h-4 text-blue-500" /> {hasMultipleTiers ? 'Select License' : 'Selected Asset'}
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
                      )})
                    ) : (
                      <div className="text-left p-6 rounded-2xl border bg-blue-50 border-blue-300 shadow-[0_10px_20px_rgba(59,130,246,0.05)] relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                        <div className="flex items-center gap-3 mb-4">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                          <h3 className="text-blue-900 font-black uppercase tracking-wider text-sm leading-snug">{productName}</h3>
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-4 ml-9">Commercial Master License</p>
                        <div className="text-slate-900 font-black text-4xl ml-9">${price}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* KOLONA 2: BILLING INFO */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Billing Info
                  </h2>
                  
                  {/* Tabs za placanje */}
                  <div className="flex gap-3 mb-8">
                    <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <CreditCard className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Card</span>
                    </button>
                    <button onClick={() => setPaymentMethod('payoneer')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all ${paymentMethod === 'payoneer' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <LinkIcon className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">B2B Link</span>
                    </button>
                    <button onClick={() => setPaymentMethod('crypto')} className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 rounded-xl border transition-all ${paymentMethod === 'crypto' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'}`}>
                      <Bitcoin className="w-5 h-5" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Crypto</span>
                    </button>
                  </div>

                  {/* Forma ili Success State */}
                  {success ? (
                    <div className="flex flex-col items-center justify-center py-10 flex-grow">
                      {downloadUrl ? (
                        <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="flex flex-col items-center">
                          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-200 mb-6 shadow-sm"><Download className="w-10 h-10 text-emerald-500 animate-bounce" /></div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-widest mb-2 text-center">ACCESS GRANTED</h2>
                          <p className="text-emerald-600 text-xs font-bold mb-8 text-center">{activeName} is unlocked.</p>
                          <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[11px] shadow-lg transition-all hover:scale-105 flex items-center gap-3"><Download size={16} /> DOWNLOAD MASTER</a>
                        </motion.div>
                      ) : paymentMethod === 'crypto' ? (
                        <div className="flex flex-col items-center text-center">
                          <Radar className="w-16 h-16 text-orange-500 animate-pulse mb-4" />
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">RADAR ACTIVE</h2>
                          <p className="text-slate-500 text-[11px] uppercase font-bold tracking-widest leading-relaxed">Complete transaction in the new tab.<br/>Delivery starts after confirmation.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center text-center">
                          <CheckCircle className="w-16 h-16 text-blue-500 mb-4" />
                          <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest mb-3">Request Secured</h2>
                          <p className="text-slate-500 text-[11px] uppercase font-bold tracking-widest leading-relaxed">Thank you, {firstName}.<br/>Invoice will be sent to your email.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">First Name</label>
                          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Last Name</label>
                          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between">
                          <span>Verified Email</span>
                          <Lock size={10} className="text-emerald-500" />
                        </label>
                        <input type="email" value={email} readOnly className="bg-slate-100 border border-slate-200 text-slate-400 p-3 rounded-xl focus:outline-none cursor-not-allowed font-medium" />
                      </div>

                      <div className="flex flex-col gap-2 mb-4">
                        <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Country</label>
                        <div className="relative">
                          <select required value={country} onChange={e => setCountry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer font-medium">
                            <option value="">Select country</option>
                            {countryList.map((c, i) => <option key={i} value={c}>{c}</option>)}
                          </select>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                      </div>

                      <button 
                        type={paymentMethod === 'card' ? 'button' : 'submit'} 
                        onClick={() => { if (paymentMethod === 'card' && firstName && lastName && country) setShowPayPalModal(true); }} 
                        disabled={loading || !country || !firstName || !lastName || !user} 
                        className="mt-auto w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 rounded-xl text-[11px] tracking-widest uppercase transition-all shadow-lg hover:shadow-[0_10px_30px_rgba(37,99,235,0.3)] active:scale-95"
                      >
                        {loading ? 'Processing...' : paymentMethod === 'card' ? 'PROCEED TO SECURE PAYMENT' : 'REQUEST B2B INVOICE'}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* KOLONA 3: DESNA STRANA (Tvoja slika + Oštar kontrast) */}
              <div className="relative hidden md:block md:w-1/3 bg-slate-900 overflow-hidden">
                
                {/* Zatvaranje na slici */}
                <button onClick={onClose} className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md cursor-pointer">
                  <X className="w-5 h-5" />
                </button>

                <div className="absolute inset-0 z-0">
                  <img src={projectImage} alt="Order Preview" className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                  {/* Suptilna senka da se stopi sa belim delom modala */}
                  <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
                </div>

                <div className="absolute bottom-10 right-10 z-10 text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-400/30 backdrop-blur-md mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-300" /> 
                    <span className="text-[9px] font-black tracking-widest text-blue-100 uppercase">256-bit Encrypted</span>
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

      {/* 🔥 PAYPAL MODAL (Sada prebačen u Light/Stripe B2B temu) 🔥 */}
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
                  <p className="text-slate-500 text-sm font-bold tracking-widest">${activePrice}{activeIsMonthly ? '/mo' : ''}</p>
                </div>

                <div className="relative z-10 w-full">
                  {activeIsMonthly ? (
                    <PayPalButtons style={{ layout: "vertical", color: "blue", shape: "rect", label: "subscribe" }} createSubscription={(data, actions) => { return actions.subscription.create({ plan_id: activePlanId }); }} onApprove={async (data, actions) => { try { await setDoc(doc(db, "v8_paypal_subscriptions", data.subscriptionID), { clientEmail: email, firstName, lastName, country, productName: activeName, subscriptionId: data.subscriptionID, status: "ACTIVE", createdAt: serverTimestamp() }); setShowPayPalModal(false); setSuccess(true); setDownloadUrl(zipLink || "https://link-do-arhiva.zip"); triggerGoogleAnalyticsPurchase(data.subscriptionID, activePrice); setTimeout(() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 5000); } catch (error) { console.error("Greška:", error); alert("Subscription successful, but verification delayed."); } }} />
                  ) : (
                    <PayPalButtons style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }} createOrder={(data, actions) => { return actions.order.create({ purchase_units: [{ description: activeName, amount: { value: activePrice.toString() } }] }); }} onApprove={async (data, actions) => { try { const details = await actions.order.capture(); const backendUrl = getBackendUrl(); const response = await fetch(`${backendUrl}/api/paypal-verify`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: details.id, clientEmail: email, firstName, lastName, country, productName: activeName, price: activePrice, zipLink }) }); const resData = await response.json(); if(resData.success) { setShowPayPalModal(false); setSuccess(true); setDownloadUrl(resData.downloadUrl || zipLink); triggerGoogleAnalyticsPurchase(details.id, activePrice); setTimeout(() => { onClose(); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 5000); } else { alert("Payment verification failed. Contact support."); } } catch (error) { console.error("Greška:", error); alert("Payment received, but verification delayed."); } }} />
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
// KRAJ FAJLA: V8SecureCheckout.jsx