import { ChartSnapshot, PlanetPosition } from './astronomy';

export interface DailyMomentum {
  date: string; // YYYY-MM-DD
  score: number; // 0-100
  volatility: 'calm' | 'dynamic' | 'intense';
  signal_tags: string[];
}

const ASPECTS = [
  { name: 'Conjunction', angle: 0 },
  { name: 'Sextile', angle: 60 },
  { name: 'Square', angle: 90 },
  { name: 'Trine', angle: 120 },
  { name: 'Opposition', angle: 180 },
];

const ORB_STRONG = 2;
const ORB_MODERATE = 4;

const SCORE_STRONG = 5;
const SCORE_MODERATE = 3;

export class MomentumEngine {
  static calculateScore(natal: ChartSnapshot, transit: ChartSnapshot): { score: number; tags: string[] } {
    let score = 0;
    const tags: string[] = [];

    // Iterate over all pairs
    for (const tPlanet of transit.planets) {
      for (const nPlanet of natal.planets) {
        // Calculate angular distance
        let diff = Math.abs(tPlanet.longitude - nPlanet.longitude);
        if (diff > 180) diff = 360 - diff; // Shortest arc

        // Check against aspects
        for (const aspect of ASPECTS) {
          const delta = Math.abs(diff - aspect.angle);
          
          if (delta <= ORB_MODERATE) {
            // It's a hit
            if (delta <= ORB_STRONG) {
              score += SCORE_STRONG;
              // Only tag strong signals to avoid noise? Or all? Let's tag all but maybe mark strong.
              tags.push(`${tPlanet.body}-${nPlanet.body} ${aspect.name}`);
            } else {
              score += SCORE_MODERATE;
            }
            // Break aspect loop (can't match multiple aspects for same pair realistically, max orb 4, min dist between aspects 30)
            break; 
          }
        }
      }
    }

    return {
      score: Math.min(score, 100),
      tags: [...new Set(tags)] // Unique tags
    };
  }

  static calculateSeries(natal: ChartSnapshot, dailyTransits: ChartSnapshot[]): DailyMomentum[] {
    const results: DailyMomentum[] = [];
    let prevScore = 0;

    // We assume dailyTransits are sorted by date
    for (let i = 0; i < dailyTransits.length; i++) {
      const transit = dailyTransits[i];
      const { score, tags } = this.calculateScore(natal, transit);

      // Volatility based on day-to-day delta
      // For first day, assume calm or compare to prev if we had it. 
      // MVP: First day volatility based on 0 is wrong, maybe just 'calm'.
      let volatility: 'calm' | 'dynamic' | 'intense' = 'calm';
      
      if (i > 0) {
        const delta = Math.abs(score - prevScore);
        if (delta > 20) volatility = 'intense';
        else if (delta > 10) volatility = 'dynamic';
        else volatility = 'calm';
      }

      results.push({
        date: transit.date.toISOString().split('T')[0],
        score,
        volatility,
        signal_tags: tags
      });

      prevScore = score;
    }

    return results;
  }
}
