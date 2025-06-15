import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from '../../components/Sidebar';
import { MemoryRouter } from 'react-router-dom';

it('permite selecionar filtro de marca', () => {
  const brands = [{ id: 'marca1', label: 'Marca1' }];
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
  fireEvent.click(screen.getByLabelText('Marca1'));
  expect(setSelectedBrands).toHaveBeenCalled();
});
