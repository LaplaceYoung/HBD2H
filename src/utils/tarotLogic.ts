export interface CardData {
    id: string;
    nameEn: string;
    nameZh: string;
    type: 'major' | 'minor';
    suit: string | null;
    pip: string | null;
    court: string | null;
    image: string;
}


export interface DrawnCard extends CardData {
    isReversed: boolean;
    positionName: string;
    positionMeaning: string;
}


export interface SpreadPosition {
    id: string;
    name: string;
    meaning: string;
    x?: number; // visual layout coordinates
    y?: number;
}


export interface Spread {
    id: string;
    name: string;
    description: string;
    positions: SpreadPosition[];
}


import cardsDataRaw from '../../public/cards/cards.json';
const CARDS: CardData[] = (cardsDataRaw as CardData[]).map(card => ({
  ...card,
  image: card.image.startsWith("/") ? "." + card.image : card.image
}));


export const SPREADS: Record<string, Spread> = {
