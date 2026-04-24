import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import { db } from './firebase'; 
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

export const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;
        
        const docRef = doc(db, 'v8_stats', 'visitors');
        const docSnap = await getDoc(docRef);
        let currentCount = 0;
        
        if (docSnap.exists()) {
          currentCount = docSnap.data().count;
        } else {
          await setDoc(docRef, { count: 0 });
        }

        const hasCounted = sessionStorage.getItem('v8_counted');
        
        if (userIP !== '213.196.99.10' && !hasCounted) {
          await updateDoc(docRef, { count: increment(1) });
          setVisitorCount(currentCount + 1);
          sessionStorage.setItem('v8_counted', 'true');
        } else {
          setVisitorCount(currentCount);
        }
      } catch (error) {
        console.error("V8 Scanner Error:", error);
      }
    };

    trackVisitor();
  }, []);

  if (visitorCount === 0) return null; 

  return (
    <div className="fixed bottom-6 right-32 z-[9900] bg-[#0a0a0a]/90 backdrop-blur-md border border-orange-500/30 px-4 py-2 rounded-full shadow-[0_0_15px_rgba(234,88,12,0.2)] flex items-center gap-2 font-sans transition-all hover:border-orange-500">
      <Users className="w-4 h-4 text-orange-500" />
      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
        VISITS: <span className="text-white text-[11px]">{visitorCount.toLocaleString('en-US')}</span>
      </span>
    </div>
  );
};