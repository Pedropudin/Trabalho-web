import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';
import { MemoryRouter } from 'react-router-dom';

it('renders contact info and terms link', () => {
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );
  expect(screen.getByText(/contact@eletrocurte-se.com/i)).toBeInTheDocument();
  expect(screen.getByText(/Terms and Conditions/i)).toBeInTheDocument();
  expect(screen.getByText(/1234 Nations Avenue/i)).toBeInTheDocument();
});
