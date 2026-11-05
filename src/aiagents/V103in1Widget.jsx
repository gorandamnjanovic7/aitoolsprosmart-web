// POČETAK FAJLA: V103in1Widget.jsx (Naziv komponente: V103in1Widget)
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, MessageSquare, Sparkles, Briefcase, Settings, Zap, Cpu } from 'lucide-react';

export default function V103in1Widget({ mode = 'floating' }) {
  const [isOpen, setIsOpen] = useState(mode === 'inline');
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState('concierge'); // 'concierge', 'b2b', 'tech'
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Odvojene poruke za svaki tab da se sadržaj nikada ne bi mešao
  const [tabMessages, setTabMessages] = useState({
    concierge: [
      { role: 'assistant', text: "Hello! I'm your Visual Concierge. Looking for 150MP Wall/Billboard Mockups or High-Ticket UI/UX bundles? Let me find them for you.", type: 'text' }
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage;
    
    // Dodajemo poruku samo u niz onog taba koji je trenutno aktivan
    setTabMessages(prev => ({
      ...prev,
      [activeTab]: [...prev[activeTab], { role: 'user', text: userText, type: 'text' }]
    }));
    
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      let replyText = "";
      let replyType = "text";
      let extraData = null;

      const lower = userText.toLowerCase();

      if (activeTab === 'concierge') {
        if (lower.includes('mockup') || lower.includes('billboard') || lower.includes('wall')) {
          replyText = "I found these matching 150MP Ultra-Print products from our catalog:";
          replyType = "products";
          extraData = [
            { name: "150MP Luxury Wall Mockup", price: "$29", tag: "Mockups" },
            { name: "4K Billboard Campaign Bundle", price: "$39", tag: "Mockups" }
          ];
        } else {
          replyText = "We feature top-tier UI/UX design bundles (Storytelling, Luxury Bags, Food & Beverage) and 150MP Mockups. Would you like to explore them?";
        }
      } else if (activeTab === 'b2b') {
        if (lower.includes('agent') || lower.includes('embed') || lower.includes('website') || lower.includes('price')) {
          replyText = "Here is a preliminary B2B Project Quote for custom AI Agent deployment:";
          replyType = "quote";
          extraData = {
            title: "Turnkey AI Widget Embed",
            scope: "Custom LLM training on your data + UI/UX Widget Installation",
            setup: "$990 Setup",
            monthly: "$149 / mo"
          };
        } else {
          replyText = "To provide an accurate B2B quote, could you share your estimated monthly web traffic or specific enterprise requirements?";
        }
      } else if (activeTab === 'tech') {
        if (lower.includes('csp') || lower.includes('firebase') || lower.includes('netlify')) {
          replyText = "For Vite + React apps on Netlify with Firebase, make sure your CSP headers allow 'connect-src' for Firestore and your backend API endpoint to prevent CORS blocks.";
        } else {
          replyText = "As your 24/7 Tech Engineer, I can assist with React architecture, Smart Object coordinate mappings, and API integrations. What are you building?";
        }
      }

      setTabMessages(prev => ({
        ...prev,
        [activeTab]: [...prev[activeTab], { role: 'assistant', text: replyText, type: replyType, data: extraData }]
      }));
      setIsLoading(false);
    }, 800);
  };

  const renderContent = (msg) => {
    if (msg.type === 'text') return <p>{msg.text}</p>;
    
    if (msg.type === 'products') {
      return (
        <div>
          <p className="mb-2">{msg.text}</p>
          <div className="space-y-2">
            {msg.data.map((p, i) => (
              <div key={i} className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-cyan-300 block">{p.name}</span>
                  <span className="text-[9px] text-slate-400 uppercase">{p.tag}</span>
                </div>
                <span className="font-black text-emerald-400">{p.price}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (msg.type === 'quote') {
      return (
        <div>
          <p className="mb-2">{msg.text}</p>
          <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-xl text-xs space-y-2">
            <div className="font-black text-emerald-400 uppercase">{msg.data.title}</div>
            <p className="text-slate-300 text-[11px]">{msg.data.scope}</p>
            <div className="flex justify-between font-mono font-bold pt-2 border-t border-slate-800">
              <span>{msg.data.setup}</span>
              <span className="text-emerald-400">{msg.data.monthly}</span>
            </div>
          </div>
        </div>
      );
    }
  };

  if (mode === 'inline') {
    return (
      <div className="w-full max-w-4xl mx-auto bg-[#02040a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] font-sans">
        {renderWidgetBody()}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {!isOpen && showTooltip && (
        <div className="mb-4 bg-slate-900 border border-cyan-500/50 text-white p-4 rounded-2xl rounded-br-none shadow-2xl max-w-[260px] relative">
          <button onClick={() => setShowTooltip(false)} className="absolute top-1 right-2 text-slate-400 hover:text-white">
            <X size={12} />
          </button>
          <p className="text-xs font-bold leading-relaxed">
            👋 Hi! I am your 3-in-1 Master AI Concierge. Ask me about mockups, B2B quotes, or tech support!
          </p>
        </div>
      )}

      {isOpen && (
        <div className="mb-4 w-[360px] sm:w-[420px] h-[600px] bg-[#02040a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
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
    // Prikazujemo isključivo poruke koje pripadaju trenutno aktivnom tabu
    const currentMessages = tabMessages[activeTab] || [];

    return (
      <>
        {/* Header */}
        <div className="bg-[#050914] border-b border-slate-800 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white">
              {activeTab === 'concierge' && <Sparkles size={20} />}
              {activeTab === 'b2b' && <Briefcase size={20} />}
              {activeTab === 'tech' && <Cpu size={20} />}
            </div>
            <div>
              <h3 className="text-white text-xs font-black uppercase tracking-wider">V10 Master AI Concierge</h3>
              <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">3-in-1 Ecosystem Brain</p>
            </div>
          </div>
          {mode === 'floating' && (
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2">
              <X size={18} />
            </button>
          )}
        </div>

        {/* 3-u-1 Prekidač (Switch Tabs) */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 border-b border-slate-800 text-[10px] font-black uppercase tracking-wider">
          <button 
            onClick={() => handleTabSwitch('concierge')}
            className={`py-2 rounded-xl transition ${activeTab === 'concierge' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            🖼️ Visual
          </button>
          <button 
            onClick={() => handleTabSwitch('b2b')}
            className={`py-2 rounded-xl transition ${activeTab === 'b2b' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            💼 B2B Scoper
          </button>
          <button 
            onClick={() => handleTabSwitch('tech')}
            className={`py-2 rounded-xl transition ${activeTab === 'tech' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            ⚙️ Tech
          </button>
        </div>

        {/* Poruke aktivnog taba */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#02040a] to-[#050914]">
          {currentMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-cyan-600 text-white rounded-br-none' 
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
              }`}>
                {renderContent(msg)}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 items-center text-xs font-mono text-cyan-400 animate-pulse p-2">
              <Zap size={14} /> Searching V10 Master Catalog...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Polje */}
        <div className="p-3 bg-[#050914] border-t border-slate-800 flex gap-2">
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
            className="flex-1 bg-[#02040a] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          />
          <button onClick={handleSendMessage} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-xl transition flex items-center justify-center">
            <Send size={16} />
          </button>
        </div>
      </>
    );
  }
}
// KRAJ FAJLA: V103in1Widget.jsx