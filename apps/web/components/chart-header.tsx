import { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Sun, Clock, User } from 'lucide-react';
import { ZodiacIcon } from './zodiac-icon';

interface PlanetaryPosition {
    planet: string;
    sign: string;
    degree: string;
    house: number;
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

    // Calculate Age
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const difference = Date.now() - birthDate.getTime();
        const ageDate = new Date(difference);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = birthDate ? calculateAge(birthDate) : '??';

    return (
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
            {/* Main Header (Always Visible) */}
            <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#52C8BC] to-[#D84548] flex items-center justify-center border-2 border-white/20 shadow-lg shrink-0 overflow-hidden">
                        <ZodiacIcon sign={sunSign} className="w-full h-full" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-serif font-bold text-white">{name}</h2>
                            <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Verified</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <Sun className="w-3 h-3 text-[#52C8BC]" />
                                <span>{sunSign}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <User className="w-3 h-3 text-[#52C8BC]" />
                                <span>Age {age}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3 h-3 text-[#52C8BC]" />
                                <span>{birthCity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-white/10 pt-4 md:pt-0">
                    {userBrief && (
                        <p className="text-sm text-gray-400 font-sans font-light leading-relaxed max-w-sm line-clamp-2 md:line-clamp-3">
                            {userBrief}
                        </p>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-500 hover:text-white shrink-0"
                    >
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Collapsible Details */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${expanded ? 'max-h-[800px]' : 'max-h-0'
                    }`}
            >
                <div className="p-6 pt-2 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                        {/* User Birth Info Section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Cosmic Origin</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-mono mb-1">
                                        <Clock className="w-2.5 h-2.5" /> Date & Time
                                    </div>
                                    <div className="text-sm text-white font-serif">{birthDate} / {birthTime}</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                    <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase font-mono mb-1">
                                        <MapPin className="w-2.5 h-2.5" /> Location
                                    </div>
                                    <div className="text-sm text-white font-serif truncate">{birthCity}</div>
                                </div>
                            </div>
                        </div>

                        {/* Planetary Details */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Signature Data</h3>
                            <div className="max-h-[160px] overflow-y-auto custom-scrollbar border border-white/10 rounded-lg bg-black/20">
                                <table className="w-full text-left text-[11px] font-mono">
                                    <tbody className="divide-y divide-white/5">
                                        {planets.map((p, i) => (
                                            <tr key={i} className="text-gray-400 hover:bg-white/5 transition-colors">
                                                <td className="py-2.5 px-3 flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-[#52C8BC]" />
                                                    {p.planet}
                                                </td>
                                                <td className="py-2.5 px-3 text-white">{p.sign}</td>
                                                <td className="py-2.5 px-3 text-right text-gray-600">{p.degree}</td>
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

