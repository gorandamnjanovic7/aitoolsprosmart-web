// --- IMAGE IMPORTS ---
import zmajImg from './zmaj.jpg';
import novaSlikaImg from './nova-slika.png';
import slikaHubImg from './slika-hub.jpeg';
import slikaCopyImg from './slika-copy.jpeg';
import hollywoodImg from './hollywood.png';
import slikaVideoImg from './slika-video.jpeg';
import mojLogo from './logo.png';

// --- CLOUDINARY CONFIGURATION ---
// FIKSIRANO: Ubačeno ispravno ime tvog naloga (drllxycnh)
export const CLOUDINARY_CLOUD_NAME = "drllxycnh"; 
export const CLOUDINARY_UPLOAD_PRESET = "uploads1"; 

// --- BRANDING ASSETS ---
export const logoUrl = mojLogo; 
export const bannerUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

// --- BANNER / HERO SLIDER DATA ---
export const BANNER_DATA = [
  {
    url: slikaHubImg,
    badge: "CORE AI HUB",
    title: "Welcome to Our Hub",
    subtitle: "Command center for data control and generating complex AI architectures."
  },
  {
    url: zmajImg,
    badge: "DRAGON PROTOCOL",
    title: "ANCIENT EMPIRES REBORN",
    subtitle: "Generate epic, hyper-realistic scenes with dragons and mythical creatures in 8K resolution."
  },
  {
    url: novaSlikaImg,
    badge: "TIME TRAVELER",
    title: "UNIQUE PHOTO REALISTIC IMAGES",
    subtitle: "Merging incompatible historical eras using advanced AI Prompt engines."
  },
  {
    url: slikaCopyImg,
    badge: "CYBER STEALTH",
    title: "GHOST IN THE MACHINE",
    subtitle: "Professional prompts for digital art and high-detail cyberpunk visuals."
  },
  {
    url: slikaVideoImg,
    badge: "WARP SPEED",
    title: "TEMPORAL MOTION ENGINE",
    subtitle: "Optimized for ultra-fast generation of AI video content with fluid motion."
  },
  {
    url: hollywoodImg,
    badge: "WINTER PROTOCOL",
    title: "HOLLYWOOD VFX GRADE",
    subtitle: "Epic cinematic battles and CGI-level detail for your video and photo projects."
  }
];

// --- TUTORIALS (LATEST INTEL PROTOCOLS) ---
export const MY_VIDEOS = [
  {
    id: "dQw4w9WgXcQ",
    title: "PROTOCOL: How to install React Source Code",
    fallbackDesc: "Guide for setting up the development environment and deployment to Netlify."
  }
];

// --- INITIAL ASSETS (LOCAL FALLBACK DATA) ---
export const INITIAL_APPS = [
  {
    id: "1",
    name: "Monument Architect",
    type: "AI PROMPT GENERATOR",
    price: "49",
    priceLifetime: "149",
    headline: "System protocol for massive digital sculptures and architecture.",
    description: "VALUE MULTIPLIER:\n* 880,000+ unique combinations\n* Optimized for Midjourney & Flux.1\n* Commercial license included",
    media: [
      { url: zmajImg, type: 'image' }
    ],
    whopLink: "https://whop.com/ai-tools-pro-smart[SPLIT]https://whop.com/checkout/react-source-code-monument",
    faq: [
      { question: "V8 Architecture", answer: "Triple-injection protocol for high-fidelity output." }
    ]
  }
];