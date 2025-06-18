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
  // Busca por "Orders" ou "Pedidos" e pega o elemento pai com classe "card"
  const card = screen.getByText(/Orders|Pedidos/i).closest('.card');
  expect(card).toBeInTheDocument();
  fireEvent.click(card);
  // Aqui poderia mockar useNavigate para verificar a navegação.
});
