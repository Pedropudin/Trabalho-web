import React from "react";
import '../styles/Sidebar.css'
import { Link } from "react-router-dom";
import ROUTES from "../routes";

/*
  Sidebar for the Search and Sector page
  - Contains categories and filters for price and brand
*/

// Receives page data as a parameter, since we depend on what was rendered to define filter characteristics
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
    // Gets the lowest and highest price of the items available on that page
    const priceRange = () => {
        if (!items.length) return [0, 0];
        const prices = items.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return [minPrice, maxPrice];
    };

    const [minAvailable, maxAvailable] = priceRange();

    // Brand filtering
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
            <h4 className="product-category">Related Categories</h4>
               
            <ul>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","peripherals")}>Peripherals</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","hardware")}>Hardware</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","cellphones")}>Cell Phones</Link></li>
                <li><Link to={ROUTES.PAG_SETOR.replace(":name","computers")}>Computers</Link></li>
            </ul>
            
            <h4 className="filters">Filters</h4>
            <div className="filter-titles-row">
                <span className="filter-title">Price</span>
            </div>
            <div>
                <div className="price-filter">
                    <div>
                        <label htmlFor="min-price">
                            <span>Minimum</span>
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
                            <span>Maximum</span>
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
                <span className="filter-title">Brand</span>
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
