const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const studentAuthRoutes = require('./routes/studentAuth');
const { Server } = require('socket.io');
const http = require('http');
const startPaymentWatcher = require('./services/paymentWatcher');
const cron = require('node-cron');
const { updateStdFeeData } = require('./scripts/updateStdFeeData');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/bank', require('./routes/bankRoutes'));
app.use('/api/fee', require('./routes/feeRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/scholarships', require('./routes/scholarshipRoutes'));
app.use('/api/stdfeedata', require('./routes/stdFeeData'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/student', studentAuthRoutes);

app.get('/', (req, res) => res.send('Fee Management System Backend Running'));
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

startPaymentWatcher(io);

cron.schedule('0 0 * * * *', () => {
  console.log('Running scheduled fee update...');
  updateStdFeeData();
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
