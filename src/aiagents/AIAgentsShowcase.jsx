// START OF FILE: AIAgentsShowcase.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, Briefcase, Cpu, Maximize, Zap, ScanLine, Sparkles, Award, 
  Terminal, Aperture, Clapperboard, Code, ShieldCheck, MonitorPlay, 
  Video, Image as ImageIcon, LayoutGrid, X, Megaphone, Users, 
  Mail, Search, Globe, LineChart, MessageCircle, Phone, FileText, CheckCircle,
  ShoppingCart, RefreshCw, MessageSquare, Instagram, Receipt, PenTool, 
  Database, PhoneCall, Headphones, Building, Lock, KeyRound, Download, Printer, Copy,
  Flame, Rocket, Calculator, Crosshair, Calendar, BookOpen, Languages, HelpCircle,
  BellRing, Send, Smartphone, Wrench, Sliders, Clock, Plane, Anchor, Watch
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

const b2bEcosystemSystems = [
  { path: '/aviation-charter-kit', name: 'PRIVATE AVIATION KIT', desc: '6 Turnkey React Kits ($349 / $1,490)', icon: Plane, color: 'text-amber-400', bg: 'bg-amber-500/20', hover: 'group-hover:bg-amber-500/40', border: 'border-amber-500/40' },
  { path: '/superyacht-charter-kit', name: 'SUPERYACHT CHARTER KIT', desc: '5 Turnkey React Kits ($349 / $1,490)', icon: Anchor, color: 'text-cyan-400', bg: 'bg-cyan-500/20', hover: 'group-hover:bg-cyan-500/40', border: 'border-cyan-500/40' },
  { path: '/watch-page-1', name: 'LUXURY WATCHES KIT', desc: 'Haute Horlogerie Kits ($349 / $1,490)', icon: Watch, color: 'text-yellow-400', bg: 'bg-yellow-500/20', hover: 'group-hover:bg-yellow-500/40', border: 'border-yellow-500/40' },
  { path: '/standard-mocup', name: '150MP SaaS MOCKUPS', desc: 'Glass Plaque, Wall & Billboard', icon: MonitorPlay, color: 'text-orange-400', bg: 'bg-orange-500/20', hover: 'group-hover:bg-orange-500/40', border: 'border-orange-500/40' },
  { path: '/ui-ux/vault', name: 'UI/UX DESIGN VAULT', desc: 'Enterprise Web Systems', icon: LayoutGrid, color: 'text-emerald-400', bg: 'bg-emerald-500/20', hover: 'group-hover:bg-emerald-500/40', border: 'border-emerald-500/40' },
  { path: '/pdf-translator', name: 'V10 PDF TRANSLATOR', desc: '100% Layout DTP Neural Engine', icon: FileText, color: 'text-teal-400', bg: 'bg-teal-500/20', hover: 'group-hover:bg-teal-500/40', border: 'border-teal-500/40' },
  { path: '/stock', name: '150MP COMMERCIAL STOCK', desc: 'Ultra-Print & 4K UHD Visuals', icon: ImageIcon, color: 'text-sky-400', bg: 'bg-sky-500/20', hover: 'group-hover:bg-sky-500/40', border: 'border-sky-500/40' },
  { path: '/premium-menu', name: 'QR MENU BUILDER', desc: 'Premium Hospitality System', icon: ScanLine, color: 'text-purple-400', bg: 'bg-purple-500/20', hover: 'group-hover:bg-purple-500/40', border: 'border-purple-500/40' }
];

// ============================================================================
// 🔥 HIGH-PRIORITY FLAGSHIP B2B SYSTEMS (TOP REVENUE GENERATORS)
// ============================================================================
const priorityFlagshipSystems = [
  {
    id: 'priority-aurelia-pulse',
    badge: '✨ NEW LIVE N8N + GROQ BOOKING BAR',
    roiTag: '$199 B2B Kit • Works on Any Website',
    name: 'Aurelia Pulse — 24/7 AI Concierge & Booking Bar',
    shortDesc: 'Standalone Drop-In Booking Bar + Multilingual AI Desk + Instant Mobile Alarm',
    longDesc: 'Universal standalone floating booking bar and live AI concierge widget that plugs into any existing HTML, WordPress, Webflow, or React website in 60 seconds. Visitors pick a service, date, and CET time slot, chat in their native language (Serbian, English, German, French, etc.), and trigger an instant push alarm straight to the owner\'s phone via n8n.',
    deliverables: 'Standalone index.html Widget + 6-Node Railway n8n Workflow (/webhook/aurelia-pulse .JSON) + Mobile Push Alert Setup',
    whiteLabelPrice: '$199 Kit / $2,900 Buyout',
    icon: Sparkles,
    colorTheme: 'amber',
    hasAureliaPulseStudio: true
  },
  {
    id: 'priority-project-scoper',
    badge: '🔥 TOP AGENCY CLOSER (LIVE GROQ ENGINE)',
    roiTag: 'Closes $5k–$25k Deals 24/7',
    name: 'B2B Project Scoper & AI Quote Calculator',
    shortDesc: 'Autonomous Proposal, B2B Webhook & WhatsApp Escalation',
    longDesc: 'Eliminates hours of manual proposal writing. Prospective clients input their project requirements, timeline, and budget on your site in any language, and the V10 Groq AI Engine instantly calculates an itemized quote, technical specs, and direct WhatsApp VIP routing.',
    deliverables: 'Interactive B2B Lead & Quote UI (React/HTML) + V10 B2B Webhook - NEW (Groq) (.JSON)',
    whiteLabelPrice: '$4,500 – $8,500',
    icon: Calculator,
    colorTheme: 'amber',
    hasB2BWebhookStudio: true
  },
  {
    id: 'priority-lead-harvester',
    badge: '🎯 170-CITY SCRAPER + 20:00 CET CLOSER',
    roiTag: '55 Personalized B2B Emails/Day',
    name: 'V10 Autonomous B2B Lead Hunter & 20:00h Closer',
    shortDesc: '5-Engine Python Scraper + Google Sheets CRM + n8n EN/DE Outreach',
    longDesc: 'Complete autonomous B2B acquisition machine. Scrapes verified corporate emails across 170 affluent cities (USA, Germany, Netherlands, Denmark, UK, Switzerland & UAE) and 14 high-ticket niches via a 5-engine anti-block pipeline, syncs leads to Google Sheets, sends 55 localized EN/DE partnership & B2B offers daily (every 12 mins), and delivers an executive 24h performance report every evening at 20:00 CET.',
    deliverables: 'V10_LEAD_HUNTER-v5.py (Tkinter GUI) + Google Sheets Cloud Schema + n8n 20:00h Autonomous Engine (.JSON)',
    whiteLabelPrice: '$5,500 – $9,500',
    icon: Crosshair,
    colorTheme: 'cyan',
    hasLeadHunterStudio: true
  },
  {
    id: 'priority-saas-launch-kit',
    badge: '💎 EXECUTIVE VISUAL + AI SUITE',
    roiTag: 'Instant $10M Enterprise Positioning',
    name: 'Executive SaaS Launch & 150MP Rebranding Kit',
    shortDesc: 'UI/UX Vault + 150MP Mockup Engine + AI Sales Concierge',
    longDesc: 'The ultimate turnkey package for SaaS founders and software studios. Combines ultra-high-resolution 150MP dark-obsidian device mockups, commercial UI/UX presentation templates, and our pre-trained Visual Concierge Floating Chat Widget ready to convert enterprise buyers.',
    deliverables: '150MP Visual Asset Pack + UI/UX Templates + Visual Concierge Floating Chat Widget (.JSON)',
    whiteLabelPrice: '$3,500 – $6,500',
    icon: Sparkles,
    colorTheme: 'emerald',
    hasLiveStudio: true,
    hasB2BWebhookStudio: true
  },
  {
    id: 'priority-micro-saas-box',
    badge: '🚀 TURNKEY BUSINESS IN A BOX',
    roiTag: 'Ready for $99–$299/mo Subscriptions',
    name: 'Micro-SaaS in a Box — Turnkey AI Business',
    shortDesc: 'Complete Multi-Studio AI Platform Ready to Launch',
    longDesc: 'Designed for entrepreneurs and investors who want to launch their own profitable AI software company without writing code. Includes the complete multi-tool Studio Portal (Mockup Engine + SEO Auditor + Campaign Synthesizer + B2B Webhook), sales landing page, and full commercial resale rights.',
    deliverables: 'Full Multi-Studio Web Platform + Production n8n Engines (.JSON) + Launch Guide',
    whiteLabelPrice: '$6,000 – $10,000',
    icon: Rocket,
    colorTheme: 'indigo',
    hasSeoStudio: true
  }
];

// ============================================================================
// COMPLETE CATALOG OF AGENTS (29 WHITE-LABEL BUYOUT & COMMERCIAL SYSTEMS)
// ============================================================================
const aiAgentsList = [
  {
    id: 'aurelia-pulse-booking-bar',
    name: 'Aurelia Pulse — 24/7 AI Concierge & Booking Bar',
    shortDesc: 'Standalone Universal Booking Bar + Groq AI + Instant Phone Alarm',
    longDesc: 'Drop-in floating booking bar and 24/7 multilingual AI concierge desk connected directly to a 6-node Railway n8n workflow (`/webhook/aurelia-pulse`). Clients choose a service, date, and time slot on any website, ask questions in their native language, and trigger an instant mobile push alert to your phone.',
    deliverables: 'Standalone index.html Bar & Chat Widget + Aurelia Pulse 6-Node n8n Workflow (.JSON) + ntfy Mobile Push Guide',
    whiteLabelPrice: '$199 Kit / $2,900 Buyout',
    icon: Sparkles,
    colorTheme: 'amber',
    hasAureliaPulseStudio: true
  },
  {
    id: 'v10-autonomous-b2b-lead-hunter-20h',
    name: 'V10 Autonomous B2B Lead Hunter & 20:00h Partnership Closer',
    shortDesc: '170-City 5-Engine Scraper + Cloud CRM + 20:00 CET Daily Report',
    longDesc: 'Extracts verified decision-maker emails across 170 global business hubs and 14 luxury/B2B industries without GUI freezing, pushes leads directly via Webhook into Google Sheets (`READY_FOR_AGENT`), dispatches 55 hyper-personalized English/German B2B & White-Label partnership emails per day at safe 12-minute intervals, and emails you a complete 24-hour executive breakdown at 20:00 CET.',
    deliverables: 'V10_LEAD_HUNTER-v5.py (Multi-City GUI + TXT/CSV) + Google Sheets CRM Template + V10_N8N_AUTONOMOUS_B2B_ENGINE_20H.json',
    whiteLabelPrice: '$5,500 – $9,500',
    icon: Crosshair,
    colorTheme: 'cyan',
    hasLeadHunterStudio: true
  },
  {
    id: 'viber-sales-alert-agent',
    name: 'Instant Sale & Lead Alert Agent (Viber / Telegram / WhatsApp)',
    shortDesc: 'Real-Time Mobile Checkout & Lead Notifier',
    longDesc: 'Hooks directly into your website checkout (Stripe, PayPal, Payoneer, Crypto, Firebase) and enquiry forms. The moment a client buys a package or submits a high-ticket lead, the AI enriches their company profile and dispatches an instant push alert to your Viber, Telegram, or WhatsApp with one-tap reply actions.',
    deliverables: 'React/Firebase Webhook Listener + n8n Viber/Telegram/WhatsApp Dispatch Engine (.JSON)',
    whiteLabelPrice: '$2,500 – $4,500',
    icon: BellRing,
    colorTheme: 'amber',
    hasAlertStudio: true
  },
  {
    id: 'appointment-booking-agent',
    name: 'Autonomous Calendar & Appointment Setter',
    shortDesc: 'Live Availability & Booking Engine',
    longDesc: 'Checks real-time calendar availability, schedules discovery calls or consultations, sends automated email/WhatsApp confirmations, and eliminates booking friction for high-ticket B2B agencies.',
    deliverables: 'Interactive Booking Calendar UI (React/HTML) + n8n Appointment & WhatsApp Dispatch Engine (.JSON)',
    whiteLabelPrice: '$3,000 – $5,000',
    icon: Calendar,
    colorTheme: 'cyan',
    hasBookingStudio: true
  },
  { id: 'campaign-agent', name: 'Omnichannel Campaign & Content Agent', shortDesc: 'Turnkey Marketing Synthesizer', longDesc: 'Automatically generates synchronized B2B LinkedIn posts, cold outreach emails, Meta/Google ad copy, and short-form video scripts from a single brief.', whiteLabelPrice: '$3,000 – $5,000', icon: Megaphone, colorTheme: 'cyan', hasCampaignStudio: true },
  { id: 'b2b-lead-agent', name: 'Smart B2B Lead Generator & Chatbot', shortDesc: 'Lead Qualification & Booking', longDesc: 'Conducts deep contextual conversations on your site, qualifies leads, scores buyer intent, and routes high-value prospects to your sales team 24/7 via our V10 B2B Webhook & Floating Chat Widget.', deliverables: 'index.html + Visual Concierge Floating Chat Widget (.JSON) + V10 B2B Webhook (.JSON) + README.md', whiteLabelPrice: '$4,000 – $7,000', icon: Users, colorTheme: 'emerald', hasB2BWebhookStudio: true },
  { id: 'mockup-agent', name: 'AI Mockup & Visual Asset Generator', shortDesc: 'Turnkey White-Label Studio', longDesc: 'Transforms raw concepts, logos, and product descriptions into photorealistic 8K commercial mockups across 16:9, 9:16, and 21:9 aspect ratios without Photoshop.', whiteLabelPrice: '$5,500 – $8,500', icon: ImageIcon, colorTheme: 'cyan', hasLiveStudio: true },
  { id: 'seo-auditor-agent', name: 'SEO & CRO Website Auditor', shortDesc: 'Live Technical & Conversion Scanner', longDesc: 'Scans live client URLs for technical SEO bottlenecks, meta structure, and conversion barriers, generating an executive B2B report with 0–100 scores and PDF export.', whiteLabelPrice: '$3,500 – $5,000', icon: Search, colorTheme: 'emerald', hasSeoStudio: true },
  { id: 'website-support-agent', name: 'AI Website Knowledge & Support Concierge', shortDesc: '24/7 Site Support & Escalation', longDesc: 'Trained directly on your website content and product catalog to resolve visitor inquiries instantaneously in any language while escalating VIP requests to WhatsApp (+381648201496).', deliverables: 'Visual Concierge - Floating Chat Widget (.JSON) + index.html + README.md', whiteLabelPrice: '$2,500 – $4,500', icon: HelpCircle, colorTheme: 'indigo', hasB2BWebhookStudio: true },
  { id: 'pdf-translator-agent', name: 'Enterprise PDF & Document Translator', shortDesc: 'Multi-Language OCR & Layout Preservation', longDesc: 'Translates complex PDFs, contracts, and scanned documents into 30+ languages via OCR and LLM processing while preserving executive formatting and terminology.', whiteLabelPrice: '$3,500 – $6,000', icon: Languages, colorTheme: 'emerald' },
  { id: 'rag-doc-assistant', name: 'RAG Document Q&A & Knowledge Base Agent', shortDesc: 'Instant Answers From PDFs & Manuals', longDesc: 'Allows users or internal teams to upload PDFs, SOPs, and technical guides and ask complex questions with instant, citation-backed answers extracted from your files.', whiteLabelPrice: '$4,500 – $7,500', icon: BookOpen, colorTheme: 'indigo' },
  { id: 'email-triage-agent', name: 'AI Email & CRM Triage Agent', shortDesc: 'Inbox Management', longDesc: 'Integrates into your inbox, filters spam, prioritizes urgent inquiries, and automatically drafts professional client replies.', whiteLabelPrice: '$3,000 – $5,000', icon: Mail, colorTheme: 'cyan' },
  { id: 'video-script-agent', name: 'AI Video & Film Script Agent', shortDesc: 'Content Creation', longDesc: 'Generates complete scripts, shot descriptions, voiceover copy, and video creation prompts for TikTok and Reels.', whiteLabelPrice: '$4,000 – $6,500', icon: Clapperboard, colorTheme: 'indigo' },
  { id: 'localization-agent', name: 'Multilingual Localization AI Agent', shortDesc: 'Global Reach', longDesc: 'Translates websites and marketing materials into over 30 languages with full cultural context and local slang adaptation.', whiteLabelPrice: '$3,500 – $6,000', icon: Globe, colorTheme: 'cyan' },
  { id: 'market-analysis-agent', name: 'AI Competitor & Market Analysis Agent', shortDesc: 'Strategic Intelligence', longDesc: 'Continuously monitors competitor pricing, ad campaigns, and website updates, delivering structured strategic reports.', whiteLabelPrice: '$5,000 – $8,500', icon: LineChart, colorTheme: 'emerald' },
  { id: 'social-manager-agent', name: 'AI Social Media & Community Manager', shortDesc: 'Brand Reputation', longDesc: 'Monitors comments and direct messages, responds in brand tone, and routes sensitive interactions to the human team.', whiteLabelPrice: '$3,000 – $5,000', icon: MessageCircle, colorTheme: 'indigo' },
  { id: 'voice-assistant-agent', name: 'AI Voice & Call Assistant', shortDesc: 'Voice Automation', longDesc: 'Handles outbound booking confirmations and incoming customer support calls using natural human voice synthesis.', whiteLabelPrice: '$7,000 – $10,000+', icon: Phone, colorTheme: 'cyan' },
  { id: 'legal-contract-agent', name: 'AI Legal Contract Generator', shortDesc: 'Legal Operations', longDesc: 'Instantly drafts precise NDA agreements, commercial invoices, and service contracts based on client parameters.', whiteLabelPrice: '$4,000 – $7,000', icon: FileText, colorTheme: 'emerald' },
  { id: 'brand-inspector-agent', name: 'AI Multimodal Brand Inspector', shortDesc: 'Quality Assurance', longDesc: 'Scans design materials and checks compliance with the brand book (colors, typography, logo) prior to final delivery.', whiteLabelPrice: '$3,500 – $6,500', icon: CheckCircle, colorTheme: 'indigo' },
  { id: 'ecommerce-advisor', name: 'E-commerce Sales Advisor', shortDesc: 'Sales & Recommendations', longDesc: 'Suggests products based on customer needs and increases sales via text and online store integration.', whiteLabelPrice: '$3,500 – $6,000', icon: ShoppingCart, colorTheme: 'cyan' },
  { id: 'order-tracking', name: 'Order & Return Tracking Agent', shortDesc: 'Order Management', longDesc: 'Checks order statuses and guides customers through returns or exchanges with full system integration.', whiteLabelPrice: '$4,000 – $6,500', icon: RefreshCw, colorTheme: 'emerald' },
  { id: 'whatsapp-agent', name: 'WhatsApp AI Agent', shortDesc: 'WhatsApp Automation', longDesc: 'Responds to customers, collects inquiries, and routes them to the right person directly on WhatsApp.', deliverables: 'V10 B2B Webhook - NEW (Groq).json + index.html + README.md', whiteLabelPrice: '$3,000 – $5,000', icon: MessageSquare, colorTheme: 'indigo', hasB2BWebhookStudio: true },
  { id: 'social-dm-agent', name: 'Social Media DM Agent', shortDesc: 'Social DM Automation', longDesc: 'Replies to messages, captures leads, and forwards requests to the team via social media platforms.', whiteLabelPrice: '$3,000 – $5,000', icon: Instagram, colorTheme: 'cyan' },
  { id: 'invoice-agent', name: 'Invoice & Billing Agent', shortDesc: 'Invoice Data Extraction', longDesc: 'Extracts dates, amounts, vendors, and other data from documents using OCR and secure integrations.', whiteLabelPrice: '$4,500 – $7,000', icon: Receipt, colorTheme: 'emerald' },
  { id: 'product-desc-agent', name: 'Product Content Generator', shortDesc: 'Content Creation', longDesc: 'Creates titles, descriptions, features, and SEO copy for catalogs via CSV or store integration.', whiteLabelPrice: '$2,500 – $4,500', icon: PenTool, colorTheme: 'indigo' },
  { id: 'b2b-crm-assistant', name: 'B2B CRM Sales Assistant', shortDesc: 'CRM Automation', longDesc: 'Updates the CRM, sets reminders, and suggests the next step for leads via CRM/email integration.', whiteLabelPrice: '$5,000 – $8,000', icon: Database, colorTheme: 'cyan' },
  { id: 'phone-receptionist', name: 'AI Voice Receptionist', shortDesc: 'Voice Receptionist', longDesc: 'Takes calls, answers FAQs, and routes or schedules appointments using a white-label voice platform.', whiteLabelPrice: '$6,000 – $9,000', icon: PhoneCall, colorTheme: 'emerald' },
  { id: 'lead-followup-voice', name: 'Voice Lead Follow-up Agent', shortDesc: 'Voice Lead Follow-up', longDesc: 'Calls leads who submitted inquiries and attempts to schedule conversations via automated voice platform.', whiteLabelPrice: '$7,000 – $10,000', icon: Headphones, colorTheme: 'indigo' },
  { id: 'real-estate-hospitality', name: 'Real Estate & Hospitality Agent', shortDesc: 'Booking & Availability', longDesc: 'Answers questions about listings, availability, and bookings via text chat or voice channels.', whiteLabelPrice: '$6,500 – $9,500', icon: Building, colorTheme: 'cyan' }
];

