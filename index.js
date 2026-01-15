import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;  
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Reseller Backend API');
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.get("/api/user",userRoutes)
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});