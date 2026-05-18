// POČETAK FAJLA: V8Showroom.jsx
import React, { useState, useEffect } from 'react';
import { 
    Play, Zap, Layers, MonitorSmartphone, Globe, Utensils, Droplets, 
    Cpu, Hexagon, Film, Shield, Building2, Aperture, Gem, Waves, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 🔥 FIREBASE IMPORTS 🔥
import { db } from './firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

// POČETAK FUNKCIJE: V8Showroom
const V8Showroom = () => {
    const navigate = useNavigate();
    
    // 🔥 FIX: Učitavamo poslednji aktivni filter iz localStorage, ili 'ALL' ako ne postoji 🔥
    const [activeFilter, setActiveFilter] = useState(() => {
        const savedFilter = localStorage.getItem('v8_showroom_filter');
        return savedFilter || 'ALL';
    });
    
    // 🔥 NOVI STATE ZA NOVE FAJLOVE IZ BAZE 🔥
    const [firebaseItems, setFirebaseItems] = useState([]);

    // 🔥 FIX: Snimamo u localStorage svaki put kada se filter promeni 🔥
    useEffect(() => {
        localStorage.setItem('v8_showroom_filter', activeFilter);
    }, [activeFilter]);

    // --- POČETAK: TVOJI STARI HARDKODOVANI ITEMI ---
    const hardcodedItems = [
        // --- LUXURY CULINARY ---
        { id: 101, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Gourmet Seafood Tartare', url: '/v8_hrana/h_1.webp' },
        { id: 102, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Pan-Seared Hokkaido Scallops', url: '/v8_hrana/h_2.webp' },
        { id: 103, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Sunset Coastal Lobster Feast', url: '/v8_hrana/h_3.webp' },
        { id: 104, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Prime Wagyu Tenderloin', url: '/v8_hrana/h_4.webp' },
        { id: 105, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Char-Grilled Filet Mignon', url: '/v8_hrana/h_5.webp' },
        { id: 106, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Decadent Chocolate Opera', url: '/v8_hrana/h_6.webp' },
        { id: 107, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Molten Chocolate Lava Tart', url: '/v8_hrana/h_7.webp' },
        { id: 108, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Artisan Truffle Dome', url: '/v8_hrana/h_8.webp' },
        { id: 109, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Shattered Obsidian Sphere', url: '/v8_hrana/h_9.webp' },
        { id: 110, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Velvet Chocolate Pour', url: '/v8_hrana/h_10.webp' },
        { id: 1, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Michelin Star Seafood', url: 'LINK_JASTOG' },
        { id: 2, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Premium Wagyu Steak', url: 'LINK_STEJK' },
        { id: 3, type: 'image', category: 'LUXURY CULINARY', format: '16:9', title: 'Decadent Chocolate Sphere', url: 'LINK_COKOLADNA_SFERA' },

        // --- ICE FRUIT FUSION ---
        { id: 201, type: 'image', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Kiwi Splash Dynamics', url: '/ice-fruit/ifs_1.webp' },
        { id: 202, type: 'image', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Dark Kiwi Fusion', url: '/ice-fruit/ifs_2.webp' },
        { id: 203, type: 'image', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Orange Citrus Burst', url: '/ice-fruit/ifs_3.webp' },
        { id: 204, type: 'video', category: 'ICE FRUIT FUSION', format: '16:9', title: 'Mangorax Cinematic Splash', url: '/ice-fruit/v8_orange_brutal.mp4' },

        // --- LUXURY LIFESTYLE ---
        { id: 301, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Crimson Hypercar Estate', url: '/v8_LL/ll_1.webp' },
        { id: 302, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Infinity Pool Retreat', url: '/v8_LL/ll_2.webp' },
        { id: 303, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Exclusive Gala Dinner', url: '/v8_LL/ll_3.webp' },
        { id: 304, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Private Jet Cabin', url: '/v8_LL/ll_4.webp' },
        { id: 305, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Grand Staircase Elegance', url: '/v8_LL/ll_5.webp' },
        { id: 306, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'VIP Red Carpet Soirée', url: '/v8_LL/ll_6.webp' },
        { id: 307, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Modern Penthouse Suite', url: '/v8_LL/ll_7.webp' },
        { id: 308, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Mega Yacht Ocean Cruise', url: '/v8_LL/ll_8.webp' },
        { id: 309, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Coastal Resort Lounge', url: '/v8_LL/ll_9.webp' },
        { id: 310, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Michelin Star Dining', url: '/v8_LL/ll_10.webp' },
        { id: 311, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Chauffeur Driven Executive', url: '/v8_LL/ll_11.webp' },
        { id: 312, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Designer Boutique Avenue', url: '/v8_LL/ll_12.webp' },
        { id: 313, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Equestrian Club Classic', url: '/v8_LL/ll_13.webp' },
        { id: 314, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Sunset Marina Mooring', url: '/v8_LL/ll_14.webp' },
        { id: 315, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Golden Hour Cocktail Deck', url: '/v8_LL/ll_15.webp' },
        { id: 316, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Gentleman\'s Cigar Lounge', url: '/v8_LL/ll_16.webp' },
        { id: 317, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Tropical Island Villa', url: '/v8_LL/ll_17.webp' },
        { id: 318, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Panoramic City Skyline', url: '/v8_LL/ll_18.webp' },
        { id: 319, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'High-Stakes Casino Royale', url: '/v8_LL/ll_19.webp' },
        { id: 320, type: 'image', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Exclusive Premiere Night', url: '/v8_LL/ll_20.webp' },
        { id: 321, type: 'video', category: 'LUXURY LIFESTYLE', format: '9:16', title: 'Global Nomad Reel', url: 'LINK_LIFESTYLE_V_916' },
        { id: 322, type: 'video', category: 'LUXURY LIFESTYLE', format: '16:9', title: 'Sunset Yacht Party', url: 'LINK_LIFESTYLE_V_169' },

        // --- TECH & GADGETS ---
        { id: 401, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Neural VR Headset', url: '/v8_tg/tg_1.webp' },
        { id: 402, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Quantum Laptop Display', url: '/v8_tg/tg_2.webp' },
        { id: 403, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Cyberpunk Server Rig', url: '/v8_tg/tg_3.webp' },
        { id: 404, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Holographic Smartphone', url: '/v8_tg/tg_4.webp' },
        { id: 405, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Command Center Workstation', url: '/v8_tg/tg_5.webp' },
        { id: 406, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Neon Cyber Desk', url: '/v8_tg/tg_6.webp' },
        { id: 407, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Autonomous Surveillance Drone', url: '/v8_tg/tg_7.webp' },
        { id: 408, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Mainframe Data Center', url: '/v8_tg/tg_8.webp' },
        { id: 409, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Interactive Holo-Projector', url: '/v8_tg/tg_9.webp' },
        { id: 410, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Next-Gen Gaming Station', url: '/v8_tg/tg_10.webp' },
        { id: 411, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Advanced Tactical Smartwatch', url: '/v8_tg/tg_11.webp' },
        { id: 412, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Obsidian Acoustic Hub', url: '/v8_tg/tg_12.webp' }, 
        { id: 413, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Quantum Polyhedron Core', url: '/v8_tg/tg_13.webp' }, 
        { id: 414, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Lunar Prism Smart Hub', url: '/v8_tg/tg_14.webp' }, 
        { id: 415, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Quantum Encryption Key', url: 'LINK_TECH_15' },
        { id: 416, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Robotic Exoskeleton Frame', url: 'LINK_TECH_16' },
        { id: 417, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Laser Communication Array', url: 'LINK_TECH_17' },
        { id: 418, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Liquid Metal Coolant Pipe', url: 'LINK_TECH_18' },
        { id: 419, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Bio-Metric Security Scanner', url: 'LINK_TECH_19' },
        { id: 420, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Gravitational Wave Detector', url: 'LINK_TECH_20' },
        { id: 421, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Next-Gen Gaming Engine Rig', url: 'LINK_TECH_21' },
        { id: 422, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Plasma Igniter Component', url: 'LINK_TECH_22' },
        { id: 423, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Neural Link Headset', url: 'LINK_TECH_23' },
        { id: 424, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Zero-G Environment Kit', url: 'LINK_TECH_24' },
        { id: 425, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Solar Harvesting Skin', url: 'LINK_TECH_25' },
        { id: 426, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Tactile Feedback Glove', url: 'LINK_TECH_26' },
        { id: 427, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Sub-Atomic Microchip', url: 'LINK_TECH_27' },
        { id: 428, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Data Crystal Storage', url: 'LINK_TECH_28' },
        { id: 429, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Thermal Shield Plating', url: 'LINK_TECH_29' },
        { id: 430, type: 'image', category: 'TECH & GADGETS', format: '16:9', title: 'Infinite Loop Power Core', url: 'LINK_TECH_30' },
        { id: 431, type: 'video', category: 'TECH & GADGETS', format: '9:16', title: 'Cyberpunk VR Interface', url: '/v8_tg/tgv_1.mp4' },
        { id: 432, type: 'video', category: 'TECH & GADGETS', format: '9:16', title: 'Holographic Gadget Display', url: '/v8_tg/tgv_2.mp4' },
        { id: 433, type: 'video', category: 'TECH & GADGETS', format: '9:16', title: 'Smart Eyewear Showcase', url: '/v8_tg/tgv_3.mp4' },

        // --- ABSTRACT TECH ---
        { id: 4, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Neural Network Grid', url: 'LINK_NEURAL_GRID' },
        { id: 5, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Shattered Dimension', url: 'LINK_STAKLO' },
        { id: 6, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Liquid Obsidian Flow', url: 'LINK_CRNA_TECNOST' },
        { id: 7, type: 'image', category: 'ABSTRACT TECH', format: '16:9', title: 'Corporate HUD Matrix', url: 'LINK_KANCELARIJA_HUD' },
        { id: 19, type: 'video', category: 'ABSTRACT TECH', format: '9:16', title: 'Cyberpunk Vertical Flow', url: 'LINK_VERT_1' },

        // --- SPACES & ARCHITECTURE ---
        { id: 8, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Neo-Kyoto Executive Suite', url: 'LINK_SAJBERPANK_KANCELARIJA' },
        { id: 9, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Biophilic Office Design', url: 'LINK_ZELENA_KANCELARIJA' },
        { id: 10, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Billionaire Penthouse Sunset', url: 'LINK_PENTHOUSE' },
        { id: 11, type: 'image', category: 'SPACES & ARCHITECTURE', format: '16:9', title: 'Stormy Highway Trails', url: 'LINK_AUTOPUT_OLUJA' },
        { id: 22, type: 'video', category: 'SPACES & ARCHITECTURE', format: '9:16', title: 'Skyscraper Drone Vert', url: 'LINK_VERT_4' },

        // --- PRODUCT & MACRO ---
        { id: 12, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Bespoke Obsidian Hypercar', url: 'LINK_CRNI_AUTO' },
        { id: 13, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Luxury Perfume & Amber', url: 'LINK_PARFEM' },
        { id: 14, type: 'image', category: 'PRODUCT & MACRO', format: '16:9', title: 'Macro Diamond & Timepieces', url: 'LINK_SAT_NAKIT' },
        { id: 21, type: 'video', category: 'PRODUCT & MACRO', format: '9:16', title: 'Macro Watch Vertical', url: 'LINK_VERT_3' },

        // --- ROMAN REALISM ---
        { id: 50, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Eternal Legionary Stand', url: '/v8_roman/roman_1.webp' },
        { id: 51, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Legio X Imperial Plate', url: '/v8_roman/roman_2.webp' },
        { id: 52, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Senate Hall Majesty', url: '/v8_roman/roman_3.webp' },
        { id: 53, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Guardian of the Empire', url: '/v8_roman/roman_4.webp' },
        { id: 54, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Polished Roman Steel', url: '/v8_roman/roman_5.webp' },
        { id: 55, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'March of the Conquerors', url: '/v8_roman/roman_6.webp' },
        { id: 56, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Victor’s Galea Helmet', url: '/v8_roman/roman_7.webp' },
        { id: 57, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Iron Discipline Formation', url: '/v8_roman/roman_8.webp' },
        { id: 58, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Golden Aquila Standard', url: '/v8_roman/roman_9.webp' },
        { id: 60, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Path of the Centurion', url: '/v8_roman/roman_10.webp' },
        { id: 61, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Elite Command Pride', url: '/v8_roman/roman_11.webp' },
        { id: 62, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Winter Campaign Frost', url: '/v8_roman/roman_12.webp' },
        { id: 63, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Praetorian Obsidian Shadows', url: '/v8_roman/roman_13.webp' },
        { id: 64, type: 'image', category: 'ROMAN REALISM', format: '16:9', title: 'Impenetrable Scutum Wall', url: '/v8_roman/roman_14.webp' },
        { id: 65, type: 'video', category: 'ROMAN REALISM', format: '16:9', title: 'Epic Testudo Formation', url: 'LINK_ROMAN_VID_H1' },
        { id: 66, type: 'video', category: 'ROMAN REALISM', format: '16:9', title: 'Colosseum Sand Cinematic', url: 'LINK_ROMAN_VID_H2' },
        { id: 67, type: 'video', category: 'ROMAN REALISM', format: '9:16', title: 'Praetorian Guard Elite', url: '/v8_roman/v8_pretorian.mp4' },
        { id: 68, type: 'video', category: 'ROMAN REALISM', format: '9:16', title: 'Gladius Edge Reel', url: 'LINK_ROMAN_VID_V2' },

        // --- CINEMATIC MOTION ---
        { id: 23, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'V8 Luxury Smartwatch', url: '/v8_video_16_9/v8_smart_watch.mp4' }, 
        { id: 26, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Galaxy Smartwatch Promo', url: '/v8_video_16_9/Smart_Watch_16_9.mp4' }, 
        { id: 32, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Classic Cobra Desert Drift', url: '/v8_video_16_9/v8_mix.mp4' }, 
        { id: 24, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Nike Neon Frequency', url: '/v8_video_16_9/Nike_Woman.mp4' }, 
        { id: 80, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Nike Air Defiance', url: '/v8_video_16_9/v8_nike_1.mp4' }, 
        { id: 81, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Nike Cybernetic Stride', url: '/v8_video_16_9/v8_nike_2.mp4' }, 
        { id: 82, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Nike Neon Velocity', url: '/v8_video_16_9/v8_nike_3.mp4' }, 
        { id: 83, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Jordan Urban Ascension', url: '/v8_video_16_9/v8_jordan_1.mp4' }, 
        { id: 30, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Mangorax Cinematic Splash', url: '/v8_video_16_9/v8_orange_brutal.mp4' }, 
        { id: 33, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Glacial Clockwork Dynamics', url: '/v8_video_16_9/v8_ice.mp4' }, 
        { id: 25, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Neon Blue Cinematic Walk', url: '/v8_video_16_9/Neon_Blue_Girl.mp4' }, 
        { id: 31, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'BMW X8 Black Edition', url: '/v8_video_16_9/v8_BMW_x7.mp4' }, 
        { id: 34, type: 'video', category: 'CINEMATIC MOTION', format: '16:9', title: 'Adidas Alpine Expedition', url: '/v8_video_16_9/v8_ranac.mp4' },

        // --- UNDERWATER MARINE LIFE ---
        { id: 37, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Abyssal Reef Discovery', url: '/okean/u_01.webp' },
        { id: 38, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Bioluminescent Depths', url: '/okean/u_02.webp' },
        { id: 39, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Apex Predator Shadows', url: '/okean/u_03.webp' },
        { id: 40, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Sunken Ancient Ruins', url: '/okean/u_04.webp' },
        { id: 41, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Neon Jellyfish Bloom', url: '/okean/u_05.webp' },
        { id: 42, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Crystal Ocean Shallows', url: '/okean/u_06.webp' },
        { id: 43, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Volcanic Ridge Expedition', url: '/okean/u_07.webp' },
        { id: 44, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Majestic Whale Shark Encounter', url: '/okean/u_08.webp' },
        { id: 45, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Deep Sea Leviathan Watch', url: '/okean/u_09.webp' },
        { id: 46, type: 'image', category: 'UNDERWATER MARINE LIFE', format: '16:9', title: 'Oceanic Trench Exploration', url: '/okean/u_010.webp' },
    ];
    // --- KRAJ: TVOJI STARI HARDKODOVANI ITEMI ---

    // POČETAK FUNKCIJE: useEffect (Fetch Firebase Items)
    useEffect(() => {
        const q = query(collection(db, "v8_showroom_baza"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFirebaseItems(items);
        });
        return () => unsubscribe();
    }, []);
    // KRAJ FUNKCIJE: useEffect (Fetch Firebase Items)

    // 🔥 OVDE SPAJAMO NOVE FAJLOVE (IZ BAZE) SA TVOJIM STARIM (IZ KODA) 🔥
    const showcaseItems = [...firebaseItems, ...hardcodedItems];

    // POČETAK FUNKCIJE: filters array
    const filters = [
        { 
            name: 'ALL', icon: Globe, 
            active: 'bg-gradient-to-r from-orange-600/20 to-amber-500/10 border-orange-500/60 text-orange-400 shadow-[0_0_20px_rgba(234,88,12,0.3)]', 
            hover: 'hover:border-orange-500/50 hover:text-orange-400 hover:shadow-[0_0_15px_rgba(234,88,12,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(234,88,12,0.8)]'
        },
        { 
            name: 'LUXURY CULINARY', icon: Utensils, 
            active: 'bg-gradient-to-r from-rose-600/20 to-red-500/10 border-rose-500/60 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]', 
            hover: 'hover:border-rose-500/50 hover:text-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
        },
        { 
            name: 'ICE FRUIT FUSION', icon: Droplets, 
            active: 'bg-gradient-to-r from-cyan-600/20 to-teal-500/10 border-cyan-500/60 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]', 
            hover: 'hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
        },
        { 
            name: 'TECH & GADGETS', icon: Cpu, 
            active: 'bg-gradient-to-r from-blue-600/20 to-indigo-500/10 border-blue-500/60 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.3)]', 
            hover: 'hover:border-blue-500/50 hover:text-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]'
        },
        { 
            name: 'ABSTRACT TECH', icon: Hexagon, 
            active: 'bg-gradient-to-r from-fuchsia-600/20 to-purple-500/10 border-fuchsia-500/60 text-fuchsia-400 shadow-[0_0_20px_rgba(217,70,239,0.3)]', 
            hover: 'hover:border-fuchsia-500/50 hover:text-fuchsia-400 hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]'
        },
        { 
            name: 'CINEMATIC MOTION', icon: Film, 
            active: 'bg-gradient-to-r from-amber-600/20 to-yellow-500/10 border-amber-500/60 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]', 
            hover: 'hover:border-amber-500/50 hover:text-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
        },
        { 
            name: 'ROMAN REALISM', icon: Shield, 
            active: 'bg-gradient-to-r from-red-700/20 to-red-600/10 border-red-600/60 text-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]', 
            hover: 'hover:border-red-600/50 hover:text-red-500 hover:shadow-[0_0_15px_rgba(220,38,38,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]'
        },
        { 
            name: 'SPACES & ARCHITECTURE', icon: Building2, 
            active: 'bg-gradient-to-r from-emerald-600/20 to-green-500/10 border-emerald-500/60 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]', 
            hover: 'hover:border-emerald-500/50 hover:text-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
        },
        { 
            name: 'PRODUCT & MACRO', icon: Aperture, 
            active: 'bg-gradient-to-r from-violet-600/20 to-indigo-500/10 border-violet-500/60 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]', 
            hover: 'hover:border-violet-500/50 hover:text-violet-400 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]'
        },
        { 
            name: 'LUXURY LIFESTYLE', icon: Gem, 
            active: 'bg-gradient-to-r from-yellow-500/20 to-amber-400/10 border-yellow-400/60 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]', 
            hover: 'hover:border-yellow-400/50 hover:text-yellow-300 hover:shadow-[0_0_15px_rgba(250,204,21,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]'
        },
        { 
            name: 'UNDERWATER MARINE LIFE', icon: Waves, 
            active: 'bg-gradient-to-r from-sky-600/20 to-blue-500/10 border-sky-500/60 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]', 
            hover: 'hover:border-sky-500/50 hover:text-sky-400 hover:shadow-[0_0_15px_rgba(14,165,233,0.2)]',
            glow: 'drop-shadow-[0_0_8px_rgba(14,165,233,0.8)]'
        }
    ];
    // KRAJ FUNKCIJE: filters array

    const filteredItems = activeFilter === 'ALL' ? showcaseItems : showcaseItems.filter(item => item.category === activeFilter);

    // POČETAK FUNKCIJE: handleOpenStore
    const handleOpenStore = () => {
        window.scrollTo(0, 0); 
        navigate('/stock');    
    };
    // KRAJ FUNKCIJE: handleOpenStore
    
    return (
        <div className="min-h-screen bg-[#050505] pt-32 pb-24 px-6 font-sans text-white overflow-hidden">
            {/* HERO SEKCIJA */}
            <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative w-full max-w-7xl mx-auto mb-24 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(255,140,0,0.15)]"
            >
                <div 
                    className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-70"
                    style={{ backgroundImage: "url('/v8-showroom/v8-hero.png')" }} 
                ></div>
                
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/60 to-[#050505]"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]"></div>

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

            {/* FILTERI SA INDIVIDUALNIM BOJAMA */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mb-16 max-w-6xl mx-auto relative z-10"
            >
                {filters.map((filter) => {
                    const isActive = activeFilter === filter.name;
                    return (
                        <motion.button 
                            key={filter.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(filter.name)}
                            className={`group flex items-center gap-2.5 px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all duration-300 border backdrop-blur-md cursor-pointer ${
                                isActive 
                                ? filter.active 
                                : `bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 ${filter.hover}`
                            }`}
                        >
                            <filter.icon 
                                size={15} 
                                className={`transition-all duration-300 ${
                                    isActive ? filter.glow : 'opacity-60 group-hover:opacity-100'
                                }`} 
                            />
                            {filter.name}
                        </motion.button>
                    );
                })}
            </motion.div>

            {/* MASONRY GALERIJA */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
                <AnimatePresence>
                    {filteredItems.map((item, index) => (
                        <motion.div 
                            key={item.id} 
                            initial={{ opacity: 0, y: 80 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: (index % 10) * 0.05 }}
                            onClick={() => navigate('/media', { state: { item } })}
                            className="relative group rounded-3xl overflow-hidden bg-[#0a0a0a] border border-white/5 cursor-pointer break-inside-avoid transform transition-transform duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,140,0,0.15)] z-50"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#FF8C00]/0 via-[#FF8C00]/0 to-[#FF8C00]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-30"></div>

                            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                                <span className="bg-black/80 backdrop-blur-md border border-white/10 text-white px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-wider flex items-center gap-1.5">
                                    <MonitorSmartphone size={12} className="text-[#FF8C00]" /> {item.format}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4 z-20">
                                <span className="bg-blue-900/90 backdrop-blur-md border border-red-600 text-red-500 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.8)]">
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
                                        
                                        {item.url.includes('LINK_') ? (
                                            <div className={`w-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-black tracking-widest ${item.format === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                                                {item.format} VIDEO PLACEHOLDER
                                            </div>
                                        ) : (
                                            <video 
                                                src={`${item.url}#t=0.001`} 
                                                preload="metadata" 
                                                muted
                                                controls={false} 
                                                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out ${item.format === '9:16' ? 'aspect-[9/16]' : 'aspect-video'}`}
                                                onContextMenu={(e) => e.preventDefault()} 
                                            />
                                        )}
                                    </>
                                ) : (
                                    <img 
                                        src={item.url.includes('LINK_') ? `https://placehold.co/1920x1080/0a0a0a/444?text=${item.title}` : item.url} 
                                        alt={item.title} 
                                        loading="lazy" 
                                        className="w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                                        onContextMenu={(e) => e.preventDefault()} 
                                        onDragStart={(e) => e.preventDefault()} 
                                    />
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
        </div>
    );
};
// KRAJ FUNKCIJE: V8Showroom

export default V8Showroom;
// KRAJ FAJLA: V8Showroom.jsx