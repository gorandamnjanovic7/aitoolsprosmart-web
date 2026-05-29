import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// POCETAK FUNKCIJE: V8Privacy
const V8Privacy = () => {
    // POCETAK FUNKCIJE: useEffect
    useEffect(() => { 
        window.scrollTo(0, 0); 
    }, []);
    // KRAJ FUNKCIJE: useEffect

    const privacyData = [
        {
            id: "01",
            title: "DATA WE COLLECT",
            content: "We collect necessary information to process your digital orders, including your email address and payment status. We do NOT store your credit card information directly; all payments are processed securely through our authorized, industry-standard payment processing partners."
        },
        {
            id: "02",
            title: "HOW WE USE YOUR DATA",
            content: "Your email is used exclusively to deliver digital products, grant access to the VIP Vault, and send important updates regarding your purchases."
        },
        {
            id: "03",
            title: "ANALYTICS",
            content: "We use basic, anonymized internal analytics (tracking page views and clicks) to improve our UI/UX. We do not sell your personal data to third parties."
        },
        {
            id: "04",
            title: "COOKIES",
            content: "We use minimal cookies to manage user sessions (such as keeping you logged into the VIP Vault). You can disable cookies in your browser, but it may affect site functionality."
        },
        {
            id: "05",
            title: "CONTACT US",
            content: "If you wish to have your data removed from our database, please contact us at info@aitoolsprosmart.com."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-[#020202] text-white pt-32 pb-24 px-6 font-sans relative overflow-hidden">
            {/* V8 Glow Background Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="inline-flex items-center gap-3 text-orange-500 hover:text-white transition-all duration-300 text-[10px] font-black uppercase tracking-[0.2em] mb-12 group bg-orange-500/10 px-5 py-2.5 rounded-full border border-orange-500/20 hover:border-orange-500/50 hover:bg-orange-500/20 shadow-[0_0_15px_rgba(234,88,12,0.1)]">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
                        Back to Headquarters
                    </Link>
                </motion.div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-orange-500/20 rounded-[2.5rem] p-8 md:p-14 shadow-[0_0_50px_rgba(234,88,12,0.05)]"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-white/5 pb-10">
                        <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 shadow-[inset_0_0_20px_rgba(234,88,12,0.1)]">
                            <Lock className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">
                                Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">Policy</span>
                            </h1>
                            <p className="text-zinc-500 text-xs md:text-sm tracking-[0.2em] uppercase font-bold">AI Tools Pro Smart • Data Protection</p>
                        </div>
                    </div>
                    
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-10"
                    >
                        {privacyData.map((policy) => (
                            // POCETAK FUNKCIJE: Renderovanje pojedinacne polise
                            <motion.div key={policy.id} variants={itemVariants} className="group relative pl-14 md:pl-20">
                                <span className="absolute left-0 top-0 text-3xl md:text-4xl font-black text-white/5 group-hover:text-orange-500/20 transition-colors duration-500 tracking-tighter select-none">
                                    {policy.id}
                                </span>
                                <div className="space-y-3 pt-1">
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-widest group-hover:text-orange-400 transition-colors duration-300">
                                        {policy.title}
                                    </h3>
                                    <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed">
                                        {policy.content}
                                    </p>
                                </div>
                            </motion.div>
                            // KRAJ FUNKCIJE: Renderovanje pojedinacne polise
                        ))}
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600"
                    >
                        <span>© 2026 AI Tools Pro</span>
                        <span className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
                            System Active
                        </span>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
// KRAJ FUNKCIJE: V8Privacy

export default V8Privacy;