const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobsRoutes');
const userRoutes = require('./routes/userRoutes'); 
const companyRoutes = require('./routes/companyRoutes')
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

// Kết nối tới MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/user', userRoutes);
app.use('/api/company', companyRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
