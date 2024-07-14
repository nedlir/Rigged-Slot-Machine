require("dotenv").config(); // for the database uri

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const symbols = ["C", "L", "O", "W"];

const REWARDS_MAP = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

let databaseConnection = null;

// connect to mongodb:
const connectToDatabase = async () => {
  if (databaseConnection) {
    return databaseConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error("mongodb uri is not defined in .env file. exiting now...");
      process.exit(1);
    }

    databaseConnection = await mongoose.connect(uri);
    console.log("successfully connected to mongodb");
    return databaseConnection;
  } catch (error) {
    console.error("error connecting to mongodb:", error);
    throw error;
  }
};

// user schema and model:
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 10 },
});

const User = mongoose.model("User", userSchema);

// initialize database connection:
connectToDatabase().catch((err) => {
  console.error("failed to connect to the database. exiting now...", err);
  process.exit(1);
});

// register a new user or initialize user data:
app.post("/api/register", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("error: email is required");
    return res.status(400).json({ error: "email is required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, credits: 10 });
      await user.save();
      console.log(`new user registered: ${email} with 10 credits`);
    } else {
      console.log(`existing user re-registered: ${email}`);
    }

    res.json({ credits: user.credits });
  } catch (error) {
    console.error("error registering user:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// get user credits:
app.get("/api/credits", async (req, res) => {
  const { email } = req.query;

  if (!email) {
    console.log("error: email is required");
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("error: user not found");
      return res.status(404).json({ error: "user not found" });
    }
    console.log(`credits fetched for ${email}: ${user.credits}`);
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("error fetching credits:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// roll the slots and return new values and winning amount:
app.post("/api/roll", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("error: email is required");
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("error: user not found");
      return res.status(404).json({ error: "user not found" });
    }

    if (user.credits <= 0) {
      console.log("error: not enough credits");
      return res.status(400).json({ error: "not enough credits" });
    }

    const getRandomSymbol = () =>
      symbols[Math.floor(Math.random() * symbols.length)];
    const newSlotValues = {
      column1: getRandomSymbol(),
      column2: getRandomSymbol(),
      column3: getRandomSymbol(),
    };

    const winAmount = calculateWinAmount(newSlotValues);
    let cheatProbability = 0;
    if (user.credits > 60) cheatProbability = 0.6;
    else if (user.credits >= 40) cheatProbability = 0.3;

    // cheating roll:
    if (Math.random() < cheatProbability) {
      console.log(`cheating applied for ${email}`);
      const reRollSlotValues = {
        column1: getRandomSymbol(),
        column2: getRandomSymbol(),
        column3: getRandomSymbol(),
      };
      const reRollWinAmount = calculateWinAmount(reRollSlotValues);
      console.log(
        `re-rolled values for ${email}: ${JSON.stringify(reRollSlotValues)}`
      );
      user.credits = Math.max(user.credits - 1 + reRollWinAmount, 0); // credits do not go negative
      await user.save();
      res.json({ newSlotValues: reRollSlotValues, winAmount: reRollWinAmount });
    } else {
      console.log(`slot values for ${email}: ${JSON.stringify(newSlotValues)}`);
      user.credits = Math.max(user.credits - 1 + winAmount, 0); // user credits do not go negative
      await user.save();
      res.json({ newSlotValues, winAmount });
    }
  } catch (error) {
    console.error("error rolling slots:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// cash out the user credits and clear account:
app.post("/api/cashout", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("error: email is required");
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("error: user not found");
      return res.status(404).json({ error: "user not found" });
    }

    const credits = user.credits;
    console.log(`user ${email} cashed out ${credits} credits`);

    // reset credits of user:
    user.credits = 0;
    await user.save();
    res.json({ credits });
  } catch (error) {
    console.error("error cashing out:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// buy more credits for the user:
app.post("/api/buy", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("error: email is required");
    return res.status(400).json({ error: "email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("error: user not found");
      return res.status(404).json({ error: "user not found" });
    }

    user.credits = user.credits + 10;
    console.log(
      `user ${email} bought 10 credits. total credits: ${user.credits}`
    );
    await user.save();
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("error buying credits:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

// calculate winning amount by the slot values:
const calculateWinAmount = (slotValues) => {
  const { column1, column2, column3 } = slotValues;
  if (column1 === column2 && column2 === column3) {
    return REWARDS_MAP[column1];
  }
  return 0;
};

// handle server shutdown:
process.on("SIGINT", async () => {
  if (databaseConnection) {
    await mongoose.disconnect();
    console.log("disconnected from mongodb");
  }
  console.error("Server is shutting down now...");
  process.exit(0);
});

// server start:
app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});
