import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
let sensors = [
  {
    "sensorID":"1", //PK
    "batteryStatus":"80",
    "locationID":"Malmö1", //FK
  },
  {
    "sensorID":"2",
  },
  {
    "sensorID":"3",
  }
];

router.get('/', (req, res) => {
  if(sensors.length === 0){
    return res.status(404).json({message: 'Ingen data kunde hämtas'});
  }
  res.status(200).json({ message: 'Hämtar alla sensorer', sensors });
}); 

//specific sensor
router.get('/:sensorID', (req, res) => {
  const id=req.params.id;
  const user = users.find(u => u.id === id);
  if(!user){
    return res.status(404).json({message: 'Sensoren kan inte hittas'});
  }
  res.status(200).json({ message: 'Hämtar en Sensoren', user });
});

//POST 
//new sensor
router.post('/', (req, res) => {
  //create id and read body
  const sensor = req.body;
  // Här kan man lägga till logik för att spara i databas eller lista
  res.status(201).json({ message: 'Sensor tillagd', sensor });
});

//PATCH or PUT or both
//edit specific sensor

//todo update battery status
//todo update with sensor whitelist and fields
const allowedUpdates = ['name', 'mail', 'password']; //* input whitelist

router.patch('/:sensorID', (req, res) => {
  const id = req.params.sensorID;
  const updates = Object.keys(req.body);
  
  // Find the invalid fields
  const invalidFields = updates.filter(key => !allowedUpdates.includes(key));

  if (invalidFields.length > 0) { //validates and sends feedback to developer
    return res.status(400).json({ 
      error: 'Ogiltiga fält i uppdateringen',
      invalidFields: invalidFields 
    });
  }

  const sensor = sensors.find(s => s.id === id);
  if (!user) return res.status(404).send('Sensorn hittades inte');

  Object.assign(user, req.body);

  res.json({ message: 'Sensorn uppdaterad', sensor });
});




//DELETE
//delete specific sensor
router.delete('/:sensorID', (req, res) => {
  const id = req.params.sensorID;

  const index = sensors.findIndex(p => p.sensorID === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Sensorn hittades inte'});
  }

  sensors.splice(index, 1);

  res.json({ message: `Tog bort en sensor med id: ${id}`, sensors });
});



export default router;
