// POČETAK FAJLA: V8GridSystem.jsx
import React, { useState, useEffect } from 'react';
import { Crosshair, Cpu, Aperture, Sun, Settings, ShieldCheck, Database } from 'lucide-react';
import { 
  DEFAULT_CATEGORIES, 
  SUB_CATEGORIES_DB, 
  CAMERA_PRESETS, 
  LIGHTING_PRESETS, 
  STYLE_PRESETS 
} from './V8_Database.js';

export default function V8GridSystem() {
  // State za selektovane parametre
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [selectedSub, setSelectedSub] = useState(SUB_CATEGORIES_DB[DEFAULT_CATEGORIES[0]][0]);
  const [selectedCamera, setSelectedCamera] = useState(CAMERA_PRESETS[0]);
  const [selectedLighting, setSelectedLighting] = useState(LIGHTING_PRESETS[0]);
  const [selectedStyle, setSelectedStyle] = useState(Object.keys(STYLE_PRESETS)[0]);
  
  // Finalni generisani prompt
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Ažuriranje podkategorije kada se promeni glavna kategorija
  useEffect(() => {
    if (SUB_CATEGORIES_DB[selectedCategory]) {
      setSelectedSub(SUB_CATEGORIES_DB[selectedCategory][0]);
    }
  }, [selectedCategory]);

  // Funkcija za inženjersko generisanje prompta sa 0% odstupanja
  const handleGeneratePrompt = () => {
    const styleData = STYLE_PRESETS[selectedStyle];
    const prompt = `${selectedSub}. ${selectedCamera}. ${selectedLighting}. ${styleData.suffix}`;
    setGeneratedPrompt(prompt);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300 p-8 font-mono">
      {/* HEADER V8 ENGINE */}
      <header className="mb-8 border-b border-orange-500/30 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wider flex items-center gap-3">
            <Cpu className="text-orange-500" size={32} />
            V8 VISUAL ENGINE
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">Advanced Mathematical Model • 150MP CGI Rendering • 0% Geometric Deviation</p>
        </div>
        <div className="flex items-center gap-2 text-orange-500 bg-orange-500/10 px-4 py-2 rounded border border-orange-500/20">
          <Database size={18} />
          <span className="text-sm font-semibold tracking-widest">DB CONNECTED</span>
        </div>
      </header>

      {/* MAIN GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEVA KOLONA: KATEGORIJE (Prikazuje sve bez skraćivanja) */}
        <div className="lg:col-span-4 bg-black border border-zinc-800 p-6 rounded shadow-2xl">
          <h2 className="text-orange-500 font-bold mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
            <Settings size={18} />
            ROOT CATEGORY
          </h2>
          <div className="space-y-2 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {DEFAULT_CATEGORIES.map((cat, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded transition-all duration-200 text-sm ${
                  selectedCategory === cat 
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' 
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* SREDNJA KOLONA: PODKATEGORIJE & KONTROLE */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* PODKATEGORIJE */}
          <div className="bg-black border border-zinc-800 p-6 rounded shadow-2xl">
            <h2 className="text-orange-500 font-bold mb-4 flex items-center gap-2 border-b border-zinc-800 pb-2">
              <Crosshair size={18} />
              EXACT TARGET (SUBCATEGORY)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {SUB_CATEGORIES_DB[selectedCategory]?.map((sub, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedSub(sub)}
                  className={`text-left px-4 py-3 rounded transition-all duration-200 text-xs truncate ${
                    selectedSub === sub 
                      ? 'bg-orange-500/20 text-orange-500 border border-orange-500/50' 
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-transparent'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* V8 OPTICAL & LIGHTING ENGINE */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* KAMERA */}
            <div className="bg-black border border-zinc-800 p-4 rounded">
              <label className="text-orange-500 text-xs font-bold mb-3 flex items-center gap-2">
                <Aperture size={14} /> CAMERA PRESET
              </label>
              <select 
                className="w-full bg-zinc-900 text-zinc-300 border border-zinc-700 rounded p-2 text-sm focus:border-orange-500 focus:outline-none"
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                {CAMERA_PRESETS.map((cam, index) => (
                  <option key={index} value={cam}>{cam}</option>
                ))}
              </select>
            </div>

            {/* OSVETLJENJE */}
            <div className="bg-black border border-zinc-800 p-4 rounded">
              <label className="text-orange-500 text-xs font-bold mb-3 flex items-center gap-2">
                <Sun size={14} /> LIGHTING ENVIRONMENT
              </label>
              <select 
                className="w-full bg-zinc-900 text-zinc-300 border border-zinc-700 rounded p-2 text-sm focus:border-orange-500 focus:outline-none"
                value={selectedLighting}
                onChange={(e) => setSelectedLighting(e.target.value)}
              >
                {LIGHTING_PRESETS.map((light, index) => (
                  <option key={index} value={light}>{light}</option>
                ))}
              </select>
            </div>

            {/* STIL */}
            <div className="bg-black border border-zinc-800 p-4 rounded">
              <label className="text-orange-500 text-xs font-bold mb-3 flex items-center gap-2">
                <Settings size={14} /> STYLE PRESET
              </label>
              <select 
                className="w-full bg-zinc-900 text-zinc-300 border border-zinc-700 rounded p-2 text-sm focus:border-orange-500 focus:outline-none"
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
              >
                {Object.keys(STYLE_PRESETS).map((styleKey, index) => (
                  <option key={index} value={styleKey}>{STYLE_PRESETS[styleKey].label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* AKCIJA I OUTPUT */}
          <div className="mt-auto flex flex-col gap-4">
            <button 
              onClick={handleGeneratePrompt}
              className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-4 rounded transition-colors duration-200 flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <Cpu size={20} />
              Construct Prompt Engineering Matrix
            </button>

            {generatedPrompt && (
              <div className="bg-zinc-900 border border-orange-500/50 p-4 rounded relative">
                <span className="absolute -top-3 left-4 bg-zinc-950 px-2 text-xs text-orange-500 font-bold">FINAL V8 OUTPUT</span>
                <p className="text-white text-sm leading-relaxed">{generatedPrompt}</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER - PAYMENT & SECURITY */}
      <footer className="mt-12 pt-6 border-t border-zinc-800 flex items-center justify-between">
        <p className="text-zinc-600 text-xs">V8 Engine Environment v1.0.0</p>
        <button className="flex items-center gap-2 text-green-500 bg-green-500/10 px-4 py-2 rounded text-sm hover:bg-green-500/20 transition border border-green-500/20 font-bold tracking-wide">
          <ShieldCheck size={16} />
          PROCEED TO SECURITY CHECKOUT
        </button>
      </footer>

    </div>
  );
}
// KRAJ FAJLA: V8GridSystem.jsx