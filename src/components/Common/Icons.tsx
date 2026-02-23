import React from 'react';

/**
 * 精致的 SVG 图标库 - 用于平衡神秘感与现代交互。
 * 替代原始的默认 Emoji，采用统一的金色渐变与发光效果。
 */

interface IconProps {
    size?: number;
    className?: string;
}

const Defs: React.FC = () => (
    <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
            <linearGradient id="mystic-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(212, 175, 55, 1)" />
                <stop offset="100%" stopColor="rgba(255, 235, 150, 0.8)" />
            </linearGradient>
            <filter id="icon-glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
    </svg>
);

export const SparkleIcon: React.FC<IconProps> = ({ size = 20, className }) => (
    <>
        <Defs />
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            className={className} style={{ filter: 'url(#icon-glow)' }}
        >
            <path d="M12 3L13.5 9L19.5 10.5L13.5 12L12 18L10.5 12L4.5 10.5L10.5 9L12 3Z" fill="url(#mystic-gold-grad)" />
            <circle cx="19" cy="5" r="1.5" fill="url(#mystic-gold-grad)" opacity="0.6" />
            <circle cx="5" cy="19" r="1.2" fill="url(#mystic-gold-grad)" opacity="0.4" />
        </svg>
    </>
);

export const GalaxyIcon: React.FC<IconProps> = ({ size = 20, className }) => (
    <>
        <Defs />
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            className={className} style={{ filter: 'url(#icon-glow)' }}
        >
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="url(#mystic-gold-grad)" opacity="0.3" />
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z" fill="url(#mystic-gold-grad)" />
            <path d="M12 6C15.31 6 18 8.69 18 12C18 13.1 17.7 14.12 17.18 15" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M6.82 9C6.3 9.88 6 10.9 6 12C6 15.31 8.69 18 12 18" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </svg>
    </>
);

export const ScrollIcon: React.FC<IconProps> = ({ size = 20, className }) => (
    <>
        <Defs />
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            className={className} style={{ filter: 'url(#icon-glow)' }}
        >
            <path d="M18 2H7C5.34 2 4 3.34 4 5V19C4 20.66 5.34 22 7 22H18C19.66 22 21 20.66 21 19V5C21 3.34 19.66 22 18 2Z" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" />
            <path d="M4 19C4 20.66 5.34 22 7 22H18" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9 7H16M9 11H16M9 15H13" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </svg>
    </>
);

export const KeyIcon: React.FC<IconProps> = ({ size = 20, className }) => (
    <>
        <Defs />
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            className={className} style={{ filter: 'url(#icon-glow)' }}
        >
            <path d="M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65ZM7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z" fill="url(#mystic-gold-grad)" />
        </svg>
    </>
);

export const CrystalBallIcon: React.FC<IconProps> = ({ size = 20, className }) => (
    <>
        <Defs />
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            className={className} style={{ filter: 'url(#icon-glow)' }}
        >
            <circle cx="12" cy="10" r="8" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" />
            <path d="M12 6C14.21 6 16 7.79 16 10" stroke="url(#mystic-gold-grad)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
            <path d="M5 19H19M7 22H17" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 18V22" stroke="url(#mystic-gold-grad)" strokeWidth="1.5" />
            <circle cx="14" cy="8" r="1" fill="white" opacity="0.3" />
        </svg>
    </>
);
