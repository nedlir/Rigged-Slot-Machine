const mongoose = require('mongoose');
const { connectDB } = require('../../db');

// Helper function to disconnect from MongoDB
const disconnectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};

describe('Database Connection', () => {
  // Clear database and close connection before each test
  beforeEach(async () => {
    await disconnectDB();
  });

  // Test successful connection
  it('should connect to MongoDB successfully', async () => {
    try {
      const db = await connectDB();
      expect(db).toBeDefined();
      expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    } catch (error) {
      fail('Database connection failed');
    }
  });

  // Test connection failure
  it('should handle connection errors', async () => {
    // Temporarily set an invalid URI for testing
    process.env.MONGODB_URI = 'invalid-uri';

    try {
      await connectDB();
      fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
    } finally {
      // Clean up and reset environment variable
      delete process.env.MONGODB_URI;
    }
  });
});
