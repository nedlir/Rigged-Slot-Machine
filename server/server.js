const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
const CREDITS_AT_START = 10;

app.use(cors());
app.use(express.json());

// endpoint to start with..
app.get("/api/credits", (req, res) => {
  res.json({ credits: CREDITS_AT_START });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
