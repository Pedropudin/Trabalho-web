import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';
import { MemoryRouter } from 'react-router-dom';

it('allows selecting brand filter', () => {
  const brands = [{ id: 'brand1', label: 'Brand1' }];
  const setSelectedBrands = jest.fn();
  render(
    <MemoryRouter>
      <Sidebar
        items={[]}
        brands={brands}
        selectedBrands={[]}
        setSelectedBrands={setSelectedBrands}
        minPrice=""
        setMinPrice={() => {}}
        maxPrice=""
        setMaxPrice={() => {}}
      />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByLabelText('Brand1'));
  expect(setSelectedBrands).toHaveBeenCalled();
});
