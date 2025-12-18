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
    birthDate: string;
    birthTime: string;
    birthCity: string;
}

export function ChartHeader({ name, sunSign, planets, userBrief, birthDate, birthTime, birthCity }: ChartHeaderProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
            {/* Main Header (Always Visible) */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center border-2 border-white/20 shadow-lg shrink-0">
                        <ZodiacIcon sign={sunSign} className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-1">{name}</h2>
                        <div className="flex items-center gap-2 text-sm font-mono text-gray-400 uppercase tracking-widest mb-3">
                            <span>Sun: {sunSign}</span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                            <span>{birthCity}</span>
                        </div>
                        {userBrief && (
                            <p className="text-xl text-gray-200 font-sans font-light leading-relaxed max-w-2xl">
                                {userBrief}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => setExpanded(!expanded)}
                    className="p-3 rounded-full hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                    {expanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                </button>
            </div>

            {/* Collapsible Details */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${expanded ? 'max-h-[800px]' : 'max-h-0'
                    }`}
            >
                <div className="p-8 pt-0 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
                        {/* User Birth Info Section */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Birth Profile</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Birth Date</div>
                                    <div className="text-lg text-white font-serif">{birthDate}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Birth Time</div>
                                    <div className="text-lg text-white font-serif">{birthTime}</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl border border-white/10 sm:col-span-2">
                                    <div className="text-[10px] text-gray-500 uppercase font-mono mb-1">Location</div>
                                    <div className="text-lg text-white font-serif">{birthCity}</div>
                                </div>
                            </div>
                        </div>

                        {/* Planetary Details */}
                        <div className="space-y-6">
                            <h3 className="text-xs font-mono text-gray-500 uppercase tracking-widest">Planetary Aspects</h3>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left text-sm font-mono">
                                    <thead>
                                        <tr className="text-gray-500 border-b border-white/5">
                                            <th className="py-3 font-normal uppercase tracking-wider">Planet</th>
                                            <th className="py-3 font-normal uppercase tracking-wider">Sign</th>
                                            <th className="py-3 font-normal uppercase tracking-wider text-right">Degree</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {planets.map((p, i) => (
                                            <tr key={i} className="text-gray-300 hover:bg-white/5 transition-colors">
                                                <td className="py-3 flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                                                    {p.planet}
                                                </td>
                                                <td className="py-3">{p.sign}</td>
                                                <td className="py-3 text-right text-gray-500">{p.degree}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
