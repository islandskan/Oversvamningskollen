import { NextResponse } from 'next/server';
import extractSensorFlags from "../../../middleware/bitflagDecoder/extractSensorFlags.js";
import { query } from '../../../db.js';

// Your existing fetchAndStoreSensorData logic, modified to be called inside the GET handler
async function fetchAndStoreSensorData() {
  try {
    const response = await fetch('http://oversvamningskollen.vercel.app/api/sensors/get');
    if (!response.ok) throw new Error(`HTTP-fel: ${response.status}`);
    const content = await response.json();

    for (const [sensorId, bitField] of Object.entries(content)) {
      const numericSensorId = extractNumericId(sensorId);
      if (!numericSensorId) {
        console.warn(`Kunde inte extrahera numeriskt ID från ${sensorId}. Skipping.`);
        continue;
      }

      const {
        thresholdLevel,
        rateOfChangeLevel,
        batteryLevel,
        sensorFailure,
        lostCommunication
      } = extractSensorFlags(bitField);

      await query(
        `INSERT INTO waterlevels (sensor_id, waterlevel, rate_of_change, measured_at)
         VALUES ($1, $2, $3, NOW())`,
        [numericSensorId, thresholdLevel, rateOfChangeLevel]
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
    throw err;  // Re-throw so caller knows it failed
  }
}

const extractNumericId = (id) => {
  const match = id.match(/\d+$/);
  return match ? parseInt(match[0], 10) : null;
};

export async function GET(req) {
  // Check authorization header for secret
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await fetchAndStoreSensorData();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return new Response(`Failed: ${error.message}`, { status: 500 });
  }
}
