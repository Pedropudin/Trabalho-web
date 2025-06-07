import React from 'react';
import { render, screen } from '@testing-library/react';
import Perfil from '../Perfil';
import { MemoryRouter } from 'react-router-dom';

describe('Perfil', () => {
  beforeEach(() => {
    localStorage.setItem('nomeUsuario', 'Maria');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('exibe o nome do usuário salvo', () => {
    render(
      <MemoryRouter>
        <Perfil />
      </MemoryRouter>
    );

    // Verifica se o nome está no elemento com data-testid
    expect(screen.getByTestId('nome-usuario')).toHaveTextContent('Maria');

    // Verifica se a saudação "Olá," aparece
    expect(screen.getByText('Olá,')).toBeInTheDocument();

    // Verifica se o nome do usuário também aparece como texto
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});