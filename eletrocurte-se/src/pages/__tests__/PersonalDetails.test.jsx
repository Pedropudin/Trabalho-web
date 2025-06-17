import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PersonalDetails from '../../components/PersonalDetails';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate from react-router-dom
const mockUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate,
}));

// Mock window.matchMedia for react-hot-toast and MUI
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

it('applies CPF mask and validates birth date', () => {
  render(
    <MemoryRouter>
      <PersonalDetails onNext={() => {}} steps={['A', 'B']} />
    </MemoryRouter>
  );
  const cpfInput = screen.getByPlaceholderText('CPF');
  fireEvent.change(cpfInput, { target: { value: '12345678901' } });
  expect(cpfInput.value).toBe('123.456.789-01');
  const birthInput = screen.getByPlaceholderText('Birth date');
  fireEvent.change(birthInput, { target: { value: '01012000' } });
  expect(birthInput.value).toBe('01/01/2000');
});
