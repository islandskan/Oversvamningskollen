import { Router } from 'express';
import historicwaterlevelsMockdata from '../data/mockdata/historicwaterlevels.json' assert { type: 'json' };

const router = Router({ mergeParams: true });

router.get('/', (req, res) => {
    res.send('historicwaterlevels');
});

// Filter historic waterlevels for _specific_ sensor by date
/* router.get('/?from=:from&to=:to', (req, res) => {
    const { sensorID } = req.params;
    const { from, to } = req.query;
    const sensorData = historicwaterlevelsMockdata.find(sensor => sensor.sensorID === sensorID);
  
    if (!sensorData) {
      return res.status(404).json({ error: `Sensor with ID ${sensorID} not found.` });
    }
  
    const filteredMeasurements = sensorData.measurements.filter(measurement => {
      const measurementDate = new Date(`${measurement.date}T${measurement.time}`);
      return measurementDate >= new Date(from) && measurementDate <= new Date(to);
    });
  
    res.json({
      sensorID: sensorData.sensorID,
      measurements: filteredMeasurements
    });
  });

export default router;
 */