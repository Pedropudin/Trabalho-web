import '../styles/PaginaPesquisa.css';
import React, { useState, useEffect } from 'react';
import {useParams } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ScrollToTop from '../components/ScrollToTop';
import ProductDisplay from '../components/ProductDisplay'; 

/*
  Página de pesquisa do portal Eletrocurte-se.
  - Display de todos os produtos em ordem aleatória quando acessado como "/PaginaPesquisa"
  - Display de produtos que contenham aquilo que foi colocado na URL ou pesquisado atráves da barra de pesquisa.
  - Possui as funcionalidades de filtro por marca e preço, além da ordenação ascendente/decrescente ente A-Z e preço. 
*/

function PaginaPesquisa() {
    //Variáveis de estado
    const { name } = useParams();  //Faz a identificação do nome da url  
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [produtosLocais, setProdutosLocais] = React.useState([]);
    //Lê dados dos produtos diretamento do JSON
    useEffect(() => {
        // Busca sempre do backend para garantir consistência
        fetch(process.env.REACT_APP_API_URL + '/produtos')
            .then(res => res.json())
            .then(data => setProdutosLocais(data))
            .catch(() => setProdutosLocais([]));
    }, []);
    //Lida com as marcas dos produtos
    const marcasLocais = [...new Set(produtosLocais.map(p => p.marca.toLowerCase()))]
    .map(marca => ({ id: marca, label: marca.charAt(0).toUpperCase() + marca.slice(1) }));

    //Lida com a mudança de ordem dos produtos 
    function handleOrderChange(e) {
        setOrder(e.target.value);
    }
    //Utilização do useMemo para organizar, sempre que alterada, a nova ordem de nossos produtos
    const orderedProducts = React.useMemo(() => {
        const produtosOrdenados = [...produtosLocais].sort((a, b) => {
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
        return produtosOrdenados;
    }, [order, produtosLocais]);

    const filteredProducts = orderedProducts.filter(product => {
        const matchesName = !name || product.name.toLowerCase().includes(name.toLowerCase());
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.marca.toLowerCase());
        const matchesMin = minPrice === '' || product.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax && matchesName;
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
                        <h4>Resultados para "{!name ? "Geral" : name}"</h4>
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
