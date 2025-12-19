'use client';

import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries, LineSeries, AreaSeries, LineData, AreaData, HistogramSeries } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

export type ChartStyle = 'Line' | 'Area' | 'Candle';

export interface MomentumData {
  date: string;
  score: number;
  volatility: 'calm' | 'dynamic' | 'intense';
}

interface LifeChartProps {
  data: MomentumData[];
  onCandleClick?: (data: any) => void;
  style?: ChartStyle;
  birthDate?: string; // YYYY-MM-DD
  selectedDate?: string; // ISO date string
}

export const LifeChart: React.FC<LifeChartProps> = ({ data, onCandleClick, style = 'Area', birthDate, selectedDate }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const highlightSeriesRef = useRef<ISeriesApi<any> | null>(null);
  const selectedPointRef = useRef<MomentumData | null>(null);

  const colors = {
    mint: '#52C8BC',
    rose: '#D84548',
    grid: 'rgba(255, 255, 255, 0.03)',
    text: '#9ca3af',
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: colors.text,
        fontFamily: 'Inter, sans-serif',
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      width: chartContainerRef.current.clientWidth,
      height: 480,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        barSpacing: 24,
        minBarSpacing: 1,
        fixLeftEdge: true,
        fixRightEdge: true,
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

    chart.priceScale('right').applyOptions({
      autoScale: false,
      alignLabels: true,
      borderVisible: false,
      scaleMargins: { top: 0.1, bottom: 0.1 },
    });

    // Handle visible range change for persistent selection
    const handleVisibleRangeChange = () => {
      if (!seriesRef.current || !data || data.length === 0 || !onCandleClick) return;

      const timeScale = chart.timeScale();
      const visibleRange = timeScale.getVisibleRange();
      if (!visibleRange || !visibleRange.from || !visibleRange.to) return;

      const fromTime = new Date(visibleRange.from.toString()).getTime();
      const toTime = new Date(visibleRange.to.toString()).getTime();

      // Check if the currently selected point is within the visible range
      const currentSelectedTime = selectedPointRef.current?.date;
      let isSelectedPointVisible = false;
      if (currentSelectedTime) {
        const selTime = new Date(currentSelectedTime).getTime();
        if (selTime >= fromTime && selTime <= toTime) {
          isSelectedPointVisible = true;
        }
      }

      // If no point is selected, or the selected point is not visible,
      // find the middle visible bar and trigger onCandleClick.
      if (!isSelectedPointVisible) {
        const midTimeVal = (fromTime + toTime) / 2;

        let closestPoint: MomentumData | null = null;
        let minDiff = Infinity;

        for (const d of data) {
          const diff = Math.abs(new Date(d.date).getTime() - midTimeVal);
          if (diff < minDiff) {
            minDiff = diff;
            closestPoint = d;
          }
        }

        if (closestPoint) {
          selectedPointRef.current = closestPoint;
          onCandleClick(closestPoint);
        }
      }
    };

    let debounceTimer: any = null;
    const debouncedHandleVisibleRangeChange = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        handleVisibleRangeChange();
        debounceTimer = null;
      }, 100);
    };

    chart.timeScale().subscribeVisibleLogicalRangeChange(debouncedHandleVisibleRangeChange);

    // Create highlight series (background)
    const highlightSeries = chart.addSeries(HistogramSeries, {
      color: '#444444',
      priceFormat: { type: 'percent' },
      priceScaleId: 'right', // We'll share it but hide the axis if needed
    });
    highlightSeries.applyOptions({
      lastValueVisible: false,
      priceLineVisible: false,
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 0,
          maxValue: 100,
        },
      }),
      priceFormat: {
        type: 'custom' as const,
        formatter: (price: number) => price.toFixed(1) + '%',
      },
    });
    highlightSeriesRef.current = highlightSeries;

    // Handle Axis properly in each series creation

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const pastData = data.filter(d => new Date(d.date) <= now);
    const futureData = data.filter(d => new Date(d.date) > now);

    const commonOptions = {
      priceFormat: {
        type: 'custom' as const,
        formatter: (price: number) => price.toFixed(1) + '%',
      },
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 0,
          maxValue: 100,
        },
      }),
    };

    if (style === 'Candle') {
      const pastSeries = chart.addSeries(CandlestickSeries, {
        ...commonOptions,
        upColor: colors.mint,
        downColor: colors.rose,
        borderVisible: false,
        wickUpColor: colors.mint,
        wickDownColor: colors.rose,
      });

      const futureSeries = chart.addSeries(CandlestickSeries, {
        ...commonOptions,
        upColor: `${colors.mint}1a`,
        downColor: `${colors.rose}1a`,
        borderVisible: false,
        wickUpColor: `${colors.mint}1a`,
        wickDownColor: `${colors.rose}1a`,
      });

      const getCandleData = (items: MomentumData[]) => {
        const candleData: CandlestickData[] = [];
        let prevScore = data.length > 0 ? data[0].score : 50;
        // In a real scenario we'd need more coordination but this works for visualization
        items.forEach((d) => {
          const open = prevScore;
          const close = d.score;
          const volFactor = d.volatility === 'intense' ? 10 : d.volatility === 'dynamic' ? 5 : 2;
          const high = Math.min(100, Math.max(open, close) + volFactor);
          const low = Math.max(0, Math.min(open, close) - volFactor);
          candleData.push({ time: d.date, open, high, low, close });
          prevScore = close;
        });
        return candleData;
      };

      pastSeries.setData(getCandleData(pastData));
      futureSeries.setData(getCandleData(futureData));
      seriesRef.current = pastSeries;
    } else if (style === 'Area') {
      const pastSeries = chart.addSeries(AreaSeries, {
        ...commonOptions,
        lineColor: colors.mint,
        topColor: `${colors.mint}33`,
        bottomColor: `${colors.mint}00`,
        lineWidth: 3,
      });

      const futureSeries = chart.addSeries(AreaSeries, {
        ...commonOptions,
        lineColor: `${colors.mint}33`,
        topColor: `${colors.mint}11`,
        bottomColor: `${colors.mint}00`,
        lineWidth: 3,
      });

      pastSeries.setData(pastData.map(d => ({ time: d.date, value: d.score })));
      futureSeries.setData(futureData.map(d => ({ time: d.date, value: d.score })));
      seriesRef.current = pastSeries;
    } else {
      const pastSeries = chart.addSeries(LineSeries, {
        ...commonOptions,
        color: colors.mint,
        lineWidth: 3,
        crosshairMarkerVisible: true,
      });
      const futureSeries = chart.addSeries(LineSeries, {
        ...commonOptions,
        color: `${colors.mint}33`,
        lineWidth: 3,
        crosshairMarkerVisible: true,
      });
      pastSeries.setData(pastData.map(d => ({ time: d.date, value: d.score })));
      futureSeries.setData(futureData.map(d => ({ time: d.date, value: d.score })));
      seriesRef.current = pastSeries;
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    chart.subscribeClick((param) => {
      if (param.time && onCandleClick) {
        const time = param.time;
        const pStr = typeof time === 'string' ? time : (time as any).year ? `${(time as any).year}-${String((time as any).month).padStart(2, '0')}-${String((time as any).day).padStart(2, '0')}` : null;

        const originalPoint = data.find(d =>
          (d as any).time === time ||
          d.date === time ||
          (pStr && d.date === pStr)
        );

        if (originalPoint) {
          selectedPointRef.current = originalPoint as any;
          onCandleClick(originalPoint);
        }
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
      chartRef.current = null;
      seriesRef.current = null;
      highlightSeriesRef.current = null;
    };
  }, [data, onCandleClick, style]);

  // Update highlight series when selectedDate changes
  useEffect(() => {
    if (highlightSeriesRef.current && selectedDate) {
      highlightSeriesRef.current.setData([
        { time: selectedDate, value: 100 }
      ]);

      // Add marker to main series
      if (seriesRef.current && typeof (seriesRef.current as any).setMarkers === 'function') {
        (seriesRef.current as any).setMarkers([
          {
            time: selectedDate,
            position: 'inBar',
            color: 'rgba(255, 255, 255, 0.2)', // Stroke/Outer
            shape: 'circle',
            size: 1,
          },
          {
            time: selectedDate,
            position: 'inBar',
            color: '#FFFFFF', // Inner
            shape: 'circle',
            size: 0.5,
          }
        ]);
      }
    } else if (highlightSeriesRef.current) {
      highlightSeriesRef.current.setData([]);
      if (seriesRef.current && typeof (seriesRef.current as any).setMarkers === 'function') {
        (seriesRef.current as any).setMarkers([]);
      }
    }
  }, [selectedDate]);

  return (
    <div className="relative w-full h-[480px] group">
      {/* Y-Axis Label & Tooltip */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 transition-opacity duration-300">
        <span className="text-[10px] uppercase tracking-widest text-white/50 font-medium">MOMENTUM SCORE</span>
        <div className="relative group/tooltip">
          <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center text-[10px] text-white/70 cursor-help transition-colors hover:border-teal-500 hover:text-teal-400">?</div>
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900 border border-white/10 p-3 rounded-lg text-xs leading-relaxed text-slate-300 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all origin-bottom-right">
            <p className="font-semibold text-white mb-1">How to Read the Chart</p>
            The Momentum Score maps complex planetary transits to a 0–100 scale.
            <ul className="mt-2 space-y-1 list-disc list-inside opacity-80">
              <li><span className="text-teal-400 font-bold">80+</span> Peak intensity, high focus</li>
              <li><span className="text-slate-400 font-bold">40-60</span> Balanced, steady flow</li>
              <li><span className="text-rose-400 font-bold">20-</span> Reflection, internal shifts</li>
            </ul>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
