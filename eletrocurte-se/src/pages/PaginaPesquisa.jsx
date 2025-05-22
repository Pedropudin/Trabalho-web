import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import ROUTES from '../routes';
import '../styles/PaginaPesquisa.css';

function PaginaPesquisa({searchName = "HyperX Cloud II"}) {
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sortedProducts, setSortedProducts] = useState([
        { id: 1, name: "cyperX Cloud II", marca:"hyperx", price: 111.0, available: true, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
        { id: 2, name: "byperX Cloud II", marca:"hyperx", price: 231.0, available: false, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
        { id: 3, name: "ayperX Cloud II", marca:"hyperx", price: 41.0, available: true, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
        { id: 4, name: "Mouse Razer", marca:"razer", price: 150.0, available: true, img: "https://m.media-amazon.com/images/I/71++S+DNJ+L._AC_UF1000,1000_QL80_.jpg" },
    ]);


    function handleOrderChange(e) {
        setOrder(e.target.value);
    }

    // Always sort products by available first, then by selected order
    const orderedProducts = React.useMemo(() => {
        let products = [...sortedProducts];
        products.sort((a, b) => {
            if (a.available === b.available) {
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
            }
            return a.available ? -1 : 1;
        });
        return products;
    }, [sortedProducts, order]);

    // Filtra produtos pela marca selecionada
    const filteredProducts = orderedProducts.filter(product => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.marca);
        const matchesMin = minPrice === '' || product.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax;
    });

    const displayProducts = filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
            <div key={product.id} className="items">
                <img className="item-image"
                    src={product.img}
                    alt={"Imagem do " + product.name}
                    style={!product.available ? { filter: "grayscale(100%)" } : {}}
                />
                <p className="item-name">{product.name}</p><br />
                <p className="item-price">{product.available ? "R$" + product.price.toFixed(2) : ""}</p>
                {product.available ? (
                    <button className="product-display-purchase-button">Comprar</button>
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
                    items={sortedProducts}
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
            <Footer/>
        </>    
    );
}

export default PaginaPesquisa;
