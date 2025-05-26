import db from './db.js';
import { pushNotifier } from './notify.js';

export async function rateOfChangeNotify(sensorId) {
  try {
    const { rows } = await db.query(
      `SELECT rate_of_change 
       FROM waterlevels 
       WHERE sensor_id = $1 
       ORDER BY measured_at DESC 
       LIMIT 2`,
      [sensorId]
    );

    const alertCondition = rows.length === 2 && rows.every(r => r.rate_of_change === 3);
    if (!alertCondition) return;

    const result = await db.query(
      `SELECT location_description FROM sensors WHERE id = $1`,
      [sensorId]
    );

    const location = result.rows[0]?.location_description || 'okänd plats';
    const message = `Varning: Snabb ökning i vattennivå vid ${location}`;

    await pushNotifier(message);

  } catch (error) {
    console.error('Fel vid broadcast-avisering:', error);
  }
}
