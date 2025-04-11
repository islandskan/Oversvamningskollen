import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
let sensors = [
  {
    "id":"1",
  },
  {
    "id":"2",
  },
  {
    "id":"3",
  }
]

router.get('/', (req, res) => {
  if(users.length === 0){
    return res.status(404).json({message: 'Inga användare kunde hämtas'});
  }
  res.status(200).json({ message: 'Hämtar alla användare', users });
}); 

//specific user
router.get('/:id', (req, res) => {
  const id=req.params.id;
  const user = users.find(u => u.id === id);
  if(!user){
    return res.status(404).json({message: 'Användare kan inte hittas'});
  }
  res.status(200).json({ message: 'Hämtar en användare', user });
});

//POST 
//new user
router.post('/', (req, res) => {
  //create id and read body
  const user = {
    "id": uuidv4(), 
    "name":req.body.name,
    "mail": req.body.mail,
    "password":req.body.password
  };
  res.status(201).json({ message: 'Användare skapad', user });
  users.push(user);
});

//PATCH or PUT or both
//edit specific user
//* This approach is cleaner and requires control, whitelist 'allowedUpdates'
const allowedUpdates = ['name', 'mail', 'password']; //* input whitelist

router.patch('/:id', (req, res) => {
  const id = req.params.id;
  const updates = Object.keys(req.body);
  
  // Find the invalid fields
  const invalidFields = updates.filter(key => !allowedUpdates.includes(key));

  if (invalidFields.length > 0) { //validates and sends feedback to developer
    return res.status(400).json({ 
      error: 'Ogiltiga fält i uppdateringen',
      invalidFields: invalidFields 
    });
  }

  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send('Användaren hittades inte');

  Object.assign(user, req.body);

  res.json({ message: 'Användare uppdaterad', user });
});


//DELETE
//delete specific user
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  const index = users.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Användare hittades inte'});
  }

  users.splice(index, 1);

  res.json({ message: `Tog bort en användare med id: ${id}`, users });
});



export default router;
