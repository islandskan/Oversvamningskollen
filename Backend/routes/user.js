import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import usersMockdata from '../data/mockdata/users.json' with { type: 'json' };
const router = Router();

let users = usersMockdata;
//GET 
//list of users
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Get all users from the system
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hämtar alla användare
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1
 *                       userName:
 *                         type: string
 *                         example: Thomas
 *                       mail:
 *                         type: string
 *                         example: thomas.kronvoldt@chasacademy.se
 *                       role:
 *                         type: string
 *                         example: admin
 */
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
/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Add a new user to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 example: JohnDoe
 *               mail:
 *                 type: string
 *                 example: john.doe@example.com
 *               role:
 *                 type: string
 *                 example: user
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Användare skapad
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123e4567-e89b-12d3-a456-426614174000
 *                     userName:
 *                       type: string
 *                       example: JohnDoe
 *                     mail:
 *                       type: string
 *                       example: john.doe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 */
router.post('/', (req, res) => {
  const { userName, mail, role, password } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!userName) missingFields.push('userName');
  if (!mail) missingFields.push('mail');
  if (!role) missingFields.push('role');
  if (!password) missingFields.push('password');

  if (missingFields.length > 0) {
    return res.status(400).json({ message: `All fields must be provided, missing fields: ${missingFields.join(', ')}` });
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


//PATCH 
//edit specific user
const allowedUpdates = ['userName', 'mail', 'password']; //* input whitelist

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update a user's data
 *     description: Edit user details such as username, email, and password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               mail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid fields in the update
 *       404:
 *         description: User not found
 */
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
