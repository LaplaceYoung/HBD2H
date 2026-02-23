import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageSquare, Calendar, Mail, Globe } from 'lucide-react';

export const ContactSlide: React.FC = () => {
    const contacts = [
        { icon: <Instagram size={20} />, text: "@Huang0401" },
        { icon: <MessageSquare size={20} />, text: "HBD" },
        { icon: <Calendar size={20} />, text: "20Years" },
        { icon: <Mail size={20} />, text: "HAPPLY" },
        { icon: <Globe size={20} />, text: "2026.04.01" }
    ];

    return (
        <div className="w-full h-full flex flex-col md:flex-row items-center justify-center md:gap-[15%]">

            {/* Header Section */}
            <motion.div
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="flex mb-16 md:mb-0 flex-col items-center md:items-start text-center md:text-left"
            >
                <h2 className="text-[clamp(40px,7vw,80px)] font-serif leading-[1.1] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-mystic-gold)] to-white">
                    开启你的<br />
                    觉醒之旅
                </h2>
                <p className="text-white/60 tracking-wider text-[clamp(14px,1.5vw,20px)] max-w-sm leading-relaxed">
                    在浩瀚的数据与古老的星象之间，找回属于你个人的真理与宁静。
                </p>
            </motion.div>

            {/* Directory Section */}
            <motion.div
                initial={{ x: 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="glass-card p-10 min-w-[320px] max-w-[450px]"
            >
                <div className="text-sm tracking-[0.3em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">
                    Connect
                </div>
                <ul className="flex flex-col gap-6">
                    {contacts.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-center gap-4 group cursor-pointer"
                        >
                            <span className="text-white/40 group-hover:text-[var(--color-mystic-gold)] transition-colors">
                                {item.icon}
                            </span>
                            <span className="text-white/80 group-hover:text-white transition-colors tracking-wide text-sm md:text-base font-light">
                                {item.text}
                            </span>
                        </motion.li>
                    ))}
                </ul>
            </motion.div>
        </div>
    );
};
