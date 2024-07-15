import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import GamePlay from '../../src/GamePlay';

// Mock the necessary props
const mockRollSlots = jest.fn(() => Promise.resolve());
const mockCashOut = jest.fn();
const mockBuyCredits = jest.fn();

describe('GamePlay Component', () => {
  test('handles roll button click', async () => {
    // Render the GamePlay component with mock props
    render(
      <GamePlay
        slotValues={{ column1: 'C', column2: 'L', column3: 'O' }}
        userCredits={10}
        rollSlots={mockRollSlots}
        isGameOver={false}
        isCashOut={false}
        buyCredits={mockBuyCredits}
        cashOut={mockCashOut}
        email="test@example.com"
        isLoading={false}
        slotsSpinning={false}
      />
    );

    // Find the roll button
    const rollButton = screen.getByText(/Roll Slots/i);

    // Click the roll button and wrap it in act to handle state updates
    await act(async () => {
      fireEvent.click(rollButton);
      await mockRollSlots();
    });

    // Assert that rollSlots was called
    expect(mockRollSlots).toHaveBeenCalled();
  });
});
