// POČETAK FAJLA: V8SecureCheckout.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'; 
// --- ISPRAVLJENI IMPORTI ---
import { Upload, Zap, Download, ShieldCheck, RefreshCcw, Diamond, AlertTriangle, Clock, FileImage, X, DownloadCloud, Lock, CheckCircle, Info, Maximize, Archive, Layers, Code, Crown, ArrowUpCircle, Type, FolderArchive, FileText, MonitorPlay, Link as LinkIcon, Image as ImageIcon, Images, Globe } from 'lucide-react';

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const V8SecureCheckout = ({ isOpen, onClose, productName, price }) => {
  // PROVERA PRIKAZA: Ako modal nije otvoren, ne renderuj ništa
  if (!isOpen) return null;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [country, setCountry] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setEmail(auth.currentUser.email);
    }
  }, [isOpen]);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setEmail(result.user.email); 
    } catch (error) {
      console.error("Login prekinut:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, "v8_payoneer_requests"), {
        firstName: firstName,
        lastName: lastName,
        clientEmail: email,
        country: country, 
        handledBy: "info@aitoolsprosmart.com",
        productName: productName,
        price: price,
        status: "pending",
        timestamp: serverTimestamp()
      });
      setSuccess(true);
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020617]/95 backdrop-blur-xl py-4">
      {/* 🔥 Smanjena maksimalna visina (max-h-[85vh]), sužen modal na max-w-4xl 🔥 */}
      <div className="w-full max-w-4xl max-h-[85vh] bg-[#0B1120] rounded-2xl overflow-hidden flex flex-col md:flex-row border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.15)] relative">
        
        {/* LEVA STRANA - Slika */}
        <div 
          className="hidden md:block md:w-5/12 bg-cover bg-center relative border-r border-blue-500/20"
          style={{ backgroundImage: "url('/v8-secure-blue.webp')" }} 
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1120]/40 via-[#0B1120]/20 to-[#0B1120]"></div>
          <div className="absolute bottom-8 left-8 pl-4 border-l-2 border-blue-500">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-white font-bold tracking-wider text-base uppercase">Secure Checkout</h3>
            </div>
            <p className="text-blue-200/60 text-xs tracking-wide">256-bit Encrypted</p>
          </div>
        </div>

        {/* DESNA STRANA - Forma (smanjen padding na p-6 md:p-8) */}
        <div className="w-full md:w-7/12 p-6 md:p-8 bg-[#0B1120] relative font-sans flex flex-col h-full overflow-y-auto custom-scrollbar">

          {success ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 relative z-10 my-auto">
              <div className="w-16 h-16 border-2 border-blue-500 rounded-full flex items-center justify-center text-blue-500 text-3xl shadow-[0_0_30px_rgba(59,130,246,0.3)] mb-2">
                ✓
              </div>
              <h2 className="text-2xl font-black tracking-wide text-white uppercase">Request Secured</h2>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-5 mt-2">
                <p className="text-blue-100 text-sm leading-relaxed mb-2">
                  Thank you, <strong className="text-white">{firstName}</strong>. Your request for <strong className="text-white">{productName}</strong> is transmitted.
                </p>
                <p className="text-blue-400 font-bold text-xs leading-relaxed">
                  Invoices are generated manually. Please allow <span className="text-white">2 to 12 hours</span> to receive your link.
                </p>
                <p className="text-red-400 font-black text-[10px] leading-relaxed mt-3 uppercase">
                  * Check your Trash, Spam, and Junk folders for the email.
                </p>
              </div>
              <button onClick={onClose} className="mt-4 px-6 py-3 bg-transparent border border-blue-800 text-blue-300 hover:border-blue-500 hover:text-white rounded-xl font-bold uppercase text-sm tracking-wider transition-all duration-300 w-full">
                Close Window
              </button>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col h-full">
              {/* Sistemski status */}
              <div className="flex justify-between items-center mb-6 pb-3 border-b border-blue-900/50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                  <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase">Bank-Grade Encryption</span>
                </div>
                <button onClick={onClose} className="text-blue-500/50 hover:text-blue-400 text-xl transition-colors leading-none">✕</button>
              </div>

              {/* Paket */}
              <div className="mb-5 p-5 bg-[#0F172A] rounded-xl border border-blue-900/50 shrink-0 shadow-inner">
                <div className="text-[10px] text-blue-400/70 font-bold tracking-widest uppercase mb-1">Selected License</div>
                <div className="text-white font-black text-lg tracking-wide uppercase leading-tight">{productName}</div>
                <div className="text-blue-400 font-black text-2xl mt-1">${price}</div>
              </div>

              {/* AKO KORISNIK NEMA EMAIL */}
              {!email ? (
                <div className="flex flex-col items-center justify-center flex-grow space-y-5 bg-[#0F172A] p-6 rounded-xl border border-blue-900/50">
                  <Lock className="w-12 h-12 text-blue-500 mb-1 opacity-80" />
                  <h3 className="text-white font-black text-lg uppercase text-center tracking-wider">Auth Required</h3>
                  <p className="text-blue-200/60 text-center text-xs leading-relaxed">
                    To proceed with secure acquisition, link your Google Account.
                  </p>
                  <button 
                    onClick={handleGoogleLogin} 
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] mt-2"
                  >
                    Verify Account
                  </button>
                </div>
              ) : (
                /* FORMA */
                <form onSubmit={handleSubmit} className="space-y-3 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-1/2">
                        <label className="block text-[9px] font-bold text-blue-400/70 mb-1 tracking-wide uppercase">First Name</label>
                        <input 
                          type="text" 
                          required
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full bg-[#0F172A] border border-blue-900/50 focus:border-blue-500 rounded-lg px-3 py-2.5 text-white text-xs outline-none transition-all focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] placeholder-blue-200/30"
                          placeholder="e.g. John"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block text-[9px] font-bold text-blue-400/70 mb-1 tracking-wide uppercase">Last Name</label>
                        <input 
                          type="text" 
                          required
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full bg-[#0F172A] border border-blue-900/50 focus:border-blue-500 rounded-lg px-3 py-2.5 text-white text-xs outline-none transition-all focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] placeholder-blue-200/30"
                          placeholder="e.g. Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-blue-400/70 mb-1 tracking-wide uppercase">Verified Email (Master Key)</label>
                      <input 
                        type="email" 
                        required
                        value={email}
                        readOnly
                        className="w-full bg-[#0F172A] border border-blue-900/30 rounded-lg px-3 py-2.5 text-blue-300/50 text-xs outline-none cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-blue-400/70 mb-1 tracking-wide uppercase flex items-center gap-1.5">
                        <Globe className="w-2.5 h-2.5 text-blue-500" /> 
                        Country / Jurisdiction
                      </label>
                      <select 
                        required
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#0F172A] border border-blue-900/50 focus:border-blue-500 rounded-lg px-3 py-2.5 text-white text-xs outline-none transition-all focus:shadow-[0_0_15px_rgba(37,99,235,0.15)] appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="text-blue-200/50">Select your country</option>
                        {countryList.map((c, index) => (
                          <option key={index} value={c} className="bg-[#0B1120] text-white">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-2 p-3 bg-blue-900/20 border-l-2 border-blue-500 rounded-r-lg shadow-inner">
                    <p className="text-blue-100 text-[10px] leading-relaxed mb-1.5">
                      <span className="text-blue-400 font-bold">Notice:</span> Allow <strong className="text-white">2 to 12 hours</strong> for manual processing.
                    </p>
                    <p className="text-red-400/90 font-black text-[9px] uppercase tracking-wider">
                      * Check Trash, Spam, and Junk folders.
                    </p>
                  </div>

                  <div className="pt-1 shrink-0">
                    <button 
                      type="submit" 
                      disabled={loading || !country} 
                      className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 text-white font-black py-3.5 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                    >
                      {loading ? 'Encrypting...' : 'Request Secure Link'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default V8SecureCheckout;
// KRAJ FUNKCIJE: V8SecureCheckout