import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameStart from '../../src/GameStart';

test('renders email input and start game button', () => {
  render(<GameStart email="" handleEmailChange={() => {}} startGame={() => {}} isLoading={false} />);
  
  expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  expect(screen.getByText('Start Game')).toBeInTheDocument();
});

test('email input updates value', () => {
  const handleEmailChange = jest.fn();
  render(<GameStart email="" handleEmailChange={handleEmailChange} startGame={() => {}} isLoading={false} />);
  
  fireEvent.change(screen.getByPlaceholderText('Enter your email'), { target: { value: 'test@example.com' } });
  expect(handleEmailChange).toHaveBeenCalledWith(expect.any(Object));
});
