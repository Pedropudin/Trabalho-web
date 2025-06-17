import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messages from '../../components/ProfileEdition/Messages';

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

it('renders admin messages and filter buttons', async () => {
  render(<Messages onVoltar={() => {}} />);
  // Aguarda explicitamente o botão "All" aparecer
  await screen.findByRole('button', { name: /All/i });
  expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Important/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Unread/i })).toBeInTheDocument();
});

it('allows sending a new message', async () => {
  render(<Messages onVoltar={() => {}} />);
  await screen.findByRole('button', { name: /All/i });
  const input = await screen.findByLabelText(/New message/i);
  fireEvent.change(input, { target: { value: 'Test message' } });
  fireEvent.click(screen.getByText(/Send/i));
  await screen.findByText(/Message sent/i);
});

it('calls onVoltar when clicking Back to Profile', async () => {
  const onVoltar = jest.fn();
  render(<Messages onVoltar={onVoltar} />);
  await screen.findByRole('button', { name: /All/i });
  fireEvent.click(screen.getByText(/Back to Profile/i));
  expect(onVoltar).toHaveBeenCalled();
});

it('allows filtering and sending a new message', async () => {
  render(<Messages onVoltar={() => {}} />);
  await screen.findByRole('button', { name: /Important/i });
  fireEvent.click(screen.getByRole('button', { name: /Important/i }));
  const input = await screen.findByLabelText(/New message/i);
  fireEvent.change(input, { target: { value: 'Test message' } });
  fireEvent.click(screen.getByText(/Send/i));
  expect(await screen.findByText('Test message')).toBeInTheDocument();
});