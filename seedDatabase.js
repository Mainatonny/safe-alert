const mongoose = require('mongoose');
const User = require('./models/User');  // Assuming your User model is in the models folder

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myProjectDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Create sample users
const seedUsers = [
  {
    name: 'Alice',
    email: 'alice@example.com',
    password: 'password123',
    points: 100,
    subscriptionTier: 'paid',
    subscriptionExpiry: new Date('2025-12-31'),
    contacts: [{ name: 'Bob', phone: '1234567890' }],
    isPartner: true,
    referralCode: 'ALICE123',
    referredBy: null,
    revenue: 50,
  },
  {
    name: 'Bob',
    email: 'bob@example.com',
    password: 'password456',
    points: 200,
    subscriptionTier: 'free',
    subscriptionExpiry: null,
    contacts: [{ name: 'Alice', phone: '0987654321' }],
    isPartner: false,
    referralCode: 'BOB456',
    referredBy: 'ALICE123',
    revenue: 25,
  },
  // Add more users as needed
];

// Seed the database with users
User.insertMany(seedUsers)
  .then(() => {
    console.log('Users added to the database!');
    mongoose.disconnect();  // Disconnect after seeding
  })
  .catch(err => {
    console.log('Error seeding database', err);
    mongoose.disconnect();  // Disconnect after an error
  });
