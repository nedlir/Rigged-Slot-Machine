//// custom hook ////
import { useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:5000";

export const useGameActions = () => {
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
      const updatedCredits = userCredits - 1 + winAmount;
      setUserCredits((userCredits) => updatedCredits);
      setSlotValues((slotValues) => newSlotValues);

      if (updatedCredits <= 0) {
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
    isLoading,
    isGameStarted,
    isGameOver,
    isCashOut,
    slotValues,
  };
};
