import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../components/Cart';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  localStorage.setItem('cart', JSON.stringify([
    { id: 1, name: 'Produto Teste', price: 100, quantity: 2, image: '' }
  ]));
  localStorage.setItem('products', JSON.stringify([
    { id: 1, name: 'Produto Teste', price: 100, inStock: 10 }
  ]));
});

afterEach(() => {
  localStorage.clear();
});

it('exibe produtos no carrinho e permite aumentar quantidade', () => {
  render(
    <MemoryRouter>
      <Cart onNext={() => {}} />
    </MemoryRouter>
  );
  expect(screen.getByText('Produto Teste')).toBeInTheDocument();
  const plusBtn = screen.getAllByText('+')[0];
  fireEvent.click(plusBtn);
  // Busca o span de quantidade do produto (evita ambiguidade)
  expect(screen.getByText((content, el) => el.className === 'product-qty' && content.includes('3'))).toBeInTheDocument();
});
