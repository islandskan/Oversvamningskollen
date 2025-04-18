import { Router } from 'express';
import waterlevelsMock from '../mockdata/waterlevelsMock.js';

const router = Router();

//* mockdata
//*keys
//measurementID
//sensorID
//waterlevel
//date
//time
//*

const waterlevelsMockdata = waterlevelsMock;


router.get('/', (req, res) => {
    res.send('All waterlevels:', JSON.parse(waterlevelsMockdata));
});

export default router;