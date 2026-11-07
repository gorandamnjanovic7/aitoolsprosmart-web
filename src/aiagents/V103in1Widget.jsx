// POČETAK FAJLA: V103in1Widget.jsx (Naziv komponente: V103in1Widget)
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Sparkles, Briefcase, Zap, Cpu } from 'lucide-react';

export default function V103in1Widget({ mode = 'floating' }) {
  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState('concierge'); // 'concierge', 'b2b', 'tech'
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 🔥 PRAVI n8n Webhook URL 🔥
  const N8N_WEBHOOK_URL = 'https://goran-n8n.app.n8n.cloud/webhook/7b6e3cb5-dfe9-425e-93b8-d78d959269f4/chat';

  // Odvojene poruke za svaki tab sa početnim pozdravom
  const [tabMessages, setTabMessages] = useState({
    concierge: [
      { 
        role: 'assistant', 
        text: "Welcome to Visionary Factory V10! I am your Visual Concierge. We offer elite UI/UX designs, and Master Asset Mockups delivered in stunning 4K UHD & 150MP resolution. How can I help you elevate your project today?", 
        type: 'text' 
      }
    ],
    b2b: [
      { role: 'assistant', text: "B2B Sales Scoper active. Tell me about your project scope or agency requirements, and I'll generate a custom quote.", type: 'text' }
    ],
    tech: [
      { role: 'assistant', text: "Tech Engineer online. Ask me about 150MP printing specs, Smart Object layers, Firebase rules, or custom widget deployment.", type: 'text' }
    ]
  });

  useEffect(() => {
    if (mode === 'floating') {
      const timer = setTimeout(() => setShowTooltip(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tabMessages, activeTab, isOpen]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
  };

  const handleSendMessage = async (textToSend = null) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;
    
    // Dodajemo korisničku poruku u aktivni tab
    const userMsg = { role: 'user', text, type: 'text' };
    setTabMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], userMsg]
    }));
    
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      // Slanje poruke ka n8n Webhook-u
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          tab: activeTab, // Šaljemo tab da n8n zna da li je Visual, B2B ili Tech
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Greška u komunikaciji sa n8n serverom.');
      }

      const data = await response.json();

      const replyText = data.replyText || data.output || "Izvinjavam se, došlo je do prekida u obradi podataka.";
      const replyType = data.replyType || "text";
      const extraData = data.extraData || null;

      setTabMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { role: 'assistant', text: replyText, type: replyType, data: extraData }]
      }));

    } catch (error) {
      console.error("n8n Error:", error);
      // Fallback poruka ako n8n nije dostupan
      setTabMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { 
          role: 'assistant', 
          text: "Trenutno se povezujem sa n8n mozgom... Proverite da li je webhook aktivan.", 
          type: 'text' 
        }]
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = (msg) => {
    if (msg.type === 'text') {
      return (
        <div>
          <p>{msg.text}</p>
          {/* Quick-Action Chips unutar prve poruke u Concierge tabu */}
          {activeTab === 'concierge' && msg === tabMessages.concierge[0] && (
            <div className="mt-4 grid grid-cols-1 gap-2">
              <button 
                onClick={() => handleSendMessage("150MP & 4K Mockups (Wall, Billboard, Glass)")}
                className="bg-slate-900 hover:bg-cyan-950/50 border border-cyan-500/30 text-left p-2.5 rounded-xl text-xs font-semibold text-cyan-300 transition flex items-center gap-2 shadow-sm"
              >
                <span>🖼️</span> <span>150MP & 4K Mockups (Wall, Billboard, Glass)</span>
              </button>
              <button 
                onClick={() => handleSendMessage("Specialized UI/UX (Storytelling, Food, Luxury Bags)")}
                className="bg-slate-900 hover:bg-cyan-950/50 border border-cyan-500/30 text-left p-2.5 rounded-xl text-xs font-semibold text-cyan-300 transition flex items-center gap-2 shadow-sm"
              >
                <span>🎨</span> <span>Specialized UI/UX (Storytelling, Food, Luxury Bags)</span>
              </button>
              <button 
                onClick={() => handleSendMessage("Request Custom B2B Project / Licensing")}
                className="bg-slate-900 hover:bg-cyan-950/50 border border-cyan-500/30 text-left p-2.5 rounded-xl text-xs font-semibold text-cyan-300 transition flex items-center gap-2 shadow-sm"
              >
                <span>💎</span> <span>Request Custom B2B Project / Licensing</span>
              </button>
            </div>
          )}
        </div>
      );
    }

    if (msg.type === 'quote') {
      return (
        <div>
          <p className="mb-2.5">{msg.text}</p>
          <div className="bg-slate-900 border border-emerald-500/40 p-4 rounded-2xl text-sm space-y-2.5">
            <div className="font-black text-emerald-400 uppercase tracking-wider">{msg.data?.title}</div>
            <p className="text-slate-300 text-xs leading-relaxed">{msg.data?.scope}</p>
            <div className="flex justify-between font-mono font-bold pt-2.5 border-t border-slate-800 text-xs">
              <span>{msg.data?.setup}</span>
              <span className="text-emerald-400">{msg.data?.monthly}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  if (mode === 'inline') {
    return (
      <div className="w-full max-w-5xl mx-auto bg-[#02040a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[750px] font-sans">
        {renderWidgetBody()}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {!isOpen && showTooltip && (
        <div className="mb-4 bg-slate-900 border border-cyan-500/50 text-white p-4 rounded-2xl rounded-br-none shadow-2xl max-w-[280px] relative">
          <button onClick={() => setShowTooltip(false)} className="absolute top-1 right-2 text-slate-400 hover:text-white">
            <X size={12} />
          </button>
          <p className="text-xs font-bold leading-relaxed">
            👋 Hi! I am your 3-in-1 Master AI Concierge. Ask me about mockups, B2B quotes, or tech support!
          </p>
        </div>
      )}

      {isOpen && (
        <div className="mb-4 w-[380px] sm:w-[460px] h-[680px] bg-[#02040a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {renderWidgetBody()}
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => { setIsOpen(true); setShowTooltip(false); }}
          className="w-16 h-16 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:scale-105 transition-transform rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(8,145,178,0.5)] border-2 border-cyan-400/30"
        >
          <Bot size={28} className="text-white animate-pulse" />
        </button>
      )}
    </div>
  );

  function renderWidgetBody() {
    const currentMessages = tabMessages[activeTab] || [];

    return (
      <>
        {/* Header */}
        <div className="bg-[#050914] border-b border-slate-800 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              {activeTab === 'concierge' && <Sparkles size={22} />}
              {activeTab === 'b2b' && <Briefcase size={22} />}
              {activeTab === 'tech' && <Cpu size={22} />}
            </div>
            <div>
              <h3 className="text-white text-sm font-black uppercase tracking-wider">V10 Master AI Concierge</h3>
              <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">n8n Autonomous Brain</p>
            </div>
          </div>
          {mode === 'floating' && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2">
              <X size={20} />
            </button>
          )}
        </div>

        {/* 3-u-1 Prekidač (Switch Tabs) */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-900 p-2 border-b border-slate-800 text-xs font-black uppercase tracking-wider">
          <button 
            onClick={() => handleTabSwitch('concierge')}
            className={`py-2.5 rounded-xl transition ${activeTab === 'concierge' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            🖼️ Visual
          </button>
          <button 
            onClick={() => handleTabSwitch('b2b')}
            className={`py-2.5 rounded-xl transition ${activeTab === 'b2b' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            💼 B2B Scoper
          </button>
          <button 
            onClick={() => handleTabSwitch('tech')}
            className={`py-2.5 rounded-xl transition ${activeTab === 'tech' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            ⚙️ Tech
          </button>
        </div>

        {/* Poruke aktivnog taba */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#02040a] to-[#050914]">
          {currentMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-br-none shadow-md' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none shadow-md'
              }`}>
                {renderContent(msg)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center text-xs font-mono text-cyan-400 animate-pulse p-2">
              <Zap size={15} /> n8n AI Engine is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Polje */}
        <div className="p-4 bg-[#050914] border-t border-slate-800 flex gap-2.5">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={
              activeTab === 'concierge' ? "Search mockups or UI/UX..." :
              activeTab === 'b2b' ? "Describe project for quote..." :
              "Ask tech/engineering question..."
            }
            className="flex-1 bg-[#02040a] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 shadow-inner"
          />
          <button onClick={() => handleSendMessage()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 rounded-2xl transition flex items-center justify-center shadow-md">
            <Send size={18} />
          </button>
        </div>
      </>
    );
  }
}
// KRAJ FAJLA: V103in1Widget.jsx