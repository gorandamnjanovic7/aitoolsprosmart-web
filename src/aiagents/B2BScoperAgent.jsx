// POČETAK FAJLA: B2BScoperAgent.jsx
// Ne zaboravi da ažuriraš svoj React source code link u glavnom repozitorijumu!



import React, { useState } from 'react';
import { Briefcase, Send } from 'lucide-react';

export default function B2BScoperAgent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "B2B Sales Scoper active. Tell me about your project scope or agency requirements, and I'll generate a custom quote." }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: "Project scope analyzed. Setup Fee: $990 | Maintenance: $149/mo." }]);
    }, 800);
  };

  return (
    <div className="bg-[#050914] border border-emerald-500/30 rounded-3xl p-6 flex flex-col h-[500px] shadow-[0_0_30px_rgba(16,185,129,0.15)] font-sans">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
          <Briefcase size={20} />
        </div>
        <div>
          <h3 className="text-white font-black text-sm uppercase">B2B Sales Scoper</h3>
          <p className="text-[10px] text-emerald-400 font-bold uppercase">Active & Ready</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${m.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 border border-slate-700'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-800 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Describe your project for a quote..."
          className="flex-1 bg-[#02040a] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500" 
        />
        <button onClick={handleSend} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 rounded-xl">
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}