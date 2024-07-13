import React, { useState } from "react";
import axios from "axios";
import "./app.css";

const SERVER_URL = "http://localhost:5000";

const SYMBOLS_MAP = {
  C: "🍒",
  L: "🍋",
  O: "🍊",
  W: "🍉",
};

const REWARDS_MAP = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

const App = () => {
  const [credits, setCredits] = useState(0);
  const [email, setEmail] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCashOut, setIsCashOut] = useState(false);
  const [slotValues, setSlotValues] = useState({
    column1: "W",
    column2: "W",
    column3: "W",
  });

  const handleEmailChange = (e) => {
    setEmail((email) => e.target.value);
  };

  const startGame = async () => {
    try {
      console.log(`Starting game for ${email}`);
      const response = await axios.post(`${SERVER_URL}/api/register`, {
        email,
      });
      const { credits } = response.data;

      setCredits((credits) => credits);
      setIsGameStarted((isGameStarted) => true);
      setIsGameOver((isGameOver) => (credits <= 0 ? true : false)); // Set game over if credits are 0
      setIsCashOut((isCashOut) => false);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const fetchCredits = async (userEmail) => {
    try {
      console.log(`Fetching credits for ${userEmail}`);
      const response = await axios.get(`${SERVER_URL}/api/credits`, {
        params: { email: userEmail },
      });
      const { credits } = response.data;
      setCredits((credits) => credits);

      if (credits <= 0) {
        setIsGameOver((isGameOver) => true);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    }
  };

  const cashOut = async () => {
    if (credits <= 0) {
      console.log("You don't have enough credits to cash out.");
      return;
    }

    try {
      console.log(`Cash out request for ${email}`);
      const response = await axios.post(`${SERVER_URL}/api/cashout`, { email });
      const { credits } = response.data;
      console.log(`Cash out successful. Credits returned: ${credits}`);
      setCredits((credits) => redits);
      setIsGameOver((isGameOver) => true);
      setIsCashOut((isCashOut) => true);
    } catch (error) {
      console.error("Error cashing out:", error);
    }
  };

  const buyCredits = async () => {
    try {
      console.log(`Buying credits for ${email}`);
      const response = await axios.post(`${SERVER_URL}/api/buy`, { email });
      const { credits } = response.data;
      setCredits((credits) => credits);
      setIsGameOver((isGameOver) => false);
      setIsCashOut((isCashOut) => false);
    } catch (error) {
      console.error("Error buying credits:", error);
    }
  };

  const rollSlots = async () => {
    if (credits <= 0) {
      console.log("You don't have enough credits to play.");
      return;
    }

    try {
      console.log(`Rolling slots for ${email}`);
      const response = await axios.post(`${SERVER_URL}/api/roll`, { email });
      const { newSlotValues, winAmount } = response.data;

      const updatedCredits = credits - 1 + winAmount;
      setCredits((credits) => updatedCredits);
      setSlotValues((slotValues) => newSlotValues);

      if (updatedCredits <= 0) {
        setIsGameOver((isGameOver) => true);
      }

      if (winAmount) {
        console.log(`You win ${winAmount} credits!`);
      }
    } catch (error) {
      console.error("Error rolling slots:", error);
    }
  };

  return (
    <div className="container">
      <h1>Casino Jackpot</h1>

      {!isGameStarted ? (
        <div>
          <p>
            {"Welcome to the rigged machine ✨"}
            <br />
            {"Get ready to lose some money! 🤑🤑🤑"}
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleEmailChange}
          />
          <button
            className="game-start-button"
            onClick={startGame}
            disabled={!email}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div>
          <div className="slot-container">
            <Slots slotValues={slotValues} />
          </div>

          {!isGameOver && credits > 0 && (
            <button
              className="roll-button"
              onClick={rollSlots}
              disabled={credits <= 0}
            >
              Roll Slots
            </button>
          )}

          {(isGameOver || credits <= 0) && !isCashOut && (
            <div>
              <p className="game-over-message">
                {isCashOut
                  ? `You cashed out ${credits} credits! 🎉 Come back to lose your money next time...💰`
                  : "Buy more credits to play... 💸💸💸"}
              </p>
              <button className="buy-button" onClick={buyCredits}>
                Buy 10 more credits
              </button>
            </div>
          )}

          {credits > 0 && !isGameOver && !isCashOut && (
            <button className="cash-out-button" onClick={cashOut}>
              Cash Out
            </button>
          )}

          {credits <= 0 && !isCashOut && !isGameOver && (
            <p className="welcome-back-message">{`Welcome back ${email}!`}</p>
          )}
        </div>
      )}

      <CreditsPanel />
      <Credits credits={credits} />
    </div>
  );
};

const Slots = ({ slotValues }) => (
  <>
    <SlotColumn symbol={slotValues.column1} />
    <SlotColumn symbol={slotValues.column2} />
    <SlotColumn symbol={slotValues.column3} />
  </>
);

const SlotColumn = ({ symbol }) => (
  <div className="slot-column">
    <h2 className="slot-icon">{SYMBOLS_MAP[symbol]}</h2>
    <p className="slot-label">{symbol}</p>
  </div>
);

const CreditsPanel = () => (
  <div>
    <h2>CreditsPanel</h2>
  </div>
);

const Credits = ({ credits }) => (
  <div>
    <h2>Current Credits: {credits}</h2>
  </div>
);

export default App;
