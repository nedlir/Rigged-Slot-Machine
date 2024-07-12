import React from "react";
import axios from "axios";
import { useQuery } from "react-query";

const SERVER_URL = "http://localhost:5000";

function App() {
  const {
    data: initialCredits,
    isLoading,
    isError,
  } = useQuery("initialCredits", async () => {
    const response = await axios.get(`${SERVER_URL}/api/credits`);
    return response.data.credits;
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching initial credits</div>;

  return (
    <div className="App">
      <h1>Slot Machine Game</h1>
      <h2>Initial Credits: {initialCredits}</h2>
      {/*  logic will go here */}
    </div>
  );
}

export default App;
