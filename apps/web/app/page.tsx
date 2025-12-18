'use client';

import { useState } from 'react';
import { CandleChart, MomentumData } from '@/components/candle-chart';
import { CityPicker } from '@/components/city-picker';
import { DetailPanel } from '@/components/detail-panel';
import { ChartHeader } from '@/components/chart-header';
import { motion } from 'framer-motion';

// Mock Planetary Data (Comprehensive)
const MOCK_PLANETS = [
  { planet: 'Sun', sign: 'Virgo', degree: "18°10'", house: 9 },
  { planet: 'Moon', sign: 'Sagittarius', degree: "16°39'", house: 12 },
  { planet: 'Mercury', sign: 'Virgo', degree: "23°4'", house: 9 },
  { planet: 'Venus', sign: 'Scorpio', degree: "3°13'", house: 11 },
  { planet: 'Mars', sign: 'Capricorn', degree: "17°8'", house: 1 },
  { planet: 'Jupiter', sign: 'Pisces', degree: "28°12'", house: 3 },
  { planet: 'Saturn', sign: 'Aquarius', degree: "6°55'", house: 2 },
  { planet: 'Uranus', sign: 'Taurus', degree: "14°21'", house: 5 },
  { planet: 'Neptune', sign: 'Pisces', degree: "22°40'", house: 3 },
  { planet: 'Pluto', sign: 'Capricorn', degree: "25°30'", house: 1 },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MomentumData[] | null>(null);
  const [selectedCandle, setSelectedCandle] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    lat: 40.7128,
    lon: -74.0060,
    city: '',
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          lat: formData.lat,
          lon: formData.lon
        }),
      });
      const result = await res.json();
      if (Array.isArray(result) && result.length > 0) {
        // Ensure data is set first, then selected candle
        setData(result);
        // Timeout to ensure state update flow? Usually not needed in React 18 but let's try strict ordering or just standard
        setSelectedCandle(result[result.length - 1]);
      } else {
        console.warn("API returned empty data", result);
        setData([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySelect = (city: any) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      lat: city.lat,
      lon: city.lon
    }));
  };

  return (
    <main className="flex min-h-screen flex-col relative w-full overflow-x-hidden">
      {/* Detail Panel Slide-over */}
      <DetailPanel data={selectedCandle} onClose={() => setSelectedCandle(null)} />

      {/* Header */}
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm flex p-8 lg:p-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white/5 lg:p-4 opacity-50">
          State: Beta 0.9
        </p>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 lg:px-12 mt-4 lg:mt-0">
        {!data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-12 max-w-2xl"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-serif font-bold leading-tight text-white mb-6 p-2">
                Calculate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 animate-pulse">
                  Life Momentum
                </span>
              </h1>
              <p className="text-xl text-gray-400 font-sans max-w-lg leading-relaxed pl-2 font-light tracking-wide">
                Life is a market. We chart the invisible trends of your personal history to reveal your current momentum.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-8 border border-white/20 rounded-3xl bg-white/10 backdrop-blur-lg shadow-2xl relative overflow-visible group/form">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-3xl" />

              <div className="grid grid-cols-1 gap-6 relative z-10">
                {/* Name */}
                <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-white/30 transition-colors">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full bg-transparent border-none py-3 px-2
                               text-lg font-serif placeholder:text-gray-600 text-white
                               focus:outline-none focus:ring-0"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Gender (Optional) */}
                <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-white/30 transition-colors">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">Gender</label>
                  <div className="relative w-full">
                    <select className="w-full bg-transparent border-none py-3 px-2
                                text-lg font-serif text-white appearance-none cursor-pointer
                                focus:outline-none focus:ring-0">
                      <option value="">Select...</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-white/30 transition-colors">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">Birth Date</label>
                  <input
                    type="date"
                    required
                    className="w-full bg-transparent border-none py-3 px-2
                               text-lg font-serif placeholder:text-gray-600 text-white
                               focus:outline-none focus:ring-0 appearance-none [color-scheme:dark]"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>

                <div className="relative z-20">
                  <CityPicker onSelect={handleCitySelect} initialValue={formData.city} />
                </div>
              </div>

              <div className="pt-6 relative z-10">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full px-8 py-5 bg-gradient-to-r from-teal-500 via-rose-500 to-orange-500 bg-[length:200%_200%] animate-gradient-pan text-white rounded-2xl text-xl font-bold font-serif hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none overflow-hidden z-0"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide text-shadow-sm">
                    {loading ? 'Analyzing Cosmos...' : 'Unlock Your Chart'}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full space-y-8"
          >
            {/* Header */}
            <ChartHeader
              name={formData.name || 'Anonymous Star'}
              sunSign="Virgo" // Mock
              planets={MOCK_PLANETS}
              userBrief="Analytical and practical, you crave order. Your path involves mastering the details to build something lasting, fueled by deep intuition."
            />

            {/* Main Chart Area */}
            <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-black/80 backdrop-blur-xl rounded-[22px] border border-white/10 p-6 overflow-hidden relative min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* Chart Controls */}
                <div className="absolute top-6 right-6 z-10 flex gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                  {['Day', 'Week', 'Month'].map((tf) => (
                    <button
                      key={tf}
                      className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${tf === 'Day' ? 'bg-white/20 text-white font-bold' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>

                <CandleChart
                  data={data}
                  onCandleClick={(candle) => setSelectedCandle(candle)}
                />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">Current Trend</h3>
                <p className="text-2xl font-serif">Accumulation</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">Volatility</h3>
                <p className="text-2xl font-serif text-green-400">Low</p>
              </div>
              <div className="p-6 rounded-2xl border border-white/5 bg-white/5">
                <h3 className="text-xs font-mono text-gray-500 uppercase mb-2">Next Key Date</h3>
                <p className="text-2xl font-serif">March 21</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}