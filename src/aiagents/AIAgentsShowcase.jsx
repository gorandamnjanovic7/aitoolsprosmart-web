// START OF FILE: AIAgentsShowcase.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Briefcase, Cpu, Maximize, Zap, ScanLine, Sparkles, Award, 
  Terminal, Aperture, Clapperboard, Code, ShieldCheck, MonitorPlay, 
  Video, Image as ImageIcon, LayoutGrid, X, Megaphone, Users, 
  Mail, Search, Globe, LineChart, MessageCircle, Phone, FileText, CheckCircle,
  ShoppingCart, RefreshCw, MessageSquare, Instagram, Receipt, PenTool, 
  Database, PhoneCall, Headphones, Building
} from 'lucide-react';

// Data from NextPageHub
const upscalers = [
  { path: '/v8-standard-16mp', name: '16MP Standard', desc: 'V8 Engine', icon: ImageIcon, color: 'text-blue-500', bg: 'bg-blue-500/20', hover: 'group-hover:bg-blue-500/40', border: 'border-blue-500/30' },
  { path: '/master-33mp', name: '33.2MP Master', desc: 'Premium Upscaler', icon: Cpu, color: 'text-yellow-500', bg: 'bg-yellow-500/20', hover: 'group-hover:bg-yellow-500/40', border: 'border-yellow-500/30' },
  { path: '/master-45mp', name: '45MP Extreme', desc: 'Pro Marketplace', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/20', hover: 'group-hover:bg-amber-500/40', border: 'border-amber-500/30' },
  { path: '/master-60mp', name: '60MP MAX', desc: 'God Tier Resolution', icon: Cpu, color: 'text-rose-500', bg: 'bg-rose-500/20', hover: 'group-hover:bg-rose-500/40', border: 'border-rose-500/30' }
];

const masterTools = [
  { path: '/enxance', name: '10X VIZION', desc: 'Premium AI Engine', icon: Sparkles, color: 'text-orange-500', bg: 'bg-orange-500/20', hover: 'group-hover:bg-orange-500/40', border: 'border-orange-500/30' },
  { path: '/#marketplace', name: 'AI STORE', desc: 'Asset Marketplace', icon: Award, color: 'text-blue-500', bg: 'bg-blue-500/20', hover: 'group-hover:bg-blue-500/40', border: 'border-blue-500/30' },
  { path: '/neural-forge', name: 'NEURAL FORGE', desc: 'Visual Synthesizer', icon: Terminal, color: 'text-cyan-500', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/30' },
  { path: '/raw-reality', name: 'RAW REALITY', desc: 'Anti-Aesthetic Generator', icon: Aperture, color: 'text-orange-500', bg: 'bg-orange-500/20', hover: 'group-hover:bg-orange-500/40', border: 'border-orange-500/30' },
  { path: '/grid-system', name: 'V8 CINEMATIK', desc: 'Cinematic Matrix Gen', icon: Clapperboard, color: 'text-yellow-500', bg: 'bg-yellow-500/20', hover: 'group-hover:bg-yellow-500/40', border: 'border-yellow-500/30' },
  { path: '/extractor', name: 'JSON EXTRACTOR', desc: 'Visual DNA Engine', icon: Code, color: 'text-cyan-500', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/30' },
  { path: '/v8-debranding-extractor', name: 'DE-BRANDING DNA', desc: 'White-Label Engine', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/20', hover: 'group-hover:bg-emerald-500/40', border: 'border-emerald-500/30' },
  { path: '/seedance', name: 'SEEDANCE 2.0', desc: 'Video Engine', icon: MonitorPlay, color: 'text-green-500', bg: 'bg-green-500/20', hover: 'group-hover:bg-green-500/40', border: 'border-green-500/30' },
  { path: '/kling', name: 'KLING 3.0', desc: 'Motion Engine', icon: Video, color: 'text-red-500', bg: 'bg-red-500/20', hover: 'group-hover:bg-red-500/40', border: 'border-red-500/30' },
];

// DODATNI AGENTI SA TAČNIM CENAMA IZ TABELE (PREVEDENO NA ENGLESKI)
const aiAgentsList = [
  // Original Agents
  { id: 'campaign-agent', name: 'Omnichannel Campaign & Content Agent', shortDesc: 'Marketing Automation', longDesc: 'Automatically generates complete marketing campaigns (ads, posts, blogs, emails) from a single brief, reducing writing time by 80%.', whiteLabelPrice: '$3,000 – $5,000', setupPrice: '$99 – $249', monthlyPrice: '$29 – $99', cloudPrice: '$39', icon: Megaphone, colorTheme: 'cyan' },
  { id: 'b2b-lead-agent', name: 'Smart B2B Lead Generator & Chatbot', shortDesc: 'Lead Qualification & Booking', longDesc: 'Conducts deep contextual conversations on your site, qualifies leads, and automatically schedules client meetings 24/7.', whiteLabelPrice: '$4,000 – $7,000', setupPrice: '$149 – $299', monthlyPrice: '$79 – $149', cloudPrice: '$59', icon: Users, colorTheme: 'emerald' },
  { id: 'mockup-agent', name: 'AI Mockup & Visual Asset Generator', shortDesc: 'Photorealistic Mockups', longDesc: 'Transforms raw photos and logos into photorealistic commercial high-resolution mockups without needing Photoshop.', whiteLabelPrice: '$3,500 – $6,000', setupPrice: '$1,000', monthlyPrice: '$299', cloudPrice: '$39', icon: ImageIcon, colorTheme: 'indigo' },
  { id: 'email-triage-agent', name: 'AI Email & CRM Triage Agent', shortDesc: 'Inbox Management', longDesc: 'Integrates into your inbox, filters spam, prioritizes urgent inquiries, and automatically drafts professional client replies.', whiteLabelPrice: '$3,000 – $5,000', setupPrice: '$149 – $399', monthlyPrice: '$79 – $199', cloudPrice: '$29', icon: Mail, colorTheme: 'cyan' },
  { id: 'seo-auditor-agent', name: 'SEO & CRO Website Auditor', shortDesc: 'Technical Analysis', longDesc: 'Scans client URLs for technical errors and conversion barriers, generating a detailed executive PDF report.', whiteLabelPrice: '$3,000 – $4,500', setupPrice: '$99 – $299', monthlyPrice: '$99 – $299', cloudPrice: '$49 – $199/audit', icon: Search, colorTheme: 'emerald' },
  { id: 'video-script-agent', name: 'AI Video & Film Script Agent', shortDesc: 'Content Creation', longDesc: 'Generates complete scripts, shot descriptions, voiceover copy, and video creation prompts for TikTok and Reels.', whiteLabelPrice: '$4,000 – $6,500', setupPrice: '$1,100', monthlyPrice: '$349', cloudPrice: '$49', icon: Clapperboard, colorTheme: 'indigo' },
  { id: 'localization-agent', name: 'Multilingual Localization AI Agent', shortDesc: 'Global Reach', longDesc: 'Translates websites and marketing materials into over 30 languages with full cultural context and local slang adaptation.', whiteLabelPrice: '$3,500 – $6,000', setupPrice: '$1,000', monthlyPrice: '$299', cloudPrice: '$39', icon: Globe, colorTheme: 'cyan' },
  { id: 'market-analysis-agent', name: 'AI Competitor & Market Analysis Agent', shortDesc: 'Strategic Intelligence', longDesc: 'Continuously monitors competitor pricing, ad campaigns, and website updates, delivering structured strategic reports.', whiteLabelPrice: '$5,000 – $8,500', setupPrice: '$199 – $499', monthlyPrice: '$99 – $299', cloudPrice: '$69', icon: LineChart, colorTheme: 'emerald' },
  { id: 'social-manager-agent', name: 'AI Social Media & Community Manager', shortDesc: 'Brand Reputation', longDesc: 'Monitors comments and direct messages, responds in brand tone, and routes sensitive interactions to the human team.', whiteLabelPrice: '$3,000 – $5,000', setupPrice: '$199 – $499', monthlyPrice: '$99 – $299', cloudPrice: '$39', icon: MessageCircle, colorTheme: 'indigo' },
  { id: 'voice-assistant-agent', name: 'AI Voice & Call Assistant', shortDesc: 'Voice Automation', longDesc: 'Handles outbound booking confirmations and incoming customer support calls using natural human voice synthesis.', whiteLabelPrice: '$7,000 – $10,000+', setupPrice: '$2,000', monthlyPrice: '$699', cloudPrice: '$99', icon: Phone, colorTheme: 'cyan' },
  { id: 'legal-contract-agent', name: 'AI Legal Contract Generator', shortDesc: 'Legal Operations', longDesc: 'Instantly drafts precise NDA agreements, commercial invoices, and service contracts based on client parameters.', whiteLabelPrice: '$4,000 – $7,000', setupPrice: '$1,200', monthlyPrice: '$399', cloudPrice: '$59', icon: FileText, colorTheme: 'emerald' },
  { id: 'brand-inspector-agent', name: 'AI Multimodal Brand Inspector', shortDesc: 'Quality Assurance', longDesc: 'Scans design materials and checks compliance with the brand book (colors, typography, logo) prior to final delivery.', whiteLabelPrice: '$3,500 – $6,500', setupPrice: '$1,100', monthlyPrice: '$349', cloudPrice: '$49', icon: CheckCircle, colorTheme: 'indigo' },
  
  // Newly Translated Agents
  { id: 'ecommerce-advisor', name: 'E-commerce Sales Advisor', shortDesc: 'Sales & Recommendations', longDesc: 'Suggests products based on customer needs and increases sales via text and online store integration.', whiteLabelPrice: '$3,500 – $6,000', setupPrice: '$199 – $499', monthlyPrice: '$99 – $249', cloudPrice: '$49', icon: ShoppingCart, colorTheme: 'cyan' },
  { id: 'order-tracking', name: 'Order & Return Tracking Agent', shortDesc: 'Order Management', longDesc: 'Checks order statuses and guides customers through returns or exchanges with full system integration.', whiteLabelPrice: '$4,000 – $6,500', setupPrice: '$249 – $599', monthlyPrice: '$149 – $299', cloudPrice: '$59', icon: RefreshCw, colorTheme: 'emerald' },
  { id: 'whatsapp-agent', name: 'WhatsApp AI Agent', shortDesc: 'WhatsApp Automation', longDesc: 'Responds to customers, collects inquiries, and routes them to the right person directly on WhatsApp.', whiteLabelPrice: '$3,000 – $5,000', setupPrice: '$199 – $499', monthlyPrice: '$99 – $249', cloudPrice: '+ Meta fees', icon: MessageSquare, colorTheme: 'indigo' },
  { id: 'social-dm-agent', name: 'Social Media DM Agent', shortDesc: 'Social DM Automation', longDesc: 'Replies to messages, captures leads, and forwards requests to the team via social media platforms.', whiteLabelPrice: '$3,000 – $5,000', setupPrice: '$199 – $499', monthlyPrice: '$99 – $249', cloudPrice: '+ DM fees', icon: Instagram, colorTheme: 'cyan' },
  { id: 'invoice-agent', name: 'Invoice & Billing Agent', shortDesc: 'Invoice Data Extraction', longDesc: 'Extracts dates, amounts, vendors, and other data from documents using OCR and secure integrations.', whiteLabelPrice: '$4,500 – $7,000', setupPrice: '$249 – $599', monthlyPrice: '$99 – $299', cloudPrice: '$69', icon: Receipt, colorTheme: 'emerald' },
  { id: 'product-desc-agent', name: 'Product Content Generator', shortDesc: 'Content Creation', longDesc: 'Creates titles, descriptions, features, and SEO copy for catalogs via CSV or store integration.', whiteLabelPrice: '$2,500 – $4,500', setupPrice: '$99 – $299', monthlyPrice: '$29 – $99', cloudPrice: '$39', icon: PenTool, colorTheme: 'indigo' },
  { id: 'b2b-crm-assistant', name: 'B2B CRM Sales Assistant', shortDesc: 'CRM Automation', longDesc: 'Updates the CRM, sets reminders, and suggests the next step for leads via CRM/email integration.', whiteLabelPrice: '$5,000 – $8,000', setupPrice: '$249 – $699', monthlyPrice: '$149 – $399', cloudPrice: '$79', icon: Database, colorTheme: 'cyan' },
  { id: 'phone-receptionist', name: 'AI Voice Receptionist', shortDesc: 'Voice Receptionist', longDesc: 'Takes calls, answers FAQs, and routes or schedules appointments using a white-label voice platform.', whiteLabelPrice: '$6,000 – $9,000', setupPrice: '$199 – $499', monthlyPrice: '$199 – $399', cloudPrice: '+ minute usage', icon: PhoneCall, colorTheme: 'emerald' },
  { id: 'lead-followup-voice', name: 'Voice Lead Follow-up Agent', shortDesc: 'Voice Lead Follow-up', longDesc: 'Calls leads who submitted inquiries and attempts to schedule conversations via automated voice platform.', whiteLabelPrice: '$7,000 – $10,000', setupPrice: '$249 – $599', monthlyPrice: '$149 – $399', cloudPrice: '+ minute usage', icon: Headphones, colorTheme: 'indigo' },
  { id: 'real-estate-hospitality', name: 'Real Estate & Hospitality Agent', shortDesc: 'Booking & Availability', longDesc: 'Answers questions about listings, availability, and bookings via text chat or voice channels.', whiteLabelPrice: '$6,500 – $9,500', setupPrice: '$299 – $699', monthlyPrice: '$249 – $499', cloudPrice: '+ voice minutes', icon: Building, colorTheme: 'cyan' }
];

export default function AIAgentsShowcase() {
  const [activeModalAgent, setActiveModalAgent] = useState(null); 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderCard = (item, idx) => {
    const Icon = item.icon;
    return (
      <Link key={idx} to={item.path} className={`bg-[#0a0a0a] border ${item.border} p-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-all flex items-center gap-4 group`}>
        <div className={`${item.bg} p-3 rounded-xl shrink-0 ${item.hover} transition-colors`}>
          <Icon className={`w-6 h-6 ${item.color}`} />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-white truncate">{item.name}</span>
          <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">{item.desc}</span>
        </div>
      </Link>
    );
  }

  const getColorClasses = (theme) => {
    if (theme === 'cyan') return { text: 'text-cyan-400', bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', shadow: 'shadow-[0_0_30px_rgba(8,145,178,0.15)]', button: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30', modalBg: 'bg-cyan-900/50', modalBorder: 'border-cyan-400/60', modalHover: 'hover:bg-cyan-800/60' };
    if (theme === 'emerald') return { text: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', button: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30', modalBg: 'bg-emerald-900/50', modalBorder: 'border-emerald-400/60', modalHover: 'hover:bg-emerald-800/60' };
    if (theme === 'indigo') return { text: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', shadow: 'shadow-[0_0_30px_rgba(79,70,229,0.15)]', button: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30', modalBg: 'bg-indigo-900/50', modalBorder: 'border-indigo-400/60', modalHover: 'hover:bg-indigo-800/60' };
    // Default blue
    return { text: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/30', shadow: 'shadow-[0_0_30px_rgba(37,99,235,0.15)]', button: 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30', modalBg: 'bg-blue-900/50', modalBorder: 'border-blue-400/60', modalHover: 'hover:bg-blue-800/60' };
  };

  // 3 MAIN AGENTS
  const visualConcierge = {
      name: "Visual Concierge",
      shortDesc: "Mockups & UI/UX Routing",
      longDesc: "Transforms raw product photos, logos, or UI designs into photorealistic commercial mockups in high resolution across multiple aspect ratios. Eliminates manual Photoshop rendering.",
      whiteLabelPrice: "$4,000 – $7,000",
      setupPrice: "$99 – $199",
      monthlyPrice: "$49 – $99",
      cloudPrice: "$39",
      icon: Bot,
      colorTheme: 'blue'
  };

  const salesScoper = {
      name: "B2B Sales Scoper",
      shortDesc: "Automated Project Quotes",
      longDesc: "An intelligent agent deployed on client websites that conducts deep contextual conversations, qualifies leads, answers complex product queries, and books appointments automatically.",
      whiteLabelPrice: "$4,000 – $8,000",
      setupPrice: "$149 – $399",
      monthlyPrice: "$99 – $199",
      cloudPrice: "$79", 
      icon: Briefcase,
      colorTheme: 'emerald'
  };

  const techEngineer = {
      name: "Tech 24/7 Engineer",
      shortDesc: "Dev & Infrastructure Support",
      longDesc: "Provides round-the-clock autonomous infrastructure support, resolving technical queries, diagnosing errors, and assisting with development workflows seamlessly.",
      whiteLabelPrice: "$5,000 – $10,000",
      setupPrice: "$1,200",
      monthlyPrice: "$499",
      cloudPrice: "$49", 
      icon: Cpu,
      colorTheme: 'indigo'
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white py-24 px-4 sm:px-6 font-sans relative z-10">
      
      {/* ========================================= */}
      {/* GLOBAL MODAL FOR ALL AGENTS               */}
      {/* ========================================= */}
      {activeModalAgent && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md">
          <div className={`bg-[#06142e] border-2 ${getColorClasses(activeModalAgent.colorTheme).border} rounded-3xl max-w-2xl w-full relative shadow-[0_0_80px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-300 p-6 md:p-8`}>
            <button 
              onClick={() => setActiveModalAgent(null)}
              className="absolute top-5 right-5 text-slate-300 hover:text-white transition-colors bg-slate-800/40 p-2 rounded-full hover:bg-slate-700"
            >
              <X size={24} />
            </button>
            <div className={`flex items-center gap-4 mb-6 border-b ${getColorClasses(activeModalAgent.colorTheme).border} pb-4`}>
              <div className={`w-14 h-14 rounded-2xl ${getColorClasses(activeModalAgent.colorTheme).bg} flex items-center justify-center ${getColorClasses(activeModalAgent.colorTheme).text} border border-white/10 shadow-inner`}>
                <activeModalAgent.icon size={32} />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-wider text-white drop-shadow-md">{activeModalAgent.name}</h2>
                <p className={`${getColorClasses(activeModalAgent.colorTheme).text} text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1`}>{activeModalAgent.shortDesc}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              
              {/* 1. White-label Buyout */}
              <div className={`${getColorClasses(activeModalAgent.colorTheme).modalBg} border ${getColorClasses(activeModalAgent.colorTheme).modalBorder} rounded-xl p-4 md:p-5 ${getColorClasses(activeModalAgent.colorTheme).modalHover} transition-colors`}>
                <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Award className={`w-5 h-5 ${getColorClasses(activeModalAgent.colorTheme).text}`} />
                  1. Full Buyout (White-Label)
                </h4>
                <p className="text-slate-200 text-xs md:text-sm font-medium mb-2">
                  Custom-built AI agent with full transfer of ownership and infrastructure, with no ongoing monthly maintenance fees. {activeModalAgent.longDesc}
                </p>
                <p className={`${getColorClasses(activeModalAgent.colorTheme).text} font-black text-2xl md:text-3xl`}>
                  {activeModalAgent.whiteLabelPrice} <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">/ one-time</span>
                </p>
              </div>
              
              {/* 2. One-Time Setup */}
              <div className="bg-slate-800/60 border border-slate-600/40 rounded-xl p-4 md:p-5 hover:bg-slate-700/70 transition-colors">
                <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  2. One-Time Setup
                </h4>
                <p className="text-slate-300 text-xs md:text-sm font-medium mb-2">
                  Expert integration and implementation directly into your existing website and database architecture.
                </p>
                <p className="text-emerald-400 font-black text-xl md:text-2xl">
                   {activeModalAgent.setupPrice} <span className="text-emerald-500/70 text-[10px] md:text-xs font-bold uppercase tracking-wider">/ one-time</span>
                </p>
              </div>
              
              {/* 3 & 4. Monthly Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#030b1c] border border-slate-700/80 rounded-xl p-4 hover:border-emerald-500/50 transition-colors">
                  <h4 className="text-[11px] md:text-xs font-black text-slate-200 uppercase tracking-wider mb-1">3. Monthly Maintenance</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs mb-2">System monitoring and API coverage.</p>
                  <p className="text-emerald-400 font-black text-lg md:text-xl">{activeModalAgent.monthlyPrice} <span className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase">/ mo</span></p>
                </div>
                
                <div className="bg-[#030b1c] border border-slate-700/80 rounded-xl p-4 hover:border-cyan-400/50 transition-colors">
                  <h4 className="text-[11px] md:text-xs font-black text-slate-200 uppercase tracking-wider mb-1">4. Cloud Access</h4>
                  <p className="text-slate-400 text-[10px] md:text-xs mb-2">Use via our secure platform environment.</p>
                  <p className="text-cyan-400 font-black text-lg md:text-xl">{activeModalAgent.cloudPrice} <span className="text-slate-500 text-[9px] md:text-[10px] font-bold uppercase">/ mo</span></p>
                </div>
              </div>

            </div>
            <button 
              onClick={() => setActiveModalAgent(null)}
              className={`w-full mt-6 ${getColorClasses(activeModalAgent.colorTheme).button} text-white text-sm font-black uppercase tracking-widest py-3 md:py-4 rounded-xl transition shadow-lg`}
            >
              Close Pricing
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto space-y-24">
        
        {/* ========================================= */}
        {/* 3 MAIN AGENTS (TOP SECTION)               */}
        {/* ========================================= */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/20 blur-[100px] pointer-events-none z-0"></div>
            <h1 className="relative z-10 text-3xl sm:text-5xl font-black uppercase tracking-wider mb-4 drop-shadow-[0_0_20px_rgba(8,145,178,0.5)]">
              V10 AI Sales & Support Agents
            </h1>
            <p className="relative z-10 text-slate-400 text-sm sm:text-base font-bold">
              Test our agents live from the cloud or order a turnkey embedding for your own enterprise platform. Trained for full catalog routing and B2B scoping.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Agent 1: Visual Concierge */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#050914] border border-cyan-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(8,145,178,0.15)] h-full justify-center">
                 <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Bot size={32} />
                 </div>
                 <h3 className="text-white font-black text-lg uppercase mb-1">Visual Concierge</h3>
                 <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Mockups & UI/UX Routing</p>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed">
                   Transforms raw product photos, logos, or UI designs into photorealistic commercial mockups in high resolution across multiple aspect ratios. Eliminates manual Photoshop rendering.
                 </p>
              </div>
              <div className="mt-auto">
                <button 
                  onClick={() => setActiveModalAgent(visualConcierge)}
                  className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition shadow-lg shadow-blue-600/30"
                >
                  View Options & Pricing
                </button>
              </div>
            </div>

            {/* Agent 2: B2B Sales Scoper */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#050914] border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] h-full justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-4">
                     <Briefcase size={32} />
                  </div>
                  <h3 className="text-white font-black text-lg uppercase mb-1">B2B Sales Scoper</h3>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">Automated Project Quotes</p>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    An intelligent agent deployed on client websites that conducts deep contextual conversations, qualifies leads, answers complex product queries, and books appointments automatically.
                  </p>
               </div>
               <div className="flex gap-2 mt-auto">
                <Link to="/cloud-agent-scoper" className="flex-1 text-center bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-[10px] sm:text-xs font-bold uppercase py-4 rounded-xl transition">
                  Use Cloud ($79/mo)
                </Link>
                <Link to="/checkout-embed-scoper" className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg shadow-emerald-600/30">
                  Buy & Embed ($1,490)
                </Link>
              </div>
              <button 
                  onClick={() => setActiveModalAgent(salesScoper)}
                  className="w-full text-center mt-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl transition"
              >
                  View Full Pricing Tiers
              </button>
            </div>

            {/* Agent 3: Tech Engineer */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#050914] border border-indigo-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(79,70,229,0.15)] h-full justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 mb-4">
                     <Cpu size={32} />
                  </div>
                  <h3 className="text-white font-black text-lg uppercase mb-1">Tech 24/7 Engineer</h3>
                  <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">Dev & Infrastructure Support</p>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    Provides round-the-clock autonomous infrastructure support, resolving technical queries, diagnosing errors, and assisting with development workflows seamlessly.
                  </p>
               </div>
               <div className="flex gap-2 mt-auto">
                <Link to="/cloud-agent-tech" className="flex-1 text-center bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white text-[10px] sm:text-xs font-bold uppercase py-4 rounded-xl transition">
                  Use Cloud ($49/mo)
                </Link>
                <Link to="/checkout-embed-tech" className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg shadow-indigo-600/30">
                  Buy & Embed ($1,200)
                </Link>
              </div>
              <button 
                  onClick={() => setActiveModalAgent(techEngineer)}
                  className="w-full text-center mt-2 bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-bold uppercase tracking-widest py-2 rounded-xl transition"
              >
                  View Full Pricing Tiers
              </button>
            </div>
          </div>
        </section>

        <hr className="border-white/10" />

        {/* ========================================= */}
        {/* EXTENDED AGENT CATALOG (22 AGENTS)        */}
        {/* ========================================= */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider mb-2 text-slate-200">
              More Autonomous AI Agents
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Explore our full catalog of specialized AI agents for marketing, SEO, legal, and operational automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {aiAgentsList.map((agent) => {
              const themeClasses = getColorClasses(agent.colorTheme);
              return (
                <div key={agent.id} className="flex flex-col gap-4">
                  <div className={`bg-[#050914] border ${themeClasses.border} rounded-3xl p-6 flex flex-col items-center text-center ${themeClasses.shadow} h-full justify-center`}>
                     <div className={`w-16 h-16 rounded-2xl ${themeClasses.bg} flex items-center justify-center ${themeClasses.text} mb-4`}>
                        <agent.icon size={32} />
                     </div>
                     <h3 className="text-white font-black text-lg uppercase mb-1">{agent.name}</h3>
                     <p className={`${themeClasses.text} text-xs font-bold uppercase tracking-widest mb-4`}>{agent.shortDesc}</p>
                     <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-3">
                       {agent.longDesc}
                     </p>
                  </div>
                  <div className="mt-auto">
                    <button 
                      onClick={() => setActiveModalAgent(agent)}
                      className={`w-full text-center ${themeClasses.button} text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition shadow-lg`}
                    >
                      View Options & Pricing
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <hr className="border-white/10" />

        {/* ========================================= */}
        {/* BOTTOM SECTION: V10 SOFTWARE ECOSYSTEM    */}
        {/* ========================================= */}
        <section className="space-y-16">
          <div className="text-center relative">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider mb-2 text-slate-200">
              V10 Software Ecosystem
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Centralized Access to Master Tools, Premium Upscalers, and B2B Systems.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <LayoutGrid className="w-5 h-5"/> V8 MASTER TOOLS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {masterTools.map(renderCard)}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <Maximize className="w-5 h-5"/> MASTER UPSCALERS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {upscalers.map(renderCard)}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
              <ScanLine className="w-5 h-5"/> B2B SYSTEMS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/premium-menu" className="bg-[#0a0a0a] border border-purple-500/40 p-5 rounded-2xl hover:scale-105 hover:shadow-[0_0_25px_rgba(168,85,247,0.3)] transition-all flex items-center gap-4 group">
                <div className="bg-purple-500/20 p-3 rounded-xl shrink-0 group-hover:bg-purple-500/40 transition-colors">
                  <ScanLine className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[12px] md:text-[14px] font-black uppercase tracking-widest text-white truncate">QR BUILDER</span>
                  <span className="text-[9px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest truncate">Premium Menu System</span>
                </div>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
// END OF FILE: AIAgentsShowcase.jsx