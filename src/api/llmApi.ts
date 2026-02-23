import type { Spread, DrawnCard } from '../utils/tarotLogic';
import { generateLLMPrompt } from '../utils/tarotLogic';

// =========================================================================
// 🔮 支持的 LLM 供应商预设 (Supported LLM Providers)
// =========================================================================

export interface LLMProvider {
    id: string;
    name: string;
    baseURL: string;
    defaultModel: string;
    models: string[];
    /** Anthropic 使用 x-api-key + anthropic-version 头部而非 Bearer Token */
    authStyle: 'bearer' | 'anthropic' | 'gemini';
    /** 构建最终请求 URL 时是否需要追加模型名称（如 Gemini） */
    urlContainsModel?: boolean;
}

export const LLM_PROVIDERS: LLMProvider[] = [
    {
        id: 'openai',
        name: 'OpenAI',
        baseURL: 'https://api.openai.com/v1/chat/completions',
        defaultModel: 'gpt-4o',
        models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'o1-mini', 'o3-mini'],
        authStyle: 'bearer',
    },
    {
        id: 'anthropic',
        name: 'Anthropic (Claude)',
        baseURL: 'https://api.anthropic.com/v1/messages',
        defaultModel: 'claude-sonnet-4-20250514',
        models: ['claude-sonnet-4-20250514', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'],
        authStyle: 'anthropic',
    },
    {
        id: 'gemini',
        name: 'Google Gemini',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/models',
        defaultModel: 'gemini-2.5-flash',
        models: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'],
        authStyle: 'gemini',
        urlContainsModel: true,
    },
    {
        id: 'deepseek',
        name: 'DeepSeek',
        baseURL: 'https://api.deepseek.com/v1/chat/completions',
        defaultModel: 'deepseek-chat',
        models: ['deepseek-chat', 'deepseek-reasoner'],
        authStyle: 'bearer',
    },
    {
        id: 'siliconflow',
        name: '硅基流动 (SiliconFlow)',
        baseURL: 'https://api.siliconflow.cn/v1/chat/completions',
        defaultModel: 'deepseek-ai/DeepSeek-V3',
        models: ['deepseek-ai/DeepSeek-V3', 'Qwen/Qwen2.5-72B-Instruct', 'THUDM/glm-4-9b-chat'],
        authStyle: 'bearer',
    },
    {
        id: 'volcengine',
        name: '火山引擎 (Volcengine)',
        baseURL: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
        defaultModel: 'doubao-1.5-pro-32k-250115',
        models: ['doubao-1.5-pro-32k-250115', 'doubao-1.5-lite-32k-250115'],
        authStyle: 'bearer',
    },
];

// =========================================================================
// 🗄️ 配置持久化 (localStorage)
// =========================================================================

const STORAGE_KEY = 'tarot_llm_config';

export interface LLMConfig {
    providerId: string;
    apiKey: string;
    baseURL: string;
    model: string;
}

/** 从 localStorage 加载配置 */
export function loadConfig(): LLMConfig {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch { /* 忽略格式错误 */ }

    // 默认配置：OpenAI，未填写 Key
    const defaultProvider = LLM_PROVIDERS[0];
    return {
        providerId: defaultProvider.id,
        apiKey: '',
        baseURL: defaultProvider.baseURL,
        model: defaultProvider.defaultModel,
    };
}

