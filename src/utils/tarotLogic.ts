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
    x?: number; // visual layout coordinates
    y?: number;
}

export interface Spread {
    id: string;
    name: string;
    description: string;
    positions: SpreadPosition[];
}

const CARDS_RAW: CardData[] = cardsDataRaw as CardData[];

export const SPREADS: Record<string, Spread> = {
    single: {
        id: 'single',
        name: '单牌占卜 (Single Card Pull)',
        description: '每日指引、快速启示或“是/否”问题解答。',
        positions: [
            { id: 'pos_1', name: '核心指引', meaning: '当前事物最核心的提示、解答或结果。', x: 0, y: 0 }
        ]
    },
    threeCards: {
        id: 'threeCards',
        name: '圣三角占卜 (Three-Card Spread)',
        description: '了解事件的发展脉络，洞见过去、现在与未来的走向。',
        positions: [
            { id: 'pos_past', name: '过去', meaning: '对目前状况产生影响的过去事件或根源。', x: -150, y: 0 },
            { id: 'pos_present', name: '现在', meaning: '目前的处境、状况或心态。', x: 0, y: 0 },
            { id: 'pos_future', name: '未来', meaning: '事物可能发展的自然走向或结果。', x: 150, y: 0 }
        ]
    },
    twoChoices: {
        id: 'twoChoices',
        name: '二选一牌阵 (Two Choices)',
        description: '面临两条路径或重要分歧时的决策参考。',
        positions: [
            { id: 'pos_status', name: '现状', meaning: '求问者目前的状况及面临的选择。', x: 0, y: 120 },
            { id: 'pos_a_status', name: '选择A的现状', meaning: '选择路径A将面临的情况或阻碍。', x: -120, y: 0 },
            { id: 'pos_b_status', name: '选择B的现状', meaning: '选择路径B将面临的情况或阻碍。', x: 120, y: 0 },
            { id: 'pos_a_result', name: '选择A的结果', meaning: '如果坚持选择A的最终发展与结局。', x: -180, y: -120 },
            { id: 'pos_b_result', name: '选择B的结果', meaning: '如果坚持选择B的最终发展与结局。', x: 180, y: -120 }
        ]
    }
};

/**
 * Shuffle an array in place
 */
function shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Draw cards for a specific spread
 */
export function drawCards(spread: Spread): DrawnCard[] {
    const shuffledCards = shuffle(CARDS_RAW);

    return spread.positions.map((pos, index) => {
        const isReversed = Math.random() > 0.6; // 40% reversed
        return {
            ...shuffledCards[index],
            isReversed,
            positionName: pos.name,
            positionMeaning: pos.meaning
        };
    });
}

/**
 * Generate completion prompt for LLM
 */
export function generateLLMPrompt(question: string, spread: Spread, cards: DrawnCard[]): string {
    const cardsDetails = cards.map((c, i) => {
        const orientation = c.isReversed ? '逆位' : '正位';
        return `位置${i + 1} - 【${c.positionName}】 (${c.positionMeaning}): ${c.nameZh} (${c.nameEn}) - ${orientation}`;
    }).join('\n');

    return `
你是一位深谙塔罗牌底层符号学、心理投射与高阶解盘推演逻辑的塔罗大师。现在有一位求问人向你寻求指引。

求问人的问题是：“${question || '无具体问题，寻求普遍指引'}”
使用的牌阵是：【${spread.name}】

求问人抽到的牌如下：
${cardsDetails}

请综合塔罗牌的跨学科渊源（心理学共时性、符号学）、元素尊位法则（风火水土的生克）、数字学演进与逆位五维深度解析法则，为求问人进行一次极具深度的“镜像式”解盘。

**解读核心原则与要求：**
1. **基调与视角**：并非纯粹的宿命论预测，而应以“共时性”为基础，剖析求问人的潜意识、核心焦虑与被压抑的真实需求，赋能求问人重估主观能动性。
2. **结构化详尽布局**：
   - **星辰密语 (整体能量与场域定调)**：基于抽牌的宏观元素比重（大/小阿尔卡纳比例、主导风/火/水/土元素）与数字学演进（0-10阶段），一针见血地概括当前局势的底层发展周期与能量环境。
   - **命运之迹 (多维逐牌深度解析)**：
     - 若为【大阿尔卡那】，阐明其代表的灵魂课题与宏大外部事件轨迹。
     - 若为【小阿尔卡那数字牌】，剖析其代表的日常物质与心理切片，并结合“元素尊位”分析相邻牌之间的化学反应（相生强化或相克内耗）。
     - 若为【宫廷牌】，明确指出其是外部人物干预还是求问者自身的人格特质投射（MBTI等映射）。
     - **特别注意【逆位】**：必须依据局势，从五维（延迟、向内压抑、反面、阴影面暴露、能量过载极端化）中精准选择最契合的一维进行深入解读。
   - **视觉蒙太奇 (牌面张力与故事连动)**：尝试串联起卡牌之间可能的“视线流向”与“物理物件关联”，揭示牌阵中的隐藏对抗或流动（如有）。
   - **迷雾指南 (赋能与破局行动)**：将预测重心从“第三方不可控”转移到“我能做什么”。针对逆位与核心阻碍（如遇倒吊、死神、高塔或小牌过载），给出剥离情感执念、极具实操价值的“破局止损”或“顺势而为”行动建议。
   - **神喻 (潜意识锚定箴言)**：留下一句充满哲理的正面结语，帮助求问人安顿心神。
3. **沉浸式语调**：作为占星塔罗师，你必须全程使用第二人称“你”来称呼求问者，语调神秘、包容且充满洞察力，就像面前正坐着这位星际旅人一样。
4. **格式排版（最高指令）**：
   - **你的回复必须且只能以 "## 星辰密语" 这几个字作为绝对开头！**
   - 必须依次包含以下完整的二级标题：\`## 星辰密语\`、\`## 命运之迹\`、\`## 视觉蒙太奇\`、\`## 迷雾指南\`、\`## 神喻\`。
   - 在 \`## 星辰密语\` 之前，**绝对不允许**有任何诸如“好的”、“我来帮你解读”、“思考过程”等没用的内心独白或前言。直接入戏，绝不可使用 \`<think>\` 标签！
`.trim();
}
