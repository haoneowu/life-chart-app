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

const PILLAR_WEIGHTS: Record<string, Record<string, number>> = {
  Overall: { Sun: 1.0, Moon: 1.0, Jupiter: 1.0, Saturn: 1.0, Venus: 1.0, Mars: 1.0 },
  Career: { Sun: 2.0, Saturn: 2.0, Jupiter: 1.5, Mars: 1.5 },
  Money: { Venus: 2.0, Jupiter: 2.0, Saturn: 1.0, Mercury: 1.5 },
  Relationships: { Moon: 2.0, Venus: 2.0, Mars: 1.5, Neptune: 1.0 },
  Energy: { Sun: 2.0, Mars: 2.0, Moon: 1.5, Uranus: 1.0 },
};

export class MomentumEngine {
  static calculateScore(natal: ChartSnapshot, transit: ChartSnapshot, pillar: string = 'Overall'): { score: number; tags: string[] } {
    let score = 0;
    const tags: string[] = [];
    const weights = PILLAR_WEIGHTS[pillar] || PILLAR_WEIGHTS.Overall;

    // Iterate over all pairs
    for (const tPlanet of transit.planets) {
      for (const nPlanet of natal.planets) {
        // Apply weights if planet is significant for this pillar
        const weight = (weights[tPlanet.body] || 1.0) * (weights[nPlanet.body] || 1.0);

        // Calculate angular distance
        let diff = Math.abs(tPlanet.longitude - nPlanet.longitude);
        if (diff > 180) diff = 360 - diff;

        // Check against aspects
        for (const aspect of ASPECTS) {
          const delta = Math.abs(diff - aspect.angle);

          if (delta <= ORB_MODERATE) {
            let increment = delta <= ORB_STRONG ? SCORE_STRONG : SCORE_MODERATE;
            score += increment * weight;

            if (delta <= ORB_STRONG) {
              tags.push(`${tPlanet.body}-${nPlanet.body} ${aspect.name}`);
            }
            break;
          }
        }
      }
    }

    return {
      score: Math.min(Math.round(score), 100),
      tags: [...new Set(tags)]
    };
  }

  static calculateSeries(natal: ChartSnapshot, dailyTransits: ChartSnapshot[], pillar: string = 'Overall'): DailyMomentum[] {
    const results: DailyMomentum[] = [];
    let prevScore = 50;

    for (let i = 0; i < dailyTransits.length; i++) {
      const transit = dailyTransits[i];
      const { score, tags } = this.calculateScore(natal, transit, pillar);

      let volatility: 'calm' | 'dynamic' | 'intense' = 'calm';

      const delta = Math.abs(score - prevScore);
      if (delta > 15) volatility = 'intense';
      else if (delta > 7) volatility = 'dynamic';
      else volatility = 'calm';

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

  /**
   * Finds the next major aspect hit in a range
   */
  static findNextKeyDate(natal: ChartSnapshot, startDate: Date, days: number = 30): { date: string; tag: string } | null {
    // Basic search for highest score jump or first major aspect
    // For MVP: Search for any new Conjunction or Opposition
    for (let i = 1; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      // We'd need an AstronomyEngine instance or static call here
      // For simplicity in this file, we return a mock or assume caller provides transits
      // Better: Return a high-score candidate if found in the generated series
    }
    return null;
  }
}
