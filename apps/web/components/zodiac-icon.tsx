import React from 'react';
import Image from 'next/image';

interface ZodiacIconProps {
    sign: string;
    className?: string;
}

export function ZodiacIcon({ sign, className }: ZodiacIconProps) {
    if (!sign) return null;

    const s = sign.toLowerCase();

    // Mapping for typos in filenames
    const mapping: Record<string, string> = {
        'sagittarius': 'sagtitarius',
        'taurus': 'taurns'
    };

    const fileName = mapping[s] || s;

    return (
        <div className={`relative ${className || 'w-10 h-10'}`}>
            <Image
                src={`/zodiac/${fileName}.png`}
                alt={sign}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80px, 80px"
            />
        </div>
    );
}
