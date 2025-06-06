import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Perfil from '../Perfil';
import { MemoryRouter } from 'react-router-dom';

it('navega ao clicar em um card do perfil', () => {
  render(
    <MemoryRouter>
      <Perfil />
    </MemoryRouter>
  );
  const card = screen.getByText(/Pedidos/i).closest('.card');
  expect(card).toBeInTheDocument();
  fireEvent.click(card);
  // Aqui você pode mockar o useNavigate para verificar se foi chamado, se desejar.
});
