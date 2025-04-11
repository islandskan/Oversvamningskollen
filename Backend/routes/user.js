import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = Router();

let user = [];
//GET 
//list of users
router.get('/', (req, res) => {
  res.json({ message: 'Hämtar alla användare' });
}); 

//specific user
router.get('/:id', (req, res) => {
  res.json({ message: 'Hämtar en användare' });
});

//POST 
//new user
router.post('/', (req, res) => {
  const user = req.body;
  //skapa id
  res.status(201).json({ message: 'Användare skapad', user });
});

//PATCH eller PUT eller båda
//edit specific user
router.put('/:id', (req, res) => {
  res.json({ message: 'Ändrar info' });
});

//DELETE
//delete specific user
router.delete('/:id', (req, res) => {
  res.json({ message: 'Tar bort en användare' });
}); //todo test delete





export default router;
