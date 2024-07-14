import React from "react";
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
}) => (
  <div>
    <UserInfo email={email} />
    <div className="slot-container">
      <Slots slotValues={slotValues} />
    </div>
    <CreditsDisplay userCredits={userCredits} />
    <RollButton
      rollSlots={rollSlots}
      userCredits={userCredits}
      isLoading={isLoading}
      isGameOver={isGameOver}
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
      <CashOutButton cashOut={cashOut} isLoading={isLoading} />
    )}
    {userCredits <= 0 && !isCashOut && !isGameOver && (
      <WelcomeBackMessage email={email} />
    )}
  </div>
);

const UserInfo = ({ email }) => <h2>Logged in as {email}</h2>;

const CreditsDisplay = ({ userCredits }) => (
  <div className="credits-container">
    <h2>Current Credits: {userCredits}</h2>
  </div>
);

const RollButton = ({ rollSlots, userCredits, isLoading, isGameOver }) =>
  !isGameOver &&
  userCredits > 0 && (
    <button
      className="roll-button"
      onClick={rollSlots}
      disabled={isLoading || userCredits <= 0}
    >
      {isLoading ? "Rolling..." : "Roll Slots"}
    </button>
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

const CashOutButton = ({ cashOut, isLoading }) => (
  <button className="cash-out-button" onClick={cashOut} disabled={isLoading}>
    {isLoading ? "Processing..." : "Cash Out"}
  </button>
);

const WelcomeBackMessage = ({ email }) => (
  <p className="welcome-back-message">{`Welcome back ${email}!`}</p>
);

export default GamePlay;
