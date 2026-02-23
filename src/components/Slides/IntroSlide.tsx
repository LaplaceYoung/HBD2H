import React from 'react';
import { motion } from 'framer-motion';

export const IntroSlide: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center">
            <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                <h2 className="text-[clamp(24px,4vw,56px)] font-serif leading-tight mb-2">
                    当算法洞察灵魂
                </h2>
                <h2 className="text-[clamp(24px,4vw,56px)] font-serif leading-tight text-white/50">
                    / 古老星图的新生
                </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-[5.2%] mt-[8%]">
                {/* Data Column */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="flex flex-col justify-start"
                >
                    <div className="text-[clamp(32px,5vw,64px)] font-light text-[var(--color-mystic-purple)] mb-2">1221</div>
                    <div className="text-sm uppercase tracking-widest text-white/50 mb-8 border-b border-white/10 pb-4">颗恒星模拟计算</div>

                    <div className="text-[clamp(32px,5vw,64px)] font-light text-[var(--color-mystic-gold)] mb-2">2026</div>
                    <div className="text-sm uppercase tracking-widest text-white/50 border-b border-white/10 pb-4">核心逻辑节点</div>
                </motion.div>

                {/* Text Column */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-col justify-start text-[clamp(14px,1.2vw,18px)] leading-relaxed text-white/80"
                >
                    <p className="mb-6">
                        数百年来，占星术与塔罗牌依赖灵媒的个人直觉进行超验解读。这带来了高度的主观性与不可解释性。
                    </p>
                    <p>
                        如今，我们通过巨量数据集挖掘古典占星模型的隐藏权重，将古老的人类原型神话与大语言模型相结合，提供比传统方式更为精准、脱离情绪噪音的个人命盘深度解码服务。
                    </p>
                </motion.div>

                {/* Visual Column */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex items-center justify-center relative min-h-[200px]"
                >
                    {/* animated SVG wave to represent 'Frequency of Destiny' */}
                    <svg className="w-full h-full max-w-[200px]" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <motion.path
                            d="M0,50 Q25,10 50,50 T100,50"
                            fill="none"
                            stroke="var(--color-mystic-purple)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                        />
                        {/* Glowing endpoint */}
                        <motion.circle
                            cx="100"
                            cy="50"
                            r="3"
                            fill="white"
                            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </svg>
                    <div className="absolute bottom-0 text-xs tracking-widest text-white/40 uppercase">命运的频率</div>
                </motion.div>
            </div>
        </div>
    );
};
