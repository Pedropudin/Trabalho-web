import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Wallet from '../../components/ProfileEdition/Card/Wallet';

it('displays registered cards and allows opening modal to add balance', () => {
  render(<Wallet onVoltar={() => {}} />);
  expect(screen.getByText(/Registered cards:/i)).toBeInTheDocument();
  fireEvent.click(screen.getByText(/Add Balance/i));
  // Busca pelo título do modal "Wallet"
  expect(screen.getByRole('heading', { name: /Wallet/i })).toBeInTheDocument();
});