'use client';

import { useState } from 'react';
import { CandleChart, MomentumData } from '@/components/candle-chart';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<MomentumData[] | null>(null);
  const [formData, setFormData] = useState({
    birthDate: '',
    birthCity: 'New York', // Default for MVP
    lat: 40.7128,
    lon: -74.0060,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (Array.isArray(result)) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-800 bg-gradient-to-b from-zinc-900 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-800/30 lg:p-4">
          Life Chart &mdash; Momentum
        </p>
      </div>

      <div className="w-full max-w-3xl mt-10">
        {!data ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <label>Birth Date</label>
              <input 
                type="date" 
                required
                className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            {/* MVP: Hardcoded Location for now or simple input */}
             <div className="flex flex-col gap-2">
              <label>City (Lat/Lon)</label>
              <div className="flex gap-2">
                 <input 
                  type="number" 
                  step="0.0001"
                  placeholder="Lat"
                  className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
                  value={formData.lat}
                  onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value)})}
                />
                 <input 
                  type="number" 
                  step="0.0001"
                  placeholder="Lon"
                  className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
                  value={formData.lon}
                  onChange={(e) => setFormData({...formData, lon: parseFloat(e.target.value)})}
                />
              </div>
              <p className="text-xs text-gray-500">Default: New York</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Chart'}
            </button>
          </form>
        ) : (
          <div className="animate-in fade-in duration-1000">
             <h2 className="text-2xl font-bold mb-4">Your Momentum</h2>
             <CandleChart data={data} />
             <button 
               onClick={() => setData(null)}
               className="mt-6 text-sm text-gray-500 underline"
             >
               Reset
             </button>
          </div>
        )}
      </div>
    </main>
  );
}