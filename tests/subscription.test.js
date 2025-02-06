const request = require('supertest');
const app = require('../server'); // Path to your app
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const jwt = require('jsonwebtoken');

let mongoServer;
let token; // We'll use this for authentication in tests

beforeAll(async () => {
  // Ensure mongoose is disconnected before creating a new in-memory server
  await mongoose.disconnect();

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Create a test user and login to get a token
  const user = new User({
    name: 'Antony Maina',
    email: 'tonnymaina@gmail.com',
    password: '$2b$10$/TcrOrxwaqXYsAP.QfMc/.doR46LWtCUxHqrXti4DvnxAQb74K6tK', // Hashed password
  });
  await user.save();

  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Simulating a login token
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Subscription Controller', () => {
  // Test create subscription
  it('should create a subscription', async () => {
    const response = await request(app)
      .post('/api/subscriptions/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        subscriptionType: 'premium',
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      });

  console.log(response.body); // Log response body for debugging
    
  });

  // Test get subscription
  it('should fetch a user\'s subscription', async () => {
    // Assuming token is already set here
    const response = await request(app)
      .get('/api/subscriptions')
      .set('Authorization', `Bearer ${token}`); // Ensure token is correct
  
  console.log(response.body);  
  });
  

  // Test upgrade to paid subscription
  it('should upgrade subscription to paid', async () => {
    const response = await request(app)
      .post('/api/subscriptions/upgrade')
      .set('Authorization', `Bearer ${token}`)
      .send({ subscriptionId: 'someSubscriptionId' });
  
  console.log(response.body);
  });
  

  // Test redeem points for subscription extension
  it('should redeem points to extend subscription', async () => {
    const response = await request(app)
      .post('/api/subscriptions/extend')
      .set('Authorization', `Bearer ${token}`)
      .send({ pointsToUse: 100 });
  
  console.log(response.body); // Log response body to check error message
  
    
  });
  
  

  // Test earning points
  it('should allow the user to earn points', async () => {
    const response = await request(app)
      .post('/api/subscriptions/earn')
      .set('Authorization', `Bearer ${token}`)
      .send({ pointsEarned: 50 }); // Ensure this matches your backend validation
  
      console.log(response.body);
  });
  

  // Test subscription extension failure (insufficient points)
  it('should fail to extend subscription if not enough points', async () => {
    const response = await request(app)
      .post('/api/subscriptions/extend')
      .set('Authorization', `Bearer ${token}`)
      .send({ pointsToUse: 1000 }); // Intentionally sending more points than available
  
      console.log(response.body); 
  });
  
});

