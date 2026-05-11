import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const V8Terms = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                
                <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_40px_rgba(234,88,12,0.1)]">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <Layers className="w-8 h-8 text-orange-500" />
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Terms of Service</h1>
                    </div>
                    
                    <div className="space-y-6 text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                        <p><strong>1. ACCEPTANCE:</strong> By accessing and purchasing from AI TOOLS PRO SMART, you agree to be bound by these Terms of Service. If you disagree, do not use our services.</p>
                        
                        <p><strong>2. LICENSING & USAGE:</strong> Upon purchase of any Premium AI Stock Bundle, you are granted a non-exclusive, worldwide, royalty-free license to use the assets for personal and commercial projects. You MAY NOT resell, redistribute, or re-package the raw assets as your own stock products.</p>
                        
                        <p><strong>3. SOFTWARE ACCESS:</strong> Access to tools like the "10X Enhancer" is provided on a lifetime basis for the current version of the tool. You may not share your VIP login credentials.</p>
                        
                        <p><strong>4. DISCLAIMER:</strong> Our digital products are provided "as is" without warranty of any kind. AI TOOLS PRO SMART shall not be liable for any direct, indirect, or consequential damages arising from the use of our assets or software.</p>

                        <p><strong>5. MODIFICATIONS:</strong> We reserve the right to modify these terms at any time. Continued use of the platform implies acceptance of the updated terms.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V8Terms;