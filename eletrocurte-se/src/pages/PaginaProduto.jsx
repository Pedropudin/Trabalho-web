import '../styles/PaginaPesquisa.css';
import React, { useState } from 'react';
import Products from '../Products'; 
import { navigate, useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';


function PaginaPesquisa({searchName = "HyperX Cloud II"}) {
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    let navigate = useNavigate();

    function handleOrderChange(e) {
        setOrder(e.target.value);
    }

    const orderedProducts = React.useMemo(() => {
        let products = [...Products];
        products.sort((a, b) => {
            if (a.inStock > 0  && b.inStock === 0) return -1; 
            if (a.inStock === 0  && b.inStock > 0) return 1; 
            if (order === "alphabetical-asc") {
                return a.name.localeCompare(b.name);
            } else if (order === "alphabetical-desc") {
                return b.name.localeCompare(a.name);
            } else if (order === "low-price") {
                return a.price - b.price;
            } else if (order === "high-price") {
                return b.price - a.price;
            }
            return 0;
        });
        return products;
    }, [order]);

    // Filtra produtos pela marca selecionada
    const filteredProducts = orderedProducts.filter(Products => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(Products.marca);
        const matchesMin = minPrice === '' || Products.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || Products.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax;
    });

    const displayProducts = filteredProducts.length > 0 ? (
        filteredProducts.map((Products) => (
            <div key={Products.id} className="items">
                <img className="item-image"
                    src={Products.img}
                    alt={"Imagem do " + Products.name}
                    style={!Products.inStock > 0 ? { filter: "grayscale(100%)" } : {}}
                />
                <p className="item-name">{Products.name}</p><br />
                <p className="item-price">{Products.inStock > 0 ? "R$" + Products.price.toFixed(2) : ""}</p>
                {Products.inStock > 0 ? (
                    <button className="product-display-purchase-button" onClick={() => navigate(`/pages/PaginaProduto/${Products.id}`)}>Comprar</button>
                ) : (
                    <p className="product-unavailable"><strong>Produto Indisponível</strong></p>
                )}
            </div>
        ))
    ) : (
        <p style={{ margin: "40px auto", fontWeight: "bold" }}>Nenhum produto encontrado.</p>
    );

    return(
        <>
            <Header/>
            <div className="main-content">
                <Sidebar
                    items={Products}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
                <div className="results">
                    <div className="results-header-row">
                        <h4>Resultados para "{searchName}"</h4>
                        <select
                            id="order-criteria"
                            value={order}
                            onChange={handleOrderChange}
                            className="order-criterion"
                        >
                            <option value="alphabetical-asc">Nome A-Z</option>
                            <option value="alphabetical-desc">Nome Z-A</option>
                            <option value="high-price">Maior Preço</option>
                            <option value="low-price">Menor Preço</option>
                        </select>
                    </div>
                    <nav className="product-display">
                        {displayProducts}
                    </nav>
                </div>
            </div>
            <ScrollToTop/>
            <Footer/>
        </>    
    );
}

export default PaginaPesquisa;
