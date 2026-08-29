import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { auth } from './firebase'; // Proveri putanju do tvog firebase.js fajla
import { onAuthStateChanged } from 'firebase/auth';

export default function ProtectedMedia({ src, type = "image", alt = "V10 Media", fileName = "v10_asset" }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // 1. PROVERA ADMINA PREKO FIREBASE-a
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // 🔥 OVDE UPIŠI SVOJ EMAIL KOJI KORISTIŠ ZA ADMIN LOGIN 🔥
      if (user && user.email === "goran@tvoj-email.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. FORSIRANI DOWNLOAD (Sprečava otvaranje slike u novom tabu, odmah skida fajl)
  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.${type === 'image' ? 'webp' : 'mp4'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-xl w-full h-full">
      
      {/* RENDER MEDIA FAJLA */}
      {type === "image" ? (
        <img 
          src={src} 
          alt={alt} 
          // Sprečava desni klik ("Save image as...") ako nije admin
          onContextMenu={(e) => !isAdmin && e.preventDefault()} 
          // pointer-events-none sprečava prevlačenje (drag & drop) na desktopu
          className={`w-full h-full object-cover transition-transform duration-700 ${!isAdmin ? 'pointer-events-none select-none' : ''}`}
          draggable={isAdmin}
        />
      ) : (
        <video 
          src={src} 
          autoPlay 
          loop 
          muted 
          playsInline
          onContextMenu={(e) => !isAdmin && e.preventDefault()}
          className={`w-full h-full object-cover ${!isAdmin ? 'pointer-events-none select-none' : ''}`}
          controls={isAdmin} // Samo admin vidi klasične video kontrole
        />
      )}

      {/* ADMIN DOWNLOAD DUGME (Prikazuje se samo tebi, iskače na hover) */}
      {isAdmin && (
        <button 
          onClick={handleDownload}
          className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-500 text-white p-3 rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.4)] opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 flex items-center justify-center hover:scale-110 active:scale-95"
          title="Admin Download"
        >
          <Download size={20} strokeWidth={2.5} />
        </button>
      )}
      
    </div>
  );
}