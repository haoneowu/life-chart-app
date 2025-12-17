import { Body, Ecliptic, GeoVector, SunPosition } from 'astronomy-engine';

export const PLANETS = [
  Body.Sun,
  Body.Moon,
  Body.Mercury,
  Body.Venus,
  Body.Mars,
  Body.Jupiter,
  Body.Saturn,
];

export interface PlanetPosition {
  body: Body;
  longitude: number; // Geocentric Ecliptic longitude in degrees
}

export interface ChartSnapshot {
  date: Date;
  planets: PlanetPosition[];
}

export class AstronomyEngine {
  static getPlanetaryPositions(date: Date): PlanetPosition[] {
    return PLANETS.map(body => {
      let longitude: number;
      if (body === Body.Sun) {
        longitude = SunPosition(date).elon;
      } else {
        const vec = GeoVector(body, date, true); // true for aberration correction? default is usually fine
        longitude = Ecliptic(vec).elon;
      }
      return { body, longitude };
    });
  }
}