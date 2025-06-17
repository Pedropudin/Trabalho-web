import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../../components/Card';

it('renders title, description, and children', () => {
  render(
    <Card title="Test Card" description="Card description">
      <div>Child content</div>
    </Card>
  );
  expect(screen.getByText('Test Card')).toBeInTheDocument();
  expect(screen.getByText('Card description')).toBeInTheDocument();
  expect(screen.getByText('Child content')).toBeInTheDocument();
});

it('renders only title and description when no children are passed', () => {
  render(<Card title="Test Card" description="Card description" />);
  expect(screen.getByText('Test Card')).toBeInTheDocument();
  expect(screen.getByText('Card description')).toBeInTheDocument();
  expect(screen.queryByText('Child content')).not.toBeInTheDocument();
});
