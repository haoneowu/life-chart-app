import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AstronomyEngine, ChartSnapshot } from './engine/astronomy';
import { MomentumEngine } from './engine/momentum';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Life Chart API is running');
});

interface ChartRequest {
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm
  lat: number;
  lon: number;
  startDate?: string; // Defaults to today - 45 days
  days?: number; // Defaults to 90
  pillar?: string; // Overall, Career, etc.
}

app.post('/chart', (req, res) => {
  try {
    const { birthDate, birthTime, lat, lon, startDate, days = 90, pillar = 'Overall' } = req.body as ChartRequest;

    if (!birthDate || lat === undefined || lon === undefined) {
      res.status(400).json({ error: 'Missing required fields: birthDate, lat, lon' });
      return;
    }

    // Parse Birth Date
    // Note: birthTime default 12:00 if missing
    const timeStr = birthTime || '12:00';
    const birthDateTime = new Date(`${birthDate}T${timeStr}:00Z`); // Treating input as UTC for simplicity

    const natalChart: ChartSnapshot = {
      date: birthDateTime,
      planets: AstronomyEngine.getPlanetaryPositions(birthDateTime),
    };

    // Determine Range
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) {
      start.setDate(start.getDate() - 45); // Default to centered on today
    }

    const dailyTransits: ChartSnapshot[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      dailyTransits.push({
        date: d,
        planets: AstronomyEngine.getPlanetaryPositions(d)
      });
    }

    const momentumSeries = MomentumEngine.calculateSeries(natalChart, dailyTransits, pillar);

    res.json(momentumSeries);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});