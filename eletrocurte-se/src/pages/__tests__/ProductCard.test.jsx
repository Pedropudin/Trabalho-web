import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../../components/Products/ProductCard';

const product = {
  id: 1,
  name: 'Test Product',
  price: 100,
  inStock: 5,
  image: '',
  brand: 'BrandX',
  model: 'ModelY',
  color: 'Red',
  voltage: '110V',
  warranty: '1 year',
  reviews: []
};

it('renders product name and price', () => {
  render(<ProductCard product={product} />);
  expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
  expect(screen.getByText(/R\$ 100,00/i)).toBeInTheDocument();
});

it('calls onClick when clicked', () => {
  const onClick = jest.fn();
  render(<ProductCard product={product} onClick={onClick} />);
  fireEvent.click(screen.getByText(/Test Product/i));
  expect(onClick).toHaveBeenCalled();
});
