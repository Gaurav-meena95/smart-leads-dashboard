import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './db';
import authRoutes from './user/authRoutes';
import leadRoutes from './leads/leadRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Database connection failed: " + error.message });
  }
});
app.get('/', (req, res) => {
  res.send('smart leads dashboard is running');
});
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
