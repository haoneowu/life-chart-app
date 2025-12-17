'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export interface MomentumData {
  date: string;
  score: number;
  volatility: 'calm' | 'dynamic' | 'intense';
}

interface CandleChartProps {
  data: MomentumData[];
}

export const CandleChart: React.FC<CandleChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#374151' },
        horzLines: { color: '#374151' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addCandlestickSeries({
      upColor: '#22c55e', // Green-500
      downColor: '#ef4444', // Red-500
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Transform Data
    // We need to synthesize OHLC from Score + Volatility
    // Simple Heuristic:
    // Open = Prev Close (or Score if first)
    // Close = Score
    // Volatility affects Wick length (High/Low)
    
    const candleData: CandlestickData[] = [];
    let prevScore = data.length > 0 ? data[0].score : 50;

    data.forEach((d) => {
      const open = prevScore;
      const close = d.score;
      
      let volFactor = 2;
      if (d.volatility === 'dynamic') volFactor = 5;
      if (d.volatility === 'intense') volFactor = 10;

      const high = Math.max(open, close) + volFactor;
      const low = Math.max(open, close) - volFactor; // Bug: Low should be min - volFactor

      // Correction:
      const realHigh = Math.max(open, close) + volFactor;
      const realLow = Math.max(0, Math.min(open, close) - volFactor);

      candleData.push({
        time: d.date,
        open,
        high: realHigh,
        low: realLow,
        close,
      });

      prevScore = close;
    });

    series.setData(candleData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};
