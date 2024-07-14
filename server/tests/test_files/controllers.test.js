const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { registerUser, getUserCredits, rollSlots, cashOut, buyCredits } = require('../../controllers');

// Initialize Express app for testing
const app = express();
app.use(express.json());

// Define test routes
app.post('/api/register', registerUser);
app.get('/api/credits', getUserCredits);
app.post('/api/roll', rollSlots);
app.post('/api/cashout', cashOut);
app.post('/api/buy', buyCredits);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User and Slot Controllers', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
  });

  it('should get user credits', async () => {
    await request(app).post('/api/register').send({ email: 'test@example.com' });

    const response = await request(app)
      .get('/api/credits')
      .query({ email: 'test@example.com' });

    expect(response.status).toBe(200);
  });

  it('should roll slots', async () => {
    await request(app).post('/api/register').send({ email: 'test@example.com' });

    const response = await request(app)
      .post('/api/roll')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
  });

  it('should cash out credits', async () => {
    await request(app).post('/api/register').send({ email: 'test@example.com' });

    const response = await request(app)
      .post('/api/cashout')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
  });

  it('should buy credits', async () => {
    await request(app).post('/api/register').send({ email: 'test@example.com' });

    const response = await request(app)
      .post('/api/buy')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
  });
});
