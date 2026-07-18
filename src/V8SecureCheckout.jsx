// POČETAK FAJLA: V8SecureCheckout.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { db, auth } from './firebase'; 
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'; 
import { motion } from 'framer-motion'; 
import { ShieldCheck, Mail, BellRing, Key, X, Lock, Earth, CheckCircle, Bitcoin, Wallet, Zap, CreditCard, Link, Download, Radar, Loader2 } from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; 

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

// Početak funkcije: getBackendUrl
const getBackendUrl = () => {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  // 🔥 UPISAN PRAVI RAILWAY LINK 🔥
  return isLocal ? "http://localhost:8080" : "https://aitoolsprosmart-becend-production.up.railway.app";
};
// Kraj funkcije: getBackendUrl

// Početak funkcije: V8SecureCheckout
const V8SecureCheckout = ({ isOpen, onClose, productName, price, zipLink }) => {
  const [user, setUser] = useState(null);
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

  const initialOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture",
  };

  // Početak funkcije: triggerGoogleAnalyticsPurchase
  const triggerGoogleAnalyticsPurchase = (transactionId, finalPrice) => {
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "purchase", {
            transaction_id: transactionId,
            value: Number(finalPrice),
            currency: "USD",
            items: [
                {
                    item_id: productName ? productName.replace(/\s+/g, '_').toUpperCase() : "V8_MASTER_LICENSE",
                    item_name: productName || "V8 MASTER LICENSE",
                    price: Number(finalPrice),
                    quantity: 1
                }
            ]
        });
        console.log("GA4 Purchase Event poslat! Kampanja se otključava.");
    }
  };
  // Kraj funkcije: triggerGoogleAnalyticsPurchase

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
      setDownloadUrl(null);
      setCryptoOrderId(null);
    }
  }, [isOpen]);

  // Početak funkcije: cryptoRadarEffect
  useEffect(() => {
    if (cryptoOrderId && paymentMethod === 'crypto') {
      const unsub = onSnapshot(doc(db, "v8_crypto_requests", cryptoOrderId), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status === 'PLAĆENO') {
            setDownloadUrl(data.zipLink);
            // 🔥 OKIDANJE GA4 KONVERZIJE ZA KRIPTO UPLATE 🔥
            triggerGoogleAnalyticsPurchase(cryptoOrderId, price);
          }
        }
      });
      return () => unsub();
    }
  }, [cryptoOrderId, paymentMethod]);
  // Kraj funkcije: cryptoRadarEffect

  // Početak funkcije: handleGoogleLogin
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setEmail(result.user?.email || '');
    } catch (error) {
      console.error("Login prekinut:", error);
      alert("Google login failed or was cancelled. Please try again.");
    }
  };
  // Kraj funkcije: handleGoogleLogin

  // Početak funkcije: handleSubmit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!user || !firstName || !lastName || !country || !email) {
      alert("Please link your Google Account and fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'payoneer') {
        await addDoc(collection(db, "v8_payoneer_requests"), {
          clientEmail: email, firstName, lastName, country, productName, price, zipLink: zipLink || "",
          method: "payoneer", handledBy: "info@aitoolsprosmart.com", status: "pending", requestDate: serverTimestamp()
        });
        setSuccess(true);
        setLoading(false);
      } else if (paymentMethod === 'crypto') {
        const docRef = await addDoc(collection(db, "v8_crypto_requests"), {
          clientEmail: email, firstName, lastName, country, productName, price, zipLink: zipLink || "",
          method: "crypto", status: "initiating_gateway", requestDate: serverTimestamp()
        });
        
        const backendUrl = getBackendUrl(); 

        const response = await fetch(`${backendUrl}/api/crypto-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: docRef.id, clientEmail: email, productName, price, zipLink })
        });

        const data = await response.json();
        if (response.ok && data.paymentUrl) {
          window.open(data.paymentUrl, '_blank');
          setCryptoOrderId(docRef.id);
          setSuccess(true);
          setLoading(false);
        } else {
          alert("Gateway connection failed. Please try again later or use Card / B2B Link.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };
  // Kraj funkcije: handleSubmit

  if (!isOpen) return null;

  // Početak funkcije: render
  return createPortal(
    <PayPalScriptProvider options={initialOptions}>
      <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#02040a]/90 backdrop-blur-md">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative flex flex-col md:flex-row w-full max-w-6xl max-h-[95vh] overflow-y-auto custom-scrollbar bg-[#080d1a] border border-blue-900/50 rounded-2xl md:rounded-3xl shadow-[0_0_80px_rgba(29,78,216,0.15)]"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 z-[100] bg-black/50 backdrop-blur-md p-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all shadow-xl"
          >
            <X size={20} strokeWidth={2.5} />
          </button>

          {/* 1. KOLONA: SLIKA */}
          <div className="hidden lg:flex lg:w-[30%] relative bg-cover bg-center border-r border-blue-900/30 overflow-hidden flex-col justify-end p-8 shrink-0" style={{ backgroundImage: "url('/v8-secure-blue.webp')" }}>
            <div className="absolute inset-0 bg-gradient-to-r from-[#040812]/40 via-[#040812]/20 to-[#040812]"></div>
            <div className="relative z-10 pl-4 border-l-2 border-blue-500">
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-white" />
                <h3 className="text-white font-bold tracking-wider text-base uppercase">Secure Checkout</h3>
              </div>
              <p className="text-blue-300 text-xs tracking-wide">256-bit Encrypted Protocol</p>
            </div>
          </div>

          {/* 2. KOLONA: FORMA */}
          <div className="w-full md:w-1/2 lg:w-[40%] p-5 sm:p-8 flex flex-col border-b md:border-b-0 md:border-r border-blue-900/30 bg-[#0a1122]">
            <div className="flex justify-between items-center border-b border-blue-900/50 pb-3 mb-6 mt-6 md:mt-0">
              <span className="text-[10px] md:text-[11px] text-blue-500 uppercase tracking-widest font-black flex items-center gap-2 relative">
                <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,1)] animate-pulse"></span>
                SECURITY CHECKOUT
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8">
              <button 
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 outline-none ${paymentMethod === 'card' ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] scale-105 z-10' : 'bg-[#050914] border-zinc-800 text-zinc-500 hover:border-zinc-700 opacity-70 hover:opacity-100'}`}
              >
                <div className={`p-1.5 rounded-full ${paymentMethod === 'card' ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.8)]' : 'bg-zinc-800 text-zinc-500'}`}><CreditCard size={16} /></div>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${paymentMethod === 'card' ? 'text-white' : 'text-zinc-500'}`}>Card</span>
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('payoneer')}
                className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 outline-none ${paymentMethod === 'payoneer' ? 'bg-emerald-600/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105 z-10' : 'bg-[#050914] border-zinc-800 text-zinc-500 hover:border-zinc-700 opacity-70 hover:opacity-100'}`}
              >
                <div className={`p-1.5 rounded-full ${paymentMethod === 'payoneer' ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-zinc-800 text-zinc-500'}`}><Link size={16} /></div>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${paymentMethod === 'payoneer' ? 'text-white' : 'text-zinc-500'}`}>B2B Link</span>
              </button>

              <button 
                type="button"
                onClick={() => setPaymentMethod('crypto')}
                className={`flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 outline-none ${paymentMethod === 'crypto' ? 'bg-orange-600/20 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105 z-10' : 'bg-[#050914] border-zinc-800 text-zinc-500 hover:border-zinc-700 opacity-70 hover:opacity-100'}`}
              >
                <div className={`p-1.5 rounded-full ${paymentMethod === 'crypto' ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(249,115,22,0.8)]' : 'bg-zinc-800 text-zinc-500'}`}><Bitcoin size={16} /></div>
                <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-tighter ${paymentMethod === 'crypto' ? 'text-white' : 'text-zinc-500'}`}>Crypto</span>
              </button>
            </div>

            <div className="bg-[#050914] border border-blue-900/30 rounded-xl p-5 mb-6 shadow-inner">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">Selected License</p>
              <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-widest leading-tight">{productName || "V8 MASTER LICENSE"}</h2>
              <div className="text-xl sm:text-2xl font-black text-blue-400 mt-2">${price || "0.00"}</div>
            </div>

            {success ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6 relative z-10 my-auto">
                
                {downloadUrl ? (
                  // 🔥 SLUČAJ 1: PARE SU LEGLE, PRIKAZUJ DUGME 🔥
                  <motion.div initial={{scale:0.8, opacity:0}} animate={{scale:1, opacity:1}} className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500 mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)]">
                      <Download className="w-10 h-10 text-emerald-400 animate-bounce" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest mb-2">ACCESS GRANTED</h2>
                    <p className="text-emerald-400 text-sm font-bold mb-8">V8 Master Engine is permanently unlocked.</p>
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-500 hover:from-green-500 hover:to-emerald-400 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all transform hover:scale-105 outline-none flex items-center gap-3">
                      <Download size={20} /> PREUZMI V8 PAKET
                    </a>
                  </motion.div>
                ) : paymentMethod === 'crypto' ? (
                  // 🔥 SLUČAJ 2: RADAR OSLUŠKUJE BLOCKCHAIN 🔥
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-ping"></div>
                      <div className="absolute inset-2 rounded-full border border-orange-500/50 animate-spin"></div>
                      <Radar className="w-10 h-10 text-orange-400 animate-pulse" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest mb-3 text-orange-400">BLOCKCHAIN RADAR ACTIVE</h2>
                    <div className="bg-orange-950/20 border border-orange-900/50 rounded-xl p-5 shadow-inner max-w-md">
                      <p className="text-orange-100 text-xs sm:text-[13px] leading-relaxed mb-2">
                        Otvorili smo Vam NOWPayments u novom tabu. Završite transakciju tamo.
                      </p>
                      <p className="text-orange-300/80 text-[11px] font-mono flex items-center justify-center gap-2 mt-4">
                        <Loader2 size={12} className="animate-spin" /> Čekamo potvrdu mreže... Dugme se stvara ovde.
                      </p>
                    </div>
                  </div>
                ) : (
                  // 🔥 SLUČAJ 3: PAYONEER STANDARDNA PORUKA 🔥
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/30 mb-4 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
                      <CheckCircle className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-widest mb-3">Request Secured</h2>
                    <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-5 shadow-inner max-w-md">
                      <p className="text-blue-100 text-xs sm:text-[13px] leading-relaxed">
                        Thank you, <strong className="text-white">{firstName}</strong>. Vaš zahtev za <strong className="text-white">{productName}</strong> je primljen. B2B link će biti poslat na Vaš email.
                      </p>
                    </div>
                  </div>
                )}
                
                <button onClick={onClose} className="mt-8 px-8 py-3.5 bg-transparent border border-zinc-700 text-zinc-400 hover:border-white hover:text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300">
                  Close Window
                </button>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col flex-grow">
                {!user ? (
                  <div className="flex flex-col items-center justify-center flex-grow space-y-6 bg-[#050914] p-6 sm:p-8 rounded-2xl border border-blue-900/50">
                    <Lock className="w-8 h-8 text-blue-500" strokeWidth={1.5} />
                    <h3 className="text-white font-black text-lg sm:text-xl uppercase tracking-wider text-center">Auth Required</h3>
                    <button type="button" onClick={handleGoogleLogin} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-[11px] sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                      Verify Google Account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); if(paymentMethod !== 'card') handleSubmit(); }} className="space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-4 sm:space-y-5">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-1/2">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 tracking-wide uppercase">First Name</label>
                          <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-xl px-4 py-3.5 text-white text-xs sm:text-[13px] outline-none transition-all" placeholder="e.g. John" />
                        </div>
                        <div className="w-full sm:w-1/2">
                          <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 tracking-wide uppercase">Last Name</label>
                          <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-xl px-4 py-3.5 text-white text-xs sm:text-[13px] outline-none transition-all" placeholder="e.g. Doe" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 tracking-wide uppercase">Verified Email</label>
                        <input type="email" required value={email} readOnly className="w-full bg-[#050914] border border-blue-900/30 rounded-xl px-4 py-3.5 text-zinc-500 text-xs sm:text-[13px] outline-none cursor-not-allowed opacity-70 truncate" />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 mb-1.5 tracking-wide uppercase flex items-center gap-1.5"><Earth size={12} /> Country</label>
                        <select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-xl px-4 py-3.5 text-white text-xs sm:text-[13px] outline-none transition-all appearance-none cursor-pointer">
                          <option value="" disabled className="text-zinc-700">Select your country</option>
                          {countryList.map((c, index) => (<option key={index} value={c} className="bg-[#0B1120] text-white">{c}</option>))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-6 shrink-0 relative z-50">
                      <button 
                        type={paymentMethod === 'card' ? 'button' : 'submit'} 
                        onClick={() => {
                            if (paymentMethod === 'card' && firstName && lastName && country) {
                                setShowPayPalModal(true);
                            }
                        }}
                        disabled={loading || !country || !user || (paymentMethod === 'card' && (!firstName || !lastName))} 
                        className={`w-full text-white font-black py-4 sm:py-4.5 rounded-xl text-[11px] sm:text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(0,0,0,0.3)] outline-none ${
                          paymentMethod === 'crypto' ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)]'
                          : paymentMethod === 'payoneer' ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)]'
                          : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 shadow-[0_0_30px_rgba(37,99,235,0.5)]'
                        }`}
                      >
                        {loading ? 'Processing...' : paymentMethod === 'card' ? 'PROCEED TO SECURE PAYMENT' : paymentMethod === 'crypto' ? 'PROCEED TO CRYPTO' : 'REQUEST SECURE LINK'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* 3. KOLONA: INFORMACIJE */}
          <div className="w-full md:w-1/2 lg:w-[30%] p-5 sm:p-8 bg-[#070b16] relative flex flex-col">
            <div className="flex justify-between items-center border-b border-blue-900/50 pb-3 mb-6 mt-2 md:mt-0">
              <span className={`text-[10px] md:text-[11px] uppercase tracking-widest font-black flex items-center gap-2 ${paymentMethod === 'crypto' ? 'text-orange-500' : paymentMethod === 'payoneer' ? 'text-emerald-500' : 'text-blue-500'}`}>
                TRANSACTION PROTOCOL
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed mb-8">
              {paymentMethod === 'card' ? "We accept all major credit and debit cards securely processed via PayPal's global infrastructure. Here is how your V8 License is activated:"
                : paymentMethod === 'crypto' ? "We accept seamless cryptocurrency transactions via official licensed gateways. Here is how your V8 License is activated:"
                : "To guarantee absolute security, we utilize a verified B2B payment flow. Here is how your V8 License is activated permanently:"}
            </p>

            <div className="flex flex-col gap-6 relative flex-grow">
              <div className="absolute left-[19px] top-[10px] bottom-[10px] w-[2px] bg-blue-900/30 hidden sm:block"></div>

              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 shadow-lg ${paymentMethod === 'crypto' ? 'bg-orange-950 border-orange-800' : paymentMethod === 'payoneer' ? 'bg-emerald-950 border-emerald-800' : 'bg-blue-950 border-blue-800'}`}>
                  {paymentMethod === 'card' ? <ShieldCheck className="w-4 h-4 text-blue-400" /> : paymentMethod === 'crypto' ? <Wallet className="w-4 h-4 text-orange-400" /> : <Mail className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <h4 className="text-white text-[11px] sm:text-xs font-black uppercase tracking-widest mb-1">
                    {paymentMethod === 'card' ? '1. Secure PayPal Gateway' : paymentMethod === 'crypto' ? '1. Secure Gateway' : '1. Secure Link'}
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-[11px] leading-relaxed">
                    {paymentMethod === 'card' ? "You will be safely routed to the encrypted PayPal checkout system to enter your card details."
                      : paymentMethod === 'crypto' ? "You will be redirected to our Global Web3 Secure Gateway to safely select your preferred coin."
                      : "A unique, bank-grade B2B payment link will be sent to your verified Google Master Email address."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 shadow-lg ${paymentMethod === 'crypto' ? 'bg-orange-950 border-orange-800' : paymentMethod === 'payoneer' ? 'bg-emerald-950 border-emerald-800' : 'bg-blue-950 border-blue-800'}`}>
                  {paymentMethod === 'card' ? <Lock className="w-4 h-4 text-blue-400" /> : paymentMethod === 'crypto' ? <Bitcoin className="w-4 h-4 text-orange-400" /> : <BellRing className="w-4 h-4 text-emerald-400" />}
                </div>
                <div>
                  <h4 className="text-white text-[11px] sm:text-xs font-black uppercase tracking-widest mb-1">
                    {paymentMethod === 'card' ? '2. Instant Verification' : paymentMethod === 'crypto' ? '2. Confirmation' : '2. Notification'}
                  </h4>
                  <p className="text-zinc-500 text-[10px] sm:text-[11px] leading-relaxed">
                    {paymentMethod === 'card' ? "PayPal processes your card instantly without sharing your sensitive financial data with us."
                      : paymentMethod === 'crypto' ? "Complete the transaction from your wallet. The blockchain typically confirms payment within minutes."
                      : "Once your B2B transaction is completed, our system instantly alerts the AI Tools Pro Smart Administration."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative z-10">
                <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-emerald-400 text-[11px] sm:text-xs font-black uppercase tracking-widest mb-1">3. License Unlocked</h4>
                  <p className="text-zinc-500 text-[10px] sm:text-[11px] leading-relaxed">The system verifies the transaction and permanently unlocks the selected V8 License on your linked account.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <div className={`p-4 border-l-2 rounded-r-xl shadow-inner ${paymentMethod === 'crypto' ? 'bg-orange-950/20 border-orange-500' : paymentMethod === 'payoneer' ? 'bg-emerald-950/20 border-emerald-500' : 'bg-blue-950/20 border-blue-500'}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${paymentMethod === 'crypto' ? 'text-orange-400' : paymentMethod === 'payoneer' ? 'text-emerald-400' : 'text-blue-400'}`}>Notice:</p>
                <p className="text-zinc-500 text-[10px] sm:text-[11px] leading-relaxed">
                  {paymentMethod === 'card' ? "No PayPal account is required. You can choose to pay as a guest using your standard Credit or Debit card."
                    : paymentMethod === 'crypto' ? "Ensure you are using the correct network (e.g. USDT TRC20) to avoid loss of funds."
                    : "Allow 2 to 12 hours. Check your SPAM, TRASH, and JUNK folders for the payment link."}
                </p>
              </div>
            </div>
          </div>

        </motion.div>

        {/* 🔥 PAYPAL FORMA 🔥 */}
        {showPayPalModal && (
          <div className="absolute inset-0 z-[10000000] flex items-center justify-center p-4 sm:p-6 bg-[#02040a]/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative flex flex-col md:flex-row w-full max-w-4xl bg-[#050914] border border-blue-600/50 rounded-2xl shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden max-h-[90vh]"
            >
              <button
                type="button"
                onClick={() => setShowPayPalModal(false)}
                className="absolute top-4 right-4 z-[100] p-2 bg-zinc-900/80 backdrop-blur-md rounded-full border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={18} />
              </button>

              <div 
                className="hidden md:flex md:w-1/2 relative bg-cover bg-center"
                style={{ backgroundImage: "url('/checkout-bg.webp')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050914]/50 to-[#050914]"></div>
                <div className="absolute bottom-10 left-8 z-10 pr-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-900/50 border border-blue-500/50 backdrop-blur-sm mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold tracking-widest text-blue-100 uppercase">256-Bit Encrypted</span>
                  </div>
                  <h2 className="text-white font-black text-2xl uppercase tracking-wider mb-2 leading-tight">
                    Finalize<br />Your Request
                  </h2>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    You are moments away from unlocking the V8 Master Engine. Your transaction is guarded by global security protocols.
                  </p>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-6 sm:p-10 pt-16 flex flex-col relative bg-[#050914] overflow-y-auto custom-scrollbar">
                <div className="mb-8">
                  <h3 className="text-white font-black text-lg sm:text-xl uppercase tracking-widest mb-1">
                    Complete Payment
                  </h3>
                  <p className="text-blue-400 text-sm tracking-wide font-bold">
                    {productName} &bull; ${price}
                  </p>
                </div>

                <div className="relative z-10 w-full min-h-[300px]">
                  {/* Početak funkcije: PayPalButtons */}
                  <PayPalButtons 
                      style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                      createOrder={(data, actions) => {
                          return actions.order.create({
                              purchase_units: [{
                                  description: productName,
                                  amount: { value: price.toString() }
                              }]
                          });
                      }}
                      onApprove={async (data, actions) => {
                          try {
                              const details = await actions.order.capture();
                              
                              const backendUrl = getBackendUrl(); // 🔥 Povlači Railway link
                              
                              const response = await fetch(`${backendUrl}/api/paypal-verify`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ 
                                      orderId: details.id, 
                                      clientEmail: email, 
                                      firstName, 
                                      lastName, 
                                      country, 
                                      productName, 
                                      price,
                                      zipLink 
                                  })
                              });
                              
                              const resData = await response.json();
                              
                              if(resData.success) {
                                  setShowPayPalModal(false); 
                                  // 🔥 IZMENJENA LINIJA: OSIGURAČ ZA DUGME 🔥
                                  setDownloadUrl(resData.downloadUrl || zipLink);
                                  setSuccess(true);
                                  // 🔥 OKIDANJE GA4 KONVERZIJE ZA PAYPAL I KARTICE 🔥
                                  triggerGoogleAnalyticsPurchase(details.id, price);
                              } else {
                                  alert("Payment verification failed on the server. Please contact support.");
                              }
                          } catch (error) {
                              console.error("Greška pri verifikaciji:", error);
                              alert("Payment received, but verification delayed. Contact support.");
                          }
                      }}
                      onError={(err) => {
                          console.error("PayPal Error:", err);
                          alert("There was an issue processing your payment. Please try again.");
                      }}
                  />
                  {/* Kraj funkcije: PayPalButtons */}
                </div>
                
                <div className="mt-6 flex items-center justify-center gap-2 opacity-50 pb-4">
                  <Lock size={12} className="text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Secured by PayPal
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </PayPalScriptProvider>,
    document.body
  );
  // Kraj funkcije: render
};
// Kraj funkcije: V8SecureCheckout

export default V8SecureCheckout;
// KRAJ FAJLA: V8SecureCheckout.jsx