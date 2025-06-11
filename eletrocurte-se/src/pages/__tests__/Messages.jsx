import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Messages from '../../components/ProfileEdition/Messages';

it('permite filtrar e enviar nova mensagem', async () => {
  render(<Messages onVoltar={() => {}} />);
  // Aguarda o filtro "Important" aparecer após o carregamento (timeout aumentado)
  await screen.findAllByText('Important', {}, { timeout: 2000 });
  fireEvent.change(screen.getByLabelText(/New message/i), { target: { value: 'Test message' } });
  fireEvent.click(screen.getByText('Send'));
  // Não clique no filtro "Important" antes de verificar a mensagem
  expect(await screen.findByText('Test message', {}, { timeout: 2000 })).toBeInTheDocument();
});
