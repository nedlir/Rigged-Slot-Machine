const mongoose = require("mongoose");

// the User schhema settings:
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credits: { type: Number, default: 10 },
});

const User = mongoose.model("User", userSchema);

const symbols = ["C", "L", "O", "W"];
const REWARDS_MAP = { C: 10, L: 20, O: 30, W: 40 };

//// user functions: ////
const registerUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("Error: email is required");
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
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserCredits = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    console.log("Error: email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: user not found");
      return res.status(404).json({ error: "User not found" });
    }
    console.log(`Credits fetched for ${email}: ${user.credits}`);
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//// slot functions ////
const calculateWinAmount = (slotValues) => {
  const { column1, column2, column3 } = slotValues;
  if (column1 === column2 && column2 === column3) {
    return REWARDS_MAP[column1];
  }
  return 0;
};

const rollSlots = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("Error: email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: user not found");
      return res.status(404).json({ error: "User not found" });
    }

    if (user.credits <= 0) {
      console.log("Error: not enough credits");
      return res.status(400).json({ error: "Not enough credits" });
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
      user.credits = Math.max(user.credits - 1 + reRollWinAmount, 0); // Credits do not go negative
      await user.save();
      res.json({ newSlotValues: reRollSlotValues, winAmount: reRollWinAmount });
    } else {
      console.log(`Slot values for ${email}: ${JSON.stringify(newSlotValues)}`);
      user.credits = Math.max(user.credits - 1 + winAmount, 0); // Credits do not go negative
      await user.save();
      res.json({ newSlotValues, winAmount });
    }
  } catch (error) {
    console.error("Error rolling slots:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const cashOut = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("Error: email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: user not found");
      return res.status(404).json({ error: "User not found" });
    }

    const credits = user.credits;
    console.log(`User ${email} cashed out ${credits} credits`);

    // reset credits of user in database:
    user.credits = 0;
    await user.save();
    res.json({ credits });
  } catch (error) {
    console.error("Error cashing out:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const buyCredits = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("Error: email is required");
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Error: user not found");
      return res.status(404).json({ error: "User not found" });
    }

    // decided to leave it here as addition of 10 in case it will be changed in the future to buy-in during the game
    user.credits = user.credits + 10;
    console.log(
      `User ${email} bought 10 credits. Total credits: ${user.credits}`
    );
    await user.save();
    res.json({ credits: user.credits });
  } catch (error) {
    console.error("Error buying credits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  getUserCredits,
  rollSlots,
  cashOut,
  buyCredits,
};
