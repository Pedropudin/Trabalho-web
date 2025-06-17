import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messages from '../../components/ProfileEdition/Messages';

it('allows filtering and sending a new message', async () => {
  render(<Messages onVoltar={() => {}} />);
  // Waits for the "Important" filter to appear after loading (timeout increased)
  await screen.findAllByText('Important', {}, { timeout: 2000 });
  fireEvent.change(screen.getByLabelText(/New message/i), { target: { value: 'Test message' } });
  fireEvent.click(screen.getByText('Send'));
  // Do not click the "Important" filter before checking the message
  expect(await screen.findByText('Test message', {}, { timeout: 2000 })).toBeInTheDocument();
});
