import React from "react";
import "./app.css";
import { useGameActions } from "./useGameActions";
import GameStart from "./GameStart";
import GamePlay from "./GamePlay";

const App = () => {
  const {
    handleEmailChange,
    startGame,
    cashOut,
    buyCredits,
    rollSlots,
    userCredits,
    email,
    isLoading,
    isGameStarted,
    isGameOver,
    isCashOut,
    slotValues,
  } = useGameActions();

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
          email={email}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default App;
