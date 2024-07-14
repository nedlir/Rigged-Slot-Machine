require("dotenv").config(); // for the database URI

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

// connect to MongoDB:
const connectToDatabase = async () => {
  if (databaseConnection) {
    return databaseConnection;
  }

  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in .env file");
    }

    databaseConnection = await mongoose.connect(uri);

    console.log("Successfully connected to MongoDB");
    return databaseConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
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
  console.error("Failed to connect to the database. Exiting now...", err);
  process.exit();
});

// register a new user or initialize user data:
app.post("/api/register", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email, credits: 10 });
      await user.save();
      console.log(`New user registered: ${email} with 10 credits`);
    } else {
      console.log(`Existing user re-registered: ${email}`);
    }

    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// get user credits:
app.get("/api/credits", async (req, res) => {
  const { email } = req.query;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Credits fetched for ${email}: ${user.credits}`);
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// roll the slots.. and return new values and winning amount:
app.post("/api/roll", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (user.credits <= 0) {
      console.log("Error: Not enough credits");
      return res.status(400).json({ error: "Not enough credits" });
    }

    const getRandomSymbol = () =>
      symbols[Math.floor(Math.random() * symbols.length)];
    const newSlotValues = {
      column1: getRandomSymbol(),
      column2: getRandomSymbol(),
      column3: getRandomSymbol(),
    };

    // use cheating based on the number of credits user has:
    const winAmount = calculateWinAmount(newSlotValues);
    let cheatProbability = 0;
    if (user.credits > 60) cheatProbability = 0.6;
    else if (user.credits >= 40) cheatProbability = 0.3;

    // Cheating roll:
    if (Math.random() < cheatProbability) {
      console.log(`Cheating applied for ${email}`);
      const reRollSlotValues = {
        column1: getRandomSymbol(),
        column2: getRandomSymbol(),
        column3: getRandomSymbol(),
      };
      const reRollWinAmount = calculateWinAmount(reRollSlotValues);
      console.log(
        `Re-rolled values for ${email}: ${JSON.stringify(reRollSlotValues)}`
      );
      user.credits = Math.max(user.credits - 1 + reRollWinAmount, 0); // credits do not go negative
      await user.save();
      res.json({ newSlotValues: reRollSlotValues, winAmount: reRollWinAmount });
    } else {
      console.log(`Slot values for ${email}: ${JSON.stringify(newSlotValues)}`);
      user.credits = Math.max(user.credits - 1 + winAmount, 0); // user credits do not go negative
      await user.save();
      res.json({ newSlotValues, winAmount });
    }
  } catch (error) {
    console.error("Error rolling slots:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// cash out the user credits and clear account
app.post("/api/cashout", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    const credits = user.credits;
    console.log(`User ${email} cashed out ${credits} credits`);

    // reset credits of user:
    user.credits = 0;
    await user.save();
    res.json({ credits });
  } catch (error) {
    console.error("Error cashing out:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// buy more credits for the user
app.post("/api/buy", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ error: "User not found" });
    }

    user.credits += 10;
    console.log(
      `User ${email} bought 10 credits. Total credits: ${user.credits}`
    );
    await user.save();
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error buying credits:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

// server start:
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
