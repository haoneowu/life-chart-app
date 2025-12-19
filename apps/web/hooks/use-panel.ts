import { useState, useCallback, useEffect } from 'react';

export interface PanelData {
    overview: { title: string; summary: string };
    why: { driver: string; evidence: string; impact: string; confidence: number }[];
    what: { themes: string[]; keywords: string[] };
    how: { do: { domain: string; text: string }[]; avoid: { domain: string; text: string }[] };
}

const cache = new Map<string, any>();

export function usePanel(userId: string, birthDate: string, birthTime?: string) {
    const [loading, setLoading] = useState(false);
    const [currentPanel, setCurrentPanel] = useState<any>(null);

    const fetchPanel = useCallback(async (timeframe: string, pillar: string, anchorId: string) => {
        const algoVersion = 'v0.9.7';
        const cacheKey = `${userId}:${timeframe}:${pillar}:${anchorId}:${algoVersion}`;

        if (cache.has(cacheKey)) {
            setCurrentPanel(cache.get(cacheKey));
            return;
        }

        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            const res = await fetch(`${apiUrl}/api/panel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    birthDate,
                    birthTime,
                    timeframe,
                    pillar,
                    id: anchorId
                }),
            });
            const data = await res.json();
            cache.set(cacheKey, data);
            setCurrentPanel(data);
        } catch (err) {
            console.error('Failed to fetch panel:', err);
        } finally {
            setLoading(false);
        }
    }, [userId, birthDate, birthTime]);

    // Prefetching helper
    const prefetchPanel = useCallback(async (timeframe: string, pillar: string, anchorId: string) => {
        const algoVersion = 'v0.9.7';
        const cacheKey = `${userId}:${timeframe}:${pillar}:${anchorId}:${algoVersion}`;

        if (cache.has(cacheKey)) return;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
            fetch(`${apiUrl}/api/panel`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    birthDate,
                    birthTime,
                    timeframe,
                    pillar,
                    id: anchorId
                }),
            }).then(res => res.json()).then(data => cache.set(cacheKey, data));
        } catch (err) {
            // Background fail is silent
        }
    }, [userId, birthDate, birthTime]);

    return { loading, currentPanel, fetchPanel, prefetchPanel };
}
