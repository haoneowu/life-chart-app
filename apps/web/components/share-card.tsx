'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, TrendingUp, Star } from 'lucide-react';

interface ShareCardProps {
    name: string;
    date: string;
    score: number;
    sunSign: string;
    pillar: string;
}

export function ShareCard({ name, date, score, sunSign, pillar }: ShareCardProps) {
    return (
        <div
            id="share-card-content"
            className="w-[500px] h-[700px] bg-[#050505] p-12 flex flex-col justify-between relative overflow-hidden text-white"
        >
            {/* Background Accents (Static for export) */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-white/5">
                        <Star className="text-teal-400 w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif font-bold tracking-tight">{name}</h3>
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em]">{sunSign} • {pillar}</p>
                    </div>
                </div>

                <div className="h-[1px] w-full bg-gradient-to-r from-white/20 via-white/5 to-transparent" />
            </div>

            <div className="space-y-12 relative z-10">
                <div className="space-y-2">
                    <p className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">{date}</p>
                    <h2 className="text-6xl font-serif font-bold leading-tight">Life <br />Momentum</h2>
                </div>

                <div className="flex items-baseline gap-6">
                    <span className="text-9xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                        {score}
                    </span>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-teal-400">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-sm font-mono font-bold uppercase">Strong Signal</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Score Alignment</span>
                    </div>
                </div>
            </div>

            <div className="pt-12 relative z-10">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
                    <p className="text-lg font-light leading-relaxed text-gray-300 italic">
                        &quot;Your natal signature is in high alignment with the prevailing market forces of destiny.&quot;
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between pt-12 relative z-10">
                <div className="flex items-center gap-2">
                    <Globe className="text-gray-500 w-5 h-5" />
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-[0.2em]">life-chart.app</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20" />
            </div>
        </div>
    );
}
