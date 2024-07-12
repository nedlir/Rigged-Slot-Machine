import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";
import "./app.css";

const SERVER_URL = "http://localhost:5000";

// Constants for symbols and their rewards
const SYMBOLS = {
  C: "🍒", // Cherry emoji
  L: "🍋", // Lemon emoji
  O: "🍊", // Orange emoji
  W: "🍉", // Watermelon emoji
  // X: "✖",
};

const REWARDS = {
  C: 10,
  L: 20,
  O: 30,
  W: 40,
};

const App = () => {
  const [credits, setCredits] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [slotValues, setSlotValues] = useState({
    column1: "x",
    column2: "x",
    column3: "x",
  });

  // useQuery hook to fetch initial credits
  const { isLoading, isError } = useQuery("initialCredits", async () => {
    console.log("Fetching initial credits...");
    const response = await axios.get(`${SERVER_URL}/api/credits`);
    console.log("Response from server:", response.data);
    setCredits(response.data.credits); // Update initial credits from server
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching initial credits</div>;
  }

  const startGame = () => {
    console.log("Game started!");
    setGameStarted((gameStarted) => true);
  };

  // Function to randomly change symbols in each column
  const rollSlots = () => {
    setSlotValues((slotValues) => ({
      column1: getRandomSymbol(),
      column2: getRandomSymbol(),
      column3: getRandomSymbol(),
    }));
  };

  // Function to return a random symbol
  const getRandomSymbol = () => {
    const symbols = Object.keys(SYMBOLS);
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  };

  return (
    <div className="container">
      <h1>Casino Jackpot</h1>

      <div className="slot-container">
        {gameStarted ? (
          <Slots slotValues={slotValues} />
        ) : (
          <>
            <SlotColumn symbol={slotValues.column1} />
            <SlotColumn symbol={slotValues.column2} />
            <SlotColumn symbol={slotValues.column3} />
          </>
        )}
      </div>

      {!gameStarted && <button onClick={startGame}>Start Game</button>}
      {gameStarted && <button onClick={rollSlots}>Roll Slots</button>}

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

  console.log(`Rendering SlotColumn for ${SYMBOLS[symbol]}`);
  return (
    <div className="slot-column">
      <h2 className="slot-icon">{SYMBOLS[symbol]}</h2>
      <p className="slot-label">{symbol}</p>
    </div>
  );
};

const CreditsPanel = () => {
  console.log("Rendering CreditsPanel");
  return (
    <div>
      <h2>CreditsPanel</h2>
    </div>
  );
};

const Credits = ({ credits }) => {
  console.log("Rendering Credits");
  return (
    <div>
      <h2>Current Credits: {credits}</h2>
    </div>
  );
};

export default App;
