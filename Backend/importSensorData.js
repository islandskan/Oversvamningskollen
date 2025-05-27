import fetch from 'node-fetch'; // OBS! Installera via `npm install node-fetch`
import extractSensorFlags from "./middleware/bitflagDecoder/extractSensorFlags.js";
import { query } from './db.js';

const fetchAndStoreSensorData = async () => {
  try {
    const response = await fetch('http:/oversvamningskollen.vercel.app/api/sensors/get'); // Ändra till din VPS om nödvändigt
    if (!response.ok) throw new Error(`HTTP-fel: ${response.status}`);

    const content = await response.json();

    for (const [sensorId, bitField] of Object.entries(content)) {
      const {
        thresholdLevel,
        rateOfChangeLevel,
        batteryLevel,
        sensorFailure,
        lostCommunication
      } = extractSensorFlags(bitField);

      // Spara i databasen
      await query(
        `INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at)
         VALUES ($1, $2, $3, NOW())`,
        [sensorId, thresholdLevel, rateOfChangeLevel]
      );

      await query(
        `UPDATE sensors 
         SET battery_status = $1, 
             sensor_failure = $2, 
             lost_communication = $3
         WHERE id = $4`,
        [batteryLevel, sensorFailure, lostCommunication, sensorId]
      );

      console.log(`✅ Sensor ${sensorId} importerad.`);
    }
  } catch (err) {
    console.error("❌ Fel vid import av sensordata:", err.message);
  }
};

// Kör varje 5:e minut
setInterval(fetchAndStoreSensorData, 5 * 60 * 1000);

// Kör första direkt vid start
fetchAndStoreSensorData();
