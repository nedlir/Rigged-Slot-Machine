const mongoose = require("mongoose");

let databaseConnection = null;

const connectDB = async () => {
  if (databaseConnection) {
    return databaseConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("MongoDB URI is not defined in .env file. Exiting now...");
      process.exit(1);
    }

    databaseConnection = await mongoose.connect(uri);
    console.log("Successfully connected to MongoDB");
    return databaseConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = { connectDB };