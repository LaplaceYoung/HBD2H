import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './KnowledgeModal.module.css';

interface KnowledgeModalProps {
    onClose: () => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'origin' | 'spreads' | 'elements' | 'reversals'>('origin');

    const tabs = [
        { id: 'origin', label: '渊源与共时性' },
        { id: 'spreads', label: '牌阵与提问法则' },
        { id: 'elements', label: '数字与元素尊位' },
        { id: 'reversals', label: '高阶逆位深度解析' },
    ];

    return (
        <div className={styles.overlayModal}>
            <div className={classNames(styles.modalContainer, 'glass-panel')}>
                <button className={styles.closeBtn} onClick={onClose} aria-label="关闭">
                    &times;
                </button>

                <h2 className={classNames(styles.title, 'gold-gradient-text')}>塔罗高阶解盘架构</h2>
                <p className={styles.subtitle}>跨越宿命迷雾的潜意识镜像学说</p>

                <div className={styles.tabsContainer}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={classNames(styles.tabBtn, { [styles.active]: activeTab === tab.id })}
                            onClick={() => setActiveTab(tab.id as any)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className={styles.contentArea}>
                    {activeTab === 'origin' && (
                        <div className={styles.article}>
                            <h3>塔罗的底层逻辑：并非预言而是潜意识的投射</h3>
                            <p>
                                塔罗牌的运作机制已逐渐剥离了纯粹的超自然预言色彩，转而与瑞士心理学家卡尔·荣格提出的**“共时性（Synchronicity）”**原理深度共鸣。
                                占卜的本质，是问卜者在特定的物理与心理场域中，透过随机抽取的卡牌，与其自身的潜意识建立链接。塔罗牌是一面“映照当下”的心理镜像，协助问卜者进行自我探查，理解内心抗拒或渴望的核心议题，从而重塑主观能动性与选择权。
                            </p>
                            <h3>大阿尔卡那的宏观轨迹</h3>
                            <p>
                                大阿尔卡那（22张）代表着人生中的重大主轴、灵魂进化的史诗旅程与不可抗拒的宏观外部事件。
                                例如，0号**愚者**是一切创造的源头与潜能；而16号**高塔**则代表突如其来的毁灭与现有僵化结构的崩塌觉醒。
                            </p>
                        </div>
                    )}

                    {activeTab === 'spreads' && (
                        <div className={styles.article}>
                            <h3>高精度占卜问题的设定法则</h3>
                            <ul>
                                <li><strong>问题单一化：</strong>将复合变量剥离。不要在一局牌中询问“我该去公司A还是出国留还是创业”。</li>
                                <li><strong>概念明确化：</strong>为其设定具体的时间框架（如“未来三个月内”），并具象化抽象概念。</li>
                                <li><strong>控制领域转移：</strong>将焦点锁定在自身，而不是揣测他人。“他想什么”不如问“我该怎么做才能改善关系”。</li>
                                <li><strong>正面语境：</strong>不以受害者心态提问，绝不问“应不应该做某事”，决定权永远归属于问卜者。</li>
                            </ul>
                            <h3>空间几何的能量映射</h3>
                            <p>
                                每张抽出的卡牌并非孤立存在，而是受到牌位（Position）定义的严格限制。例如“凯尔特十字”包含了十字核心冲突区域与外围成长权杖区域，它是时间维度的流转与潜意识压迫的多层切片。
                            </p>
                        </div>
                    )}

                    {activeTab === 'elements' && (
                        <div className={styles.article}>
                            <h3>四大元素特质（小阿尔卡那本源）</h3>
                            <p>
                                小阿尔卡那分为四族：<strong>火/权杖</strong>（热情、行动、扩张力）、<strong>水/圣杯</strong>（情感、潜意识、人际网络）、<strong>风/宝剑</strong>（理智、沟通冲突、切割）、<strong>土/星币</strong>（物质、财富、稳固基石）。
                            </p>
                            <h3>元素尊位法则（Elemental Dignities）</h3>
                            <p>
                                并列的卡牌间会发生化学反应：
                                <strong>相生强化：</strong>火+风（思想极度活跃与爆裂行动力），水+土（感情滋养带来实质丰盛）。<br />
                                <strong>相克内耗：</strong>火+水（化为蒸汽，表现为极度挣扎与行动迟滞），风+土（理想无法落地，积累被狂风吹散）。
                            </p>
                            <h3>数字演进学（Numerology）</h3>
                            <p>
                                1代表能量爆发的端倪，4代表基础与结构的死板停滞，5象征打破僵局的痛苦危机变动，8代表对物质与因果的高强度聚合，10则意味着极致的终结（亦或压力过载）。
                            </p>
                        </div>
                    )}

                    {activeTab === 'reversals' && (
                        <div className={styles.article}>
                            <h3>突破传统的五维深度逆位解析法</h3>
                            <p>
                                逆位并非简单的“反义字”与坏运势，它意味着能量流转遭逢异常或倒错。高阶解盘者透过五大维度审视：
                            </p>
                            <ol>
                                <li><strong>能量减弱/延迟（Delay）：</strong>正面特质犹存，但时间推演遭遇延缓（如逆位星星）。</li>
                                <li><strong>动能受阻与向内压抑：</strong>本应向外爆发的能量被死死卡住，导致问卜者内心焦躁但行动无力（如逆位战车）。</li>
                                <li><strong>极其反面的变质：</strong>例如逆位正义直接揭露虚伪、暗箱操作与责任逃避。</li>
                                <li><strong>阴影面揭露（Shadow）：</strong>荣格心理学映射，无情指出问卜者潜意识极度压抑的黑暗面。</li>
                                <li><strong>过载极端化（Overcompensation）：</strong>比如逆位金币导致极端扭曲的守财奴病态物质欲。</li>
                            </ol>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
