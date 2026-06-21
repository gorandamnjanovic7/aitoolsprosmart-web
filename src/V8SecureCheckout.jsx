// POČETAK FAJLA: V8SecureCheckout.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // 🔥 DODAT PORTAL
import { db, auth } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth'; 
import { motion } from 'framer-motion'; 
import { ShieldCheck, Mail, BellRing, Key, X, Lock, Earth, CheckCircle, Bitcoin, Wallet, Zap, CreditCard } from 'lucide-react';

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const V8SecureCheckout = ({ isOpen, onClose, productName, price }) => {
  const [user, setUser] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('payoneer'); 
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';

    return () => {
      document.body.style.overflow = '';
    };
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
    }
  }, [isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[DEBUG] handleSubmit pokrenut"); // DODAJ OVO
    console.log("[DEBUG] Podaci:", { user, firstName, lastName, country, email }); // DODAJ OVO

    if (!user || !firstName || !lastName || !country || !email) {
      console.log("[DEBUG] Validacija nije prošla!"); // DODAJ OVO
      alert("Please link your Google Account and fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'payoneer') {
        await addDoc(collection(db, "v8_payoneer_requests"), {
          clientEmail: email,
          firstName,
          lastName,
          country,
          productName,
          price,
          method: "payoneer",
          handledBy: "info@aitoolsprosmart.com",
          status: "pending",
          requestDate: serverTimestamp()
        });

        setSuccess(true);
        setLoading(false);
      } else {
        const docRef = await addDoc(collection(db, "v8_crypto_requests"), {
          clientEmail: email,
          firstName,
          lastName,
          country,
          productName,
          price,
          method: "crypto",
          status: "initiating_gateway",
          requestDate: serverTimestamp()
        });
        
        const isLocal =
          import.meta.env.DEV ||
          window.location.hostname === 'localhost' ||
          window.location.hostname === '127.0.0.1';

        const backendUrl = isLocal 
          ? "http://localhost:8000" 
          : "https://aitoolsprosmart-becend-production.up.railway.app";

        const response = await fetch(`${backendUrl}/api/crypto-checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: docRef.id,
            clientEmail: email,
            productName,
            price
          })
        });

        const data = await response.json();

        if (response.ok && data.paymentUrl) {
          window.location.href = data.paymentUrl;
        } else {
          console.error("Backend Error:", data.error || data);
          alert("Gateway connection failed. Please try again later or use B2B Link.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error creating request:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // 🔥 VRAĆAMO PORTAL KAKO BI MODAL BIO APSOLUTNO IZNAD SVEGA (UKLJUČUJUĆI FOOTER) 🔥
  return createPortal(
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 sm:p-6 bg-[#02040a]/90 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative flex flex-col md:flex-row w-full max-w-6xl bg-[#080d1a] border border-blue-900/50 rounded-2xl shadow-[0_0_80px_rgba(29,78,216,0.15)] overflow-hidden"
      >
        <div 
          className="hidden md:flex w-1/3 relative bg-cover bg-center border-r border-blue-900/30 overflow-hidden flex-col justify-end p-8"
          style={{ backgroundImage: "url('/v8-secure-blue.webp')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#040812]/40 via-[#040812]/20 to-[#040812]"></div>

          <div className="relative z-10 pl-4 border-l-2 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-white" />
              <h3 className="text-white font-bold tracking-wider text-base uppercase">
                Secure Checkout
              </h3>
            </div>
            <p className="text-blue-300 text-xs tracking-wide">
              256-bit Encrypted
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/3 p-6 sm:p-8 flex flex-col border-r border-blue-900/30 bg-[#0a1122]">
          <div className="flex justify-between items-center border-b border-blue-900/50 pb-3 mb-6">
            <span className="text-[10px] text-blue-500 uppercase tracking-widest font-black flex items-center gap-2 relative">
              <span className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,1)] animate-pulse"></span>
              SECURITY CHECKOUT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              type="button"
              onClick={() => setPaymentMethod('payoneer')}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-300 ${
                paymentMethod === 'payoneer' 
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-[1.02]' 
                  : 'bg-[#050914] border-zinc-800 text-zinc-500 hover:border-zinc-600 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-full ${paymentMethod === 'payoneer' ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                <CreditCard size={18} />
              </div>

              <span className={`text-[11px] font-black uppercase tracking-tighter ${paymentMethod === 'payoneer' ? 'text-white' : 'text-zinc-500'}`}>
                B2B Link
              </span>
            </button>

            <button 
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all duration-300 ${
                paymentMethod === 'crypto' 
                  ? 'bg-orange-600/20 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.4)] scale-[1.02]' 
                  : 'bg-[#050914] border-zinc-800 text-zinc-500 hover:border-zinc-600 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-full ${paymentMethod === 'crypto' ? 'bg-orange-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
                <Bitcoin size={18} />
              </div>

              <span className={`text-[11px] font-black uppercase tracking-tighter ${paymentMethod === 'crypto' ? 'text-white' : 'text-zinc-500'}`}>
                Crypto
              </span>
            </button>
          </div>

          <div className="bg-[#050914] border border-blue-900/30 rounded-xl p-5 mb-6 shadow-inner">
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mb-1">
              Selected License
            </p>

            <h2 className="text-lg font-black text-white uppercase tracking-widest leading-tight">
              {productName || "V8 MASTER LICENSE"}
            </h2>

            <div className="text-2xl font-black text-blue-400 mt-2">
              ${price || "0.00"}
            </div>
          </div>

          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-10 relative z-10 my-auto">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>

              <h2 className="text-xl font-black text-white uppercase tracking-widest mb-3">
                Request Secured
              </h2>

              <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-5 shadow-inner">
                <p className="text-emerald-100 text-[13px] leading-relaxed mb-3">
                  Thank you, <strong className="text-white">{firstName}</strong>. Your request for <strong className="text-white">{productName}</strong> is transmitted.
                </p>

                <p className="text-emerald-400 font-bold text-[11px] leading-relaxed">
                  Invoices are generated manually. Please allow <span className="text-white">2 to 12 hours</span> to receive your link.
                </p>
              </div>

              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-transparent border border-zinc-700 text-zinc-400 hover:border-white hover:text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all duration-300"
              >
                Close Window
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full">
              {!user ? (
                <div className="flex flex-col items-center justify-center flex-grow space-y-6 bg-[#050914] p-8 rounded-2xl border border-blue-900/50">
                  <Lock className="w-8 h-8 text-blue-500" strokeWidth={1.5} />

                  <h3 className="text-white font-black text-xl uppercase tracking-wider">
                    Auth Required
                  </h3>

                  <button 
                    type="button"
                    onClick={handleGoogleLogin} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl text-sm tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  >
                    Verify Google Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-1/2">
                        <label className="block text-[9px] font-bold text-zinc-500 mb-1 tracking-wide uppercase">
                          First Name
                        </label>

                        <input
                          type="text"
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-lg px-4 py-3 text-white text-xs outline-none transition-all"
                          placeholder="e.g. John"
                        />
                      </div>

                      <div className="w-1/2">
                        <label className="block text-[9px] font-bold text-zinc-500 mb-1 tracking-wide uppercase">
                          Last Name
                        </label>

                        <input
                          type="text"
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-lg px-4 py-3 text-white text-xs outline-none transition-all"
                          placeholder="e.g. Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-500 mb-1 tracking-wide uppercase">
                        Verified Email
                      </label>

                      <input
                        type="email"
                        required
                        value={email}
                        readOnly
                        className="w-full bg-[#050914] border border-blue-900/30 rounded-lg px-4 py-3 text-zinc-500 text-xs outline-none cursor-not-allowed opacity-70"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-zinc-500 mb-1 tracking-wide uppercase flex items-center gap-1.5">
                        <Earth size={10} /> Country
                      </label>

                      <select
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#050914] border border-blue-900/30 focus:border-blue-500 rounded-lg px-4 py-3 text-white text-xs outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-zinc-700">
                          Select your country
                        </option>

                        {countryList.map((c, index) => (
                          <option key={index} value={c} className="bg-[#0B1120] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 shrink-0 relative z-50">
                    <button 
                      type="submit" 
                      disabled={loading || !country || !user} 
                      className={`w-full text-white font-black py-4 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)] ${
                        paymentMethod === 'crypto'
                          ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)]'
                          : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400'
                      }`}
                    >
                      {loading
                        ? 'Processing...'
                        : paymentMethod === 'crypto'
                          ? 'PROCEED TO CRYPTO CHECKOUT'
                          : 'REQUEST SECURE LINK'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="w-full md:w-1/3 p-6 sm:p-8 bg-[#070b16] relative flex flex-col">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 text-zinc-700 hover:text-white transition-colors"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          <div className="flex justify-between items-center border-b border-blue-900/50 pb-3 mb-6">
            <span className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-2 ${paymentMethod === 'crypto' ? 'text-orange-500' : 'text-blue-500'}`}>
              TRANSACTION PROTOCOL
            </span>
          </div>

          <p className="text-zinc-400 text-[13px] leading-relaxed mb-8">
            {paymentMethod === 'crypto' 
              ? "We accept seamless cryptocurrency transactions via official licensed gateways. Here is how your V8 License is activated:"
              : "To guarantee absolute security, we utilize a verified B2B payment flow. Here is how your V8 License is activated permanently:"}
          </p>

          <div className="flex flex-col gap-6 relative flex-grow">
            <div className="absolute left-[19px] top-[10px] bottom-[10px] w-[2px] bg-blue-900/30"></div>

            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 shadow-lg ${paymentMethod === 'crypto' ? 'bg-orange-950 border-orange-800' : 'bg-blue-950 border-blue-800'}`}>
                {paymentMethod === 'crypto' ? <Wallet className="w-4 h-4 text-orange-400" /> : <Mail className="w-4 h-4 text-blue-400" />}
              </div>

              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">
                  {paymentMethod === 'crypto' ? '1. Secure Gateway' : '1. Secure Link Emailed'}
                </h4>

                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  {paymentMethod === 'crypto'
                    ? "You will be redirected to our Global Web3 Secure Gateway to safely select your preferred coin (USDT, BTC)."
                    : "A unique, bank-grade B2B payment link will be sent to your verified Google Master Email address."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 shadow-lg ${paymentMethod === 'crypto' ? 'bg-orange-950 border-orange-800' : 'bg-blue-950 border-blue-800'}`}>
                {paymentMethod === 'crypto' ? <Bitcoin className="w-4 h-4 text-orange-400" /> : <BellRing className="w-4 h-4 text-blue-400" />}
              </div>

              <div>
                <h4 className="text-white text-xs font-black uppercase tracking-widest mb-1">
                  {paymentMethod === 'crypto' ? '2. Blockchain Confirmation' : '2. Admin Notification'}
                </h4>

                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  {paymentMethod === 'crypto'
                    ? "Complete the transaction from your wallet. The blockchain typically confirms payment within minutes."
                    : "Once your B2B transaction is completed, our system instantly alerts the AI Tools Pro Smart Administration."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center flex-shrink-0 shadow-lg">
                {paymentMethod === 'crypto' ? <Zap className="w-4 h-4 text-emerald-400" /> : <Key className="w-4 h-4 text-emerald-400" />}
              </div>

              <div>
                <h4 className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">
                  3. License Unlocked
                </h4>

                <p className="text-zinc-500 text-[11px] leading-relaxed">
                  The system verifies the transaction and permanently unlocks the selected V8 License on your linked account.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <div className={`p-4 border-l-2 rounded-r-lg shadow-inner ${paymentMethod === 'crypto' ? 'bg-orange-950/20 border-orange-500' : 'bg-blue-950/20 border-blue-500'}`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${paymentMethod === 'crypto' ? 'text-orange-400' : 'text-blue-400'}`}>
                Notice:
              </p>

              <p className="text-zinc-500 text-[11px] leading-relaxed">
                {paymentMethod === 'crypto'
                  ? "Ensure you are using the correct network (e.g. USDT TRC20) to avoid loss of funds."
                  : "Allow 2 to 12 hours. Check your SPAM, TRASH, and JUNK folders for the payment link."}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};

export default V8SecureCheckout;
// KRAJ FAJLA: V8SecureCheckout.jsx