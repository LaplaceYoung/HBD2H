import React from 'react';
import classNames from 'classnames';
import type { Spread, DrawnCard } from '../../utils/tarotLogic';
import { Card } from '../Card/Card';
import styles from './SpreadBoard.module.css';

interface SpreadBoardProps {
    spread: Spread;
    drawnCards: (DrawnCard | null)[]; // length matches spread.positions
    onDrawClick?: (index: number) => void;
    onCardClick?: (index: number) => void;
    allDrawn: boolean;
}

export const SpreadBoard: React.FC<SpreadBoardProps> = ({ spread, drawnCards, onDrawClick, onCardClick, allDrawn }) => {
    return (
        <div className={styles.boardContainer}>
            <div className={styles.spreadTitleWrapper}>
                <h2 className={styles.spreadTitle}>{spread.name}</h2>
                <p className={styles.spreadDesc}>{spread.description}</p>
            </div>

            <div className={styles.boardArea}>
                {spread.positions.map((pos, index) => {
                    const card = drawnCards[index];
                    // Simple visual layout using x and y offsets mapping to translate
                    const positionalStyle = {
                        transform: `translate(${pos.x || 0}px, ${pos.y || 0}px)`,
                    };

                    return (
                        <div
                            key={pos.id}
                            className={styles.cardSlotWrapper}
                            style={positionalStyle}
                        >
                            <div className={styles.slotLabel}>
                                <span className={styles.slotName}>{pos.name}</span>
                            </div>

                            {!card ? (
                                // Empty slot waiting to be drawn
                                <div
                                    className={classNames(styles.emptySlot, { [styles.clickable]: !!onDrawClick })}
                                    onClick={() => onDrawClick && onDrawClick(index)}
                                >
                                    <span className={styles.drawHint}>点击抽牌</span>
                                </div>
                            ) : (
                                // Drawn card slot
                                <div
                                    className={classNames(styles.drawnCardWrapper, { [styles.clickable]: allDrawn && !!onCardClick })}
                                    onClick={() => { if (allDrawn && onCardClick) onCardClick(index); }}
                                >
                                    <Card
                                        card={card}
                                        isFlipped={true}
                                        delay={100}
                                        interactive={allDrawn}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
