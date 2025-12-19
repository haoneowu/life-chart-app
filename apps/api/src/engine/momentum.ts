import { ChartSnapshot, PlanetPosition } from './astronomy';

export interface MomentumPoint {
  date: string; // YYYY-MM-DD or YYYY-MM or YYYY
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

  static calculateSeries(
    natal: ChartSnapshot,
    transits: ChartSnapshot[],
    timeframe: 'Day' | 'Month' | 'Year' = 'Month',
    pillar: string = 'Overall',
    targetScore?: number
  ): MomentumPoint[] {
    const results: MomentumPoint[] = [];
    let prevScore = 50;
    let sumScore = 0;

    // Deterministic Pseudo-random Generator for Day noise
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // First pass: generate base scores with noise
    for (const transit of transits) {
      let { score, tags } = this.calculateScore(natal, transit, pillar);

      if (timeframe === 'Day') {
        const dateStr = transit.date.toISOString().split('T')[0];
        const monthSeedStr = dateStr.slice(0, 7);
        let monthSeed = 0;
        for (let i = 0; i < monthSeedStr.length; i++) monthSeed += monthSeedStr.charCodeAt(i);

        const daySeed = parseInt(dateStr.slice(8, 10));
        const noise = (seededRandom(monthSeed + daySeed) - 0.5) * 8; // +/- 4 points noise
        score = Math.min(100, Math.max(0, score + noise));
      }

      sumScore += score;
      results.push({
        date: '', // placeholder
        score,
        volatility: 'calm', // placeholder
        signal_tags: tags
      });
    }

    // Normalization pass if targetScore is provided
    if (targetScore !== undefined && results.length > 0) {
      const actualAvg = sumScore / results.length;
      const offset = targetScore - actualAvg;

      for (const res of results) {
        res.score = Math.min(100, Math.max(0, Math.round(res.score + offset)));
      }
    }

    // Final pass: set dates and volatility
    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const transit = transits[i];

      let volatility: 'calm' | 'dynamic' | 'intense' = 'calm';
      const delta = Math.abs(res.score - prevScore);
      if (delta > 15) volatility = 'intense';
      else if (delta > 7) volatility = 'dynamic';
      else volatility = 'calm';

      const dateStr = timeframe === 'Year'
        ? `${transit.date.toISOString().slice(0, 4)}-01-01`
        : timeframe === 'Month'
          ? `${transit.date.toISOString().slice(0, 7)}-01`
          : transit.date.toISOString().split('T')[0];

      res.date = dateStr;
      res.volatility = volatility;
      prevScore = res.score;
    }

