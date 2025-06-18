import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../../components/Header';
import { MemoryRouter } from 'react-router-dom';

it('renders logo and search bar', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

it('calls onProfile when profile icon is clicked', () => {
  const onProfile = jest.fn();
  render(
    <MemoryRouter>
      <Header onProfile={onProfile} />
    </MemoryRouter>
  );
  const profileBtn = screen.getAllByRole('button').find(btn =>
    btn.querySelector('svg')
  );
  fireEvent.click(profileBtn);
  expect(onProfile).toHaveBeenCalled();
});
