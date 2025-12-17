const { AstronomyEngine } = require('./dist/engine/astronomy');
console.log('Engine loaded');
try {
  const pos = AstronomyEngine.getPlanetaryPositions(new Date());
  console.log('Positions calculated', pos);
} catch (e) {
  console.error(e);
}
