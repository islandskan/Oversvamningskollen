import express from 'express';
import extractSensorFlags from '../middleware/bitflagDecoder/extractSensorFlags.js';
import { query } from '../db.js';

const router = express.Router();

const extractNumericId = (id) => {
  const match = id.match(/\d+$/);
  return match ? parseInt(match[0], 10) : null;
};

async function fetchAndStoreSensorData() {
  try {
    const response = await fetch('http://134.255.219.209:3000/api/get', {
      headers: {
        Authorization: `Bearer TEST_KEY`
      }
    });
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const content = await response.json();

    for (const [sensorId, data] of Object.entries(content)) {
      const numericSensorId = extractNumericId(sensorId);
      if (!numericSensorId) {
        console.warn(`Kunde inte extrahera numeriskt ID från ${sensorId}. Skipping.`);
        continue;
      }

      const bitField = data.value;

      const {
        thresholdLevel,
        rateOfChangeLevel,
        batteryLevel,
        sensorFailure,
        lostCommunication
      } = extractSensorFlags(bitField);

      const measuredAt =
        typeof data.timestamp === 'number'
          ? new Date(data.timestamp)
          : new Date(); // fallback till nu om timestamp saknas

      await query(
        `INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at)
         VALUES ($1, $2, $3, $4)`,
        [numericSensorId, thresholdLevel, rateOfChangeLevel, measuredAt]
      );

      await query(
        `UPDATE sensors
         SET battery_status = $1,
             sensor_failure = $2,
             lost_communication = $3
         WHERE id = $4`,
        [batteryLevel, sensorFailure, lostCommunication, numericSensorId]
      );

      console.log(`Sensor ${sensorId} (ID: ${numericSensorId}) importerad.`);
    }
  } catch (err) {
    console.error("Fel vid import av sensordata:", err.message);
    throw err;
  }
}

// Cron route
router.get('/cron', async (req, res) => {
  const authHeader = req.headers.authorization || '';
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).send('Unauthorized');
  }

  try {
    await fetchAndStoreSensorData();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
