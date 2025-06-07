import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Question from '../../components/Pendencias/Question';

const mockData = {
  product_photo: '',
  product_name: 'Produto Teste',
  date: '01/01/2025',
  question: 'Qual o prazo de entrega?',
  person_name: 'Cliente',
  person_photo: ''
};

it('permite abrir resposta e enviar', () => {
  render(<Question data={mockData} answer="" onAnswerChange={() => {}} />);
  fireEvent.click(screen.getByText(/Responder/i));
  expect(screen.getByText(/Sua resposta:/i)).toBeInTheDocument();
});
