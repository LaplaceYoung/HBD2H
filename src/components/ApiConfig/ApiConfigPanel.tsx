import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { LLM_PROVIDERS, loadConfig, saveConfig, getProvider } from '../../api/llmApi';
import type { LLMConfig, LLMProvider } from '../../api/llmApi';

interface ApiConfigPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ApiConfigPanel — 多模型 API 配置面板。
 * 支持 OpenAI / Anthropic / Gemini / DeepSeek / 硅基流动 / 火山引擎。
 * UI 与网站神秘学主题完全适配：暗色玻璃拟态 + 金色高亮。
 */
export const ApiConfigPanel: React.FC<ApiConfigPanelProps> = ({ isOpen, onClose }) => {
    const [config, setConfig] = useState<LLMConfig>(loadConfig);
    const [showProviderDropdown, setShowProviderDropdown] = useState(false);
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [saved, setSaved] = useState(false);
    const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
    const [testMessage, setTestMessage] = useState('');
    const providerRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<HTMLDivElement>(null);

    const currentProvider = getProvider(config.providerId);

    // 点击外部关闭下拉菜单
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (providerRef.current && !providerRef.current.contains(e.target as Node)) {
                setShowProviderDropdown(false);
            }
            if (modelRef.current && !modelRef.current.contains(e.target as Node)) {
                setShowModelDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // 切换供应商时同步 baseURL 和 model
    const switchProvider = (provider: LLMProvider) => {
        setConfig({
            ...config,
            providerId: provider.id,
            baseURL: provider.baseURL,
            model: provider.defaultModel,
        });
        setShowProviderDropdown(false);
        setSaved(false);
    };

    const selectModel = (model: string) => {
        setConfig({ ...config, model });
        setShowModelDropdown(false);
        setSaved(false);
    };

    const handleSave = () => {
        saveConfig(config);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleTest = async () => {
        saveConfig(config);
        setTestStatus('testing');
        setTestMessage('');

        try {
            // 发送一个极简请求来测试连接
            const provider = getProvider(config.providerId);
            let response: Response;

            if (provider.authStyle === 'gemini') {
                const url = `${config.baseURL}/${config.model}:generateContent?key=${config.apiKey}`;
                response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ role: 'user', parts: [{ text: '你好' }] }],
                        generationConfig: { maxOutputTokens: 20 },
                    }),
                });
            } else if (provider.authStyle === 'anthropic') {
                response = await fetch(config.baseURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': config.apiKey,
                        'anthropic-version': '2023-06-01',
                    },
                    body: JSON.stringify({
                        model: config.model,
                        max_tokens: 20,
                        messages: [{ role: 'user', content: '你好' }],
                    }),
                });
            } else {
                response = await fetch(config.baseURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${config.apiKey}`,
                    },
                    body: JSON.stringify({
                        model: config.model,
                        messages: [{ role: 'user', content: '你好' }],
                        max_tokens: 20,
                    }),
                });
            }

            if (response.ok) {
                setTestStatus('success');
                setTestMessage('连接成功！星辰通道畅通无阻 ✨');
            } else {
                const errData = await response.text();
                setTestStatus('error');
                setTestMessage(`连接失败 (${response.status}): ${errData.slice(0, 100)}`);
            }
        } catch (err: any) {
            setTestStatus('error');
            setTestMessage(`网络错误: ${err.message || '无法连接到服务器'}`);
        }
    };

    // 阻止面板内的滚轮冒泡
    const stopWheel = (e: React.WheelEvent) => e.stopPropagation();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* 遮罩层 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* 面板本体 */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                        onWheel={stopWheel}
                        className="
                            fixed right-0 top-0 bottom-0 z-[101]
                            w-[420px] max-w-[90vw]
                            bg-gradient-to-b from-[#0d0d12] to-[#08080c]
                            border-l border-white/[0.06]
                            flex flex-col
                            overflow-y-auto
                        "
                    >
                        {/* 标题栏 */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0 border-b border-white/[0.06]">
                            <div>
                                <h2 className="text-lg font-serif tracking-wider text-white/90">神谕通道配置</h2>
                                <p className="text-[11px] text-white/30 tracking-wider mt-1">LLM API Configuration</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/30 hover:text-white/70 transition-colors duration-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* 表单区 */}
                        <div className="flex-1 px-6 py-6 flex flex-col gap-5">

                            {/* ---- 供应商选择 ---- */}
                            <div>
                                <label className="text-[12px] text-white/40 tracking-wider uppercase mb-2 block">
                                    模型供应商
                                </label>
                                <div ref={providerRef} className="relative">
                                    <button
                                        onClick={() => { setShowProviderDropdown(!showProviderDropdown); setShowModelDropdown(false); }}
                                        className="
                                            w-full flex items-center justify-between
                                            px-4 py-3 text-sm text-white/80
                                            bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15]
                                            transition-all duration-300
                                        "
                                    >
                                        <span>{currentProvider.name}</span>
                                        <ChevronDown size={16} className={`text-white/30 transition-transform duration-200 ${showProviderDropdown ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showProviderDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                transition={{ duration: 0.15 }}
                                                className="
                                                    absolute top-full left-0 right-0 mt-1 z-20
                                                    bg-[#111118] border border-white/[0.08]
                                                    max-h-[240px] overflow-y-auto
                                                "
                                            >
                                                {LLM_PROVIDERS.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        onClick={() => switchProvider(p)}
                                                        className={`
                                                            w-full text-left px-4 py-3 text-sm transition-all duration-200
                                                            flex items-center justify-between
                                                            ${p.id === config.providerId
                                                                ? 'text-[var(--color-mystic-gold)] bg-[var(--color-mystic-gold)]/[0.05]'
                                                                : 'text-white/60 hover:text-white/90 hover:bg-white/[0.03]'
                                                            }
                                                        `}
                                                    >
                                                        <span>{p.name}</span>
                                                        {p.id === config.providerId && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* ---- API Key ---- */}
                            <div>
                                <label className="text-[12px] text-white/40 tracking-wider uppercase mb-2 block">
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={config.apiKey}
                                    onChange={(e) => { setConfig({ ...config, apiKey: e.target.value }); setSaved(false); }}
                                    placeholder={`输入您的 ${currentProvider.name} API Key`}
                                    className="
                                        w-full px-4 py-3 text-sm text-white/80
                                        bg-white/[0.03] border border-white/[0.08]
                                        hover:border-white/[0.15] focus:border-[var(--color-mystic-gold)]/40
                                        focus:outline-none
                                        transition-all duration-300
                                        placeholder:text-white/20
                                        font-mono tracking-wide
                                    "
                                />
                            </div>

                            {/* ---- Base URL ---- */}
                            <div>
                                <label className="text-[12px] text-white/40 tracking-wider uppercase mb-2 block">
                                    API Endpoint (Base URL)
                                </label>
                                <input
                                    type="text"
                                    value={config.baseURL}
                                    onChange={(e) => { setConfig({ ...config, baseURL: e.target.value }); setSaved(false); }}
                                    placeholder="https://api.openai.com/v1/chat/completions"
                                    className="
                                        w-full px-4 py-3 text-[13px] text-white/60
                                        bg-white/[0.03] border border-white/[0.08]
                                        hover:border-white/[0.15] focus:border-[var(--color-mystic-gold)]/40
                                        focus:outline-none
                                        transition-all duration-300
                                        placeholder:text-white/15
                                        font-mono
                                    "
                                />
                                <p className="text-[10px] text-white/20 mt-1 tracking-wider">
                                    切换供应商后自动填充，也可手动填写代理地址
                                </p>
                            </div>

                            {/* ---- 模型（可编辑下拉） ---- */}
                            <div>
                                <label className="text-[12px] text-white/40 tracking-wider uppercase mb-2 block">
                                    模型名称
                                </label>
                                <div ref={modelRef} className="relative">
                                    {/* 合一控件：左侧可编辑输入 + 右侧下拉展开 */}
                                    <div className="
                                        w-full flex items-center
                                        bg-white/[0.03] border border-white/[0.08]
                                        hover:border-white/[0.15] focus-within:border-[var(--color-mystic-gold)]/40
                                        transition-all duration-300
                                    ">
                                        <input
                                            type="text"
                                            value={config.model}
                                            onChange={(e) => { setConfig({ ...config, model: e.target.value }); setSaved(false); }}
                                            onFocus={() => setShowProviderDropdown(false)}
                                            placeholder="输入或选择模型名称"
                                            className="
                                                flex-1 px-4 py-3 text-sm text-white/80
                                                bg-transparent focus:outline-none
                                                placeholder:text-white/20
                                                font-mono tracking-wide
                                            "
                                        />
                                        <button
                                            onClick={() => { setShowModelDropdown(!showModelDropdown); setShowProviderDropdown(false); }}
                                            className="px-3 py-3 text-white/30 hover:text-white/60 transition-colors shrink-0"
                                        >
                                            <ChevronDown size={16} className={`transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {showModelDropdown && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -4 }}
                                                transition={{ duration: 0.15 }}
                                                className="
                                                    absolute top-full left-0 right-0 mt-1 z-20
                                                    bg-[#111118] border border-white/[0.08]
                                                    max-h-[200px] overflow-y-auto
                                                "
                                            >
                                                {currentProvider.models.map((m) => (
                                                    <button
                                                        key={m}
                                                        onClick={() => selectModel(m)}
                                                        className={`
                                                            w-full text-left px-4 py-3 text-sm font-mono transition-all duration-200
                                                            flex items-center justify-between
                                                            ${m === config.model
                                                                ? 'text-[var(--color-mystic-gold)] bg-[var(--color-mystic-gold)]/[0.05]'
                                                                : 'text-white/60 hover:text-white/90 hover:bg-white/[0.03]'
                                                            }
                                                        `}
                                                    >
                                                        <span>{m}</span>
                                                        {m === config.model && <Check size={14} />}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-[10px] text-white/20 mt-1.5 tracking-wider">
                                    可直接输入任意模型名称，或点击 ▾ 从预设列表中选择
                                </p>
                            </div>

                            {/* ---- 测试结果提示 ---- */}
                            <AnimatePresence>
                                {testStatus !== 'idle' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`
                                            px-4 py-3 text-[12px] tracking-wider border
                                            ${testStatus === 'success'
                                                ? 'text-green-400/80 border-green-400/20 bg-green-400/[0.03]'
                                                : testStatus === 'error'
                                                    ? 'text-red-400/80 border-red-400/20 bg-red-400/[0.03]'
                                                    : 'text-white/50 border-white/[0.06] bg-white/[0.02]'
                                            }
                                        `}
                                    >
                                        {testStatus === 'testing' ? (
                                            <span className="flex items-center gap-2">
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>⟳</motion.span>
                                                正在探测星辰通道...
                                            </span>
                                        ) : testStatus === 'success' ? (
                                            <span className="flex items-center gap-2"><Check size={14} />{testMessage}</span>
                                        ) : (
                                            <span className="flex items-start gap-2"><AlertCircle size={14} className="shrink-0 mt-0.5" />{testMessage}</span>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 底部操作栏 */}
                        <div className="px-6 py-5 border-t border-white/[0.06] shrink-0 flex gap-3">
                            <button
                                onClick={handleTest}
                                disabled={!config.apiKey}
                                className="
                                    flex-1 py-3 text-[13px] tracking-wider
                                    border border-white/[0.1] text-white/50
                                    hover:border-white/[0.2] hover:text-white/70
                                    disabled:opacity-30 disabled:cursor-not-allowed
                                    transition-all duration-300
                                "
                            >
                                测试连接
                            </button>
                            <button
                                onClick={handleSave}
                                className="
                                    flex-1 py-3 text-[13px] tracking-wider font-serif
                                    border border-[var(--color-mystic-gold)]/30
                                    text-[var(--color-mystic-gold)]
                                    bg-[var(--color-mystic-gold)]/[0.04]
                                    hover:bg-[var(--color-mystic-gold)]/[0.08]
                                    hover:border-[var(--color-mystic-gold)]/50
                                    transition-all duration-300
                                "
                            >
                                {saved ? '✓ 已保存' : '保存配置'}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
