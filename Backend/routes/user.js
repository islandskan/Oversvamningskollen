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
  res.json({ message: 'Hämtar alla användare' });
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
    "id": uuidv4(), 
    "name":req.body.name,
    "mail": req.body.mail,
    "password":req.body.password
  };
<<<<<<< HEAD
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
=======
>>>>>>> parent of ef5bc41 (user validation moved to validateRole.js middleware)
  res.status(201).json({ message: 'Användare skapad', user });
  users.push(user);
});

export default router;
