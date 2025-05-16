import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servern kör på http://localhost:${PORT}`);
  console.log('Ansluten till DB:', process.env.PG_URI);
});
