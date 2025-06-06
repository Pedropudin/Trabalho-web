import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Carteira from '../../components/EditarPerfil/Carteira/Carteira';

it('exibe cartões cadastrados e permite abrir modal para adicionar saldo', () => {
  render(<Carteira onVoltar={() => {}} />);
  expect(screen.getByText(/Cartões cadastrados/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Adicionar saldo/i));
  // Busca o título do modal pelo papel de heading e nome "Carteira"
  expect(screen.getByRole('heading', { name: /Carteira/i })).toBeInTheDocument();
});