    return results;
  }

  static generateAnchors(natal: ChartSnapshot, startYear: number): { years: Record<string, MomentumPoint[]>, months: Record<string, MomentumPoint[]> } {
    const pillars = Object.keys(PILLAR_WEIGHTS);
    const years: Record<string, MomentumPoint[]> = {};
    const months: Record<string, MomentumPoint[]> = {};

    const yearTransits: ChartSnapshot[] = [];
    const monthTransits: ChartSnapshot[] = [];

    // Pre-calculate transits for 100 years
    for (let y = 0; y < 100; y++) {
      const yearDate = new Date(startYear + y, 0, 1);
      const { AstronomyEngine } = require('./astronomy'); // Avoiding circular if needed, but here it is fine
      yearTransits.push({ date: yearDate, planets: AstronomyEngine.getPlanetaryPositions(yearDate) });

      for (let m = 0; m < 12; m++) {
        const monthDate = new Date(startYear + y, m, 1);
        monthTransits.push({ date: monthDate, planets: AstronomyEngine.getPlanetaryPositions(monthDate) });
      }
    }

    for (const pillar of pillars) {
      years[pillar] = this.calculateSeries(natal, yearTransits, 'Year', pillar);
      months[pillar] = this.calculateSeries(natal, monthTransits, 'Month', pillar);
    }

    return { years, months };
  }

  static generatePanelData(natal: ChartSnapshot, transit: ChartSnapshot, pillar: string, timeframe: string) {
    const { score, tags } = this.calculateScore(natal, transit, pillar);

    // Dynamic driver extraction
    const why = tags.slice(0, 2).map(tag => {
      const parts = tag.split(' ');
      const [p1, p2] = parts[0].split('-');
      return {
        driver: `${p1} focus`,
        evidence: tag,
        impact: `${p1}'s alignment with your natal ${p2} is the primary driver for this ${timeframe.toLowerCase()}'s ${pillar.toLowerCase()} momentum.`,
        confidence: 0.85
      };
    });

    // Content Pools for Segmented Advice
    const advicePool: Record<string, Record<string, string>> = {
      work: {
        Overall: "Align your professional output with current peak energy.",
        Career: "Submit proposals or request performance reviews now—execution is your primary lever.",
        Money: "Negotiate contracts or review business overhead for better efficiency.",
        Relationships: "Professional partnerships favor clear communication and objective setting.",
        Energy: "Take initiative on a complex backlog project while stamina is high."
      },
      money: {
        Overall: "Financial decisions made now have long-term stability implications.",
        Career: "Expect recognition that may lead to future gain; keep detailed records.",
        Money: "Ideal window for high-value purchases or reviewing long-term investments.",
        Relationships: "Discussions about joint ventures or shared resources are favored.",
        Energy: "Avoid impulsive spending to manage energy leaks and maintain focus."
      },
      relationship: {
        Overall: "Social harmony is high; ideal for networking and soft influence.",
        Career: "Colleague relations are stable; leverage them for project support.",
        Money: "Financial transparency with partners brings clarity to your connections.",
        Relationships: "Plan a meaningful discussion to resolve lingering tension or deepen trust.",
        Energy: "Direct your energy towards collaborative efforts rather than solo ventures."
      },
      health: {
        Overall: "Vitality is steady; maintain your current routine for consistency.",
        Career: "Physical stamina supports long working hours; don't skip recovery.",
        Money: "Invest in wellness to improve your long-term cognitive productivity.",
        Relationships: "Emotional health is key to relationship resilience during this period.",
        Energy: "Peak physical window for starting a new fitness regime or detoxification."
      }
    };

    const pillarTraits: Record<string, string> = {
      Overview: "general themes and holistic momentum",
      Career: "execution, visibility, and professional growth",
      Money: "value, resource allocation, and static stability",
      Relationships: "connection, boundaries, and interpersonal harmony",
      Energy: "vitality, action, and internal drive"
    };

    const howDo = [
      { domain: 'work', text: advicePool.work[pillar] || advicePool.work.Overall },
      { domain: 'money', text: advicePool.money[pillar] || advicePool.money.Overall },
      { domain: 'relationship', text: advicePool.relationship[pillar] || advicePool.relationship.Overall },
      { domain: 'health', text: advicePool.health[pillar] || advicePool.health.Overall }
    ];

    const howAvoid = [
      { domain: pillar.toLowerCase(), text: `Avoid ${score < 40 ? 'making major commitments' : 'overcomplicating signals'} while ${pillar.toLowerCase()} momentum is ${score < 50 ? 'settling' : 'maturing'}.` },
      { domain: 'overall', text: "Do not let temporary signal noise distract you from the long-term trend line." }
    ];

    const pillarThemes: Record<string, string[]> = {
      Overall: ['integration', 'pattern', 'holistic'],
      Career: ['visibility', 'ambition', 'authority'],
      Money: ['utility', 'valuation', 'security'],
      Relationships: ['attunement', 'reconciliation', 'trust'],
      Energy: ['stamina', 'instinct', 'autonomy']
    };

    const summaryPart2 = score > 60
      ? `This is a high-conviction window to prioritize ${pillarTraits[pillar] || pillarTraits.Overview}.`
      : `This period calls for recalibration and focus on ${pillarTraits[pillar] || pillarTraits.Overview}.`;

    return {
      overview: {
        title: `${pillar} Momentum is ${score > 70 ? 'ascending' : score > 40 ? 'stabilizing' : 'recalibrating'}`,
        summary: `The ${timeframe.toLowerCase()} arc for your ${pillar.toLowerCase()} reveals a ${score > 50 ? 'constructive' : 'challenging'} momentum. ${summaryPart2}`
      },
      why,
      what: {
        themes: pillarThemes[pillar] || pillarThemes.Overall,
        keywords: tags.map(t => t.split(' ')[0]).slice(0, 6)
      },
      how: {
        do: howDo,
        avoid: howAvoid
      }
    };
  }

  static getNatalMetadata(natal: ChartSnapshot) {
    const sun = natal.planets.find(p => p.body === 'Sun');
    return {
      sunSign: sun?.sign || 'Unknown',
      planets: natal.planets.map(p => ({
        planet: p.body,
        sign: p.sign,
        degree: `${Math.floor(p.longitude % 30)}°${Math.floor(((p.longitude % 30) % 1) * 60)}'`,
        house: Math.floor((p.longitude / 30) % 12) + 1, // Mock house calculation
      })),
      interpretation: "Your chart reveals a unique pattern of momentum, driven by your natal planetary alignments."
    };
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