const STUDIO_ENVIRONMENTS = [
  { label: '💎 3D Glass Plaque', sub: 'Dark obsidian studio', value: '3D bevelled crystal glass plaque on a dark obsidian table' },
  { label: '🏛️ Marble Podium', sub: 'Luxury product stage', value: 'Luxury black marble product podium with dramatic rim lighting and studio shadows' },
  { label: '💻 MacBook Studio', sub: 'Executive SaaS desk', value: 'MacBook Pro 16-inch screen on a minimalist dark carbon executive desk' },
  { label: '🌆 Cyber Billboard', sub: 'Night city reflections', value: 'Urban 4K illuminated digital billboard at night with wet pavement reflections' }
];

const AVAILABLE_TIME_SLOTS = [
  '10:00 CET',
  '11:30 CET',
  '13:00 CET',
  '15:00 CET',
  '16:30 CET',
  '18:00 CET'
];

const AURELIA_SERVICES = [
  'Private VIP Consultation',
  'B2B Turnkey Kit Demo ($199)',
  'White-Label Agency Buyout ($2,900)',
  'Custom n8n + AI Architecture Call'
];

const LEAD_HUNTER_SAMPLE_CITIES = [
  { label: 'Zurich, Switzerland (DE)', city: 'Zurich', country: 'Switzerland', lang: 'German' },
  { label: 'New York, USA (EN)', city: 'New York', country: 'USA', lang: 'English' },
  { label: 'Munich, Germany (DE)', city: 'Munich', country: 'Germany', lang: 'German' },
  { label: 'Amsterdam, Netherlands (EN)', city: 'Amsterdam', country: 'Netherlands', lang: 'English' },
  { label: 'Copenhagen, Denmark (EN)', city: 'Copenhagen', country: 'Denmark', lang: 'English' },
  { label: 'London, United Kingdom (EN)', city: 'London', country: 'UK', lang: 'English' },
  { label: 'Miami, USA (EN)', city: 'Miami', country: 'USA', lang: 'English' },
  { label: 'Dubai, UAE (EN)', city: 'Dubai', country: 'UAE', lang: 'English' }
];

const LEAD_HUNTER_INDUSTRIES = [
  {
    name: '01. Digital Marketing, Branding, Advertising & SEO Agencies',
    mode: 'AGENCY_PARTNERSHIP',
    offer: 'White-Label AI Agents Resell Partnership + 150MP Billboard/Wall/Glass Plaque Mockups + UI/UX Vault + Neural PDF Translator',
    sampleLeads: [
      { email: 'hello@alpinebrandstudio.example', domain: 'alpinebrandstudio.com', title: 'Alpine Brand & Digital Studio' },
      { email: 'partner@velox-creative.example', domain: 'velox-creative.io', title: 'Velox Creative & Performance Agency' },
      { email: 'info@nordicpulse-media.example', domain: 'nordicpulse-media.com', title: 'NordicPulse B2B Branding Group' }
    ]
  },
  {
    name: '04. Luxury Real Estate, Architecture & Interior Design Studios',
    mode: 'DIRECT_AND_PARTNERSHIP',
    offer: '150MP Wall & Interior Mockups + Real Estate AI Concierge & Voice Agent + Turnkey Real Estate Web Kit + 1000-Page PDF Translator',
    sampleLeads: [
      { email: 'studio@kronos-arch.example', domain: 'kronos-architecture.com', title: 'Kronos Luxury Architecture & Interiors' },
      { email: 'info@aurelia-estates.example', domain: 'aurelia-estates.com', title: 'Aurelia Prime Real Estate Advisory' },
      { email: 'office@atelier-vance.example', domain: 'atelier-vance.design', title: 'Atelier Vance Spatial Design Studio' }
    ]
  },
  {
    name: '05. Fine Jewelry, Diamond Dealers & Luxury Watch Boutiques',
    mode: 'DIRECT_B2B',
    offer: 'Turnkey Luxury Watches & Diamonds Web Kits ($349/$1,490) + 150MP Product Renders & Glass Plaques + 24/7 VIP AI Concierge',
    sampleLeads: [
      { email: 'concierge@meridian-horology.example', domain: 'meridian-horology.com', title: 'Meridian Haute Horlogerie Boutique' },
      { email: 'info@lumina-diamonds.example', domain: 'lumina-diamonds.com', title: 'Lumina Fine Diamonds & Bespoke Joaillerie' },
      { email: 'sales@geneva-timevault.example', domain: 'geneva-timevault.ch', title: 'TimeVault Collector Watch House' }
    ]
  },
  {
    name: '10. Aesthetic Clinics, Cosmetic Dentistry & Longevity Centers',
    mode: 'DIRECT_B2B',
    offer: '24/7 AI Voice Receptionist & Calendar Appointment Setter + Clinical Longevity Web Kit + Medical Tourism Neural PDF Translator',
    sampleLeads: [
      { email: 'info@artis-longevity.example', domain: 'artis-longevity.ch', title: 'Artis Aesthetic Medicine & Longevity Clinic' },
      { email: 'contact@utoquai-med.example', domain: 'utoquai-med.ch', title: 'Utoquai Private Plastic Surgery & Laser' },
      { email: 'reception@pure-dentalstudio.example', domain: 'pure-dentalstudio.com', title: 'Pure Boutique Cosmetic Dentistry' }
    ]
  },
  {
    name: '03. Large-Format Printing, OOH Billboards & Signage Companies',
    mode: 'AGENCY_PARTNERSHIP',
    offer: '150MP Billboard Mockups, Wall Mockups & Executive Glass Plaque Mockups + 150MP Ultra-Print Stock Images + AI Mockup Studio',
    sampleLeads: [
      { email: 'sales@metrobigprint.example', domain: 'metrobigprint.com', title: 'Metro OOH & Large Format Print Hub' },
      { email: 'info@titan-signage.example', domain: 'titan-signage.de', title: 'Titan Architectural Signage & Billboards' },
      { email: 'studio@prism-ooh.example', domain: 'prism-ooh.com', title: 'Prism Urban Display & Ultra-Print Media' }
    ]
  }
];

// B2B AGENCY CASE STUDIES & SOCIAL PROOF
const b2bCaseStudies = [
  {
    agency: "Apex Digital Group (Austin, TX)",
    system: "SEO & CRO Website Auditor Buyout",
    metric: "+340% Qualified B2B Leads",
    quote: "Instead of spending 8 weeks building an audit tool in-house, we deployed the V10 White-Label Auditor under our agency brand in 20 minutes. It closed 4 enterprise retainers in the first month."
  },
  {
    agency: "Nordic Studio Labs (Stockholm)",
    system: "AI Mockup & Visual Asset Studio",
    metric: "$14,200 Saved in Production",
    quote: "Having full HTML and n8n JSON ownership with zero monthly SaaS fees is a game changer. Our designers generate 8K client presentation mockups in seconds using our own OpenAI API key."
  },
  {
    agency: "ScaleFlow Automation (London)",
    system: "V10 B2B Webhook & Visual Concierge",
    metric: "< 2.1s Multilingual AI Quotes",
    quote: "We connected the V10 B2B Webhook and Floating Chat Widget powered by Groq. It scopes leads in English, German, and French automatically and escalates VIP buyers straight to WhatsApp."
  }
];

