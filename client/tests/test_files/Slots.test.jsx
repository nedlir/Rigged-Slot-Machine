import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Slots from '../../src/Slots';

test('renders slot columns with provided slot values', () => {
  const slotValues = {
    column1: 'C',
    column2: 'L',
    column3: 'O',
  };

  // Render the Slots component with test slot values
  render(<Slots slotValues={slotValues} />);

  // Check for the presence of the slot columns by checking for their icons
  const slotIcons = screen.getAllByRole('heading', { name: /🍒|🍋|🍊|🍉|✖️/ });
  expect(slotIcons.length).toBeGreaterThanOrEqual(3); // Ensure there are at least 3 icons

  // Optionally, check if slot labels are rendered
  const slotLabels = screen.getAllByRole('paragraph');
  expect(slotLabels.length).toBeGreaterThanOrEqual(3); // Ensure there are at least 3 labels
});
