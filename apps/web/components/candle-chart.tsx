'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export interface MomentumData {
  date: string;
  score: number;
  volatility: 'calm' | 'dynamic' | 'intense';
}

interface CandleChartProps {
  data: MomentumData[];
  onCandleClick?: (data: any) => void;
}

export const CandleChart: React.FC<CandleChartProps> = ({ data, onCandleClick }) => {
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
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
      timeScale: {
        borderColor: '#374151',
        barSpacing: 12,
        minBarSpacing: 5,
        rightOffset: 12,
        fixLeftEdge: false,
        lockVisibleTimeRangeOnResize: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
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

    chart.subscribeClick((param) => {
      if (param.time && param.seriesData.get(series) && onCandleClick) {
        const dataPoint = param.seriesData.get(series);
        onCandleClick({ ...dataPoint, time: param.time });
      }
    });

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
  }, [data, onCandleClick]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};
