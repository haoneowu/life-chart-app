import { Body, Ecliptic, GeoVector, SunPosition } from 'astronomy-engine';

export const PLANETS = [
  Body.Sun,
  Body.Moon,
  Body.Mercury,
  Body.Venus,
  Body.Mars,
  Body.Jupiter,
  Body.Saturn,
  Body.Uranus,
  Body.Neptune,
  Body.Pluto,
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export interface PlanetPosition {
  body: Body;
  longitude: number; // Geocentric Ecliptic longitude in degrees
  sign: string;
}

export interface ChartSnapshot {
  date: Date;
  planets: PlanetPosition[];
}

export class AstronomyEngine {
  static getZodiacSign(longitude: number): string {
    const index = Math.floor(longitude / 30) % 12;
    return ZODIAC_SIGNS[index];
  }

  static getPlanetaryPositions(date: Date): PlanetPosition[] {
    return PLANETS.map(body => {
      let longitude: number;
      if (body === Body.Sun) {
        longitude = SunPosition(date).elon;
      } else {
        const vec = GeoVector(body, date, true);
        longitude = Ecliptic(vec).elon;
      }
      return {
        body,
        longitude,
        sign: this.getZodiacSign(longitude)
      };
    });
  }
}