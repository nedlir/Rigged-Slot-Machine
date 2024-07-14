import React, { useState } from "react";
import Slots from "./Slots";

const GamePlay = ({
  slotValues,
  userCredits,
  rollSlots,
  isGameOver,
  isCashOut,
  buyCredits,
  cashOut,
  email,
  isLoading,
  slotsSpinning,
}) => {
  const [localSlotsSpinning, setLocalSlotsSpinning] = useState(slotsSpinning);

  const handleRollSlots = () => {
    if (!localSlotsSpinning && userCredits > 0 && !isLoading) {
      setLocalSlotsSpinning(true);
      rollSlots().finally(() => {
        setLocalSlotsSpinning(false);
      });
    }
  };

  const handleCashOut = () => {
    if (!localSlotsSpinning) {
      cashOut();
    }
  };

  const RollButton = ({
    rollSlots,
    userCredits,
    isLoading,
    isGameOver,
    slotsSpinning,
  }) =>
    !isGameOver &&
    userCredits > 0 && (
      <button
        className="roll-button"
        onClick={handleRollSlots}
        disabled={isLoading || localSlotsSpinning}
      >
        {isLoading ? "Rolling..." : "Roll Slots"}
      </button>
    );

  return (
    <div>
      <UserInfo email={email} />
      <div className="slot-container">
        <Slots slotValues={slotValues} />
      </div>
      <CreditsDisplay userCredits={userCredits} />
      <RollButton
        rollSlots={handleRollSlots}
        userCredits={userCredits}
        isLoading={isLoading}
        isGameOver={isGameOver}
        slotsSpinning={localSlotsSpinning}
      />
      {(isGameOver || userCredits <= 0) && (
        <GameOverSection
          isCashOut={isCashOut}
          userCredits={userCredits}
          buyCredits={buyCredits}
          isLoading={isLoading}
        />
      )}
      {userCredits > 0 && !isGameOver && !isCashOut && (
        <button
          className="cash-out-button"
          onClick={handleCashOut}
          disabled={isLoading || localSlotsSpinning}
        >
          {isLoading ? "Processing..." : "Cash Out"}
        </button>
      )}
      {userCredits <= 0 && !isCashOut && !isGameOver && (
        <WelcomeBackMessage email={email} />
      )}
    </div>
  );
};

const UserInfo = ({ email }) => <h2>Logged in as {email}</h2>;

const CreditsDisplay = ({ userCredits }) => (
  <div className="credits-container">
    <h2>Current Credits: {userCredits}</h2>
  </div>
);

const GameOverSection = ({ isCashOut, userCredits, buyCredits, isLoading }) => (
  <div>
    <p className="game-over-message">
      {isCashOut
        ? `You cashed out ${userCredits} credits! 🎉 Come back to lose your money next time...💰`
        : "Buy more credits to play... 💸💸💸"}
    </p>
    <button className="buy-button" onClick={buyCredits} disabled={isLoading}>
      {isLoading ? "Processing..." : "Buy 10 more credits"}
    </button>
  </div>
);

const WelcomeBackMessage = ({ email }) => (
  <p className="welcome-back-message">{`Welcome back ${email}!`}</p>
);

export default GamePlay;
