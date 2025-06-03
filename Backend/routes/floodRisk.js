import { Router } from 'express';
import { query } from '../db.js'; 

const router = Router();

// Trying to get the latest water level and calculate the rate of chang
router.get('/flood-risk', async (req, res) => {
  try {
    const result = await query(`
      SELECT date, waterlevel
      FROM waterlevels
      ORDER BY date DESC
      LIMIT 2
    `);

    if (result.rows.length < 2) {
      return res.status(400).json({ message: 'Inte tillräckligt med mätningar' });
    }

    const [latest, previous] = result.rows;

    const deltaLevel = latest.waterlevel - previous.waterlevel;
    const deltaTimeHours = (new Date(latest.date) - new Date(previous.date)) / (1000 * 60 * 60);
    const rateOfChange = deltaLevel / deltaTimeHours;

    // Call the function to calculate flood probability and pass the rate of change to it
    const floodProbability = calculateFloodProbability(rateOfChange);

    res.json({
      rateOfChange: rateOfChange.toFixed(3),
      floodProbability: floodProbability.toFixed(1) + '%',
      latestMeasurement: latest,
      previousMeasurement: previous
    });

  } catch (err) {
    console.error('Fel vid RoC-riskbedömning:', err);
    res.status(500).json({ error: 'Serverfel' });
  }
});

// Probability calculation function
// The function uses a piecewise linear function to determine the flood probability
function calculateFloodProbability(rateOfChange) {
  if (rateOfChange < 0.05) return 5;
  if (rateOfChange >= 0.05 && rateOfChange < 0.15) {
    return 5 + ((rateOfChange - 0.05) / 0.10) * 25;
  }
  if (rateOfChange >= 0.15 && rateOfChange < 0.3) {
    return 30 + ((rateOfChange - 0.15) / 0.15) * 40;
  }
  return Math.min(100, 70 + ((rateOfChange - 0.3) / 0.2) * 30);
}
