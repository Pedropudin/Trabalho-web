import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Mensagens from '../../components/EditarPerfil/Mensagens';

it('permite filtrar e enviar nova mensagem', async () => {
  render(<Mensagens onVoltar={() => {}} />);
  // Aguarda o filtro "Importantes" aparecer após o carregamento (timeout aumentado)
  expect(await screen.findByText('Importantes', {}, { timeout: 2000 })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/nova mensagem/i), { target: { value: 'Teste mensagem' } });
  fireEvent.click(screen.getByText('Enviar'));
  expect(await screen.findByText('Teste mensagem', {}, { timeout: 2000 })).toBeInTheDocument();
});
