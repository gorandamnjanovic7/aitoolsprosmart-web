import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const V8Privacy = () => {
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
                        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-widest text-white">Privacy Policy</h1>
                    </div>
                    
                    <div className="space-y-6 text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                        <p><strong>1. DATA WE COLLECT:</strong> We collect necessary information to process your digital orders, including your email address and payment status. We do NOT store your credit card information directly; all payments are processed securely by Lemon Squeezy (our Merchant of Record).</p>
                        
                        <p><strong>2. HOW WE USE YOUR DATA:</strong> Your email is used exclusively to deliver digital products, grant access to the VIP Vault, and send important updates regarding your purchases.</p>
                        
                        <p><strong>3. ANALYTICS:</strong> We use basic, anonymized internal analytics (tracking page views and clicks) to improve our UI/UX. We do not sell your personal data to third parties.</p>
                        
                        <p><strong>4. COOKIES:</strong> We use minimal cookies to manage user sessions (such as keeping you logged into the VIP Vault). You can disable cookies in your browser, but it may affect site functionality.</p>

                        <p><strong>5. CONTACT US:</strong> If you wish to have your data removed from our database, please contact us at aitoolsprosmart@gmail.com.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default V8Privacy;