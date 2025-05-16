import { Router } from 'express';
import { query } from '../db.js';


const router = Router();

// GET all sensors
router.get('/', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM sensors`);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ingen data kunde hämtas' });
    }
    res.status(200).json({ message: 'Hämtar alla sensorer', sensors: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid hämtning av sensorer', details: err.message });
  }
});


export const saveSensorData = async (req, res) => {
  const { sensorId, thresholdLevel, rateOfChangeLevel } = req.body;

  if (!sensorId) return res.status(400).json({ error: 'sensorId saknas' });

  try {
    await query(
      `INSERT INTO sensor_readings (sensor_id, threshold_level, rate_of_change_level)
       VALUES ($1, $2, $3)`,
      [sensorId, thresholdLevel, rateOfChangeLevel]
    );

    res.status(201).json({ message: 'Sensorvärden sparade' });
  } catch (err) {
    console.error('Fel vid INSERT:', err);
    res.status(500).json({ error: 'Databasfel' });
  }
};


// GET all waterlevels (historic)
router.get('/historicwaterlevels', async (req, res) => {
  try {
    // Get sensor_id from query parameter if provided
    const sensorId = req.query.sensor_id;

    let result;
    if (sensorId) {
      // If sensor_id is provided, get historic data for that sensor
      result = await query(`
        SELECT * FROM waterlevels
        WHERE sensor_id = $1
        ORDER BY measured_at DESC
      `, [sensorId]);

      res.json({
        message: `Historiska vattennivåer för sensor ${sensorId} (senaste först)`,
        sensor_id: parseInt(sensorId),
        data: result.rows
      });
    } else {
      // Otherwise, get historic data for all sensors
      result = await query(`
        SELECT * FROM waterlevels
        ORDER BY sensor_id, measured_at DESC
      `);

      res.json({
        message: 'Historiska vattennivåer för alla sensorer (grupperade per sensor, senaste först)',
        data: result.rows
      });
    }
  } catch (err) {
    res.status(500).json({ error: 'Fel vid hämtning av vattennivåer', details: err.message });
  }
});


// GET latest waterlevel for each sensor
router.get('/waterlevels', async (req, res) => {
  try {
    // This query gets the latest water level reading for each sensor
    const latestResults = await query(`
      WITH LatestWaterLevels AS (
        SELECT
          w.*,
          ROW_NUMBER() OVER (PARTITION BY sensor_id ORDER BY measured_at DESC) as rn
        FROM waterlevels w
      )
      SELECT * FROM LatestWaterLevels WHERE rn = 1
      ORDER BY sensor_id
    `);

    res.json({
      message: 'Aktuella vattennivåer för alla sensorer',
      latest_readings: latestResults.rows
    });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid hämtning av vattennivåer', details: err.message });
  }
});

// GET specific sensor + emergency contacts
router.get('/:sensorID', async (req, res) => {
  try {
    const result = await query(`SELECT * FROM sensors WHERE id = $1`, [req.params.sensorID]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sensorn hittades inte' });
    }

    const contacts = await query(`SELECT * FROM emergency_contacts WHERE sensor_id = $1`, [req.params.sensorID]);

    res.status(200).json({
      message: `Sensor + nödkontakter för sensor ${req.params.sensorID}`,
      sensor: result.rows[0],
      emergency_contacts: contacts.rows
    });
  } catch (err) {
    res.status(500).json({
      error: 'Fel vid hämtning av sensor och kontakter',
      details: err.message
    });
  }
});

// POST new sensor
router.post('/', async (req, res) => {
  const {
    battery_status,
    longitude,
    latitude,
    location_description,
    installation_date,
    sensor_failure = false,
    lost_communication = false
  } = req.body;

  if (latitude == null) {
    return res.status(400).json({ message: 'latitude är obligatoriskt' });
  }

  try {
    const result = await query(`
      INSERT INTO sensors (
        installation_date,
        battery_status,
        longitude,
        latitude,
        location_description,
        sensor_failure,
        lost_communication
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [
      installation_date || new Date(),
      battery_status,
      longitude,
      latitude,
      location_description,
      sensor_failure,
      lost_communication
    ]);

    res.status(201).json({ message: 'Sensor tillagd', sensor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid skapande av sensor', details: err.message });
  }
});

// PATCH uppdatera sensor
router.patch('/:sensorID', async (req, res) => {
  const { sensorID } = req.params;
  const fields = ['battery_status', 'longitude', 'latitude', 'location_description', 'sensor_failure', 'lost_communication'];

  const updates = Object.keys(req.body).filter(key => fields.includes(key));

  if (updates.length === 0) {
    return res.status(400).json({ message: 'Inga giltiga fält att uppdatera' });
  }

  const setClause = updates.map((field, i) => `"${field}" = $${i + 1}`).join(', ');
  const values = updates.map(field => req.body[field]);

  try {
    const result = await query(
      `UPDATE sensors SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, sensorID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sensorn hittades inte' });
    }

    res.json({ message: 'Sensorn uppdaterad', sensor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid uppdatering av sensor', details: err.message });
  }
});

// DELETE sensor
router.delete('/:sensorID', async (req, res) => {
  const { sensorID } = req.params;

  try {
    const result = await query(`DELETE FROM sensors WHERE id = $1 RETURNING *`, [sensorID]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Sensorn hittades inte' });
    }

    res.json({ message: `Tog bort en sensor med id: ${sensorID}`, sensor: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid borttagning av sensor', details: err.message });
  }
});



export default router;
