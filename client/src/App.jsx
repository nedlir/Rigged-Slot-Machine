import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const SERVER_URL = "http://localhost:5000";

const SYMBOLS = {
  C: "🍒", // cherry emoji
  L: "🍋", // lemon emoji
  O: "🍊", // orange emoji
  W: "🍉", // watermelon emoji
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
    column1: "X",
    column2: "X",
    column3: "X",
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
    setGameStarted(true);
  };

  // Function to randomly change symbols in each column, will be moved to backend later
  const rollSlots = () => {
    setSlotValues({
      column1: randomSymbol(),
      column2: randomSymbol(),
      column3: randomSymbol(),
    });
  };

  // Function to return a random symbol, will be moved to backend later
  const randomSymbol = () => {
    const symbols = Object.keys(SYMBOLS);
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  };

  return (
    <div>
      <h1>Casino Jackpot</h1>

      <div>
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
  console.log(`Rendering SlotColumn for ${SYMBOLS[symbol]}`);
  return (
    <div>
      <h2>{SYMBOLS[symbol]}</h2>
      <p>{symbol}</p>
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
