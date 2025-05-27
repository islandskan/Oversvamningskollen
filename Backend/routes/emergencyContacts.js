import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

//? Vet inte om denna behövs
// GET all contacts
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM emergency_contacts');
    res.status(200).json({ message: 'Alla nödkontakter', contacts: result.rows });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid hämtning av kontakter', details: err.message });
  }
});

// POST new contact
router.post('/', async (req, res) => {
  const { sensor_id, name, phone_number } = req.body;

  if (!sensor_id || !name || !phone_number) {
    return res.status(400).json({ message: 'Alla fält (även sensor_id) är obligatoriska' });
  }

  try {
    const result = await query(
      `INSERT INTO emergency_contacts (sensor_id, name, phone_number)
       VALUES ($1, $2, $3) RETURNING *`,
      [sensor_id, name, phone_number]
    );

    res.status(201).json({ message: 'Kontakt tillagd', contact: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid skapande av kontakt', details: err.message });
  }
});

//PATCH contact
router.patch('/:contactID', async (req, res) => {
  const { contactID } = req.params;
  const allowedFields = ['name', 'phone_number'];
  const updates = Object.keys(req.body).filter(key => allowedFields.includes(key));

  if (updates.length === 0) {
    return res.status(400).json({ message: 'Inga giltiga fält att uppdatera' });
  }

  const setClause = updates.map((field, index) => `${field} = $${index + 1}`).join(', ');
  const values = updates.map(field => req.body[field]);

  try {
    const result = await query(
      `UPDATE emergency_contacts SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
      [...values, contactID]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kontakten hittades inte' });
    }

    res.json({ message: 'Kontakt uppdaterad', contact: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Fel vid uppdatering av kontakt', details: err.message });
  }
});

// DELETE contact
router.delete('/:contactID', async (req, res) => {
  const contactID = req.params.contactID;
  try {
    const result = await query('DELETE FROM emergency_contacts WHERE id = $1 RETURNING *', [contactID]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Kontakt hittades inte' });
    }
    res.status(200).json({ message: `Tog bort kontakt med id: ${contactID}`, contact: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Fel vid radering av kontakt', error: err.message });
  }
});


export default router;
