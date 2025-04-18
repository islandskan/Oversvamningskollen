import { Router } from 'express';
import waterlevelsMockdata from '../data/mockdata/waterlevels.json' assert { type: 'json' };

const router = Router({ mergeParams: true });

// GET all waterlevels for _specific_ sensor
router.get('/', (req, res) => {
  const { sensorID } = req.params;
  const sensorData = waterlevelsMockdata.find(sensor => sensor.sensorID === sensorID);

  if (!sensorData) {
    return res.status(404).json({ error: `Sensor with ID ${sensorID} not found.` });
  }

  res.json({
    sensorID: sensorData.sensorID,
    measurements: sensorData.measurements || []
  });
});

export default router;