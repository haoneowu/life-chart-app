'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ZodiacIcon } from './zodiac-icon';

interface PlanetaryPosition {
    planet: string; // Sun, Moon, etc.
    sign: string;   // Aries, etc.
    degree: string; // 18°10'
    house: number;  // 1-12
    retrograde?: boolean;
}

interface ChartHeaderProps {
    name: string;
    sunSign: string;
    planets: PlanetaryPosition[];
    userBrief?: string;
}

export function ChartHeader({ name, sunSign, planets, userBrief }: ChartHeaderProps) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
            {/* Main Header (Always Visible) */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center border-2 border-white/20 shadow-lg shadow-orange-500/20 shrink-0">
                        <ZodiacIcon sign={sunSign} className="text-4xl text-white mix-blend-overlay" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-1">{name}</h2>
                        <div className="flex items-center gap-2 text-sm font-mono text-gray-400 uppercase tracking-widest mb-2">
                            <span>Sun: {sunSign}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                            <span>Momentum: Active</span>
                        </div>
                        {userBrief && (
                            <p className="text-sm text-gray-300 font-sans leading-relaxed max-w-xl opacity-90">
                                {userBrief}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                    {expanded ? <ChevronUp /> : <ChevronDown />}
                </button>
            </div>

            {/* Collapsible Details */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${expanded ? 'max-h-[500px]' : 'max-h-0'
                    }`}
            >
                <div className="p-6 pt-0 border-t border-white/10">
                    {/* Desktop Table */}
                    <div className="hidden md:block w-full overflow-x-auto">
                        <table className="w-full text-left text-sm font-mono">
                            <thead>
                                <tr className="text-gray-500 border-b border-white/5">
                                    <th className="py-3 font-normal uppercase tracking-wider">Planet</th>
                                    <th className="py-3 font-normal uppercase tracking-wider">Sign</th>
                                    <th className="py-3 font-normal uppercase tracking-wider">Degree</th>
                                    <th className="py-3 font-normal uppercase tracking-wider">House</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {planets.map((p, i) => (
                                    <tr key={i} className="text-gray-300 hover:bg-white/5 transition-colors">
                                        <td className="py-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-blue-400/50" />
                                            {p.planet}
                                        </td>
                                        <td className="py-3">{p.sign}</td>
                                        <td className="py-3 text-gray-500">{p.degree}</td>
                                        <td className="py-3">{p.house}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden grid grid-cols-2 gap-3 mt-4">
                        {planets.map((p, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5">
                                <div className="text-xs text-gray-500 uppercase font-mono mb-1">{p.planet}</div>
                                <div className="text-lg font-serif text-white">{p.sign}</div>
                                <div className="text-xs text-gray-400">{p.degree} • House {p.house}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
