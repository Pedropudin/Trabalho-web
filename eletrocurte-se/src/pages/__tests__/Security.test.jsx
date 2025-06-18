import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Security from '../../components/ProfileEdition/Security';

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

it('renders security form and validates fields', async () => {
  render(<Security onBack={() => {}} />);
  await screen.findByLabelText(/Email/i);
  expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
  fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: '123.456.789-00' } });
  fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '(11) 91234-5678' } });
  fireEvent.click(screen.getByText(/Save Changes/i));
  expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
});

it('calls onBack when clicking Back to Profile', async () => {
  const onBack = jest.fn();
  render(<Security onBack={onBack} />);
  await screen.findByLabelText(/Email/i);
  fireEvent.click(screen.getByText(/Back to Profile/i));
  expect(onBack).toHaveBeenCalled();
});