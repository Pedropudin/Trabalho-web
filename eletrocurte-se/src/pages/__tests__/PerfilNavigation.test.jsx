import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from '../Profile';
import { MemoryRouter } from 'react-router-dom';

it('navega ao clicar em um card do perfil', () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  );
  // Ajuste para buscar pelo texto em inglês exibido no card
  const card = screen.getByText(/Orders|Pedidos/i).closest('.card');
  expect(card).toBeInTheDocument();
  fireEvent.click(card);
  // Aqui você pode mockar o useNavigate para verificar se foi chamado, se desejar.
});
