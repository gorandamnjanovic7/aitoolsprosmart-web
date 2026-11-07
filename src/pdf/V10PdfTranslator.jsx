import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, Globe, Loader2, Play, Layers, Cpu, Zap, LayoutTemplate, Image as ImageIcon, PenTool, CreditCard, RotateCcw } from 'lucide-react';
import LoginRequiredModal from './LoginRequiredModal'; 
import V8SecureCheckout from '../V8SecureCheckout'; 
import { auth } from '../firebase'; 

const SUPPORTED_LANGUAGES = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian (Shqip)' },
  { code: 'am', name: 'Amharic (አማርኛ)' },
  { code: 'ar', name: 'Arabic (Modern Standard)' },
  { code: 'ar-dz', name: 'Arabic (Algeria)' },
  { code: 'ar-eg', name: 'Arabic (Egypt)' },
  { code: 'ar-iq', name: 'Arabic (Iraq)' },
  { code: 'ar-sa', name: 'Arabic (Saudi Arabia)' },
  { code: 'ar-ae', name: 'Arabic (UAE)' },
  { code: 'hy', name: 'Armenian (Հայերեն)' },
  { code: 'az', name: 'Azerbaijani (Azərbaycan)' },
  { code: 'eu', name: 'Basque (Euskara)' },
  { code: 'be', name: 'Belarusian (Беларуская)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'bs', name: 'Bosnian (Bosanski)' },
  { code: 'bg', name: 'Bulgarian (Български)' },
  { code: 'my', name: 'Burmese (မြန်မာ)' },
  { code: 'ca', name: 'Catalan (Català)' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'zh-cn', name: 'Chinese (Simplified, PRC)' },
  { code: 'zh-tw', name: 'Chinese (Traditional, Taiwan)' },
  { code: 'zh-hk', name: 'Chinese (Cantonese, HK)' },
  { code: 'co', name: 'Corsican (Corsu)' },
  { code: 'hr', name: 'Croatian (Hrvatski)' },
  { code: 'cs', name: 'Czech (Čeština)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'nl-be', name: 'Dutch (Flemish, Belgium)' },
  { code: 'en-us', name: 'English (United States)' },
  { code: 'en-gb', name: 'English (United Kingdom)' },
  { code: 'en-au', name: 'English (Australia)' },
  { code: 'en-ca', name: 'English (Canada)' },
  { code: 'en-in', name: 'English (India)' },
  { code: 'en-nz', name: 'English (New Zealand)' },
  { code: 'en-za', name: 'English (South Africa)' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian (Eesti)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
  { code: 'fr-fr', name: 'French (France)' },
  { code: 'fr-ca', name: 'French (Canada)' },
  { code: 'fr-ch', name: 'French (Switzerland)' },
  { code: 'fr-be', name: 'French (Belgium)' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician (Galego)' },
  { code: 'ka', name: 'Georgian (ქართული)' },
  { code: 'de-de', name: 'German (Germany)' },
  { code: 'de-at', name: 'German (Austria)' },
  { code: 'de-ch', name: 'German (Switzerland)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'he', name: 'Hebrew (Israel / עברית)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian (Magyar)' },
  { code: 'is', name: 'Icelandic (Íslenska)' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ga', name: 'Irish (Gaeilge)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'jw', name: 'Javanese' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'kk', name: 'Kazakh (Қазақ)' },
  { code: 'km', name: 'Khmer (ខ្មែរ)' },
  { code: 'rw', name: 'Kinyarwanda' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ku', name: 'Kurdish (Kurmanji)' },
  { code: 'ky', name: 'Kyrgyz (Кыргызча)' },
  { code: 'lo', name: 'Lao (ລາວ)' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian (Latviešu)' },
  { code: 'lt', name: 'Lithuanian (Lietuvių)' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian (Македонски)' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'mt', name: 'Maltese (Malti)' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'mn', name: 'Mongolian (Монгол)' },
  { code: 'ne', name: 'Nepali (नेपाली)' },
  { code: 'no', name: 'Norwegian (Norsk)' },
  { code: 'or', name: 'Odia (Oriya)' },
  { code: 'ps', name: 'Pashto (پښتو)' },
  { code: 'fa', name: 'Persian / Farsi (فارسی)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'pt-pt', name: 'Portuguese (Portugal)' },
  { code: 'pt-br', name: 'Portuguese (Brazil)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr-cyrl', name: 'Serbian (Cyrillic / Српски)' },
  { code: 'sr-latn', name: 'Serbian (Latin / Srpski)' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala (සිංහල)' },
  { code: 'sk', name: 'Slovak (Slovenčina)' },
  { code: 'sl', name: 'Slovenian (Slovenščina)' },
  { code: 'so', name: 'Somali' },
  { code: 'es-es', name: 'Spanish (Spain)' },
  { code: 'es-mx', name: 'Spanish (Mexico)' },
  { code: 'es-ar', name: 'Spanish (Argentina)' },
  { code: 'es-co', name: 'Spanish (Colombia)' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'tg', name: 'Tajik (Тоҷикӣ)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'tt', name: 'Tatar' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'ug', name: 'Uyghur' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'cy', name: 'Welsh (Cymraeg)' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish (ייִדיש)' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' }
];

const V10PdfTranslator = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en-us');
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [statusMessage, setStatusMessage] = useState('');
  
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadFilename, setDownloadFilename] = useState('');

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPreviewRequest, setIsPreviewRequest] = useState(false); 
  
  const [freeTestUsed, setFreeTestUsed] = useState(false);
  const [userQuota, setUserQuota] = useState({ isPaid: false, used: 0, total: 1000, isUnlimited: false });
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const used = localStorage.getItem('v10_free_test_used');
      if (used === 'true') {
        setFreeTestUsed(true);
      }
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthInitialized(true);
      if (user) {
        fetchUserQuota(user);
      } else {
        setUserQuota({ isPaid: false, used: 0, total: 1000, isUnlimited: false });
      }
    });

    return () => unsubscribe();
  }, []);

  const getApiBase = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8000';
    }
    return 'https://aitoolsprosmart-becend-production.up.railway.app';
  };

  const fetchUserQuota = async (user) => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${getApiBase()}/api/user-quota`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setUserQuota({
          isPaid: data.isPaid || false,
          used: data.used || 0,
          total: data.total || 1000,
          isUnlimited: data.isUnlimited || false
        });
      }
    } catch (error) {
      console.log("Could not fetch quota details yet or endpoint not ready.");
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(`Selected file: ${e.target.files[0].name}`);
      setDownloadUrl(null);
      setProgress(0);
    }
  };

  const handleResetForNewTranslation = () => {
    setSelectedFile(null);
    setDownloadUrl(null);
    setProgress(0);
    setStatusMessage('');
  };

  const handleTranslateClick = async (isTestMode) => {
    if (!selectedFile) {
      alert("Please select a PDF file for translation.");
      return;
    }

    setIsPreviewRequest(isTestMode); 
    setDownloadUrl(null);
    const currentUser = auth.currentUser;

    if (!currentUser && (!isTestMode || freeTestUsed)) {
      setIsLoginModalOpen(true);
      return;
    }
    
    if (!currentUser && isTestMode && !freeTestUsed) {
       proceedWithTranslation(isTestMode, null);
       return;
    }

    proceedWithTranslation(isTestMode, currentUser?.email);
  };

  const proceedWithTranslation = async (isTestMode, userEmail) => {
    if (isTestMode) {
      executeTranslation(true);
      return;
    }

    const adminEmails = [
      'damnjanovicgoran7@gmail.com',
      'historical.stories7972@gmail.com',
      'aitoolsprosmart@gmail.com'
    ];

    if (userEmail && adminEmails.includes(userEmail.toLowerCase())) {
      console.log("[V10 ADMIN BYPASS] System owner executing full translation for free.");
      executeTranslation(false);
      return;
    }

    if (userQuota.isUnlimited || (userQuota.isPaid && userQuota.used < userQuota.total)) {
      console.log("[V10 QUOTA SYSTEM] User has active paid quota. Proceeding to translation.");
      executeTranslation(false);
      return;
    }

    try {
      const response = await fetch(`${getApiBase()}/api/check-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });
      const data = await response.json();

      if (data.isAdmin) {
        executeTranslation(false);
      } else {
        setIsCheckoutOpen(true); 
      }
    } catch (error) {
      setIsCheckoutOpen(true);
    }
  };

  const handleLoginSuccess = (user) => {
    console.log("[V10 AUTH] User successfully signed in:", user.email);
    fetchUserQuota(user).then(() => {
      proceedWithTranslation(isPreviewRequest, user.email);
    });
  };

  const handlePaymentSuccess = () => {
    console.log("[V10 PAYMENT SUCCESS] Payment verified, executing full translation.");
    setIsCheckoutOpen(false);
    setUserQuota(prev => ({ ...prev, isPaid: true, total: 1000, used: 0 }));
    executeTranslation(false); 
  };

  const executeTranslation = async (isTestMode) => {
    setLoading(true);
    setProgress(10); 
    setDownloadUrl(null);
    setStatusMessage(isTestMode ? "Initializing free 1-page preview test..." : "Initializing V10 DTP Neural Engine...");

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 15;
      });
    }, 600);

    const formData = new FormData();
    formData.append('pdfFile', selectedFile);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);
    formData.append('isPreview', isTestMode ? 'true' : 'false'); 

    try {
      const headers = {};
      if (auth.currentUser) {
         headers['Authorization'] = `Bearer ${await auth.currentUser.getIdToken()}`;
      }

      const response = await fetch(`${getApiBase()}/api/pdf-translate`, {
        method: 'POST',
        headers: headers,
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error("Server error during PDF document processing.");
      }

      setProgress(100);
      setStatusMessage("Translation and DTP reconstruction successfully completed!");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const safeLangCode = targetLang.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
      const filename = `Translated_${isTestMode ? 'FREE_1_PAGE_' : ''}${safeLangCode}_${selectedFile.name}`;
      
      setDownloadUrl(url);
      setDownloadFilename(filename);

      if (isTestMode) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('v10_free_test_used', 'true');
        }
        setFreeTestUsed(true);
        
        if (!auth.currentUser) {
          setTimeout(() => {
            setIsPreviewRequest(false);
            setIsLoginModalOpen(true);
          }, 1500);
        }
      } else if (auth.currentUser) {
        fetchUserQuota(auth.currentUser);
      }

    } catch (error) {
      clearInterval(progressInterval);
      console.error("[V10 ERROR]", error);
      alert("An error occurred during PDF translation.");
      setStatusMessage("Translation error encountered.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#02040a] via-[#050914] to-[#02040a] pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: ALAT ZA PREVOĐENJE + PROGRESS BAR */}
          <div className="w-full flex flex-col gap-8">
            
            <div className="w-full bg-[#080d1a] border border-blue-900/50 rounded-[2.5rem] p-6 sm:p-10 shadow-[0_0_50px_rgba(37,99,235,0.2)] text-white">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-blue-900/40">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-widest mb-3">
                    <ShieldCheck size={14} /> V10 Enterprise DTP Engine
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider">
                    Massive Document<br />Neural Translation
                  </h1>
                  <p className="mt-4 text-zinc-300 text-xs sm:text-sm font-bold leading-relaxed max-w-2xl">
                    Designed for corporate systems, publishers, and engineers. Our engine translates up to 1000 pages simultaneously without disrupting original DTP layouts, technical vectors, or graphics.
                  </p>
                </div>
              </div>

              {auth.currentUser && (userQuota.isPaid || userQuota.isUnlimited) && (
                <div className="mb-8 bg-[#050914] border border-emerald-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-end mb-3">
                       <div className="flex items-center gap-2">
                         <ShieldCheck className="text-emerald-400 w-5 h-5" />
                         <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Active Enterprise Quota</span>
                       </div>
                       <span className="text-base font-black text-white">
                         {userQuota.isUnlimited ? '∞' : `${userQuota.used} / ${userQuota.total}`} Pages
                       </span>
                    </div>
                    
                    {!userQuota.isUnlimited && (
                      <>
                        <div className="w-full bg-emerald-950/40 rounded-full h-3 overflow-hidden border border-emerald-900/50 mb-2">
                           <div 
                             className="bg-gradient-to-r from-emerald-600 to-teal-400 h-3 rounded-full transition-all duration-1000 ease-out" 
                             style={{ width: `${Math.min((userQuota.used / userQuota.total) * 100, 100)}%` }}
                           ></div>
                        </div>
                        <p className="text-[10px] text-emerald-300/80 font-bold tracking-widest uppercase">
                          {userQuota.total - userQuota.used} pages remaining in your plan
                        </p>
                      </>
                    )}
                    {userQuota.isUnlimited && (
                      <p className="text-[10px] text-emerald-300/80 font-bold tracking-widest uppercase">
                          Admin Bypass: Unlimited Pages Active
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2">
                    Select PDF Document
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    className="w-full text-sm text-zinc-300 font-bold file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer bg-[#050914] border border-blue-900/40 rounded-xl p-2 transition-colors disabled:opacity-50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2">
                      Source Language
                    </label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#050914] border border-blue-900/40 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    >
                      <option value="auto">Auto Detect Language</option>
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={`src-${lang.code}`} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2">
                      Target Language
                    </label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#050914] border border-blue-900/40 rounded-xl p-3 text-sm font-bold text-white focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                    >
                      {SUPPORTED_LANGUAGES.map(lang => (
                        <option key={`tgt-${lang.code}`} value={lang.name}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-[#050914] border border-blue-900/40 rounded-2xl p-6">
                {statusMessage && (
                  <p className="text-xs sm:text-sm text-blue-300 font-bold mb-4 text-center">
                    {statusMessage}
                  </p>
                )}

                {loading ? (
                  <div className="flex flex-col items-center justify-center p-6 gap-4">
                    <div className="flex items-center gap-3">
                      <Loader2 className="animate-spin text-blue-500" size={32} /> 
                      <span className="text-lg font-black text-white tracking-wider">{progress}%</span>
                    </div>
                    <div className="w-full bg-blue-950/60 rounded-full h-2.5 overflow-hidden border border-blue-900/40">
                      <div 
                        className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-zinc-300 uppercase tracking-widest font-bold">Neural Engine processing document...</span>
                  </div>
                ) : downloadUrl ? (
                  <div className="flex flex-col items-center justify-center gap-4 p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Your document is ready for download!</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                      <a
                        href={downloadUrl}
                        download={downloadFilename}
                        className="flex-1 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl text-xs tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2"
                      >
                        <Download size={16} /> DOWNLOAD TRANSLATED PDF
                      </a>

                      <button
                        type="button"
                        onClick={handleResetForNewTranslation}
                        className="px-5 py-3.5 bg-[#080d1a] border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-bold rounded-xl text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={14} /> New Translation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    
                    {/* DUGME ZA BESPLATNI TEST SA GA4 EVENT-OM */}
                    <button
                      type="button"
                      disabled={freeTestUsed}
                      onClick={() => {
                        // GA4 Custom Event Tracking
                        if (typeof window !== 'undefined' && window.gtag) {
                          window.gtag('event', 'pdf_free_test_click', {
                            event_category: 'Engagement',
                            event_label: 'Free 1-Page PDF Test'
                          });
                        }
                        handleTranslateClick(true);
                      }}
                      className={`flex-1 px-4 py-4 rounded-xl text-[11px] tracking-widest uppercase transition-all duration-300 flex flex-col items-center justify-center gap-1 group ${
                        freeTestUsed 
                          ? 'bg-[#03050a] border-2 border-zinc-800 text-zinc-600 cursor-not-allowed opacity-60 shadow-none'
                          : 'bg-[#080d1a] border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.15)]'
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Play size={16} className={freeTestUsed ? '' : 'group-hover:scale-110 transition-transform'} /> 
                        {freeTestUsed ? 'FREE TEST USED' : 'FREE TEST'}
                      </span>
                      <span className="text-[9px] font-bold opacity-80">
                        {freeTestUsed ? 'Limit reached' : 'Translate first 1 page'}
                      </span>
                    </button>

                    {/* FULL TRANSLATION */}
                    <button
                      type="button"
                      onClick={() => handleTranslateClick(false)}
                      className="flex-1 px-4 py-4 bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-cyan-400 text-white font-black rounded-xl text-[11px] tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center gap-1 group"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Globe size={16} className="group-hover:rotate-12 transition-transform" /> FULL TRANSLATION
                      </span>
                      <span className="text-[9px] font-bold opacity-90">Unlock full format ($399)</span>
                    </button>

                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: HOW IT WORKS */}
          <div className="w-full flex flex-col pt-4 lg:pt-0">
            <div className="text-left mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wider mb-4">
                How Our Layout Protector Works
              </h2>
              <p className="text-zinc-300 text-sm font-bold leading-relaxed">
                Standard translators ruin PDF document formatting. Our V10 DTP (Desktop Publishing) AI Engine reads documents on a layered level, translating text exclusively while structure, fonts, graphics, and margins remain perfectly intact.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-[#080d1a]/80 backdrop-blur-sm border border-blue-900/30 p-6 rounded-[2rem] hover:border-blue-500/50 transition-colors group flex gap-5 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-950/50 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">
                    1. Deep PDF Analysis
                  </h3>
                  <p className="text-zinc-300 text-xs font-bold leading-relaxed">
                    The system analyzes your document and isolates graphic elements from text. Tables, headers, images, and complex margins are frozen to protect them from damage during processing.
                  </p>
                </div>
              </div>

              <div className="bg-[#080d1a]/80 backdrop-blur-sm border border-blue-900/30 p-6 rounded-[2rem] hover:border-blue-500/50 transition-colors group relative overflow-hidden flex gap-5 items-start">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[50px] rounded-full pointer-events-none"></div>
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-950/50 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Cpu className="text-blue-400 w-5 h-5" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">
                    2. Localization & Translation
                  </h3>
                  <p className="text-zinc-300 text-xs font-bold leading-relaxed">
                    Text blocks are sent to our elite language model translating content into 160+ target languages, preserving cultural context, formal tone, and regional market idioms.
                  </p>
                </div>
              </div>

              <div className="bg-[#080d1a]/80 backdrop-blur-sm border border-blue-900/30 p-6 rounded-[2rem] hover:border-blue-500/50 transition-colors group flex gap-5 items-start">
                <div className="w-12 h-12 shrink-0 rounded-full bg-blue-950/50 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-wider text-sm mb-2">
                    3. Perfect Reconstruction
                  </h3>
                  <p className="text-zinc-300 text-xs font-bold leading-relaxed">
                    Translated text is returned with surgical precision to exact PDF coordinates. You receive an identical document ready for professional print or global corporate presentation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-8 pt-8 border-t border-blue-900/30">
              <div className="bg-[#080d1a] border-2 border-blue-900/50 p-6 rounded-3xl text-center hover:border-blue-500/60 transition-colors shadow-lg flex flex-col items-center justify-center">
                <LayoutTemplate className="text-blue-400 w-8 h-8 mx-auto mb-3" />
                <h4 className="text-white font-black text-xs uppercase tracking-wider">Preserve DTP Layout</h4>
                <p className="text-zinc-300 text-[11px] font-bold mt-2 leading-snug">Maintains absolute structural integrity across pages.</p>
              </div>

              <div className="bg-[#080d1a] border-2 border-blue-900/50 p-6 rounded-3xl text-center hover:border-blue-500/60 transition-colors shadow-lg flex flex-col items-center justify-center">
                <ImageIcon className="text-blue-400 w-8 h-8 mx-auto mb-3" />
                <h4 className="text-white font-black text-xs uppercase tracking-wider">Retain Images & Covers</h4>
                <p className="text-zinc-300 text-[11px] font-bold mt-2 leading-snug">Keeps all embedded artwork and cover designs intact.</p>
              </div>

              <div className="bg-[#080d1a] border-2 border-blue-900/50 p-6 rounded-3xl text-center hover:border-blue-500/60 transition-colors shadow-lg flex flex-col items-center justify-center">
                <PenTool className="text-blue-400 w-8 h-8 mx-auto mb-3" />
                <h4 className="text-white font-black text-xs uppercase tracking-wider">Protect CAD / Vectors</h4>
                <p className="text-zinc-300 text-[11px] font-bold mt-2 leading-snug">Secures engineering vectors and technical lines.</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* DONJI DEO: HORIZONTALNI FULL-WIDTH BILLING BOX */}
        <div className="w-full mt-12 lg:mt-16 bg-[#080d1a]/90 backdrop-blur-xl border-2 border-blue-500/60 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(37,99,235,0.25)] text-white">
          <div className="flex flex-col sm:flex-row items-center gap-5 mb-10 border-b border-blue-500/40 pb-8 text-center sm:text-left">
            <div className="w-14 h-14 rounded-full bg-blue-600 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.6)]">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              Billing & Quota System
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#050914] border border-blue-800/60 hover:border-blue-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-lg">
              <div className="w-8 h-8 mt-1 rounded-full bg-blue-900/80 border border-blue-400/60 flex items-center justify-center shrink-0 text-blue-200 text-sm font-black shadow-[0_0_10px_rgba(37,99,235,0.3)]">1</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">
                <strong className="text-blue-200 uppercase tracking-wider text-xs block mb-1.5">Free Test:</strong> 
                Translate the first 1 page of any PDF file completely free to evaluate translation quality and layout preservation.
              </p>
            </div>
            
            <div className="bg-[#050914] border border-blue-800/60 hover:border-blue-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-lg">
              <div className="w-8 h-8 mt-1 rounded-full bg-blue-900/80 border border-blue-400/60 flex items-center justify-center shrink-0 text-blue-200 text-sm font-black shadow-[0_0_10px_rgba(37,99,235,0.3)]">2</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">
                <strong className="text-blue-200 uppercase tracking-wider text-xs block mb-1.5">Flexibility:</strong> 
                Supports massive document translation up to 1000 pages per PDF, or distributing quota across multiple smaller files.
              </p>
            </div>

            <div className="bg-[#050914] border-2 border-emerald-800/60 hover:border-emerald-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-[0_0_15px_rgba(16,185,129,0.15)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-[30px] rounded-full"></div>
              <div className="w-8 h-8 mt-1 rounded-full bg-emerald-900/80 border border-emerald-400/60 flex items-center justify-center shrink-0 text-emerald-200 text-sm font-black shadow-[0_0_10px_rgba(16,185,129,0.3)] relative z-10">3</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed relative z-10">
                <strong className="text-emerald-300 uppercase tracking-wider text-xs block mb-1.5">Package Activation:</strong> 
                After the free test, full licensing is <span className="text-emerald-400 font-black text-base">$399</span>, granting an exact quota of 1000 pages.
              </p>
            </div>

            <div className="bg-[#050914] border border-blue-800/60 hover:border-blue-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-lg">
              <div className="w-8 h-8 mt-1 rounded-full bg-blue-900/80 border border-blue-400/60 flex items-center justify-center shrink-0 text-blue-200 text-sm font-black shadow-[0_0_10px_rgba(37,99,235,0.3)]">4</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">
                <strong className="text-blue-200 uppercase tracking-wider text-xs block mb-1.5">Quota Renewal:</strong> 
                Only after reaching the 1000-page limit will a new charge of $399 occur if you choose to continue translating.
              </p>
            </div>

            <div className="bg-[#050914] border border-blue-800/60 hover:border-blue-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-lg">
              <div className="w-8 h-8 mt-1 rounded-full bg-blue-900/80 border border-blue-400/60 flex items-center justify-center shrink-0 text-blue-200 text-sm font-black shadow-[0_0_10px_rgba(37,99,235,0.3)]">5</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">
                <strong className="text-blue-200 uppercase tracking-wider text-xs block mb-1.5">No Expiration Date:</strong> 
                Rolling Quota with no time limits. Use your 1000 pages in one hour or consume them indefinitely over time.
              </p>
            </div>

            <div className="bg-[#050914] border border-blue-800/60 hover:border-blue-500/80 transition-all p-6 rounded-2xl flex items-start gap-5 shadow-lg">
              <div className="w-8 h-8 mt-1 rounded-full bg-blue-900/80 border border-blue-400/60 flex items-center justify-center shrink-0 text-blue-200 text-sm font-black shadow-[0_0_10px_rgba(37,99,235,0.3)]">6</div>
              <p className="text-zinc-200 text-sm font-bold leading-relaxed">
                <strong className="text-blue-200 uppercase tracking-wider text-xs block mb-1.5">Support:</strong> 
                For inquiries or enterprise custom requests, reach out at <a href="mailto:aitoolsprosmart@gmail.com" className="text-blue-400 hover:text-blue-300 font-black transition-colors underline decoration-blue-500/50 underline-offset-4">aitoolsprosmart@gmail.com</a>.
              </p>
            </div>
          </div>
        </div>

      </div>

      <LoginRequiredModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        packageName="V10 Enterprise PDF Translator"
        price={399}
      />

      <V8SecureCheckout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        productName="V10 Enterprise PDF Translator"
        price={399}
        onPaymentSuccess={handlePaymentSuccess} 
        zipLink="" 
      />
    </div>
  );
};

export default V10PdfTranslator;