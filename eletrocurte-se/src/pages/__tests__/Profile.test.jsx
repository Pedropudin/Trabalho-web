import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../Profile';
import { MemoryRouter } from 'react-router-dom';

describe('Profile', () => {
  beforeEach(() => {
    localStorage.setItem('nomeUsuario', 'Maria');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('exibe o nome do usuário salvo', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Verifica se o nome está no elemento com data-testid
    expect(screen.getByTestId('nome-usuario')).toHaveTextContent('Maria');

    // Verifica se a saudação "Hello," aparece
    expect(screen.getByText(/Hello,/i)).toBeInTheDocument();

    // Verifica se o nome do usuário também aparece como texto
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});