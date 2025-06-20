import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Question from '../../components/Pendencies/Question';
import { MemoryRouter } from 'react-router-dom';

const mockData = {
  product_photo: '',
  product_name: 'Test Product',
  date: '01/01/2025',
  question: 'What is the delivery time?',
  person_name: 'Customer',
  person_photo: ''
};

it('allows opening answer and sending it', () => {
  const { container } = render(
    <MemoryRouter>
      <Question data={mockData} answer="" onAnswerChange={() => {}} />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/Answer/i));
  expect(screen.getByText(/Your Answer:/i)).toBeInTheDocument();
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
