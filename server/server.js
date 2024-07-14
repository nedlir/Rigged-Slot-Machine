const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db");
const routes = require("./routes");

const app = express();
const port = 5000;

require("dotenv").config(); // for the database URI in the ".env" file

app.use(cors());
app.use(express.json());

// init database connection:
connectDB().catch((err) => {
  console.error("Failed to connect to the database. Exiting now...", err);
  process.exit(1);
});

app.use("/api", routes);

// server shutdown:
process.on("SIGINT", async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
  console.error("Server is shutting down now...");
  process.exit(0);
});

// server start:
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
