import React from 'react';
import { motion } from 'framer-motion';
import { getAssetUrl } from '../../utils/assetHelper';

export const CoverSlide: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center relative">
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="absolute top-0 left-0 w-full flex justify-between items-center text-xs tracking-[0.2em] opacity-80"
            >
                <div className="flex items-center gap-2">
                    <img src={getAssetUrl('hyj-logo.svg')} alt="HYJ Logo" className="w-8 h-8 opacity-90" />
                    <span className="uppercase font-serif text-white/90">HYJ TAROT</span>
                </div>
                <div>命运之眼 · 2026</div>
            </motion.div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="flex flex-col items-center"
            >
                <h1 className="text-[clamp(32px,6vw,96px)] font-serif font-bold leading-tight tracking-widest mb-4 mystic-title uppercase">
                    Tarot Only For U
                </h1>
                <p className="text-[clamp(16px,2vw,24px)] text-white/90 font-light tracking-wide mb-8">
                    解码宇宙隐藏的信号
                </p>

                <div className="glass-card px-8 py-3 rounded-full text-sm tracking-wider text-white/75 mt-4">
                    首席占卜师: 奥拉(Oracle)
                </div>

                <div className="mt-8 flex flex-col items-center gap-2 opacity-60">
                    <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
                    <span className="text-[10px] tracking-[0.3em] font-light">向下滑动开启灵魂解读</span>
                </div>
            </motion.div>
        </div>
    );
};
