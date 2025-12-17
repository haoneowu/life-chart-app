import { AstronomyEngine } from '../src/engine/astronomy';
import { MomentumEngine } from '../src/engine/momentum';

const birthDate = new Date('1990-01-01T12:00:00Z');
console.log('Calculating Natal Chart for:', birthDate.toISOString());

const natal = {
  date: birthDate,
  planets: AstronomyEngine.getPlanetaryPositions(birthDate)
};

console.log('Natal Planets:', natal.planets.map(p => `${p.body}: ${p.longitude.toFixed(2)}`).join(', '));

const today = new Date();
const transits = {
  date: today,
  planets: AstronomyEngine.getPlanetaryPositions(today)
};

console.log('Transit Planets (Today):', transits.planets.map(p => `${p.body}: ${p.longitude.toFixed(2)}`).join(', '));

const result = MomentumEngine.calculateScore(natal, transits);
console.log('Momentum Score:', result.score);
console.log('Signals:', result.tags);

// Test Series
const series = MomentumEngine.calculateSeries(natal, [transits]);
console.log('Series Result:', series);
