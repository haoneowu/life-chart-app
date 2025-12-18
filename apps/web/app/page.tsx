'use client';

import React, { useState, useEffect } from 'react';
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
  const [timeframe, setTimeframe] = useState<'Day' | 'Month' | 'Year'>('Day');
  const [pillar, setPillar] = useState<'Overall' | 'Career' | 'Money' | 'Relationships' | 'Energy'>('Overall');

  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    birthHour: '12',
    birthMinute: '00',
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
          birthTime: `${formData.birthHour}:${formData.birthMinute}`,
          lat: formData.lat,
          lon: formData.lon,
          pillar,
          timeframe
        }),
      });
      const result = await res.json();
      console.log('Chart data received:', result.length);
      setData(result);

      // Auto-select "today" or latest candle
      if (result && result.length > 0) {
        setSelectedCandle(result[result.length - 1]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevCandle = () => {
    if (!data || !selectedCandle) return;
    const currentIndex = data.findIndex(c => c.date === (selectedCandle.date || selectedCandle.time));
    if (currentIndex > 0) {
      setSelectedCandle(data[currentIndex - 1]);
    }
  };

  const handleNextCandle = () => {
    if (!data || !selectedCandle) return;
    const currentIndex = data.findIndex(c => c.date === (selectedCandle.date || selectedCandle.time));
    if (currentIndex < data.length - 1) {
      setSelectedCandle(data[currentIndex + 1]);
    }
  };

  useEffect(() => {
    if (formData.birthDate) {
      handleSubmit();
    }
  }, [pillar, timeframe]);

  const handleCitySelect = (city: any) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      lat: city.lat,
      lon: city.lon
    }));
  };

  return (
    <main className="flex min-h-screen flex-col relative w-full overflow-x-hidden p-0 m-0">
      {/* Detail Panel Slide-over */}
      <DetailPanel
        data={selectedCandle}
        onClose={() => setSelectedCandle(null)}
        onPrev={handlePrevCandle}
        onNext={handleNextCandle}
      />

      {/* Header */}
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm flex p-8 lg:p-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white/5 lg:p-4 opacity-50">
          State: Beta 0.9
        </p>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 mt-4 lg:mt-0">
        {!data ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start lg:items-center min-h-[70vh] py-12"
          >
            {/* Left side: Hero Text */}
            <div className="space-y-6 lg:w-3/5">
              <h1 className="text-6xl lg:text-8xl font-serif font-bold leading-tight text-white p-2">
                Calculate your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-purple-200 animate-pulse">
                  Life Momentum
                </span>
              </h1>
              <p className="text-2xl text-gray-400 font-sans max-w-lg leading-relaxed pl-2 font-light tracking-wide">
                Life is a market. We chart the invisible trends of your personal history to reveal your current momentum.
              </p>
            </div>

            {/* Right side: Form */}
            <div className="lg:w-2/5 w-full">
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

                  <div className="flex flex-col gap-4">
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

                    <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-white/30 transition-colors">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">Birth Time</label>
                      <div className="flex flex-1 items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="23"
                          placeholder="HH"
                          className="w-16 bg-transparent border-none py-3 px-2 text-lg font-serif text-white focus:outline-none focus:ring-0 text-center"
                          value={formData.birthHour}
                          onChange={(e) => setFormData({ ...formData, birthHour: e.target.value.padStart(2, '0').slice(-2) })}
                        />
                        <span className="text-gray-500">:</span>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          placeholder="MM"
                          className="w-16 bg-transparent border-none py-3 px-2 text-lg font-serif text-white focus:outline-none focus:ring-0 text-center"
                          value={formData.birthMinute}
                          onChange={(e) => setFormData({ ...formData, birthMinute: e.target.value.padStart(2, '0').slice(-2) })}
                        />
                      </div>
                    </div>
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
            </div>
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
              birthDate={formData.birthDate}
              birthTime={`${formData.birthHour}:${formData.birthMinute}`}
              birthCity={formData.city || 'Unknown'}
            />

            {/* Main Chart Area */}
            <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent">
              <div className="bg-black/80 backdrop-blur-xl rounded-[22px] border border-white/10 p-6 overflow-hidden relative min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                {/* Chart Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative z-30">
                  {/* Pillar Selection */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {(['Overall', 'Career', 'Money', 'Relationships', 'Energy'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPillar(p)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${pillar === p
                          ? 'bg-white text-black shadow-lg scale-105'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Timeframe Selection */}
                  <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    {(['Day', 'Month', 'Year'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${timeframe === t
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                          }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <CandleChart data={data} onCandleClick={setSelectedCandle} />
                </div>
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