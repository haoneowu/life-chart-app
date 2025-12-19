'use client';

import React, { useState, useEffect } from 'react';
import { Globe, History, Briefcase, Coins, Heart, Zap } from 'lucide-react';
import { LifeChart, MomentumData, ChartStyle } from '@/components/life-chart';
import { CityPicker } from '@/components/city-picker';
import { DetailPanel } from '@/components/detail-panel';
import { ChartHeader } from '@/components/chart-header';
import { motion, AnimatePresence } from 'framer-motion';
import Magnetic from '@/components/magnetic';
import { usePanel } from '@/hooks/use-panel';
import { AuthModal } from '@/components/auth-modal';
import { supabase } from '@/lib/supabase';
import { useSidebar } from '@/context/sidebar-context';
import { ArrowLeft } from 'lucide-react';

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
  const [anchors, setAnchors] = useState<{ years: Record<string, any[]>, months: Record<string, any[]> } | null>(null);
  const [data, setData] = useState<MomentumData[] | null>(null);
  const [natalInfo, setNatalInfo] = useState<any | null>(null);
  const [selectedCandle, setSelectedCandle] = useState<any | null>(null);
  const [timeframe, setTimeframe] = useState<'Day' | 'Month' | 'Year'>('Month');
  const [pillar, setPillar] = useState<'Overall' | 'Career' | 'Money' | 'Relationships' | 'Energy'>('Overall');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('Area');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { setVisible } = useSidebar();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setVisible(!data);
  }, [data, setVisible]);

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthHour: '12',
    birthMinute: '00',
    lat: 40.7128,
    lon: -74.0060,
    city: '',
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/chart/anchors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: `${formData.birthHour}:${formData.birthMinute}`,
          lat: formData.lat,
          lon: formData.lon
        }),
      });
      const result = await res.json();
      setAnchors({ years: result.years, months: result.months });
      setNatalInfo(result.natalInfo);

      // Default to Month/Overall on first load
      const currentMonthData = (result.months[pillar] || []).map((d: any) => ({
        ...d,
        score: Math.min(100, Math.max(0, d.score))
      }));
      setData(currentMonthData);

      if (currentMonthData.length > 0) {
        // Selection Logic: Current month or max month
        const now = new Date();
        const yyyymm = now.toISOString().slice(0, 7);
        const currentIndex = currentMonthData.findIndex((c: any) => c.date.slice(0, 7) === yyyymm);

        // If nowMonth not in range, select the last point (maxMonth)
        const selected = currentIndex !== -1
          ? currentMonthData[currentIndex]
          : currentMonthData[currentMonthData.length - 1];

        setSelectedCandle(selected);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDaysExpansion = async (month: string, currentPillar: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${apiUrl}/chart/days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          birthDate: formData.birthDate,
          birthTime: `${formData.birthHour}:${formData.birthMinute}`,
          month,
          pillar: currentPillar
        }),
      });
      const result = await res.json();
      return result.days;
    } catch (err) {
      console.error(err);
      return [];
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

  const { loading: panelLoading, currentPanel, fetchPanel, prefetchPanel } = usePanel(
    "temp_user",
    formData.birthDate,
    `${formData.birthHour}:${formData.birthMinute}`
  );

  useEffect(() => {
    if (selectedCandle) {
      const anchorId = selectedCandle.date || selectedCandle.time;
      fetchPanel(timeframe, pillar, anchorId);
    }
  }, [selectedCandle, timeframe, pillar, fetchPanel]);

  // Prefetch current month when pillar changes
  useEffect(() => {
    if (anchors) {
      const now = new Date();
      const yyyymm = now.toISOString().slice(0, 7);
      prefetchPanel(timeframe, pillar, yyyymm);
    }
  }, [pillar, timeframe, anchors, prefetchPanel]);

  useEffect(() => {
    if (!anchors) return;

    const updateView = async () => {
      let currentData: MomentumData[] = [];

      if (timeframe === 'Year') {
        currentData = anchors.years[pillar];
      } else if (timeframe === 'Month') {
        currentData = anchors.months[pillar];
      } else if (timeframe === 'Day') {
        // Expand the currently selected month, or the current month if none selected
        const selectedMonth = selectedCandle?.date?.slice(0, 7) || new Date().toISOString().slice(0, 7);
        currentData = await fetchDaysExpansion(selectedMonth, pillar);
      }

      setData(currentData.map((d: any) => ({
        ...d,
        score: Math.min(100, Math.max(0, d.score))
      })));

      // Re-selection logic to maintain temporal context
      if (currentData.length > 0) {
        if (timeframe === 'Day' && selectedCandle?.date?.length === 7) {
          // Month -> Day: Select the first day of that month
          setSelectedCandle({ ...currentData[0], score: Math.min(100, Math.max(0, currentData[0].score)) });
        } else if (timeframe === 'Month' && selectedCandle?.date?.length === 10) {
          // Day -> Month: Select the parent month
          const parentMonth = selectedCandle.date.slice(0, 7) + '-01';
          const match = currentData.find(c => c.date === parentMonth);
          if (match) setSelectedCandle({ ...match, score: Math.min(100, Math.max(0, match.score)) });
        } else if (!selectedCandle) {
          setSelectedCandle({ ...currentData[0], score: Math.min(100, Math.max(0, currentData[0].score)) });
        }
      }
    };

    updateView();
  }, [pillar, timeframe, anchors, selectedCandle?.date]);

  const handleCitySelect = (city: any) => {
    setFormData(prev => ({
      ...prev,
      city: city.name,
      lat: city.lat,
      lon: city.lon
    }));
  };

  const handleBackToAnchor = () => {
    if (!anchors || !data) return;
    const now = new Date();
    const yyyymm = now.toISOString().slice(0, 7) + '-01';
    const match = data.find(c => c.date === yyyymm);
    if (match) setSelectedCandle(match);
    else setSelectedCandle(data[data.length - 1]);
  };

  const handleGoToToday = async () => {
    setTimeframe('Day');
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    // This will trigger the timeframe effect to fetch days, but we need to wait or use a side effect.
    // For now, setting timeframe is enough to change the view context.
  };

  const handleGoHome = () => {
    setData(null);
    setAnchors(null);
    setSelectedCandle(null);
  };

  return (
    <main className="flex min-h-screen flex-col relative w-full overflow-x-hidden p-0 m-0">
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {data && (
        <button
          onClick={handleGoHome}
          className="fixed top-8 left-8 z-[60] flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/10 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-xs uppercase tracking-widest">Home</span>
        </button>
      )}
      {/* Detail Panel Slide-over */}
      <DetailPanel
        data={selectedCandle}
        panelData={currentPanel}
        loading={panelLoading}
        onClose={() => setSelectedCandle(null)}
        onPrev={handlePrevCandle}
        onNext={handleNextCandle}
        onBackToAnchor={handleBackToAnchor}
        onGoToToday={handleGoToToday}
      />

      {/* Header */}
      <div className="z-10 w-full max-w-7xl items-center justify-between font-mono text-sm flex p-8 lg:p-12">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-white/10 bg-black/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-white/5 lg:p-4 opacity-50">
          State: Beta 0.9
        </div>
      </div>

      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 mt-4 lg:mt-0 flex flex-col gap-6 relative">
        <div className={`flex-1 transition-all duration-500 ${selectedCandle && data ? 'lg:mr-[400px]' : ''}`}>
          {!data ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24 items-start lg:items-center min-h-[70vh] py-8 lg:py-12 relative"
            >
              {/* Background Accent Image */}
              <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-gradient-to-br from-teal-500/20 to-rose-500/20 blur-[120px] pointer-events-none rounded-full" />

              {/* Left side: Hero Text */}
              <div className="space-y-8 lg:w-3/5">
                <motion.h1
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.15
                      }
                    }
                  }}
                  initial="hidden"
                  animate="show"
                  className="text-5xl sm:text-6xl lg:text-8xl font-serif font-bold leading-[0.9] text-white p-2 tracking-tighter"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {["Calculate", "your", "Life", "Momentum"].map((word, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        show: { opacity: 1, y: 0 }
                      }}
                      className="inline-block mr-4 last:mr-0"
                    >
                      {word === "Momentum" ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-rose-400">
                          {word}
                        </span>
                      ) : word}
                    </motion.span>
                  ))}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="text-xl lg:text-2xl text-gray-400 font-sans max-w-lg leading-relaxed pl-2 font-light tracking-wide border-l border-white/10"
                >
                  Life is a market. We chart the invisible trends of your personal history to reveal your current momentum.
                </motion.p>
              </div>

              {/* Right side: Form */}
              <div className="lg:w-2/5 w-full">
                <form onSubmit={handleSubmit} className="space-y-6 p-6 lg:p-8 border border-white/5 rounded-[40px] bg-gradient-to-b from-[#444444] to-[#222222] backdrop-blur-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-visible group/form transition-all duration-700 hover:border-white/10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none rounded-[40px]" />

                  <div className="grid grid-cols-1 gap-6 relative z-20">
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

                    {/* Gender (Mandatory) */}
                    <div className="flex items-center gap-4 bg-black/40 border border-white/10 rounded-xl px-4 py-1 group-focus-within:border-[#52C8BC]/50 transition-all duration-300">
                      <label className="text-xs font-mono text-gray-500 uppercase tracking-widest w-24 shrink-0 border-r border-white/10 py-2">Gender</label>
                      <div className="relative w-full group/select">
                        <select
                          required
                          className="w-full bg-transparent border-none py-3 px-2
                                  text-lg font-serif text-white appearance-none cursor-pointer
                                  focus:outline-none focus:ring-0 relative z-10"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="" className="bg-black">Select...</option>
                          <option value="male" className="bg-black">Male</option>
                          <option value="female" className="bg-black">Female</option>
                          <option value="other" className="bg-black">Other</option>
                        </select>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
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

                    <div className="relative z-30">
                      <CityPicker onSelect={handleCitySelect} initialValue={formData.city} />
                    </div>
                  </div>

                  <div className="pt-6 relative z-10">
                    <button
                      type={user ? "submit" : "button"}
                      onClick={() => { if (!user) setIsAuthModalOpen(true); }}
                      disabled={loading}
                      className="group relative w-full px-8 py-5 bg-gradient-to-r from-[#52C8BC] via-[#D84548] to-[#52C8BC] bg-[length:200%_200%] animate-gradient-pan text-white rounded-2xl text-xl font-bold font-serif hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none overflow-hidden"
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
              initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full space-y-8"
            >
              {/* Header */}
              <ChartHeader
                name={formData.name || 'Anonymous Star'}
                sunSign={natalInfo?.sunSign || 'Virgo'}
                planets={natalInfo?.planets || MOCK_PLANETS}
                userBrief={natalInfo?.interpretation || "Analytical and practical, you crave order. Your path involves mastering the details to build something lasting, fueled by deep intuition."}
                birthDate={formData.birthDate}
                birthTime={`${formData.birthHour}:${formData.birthMinute}`}
                birthCity={formData.city || 'Unknown'}
              />

              {/* Main Chart Area */}
              <div className="p-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent sticky top-4 lg:relative lg:top-0 z-40 lg:z-10 shadow-2xl">
                <div className="bg-black/90 backdrop-blur-xl rounded-[22px] border border-white/10 p-4 lg:p-6 overflow-hidden relative min-h-[400px] lg:min-h-[500px]">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

                  {/* Momentum Score Legend */}
                  <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/10 rounded-lg backdrop-blur-md scale-90 lg:scale-100">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#52C8BC]">Momentum Score</span>
                    <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-gray-500 cursor-help group/help relative">
                      ?
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-black border border-white/10 rounded-lg text-[10px] text-gray-400 opacity-0 group-hover/help:opacity-100 transition-opacity pointer-events-none leading-relaxed">
                        A combined value (0–100) representing the alignment of planetary transits with your natal cosmic signature.
                      </div>
                    </div>
                  </div>

                  {/* Chart Controls */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 lg:mb-8 relative z-30">
                    {/* Pillar Selection */}
                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                      {(['Overall', 'Career', 'Money', 'Relationships', 'Energy'] as const).map((p) => {
                        const icons: Record<string, any> = {
                          Overall: <Globe className="w-4 h-4" />,
                          Career: <Briefcase className="w-4 h-4" />,
                          Money: <Coins className="w-4 h-4" />,
                          Relationships: <Heart className="w-4 h-4" />,
                          Energy: <Zap className="w-4 h-4" />,
                        };
                        return (
                          <button
                            key={p}
                            onClick={() => setPillar(p)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${pillar === p
                              ? 'bg-white text-black shadow-lg scale-105'
                              : 'text-gray-400 hover:text-white hover:bg-white/5'
                              }`}
                          >
                            {icons[p]}
                            <span className="hidden lg:inline">{p}</span>
                          </button>
                        );
                      })}
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

                    {/* Chart Style Toggle */}
                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                      {(['Area', 'Candle'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => setChartStyle(s)}
                          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${chartStyle === s
                            ? 'bg-white text-black shadow-md'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <LifeChart
                      data={data}
                      onCandleClick={setSelectedCandle}
                      style={chartStyle}
                      selectedDate={selectedCandle?.date || selectedCandle?.time}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Desktop Sticky Panel Column */}
        {selectedCandle && (
          <div className="hidden lg:block w-[400px] shrink-0 sticky top-4 h-[calc(100vh-2rem)] z-50">
            <DetailPanel
              data={selectedCandle}
              onClose={() => setSelectedCandle(null)}
              onPrev={handlePrevCandle}
              onNext={handleNextCandle}
            />
          </div>
        )}

        {/* Mobile Slide-over Panel (Handled by floating DetailPanel) */}
        <div className="lg:hidden">
          {selectedCandle && (
            <DetailPanel
              data={selectedCandle}
              onClose={() => setSelectedCandle(null)}
              onPrev={handlePrevCandle}
              onNext={handleNextCandle}
            />
          )}
        </div>
      </div>
    </main>
  );
}