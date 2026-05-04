import React, { useState } from 'react';
import { Play, Maximize2, Zap, Layers, MonitorSmartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// FULL SCREEN LIGHTBOX (sa glatkim učitavanjem)
const FullScreenLightbox = ({ item, onClose }) => {
    if (!item) return null;
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 cursor-pointer" 
            onClick={onClose}
        >
            <div className="absolute top-10 right-10 bg-white/10 hover:bg-[#FF8C00] p-3 rounded-full text-white transition-all z-10 shadow-lg">
                <Maximize2 size={24} />
            </div>
            
            <motion.div 
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative max-w-7xl w-full flex flex-col items-center" 
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <video src={item.url} autoPlay loop controls className="max-w-full max-h-[85vh] rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.3)] border border-[#FF8C00]/50" />
                ) : (
                    <img src={item.url} alt={item.title} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-[0_0_80px_rgba(255,140,0,0.3)] border border-white/10" />
                )}
                <div className="mt-6 text-center">
                    <h3 className="text-[#FF8C00] font-black text-2xl uppercase tracking-widest drop-shadow-[0_0_15px_rgba(255,140,0,0.5)]">{item.title}</h3>
                    <p className="text-zinc-400 font-bold text-sm tracking-wider uppercase mt-2">{item.format} • 33.2 MEGAPIXELS</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// GLAVNA SHOWROOM KOMPONENTA
