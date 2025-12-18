'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

interface City {
    name: string;
    lat: number;
    lon: number;
    country: string;
    region?: string;
}

interface CityPickerProps {
    onSelect: (city: City) => void;
    initialValue?: string;
}

export function CityPicker({ onSelect, initialValue = '' }: CityPickerProps) {
    const [query, setQuery] = useState(initialValue);
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<City[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchCities = async (searchText: string) => {
        if (!searchText || searchText.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchText)}&count=10&language=en&format=json`);
            const data = await res.json();

            if (data.results) {
                const mapped: City[] = data.results.map((item: any) => ({
                    name: item.name,
                    lat: item.latitude,
                    lon: item.longitude,
                    country: item.country,
                    region: item.admin1 // Region/State
                }));
                setResults(mapped);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error("Failed to fetch cities", error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        setIsOpen(true);

        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        debounceTimeout.current = setTimeout(() => {
            fetchCities(val);
        }, 300);
    };

    const handleSelect = (city: City) => {
        setQuery(city.name);
        setResults([]); // Clear results on selection
        setIsOpen(false);
        onSelect(city);
    };

    return (
        <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-white/30 transition-colors relative group z-50" ref={containerRef}>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">
                Birth City
            </label>
            <div className="relative flex-1">
                {loading ? (
                    <Loader2 className="absolute right-2 h-4 w-4 text-gray-500 animate-spin top-1/2 -translate-y-1/2" />
                ) : (
                    <MapPin className="absolute left-0 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors top-1/2 -translate-y-1/2 hidden" />
                )}
                <input
                    type="text"
                    className="w-full bg-transparent border-none py-3 px-2 text-lg font-serif placeholder:text-gray-600 text-white focus:outline-none focus:ring-0"
                    placeholder="Search city..."
                    value={query}
                    onChange={handleInput}
                    onFocus={() => {
                        setIsOpen(true);
                        if (results.length === 0 && query.length >= 2) fetchCities(query);
                    }}
                />
            </div>

            {/* Autocomplete Dropdown */}
            {isOpen && results.length > 0 && (
                <ul className="absolute left-0 top-full mt-2 w-full bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[60] max-h-60 overflow-y-auto custom-scrollbar">
                    {results.map((city, index) => (
                        <li
                            key={`${city.name}-${city.lat}`}
                            className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors ${index === highlightedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
                            onClick={() => handleSelect(city)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                        >
                            <div className="flex flex-col">
                                <span className="text-white font-serif text-lg">{city.name}</span>
                                <span className="text-xs text-gray-500 font-mono">
                                    {[city.region, city.country].filter(Boolean).join(', ')}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isOpen && query.length >= 2 && !loading && results.length === 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl z-[60]">
                    <span className="text-gray-500 font-mono text-sm">No cities found.</span>
                </div>
            )}
        </div>
    );
}
