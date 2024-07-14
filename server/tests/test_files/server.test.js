const request = require('supertest');
const express = require('express');
const { connectDB } = require('../../db');
const routes = require('../../routes');

// Set up a simple Express app for testing
const app = express();
app.use(express.json());
app.use('/api', routes);

// Mock the connectDB function to prevent actual database connections during testing
jest.mock('../../db', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
}));

describe('Server', () => {
  // A simple test to check if the server responds
  it('should respond to a basic route', async () => {
    const response = await request(app)
      .get('/Test ');

    // Check if the server responds with a 404 status, since Test  is not a defined route
    expect(response.status).toBe(404);
  });
});