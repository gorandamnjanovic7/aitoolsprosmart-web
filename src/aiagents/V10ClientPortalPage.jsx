// START OF FILE: src/aiagents/V10ClientPortalPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Lock, Unlock, CheckCircle, FileText, Download, CreditCard,
  Bitcoin, Building, Sparkles, Eye, Settings, BellRing, Send, ArrowRight,
  Layers, Users, DollarSign, Clock, RefreshCw, Award, ExternalLink, Briefcase
} from 'lucide-react';

const INITIAL_DELIVERABLES = [
  {
    id: 'del-01',
    title: 'Aero Privé — 150MP Ultra-Print Cabin Master Pack',
    format: '20× 150MP TIFF/PNG + sRGB ICC Profile (4.2 GB .ZIP)',
    version: 'v3.2 Final Master',
    status: 'Approved',
    previewImg: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=900&q=80',
    specs: 'Lanczos 8x Interpolation • Zero Compression Artifacts'
  },
  {
    id: 'del-02',
    title: 'Global Fleet Charter — React + Tailwind Frontend UI Kit',
    format: 'Complete JSX Source Code + Vite Config (185 MB .ZIP)',
    version: 'v2.0 Production',
    status: 'Pending Approval',
    previewImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    specs: '6 Turnkey Pages • Sub-Second WebP Asset Loading'
  },
  {
    id: 'del-03',
    title: '30s 4K/60fps Hero Cinema Loop (Seedance 2.5 + Kling 4.0)',
    format: 'WebM (Web Hero) + MP4 (Billboard 16:9 & Reels 9:16)',
    version: 'v1.4 Studio Cut',
    status: 'Pending Approval',
    previewImg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    specs: '30s Continuous Motion • 150MP First-Frame Poster Included'
  }
];

