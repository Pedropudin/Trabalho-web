import React from 'react';
import { render } from '@testing-library/react';
import ElectricEffect from '../../components/ElectricEffect';

// Mock window.Audio to guarantee that play returns a Promise
beforeAll(() => {
  window.Audio = jest.fn().mockImplementation(() => ({
    play: jest.fn().mockReturnValue(Promise.resolve()),
    pause: jest.fn(),
    volume: 1,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));
});

it('renders no particles by default', () => {
  const { container } = render(<ElectricEffect />);
  expect(container.querySelector('.efeito-eletrico')).not.toBeInTheDocument();
});

it('renders particles when triggered', () => {
  const { container, rerender } = render(<ElectricEffect trigger={{ x: 100, y: 100 }} />);
  rerender(<ElectricEffect trigger={{ x: 101, y: 101 }} />);
  expect(container.querySelector('.efeito-eletrico')).toBeInTheDocument();
});
