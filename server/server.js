const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const CREDITS_AT_START = 10;

app.use(cors());
app.use(express.json());

const SYMBOLS_MAP = {
  C: "🍒", // Cherry emoji
  L: "🍋", // Lemon emoji
  O: "🍊", // Orange emoji
  W: "🍉", // Watermelon emoji
};

const REWARDS_MAP = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

let userCredits = CREDITS_AT_START;

app.get("/api/credits", (req, res) => {
  res.json({ credits: userCredits });
});

app.post("/api/roll", (req, res) => {
  const { credits } = req.body;
  console.log(`Request received with ${credits} credits`);

  const newSlotValues = {
    column1: getRandomSymbol(),
    column2: getRandomSymbol(),
    column3: getRandomSymbol(),
  };

  const winAmount = isWin(newSlotValues);

  // cheating behavior based on user's credits
  let shouldReroll = false;
  if (credits < 40) {
    console.log("User has less than 40 credits. Rolls are truly random.");
  } else if (credits >= 40 && credits <= 60) {
    console.log("User has between 40 and 60 credits.");
    shouldReroll = Math.random() < 0.3; // 30% chance to reroll
  } else {
    console.log("User has more than 60 credits.");
    shouldReroll = Math.random() < 0.6; // 60% chance to reroll
  }

  if (shouldReroll) {
    console.log("Server decided to reroll the round.");
    // reroll:
    newSlotValues.column1 = getRandomSymbol();
    newSlotValues.column2 = getRandomSymbol();
    newSlotValues.column3 = getRandomSymbol();
  }

  const responseData = {
    newSlotValues,
    winAmount,
  };

  res.json(responseData);
});

const getRandomSymbol = () => {
  const symbols = Object.keys(SYMBOLS_MAP);
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
};

const isWin = ({ column1, column2, column3 }) => {
  if (column1 === column2 && column2 === column3) {
    return REWARDS_MAP[column1];
  }
  return 0;
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
