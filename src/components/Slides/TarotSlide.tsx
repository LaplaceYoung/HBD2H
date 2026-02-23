import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpreadBoard } from '../SpreadBoard/SpreadBoard';
import type { Spread, DrawnCard } from '../../utils/tarotLogic';
import { SPREADS, drawCards } from '../../utils/tarotLogic';
import { getTarotReading } from '../../api/llmApi';
import { ReadingResult } from '../ReadingResult/ReadingResult';
import { SparkleIcon } from '../Common/Icons';

/**
 * TarotSlide — 独立的全屏占卜交互页面。
 * 作为 Presentation 中的一个完整 Slide 存在，滚动到此页面即可体验。
 * 自身通过 stopPropagation 阻止内部滚动事件冒泡到 Presentation 的翻页逻辑。
 */
export const TarotSlide: React.FC = () => {
    const [activeSpread, setActiveSpread] = useState<Spread>(SPREADS.threeCards);
    const [sessionDeck, setSessionDeck] = useState<DrawnCard[]>([]);
    const [drawnCards, setDrawnCards] = useState<(DrawnCard | null)[]>([]);
    const [readingContent, setReadingContent] = useState<string>('');
    const [isReadingLoading, setIsReadingLoading] = useState<boolean>(false);
    const [showResultModal, setShowResultModal] = useState<boolean>(false);
    const [focusedCardIndex, setFocusedCardIndex] = useState<number>(0);
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        setSessionDeck(drawCards(activeSpread));
        setDrawnCards(new Array(activeSpread.positions.length).fill(null));
        setReadingContent('');
        setShowResultModal(false);
    }, [activeSpread]);

    const handleDrawClick = (index: number) => {
        const newDrawnCards = [...drawnCards];
        newDrawnCards[index] = sessionDeck[index];
        setDrawnCards(newDrawnCards);
        const isComplete = newDrawnCards.every(c => c !== null);
        if (isComplete) {
            startReadingInBackground(newDrawnCards as DrawnCard[]);
        }
    };

    const startReadingInBackground = async (fullDeck: DrawnCard[]) => {
        setIsReadingLoading(true);
        try {
            const reading = await getTarotReading('', activeSpread, fullDeck);
            setReadingContent(reading);
        } catch (error) {
            console.error("Tarot API fail", error);
            setReadingContent("星辰的低语暂时被迷雾遮蔽，请稍后再试...");
        } finally {
            setIsReadingLoading(false);
        }
    };

    const handleCardClick = (index: number) => {
        setFocusedCardIndex(index);
        setShowResultModal(true);
    };

    const resetCards = () => {
        setSessionDeck(drawCards(activeSpread));
        setDrawnCards(new Array(activeSpread.positions.length).fill(null));
        setReadingContent('');
        setShowResultModal(false);
    };

    // 阻止此 Slide 内部的滚轮事件冒泡到 Presentation 翻页
    const handleWheelCapture = useCallback((e: React.WheelEvent) => {
        if (hasStarted) {
            e.stopPropagation();
        }
    }, [hasStarted]);

    // 未开始占卜时的"开始占卜"入口
    if (!hasStarted) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                {/* 装饰性的发光圆环 */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vh] h-[40vh] rounded-full border border-[var(--color-mystic-gold)]/10 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[55vh] h-[55vh] rounded-full border border-white/[0.03] pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col items-center text-center z-10"
                >
                    {/* 核心符文图标 */}
                    <motion.svg
                        width="80" height="80" viewBox="0 0 24 24" fill="none"
                        initial={{ rotate: -30, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="mb-8"
                    >
                        <defs>
                            <filter id="glow-main" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                            </filter>
                            <linearGradient id="gold-main" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#ffd700" />
                                <stop offset="100%" stopColor="#ff8c00" />
                            </linearGradient>
                        </defs>
                        <path d="M12 2L13.8 9L21 11L13.8 13L12 20L10.2 13L3 11L10.2 9L12 2Z"
                            stroke="url(#gold-main)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"
                            filter="url(#glow-main)" />
                        <circle cx="18" cy="5" r="1.5" fill="url(#gold-main)" opacity="0.5" />
                        <circle cx="6" cy="17" r="1.2" fill="url(#gold-main)" opacity="0.4" />
                    </motion.svg>

                    <h2 className="text-[clamp(28px,5vw,56px)] font-serif font-light tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-mystic-gold)] to-white/80">
                        命运之牌
                    </h2>

                    <p className="text-white/40 text-[clamp(14px,1.5vw,18px)] tracking-wider mb-10 max-w-md leading-relaxed font-light">
                        在静谧的星光之中<br />翻开属于你的命运篇章
                    </p>

                    <motion.button
                        onClick={() => setHasStarted(true)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="
                            px-10 py-4 text-[clamp(14px,1.2vw,16px)] font-serif tracking-[0.2em] uppercase
                            border border-[var(--color-mystic-gold)]/40 hover:border-[var(--color-mystic-gold)]/70
                            text-[var(--color-mystic-gold)] hover:text-[var(--color-mystic-gold)]
                            bg-[var(--color-mystic-gold)]/[0.04] hover:bg-[var(--color-mystic-gold)]/[0.08]
                            transition-all duration-500
                        "
                    >
                        开始占卜
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    // 占卜进行中的主界面
    return (
        <div
            className="w-full h-full flex flex-col items-center justify-start relative overflow-y-auto"
            onWheelCapture={handleWheelCapture}
        >
            {/* 顶部牌阵切换器 + 返回按钮 */}
            <div className="flex items-center justify-center gap-3 pt-4 pb-4 w-full shrink-0">
                <button
                    onClick={() => { setHasStarted(false); resetCards(); }}
                    className="absolute left-4 top-4 text-white/30 hover:text-white/70 text-sm tracking-wider transition-colors duration-300"
                >
                    ← 返回
                </button>

                {Object.values(SPREADS).map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setActiveSpread(s)}
                        className={`
                            px-4 py-1.5 text-[12px] md:text-sm tracking-wider transition-all duration-300 border
                            ${activeSpread.id === s.id
                                ? 'border-[var(--color-mystic-gold)]/50 text-[var(--color-mystic-gold)] bg-[var(--color-mystic-gold)]/5'
                                : 'border-white/10 text-white/35 hover:border-white/25 hover:text-white/55'
                            }
                        `}
                    >
                        {s.name}
                    </button>
                ))}
            </div>

            {/* 牌阵展示区域 */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[900px] px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSpread.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center w-full"
                    >
                        {/* 牌阵标题由 SpreadBoard 自身提供，此处不再重复 */}

                        <SpreadBoard
                            spread={activeSpread}
                            drawnCards={drawnCards}
                            onDrawClick={handleDrawClick}
                            onCardClick={handleCardClick}
                            allDrawn={drawnCards.length > 0 && drawnCards.every(c => c !== null)}
                        />
                    </motion.div>
                </AnimatePresence>

                {drawnCards.length > 0 && drawnCards.every(c => c !== null) && !showResultModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 flex items-center gap-3 text-[var(--color-mystic-gold)] text-sm tracking-[0.3em] uppercase animate-pulse"
                    >
                        <SparkleIcon size={18} />
                        <span>星辰已就绪，请点击任意牌面开启解盘</span>
                        <SparkleIcon size={18} />
                    </motion.div>
                )}
            </div>

            {/* 底部操作栏 */}
            <div className="shrink-0 pb-6 pt-2 flex gap-4">
                <button
                    onClick={resetCards}
                    className="px-5 py-2 border border-white/10 text-white/35 hover:bg-white/5 hover:text-white/60 text-[12px] tracking-wider transition-all duration-300"
                >
                    重新洗牌
                </button>
            </div>

            {/* 解盘结果弹窗（左右侧布局） */}
            {showResultModal && (
                <ReadingResult
                    content={readingContent}
                    loading={isReadingLoading}
                    cards={drawnCards as DrawnCard[]}
                    initialFocusedIndex={focusedCardIndex}
                    onClose={() => setShowResultModal(false)}
                />
            )}
        </div>
    );
};
