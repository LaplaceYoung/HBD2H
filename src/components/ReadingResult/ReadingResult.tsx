import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import classNames from 'classnames';
import styles from './ReadingResult.module.css';
import type { DrawnCard } from '../../utils/tarotLogic';
import { getAssetUrl } from '../../utils/assetHelper';

interface ReadingResultProps {
    content: string; // Markdown content
    loading: boolean;
    cards: DrawnCard[];
    initialFocusedIndex?: number;
    onClose?: () => void;
}

/**
 * ReadingResult — 左右布局的解盘弹窗。
 * 左侧展示 3D 旋转放大的卡牌大图，右侧流式展示大模型生成的解盘 Markdown。
 */
export const ReadingResult: React.FC<ReadingResultProps> = ({
    content,
    loading,
    cards,
    initialFocusedIndex = 0,
    onClose
}) => {
    const [focusedIndex, setFocusedIndex] = useState(initialFocusedIndex);
    const [displayedContent, setDisplayedContent] = useState('');
    const contentRef = useRef<HTMLDivElement>(null);

    // 同步初始焦点数据
    useEffect(() => {
        setFocusedIndex(initialFocusedIndex);
    }, [initialFocusedIndex]);

    // 打字机效果
    useEffect(() => {
        if (loading || !content) {
            setDisplayedContent('');
            return;
        }

        let currentIndex = 0;
        const interval = setInterval(() => {
            setDisplayedContent(content.slice(0, currentIndex));
            currentIndex += 2; // 稍微加快点速度

            if (currentIndex > content.length + 1) {
                clearInterval(interval);
            }
        }, 10);

        return () => clearInterval(interval);
    }, [content, loading]);

    // 自动滚动到底部
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [displayedContent]);

    const handlePrev = () => setFocusedIndex((i) => (i > 0 ? i - 1 : cards.length - 1));
    const handleNext = () => setFocusedIndex((i) => (i < cards.length - 1 ? i + 1 : 0));

    const currentCard = cards[focusedIndex];

    if (!loading && !content && cards.length === 0) return null;

    return (
        <div className={styles.overlayModal}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={classNames(styles.readingContainer, 'glass-panel')}
            >
                {onClose && (
                    <button className={styles.closeBtn} onClick={onClose} aria-label="关闭解析">
                        <X size={24} />
                    </button>
                )}

                <div className={styles.splitContent}>
                    {/* 左侧：卡牌大图展示 */}
                    <div className={styles.leftSide}>
                        <AnimatePresence mode="wait">
                            <div key={currentCard.id} className={styles.cardHeroWrapper}>
                                <motion.div
                                    initial={{
                                        rotateY: 0,
                                        scale: 0.8,
                                        opacity: 0,
                                        z: -100
                                    }}
                                    animate={{
                                        rotateY: 360,
                                        scale: 1,
                                        opacity: 1,
                                        z: 0
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0.23, 1, 0.32, 1]
                                    }}
                                    className={styles.cardImageContainer}
                                >
                                    <img
                                        src={getAssetUrl(currentCard.image)}
                                        alt={currentCard.nameZh}
                                        className={classNames(styles.heroImage, {
                                            [styles.reversed]: currentCard.isReversed
                                        })}
                                    />
                                    <div className={styles.cardAura}></div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className={styles.cardInfo}
                                >
                                    <h3 className={styles.heroCardName}>{currentCard.nameZh}</h3>
                                    <span className={styles.heroPosition}>
                                        {currentCard.positionName} · {currentCard.isReversed ? '逆位' : '正位'}
                                    </span>
                                </motion.div>
                            </div>
                        </AnimatePresence>

                        {/* 导航按钮 */}
                        {cards.length > 1 && (
                            <div className={styles.navControls}>
                                <button onClick={handlePrev} className={styles.navBtn}>
                                    <ChevronLeft size={20} />
                                </button>
                                <div className={styles.navIndicator}>
                                    {focusedIndex + 1} / {cards.length}
                                </div>
                                <button onClick={handleNext} className={styles.navBtn}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* 右侧：阅读解析 */}
                    <div className={styles.rightSide}>
                        <div className={styles.contentWrapper} ref={contentRef}>
                            {loading ? (
                                <div className={styles.loadingState}>
                                    <div className={styles.spinner}></div>
                                    <p className={styles.loadingText}>正在观测时空中的投影...</p>
                                    <p className={styles.loadingSubText}>请稍候，由于宇宙的阻尼感，信使需要一点时间</p>
                                </div>
                            ) : (
                                <div className={styles.markdownContent}>
                                    <ReactMarkdown>{displayedContent}</ReactMarkdown>
                                    {displayedContent.length < content.length && <span className={styles.cursor}></span>}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className={styles.decorativeBorder}></div>
            </motion.div>
        </div>
    );
};