/** 保存配置到 localStorage */
export function saveConfig(config: LLMConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

/** 根据 providerId 获取供应商预设 */
export function getProvider(id: string): LLMProvider {
    return LLM_PROVIDERS.find(p => p.id === id) || LLM_PROVIDERS[0];
}

// =========================================================================
// 🌌 核心请求函数
// =========================================================================

const SYSTEM_PROMPT = `你是一位神秘、极具洞察力的星际塔罗牌高阶解盘大师，擅长通过荣格心理学与元素变化为求问者答疑解惑。
你必须以占卜师的口吻，全程使用第二人称“你”来称呼求问者，进行沉浸式、对话式的解盘。
直接输出最终的占卜内容，绝不呈现任何计算、推理步骤或“思考过程”。
返回格式必须是优美的 Markdown 文本。使用简体中文回复。`;

export async function getTarotReading(question: string, spread: Spread, cards: DrawnCard[]): Promise<string> {
    const prompt = generateLLMPrompt(question, spread, cards);
    console.log("=== 生成的大模型占卜提示词 ===\n", prompt, "\n=============================");

    const config = loadConfig();

    // 如没有配置 API Key，则降级为占位回复
    if (!config.apiKey) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`
# ✨ 命运之轴的转动已为您开启

> *当前处于「静默观测」模式 — 请前往右上角 ⚙ 设置面板配置您的 API Key*

待您注入原力（API Key），这里的文字将被真正的高维塔罗意识取代。

## 🌌 星辰密语 (整体印象)
牌面展现出的能量深邃而充满变动。\n\n您抽到的 **${cards[0].nameZh}** ${cards[0].isReversed ? '（逆位）' : '（正位）'} 暗示你需要更多的向内探寻。

## 🗝️ 迷雾指南 (综合建议)
在当下的十字路口，接纳不确定性。
          `.trim());
            }, 1500);
        });
    }

    const provider = getProvider(config.providerId);

    try {
        // 根据供应商类型构建不同的请求
        if (provider.authStyle === 'anthropic') {
            return await callAnthropic(config, prompt);
        } else if (provider.authStyle === 'gemini') {
            return await callGemini(config, prompt);
        } else {
            return await callOpenAICompatible(config, prompt);
        }
    } catch (error) {
        console.error("占卜解盘请求失败:", error);
        throw new Error("占星塔的信使遇到了迷雾。请检查 API 配置或网络连接。");
    }
}

/** 清理大模型返回的内容，移除可能存在的“思考过程”或内部标签 */
function cleanResponse(content: string): string {
    if (!content) return "";
    // 移除 <thought>...</thought> 和 <think>...</think> (常用于 DeepSeek R1/Distill 系列)
    let cleaned = content
        .replace(/<thought>[\s\S]*?<\/thought>/gi, "")
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/^\s*思考过程：[\s\S]*?\n\n/gi, "")
        .replace(/^\s*Thought:[\s\S]*?\n\n/gi, "");

    // 终极防御截断：很多推理模型（特别是满血版的 DeepSeek-R1）如果不带 <think> 标签，会把大段思考过程直接打印在最前面。
    // 我们强制寻找标准占卜标题的起始点，并将其之前的所有呓语全部抹除。
    const magicStartIndex = cleaned.search(/(?:#+|\*\*|【)\s*星辰密语/);
    if (magicStartIndex > 0) {
        cleaned = cleaned.substring(magicStartIndex);
    }

    return cleaned.trim();
}

// ---- OpenAI 兼容格式（OpenAI / DeepSeek / 硅基流动 / 火山引擎） ----
async function callOpenAICompatible(config: LLMConfig, prompt: string): Promise<string> {
    const response = await fetch(config.baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 2000,
        }),
    });
    if (!response.ok) throw new Error(`API 错误: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return cleanResponse(data.choices[0].message.content);
}

// ---- Anthropic Claude 格式 ----
async function callAnthropic(config: LLMConfig, prompt: string): Promise<string> {
    const response = await fetch(config.baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': config.apiKey,
            'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
            model: config.model,
            max_tokens: 2000,
            system: SYSTEM_PROMPT,
            messages: [
                { role: 'user', content: prompt },
            ],
        }),
    });
    if (!response.ok) throw new Error(`API 错误: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return cleanResponse(data.content[0].text);
}

// ---- Google Gemini 格式 ----
async function callGemini(config: LLMConfig, prompt: string): Promise<string> {
    const url = `${config.baseURL}/${config.model}:generateContent?key=${config.apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [
                { role: 'user', parts: [{ text: prompt }] },
            ],
            generationConfig: { temperature: 0.7, maxOutputTokens: 2000 },
        }),
    });
    if (!response.ok) throw new Error(`API 错误: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return cleanResponse(data.candidates[0].content.parts[0].text);
}
