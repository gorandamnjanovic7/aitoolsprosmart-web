import { motion } from 'framer-motion';

const ScanOverlay = () => {
    return (
        <motion.div 
            className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Narandžasta linija koja skenira */}
            <motion.div 
                className="w-full h-[2px] bg-[#FF8C00] shadow-[0_0_20px_#FF8C00]"
                initial={{ y: 0 }}
                animate={{ y: '100vh' }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            {/* Efekat otvaranja stranice iza linije */}
            <motion.div 
                className="absolute inset-0 bg-[#050505]"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            />
        </motion.div>
    );
};

export default ScanOverlay;