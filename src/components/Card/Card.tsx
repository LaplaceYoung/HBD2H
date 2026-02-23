import React from 'react';
import classNames from 'classnames';
import styles from './Card.module.css';
import type { DrawnCard } from '../../utils/tarotLogic';

interface CardProps {
    card?: DrawnCard | null;
    isFlipped?: boolean;
    onClick?: () => void;
    className?: string;
    delay?: number;
    interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
    card,
    isFlipped = false,
    onClick,
    className,
    delay = 0,
    interactive = true
}) => {
    return (
        <div
            className={classNames(styles.cardContainer, className, { [styles.interactive]: interactive })}
            onClick={interactive ? onClick : undefined}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={classNames(styles.cardInner, { [styles.flipped]: isFlipped })}>
                {/* Back of the card */}
                <div className={classNames(styles.cardFace, styles.cardBack)}>
                    <img src="/cards/卡背.jpeg" alt="Card Back" loading="lazy" />
                    <div className={styles.cardGlow}></div>
                </div>
                {/* Front of the card */}
                <div className={classNames(styles.cardFace, styles.cardFront)}>
                    {card && (
                        <img
                            src={card.image}
                            alt={card.nameZh}
                            loading="lazy"
                            className={classNames({ [styles.reversedImage]: card.isReversed })}
                        />
                    )}
                    <div className={styles.cardGlow}></div>
                    {card && (
                        <div className={styles.cardOverlayInfo}>
                            <span className={styles.cardName}>{card.nameZh}</span>
                            {card.isReversed && <span className={styles.cardOrientation}>逆位</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
