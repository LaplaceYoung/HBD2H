import React from 'react';
import { motion } from 'framer-motion';

export const QuoteSlide: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden">

            {/* Subtle backdrop glowing orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vh] h-[60vh] bg-white/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

            <motion.div
                initial={{ scale: 0.9, filter: 'blur(10px)', opacity: 0 }}
                animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <h2 className="text-[clamp(28px,6vw,64px)] font-serif font-light tracking-[-0.02em] leading-relaxed mb-12 max-w-[80%] mx-auto text-transparent bg-clip-text bg-gradient-to-br from-white via-white/80 to-white/30">
                    “满天星辰，<br />
                    皆是为你而写的剧本。”
                </h2>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 0.9 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-sm md:text-lg tracking-[0.2em] font-light italic"
                >
                    — 赫耳墨斯·特里斯墨吉斯忒斯
                </motion.div>
            </motion.div>
        </div>
    );
};
