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
  birthDate: string;
  birthTime?: string;
  lat: number;
  lon: number;
  timeframe?: 'Day' | 'Month' | 'Year';
  pillar?: string;
}

// Helper to create natal chart from request
const getNatalChart = (birthDate: string, birthTime?: string) => {
  const birthDateTime = new Date(`${birthDate}T${birthTime || '12:00'}:00Z`);
  return {
    date: birthDateTime,
    planets: AstronomyEngine.getPlanetaryPositions(birthDateTime),
  };
};

app.post('/chart', (req, res) => {
  try {
    const { birthDate, birthTime, lat, lon, timeframe = 'Month', pillar = 'Overall' } = req.body as ChartRequest;

    if (!birthDate || lat === undefined || lon === undefined) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const natalChart: ChartSnapshot = getNatalChart(birthDate, birthTime);
    const natalInfo = MomentumEngine.getNatalMetadata(natalChart);

    // Legacy support or quick view
    const transits: ChartSnapshot[] = [];
    const now = new Date();

    if (timeframe === 'Year') {
      for (let i = -20; i <= 10; i++) {
        const d = new Date(now.getFullYear() + i, 0, 1);
        transits.push({ date: d, planets: AstronomyEngine.getPlanetaryPositions(d) });
      }
    } else if (timeframe === 'Month') {
      for (let i = -24; i <= 12; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
        transits.push({ date: d, planets: AstronomyEngine.getPlanetaryPositions(d) });
      }
    } else {
      for (let i = -30; i <= 30; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
        transits.push({ date: d, planets: AstronomyEngine.getPlanetaryPositions(d) });
      }
    }

    const momentumSeries = MomentumEngine.calculateSeries(natalChart, transits, timeframe, pillar);

    res.json({
      momentumSeries,
      natalInfo
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NEW: Anchor endpoint
app.post('/chart/anchors', (req, res) => {
  try {
    const { birthDate, birthTime, lat, lon } = req.body as any;
    if (!birthDate) return res.status(400).json({ error: 'Missing birthDate' });

    const natalChart: ChartSnapshot = getNatalChart(birthDate, birthTime);
    const startYear = new Date(birthDate).getFullYear();
    const anchors = MomentumEngine.generateAnchors(natalChart, startYear);
    const natalInfo = MomentumEngine.getNatalMetadata(natalChart);

    res.json({
      ...anchors,
      natalInfo
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NEW: Days expansion endpoint
app.post('/chart/days', (req, res) => {
  try {
    const { birthDate, birthTime, month, pillar = 'Overall' } = req.body as any;
    if (!birthDate || !month) return res.status(400).json({ error: 'Missing parameters' });

    const natalChart: ChartSnapshot = getNatalChart(birthDate, birthTime);
    const [year, m] = month.split('-').map(Number);

    // Calculate the anchor score for this specific month first
    const monthDate = new Date(year, m - 1, 1);
    const monthTransit = { date: monthDate, planets: AstronomyEngine.getPlanetaryPositions(monthDate) };
    const { score: targetScore } = MomentumEngine.calculateScore(natalChart, monthTransit, pillar);

    const transits: ChartSnapshot[] = [];
    // Generate days for current month specifically (compliant with normalization logic)
    const daysInMonth = new Date(year, m, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, m - 1, d);
      transits.push({ date, planets: AstronomyEngine.getPlanetaryPositions(date) });
    }

    const days = MomentumEngine.calculateSeries(natalChart, transits, 'Day', pillar, targetScore);

    res.json({
      month,
      days,
      meta: { algo_version: '1.3', targetScore }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// NEW: Panel interpretation endpoint
app.post('/api/panel', (req, res) => {
  try {
    const { birthDate, birthTime, timeframe = 'Month', pillar = 'Overall', id } = req.body as any;
    if (!birthDate || !id) return res.status(400).json({ error: 'Missing parameters' });

    const natalChart: ChartSnapshot = getNatalChart(birthDate, birthTime);

    // Parse ID (YYYY-MM-DD or YYYY-MM)
    const date = new Date(id.includes('-') && id.split('-').length === 2 ? `${id}-01` : id);
    const transit = { date, planets: AstronomyEngine.getPlanetaryPositions(date) };

    const panel = MomentumEngine.generatePanelData(natalChart, transit, pillar, timeframe);
    const { score } = MomentumEngine.calculateScore(natalChart, transit, pillar);

    res.json({
      user_id: "temp_user",
      algo_version: "v0.9.7",
      timeframe: timeframe.toLowerCase(),
      pillar: pillar.toLowerCase(),
      anchor: {
        type: timeframe.toLowerCase(),
        id,
        score: Math.min(100, Math.max(0, score)),
        score_label: "Momentum Score (0–100)"
      },
      panel,
      meta: {
        generated_at: new Date().toISOString(),
        cache_ttl_seconds: 86400
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});