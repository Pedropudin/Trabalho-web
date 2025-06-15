import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Wallet from '../../components/ProfileEdition/Card/Wallet';

it('exibe cartões cadastrados e permite abrir modal para adicionar saldo', () => {
  render(<Wallet onVoltar={() => {}} />);
  expect(screen.getByText(/Registered cards:/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Add Balance/i));
  // Busca o título do modal pelo papel de heading e nome "Wallet"
  expect(screen.getByRole('heading', { name: /Wallet/i })).toBeInTheDocument();
});