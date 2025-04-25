import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
const router = Router();

let users = [
  {"id":"1",
    "userName":"Thomas",
    "mail":"thomas.kronvoldt@chasacademy.se",
    "role":"admin",
    "password":"hej123",
  },
  {"id":"2",
    "userName":"Rebecca",
    "mail":"rebecca.lindman@chasacademy.se",
    "role":"admin",
    "password":"hej123",
  },
  {"id":"3",
    "userName":"Gustav",
    "mail":"gustav.thilander@chasacademy.se",
    "role":"admin",
    "password":"hej123",
  },
  {"id":"4",
    "userName":"Benjamin",
    "mail":"benjamin.berhane@chasacademy.se",
    "role":"admin",
    "password":"hej123",
  }
];
//GET 
//list of users
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
  const { userName, mail, role, password } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!userName) missingFields.push('userName');
  if (!mail) missingFields.push('mail');
  if (!role) missingFields.push('role');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `Alla fält måste vara ifyllda, saknar ${missingFields.join(', ')}` });
  }

  const user = {
    id: uuidv4(),
    userName,
    mail,
    role,
    password
  };

  users.push(user);

  res.status(201).json({ message: 'Användare skapad', user });
});


//PATCH or PUT or both
//edit specific user
//* This approach is cleaner and requires control, whitelist 'allowedUpdates'
const allowedUpdates = ['userName', 'mail', 'password']; //* input whitelist

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
