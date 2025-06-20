import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/Button';

it('renders with default text and handles click', () => {
  const onClick = jest.fn();
  render(<Button onClick={onClick} />);
  const btn = screen.getByRole('button');
  expect(btn).toHaveTextContent(/Botão/i);
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalled();
});

it('renders with type 1 style', () => {
  render(<Button type={1} text="Special" />);
  expect(screen.getByText('Special')).toBeInTheDocument();
});
