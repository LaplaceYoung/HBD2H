import React from 'react';
import { motion } from 'framer-motion';

/**
 * ServicesSlide — 纯展示卡片，不再内嵌占卜引擎。
 * 占卜功能已独立为 TarotSlide，作为下一页全屏 Slide 存在。
 */
export const ServicesSlide: React.FC = () => {
    const services = [
        {
            id: "moon",
            icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow-moon" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.5" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-moon)" />
                    <circle cx="8" cy="8" r="0.8" fill="currentColor" opacity="0.4" />
                    <circle cx="10" cy="14" r="0.5" fill="currentColor" opacity="0.3" />
                </svg>
            ),
            title: "月相解读",
            desc: "情绪波动与潜意识深度分析",
            color: "rgba(160, 180, 255, 0.9)",
            glowColor: "rgba(160, 180, 255, 0.12)"
        },
        {
            id: "tarot",
            icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow-tarot" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#ffd700" />
                            <stop offset="100%" stopColor="#ff8c00" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2L13.8 9L21 11L13.8 13L12 20L10.2 13L3 11L10.2 9L12 2Z" stroke="url(#gold-grad)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-tarot)" />
                    <circle cx="18" cy="5" r="1.2" fill="url(#gold-grad)" opacity="0.6" />
                    <circle cx="6" cy="17" r="1" fill="url(#gold-grad)" opacity="0.5" />
                    <circle cx="17" cy="17" r="0.6" fill="url(#gold-grad)" opacity="0.3" />
                </svg>
            ),
            title: "塔罗密语",
            desc: "解惑当下困惑 · 预见近期转机",
            color: "rgba(255, 215, 0, 0.95)",
            glowColor: "rgba(255, 200, 50, 0.18)"
        },
        {
            id: "astrolabe",
            icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow-astro" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="0.8" filter="url(#glow-astro)" />
                    <circle cx="12" cy="12" r="5.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
                    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="0.8" />
                    <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
                    <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="0.4" opacity="0.4" />
                </svg>
            ),
            title: "星盘排列",
            desc: "完整的一生运势与性格蓝图",
            color: "rgba(255, 160, 210, 0.9)",
            glowColor: "rgba(255, 150, 200, 0.12)"
        },
        {
            id: "eye",
            icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow-eye" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path d="M2.5 12C2.5 12 6.5 5 12 5C17.5 5 21.5 12 21.5 12C21.5 12 17.5 19 12 19C6.5 19 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-eye)" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" />
                </svg>
            ),
            title: "灵感洞察",
            desc: "针对具体问题的直觉解答",
            color: "rgba(120, 255, 200, 0.9)",
            glowColor: "rgba(100, 255, 200, 0.12)"
        },
        {
            id: "wind",
            icon: (
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <filter id="glow-wind" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1.2" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path d="M4 8h11a3 3 0 1 0-2.5-4.5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" filter="url(#glow-wind)" />
                    <path d="M2 12h16a3 3 0 1 1-3 5" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" filter="url(#glow-wind)" />
                    <path d="M6 16h7a2 2 0 1 0 2-3" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" filter="url(#glow-wind)" />
                </svg>
            ),
            title: "能量清理",
            desc: "数字化冥想与脉轮平衡建议",
            color: "rgba(200, 170, 255, 0.9)",
            glowColor: "rgba(200, 160, 255, 0.12)"
        },
    ];

    return (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
            <motion.h2
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[clamp(22px,3.5vw,44px)] font-serif font-light mb-8 md:mb-10 text-center tracking-wide"
            >
                探索你的多维命运
            </motion.h2>

            {/* 五张卡片 — grid 等分 */}
            <div className="grid grid-cols-5 gap-3 md:gap-5 w-full max-w-[1400px] px-4">
                {services.map((svc, i) => (
                    <motion.div
                        key={svc.id}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                        className="group relative overflow-hidden flex flex-col items-center justify-center text-center py-8 md:py-10 px-3 md:px-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-gradient-to-b from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-white/[0.12] cursor-default hover:-translate-y-1"
                    >
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                            style={{ background: `radial-gradient(ellipse at center, ${svc.glowColor} 0%, transparent 70%)` }}
                        />
                        <div className="relative z-10 mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-110" style={{ color: svc.color }}>
                            {svc.icon}
                        </div>
                        <h3 className="relative z-10 text-[clamp(14px,1.3vw,20px)] font-serif mb-2 tracking-wider" style={{ color: 'rgba(255,255,255,0.88)' }}>
                            {svc.title}
                        </h3>
                        <p className="relative z-10 text-white/35 text-[11px] md:text-[13px] leading-relaxed tracking-wider font-light max-w-[180px]">
                            {svc.desc}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* 底部提示：向下滑动进入占卜 */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.35 }}
                transition={{ delay: 1.2 }}
                className="mt-6 md:mt-8 text-[11px] tracking-[0.25em] uppercase"
            >
                ↓ 向下滑动开始占卜 ↓
            </motion.p>
        </div>
    );
};