const V8Showroom = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('ALL');
    const [lightboxItem, setLightboxItem] = useState(null);

    const showcaseItems = [
        { id: 1, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Michelin Star Seafood', url: 'LINK_JASTOG' },
        { id: 2, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Premium Wagyu Steak', url: 'LINK_STEJK' },
        { id: 3, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Decadent Chocolate Sphere', url: 'LINK_COKOLADNA_SFERA' },
        { id: 4, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Neural Network Grid', url: 'LINK_NEURAL_GRID' },
        { id: 5, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Shattered Dimension', url: 'LINK_STAKLO' },
        { id: 6, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Liquid Obsidian Flow', url: 'LINK_CRNA_TECNOST' },
        { id: 7, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Corporate HUD Matrix', url: 'LINK_KANCELARIJA_HUD' },
        { id: 8, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Neo-Kyoto Executive Suite', url: 'LINK_SAJBERPANK_KANCELARIJA' },
        { id: 9, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Biophilic Office Design', url: 'LINK_ZELENA_KANCELARIJA' },
        { id: 10, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Billionaire Penthouse Sunset', url: 'LINK_PENTHOUSE' },
        { id: 11, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Stormy Highway Trails', url: 'LINK_AUTOPUT_OLUJA' },
        { id: 12, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Bespoke Obsidian Hypercar', url: 'LINK_CRNI_AUTO' },
        { id: 13, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Luxury Perfume & Amber', url: 'LINK_PARFEM' },
        { id: 14, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Macro Diamond & Timepieces', url: 'LINK_SAT_NAKIT' },
        { id: 15, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Legionary Armament', url: 'LINK_GLADIJATOR_OPREMA' },
        { id: 18, type: 'image', category: 'NIGHTLIFE & LUXURY', format: '16:9', title: 'Premium Craft Cocktails', url: 'LINK_KOKTELI' },
        { id: 16, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Smartwatch Hologram', url: 'LINK_SAT_VIDEO' },
        { id: 17, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'VR Paradise Transition', url: 'LINK_VR_VIDEO' },
        
        // --- 4x NOVI 9:16 VERTIKALNI VIDEI (Vidljivi na ALL) ---
        { id: 19, type: 'video', category: 'ABSTRACT TECH', format: '9:16', title: 'Cyberpunk Vertical Flow', url: 'LINK_VERT_1' },
        { id: 20, type: 'video', category: 'NIGHTLIFE & LUXURY', format: '9:16', title: 'Neon Nights Reel', url: 'LINK_VERT_2' },
        { id: 21, type: 'video', category: 'PRODUCT & MACRO', format: '9:16', title: 'Macro Watch Vertical', url: 'LINK_VERT_3' },
        { id: 22, type: 'video', category: 'SPACES & ARCHITECTURE', format: '9:16', title: 'Skyscraper Drone Vert', url: 'LINK_VERT_4' },

        // --- 4x NOVI 16:9 CINEMATIC VIDEI ---
        { id: 23, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Epic Landscape Pan', url: 'LINK_CINE_1' },
        { id: 24, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Slow Motion Culinary', url: 'LINK_CINE_2' },
        { id: 25, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Abstract Fluid Dynamics', url: 'LINK_CINE_3' },
        { id: 26, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Roman Legion March', url: 'LINK_CINE_4' },
        // ... tvoji prethodni itemi (id: 26, itd.)
        
        // --- ICE FRUIT FUSION (Novi dodaci) ---
        { id: 27, type: 'image', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Mango Ice Explosion', url: 'LINK_MANGO_ICE' },
        { id: 28, type: 'video', category: 'ICE FRUIT FUSION', format: '9:16', title: 'Frozen Citrus Splash', url: 'LINK_CITRUS_VERT' },
        { id: 29, type: 'image', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Arctic Berry Fusion', url: 'LINK_BERRY_ICE' },
        { id: 30, type: 'video', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Tropical Frost Dynamics', url: 'LINK_TROPICAL_CINE' }
    ];
    

    const filters = ['ALL', 'LUXURY CULINARY', 'ICE FRUIT FUSION', 'ABSTRACT TECH', 'CINEMATIC MOTION', 'ROMAN REALISM', 'SPACES & ARCHITECTURE', 'PRODUCT & MACRO', 'NIGHTLIFE & LUXURY'];

    const filteredItems = activeFilter === 'ALL' ? showcaseItems : showcaseItems.filter(item => item.category === activeFilter);

    // DIREKTAN PRELAZ BEZ UČITAVANJA (NO LOADER)
    const handleOpenStore = () => {
        window.scrollTo(0, 0); 
        navigate('/stock');    
    };
    
    return (
        // CINEMATIC PAGE TRANSITION: Stranica izranja iz crnila
        <motion.div 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8 }}
            className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 font-sans text-white overflow-hidden"
        >
            <AnimatePresence>
                {lightboxItem && <FullScreenLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />}
            </AnimatePresence>

            {/* HERO SEKCIJA SA TVOJOM NOVOM SLIKOM */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-full max-w-7xl mx-auto mb-24 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]"
            >
                {/* Tvoja tečna V8 pozadina */}
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
                    style={{ backgroundImage: "url('/v8-showroom/v8-hero.png')" }} 
                ></div>
                
                {/* Profesionalni prelaz: Zatamnjenje sa donje i bočnih strana da tekst "iskače" */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>

                {/* Sadržaj iznad slike */}
                <div className="relative z-10 text-center py-32 px-6">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="inline-block px-5 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#FF8C00]/30 text-[#FF8C00] font-black uppercase text-[10px] tracking-widest mb-8 shadow-[0_0_20px_rgba(255,140,0,0.2)]"
                    >
                        V8 Masterwork Edition
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6 text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
                        BEYOND <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF8C00] to-amber-600 drop-shadow-none">PIXELS</span>
                    </h1>
                    
                    <p className="text-zinc-200 font-bold uppercase tracking-[0.4em] text-[11px] md:text-[13px] max-w-3xl mx-auto leading-relaxed mb-12 drop-shadow-lg bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                        Step into the V8 Masterwork Showroom. Experience 33.2 Megapixel resolution and hyper-realistic cinematic motion. Designed exclusively for top-tier agencies and visionary brands.
                    </p>
                    
                    <button onClick={handleOpenStore} className="bg-gradient-to-r from-orange-600 to-amber-500 text-white px-12 py-5 rounded-full font-black text-[13px] uppercase tracking-widest shadow-[0_0_30px_rgba(234,88,12,0.5)] hover:scale-105 hover:shadow-[0_0_50px_rgba(234,88,12,0.8)] transition-all flex items-center gap-3 mx-auto border border-orange-400/50 relative z-50">
                        <Zap size={20} fill="currentColor" /> UNLOCK FULL BUNDLES NOW
                    </button>
                </div>
            </motion.div>

            {/* FILTERI (Animirani jedan po jedan) */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4 mb-16 max-w-5xl mx-auto relative z-10"
            >
                {filters.map((filter, idx) => (
                    <motion.button 
                        key={filter}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-8 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-colors duration-300 border relative z-50 ${activeFilter === filter ? 'bg-[#FF8C00]/20 border-[#FF8C00] text-[#FF8C00] shadow-[0_0_20px_rgba(255,140,0,0.2)]' : 'bg-[#0a0a0a] border-white/10 text-zinc-500 hover:border-[#FF8C00]/50 hover:text-white'}`}
                    >
                        {filter}
                    </motion.button>
                ))}
            </motion.div>

            {/* MASONRY GALERIJA - SCROLL REVEAL EFEKAT */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
                <AnimatePresence>
                    {filteredItems.map((item, index) => (
                        <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.05 }}
                            onClick={() => setLightboxItem(item)}
                            className="relative group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer break-inside-avoid transform transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,140,0,0.15)] z-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8C00]/0 via-[#FF8C00]/0 to-[#FF8C00]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"></div>

                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                                    <MonitorSmartphone size={12} className="text-[#FF8C00]" /> {item.format}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4 z-20">
                                <span className={`px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider backdrop-blur-md border ${item.type === 'video' ? 'bg-red-900/80 border-red-500/50 text-red-400' : 'bg-blue-900/80 border-blue-500/50 text-blue-400'}`}>
                                    {item.type === 'video' ? 'CINEMATIC VIDEO' : '33MP IMAGE'}
                                </span>
                            </div>

                            <div className="relative w-full h-full overflow-hidden">
                                {item.type === 'video' ? (
                                    <>
                                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 group-hover:bg-transparent transition-all">
                                            <div className="w-16 h-16 bg-[#FF8C00] rounded-full flex items-center justify-center text-black pl-1 shadow-[0_0_30px_rgba(255,140,0,0.5)] group-hover:scale-110 transition-transform">
                                                <Play size={24} fill="currentColor" />
                                            </div>
                                        </div>
                                        {/* V8 DINAMIČKI PLACEHOLDER KOJI PRATI 9:16 ili 16:9 FORMAT */}
                                        <div className={`w-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-black tracking-widest ${item.format === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                                            {item.format} VIDEO PLACEHOLDER
                                        </div>
                                    </>
                                ) : (
                                    <img src={item.url} alt={item.title} loading="lazy" className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-1">{item.title}</h3>
                                <p className="text-[#FF8C00] font-bold text-[10px] uppercase tracking-[0.2em]">{item.category}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto mt-32 text-center bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-white/5 rounded-[3rem] p-12 relative overflow-hidden"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-[#FF8C00] to-transparent opacity-50"></div>
                <h2 className="text-3xl font-black uppercase text-white tracking-widest mb-4">READY TO UPGRADE YOUR VISUALS?</h2>
                <p className="text-zinc-500 font-bold uppercase text-[11px] tracking-widest mb-10">Stop using generic stock. Dominate your market with V8.</p>
                <button onClick={handleOpenStore} className="bg-[#FF8C00] text-black px-12 py-5 rounded-full font-black text-[13px] uppercase tracking-widest shadow-[0_0_40px_rgba(255,140,0,0.3)] hover:scale-105 hover:bg-white transition-all flex items-center gap-3 mx-auto relative z-50">
                    <Layers size={20} /> BROWSE V8 STORE
                </button>
            </motion.div>
        </motion.div>
    );
};

export default V8Showroom;