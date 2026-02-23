import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Maximize, Settings } from 'lucide-react';
import { ApiConfigPanel } from '../ApiConfig/ApiConfigPanel';
import { getAssetUrl } from '../../utils/assetHelper';

interface PresentationProps {
    slides: React.FC[];
}

export const Presentation: React.FC<PresentationProps> = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const playerRef = useRef<HTMLVideoElement | null>(null);
    const lastScrollTime = useRef<number>(0);
    const [showApiConfig, setShowApiConfig] = useState(false);

    // 键盘导航
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                setCurrentSlide((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'f') {
                toggleFullscreen();
            }
        },
        [slides.length]
    );

    // 滚轮导航 — 使用 React 的 onWheel 而不是 window 监听器
    // 这样子组件可以通过 e.stopPropagation() 阻止翻页
    const handleWheel = useCallback((e: React.WheelEvent) => {
        const now = Date.now();
        if (now - lastScrollTime.current < 800) return;

        if (e.deltaY > 20) {
            setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
            lastScrollTime.current = now;
        } else if (e.deltaY < -20) {
            setCurrentSlide((prev) => Math.max(prev - 1, 0));
            lastScrollTime.current = now;
        }
    }, [slides.length]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error("Error attempting to enable fullscreen:", err.message);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const toRoman = (num: number) => {
        const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        return roman[num] || String(num + 1);
    };

    return (
        <div
            className="relative w-screen h-[100dvh] overflow-hidden bg-black text-white font-sans"
            onWheel={handleWheel}
        >
            {/* 背景视频（本地静音轮播） */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                <video
                    ref={playerRef}
                    src={getAssetUrl('bg-mystical.mp4')}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full mix-blend-screen overflow-hidden"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2)_0%,#000000_100%)] block" />
            </div>

            {/* 主内容区 */}
            <div className="relative z-10 w-full h-full">
                <AnimatePresence mode="wait">
                    {slides.map(
                        (Slide, index) =>
                            index === currentSlide && (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                                    className="w-full h-full absolute inset-0 flex flex-col items-center justify-center p-[4%] md:p-[5.2%] pb-[120px] md:pb-[5.2%]"
                                >
                                    <Slide />
                                </motion.div>
                            )
                    )}
                </AnimatePresence>
            </div>

            {/* 底部导航 */}
            <div className="absolute bottom-[2%] md:bottom-[4%] left-0 w-full px-[5.2%] flex justify-between items-center z-50 text-white/50 text-sm tracking-widest pointer-events-none">
                <div className="w-1/4 text-xs md:text-sm text-left opacity-60">
                    {toRoman(currentSlide)} / {toRoman(slides.length - 1)}
                </div>

                <div className="w-2/4 flex justify-center items-center gap-2 md:gap-3 pointer-events-auto">
                    {slides.map((_, idx) => (
                        <div
                            key={idx}
                            className={`transition-all duration-500 rounded-full cursor-pointer ${idx === currentSlide
                                ? 'w-6 md:w-8 h-1 bg-white/90'
                                : 'w-1 md:w-1.5 h-1 bg-white/20 hover:bg-white/50'
                                }`}
                            onClick={() => setCurrentSlide(idx)}
                        />
                    ))}
                </div>

                <div className="w-1/4 flex justify-end items-center gap-4 md:gap-6 pointer-events-auto">
                    <button
                        onClick={() => setCurrentSlide((p) => Math.max(p - 1, 0))}
                        className="hover:text-white transition-colors disabled:opacity-30 hidden md:block"
                        disabled={currentSlide === 0}
                    >
                        <ChevronUp size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentSlide((p) => Math.min(p + 1, slides.length - 1))}
                        className="hover:text-white transition-colors disabled:opacity-30 hidden md:block"
                        disabled={currentSlide === slides.length - 1}
                    >
                        <ChevronDown size={20} />
                    </button>
                    <button onClick={toggleFullscreen} className="hover:text-white transition-colors ml-0 md:ml-4">
                        <Maximize size={18} />
                    </button>
                    <button
                        onClick={() => setShowApiConfig(true)}
                        className="hover:text-[var(--color-mystic-gold)] transition-colors ml-2 md:ml-4"
                        title="配置 API Key"
                    >
                        <Settings size={18} />
                    </button>
                </div>
            </div>


            {/* API 配置面板 */}
            <ApiConfigPanel isOpen={showApiConfig} onClose={() => setShowApiConfig(false)} />
        </div>
    );
};

