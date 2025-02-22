require('dotenv').config();
console.log('MONGO_URI:', process.env.MONGO_URI);  // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Import CORS
const userRoutes = require('./routes/userRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const withdrawRoutes = require('./routes/withdrawRoutes');
const promotionsRoutes = require('./routes/promotionsRoutes');
const scratchCardRoutes = require('./routes/scratchCardRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const walletRoutes = require('./routes/walletRoutes');
const authRoutes = require('./routes/authRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const rewardRoutes = require('./routes/rewardRoutes');
const compensationRoutes = require('./routes/compensationRoutes');
const lotteryRoutes = require('./routes/lotteryRoutes');
const systemRoutes = require('./routes/systemRoutes');



// const notificationRoutes = require('./routes/notificationRoutes');**/

const app = express();
const PORT = process.env.PORT || 5000;

//const path = require('path');

// Serve static files from the "uploads" directory
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//app.post('/api/reports/submit', express.json(), submitReport);
// Middleware
app.use(cors({ origin: '*' })); // Use CORS middleware to allow cross-origin requests
app.use(express.json());
//app.use(bodyParser.json());
//app.use(express.json());
// app.use(authMiddleware);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/promotions', promotionsRoutes);
app.use('/api/scratch-cards', scratchCardRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/rewards', rewardRoutes);
app.use('/api', compensationRoutes);
app.use('/api/lottery', lotteryRoutes);
app.use('/api/system', systemRoutes);

// app.use('/api/notifications', notificationRoutes);

if (!process.env.MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in environment variables');
  process.exit(1);  // Exits if MONGO_URI is missing
}
if (!process.env.JWT_SECRET) {
  console.error('Error: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}


// Log the URI to ensure it's being loaded correctly
console.log('MongoDB URI:', process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exits if connection fails
  });


// Error handling middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});





// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
