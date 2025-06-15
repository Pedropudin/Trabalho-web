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

it('aplica máscara de CPF e valida data de nascimento', () => {
  render(
    <MemoryRouter>
      <PersonalDetails onNext={() => {}} steps={['A', 'B']} />
    </MemoryRouter>
  );
  const cpfInput = screen.getByPlaceholderText('CPF');
  fireEvent.change(cpfInput, { target: { value: '12345678901' } });
  expect(cpfInput.value).toBe('123.456.789-01');
  const nascimentoInput = screen.getByPlaceholderText('Birth date');
  fireEvent.change(nascimentoInput, { target: { value: '01012000' } });
  expect(nascimentoInput.value).toBe('01/01/2000');
});
