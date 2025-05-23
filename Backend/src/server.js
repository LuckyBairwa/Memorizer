import app from './app.js';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import { updateProfile } from './controllers/userController.js';
dotenv.config();

const PORT = process.env.PORT || 5000;
await connectDB();

app.listen(PORT, () => {
  console.log(`Radhe Radhe❤️, Server running on port http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.put("/api/user/me", updateProfile);
