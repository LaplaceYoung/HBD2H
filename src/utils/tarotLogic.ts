import cardsDataRaw from '../../public/cards/cards.json';

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
    x?: number;
    y?: number;
}

export interface Spread {
    id: string;
    name: string;
    description: string;
    positions: SpreadPosition[];
}

export const SPREADS: Spread[] = [
    {
        id: 'single',
        name: '星辰启示',
        description: '单牌占卜，透过当下的关键能量，洞悉星辰给予的最直接建议。',
        positions: [
            { id: 'guidance', name: '启示', meaning: '宇宙此刻对你的核心提示' }
        ]
    },
    {
        id: 'past-present-future',
        name: '时光之流',
        description: '三牌占卜，连接你的过去、当下与未来，揭示命运的发展轨迹。',
        positions: [
            { id: 'past', name: '过去', meaning: '事情的起因与过往的影响' },
            { id: 'present', name: '当下', meaning: '目前的处境与当前的能量' },
            { id: 'future', name: '未来', meaning: '潜在的趋势与最终的导向' }
        ]
    }
];

export const CARDS: CardData[] = (cardsDataRaw as CardData[]).map(card => ({
    ...card,
    image: card.image.startsWith('/') ? '.' + card.image : card.image
}));

export const drawCards = (count: number): DrawnCard[] => {
    const shuffled = [...CARDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(card => ({
        ...card,
        isReversed: Math.random() > 0.5,
        positionName: '',
        positionMeaning: ''
    }));
};

export const getSpreadById = (id: string): Spread | undefined => {
    return SPREADS.find(s => s.id === id);
};
