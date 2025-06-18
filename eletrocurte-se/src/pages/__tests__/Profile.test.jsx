import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../Profile';
import { MemoryRouter } from 'react-router-dom';

describe('Profile', () => {
  beforeEach(() => {
    localStorage.setItem('userName', 'Maria');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('displays the saved user name', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Checks if the name is in the element with data-testid
    expect(screen.getByTestId('nome-usuario')).toHaveTextContent('Maria');

    // Checks if the greeting "Hello," appears
    expect(screen.getByText(/Hello,/i)).toBeInTheDocument();

    // Checks if the user name also appears as text
    expect(screen.getByText('Maria')).toBeInTheDocument();
  });
});