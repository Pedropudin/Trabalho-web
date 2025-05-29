import React from "react";
import '../styles/Sidebar.css'
import { Link } from "react-router-dom";
import ROUTES from "../routes";

//Recebe dados da página como parâmetro, já que dependemos daquilo que foi renderizado para deifnir características de filtro
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
    //Pega o menor e maior valor dos itens disponíveis naquela página
    const priceRange = () => {
        if (!items.length) return [0, 0];
        const prices = items.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return [minPrice, maxPrice];
    };

    const [minAvailable, maxAvailable] = priceRange();

    //Aplicação da filtragem de marca
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
