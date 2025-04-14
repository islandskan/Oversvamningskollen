import { Router } from 'express';
<<<<<<< HEAD
<<<<<<< HEAD
const router = Router();

=======
=======
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
import { v4 as uuidv4 } from 'uuid';
const router = Router();

let users = [
  {"id":"1",
    "name":"Thomas",
    "mail":"thomas.kronvoldt@chasacademy.se",
    "password":"hej123",
  },
  {"id":"2",
    "name":"Rebecca",
    "mail":"rebecca.lindman@chasacademy.se",
    "password":"hej123",
  },
  {"id":"3",
    "name":"Gustav",
    "mail":"gustav.thilander@chasacademy.se",
    "password":"hej123",
  },
  {"id":"4",
    "name":"Benjamin",
    "mail":"benjamin.berhane@chasacademy.se",
    "password":"hej123",
  }
];
//GET 
//list of users
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
router.get('/', (req, res) => {
<<<<<<< HEAD
  res.json({ message: 'Hämtar alla användare' });
=======
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
>>>>>>> parent of 9b202a5 (userID instead of id for users)
});

<<<<<<< HEAD
router.post('/', (req, res) => {
  const user = req.body;
=======
//POST 
//new user
router.post('/', (req, res) => {
  //create id and read body
  const user = {
<<<<<<< HEAD
    "id": uuidv4(), 
    "name":req.body.name,
    "mail": req.body.mail,
    "password":req.body.password
=======
    id: uuidv4(),
    name,
    mail,
    role,
    password
>>>>>>> parent of 9b202a5 (userID instead of id for users)
  };
<<<<<<< HEAD
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
=======
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
  res.status(201).json({ message: 'Användare skapad', user });
  users.push(user);
});

<<<<<<< HEAD
=======
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





>>>>>>> parent of 9b202a5 (userID instead of id for users)
export default router;
