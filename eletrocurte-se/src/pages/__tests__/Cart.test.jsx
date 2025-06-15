import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from '../../components/Cart';
import { MemoryRouter } from 'react-router-dom';

beforeEach(() => {
  // Mock do localStorage para o carrinho
  localStorage.setItem('cart', JSON.stringify([
    { id: 1, quantity: 2 }
  ]));
  // Mock global do fetch para retornar o produto esperado
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, name: 'Produto Teste', price: 100, inStock: 10, img: '' }
      ])
    })
  );
});

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

it('exibe produtos no carrinho e permite aumentar quantidade', async () => {
  render(
    <MemoryRouter>
      <Cart onNext={() => {}} />
    </MemoryRouter>
  );
  expect(await screen.findByText('Produto Teste')).toBeInTheDocument();
  const plusBtn = screen.getAllByText('+')[0];
  fireEvent.click(plusBtn);
  // Busca o span de quantidade do produto (evita ambiguidade)
  expect(screen.getByText((content, el) => el.className === 'product-qty' && content.includes('3'))).toBeInTheDocument();
});
