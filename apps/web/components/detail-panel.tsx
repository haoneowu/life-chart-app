'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

interface DetailPanelProps {
    data: any | null; // MVP: any, refine with proper types later
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export function DetailPanel({ data, onClose, onNext, onPrev }: DetailPanelProps) {
    if (!data || typeof data.close !== 'number') return null;

    const isBullish = (data.close || 0) > (data.open || 0);
    const momentumLabel = isBullish ? 'Increasing Momentum' : 'Decreasing Momentum';

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
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full md:w-[450px] z-50 bg-black/95 backdrop-blur-3xl border-l border-white/10 p-8 shadow-2xl overflow-y-auto custom-scrollbar font-sans"
            >
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onPrev}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            title="Previous Day"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={onNext}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                            title="Next Day"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-400 hover:text-white" />
                    </button>
                </div>

                <div className="flex flex-col gap-10">
                    {/* 1. Date & Level Header */}
                    <div className="space-y-4">
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                            {dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                        </div>
                        <h2 className="text-5xl font-serif font-bold text-white leading-tight">
                            {dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                        </h2>
                        <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-6">
                            <span className={`text-2xl font-mono font-bold ${isBullish ? 'text-green-500' : 'text-red-500'}`}>
                                {(data.close || 0).toFixed(0)}
                            </span>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <span className="text-sm font-light text-gray-300">
                                {momentumLabel}
                            </span>
                        </div>
                    </div>

                    {/* 2. WHY - The Influence */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-mono text-blue-400 uppercase tracking-widest">
                            <Activity className="h-3 w-3" />
                            <span>Why</span>
                        </div>
                        <p className="text-2xl font-light text-gray-200 leading-snug">
                            {isBullish
                                ? "A rare alignment of Sun and Jupiter creates an expansionary window. Your natal Mercury is positively aspected."
                                : "Saturn's heavy influence suggests a period of necessary restriction. Your natal Moon is in a period of shadow."}
                        </p>
                    </div>

                    {/* 3. WHAT - Today's Themes */}
                    <div className="space-y-4">
                        <div className="text-xs font-mono text-purple-400 uppercase tracking-widest">What</div>
                        <div className="flex flex-wrap gap-2">
                            {(isBullish ? ['Growth', 'High Output', 'Expansion', 'Fortune'] : ['Reflection', 'Consolidation', 'Patience', 'Depth']).map(k => (
                                <span key={k} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-base text-gray-300 font-light hover:bg-white/10 transition-colors">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 4. WHEN - Temporal Windows */}
                    <div className="space-y-4">
                        <div className="text-xs font-mono text-orange-400 uppercase tracking-widest">When</div>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-gray-400">08:00 - 12:00</span>
                                <span className="text-green-400 font-medium">Action Window</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 opacity-50">
                                <span className="text-gray-400">14:00 - 18:00</span>
                                <span className="text-gray-300 font-medium">Rest & Recovery</span>
                            </div>
                        </div>
                    </div>

                    {/* 5. HOW - Behavior Advice */}
                    <div className="space-y-6 pt-6 border-t border-white/10">
                        <div className="text-xs font-mono text-teal-400 uppercase tracking-widest">How</div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Advised (Do)
                                </h4>
                                <p className="text-lg text-gray-300 font-light leading-relaxed">
                                    {isBullish
                                        ? "Finalize ongoing negotiations. The stars favor bold asks in professional settings. Manifest your intent through physical action."
                                        : "Review financial statements. Re-read old journals. Dedicate time to deep breathing and solitude."}
                                </p>
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Avoid
                                </h4>
                                <p className="text-lg text-gray-300 font-light leading-relaxed opacity-80">
                                    {isBullish
                                        ? "Do not rush the final details. Avoid impulsive spending, as momentum can lead to overshooting."
                                        : "Avoid starting new ventures. Postpone difficult conversations with partners. Refrain from heavy expenditure."}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 pb-12">
                        <button className="w-full py-5 rounded-2xl bg-white text-black text-xl font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-2xl">
                            Share My Chart
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
