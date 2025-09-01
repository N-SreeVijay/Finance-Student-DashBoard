// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuth');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/bank", require("./routes/bankRoutes"));
app.use("/api/fee", require("./routes/feeRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));

// Dashboard routes
app.use('/api/dashboard', require('./routes/dashboard')); // handles both individual and all students

// Student auth routes
app.use('/api/student', studentAuthRoutes);

// Root endpoint
app.get('/', (req, res) => res.send('Fee Management System Backend Running'));

// Error handling for unmatched routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
