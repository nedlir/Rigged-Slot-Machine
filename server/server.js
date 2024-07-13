const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); // Replaces body-parser

const symbols = ["C", "L", "O", "W"];

const REWARDS_MAP = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

const users = []; // will be moved to a database later

const findUser = (email) => users.find((user) => user.email === email);

// register a new user or initialize user data:
app.post("/api/register", (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  let user = findUser(email);
  if (!user) {
    user = { email, credits: 10 };
    users.push(user);
    console.log(`New user registered: ${email} with 10 credits`);
  } else {
    console.log(`Existing user re-registered: ${email}`);
  }

  res.json({ credits: user.credits });
});

// get user credits:
app.get("/api/credits", (req, res) => {
  const { email } = req.query;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  const user = findUser(email);
  if (!user) {
    console.log("Error: User not found");
    return res.status(404).json({ error: "User not found" });
  }
  console.log(`Credits fetched for ${email}: ${user.credits}`);
  res.json({ credits: user.credits });
});

// roll  slots and return new values and winning amount:
app.post("/api/roll", (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  const user = findUser(email);
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

  // cheating roll:
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
    user.credits = Math.max(user.credits - 1 + reRollWinAmount, 0); // Ensure credits do not go negative
    res.json({ newSlotValues: reRollSlotValues, winAmount: reRollWinAmount });
  } else {
    console.log(`Slot values for ${email}: ${JSON.stringify(newSlotValues)}`);
    user.credits = Math.max(user.credits - 1 + winAmount, 0); // Ensure credits do not go negative
    res.json({ newSlotValues, winAmount });
  }
});

// cash out the user credits and clear account
app.post("/api/cashout", (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  const user = findUser(email);
  if (!user) {
    console.log("Error: User not found");
    return res.status(404).json({ error: "User not found" });
  }

  const credits = user.credits;
  console.log(`User ${email} cashed out ${credits} credits`);

  // reset credits of user:
  user.credits = 0;
  res.json({ credits });
});

// Buy more credits for the user
app.post("/api/buy", (req, res) => {
  const { email } = req.body;
  if (!email) {
    console.log("Error: Email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  const user = findUser(email);
  if (!user) {
    console.log("Error: User not found");
    return res.status(404).json({ error: "User not found" });
  }

  user.credits = user.credits + 10;
  console.log(
    `User ${email} bought 10 credits. Total credits: ${user.credits}`
  );
  res.json({ credits: user.credits });
});

// helper for calculate winning amount by the slot values:
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
