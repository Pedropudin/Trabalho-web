import '../styles/PaginaPesquisa.css';
import React, { useState } from 'react';
import Products from '../Products.json'; 
import { navigate, useNavigate } from "react-router-dom";
import ROUTES from '../routes';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import ProductDisplay from '../components/ProductDisplay'; 


function PaginaPesquisa({searchName = "HyperX Cloud II"}) {
    //Variáveis de estado
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    
    //Confere se existe algum item no localStorage, caso não exista, cria um 
    const produtosLocais = JSON.parse(localStorage.getItem("products")) || Products;
    const marcasLocais = [...new Set(produtosLocais.map(p => p.marca.toLowerCase()))]
    .map(marca => ({ id: marca, label: marca.charAt(0).toUpperCase() + marca.slice(1) }));

    //Lida com a mudança de ordem dos produtos 
    function handleOrderChange(e) {
        setOrder(e.target.value);
    }
    //Utilização do useMemo para organizar, sempre que alterada, a nova ordem de nossos produtos
    const orderedProducts = React.useMemo(() => {
        produtosLocais.sort((a, b) => {
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
        return produtosLocais;
    }, [order]);

    // Filtra produtos pela marca selecionada
    const filteredProducts = orderedProducts.filter(Products => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(Products.marca.toLowerCase());
        const matchesMin = minPrice === '' || Products.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || Products.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax;
    });

    return(
        <>
            <Header/>
            <div className="main-content">
                <Sidebar
                    items={produtosLocais}
                    brands = {marcasLocais}
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
                        {filteredProducts.length === 0 ? (
                            <p style={{ margin: "40px auto", fontWeight: "bold" }}>Nenhum produto encontrado.</p>
                        ) : (
                            filteredProducts.map(produtos => (
                                <ProductDisplay key={produtos.id} product={produtos} />
                            ))
                        )}
                    </nav>
                </div>
            </div>
            <ScrollToTop/>
            <Footer/>
        </>    
    );
}

export default PaginaPesquisa;