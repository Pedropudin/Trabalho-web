import React from 'react';
import { render, screen } from '@testing-library/react';
import CartOverview from '../../components/CartOverview';

beforeEach(() => {
  localStorage.setItem('cart', JSON.stringify([{ id: 1, quantity: 2 }]));
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'Test Product', price: 50, inStock: 10, img: '', image: '' }
      ])
    })
  );
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

it('renders cart summary and product', async () => {
  render(<CartOverview />);
  expect(await screen.findByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText(/Total items:/i)).toBeInTheDocument();
});
