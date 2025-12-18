'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface DetailPanelProps {
    data: any | null; // MVP: any, refine with proper types later
    onClose: () => void;
}

export function DetailPanel({ data, onClose }: DetailPanelProps) {
    if (!data || typeof data.close !== 'number') return null;

    const isBullish = (data.close || 0) > (data.open || 0);
    const change = Math.abs((data.close || 0) - (data.open || 0)).toFixed(1);
    const colorBefore = isBullish ? 'text-green-500' : 'text-red-500';
    const momentumLabel = isBullish ? 'Increasing Momentum' : 'Decreasing Momentum';

    // Fake Interpretation for MVP
    const keywords = isBullish
        ? ['Growth', 'Expansion', 'Action']
        : ['Reflection', 'Consolidation', 'Patience'];

    // Helper to parse date
    const getDate = (time: any) => {
        if (typeof time === 'string') return new Date(time);
        if (time?.year) return new Date(time.year, time.month - 1, time.day);
        return new Date();
    };

    const dateObj = getDate(data.time);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }} // "Cinematic" spring
                className="fixed right-0 top-0 h-full w-full md:w-[400px] z-50 bg-black/95 backdrop-blur-3xl border-l border-white/10 p-8 shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="h-6 w-6 text-gray-400" />
                </button>

                <div className="mt-12 flex flex-col h-[calc(100vh-100px)]">

                    {/* 1. Header (Sticky-ish visuals) */}
                    <div className="flex-none mb-8">
                        <div className="flex items-center space-x-2 mb-2">
                            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                                {dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                            </span>
                        </div>
                        <h2 className="text-4xl font-serif font-bold text-white mb-4">
                            {dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </h2>

                        {/* Key Metric Pilled */}
                        <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-6 backdrop-blur-md">
                            <div className="flex items-baseline gap-2">
                                <span className={`text-2xl font-mono font-bold ${colorBefore}`}>
                                    {(data.close || 0).toFixed(0)}
                                </span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-sm font-serif italic text-gray-300">
                                {momentumLabel}
                            </span>
                        </div>
                    </div>

                    {/* 2. Body (Scrollable) */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                        {/* Headline */}
                        <div className="space-y-4">
                            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">Daily Insight</div>
                            <p className="text-2xl font-serif leading-snug text-gray-200">
                                "{isBullish ? "Seize the initiative." : "Conserve your energy."} The stars align for {isBullish ? "action" : "reflection"}."
                            </p>
                        </div>

                        {/* Focus Tags */}
                        <div className="flex flex-wrap gap-2">
                            {keywords.map(k => (
                                <span key={k} className="px-3 py-1 rounded-full border border-white/20 text-sm text-gray-300 font-mono hover:bg-white/10 transition-colors cursor-default">
                                    #{k}
                                </span>
                            ))}
                        </div>

                        {/* Advice Section */}
                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <h3 className="text-sm font-serif font-bold text-white">Advice</h3>
                            <ul className="space-y-3">
                                <li className="flex gap-3 text-sm text-gray-300">
                                    <span className="text-green-400">Do</span>
                                    <span>Initiate complex tasks before noon.</span>
                                </li>
                                <li className="flex gap-3 text-sm text-gray-300">
                                    <span className="text-red-400">Avoid</span>
                                    <span>Signing contracts without reading fine print.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* 3. Footer (Share - Sticky bottom) */}
                    <div className="flex-none pt-6 border-t border-white/10 mt-4">
                        <button className="w-full py-4 rounded-xl bg-white text-black font-serif font-bold hover:scale-[1.02] transition-transform shadow-xl">
                            Share This Moment
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
