import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Loader2 } from 'lucide-react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import * as data from './data';

export default function TrezorPage({ apps = [] }) {
  const [unlockedApps, setUnlockedApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const email = user.email ? user.email.toLowerCase() : "";
        if (email === "damnjanovicgoran7@gmail.com" || email === "aitoolsprosmart@gmail.com") { 
          setUnlockedApps(['FULL_ACCESS']); 
        } else {
          try {
            const docRef = doc(db, "vip_users", email);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().unlockedApps) { setUnlockedApps(docSnap.data().unlockedApps); } 
            else { setUnlockedApps([]); }
          } catch(e) { setUnlockedApps([]); }
        }
      } else { navigate('/'); }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500"><Loader2 className="w-10 h-10 animate-spin" /></div>;

  const hasFullAccess = unlockedApps.includes('FULL_ACCESS');
  const myApps = hasFullAccess ? apps : apps.filter(app => unlockedApps.includes(app.id));

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto font-sans text-left text-white min-h-screen">
      <Helmet><title>MY VAULT | AI TOOLS PRO SMART</title></Helmet>
      <div className="flex items-center gap-4 mb-10 border-b border-orange-500/20 pb-6"><Lock className="w-8 h-8 text-orange-500" /><h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white">VIP VAULT</h1></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myApps.map((app) => {
             const isVideo = app.media?.[0]?.type === 'video' || app.media?.[0]?.url?.match(/\.(mp4|webm|ogg|mov)$/i);
             const displayUrl = app.media?.[0]?.url || data.bannerUrl;
             const parts = (app.whopLink || "").split("[SPLIT]");
             const mainLink = parts[0] || "";
             return (
               <div key={app.id} className="bg-[#0a0a0a] border border-orange-500/30 rounded-[2rem] p-5 flex flex-col hover:border-orange-500/60 transition-all group shadow-xl">
                 <Link to={`/app/${app.id}`} className="aspect-video relative rounded-xl overflow-hidden mb-4 bg-black block border border-white/5">
                    {isVideo ? <video src={`${displayUrl}#t=0.001`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" muted playsInline controlsList="nodownload" /> : <img src={displayUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" alt={app.name} />}
                 </Link>
                 <h3 className="text-[16px] font-black uppercase text-white mb-2 line-clamp-1">{app.name}</h3>
                 <p className="text-zinc-500 text-[10px] uppercase font-bold mb-6 flex-1 line-clamp-2">{app.headline}</p>
                 {mainLink ? <a href={data.formatExternalLink(mainLink)} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl text-center font-black text-[11px] uppercase tracking-widest hover:scale-105 block shadow-[0_0_15px_rgba(34,197,94,0.3)]">🚀 OPEN APPLICATION</a> : <Link to={`/app/${app.id}`} className="w-full py-3.5 bg-zinc-800 text-white rounded-xl text-center font-black text-[11px] uppercase tracking-widest hover:scale-105 block">VIEW DETAILS</Link>}
               </div>
             );
          })}
      </div>
    </div>
  );
}