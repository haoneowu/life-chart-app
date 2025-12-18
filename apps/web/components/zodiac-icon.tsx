import React from 'react';

interface ZodiacIconProps {
    sign: string;
    className?: string;
}

const zodiacPaths: Record<string, string> = {
    aries: "M12 21a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7 7 7 0 0 1-7-7H3a9 9 0 0 0 9 9z M12 3q3 0 5 3t2 8h-2q0-5-2-8t-3-3q-1 0-3 3t-2 8H5q0-5 2-8t5-3z", // Simplified RAM
    taurus: "M12 21a9 9 0 0 0 9-9h-2a7 7 0 0 1-7 7 7 7 0 0 1-7-7H3a9 9 0 0 0 9 9z M12 3a9 9 0 0 1 9 9h-2a7 7 0 0 0-7-7 7 7 0 0 0-7 7H3a9 9 0 0 1 9-9z M12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", // Bull
    gemini: "M12 3v18M6 3v18M18 3v18M3 3h18M3 21h18", // Simplified Gemini
    cancer: "M6 12a6 6 0 1 0 12 0 6 6 0 1 0-12 0z M6 12a3 3 0 1 1 0 6M18 12a3 3 0 1 1 0-6", // Crab claws abstract
    leo: "M12 3a9 9 0 1 1 0 18A9 9 0 0 1 12 3z", // Lion circle placeholder
    virgo: "M12 3v18", // Placeholder
    libra: "M12 3v18", // Placeholder
    scorpio: "M12 3v18", // Placeholder
    sagittarius: "M12 3v18", // Placeholder
    capricorn: "M12 3v18", // Placeholder
    aquarius: "M12 3v18", // Placeholder
    pisces: "M12 3v18", // Placeholder
};

// Use simple SVG circles/paths for MVP if exact paths not available, or standard Unicode/Path data
// Better approach: Use Lucid icons or simple geometric Zodiac representations. 
// For this task, I will mock them with generic Zodiac Symbols or stylized text if paths are hard to hand-code without library.
// Actually, let's make a generic component that renders text or simple shapes for now, and I can refine the paths later.

export function ZodiacIcon({ sign, className }: ZodiacIconProps) {
    const signs = [
        'aries', 'taurus', 'gemini', 'cancer',
        'leo', 'virgo', 'libra', 'scorpio',
        'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ];

    const index = signs.indexOf(sign.toLowerCase());
    if (index === -1) return null;

    const col = index % 4;
    const row = Math.floor(index / 4);

    // Assuming 4x3 grid.
    // backgroundSize: '400% 300%'
    // backgroundPositionX: (col / 3) * 100%
    // backgroundPositionY: (row / 2) * 100%

    return (
        <div
            className={`${className || 'w-10 h-10'} bg-no-repeat`}
            style={{
                backgroundImage: 'url(/zodiac_sheet.png)',
                backgroundSize: '400% 300%',
                backgroundPosition: `${(col / 3) * 100}% ${(row / 2) * 100}%`,
                filter: 'invert(1)'
            }}
            title={sign}
        />
    );
}