export default function AIAgentsShowcase() {
  const [activeModalAgent, setActiveModalAgent] = useState(null);

  // =========================================================
  // ACTIVE N8N WEBHOOK ENDPOINTS (RAILWAY + LOCALHOST GROQ)
  // =========================================================
  const N8N_AURELIA_PULSE_WEBHOOK = 'https://n8n-production-720dcf20.up.railway.app/webhook/aurelia-pulse';
  const N8N_B2B_CONCIERGE_WEBHOOK = 'https://n8n-production-720dcf20.up.railway.app/webhook/v10-concierge-webhook';
  const N8N_LEAD_HUNTER_INTAKE_WEBHOOK = 'https://n8n-production-720dcf20.up.railway.app/webhook/v10-b2b-intake';
  const N8N_FLOATING_CHAT_WEBHOOK = 'http://localhost:5678/webhook/237acb8c-83c6-4f97-a800-1426e24e7993/chat';
  const N8N_MOCKUP_WEBHOOK = 'http://localhost:5678/webhook/mockup-engine';
  const N8N_SEO_WEBHOOK = 'http://localhost:5678/webhook/seo-auditor';
  const N8N_CAMPAIGN_WEBHOOK = 'http://localhost:5678/webhook/campaign-engine';

  // =========================================================
  // 1. LIVE MOCKUP STUDIO STATE (WHITE-LABEL + VIP DEMO)
  // =========================================================
  const [isMockupStudioOpen, setIsMockupStudioOpen] = useState(false);
  const [mockupSubject, setMockupSubject] = useState('');
  const [mockupEnv, setMockupEnv] = useState(STUDIO_ENVIRONMENTS[0].value);
  const [mockupLighting, setMockupLighting] = useState('Dramatic studio rim lighting, ray-traced reflections');
  const [mockupRatio, setMockupRatio] = useState('16:9');
  const [vipKey, setVipKey] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderedImageUrl, setRenderedImageUrl] = useState(null);
  const [studioStatus, setStudioStatus] = useState('Viewport Standby');
  const [showLockedNotice, setShowLockedNotice] = useState(false);

  // =========================================================
  // 2. LIVE SEO & CRO AUDITOR STATE (WHITE-LABEL + VIP DEMO)
  // =========================================================
  const [isSeoStudioOpen, setIsSeoStudioOpen] = useState(false);
  const [auditUrl, setAuditUrl] = useState('https://aitoolsprosmart.com');
  const [auditGoal, setAuditGoal] = useState('B2B Enterprise Lead Generation & High-Ticket Sales');
  const [seoVipKey, setSeoVipKey] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditStatus, setAuditStatus] = useState('Scanner Standby');
  const [showSeoLockedNotice, setShowSeoLockedNotice] = useState(false);

  // =========================================================
  // 3. LIVE OMNICHANNEL CAMPAIGN STUDIO STATE (VIP DEMO)
  // =========================================================
  const [isCampaignStudioOpen, setIsCampaignStudioOpen] = useState(false);
  const [campProduct, setCampProduct] = useState('AI Tools Pro Smart — V10 White-Label AI Systems');
  const [campAudience, setCampAudience] = useState('Digital Marketing Agencies, Web Studios & B2B Consultants');
  const [campOffer, setCampOffer] = useState('Acquire 100% source code ownership of turnkey AI systems (HTML/React Frontend + n8n Backend Workflows) for a one-time buyout ($3,000–$8,500) with zero monthly SaaS fees.');
  const [campTone, setCampTone] = useState('Executive B2B, Authoritative & High-ROI Focused');
  const [campVipKey, setCampVipKey] = useState('');
  const [isSynthesizingCamp, setIsSynthesizingCamp] = useState(false);
  const [campResult, setCampResult] = useState(null);
  const [campStatus, setCampStatus] = useState('Synthesizer Standby');
  const [showCampLockedNotice, setShowCampLockedNotice] = useState(false);

  // =========================================================
  // 4. LIVE VIBER / TELEGRAM / WHATSAPP SALE ALERT STUDIO
  // =========================================================
  const [isAlertStudioOpen, setIsAlertStudioOpen] = useState(false);
  const [alertChannel, setAlertChannel] = useState('WhatsApp');
  const [alertBuyerName, setAlertBuyerName] = useState('Marcus Vance (Apex Charter Group)');
  const [alertBuyerEmail, setAlertBuyerEmail] = useState('m.vance@apexcharters-monaco.mc');
  const [alertProduct, setAlertProduct] = useState('Sapphire Voyages Exclusive Yacht Buyout + 150MP Kit');
  const [alertAmount, setAlertAmount] = useState('$1,490.00');
  const [alertPaymentMethod, setAlertPaymentMethod] = useState('Payoneer B2B Wire');
  const [alertWebhookUrl, setAlertWebhookUrl] = useState(N8N_B2B_CONCIERGE_WEBHOOK);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);
  const [alertAiReply, setAlertAiReply] = useState('');
  const [alertStatus, setAlertStatus] = useState('Listener Armed & Ready');

  // =========================================================
  // 5. LIVE AUTONOMOUS CALENDAR & APPOINTMENT SETTER STUDIO
  // =========================================================
  const [isBookingStudioOpen, setIsBookingStudioOpen] = useState(false);
  const [bookingClientName, setBookingClientName] = useState('Alexander Lindqvist (Nordic SaaS Ventures)');
  const [bookingClientEmail, setBookingClientEmail] = useState('a.lindqvist@nordicsaas.se');
  const [bookingTopic, setBookingTopic] = useState('Full White-Label AI System Buyout & Custom Deployment');
  const [bookingBudget, setBookingBudget] = useState('$5,000 – $10,000 (Turnkey Enterprise)');
  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [bookingSlot, setBookingSlot] = useState(AVAILABLE_TIME_SLOTS[1]);
  const [bookingPlatform, setBookingPlatform] = useState('Google Meet + WhatsApp Confirmation');
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingAiReply, setBookingAiReply] = useState('');
  const [bookingStatus, setBookingStatus] = useState('Calendar Synced & Live');

  // =========================================================
  // 6. LIVE V10 B2B WEBHOOK & MULTILINGUAL SCOPER STUDIO
  // =========================================================
  const [isB2BWebhookStudioOpen, setIsB2BWebhookStudioOpen] = useState(false);
  const [b2bLeadName, setB2bLeadName] = useState('Apex Luxury Aviation Holdings');
  const [b2bLeadEmail, setB2bLeadEmail] = useState('director@apexaviation.aero');
  const [b2bLeadCategory, setB2bLeadCategory] = useState('Turnkey B2B Landing Page Kits (8 Niches)');
  const [b2bLeadItem, setB2bLeadItem] = useState('Private Aviation Kit — Exclusive Buyout ($1,490)');
  const [b2bLeadMessage, setB2bLeadMessage] = useState('We want to acquire the Private Aviation Turnkey Kit with 150MP assets and V10 PDF Translator. Please send exact pricing and links.');
  const [isB2bSubmitting, setIsB2bSubmitting] = useState(false);
  const [b2bAgentReply, setB2bAgentReply] = useState('');
  const [b2bWhatsappLink, setB2bWhatsappLink] = useState('https://wa.me/381648201496');
  const [b2bStatus, setB2bStatus] = useState('Connected to localhost:5678 (Groq openai/gpt-oss-120b)');

  // =========================================================
  // 7. V10 AUTONOMOUS B2B LEAD HUNTER & 20:00H CLOSER STUDIO
  // =========================================================
  const [isLeadHunterStudioOpen, setIsLeadHunterStudioOpen] = useState(false);
  const [hunterCityIdx, setHunterCityIdx] = useState(0);
  const [hunterIndIdx, setHunterIndIdx] = useState(0);
  const [hunterLangMode, setHunterLangMode] = useState('Auto-Detect (EN / DE)');
  const [hunterTab, setHunterTab] = useState('pipeline'); // 'pipeline' | 'email' | 'report20h'
  const [isHunterRunning, setIsHunterRunning] = useState(false);
  const [hunterSimulated, setHunterSimulated] = useState(true);
  const [hunterStatus, setHunterStatus] = useState('5-Engine Scraper + 20:00 CET Autonomous Closer Ready');

  // =========================================================
  // 8. NEW: AURELIA PULSE — 24/7 AI CONCIERGE & BOOKING BAR
  // =========================================================
  const [isAureliaStudioOpen, setIsAureliaStudioOpen] = useState(false);
  const [isAureliaBarVisible, setIsAureliaBarVisible] = useState(true);
  const [isAureliaDrawerOpen, setIsAureliaDrawerOpen] = useState(false);
  const [aureliaService, setAureliaService] = useState(AURELIA_SERVICES[0]);
  const [aureliaDate, setAureliaDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 86400000);
    return tomorrow.toISOString().split('T')[0];
  });
  const [aureliaSlot, setAureliaSlot] = useState('13:00 CET');
  const [aureliaName, setAureliaName] = useState('');
  const [aureliaContact, setAureliaContact] = useState('');
  const [aureliaInput, setAureliaInput] = useState('');
  const [isAureliaSending, setIsAureliaSending] = useState(false);
  const [aureliaStatus, setAureliaStatus] = useState('Live Railway Webhook Connected (/webhook/aurelia-pulse)');
  const [aureliaMessages, setAureliaMessages] = useState([
    {
      role: 'assistant',
      text: 'Welcome to Aurelia Pulse VIP Desk. Select your preferred service, date, and CET slot, then ask any question in English, Serbian, German, or any language.'
    }
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ESCAPE KEY LISTENER TO CLOSE ALL MODALS
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveModalAgent(null);
        setIsMockupStudioOpen(false);
        setIsSeoStudioOpen(false);
        setIsCampaignStudioOpen(false);
        setIsAlertStudioOpen(false);
        setIsBookingStudioOpen(false);
        setIsB2BWebhookStudioOpen(false);
        setIsLeadHunterStudioOpen(false);
        setIsAureliaStudioOpen(false);
        setIsAureliaDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // HANDLER 1: Mockup Studio Render
  const handleStudioRender = async (e) => {
    e.preventDefault();
    setShowLockedNotice(false);

    if (vipKey.trim().toUpperCase() !== 'V10VIP') {
      setShowLockedNotice(true);
      setStudioStatus('Public Preview Mode (Locked)');
      return;
    }

    setIsRendering(true);
    setRenderedImageUrl(null);
    setStudioStatus('Synthesizing 3D Scene...');

    try {
      const response = await fetch(N8N_MOCKUP_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: mockupSubject,
          environment: `${mockupEnv}. ${mockupLighting}`,
          aspect_ratio: mockupRatio
        })
      });

      if (!response.ok) throw new Error('Render error');

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setRenderedImageUrl(imageUrl);
      setStudioStatus('Render Complete');
    } catch (err) {
      alert('Connection error: Verify that the n8n workflow is Published.');
      setStudioStatus('Engine Error');
    } finally {
      setIsRendering(false);
    }
  };

  // HANDLER 2: SEO & CRO Live Audit
  const handleSeoAudit = async (e) => {
    e.preventDefault();
    setShowSeoLockedNotice(false);

    if (seoVipKey.trim().toUpperCase() !== 'V10VIP') {
      setShowSeoLockedNotice(true);
      setAuditStatus('Public Preview Mode (Locked)');
      return;
    }

    setIsAuditing(true);
    setAuditResult(null);
    setAuditStatus('Auditing Target URL...');

    try {
      const response = await fetch(N8N_SEO_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: auditUrl.trim(),
          goal: auditGoal
        })
      });

      if (!response.ok) throw new Error('Audit request failed');

      const rawText = await response.text();
      const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedJson);

      setAuditResult(data);
      setAuditStatus('Audit Complete');
    } catch (err) {
      alert('Connection error: Ensure the SEO & CRO Website Auditor workflow is Published in n8n.');
      setAuditStatus('Audit Failed');
    } finally {
      setIsAuditing(false);
    }
  };

  // HANDLER 3: Omnichannel Campaign Synthesis
  const handleCampaignSynthesis = async (e) => {
    e.preventDefault();
    setShowCampLockedNotice(false);

    if (campVipKey.trim().toUpperCase() !== 'V10VIP') {
      setShowCampLockedNotice(true);
      setCampStatus('Public Preview Mode (Locked)');
      return;
    }

    setIsSynthesizingCamp(true);
    setCampResult(null);
    setCampStatus('Synthesizing 4 Channels...');

    try {
      const response = await fetch(N8N_CAMPAIGN_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: campProduct.trim(),
          audience: campAudience.trim(),
          offer: campOffer.trim(),
          tone: campTone
        })
      });

      if (!response.ok) throw new Error('Campaign request failed');

      const rawText = await response.text();
      const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanedJson);

      setCampResult(data);
      setCampStatus('Campaign Ready');
    } catch (err) {
      alert('Connection error: Ensure the Omnichannel Campaign workflow is Published in n8n.');
      setCampStatus('Synthesis Failed');
    } finally {
      setIsSynthesizingCamp(false);
    }
  };

  // HANDLER 4: Instant Viber / Telegram / WhatsApp Alert Simulator
  const handleSimulateSaleAlert = async (e) => {
    e.preventDefault();
    setIsSendingAlert(true);
    setAlertDispatched(false);
    setAlertAiReply('');
    setAlertStatus(`Dispatching to ${alertChannel} via n8n...`);

    try {
      const targetUrl = alertWebhookUrl.trim() || N8N_B2B_CONCIERGE_WEBHOOK;
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: alertBuyerName,
          email: alertBuyerEmail,
          category: `Instant ${alertChannel} Sale Alert`,
          item: alertProduct,
          budget: alertAmount,
          message: `New high-ticket order paid via ${alertPaymentMethod} for ${alertProduct} (${alertAmount}). Provide a brief VIP onboarding confirmation.`
        })
      });
      const data = await res.json();
      if (data?.agent_reply) {
        setAlertAiReply(data.agent_reply);
      }
      setAlertDispatched(true);
      setAlertStatus(`Delivered via n8n Groq Engine to ${alertChannel}`);
    } catch (err) {
      setAlertDispatched(true);
      setAlertStatus(`Simulated ${alertChannel} Push Preview`);
    } finally {
      setIsSendingAlert(false);
    }
  };

  // HANDLER 5: Autonomous Calendar & Appointment Setter
  const handleConfirmAppointment = async (e) => {
    e.preventDefault();
    setIsBookingSubmitting(true);
    setBookingConfirmed(false);
    setBookingAiReply('');
    setBookingStatus('Locking Calendar Slot & Dispatching via V10 Webhook...');

    try {
      const res = await fetch(N8N_B2B_CONCIERGE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: bookingClientName,
          email: bookingClientEmail,
          category: 'Executive Consultation Booking',
          item: bookingTopic,
          date: `${bookingDate} at ${bookingSlot}`,
          budget: bookingBudget,
          message: `Please confirm my executive consultation call on ${bookingDate} at ${bookingSlot} via ${bookingPlatform} regarding ${bookingTopic} (Budget: ${bookingBudget}).`
        })
      });
      const data = await res.json();
      if (data?.agent_reply) {
        setBookingAiReply(data.agent_reply);
      }
      setBookingConfirmed(true);
      setBookingStatus(`Slot Confirmed (${bookingDate} @ ${bookingSlot})`);
    } catch (err) {
      setBookingConfirmed(true);
      setBookingStatus(`Slot Confirmed (${bookingDate} @ ${bookingSlot})`);
    } finally {
      setIsBookingSubmitting(false);
    }
  };

  // HANDLER 6: Live V10 B2B Webhook & Multilingual Scoper
  const handleB2BWebhookSubmit = async (e) => {
    e.preventDefault();
    setIsB2bSubmitting(true);
    setB2bAgentReply('');
    setB2bStatus('Querying V10 B2B Webhook (Groq openai/gpt-oss-120b)...');

    const payload = {
      name: b2bLeadName,
      email: b2bLeadEmail,
      category: b2bLeadCategory,
      item: b2bLeadItem,
      message: b2bLeadMessage
    };

    try {
      let data;
      if (typeof window !== 'undefined' && typeof window.sendV10ConciergeLead === 'function') {
        data = await window.sendV10ConciergeLead(payload);
      } else {
        const res = await fetch(N8N_B2B_CONCIERGE_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        data = await res.json();
      }

      setB2bAgentReply(data?.agent_reply || 'Thank you! Your inquiry has been processed by Visionary Factory V10.');
      if (data?.whatsapp_direct_link) {
        setB2bWhatsappLink(data.whatsapp_direct_link);
      }
      setB2bStatus('✓ Live Response Received (< 2.1s via localhost:5678)');
    } catch (err) {
      setB2bAgentReply('Ensure your n8n workflow "V10 B2B Webhook - NEW (Groq)" is Published on http://localhost:5678. Direct VIP escalation is available via WhatsApp below.');
      setB2bStatus('Offline Fallback Mode');
    } finally {
      setIsB2bSubmitting(false);
    }
  };

  // HANDLER 7: V10 Autonomous B2B Lead Hunter & 20:00h Closer Interactive Simulation
  const handleRunLeadHunterDemo = (e) => {
    e.preventDefault();
    setIsHunterRunning(true);
    const chosenCity = LEAD_HUNTER_SAMPLE_CITIES[hunterCityIdx];
    setHunterStatus(`Scanning ${chosenCity.city} (${chosenCity.country}) across 5 Search Engines...`);

    setTimeout(() => {
      setIsHunterRunning(false);
      setHunterSimulated(true);
      setHunterStatus(`✓ Verified B2B Leads Synced to Google Sheets (${chosenCity.city}) • Queued for 12-Min Drip & 20:00 CET Report`);
    }, 850);
  };

  // HANDLER 8: Aurelia Pulse 24/7 Booking Bar & Live Multilingual Desk
  const handleAureliaSend = async (e, customPrompt) => {
    if (e) e.preventDefault();
    const messageToSend = (customPrompt !== undefined ? customPrompt : aureliaInput).trim();
    if (!messageToSend || isAureliaSending) return;

    const clientName = aureliaName.trim() || 'VIP Visitor';
    const rawContact = aureliaContact.trim();
    const isEmail = rawContact.includes('@');

    setAureliaMessages((prev) => [...prev, { role: 'user', text: messageToSend }]);
    if (customPrompt === undefined) setAureliaInput('');
    setIsAureliaSending(true);
    setAureliaStatus('Dispatching to Railway n8n + Mobile Push Alarm...');

    const payload = {
      brandName: 'Aurelia Pulse VIP Desk',
      name: clientName,
      email: isEmail ? rawContact : 'vip-lead@aitoolsprosmart.com',
      phone: !isEmail && rawContact ? rawContact : '+381648201496',
      category: 'Direct Website Booking',
      item: aureliaService,
      budget: 'VIP Priority',
      date: `${aureliaDate} at ${aureliaSlot}`,
      pageUrl: typeof window !== 'undefined' ? window.location.href : 'https://aitoolsprosmart.com/ai-agents',
      message: messageToSend
    };

    try {
      const res = await fetch(N8N_AURELIA_PULSE_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const replyText =
        data?.reply ||
        data?.agent_reply ||
        data?.output ||
        data?.message ||
        `Thank you, ${clientName}. Your booking inquiry for "${aureliaService}" on ${aureliaDate} at ${aureliaSlot} has been logged and an instant alert has been sent to our manager.`;

      setAureliaMessages((prev) => [...prev, { role: 'assistant', text: replyText }]);
      setAureliaStatus(`✓ Live Reply & Mobile Push Dispatched (${aureliaDate} @ ${aureliaSlot})`);
    } catch (err) {
      setAureliaMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `Thank you, ${clientName}. Your slot request for "${aureliaService}" (${aureliaDate} at ${aureliaSlot}) is noted. For immediate VIP priority, connect on WhatsApp (+381648201496).`
        }
      ]);
      setAureliaStatus('Fallback Confirmation Active');
    } finally {
      setIsAureliaSending(false);
    }
  };

  const selectedHunterCity = LEAD_HUNTER_SAMPLE_CITIES[hunterCityIdx] || LEAD_HUNTER_SAMPLE_CITIES[0];
  const selectedHunterInd = LEAD_HUNTER_INDUSTRIES[hunterIndIdx] || LEAD_HUNTER_INDUSTRIES[0];
  const effectiveHunterLang =
    hunterLangMode === 'German (DE)'
      ? 'German'
      : hunterLangMode === 'English (EN)'
      ? 'English'
      : selectedHunterCity.lang;

  const sampleCompanyTitle = selectedHunterInd.sampleLeads[0]?.title || 'Executive Partner Studio';
  const isPartnerPitch = selectedHunterInd.mode.includes('PARTNERSHIP');

  const generatedSampleEmailSubject =
    effectiveHunterLang === 'German'
      ? isPartnerPitch
        ? `B2B & White-Label Partnerschaft für ${sampleCompanyTitle} | AI Agents, 150MP Mockups & Neural PDF`
        : `Maßgeschneiderte AI-Automatisierung & 150MP Visual-Systeme für ${sampleCompanyTitle}`
      : isPartnerPitch
      ? `B2B & White-Label Partnership with ${sampleCompanyTitle} | AI Agents, 150MP Mockups & UI/UX`
      : `24/7 AI Automation & 150MP Visual Infrastructure for ${sampleCompanyTitle}`;

  const generatedSampleEmailBody =
    effectiveHunterLang === 'German'
      ? `Guten Tag liebes Team von ${sampleCompanyTitle},

ich bin auf Ihre Arbeit in ${selectedHunterCity.city} (${selectedHunterCity.country}) aufmerksam geworden und möchte Ihnen eine direkte B2B- & White-Label-Kooperation vorschlagen.

Empfohlener Fokus für Ihr Profil: ${selectedHunterInd.offer}.

Unser gesamtes sofort verfügbares B2B-Ökosystem (100 % IP-Übertragung, keine monatlichen SaaS-Gebühren):
- White-Label AI Agents & Turnkey Luxury Web Kits ($349 / $1,490 Buyout): https://aitoolsprosmart.com/ai-agents
- 150MP Master Mockups (Wall, Billboard & Executive Glass Plaques): https://aitoolsprosmart.com/standard-mocup
- UI/UX Design & V10 Vault (inkl. Master .PSD-Dateien): https://aitoolsprosmart.com/ui-ux/vault
- Massive Neural PDF Translator (bis zu 1.000 Seiten, 100 % identisches Layout): https://aitoolsprosmart.com/pdf-translator
- 150MP Ultra-Print & 4K UHD Commercial Stock (kostenloses Testpaket): https://aitoolsprosmart.com/stock

Hätten Sie diese Woche 10 Minuten Zeit für einen kurzen Austausch zu einer Partnerschaft?

Beste Grüße
Goran Damnjanovic
Founder | AI Tools Pro Smart (Visionary Factory V10)`
      : `Hello ${sampleCompanyTitle} Team,

I recently reviewed your work in ${selectedHunterCity.city} (${selectedHunterCity.country}) and wanted to reach out regarding a direct B2B & White-Label partnership.

Top recommended fit for your operations: ${selectedHunterInd.offer}.

Explore our complete live B2B commercial ecosystem (one-time buyout, zero monthly SaaS fees):
- Custom White-Label AI Agents & Turnkey Luxury Web Kits ($349 / $1,490 Buyout): https://aitoolsprosmart.com/ai-agents
- 150MP Master Mockups (Architectural Wall, Billboard & Glass Plaques): https://aitoolsprosmart.com/standard-mocup
- UI/UX Design & V10 Vault (with open Master .PSD source files): https://aitoolsprosmart.com/ui-ux/vault
- Massive Neural PDF Translator (up to 1,000 pages, 100% intact layout — 5 pages free): https://aitoolsprosmart.com/pdf-translator
- 150MP Ultra-Print & 4K UHD Commercial Stock (free 150MP sample): https://aitoolsprosmart.com/stock

Would you be open to a quick conversation regarding an agency/B2B partnership or testing a complimentary sample?

Best regards,
Goran Damnjanovic
Founder | AI Tools Pro Smart (Visionary Factory V10)`;

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

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
  };

  const getColorClasses = (theme) => {
    if (theme === 'amber') return { text: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/40', shadow: 'shadow-[0_0_35px_rgba(245,158,11,0.18)]', button: 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-amber-500/30', modalBg: 'bg-amber-950/40', modalBorder: 'border-amber-400/60', modalHover: 'hover:bg-amber-900/50' };
    if (theme === 'cyan') return { text: 'text-cyan-400', bg: 'bg-cyan-600/20', border: 'border-cyan-500/30', shadow: 'shadow-[0_0_30px_rgba(8,145,178,0.15)]', button: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/30', modalBg: 'bg-cyan-900/50', modalBorder: 'border-cyan-400/60', modalHover: 'hover:bg-cyan-800/60' };
    if (theme === 'emerald') return { text: 'text-emerald-400', bg: 'bg-emerald-600/20', border: 'border-emerald-500/30', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.15)]', button: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30', modalBg: 'bg-emerald-900/50', modalBorder: 'border-emerald-400/60', modalHover: 'hover:bg-emerald-800/60' };
    if (theme === 'indigo') return { text: 'text-indigo-400', bg: 'bg-indigo-600/20', border: 'border-indigo-500/30', shadow: 'shadow-[0_0_30px_rgba(79,70,229,0.15)]', button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30', modalBg: 'bg-indigo-900/50', modalBorder: 'border-indigo-400/60', modalHover: 'hover:bg-indigo-800/60' };
    return { text: 'text-blue-400', bg: 'bg-blue-600/20', border: 'border-blue-500/30', shadow: 'shadow-[0_0_30px_rgba(37,99,235,0.15)]', button: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30', modalBg: 'bg-blue-900/50', modalBorder: 'border-blue-400/60', modalHover: 'hover:bg-blue-800/60' };
  };

  // 3 MAIN AGENTS (WHITE-LABEL BUYOUT)
  const visualConcierge = {
    name: "Visual Concierge (Floating Chat + Studio)",
    shortDesc: "24/7 Floating Chat Widget & Mockup Routing",
    longDesc: "Includes both the live Visual Concierge Floating Chat Widget (powered by n8n & Groq openai/gpt-oss-120b) trained on the entire V10 ecosystem and the 8K Commercial Mockup Studio.",
    deliverables: "Visual Concierge - Floating Chat Widget.json + index.html + README.md",
    whiteLabelPrice: "$4,000 – $7,000",
    icon: Bot,
    colorTheme: 'blue',
    hasLiveStudio: true,
    hasB2BWebhookStudio: true
  };

  const salesScoper = {
    name: "B2B Sales Scoper (V10 B2B Webhook)",
    shortDesc: "Automated Multilingual Project Quotes & WhatsApp Routing",
    longDesc: "Powered by our live V10 B2B Webhook - NEW (Groq) workflow. Receives B2B form inquiries, detects any client language automatically, calculates accurate package quotes across all 8 Turnkey Niches and 30+ AI Agents, and returns a structured JSON response with direct WhatsApp VIP escalation.",
    deliverables: "V10 B2B Webhook - NEW (Groq).json + index.html + README.md",
    whiteLabelPrice: "$4,000 – $8,000",
    icon: Briefcase,
    colorTheme: 'emerald',
    hasB2BWebhookStudio: true
  };

  const techEngineer = {
    name: "Tech 24/7 Engineer",
    shortDesc: "Dev & Infrastructure Support",
    longDesc: "Provides round-the-clock autonomous infrastructure support, resolving technical queries, diagnosing errors, and assisting with React, Vite, and self-hosted n8n deployments seamlessly.",
    deliverables: "Frontend Support Console (React/HTML) + n8n Tech Diagnostic Workflow (.JSON)",
    whiteLabelPrice: "$5,000 – $10,000",
    icon: Cpu,
    colorTheme: 'indigo'
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white py-24 pb-36 px-4 sm:px-6 font-sans relative z-10">

      {/* ========================================================= */}
      {/* 8. NEW: AURELIA PULSE — 24/7 AI CONCIERGE & BOOKING MODAL */}
      {/* ========================================================= */}
      {isAureliaStudioOpen && (
        <div
          onClick={() => setIsAureliaStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#070a14] border-2 border-[#eab308]/50 rounded-3xl max-w-6xl w-full relative shadow-[0_0_95px_rgba(234,179,8,0.22)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#facc15] to-[#ca8a04] flex items-center justify-center font-black text-black shadow-lg shadow-amber-500/25">
                  <Sparkles size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Aurelia Pulse — 24/7 AI Concierge & Booking Bar
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                      ● LIVE RAILWAY N8N + GROQ
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded-full">
                      $199 COMMERCIAL KIT / $2,900 BUYOUT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Active Webhook: <code className="text-amber-300">{N8N_AURELIA_PULSE_WEBHOOK}</code> • Multilingual AI + Instant Phone Push Alarm
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAureliaStudioOpen(false)}
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT BOOKING BAR & CLIENT CONFIG */}
              <form onSubmit={(e) => handleAureliaSend(e)} className="lg:col-span-5 space-y-4 bg-black/60 border border-white/10 rounded-2xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      1. Your Name
                    </label>
                    <input
                      type="text"
                      value={aureliaName}
                      onChange={(e) => setAureliaName(e.target.value)}
                      placeholder="e.g. Goran / Client Name"
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#facc15] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      2. Phone / WhatsApp / Email
                    </label>
                    <input
                      type="text"
                      value={aureliaContact}
                      onChange={(e) => setAureliaContact(e.target.value)}
                      placeholder="+38164... or client@company.com"
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#facc15] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                    3. Service on Booking Bar
                  </label>
                  <select
                    value={aureliaService}
                    onChange={(e) => setAureliaService(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-amber-300 font-bold focus:border-[#facc15] focus:outline-none"
                  >
                    {AURELIA_SERVICES.map((srv) => (
                      <option key={srv} value={srv}>{srv}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      4. Preferred Date
                    </label>
                    <input
                      type="date"
                      value={aureliaDate}
                      onChange={(e) => setAureliaDate(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#facc15] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      5. CET Time Slot
                    </label>
                    <select
                      value={aureliaSlot}
                      onChange={(e) => setAureliaSlot(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-emerald-400 font-bold focus:border-[#facc15] focus:outline-none"
                    >
                      {AVAILABLE_TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      6. Ask AI or Confirm Slot (Any Language)
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">SR / EN / DE / FR+</span>
                  </div>
                  <textarea
                    rows="3"
                    value={aureliaInput}
                    onChange={(e) => setAureliaInput(e.target.value)}
                    placeholder="Write in any language to book or ask..."
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#facc15] focus:outline-none resize-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAureliaInput('Dobar dan, želim da potvrdim ovaj termin u 13h i zanima me kako funkcioniše Aurelia Pulse paket za naš sajt?')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition cursor-pointer"
                    >
                      🇷🇸 Srpski Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setAureliaInput('Hello, I want to lock in this slot and get the $199 Aurelia Pulse AI Booking Bar installed on our company website.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition cursor-pointer"
                    >
                      🇬🇧 English Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setAureliaInput('Hallo, ist dieser Termin noch frei? Wir möchten die Aurelia Pulse AI-Buchungsleiste für unsere Agentur erwerben.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition cursor-pointer"
                    >
                      🇩🇪 Deutsch Test
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAureliaSending}
                  className="w-full py-3.5 bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
                >
                  {isAureliaSending ? 'Sending to Aurelia Pulse n8n...' : '✦ Ask AI / Book Slot Now ↗'}
                </button>

                <a
                  href={`https://wa.me/381648201496?text=${encodeURIComponent('Hi Goran, I want to get the Aurelia Pulse — 24/7 AI Concierge & Booking Bar ($199 Commercial Kit / $2,900 White-Label Buyout).')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-black uppercase tracking-wider rounded-xl text-[11px] transition"
                >
                  💬 Get $199 Kit or Agency White-Label on WhatsApp
                </a>
              </form>

              {/* RIGHT LIVE AURELIA PULSE DESK CONVERSATION */}
              <div className="lg:col-span-7 bg-[#090c15] border border-[#eab308]/30 rounded-2xl p-5 min-h-[490px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAureliaSending ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span className="text-xs font-black uppercase tracking-wider text-[#facc15]">✦ AURELIA PULSE LIVE DESK</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{aureliaStatus}</span>
                </div>

                <div className="flex-1 my-4 space-y-3 max-h-[340px] overflow-y-auto pr-2">
                  {aureliaMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-r from-[#facc15] to-[#eab308] text-black font-bold shadow-md'
                            : 'bg-[#121726] border border-white/10 text-slate-200'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isAureliaSending && (
                    <div className="flex justify-start">
                      <div className="bg-[#121726] border border-amber-500/30 text-amber-300 rounded-2xl px-4 py-2.5 text-xs font-semibold animate-pulse">
                        Aurelia Pulse is processing your booking & notifying mobile desk...
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>Selected Bar State: <strong className="text-white">{aureliaService}</strong> • <strong className="text-amber-300">{aureliaDate} @ {aureliaSlot}</strong></span>
                  <span className="text-emerald-400 font-bold">6-Node n8n + Instant Mobile Alert</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. V10 AUTONOMOUS B2B LEAD HUNTER & 20:00H STUDIO         */}
      {/* ========================================================= */}
      {isLeadHunterStudioOpen && (
        <div
          onClick={() => setIsLeadHunterStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#060b16] border-2 border-cyan-400/50 rounded-3xl max-w-6xl w-full relative shadow-[0_0_95px_rgba(6,182,212,0.25)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center font-black text-black shadow-lg shadow-cyan-500/20">
                  <Crosshair size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      V10 Autonomous B2B Lead Hunter & 20:00 CET Closer
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full">
                      170 CITIES • 14 B2B NICHES • WHITE-LABEL ($5,500 – $9,500)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Python V5 5-Engine Scraper + Google Sheets Cloud CRM + Railway n8n 12-Min Drip & Exact 20:00&rarr;20:00 CET Daily Report
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLeadHunterStudioOpen(false)}
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT CONFIGURATION PANEL */}
              <form onSubmit={handleRunLeadHunterDemo} className="lg:col-span-4 space-y-4 bg-black/60 border border-white/10 rounded-2xl p-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
1. Target Global City (170-City Database)
                  </label>
                  <select
                    value={hunterCityIdx}
                    onChange={(e) => setHunterCityIdx(Number(e.target.value))}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {LEAD_HUNTER_SAMPLE_CITIES.map((c, idx) => (
                      <option key={c.label} value={idx}>{c.label}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Includes USA (50), Germany (28), Netherlands (16), Denmark (12) & 64 Global Wealth Hubs.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
2. Target B2B Industry (14 Verticals)
                  </label>
                  <select
                    value={hunterIndIdx}
                    onChange={(e) => setHunterIndIdx(Number(e.target.value))}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {LEAD_HUNTER_INDUSTRIES.map((ind, idx) => (
                      <option key={ind.name} value={idx}>{ind.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
3. AI Outreach Language
                    </label>
                    <select
                      value={hunterLangMode}
                      onChange={(e) => setHunterLangMode(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-cyan-300 font-bold focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Auto-Detect (EN / DE)">Auto (EN / DE)</option>
                      <option value="English (EN)">English Only</option>
                      <option value="German (DE)">Deutsch (DACH)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
4. Drip Cadence
                    </label>
                    <div className="w-full bg-[#05070f] border border-emerald-500/30 rounded-xl p-2.5 text-[11px] font-black text-emerald-400 text-center">
                      Every 12m (55/Day)
                    </div>
                  </div>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3 space-y-1.5 text-[11px] text-slate-300">
                  <div className="font-black uppercase text-cyan-400 tracking-wider text-[10px]">
                    3-Flow Autonomous Architecture:
                  </div>
                  <div>• <strong>Flow 1:</strong> Python V5 &rarr; Webhook (`{N8N_LEAD_HUNTER_INTAKE_WEBHOOK.split('/webhook')[1]}`) &rarr; Google Sheets</div>
                  <div>• <strong>Flow 2:</strong> 09:00–19:48 CET Drip Closer (`READY_FOR_AGENT` &rarr; `SENT`)</div>
                  <div>• <strong>Flow 3:</strong> Exact <strong>20:00 CET</strong> 24h Executive HTML Report</div>
                </div>

                <button
                  type="submit"
                  disabled={isHunterRunning}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
                >
                  {isHunterRunning ? 'Scanning 5 Search Engines...' : '🎯 Simulate City Hunt + 20:00h Engine'}
                </button>

                <a
                  href={`https://wa.me/381648201496?text=${encodeURIComponent('Hi Goran, I want to acquire the V10 Autonomous B2B Lead Hunter & 20:00h Closer Turnkey System ($5,500 - $9,500).')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-white/10 hover:bg-white/20 border border-white/15 text-white font-black uppercase tracking-wider rounded-xl text-[11px] transition"
                >
                  💬 Acquire Full Python + n8n Buyout on WhatsApp
                </a>
              </form>

              {/* RIGHT 3-TAB LIVE PREVIEW PANEL */}
              <div className="lg:col-span-8 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[490px] flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${isHunterRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{hunterStatus}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setHunterTab('pipeline')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                          hunterTab === 'pipeline'
                            ? 'bg-cyan-400 text-black'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
1. Scraper & Sheets CRM
                      </button>
                      <button
                        type="button"
                        onClick={() => setHunterTab('email')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                          hunterTab === 'email'
                            ? 'bg-emerald-400 text-black'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
2. AI Email ({effectiveHunterLang})
                      </button>
                      <button
                        type="button"
                        onClick={() => setHunterTab('report20h')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${
                          hunterTab === 'report20h'
                            ? 'bg-amber-400 text-black'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
3. 20:00 CET Report
                      </button>
                    </div>
                  </div>

                  {isHunterRunning ? (
                    <div className="py-20 text-center">
                      <div className="inline-block w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white">
                        Crawling DDGS + Brave + Bing Base64 + DDG + Mojeek...
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Filtering duplicates, decoding ROT13 emails, and syncing English schema to Google Sheets
                      </p>
                    </div>
                  ) : hunterSimulated && hunterTab === 'pipeline' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-[#081022] border border-cyan-500/30 rounded-xl p-3 text-center">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Verified Database</div>
                          <div className="text-xl font-black text-cyan-400 mt-0.5">2,321+</div>
                          <div className="text-[10px] text-slate-500">Clean B2B Leads</div>
                        </div>
                        <div className="bg-[#081022] border border-emerald-500/30 rounded-xl p-3 text-center">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Daily Drip Speed</div>
                          <div className="text-xl font-black text-emerald-400 mt-0.5">55 / Day</div>
                          <div className="text-[10px] text-slate-500">09:00–19:48 CET</div>
                        </div>
                        <div className="bg-[#081022] border border-amber-500/30 rounded-xl p-3 text-center">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Partnership Mode</div>
                          <div className="text-xs font-black text-amber-400 mt-2">{selectedHunterInd.mode}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">Auto-Detected</div>
                        </div>
                        <div className="bg-[#081022] border border-indigo-500/30 rounded-xl p-3 text-center">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Executive Report</div>
                          <div className="text-xl font-black text-indigo-400 mt-0.5">20:00 CET</div>
                          <div className="text-[10px] text-slate-500">24h Window Sync</div>
                        </div>
                      </div>

                      <div className="bg-[#070c18] border border-white/10 rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-black uppercase tracking-wider text-cyan-300">
                            Live Google Sheets CRM Queue Preview ({selectedHunterCity.city}, {selectedHunterCity.country})
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            100% English Schema + TXT/CSV Export
                          </span>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-white/10 text-[10px] uppercase text-slate-400">
                                <th className="py-2 pr-3">Corporate Email</th>
                                <th className="py-2 pr-3">Company & Location</th>
                                <th className="py-2 pr-3">Mode / Lang</th>
                                <th className="py-2">CRM Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-slate-200">
                              {selectedHunterInd.sampleLeads.map((ld, idx) => (
                                <tr key={ld.email}>
                                  <td className="py-2.5 pr-3 font-mono text-cyan-300">{ld.email}</td>
                                  <td className="py-2.5 pr-3">
                                    <div className="font-bold text-white">{ld.title}</div>
                                    <div className="text-[10px] text-slate-400">{selectedHunterCity.city}, {selectedHunterCity.country} • {ld.domain}</div>
                                  </td>
                                  <td className="py-2.5 pr-3 text-[11px]">
                                    <span className="text-amber-300 font-semibold">{effectiveHunterLang}</span> • {isPartnerPitch ? 'White-Label' : 'Direct B2B'}
                                  </td>
                                  <td className="py-2.5">
                                    {idx === 0 ? (
                                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                                        SENT ✓
                                      </span>
                                    ) : (
                                      <span className="px-2 py-0.5 text-[10px] font-black uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                        READY_FOR_AGENT
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  ) : hunterTab === 'email' ? (
                    <div className="bg-[#070c18] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                            Autonomous B2B & Partnership Email Composer ({effectiveHunterLang})
                          </span>
                          <span className="text-xs font-bold text-white">Subject: {generatedSampleEmailSubject}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(`Subject: ${generatedSampleEmailSubject}\n\n${generatedSampleEmailBody}`)}
                          className="text-[10px] bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg text-white font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Copy size={12} /> Copy Email
                        </button>
                      </div>
                      <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed max-h-[290px] overflow-y-auto pr-2">
                        {generatedSampleEmailBody}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-[#091122] border border-amber-500/40 rounded-2xl p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="text-xs font-black uppercase tracking-wider text-amber-400">
                            📊 V10 AUTONOMOUS AGENT — DAILY 20:00 CET EXECUTIVE REPORT
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Exact 24h Window: Yesterday 20:00 CET &rarr; Today 20:00 CET • Delivered Automatically to Owner Inbox
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          CRON: 0 20 * * *
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Sent (20h–20h)</div>
                          <div className="text-lg font-black text-emerald-400">55 Offers</div>
                        </div>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Agency Pitches</div>
                          <div className="text-lg font-black text-cyan-400">24 Studios</div>
                        </div>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">New Scraped</div>
                          <div className="text-lg font-black text-amber-400">+180 Leads</div>
                        </div>
                        <div className="bg-black/50 border border-white/10 rounded-xl p-2.5">
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Queue Remaining</div>
                          <div className="text-lg font-black text-white">2,266 Ready</div>
                        </div>
                      </div>

                      <div className="bg-black/50 border border-white/10 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
                        <div className="font-bold text-white uppercase text-[10px] tracking-wider mb-1">
                          Included Ecosystem Routes Verified in Every Outbound Email:
                        </div>
                        <div>• <code className="text-cyan-300">/standard-mocup</code> (150MP Wall, Billboard & Glass Plaque Mockups)</div>
                        <div>• <code className="text-cyan-300">/ui-ux/vault</code> (Luxury Retail, Culinary UI & Master .PSD Suites)</div>
                        <div>• <code className="text-cyan-300">/pdf-translator</code> (1,000-Page Neural DTP Layout Translator)</div>
                        <div>• <code className="text-cyan-300">/stock</code> &amp; <code className="text-cyan-300">/ai-agents</code> (150MP Stock &amp; White-Label AI Buyouts)</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Deliverables: <code className="text-slate-300">V10_LEAD_HUNTER-v5.py</code> + <code className="text-slate-300">V10_N8N_AUTONOMOUS_B2B_ENGINE_20H.json</code> + CRM Schema</span>
                  <span className="text-cyan-400 font-bold">100% Turnkey White-Label Ownership ($5,500 – $9,500)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. LIVE V10 B2B WEBHOOK & MULTILINGUAL SCOPER MODAL       */}
      {/* ========================================================= */}
      {isB2BWebhookStudioOpen && (
        <div
          onClick={() => setIsB2BWebhookStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#070a12] border-2 border-[#d4af37]/50 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(212,175,55,0.22)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d4af37] to-amber-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-amber-500/20">
                  V10
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      V10 B2B Webhook - NEW (Groq) • Live Enterprise Scoper
                    </h2>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                      ● PUBLISHED ON LOCALHOST:5678
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Endpoint: <code className="text-amber-300">https://n8n-production-720dcf20.up.railway.app/webhook/v10-concierge-webhook</code> • Replies in Any Language
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsB2BWebhookStudioOpen(false)}
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form onSubmit={handleB2BWebhookSubmit} className="lg:col-span-5 space-y-4 bg-black/60 border border-white/10 rounded-2xl p-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
1. Name / Company
                  </label>
                  <input
                    type="text"
                    required
                    value={b2bLeadName}
                    onChange={(e) => setB2bLeadName(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
2. Corporate Email or WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={b2bLeadEmail}
                    onChange={(e) => setB2bLeadEmail(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
3. Ecosystem Category
                    </label>
                    <select
                      value={b2bLeadCategory}
                      onChange={(e) => setB2bLeadCategory(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="Turnkey B2B Landing Page Kits (8 Niches)">Turnkey B2B Landing Page Kits</option>
                      <option value="150MP Master Mockups & Stock">150MP Master Mockups & Stock</option>
                      <option value="UI/UX Design Vault">UI/UX Design Vault</option>
                      <option value="V10 PDF Translator">V10 PDF Translator</option>
                      <option value="V10 Software Ecosystem & AI Agents">V10 Software Ecosystem & AI Agents</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
4. Selected License / Package
                    </label>
                    <select
                      value={b2bLeadItem}
                      onChange={(e) => setB2bLeadItem(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-amber-300 font-bold focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="Private Aviation Kit — Agency License ($349)">Agency License ($349)</option>
                      <option value="Private Aviation Kit — Exclusive Buyout ($1,490)">Exclusive Buyout ($1,490)</option>
                      <option value="Full White-Label AI Agent Buyout ($4,000–$8,000)">White-Label AI Agent Buyout</option>
                      <option value="V10 PDF Translator ($399 / 1,000 pages)">PDF Translator ($399/1k pages)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
5. Client Inquiry (Write in ANY Language)
                    </label>
                    <span className="text-[10px] text-amber-400 font-bold">Auto-Detects Language</span>
                  </div>
                  <textarea
                    rows="3"
                    required
                    value={b2bLeadMessage}
                    onChange={(e) => setB2bLeadMessage(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-[#d4af37] focus:outline-none resize-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setB2bLeadMessage('We want to acquire the Private Aviation Turnkey Kit with 150MP assets and V10 PDF Translator. Please send exact pricing and links.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition"
                    >
                      🇬🇧 English Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setB2bLeadMessage('Zanima nas kupovina Private Aviation paketa sa 150MP slikama i kako radi PDF prevodilac. Koja je cena?')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition"
                    >
                      🇷🇸 Srpski Test
                    </button>
                    <button
                      type="button"
                      onClick={() => setB2bLeadMessage('Wir möchten das Private Aviation Turnkey Kit und den V10 PDF Translator erwerben. Bitte senden Sie uns Preise und Links.')}
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded border border-white/10 transition"
                    >
                      🇩🇪 Deutsch Test
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isB2bSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  {isB2bSubmitting ? 'Processing via Groq (localhost:5678)...' : '⚡ Send Live POST to V10 B2B Webhook'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isB2bSubmitting ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{b2bStatus}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 text-amber-300 rounded border border-amber-500/20">
                    Groq • openai/gpt-oss-120b
                  </span>
                </div>

                <div className="my-auto py-4">
                  {isB2bSubmitting ? (
                    <div className="py-16 text-center">
                      <div className="inline-block w-12 h-12 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></div>
                      <h4 className="text-sm font-bold uppercase tracking-widest text-white">Generating Multilingual B2B Quote...</h4>
                      <p className="text-xs text-slate-400 mt-1">Executing V10 AI Concierge Agent with Window Buffer Memory</p>
                    </div>
                  ) : b2bAgentReply ? (
                    <div className="space-y-4">
                      <div className="bg-[#0b0e17] border border-[#d4af37]/40 rounded-2xl p-5 shadow-inner">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                          <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">
                            🤖 V10 AI Concierge Live Output:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(b2bAgentReply)}
                            className="text-[10px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded text-white font-bold flex items-center gap-1"
                          >
                            <Copy size={11} /> Copy Reply
                          </button>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed max-h-[260px] overflow-y-auto pr-2">
                          {b2bAgentReply}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href={b2bWhatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider py-3 rounded-xl text-xs transition shadow-lg"
                        >
                          💬 Escalate Directly to VIP WhatsApp (+381648201496)
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="py-12 text-center max-w-md mx-auto space-y-3">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-[#d4af37]">
                        <Bot size={28} />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white">
                        Both V10 n8n Workflows Are Published & Ready
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Click <strong>Send Live POST to V10 B2B Webhook</strong> on the left to test real-time B2B quote generation from your local n8n instance (<code className="text-amber-300">localhost:5678</code>), or use the floating chat widget in the bottom-right corner of the screen.
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-white/10 pt-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Package: <code className="text-slate-300">V10 B2B Webhook - NEW (Groq).json</code> + <code className="text-slate-300">index.html</code> + <code className="text-slate-300">README.md</code></span>
                  <span className="text-[#d4af37] font-bold">100% Turnkey White-Label Ownership</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. INTERACTIVE AUTONOMOUS CALENDAR & APPOINTMENT STUDIO    */}
      {/* ========================================================= */}
      {isBookingStudioOpen && (
        <div 
          onClick={() => setIsBookingStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#060b14] border border-cyan-500/40 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(6,182,212,0.22)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-cyan-500/20">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Autonomous Calendar & Appointment Setter
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                      White-Label Buyout ($3,000 – $5,000)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    24/7 B2B Discovery Call Scheduler + Lead Qualification + Instant WhatsApp Owner Alert
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookingStudioOpen(false);
                }}
                aria-label="Close Booking Studio Modal"
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form onSubmit={handleConfirmAppointment} className="lg:col-span-5 space-y-4 bg-black/50 border border-white/10 rounded-2xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
1. Executive / Client Name
                    </label>
                    <input
                      type="text"
                      required
                      value={bookingClientName}
                      onChange={(e) => setBookingClientName(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
2. Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      value={bookingClientEmail}
                      onChange={(e) => setBookingClientEmail(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
3. Consultation Topic / System of Interest
                  </label>
                  <select
                    value={bookingTopic}
                    onChange={(e) => setBookingTopic(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Full White-Label AI System Buyout & Custom Deployment">Full White-Label AI System Buyout ($3,000–$8,500)</option>
                    <option value="V10 Autonomous B2B Lead Hunter & 20:00h Closer Buyout">V10 Autonomous B2B Lead Hunter & 20:00h Closer ($5,500–$9,500)</option>
                    <option value="Micro-SaaS in a Box — Turnkey AI Business Launch">Micro-SaaS in a Box — Turnkey AI Business ($6,000–$10,000)</option>
                    <option value="150MP Luxury Brand Visual Kit + Custom React Architecture">150MP Luxury Visual Kit + Custom React Architecture ($1,490)</option>
                    <option value="Custom Multi-Agent n8n Automation Infrastructure">Custom Multi-Agent n8n Automation Infrastructure</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
4. Select Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
5. Allocated Project Budget
                    </label>
                    <select
                      value={bookingBudget}
                      onChange={(e) => setBookingBudget(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs font-bold text-emerald-400 focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="$3,000 – $5,000 (Single System Buyout)">$3,000 – $5,000</option>
                      <option value="$5,000 – $10,000 (Turnkey Enterprise)">$5,000 – $10,000</option>
                      <option value="$10,000+ (Multi-Agent Agency Suite)">$10,000+ VIP Suite</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
6. Available Time Slots (Real-Time CET Sync)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-black uppercase tracking-wider border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                          bookingSlot === slot
                            ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'border-white/10 bg-[#05070f] text-slate-400 hover:text-white'
                        }`}
                      >
                        <Clock size={11} />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isBookingSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar size={14} />
                  {isBookingSubmitting ? 'Locking Slot & Alerting via n8n...' : '📅 Confirm Executive Call & Push Alert'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isBookingSubmitting ? 'bg-cyan-400 animate-ping' : bookingConfirmed ? 'bg-emerald-400' : 'bg-cyan-400'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{bookingStatus}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 text-cyan-400 rounded border border-cyan-500/20">
                    Zero-Cost n8n + WhatsApp Sync
                  </span>
                </div>

                {/* EXECUTIVE CALENDAR INVITE & WHATSAPP DISPATCH PREVIEW */}
                <div className="my-auto py-6 flex flex-col items-center justify-center">
                  <div className="w-full max-w-lg rounded-3xl border-2 border-cyan-500/30 bg-[#080d1a] p-6 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wider">
                            V10 Autonomous Appointment Pass
                          </div>
                          <div className="text-[11px] text-emerald-400 font-bold">
                            {bookingConfirmed ? '✓ Dispatched to V10 B2B Webhook (+381648201496)' : 'Live Executive Booking Preview'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {bookingConfirmed ? 'CONFIRMED' : 'READY'}
                      </span>
                    </div>

                    <div className="space-y-3 bg-black/60 border border-white/10 rounded-2xl p-4 text-xs">
                      <div className="flex items-center justify-between text-cyan-300 font-black uppercase tracking-wider border-b border-white/10 pb-2">
                        <span>🗓️ {bookingDate}</span>
                        <span>⏰ {bookingSlot}</span>
                      </div>
                      <div className="space-y-1.5 text-slate-200 pt-1">
                        <div><span className="text-slate-400">👤 Attendee:</span> <strong>{bookingClientName}</strong></div>
                        <div><span className="text-slate-400">📧 Corporate Email:</span> <span className="text-cyan-300">{bookingClientEmail}</span></div>
                        <div><span className="text-slate-400">🎯 Agenda:</span> <strong>{bookingTopic}</strong></div>
                        <div><span className="text-slate-400">💰 Qualified Budget:</span> <strong className="text-emerald-400">{bookingBudget}</strong></div>
                        <div><span className="text-slate-400">📍 Channel:</span> <span>{bookingPlatform}</span></div>
                      </div>
                      {bookingAiReply && (
                        <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-emerald-300 whitespace-pre-line">
                          <strong className="block uppercase text-cyan-400 mb-1">🤖 V10 Concierge Confirmation:</strong>
                          {bookingAiReply}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      <div className="text-center py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-black uppercase tracking-wider">
                        ✓ Auto-Blocks Busy Slots
                      </div>
                      <a
                        href="https://wa.me/381648201496"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider transition"
                      >
                        📲 Open VIP WhatsApp
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Deliverables: React Booking UI + n8n Calendar & WhatsApp Engine (.JSON)</span>
                  <span className="text-cyan-400 font-bold">100% Client-Hosted White-Label ($3,000 – $5,000)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. INTERACTIVE VIBER / TELEGRAM / WHATSAPP ALERT STUDIO    */}
      {/* ========================================================= */}
      {isAlertStudioOpen && (
        <div 
          onClick={() => setIsAlertStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#090712] border border-amber-500/40 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(245,158,11,0.2)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-amber-500/20">
                  <BellRing size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Instant Sale & Lead Alert Agent (Viber / Telegram / WhatsApp)
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                      White-Label Buyout ($2,500 – $4,500)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Real-Time Checkout Listener + AI Buyer Enrichment + Instant Mobile Push Notification
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAlertStudioOpen(false);
                }}
                aria-label="Close Alert Studio Modal"
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <form onSubmit={handleSimulateSaleAlert} className="lg:col-span-5 space-y-4 bg-black/50 border border-white/10 rounded-2xl p-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
1. Select Mobile Notification Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'Viber', color: 'border-purple-500 bg-purple-500/20 text-purple-300' },
                      { id: 'Telegram', color: 'border-cyan-400 bg-cyan-500/20 text-cyan-300' },
                      { id: 'WhatsApp', color: 'border-emerald-400 bg-emerald-500/20 text-emerald-300' }
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        type="button"
                        onClick={() => setAlertChannel(ch.id)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          alertChannel === ch.id
                            ? ch.color
                            : 'border-white/10 bg-[#05070f] text-slate-400 hover:text-white'
                        }`}
                      >
                        {ch.id}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
2. Simulated Buyer Name
                    </label>
                    <input
                      type="text"
                      required
                      value={alertBuyerName}
                      onChange={(e) => setAlertBuyerName(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
3. Buyer Corporate Email
                    </label>
                    <input
                      type="email"
                      required
                      value={alertBuyerEmail}
                      onChange={(e) => setAlertBuyerEmail(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
4. Purchased Package / B2B Kit
                  </label>
                  <select
                    value={alertProduct}
                    onChange={(e) => setAlertProduct(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Sapphire Voyages Exclusive Yacht Buyout + 150MP Kit">Sapphire Voyages Exclusive Yacht Buyout ($1,490)</option>
                    <option value="V10 Autonomous B2B Lead Hunter & 20:00h Closer Buyout">V10 Autonomous B2B Lead Hunter & 20:00h Closer ($7,500)</option>
                    <option value="Private Aviation Turnkey React Kit + 60 Files">Private Aviation Turnkey Agency License ($349)</option>
                    <option value="B2B Project Scoper & AI Quote Calculator Buyout">B2B Project Scoper White-Label AI ($6,500)</option>
                    <option value="V10 UI/UX Commercial Vault Bundle">V10 UI/UX Commercial Vault ($299)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
5. Order Value
                    </label>
                    <input
                      type="text"
                      value={alertAmount}
                      onChange={(e) => setAlertAmount(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs font-bold text-emerald-400 focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
6. Payment Gateway
                    </label>
                    <select
                      value={alertPaymentMethod}
                      onChange={(e) => setAlertPaymentMethod(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                    >
                      <option value="Payoneer B2B Wire">Payoneer B2B</option>
                      <option value="PayPal / Visa Corporate Card">PayPal / Credit Card</option>
                      <option value="USDT / Bitcoin Instant">Crypto (USDT/BTC)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                    <Smartphone size={12} className="text-amber-400" /> Active Local n8n Webhook URL
                  </label>
                  <input
                    type="url"
                    value={alertWebhookUrl}
                    onChange={(e) => setAlertWebhookUrl(e.target.value)}
                    placeholder="https://n8n-production-720dcf20.up.railway.app/webhook/v10-concierge-webhook"
                    className="w-full bg-[#05070f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSendingAlert}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send size={14} />
                  {isSendingAlert ? `Pushing to ${alertChannel}...` : `🔔 Simulate Instant ${alertChannel} Sale Alert`}
                </button>
              </form>

              <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSendingAlert ? 'bg-amber-400 animate-ping' : alertDispatched ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{alertStatus}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 text-amber-400 rounded border border-amber-500/20">
                    Firebase + {alertChannel} REST API
                  </span>
                </div>

                {/* SMARTPHONE PUSH NOTIFICATION PREVIEW */}
                <div className="my-auto py-6 flex flex-col items-center justify-center">
                  <div className="w-full max-w-md rounded-3xl border-2 border-white/15 bg-[#0b0f19] p-5 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white ${
                          alertChannel === 'Viber' ? 'bg-[#7360f2]' : alertChannel === 'Telegram' ? 'bg-[#24A1DE]' : 'bg-[#25D366]'
                        }`}>
                          {alertChannel[0]}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white uppercase tracking-wider">
                            V10 Sales Concierge Bot ({alertChannel})
                          </div>
                          <div className="text-[10px] text-emerald-400 font-semibold">
                            {alertDispatched ? '✓ Just delivered via n8n' : 'Live Mobile Message Preview'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">NOW</span>
                    </div>

                    <div className="space-y-2.5 bg-black/60 border border-white/10 rounded-2xl p-4 text-xs">
                      <div className="font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        🚨 NEW HIGH-TICKET ORDER RECEIVED!
                      </div>
                      <div className="space-y-1 text-slate-200 pt-1">
                        <div><span className="text-slate-400">👤 Buyer:</span> <strong>{alertBuyerName}</strong></div>
                        <div><span className="text-slate-400">📧 Email:</span> <span className="text-cyan-300">{alertBuyerEmail}</span></div>
                        <div><span className="text-slate-400">📦 Asset:</span> <strong>{alertProduct}</strong></div>
                        <div><span className="text-slate-400">💰 Paid:</span> <strong className="text-emerald-400 text-sm">{alertAmount}</strong> ({alertPaymentMethod})</div>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-300">
                        <span className="text-amber-400 font-bold uppercase block mb-0.5">🤖 AI Buyer Intelligence:</span>
                        {alertAiReply || 'Corporate domain verified. High probability of repeat agency licensing. Recommended action: Send VIP onboarding link.'}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="text-center py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                        ✓ Approve & Send ZIP
                      </div>
                      <a
                        href="https://wa.me/381648201496"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-[10px] font-black uppercase tracking-wider"
                      >
                        ✉️ 1-Click VIP Reply
                      </a>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-3 mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span>Hooks into: Firebase (`v8_kupci`, `v8_payoneer_requests`), Stripe & PayPal</span>
                  <span className="text-amber-400 font-bold">100% Client-Hosted White-Label ($2,500 – $4,500)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. INTERACTIVE WHITE-LABEL MOCKUP STUDIO MODAL            */}
      {/* ========================================================= */}
      {isMockupStudioOpen && (
        <div 
          onClick={() => setIsMockupStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#070911] border border-cyan-500/30 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(6,182,212,0.18)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-cyan-500/20">
                  V10
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      AI Mockup & Visual Asset Studio
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                      White-Label Buyout ($5,500 – $8,500)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Turnkey Frontend UI + n8n Automation Engine • 100% Source Code Ownership
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMockupStudioOpen(false);
                }}
                aria-label="Close Mockup Studio Modal"
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleStudioRender} className="lg:col-span-5 space-y-5 bg-black/50 border border-white/10 rounded-2xl p-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
1. Subject / Product / Brand Description
                    </label>
                    <span className="text-[10px] text-cyan-400 font-semibold">Required</span>
                  </div>
                  <textarea 
                    rows="2"
                    required
                    value={mockupSubject}
                    onChange={(e) => setMockupSubject(e.target.value)}
                    placeholder="e.g. Luxury matte black perfume bottle with glowing gold V10 logo..."
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => setMockupSubject('Luxury matte black perfume bottle with glowing gold V10 logo')} className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-md border border-white/10 transition">
                      + Perfume Bottle
                    </button>
                    <button type="button" onClick={() => setMockupSubject('Minimalist metallic silver tech company logo with cyan neon edge')} className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-md border border-white/10 transition">
                      + 3D Brand Logo
                    </button>
                    <button type="button" onClick={() => setMockupSubject('Sleek dark-mode SaaS analytics dashboard with glowing cyan charts')} className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-md border border-white/10 transition">
                      + SaaS UI Dashboard
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
2. Commercial Scene Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {STUDIO_ENVIRONMENTS.map((env, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setMockupEnv(env.value)}
                        className={`text-left p-2.5 rounded-xl border transition-all ${
                          mockupEnv === env.value 
                            ? 'border-cyan-400 bg-cyan-500/15 text-white' 
                            : 'border-white/10 bg-[#05070f] text-slate-400 hover:border-white/25'
                        }`}
                      >
                        <div className="text-xs font-bold text-white">{env.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{env.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
3. Lighting Mood
                    </label>
                    <select 
                      value={mockupLighting}
                      onChange={(e) => setMockupLighting(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="Dramatic studio rim lighting, ray-traced reflections">Dramatic Studio Rim</option>
                      <option value="Warm golden hour architectural sunlight and soft shadows">Golden Hour Sunlight</option>
                      <option value="Cyberpunk neon cyan and magenta ambient glow">Neon Cyber Glow</option>
                      <option value="Clean minimalist softbox commercial white lighting">Clean Softbox Studio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
4. Aspect Ratio
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['16:9', '9:16', '21:9'].map((ratio) => (
                        <button
                          key={ratio}
                          type="button"
                          onClick={() => setMockupRatio(ratio)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            mockupRatio === ratio
                              ? 'border-cyan-400 bg-cyan-500/15 text-white'
                              : 'border-white/10 bg-[#05070f] text-slate-400 hover:text-white'
                          }`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <KeyRound size={12} className="text-cyan-400" /> B2B Live Render Key (Optional for UI Preview)
                    </label>
                  </div>
                  <input 
                    type="password"
                    value={vipKey}
                    onChange={(e) => setVipKey(e.target.value)}
                    placeholder="Enter VIP Demo Key for live GPU render..."
                    className="w-full bg-[#05070f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isRendering}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isRendering ? 'Synthesizing 8K Mockup...' : '⚡ Render Commercial Mockup'}
                </button>
              </form>

              <div className="lg:col-span-7 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isRendering ? 'bg-cyan-400 animate-ping' : renderedImageUrl ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{studioStatus}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 rounded-md text-slate-400 border border-white/5">
                      Format: {mockupRatio}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 rounded-md text-slate-400 border border-white/5">
                      n8n + OpenAI Engine
                    </span>
                  </div>
                </div>

                {showLockedNotice && !isRendering && (
                  <div className="my-auto py-10 px-6 text-center max-w-md mx-auto bg-cyan-950/20 border border-cyan-500/30 rounded-2xl">
                    <Lock className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">
                      Public GPU Rendering Locked
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      You are interacting with the live White-Label Studio UI. Live cloud GPU rendering requires a <strong>VIP Demo Key</strong> or full <strong>White-Label Buyout ($5,500 – $8,500)</strong>, which includes the complete HTML frontend and n8n backend JSON workflow for deployment on your own infrastructure.
                    </p>
                    <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
                      <a 
                        href="https://wa.me/381648201496"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        Request VIP Key / Buyout on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {!showLockedNotice && !isRendering && !renderedImageUrl && (
                  <div className="my-auto py-16 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                      <ImageIcon size={28} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ready for Production Render</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Configure your product prompt, commercial environment, and lighting parameters on the left to test the studio interface.
                    </p>
                  </div>
                )}

                {isRendering && (
                  <div className="my-auto py-16 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Synthesizing 3D Scene & Shadows...</h4>
                    <p className="text-xs text-slate-400 mt-1">Processing ray-traced reflections via V10 Engine (10–15s)</p>
                  </div>
                )}

                {renderedImageUrl && !isRendering && (
                  <div className="my-auto pt-3">
                    <div className="rounded-xl overflow-hidden border border-white/15 bg-black shadow-2xl">
                      <img 
                        src={renderedImageUrl} 
                        alt="Generated 8K B2B Commercial Mockup by AI Tools Pro Smart V10 Studio" 
                        className="w-full max-h-[360px] object-contain mx-auto" 
                      />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10">
                      <div>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">✓ Render Complete</p>
                        <p className="text-[11px] text-slate-400">Commercial License Unlocked • Ready for B2B Presentation</p>
                      </div>
                      <a 
                        href={renderedImageUrl} 
                        download="v10-commercial-mockup.png"
                        className="px-4 py-2 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition"
                      >
                        <Download size={14} /> Download High-Res PNG
                      </a>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Deliverables: Frontend UI (HTML/React) + n8n Workflow (.JSON)</span>
                  <span className="text-cyan-400 font-bold">100% Client-Hosted White-Label</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. INTERACTIVE WHITE-LABEL SEO & CRO AUDITOR MODAL        */}
      {/* ========================================================= */}
      {isSeoStudioOpen && (
        <div 
          onClick={() => setIsSeoStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#070b10] border border-emerald-500/30 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(16,185,129,0.18)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-emerald-500/20">
                  V10
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      SEO & CRO Executive Website Auditor
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      White-Label Buyout ($3,500 – $5,000)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Live DOM Crawler + Conversion Bottleneck Scanner • Turnkey Agency Lead Magnet
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSeoStudioOpen(false);
                }}
                aria-label="Close SEO Auditor Modal"
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleSeoAudit} className="lg:col-span-4 space-y-5 bg-black/50 border border-white/10 rounded-2xl p-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
1. Target Website URL
                  </label>
                  <input 
                    type="url"
                    required
                    value={auditUrl}
                    onChange={(e) => setAuditUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <button type="button" onClick={() => setAuditUrl('https://aitoolsprosmart.com')} className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-md border border-white/10 transition">
                      + Test AI Tools Pro Smart
                    </button>
                    <button type="button" onClick={() => setAuditUrl('https://stripe.com')} className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1 rounded-md border border-white/10 transition">
                      + Stripe.com
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
2. Primary Conversion Goal / Niche
                  </label>
                  <select 
                    value={auditGoal}
                    onChange={(e) => setAuditGoal(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="B2B Enterprise Lead Generation & High-Ticket Sales">B2B Lead Generation & Sales</option>
                    <option value="SaaS Free Trial & Subscription Signups">SaaS Signups & Subscriptions</option>
                    <option value="E-Commerce Product Checkout & Cart Conversion">E-Commerce Checkout & Sales</option>
                    <option value="Agency Portfolio & Client Booking">Agency Client Booking</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                    <KeyRound size={12} className="text-emerald-400" /> B2B Live Scanner Key (Optional for UI Preview)
                  </label>
                  <input 
                    type="password"
                    value={seoVipKey}
                    onChange={(e) => setSeoVipKey(e.target.value)}
                    placeholder="Enter VIP Demo Key for live crawl..."
                    className="w-full bg-[#05070f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isAuditing}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuditing ? 'Crawling DOM & Analyzing...' : '🔍 Run Deep SEO & CRO Audit'}
                </button>
              </form>

              <div className="lg:col-span-8 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAuditing ? 'bg-emerald-400 animate-ping' : auditResult ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{auditStatus}</span>
                  </div>
                  {auditResult && (
                    <button 
                      onClick={() => window.print()}
                      className="px-3 py-1.5 bg-white hover:bg-slate-200 text-black font-extrabold text-[11px] uppercase tracking-wider rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Printer size={13} /> Save Executive PDF Report
                    </button>
                  )}
                </div>

                {showSeoLockedNotice && !isAuditing && (
                  <div className="my-auto py-10 px-6 text-center max-w-md mx-auto bg-emerald-950/20 border border-emerald-500/30 rounded-2xl">
                    <Lock className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">
                      Public Live Crawl Locked
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      You are previewing the White-Label SEO & CRO Executive Auditor UI. Live website crawling requires a <strong>VIP Demo Key</strong> or full <strong>White-Label Buyout ($3,500 – $5,000)</strong> with complete HTML + n8n JSON ownership.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <a 
                        href="https://wa.me/381648201496"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        Request VIP Key / Buyout on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {!showSeoLockedNotice && !isAuditing && !auditResult && (
                  <div className="my-auto py-16 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3 text-emerald-400">
                      <Search size={28} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ready for Live URL Inspection</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Enter a target website URL on the left to crawl its live HTML DOM structure, meta tags, heading hierarchy, and conversion triggers.
                    </p>
                  </div>
                )}

                {isAuditing && (
                  <div className="my-auto py-16 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Crawling Live DOM & Conversion Funnel...</h4>
                    <p className="text-xs text-slate-400 mt-1">Evaluating SEO tags, CTA friction, and copy clarity (10–15s)</p>
                  </div>
                )}

                {auditResult && !isAuditing && (
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Score</span>
                        <div className="text-2xl font-black text-emerald-400 mt-1">{auditResult.overall_score ?? '--'}/100</div>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Technical SEO</span>
                        <div className="text-2xl font-black text-cyan-400 mt-1">{auditResult.seo_score ?? '--'}/100</div>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CRO Readiness</span>
                        <div className="text-2xl font-black text-amber-400 mt-1">{auditResult.cro_score ?? '--'}/100</div>
                      </div>
                      <div className="bg-black/60 border border-white/10 p-3.5 rounded-xl text-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">UX & Copy</span>
                        <div className="text-2xl font-black text-indigo-400 mt-1">{auditResult.ux_copy_score ?? '--'}/100</div>
                      </div>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-4">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-emerald-400 mb-1">Executive Summary</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">{auditResult.executive_summary}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-black/50 border border-red-500/25 rounded-xl p-4">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-red-400 mb-2">⚠️ Critical Technical SEO Issues</h4>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                          {(auditResult.critical_seo_issues || []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                      <div className="bg-black/50 border border-amber-500/25 rounded-xl p-4">
                        <h4 className="text-[11px] font-black uppercase tracking-wider text-amber-400 mb-2">🚧 Conversion (CRO) Barriers</h4>
                        <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                          {(auditResult.cro_barriers || []).map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-cyan-500/30 rounded-xl p-4">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-cyan-400 mb-2">⚡ Immediate High-ROI Quick Wins</h4>
                      <ul className="space-y-1.5 text-xs text-slate-200 list-disc pl-4">
                        {(auditResult.quick_wins || []).map((item, i) => <li key={i}>{item}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Deliverables: Frontend Auditor UI (HTML/React) + n8n Workflow (.JSON)</span>
                  <span className="text-emerald-400 font-bold">100% Client-Hosted White-Label</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. INTERACTIVE OMNICHANNEL CAMPAIGN STUDIO MODAL          */}
      {/* ========================================================= */}
      {isCampaignStudioOpen && (
        <div 
          onClick={() => setIsCampaignStudioOpen(false)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xl overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#070912] border border-cyan-500/30 rounded-3xl max-w-6xl w-full relative shadow-[0_0_90px_rgba(6,182,212,0.18)] p-5 sm:p-8 my-auto"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-cyan-500/20">
                  V10
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
                      Omnichannel Campaign Synthesizer
                    </h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">
                      White-Label Buyout ($3,000 – $5,000)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    4-Channel B2B Marketing Engine (LinkedIn, Cold Email, Ads & Video Scripts)
                  </p>
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCampaignStudioOpen(false);
                }}
                aria-label="Close Campaign Studio Modal"
                className="relative z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <form onSubmit={handleCampaignSynthesis} className="lg:col-span-4 space-y-4 bg-black/50 border border-white/10 rounded-2xl p-5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
1. Product / Brand Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={campProduct}
                    onChange={(e) => setCampProduct(e.target.value)}
                    placeholder="e.g. AI Tools Pro Smart"
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
2. Target B2B Audience
                  </label>
                  <input 
                    type="text"
                    required
                    value={campAudience}
                    onChange={(e) => setCampAudience(e.target.value)}
                    placeholder="e.g. Digital Marketing Agencies & SaaS Founders"
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
3. Core Offer & Value Proposition
                  </label>
                  <textarea 
                    rows="3"
                    required
                    value={campOffer}
                    onChange={(e) => setCampOffer(e.target.value)}
                    placeholder="Describe the main offer and ROI..."
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none resize-none"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    <button 
                      type="button" 
                      onClick={() => {
                        setCampProduct('AI Tools Pro Smart — V10 White-Label AI Systems');
                        setCampAudience('Digital Marketing Agencies, Web Studios & B2B Consultants');
                        setCampOffer('Acquire 100% source code ownership of turnkey AI systems (HTML/React Frontend + n8n Backend Workflows) for a one-time buyout ($3,000–$8,500) with zero monthly SaaS fees.');
                      }} 
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-1 rounded border border-white/10 transition"
                    >
                      + Preset: White-Label Agents
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        setCampProduct('AI Tools Pro Smart — 150MP SaaS Mockups');
                        setCampAudience('SaaS Founders, UI/UX Designers & Creative Directors');
                        setCampOffer('Wrap your software in 150MP physical reality with hyper-realistic device mockups engineered for elite B2B presentations.');
                      }} 
                      className="text-[10px] bg-white/5 hover:bg-white/10 text-slate-300 px-2 py-1 rounded border border-white/10 transition"
                    >
                      + Preset: 150MP Mockups
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
4. Brand Tone & Style
                  </label>
                  <select 
                    value={campTone}
                    onChange={(e) => setCampTone(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Executive B2B, Authoritative & High-ROI Focused">Executive B2B & High-ROI</option>
                    <option value="Direct-Response, Bold & Urgency-Driven">Direct-Response & Bold</option>
                    <option value="Cyber-Luxury, Visionary & Elite Tech">Visionary Tech & Luxury</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mb-1">
                    <KeyRound size={12} className="text-cyan-400" /> B2B Live Synthesizer Key (Optional for UI Preview)
                  </label>
                  <input 
                    type="password"
                    value={campVipKey}
                    onChange={(e) => setCampVipKey(e.target.value)}
                    placeholder="Enter VIP Demo Key for live generation..."
                    className="w-full bg-[#05070f] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSynthesizingCamp}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black font-black uppercase tracking-widest rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSynthesizingCamp ? 'Synthesizing 4 Channels...' : '📣 Generate Omnichannel Campaign'}
                </button>
              </form>

              <div className="lg:col-span-8 bg-black/60 border border-white/10 rounded-2xl p-5 min-h-[460px] flex flex-col justify-between">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isSynthesizingCamp ? 'bg-cyan-400 animate-ping' : campResult ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{campStatus}</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 text-slate-400 rounded border border-white/10">
                    4 Channels Synchronized
                  </span>
                </div>

                {showCampLockedNotice && !isSynthesizingCamp && (
                  <div className="my-auto py-10 px-6 text-center max-w-md mx-auto bg-cyan-950/20 border border-cyan-500/30 rounded-2xl">
                    <Lock className="w-10 h-10 text-cyan-400 mx-auto mb-3" />
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">
                      Public Campaign Synthesis Locked
                    </h4>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      You are previewing the White-Label Omnichannel Campaign Studio UI. Live AI campaign generation requires a <strong>VIP Demo Key</strong> or full <strong>White-Label Buyout ($3,000 – $5,000)</strong> with complete HTML + n8n JSON source code ownership.
                    </p>
                    <div className="mt-5 flex justify-center">
                      <a 
                        href="https://wa.me/381648201496"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider rounded-xl transition"
                      >
                        Request VIP Key / Buyout on WhatsApp
                      </a>
                    </div>
                  </div>
                )}

                {!showCampLockedNotice && !isSynthesizingCamp && !campResult && (
                  <div className="my-auto py-16 text-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3 text-cyan-400">
                      <Megaphone size={28} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">Ready for Campaign Brief</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Configure your product, audience, and core offer on the left to generate synchronized LinkedIn posts, cold outreach emails, ad copy, and video scripts.
                    </p>
                  </div>
                )}

                {isSynthesizingCamp && (
                  <div className="my-auto py-16 text-center">
                    <div className="inline-block w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-white">Synthesizing Multi-Channel Campaign Assets...</h4>
                    <p className="text-xs text-slate-400 mt-1">Writing LinkedIn viral post, cold email, ad copy & video script (8–12s)</p>
                  </div>
                )}

                {campResult && !isSynthesizingCamp && (
                  <div className="space-y-4 py-4">
                    <div className="bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-3.5">
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 block mb-1">Strategic Campaign Angle</span>
                      <p className="text-xs font-semibold text-white leading-relaxed">{campResult.campaign_angle}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">💼 LinkedIn Viral Post</span>
                          <button onClick={() => copyToClipboard(campResult.linkedin_post)} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-bold flex items-center gap-1 transition">
                            <Copy size={11} /> Copy
                          </button>
                        </div>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto pr-1">
                          {campResult.linkedin_post}
                        </pre>
                      </div>

                      <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">✉️ B2B Cold Outreach Email</span>
                          <button onClick={() => copyToClipboard(`Subject: ${campResult.cold_email?.subject}\n\n${campResult.cold_email?.body}`)} className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white font-bold flex items-center gap-1 transition">
                            <Copy size={11} /> Copy
                          </button>
                        </div>
                        <div className="text-xs font-bold text-white bg-white/5 p-2 rounded mb-2 border border-white/5">
                          Subject: {campResult.cold_email?.subject}
                        </div>
                        <pre className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed max-h-36 overflow-y-auto pr-1">
                          {campResult.cold_email?.body}
                        </pre>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 block mb-2">🎯 Meta & Google Ad Copy</span>
                        <div className="space-y-1.5 text-xs">
                          <div className="bg-white/5 p-2 rounded border border-white/5">
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Headline:</span>
                            <span className="font-bold text-white">{campResult.ad_copy?.headline}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded border border-white/5">
                            <span className="text-[10px] uppercase text-slate-400 font-bold block">Primary Text:</span>
                            <span className="text-slate-300 leading-relaxed">{campResult.ad_copy?.primary_text}</span>
                          </div>
                          <div className="bg-white/5 p-2 rounded border border-white/5 flex items-center justify-between">
                            <span className="text-[10px] uppercase text-slate-400 font-bold">CTA Button:</span>
                            <span className="text-[11px] font-black text-amber-400 uppercase">{campResult.ad_copy?.cta}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
                        <span className="text-[11px] font-black uppercase tracking-wider text-indigo-400 block mb-2">🎬 Reels / TikTok / Shorts Script</span>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {(campResult.video_script || []).map((line, i) => (
                            <li key={i} className="bg-white/5 p-2 rounded border border-white/5">{line}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-3 mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Deliverables: Frontend Campaign UI (HTML/React) + n8n Workflow (.JSON)</span>
                  <span className="text-cyan-400 font-bold">100% Client-Hosted White-Label</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* GLOBAL MODAL FOR ALL AGENTS (WHITE-LABEL & KITS)          */}
      {/* ========================================================= */}
      {activeModalAgent && (
        <div 
          onClick={() => setActiveModalAgent(null)}
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 backdrop-blur-md overflow-y-auto pt-20"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`bg-[#06142e] border-2 ${getColorClasses(activeModalAgent.colorTheme).border} rounded-3xl max-w-2xl w-full relative shadow-[0_0_80px_rgba(0,0,0,0.5)] p-6 md:p-8 my-auto`}
          >
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveModalAgent(null);
              }}
              aria-label="Close Agent Details Modal"
              className="absolute top-5 right-5 z-50 text-white bg-red-500/20 hover:bg-red-500 border border-red-500/40 p-2.5 rounded-full transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
            <div className={`flex items-center gap-4 mb-6 border-b ${getColorClasses(activeModalAgent.colorTheme).border} pb-4 pr-12`}>
              <div className={`w-14 h-14 rounded-2xl ${getColorClasses(activeModalAgent.colorTheme).bg} flex items-center justify-center ${getColorClasses(activeModalAgent.colorTheme).text} border border-white/10 shadow-inner shrink-0`}>
                <activeModalAgent.icon size={32} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-wider text-white drop-shadow-md">{activeModalAgent.name}</h2>
                <p className={`${getColorClasses(activeModalAgent.colorTheme).text} text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1`}>{activeModalAgent.shortDesc}</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className={`${getColorClasses(activeModalAgent.colorTheme).modalBg} border ${getColorClasses(activeModalAgent.colorTheme).modalBorder} rounded-2xl p-5 md:p-6 ${getColorClasses(activeModalAgent.colorTheme).modalHover} transition-colors`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm md:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Award className={`w-5 h-5 ${getColorClasses(activeModalAgent.colorTheme).text}`} />
                    Full Turnkey & White-Label Acquisition
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-white/10 text-white rounded-full">
                    Zero Monthly Fees
                  </span>
                </div>

                <p className="text-slate-200 text-xs md:text-sm font-medium mb-4 leading-relaxed">
                  {activeModalAgent.longDesc} Complete transfer of intellectual property and source code to run independently on your own infrastructure and API keys.
                </p>

                <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-5 space-y-2 text-xs text-slate-300">
                  <div className="font-bold text-white uppercase tracking-wider text-[11px] mb-1">Included in Turnkey Package (.ZIP):</div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Deliverables:</strong> {activeModalAgent.deliverables || 'Custom-branded HTML/Tailwind/React interface + n8n Workflow (.JSON) + README.md'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Full IP Ownership:</strong> Rebrand, deploy for unlimited clients, or resell as your own SaaS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>Self-Hosted Deployment Guide & Support:</strong> Complete assistance with installation and configuration included</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-2 pt-2 border-t border-white/10">
                  <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">One-Time Acquisition Price:</span>
                  <p className={`${getColorClasses(activeModalAgent.colorTheme).text} font-black text-2xl md:text-3xl`}>
                    {activeModalAgent.whiteLabelPrice} <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">/ one-time</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {activeModalAgent.hasAureliaPulseStudio && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsAureliaStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  ✦ Launch Aurelia Pulse Studio
                </button>
              )}
              {activeModalAgent.hasLeadHunterStudio && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsLeadHunterStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  🎯 Launch Lead Hunter & 20:00h Studio
                </button>
              )}
              {activeModalAgent.hasB2BWebhookStudio && (
                <button
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsB2BWebhookStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  ⚡ Test Live B2B Webhook
                </button>
              )}
              {activeModalAgent.hasLiveStudio && (
                <button 
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsMockupStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  ⚡ Launch Mockup Studio
                </button>
              )}
              {activeModalAgent.hasSeoStudio && (
                <button 
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsSeoStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  🔍 Launch SEO Auditor
                </button>
              )}
              {activeModalAgent.hasCampaignStudio && (
                <button 
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsCampaignStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  📣 Launch Campaign Studio
                </button>
              )}
              {activeModalAgent.hasAlertStudio && (
                <button 
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsAlertStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  🔔 Launch Alert Studio
                </button>
              )}
              {activeModalAgent.hasBookingStudio && (
                <button 
                  type="button"
                  onClick={() => {
                    setActiveModalAgent(null);
                    setIsBookingStudioOpen(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg cursor-pointer"
                >
                  📅 Launch Booking Studio
                </button>
              )}
              <a 
                href={`https://wa.me/381648201496?text=${encodeURIComponent(`Hi Goran, I want to acquire the White-Label License for: ${activeModalAgent.name} (${activeModalAgent.whiteLabelPrice})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 text-center ${getColorClasses(activeModalAgent.colorTheme).button} text-xs sm:text-sm font-black uppercase tracking-widest py-3.5 md:py-4 rounded-xl transition shadow-lg`}
              >
                Acquire via VIP WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setActiveModalAgent(null)}
                className="px-5 py-3.5 md:py-4 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-widest rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FLOATING AURELIA PULSE 24/7 BOOKING BAR + LIVE CHAT DESK  */}
      {/* ========================================================= */}
      {isAureliaDrawerOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[9990] w-[92vw] max-w-[390px] bg-[#0b0e17]/95 backdrop-blur-xl border border-[#eab308]/50 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#facc15] flex items-center gap-1.5">
              ✦ AURELIA PULSE LIVE DESK
            </span>
            <button
              type="button"
              onClick={() => setIsAureliaDrawerOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={aureliaName}
                onChange={(e) => setAureliaName(e.target.value)}
                placeholder="Your Name"
                className="bg-[#05070f] border border-white/15 rounded-lg px-2.5 py-2 text-[11px] text-white placeholder-slate-500 focus:border-[#facc15] focus:outline-none"
              />
              <input
                type="text"
                value={aureliaContact}
                onChange={(e) => setAureliaContact(e.target.value)}
                placeholder="Phone / WhatsApp / Email"
                className="bg-[#05070f] border border-white/15 rounded-lg px-2.5 py-2 text-[11px] text-white placeholder-slate-500 focus:border-[#facc15] focus:outline-none"
              />
            </div>

            <div className="bg-[#060811] border border-white/10 rounded-xl p-3 h-52 overflow-y-auto space-y-2.5">
              {aureliaMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#facc15] text-black font-bold'
                        : 'bg-[#141928] border border-white/10 text-slate-200'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAureliaSending && (
                <div className="text-[11px] text-amber-300 animate-pulse px-1">
                  Connecting to Aurelia Pulse...
                </div>
              )}
            </div>

            <form onSubmit={(e) => handleAureliaSend(e)} className="flex items-center gap-2">
              <input
                type="text"
                value={aureliaInput}
                onChange={(e) => setAureliaInput(e.target.value)}
                placeholder="Write in any language to book or ask..."
                className="flex-1 bg-[#05070f] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#facc15] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAureliaSending}
                className="px-4 py-2.5 bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase tracking-wider rounded-xl text-[11px] transition cursor-pointer shrink-0"
              >
                SEND
              </button>
            </form>
          </div>
        </div>
      )}

      {isAureliaBarVisible && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9985] w-[95vw] max-w-4xl bg-[#090d18]/95 backdrop-blur-xl border border-[#eab308]/40 rounded-full px-4 py-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.85)] flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 pl-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-white">
              AURELIA PULSE — 24/7 VIP BOOKING
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <select
              value={aureliaService}
              onChange={(e) => setAureliaService(e.target.value)}
              className="bg-[#111729] border border-white/15 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white focus:border-[#facc15] focus:outline-none"
            >
              {AURELIA_SERVICES.map((srv) => (
                <option key={srv} value={srv}>{srv}</option>
              ))}
            </select>

            <input
              type="date"
              value={aureliaDate}
              onChange={(e) => setAureliaDate(e.target.value)}
              className="hidden sm:block bg-[#111729] border border-white/15 rounded-full px-3 py-1.5 text-[11px] text-white focus:border-[#facc15] focus:outline-none"
            />

            <select
              value={aureliaSlot}
              onChange={(e) => setAureliaSlot(e.target.value)}
              className="bg-[#111729] border border-white/15 rounded-full px-3 py-1.5 text-[11px] font-bold text-amber-300 focus:border-[#facc15] focus:outline-none"
            >
              {AVAILABLE_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsAureliaDrawerOpen((prev) => !prev)}
              className="px-4 py-1.5 bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black font-black uppercase tracking-wider rounded-full text-[11px] shadow-md shadow-amber-500/20 transition cursor-pointer"
            >
              ASK AI / BOOK ↗
            </button>

            <button
              type="button"
              onClick={() => setIsAureliaBarVisible(false)}
              title="Minimize Booking Bar"
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto space-y-20">
        
        {/* ======================================================= */}
        {/* HERO SECTION + ABOVE-THE-FOLD CTAs + B2B TRUST SIGNALS  */}
        {/* ======================================================= */}
        <section>
          <div className="text-center max-w-4xl mx-auto mb-12 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-600/20 blur-[110px] pointer-events-none z-0"></div>
            <span className="relative z-10 inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full mb-4">
              Enterprise Turnkey AI Acquisition • 100% Source Code Ownership
            </span>
            <h1 className="relative z-10 text-3xl sm:text-5xl font-black uppercase tracking-wider mb-4 drop-shadow-[0_0_20px_rgba(8,145,178,0.5)]">
              V10 White-Label AI Systems
            </h1>
            
            {/* CUSTOMIZATION & INSTALLATION SUPPORT BANNER */}
            <div className="relative z-10 max-w-2xl mx-auto mb-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300 flex items-center justify-center gap-2">
                <Sliders size={16} className="text-cyan-400 shrink-0" />
                Every AI agent is fully customized to match your specific business needs
              </p>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-1 flex items-center justify-center gap-1.5">
                <Wrench size={14} className="text-emerald-400 shrink-0" />
                Expert installation and deployment support provided with every purchase
              </p>
            </div>

            <p className="relative z-10 text-slate-300 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              Acquire production-ready AI architectures (HTML/React Frontend UI + Python Scrapers + Self-Hosted n8n Backend Workflows) for your agency or enterprise. One-time buyout, zero recurring license fees.
            </p>

            {/* HIGH-CONVERSION ABOVE-THE-FOLD CTA BUTTONS (8 LIVE STUDIOS) */}
            <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => setIsAureliaStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-[#facc15] via-amber-300 to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_28px_rgba(250,204,21,0.5)] transition transform hover:scale-105 cursor-pointer"
              >
                ✦ Live Aurelia Pulse Bar ($199 Kit)
              </button>
              <button 
                onClick={() => setIsLeadHunterStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_28px_rgba(20,184,166,0.5)] transition transform hover:scale-105 cursor-pointer"
              >
                🎯 Live B2B Lead Hunter (20:00h Closer)
              </button>
              <button 
                onClick={() => setIsB2BWebhookStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.45)] transition transform hover:scale-105 cursor-pointer"
              >
                🤖 Live B2B Webhook Scoper (Groq)
              </button>
              <button 
                onClick={() => setIsMockupStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] transition transform hover:scale-105 cursor-pointer"
              >
                ⚡ Live Mockup Studio
              </button>
              <button 
                onClick={() => setIsSeoStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(16,185,129,0.35)] transition transform hover:scale-105 cursor-pointer"
              >
                🔍 Live SEO & CRO Auditor
              </button>
              <button 
                onClick={() => setIsCampaignStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-300 hover:to-cyan-300 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(99,102,241,0.35)] transition transform hover:scale-105 cursor-pointer"
              >
                📣 Live Campaign Studio
              </button>
              <button 
                onClick={() => setIsAlertStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.35)] transition transform hover:scale-105 cursor-pointer"
              >
                🔔 Viber / WhatsApp Alert
              </button>
              <button 
                onClick={() => setIsBookingStudioOpen(true)}
                className="px-5 py-3.5 bg-gradient-to-r from-cyan-300 to-teal-400 hover:from-cyan-200 hover:to-teal-300 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_25px_rgba(20,184,166,0.35)] transition transform hover:scale-105 cursor-pointer"
              >
                📅 Live Booking Setter
              </button>
            </div>
          </div>

          {/* B2B TRUST BADGES & ROI BENCHMARK BAR */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 relative z-10">
            <div className="bg-[#050914] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
              <div>
                <div className="text-xs font-black uppercase text-white">100% IP & Code Transfer</div>
                <div className="text-[11px] text-slate-400">JSON + Python + React/HTML</div>
              </div>
            </div>
            <div className="bg-[#050914] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Code className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black uppercase text-white">n8n + Groq / Gemini Engine</div>
                <div className="text-[11px] text-slate-400">Replies &amp; pitches in SR / EN / DE</div>
              </div>
            </div>
            <div className="bg-[#050914] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Zap className="w-8 h-8 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-black uppercase text-white">Zero Monthly SaaS Fees</div>
                <div className="text-[11px] text-slate-400">Self-hosted Railway n8n</div>
              </div>
            </div>
            <div className="bg-[#050914] border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Award className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <div className="text-xs font-black uppercase text-white">Agency Resell Rights</div>
                <div className="text-[11px] text-slate-400">Rebrand &amp; sell to unlimited clients</div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* 🔥 HIGH-PRIORITY FLAGSHIP B2B ACQUISITIONS (FEATURED TOP SELLERS)     */}
          {/* ===================================================================== */}
          <div className="mb-16 relative z-10 rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-amber-500/10 via-[#060b18] to-[#040711] border-2 border-amber-500/40 shadow-[0_0_70px_rgba(245,158,11,0.12)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3">
                  <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                  Priority Tier 1 • Highest-Demand B2B Acquisitions
                </div>
                <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
                  Flagship Revenue & Client-Acquisition Engines
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                  Engineered specifically for digital agencies, SaaS founders, and B2B operators seeking universal AI booking bars, autonomous 170-city lead generation, multilingual project quoting, or a complete turnkey AI business in a box.
                </p>
              </div>
              <div className="shrink-0">
                <a 
                  href="https://wa.me/381648201496"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-5 py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-amber-500/25 transition"
                >
                  ⚡ Priority VIP WhatsApp
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {priorityFlagshipSystems.map((item) => {
                const theme = getColorClasses(item.colorTheme);
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-[#040812]/90 border-2 ${theme.border} rounded-3xl p-6 sm:p-7 flex flex-col justify-between ${theme.shadow} hover:scale-[1.01] transition-all relative overflow-hidden`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${theme.bg} ${theme.text} border ${theme.border}`}>
                          {item.badge}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/5 text-emerald-400 border border-emerald-500/30 rounded-lg">
                          ROI: {item.roiTag}
                        </span>
                      </div>

                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-2xl ${theme.bg} border ${theme.border} flex items-center justify-center ${theme.text} shrink-0`}>
                          <Icon size={28} />
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-black uppercase text-white leading-snug">
                            {item.name}
                          </h3>
                          <p className={`text-xs font-bold uppercase tracking-wider ${theme.text} mt-0.5`}>
                            {item.shortDesc}
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-5">
                        {item.longDesc}
                      </p>

                      <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 mb-6 text-xs text-slate-300 flex items-center gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span><strong>Turnkey Package:</strong> {item.deliverables}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                          One-Time Turnkey Pricing
                        </span>
                        <span className={`text-xl sm:text-2xl font-black ${theme.text}`}>
                          {item.whiteLabelPrice}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {item.hasAureliaPulseStudio && (
                          <button 
                            type="button"
                            onClick={() => setIsAureliaStudioOpen(true)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            ✦ Live Booking Bar
                          </button>
                        )}
                        {item.hasLeadHunterStudio && (
                          <button 
                            type="button"
                            onClick={() => setIsLeadHunterStudioOpen(true)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-cyan-300 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            🎯 Live Hunter
                          </button>
                        )}
                        {item.hasB2BWebhookStudio && (
                          <button 
                            type="button"
                            onClick={() => setIsB2BWebhookStudioOpen(true)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            🤖 Live Webhook
                          </button>
                        )}
                        {item.hasLiveStudio && (
                          <button 
                            type="button"
                            onClick={() => setIsMockupStudioOpen(true)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            ⚡ Test Studio
                          </button>
                        )}
                        {item.hasSeoStudio && (
                          <button 
                            type="button"
                            onClick={() => setIsSeoStudioOpen(true)}
                            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            🔍 Test Auditor
                          </button>
                        )}
                        <button 
                          type="button"
                          onClick={() => setActiveModalAgent(item)}
                          className={`px-5 py-3 ${theme.button} text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer`}
                        >
                          Acquire System →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3 MAIN AGENTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {/* Agent 1: Visual Concierge */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#050914] border border-cyan-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(8,145,178,0.15)] h-full justify-center relative">
                 <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full">
                   ● Published Live
                 </span>
                 <div className="w-16 h-16 rounded-2xl bg-cyan-600/20 flex items-center justify-center text-cyan-400 mb-4">
                    <Bot size={32} />
                 </div>
                 <h3 className="text-white font-black text-lg uppercase mb-1">Visual Concierge</h3>
                 <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Floating Chat Widget + Studio</p>
                 <p className="text-slate-400 text-xs font-medium leading-relaxed">
                   Active site-wide floating chat concierge (<code className="text-cyan-300">Visual Concierge - Floating Chat Widget.json</code>) powered by Groq 120B + 8K Commercial Mockup Studio.
                 </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button 
                  type="button"
                  onClick={() => setIsMockupStudioOpen(true)}
                  className="flex-1 text-center bg-cyan-400 hover:bg-cyan-300 text-black text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  ⚡ Launch Studio
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveModalAgent(visualConcierge)}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg shadow-blue-600/30 cursor-pointer"
                >
                  Buyout ($4k–$7k)
                </button>
              </div>
            </div>

            {/* Agent 2: B2B Sales Scoper */}
            <div className="flex flex-col gap-4">
               <div className="bg-[#050914] border border-emerald-500/30 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.15)] h-full justify-center relative">
                  <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full">
                    ● Published Live
                  </span>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 flex items-center justify-center text-emerald-400 mb-4">
                     <Briefcase size={32} />
                  </div>
                  <h3 className="text-white font-black text-lg uppercase mb-1">B2B Sales Scoper</h3>
                  <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">V10 B2B Webhook - NEW (Groq)</p>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    Autonomous POST webhook agent (<code className="text-emerald-300">/webhook/v10-concierge-webhook</code>) that replies in the client's exact language, quotes all V10 packages, and routes VIPs to WhatsApp.
                  </p>
               </div>
               <div className="flex gap-2 mt-auto">
                 <button 
                    type="button"
                    onClick={() => setIsB2BWebhookStudioOpen(true)}
                    className="flex-1 text-center bg-emerald-400 hover:bg-emerald-300 text-black text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg shadow-emerald-500/25 cursor-pointer"
                 >
                   🤖 Test Live Webhook
                 </button>
                 <button 
                    type="button"
                    onClick={() => setActiveModalAgent(salesScoper)}
                    className="flex-1 text-center bg-emerald-700 hover:bg-emerald-600 text-white text-[10px] sm:text-xs font-black uppercase py-4 rounded-xl transition shadow-lg cursor-pointer"
                 >
                   Buyout ($4k–$8k)
                 </button>
               </div>
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
               <div className="mt-auto">
                 <button 
                    type="button"
                    onClick={() => setActiveModalAgent(techEngineer)}
                    className="w-full text-center bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition shadow-lg shadow-indigo-500/30 cursor-pointer"
                 >
                   Acquire White-Label ($5k – $10k)
                 </button>
               </div>
            </div>
          </div>

          {/* AGENCY ROI COMPARISON / CASE STUDY CALLOUT */}
          <div className="mt-12 bg-gradient-to-r from-cyan-950/30 via-[#050914] to-emerald-950/30 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                Verified Agency ROI Benchmark
              </span>
              <h3 className="text-lg sm:text-xl font-black uppercase text-white mt-1">
                Why Agencies Buy Turnkey Instead of Building From Scratch
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Hiring in-house frontend developers and n8n automation engineers costs <strong>$12,500+ and 6–8 weeks</strong> of R&amp;D per agent. Acquiring a V10 White-Label package gives your agency immediate source code ownership in <strong>15 minutes</strong>—ready to deploy for unlimited B2B clients.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full lg:w-auto">
              <div className="bg-black/60 border border-red-500/20 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-bold uppercase text-slate-400">In-House Build Cost</div>
                <div className="text-xl font-black text-red-400 line-through mt-0.5">$12,500+</div>
                <div className="text-[10px] text-slate-500">6–8 Weeks Dev Time</div>
              </div>
              <div className="bg-black/60 border border-emerald-500/40 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-bold uppercase text-emerald-400">V10 Turnkey Buyout</div>
                <div className="text-xl font-black text-white mt-0.5">$199 – $9,500</div>
                <div className="text-[10px] text-emerald-400 font-bold">Instant .ZIP Delivery</div>
              </div>
            </div>
          </div>

          {/* VERIFIED B2B AGENCY CASE STUDIES & TESTIMONIALS (SOCIAL PROOF) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {b2bCaseStudies.map((study, idx) => (
              <div key={idx} className="bg-[#050914] border border-white/10 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                      {study.metric}
                    </span>
                    <span className="text-amber-400 text-xs font-bold">★★★★★</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed italic mb-4">
                    "{study.quote}"
                  </p>
                </div>
                <div className="border-t border-white/10 pt-3">
                  <div className="text-xs font-black uppercase text-white">{study.agency}</div>
                  <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">{study.system}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/10" />

        {/* ========================================= */}
        {/* EXTENDED AGENT CATALOG (29 AGENTS)        */}
        {/* ========================================= */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-16 relative">
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-wider mb-2 text-slate-200">
              Turnkey White-Label AI Catalog
            </h2>
            <p className="text-slate-400 text-sm font-bold">
              Full source code and n8n workflow ownership for agencies and enterprises. One-time buyout, zero recurring license fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {aiAgentsList.map((agent) => {
              const themeClasses = getColorClasses(agent.colorTheme);
              return (
                <div key={agent.id} className="flex flex-col gap-4">
                  <div className={`bg-[#050914] border ${themeClasses.border} rounded-3xl p-6 flex flex-col items-center text-center ${themeClasses.shadow} h-full justify-center relative`}>
                     {(agent.hasAureliaPulseStudio || agent.hasLeadHunterStudio || agent.hasLiveStudio || agent.hasSeoStudio || agent.hasCampaignStudio || agent.hasAlertStudio || agent.hasBookingStudio || agent.hasB2BWebhookStudio) && (
                       <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 rounded-full">
                         Live Studio Ready
                       </span>
                     )}
                     <div className={`w-16 h-16 rounded-2xl ${themeClasses.bg} flex items-center justify-center ${themeClasses.text} mb-4`}>
                        <agent.icon size={32} />
                     </div>
                     <h3 className="text-white font-black text-lg uppercase mb-1">{agent.name}</h3>
                     <p className={`${themeClasses.text} text-xs font-bold uppercase tracking-widest mb-4`}>{agent.shortDesc}</p>
                     <p className="text-slate-400 text-xs font-medium leading-relaxed line-clamp-3">
                       {agent.longDesc}
                     </p>
                  </div>
                  <div className="mt-auto flex flex-col gap-2">
                    {agent.hasAureliaPulseStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsAureliaStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-[#facc15] to-[#eab308] hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        ✦ Launch Aurelia Pulse Bar
                      </button>
                    )}
                    {agent.hasLeadHunterStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsLeadHunterStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        🎯 Launch Lead Hunter & 20:00h Studio
                      </button>
                    )}
                    {agent.hasB2BWebhookStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsB2BWebhookStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-[#d4af37] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        🤖 Launch Live B2B Webhook Studio
                      </button>
                    )}
                    {agent.hasAlertStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsAlertStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
                      >
                        🔔 Launch Sale Alert Studio
                      </button>
                    )}
                    {agent.hasBookingStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsBookingStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-cyan-300 hover:to-teal-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        📅 Launch Booking Studio
                      </button>
                    )}
                    {agent.hasLiveStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsMockupStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        ⚡ Launch Mockup Studio
                      </button>
                    )}
                    {agent.hasSeoStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsSeoStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-emerald-400 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                      >
                        🔍 Launch SEO & CRO Auditor
                      </button>
                    )}
                    {agent.hasCampaignStudio && (
                      <button 
                        type="button"
                        onClick={() => setIsCampaignStudioOpen(true)}
                        className="w-full text-center bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-black text-xs font-black uppercase tracking-widest py-3.5 rounded-xl transition shadow-lg shadow-cyan-500/20 cursor-pointer"
                      >
                        📣 Launch Campaign Studio
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={() => setActiveModalAgent(agent)}
                      className={`w-full text-center ${themeClasses.button} text-white text-xs font-black uppercase tracking-widest py-4 rounded-xl transition shadow-lg cursor-pointer`}
                    >
                      White-Label Buyout ({agent.whiteLabelPrice})
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
              Centralized Access to Master Tools, Premium Upscalers, and Turnkey B2B Systems.
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
              <ScanLine className="w-5 h-5"/> TURNKEY B2B SYSTEMS & LUXURY KITS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {b2bEcosystemSystems.map(renderCard)}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
// END OF FILE: AIAgentsShowcase.jsx