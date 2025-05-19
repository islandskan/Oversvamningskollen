router.get('/flood-risk', async (req, res) => {
  try {
    const result = await query(`
      SELECT date, waterlevel
      FROM water_levels
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

    // Anropa sannolikhetsfunktionen
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

// Sannolikhetsfunktion
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
