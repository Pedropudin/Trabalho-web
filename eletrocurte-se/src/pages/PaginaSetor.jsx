import "../styles/PaginaSetor.css";
import Products from '../Products'; 
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";
import ScrollToTop from "../components/ScrollToTop";
import ProductCard from "../components/ProductCard";
import { useParams, useNavigate } from "react-router-dom";
import React, { useState } from 'react';

export default function PaginaSetor() {
    const { name } = useParams(); // name será o setor da URL, ex: "Periférico"
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    //Função para retirada de caracteres especiais, como acentos 
    const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    //Obtém a origem do "clique"
    const sectorProducts = Products.filter(
        (p) => normalize(p.setorGeral) === normalize(name)
    );

    // Ordenação
    const orderedProducts = React.useMemo(() => {
        let products = [...sectorProducts];
        products.sort((a, b) => {
            if (a.inStock > 0 && b.inStock === 0) return -1;
            if (a.inStock === 0 && b.inStock > 0) return 1;
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
    }, [order, sectorProducts]);

    // Filtros de marca e preço
    const filteredProducts = orderedProducts.filter(product => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.marca);
        const matchesMin = minPrice === '' || product.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax;
    });

    // Agrupa por setorEspecifico
    const setoresEspecificos = Array.from(
        new Set(filteredProducts.map((p) => p.setorEspecifico))
    );

    return (
        <>
            <Header />
            <div className="main-content">
                <Sidebar
                    items={sectorProducts}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
                <div className="results">
                    <div className="results-header-row">
                        <h4>Resultados para "{name}"</h4>
                        <select
                            id="order-criteria"
                            value={order}
                            onChange={e => setOrder(e.target.value)}
                            className="order-criterion"
                        >
                            <option value="alphabetical-asc">Nome A-Z</option>
                            <option value="alphabetical-desc">Nome Z-A</option>
                            <option value="high-price">Maior Preço</option>
                            <option value="low-price">Menor Preço</option>
                        </select>
                    </div>
                    <div className="sector-display">
                        {setoresEspecificos.length === 0 ? (
                            <p style={{ margin: "40px auto", fontWeight: "bold" }}>Nenhum produto encontrado.</p>
                        ) : (
                            setoresEspecificos.map((setorEsp) => {
                                const produtosSetorEsp = filteredProducts.filter(
                                    (p) => p.setorEspecifico === setorEsp
                                );
                                if (produtosSetorEsp.length === 0) return null;
                                return (
                                    <section key={setorEsp}>
                                        <h2 className="sector-name">{setorEsp}</h2>
                                        <div className="product-display">
                                            {produtosSetorEsp.map(product => (
                                                <ProductCard key={product.id} product={product}/>
                                            ))}
                                        </div>
                                    </section>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
            <ScrollToTop />
            <Footer />
        </>
    );
}