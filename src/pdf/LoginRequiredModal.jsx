// POČETAK FAJLA: LoginRequiredModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { auth } from '../firebase'; 
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  price = 399
}) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    let result;

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      result = await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Prijava preko Google-a nije uspela. Molimo pokušajte ponovo.");
      setLoading(false);
      return; 
    }

    if (result?.user) {
      const userEmail = result.user.email;
      let isAdmin = false;

      try {
        // 🔥 Ovde je ispravljen port na 8000! 🔥
        const API_BASE = window.location.hostname === 'localhost' 
          ? 'http://localhost:8000' 
          : 'https://aitoolsprosmart-becend-production.up.railway.app';

        const response = await fetch(`${API_BASE}/api/check-admin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });
        
        if (response.ok) {
          const data = await response.json();
          isAdmin = data.isAdmin;
        }
      } catch (backendError) {
        console.error("Backend nije dostupan za provjeru admina:", backendError);
      }

      if (isAdmin) {
        console.log("[V10 ADMIN BYPASS] Server potvrdio administratorski pristup.");
        alert("Admin pristup odobren! PDF prevod je besplatan za tebe.");
        onClose();
        setLoading(false);

        if (onLoginSuccess) {
          onLoginSuccess({ ...result.user, isAdmin: true });
        }
      } else {
        onClose();
        setLoading(false);
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess({ ...result.user, isAdmin: false });
          }
        }, 250);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-[#02040a]/90 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative w-full max-w-lg bg-[#080d1a] border border-blue-900/60 rounded-[2rem] shadow-[0_0_80px_rgba(37,99,235,0.25)] overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none"></div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 text-zinc-500 hover:text-white transition-colors disabled:opacity-40 p-2"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="relative z-10 p-6 sm:p-10 text-center">
              <div className="mx-auto mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-600/10 border border-blue-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(37,99,235,0.35)]">
                <FileText className="w-8 h-8 sm:w-9 sm:h-9 text-blue-400" strokeWidth={1.8} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] mb-5">
                <ShieldCheck size={14} />
                V10 DTP Protection
              </div>

              <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-widest leading-tight mb-4">
                Secure PDF Access
              </h2>

              <p className="text-zinc-400 text-[12px] sm:text-sm leading-relaxed max-w-md mx-auto mb-7">
                To translate your PDF document securely while preserving its exact layout, graphics, and fonts, please verify your account.
              </p>

              <div className="bg-[#050914] border border-blue-900/40 rounded-2xl p-4 sm:p-5 mb-7 text-left shadow-inner">
                <p className="text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">
                  Service Package
                </p>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-wider text-xs sm:text-base leading-tight">
                      V10 Enterprise PDF Translator
                    </h3>
                    <p className="text-zinc-500 text-[10px] sm:text-[11px] mt-1">
                      Professional DTP engine with layout reconstruction.
                    </p>
                  </div>
                  <div className="text-blue-400 font-black text-lg sm:text-2xl whitespace-nowrap">
                    ${price}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-cyan-400 text-white font-black py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-60 shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:scale-[1.01]"
              >
                {loading ? "Verifying Account..." : "Continue with Google to Translate"}
              </button>

              <div className="mt-6 flex items-start gap-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-left">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-[11px] text-emerald-100/80 leading-relaxed">
                  Your translated PDF will be generated immediately after successful authentication and payment.
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 bg-orange-950/20 border border-orange-500/20 rounded-xl p-4 text-left">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] sm:text-[11px] text-orange-100/70 leading-relaxed">
                  Make sure popups are enabled if the Google sign-in window does not open automatically.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginRequiredModal;
// KRAJ FAJLA: LoginRequiredModal.jsx