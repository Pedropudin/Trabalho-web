import React from "react";
import '../styles/Sidebar.css'

export default function Sidebar({ items = [] }) {
    const priceRange = () => {
        if (!items.length) return [0, 0];
        const prices = items.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        return [minPrice, maxPrice];
    };

    return (
        <div className="product-sidebar">
            <h4 className="product-category">Categorias Relacionadas</h4>
            <ul>
                <li><a href="../../Page-Products/pagina_de_setor/index.html">Hardware</a></li>
                <li><a href="#">Periféricos</a></li>
                <li><a href="#">Celulares</a></li>
                <li><a href="#">Notebooks</a></li>
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
                                defaultValue={priceRange()[0]}
                                min={priceRange()[0]}
                                max={priceRange()[1]}
                            />
                        </label>
                    </div>
                    <div>
                        <label htmlFor="max-price">
                            <span>Máximo</span>
                            <input
                                type="number"
                                id="max-price"
                                defaultValue={priceRange()[1]}
                                min={priceRange()[0]}
                                max={priceRange()[1]}
                            />
                        </label>
                    </div>
                </div>
            </div>
            <div>
            <div className="filter-titles-row">
                <span className="filter-title">Marca</span>
            </div>
                <label className="brand-filter" htmlFor="hyperx">
                    <input type="checkbox" id="hyperx" value="hyperx" name="marca" />
                    <span>HyperX</span>
                </label>
                <label className="brand-filter" htmlFor="razer">
                    <input type="checkbox" id="razer" value="razer" name="marca" />
                    <span>Razer</span>
                </label>
                <label className="brand-filter" htmlFor="corsair">
                    <input type="checkbox" id="corsair" value="corsair" name="marca" />
                    <span>Corsair</span>
                </label>
                <label className="brand-filter" htmlFor="steelseries">
                    <input type="checkbox" id="steelseries" value="steelseries" name="marca" />
                    <span>Steelseries</span>
                </label>
            </div>
        </div>
    );
}
