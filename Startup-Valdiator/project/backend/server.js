import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from '../backend/routes/authRoutes.js';
import ideaRoutes from '../backend/routes/ideaRoutes.js';
import commentRoutes from '../backend/routes/commentRoutes.js';
import adminRoutes from '../backend/routes/adminRoutes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/startup-validator')
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('Startup Idea Validator API is running');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));