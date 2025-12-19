'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, User, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeChart, MomentumData } from '@/components/life-chart';

interface HistoryEntry {
    id: string;
    name: string;
    birth_date: string;
    birth_time: string;
    city: string;
    lat: number;
    lon: number;
    gender: string;
    zodiac?: string;
    age?: number;
    today_score?: number;
    sparkline_data?: MomentumData[];
}

export default function HistoryPage() {
    const [search, setSearch] = useState('');
    const [entries, setEntries] = useState<HistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            fetchHistory(session?.user?.id || 'demo_user');
        });
    }, []);

    const fetchHistory = async (userId: string) => {
        setLoading(true);
        try {
            // For now, if no 'profiles' table exists, we mock some data
            // In a real app, we'd fetch from Supabase
            const mockEntries: HistoryEntry[] = [
                {
                    id: '1',
                    name: 'Hao Wu',
                    birth_date: '1995-10-24',
                    birth_time: '12:00',
                    city: 'Beijing, China',
                    lat: 39.9042,
                    lon: 116.4074,
                    gender: 'male',
                    zodiac: 'Scorpio',
                    age: 29,
                    today_score: 82,
                    sparkline_data: Array.from({ length: 30 }, (_, i) => ({
                        date: `2024-01-${i + 1}`,
                        score: 40 + Math.random() * 40,
                        volatility: 'calm'
                    }))
                },
                {
                    id: '2',
                    name: 'Sarah Chen',
                    birth_date: '1998-05-12',
                    birth_time: '08:00',
                    city: 'Shanghai, China',
                    lat: 31.2304,
                    lon: 121.4737,
                    gender: 'female',
                    zodiac: 'Taurus',
                    age: 26,
                    today_score: 45,
                    sparkline_data: Array.from({ length: 30 }, (_, i) => ({
                        date: `2024-01-${i + 1}`,
                        score: 30 + Math.random() * 50,
                        volatility: 'dynamic'
                    }))
                }
            ];
            setEntries(mockEntries);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredEntries = entries
        .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="min-h-screen bg-black p-4 md:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
                {/* Header & Search */}
                <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-3xl py-4 md:py-6 -mx-4 md:-mx-8 px-4 md:px-8 rounded-b-[32px] md:rounded-b-[40px] border-b border-white/10 shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                            Cosmic History
                        </h1>
                        <div className="relative group w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-teal-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search subjects alphabetically..."
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-mono text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="grid gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredEntries.map((entry, idx) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-[#1A1A1A] border border-white/5 rounded-[32px] p-6 hover:border-white/20 transition-all duration-500 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                {/* Background Accent */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/5 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                                    {/* Left: Info */}
                                    <div className="flex items-start gap-6 flex-1">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                                            {entry.zodiac === 'Scorpio' ? '♏' : entry.zodiac === 'Taurus' ? '♉' : '✨'}
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-serif font-bold text-white group-hover:text-teal-400 transition-colors">
                                                {entry.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-gray-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {entry.age} Years</span>
                                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {entry.birth_date}</span>
                                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {entry.city}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Sparkline & Score */}
                                    <div className="flex items-center gap-8 w-full md:w-auto">
                                        {/* Sparkline Thumbnail */}
                                        <div className="h-16 w-32 relative opacity-50 group-hover:opacity-100 transition-opacity">
                                            <svg viewBox="0 0 100 40" className="w-full h-full">
                                                <path
                                                    d={`M ${entry.sparkline_data?.map((d, i) => `${i * 3.4}, ${40 - d.score * 0.4}`).join(' L ')}`}
                                                    fill="none"
                                                    stroke="#52C8BC"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>

                                        <div className="flex flex-col items-end">
                                            <div className="text-3xl font-mono font-bold text-white group-hover:text-teal-400">
                                                {entry.today_score}
                                            </div>
                                            <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Momentum</div>
                                        </div>

                                        <button className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white text-gray-400 hover:text-black transition-all">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 w-full bg-white/5 animate-pulse rounded-[32px]" />
                            ))}
                        </div>
                    )}

                    {!loading && filteredEntries.length === 0 && (
                        <div className="text-center py-24 text-gray-600 font-mono text-sm uppercase tracking-[0.3em]">
                            No subjects recorded in your history
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
