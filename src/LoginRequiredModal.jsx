// POČETAK FAJLA: LoginRequiredModal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-react';

import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLoginSuccess,
  packageName = "Selected Package",
  price = 0
}) => {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(auth, provider);
if (result?.user) {
  onClose();

  setTimeout(() => {
    if (onLoginSuccess) {
      onLoginSuccess(result.user);
    }
  }, 250);
}
    } catch (error) {
      console.error("Google login error:", error);
      alert("Google login failed or was cancelled. Please try again.");
    } finally {
      setLoading(false);
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
              className="absolute top-5 right-5 z-20 text-zinc-500 hover:text-white transition-colors disabled:opacity-40"
            >
              <X size={24} strokeWidth={2.5} />
            </button>

            <div className="relative z-10 p-8 sm:p-10 text-center">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-blue-600/10 border border-blue-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(37,99,235,0.35)]">
                <Lock className="w-9 h-9 text-blue-400" strokeWidth={1.8} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-[10px] font-black uppercase tracking-[0.25em] mb-5">
                <ShieldCheck size={14} />
                Secure Account Required
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-widest leading-tight mb-4">
                Login Required
              </h2>

              <p className="text-zinc-400 text-[13px] sm:text-sm leading-relaxed max-w-md mx-auto mb-7">
                To buy this package, you must first verify your Google account. This protects your license, payment request, and future access.
              </p>

              <div className="bg-[#050914] border border-blue-900/40 rounded-2xl p-5 mb-7 text-left shadow-inner">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">
                  Selected Package
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-black uppercase tracking-wider text-sm sm:text-base leading-tight">
                      {packageName}
                    </h3>

                    <p className="text-zinc-500 text-[11px] mt-1">
                      Your package will continue after login.
                    </p>
                  </div>

                  <div className="text-blue-400 font-black text-xl sm:text-2xl whitespace-nowrap">
                    ${price}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-cyan-400 text-white font-black py-4 rounded-xl text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-60 shadow-[0_0_30px_rgba(37,99,235,0.35)] hover:scale-[1.01]"
              >
                {loading ? "Connecting Google Account..." : "Continue with Google"}
              </button>

              <div className="mt-6 flex items-start gap-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-4 text-left">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />

                <p className="text-[11px] text-emerald-100/80 leading-relaxed">
                  After successful login, the secure checkout window will open automatically for this selected package.
                </p>
              </div>

              <div className="mt-4 flex items-start gap-3 bg-orange-950/20 border border-orange-500/20 rounded-xl p-4 text-left">
                <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />

                <p className="text-[11px] text-orange-100/70 leading-relaxed">
                  If the Google popup does not appear, check that popup blocking is disabled for this website.
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