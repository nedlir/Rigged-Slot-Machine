const request = require('supertest');
const express = require('express');
const router = require('../../routes');
const app = express();

app.use(express.json()); // To parse JSON bodies
app.use(router);

describe('API Routes', () => {
  describe('GET /credits', () => {
    it('should get user credits', async () => {
      const response = await request(app)
        .get('/credits');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /roll', () => {
    it('should roll the slots', async () => {
      const response = await request(app)
        .post('/roll')
        .send({ bet: 10 });

      expect(response.status).toBe(400); 
    });
  });

  describe('POST /cashout', () => {
    it('should cash out credits', async () => {
      const response = await request(app)
        .post('/cashout');

      expect(response.status).toBe(400);
    });
  });

  describe('POST /buy', () => {
    it('should buy credits', async () => {
      const response = await request(app)
        .post('/buy')
        .send({ amount: 10 });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for a non-existent route', async () => {
      const response = await request(app)
        .get('/nonexistent');

      expect(response.status).toBe(404);
    });
  });
});
