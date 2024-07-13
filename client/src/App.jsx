import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import "./app.css";

const SERVER_URL = "http://localhost:5000";

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

const App = () => {
  const [credits, setCredits] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [slotValues, setSlotValues] = useState({
    column1: "W",
    column2: "W",
    column3: "W",
  });

  // useQuery hook to fetch initial credits
  const { isLoading, isError } = useQuery("initialCredits", async () => {
    console.log("Fetching initial credits...");
    const response = await axios.get(`${SERVER_URL}/api/credits`);
    console.log("Response from server:", response.data);
    setCredits((credits) => response.data.credits); // Update initial credits from server
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching initial credits</div>;
  }

  const startGame = () => {
    console.log("Game started!");
    setIsGameStarted((isGameStarted) => true);
  };

  const cashOut = () => {
    console.log("Button Cash Out pressed");
    setIsGameOver((isGameOver) => true);
  };

  const buyCredits = () => {
    setCredits((credits) => credits + 10);
    setIsGameOver((isGameOver) => false); // Reset game over status when buying credits
  };

  // Function to roll the slots
  const rollSlots = async () => {
    if (credits <= 0) {
      console.log("You don't have enough credits to play.");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/roll`, { credits });
      console.log("Response from server:", response.data);
      const { newSlotValues, winAmount } = response.data;

      setCredits((credits) => credits - 1);
      setSlotValues((slotValues) => newSlotValues);

      if (winAmount) {
        setCredits((credits) => credits + winAmount);
        console.log(`You win ${winAmount} credits!`);
      }
    } catch (error) {
      console.error("Error rolling slots:", error);
    }
  };

  return (
    <div className="container">
      <h1>Casino Jackpot</h1>

      {isGameStarted ? (
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
          {isGameOver ? (
            <p className="thank-you-message">
              {`You cashed out ${credits} credits! 🎉`}
              <br />
              {"Come back to lose your money next time...💰"}
            </p>
          ) : (
            <div>
              {credits === 0 ? (
                <div>
                  <p className="game-over-message">
                    Game is over, buy some more credits to play... 💸💸💸
                  </p>
                  <button className="buy-button" onClick={buyCredits}>
                    Buy 10 more credits
                  </button>
                </div>
              ) : (
                <button className="cash-out-button" onClick={cashOut}>
                  Cash Out
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>
            Welcome to the rigged machine. Get ready to lose some money! 🤑🤑🤑
          </p>
          <button className="game-start-button" onClick={startGame}>
            Start Game
          </button>
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

const SlotColumn = ({ symbol }) => {
  if (!symbol) {
    return (
      <div className="slot-column">
        <h2 className="slot-icon"> </h2>
        <p className="slot-label"> </p>
      </div>
    );
  }

  return (
    <div className="slot-column">
      <h2 className="slot-icon">{SYMBOLS_MAP[symbol]}</h2>
      <p className="slot-label">{symbol}</p>
    </div>
  );
};

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
