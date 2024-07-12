import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "react-query";

const SERVER_URL = "http://localhost:5000";

const App = () => {
  const [credits, setCredits] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // useQuery hook to fetch initial credits
  const { isLoading, isError } = useQuery("initialCredits", async () => {
    console.log("Fetching initial credits...");
    const response = await axios.get(`${SERVER_URL}/api/credits`);
    console.log("Response from server:", response.data);
    setCredits((credits) => response.data.credits); // Update initial credits from server using updater function
  });

  if (isLoading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  if (isError) {
    console.log("Error fetching initial credits.");
    return <div>Error fetching initial credits</div>;
  }

  const startGame = () => {
    console.log("Game started!");
    setGameStarted((gameStarted) => true);
    // TBA
  };

  return (
    <div>
      <h1>Casino Jackpot</h1>

      <div>
        <Slots />
      </div>

      {!gameStarted && <button onClick={startGame}>Start Game</button>}

      <CreditsPanel />
      <Credits credits={credits} />
    </div>
  );
};

const Slots = () => (
  <>
    <SlotColumn symbol="C" name="Cherry" />
    <SlotColumn symbol="L" name="Lemon" />
    <SlotColumn symbol="O" name="Orange" />
  </>
);

const SlotColumn = ({ symbol, name }) => {
  console.log(`Rendering SlotColumn for ${name}`);
  return (
    <div>
      <h2>{symbol}</h2>
      <p>{name}</p>
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
