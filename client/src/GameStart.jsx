import React from "react";

const GameStart = ({ email, handleEmailChange, startGame, isLoading }) => (
  <div>
    <WelcomeMessage />
    <EmailInput email={email} handleEmailChange={handleEmailChange} />
    <StartButton startGame={startGame} email={email} isLoading={isLoading} />
  </div>
);

const WelcomeMessage = () => (
  <p>
    {"Welcome to the rigged machine ✨"}
    <br />
    {"Get ready to lose some money! 🤑🤑🤑"}
  </p>
);

const EmailInput = ({ email, handleEmailChange }) => (
  <input
    type="email"
    placeholder="Enter your email"
    value={email}
    onChange={handleEmailChange}
  />
);

const StartButton = ({ startGame, email, isLoading }) => (
  <button
    className="game-start-button"
    onClick={startGame}
    disabled={!email || isLoading}
  >
    {isLoading ? "Starting..." : "Start Game"}
  </button>
);

export default GameStart;
