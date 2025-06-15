import "../styles/SectorPage.css";
import AdminHeader from "../components/admin/AdminHeader";
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from "../components/Sidebar";
import ScrollToTop from "../components/ScrollToTop";
import ProductDisplay from "../components/ProductDisplay";
import { useParams } from "react-router-dom";
import React, { useState,useEffect } from 'react';

/*
  Eletrocurte-se sector page.
  - Displays all products separated by sector when accessed as "/PaginaSetor"
  - Displays all products belonging to a general category, such as Hardware or Peripherals.
  - To reach this page, you need to change the URL '/PaginaSetor/SectorName' or just interact with the buttons and clickable elements of the interface.
  - Has brand and price filter functionalities, as well as ascending/descending sorting by A-Z and price.
*/

const categoryIndexRel = {
    "hardware": 0,
    "peripherals": 1,
    "computers": 2,
    "cellphones": 3,
};

export default function SectorPage() {
    const { name } = useParams(); 
    const [order, setOrder] = useState("");
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [productsLocal, setProductsLocal] = React.useState([]);
    const [categoryIndex, setCategoryIndex] = useState(0);
    
    // Reads product data directly from database
    useEffect(() => {
        // Busca sempre do backend para garantir consistência
        fetch(process.env.REACT_APP_API_URL + '/api/products')
            .then(res => res.json())
            .then(data => setProductsLocal(data))
            .catch(() => setProductsLocal([])); 
    }, []);

    const brandsLocal = [...new Set(productsLocal.map(p => p.brand?.toLowerCase()))]
        .map(brand => ({ id: brand, label: brand?.charAt(0).toUpperCase() + brand?.slice(1) }));

    // Function to ignore accents, used to handle the access origin
    const normalize = (str) =>
        str?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const sectorProducts = name
        ? productsLocal.filter((p) => normalize(p.generalSector) === normalize(name))
        : productsLocal;
    
    // Product sorting based on the chosen order
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

    // Brand and price filters
    const filteredProducts = orderedProducts.filter(product => {
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand?.toLowerCase());
        const matchesMin = minPrice === '' || product.price >= Number(minPrice);
        const matchesMax = maxPrice === '' || product.price <= Number(maxPrice);
        return matchesBrand && matchesMin && matchesMax;
    });

    const specificSectors = Array.from(
        new Set(filteredProducts.map((p) => p.specificSector))
    );

    return (
        <>
            {console.log(categoryIndex)}
            {localStorage.userType === "admin" 
                ? <AdminHeader categoryIndex={categoryIndex} /> 
                : <Header />}
            <div className="main-content">
                <Sidebar
                    items={sectorProducts}
                    brands={brandsLocal}
                    selectedBrands={selectedBrands}
                    setSelectedBrands={setSelectedBrands}
                    minPrice={minPrice}
                    setMinPrice={setMinPrice}
                    maxPrice={maxPrice}
                    setMaxPrice={setMaxPrice}
                />
                <div className="results">
                    <div className="results-header-row">
                        <h4>Results for "{!name ? "General" : name}"</h4>
                        <select
                            id="order-criteria"
                            value={order}
                            onChange={e => setOrder(e.target.value)}
                            className="order-criterion"
                        >
                            <option value="alphabetical-asc">Name A-Z</option>
                            <option value="alphabetical-desc">Name Z-A</option>
                            <option value="high-price">Highest Price</option>
                            <option value="low-price">Lowest Price</option>
                        </select>
                    </div>
                    <div className="sector-display">
                        {specificSectors.length === 0 ? (
                            <p style={{ margin: "40px auto", fontWeight: "bold" }}>No products found.</p>
                        ) : (
                            specificSectors.map((sector) => {
                                const productsSector = filteredProducts.filter(
                                    (p) => p.specificSector === sector
                                );
                                if (productsSector.length === 0) return null;
                                return (
                                    <section key={sector}>
                                        <h2 className="sector-name">{sector}</h2>
                                        <div className="product-display">
                                            {productsSector.map(product => (
                                                <ProductDisplay key={product.id} product={product}/>
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
