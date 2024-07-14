import { useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:5000";

// Regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const useGameActions = () => {
  const [userCredits, setUserCredits] = useState(0);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCashOut, setIsCashOut] = useState(false);
  const [slotValues, setSlotValues] = useState({
    column1: "?",
    column2: "?",
    column3: "?",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSlotsSpinning, setIsSlotsSpinning] = useState(false);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail((email) => newEmail);
    // Validate email format
    setEmailError((emailError) =>
      !emailRegex.test(newEmail) ? "Invalid email format." : ""
    );
  };

  const startGame = async () => {
    if (emailError) {
      console.log("Email is invalid.");
      return;
    }
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
    if (isSlotsSpinning) {
      console.log(
        "Slots are still spinning. Cash out will be available after they stop."
      );
      return;
    }
    if (emailError) {
      console.log("Email is invalid.");
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
    if (emailError) {
      console.log("Email is invalid.");
      return;
    }
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
    if (emailError) {
      console.log("Email is invalid.");
      return;
    }
    if (userCredits <= 0 || isSlotsSpinning) {
      console.log(
        "You don't have enough credits to play or slots are already spinning."
      );
      return;
    }
    setIsSlotsSpinning((isSlotsSpinning) => true);
    setIsLoading((isLoading) => true);
    try {
      const response = await axios.post(`${SERVER_URL}/api/roll`, { email });
      const { newSlotValues, winAmount } = response.data;

      setUserCredits((userCredits) => userCredits - 1 + winAmount);

      // Simulate slot spin timing
      setSlotValues((slotValues) => ({
        column1: "?",
        column2: "?",
        column3: "?",
      }));

      setTimeout(() => {
        setSlotValues((slotValues) => ({
          ...slotValues,
          column1: newSlotValues.column1,
        }));
      }, 1000);

      setTimeout(() => {
        setSlotValues((slotValues) => ({
          ...slotValues,
          column2: newSlotValues.column2,
        }));
      }, 2000);

      setTimeout(() => {
        setSlotValues((slotValues) => ({
          ...slotValues,
          column3: newSlotValues.column3,
        }));
        setIsSlotsSpinning((isSlotsSpinning) => false); // All slots have finished spinning
      }, 3000);

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

  return {
    handleEmailChange,
    startGame,
    cashOut,
    buyCredits,
    rollSlots,
    userCredits,
    email,
    emailError,
    isLoading,
    isGameStarted,
    isGameOver,
    isCashOut,
    slotValues,
    isSlotsSpinning,
  };
};
