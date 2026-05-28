import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const V8MediaViewer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const item = location.state?.item;

    useEffect(() => {
        window.scrollTo(0, 0);

        // V8 MASTERWORK LOGIKA: Pokrećemo video bez mešanja u tvoje kasnije komande
        if (item?.type === 'video' && videoRef.current) {
            const video = videoRef.current;
            
            // 1. Forsiramo muted samo za start (da bi browser dozvolio autoplay)
            video.muted = true;
            video.playsInline = true;

            // 2. Ispaljujemo PLAY komandu direktno pretraživaču
            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("V8 Autoplay bypass aktivan.");
                });
            }
        }
    }, [item]);

    if (!item) return null;

    const safeUrl = item.url || '';
    const isPlaceholder = safeUrl.includes('LINK_');

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col w-full text-white font-sans">
            {/* GORNJI DEO: Premium povratak */}
            <div className="w-full flex justify-between items-center p-6 md:p-10 shrink-0">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 hover:border-[#ea580c] hover:text-[#ea580c] px-6 py-3 rounded-full transition-all font-black uppercase tracking-widest text-[12px]"
                >
                   <ChevronLeft size={20} /> Back to Showroom
                </button>
            </div>

            {/* SREDINA: Video / Slika kanvas */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-16 w-full max-w-7xl mx-auto">
                {isPlaceholder ? (
                    <div className="w-full max-w-3xl aspect-video flex items-center justify-center bg-zinc-900 border border-white/10 rounded-2xl text-zinc-700 font-black tracking-widest">
                        {item.format} PLACEHOLDER
                    </div>
                ) : item.type === 'video' ? (
                    <video 
                        ref={videoRef}
                        key={safeUrl} // Sprečava bagove kod prebacivanja između videa
                        src={safeUrl} 
                        /* V8 FIX: Ovde NE stavljamo muted i autoPlay. To rešava useEffect iznad! */
                        loop 
                        controls 
                        controlsList="nodownload" 
                        onContextMenu={(e) => e.preventDefault()}
                        className="w-auto h-auto max-h-[75vh] max-w-full rounded-[2rem] border border-[#ea580c]/30 shadow-[0_0_100px_rgba(234,88,12,0.2)] bg-black" 
                    />
                ) : (
                    <img 
                        src={safeUrl} 
                        alt={item.title} 
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                        className="w-auto max-w-full max-h-[75vh] rounded-[2rem] border border-white/10 shadow-[0_0_80px_rgba(255,255,255,0.05)] object-contain" 
                    />
                )}
                
                {/* TEKSTUALNI DETALJI */}
                <div className="mt-12 text-center">
                    <h1 className="text-[#ea580c] font-black text-3xl md:text-6xl uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]">
                        {item.title}
                    </h1>
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        <span className="px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                            {item.format} Format
                        </span>
                        <span className="px-4 py-1.5 bg-orange-600/10 border border-orange-600/20 rounded-lg text-[10px] font-bold uppercase tracking-[0.3em] text-[#ea580c]">
                            V8 Masterwork resolution
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V8MediaViewer;