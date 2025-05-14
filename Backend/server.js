// server.js
import app from './app.js';  // Import app from app.js
import dotenv from 'dotenv';


dotenv.config(); // .env kommer nu att laddas från rotmappen automatiskt



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servern körs på http://localhost:${PORT}`);
});
