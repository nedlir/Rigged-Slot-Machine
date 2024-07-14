const express = require("express");
const {
  registerUser,
  getUserCredits,
  rollSlots,
  cashOut,
  buyCredits,
} = require("./controllers");

const router = express.Router();

// user actions:
router.post("/register", registerUser);
router.get("/credits", getUserCredits);

// actions with the slots:
router.post("/roll", rollSlots);
router.post("/cashout", cashOut);
router.post("/buy", buyCredits);

module.exports = router;
