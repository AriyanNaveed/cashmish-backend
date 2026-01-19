
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/userRoute.js';
import { connectDB } from './config/db.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Reseller Backend API');
});

app.use("/api/user", userRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});