import React from "react";

const SYMBOLS_MAP = {
  C: "🍒",
  L: "🍋",
  O: "🍊",
  W: "🍉",
};

const Slots = ({ slotValues }) => (
  <div className="slot-container">
    <SlotColumn value={slotValues.column1} />
    <SlotColumn value={slotValues.column2} />
    <SlotColumn value={slotValues.column3} />
  </div>
);

const SlotColumn = ({ value }) => (
  <div className="slot-column">
    <h2 className="slot-icon">{SYMBOLS_MAP[value] || "✖️"}</h2>
    <p className="slot-label">{value}</p>
  </div>
);

export default Slots;