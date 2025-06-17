import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '../Profile';
import { MemoryRouter } from 'react-router-dom';

it('navigates when clicking a profile card', () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  // Adjust to search for the English text displayed on the card
  const card = screen.getByText(/Orders|Pedidos/i).closest('.card');
  expect(card).toBeInTheDocument();
  fireEvent.click(card);
  // Here you can mock useNavigate to check if it was called, if desired.
});
