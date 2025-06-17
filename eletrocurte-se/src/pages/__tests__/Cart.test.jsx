import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../components/Cart';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  // Mock localStorage for the cart
  localStorage.setItem('cart', JSON.stringify([
    { id: 1, quantity: 2 }
  ]));
  // Global fetch mock to return the expected product
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'Test Product', price: 100, inStock: 10, img: '' }
      ])
    })
  );
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

it('displays products in the cart and allows increasing quantity', async () => {
  render(
    <MemoryRouter>
      <Cart onNext={() => {}} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Test Product')).toBeInTheDocument();
  const plusBtn = screen.getAllByText('+')[0];
  fireEvent.click(plusBtn);
  // Busca pelo span de quantidade (classe 'product-qty')
  expect(screen.getByText((content, el) => el.className === 'product-qty' && content.includes('3'))).toBeInTheDocument();
});
