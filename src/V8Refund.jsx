import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const V8Refund = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-10">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                
                <div className="bg-[#0a0a0a] border border-orange-500/20 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_40px_rgba(234,88,12,0.1)]">
                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <ShieldAlert className="w-8 h-8 text-orange-500" />
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Refund Policy</h1>
                    </div>
                    
                    <div className="space-y-6 text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                        <p><strong>1. DIGITAL GOODS NATURE:</strong> AI TOOLS PRO SMART exclusively provides digital, non-tangible assets and software access. Because our products are instantly delivered and accessible, they are generally non-refundable once the download or access is granted.</p>
                        
                        <p><strong>2. NO REFUNDS:</strong> Due to the nature of digital goods (10X Enhancer access, AI premium stock bundles), we DO NOT offer refunds or exchanges once the purchase is completed and the product is delivered to your email or VIP Vault.</p>
                        
                        <p><strong>3. EXCEPTIONS:</strong> A refund may only be issued under the following strict conditions: (a) You made duplicate purchases by mistake. (b) A verified technical issue on our end prevented you from accessing the product after purchase, and our support team could not resolve it within 72 hours.</p>
                        
                        <p><strong>4. CONTACT:</strong> If you experience technical issues, please contact us via our Contact Widget on the site or at aitoolsprosmart@gmail.com before filing a dispute. We will make every effort to assist you.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V8Refund;