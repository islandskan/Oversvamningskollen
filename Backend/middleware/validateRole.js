// middleware/validateRole.js

const roles = ['admin', 'user'];

export function validateRole(req, res, next) {
  const { role } = req.body;

  if (!roles.includes(role)) {
    return res.status(400).json({ 
      error: `Ogiltig roll. Rollen måste vara en av: ${roles.join(', ')}`
    });
  }

  next(); // role is valid, continue
}