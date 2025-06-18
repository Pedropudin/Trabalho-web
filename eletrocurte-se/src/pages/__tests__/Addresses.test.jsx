import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Addresses from '../../components/ProfileEdition/Address/Addresses';

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('userId', 'test-user');
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  );
});

it('renders addresses and allows selecting', () => {
  render(<Addresses onVoltar={() => {}} />);
  expect(screen.getByText(/Delivery Addresses/i)).toBeInTheDocument();
  expect(screen.getByText(/Choose the delivery address/i)).toBeInTheDocument();
});

it('opens modal to add new address', async () => {
  render(<Addresses onVoltar={() => {}} />);
  fireEvent.click(screen.getByText(/Add New Address/i));
  const modals = await screen.findAllByText(/New Address/i);
  expect(modals.length).toBeGreaterThan(0);
});

it('calls onVoltar when clicking Confirm and Back to Profile', () => {
  const onVoltar = jest.fn();
  render(<Addresses onVoltar={onVoltar} />);
  fireEvent.click(screen.getByText(/Confirm and Back to Profile/i));
  expect(onVoltar).toHaveBeenCalled();
});
