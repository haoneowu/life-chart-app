'use client';

import { toPng } from 'html-to-image';
import { useCallback } from 'react';

export function useShare() {
    const shareImage = useCallback(async (elementId: string, fileName: string = 'life-chart-insight.png') => {
        const element = document.getElementById(elementId);
        if (!element) return;

        try {
            // Ensure fonts and images are loaded
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(element, {
                cacheBust: true,
                style: {
                    transform: 'scale(1)',
                }
            });

            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Snapshot failed', err);
        }
    }, []);

    return { shareImage };
}
