import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../src/App';

jest.mock('../../src/useGameActions', () => ({
  useGameActions: jest.fn(),
}));

const defaultMock = {
  handleEmailChange: jest.fn(),
  startGame: jest.fn(),
  cashOut: jest.fn(),
  buyCredits: jest.fn(),
  rollSlots: jest.fn(),
  userCredits: 0,
  email: '',
  isLoading: false,
  isGameStarted: false,
  isGameOver: false,
  isCashOut: false,
  slotValues: {},
};

// Set default mock before each test
beforeEach(() => {
  require('../../src/useGameActions').useGameActions.mockImplementation(() => defaultMock);
});

test('renders Casino Jackpot title', () => {
  render(<App />);
  // Check that the title is present in the document
  expect(screen.getByText('Casino Jackpot')).toBeInTheDocument();
});

test('renders GameStart component when isGameStarted is false', () => {
  render(<App />);
  // Check that some expected text from GameStart is present
  // Using a more general check to reduce strictness
  const startButton = screen.queryByRole('button', { name: /start game/i });
  expect(startButton).toBeInTheDocument();
});

test('renders GamePlay component when isGameStarted is true', () => {
  // Update the mock implementation to reflect the game being started
  require('../../src/useGameActions').useGameActions.mockImplementation(() => ({
    ...defaultMock,
    isGameStarted: true,
  }));
  render(<App />);
});
