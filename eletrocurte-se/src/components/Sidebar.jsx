import React from "react";
import '../styles/Sidebar.css'
import { Link } from "react-router-dom";
import ROUTES from "../routes";

/*
  Sidebar for Search and Sector screens
  - Contains sectors and price/brand filters
*/

// Receives page data as parameter, since we depend on what was rendered to define filter characteristics
export default function Sidebar({
    items = [],
    selectedBrands = [],
    setSelectedBrands,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    brands 
}) {
    // Gets the lowest and highest price of the available items on that page
    const priceRange = () => {
        if (!items.length) return [0, 0];
        const prices = items.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return [minPrice, maxPrice];
    };

    const [minAvailable, maxAvailable] = priceRange();

    // Brand filter application
    const handleBrandChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedBrands([...selectedBrands, value]);
        } else {
            setSelectedBrands(selectedBrands.filter(b => b !== value));
        }
    };
    return (
        <div className="product-sidebar">
            <h4 className="product-category">Categorias Relacionadas</h4>
               
            <ul>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","Perifericos")}>Perifericos</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","Hardware")}>Hardware</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","Celulares")}>Celulares</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","Computadores")}>Computadores</Link></li>
            </ul>
            
            <h4 className="filters">Filtros</h4>
            <div className="filter-titles-row">
                <span className="filter-title">Preço</span>
            </div>
            <div>
                <div className="price-filter">
                    <div>
                        <label htmlFor="min-price">
                            <span>Mínimo</span>
                            <input
                                type="number"
                                id="min-price"
                                value={minPrice}
                                min={minAvailable}
                                max={maxAvailable}
                                placeholder={minAvailable}
                                onChange={e => setMinPrice(e.target.value)}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="max-price">
                            <span>Máximo</span>
                            <input
                                type="number"
                                id="max-price"
                                value={maxPrice}
                                min={minAvailable}
                                max={maxAvailable}
                                placeholder={maxAvailable}
                                onChange={e => setMaxPrice(e.target.value)}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div>
            <div className="filter-titles-row">
                <span className="filter-title">Marca</span>
            </div>
                {brands.map(brand => (
                    <label className="brand-filter" htmlFor={brand.id} key={brand.id}>
                        <input
                            type="checkbox"
                            id={brand.id}
                            value={brand.id}
                            checked={selectedBrands.includes(brand.id)}
                            onChange={handleBrandChange}
                        />
                        <span>{brand.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}
