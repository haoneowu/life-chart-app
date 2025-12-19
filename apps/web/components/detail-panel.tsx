'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, TrendingUp, TrendingDown, Minus, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { ShareCard } from './share-card';
import { useShare } from '@/hooks/use-share';

interface DetailPanelProps {
    data: any | null;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    onBackToAnchor?: () => void;
    onGoToToday?: () => void;
    isEmbedded?: boolean;
    userName?: string;
    sunSign?: string;
    pillar?: string;
    panelData?: any;
    loading?: boolean;
}

export function DetailPanel({
    data,
    onClose,
    onNext,
    onPrev,
    onBackToAnchor,
    onGoToToday,
    isEmbedded = false,
    userName = 'Traveler',
    sunSign = 'Cosmic',
    pillar = 'Overall',
    panelData,
    loading = false
}: DetailPanelProps) {
    const { shareImage } = useShare();
    const score = data?.score ?? data?.close ?? data?.value;
    if (!data || typeof score !== 'number') return null;

    const open = data.open ?? score;
    const isBullish = score >= open;

    const getDate = (time: any) => {
        const t = time || data.date;
        if (typeof t === 'string') return new Date(t);
        if (t?.year) return new Date(t.year, t.month - 1, t.day);
        return new Date();
    };

    const dateObj = getDate(data.time || data.date);

    const handleShare = () => {
        shareImage('share-card-content', `life-chart-${data.date}.png`);
    };

    const content = (
        <div className={`flex flex-col gap-8 ${isEmbedded ? 'h-full' : ''}`}>
            {/* Hidden Share Card for capture */}
            <div className="fixed -left-[2000px] top-0 opacity-0 pointer-events-none">
                <ShareCard
                    name={userName}
                    date={dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    score={Math.round(score)}
                    sunSign={sunSign}
                    pillar={pillar}
                />
            </div>
            {/* Header Actions - Sticky */}
            <div className="sticky top-0 z-50 flex items-center justify-between pb-6 pt-0 bg-transparent backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrev}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="Previous"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                        onClick={onNext}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        title="Next"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>

                    {(onBackToAnchor || onGoToToday) && (
                        <div className="ml-4 flex items-center gap-2 border-l border-white/10 pl-4">
                            {onBackToAnchor && (
                                <button
                                    onClick={onBackToAnchor}
                                    className="px-3 py-1 rounded-lg bg-teal-500/20 border border-teal-500/30 text-[10px] font-mono text-teal-400 hover:text-white hover:bg-teal-500/40 transition-all uppercase tracking-widest flex items-center gap-1"
                                >
                                    <Activity className="w-3 h-3" />
                                    Back to {pillar === 'Overall' ? 'Month' : pillar}
                                </button>
                            )}
                            {onGoToToday && (
                                <button
                                    onClick={onGoToToday}
                                    className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
                                >
                                    Today
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {!isEmbedded && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-400 hover:text-white" />
                    </button>
                )}
            </div>

            <div className="flex flex-col gap-10">
                {/* 1. Date & Level Header */}
                <div className="space-y-4">
                    <div className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                        {dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric' })}
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-serif font-bold text-white leading-tight">
                        {dateObj.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
                    </h2>
                    <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-6">
                        <span className={`text-2xl font-mono font-bold ${isBullish ? 'text-[#52C8BC]' : 'text-[#D84548]'}`}>
                            {score.toFixed(0)}
                        </span>
                        <div className="h-4 w-[1px] bg-white/10" />
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                            Signal
                        </span>
                    </div>
                </div>

                {/* 2. WHY - The Influence */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">
                        <Activity className="h-3 w-3" />
                        <span>Vector Origin</span>
                    </div>
                    {loading ? (
                        <div className="h-20 w-full bg-white/5 animate-pulse rounded-xl" />
                    ) : (
                        <div className="space-y-6">
                            <p className="text-xl lg:text-2xl font-light text-gray-200 leading-snug">
                                {panelData?.panel?.overview?.summary || (isBullish
                                    ? "A high-alignment window between your natal Mercury and the current solar transit is creating a period of expanded insight."
                                    : "Prevailing planetary resistance suggests a withdrawal. Your natal signature is in a phase of recalibration.")
                                }
                            </p>

                            {panelData?.panel?.why?.length > 0 && (
                                <div className="space-y-4 mt-6 bg-white/5 rounded-2xl p-4 border border-white/10">
                                    {panelData.panel.why.map((w: any, idx: number) => (
                                        <div key={idx} className="space-y-1">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-mono text-teal-400 uppercase tracking-widest">{w.driver}</span>
                                                <span className="text-[10px] font-mono text-gray-500">Conf: {Math.round(w.confidence * 100)}%</span>
                                            </div>
                                            <p className="text-sm text-gray-300">{w.impact}</p>
                                            <div className="text-[9px] text-gray-600 font-mono italic">{w.evidence}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 3. WHAT - Themes */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="text-[10px] font-mono text-purple-400 uppercase tracking-[0.2em]">Pillar Focus</div>
                        <div className="flex flex-wrap gap-2">
                            {loading ? (
                                <div className="flex gap-2">
                                    <div className="h-8 w-20 bg-white/5 animate-pulse rounded-lg" />
                                    <div className="h-8 w-24 bg-white/5 animate-pulse rounded-lg" />
                                </div>
                            ) : (
                                (panelData?.panel?.what?.themes || (isBullish ? ['Momentum Alpha', 'Signal Growth', 'Expansion'] : ['Consolidation', 'Signal Noise', 'Depth'])).map((k: string) => (
                                    <span key={k} className="px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-[11px] text-teal-400 font-mono tracking-tighter uppercase font-bold">
                                        {k}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    {panelData?.panel?.what?.keywords && (
                        <div className="space-y-2">
                            <div className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">Active Harmonics</div>
                            <div className="flex flex-wrap gap-3">
                                {panelData.panel.what.keywords.map((kw: string, idx: number) => (
                                    <span key={idx} className="text-sm font-light text-gray-400 italic">#{kw}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 4. HOW - Execution */}
                <div className="space-y-8 pt-6 border-t border-white/10">
                    <div className="text-[10px] font-mono text-teal-400 uppercase tracking-[0.2em]">Execution</div>

                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />
                            <div className="h-16 w-full bg-white/5 animate-pulse rounded-xl" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            <div className="space-y-6">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#52C8BC] shadow-[0_0_8px_#52C8BC]" />
                                    STRATEGIC ACTIONS
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {panelData?.panel?.how?.do?.map((act: any, idx: number) => (
                                        <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">{act.domain}</div>
                                            <p className="text-sm text-gray-300 leading-relaxed font-light">
                                                {act.text}
                                            </p>
                                        </div>
                                    )) || (
                                            <p className="text-base text-gray-300 font-light leading-relaxed">
                                                {isBullish
                                                    ? "Capitalize on this window to finalize complex negotiations. Your personal influence is at a local peak."
                                                    : "Engage in data-driven introspection. Review past performance and tighten lifestyle controls."}
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#D84548] shadow-[0_0_8px_#D84548]" />
                                    RISK VECTORS
                                </h4>
                                <div className="space-y-2 opacity-60">
                                    {panelData?.panel?.how?.avoid?.map((act: any, idx: number) => (
                                        <p key={idx} className="text-sm text-gray-300 font-light leading-relaxed">
                                            {act.text}
                                        </p>
                                    )) || (
                                            <p className="text-base text-gray-300 font-light leading-relaxed">
                                                {isBullish
                                                    ? "Counter-party risk is elevated. Do not let the high momentum mask the subtle details."
                                                    : "Beware of signal noise. Do not mistake a temporary dip for a permanent trend reversal."}
                                            </p>
                                        )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {!isEmbedded && (
                    <div className="pt-8 pb-12">
                        <button
                            onClick={handleShare}
                            className="w-full py-5 rounded-2xl bg-white text-black text-xl font-bold hover:scale-[1.02] transition-transform active:scale-[0.98] shadow-2xl"
                        >
                            Share Insight
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    if (isEmbedded) {
        return (
            <div className="w-full h-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-y-auto custom-scrollbar font-sans border-t-4 border-t-[#52C8BC]/30">
                {content}
            </div>
        );
    }

    return (
        <AnimatePresence>
            {data && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-full w-full md:w-[450px] z-[110] bg-black/95 backdrop-blur-3xl border-l border-white/10 p-6 md:p-8 shadow-2xl overflow-y-auto custom-scrollbar font-sans hidden md:block"
                >
                    {content}
                </motion.div>
            )}

            {/* Mobile Drawer */}
            {data && (
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                    className="fixed inset-x-0 bottom-0 top-[100px] z-[110] bg-black/95 backdrop-blur-3xl border-t border-white/10 p-6 shadow-2xl overflow-y-auto custom-scrollbar font-sans rounded-t-[32px] md:hidden"
                >
                    <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
                    {content}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
