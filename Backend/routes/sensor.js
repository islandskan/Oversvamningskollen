import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import waterlevelsRouter from './waterlevels.js';
import historicwaterlevelsRouter from './historicwaterlevels.js';
import waterlevelsMockdata from '../data/mockdata/waterlevels.json' with { type: 'json' };
import sensorsMockdata from '../data/mockdata/sensors.json' with { type: 'json' };

const router = Router();

//mockdata
let sensors = sensorsMockdata;

router.get('/', (req, res) => {
  if(sensors.length === 0){
    return res.status(404).json({message: 'Ingen data kunde hämtas'});
  }
  res.status(200).json({ message: 'Hämtar alla sensorer', sensors });
});

//waterlevels for all sensors
router.get('/waterlevels', (req, res) => {
  res.json({
    message: 'Alla vattennivåer för alla sensorer',
    data: waterlevelsMockdata
  });
});

//* Waterlevels routing for specific sensor
router.use('/:sensorID/waterlevels', waterlevelsRouter);


//* Historicwaterlevels routing
router.use('/:sensorID/historicwaterlevels', historicwaterlevelsRouter);

//specific sensor
router.get('/:sensorID', (req, res) => {
  const id=req.params.sensorID;
  const sensor = sensors.find(u => u.sensorID === id);
  if(!sensor){
    return res.status(404).json({message: 'Sensorn kan inte hittas'});
  }
  res.status(200).json({ message: `Hämtar sensor: ${sensor.sensorName}`, sensor });
});

//POST 
//new sensor
router.post('/', (req, res) => {
  const sensor = req.body;
  if (!sensor.locationID || !sensor.batteryStatus) {
    return res.status(400).json({
      message: 'Sensor information is required: locationID, batteryStatus, installationDate (optional)'
    });
  }

  if (!Number.isFinite(sensor.batteryStatus) || sensor.batteryStatus < 0 || sensor.batteryStatus > 100) {
    return res.status(400).json({
      message: 'batteryStatus must be a finite number between 0 and 100'
    });
  }

  sensor.sensorID = uuidv4();
  sensor.installationDate = req.body.installationDate
    ? new Date(req.body.installationDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  
  sensors.push(sensor);
  res.status(201).json({ message: 'Sensor tillagd', sensor });
});

//PATCH or PUT or both
//edit specific sensor

//todo update battery status
//todo update with sensor whitelist and fields
const allowedUpdates = ['batteryStatus', 'installationDate', 'sensorName', 'locationID']; //* input whitelist

router.patch('/:sensorID', (req, res) => {
  const id = req.params.sensorID;
  const updates = Object.keys(req.body);
  
  // Find the invalid fields
  const invalidFields = updates.filter(key => !allowedUpdates.includes(key));

  if (invalidFields.length > 0) { //validates and sends feedback to developer
    return res.status(400).json({ 
      error: 'Ogiltiga fält i uppdateringen',
      invalidFields: invalidFields,
      validFields: allowedUpdates
    });
  }

  const sensor = sensors.find(s => s.sensorID === id);
  if (!sensor) return res.status(404).send('Sensorn hittades inte');

  Object.assign(sensor, req.body);

  res.json({ message: 'Sensorn uppdaterad', sensor });
});


//DELETE
//delete specific sensor
router.delete('/:sensorID', (req, res) => {
  const id = req.params.sensorID;

  const index = sensors.findIndex(p => p.sensorID === id);
  const sensorName = sensors[index].sensorName;

  if (index === -1) {
    return res.status(404).json({ message: 'Sensorn hittades inte'});
  }

  sensors.splice(index, 1);

  res.json({ message: `Tog bort sensor: ${sensorName} med id: ${id}`, sensors });
});



export default router;
