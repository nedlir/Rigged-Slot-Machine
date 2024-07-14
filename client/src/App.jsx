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

const App = () => {
  const [userCredits, setUserCredits] = useState(0);
  const [email, setEmail] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCashOut, setIsCashOut] = useState(false);
  const [slotValues, setSlotValues] = useState({
    column1: "W",
    column2: "W",
    column3: "W",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail((email) => e.target.value);
  };

  const startGame = async () => {
    setIsLoading((isLoading) => true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/register`, {
        email,
      });
      const { credits: creditsFromServer } = response.data;
      setUserCredits((userCredits) => creditsFromServer);
      setIsGameStarted((isGameStarted) => true);
      setIsGameOver((isGameOver) => creditsFromServer <= 0);
      setIsCashOut((isCashOut) => false);
    } catch (error) {
      console.error("Error registering user:", error);
    } finally {
      setIsLoading((isLoading) => false);
    }
  };

  const cashOut = async () => {
    if (userCredits <= 0) {
      console.log("You don't have enough credits to cash out.");
      return;
    }
    setIsLoading((isLoading) => true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/cashout`, { email });
      const { credits: creditsFromServer } = response.data;
      setUserCredits((userCredits) => creditsFromServer);
      setIsGameOver((isGameOver) => true);
      setIsCashOut((isCashOut) => true);
    } catch (error) {
      console.error("Error cashing out:", error);
    } finally {
      setIsLoading((isLoading) => false);
    }
  };

  const buyCredits = async () => {
    setIsLoading((isLoading) => true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/buy`, { email });
      const { credits: creditsFromServer } = response.data;
      setUserCredits((userCredits) => creditsFromServer);
      setIsGameOver((isGameOver) => false);
      setIsCashOut((isCashOut) => false);
    } catch (error) {
      console.error("Error buying credits:", error);
    } finally {
      setIsLoading((isLoading) => false);
    }
  };

  const rollSlots = async () => {
    if (userCredits <= 0) {
      console.log("You don't have enough credits to play.");
      return;
    }
    setIsLoading((isLoading) => true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/roll`, { email });
      const { newSlotValues, winAmount } = response.data;
      setUserCredits((userCredits) => userCredits - 1 + winAmount);
      setSlotValues((slotValues) => newSlotValues);

      if (userCredits - 1 + winAmount <= 0) {
        setIsGameOver((isGameOver) => true);
      }

      if (winAmount) {
        console.log(`You win ${winAmount} credits!`);
      }
    } catch (error) {
      console.error("Error rolling slots:", error);
    } finally {
      setIsLoading((isLoading) => false);
    }
  };

  return (
    <div className="container">
      <h1>Casino Jackpot</h1>
      {!isGameStarted ? (
        <GameStart
          email={email}
          handleEmailChange={handleEmailChange}
          startGame={startGame}
          isLoading={isLoading}
        />
      ) : (
        <GamePlay
          slotValues={slotValues}
          userCredits={userCredits}
          rollSlots={rollSlots}
          isGameOver={isGameOver}
          isCashOut={isCashOut}
          buyCredits={buyCredits}
          cashOut={cashOut}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

const GameStart = ({ email, handleEmailChange, startGame, isLoading }) => (
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
      disabled={!email || isLoading}
    >
      {isLoading ? "Starting..." : "Start Game"}
    </button>
  </div>
);

const GamePlay = ({
  slotValues,
  userCredits,
  rollSlots,
  isGameOver,
  isCashOut,
  buyCredits,
  cashOut,
  isLoading,
}) => (
  <div>
    <div className="slot-container">
      <Slots slotValues={slotValues} />
    </div>

    <div className="credits-container">
      <h2>Current Credits: {userCredits}</h2>
    </div>

    {!isGameOver && userCredits > 0 && (
      <button
        className="roll-button"
        onClick={rollSlots}
        disabled={isLoading || userCredits <= 0}
      >
        {isLoading ? "Rolling..." : "Roll Slots"}
      </button>
    )}

    {(isGameOver || userCredits <= 0) && (
      <div>
        <p className="game-over-message">
          {isCashOut
            ? `You cashed out ${userCredits} credits! 🎉 Come back to lose your money next time...💰`
            : "Buy more credits to play... 💸💸💸"}
        </p>
        <button
          className="buy-button"
          onClick={buyCredits}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Buy 10 more credits"}
        </button>
      </div>
    )}

    {userCredits > 0 && !isGameOver && !isCashOut && (
      <button
        className="cash-out-button"
        onClick={cashOut}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Cash Out"}
      </button>
    )}

    {userCredits <= 0 && !isCashOut && !isGameOver && (
      <p className="welcome-back-message">{`Welcome back ${email}!`}</p>
    )}
  </div>
);

const Slots = ({ slotValues }) => (
  <div className="slot-container">
    <SlotColumn symbol={slotValues.column1} />
    <SlotColumn symbol={slotValues.column2} />
    <SlotColumn symbol={slotValues.column3} />
  </div>
);

const SlotColumn = ({ symbol }) => (
  <div className="slot-column">
    <h2 className="slot-icon">{SYMBOLS_MAP[symbol]}</h2>
    <p className="slot-label">{symbol}</p>
  </div>
);

export default App;