export default function V10ClientPortalPage({ openCheckout }) {
  // Interactive Demo Mode: 'client' or 'admin'
  const [viewMode, setViewMode] = useState('client');

  // Simulated Client Project State
  const [clientName, setClientName] = useState('Apex Private Aviation Holdings (Monaco)');
  const [clientEmail, setClientEmail] = useState('director@apexaviation.mc');
  const [projectTitle, setProjectTitle] = useState('Q4 Turnkey Rebranding + 150MP Visual Vault');
  const [invoiceAmount, setInvoiceAmount] = useState(2850);
  const [isInvoicePaid, setIsInvoicePaid] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState('Payoneer B2B Wire');
  const [deliverables, setDeliverables] = useState(INITIAL_DELIVERABLES);

  // Revision / Webhook Notification State
  const [revisionNote, setRevisionNote] = useState('');
  const [activeRevisionId, setActiveRevisionId] = useState(null);
  const [webhookStatus, setWebhookStatus] = useState('Connected to V10 B2B Webhook (localhost:5678)');
  const [aiConciergeLog, setAiConciergeLog] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Trigger real n8n webhook on Client Approval or Payment
  const triggerPortalWebhook = async (actionTitle, detailsText) => {
    setIsDispatching(true);
    setWebhookStatus(`Dispatching "${actionTitle}" to n8n Groq Webhook...`);

    const payload = {
      name: clientName,
      email: clientEmail,
      category: 'White-Label Client Portal Event',
      item: `${projectTitle} — ${actionTitle}`,
      message: detailsText
    };

    try {
      const res = await fetch('https://n8n-production-720dcf20.up.railway.app/webhook/v10-concierge-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data?.agent_reply) {
        setAiConciergeLog(data.agent_reply);
      }
      setWebhookStatus(`✓ Instant Alert Dispatched (${actionTitle})`);
    } catch (err) {
      setAiConciergeLog(
        `[V10 Portal Event Logged]: ${actionTitle} by ${clientName} (${clientEmail}). Instant push notification routed to Agency Owner WhatsApp (+381648201496).`
      );
      setWebhookStatus(`✓ Event Logged (${actionTitle})`);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleApproveDeliverable = (id, title) => {
    setDeliverables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
    triggerPortalWebhook(
      'One-Click Design Approval',
      `Client ${clientName} approved final master deliverable: "${title}". Confirm receipt and readiness for final invoice settlement.`
    );
  };

  const handleRequestRevision = (id, title) => {
    if (!revisionNote.trim()) return;
    setDeliverables((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Revision Requested' } : item))
    );
    triggerPortalWebhook(
      'Client Revision Request',
      `Client ${clientName} requested a revision on "${title}": "${revisionNote}". Provide a polite executive confirmation.`
    );
    setRevisionNote('');
    setActiveRevisionId(null);
  };

  const handleSimulateInvoicePayment = () => {
    setIsInvoicePaid(true);
    triggerPortalWebhook(
      `Invoice Paid ($${invoiceAmount}) via ${selectedGateway}`,
      `Client ${clientName} just paid Invoice #V10-884 ($${invoiceAmount} USD) via ${selectedGateway}. All 150MP Master .ZIP files are now automatically unlocked in their vault.`
    );
  };

  const handleBuyPortalSystem = (tierName, priceNum) => {
    if (typeof openCheckout === 'function') {
      openCheckout(tierName, priceNum, '');
    } else {
      window.open(
        `https://wa.me/381648201496?text=${encodeURIComponent(
          `Hi Goran, I want to acquire the ${tierName} ($${priceNum}).`
        )}`,
        '_blank'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-white py-20 px-4 sm:px-6 font-sans relative z-10">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* ================================================================= */}
        {/* HERO HEADER & VALUE PROPOSITION FOR AGENCIES                      */}
        {/* ================================================================= */}
        <section className="text-center max-w-4xl mx-auto relative pt-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 blur-[130px] pointer-events-none z-0" />
          
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/40 text-amber-300 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Turnkey B2B SaaS & Agency Infrastructure • 100% Source Code Ownership
          </div>

          <h1 className="relative z-10 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none mb-5">
            White-Label <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500">Client Portal</span> & Agency Vault
          </h1>

          <p className="relative z-10 text-slate-300 text-sm sm:text-base font-medium max-w-3xl mx-auto leading-relaxed">
            Stop sending high-ticket clients messy WeTransfer links and manual PDF invoices. Deploy your own luxury React + Firebase + n8n Client Portal where clients preview 150MP deliverables, approve designs with one click, and pay invoices via Payoneer, PayPal, Card, or Crypto to automatically unlock their master <code className="text-amber-300">.ZIP</code> files.
          </p>

          {/* QUICK PRICING & DEMO SWITCHER BAR */}
          <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleBuyPortalSystem('White-Label Client Portal — Agency License', 1950)}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.4)] transition transform hover:scale-105 cursor-pointer"
            >
              ⚡ Acquire Agency License ($1,950)
            </button>

            <button
              type="button"
              onClick={() => handleBuyPortalSystem('White-Label Client Portal — Full IP & SaaS Resell Buyout', 3500)}
              className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-amber-400/50 text-white font-black text-xs uppercase tracking-widest transition transform hover:scale-105 cursor-pointer"
            >
              👑 Full SaaS Resell Buyout ($3,500)
            </button>

            <a
              href="https://wa.me/381648201496?text=Hi%20Goran,%20I%20am%20interested%20in%20the%20White-Label%20Client%20Portal%20%26%20Agency%20Dashboard."
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-black text-xs uppercase tracking-widest transition"
            >
              💬 VIP WhatsApp Demo
            </a>
          </div>
        </section>

        {/* ================================================================= */}
        {/* INTERACTIVE LIVE SIMULATOR (SWITCH BETWEEN CLIENT & ADMIN VIEW)   */}
        {/* ================================================================= */}
        <section className="bg-[#070b14] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_0_80px_rgba(245,158,11,0.12)] relative overflow-hidden">
          
          {/* TOP BAR OF SIMULATOR */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Interactive Live Portal Simulator
                </span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  {webhookStatus}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
                {viewMode === 'client'
                  ? `👁️ Client Vault View — ${clientName}`
                  : '⚙️ Agency Owner Admin — Project & Invoice Controller'}
              </h2>
            </div>

            {/* ROLE SWITCHER BUTTONS */}
            <div className="flex items-center gap-2 bg-black/70 p-1.5 rounded-2xl border border-white/10 self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('client')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  viewMode === 'client'
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye size={15} />
                1. Client Vault View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                  viewMode === 'admin'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Settings size={15} />
                2. Agency Admin View
              </button>
            </div>
          </div>

          {/* =============================================================== */}
          {/* MODE 1: CLIENT VAULT VIEW                                       */}
          {/* =============================================================== */}
          {viewMode === 'client' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT 8 COLUMNS: DELIVERABLES & 1-CLICK APPROVAL */}
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 bg-black/50 border border-white/10 rounded-2xl px-5 py-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                      Active Workspace Project
                    </span>
                    <span className="text-sm sm:text-base font-black text-white uppercase">
                      {projectTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {deliverables.filter((d) => d.status === 'Approved').length} / {deliverables.length} Approved
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${
                        isInvoicePaid
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {isInvoicePaid ? '🔓 Master ZIPs Unlocked' : '🔒 Pay-to-Unlock Active'}
                    </span>
                  </div>
                </div>

                {deliverables.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/60 border border-white/10 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row gap-5 items-start"
                  >
                    <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shrink-0 relative">
                      <img
                        src={item.previewImg}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md text-[9px] font-black uppercase px-2 py-0.5 rounded text-amber-300 border border-amber-400/30">
                        {item.version}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-black uppercase text-white truncate">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            item.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : item.status === 'Revision Requested'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {item.status === 'Approved' ? '✓ Approved Master' : item.status}
                        </span>
                      </div>

                      <p className="text-xs text-amber-300/90 font-semibold">{item.format}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.specs}</p>

                      {/* ACTION BUTTONS: APPROVE / REVISION / DOWNLOAD */}
                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {item.status !== 'Approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveDeliverable(item.id, item.title)}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-[11px] uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle size={13} />
                            Approve Final Master
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setActiveRevisionId(activeRevisionId === item.id ? null : item.id)
                          }
                          className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
                        >
                          ✏️ Request Revision
                        </button>

                        {isInvoicePaid ? (
                          <button
                            type="button"
                            onClick={() =>
                              alert(`Downloading unlocked 150MP Master ZIP: ${item.title}`)
                            }
                            className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download size={13} />
                            Download 150MP .ZIP
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              alert(
                                'Pay-to-Unlock Protection: Please settle the project invoice on the right to unlock 150MP Master ZIP downloads.'
                              )
                            }
                            className="ml-auto px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-not-allowed"
                          >
                            <Lock size={12} className="text-amber-400" />
                            Locked Until Invoice Paid
                          </button>
                        )}
                      </div>

                      {/* REVISION INPUT BOX */}
                      {activeRevisionId === item.id && (
                        <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            value={revisionNote}
                            onChange={(e) => setRevisionNote(e.target.value)}
                            placeholder="Describe requested adjustment (dispatches instant WhatsApp alert to agency)..."
                            className="flex-1 bg-[#05070f] border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRequestRevision(item.id, item.title)}
                            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase rounded-xl cursor-pointer"
                          >
                            Send Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT 4 COLUMNS: PAY-TO-UNLOCK INVOICE TERMINAL & LIVE N8N LOG */}
              <div className="lg:col-span-4 space-y-5">
                <div className="bg-black/75 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                        Pay-to-Unlock Escrow Terminal
                      </span>
                      <h3 className="text-lg font-black uppercase text-white">
                        Invoice #V10-884
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                        isInvoicePaid
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {isInvoicePaid ? 'PAID IN FULL' : 'PAYMENT DUE'}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 mb-5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Client:</span>
                      <span className="font-bold text-white text-right">{clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commercial License:</span>
                      <span className="font-bold text-emerald-400">100% IP Transfer Included</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                      <span className="text-xs font-black uppercase text-slate-300">Total Amount:</span>
                      <span className="text-3xl font-black text-amber-400">${invoiceAmount}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                      Select Integrated Payment Gateway
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        'Payoneer B2B Wire',
                        'PayPal / Corporate Visa & Mastercard',
                        'USDT / Bitcoin Instant Crypto'
                      ].map((gw) => (
                        <button
                          key={gw}
                          type="button"
                          onClick={() => setSelectedGateway(gw)}
                          className={`text-left px-3.5 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                            selectedGateway === gw
                              ? 'border-amber-400 bg-amber-500/15 text-white'
                              : 'border-white/10 bg-[#05070f] text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{gw}</span>
                          {selectedGateway === gw && <CheckCircle size={14} className="text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {!isInvoicePaid ? (
                    <button
                      type="button"
                      onClick={handleSimulateInvoicePayment}
                      disabled={isDispatching}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/25 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Unlock size={16} />
                      {isDispatching
                        ? 'Processing Payment...'
                        : `Simulate Payment ($${invoiceAmount}) & Unlock ZIPs`}
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                        ✓ Invoice Paid! All 150MP Master .ZIP buttons on the left are now unlocked.
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsInvoicePaid(false)}
                        className="w-full py-2 text-[11px] font-bold uppercase text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        ↺ Reset Demo to Unpaid State
                      </button>
                    </div>
                  )}
                </div>

                {/* LIVE N8N WEBHOOK & WHATSAPP DISPATCH LOG */}
                <div className="bg-black/60 border border-white/10 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <BellRing size={13} /> Live n8n & WhatsApp Dispatch Log
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                      Groq 120B
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed bg-[#05070f] border border-white/10 rounded-xl p-3.5 min-h-[90px]">
                    {aiConciergeLog ||
                      'Click "Approve Final Master" or "Simulate Payment" above to trigger a live POST request to your n8n webhook (localhost:5678) and preview the automated executive response.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* =============================================================== */
            /* MODE 2: AGENCY ADMIN CONTROLLER VIEW                            */
            /* =============================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 bg-black/60 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Settings size={18} /> Configure Client Workspace (Live Sync)
                </h3>
                <p className="text-xs text-slate-400">
                  Any change you make here immediately updates the <strong>Client Vault View</strong> tab so you can test how agencies onboard clients in 30 seconds.
                </p>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Client / Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                    Client Login Email (Firebase Auth Whitelist)
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                      Project / Vault Title
                    </label>
                    <input
                      type="text"
                      value={projectTitle}
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                      Escrow Invoice Amount ($ USD)
                    </label>
                    <input
                      type="number"
                      value={invoiceAmount}
                      onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                      className="w-full bg-[#05070f] border border-white/15 rounded-xl p-3 text-xs font-black text-emerald-400 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('client')}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-xs uppercase tracking-wider cursor-pointer"
                  >
                    👁️ Switch to Client View to See Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsInvoicePaid(!isInvoicePaid);
                    }}
                    className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    {isInvoicePaid ? '🔒 Lock Client ZIPs' : '🔓 Force-Unlock Client ZIPs'}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-black/60 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-base font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Award size={18} /> What Your Buyer Receives in the Turnkey .ZIP
                </h3>
                <ul className="space-y-3 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Complete React + Tailwind Portal UI:</strong> Client Vault View, Agency Admin Controller, One-Click Approval badges, and Revision Tracker.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Firebase Auth & Firestore Rules:</strong> Ready-to-use database structure for per-client login isolation and Pay-to-Unlock file protection.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>Multi-Gateway Checkout Integration:</strong> Built-in support for Payoneer B2B Wire, PayPal, Credit Cards, and Crypto (USDT/BTC).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5 bg-white/5 p-3 rounded-xl border border-white/5">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong>n8n Automated Alert Workflow (.JSON):</strong> Instant WhatsApp/Viber/Email alerts whenever a client approves a file or pays an invoice.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ================================================================= */}
        {/* 2-TIER WHITE-LABEL BUYOUT PRICING CARDS                           */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* TIER 1: AGENCY LICENSE */}
          <div className="bg-[#060a12] border-2 border-amber-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(245,158,11,0.1)]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Most Popular for Studios & Agencies
              </span>
              <h3 className="text-2xl font-black uppercase text-white mt-4">
                Agency White-Label License
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Deploy on your own agency domain for unlimited client projects with zero monthly SaaS fees.
              </p>

              <div className="my-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-400">$1,950</span>
                <span className="text-xs font-bold uppercase text-slate-400">/ one-time buyout</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  100% React + Tailwind JSX Source Code
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Pay-to-Unlock Escrow & One-Click Client Approval Engine
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  n8n Webhook + WhatsApp Notification Workflow (.JSON)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Unlimited Client Accounts & Projects
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() =>
                handleBuyPortalSystem('White-Label Client Portal — Agency License', 1950)
              }
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black text-xs uppercase tracking-widest shadow-lg transition cursor-pointer"
            >
              ⚡ Acquire Agency License ($1,950)
            </button>
          </div>

          {/* TIER 2: FULL SAAS RESELL BUYOUT */}
          <div className="bg-[#060a12] border-2 border-cyan-500/40 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_40px_rgba(6,182,212,0.12)]">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                Enterprise Master Buyout + Resell Rights
              </span>
              <h3 className="text-2xl font-black uppercase text-white mt-4">
                Full SaaS Resell & Master Buyout
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Includes full commercial rights to resell the portal to other agencies or launch as a recurring SaaS.
              </p>

              <div className="my-6 flex items-baseline gap-2">
                <span className="text-4xl font-black text-cyan-400">$3,500</span>
                <span className="text-xs font-bold uppercase text-slate-400">/ one-time buyout</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Everything in Agency License + Multi-Tenant SaaS Architecture
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Unrestricted Rights to Resell at $1,500–$3,500 per Client
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  Includes Both V10 AI Concierge & B2B Webhook Workflows (.JSON)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  1-on-1 VIP Deployment & Custom Branding Assistance
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() =>
                handleBuyPortalSystem(
                  'White-Label Client Portal — Full SaaS Resell Buyout',
                  3500
                )
              }
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-xs uppercase tracking-widest shadow-lg transition cursor-pointer"
            >
              👑 Acquire Full Resell Buyout ($3,500)
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
// END OF FILE: src/aiagents/V10ClientPortalPage.jsx